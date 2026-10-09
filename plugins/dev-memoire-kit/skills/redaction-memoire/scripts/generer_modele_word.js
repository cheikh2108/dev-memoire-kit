#!/usr/bin/env node
/**
 * Génère un modèle Word de mémoire de fin de cycle (licence, informatique).
 *
 * Usage :
 *   node generer_modele_word.js [sortie.docx] [drapeau.png]
 *
 * Structure : celle de mémoires de licence récemment soutenus et validés
 * (plan en trois chapitres, ordre des pages conventionnelles relevé sur ces mémoires).
 *
 * Normes de présentation (guide de l'école) :
 *   Times New Roman 12, interligne 1,5, texte justifié, retrait de première ligne 1,5 cm,
 *   titres 14 gras, notes de bas de page 10 interligne simple,
 *   marges gauche/droite 3,5 cm, haut/bas 2,5 cm, impression recto.
 *   Pagination : rien d'affiché sur la couverture (compte comme I), II, III… (liminaires),
 *   1, 2… (corps, à partir de l'introduction), i, ii… (pages finales).
 *
 * Pour une autre école : modifier l'objet ECOLE ci-dessous puis relancer.
 * Dépendance : paquet npm « docx » (v9).
 */
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageNumber,
  Footer, TableOfContents, StyleLevel, Table, TableRow, TableCell, WidthType,
  BorderStyle, ImageRun, NumberFormat, FootnoteReferenceRun, ShadingType,
  LevelFormat, VerticalAlign,
} = require("docx");

// ---------------------------------------------------------------- Paramètres
const ECOLE = {
  republique: "RÉPUBLIQUE DU SÉNÉGAL",
  devise: "Un Peuple – Un But – Une Foi",
  tutelle: [
    "MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR, DE LA RECHERCHE ET DE L'INNOVATION",
    "DIRECTION GÉNÉRALE DE L'ENSEIGNEMENT SUPÉRIEUR",
    "DIRECTION DE L'ENSEIGNEMENT SUPÉRIEUR PRIVÉ",
  ],
  etablissement: "[NOM DE L'ÉTABLISSEMENT]",
  diplome: "Licence en TÉLÉINFORMATIQUE",
  option: "Génie Logiciel et Administration Réseaux",
  annee: "Année académique 20XX-20XX",
};

const SORTIE = process.argv[2] || "modele-memoire.docx";
const DRAPEAU = process.argv[3]; // PNG facultatif (drapeau du Sénégal)

// ---------------------------------------------------------------- Unités
const cm = (v) => Math.round(v * 567); // 1 cm = 567 twips (DXA)
const PAGE_W = 11906; // A4
const MARGE_LR = cm(3.5);
const LARGEUR_TEXTE = PAGE_W - 2 * MARGE_LR;

// ---------------------------------------------------------------- Aides
const GRIS = "595959";
const p = (text, opts = {}) => new Paragraph({ children: [new TextRun(text)], ...opts });
const centre = (text, run = {}, opts = {}) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    indent: { firstLine: 0 },
    spacing: { line: 276, after: 60 },
    children: [new TextRun({ text, ...run })],
    ...opts,
  });
/** Consigne à supprimer : italique gris entre crochets. */
const consigne = (text) =>
  new Paragraph({ style: "Consigne", children: [new TextRun(`[${text}]`)] });
const titreLiminaire = (text, sautAvant = true) =>
  new Paragraph({ style: "TitreLiminaire", pageBreakBefore: sautAvant, children: [new TextRun(text)] });
const h1 = (text, sautAvant = true) =>
  new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: sautAvant, children: [new TextRun(text)] });
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
const h3 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] });
/** Intertitre de niveau 4, en gras, non numéroté (hors table des matières). */
const h4 = (text) => new Paragraph({ style: "Intertitre", children: [new TextRun(text)] });
const puce = (text, gras) => new Paragraph({
  numbering: { reference: "puces", level: 0 }, indent: { left: 720, hanging: 360, firstLine: 0 },
  children: gras ? [new TextRun({ text: gras, bold: true }), new TextRun(text)] : [new TextRun(text)],
});

const piedDePage = (avecNumero) =>
  new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        indent: { firstLine: 0 },
        children: avecNumero ? [new TextRun({ children: [PageNumber.CURRENT] })] : [],
      }),
    ],
  });

const proprietes = (formatNumero, debut = 1) => ({
  page: {
    size: { width: PAGE_W, height: 16838 },
    margin: { top: cm(2.5), bottom: cm(2.5), left: MARGE_LR, right: MARGE_LR },
    ...(formatNumero ? { pageNumbers: { start: debut, formatType: formatNumero } } : {}),
  },
});

