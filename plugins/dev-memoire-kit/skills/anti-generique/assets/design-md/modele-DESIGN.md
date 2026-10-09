---
version: "1.0.0"
name: "[Nom du produit] Design System"
description: "[Une phrase : produit, public, ton visuel. Ex. : application de gestion pour PME sénégalaises, sobre et dense, pensée pour Android d'entrée de gamme.]"
locale:
  language: "fr-SN"
  currency: "XOF"          # affichage : 20 320 000 FCFA (espace des milliers, pas de décimales)
  date: "JJ/MM/AAAA"
  phone: "+221 7X XXX XX XX"
colors:
  # Rôle → valeur → usage autorisé (ratio mesuré sur background)
  background: "#FAF9F7"
  surface: "#FFFFFF"
  surface-muted: "#F3F1ED"
  border: "#E4E0DA"
  text-primary: "#1C1C1A"     # texte courant (≥ 4.5:1)
  text-secondary: "#5B5853"   # texte secondaire (vérifier ≥ 4.5:1)
  primary: "[#hex]"           # actions principales — texte autorisé ? [oui/non, ratio]
  on-primary: "[#hex]"        # texte sur primary (≥ 4.5:1)
  accent: "[#hex]"            # décoratif / graphique uniquement si < 3:1
  success: "[#hex]"
  warning: "[#hex]"
  danger: "[#hex]"
  focus-ring: "[#hex]"
  chart: ["[--chart-1]", "[--chart-2]", "[--chart-3]", "[--chart-4]", "[--chart-5]"]
typography:
  display-lg: { fontFamily: "[Police]", fontSize: "40px", fontWeight: 600, lineHeight: "1.1", letterSpacing: "-0.01em" }
  heading-md: { fontFamily: "[Police]", fontSize: "20px", fontWeight: 600, lineHeight: "1.3" }
  body-md:    { fontFamily: "[Police]", fontSize: "16px", fontWeight: 400, lineHeight: "1.6" }
  label-sm:   { fontFamily: "[Police mono ou sans]", fontSize: "12px", fontWeight: 600, lineHeight: "1.2", letterSpacing: "0.04em", textTransform: "uppercase" }
  numeric:    { fontFeatureSettings: "'tnum' 1" }   # chiffres tabulaires pour montants et KPI
spacing:
  base: "4px"
  scale: [4, 8, 12, 16, 24, 32, 48, 64]
  card-padding: "24px"
  section-padding: "64px"     # mobile : 40px
rounded:
  control: "8px"
  card: "12px"
  pill: "9999px"
shadows:
  card: "0 1px 2px rgba(28,28,26,.06)"
  overlay: "0 8px 24px rgba(28,28,26,.12)"
motion:
  duration-fast: "120ms"
  duration-base: "200ms"
  easing: "cubic-bezier(.2,.8,.2,1)"
  reduced-motion: "désactiver transformations et animations décoratives"
breakpoints:
  sm: "640px"
  md: "768px"
  lg: "1024px"
---
# [Nom du produit] Design System

## Overview
[2 ou 3 phrases d'intention : pour qui, dans quel contexte d'usage, quelle impression. Pas de texte marketing.]

## Composition
- Action principale de chaque écran visible sans défiler, une seule par écran.
- [Structure type : barre latérale / navigation basse sur mobile / contenu max 1200px…]

## Colors
- Neutres pour 90 % de l'interface ; `primary` réservé aux actions ; `success/warning/danger` réservés aux états.
- Ne jamais transmettre une information par la couleur seule (signe, icône ou texte en plus).
- [Ratios mesurés pour chaque couple texte/fond utilisé.]

## Typography
- [Police d'affichage et police de corps, et pourquoi.]
- Montants et indicateurs en chiffres tabulaires, toujours avec unité et période.

## Layout
- Grille [12 colonnes desktop / 4 mobile], gouttière [16/24px].
- Cartes empilées sur mobile ; tableaux transformés en listes de cartes sous 640px.

## Components
- **Bouton** : rayon `control`, hauteur ≥ 44px (cible tactile), libellé = verbe + objet.
- **Carte** : fond `surface`, bordure `border`, ombre `card`, rayon `card`.
- **Champ** : libellé au-dessus, erreur sous le champ en `danger`, focus visible `focus-ring`.
- **États** obligatoires : chargement (squelette), vide (message + action), erreur (cause + « Réessayer »), hors ligne.

## Motion
- Discrète et utile : retour d'action, transition d'état. Pas d'animation décorative en boucle.
- Respecter `prefers-reduced-motion`.

## Contexte local
- Français ; FCFA sans décimales ; dates JJ/MM/AAAA ; noms et numéros sénégalais dans les données de démo.
- Paiements affichés : [Wave, Orange Money, espèces…].
- Performance : images WebP + lazy loading, pas de vidéo en lecture automatique, tester en 3G sur Android d'entrée de gamme.

## Guardrails
- Pas de dégradé violet/bleu, pas de glassmorphism, pas de cartes identiques à icônes « Rapide / Sécurisé / Simple ».
- Pas d'emojis dans l'interface.
- Pas de chiffres, témoignages ou logos clients inventés.
- Ne pas mélanger les rayons : contrôles `control`, conteneurs `card`.
- [Interdits propres au projet, tirés des erreurs déjà corrigées.]
