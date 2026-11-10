# Animations — modèle 10 « Grille 3D »

Valeurs du code d'origine (Codrops, MIT, GSAP), courbes converties : « expo » ≈ `[0.16, 1, 0.3, 1]`, « expo.inOut » ≈ `[0.87, 0, 0.13, 1]`, « power1 » ≈ `[0.25, 0.46, 0.45, 0.94]`.

## En continu (boucle par image)

| Élément | Calcul |
|---|---|
| Vignette (dérive) | se déplace **à l'inverse** de la souris : jusqu'à 70–100 px en x et 40–65 px en y (tiré au hasard par vignette), amorti 0,04 par image |
| Vignette (rotation) | s'ajoute à l'inclinaison de départ : ±5° (x) et ±10° (y) selon la moitié d'écran où se trouve la souris, amorti 0,04 |
| Image survolée (magnétisme) | attirée vers la souris : 0,3 × l'écart au centre de la vignette, amorti 0,04 ; échelle 1 → 1,1 |
| Image quittée | revient à sa place et à l'échelle 1 (amorti 0,07, au lieu d'un « power4 » de 1 s) |
| Curseur | cercle amorti 0,2 ; titre amorti 0,1 (il traîne derrière) ; échelle 1 → 1,5 sur une vignette, amorti 0,15 |

## Séquences

| Moment | Élément | Mouvement | Durée, courbe |
|---|---|---|---|
| Arrivée | vignettes | échelle 1,5 → 1 et opacité 0 → 1, décalage total 0,4 s **depuis le centre** | 1,2 s expo (échelle), 1,2 s power1 (opacité) |
| Clic, 0 s | vignettes | montent de 1 000 à 1 600 px et disparaissent, décalage 0,2 s **depuis le haut** | 2 s expo.inOut |
| Clic, 0,1 s | lettres du titre de fond | montent de 100 % et disparaissent, 30 ms entre lettres | 1,5 s expo.inOut |
| Clic, 0,5 s | cadre de l'image | monte de 100 % et se redresse (−20° → 0) ; l'image glisse de −100 % à 0 dedans | 1,5 s expo.inOut |
| Clic, 0,6 s | lettres du titre | montent de 100 % à 0, 50 ms entre lettres | 1,5 s expo.inOut |
| Clic, 1,5 s | « Retour » ; texte | glisse de 20 % depuis la droite ; monte de 20 % | 1,5 s expo |
| Retour, 0 s | lettres du titre ; image ; « Retour » ; texte | redescendent (40 ms entre lettres, de la dernière à la première) ; l'image repart vers le bas en s'inclinant ; « Retour » à droite ; texte vers le bas | 1,5 s expo.inOut |
| Retour, 0,4 s | lettres du titre de fond | redescendent à leur place, de la dernière à la première | 1 s expo.inOut |
| Retour, 1 s | vignettes | reviennent : échelle 0,2 → 1, opacité, décalage 0,2 s depuis le centre | 1 s expo |

## Règles

- Pendant l'aperçu, la boucle de dérive est **arrêtée** et la grille ne reçoit plus le pointeur ; elle reprend 0,3 s après le clic sur « Retour ».
- Un seul aperçu à la fois : les clics sont ignorés pendant les séquences.
- Les transformations sont écrites directement dans le style (une image sur seize, 60 fois par seconde) ; React ne rend que la structure.
