#!/usr/bin/env python3
"""Vérificateur de mémoire de fin de cycle (licence GLAR).

Usage :
    python3 verifier_memoire.py mon_memoire.docx
    python3 verifier_memoire.py chapitre1.md --sans-structure

Lit un fichier .docx, .pdf, .md ou .txt (lecture seule) et affiche un rapport :
  1. coquilles connues des modèles et erreurs de nom de technologie ;
  2. marqueurs [À COMPLÉTER] restants ;
  3. clôtures empilées (« En résumé… En conclusion… En somme… ») ;
  4. tics d'écriture génériques et formules marketing ;
  5. numérotation décimale non conforme (section 2.x placée dans le chapitre 3, ou,
     dans le plan en parties du guide, 2.1 au lieu de 2.3) ;
  6. annonces de chapitre fausses (« s'articule autour de quatre sections » quand il y en a cinq) ;
  7. codes d'exigences (EF01…) cités mais jamais définis, ou définis dans le désordre ;
  8. figures d'annexe numérotées « Figure 0.x » ;
  9. pages conventionnelles absentes ;
 10. technologies citées (pour vérifier la cohérence à la main).

Aucune dépendance externe : bibliothèque standard Python 3.8+.
"""
import argparse
import re
import shutil
import subprocess
import sys
import zipfile
from xml.etree import ElementTree as ET

W_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

# --- Règles ------------------------------------------------------------------

COQUILLES = [
    (r"T[EÉ]L[EÉ]INFORMQTIQUE", "coquille du modèle : TÉLÉINFORMATIQUE"),
    (r"Modell?ing Langage|Modelling Language", "Unified Modeling Language"),
    (r"Controlleur", "Contrôleur"),
    (r"Sprint Boot", "Spring Boot"),
    (r"React[- ]natif", "React Native"),
    (r"\bla m[ée]moire de fin\b|\bcette m[ée]moire\b|\bnotre m[ée]moire\b(?! vive)", "« le mémoire » (masculin) pour le travail académique"),
    (r"file:/+C:", "lien local Word copié dans le texte (table des matières tapée à la main ?)"),
    (r"\bdatas\b", "« données »"),
    (r"\bil n'ya\b", "« il n'y a »"),
    (r"[EÉ]tude l'existant", "« Étude de l'existant »"),
    (r"\bListes des tableaux\b", "« Liste des tableaux » (singulier)"),
    (r"\bTables des mati[èe]res\b", "« Table des matières » (singulier)"),
    (r"\buploader\b|\buploadé", "« téléverser » / « importer »"),
    (r"\bFigure\s*0\.\d+", "figure numérotée « 0.x » : numéroter les figures d'annexe A.1, B.1…"),
]

MARQUEURS = r"\[\s*(À|A) COMPL[ÉE]TER[^\]]*\]|\bTODO\b|\bXXX\b|\(titre\)|…{3,}|\.{6,}"
# Marqueur éventuellement coupé sur plusieurs lignes (texte extrait d'un PDF)
RX_MARQUEUR_LONG = re.compile(r"\[\s*(?:À|A) COMPL[ÉE]TER[^\]]{0,400}\]?", re.DOTALL)

# Restes du modèle et notes de travail qui ne doivent pas rester dans le document
RESTES = [
    r"Pr[ée]nom NOM", r"NOM Pr[ée]nom", r"M\./Mme", r"\[Ins[ée]rer", r"\[autres membres", r"\[Qualit[ée]",
    r"Grade / Sp[ée]cialit[ée]", r"supprimer cette mention", r"[àa] retirer", r"Titre de l[’']ouvrage",
    r"\[Organisme\]", r"\[Titre de la page\]", r"Conseils d[’']utilisation", r"[ÀA] v[ée]rifier avant d[ée]p[ôo]t",
    r"Format de l[’'][ée]cole", r"Consigne \(", r"^\[[A-ZÉÈÀ][^\]]{20,}\]?$",
]
RX_PARTIE = re.compile(r"^(?:(PREMI[ÈE]RE|DEUXI[ÈE]ME|TROISI[ÈE]ME|1re|2e|3e)\s+PARTIE|PARTIE\s+(?:[IVX]+|\d))\b", re.IGNORECASE)
RX_FIN_CORPS = re.compile(r"^(Bibliographie|Webographie|R[ée]f[ée]rences bibliographiques|Annexes?)\s*$", re.IGNORECASE)
# Codes d'exigences ou de règles (UC-01, PAI-04…) ; préfixes qui ne sont pas des codes de spécification
RX_CODE = re.compile(r"\b([A-Z]{2,4})-(\d{1,3})\b")
PREFIXES_IGNORES = {"UTF", "ISO", "SHA", "MD", "TLS", "SSL", "IPV", "EF", "ENF", "COVID", "RGPH", "CAN", "RFC", "AES", "RSA", "GPT", "HS", "ES", "MP"}

