# Animations — modèle 03 « Parking Plateau »

La vidéo de référence montre les constantes de la scène (inclinaisons en radians, rotation bornée, écart de la vue éclatée, levée des niveaux). Elles sont reprises telles quelles ; les mouvements de caméra ont été observés image par image.

## Constantes de caméra

```ts
const EL_VUE_GENERALE = 0.48; // ≈ 27° : tout le bâtiment
const EL_NIVEAU = 0.99;       // ≈ 57° : un niveau vu presque du dessus
const EL_PLACE = 0.87;        // ≈ 50° : zoom sur une place
const EL_MIN = 0.38;          // bornes de l'inclinaison quand on glisse
const EL_MAX = 1.25;
const AZ_PLAGE = 0.7;         // rotation bornée à ±40°
const ECART_ECLATE = 8;       // écart ajouté entre niveaux en vue éclatée
const LEVEE = 34;             // levée des niveaux au-dessus du niveau isolé
const AMORTI = 6;             // raideur de l'amorti
```

## Le principe : un amorti, pas une durée

Chaque grandeur (inclinaison, azimut, distance, point visé, écart éclaté, isolement) a une **valeur actuelle** et une **cible**. À chaque image :

```ts
const k = 1 - Math.exp(-AMORTI * dt); // dt = temps écoulé depuis l'image précédente
actuel += (cible - actuel) * k;
```

- Le mouvement démarre vite et ralentit en arrivant, quelle que soit la distance ; avec `AMORTI = 6`, 95 % du trajet est fait en **0,5 s**.
- Un nouveau clic pendant un vol **réoriente** la caméra sans à-coup (pas d'animation à annuler).
- Le résultat ne dépend pas de la fréquence d'affichage (60 ou 120 Hz) grâce à `dt`.

## Tableau

| Élément | Déclencheur | Ce qui change | Durée perçue |
|---|---|---|---|
| Caméra : vue générale | « Tous » | inclinaison 0,48, distance 72, cible au centre | ≈ 0,5 s |
| Caméra : niveau | segment N1/N2/N3 | inclinaison 0,99, distance 62, cible au niveau | ≈ 0,5 s |
| Caméra : place | clic sur une place | inclinaison 0,87, distance 36, cible sur la place | ≈ 0,5 s |
| Rotation libre | glisser | azimut (±0,7) et inclinaison (0,38 à 1,25), puis amorti | suit le doigt |
| Vue éclatée | « Éclater » | chaque niveau monte de `n × ECART_ECLATE`, caméra recule (distance 88) | ≈ 0,5 s |
| Isolement d'un niveau | segment de niveau | niveaux du dessus : +`LEVEE` en hauteur, opacité → 15 % puis masqués | ≈ 0,5 s |
| Place choisie | clic | couleur → bleu (immédiat), panneau de détail entre (x 10 → 0, 0,3 s) | 0,3 s |
| Étiquette de la place | à chaque image | position HTML recalculée par projection 3D → écran ; masquée sans place choisie | continue |
| Boutons tourner / recentrer | clic | azimut ±0,35 rad (borné) ou retour à l'azimut et à l'inclinaison de départ ; courbe amorti | ≈ 0,5 s |
| Démonstration guidée | minuterie | étape suivante toutes les 2,2 s ; intitulé en fondu (y 4 → 0 px) ; segment de progression qui change de couleur | 0,25 s / 0,3 s |
| Indicateur du menu latéral | clic | fond marine partagé (`layoutId`) ; courbe `EASE` | 0,3 s |
| Courbe d'occupation | montage | tracé `pathLength` 0 → 1, puis aire en fondu ; courbe `EASE`, décalage 0,2 s / 0,6 s | 0,9 s puis 0,5 s |
| Barres groupées | montage | `scaleY` 0 → 1, ancrées en bas, la moyenne avant le jour ; courbe `EASE`, décalage 0,2 s + 30 ms × paire | 0,4 s |
| Anneau par niveau | montage | chaque segment se déroule à sa place (`strokeDashoffset`) ; courbe `EASE`, décalage 0,2 s + 0,1 s × segment | 0,8 s |
| Blocs de la chronologie | montage | `scaleX` 0 → 1, ancrés à gauche ; courbe `EASE`, décalage 0,2 s + 20 ms × ligne | 0,5 s |
| Trait de l'heure courante | montage | `scaleY` 0 → 1, depuis le haut ; courbe `EASE`, décalage 0,3 s | 0,6 s |
| Bulle des recettes | survol d'une heure | position `left` ; courbe `EASE` | 0,2 s |
| Lignes de sessions | montage, filtre de niveau | opacité, y 6 → 0 px ; réordonnancement par `layout` ; courbe `EASE`, décalage 0,15 s + 30 ms × ligne | 0,3 s |
| Cartes de l'interface | montage | opacité 0 → 1, y 10 → 0 px, 50 ms de décalage | 0,45 s |
| Remplissage (barre latérale) | montage | largeur 0 → % | 0,8 s |

Dans la vidéo d'origine, une démonstration guidée enchaîne les étapes d'un passage (arrivée, réservation, stationnement, départ) avec une barre de progression ; c'est un mode de démo, à ne reproduire que pour une page de présentation.

## Points à retenir

- **Borner la caméra** : un utilisateur qui retourne la maquette sous le sol ne la retrouve plus.
- **Animer la levée, pas la disparition** : les étages du dessus montent et s'effacent, ce qui montre d'où vient le niveau isolé.
- **Mouvement réduit** : avec `prefers-reduced-motion`, `k = 1` (la caméra saute directement à la cible) et `MotionConfig` coupe les entrées de l'interface.
- **Performance** : une seule boucle `requestAnimationFrame`, des boîtes simples, pas d'ombres ; libérer le rendu (`dispose`) au démontage.
