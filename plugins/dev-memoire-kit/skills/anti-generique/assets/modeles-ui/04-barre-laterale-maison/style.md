# Style — modèle 04 « Kër »

## Verre dépoli

```css
background: rgba(246, 245, 242, .72);
backdrop-filter: blur(24px) saturate(140%);
border: 1px solid rgba(255, 255, 255, .65);
box-shadow: 0 30px 60px rgba(30, 25, 20, .22), inset 0 1px 0 rgba(255, 255, 255, .7);
border-radius: 30px;
```

Le verre ne fonctionne que sur un fond chargé (photo floue, dégradé). Prévoir `-webkit-backdrop-filter` pour Safari.

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--verre` | `rgba(246,245,242,.72)` | Panneau |
| `--blanc` | `#FFFFFF` | Pilule de survol, recherche (75 %), carte utilisateur (80 %) |
| `--noir` | `#121212` | Pilule active, logo, fenêtre de détail |
| `--lime` | `#B8E986` | Disque de l'icône active, icône du logo, pointes hachurées (avec `#3E5A22`) |
| `--encre` | `#161616` | Libellés |
| `--muet` | `#8F8C86` | Sous-titres, valeurs d'état |
| `--pale` | `#B4B1AB` | Informations des pièces, points inactifs |
| `--pastille` | `rgba(0,0,0,.045)` | Fond des valeurs d'état et de ⌘K |
| `--rond` | `rgba(0,0,0,.05)` | Disques des icônes |
| (point actif) | `#7CC45A` | Pièce occupée ou allumée |
| (fenêtre) | `#262626`, `#242424`, `#2C2C2C`, `#3A3A3A` | Disque, pastille, barres, ligne moyenne |
| (avatar) | dégradé `#F4D9C6` → `#D9A98A` | Avatar sans photo |

## Tailles

| Élément | Valeur |
|---|---|
| Rail / barre dépliée | 76 px / 380 px de large |
| Ligne | 50 px de haut, pilule rayon 999 px, marge intérieure 5 px |
| Disque d'icône | 40 px, icône 16 px trait 1,6 |
| Logo | carré 44 px, rayon 14 px |
| Libellé | 16 px, chasse −0,01 em ; sous-ligne 14 px ; valeurs 11 px |
| Nom de marque | 22 px, chasse −0,03 em, minuscules |
| Fenêtre de détail | 300 px de large, rayon 26 px, chiffre 54 px graisse 300 chasse −0,05 em |
| Graphique | 84 px de haut, 24 barres, écart 3 px, rayon 3 px |
| Avatar | 42 px |

Police : grotesque neutre (Geist, Inter Tight).