CLOTURES = (
    r"^(En r[ée]sum[ée]|En conclusion|En somme|En d[ée]finitive|En bref|Pour conclure|"
    r"En r[ée]capitulation|Tout compte fait|En synth[èe]se|Finalement|En fin de compte|"
    r"Pour r[ée]sumer|Ainsi, (cette|ce) (section|chapitre|partie))"
)

TICS = [
    r"de nos jours",
    r"dans un monde en (constante|perp[ée]tuelle) [ée]volution",
    r"le monde conna[iî]t une avanc[ée]e",
    r"l'essor (du num[ée]rique|des technologies)",
    r"r[ée]volutionne",
    r"à l'[èe]re (du num[ée]rique|de la digitalisation)",
    r"il est (crucial|essentiel|primordial|important) de (noter|souligner)",
    r"joue un r[ôo]le (cl[ée]|crucial|essentiel|central)",
    r"une [ée]tape (cruciale|essentielle|cl[ée])",
    r"(cette|ce) (section|chapitre|partie) a permis de",
    r"ce qui sera l'objet de la (sous-)?section suivante",
    r"il est maintenant (temps|n[ée]cessaire) de",
    r"passons maintenant",
    r"plonger dans",
    r"entamons (maintenant )?le voyage",
    r"un levier (majeur|important|strat[ée]gique)",
    r"socle solide|base solide|fondations? solides?",
]

MARKETING = [
    r"innovante?s?", r"r[ée]volution(naire)?", r"avant-gardiste", r"optimale?s?",
    r"robustes?", r"judicieu(x|se|sement)", r"incontournable", r"de pointe",
    r"performante?s?", r"intuitive?s?", r"fluide", r"conviviale?s?",
    r"sans pr[ée]c[ée]dent", r"transformer radicalement",
]

PAGES = [
    "Dédicace", "Remerciements", "Avant-propos", "Sommaire", "Glossaire",
    "Liste des figures", "Liste des tableaux", "Introduction générale",
    "Conclusion générale", "Bibliographie", "Webographie", "Annexes",
    "Table des matières", "Résumé", "Abstract",
]

TECHNOS = {
    "Base de données": ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "Firestore",
                         "SQLite", "Oracle", "SQL Server", "MariaDB", "Supabase"],
    "Front / mobile": ["React Native", "React", "Flutter", "Vue.js", "VueJS", "Angular",
                       "Next.js", "Bootstrap", "Tailwind", "Ionic", "Kotlin", "Swift"],
    "Back-end": ["Laravel", "Symfony", "Node.js", "Express", "NestJS", "Django",
                 "Flask", "FastAPI", "Spring Boot", "ASP.NET"],
}

# Plan en parties du guide : chapitres autorisés par partie (numérotation continue)
CHAPITRES = {"1": {"1", "2"}, "2": {"3", "4"}, "3": {"5", "6", "7"}}

NOMBRES = {"deux": 2, "trois": 3, "quatre": 4, "cinq": 5, "six": 6, "sept": 7, "huit": 8}
RX_CHAPITRE_ARABE = re.compile(r"^chapitre\s+(\d+)\s*[:.\-–]\s*[A-ZÉÈÀa-zé]", re.IGNORECASE)
RX_CHAPITRE_ROMAIN = re.compile(r"^(?:chapitre\s+)?(I|II|III|IV|V|VI)\s*[:.\-–]?\s+[A-ZÉÈÀ][A-Za-zéèêàçœ’' ]+$")
ROMAINS = {"I": "1", "II": "2", "III": "3", "IV": "4", "V": "5", "VI": "6"}


