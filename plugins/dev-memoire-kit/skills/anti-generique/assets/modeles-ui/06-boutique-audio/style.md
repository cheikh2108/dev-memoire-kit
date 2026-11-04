# Style — modèle 06 « Kàddu »

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--page` | `#EAF2FB` | Fond autour du conteneur |
| (héros) | linéaire `#0A3A8C` → `#06235E` → `#0B4FB5`, + radial `#4DA3FF` en haut à droite, + radial `#1D6FE0` au centre | Fond du héros |
| `--marine` | `#0B2E6F` | Bouton de la bannière, survol des ronds flèche, chiffre du panier |
| `--encre` | `#111827` | Textes sur fond clair |
| `--muet` | `#6B7280` | Détails des garanties |
| `--trait` | `#D5DCE6` | Liserés, filets, ronds à contour |
| `--carte` | `#F3F5F8` | Fond des cartes de catégorie |
| (bannière) | `#DDEBFA` → `#E7F0FA` → `#C9DDF2` | Fond bleu glacier |
| `--noir` | `#07080B` | Pied de page, mots-symboles |
| (icône du logo) | `#F5B83D` | Seule touche chaude, dans le pied de page |

## Typographie

| Rôle | Police | Taille |
|---|---|---|
| Mot géant | Anton 400 | 290 px, interlignage 1 |
| Titre du héros | Inter Tight 900 | 46 px, chasse −0,035 em, deux lignes sans retour automatique |
| Titre de bannière | Inter Tight 900 | 60 px, interlignage 0,95 |
| Bloc « SON HAUT DE GAMME » | Inter Tight 700 | 17 px, capitales |
| Surtitres, étiquettes | Inter Tight 500–600 | 11–13 px, chasse 0,32 à 0,42 em, suivis d'un trait de 56 px |
| Navigation, textes | Inter Tight 400–600 | 12 à 15 px |
| Marque | Inter Tight 800 | 30 px |

## Formes

| Élément | Rayon |
|---|---|
| Conteneur, héros | 44 px |
| Pied de page | 40 px |
| Bannière | 30 px |
| Cartes de catégorie | 22 px (vignette 16 px) |
| Barre de garanties | 20 px |
| Boutons | pilule ; ronds 30, 40 et 52 px |

## Ombres

- Produit du héros : `drop-shadow(0 40px 50px rgba(3,20,60,.55))` + ellipse floue au sol.
- Conteneur : `0 30px 70px rgba(11,46,111,.12)`.
- Vignettes : ombre intérieure `inset 0 -20px 40px rgba(0,0,0,.08)`.
