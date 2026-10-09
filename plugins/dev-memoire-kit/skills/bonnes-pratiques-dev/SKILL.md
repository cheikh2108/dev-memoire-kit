---
name: bonnes-pratiques-dev
description: Bonnes pratiques de développeur pour concevoir, écrire, relire, sécuriser ou mettre en production du code : architecture back-end (monolithe, Clean, hexagonale, DDD, API, résilience), base de données (schéma, index, migrations, multi-tenant), front-end React/Next.js/Vue, Git, sécurité (OWASP, contrôle d'accès, IDOR, fuites entre tenants, Strix), revue de code, mise en production, ADR. À utiliser dès qu'on montre du code (contrôleur, route, requête, composant) en demandant s'il est sûr, correct ou bien écrit, pour une revue de sécurité ou de code d'une application Laravel, NestJS, Node ou Django, pour choisir une architecture, préparer un déploiement, ou préparer la partie Mise en œuvre d'un mémoire.
---

# Bonnes pratiques de développeur

Valable quelle que soit la stack (Laravel/PHP, Node/Express, React/React Native, Flutter, Django, Spring…). Les exemples sont en JavaScript/TypeScript et PHP, mais les règles se transposent.

## Les 10 règles de base

1. **Nommer pour le métier.** `calculerTauxAbsence(etudiant, periode)` plutôt que `calc(d, p)`. Une seule langue de nommage dans le projet (anglais conseillé pour le code, français accepté si cohérent).
2. **Petites fonctions, une responsabilité.** Si une fonction a besoin d'un commentaire « Étape 1 / Étape 2 », la découper.
3. **Structure prévisible.** Suivre la convention du framework (dossiers `app/Http/Controllers`, `src/features/…`, etc.) plutôt qu'en inventer une.
4. **Git dès le premier jour** : commits petits et explicites, branches par fonctionnalité, `main` toujours fonctionnelle → `references/git.md`.
5. **Aucun secret dans le code ni dans Git** : `.env` ignoré, `.env.example` versionné, clés révoquées si elles ont fuité → `references/securite.md`.
6. **Valider toutes les entrées côté serveur**, requêtes paramétrées / ORM, échappement en sortie, mots de passe hachés (bcrypt/argon2), contrôle d'accès vérifié côté serveur → `references/securite.md`.
7. **Tester les comportements métier qui comptent** (règles de calcul, droits d'accès, cas limites) plutôt que viser un pourcentage de couverture.
8. **Gérer les erreurs volontairement** : ne pas avaler les exceptions ; messages utiles à l'utilisateur, détails techniques dans les logs.
9. **Formateur et linter automatiques** (Prettier/ESLint, Laravel Pint/PHP-CS-Fixer, Black/Ruff, dart format) : on ne débat plus du style en revue.
10. **README utile** : ce que fait le projet, comment l'installer et le lancer en moins de 5 commandes, variables d'environnement, comptes de démonstration.

## Selon la tâche

| Tâche | Lire |
|---|---|
| Concevoir un nouveau système : **1.** base de données → **2.** API et architecture → **3.** ADR | `references/base-de-donnees.md`, puis `references/architecture.md`, puis `assets/modele-adr.md` |
| Choix d'architecture (MVC, monolithe modulaire, Clean, hexagonale, DDD, microservices), API, résilience, observabilité | `references/architecture.md` (commencer par la règle de dimensionnement §0) |
| Schéma, index, migrations, multi-tenant, suppression logique | `references/base-de-donnees.md` |
| Front-end React / Next.js / Vue : état, composants serveur/client, performance | `references/frontend.md` |
| Mettre en production, sauvegardes, surveillance, données personnelles (CDP), gérer un incident | `references/mise-en-production.md` + `assets/modele-postmortem.md` |
| Commits, branches, messages, `.gitignore`, PR | `references/git.md` |
| Sécurité : OWASP Top 10:2025 appliqué à Laravel/NestJS, multi-tenant, paiements, IA intégrée, outils (gitleaks, Semgrep, ZAP) et pentest par agents IA avec **Strix** | `references/securite.md` |
| Relire du code ou une pull request | `references/checklist-revue.md` |
| Préparer le chapitre Mise en œuvre du mémoire, extraits de code, schémas | `references/code-dans-le-memoire.md` |
| Code produit par une IA | skill `anti-generique` : `../anti-generique/references/code.md` |

## Démarrage d'un projet (checklist)

- [ ] Dépôt Git créé, `.gitignore` adapté à la stack, `README.md` minimal
- [ ] `.env.example` avec toutes les variables (sans valeurs secrètes)
- [ ] Formateur + linter configurés, lancés avant chaque commit (hook ou CI)
- [ ] Structure de dossiers du framework respectée
- [ ] Migrations de base de données versionnées (pas de modification manuelle du schéma en production)
- [ ] Jeu de données de démonstration (seeders) réaliste et sans données personnelles réelles
- [ ] Premier test automatisé qui tourne (même simple)
- [ ] Branche `main` protégée si travail en groupe ; une branche par fonctionnalité

## Travail en groupe (mémoire à plusieurs)

- Répartir par **fonctionnalité**, pas par couche (« Awa : pointage de bout en bout » plutôt que « Awa : le front »).
- Chaque membre doit pouvoir expliquer **toute** l'architecture au jury, pas seulement sa partie.
- Revue croisée de chaque PR par un autre membre (`references/checklist-revue.md`).
- Un tableau de suivi simple (GitHub Projects, Trello) : à faire / en cours / en revue / terminé.
