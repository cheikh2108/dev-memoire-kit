/**
 * Modèle 02 — Tableau de bord de support « Relais »
 * Reconstruction originale (nom, données et code réécrits) d'après une démo publique
 * de tableau de bord de service client. Relevé élément par élément : voir README.md.
 *
 * Quatre vues : Vue du service · Boîte de réception · Fiche client · Performance de l'équipe.
 * Dépendances : react 18+, motion 11+ (`npm i motion`).
 */
import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";

/* ====================================================================== */
/* Mouvement (voir animations.md)                                          */
/* ====================================================================== */
const EASE = [0.22, 1, 0.36, 1] as const;
const EASE_REVELATION = [0.45, 0, 0.2, 1] as const; // relevée dans le code de la vidéo
const D = { carte: 0.45, revelation: 0.95, barre: 0.4 };

type Onglet = "service" | "boite" | "client" | "equipe";
const ONGLETS: { id: Onglet; libelle: string; compte?: number }[] = [
  { id: "service", libelle: "Vue du service" },
  { id: "boite", libelle: "Boîte de réception", compte: 3 },
  { id: "client", libelle: "Fiche client" },
  { id: "equipe", libelle: "Performance de l'équipe" },
];

/* ====================================================================== */
/* Icônes                                                                  */
/* ====================================================================== */
const TRACES = {
  grille: "M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z",
  boite: "M3 11l2-6h10l2 6v5H3zM3 11h4l1 2h4l1-2h4",
  personne: "M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 17c.7-3.4 3-5 6-5s5.3 1.6 6 5",
  equipe: "M7 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2.5 16c.5-3 2.3-4.5 4.5-4.5s4 1.5 4.5 4.5M13 9a2 2 0 1 0 0-4M14 11.5c2 .3 3 1.8 3.5 4",
  loupe: "M9 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM17 17l-3.5-3.5",
  cloche: "M5 14V9a5 5 0 0 1 10 0v5l1.5 1.5h-13zM8.5 17.5h3",
  fleche: "M4 10h12M11 5l5 5-5 5",
  haut: "M10 16V4M5 9l5-5 5 5",
  plus: "M10 4v12M4 10h12",
  courriel: "M3 5h14v10H3zM3 5l7 6 7-6",
  bulle: "M4 4h12v9H8l-4 3z",
  telephone: "M5 3h3l1.5 4-2 1.5a9 9 0 0 0 4 4l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.5 1.5C9 16.5 3.5 11 3.5 4.5A1.5 1.5 0 0 1 5 3Z",
  bas: "M6 8l4 4 4-4",
  croix: "M5 5l10 10M15 5L5 15",
  coche: "M5 10l3.5 3.5L15 7",
  annuler: "M7 7H4V4M4.5 7A6 6 0 1 1 6 14.5",
  cadenas: "M5 9h10v8H5zM7 9V6a3 3 0 0 1 6 0v3",
};
type NomIcone = keyof typeof TRACES;
function Icone({ n, taille = 16 }: { n: NomIcone; taille?: number }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={TRACES[n]} />
    </svg>
  );
}
const ICONE_CANAL: Record<Canal, NomIcone> = { "E-mail": "courriel", Chat: "bulle", Téléphone: "telephone" };

