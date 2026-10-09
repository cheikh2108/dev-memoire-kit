# Modélisation UML (et Merise) pour le mémoire

La modélisation est la partie où les mémoires de licence sont le plus souvent faibles : diagrammes recopiés d'Internet, définis au lieu d'être montrés, incohérents avec la base de données réelle. Ce guide donne une **méthode pas à pas**, puis le détail de chaque diagramme, et la correspondance avec la base de données. Un exemple complet en PlantUML sur un sujet réel (pointage des étudiants) est dans `assets/uml-exemple-pointage.md`.

---

## 1. Principes

1. **Un diagramme sert à montrer une décision**, pas à remplir une section. Chaque diagramme du mémoire doit répondre à une question : *qui fait quoi ?* (cas d'utilisation), *quelles données et quels liens ?* (classes), *dans quel ordre ?* (séquence, activité), *où ça tourne ?* (déploiement).
2. **Modéliser le système réel**, pas un système idéal : les diagrammes doivent correspondre au code et à la base livrés. Le jury compare.
3. **Peu de diagrammes, bien expliqués** : en licence, 4 ou 5 diagrammes commentés valent mieux que 12 diagrammes muets.
4. **Chaque diagramme** est numéroté (Figure 2.3), légendé, lisible à l'impression et **commenté dans le texte** : ce qu'il montre, les éléments clés, la décision qu'il justifie.
5. **Cohérence entre diagrammes** : un acteur du diagramme de cas d'utilisation se retrouve dans les séquences ; une classe utilisée dans une séquence existe dans le diagramme de classes ; chaque classe persistante a sa table.

## 2. Quels diagrammes pour un mémoire de réalisation ?

| Diagramme | Question à laquelle il répond | Obligatoire en licence ? | Place dans le plan |
|---|---|---|---|
| Cas d'utilisation | Qui utilise le système et pour faire quoi ? | **Oui** | 2.x Analyse des besoins / Conception |
| Classes (ou MCD Merise) | Quelles données, quelles relations ? | **Oui** | 2.x Conception |
| Séquence (1 à 3 scénarios clés) | Comment se déroule une fonctionnalité, étape par étape ? | **Oui** | 2.x Conception |
| Activité | Quel est le processus métier (avec décisions, acteurs) ? | Recommandé (processus actuel ou futur) | 2.3 Analyse de l'existant ou Conception |
| Déploiement | Sur quelles machines tourne chaque composant ? | Recommandé | 3.5 Architecture |
| États-transitions | Par quels états passe un objet important (commande, demande) ? | Si un objet a un cycle de vie | Conception |
| Composants / paquetages | Comment le code est-il découpé ? | Optionnel | 3.5 Architecture |

## 3. Méthode : des besoins aux diagrammes

**Étape 1 — Lister les acteurs.** Qui interagit avec le système ? Des **rôles**, pas des personnes (« Enseignant », pas « M. Diop »). Inclure les systèmes externes (service SMS, Wave, Orange Money, API d'une autre application).

**Étape 2 — Lister les besoins fonctionnels** sous la forme *verbe à l'infinitif + complément*, par acteur : « Enseignant : ouvrir une séance, pointer un étudiant, clôturer la séance ».

**Étape 3 — Cas d'utilisation** : chaque besoin devient un cas (ovale). Regrouper par acteur. Ajouter `include` et `extend` seulement là où c'est vrai (voir §4).

**Étape 4 — Description textuelle** des 2 ou 3 cas les plus importants (modèle au §4.4). C'est elle qui révèle les données et les étapes.

**Étape 5 — Repérer les classes** : souligner les **noms** dans les descriptions (étudiant, séance, cours, présence…) → classes candidates. Les **verbes** → méthodes ou associations. Les **adjectifs et valeurs** → attributs.

**Étape 6 — Diagramme de classes** : classes, attributs typés, associations avec multiplicités. Vérifier chaque multiplicité par une phrase (« une séance concerne un seul cours ; un cours a plusieurs séances »).

**Étape 7 — Séquences** des scénarios décrits à l'étape 4, en suivant l'architecture réelle (Vue → Contrôleur → Service/Modèle → Base).

**Étape 8 — Passage à la base de données** (§9) puis **vérification croisée** (§11).

---

## 4. Diagramme de cas d'utilisation

### 4.1 Éléments
| Élément | Notation | Règle |
|---|---|---|
| Acteur | Bonhomme (humain) ou rectangle « actor » (système externe) | Placé **hors** du cadre du système. Un rôle, pas une personne. |
| Cas d'utilisation | Ovale, **verbe à l'infinitif + complément** | « Pointer un étudiant », pas « Pointage » ni « Gestion ». |
| Système | Rectangle qui entoure les cas, avec le nom de l'application | Délimite ce qui est dans le périmètre. |
| Association | Trait plein acteur — cas | L'acteur participe au cas. |
| Généralisation d'acteurs | Flèche à triangle creux de l'acteur spécialisé vers le général | « Administrateur » hérite des cas d'« Utilisateur ». |
| `<<include>>` | Flèche pointillée **du cas de base vers le cas inclus** | Le cas inclus est **toujours** exécuté. |
| `<<extend>>` | Flèche pointillée **du cas d'extension vers le cas de base** | Le cas d'extension est **optionnel**, sous condition. |

### 4.2 `include` ou `extend` ? (la question favorite du jury)
- **include** = « fait toujours partie de ». *Valider une commande* inclut *Calculer le montant*. Sans lui, le cas de base est incomplet.
- **extend** = « peut s'ajouter dans certains cas ». *Appliquer un code promo* étend *Valider une commande* : on peut valider sans code promo.
- Test : si on supprime le cas secondaire, le cas principal fonctionne-t-il encore ? Oui → `extend`. Non → `include`.

### 4.3 Erreurs fréquentes
- **« S'authentifier » inclus partout** : 15 flèches `include` vers « S'authentifier » encombrent le diagramme. L'authentification est une **précondition**, à écrire dans les descriptions textuelles, ou un seul cas relié aux acteurs.
- **Cas trop gros** (« Gérer les étudiants ») sans détail. Accepté pour le CRUD si on précise en note : ajouter / modifier / supprimer / consulter. Sinon, découper.
- **Cas trop fins** : « Cliquer sur le bouton Valider » est une étape d'interface, pas un cas.
- **Flèches de séquence entre cas** (« d'abord A puis B ») : un diagramme de cas d'utilisation ne montre pas l'ordre. L'ordre va dans un diagramme d'activité ou de séquence.
- **Base de données dessinée comme acteur** : la base fait partie du système, ce n'est pas un acteur.
- **Diagramme illisible** : au-delà de 12 à 15 cas, découper par acteur ou par module (un diagramme par paquetage).

### 4.4 Modèle de description textuelle
```
Cas : Pointer un étudiant
Acteur principal : Enseignant
Préconditions : l'enseignant est authentifié ; une séance est ouverte pour son cours.
Scénario nominal :
  1. L'enseignant sélectionne la séance en cours.
  2. Le système affiche la liste des étudiants inscrits.
  3. L'enseignant scanne le QR code de la carte de l'étudiant.
  4. Le système vérifie que l'étudiant est inscrit au cours.
  5. Le système enregistre la présence avec l'heure.
  6. Le système affiche une confirmation.
Scénarios alternatifs :
  4a. Étudiant non inscrit : le système affiche « Étudiant non inscrit à ce cours ».
  5a. Déjà pointé : le système ignore le doublon et l'indique.
  3a. Réseau indisponible : la présence est enregistrée localement puis synchronisée.
Postconditions : une présence horodatée est liée à l'étudiant et à la séance.
Règles de gestion : un étudiant arrivé plus de 15 min après le début est marqué « en retard ».
```

---

## 5. Diagramme de classes

### 5.1 Éléments
| Élément | Notation | Exemple |
|---|---|---|
| Classe | Rectangle 3 compartiments : nom / attributs / méthodes | `Etudiant` |
| Attribut | `visibilité nom : Type` | `- matricule : String` |
| Méthode | `visibilité nom(param : Type) : Retour` | `+ tauxAbsence(periode : Periode) : Float` |
| Visibilité | `+` public, `-` privé, `#` protégé | — |
| Association | Trait plein, nom ou rôle facultatif | Etudiant — Presence |
| Multiplicité | `1`, `0..1`, `*` (= `0..*`), `1..*`, `2..5` | « 1 » côté Séance, « * » côté Présence |
| Agrégation | Losange **creux** côté du tout | Une Classe (promotion) regroupe des Étudiants qui existent sans elle |
| Composition | Losange **plein** côté du tout | Une Facture et ses LignesFacture : supprimer la facture supprime les lignes |
| Héritage (généralisation) | Flèche à triangle creux vers la classe mère | `Enseignant` et `Etudiant` héritent de `Utilisateur` |
| Classe d'association | Classe reliée en pointillé au milieu d'une association | `Inscription(dateInscription)` entre Étudiant et Cours |
| Énumération | `<<enumeration>>` | `StatutPresence { PRESENT, RETARD, ABSENT, EXCUSE }` |

### 5.2 Lire et vérifier les multiplicités
Toujours lire une association **dans les deux sens** :
- « Une **séance** concerne **exactement un** cours » → côté Cours : `1`.
- « Un **cours** a **zéro ou plusieurs** séances » → côté Séance : `*`.

La multiplicité s'écrit **du côté de la classe qu'elle compte**. C'est l'erreur la plus fréquente, et le piège classique quand on vient de Merise, où les cardinalités se placent de l'autre côté (voir §8).

### 5.3 Agrégation, composition ou simple association ?
- Doute ? → **simple association**. C'est presque toujours suffisant en licence.
- Composition seulement si la partie **ne peut pas exister sans le tout** et **lui appartient à un seul** (ligne de facture, réponse d'un questionnaire).
- Ne jamais mettre de losange des deux côtés.

### 5.4 Erreurs fréquentes
- **Clés étrangères en attributs** (`idCours : int` dans `Seance`) : dans un diagramme de classes, le lien est **l'association**. Les clés étrangères appartiennent au modèle relationnel (MLD).
- **Classes « techniques »** sans intérêt métier : `Database`, `Controller`, `Main`, `Interface`. Le diagramme de classes de conception montre le métier.
- **Classes sans attributs** ou avec des attributs non typés.
- **Multiplicités absentes** : un diagramme de classes sans multiplicités ne vaut presque rien.
- **Attributs calculés stockés sans raison** (`age` alors que `dateNaissance` existe) : en faire une méthode.
- **Héritage abusif** : si les sous-classes n'ont aucun attribut ni comportement propre, un attribut `role` suffit.
- **Associations 1 — 1 à éviter** (`1` des deux côtés ; Merise `(1,1) — (1,1)`) : deux classes toujours liées une à une décrivent presque toujours **le même objet**. Les **fusionner** en une seule classe (`Etudiant` + `DossierEtudiant` → `Etudiant`). Une association 1 — 1 n'est défendable que si un côté est **facultatif** (`0..1` : un étudiant n'a pas forcément de carte, `Etudiant "1" —— "0..1" CarteEtudiant`), si les deux objets ont des **cycles de vie différents** (la carte est remplacée, l'étudiant reste), ou pour **isoler des données sensibles** ou rarement lues (informations médicales, pièces justificatives). Dans ces cas, le justifier en une phrase dans le mémoire : le jury pose souvent la question.
- **Diagramme différent de la base livrée** : le jury vérifie avec les captures de la base ou les migrations.

---

## 6. Diagramme de séquence

### 6.1 Éléments
| Élément | Notation | Usage |
|---|---|---|
| Ligne de vie | Rectangle en haut + trait vertical pointillé | Un acteur ou un objet (`:SeanceController`) |
| Message synchrone | Flèche pleine à pointe **pleine** | L'appelant attend la réponse |
| Message asynchrone | Flèche pleine à pointe **ouverte** | Envoi sans attendre (notification, file de messages) |
| Retour | Flèche **pointillée** | Réponse ou valeur retournée |
| Activation | Rectangle étroit sur la ligne de vie | Période où l'objet travaille |
| Création / destruction | Message `<<create>>` / croix en bas de la ligne | Objet créé ou détruit pendant le scénario |
| Fragment `alt` | Cadre avec conditions `[si…]` / `[sinon]` | Alternative |
| Fragment `opt` | Cadre avec une condition | Option (sans sinon) |
| Fragment `loop` | Cadre `loop [pour chaque étudiant]` | Répétition |
| Fragment `ref` | Cadre qui renvoie à une autre séquence | Réutiliser « S'authentifier » sans le redessiner |

### 6.2 Méthode
1. Partir de la **description textuelle** du cas (§4.4) : un pas du scénario = un ou deux messages.
2. Suivre **l'architecture réelle** : Acteur → Interface (Vue/écran) → Contrôleur → Service ou Modèle → Base de données. En MVC Laravel : `Enseignant → :Vue → :PresenceController → :Presence (Eloquent) → :BD`.
3. Nommer les messages comme des **appels** : `pointer(matricule, idSeance)`, `verifierInscription()`, `INSERT presence`, retour `confirmation`.
4. Ajouter les **cas d'erreur** importants avec `alt` (étudiant non inscrit, doublon).
5. **Un diagramme = un scénario**, 6 à 15 messages. Au-delà, découper avec `ref`.

### 6.3 Erreurs fréquentes
- Séquence « système boîte noire » (`Utilisateur → Système → Utilisateur`) en conception : acceptable en analyse (« diagramme de séquence système »), insuffisant en conception, où il faut les objets internes.
- Messages sans retour, ou retours partout même pour des notifications asynchrones.
- Objets qui n'existent pas dans le diagramme de classes ni dans le code.
- Tout le système dans une seule séquence géante.

---

## 7. Autres diagrammes utiles

### Activité
Pour un **processus** avec décisions et plusieurs intervenants : processus actuel (analyse de l'existant) ou processus cible.
- Nœud initial (rond plein), actions (rectangles arrondis), décision/fusion (losange avec conditions `[oui]/[non]`), **fork/join** (barre épaisse) pour les actions parallèles, nœud final (rond cerclé).
- **Couloirs** (*swimlanes*) : un couloir par acteur. Très parlant pour montrer « qui fait quoi » dans le processus manuel actuel et ce que l'application change.

### États-transitions
Pour un objet avec un **cycle de vie** : Commande (créée → payée → expédiée → livrée / annulée), Demande de bourse (soumise → en étude → acceptée / rejetée).
- États (rectangles arrondis), transitions étiquetées `événement [condition] / action`.
- Utile pour justifier les statuts stockés en base et les règles (« on ne peut pas annuler une commande expédiée »).

### Déploiement
Pour l'**architecture technique** : nœuds (serveur, téléphone, poste client), environnements d'exécution (PHP-FPM, Node, Nginx), artefacts (application, base), liaisons étiquetées par le protocole (HTTPS, SQL/TCP 3306) et services externes (passerelle SMS, Wave).

### Composants / paquetages
Découpage du code : modules (Authentification, Pointage, Statistiques) et dépendances. Utile pour une architecture modulaire ou multi-tenant.

---

## 8. UML ou Merise ?

Beaucoup d'écoles sénégalaises enseignent **Merise** (MCD → MLD → MPD) pour les données et **UML** pour le comportement. Les deux sont acceptés ; l'objectif spécifique peut dire « UML ou Merise ».
- Choisir **un seul formalisme pour les données** (diagramme de classes **ou** MCD), et l'annoncer dans le cadre méthodologique (1.2.3 Méthode de conception) avec sa justification.
- Combinaison courante et cohérente : **UML** (cas d'utilisation, séquence, activité) + **MCD/MLD Merise** pour la base.

### Correspondance des vocabulaires
| Merise (MCD) | UML (classes) |
|---|---|
| Entité | Classe |
| Propriété | Attribut |
| Identifiant (souligné) | Pas d'identifiant obligatoire (sauf annotation `{id}`) |
| Association (ovale) | Association (trait) |
| Association porteuse de propriétés | Classe d'association |
| Cardinalités `min,max` | Multiplicités `min..max` |

### Le piège des cardinalités
Les cardinalités Merise se lisent **du côté de l'entité qui participe** ; les multiplicités UML s'écrivent **du côté opposé** (celui de l'entité comptée).
Exemple « un cours a plusieurs séances, une séance appartient à un seul cours » :
- Merise : `COURS (0,n) —— avoir —— (1,1) SEANCE`
- UML : `Cours "1" —— "*" Seance`
Les valeurs semblent « inversées » : c'est normal.

Même règle qu'en UML : éviter `(1,1) — (1,1)`, signe de deux entités à fusionner ; préférer `(1,1) — (0,1)` quand une entité est facultative pour l'autre, et le justifier (voir §5.4).

---

## 9. Du modèle à la base de données

### Règles de passage (classes UML ou MCD → tables)
| Situation | Règle | Exemple |
|---|---|---|
| Classe / entité | Une table ; identifiant → clé primaire | `etudiant(id PK, matricule UNIQUE, nom, prenom…)` |
| Association **1 — \*** (Merise : (1,1) — (0,n)) | Clé étrangère **du côté \*** (côté (1,1) en Merise) | `seance(id, cours_id FK → cours.id, date, heure_debut)` |
| Association **0..1 — \*** | Clé étrangère **nullable** du côté \* | `etudiant.classe_id` NULL autorisé |
| Association **\* — \*** (Merise : (0,n) — (0,n)) | **Table de jonction** avec les deux clés | `inscription(etudiant_id FK, cours_id FK, date_inscription, PK(etudiant_id, cours_id))` |
| Classe d'association / association porteuse | Ses attributs vont dans la table de jonction | `date_inscription` ci-dessus |
| **1 — 0..1** (1 — 1 strict : fusionner, voir §5.4) | Clé étrangère `UNIQUE` du côté facultatif | `carte_etudiant.etudiant_id UNIQUE` |
| Composition | Clé étrangère `NOT NULL` + `ON DELETE CASCADE` | `ligne_facture.facture_id` |
| Héritage | 3 stratégies : **table unique** avec colonne `type` (simple, conseillée en licence) ; **une table par classe concrète** ; **table mère + tables filles** liées par la même clé | `utilisateur(id, type ENUM('enseignant','etudiant','admin'), …)` |
| Énumération | `ENUM` ou table de référence | `presence.statut ENUM('present','retard','absent','excuse')` |

### Vérifier avec le code réel
- Laravel : les **migrations** sont la vérité. Chaque table et clé étrangère du MLD doit avoir sa migration ; chaque relation Eloquent (`hasMany`, `belongsTo`, `belongsToMany`) doit correspondre à une association du diagramme.
- Prisma / TypeORM / Django : même vérification avec le schéma (`schema.prisma`, entités, `models.py`).
- Montrer dans le mémoire le **MLD** (texte : `table(attributs, #clé_étrangère)`) ou une capture du schéma généré.

---

## 10. Outils
| Outil | Avantages | Remarques |
|---|---|---|
| **PlantUML** | Diagrammes en texte (versionnés avec le code), génération par l'IA facile | Rendu via le site plantuml.com, l'extension VS Code ou un serveur local |
| **Mermaid** | Texte, rendu natif dans GitHub, Notion, nombreux éditeurs | Moins complet que PlantUML pour les cas d'utilisation et le déploiement |
| **draw.io (diagrams.net)** | Gratuit, à la souris, export PNG/SVG haute résolution | Bon pour ajuster la mise en page finale |
| **StarUML**, Visual Paradigm (édition communautaire) | Outils UML complets | Vérifier la licence ; filigrane sur certaines versions gratuites |
| **Looping**, **JMerise** | Modélisation Merise (MCD → MLD → SQL) | Courants dans l'enseignement francophone |
| **dbdiagram.io**, MySQL Workbench | Schéma de base, rétro-ingénierie depuis la base réelle | Utile pour vérifier que le MLD correspond à la base |

Conseil : écrire les diagrammes en **PlantUML** (texte relisible, cohérent, facile à corriger), puis exporter en PNG/SVG haute résolution pour le mémoire. Garder les fichiers sources `.puml` dans le dépôt du projet.

### Faire générer un diagramme par une IA, sans le subir
```
Voici la description textuelle du cas « [cas] » et la liste de mes tables / migrations : […].
Génère le diagramme de [séquence / classes] en PlantUML, en respectant EXACTEMENT
les noms de classes, de tables et de contrôleurs fournis. N'invente aucune classe,
aucun attribut ni aucune méthode absents de ce que je t'ai donné ; s'il manque une
information, ajoute une note « À VÉRIFIER ». Ensuite, explique le diagramme en
5 phrases que je pourrai défendre devant le jury.
```
Puis **vérifier chaque élément** contre le code : un diagramme généré est une proposition.

---

## 11. Vérification croisée (avant dépôt)
- [ ] Chaque **acteur** du diagramme de cas d'utilisation apparaît dans au moins une séquence ou un processus.
- [ ] Chaque **cas d'utilisation** important a une description textuelle ou une séquence.
- [ ] Chaque objet des **séquences** existe dans le diagramme de classes ou dans l'architecture (contrôleur, service).
- [ ] Chaque **classe persistante** a sa table ; chaque **association** a sa clé étrangère ou sa table de jonction ; les multiplicités correspondent aux contraintes (`NOT NULL`, `UNIQUE`).
- [ ] Les **noms** sont les mêmes partout (diagrammes, texte, code, captures).
- [ ] Chaque diagramme est numéroté, légendé, lisible à l'impression et **commenté dans le texte**.
- [ ] La **notation** est respectée (sens des flèches `include`/`extend`, losanges, multiplicités du bon côté).

## 12. Questions du jury sur la modélisation (à préparer)
- Différence entre `include` et `extend` ? Donnez un exemple tiré de votre diagramme.
- Différence entre agrégation et composition ? Pourquoi ce choix ici ?
- Que signifie cette multiplicité ? Lisez l'association dans les deux sens.
- Comment cette association a-t-elle été traduite dans la base ? Montrez la table.
- Pourquoi avoir choisi UML plutôt que Merise (ou les deux) ?
- Différence entre diagramme de séquence et diagramme d'activité ?
- Ce diagramme de classes est-il un modèle d'analyse ou de conception ?
- Comment avez-vous traité l'héritage dans la base ?
- Que se passe-t-il dans ce scénario si [cas d'erreur] ?
