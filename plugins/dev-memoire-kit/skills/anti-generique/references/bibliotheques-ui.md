# Bibliothèques UI recommandées

Une bonne bibliothèque évite le générique **à la source** : elle impose des tokens, une composition cohérente et des comportements soignés (tooltips, animations), au lieu de laisser l'IA réinventer un graphique Recharts par défaut à chaque fois.

## Graphiques : Bklit UI

- Documentation : https://ui.bklit.com/docs/components · Galerie : https://ui.bklit.com/charts/area-chart · Studio (réglage visuel des props, copie du code) : https://ui.bklit.com/studio
- Distribution par le **registre shadcn** : le code du graphique est copié dans le projet et reste modifiable.
  ```bash
  npx shadcn@latest add @bklit/line-chart
  ```
- 15 types : aire, barres, ligne, ligne temps réel, composé, nuage de points, chandeliers, camembert, anneau, radar, jauge, carte de chaleur, entonnoir, Sankey, choroplèthe.
- **Composition** imposée : graphique racine puis enfants (`LineChart` → `Grid` → `Line` → `XAxis` → `ChartTooltip`).
- **Thème par tokens** : `chartCssVars` (typé), palette de séries `--chart-1` … `--chart-5`, échelle séquentielle `--chart-scale-01` … `--chart-scale-05` pour les cartes de chaleur et choroplèthes. Brancher ces variables sur la palette de marque du projet, pas sur des couleurs en dur.
- Détails utiles : animations d'entrée par défaut, rejeu via `revealSignature`, contenu de tooltip personnalisé, hook `useChart` pour des indicateurs sur mesure.

### Son skill pour agents IA
```bash
npx skills add bklit/bklit-ui
```
Installé dans le projet, il donne à l'assistant le contexte Bklit : installation, composition, thème, animation. Il s'active sur les tâches de graphiques.

**Ce que ce skill fait bien, et qu'on peut copier dans nos propres skills :**
1. **Il lit le projet avant d'écrire du code** : il exécute `shadcn info --json` (framework, version de Tailwind, alias, composants déjà installés, chemins réels) et injecte le résultat dans le contexte. Le code généré correspond au projet dès le premier essai, au lieu de chemins et d'imports devinés.
2. **Il impose des règles de composition** (racine + enfants, variables CSS sémantiques, schéma correct pour tooltip et réticule) plutôt que de laisser l'IA improviser.
3. **Il renvoie vers la doc et la galerie** avant de générer, ce qui limite les API inventées.
4. Il fournit un **guide de choix** entre les 15 types de graphiques.

Principe transposable : un skill de code doit **détecter le contexte réel** (fichiers de configuration, dépendances installées, conventions) avant de produire quoi que ce soit. C'est la règle 0 de ce skill appliquée au code.

## Quand l'utiliser
- Projet React + Tailwind + shadcn qui a besoin de graphiques au-delà d'une simple courbe.
- Tableaux de bord : choisir le type de graphique avec le guide, puis thémer via `--chart-*` pour rester cohérent avec les cartes et la marque.
- Pour les règles de choix de graphique et de couleur, croiser avec les principes de `references-visuelles.md` : une couleur fonctionnelle, hiérarchie par la typographie, unités explicites.

## Vérifications avant de l'adopter sur un projet client
- Vérifier sur le dépôt (https://github.com/bklit/bklit-ui) la licence, la fréquence des mises à jour et la compatibilité avec la version de React, Tailwind et shadcn du projet.
- Les commandes et noms d'API ci-dessus viennent de la documentation du projet : les revérifier sur ui.bklit.com au moment de l'installation, car elles peuvent évoluer.

## À compléter
Ajouter ici les autres bibliothèques utilisées par l'équipe (composants, icônes, animations), avec pour chacune : usage, commande d'installation, tokens de thème, pièges connus.
