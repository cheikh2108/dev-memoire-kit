/**
 * Modèle 03 — Tableau de bord de parking avec maquette 3D « Parking Plateau »
 * Reconstruction originale (nom, données et code réécrits) d'après une démo publique
 * de tableau de bord de parking. Relevé élément par élément : voir README.md.
 *
 * Quatre vues : Garage (maquette 3D) · Sessions · Réservations · Recettes.
 * Dépendances : react 18+, motion 11+, three 0.170+ (`npm i motion three`).
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import * as THREE from "three";

/* ====================================================================== */
/* Réglages de caméra (radians), relevés dans la vidéo — voir animations.md */
/* ====================================================================== */
const EL_VUE_GENERALE = 0.48; // ≈ 27°
const EL_NIVEAU = 0.99;       // ≈ 57°
const EL_PLACE = 0.87;        // ≈ 50°
const EL_MIN = 0.38;
const EL_MAX = 1.25;
const AZ_PLAGE = 0.7;         // rotation bornée à ±40°
const ECART_ECLATE = 8;
const LEVEE = 34;
const AMORTI = 6;
const EASE = [0.22, 1, 0.36, 1] as const;

type Vue = "garage" | "sessions" | "reservations" | "recettes";
type Etat = "libre" | "reservee" | "occupee" | "hors";
type Place = { id: number; niveau: number; rang: 0 | 1; col: number; etat: Etat; plaque?: string };

const COULEURS: Record<Etat, number> = { libre: 0xbfe0c9, reservee: 0xf3d58a, occupee: 0xd9dce3, hors: 0x9aa0aa };
const NIVEAUX = [
  { court: "N1", long: "N1 Rez-de-chaussée" },
  { court: "N2", long: "N2 Niveau 2" },
  { court: "N3", long: "N3 Toit" },
];

/* ====================================================================== */
/* Icônes                                                                  */
/* ====================================================================== */
const TRACES = {
  logo: "M4 4h12v12H4zM8 13V7h3a2 2 0 0 1 0 4H8",
  replier: "M4 4h12v12H4zM8 4v12",
  loupe: "M9 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM17 17l-3.5-3.5",
  grille: "M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z",
  chrono: "M10 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM10 8v3M8 2h4",
  calendrier: "M4 6h12v10H4zM4 9h12M7 4v3M13 4v3",
  recu: "M5 3h10v14l-2-1.5L11 17l-2-1.5L7 17l-2-1.5zM8 7h4M8 10h4",
  lecture: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM8.5 7.5v5l4-2.5z",
  interdit: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM5 5l10 10",
  etiquette: "M3 10V4h6l8 8-6 6zM6.5 7h.01",
  info: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM10 9v4M10 6.5h.01",
  clavier: "M3 6h14v8H3zM6 9h.01M9 9h.01M12 9h.01M7 12h6",
  reinitialiser: "M4 10a6 6 0 1 0 2-4.5M4 4v3h3",
  horloge: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM10 6v4l3 2",
  pause: "M7 5v10M13 5v10",
  cloche: "M5 14V9a5 5 0 0 1 10 0v5l1.5 1.5h-13zM8.5 17.5h3",
  telecharger: "M10 4v9M6 9l4 4 4-4M4 16h12",
  entree: "M11 5h5v10h-5M3 10h9M9 7l3 3-3 3",
  plus: "M10 4v12M4 10h12",
  jauge: "M4 14a6 6 0 1 1 12 0M10 14l3-4",
  voiture: "M3 12l1.5-4h11L17 12v3H3zM5 15v1.5M15 15v1.5M6 12h.01M14 12h.01",
  euro: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM12.5 7.5a3 3 0 1 0 0 5M6 9.5h5M6 11h4",
  sablier: "M6 3h8M6 17h8M7 3c0 4 6 4 6 7s-6 3-6 7M13 3c0 4-6 4-6 7",
  cube: "M10 3l7 4v7l-7 4-7-4V7zM3 7l7 4 7-4M10 11v7",
  couches: "M10 3l7 4-7 4-7-4zM3 11l7 4 7-4M3 14l7 4 7-4",
  tourner_g: "M5 9a6 6 0 1 1 1 5M5 4v5h5",
  tourner_d: "M15 9a6 6 0 1 0-1 5M15 4v5h-5",
  centrer: "M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM10 2v3M10 15v3M2 10h3M15 10h3",
  croix: "M5 5l10 10M15 5L5 15",
  ampoule: "M7.5 14h5M8 17h4M10 3a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9Z",
  points: "M5 10h.01M10 10h.01M15 10h.01",
  tri: "M7 4v12M4 7l3-3 3 3M13 16V4M10 13l3 3 3-3",
  bas: "M6 8l4 4 4-4",
  personne: "M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 17c.7-3.4 3-5 6-5s5.3 1.6 6 5",
  graphique: "M4 16V4M4 16h12M7 13V10M10 13V7M13 13V9",
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
/* Scène 3D                                                                */
/* ====================================================================== */
type Commandes = { niveau: number | null; eclate: boolean; place: number | null };

function creerScene(hote: HTMLDivElement, etiquette: HTMLDivElement, places: Place[], onChoisir: (id: number) => void) {
  const rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  rendu.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  rendu.setSize(hote.clientWidth, hote.clientHeight);
  hote.prepend(rendu.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, hote.clientWidth / hote.clientHeight, 1, 600);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8dbe2, 2.2));
  const soleil = new THREE.DirectionalLight(0xffffff, 1.4);
  soleil.position.set(20, 40, 15);
  scene.add(soleil);

  // Sol, route et passage piéton : le contexte urbain autour du bâtiment
  const sol = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshLambertMaterial({ color: 0xe6e8ec }));
  sol.rotation.x = -Math.PI / 2;
  sol.position.y = -0.3;
  scene.add(sol);
  const route = new THREE.Mesh(new THREE.PlaneGeometry(800, 9), new THREE.MeshLambertMaterial({ color: 0xcfd3da }));
  route.rotation.x = -Math.PI / 2;
  route.position.set(0, -0.28, 15);
  scene.add(route);
  for (let k = 0; k < 7; k++) {
    const bande = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 4), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    bande.rotation.x = -Math.PI / 2;
    bande.position.set(-20 + k * 1.6, -0.27, 15);
    scene.add(bande);
  }

  const LARGEUR = 3.2;
  const PROFONDEUR = 5;
  const HAUTEUR_NIVEAU = 3;
  const niveaux: THREE.Group[] = [];
  const materiaux: THREE.Material[][] = [];
  const marquages = new Map<number, THREE.Mesh>();
  const centrePlace = new Map<number, THREE.Vector3>();

  for (let n = 0; n < NIVEAUX.length; n++) {
    const g = new THREE.Group();
    const mats: THREE.Material[] = [];
    const dalleMat = new THREE.MeshLambertMaterial({ color: 0xf6f7f9, transparent: true });
    mats.push(dalleMat);
    const dalle = new THREE.Mesh(new THREE.BoxGeometry(16 * LARGEUR + 4, 0.4, 2 * PROFONDEUR + 6), dalleMat);
    dalle.position.y = -0.2;
    g.add(dalle);
    if (n < NIVEAUX.length - 1) {
      for (const [px, pz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const poteau = new THREE.Mesh(new THREE.BoxGeometry(0.4, HAUTEUR_NIVEAU - 0.4, 0.4), dalleMat);
        poteau.position.set(px * (8 * LARGEUR + 1.6), HAUTEUR_NIVEAU / 2 - 0.2, pz * (PROFONDEUR + 2.6));
        g.add(poteau);
      }
    }
    for (const p of places.filter((x) => x.niveau === n)) {
      const x = (p.col - 7.5) * LARGEUR;
      const z = (p.rang === 0 ? -1 : 1) * (PROFONDEUR / 2 + 1.5);
      const mat = new THREE.MeshLambertMaterial({ color: COULEURS[p.etat], transparent: true });
      mats.push(mat);
      const marquage = new THREE.Mesh(new THREE.BoxGeometry(LARGEUR - 0.25, 0.05, PROFONDEUR - 0.3), mat);
      marquage.position.set(x, 0.03, z);
      marquage.userData.id = p.id;
      g.add(marquage);
      marquages.set(p.id, marquage);
      centrePlace.set(p.id, new THREE.Vector3(x, 0, z));
      if (p.etat === "occupee") {
        const carrosserie = new THREE.MeshLambertMaterial({ color: p.id % 3 ? 0x2b2f38 : 0x6b7280, transparent: true });
        mats.push(carrosserie);
        const voiture = new THREE.Group();
        const caisse = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 4), carrosserie);
        caisse.position.y = 0.45;
        const habitacle = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.55, 2.2), carrosserie);
        habitacle.position.set(0, 1.05, 0.2);
        voiture.add(caisse, habitacle);
        voiture.position.set(x, 0, z);
        g.add(voiture);
      }
    }
    g.position.y = n * HAUTEUR_NIVEAU;
    scene.add(g);
    niveaux.push(g);
    materiaux.push(mats);
  }

  const actuel = { el: EL_VUE_GENERALE, az: -0.35, rayon: 72, centre: new THREE.Vector3(0, 3, 0), eclate: 0, isole: 0 };
  const cible = { el: EL_VUE_GENERALE, az: -0.35, rayon: 72, centre: new THREE.Vector3(0, 3, 0), eclate: 0, isole: 0 };
  let niveauIsole = -1;
  let surbrillance: number | null = null;

  function appliquer(c: Commandes) {
    cible.eclate = c.eclate ? 1 : 0;
    cible.isole = c.niveau === null ? 0 : 1;
    if (c.niveau !== null) niveauIsole = c.niveau;
    if (c.place !== null) {
      const p = places.find((x) => x.id === c.place)!;
      const centre = centrePlace.get(p.id)!.clone();
      centre.y = p.niveau * HAUTEUR_NIVEAU;
      cible.el = EL_PLACE; cible.rayon = 36; cible.centre.copy(centre);
    } else if (c.niveau !== null) {
      cible.el = EL_NIVEAU; cible.rayon = 62; cible.centre.set(0, c.niveau * HAUTEUR_NIVEAU, 0);
    } else {
      cible.el = EL_VUE_GENERALE; cible.rayon = c.eclate ? 88 : 72; cible.centre.set(0, c.eclate ? 10 : 3, 0);
    }
    if (surbrillance !== null) {
      const p = places.find((x) => x.id === surbrillance)!;
      (marquages.get(p.id)!.material as THREE.MeshLambertMaterial).color.setHex(COULEURS[p.etat]);
    }
    surbrillance = c.place;
    if (c.place !== null) (marquages.get(c.place)!.material as THREE.MeshLambertMaterial).color.setHex(0x3b6fe0);
  }
  function tourner(sens: -1 | 0 | 1) {
    cible.az = sens === 0 ? -0.35 : THREE.MathUtils.clamp(cible.az + sens * 0.35, -AZ_PLAGE, AZ_PLAGE);
    if (sens === 0) cible.el = surbrillance !== null ? EL_PLACE : niveauIsole >= 0 && cible.isole ? EL_NIVEAU : EL_VUE_GENERALE;
  }

  let glisse: { x: number; y: number; bouge: boolean } | null = null;
  const lanceur = new THREE.Raycaster();
  const souris = new THREE.Vector2();
  const toile = rendu.domElement;
  toile.addEventListener("pointerdown", (e) => { glisse = { x: e.clientX, y: e.clientY, bouge: false }; toile.setPointerCapture(e.pointerId); });
  toile.addEventListener("pointermove", (e) => {
    if (!glisse) return;
    const dx = e.clientX - glisse.x;
    const dy = e.clientY - glisse.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) glisse.bouge = true;
    cible.az = THREE.MathUtils.clamp(cible.az - dx * 0.005, -AZ_PLAGE, AZ_PLAGE);
    cible.el = THREE.MathUtils.clamp(cible.el + dy * 0.005, EL_MIN, EL_MAX);
    glisse.x = e.clientX; glisse.y = e.clientY;
  });
  toile.addEventListener("pointerup", (e) => {
    if (glisse && !glisse.bouge) {
      const r = toile.getBoundingClientRect();
      souris.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      lanceur.setFromCamera(souris, camera);
      const visibles = [...marquages.values()].filter((m) => m.parent?.visible);
      const touche = lanceur.intersectObjects(visibles, false)[0];
      if (touche) onChoisir(touche.object.userData.id as number);
    }
    glisse = null;
  });

  const horloge = new THREE.Clock();
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const projete = new THREE.Vector3();
  let image = 0;
  function boucle() {
    const dt = Math.min(horloge.getDelta(), 0.05);
    const k = reduit ? 1 : 1 - Math.exp(-AMORTI * dt);
    actuel.el += (cible.el - actuel.el) * k;
    actuel.az += (cible.az - actuel.az) * k;
    actuel.rayon += (cible.rayon - actuel.rayon) * k;
    actuel.centre.lerp(cible.centre, k);
    actuel.eclate += (cible.eclate - actuel.eclate) * k;
    actuel.isole += (cible.isole - actuel.isole) * k;
    niveaux.forEach((g, n) => {
      const auDessus = niveauIsole >= 0 && n > niveauIsole;
      g.position.y = n * (HAUTEUR_NIVEAU + ECART_ECLATE * actuel.eclate) + (auDessus ? LEVEE * actuel.isole : 0);
      const opacite = auDessus ? 1 - 0.85 * actuel.isole : 1;
      materiaux[n].forEach((m) => (m.opacity = opacite));
      g.visible = opacite > 0.02;
    });
    camera.position.set(
      actuel.centre.x + actuel.rayon * Math.cos(actuel.el) * Math.sin(actuel.az),
      actuel.centre.y + actuel.rayon * Math.sin(actuel.el),
      actuel.centre.z + actuel.rayon * Math.cos(actuel.el) * Math.cos(actuel.az),
    );
    camera.lookAt(actuel.centre);
    rendu.render(scene, camera);
    // Étiquette HTML collée à la place choisie (projection 3D → écran)
    if (surbrillance !== null) {
      marquages.get(surbrillance)!.getWorldPosition(projete);
      projete.y += 1.6;
      projete.project(camera);
      etiquette.style.opacity = "1";
      etiquette.style.transform = `translate(${((projete.x + 1) / 2) * hote.clientWidth}px, ${((1 - projete.y) / 2) * hote.clientHeight}px) translate(-50%, -100%)`;
      etiquette.textContent = String(surbrillance);
    } else {
      etiquette.style.opacity = "0";
    }
    image = requestAnimationFrame(boucle);
  }
  boucle();
  const observateur = new ResizeObserver(() => {
    rendu.setSize(hote.clientWidth, hote.clientHeight);
    camera.aspect = hote.clientWidth / hote.clientHeight;
    camera.updateProjectionMatrix();
  });
  observateur.observe(hote);
  return {
    appliquer,
    tourner,
    detruire() {
      cancelAnimationFrame(image);
      observateur.disconnect();
      rendu.dispose();
      toile.remove();
    },
  };
}

