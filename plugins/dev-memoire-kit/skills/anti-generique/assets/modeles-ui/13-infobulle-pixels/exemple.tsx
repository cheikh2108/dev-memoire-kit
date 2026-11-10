/**
 * Modèle 13 — Infobulle en pixels (six effets, dont un « gluant »)
 * Adapté de « Pixel Gooey Tooltip » (Segmented Tooltip Animation) de Codrops (licence MIT,
 * © 2009-2022 Codrops, https://github.com/codrops/PixelGooeyTooltip). Fond de l'infobulle découpé en
 * cellules ; six façons de les faire apparaître ; texte qui « grésille » ensuite. Effets, grilles, délais,
 * filtre et animation de grésillement repris du code d'origine (GSAP) et réécrits avec `motion` ;
 * texte, cadre et globe originaux.
 *
 * Dépendances : react 18+, motion 11+ (`npm i motion`). Police : VT323 (pixel).
 */
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { animate } from "motion";

const expo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)); // « expo » de GSAP
export type Effet = 1 | 2 | 3 | 4 | 5 | 6;

/* ====================================================================== */
/* Délais « grille » (comme le `stagger` de GSAP : distance en cellules × pas) */
/* ====================================================================== */
type Depuis = "debut" | "fin" | "centre" | "bords" | "hasard";
function delais(rangs: number, cols: number, pas: number, depuis: Depuis) {
  const n = rangs * cols;
  if (depuis === "debut") return Array.from({ length: n }, (_, i) => i * pas);
  if (depuis === "fin") return Array.from({ length: n }, (_, i) => (n - 1 - i) * pas);
  const cx = (cols - 1) / 2, cy = (rangs - 1) / 2;
  const d = Array.from({ length: n }, (_, i) => Math.hypot((i % cols) - cx, Math.floor(i / cols) - cy));
  const max = Math.max(...d);
  if (depuis === "centre") return d.map((v) => v * pas);
  if (depuis === "bords") return d.map((v) => (max - v) * pas);
  return d.map(() => Math.random() * max * pas);
}
const auHasard = (a: number, b: number) => Math.random() * (b - a) + a;

/* ====================================================================== */
/* Infobulle                                                               */
/* ====================================================================== */
type Donnees = { titre: string; texte: string; rangs: number; cols: number; effet: Effet; variante?: boolean };

