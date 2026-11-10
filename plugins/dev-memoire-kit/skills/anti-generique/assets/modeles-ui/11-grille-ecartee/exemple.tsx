/**
 * Modèle 11 — Grille qui s'écarte
 * Adapté de « Make Way Grid Effect » de Codrops (licence MIT, © 2009-2021 Codrops,
 * https://github.com/codrops/MakeWayGridEffect). La vignette cliquée grandit sur place ; ses voisines
 * s'écartent d'autant plus qu'elles sont proches, et peuvent tourner un peu. Quatre réglages repris de la démo
 * (durée, courbe, agrandissement, rotation, écart, distance, cisaillement) ; courbes GSAP portées en fonctions exactes.
 * Pièces de céramique dessinées en SVG à la place des photos.
 *
 * Dépendances : react 18+, motion 11+ (`npm i motion`). Police : Fraunces (texte), Inter (titres de section).
 */
import { useRef, type ReactNode } from "react";
import { animate } from "motion";

/* ====================================================================== */
/* Courbes GSAP, en fonctions exactes                                      */
/* ====================================================================== */
type Courbe = (t: number) => number;
export const COURBES: Record<string, Courbe> = {
  expo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  power3: (t) => 1 - Math.pow(1 - t, 4),
  power4: (t) => 1 - Math.pow(1 - t, 5),
  "sine.in": (t) => 1 - Math.cos((t * Math.PI) / 2),
  /** elastic.out(amplitude, période) ; GSAP ramène une amplitude < 1 à 1. */
  "elastic.out(0.5)": (() => {
    const a = 1, p = 0.3, s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    return (t: number) => (t === 0 || t === 1 ? t : a * Math.pow(2, -10 * t) * Math.sin(((t - s) * 2 * Math.PI) / p) + 1);
  })(),
};
const carte = (x: number, a: number, b: number, c: number, d: number) => ((x - a) * (d - c)) / (b - a) + c;

export type Reglages = { duree: number; courbe: keyof typeof COURBES; echelle: number; rotationMax: number; ecart: number; distanceMax: number; cisaillement: number };
const PAR_DEFAUT: Reglages = { duree: 0.8, courbe: "power4", echelle: 2, rotationMax: 0, ecart: 80, distanceMax: 500, cisaillement: 0 };

/* ====================================================================== */
/* Grille                                                                  */
/* ====================================================================== */
const centreDe = (el: HTMLElement) => ({ x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 });
const distance = (a: HTMLElement, b: HTMLElement) => { const p = centreDe(a), q = centreDe(b); return Math.hypot(p.x - q.x, p.y - q.y); };
/** Déplacement d'une voisine : dans la direction opposée à la vignette ouverte, d'autant plus fort qu'elle est proche. */
function ecartement(voisine: HTMLElement, ouverte: HTMLElement, ecart: number, distanceMax: number) {
  const p = centreDe(voisine), q = centreDe(ouverte);
  const force = Math.max(carte(distance(voisine, ouverte), 0, distanceMax, ecart, 0), 0);
  const angle = Math.atan2(Math.abs(q.y - p.y), Math.abs(q.x - p.x));
  const x = Math.abs(Math.cos(angle) * force), y = Math.abs(Math.sin(angle) * force);
  return { x: p.x < q.x ? -x : x, y: p.y < q.y ? -y : y };
}