/* ====================================================================== */
/* Primitives d'interface                                                  */
/* ====================================================================== */
function Carte({ i, className = "", children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <motion.section className={`carte ${className}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay: 0.08 + i * 0.05 }}>
      {children}
    </motion.section>
  );
}

type Ton = "vert" | "ambre" | "rouge" | "bleu" | "gris";
function Tendance({ ton, children }: { ton: Ton; children: ReactNode }) {
  return <span className={`tendance ${ton}`}>{children}</span>;
}

function Indicateur({ i, icone, titre, valeur, tendance, ton, details }: { i: number; icone: NomIcone; titre: string; valeur: string; tendance: string; ton: Ton; details: [string, string][] }) {
  return (
    <Carte i={i} className="indicateur">
      <p className="ligne"><span className="groupe muet"><i className="carre-icone"><Icone n={icone} taille={12} /></i>{titre}</span><Icone n="points" taille={14} /></p>
      <p className="ligne"><span className="valeur">{valeur}</span><Tendance ton={ton}>{tendance}</Tendance></p>
      <div className="details">{details.map(([l, v]) => <p key={l}><span className="muet">{l}</span><b>{v}</b></p>)}</div>
    </Carte>
  );
}

function Plaque({ texte }: { texte: string }) {
  return <span className="plaque">{texte}</span>;
}

function Pastille({ ton, children }: { ton: Ton; children: ReactNode }) {
  return <span className={`pastille ${ton}`}>● {children}</span>;
}

/** Courbe avec aire, objectif en pointillé et pastille sur la dernière valeur. */
function CourbeObjectif({ valeurs, objectif }: { valeurs: number[]; objectif: number }) {
  const w = 300;
  const h = 90;
  const x = (k: number) => (k / (valeurs.length - 1)) * w;
  const y = (v: number) => h - (v / 100) * h;
  const d = valeurs.map((v, k) => `${k ? "L" : "M"}${x(k)} ${y(v)}`).join(" ");
  const fin = valeurs[valeurs.length - 1];
  return (
    <div className="courbe-objectif">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs><linearGradient id="aire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3B6FE0" stopOpacity=".25" /><stop offset="1" stopColor="#3B6FE0" stopOpacity="0" /></linearGradient></defs>
        <line x1={0} x2={w} y1={y(objectif)} y2={y(objectif)} stroke="#F0A93B" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
        <motion.path d={`${d} L${x(valeurs.length - 1)} ${h} L0 ${h}Z`} fill="url(#aire)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} />
        <motion.path d={d} fill="none" stroke="#3B6FE0" strokeWidth={2} vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }} />
      </svg>
      <span className="objectif" style={{ top: `${(1 - objectif / 100) * 100}%` }}>Objectif {objectif} %</span>
      <span className="valeur-fin" style={{ top: `${(1 - fin / 100) * 100}%` }}>{fin} %</span>
    </div>
  );
}

/** Barres groupées (aujourd'hui en bleu, moyenne en bleu pâle). */
function BarresGroupees({ a, b, etiquettes, hauteur = 90, survol }: { a: number[]; b: number[]; etiquettes: string[]; hauteur?: number; survol?: number }) {
  const max = Math.max(...a, ...b);
  return (
    <div>
      <div className="barres-groupees" style={{ height: hauteur }}>
        {a.map((v, k) => (
          <div key={k} className={`paire ${survol === k ? "survolee" : ""}`}>
            <motion.i className="b" style={{ height: `${(b[k] / max) * 100}%`, originY: 1 }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.2 + k * 0.03 }} />
            <motion.i className="a" style={{ height: `${(v / max) * 100}%`, originY: 1 }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.25 + k * 0.03 }} />
          </div>
        ))}
      </div>
      <div className="axe">{etiquettes.map((e, k) => <span key={k}>{e}</span>)}</div>
    </div>
  );
}

/** Anneau à segments (un segment par niveau), centre chiffré. */
function Anneau({ parts, centre, sous }: { parts: number[]; centre: string; sous: string }) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const total = parts.reduce((s, v) => s + v, 0);
  const tons = ["#AFC3F2", "#3B6FE0", "#1E2A44"];
  let cumul = 0;
  return (
    <div className="anneau">
      <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
        {parts.map((v, k) => {
          const long = (v / total) * c - 3;
          const debut = cumul;
          cumul += (v / total) * c;
          return (
            <motion.circle key={k} cx="50" cy="50" r={r} fill="none" stroke={tons[k]} strokeWidth={9} strokeLinecap="round"
              strokeDasharray={`${long} ${c}`} initial={{ strokeDashoffset: long - debut + c }} animate={{ strokeDashoffset: -debut }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 + k * 0.1 }} />
          );
        })}
      </svg>
      <div className="anneau-texte"><b>{centre}</b><small>{sous}</small></div>
    </div>
  );
}

/* ====================================================================== */
/* Vue Garage                                                              */
/* ====================================================================== */
const ETAPES_DEMO = [
  "Arrivée à l'entrée", "Lecture de la plaque", "Réservation retrouvée", "Montée au niveau 2", "Garé sur la place 222",
  "Session en cours", "Demande de sortie", "Départ · facturé, place libre", "Barrière levée", "Retour à la vue générale",
];

function VueGarage({ demo, setDemo }: { demo: boolean; setDemo: (v: boolean) => void }) {
  const hote = useRef<HTMLDivElement>(null);
  const etiquette = useRef<HTMLDivElement>(null);
  const scene = useRef<ReturnType<typeof creerScene> | null>(null);
  const [niveau, setNiveau] = useState<number | null>(1);
  const [eclate, setEclate] = useState(false);
  const [place, setPlace] = useState<number | null>(222);
  const [etape, setEtape] = useState(7);

  useEffect(() => {
    if (!hote.current || !etiquette.current) return;
    scene.current = creerScene(hote.current, etiquette.current, PLACES, (id) => {
      setPlace(id);
      setNiveau(PLACES.find((p) => p.id === id)!.niveau);
    });
    return () => scene.current?.detruire();
  }, []);
  useEffect(() => { scene.current?.appliquer({ niveau, eclate, place }); }, [niveau, eclate, place]);
  useEffect(() => {
    if (!demo) return;
    const t = setInterval(() => setEtape((e) => (e + 1) % ETAPES_DEMO.length), 2200);
    return () => clearInterval(t);
  }, [demo]);

  const choisie = PLACES.find((p) => p.id === place);
  const duNiveau = PLACES.filter((p) => p.niveau === (niveau ?? 1));
  const compte = (e: Etat, n: number | null) => PLACES.filter((p) => p.etat === e && (n === null || p.niveau === n)).length;

  return (
    <>
      <div className="indicateurs">
        <Indicateur i={0} icone="jauge" titre="Occupation · N2" valeur={`${Math.round((compte("occupee", 1) / 32) * 100)} %`} tendance="→ ±0 pt" ton="gris" details={[["Garées", `${compte("occupee", 1)} sur 32`], ["Hors service", String(compte("hors", 1))]]} />
        <Indicateur i={1} icone="grille" titre="Places libres · N2" valeur={String(compte("libre", 1))} tendance={`◷ ${compte("reservee", 1)} réservées`} ton="ambre" details={[["Recharge libres", "1 sur 2"], ["PMR libres", "1 sur 2"]]} />
        <Indicateur i={2} icone="euro" titre="Recettes du jour · N2" valeur="177 500 F" tendance="→ +0 F/h" ton="vert" details={[["Sessions facturées", "24"], ["En cours", "262 000 F"]]} />
        <Indicateur i={3} icone="horloge" titre="Durée moyenne du jour" valeur="4 h 15" tendance="↘ −2 % vs 7 j" ton="gris" details={[["Plus longue", "22 h 02"], ["Rotation", "1,5 par place"]]} />
      </div>

      <div className="milieu">
        <Carte i={4} className="vue-3d">
          <div className="ligne">
            <span className="groupe"><i className="carre-icone grand"><Icone n="cube" /></i><span><b className="bloc">Garage en direct</b><small className="muet">{niveau === null ? "Trois niveaux · glisser pour tourner" : `${NIVEAUX[niveau].court} isolé · étages supérieurs levés`}</small></span></span>
            <div className="segments">
              <button aria-pressed={niveau === null} onClick={() => { setNiveau(null); setPlace(null); }}>Tous niveaux <i>{compte("libre", null)}</i></button>
              {[2, 1, 0].map((n) => (
                <button key={n} aria-pressed={niveau === n} onClick={() => { setNiveau(n); setPlace(null); }}>{NIVEAUX[n].long.replace(" Niveau 2", "")} <i>{compte("libre", n)}</i></button>
              ))}
            </div>
          </div>
          <div className="toile" ref={hote}>
            <div className="etiquette-place" ref={etiquette} />
            <motion.div className="carte-demo" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.35, ease: EASE }}>
              <div className="ligne muet petit">
                <span>Démo · étape {etape + 1} sur {ETAPES_DEMO.length}</span>
                <span className="groupe">
                  <b>×2</b>
                  <button className="mini" onClick={() => setDemo(!demo)} aria-label={demo ? "Pause" : "Lecture"}><Icone n={demo ? "pause" : "lecture"} taille={12} /></button>
                  <button className="mini" onClick={() => setEtape(0)}><Icone n="reinitialiser" taille={12} /> Réinitialiser</button>
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.b key={etape} className="bloc" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}>{ETAPES_DEMO[etape]}</motion.b>
              </AnimatePresence>
              <div className="progression">{ETAPES_DEMO.map((_, k) => <motion.i key={k} animate={{ backgroundColor: k <= etape ? (k === etape ? "#3B6FE0" : "#1E2A44") : "#E3E6EC" }} transition={{ duration: 0.3 }} />)}</div>
            </motion.div>
            <div className="legende">
              <span><i className="l" /> Libres {compte("libre", niveau)}</span>
              <span><i className="r" /> Réservées {compte("reservee", niveau)}</span>
              <span><i className="o" /> Occupées {compte("occupee", niveau)}</span>
              <span><i className="h" /> Hors service {compte("hors", niveau)}</span>
            </div>
            <div className="commandes-3d">
              <button className="btn" aria-pressed={eclate} onClick={() => setEclate((v) => !v)}><Icone n="couches" taille={14} /> {eclate ? "Regrouper" : "Éclater"}</button>
              <span className="groupe-boutons">
                <button aria-label="Tourner à gauche" onClick={() => scene.current?.tourner(-1)}><Icone n="tourner_g" taille={14} /></button>
                <button aria-label="Recentrer" onClick={() => scene.current?.tourner(0)}><Icone n="centrer" taille={14} /></button>
                <button aria-label="Tourner à droite" onClick={() => scene.current?.tourner(1)}><Icone n="tourner_d" taille={14} /></button>
              </span>
            </div>
          </div>
        </Carte>

        <Carte i={5} className="detail">
          <AnimatePresence mode="wait">
            {choisie ? (
              <motion.div key={choisie.id} className="pile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.3, ease: EASE }}>
                <div className="ligne muet petit"><span>{NIVEAUX[choisie.niveau].court} · rangée {choisie.rang === 0 ? "nord" : "sud"}</span><button className="mini" aria-label="Fermer" onClick={() => setPlace(null)}><Icone n="croix" taille={12} /></button></div>
                <p className="groupe"><span className="numero">{choisie.id}</span><Pastille ton={choisie.etat === "libre" ? "vert" : choisie.etat === "reservee" ? "ambre" : "gris"}>{LIBELLE_ETAT[choisie.etat]}</Pastille></p>
                {choisie.etat === "occupee" ? (
                  <div className="ticket">
                    <p className="groupe"><i className="carre-icone"><Icone n="voiture" taille={12} /></i><span><Plaque texte={choisie.plaque!} /><small className="muet bloc">Berline · bleue · N. Diagne</small></span></p>
                    <div className="details trois"><p><span className="muet">Arrivée</span><b className="mono">09:40</b></p><p><span className="muet">Durée</span><b>2 h 10</b></p><p><span className="muet">À payer</span><b>1 500 F</b></p></div>
                    <button className="btn plein">Clore la session et facturer 1 500 F</button>
                  </div>
                ) : (
                  <div className="ticket"><p className="muet petit">Aucune session sur cette place.</p><button className="btn plein">Enregistrer une arrivée ici</button></div>
                )}
              </motion.div>
            ) : (
              <motion.p key="vide" className="muet petit" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Clique sur une place de la maquette ou du plan.</motion.p>
            )}
          </AnimatePresence>
          <div className="plan-places">
            <p className="ligne petit"><b>Plan des places · {NIVEAUX[niveau ?? 1].court}</b>{choisie && <span className="muet">Place {choisie.id} · {LIBELLE_ETAT[choisie.etat]}</span>}</p>
            <div className="rangee-plan">{duNiveau.filter((p) => p.rang === 0).map((p) => <button key={p.id} title={String(p.id)} className={`case-place ${p.etat} ${p.id === place ? "choisie" : ""}`} onClick={() => { setPlace(p.id); setNiveau(p.niveau); }} />)}</div>
            <p className="allee">ALLÉE</p>
            <div className="rangee-plan">{duNiveau.filter((p) => p.rang === 1).map((p) => <button key={p.id} title={String(p.id)} className={`case-place ${p.etat} ${p.id === place ? "choisie" : ""}`} onClick={() => { setPlace(p.id); setNiveau(p.niveau); }} />)}</div>
          </div>
        </Carte>
      </div>

      <div className="bas-4">
        <Carte i={6}>
          <p className="ligne"><b>Occupation aujourd'hui</b><span className="legende-mini"><i className="bleu" /> Occupé <i className="tirets" /> Objectif</span></p>
          <p className="muet petit">N2 · pic à {Math.round((compte("occupee", 1) / 32) * 100)} % vers 11:00</p>
          <CourbeObjectif valeurs={[18, 20, 22, 30, 42, 50, 55, 62, 66, 70, 72, Math.round((compte("occupee", 1) / 32) * 100)]} objectif={85} />
          <div className="axe">{["00", "02", "04", "06", "08", "10", "12"].map((h) => <span key={h}>{h}:00</span>)}</div>
        </Carte>
        <Carte i={7}>
          <p className="ligne"><b>Durée de stationnement</b><span className="legende-mini"><i className="bleu" /> Aujourd'hui <i className="bleu-pale" /> Moy. 7 j</span></p>
          <p className="muet petit">74 séjours clos aujourd'hui</p>
          <BarresGroupees a={[18, 12, 9, 14, 6, 15]} b={[10, 9, 12, 10, 8, 11]} etiquettes={["<30 min", "1 h", "2 h", "4 h", "8 h", "8 h+"]} />
        </Carte>
        <Carte i={8}>
          <p><b>Usage par niveau</b></p>
          <p className="muet petit">Sessions du jour, closes et en cours</p>
          <div className="ligne">
            <Anneau parts={[41, 48, 49]} centre="138" sous="sessions" />
            <dl className="legende-niveaux">
              <dt><i style={{ background: "#AFC3F2" }} />N3</dt><dd>41</dd><dd className="muet">30 %</dd>
              <dt><i style={{ background: "#3B6FE0" }} />N2</dt><dd>48</dd><dd className="muet">35 %</dd>
              <dt><i style={{ background: "#1E2A44" }} />N1</dt><dd>49</dd><dd className="muet">36 %</dd>
            </dl>
          </div>
        </Carte>
        <Carte i={9}>
          <p className="ligne"><b>Arrivées en direct</b><span className="lien">Tout voir</span></p>
          <p className="muet petit">Derniers véhicules entrés</p>
          {ARRIVEES.map((a, k) => (
            <motion.div key={a.plaque} className="ligne arrivee" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + k * 0.06, duration: 0.3, ease: EASE }}>
              <span className="groupe"><i className="carre-icone"><Icone n="voiture" taille={12} /></i><span><Plaque texte={a.plaque} /><small className="muet bloc">Place {a.place} · {a.quand}</small></span></span>
              <Pastille ton={a.statut === "Garé" ? "bleu" : "vert"}>{a.statut}</Pastille>
            </motion.div>
          ))}
        </Carte>
      </div>
    </>
  );
}

/* ====================================================================== */
/* Vue Sessions                                                            */
/* ====================================================================== */
function VueSessions() {
  const [onglet, setOnglet] = useState("Actives");
  const [niveau, setNiveau] = useState("Tous niveaux");
  const [coches, setCoches] = useState<string[]>([]);
  const lignes = SESSIONS.filter((s) => niveau === "Tous niveaux" || s.niveau === niveau);
  return (
    <>
      <motion.div className="constat" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
        <span className="groupe"><Icone n="ampoule" taille={14} /><span><b>Constat :</b> <b>7 véhicules</b> sont garés depuis hier et ont atteint le plafond journalier. <b>21 000 F</b> seront facturés à leur départ.</span></span>
        <span className="lien">Voir le détail</span>
      </motion.div>
      <div className="indicateurs">
        <Indicateur i={0} icone="chrono" titre="Sessions actives" valeur={String(TOTAL_OCCUPEES)} tendance="↘ −1/h" ton="gris" details={[["Électriques", "13"], ["Depuis hier", "7"]]} />
        <Indicateur i={1} icone="recu" titre="En cours de facturation" valeur="653 000 F" tendance="43 au plafond" ton="ambre" details={[["Moyenne", "10 370 F"], ["Plus longue", "22 h 02"]]} />
        <Indicateur i={2} icone="euro" titre="Facturées aujourd'hui" valeur="75" tendance="→ 101 % d'un jour" ton="gris" details={[["Montant", "482 500 F"], ["Plafond appliqué", "30"]]} />
        <Indicateur i={3} icone="horloge" titre="Durée moyenne du jour" valeur="3 h 40" tendance="↘ −15 % vs 7 j" ton="gris" details={[["Moins de 30 min", "19"], ["8 h ou plus", "15"]]} />
      </div>
      <div className="milieu">
        <Carte i={4} className="table-sessions">
          <div className="ligne">
            <span className="groupe">
              <span className="segments">{[["Actives", TOTAL_OCCUPEES], ["Clôturées", 593], ["Toutes", 593 + TOTAL_OCCUPEES]].map(([l, n]) => <button key={l} aria-pressed={onglet === l} onClick={() => setOnglet(String(l))}>{l} <i>{n}</i></button>)}</span>
              {["Tous niveaux", "N1", "N2", "N3"].map((n) => <button key={n} className={`puce-niveau ${niveau === n ? "active" : ""}`} onClick={() => setNiveau(n)}>{n}</button>)}
            </span>
            <span className="champ"><Icone n="loupe" taille={14} /> Plaque, place, nom, facture</span>
          </div>
          <div className="sessions-cols entete">
            <span><input type="checkbox" aria-label="Tout cocher" checked={coches.length === lignes.length && lignes.length > 0} onChange={(e) => setCoches(e.target.checked ? lignes.map((l) => l.plaque) : [])} /></span>
            <span>Véhicule</span><span>Place</span><span className="groupe">Arrivée <Icone n="tri" taille={10} /></span><span className="groupe fort">Durée <Icone n="tri" taille={10} /></span><span>Statut</span><span className="droite">Montant</span><span />
          </div>
          {lignes.map((s, k) => (
            <motion.div key={s.plaque} layout className={`sessions-cols rangee ${coches.includes(s.plaque) ? "cochee" : ""}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + k * 0.03, duration: 0.3, ease: EASE }}>
              <span><input type="checkbox" aria-label={`Choisir ${s.plaque}`} checked={coches.includes(s.plaque)} onChange={() => setCoches(coches.includes(s.plaque) ? coches.filter((c) => c !== s.plaque) : [...coches, s.plaque])} /></span>
              <span className="groupe"><i className="carre-icone"><Icone n="voiture" taille={12} /></i><span><Plaque texte={s.plaque} /><small className="muet bloc">{s.type}</small></span></span>
              <span><b>{s.place}</b> <small className="muet">{s.niveau}</small></span>
              <span className="mono">{s.arrivee}{s.hier && <small className="muet"> hier</small>}</span>
              <span className="duree"><b>{s.duree}</b><i style={{ width: `${Math.min(100, (s.heures / 22) * 100)}%` }} className={s.plafond ? "ambre" : ""} /></span>
              <span>{s.plafond ? <Pastille ton="ambre">Au plafond</Pastille> : <Pastille ton="bleu">En cours</Pastille>}</span>
              <span className="droite">{s.montant}</span>
              <span className="muet"><Icone n="points" taille={14} /></span>
            </motion.div>
          ))}
        </Carte>
        <div className="colonne-droite">
          <Carte i={5}>
            <p className="groupe"><i className="carre-icone grand"><Icone n="tri" /></i><span><b className="bloc">Trafic du jour</b><small className="muet">116 arrivées · 75 départs depuis 00:00</small></span></p>
            <BarresGroupees a={[2, 3, 2, 4, 5, 9, 14, 18, 12, 8, 6, 0]} b={[1, 2, 1, 3, 3, 5, 8, 11, 9, 7, 5, 1]} etiquettes={["00", "", "02", "", "04", "", "06", "", "08", "", "10", "11"]} hauteur={110} />
            <p className="ligne petit"><span className="legende-mini"><i className="bleu" /> Arrivées <i className="bleu-pale" /> Départs (facturés)</span><span className="muet">Cette heure : 0 arrivée · 1 départ</span></p>
          </Carte>
          <Carte i={6}>
            <div className="ligne"><span className="groupe"><i className="carre-icone grand"><Icone n="etiquette" /></i><span><b className="bloc">Tarif actuel · v2</b><small className="muet">Appliqué à chaque session close</small></span></span><span className="lien">Modifier →</span></div>
            <div className="tuiles">
              {TUILES_TARIF.map(([ic, l, v]) => (
                <div key={l} className="tuile"><span className="muet petit groupe"><Icone n={ic} taille={12} />{l}</span><b>{v}</b></div>
              ))}
            </div>
            <p className="muet petit">Le temps compte en minutes entamées ; chaque période entamée est facturée en entier, montants arrondis au franc près.</p>
          </Carte>
        </div>
      </div>
    </>
  );
}

