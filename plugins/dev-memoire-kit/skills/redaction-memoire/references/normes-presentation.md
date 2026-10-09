# Normes de présentation, style académique, citations

## Mise en page (normes de l'école)

| Élément | Norme |
|---|---|
| Impression | Recto uniquement |
| Police | Times New Roman |
| Texte | Taille 12, interligne 1,5, justifié |
| Titres | Taille 14, gras |
| Notes de bas de page | Taille 10, interligne 1 |
| Retrait de paragraphe | 1,5 cm sur tous les paragraphes |
| Marges gauche et droite | 3,5 cm |
| Marges haut et bas | 2,5 cm |

Un modèle Word où tout est déjà réglé est fourni : `../assets/modele-memoire.docx` (22 pages dans l'ordre, consignes en gris à supprimer, sommaire, table des matières et listes des figures et tableaux à mettre à jour avec F9).

Conseils Word :
- Définir ces réglages dans les **styles** (Normal, Titre 1/2/3, Note de bas de page) plutôt qu'à la main paragraphe par paragraphe.
- Utiliser des **légendes** (Références > Insérer une légende) pour chaque figure et tableau : `Figure 3.2 : Architecture technique de la plateforme`.
- Générer sommaire, table des matières, listes des figures et des tableaux automatiquement.
- Captures d'écran : lisibles à l'impression (pas de capture d'écran entier réduite à 8 cm de large), recadrées sur l'élément commenté.

## Style académique

Le jury consacre traditionnellement une bonne partie de son intervention aux **fautes de langue** : un écart à la norme est lu comme une non-maîtrise de la langue.
- Respect des règles grammaticales, syntaxiques et morphologiques.
- Pas de néologismes inutiles, d'abus de langue, de familiarités ni d'anglicismes quand le mot français existe (« données » plutôt que « datas », « mettre en production » plutôt que « déployer en prod »).
- « **Le** mémoire » (travail académique), pas « la mémoire ».
- Phrases simples et courtes, paragraphes bien agencés, transitions entre parties.
- Première personne du pluriel (« nous ») de modestie, de façon cohérente dans tout le document.
- Temps : dans la Mise en œuvre, décrire ce qui **a été fait** (passé composé / présent), pas ce que l'application « offrira ». Le futur est réservé aux perspectives.

## Ponctuation

La ponctuation est un système de signes fondamental, pas un détail. Règles rappelées par le guide :
- après les **deux-points** et le **point-virgule**, pas de majuscule ;
- en français : espace avant `: ; ? !` (insécable idéalement), pas d'espace avant `. ,` ;
- énumérations : chaque élément commence par une minuscule et se termine par un point-virgule, le dernier par un point.

```
Les besoins identifiés sont :
- l'authentification des utilisateurs ;
- la gestion des présences ;
- l'export mensuel des absences.
```

## Citations et plagiat

**Plagiat** : s'attribuer indûment l'œuvre d'un auteur, sous quelque forme que ce soit. Il est sanctionné.
- Reprise mot pour mot : entre guillemets « … » + appel de note de bas de page avec la source (auteur, titre, page).
- Reprise d'idée reformulée : pas de guillemets, mais la source reste obligatoire.
- Définitions (UML, MVC, SaaS…) : citer la source (documentation officielle, ouvrage) plutôt que de recopier un site sans le dire.
- Texte produit avec l'aide d'une IA : l'étudiant doit le comprendre, le vérifier, le réécrire avec ses données et pouvoir le défendre. Une IA n'est pas une source citable pour un fait.

## Références : règles de fiabilité

Avant d'ajouter une référence en bibliographie, vérifier :
- [ ] le document **existe** (recherche sur le catalogue de l'éditeur, Google Livres, le dépôt de l'école) ;
- [ ] l'auteur, le titre exact, l'éditeur, l'année et le **nombre de pages** sont exacts (ne pas les estimer) ;
- [ ] il a été **réellement consulté** et sert dans le texte ;
- [ ] il est classé dans la bonne catégorie (une thèse n'est pas un mémoire ; un article de revue n'est pas un ouvrage).

Une référence inventée ou erronée peut suffire à faire douter le jury de tout le travail.

### Sources recommandées pour un mémoire informatique
- Documentation officielle : MDN Web Docs, documentation Laravel / React / Flutter / Django / Spring, PostgreSQL, MySQL, Docker.
- Normes et sécurité : OWASP (Top 10, ASVS) ; au Sénégal, la Commission de Protection des Données Personnelles (CDP) et la loi n° 2008-12 sur la protection des données à caractère personnel, si le projet traite des données personnelles.
- Ouvrages de génie logiciel (UML, gestion de projet, bases de données) disponibles à la bibliothèque.
- Mémoires antérieurs de l'école (cités comme mémoires, avec établissement, année et pages).
- Plateformes de cours légales : OpenClassrooms, Coursera, edX, MIT OpenCourseWare, Khan Academy, freeCodeCamp.

Ne pas citer ni utiliser de sites de téléchargement illégal de formations ou de livres.