export function GrilleEcartee({ elements, colonnes, reglages, etroite = false }: { elements: ReactNode[]; colonnes: number; reglages?: Partial<Reglages>; etroite?: boolean }) {
  const r: Reglages = { ...PAR_DEFAUT, ...reglages };
  const racine = useRef<HTMLDivElement>(null);
  const ouverte = useRef(-1);
  const ease = COURBES[r.courbe];

  const deplier = (index: number) => {
    const items = [...racine.current!.querySelectorAll<HTMLElement>(".piece")];
    const precedente = ouverte.current !== -1 && ouverte.current !== index ? ouverte.current : -1;
    ouverte.current = ouverte.current === index ? -1 : index;
    const ferme = ouverte.current === -1;
    const el = items[index];
    const fin = (f: () => void) => window.setTimeout(f, r.duree * 1000);

    /* La vignette choisie passe devant tout de suite (ou repasse derrière à la fin). */
    if (ferme) fin(() => (el.style.zIndex = "1")); else el.style.zIndex = "999";
    if (r.cisaillement) {
      const sens = ferme ? -1 : 1;
      animate(el, { scale: 1 + (r.echelle - 1) / 2, skewX: sens * r.cisaillement, skewY: sens * r.cisaillement, x: 0, y: 0, rotate: 0 }, { duration: r.duree * 0.4, ease: COURBES["sine.in"] })
        .then(() => animate(el, { scale: ferme ? 1 : r.echelle, skewX: 0, skewY: 0 }, { duration: r.duree * 0.6, ease: COURBES.power4 }));
    } else {
      animate(el, { scale: ferme ? 1 : r.echelle, x: 0, y: 0, rotate: 0 }, { duration: r.duree, ease });
    }
    if (precedente !== -1) {
      items[precedente].style.zIndex = "1";
      animate(items[precedente], { scale: 1, x: 0, y: 0, rotate: 0 }, { duration: r.duree, ease });
    }
    items.forEach((autre, k) => {
      if (k === index) return;
      const { x, y } = ferme ? { x: 0, y: 0 } : ecartement(autre, el, r.ecart, r.distanceMax);
      const d = distance(autre, el);
      const z = String(Math.round(carte(d, 0, 100000, 998, 1)));
      if (ferme) fin(() => (autre.style.zIndex = "1")); else autre.style.zIndex = z;
      const amplitude = r.rotationMax ? Math.max(Math.round(carte(d, 0, 500, r.rotationMax, 0)), 0) : 0;
      animate(autre, { x, y, rotate: ferme ? 0 : (Math.random() * 2 - 1) * amplitude }, { duration: r.duree, ease });
    });
  };

  return (
    <div ref={racine} className={etroite ? "grille-ecartee etroite" : "grille-ecartee"} style={{ gridTemplateColumns: `repeat(${colonnes}, 1fr)` }}>
      {elements.map((e, i) => (
        <button key={i} className="piece" onClick={() => deplier(i)} aria-label={`Agrandir la pièce ${i + 1}`}>{e}</button>
      ))}
    </div>
  );
}

/* ====================================================================== */
/* Pièces de céramique (SVG)                                               */
/* ====================================================================== */
const FONDS = ["#F3C6C0", "#9FD3E6", "#F6D65A", "#E9E3D8", "#F08A5D", "#B8E0C8", "#2F4B7C", "#F7A7C8", "#D9D2C5", "#5FB0A6", "#FFE3B3", "#C9B7E8", "#1E1E1E", "#E85D75"];
const EMAUX = ["#FFFFFF", "#1E3A5F", "#C2502B", "#2E6B4F", "#F2C14E", "#3D2C2E", "#8FB8DE", "#E8DCC8"];
const alea = (n: number) => { const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); };
const SILHOUETTES = [
  "M38 30h24v8c10 6 16 18 16 32 0 20-12 34-28 34S22 90 22 70c0-14 6-26 16-32z", // vase
  "M18 62h64c0 22-14 36-32 36S18 84 18 62z", // bol
  "M40 24h20v14c12 4 20 16 20 30v34H20V68c0-14 8-26 20-30z", // pot
  "M30 40h40l6 60H24z", // gobelet
  "M44 18h12v22c14 8 22 22 22 38 0 14-12 24-28 24S22 92 22 78c0-16 8-30 22-38z", // bouteille
];
export function Piece({ n }: { n: number }) {
  const fond = FONDS[n % FONDS.length];
  const email = EMAUX[Math.floor(alea(n) * EMAUX.length)];
  const forme = SILHOUETTES[Math.floor(alea(n + 7) * SILHOUETTES.length)];
  const motif = Math.floor(alea(n + 3) * 3);
  const id = `p${n}`;
  return (
    <svg viewBox="0 0 100 125" width="100%" height="100%" aria-hidden>
      <defs><clipPath id={id}><path d={forme} transform="translate(0 10)" /></clipPath></defs>
      <rect width="100" height="125" fill={fond} />
      <ellipse cx="50" cy="113" rx="30" ry="4" fill="#000" opacity=".12" />
      <path d={forme} transform="translate(0 10)" fill={email} />
      <g clipPath={`url(#${id})`}>
        {motif === 0 && Array.from({ length: 6 }, (_, k) => <rect key={k} x="0" y={44 + k * 12} width="100" height="4" fill={fond} opacity=".55" />)}
        {motif === 1 && Array.from({ length: 12 }, (_, k) => <circle key={k} cx={22 + (k % 4) * 18} cy={56 + Math.floor(k / 4) * 18} r="3.5" fill={fond} opacity=".7" />)}
        {motif === 2 && <path d="M0 80 Q25 64 50 80 T100 80 V125 H0Z" fill={fond} opacity=".5" />}
        <rect x="18" y="30" width="10" height="80" fill="#fff" opacity=".18" />
      </g>
    </svg>
  );
}

