# dev-memoire-kit

Skills pour Claude (Claude Code et claude.ai) destinés aux étudiants et aux développeurs, écrits en français et adaptés au contexte sénégalais (FCFA, Wave / Orange Money, Android d'entrée de gamme, CDP).

| Skill | À quoi il sert |
|---|---|
| **redaction-memoire** | Rédiger un mémoire de fin de cycle en informatique selon les normes d'une école d'informatique (licence GLAR) : plan décimal, 22 pages conventionnelles, introduction en 7 étapes, conclusion en 4 points, bibliographie, questionnaire, **modélisation UML / Merise** (méthode, notation, passage à la base, exemple complet), soutenance. Inclut un **script de vérification** des brouillons. |
| **bonnes-pratiques-dev** | Architecture (monolithe modulaire, Clean, hexagonale, DDD), base de données, front-end React/Next.js/Vue, Git, **sécurité** (OWASP Top 10:2025, multi-tenant, pentest par agents IA avec Strix), revue de code, **mise en production** et gestion d'incidents, ADR et postmortem. |
| **anti-generique** | Repérer et réécrire ce qui « sonne IA » : texte, code, interfaces, diapositives. Format **DESIGN.md**, références visuelles commentées, règles de la communauté (Taste, UI Skills, Vercel Guidelines…), bibliothèque de prompts réels de l'équipe. |

Les trois skills se complètent : pendant la rédaction, `anti-generique` évite le texte creux ; pour la partie Mise en œuvre, `bonnes-pratiques-dev` garde le code, l'architecture et les schémas défendables.

## Installation

### Claude Code (depuis GitHub)
```
/plugin marketplace add cheikh2108/dev-memoire-kit
/plugin install dev-memoire-kit@dev-memoire-kit
```
ou dans le terminal :
```
claude plugin marketplace add cheikh2108/dev-memoire-kit
claude plugin install dev-memoire-kit@dev-memoire-kit
```

### En local (avant publication)
```
claude plugin marketplace add ./dev-memoire-kit
claude plugin install dev-memoire-kit@dev-memoire-kit
```

### À la main
Copier les dossiers de `plugins/dev-memoire-kit/skills/` dans `~/.claude/skills/` (pour soi) ou dans `.claude/skills/` à la racine d'un projet (pour l'équipe).

### claude.ai
Zipper un dossier de skill (ex. `redaction-memoire/`, avec son `SKILL.md` à la racine du zip) et l'importer dans les paramètres de Claude, rubrique des skills.

Coût en contexte : environ 600 tokens permanents par session pour les trois skills ; le détail (références, exemples) n'est lu qu'à la demande.

## Skills complémentaires de la communauté

La marketplace propose aussi une sélection de skills populaires d'autres auteurs, relus et figés sur une version précise. Ils restent hébergés chez leurs auteurs et sous leur licence ; rien n'est installé tant qu'on ne le demande pas. On les voit dans `/plugin`, onglet Découvrir, une fois la marketplace ajoutée, et Claude les propose quand la situation s'y prête.

| Plugin | À quoi il sert | Auteur, licence |
|---|---|---|
| `soutenance-grill-me` | Claude t'interroge sans relâche sur ton plan ou tes choix, comme un jury (`/grill-me`) | Matt Pocock, MIT |
| `tdd` | Écrire les tests avant le code | Matt Pocock, MIT |
| `diagnostic-bugs` | Trouver la cause d'un bug difficile ou d'une lenteur | Matt Pocock, MIT |
| `architecture-code` | Améliorer l'architecture d'un projet existant, glossaire, ADR | Matt Pocock, MIT |
| `apprendre-une-techno` | Apprendre une technologie sur plusieurs séances (`/teach`) | Matt Pocock, MIT |
| `frontend-design` | Interfaces web soignées et non génériques | Anthropic, Apache-2.0 |
| `tests-webapp` | Tester une application web dans un navigateur (Playwright) | Anthropic, Apache-2.0 |
| `react-bonnes-pratiques` | Performance React et Next.js | Vercel, MIT |
| `react-native-bonnes-pratiques` | Applications mobiles React Native et Expo | Vercel, MIT |
| `creer-un-skill` | Créer et tester ses propres skills | Anthropic, Apache-2.0 |

Installation : `/plugin install <nom>@dev-memoire-kit`, par exemple `/plugin install soutenance-grill-me@dev-memoire-kit`.

## Utilisation (exemples)

- « Voici mon sujet et mes notes d'entretien, aide-moi à écrire la problématique et les hypothèses. »
- « Relis mon chapitre 2 comme un membre du jury. » (joindre le .docx)
- « Fais-moi le diagramme de classes de mon application de pointage, voici mes migrations. »
- « Include ou extend pour ce cas d'utilisation ? »
- « Prépare ma fiche technique de soutenance à partir de mon mémoire. »
- « Ce texte fait trop IA, réécris-le avec mes données. »
- « Écris le DESIGN.md de notre application de gestion de stock. »
- « Revue de sécurité de ce contrôleur Laravel multi-tenant. »
- « Checklist avant la mise en production de vendredi. »

