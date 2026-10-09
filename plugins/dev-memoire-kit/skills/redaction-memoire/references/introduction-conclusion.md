# Introduction générale, cadre théorique, enchaînements, conclusion générale

## 1. Introduction générale : les 7 paragraphes obligatoires

Rôle : poser le problème **sans le résoudre** (« loi du suspens »). On n'affirme pas de résultat dans l'introduction. Formules d'ouverture proposées par le guide : « il paraît que… », « il semble que… », « il est paradoxal que… », tournures interrogatives.

| # | Paragraphe | Ce qu'il doit contenir | Piège à éviter |
|---|---|---|---|
| 1 | **Contextualisation** | Du général au particulier : la situation, les faits ou circonstances qui ont fait naître la réflexion. Finir sur le cas précis (structure, ville, utilisateurs). | Ouvrir par « De nos jours, le monde connaît une avancée technologique considérable ». Commencer par un fait daté et situé. |
| 2 | **Problématique** | Le problème posé, sa nature, puis **la question principale** (forme interrogative), éventuellement 2 ou 3 questions secondaires. | Poser une question sans lien avec le titre, ou trop large pour être traitée en L3. |
| 3 | **Objectifs de recherche** | Objectif général (1 phrase) + objectifs spécifiques (3 à 5, chacun avec un verbe à l'infinitif : étudier, identifier, concevoir, développer, tester). | Lister des fonctionnalités à la place des objectifs. |
| 4 | **Motivation du choix du sujet** | Les raisons réelles : constat vécu, stage, demande d'une structure, intérêt technique. « Si nous avons choisi ce sujet, c'est parce que… » | Motivation passe-partout (« la santé est un enjeu majeur de notre époque »). |
| 5 | **Hypothèses de travail** | Les solutions probables, formulées avec « hypothèse », « si… », le conditionnel ou « supposons que… ». Annoncées ici, **vérifiées** dans le développement. | Hypothèse invérifiable ou qui n'est qu'un souhait. |
| 6 | **Approche méthodologique** | Les techniques d'investigation réellement utilisées : recherche documentaire, questionnaire, guide d'entretien, observation, stage. Avec les chiffres réels (nombre d'entretiens, de réponses). | Citer des méthodes (SWOT, NVivo, 50 questionnaires) qui n'ont pas été pratiquées. |
| 7 | **Annonce du plan** | Le nombre de chapitres, puis le titre exact de chacun (« Ce mémoire est structuré en trois chapitres. Le premier… Le deuxième… Enfin, le troisième… »). | Annonce qui ne correspond pas au plan réel. |

Longueur indicative : environ 2 pages. Un paragraphe par étape, pas de sous-titres dans l'introduction.

Dans les mémoires validés, l'introduction compte souvent **8 paragraphes** : un paragraphe de **constat des difficultés** s'intercale entre la contextualisation et la problématique, et la motivation peut précéder l'objectif. Les deux ordres sont acceptés ; l'essentiel est que les 7 fonctions soient présentes.

## 2. Problématique, objectifs, hypothèses (chapitre 1) : formuler correctement

### Problématique
- Part d'un **constat observable** (ex. : « le pointage se fait sur feuille papier signée en début de cours ; les feuilles sont saisies à la main en fin de mois »).
- Mène à une **question unique et centrale** : « Comment concevoir et mettre en œuvre une application de pointage permettant d'automatiser le suivi des présences des étudiants de l'établissement ? »
- La question doit être celle à laquelle la **conclusion générale répondra**.

### Objectifs
- **Objectif général** : reformulation opérationnelle du sujet. « Réaliser une application de pointage et de gestion des étudiants de l'établissement. »
- **Objectifs spécifiques** : les étapes qui mènent à l'objectif général, chacune vérifiable :
  - étudier le fonctionnement actuel du pointage dans l'établissement ;
  - identifier les besoins fonctionnels et techniques ;
  - concevoir le modèle conceptuel et logique (UML ou Merise) ;
  - développer l'application (identification par matricule / QR code, gestion des présences et absences, consultation des informations) ;
  - tester et valider le système en conditions réelles.

### Hypothèses
Une bonne hypothèse est **testable** : on peut dire à la fin si elle est confirmée ou infirmée.

| Faible | Mieux |
|---|---|
| « Si le système de l'établissement peut permettre d'identifier les étudiants » | « Si chaque étudiant dispose d'un QR code lié à son matricule, le pointage d'une classe de 40 étudiants peut se faire en moins de 5 minutes. » |
| « Si le personnel peut mettre en vigueur ce genre de système » | « Supposons que l'interface soit utilisable sans formation : les enseignants l'adopteraient dès la première semaine. » |

### Pertinence du sujet (facultatif)
Demandée seulement dans le plan en parties du guide. Intérêt **pratique** (pour la structure), **technique** (ce que le projet mobilise), **académique** (ce que l'étudiant apprend). Éviter la triple formule creuse « à la fois techniquement utile, institutionnellement nécessaire et académiquement formateur » : donner une raison concrète pour chacun.

## 3. Le schéma d'enchaînement (développement)

Modèle pour chaque niveau (plan en trois chapitres) :

```
Chapitre 2 : titre
  (introduction du chapitre : situe le chapitre, annonce ses sections dans l'ordre et en nombre exact)
  2.1. Section
    (une phrase d'annonce si la section a des sous-sections)
    2.1.1. Sous-section
      (paragraphes : idée générale → arguments → exemples tirés du cas réel → connecteurs logiques)
    2.1.2. Sous-section …
    (une phrase de bilan + une phrase de transition vers 2.2)
  2.2. Section …
  (bilan du chapitre + transition : annonce du chapitre 3)
```

Avec le plan en parties du guide, la même logique s'applique un niveau au-dessus : introduction de partie, conclusion partielle en fin de partie.

### Doser les clôtures
Le défaut le plus visible dans les travaux analysés est l'**empilement** :
> « En résumé, cette section a permis de… En conclusion, ce chapitre a permis de… En somme… »

Autre tic relevé dans des mémoires validés : « En définitive, cette section nous a permis de… » à la fin de **chaque** section.

Règles :
- **Une phrase** de conclusion de section, **une phrase** de transition. Pas un paragraphe.
- Quand la fin de section coïncide avec la fin du chapitre, fusionner : une seule conclusion qui couvre les deux.
- La conclusion de section dit **ce qu'on a établi** (un fait, un résultat), pas « cette section a permis de présenter… ».
- Varier les connecteurs, mais surtout réduire leur nombre. Une transition peut être une simple phrase qui pose la question suivante.

Exemple :
- ❌ « En résumé, cette section a permis d'identifier les besoins des utilisateurs, ce qui orientera la conception. Après avoir analysé les besoins des utilisateurs, il est maintenant nécessaire de définir les fonctionnalités requises, ce qui sera l'objet de la sous-section suivante. »
- ✅ « Les entretiens font ressortir trois attentes : pointer en moins de cinq minutes, consulter les absences par étudiant et exporter un relevé mensuel. Reste à les traduire en fonctionnalités. »

## 4. Conclusion générale : 4 points

Ouverture possible : « Au terme de notre analyse… », « En définitive… ». Qualité première : **la concision** (1 à 1,5 page).

1. **Récapitulation** : contexte, problématique, objectif, puis la démarche (« Nous avons d'abord…, ensuite…, avant de… ») en reprenant le bilan de chaque chapitre.
2. **Réponse claire à la question** posée dans l'introduction : démarche suivie, résultats obtenus (ce qui marche réellement), hypothèses confirmées ou infirmées, impact sur l'organisation le cas échéant.
3. **Difficultés rencontrées et limites** : honnêtes et précises (ce qui n'a pas été fait, testé ou déployé). « L'application n'a pas encore été testée à grande échelle » vaut mieux que « les obstacles ont été surmontés ».
4. **Ouverture** vers de nouvelles perspectives : améliorations concrètes et réalistes (module X, déploiement sur Y), éventuellement à court, moyen et long terme ; pas « révolutionner le secteur ».

Vérifier : la conclusion ne mentionne **aucun contenu absent** du développement (ex. citer une étude de cas jamais traitée dans le corps).

## 5. Bilans de fin de chapitre
À la fin de chaque chapitre : 4 à 6 lignes qui rappellent ce que le chapitre a établi (des faits, pas « ce chapitre nous a permis de présenter… »), puis une phrase qui annonce le chapitre suivant. La conclusion générale reprendra ces trois bilans. Dans le plan en parties du guide, ce sont les « conclusions partielles » de fin de partie.
