# Bibliothèque de prompts de l'équipe (cas réels)

Prompts tirés d'une vraie bibliothèque d'équipe (Notion, « Vibe Coding OS »), utilisés sur deux projets en production : un SaaS multi-tenant (NestJS + Prisma + React) et une application Laravel + Vue 3. Les noms de projets sont retirés. Chaque fiche donne : le prompt, le résultat obtenu, la note de l'équipe (sur 5), puis **pourquoi il marche** et **comment l'améliorer**.

Ce qui fait leur force commune : **ils sont courts mais chargés de contexte précis** (fichier, contrainte, erreur, valeurs exactes). Aucun ne dit « fais-moi un beau composant ».

---

## 1. Audit et documentation

### Audit complet de la codebase (5/5)
```
Auditer projet: lister routes controllers models migrations pages Vue composants.
Identifier features partielles TODO.
```
**Pourquoi il marche** : liste exhaustive des artefacts à inventorier, objectif clair (trouver ce qui est inachevé).
**Amélioration** : imposer le format de sortie pour pouvoir comparer d'un audit à l'autre.
```
… Rends un tableau : élément | fichier | état (complet / partiel / TODO / mort) | preuve (ligne ou test).
Termine par les 5 points les plus risqués avant mise en production.
```

### Rapport exécutif pour la hiérarchie (5/5)
```
Generer rapport pour hierarchie: resume exec, stack, features livrees, bugs identifies,
reste a faire, metriques.
```
**Pourquoi il marche** : plan imposé, public nommé (« hiérarchie », donc pas de jargon).
**Amélioration** : préciser la période, la longueur, et interdire les chiffres non sourcés : « métriques uniquement tirées de git log, des tests et du tracker ; sinon [À COMPLÉTER] ».

---

## 2. Débogage

### Correction de bug avec test de non-régression (5/5)
```
Corriger bug: lire fichier, identifier cause, proposer fix, creer test PHPUnit qui reproduit
puis passe.
```
**Pourquoi il marche** : impose la démarche saine. On comprend la cause avant de corriger, et le test **échoue d'abord** puis passe. C'est le meilleur garde-fou contre les corrections « au hasard » des IA.
**Amélioration** : ajouter « ne modifie rien d'autre que le nécessaire ; explique la cause en 2 phrases avant le code ».

### Remplacer Puppeteer par PDFKit (4/5)
```
Puppeteer échoue (Chromium) sur Hostinger, remplacer par PDFKit pour génération PDF,
import avec require().
```
**Résultat** : rapports PDF fonctionnels sans dépendance à Chromium.
**Pourquoi il marche** : il donne **la contrainte d'hébergement** (pas de Chromium) et la solution cible. L'IA ne propose pas de « réessayer Puppeteer ».

### Incompatibilité ESM de `file-type` (4/5)
```
file-type (ESM-only) incompatible avec commonjs, implémenter validation magic bytes
manuelle (JPEG, PNG, PDF, DOCX).
```
**Résultat** : validation de fichiers fonctionnelle en CommonJS.
**Point de vigilance** : une validation maison par signature (« magic bytes ») doit aussi vérifier la taille maximale et ne jamais faire confiance à l'extension ni au MIME envoyé. Un DOCX est un ZIP : vérifier la signature `PK` **et** la présence de `word/document.xml`. Ajouter des tests avec de faux fichiers.

---

## 3. Back-end, déploiement, base de données

### Neon PostgreSQL + adaptateur Prisma (5/5)
```
Configurer Neon PostgreSQL avec @prisma/adapter-pg (driver adapter requis),
connection string avec sslmode=require.
```
**Résultat** : base de production connectée, 11 migrations appliquées.
**Pourquoi il marche** : il nomme le paquet exact et le paramètre de connexion. L'IA n'a pas à deviner une API.

### Déployer NestJS sur Hostinger Web Apps (5/5)
```
Configurer NestJS sur Hostinger Web Apps : commit dist/, créer wrapper dist/main.js,
déplacer devDeps vers deps, build = prisma generate uniquement.
```
**Résultat** : back-end déployé, contourne le délai maximal de compilation `tsc` de l'hébergeur.
**Point de vigilance** : c'est un **contournement**. Le documenter dans le README (pourquoi `dist/` est versionné) et prévoir une CI qui reconstruit `dist/`, sinon on risque de déployer un build périmé.

