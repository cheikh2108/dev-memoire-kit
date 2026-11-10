# Animations — modèle 12 « Menu arrondi »

Séquence reprise du code d'origine (Codrops, MIT, GSAP), courbes en fonctions exactes :

- `power4.inOut` : t < 0,5 ? 16t⁵ : 1 − (−2t + 2)⁵ / 2 (courbe par défaut, 1,2 s)
- `power3.inOut` : t < 0,5 ? 8t⁴ : 1 − (−2t + 2)⁴ / 2
- `power4` (sortie) : 1 − (1 − t)⁵

## Ouverture (1,6 s au total)

| Départ | Élément | Mouvement | Durée, courbe |
|---|---|---|---|
| 0 s | cadre de la couverture | échelle 1,1 → 1 | 1,6 s power3.inOut |
| 0 s | couverture (masque) | y −100 % → 0 | 1,2 s power4.inOut |
| 0 s | image de couverture | y +100 % → 0 (sens contraire du masque : l'image semble **découverte**, pas poussée) | 1,2 s power4.inOut |
| 0 s | visuels de fond | y → −20 % (rang pair) ou +20 % (rang impair) | 1,2 s power4.inOut |
| 0 s | lettres et années | y → +20 % (pair) ou −20 % (impair), à l'opposé des visuels | 1,2 s power4.inOut |
| 0,5 s | panneau du menu | y −100 % → 0 (descend sous la barre) | 1 s power4.inOut |
| 1,1 s | mot géant et pseudonyme | y +400 % → 0, opacité 0 → 1 | 0,5 s power4 |

## Fermeture

Lecture **inversée** de la même séquence (comme `timeline.reverse()`) : chaque étape part à `1,6 s − (départ + durée)`, ses valeurs sont échangées et sa courbe est retournée (`t ↦ 1 − courbe(1 − t)`). Le mot géant part donc en premier, la couverture finit en dernier.

## Règles

- Une seule séquence à la fois : les clics sont ignorés pendant les 1,6 s.
- Le panneau ne reçoit les clics qu'une fois ouvert ; la barre, elle, reste toujours active.
- Survols : trait de soulignement des liens (0,3 s, depuis la droite), flèche de retour qui monte de 10 px (0,3 s).
