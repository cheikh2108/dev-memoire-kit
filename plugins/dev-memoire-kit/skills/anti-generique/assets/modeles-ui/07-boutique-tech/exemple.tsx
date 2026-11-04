/**
 * Modèle 07 — Boutique high-tech « Leeral » (page d'accueil e-commerce claire, multi-rayons)
 * Reconstruction originale (marque, textes, illustrations et code réécrits) d'après une maquette
 * publique de boutique d'électronique : héros blanc avec sujet dans un grand disque et bulles,
 * mosaïque « nos choix », carrousels de produits à pastilles de couleur, bannières pleine largeur,
 * cartes catégories à hauteurs variées, grilles de tendances, pied de page clair.
 * Toutes les photos et marques de la référence sont remplacées par des illustrations SVG et des noms inventés.
 * Passer de vraies photos avec la prop `photoHeros` (sujet détouré du héros).
 * La référence est une suite d'images fixes : les animations sont des ajouts (voir animations.md).
 *
 * Dépendances : react 18+, motion 11+ (`npm i motion`). Police : Urbanist.
 */
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;
const entree = (delai = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55, ease: EASE, delay: delai },
});
const fcfa = (n: number) => `${n.toLocaleString("fr-FR").replace(/ | /g, " ")} F`;

/* ====================================================================== */
/* Illustrations SVG                                                       */
/* ====================================================================== */
type Prod = "casque" | "ecouteurs" | "manette" | "vr" | "portable" | "enceinte" | "bague" | "camera" | "tele" | "barre" | "ecran" | "pliable";
let uid = 0;
function Produit({ type, taille = 220, teinte = "#2B2D31" }: { type: Prod; taille?: number; teinte?: string }) {
  const [id] = useState(() => `p${uid++}`);
  const g = (a: string, b: string) => (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
  );
  const corps: Record<Prod, ReactNode> = {
    casque: (<>
      <defs>{g("#FBF6EE", teinte)}</defs>
      <path d="M40 116 C34 40 166 40 160 116" fill="none" stroke={teinte} strokeWidth="14" strokeLinecap="round" />
      <rect x="22" y="96" width="46" height="74" rx="22" fill={`url(#${id})`} /><rect x="132" y="96" width="46" height="74" rx="22" fill={`url(#${id})`} />
      <rect x="58" y="104" width="12" height="58" rx="6" fill={teinte} opacity=".6" /><rect x="130" y="104" width="12" height="58" rx="6" fill={teinte} opacity=".6" />
    </>),
    ecouteurs: (<>
      <defs>{g("#FFFFFF", "#CFD3D9")}</defs>
      <path d="M48 110 h104 v34 a28 28 0 0 1 -28 28 h-48 a28 28 0 0 1 -28 -28z" fill={`url(#${id})`} stroke="#B9BEC6" />
      <path d="M52 108 C52 70 148 70 148 108" fill="#E9ECF0" stroke="#B9BEC6" />
      {[80, 120].map((x) => <g key={x}><ellipse cx={x} cy="104" rx="14" ry="16" fill="#fff" stroke="#B9BEC6" /><rect x={x - 4} y="110" width="8" height="24" rx="4" fill="#F4F5F7" stroke="#B9BEC6" /></g>)}
    </>),
    manette: (<>
      <defs>{g("#4A4D55", teinte)}</defs>
      <path d="M36 92 C40 70 70 66 100 72 C130 66 160 70 164 92 L176 140 C180 160 158 168 146 150 L132 130 H68 L54 150 C42 168 20 160 24 140Z" fill={`url(#${id})`} />
      <circle cx="74" cy="100" r="11" fill="#18191C" /><circle cx="122" cy="118" r="10" fill="#18191C" />
      {[[138, 90], [150, 100], [138, 110], [126, 100]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="5" fill="#16171A" />)}
      <path d="M58 118h16M66 110v16" stroke="#16171A" strokeWidth="5" strokeLinecap="round" />
    </>),
    vr: (<>
      <defs>{g("#F7F8FA", "#BFC5CE")}</defs>
      <path d="M30 120 C30 60 170 60 170 120" fill="none" stroke="#9AA2AD" strokeWidth="8" />
      <rect x="34" y="78" width="132" height="66" rx="30" fill={`url(#${id})`} />
      <rect x="44" y="88" width="112" height="46" rx="22" fill="#1E2A38" opacity=".85" />
      <path d="M56 100 h40 M60 110 h28 M108 104 h34 M112 116 h22" stroke="#7FD4FF" strokeWidth="1.5" opacity=".8" />
    </>),
    portable: (<>
      <defs>{g("#DDE6EA", "#9FB3BD")}</defs>
      <rect x="40" y="46" width="120" height="82" rx="6" fill="#16191E" /><rect x="46" y="52" width="108" height="70" rx="3" fill={`url(#${id})`} />
      <path d="M24 132 h152 l-10 12 H34z" fill="#C9CDD3" />
    </>),
    enceinte: (<>
      <defs>{g("#F3F1EC", "#B9B4AA")}</defs>
      <ellipse cx="100" cy="164" rx="44" ry="10" fill="#000" opacity=".12" />
      <path d="M58 60 v100 a42 12 0 0 0 84 0 v-100" fill={`url(#${id})`} /><ellipse cx="100" cy="60" rx="42" ry="12" fill="#E6E2DA" stroke="#CFC9BE" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M62 ${76 + i * 9} h76`} stroke="#000" opacity=".05" />)}
    </>),
    bague: (<>
      <defs>{g("#FFFFFF", "#8E959E")}</defs>
      <ellipse cx="100" cy="150" rx="46" ry="8" fill="#000" opacity=".25" />
      <ellipse cx="100" cy="104" rx="44" ry="40" fill="none" stroke={`url(#${id})`} strokeWidth="16" />
      <ellipse cx="100" cy="104" rx="44" ry="40" fill="none" stroke="#fff" strokeWidth="2" opacity=".6" />
    </>),
    camera: (<>
      <defs>{g("#4A4F57", "#1A1C20")}</defs>
      <rect x="34" y="70" width="132" height="70" rx="16" fill={`url(#${id})`} transform="rotate(-18 100 105)" />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${92 + i * 10} 76 v58`} stroke="#000" opacity=".35" strokeWidth="4" transform="rotate(-18 100 105)" />)}
      <circle cx="62" cy="114" r="26" fill="#2E3238" /><circle cx="62" cy="114" r="16" fill="#0C0D10" /><circle cx="56" cy="108" r="5" fill="#8AA4C8" opacity=".7" />
    </>),
    tele: (<>
      <defs>{g("#F2B46B", "#3C5A88")}</defs>
      <rect x="14" y="40" width="172" height="104" rx="4" fill="#1A1B1E" /><rect x="18" y="44" width="164" height="96" rx="2" fill={`url(#${id})`} />
      <path d="M18 112 C60 96 90 120 182 98 V140 H18z" fill="#1F2E45" opacity=".7" />
      <path d="M70 144 l-10 16 M130 144 l10 16" stroke="#2A2B2F" strokeWidth="4" />
    </>),
    barre: (<>
      <rect x="22" y="104" width="156" height="22" rx="8" fill="#1C1D20" /><path d="M30 115 h140" stroke="#3A3C42" strokeDasharray="2 3" />
      <rect x="6" y="58" width="22" height="46" rx="5" fill="#26282C" /><rect x="172" y="58" width="22" height="46" rx="5" fill="#26282C" />
      <circle cx="17" cy="72" r="6" fill="#45484F" /><circle cx="183" cy="72" r="6" fill="#45484F" />
      <rect x="80" y="134" width="40" height="36" rx="6" fill="#202125" />
    </>),
    ecran: (<>
      <defs>{g("#2B4F86", "#E5A35B")}</defs>
      <path d="M16 46 Q100 34 184 46 V128 Q100 118 16 128z" fill="#1A1B1E" /><path d="M20 50 Q100 39 180 50 V124 Q100 114 20 124z" fill={`url(#${id})`} />
      <path d="M100 124 v26 M76 158 h48" stroke="#3A3C42" strokeWidth="6" strokeLinecap="round" />
    </>),
    pliable: (<>
      <defs>{g("#3C5878", "#14202E")}</defs>
      <path d="M60 30 L150 18 L156 110 L66 124Z" fill="#0E1116" /><path d="M66 36 L146 26 L150 104 L70 116Z" fill="#4A3B2E" opacity=".9" />
      <path d="M66 124 L156 110 L170 190 L74 196Z" fill={`url(#${id})`} />
      <circle cx="140" cy="140" r="9" fill="#0B0D12" stroke="#5B7290" strokeWidth="2" /><circle cx="140" cy="164" r="9" fill="#0B0D12" stroke="#5B7290" strokeWidth="2" />
    </>),
  };
  return <svg viewBox="0 0 200 200" width={taille} height={taille} aria-hidden>{corps[type]}</svg>;
}

function Telephone({ corps, ecran, taille = 220 }: { corps: string; ecran: string; taille?: number }) {
  const [id] = useState(() => `t${uid++}`);
  return (
    <svg viewBox="0 0 200 200" width={taille} height={taille} aria-hidden>
      <defs><radialGradient id={id} cx=".3" cy=".5" r=".6"><stop offset="0" stopColor="#fff" stopOpacity=".7" /><stop offset=".35" stopColor={ecran} /><stop offset="1" stopColor="#0B0D12" /></radialGradient></defs>
      <rect x="44" y="20" width="112" height="76" rx="12" fill="#0B0C0F" />
      <rect x="49" y="25" width="102" height="66" rx="8" fill={`url(#${id})`} />
      <circle cx="78" cy="58" r="22" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="3" /><circle cx="122" cy="58" r="22" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="3" />
      <rect x="44" y="96" width="112" height="78" rx="12" fill={corps} />
      <rect x="52" y="134" width="44" height="32" rx="12" fill="#000" opacity=".18" />
      <circle cx="64" cy="150" r="8" fill="#15161A" /><circle cx="84" cy="150" r="8" fill="#15161A" />
    </svg>
  );
}

/* ====================================================================== */
/* Icônes et petits éléments                                               */
/* ====================================================================== */
const I = {
  loupe: "M9 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM17 17l-3.5-3.5",
  coeur: "M10 16s-6-3.6-6-8a3.2 3.2 0 0 1 6-1.6A3.2 3.2 0 0 1 16 8c0 4.4-6 8-6 8Z",
  panier: "M3 4h2l2 9h9l2-6H6M8 17h.01M15 17h.01",
  sac: "M5 7h10l-1 10H6zM8 7V5.5a2 2 0 0 1 4 0V7",
  diag: "M6 14 14 6M7 6h7v7",
  gauche: "M15 10H5M9 6l-4 4 4 4",
  droite: "M5 10h10M11 6l4 4-4 4",
  photo: "M4 4h12v12H4zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  lien: "M5 8v7M5 5h.01M9 15v-4a2 2 0 0 1 4 0v4M9 8v7",
  video: "M3 5h14v10H3zM9 8l3 2-3 2z",
  f: "M11 17v-6h2l.5-2.5H11V7c0-.8.3-1.2 1.3-1.2H14V3.5c-.4 0-1.4-.1-2.3-.1-2.2 0-3.4 1.3-3.4 3.6v1.5H6V11h2.3v6",
  bulle: "M4 16l1.2-3.4A6.5 6.5 0 1 1 7.6 15z",
};
function Ic({ n, t = 18 }: { n: keyof typeof I; t?: number }) {
  return <svg width={t} height={t} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={I[n]} /></svg>;
}
function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden>
      {Array.from({ length: 10 }, (_, i) => <path key={i} d="M20 20 C21 12 27 6 31 6 C29 11 25 17 20 20Z" fill="currentColor" transform={`rotate(${i * 36} 20 20)`} />)}
      <circle cx="20" cy="20" r="4" fill="#fff" />
    </svg>
  );
}
const Pilule = ({ children, clair }: { children: ReactNode; clair?: boolean }) => (
  <motion.a href="#" className={clair ? "pilule claire" : "pilule"} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>{children}</motion.a>
);
function Entete({ titre }: { titre: string }) {
  return (
    <motion.div className="entete" {...entree()}>
      <h2>{titre}</h2>
      <a href="#" className="tout-voir">Tout voir</a>
    </motion.div>
  );
}

