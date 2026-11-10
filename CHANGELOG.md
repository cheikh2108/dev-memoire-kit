# Historique des versions

## 1.17.0 — 10/11/2026
### Ajouts
- **anti-generique**, cinq modèles d'interface adaptés de démos **Codrops sous licence MIT** (crédits dans chaque modèle et dans `THIRD_PARTY_NOTICES.md`), réécrits en React/TypeScript avec contenus et illustrations originaux :
  - 09 « Texte LCD » : lettres qui se mélangent ou glissent avant de se fixer, six effets, moteur réutilisable sans dépendance ;
  - 10 « Grille 3D avec aperçu » : seize affiches en perspective qui dérivent avec la souris, effet magnétique, curseur à étiquette, ouverture en aperçu ;
  - 11 « Grille qui s'écarte » : la vignette cliquée grandit et pousse ses voisines, quatre réglages, courbes GSAP portées en fonctions exactes ;
  - 12 « Menu arrondi » : pilule orange, image plein écran qui se découvre, panneau qui descend, fermeture en lecture inversée, tissus wax en SVG ;
  - 13 « Infobulle en pixels » : fond en cellules, six effets dont un filtre « gluant », texte qui grésille, page de terminal.
### Modifications
- Index des modèles : règle sur l'adaptation des démos sous licence libre (attribution obligatoire, vérifier la licence dans le dépôt).

## 1.16.0 — 04/11/2026
### Ajouts
- **anti-generique**, modèle d'interface 08 « Onglets en verre » : quatre barres de navigation basses en verre, utilisables séparément (trait néon qui se soulève en cloche sous l'onglet actif avec champ de recherche, projecteur et cône de lumière, pastille posée dans un creux qui suit l'onglet, goutte liquide qui se détache et retombe grâce à un filtre SVG « gluant »), formes recalculées à chaque image, durées relevées sur la vidéo, décor de salon dessiné en CSS.

## 1.15.0 — 04/11/2026
### Ajouts
- **anti-generique**, modèle d'interface 07 « Leeral » : page d'accueil e-commerce claire et multi-rayons (héros blanc avec disque gris et bulles, mosaïque « nos choix » 4 × 3, rail de nouveautés à pastilles de couleur et anneau partagé, bannière bleu acier pleine largeur à mot fantôme et diaporama, catégories à hauteurs variées alignées en bas, promotions bord à bord, tendances 3 × 2, grande carte de fête, bonnes affaires, bannière beige, gamme, pied de page avec lettre d'information) ; tous les produits en SVG, noms inventés, prix en francs CFA.

## 1.14.0 — 04/11/2026
### Ajouts
- **anti-generique**, modèle d'interface 06 « Kàddu » : landing e-commerce d'électronique (héros bleu profond avec mot géant condensé derrière le produit, bloc « haut de gamme » à filet vertical, barre de garanties, rail de catégories qui déborde du cadre avec boutons de défilement, bannière bleu glacier, rangée de marques, pied de page noir arrondi) ; produits en SVG, marques inventées, animations signalées comme ajouts (référence fixe).

## 1.13.0 — 04/11/2026
### Ajouts
- **anti-generique**, modèle d'interface 05 « Maison Éclat » : landing page de joaillerie (héros vert nuit avec halo et mot géant en serif derrière le produit, séquence d'ouverture minutée d'après la vidéo, cartes en verre fumé, séparateurs en chaîne d'or en CSS, grille de créations, carte Nouveautés, collections, pied de page avec abonnement et logo calligraphié) ; bijoux dessinés en SVG, aucune photo ni nom de marque tiers.
- Règle des modèles : ne reprendre ni photos ni noms de collections déposés.

## 1.12.0 — 04/11/2026
### Ajouts
- **anti-generique**, modèle d'interface 04 « Kër » : barre latérale de maison connectée (rail de 76 px qui se déplie en verre dépoli, pilule active noire et pilule de survol qui glissent, pièces en accordéon, fenêtre de détail noire alignée sur l'entrée active avec compteur et graphique hachuré, raccourci ⌘K), avec relevé élément par élément, fiches style et animations.

