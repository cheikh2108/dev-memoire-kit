/**
 * Modèle 03 — Tableau de bord de parking avec vue 3D « Parking Plateau »
 * Reconstruction originale (nom, données et code réécrits) d'après une démo publique
 * de tableau de bord de parking : barre latérale, indicateurs, maquette 3D interactive
 * (niveaux isolables, vue éclatée, caméra qui vole vers la place choisie), panneau de détail.
 *
 * Dépendances : react 18+, motion 11+, three 0.170+ (`npm i motion three`).
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MotionConfig, motion, AnimatePresence } from "motion/react";
import * as THREE from "three";

/* ---------- Réglages de caméra (radians), voir animations.md ---------- */
const EL_VUE_GENERALE = 0.48; // ≈ 27°
const EL_NIVEAU = 0.99;       // ≈ 57°
const EL_PLACE = 0.87;        // ≈ 50°
const EL_MIN = 0.38;
const EL_MAX = 1.25;
const AZ_PLAGE = 0.7;         // rotation bornée à ±40°
const ECART_ECLATE = 8;       // écart ajouté entre niveaux en vue éclatée
const LEVEE = 34;             // levée des niveaux supérieurs quand on isole un niveau
const AMORTI = 6;             // raideur de l'amorti (plus grand = plus rapide)

const EASE = [0.22, 1, 0.36, 1] as const;

type Etat = "libre" | "reservee" | "occupee" | "hors";
type Place = { id: number; niveau: number; rang: 0 | 1; col: number; etat: Etat; plaque?: string };

const COULEURS: Record<Etat, number> = { libre: 0xb9dcc4, reservee: 0xf3d58a, occupee: 0xd9dce3, hors: 0x9aa0aa };
const NIVEAUX = ["N1 Rez-de-chaussée", "N2", "N3 Toit"];

/* ---------- Scène 3D ---------- */
type Commandes = { niveau: number | null; eclate: boolean; place: number | null };

function creerScene(hote: HTMLDivElement, places: Place[], onChoisir: (id: number) => void) {
  const rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  rendu.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  rendu.setSize(hote.clientWidth, hote.clientHeight);
  hote.appendChild(rendu.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, hote.clientWidth / hote.clientHeight, 1, 500);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8dbe2, 2.2));
  const soleil = new THREE.DirectionalLight(0xffffff, 1.4);
  soleil.position.set(20, 40, 15);
  scene.add(soleil);

  const sol = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshLambertMaterial({ color: 0xe9ebef }));
  sol.rotation.x = -Math.PI / 2;
  sol.position.y = -0.3;
  scene.add(sol);

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
    const dalle = new THREE.Mesh(new THREE.BoxGeometry(8 * LARGEUR + 4, 0.4, 2 * PROFONDEUR + 6), dalleMat);
    dalle.position.y = -0.2;
    g.add(dalle);

    for (const p of places.filter((x) => x.niveau === n)) {
      const x = (p.col - 3.5) * LARGEUR;
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

  // Valeurs actuelles qui rejoignent les cibles par amorti exponentiel (aucune durée fixe).
  const actuel = { el: EL_VUE_GENERALE, az: -0.35, rayon: 50, centre: new THREE.Vector3(0, 3, 0), eclate: 0, isole: 0 };
  const cible = { el: EL_VUE_GENERALE, az: -0.35, rayon: 50, centre: new THREE.Vector3(0, 3, 0), eclate: 0, isole: 0 };
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
      cible.el = EL_PLACE;
      cible.rayon = 30;
      cible.centre.copy(centre);
    } else if (c.niveau !== null) {
      cible.el = EL_NIVEAU;
      cible.rayon = 42;
      cible.centre.set(0, c.niveau * HAUTEUR_NIVEAU, 0);
    } else {
      cible.el = EL_VUE_GENERALE;
      cible.rayon = c.eclate ? 62 : 50;
      cible.centre.set(0, c.eclate ? 10 : 3, 0);
    }
    if (surbrillance !== null) {
      const p = places.find((x) => x.id === surbrillance)!;
      (marquages.get(p.id)!.material as THREE.MeshLambertMaterial).color.setHex(COULEURS[p.etat]);
    }
    surbrillance = c.place;
    if (c.place !== null) (marquages.get(c.place)!.material as THREE.MeshLambertMaterial).color.setHex(0x3b6fe0);
  }

  // Glisser pour tourner (dans les bornes), cliquer pour choisir une place.
  let glisse: { x: number; y: number; bouge: boolean } | null = null;
  const lanceur = new THREE.Raycaster();
  const souris = new THREE.Vector2();
  const toile = rendu.domElement;
  toile.addEventListener("pointerdown", (e) => {
    glisse = { x: e.clientX, y: e.clientY, bouge: false };
    toile.setPointerCapture(e.pointerId);
  });
  toile.addEventListener("pointermove", (e) => {
    if (!glisse) return;
    const dx = e.clientX - glisse.x;
    const dy = e.clientY - glisse.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) glisse.bouge = true;
    cible.az = THREE.MathUtils.clamp(cible.az - dx * 0.005, -AZ_PLAGE, AZ_PLAGE);
    cible.el = THREE.MathUtils.clamp(cible.el + dy * 0.005, EL_MIN, EL_MAX);
    glisse.x = e.clientX;
    glisse.y = e.clientY;
  });
  toile.addEventListener("pointerup", (e) => {
    if (glisse && !glisse.bouge) {
      const r = toile.getBoundingClientRect();
      souris.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      lanceur.setFromCamera(souris, camera);
      const touche = lanceur.intersectObjects([...marquages.values()], false)[0];
      if (touche) onChoisir(touche.object.userData.id as number);
    }
    glisse = null;
  });

  const horloge = new THREE.Clock();
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    detruire() {
      cancelAnimationFrame(image);
      observateur.disconnect();
      rendu.dispose();
      hote.removeChild(toile);
    },
  };
}

