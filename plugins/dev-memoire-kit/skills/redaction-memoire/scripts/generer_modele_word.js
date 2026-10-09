#!/usr/bin/env node
/**
 * Génère un modèle Word de mémoire de fin de cycle aux normes de l'école.
 *
 * Usage :
 *   node generer_modele_word.js [sortie.docx] [drapeau.png]
 *
 * Normes appliquées (guide TEC L3 GLAR) :
 *   Times New Roman 12, interligne 1,5, texte justifié, retrait de première ligne 1,5 cm,
 *   titres 14 gras, notes de bas de page 10 interligne simple,
 *   marges gauche/droite 3,5 cm, haut/bas 2,5 cm, impression recto.
 *   Pagination : rien sur couverture/garde, I, II… (liminaires), 01, 02… (corps),
 *   i, ii… (pages finales), rien sur résumé/abstract/errata.
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
  sigle: "[SIGLE]",
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
const puce = (text) => new Paragraph({ numbering: { reference: "puces", level: 0 }, indent: { left: 720, hanging: 360, firstLine: 0 }, children: [new TextRun(text)] });

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

const proprietes = (formatNumero) => ({
  page: {
    size: { width: PAGE_W, height: 16838 },
    margin: { top: cm(2.5), bottom: cm(2.5), left: MARGE_LR, right: MARGE_LR },
    ...(formatNumero ? { pageNumbers: { start: 1, formatType: formatNumero } } : {}),
  },
});

const sansBordure = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
// Ordre imposé par le schéma Word : haut, gauche, bas, droite
const bordures0 = { top: sansBordure, left: sansBordure, bottom: sansBordure, right: sansBordure };
const bordureFine = { style: BorderStyle.SINGLE, size: 4, color: "808080" };
const bordures1 = { top: bordureFine, left: bordureFine, bottom: bordureFine, right: bordureFine };

/** Cadre bordé (tableau d'une cellule) : les bordures de paragraphe de docx-js
 *  sont écrites dans un ordre refusé par le schéma Word, d'où ce contournement. */
function cadre(texte, run = {}) {
  return new Table({
    width: { size: LARGEUR_TEXTE, type: WidthType.DXA }, columnWidths: [LARGEUR_TEXTE],
    alignment: AlignmentType.CENTER,
    rows: [new TableRow({ children: [new TableCell({
      width: { size: LARGEUR_TEXTE, type: WidthType.DXA }, borders: bordures1,
      margins: { top: 80, left: 100, bottom: 80, right: 100 },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, indent: { firstLine: 0 }, spacing: { line: 240 },
        children: [new TextRun({ text: texte, italics: true, color: GRIS, ...run })] })],
    })] })],
  });
}
const espace = (apres = 120) => new Paragraph({ indent: { firstLine: 0 }, spacing: { after: apres, line: 240 }, children: [] });

// ---------------------------------------------------------------- Couverture / garde
function couverture(titrePage) {
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
  ECOLE.tutelle.forEach((t) => out.push(centre(t, { size: 20 })));
  out.push(centre(ECOLE.etablissement, { bold: true }, { spacing: { before: 120, after: 120, line: 276 } }));
  // Emplacement du logo
  out.push(cadre("[Insérer ici le logo de l'établissement]", { size: 20 }));
  out.push(espace(120));
  out.push(centre("MÉMOIRE DE FIN DE CYCLE", { bold: true, size: 32 }, { spacing: { before: 240, after: 120, line: 276 } }));
  out.push(new Paragraph({
    alignment: AlignmentType.CENTER, indent: { firstLine: 0 }, spacing: { line: 276 },
    children: [new TextRun("Pour l'obtention de la "), new TextRun({ text: ECOLE.diplome, bold: true })],
  }));
  out.push(new Paragraph({
    alignment: AlignmentType.CENTER, indent: { firstLine: 0 }, spacing: { line: 276, after: 360 },
    children: [new TextRun("Option "), new TextRun({ text: ECOLE.option, bold: true })],
  }));
  out.push(centre("INTITULÉ", { bold: true, underline: {} }, { spacing: { after: 120, line: 276 } }));
  out.push(new Paragraph({
    alignment: AlignmentType.CENTER, indent: { firstLine: 0 }, spacing: { after: 480, line: 276 },
    border: { top: bordureFine, bottom: bordureFine },
    children: [new TextRun({ text: "[Titre exact du sujet de mémoire]", bold: true, size: 28 })],
  }));
  const cellule = (lignes, align) => new TableCell({
    width: { size: LARGEUR_TEXTE / 2, type: WidthType.DXA }, borders: bordures0,
    children: lignes.map(([t, run]) => new Paragraph({ alignment: align, indent: { firstLine: 0 }, spacing: { line: 276, after: 60 }, children: [new TextRun({ text: t, ...run })] })),
  });
  out.push(new Table({
    width: { size: LARGEUR_TEXTE, type: WidthType.DXA },
    columnWidths: [LARGEUR_TEXTE / 2, LARGEUR_TEXTE / 2],
    borders: { ...bordures0, insideHorizontal: sansBordure, insideVertical: sansBordure },
    rows: [new TableRow({ children: [
      cellule([["Présenté et soutenu par :", { bold: true, underline: {} }], ["M./Mme/Mlle Prénom NOM", {}], ["[autres membres du groupe]", { italics: true, color: GRIS }]], AlignmentType.LEFT),
      cellule([["Sous la direction de :", { bold: true, underline: {} }], ["M./Mme Prénom NOM", {}], ["Grade / Spécialité", { italics: true }]], AlignmentType.RIGHT),
    ] })],
  }));
  out.push(centre(ECOLE.annee, { bold: true }, { spacing: { before: 720, line: 276 } }));
  out.push(centre(`(${titrePage} : supprimer cette mention)`, { italics: true, color: GRIS, size: 18 }));
  return out;
}