/* ====================================================================== */
/* Démonstration : page éditoriale                                         */
/* ====================================================================== */
const SECTIONS: { texte: string; titre: string; colonnes: number; nombre: number; reglages: Partial<Reglages>; etroite?: boolean }[] = [
  { texte: "Fatou Sarr est une céramiste sénégalaise, née à Rufisque, qui façonne depuis trente ans des pièces d'argile du fleuve.", titre: "Premières années", colonnes: 13, nombre: 39, reglages: { duree: 0.7, courbe: "expo" } },
  { texte: "Elle apprend le tour chez une potière de Bargny, puis part à Dakar étudier aux Beaux-Arts, où elle découvre les émaux colorés et les cuissons au bois.", titre: "L'atelier de Rufisque", colonnes: 6, nombre: 18, reglages: { duree: 0.8, courbe: "expo", echelle: 1.5, rotationMax: 8, ecart: 100, distanceMax: 2000 } },
  { texte: "Ses bols et ses jarres voyagent de la Biennale de Dakar aux galeries de Saint-Louis, toujours cuits dans le même four de briques.", titre: "Expositions", colonnes: 7, nombre: 21, etroite: true, reglages: { duree: 1, courbe: "elastic.out(0.5)", echelle: 3, rotationMax: 20, ecart: 150, distanceMax: 700 } },
  { texte: "Aujourd'hui, l'atelier accueille douze apprenties chaque année et une boutique ouverte le samedi, au bord de la route nationale.", titre: "Aujourd'hui", colonnes: 13, nombre: 39, reglages: { duree: 0.6, courbe: "power3", cisaillement: 10, echelle: 3.2, rotationMax: 10 } },
];

export default function PageAtelier() {
  let compteur = 0;
  return (
    <div className="atelier-ceramique">
      <style>{CSS}</style>
      <header className="cadre-haut"><b>Grille qui s'écarte</b><a href="#">Article</a><a href="#">Toutes les démos</a></header>
      <main className="contenu">
        {SECTIONS.map((s) => {
          const debut = compteur;
          compteur += s.nombre;
          return (
            <section key={s.titre}>
              <p className="texte">{s.texte}</p>
              <h3 className="titre">{s.titre}</h3>
              <GrilleEcartee colonnes={s.colonnes} etroite={s.etroite} reglages={s.reglages}
                elements={Array.from({ length: s.nombre }, (_, k) => <Piece n={debut + k} />)} />
              <a className="plus" href="#">voir plus</a>
            </section>
          );
        })}
      </main>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300&family=Inter:wght@400;700&display=swap');
.atelier-ceramique{--texte:#000;--fond:#EDEDED;background:var(--fond);color:var(--texte);font:400 16px/1.4 Inter,system-ui,sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
.atelier-ceramique *{box-sizing:border-box}
.cadre-haut{display:flex;gap:1.5rem;padding:1.5rem 2rem;font-size:14px}.cadre-haut a{color:inherit;text-decoration:underline}
.contenu{display:flex;flex-direction:column;padding:0 2rem}
.texte{font:300 clamp(1rem,5vw,2.5rem)/1.1 Fraunces,Georgia,serif;margin:2rem 0 0;max-width:1350px;hyphens:auto}
.titre{font-weight:400;margin:2.5rem 0 0;font-size:1rem}
.grille-ecartee{width:92%;margin:2rem auto;display:grid;gap:1rem;pointer-events:none}
.grille-ecartee.etroite{width:60%}
.piece{position:relative;margin:0;padding:0;border:0;background:none;will-change:transform;pointer-events:auto;cursor:pointer;aspect-ratio:1/1.25;display:block}
.piece svg{display:block}
.plus{align-self:flex-end;display:block;text-align:right;font-weight:700;color:inherit;margin-bottom:2rem}
@media (max-width:848px){.grille-ecartee{grid-template-columns:repeat(4,1fr)!important;width:100%}.grille-ecartee.etroite{width:100%}}
`;
