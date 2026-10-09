# Prompt : spécification de reconstruction d'un site (haute fidélité)

Format tiré de deux prompts réels (une boutique de mode monochrome et une boutique de mobilier) qui ont produit des sites très fidèles. Sa force : il décrit le site comme un **cahier des charges technique**, section par section, avec les valeurs exactes et les pièges connus. L'IA n'a presque rien à inventer, donc presque rien de générique.

## Usage légitime
- **Apprentissage** : reconstruire un site qu'on admire pour comprendre ses techniques.
- **Projet client** : décrire **sa propre** maquette (Figma, image, ancien site du client) avec ce format.
- Ne pas livrer à un client un clone d'un site tiers avec ses textes, images, logo ou marque : remplacer l'**ASSET MAP** et les textes par ceux du client.

## Modèle

```
Recreate the website "[NOM]" with high visual fidelity using [HTML + Tailwind + JS vanilla /
React + Tailwind…]. The site is a [type + adjectifs précis : high-end monochrome fashion
e-commerce landing page with a minimalist, editorial aesthetic].

PRESERVE SOURCE QUIRKS
- [Détails non évidents qui font l'identité : ex. le mot-symbole du héros est DERRIÈRE
  le modèle, la profondeur vient de la transparence de l'image]
- [Icône SVG spécifique : chemin + stroke-width exact]
- [IDs de sections à respecter : #hero, #shop, …]
- [Comportement responsive particulier : liens de navigation masqués sous 900px]
- [Bugs connus de la source et l'intention à garder : « translateY(20px; » sans parenthèse
  → garder le mouvement de 20px]

CRITICAL FIDELITY CONSTRAINTS
- Couleurs exactes : fond [#EFEDE8], encre [#101010]…
- Grilles imposées : [4 colonnes desktop → 2 mobile]
- Traitements d'image : [grayscale(1), contrast 1.04–1.08]
- Ce qui ne doit pas être substitué : [vidéo, police, icônes]

TECH STACK / DEPENDENCIES
- CSS : [Tailwind CDN + variables CSS --bone, --ink, --mid, --line]
- Fonts : [Archivo 400–900 / Manrope + Inter] via Google Fonts
- Icons : [Iconify 1.0.7, set solar] ou SVG inline
- Animation : [JS vanilla, pas de GSAP]

GLOBAL STYLE
- Police, lissage, overflow, scroll-behavior
- Navigation : [sticky, 96px, backdrop-filter: blur(10px), fond rgba(…, .9)]

ASSET MAP
- [Rôle] : [URL ou chemin exact] (une ligne par image / vidéo)

VECTOR / ICON SHAPES
- [Nom] : [SVG ou identifiant d'icône]

MEDIA BEHAVIOR
- Vidéo : muted, loop, playsinline, preload="none", src posé par IntersectionObserver
- Images : lazy loading, animations pilotées par le scroll

LAYER STACK / POSITIONING MAP
- [Élément] : position, z-index (ex. Nav z-60 sticky ; Héros : mot-symbole z-1,
  modèle z-2, labels z-4 absolus)

SECTION 1 — [NOM] (#id)
- Layout : …
- Contenu : textes exacts
- Interaction / animation : valeurs exactes (délais, échelles, durées)
[… une rubrique par section …]

GLOBAL ANIMATION / INTERACTION RULES
- Barre de progression de scroll, classes de révélation (.rv → .in, décalage 70ms)
- prefers-reduced-motion : désactiver transformations et transitions

COMMON MISTAKES TO AVOID
- [Erreurs que l'IA fait typiquement sur ce site : overlay au lieu d'enfant direct,
  oubli du blur, photos de stock à la place des assets]

IMPLEMENTATION REQUIREMENTS
- [Page unique / premier écran seulement]
- Textes, couleurs et URLs exacts ; pas de substitution d'icônes ni d'images
- Valeurs clamp() de padding des sections reprises telles quelles
```

## Pourquoi ce format bat un prompt court
| Rubrique | Ce qu'elle empêche |
|---|---|
| PRESERVE SOURCE QUIRKS | La « normalisation » qui efface l'identité du site |
| CRITICAL FIDELITY | Les couleurs et polices par défaut de l'IA |
| ASSET MAP | Les photos de stock et les placeholders |
| LAYER STACK | Les erreurs de superposition (z-index, overlays) |
| SECTION par SECTION | Les sections inventées ou oubliées |
| COMMON MISTAKES | Les erreurs déjà vues lors d'essais précédents |
| Reduced motion | Les animations inaccessibles |

## Adapter au contexte sénégalais
- Textes en français, prix en FCFA, livraison « Dakar et régions », paiement Wave / Orange Money.
- Images légères (WebP, `srcset`, lazy loading) : beaucoup d'utilisateurs naviguent en 3G/4G avec un forfait limité. La vidéo ne se charge qu'à l'affichage, comme dans le modèle.
- Tester sur un Android d'entrée de gamme, pas seulement sur un MacBook.
