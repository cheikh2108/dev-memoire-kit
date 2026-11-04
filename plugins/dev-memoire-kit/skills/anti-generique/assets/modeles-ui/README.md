# Modèles d'interface

Bibliothèque de modèles d'écrans animés, reconstruits à partir de références vidéo choisies pour la qualité de leur mise en page et de leurs animations. Chaque modèle est une **reconstruction originale** : la structure, les tokens et les timings sont relevés image par image ; le nom, les données et le code sont réécrits.

## Quand s'en servir

Dès qu'on demande un tableau de bord, un écran d'application, une landing page ou un composant animé : **partir du modèle le plus proche et l'adapter**, plutôt que de générer une interface de zéro (qui retombe sur la carte blanche à ombre grise, le dégradé violet et les animations au hasard).

1. Choisir le modèle dans le tableau ci-dessous selon le **type d'écran** et l'**usage**.
2. Lire son `README.md` (quand le choisir, structure, ce qu'il faut adapter), puis `style.md` et `animations.md`.
3. Partir de `exemple.tsx` : garder la structure, les tokens et les durées ; remplacer les données, les libellés, l'accent et la phrase d'accueil par ceux du projet.
4. Si aucun modèle ne convient, le dire, et reprendre seulement les règles de mouvement communes (en bas).

## Modèles

| N° | Modèle | Type | Points forts | Pile |
|---|---|---|---|---|
| 01 | [Tableau « Atelier »](01-tableau-atelier/README.md) | Tableau de bord clair, pilotage d'équipe | Phrase d'accueil qui change par vue, grille de cartes arrondies, accent unique, jauge et compteurs, cascade d'entrée | React + `motion` |
| 02 | [Support « Relais »](02-support-relais/README.md) | Tableau de bord de service avec délais (support, tickets, réclamations) | Indicateurs géants à exposant, graphique pleine largeur révélé par découpe, boîte de réception avec délais SLA, accent jaune surligneur | React + `motion` |
| 03 | [Parking « Plateau » en 3D](03-parking-3d/README.md) | Exploitation d'un lieu physique (parking, entrepôt, salles) | Maquette 3D cliquable, caméra bornée avec amorti, vue éclatée, isolement de niveau, panneau de détail | React + `three` + `motion` |

## Règles de mouvement communes

- Une seule courbe pour toute l'interface (par défaut `[0.22, 1, 0.36, 1]`), pas de rebond sur un outil de travail.
- Entrées courtes : 0,3 à 0,6 s, déplacement de 8 à 24 px, cascade de 30 à 60 ms dans l'ordre de lecture.
- Les éléments entrent une fois, puis l'écran reste immobile ; rien ne boucle sauf un indicateur d'état (curseur, chargement).
- Caméra 3D : préréglages de position et amorti exponentiel plutôt que des durées fixes (modèle 03).
- Respecter `prefers-reduced-motion` (`<MotionConfig reducedMotion="user">` avec `motion`).

## Ajouter un modèle

Un dossier `NN-nom/` avec `README.md`, `style.md`, `animations.md`, `exemple.tsx` et une capture du rendu. Les mesures viennent de la vidéo (images extraites avec `ffmpeg`, écart entre images pour dater les transitions). Ne jamais copier le logo, le nom, les textes ou le code source d'un produit tiers : seulement les principes, sous un nom et des données inventés.
