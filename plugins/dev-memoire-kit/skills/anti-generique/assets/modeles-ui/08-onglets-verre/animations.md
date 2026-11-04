# Animations — modèle 08 « Onglets en verre »

Durées relevées sur la vidéo (30 i/s) avec l'écart d'une image à l'autre : chaque clic donne un pic de mouvement dont on mesure le début et la fin.

## Constantes

```ts
const GLISSE = { type: "spring", stiffness: 420, damping: 38, mass: 0.9 }; // ≈ 0,28 s, sans rebond visible
const CYCLE = 0.9; // s, goutte de la barre 4
```

## Relevé

| Moment (vidéo) | Barre | Ce qui bouge | Durée |
|---|---|---|---|
| 0,27 → 0,50 s | 1 | clic « Chercher » : la cloche glisse d'Accueil à Chercher ; le champ de recherche apparaît au-dessus | 0,25 s |
| 0,87 → 1,10 s | 1 | clic « Créer » : la cloche glisse ; le champ disparaît | 0,25 s |
| 2,20 → 2,45 s | 2 | clic « Ajouter » : projecteur et cône glissent ensemble | 0,25 s |
| 2,77 → 3,10 s | 3 | clic « Favoris » : la pastille et le creux se déplacent ensemble, l'icône change dans la pastille | 0,3 s |
| 3,33 → 3,60 s | 3 | clic « Ajouter » : idem | 0,3 s |
| 4,00 → 4,90 s | 4 | clic « Ajouter » : goutte qui monte et revient (voir ci-dessous) | 0,9 s |
| 4,63 → 5,55 s | 4 | clic « Favoris » : nouvelle goutte, la teinte passe du doré au rosé | 0,9 s |

## Barre 4 : cycle de la goutte

| Temps du cycle | Goutte (y, échelle) | Barre |
|---|---|---|
| 0 | 0, ×0,5 (dans la barre) | se resserre (largeur ×0,93) |
| 0,25 s (28 %) | −96 px, ×1 : le **col** s'étire puis se rompt | resserrée |
| 0,5 s (55 %) | flotte à −96 px | resserrée |
| 0,77 s (85 %) | −20 px, ×0,9 : nouveau col en touchant la barre | légèrement élargie (×1,015) |
| 0,9 s | 0, ×0,5 : fondue dans la barre | ×1 |

L'icône voyage avec la goutte et disparaît de la rangée pendant le vol ; elle réapparaît en gras à la fin. La teinte de la barre change en 0,5 s.

## Ajouts (non montrés dans la vidéo)

- Le point d'état (barres 1 et 4) glisse d'un onglet à l'autre (`layoutId`) au lieu d'apparaître.
- L'icône dans la pastille de la barre 3 change par un fondu d'échelle 0,4 → 1 (0,22 s).

## Points à retenir

- Barres 1 et 3 : la forme est **recalculée à chaque image** depuis une seule valeur animée (le centre de l'onglet actif) ; ne jamais animer deux tracés séparément, ils se décaleraient.
- **Mouvement réduit** : `<MotionConfig reducedMotion="user">` rend les changements instantanés.