/* ---------- Interface ---------- */
function Carte({ i, className = "", children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <motion.section
      className={`carte ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay: 0.08 + i * 0.05 }}
    >
      {children}
    </motion.section>
  );
}

function Indicateur({ i, titre, valeur, tendance, details }: { i: number; titre: string; valeur: string; tendance: string; details: [string, string][] }) {
  return (
    <Carte i={i} className="indicateur">
      <p className="ligne"><span className="muet">{titre}</span><span className="tendance">{tendance}</span></p>
      <p className="valeur">{valeur}</p>
      <div className="details">{details.map(([l, v]) => <p key={l}><span className="muet">{l}</span><b>{v}</b></p>)}</div>
    </Carte>
  );
}

export default function TableauParking() {
  const hote = useRef<HTMLDivElement>(null);
  const scene = useRef<ReturnType<typeof creerScene> | null>(null);
  const [niveau, setNiveau] = useState<number | null>(null);
  const [eclate, setEclate] = useState(false);
  const [place, setPlace] = useState<number | null>(null);

  useEffect(() => {
    if (!hote.current) return;
    scene.current = creerScene(hote.current, PLACES, (id) => {
      setPlace(id);
      setNiveau(PLACES.find((p) => p.id === id)!.niveau);
    });
    return () => scene.current?.detruire();
  }, []);

  useEffect(() => {
    scene.current?.appliquer({ niveau, eclate, place });
  }, [niveau, eclate, place]);

  const choisie = PLACES.find((p) => p.id === place);
  const comptes = (["libre", "reservee", "occupee", "hors"] as Etat[]).map((e) => PLACES.filter((p) => p.etat === e).length);
  const occupation = Math.round((comptes[2] / PLACES.length) * 100);

  return (
    <MotionConfig reducedMotion="user">
      <div className="parking">
        <style>{CSS}</style>
        <aside className="barre-laterale">
          <p className="marque"><span className="logo">P</span> <b>Parking Plateau</b></p>
          <input className="recherche" placeholder="Place, plaque…" aria-label="Rechercher une place ou une plaque" />
          <p className="muet petit">Menu</p>
          {["Garage", "Sessions", "Réservations", "Recettes"].map((m, k) => (
            <button key={m} className={`menu ${k === 0 ? "actif" : ""}`}>{m}</button>
          ))}
          <div className="occupation">
            <p className="ligne"><b>Remplissage</b><span>{occupation} %</span></p>
            <div className="piste">
              <motion.i initial={{ width: 0 }} animate={{ width: `${occupation}%` }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }} />
            </div>
          </div>
        </aside>

        <main>
          <header className="ligne">
            <div>
              <h1>Garage</h1>
              <p className="muet">Parking Plateau, Dakar · 48 places sur 3 niveaux · {comptes[0]} libres</p>
            </div>
            <span className="horloge">mar. 3 nov. <b>11:50</b></span>
          </header>

          <div className="indicateurs">
            <Indicateur i={0} titre="Occupation" valeur={`${occupation} %`} tendance="↘ −2 pts" details={[["Garées", `${comptes[2]} sur ${PLACES.length}`], ["Hors service", String(comptes[3])]]} />
            <Indicateur i={1} titre="Places libres" valeur={String(comptes[0])} tendance={`${comptes[1]} réservées`} details={[["Recharge", "2 sur 4"], ["PMR", "1 sur 2"]]} />
            <Indicateur i={2} titre="Recettes du jour" valeur="482 500 F" tendance="↗ +6 200 F/h" details={[["Sessions", "74"], ["En cours", "61 300 F"]]} />
            <Indicateur i={3} titre="Durée moyenne" valeur="3 h 42" tendance="↘ −14 % vs 7 j" details={[["Plus longue", "19 h 52"], ["Rotation", "1,4 par place"]]} />
          </div>

          <div className="milieu">
            <Carte i={4} className="vue-3d">
              <div className="ligne">
                <div>
                  <b>Garage en direct</b>
                  <p className="muet petit">
                    {niveau === null ? "Trois niveaux · glisser pour tourner" : `${NIVEAUX[niveau]} isolé · niveaux supérieurs levés`}
                  </p>
                </div>
                <div className="segments">
                  <button aria-pressed={niveau === null} onClick={() => { setNiveau(null); setPlace(null); }}>Tous</button>
                  {[2, 1, 0].map((n) => (
                    <button key={n} aria-pressed={niveau === n} onClick={() => { setNiveau(n); setPlace(null); }}>
                      {NIVEAUX[n].split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="toile" ref={hote} />
              <div className="ligne pied">
                <div className="legende">
                  <span><i className="l" /> Libres {comptes[0]}</span>
                  <span><i className="r" /> Réservées {comptes[1]}</span>
                  <span><i className="o" /> Occupées {comptes[2]}</span>
                  <span><i className="h" /> Hors service {comptes[3]}</span>
                </div>
                <button className="btn" aria-pressed={eclate} onClick={() => setEclate((v) => !v)}>
                  {eclate ? "Regrouper" : "Éclater"}
                </button>
              </div>
            </Carte>

            <Carte i={5} className="detail">
              <AnimatePresence mode="wait">
                {choisie ? (
                  <motion.div
                    key={choisie.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <p className="muet petit">{NIVEAUX[choisie.niveau]} · rangée {choisie.rang === 0 ? "nord" : "sud"}</p>
                    <p className="ligne">
                      <span className="valeur">{choisie.id}</span>
                      <span className={`etat ${choisie.etat}`}>{LIBELLE_ETAT[choisie.etat]}</span>
                    </p>
                    {choisie.etat === "occupee" ? (
                      <div className="ticket">
                        <p className="plaque">{choisie.plaque}</p>
                        <div className="details">
                          <p><span className="muet">Entrée</span><b>09:40</b></p>
                          <p><span className="muet">Durée</span><b>2 h 10</b></p>
                          <p><span className="muet">À payer</span><b>1 500 F</b></p>
                        </div>
                        <button className="btn sombre">Clore et facturer 1 500 F</button>
                      </div>
                    ) : (
                      <p className="muet">Aucune session en cours sur cette place.</p>
                    )}
                  </motion.div>
                ) : (
                  <motion.p key="vide" className="muet" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Clique sur une place de la maquette pour voir sa session.
                  </motion.p>
                )}
              </AnimatePresence>
            </Carte>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}

/* ---------- Données de démonstration (fictives) ---------- */
const LIBELLE_ETAT: Record<Etat, string> = { libre: "Libre", reservee: "Réservée", occupee: "Occupée", hors: "Hors service" };
const PLAQUES = ["DK-2614-AB", "TH-3825-C", "DK-4873-BF", "ZG-1055-A", "SL-7720-D"];
const PLACES: Place[] = Array.from({ length: 48 }, (_, k) => {
  const niveau = Math.floor(k / 16);
  const i = k % 16;
  const graine = (k * 37 + 11) % 10;
  const etat: Etat = k === 21 ? "hors" : graine < 6 ? "occupee" : graine < 7 ? "reservee" : "libre";
  return {
    id: (niveau + 1) * 100 + i + 1,
    niveau,
    rang: (i < 8 ? 0 : 1) as 0 | 1,
    col: i % 8,
    etat,
    plaque: etat === "occupee" ? PLAQUES[k % PLAQUES.length] : undefined,
  };
});

/* ---------- Styles (tokens dans style.md) ---------- */
const CSS = `
.parking{--fond:#F4F5F7;--carte:#FFFFFF;--encre:#141A26;--muet:#8A909C;--trait:#E7E9EE;--marine:#1E2A44;--bleu:#3B6FE0;
--libre:#B9DCC4;--reservee:#F3D58A;--occupee:#D9DCE3;--hors:#9AA0AA;--r:18px;
font-family:"Geist","Inter Tight",system-ui,sans-serif;color:var(--encre);background:var(--fond);border-radius:24px;
display:grid;grid-template-columns:220px 1fr;min-height:720px;font-size:13px;overflow:hidden}
.parking *{box-sizing:border-box}.parking p,.parking h1{margin:0}
.muet{color:var(--muet)}.petit{font-size:11px}
.ligne{display:flex;align-items:center;justify-content:space-between;gap:10px}
.barre-laterale{background:var(--carte);padding:18px 14px;display:flex;flex-direction:column;gap:8px;border-right:1px solid var(--trait)}
.marque{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.logo{width:28px;height:28px;border-radius:8px;background:var(--marine);color:#fff;display:grid;place-items:center;font-weight:600}
.recherche{border:1px solid var(--trait);border-radius:10px;padding:8px 10px;font:inherit;margin-bottom:8px}
.menu{border:0;background:none;text-align:left;padding:9px 10px;border-radius:10px;font:inherit;color:var(--encre);cursor:pointer}
.menu.actif{background:var(--marine);color:#fff}
.occupation{margin-top:auto;background:var(--fond);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:6px}
.piste{height:5px;background:var(--trait);border-radius:999px;overflow:hidden}.piste i{display:block;height:100%;background:var(--bleu)}
.parking main{padding:20px;display:flex;flex-direction:column;gap:12px;min-width:0}
.parking h1{font-size:22px;font-weight:600;letter-spacing:-.02em}
.horloge{background:var(--carte);border:1px solid var(--trait);border-radius:10px;padding:6px 10px}
.indicateurs{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.carte{background:var(--carte);border:1px solid var(--trait);border-radius:var(--r);padding:14px;display:flex;flex-direction:column;gap:8px;min-width:0}
.valeur{font-size:26px;font-weight:600;letter-spacing:-.02em}
.tendance{font-size:11px;background:var(--fond);border-radius:999px;padding:2px 8px;white-space:nowrap}
.details{display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;font-size:11px}.details p{display:flex;flex-direction:column}
.milieu{display:grid;grid-template-columns:1fr 280px;gap:12px}
.toile{height:330px;border-radius:12px;overflow:hidden;background:linear-gradient(#EEF0F4,#E4E7EC);cursor:grab;touch-action:none}
.toile:active{cursor:grabbing}
.segments{display:flex;gap:2px;background:var(--fond);border-radius:10px;padding:3px}
.segments button{border:0;background:none;border-radius:8px;padding:5px 10px;font:inherit;font-size:12px;cursor:pointer;color:var(--muet)}
.segments button[aria-pressed=true]{background:var(--carte);color:var(--encre);box-shadow:0 1px 3px rgba(0,0,0,.08)}
.pied{font-size:11px}.legende{display:flex;gap:12px;flex-wrap:wrap}
.legende i{display:inline-block;width:10px;height:10px;border-radius:3px;vertical-align:-1px}
.legende .l{background:var(--libre)}.legende .r{background:var(--reservee)}.legende .o{background:var(--occupee)}.legende .h{background:var(--hors)}
.btn{border:1px solid var(--trait);background:var(--carte);border-radius:10px;padding:7px 12px;font:inherit;cursor:pointer}
.btn.sombre{background:var(--marine);color:#fff;border:0;width:100%;padding:10px}
.btn[aria-pressed=true]{background:var(--marine);color:#fff}
.etat{font-size:11px;border-radius:999px;padding:3px 9px}
.etat.libre{background:#E3F2E8}.etat.reservee{background:#FBF0D2}.etat.occupee{background:#E8EEFB;color:var(--bleu)}.etat.hors{background:var(--trait)}
.ticket{background:var(--fond);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px;margin-top:10px}
.plaque{font-family:ui-monospace,monospace;font-weight:600;letter-spacing:.06em;background:#fff;border:1px solid var(--trait);border-radius:6px;padding:4px 8px;align-self:flex-start}
.ticket .details{grid-template-columns:repeat(3,1fr)}
`;
