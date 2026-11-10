/**
 * Modèle 10 — Grille 3D avec aperçu de contenu
 * Adapté de « 3D Grid Interaction with Content Preview » de Codrops (licence MIT, © 2009-2020 Codrops,
 * https://github.com/codrops/3DGridContentPreview). Disposition (16 vignettes sur une grille de 50 × 50),
 * inclinaisons, parallaxe, effet magnétique, curseur et séquences d'ouverture et de fermeture repris du code
 * d'origine (GSAP) et réécrits avec `motion` ; affiches dessinées en SVG à la place des photos.
 *
 * Dépendances : react 18+, motion 11+ (`npm i motion`). Polices : Inter, Archivo Black.
 */
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { animate } from "motion";

/* Courbes GSAP d'origine, converties en Bézier. */
const EXPO = [0.16, 1, 0.3, 1] as const; // « expo » (sortie)
const EXPO_IO = [0.87, 0, 0.13, 1] as const; // « expo.inOut »
const POWER1 = [0.25, 0.46, 0.45, 0.94] as const; // « power1 » (sortie)
const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;
const carte = (x: number, a: number, b: number, c: number, d: number) => ((x - a) * (d - c)) / (b - a) + c;
const auHasard = (a: number, b: number) => Math.random() * (b - a) + a;

/* ====================================================================== */
/* Données                                                                 */
/* ====================================================================== */
type Evenement = { titre: string; lieu: string; date: string; texte: string; fond: string; encre: string; accent: string; ligne: number; colonne: number };
/** Positions relevées sur la démo d'origine (rangée / colonne de départ, chaque vignette couvre 12 rangées × 5 colonnes). */
const POSITIONS: [number, number][] = [[10, 1], [1, 18], [1, 29], [15, 12], [17, 25], [20, 43], [35, 5], [40, 14], [37, 29], [35, 42], [1, 44], [32, 20], [22, 2], [9, 38], [4, 7], [28, 36]];
const BASE: Omit<Evenement, "ligne" | "colonne">[] = [
  { titre: "Sabar Nocturne", lieu: "Place du Souvenir, Dakar", date: "14/11/2026", texte: "Une nuit entière de sabar sur l'esplanade : douze batteurs, des danseuses de Pikine et un final au lever du soleil face à l'océan.", fond: "#E8452C", encre: "#1B0B06", accent: "#F6C343" },
  { titre: "Kora Lab", lieu: "Institut français, Dakar", date: "16/11/2026", texte: "Atelier ouvert puis concert : la kora rencontre les machines. On vient avec ses écouteurs, on repart avec un morceau enregistré.", fond: "#1F3B73", encre: "#F2E9DA", accent: "#6FC3DF" },
  { titre: "Biennale Off", lieu: "Médina, Dakar", date: "18/11/2026", texte: "Trente ateliers d'artistes ouverts dans les cours de la Médina, avec un plan à retirer au marché Tilène.", fond: "#F2D7B6", encre: "#2A1A10", accent: "#C2502B" },
  { titre: "Gorée Jazz", lieu: "Île de Gorée", date: "21/11/2026", texte: "Trois scènes au bord de l'eau, dernière chaloupe à 23 h 30. Prévoir une veste pour le retour.", fond: "#0E1A2B", encre: "#E7D9B5", accent: "#E0A23B" },
  { titre: "Ndawrabine", lieu: "Théâtre Daniel Sorano", date: "22/11/2026", texte: "Chants et danses lébous revisités par une troupe de vingt jeunes de Ouakam et Yoff.", fond: "#7A2E5A", encre: "#FBE3EF", accent: "#F59BC2" },
  { titre: "Cinéma Plein Air", lieu: "Corniche Ouest", date: "24/11/2026", texte: "Écran géant face à la mer : trois courts métrages sénégalais puis un classique restauré.", fond: "#2E5E4E", encre: "#EAF4E9", accent: "#B7E07A" },
  { titre: "Xalam Session", lieu: "Just 4 U, Dakar", date: "26/11/2026", texte: "Le xalam au centre de la scène, entouré de basse, batterie et voix. Places assises limitées.", fond: "#D9C84A", encre: "#1E1A05", accent: "#3A3A3A" },
  { titre: "Marché des Créateurs", lieu: "Village des Arts", date: "28/11/2026", texte: "Mode, céramique, maroquinerie : quarante créateurs de la région, paiement Wave accepté sur tous les stands.", fond: "#ECECEC", encre: "#111111", accent: "#E3154D" },
  { titre: "Slam Teranga", lieu: "Maison de la Culture Douta Seck", date: "29/11/2026", texte: "Scène ouverte de slam en wolof et en français ; inscription sur place jusqu'à 19 h.", fond: "#3B2A6B", encre: "#EDE7FF", accent: "#9C86F2" },
  { titre: "Danse Contemporaine", lieu: "École des Sables, Toubab Dialaw", date: "30/11/2026", texte: "Restitution de fin de résidence : six chorégraphes, une heure de route, un retour en navette.", fond: "#C9A27E", encre: "#2B1D12", accent: "#FFFFFF" },
  { titre: "Mbalax Classics", lieu: "Grand Théâtre National", date: "02/12/2026", texte: "Les grands titres des années 80 et 90 rejoués par un orchestre de quatorze musiciens.", fond: "#0B5C8C", encre: "#E6F3FB", accent: "#F2C14E" },
  { titre: "Photo Dakar", lieu: "Galerie Le Manège", date: "04/12/2026", texte: "Vingt ans de photographie de rue à Dakar, en grand format, avec visites guidées le samedi.", fond: "#1A1A1A", encre: "#F5F5F5", accent: "#9E9E9E" },
  { titre: "Fanal", lieu: "Saint-Louis", date: "06/12/2026", texte: "Défilé des lanternes géantes dans les rues de l'île ; départ de bus depuis Dakar à 14 h.", fond: "#F08A24", encre: "#2A1302", accent: "#FFF1D6" },
  { titre: "Tambours du Saloum", lieu: "Kaolack", date: "08/12/2026", texte: "Rencontre de percussionnistes du Sine et du Saloum, suivie d'un repas partagé.", fond: "#5A3E2B", encre: "#F7E7D4", accent: "#E9B872" },
  { titre: "Électro Baobab", lieu: "Lac Rose", date: "12/12/2026", texte: "Nuit électronique au bord du lac, navettes depuis la place de l'Obélisque toutes les heures.", fond: "#E46BA3", encre: "#2B0618", accent: "#4BE0C3" },
  { titre: "Conte sous l'Arbre", lieu: "Parc de Hann", date: "14/12/2026", texte: "Contes pour toute la famille, en wolof et en français, sous les grands arbres du parc.", fond: "#3F6B2E", encre: "#F1F6E8", accent: "#F4D35E" },
];
const EVENEMENTS: Evenement[] = BASE.map((e, i) => ({ ...e, ligne: POSITIONS[i][0], colonne: POSITIONS[i][1] }));

