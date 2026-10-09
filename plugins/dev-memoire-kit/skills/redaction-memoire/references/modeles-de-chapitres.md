# Gabarits des chapitres (d'après des mémoires validés)

Ces gabarits reprennent les formats des mémoires de réalisation récemment validés dans la filière, et corrigent les défauts relevés chez eux (signalés « ⚠️ »). Les formules entre guillemets sont des points de départ : les adapter au sujet, ne pas les recopier telles quelles d'une section à l'autre.

## Conventions communes

- **Voix** : « nous » dans tout le corps du texte ; « je » seulement dans À la mémoire, Dédicace et Remerciements. Pas de « on ».
- **Temps** : présent pour décrire, passé composé pour la démarche réalisée (« nous avons mené une enquête »), futur seulement pour les annonces et les perspectives.
- **Légendes** : figure → légende **en dessous** ; tableau → légende **au-dessus** ; numérotation par chapitre, forme unique dans tout le document : `Figure 2.4 : Diagramme de cas d'utilisation « Agent »`, `Tableau 2.3 : Exigences fonctionnelles`. Source sous toute figure empruntée (`Source : site officiel de …, consulté le …`).
- **Ouverture d'un chapitre** : un paragraphe qui situe le chapitre et annonce ses sections **dans l'ordre et en nombre exact** : « Ce chapitre est consacré à… Il s'articule autour de cinq sections : nous présentons d'abord…, puis…, avant de… ».
- **Clôture d'un chapitre** : un paragraphe de bilan (ce que le chapitre a établi, concrètement) puis un paragraphe-pont vers le chapitre suivant : « … Nous pouvons à présent aborder la réalisation de la solution, objet du chapitre suivant. »
- **Sections** : une phrase d'annonce au début si la section a des sous-sections ; une phrase de bilan et une de transition à la fin, **une seule clôture par niveau**.
- ⚠️ Tic observé : « En définitive, cette section nous a permis de… » à la fin de chaque section, « En somme… » à la fin de chaque chapitre. Varier, et supprimer la clôture quand la section est courte.
- **Puces** : « Terme en gras : explication » est utile pour des listes de critères ou d'acteurs, pas pour raconter. Un raisonnement s'écrit en paragraphes.
- **Captures d'écran** : données de démonstration **fictives** (noms, e-mails, téléphones inventés), jamais de mot de passe visible, jamais de données personnelles réelles.

---

## Introduction générale (≈ 2 pages)

