# Postmortem : [titre court et factuel]

> Sans recherche de coupable : on décrit des faits, des décisions prises avec l'information du moment, et des failles de système ou de processus. Aucune donnée permettant d'identifier un utilisateur.

- **Date de l'incident** : JJ/MM/AAAA, de HH:MM à HH:MM (heure de Dakar, UTC+0)
- **Rédacteurs** : [rôles]
- **Statut** : brouillon | relu | actions terminées
- **Gravité** : [ex. S1 service indisponible / S2 fonctionnalité majeure dégradée / S3 gêne limitée]

## Résumé
[3 à 5 lignes : ce qui s'est passé, l'impact, comment c'est résolu.]

## Impact
- Utilisateurs ou tenants touchés : [nombre, lesquels]
- Durée : [début → détection → résolution]
- Données : [perte ? corruption ? aucune ?]
- Impact métier : [paiements bloqués, rapports non générés, SLA client…]

## Chronologie
| Heure | Événement |
|---|---|
| 09:02 | Déploiement de la version X |
| 09:15 | Premier signalement client (WhatsApp) |
| 09:20 | Confirmation : génération PDF en erreur 500 |
| 09:31 | Retour à la version précédente |
| 09:35 | Service rétabli |

## Causes
- **Déclencheur** : [le changement ou l'événement qui a provoqué l'incident]
- **Cause racine** : [pourquoi c'était possible. Poser « pourquoi ? » plusieurs fois.]
- **Facteurs aggravants** : [absence de surveillance, pas de test de fumée, documentation manquante…]

Exemple (incident réel, reformulé) : *Déclencheur* : export PDF en échec après la mise en ligne. *Cause racine* : Puppeteer a besoin de Chromium, absent de l'hébergement ; le build local ne reproduisait pas l'environnement. *Facteur aggravant* : pas de test de fumée sur l'export après déploiement.

## Ce qui a bien fonctionné
[Détection rapide, retour arrière simple, bonne communication…]

## Ce qui a mal fonctionné
[…]

## Où nous avons eu de la chance
[…]

## Actions
| Action | Type (prévenir / détecter / atténuer) | Responsable | Échéance | Suivi |
|---|---|---|---|---|
| Remplacer Puppeteer par PDFKit | prévenir | [nom] | JJ/MM | ticket #… |
| Ajouter l'export PDF aux tests de fumée post-déploiement | détecter | [nom] | JJ/MM | … |
| Ajouter une sonde sur `/up` avec alerte | détecter | [nom] | JJ/MM | … |

## Leçons
[1 à 3 leçons réutilisables par l'équipe.]