class _Chapitre:
    """Reconnaît « Chapitre 2 : … » ou « II Analyse et conception » ; group(1) rend le numéro arabe."""
    def match(self, p):
        if "http" in p or ".pdf" in p.lower():
            return None
        m = RX_CHAPITRE_ARABE.match(p)
        if m:
            return m
        m = RX_CHAPITRE_ROMAIN.match(p)
        if m:
            class M:
                def __init__(self, n): self.n = n
                def group(self, _): return self.n
            return M(ROMAINS[m.group(1)])
        return None


RX_CHAPITRE = _Chapitre()
RX_SECTION = re.compile(r"^(\d{1,2})\.(\d{1,2})\.?\s+[A-ZÉÈÀÂÎÔÙÇ]")          # 2.3 ou 2.3. Titre
RX_SOUS_SECTION = re.compile(r"^(\d{1,2})\.(\d{1,2})\.(\d{1,2})\.?\s+[A-ZÉÈÀÂÎÔÙÇ]")
RX_LIGNE_TABLE = re.compile(r"([.…]{3,}|…|\t)\s*[\dIVXLivxl]+\s*$")  # entrée de sommaire avec n° de page
RX_ANNONCE = re.compile(r"(?:s[’']articule|est structuré|s[’']organise|se décline)[^.]{0,40}?\b(" + "|".join(NOMBRES) + r"|\d)\s+(?:sections|parties principales|points)", re.IGNORECASE)
RX_EF = re.compile(r"\bEF-?(\d{1,3})\b")

# --- Lecture -----------------------------------------------------------------


def lire_docx(chemin):
    with zipfile.ZipFile(chemin) as z:
        xml = z.read("word/document.xml")
    racine = ET.fromstring(xml)
    paragraphes = []
    for p in racine.iter(W_NS + "p"):
        morceaux = []
        for el in p.iter():
            if el.tag == W_NS + "t" and el.text:
                morceaux.append(el.text)
            elif el.tag == W_NS + "tab":
                morceaux.append("\t")
        texte = "".join(morceaux).strip()
        if texte:
            paragraphes.append(texte)
    return paragraphes


def lire_texte(chemin):
    with open(chemin, encoding="utf-8", errors="replace") as f:
        lignes = [l.strip() for l in f]
    return [re.sub(r"^#+\s*|\*\*", "", l).strip() for l in lignes if l.strip()]


def lire_pdf(chemin):
    if not shutil.which("pdftotext"):
        raise OSError("pdftotext introuvable : installer poppler-utils, ou fournir le .docx")
    sortie = subprocess.run(["pdftotext", chemin, "-"], capture_output=True, text=True, check=True).stdout
    return [re.sub(r"^#+\s*|\*\*", "", l).strip() for l in sortie.splitlines() if l.strip()]


def polices_pdf(chemin):
    """Noms des polices intégrées au PDF (vide si pdffonts est absent)."""
    if not shutil.which("pdffonts"):
        return []
    sortie = subprocess.run(["pdffonts", chemin], capture_output=True, text=True).stdout.splitlines()[2:]
    return [l.split()[0] for l in sortie if l.strip()]


def lire(chemin):
    if chemin.lower().endswith(".docx"):
        return lire_docx(chemin)
    if chemin.lower().endswith(".pdf"):
        return lire_pdf(chemin)
    return lire_texte(chemin)

# --- Analyse -----------------------------------------------------------------


def extrait(texte, debut, fin, marge=40):
    a, b = max(0, debut - marge), min(len(texte), fin + marge)
    return ("…" if a else "") + texte[a:b].replace("\n", " ") + ("…" if b < len(texte) else "")


def chercher(paragraphes, motif, flags=re.IGNORECASE):
    rx = re.compile(motif, flags)
    for i, p in enumerate(paragraphes, 1):
        for m in rx.finditer(p):
            yield i, p, m


