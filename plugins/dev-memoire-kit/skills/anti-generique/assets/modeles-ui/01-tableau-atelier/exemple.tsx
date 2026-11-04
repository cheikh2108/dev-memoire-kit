/**
 * Modèle 01 — Tableau de bord « Atelier »
 * Reconstruction originale (nom, données et code réécrits) d'après une démo publique
 * de tableau de bord d'agence : grille de cartes claires, accent corail, accueil animé par vue.
 *
 * Dépendances : react 18+, motion 11+ (`npm i motion`). Aucune autre bibliothèque.
 * Usage : <TableauAtelier />  ; les données de démonstration sont en bas du fichier.
 */
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, animate, useMotionValue, useTransform } from "motion/react";

/* ---------- Tokens de mouvement (voir animations.md) ---------- */
const EASE = [0.22, 1, 0.36, 1] as const; // sortie douce, sans rebond
const D = { titre: 0.56, carte: 0.45, jauge: 0.9, compteur: 0.8 };
const CASCADE = 0.045; // décalage entre deux cartes (s)

type Vue = "apercu" | "capacite" | "revues";

const ACCUEIL: Record<Vue, [string, string]> = {
  apercu: ["Prêt à créer ?", "Ton atelier, synchronisé."],
  capacite: ["Semaine 45 réservée à 76 %,", "2 personnes en surcharge."],
  revues: ["2 revues avec les clients,", "1 demande des corrections."],
};