/** Affiche générée : quatre compositions selon l'index, couleurs de l'événement. */
function Affiche({ e, i }: { e: Evenement; i: number }) {
  const initiales = e.titre.split(" ").map((m) => m[0]).join("").slice(0, 2).toUpperCase();
  const motif = i % 4;
  return (
    <svg viewBox="0 0 100 150" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden>
      <rect width="100" height="150" fill={e.fond} />
      {motif === 0 && <><circle cx="70" cy="45" r="38" fill={e.accent} /><circle cx="30" cy="105" r="22" fill="none" stroke={e.encre} strokeWidth="2" /></>}
      {motif === 1 && Array.from({ length: 9 }, (_, k) => <path key={k} d={`M-10 ${20 + k * 14} Q50 ${6 + k * 14} 110 ${20 + k * 14}`} fill="none" stroke={e.accent} strokeWidth="2.5" opacity={0.35 + k * 0.07} />)}
      {motif === 2 && <><path d="M0 150 L50 40 L100 150Z" fill={e.accent} /><rect x="14" y="16" width="30" height="30" fill={e.encre} opacity=".9" /></>}
      {motif === 3 && <><rect x="0" y="0" width="50" height="150" fill={e.accent} /><circle cx="50" cy="70" r="26" fill={e.fond} stroke={e.encre} strokeWidth="2" /></>}
      <text x="8" y="140" fontFamily="'Archivo Black',Impact,sans-serif" fontSize="30" fill={e.encre}>{initiales}</text>
      <text x="8" y="12" fontFamily="Inter,sans-serif" fontSize="6" fill={e.encre} letterSpacing=".6">{e.date.slice(0, 5)}</text>
    </svg>
  );
}