// ---------------------------------------------------------------- Pages liminaires
const liminaires = [
  titreLiminaire("À la mémoire de", false),
  consigne("Page facultative. Personnes ayant contribué à votre éducation, votre formation ou votre réussite et qui ne sont plus là. Courte et sobre."),
  p("Prénom NOM"),
  titreLiminaire("Dédicace"),
  consigne("Hommage bref et sobre (3 à 6 lignes) à une ou quelques personnes. Personnalisez : évitez la formule toute faite reprise dans tous les mémoires."),
  titreLiminaire("Remerciements"),
  consigne("Commencer par le directeur de recherche et la structure d'accueil, puis les personnes interrogées, le corps professoral, la famille. Nommer précisément (fonction + nom)."),
  puce("M./Mme Prénom NOM, [fonction], pour …"),
  puce("…"),
  titreLiminaire("Avant-propos"),
  consigne("Paragraphe 1 (environ 7 lignes) : présentation factuelle de l'école (création, domaines, diplômes, reconnaissances)."),
  new Paragraph({ children: [
    new TextRun(`Pour l'obtention de la ${ECOLE.diplome.replace("Licence", "licence")}, l'${ECOLE.sigle} exige des étudiants la rédaction d'un mémoire de fin de cycle. C'est dans ce cadre que nous avons élaboré ce document qui a pour sujet : `),
    new TextRun({ text: "[sujet en gras]", bold: true }), new TextRun("."),
  ] }),
  consigne("Paragraphe 3 : explication concrète du sujet (quoi, pour qui, avec quoi), sans superlatifs."),
  p("Ce document constitue notre premier travail de recherche académique, c'est pourquoi nous sollicitons de la part du jury beaucoup d'indulgence pour ce qui concerne son évaluation."),
  titreLiminaire("Sommaire"),
  consigne("Mis à jour automatiquement : clic droit > Mettre à jour les champs (ou F9). Il reprend les titres de niveau 1 et 2."),
  new TableOfContents("Sommaire", { hyperlink: true, headingStyleRange: "1-2" }),
  titreLiminaire("Glossaire"),
  consigne("Liste alphabétique des sigles et termes techniques. Vérifier l'orthographe de chaque développement."),
  ...[["API", "Application Programming Interface (interface de programmation)"], ["MVC", "Modèle-Vue-Contrôleur"], ["UML", "Unified Modeling Language"]]
    .map(([s, d]) => new Paragraph({ indent: { firstLine: 0 }, children: [new TextRun({ text: `${s} : `, bold: true }), new TextRun(d)] })),
  titreLiminaire("Liste des figures"),
  consigne("Générée automatiquement à partir des légendes de style « Légende figure » (F9 pour mettre à jour)."),
  new TableOfContents("Liste des figures", { hyperlink: true, stylesWithLevels: [new StyleLevel("LegendeFigure", 1)] }),
  titreLiminaire("Liste des tableaux"),
  consigne("Générée automatiquement à partir des légendes de style « Légende tableau » (F9 pour mettre à jour)."),
  new TableOfContents("Liste des tableaux", { hyperlink: true, stylesWithLevels: [new StyleLevel("LegendeTableau", 1)] }),
];

