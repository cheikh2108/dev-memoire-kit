# Modèle 01 — Tableau de bord « Atelier »

![Vue d'ensemble](apercu.png)

Tableau de bord clair, en grille de cartes très arrondies, avec un seul accent corail et une **phrase d'accueil qui change selon la vue** (« Semaine 45 réservée à 76 %, / 2 personnes en surcharge. »). Reconstruction originale d'après une démo publique de tableau de bord d'agence : nom, données et code réécrits.

## Quand le choisir

- Pilotage d'une équipe ou d'une activité : charge de travail, projets, revues clients, échéances.
- SaaS B2B où l'utilisateur ouvre l'écran plusieurs fois par jour et veut **une phrase** qui résume la situation avant les chiffres.
- Écrans de 1280 px et plus (bureau). Sur mobile, empiler les cartes dans l'ordre de lecture et garder la phrase d'accueil en tête.

À éviter pour : back-office dense de saisie (tableaux de 50 lignes), interface sombre imposée par la marque, données temps réel qui changent à la seconde (la cascade d'entrée deviendrait fatigante).

## Structure

```
En-tête      logo rond · nom de l'espace ··········· avatar + rôle · recherche en pilule
Bandeau      date en cercle · bouton principal (badge) ····· phrase d'accueil sur 2 lignes
Corps        rail d'icônes (vues) | grille 12 colonnes de cartes
             vue d'ensemble : projet en cours · heures prévues/réalisées · jauge · échéance en points
                              · courbe de tendance · activité récente · alerte avec action
             capacité       : jauge + répartition · planning par personne (barres)
             revues         : file des revues avec statut · jauge de validation
Toast        bas centré, sombre, avec « Annuler »
```

## Ce qui fait l'effet

1. **La phrase d'accueil est une donnée**, pas une formule : elle dit le fait le plus important de la vue en une ligne noire et sa conséquence en une ligne grise.
2. **Un seul accent** (corail) réservé aux unités (« h »), aux alertes, au bouton principal et aux dépassements. Tout le reste est noir, blanc et gris chaud.
3. **Cartes dans des cartes** : la sous-carte grise (`--sous`) porte le chiffre secondaire, sans bordure.
4. **Chiffres grands et sobres** (24 px, graisse 500, chasse serrée) avec l'unité en couleur.
5. **Mouvement court et sans rebond** : tout entre en moins de 0,6 s, en cascade, puis rien ne bouge (voir `animations.md`).

## Fichiers

| Fichier | Contenu |
|---|---|
| `exemple.tsx` | Composant React complet (`motion` uniquement), trois vues, données fictives |
| `style.md` | Tokens de couleur, rayons, ombres, typographie, espacements |
| `animations.md` | Chaque animation : déclencheur, propriétés, durée, courbe, décalage |
| `apercu.png`, `capacite.png` | Rendu du composant |

## Adapter

- **Remplacer les données et la phrase d'accueil** par celles du projet : chaque vue doit avoir *son* fait principal. Ne pas garder « Prêt à créer ? » sur un outil de comptabilité.
- **Changer l'accent** selon la marque (une seule teinte, plus sa version douce à ~15 % pour les fonds de pastille). Vérifier le contraste du texte blanc sur l'accent (≥ 4,5:1, sinon foncer l'accent).
- **Garder** : la grille de cartes, la hiérarchie phrase → chiffres → détails, les durées d'animation.
- **Retirer** ce qui n'a pas de donnée réelle derrière : une jauge sans mesure ou une courbe décorative trahissent un tableau de bord générique.
- Avec Tailwind ou shadcn/ui : reporter les tokens de `style.md` dans `tailwind.config` / les variables CSS du thème, et garder les composants `motion` tels quels.
