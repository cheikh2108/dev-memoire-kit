# Git : commits, branches, pull requests

## Commits
- **Petits et atomiques** : un commit = un changement cohérent qu'on peut annuler seul.
- **Message au format Conventional Commits** (lisible, permet un changelog) :

```
<type>(<portée>): <résumé à l'impératif, ≤ 72 caractères>

<pourquoi ce changement, si ce n'est pas évident>
```

| Type | Usage |
|---|---|
| `feat` | nouvelle fonctionnalité |
| `fix` | correction de bug |
| `refactor` | restructuration sans changement de comportement |
| `test` | ajout ou correction de tests |
| `docs` | documentation |
| `chore` | outillage, dépendances, configuration |
| `perf` | performance |
| `style` | formatage pur |

Exemples :
- ✅ `feat(pointage): scanner le QR code d'un étudiant et enregistrer la présence`
- ✅ `fix(auth): bloquer le compte après 5 tentatives échouées`
- ❌ `update`, `modif`, `fix bug`, `wip`, `final final v2`

## Branches
- `main` : toujours déployable / démontrable.
- Une branche par fonctionnalité ou correction : `feat/pointage-qr`, `fix/export-pdf`.
- Fusion par pull request, après revue et tests verts.
- Rebaser ou fusionner `main` régulièrement dans sa branche pour éviter les gros conflits.

## Pull requests
Description type :
```
## Quoi
Ajout du pointage par QR code (écran enseignant + endpoint POST /presences).

## Pourquoi
Besoin B3 du cahier des charges : pointer une classe en moins de 5 minutes.

## Comment tester
1. `php artisan migrate --seed`
2. Se connecter avec prof@demo.sn / [mot de passe de démo]
3. Ouvrir « Cours du jour » > « Pointer », scanner un QR de /storage/demo-qr

## Points d'attention
Double scan du même étudiant ignoré (test ajouté).
```

## .gitignore minimal
```
.env
.env.*
!.env.example
node_modules/
vendor/
/build
/dist
*.log
.DS_Store
.idea/
.vscode/
storage/*.key
```
Vérifier qu'aucun secret n'a été commité : `git log -p | grep -iE "password|secret|api_key|token"`. Un secret poussé une fois doit être **révoqué et régénéré**. Le supprimer de l'historique ne suffit pas.

## Commandes utiles
| Besoin | Commande |
|---|---|
| Voir ce qui va partir | `git status` puis `git diff --staged` |
| Commiter une partie d'un fichier | `git add -p` |
| Corriger le dernier commit (non poussé) | `git commit --amend` |
| Annuler un commit déjà poussé | `git revert <sha>` (jamais `reset --hard` sur une branche partagée) |
| Retrouver quand un bug est apparu | `git bisect` |
| Mettre de côté un travail en cours | `git stash` / `git stash pop` |

## Dans le mémoire
Une figure ou un tableau sur le flux de travail Git (branches, nombre de commits, PR) appuie la section « Méthode de développement » mieux qu'une phrase comme « nous avons utilisé GitHub avec GitFlow ».