// ---------------------------------------------------------------- Corps
const legendeFigure = (t) => new Paragraph({ style: "LegendeFigure", children: [new TextRun(t)] });
const legendeTableau = (t) => new Paragraph({ style: "LegendeTableau", children: [new TextRun(t)] });

function tableauTechnologies() {
  const w = [Math.round(LARGEUR_TEXTE * 0.22), Math.round(LARGEUR_TEXTE * 0.24), Math.round(LARGEUR_TEXTE * 0.24)];
  w.push(LARGEUR_TEXTE - w[0] - w[1] - w[2]);
  const cell = (t, i, entete) => new TableCell({
    width: { size: w[i], type: WidthType.DXA }, borders: bordures1, verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, left: 100, bottom: 60, right: 100 },
    shading: entete ? { type: ShadingType.CLEAR, fill: "E7E6E6", color: "auto" } : undefined,
    children: [new Paragraph({ indent: { firstLine: 0 }, spacing: { line: 240 }, alignment: AlignmentType.LEFT, children: [new TextRun({ text: t, bold: !!entete, size: 22 })] })],
  });
  const ligne = (vals, entete) => new TableRow({ tableHeader: !!entete, children: vals.map((v, i) => cell(v, i, entete)) });
  return new Table({
    width: { size: LARGEUR_TEXTE, type: WidthType.DXA }, columnWidths: w,
    rows: [
      ligne(["Couche", "Technologie (version)", "Rôle", "Justification"], true),
      ligne(["Back-end", "[ex. Laravel 11]", "[API, règles métier]", "[critère réel du choix]"]),
      ligne(["Base de données", "[ex. MySQL 8]", "[données relationnelles]", "[…]"]),
      ligne(["Front / mobile", "[…]", "[…]", "[…]"]),
    ],
  });
}

const section = (num, titre, consignes) => [h3(`${num} ${titre}`), ...consignes.map(consigne)];
const structureSection = [
  "Petite introduction : annoncer les paragraphes de la section.",
  "Paragraphes : idée générale → arguments → exemples tirés du cas réel → connecteurs logiques.",
  "Une phrase de conclusion + une phrase de transition vers la section suivante (pas d'empilement « En résumé… En conclusion… En somme… »).",
];

