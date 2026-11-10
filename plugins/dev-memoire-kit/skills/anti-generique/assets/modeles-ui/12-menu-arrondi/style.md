# Style — modèle 12 « Menu arrondi »

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--fond` | `#0C0C0C` | Fond de page |
| `--texte` | `#FFFFFF` | Citation |
| `--fond-menu` | `#EE8233` | Barre et panneau (opacité 0,9) |
| `--texte-menu` | `#000000` | Liens et titres du menu, flèche |
| `--titre` | `#EE8233` | Lettres géantes et années |
| `--lien-reseau` | `#CA5D2B` | Liens secondaires du panneau |
| `--texte-cadre` | `#817F7F` | Légende de la démo |

Tissus wax : quatre motifs (feuilles, yeux, cercles, losanges), trois couleurs chacun sur un fond, voile en dégradé noir 0 → 35 % ; motif tourné de −8°.

## Typographie

| Rôle | Police | Taille |
|---|---|---|
| Lettres géantes | Bodoni Moda 400 | 20 vh, interlignage 1 |
| Années | Bodoni Moda 400 | 4 vw (gauche), 6,5 vw (droite) |
| Marque (barre) | Bodoni Moda 400, capitales | 1,65 rem |
| Mot géant du panneau | Bodoni Moda 400 | `clamp(1.5rem, 17.5vh, 8rem)`, interlignage 0,8 |
| Pseudonyme | Bodoni Moda 400 | 2,5 vw |
| Liens, citation | Archivo 400 (citation en italique capitales) | 17 px |

## Grilles

- **Contenu** : colonnes `18% 1fr 1fr 18%`, écart 7 vw ; rangées `10vh 15vh auto 1fr auto 1fr` ; zones `'. main main .' '. main main .' 'gauche main main titre-d' 'gauche main main droite' 'titre-g main main droite' 'titre-g main main droite'`.
- **Lettres** : 4 rangées de 17 vh, quinconce `'l1 .' '. l3' 'l2 .' '. l4'`, marge 20 vh en haut, 10 vh en bas.
- **Barre et panneau** : colonnes `5rem 10% minmax(200px, 417px) 10% 5rem` ; le panneau remonte de 1,35 rem sous la barre ; rangées `1fr 10vh` ; zones `'. . liens retour .' 'slogan slogan reseaux reseaux reseaux'`.
- **Formes** : coins de 2 rem (barre entière, bas du panneau) ; marge intérieure 2 rem.
- Sous 888 px : barre réduite (marque, connexion), panneau en deux colonnes, liens secondaires masqués.
