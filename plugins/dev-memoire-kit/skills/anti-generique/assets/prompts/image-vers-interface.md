# Prompt : image de référence → interface React

Modèle réutilisable. Remplacer les `[…]`. Joindre l'image de référence au message. Exemple rempli plus bas (dashboard de `references-visuelles/dashboard-monochrome.png`).

```
Analyse l'image de référence fournie et recrée son interface avec une fidélité visuelle maximale.

OBJECTIF
Créer [type d'écran : dashboard SaaS / page produit / écran mobile…] inspiré EXACTEMENT de la structure,
des proportions, de la hiérarchie visuelle et du niveau de finition de l'image.
- Ce n'est pas une simple inspiration : reproduis la composition générale.
- Respecte espacements, tailles, proportions, bordures, rayons, ombres et hiérarchie.
- Le résultat doit être une version professionnelle et directement utilisable du design.
- Ne surcharge pas l'interface. Évite absolument le look « AI-generated dashboard » générique.

ÉTAPE 0 (obligatoire, avant tout code)
Rends une fiche d'analyse : grille et proportions, hiérarchie, typographie, couleurs avec leur rôle,
surfaces (bordures, rayons, ombres), liste des composants, élément signature, états/interactions.

TECH STACK
[React + TypeScript · Tailwind CSS · shadcn/ui si pertinent · Lucide React · Recharts ou équivalent]
Architecture propre, composants réutilisables, responsive desktop / tablette / mobile.

DIRECTION ARTISTIQUE
[ex. SaaS premium, minimaliste, beaucoup de blanc, gris très clair pour les surfaces secondaires,
texte noir / gris foncé, accent [couleur] UNIQUEMENT pour [rôle]]
Interdits : gradients inutiles, glassmorphism, couleurs flashy, grosses ombres, cartes trop arrondies.

TYPOGRAPHIE
Police : [Inter / Geist / …]. Titres forts et compacts · labels petits, gris, légèrement espacés ·
valeurs importantes grandes et en gras · secondaire en gris moyen · chiffres tabulaires.

CONTENU (adapter la référence au contexte réel)
Langue : [français]. Devise et formats : [FCFA, espace des milliers, JJ/MM/AAAA].
Chaque indicateur a une unité et une période explicites.
Libellés et données factices réalistes pour [utilisateurs / secteur].

LAYOUT ET COMPOSANTS
[Décrire chaque zone : barre latérale (largeur, sections, élément actif), en-tête, cartes, graphique,
tooltip… avec les valeurs mesurées sur l'image]

RESPONSIVE
Desktop : [..] · Tablette : barre latérale réduite · Mobile : tiroir, cartes empilées,
graphique défilable horizontalement, recherche réduite à une icône.

MICRO-INTERACTIONS
Uniquement discrètes : survol navigation et cartes, transition du contrôle segmenté, tooltip fluide,
apparition légère des données. Framer Motion seulement si nécessaire.

QUALITÉ
Spacing cohérent, alignements parfaits, aucune icône disproportionnée, aucune carte inutile,
aucune couleur décorative, aucun effet « template ». États chargement / vide / erreur prévus.

IMPLÉMENTATION
Découpe en composants : [liste]. Données factices dans un fichier séparé.
Design tokens (couleurs, rayons, espacements, ombres, typographie) en variables.
Ne mets pas toute l'interface dans un seul composant.

RÈGLE PRINCIPALE
L'image est la référence visuelle principale. Analyse d'abord, implémente ensuite.
Termine par la liste des écarts restants entre ton rendu et l'image.
```

---

## Exemple rempli (dashboard monochrome)

Version d'origine de l'auteur, conservée comme exemple de niveau de détail attendu :

- **Barre latérale** 280–320 px : sélecteur d'espace de travail (carte grise/blanche, logo carré, « Agency / Spark Pixel Team », chevron, bordure subtile, rayon ~12 px) ; sections « Main Menu » (Dashboard actif : fond blanc, bordure, ombre légère, texte noir ; autres : transparent, gris, survol subtil), « Customers », « Management », « Settings » en bas ; séparateurs discrets ; ne domine jamais le contenu.
- **En-tête** : fil d'Ariane « Dashboard > Overview » (gris clair / noir gras), recherche ~200 px à droite (icône, fond gris très léger, bordure subtile).
- **Titre** « Welcome back, … » 28–34 px.
- **3 cartes KPI** : label en capitales, valeur grande, mini-graphique vertical très discret à droite, indicateur de variation en bas ; fond blanc, bordure ~#EAEAEA, rayon 14–16 px, ombre extrêmement légère, padding généreux, hauteurs égales.
- **Carte Sales Trend** pleine largeur : titre + icône info, bouton « … » rond ; « Total Revenue » + valeur ; légende ○ NEW USER / ● EXISTING USER ; contrôle segmenté Weekly / **Monthly** / Yearly.
- **Graphique** : Jan→Dec, axe 0k→60k, barres très fines et nombreuses formant une grille dense (valeurs quotidiennes groupées par mois), noir = existants, gris clair = nouveaux, espacement minimal, grille de fond à très faible contraste.
- **Tooltip** : fond blanc, bordure subtile, ombre légère, rayon 10–12 px, padding 14–18 px, ligne verticale de référence et point noir, positionnement qui ne sort pas du graphique.
- **Composants** : DashboardLayout, Sidebar, WorkspaceSelector, SidebarSection, SidebarItem, TopBar, Breadcrumb, SearchBar, PageHeader, StatsGrid, StatCard, MiniChart, SalesTrendCard, ChartHeader, ChartLegend, PeriodSelector, SalesChart, ChartTooltip.

Ce qui rend ce prompt efficace : mesures chiffrées, rôle de chaque couleur, liste d'interdits, découpage en composants imposé, tokens obligatoires, et l'image désignée comme source de vérité.
