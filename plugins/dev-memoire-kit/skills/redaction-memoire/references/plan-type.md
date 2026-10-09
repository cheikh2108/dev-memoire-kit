# Plan type et numérotation

## Règles de structuration

- Subdivisions conventionnelles : **parties → chapitres → sections → sous-sections → paragraphes**.
- Structure **homogène** : chaque partie a le même nombre de chapitres (2), chaque chapitre a idéalement 3 sections.
- **Longueurs équilibrées à chaque niveau** : les sections d'un même chapitre ont une longueur proche, de même que les sous-sections d'une même section et les deux chapitres d'une même partie. Pas une égalité stricte au nombre de pages, mais aucun écart flagrant (une section de 6 pages à côté d'une section d'un demi-paragraphe signale soit un manque de contenu, soit une section à scinder).
- Entre parties, l'écart peut être plus grand selon leur importance : la partie conception et mise en œuvre est souvent la plus longue. Repère courant : introduction ≈ 10 %, conclusion ≈ 10 %, développement ≈ 80 % du corps du texte.
- Pas de subdivision unique : un 1.1.1 appelle au moins un 1.1.2.
- **Classification décimale** où le numéro de chapitre continue d'une partie à l'autre (particularité de l'école, à respecter) :

| Traditionnel | Décimal |
|---|---|
| 1re partie | I |
| Chapitre 1 | 1.1 |
| Section 1, 2, 3 | 1.1.1 · 1.1.2 · 1.1.3 |
| Chapitre 2 | 1.2 |
| 2e partie | II |
| Chapitre 3 | **2.3** |
| Chapitre 4 | **2.4** |
| 3e partie | III |
| Chapitre 5 | **3.5** |
| Chapitre 6 | **3.6** |

Erreur fréquente : numéroter 2.1 / 2.2 dans la 2e partie. Ici on écrit 2.3 / 2.4, puis 3.5 / 3.6.

## Plan imposé pour un mémoire informatique (licence GLAR)

```
Introduction générale
I   Cadres théorique et méthodologique
    1.1 Cadre théorique
        1.1.1 Problématique
        1.1.2 Objectifs de recherche
              (objectif général / objectifs spécifiques)
        1.1.3 Hypothèses
        1.1.4 Pertinence du sujet
    1.2 Cadre méthodologique
        1.2.1 Méthodologie de travail
        1.2.2 Outils et langages utilisés
        1.2.3 Méthode de conception (UML, Merise…)
        1.2.4 Méthode de développement (Scrum, cycle en V…)
II  Cadre conceptuel
    2.3 Rappels sur le thème
        2.3.1 Historique du domaine / des pratiques
        2.3.2 Problèmes rencontrés avec les systèmes manuels
        2.3.3 Intérêt d'un système informatisé
    2.4 État de l'art sur le sujet
        2.4.1 Étude de systèmes similaires
        2.4.2 Comparaison des fonctionnalités existantes
        2.4.3 Limites des solutions actuelles
III Mise en œuvre
    3.5 Architecture
    3.6 Implémentation
Conclusion générale
```

Le titre des sections peut être adapté au sujet, mais les intitulés **Cadres théorique et méthodologique / Cadre conceptuel / Mise en œuvre** et la numérotation restent.

### Contenu attendu de la Mise en œuvre (proposition de sections)

C'est la partie où le jury voit le travail réel. Elle doit contenir des **preuves** : figures, tableaux, captures, extraits de code courts.

```
3.5 Architecture
    3.5.1 Architecture logique (couches, modules) — Figure
    3.5.2 Architecture technique / déploiement (serveurs, BD, services externes) — Figure
    3.5.3 Modélisation retenue (cas d'utilisation, classes, séquence) — si non placée en II
3.6 Implémentation
    3.6.1 Environnement et technologies (tableau : outil | version | rôle | justification)
    3.6.2 Fonctionnalités réalisées (captures commentées, une par fonctionnalité clé)
    3.6.3 Tests et validation (ce qui a été testé, comment, résultats mesurés, limites)
```

Pour choisir, construire et commenter les diagrammes (et passer à la base de données) : `uml.md`.

Si le DR accepte un chapitre 3.7 « Résultats », il reste dans la partie III. Toujours garder le plan homogène et validé par le DR.

## Variante générique (plan du modèle « 22 pages »)

Le modèle Word fourni utilise une variante non spécifique à l'informatique :

```
I   Cadres théorique et méthodologique (1.1 théorique, 1.2 méthodologique)
II  Cadres conceptuel et organisationnel (2.3 conceptuel, 2.4 organisationnel)
III Cadre analytique et quelques recommandations (3.5 analytique, 3.6 recommandations)
```

Utile pour un mémoire d'étude (analyse d'une organisation) plutôt que de réalisation. Pour un projet de développement, préférer le plan informatique ci-dessus.

## Vérifications du plan

- [ ] Le plan détaillé, le sommaire, la table des matières et les titres du corps sont **identiques mot pour mot**.
- [ ] La table des matières est générée automatiquement par Word (styles Titre 1/2/3), pas tapée à la main. Sinon on retrouve des liens cassés de type `file:/C:/Users/...` dans le document.
- [ ] Chaque titre de section annonce un contenu qui existe vraiment dans la section.
- [ ] L'annonce du plan dans l'introduction cite le **même nombre de parties** et les **mêmes titres**.