### CORS multi-origines (3/5)
```
CORS supporte wildcard * et origines séparées par virgules via variable env FRONTEND_URL.
```
**Résultat** : le back-end accepte les requêtes du front déployé.
**Pourquoi seulement 3/5** : `*` est dangereux en production et **interdit avec les cookies ou identifiants** (`credentials: true`). Version corrigée :
```
CORS : lire FRONTEND_URL (liste séparée par des virgules), autoriser uniquement ces origines
exactes, credentials: true, refuser les autres avec un log. Pas de '*' en production.
Ajoute un test pour une origine autorisée et une refusée.
```

### Seeder Laravel réaliste pour le Sénégal (5/5)
```
Seeder Laravel avec donnees senegalaises: noms Diop Ndiaye Fall, villes Dakar Thies,
tel +221 77/78. Faker seed 123.
```
**Pourquoi il marche** : c'est l'antidote direct aux « John Doe, New York ». Données locales plausibles, et **graine fixe** pour des démos reproductibles.
**Amélioration** : élargir le contexte local.
```
Prénoms : Awa, Fatou, Moussa, Cheikh, Aminata, Ibrahima, Mame Diarra…
Noms : Diop, Ndiaye, Fall, Sow, Ba, Gueye, Diallo, Sarr, Mbaye, Faye.
Villes et quartiers : Dakar (Plateau, Médina, Parcelles Assainies, Sacré-Cœur), Thiès,
Saint-Louis, Ziguinchor, Touba, Kaolack.
Téléphones : +221 70/75/76/77/78 + 7 chiffres. Montants en FCFA (entiers, pas de centimes).
Dates JJ/MM/AAAA. Aucune vraie personne.
```

---

## 4. Front-end et thème

### Composant UI avec la palette de marque (5/5)
```
Creer composant Vue 3 script setup avec palette de marque. Fond FAF9F7, bordure E4E0DA,
texte 1C1C1A. Tailwind uniquement.
```
**Pourquoi il marche** : framework, syntaxe, valeurs de couleur exactes, contrainte d'outil. Rien à deviner.

### Migration de toute l'app vers la palette (5/5)
```
Migrer tous les fichiers Vue vers palette de marque: bg-white -> bg-[#FAF9F7],
text-gray-900 -> text-[#1C1C1A], ring-gray-200 -> ring-[#E4E0DA].
Preserver logique, changer couleurs uniquement.
```
**Résultat** : 100 % des pages migrées, plus aucune classe gray/green/red héritée.
**Pourquoi il marche** : table de correspondance explicite + interdiction de toucher à la logique.
**Amélioration** : les valeurs `bg-[#FAF9F7]` répétées dans chaque fichier deviennent difficiles à changer. Mieux vaut déclarer des **tokens** une fois (`theme.extend.colors.surface = '#FAF9F7'` ou variables CSS), puis migrer vers `bg-surface`. La prochaine évolution de marque ne touchera qu'un fichier.

### Couleurs d'avatar suivant la marque (5/5)
```
Remplacer les gradients sombres hardcodés par var(--color-brand) dans sidebar.tsx,
header.tsx et page settings pour cohérence du thème.
```
**Résultat** : les avatars suivent la couleur de marque dynamique (multi-tenant).
**Pourquoi il marche** : il nomme les fichiers, le problème (couleurs en dur) et la cible (variable CSS). C'est exactement le bon réflexe d'architecture, à appliquer aussi à la migration ci-dessus.

---

## 5. Prompts longs (UI)
- Recréer un dashboard depuis une image → `image-vers-interface.md`
- Recréer un site complet depuis une source → `spec-reconstruction-site.md`
- Intégrer un composant React copié en ligne → `integration-composant.md`

---

## Tenir la bibliothèque à jour (leçons de l'export)

Structure de fiche utilisée, à garder : **Nom · Outil IA · Catégorie · Projet · Prompt · Résultat · Note**.

Constats sur l'export d'origine, à corriger :
- **10 fiches de démonstration** encore remplies de « Lorem ipsum » (modèle Notion) : les supprimer, elles noient les vrais prompts.
- **Doublons FR/EN** de la même fiche : garder une seule langue, ou un seul enregistrement avec deux champs.
- **Champ « Prompt » erroné** sur une fiche (le texte d'une autre fiche y a été collé) : vérifier à chaque ajout.
- **Champ « Résultat » souvent vide** : c'est pourtant lui qui dit si le prompt vaut la peine d'être réutilisé. Le remplir toujours, même d'une ligne.
- Ajouter un champ **« Contexte requis »** (fichiers, versions, contraintes à joindre). Un prompt court ne marche que si ce contexte est fourni.
- Les notes 3/5 méritent un champ **« Pourquoi pas 5 »** : c'est là qu'est l'apprentissage.