/* ---------- Primitives ---------- */
function Carte({ i, className = "", children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <motion.section
      className={`carte ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: D.carte, ease: EASE, delay: 0.08 + i * CASCADE }}
    >
      {children}
    </motion.section>
  );
}

function Compteur({ valeur, decimales = 1 }: { valeur: number; decimales?: number }) {
  const mv = useMotionValue(0);
  const texte = useTransform(mv, (v) =>
    v.toLocaleString("fr-FR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales }),
  );
  useEffect(() => {
    const c = animate(mv, valeur, { duration: D.compteur, ease: EASE });
    return () => c.stop();
  }, [valeur]);
  return <motion.span>{texte}</motion.span>;
}

function Heures({ v, sur }: { v: number; sur?: number }) {
  return (
    <p className="grand">
      <Compteur valeur={v} /> <span className="unite">h</span>
      {sur !== undefined && <small> sur {sur.toLocaleString("fr-FR", { minimumFractionDigits: 1 })} h</small>}
    </p>
  );
}

function Jauge({ pct, legende, detail }: { pct: number; legende: string; detail: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="jauge">
      <svg viewBox="0 0 128 128" aria-hidden>
        <circle cx="64" cy="64" r={r} className="jauge-fond" />
        <motion.circle
          cx="64" cy="64" r={r} className="jauge-arc"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct / 100) }}
          transition={{ duration: D.jauge, ease: EASE, delay: 0.2 }}
        />
      </svg>
      <div className="jauge-texte">
        <strong><Compteur valeur={pct} decimales={0} /> %</strong>
        <span>{legende}</span>
        <span>{detail}</span>
      </div>
    </div>
  );
}

function Pastille({ ton, children }: { ton: "risque" | "ok"; children: ReactNode }) {
  return <span className={`pastille ${ton}`}>● {children}</span>;
}

/* ---------- Accueil animé ---------- */
function Accueil({ vue }: { vue: Vue }) {
  const [l1, l2] = ACCUEIL[vue];
  return (
    <motion.h1
      key={vue} // nouvelle clé → l'animation se rejoue à chaque changement de vue
      className="accueil"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: D.titre, ease: EASE }}
    >
      <span className="l1">{l1}</span>
      <span className="l2"><i className="curseur" aria-hidden />{l2}</span>
    </motion.h1>
  );
}

/* ---------- Vues ---------- */
function VueApercu() {
  return (
    <div className="grille apercu">
      <Carte i={0} className="projet">
        <header className="ligne">
          <b className="surtitre">ATELIER / STUDIO</b>
          <span className="select">● Teranga Foods ⌄</span>
        </header>
        <p className="muet">Projet en cours · Refonte de marque</p>
        <h2>Identité Teranga <Pastille ton="risque">À risque</Pastille></h2>
        <div className="ligne">
          <button className="btn sombre">Ouvrir le projet</button>
          <span className="ligne">
            <span className="avatars"><i>AN</i><i>MD</i><i>FS</i></span>
            <span className="muet">4 personnes</span>
          </span>
        </div>
        <footer className="sous-carte ligne">
          <div><p className="muet">Reste cette semaine · S45</p><Heures v={13.5} sur={50} /></div>
          <span className="lien">Planifier ce projet</span>
        </footer>
      </Carte>

      <Carte i={1} className="heures">
        <p className="muet">Heures prévues · semaine 45</p>
        <Heures v={206} />
        <div className="sous-carte">
          <p className="muet">Heures réalisées · 81 % du plan</p>
          <Heures v={167} />
        </div>
      </Carte>

      <Carte i={2} className="capacite-mini">
        <Jauge pct={76} legende="capacité" detail="206 / 272 h" />
      </Carte>

      <Carte i={3} className="echeance">
        <p className="muet">Mise en ligne Kër Digital</p>
        <p className="grand">13 <small>jours</small></p>
        <div className="points">
          {Array.from({ length: 21 }, (_, k) => (
            <motion.i
              key={k}
              className={k < 8 ? "plein" : ""}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + k * 0.015, duration: 0.25, ease: EASE }}
            />
          ))}
        </div>
      </Carte>

      <Carte i={4} className="tendance">
        <div className="ligne"><p className="muet">Rythme de l'équipe</p><b>167,0 h</b></div>
        <svg viewBox="0 0 200 50" className="courbe" aria-hidden>
          <motion.path
            d="M0 38 C20 30 30 42 50 34 S80 18 100 30 S140 40 160 22 S190 26 200 20"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
          />
        </svg>
        <div className="ligne"><span className="muet">Lun.–jeu. vs semaine dernière</span><span className="badge">+9,2 %</span></div>
      </Carte>

      <Carte i={5} className="activite">
        <div className="ligne"><b>Activité récente</b><span className="muet">4 entrées</span></div>
        <ul className="fil">
          {ACTIVITE.map((a, k) => (
            <motion.li
              key={a}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + k * 0.06, duration: 0.35, ease: EASE }}
            >
              {a}
            </motion.li>
          ))}
        </ul>
      </Carte>

      <Carte i={6} className="alerte">
        <p className="grand-petit">2 personnes en surcharge</p>
        <p className="muet">8 h à déplacer · Moussa, Fatou</p>
        <button className="btn accent">Planifier la semaine</button>
      </Carte>
    </div>
  );
}

function VueCapacite() {
  return (
    <div className="grille capacite">
      <Carte i={0} className="capacite-grande">
        <b>Capacité de l'équipe</b>
        <p className="muet">Semaine 45 · 2–6 nov.</p>
        <div className="ligne">
          <Jauge pct={76} legende="réservé" detail="206 / 272 h" />
          <dl className="repartition">
            <dt>Dans la capacité</dt><dd>198 h</dd>
            <dt>Au-delà</dt><dd className="accent">8 h</dd>
            <dt>Libre</dt><dd>74 h</dd>
          </dl>
        </div>
      </Carte>
      <Carte i={1} className="planning">
        <div className="ligne"><b>Planning</b><span className="muet">Glisser une tâche ou appuyer</span></div>
        {EQUIPE.map((p, k) => (
          <div className="rangee" key={p.nom}>
            <span className="avatars"><i>{p.nom.split(" ").map((m) => m[0]).join("")}</i></span>
            <span className="nom">{p.nom}</span>
            <div className="barre">
              <motion.i
                className={p.h > p.max ? "trop" : ""}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (p.h / p.max) * 100)}%` }}
                transition={{ delay: 0.2 + k * 0.04, duration: 0.6, ease: EASE }}
              />
            </div>
            <span className={p.h > p.max ? "accent" : "muet"}>{p.h}/{p.max}</span>
          </div>
        ))}
      </Carte>
    </div>
  );
}

