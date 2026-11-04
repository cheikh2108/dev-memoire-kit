# Animations — modèle 06 « Kàddu »

La référence est une **image fixe** : aucune animation n'est relevée. Tout ce qui suit est **ajouté**, sur le même principe que le modèle 05 (produit d'abord, texte ensuite), avec une seule courbe.

## Constantes

```ts
const SORTIE = [0.16, 1, 0.3, 1]; // arrivée longue et douce
```

## Ouverture du héros

| Départ | Élément | Mouvement | Durée |
|---|---|---|---|
| 0,1 s | surtitre du haut | x −20 px → 0, opacité | 0,6 s |
| 0,15 s | mot géant | y +40 px → 0, opacité | 0,8 s |
| 0,35 s | produit | y +60 px → 0, rotation −6° → −4°, opacité | 0,9 s |
| 0,6 s | bloc « SON HAUT DE GAMME » | x +20 px → 0 | 0,6 s |
| 0,7 → 1,0 s | surtitre, titre, paragraphe, boutons du bas | glissent de 20 px, 0,1 s d'écart | 0,6 s |
| 1,3 s → | produit | flotte : y 0 → −10 → 0 px, en boucle | 6 s par cycle |

## Au défilement et au survol

| Élément | Déclencheur | Mouvement | Durée |
|---|---|---|---|
| Garanties, bannière, pied de page | entrée dans l'écran (une fois, 30 % visible) | y 24 px → 0, opacité | 0,6 s |
| Cartes de catégorie, marques | idem | idem, 60 ms (cartes) et 50 ms (marques) d'écart | 0,6 s |
| Carte de catégorie | survol | vignette y −4 px ; produit échelle 1,06 et rotation −3° ; rond flèche passe en marine et tourne de −45° | 0,4 s |
| Boutons ‹ › | clic | le rail défile de 258 px (une carte + l'écart), défilement aimanté | natif |
| Rond flèche d'une carte | clic | +1 au panier ; la pastille repart de l'échelle 1,6 | défaut |
| Bouton rond du héros | survol | rotation −45° | défaut |
| Pilules « ACHETER », « Voir la collection » | survol | x +2 à 3 px | défaut |

## Points à retenir

- Une **seule boucle** sur la page (le produit qui flotte), lente et de faible amplitude ; tout le reste entre une fois.
- **Mouvement réduit** : `<MotionConfig reducedMotion="user">` supprime déplacements et boucle.