function Infobulle({ d, ouverte, souris, idFiltre }: { d: Donnees; ouverte: boolean; souris: { x: number; y: number }; idFiltre: string }) {
  const racine = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [gresille, setGresille] = useState<[boolean, boolean]>([false, false]);
  const premier = useRef(true);

  useEffect(() => {
    if (premier.current) { premier.current = false; return; }
    const el = racine.current!;
    const cellules = [...el.querySelectorAll<HTMLElement>(".cellule")];
    const textes = [...el.querySelectorAll<HTMLElement>(".bulle-titre, .bulle-texte")];
    const minuteries: number[] = [];
    let annule = false;
    const duree = d.effet === 6 ? 0.9 : 0.1;
    const o = ouverte;
    if (o) { setVisible(true); el.style.zIndex = "99999"; } else el.style.zIndex = "0";

    /* Cellules : départ, arrivée et délais selon l'effet. */
    let ds: number[] = [];
    let de: Record<string, number>[] = cellules.map(() => ({ opacity: 0 }));
    let a: Record<string, number> = { opacity: 1 };
    switch (d.effet) {
      case 1: {
        const W = document.documentElement.scrollWidth, H = document.documentElement.scrollHeight;
        const max = Math.hypot(W, H);
        ds = cellules.map((c) => { const r = c.getBoundingClientRect(); return (Math.hypot(r.left - souris.x, r.top - souris.y) / max) * 1.8; });
        break;
      }
      case 2: ds = delais(d.rangs, d.cols, 0.02, o ? "debut" : "fin"); de = cellules.map(() => ({ opacity: 0, scale: 0 })); a = { opacity: 1, scale: 1 }; break;
      case 3: ds = delais(d.rangs, d.cols, 0.03, "centre"); de = cellules.map(() => ({ opacity: 0, scale: 0, y: auHasard(-200, 200) })); a = { opacity: 1, scale: 1, y: 0 }; break;
      case 4: ds = delais(d.rangs, d.cols, 0.02, "hasard"); de = cellules.map(() => ({ opacity: 0, scaleX: 0.8, x: auHasard(-200, 200) })); a = { opacity: 1, scaleX: 1, x: 0 }; break;
      case 5: ds = delais(d.rangs, d.cols, 0.02, o ? "centre" : "bords"); de = cellules.map(() => ({ opacity: 0, scale: 0 })); a = { opacity: 1, scale: 1 }; break;
      case 6: ds = delais(d.rangs, d.cols, o ? 0.08 : 0.04, "hasard"); de = cellules.map(() => ({ opacity: 0, scale: 0.3 })); a = { opacity: 1, scale: 1 }; break;
    }
    /* y et x sont en pourcentage de la cellule, comme `yPercent` / `xPercent`. */
    const enStyle = (v: Record<string, number>) => Object.fromEntries(Object.entries(v).map(([k, n]) => [k, k === "x" || k === "y" ? `${n}%` : n]));
    const fins = cellules.map((c, i) => {
      const depart = enStyle(de[i]), arrivee = enStyle(a);
      const valeurs = Object.fromEntries(Object.keys(arrivee).map((k) => [k, o ? [depart[k], arrivee[k]] : [arrivee[k], depart[k]]]));
      return animate(c, valeurs, { duration: duree, ease: expo, delay: ds[i] }).then(() => undefined);
    });
    /* Texte : apparaît à 0,4 s (0,2 s, décalage 0,2 s), puis grésille à 0,8 s (titre) et 1 s (texte). */
    textes.forEach((t, i) => animate(t, { opacity: o ? [0, 1] : [1, 0] }, { duration: 0.2, delay: o ? 0.4 + i * 0.2 : 0, ease: expo }));
    if (o) {
      minuteries.push(window.setTimeout(() => setGresille([true, false]), 800));
      minuteries.push(window.setTimeout(() => setGresille([true, true]), 1000));
    } else setGresille([false, false]);
    Promise.all(fins).then(() => { if (!annule && !o) setVisible(false); });
    return () => { annule = true; minuteries.forEach(clearTimeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouverte]);

  /* Position : au pointeur, retournée si l'infobulle sortirait de l'écran. */
  const [pos, setPos] = useState({ left: 0, top: 0 });
  useEffect(() => {
    const el = racine.current;
    if (!el || !ouverte) return;
    const w = el.offsetWidth, h = el.offsetHeight;
    let left = souris.x, top = souris.y;
    if (souris.x + w > window.innerWidth) left = souris.x - w;
    if (souris.y + h > window.innerHeight) top = souris.y - h;
    setPos({ left: Math.max(0, left), top: Math.max(0, top) });
  }, [souris, ouverte]);

  return (
    <div ref={racine} className={`bulle${d.variante ? " variante" : ""}${visible ? " visible" : ""}`} style={{ ...pos, "--cols": d.cols, "--rangs": d.rangs } as CSSProperties} role="tooltip">
      <div className="bulle-fond" style={d.effet === 6 ? { filter: `url(#${idFiltre})` } : undefined}>
        {Array.from({ length: d.rangs * d.cols }, (_, i) => <div key={i} className="cellule" style={{ opacity: 0 }} />)}
      </div>
      <div className="bulle-contenu">
        <h3 className={`bulle-titre${gresille[0] ? " gresille" : ""}`} style={{ opacity: 0 }}>{d.titre}</h3>
        <p className={`bulle-texte${gresille[1] ? " gresille" : ""}`} style={{ opacity: 0 }}>{d.texte}</p>
      </div>
    </div>
  );
}

/** Mot déclencheur : ouvre son infobulle au survol (ou au toucher), 40 ms après l'entrée. */
export function Declencheur({ d, children, idFiltre }: { d: Donnees; children: ReactNode; idFiltre: string }) {
  const [ouverte, setOuverte] = useState(false);
  const [souris, setSouris] = useState({ x: 0, y: 0 });
  const minuterie = useRef(0);
  return (
    <>
      <span className="declencheur" tabIndex={0}
        onPointerEnter={(e) => { clearTimeout(minuterie.current); const p = { x: e.clientX, y: e.clientY }; minuterie.current = window.setTimeout(() => { setSouris(p); setOuverte(true); }, 40); }}
        onPointerMove={(e) => ouverte && setSouris({ x: e.clientX, y: e.clientY })}
        onPointerLeave={() => { clearTimeout(minuterie.current); minuterie.current = window.setTimeout(() => setOuverte(false), 40); }}
        onFocus={(e) => { const r = e.currentTarget.getBoundingClientRect(); setSouris({ x: r.left, y: r.bottom }); setOuverte(true); }}
        onBlur={() => setOuverte(false)}>{children}</span>
      <Infobulle d={d} ouverte={ouverte} souris={souris} idFiltre={idFiltre} />
    </>
  );
}

/* ====================================================================== */
/* Démonstration : journal de bord, Dakar 2085                             */
/* ====================================================================== */
const INFOBULLES: Record<string, Donnees> = {
  synchro: { titre: "Synchro 2085", texte: "Protocole qui relie chaque conscience au réseau de la ville. Il garantit une présence continue, sans coupure, d'un quartier à l'autre.", rangs: 12, cols: 10, effet: 1 },
  liens: { titre: "Liens-Teranga", texte: "Conduits à double sens entre les habitants : on y échange des pensées, des émotions et l'hospitalité, sans jamais se voir.", rangs: 9, cols: 3, effet: 2, variante: true },
  baobab: { titre: "Baobab-Mère", texte: "Nom interdit de l'arbre qui veillait sur la presqu'île. On ne le trouve plus que dans les archives scellées.", rangs: 8, cols: 6, effet: 3 },
  champ: { titre: "Champ Libre", texte: "Programme qui ne fut pas toujours une simulation : une étendue où l'on pouvait marcher jusqu'à la mer.", rangs: 1, cols: 14, effet: 4, variante: true },
  ondes: { titre: "Ondes Sabar", texte: "Rythmes diffusés toute la journée pour apaiser la ville, et faire oublier le son des vrais tambours.", rangs: 8, cols: 12, effet: 5 },
  defrag: { titre: "Défragmenteurs", texte: "Ceux qui franchissent les jardins pare-feu pour retrouver le désordre et la beauté d'avant.", rangs: 5, cols: 3, effet: 6 },
};

function Globe() {
  return (
    <svg className="globe" viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="60" r="48" />
      {[0, 1, 2, 3, 4, 5].map((k) => <ellipse key={k} cx="60" cy="60" rx="48" ry="48" className="meridien" style={{ animationDelay: `${-k * 1.2}s` }} />)}
      {[-30, 0, 30].map((y) => <ellipse key={y} cx="60" cy={60 + y} rx={Math.sqrt(48 * 48 - y * y)} ry="5" className="parallele" />)}
    </svg>
  );
}

export default function JournalPixels() {
  const id = useId().replace(/:/g, "");
  const filtre = `gluant${id}`;
  const T = (k: keyof typeof INFOBULLES, mot: string) => <Declencheur d={INFOBULLES[k]} idFiltre={filtre}>{mot}</Declencheur>;
  return (
    <main className="journal">
      <style>{CSS}</style>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id={filtre}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="10.2" result="flou" />
          <feColorMatrix in="flou" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7" result="gluant" />
          <feComposite in="SourceGraphic" in2="gluant" operator="atop" />
        </filter>
      </svg>
      <div className="cadre panneau">
        <h1>Infobulle segmentée</h1>
        <a href="#">[Démo précédente]</a>
        <a href="#">[Article]</a>
      </div>
      <article className="texte panneau">
        <p>En l'an de la {T("synchro", "Synchro 2085")}, je consigne ces pensées dans ma coque de circuits, dernier abri d'un esprit non relié. On dit que le grand réseau est une libération, mais l'air que je respire semble emprunté, et la lumière du soleil n'est plus qu'une chaleur de diodes.</p>
        <p>Autrefois, nous dansions sur le sable de Yoff, les pieds dans l'écriture de la terre. Aujourd'hui, nos pas résonnent en silence sur la Grille. Plus de sable, plus de pierre, seulement le bourdonnement des flux. Nous ne nous touchons plus : nous passons par les {T("liens", "Liens-Teranga")}, nos émotions filtrées par l'Interface.</p>
        <p>Le système Gardien surveille, les Gardiens du Pouls veillent à l'ordre, et dans le silence de la nuit j'entends pleurer le {T("baobab", "Baobab-Mère")} — un nom interdit, une relique dont se souviennent ceux qui osent ouvrir les archives scellées. Nous parlons à des avatars, nos visages pixelisés jusqu'à la perfection.</p>
        <p>Je me souviens de récits chiffrés dans les vieilles langues, C++ et Python, d'un temps où le ciel n'était pas un dôme de projections mais une toile de bleus. On dit que le programme {T("champ", "Champ Libre")} ne fut pas toujours une simulation : une étendue où le vent composait et où la pluie jouait sa propre musique.</p>
        <p>Ils ont codé le fleuve en circuits d'eau et les arbres en grappes de données. Nous nous nourrissons de sachets nutritifs, plus du mil des champs. Les {T("ondes", "Ondes Sabar")} jouent toute la journée, une berceuse pour calmer, pour faire taire le désir d'une réalité que nous n'aurions jamais dû céder.</p>
        <p>En rêve, je franchis les jardins pare-feu, un lieu dont on parle à voix basse chez les {T("defrag", "Défragmenteurs")}. Un lieu où le code se dissout et où la beauté brute revient — le chaos dans ce qu'il a de plus terrible et de plus majestueux. Les Anciens du Réseau en parlent comme d'une fable du Temps d'Avant.</p>
      </article>
      <aside className="meta m1 panneau petit gresille gresille-2">
        <ul><li>// Fragment de mémoire — entrée 2085-11</li><li>Origine : Codex Teranga</li><li>Niveau d'accès : Oméga</li><li>Cryptage : Quantique-X</li><li>Implant de données : 0x7F3A</li></ul>
      </aside>
      <aside className="meta m2 panneau petit gresille gresille-1">
        <ul><li>// Alerte système : brèche détectée</li><li>Niveau : critique</li><li>Source : terminal du Codex</li><li>Protocole de sécurité : en cours</li><li>Accès non autorisé aux archives restreintes</li><li>Directive : purge immédiate</li><li>Échec de la purge</li><li>Fin de l'alerte</li></ul>
      </aside>
      <aside className="meta m3 panneau"><Globe /></aside>
      <aside className="meta m4 panneau"><b>Codex Teranga</b><span>version 24.85-102</span></aside>
    </main>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
.journal{--texte:#8572b2;--fond:#0f0026;--lien:#abcb1a;--declencheur:#d2d2d2;--bord:#4d25b0;--meta:#58487e;
min-height:100vh;background:var(--fond);color:var(--texte);font:400 20px/1.15 VT323,ui-monospace,monospace;text-transform:uppercase;
display:grid;gap:1rem;padding:1rem;grid-template-columns:1fr 50vw 1fr;grid-template-rows:auto auto 1fr;
grid-template-areas:'cadre texte m4' 'm2 texte m3' 'm2 texte m1';-webkit-font-smoothing:none}
.journal *{box-sizing:border-box}
.panneau{border:1px solid var(--bord);padding:1rem;position:relative}
.panneau::before{content:"";position:absolute;top:-1px;left:-1px;width:8px;height:8px;border-top:1px solid var(--lien);border-left:1px solid var(--lien)}
.cadre{grid-area:cadre;display:flex;flex-direction:column;gap:.2rem}
.cadre h1{font-size:inherit;font-weight:400;margin:0 0 .5rem}
.cadre a,.journal a{color:var(--lien);text-decoration:none}.cadre a:hover{color:#fff}
.texte{grid-area:texte;max-height:calc(100vh - 2rem);overflow:auto;scrollbar-width:thin;scrollbar-color:var(--lien) transparent}
.texte p{margin:0 0 1rem}
.declencheur{color:var(--declencheur);cursor:pointer;user-select:none;outline:none}
.declencheur:hover,.declencheur:focus-visible{color:#fff}
.meta{font-size:15px;color:var(--meta)}.meta ul{list-style:none;margin:0;padding:0}.meta li{margin-bottom:.35rem}
.m1{grid-area:m1;align-self:end}.m2{grid-area:m2}.m3{grid-area:m3;display:grid;place-items:center}.m4{grid-area:m4;display:flex;flex-direction:column;color:var(--texte)}
.m4 b{font-weight:400;color:#fff;font-size:24px}
.globe{width:min(70%,180px);fill:none;stroke:var(--lien);stroke-width:.6}
.globe .meridien{animation:meridien 7.2s linear infinite}
.globe .parallele{opacity:.6}
@keyframes meridien{0%{rx:48}50%{rx:0}100%{rx:48}}
.bulle{--fond-bulle:#4d25b0;--texte-bulle:#abcb19;position:fixed;pointer-events:none;opacity:0;width:290px;height:330px;display:grid;grid-template-areas:'b'}
.bulle.variante{--fond-bulle:#94ad24;--texte-bulle:#2e3023}
.bulle.visible{opacity:1}
.bulle-fond{grid-area:b;display:grid;grid-template-columns:repeat(var(--cols),1fr);grid-template-rows:repeat(var(--rangs),1fr)}
.cellule{background:var(--fond-bulle);outline:1px solid var(--fond-bulle)}
.bulle-contenu{grid-area:b;color:var(--texte-bulle);position:relative;padding:2rem;display:flex;flex-direction:column;gap:.5rem}
.bulle-titre{font-weight:400;margin:0;font-size:2rem}
.bulle-texte{margin:auto 0 0}
.gresille{animation:gresille 4s linear infinite}.gresille-1{animation-delay:16s}.gresille-2{animation-delay:12s}
@keyframes gresille{
0%{transform:translate3d(-5px,0,0) scale3d(-1,-1,1);clip-path:polygon(0 20%,100% 20%,100% 21%,0 21%)}
2%{clip-path:polygon(0 33%,100% 33%,100% 33%,0 33%)}4%{clip-path:polygon(0 44%,100% 44%,100% 44%,0 44%)}
5%{clip-path:polygon(0 50%,100% 50%,100% 20%,0 20%)}6%{clip-path:polygon(0 70%,100% 70%,100% 70%,0 70%)}
7%{clip-path:polygon(0 80%,100% 80%,100% 80%,0 80%)}8%{clip-path:polygon(0 50%,100% 50%,100% 55%,0 55%)}
9%{clip-path:polygon(0 70%,100% 70%,100% 80%,0 80%)}9.9%{transform:translate3d(-5px,0,0) scale3d(-1,-1,1)}
10%,100%{transform:translate3d(0,0,0) scale3d(1,1,1);clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}}
@media (max-width:848px){.journal{grid-template-columns:1fr;grid-template-areas:'cadre' 'texte' 'm3';font-size:18px}.m1,.m2,.m4{display:none}.texte{max-height:none}.bulle{width:200px;height:250px}.bulle-contenu{padding:1rem}.bulle-titre{font-size:1.5rem}}
@media (prefers-reduced-motion:reduce){.gresille,.globe .meridien{animation:none}}
`;