const sansBordure = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
// Ordre imposé par le schéma Word : haut, gauche, bas, droite
const bordures0 = { top: sansBordure, left: sansBordure, bottom: sansBordure, right: sansBordure };
const bordureFine = { style: BorderStyle.SINGLE, size: 4, color: "808080" };
const bordures1 = { top: bordureFine, left: bordureFine, bottom: bordureFine, right: bordureFine };
const bordureCartouche = { style: BorderStyle.SINGLE, size: 12, color: "1F3864" };
const bordures2 = { top: bordureCartouche, left: bordureCartouche, bottom: bordureCartouche, right: bordureCartouche };

/** Cadre bordé (tableau d'une cellule) : les bordures de paragraphe de docx-js
 *  sont écrites dans un ordre refusé par le schéma Word, d'où ce contournement. */
function cadre(texte, run = {}, bordures = bordures1) {
  return new Table({
    width: { size: LARGEUR_TEXTE, type: WidthType.DXA }, columnWidths: [LARGEUR_TEXTE],
    alignment: AlignmentType.CENTER,
    rows: [new TableRow({ children: [new TableCell({
      width: { size: LARGEUR_TEXTE, type: WidthType.DXA }, borders: bordures,
      margins: { top: 120, left: 140, bottom: 120, right: 140 },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, indent: { firstLine: 0 }, spacing: { line: 276 },
        children: [new TextRun({ text: texte, italics: true, color: GRIS, ...run })] })],
    })] })],
  });
}
const espace = (apres = 120) => new Paragraph({ indent: { firstLine: 0 }, spacing: { after: apres, line: 240 }, children: [] });

/**
 * Tableau générique. `lignes` : tableau de tableaux de chaînes ; une ligne de la forme
 * { groupe: "Module : …" } produit une ligne fusionnée en gras (regroupement par module).
 * `poids` : largeur relative des colonnes. `colonneGras` : index de colonne à mettre en gras.
 */
function tableau(entetes, lignes, poids, colonneGras = -1) {
  const total = poids.reduce((a, b) => a + b, 0);
  const w = poids.map((x) => Math.floor((LARGEUR_TEXTE * x) / total));
  w[w.length - 1] = LARGEUR_TEXTE - w.slice(0, -1).reduce((a, b) => a + b, 0);
  const para = (t, gras, align = AlignmentType.LEFT) => new Paragraph({
    indent: { firstLine: 0 }, spacing: { line: 240, after: 40 }, alignment: align,
    children: [new TextRun({ text: t, bold: gras, size: 22 })],
  });
  const cell = (t, i, opts = {}) => new TableCell({
    width: { size: opts.span ? LARGEUR_TEXTE : w[i], type: WidthType.DXA }, borders: bordures1,
    verticalAlign: VerticalAlign.CENTER, margins: { top: 60, left: 100, bottom: 60, right: 100 },
    columnSpan: opts.span, shading: opts.fond ? { type: ShadingType.CLEAR, fill: opts.fond, color: "auto" } : undefined,
    children: String(t).split("\n").map((l) => para(l, !!opts.gras, opts.align)),
  });
  const rows = [new TableRow({ tableHeader: true, children: entetes.map((t, i) => cell(t, i, { gras: true, fond: "D9E2F3" })) })];
  lignes.forEach((l) => {
    if (l.groupe) {
      rows.push(new TableRow({ children: [cell(l.groupe, 0, { span: entetes.length, gras: true, fond: "F2F2F2", align: AlignmentType.CENTER })] }));
    } else {
      rows.push(new TableRow({ children: l.map((t, i) => cell(t, i, { gras: i === colonneGras })) }));
    }
  });
  return new Table({ width: { size: LARGEUR_TEXTE, type: WidthType.DXA }, columnWidths: w, rows });
}

const legendeFigure = (t) => new Paragraph({ style: "LegendeFigure", children: [new TextRun(t)] });
const legendeTableau = (t) => new Paragraph({ style: "LegendeTableau", children: [new TextRun(t)] });
const legendeAnnexe = (t) => new Paragraph({ style: "LegendeAnnexe", children: [new TextRun(t)] });
const figure = (texteCadre, legende) => [espace(120), cadre(texteCadre), legendeFigure(legende)];

