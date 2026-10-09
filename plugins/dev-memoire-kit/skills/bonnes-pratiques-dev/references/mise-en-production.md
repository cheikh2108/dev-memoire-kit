# Mise en production et incidents

Checklist construite à partir de sources officielles (consultées le 08/10/2026, liste en fin de fichier) et des incidents réels de déploiement relevés dans la bibliothèque de prompts de l'équipe. Les commandes évoluent avec les versions : vérifier la documentation de la version installée.

## 1. Avant de déployer

### Code et tests
- [ ] La branche à déployer a passé la revue (`checklist-revue.md`) et les tests automatisés sont verts.
- [ ] Le build tourne **dans les mêmes conditions que la production** (version de PHP/Node, CommonJS ou ESM, mémoire et temps de build de l'hébergeur). Incidents réels : délai de compilation `tsc` dépassé sur l'hébergeur, Chromium absent pour Puppeteer, paquet ESM-only importé en CommonJS.
- [ ] Dépendances auditées (`composer audit`, `npm audit`) ; fichiers de verrouillage (`composer.lock`, `package-lock.json`) commités.

### Base de données
- [ ] Migrations relues : **aucune opération destructive** sans plan (voir `base-de-donnees.md` §4, méthode *expand / contract*).
- [ ] **Sauvegarde faite juste avant** le déploiement, et **restauration testée** récemment (une sauvegarde jamais restaurée n'est pas une sauvegarde).
- [ ] Prisma : seulement `prisma migrate deploy` en production. Jamais `migrate dev` ni `migrate reset`, qui sont réservés au développement. Attention : `migrate deploy` ne détecte pas les écarts (*drift*) dus à des modifications manuelles de la base.
- [ ] Laravel : `php artisan migrate --force` (le `--force` est nécessaire en production) ; jamais `migrate:fresh` ni `migrate:refresh`.

### Configuration et secrets
- [ ] Variables d'environnement de production complètes (comparer avec `.env.example`).
- [ ] **Mode debug désactivé** : `APP_DEBUG=false` (Laravel), `NODE_ENV=production`. Avec le debug actif, des valeurs de configuration sensibles peuvent s'afficher aux utilisateurs.
- [ ] Aucun secret dans le dépôt ni dans le front (variables `NEXT_PUBLIC_` et `VITE_` publiques).
- [ ] CORS limité aux origines réelles (pas de `*` avec identifiants).
- [ ] HTTPS actif, certificat valide et renouvellement automatique.

### Serveur (Laravel sur VPS ou mutualisé)
- [ ] La racine web pointe sur `public/`. Ne jamais déplacer `index.php` à la racine du projet : cela exposerait des fichiers de configuration sensibles.
- [ ] En-têtes `X-Frame-Options: SAMEORIGIN` et `X-Content-Type-Options: nosniff` ; fichiers cachés interdits sauf `.well-known`.
- [ ] `storage/` et `bootstrap/cache/` accessibles en écriture par l'utilisateur du serveur web, et rien de plus.
- [ ] Gestionnaire de processus (Supervisor, PM2) pour les workers de files et les processus longs.

### Communication
- [ ] Créneau choisi (hors heures de pointe des utilisateurs), client ou équipe prévenus si une interruption est possible.
- [ ] Plan de retour arrière écrit : version précédente prête à redéployer, migration inverse ou restauration.

## 2. Déployer

### Laravel (séquence type)
```bash
php artisan down --retry=60          # si la migration impose une interruption
git pull                              # ou déploiement de l'artefact
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize                  # config, events, routes, vues en cache
php artisan reload                    # Laravel 12 : redémarre workers, Reverb, Octane (sinon : php artisan queue:restart)
php artisan up
```
Piège : après `config:cache`, le fichier `.env` n'est plus lu. `env()` ne doit être appelé **que dans les fichiers de `config/`**, jamais dans le code applicatif.

### NestJS + Prisma (séquence type)
```bash
npm ci
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 reload ecosystem.config.js        # ou redémarrage par l'hébergeur
```
Si l'hébergeur ne permet pas de compiler (cas réel sur Hostinger Web Apps), construire `dist/` en CI et déployer l'artefact. C'est plus sûr que de commiter `dist/` à la main. Documenter le choix dans un ADR.

### Déploiement sans interruption (quand c'est nécessaire)
Répertoire par release + lien symbolique `current` (Deployer, Envoyer, Forge ou script maison), migrations compatibles avec l'ancienne **et** la nouvelle version du code, bascule du lien, rechargement de PHP-FPM.

## 3. Juste après
- [ ] **Route de santé** : Laravel expose `/up` (200 si l'application démarre, 500 sinon). On peut y ajouter des vérifications (base, cache) via l'événement `DiagnosingHealth`. Côté NestJS : `@nestjs/terminus`.
- [ ] **Tests de fumée** à la main ou automatisés sur les 3 à 5 parcours critiques : connexion, action principale, paiement, export PDF.
- [ ] Logs et suivi d'erreurs surveillés pendant 30 minutes (Sentry, logs du serveur).
- [ ] Les tâches planifiées (`schedule:run` dans le cron) et les workers de file tournent.
- [ ] Note de version envoyée (ce qui change pour les utilisateurs).

## 4. En continu
- **Sauvegardes** selon la règle **3-2-1** : 3 copies, sur 2 supports différents, dont 1 **hors ligne** ou immuable. Ajouter une copie hors du site d'hébergement et des **tests de restauration réguliers** avec une procédure écrite. Chiffrer les sauvegardes stockées hors de votre contrôle et savoir qui détient les clés.
- Définir le **RPO** (perte de données acceptable, par ex. 24 h → sauvegarde quotidienne) et le **RTO** (durée d'interruption acceptable), et vérifier que la restauration tient dans ce délai.
- **Surveillance** : disponibilité (sonde externe sur `/up`), taux d'erreurs 5xx, espace disque, expiration du certificat, échecs des tâches en file.
- **Mises à jour** de sécurité régulières (OS, PHP/Node, dépendances).
- **Sécurité applicative** : se référer à OWASP ASVS (version 5.0) comme liste de vérification, au niveau adapté à la sensibilité des données.

## 5. Données personnelles (Sénégal)
- Les traitements de données personnelles (fichiers clients, usagers, élèves, patients, personnel ; biométrie, vidéosurveillance, géolocalisation, prospection par SMS ou e-mail, transfert de données à l'étranger) doivent faire l'objet d'une **déclaration préalable** auprès de la Commission de Protection des Données Personnelles (CDP), en application de la loi n° 2008-12. Vérifier les formalités à jour auprès de la CDP (déclaration ou autorisation selon le traitement).
- Hébergement hors du Sénégal (Hostinger, Neon, AWS…) = **transfert de données à l'étranger** : à mentionner dans la déclaration et dans les conditions d'utilisation.
- Ne jamais copier les données de production en développement sans les anonymiser.

## 6. Quand un incident arrive
1. **Stabiliser d'abord** : retour à la version précédente, mode maintenance, désactivation de la fonctionnalité fautive. On comprend après.
2. **Communiquer** : un responsable de l'incident, un canal unique, un message au client avec l'impact et la prochaine mise à jour.
3. **Garder une chronologie** (heures, actions, observations) pendant l'incident.
4. **Rédiger un postmortem** (`../assets/modele-postmortem.md`) si l'un de ces critères est rempli (à fixer à l'avance) :
   - interruption ou dégradation visible par les utilisateurs au-delà d'un seuil ;
   - **toute perte de données** ;
   - intervention manuelle nécessaire (retour arrière, correctif en urgence) ;
   - résolution plus longue qu'un seuil ;
   - incident découvert par un utilisateur plutôt que par la surveillance.
5. **Postmortem sans recherche de coupable** : on suppose que chacun a agi de bonne foi avec les informations disponibles. On corrige les systèmes et les processus, pas les personnes. Chaque postmortem est relu, partagé et suivi d'actions avec un responsable et une date. Aucune donnée permettant d'identifier un utilisateur n'y figure.

## Sources
- [Laravel 12.x — Deployment](https://laravel.com/docs/12.x/deployment) (la documentation signale qu'une version 13.x existe : vérifier les changements)
- [Prisma ORM v6 — Development and production](https://www.prisma.io/docs/orm/v6/prisma-migrate/workflows/development-and-production)
- [Google SRE Book — Postmortem Culture: Learning from Failure](https://sre.google/sre-book/postmortem-culture/) et [SRE Workbook — Postmortem Culture](https://sre.google/workbook/postmortem-culture/)
- ANSSI, *Sauvegarde des systèmes d'information – Les fondamentaux* (2023), résumé par [IT-Connect](https://www.it-connect.fr/les-fondamentaux-pour-la-sauvegarde-dun-si-dapres-lanssi/)
- [OWASP ASVS](https://owasp.org/www-project-ASVS/) (version stable 5.0.0)
- CDP Sénégal : communiqué sur l'obligation de déclaration préalable ([Osiris, 2013](https://osiris.sn/les-organismes-invites-a-declarer-le-traitement-des-donnees-personnelles.html)) ; activité récente de la CDP ([CIO Mag, 2024](https://cio-mag.com/senegal-deja-109-dossiers-traites-par-la-commission-de-protection-des-donnees-personnelles-en-2024))