/* ====================================================================== */
/* Page                                                                    */
/* ====================================================================== */
export default function BoutiqueTech({ photoHeros }: { photoHeros?: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const [diapo, setDiapo] = useState(0);
  const [panier, setPanier] = useState(0);
  const defiler = (s: 1 | -1) => rail.current?.scrollBy({ left: s * 478, behavior: "smooth" });

  return (
    <MotionConfig reducedMotion="user">
      <div className="leeral">
        <style>{CSS}</style>
        <div className="cadre">
          {/* ------------------------------ Navigation ------------------------------ */}
          <header className="nav">
            <a href="#" className="marque"><Logo /> Leeral</a>
            <ul>{["Accueil", "À propos", "Boutique", "Nouveautés", "Contact"].map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
            <div className="outils">
              <label className="recherche"><Ic n="loupe" /><input placeholder="Rechercher" aria-label="Rechercher" /></label>
              <button className="rond" aria-label="Favoris"><Ic n="coeur" /></button>
              <button className="rond" aria-label={`Panier, ${panier} articles`}>
                <Ic n="panier" />
                <AnimatePresence>{panier > 0 && <motion.i key={panier} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>{panier}</motion.i>}</AnimatePresence>
              </button>
              <span className="avatar" aria-label="Mon compte">AD</span>
            </div>
          </header>

          {/* --------------------------------- Héros -------------------------------- */}
          <section className="heros">
            <div className="heros-texte">
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}>Repenser la tech<br />du quotidien</motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}>
                Confort, design et innovation : une électronique moderne, sélectionnée à Dakar, pour élever votre quotidien.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.42 }}><Pilule>Acheter</Pilule></motion.div>
              <motion.div className="avis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.54 }}>
                <span className="avatars">{AVATARS.map((a, k) => <motion.i key={a.l} style={{ background: a.c }} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 + k * 0.06, ease: EASE }}>{a.l}</motion.i>)}</span>
                <span><b>19 k+</b><br />Avis</span>
              </motion.div>
            </div>
            <div className="heros-visuel">
              <motion.div className="disque" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease: EASE }} />
              <motion.div className="sujet" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
                {photoHeros ? <img src={photoHeros} alt="" /> : <Produit type="casque" taille={520} teinte="#D9CCB8" />}
              </motion.div>
            </div>
            {BULLES.map((b, k) => (
              <motion.span key={k} className={`bulle ${b.t}`} style={{ left: b.x, top: b.y, width: b.d, height: b.d }}
                initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                transition={{ opacity: { delay: 0.5 + k * 0.08 }, scale: { delay: 0.5 + k * 0.08, ease: EASE }, y: { duration: 5 + k, repeat: Infinity, ease: "easeInOut", delay: 1 } }} />
            ))}
          </section>

          {/* ------------------------------ Nos choix ------------------------------- */}
          <section className="bloc">
            <Entete titre="Nos choix pour vous" />
            <div className="mosaique">
              {CHOIX.map((c, k) => (
                <motion.article key={c.nom} className={`tuile ${c.zone}`} style={{ background: c.fond }} {...entree(k * 0.05)} whileHover="survol">
                  <motion.div className="tuile-produit" variants={{ survol: { scale: 1.06 } }} transition={{ duration: 0.5, ease: EASE }}>
                    <Produit type={c.type} taille={c.taille} teinte={c.teinte} />
                  </motion.div>
                  {c.titre ? (
                    <div className="tuile-texte">
                      <h3>{c.titre}</h3><p>{c.sous}</p><Pilule clair>Acheter</Pilule>
                    </div>
                  ) : c.fleche ? (
                    <motion.span className="fleche-centre" initial={{ scale: 0.6, opacity: 0 }} variants={{ survol: { scale: 1, opacity: 1 } }}><Ic n="diag" t={22} /></motion.span>
                  ) : (
                    <button className="sac" aria-label={`Ajouter ${c.nom}`} onClick={() => setPanier((p) => p + 1)}><Ic n="sac" t={16} /></button>
                  )}
                </motion.article>
              ))}
            </div>
          </section>

          {/* ------------------------------ Nouveautés ------------------------------ */}
          <section className="bloc sans-droite">
            <Entete titre="Nouveautés" />
            <div className="rail" ref={rail}>
              {NOUVEAUTES.map((p, k) => <CarteProduit key={p.nom} p={p} delai={k * 0.06} ancien />)}
            </div>
            <div className="fleches">
              <button aria-label="Précédent" onClick={() => defiler(-1)}><Ic n="gauche" /></button>
              <button aria-label="Suivant" className="noir" onClick={() => defiler(1)}><Ic n="droite" /></button>
            </div>
          </section>

          {/* ------------------------- Bannière pleine largeur ---------------------- */}
          <section className="banniere-bleue" aria-roledescription="diaporama">
            <AnimatePresence mode="wait">
              <motion.div key={diapo} className="diapo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <motion.span className="mot-fantome" initial={{ x: -40 }} animate={{ x: 0 }} transition={{ duration: 0.9, ease: EASE }} aria-hidden>{DIAPOS[diapo].fantome}</motion.span>
                <div className="diapo-texte">
                  <motion.h2 initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.55, ease: EASE }}>{DIAPOS[diapo].titre}</motion.h2>
                  <motion.p initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.55, ease: EASE }}>{DIAPOS[diapo].texte}</motion.p>
                  <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.55, ease: EASE }}><Pilule clair>Acheter</Pilule></motion.div>
                </div>
                <motion.div className="diapo-produit" initial={{ x: 60, rotate: 8, opacity: 0 }} animate={{ x: 0, rotate: 0, opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>
                  <Produit type={DIAPOS[diapo].produit} taille={470} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <div className="points">{DIAPOS.map((d, k) => <button key={d.titre} aria-label={`Diapositive ${k + 1}`} onClick={() => setDiapo(k)} className={k === diapo ? "actif" : ""} />)}</div>
          </section>

          {/* ------------------------------ Catégories ------------------------------ */}
          <section className="bloc">
            <Entete titre="Acheter par catégorie" />
            <div className="categories">
              {CATEGORIES.map((c, k) => (
                <motion.a href="#" key={c.nom} className="categorie" style={{ background: c.fond, height: c.h }} {...entree(k * 0.06)} whileHover={{ height: 455 }}>
                  <span className="cat-produit"><Produit type={c.type} taille={230} teinte={c.teinte} /></span>
                  <span className="cat-texte"><b>{c.nom}</b><span>dès <strong>{fcfa(c.prix)}</strong></span></span>
                </motion.a>
              ))}
            </div>
          </section>

          {/* --------------------------- Deux promotions ---------------------------- */}
          <section className="duo">
            {PROMOS.map((p, k) => (
              <motion.article key={p.titre} className="promo" style={{ background: p.fond }} {...entree(k * 0.08)}>
                <div className="promo-visuel">{p.visuel}</div>
                <div className="promo-texte"><h3>{p.titre}</h3><p>{p.texte}</p><Pilule>Acheter</Pilule></div>
              </motion.article>
            ))}
          </section>

          {/* ------------------------------ Tendances ------------------------------- */}
          <section className="bloc">
            <Entete titre="Tendances du moment" />
            <div className="grille-3">{TENDANCES.map((p, k) => <CarteProduit key={p.nom + k} p={p} delai={(k % 3) * 0.06} separateur />)}</div>
          </section>

          {/* ------------------------------ Grande carte ---------------------------- */}
          <motion.section className="fete" {...entree()}>
            <div className="fete-texte">
              <h2>Fêtez la Tabaski<br />avec le<br />Leeral X1</h2>
              <p>Performances de pointe, design soigné et nouvelles fonctions : chaque moment de la fête mérite d'être gardé.</p>
              <Pilule>Acheter</Pilule>
            </div>
            <motion.div className="fete-produit" initial={{ x: 80, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }}>
              <Telephone corps="#A9B5F2" ecran="#3B6BFF" taille={720} />
            </motion.div>
          </motion.section>

          {/* ------------------------------ Bonnes affaires ------------------------- */}
          <section className="bloc">
            <Entete titre="Bonnes affaires" />
            <div className="grille-3">
              {AFFAIRES.map((a, k) => (
                <motion.a href="#" key={a.nom} className="affaire" style={{ background: a.fond }} {...entree(k * 0.06)} whileHover="survol">
                  <motion.span className="affaire-produit" variants={{ survol: { scale: 1.05, rotate: -2 } }} transition={{ duration: 0.5, ease: EASE }}><Produit type={a.type} taille={300} teinte={a.teinte} /></motion.span>
                  <span className="cat-texte"><b>{a.nom}</b><span>dès <strong>{fcfa(a.prix)}</strong></span></span>
                </motion.a>
              ))}
            </div>
          </section>

          {/* ------------------------------ Bannière beige -------------------------- */}
          <motion.section className="clarte" {...entree()}>
            <div className="fete-texte">
              <h2>Une netteté<br />sans égale</h2>
              <p>Un espace de travail plus beau : image précise, couleurs vives et fréquence élevée pour des performances maximales.</p>
              <Pilule>Acheter</Pilule>
            </div>
            <div className="salon" aria-hidden>
              <span className="lampe" />
              <span className="meuble" />
              <span className="plante p1" /><span className="plante p2" />
              <span className="tele-salon"><Produit type="tele" taille={430} /></span>
            </div>
          </motion.section>

          {/* ------------------------------- La gamme ------------------------------- */}
          <section className="bloc">
            <Entete titre="Dernière gamme" />
            <div className="grille-4">
              {GAMME.map((g, k) => (
                <motion.article key={g.nom} className="gamme" {...entree(k * 0.05)} whileHover="survol">
                  <h3>{g.nom}</h3>
                  <motion.span className="gamme-produit" variants={{ survol: { y: -6 } }}><Produit type={g.type} taille={210} /></motion.span>
                  <Pilule>Acheter</Pilule>
                </motion.article>
              ))}
            </div>
          </section>

          {/* ------------------------------ Pied de page ---------------------------- */}
          <footer className="pied">
            <div className="pied-haut">
              <a href="#" className="marque"><Logo /> Leeral</a>
              <nav>{["Entreprise", "À propos", "Aide", "Politique"].map((l) => <a key={l} href="#">{l}</a>)}</nav>
            </div>
            <div className="pied-milieu">
              <div className="pied-gauche">
                <p>Leeral est votre adresse pour une électronique moderne et fiable : téléphones, audio, écrans et accessoires, garantis et livrés partout au Sénégal.</p>
                <h4>Recevoir la lettre</h4>
                <form className="lettre" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="Adresse e-mail" aria-label="Adresse e-mail" />
                  <button type="submit">Envoyer</button>
                </form>
              </div>
              {PIED.map((col, k) => <ul key={k}>{col.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>)}
            </div>
            <div className="pied-bas">
              <span>© 2026 Leeral. Tous droits réservés.</span>
              <span className="reseaux">{(["photo", "lien", "video", "f", "bulle"] as const).map((n) => <motion.a key={n} href="#" aria-label={n} whileHover={{ y: -3 }}><Ic n={n} t={16} /></motion.a>)}</span>
            </div>
          </footer>
        </div>
      </div>
    </MotionConfig>
  );
}

/* ====================================================================== */
/* Carte produit à pastilles de couleur                                    */
/* ====================================================================== */
type Variante = { nom: string; corps: string; ecran: string };
type Fiche = { nom: string; prix: number; ancien?: number; variantes: Variante[] };
function CarteProduit({ p, delai, ancien, separateur }: { p: Fiche; delai: number; ancien?: boolean; separateur?: boolean }) {
  const [v, setV] = useState(0);
  const variante = p.variantes[v];
  const [cle] = useState(() => `c${uid++}`);
  const pastilles = <span className="pastilles">{p.variantes.map((c, k) => <Pastille key={c.nom} c={c} actif={k === v} onClick={() => setV(k)} id={cle} />)}</span>;
  return (
    <motion.article className="carte-produit" {...entree(delai)}>
      <div className="carte-visuel">
        <AnimatePresence mode="wait">
          <motion.span key={v} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
            <Telephone corps={variante.corps} ecran={variante.ecran} taille={250} />
          </motion.span>
        </AnimatePresence>
      </div>
      <div className={separateur ? "carte-bas avec-separateur" : "carte-bas"}>
        <div>
          <h3>{p.nom}</h3>
          {ancien ? <span className="variante">{pastilles}<small>{variante.nom}</small></span> : <b className="prix">{fcfa(p.prix)}</b>}
        </div>
        {ancien ? <span className="prix-bloc"><b className="prix">{fcfa(p.prix)}</b>{p.ancien && <s>{fcfa(p.ancien)}</s>}</span> : pastilles}
      </div>
    </motion.article>
  );
}
function Pastille({ c, actif, onClick, id }: { c: Variante; actif: boolean; onClick: () => void; id: string }) {
  return (
    <button className="pastille" aria-label={c.nom} aria-pressed={actif} onClick={onClick}>
      <i style={{ background: c.corps }} />
      {actif && <motion.span className="anneau" layoutId={`anneau-${id}`} transition={{ type: "spring", stiffness: 500, damping: 35 }} />}
    </button>
  );
}

/* ====================================================================== */
/* Données de démonstration (fictives)                                     */
/* ====================================================================== */
const AVATARS = [{ l: "AD", c: "#E8C7A8" }, { l: "MS", c: "#B9C8E8" }, { l: "FK", c: "#C9E1CF" }, { l: "IB", c: "#E9D5F0" }];
const BULLES = [
  { x: "93%", y: 70, d: 70, t: "pleine" }, { x: "89.5%", y: 140, d: 38, t: "contour" }, { x: "87.5%", y: 186, d: 14, t: "point" },
  { x: "38.5%", y: 498, d: 14, t: "point" }, { x: "35%", y: 528, d: 64, t: "pleine" }, { x: "32%", y: 588, d: 40, t: "contour" },
];
const CHOIX: { nom: string; type: Prod; zone: string; fond: string; taille: number; teinte?: string; titre?: string; sous?: string; fleche?: boolean }[] = [
  { nom: "Écouteurs Air Pro", type: "ecouteurs", zone: "z-grand", fond: "linear-gradient(180deg,#C9CACC 0%,#A9AAAD 55%,#2A2A2C 100%)", taille: 360, titre: "Écouteurs Air Pro", sous: "Le son parfait, dans la poche" },
  { nom: "Manette Nuit", type: "manette", zone: "z-large", fond: "linear-gradient(180deg,#F1F2F3,#E2E4E6)", taille: 300, teinte: "#1F2023", fleche: true },
  { nom: "Casque Vision XR", type: "vr", zone: "z-haut", fond: "linear-gradient(160deg,#B9A58E,#5C4E40)", taille: 280 },
  { nom: "Portable Fin 14", type: "portable", zone: "z-petit1", fond: "linear-gradient(160deg,#EEF0F1,#D5D9DC)", taille: 220 },
  { nom: "Enceinte Cylindre", type: "enceinte", zone: "z-bas", fond: "linear-gradient(160deg,#D8D5CF,#A9A49B)", taille: 250, fleche: true },
  { nom: "Bague connectée", type: "bague", zone: "z-petit2", fond: "radial-gradient(circle at 60% 30%,#E7E8EA,#4A5160 70%)", taille: 200 },
];
const NOIR = { nom: "Noir mat", corps: "#2D2F33", ecran: "#6E6A8C" };
const BLEU = { nom: "Bleu ciel", corps: "#A8C2E6", ecran: "#3E7BD9" };
const MENTHE = { nom: "Menthe", corps: "#BFE3D2", ecran: "#2BB59A" };
const GRIS = { nom: "Gris", corps: "#E3E4E6", ecran: "#D98A3A" };
const TURQUOISE = { nom: "Turquoise", corps: "#A7D8D2", ecran: "#139C8C" };
const OR = { nom: "Titane sable", corps: "#CFC3AE", ecran: "#B9873F" };
const NOUVEAUTES: Fiche[] = [
  { nom: "Leeral X1", prix: 529000, ancien: 599000, variantes: [NOIR, BLEU, MENTHE] },
  { nom: "Pulsar 12 Pro", prix: 169000, ancien: 199000, variantes: [GRIS, BLEU, MENTHE] },
  { nom: "Leeral X1 Plus", prix: 459000, ancien: 529000, variantes: [TURQUOISE, BLEU, NOIR] },
  { nom: "Nova S5", prix: 349000, ancien: 399000, variantes: [NOIR, BLEU] },
];
const TENDANCES: Fiche[] = [
  { nom: "Leeral X1", prix: 489000, variantes: [NOIR, BLEU, MENTHE] },
  { nom: "Pulsar 12 Pro", prix: 169000, variantes: [GRIS, BLEU, MENTHE] },
  { nom: "Leeral X1 Plus", prix: 429000, variantes: [TURQUOISE, BLEU, NOIR] },
  { nom: "Nova S5 Ultra", prix: 529000, variantes: [OR, BLEU, MENTHE] },
  { nom: "Leeral X0 Max", prix: 589000, variantes: [NOIR, BLEU, MENTHE] },
  { nom: "Nova S4 Lite", prix: 329000, variantes: [NOIR, BLEU, MENTHE] },
];
const DIAPOS: { fantome: string; titre: string; texte: string; produit: Prod }[] = [
  { fantome: "Nova", titre: "Nova Pli 7", texte: "Multitâche futuriste, écran pliable d'une grande fluidité et performances de pointe : l'innovation tient dans votre main.", produit: "pliable" },
  { fantome: "Onde", titre: "Casque Onde", texte: "Réduction de bruit active, 40 heures d'autonomie et un son riche, pour le bus comme pour le bureau.", produit: "casque" },
];
const CATEGORIES: { nom: string; prix: number; type: Prod; teinte?: string; fond: string; h: number }[] = [
  { nom: "Enceinte Cylindre", prix: 199000, type: "enceinte", fond: "linear-gradient(160deg,#E9E7E3 30%,#8E8A83)", h: 365 },
  { nom: "Écouteurs Air Pro", prix: 89000, type: "ecouteurs", fond: "linear-gradient(160deg,#F2F2F3 30%,#9C9DA0)", h: 455 },
  { nom: "Manette Ombre", prix: 59000, type: "manette", teinte: "#18191B", fond: "radial-gradient(circle at 30% 30%,#F3EBA6,#B5A541 45%,#2C2A14)", h: 365 },
  { nom: "Caméra Zoom 4K", prix: 99000, type: "camera", fond: "linear-gradient(160deg,#EDEDEE 30%,#6E7076)", h: 320 },
];
const PROMOS = [
  { titre: "Le son de la fête", texte: "Jusqu'à −30 % sur les casques et les écouteurs.", fond: "#ECE8E2", visuel: <div className="duo-casques"><Produit type="casque" taille={240} teinte="#F2EFEA" /><Produit type="casque" taille={200} teinte="#F2A93B" /></div> },
  { titre: "Réduction de bruit, nouvelle génération", texte: "Jusqu'à −30 % sur les casques et les écouteurs.", fond: "#F6F6F6", visuel: <Produit type="casque" taille={330} teinte="#4A3F38" /> },
];
const AFFAIRES: { nom: string; prix: number; type: Prod; teinte?: string; fond: string }[] = [
  { nom: "Smartphone Vue+", prix: 399000, type: "pliable", fond: "linear-gradient(180deg,#3B4048,#0A0B0D 75%)" },
  { nom: "Ordinateur Noyau 14", prix: 649000, type: "portable", fond: "linear-gradient(180deg,#24364F,#0A0F18 75%)" },
  { nom: "Casque Onde", prix: 129000, type: "casque", teinte: "#2A2B2F", fond: "linear-gradient(180deg,#C79B57,#3B2A15 75%)" },
];
const GAMME: { nom: string; type: Prod }[] = [
  { nom: "Téléviseur QLED 8K", type: "ecran" }, { nom: "Téléviseur connecté", type: "tele" },
  { nom: "Barre de son 5.1", type: "barre" }, { nom: "Écran incurvé M7", type: "ecran" },
];
const PIED = [
  ["Téléphones", "Audio", "Ordinateurs", "Télévision", "Jeux"],
  ["Nous contacter", "Blog", "Carrières", "Informations légales"],
  ["Paiements", "Livraison", "Annulations et retours", "Questions fréquentes"],
  ["Conditions d'utilisation", "Sécurité", "Confidentialité", "Plan du site"],
];

/* ====================================================================== */
/* Styles (tokens dans style.md)                                           */
/* ====================================================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');
.leeral{--page:#DCE2F9;--encre:#0A0A0A;--gris:#6B6B6B;--carte:#F6F6F6;--trait:#E8E8E8;--beige:#EDE8E1;--acier:#567C9E;--corail:#E5484D;
font-family:Urbanist,system-ui,sans-serif;color:var(--encre);background:var(--page);padding:60px 48px}
.leeral *{box-sizing:border-box}.leeral h1,.leeral h2,.leeral h3,.leeral h4,.leeral p{margin:0}.leeral a{color:inherit;text-decoration:none}
.leeral ul{list-style:none;margin:0;padding:0}.leeral button,.leeral input{font:inherit;color:inherit}.leeral button{cursor:pointer;background:none;border:0;padding:0}
.cadre{max-width:1460px;margin:0 auto;background:#fff;border-radius:40px;overflow:hidden}
.nav{display:flex;align-items:center;gap:40px;height:116px;padding:0 96px;border-bottom:1px solid var(--trait)}
.marque{display:inline-flex;align-items:center;gap:12px;font-size:28px;font-weight:700;letter-spacing:-.01em}
.nav ul{display:flex;gap:40px;margin:0 auto;font-size:15px;font-weight:500}
.outils{display:flex;align-items:center;gap:16px}
.recherche{display:flex;align-items:center;gap:10px;width:200px;height:48px;padding:0 16px;border-radius:999px;background:#F5F5F5;color:#555}
.recherche input{border:0;background:none;outline:none;width:100%;font-size:15px}
.leeral .rond{position:relative;width:48px;height:48px;border-radius:50%;background:#F5F5F5;display:grid;place-items:center}
.rond i{position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;border-radius:9px;background:var(--encre);color:#fff;font-size:10px;font-style:normal;font-weight:700;display:grid;place-items:center}
.avatar{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#C79B57,#5B4026);color:#fff;font-size:13px;font-weight:700}
.heros{position:relative;display:grid;grid-template-columns:1fr 1fr;min-height:640px;padding:0 96px;overflow:hidden}
.heros-texte{align-self:center;display:flex;flex-direction:column;gap:22px;padding-bottom:40px;z-index:2}
.heros h1{font-size:78px;font-weight:500;line-height:1.08;letter-spacing:-.02em}
.heros-texte p{font-size:16px;line-height:1.45;color:#3A3A3A;max-width:500px}
.leeral .pilule{align-self:flex-start;display:inline-flex;align-items:center;gap:8px;background:var(--encre);color:#fff;border-radius:999px;padding:12px 22px;font-size:15px;font-weight:600}
.leeral .pilule.claire{background:#fff;color:var(--encre)}
.avis{display:flex;align-items:center;gap:16px;margin-top:16px;font-size:18px;font-weight:700;line-height:1.25}
.avis b{color:var(--corail)}
.avatars{display:flex}.avatars i{width:48px;height:48px;border-radius:50%;border:3px solid #fff;display:grid;place-items:center;font-size:12px;font-style:normal;font-weight:700;margin-left:-12px}.avatars i:first-child{margin-left:0}
.heros-visuel{position:relative;align-self:end;height:600px}
.heros-visuel:after{content:"";position:absolute;left:-10%;right:-30%;bottom:0;height:200px;background:linear-gradient(transparent,#fff 85%);pointer-events:none}
.disque{position:absolute;left:4%;bottom:-130px;width:710px;height:710px;border-radius:50%;background:#F5F5F5}
.sujet{position:absolute;left:12%;bottom:30px;filter:drop-shadow(0 30px 40px rgba(0,0,0,.12))}
.sujet img{display:block;max-height:580px}
.bulle{position:absolute;border-radius:50%;pointer-events:none}
.bulle.pleine{background:#EEEAE2}.bulle.contour{border:2px solid #1A1A1A;background:#fff}.bulle.point{background:#DCDCDC}
.bloc{padding:120px 96px 0}
.bloc.sans-droite{padding-right:0}.bloc.sans-droite .entete{padding-right:96px}
.entete{display:flex;align-items:center;justify-content:space-between;margin-bottom:64px}
.entete h2{font-size:68px;font-weight:500;letter-spacing:-.02em;line-height:1}
.tout-voir{border:1.5px solid var(--trait);border-radius:999px;padding:10px 20px;font-size:15px;font-weight:600}
.mosaique{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,310px);gap:16px;
grid-template-areas:"g g l l" "g g h p" "b b h q"}
.z-grand{grid-area:g}.z-large{grid-area:l}.z-haut{grid-area:h}.z-petit1{grid-area:p}.z-bas{grid-area:b}.z-petit2{grid-area:q}
.tuile{position:relative;border-radius:24px;overflow:hidden;display:grid;place-items:center}
.tuile-produit{display:grid;place-items:center}
.z-grand .tuile-produit{margin-bottom:180px}
.tuile-texte{position:absolute;left:40px;bottom:36px;color:#fff;display:flex;flex-direction:column;gap:12px}
.tuile-texte h3{font-size:46px;font-weight:500;letter-spacing:-.01em}.tuile-texte p{font-size:16px;opacity:.9;margin-bottom:22px}
.fleche-centre{position:absolute;width:64px;height:64px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 10px 30px rgba(0,0,0,.15)}
.leeral .sac{position:absolute;right:20px;bottom:20px;width:46px;height:46px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 6px 16px rgba(0,0,0,.12)}
.rail{display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;padding-right:96px;scrollbar-width:none}.rail::-webkit-scrollbar{display:none}
.rail .carte-produit{flex:0 0 460px;scroll-snap-align:start}
.carte-produit{background:var(--carte);border-radius:24px;padding:34px 36px 30px;display:flex;flex-direction:column;gap:20px}
.carte-visuel{height:300px;display:grid;place-items:center}
.carte-bas{display:flex;align-items:flex-end;justify-content:space-between;gap:16px}
.carte-bas h3{font-size:22px;font-weight:600;margin-bottom:12px}
.variante{display:flex;align-items:center;gap:10px}.variante small{font-size:13px;color:var(--gris)}
.pastilles{display:inline-flex;gap:10px}
.pastille{position:relative;width:26px;height:26px;display:grid;place-items:center}
.pastille i{width:20px;height:20px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}
.anneau{position:absolute;inset:0;border-radius:50%;border:1.5px solid var(--encre)}
.prix-bloc{display:flex;align-items:baseline;gap:12px}
.prix{font-size:24px;font-weight:800;font-style:italic;letter-spacing:-.01em}
.prix-bloc s{font-size:14px;color:var(--gris);font-style:italic}
.avec-separateur{align-items:center}.avec-separateur>.pastilles{padding-left:22px;border-left:1px solid var(--trait);align-self:stretch;align-items:center}
.avec-separateur .prix{display:block}
.fleches{display:flex;justify-content:center;margin-top:44px;padding-right:96px}
.fleches button{width:52px;height:46px;display:grid;place-items:center;border:1px solid var(--trait)}
.fleches button:first-child{border-radius:999px 0 0 999px;border-right:0}.fleches button.noir{background:var(--encre);color:#fff;border-color:var(--encre);border-radius:0 999px 999px 0}
.banniere-bleue{position:relative;margin-top:110px;height:690px;background:var(--acier);overflow:hidden;color:#fff}
.diapo{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:0 112px}
.mot-fantome{position:absolute;left:-40px;bottom:-110px;font-size:430px;font-weight:500;letter-spacing:-.04em;color:rgba(20,40,60,.14);line-height:1}
.diapo-texte{position:relative;display:flex;flex-direction:column;gap:22px;max-width:520px}
.diapo-texte h2{font-size:72px;font-weight:500;letter-spacing:-.02em;line-height:1}
.diapo-texte p{font-size:16px;line-height:1.45;opacity:.9}
.diapo-produit{display:grid;place-items:center;filter:drop-shadow(0 30px 40px rgba(0,0,0,.35))}
.points{position:absolute;left:112px;bottom:44px;display:flex;gap:8px}
.points button{width:10px;height:10px;border-radius:999px;background:rgba(255,255,255,.4);transition:width .3s}
.points button.actif{width:30px;background:#fff}
.categories{display:grid;grid-template-columns:repeat(4,1fr);gap:46px;align-items:end;height:455px}
.categorie{position:relative;border-radius:24px;overflow:hidden;display:block;color:#fff;transition:height .45s cubic-bezier(.22,1,.36,1)}
.cat-produit{position:absolute;inset:0 0 70px;display:grid;place-items:center}
.categorie:after,.affaire:after{content:"";position:absolute;inset:40% 0 0;background:linear-gradient(transparent,rgba(0,0,0,.72));pointer-events:none}
.cat-texte{position:absolute;left:24px;bottom:22px;z-index:1;display:flex;flex-direction:column;gap:6px;color:#fff}
.cat-texte b{font-size:20px;font-weight:700}.cat-texte>span{font-size:13px;opacity:.9}.cat-texte strong{font-size:22px;font-weight:800;margin-left:4px}
.duo{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:120px}
.promo{height:545px;border-radius:24px;display:grid;grid-template-columns:1.1fr 1fr;align-items:center;padding:0 60px 0 30px}
.promo-visuel{display:grid;place-items:center}
.duo-casques{display:flex;align-items:flex-end}.duo-casques svg+svg{margin-left:-60px}
.promo-texte{display:flex;flex-direction:column;gap:14px}
.promo-texte h3{font-size:44px;font-weight:500;line-height:1.1;letter-spacing:-.015em}
.promo-texte p{font-size:14px;color:#555;max-width:260px;margin-bottom:18px}
.grille-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.grille-4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.fete{margin:120px 96px 0;height:585px;background:var(--carte);border-radius:24px;display:grid;grid-template-columns:1fr 1fr;overflow:hidden;position:relative}
.fete-texte{align-self:center;padding-left:56px;display:flex;flex-direction:column;gap:22px;max-width:620px;z-index:1}
.fete-texte h2{font-size:64px;font-weight:500;line-height:1.08;letter-spacing:-.02em}
.fete-texte p{font-size:15px;line-height:1.45;color:#444;max-width:440px}
.fete-produit{position:absolute;right:-150px;top:-10px}
.affaire{position:relative;height:460px;border-radius:24px;overflow:hidden;display:grid;place-items:center}
.affaire-produit{margin-bottom:60px}
.clarte{margin:120px 96px 0;height:475px;background:var(--beige);border-radius:24px;display:grid;grid-template-columns:1fr 1.1fr;overflow:hidden;position:relative}
.salon{position:relative}
.lampe{position:absolute;right:-30px;top:-30px;width:190px;height:150px;border-radius:0 0 60px 120px;background:radial-gradient(circle at 40% 30%,#D2D0CB,#9E9B95)}
.meuble{position:absolute;right:-20px;bottom:0;width:150px;height:330px;background:linear-gradient(90deg,#D9B98C,#E8CFA6);border-radius:6px 0 0 0;box-shadow:inset 18px 0 0 #C9A574}
.plante{position:absolute;width:56px;height:56px;border-radius:0 0 22px 22px;background:#F4F2EE;box-shadow:0 -26px 0 -6px #7FA35A,0 -40px 0 -14px #5E8A3E}
.plante.p1{right:40px;top:150px}.plante.p2{right:40px;bottom:60px}
.tele-salon{position:absolute;left:20px;top:30px}
.gamme{background:var(--carte);border-radius:24px;height:340px;padding:28px;display:flex;flex-direction:column;justify-content:space-between}
.gamme h3{font-size:22px;font-weight:700}
.gamme-produit{align-self:center;display:grid;margin:-30px 0 -20px}
.pied{padding:120px 96px 50px}
.pied-haut{display:flex;align-items:center;justify-content:space-between;padding-bottom:64px}
.pied-haut nav{display:flex;gap:110px;font-size:16px;font-weight:500}
.pied-milieu{display:grid;grid-template-columns:1.7fr 1fr 1fr 1fr 1fr;gap:40px;padding-bottom:56px;border-bottom:1px solid var(--trait)}
.pied-gauche p{font-size:15px;line-height:1.5;color:#555;max-width:470px}
.pied-gauche h4{font-size:20px;font-weight:500;margin:44px 0 18px}
.lettre{display:flex;align-items:center;justify-content:space-between;width:340px;height:62px;padding:6px 6px 6px 22px;border:1.5px solid var(--trait);border-radius:999px}
.lettre input{border:0;outline:none;background:none;font-size:15px;width:60%}
.leeral .lettre button{height:100%;padding:0 22px;border-radius:999px;background:var(--encre);color:#fff;font-weight:600}
.pied-milieu ul li{font-size:15px;color:#555;margin-bottom:20px}
.pied-milieu a:hover{color:var(--encre)}
.pied-bas{display:flex;align-items:center;justify-content:space-between;padding-top:44px;font-size:15px;color:#555}
.reseaux{display:flex;gap:12px}
.reseaux a{width:46px;height:46px;border-radius:50%;border:1.5px solid var(--trait);display:grid;place-items:center;color:var(--encre)}
@media (max-width:1000px){.leeral{padding:12px}.nav{padding:0 20px;gap:16px}.nav ul,.recherche{display:none}.heros{grid-template-columns:1fr;padding:40px 20px}.heros h1{font-size:48px}
.bloc{padding:72px 20px 0}.bloc.sans-droite .entete,.rail,.fleches{padding-right:20px}.entete h2{font-size:38px}
.mosaique{grid-template-columns:1fr 1fr;grid-template-rows:none;grid-auto-rows:240px;grid-template-areas:"g g" "g g" "l l" "h p" "h q" "b b"}
.categories{grid-template-columns:1fr 1fr;height:auto}.duo,.grille-3,.grille-4{grid-template-columns:1fr}.fete,.clarte{margin:72px 20px 0;grid-template-columns:1fr;height:auto;padding:40px 0}
.diapo{grid-template-columns:1fr;padding:40px 24px}.pied{padding:72px 20px 32px}.pied-milieu{grid-template-columns:1fr 1fr}.pied-haut nav{gap:24px}}
`;
