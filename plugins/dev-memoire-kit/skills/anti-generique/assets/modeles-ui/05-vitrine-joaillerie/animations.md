# Animations — modèle 05 « Maison Éclat »

La vidéo de référence (14 s, boucle de 5 s) montre la **séquence d'ouverture du héros**, mesurée image par image (5 i/s puis écart d'une image à l'autre). Les apparitions au défilement et les survols plus bas dans la page ne sont pas montrés dans la vidéo : ils sont **ajoutés** pour que la page vive, avec la même courbe.

## Constantes

```ts
const SORTIE = [0.16, 1, 0.3, 1];  // arrivée longue et douce, aucune secousse
const T = { photo: 0.5, mot: 1.2, vague1: 2.0, vague2: 2.75, appel: 3.55 }; // départs (s)
```

## Séquence d'ouverture (relevée)

| Moment | Élément | Mouvement | Durée |
|---|---|---|---|
| 0 → 0,4 s | fond et halo | seuls à l'écran | — |
| 0,5 s | sujet (photo du produit) | monte depuis le bas (y +260 px → 0), opacité 0 → 1 | 0,5 s |
| 1,2 s | mot géant + petit mot | descendent depuis le haut (y −60 px → 0), opacité 0 → 1 | 0,6 s |
| 2,0 s | navigation | descend de 16 px | 0,5 s |
| 2,0 s | carte produit (droite) / carte texte (gauche) | glissent de 40 px depuis leur bord | 0,5 s |
| 2,75 s | accroche (gauche) / carte communauté (droite) | glissent de 16 et 40 px depuis leur bord | 0,5 s |
| 3,55 s | bouton « Découvrir » | monte de 16 px | 0,5 s |

Ordre à respecter : **le produit d'abord, le mot ensuite, l'interface en dernier**. L'œil se pose sur le bijou avant de lire quoi que ce soit.

## Ajouts (non montrés dans la vidéo)

| Élément | Déclencheur | Mouvement | Durée |
|---|---|---|---|
| Titres, cartes et tuiles des sections claires | entrée dans l'écran (une seule fois, 30 % visible) | y 24 px → 0, opacité ; 60 ms de décalage entre cartes | 0,6 s |
| Bijou d'une carte de création | survol de la carte | échelle 1,06, y −4 px | 0,35 s |
| Tuile de collection | survol | y −4 px | défaut |
| Bouton vert « Voir les nouveautés » | survol | x +4 px | défaut |
| Éclats du bracelet | permanent | opacité 0 ↔ 1 | 2,4 s par cycle |
| Bouton ↻ du héros | clic | rejoue toute la séquence d'ouverture (`key` changée) | — |

## Points à retenir

- La séquence dure **4 s au total** : acceptable une fois, à l'arrivée sur la page ; ne pas la rejouer à chaque retour sur le héros.
- Les cartes en verre glissent **depuis leur propre bord** (droite pour les cartes de droite), jamais en travers de l'écran.
- **Mouvement réduit** : `<MotionConfig reducedMotion="user">` supprime les déplacements ; le scintillement est coupé en CSS.
