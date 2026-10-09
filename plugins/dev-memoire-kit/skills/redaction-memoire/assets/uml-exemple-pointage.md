# Exemple complet : application de pointage des étudiants

Sujet tiré du guide : *Réalisation d'une application de pointage et de gestion des étudiants : cas d'un établissement d'enseignement supérieur*. Les diagrammes sont en **PlantUML** : copier chaque bloc dans plantuml.com, l'extension PlantUML de VS Code ou un fichier `.puml`, puis exporter en PNG/SVG.

Rendus PNG (PlantUML) déjà générés dans `uml-exemple/` : `1-cas-utilisation.png`, `2-classes.png`, `3-sequence-pointer.png`, `4-activite-existant.png`, `5-etats-seance.png`, `6-deploiement.png`.

Hypothèses de l'exemple (à remplacer par celles du vrai projet) : application web Laravel pour l'administration et les enseignants, pointage par scan du QR code de la carte étudiant depuis le téléphone de l'enseignant, notification SMS aux parents en cas d'absences répétées.

---

## 1. Acteurs et besoins (étapes 1 et 2)

| Acteur | Besoins (verbe + complément) |
|---|---|
| Enseignant | Ouvrir une séance ; pointer un étudiant ; clôturer la séance ; consulter les présences de ses cours |
| Étudiant | Consulter ses présences et absences ; justifier une absence |
| Agent de scolarité | Gérer les étudiants ; gérer les cours et l'emploi du temps ; valider les justificatifs ; éditer les états d'absences |
| Administrateur | Gérer les comptes et les rôles |
| Service SMS (système externe) | Recevoir les alertes d'absences à envoyer |

## 2. Diagramme de cas d'utilisation

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false

actor "Utilisateur" as U
actor "Enseignant" as E
actor "Étudiant" as ET
actor "Agent de scolarité" as A
actor "Administrateur" as AD
actor "Service SMS" as SMS <<système>>

E --|> U
ET --|> U
A --|> U
AD --|> U

rectangle "Application de pointage" {
  usecase "S'authentifier" as UC0
  usecase "Ouvrir une séance" as UC1
  usecase "Pointer un étudiant" as UC2
  usecase "Vérifier l'inscription\nau cours" as UC2b
  usecase "Clôturer la séance" as UC3
  usecase "Notifier les absences\nrépétées" as UC3b
  usecase "Consulter les présences" as UC4
  usecase "Justifier une absence" as UC5
  usecase "Valider un justificatif" as UC6
  usecase "Gérer les étudiants" as UC7
  usecase "Gérer les cours et\nl'emploi du temps" as UC8
  usecase "Éditer l'état des absences" as UC9
  usecase "Gérer les comptes et rôles" as UC10
}

U --> UC0
E --> UC1
E --> UC2
E --> UC3
E --> UC4
ET --> UC4
ET --> UC5
A --> UC6
A --> UC7
A --> UC8
A --> UC9
AD --> UC10

