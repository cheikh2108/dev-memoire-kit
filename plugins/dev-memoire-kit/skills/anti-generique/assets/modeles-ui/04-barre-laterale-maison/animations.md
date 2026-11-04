# Animations — modèle 04 « Kër »

Mesures sur la vidéo de référence (30 i/s, 18 s) : dépliage du rail vers 1,9 s, ouverture de l'accordéon vers 3,4 s, défilement de la liste de 5,5 à 6,1 s, sortie de la fenêtre de détail de 7,17 à 7,43 s (environ 0,27 s), compteur et barres de 7,6 à 8 s, changement de survol du graphique vers 9,7 s, repliement en rail de 10,47 à 10,83 s (environ 0,36 s).

## Constantes

```ts
const EASE = [0.32, 0.72, 0, 1];  // départ rapide, arrivée très douce (largeur, accordéon, fenêtre)
const RESSORT = { type: "spring", stiffness: 520, damping: 40, mass: 0.8 }; // pilules qui glissent, sans rebond visible
const D = { largeur: 0.38, texte: 0.2, fenetre: 0.28, compteur: 0.9 };
```

## Tableau

| Élément | Déclencheur | Ce qui change | Durée | Courbe |
|---|---|---|---|---|
| Panneau | bouton replier, avatar, ⌘K | largeur 76 ↔ 380 px | 0,38 s | `EASE` |
| Libellés, valeurs, marque | dépliage | opacité 0 → 1, x −6 → 0 px, **après** le début du dépliage (80 à 120 ms) ; au repliement ils disparaissent en 80 ms, **avant** que la largeur se réduise | 0,2 s | défaut |
| Pilule active noire | clic sur une entrée | position partagée (`layoutId`), glisse vers la nouvelle ligne | ≈ 0,3 s | ressort |
| Pilule de survol blanche | survol | position partagée, suit le pointeur de ligne en ligne | ≈ 0,3 s | ressort |
| Chevron « Pièces » | clic | rotation 0 → 180° | 0,25 s | `EASE` |
| Sous-liste | clic | hauteur 0 → auto, opacité ; puis chaque pièce y −4 → 0 px avec 40 ms de décalage | 0,3 s / 0,22 s | `EASE` |
| Fenêtre de détail | entrée « Énergie » active | opacité 0 → 1, échelle 0,94 → 1 depuis le bord gauche, x −8 → 0 px, **flou 10 px → 0** ; alignée verticalement sur la ligne active | 0,28 s | `EASE` |
| Compteur | ouverture de la fenêtre | 0 → 12,4 (une décimale, format français) | 0,9 s | `[0.16, 1, 0.3, 1]` |
| Barres | ouverture de la fenêtre | `scaleY` 0 → 1 depuis le bas, 12 ms de décalage | 0,45 s | `EASE` |
| Bulle du graphique | survol d'une barre | position (gauche et hauteur) | 0,18 s | `EASE` |
| Rail replié | repliement | l'entrée active garde son disque citron vert, cerclé de noir ; la fenêtre de détail se ferme | — | — |

## Points à retenir

- **Ordre du texte et de la largeur** : le texte part avant que le panneau se rétracte et revient après qu'il a commencé à s'ouvrir ; sinon les libellés se compressent ou débordent pendant l'animation.
- **Un seul élément glisse à la fois** : la pilule active et la pilule de survol sont deux éléments partagés distincts ; la pilule de survol ne s'affiche pas sur la ligne active.
- **Le flou d'entrée** (10 px → 0) donne à la fenêtre l'air de « sortir » du verre ; à réserver aux fenêtres de détail, pas aux contenus qui se rechargent.
- **Mouvement réduit** : `<MotionConfig reducedMotion="user">` coupe les déplacements ; la largeur change alors sans transition.
