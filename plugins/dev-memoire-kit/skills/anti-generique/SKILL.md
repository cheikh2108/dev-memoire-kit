---
name: anti-generique
description: Détecter et réécrire le contenu qui « sonne IA » ou générique (texte, code, interfaces, prompts). À utiliser quand on produit ou relit un texte de mémoire, de rapport, de README, une interface ou un écran, du code généré par IA, ou quand l'utilisateur demande un résultat « moins générique », « plus humain », « plus concret », ou un bon prompt.
---

# Anti-générique

Le contenu générique a une cause unique : **l'absence de matière concrète**. Quand on ne sait rien de précis, on remplit avec des formules universelles (« de nos jours », « solution innovante », dégradé violet, `// Fonction qui gère les données`). Ce skill sert à repérer ces formules et à les remplacer par des faits.

## Règle 0 : chercher la matière avant d'écrire

Avant de produire quoi que ce soit, identifier (dans la conversation, les fichiers, le code) ou demander :
- **Qui** précisément (utilisateur réel, structure, ville, nombre) ;
- **Quoi** précisément (le processus, la donnée, la fonctionnalité, l'écran) ;
- **Preuves** disponibles (chiffres mesurés, captures, retours, logs, tests) ;
- **Contraintes** réelles (réseau, budget, matériel, délai, règles).

S'il manque une information, laisser un marqueur `[À COMPLÉTER : …]` ou poser la question. **Ne jamais inventer** un chiffre, une source, un résultat ou une citation pour « faire concret ». Un faux détail est pire qu'un texte générique.

## Les 4 domaines

| Domaine | Fichier | Quand |
|---|---|---|
| Texte (mémoire, rapport, README, post) | `references/texte.md` | Toute rédaction en français ou en anglais |
| Code généré ou relu | `references/code.md` | Revue de code IA, nettoyage avant présentation |
| Interfaces, écrans, diapositives | `references/design.md` | Maquettes, landing pages, captures pour le mémoire, slides |
| Références visuelles commentées | `references/references-visuelles.md` (+ images dans `assets/references-visuelles/`) | Choisir une direction, expliquer pourquoi un design fonctionne |
| Règles de la communauté (lecture du brief, signatures IA, finitions, checklist web) | `references/principes-communaute.md` | Concevoir ou relire une interface ; arbitrer entre règles contradictoires |
| Skills design tiers à installer | `references/catalogue-skills.md` | Choisir un skill complémentaire (Taste, UI Skills, Vercel Guidelines, GSAP…) et l'installer prudemment |
| DESIGN.md (système visuel pour l'IA) | `references/design-md.md` + `assets/design-md/modele-DESIGN.md` (modèle) + `assets/design-md/exemple-paperflow.md` (exemple réel) | Fixer couleurs, typo, rayons et interdits d'un projet avant de générer des écrans |
| Bibliothèques UI (graphiques Bklit UI…) et catalogues de skills design | `references/bibliotheques-ui.md` | Choisir une bibliothèque de graphiques ou de composants, thémer avec des tokens |
| Recréer une UI depuis une image | `references/reproduction-ui.md` | L'utilisateur fournit une capture ou une maquette à reproduire |
| Prompts | `references/prompts.md` | Écrire un prompt efficace, bibliothèque par usage |
| Prompts prêts à l'emploi | `assets/prompts/image-vers-interface.md`, `assets/prompts/integration-composant.md`, `assets/prompts/spec-reconstruction-site.md` | Image → interface React ; intégrer un composant shadcn copié en ligne ; recréer un site complet section par section |
| Prompts réels de l'équipe | `assets/prompts/bibliotheque-equipe.md` | Audit, débogage avec test, déploiement, CORS, seeders sénégalais, migration de palette ; tenir une bibliothèque de prompts |

## Procédure de réécriture (texte)

1. **Repérer** : lancer, si le texte est dans un fichier, `python3 ../redaction-memoire/scripts/verifier_memoire.py <fichier> --sans-structure` (détecte tics, clôtures empilées, adjectifs promotionnels). Sinon, appliquer la liste de `references/texte.md`.
2. **Classer** chaque passage repéré :
   - *creux* (n'apporte aucune information) → supprimer ;
   - *vague* (une idée réelle mal dite) → réécrire avec le fait précis ;
   - *non prouvé* (affirmation de résultat) → appuyer par une preuve ou passer au conditionnel.
3. **Réécrire** en gardant le registre attendu (académique pour un mémoire), sans retomber dans d'autres tics.
4. **Relire à voix haute** : une phrase qu'on ne dirait pas à l'oral devant le jury est à refaire.

## Test rapide (les 5 questions)

Pour chaque paragraphe :
1. Pourrait-il figurer tel quel dans un autre mémoire, sur un autre sujet ? → générique.
2. Contient-il au moins un nom propre, un chiffre ou un exemple propre au projet ?
3. Chaque adjectif évaluatif (robuste, intuitif, optimal) est-il justifié par un fait ?
4. Dit-il quelque chose de nouveau par rapport au paragraphe précédent ?
5. L'auteur pourrait-il le défendre à l'oral, question à l'appui ?

## Limites

Ce skill n'a pas pour but de « tromper un détecteur d'IA ». Le but est un texte **vrai, précis et défendable**. Si l'étudiant a utilisé une IA, il doit comprendre, vérifier et assumer chaque phrase, et respecter les règles de son établissement sur l'usage de l'IA.
