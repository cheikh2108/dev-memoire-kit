# Animations — modèle 13 « Infobulle en pixels »

Valeurs du code d'origine (Codrops, MIT, GSAP). Courbe « expo » = 1 − 2^(−10t). Durée par cellule : **0,1 s** (effets 1 à 5) ou **0,9 s** (effet 6). Délais « grille » comme le `stagger` de GSAP : distance en cellules × pas.

## Les six effets

| Effet | Grille de la démo | Cellule : départ → arrivée | Délai de chaque cellule (ouverture) | Fermeture |
|---|---|---|---|---|
| 1 | 12 × 10 | opacité 0 → 1 | distance au pointeur ÷ diagonale de la page × 1,8 s (onde) | même onde |
| 2 | 9 × 3 | opacité 0, échelle 0 → 1 | 20 ms par cellule, de la première à la dernière | de la dernière à la première |
| 3 | 8 × 6 | opacité 0, échelle 0, y ±200 % au hasard → 0 | 30 ms × distance au centre | idem, vers un y au hasard |
| 4 | 1 × 14 | opacité 0, largeur ×0,8, x ±200 % au hasard → 0 | 20 ms, ordre au hasard | idem |
| 5 | 8 × 12 | opacité 0, échelle 0 → 1 | 20 ms × distance au centre | depuis les **bords** |
| 6 | 5 × 3 | opacité 0, échelle 0,3 → 1, à travers le filtre « gluant » | 80 ms, ordre au hasard | 40 ms, au hasard |

**Filtre « gluant »** (effet 6) : flou gaussien 10,2 px, puis seuil sur l'alpha (`0 0 0 20 -7`), puis composition sur l'original : les cellules qui grandissent fusionnent en une forme molle.

## Texte

| Moment (ouverture) | Élément | Mouvement |
|---|---|---|
| 0,4 s | titre | opacité 0 → 1 en 0,2 s |
| 0,6 s | texte | opacité 0 → 1 en 0,2 s |
| 0,8 s | titre | grésillement (classe ajoutée) |
| 1 s | texte | grésillement |

À la fermeture, titre et texte disparaissent ensemble tout de suite (0,2 s) et le grésillement s'arrête.

## Grésillement

Animation CSS de 4 s en boucle : pendant les **0,4 premières secondes** (0 à 10 %), le bloc est retourné et décalé de 5 px, puis découpé en bandes horizontales successives (`clip-path`) ; ensuite il reste net jusqu'au cycle suivant. Les journaux de la page grésillent aussi, avec 12 s et 16 s de retard.

## Ouverture et fermeture

- Ouverture **40 ms** après l'entrée du pointeur, fermeture **40 ms** après sa sortie (évite le clignotement en passant d'un mot à l'autre).
- L'infobulle suit le pointeur tant qu'elle est ouverte ; elle passe au premier plan dès l'ouverture et reste visible jusqu'à la fin de la fermeture.
- Une nouvelle entrée interrompt une fermeture en cours (les cellules repartent de leur état actuel).