/* ====================================================================== */
/* Vue Réservations                                                        */
/* ====================================================================== */
const DEBUT = 6;
const FIN = 22;
const MAINTENANT = 11 + 50 / 60;
function VueReservations({ onCreer }: { onCreer: (texte: string) => void }) {
  const [jour, setJour] = useState("Aujourd'hui");
  const [niveau, setNiveau] = useState("N2");
  const [plaque, setPlaque] = useState("");
  const pos = (h: number) => `${((h - DEBUT) / (FIN - DEBUT)) * 100}%`;
  return (
    <>
      <div className="indicateurs">
        <Indicateur i={0} icone="calendrier" titre="Réservations du jour" valeur="15" tendance="0 demain" ton="gris" details={[["Arrivées", "1"], ["Réservées d'avance", "19 h en moy."]]} />
        <Indicateur i={1} icone="horloge" titre="Place tenue maintenant" valeur="1" tendance="⚠ 1 en retard" ton="rouge" details={[["Tenues à l'heure", "0"], ["Absents du jour", "5"]]} />
        <Indicateur i={2} icone="entree" titre="Arrivées dans 2 h" valeur="4" tendance="prochaine 12:10" ton="bleu" details={[["Suivante", "D. Sène"], ["Place", "121"]]} />
        <Indicateur i={3} icone="sablier" titre="Heures-places réservées" valeur="45 h" tendance="moy. 3 h 00" ton="gris" details={[["Plus longue", "8 h 00"], ["Part de la capacité", "3 %"]]} />
      </div>
      <div className="milieu">
        <Carte i={4} className="chronologie">
          <div className="ligne">
            <span className="groupe"><i className="carre-icone grand"><Icone n="calendrier" /></i><span><b className="bloc">Chronologie des places</b><small className="muet">{niveau} · {jour.toLowerCase()} · cliquer une ligne pour réserver la place</small></span></span>
            <span className="groupe">
              <span className="segments">{["Aujourd'hui", "Demain"].map((j) => <button key={j} aria-pressed={jour === j} onClick={() => setJour(j)}>{j}</button>)}</span>
              <span className="segments">{["N3", "N2", "N1"].map((n) => <button key={n} aria-pressed={niveau === n} onClick={() => setNiveau(n)}>{n}</button>)}</span>
            </span>
          </div>
          <div className="ligne petit muet">
            <span>Places réservées par heure</span>
            <span className="legende-mini"><i className="bleu" /> À venir <i className="ambre" /> Tenue <i className="rouge" /> En retard <i className="vert" /> Arrivée <i className="hachure" /> Absent <i className="gris" /> Garé</span>
          </div>
          <div className="frise">
            <div className="heures">
              {Array.from({ length: (FIN - DEBUT) / 2 + 1 }, (_, k) => <span key={k} style={{ left: pos(DEBUT + k * 2) }}>{String(DEBUT + k * 2).padStart(2, "0")}</span>)}
              <span className="maintenant" style={{ left: pos(MAINTENANT) }}>11:50</span>
            </div>
            <div className="densite">{DENSITE.map((o, k) => <i key={k} style={{ left: pos(DEBUT + k), opacity: o }} />)}</div>
            <div className="lignes-frise">
              <motion.i className="trait-maintenant" style={{ left: `calc(44px + (100% - 44px) * ${(MAINTENANT - DEBUT) / (FIN - DEBUT)})` }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.6, ease: EASE, delay: 0.3 }} />
              {FRISE.map((r, k) => (
                <div key={r.place} className={`rangee-frise ${r.place === 222 ? "active" : ""}`} onClick={() => onCreer(`Place ${r.place} choisie dans le formulaire`)}>
                  <span className="mono">{r.place}</span>
                  <div className="piste-frise">
                    {r.blocs.map(([d, f, t, nom], j) => (
                      <motion.i key={j} className={`bloc-frise ${t}`} style={{ left: pos(d), width: `calc(${pos(f)} - ${pos(d)})`, originX: 0 }}
                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 + k * 0.02 }}>
                        {nom && <span>{nom}</span>}
                      </motion.i>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Carte>
        <div className="colonne-droite">
          <Carte i={5} className="formulaire">
            <p className="groupe"><i className="carre-icone grand"><Icone n="calendrier" /></i><span><b className="bloc">Nouvelle réservation</b><small className="muet">Place tenue de 15 min avant à 15 min après</small></span></p>
            <div className="champs">
              <label>Place<select defaultValue="222">{[221, 222, 223].map((p) => <option key={p}>{p}</option>)}</select></label>
              <label>Jour<select><option>Aujourd'hui</option><option>Demain</option></select></label>
              <label>De<select defaultValue="12:30"><option>12:30</option><option>13:00</option></select></label>
              <label>À<select defaultValue="14:30"><option>14:30</option><option>15:00</option></select></label>
              <label>Plaque<input value={plaque} onChange={(e) => setPlaque(e.target.value.toUpperCase())} placeholder="DK 4821" /></label>
              <label>Nom<input placeholder="Nom ou entreprise" /></label>
            </div>
            <div className="groupe petit"><label className="groupe"><input type="checkbox" /> Véhicule électrique</label><label className="groupe"><input type="checkbox" /> Badge PMR</label></div>
            <button className="btn plein" onClick={() => onCreer(`Réservation créée · place 222, ${plaque || "DK 4821"}, 12:30–14:30`)}>Créer la réservation</button>
          </Carte>
          <Carte i={6}>
            <p><b>Aujourd'hui · 15 réservations</b></p>
            <p className="muet petit">Triées par heure de début</p>
            {RESA_JOUR.map((r) => (
              <div key={r.nom} className="ligne petit resa">
                <span className="groupe"><i className="rond-icone"><Icone n="personne" taille={12} /></i><span><b className="bloc">{r.nom}</b><small className="muet mono">{r.place} · {r.creneau}</small></span></span>
                <Pastille ton={r.statut === "Absent" ? "gris" : "vert"}>{r.statut}</Pastille>
              </div>
            ))}
          </Carte>
        </div>
      </div>
    </>
  );
}

/* ====================================================================== */
/* Vue Recettes                                                            */
/* ====================================================================== */
function VueRecettes() {
  const [survol, setSurvol] = useState(7);
  return (
    <>
      <div className="indicateurs">
        <Indicateur i={0} icone="euro" titre="Recettes · aujourd'hui" valeur="482 500 F" tendance="↗ +6 200 F/h" ton="vert" details={[["Jour type (7 j)", "515 000 F"], ["Par place", "5 030 F"]]} />
        <Indicateur i={1} icone="recu" titre="Sessions facturées" valeur="75" tendance="+1 dernière heure" ton="bleu" details={[["Jour type (7 j)", "74"], ["Par place", "0,8"]]} />
        <Indicateur i={2} icone="etiquette" titre="Ticket moyen" valeur="6 430 F" tendance="↘ −8 % vs 7 j" ton="rouge" details={[["Médiane", "5 500 F"], ["Plus élevé", "12 000 F"]]} />
        <Indicateur i={3} icone="sablier" titre="Plafond journalier atteint" valeur="40 %" tendance="30 séjours" ton="ambre" details={[["Du fait du plafond", "354 000 F"], ["Habituel (7 j)", "48 %"]]} />
      </div>
      <div className="milieu">
        <Carte i={4} className="recettes-heure">
          <div className="ligne"><span className="groupe"><i className="carre-icone grand"><Icone n="graphique" /></i><span><b className="bloc">Recettes par heure</b><small className="muet">Aujourd'hui, à côté de la moyenne des sept jours précédents · meilleure heure 07:00</small></span></span><span className="legende-mini"><i className="bleu" /> Aujourd'hui <i className="bleu-pale" /> Moy. 7 j</span></div>
          <p className="groupe"><span className="valeur">482 500 F</span><span className="muet petit">75 sessions · aujourd'hui</span></p>
          <div className="zone-heures" onMouseLeave={() => setSurvol(7)}>
            <BarresGroupees a={RECETTES_H} b={MOYENNE_H} etiquettes={RECETTES_H.map((_, k) => (k % 3 === 0 ? String(k).padStart(2, "0") : ""))} hauteur={150} survol={survol} />
            <div className="cibles-heures">{RECETTES_H.map((_, k) => <i key={k} onMouseEnter={() => setSurvol(k)} />)}</div>
            <motion.div className="bulle" animate={{ left: `${(survol / RECETTES_H.length) * 100}%` }} transition={{ duration: 0.2, ease: EASE }}>
              <b className="bloc">{String(survol).padStart(2, "0")}:00–{String(survol + 1).padStart(2, "0")}:00</b>
              <small className="muet bloc">{Math.round(RECETTES_H[survol] / 7.7)} sessions facturées</small>
              <span className="ligne"><span className="muet">○ Moy. 7 j</span><b>{(MOYENNE_H[survol] * 1000).toLocaleString("fr-FR")} F</b></span>
              <span className="ligne"><span className="bleu-texte">● Aujourd'hui</span><b>{(RECETTES_H[survol] * 1000).toLocaleString("fr-FR")} F</b></span>
            </motion.div>
          </div>
        </Carte>
        <div className="colonne-droite">
          <Carte i={5}>
            <p className="groupe"><i className="carre-icone grand"><Icone n="couches" /></i><span><b className="bloc">Recettes par niveau</b><small className="muet">Aujourd'hui</small></span></p>
            <div className="centre-anneau"><Anneau parts={[178, 186, 119]} centre="482 500 F" sous="75 sessions" /></div>
            {RECETTES_NIVEAUX.map(([c, n, v, p, d]) => (
              <div key={n} className="ligne niveau-recette"><span><span className="groupe petit"><i className="point" style={{ background: c }} />{n}</span><small className="muet bloc">{d}</small></span><span className="groupe petit"><b>{v}</b><span className="muet">{p}</span></span></div>
            ))}
          </Carte>
        </div>
      </div>
      <div className="milieu">
        <Carte i={6}>
          <div className="ligne"><span className="groupe"><i className="carre-icone grand"><Icone n="horloge" /></i><span><b className="bloc">Sessions closes</b><small className="muet">75 résultats · aujourd'hui · la même liste que Sessions → Clôturées</small></span></span><span className="champ"><Icone n="loupe" taille={14} /> Plaque, place, facture</span></div>
          <div className="closes-cols entete"><span>Facturée</span><span>Véhicule</span><span>Place</span><span>Durée</span><span>Facture</span><span>Tarif</span><span className="droite">Montant</span></div>
          {CLOSES.map((c) => (
            <div key={c.facture} className="closes-cols rangee">
              <span className="mono muet">{c.heure}</span>
              <span className="groupe"><i className="carre-icone"><Icone n="voiture" taille={12} /></i><Plaque texte={c.plaque} /></span>
              <span><b>{c.place}</b> <small className="muet">{c.niveau}</small></span>
              <span>{c.duree}</span>
              <span className="mono muet">{c.facture}</span>
              <span><i className="version">v2</i></span>
              <span className="droite"><b>{c.montant}</b></span>
            </div>
          ))}
        </Carte>
        <div className="colonne-droite">
          <Carte i={7} className="formulaire">
            <div className="ligne"><span className="groupe"><i className="carre-icone grand"><Icone n="etiquette" /></i><span><b className="bloc">Tarif</b><small className="muet">v2 depuis dim. 1 nov. · FCFA</small></span></span><Pastille ton="vert">En vigueur</Pastille></div>
            <div className="champs">
              <label>Prix par période (F)<input defaultValue="150" inputMode="numeric" /></label>
              <label>Période<select defaultValue="15 min"><option>15 min</option><option>30 min</option><option>1 h</option></select></label>
              <label>Période gratuite (min)<input defaultValue="10" inputMode="numeric" /></label>
              <label>Plafond journalier (F)<input defaultValue="3000" inputMode="numeric" /></label>
            </div>
          </Carte>
        </div>
      </div>
    </>
  );
}

const PLAQUES = ["DK-2614-AB", "TH-3825-C", "DK-4873-BF", "ZG-1055-A", "SL-7720-D"];
// 96 places : 3 niveaux × 2 rangées × 16 places, numérotées 101–132, 201–232, 301–332
const PLACES: Place[] = Array.from({ length: 96 }, (_, k) => {
  const niveau = Math.floor(k / 32);
  const i = k % 32;
  const graine = (k * 37 + 11) % 10;
  const id = (niveau + 1) * 100 + i + 1;
  const etat: Etat = id === 222 ? "occupee" : [109, 217, 326].includes(id) ? "hors" : graine < 7 ? "occupee" : graine < 8 ? "reservee" : "libre";
  return { id, niveau, rang: (i < 16 ? 0 : 1) as 0 | 1, col: i % 16, etat, plaque: etat === "occupee" ? PLAQUES[k % PLAQUES.length] : undefined };
});
const TOTAL_OCCUPEES = PLACES.filter((p) => p.etat === "occupee").length;
const TOTAL_LIBRES = PLACES.filter((p) => p.etat === "libre").length;
const REMPLISSAGE = Math.round((TOTAL_OCCUPEES / PLACES.length) * 100);

/* ====================================================================== */
/* Coquille                                                                */
/* ====================================================================== */
const MENU: { id: Vue; libelle: string; icone: NomIcone; compte?: number }[] = [
  { id: "garage", libelle: "Garage", icone: "grille" },
  { id: "sessions", libelle: "Sessions", icone: "chrono", compte: TOTAL_OCCUPEES },
  { id: "reservations", libelle: "Réservations", icone: "calendrier", compte: 10 },
  { id: "recettes", libelle: "Recettes", icone: "recu" },
];
const TITRES: Record<Vue, [string, ReactNode]> = {
  garage: ["Garage", <>Parking Plateau, Dakar · {PLACES.length} places sur 3 niveaux · <b>{TOTAL_LIBRES} libres</b> en ce moment</>],
  sessions: ["Sessions", <><b>{TOTAL_OCCUPEES} véhicules</b> garés maintenant · 653 000 F en cours · 75 facturées aujourd'hui</>],
  reservations: ["Réservations", <><b>15 réservations aujourd'hui</b> · 1 place tenue · 1 en retard</>],
  recettes: ["Recettes", <>Sessions closes, comptées au moment de leur facturation</>],
};

export default function TableauParking() {
  const [vue, setVue] = useState<Vue>("garage");
  const [demo, setDemo] = useState(true);
  const [vitesse, setVitesse] = useState("×1");
  const [toast, setToast] = useState<string | null>(null);
  const notifier = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 3000);
  };
  const actions: Record<Vue, [NomIcone, string]> = {
    garage: [demo ? "pause" : "lecture", demo ? "Mettre la démo en pause" : "Reprendre la démo"],
    sessions: ["entree", "Enregistrer une arrivée"],
    reservations: ["plus", "Nouvelle réservation"],
    recettes: ["telecharger", "Exporter le rapport"],
  };
  const [iconeAction, texteAction] = actions[vue];

  return (
    <MotionConfig reducedMotion="user">
      <div className="parking">
        <style>{CSS}</style>
        <aside className="barre-laterale">
          <div className="ligne">
            <span className="groupe"><span className="logo"><Icone n="logo" taille={14} /></span><span><b className="bloc">Parking Plateau</b><small className="muet">Exploitation du parking</small></span></span>
            <button className="mini" aria-label="Replier"><Icone n="replier" taille={14} /></button>
          </div>
          <span className="recherche"><Icone n="loupe" taille={14} /> Place, plaque… <kbd>⌘K</kbd></span>
          <p className="muet petit titre-section">Menu principal</p>
          {MENU.map((m) => (
            <button key={m.id} className="menu" aria-pressed={vue === m.id} onClick={() => setVue(m.id)}>
              {vue === m.id && <motion.span layoutId="menu-actif" className="menu-actif" transition={{ duration: 0.3, ease: EASE }} />}
              <span className="menu-contenu"><Icone n={m.icone} taille={14} />{m.libelle}{m.compte !== undefined && <i className="compte">{m.compte}</i>}</span>
            </button>
          ))}
          <p className="muet petit titre-section">Opérations</p>
          <button className="menu" onClick={() => setDemo(!demo)}><span className="menu-contenu"><Icone n="lecture" taille={14} />{demo ? "Démo en cours…" : "Lancer la démo"}</span></button>
          <button className="menu"><span className="menu-contenu"><Icone n="interdit" taille={14} />Hors service<i className="compte">3</i></span></button>
          <button className="menu"><span className="menu-contenu"><Icone n="etiquette" taille={14} />Tarif<i className="compte">v2</i></span></button>
          <div className="encart"><Icone n="info" taille={12} /> Données de démonstration, simulées dans le navigateur. Aucune barrière, aucun capteur ni paiement n'est connecté.</div>
          <button className="menu"><span className="menu-contenu"><Icone n="clavier" taille={14} />Raccourcis clavier</span></button>
          <button className="menu"><span className="menu-contenu"><Icone n="reinitialiser" taille={14} />Réinitialiser la démo</span></button>
          <div className="remplissage">
            <p className="ligne petit"><b>Parking Plateau</b><span className="bleu-texte">{REMPLISSAGE} %</span></p>
            <p className="muet petit">{TOTAL_OCCUPEES} sur {PLACES.length} places · du RDC au toit</p>
            <div className="piste"><motion.i initial={{ width: 0 }} animate={{ width: `${REMPLISSAGE}%` }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }} /></div>
          </div>
          <div className="ligne utilisateur">
            <span className="groupe"><i className="avatar">AS</i><span><b className="bloc petit">Aminata Sarr</b><small className="muet">Chef d'équipe · 06:00–14:00</small></span></span>
            <Icone n="bas" taille={12} />
          </div>
        </aside>

        <main>
          <header className="ligne">
            <div><h1>{TITRES[vue][0]}</h1><p className="muet petit">{TITRES[vue][1]}</p></div>
            <span className="groupe">
              {vue === "recettes" && <span className="segments">{["Aujourd'hui", "7 derniers jours", "Mois en cours"].map((p, k) => <button key={p} aria-pressed={k === 0}>{p}</button>)}</span>}
              <span className="horloge"><Icone n="horloge" taille={12} /> mar. 3 nov. <b className="mono">11:50</b>
                {["×1", "×10", "×60"].map((v) => <button key={v} className={`vitesse ${vitesse === v ? "active" : ""}`} onClick={() => setVitesse(v)}>{v}</button>)}
                <Icone n="pause" taille={12} />
              </span>
              <button className="carre-bouton" aria-label="Alertes"><Icone n="cloche" taille={14} /><i className="point-rouge" /></button>
              <button className="carre-bouton" aria-label="Télécharger"><Icone n="telecharger" taille={14} /></button>
              <button className={`btn ${vue === "garage" ? "" : "plein"}`} onClick={() => (vue === "garage" ? setDemo(!demo) : notifier(texteAction))}><Icone n={iconeAction} taille={14} /> {texteAction}</button>
            </span>
          </header>
          <AnimatePresence mode="wait">
            <motion.div key={vue} className="contenu" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
              {vue === "garage" && <VueGarage demo={demo} setDemo={setDemo} />}
              {vue === "sessions" && <VueSessions />}
              {vue === "reservations" && <VueReservations onCreer={notifier} />}
              {vue === "recettes" && <VueRecettes />}
            </motion.div>
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {toast && (
            <motion.div className="toast" role="status" initial={{ opacity: 0, y: 24, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 24, x: "-50%" }} transition={{ duration: 0.35, ease: EASE }}>
              {toast}
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
const LIBELLE_ETAT: Record<Etat, string> = { libre: "Libre", reservee: "Réservée", occupee: "Occupée", hors: "Hors service" };
const ARRIVEES = [
  { plaque: "DK-2614-AB", place: 127, quand: "il y a 2 min", statut: "Garé" },
  { plaque: "TH-3825-C", place: 319, quand: "il y a 24 min", statut: "Garé" },
  { plaque: "DK-4873-BF", place: 208, quand: "il y a 35 min", statut: "Parti" },
];
const SESSIONS = [
  { plaque: "DK-4436-AF", type: "SUV · argent", place: 202, niveau: "N2", arrivee: "13:48", hier: true, duree: "22 h 02", heures: 22, plafond: true, montant: "3 000 F" },
  { plaque: "TH-9421-B", type: "SUV · noir", place: 130, niveau: "N1", arrivee: "15:03", hier: true, duree: "20 h 47", heures: 20.8, plafond: true, montant: "3 000 F" },
  { plaque: "DK-3474-C", type: "Fourgonnette · graphite", place: 108, niveau: "N1", arrivee: "15:57", hier: true, duree: "19 h 53", heures: 19.9, plafond: true, montant: "3 000 F" },
  { plaque: "SL-7596-A", type: "Berline · noire", place: 219, niveau: "N2", arrivee: "16:23", hier: true, duree: "19 h 27", heures: 19.5, plafond: true, montant: "3 000 F" },
  { plaque: "DK-7495-D", type: "SUV · blanc", place: 213, niveau: "N2", arrivee: "17:40", hier: true, duree: "18 h 10", heures: 18.2, plafond: true, montant: "3 000 F" },
  { plaque: "ZG-3420-A", type: "Berline · blanche", place: 104, niveau: "N1", arrivee: "19:10", hier: true, duree: "16 h 40", heures: 16.7, plafond: true, montant: "3 000 F" },
  { plaque: "DK-4525-B", type: "Citadine · bleue", place: 122, niveau: "N1", arrivee: "06:31", hier: false, duree: "5 h 19", heures: 5.3, plafond: false, montant: "3 000 F" },
  { plaque: "TH-5441-C", type: "Berline · grise", place: 318, niveau: "N3", arrivee: "06:33", hier: false, duree: "5 h 17", heures: 5.3, plafond: false, montant: "3 000 F" },
];
const TUILES_TARIF: [NomIcone, string, string][] = [
  ["chrono", "Par période entamée", "150 F / 15 min"],
  ["horloge", "Gratuit à l'arrivée", "10 min"],
  ["etiquette", "Plafond journalier", "3 000 F"],
  ["euro", "Devise", "FCFA"],
];
type TypeBloc = "avenir" | "tenue" | "retard" | "arrivee" | "absent" | "gare";
const FRISE: { place: number; blocs: [number, number, TypeBloc, string?][] }[] = Array.from({ length: 16 }, (_, k) => {
  const place = 215 + k;
  const blocs: [number, number, TypeBloc, string?][] = [[6, 8 + (k % 4), "gare"]];
  if (k % 3 === 0) blocs.push([9 + (k % 2), 11, "arrivee"]);
  if (place === 222) blocs.push([9.75, 12.75, "tenue", "N. Diagne"]);
  if (k === 2) blocs.push([8, 22, "absent"]);
  if (k % 4 === 1) blocs.push([12.5, 14.5, "avenir"]);
  if (k === 9) blocs.push([11, 12.2, "retard", "Café Ndar"]);
  return { place, blocs };
});
const DENSITE = [0, 0, 0.3, 0.5, 0.8, 1, 1, 0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0, 0, 0];
const RESA_JOUR = [
  { nom: "S. Faye", place: 131, creneau: "09:20–17:20", statut: "Absent" },
  { nom: "C. Mendy", place: 304, creneau: "09:35–11:35", statut: "Absent" },
  { nom: "N. Diagne", place: 222, creneau: "09:45–12:45", statut: "Arrivé" },
];
const RECETTES_H = [5, 3, 2, 2, 4, 9, 61, 177, 120, 38, 22, 9, 6, 4, 3, 2, 2, 1, 1, 1, 0, 0, 0, 0];
const MOYENNE_H = [6, 4, 3, 3, 8, 18, 44, 48, 52, 40, 30, 22, 20, 18, 16, 15, 16, 18, 14, 10, 8, 6, 5, 4];
const RECETTES_NIVEAUX: [string, string, string, string, string][] = [
  ["#AFC3F2", "N3 · Toit", "178 000 F", "37 %", "26 sessions · 6 850 F en moy."],
  ["#3B6FE0", "N2 · Niveau 2", "185 500 F", "38 %", "25 sessions · 7 420 F en moy."],
  ["#1E2A44", "N1 · Rez-de-chaussée", "119 000 F", "25 %", "24 sessions · 4 960 F en moy."],
];
const CLOSES = [
  { heure: "11:50", plaque: "DK-2614-AB", place: 222, niveau: "N2", duree: "2 h 10", facture: "FQ-261103-0892", montant: "1 500 F" },
  { heure: "09:34", plaque: "DK-4873-BF", place: 319, niveau: "N3", duree: "24 min", facture: "FQ-261103-0891", montant: "300 F" },
  { heure: "09:12", plaque: "ZG-1055-A", place: 115, niveau: "N1", duree: "1 h 05", facture: "FQ-261103-0890", montant: "750 F" },
];

/* ====================================================================== */
/* Styles (tokens dans style.md)                                           */
/* ====================================================================== */
const CSS = `
.parking{--fond:#F4F5F7;--carte:#FFFFFF;--encre:#141A26;--muet:#8A909C;--trait:#E7E9EE;--marine:#1E2A44;--bleu:#3B6FE0;--bleu-pale:#C9D6F5;
--vert:#E3F2E8;--vert-texte:#2F7A4C;--ambre:#FBF0D2;--ambre-texte:#9A6A0B;--rouge:#FBE4E1;--rouge-texte:#B5412F;--r:16px;
font-family:"Geist","Inter Tight",system-ui,sans-serif;color:var(--encre);background:var(--fond);border-radius:24px;
display:grid;grid-template-columns:230px 1fr;min-height:900px;font-size:12px;overflow:hidden;position:relative}
.parking *{box-sizing:border-box}.parking p,.parking h1,.parking dl{margin:0}.parking button{font:inherit;color:inherit}
.muet{color:var(--muet)}.petit{font-size:11px}.bloc{display:block}.droite{text-align:right}.mono{font-family:ui-monospace,"SF Mono",monospace;font-size:11px}.fort{color:var(--encre)}
.bleu-texte{color:var(--bleu)}
.ligne{display:flex;align-items:center;justify-content:space-between;gap:10px}
.groupe{display:inline-flex;align-items:center;gap:8px}
.barre-laterale{background:var(--carte);padding:16px 12px;display:flex;flex-direction:column;gap:4px;border-right:1px solid var(--trait)}
.logo{width:30px;height:30px;border-radius:8px;background:var(--marine);color:#fff;display:grid;place-items:center}
.mini{border:0;background:none;cursor:pointer;color:var(--muet);display:inline-flex;align-items:center;gap:4px;padding:2px;font-size:11px}
.recherche{display:flex;align-items:center;gap:8px;border:1px solid var(--trait);border-radius:10px;padding:8px 10px;color:var(--muet);margin:10px 0 6px}
.recherche kbd{margin-left:auto;font-family:inherit;font-size:10px;background:var(--fond);border-radius:4px;padding:1px 5px}
.titre-section{margin:10px 4px 4px}
.menu{position:relative;border:0;background:none;text-align:left;padding:8px 10px;border-radius:10px;cursor:pointer}
.menu[aria-pressed=true]{color:#fff}
.menu-actif{position:absolute;inset:0;background:var(--marine);border-radius:10px}
.menu-contenu{position:relative;display:flex;align-items:center;gap:10px}
.compte{margin-left:auto;font-style:normal;font-size:10px;color:var(--muet)}
.menu[aria-pressed=true] .compte{background:rgba(255,255,255,.15);color:#fff;border-radius:6px;padding:0 6px}
.encart{margin-top:auto;background:var(--fond);border-radius:10px;padding:10px;font-size:10px;color:var(--muet);line-height:1.5}
.remplissage{background:var(--fond);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:5px;margin-top:6px}
.piste{height:5px;background:var(--trait);border-radius:999px;overflow:hidden}.piste i{display:block;height:100%;background:var(--bleu)}
.utilisateur{padding:8px 4px 0}
.avatar{width:30px;height:30px;border-radius:50%;background:#E8D9C9;display:grid;place-items:center;font-style:normal;font-size:10px}
.parking main{padding:18px 20px;display:flex;flex-direction:column;gap:12px;min-width:0}
.contenu{display:flex;flex-direction:column;gap:12px}
.parking h1{font-size:22px;font-weight:600;letter-spacing:-.02em}
.horloge{display:inline-flex;align-items:center;gap:6px;background:var(--carte);border:1px solid var(--trait);border-radius:10px;padding:6px 10px;white-space:nowrap}
.vitesse{border:0;background:none;cursor:pointer;font-size:10px;color:var(--muet);padding:1px 4px;border-radius:4px}.vitesse.active{background:var(--fond);color:var(--encre)}
.carre-bouton{position:relative;width:32px;height:32px;border-radius:10px;border:1px solid var(--trait);background:var(--carte);display:grid;place-items:center;cursor:pointer;flex:none}
.point-rouge{position:absolute;top:6px;right:7px;width:5px;height:5px;border-radius:50%;background:#E5484D}
.btn{border:1px solid var(--trait);background:var(--carte);border-radius:10px;padding:8px 12px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.btn.plein,.btn[aria-pressed=true]{background:var(--marine);color:#fff;border-color:var(--marine)}
.btn.plein{justify-content:center}
.indicateurs{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.carte{background:var(--carte);border:1px solid var(--trait);border-radius:var(--r);padding:14px;display:flex;flex-direction:column;gap:8px;min-width:0}
.carre-icone{width:20px;height:20px;border-radius:6px;background:var(--fond);display:inline-grid;place-items:center;font-style:normal;flex:none;color:var(--encre)}
.carre-icone.grand{width:28px;height:28px;border-radius:8px}
.rond-icone{width:24px;height:24px;border-radius:50%;background:var(--fond);display:inline-grid;place-items:center;font-style:normal}
.parking .valeur{font-size:26px;font-weight:600;letter-spacing:-.02em}
.tendance{font-size:10px;border-radius:999px;padding:2px 8px;white-space:nowrap;background:var(--fond)}
.tendance.vert,.pastille.vert{background:var(--vert);color:var(--vert-texte)}.tendance.ambre,.pastille.ambre{background:var(--ambre);color:var(--ambre-texte)}
.tendance.rouge{background:var(--rouge);color:var(--rouge-texte)}.tendance.bleu,.pastille.bleu{background:#E8EEFB;color:var(--bleu)}
.pastille{font-size:10px;border-radius:999px;padding:2px 8px;background:var(--fond);white-space:nowrap}
.details{display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;font-size:11px}.details p{display:flex;flex-direction:column}
.details.trois{grid-template-columns:repeat(3,1fr)}
.milieu{display:grid;grid-template-columns:1fr 290px;gap:12px}
.colonne-droite{display:flex;flex-direction:column;gap:12px;min-width:0}
.segments{display:inline-flex;gap:2px;background:var(--fond);border-radius:10px;padding:3px}
.segments button{border:0;background:none;border-radius:8px;padding:5px 9px;font-size:11px;cursor:pointer;color:var(--muet);white-space:nowrap}
.segments button i{font-style:normal;font-size:10px;margin-left:3px}
.segments button[aria-pressed=true]{background:var(--carte);color:var(--encre);box-shadow:0 1px 3px rgba(0,0,0,.08)}
.toile{position:relative;height:340px;border-radius:12px;overflow:hidden;background:linear-gradient(#EEF0F4,#E4E7EC);cursor:grab;touch-action:none}
.toile canvas{display:block}
.etiquette-place{position:absolute;left:0;top:0;background:var(--bleu);color:#fff;font-size:10px;font-weight:600;border-radius:6px;padding:2px 7px;pointer-events:none;transition:opacity .2s}
.carte-demo{position:absolute;top:12px;right:12px;width:290px;background:rgba(255,255,255,.95);border-radius:12px;padding:10px 12px;box-shadow:0 8px 24px rgba(20,26,38,.12);display:flex;flex-direction:column;gap:6px}
.carte-demo .ligne>span:first-child{white-space:nowrap}
.progression{display:flex;gap:3px}.progression i{flex:1;height:4px;border-radius:999px}
.legende{position:absolute;left:12px;bottom:12px;display:flex;gap:8px;background:rgba(255,255,255,.95);border-radius:10px;padding:6px 8px;font-size:10px}
.legende i{display:inline-block;width:9px;height:9px;border-radius:3px;vertical-align:-1px;margin-right:3px}
.legende .l{background:#BFE0C9}.legende .r{background:#F3D58A}.legende .o{background:#D9DCE3}.legende .h{background:#9AA0AA}
.commandes-3d{position:absolute;right:12px;bottom:12px;display:flex;gap:8px}
.groupe-boutons{display:inline-flex;background:var(--carte);border:1px solid var(--trait);border-radius:10px}
.groupe-boutons button{border:0;background:none;width:30px;height:30px;display:grid;place-items:center;cursor:pointer}
.detail .pile{display:flex;flex-direction:column;gap:8px}
.numero{font-size:26px;font-weight:600}
.ticket{background:var(--fond);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px}
.plaque{font-family:ui-monospace,monospace;font-weight:600;font-size:11px;letter-spacing:.06em;background:#fff;border:1px solid var(--trait);border-radius:5px;padding:1px 6px;display:inline-block}
.plan-places{border-top:1px solid var(--trait);padding-top:10px;display:flex;flex-direction:column;gap:5px;margin-top:auto}
.rangee-plan{display:grid;grid-template-columns:repeat(16,1fr);gap:2px}
.case-place{height:20px;border-radius:3px;padding:0;border:0;cursor:pointer;background:#D9DCE3}
.case-place.libre{background:#BFE0C9}.case-place.reservee{background:#F3D58A}.case-place.hors{background:repeating-linear-gradient(45deg,#C4C8D0 0 3px,#E4E7EC 3px 6px)}
.case-place.choisie{background:var(--bleu);outline:2px solid #B9CCF5}
.allee{font-size:8px;letter-spacing:.2em;text-align:center;color:var(--muet)}
.bas-4{display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr;gap:12px}
.legende-mini{display:inline-flex;align-items:center;gap:5px;font-size:10px;color:var(--muet);flex-wrap:wrap}
.legende-mini i{display:inline-block;width:8px;height:8px;border-radius:2px}
.legende-mini .bleu{background:var(--bleu)}.legende-mini .bleu-pale{background:var(--bleu-pale)}.legende-mini .ambre{background:#F3D58A}.legende-mini .rouge{background:#F0A097}
.legende-mini .vert{background:#9FD3B0}.legende-mini .gris{background:#C4C8D0}.legende-mini .tirets{width:12px;height:0;border-top:2px dashed #F0A93B;border-radius:0}
.legende-mini .hachure{background:repeating-linear-gradient(45deg,#C4C8D0 0 2px,transparent 2px 4px)}
.courbe-objectif{position:relative;height:90px}
.courbe-objectif svg{width:100%;height:100%}
.objectif{position:absolute;left:4px;transform:translateY(-120%);font-size:9px;color:#C27F14}
.valeur-fin{position:absolute;right:-4px;transform:translateY(-130%);background:var(--marine);color:#fff;font-size:9px;border-radius:5px;padding:1px 5px}
.axe{display:flex;justify-content:space-between;font-size:9px;color:var(--muet);margin-top:4px}
.barres-groupees{display:flex;align-items:flex-end;gap:6px}
.paire{flex:1;display:flex;align-items:flex-end;gap:2px;height:100%;justify-content:center;border-radius:4px}
.paire.survolee{background:rgba(59,111,224,.06)}
.paire i{display:block;width:40%;max-width:9px;border-radius:2px 2px 0 0}.paire i.a{background:var(--bleu)}.paire i.b{background:var(--bleu-pale)}
.anneau{position:relative;width:110px;height:110px;flex:none}
.anneau svg{width:100%;height:100%}
.anneau-texte{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.anneau-texte b{font-size:13px;letter-spacing:-.02em;max-width:76px}.anneau-texte small{font-size:9px;color:var(--muet)}
.legende-niveaux{display:grid;grid-template-columns:auto auto auto;gap:6px 10px;font-size:11px;align-items:center}
.legende-niveaux dd{margin:0;text-align:right}.legende-niveaux i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:6px}
.lien{color:var(--bleu);font-size:11px;cursor:pointer;white-space:nowrap}
.arrivee{padding:4px 0;border-top:1px solid var(--trait)}
.constat{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#EEF2FB;border:1px solid #DCE4F7;border-radius:12px;padding:9px 12px;font-size:11px}
.puce-niveau{border:1px solid var(--trait);background:var(--carte);border-radius:999px;padding:4px 10px;font-size:11px;cursor:pointer;white-space:nowrap}
.puce-niveau.active{background:var(--marine);color:#fff;border-color:var(--marine)}
.champ{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--trait);border-radius:10px;padding:6px 10px;color:var(--muet);font-size:11px;white-space:nowrap}
.sessions-cols{display:grid;grid-template-columns:22px 1.6fr .6fr .8fr 1.1fr .9fr .7fr 20px;gap:10px;align-items:center}
.entete{font-size:10px;color:var(--muet);padding:6px 4px;border-bottom:1px solid var(--trait)}
.rangee{padding:7px 4px;border-bottom:1px solid var(--trait);font-size:11px}
.rangee.cochee{background:#F3F6FD}
.duree{display:flex;flex-direction:column;gap:3px}.duree i{display:block;height:3px;border-radius:2px;background:var(--bleu)}.duree i.ambre{background:#E9B949}
.tuiles{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.tuile{background:var(--fond);border-radius:10px;padding:8px 10px;display:flex;flex-direction:column;gap:3px}
.chronologie{gap:10px}
.frise{position:relative}
.heures{position:relative;height:20px;margin-left:44px}
.heures span{position:absolute;transform:translateX(-50%);font-size:9px;color:var(--muet)}
.heures .maintenant{background:var(--marine);color:#fff;border-radius:6px;padding:1px 6px;top:-2px;z-index:2}
.densite{position:relative;height:6px;margin:0 0 6px 44px}
.densite i{position:absolute;height:6px;width:5.8%;background:var(--bleu);border-radius:3px}
.lignes-frise{position:relative}
.trait-maintenant{position:absolute;top:0;bottom:0;width:2px;background:var(--bleu);transform-origin:top;z-index:1;pointer-events:none}
.rangee-frise{display:grid;grid-template-columns:40px 1fr;gap:4px;align-items:center;height:17px;cursor:pointer;font-size:9px;color:var(--muet)}
.rangee-frise.active{color:var(--encre);font-weight:600}
.rangee-frise:hover .piste-frise{background:#F0F3F9}
.piste-frise{position:relative;height:9px;border-radius:3px}
.bloc-frise{position:absolute;top:0;height:9px;border-radius:3px;display:block}
.bloc-frise span{position:absolute;left:4px;top:-1px;font-size:8px;white-space:nowrap;color:var(--encre);font-style:normal}
.bloc-frise.gare{background:#D3D7DE}.bloc-frise.avenir{background:var(--bleu)}.bloc-frise.tenue{background:#F3D58A}
.bloc-frise.retard{background:#F7C9C2}.bloc-frise.arrivee{background:#BFE0C9}.bloc-frise.absent{background:repeating-linear-gradient(45deg,#C4C8D0 0 2px,transparent 2px 5px)}
.formulaire .champs{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.champs label{display:flex;flex-direction:column;gap:4px;font-size:10px;color:var(--muet);min-width:0}
.champs input,.champs select{border:1px solid var(--trait);border-radius:8px;padding:7px 8px;font:inherit;font-size:11px;color:var(--encre);background:var(--carte);min-width:0;width:100%}
.resa{border-top:1px solid var(--trait);padding-top:6px}
.zone-heures{position:relative}
.cibles-heures{position:absolute;inset:0 0 18px 0;display:flex}.cibles-heures i{flex:1}
.bulle{position:absolute;top:0;margin-left:20px;background:var(--carte);border:1px solid var(--trait);border-radius:10px;padding:8px 10px;font-size:10px;width:180px;box-shadow:0 8px 24px rgba(20,26,38,.1);pointer-events:none;display:flex;flex-direction:column;gap:3px}
.centre-anneau{display:grid;place-items:center}
.niveau-recette{border-top:1px solid var(--trait);padding-top:6px}
.point{display:inline-block;width:8px;height:8px;border-radius:2px}
.closes-cols{display:grid;grid-template-columns:.6fr 1.2fr .6fr .7fr 1.3fr .4fr .7fr;gap:10px;align-items:center}
.version{font-style:normal;font-size:10px;background:var(--fond);border-radius:6px;padding:1px 6px}
.toast{position:absolute;left:50%;bottom:20px;background:var(--marine);color:#fff;border-radius:12px;padding:10px 14px;font-size:11px;box-shadow:0 12px 30px rgba(20,26,38,.3)}
`;
