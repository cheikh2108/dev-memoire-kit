# DESIGN.md : décrire un système visuel pour une IA

Un `DESIGN.md` est un fichier placé à la racine d'un projet (ou joint à un prompt) qui décrit le système visuel : des **tokens** lisibles par une machine en en-tête YAML, puis des **règles** en prose. Les outils de génération (Aura, Google Stitch, Claude, Cursor…) s'en servent comme source de vérité. C'est l'outil anti-générique le plus efficace pour le design : l'IA n'a plus à choisir couleurs, polices et rayons, donc elle ne retombe pas sur ses réglages par défaut.

Exemple réel : `assets/design-md/exemple-paperflow.md` (section tarifs « PaperFlow », modèle Neuform de Sourasith Phomhome). Modèle vierge à remplir : `assets/design-md/modele-DESIGN.md`.

## Structure

**En-tête YAML (tokens)**
| Clé | Contenu |
|---|---|
| `name`, `description`, `version` | Identité du système et usage visé |
| `colors` | Rôles nommés : `primary`, `accent`, `background`, `surface`, `text-primary`, `text-secondary`, `border`… |
| `typography` | Styles nommés (`display-lg`, `body-md`, `label-md`) avec police, taille, graisse, interlignage, espacement |
| `spacing` | Base (8 px), gap, padding des cartes et des sections |
| `rounded` | Rayons par type : carte, contrôle, pilule |
| `components` | Règles par composant (carte, bouton…) |

**Corps (prose)** : Overview · Composition · Colors · Typography · Layout · Components · Motion · Effets (WebGL, particules) · **Guardrails** (interdits).

## Ce que l'exemple PaperFlow fait bien
- **Couleurs par rôle**, pas par nom (« surface », « text-secondary ») : l'IA sait où utiliser chacune.
- **Deux familles typographiques** à rôles clairs : Inter pour l'affichage et le corps, JetBrains Mono pour les libellés et métadonnées techniques. C'est une signature visuelle forte à peu de frais.
- **Rayons cohérents** : carte 16 px, contrôle 8 px, pilule, et la consigne de garder la même logique de rayons et de bordures partout.
- **Guardrails explicites**, la partie la plus utile contre le générique :
  - ne pas aplatir la source en grille de cartes générique ;
  - ne pas changer de mode clair/sombre ;
  - préserver le premier écran, l'objet focal et la densité ;
  - aligner boutons, cartes et badges sur le même langage de rayons et de bordures.
- **Effets en arrière-plan** : WebGL et particules restent secondaires à l'interface et doivent rester performants.

## Ce qu'il faut corriger avant de s'en servir

**1. Contrastes insuffisants (mesurés, WCAG 2.x)**

| Combinaison | Ratio | Verdict |
|---|---|---|
| `#E65C00` (primary) sur `#FDFBF7` (background) | 3,45:1 | Échoue pour du texte normal (4,5:1 requis). Acceptable seulement pour un grand texte (≥ 24 px, ou ≥ 18,66 px en gras) ou un élément graphique. |
| Texte blanc sur bouton `#E65C00` | 3,56:1 | Échoue pour un libellé de bouton en 14-16 px. Assombrir l'orange (ex. vers `#C2410C`) ou passer le texte en `#111827`. |
| `#FFB380` (accent) sur fond | 1,69:1 | Décoratif uniquement, jamais pour du texte ni une icône porteuse de sens. |
| `#4B5563` sur `#F7F4EB` | 6,87:1 | OK |
| `#111827` sur `#FDFBF7` | 17,16:1 | OK |

Règle : un DESIGN.md doit **indiquer pour chaque couleur d'accent si elle peut porter du texte**, avec son ratio.

**2. Rôles dupliqués** : `secondary` et `background` ont la même valeur `#FDFBF7`. Soit `secondary` désigne autre chose, soit il faut le supprimer.

**3. Tokens manquants** : aucun état fonctionnel (`success`, `warning`, `danger`, `info`), pas de `focus-ring`, pas d'ombres chiffrées. La consigne « HTML-matched shadow depth » ne sert à rien sans le HTML : donner des valeurs (`shadow-card: 0 1px 2px rgba(17,24,39,.06)`).

**4. Bruit d'extraction** : l'Overview contient du texte aspiré de la page (« Flow Platform Plans… @jordanhayes Projects About I'm Jordan Hayes… »). Il pollue la génération : le supprimer et le remplacer par 2 ou 3 phrases d'intention.

**5. Dépendance à une source absente** : « Use the attached HTML reference as the source of truth ». Sans le HTML joint, ces règles ne s'appliquent pas. Un DESIGN.md doit se suffire à lui-même.

## Méthode pour écrire le DESIGN.md d'un projet
1. **Extraire** les tokens d'une source réelle : maquette Figma, charte du client, site existant, ou capture analysée (`reproduction-ui.md` étape 1).
2. **Nommer par rôle**, jamais par teinte (`surface` et pas `beige-clair`).
3. **Mesurer les contrastes** de chaque couple texte/fond et le noter dans le fichier.
4. **Écrire les guardrails** : 4 à 8 interdits précis, tirés des erreurs déjà vues sur le projet.
5. **Ajouter le contexte local** : langue, format monétaire (FCFA), dates, cible d'appareil (Android d'entrée de gamme, réseau lent).
6. **Le versionner** dans le dépôt et le citer dans chaque prompt de génération d'UI : « Respecte strictement DESIGN.md ».
7. **Le faire évoluer** : chaque correction de design récurrente devient un token ou un guardrail.

## Lien avec le code
Les tokens du DESIGN.md doivent exister **à l'identique** dans le code : variables CSS (`--color-surface`), `@theme` de Tailwind v4 ou `theme.extend` de Tailwind v3. Un DESIGN.md qui diverge du code fait plus de mal que de bien.
