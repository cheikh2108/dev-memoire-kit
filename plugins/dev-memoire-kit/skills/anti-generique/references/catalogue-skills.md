# Catalogue de skills design et front-end à connaître

Sélection tirée d'Aura Skills (https://www.aura.build/skills, 192 skills recensés le 08/10/2026), un annuaire communautaire de skills pour agents de code et de design. Les commandes d'installation viennent des README de chaque projet, consultés à la même date. Les revérifier avant d'installer.

## Prudence avant d'installer un skill tiers
- Un skill est un **ensemble d'instructions**, et parfois de **scripts exécutables**, donnés à un agent qui a accès à votre code. Lire `SKILL.md` et les scripts avant d'installer, comme pour une dépendance npm.
- Vérifier la **licence** (celles marquées ✅ ci-dessous ont été vérifiées : MIT), la date de dernière mise à jour et l'auteur.
- L'annuaire contient des doublons (plusieurs copies de « UI Design System » ou de « Three.js Animation »), des entrées de test vides et des « personas » sans rapport avec le design : se limiter aux dépôts sources reconnus.
- Un skill d'opinion n'est pas une vérité : en cas de conflit, le DESIGN.md du projet gagne (voir `principes-communaute.md` §6).

## Anti-générique et qualité d'interface (priorité)

| Skill | Dépôt | Ce qu'il apporte | Installation (selon le README) |
|---|---|---|---|
| ✅ Taste Skill | `Leonxlnx/taste-skill` | Lecture du brief, 3 curseurs (variété, mouvement, densité), longue liste de « signatures IA » interdites, variantes (minimaliste, brutaliste, image → code, redesign) | `npx skills add https://github.com/Leonxlnx/taste-skill` |
| ✅ UI Skills (Baseline UI, Improve UI, create-design-md, fixing-accessibility, fixing-motion-performance, fixing-metadata) | `ibelick/ui-skills` | Règles strictes contre le « UI slop », audit d'interface avec plan, génération de DESIGN.md, plus une galerie de DESIGN.md de vrais produits (Vercel, Atlassian, Clerk, DSFR, UNICEF…) | `npx ui-skills start` |
| ✅ Web Interface Guidelines | `vercel-labs/web-interface-guidelines` | Checklist de revue (accessibilité, formulaires, animation, performance, i18n) avec sortie `fichier:ligne` | `npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines` |
| ✅ Make Interfaces Feel Better | `jakubkrehel/make-interfaces-feel-better` | 19 principes de finition (rayons concentriques, alignement optique, ombres, icônes, zones de clic), modes de revue rapide et complète | `npx skills add jakubkrehel/make-interfaces-feel-better` |
| ✅ Skills d'Emil Kowalski | `emilkowalski/skills` | Animation (choix des courbes et durées, revue et audit), mobile natif, « break-ui » (tester avec des données extrêmes), choix de bibliothèque | `npx skills@latest add emilkowalski/skills` |
| Frontend Design | `anthropics/skills` | Direction esthétique affirmée, typographie, éviter les choix par défaut | via le dépôt officiel Anthropic |

## Design system et DESIGN.md
| Skill | Dépôt / auteur | Usage |
|---|---|---|
| UI Design System | `davila7/claude-code-templates` | Tokens, règles responsive, accessibilité, documentation de passation |
| Tailwind Design System v4 | `wshobson/agents` | Système de design Tailwind v4 + composants React |
| Extract Design System | `arvindrk/extract-design-system` | Extraire tokens et primitives d'un site public vers un fichier de départ |
| Stitch-UI / Stitch Design Taste | communauté | Générer des DESIGN.md « non génériques » pour Google Stitch |
| Design DNA | `zanwei/design-dna` | Extraire et appliquer l'identité visuelle d'une référence |

## Animation
| Skill | Dépôt | Usage |
|---|---|---|
| GSAP Skills (core, timeline, ScrollTrigger, React, Vue/Svelte, performance) | `greensock/gsap-skills` (officiel GSAP) | Animations au scroll et séquences, avec nettoyage correct dans les frameworks |
| Interaction Design | `wshobson/agents` | Micro-interactions et retours visuels utiles |
| Anime.js v4 | `BowTiedSwan/animejs-skills` | Alternative légère à GSAP |
| MengTo Skills (Masked Reveal, Staggered Word Reveal, Animation On Scroll, Progressive Blur…) | `MengTo/Skills` | Recettes d'effets précis, prêtes à l'emploi |

## Contenu, conversion, marketing
| Skill | Dépôt | Usage |
|---|---|---|
| Copywriting, Marketing Psychology, Paywall CRO, Analytics Tracking | `coreyhaines31/marketingskills` | Textes de landing page, tarification, suivi GA4/GTM |
| Landing Page High-Conversion, SaaS Pricing Page | `MengTo/Skills` | Structure et textes de pages de conversion |
| UX Copywriting Guide | communauté | Micro-textes, messages d'erreur, boutons |

## Spécialisés (à installer seulement si besoin)
Three.js et WebGL (`CloudAI-X/threejs-skills`, effets WebGL de `MengTo/Skills`), globe 3D (cobe.js, Globe.GL), physique 2D (Matter.js), Responsive Design (`wshobson/agents`), Bootstrap 5.

## Ce que nous en avons repris
Les règles utiles ont été synthétisées en français, adaptées au contexte local, dans `principes-communaute.md` (sources citées). Les skills eux-mêmes ne sont pas copiés dans ce dépôt : installer les originaux pour avoir la version à jour.
