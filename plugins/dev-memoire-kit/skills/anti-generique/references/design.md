# Design : interfaces et diapositives sans « look IA »

Une interface générique se reconnaît à ce qu'elle pourrait appartenir à n'importe quel produit. Les captures d'écran du mémoire et les diapositives de soutenance sont jugées sur la même impression.

## 1. Signes d'une interface générique
- **Dégradé violet → bleu** (ou violet → rose) en fond de héros, texte blanc centré.
- **Trois cartes identiques** avec icône + titre + 2 lignes (« Rapide », « Sécurisé », « Simple »).
- **Emojis** en guise d'icônes dans les titres et les boutons.
- **Glassmorphism** (flou + transparence) partout, ombres portées très douces sur tout.
- Police par défaut (Inter / système) sans hiérarchie : tout en 16px, titres à peine plus gros.
- Coins arrondis identiques (16px+) sur chaque élément, y compris les tableaux.
- Textes d'exemple vides : « Lorem ipsum », « Bienvenue sur notre plateforme innovante », « John Doe ».
- Tableau de bord avec 4 KPI aux chiffres ronds inventés (+12 %, 1 234 utilisateurs).

Pour des exemples positifs commentés (dashboard monochrome, cartes à sparkline), voir `references-visuelles.md`. Pour reproduire une maquette fournie en image, suivre `reproduction-ui.md`. Pour les graphiques, préférer une bibliothèque à tokens (`bibliotheques-ui.md`) à un Recharts par défaut.

## 2. Partir du contexte réel
1. **Qui utilise l'écran, où, sur quel appareil ?** Ex. : un enseignant, debout en salle, sur un smartphone Android d'entrée de gamme, avec une connexion instable. Cela impose : gros boutons, peu de texte, contraste fort, fonctionnement hors ligne ou dégradé.
2. **Quelle est l'action principale de l'écran ?** Elle doit être visible sans défiler et dominer visuellement. Une seule action principale par écran.
3. **Données réalistes** : vrais noms locaux plausibles (Awa Ndiaye, Mamadou Diop), montants en FCFA, dates au format JJ/MM/AAAA, numéros au format sénégalais, cas limites (nom très long, liste vide, erreur réseau).
4. **Identité** : partir de l'identité de la structure (logo, couleurs) s'il y en a une. Sinon, choisir **une** couleur d'accent avec une raison, un neutre, et s'y tenir.

## 3. Règles simples qui suffisent
- Hiérarchie typographique nette : 3 ou 4 tailles maximum (ex. 32 / 20 / 16 / 13), deux graisses.
- Espacements sur une grille (multiples de 4 ou 8 px).
- Contraste suffisant (WCAG AA : 4,5:1 pour le texte normal).
- États prévus et montrés : chargement, vide, erreur, succès.
- Libellés de boutons = verbe + objet (« Valider la présence », pas « OK » ni « Soumettre »).
- Formulaires : libellé au-dessus du champ, message d'erreur sous le champ, en clair.

## 4. Captures d'écran dans le mémoire
- Une capture = une fonctionnalité, recadrée, lisible à l'impression.
- Numérotée et légendée (`Figure 3.4 : Écran de pointage par QR code`), puis **commentée** : ce que fait l'utilisateur, ce que montre l'écran, quelle exigence elle satisfait.
- Données de démonstration réalistes (pas « test test », pas de vraies données personnelles).
- Pas de capture du code d'un IDE en guise de preuve de réalisation : montrer le résultat.

## 5. Diapositives de soutenance
- Une idée par diapositive, titre qui énonce le message (« Le pointage passe de 15 min à 3 min ») plutôt que le thème (« Résultats »).
- Pas de paragraphes ; schémas et captures en grand.
- Thème sobre, cohérent avec la couverture du mémoire ; pas de modèle PowerPoint chargé ni d'animations gratuites.
- Taille du texte ≥ 24 pt ; vérifier la lisibilité au vidéoprojecteur.

## 6. Prompt de design (à adapter)
> Conçois l'écran [nom] d'une application [type] pour [utilisateur précis] qui l'utilise [contexte : lieu, appareil, connexion]. Action principale : [action]. Données à afficher : [liste réelle]. Identité : [couleurs/logo ou « une couleur d'accent sobre »]. Contraintes : texte en français, montants en FCFA, contraste AA, états vide/chargement/erreur. Évite : dégradés violets, cartes identiques à icônes, emojis, glassmorphism, textes marketing, chiffres inventés.
