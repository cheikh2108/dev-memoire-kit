# Style — modèle 02 « Relais »

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--fond` | `#F2F2F0` | Fond de page, gris presque neutre |
| `--carte` | `#FAFAF8` | Cartes, avec un liseré 1 px blanc à la place de l'ombre |
| (surfaces actives) | `#FFFFFF` | Ligne choisie, bulle, pastille de gain, segment actif |
| `--encre` | `#151515` | Texte, indicateurs, arc du compte à rebours |
| `--muet` | `#8E8E8A` | Libellés, exposants, axe |
| `--trait` | `#E3E3DF` | Hachures du graphique, séparateurs |
| `--accent` | `#F2DA1B` | Courbe, surligneur, délais urgents, compteurs d'onglet |
| `--accent-texte` | `#3A3300` | Texte posé sur l'accent |
| `--sombre` | `#141414` | Onglet actif, bouton principal, toast |
| `--vert` / `--vert-texte` | `#E3F0DF` / `#3F6B3A` | Délai couvert (≤ 30 min), « Couvert · X est en ligne » |
| (blocs gris) | `#EBEBE7` / `#EDEDEA` | Pastille de gain, segments, tuiles de contexte, bloc compte à rebours |

L'accent n'est **jamais** une couleur de texte sur fond clair (illisible) : il est toujours un fond ou un trait.

## Forme

| Élément | Valeur |
|---|---|
| Conteneur | rayon 30 px |
| Cartes | rayon 22 px, liseré `1px solid #fff`, pas d'ombre |
| Ligne choisie, bulle | rayon 12–14 px, ombre `0 4px 16px rgba(0,0,0,.05)` |
| Onglets, pastilles, boutons | pilule |
| Hachures | motif de 6 px, trait vertical de 1,2 px `--trait` |

## Typographie

Grotesque neutre (Geist, Inter Tight).

| Rôle | Taille | Graisse | Autre |
|---|---|---|---|
| Indicateur géant | 46 px | 400 | chasse −0,045 em, interlignage 1 |
| Exposant d'unité | 17 px | 400 | `--muet` |
| Score du carrousel | 42 px | 400 | voisins réduits à 62 % |
| Titre de vue | 22 px | 500 | chasse −0,02 em |
| Marque | 20 px | 700 | minuscules, chasse −0,04 em |
| Texte | 12 px | 400 | |
| Libellés, axe | 10–11 px | 400 | |

## Espacements

- Indicateurs séparés de 48 px, sans carte.
- Grille basse de 4 colonnes, gouttière 12 px ; rembourrage des cartes 16 px.
- Graphique : 150 px de haut, toute la largeur du contenu.