function VueRevues() {
  return (
    <div className="grille revues">
      <Carte i={0} className="file">
        <b>File des revues</b>
        {REVUES.map((r, k) => (
          <motion.div
            className="rangee"
            key={r.titre}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + k * 0.05, duration: 0.35, ease: EASE }}
          >
            <span className="nom">{r.titre}<small className="muet"> · {r.client}</small></span>
            <span className="muet">{r.date}</span>
            <span className={`etat ${r.etat === "Corrections" ? "risque" : ""}`}>{r.etat}</span>
          </motion.div>
        ))}
      </Carte>
      <Carte i={1} className="capacite-mini">
        <Jauge pct={60} legende="points validés" detail="12 / 20" />
      </Carte>
    </div>
  );
}

/* ---------- Coquille ---------- */
const VUES: Vue[] = ["apercu", "capacite", "revues"];
const LIBELLES: Record<Vue, string> = { apercu: "Vue d'ensemble", capacite: "Capacité", revues: "Revues clients" };

export default function TableauAtelier({ defilementAuto = false }: { defilementAuto?: boolean }) {
  const [vue, setVue] = useState<Vue>("apercu");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    // Démo uniquement : faire défiler les vues comme dans une vidéo de présentation.
    if (!defilementAuto) return;
    const t = setInterval(() => setVue((v) => VUES[(VUES.indexOf(v) + 1) % VUES.length]), 1750);
    return () => clearInterval(t);
  }, [defilementAuto]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="atelier">
      <style>{CSS}</style>
      <header className="entete">
        <span className="logo">A°</span>
        <div><b>Atelier</b><p className="muet">Espace studio</p></div>
        <span className="espace" />
        <span className="avatars"><i>AN</i></span>
        <div><b>Awa Ndiaye</b><p className="muet">Directrice de studio</p></div>
        <input className="recherche" placeholder="Rechercher…" aria-label="Rechercher" />
      </header>

      <div className="bandeau">
        <span className="jour">05</span>
        <p className="muet">Jeudi,<br />novembre</p>
        <motion.button
          className="btn accent"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setToast(true); setTimeout(() => setToast(false), 2600); }}
        >
          Mes tâches →<span className="compte">2</span>
        </motion.button>
        <Accueil vue={vue} />
      </div>

      <div className="corps">
        <nav className="rail" aria-label="Vues">
          {VUES.map((v) => (
            <button key={v} aria-pressed={vue === v} onClick={() => setVue(v)} title={LIBELLES[v]}>
              {vue === v && (
                <motion.span layoutId="rail-actif" className="rail-actif" transition={{ duration: 0.35, ease: EASE }} />
              )}
              <span className="rail-icone">{LIBELLES[v][0]}</span>
            </button>
          ))}
        </nav>
        <AnimatePresence mode="wait">
          <motion.main key={vue} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
            {vue === "apercu" && <VueApercu />}
            {vue === "capacite" && <VueCapacite />}
            {vue === "revues" && <VueRevues />}
          </motion.main>
        </AnimatePresence>
      </div>

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
            ✓ Maquette déplacée vers Moussa · semaine 46
            <button onClick={() => setToast(false)}>Annuler</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </MotionConfig>
  );
}

