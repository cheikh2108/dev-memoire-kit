/**
 * Modèle 01 — Tableau de bord « Atelier »
 * Reconstruction originale (nom, données et code réécrits) d'après une démo publique
 * de tableau de bord d'agence. Relevé élément par élément : voir README.md, section « Relevé ».
 *
 * Quatre vues : Vue d'ensemble · Projets · Capacité de l'équipe · Revues clients.
 * Dépendances : react 18+, motion 11+ (`npm i motion`). Aucune autre bibliothèque.
 */
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, animate, useMotionValue, useTransform } from "motion/react";

/* ====================================================================== */
/* Mouvement (voir animations.md)                                          */
/* ====================================================================== */
const EASE = [0.22, 1, 0.36, 1] as const;
const D = { titre: 0.56, carte: 0.45, jauge: 0.9, compteur: 0.8 };
const CASCADE = 0.045;

type Vue = "apercu" | "projets" | "capacite" | "revues";
const VUES: Vue[] = ["apercu", "projets", "capacite", "revues"];
const LIBELLES: Record<Vue, string> = {
  apercu: "Vue d'ensemble",
  projets: "Projets",
  capacite: "Capacité de l'équipe",
  revues: "Revues clients",
};
const ACCUEIL: Record<Vue, [string, string]> = {
  apercu: ["Prêt à créer ?", "Ton atelier, synchronisé."],
  projets: ["6 projets en cours,", "2 demandent de l'attention."],
  capacite: ["Semaine 45 réservée à 76 %,", "2 personnes en surcharge."],
  revues: ["2 tours avec les clients,", "1 demande des corrections."],
};

/* ====================================================================== */
/* Icônes (traits 1,6 px, 20 × 20)                                         */
/* ====================================================================== */
const TRACES: Record<string, string> = {
  menu: "M4 6h12M4 10h12M4 14h12",
  plus: "M10 4v12M4 10h12",
  loupe: "M9 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM17 17l-3.5-3.5",
  calendrier: "M4 6h12v10H4zM4 9h12M7 4v3M13 4v3",
  historique: "M4 10a6 6 0 1 0 2-4.5M4 4v3h3M10 7v3l2 2",
  grille: "M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z",
  dossier: "M3 6h5l2 2h7v8H3z",
  equipe: "M7 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2.5 16c.5-3 2.3-4.5 4.5-4.5s4 1.5 4.5 4.5M13 9a2 2 0 1 0 0-4M14 11.5c2 .3 3 1.8 3.5 4",
  bulles: "M3 4h10v7H7l-3 3v-3H3zM15 8h2v7h-1v2l-2-2H9v-2",
  partage: "M14 6a2 2 0 1 0 0-.1M6 12a2 2 0 1 0 0-.1M14 16a2 2 0 1 0 0-.1M8 11l4-4M8 13l4 2",
  horloge: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM10 6v4l3 2",
  chrono: "M10 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM10 8v3M8 2h4",
  cadenas: "M5 9h10v8H5zM7 9V6a3 3 0 0 1 6 0v3",
  barres: "M5 16V9M10 16V4M15 16v-5",
  pouls: "M2 10h4l2-5 4 10 2-5h4",
  fleche: "M4 10h12M11 5l5 5-5 5",
  gauche: "M12 5l-5 5 5 5",
  droite: "M8 5l5 5-5 5",
  bas: "M6 8l4 4 4-4",
  croix: "M5 5l10 10M15 5L5 15",
  etincelle: "M10 3v4M10 13v4M3 10h4M13 10h4M5.5 5.5l2 2M12.5 12.5l2 2M14.5 5.5l-2 2M7.5 12.5l-2 2",
  coche: "M5 10l3.5 3.5L15 7",
  annuler: "M7 7H4V4M4.5 7A6 6 0 1 1 6 14.5",
  filtre: "M3 5h14l-5 6v5l-4-2v-3z",
  points: "M10 5h.01M10 10h.01M10 15h.01",
  agrandir: "M12 4h4v4M8 16H4v-4M16 4l-5 5M4 16l5-5",
  graphique: "M4 16V4M4 16h12M7 13l3-4 3 2 3-5",
  cible: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
};
function Icone({ n, taille = 16 }: { n: keyof typeof TRACES; taille?: number }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={TRACES[n]} />
    </svg>
  );
}

/* ====================================================================== */
/* Primitives                                                              */
/* ====================================================================== */
function Carte({ i, zone, className = "", children }: { i: number; zone?: string; className?: string; children: ReactNode }) {
  return (
    <motion.section
      className={`carte ${className}`}
      style={zone ? { gridArea: zone } : undefined}
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
  const texte = useTransform(mv, (v) => v.toLocaleString("fr-FR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales }));
  useEffect(() => {
    const c = animate(mv, valeur, { duration: D.compteur, ease: EASE });
    return () => c.stop();
  }, [valeur]);
  return <motion.span>{texte}</motion.span>;
}

/** Valeur en heures : chiffre noir, « h » corail, « sur X h » gris. */
function Heures({ v, sur, taille = "grand" }: { v: number; sur?: number; taille?: "grand" | "moyen" }) {
  return (
    <p className={taille}>
      <Compteur valeur={v} />
      <span className="unite"> h</span>
      {sur !== undefined && <small> sur {sur.toLocaleString("fr-FR", { minimumFractionDigits: 1 })} h</small>}
    </p>
  );
}

/** Jauge sur disque noir : piste gris anthracite, arc corail, texte blanc. */
function JaugeNoire({ pct, legende, detail, taille = 112 }: { pct: number; legende: string; detail: string; taille?: number }) {
  const r = 50;
  const c = 2 * Math.PI * r;
  return (
    <div className="jauge-noire" style={{ width: taille, height: taille }}>
      <svg viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r="58" className="disque" />
        <circle cx="60" cy="60" r={r} className="piste" />
        <motion.circle
          cx="60" cy="60" r={r} className="arc"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct / 100) }}
          transition={{ duration: D.jauge, ease: EASE, delay: 0.2 }}
        />
      </svg>
      <div className="jauge-texte">
        <strong><Compteur valeur={pct} decimales={0} />%</strong>
        <span>{legende}</span>
        <span>{detail}</span>
      </div>
    </div>
  );
}

function Pastille({ ton = "neutre", children }: { ton?: "risque" | "neutre" | "noire"; children: ReactNode }) {
  return <span className={`pastille ${ton}`}>{children}</span>;
}

function BoutonRond({ n, badge, point, grand, onClick, label }: { n: keyof typeof TRACES; badge?: number; point?: boolean; grand?: boolean; onClick?: () => void; label: string }) {
  return (
    <button className={`rond ${grand ? "grand" : ""}`} onClick={onClick} aria-label={label}>
      <Icone n={n} />
      {badge !== undefined && <span className="badge-noir">{badge}</span>}
      {point && <span className="point-rouge" />}
    </button>
  );
}

function Selecteur({ children }: { children: ReactNode }) {
  return <span className="selecteur">{children} <Icone n="bas" taille={12} /></span>;
}

function Avatars({ initiales, plus }: { initiales: string[]; plus?: number }) {
  return (
    <span className="avatars">
      {initiales.map((x) => <i key={x}>{x}</i>)}
      {plus !== undefined && <i className="plus">+{plus}</i>}
    </span>
  );
}

function Initiales({ nom }: { nom: string }) {
  return <i className="initiales">{nom.split(" ").map((m) => m[0]).join("").slice(0, 2)}</i>;
}

