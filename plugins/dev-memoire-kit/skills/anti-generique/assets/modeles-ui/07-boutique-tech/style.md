# Style — modèle 07 « Leeral »

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--page` | `#DCE2F9` | Fond lavande autour du conteneur |
| `--encre` | `#0A0A0A` | Textes, pilules, bouton → , rosace du logo |
| `--gris` | `#6B6B6B` | Nom de teinte, ancien prix |
| `--carte` | `#F6F6F6` | Cartes produit, grande carte, gamme |
| `--trait` | `#E8E8E8` | Filet de navigation, contours, filets des cartes |
| `--beige` | `#EDE8E1` | Bannière « netteté », carte promotion |
| `--acier` | `#567C9E` | Bannière pleine largeur ; mot fantôme `rgba(20,40,60,.14)` |
| `--corail` | `#E5484D` | Le seul chiffre en couleur (« 19 k+ ») |
| (recherche, ronds) | `#F5F5F5` | Champ et boutons de la navigation |
| (bulles) | `#EEEAE2` plein · contour `#1A1A1A` · point `#DCDCDC` | Décor du héros |

## Typographie (Urbanist)

| Rôle | Graisse | Taille |
|---|---|---|
| Titre du héros | 500 | 78 px, interlignage 1,08, chasse −0,02 em |
| Titres de section | 500 | 68 px |
| Titres de bannière et grande carte | 500 | 64–72 px |
| Titre de la grande tuile | 500 | 46 px, blanc |
| Titres des promotions | 500 | 44 px |
| Noms de produits | 600–700 | 20–22 px |
| Prix | 800 italique | 22–24 px |
| Textes, liens | 400–500 | 14–16 px |

## Grilles

- Marges du contenu : **96 px** ; écart entre sections : **120 px** ; titre → contenu : **64 px**.
- Mosaïque : `grid-template-columns: repeat(4, 1fr)`, `grid-template-rows: repeat(3, 310px)`, `gap: 16px`, zones `"g g l l" "g g h p" "b b h q"`.
- Rail : cartes de 460 px, écart 20 px, `scroll-snap-type: x mandatory`, pas de marge à droite (déborde).
- Catégories : 4 colonnes, écart 46 px, `align-items: end`.
- Tendances, bonnes affaires : 3 colonnes, écart 20 px ; gamme : 4 colonnes.

## Formes

| Élément | Rayon |
|---|---|
| Conteneur | 40 px |
| Toutes les cartes et bannières (sauf la bleue, à angles droits) | 24 px |
| Pilules, recherche, lettre | 999 px |
| Ronds (navigation 48 px, réseaux 46 px, sac 46 px, ↗ 64 px) | 50 % |