Huit paragraphes sans intertitres, chacun avec une fonction (détails et exemples : `introduction-conclusion.md`) :
1. contexte large, daté et situé (un fait sourcé plutôt que « À l'heure où le numérique… ») ;
2. constat des difficultés du cas étudié ;
3. problématique, posée sous forme de **question** (« Dès lors, comment concevoir… ? ») ;
4. motivation du choix du sujet ;
5. objectif général (et, en une phrase, les objectifs spécifiques) ;
6. hypothèse(s) de travail (« Nous supposons que… ») ;
7. démarche suivie (enquête, entretien, développement) ;
8. annonce du plan : « Ce mémoire est structuré en trois chapitres. Le premier… Le deuxième… Enfin, le troisième… », avec les **titres exacts** des chapitres.

---

## Chapitre 1 : Présentation générale

### 1.1 Présentation de la structure d'accueil (si elle existe)
Un paragraphe par idée : statut et texte de création, rattachement, missions principales, puis le service directement concerné par le projet (« Dans le cadre de ce projet, nous nous intéressons plus particulièrement au service… »). Une figure possible : organigramme ou page officielle, **avec sa source**. Transition vers le contexte.

### 1.2 Contexte (≈ 1 page)
Du général au particulier : tendance générale → situation au Sénégal → situation du cas étudié. Chiffres **sourcés** uniquement. ⚠️ Observé : contexte sans aucune source ni aucun chiffre ; à éviter.

### 1.3 Problématique
Deux paragraphes de constat (les difficultés précises du cas, si possible chiffrées par l'enquête ou l'entretien), puis **la question seule sur sa ligne** :

> Comment concevoir une plateforme permettant de [problème 1], [problème 2], tout en garantissant [contrainte] ?

⚠️ Ne pas recopier mot pour mot la question de l'introduction : même sens, formulation développée.

### 1.4 Objectifs
- **1.4.1 Objectif général** : une phrase, « L'objectif général de ce mémoire est de concevoir et de réaliser [solution], qui permet à [acteur 1] de…, à [acteur 2] de… ».
- **1.4.2 Objectifs spécifiques** : 4 ou 5 puces, chacune « **Intitulé** : il s'agit de + verbe à l'infinitif ». Ce sont les étapes du travail :
  - analyser l'existant ;
  - recueillir et analyser les besoins ;
  - modéliser le système ;
  - développer le prototype ;
  - tester et valider la solution.

### 1.5 Méthodologie
- **1.5.1 Approche quantitative** : outil (questionnaire en ligne, par exemple Google Forms), **nombre de réponses exploitables**, période de collecte, mode de diffusion, profil des répondants, axes du questionnaire, renvoi « (voir Annexe A) ».
- **1.5.2 Approche qualitative** : entretien(s) (interlocuteur désigné par sa **fonction**, date, renvoi au guide en annexe), observation directe, analyse comparative de solutions existantes.
- ⚠️ Pas de définition de manuel de « l'approche quantitative » sur un paragraphe : une phrase suffit, le reste décrit ce qui a été **réellement** fait. Signaler les biais (par exemple 80 % de répondants étudiants).

### 1.6 Étude de l'existant
- Processus actuel de la structure, décrit étape par étape, puis résumé en tableau :

  | Processus | Méthode actuelle | Difficultés identifiées |
  |---|---|---|
  | Dépôt du dossier | Dépôt physique au guichet | Déplacements, files d'attente |

- Solutions similaires (2 ou 3, réelles et nommées) : présentation, fonctionnalités principales, limites ; une capture par solution avec sa source.

---

## Chapitre 2 : Analyse et conception

### 2.1 Analyse critique de l'existant
Pour chaque solution étudiée, un tableau :

| Aspect | Avantages | Inconvénients |
|---|---|---|

ou un tableau comparatif unique, plus parlant :

| Critère | Solution A | Solution B | Solution proposée |
|---|---|---|---|

Puis **2.x.3 Insuffisances observées** : chaque insuffisance en un court paragraphe, reliée à ce que la solution apportera.

### 2.2 Étude pour la mise en place de la solution
- **Résultats de la collecte** : profil des répondants, puis un paragraphe par thème, introduit par un intitulé en gras (« Difficultés rencontrées : »), avec les pourcentages **et l'effectif** (« 45 répondants sur 54, soit 83,3 % »), et une phrase d'interprétation.
- Graphiques **refaits** (Excel, tableur) avec légende `Figure 2.2 : Répartition des répondants par…` ; ⚠️ pas de capture brute de Google Forms avec ses boutons visibles.
- Tableau de synthèse des fonctionnalités demandées :

  | Fonctionnalité | Répondants (%) |
  |---|---|

### 2.3 Identification des acteurs
Une puce par acteur : « **Agent administratif** : traite et valide les dossiers, établit les pénalités ». Inclure les systèmes externes (passerelle de paiement, service de messagerie) s'ils interagissent.

### 2.4 Exigences fonctionnelles et non fonctionnelles
**2.4.1 Exigences fonctionnelles** : un seul tableau, avec une ligne de regroupement par module, ou un tableau par module.

| ID | Exigence | Priorité |
|---|---|---|
| **Module : Gestion des utilisateurs** | | |
| EF01 | Le système doit permettre à l'utilisateur de créer un compte. | Obligatoire |
| EF02 | Le système doit permettre à l'utilisateur de réinitialiser son mot de passe. | Importante |
| **Module : Gestion des demandes** | | |
| EF03 | Le système doit permettre au demandeur de soumettre une demande en ligne. | Obligatoire |

- Codes **EF01, EF02…** continus et **dans l'ordre** du tableau ; une seule forme (EF01 ou EF-01).
- Formulation : « Le système doit permettre à [acteur] de [verbe à l'infinitif]… ».
- Priorités : Obligatoire / Importante / Optionnelle.
- ⚠️ Observé : un code EF cité au chapitre 3 qui n'existe pas dans le tableau, des codes dans le désordre, des fonctionnalités présentées au chapitre 3 sans exigence. **Chaque fonctionnalité montrée au chapitre 3 a son EF, et chaque EF cité existe.**

**2.4.2 Exigences non fonctionnelles** : tableau avec un critère **mesurable**, que la section Tests vérifiera.

| ID | Catégorie | Exigence | Critère de mesure |
|---|---|---|---|
| ENF01 | Performance | Les pages principales se chargent rapidement. | < 2 s sur une connexion 3G |
| ENF02 | Sécurité | Les mots de passe sont stockés de façon sûre. | Hachage bcrypt ou Argon2 |

Une référence à la norme ISO/IEC 25010 (qualité logicielle) pour le choix des catégories est un plus.

### 2.5 Modélisation
- Paragraphe d'introduction : langage retenu (UML) et pourquoi, outil **réellement** utilisé (celui qui a produit les images), diagrammes présentés et la question à laquelle chacun répond (cas d'utilisation : quoi ? séquence : comment et dans quel ordre ? classes : avec quelles données ?). ⚠️ Pas de figure « Logo UML ».
- **2.5.1 Cas d'utilisation** : un diagramme général, puis un par acteur, chacun précédé d'un paragraphe qui explique les cas et les relations « include » et « extend » (règles : `uml.md`).
- **2.5.2 Séquence** : pour chaque cas important (4 à 6), dans cet ordre :
  1. intertitre « Cas d'utilisation « Soumettre une demande » » ;
  2. la fiche de description textuelle (tableau ci-dessous) ;
  3. le diagramme de séquence et sa légende ;
  4. un paragraphe de 3 à 5 lignes qui lit le diagramme (messages principaux, alternatives).

| Rubrique | Contenu |
|---|---|
| **Nom** | Soumettre une demande |
| **Acteur(s)** | Demandeur |
| **Objectif** | Permettre au demandeur de déposer une demande en ligne. |
| **Préconditions** | Le demandeur est authentifié. |
| **Scénario nominal** | 1. Le demandeur ouvre le formulaire. 2. Le système affiche les champs requis. 3. Le demandeur saisit les informations et joint les pièces. 4. Le système vérifie les pièces. 5. Le système enregistre la demande et affiche un numéro de suivi. |
| **Scénarios alternatifs** | 4a. Pièce manquante ou format invalide : 1. Le système affiche un message d'erreur. 2. Retour à l'étape 3. |
| **Scénarios d'erreur** | 5a. Base de données indisponible : le système affiche « Service momentanément indisponible ». |
| **Postconditions** | La demande est enregistrée avec le statut « En attente ». |

  - Scénario nominal : étapes numérotées, en alternance « L'acteur… » / « Le système… ».
  - Scénarios alternatifs : numérotés **d'après l'étape où ils naissent** (4a, 4b à l'étape 4), terminés par « Retour à l'étape N » ou « Fin du cas d'utilisation ».
  - ⚠️ Observé : « 6a » pour une erreur qui survient à l'étape 5, un « 7b » sans « 7a ». Vérifier chaque indice.
- **2.5.3 Diagramme de classes** : un paragraphe qui présente les classes principales et leurs relations, puis le diagramme **lisible à l'impression** (pleine largeur, police ≥ 8 pt). S'il est trop grand, le découper par paquetage. ⚠️ Pas de diagramme pivoté à 90° et illisible. Les noms de classes du texte sont ceux du diagramme.

---

## Chapitre 3 : Réalisation de la solution

### 3.1 Outils et technologies utilisés
Paragraphe d'ouverture sur les **critères de choix** (adéquation aux exigences, compétences de l'équipe, coût, hébergement) et, pour les choix structurants, l'alternative écartée et pourquoi (« Flutter plutôt que React Native, car… »).

Pour chaque choix structurant (back-end, web, mobile, base de données), une **étude comparative** avec les **mêmes colonnes** pour chaque couche :

| Framework (version) | Langage | Points forts | Points faibles | Adéquation au projet |
|---|---|---|---|---|
| Express 4 | JavaScript | … | … | … |
| Laravel 11 | PHP | … | … | … |
| Django 5 | Python | … | … | … |

suivie d'un paragraphe **« Choix et justification »** (3 à 5 lignes) qui relie le choix à une exigence (« temps réel exigé par EF09 », « un seul code mobile pour Android et iOS »). Trois ou quatre candidats, dont le retenu. ⚠️ Observé : des colonnes différentes d'un tableau à l'autre ; des tableaux en couleurs sombres illisibles en noir et blanc (garder un en-tête gris clair).

Puis un tableau récapitulatif par catégorie :

| Catégorie | Outil (version) | Usage dans le projet | Justification |
|---|---|---|---|
| Framework mobile | Flutter 3.24 | Application du demandeur | Un seul code pour Android et iOS |
| Back-end | Laravel 11 | API REST, authentification | Maîtrisé par l'équipe, écosystème complet |
| Base de données | PostgreSQL 16 | Stockage des demandes | Transactions, contraintes d'intégrité |
| Modélisation | Visual Paradigm CE | Diagrammes UML | — |

Chaque outil important peut ensuite avoir un paragraphe de 3 à 5 lignes : ce qu'il est (une phrase), **ce qu'il fait dans le projet** (l'essentiel).
- ⚠️ Pratique observée : un logo par outil, numéroté comme figure (10 à 13 « Figure 3.x : Logo … »), qui gonfle la liste des figures. Préférer le tableau ; si le directeur tient aux logos, les regrouper dans **une seule** figure.

### 3.2 Architecture technique
- Type d'architecture (3-tiers, client-serveur avec API REST, MVC, BaaS…) et pourquoi.
- Une figure d'architecture (couches, composants, services externes, protocoles), puis **3.2.1 Description des couches** : une puce par couche « **Couche présentation (Flutter, React)** : … ».
- **3.2.2 Services tiers et flux de données** : passerelle de paiement, e-mail, SMS, stockage ; puis le parcours d'une requête en étapes numérotées (1. l'utilisateur… 2. l'API… 3. la base…).
- ⚠️ Le texte et le schéma décrivent les **mêmes** couches.

### 3.3 Présentation de la solution
- **3.3.1 Répartition des flux** : liste des flux présentés : pages publiques, Flux 1 : inscription et authentification, Flux 2 : profil [acteur 1], Flux 3 : profil [acteur 2]…
- Puis une sous-section par flux : un paragraphe d'introduction, puis pour chaque écran clé :
  1. intertitre non numéroté (« Tableau de bord du demandeur ») ;
  2. la capture (une ou deux captures mobiles côte à côte) avec sa légende `Figure 3.6 : Écran « Mes demandes »` ;
  3. un **paragraphe de commentaire** (3 à 5 lignes) : ce que montre l'écran, l'exigence qu'il réalise **(EF05)**, une règle métier visible (« le bouton Payer n'apparaît qu'après validation du dossier »).
- ⚠️ Observé : légendes sans commentaire ; commentaires agrammaticaux (« La figure ci-dessus illustre l'écran d'accueil affiche… »). Une phrase simple : « La figure 3.6 présente la liste des demandes du demandeur, avec leur statut. »
- Application **web et mobile** : présenter l'écran web et l'écran mobile côte à côte dans une même figure, ou en deux figures successives (Figure 3.10, Figure 3.11) ; ⚠️ éviter les sous-numéros du type « Figure III.18.3 ». Regrouper dans un bloc **« Interfaces communes »** les écrans partagés par plusieurs profils (messagerie, notifications, documents, paramètres) au lieu de les montrer pour chaque profil.
- Une **règle métier** visible à l'écran se rattache à une exigence (« sans vérification d'identité validée, le propriétaire ne peut pas publier de bien : EF07 »).
- Écrans secondaires en Annexe C, appelés dans le texte (« voir Annexe C.2 »).

### 3.4 Tests et validation
Section **obligatoire** : sans elle, « testé avec succès » ou « les résultats démontrent… » ne sont pas défendables (⚠️ absente dans un mémoire validé, qui l'affirmait pourtant).

Tests automatisés, s'il y en a :

| Module testé | Type de test | Nombre de tests | Réussis | Taux de réussite |
|---|---|---|---|---|
| ReservationService | Unitaire | 24 | 24 | 100 % |
| Routes /api/reservations | Intégration | 12 | 11 | 91,7 % |
| **Total** | | **36** | **35** | **97,2 %** |

Puis un paragraphe d'analyse honnête : ce qui échoue et pourquoi, ce qui n'a pas été testé. ⚠️ Ne pas confondre **taux de réussite** et **couverture de code** ; ne pas annoncer « TDD » sans le montrer ; un module à 33 % de réussite s'explique, il ne se cache pas derrière une moyenne.

Recette fonctionnelle (toujours possible, même sans tests automatisés) :

| Cas de test | Exigence | Étapes | Résultat attendu | Résultat obtenu | Statut |
|---|---|---|---|---|---|
| CT01 | EF03 | Soumettre une demande complète | Numéro de suivi affiché | Conforme | ✔ |

Vérification des exigences non fonctionnelles : ENF, méthode de mesure, valeur mesurée.

### 3.5 Déploiement et estimation des coûts (facultatif, apprécié)
Section à part entière, **après** les tests (⚠️ observé : rangée par erreur dans « Présentation de l'application »).
- **3.5.1 Déploiement** : diagramme de déploiement (`uml.md`) puis une puce par composant : base de données, API, front web, application mobile (publication Play Store / App Store), avec l'hébergeur et ce qu'il apporte (sauvegardes, HTTPS, déploiement continu). Dire clairement ce qui **est** déployé et ce qui est **prévu** (au conditionnel).
- **3.5.2 Estimation des coûts** :

| Composante | Service | Offre retenue | Périodicité | Coût (FCFA) | Équivalent mensuel (FCFA) |
|---|---|---|---|---|---|
| Base de données | [hébergeur] | [offre] | Mensuelle | … | … |
| Nom de domaine | [registraire] | .sn / .com | Annuelle | … | … |
| Compte Play Store | Google | — | Unique | … | — |
| Passerelle de paiement | [opérateur] | Commission | Par transaction | … % | — |

  puis un récapitulatif **Scénario | Coûts uniques | Coût mensuel | Coût annuel** (démarrage, croissance…). Dater les tarifs et le taux de change (« tarifs relevés le … ; 1 USD = … FCFA »). ⚠️ Observé : un coût annuel compté comme mensuel, des frais uniques oubliés dans le total, une offre gratuite qui n'existe plus chez l'hébergeur : vérifier chaque tarif sur le site du fournisseur.

---

## Conclusion générale (1 à 1,5 page)

Cinq paragraphes (détails : `introduction-conclusion.md`) :
1. rappel du problème, de la question et de l'objectif ;
2. démarche suivie (« Nous avons d'abord…, ensuite…, avant de… ») ;
3. résultats concrets et **réponse à la problématique** ; hypothèses confirmées ou non, avec la preuve (renvoi aux tests) ;
4. difficultés et limites, honnêtes et précises (échantillon, fonctionnalités non finalisées, prototype) ;
5. perspectives réalistes, éventuellement à court, moyen et long terme.

## Annexes
- **Annexe A : Questionnaire** vierge, puis les résultats (graphiques refaits).
- **Annexe B : Guide d'entretien**, un bloc par entretien :
  1. tableau d'identification : Interlocuteur (**fonction**, pas le nom) | Type de structure | Date | Lieu | Durée | Mode (présentiel, téléphone) ;
  2. contexte de l'entretien (un paragraphe) ;
  3. questions regroupées par **thème** (Thème 1 : organisation actuelle, Thème 2 : paiements…), chaque question en italique « *Q1 : … ?* » suivie de « Réponse : … » (synthèse fidèle) ;
  4. synthèse et enseignements : 4 ou 5 constats, puis une phrase qui les relie aux exigences fonctionnelles ;
  5. l'entretien est **exploité dans le corps** (problématique, besoins), pas seulement rangé en annexe.
- **Annexe C : Interfaces supplémentaires** (C.1, C.2 par profil). Figures d'annexe numérotées A.1, B.1, C.1… ⚠️ jamais « Figure 0.x » (numérotation par chapitre restée active hors chapitre).
