# Code : signes de code généré sans réflexion

Le code « IA générique » fonctionne souvent, mais il est bavard, défensif sans raison et pas adapté au projet. Avant de le garder (et surtout avant de le montrer au jury), passer cette liste.

## 1. Commentaires
| Signe | Exemple | Correction |
|---|---|---|
| Commentaire qui paraphrase le code | `// Incrémente le compteur` au-dessus de `count++` | Supprimer |
| En-tête décoratif sur chaque fonction | `/** Cette fonction gère la récupération des données utilisateur. */` | Commenter seulement le **pourquoi** non évident (règle métier, contournement, contrainte) |
| Commentaires d'étapes | `// Étape 1 : …`, `// Étape 2 : …` | Extraire des fonctions bien nommées |
| Commentaires en langues mélangées | moitié anglais, moitié français | Une seule langue pour tout le projet |
| Code mort commenté | blocs entiers en commentaire | Supprimer (Git garde l'historique) |

## 2. Gestion d'erreurs
- **try/catch partout** qui attrapent tout et font `console.log(error)` : l'erreur est avalée, l'utilisateur ne sait rien, le bug devient invisible.
  → Attraper seulement là où on sait **quoi faire** (réessayer, message clair, valeur par défaut justifiée). Ailleurs, laisser remonter vers un gestionnaire global.
- **Valeurs de repli silencieuses** (`return []` si la requête échoue) qui cachent une panne.
- **Messages d'erreur génériques** (« Une erreur est survenue ») sans code ni action proposée.

## 3. Abstractions gratuites
- Classe `Manager` / `Helper` / `Utils` / `Service` qui encapsule un seul appel.
- Interface + factory + stratégie pour un seul cas d'usage.
- Fichiers de configuration pour des valeurs qui ne changeront jamais.
→ Règle : on abstrait à la **troisième** répétition, pas avant.

## 4. Noms
- `data`, `result`, `item`, `temp`, `info`, `handleData`, `processStuff` → noms métier : `presences`, `etudiantsAbsents`, `calculerTauxAbsence`.
- Incohérence de langue ou de convention dans un même projet (camelCase / snake_case mélangés).

## 5. Dépendances et versions
- Bibliothèques ajoutées pour une ligne de code (lodash pour un `map`, moment.js en 2025).
- API inventées ou obsolètes : toujours vérifier dans la **documentation officielle** de la version installée.
- Versions non figées ; `package-lock.json` / `composer.lock` absents du dépôt.

## 6. Tests
- Tests qui vérifient que le mock renvoie ce qu'on lui a dit de renvoyer.
- Tests sans assertion utile (`expect(result).toBeDefined()`).
→ Un test utile décrit un comportement métier : « un étudiant pointé deux fois le même cours n'a qu'une présence ».

## 7. Le test du jury
Pour chaque extrait de code montré dans le mémoire : l'auteur peut-il expliquer **chaque ligne**, pourquoi elle est là et ce qui se passerait sans elle ? Sinon, simplifier ou retirer l'extrait.

## Exemple

**Avant**
```js
// Fonction pour récupérer les utilisateurs
async function getUsers() {
  try {
    // Appel à l'API
    const response = await fetch('/api/users');
    // Conversion en JSON
    const data = await response.json();
    // Retourne les données
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
```

**Après**
```js
async function fetchEtudiants() {
  const res = await fetch('/api/etudiants');
  if (!res.ok) throw new Error(`Liste des étudiants indisponible (HTTP ${res.status})`);
  return res.json();
}
```
L'erreur remonte jusqu'à l'écran, qui affiche un message et un bouton « Réessayer », au lieu d'afficher une liste vide trompeuse.
