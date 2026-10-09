# Historique des versions

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
