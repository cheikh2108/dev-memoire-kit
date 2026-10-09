# ADR-[NNN] : [Titre court de la décision]

- **Date** : JJ/MM/AAAA
- **Statut** : proposé | accepté | remplacé par ADR-[NNN] | abandonné
- **Décideurs** : [noms / rôles]

## Contexte
[Le problème, les contraintes réelles : équipe, hébergement, budget, délais, volume de données, exigences du client. Ce qui rend une décision nécessaire maintenant.]

## Options étudiées
| Option | Avantages | Inconvénients |
|---|---|---|
| A. [ex. Puppeteer] | [rendu HTML fidèle] | [nécessite Chromium, échoue sur l'hébergement] |
| B. [ex. PDFKit] | [aucune dépendance système] | [mise en page codée à la main] |
| C. [ex. service PDF externe] | [rapide à intégrer] | [coût, données envoyées à un tiers] |

## Décision
[L'option retenue, en une phrase.] Parce que [raisons liées au contexte].

## Conséquences
- Positives : [...]
- Négatives / dettes acceptées : [...]
- Actions : [tâches, documentation, tests à ajouter]

## Liens
[Tickets, PR, documentation, ADR liés]

---

Exemples de décisions qui méritent un ADR : choix de la base (MySQL ou PostgreSQL), stratégie multi-tenant (colonne `tenant_id` ou schéma par tenant), authentification (sessions ou JWT), contournement d'hébergement (versionner `dist/`), remplacement d'une bibliothèque. Dans un mémoire, un ou deux ADR en annexe montrent une démarche d'ingénieur.