// ---------------------------------------------------------------- Couverture
function couverture() {
  const out = [];
  out.push(centre(ECOLE.republique, { bold: true }));
  if (DRAPEAU && fs.existsSync(DRAPEAU)) {
    out.push(new Paragraph({
      alignment: AlignmentType.CENTER, indent: { firstLine: 0 },
      children: [new ImageRun({ type: "png", data: fs.readFileSync(DRAPEAU), transformation: { width: 60, height: 40 },
        altText: { title: "Drapeau", description: "Drapeau du Sénégal", name: "drapeau" } })],
    }));
  }
  out.push(centre(ECOLE.devise, { italics: true }, { spacing: { after: 200, line: 276 } }));
  ECOLE.tutelle.forEach((t) => out.push(centre(t, { bold: true, size: 20 })));
  out.push(espace(120));
  out.push(cadre("[Insérer ici le logo de l'établissement]", { size: 20 }));
  out.push(centre(ECOLE.etablissement, { bold: true }, { spacing: { before: 120, after: 120, line: 276 } }));
  out.push(centre("MÉMOIRE DE FIN DE CYCLE", { bold: true, size: 32 }, { spacing: { before: 200, after: 120, line: 276 } }));
  out.push(new Paragraph({
    alignment: AlignmentType.CENTER, indent: { firstLine: 0 }, spacing: { line: 276 },
    children: [new TextRun("Pour l'obtention de la "), new TextRun({ text: ECOLE.diplome, bold: true })],
  }));
  out.push(new Paragraph({
    alignment: AlignmentType.CENTER, indent: { firstLine: 0 }, spacing: { line: 276, after: 240 },
    children: [new TextRun("Option "), new TextRun({ text: ECOLE.option, bold: true })],
  }));
  out.push(centre("INTITULÉ", { bold: true, underline: {} }, { spacing: { after: 120, line: 276 } }));
  out.push(cadre("[Conception et réalisation d'une plateforme / application de … : cas de …]",
    { bold: true, italics: false, color: "1F3864", size: 28 }, bordures2));
  out.push(espace(360));
  const cellule = (lignes, align) => new TableCell({
    width: { size: LARGEUR_TEXTE / 2, type: WidthType.DXA }, borders: bordures0,
    children: lignes.map(([t, run]) => new Paragraph({ alignment: align, indent: { firstLine: 0 }, spacing: { line: 276, after: 60 }, children: [new TextRun({ text: t, ...run })] })),
  });
  out.push(new Table({
    width: { size: LARGEUR_TEXTE, type: WidthType.DXA },
    columnWidths: [LARGEUR_TEXTE / 2, LARGEUR_TEXTE / 2],
    borders: { ...bordures0, insideHorizontal: sansBordure, insideVertical: sansBordure },
    rows: [new TableRow({ children: [
      cellule([["Présenté et soutenu par :", { bold: true, underline: {} }], ["M./Mme Prénom NOM", {}], ["[autres membres du groupe]", { italics: true, color: GRIS }]], AlignmentType.LEFT),
      cellule([["Sous la direction de :", { bold: true, underline: {} }], ["M./Mme Prénom NOM", {}], ["[Qualité : Ingénieur logiciel…]", { bold: true }]], AlignmentType.RIGHT),
    ] })],
  }));
  out.push(centre(ECOLE.annee, { bold: true }, { spacing: { before: 600, line: 276 } }));
  return out;
}

