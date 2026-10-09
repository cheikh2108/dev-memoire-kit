# Historique des versions

## 1.6.0 — 09/10/2026
### Ajouts
- **redaction-memoire**, à partir d'un troisième mémoire validé (anonymisé) :
  - gabarits : étude comparative des frameworks par couche, section 3.5 « Déploiement et estimation des coûts » (tableau des coûts par périodicité, récapitulatif par scénario), bloc « Interfaces communes » pour les applications web + mobile, annexe d'entretien structurée par thèmes ;
  - variantes acceptées : ordre des pages liminaires, chapitres en chiffres romains, fiche de cas d'utilisation au format A1/E1 ;
  - nouveaux défauts relevés (annonce du plan contradictoire, données personnelles dans les captures, coûts mal calculés, CRUD en extend, « S'authentifier » pivot…).
- Modèle Word : étude comparative, déploiement et coûts, tableau d'identification de l'entretien.
- `verifier_memoire.py` : chapitres en chiffres romains, plan en chapitres annoncé en « parties ».

## 1.5.0 — 09/10/2026
### Ajouts
- **redaction-memoire** : procédure « mémoire complet » (`references/memoire-complet.md`) : recueil des faits, plan, registre de cohérence, rédaction chapitre par chapitre dans le modèle, vérification, liste des points à compléter ; fiche projet à remplir (`assets/fiche-projet.md`).
### Modifications
- Règle renforcée : les objectifs spécifiques sont les étapes du travail, jamais les fonctionnalités (SKILL.md, plan type).

## 1.4.0 — 09/10/2026
### Modifications
- **redaction-memoire** réaligné sur la structure de mémoires de licence récemment soutenus et validés dans la filière (anonymisés) :
  - plan de référence en **trois chapitres** (présentation générale, analyse et conception, réalisation) ; le plan en parties du guide devient une variante ;
  - ordre réel des pages conventionnelles (résumé et abstract en tête, sommaire après les listes, table des matières à la fin) et pagination I / 1 / i ;
  - modèle Word régénéré sur cette structure, avec tableaux gabarits (existant, comparaison, exigences fonctionnelles par module, exigences non fonctionnelles mesurables, fiche de cas d'utilisation, outils, tests, recette).
### Ajouts
- `references/modeles-de-chapitres.md` : format de chaque section tel qu'observé dans les mémoires validés, corrigé de leurs défauts.
- `erreurs-frequentes.md` : défauts relevés dans des mémoires validés (annonces fausses, codes EF incohérents, tests absents, données réelles dans les captures…).
- `verifier_memoire.py` : numérotation par chapitre, annonces de sections fausses, codes EF cités mais non définis ou dans le désordre, figures « 0.x », intitulés fautifs.

## 1.3.1 — 09/10/2026
### Modifications
- **redaction-memoire** : tout fichier Word du mémoire part obligatoirement du modèle `assets/modele-memoire.docx` (copie puis remplissage, 22 pages conventionnelles conservées dans l'ordre, styles gardés) ; Claude ne génère plus de document de zéro.

## 1.3.0 — 09/10/2026
### Ajouts
- **Marketplace** : 10 skills populaires de la communauté (Matt Pocock, Anthropic, Vercel), relus et figés sur un commit précis, installables un par un : `soutenance-grill-me`, `tdd`, `diagnostic-bugs`, `architecture-code`, `apprendre-une-techno`, `frontend-design`, `tests-webapp`, `react-bonnes-pratiques`, `react-native-bonnes-pratiques`, `creer-un-skill`. Ils restent hébergés chez leurs auteurs.
- Fiche `bonnes-pratiques-dev/references/skills-complementaires.md` : Claude propose le bon skill au bon moment.

### Modifications
- **redaction-memoire** (UML / Merise) : éviter les associations 1 — 1 strictes (fusionner les deux classes), cas où un 1 — 0..1 se justifie, règle de passage à la base mise à jour.

## 1.2.1 — 09/10/2026
### Modifications
- **redaction-memoire** : règle d'équilibre des longueurs (sections et sous-sections proches au sein d'un chapitre, chapitres proches au sein d'une partie, conclusion concise de 1 à 1,5 page).

## 1.2.0 — 08/10/2026
### Ajouts
- **redaction-memoire** : modèle Word aux normes de l'école (`assets/modele-memoire.docx`) et son générateur paramétrable (`scripts/generer_modele_word.js`) : styles, marges, pagination par sections, sommaire, table des matières, listes des figures et des tableaux, note de bas de page, tableau et légendes d'exemple, consignes à remplacer.
- Section Contributeurs dans le README.

## 1.1.0 — 08/10/2026
### Ajouts
- **redaction-memoire** : guide de modélisation UML / Merise (`references/uml.md`) et exemple complet « pointage des étudiants » en PlantUML avec rendus PNG.
- **bonnes-pratiques-dev** : architecture (règle de dimensionnement, Clean, hexagonale, DDD, API, résilience, observabilité), base de données, front-end, mise en production, modèles d'ADR et de postmortem.
- **bonnes-pratiques-dev** : sécurité réécrite autour de l'OWASP Top 10:2025, isolation multi-tenant, outils automatisés et pentest par agents IA avec Strix.
- **anti-generique** : format DESIGN.md (modèle + exemple commenté), références visuelles commentées, règles de la communauté (synthèse MIT), catalogue de skills design, bibliothèques UI (Bklit), bibliothèque de prompts réels de l'équipe, prompts « image → interface », « reconstruction de site » et « intégration de composant ».
- Cas de test `evals/` pour `claude plugin eval`.
- `THIRD_PARTY_NOTICES.md`.

### Modifications
- Descriptions des skills élargies pour un meilleur déclenchement.
- README mis à jour (structure, tests, installation locale).

## 1.0.0 — 07/10/2026
- Première version : `redaction-memoire` (normes de l'école, 22 pages, script de vérification), `bonnes-pratiques-dev`, `anti-generique`.
