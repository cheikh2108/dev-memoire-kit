# Recréer une interface à partir d'une image de référence

Méthode tirée d'un prompt utilisé en production (voir `assets/prompts/image-vers-interface.md`). Elle évite le « dashboard IA générique » parce qu'elle force l'**analyse avant le code** et fixe des interdits explicites.

## Étape 1 : analyser l'image avant de coder
Produire d'abord (et montrer à l'utilisateur) une fiche d'analyse :
- **Grille et proportions** : largeur de la barre latérale (ex. 280-320 px), colonnes, gouttières, largeur maximale du contenu.
- **Hiérarchie** : ce que l'œil voit en 1er, 2e, 3e.
- **Typographie** : familles (sans-serif + éventuellement chasse fixe pour labels ou chiffres), tailles estimées, graisses, casse, espacement des lettres.
- **Couleurs** : relevé des neutres et des accents, avec le **rôle** de chaque couleur.
- **Surfaces** : fonds, bordures (épaisseur, teinte), rayons, ombres (souvent quasi nulles).
- **Composants** : liste nommée (Sidebar, StatCard, SalesChart…).
- **Élément signature** : ce qui rend l'image reconnaissable (un graphique particulier, une typographie, une mise en page). C'est la priorité de fidélité.
- **États et interactions** visibles ou implicites : actif, survol, tooltip, sélection.

## Étape 2 : fixer les jetons de design (tokens)
Avant tout composant : variables pour couleurs, rayons, espacements, ombres et typographie (CSS variables / thème Tailwind). Aucune valeur « magique » dispersée dans les composants.

## Étape 3 : découper en composants
Un composant par élément identifié, avec des données factices dans un **fichier séparé**. Jamais toute l'interface dans un seul fichier.

## Étape 4 : implémenter, puis comparer
Placer le rendu à côté de l'image et lister les écarts (espacements, tailles, alignements, couleurs). Corriger par passes successives.

## Étape 5 : adapter au contexte réel
La fidélité visuelle ne doit pas recopier le contenu fictif de la référence :
- **libellés** dans la langue des utilisateurs (français, éventuellement wolof pour certains publics) ;
- **données plausibles** : noms locaux, montants en FCFA, formats de date JJ/MM/AAAA, numéros +221 ;
- **unités explicites** sur chaque indicateur ;
- **responsive réel** : sur mobile, barre latérale en tiroir, cartes empilées, graphique défilable ; tester sur un Android d'entrée de gamme ;
- **états** prévus : chargement, vide, erreur.

## Interdits à écrire dans le prompt
Pas de dégradés inutiles · pas de glassmorphism · pas de couleurs vives · pas de grosses ombres · pas de cartes très arrondies · pas d'animations excessives · pas de cartes ou de couleurs décoratives inutiles · pas d'effet « template ».

## Questions de contrôle
- Si on retire toute la couleur, la hiérarchie reste-t-elle lisible ?
- Chaque couleur a-t-elle un rôle nommé ?
- Y a-t-il un élément signature, un seul ?
- Chaque chiffre a-t-il une unité et une période ?
- Le code compile-t-il sans valeurs codées en dur dans les composants ?

## Droit et éthique
Utiliser une image comme **référence de style** est normal. Pour un projet client, ne pas cloner à l'identique un produit commercial existant (logo, marque, contenu, identité). Reprendre les principes, pas la marque.
