# Principes de la communauté (synthèse adaptée)

Synthèse en français, réorganisée et adaptée au contexte local, de cinq skills open source (licence MIT) repérés dans le catalogue Aura Skills. Les mentions de licence sont dans `THIRD_PARTY_NOTICES.md` à la racine du dépôt. Pour le détail, lire les originaux (liens dans `catalogue-skills.md`).

Ce sont des **règles d'opinion**. Elles se contredisent parfois entre elles et avec nos propres exemples (voir §6). En cas de conflit, le DESIGN.md du projet gagne.

---

## 1. Lire le brief avant de dessiner
*Source : Leonxlnx/taste-skill*

1. **Repérer les signaux** : type de page, mots d'ambiance employés (« sobre », « premium », « ludique »), références fournies (liens, captures), **public**, éléments de marque existants, contraintes silencieuses (service public, accessibilité, finance, enfants). Les contraintes passent avant les goûts.
2. **Écrire une ligne de lecture du design** avant tout code : « Lecture : [type de page] pour [public], langage [ambiance], orienté [système ou famille esthétique]. »
   - Ex. : « Lecture : outil de gestion de taxes pour agents municipaux, langage sobre et digne de confiance, orienté composants accessibles, densité élevée, peu d'animation. »
3. **Une seule question** si deux lectures divergent vraiment ; sinon, annoncer la lecture et avancer.
4. **Régler trois curseurs** (1 à 10) : *variété de mise en page*, *intensité du mouvement*, *densité visuelle*. Préréglages adaptés :

