# Bibliothèque de prompts (bons vs mauvais)

> Exemples réels commentés (audit, bug + test, déploiement, CORS, seeder sénégalais, palette) : `../assets/prompts/bibliotheque-equipe.md`. Leçon principale : un prompt **court** marche s'il nomme le fichier, la contrainte, l'erreur et la valeur exacte.

## Principes d'un bon prompt
1. **Contexte** : qui je suis, le projet, le public du résultat.
2. **Matière** : les faits, données, extraits, contraintes (la qualité de la sortie ne dépasse pas celle de l'entrée).
3. **Tâche** précise et **format** attendu (longueur, structure, ton, langue).
4. **Interdits** explicites (tics, inventions, éléments à ne pas toucher).
5. **Vérification** : demander de signaler les manques au lieu de les combler, par exemple avec `[À COMPLÉTER]`.
6. **Exemples** : un bon et un mauvais exemple valent mieux qu'une longue description.

---

## Mémoire

### Introduction générale
❌ « Écris l'introduction de mon mémoire sur une application de gestion des taxes. »

✅
```
Tu m'aides à rédiger l'introduction générale de mon mémoire de licence GLAR.
Sujet exact : « … ».
Faits disponibles :
- processus actuel : … (observé le …, à …)
- difficultés citées en entretien : … (N entretiens avec …)
- ce que j'ai réalisé : … (stack : …)
- méthodes réellement utilisées : …
Rédige les 7 paragraphes imposés (contextualisation, problématique, objectifs,
motivation, hypothèses, approche méthodologique, annonce du plan) en 1,5 à 2 pages.
Plan exact à annoncer : I …, II …, III ….
Contraintes : registre académique, « nous » de modestie, aucune affirmation de résultat
(loi du suspens), aucun chiffre ou source que je n'ai pas fournis : mets [À COMPLÉTER : …].
Interdits : « de nos jours », « à l'ère du numérique », « innovant », « crucial »,
triplets d'adjectifs, phrases sur ce que « cette introduction va présenter ».
```

### Relecture d'un chapitre
```
Voici le chapitre 2.4 de mon mémoire. Relis-le comme un membre du jury exigeant.
Donne une liste priorisée :
1) erreurs bloquantes (incohérences, affirmations sans preuve, fautes, numérotation) ;
2) passages génériques à réécrire (cite la phrase, propose une version concrète
   en utilisant UNIQUEMENT les faits présents dans le texte ou marque [À COMPLÉTER]) ;
3) questions que le jury risque de poser sur ce chapitre.
Ne réécris pas tout le chapitre.
```

### Problématique et hypothèses
```
Sujet : « … ». Constat observé : « … ».
Propose 3 formulations de la question centrale (une phrase interrogative chacune),
puis pour la meilleure, 2 hypothèses testables : pour chacune, indique comment
le mémoire pourra la confirmer ou l'infirmer (quel test, quelle mesure).
```

### Bibliographie
❌ « Donne-moi 10 références pour mon mémoire sur les réseaux de neurones. » (risque élevé de références inventées)

✅
```
Voici les documents que j'ai réellement consultés : [titres, liens, éditeurs].
Mets-les au format de mon école :
Ouvrage : NOM Prénom, *Titre*, Ville, Éditeur, année, nombre de pages.
Webographie : lien : JJ/MM/AAAA, HHhMM.
Ne complète aucun champ manquant : écris [À VÉRIFIER] à la place.
```

### Préparation de la soutenance
```
Voici mon mémoire (ou ses parties clés). Joue un jury de 3 membres (président,
spécialiste technique, spécialiste méthodologie). Pose-moi 15 questions, du plus
probable au moins probable, dont 5 critiques. Pour chacune : la page concernée et
ce qu'une bonne réponse doit contenir. Puis interroge-moi une question à la fois
et évalue mes réponses.
```

---

## Développement

### Générer une fonctionnalité
```
Projet : [stack exacte + versions]. Conventions : [lien ou extrait : nommage, structure].
Fonctionnalité : [règle métier précise + cas limites].
Code existant concerné : [fichiers/extraits].
Livre : le code minimal, les tests du comportement métier, et la liste des
hypothèses que tu as faites. Pas de commentaires qui paraphrasent le code, pas de
try/catch qui avalent les erreurs, pas de nouvelle dépendance sans justification.
Si une API dont tu n'es pas sûr est nécessaire, dis-le au lieu de l'inventer.
```

### Revue de code
```
Relis ce diff comme un développeur senior. Classe les remarques :
bloquant (bug, sécurité, perte de données) / important / mineur.
Pour chaque remarque : ligne, problème, correction proposée.
Ignore le style si un formateur (Prettier, Pint, Black) est en place.
```

### Expliquer du code (pour le jury)
```
Explique ce code ligne par ligne à un étudiant de L3 qui doit le défendre à l'oral.
Pour chaque bloc : ce qu'il fait, pourquoi il est nécessaire, ce qui casserait sans lui,
et une question qu'un jury pourrait poser dessus.
```

---

## Design
- Nouvel écran sans référence : prompt de `design.md` §6.
- Recréer une interface depuis une image : `../assets/prompts/image-vers-interface.md` (analyse obligatoire avant le code, tokens, découpage en composants, interdits).
- Intégrer un composant React trouvé en ligne : `../assets/prompts/integration-composant.md` (avec checklist des erreurs de copier-coller).

Toujours fournir : utilisateur, contexte d'usage, action principale, données réelles, identité visuelle, liste d'interdits.

---

## Anti-patterns de prompt
| Mauvais réflexe | Effet | Correction |
|---|---|---|
| « Fais-moi un mémoire / une app complète » | Résultat générique, invérifiable | Découper : une section, une fonctionnalité à la fois |
| Aucun fait fourni | L'IA invente pour combler | Donner la matière, autoriser `[À COMPLÉTER]` |
| « Rends-le plus professionnel » | Plus d'adjectifs et de jargon | « Plus précis : remplace chaque adjectif par le fait qui le justifie » |
| Accepter le résultat sans relire | Erreurs et inventions dans le document final | Vérifier chaque fait, chaque référence, chaque API |
| Demander des références bibliographiques | Références fictives | Fournir ses sources, demander seulement la mise en forme |
