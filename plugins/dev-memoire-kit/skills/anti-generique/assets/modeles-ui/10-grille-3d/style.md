# Style — modèle 10 « Grille 3D »

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--fond` | `#DCDCDC` | Fond de page |
| `--texte` | `#000000` | Texte, titre de l'aperçu, bouton |
| `--texte-doux` | `#848484` | Lieu et date dans l'aperçu |
| `--titre` | `#D3D3D3` | Titre de fond, à peine visible |
| `--lien` | `#E3154D` | Liens, « + Infos », cercle du curseur |

Les affiches ont chacune trois couleurs (fond, encre, accent) ; garder des fonds francs et variés, c'est ce qui fait vivre la grille sur le gris.

## Typographie

| Rôle | Police | Taille |
|---|---|---|
| Titre de fond | Archivo Black, capitales | 12 vw, interlignage 1 |
| Titre de l'aperçu | Archivo Black | min(20 vh, 85 vw ÷ (0,72 × nombre de lettres)), plafonné à 9 vw |
| Texte, liens | Inter 400–500 | 14–16 px ; méta et boutons en capitales 0,8 rem |

## Grille et formes

- Conteneur de grille : `width/height: 120%`, `top/left: -10%`, `grid-template: repeat(50, 2%) / repeat(50, 2%)`, `perspective: 1000px`.
- Vignette : `grid-area: rangée / colonne / span 12 / span 5` ; à 1 440 × 900, environ 173 × 259 px ; coins 10 px.
- Aperçu : deux colonnes (`min(33vw, 480px)` et le reste), image de 75 vh de haut, coins 10 px, `transform-origin: 50% 100%` pour qu'elle se redresse depuis le bas.
- Curseur : SVG 80 × 80, cercle `r=20`, trait 1 px qui ne grossit pas avec l'échelle (`vector-effect: non-scaling-stroke`).
