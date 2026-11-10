# Style — modèle 11 « Grille qui s'écarte »

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--fond` | `#EDEDED` | Fond de page |
| `--texte` | `#000000` | Texte, liens |
| (fonds des pièces) | 14 tons francs : rose `#F3C6C0`, bleu `#9FD3E6`, jaune `#F6D65A`, crème `#E9E3D8`, orange `#F08A5D`, vert d'eau `#B8E0C8`, bleu nuit `#2F4B7C`, rose vif `#F7A7C8`, sable `#D9D2C5`, sarcelle `#5FB0A6`, abricot `#FFE3B3`, lavande `#C9B7E8`, noir `#1E1E1E`, framboise `#E85D75` | Une couleur par vignette, en boucle |

La page est neutre ; toute la couleur vient des vignettes, comme les photos pastel de la démo d'origine.

## Typographie

| Rôle | Police | Taille |
|---|---|---|
| Phrase d'accroche | Fraunces 300 (serif) | `clamp(1rem, 5vw, 2.5rem)`, interlignage 1,1, coupure des mots automatique |
| Intertitre | Inter 400 | 1 rem |
| « voir plus » | Inter 700 | 1 rem, aligné à droite |

## Grilles

| Grille | Colonnes | Largeur | Nombre de pièces |
|---|---|---|---|
| 1 | 13 | 92 % | 39 |
| 2 | 6 | 92 % | 18 |
| 3 | 7 | 60 % | 21 |
| 4 | 13 | 92 % | 39 |

Écart 1 rem ; vignettes `aspect-ratio: 1 / 1.25`, sans coins arrondis. Sous 848 px, toutes les grilles passent à 4 colonnes sur toute la largeur.