/* ---------- Données de démonstration (fictives) ---------- */
const ACTIVITE = [
  "Moussa a saisi 3,5 h sur la recette, tour 1",
  "Fatou a livré les maquettes du rayon",
  "Ibrahima a partagé la charte couleurs",
  "Awa a déplacé la présentation client",
];
const EQUIPE = [
  { nom: "Awa Ndiaye", h: 36, max: 40 },
  { nom: "Moussa Diop", h: 42, max: 40 },
  { nom: "Fatou Sarr", h: 46, max: 40 },
  { nom: "Ibrahima Fall", h: 30, max: 40 },
  { nom: "Aminata Ba", h: 24, max: 32 },
  { nom: "Ousmane Gueye", h: 16, max: 32 },
];
const REVUES = [
  { titre: "Site vitrine, tour 4", client: "Kër Digital", date: "lun. 9 nov.", etat: "Corrections" },
  { titre: "Emballages, version finale", client: "Teranga Foods", date: "ven. 6 nov.", etat: "Chez le client" },
  { titre: "Parcours d'inscription", client: "Jàng App", date: "ven. 13 nov.", etat: "Planifiée" },
];

/* ---------- Styles (tokens détaillés dans style.md) ---------- */
const CSS = `
.atelier{--fond:#F3F2F0;--carte:#FFFFFF;--sous:#F7F6F4;--encre:#141414;--muet:#9B9893;--trait:#ECEAE6;
--accent:#E2553F;--accent-doux:#F8DED7;--sombre:#121212;--r:24px;--r-sous:18px;
--ombre:0 1px 2px rgba(20,20,20,.04),0 10px 30px rgba(20,20,20,.05);
font-family:"Geist","Inter Tight",system-ui,sans-serif;color:var(--encre);background:var(--fond);
padding:20px;border-radius:32px;font-size:13px;position:relative;min-height:640px;overflow:hidden}
.atelier *{box-sizing:border-box}
.atelier p{margin:0}.muet{color:var(--muet);font-size:12px}.accent{color:var(--accent)}
.ligne{display:flex;align-items:center;justify-content:space-between;gap:10px}
.entete{display:flex;align-items:center;gap:12px;margin-bottom:18px}.espace{flex:1}
.logo{width:40px;height:40px;border-radius:50%;background:var(--sombre);color:#fff;display:grid;place-items:center;font-weight:600}
.recherche{border:0;background:var(--carte);border-radius:999px;padding:10px 16px;width:220px;box-shadow:var(--ombre);font:inherit}
.bandeau{display:flex;align-items:center;gap:14px;margin-bottom:18px}
.jour{width:64px;height:64px;border-radius:50%;background:var(--carte);box-shadow:var(--ombre);display:grid;place-items:center;font-size:22px}
.btn{border:0;border-radius:999px;padding:10px 18px;font:inherit;font-weight:500;cursor:pointer;position:relative}
.btn.accent{background:var(--accent);color:#fff;box-shadow:0 6px 16px rgba(226,85,63,.3)}
.btn.sombre{background:var(--sombre);color:#fff}
.compte{position:absolute;top:-6px;right:-6px;background:var(--sombre);color:#fff;border-radius:999px;font-size:10px;width:18px;height:18px;display:grid;place-items:center}
.accueil{margin:0 0 0 auto;font-size:28px;font-weight:500;line-height:1.15;letter-spacing:-.02em;display:flex;flex-direction:column;min-width:360px}
.accueil .l2{color:#B9B6B0}
.curseur{display:inline-block;width:2px;height:.9em;background:var(--encre);margin-right:2px;vertical-align:-2px;animation:clign 1s steps(1) infinite}
@keyframes clign{50%{opacity:0}}
.corps{display:grid;grid-template-columns:56px 1fr;gap:14px}
.rail{display:flex;flex-direction:column;gap:8px;background:var(--carte);border-radius:999px;padding:8px;height:max-content;box-shadow:var(--ombre)}
.rail button{position:relative;width:40px;height:40px;border:0;background:none;border-radius:50%;cursor:pointer;color:var(--muet);font:inherit}
.rail button[aria-pressed=true]{color:#fff}
.rail-actif{position:absolute;inset:0;background:var(--sombre);border-radius:50%}
.rail-icone{position:relative}
.grille{display:grid;gap:14px;grid-template-columns:repeat(12,1fr)}
.carte{background:var(--carte);border-radius:var(--r);padding:16px;box-shadow:var(--ombre);display:flex;flex-direction:column;gap:8px}
.sous-carte{background:var(--sous);border-radius:var(--r-sous);padding:12px}
.apercu .projet{grid-column:span 5}.apercu .heures{grid-column:span 4}.apercu .capacite-mini{grid-column:span 3;align-items:center;justify-content:center}
.apercu .echeance{grid-column:span 3}.apercu .tendance{grid-column:span 4}.apercu .activite{grid-column:span 3}.apercu .alerte{grid-column:span 2}
.surtitre{font-style:italic;letter-spacing:.02em;font-size:12px}
.select{background:var(--sous);border-radius:999px;padding:4px 10px;font-size:12px}
.atelier h2{margin:0;font-size:18px;font-weight:500;display:flex;gap:8px;align-items:center}
.pastille{font-size:11px;border-radius:999px;padding:2px 8px;background:var(--sous)}
.pastille.risque{color:var(--accent);background:var(--accent-doux)}
.avatars{display:inline-flex;padding-left:6px}.avatars i{font-style:normal;width:26px;height:26px;border-radius:50%;background:var(--accent-doux);color:#8A3426;display:grid;place-items:center;font-size:10px;margin-left:-6px;border:2px solid var(--carte)}
.grand{font-size:24px;font-weight:500;letter-spacing:-.02em}.grand small{font-size:12px;color:var(--muet);font-weight:400}
.grand-petit{font-size:15px;font-weight:500}
.unite{color:var(--accent)}.lien{color:var(--accent);font-size:12px}
.jauge{position:relative;width:128px;height:128px}
.jauge svg{transform:rotate(-90deg)}
.jauge-fond{fill:none;stroke:var(--trait);stroke-width:10}
.jauge-arc{fill:none;stroke:var(--accent);stroke-width:10;stroke-linecap:round}
.jauge-texte{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:10px;color:var(--muet)}
.jauge-texte strong{font-size:22px;color:var(--encre);font-weight:500}
.points{display:grid;grid-template-columns:repeat(7,10px);gap:5px}
.points i{width:10px;height:10px;border-radius:50%;background:var(--trait)}.points i.plein{background:var(--accent)}
.courbe{width:100%;height:60px}.courbe path{fill:none;stroke:var(--accent);stroke-width:1.5}
.badge{border:1px solid var(--trait);border-radius:999px;padding:3px 10px;font-size:12px}
.fil{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.fil li{padding-left:16px;position:relative;font-size:12px}.fil li:before{content:"";position:absolute;left:0;top:5px;width:8px;height:8px;border-radius:50%;background:var(--accent)}
.capacite .capacite-grande{grid-column:span 5}.capacite .planning{grid-column:span 7}
.repartition{display:grid;grid-template-columns:auto auto;gap:6px 18px;margin:0;font-size:12px}.repartition dd{margin:0;text-align:right}
.rangee{display:grid;grid-template-columns:30px 120px 1fr 52px;align-items:center;gap:10px;padding:6px 0;border-top:1px solid var(--trait)}
.barre{height:6px;background:var(--sous);border-radius:999px;overflow:hidden}.barre i{display:block;height:100%;background:var(--sombre);border-radius:999px}.barre i.trop{background:var(--accent)}
.revues .file{grid-column:span 9}.revues .capacite-mini{grid-column:span 3;align-items:center;justify-content:center}
.revues .rangee{grid-template-columns:1fr 110px 120px}
.etat{justify-self:end;font-size:11px;border-radius:999px;padding:3px 10px;background:var(--sombre);color:#fff}.etat.risque{background:var(--accent-doux);color:var(--accent)}
.toast{position:absolute;left:50%;bottom:20px;background:var(--sombre);color:#fff;border-radius:14px;padding:10px 14px;display:flex;gap:14px;align-items:center;box-shadow:0 12px 30px rgba(0,0,0,.25)}
.toast button{background:#2A2A2A;color:#fff;border:0;border-radius:999px;padding:4px 10px;font:inherit;cursor:pointer}
@media (prefers-reduced-motion:reduce){.atelier *{animation:none!important;transition:none!important}}
`;
