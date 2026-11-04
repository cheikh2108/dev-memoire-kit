/**
 * Modèle 08 — Barres d'onglets en verre (4 variantes)
 * Reconstruction originale (code et décor réécrits) d'après une démonstration vidéo publique
 * de barres de navigation « en verre » posées sur une scène de salon :
 *   1. BarreNeon       — trait néon qui longe le bas de la barre et se soulève en cloche sous l'onglet actif
 *   2. BarreProjecteur — petit projecteur sur le bord haut, cône de lumière sur l'icône active
 *   3. BarreCreux      — pastille ronde de l'onglet actif posée dans un creux du bord haut
 *   4. BarreGoutte     — l'icône choisie monte comme une goutte de liquide, se détache puis retombe
 * Mesures relevées sur la vidéo (1080 px de large) puis ramenées à l'échelle 0,6.
 *
 * Dépendances : react 18+, motion 11+ (`npm i motion`). Police : Inter.
 */
import { useEffect, useId, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useTransform } from "motion/react";

/** Courbes relevées : les changements d'onglet durent 0,25 à 0,3 s, sans rebond visible (barres 1 à 3). */
const GLISSE = { type: "spring", stiffness: 420, damping: 38, mass: 0.9 } as const;
const SORTIE = [0.22, 1, 0.36, 1] as const;
const TURQUOISE = "#5FE3C8";

/* ====================================================================== */
/* Icônes                                                                  */
/* ====================================================================== */
const TRACES = {
  maison: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z",
  loupe: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4",
  plus: "M12 5v14M5 12h14",
  bulle: "M4 12a8 8 0 1 1 3.3 6.5L4 20l1.2-3.6A8 8 0 0 1 4 12Z",
  personne: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 21a7 7 0 0 1 14 0",
  coeur: "M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z",
  ajout: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 8v8M8 12h8",
  cloche: "M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0",
  croix: "M7 7l10 10M17 7 7 17",
};
type NomIcone = keyof typeof TRACES;
function Icone({ n, t = 22, plein, epais = 1.8 }: { n: NomIcone; t?: number; plein?: boolean; epais?: number }) {
  return (
    <svg width={t} height={t} viewBox="0 0 24 24" fill={plein ? "currentColor" : "none"} stroke="currentColor" strokeWidth={epais} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={TRACES[n]} />
    </svg>
  );
}

type Onglet = { id: string; icone: NomIcone; libelle: string; pastille?: boolean };
const ONGLETS_NEON: Onglet[] = [
  { id: "accueil", icone: "maison", libelle: "Accueil" },
  { id: "chercher", icone: "loupe", libelle: "Chercher" },
  { id: "creer", icone: "plus", libelle: "Créer" },
  { id: "messages", icone: "bulle", libelle: "Messages", pastille: true },
  { id: "profil", icone: "personne", libelle: "Profil" },
];
const ONGLETS_ICONES: Onglet[] = [
  { id: "accueil", icone: "maison", libelle: "Accueil" },
  { id: "favoris", icone: "coeur", libelle: "Favoris" },
  { id: "ajouter", icone: "ajout", libelle: "Ajouter" },
  { id: "profil", icone: "personne", libelle: "Profil" },
  { id: "alertes", icone: "cloche", libelle: "Alertes" },
];

/* Échelle commune : barre de 500 px, 5 onglets de 100 px. */
const L = 500;
const PAS = L / 5;
const centre = (i: number) => PAS * i + PAS / 2;
/** Cloche douce : 1 au centre, 0 à |u| ≥ 1. */
const cloche = (u: number) => (Math.abs(u) >= 1 ? 0 : (1 + Math.cos(Math.PI * u)) / 2);
/** Suit une valeur cible avec le ressort commun. */
function useSuivi(cible: number) {
  const v = useMotionValue(cible);
  useEffect(() => {
    const a = animate(v, cible, GLISSE);
    return () => a.stop();
  }, [cible, v]);
  return v;
}