const corps = [
  h1("Introduction générale", false),
  consigne("Les 7 paragraphes obligatoires, sans sous-titres. Ne rien affirmer : poser le problème (loi du suspens)."),
  new Paragraph({ children: [
    new TextRun({ text: "Contextualisation. ", bold: true }),
    new TextRun("[Du général au particulier : partir d'un fait daté et situé, finir sur le cas précis étudié]"),
    new FootnoteReferenceRun(1),
    new TextRun("."),
  ] }),
  p("[Problématique : le constat, puis la question principale sous forme interrogative.]"),
  p("[Objectifs : un objectif général, puis 3 à 5 objectifs spécifiques avec un verbe d'action.]"),
  p("[Motivation du choix du sujet : « Si nous avons choisi ce sujet, c'est parce que… »]"),
  p("[Hypothèses de travail : « si… », conditionnel ou « supposons que… », vérifiables.]"),
  p("[Approche méthodologique : techniques réellement utilisées, avec les chiffres réels.]"),
  p("[Annonce du plan : nombre de parties, puis le titre exact de chacune.]"),

  h1("I. Cadres théorique et méthodologique"),
  consigne("Petite introduction de la partie : annoncer les titres des chapitres 1.1 et 1.2."),
  h2("1.1 Cadre théorique"),
  consigne("Petite introduction du chapitre : annoncer les sections."),
  ...section("1.1.1", "Problématique", structureSection),
  ...section("1.1.2", "Objectifs de recherche", ["Objectif général, puis objectifs spécifiques (verbes d'action)."]),
  ...section("1.1.3", "Hypothèses", ["Hypothèses testables : préciser comment chacune sera confirmée ou infirmée."]),
  ...section("1.1.4", "Pertinence du sujet", ["Intérêt pratique, technique et académique, chacun avec une raison concrète. Conclusion du chapitre + transition vers 1.2."]),
  h2("1.2 Cadre méthodologique"),
  ...section("1.2.1", "Méthodologie de travail", structureSection),
  ...section("1.2.2", "Outils et langages utilisés", ["Les outils réellement utilisés, cohérents avec la partie III."]),
  ...section("1.2.3", "Méthode de conception", ["UML ou Merise, et pourquoi."]),
  ...section("1.2.4", "Méthode de développement", ["Scrum, cycle en V… et comment elle a été appliquée."]),
  consigne("Conclusion partielle n°1 (4 à 6 lignes) + transition : annoncer le titre de la partie II."),

  h1("II. Cadre conceptuel"),
  consigne("Petite introduction de la partie : annoncer les chapitres 2.3 et 2.4 (numérotation continue de l'école : 2.3 et non 2.1)."),
  h2("2.3 Rappels sur le thème"),
  ...section("2.3.1", "Historique de la gestion du domaine", structureSection),
  ...section("2.3.2", "Problèmes rencontrés avec les systèmes manuels", ["Tableau « point faible | conséquence observée | exigence pour la solution »."]),
  ...section("2.3.3", "Intérêt d'un système informatisé", ["Arguments liés au cas réel, pas des généralités."]),
  h2("2.4 État de l'art sur le sujet"),
  ...section("2.4.1", "Étude de systèmes similaires", ["2 ou 3 solutions réelles et nommées."]),
  ...section("2.4.2", "Comparaison des fonctionnalités existantes", ["Tableau comparatif."]),
  ...section("2.4.3", "Limites des solutions actuelles", ["Les limites qui justifient le projet. Conclusion partielle n°2 + transition vers la partie III."]),

  h1("III. Mise en œuvre"),
  consigne("Petite introduction de la partie : annoncer les chapitres 3.5 et 3.6."),
  h2("3.5 Architecture"),
  ...section("3.5.1", "Architecture logique", ["Figure numérotée + commentaire dans le texte."]),
  espace(120),
  cadre("[Insérer la figure ici : Insertion > Image]"),
  legendeFigure("Figure 3.1 : [Titre de la figure]"),
  consigne("Commenter la figure : ce qu'elle montre, les éléments clés, ce qu'il faut en retenir. Numérotation : n° de chapitre + rang (Figure 3.1, 3.2…)."),
  ...section("3.5.2", "Architecture technique et déploiement", ["Diagramme de déploiement : serveurs, base, services externes, protocoles."]),
  h2("3.6 Implémentation"),
  ...section("3.6.1", "Environnement et technologies", ["La légende d'un tableau se place au-dessus du tableau."]),
  legendeTableau("Tableau 3.1 : Technologies utilisées"),
  tableauTechnologies(),
  ...section("3.6.2", "Fonctionnalités réalisées", ["Une capture commentée par fonctionnalité clé, données de démonstration réalistes."]),
  ...section("3.6.3", "Tests et validation", ["Tableau test | type | méthode | résultat, y compris ce qui n'a pas été testé. Conclusion partielle n°3."]),

  h1("Conclusion générale"),
  consigne("Concise (1 à 1,5 page). Ouverture possible : « Au terme de notre analyse… »."),
  p("[1. Récapitulation : contexte, problématique, objectifs, conclusions partielles n°1, n°2 et n°3.]"),
  p("[2. Réponse claire à la question posée : démarche, résultats réels, hypothèses confirmées ou infirmées.]"),
  p("[3. Difficultés rencontrées et limites, honnêtes et précises.]"),
  p("[4. Ouverture vers de nouvelles perspectives réalistes.]"),
];

// ---------------------------------------------------------------- Pages finales
const finales = [
  titreLiminaire("Bibliographie", false),
  consigne("Ordre alphabétique des auteurs, par type. Uniquement des documents réellement consultés et vérifiés."),
  new Paragraph({ style: "SousTitreBiblio", children: [new TextRun("I. Ouvrages")] }),
  new Paragraph({ indent: { firstLine: 0, left: 567, hanging: 567 }, children: [
    new TextRun("NOM Prénom, "), new TextRun({ text: "Titre de l'ouvrage", italics: true }), new TextRun(", Ville, Éditeur, année, nombre de pages."),
  ] }),
  new Paragraph({ style: "SousTitreBiblio", children: [new TextRun("II. Mémoires")] }),
  new Paragraph({ indent: { firstLine: 0, left: 567, hanging: 567 }, children: [
    new TextRun("NOM Prénom, "), new TextRun({ text: "Titre du mémoire", italics: true }), new TextRun(", établissement, année académique, nombre de pages."),
  ] }),
  new Paragraph({ style: "SousTitreBiblio", children: [new TextRun("III. Articles")] }),
  new Paragraph({ style: "SousTitreBiblio", children: [new TextRun("IV. Revues")] }),
  new Paragraph({ style: "SousTitreBiblio", children: [new TextRun("V. Rapports")] }),
  titreLiminaire("Webographie"),
  consigne("Lien + date et heure de consultation. Privilégier la documentation officielle."),
  new Paragraph({ indent: { firstLine: 0 }, children: [new TextRun("https://… : JJ/MM/AAAA, HHhMM")] }),
  titreLiminaire("Annexes"),
  new Paragraph({ indent: { firstLine: 0 }, children: [new TextRun("Annexe I : Guide d'entretien")] }),
  new Paragraph({ indent: { firstLine: 0 }, children: [new TextRun("Annexe II : Questionnaire")] }),
  new Paragraph({ indent: { firstLine: 0 }, children: [new TextRun("Annexe III : Autres documents (captures secondaires, extraits de code longs…)")] }),
  titreLiminaire("Table des matières"),
  consigne("Mise à jour automatique : clic droit > Mettre à jour les champs > Mettre à jour toute la table (ou F9)."),
  new TableOfContents("Table des matières", { hyperlink: true, headingStyleRange: "1-3", useAppliedParagraphOutlineLevel: true }),
];