function Barre({ pct, trop }: { pct: number; trop?: boolean }) {
  return (
    <span className="barre">
      <motion.i className={trop ? "trop" : ""} initial={{ width: 0 }} animate={{ width: `${Math.min(100, pct)}%` }} transition={{ duration: 0.6, ease: EASE, delay: 0.25 }} />
    </span>
  );
}

function ActionCorail({ children }: { children: ReactNode }) {
  return (
    <span className="action-corail">
      <span className="icone-corail"><Icone n="cible" taille={14} /></span>
      <span>{children}</span>
    </span>
  );
}

/* ====================================================================== */
/* Vue d'ensemble                                                          */
/* ====================================================================== */
function VueApercu({ onPlanifier }: { onPlanifier: () => void }) {
  const [humeur, setHumeur] = useState<number | null>(null);
  return (
    <div className="grille apercu">
      <Carte i={0} zone="projet" className="projet">
        <div className="ligne">
          <b className="surtitre">ATELIER / STUDIO</b>
          <Selecteur><span className="point-corail" /> Teranga</Selecteur>
        </div>
        <p className="muet">Projet en cours · Teranga Foods</p>
        <h2>Identité Teranga <Pastille ton="risque">● À risque</Pastille></h2>
        <div className="ligne">
          <button className="btn noir">Clore le projet</button>
          <span className="groupe"><Avatars initiales={["AN", "MD", "FS"]} plus={1} /> 4 personnes</span>
        </div>
        <div className="sous-carte ligne">
          <div><p className="muet">Reste cette semaine · S45</p><Heures v={13.5} sur={50} /></div>
          <ActionCorail>Planifier<br />ce projet</ActionCorail>
        </div>
      </Carte>

      <Carte i={1} zone="heures" className="heures">
        <div className="sous-carte blanche">
          <div className="ligne"><Icone n="chrono" /><Selecteur>Hebdo</Selecteur></div>
          <p className="muet">Heures prévues · semaine 45</p>
          <Heures v={206} />
        </div>
        <div className="sous-carte blanche">
          <div className="ligne"><Icone n="calendrier" /><Selecteur>Hebdo</Selecteur></div>
          <p className="muet">Heures livrées · 81 % du plan</p>
          <div className="ligne"><Heures v={167} /><ActionCorail>Voir<br />en graphique</ActionCorail></div>
        </div>
      </Carte>

      <Carte i={2} zone="acces" className="acces">
        <Icone n="cadenas" />
        <b>Accès client</b>
        <span className="muet petit">4 sur 6 actifs</span>
      </Carte>

      <motion.div style={{ gridArea: "jauge" }} className="cellule-jauge" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: D.carte, ease: EASE, delay: 0.2 }}>
        <JaugeNoire pct={76} legende="Capacité équipe" detail="206 / 272 h" />
      </motion.div>

      <Carte i={3} zone="echeance" className="echeance">
        <Icone n="horloge" />
        <p className="moyen">13 jours</p>
        <p className="muet petit">Mise en ligne Kër Digital</p>
        <div className="points">
          {Array.from({ length: 20 }, (_, k) => (
            <motion.i key={k} className={k < 10 ? "plein" : k === 10 ? "aujourdhui" : ""}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + k * 0.015, duration: 0.25, ease: EASE }} />
          ))}
        </div>
      </Carte>

      <Carte i={4} zone="semaines" className="semaines">
        <Icone n="barres" />
        <div className="colonnes-semaines">
          <span className="sem">S44</span>
          <span className="sem active">S45</span>
          <motion.i className="trait-s45" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ originY: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.35 }} />
        </div>
      </Carte>

      <Carte i={5} zone="momentum" className="momentum">
        <div className="ligne"><Icone n="pouls" /><b className="moyen">167,0<span className="unite"> h</span></b></div>
        <svg viewBox="0 0 220 50" className="courbe" aria-hidden>
          <motion.path d="M0 30 C15 30 20 24 35 26 S55 36 70 34 S95 20 110 30 S140 40 150 28 S170 16 180 26 S205 30 220 26"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 }} />
        </svg>
        <div className="ligne">
          <div><b>Rythme de l'équipe</b><p className="muet petit">Livré lun.–jeu. vs semaine dernière</p></div>
          <span className="badge-contour">+ 9,2 %</span>
        </div>
      </Carte>

      <Carte i={6} zone="livres" className="livres">
        <div className="ligne"><b>Projets livrés</b><Selecteur>2026</Selecteur></div>
        <p className="muet petit">Chaque anneau fait partie de celui qui l'entoure</p>
        <div className="anneaux">
          {[
            { v: 48, l: "livrés", t: 200 },
            { v: 36, l: "dans le budget", t: 150 },
            { v: 24, l: "+ à l'heure", t: 104 },
            { v: 12, l: "premier tour", t: 60 },
          ].map((a, k) => (
            <motion.div key={a.v} className={`anneau a${k}`} style={{ width: a.t, height: a.t }}
              initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.25 + k * 0.08 }}>
              <span><b>{a.v}</b><small>{a.l}</small></span>
            </motion.div>
          ))}
        </div>
      </Carte>

      <Carte i={7} zone="activite" className="activite">
        <div className="ligne">
          <b>Gestion des activités</b>
          <span className="groupe">
            <BoutonRond n="points" label="Plus d'options" />
            <BoutonRond n="agrandir" label="Agrandir" />
            <span className="filtres"><Icone n="filtre" taille={14} /> Filtres <i className="compte-noir">2</i></span>
          </span>
        </div>
        <div className="ligne">
          <span className="recherche-ligne"><Icone n="loupe" taille={14} /> Rechercher dans les activités…</span>
          <span className="groupe"><span className="puce">Équipe <i className="point-corail" /></span><span className="puce">Aujourd'hui <Icone n="croix" taille={10} /></span></span>
        </div>
        <div className="trois">
          <div className="sous-carte blanche">
            <Heures v={154.5} />
            <p className="muet petit">travail client · S45</p>
            <div className="baton">
              {[0.5, 0.8, 0.35, 0.9, 0.6, 0.95, 0.7, 0.55, 0.3, 0.15, 0.1, 0.1].map((h, k) => (
                <motion.i key={k} style={{ height: `${h * 100}%`, originY: 1 }} className={k > 8 ? "pale" : ""}
                  initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.35 + k * 0.03 }} />
              ))}
            </div>
          </div>
          <div className="sous-carte blanche">
            <div className="ligne"><b>Activité récente</b><span className="muet petit">5 entrées</span></div>
            <ul className="fil">
              {ACTIVITE.map((a, k) => (
                <motion.li key={a} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + k * 0.06, duration: 0.35, ease: EASE }}>
                  <span className="icone-corail mini"><Icone n="dossier" taille={10} /></span>{a}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="sous-carte blanche alerte">
            <span className="soleil"><Icone n="etincelle" taille={30} /></span>
            <b>2 personnes en surcharge</b>
            <p className="muet petit">8,0 h à déplacer · Moussa, Fatou</p>
            <button className="btn corail plein" onClick={onPlanifier}>Planifier la semaine</button>
          </div>
        </div>
      </Carte>

      <Carte i={8} zone="pouls" className="pouls">
        <div className="ligne">
          <span className="indicateur-pages"><i className="actif" /><i /><i /></span>
          <BoutonRond n="croix" label="Fermer" />
        </div>
        <p className="muet petit">Pouls du studio · 1 sur 3</p>
        <b className="moyen">Comment se passe ta semaine ?</b>
        <div className="humeurs">
          {HUMEURS.map((h, k) => (
            <motion.button key={h} aria-label={`Humeur ${k + 1}`} aria-pressed={humeur === k} onClick={() => setHumeur(k)} whileTap={{ scale: 0.9 }}>
              <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d={h} /></svg>
            </motion.button>
          ))}
        </div>
      </Carte>
    </div>
  );
}

