# Plan type et numérotation

## Plan de référence : trois chapitres (pratique validée)

Les mémoires de licence récemment soutenus et validés dans la filière suivent tous le **même plan en trois chapitres**, sans « parties ». C'est le plan à proposer par défaut pour un mémoire de réalisation (application web ou mobile, plateforme). Les intitulés peuvent varier légèrement, l'ordre et le contenu restent.

```
Introduction générale                                   (≈ 2 pages)
Chapitre 1 : Présentation générale                      (≈ 5 à 9 pages)
    1.1. Présentation de la structure d'accueil         (si le projet est mené pour une structure)
    1.2. Contexte
    1.3. Problématique
    1.4. Objectifs
         1.4.1. Objectif général
         1.4.2. Objectifs spécifiques        (les ÉTAPES du travail, pas les fonctionnalités)
    1.5. Méthodologie
         1.5.1. Approche quantitative (questionnaire)
         1.5.2. Approche qualitative (entretien, observation)
    1.6. Étude de l'existant
         1.6.1. [Processus actuel de la structure]
         1.6.2. [Solution similaire n° 1] …
Chapitre 2 : Analyse et conception                      (≈ 20 à 25 pages, le plus long)
    2.1. Analyse critique de l'existant
         2.1.1. [Analyse de l'existant 1]
         2.1.2. [Analyse de l'existant 2]
         2.1.3. Insuffisances observées
    2.2. Étude pour la mise en place de la solution
         2.2.1. Résultats de la collecte de données
         2.2.2. Analyse des besoins et identification des fonctionnalités
    2.3. Identification des acteurs
    2.4. Exigences fonctionnelles et non fonctionnelles
         2.4.1. Exigences fonctionnelles
         2.4.2. Exigences non fonctionnelles
    2.5. Modélisation
         2.5.1. Diagrammes de cas d'utilisation
         2.5.2. Diagrammes de séquence (avec la description textuelle de chaque cas)
         2.5.3. Diagramme de classes
Chapitre 3 : Réalisation de la solution                 (≈ 18 à 23 pages)
    3.1. Outils et technologies utilisés
         3.1.1. Outils de développement
         3.1.2. Langages de programmation
         3.1.3. Frameworks et bibliothèques
    3.2. Architecture technique
         3.2.1. Description des couches
         3.2.2. Services tiers et flux de données
    3.3. Présentation de la solution
         3.3.1. Répartition des flux
         3.3.2. Flux 1 : Inscription et authentification
         3.3.3. Flux 2 : [Profil acteur 1]
         3.3.4. Flux 3 : [Profil acteur 2] …
    3.4. Tests et validation
    3.5. Déploiement et estimation des coûts            (facultatif, apprécié)
Conclusion générale                                     (1 à 1,5 page)
```

**Objectifs spécifiques (1.4.2)** : quatre ou cinq étapes de la démarche, dans l'ordre (analyser l'existant, recueillir les besoins, modéliser, développer, tester et valider), formulées « **Intitulé** : il s'agit de + infinitif ». Les fonctionnalités de l'application n'y figurent pas : elles vont dans les exigences fonctionnelles (2.4.1).

Corps du texte complet : **50 à 60 pages** environ. Le format exact de chaque élément (tableaux d'exigences, fiche de cas d'utilisation, présentation des outils, des écrans et des tests) est dans `modeles-de-chapitres.md`.

Autre variante observée : chapitres numérotés en chiffres romains (« II Analyse et conception ») et figures « Figure II.6 ». Acceptable si c'est **la même forme partout** ; ⚠️ observé : « II » dans le corps mais « CHAPITRE 2 » dans le sommaire. Le chapitre 3 peut être plus long que le chapitre 2 quand l'application a beaucoup d'écrans (web + mobile) ; renvoyer alors les écrans secondaires en annexe.

Variante acceptée (observée) : la méthodologie et l'existant peuvent être regroupés autrement (« Chapitre 1 : Présentation du sujet » sans structure d'accueil, existant traité seulement au chapitre 2). Ce qui ne varie pas : l'analyse et la modélisation au chapitre 2, la réalisation au chapitre 3.

**Toujours faire valider le plan par le directeur de mémoire.** S'il impose le plan en parties du guide (voir plus bas), c'est lui qui prime.

## Règles de structuration

- **Numérotation décimale par chapitre** : `Chapitre 2` → `2.1.`, `2.2.` → `2.2.1.`, `2.2.2.`. Choisir **une** forme (avec ou sans point final : `2.1.` ou `2.1`) et la garder partout, titres, sommaire et table des matières compris.
- Niveau 4 éventuel : intertitre en gras **non numéroté** (« Diagramme de cas d'utilisation « Agent » », « Module : Paiement »).
- Pas de subdivision unique : un 1.4.1 appelle au moins un 1.4.2.
- **Longueurs équilibrées au sein d'un chapitre** : les sections d'un même chapitre ont une longueur proche, de même que les sous-sections d'une même section. Pas une égalité stricte, mais aucun écart flagrant (une section de 6 pages à côté d'une section d'un demi-paragraphe signale un manque de contenu ou une section à scinder).
- **Entre chapitres**, l'écart est normal : le chapitre 1 (cadrage) est le plus court, le chapitre 2 (analyse et modélisation) le plus long. La conclusion générale reste **concise (1 à 1,5 page)**.
- Chaque chapitre commence sur une nouvelle page, par un paragraphe d'introduction qui annonce ses sections, et se termine par un bilan et une transition vers le chapitre suivant (`modeles-de-chapitres.md`).

## Variante : plan en parties du guide officiel

Le guide de rédaction de l'école présente aussi un plan en trois **parties**, avec une numérotation de chapitres qui continue d'une partie à l'autre. Il n'est pas utilisé dans les mémoires de réalisation récents ; ne le proposer que si le directeur de mémoire le demande.

```
Introduction générale
I   Cadres théorique et méthodologique
    1.1 Cadre théorique (problématique, objectifs, hypothèses, pertinence)
    1.2 Cadre méthodologique (méthodologie, outils, méthode de conception, méthode de développement)
II  Cadre conceptuel
    2.3 Rappels sur le thème
    2.4 État de l'art sur le sujet
III Mise en œuvre
    3.5 Architecture
    3.6 Implémentation
Conclusion générale
```

Dans cette variante, la 2e partie numérote ses chapitres **2.3 / 2.4** (pas 2.1 / 2.2), puis **3.5 / 3.6**. Une version « mémoire d'étude » (Cadres conceptuel et organisationnel, Cadre analytique et recommandations) existe aussi, pour l'analyse d'une organisation plutôt qu'une réalisation.

## Vérifications du plan

- [ ] Le sommaire, la table des matières et les titres du corps sont **identiques mot pour mot** (générés par Word à partir des styles Titre 1/2/3, jamais tapés à la main).
- [ ] L'annonce du plan dans l'introduction cite le **même nombre de chapitres** et les **mêmes titres**.
- [ ] Chaque introduction de chapitre annonce le **nombre réel** de sections (« s'articule autour de cinq sections » quand il y en a cinq) et dans le bon ordre.
- [ ] Chaque titre annonce un contenu qui existe vraiment dans la section.
- [ ] Les intitulés sont sans faute (« Étude **de** l'existant », « Liste des tableaux », « Table des matières » au singulier) et accentués, majuscules comprises (« Étude », « Écran »).