## 1.11.0 — 04/11/2026
### Modifications
- **Modèles d'interface refaits à l'identique de leurs références**, vue par vue, avec un relevé élément par élément dans chaque `README.md` :
  - 01 « Atelier » : 4 vues (vue d'ensemble, projets, capacité de l'équipe, revues clients), coquille complète (menu, création, recherche, historique, partage), jauges sur disque noir, disques concentriques, sphère de budget, planning à puces déplaçables, interrupteurs d'accès client, cases de revue.
  - 02 « Relais » : 4 vues (service, boîte de réception, fiche client, performance de l'équipe), bascule P25 / médiane / P75, contexte client, brouillon de réponse, statuts d'agents, planning horaire.
  - 03 « Parking Plateau » : 4 vues (garage, sessions, réservations, recettes), barre latérale complète, démonstration guidée sur la maquette 3D, étiquette flottante, plan des places, quatre graphiques, chronologie des réservations, tarif ; 96 places et indicateurs calculés depuis les données.
- Procédure « Ajouter un modèle » : relevé complet de la vidéo, comparaison côte à côte, cohérence des chiffres.

## 1.10.0 — 04/11/2026
### Ajouts
- **anti-generique**, modèles d'interface :
  - Modèle 02 « Relais » : tableau de bord de support (indicateurs à exposant, graphique pleine largeur révélé par découpe, boîte de réception avec délais SLA, toast d'annulation).
  - Modèle 03 « Parking Plateau » : tableau de bord d'exploitation avec maquette 3D `three` (caméra bornée et amortie, vue éclatée, isolement de niveau, clic sur une place).

## 1.9.0 — 04/11/2026
### Ajouts
- **anti-generique** : bibliothèque de **modèles d'interface animés** (`assets/modeles-ui/`), reconstruits à partir de vidéos de référence (structure, tokens et timings relevés image par image ; nom, données et code réécrits).
  - Modèle 01 « Atelier » : tableau de bord clair en cartes, phrase d'accueil par vue, jauge, compteurs, cascade d'entrée (React + `motion`), avec fiches style et animations.
  - Règle du skill : pour un tableau de bord ou un écran, partir du modèle le plus proche et l'adapter.

## 1.8.0 — 01/11/2026
### Modifications
- **redaction-memoire** (`uml.md`) aligné sur la norme **UML 2.5.1** (OMG, formal/2017-12-05) :
  - référence de la norme et format de citation en webographie ;
  - les 14 diagrammes d'UML 2.5 par famille, et la question « pourquoi ces diagrammes ? » ;
  - message de création noté selon la norme (flèche pointillée vers la tête de la nouvelle ligne de vie) ;
  - fragments `par` et `break`, liste des autres opérateurs ;
  - condition et point d'extension d'un `extend` ;
  - sémantique de l'agrégation (non définie par la norme) comme argument pour la simple association ;
  - nouvelles questions du jury.
- Exemple « pointage » : diagramme de séquence corrigé (création de `p:Presence`) et redessiné.

## 1.7.0 — 15/10/2026
Corrections issues de la relecture d'un brouillon complet rédigé avec le plugin.
### Vérificateur (`verifier_memoire.py`)
- Lit directement les PDF ; signale une police autre que Times New Roman (rendu LibreOffice).
- Plan en parties reconnu (« Première partie ») et signalé comme ancien modèle ; la structure n'est plus analysée après la bibliographie (« I. Ouvrages » ne passe plus pour un chapitre).
- Marqueurs `[À COMPLÉTER]` coupés sur plusieurs lignes détectés.
- Nouveau contrôle « restes du modèle et notes de travail » (« Prénom NOM », « [Insérer… », « à retirer », consignes entre crochets…).
- Tous les codes cités (UC-01, PAI-04…) contrôlés, pas seulement EF ; alerte si aucun tableau d'exigences.
### Règles du skill
- Marqueurs courts (3 à 8 mots) ; aucune note de travail dans le document ; identité du mémoire jamais laissée en marqueur.
- Interdiction d'attribuer des décisions au directeur sans confirmation ; documents internes annexés ou non cités.
- Section 1.4.3 Hypothèses de travail (facultative), revue en 3.4 ; une seule question centrale de problématique.
- Variante en parties : emplacement des exigences et des tests ; table de migration vers le plan en trois chapitres.
- UML : acteur Horloge pour les tâches planifiées, une étape par ligne dans les fiches, lisibilité ≥ 8 pt à l'impression.
- Tests : captures réelles, thème clair, jamais recomposées ; webographie avec titre ; PDF exporté depuis Word.
- README : commandes de mise à jour du plugin.

## 1.6.1 — 15/10/2026
### Corrections
- Modèle Word : titres de sous-section (niveau 3) en taille 14 comme les autres titres, conformément au guide.

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
