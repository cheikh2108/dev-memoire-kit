# Base de données : choix, schéma, index, migrations

Adapté d'une fiche « database-architect » fournie par l'équipe. À faire **avant** de concevoir l'API : le modèle de données conditionne tout le reste. Pour la modélisation (classes UML / MCD Merise → tables), voir `../../redaction-memoire/references/uml.md` §9.

## 1. Choisir la technologie
| Besoin | Technologie | Remarque |
|---|---|---|
| Données relationnelles, transactions (ACID) | **PostgreSQL** ou **MySQL/MariaDB** | Choix par défaut. MySQL est souvent le seul proposé en hébergement mutualisé local ; PostgreSQL apporte index partiels, JSONB et contraintes plus riches. |
| Document, schéma flexible | MongoDB | Seulement si les données sont réellement sans structure fixe. Ne pas le choisir « parce que c'est du JSON » : la plupart des applications de gestion sont relationnelles. |
| Séries temporelles (capteurs, métriques) | TimescaleDB (extension PostgreSQL), InfluxDB | — |
| Graphe (relations profondes) | Neo4j | Rare en gestion |
| Cache, sessions, files | Redis | En complément, jamais comme source de vérité |
| Recherche plein texte avancée | Meilisearch, Typesense, Elasticsearch | Commencer par le plein texte de PostgreSQL ou MySQL |
| Multi-région, très grande échelle | CockroachDB, PlanetScale | Hors sujet pour la plupart des projets locaux |
| Serverless managé | Neon (PostgreSQL) | Déjà utilisé avec Prisma : connexion `sslmode=require`, adaptateur `@prisma/adapter-pg` |

## 2. Principes de schéma
- **Normaliser d'abord (3NF)** ; dénormaliser seulement quand une mesure (requête lente, profilage) le justifie.
- **Clés étrangères déclarées** (pas seulement « logiques ») + **index sur chaque colonne de jointure**. PostgreSQL ne crée **pas** automatiquement d'index sur une clé étrangère ; MySQL InnoDB, si.
- **Colonnes d'audit** : `created_at`, `updated_at`, et `created_by` / `updated_by` si on doit savoir qui a modifié.
- **Suppression logique** (`deleted_at TIMESTAMP NULL`) pour les données métier qu'on doit pouvoir restaurer. Pièges : penser à filtrer partout (SoftDeletes en Laravel, middleware Prisma) ; une contrainte `UNIQUE(email)` bloque la recréation d'un e-mail supprimé (solution : index unique partiel `WHERE deleted_at IS NULL` en PostgreSQL) ; la loi sur les données personnelles peut exiger une **vraie** suppression.
- **Clés primaires** : entier auto-incrémenté (simple, compact) ou **UUID v7 / ULID** (triables, sûrs pour les systèmes distribués, n'exposent pas le volume dans les URL). Éviter l'UUID v4 aléatoire comme clé primaire sur de grosses tables MySQL : il fragmente l'index.
- **Montants** : entiers (FCFA sans décimales) ou `DECIMAL`, jamais `FLOAT`.
- **Dates** : stocker en UTC, convertir à l'affichage (Africa/Dakar = UTC+0, sans heure d'été).
- **Multi-tenant** : colonne `tenant_id` sur chaque table métier, incluse dans les index composites et **filtrée automatiquement** (portée globale Eloquent, extension Prisma) ; ou un schéma par tenant si l'isolation est exigée.

## 3. Index
```sql
-- Colonne simple
CREATE INDEX idx_users_email ON users(email);

-- Composite : égalités d'abord, plage (date) en dernier
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- Partiel (PostgreSQL) : seulement les lignes actives
CREATE INDEX idx_active_users ON users(email) WHERE deleted_at IS NULL;

-- Multi-tenant : tenant en tête
CREATE INDEX idx_actions_tenant_statut ON actions(tenant_id, statut, echeance);
```
- Vérifier avec `EXPLAIN` (ou `EXPLAIN ANALYZE`) au lieu de deviner.
- Les index ralentissent les écritures : pas d'index « au cas où ».
- MySQL n'a pas d'index partiel : utiliser une colonne générée ou revoir la contrainte.

## 4. Migrations
- Toujours dans des fichiers **versionnés** (migrations Laravel, Prisma Migrate, Alembic, Flyway).
- **Jamais de modification manuelle** du schéma en production.
- Changements sans interruption, en plusieurs déploiements (*expand / contract*) :
  1. ajouter la nouvelle colonne (nullable) ;
  2. déployer le code qui écrit dans les deux ;
  3. remplir l'existant (*backfill*) par lots ;
  4. ajouter la contrainte (`NOT NULL`, index unique) ;
  5. retirer l'usage de l'ancienne colonne ;
  6. supprimer l'ancienne colonne **dans une migration ultérieure**.
- Ne jamais modifier une migration déjà appliquée ailleurs : en créer une nouvelle.
- Tester sur une copie de staging avec un volume réaliste.
- **Règle de sécurité** : aucune migration destructive sans **sauvegarde vérifiée** (restauration testée) et plan de retour arrière.

## 5. Données de démonstration
Seeders réalistes et reproductibles : noms, villes, numéros sénégalais, montants en FCFA, graine Faker fixe (voir le prompt « Seeder Laravel réaliste Sénégal » dans `../../anti-generique/assets/prompts/bibliotheque-equipe.md`). Jamais de vraies données clients en développement.

## 6. Checklist de revue d'un schéma
- [ ] Chaque table a une clé primaire, des colonnes d'audit, et `tenant_id` si multi-tenant.
- [ ] Chaque relation a une clé étrangère déclarée et indexée, avec un comportement `ON DELETE` choisi (CASCADE, SET NULL, RESTRICT).
- [ ] Les règles métier simples sont des contraintes (`UNIQUE`, `CHECK`, `NOT NULL`), pas seulement du code.
- [ ] Montants en entier ou `DECIMAL` ; dates en UTC.
- [ ] Les requêtes des écrans principaux ont été vérifiées avec `EXPLAIN`.
- [ ] Sauvegardes automatiques en place **et** restauration testée.
