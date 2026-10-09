# Sécurité : application web, API et mobile

Références : **OWASP Top 10:2025** (risques les plus fréquents) et **OWASP ASVS 5.0** (liste de vérification détaillée). Le jury pose presque toujours une question de sécurité, et un client peut perdre son activité sur une seule faille : il faut pouvoir montrer **où dans le code** chaque mesure est appliquée. Sources en fin de fichier (consultées le 08/10/2026).

---

## 1. OWASP Top 10:2025, traduit en mesures concrètes

| # | Risque | Ce que ça donne chez nous | Mesures (Laravel / NestJS) |
|---|---|---|---|
| A01 | **Contrôle d'accès défaillant** (inclut désormais le SSRF) | Un utilisateur lit la facture d'un autre en changeant l'id dans l'URL (IDOR) ; un tenant voit les données d'un autre ; le serveur appelle une URL fournie par l'utilisateur | Policies / Gates, Guards ; portée globale par `tenant_id` ; tests d'accès croisé ; liste blanche des domaines pour les appels sortants |
| A02 | **Mauvaise configuration** (remontée de la 5e à la 2e place) | `APP_DEBUG=true` en production, `.env` accessible, CORS `*`, index de répertoire visible, comptes par défaut | Checklist de mise en production ; en-têtes de sécurité ; racine web sur `public/` |
| A03 | **Chaîne d'approvisionnement logicielle** (nouveau, élargit « composants vulnérables ») | Paquet npm compromis, dépendance abandonnée, script de build modifié, composant copié en ligne sans relecture | Fichiers de verrouillage commités ; `npm audit` / `composer audit` ; Dependabot ; relire les composants et skills copiés ; CI protégée |
| A04 | **Défaillances cryptographiques** | Mots de passe en MD5, données sensibles en clair, HTTP sans TLS | bcrypt/argon2 ; HTTPS partout ; chiffrement des champs sensibles (`encrypted` cast en Laravel) |
| A05 | **Injection** | SQL concaténé, XSS via `{!! !!}` ou `dangerouslySetInnerHTML`, commandes système | ORM / requêtes paramétrées ; échappement par défaut ; pas d'`exec` sur une saisie |
| A06 | **Conception non sécurisée** | Montant du paiement envoyé par le client, pas de limite de tentatives, logique de remise contournable | Règles métier côté serveur ; modélisation des menaces au moment de la conception |
| A07 | **Échecs d'authentification** | Force brute, sessions sans expiration, réinitialisation de mot de passe prévisible | Limitation de débit, jetons à usage unique, 2FA pour les administrateurs |
| A08 | **Intégrité des logiciels et des données** | Webhook de paiement accepté sans vérifier la signature, désérialisation non sûre, mise à jour non signée | Vérifier les signatures des webhooks (Wave, Orange Money, Stripe) ; idempotence |
| A09 | **Journalisation et alertes insuffisantes** | Intrusion découverte des semaines après, faute de logs ou d'alerte | Journaliser connexions, échecs, actions d'administration ; alertes sur les anomalies |
| A10 | **Mauvaise gestion des conditions exceptionnelles** (nouveau) | Une erreur révèle une trace avec des chemins ou des requêtes SQL ; un `catch` vide laisse passer une opération à moitié faite ; un délai dépassé débloque un accès | Gestionnaire d'erreurs global ; messages génériques côté utilisateur ; transactions ; *fail closed* (en cas de doute, refuser) |

---

## 2. Authentification et mots de passe
- Hachage **bcrypt** ou **argon2** (natifs : `Hash::make` en Laravel, `bcrypt`/`argon2` en Node, `make_password` en Django). Jamais MD5/SHA1, jamais en clair, jamais « chiffré » de façon réversible.
- Limiter les tentatives de connexion (rate limiting, verrouillage temporaire).
- Sessions : cookies `HttpOnly`, `Secure`, `SameSite`. JWT : durée courte + rafraîchissement + révocation possible ; pas de stockage dans `localStorage` si on peut l'éviter.
- Réinitialisation du mot de passe par jeton à usage unique et expirant ; même message que l'e-mail existe ou non.
- 2FA au minimum pour les comptes administrateurs et les comptes qui manipulent de l'argent.

## 3. Contrôle d'accès et isolation multi-tenant
- Vérifier **côté serveur**, à chaque requête, que l'utilisateur a le droit d'accéder à **cette** ressource, et pas seulement qu'il est connecté.
  - ❌ `GET /api/factures/42` renvoie la facture 42 à tout utilisateur connecté.
  - ✅ Policy / Guard : un client ne voit que ses factures, un agent que celles de sa structure.
