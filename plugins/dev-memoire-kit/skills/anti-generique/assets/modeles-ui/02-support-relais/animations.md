# Animations — modèle 02 « Relais »

Mesures sur la vidéo de référence (30 i/s). Les changements de vue y tombent toutes les 1,75 s (rythme de démo). Le code visible dans la vidéo donne la révélation du graphique : `scaleX` de 0 à 1, ancrée à gauche, **0,95 s**, courbe **`[0.45, 0, 0.2, 1]`**, **0,12 s** de retard.

## Constantes

```ts
const EASE = [0.22, 1, 0.36, 1];            // entrées
const EASE_REVELATION = [0.45, 0, 0.2, 1];  // balayage : démarre franchement, arrive en douceur
const D = { carte: 0.45, revelation: 0.95, barre: 0.4 };
```

## Tableau

| Élément | Déclencheur | Propriétés | Durée | Courbe | Décalage |
|---|---|---|---|---|---|
| Courbe du graphique | montage | rectangle de découpe (`clipPath`) `scaleX` 0 → 1, `originX: 0` | 0,95 s | `EASE_REVELATION` | 0,12 s |
| Repère vertical | survol d'une tranche | position x | 0,2 s | `EASE` | — |
| Bulle du graphique | survol | position `left`, apparition après la révélation | 0,2 s | `EASE` | opacité à 1 s |
| Pastille de gain | montage | opacité 0 → 1, échelle 0,9 → 1 | 0,35 s | `EASE` | 0,5 s |
| Cartes basses | montage | opacité 0 → 1, y 10 → 0 px | 0,45 s | `EASE` | 0,1 s + 50 ms × rang |
| Barres en pointillés | montage | `scaleY` 0 → 1, ancrées en bas | 0,4 s | `EASE` | 0,3 s + 20 ms × barre |
| Carrousel du score | clic sur un mois | échelle 1 ↔ 0,62, opacité 1 ↔ 0,35 | 0,35 s | `EASE` | — |
| Onglet actif | clic | pilule noire partagée (`layoutId`) qui glisse | 0,35 s | `EASE` | — |
| Lignes de la boîte | montage | opacité 0 → 1, y 6 → 0 px | 0,3 s | `EASE` | 0,15 s + 40 ms × ligne |
| Panneau de détail | changement de conversation | sortie x → −6 px, entrée x 12 → 0 px | 0,3 s | `EASE` | `mode="wait"` |
| Compte à rebours | changement de conversation | `strokeDashoffset` → part restante | 0,7 s | `EASE` | — |
| Courbe (changement de série) | P25 / Médiane / P75 | attribut `d` du tracé interpolé | 0,5 s | `EASE` | — |
| Bande jaune du graphique | survol d'une tranche | position x | 0,2 s | `EASE` | — |
| Triangle du score | clic sur un mois | position partagée (`layoutId`) | 0,35 s | `EASE` | — |
| Anneau d'attente | permanent tant que le délai court | rotation 360° en boucle, linéaire | 1,6 s par tour | linéaire | — |
| Statut d'agent | clic En ligne / Absent / Hors ligne | pastille blanche partagée (`layoutId` par ligne) ; charge et disponibilité recalculées | 0,25 s | `EASE` | — |
| Histogrammes (annuel, horaire, planning) | montage | `scaleY` 0 → 1, ancrés en bas | 0,4 s | `EASE` | 250 ms + 20 ms × barre |
| Fiche client | changement de client | sortie opacité, entrée y 8 → 0 px | 0,35 s | `EASE` | `mode="wait"` |
| Toast | attribution | opacité, y 24 → 0 px, entrée et sortie | 0,35 s | `EASE` | disparaît après 3 s |

## Points à retenir

- **Révéler un graphique par découpe**, pas en animant le tracé (`pathLength`) : la découpe montre aussi les zones, les points et les hachures dans le même mouvement, et ne déforme pas la courbe.
- Si une bulle ou un repère doit déborder du graphique, ne garder la découpe que pendant l'entrée (la retirer dans `onAnimationComplete`).
- La **courbe de balayage** est plus lente au départ que la courbe d'entrée : elle donne la sensation d'un tracé « dessiné », pas d'un élément qui glisse.
- Respecter `prefers-reduced-motion` : `<MotionConfig reducedMotion="user">` enveloppe tout le tableau.
