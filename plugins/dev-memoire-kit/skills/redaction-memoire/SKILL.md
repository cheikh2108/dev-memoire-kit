---
name: redaction-memoire
description: Rédiger, structurer, relire ou préparer la soutenance d'un mémoire de fin de cycle en informatique (licence GLAR / téléinformatique, écoles sénégalaises). À utiliser pour un plan détaillé, une introduction ou conclusion générale, une problématique ou des hypothèses, une page conventionnelle (avant-propos, dédicace, sommaire…), une bibliographie ou webographie, un questionnaire d'enquête, la relecture d'un chapitre, la préparation de la soutenance et des questions du jury, et pour toute question de modélisation UML ou Merise d'un projet étudiant (diagramme de cas d'utilisation, include ou extend, diagramme de classes, multiplicités, séquence, activité, MCD/MLD, passage à la base de données).
---

# Rédaction de mémoire de fin de cycle (informatique)

Ce skill reprend le guide de rédaction et de présentation remis en cours de TEC (L3 GLAR) et le complète par des règles de qualité tirées de l'analyse de vrais travaux d'étudiants. Il sert à produire un mémoire **conforme aux normes de l'école** et **qui ne sonne pas comme un texte généré**.

## Principe directeur

Le jury évalue deux choses : le document écrit et la défense orale. Dans le document, il sanctionne la forme (fautes, normes non respectées) autant que le fond. Chaque phrase écrite doit donc être :
1. **conforme** aux normes conventionnelles (voir `references/normes-presentation.md`) ;
2. **vraie et vérifiable** (aucun chiffre, résultat ou référence inventé) ;
3. **maîtrisée** par l'étudiant, car tout ce qui figure dans le document peut faire l'objet d'une question.

## Processus d'élaboration (ordre à respecter)

1. Choix du sujet et du directeur de recherche (DR)
2. Élaboration du plan → `references/plan-type.md`
3. Stratégie de recherche → `references/methodologie-recherche.md`
   - observation / collecte (documentaire, enquête, entretien, observation de terrain)
   - dépouillement / exploitation des données
   - rédaction
4. Présentation : les 22 pages conventionnelles dans l'ordre → `references/22-pages-conventionnelles.md`
5. Soutenance : préparation psychologique et intellectuelle → `references/soutenance.md`

## Comment travailler avec l'étudiant

**Avant d'écrire quoi que ce soit, recueillir le concret.** Le texte générique naît de l'absence de matière. Demander (ou chercher dans les fichiers fournis) :
- le sujet exact et le cas étudié (structure, ville, utilisateurs réels) ;
- ce qui a réellement été fait : entretiens (combien, avec qui), questionnaire (combien de réponses), stack réellement utilisée, ce qui fonctionne, ce qui ne fonctionne pas encore ;
- les diagrammes et captures d'écran réellement disponibles ;
- les sources réellement consultées.

Si une information manque, **laisser un marqueur visible** `[À COMPLÉTER : nombre de personnes interrogées]` plutôt que d'inventer. Ne jamais fabriquer : statistiques, résultats de tests, nombre d'enquêtés, logiciels d'analyse utilisés, références bibliographiques, nombre de pages d'un ouvrage.

**Écrire section par section**, jamais tout le mémoire d'un bloc. Pour chaque section : idée générale → arguments → exemples tirés du cas réel → connecteurs logiques.

**Respecter le schéma d'enchaînement de l'école**, sans le gonfler (voir `references/introduction-conclusion.md`) :
- partie : petite introduction annonçant les chapitres ;
- chapitre : petite introduction annonçant les sections ;
- section : contenu, puis **une** phrase de conclusion et **une** phrase de transition ;
- fin de chapitre / fin de partie : conclusion partielle + transition.
Ne jamais empiler « En résumé… En conclusion… En somme… » à la suite : une seule clôture par niveau.

## Tâches courantes

| Demande | Fichier à lire |
|---|---|
| Plan détaillé, numérotation décimale | `references/plan-type.md` |
| Introduction générale (7 étapes) ou conclusion générale (4 points) | `references/introduction-conclusion.md` |
| Problématique, objectifs, hypothèses, pertinence | `references/introduction-conclusion.md` (section Cadre théorique) |
| Page de couverture, avant-propos, dédicace, glossaire… | `references/22-pages-conventionnelles.md` |
| Fichier Word prêt à remplir aux normes (styles, marges, pagination I/01/i, sommaire et listes automatiques, consignes) | `assets/modele-memoire.docx` ; pour une autre école : modifier l'objet `ECOLE` de `scripts/generer_modele_word.js` puis `node scripts/generer_modele_word.js sortie.docx assets/drapeau-senegal.png` |
| Bibliographie, webographie, citations, plagiat | `references/normes-presentation.md` |
| Modélisation UML / Merise (cas d'utilisation, classes, séquence, activité, états, déploiement, passage à la base) | `references/uml.md` + exemple complet `assets/uml-exemple-pointage.md` (PlantUML + images dans `assets/uml-exemple/`) |
| Questionnaire, guide d'entretien | `references/methodologie-recherche.md` |
| Diapositives, allocution, questions du jury, fiche technique | `references/soutenance.md` + `assets/fiche-technique-soutenance.md` |
| Relire / corriger un chapitre existant | `references/erreurs-frequentes.md`, puis `scripts/verifier_memoire.py` |

## Relecture : procédure

Quand l'étudiant fournit un brouillon (.docx, .md ou .txt) :
1. Lancer `python3 scripts/verifier_memoire.py <fichier>` : repère les tics d'écriture génériques, les clôtures empilées, les marqueurs `[À COMPLÉTER]` restants, les titres absents ou mal numérotés et les coquilles connues des modèles (ex. « TELEINFORMQTIQUE »).
2. Vérifier à la main la grille de `references/erreurs-frequentes.md`, en particulier :
   - le plan détaillé et le sommaire correspondent-ils exactement aux titres du corps ?
   - la stack citée est-elle la même partout (architecture, implémentation, conclusion) ?
   - chaque diagramme annoncé est-il réellement présent, numéroté (Figure 2.1) et commenté ?
   - chaque résultat affirmé est-il appuyé par une capture, un tableau ou un chiffre mesuré ?
   - la conclusion répond-elle à la problématique posée dans l'introduction, et uniquement à celle-là ?
   - chaque référence bibliographique existe-t-elle vraiment (auteur, titre, éditeur, année, pages) ?
3. Rendre les corrections sous forme de liste priorisée (bloquant pour le jury → amélioration), avec la phrase d'origine et la proposition.

## Coordination avec les autres skills du pack

- `anti-generique` : à appliquer à tout texte produit pour le mémoire (tics à bannir, réécriture concrète).
- `bonnes-pratiques-dev` : pour le chapitre Mise en œuvre (extraits de code, architecture, tests, sécurité) et pour que le code montré au jury soit propre.

## Ce que ce skill ne fait pas

- Il ne rédige pas un mémoire « clé en main » sur un projet que l'étudiant n'a pas réalisé. Il aide à formuler, structurer et vérifier un travail réel.
- Il ne contourne pas le plagiat : toute reprise d'idée est citée, toute reprise de texte est entre guillemets avec sa source.

## Skills complémentaires

Pour préparer la soutenance, proposer en une phrase le skill `soutenance-grill-me` (Claude interroge l'étudiant sur son plan et ses choix comme un jury) s'il n'est pas installé : `/plugin install soutenance-grill-me@dev-memoire-kit`, puis `/grill-me`. Liste complète : `../bonnes-pratiques-dev/references/skills-complementaires.md`.