/** Titre découpé en lettres (chaque lettre dans un masque pour monter et descendre). */
function Lettres({ texte, classe }: { texte: string; classe: string }) {
  return <>{[...texte].map((c, i) => <span key={i} className={`lettre ${classe}`}>{c === " " ? " " : c}</span>)}</>;
}

/* ====================================================================== */
/* Composant                                                               */
/* ====================================================================== */
type Etat = { el: HTMLElement; img: HTMLElement; rX: number; rY: number; tZ: number; haut: boolean; gauche: boolean; xs: number; ys: number; t: { x: number; y: number }; r: { x: number; y: number }; m: { x: number; y: number }; echelle: number; survol: boolean };

export default function Grille3D() {
  const racine = useRef<HTMLDivElement>(null);
  const grille = useRef<HTMLDivElement>(null);
  const curseur = useRef<SVGSVGElement>(null);
  const etiquette = useRef<HTMLSpanElement>(null);
  const [ouvert, setOuvert] = useState<number | null>(null);
  const [libelle, setLibelle] = useState("");
  const enMouvement = useRef(true);
  const occupe = useRef(false);
  const etats = useRef<Etat[]>([]);

  /* Inclinaison de départ : chaque vignette regarde le centre de l'écran (code d'origine, `layout()`). */
  useLayoutEffect(() => {
    const W = window.innerWidth, H = window.innerHeight;
    etats.current = [...grille.current!.querySelectorAll<HTMLElement>(".vignette")].map((el) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const gauche = cx < W / 2, haut = cy < H / 2;
      return {
        el, img: el.querySelector<HTMLElement>(".vignette-img")!, gauche, haut,
        rY: gauche ? carte(cx, 0, W / 2, 10, 0) : carte(cx, W / 2, W, 0, -10),
        rX: haut ? carte(cy, 0, H / 2, -5, 0) : carte(cy, H / 2, H, 0, 5),
        tZ: gauche ? carte(cx, 0, W / 2, -200, -600) : carte(cx, W / 2, W, -600, -200),
        xs: auHasard(70, 100), ys: auHasard(40, 65), t: { x: 0, y: 0 }, r: { x: 0, y: 0 }, m: { x: 0, y: 0 }, echelle: 1, survol: false,
      };
    });
  }, []);

  /* Boucle par image : parallaxe inverse (amorti 0,04), effet magnétique (0,3 × distance, amorti 0,04), curseur. */
  useEffect(() => {
    const souris = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const c = { x: souris.x, y: souris.y, tx: souris.x, ty: souris.y, s: 1 };
    const bouge = (e: PointerEvent) => { souris.x = e.clientX; souris.y = e.clientY; };
    window.addEventListener("pointermove", bouge);
    let id = 0;
    const image = () => {
      const W = window.innerWidth, H = window.innerHeight;
      let survolee = false;
      for (const s of etats.current) {
        if (enMouvement.current) {
          s.t.x = lerp(s.t.x, carte(souris.x, 0, W, -s.xs, s.xs), 0.04);
          s.t.y = lerp(s.t.y, carte(souris.y, 0, H, -s.ys, s.ys), 0.04);
          s.r.x = s.haut ? lerp(s.r.x, carte(souris.y, 0, H / 2, 5, 0), 0.04) : lerp(s.r.x, carte(souris.y, H / 2, H, 0, -5), 0.04);
          s.r.y = s.gauche ? lerp(s.r.y, carte(souris.x, 0, W / 2, -10, 0), 0.04) : lerp(s.r.y, carte(souris.x, W / 2, W, 0, 10), 0.04);
          s.el.style.transform = `translate3d(${-s.t.x}px,${-s.t.y}px,${s.tZ}px) rotateY(${-s.rY - s.r.y}deg) rotateX(${-s.rX - s.r.x}deg)`;
        }
        if (s.survol) {
          survolee = true;
          const b = s.el.getBoundingClientRect();
          s.m.x = lerp(s.m.x, (souris.x - (b.left + b.width / 2)) * 0.3, 0.04);
          s.m.y = lerp(s.m.y, (souris.y - (b.top + b.height / 2)) * 0.3, 0.04);
          s.echelle = lerp(s.echelle, 1.1, 0.09);
        } else {
          s.m.x = lerp(s.m.x, 0, 0.07);
          s.m.y = lerp(s.m.y, 0, 0.07);
          s.echelle = lerp(s.echelle, 1, 0.07);
        }
        s.img.style.transform = `translate(${s.m.x}px,${s.m.y}px) scale(${s.echelle})`;
      }
      c.x = lerp(c.x, souris.x, 0.2); c.y = lerp(c.y, souris.y, 0.2);
      c.tx = lerp(c.tx, souris.x, 0.1); c.ty = lerp(c.ty, souris.y, 0.1);
      c.s = lerp(c.s, survolee ? 1.5 : 1, 0.15);
      if (curseur.current) curseur.current.style.transform = `translate(${c.x - 40}px,${c.y - 40}px)`;
      if (curseur.current) (curseur.current.firstChild as SVGElement).style.transform = `scale(${c.s})`;
      if (etiquette.current) etiquette.current.style.transform = `translate(${c.tx + 30}px,${c.ty - 8}px)`;
      id = requestAnimationFrame(image);
    };
    id = requestAnimationFrame(image);
    return () => { cancelAnimationFrame(id); window.removeEventListener("pointermove", bouge); };
  }, []);

  /* Délais « grille, depuis le centre » ou « depuis le haut », comme le `stagger` de GSAP. */
  const delais = (total: number, depuis: "centre" | "haut") => {
    const pts = etats.current.map((s) => s.el.getBoundingClientRect()).map((r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 }));
    const W = window.innerWidth, H = window.innerHeight;
    const d = pts.map((p) => (depuis === "centre" ? Math.hypot(p.x - W / 2, p.y - H / 2) : p.y));
    const min = Math.min(...d), max = Math.max(...d);
    return d.map((v) => ((v - min) / (max - min || 1)) * total);
  };
  const cadres = () => [...grille.current!.querySelectorAll<HTMLElement>(".vignette-cadre")];

  /* Entrée : échelle 1,5 → 1 (1,2 s, expo) et opacité (1,2 s, power1), décalage de 0,4 s depuis le centre. */
  useEffect(() => {
    const d = delais(0.4, "centre");
    cadres().forEach((el, i) => {
      animate(el, { scale: [1.5, 1] }, { duration: 1.2, ease: EXPO, delay: d[i] });
      animate(el, { opacity: [0, 1] }, { duration: 1.2, ease: POWER1, delay: d[i] });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ouvrir = (i: number) => {
    if (occupe.current || ouvert !== null) return;
    occupe.current = true;
    enMouvement.current = false;
    etats.current.forEach((s) => (s.survol = false));
    setLibelle("");
    const d = delais(0.2, "haut");
    cadres().forEach((el, k) => animate(el, { y: -auHasard(1000, 1600), opacity: 0 }, { duration: 2, ease: EXPO_IO, delay: d[k] }));
    racine.current!.querySelectorAll(".titre-fond .lettre").forEach((el, k) => animate(el, { y: "-100%", opacity: 0 }, { duration: 1.5, ease: EXPO_IO, delay: 0.1 + k * 0.03 }));
    setOuvert(i);
  };

  /* Ouverture de l'aperçu, une fois rendu. */
  useEffect(() => {
    if (ouvert === null) return;
    const q = (s: string) => racine.current!.querySelector<HTMLElement>(s)!;
    q(".apercu-lettres").querySelectorAll(".lettre").forEach((el, k) => animate(el, { y: ["100%", "0%"], opacity: [0, 1] }, { duration: 1.5, ease: EXPO_IO, delay: 0.6 + k * 0.05 }));
    animate(q(".apercu-cadre"), { y: ["100%", "0%"], rotateX: [-20, 0], opacity: [0, 1] }, { duration: 1.5, ease: EXPO_IO, delay: 0.5 });
    animate(q(".apercu-photo"), { y: ["-100%", "0%"] }, { duration: 1.5, ease: EXPO_IO, delay: 0.5 });
    animate(q(".apercu-retour"), { x: ["20%", "0%"], opacity: [0, 1] }, { duration: 1.5, ease: EXPO, delay: 1.5 });
    animate(q(".apercu-texte"), { y: ["20%", "0%"], opacity: [0, 1] }, { duration: 1.5, ease: EXPO, delay: 1.5 }).then(() => (occupe.current = false));
  }, [ouvert]);

  const fermer = async () => {
    if (occupe.current || ouvert === null) return;
    occupe.current = true;
    const q = (s: string) => racine.current!.querySelector<HTMLElement>(s)!;
    const lettres = [...q(".apercu-lettres").querySelectorAll(".lettre")];
    lettres.forEach((el, k) => animate(el, { y: "100%", opacity: 0 }, { duration: 1.5, ease: EXPO_IO, delay: (lettres.length - 1 - k) * 0.04 }));
    animate(q(".apercu-cadre"), { y: "100%", rotateX: -20 }, { duration: 1.5, ease: EXPO_IO });
    animate(q(".apercu-photo"), { y: "-100%" }, { duration: 1.5, ease: EXPO_IO });
    animate(q(".apercu-retour"), { x: "20%", opacity: 0 }, { duration: 1.5, ease: EXPO_IO });
    animate(q(".apercu-texte"), { y: "50%", opacity: 0 }, { duration: 1.5, ease: EXPO_IO });
    const fond = [...racine.current!.querySelectorAll(".titre-fond .lettre")];
    fond.forEach((el, k) => animate(el, { y: "0%", opacity: 1 }, { duration: 1, ease: EXPO_IO, delay: 0.4 + (fond.length - 1 - k) * 0.03 }));
    window.setTimeout(() => {
      etats.current.forEach((s) => { s.t.y = s.r.x = s.r.y = 0; });
      enMouvement.current = true;
    }, 300);
    const d = delais(0.2, "centre");
    await Promise.all(cadres().map((el, k) => animate(el, { y: 0, opacity: 1, scale: [0.2, 1] }, { duration: 1, ease: EXPO, delay: 1 + d[k] })));
    setOuvert(null);
    occupe.current = false;
  };

  const e = ouvert !== null ? EVENEMENTS[ouvert] : null;
  return (
    <div className="grille-3d" ref={racine}>
      <style>{CSS}</style>
      <header className="cadre-haut">
        <span>Saison culturelle — Dakar</span>
        <a href="#">Billetterie</a><a href="#">Lieux</a><a href="#">Agenda</a>
      </header>
      <h2 className="titre-fond" aria-label="Novembre, décembre">
        <span className="ligne-titre l1"><Lettres texte="NOV/" classe="" /></span>
        <span className="ligne-titre l2"><Lettres texte="DÉC" classe="" /></span>
      </h2>
      <div className={ouvert !== null ? "grille inactive" : "grille"} ref={grille}>
        {EVENEMENTS.map((ev, i) => (
          <a key={ev.titre} href="#" className="vignette" style={{ "--l": ev.ligne, "--c": ev.colonne } as CSSProperties}
            onClick={(x) => { x.preventDefault(); ouvrir(i); }} aria-label={`${ev.titre}, ${ev.date}`}
            onPointerEnter={() => { etats.current[i].survol = true; setLibelle(ev.titre); }}
            onPointerLeave={() => { etats.current[i].survol = false; setLibelle(""); }}>
            <div className="vignette-cadre" style={{ opacity: 0 }}>
              <div className="vignette-img"><Affiche e={ev} i={i} /></div>
            </div>
          </a>
        ))}
      </div>

      {e && ouvert !== null && (
        <section className="apercu" aria-live="polite">
          <button className="apercu-retour" style={{ opacity: 0 }} onClick={fermer}><i aria-hidden />Retour</button>
          <div className="apercu-cadre" style={{ opacity: 0 }}>
            <div className="apercu-photo"><Affiche e={e} i={ouvert} /></div>
          </div>
          {/* Taille selon la longueur : le titre tient sur une ligne dans 85 % de la largeur. */}
          <h3 className="apercu-lettres" style={{ fontSize: `min(20vh, ${Math.min(9, 85 / (0.72 * e.titre.length)).toFixed(2)}vw)` }}><Lettres texte={e.titre} classe="" /></h3>
          <div className="apercu-texte" style={{ opacity: 0 }}>
            <p className="meta"><span>{e.lieu}</span><span>{e.date}</span></p>
            <p>{e.texte}</p>
            <button className="infos">+ Infos</button>
            <button className="reserver">Réserver</button>
          </div>
        </section>
      )}

      <svg className="curseur" ref={curseur} width="80" height="80" viewBox="0 0 80 80" aria-hidden>
        <circle cx="40" cy="40" r="20" />
      </svg>
      <span className="curseur-texte" ref={etiquette} aria-hidden>{libelle}</span>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500&display=swap');
.grille-3d{--texte:#000;--texte-doux:#848484;--titre:#d3d3d3;--fond:#DCDCDC;--lien:#E3154D;position:relative;height:100vh;overflow:hidden;
background:var(--fond);color:var(--texte);font:400 16px/1.3 Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.grille-3d,.grille-3d *{box-sizing:border-box}
.grille-3d button{font:inherit;cursor:pointer;background:none;border:0;padding:0;color:inherit}
.cadre-haut{position:absolute;z-index:5;top:1.5rem;left:1.5rem;display:flex;gap:1.5rem;font-size:14px}
.cadre-haut a{color:var(--lien);text-decoration:underline}.cadre-haut a:hover{color:var(--texte)}
.titre-fond{position:absolute;inset:0;margin:0;display:flex;flex-direction:column;justify-content:center;align-items:center;
font:400 12vw/1 'Archivo Black',Impact,sans-serif;color:var(--titre);text-transform:uppercase;pointer-events:none}
.ligne-titre{display:block;overflow:hidden;line-height:1}.l1{margin-left:-5vw}.l2{margin-right:-5vw}
.lettre{display:inline-block;will-change:transform}
.grille{position:absolute;width:120%;height:120%;top:-10%;left:-10%;display:grid;grid-template-columns:repeat(50,2%);grid-template-rows:repeat(50,2%);perspective:1000px}
.grille.inactive{pointer-events:none}
.vignette{position:relative;will-change:transform;grid-area:var(--l)/var(--c)/span 12/span 5;display:block}
.vignette-cadre{width:100%;height:100%}
.vignette-img{width:100%;height:100%;border-radius:10px;overflow:hidden;will-change:transform}
.vignette-img svg{display:block}
.apercu{position:absolute;inset:0;z-index:4;display:grid;grid-template-columns:min(33vw,480px) 1fr;grid-template-rows:auto 1fr;column-gap:3rem;padding:12vh 7.5vw 0;perspective:1000px}
.apercu-retour{grid-column:1/-1;justify-self:start;display:flex;align-items:center;gap:.8rem;text-transform:uppercase;font-size:.8rem;font-weight:500;margin-bottom:1rem}
.apercu-retour i{display:block;width:60px;height:1px;background:currentColor;position:relative}
.apercu-retour i::before{content:"";position:absolute;left:0;top:-3px;width:7px;height:7px;border-left:1px solid;border-bottom:1px solid;transform:rotate(45deg)}
.apercu-cadre{grid-row:2;height:75vh;border-radius:10px;overflow:hidden;transform-origin:50% 100%}
.apercu-photo{width:100%;height:100%}
.apercu-lettres{position:absolute;left:7.5vw;top:calc(12vh + 2.6rem);margin:0;font:400 clamp(1.5rem,9vw,20vh)/1 'Archivo Black',Impact,sans-serif;overflow:hidden;white-space:nowrap;pointer-events:none;z-index:2}
.apercu-texte{grid-row:2;align-self:start;margin-top:calc(clamp(1.5rem,9vw,20vh) + 1rem);max-width:340px;line-height:1.35}
.meta{color:var(--texte-doux);text-transform:uppercase;font-size:.8rem;display:grid}
.infos{display:block;color:var(--lien);margin:1rem 0}
.grille-3d .reserver{background:#000;color:#fff;border-radius:2rem;text-transform:uppercase;font-size:.85rem;font-weight:500;padding:1rem 2rem}
.curseur{position:fixed;left:0;top:0;pointer-events:none;z-index:10;overflow:visible}
.curseur circle{fill:none;stroke:var(--lien);stroke-width:1px;transform-origin:50% 50%;vector-effect:non-scaling-stroke}
.curseur-texte{position:fixed;left:0;top:0;z-index:10;pointer-events:none;font-size:.8rem;text-transform:uppercase;white-space:nowrap}
@media (hover:none){.curseur,.curseur-texte{display:none}}
@media (max-width:760px){.apercu{grid-template-columns:1fr;padding-top:10vh}.apercu-cadre{height:40vh}.apercu-texte{grid-row:3;margin-top:1rem}}
@media (prefers-reduced-motion:reduce){.vignette-cadre{opacity:1!important}}
`;
