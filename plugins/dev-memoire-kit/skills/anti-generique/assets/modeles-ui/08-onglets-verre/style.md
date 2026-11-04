# Style — modèle 08 « Onglets en verre »

## Verre

```css
/* barres 1 à 3 (sombres) */
background: rgba(38, 34, 32, .5);
backdrop-filter: blur(14px) saturate(1.3);
border: 1px solid rgba(255, 255, 255, .22);
box-shadow: inset 0 1px 0 rgba(255, 255, 255, .12), 0 10px 30px rgba(0, 0, 0, .25);
```

- Barre 3 : remplissage en dégradé vertical `#1E1B1A` (55 %) → `#3A332E` (45 %) → `#CFC2B2` (55 %) : le bas reflète le décor clair ; contour `rgba(255,255,255,.45)`. Le flou d'arrière-plan suit la forme grâce à `clip-path: path(...)`.
- Barre 4 : couche liquide à 72 % d'opacité, teinte par onglet `#DCCB9C`, `#E2B9B2`, `#E4BFA8`, `#CFC4D8`, `#E5C98E` ; liseré `rgba(255,255,255,.55)`.

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| (turquoise) | `#5FE3C8` | Trait néon, point, projecteur, cône, survol, halo de la pastille |
| (pastille) | radial `#2F7D70` → `#1A4C45` | Disque de l'onglet actif (barre 3) |
| (alerte) | `#F05A3C` | Pastille de notification |
| (encre claire) | `#FFFFFF` | Icônes et libellés sur verre sombre |
| (encre foncée) | `#2A2A2A`, actif `#141414` | Icônes et libellés sur verre clair (barre 4) |

## Dimensions (échelle 0,6 de la vidéo)

| Barre | Largeur | Hauteur | Particularités |
|---|---|---|---|
| 1 | 500 | 70 | cloche 102 × 65 px ; trait 2,6 px, halo `drop-shadow(0 0 4px) drop-shadow(0 0 10px)` ; champ 353 × 55 px |
| 2 | 500 | 78 | réglette 37 × 6 px ; cône 90 × 46 px, `clip-path: polygon(29% 0, 71% 0, 100% 100%, 0 100%)` |
| 3 | 500 | 82 | coins 28 px ; creux 36 px de profondeur sur 160 px ; pastille 55 px, sommet à −24 px ; barre d'accueil 125 × 5 px à 12 px du bas |
| 4 | 500 | 78 | goutte 62 px, sommet de vol à −96 px |

Icônes : 22 px (avec libellé) ou 24 px (seules), trait 1,8 à 2,4 ; libellés Inter 11 px, graisse 600 (700 pour l'actif de la barre 4).

## Filtre « gluant » (barre 4)

```svg
<filter id="gluant">
  <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="flou" />
  <feColorMatrix in="flou" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="seuil" />
  <feComposite in="SourceGraphic" in2="seuil" operator="atop" />
</filter>
```

Le flou fait se toucher la barre et la goutte, le seuil sur l'alpha redessine un bord net : c'est ce qui crée le **col** liquide. Les icônes sont posées **au-dessus** de la couche filtrée pour rester nettes, et le flou d'arrière-plan est sur un calque séparé (un parent filtré coupe le `backdrop-filter` de ses enfants).