// ---------------------------------------------------------------- Pages liminaires (II, III…)
const liminaires = [
  titreLiminaire("À la mémoire de", false),
  consigne("Page facultative : la supprimer s'il n'y a personne à y mentionner. Une phrase d'ouverture, les noms, une phrase de clôture. Courte."),
  p("[Prénom NOM]"),

  titreLiminaire("Dédicace"),
  consigne("« Je dédie ce travail à : », puis une puce par personne avec une raison courte et personnelle. Une page au plus."),
  p("Je dédie ce travail à :", { indent: { firstLine: 0 } }),
  puce("[À mes parents, pour …] ;"),
  puce("[À …]."),

  titreLiminaire("Remerciements"),
  consigne("Au « je ». Ordre : directeur de mémoire (ce qui a réellement aidé), structure d'accueil et personnes interrogées, corps enseignant, famille, camarades. Finir par « de près ou de loin »."),
  puce("[M./Mme Prénom NOM, directeur de mémoire, pour …] ;"),
  puce("[…]."),

  titreLiminaire("Résumé"),
  consigne("150 à 250 mots, trois paragraphes : (1) contexte et problème, « C'est dans ce contexte que s'inscrit … » ; (2) objectif, démarche et technologies réellement utilisées ; (3) résultat obtenu et perspective. N'annoncer que ce qui est prouvé dans le mémoire."),
  p("[Paragraphe 1 : contexte et problème.]"),
  p("[Paragraphe 2 : objectif, démarche, technologies.]"),
  p("[Paragraphe 3 : résultat et perspective.]"),
  new Paragraph({ indent: { firstLine: 0 }, children: [new TextRun({ text: "Mots-clés : ", bold: true }), new TextRun("[5 à 8 mots-clés séparés par des virgules]")] }),

  titreLiminaire("Abstract"),
  consigne("Traduction fidèle du résumé, paragraphe par paragraphe, relue (pas de traduction automatique brute)."),
  p("[Abstract, paragraph 1.]"),
  p("[Paragraph 2.]"),
  p("[Paragraph 3.]"),
  new Paragraph({ indent: { firstLine: 0 }, children: [new TextRun({ text: "Keywords: ", bold: true }), new TextRun("[5 to 8 keywords]")] }),

  titreLiminaire("Avant-propos"),
  consigne("Paragraphe 1 : présentation factuelle de l'école (création, domaines, diplômes, reconnaissances CAMES / ANAQ-Sup)."),
  new Paragraph({ children: [
    new TextRun(`Dans le cadre de la ${ECOLE.diplome.replace("Licence", "licence")}, tout étudiant est tenu de produire et de soutenir un mémoire de fin de cycle. C'est dans cette perspective que s'inscrit le présent document, intitulé : `),
    new TextRun({ text: "« [titre du mémoire] »", bold: true }), new TextRun("."),
  ] }),
  consigne("Paragraphe 3 : le sujet en 4 à 6 lignes concrètes (quoi, pour qui, avec quoi), sans superlatifs."),
  p("Ce document constitue notre premier travail de recherche académique ; nous sollicitons de la part du jury son indulgence pour les imperfections qu'il pourrait comporter."),

  titreLiminaire("Glossaire"),
  consigne("Ordre alphabétique. Tous les sigles employés dans le texte, avec leur développement et une définition courte."),
  tableau(["Sigle", "Signification"], [
    ["API", "Application Programming Interface : interface qui permet à deux logiciels d'échanger des données."],
    ["UML", "Unified Modeling Language : langage graphique de modélisation des systèmes logiciels."],
    ["[…]", "[…]"],
  ], [1, 4], 0),

  titreLiminaire("Liste des figures"),
  consigne("Générée automatiquement à partir des légendes de style « Légende figure » (F9 pour mettre à jour). Éviter les logos d'outils numérotés comme figures."),
  new TableOfContents("Liste des figures", { hyperlink: true, stylesWithLevels: [new StyleLevel("LegendeFigure", 1)] }),

  titreLiminaire("Liste des tableaux"),
  consigne("Générée automatiquement à partir des légendes de style « Légende tableau » (F9 pour mettre à jour)."),
  new TableOfContents("Liste des tableaux", { hyperlink: true, stylesWithLevels: [new StyleLevel("LegendeTableau", 1)] }),

  titreLiminaire("Sommaire"),
  consigne("Mis à jour automatiquement (F9). Titres de niveau 1 et 2, de l'introduction à la conclusion générale."),
  new TableOfContents("Sommaire", { hyperlink: true, headingStyleRange: "1-2" }),
];

// ---------------------------------------------------------------- Corps (1, 2…)
const bilan = (texte) => consigne(`Bilan du chapitre (4 à 6 lignes : ce qui a été établi, concrètement) puis transition : ${texte}`);

