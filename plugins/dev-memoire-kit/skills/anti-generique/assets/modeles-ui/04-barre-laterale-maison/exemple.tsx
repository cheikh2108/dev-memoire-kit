/**
 * Modèle 04 — Barre latérale « Kër » (maison connectée)
 * Reconstruction originale (nom, textes, données et code réécrits) d'après un concept
 * d'interface public : rail compact qui se déplie en barre latérale en verre dépoli,
 * pièces en accordéon, pilule active noire, fenêtre de détail noire avec graphique.
 * Relevé élément par élément : voir README.md.
 *
 * Dépendances : react 18+, motion 11+ (`npm i motion`).
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, animate, motion, useMotionValue, useTransform } from "motion/react";

/* ====================================================================== */
/* Mouvement (voir animations.md)                                          */
/* ====================================================================== */
const EASE = [0.32, 0.72, 0, 1] as const; // déploiement : rapide puis très doux
const RESSORT = { type: "spring", stiffness: 520, damping: 40, mass: 0.8 } as const; // pilules qui glissent
const D = { largeur: 0.38, texte: 0.2, fenetre: 0.28, compteur: 0.9 };

/* ====================================================================== */
/* Icônes                                                                  */
/* ====================================================================== */
const TRACES = {
  maison: "M4 9.5 10 4l6 5.5V16H4zM8 16v-4h4v4",
  loupe: "M9 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM17 17l-3.5-3.5",
  pieces: "M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z",
  lune: "M15 12.5A6 6 0 0 1 7.5 5a6 6 0 1 0 7.5 7.5Z",
  thermometre: "M10 3a2 2 0 0 0-2 2v6.5a3 3 0 1 0 4 0V5a2 2 0 0 0-2-2ZM10 9v4",
  ampoule: "M7.5 14h5M8 17h4M10 3a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9Z",
  eclair: "M11 3 5 11h5l-1 6 6-8h-5z",
  bouclier: "M10 3 4 5.5v4c0 3.5 2.5 6 6 7.5 3.5-1.5 6-4 6-7.5v-4zM7.5 10l2 2 3-3.5",
  enceinte: "M6 3h8v14H6zM10 13a2 2 0 1 0 0-.1M10 6.5h.01",
  camera: "M3 6h10v8H3zM13 9l4-2v6l-4-2",
  automatisation: "M5 5h4v4H5zM11 11h4v4h-4zM9 7h3a2 2 0 0 1 2 2v2M11 13H8a2 2 0 0 1-2-2V9",
  reglages: "M4 6h7M15 6h1M4 14h1M9 14h7M13 4v4M7 12v4",
  replier: "M4 4h12v12H4zM8 4v12",
  chevron: "M6 8l4 4 4-4",
  bas: "M10 4v12M6 12l4 4 4-4",
};
type NomIcone = keyof typeof TRACES;
function Icone({ n, taille = 16 }: { n: NomIcone; taille?: number }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={TRACES[n]} />
    </svg>
  );
}

/* ====================================================================== */
/* Données de démonstration (fictives)                                     */
/* ====================================================================== */
type Entree = { id: string; libelle: string; icone: NomIcone; valeur?: string; enfants?: boolean };
const ENTREES: Entree[] = [
  { id: "accueil", libelle: "Accueil", icone: "maison" },
  { id: "pieces", libelle: "Pièces", icone: "pieces", enfants: true },
  { id: "scenes", libelle: "Scènes", icone: "lune", valeur: "Nuit" },
  { id: "climat", libelle: "Climat", icone: "thermometre", valeur: "26,5°" },
  { id: "eclairage", libelle: "Éclairage", icone: "ampoule", valeur: "6 allumées" },
  { id: "energie", libelle: "Énergie", icone: "eclair", valeur: "12,4 kWh" },
  { id: "securite", libelle: "Sécurité", icone: "bouclier", valeur: "Verrouillée" },
  { id: "audio", libelle: "Audio", icone: "enceinte", valeur: "En lecture" },
  { id: "cameras", libelle: "Caméras", icone: "camera", valeur: "3 en direct" },
  { id: "automatisations", libelle: "Automatisations", icone: "automatisation", valeur: "12" },
];
const PIECES = [
  { nom: "Salon", meta: "26,5° · 3 app.", actif: true },
  { nom: "Cuisine", meta: "25,8° · 5 app.", actif: true },
  { nom: "Suite parentale", meta: "Libre", actif: false },
  { nom: "Bureau", meta: "Occupé · 2 personnes", actif: true },
];
// Consommation par heure (kWh), 24 barres ; les heures de pointe sont hachurées
const CONSO = [0.3, 0.25, 0.2, 0.2, 0.25, 0.4, 0.9, 1.0, 0.5, 0.45, 0.4, 0.45, 0.55, 0.5, 0.9, 0.6, 1.2, 0.7, 1.0, 1.1, 0.8, 0.6, 0.45, 0.35];
const POINTES = new Set([6, 7, 14, 16, 18, 19]);