/* ====================================================================== */
/* 1. Trait néon en cloche + champ de recherche                           */
/* ====================================================================== */
export function BarreNeon({ onglets = ONGLETS_NEON }: { onglets?: Onglet[] }) {
  const [actif, setActif] = useState(0);
  const H = 70, R = H / 2, BOSSE = 51, HAUT = 5;
  const cx = useSuivi(centre(actif));
  /* Trait : bas de la barre, remonte dans les deux coins, et se soulève en cloche sous l'onglet actif. */
  const trace = (c: number, ferme: boolean) => {
    const pts: string[] = [];
    for (let x = 5; x <= L - 5; x += 2) {
      const coin = x < R ? R + Math.sqrt(Math.max(0, (R - 1.5) ** 2 - (R - x) ** 2)) : x > L - R ? R + Math.sqrt(Math.max(0, (R - 1.5) ** 2 - (x - (L - R)) ** 2)) : H - 1.5;
      const bosse = H - 1.5 - (H - 1.5 - HAUT) * cloche((x - c) / BOSSE);
      pts.push(`${x},${Math.min(coin, bosse).toFixed(1)}`);
    }
    return `M${pts.join(" L")}${ferme ? ` L${L - 5},${H} L5,${H} Z` : ""}`;
  };
  const ligne = useTransform(cx, (c) => trace(c, false));
  const fond = useTransform(cx, (c) => trace(c, true));
  const id = useId().replace(/:/g, "");
  return (
    <div className="pile-neon">
      <AnimatePresence>
        {onglets[actif].id === "chercher" && (
          <motion.label className="verre champ" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.97 }} transition={{ duration: 0.28, ease: SORTIE }}>
            <Icone n="loupe" t={20} epais={2.2} />
            <input autoFocus placeholder="Rechercher…" aria-label="Rechercher" />
            <Icone n="croix" t={14} />
          </motion.label>
        )}
      </AnimatePresence>
      <nav className="verre barre neon" style={{ height: H }} aria-label="Navigation principale">
        <svg className="trace" width={L} height={H} viewBox={`0 0 ${L} ${H}`} aria-hidden>
          <defs>
            <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={TURQUOISE} stopOpacity=".16" /><stop offset="1" stopColor="#fff" stopOpacity=".04" /></linearGradient>
          </defs>
          <motion.path d={fond} fill={`url(#f${id})`} />
          <motion.path d={ligne} fill="none" stroke={TURQUOISE} strokeWidth={2.6} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${TURQUOISE}) drop-shadow(0 0 10px ${TURQUOISE}88)` }} />
        </svg>
        {onglets.map((o, i) => (
          <button key={o.id} className={i === actif ? "onglet actif" : "onglet"} onClick={() => setActif(i)} aria-current={i === actif ? "page" : undefined}>
            <span className="icone-badge">
              <Icone n={o.icone} plein={i === actif && o.icone !== "plus" && o.icone !== "loupe"} />
              {o.pastille && <i className="badge" />}
            </span>
            {i === actif && <motion.i className="point" layoutId={`point${id}`} transition={GLISSE} />}
            <span>{o.libelle}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ====================================================================== */
/* 2. Projecteur et cône de lumière                                        */
/* ====================================================================== */
export function BarreProjecteur({ onglets = ONGLETS_ICONES }: { onglets?: Onglet[] }) {
  const [actif, setActif] = useState(0);
  const id = useId();
  return (
    <nav className="verre barre projecteur" style={{ height: 78 }} aria-label="Navigation">
      {onglets.map((o, i) => (
        <button key={o.id} className={i === actif ? "onglet actif" : "onglet"} onClick={() => setActif(i)} aria-label={o.libelle} aria-current={i === actif ? "page" : undefined}>
          {i === actif && (
            <motion.span className="faisceau" layoutId={`faisceau${id}`} transition={GLISSE} aria-hidden>
              <i className="lampe" /><i className="cone" />
            </motion.span>
          )}
          <Icone n={o.icone} t={24} />
        </button>
      ))}
    </nav>
  );
}

/* ====================================================================== */
/* 3. Pastille dans un creux du bord haut                                  */
/* ====================================================================== */
export function BarreCreux({ onglets = ONGLETS_ICONES }: { onglets?: Onglet[] }) {
  const [actif, setActif] = useState(0);
  const H = 82, R = 28, CREUX = 36, DEMI = 80;
  const cx = useSuivi(centre(actif));
  const forme = (c: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= L; x += 2) {
      const coin = x < R ? R - Math.sqrt(Math.max(0, R * R - (R - x) ** 2)) : x > L - R ? R - Math.sqrt(Math.max(0, R * R - (x - (L - R)) ** 2)) : 0;
      pts.push(`${x},${Math.max(coin, CREUX * cloche((x - c) / DEMI)).toFixed(1)}`);
    }
    return `M${pts.join(" L")} L${L},${H - R} A${R} ${R} 0 0 1 ${L - R} ${H} L${R} ${H} A${R} ${R} 0 0 1 0 ${H - R} Z`;
  };
  const d = useTransform(cx, forme);
  const decoupe = useTransform(cx, (c) => `path('${forme(c)}')`);
  const xDisque = useTransform(cx, (c) => c - 27.5);
  const id = useId().replace(/:/g, "");
  return (
    <nav className="barre creux" style={{ height: H }} aria-label="Navigation">
      <motion.div className="flou" style={{ clipPath: decoupe }} />
      <svg className="coque" width={L} height={H} viewBox={`0 0 ${L} ${H}`} aria-hidden>
        <defs>
          <linearGradient id={`c${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1E1B1A" stopOpacity=".55" /><stop offset=".55" stopColor="#3A332E" stopOpacity=".45" /><stop offset="1" stopColor="#CFC2B2" stopOpacity=".55" /></linearGradient>
        </defs>
        <motion.path d={d} fill={`url(#c${id})`} stroke="rgba(255,255,255,.45)" strokeWidth={1.4} />
      </svg>
      <motion.span className="disque" style={{ x: xDisque }} aria-hidden>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={actif} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.22 }}>
            <Icone n={onglets[actif].icone} t={22} epais={2} />
          </motion.span>
        </AnimatePresence>
      </motion.span>
      {onglets.map((o, i) => (
        <button key={o.id} className={i === actif ? "onglet actif" : "onglet"} onClick={() => setActif(i)} aria-label={o.libelle} aria-current={i === actif ? "page" : undefined}>
          <motion.span animate={{ opacity: i === actif ? 0 : 1, y: i === actif ? -10 : 0 }} transition={{ duration: 0.2 }}><Icone n={o.icone} t={24} epais={2} /></motion.span>
        </button>
      ))}
      <i className="poignee" />
    </nav>
  );
}