const corps = [
  h1("Introduction générale", false),
  consigne("Environ 2 pages, 7 ou 8 paragraphes sans intertitres. Poser le problème sans annoncer de résultat."),
  new Paragraph({ children: [
    new TextRun("[Contexte : du général au particulier, à partir d'un fait daté, situé et sourcé]"),
    new FootnoteReferenceRun(1),
    new TextRun("."),
  ] }),
  p("[Constat : les difficultés précises du cas étudié.]"),
  p("[Problématique : « Dès lors, comment concevoir … ? »]"),
  p("[Motivation du choix du sujet.]"),
  p("[Objectif général, et en une phrase les objectifs spécifiques.]"),
  p("[Hypothèse(s) de travail : « Nous supposons que … », vérifiable(s).]"),
  p("[Démarche : enquête (nombre de réponses), entretien, développement.]"),
  p("[Annonce du plan : « Ce mémoire est structuré en trois chapitres. Le premier… Le deuxième… Enfin, le troisième… », avec les titres exacts.]"),

  // ------------------------------------------------------------ Chapitre 1
  h1("Chapitre 1 : Présentation générale"),
  consigne("Introduction du chapitre : le situer et annoncer ses sections dans l'ordre et en nombre exact (« Il s'articule autour de six sections… »)."),
  h2("1.1. Présentation de la structure d'accueil"),
  consigne("Si le projet est mené pour une structure : statut et texte de création, rattachement, missions, service concerné par le projet. Figure possible avec sa source. Sinon, supprimer cette section et renuméroter."),
  h2("1.2. Contexte"),
  consigne("Environ 1 page : tendance générale → situation au Sénégal → cas étudié. Chiffres sourcés uniquement."),
  h2("1.3. Problématique"),
  consigne("Deux paragraphes de constat, puis la question seule sur sa ligne. Ne pas recopier mot pour mot celle de l'introduction."),
  new Paragraph({ alignment: AlignmentType.CENTER, indent: { firstLine: 0 }, children: [new TextRun({ text: "[Comment concevoir … permettant de … tout en garantissant … ?]", bold: true, italics: true })] }),
  h2("1.4. Objectifs"),
  h3("1.4.1. Objectif général"),
  p("L'objectif général de ce mémoire est de concevoir et de réaliser [solution], qui permet à [acteur 1] de … et à [acteur 2] de …"),
  h3("1.4.2. Objectifs spécifiques"),
  consigne("4 ou 5 étapes du travail, chacune « Intitulé : il s'agit de + verbe à l'infinitif »."),
  puce(" il s'agit d'analyser [le processus actuel et les solutions existantes] ;", "Analyse de l'existant :"),
  puce(" il s'agit de recueillir et d'analyser les besoins des utilisateurs ;", "Recueil des besoins :"),
  puce(" il s'agit de modéliser le système avec UML ;", "Modélisation :"),
  puce(" il s'agit de développer [la plateforme / l'application] ;", "Développement :"),
  puce(" il s'agit de vérifier que la solution répond aux exigences.", "Tests et validation :"),
  h2("1.5. Méthodologie"),
  h3("1.5.1. Approche quantitative"),
  consigne("Ce qui a été fait : questionnaire (outil), nombre de réponses exploitables, période, diffusion, profil et biais des répondants, axes. Renvoi : (voir Annexe A)."),
  h3("1.5.2. Approche qualitative"),
  consigne("Entretien(s) (interlocuteur désigné par sa fonction, date, voir Annexe B), observation, analyse de solutions existantes."),
  h2("1.6. Étude de l'existant"),
  h3("1.6.1. [Processus actuel]"),
  consigne("Décrire le processus étape par étape, puis le résumer dans le tableau."),
  legendeTableau("Tableau 1.1 : Processus actuels et difficultés identifiées"),
  tableau(["Processus", "Méthode actuelle", "Difficultés identifiées"], [
    ["[Dépôt du dossier]", "[Dépôt physique au guichet]", "[Déplacements, files d'attente]"],
    ["[…]", "[…]", "[…]"],
  ], [1, 1.3, 1.5]),
  h3("1.6.2. [Solution similaire]"),
  consigne("Présentation, fonctionnalités principales, limites ; une capture avec sa source sous la figure."),
  bilan("« Nous pouvons à présent aborder l'analyse et la conception de la solution, objet du chapitre suivant. »"),

  // ------------------------------------------------------------ Chapitre 2
  h1("Chapitre 2 : Analyse et conception"),
  consigne("Introduction du chapitre : annoncer ses cinq sections dans l'ordre."),
  h2("2.1. Analyse critique de l'existant"),
  h3("2.1.1. [Analyse de l'existant 1]"),
  h3("2.1.2. [Analyse de l'existant 2]"),
  legendeTableau("Tableau 2.1 : Comparaison des solutions existantes"),
  tableau(["Critère", "[Solution A]", "[Solution B]", "Solution proposée"], [
    ["[Suivi en ligne]", "[Non]", "[Oui]", "[Oui]"],
    ["[Paiement mobile]", "[…]", "[…]", "[…]"],
  ], [1.4, 1, 1, 1.1]),
  h3("2.1.3. Insuffisances observées"),
  consigne("Un court paragraphe par insuffisance, relié à ce que la solution apportera."),
  h2("2.2. Étude pour la mise en place de la solution"),
  h3("2.2.1. Résultats de la collecte de données"),
  consigne("Profil des répondants, puis un paragraphe par thème avec pourcentage ET effectif (« 45 répondants sur 54, soit 83,3 % ») et une phrase d'interprétation. Graphiques refaits, pas de capture brute du formulaire."),
  ...figure("[Insérer le graphique]", "Figure 2.1 : [Répartition des répondants selon …]"),
  h3("2.2.2. Analyse des besoins et identification des fonctionnalités"),
  legendeTableau("Tableau 2.2 : Fonctionnalités prioritaires selon les répondants"),
  tableau(["Fonctionnalité", "Répondants (%)"], [["[Suivi de la demande en ligne]", "[87 %]"], ["[…]", "[…]"]], [3, 1]),
  h2("2.3. Identification des acteurs"),
  puce(" [rôle et principales actions].", "[Acteur 1] :"),
  puce(" [rôle et principales actions].", "[Acteur 2] :"),
  h2("2.4. Exigences fonctionnelles et non fonctionnelles"),
  h3("2.4.1. Exigences fonctionnelles"),
  consigne("Codes EF01, EF02… continus et dans l'ordre du tableau. Chaque écran du chapitre 3 renvoie à son EF ; chaque EF cité existe ici."),
  legendeTableau("Tableau 2.3 : Exigences fonctionnelles"),
  tableau(["ID", "Exigence", "Priorité"], [
    { groupe: "Module : [Gestion des utilisateurs]" },
    ["EF01", "Le système doit permettre à l'utilisateur de créer un compte.", "Obligatoire"],
    ["EF02", "Le système doit permettre à l'utilisateur de [verbe à l'infinitif] …", "Importante"],
    { groupe: "Module : [Gestion des demandes]" },
    ["EF03", "Le système doit permettre au [demandeur] de [soumettre une demande en ligne].", "Obligatoire"],
  ], [0.8, 4, 1.3], 0),
  h3("2.4.2. Exigences non fonctionnelles"),
  consigne("Un critère mesurable par exigence, vérifié dans la section 3.4 (catégories : norme ISO/IEC 25010)."),
  legendeTableau("Tableau 2.4 : Exigences non fonctionnelles"),
  tableau(["ID", "Catégorie", "Exigence", "Critère de mesure"], [
    ["ENF01", "Performance", "[Les pages principales se chargent rapidement.]", "[< 2 s en 3G]"],
    ["ENF02", "Sécurité", "[Les mots de passe sont stockés de façon sûre.]", "[Hachage bcrypt]"],
  ], [0.9, 1.3, 2.6, 1.6], 0),
  h2("2.5. Modélisation"),
  consigne("Langage retenu (UML) et pourquoi, outil réellement utilisé, diagrammes présentés et la question à laquelle chacun répond. Pas de figure « logo UML »."),
  h3("2.5.1. Diagrammes de cas d'utilisation"),
  consigne("Un diagramme général, puis un par acteur, chacun précédé d'un paragraphe (cas, include, extend)."),
  ...figure("[Insérer le diagramme]", "Figure 2.2 : Diagramme de cas d'utilisation général"),
  h3("2.5.2. Diagrammes de séquence"),
  consigne("Pour chaque cas important (4 à 6) : intertitre, fiche de description, diagramme de séquence, paragraphe qui lit le diagramme."),
  h4("Cas d'utilisation « [Soumettre une demande] »"),
  legendeTableau("Tableau 2.5 : Description du cas d'utilisation « [Soumettre une demande] »"),
  tableau(["Rubrique", "Contenu"], [
    ["Nom", "[Soumettre une demande]"],
    ["Acteur(s)", "[Demandeur]"],
    ["Objectif", "Permettre au [demandeur] de [déposer une demande en ligne]."],
    ["Préconditions", "[Le demandeur est authentifié.]"],
    ["Scénario nominal", "1. [L'acteur …]\n2. [Le système …]\n3. […]"],
    ["Scénarios alternatifs", "[2a. Libellé (numéro = étape où il naît) :]\n1. [Le système …]\n2. Retour à l'étape [N]."],
    ["Scénarios d'erreur", "[3a. Service indisponible : …]"],
    ["Postconditions", "[La demande est enregistrée avec le statut « En attente ».]"],
  ], [1.3, 4], 0),
  ...figure("[Insérer le diagramme de séquence]", "Figure 2.3 : Diagramme de séquence « [Soumettre une demande] »"),
  h3("2.5.3. Diagramme de classes"),
  consigne("Paragraphe sur les classes principales et leurs relations, puis le diagramme lisible à l'impression (pleine largeur, jamais pivoté)."),
  ...figure("[Insérer le diagramme de classes]", "Figure 2.4 : Diagramme de classes"),
  bilan("« … Nous pouvons à présent aborder la réalisation de la solution. »"),

  // ------------------------------------------------------------ Chapitre 3
  h1("Chapitre 3 : Réalisation de la solution"),
  consigne("Introduction du chapitre : annoncer ses quatre sections dans l'ordre."),
  h2("3.1. Outils et technologies utilisés"),
  consigne("Critères de choix, et pour les choix structurants l'alternative écartée. Un tableau plutôt qu'un logo numéroté par outil."),
  legendeTableau("Tableau 3.1 : Outils et technologies utilisés"),
  tableau(["Catégorie", "Outil (version)", "Usage dans le projet", "Justification"], [
    ["[Framework mobile]", "[Flutter 3.x]", "[Application du demandeur]", "[Un seul code Android et iOS]"],
    ["[Back-end]", "[Laravel 11]", "[API REST, authentification]", "[…]"],
    ["[Base de données]", "[PostgreSQL 16]", "[…]", "[…]"],
    ["[Modélisation]", "[Outil réellement utilisé]", "[Diagrammes UML]", "[…]"],
  ], [1.2, 1.2, 1.5, 1.6]),
  h3("3.1.1. Outils de développement"),
  h3("3.1.2. Langages de programmation"),
  h3("3.1.3. Frameworks et bibliothèques"),
  h2("3.2. Architecture technique"),
  consigne("Type d'architecture et pourquoi. Le texte décrit exactement les couches du schéma."),
  ...figure("[Insérer le schéma d'architecture]", "Figure 3.1 : Architecture technique de la solution"),
  h3("3.2.1. Description des couches"),
  h3("3.2.2. Services tiers et flux de données"),
  h2("3.3. Présentation de la solution"),
  h3("3.3.1. Répartition des flux"),
  consigne("Lister les flux présentés : pages publiques, inscription et authentification, puis un flux par profil."),
  h3("3.3.2. Flux 1 : Inscription et authentification"),
  h4("[Écran de connexion]"),
  ...figure("[Insérer la capture : données fictives, aucun mot de passe visible]", "Figure 3.2 : Écran « [Connexion] »"),
  consigne("Commentaire de 3 à 5 lignes : ce que montre l'écran, l'exigence réalisée (EF01), une règle visible. Écrans secondaires en Annexe C."),
  h3("3.3.3. Flux 2 : [Profil acteur 1]"),
  h3("3.3.4. Flux 3 : [Profil acteur 2]"),
  h2("3.4. Tests et validation"),
  consigne("Obligatoire. Analyse honnête : ce qui échoue et pourquoi, ce qui n'a pas été testé. Taux de réussite ≠ couverture de code."),
  legendeTableau("Tableau 3.2 : Résultats des tests"),
  tableau(["Module testé", "Type de test", "Nombre de tests", "Réussis", "Taux de réussite"], [
    ["[ReservationService]", "Unitaire", "[24]", "[24]", "[100 %]"],
    ["[Routes /api/reservations]", "Intégration", "[12]", "[11]", "[91,7 %]"],
    ["Total", "", "[36]", "[35]", "[97,2 %]"],
  ], [1.8, 1.1, 1, 0.9, 1.1]),
  legendeTableau("Tableau 3.3 : Recette fonctionnelle"),
  tableau(["Cas de test", "Exigence", "Résultat attendu", "Résultat obtenu", "Statut"], [
    ["CT01", "EF03", "[Numéro de suivi affiché]", "[Conforme]", "[Validé]"],
  ], [0.9, 0.9, 2, 1.6, 0.9]),
  bilan("pas de transition, la conclusion générale suit."),

  h1("Conclusion générale"),
  consigne("1 à 1,5 page, cinq paragraphes."),
  p("[1. Rappel du problème, de la question et de l'objectif.]"),
  p("[2. Démarche : « Nous avons d'abord…, ensuite…, avant de… ».]"),
  p("[3. Résultats et réponse à la problématique ; hypothèses confirmées ou non, avec la preuve (section 3.4).]"),
  p("[4. Difficultés et limites, honnêtes et précises.]"),
  p("[5. Perspectives réalistes (court, moyen, long terme).]"),
];

