# Style — modèle 05 « Maison Éclat »

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| (héros, fond) | dégradé radial `#1F6A3C` → `#0E2E19` → `#08160D` | Fond du héros |
| (héros, halo) | `rgba(126,226,158,.75)` → transparent | Lumière derrière le sujet |
| (mot géant) | dégradé horizontal `#1E6B3E` → `#7EE29E` (centre) → `#1E6B3E` | Texte en `background-clip: text` |
| `--or` | `#E3B04B` | Logo, flèche d'accroche ; dégradés or des illustrations `#FFF1B8 → #E8B94A → #B07A1E` |
| `--peche` | `#F7BF8C` | Bouton d'action du héros, pastille du panier, logo du pied de page |
| `--clair` | `#E9EAE8` | Fond des sections claires, avec motif en losanges `#D9DAD7` |
| (cartes claires) | dégradé `rgba(236,245,239,.9)` → `rgba(226,236,229,.8)`, liseré blanc | Cartes des créations, carte Nouveautés |
| (bouton vert) | `#16C467` → `#1FD98A`, ombre verte | Action de la carte Nouveautés |
| (tuiles nuit) | radial `#1D5A36` → `#0B2616` → `#06140B` | Collections emblématiques |
| (pied de page) | radial `#1E7A44` → `#0D3A1E` → `#081C10` | Fond du pied de page |

## Verre fumé (sur fond sombre)

```css
background: rgba(255, 255, 255, .10);
backdrop-filter: blur(14px);
border: 1px solid rgba(255, 255, 255, .14);
border-radius: 26px;
box-shadow: 0 20px 40px rgba(0, 0, 0, .18);
```

## Chaîne d'or (séparateur)

Hauteur 22 px ; deux rangées d'ellipses dorées décalées d'un demi-maillon (13 px de pas), sur un fond dégradé `#E9C567 → #B7862A`, ombre `0 2px 6px rgba(0,0,0,.25)`. Tout en CSS (`radial-gradient` répétés), sans image.

## Typographie

| Rôle | Police | Taille |
|---|---|---|
| Mot géant | Playfair Display 400 | 250 px, chasse −0,04 em, interlignage 0,95 |
| Petit mot du titre | Poppins 400 | 40 px, blanc |
| Logo | Great Vibes (mot) + Playfair Display (surtitre) | 44 px / 11 px ; pied de page 120 px / 26 px |
| Titres de section | Playfair Display 400 | 46 px ; Nouveautés 40 px graisse 700 |
| Noms de cartes, textes d'ambiance | Playfair Display 400 | 17 à 22 px ; 11 px dans le verre |
| Navigation, sous-titres, formulaires | Poppins 400–600 | 12 à 18 px |

## Formes

| Élément | Rayon |
|---|---|
| Héros (coins supérieurs) | 56 px |
| Tuiles des collections | 52 px |
| Carte Nouveautés | 44 px |
| Cartes des créations | 40 px |
| Cartes en verre | 26 px |
| Boutons, champs, sélecteurs | pilule |
