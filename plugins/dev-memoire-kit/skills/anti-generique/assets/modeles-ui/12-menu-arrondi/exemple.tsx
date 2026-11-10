/**
 * Modèle 12 — Menu arrondi qui s'ouvre (avec image qui se découvre)
 * Adapté de « Expanding Rounded Menu » de Codrops (licence MIT, © 2009-2021 Codrops,
 * https://github.com/codrops/ExpandingRoundedMenu). Mise en page, couleurs, séquence (durées, départs,
 * courbes) et fermeture en sens inverse repris du code d'origine (GSAP) et réécrits avec `motion` ;
 * photos remplacées par des motifs de tissu wax dessinés en SVG.
 *
 * Dépendances : react 18+, motion 11+ (`npm i motion`). Polices : Bodoni Moda (titres), Archivo (texte).
 */
import { useRef, useState } from "react";
import { animate } from "motion";

/* ====================================================================== */
/* Courbes GSAP exactes et lecture inversée                                */
/* ====================================================================== */
type Courbe = (t: number) => number;
const power4InOut: Courbe = (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);
const power3InOut: Courbe = (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);
const power4Out: Courbe = (t) => 1 - (1 - t) ** 5;
/** Une étape de la séquence : départ, durée, courbe, valeurs de début et de fin. */
type Etape = { cible: string; depart: number; duree: number; ease: Courbe; de: Record<string, number | string>; a: Record<string, number | string>; parElement?: (i: number) => { de: Record<string, string>; a: Record<string, string> } };
const TOTAL = 1.6; // durée de la séquence (la plus longue étape : l'image de couverture)

const SEQUENCE: Etape[] = [
  { cible: ".couverture-cadre", depart: 0, duree: 1.6, ease: power3InOut, de: { scale: 1.1 }, a: { scale: 1 } },
  { cible: ".couverture", depart: 0, duree: 1.2, ease: power4InOut, de: { y: "-100%" }, a: { y: "0%" } },
  { cible: ".couverture-image", depart: 0, duree: 1.2, ease: power4InOut, de: { y: "100%" }, a: { y: "0%" } },
  { cible: ".fond-img", depart: 0, duree: 1.2, ease: power4InOut, de: {}, a: {}, parElement: (i) => ({ de: { y: "0%" }, a: { y: i % 2 === 0 ? "-20%" : "20%" } }) },
  { cible: ".fond-titre", depart: 0, duree: 1.2, ease: power4InOut, de: {}, a: {}, parElement: (i) => ({ de: { y: "0%" }, a: { y: i % 2 === 0 ? "20%" : "-20%" } }) },
  { cible: ".menu-contenu", depart: 0.5, duree: 1, ease: power4InOut, de: { y: "-100%" }, a: { y: "0%" } },
  { cible: ".menu-extra", depart: 1.1, duree: 0.5, ease: power4Out, de: { y: "400%", opacity: 0 }, a: { y: "0%", opacity: 1 } },
];

/** Joue la séquence à l'endroit, ou à l'envers comme `timeline.reverse()` (départs miroirs, courbes retournées). */
function jouer(racine: HTMLElement, envers: boolean) {
  const promesses: Promise<unknown>[] = [];
  for (const e of SEQUENCE) {
    racine.querySelectorAll<HTMLElement>(e.cible).forEach((el, i) => {
      const { de, a } = e.parElement ? e.parElement(i) : { de: e.de, a: e.a };
      const cles = Object.keys(a);
      const valeurs = Object.fromEntries(cles.map((k) => [k, envers ? [a[k], de[k]] : [de[k], a[k]]]));
      const delai = envers ? TOTAL - (e.depart + e.duree) : e.depart;
      const ease: Courbe = envers ? (t) => 1 - e.ease(1 - t) : e.ease;
      promesses.push(animate(el, valeurs, { duration: e.duree, delay: delai, ease }).then(() => undefined));
    });
  }
  return Promise.all(promesses);
}