// ---------------------------------------------------------------- Pages finales (i, ii…)
const finales = [
  titreLiminaire("Bibliographie", false),
  consigne("Documents réellement consultés, ordre alphabétique par auteur, chacun cité au moins une fois dans le texte."),
  new Paragraph({ style: "SousTitreBiblio", children: [new TextRun("Ouvrages")] }),
  new Paragraph({ indent: { firstLine: 0, left: 567, hanging: 567 }, children: [
    new TextRun("NOM Prénom, "), new TextRun({ text: "Titre de l'ouvrage", italics: true }), new TextRun(", Ville, Éditeur, année, nombre de pages."),
  ] }),
  new Paragraph({ style: "SousTitreBiblio", children: [new TextRun("Mémoires")] }),
  new Paragraph({ indent: { firstLine: 0, left: 567, hanging: 567 }, children: [
    new TextRun("NOM Prénom, "), new TextRun({ text: "Titre du mémoire", italics: true }), new TextRun(", Mémoire de licence en [filière], [établissement], [ville], [année académique], [nombre] pages."),
  ] }),
  titreLiminaire("Webographie"),
  consigne("Liste numérotée : organisme ou auteur, titre de la page, date de consultation, URL. Vérifier que chaque numéro appelé dans le texte renvoie à la bonne entrée."),
  new Paragraph({ indent: { firstLine: 0, left: 567, hanging: 567 }, children: [
    new TextRun("1. [Organisme]. "), new TextRun({ text: "[Titre de la page]", italics: true }), new TextRun(". [En ligne]. [Consulté le JJ mois AAAA]. https://…"),
  ] }),
  titreLiminaire("Annexes"),
  consigne("Chaque annexe est appelée dans le texte. Figures d'annexe numérotées A.1, B.1, C.1… (jamais « Figure 0.x »)."),
  new Paragraph({ style: "SousTitreBiblio", children: [new TextRun("Annexe A : Questionnaire et résultats de l'enquête")] }),
  consigne("Le questionnaire vierge, puis les graphiques des résultats."),
  new Paragraph({ style: "SousTitreBiblio", children: [new TextRun("Annexe B : Guide d'entretien")] }),
  consigne("Interlocuteur (fonction), date, puis tableau N° | Question | Réponse."),
  new Paragraph({ style: "SousTitreBiblio", children: [new TextRun("Annexe C : Interfaces supplémentaires")] }),
  cadre("[Capture d'écran secondaire]"),
  legendeAnnexe("Figure C.1 : [Écran …]"),
  titreLiminaire("Table des matières"),
  consigne("Mise à jour juste avant l'impression : clic droit > Mettre à jour les champs > Mettre à jour toute la table (ou F9)."),
  new TableOfContents("Table des matières", { hyperlink: true, headingStyleRange: "1-3", useAppliedParagraphOutlineLevel: true }),
];

