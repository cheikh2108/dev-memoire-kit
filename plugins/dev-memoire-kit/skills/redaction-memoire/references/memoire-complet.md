# Rédiger un mémoire complet, de bout en bout

Procédure quand l'étudiant veut le mémoire entier (et pas une section). Le mémoire porte sur un projet **réellement réalisé** : Claude structure, rédige et vérifie à partir des faits fournis, il n'invente ni le projet, ni les chiffres, ni les sources.

## Étape 1 — Recueillir les faits
1. Demander la **fiche projet** remplie (`../assets/fiche-projet.md`), ou poser ses questions par blocs, ou extraire les faits des documents fournis (cahier des charges, code, captures, résultats d'enquête, ancien brouillon).
2. Lister ce qui manque. Ne pas bloquer : ce qui manque deviendra `[À COMPLÉTER : …]` et sera rappelé à la fin.

## Étape 2 — Fixer le plan
1. Plan en trois chapitres (`plan-type.md`), adapté au sujet : intitulés des sections 1.6.x, 2.1.x, des flux 3.3.x selon les acteurs réels.
2. Le soumettre à l'étudiant (et lui rappeler de le faire valider par son directeur) avant de rédiger.

## Étape 3 — Construire le registre de cohérence
Avant d'écrire, fixer une fois pour toutes, et réutiliser partout à l'identique :
- **la problématique** (une question) et **l'hypothèse** ;
- **les objectifs spécifiques** = les étapes du travail (voir plus bas) ;
- **les acteurs** (mêmes noms dans le texte, les tableaux et les diagrammes) ;
- **les exigences** EF01… et ENF01… avec leur module ;
- **la pile technique** avec versions ;
- **les compteurs** de figures et de tableaux par chapitre (Figure 2.1, 2.2… ; Tableau 3.1…).
Ce registre se tient dans la conversation (ou un fichier de travail) et sert à chaque chapitre.

## Étape 4 — Rédiger dans le modèle, dans cet ordre
Toujours dans une copie de `../assets/modele-memoire.docx` (SKILL.md, « Document Word »). Ordre recommandé, parce que chaque partie s'appuie sur la précédente :
1. **Chapitre 1** (cadrage) ;
2. **Chapitre 2** (analyse et conception) : tableaux d'exigences, fiches de cas d'utilisation, emplacements des diagrammes ;
3. **Chapitre 3** (réalisation) : outils, architecture, écrans par flux avec renvoi aux EF, tests ;
4. **Introduction générale** puis **conclusion générale**, écrites **après** le développement, pour qu'elles annoncent et résument ce qui existe vraiment ;
5. **Pages liminaires** : résumé et abstract (à partir de l'introduction et de la conclusion), avant-propos, dédicace et remerciements (à partir des noms fournis), glossaire (relever tous les sigles du texte) ;
6. **Pages finales** : bibliographie et webographie (sources fournies uniquement), annexes (questionnaire, guide d'entretien, écrans secondaires).

Chaque section suit son gabarit (`modeles-de-chapitres.md`) et le skill `anti-generique` (pas de formules creuses). Rendre au fur et à mesure, chapitre par chapitre, pour que l'étudiant corrige tôt.

## Étape 5 — Vérifier avant de livrer
1. `python3 ../scripts/verifier_memoire.py memoire-<nom>.docx` : numérotation, annonces de sections, codes EF, coquilles, clôtures empilées, tics.
2. Contrôles croisés à la main :
   - chaque EF cité existe ; chaque écran du chapitre 3 a son EF ; chaque ENF chiffrée est vérifiée en 3.4 ;
   - les acteurs, les classes et la pile sont nommés de la même façon partout ;
   - l'introduction annonce les vrais titres de chapitres ; la conclusion répond à la problématique ;
   - les objectifs spécifiques sont des étapes et la conclusion dit lesquelles ont été atteintes.
3. Livrer le .docx et la **liste des `[À COMPLÉTER]`** restants, regroupés par page, avec ce qu'il faut fournir pour chacun ; rappeler la mise à jour des champs (F9) et l'insertion des figures (diagrammes, captures).

## Objectifs spécifiques : des étapes, pas des fonctionnalités

C'est l'erreur la plus fréquente, même dans les propositions de plan. Les objectifs spécifiques décrivent **la démarche** qui mène à l'objectif général ; les fonctionnalités vont dans les exigences fonctionnelles (2.4.1).

| ❌ Fonctionnalités (à mettre en 2.4.1) | ✅ Objectifs spécifiques (étapes) |
|---|---|
| Consulter les créneaux disponibles | Analyser le processus actuel de réservation et les solutions existantes |
| Réserver et payer en ligne | Recueillir et analyser les besoins des joueurs et des gérants |
| Gérer les créneaux côté gérant | Modéliser le système avec UML |
| Recevoir une notification | Développer l'application mobile et son back-office |
| | Tester et valider la solution auprès d'utilisateurs |

Formulation : « **Intitulé** : il s'agit de + verbe à l'infinitif + complément propre au sujet ». Quatre ou cinq, dans l'ordre chronologique du travail.
