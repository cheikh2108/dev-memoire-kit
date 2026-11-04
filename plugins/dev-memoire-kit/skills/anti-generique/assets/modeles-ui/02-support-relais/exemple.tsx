/**
 * Modèle 02 — Tableau de bord de support « Relais »
 * Reconstruction originale (nom, données et code réécrits) d'après une démo publique
 * de tableau de bord de service client : gros indicateurs à exposant, grand graphique révélé
 * de gauche à droite, boîte de réception avec délais SLA, accent jaune unique.
 *
 * Dépendances : react 18+, motion 11+ (`npm i motion`).
 */
import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";

/* ---------- Tokens de mouvement (voir animations.md) ---------- */
const EASE = [0.22, 1, 0.36, 1] as const;
const EASE_REVELATION = [0.45, 0, 0.2, 1] as const; // départ franc, arrivée douce : balayage du graphique
const D = { carte: 0.45, revelation: 0.95, barre: 0.4 };

type Onglet = "apercu" | "boite";

/* ---------- Primitives ---------- */
function Carte({ i, className = "", children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <motion.section
      className={`carte ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: D.carte, ease: EASE, delay: 0.1 + i * 0.05 }}
    >
      {children}
    </motion.section>
  );
}

function Indicateur({ valeur, exposant, libelle, evolution }: { valeur: string; exposant: string; libelle: string; evolution: string }) {
  return (
    <div className="indicateur">
      <p className="valeur">{valeur}<sup>{exposant}</sup></p>
      <p className="muet">{libelle}</p>
      <p className="muet petit">▲ {evolution}</p>
    </div>
  );
}

function Surligne({ children }: { children: ReactNode }) {
  return <span className="surligne">{children}</span>;
}

/** Barres en pointillés qui montent en cascade. */
function BarresPoints({ n = 22, max = 1 }: { n?: number; max?: number }) {
  return (
    <div className="barres-points" aria-hidden>
      {Array.from({ length: n }, (_, k) => {
        const h = (0.25 + 0.75 * (k / (n - 1))) * max;
        return (
          <motion.i
            key={k}
            style={{ height: `${h * 100}%`, originY: 1 }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: D.barre, ease: EASE, delay: 0.3 + k * 0.02 }}
          />
        );
      })}
    </div>
  );
}

/* ---------- Grand graphique ---------- */
const W = 1000;
const H = 150;

function cheminLisse(points: number[]): string {
  const pas = W / (points.length - 1);
  const y = (v: number) => H - (v / 12) * H;
  let d = `M0 ${y(points[0])}`;
  for (let i = 1; i < points.length; i++) {
    const x0 = (i - 1) * pas;
    const x1 = i * pas;
    const xm = (x0 + x1) / 2;
    d += ` C${xm} ${y(points[i - 1])} ${xm} ${y(points[i])} ${x1} ${y(points[i])}`;
  }
  return d;
}

function GrandGraphique() {
  const [survol, setSurvol] = useState<number>(8);
  const chemin = useMemo(() => cheminLisse(DELAIS), []);
  const pas = W / (DELAIS.length - 1);

  return (
    <div className="graphique" onMouseLeave={() => setSurvol(8)}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <pattern id="hachures" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="1.2" height="6" fill="var(--trait)" />
          </pattern>
          <clipPath id="balayage">
            {/* Révélation : un rectangle qui passe de 0 à toute la largeur, ancré à gauche. */}
            <motion.rect
              x={0} y={0} height={H} width={W}
              style={{ originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: D.revelation, ease: EASE_REVELATION, delay: 0.12 }}
            />
          </clipPath>
        </defs>
        <rect width={W} height={H} fill="url(#hachures)" opacity={0.6} />
        <g clipPath="url(#balayage)">
          <path d={chemin} className="courbe" vectorEffect="non-scaling-stroke" />
        </g>
        <motion.line
          y1={0} y2={H}
          className="repere" vectorEffect="non-scaling-stroke"
          initial={false}
          animate={{ x1: survol * pas, x2: survol * pas }}
          transition={{ duration: 0.2, ease: EASE }}
        />
        {DELAIS.map((_, i) => (
          <rect key={i} x={i * pas - pas / 2} y={0} width={pas} height={H} fill="transparent" onMouseEnter={() => setSurvol(i)} />
        ))}
      </svg>
      <motion.div
        className="bulle"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0, left: `calc(${(survol / (DELAIS.length - 1)) * 100}% + 12px)` }}
        transition={{ duration: 0.2, ease: EASE, opacity: { delay: 1 } }}
      >
        <p className="muet petit">Aujourd'hui, {HEURES[survol]}</p>
        <p><b>{DELAIS[survol].toLocaleString("fr-FR")} min</b> <span className="muet">première réponse (médiane)</span></p>
      </motion.div>
      <div className="axe">{HEURES.filter((_, i) => i % 2 === 0).map((h) => <span key={h}>{h}</span>)}</div>
    </div>
  );
}

/* ---------- Vues ---------- */
function VueApercu() {
  const [score, setScore] = useState(1);
  return (
    <>
      <header className="titre-vue ligne">
        <div><h1>Performance du service</h1><p className="muet">Chaque conversation, jusqu'au bout.</p></div>
        <div className="segments">
          {["1H", "1J", "1S", "1M", "1A"].map((p) => <span key={p} className={p === "1J" ? "actif" : ""}>{p}</span>)}
        </div>
      </header>
      <div className="indicateurs">
        <Indicateur valeur="4,8" exposant="min" libelle="Première réponse · médiane" evolution="12,7 % plus rapide qu'hier" />
        <Indicateur valeur="96,2" exposant="%" libelle="Respect du SLA · 75 sur 78" evolution="2,4 pts vs hier" />
        <Indicateur valeur="4,9" exposant="/5" libelle="Satisfaction · 9 notes" evolution="0,3 vs hier" />
        <motion.div
          className="pastille-gain"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.35, ease: EASE }}
        >
          <span>↑ <Surligne>+2,7 pts</Surligne></span>
          <p className="muet petit">Taux de résolution · 70,2 %</p>
        </motion.div>
      </div>

      <GrandGraphique />

      <div className="grille">
        <Carte i={0}>
          <div className="ligne"><b>Conversations</b><span>→</span></div>
          <p className="muet">Attribuées ce mois-ci</p>
          <div className="ligne bas"><p className="valeur">1 280</p><BarresPoints /></div>
          <p className="petit"><Surligne>98 % résolues</Surligne> <span className="muet">1 255 sur 1 280</span></p>
        </Carte>
        <Carte i={1}>
          <div className="ligne"><b>En cours</b><span>→</span></div>
          <p className="muet">Actives maintenant</p>
          <div className="ligne bas"><p className="valeur">25</p><BarresPoints n={16} max={0.8} /></div>
          <p className="petit"><Surligne>● 3 à risque</Surligne> <span className="muet">▲ 2 agents disponibles</span></p>
        </Carte>
        <Carte i={2} className="score">
          <div className="ligne"><b>Score de l'équipe</b><span className="muet">Ce mois ⌄</span></div>
          <div className="carrousel">
            {SCORES.map((s, k) => (
              <motion.button
                key={s.mois}
                onClick={() => setScore(k)}
                animate={{ scale: k === score ? 1 : 0.62, opacity: k === score ? 1 : 0.35 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <span>{s.valeur}</span><small>{s.mois}</small>
              </motion.button>
            ))}
          </div>
          <p className="muet petit centre">2e meilleur score des 12 derniers mois</p>
        </Carte>
        <Carte i={3} className="notes">
          <div className="ligne"><b>Notes de l'équipe</b><span>+</span></div>
          {NOTES.map((n) => (
            <div key={n.qui} className="note">
              <p className="ligne"><b>{n.qui}</b><span className="muet petit">{n.heure}</span></p>
              <p className="muet">{n.texte}</p>
            </div>
          ))}
        </Carte>
      </div>
    </>
  );
}

function VueBoite({ onAttribuer }: { onAttribuer: () => void }) {
  const [choisie, setChoisie] = useState(3);
  const c = CONVERSATIONS[choisie];
  return (
    <>
      <header className="titre-vue">
        <h1>Boîte de réception</h1>
        <p className="muet">25 conversations en cours · 2 à risque · 1 agent disponible</p>
      </header>
      <div className="boite">
        <Carte i={0} className="liste">
          {CONVERSATIONS.map((x, k) => (
            <motion.button
              key={x.ref}
              className={`rangee ${k === choisie ? "choisie" : ""}`}
              onClick={() => setChoisie(k)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + k * 0.04, duration: 0.3, ease: EASE }}
            >
              <span className={`point ${x.min <= 20 ? "chaud" : ""}`} />
              <span><b>{x.sujet}</b><small className="muet">{x.ref} · {x.priorite}</small></span>
              <span className="muet">{x.client}</span>
              <span className={`delai ${x.min <= 20 ? "urgent" : ""}`}>{x.min} min</span>
            </motion.button>
          ))}
        </Carte>
        <AnimatePresence mode="wait">
          <motion.section
            key={c.ref}
            className="carte detail"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <p className="muet petit">{c.ref} · E-mail · priorité {c.priorite.toLowerCase()}</p>
            <h2>{c.sujet}</h2>
            <p className="muet">{c.client}</p>
            <div className="compte-rebours">
              <svg viewBox="0 0 40 40" aria-hidden>
                <circle cx="20" cy="20" r="16" className="piste" />
                <motion.circle
                  cx="20" cy="20" r="16" className="arc"
                  strokeDasharray={100.5}
                  initial={{ strokeDashoffset: 100.5 }}
                  animate={{ strokeDashoffset: 100.5 * (1 - c.min / 30) }}
                  transition={{ duration: 0.7, ease: EASE }}
                />
              </svg>
              <div>
                <p className="valeur moyen">{c.min} min restantes</p>
                <p className="muet petit">Objectif de première réponse : 30 min</p>
              </div>
            </div>
            <button className="btn sombre" onClick={onAttribuer}>Attribuer à Khady</button>
          </motion.section>
        </AnimatePresence>
      </div>
    </>
  );
}

/* ---------- Coquille ---------- */
const LIBELLES: Record<Onglet, string> = { apercu: "Vue du service", boite: "Boîte de réception" };

export default function TableauRelais() {
  const [onglet, setOnglet] = useState<Onglet>("apercu");
  const [toast, setToast] = useState(false);
  const attribuer = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2600);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relais">
        <style>{CSS}</style>
        <nav className="barre-haut">
          <b className="marque">relais</b>
          <LayoutGroup>
            <div className="onglets">
              {(Object.keys(LIBELLES) as Onglet[]).map((o) => (
                <button key={o} onClick={() => setOnglet(o)} aria-pressed={onglet === o}>
                  {onglet === o && (
                    <motion.span layoutId="onglet-actif" className="onglet-actif" transition={{ duration: 0.35, ease: EASE }} />
                  )}
                  <span className="onglet-texte">{LIBELLES[o]}{o === "boite" && <i className="compte">3</i>}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
          <span className="avatar">KD</span>
        </nav>
        <AnimatePresence mode="wait">
          <motion.main key={onglet} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
            {onglet === "apercu" ? <VueApercu /> : <VueBoite onAttribuer={attribuer} />}
          </motion.main>
        </AnimatePresence>
        <AnimatePresence>
          {toast && (
            <motion.div
              className="toast"
              role="status"
              initial={{ opacity: 0, y: 24, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 24, x: "-50%" }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <span className="coche">✓</span> Attribuée à Khady Diallo
              <button onClick={() => setToast(false)}>Annuler</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

/* ---------- Données de démonstration (fictives) ---------- */
const DELAIS = [6, 7.5, 10, 8, 5, 4.5, 7, 9, 5.9, 5.2, 6.5, 8.2, 6, 4.8, 5.5, 6.2, 5];
const HEURES = ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"];
const SCORES = [{ mois: "oct.", valeur: 94 }, { mois: "nov.", valeur: 97 }, { mois: "record", valeur: 98 }];
const NOTES = [
  { qui: "Mamadou Sy", heure: "16:21", texte: "L'article sur l'accès au compte est à jour, la checklist est prête." },
  { qui: "Awa Faye", heure: "15:58", texte: "File d'intégration vide, je prends les questions de facturation." },
];
const CONVERSATIONS = [
  { ref: "C-90421", sujet: "Double prélèvement Wave", priorite: "Haute", client: "Sénégal Logistique", min: 12 },
  { ref: "C-90409", sujet: "Adresse de facturation", priorite: "Haute", client: "Dakar Fournitures", min: 18 },
  { ref: "C-90418", sujet: "Accès à l'espace équipe", priorite: "Normale", client: "Clinique Ndar", min: 34 },
  { ref: "C-90417", sujet: "Boucle de réinitialisation", priorite: "Haute", client: "Thiès Agro", min: 2 },
  { ref: "C-90423", sujet: "Erreurs de limite d'API", priorite: "Urgente", client: "Kaolack Transit", min: 8 },
];

/* ---------- Styles (tokens dans style.md) ---------- */
const CSS = `
.relais{--fond:#F2F2F0;--carte:#FAFAF8;--encre:#151515;--muet:#8E8E8A;--trait:#E3E3DF;
--accent:#F2DA1B;--accent-texte:#3A3300;--sombre:#141414;--r:22px;
font-family:"Geist","Inter Tight",system-ui,sans-serif;color:var(--encre);background:var(--fond);
padding:22px 26px;border-radius:30px;font-size:13px;position:relative;min-height:660px;overflow:hidden}
.relais *{box-sizing:border-box}.relais p,.relais h1,.relais h2{margin:0}
.muet{color:var(--muet)}.petit{font-size:11px}.centre{text-align:center}
.ligne{display:flex;align-items:center;justify-content:space-between;gap:10px}.ligne.bas{align-items:flex-end}
.barre-haut{display:flex;align-items:center;gap:22px;margin-bottom:20px}
.marque{font-size:20px;letter-spacing:-.04em}
.onglets{display:flex;gap:4px;flex:1}
.onglets button{position:relative;border:0;background:none;padding:8px 14px;border-radius:999px;font:inherit;color:var(--muet);cursor:pointer}
.onglets button[aria-pressed=true]{color:#fff}
.onglet-actif{position:absolute;inset:0;background:var(--sombre);border-radius:999px}
.onglet-texte{position:relative;display:inline-flex;gap:6px;align-items:center}
.compte{font-style:normal;background:var(--accent);color:var(--accent-texte);border-radius:999px;font-size:10px;padding:0 6px}
.avatar{width:30px;height:30px;border-radius:50%;background:var(--trait);display:grid;place-items:center;font-size:10px}
.titre-vue{margin-bottom:14px}.titre-vue h1{font-size:22px;font-weight:500;letter-spacing:-.02em}
.segments{display:flex;gap:4px}.segments span{font-size:11px;color:var(--muet);padding:4px 8px;border-radius:999px}.segments .actif{background:#fff;color:var(--encre)}
.indicateurs{display:flex;gap:48px;align-items:flex-start;margin-bottom:8px}
.valeur{font-size:44px;font-weight:400;letter-spacing:-.04em;line-height:1}.valeur sup{font-size:16px;color:var(--muet);margin-left:2px}
.valeur.moyen{font-size:22px}
.pastille-gain{background:#fff;border-radius:16px;padding:10px 14px;display:flex;flex-direction:column;gap:4px}
.surligne{background:var(--accent);color:var(--accent-texte);border-radius:999px;padding:2px 8px;font-size:11px;font-weight:500}
.graphique{position:relative;margin:10px 0 16px}
.graphique svg{width:100%;height:150px;display:block}
.courbe{fill:none;stroke:var(--accent);stroke-width:2.5}
.repere{stroke:var(--encre);stroke-dasharray:3 3;stroke-width:1}
.bulle{position:absolute;top:30px;background:#fff;border-radius:12px;padding:8px 12px;box-shadow:0 8px 24px rgba(0,0,0,.08);pointer-events:none;white-space:nowrap}
.axe{display:flex;justify-content:space-between;font-size:10px;color:var(--muet);margin-top:6px}
.grille{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.carte{background:var(--carte);border:1px solid #fff;border-radius:var(--r);padding:16px;display:flex;flex-direction:column;gap:8px}
.barres-points{display:flex;align-items:flex-end;gap:3px;height:56px}
.barres-points i{display:block;width:3px;border-radius:2px;background:repeating-linear-gradient(to top,var(--accent) 0 3px,transparent 3px 5px)}
.carrousel{display:flex;justify-content:center;align-items:baseline;gap:6px;height:64px}
.carrousel button{border:0;background:none;font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center}
.carrousel span{font-size:40px;letter-spacing:-.04em}.carrousel small{font-size:10px;color:var(--muet)}
.note{border-top:1px solid var(--trait);padding-top:8px}
.boite{display:grid;grid-template-columns:1.4fr 1fr;gap:14px}
.liste{padding:8px}
.rangee{display:grid;grid-template-columns:14px 1.4fr 1fr 80px;align-items:center;gap:10px;padding:10px;border:0;background:none;border-radius:14px;text-align:left;font:inherit;cursor:pointer}
.rangee small{display:block}.rangee.choisie{background:#fff;box-shadow:0 4px 16px rgba(0,0,0,.05)}
.point{width:6px;height:6px;border-radius:50%;background:var(--trait)}.point.chaud{background:var(--accent)}
.delai{justify-self:end;font-size:11px;border-radius:999px;padding:3px 9px;background:#ECECE8}.delai.urgent{background:var(--accent);color:var(--accent-texte)}
.detail h2{font-size:20px;font-weight:500}
.compte-rebours{display:flex;gap:12px;align-items:center;background:#fff;border-radius:16px;padding:12px}
.compte-rebours svg{width:40px;height:40px;transform:rotate(-90deg)}
.piste{fill:none;stroke:var(--trait);stroke-width:3}.arc{fill:none;stroke:var(--encre);stroke-width:3;stroke-linecap:round}
.btn{border:0;border-radius:999px;padding:10px 16px;font:inherit;cursor:pointer;align-self:flex-start}.btn.sombre{background:var(--sombre);color:#fff}
.toast{position:absolute;left:50%;bottom:20px;background:var(--sombre);color:#fff;border-radius:14px;padding:10px 14px;display:flex;gap:12px;align-items:center}
.coche{background:var(--accent);color:var(--accent-texte);border-radius:50%;width:22px;height:22px;display:grid;place-items:center}
.toast button{background:none;color:#fff;border:0;font:inherit;cursor:pointer;opacity:.8}
`;
