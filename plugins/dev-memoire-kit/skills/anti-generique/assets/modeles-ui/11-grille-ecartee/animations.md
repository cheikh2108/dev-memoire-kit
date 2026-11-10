# Animations — modèle 11 « Grille qui s'écarte »

Valeurs du code d'origine (Codrops, MIT). Les courbes GSAP sont portées en fonctions exactes dans `COURBES` :

| Nom | Formule |
|---|---|
| `expo` | 1 − 2^(−10t) |
| `power3` | 1 − (1 − t)⁴ |
| `power4` | 1 − (1 − t)⁵ |
| `sine.in` | 1 − cos(t·π/2) |
| `elastic.out(0.5)` | 2^(−10t)·sin((t − s)·2π/0,3) + 1, avec s = 0,3/(2π)·asin(1) |

## Écartement d'une voisine

1. Distance `d` entre le centre de la voisine et celui de la vignette ouverte.
2. Force = `écart × (1 − d / distanceMax)`, jamais négative : au-delà de `distanceMax`, la voisine ne bouge plus.
3. Direction : l'angle entre les deux centres ; la voisine part du côté opposé (à gauche si elle est à gauche, etc.).
4. Rotation (si `rotationMax`) : tirée au hasard entre ±`rotationMax × (1 − d/500)`, arrondie.
5. Empilement : `z-index` de 998 (la plus proche) à 1 ; la vignette ouverte est à 999 dès le début, et ne repasse à 1 qu'à la fin de la fermeture.

## Les quatre réglages

| Grille | Durée | Courbe | Échelle | Rotation max | Écart | Distance max | Cisaillement |
|---|---|---|---|---|---|---|---|
| 1 | 0,7 s | expo | ×2 | 0 | 80 px | 500 px | — |
| 2 | 0,8 s | expo | ×1,5 | 8° | 100 px | 2 000 px | — |
| 3 | 1 s | elastic.out(0.5) | ×3 | 20° | 150 px | 700 px | — |
| 4 | 0,6 s | power3 | ×3,2 | 10° | 80 px | 500 px | 10° |

**Cisaillement (grille 4)** en deux temps : 40 % de la durée en `sine.in` jusqu'à mi-échelle avec un cisaillement de ±10° (signe inversé à la fermeture), puis 60 % en `power4` jusqu'à l'échelle finale, cisaillement 0.

## Règles

- Un nouveau clic interrompt l'animation en cours (les mêmes propriétés repartent de leur valeur actuelle).
- Cliquer une autre vignette : l'ancienne revient à l'échelle 1 en même temps que la nouvelle grandit.
- Pas d'animation d'entrée : la grille est là dès l'arrivée ; seul le clic anime.
