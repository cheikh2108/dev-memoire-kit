# Références visuelles commentées

Des interfaces jugées réussies, avec **ce qui les rend non génériques**. Le but n'est pas de les copier, mais d'en extraire des principes réutilisables. Images dans `assets/references-visuelles/`.

---

## 1. Dashboard monochrome à histogramme dense
`assets/references-visuelles/dashboard-monochrome.png`

Un tableau de bord SaaS : barre latérale à sections, fil d'Ariane, trois cartes d'indicateurs, une grande carte « Sales trend » avec un histogramme en grille de petits carrés.

**Pourquoi ça fonctionne**
- **Presque aucune couleur.** Blanc, gris très clairs, noir. La seule couleur est un vert discret réservé aux variations positives. La couleur a donc un **sens** au lieu d'être décorative.
- **Un graphique qui a une identité.** L'histogramme « pixelisé » (empilement de petits carrés, noir pour les clients existants, gris clair pour les nouveaux) se reconnaît au premier coup d'œil. Une courbe Recharts par défaut n'a pas cette signature.
- **Typographie à deux voix.** Les libellés en petites capitales espacées, dans une police à chasse fixe (TOTAL REVENUE, SALES TREND), s'opposent aux valeurs grandes et grasses. La hiérarchie est lisible sans couleur.
- **Chiffres tabulaires** : les montants s'alignent, ce qui donne une impression de rigueur.
- **Barre latérale légère** : l'élément actif est signalé par un fond blanc, une bordure fine et une ombre très légère, pas par un aplat coloré. La navigation ne domine jamais le contenu.
- **Bordures fines et ombres quasi nulles** : la profondeur vient des surfaces (blanc sur gris très clair), pas des ombres.
- **Détails soignés** : tooltip avec ligne verticale de référence et point noir, contrôle segmenté Weekly / Monthly / Yearly, bouton « … » dans un cercle.

**À ne pas recopier tel quel**
- « +0,94 last year » est ambigu : 0,94 quoi ? Des points, des pourcents ? Toujours une unité (« +9,4 % vs 2024 »).
- Virgule décimale française et symbole dollar mélangés. Choisir une locale cohérente : en contexte sénégalais, `20 320 000 FCFA`, espace comme séparateur de milliers, `Intl.NumberFormat('fr-SN')`.
- Les icônes de la barre latérale sont nombreuses et toutes de même poids. Sur un produit réel, regrouper ou masquer les entrées rarement utilisées.

**Principes à retenir**
1. Une palette neutre + **une** couleur fonctionnelle.
2. Un élément signature (ici le graphique) plutôt que dix effets.
3. Hiérarchie par la typographie (taille, graisse, casse, chasse) avant la couleur.
4. Profondeur par les surfaces, pas par les ombres.

---

## 2. Cartes de cotation avec sparkline
`assets/references-visuelles/cartes-sparkline.png`

Trois cartes blanches : nom + symbole en gris, valeur colorée, variation absolue et en pourcentage, sparkline en aire très légère.

**Pourquoi ça fonctionne**
- **Densité d'information juste** : nom, valeur, variation et tendance en 4 lignes, rien d'autre.
- **Couleur porteuse de sens** : vert = hausse, rouge = baisse, appliquée à la valeur, au pourcentage et à la courbe. Une seule règle, appliquée partout.
- **Le secondaire en gris** : le symbole (BTS) et la variation absolue restent neutres ; seul le pourcentage est coloré.
- **Sparkline sans axes ni grille** : elle montre une tendance, pas des valeurs. Le dégradé de remplissage est à peine visible.
- **Sémantique HTML** : le composant d'origine utilise `<dl>`, `<dt>` et `<dd>`, adaptés à une liste terme / valeur.

**Attention**
- Ne pas compter sur la couleur seule (daltonisme) : garder le signe `+` / `−` ou une flèche.
- Vérifier le contraste du vert sur blanc (WCAG AA). Un vert trop clair échoue.

---

## 3. Carte métrique sombre (« Total orders »)
`assets/references-visuelles/carte-metrique-sombre.png`

Une seule carte en thème sombre : titre et bascule courbe/barres en haut à gauche, chiffre géant « 3.15K », variation « ↑ 66.0% » et sélecteur de période en haut à droite, courbe verte remplie qui occupe les deux tiers droits sur une grille de points, pied de carte « +4 today · 205 peak · 100 low · 166 avg ».

**Pourquoi ça fonctionne**
- **Un seul message, énorme** : le chiffre principal domine, tout le reste est secondaire.
- **Le graphique comme fond** : la courbe occupe la zone droite (62 % de la largeur) et passe derrière le contenu. C'est plus spectaculaire qu'un graphique enfermé dans un cadre.
- **Une seule couleur** (vert émeraude) sur fond quasi noir, reprise par la flèche, le pourcentage et la courbe.
- **La grille de points** discrète donne de la texture sans bruit.
- **Le pied de carte apporte le contexte** (pic, creux, moyenne) en petit et en gris, avec les chiffres en blanc.
- **Composant bien conçu** : props typées, tailles sm/md/lg, état de chargement, formateurs injectables, couleur déduite du sens de la tendance avec une zone « stable » neutre.

**À surveiller**
- Le « 66 % » compare le **premier et le dernier point** de la période, pas la période à la précédente. Pour un indicateur d'affaires, c'est trompeur : préciser le calcul (« vs période précédente ») et le libellé.
- « 3.15K » est la **somme** des points affichés : vérifier que c'est bien la donnée métier voulue (total de commandes) et pas une moyenne.
- Libellés en anglais et nombres au format US : passer en français (« 3,15 k commandes », « 30 derniers jours ») avec `Intl.NumberFormat('fr-SN')`.
- Le vert sur noir doit rester lisible (contraste AA) pour le petit texte.

---

## Ajouter une référence

Pour chaque nouvelle image : nom de fichier descriptif, 3 à 6 raisons concrètes pour lesquelles elle fonctionne, ce qu'il ne faut **pas** reproduire, et les principes réutilisables. Ne pas ajouter de capture d'un produit protégé pour la reproduire à l'identique dans un projet client : s'en servir comme **inspiration de principes**.