/* ====================================================================== */
/* Projets                                                                 */
/* ====================================================================== */
function VueProjets() {
  const [filtre, setFiltre] = useState("Tous");
  const lignes = PROJETS.filter((p) => filtre === "Tous" || p.statut === filtre);
  return (
    <div className="grille projets">
      <Carte i={0} zone="projet" className="projet">
        <div className="ligne">
          <b className="surtitre">TF / IDENTITÉ DE MARQUE</b>
          <span className="pastille noire"><Icone n="cadenas" taille={12} /> Accès client activé</span>
        </div>
        <p className="muet petit">Teranga Foods · Phase 03 · Développement graphique</p>
        <h2>Identité Teranga <Pastille ton="risque">● À risque</Pastille></h2>
        <div className="ligne">
          <span className="groupe"><Initiales nom="Fatou Sarr" /><span><b>Fatou Sarr</b><small className="muet bloc">Responsable · Direction artistique</small></span></span>
          <Avatars initiales={["AN", "MD", "IB"]} />
        </div>
        <div className="sous-carte ligne">
          <div><p className="muet petit">Prochaine échéance</p><p className="groupe"><Icone n="calendrier" taille={14} /><span><b>Présentation client</b><small className="muet bloc">ven. 13 nov. · dans 8 jours</small></span></p></div>
          <ActionCorail>Planifier dans<br />la capacité</ActionCorail>
          <Icone n="bulles" />
        </div>
      </Carte>

      <Carte i={1} zone="livrables" className="livrables">
        <div className="ligne">
          <div><b>Teranga · semaine 45</b><p className="muet petit">2–6 nov. · 36,5 h sur 50,0 h livrées · 13,5 h restantes</p></div>
          <span className="groupe"><BoutonRond n="gauche" label="Semaine précédente" /><BoutonRond n="droite" label="Semaine suivante" /></span>
        </div>
        {LIVRABLES.map((l) => (
          <div className="rangee-livrable" key={l.titre}>
            <Initiales nom={l.qui} />
            <span>{l.titre}</span>
            <span className="muet">{l.date}</span>
            <Barre pct={(l.fait / l.prevu) * 100} />
            <span>{l.fait.toLocaleString("fr-FR")}/{l.prevu} h</span>
            <span className={`etat-texte ${l.etat === "En cours" ? "corail" : ""}`}>{l.etat}</span>
            <Icone n="fleche" taille={14} />
          </div>
        ))}
      </Carte>

      <Carte i={2} zone="budget" className="budget">
        <div className="ligne"><b>Budget d'heures</b><span className="muet petit">20,0 h non planifiées</span></div>
        <div className="ligne bas">
          <motion.div className="sphere" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.25 }} />
          <dl className="budget-chiffres">
            <dt>budget</dt><dd>300,0 h</dd>
            <dt>planifié</dt><dd>280,0 h</dd>
            <dt>● livré</dt><dd>182,5 h</dd>
          </dl>
        </div>
        <p className="muet petit">61 % du budget livré</p>
      </Carte>

      <Carte i={3} zone="tableau" className="tableau-projets">
        <div className="ligne">
          <span className="groupe">
            <b>Tous les projets</b>
            {[["Tous", 8], ["À risque", 2], ["Dans les temps", 4], ["Livré", 1]].map(([l, n]) => (
              <button key={l} className={`onglet ${filtre === l ? "actif" : ""}`} onClick={() => setFiltre(String(l))}>{l} <i>{n}</i></button>
            ))}
          </span>
          <span className="recherche-ligne"><Icone n="loupe" taille={14} /> Filtrer par projet, client ou responsable…</span>
        </div>
        <div className="entete-table">
          <span>Projet</span><span>Responsable</span><span>Livré sur prévu</span><span>Semaine 45</span><span>Prochaine échéance</span><span>Statut</span><span>Client</span>
        </div>
        <AnimatePresence initial={false}>
          {lignes.map((p, k) => (
            <motion.div layout key={p.nom} className="rangee-projet" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.15 + k * 0.03 }}>
              <span><i className={`pastille-point ${p.statut === "À risque" ? "risque" : ""}`} /> <b>{p.nom}</b> <small className="muet">{p.client} · {p.type}</small></span>
              <span className="groupe"><Initiales nom={p.qui} /> {p.qui}</span>
              <span className="groupe"><Barre pct={(p.livre / p.prevu) * 100} trop={p.statut === "À risque"} /> {p.livre.toLocaleString("fr-FR")}/{p.prevu} h</span>
              <span>{p.reste.toLocaleString("fr-FR")} h <small className="muet">restantes sur {p.semaine} h</small></span>
              <span>{p.echeance} <small className="muet">{p.quoi}</small></span>
              <span className={`statut ${p.statut === "À risque" ? "risque" : ""}`}>● {p.statut}</span>
              <span className="muet"><Icone n="cadenas" taille={14} /></span>
            </motion.div>
          ))}
        </AnimatePresence>
      </Carte>
    </div>
  );
}

/* ====================================================================== */
/* Capacité de l'équipe                                                    */
/* ====================================================================== */
function VueCapacite({ onDeplacer }: { onDeplacer: () => void }) {
  return (
    <div className="grille capacite">
      <Carte i={0} zone="cap" className="cap">
        <div className="ligne">
          <div><b>Capacité de l'équipe</b><p className="muet petit">Semaine 45 · 2–6 nov.</p></div>
          <span className="groupe"><BoutonRond n="gauche" label="Semaine précédente" /><BoutonRond n="droite" label="Semaine suivante" /></span>
        </div>
        <div className="ligne">
          <JaugeNoire pct={76} legende="réservé" detail="206,0 / 272,0 h" taille={128} />
          <dl className="legende-cap">
            <dt><i className="carre corail" />Dans la capacité</dt><dd>198,0 h</dd>
            <dt><i className="carre corail-pale" />Au-delà</dt><dd>8,0 h</dd>
            <dt><i className="carre vide" />Libre</dt><dd>74,0 h</dd>
            <dt className="muet">Disponible</dt><dd className="muet">272,0 h</dd>
          </dl>
        </div>
      </Carte>

      <Carte i={1} zone="sem" className="semaines-cap">
        <div className="sous-carte blanche">
          <div className="ligne"><span className="muet petit">Cette semaine · S45 · 2–6 nov.</span><Pastille ton="risque">2 en surcharge</Pastille></div>
          <Heures v={206} sur={272} taille="moyen" />
          <Barre pct={76} trop />
          <p className="muet petit">167,0 h livrées · 39,0 h restant à livrer</p>
        </div>
        <div className="sous-carte blanche">
          <div className="ligne"><span className="muet petit">Semaine prochaine · S46 · 9–13 nov.</span><span className="muet petit">tient</span></div>
          <Heures v={196} sur={264} taille="moyen" />
          <Barre pct={74} trop />
          <p className="muet petit">68,0 h libres · rien de livré encore</p>
        </div>
      </Carte>

      <Carte i={2} zone="sugg" className="sugg">
        <div className="ligne"><b>Déplacements suggérés</b><Icone n="etincelle" /></div>
        <p className="muet petit">Faire tenir une semaine surchargée dans les heures libres d'un collègue</p>
        <div className="sous-carte blanche ligne">
          <div><b>Maquette de présentation · 8,0 h</b><p className="petit">Moussa → Ibrahima · semaine 46</p><p className="muet petit">Moussa revient à 95 %</p></div>
          <button className="btn corail plein" onClick={onDeplacer}>Appliquer</button>
        </div>
        <p className="petit">Ibrahima +2,0 h · toutes les tâches ont commencé, rien à déplacer</p>
      </Carte>

      <Carte i={3} zone="pls" className="pls">
        <b>Pouls du studio</b>
        <p className="muet petit">Réponses enregistrées sur la vue d'ensemble</p>
        <div className="tableau-pouls">
          <span /><span className="muet">S43</span><span className="muet">S44</span><b>S45</b>
          <Ligne3 l="Semaine" v={[3, 2, null]} />
          <Ligne3 l="Charge" v={[2, 4, null]} />
          <Ligne3 l="Clients" v={[3, 3, null]} />
        </div>
        <p className="petit lien-noir">Répondre pour cette semaine sur la vue d'ensemble →</p>
      </Carte>

      <Carte i={4} zone="plan" className="plan">
        <div className="entete-plan">
          <div><b>Planning</b><p className="muet petit">Glisser une puce ou appuyer</p></div>
          <div><b className="petit">Cette semaine</b><p className="muet petit">S45 · 2–6 nov.<br />206,0 / 272,0 h · 76 %</p></div>
          <div className="ligne">
            <div><b className="petit">Semaine prochaine</b><p className="muet petit">S46 · 9–13 nov.<br />196,0 / 264,0 h · 74 %</p></div>
            <span className="groupe"><Selecteur>Aucun surlignage</Selecteur><span className="muet petit"><Icone n="annuler" taille={12} /> Annuler</span></span>
          </div>
        </div>
        {EQUIPE.map((p, k) => (
          <motion.div className="rangee-plan" key={p.nom} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + k * 0.04, duration: 0.3 }}>
            <span className="groupe"><Initiales nom={p.nom} /> {p.nom}</span>
            <PlanSemaine h={p.h} max={p.max} puces={p.cette} />
            <PlanSemaine h={p.h2} max={p.max} puces={p.prochaine} />
          </motion.div>
        ))}
      </Carte>
    </div>
  );
}

