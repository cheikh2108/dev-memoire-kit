# Style — modèle 01 « Atelier »

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--fond` | `#F3F2F0` | Fond de page (gris chaud, jamais blanc pur) |
| `--carte` | `#FFFFFF` | Cartes, champ de recherche, cercle de date |
| `--sous` | `#F7F6F4` | Sous-cartes, fond des pastilles neutres, piste des barres |
| `--encre` | `#141414` | Texte principal, chiffres |
| `--muet` | `#9B9893` | Libellés, texte secondaire |
| (ligne 2 d'accueil) | `#B9B6B0` | Seconde ligne de la phrase d'accueil |
| `--trait` | `#ECEAE6` | Séparateurs de lignes, piste de jauge, points vides |
| `--accent` | `#E2553F` | Bouton principal, unités, alertes, dépassements, arc de jauge |
| `--accent-doux` | `#F8DED7` | Fond de pastille d'alerte, avatars |
| `--sombre` | `#121212` | Bouton secondaire, vue active du rail, toast, statuts neutres |

Règle : l'accent couvre **moins de 5 %** de la surface. Les états « normaux » sont en noir ou gris ; seul ce qui demande une action est en corail.

## Forme

| Élément | Valeur |
|---|---|
| Rayon des cartes | 24 px |
| Rayon des sous-cartes | 18 px |
| Conteneur général | 32 px |
| Boutons, pastilles, recherche, rail | 999 px (pilule) |
| Ombre des cartes | `0 1px 2px rgba(20,20,20,.04), 0 10px 30px rgba(20,20,20,.05)` |
| Ombre du bouton accent | `0 6px 16px rgba(226,85,63,.3)` |
| Bordures | aucune sur les cartes ; 1 px `--trait` pour séparer des lignes de liste |

## Typographie

Grotesque neutre : **Geist** ou **Inter Tight** (repli `system-ui`).

| Rôle | Taille | Graisse | Autre |
|---|---|---|---|
| Phrase d'accueil | 28 px | 500 | interlignage 1,15, chasse −0,02 em |
| Grand chiffre | 24 px | 500 | chasse −0,02 em, unité en `--accent` |
| Titre de carte | 18 px | 500 | |
| Texte courant | 13 px | 400 | |
| Libellé / muet | 12 px | 400 | `--muet` |
| Surtitre | 12 px | 700 | italique, majuscules (« ATELIER / STUDIO ») |
| Pastille, badge | 10–11 px | 400–500 | |

Chiffres au format local (`toLocaleString("fr-FR")` → « 206,0 h », « +9,2 % »).

## Espacements

- Grille de 12 colonnes, gouttière **14 px** ; rembourrage des cartes **16 px**, des sous-cartes **12 px**.
- Rail de navigation : 56 px de large, boutons ronds de 40 px.
- Avatars empilés : 26 px, chevauchement −6 px, liseré 2 px de la couleur de la carte.