def analyser(paragraphes, structure=True):
    rapport = {}

    vus = set()
    rapport["coquilles"] = []
    for motif, conseil in COQUILLES:
        for i, p, m in chercher(paragraphes, motif):
            if (i, conseil) not in vus:  # une alerte par paragraphe et par règle
                vus.add((i, conseil))
                rapport["coquilles"].append((i, conseil, extrait(p, m.start(), m.end())))

    # Les points de conduite des sommaires et listes (« Titre ....... 12 ») ne sont pas des trous
    marqueurs = [(i, extrait(p, m.start(), m.end())) for i, p, m in chercher(paragraphes, MARQUEURS, 0)
                 if not RX_LIGNE_TABLE.search(p)]
    # Marqueurs [À COMPLÉTER …] coupés sur plusieurs lignes : recherche sur le texte entier
    deja = {i for i, _ in marqueurs}
    texte_entier, debuts, pos = "", [], 0
    for p in paragraphes:
        debuts.append(pos)
        texte_entier += p + "\n"
        pos += len(p) + 1
    import bisect
    for m in RX_MARQUEUR_LONG.finditer(texte_entier):
        i = bisect.bisect_right(debuts, m.start())
        if i not in deja:
            deja.add(i)
            marqueurs.append((i, texte_entier[m.start():m.start() + 110].replace("\n", " ") + "…"))
    rapport["marqueurs"] = sorted(marqueurs)

    restes = []
    for motif in RESTES:
        for i, p, m in chercher(paragraphes, motif):
            if not RX_LIGNE_TABLE.search(p) and i not in deja:
                deja.add(i)
                restes.append((i, extrait(p, m.start(), m.end())))
    rapport["restes"] = sorted(restes)

    # Clôtures : phrases de clôture dans des paragraphes consécutifs ou plusieurs dans un même paragraphe
    rx_clo = re.compile(CLOTURES, re.IGNORECASE)
    cloture_par_par = []
    for p in paragraphes:
        phrases = re.split(r"(?<=[.!?])\s+", p)
        cloture_par_par.append(sum(1 for ph in phrases if rx_clo.match(ph.strip())))
    empilements = []
    i = 0
    while i < len(paragraphes):
        if cloture_par_par[i]:
            j, total = i, 0
            while j < len(paragraphes) and cloture_par_par[j]:
                total += cloture_par_par[j]
                j += 1
            if total >= 2:
                empilements.append((i + 1, j, total, paragraphes[i][:90]))
            i = j
        else:
            i += 1
    rapport["empilements"] = empilements
    nb_clotures = sum(cloture_par_par)

    tics = {}
    for motif in TICS:
        for i, p, m in chercher(paragraphes, motif):
            tics.setdefault(m.group(0).lower(), []).append(i)
    rapport["tics"] = tics

    marketing = {}
    for motif in MARKETING:
        for i, p, m in chercher(paragraphes, r"\b" + motif + r"\b"):
            marketing.setdefault(m.group(0).lower(), []).append(i)
    rapport["marketing"] = marketing

    # Numérotation : plan en chapitres (pratique validée) ou en parties (guide)
    numerotation = []
    # Exclure les entrées de sommaire / table des matières (y compris un titre coupé sur deux lignes)
    # La structure s'analyse jusqu'à la bibliographie (sinon « I. Ouvrages » passe pour un chapitre)
    fin_corps = len(paragraphes) + 1
    vu_intro = False
    for i, p in enumerate(paragraphes, 1):
        if RX_LIGNE_TABLE.search(p):
            continue
        if re.match(r"^introduction g[ée]n[ée]rale\s*$", p, re.IGNORECASE):
            vu_intro = True
        elif vu_intro and RX_FIN_CORPS.match(p):
            fin_corps = i
            break
    corps = [(i, p) for i, p in enumerate(paragraphes, 1)
             if i < fin_corps and len(p) < 140 and not RX_LIGNE_TABLE.search(p)
             and not (i < len(paragraphes) and RX_LIGNE_TABLE.search(paragraphes[i]) and len(paragraphes[i]) < 140
                      and not RX_SECTION.match(paragraphes[i]) and not RX_CHAPITRE.match(paragraphes[i]))]
    plan_parties = any(RX_PARTIE.match(p) for _, p in corps)
    plan_chapitres = (not plan_parties) and any(RX_CHAPITRE.match(p) for _, p in corps)
    rapport["plan_parties"] = plan_parties
    chapitre_courant = None
    sections_par_chapitre = {}
    for i, p in corps:
        mc = RX_CHAPITRE.match(p)
        if mc:
            chapitre_courant = mc.group(1)
            sections_par_chapitre.setdefault(chapitre_courant, [])
            continue
        if RX_SOUS_SECTION.match(p):
            m = RX_SOUS_SECTION.match(p)
            premier = m.group(1)
        else:
            m = RX_SECTION.match(p)
            if not m:
                continue
            premier = m.group(1)
            if plan_chapitres and chapitre_courant == premier:
                sections_par_chapitre[chapitre_courant].append(m.group(2))
        if plan_chapitres:
            if chapitre_courant and premier != chapitre_courant:
                numerotation.append((i, p[:80], f"dans le chapitre {chapitre_courant}, attendu {chapitre_courant}.x"))
        else:
            chap = m.group(2)
            if premier in CHAPITRES and chap not in CHAPITRES[premier]:
                numerotation.append((i, p[:80], f"partie {premier} → chapitres attendus {sorted(CHAPITRES[premier])}"))
    rapport["numerotation"] = numerotation

    # Annonces de chapitre (« s'articule autour de quatre sections »)
    annonces = []
    if plan_chapitres:
        chapitre_courant = None
        for i, p in enumerate(paragraphes, 1):
            mc = RX_CHAPITRE.match(p) if len(p) < 140 else None
            if mc and not RX_LIGNE_TABLE.search(p):
                chapitre_courant = mc.group(1)
                continue
            # L'annonce peut être coupée sur deux lignes (texte extrait d'un PDF)
            suivant = paragraphes[i] if i < len(paragraphes) else ""
            ma = RX_ANNONCE.search(p) or RX_ANNONCE.search(p + " " + suivant)
            if ma and chapitre_courant:
                annonce = ma.group(1).lower()
                n_annonce = NOMBRES.get(annonce, int(annonce) if annonce.isdigit() else 0)
                n_reel = len(dict.fromkeys(sections_par_chapitre.get(chapitre_courant, [])))
                if n_reel and n_annonce != n_reel:
                    annonces.append((i, chapitre_courant, n_annonce, n_reel))
    # Plan en chapitres annoncé comme « trois parties »
    if plan_chapitres:
        rx_parties = re.compile(r"(structur[ée]|organis[ée]|articul[ée]|divis[ée]|s[’']articule)[^.]{0,40}?\b(deux|trois|quatre)\s+parties", re.IGNORECASE)
        for i, p, m in chercher(paragraphes, rx_parties.pattern):
            annonces.append((i, "plan", m.group(2) + " parties", "chapitres (le plan est en chapitres)"))
    rapport["annonces"] = annonces

    # Codes d'exigences : définis (cellule ou début de ligne de tableau) vs cités
    definis, ordre_def = set(), []
    for p in paragraphes:
        m = re.match(r"^\|?\s*EF-?(\d{1,3})\s*(\||$)", p)
        if m:
            n = int(m.group(1))
            if n not in definis:
                ordre_def.append(n)
            definis.add(n)
    cites = {}
    for i, p, m in chercher(paragraphes, RX_EF.pattern, 0):
        cites.setdefault(int(m.group(1)), i)
    rapport["ef_non_definis"] = sorted((n, i) for n, i in cites.items() if n not in definis) if definis else []
    rapport["ef_desordre"] = ordre_def != sorted(ordre_def) and len(ordre_def) > 1
    rapport["ef_ordre"] = ordre_def

    # Autres familles de codes (UC-01, PAI-04…) : cités mais jamais définis dans un tableau
    def_codes, cit_codes = set(), {}
    for i, p in enumerate(paragraphes, 1):
        m = re.match(r"^\|?\s*([A-Z]{2,4})-(\d{1,3})\s*(\||:|$)", p)
        if m:
            def_codes.add((m.group(1), int(m.group(2))))
        for mc in RX_CODE.finditer(p):
            if mc.group(1) not in PREFIXES_IGNORES:
                cit_codes.setdefault(mc.group(1), {}).setdefault(int(mc.group(2)), i)
    codes_orphelins = []
    for prefixe, nums in sorted(cit_codes.items()):
        non_def = {n: i for n, i in nums.items() if (prefixe, n) not in def_codes}
        if len(nums) >= 2 and non_def:
            codes_orphelins.append((prefixe, len(nums), len(non_def), min(non_def.values())))
    rapport["codes_orphelins"] = codes_orphelins
    rapport["sans_exigences"] = structure and not definis and not any(
        re.match(r"^\|?\s*ENF-?\d{1,3}\s*(\||$)", p) for p in paragraphes)

    if structure:
        tout = "\n".join(paragraphes).lower()
        rapport["pages_absentes"] = [pg for pg in PAGES if pg.lower() not in tout]
    else:
        rapport["pages_absentes"] = None

    technos = {}
    tout_texte = "\n".join(paragraphes)
    for cat, noms in TECHNOS.items():
        trouves = {}
        texte_restant = tout_texte
        for nom in sorted(noms, key=len, reverse=True):  # React Native avant React
            # Sensible à la casse : évite « vue d'ensemble », « express » (adjectif), « swift »…
            motif = r"(?<![\w.])" + re.escape(nom) + r"(?![\w])"
            n = len(re.findall(motif, texte_restant))
            if n:
                trouves[nom] = n
                texte_restant = re.sub(motif, " ", texte_restant)
        if trouves:
            technos[cat] = trouves
    rapport["technos"] = technos

    mots = len(tout_texte.split())
    rapport["stats"] = {"paragraphes": len(paragraphes), "mots": mots, "clotures": nb_clotures}
    return rapport