/* ====================================================================== */
/* Fenêtre de détail : consommation d'énergie                              */
/* ====================================================================== */
function Compteur({ valeur }: { valeur: number }) {
  const mv = useMotionValue(0);
  const texte = useTransform(mv, (v) => v.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
  useEffect(() => {
    const c = animate(mv, valeur, { duration: D.compteur, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [valeur]);
  return <motion.span>{texte}</motion.span>;
}

function FenetreEnergie({ haut }: { haut: number }) {
  const [survol, setSurvol] = useState(16);
  const max = Math.max(...CONSO);
  return (
    <motion.div
      className="fenetre"
      role="dialog"
      aria-label="Consommation d'énergie"
      initial={{ opacity: 0, scale: 0.94, x: -8, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.97, x: -6, filter: "blur(6px)" }}
      transition={{ duration: D.fenetre, ease: EASE }}
      style={{ originX: 0, originY: 0.5, top: haut }}
    >
      <div className="fenetre-tete">
        <span className="rond-sombre"><Icone n="eclair" taille={15} /></span>
        <div>
          <b>Consommation d'énergie</b>
          <span className="pastille-sombre"><Icone n="bas" taille={10} /> 18 % vs hier</span>
        </div>
      </div>
      <p className="grand-chiffre"><Compteur valeur={12.4} /><small>kWh</small></p>
      <div className="graphique" onMouseLeave={() => setSurvol(16)}>
        <i className="ligne-moyenne" />
        {CONSO.map((v, k) => (
          <button key={k} className="colonne" onMouseEnter={() => setSurvol(k)} aria-label={`${k} h : ${v.toLocaleString("fr-FR")} kWh`}>
            <motion.i
              className={`barre ${POINTES.has(k) ? "pointe" : ""} ${k === survol ? "survolee" : ""}`}
              style={{ height: `${(v / max) * 100}%`, originY: 1 }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.12 + k * 0.012 }}
            />
          </button>
        ))}
        <motion.span
          className="bulle"
          animate={{ left: `${((survol + 0.5) / CONSO.length) * 100}%`, bottom: `${(CONSO[survol] / max) * 100 + 6}%` }}
          transition={{ duration: 0.18, ease: EASE }}
        >
          {String(survol).padStart(2, "0")} h · {CONSO[survol].toLocaleString("fr-FR")} kWh
        </motion.span>
      </div>
      <div className="axe">{["00 h", "06 h", "12 h", "18 h", "24 h"].map((h) => <span key={h}>{h}</span>)}</div>
    </motion.div>
  );
}

/* ====================================================================== */
/* Barre latérale                                                          */
/* ====================================================================== */
function Ligne({ entree, ouvert, actif, survole, onSurvol, onClic, deplie, children }: {
  entree: Entree; ouvert: boolean; actif: boolean; survole: boolean; onSurvol: () => void; onClic: () => void; deplie?: boolean; children?: ReactNode;
}) {
  return (
    <li className="entree" onMouseEnter={onSurvol}>
      <button className={`ligne ${actif ? "active" : ""}`} onClick={onClic} aria-current={actif ? "page" : undefined} title={ouvert ? undefined : entree.libelle}>
        {actif && <motion.span layoutId="pilule-active" className="pilule-active" transition={RESSORT} />}
        {!actif && survole && ouvert && <motion.span layoutId="pilule-survol" className="pilule-survol" transition={RESSORT} />}
        <span className={`rond-icone ${actif ? "actif" : ""}`}><Icone n={entree.icone} /></span>
        <AnimatePresence initial={false}>
          {ouvert && (
            <motion.span className="libelle" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.08, duration: D.texte } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}>
              {entree.libelle}
            </motion.span>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {ouvert && (entree.valeur || entree.enfants) && (
            <motion.span className={`valeur ${entree.enfants ? "chevron" : ""}`} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.12, duration: D.texte } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}>
              {entree.enfants ? <motion.span animate={{ rotate: deplie ? 180 : 0 }} transition={{ duration: 0.25, ease: EASE }} style={{ display: "inline-flex" }}><Icone n="chevron" taille={14} /></motion.span> : entree.valeur}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      {children}
    </li>
  );
}

export default function BarreLateraleMaison() {
  const [ouvert, setOuvert] = useState(true);
  const [actif, setActif] = useState("accueil");
  const [survol, setSurvol] = useState<string | null>(null);
  const [deplie, setDeplie] = useState(false);
  const [piece, setPiece] = useState<string | null>(null);
  const scene = useRef<HTMLDivElement>(null);
  const [haut, setHaut] = useState(300);

  // Aligne la fenêtre de détail sur la ligne active : la pilule noire semble s'y prolonger
  useLayoutEffect(() => {
    const ligne = scene.current?.querySelector(".ligne.active");
    if (!ligne || !scene.current) return;
    const r = ligne.getBoundingClientRect();
    const s = scene.current.getBoundingClientRect();
    setHaut(r.top - s.top + r.height / 2 - 128);
  }, [actif, deplie, ouvert]);

  // Raccourci ⌘K / Ctrl+K : ouvrir la barre et placer le curseur dans la recherche
  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOuvert(true);
        setTimeout(() => document.getElementById("recherche-ker")?.focus(), D.largeur * 1000);
      }
    };
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="ker-scene" ref={scene}>
        <style>{CSS}</style>
        <LayoutGroup>
          <motion.nav
            className={`ker ${ouvert ? "ouvert" : "replie"}`}
            aria-label="Navigation de la maison"
            animate={{ width: ouvert ? 380 : 76 }}
            transition={{ duration: D.largeur, ease: EASE }}
            onMouseLeave={() => setSurvol(null)}
          >
            <header className="tete">
              <button className="logo" onClick={() => setOuvert(true)} aria-label="Kër"><Icone n="maison" taille={18} /></button>
              <AnimatePresence initial={false}>
                {ouvert && (
                  <motion.div className="marque" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.08, duration: D.texte } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}>
                    <b>kër</b><small>Maison connectée</small>
                  </motion.div>
                )}
              </AnimatePresence>
              {ouvert && <button className="replier" onClick={() => setOuvert(false)} aria-label="Replier la barre"><Icone n="replier" /></button>}
            </header>

            <div className="recherche">
              <span className="rond-icone discret"><Icone n="loupe" /></span>
              {ouvert && (
                <>
                  <input id="recherche-ker" placeholder="Chercher une pièce, une scène…" aria-label="Chercher une pièce ou une scène" />
                  <kbd>⌘K</kbd>
                </>
              )}
            </div>

            <div className="defilement">
              <ul className="liste">
                {ENTREES.map((e) => (
                  <Ligne
                    key={e.id}
                    entree={e}
                    ouvert={ouvert}
                    actif={actif === e.id}
                    survole={survol === e.id}
                    onSurvol={() => setSurvol(e.id)}
                    deplie={deplie}
                    onClic={() => {
                      if (!e.enfants) return setActif(e.id);
                      if (!ouvert) setOuvert(true);
                      setDeplie(ouvert ? !deplie : true);
                    }}
                  >
                    {e.enfants && (
                      <AnimatePresence initial={false}>
                        {ouvert && deplie && (
                          <motion.ul className="sous-liste" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                            {PIECES.map((p, k) => (
                              <motion.li key={p.nom} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + k * 0.04, duration: 0.22 }}>
                                <button className="sous-ligne" onMouseEnter={() => setPiece(p.nom)} onMouseLeave={() => setPiece(null)}>
                                  {piece === p.nom && <motion.span layoutId="pilule-piece" className="pilule-survol" transition={RESSORT} />}
                                  <i className={`point ${p.actif ? "vert" : ""}`} />
                                  <span className="libelle">{p.nom}</span>
                                  <span className="meta">{p.meta}</span>
                                </button>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    )}
                  </Ligne>
                ))}
              </ul>
            </div>

            <div className="pied">
              <ul className="liste">
                <Ligne entree={{ id: "reglages", libelle: "Réglages", icone: "reglages" }} ouvert={ouvert} actif={actif === "reglages"} survole={survol === "reglages"} onSurvol={() => setSurvol("reglages")} onClic={() => setActif("reglages")} />
              </ul>
              <button className="utilisateur" onClick={() => setOuvert(!ouvert)} aria-label="Profil">
                <span className="avatar">FN</span>
                {ouvert && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }}>
                    <b>Fatou Ndiaye</b><small>Résidence Almadies</small>
                  </motion.span>
                )}
              </button>
            </div>
          </motion.nav>
        </LayoutGroup>

        <AnimatePresence>{ouvert && actif === "energie" && <FenetreEnergie key="energie" haut={haut} />}</AnimatePresence>
      </div>
    </MotionConfig>
  );
}