| Cas | Variété | Mouvement | Densité |
|---|---|---|---|
| Outil métier / ERP / back-office | 3 | 2 | 7 |
| Service public, finance, santé | 3 | 2 | 5 |
| Application mobile grand public (Android d'entrée de gamme) | 4 | 3 | 4 |
| Landing page SaaS | 7 | 6 | 4 |
| Portfolio, agence créative | 9 | 8 | 3 |

---

## 2. Les « signatures IA » à bannir
*Sources : taste-skill, ibelick/ui-skills (baseline-ui)*

**Visuel**
- Dégradés violets ou multicolores, lueurs (glow) comme moyen principal d'attirer l'œil, néon.
- Noir pur `#000` : préférer un quasi-noir.
- Accents sursaturés ; plus d'une couleur d'accent par vue.
- Glassmorphism partout, grosses ombres, curseur de souris personnalisé.

**Mise en page**
- La rangée de **trois cartes identiques** (icône + titre + 2 lignes). Préférer zigzag sur 2 colonnes, grille asymétrique, liste.
- Le héros centré sur fond « mesh » sombre.
- La **fausse capture produit** construite en `<div>` (faux terminal, faux tableau de bord). Utiliser une vraie capture ou rien.
- Numéros de section décoratifs (« 01 / INDEX »), étiquettes de version dans le héros (« BETA », « v2.0 ») sans raison réelle.
- Points de couleur décoratifs devant chaque élément de liste ou de menu.
- Lignes de grille dessinées seulement pour « faire design ».

**Contenu**
- Noms génériques (John Doe, Acme, Nexus, SmartFlow) → noms locaux crédibles.
- Chiffres trop ronds ou trop parfaits (99,99 %, 1 234 567).
- Verbes creux : « élever », « révolutionner », « libérer », « fluide », « nouvelle génération ».
- Avatars génériques en silhouette.

---

## 3. Règles de code d'interface
*Source : ibelick/ui-skills (baseline-ui)*

- Réutiliser **les primitives du projet** ; pour tout ce qui gère le clavier ou le focus, une bibliothèque accessible (Radix, React Aria, Base UI). Ne jamais mélanger deux systèmes sur la même surface, ne jamais recoder le focus à la main.
- Bouton avec seulement une icône → `aria-label`.
- Action destructive ou irréversible → boîte de confirmation.
- Chargement → squelette structurel. État vide → **une** action suivante claire.
- Erreur affichée **à l'endroit de l'action**.
- `h-dvh` plutôt que `h-screen` (barres mobiles) ; respecter `safe-area-inset` pour les éléments fixes.
- Ne jamais bloquer le collage dans un champ.
- Échelle de `z-index` fixe, pas de valeurs arbitraires.
- Pas d'animation non demandée ; animer seulement `transform` et `opacity` ; retour d'interaction ≤ 200 ms ; mettre en pause les boucles hors écran ; respecter `prefers-reduced-motion`.
- Pas de grand `blur()` ou `backdrop-filter` animé ; `will-change` seulement pendant une animation.
- Titres en `text-balance`, paragraphes en `text-pretty`, données en `tabular-nums`, `truncate` ou `line-clamp` dans les interfaces denses.

---

## 4. Les finitions qui changent tout
*Source : jakubkrehel/make-interfaces-feel-better*

| Principe | Règle |
|---|---|
| Rayons concentriques | rayon extérieur = rayon intérieur + padding. Deux rayons identiques imbriqués « sonnent faux ». |
| Alignement optique | Corriger à l'œil les icônes asymétriques (lecture ▶, flèches) quand le centrage géométrique semble décalé. |
| Ombres pour la profondeur, bordures pour la structure | Une bordure qui ne sert qu'à « détacher » une carte → ombre légère transparente. Garder les bordures de séparation, de sélection, de focus. |
| Animations interruptibles | Transitions CSS pour les changements d'état ; keyframes pour les séquences uniques. |
| Entrées en cascade | Pour une entrée rare, découper en blocs et décaler d'environ 100 ms. Jamais sur une interaction fréquente. |
| Sorties discrètes | Petit `translateY` fixe, plus doux que l'entrée. |
| Chiffres tabulaires | Sur tout nombre qui se met à jour, pour éviter les sauts de mise en page. |
| Contour d'image | Contour 1 px très transparent (noir pur en clair, blanc pur en sombre) pour une profondeur homogène. |
| Pression | `scale(0.96)` au clic ; jamais en dessous de 0,95. |
| Pas d'animation au premier rendu | Les éléments déjà là ne « rentrent » pas au chargement. |
| Jamais `transition: all` | Lister les propriétés. |
| Zone de clic | 44 × 44 px sur mobile, 40 × 40 px minimum en interface dense ; jamais de zones qui se chevauchent. |
| Icônes | Épaisseur de trait accordée à la graisse du texte voisin ; une seule bibliothèque par surface ; `currentColor` pour les états. |
| Sobriété du mouvement | Le mouvement n'est jamais le seul signal : couleur, icône ou texte en plus. |

Astuce de revue : rejouer les animations à 10 % de vitesse dans l'onglet *Animations* du navigateur et parcourir chaque état (survol, focus, actif, chargement, vide).

---

## 5. Checklist d'interface web
*Source : vercel-labs/web-interface-guidelines (extraits, adaptés au français)*

- **Accessibilité** : `<button>` pour les actions, `<a>` pour la navigation (jamais `<div onClick>`) ; `alt` sur les images ; `aria-live="polite"` pour les notifications ; hiérarchie de titres ; lien d'évitement vers le contenu.
- **Focus** : focus visible (`:focus-visible`) ; jamais `outline: none` sans remplacement.
- **Formulaires** : `autocomplete`, `name` et `type` corrects (`tel`, `email`) avec `inputmode` ; libellés cliquables ; bouton actif jusqu'à l'envoi puis indicateur ; erreurs à côté des champs, focus sur la première erreur ; prévenir avant de quitter une page non enregistrée.
- **Typographie** : points de suspension `…` ; en français, **guillemets « » avec espaces insécables** et espace insécable avant `: ; ? !` ; espace insécable dans « 10 Mo », « 5 000 FCFA » ; états de chargement « Chargement… », « Enregistrement… ».
- **Contenu** : prévoir les textes très courts, moyens et très longs ; `min-w-0` sur les enfants flex pour permettre la troncature ; jamais d'interface cassée sur une liste vide.
- **Images** : `width` et `height` explicites (pas de saut de mise en page) ; `loading="lazy"` sous la ligne de flottaison.
- **Performance** : virtualiser les listes de plus de 50 éléments ; `preconnect` vers les CDN ; polices critiques préchargées avec `font-display: swap` ; vidéo compressée plutôt que GIF.
- **Navigation et état** : l'URL reflète filtres, onglets et pagination ; action destructive = confirmation ou annulation possible.
- **Tactile** : `touch-action: manipulation` ; `overscroll-behavior: contain` dans les tiroirs et modales ; jamais `user-scalable=no`.
- **Thème sombre** : `color-scheme: dark` ; `<meta name="theme-color">` assorti.
- **Langue et formats** : `Intl.DateTimeFormat` et `Intl.NumberFormat` (`fr-SN`, `XOF`), jamais de formats codés en dur ; `translate="no"` sur les noms de marque.
- **Rédaction** : voix active ; libellés de bouton précis (« Enregistrer le paiement » plutôt que « Continuer ») ; un message d'erreur donne la solution, pas seulement le problème.
  - Adaptation française : **pas de Title Case** (règle anglaise). En français, seule la première lettre prend une majuscule : « Ajouter un élève ».

---

## 6. Contradictions à arbitrer
| Sujet | Position A | Position B | Notre arbitrage |
|---|---|---|---|
| Police Inter | taste-skill : éviter Inter par défaut | Exemple PaperFlow et dashboard de référence : Inter | Inter est acceptable **si** elle est choisie et associée à une 2e voix (mono pour les libellés, chiffres tabulaires). L'interdit vise le choix par défaut, pas la police. |
| Libellés en mono, numérotation | Dashboard de référence : libellés mono en capitales | taste-skill : pas de numéros de section décoratifs | Les libellés techniques en mono sont un vrai choix de système ; la numérotation décorative « 01 / INDEX » reste à éviter. |
| Lignes de grille | « Framed Grid Layout » (catalogue) en fait un style | taste-skill : pas de lignes décoratives | Autorisé seulement si les lignes organisent réellement le contenu. |
| Mode sombre | taste-skill : obligatoire pour les pages grand public | Outils métier locaux | Optionnel pour un outil interne ; obligatoire seulement si le public le demande. Ne jamais mélanger les deux modes sur une même page. |
| Animation | baseline-ui : aucune animation non demandée | Prompts de reconstruction de site : animations riches | Interface métier : sobre. Site vitrine ou marketing : animations définies dans le brief, toujours avec `prefers-reduced-motion`. |
