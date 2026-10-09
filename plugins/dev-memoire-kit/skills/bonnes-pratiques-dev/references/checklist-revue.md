# Checklist de revue de code / pull request

Classer chaque remarque : **Bloquant** (bug, sécurité, perte de données) · **Important** (maintenabilité, performance) · **Mineur** (nommage, détail). Proposer une correction, pas seulement un constat.

## Fonctionnel
- [ ] Le changement fait ce que la description annonce, et seulement cela.
- [ ] Les cas limites sont gérés : liste vide, valeur nulle, doublon, très grand volume, utilisateur sans droit, réseau coupé.
- [ ] Les règles métier sont au bon endroit (serveur / modèle / service), pas seulement dans l'interface.

## Sécurité (voir `securite.md`)
- [ ] Entrées validées côté serveur.
- [ ] Contrôle d'accès vérifié sur chaque route ajoutée.
- [ ] Pas de requête SQL construite par concaténation.
- [ ] Pas de secret, de mot de passe ou de jeton dans le diff.
- [ ] Pas de données personnelles dans les logs.

## Lisibilité
- [ ] Noms explicites et métier ; une seule convention de nommage.
- [ ] Fonctions courtes, une responsabilité chacune.
- [ ] Pas de code mort, pas de code commenté, pas de `console.log` / `dd()` / `print` de débogage oubliés.
- [ ] Les commentaires expliquent le **pourquoi**, pas le quoi.

## Robustesse
- [ ] Erreurs gérées volontairement (pas de `catch` vide ni de retour silencieux d'une valeur vide).
- [ ] Opérations multiples sur la base dans une **transaction** si elles doivent réussir ensemble.
- [ ] Pas de requête dans une boucle (problème N+1) : chargement anticipé (`with()`, `include`, `select_related`).
- [ ] Pagination sur les listes qui peuvent grandir.

## Tests et outillage
- [ ] Tests ajoutés ou mis à jour pour le comportement modifié ; ils passent.
- [ ] Formateur et linter passés.
- [ ] Migrations réversibles ; pas de modification d'une migration déjà appliquée ailleurs.
- [ ] Nouvelle dépendance justifiée (taille, maintenance, licence).

## Documentation
- [ ] README / `.env.example` mis à jour si une variable ou une étape d'installation change.
- [ ] Message de commit et description de PR clairs (voir `git.md`).