const resumeAbstract = [
  titreLiminaire("Résumé", false),
  consigne("150 à 250 mots, un seul paragraphe : contexte, problème, démarche, réalisation, résultat principal, limite ou perspective."),
  p("[Texte du résumé]"),
  new Paragraph({ indent: { firstLine: 0 }, children: [new TextRun({ text: "Mots clés : ", bold: true }), new TextRun("[4 à 6 mots clés]")] }),
  titreLiminaire("Abstract"),
  consigne("Traduction fidèle du résumé, relue."),
  p("[Abstract text]"),
  new Paragraph({ indent: { firstLine: 0 }, children: [new TextRun({ text: "Keywords: ", bold: true }), new TextRun("[4 to 6 keywords]")] }),
  titreLiminaire("Errata"),
  consigne("Seulement si des erreurs sont constatées après reliure."),
  (() => {
    const w = Array(4).fill(Math.floor(LARGEUR_TEXTE / 4));
    w[3] = LARGEUR_TEXTE - w[0] * 3;
    const c = (t, i, b) => new TableCell({ width: { size: w[i], type: WidthType.DXA }, borders: bordures1, margins: { left: 100, right: 100 },
      children: [new Paragraph({ indent: { firstLine: 0 }, spacing: { line: 240 }, children: [new TextRun({ text: t, bold: b })] })] });
    return new Table({ width: { size: LARGEUR_TEXTE, type: WidthType.DXA }, columnWidths: w, rows: [
      new TableRow({ children: ["Pages", "Lignes", "Au lieu de", "Lire"].map((t, i) => c(t, i, true)) }),
      new TableRow({ children: ["", "", "", ""].map((t, i) => c(t, i, false)) }),
    ] });
  })(),
];

// ---------------------------------------------------------------- Document
const doc = new Document({
  creator: "dev-memoire-kit",
  title: "Modèle de mémoire de fin de cycle",
  description: "Modèle aux normes de présentation du guide TEC L3 GLAR",
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
        paragraph: { alignment: AlignmentType.LEFT, indent: { firstLine: 0 }, spacing: { before: 240, after: 240 }, keepNext: true, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true },
        paragraph: { alignment: AlignmentType.LEFT, indent: { firstLine: 0 }, spacing: { before: 240, after: 120 }, keepNext: true, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true },
        paragraph: { alignment: AlignmentType.LEFT, indent: { firstLine: 0 }, spacing: { before: 200, after: 120 }, keepNext: true, outlineLevel: 2 } },
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
      { id: "FootnoteText", name: "footnote text", basedOn: "Normal",
        run: { size: 20 }, paragraph: { alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 0 }, spacing: { line: 240, after: 0 } } },
    ],
  },
  numbering: {
    config: [{ reference: "puces", levels: [{ level: 0, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }],
  },
  footnotes: {
    1: { children: [new Paragraph({ style: "FootnoteText", children: [new TextRun("Exemple de note de bas de page : NOM Prénom, Titre, Éditeur, année, p. X. Taille 10, interligne simple.")] })] },
  },
  sections: [
    { properties: proprietes(null), footers: { default: piedDePage(false) },
      children: [...couverture("Page de couverture"), new Paragraph({ pageBreakBefore: true, children: [] }), ...couverture("Page de garde")] },
    { properties: proprietes(NumberFormat.UPPER_ROMAN), footers: { default: piedDePage(true) }, children: liminaires },
    { properties: proprietes(NumberFormat.DECIMAL_ZERO), footers: { default: piedDePage(true) }, children: corps },
    { properties: proprietes(NumberFormat.LOWER_ROMAN), footers: { default: piedDePage(true) }, children: finales },
    { properties: proprietes(null), footers: { default: piedDePage(false) }, children: resumeAbstract },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(SORTIE, buf);
  console.log(`Modèle écrit : ${path.resolve(SORTIE)}`);
});