UC2 ..> UC2b : <<include>>
UC3b ..> UC3 : <<extend>>\n[seuil d'absences atteint]
UC3b --> SMS
@enduml
```

**Commentaire à reprendre dans le mémoire (à adapter) :**
> La figure 2.1 présente les cinq acteurs du système. Les quatre acteurs humains héritent de l'acteur « Utilisateur » : ils doivent tous s'authentifier. Le pointage **inclut** toujours la vérification de l'inscription de l'étudiant au cours, sans laquelle une présence ne peut pas être enregistrée. La notification des absences **étend** la clôture de séance : elle n'a lieu que si le seuil d'absences fixé par la scolarité est atteint, et elle est transmise au service SMS, système externe.

## 3. Description textuelle du cas principal
Voir le modèle « Pointer un étudiant » dans `references/uml.md` §4.4. Il fournit les classes candidates (soulignées ici) : *enseignant, séance, étudiant, cours, inscription, présence, heure, statut (retard)*.

## 4. Diagramme de classes

```plantuml
@startuml
skinparam classAttributeIconSize 0
skinparam shadowing false
hide empty methods

abstract class Utilisateur {
  - email : String
  - motDePasse : String
  - telephone : String
  + seConnecter(email : String, mdp : String) : Boolean
}

class Etudiant {
  - matricule : String
  - nom : String
  - prenom : String
  - dateNaissance : Date
  - telephoneParent : String
  + tauxAbsence(debut : Date, fin : Date) : Float
}

class Enseignant {
  - nom : String
  - prenom : String
  - specialite : String
}

class AgentScolarite
class Administrateur

class Filiere {
  - code : String
  - libelle : String
}

class Cours {
  - code : String
  - intitule : String
  - volumeHoraire : Integer
}

class Seance {
  - date : Date
  - heureDebut : Time
  - heureFin : Time
  - salle : String
  - estCloturee : Boolean
  + ouvrir() : void
  + cloturer() : void
}

class Inscription {
  - anneeAcademique : String
  - dateInscription : Date
}

class Presence {
  - heurePointage : DateTime
  - statut : StatutPresence
}

class Justificatif {
  - motif : String
  - fichier : String
  - dateDepot : Date
  - estValide : Boolean
}

enum StatutPresence {
  PRESENT
  RETARD
  ABSENT
  EXCUSE
}

Utilisateur <|-- Etudiant
Utilisateur <|-- Enseignant
Utilisateur <|-- AgentScolarite
Utilisateur <|-- Administrateur

Filiere "1" -- "*" Etudiant : regroupe >
Filiere "1" -- "*" Cours : propose >
Etudiant "*" -- "*" Cours
(Etudiant, Cours) .. Inscription
Enseignant "1" -- "*" Cours : enseigne >
Cours "1" -- "*" Seance : planifie >
Seance "1" *-- "*" Presence : contient >
Etudiant "1" -- "*" Presence : concerne <
Presence "1" -- "0..1" Justificatif : justifiée par >
Presence ..> StatutPresence
@enduml
```

**Points à savoir expliquer :**
- `Inscription` est une **classe d'association** : la date et l'année d'inscription n'appartiennent ni à l'étudiant seul ni au cours seul.
- `Seance *-- Presence` est une **composition** : une présence n'a pas de sens sans sa séance ; supprimer une séance supprime ses présences.
- `Presence "1" -- "0..1" Justificatif` : une absence peut avoir au plus un justificatif.
- `tauxAbsence()` est une **méthode** (valeur calculée), pas un attribut stocké.
- Les **clés étrangères n'apparaissent pas** : les liens sont portés par les associations.

## 5. Diagramme de séquence : « Pointer un étudiant »

```plantuml
@startuml
skinparam shadowing false
autonumber
actor Enseignant as E
participant ":EcranPointage" as V
participant ":PresenceController" as C
participant ":Inscription" as I
participant ":Presence" as P
database "BD" as DB

E -> V : scanner(QR code)
activate V
V -> C : pointer(matricule, idSeance)
activate C
C -> I : estInscrit(matricule, idSeance)
activate I
I -> DB : SELECT inscription\n(étudiant, cours de la séance)
DB --> I : résultat
I --> C : inscrit : Boolean
deactivate I

alt étudiant non inscrit
  C --> V : erreur("Étudiant non inscrit à ce cours")
else étudiant inscrit
  C -> P : existe(idEtudiant, idSeance)
  activate P
  P -> DB : SELECT presence
  DB --> P : résultat
  P --> C : dejaPointe : Boolean
  deactivate P
  alt déjà pointé
    C --> V : info("Déjà pointé à 08:12")
  else première fois
    C -> C : statut = (heure > début + 15 min) ? RETARD : PRESENT
    C -> P : <<create>> enregistrer(idEtudiant, idSeance, heure, statut)
    activate P
    P -> DB : INSERT presence
    DB --> P : ok
    P --> C : presence
    deactivate P
    C --> V : confirmation(nom, statut)
  end
end
deactivate C
V --> E : afficher le résultat
deactivate V
@enduml
```

**Commentaire type :** le scénario suit l'architecture MVC de l'application. Le contrôleur vérifie d'abord l'inscription (cas inclus « Vérifier l'inscription »), puis l'absence de doublon. Le statut « retard » applique la règle de gestion des 15 minutes. Les deux cas d'erreur du scénario alternatif apparaissent dans les fragments `alt`.

## 6. Diagramme d'activité : processus actuel (analyse de l'existant)

```plantuml
@startuml
skinparam shadowing false
|Enseignant|
start
:Faire circuler la feuille de présence;
|Étudiant|
:Signer la feuille;
|Enseignant|
:Remettre la feuille à la scolarité;
|Agent de scolarité|
:Saisir les présences dans Excel;
if (Feuille illisible ou perdue ?) then (oui)
  :Relancer l'enseignant;
  stop
else (non)
  :Calculer les absences en fin de mois;
endif
:Imprimer l'état des absences;
stop
@enduml
```

À placer en **analyse de l'existant** : les couloirs montrent les manipulations manuelles et les points de perte. Un second diagramme d'activité du **processus cible** fait ressortir ce que l'application supprime (circulation de la feuille, double saisie).

## 7. Diagramme d'états : « Séance »

```plantuml
@startuml
skinparam shadowing false
[*] --> Planifiee
Planifiee --> Ouverte : ouvrir() [heure de début - 10 min atteinte]
Ouverte --> Ouverte : pointer(étudiant)
Ouverte --> Cloturee : cloturer()
Planifiee --> Annulee : annuler() / notifier les étudiants
Cloturee --> [*]
Annulee --> [*]
@enduml
```

Justifie le champ `estCloturee` (ou un champ `statut`) en base, et la règle « on ne pointe pas une séance clôturée ».

## 8. Diagramme de déploiement

```plantuml
@startuml
skinparam shadowing false
node "Téléphone enseignant\n(Android)" as phone {
  artifact "Navigateur\n(PWA de pointage)" as pwa
}
node "Poste scolarité" as poste {
  artifact "Navigateur" as nav
}
node "Serveur VPS (Ubuntu)" as vps {
  node "Nginx" as nginx
  node "PHP-FPM" as php {
    artifact "Application Laravel" as app
  }
  database "MySQL" as db
}
cloud "Passerelle SMS" as sms

pwa --> nginx : HTTPS
nav --> nginx : HTTPS
nginx --> php : FastCGI
app --> db : TCP 3306
app --> sms : HTTPS (API)
@enduml
```

## 9. Passage au modèle relationnel (MLD)

```
filiere(id, code, libelle)
utilisateur(id, type, email, mot_de_passe, telephone)        -- héritage : table unique + type
etudiant(id, #utilisateur_id, #filiere_id, matricule, nom, prenom, date_naissance, telephone_parent)
enseignant(id, #utilisateur_id, nom, prenom, specialite)
cours(id, #filiere_id, #enseignant_id, code, intitule, volume_horaire)
inscription(#etudiant_id, #cours_id, annee_academique, date_inscription)   -- PK (etudiant_id, cours_id, annee_academique)
seance(id, #cours_id, date, heure_debut, heure_fin, salle, est_cloturee)
presence(id, #seance_id, #etudiant_id, heure_pointage, statut)              -- UNIQUE (seance_id, etudiant_id) ; ON DELETE CASCADE sur seance_id
justificatif(id, #presence_id UNIQUE, motif, fichier, date_depot, est_valide)
```

Traces des règles du §9 de `references/uml.md` :
- `Cours "1" — "*" Seance` → `seance.cours_id` ;
- `Etudiant "*" — "*" Cours` + classe d'association → table `inscription` ;
- composition `Seance *-- Presence` → `ON DELETE CASCADE` ;
- `0..1` vers `Justificatif` → `justificatif.presence_id UNIQUE` ;
- règle « pas de double pointage » → contrainte `UNIQUE (seance_id, etudiant_id)`.

**Variante Merise (MCD) de l'association « planifier » :**
`COURS (0,n) —— planifier —— (1,1) SEANCE` : un cours planifie 0 à n séances ; une séance est planifiée pour exactement 1 cours. Dans le MLD, la clé étrangère va du côté (1,1) : `seance.#cours_id`.
