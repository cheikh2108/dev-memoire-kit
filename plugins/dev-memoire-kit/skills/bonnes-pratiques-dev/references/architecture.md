# Architecture back-end : choisir, concevoir, documenter

Adapté de fiches d'architecture fournies par l'équipe (backend-architect, architecture-patterns), recadré pour des projets réels de PME, de SaaS multi-tenant et de mémoire de fin d'études.

## 0. Règle de dimensionnement (à lire en premier)

L'erreur la plus coûteuse n'est pas une architecture trop simple, c'est une architecture **trop ambitieuse pour l'équipe et l'hébergement**. Microservices, Kafka, service mesh et Kubernetes répondent à des problèmes d'équipes nombreuses et de très gros trafic. Sur un VPS ou un hébergement mutualisé, avec 1 à 5 développeurs, ils multiplient les pannes et les coûts.

| Contexte | Architecture recommandée |
|---|---|
| Mémoire de licence, MVP, CRUD + quelques règles | **Monolithe MVC** bien structuré (Laravel, NestJS, Django) |
| SaaS multi-tenant avec des règles métier qui grossissent | **Monolithe modulaire** : un module par domaine (facturation, plans d'action, utilisateurs), couche service / cas d'usage, logique métier hors des contrôleurs |
| Domaine complexe (finance, logistique, règles qui changent souvent) | Clean / hexagonale + DDD tactique **dans** le monolithe |
| Plusieurs équipes autonomes, charges très différentes par domaine, besoin de déployer séparément | Microservices + événements, **seulement** si la douleur est déjà constatée |

Pour un mémoire, dire pourquoi on n'a **pas** choisi les microservices montre plus de maturité que de les afficher sans raison.

## 1. Choisir le style d'architecture
| Complexité | Style |
|---|---|
| CRUD simple | En couches (MVC) |
| Règles métier moyennes | Clean Architecture (cas d'usage séparés du framework) |
| Domaine complexe | Hexagonale (ports et adaptateurs) + DDD |
| Système distribué | Microservices + événements |

### Clean Architecture
```
Domaine (entités, objets valeur)                 ← ne dépend de rien
Application (cas d'usage)                        ← dépend du domaine
Infrastructure (BD, API externes, framework)     ← dépend de l'application
Présentation (HTTP, CLI, interface)              ← dépend de l'application
```
Règle : les dépendances pointent **vers l'intérieur**. Le domaine ne connaît ni Laravel, ni Prisma, ni HTTP.

### Hexagonale (ports et adaptateurs)
```
[Adaptateurs primaires] → [Port entrant] → [Cœur applicatif] → [Port sortant] → [Adaptateurs secondaires]
 Contrôleur HTTP           Cas d'usage       Logique métier       Repository        Adaptateur PostgreSQL
```
Intérêt concret : changer de passerelle SMS, de prestataire de paiement (Wave ↔ Orange Money) ou de générateur PDF (Puppeteer → PDFKit) sans toucher au métier. Dans votre bibliothèque de prompts, le remplacement de Puppeteer par PDFKit aurait été un simple changement d'adaptateur.

### DDD tactique (vocabulaire)
| Concept | Définition | Exemple |
|---|---|---|
| Agrégat | Frontière de cohérence avec une seule racine | `Facture` (racine) + ses `LigneFacture` |
| Entité | Égalité par identité | `Client` (id) |
| Objet valeur | Égalité par valeur, immuable | `Montant(15000, XOF)`, `Telephone(+221…)` |
| Événement de domaine | Fait passé | `PaiementRecu`, `SeanceCloturee` |
| Repository | Interface de type collection pour les agrégats | `FactureRepository::trouverParNumero()` |

### Équivalents dans vos stacks
| Notion | Laravel | NestJS |
|---|---|---|
| Présentation | Controllers, Form Requests, Resources | Controllers, DTO + `class-validator` |
| Cas d'usage | Classes `Actions/` ou `Services/` | Services de module |
| Domaine | Modèles + objets valeur (ou classes PHP pures) | Entités / classes du domaine |
| Infrastructure | Eloquent, Jobs, clients HTTP | Prisma, clients HTTP, files de messages |
| Événements | Events + Listeners, Jobs en file | `EventEmitter2`, BullMQ |

### Migrer un code trop couplé
1. Repérer le couplage le plus douloureux (souvent : logique métier dans les contrôleurs ou les composants front).
2. Extraire la logique métier dans des fonctions ou classes pures, testables sans base.
3. Définir des interfaces (ports) pour l'infrastructure (paiement, SMS, PDF, stockage).
4. Changer d'implémentation sans toucher au domaine.
5. Documenter chaque décision dans un ADR (`../assets/modele-adr.md`).

## 2. Concevoir l'API

**Ordre de travail** : modèle de données d'abord (`base-de-donnees.md`), puis API, puis architecture, puis ADR.

| Style | Quand l'utiliser |
|---|---|
| REST | Par défaut : ressources (`/factures/{id}`), verbes HTTP, codes de statut corrects. Versionner (`/api/v1`) dès qu'il y a des clients mobiles qu'on ne met pas à jour en même temps. |
| GraphQL | Front avec des besoins de données très variables ; plus coûteux à sécuriser (profondeur, coût des requêtes). |
| gRPC | Communication interne entre services, rarement utile dans un monolithe. |
| WebSockets / SSE | Temps réel (tableau de bord en direct, notifications). SSE suffit souvent si le flux va du serveur vers le client. |
| Webhooks | Notifications asynchrones reçues de l'extérieur (Wave, Orange Money, Stripe) : **vérifier la signature**, rendre le traitement **idempotent**, répondre vite et traiter en file. |

Contrat : écrire la spécification **OpenAPI** (ou AsyncAPI pour les événements) et la garder synchronisée avec le code (génération automatique : Scribe ou l5-swagger en Laravel, `@nestjs/swagger` en NestJS).

Règles REST minimales : pagination sur toutes les listes ; format d'erreur unique (`{ code, message, details }`) ; validation à l'entrée ; idempotence des `PUT`/`DELETE` et des paiements (clé d'idempotence) ; filtrage systématique par tenant en multi-tenant.

## 3. Sécurité
- Authentification : sessions + cookies `HttpOnly` pour une application web classique ; OAuth 2.0 / OIDC pour la connexion via un fournisseur ou l'accès d'applications tierces ; jetons (Sanctum, JWT) pour mobile et API.
- **JWT** : durée courte + jeton de rafraîchissement, révocation prévue (liste de blocage ou version de jeton). Un JWT seul ne se révoque pas : ce n'est pas « mieux » qu'une session, c'est un autre compromis.
- Autorisation **RBAC** vérifiée côté serveur (Policies Laravel, Guards NestJS), plus le **filtrage par tenant** sur chaque requête.
- Service à service : mTLS seulement si plusieurs services existent réellement.
- Détails : `securite.md`.

## 4. Résilience
- **Délai d'expiration sur chaque appel externe** (SMS, paiement, API tierce). Sans délai, un prestataire lent bloque tout le serveur.
- **Nouvelle tentative** avec attente exponentielle + aléa (*jitter*), seulement pour les opérations idempotentes.
- **Coupe-circuit** (*circuit breaker*) : après N échecs, ne plus appeler pendant un temps et répondre en mode dégradé. En Node : `opossum` ; en Java : Resilience4j (Hystrix n'est plus développé depuis 2018).
- **Cloisonnement** (*bulkhead*) : files séparées pour les tâches lentes (PDF, e-mails) afin qu'elles ne bloquent pas les requêtes utilisateurs.
- **Travail en file** : tout ce qui peut attendre (notifications, rapports) passe par une file (Laravel Queues, BullMQ), avec reprise en cas d'échec.
- **Flux critiques en plusieurs étapes** (paiement puis activation d'abonnement) : enregistrer l'état de chaque étape pour reprendre après un plantage, avec une table d'état ou un moteur de workflow durable (par exemple Temporal, DBOS).

## 5. Observabilité
- **Logs structurés** en JSON avec identifiant de requête et de tenant, sans données personnelles ni secrets.
- **Métriques RED** par route : *Rate* (débit), *Errors* (erreurs), *Duration* (durée).
- **Traçage distribué** (OpenTelemetry) seulement s'il y a plusieurs services ; sinon, logs corrélés par identifiant de requête.
- Suivi des erreurs (Sentry ou équivalent) et une alerte simple (e-mail, WhatsApp) sur les erreurs 5xx et l'échec des tâches en file.

## 6. Pour le mémoire
- Justifier le style d'architecture par le **contexte** (taille de l'équipe, hébergement, budget, délais), pas par la mode.
- Schéma d'architecture logique + diagramme de déploiement (voir `../../redaction-memoire/references/uml.md` §7).
- Un ou deux ADR en annexe montrent une démarche d'ingénieur : décision, options écartées, conséquences.
