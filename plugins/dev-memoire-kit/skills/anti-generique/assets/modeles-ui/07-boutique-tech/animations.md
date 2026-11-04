# Animations — modèle 07 « Leeral »

La référence est une **suite d'images fixes** : aucune animation n'est relevée. Tout est **ajouté**, avec une seule courbe et des entrées courtes, pour une page longue qu'on parcourt vite.

## Constantes

```ts
const EASE = [0.22, 1, 0.36, 1];
// entrée au défilement : y 24 px → 0, opacité, 0,55 s, une fois, 25 % visible
```

## Héros

| Départ | Élément | Mouvement | Durée |
|---|---|---|---|
| 0 s | disque gris | échelle 0,85 → 1, opacité | 0,9 s |
| 0,1 s | titre | y 30 px → 0 | 0,7 s |
| 0,2 s | sujet | y 40 px → 0 | 0,9 s |
| 0,3 / 0,42 / 0,54 s | paragraphe, pilule, avis | y 20 px → 0 | 0,6 s |
| 0,6 s + 60 ms par avatar | avatars | x −12 px → 0 | défaut |
| 0,5 s + 80 ms par bulle | bulles | échelle 0,4 → 1, puis flottent (y 0 → −8 → 0) | 5 à 10 s par cycle |

## Sections

| Élément | Déclencheur | Mouvement |
|---|---|---|
| Titres de section, cartes, bannières | entrée dans l'écran | y 24 px → 0, opacité ; 50 à 60 ms entre cartes d'une même rangée |
| Tuile de la mosaïque | survol | produit échelle 1,06 (0,5 s) ; le rond ↗ apparaît (échelle 0,6 → 1) |
| Bouton « sac » | clic | +1 au panier ; la pastille du panier apparaît par échelle |
| Pastille de couleur | clic | l'anneau glisse vers la teinte choisie (`layoutId`, ressort 500/35) ; le produit sort vers le haut et la nouvelle teinte entre par le bas (0,3 s) |
| Boutons ← → | clic | le rail défile d'une carte (478 px), défilement aimanté |
| Bannière bleue | clic sur un point | fondu 0,4 s ; mot fantôme x −40 → 0 (0,9 s) ; textes en cascade 0,1 / 0,2 / 0,3 s ; produit x 60 px et rotation 8° → 0 |
| Carte catégorie | survol | sa hauteur passe à 455 px (celle de la plus haute), 0,45 s |
| Carte de bonne affaire | survol | produit échelle 1,05, rotation −2° |
| Carte de gamme | survol | produit y −6 px |
| Pilules | survol / appui | échelle 1,04 / 0,97 |
| Ronds des réseaux | survol | y −3 px |

## Points à retenir

- Sur une page de dix sections, **rien ne doit rejouer** au retour : `viewport={{ once: true }}` partout.
- Les seules boucles sont les bulles du héros, lentes et de faible amplitude.
- **Mouvement réduit** : `<MotionConfig reducedMotion="user">`.