function Ligne3({ l, v }: { l: string; v: (number | null)[] }) {
  return (
    <>
      <span className="muet">{l}</span>
      {v.map((x, k) => (
        <span key={k} className="humeur-mini">
          {x === null ? "—" : <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d={HUMEURS[x]} /></svg>}
        </span>
      ))}
    </>
  );
}

function PlanSemaine({ h, max, puces }: { h: number; max: number; puces: Puce[] }) {
  return (
    <div className="plan-semaine">
      <span className="groupe"><Barre pct={(h / max) * 100} trop={h > max} /><span className={h > max ? "corail-texte" : ""}>{h}/{max}</span></span>
      <span className="puces">
        {puces.map(([t, d, c]) => (
          <motion.span key={t} className="puce-tache" whileHover={{ y: -1 }} drag dragSnapToOrigin dragElastic={0.2}>
            <i className={`point-${c}`} /> {t} <small className="muet">{d}</small>
          </motion.span>
        ))}
      </span>
    </div>
  );
}

/* ====================================================================== */
/* Revues clients                                                          */
/* ====================================================================== */
function VueRevues() {
  const [acces, setAcces] = useState<Record<string, boolean>>({ Teranga: true, "Kër Digital": true, Jàng: false, "Café Touba": true, "Sahel Run": true, "Clinique Ndar": false });
  const [onglet, setOnglet] = useState("Tous");
  const [coches, setCoches] = useState([true, true, true, true]);
  const file = FILE.filter((f) => onglet === "Tous" || f.etat === onglet);
  return (
    <div className="grille revues">
      <Carte i={0} zone="revue" className="projet">
        <div className="ligne"><b className="surtitre">TF / TOUR 3 · FINAL</b><span className="pastille noire">Chez le client</span></div>
        <p className="muet petit">Prochaine décision client · Teranga Foods</p>
        <h2>Fichiers d'emballage finaux</h2>
        <div className="ligne">
          <button className="btn noir">Ouvrir la revue</button>
          <span className="groupe"><Initiales nom="Ndèye Mbaye" /><span><b className="petit">Ndèye Mbaye</b><small className="muet bloc">Fondatrice</small></span></span>
        </div>
        <div className="sous-carte ligne bas">
          <div><p className="muet petit">Décision attendue</p><p className="moyen">ven. 6 nov. <small className="muet">demain</small></p></div>
          <div className="droite-texte"><b className="moyen">4/4</b><p className="muet petit">points prêts</p></div>
        </div>
      </Carte>

      <Carte i={1} zone="tours" className="tours">
        <div className="ligne"><b>Tours de revue</b><span className="muet petit">6 tours</span></div>
        {TOURS.map(([l, n, c, ic]) => (
          <div className="ligne rangee-tour" key={l}>
            <span className="groupe"><i className={`rond-etat ${c}`}><Icone n={ic} taille={12} /></i>{l}</span>
            <b>{n}</b>
          </div>
        ))}
      </Carte>

      <Carte i={2} zone="ouverts" className="ouverts">
        <b>Tours ouverts</b>
        <JaugeNoire pct={60} legende="points prêts" detail="12 / 20" taille={124} />
      </Carte>

      <Carte i={3} zone="acces" className="acces-client">
        <b>Accès client</b>
        <p className="muet petit">Pages de revue en lecture seule, simulées : rien n'est publié</p>
        <div className="interrupteurs">
          {Object.entries(acces).map(([nom, actif]) => (
            <div key={nom} className="ligne">
              <span className="groupe petit"><i className={`pastille-point ${actif ? "risque" : ""}`} />{nom}</span>
              <button role="switch" aria-checked={actif} aria-label={`Accès ${nom}`} className={`interrupteur ${actif ? "on" : ""}`} onClick={() => setAcces({ ...acces, [nom]: !actif })}>
                <motion.i layout transition={{ duration: 0.25, ease: EASE }} />
              </button>
            </div>
          ))}
        </div>
      </Carte>

      <Carte i={4} zone="file" className="file">
        <div className="groupe">
          <b>File des revues</b>
          {[["Tous", 6], ["Corrections demandées", 1], ["Chez le client", 2], ["Planifiée", 2], ["Approuvée", 1]].map(([l, n]) => (
            <button key={String(l)} className={`onglet ${onglet === l ? "actif" : ""}`} onClick={() => setOnglet(String(l))}>{l} <i>{n}</i></button>
          ))}
        </div>
        {file.map((f) => (
          <motion.div layout key={f.titre} className={`rangee-revue ${f.titre === "Fichiers d'emballage finaux" ? "choisie" : ""}`}>
            <span><i className={`pastille-point ${f.etat === "Corrections demandées" ? "risque" : "noir"}`} /> <b>{f.titre}</b><small className="muet bloc">{f.client}</small></span>
            <span className="groupe"><Initiales nom={f.qui} /> {f.qui}</span>
            <span>{f.date} <small className="muet">{f.dans}</small></span>
            <span>{f.points}</span>
            <span className={`etat-revue ${f.etat === "Corrections demandées" ? "corrections" : f.etat === "Chez le client" ? "client" : "planifiee"}`}>{f.etat}</span>
          </motion.div>
        ))}
      </Carte>

      <Carte i={5} zone="detail" className="detail-revue">
        <div className="ligne"><span className="muet petit">Emballage Teranga · tour 3 · final</span><span className="pastille noire">Chez le client</span></div>
        <h2>Fichiers d'emballage finaux</h2>
        <p className="muet petit">Ndèye Mbaye, fondatrice · décision ven. 6 nov. · envoyé mar. 3 nov. · accès client activé</p>
        {POINTS_REVUE.map((t, k) => (
          <button key={t} className="case" onClick={() => setCoches(coches.map((c, j) => (j === k ? !c : c)))}>
            <motion.i className={coches[k] ? "cochee" : ""} animate={{ scale: coches[k] ? [0.8, 1] : 1 }} transition={{ duration: 0.2 }}>
              {coches[k] && <Icone n="coche" taille={12} />}
            </motion.i>
            {t}
          </button>
        ))}
        <div className="groupe">
          <button className="btn noir"><Icone n="coche" taille={14} /> Enregistrer l'approbation finale</button>
          <button className="btn texte">Corrections demandées…</button>
        </div>
        <p className="muet petit">L'approbation finale livre le projet et libère ses heures.</p>
      </Carte>
    </div>
  );
}