// ---------------------------------------------------------------- Document
const doc = new Document({
  creator: "dev-memoire-kit",
  title: "Modèle de mémoire de fin de cycle",
  description: "Modèle de mémoire de licence en informatique, plan en trois chapitres",
  features: { updateFields: true },
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 24 }, paragraph: { spacing: { line: 360 } } },
    },
    paragraphStyles: [
      { id: "Normal", name: "Normal", run: { font: "Times New Roman", size: 24 },
        paragraph: { alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, after: 120 }, indent: { firstLine: cm(1.5) } } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true },
        paragraph: { alignment: AlignmentType.CENTER, indent: { firstLine: 0 }, spacing: { before: 240, after: 360 }, keepNext: true, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true },
        paragraph: { alignment: AlignmentType.LEFT, indent: { firstLine: 0 }, spacing: { before: 240, after: 120 }, keepNext: true, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true },
        paragraph: { alignment: AlignmentType.LEFT, indent: { firstLine: 0 }, spacing: { before: 200, after: 120 }, keepNext: true, outlineLevel: 2 } },
      { id: "Intertitre", name: "Intertitre (niveau 4)", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { bold: true }, paragraph: { indent: { firstLine: 0 }, spacing: { before: 160, after: 80 }, keepNext: true } },
      { id: "TitreLiminaire", name: "Titre liminaire", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true },
        paragraph: { alignment: AlignmentType.CENTER, indent: { firstLine: 0 }, spacing: { before: 240, after: 360 }, keepNext: true, outlineLevel: 0 } },
      { id: "SousTitreBiblio", name: "Sous-titre bibliographie", basedOn: "Normal", next: "Normal",
        run: { bold: true }, paragraph: { indent: { firstLine: 0 }, spacing: { before: 200, after: 80 }, keepNext: true } },
      { id: "Consigne", name: "Consigne (à supprimer)", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { italics: true, color: GRIS, size: 22 }, paragraph: { indent: { firstLine: 0 }, spacing: { line: 276, after: 120 } } },
      { id: "LegendeFigure", name: "Légende figure", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { italics: true, size: 22 }, paragraph: { alignment: AlignmentType.CENTER, indent: { firstLine: 0 }, spacing: { before: 60, after: 240, line: 276 } } },
      { id: "LegendeTableau", name: "Légende tableau", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { italics: true, size: 22 }, paragraph: { alignment: AlignmentType.CENTER, indent: { firstLine: 0 }, spacing: { before: 240, after: 60, line: 276 }, keepNext: true } },
      { id: "LegendeAnnexe", name: "Légende annexe", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { italics: true, size: 22 }, paragraph: { alignment: AlignmentType.CENTER, indent: { firstLine: 0 }, spacing: { before: 60, after: 240, line: 276 } } },
      { id: "FootnoteText", name: "footnote text", basedOn: "Normal",
        run: { size: 20 }, paragraph: { alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 0 }, spacing: { line: 240, after: 0 } } },
    ],
  },
  numbering: {
    config: [{ reference: "puces", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }],
  },
  footnotes: {
    1: { children: [new Paragraph({ style: "FootnoteText", children: [new TextRun("Exemple de note de bas de page : Organisme, Titre de la page ou du rapport, année. Taille 10, interligne simple.")] })] },
  },
  sections: [
    { properties: proprietes(null), footers: { default: piedDePage(false) }, children: couverture() },
    { properties: proprietes(NumberFormat.UPPER_ROMAN, 2), footers: { default: piedDePage(true) }, children: liminaires },
    { properties: proprietes(NumberFormat.DECIMAL, 1), footers: { default: piedDePage(true) }, children: corps },
    { properties: proprietes(NumberFormat.LOWER_ROMAN, 1), footers: { default: piedDePage(true) }, children: finales },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(SORTIE, buf);
  console.log(`Modèle écrit : ${path.resolve(SORTIE)}`);
});