# --- Affichage ---------------------------------------------------------------


def afficher(rapport, chemin):
    s = rapport["stats"]
    print(f"=== Vérification : {chemin}")
    print(f"    {s['paragraphes']} paragraphes, {s['mots']} mots, {s['clotures']} phrases de clôture\n")
    bloquants = 0

    def titre(t):
        print(f"--- {t}")

    if rapport["coquilles"]:
        titre("COQUILLES ET NOMS ERRONÉS (bloquant)")
        par_regle = {}
        for i, conseil, ex in rapport["coquilles"]:
            par_regle.setdefault(conseil, []).append((i, ex))
        for conseil, cas in par_regle.items():
            for i, ex in cas[:3]:
                print(f"  §{i} → {conseil}\n      {ex}")
            if len(cas) > 3:
                print(f"  … et {len(cas) - 3} autre(s) occurrence(s) de la même règle (§{', §'.join(str(i) for i, _ in cas[3:10])}{' …' if len(cas) > 10 else ''})")
            bloquants += len(cas)
        print()

    if rapport.get("plan_parties"):
        titre("PLAN EN PARTIES (information)")
        print("  Le document suit le plan en parties (variante du guide ou ancien modèle du plugin).")
        print("  Le modèle actuel utilise trois chapitres : voir references/plan-type.md pour la correspondance.\n")

    if rapport["marqueurs"]:
        titre(f"MARQUEURS / TROUS RESTANTS : {len(rapport['marqueurs'])} (bloquant avant dépôt)")
        for i, ex in rapport["marqueurs"]:
            print(f"  §{i}  {ex}")
            bloquants += 1
        print()

    if rapport["restes"]:
        titre(f"RESTES DU MODÈLE ET NOTES DE TRAVAIL : {len(rapport['restes'])} (bloquant avant dépôt)")
        for i, ex in rapport["restes"][:25]:
            print(f"  §{i}  {ex}")
        if len(rapport["restes"]) > 25:
            print(f"  … et {len(rapport['restes']) - 25} autre(s)")
        bloquants += len(rapport["restes"])
        print()

    if rapport["numerotation"]:
        titre("NUMÉROTATION DÉCIMALE NON CONFORME")
        for i, p, attendu in rapport["numerotation"]:
            print(f"  §{i}  « {p} »  ({attendu})")
            bloquants += 1
        print()

    if rapport["annonces"]:
        titre("ANNONCES DE CHAPITRE FAUSSES (bloquant)")
        for i, chap, annonce, reel in rapport["annonces"]:
            if chap == "plan":
                print(f"  §{i}  « {annonce} » annoncées alors que le mémoire est organisé en {reel}")
            else:
                print(f"  §{i}  chapitre {chap} : {annonce} sections annoncées, {reel} sections réelles")
            bloquants += 1
        print()

    if rapport["codes_orphelins"] or rapport["sans_exigences"]:
        titre("CODES CITÉS SANS DÉFINITION / EXIGENCES ABSENTES (bloquant)")
        for prefixe, total, non_def, premier in rapport["codes_orphelins"]:
            print(f"  {prefixe}-xx : {total} codes cités, {non_def} jamais définis dans un tableau (premier au §{premier})")
            bloquants += 1
        if rapport["sans_exigences"]:
            print("  aucun tableau d'exigences fonctionnelles (EF01…) ni non fonctionnelles (ENF01…) trouvé")
            bloquants += 1
        print()

    if rapport["ef_non_definis"] or rapport["ef_desordre"]:
        titre("EXIGENCES FONCTIONNELLES (traçabilité)")
        for n, i in rapport["ef_non_definis"]:
            print(f"  §{i}  EF{n:02d} est cité mais absent du tableau des exigences")
            bloquants += 1
        if rapport["ef_desordre"]:
            print(f"  codes définis dans le désordre : {', '.join(f'EF{n:02d}' for n in rapport['ef_ordre'])}")
        print()

    if rapport["empilements"]:
        titre("CLÔTURES EMPILÉES (une seule conclusion + une transition par section)")
        for debut, fin, total, ex in rapport["empilements"]:
            zone = f"§{debut}" if debut == fin else f"§{debut}-{fin}"
            print(f"  {zone} : {total} clôtures d'affilée — « {ex}… »")
        print()

    if rapport["tics"]:
        titre("TICS D'ÉCRITURE GÉNÉRIQUES (réécrire avec un fait concret)")
        for tic, lignes in sorted(rapport["tics"].items(), key=lambda kv: -len(kv[1])):
            print(f"  {len(lignes):>3}×  « {tic} »  §{', §'.join(map(str, lignes[:8]))}{' …' if len(lignes) > 8 else ''}")
        print()

    if rapport["marketing"]:
        titre("ADJECTIFS PROMOTIONNELS (justifier par un fait ou supprimer)")
        for mot, lignes in sorted(rapport["marketing"].items(), key=lambda kv: -len(kv[1])):
            print(f"  {len(lignes):>3}×  {mot}")
        print()

    if rapport["pages_absentes"]:
        titre("PAGES CONVENTIONNELLES NON TROUVÉES (normal pour un brouillon partiel)")
        print("  " + ", ".join(rapport["pages_absentes"]))
        print()

    if rapport["technos"]:
        titre("TECHNOLOGIES CITÉES (vérifier la cohérence dans tout le document)")
        for cat, trouves in rapport["technos"].items():
            detail = ", ".join(f"{n} ({c})" for n, c in trouves.items())
            alerte = "  ⚠ plusieurs bases de données citées" if cat == "Base de données" and len(trouves) > 1 else ""
            print(f"  {cat} : {detail}{alerte}")
        print()

    ratio = s["clotures"] / max(1, s["paragraphes"])
    print(f"=== Bilan : {bloquants} point(s) bloquant(s). "
          f"Taux de clôtures : {ratio:.0%} des paragraphes"
          f"{' (élevé : viser < 15 %)' if ratio > 0.15 else ''}.")
    print("    Les points non détectables automatiquement (preuves, références, cohérence plan/corps) "
          "sont dans references/erreurs-frequentes.md.")


def main():
    ap = argparse.ArgumentParser(description="Vérifie un mémoire (.docx, .pdf, .md, .txt).")
    ap.add_argument("fichier")
    ap.add_argument("--sans-structure", action="store_true",
                    help="ne pas signaler les pages conventionnelles absentes (chapitre isolé)")
    args = ap.parse_args()
    try:
        paragraphes = lire(args.fichier)
    except (OSError, zipfile.BadZipFile, KeyError, ET.ParseError) as e:
        print(f"Impossible de lire {args.fichier} : {e}", file=sys.stderr)
        return 2
    if not paragraphes:
        print("Aucun texte trouvé dans le fichier.", file=sys.stderr)
        return 2
    afficher(analyser(paragraphes, structure=not args.sans_structure), args.fichier)
    if args.fichier.lower().endswith(".pdf"):
        polices = polices_pdf(args.fichier)
        if polices and not any("Times" in nom for nom in polices):
            print("\n--- POLICE DU PDF")
            print(f"  Times New Roman n'est pas intégrée ({', '.join(sorted(set(p.split('+')[-1] for p in polices))[:4])}).")
            print("  Exporter le PDF depuis Word avec Times New Roman (un rendu LibreOffice la remplace souvent par Liberation Serif).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
