# Style — modèle 13 « Infobulle en pixels »

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--fond` | `#0F0026` | Fond de page |
| `--texte` | `#8572B2` | Texte courant |
| `--declencheur` | `#D2D2D2` | Mots qui ouvrent une infobulle (blanc au survol) |
| `--lien` | `#ABCB1A` | Liens, coins des panneaux, globe |
| `--bord` | `#4D25B0` | Liserés des panneaux |
| `--meta` | `#58487E` | Journaux système |
| (infobulle) | fond `#4D25B0`, texte `#ABCB19` | Style principal |
| (infobulle variante) | fond `#94AD24`, texte `#2E3023` | Une infobulle sur deux |

## Typographie

- VT323 (police pixel, licence libre) en capitales ; lissage désactivé (`-webkit-font-smoothing: none`).
- Texte 20 px, interlignage 1,15 ; journaux 15 px ; titre de l'infobulle 2 rem (1,5 rem sur mobile).

## Page

- Grille : `1fr 50vw 1fr` × `auto auto 1fr`, écart 1 rem ; zones `'cadre texte m4' 'm2 texte m3' 'm2 texte m1'`.
- Panneaux : liseré 1 px, marge 1 rem, coin vert de 8 × 8 px en haut à gauche (`::before`).
- Texte central : défile dans son panneau (barre de défilement fine, verte).
- Sous 848 px : une seule colonne (cadre, texte, globe), journaux masqués.

## Infobulle

- `position: fixed`, posée au pointeur ; retournée à gauche ou en haut si elle sortirait de l'écran.
- Deux couches superposées dans la même case de grille : le fond (`display: grid` de `cols × rangs` cellules) et le contenu (flex en colonne, texte poussé en bas).
- Chaque cellule a un `outline` de 1 px de sa propre couleur pour ne laisser aucun jour entre elles.
