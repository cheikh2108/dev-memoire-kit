# Style — modèle 03 « Parking Plateau »

## Interface

| Token | Valeur | Usage |
|---|---|---|
| `--fond` | `#F4F5F7` | Fond de page, gris bleuté très clair |
| `--carte` | `#FFFFFF` | Cartes, barre latérale |
| `--trait` | `#E7E9EE` | Bordures 1 px des cartes, pistes |
| `--encre` | `#141A26` | Texte, valeurs |
| `--muet` | `#8A909C` | Libellés |
| `--marine` | `#1E2A44` | Menu actif, logo, bouton principal, bouton « Éclater » actif |
| `--bleu` | `#3B6FE0` | Place choisie (scène), barre de remplissage, état occupé dans le panneau |

## Scène 3D

| Élément | Couleur | Note |
|---|---|---|
| Fond de la toile | dégradé `#EEF0F4` → `#E4E7EC` | rendu transparent, le fond vient du CSS |
| Sol | `#E9EBEF` | grand plan sous les niveaux |
| Dalles | `#F6F7F9` | boîtes de 0,4 d'épaisseur |
| Place libre | `#B9DCC4` | vert doux |
| Place réservée | `#F3D58A` | ocre |
| Place occupée | `#D9DCE3` | gris clair + voiture |
| Hors service | `#9AA0AA` | gris moyen |
| Place choisie | `#3B6FE0` | seule couleur vive de la scène |
| Voitures | `#2B2F38` ou `#6B7280` | deux boîtes (caisse + habitacle) |

Lumières : hémisphérique (ciel blanc, sol `#D8DBE2`, intensité 2,2) + directionnelle (1,4) en haut à droite. Pas d'ombres portées : elles coûtent cher et brouillent la lecture des états.

## Forme et typographie

- Conteneur 24 px, cartes 18 px avec bordure 1 px (pas d'ombre), toile 12 px, boutons et segments 10 px.
- Grotesque neutre (Geist, Inter Tight) ; valeurs 26 px graisse 600 ; titre de page 22 px graisse 600 ; libellés 11 px.
- Plaque d'immatriculation en police à chasse fixe, graisse 600, espacement 0,06 em, cadre blanc.
- Barre latérale de 220 px ; panneau de détail de 280 px ; toile de 330 px de haut.
