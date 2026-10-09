# Front-end : React / Next.js (et équivalents Vue)

Adapté d'une fiche « frontend-developer » fournie par l'équipe (React 19+, Next.js 15+). Les versions évoluent vite : vérifier la documentation officielle de la version installée (`package.json`) avant d'appliquer un modèle. Pour l'apparence et le « look IA », voir le skill `anti-generique`.

## 1. Composants serveur et client (Next.js App Router)
```tsx
// Composant serveur (par défaut) : lit les données côté serveur, zéro JS envoyé pour lui
async function ListeProduits() {
  const produits = await db.produit.findMany();
  return <GrilleProduits produits={produits} />;
}

// Composant client : seulement s'il faut de l'interactivité (état, événements, API navigateur)
'use client';
function PanneauFiltres({ onFiltre }: Props) {
  const [filtre, setFiltre] = useState('');
  // ...
}
```
Règle : pousser `'use client'` **le plus bas possible** dans l'arbre. Une page entière en client annule l'intérêt des composants serveur.

## 2. Où mettre l'état ?
| Type d'état | React | Vue 3 |
|---|---|---|
| Données serveur (listes, détails) | TanStack Query (React Query) / SWR | TanStack Query Vue, ou composables + cache |
| État local d'un composant | `useState` / `useReducer` | `ref` / `reactive` |
| État global d'interface (thème, tiroir ouvert) | Zustand | Pinia |
| Formulaires | React Hook Form + Zod | VeeValidate + Zod |
| État dans l'URL (filtres, onglets, pagination) | nuqs / `useSearchParams` | `vue-router` (query) |

Erreurs courantes : recopier des données serveur dans un store global (deux sources de vérité) ; `useEffect` pour calculer une valeur dérivée (la calculer pendant le rendu) ; filtres non reflétés dans l'URL (impossible de partager ou de revenir en arrière).

## 3. Performance (Core Web Vitals : LCP, CLS, INP)
- Images : `next/image` avec `sizes` corrects, ou `<img>` avec `width`/`height` + `loading="lazy"` ; formats WebP/AVIF.
- Polices : `next/font` (ou auto-hébergement) avec `font-display: swap`.
- Bibliothèques lourdes (graphiques, éditeurs, cartes) : import dynamique (`dynamic()` / `defineAsyncComponent`).
- Listes de plus de 100 éléments : virtualisation (TanStack Virtual).
- `memo()` / `useMemo` **seulement** quand le profilage montre un problème.
- Contexte local : mesurer sur un **Android d'entrée de gamme en 3G/4G** (DevTools : limitation du CPU ×4 et du réseau « Slow 4G »). Viser un JavaScript initial léger.

## 4. Structure de projet
- Regrouper par **fonctionnalité** (`features/pointage/`, `features/facturation/`) plutôt que par type (`components/`, `hooks/` géants).
- Composants d'interface génériques dans `components/ui` (shadcn) ; jamais de logique métier dedans.
- Appels API centralisés (client typé, généré depuis l'OpenAPI si possible), pas de `fetch` dispersés.
- Variables d'environnement côté client préfixées (`NEXT_PUBLIC_`, `VITE_`) : **elles sont publiques**, n'y mettre aucun secret.

## 5. Accessibilité et robustesse
- États chargement / vide / erreur pour chaque écran de données.
- Formulaires : libellés, erreurs à côté des champs, bouton désactivé seulement pendant l'envoi.
- Checklist complète : `../../anti-generique/references/principes-communaute.md` §3 à §5.

## 6. Hors du périmètre de cette fiche
Architecture back-end pure (voir `architecture.md`), applications natives (Flutter, React Native : bonnes pratiques propres), et design sans implémentation (voir `anti-generique`).