- Masquer un bouton dans l'interface n'est **pas** un contrôle d'accès.
- **Multi-tenant** (SaaS servant plusieurs structures clientes) : `tenant_id` déduit de la **session**, jamais d'un paramètre envoyé par le client ; portée globale appliquée par défaut (Eloquent global scope, extension Prisma) ; tâches en file et exports qui **conservent** le tenant ; cache et fichiers stockés préfixés par tenant.
- **Tests obligatoires** : pour chaque route sensible, un test qui tente l'accès avec un utilisateur **d'un autre tenant** et attend un 403 ou un 404.
- **Affectation de masse** (Laravel) : `$fillable` explicite ; ne jamais faire `->update($request->all())`, un attaquant pourrait envoyer `role=admin` ou `tenant_id=…`. NestJS : `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`.

## 4. Injections et validation
- **SQL** : requêtes paramétrées ou ORM, jamais de concaténation.
  ```php
  // ❌
  DB::select("SELECT * FROM etudiants WHERE matricule = '$matricule'");
  // ✅
  Etudiant::where('matricule', $matricule)->first();
  ```
  Attention aux méthodes « brutes » : `whereRaw`, `orderByRaw`, `$queryRawUnsafe` (Prisma). Passer les valeurs en paramètres.
- **XSS** : échapper en sortie (Blade `{{ }}`, React et Vue échappent par défaut). Se méfier de `{!! !!}`, `dangerouslySetInnerHTML`, `v-html`. Assainir le HTML riche (DOMPurify).
- **Validation côté serveur** : Form Requests (Laravel), DTO + `class-validator` (NestJS), Zod. Types, longueurs, formats (téléphone `+221…`), valeurs autorisées.
- **Fichiers envoyés** : vérifier la signature réelle du fichier (pas seulement l'extension ni le MIME déclaré), limiter la taille, renommer, stocker hors du dossier public exécutable, servir via une route contrôlée.

## 5. Configuration, en-têtes et secrets
- Secrets en variables d'environnement, jamais dans Git. Une clé poussée une fois doit être **révoquée et régénérée**.
- `APP_DEBUG=false`, `NODE_ENV=production`.
- En-têtes : `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options` (ou `frame-ancestors`), `Referrer-Policy`, et une `Content-Security-Policy` adaptée. NestJS / Express : `helmet`.
- CORS : liste exacte d'origines, pas de `*` avec identifiants.
- Limitation de débit sur la connexion, l'inscription, l'envoi de SMS et d'OTP (ces envois coûtent de l'argent et peuvent être abusés).