/* ====================================================================== */
/* Styles (tokens dans style.md)                                           */
/* ====================================================================== */
const CSS = `
.ker-scene{--verre:rgba(246,245,242,.72);--verre-bord:rgba(255,255,255,.65);--encre:#161616;--muet:#8F8C86;--pale:#B4B1AB;
--pastille:rgba(0,0,0,.045);--rond:rgba(0,0,0,.05);--blanc:#FFFFFF;--noir:#121212;--lime:#B8E986;
--r:30px;position:relative;min-height:760px;padding:40px;border-radius:28px;overflow:hidden;
font-family:"Geist","Inter Tight",system-ui,sans-serif;color:var(--encre);
background:radial-gradient(40% 30% at 85% 10%,rgba(176,226,120,.55),transparent 70%),
radial-gradient(50% 25% at 70% 45%,rgba(60,55,50,.55),transparent 70%),
radial-gradient(60% 30% at 30% 92%,rgba(40,38,36,.6),transparent 70%),
linear-gradient(160deg,#CFCBC4,#B9B4AC 60%,#A9A49B)}
.ker-scene *{box-sizing:border-box}.ker-scene button{font:inherit;color:inherit}
.ker{position:relative;height:680px;background:var(--verre);backdrop-filter:blur(24px) saturate(140%);-webkit-backdrop-filter:blur(24px) saturate(140%);
border:1px solid var(--verre-bord);border-radius:var(--r);box-shadow:0 30px 60px rgba(30,25,20,.22),inset 0 1px 0 rgba(255,255,255,.7);
display:flex;flex-direction:column;padding:14px 12px;overflow:hidden}
.tete{display:flex;align-items:center;gap:12px;padding:6px 4px 14px;min-height:62px}
.ker-scene .logo{width:44px;height:44px;flex:none;border-radius:14px;border:0;background:var(--noir);color:var(--lime);display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 14px rgba(0,0,0,.25)}
.marque{display:flex;flex-direction:column;line-height:1.05;white-space:nowrap}
.marque b{font-size:22px;letter-spacing:-.03em}.marque small{font-size:11px;color:var(--muet);margin-top:2px}
.ker-scene .replier{margin-left:auto;border:0;background:none;color:var(--muet);cursor:pointer;padding:6px}
.recherche{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.75);border-radius:999px;padding:4px 12px 4px 4px;margin:0 2px 12px;min-height:44px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.replie .recherche{background:none;box-shadow:none;padding:4px}
.recherche input{flex:1;min-width:0;border:0;background:none;font:inherit;font-size:13px;color:var(--encre);outline:none}
.recherche input::placeholder{color:var(--muet)}
.recherche kbd{font-family:inherit;font-size:10px;color:var(--muet);background:var(--pastille);border-radius:6px;padding:2px 6px}
.defilement{flex:1;overflow-y:auto;overflow-x:hidden;margin:0 -4px;padding:0 4px;scrollbar-width:thin;
-webkit-mask-image:linear-gradient(#000 85%,transparent);mask-image:linear-gradient(#000 85%,transparent)}
.liste,.sous-liste{list-style:none;margin:0;padding:0}
.entree{position:relative}
.ligne{position:relative;display:flex;align-items:center;gap:12px;width:100%;border:0;background:none;padding:5px;border-radius:999px;cursor:pointer;text-align:left;min-height:50px;white-space:nowrap}
.pilule-active{position:absolute;inset:0;background:var(--noir);border-radius:999px;box-shadow:0 8px 18px rgba(0,0,0,.22)}
.pilule-survol{position:absolute;inset:0;background:var(--blanc);border-radius:999px;box-shadow:0 6px 16px rgba(0,0,0,.08)}
.rond-icone{position:relative;width:40px;height:40px;flex:none;border-radius:50%;background:var(--rond);display:grid;place-items:center;color:#3A3835}
.rond-icone.discret{background:none}
.rond-icone.actif{background:var(--lime);color:var(--noir)}
.replie .pilule-active{inset:1px;width:48px;border-radius:50%}
.libelle{position:relative;font-size:16px;letter-spacing:-.01em}
.ligne.active .libelle{color:#fff}
.valeur{position:relative;margin-left:auto;margin-right:6px;font-size:11px;color:var(--muet);background:var(--pastille);border-radius:999px;padding:4px 9px}
.valeur.chevron{background:none;padding:4px}
.ligne.active .valeur{color:#8A8A8A;background:rgba(255,255,255,.08)}
.sous-liste{overflow:hidden;margin-left:24px;border-left:1.5px solid rgba(0,0,0,.08);padding:4px 0 6px 8px}
.sous-ligne{position:relative;display:flex;align-items:center;gap:10px;width:100%;border:0;background:none;padding:10px 12px;border-radius:999px;cursor:pointer;text-align:left;white-space:nowrap}
.sous-ligne .libelle{font-size:14px}
.point{position:relative;width:6px;height:6px;border-radius:50%;background:var(--pale)}.point.vert{background:#7CC45A}
.meta{position:relative;margin-left:auto;font-size:11px;color:var(--pale)}
.pied{border-top:1px solid rgba(0,0,0,.06);padding-top:10px;display:flex;flex-direction:column;gap:8px}
.utilisateur{display:flex;align-items:center;gap:12px;border:0;background:rgba(255,255,255,.8);border-radius:999px;padding:5px;cursor:pointer;text-align:left;white-space:nowrap;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.replie .utilisateur{background:none;box-shadow:none}
.utilisateur b{display:block;font-size:14px}.utilisateur small{font-size:11px;color:var(--muet)}
.avatar{width:42px;height:42px;flex:none;border-radius:50%;background:radial-gradient(circle at 35% 30%,#F4D9C6,#D9A98A);color:#fff;display:grid;place-items:center;font-size:12px;font-weight:600}
.fenetre{position:absolute;left:396px;width:300px;background:var(--noir);color:#fff;border-radius:26px;padding:16px 16px 12px;box-shadow:0 30px 60px rgba(0,0,0,.35)}
.fenetre-tete{display:flex;gap:10px;align-items:flex-start}
.fenetre-tete b{display:block;font-size:15px;font-weight:500;margin-bottom:4px}
.rond-sombre{width:34px;height:34px;border-radius:50%;background:#262626;color:var(--lime);display:grid;place-items:center;flex:none}
.pastille-sombre{display:inline-flex;align-items:center;gap:4px;font-size:10px;color:#BDBDBD;background:#242424;border-radius:999px;padding:3px 8px}
.grand-chiffre{margin:16px 0 8px;font-size:54px;font-weight:300;letter-spacing:-.05em;line-height:1}
.grand-chiffre small{font-size:15px;letter-spacing:0;margin-left:4px;font-weight:400}
.graphique{position:relative;height:84px;display:flex;align-items:flex-end;gap:3px}
.ligne-moyenne{position:absolute;left:0;right:0;bottom:38%;border-top:1px dashed #3A3A3A}
.colonne{flex:1;height:100%;border:0;background:none;padding:0;display:flex;align-items:flex-end;cursor:pointer}
.barre{display:block;width:100%;background:#2C2C2C;border-radius:3px}
.barre.pointe{background:repeating-linear-gradient(135deg,var(--lime) 0 2px,#3E5A22 2px 4px)}
.barre.survolee{outline:1px solid rgba(184,233,134,.6)}
.bulle{position:absolute;transform:translateX(-50%);background:#fff;color:var(--encre);border-radius:999px;font-size:10px;font-weight:600;padding:4px 9px;white-space:nowrap;pointer-events:none;box-shadow:0 6px 14px rgba(0,0,0,.3)}
.axe{display:flex;justify-content:space-between;font-size:9px;color:#7A7A7A;margin-top:6px}
`;