/* ====================================================================== */
/* Primitives                                                              */
/* ====================================================================== */
function Carte({ i, className = "", children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <motion.section className={`carte ${className}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: D.carte, ease: EASE, delay: 0.1 + i * 0.05 }}>
      {children}
    </motion.section>
  );
}

/** Indicateur géant : valeur 46 px, unité en exposant gris, deux lignes de légende. */
function Indicateur({ valeur, exposant, libelle, detail, hausse }: { valeur: string; exposant: string; libelle: string; detail: string; hausse?: boolean }) {
  return (
    <div className="indicateur">
      <p className="valeur">{valeur}<sup>{exposant}</sup></p>
      <p className="muet">{libelle}</p>
      {detail && <p className="muet">{hausse && "▲ "}{detail}</p>}
    </div>
  );
}

function Surligne({ children }: { children: ReactNode }) {
  return <span className="surligne">{children}</span>;
}

function Initiales({ nom }: { nom: string }) {
  return <i className="initiales">{nom.split(" ").map((m) => m[0]).join("").slice(0, 2)}</i>;
}

function Delai({ min, texte }: { min?: number; texte?: string }) {
  if (min === undefined) return <span className="delai-texte">{texte}</span>;
  return <span className={`delai ${min <= 20 ? "urgent" : min <= 30 ? "couvert" : ""}`}>{min} min restantes</span>;
}

function Segments({ valeurs, actif }: { valeurs: string[]; actif: string }) {
  return <div className="segments">{valeurs.map((p) => <span key={p} className={p === actif ? "actif" : ""}>{p}</span>)}</div>;
}

/** Barres en pointillés qui montent en cascade. */
function BarresPoints({ n = 22, max = 1 }: { n?: number; max?: number }) {
  return (
    <div className="barres-points" aria-hidden>
      {Array.from({ length: n }, (_, k) => (
        <motion.i key={k} style={{ height: `${(0.25 + 0.75 * (k / (n - 1))) * max * 100}%`, originY: 1 }}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: D.barre, ease: EASE, delay: 0.3 + k * 0.02 }} />
      ))}
    </div>
  );
}

/** Histogramme de petites barres grises, une seule en jaune. */
function Histogramme({ valeurs, surligne, hauteur = 60 }: { valeurs: number[]; surligne: number; hauteur?: number }) {
  const max = Math.max(...valeurs);
  return (
    <div className="histogramme" style={{ height: hauteur }} aria-hidden>
      {valeurs.map((v, k) => (
        <motion.i key={k} className={k === surligne ? "jaune" : ""} style={{ height: `${(v / max) * 100}%`, originY: 1 }}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: D.barre, ease: EASE, delay: 0.25 + k * 0.02 }} />
      ))}
    </div>
  );
}

/* ====================================================================== */
/* Grand graphique (révélation par découpe)                                */
/* ====================================================================== */
const W = 1000;
const H = 150;
function cheminLisse(points: number[]): string {
  const pas = W / (points.length - 1);
  const y = (v: number) => H - (v / 12) * H;
  let d = `M0 ${y(points[0])}`;
  for (let i = 1; i < points.length; i++) {
    const xm = (i - 0.5) * pas;
    d += ` C${xm} ${y(points[i - 1])} ${xm} ${y(points[i])} ${i * pas} ${y(points[i])}`;
  }
  return d;
}

function GrandGraphique() {
  const [survol, setSurvol] = useState(8);
  const [serie, setSerie] = useState("Médiane");
  const points = serie === "P25" ? DELAIS.map((v) => v * 0.6) : serie === "P75" ? DELAIS.map((v) => v * 1.3) : DELAIS;
  const chemin = useMemo(() => cheminLisse(points), [serie]);
  const pas = W / (DELAIS.length - 1);
  return (
    <>
      <div className="ligne fin">
        <span className="groupe muet">Délai de réponse
          {["P25", "Médiane", "P75"].map((s) => (
            <button key={s} className={`bascule ${serie === s ? "actif" : ""}`} onClick={() => setSerie(s)}>{s}</button>
          ))}
        </span>
      </div>
      <div className="graphique" onMouseLeave={() => setSurvol(8)}>
        <span className="graduation haut">10 min</span><span className="graduation milieu">5</span>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            <pattern id="hachures" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="1.2" height="6" fill="var(--trait)" /></pattern>
            <pattern id="hachures-jaunes" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="1.2" height="6" fill="var(--accent)" /></pattern>
            <clipPath id="balayage">
              <motion.rect x={0} y={0} height={H} width={W} style={{ originX: 0 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: D.revelation, ease: EASE_REVELATION, delay: 0.12 }} />
            </clipPath>
          </defs>
          <rect width={W} height={H} fill="url(#hachures)" opacity={0.7} />
          <motion.rect y={0} height={H} width={pas * 0.9} fill="url(#hachures-jaunes)" opacity={0.35}
            initial={false} animate={{ x: survol * pas - pas * 0.9 }} transition={{ duration: 0.2, ease: EASE }} />
          <g clipPath="url(#balayage)">
            <motion.path d={chemin} className="courbe" vectorEffect="non-scaling-stroke" animate={{ d: chemin }} transition={{ duration: 0.5, ease: EASE }} />
          </g>
          <motion.line y1={0} y2={H} className="repere" vectorEffect="non-scaling-stroke" initial={false}
            animate={{ x1: survol * pas, x2: survol * pas }} transition={{ duration: 0.2, ease: EASE }} />
          {DELAIS.map((_, i) => (
            <rect key={i} x={i * pas - pas / 2} y={0} width={pas} height={H} fill="transparent" onMouseEnter={() => setSurvol(i)} />
          ))}
        </svg>
        <motion.div className="bulle" initial={{ opacity: 0 }}
          animate={{ opacity: 1, left: `calc(${(survol / (DELAIS.length - 1)) * 100}% + 12px)` }}
          transition={{ duration: 0.2, ease: EASE, opacity: { delay: 1 } }}>
          <p className="muet petit">Aujourd'hui, {HEURES[survol]}</p>
          <p><b>{points[survol].toLocaleString("fr-FR", { maximumFractionDigits: 1 })} min</b> <span className="muet">première réponse ({serie.toLowerCase()})</span></p>
        </motion.div>
        <div className="axe">{HEURES.filter((_, i) => i % 2 === 0).map((h) => <span key={h} className={h === "10:00" ? "fort" : ""}>{h}</span>)}</div>
      </div>
    </>
  );
}

/* ====================================================================== */
/* Vue du service                                                          */
/* ====================================================================== */
function VueService() {
  const [score, setScore] = useState(1);
  return (
    <>
      <header className="titre-vue ligne">
        <div><h1>Performance du service</h1><p className="muet">Chaque conversation, jusqu'au bout.</p></div>
        <Segments valeurs={["1H", "1J", "1S", "1M", "1A"]} actif="1J" />
      </header>
      <div className="ligne haut">
        <div className="indicateurs">
          <Indicateur valeur="4,8" exposant="min" libelle="Première réponse · médiane" detail="12,7 % plus rapide qu'hier" hausse />
          <Indicateur valeur="96,2" exposant="%" libelle="Respect du SLA · 75 sur 78 dus" detail="2,4 pts vs hier" hausse />
          <Indicateur valeur="4,9" exposant="/5" libelle="Satisfaction · 9 notes" detail="0,3 vs hier" hausse />
          <motion.div className="pastille-gain" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.35, ease: EASE }}>
            <span className="groupe"><i className="rond-haut"><Icone n="haut" taille={12} /></i><Surligne>+2,7 pts</Surligne></span>
            <p className="muet petit">Taux de résolution · aujourd'hui</p>
            <p className="muet petit">70,2 % · 59 sur 84 résolues</p>
          </motion.div>
        </div>
        <span className="groupe muet petit">Mis à jour : <span className="puce-heure">16:45 · 18/11/26</span></span>
      </div>

      <GrandGraphique />

      <div className="grille-4">
        <Carte i={0}>
          <div className="ligne"><b>Conversations</b><Icone n="fleche" /></div>
          <p className="muet petit">Attribuées ce mois-ci</p>
          <div className="ligne bas">
            <div><p className="valeur">1 280</p><p className="muet petit">Demandes clients</p></div>
            <div className="colonne-barres"><span className="etiquette-jaune">Aujourd'hui +84</span><BarresPoints /></div>
          </div>
          <p className="petit"><Surligne>98 % résolues</Surligne> <span className="muet">1 255 sur 1 280</span></p>
        </Carte>
        <Carte i={1}>
          <div className="ligne"><b>En cours</b><Icone n="fleche" /></div>
          <p className="muet petit">Actives maintenant</p>
          <div className="ligne bas">
            <div><p className="valeur">25</p><p className="muet petit">Conversations ouvertes</p></div>
            <div className="colonne-barres"><span className="etiquette-jaune">3 nouvelles</span><BarresPoints n={16} max={0.8} /></div>
          </div>
          <p className="petit"><Surligne>● 3 à risque</Surligne> <span className="muet">▲ 2 agents disponibles</span></p>
        </Carte>
        <Carte i={2} className="score">
          <div className="ligne"><b>Score de l'équipe</b><span className="muet petit groupe">Ce mois <Icone n="bas" taille={12} /></span></div>
          <p className="muet petit">Selon la qualité du service</p>
          <div className="carrousel">
            {SCORES.map((s, k) => (
              <motion.button key={s.mois} onClick={() => setScore(k)}
                animate={{ scale: k === score ? 1 : 0.62, opacity: k === score ? 1 : 0.35 }} transition={{ duration: 0.35, ease: EASE }}>
                {k === score && <motion.i layoutId="repere-score" className="triangle" />}
                <span>{s.valeur}</span><small>{s.mois}</small>
              </motion.button>
            ))}
          </div>
          <p className="muet petit centre">2e meilleur score de vos 12 derniers mois</p>
          <div className="graduations-jaunes">{Array.from({ length: 18 }, (_, k) => <i key={k} style={{ height: 8 + ((k * 7) % 9) }} />)}</div>
        </Carte>
        <Carte i={3} className="notes">
          <div className="ligne"><b>Notes de l'équipe</b><button className="rond petit-rond" aria-label="Ajouter une note"><Icone n="plus" taille={14} /></button></div>
          <p className="muet petit">Mis à jour le 18/11/26 à 16:21</p>
          {NOTES.map((n) => (
            <div key={n.qui} className="note">
              <p className="ligne"><span className="groupe"><Initiales nom={n.qui} /><b>{n.qui}</b></span><span className="muet petit">{n.heure}</span></p>
              <p className="muet">{n.texte}</p>
            </div>
          ))}
        </Carte>
      </div>
    </>
  );
}

/* ====================================================================== */
/* Boîte de réception                                                      */
/* ====================================================================== */
function VueBoite({ onAttribuer }: { onAttribuer: (qui: string, sujet: string) => void }) {
  const [choisie, setChoisie] = useState(3);
  const [filtre, setFiltre] = useState("En cours");
  const [tri, setTri] = useState("Attention");
  const [volet, setVolet] = useState("Brouillon de réponse");
  const lignes = CONVERSATIONS.filter((c) => (filtre === "À risque" ? c.min !== undefined && c.min <= 20 : filtre === "Non attribuées" ? !c.agent : true));
  const c = CONVERSATIONS[choisie];
  return (
    <>
      <header className="titre-vue ligne">
        <div><h1>Boîte de réception</h1><p className="muet">25 conversations en cours · 2 à risque · 1 agent disponible</p></div>
        <div className="segments">{["Attention", "Échéance", "Plus récentes"].map((t) => <button key={t} className={tri === t ? "actif" : ""} onClick={() => setTri(t)}>{t}</button>)}</div>
      </header>
      <div className="boite">
        <Carte i={0} className="liste">
          <div className="ligne">
            <div className="onglets-liste">
              {[["En cours", 25], ["À risque", 2], ["Non attribuées", 2], ["Ce mois", "1 280"]].map(([l, n]) => (
                <button key={l} className={filtre === l ? "actif" : ""} onClick={() => setFiltre(String(l))}>{l} <i className={l === "À risque" ? "jaune" : ""}>{n}</i></button>
              ))}
            </div>
            <span className="champ"><Icone n="loupe" taille={14} /> Filtrer par sujet, client, n° C…</span>
          </div>
          <div className="entete-table boite-cols"><span /><span>Conversation</span><span>Client</span><span>Canal</span><span>Responsable</span><span>Première réponse</span></div>
          {lignes.map((x, k) => (
            <motion.button key={x.ref} className={`rangee boite-cols ${CONVERSATIONS.indexOf(x) === choisie ? "choisie" : ""}`} onClick={() => setChoisie(CONVERSATIONS.indexOf(x))}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + k * 0.04, duration: 0.3, ease: EASE }}>
              <span className={`point ${x.min !== undefined && x.min <= 20 ? "chaud" : x.min !== undefined && x.min <= 35 ? "tiede" : ""}`} />
              <span><b>{x.sujet}</b><small className="muet bloc">{x.ref} · {x.priorite} · {x.quand}</small></span>
              <span className="groupe"><Initiales nom={x.contact} /><span><span className="bloc">{x.contact}</span><small className="muet">{x.client}</small></span></span>
              <span className="groupe muet"><Icone n={ICONE_CANAL[x.canal]} taille={14} />{x.canal}</span>
              <span className="groupe">{x.agent ? <><Initiales nom={x.agent} />{x.agent.split(" ")[0]}{x.absent && <small className="muet"> · absent</small>}</> : <span className="muet">Non attribuée</span>}</span>
              <Delai min={x.min} texte="SLA respecté" />
            </motion.button>
          ))}
          <div className="ligne pied muet petit"><span>25 conversations</span><span>Données de démonstration, simulées localement · Relais n'envoie aucun message</span></div>
        </Carte>
        <AnimatePresence mode="wait">
          <motion.section key={c.ref} className="carte detail" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.3, ease: EASE }}>
            <p className="muet petit groupe"><Icone n={ICONE_CANAL[c.canal]} taille={12} /> {c.ref} · {c.canal} · priorité {c.priorite.toLowerCase()} · {c.quand}</p>
            <h2>{c.sujet}</h2>
            <div className="ligne"><span className="groupe"><Initiales nom={c.contact} /><span><b className="bloc">{c.contact}</b><small className="muet">{c.client} · Croissance</small></span></span><span className="muet petit">Fiche client</span></div>
            {c.min !== undefined && (
              <div className="compte-rebours">
                <motion.i className="anneau-attente" animate={{ rotate: 360 }} transition={{ duration: 1.6, ease: "linear", repeat: Infinity }} />
                <div><p className="valeur moyen">{c.min} min restantes</p><p className="muet petit">Première réponse due à 16:47 · objectif 30 min</p></div>
                <span className="couvert-pastille">{c.agent ? `Couvert · ${c.agent.split(" ")[0]} est en ligne` : "Personne n'est en ligne"}</span>
              </div>
            )}
            <div className="ligne responsable">
              {c.agent ? (
                <><span className="groupe"><Initiales nom={c.agent} /><span><b className="bloc">{c.agent}</b><small className="muet">Accès au compte · 6 sur 6 ouvertes</small></span></span><span className="selecteur">Réattribuer <Icone n="bas" taille={12} /></span></>
              ) : (
                <><span className="groupe"><i className="initiales vide">?</i><span><b className="bloc">Non attribuée</b><small className="muet">En attente dans la file · Accès au compte</small></span></span><button className="btn sombre" onClick={() => onAttribuer("Khady Diallo", c.sujet)}>Attribuer <Icone n="bas" taille={12} /></button></>
              )}
            </div>
            <div className="ligne"><b className="petit muet">Contexte client</b><span className="muet petit">Dakar</span></div>
            <div className="tuiles">
              {[["Offre", "Croissance · 14"], ["12 mois", "76 conv."], ["Satisfaction", "4,8/5"], ["SLA respecté", "68 sur 75"], ["Ouvertes", "1"], ["Client depuis", "mars 2024"]].map(([l, v]) => (
                <div key={l} className="tuile"><span className="muet petit">{l}</span><b>{v}</b></div>
              ))}
            </div>
            <div className="ligne">
              <div className="segments">{["Brouillon de réponse", "Note interne"].map((t) => <button key={t} className={volet === t ? "actif" : ""} onClick={() => setVolet(t)}>{t}</button>)}</div>
              <span className="muet petit groupe"><Icone n="cadenas" taille={12} /> Jamais envoyé</span>
            </div>
            <textarea className="zone" placeholder={volet === "Note interne" ? "Note visible par l'équipe seulement…" : `Rédiger une réponse à ${c.contact.split(" ")[0]} : enregistrée sur cet appareil, jamais envoyée`} />
            <div className="ligne"><span className="muet petit">Relais n'envoie aucun message : copie-le dans ton outil de support</span><button className="btn sombre">Enregistrer le brouillon</button></div>
          </motion.section>
        </AnimatePresence>
      </div>
    </>
  );
}

/* ====================================================================== */
/* Fiche client                                                            */
/* ====================================================================== */
function VueClient() {
  const [choisi, setChoisi] = useState(1);
  const client = CLIENTS[choisi];
  return (
    <>
      <header className="titre-vue">
        <h1>Fiche client</h1>
        <p className="muet">240 comptes · 18 avec une conversation en cours</p>
      </header>
      <div className="fiche">
        <Carte i={0} className="liste-clients">
          <span className="champ"><Icone n="loupe" taille={14} /> Trouver un client ou une entreprise</span>
          {CLIENTS.map((x, k) => (
            <button key={x.nom} className={`rangee-client ${k === choisi ? "choisie" : ""}`} onClick={() => setChoisi(k)}>
              <Initiales nom={x.nom} />
              <span><span className="bloc">{x.nom}</span><small className="muet">{x.societe}</small></span>
              {x.risque ? <Surligne>À risque</Surligne> : <span className="muet petit">{x.ouvertes} ouverte{x.ouvertes > 1 ? "s" : ""}</span>}
            </button>
          ))}
        </Carte>
        <AnimatePresence mode="wait">
          <motion.div key={client.nom} className="milieu-client" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
            <div className="groupe"><i className="initiales grand">{client.nom.split(" ").map((m) => m[0]).join("")}</i><span><b className="bloc nom-client">{client.nom}</b><small className="muet">{client.societe} · offre Croissance · 14 postes · Dakar</small></span></div>
            <div className="indicateurs">
              <Indicateur valeur="76" exposant="conv." libelle="12 derniers mois" detail="" />
              <Indicateur valeur="4,8" exposant="/5" libelle="Satisfaction · 17 notes" detail="" />
              <Indicateur valeur="90,7" exposant="%" libelle="SLA respecté · 68 sur 75 dus" detail="" />
              <Indicateur valeur="1,1" exposant="h" libelle="Résolution médiane" detail="" />
            </div>
            <Histogramme valeurs={ANNEE} surligne={ANNEE.length - 1} hauteur={70} />
            <div className="axe">{["nov.", "janv.", "mars", "mai", "juil.", "sept.", "nov."].map((m, k) => <span key={k}>{m}</span>)}</div>
            <div className="carte interne">
              <div className="entete-table client-cols"><span>Conversation</span><span>Date</span><span>Canal</span><span>Première réponse</span><span>Issue</span></div>
              {HISTORIQUE.map((h) => (
                <div key={h.sujet + h.date} className="client-cols rangee-simple">
                  <span>{h.sujet}</span><span className="muet">{h.date}</span>
                  <span className="groupe muet"><Icone n={ICONE_CANAL[h.canal]} taille={14} />{h.canal}</span>
                  <span className="muet">{h.reponse}</span>
                  {h.issue === "2 min restantes" ? <Surligne>{h.issue}</Surligne> : <span className="muet">{h.issue}</span>}
                </div>
              ))}
              <p className="petit">Afficher 12 de plus sur 136</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="colonne-droite">
          <Carte i={1}>
            <div className="ligne"><b>Compte</b><span className="muet petit">Croissance</span></div>
            {[["Entreprise", client.societe], ["Postes", "14"], ["Région", "Dakar"], ["Client depuis", "mars 2024"], ["Dernier contact", "Aujourd'hui, 16:17"]].map(([l, v]) => (
              <p key={l} className="ligne petit"><span className="muet">{l}</span><span>{v}</span></p>
            ))}
          </Carte>
          <Carte i={2}>
            <div className="ligne"><b>En cours</b><span className="muet petit">1 conversation</span></div>
            <div className="ligne"><span><span className="bloc petit">Boucle de réinitialisation</span><small className="muet">Non attribuée</small></span><Surligne>2 min restantes</Surligne></div>
          </Carte>
          <Carte i={3}>
            <div className="ligne"><b>Notes du compte</b><span className="muet petit">Équipe uniquement</span></div>
            <p className="muet petit">Aucune note sur ce compte pour l'instant</p>
            <textarea className="zone petite" placeholder="Du contexte pour la personne qui reprendra" maxLength={280} />
            <div className="ligne"><span className="muet petit">0/280</span><button className="btn sombre">Ajouter la note</button></div>
          </Carte>
        </div>
      </div>
    </>
  );
}

/* ====================================================================== */
/* Performance de l'équipe                                                 */
/* ====================================================================== */
type Statut = "En ligne" | "Absent" | "Hors ligne";
function VueEquipe() {
  const [statuts, setStatuts] = useState<Statut[]>(AGENTS.map((a) => a.statut));
  const [choisi, setChoisi] = useState(1);
  return (
    <>
      <header className="titre-vue ligne">
        <div><h1>Performance de l'équipe</h1><p className="muet">8 agents · 4 en ligne · 2 disponibles · Aujourd'hui</p></div>
        <Segments valeurs={["1H", "1J", "1S", "1M", "1A"]} actif="1J" />
      </header>
      <div className="indicateurs">
        <Indicateur valeur="97" exposant="/100" libelle="Score de l'équipe · nov." detail="3 vs oct." hausse />
        <Indicateur valeur="83" exposant="%" libelle="Capacité utilisée · 20 sur 24 places" detail="4 en ligne · 6 conversations" />
        <Indicateur valeur="2" exposant="/4" libelle="Agents disponibles" detail="En ligne avec une place libre" />
        <Indicateur valeur="4,8" exposant="min" libelle="Première réponse · médiane" detail="SLA 96,2 % · 75 sur 78" />
      </div>
      <div className="equipe">
        <Carte i={0} className="table-agents">
          <div className="entete-table agent-cols"><span className="groupe">Agent · statut <Icone n="bas" taille={12} /></span><span /><span>Charge</span><span>Réponse</span><span>SLA</span><span>Note</span><span>Traitées</span></div>
          {AGENTS.map((a, k) => {
            const statut = statuts[k];
            const charge = statut === "Hors ligne" ? 0 : a.charge;
            return (
              <div key={a.nom} className={`agent-cols rangee-agent ${k === choisi ? "choisie" : ""}`} onClick={() => setChoisi(k)}>
                <span className="groupe"><Initiales nom={a.nom} /><span><span className="bloc">{a.nom}</span><small className="muet">{a.role} · {statut === "Hors ligne" ? a.fin : charge >= 6 ? "au maximum" : "disponible"}</small></span></span>
                <span className="statuts" onClick={(e) => e.stopPropagation()}>
                  {(["En ligne", "Absent", "Hors ligne"] as Statut[]).map((s) => (
                    <button key={s} className={statut === s ? "actif" : ""} onClick={() => setStatuts(statuts.map((v, j) => (j === k ? s : v)))}>
                      {statut === s && <motion.i layoutId={`statut-${k}`} className="statut-fond" transition={{ duration: 0.25, ease: EASE }} />}
                      <span>{s}</span>
                    </button>
                  ))}
                </span>
                <span className="groupe charge">
                  {Array.from({ length: 6 }, (_, j) => <i key={j} className={j < charge ? (charge >= 6 ? "plein noir" : "plein") : ""} />)}
                  <small>{charge}/6</small>
                </span>
                <span>{a.reponse}</span><span>{a.sla}</span><span>{a.note}</span><span>{a.traitees}</span>
              </div>
            );
          })}
          <p className="muet petit">Les statuts sont modifiés localement pour la démo. Disponible = en ligne avec moins de 6 conversations ; un responsable absent ou hors ligne laisse ses conversations sans réponse non couvertes.</p>
        </Carte>
        <div className="colonne-droite">
          <Carte i={1}>
            <div className="ligne"><span className="groupe"><Initiales nom={AGENTS[choisi].nom} /><span><b className="bloc">{AGENTS[choisi].nom}</b><small className="muet">{AGENTS[choisi].role} · 11:30 – 20:00</small></span></span><span className="etoiles">★★★★★ <small>5/6</small></span></div>
            <Histogramme valeurs={[2, 3, 2, 4, 1, 3, 5, 2, 3, 6, 2, 3, 7]} surligne={12} hauteur={70} />
            <div className="axe"><span>06:00</span><span>11 conversations traitées</span><span>16:00</span></div>
            {CONV_AGENT.map(([s, q, e]) => (
              <div key={s} className="ligne petit conv-agent"><span><span className="bloc">{s}</span><small className="muet">{q}</small></span>{e === "SLA respecté" ? <span className="muet">{e}</span> : <span className="delai couvert">{e}</span>}</div>
            ))}
            <p className="muet petit">+ 1 de plus dans la boîte</p>
          </Carte>
          <Carte i={2}>
            <div className="ligne"><b>Planning du jour</b><span className="muet petit">Agents en poste par heure</span></div>
            <Histogramme valeurs={[1, 1, 2, 2, 3, 4, 5, 5, 4, 4, 3, 3, 2, 2, 1]} surligne={9} hauteur={56} />
            <div className="axe"><span>06:00</span><span>12:00</span><span>20:00</span></div>
          </Carte>
        </div>
      </div>
    </>
  );
}

/* ====================================================================== */
/* Coquille                                                                */
/* ====================================================================== */
const ICONES_ONGLETS: Record<Onglet, NomIcone> = { service: "grille", boite: "boite", client: "personne", equipe: "equipe" };

export default function TableauRelais() {
  const [onglet, setOnglet] = useState<Onglet>("service");
  const [toast, setToast] = useState<{ qui: string; sujet: string } | null>(null);
  const attribuer = (qui: string, sujet: string) => {
    setToast({ qui, sujet });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relais">
        <style>{CSS}</style>
        <nav className="barre-haut">
          <b className="marque">relais</b>
          <LayoutGroup>
            <div className="onglets">
              {ONGLETS.map((o) => (
                <button key={o.id} onClick={() => setOnglet(o.id)} aria-pressed={onglet === o.id}>
                  {onglet === o.id && <motion.span layoutId="onglet-actif" className="onglet-actif" transition={{ duration: 0.35, ease: EASE }} />}
                  <span className="onglet-texte">
                    {onglet === o.id && <Icone n={ICONES_ONGLETS[o.id]} taille={14} />}
                    {o.libelle}{o.compte !== undefined && <i className="compte">{o.compte}</i>}
                  </span>
                </button>
              ))}
            </div>
          </LayoutGroup>
          <span className="groupe">
            <button className="rond" aria-label="Rechercher"><Icone n="loupe" taille={14} /></button>
            <button className="rond" aria-label="Équipe"><Icone n="equipe" taille={14} /></button>
            <button className="rond" aria-label="Notifications"><Icone n="cloche" taille={14} /><i className="badge-jaune">3</i></button>
            <span className="avatar">KD</span>
          </span>
        </nav>
        <AnimatePresence mode="wait">
          <motion.main key={onglet} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
            {onglet === "service" && <VueService />}
            {onglet === "boite" && <VueBoite onAttribuer={attribuer} />}
            {onglet === "client" && <VueClient />}
            {onglet === "equipe" && <VueEquipe />}
          </motion.main>
        </AnimatePresence>
        <AnimatePresence>
          {toast && (
            <motion.div className="toast" role="status" initial={{ opacity: 0, y: 24, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 24, x: "-50%" }} transition={{ duration: 0.35, ease: EASE }}>
              <span className="coche"><Icone n="coche" taille={12} /></span>
              <span><b className="bloc">Attribuée à {toast.qui}</b><small>{toast.sujet} · 6 sur 6 ouvertes</small></span>
              <button onClick={() => setToast(null)}><Icone n="annuler" taille={12} /> Annuler</button>
              <button onClick={() => setToast(null)} aria-label="Fermer"><Icone n="croix" taille={12} /></button>
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
type Canal = "E-mail" | "Chat" | "Téléphone";
const DELAIS = [6, 7.5, 10, 8, 5, 4.5, 7, 9, 5.9, 5.2, 6.5, 8.2, 6, 4.8, 5.5, 6.2, 5];
const HEURES = ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"];
const SCORES = [{ mois: "oct.", valeur: 94 }, { mois: "nov.", valeur: 97 }, { mois: "record · juil.", valeur: 98 }];
const NOTES = [
  { qui: "Mamadou Sy", heure: "16:21", texte: "L'article sur l'accès au compte est à jour, la nouvelle checklist est prête." },
  { qui: "Awa Faye", heure: "15:58", texte: "La file d'intégration est vide, je prends les prochaines questions de facturation." },
];
const CONVERSATIONS: { ref: string; sujet: string; priorite: string; quand: string; contact: string; client: string; canal: Canal; agent?: string; absent?: boolean; min?: number }[] = [
  { ref: "C-90421", sujet: "Double prélèvement Wave", priorite: "Haute", quand: "aujourd'hui 16:27", contact: "Samba Diouf", client: "Sénégal Logistique", canal: "E-mail", agent: "Pape Ndiaye", absent: true, min: 12 },
  { ref: "C-90409", sujet: "Adresse de facturation", priorite: "Haute", quand: "aujourd'hui 16:03", contact: "Omar Gaye", client: "Dakar Fournitures", canal: "E-mail", min: 18 },
  { ref: "C-90418", sujet: "Accès à l'espace équipe", priorite: "Normale", quand: "aujourd'hui 16:19", contact: "Nafi Cissé", client: "Clinique Ndar", canal: "Chat", min: 34 },
  { ref: "C-90417", sujet: "Boucle de réinitialisation", priorite: "Haute", quand: "aujourd'hui 16:17", contact: "Mariama Diallo", client: "Thiès Agro", canal: "E-mail", agent: "Khady Diallo", min: 2 },
  { ref: "C-90423", sujet: "Erreurs de limite d'API", priorite: "Urgente", quand: "aujourd'hui 16:38", contact: "Abdou Ba", client: "Kaolack Transit", canal: "E-mail", agent: "Moussa Kane", min: 8 },
  { ref: "C-90414", sujet: "Champs personnalisés", priorite: "Normale", quand: "aujourd'hui 16:12", contact: "Bineta Fall", client: "Ziguinchor Retail", canal: "E-mail", agent: "Khady Diallo", min: 27 },
  { ref: "C-90318", sujet: "Aide à la migration", priorite: "Normale", quand: "aujourd'hui 12:48", contact: "Ousmane Sarr", client: "Bleu Système", canal: "E-mail", agent: "Lamine Faye" },
  { ref: "C-90331", sujet: "Webhooks en échec", priorite: "Haute", quand: "aujourd'hui 13:34", contact: "Coumba Ndao", client: "Saint-Louis Labs", canal: "E-mail", agent: "Moussa Kane" },
];
const CLIENTS = [
  { nom: "Samba Diouf", societe: "Sénégal Logistique", risque: true, ouvertes: 1 },
  { nom: "Mariama Diallo", societe: "Thiès Agro", risque: true, ouvertes: 1 },
  { nom: "Omar Gaye", societe: "Dakar Fournitures", risque: true, ouvertes: 1 },
  { nom: "Abdou Ba", societe: "Kaolack Transit", risque: false, ouvertes: 2 },
  { nom: "Fallou Mbaye", societe: "Rufisque Carrières", risque: false, ouvertes: 2 },
  { nom: "Aïda Sow", societe: "Mbour Fret", risque: false, ouvertes: 2 },
  { nom: "Ousmane Sarr", societe: "Bleu Système", risque: false, ouvertes: 2 },
  { nom: "Rokhaya Ndiaye", societe: "Louga Santé", risque: false, ouvertes: 1 },
];
const ANNEE = [3, 4, 2, 5, 3, 6, 4, 5, 3, 7, 4, 6, 5, 8, 4, 6, 5, 7, 3, 6, 4, 5, 6, 9];
const HISTORIQUE: { sujet: string; date: string; canal: Canal; reponse: string; issue: string }[] = [
  { sujet: "Boucle de réinitialisation", date: "Aujourd'hui", canal: "E-mail", reponse: "En attente", issue: "2 min restantes" },
  { sujet: "Champs personnalisés", date: "16 nov.", canal: "Chat", reponse: "6,3 min", issue: "Résolue" },
  { sujet: "Aide à la migration", date: "15 nov.", canal: "Téléphone", reponse: "1,0 min", issue: "Résolue" },
  { sujet: "Webhooks en échec", date: "9 nov.", canal: "E-mail", reponse: "5,1 min", issue: "Résolue" },
  { sujet: "Export : colonnes manquantes", date: "5 nov.", canal: "E-mail", reponse: "3,9 min", issue: "Notée 5/5" },
];
const CONV_AGENT: [string, string, string][] = [
  ["Connexion unique en échec", "Ousmane Sarr", "SLA respecté"],
  ["Code de double authentification absent", "Abdou Ba", "SLA respecté"],
  ["Compte bloqué après changement d'e-mail", "Coumba Ndao", "SLA respecté"],
  ["Champs personnalisés", "Bineta Fall", "27 min restantes"],
];
const AGENTS: { nom: string; role: string; statut: Statut; charge: number; reponse: string; sla: string; note: string; traitees: number; fin: string }[] = [
  { nom: "Awa Faye", role: "Facturation", statut: "En ligne", charge: 3, reponse: "5,2 min", sla: "100 %", note: "5,0", traitees: 10, fin: "" },
  { nom: "Khady Diallo", role: "Accès au compte", statut: "En ligne", charge: 5, reponse: "4,5 min", sla: "90 %", note: "5,0", traitees: 11, fin: "" },
  { nom: "Lamine Faye", role: "Technique", statut: "En ligne", charge: 6, reponse: "3,7 min", sla: "100 %", note: "—", traitees: 18, fin: "" },
  { nom: "Moussa Kane", role: "Technique", statut: "En ligne", charge: 6, reponse: "3,7 min", sla: "91,7 %", note: "—", traitees: 13, fin: "" },
  { nom: "Pape Ndiaye", role: "Facturation", statut: "Absent", charge: 2, reponse: "6,2 min", sla: "100 %", note: "5,0", traitees: 10, fin: "de retour à 17:00" },
  { nom: "Astou Diop", role: "Technique", statut: "Hors ligne", charge: 0, reponse: "—", sla: "—", note: "—", traitees: 0, fin: "repos aujourd'hui" },
  { nom: "Ibou Seck", role: "Facturation", statut: "Hors ligne", charge: 0, reponse: "4,8 min", sla: "100 %", note: "4,0", traitees: 9, fin: "service fini à 14:30" },
  { nom: "Daba Thiam", role: "Accès au compte", statut: "Hors ligne", charge: 0, reponse: "8,9 min", sla: "90 %", note: "5,0", traitees: 10, fin: "service fini à 14:30" },
];

/* ====================================================================== */
/* Styles (tokens dans style.md)                                           */
/* ====================================================================== */
const CSS = `
.relais{--fond:#F2F2F0;--carte:#FAFAF8;--blanc:#FFFFFF;--encre:#151515;--muet:#8E8E8A;--trait:#E3E3DF;
--accent:#F2DA1B;--accent-texte:#3A3300;--vert:#E3F0DF;--vert-texte:#3F6B3A;--sombre:#141414;--r:22px;
font-family:"Geist","Inter Tight",system-ui,sans-serif;color:var(--encre);background:var(--fond);
padding:22px 26px;border-radius:30px;font-size:12px;position:relative;min-height:760px;overflow:hidden}
.relais *{box-sizing:border-box}.relais p,.relais h1,.relais h2{margin:0}.relais button{font:inherit;color:inherit}
.muet{color:var(--muet)}.petit{font-size:11px}.centre{text-align:center}.bloc{display:block}.fort{color:var(--encre);font-weight:600}
.ligne{display:flex;align-items:center;justify-content:space-between;gap:10px}.ligne.bas{align-items:flex-end}.ligne.haut{align-items:flex-start}.ligne.fin{justify-content:flex-end}
.groupe{display:inline-flex;align-items:center;gap:8px}
.barre-haut{display:flex;align-items:center;gap:22px;margin-bottom:22px}
.marque{font-size:20px;letter-spacing:-.04em}
.onglets{display:flex;gap:4px;flex:1}
.onglets button{position:relative;border:0;background:none;padding:8px 14px;border-radius:999px;color:var(--muet);cursor:pointer}
.onglets button[aria-pressed=true]{color:#fff}
.onglet-actif{position:absolute;inset:0;background:var(--sombre);border-radius:999px}
.onglet-texte{position:relative;display:inline-flex;gap:6px;align-items:center}
.compte{font-style:normal;background:var(--accent);color:var(--accent-texte);border-radius:999px;font-size:10px;padding:0 6px}
.rond{position:relative;width:30px;height:30px;border-radius:50%;border:0;background:var(--blanc);display:grid;place-items:center;cursor:pointer}
.petit-rond{width:26px;height:26px}
.badge-jaune{position:absolute;top:-3px;right:-3px;background:var(--accent);color:var(--accent-texte);border-radius:999px;font-size:8px;font-style:normal;width:13px;height:13px;display:grid;place-items:center}
.avatar{width:30px;height:30px;border-radius:50%;background:#DADAD4;display:grid;place-items:center;font-size:10px}
.titre-vue{margin-bottom:14px}.titre-vue h1{font-size:22px;font-weight:500;letter-spacing:-.02em}
.segments{display:inline-flex;gap:2px;background:#EBEBE7;border-radius:999px;padding:3px}
.segments span,.segments button{font-size:11px;color:var(--muet);padding:4px 10px;border-radius:999px;border:0;background:none;cursor:pointer}
.segments .actif{background:var(--blanc);color:var(--encre)}
.indicateurs{display:flex;gap:56px;align-items:flex-start;margin-bottom:6px}
.indicateur p{font-size:11px;line-height:1.5}
.relais .valeur{font-size:46px;font-weight:400;letter-spacing:-.045em;line-height:1;margin-bottom:6px}
.valeur sup{font-size:17px;color:var(--muet);margin-left:2px;letter-spacing:0}
.relais .valeur.moyen{font-size:22px;margin:0}
.pastille-gain{background:#EBEBE7;border-radius:16px;padding:10px 14px;display:flex;flex-direction:column;gap:4px}
.rond-haut{width:22px;height:22px;border-radius:50%;background:var(--blanc);display:grid;place-items:center;font-style:normal}
.puce-heure{background:#EBEBE7;border-radius:8px;padding:4px 8px;color:var(--encre)}
.surligne{background:var(--accent);color:var(--accent-texte);border-radius:999px;padding:2px 8px;font-size:11px;font-weight:500;white-space:nowrap}
.bascule{border:0;background:none;border-radius:999px;padding:3px 9px;cursor:pointer;font-size:11px;color:var(--muet)}
.bascule.actif{background:var(--accent);color:var(--accent-texte)}
.graphique{position:relative;margin:6px 0 18px}
.graphique svg{width:100%;height:150px;display:block}
.graduation{position:absolute;left:0;font-size:9px;color:var(--muet)}.graduation.haut{top:6px}.graduation.milieu{top:66px}
.courbe{fill:none;stroke:var(--accent);stroke-width:2.5}
.repere{stroke:var(--encre);stroke-dasharray:3 3;stroke-width:1}
.bulle{position:absolute;top:34px;background:#fff;border-radius:12px;padding:8px 12px;box-shadow:0 8px 24px rgba(0,0,0,.08);pointer-events:none;white-space:nowrap}
.axe{display:flex;justify-content:space-between;font-size:10px;color:var(--muet);margin-top:6px}
.grille-4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.carte{background:var(--carte);border:1px solid #fff;border-radius:var(--r);padding:16px;display:flex;flex-direction:column;gap:8px;min-width:0}
.carte.interne{background:var(--blanc)}
.colonne-barres{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.etiquette-jaune{background:var(--accent);color:var(--accent-texte);border-radius:6px;font-size:9px;padding:1px 6px;font-weight:600}
.barres-points{display:flex;align-items:flex-end;gap:3px;height:56px}
.barres-points i{display:block;width:3px;border-radius:2px;background:repeating-linear-gradient(to top,var(--accent) 0 3px,transparent 3px 5px)}
.carrousel{display:flex;justify-content:center;align-items:baseline;gap:6px;height:66px}
.carrousel button{position:relative;border:0;background:none;cursor:pointer;display:flex;flex-direction:column;align-items:center}
.carrousel span{font-size:42px;letter-spacing:-.04em}.carrousel small{font-size:10px;color:var(--muet)}
.triangle{position:absolute;top:-6px;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid var(--encre)}
.graduations-jaunes{display:flex;justify-content:center;align-items:flex-end;gap:5px;height:16px}
.graduations-jaunes i{width:2px;background:var(--accent);border-radius:1px}
.note{border-top:1px solid var(--trait);padding-top:8px;display:flex;flex-direction:column;gap:4px}
.initiales{font-style:normal;width:22px;height:22px;border-radius:50%;background:#E5E5E0;display:inline-grid;place-items:center;font-size:8px;flex:none;color:var(--encre)}
.initiales.grand{width:40px;height:40px;font-size:12px}.initiales.vide{background:var(--blanc);border:1px dashed var(--trait)}
.boite{display:grid;grid-template-columns:1.55fr 1fr;gap:14px}
.liste{padding:10px}
.onglets-liste{display:flex;gap:4px}
.onglets-liste button{border:0;background:none;border-radius:999px;padding:5px 10px;cursor:pointer;font-size:11px;color:var(--muet);display:inline-flex;gap:6px;white-space:nowrap}
.onglets-liste button.actif{background:var(--blanc);color:var(--encre);box-shadow:0 1px 3px rgba(0,0,0,.06)}
.onglets-liste i{font-style:normal}.onglets-liste i.jaune{background:var(--accent);color:var(--accent-texte);border-radius:999px;padding:0 5px}
.champ{display:inline-flex;align-items:center;gap:8px;background:var(--blanc);border-radius:10px;padding:7px 10px;color:var(--muet);font-size:11px;white-space:nowrap}
.entete-table{font-size:10px;color:var(--muet);padding:6px 8px}
.boite-cols{display:grid;grid-template-columns:10px 1.6fr 1.3fr .7fr 1fr 110px;gap:10px;align-items:center}
.rangee{padding:8px;border:0;background:none;border-radius:12px;text-align:left;cursor:pointer;width:100%}
.rangee.choisie{background:#fff;box-shadow:0 4px 16px rgba(0,0,0,.05)}
.point{width:6px;height:6px;border-radius:50%;background:#C9C9C4}.point.chaud{background:var(--accent)}.point.tiede{background:#EFE7A4}
.delai{justify-self:start;font-size:10px;border-radius:999px;padding:3px 9px;background:#ECECE8;white-space:nowrap}
.delai.urgent{background:var(--accent);color:var(--accent-texte)}.delai.couvert{background:var(--vert);color:var(--vert-texte)}
.delai-texte{font-size:11px;color:var(--muet)}
.pied{padding:8px 8px 0}
.detail h2{font-size:19px;font-weight:500}
.compte-rebours{display:flex;gap:12px;align-items:center;background:#EDEDEA;border-radius:16px;padding:12px}
.anneau-attente{width:30px;height:30px;border-radius:50%;border:2.5px solid #DADAD4;border-top-color:var(--encre);flex:none}
.couvert-pastille{margin-left:auto;background:var(--vert);color:var(--vert-texte);border-radius:999px;font-size:10px;padding:3px 9px;white-space:nowrap}
.responsable{border-bottom:1px solid var(--trait);padding-bottom:10px}
.selecteur{display:inline-flex;gap:4px;align-items:center;font-size:11px}
.tuiles{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.tuile{background:#EDEDEA;border-radius:10px;padding:8px 10px;display:flex;flex-direction:column;gap:2px}
.zone{width:100%;min-height:54px;border:0;border-radius:12px;background:var(--blanc);padding:10px;font:inherit;font-size:11px;resize:none}
.zone.petite{min-height:44px}
.btn{border:0;border-radius:999px;padding:9px 14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}.btn.sombre{background:var(--sombre);color:#fff}
.fiche{display:grid;grid-template-columns:220px 1fr 260px;gap:14px}
.liste-clients{padding:10px;gap:2px}
.rangee-client{display:grid;grid-template-columns:22px 1fr auto;gap:8px;align-items:center;padding:8px;border:0;background:none;border-radius:12px;text-align:left;cursor:pointer}
.rangee-client.choisie{background:#fff;box-shadow:0 4px 16px rgba(0,0,0,.05)}
.milieu-client{display:flex;flex-direction:column;gap:12px;min-width:0}
.milieu-client .indicateurs{gap:40px}
.nom-client{font-size:18px;font-weight:500}
.histogramme{display:flex;align-items:flex-end;gap:3px}
.histogramme i{flex:1;background:#E3E3DF;border-radius:2px;min-width:2px}.histogramme i.jaune{background:var(--accent)}
.client-cols{display:grid;grid-template-columns:1.6fr .8fr .9fr 1fr .9fr;gap:10px;align-items:center}
.rangee-simple{padding:7px 8px;font-size:11px;border-top:1px solid var(--trait)}
.colonne-droite{display:flex;flex-direction:column;gap:12px;min-width:0}
.equipe{display:grid;grid-template-columns:1.6fr 1fr;gap:14px;margin-top:14px}
.agent-cols{display:grid;grid-template-columns:1.4fr 180px 100px .7fr .5fr .4fr .45fr;gap:8px;align-items:center}
.rangee-agent{padding:8px;border-radius:12px;font-size:11px;cursor:pointer}
.rangee-agent.choisie{background:#fff;box-shadow:0 4px 16px rgba(0,0,0,.05)}
.statuts{display:inline-flex;gap:2px}
.statuts button{position:relative;border:0;background:none;border-radius:999px;padding:3px 8px;font-size:10px;color:var(--muet);cursor:pointer;white-space:nowrap}
.statuts button.actif{color:var(--encre)}
.statut-fond{position:absolute;inset:0;background:var(--blanc);border-radius:999px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.statuts span{position:relative}
.charge i{width:5px;height:5px;border-radius:50%;background:#E3E3DF}.charge i.plein{background:var(--accent)}.charge i.noir{background:var(--sombre)}
.charge{gap:3px}.charge small{margin-left:4px;color:var(--muet)}
.etoiles{color:var(--accent);font-size:11px;white-space:nowrap}.etoiles small{color:var(--muet)}
.conv-agent{border-top:1px solid var(--trait);padding-top:6px}
.toast{position:absolute;left:50%;bottom:20px;background:var(--sombre);color:#fff;border-radius:14px;padding:10px 14px;display:flex;gap:12px;align-items:center;font-size:11px}
.toast small{color:#A5A5A0}
.coche{background:var(--accent);color:var(--accent-texte);border-radius:50%;width:24px;height:24px;display:grid;place-items:center}
.toast button{background:none;color:#fff;border:0;cursor:pointer;opacity:.85;display:inline-flex;gap:4px;align-items:center}
`;