/* ====================================================================== */
/* 4. Goutte de liquide (filtre « gluant »)                                */
/* ====================================================================== */
/** Une teinte par onglet : la barre change de couleur en même temps que la goutte. */
const TEINTES = ["#DCCB9C", "#E2B9B2", "#E4BFA8", "#CFC4D8", "#E5C98E"];
const CYCLE = 0.9; // s, relevé : montée 0,25 s, suspension 0,25 s, retombée 0,4 s
export function BarreGoutte({ onglets = ONGLETS_ICONES, initial = 4 }: { onglets?: Onglet[]; initial?: number }) {
  const [actif, setActif] = useState(initial);
  const [tirage, setTirage] = useState(0);
  const [enVol, setEnVol] = useState(false);
  const id = useId().replace(/:/g, "");
  const choisir = (i: number) => {
    setActif(i);
    setTirage((t) => t + 1);
    setEnVol(true);
  };
  const teinte = TEINTES[actif % TEINTES.length];
  const vol = { duration: CYCLE, times: [0, 0.28, 0.55, 0.85, 1], ease: "easeInOut" } as const;
  const serre = tirage ? [1, 0.93, 0.93, 1.015, 1] : 1;
  return (
    <div className="pile-goutte">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id={`g${id}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="flou" />
          <feColorMatrix in="flou" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="gluant" />
          <feComposite in="SourceGraphic" in2="gluant" operator="atop" />
        </filter>
      </svg>
      <motion.div className="flou-goutte" key={`f${tirage}`} animate={{ scaleX: serre }} transition={vol} />
      {/* Couche liquide : barre + goutte fusionnées par le filtre. */}
      <div className="liquide" style={{ filter: `url(#g${id})` }}>
        <motion.div className="corps" key={`c${tirage}`} initial={false} animate={{ backgroundColor: teinte, scaleX: serre }} transition={{ backgroundColor: { duration: 0.5 }, scaleX: vol }} />
        {tirage > 0 && (
          <motion.div key={tirage} className="goutte" style={{ left: centre(actif) - 31, backgroundColor: teinte }}
            initial={{ y: 0, scale: 0.5 }} animate={{ y: [0, -96, -96, -20, 0], scale: [0.5, 1, 1, 0.9, 0.5] }} transition={vol}
            onAnimationComplete={() => setEnVol(false)} />
        )}
      </div>
      {tirage > 0 && enVol && (
        <motion.span key={`i${tirage}`} className="icone-goutte" style={{ left: centre(actif) - 12 }}
          initial={{ y: 0, opacity: 0 }} animate={{ y: [0, -96, -96, -20, 0], opacity: [0, 1, 1, 1, 0] }} transition={vol} aria-hidden>
          <Icone n={onglets[actif].icone} t={24} epais={2} />
        </motion.span>
      )}
      <nav className="rangee" aria-label="Navigation">
        {onglets.map((o, i) => (
          <button key={o.id} className={i === actif ? "onglet actif" : "onglet"} onClick={() => choisir(i)} aria-current={i === actif ? "page" : undefined}>
            <motion.span animate={{ opacity: i === actif && enVol ? 0 : 1 }} transition={{ duration: 0.12 }}><Icone n={o.icone} t={22} epais={i === actif ? 2.4 : 1.7} /></motion.span>
            <span>{o.libelle}</span>
            {i === actif && <motion.i className="point" layoutId={`pg${id}`} transition={GLISSE} />}
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ====================================================================== */
/* Démonstration : les quatre barres sur une scène de salon               */
/* ====================================================================== */
export default function OngletsVerre({ fond }: { fond?: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="onglets-verre">
        <style>{CSS}</style>
        <div className="scene">
          {fond ?? <Salon />}
          <div className="emplacement e1"><BarreNeon /></div>
          <div className="emplacement e2"><BarreProjecteur /></div>
          <div className="emplacement e3"><BarreCreux /></div>
          <div className="emplacement e4"><BarreGoutte /></div>
        </div>
      </div>
    </MotionConfig>
  );
}

/** Décor dessiné en CSS (mur, téléviseur, meuble bas, plante) : remplace la photo de la vidéo. */
function Salon() {
  return (
    <div className="salon" aria-hidden>
      <i className="joint j1" /><i className="joint j2" />
      <i className="tele"><i className="reflet" /></i>
      <i className="plateau" />
      <i className="meuble"><i /><i /><i /></i>
      <svg className="plante" viewBox="0 0 120 120" width="120" height="120">
        {[[-40, 58], [-15, 64], [15, 62], [40, 56], [-60, 40], [62, 42]].map(([r, l], k) => (
          <ellipse key={k} cx="60" cy={100 - l / 2} rx="9" ry={l / 2} fill={k % 2 ? "#5E7F45" : "#6F9450"} transform={`rotate(${r} 60 100)`} />
        ))}
        <path d="M38 98 h44 l-6 22 h-32z" fill="#D9D2C6" />
      </svg>
    </div>
  );
}

/* ====================================================================== */
/* Styles (tokens dans style.md)                                           */
/* ====================================================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap');
.onglets-verre{font-family:Inter,system-ui,sans-serif;display:grid;place-items:center;background:#0B0B0B;padding:24px}
.onglets-verre *{box-sizing:border-box}
.onglets-verre button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.scene{position:relative;width:648px;height:700px;overflow:hidden;border-radius:6px}
.salon{position:absolute;inset:0;background:linear-gradient(180deg,#D3CBBF 0%,#C9BFB1 60%,#BDB2A3 100%)}
.joint{position:absolute;top:0;bottom:0;width:2px;background:rgba(0,0,0,.08)}.j1{left:273px}.j2{left:564px}
.tele{position:absolute;left:35px;right:-20px;top:67px;height:352px;background:linear-gradient(160deg,#2B2A29,#141414 45%,#0E0E0E);border:3px solid #1A1A1A;box-shadow:0 20px 40px rgba(0,0,0,.25)}
.reflet{position:absolute;inset:0;background:linear-gradient(115deg,transparent 55%,rgba(255,255,255,.05) 60%,transparent 70%)}
.plateau{position:absolute;left:0;right:0;top:477px;height:18px;background:linear-gradient(180deg,#8C6748,#6E4F37)}
.meuble{position:absolute;left:0;right:0;top:495px;bottom:0;display:grid;grid-template-columns:213px 330px 1fr;background:linear-gradient(180deg,#A47A55,#8B6343)}
.meuble i{border-right:2px solid rgba(40,25,15,.35);box-shadow:inset 0 1px 0 rgba(255,255,255,.12)}
.plante{position:absolute;left:14px;bottom:20px}
.emplacement{position:absolute;left:71px;width:500px}
.e1{top:89px}.e2{top:220px}.e3{top:358px}.e4{top:582px}
.verre{background:rgba(38,34,32,.5);-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);border:1px solid rgba(255,255,255,.22);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 10px 30px rgba(0,0,0,.25)}
.barre{position:relative;width:500px;border-radius:999px;display:grid;grid-template-columns:repeat(5,1fr);color:#fff}
.onglet{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px}
/* 1. néon */
.pile-neon{position:relative}
.champ{position:absolute;left:73px;top:-71px;width:353px;height:55px;border-radius:999px;display:flex;align-items:center;gap:12px;padding:0 20px;color:#fff;z-index:2}
.champ input{flex:1;border:0;outline:none;background:none;color:#fff;font:500 15px Inter,sans-serif}
.champ input::placeholder{color:rgba(255,255,255,.45)}
.champ svg:last-child{opacity:.35}
.neon{overflow:hidden}
.neon .trace{position:absolute;inset:0;pointer-events:none}
.neon .onglet{font-size:11px;font-weight:600;letter-spacing:.01em;padding-top:4px}
.neon .onglet>span:last-child{opacity:.92}
.icone-badge{position:relative;display:grid}
.badge{position:absolute;top:-3px;right:-4px;width:8px;height:8px;border-radius:50%;background:#F05A3C;box-shadow:0 0 0 1.5px rgba(30,28,27,.9)}
.neon .point{position:absolute;top:33px;width:4px;height:4px;border-radius:50%;background:${TURQUOISE};box-shadow:0 0 6px ${TURQUOISE}}
/* 2. projecteur */
.projecteur .onglet{height:100%}
.projecteur .onglet svg{position:relative;z-index:1;transition:color .25s,filter .25s}
.projecteur .actif svg{filter:drop-shadow(0 0 6px ${TURQUOISE}aa)}
.faisceau{position:absolute;top:0;left:50%;width:90px;margin-left:-45px;height:52px;display:grid;justify-items:center}
.lampe{width:37px;height:6px;border-radius:0 0 5px 5px;background:${TURQUOISE};box-shadow:0 0 10px ${TURQUOISE}}
.cone{position:absolute;top:6px;width:90px;height:46px;clip-path:polygon(29% 0,71% 0,100% 100%,0 100%);background:linear-gradient(180deg,${TURQUOISE}80,${TURQUOISE}00)}
/* 3. creux */
.creux{border-radius:0}
.creux .flou{position:absolute;inset:0;-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3)}
.creux .coque{position:absolute;inset:0;overflow:visible;filter:drop-shadow(0 10px 24px rgba(0,0,0,.3))}
.creux .onglet{color:#fff;padding-top:6px}
.creux .onglet:hover{color:${TURQUOISE}}
.disque{position:absolute;left:0;top:-24px;width:55px;height:55px;border-radius:50%;display:grid;place-items:center;color:#fff;z-index:2;
background:radial-gradient(circle at 40% 30%,#2F7D70,#1A4C45 70%);border:1.5px solid rgba(255,255,255,.4);box-shadow:0 6px 18px rgba(0,0,0,.35),0 0 18px ${TURQUOISE}33}
.disque>span{display:grid}
.poignee{position:absolute;left:50%;bottom:12px;width:125px;height:5px;margin-left:-62px;border-radius:5px;background:rgba(255,255,255,.75)}
/* 4. goutte */
.pile-goutte{position:relative;width:500px;height:78px}
.flou-goutte{position:absolute;inset:0;border-radius:39px;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
.liquide{position:absolute;inset:-130px -20px -20px;opacity:.72;pointer-events:none}
.corps{position:absolute;left:20px;right:20px;top:130px;height:78px;border-radius:39px}
.goutte{position:absolute;top:138px;width:62px;height:62px;border-radius:50%;margin-left:20px}
.pile-goutte::after{content:"";position:absolute;inset:0;border-radius:39px;border:1px solid rgba(255,255,255,.55);pointer-events:none}
.icone-goutte{position:absolute;top:27px;color:#262626;z-index:3;display:grid}
.rangee{position:absolute;inset:0;display:grid;grid-template-columns:repeat(5,1fr);color:#2A2A2A;z-index:2}
.rangee .onglet{font-size:11px;font-weight:600;gap:4px;padding-top:2px}
.rangee .actif{font-weight:700;color:#141414}
.rangee .point{position:absolute;bottom:6px;width:4px;height:4px;border-radius:50%;background:#141414}
@media (prefers-reduced-motion:reduce){.projecteur .onglet svg{transition:none}}
`;
