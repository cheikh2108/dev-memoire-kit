# La soutenance

Acte final du processus. La note cumule deux appréciations : le **document lu** par les suffragants (membres du jury) et la **présentation + défense orale**. Mentions : passable, assez bien, bien, très bien, excellent (honorable, très honorable selon les cas).

## 1. Préparation psychologique
- C'est un examen (épreuve écrite + exposé + interrogation), mais aussi plus : se présenter comme un **chercheur** qui connaît son sujet mieux que quiconque, pas comme un étudiant craintif.
- Se reposer les deux jours précédents.

## 2. Préparation intellectuelle
1. **Relire** tout le mémoire, plusieurs fois : maîtriser le mouvement d'ensemble et chaque détail technique (une réponse approximative laisse une impression désastreuse).
2. **Prendre du recul** pour repérer les faiblesses, prévoir les critiques et préparer les réponses.
3. **Identifier son apport personnel** : ce que le travail ajoute par rapport à l'état où on a trouvé le problème.
4. **Fiches techniques** sur toutes les questions possibles, avec renvoi à la page du mémoire (modèle : `assets/fiche-technique-soutenance.md`).
5. **S'exercer à résumer oralement** le travail, chronomètre en main.
6. **Préparer la démo** : application lancée à l'avance, données de démonstration réalistes, scénario écrit, **vidéo de secours** si le réseau ou la machine tombe.

Règle d'or : ne mettre dans le document que ce que l'on maîtrise. Chaque terme technique, capture, figure, tableau ou schéma de configuration peut faire l'objet d'une question.

## 3. Exposé : 15 minutes environ

Le président indique le temps et ce qu'on attend : exposer les principales positions et conclusions, et les conditions dans lesquelles le travail a été réalisé. Trame (voir `assets/trame-diaporama.md`) :

| Bloc | Durée |
|---|---|
| Allocution (page de couverture) | 1 min |
| Sommaire | 1 min |
| Introduction : contextualisation + plan | 2 min |
| Problématique (explication du sujet) | 1 min |
| Objectif général et objectifs spécifiques | 1 min |
| Conception / réalisation / démonstration | 7 min |
| Conclusion : résultats + limites + perspectives | 1 min |
| Remerciements | 1 min |

Allocution type :
> « Bonjour Monsieur le Président (Madame la Présidente), Messieurs et Mesdames les membres du jury, cher public. Nous sommes là ce [date] pour soutenir un mémoire de fin de cycle pour l'obtention de la licence en Génie Logiciel et Administration Réseaux, qui a pour sujet : [sujet]. »

Remerciements type :
> « Monsieur le Président, Mesdames et Messieurs les membres du jury, nous vous remercions d'avoir accepté de participer à notre soutenance, et nous restons à votre entière disposition pour apporter des réponses claires à vos questions. »

Finir en indiquant nettement les perspectives ouvertes, remercier sobrement, se dire disponible pour tirer parti des remarques du jury.

## 4. Questions et critiques du jury

Rien n'échappe au jury : fautes d'accent, de syntaxe, omissions bibliographiques. **Prendre note de toutes les remarques.**

| Situation | Réponse |
|---|---|
| Félicitations, encouragements | « Je vous remercie, Monsieur / Madame le membre du jury. » |
| Critique **fondée** | La reconnaître : « Vous avez raison, je m'engage à corriger ce point dans la version finale. » |
| Critique **non fondée** ou déjà traitée | Réexpliquer calmement en renvoyant à la page concernée, argumenter **sans polémique**. |
| Question de maîtrise, réponse connue | Répondre clairement, avec un exemple tiré du projet. Montrer la connaissance sans digresser. |
| Question de maîtrise, réponse inconnue | Le dire honnêtement : « Nous n'avons pas approfondi ce point dans le cadre du mémoire ; voici ce que nous en savons / comment nous l'aborderions. » Ne jamais inventer. |
| Demande d'explication d'une figure, capture, tableau | Lire la figure : ce qu'elle représente, les éléments clés, ce qu'elle prouve. |

Un peu d'humour, à bon escient, détend l'atmosphère. Puis le jury se retire pour délibérer.

## 5. Questions fréquentes en informatique (à préparer)
- Pourquoi cette stack plutôt qu'une autre ? (critères : compétences, coût, hébergement, communauté, contraintes du client)
- Différence entre diagramme de classes et MCD ; cas d'utilisation et séquence ; « include » et « extend ».
- Comment sont stockés les mots de passe ? Comment empêchez-vous l'injection SQL ou les failles XSS ?
- Qu'avez-vous testé, comment, et avec quels résultats ?
- Où et comment l'application est-elle déployée ? Combien coûterait l'hébergement ?
- Que se passe-t-il si le réseau coupe (contexte local) ?
- Que feriez-vous différemment ? Quelle est la principale limite ?
- Quelle est votre contribution personnelle (travail de groupe) ?
- Explication de chaque sigle du glossaire.