### Modèle Word aux normes
`plugins/dev-memoire-kit/skills/redaction-memoire/assets/modele-memoire.docx` : les 22 pages dans l'ordre, Times New Roman 12, interligne 1,5, texte justifié, titres 14 gras, notes de bas de page 10, marges 3,5 / 2,5 cm, pagination I, II… puis 01, 02… puis i, ii…, sommaire, table des matières et listes des figures et des tableaux automatiques (F9 pour les mettre à jour), consignes en gris à remplacer.
Pour une autre école : modifier l'objet `ECOLE` dans `scripts/generer_modele_word.js` puis lancer `node scripts/generer_modele_word.js mon-modele.docx assets/drapeau-senegal.png` (paquet npm `docx`).

### Script de vérification de mémoire
```
python3 plugins/dev-memoire-kit/skills/redaction-memoire/scripts/verifier_memoire.py mon_memoire.docx
python3 plugins/dev-memoire-kit/skills/redaction-memoire/scripts/verifier_memoire.py chapitre.md --sans-structure
```
Il détecte les coquilles des modèles (ex. « TELEINFORMQTIQUE »), les marqueurs `[À COMPLÉTER]` restants, la numérotation non conforme (2.1 au lieu de 2.3), les clôtures empilées (« En résumé… En conclusion… »), les tics génériques, les adjectifs promotionnels, les pages conventionnelles manquantes et les technologies citées de façon incohérente. Python 3.8+, aucune dépendance.

## Tester et valider
```
claude plugin validate ./dev-memoire-kit                            # format du marketplace et du plugin
cd plugins/dev-memoire-kit && claude plugin eval . --trust-plugin   # cas de test dans evals/
```
Les cas de `evals/` vérifient que chaque skill se déclenche sur une demande formulée naturellement, que la réponse respecte des critères de qualité, et qu'aucun skill ne se déclenche sur une question hors sujet.

## Structure
```
dev-memoire-kit/
├── .claude-plugin/marketplace.json
├── plugins/dev-memoire-kit/
│   ├── .claude-plugin/plugin.json
│   ├── evals/                          (cas de test : claude plugin eval)
│   └── skills/
│       ├── redaction-memoire/
│       │   ├── SKILL.md
│       │   ├── references/   plan-type, 22-pages-conventionnelles, introduction-conclusion,
│       │   │                 normes-presentation, methodologie-recherche, uml, soutenance,
│       │   │                 erreurs-frequentes
│       │   ├── assets/       fiche-technique-soutenance, trame-diaporama,
│       │   │                 uml-exemple-pointage (+ uml-exemple/*.png)
│       │   └── scripts/verifier_memoire.py
│       ├── bonnes-pratiques-dev/
│       │   ├── SKILL.md
│       │   ├── references/   architecture, base-de-donnees, frontend, securite,
│       │   │                 mise-en-production, git, checklist-revue, code-dans-le-memoire
│       │   └── assets/       modele-adr, modele-postmortem
│       └── anti-generique/
│           ├── SKILL.md
│           ├── references/   texte, code, design, design-md, references-visuelles,
│           │                 reproduction-ui, principes-communaute, catalogue-skills,
│           │                 bibliotheques-ui, prompts
│           └── assets/       design-md/ (modèle + exemple), prompts/ (bibliothèque de
│                             l'équipe, image → interface, reconstruction de site,
│                             intégration de composant), references-visuelles/*.png
├── CHANGELOG.md
├── THIRD_PARTY_NOTICES.md
├── README.md
└── LICENSE
```

## Sources et adaptation
Le skill `redaction-memoire` reprend le *Guide de recherche, de rédaction et de présentation d'un document académique* (cours TEC, L3 GLAR) et ses modèles de pages. Les erreurs fréquentes viennent de l'analyse anonymisée de travaux d'étudiants. Pour une autre école : adapter `references/plan-type.md`, `references/normes-presentation.md` et la page de couverture dans `references/22-pages-conventionnelles.md`.

Les références techniques citent leurs sources officielles (OWASP, Laravel, Prisma, Google SRE, ANSSI, documentation de Strix…) avec leur date de consultation ; les versions évoluent, revérifier avant d'appliquer une commande.

Ces skills aident à formuler, structurer et vérifier un travail **réel**. Ils n'inventent ni données ni références, et chaque étudiant reste responsable de respecter les règles de son établissement sur l'usage de l'IA.

## Contributeurs
- **Oblivion** ([@cheikh2108](https://github.com/cheikh2108)) : conception, contenus (guide de mémoire, bibliothèque de prompts, références design, fiches d'architecture), tests.

Les contributions sont bienvenues : ouvrir une issue ou une pull request (nouvelle école, nouveaux prompts, corrections).

## Licence
MIT. Certaines références du skill `anti-generique` synthétisent des projets tiers sous licence MIT : voir `THIRD_PARTY_NOTICES.md`.
