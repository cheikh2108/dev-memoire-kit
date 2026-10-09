# Erreurs fréquentes : grille de relecture

Grille construite à partir de l'analyse de six travaux d'étudiants L3 GLAR (TP d'évaluation : couverture, avant-propos, plan détaillé, introduction, développement, conclusion, bibliographie, webographie). Les exemples sont reformulés et anonymisés.

## A. Bloquant (le jury le verra)

### A1. Sections qui annoncent au lieu de délivrer
> « Le diagramme de classe représente la structure de l'application, en détaillant les classes, les attributs et les relations entre les objets. »

…sans diagramme, sans classe nommée. La section **définit l'outil** au lieu de **montrer le résultat**.
**Correction** (méthode détaillée dans `uml.md`) : insérer la figure numérotée, puis la commenter avec les vrais éléments : « La figure 2.2 montre les six classes du système. `Etudiant` est liée à `Pointage` par une relation 1..* : chaque passage génère un enregistrement horodaté… »

### A2. Résultats affirmés sans preuve
> « Cette analyse a montré que l'application a atteint les objectifs fixés. » / « Les premiers résultats montrent une amélioration significative des ventes. »

Pour un projet non déployé, c'est invérifiable et le jury le sait.
**Correction** : n'affirmer que ce qui est mesuré (tests passés, temps mesuré, retours de N utilisateurs). Sinon, écrire au conditionnel et placer la mesure en perspective.

### A3. Chiffres et méthodes inventés
Nombre d'entretiens, d'enquêtés, logiciel d'analyse (NVivo), analyse SWOT, échantillon pilote… cités mais jamais exploités dans le texte.
**Correction** : ne citer que ce qui a été fait ; montrer les résultats en annexe. Marqueur `[À COMPLÉTER]` en attendant.

### A4. Incohérences techniques
- base de données MongoDB dans un paragraphe, PostgreSQL dans le suivant ;
- « React.js » en architecture, « React Native » en implémentation ;
- « Java Sprint Boot » (au lieu de Spring Boot), « Framework React-natif ».
**Correction** : tableau unique des technologies (nom exact, version, rôle) en 3.6.1, et recherche dans tout le document de chaque nom de technologie pour vérifier la cohérence.

### A5. Bibliographie douteuse
- Nombre de pages manifestement faux pour des ouvrages connus (manuels de plusieurs centaines de pages indiqués à moins de 100 ou 250 pages) ;
- mémoires introuvables, auteurs aux noms génériques ;
- une thèse classée dans « Mémoires » ;
- commentaires élogieux ajoutés sous chaque référence.
**Correction** : appliquer la checklist de `normes-presentation.md` (existence, exactitude, consultation réelle). Une référence douteuse est supprimée.

### A6. Plan ≠ corps du texte
Titres du plan détaillé différents des titres du développement ; annonce du plan qui décrit d'autres parties ; conclusion qui résume une étude de cas (ex. « la deuxième partie a illustré AlphaGo ») absente du corps.
**Correction** : générer le sommaire automatiquement ; relire l'introduction et la conclusion **après** avoir fini le développement.

### A7. Problématique décalée par rapport au sujet
Sujet de réalisation (« concevoir un système… ») avec une problématique purement théorique (« Quels sont les principes qui sous-tendent… ? »), ou hypothèses qui ne correspondent pas à la question.
**Correction** : la question doit porter sur ce que le mémoire réalise et sur ce à quoi la conclusion répondra.

### A8. Coquilles reprises des modèles
« TELEINFORMQTIQUE », « Unified Modelling Langage », « Controlleur », liens `file:/C:/Users/…` copiés dans le plan, signes parasites.
**Correction** : `scripts/verifier_memoire.py` détecte les plus connues ; relecture orthographique finale (Word + Antidote ou LanguageTool).

## B. Qualité (fait « travail généré » ou « remplissage »)

### B1. Empilement de clôtures
« En résumé… » + « En conclusion… » + « En somme… » à la suite, à chaque fin de section : jusqu'à la moitié du texte est faite de résumés.
→ Une phrase de conclusion + une phrase de transition par section (`introduction-conclusion.md` §3).

### B2. Ouvertures universelles
« De nos jours, le monde connaît une avancée technologique considérable dans tous les secteurs… », « L'essor du numérique transforme de nombreux secteurs… », « L'informatique révolutionne… ».
→ Ouvrir sur un fait précis et situé (voir skill `anti-generique`).

### B3. Promesses marketing
« solution innovante », « révolution dans le secteur », « méthode avant-gardiste », « expérience utilisateur optimale », « choix technologiques judicieux », « architecture robuste et scalable ».
→ Remplacer chaque adjectif par le fait qui le justifierait, ou le supprimer.

### B4. Futur dans la réalisation
« La plateforme offrira… », « L'application sera soumise à des tests rigoureux… » dans la partie Mise en œuvre.
→ Passé composé ou présent pour ce qui est fait ; futur seulement pour les perspectives.

### B5. Objectifs spécifiques = liste de fonctionnalités
→ Verbes d'action vérifiables (étudier, identifier, concevoir, développer, tester).

### B6. Sources faibles en webographie
Liens YouTube sans titre, page d'accueil de github.com, w3schools pour justifier un choix d'architecture.
→ Documentation officielle, articles de référence ; chaque lien avec date et heure de consultation.

### B7. Énumérations mal ponctuées
Listes intégrées dans une phrase avec des deux-points en cascade, ou majuscules après point-virgule.
→ Liste à puces : minuscule, point-virgule, point final (`normes-presentation.md`).

### B8. Avant-propos copié-collé
La présentation de l'école peut être commune, mais l'explication du sujet doit être propre au projet, factuelle et sans superlatifs.

## C. Checklist finale avant impression
- [ ] 22 pages présentes et dans l'ordre ; pagination romaine/arabe correcte
- [ ] Sommaire, table des matières, listes des figures et tableaux générés automatiquement et à jour
- [ ] Chaque figure et chaque tableau : numéro (chapitre.n), titre, source si emprunté, commentaire dans le texte
- [ ] Glossaire alphabétique, chaque sigle du texte y figure
- [ ] Aucune incohérence de technologie, de nombre ou de nom
- [ ] Aucun marqueur `[À COMPLÉTER]` restant
- [ ] Bibliographie et webographie vérifiées, au format de l'école
- [ ] Résumé et abstract relus, mots clés présents
- [ ] Normes de mise en page appliquées (Times 12, 1,5, justifié, marges 3,5/2,5)
- [ ] Relecture orthographique complète par une autre personne
