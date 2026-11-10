# Animations — modèle 09 « Texte LCD »

Valeurs reprises du code d'origine (Codrops, MIT). Deux familles :

- **Glissant** : on vide le texte, la première case de chaque ligne tire un signe à chaque pas, chaque case suivante recopie ce que sa voisine de gauche affichait au pas précédent ; les signes semblent défiler de gauche à droite. Une case vide ne compte pas comme une itération.
- **Hasard** : chaque case tire des signes au hasard puis se fixe sur son caractère.

| Effet | Famille | Vide d'abord | Départ de chaque case | Pas | Itérations | Particularité |
|---|---|---|---|---|---|---|
| 1 | glissant | oui | (ligne + 1) × 200 ms | 15 ms | 45 | les 9 premiers tirages parmi `* - ' "` |
| 2 | hasard | non | (position + 1) × 30 ms | 40 ms | 20 | à la fin, le caractère disparaît 300 ms puis revient |
| 3 | hasard | oui | 0 à 2 000 ms au hasard | 80 ms | 10 | apparition éparpillée |
| 4 | glissant | oui | \|lignes/2 − ligne\| × 400 ms | 15 ms | 30 | part du milieu du bloc ; tirages parmi `* :` |
| 5 | glissant | oui | (ligne + 1) × 200 ms | 10 ms | 30 | chaque signe porte une couleur qui glisse avec lui |
| 6 | hasard | non | (ligne + 1) × 80 ms | 30 à 110 ms au hasard | 15 | couleurs tirées au hasard |

## Règles

- Un seul effet à la fois : les boutons sont désactivés jusqu'à ce que la dernière case soit fixée.
- Le texte final est toujours le texte d'origine (stocké dans `data-c`) : rien ne se perd si l'animation est interrompue (la fonction d'arrêt annule toutes les minuteries).
- Les caractères sont modifiés directement dans le DOM : des centaines de mises à jour toutes les 10 à 15 ms seraient trop lourdes pour un rendu React.
- **Mouvement réduit** : aucun effet n'est lancé.