/* ====================================================================== */
/* Coquille                                                                */
/* ====================================================================== */
function Accueil({ vue }: { vue: Vue }) {
  const [l1, l2] = ACCUEIL[vue];
  return (
    <motion.h1 key={vue} className="accueil" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: D.titre, ease: EASE }}>
      <span className="l1">{l1}</span>
      <span className="l2"><i className="curseur" aria-hidden />{l2}</span>
    </motion.h1>
  );
}

const ICONES_VUES: Record<Vue, keyof typeof TRACES> = { apercu: "grille", projets: "dossier", capacite: "equipe", revues: "bulles" };

export default function TableauAtelier({ defilementAuto = false }: { defilementAuto?: boolean }) {
  const [vue, setVue] = useState<Vue>("apercu");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // Démo uniquement : défilement des vues au rythme de la vidéo de présentation (1,75 s).
    if (!defilementAuto) return;
    const t = setInterval(() => setVue((v) => VUES[(VUES.indexOf(v) + 1) % VUES.length]), 1750);
    return () => clearInterval(t);
  }, [defilementAuto]);

  const notifier = (texte: string) => {
    setToast(texte);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="atelier">
        <style>{CSS}</style>
        <header className="entete">
          <BoutonRond n="menu" label="Menu" />
          <span className="logo">A°</span>
          <div><b>Atelier</b><p className="muet">Espace studio</p></div>
          <span className="espace" />
          <BoutonRond n="plus" label="Créer" />
          <span className="avatar-corail">AN</span>
          <div className="petit"><b>Awa Ndiaye</b><p className="muet">Directrice de studio</p></div>
          <span className="champ-recherche"><BoutonRond n="loupe" label="Rechercher" /><span className="muet petit">Commencer une recherche…</span></span>
        </header>

        <div className="bandeau">
          <span className="jour">05</span>
          <p className="date">Jeudi,<br />novembre</p>
          <motion.button className="btn corail principal" whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
            Mes tâches <Icone n="fleche" taille={14} /><span className="badge-noir">2</span>
          </motion.button>
          <BoutonRond n="calendrier" label="Calendrier" point />
          <Accueil vue={vue} />
          <BoutonRond n="historique" label="Historique" grand badge={vue === "apercu" ? 1 : undefined} />
        </div>

        <div className="corps">
          <div className="colonne-rail">
            <nav className="rail" aria-label="Vues">
              {VUES.map((v) => (
                <button key={v} aria-pressed={vue === v} onClick={() => setVue(v)} title={LIBELLES[v]} aria-label={LIBELLES[v]}>
                  {vue === v && <motion.span layoutId="rail-actif" className="rail-actif" transition={{ duration: 0.35, ease: EASE }} />}
                  <span className="rail-icone"><Icone n={ICONES_VUES[v]} /></span>
                </button>
              ))}
            </nav>
            <BoutonRond n="partage" label="Partager" />
          </div>
          <AnimatePresence mode="wait">
            <motion.main key={vue} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
              {vue === "apercu" && <VueApercu onPlanifier={() => notifier("Maquette de présentation déplacée · 8,0 h vers Ibrahima, semaine 46")} />}
              {vue === "projets" && <VueProjets />}
              {vue === "capacite" && <VueCapacite onDeplacer={() => notifier("Maquette de présentation déplacée · Moussa → Ibrahima")} />}
              {vue === "revues" && <VueRevues />}
            </motion.main>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div className="toast" role="status"
              initial={{ opacity: 0, y: 24, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 24, x: "-50%" }}
              transition={{ duration: 0.35, ease: EASE }}>
              <span className="icone-corail"><Icone n="coche" taille={12} /></span>
              <span><b>{toast.split(" · ")[0]}</b><small className="bloc">{toast.split(" · ")[1]}</small></span>
              <button className="annuler" onClick={() => setToast(null)}><Icone n="annuler" taille={12} /> Annuler</button>
              <button className="fermer" onClick={() => setToast(null)} aria-label="Fermer"><Icone n="croix" taille={12} /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

/* ====================================================================== */
/* Données de démonstration (fictives)                                     */
/* ====================================================================== */
type Puce = [string, string, "corail" | "noir" | "gris"];
const HUMEURS = ["M5 13c1.5-3 8.5-3 10 0", "M5 12c2-1.5 8-1.5 10 0", "M5 10h10", "M5 8c2 1.5 8 1.5 10 0", "M5 7c1.5 3 8.5 3 10 0"];
const ACTIVITE = [
  "Awa a déplacé la maquette de présentation",
  "Moussa a saisi 3,5 h sur la recette, tour 1",
  "Fatou a livré les maquettes du rayon",
  "Ibrahima a partagé la charte couleurs",
];
const TOURS: [string, number, string, keyof typeof TRACES][] = [
  ["Corrections demandées", 1, "corail", "bulles"],
  ["Chez le client", 2, "noir", "horloge"],
  ["Planifiés", 2, "gris", "calendrier"],
  ["Approuvés", 1, "vert", "coche"],
];
const LIVRABLES = [
  { qui: "Aminata Ba", titre: "Jeu d'icônes", date: "lun. 2 nov.", fait: 6, prevu: 6, etat: "Livré" },
  { qui: "Fatou Sarr", titre: "Déclinaisons du logo", date: "mar. 3 nov.", fait: 12, prevu: 12, etat: "Livré" },
  { qui: "Moussa Diop", titre: "Couleurs et typographie", date: "ven. 6 nov.", fait: 8, prevu: 10, etat: "En cours" },
  { qui: "Fatou Sarr", titre: "Brouillon de la charte", date: "ven. 6 nov.", fait: 10.5, prevu: 14, etat: "En cours" },
  { qui: "Awa Ndiaye", titre: "Présentation client", date: "ven. 13 nov.", fait: 0, prevu: 8, etat: "Pas commencé" },
];
const PROJETS = [
  { nom: "Identité Teranga", client: "Teranga Foods", type: "Identité de marque", qui: "Fatou Sarr", livre: 182.5, prevu: 280, reste: 13.5, semaine: 50, echeance: "ven. 13 nov.", quoi: "Présentation client", statut: "À risque" },
  { nom: "Site Kër Digital", client: "Kër Digital", type: "Site web", qui: "Ibrahima Fall", livre: 297.5, prevu: 396, reste: 10.5, semaine: 62, echeance: "lun. 9 nov.", quoi: "Revue de recette", statut: "À risque" },
  { nom: "Application Jàng", client: "Jàng", type: "Interface produit", qui: "Moussa Diop", livre: 91, prevu: 153, reste: 2, semaine: 18, echeance: "ven. 6 nov.", quoi: "Revue des parcours", statut: "Dans les temps" },
  { nom: "Emballages Teranga", client: "Teranga Foods", type: "Packaging", qui: "Aminata Ba", livre: 131, prevu: 150, reste: 2, semaine: 16, echeance: "ven. 6 nov.", quoi: "Validation finale", statut: "Dans les temps" },
  { nom: "Campagne Sahel Run", client: "Sahel Run", type: "Campagne", qui: "Ousmane Gueye", livre: 73.5, prevu: 141, reste: 5.5, semaine: 24, echeance: "lun. 16 nov.", quoi: "Maquettes de campagne", statut: "Dans les temps" },
  { nom: "Signalétique Clinique Ndar", client: "Clinique Ndar", type: "Signalétique", qui: "Ibrahima Fall", livre: 12, prevu: 86, reste: 0, semaine: 16, echeance: "mer. 25 nov.", quoi: "Revue des concepts", statut: "Dans les temps" },
  { nom: "Temps interne", client: "Atelier", type: "Interne", qui: "Awa Ndiaye", livre: 88.5, prevu: 140, reste: 2, semaine: 18, echeance: "—", quoi: "", statut: "Interne" },
  { nom: "Lancement Café Touba", client: "Café Touba", type: "Lancement", qui: "Fatou Sarr", livre: 64, prevu: 64, reste: 0, semaine: 0, echeance: "livré le 16 oct.", quoi: "", statut: "Livré" },
];
const EQUIPE: { nom: string; h: number; h2: number; max: number; cette: Puce[]; prochaine: Puce[] }[] = [
  { nom: "Awa Ndiaye", h: 46, h2: 36, max: 40, cette: [["Présentation", "8 h", "corail"], ["Charte", "10,5/14 h", "gris"], ["Recette", "12 h", "corail"]], prochaine: [["Charte", "12 h", "gris"], ["Croquis", "8 h", "noir"]] },
  { nom: "Moussa Diop", h: 22, h2: 20, max: 40, cette: [["Prototype cliquable", "4/6 h", "gris"], ["Recette", "10 h", "noir"]], prochaine: [["Écrans", "14 h", "gris"], ["Prototype v2", "6 h", "gris"]] },
  { nom: "Fatou Sarr", h: 30, h2: 30, max: 40, cette: [["Couleurs et typo", "8/10 h", "corail"], ["Recette", "12 h", "noir"]], prochaine: [["Concepts", "12 h", "gris"], ["Déclinaisons", "8 h", "corail"]] },
  { nom: "Ibrahima Fall", h: 42, h2: 38, max: 40, cette: [["Pages produit", "18/20 h", "gris"], ["Recette, tour 1", "3,5/10 h", "noir"]], prochaine: [["Corrections", "16 h", "gris"], ["Performance", "10 h", "noir"]] },
  { nom: "Aminata Ba", h: 24, h2: 28, max: 32, cette: [["Animation, passe 1", "4,5/8 h", "gris"], ["Icônes", "8 h", "gris"]], prochaine: [["Animation, passe 2", "16 h", "gris"], ["Son", "6 h", "corail"]] },
  { nom: "Ousmane Gueye", h: 16, h2: 18, max: 32, cette: [["Scripts et accroches", "6/8 h", "gris"]], prochaine: [["Ton de voix", "6 h", "corail"], ["Légendes", "4 h", "gris"]] },
];
const FILE = [
  { titre: "Recette du site vitrine", client: "Kër Digital · tour 4", qui: "Mamadou Sy", date: "lun. 9 nov.", dans: "dans 4 jours", points: "3/6", etat: "Corrections demandées" },
  { titre: "Fichiers d'emballage finaux", client: "Teranga Foods · tour 3 · final", qui: "Ndèye Mbaye", date: "ven. 6 nov.", dans: "demain", points: "4/4", etat: "Chez le client" },
  { titre: "Parcours d'inscription", client: "Jàng · tour 1", qui: "Aïssatou Diop", date: "ven. 6 nov.", dans: "demain", points: "3/3", etat: "Chez le client" },
  { titre: "Logo et couleurs", client: "Teranga · tour 2", qui: "Cheikh Ndiaye", date: "ven. 13 nov.", dans: "dans 8 jours", points: "1/4", etat: "Planifiée" },
  { titre: "Concepts de signalétique", client: "Clinique Ndar · tour 1", qui: "Mariama Sow", date: "mer. 25 nov.", dans: "dans 20 jours", points: "1/3", etat: "Planifiée" },
];
const POINTS_REVUE = [
  "Panneau de date déplacé au dos",
  "Vernis mat sur l'étiquette uniquement",
  "Taille du code-barres vérifiée avec l'imprimeur",
  "Carte d'origine redessinée en une couleur",
];

/* ====================================================================== */
/* Styles (tokens détaillés dans style.md)                                 */
/* ====================================================================== */
const CSS = `
.atelier{--fond:#F3F2F0;--carte:#F8F7F5;--blanc:#FFFFFF;--encre:#141414;--muet:#9B9893;--trait:#ECEAE6;
--accent:#E2553F;--accent-doux:#F8DED7;--accent-pale:#FBEDE8;--sombre:#121212;--anthracite:#2E2C2A;--r:24px;--r-sous:18px;
--ombre:0 1px 2px rgba(20,20,20,.04),0 10px 30px rgba(20,20,20,.05);
font-family:"Geist","Inter Tight",system-ui,sans-serif;color:var(--encre);background:var(--fond);
padding:20px 22px;border-radius:32px;font-size:12px;position:relative;min-height:760px;overflow:hidden}
.atelier *{box-sizing:border-box}.atelier p,.atelier h1,.atelier h2,.atelier dl{margin:0}
.atelier button{font:inherit;color:inherit}
.muet{color:var(--muet)}.petit{font-size:11px}.bloc{display:block}.droite-texte{text-align:right}
.ligne{display:flex;align-items:center;justify-content:space-between;gap:10px}.ligne.bas{align-items:flex-end}
.groupe{display:inline-flex;align-items:center;gap:8px}
.entete{display:flex;align-items:center;gap:12px;margin-bottom:16px}.espace{flex:1}
.logo{width:42px;height:42px;border-radius:50%;background:var(--sombre);color:#fff;display:grid;place-items:center;font-weight:600;font-size:15px}
.rond{position:relative;width:36px;height:36px;border-radius:50%;border:0;background:var(--blanc);box-shadow:var(--ombre);display:grid;place-items:center;cursor:pointer;flex:none}
.rond.grand{width:72px;height:72px}
.badge-noir{position:absolute;top:-4px;right:-4px;background:var(--sombre);color:#fff;border-radius:999px;font-size:9px;min-width:16px;height:16px;display:grid;place-items:center;padding:0 4px}
.rond.grand .badge-noir{background:var(--accent);top:4px;right:4px}
.point-rouge{position:absolute;top:7px;right:8px;width:5px;height:5px;border-radius:50%;background:var(--accent)}
.avatar-corail{width:36px;height:36px;border-radius:50%;background:var(--accent-doux);color:#8A3426;display:grid;place-items:center;font-size:12px}
.champ-recherche{display:flex;align-items:center;gap:10px;width:230px}
.bandeau{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.jour{width:72px;height:72px;border-radius:50%;background:var(--blanc);box-shadow:var(--ombre);display:grid;place-items:center;font-size:22px;flex:none}
.date{padding-right:14px;border-right:1px solid var(--trait);line-height:1.3}
.btn{border:0;border-radius:999px;padding:9px 16px;font-weight:500;cursor:pointer;position:relative;display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
.btn.principal{padding:13px 22px}
.btn.corail{background:var(--accent);color:#fff;box-shadow:0 6px 16px rgba(226,85,63,.3)}
.btn.corail.plein{box-shadow:none}
.btn.noir{background:var(--sombre);color:#fff}
.btn.texte{background:none;padding:9px 8px}
.atelier .accueil{margin:0 auto 0 9%;font-size:30px;font-weight:500;line-height:1.12;letter-spacing:-.025em;display:flex;flex-direction:column;min-width:400px}
.accueil .l2{color:#B9B6B0}
.curseur{display:inline-block;width:2px;height:.9em;background:var(--encre);margin-right:2px;vertical-align:-2px;animation:clign 1s steps(1) infinite}
@keyframes clign{50%{opacity:0}}
.corps{display:grid;grid-template-columns:48px 1fr;gap:12px}
.colonne-rail{display:flex;flex-direction:column;align-items:center;gap:10px}
.rail{display:flex;flex-direction:column;gap:6px;background:var(--blanc);border-radius:999px;padding:6px;box-shadow:var(--ombre)}
.rail button{position:relative;width:34px;height:34px;border:0;background:none;border-radius:50%;cursor:pointer;color:var(--muet);display:grid;place-items:center}
.rail button[aria-pressed=true]{color:#fff}
.rail-actif{position:absolute;inset:0;background:var(--sombre);border-radius:50%}
.rail-icone{position:relative;display:grid}
.grille{display:grid;gap:12px}
.carte{background:var(--carte);border-radius:var(--r);padding:14px;box-shadow:var(--ombre);display:flex;flex-direction:column;gap:8px;min-width:0}
.sous-carte{background:var(--fond);border-radius:var(--r-sous);padding:12px;display:flex;flex-direction:column;gap:4px}
.sous-carte.ligne{flex-direction:row}
.sous-carte.blanche{background:var(--blanc);box-shadow:0 1px 2px rgba(0,0,0,.03)}
.surtitre{font-style:italic;letter-spacing:.02em;font-size:11px}
.selecteur{display:inline-flex;align-items:center;gap:4px;background:var(--blanc);border-radius:999px;padding:4px 10px;font-size:11px;box-shadow:0 1px 2px rgba(0,0,0,.04);white-space:nowrap}
.point-corail{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--accent)}
.atelier h2{font-size:17px;font-weight:500;display:flex;gap:8px;align-items:center;letter-spacing:-.01em}
.pastille{font-size:10px;border-radius:999px;padding:3px 9px;background:var(--trait);display:inline-flex;align-items:center;gap:4px;white-space:nowrap;font-weight:500}
.pastille.risque{color:var(--accent);background:var(--accent-pale)}
.pastille.noire{background:var(--sombre);color:#fff}
.avatars{display:inline-flex;padding-left:6px}
.avatars i,.initiales{font-style:normal;width:22px;height:22px;border-radius:50%;background:var(--accent-doux);color:#8A3426;display:inline-grid;place-items:center;font-size:8px;border:2px solid var(--carte);flex:none}
.avatars i{margin-left:-6px}.avatars i.plus{background:var(--blanc);color:var(--encre)}
.groupe .avatars{background:var(--blanc);border-radius:999px;padding:2px 4px 2px 8px}
.grand{font-size:22px;font-weight:500;letter-spacing:-.02em}.moyen{font-size:16px;font-weight:500;letter-spacing:-.01em}
.grand small,.moyen small{font-size:11px;color:var(--muet);font-weight:400}
.unite{color:var(--accent)}
.action-corail{display:inline-flex;align-items:center;gap:8px;color:var(--accent);font-size:11px;line-height:1.2}
.icone-corail{width:26px;height:26px;border-radius:50%;background:var(--accent-pale);color:var(--accent);display:grid;place-items:center;flex:none;border:1px solid var(--accent-doux)}
.icone-corail.mini{width:18px;height:18px;margin-right:6px}
.badge-contour{border:1px solid var(--trait);background:var(--blanc);border-radius:999px;padding:3px 10px;font-size:11px;color:var(--accent)}
.jauge-noire{position:relative;flex:none}
.jauge-noire svg{width:100%;height:100%;transform:rotate(-90deg)}
.jauge-noire .disque{fill:var(--sombre);stroke:var(--blanc);stroke-width:3}
.jauge-noire .piste{fill:none;stroke:var(--anthracite);stroke-width:9}
.jauge-noire .arc{fill:none;stroke:var(--accent);stroke-width:9;stroke-linecap:round}
.jauge-texte{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:8px;color:#BDB9B3;line-height:1.3}
.jauge-texte strong{font-size:20px;color:#fff;font-weight:500}
.apercu{grid-template-columns:1.25fr 1.2fr .5fr .62fr .62fr;grid-template-areas:"projet heures acces echeance semaines" "projet heures jauge momentum momentum" "livres activite activite pouls pouls"}
.acces{align-items:center;justify-content:center;text-align:center;border-radius:50%;width:104px;height:104px;padding:8px;gap:2px;justify-self:center;align-self:center}
.cellule-jauge{display:grid;place-items:center}
.points{display:grid;grid-template-columns:repeat(10,9px);gap:4px}
.points i{width:9px;height:9px;border-radius:50%;background:var(--trait)}.points i.plein{background:var(--accent)}
.points i.aujourdhui{background:var(--blanc);border:1.5px solid var(--encre)}
.semaines{padding:10px}
.colonnes-semaines{position:relative;flex:1;min-height:70px;background:repeating-linear-gradient(90deg,transparent 0 14px,var(--trait) 14px 15px)}
.sem{position:absolute;top:10px;font-size:9px;background:var(--blanc);border-radius:999px;padding:2px 6px}
.sem:first-child{left:6px}.sem.active{right:4px;background:var(--accent);color:#fff}
.trait-s45{position:absolute;right:22px;top:24px;bottom:0;width:2px;background:var(--accent)}
.courbe{width:100%;height:56px}.courbe path{fill:none;stroke:var(--accent);stroke-width:1.4}
.anneaux{position:relative;height:210px;display:flex;justify-content:center}
.anneau{position:absolute;bottom:0;border-radius:50%;display:flex;justify-content:center}
.anneau span{display:flex;flex-direction:column;align-items:center;margin-top:12px;font-size:9px;color:var(--muet)}
.anneau b{font-size:14px;color:var(--encre);font-weight:500}
.anneau.a0{background:radial-gradient(circle at 50% 70%,#FBE3DC,#FBEDE8 70%)}
.anneau.a1{background:#F7D3C8}.anneau.a2{background:#F2B5A5}
.anneau.a3{background:var(--accent)}.anneau.a3 b,.anneau.a3 small{color:#fff}
.activite .rond{width:28px;height:28px}
.filtres{display:inline-flex;align-items:center;gap:6px;background:var(--blanc);border-radius:999px;padding:5px 10px;box-shadow:var(--ombre)}
.compte-noir{font-style:normal;background:var(--sombre);color:#fff;border-radius:999px;font-size:9px;width:16px;height:16px;display:grid;place-items:center}
.recherche-ligne{display:inline-flex;align-items:center;gap:8px;color:var(--muet);font-size:11px}
.puce{display:inline-flex;align-items:center;gap:6px;background:var(--blanc);border-radius:999px;padding:4px 10px;font-size:11px}
.trois{display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:8px}
.baton{display:flex;align-items:flex-end;gap:5px;height:56px;margin-top:6px}
.baton i{display:block;width:3px;border-radius:2px;background:var(--accent)}.baton i.pale{background:var(--accent-doux)}
.fil{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;font-size:10px}
.fil li{display:flex;align-items:flex-start}
.alerte{align-items:center;text-align:center;gap:6px}
.soleil{color:var(--accent)}
.pouls{gap:10px}
.indicateur-pages{display:inline-flex;gap:4px}.indicateur-pages i{width:6px;height:4px;border-radius:999px;background:var(--trait)}.indicateur-pages i.actif{width:18px;background:var(--sombre)}
.pouls .rond{width:26px;height:26px}
.humeurs{display:flex;justify-content:space-between;margin-top:auto}
.humeurs button{width:34px;height:34px;border-radius:50%;border:0;background:var(--blanc);display:grid;place-items:center;cursor:pointer;box-shadow:var(--ombre)}
.humeurs button[aria-pressed=true]{background:var(--sombre);color:#fff}
.projets{grid-template-columns:1.1fr 1.6fr .9fr;grid-template-areas:"projet livrables budget" "tableau tableau tableau"}
.rangee-livrable{display:grid;grid-template-columns:22px 1.3fr .9fr 1fr 60px 80px 14px;align-items:center;gap:8px;font-size:11px;padding:4px 0}
.barre{display:block;height:4px;background:var(--trait);border-radius:999px;overflow:hidden;flex:1;min-width:40px}
.barre i{display:block;height:100%;background:var(--sombre);border-radius:999px}.barre i.trop{background:var(--accent)}
.etat-texte{font-size:10px;color:var(--muet)}.etat-texte.corail{color:var(--accent)}
.sphere{width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#F59A82,var(--accent) 55%,#C8432F)}
.budget-chiffres{display:grid;font-size:10px;color:var(--muet);text-align:right}
.budget-chiffres dd{margin:0 0 4px;font-size:14px;color:var(--encre);font-weight:500}
.onglet{border:0;background:none;border-radius:999px;padding:4px 10px;cursor:pointer;font-size:11px;display:inline-flex;gap:5px;align-items:center;white-space:nowrap}
.onglet i{font-style:normal;color:var(--muet);font-size:10px}
.onglet.actif{background:var(--sombre);color:#fff}.onglet.actif i{background:#fff;color:var(--encre);border-radius:999px;padding:0 5px}
.entete-table,.rangee-projet{display:grid;grid-template-columns:2.2fr 1fr 1.3fr 1.3fr 1.5fr .9fr .4fr;gap:10px;align-items:center;font-size:11px}
.entete-table{color:var(--muet);font-size:10px;padding:4px 0;border-bottom:1px solid var(--trait)}
.rangee-projet{padding:6px 0;border-bottom:1px solid var(--trait)}
.pastille-point{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--muet)}.pastille-point.risque{background:var(--accent)}.pastille-point.noir{background:var(--sombre)}
.statut{font-size:10px;color:var(--muet)}.statut.risque{color:var(--accent)}
.capacite{grid-template-columns:1.25fr 1fr 1fr .95fr;grid-template-areas:"cap sem sugg pls" "plan plan plan plan"}
.legende-cap{display:grid;grid-template-columns:auto auto;gap:6px 14px;font-size:11px;align-items:center}
.legende-cap dd{margin:0;text-align:right}
.carre{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:6px}.carre.corail{background:var(--accent)}.carre.corail-pale{background:var(--accent-doux)}.carre.vide{border:1px solid var(--trait)}
.tableau-pouls{display:grid;grid-template-columns:1.2fr repeat(3,1fr);gap:8px;font-size:10px;align-items:center;text-align:center}
.tableau-pouls>span:nth-child(4n+1){text-align:left}
.humeur-mini{display:grid;place-items:center}
.lien-noir{margin-top:auto}
.entete-plan{display:grid;grid-template-columns:150px 1fr 1fr;gap:12px;padding-bottom:6px}
.rangee-plan{display:grid;grid-template-columns:150px 1fr 1fr;gap:12px;align-items:center;font-size:11px;padding:4px 0;border-top:1px solid var(--trait)}
.plan-semaine{display:grid;grid-template-columns:110px 1fr;gap:8px;align-items:center}
.puces{display:flex;gap:6px;overflow:hidden}
.puce-tache{display:inline-flex;align-items:center;gap:5px;background:var(--blanc);border-radius:999px;padding:3px 8px;font-size:10px;white-space:nowrap;cursor:grab;border-left:2px solid var(--trait)}
.point-noir,.point-gris{display:inline-block;width:5px;height:5px;border-radius:50%}
.point-noir{background:var(--sombre)}.point-gris{background:var(--muet)}
.corail-texte{color:var(--accent)}
.revues{grid-template-columns:1.2fr 1fr .9fr 1.35fr;grid-template-areas:"revue tours ouverts acces" "file file detail detail"}
.rangee-tour{padding:4px 0}
.file>.groupe{flex-wrap:wrap}.file>.groupe>b,.tableau-projets b{white-space:nowrap}
.rond-etat{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-style:normal}
.rond-etat.corail{background:var(--accent-pale);color:var(--accent);border:1px solid var(--accent-doux)}.rond-etat.noir{background:var(--sombre);color:#fff}
.rond-etat.gris{background:#C9C6C1;color:#fff}.rond-etat.vert{background:#7C9A88;color:#fff}
.ouverts{align-items:center}
.interrupteurs{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}
.interrupteur{width:30px;height:18px;border-radius:999px;border:0;background:#E1DED9;padding:2px;display:flex;cursor:pointer}
.interrupteur.on{background:var(--sombre);justify-content:flex-end}
.interrupteur i{width:14px;height:14px;border-radius:50%;background:#fff;display:block}
.rangee-revue{display:grid;grid-template-columns:1.8fr 1.1fr 1.2fr .4fr 1.1fr;gap:10px;align-items:center;font-size:11px;padding:6px 8px;border-radius:12px}
.rangee-revue.choisie{background:var(--blanc);box-shadow:var(--ombre)}
.etat-revue{justify-self:end;font-size:10px;border-radius:999px;padding:3px 9px}
.etat-revue.corrections{color:var(--accent);background:var(--accent-pale)}.etat-revue.client{background:var(--sombre);color:#fff}.etat-revue.planifiee{background:var(--trait)}
.case{display:flex;align-items:center;gap:10px;background:var(--blanc);border:0;border-radius:10px;padding:8px 10px;font-size:11px;cursor:pointer;text-align:left}
.case i{width:18px;height:18px;border-radius:5px;border:1.5px solid var(--sombre);display:grid;place-items:center;flex:none}
.case i.cochee{background:var(--sombre);color:#fff}
.toast{position:absolute;left:50%;bottom:18px;background:var(--sombre);color:#fff;border-radius:16px;padding:10px 12px;display:flex;gap:12px;align-items:center;box-shadow:0 12px 30px rgba(0,0,0,.25);font-size:11px}
.toast small{color:#A9A6A1}
.toast .icone-corail{background:var(--accent);color:#fff;border:0}
.toast .annuler{background:#2A2A2A;border:0;border-radius:999px;padding:5px 10px;cursor:pointer;display:inline-flex;gap:5px;align-items:center}
.toast .fermer{background:none;border:0;cursor:pointer;opacity:.7}
@media (prefers-reduced-motion:reduce){.atelier *{animation:none!important}}
`;