/* ====================================================================== */
/* Tissus wax (SVG)                                                        */
/* ====================================================================== */
type Wax = { fond: string; c1: string; c2: string; c3: string; motif: "yeux" | "feuilles" | "cercles" | "losanges" };
export function TissuWax({ w, id }: { w: Wax; id: string }) {
  return (
    <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 600" aria-hidden>
      <defs>
        <pattern id={id} width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
          <rect width="100" height="100" fill={w.fond} />
          {w.motif === "yeux" && <><ellipse cx="50" cy="50" rx="44" ry="26" fill={w.c1} /><circle cx="50" cy="50" r="20" fill={w.c2} /><circle cx="50" cy="50" r="9" fill={w.c3} /><circle cx="0" cy="0" r="12" fill={w.c3} /><circle cx="100" cy="100" r="12" fill={w.c3} /><circle cx="100" cy="0" r="12" fill={w.c3} /><circle cx="0" cy="100" r="12" fill={w.c3} /></>}
          {w.motif === "feuilles" && <><path d="M50 6 C80 26 80 74 50 94 C20 74 20 26 50 6Z" fill={w.c1} /><path d="M50 14 V86" stroke={w.c3} strokeWidth="3" /><path d="M50 34 L66 24 M50 50 L70 40 M50 66 L66 58 M50 34 L34 24 M50 50 L30 40 M50 66 L34 58" stroke={w.c3} strokeWidth="2" /><circle cx="0" cy="50" r="10" fill={w.c2} /><circle cx="100" cy="50" r="10" fill={w.c2} /></>}
          {w.motif === "cercles" && <><circle cx="50" cy="50" r="46" fill={w.c1} /><circle cx="50" cy="50" r="34" fill={w.fond} /><circle cx="50" cy="50" r="24" fill={w.c2} /><circle cx="50" cy="50" r="12" fill={w.c3} /><circle cx="0" cy="0" r="14" fill={w.c2} /><circle cx="100" cy="0" r="14" fill={w.c2} /><circle cx="0" cy="100" r="14" fill={w.c2} /><circle cx="100" cy="100" r="14" fill={w.c2} /></>}
          {w.motif === "losanges" && <><path d="M50 0 L100 50 L50 100 L0 50Z" fill={w.c1} /><path d="M50 18 L82 50 L50 82 L18 50Z" fill={w.c2} /><path d="M50 36 L64 50 L50 64 L36 50Z" fill={w.c3} /></>}
        </pattern>
        <linearGradient id={`${id}o`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".35" /></linearGradient>
      </defs>
      <rect width="400" height="600" fill={`url(#${id})`} />
      <rect width="400" height="600" fill={`url(#${id}o)`} />
    </svg>
  );
}
const WAX: Record<string, Wax> = {
  gauche: { fond: "#1B2A4A", c1: "#E9A23B", c2: "#F4E3C1", c3: "#C8452C", motif: "feuilles" },
  principal: { fond: "#2B2B2B", c1: "#EE8233", c2: "#F7EBDD", c3: "#1F6E5A", motif: "yeux" },
  droite: { fond: "#5B1E2D", c1: "#F2C14E", c2: "#2E86AB", c3: "#F7EBDD", motif: "cercles" },
  /** Sombre exprès : le panneau orange doit se détacher dessus (la démo d'origine utilise une photo en noir et blanc). */
  couverture: { fond: "#0D2B2C", c1: "#1C5557", c2: "#B9A27A", c3: "#5E1824", motif: "losanges" },
};

/* ====================================================================== */
/* Page                                                                    */
/* ====================================================================== */
const MENU = [
  [{ titre: "Nouveautés", liens: ["Boubous", "Kaftans", "Ensembles", "Pantalons", "Pagnes", "Sacs"] }, { titre: "Promotions", liens: ["T-shirts", "Soirée", "Basiques"] }],
  [{ titre: "Tendances", liens: ["Nouvelle saison", "Tabaski", "Sorties", "Bureau"] }],
];

export default function MenuArrondi() {
  const racine = useRef<HTMLDivElement>(null);
  const [ouvert, setOuvert] = useState(false);
  const occupe = useRef(false);
  const basculer = async (ouvrir: boolean) => {
    if (occupe.current || ouvrir === ouvert || !racine.current) return;
    occupe.current = true;
    if (ouvrir) setOuvert(true);
    await jouer(racine.current, !ouvrir);
    if (!ouvrir) setOuvert(false);
    occupe.current = false;
  };
  const lien = (t: string) => <a key={t} href="#" className="lien-trait" onClick={(e) => { e.preventDefault(); basculer(true); }}>{t}</a>;

  return (
    <div className={ouvert ? "sama ouvert" : "sama"} ref={racine}>
      <style>{CSS}</style>
      <div className="cadre-haut">
        <h1>Menu arrondi <em>(cliquer un lien du menu)</em></h1>
        <nav><a href="#" className="trait-survol">Démo précédente</a><a href="#" className="trait-survol">Article</a></nav>
      </div>

      <div className="contenu">
        <div className="fond-img img-gauche"><TissuWax w={WAX.gauche} id="w-gauche" /></div>
        <h3 className="fond-titre titre-gauche">2025</h3>
        <div className="fond-img img-principale"><TissuWax w={WAX.principal} id="w-principal" /></div>
        <h2 className="fond-titre titre-principal" aria-label="Sama"><span>S</span><span>A</span><span>M</span><span>A</span></h2>
        <p className="citation">« Quand tu comprends que rien ne manque, le monde entier t'appartient. »</p>
        <div className="fond-img img-droite"><TissuWax w={WAX.droite} id="w-droite" /></div>
        <h3 className="fond-titre titre-droite">2026</h3>
      </div>

      <div className="couverture-cadre" aria-hidden>
        <div className="couverture"><div className="couverture-image"><TissuWax w={WAX.couverture} id="w-couverture" /></div></div>
      </div>

      <div className="menu">
        <div className="menu-haut">
          <h2 className="menu-titre">Sama</h2>
          <nav className="menu-nav">{["Boubous", "Robes", "Accessoires", "Créateurs"].map(lien)}</nav>
          <div className="menu-cote">
            {lien("Connexion")}
            <button className="recherche" aria-label="Rechercher">
              <svg width="13" height="13" viewBox="0 0 20 20"><path d="M7.5 1.7a5.8 5.8 0 1 1 0 11.6 5.8 5.8 0 0 1 0-11.6M7.5 15a7.5 7.5 0 0 0 4.7-1.7l6.4 6.4a.8.8 0 0 0 1.2-1.2l-6.4-6.4A7.5 7.5 0 1 0 7.5 15" /></svg>
            </button>
          </div>
        </div>
        <div className="menu-contenu-cadre">
          <div className="menu-contenu">
            <nav className="menu-colonnes">
              {MENU.map((col, k) => (
                <div className="colonne" key={k}>
                  {col.map((g) => <div key={g.titre}><h4>{g.titre}</h4>{g.liens.map((l) => <a key={l} href="#" className="lien-trait">{l}</a>)}</div>)}
                </div>
              ))}
            </nav>
            <button className="retour" aria-label="Fermer le menu" onClick={() => basculer(false)}>
              <svg width="10" height="182" viewBox="0 0 10 121" preserveAspectRatio="xMidYMin meet"><path d="M5 0 .5 9h9L5 0Zm.5 120.5V8h-1v113h1v-.5Z" /></svg>
            </button>
            <div className="reseaux">
              <a href="#">lettre d'info</a><a href="#">réseaux</a><a href="#">contact</a>
              <a className="auteur menu-extra" href="#">@sama.dakar</a>
            </div>
            <h3 className="slogan menu-extra">Médina</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400&family=Archivo:ital,wght@0,400;1,400&display=swap');
.sama{--texte:#fff;--texte-menu:#000;--texte-cadre:#817f7f;--fond:#0c0c0c;--fond-menu:#ee8233;--lien-reseau:#ca5d2b;--rayon:2rem;--marge-menu:2rem;--titre:#ee8233;
position:relative;height:100vh;overflow:hidden;display:grid;background:var(--fond);color:var(--texte);font:400 17px/1.3 Archivo,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.sama *{box-sizing:border-box}
.sama a{color:inherit;text-decoration:none}
.sama button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.cadre-haut{position:absolute;z-index:50;bottom:1.5rem;left:3rem;display:flex;gap:2rem;color:var(--texte-cadre);font-size:12px;align-items:baseline}
.cadre-haut h1{font-size:12px;font-weight:400;margin:0}.cadre-haut nav{display:flex;gap:1rem}
.trait-survol,.lien-trait{white-space:nowrap;overflow:hidden;position:relative;display:inline-block}
.trait-survol::before,.lien-trait::before{content:"";height:1px;width:100%;background:currentColor;position:absolute;top:92%;transition:transform .3s;transform-origin:0 50%}
.trait-survol:hover::before{transform:scaleX(0);transform-origin:100% 50%}
.lien-trait::before{transform:scaleX(0)}.lien-trait:hover::before{transform:scaleX(1);transform-origin:100% 50%}
.contenu{grid-area:1/1/2/2;width:100%;height:100vh;overflow:hidden;display:grid;grid-template-rows:10vh 15vh auto 1fr auto 1fr;grid-template-columns:18% 1fr 1fr 18%;column-gap:7vw;
grid-template-areas:'. main main .' '. main main .' 'gauche main main titre-d' 'gauche main main droite' 'titre-g main main droite' 'titre-g main main droite'}
.fond-img{position:relative;overflow:hidden;will-change:transform}
.img-gauche{grid-area:gauche}.img-principale{grid-area:main}.img-droite{grid-area:droite}
.fond-titre{z-index:10;position:relative;font-family:'Bodoni Moda',Didot,serif;font-weight:400;color:var(--titre);margin:0;line-height:1;will-change:transform}
.titre-gauche{grid-area:titre-g;font-size:4vw;justify-self:end;margin-top:2rem}
.titre-droite{grid-area:titre-d;font-size:6.5vw}
.titre-principal{grid-area:main;display:grid;padding:20vh 0 10vh;grid-template-rows:repeat(4,17vh);grid-template-areas:'l1 .' '. l3' 'l2 .' '. l4';font-size:20vh;align-content:center;justify-items:center}
.titre-principal span:nth-child(1){grid-area:l1}.titre-principal span:nth-child(2){grid-area:l2}.titre-principal span:nth-child(3){grid-area:l3}.titre-principal span:nth-child(4){grid-area:l4}
.citation{z-index:10;text-transform:uppercase;grid-area:2/3/3/5;max-width:400px;align-self:center;justify-self:center;line-height:1;font-style:italic;margin:0}
.couverture-cadre{display:grid;pointer-events:none;grid-area:1/1/2/2;z-index:100;will-change:transform}
.couverture{display:grid;grid-area:1/1/2/2;transform:translateY(-100%);overflow:hidden;will-change:transform}
.couverture-image{transform:translateY(100%);will-change:transform}
.menu{position:absolute;top:2rem;left:3rem;right:3rem;bottom:2rem;z-index:150;color:var(--texte-menu);display:grid;grid-template-rows:3rem 1fr;pointer-events:none;opacity:.9}
.ouvert .menu{pointer-events:auto}
.menu-haut{pointer-events:auto;z-index:100;padding:0 var(--marge-menu);display:grid;align-items:center;grid-template-columns:5rem 10% minmax(200px,417px) 10% 5rem;grid-template-areas:'titre . nav . cote';justify-content:space-between;background:var(--fond-menu);border-radius:var(--rayon)}
.menu-titre{grid-area:titre;font:400 1.65rem/.5 'Bodoni Moda',Didot,serif;text-transform:uppercase;margin:.15rem 0 0}
.menu-nav{grid-area:nav;overflow:hidden;height:1.75rem;justify-self:center;display:flex;gap:2rem;white-space:nowrap}
.menu-cote{grid-area:cote;justify-self:end;display:flex;align-items:center}
.recherche svg{margin-left:1rem;display:block}
.menu-contenu-cadre{position:relative;overflow:hidden;margin-top:-1.35rem}
.menu-contenu{overflow:hidden;transform:translateY(-100%);padding:0 var(--marge-menu) 1rem;height:100%;display:grid;justify-content:space-between;background:var(--fond-menu);border-radius:0 0 var(--rayon) var(--rayon);
grid-template-rows:1fr 10vh;grid-template-columns:5rem 10% minmax(200px,417px) 10% 5rem;grid-template-areas:'. . liens retour .' 'slogan slogan reseaux reseaux reseaux';will-change:transform}
.menu-colonnes{grid-area:liens;display:flex;flex-wrap:wrap;align-self:start;margin-top:5.5vh}
.colonne{display:flex;flex-direction:column;margin:0 1rem;min-width:15ch;align-items:flex-start}
.colonne>div{display:flex;flex-direction:column;align-items:flex-start}
.colonne h4{margin:1.5rem 0 .5rem}
.retour{grid-area:retour;height:200px;align-self:start;margin-top:calc(5.5vh + 1.5rem)}
.retour svg{display:block;fill:#000;height:100%;max-height:201px;transition:transform .3s}
.retour:hover svg{transform:translateY(-10px)}
.reseaux{grid-area:reseaux;display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-end;color:var(--lien-reseau)}
.reseaux a:hover{color:#000}
.sama .auteur{margin-top:2rem;font:400 2.5vw 'Bodoni Moda',Didot,serif;color:#000;will-change:transform}
.slogan{grid-area:slogan;font:400 clamp(1.5rem,17.5vh,8rem)/.8 'Bodoni Moda',Didot,serif;margin:0;align-self:end;will-change:transform}
@media (max-width:888px){.menu{top:1rem;left:1rem;right:1rem;bottom:1rem}.menu-haut{grid-template-columns:auto 1fr auto;grid-template-areas:'titre nav cote'}.menu-nav{display:none}
.menu-contenu{grid-template-columns:1fr auto;grid-template-areas:'liens retour' 'slogan slogan'}.reseaux{display:none}.retour{height:90px}.cadre-haut{left:1rem}}
`;
