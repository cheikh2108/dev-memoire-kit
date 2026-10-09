# Présenter le travail technique dans le mémoire

La partie Mise en œuvre est la **preuve** que le projet existe. Le jury cherche : des choix justifiés, des schémas lisibles, des écrans réels, des tests, et un étudiant qui maîtrise chaque élément montré.

## 1. Choix techniques : tableau + justification
Un tableau unique, repris tel quel partout dans le document (cohérence) :

| Couche | Technologie (version) | Rôle | Pourquoi ce choix |
|---|---|---|---|
| Back-end | Laravel 11 (PHP 8.3) | API REST, règles métier | Maîtrisé par l'équipe, ORM, auth intégrée |
| Base de données | MySQL 8 | Données relationnelles | Hébergement mutualisé disponible localement |
| Mobile | Flutter 3 | Application enseignant | Une base de code Android/iOS ; parc Android majoritaire |
| Hébergement | VPS (Ubuntu 24.04) | Production | Coût mensuel : [À COMPLÉTER] FCFA |

« Pourquoi » = critères réels (compétences, coût, contraintes du client, communauté), pas « sa robustesse et sa flexibilité ».

## 2. Schémas attendus
- **Architecture logique** : couches et modules, flux principaux.
- **Architecture technique / déploiement** : client(s), serveur, base de données, services externes (SMS, paiement), protocoles (HTTPS, REST).
- **UML** : cas d'utilisation (acteurs réels), classes (ou MCD/MLD si Merise), séquence pour 1 ou 2 scénarios clés.
- Outils : draw.io / diagrams.net, PlantUML, StarUML, Mermaid. Exporter en PNG/SVG haute résolution.
- Guide complet de modélisation (méthode, notation, erreurs, passage à la base) : `../../redaction-memoire/references/uml.md`.
- Chaque schéma : numéroté, légendé, **commenté dans le texte** (ce qu'il montre, ce qu'il faut en retenir).

## 3. Extraits de code
- Seulement s'ils montrent quelque chose d'intéressant : une règle métier, une mesure de sécurité, un algorithme. Pas de boilerplate (imports, configuration générée, CRUD trivial).
- **15 à 25 lignes maximum**, police à chasse fixe (Consolas/Courier 9-10 pt), numérotés comme des figures (« Extrait 3.1 »).
- Commentés dans le texte : ce que fait l'extrait, pourquoi il est écrit ainsi.
- Code long → annexe ou lien vers le dépôt Git (public ou accès donné au jury).

## 4. Captures d'écran
Voir le skill `anti-generique`, `references/design.md` §4. Une capture par fonctionnalité clé, données de démonstration réalistes, commentaire qui relie l'écran à un besoin fonctionnel.

## 5. Tests et validation
Tableau honnête :

| Test | Type | Méthode / outil | Résultat |
|---|---|---|---|
| Pointage d'un étudiant par QR | Fonctionnel | Manuel, 3 téléphones Android | OK |
| Double pointage ignoré | Unitaire | PHPUnit | OK |
| Accès au dossier d'un autre étudiant | Sécurité | Requête Postman avec un autre jeton | Refusé (403) |
| 40 pointages consécutifs | Performance | Chronométré en salle | 3 min 40 s |
| Paiement Wave | Intégration | — | Non réalisé (limite) |

Les tests non réalisés figurent dans le tableau et dans les **limites** de la conclusion.

## 6. Cohérence finale (à vérifier avant dépôt)
- [ ] Les mêmes technologies sont citées dans l'introduction, l'architecture, l'implémentation et la conclusion.
- [ ] Chaque fonctionnalité annoncée dans les besoins est soit montrée (capture), soit listée comme non réalisée.
- [ ] Le diagramme de classes correspond à la base de données réelle.
- [ ] Le dépôt Git est propre (README, pas de secrets) si le jury peut y accéder.
