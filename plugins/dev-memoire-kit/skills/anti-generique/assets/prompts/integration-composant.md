# Prompt : intégrer un composant React existant (shadcn / Tailwind / TypeScript)

Format courant des bibliothèques de composants (type 21st.dev). Modèle à réutiliser, puis **checklist de revue**, car le code copié contient souvent des erreurs.

```
Tu dois intégrer un composant React existant dans le projet.

Le projet doit supporter : structure shadcn, Tailwind CSS, TypeScript.
Sinon, donne les instructions d'installation (shadcn CLI, Tailwind, TypeScript).

Détermine le chemin par défaut des composants et des styles.
Si ce n'est pas /components/ui, explique pourquoi créer ce dossier est important (convention shadcn,
imports @/components/ui/...).

Copie ce composant dans /components/ui :
[nom-du-fichier].tsx
[code]

Démo : [demo.tsx]
Dépendances npm : [liste]

AVANT DE COPIER, vérifie et corrige :
- erreurs de syntaxe introduites par le copier-coller (template literals, sauts de ligne dans des chaînes) ;
- utilitaires dupliqués (cn, Card…) : réutilise ceux du projet (@/lib/utils, @/components/ui/card) ;
- nom du composant cohérent avec le nom du fichier ;
- données factices sorties du composant et passées en props ;
- couleurs codées en dur remplacées par les tokens du thème ;
- textes et formats adaptés au projet (langue, devise, dates).
Liste ce que tu as modifié et pourquoi.
```

## Checklist de revue (cas réel : composant « stats » à sparklines)

Problèmes trouvés dans un composant copié depuis une bibliothèque publique :

| Problème | Extrait | Correction |
|---|---|---|
| **Template literal cassé** | `` [data-chart=${id] { `` | `` [data-chart=${id}] { `` : l'accolade manque, le CSS généré est invalide |
| **Saut de ligne réel dans une chaîne** | `.join("⏎")` sur deux lignes | `.join("\n")` : l'échappement s'est perdu au copier-coller, erreur de compilation |
| **Nom incohérent** | fichier `stats-4.tsx`, export `Stats10` | Nommer selon l'usage : `StockSummaryCards` |
| **Utilitaires redéfinis** | `cn`, `Card`, `CardContent` déclarés dans le fichier | Importer `cn` de `@/lib/utils` et `Card` de `@/components/ui/card` |
| **Données dans le composant** | tableaux `data` et `summary` en dur | Props typées (`items: SummaryItem[]`, `series: Point[]`) et données dans un fichier à part |
| **Couleurs en dur** | `hsl(142.1 76.2% 36.3%)` | Variables du thème (`--color-positive`, `--color-negative`) |
| **Sens porté par la seule couleur** | vert / rouge | Garder le signe `+` / `−` ou une icône, vérifier le contraste |
| **`dangerouslySetInnerHTML`** | injection de CSS | Acceptable ici car les valeurs viennent de la config, **jamais** de données utilisateur |

Points positifs à garder : balisage `<dl>/<dt>/<dd>`, `React.useId()` pour des identifiants uniques, `"use client"` explicite (Next.js App Router).

## Deuxième cas réel : carte métrique (« progress-metric-card »)

Composant de meilleure qualité (props typées, tailles, état de chargement, formateurs injectables, commentaires utiles), mais le prompt d'intégration est **incomplet** :

| Problème | Détail | Correction |
|---|---|---|
| **Fichiers importés absents** | `import … from './metric-chart'` et `'./metric-controls'` alors que seuls `progress-metric-card.tsx` et `demo.tsx` sont fournis | Récupérer **tous** les fichiers de la source avant de lancer l'intégration ; sinon l'IA les réinventera |
| **Dépendances incomplètes** | seul `lucide-react` est listé | Vérifier les imports de chaque fichier (`recharts` ? utilitaires ?) |
| **Indicateur ambigu** | % calculé entre premier et dernier point | Le documenter en prop ou le passer en « vs période précédente » |
| **Libellés en anglais en dur** | `'Past 30 days'`, `'today'` | Ils sont déjà en props (`periodOptions`, `deltaLabel`) : les passer en français depuis l'appelant |

Ajouter au prompt : « Liste tous les imports locaux du composant ; si un fichier importé n'est pas fourni, arrête-toi et demande-le au lieu de l'écrire. »

## Règle générale
Un composant trouvé en ligne est un **point de départ**, pas du code fiable. Le relire comme une PR externe (`bonnes-pratiques-dev/references/checklist-revue.md`) avant de l'intégrer.