## 6. Paiement et argent
- Ne jamais stocker de numéros de carte : passer par le prestataire (Wave, Orange Money, PayDunya, Stripe…) et ses webhooks **signés**.
- Montants calculés **côté serveur**, jamais acceptés depuis le client.
- Idempotence : une même requête rejouée ne débite pas deux fois (clé d'idempotence, contrainte unique sur la référence de transaction).
- Rapprochement quotidien entre transactions du prestataire et transactions en base.

## 7. Données personnelles
- Ne collecter que le nécessaire ; durée de conservation définie ; suppression réelle quand la loi l'exige.
- Accès restreint et journalisé aux données sensibles (santé, justice, mineurs).
- Sénégal : loi n° 2008-12 et Commission de Protection des Données Personnelles (CDP), avec déclaration préalable des traitements (voir `mise-en-production.md` §5).
- Pas de vraies données personnelles dans les jeux de démonstration, les captures du mémoire, les dépôts publics ni les **prompts envoyés à une IA**.

## 8. Fonctionnalités d'IA intégrées (assistant, chatbot, génération)
- **Injection de prompt** : un texte fourni par l'utilisateur (ou un document, une page web) peut contenir des instructions. Ne jamais donner au modèle plus de droits que l'utilisateur ; vérifier côté serveur toute action déclenchée par le modèle.
- Ne pas envoyer de secrets ni de données personnelles inutiles au fournisseur d'IA ; vérifier ses conditions de conservation des données.
- Limiter le coût : quotas par utilisateur, taille maximale des entrées.
- Traiter la sortie du modèle comme une **entrée non fiable** : l'échapper avant affichage, la valider avant de l'exécuter ou de l'écrire en base.

---

## 9. Outils automatisés : la chaîne minimale

| Étape | Outil (gratuit ou open source) | Quand |
|---|---|---|
| Secrets | **gitleaks** ou le *secret scanning* de GitHub | Hook avant commit + CI |
| Dépendances | `composer audit`, `npm audit`, **Dependabot** | CI + hebdomadaire |
| Analyse statique (SAST) | **Semgrep** (règles OWASP), **Larastan/PHPStan**, `eslint-plugin-security` | CI sur chaque PR |
| Scan dynamique (DAST) | **OWASP ZAP** (scan de base en CI contre le staging) | Avant mise en production |
| Pentest par agents IA | **Strix** (§10) | Avant une version majeure, sur staging |
| Revue humaine | `checklist-revue.md` + ASVS niveau adapté | Chaque PR sensible (auth, paiement, accès) |

Aucun outil ne remplace la revue des règles métier : un scanner ne sait pas qu'un agent de la commune A ne doit pas voir les taxes de la commune B.

---

## 10. Strix : tests d'intrusion par agents IA

**Ce que c'est** : un outil open source (licence Apache-2.0, dépôt `usestrix/strix`) où des agents IA planifient, explorent et **valident** des vulnérabilités exploitables, puis produisent des constats avec preuves et pistes de correction. Il peut tester du code local, un dépôt GitHub ou une application en ligne, et combiner code + application (test en boîte blanche).

**Prérequis** : Docker en marche (les agents travaillent dans un bac à sable Docker) et une clé d'API d'un fournisseur de modèles de langage (OpenAI, Anthropic, Google, ou via OpenRouter).

**Installation et lancement** (selon la documentation officielle, à revérifier) :
```bash
pipx install strix-agent            # ou : curl -sSL https://strix.ai/install | bash

export STRIX_LLM="fournisseur/modele"   # voir la liste recommandée dans la doc
export LLM_API_KEY="…"                  # jamais commitée

# Code local (boîte blanche)
strix --target ./mon-app

# Application de staging + son dépôt
strix -t https://github.com/org/repo -t https://staging.mon-app.sn

# Consignes : comptes de test, zones à cibler
strix --target https://staging.mon-app.sn \
      --instruction "Deux comptes de test, tenant A et tenant B. Cherche en priorité les fuites entre tenants (IDOR) et le contournement des paiements."

# En CI (sans interface) : échec si une faille de gravité élevée ou plus est trouvée
strix -n --target ./ --scan-mode quick --fail-on high
```
Résultats dans `strix_runs/<nom-du-run>`. Modes : `quick`, `standard`, `deep` (par défaut). Codes de sortie en mode non interactif : `0` aucun constat au-dessus du seuil, `1` erreur, `2` vulnérabilités trouvées. Options de test limité aux changements par rapport à une branche (`--scope-mode`, `--diff-base origin/main`) pour les PR.

**Règles d'usage (obligatoires)**
1. **Autorisation écrite** : ne tester que des systèmes qui vous appartiennent ou pour lesquels le propriétaire a donné un accord écrit (périmètre, dates). Tester sans autorisation est illégal, y compris « pour aider ».
2. **Jamais sur la production** : utiliser un **staging** avec des données fictives. Un pentest actif crée, modifie et supprime des données, envoie des requêtes en masse et peut déclencher des SMS ou des paiements réels.
3. **Prestataires externes en mode test** (clés sandbox de Wave, Orange Money, Stripe ; passerelle SMS factice).
4. **Code local monté en écriture** : la documentation précise que l'agent peut modifier les fichiers du dossier ciblé (`.git` excepté). Commiter ou mettre de côté (`git stash`) avant, ou travailler sur une copie.
5. **Confidentialité** : le code et les réponses de l'application sont envoyés au fournisseur du modèle. Pas de code client sous accord de confidentialité ni de données réelles sans l'accord du client.
6. **Coût** : un scan `deep` consomme beaucoup de jetons d'API. Commencer par `quick`, fixer une limite de dépense chez le fournisseur.
7. **Vérifier chaque constat** : reproduire à la main, puis corriger, puis ajouter un **test de non-régression**. Un faux positif reste possible, et l'absence de constat ne prouve pas l'absence de faille.

**Dans le mémoire** : un tableau « constat → gravité → correction → test ajouté » issu d'un scan Strix ou ZAP sur le staging est une preuve forte pour la section Tests et validation.

---

## 11. Présenter la sécurité dans le mémoire
Tableau **Menace | Mesure appliquée | Où (fichier / middleware / configuration) | Comment c'est vérifié** plutôt qu'une phrase comme « nous avons mis en place des mesures de sécurité robustes ».

| Menace (OWASP 2025) | Mesure | Où | Vérification |
|---|---|---|---|
| A05 Injection SQL | ORM Eloquent, aucune requête brute | `app/Models/*` | Semgrep en CI |
| A01 Accès au dossier d'un autre étudiant | Policy `EtudiantPolicy@view` | `app/Policies/EtudiantPolicy.php` | Test d'accès croisé (403) |
| A04 Vol de mots de passe | bcrypt | `config/hashing.php` | Revue de configuration |
| A07 Force brute | 5 tentatives / minute | `RouteServiceProvider` (throttle) | Test automatisé |
| A08 Faux webhook de paiement | Vérification de signature | `PaymentWebhookController` | Test avec signature invalide (rejet) |

## Sources
- [OWASP Top 10:2025](https://top10.owasp.org/2025/0x00_2025-Introduction/)
- [OWASP ASVS](https://owasp.org/www-project-ASVS/) (version stable 5.0.0)
- [Strix sur GitHub (usestrix)](https://github.com/usestrix) · [Strix : démarrage rapide](https://docs.strix.ai/quickstart) · [Strix : options de la ligne de commande](https://docs.strix.ai/usage/cli)
