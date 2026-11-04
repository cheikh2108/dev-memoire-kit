# Animations — modèle 01 « Atelier »

Valeurs mesurées image par image sur la vidéo de référence (30 i/s), puis arrondies. Bibliothèque : `motion` (ex-Framer Motion), importée depuis `motion/react`.

## Constantes

```ts
const EASE = [0.22, 1, 0.36, 1]; // sortie douce, sans rebond (proche de easeOutQuint)
const D = { titre: 0.56, carte: 0.45, jauge: 0.9, compteur: 0.8 };
const CASCADE = 0.045;           // 45 ms entre deux cartes
```

Le rythme général : **tout est arrivé en 0,6 s environ**, puis l'écran est immobile. Pas de ressort, pas de rebond, pas d'animation en boucle (sauf le curseur).

## Tableau

| Élément | Déclencheur | Propriétés | Durée | Courbe | Décalage |
|---|---|---|---|---|---|
| Phrase d'accueil (`h1`) | changement de vue (`key={vue}`) | opacité 0 → 1, y 24 → 0 px | 0,56 s | `EASE` | — |
| Curseur avant la ligne 2 | permanent | opacité 1 ↔ 0 (`steps(1)`) | 1 s par cycle | — | — |
| Contenu de la vue sortante | changement de vue | opacité → 0 | 0,12 s | défaut | — |
| Cartes | montage de la vue | opacité 0 → 1, y 12 → 0 px | 0,45 s | `EASE` | 80 ms + 45 ms × rang |
| Compteurs (« 206,0 h », « 76 % ») | montage | 0 → valeur | 0,8 s | `EASE` | avec la carte |
| Arc de jauge | montage | `strokeDashoffset` circonférence → valeur | 0,9 s | `EASE` | 200 ms |
| Points d'échéance | montage | échelle 0 → 1 | 0,25 s | `EASE` | 300 ms + 15 ms × point |
| Courbe de tendance | montage | `pathLength` 0 → 1 | 1,1 s | `EASE` | 250 ms |
| Lignes d'activité | montage | opacité 0 → 1, x −8 → 0 px | 0,35 s | `EASE` | 350 ms + 60 ms × ligne |
| Barres de planning | montage | largeur 0 → % | 0,6 s | `EASE` | 200 ms + 40 ms × ligne |
| Indicateur de vue active (rail) | clic | position partagée (`layoutId`) | 0,35 s | `EASE` | — |
| Bouton principal | survol / appui | y −1 px / échelle 0,97 | défaut | — | — |
| Disques « projets livrés » | montage | échelle 0,6 → 1, opacité 0 → 1, du plus grand au plus petit | 0,6 s | `EASE` | 250 ms + 80 ms × disque |
| Sphère du budget | montage | échelle 0,7 → 1, opacité 0 → 1 | 0,7 s | `EASE` | 250 ms |
| Bâtons d'activité | montage | `scaleY` 0 → 1, ancrés en bas | 0,4 s | `EASE` | 350 ms + 30 ms × bâton |
| Trait S45 | montage | `scaleY` 0 → 1, ancré en haut | 0,6 s | `EASE` | 350 ms |
| Lignes du tableau des projets | montage, changement d'onglet | opacité, y 6 → 0 px ; réordonnancement par `layout` | 0,3 s | `EASE` | 150 ms + 30 ms × ligne |
| Puces du planning | glisser | déplacement libre, retour à l'origine au lâcher (`dragSnapToOrigin`) ; survol y −1 px | ressort par défaut | — | — |
| Interrupteurs d'accès client | clic | pastille blanche qui glisse (`layout`) | 0,25 s | `EASE` | — |
| Cases de la revue | clic | échelle 0,8 → 1 à l'activation | 0,2 s | défaut | — |
| Humeurs | appui | échelle 0,9 pendant l'appui, fond noir une fois choisie | — | — | — |
| Toast | action (déplacement d'une tâche) | opacité 0 → 1, y 24 → 0 px, entrée et sortie | 0,35 s | `EASE` | disparaît après 2,6 s |

Dans la vidéo de présentation, les vues défilent toutes les **1,75 s** : c'est un rythme de démo (`defilementAuto`), pas un comportement de produit. En usage réel, la vue change au clic.

## Règles à garder en adaptant

- **Une seule courbe** pour toute l'interface ; ne pas mélanger ressorts et courbes.
- **Mouvements courts** : 12 à 24 px de déplacement, jamais d'entrée depuis le bord de l'écran.
- **La cascade suit l'ordre de lecture** (gauche → droite, haut → bas) et reste sous 0,4 s au total ; au-delà de 8 cartes, réduire le décalage.
- **Les chiffres comptent une seule fois**, au montage ; une mise à jour de donnée en direct change la valeur sans recompter depuis 0.
- **Mouvement réduit** : `<MotionConfig reducedMotion="user">` désactive les déplacements pour les utilisateurs qui l'ont demandé dans leur système ; le curseur clignotant est coupé par `prefers-reduced-motion` en CSS.
- Animer de préférence `opacity` et `transform` (et `strokeDashoffset` / `pathLength` en SVG). Les barres de planning animent leur largeur à l'intérieur d'une piste de taille fixe, ce qui reste acceptable ; ne pas animer la hauteur ou la position d'éléments qui poussent le reste de la page.
