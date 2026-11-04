/**
 * Modèle 05 — Vitrine de joaillerie « Maison Éclat » (landing page de luxe)
 * Reconstruction originale (nom, textes, illustrations et code réécrits) d'après une maquette
 * publique de site de joaillerie : héros vert profond avec un mot géant en serif derrière le bijou,
 * cartes en verre, frises en chaîne d'or, grilles de créations, pied de page vert.
 * Les photos de la référence ne sont PAS reprises : les bijoux sont dessinés en SVG ;
 * remplacer par de vraies photos détourées (prop `photoHeros`).
 * Relevé élément par élément : voir README.md.
 *
 * Dépendances : react 18+, motion 11+ (`npm i motion`).
 * Polices conseillées (Google Fonts) : Playfair Display, Great Vibes, Poppins.
 */
import { useState, type ReactNode } from "react";
import { MotionConfig, motion } from "motion/react";

/* ====================================================================== */
/* Mouvement : séquence d'ouverture du héros (voir animations.md)         */
/* ====================================================================== */
const SORTIE = [0.16, 1, 0.3, 1] as const; // arrivée longue et douce
const T = { photo: 0.5, mot: 1.2, vague1: 2.0, vague2: 2.75, appel: 3.55 }; // départs relevés dans la vidéo (s)
const entree = (delai: number, de: { x?: number; y?: number } = {}) => ({
  initial: { opacity: 0, x: de.x ?? 0, y: de.y ?? 0 },
  animate: { opacity: 1, x: 0, y: 0 },
  transition: { duration: 0.5, ease: SORTIE, delay: delai },
});
const AU_DEFILEMENT = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};
const transitionDefilement = (delai = 0) => ({ duration: 0.6, ease: SORTIE, delay: delai });

/* ====================================================================== */
/* Illustrations SVG (bijoux génériques, dessinés pour ce modèle)          */
/* ====================================================================== */
function Degrades() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        <linearGradient id="or" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF1B8" /><stop offset=".35" stopColor="#E8B94A" /><stop offset=".65" stopColor="#B07A1E" /><stop offset="1" stopColor="#F6D77A" />
        </linearGradient>
        <linearGradient id="emeraude" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7FF0A8" /><stop offset=".45" stopColor="#13A85A" /><stop offset="1" stopColor="#05482A" />
        </linearGradient>
        <radialGradient id="perle-verte" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#9BF5B9" /><stop offset=".5" stopColor="#1DB866" /><stop offset="1" stopColor="#086B39" />
        </radialGradient>
        <radialGradient id="diamant" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#FFFFFF" /><stop offset=".6" stopColor="#E6EEF2" /><stop offset="1" stopColor="#AFC0C9" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/** Bracelet suspendu : maillons d'or et émeraudes serties de petits diamants. */
function BraceletSuspendu() {
  return (
    <svg viewBox="0 0 120 560" className="bracelet-suspendu" role="img" aria-label="Bracelet en or et émeraudes">
      {Array.from({ length: 7 }, (_, k) => {
        const y = 20 + k * 76;
        return k % 2 === 0 ? (
          <g key={k}>
            <rect x="30" y={y} width="60" height="62" rx="8" fill="url(#or)" />
            <rect x="38" y={y + 8} width="44" height="46" rx="5" fill="url(#emeraude)" stroke="#0B5B33" />
            <rect x="46" y={y + 16} width="28" height="30" rx="3" fill="none" stroke="#9BF5B9" strokeOpacity=".5" />
            {Array.from({ length: 10 }, (_, j) => (
              <circle key={j} cx={34 + (j % 5) * 13} cy={j < 5 ? y + 3 : y + 59} r="2.2" fill="url(#diamant)" />
            ))}
          </g>
        ) : (
          <g key={k} fill="none" stroke="url(#or)" strokeWidth="7">
            <ellipse cx="48" cy={y + 31} rx="13" ry="22" />
            <ellipse cx="72" cy={y + 31} rx="13" ry="22" />
          </g>
        );
      })}
      <circle cx="78" cy="96" r="3" fill="#fff" className="scintille" />
      <circle cx="40" cy="250" r="2.4" fill="#fff" className="scintille" style={{ animationDelay: "1.2s" }} />
    </svg>
  );
}

type Piece = "jonc" | "gouttes" | "bague" | "torsades" | "chaine" | "creoles" | "pendentif" | "fleurs";
function Bijou({ type, taille = 120 }: { type: Piece; taille?: number }) {
  const s = { width: taille, height: taille };
  switch (type) {
    case "jonc":
      return (
        <svg viewBox="0 0 120 120" style={s} role="img" aria-label="Jonc">
          <ellipse cx="60" cy="60" rx="30" ry="46" fill="none" stroke="url(#or)" strokeWidth="14" />
          {Array.from({ length: 9 }, (_, k) => <circle key={k} cx={60 + 30 * Math.cos((k / 9) * 2 * Math.PI)} cy={60 + 46 * Math.sin((k / 9) * 2 * Math.PI)} r="3.2" fill="url(#diamant)" />)}
        </svg>
      );
    case "gouttes":
      return (
        <svg viewBox="0 0 120 120" style={s} role="img" aria-label="Boucles d'oreilles gouttes">
          {[38, 82].map((x) => (
            <g key={x}>
              <circle cx={x} cy="18" r="6" fill="url(#or)" />
              <line x1={x} y1="24" x2={x} y2="56" stroke="url(#or)" strokeWidth="2" />
              <path d={`M${x} 56 C${x + 16} 76 ${x + 14} 100 ${x} 102 C${x - 14} 100 ${x - 16} 76 ${x} 56Z`} fill="url(#perle-verte)" stroke="url(#or)" strokeWidth="3" />
            </g>
          ))}
        </svg>
      );
    case "bague":
      return (
        <svg viewBox="0 0 120 120" style={s} role="img" aria-label="Bague">
          <ellipse cx="62" cy="74" rx="30" ry="32" fill="none" stroke="url(#or)" strokeWidth="9" />
          <path d="M44 40 L60 24 L80 24 L94 40 L70 58Z" fill="url(#emeraude)" stroke="url(#or)" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );
    case "torsades":
      return (
        <svg viewBox="0 0 120 120" style={s} role="img" aria-label="Boucles torsadées">
          {[[22, 30], [58, 66]].map(([x, y]) => (
            <g key={x} fill="none" stroke="url(#or)" strokeWidth="7" strokeLinecap="round">
              <path d={`M${x} ${y + 30} C${x + 12} ${y} ${x + 28} ${y} ${x + 40} ${y + 30}`} />
              <path d={`M${x} ${y} C${x + 12} ${y + 30} ${x + 28} ${y + 30} ${x + 40} ${y}`} />
            </g>
          ))}
        </svg>
      );
    case "chaine":
      return (
        <svg viewBox="0 0 120 120" style={s} role="img" aria-label="Bracelet chaîne">
          {Array.from({ length: 14 }, (_, k) => {
            const a = (k / 14) * 2 * Math.PI;
            const cx = 60 + 40 * Math.cos(a);
            const cy = 60 + 40 * Math.sin(a);
            return <ellipse key={k} cx={cx} cy={cy} rx="7" ry="4.5" transform={`rotate(${(a * 180) / Math.PI + 90} ${cx} ${cy})`} fill="none" stroke="url(#or)" strokeWidth="3" />;
          })}
          {[0, 1, 2, 3].map((k) => <circle key={k} cx={60 + 40 * Math.cos(k * 1.6 + 0.4)} cy={60 + 40 * Math.sin(k * 1.6 + 0.4)} r="7" fill="url(#perle-verte)" />)}
        </svg>
      );
    case "creoles":
      return (
        <svg viewBox="0 0 120 120" style={s} role="img" aria-label="Créoles">
          {[[30, 30], [66, 52]].map(([x, y]) => (
            <g key={x}>
              <rect x={x} y={y} width="22" height="44" rx="11" fill="none" stroke="url(#or)" strokeWidth="6" />
              <circle cx={x + 11} cy={y + 2} r="6" fill="url(#perle-verte)" />
              <circle cx={x + 11} cy={y + 44} r="6" fill="url(#perle-verte)" />
            </g>
          ))}
        </svg>
      );
    case "pendentif":
      return (
        <svg viewBox="0 0 120 120" style={s} role="img" aria-label="Pendentif">
          <path d="M20 10 Q60 70 100 10" fill="none" stroke="url(#or)" strokeWidth="2" />
          <path d="M60 52 C80 72 78 102 60 108 C42 102 40 72 60 52Z" fill="#E07A1F" stroke="url(#or)" strokeWidth="4" />
          <path d="M60 62 C72 76 70 98 60 102" fill="none" stroke="#FFD49A" strokeOpacity=".6" strokeWidth="2" />
        </svg>
      );
    case "fleurs":
      return (
        <svg viewBox="0 0 120 120" style={s} role="img" aria-label="Puces fleurs en diamants">
          {[[38, 40], [80, 82]].map(([x, y]) => (
            <g key={x}>
              {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy]) => <circle key={`${dx}${dy}`} cx={x + dx * 10} cy={y + dy * 10} r="11" fill="url(#diamant)" stroke="#C9D6DC" />)}
              <circle cx={x} cy={y} r="4" fill="url(#or)" />
            </g>
          ))}
        </svg>
      );
  }
}

/* ====================================================================== */
/* Primitives                                                              */
/* ====================================================================== */
function ChaineOr() {
  return <div className="chaine-or" role="presentation" />;
}

function Verre({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`verre ${className}`}>{children}</div>;
}

const ICONES = {
  panier: "M3 4h2l2 9h9l2-6H6M8 17h.01M15 17h.01",
  plus: "M10 4v12M4 10h12",
  fleche: "M6 14 14 6M7 6h7v7",
  chevron: "M8 5l5 5-5 5",
  courbe: "M3 6c4 0 6 2 8 6s4 4 6 2M14 11l3 3-3 1",
  sac: "M5 7h10l-1 10H6zM8 7V5a2 2 0 0 1 4 0v2",
  courriel: "M3 5h14v10H3zM3 5l7 6 7-6",
};
function Icone({ n, taille = 16 }: { n: keyof typeof ICONES; taille?: number }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={ICONES[n]} />
    </svg>
  );
}

/* ====================================================================== */
/* Page                                                                    */
/* ====================================================================== */
export default function VitrineJoaillerie({ photoHeros }: { photoHeros?: string }) {
  const [consentement, setConsentement] = useState(false);
  const [rejouer, setRejouer] = useState(0);

  return (
    <MotionConfig reducedMotion="user">
      <div className="eclat">
        <style>{CSS}</style>
        <Degrades />

        {/* ------------------------------ Héros ------------------------------ */}
        <section className="heros" key={rejouer}>
          <nav className="nav">
            <motion.ul className="liens" {...entree(T.vague1, { y: -16 })}>
              {["Accueil", "Créations", "Services", "Contact"].map((l) => <li key={l}><a href={`#${l}`}>{l}</a></li>)}
            </motion.ul>
            <motion.a className="logo" href="#Accueil" {...entree(T.vague1, { y: -16 })}>
              <small>Maison</small><span>Éclat</span>
            </motion.a>
            <motion.div className="panier" {...entree(T.vague1, { y: -16 })}>
              <Icone n="panier" taille={20} />
              <span><small>articles</small><b>N° 35-65855</b></span>
              <button className="pastille-peche" aria-label="Ouvrir le panier"><Icone n="chevron" taille={10} /></button>
            </motion.div>
          </nav>

          <motion.p className="accroche" {...entree(T.vague2, { x: -16 })}>
            Comment photographier un bijou<br />comme un objet de collection
            <Icone n="courbe" taille={28} />
          </motion.p>

          <motion.h1 className="mot-geant" initial={{ opacity: 0, y: -60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: SORTIE, delay: T.mot }}>
            <span className="petit-mot">Révélez</span>
            <span className="grand-mot" aria-hidden>Élégance</span>
            <span className="sr">Révélez l'élégance</span>
          </motion.h1>

          <motion.div className="sujet" initial={{ opacity: 0, y: 260 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: SORTIE, delay: T.photo }}>
            {photoHeros ? <img src={photoHeros} alt="" /> : <BraceletSuspendu />}
          </motion.div>

          <motion.div className="carte-produit" {...entree(T.vague1, { x: 40 })}>
            <Verre className="ligne-verre">
              <span className="vignette"><Bijou type="pendentif" taille={44} /></span>
              <b className="serif">Éclat<br />d'ambre</b>
              <button className="rond-contour" aria-label="Ajouter au panier"><Icone n="plus" /></button>
            </Verre>
          </motion.div>

          <motion.div className="carte-texte" {...entree(T.vague1, { x: -40 })}>
            <Verre><p className="serif">Découvrez l'allure de bijoux d'exception, façonnés avec minutie pour sublimer chacune de vos tenues.</p></Verre>
          </motion.div>

          <motion.a className="bouton-peche" href="#Créations" {...entree(T.appel, { y: 16 })} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            Découvrir
          </motion.a>

          <motion.div className="carte-communaute" {...entree(T.vague2, { x: 40 })}>
            <Verre>
              <div className="ligne">
                <b className="serif">Une communauté<br />de passionnées</b>
                <button className="rond-sombre" aria-label="Rejoindre"><Icone n="fleche" /></button>
              </div>
              <p className="minuscule">Des milliers de clientes partagent leurs pièces et leurs conseils de style.</p>
              <div className="ligne">
                <span className="chiffre serif">4,5 k</span>
                <span className="avatars">{["#C98A5E", "#E9C3A6", "#8E5B3E"].map((c) => <i key={c} style={{ background: c }} />)}</span>
              </div>
            </Verre>
          </motion.div>

          <button className="rejouer" onClick={() => setRejouer((v) => v + 1)} aria-label="Rejouer l'animation d'ouverture">↻</button>
        </section>

        <ChaineOr />

        {/* --------------------------- Créations ---------------------------- */}
        <section className="clair motif" id="Créations">
          <motion.header className="titre-section" {...AU_DEFILEMENT} transition={transitionDefilement()}>
            <h2 className="serif">Nos créations</h2>
            <p>Découvrez la variété de nos pièces.</p>
          </motion.header>
          <div className="grille-creations">
            {CREATIONS.map((c, k) => (
              <motion.a key={c.nom} href="#" className="carte-creation" {...AU_DEFILEMENT} transition={transitionDefilement(k * 0.06)} whileHover="survol">
                <motion.span className="illustration" variants={{ survol: { scale: 1.06, y: -4 } }} transition={{ duration: 0.35, ease: SORTIE }}>
                  <Bijou type={c.type} taille={130} />
                </motion.span>
                <span className="serif nom">{c.nom}</span>
              </motion.a>
            ))}
          </div>

          {/* ----------------------------- Nouveautés ----------------------------- */}
          <motion.article className="nouveautes" {...AU_DEFILEMENT} transition={transitionDefilement()}>
            <div className="halo-vert" aria-hidden />
            <div className="texte">
              <h3 className="serif">Nouveautés<br />Collection Maillons</h3>
              <p>Inspirée d'un fermoir dessiné en 1962 : une chaîne franche, pensée pour durer.</p>
              <motion.a href="#" className="bouton-vert" whileHover={{ x: 4 }}>
                <span className="rond-blanc"><Icone n="sac" taille={14} /></span> Voir les nouveautés
              </motion.a>
            </div>
            <div className="visuel"><Bijou type="chaine" taille={300} /></div>
          </motion.article>

          {/* ------------------------- Collections emblématiques ------------------------- */}
          <motion.header className="titre-section" {...AU_DEFILEMENT} transition={transitionDefilement()}>
            <h2 className="serif">Collections emblématiques</h2>
            <p>Depuis 35 ans, nos pièces signature.</p>
          </motion.header>
          <div className="grille-collections">
            {COLLECTIONS.map((c, k) => (
              <motion.figure key={k} className="photo-collection" {...AU_DEFILEMENT} transition={transitionDefilement(k * 0.06)} whileHover={{ y: -4 }}>
                <Bijou type={c} taille={170} />
              </motion.figure>
            ))}
          </div>
        </section>

        <ChaineOr />

        {/* ------------------------------ Pied de page ------------------------------ */}
        <footer className="pied" id="Contact">
          <div className="colonne">
            <p>Service client au Sénégal</p>
            <p>Lundi–vendredi 9 h – 19 h</p>
            <p>Samedi 9 h – 14 h · dimanche fermé</p>
            <div className="reseaux">{["f", "◎", "♪", "𝕏"].map((r) => <a key={r} href="#" aria-label="Réseau social">{r}</a>)}</div>
          </div>
          <div className="colonne centre">
            <form className="abonnement" onSubmit={(e) => e.preventDefault()}>
              <Icone n="courriel" />
              <input type="email" placeholder="votre@adresse.sn" aria-label="Adresse e-mail" required />
              <button type="submit">S'abonner</button>
            </form>
            <label className="consentement">
              <input type="checkbox" checked={consentement} onChange={(e) => setConsentement(e.target.checked)} />
              <span>Oui, je souhaite recevoir des informations personnalisées sur les produits, les offres et les nouveautés. <a href="#">En savoir plus</a></span>
            </label>
          </div>
          <div className="colonne">
            <button className="langue"><span className="drapeau" aria-hidden /> Français <Icone n="chevron" taille={12} /></button>
            <p>Service client international</p>
          </div>
          <div className="logo-pied"><small>Maison</small><span>Éclat</span></div>
          <p className="copyright">© 2026 Maison Éclat. Tous droits réservés. Fait main à Dakar.</p>
        </footer>
      </div>
    </MotionConfig>
  );
}

/* ====================================================================== */
/* Données de démonstration                                                */
/* ====================================================================== */
const CREATIONS: { nom: string; type: Piece }[] = [
  { nom: "Bracelets", type: "jonc" },
  { nom: "Boucles d'oreilles", type: "gouttes" },
  { nom: "Bagues", type: "bague" },
  { nom: "Torsades", type: "torsades" },
  { nom: "Malachite", type: "chaine" },
  { nom: "Créoles", type: "creoles" },
];
const COLLECTIONS: Piece[] = ["bague", "pendentif", "fleurs", "gouttes", "jonc", "chaine"];

/* ====================================================================== */
/* Styles (tokens dans style.md)                                           */
/* ====================================================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@400;700&family=Poppins:wght@400;500;600&display=swap');
.eclat{--vert-nuit:#0B1E12;--vert:#1E6B3E;--vert-vif:#3FBF6E;--vert-clair:#7EE29E;--or:#E3B04B;--peche:#F7BF8C;--encre:#262626;--muet:#7A7A7A;
--clair:#E9EAE8;--verre-clair:rgba(244,250,246,.75);--r-heros:56px;
font-family:"Poppins",system-ui,sans-serif;color:var(--encre);background:var(--clair);border-radius:var(--r-heros) var(--r-heros) 0 0;overflow:hidden;max-width:1200px;margin:0 auto}
.eclat *{box-sizing:border-box}.eclat h1,.eclat h2,.eclat h3,.eclat p,.eclat figure{margin:0}.eclat a{color:inherit;text-decoration:none}.eclat button{font:inherit;color:inherit;cursor:pointer}
.serif{font-family:"Playfair Display","Cormorant Garamond",Georgia,serif;font-weight:400}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.ligne{display:flex;align-items:center;justify-content:space-between;gap:12px}
.heros{position:relative;height:720px;color:#fff;overflow:hidden;
background:radial-gradient(38% 55% at 62% 28%,rgba(126,226,158,.75),rgba(63,191,110,.35) 40%,transparent 75%),radial-gradient(120% 90% at 50% 20%,#1F6A3C,#0E2E19 60%,#08160D)}
.nav{position:absolute;inset:28px 64px auto;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;z-index:5}
.liens{display:flex;gap:40px;list-style:none;margin:0;padding:0;font-size:12px}
.eclat .logo{display:flex;flex-direction:column;align-items:center;line-height:.8;color:var(--or)}
.logo small{font-family:"Playfair Display",Georgia,serif;font-size:11px;color:#F3D9A0;margin:0 0 -6px 34px;position:relative;z-index:1}
.logo span{font-family:"Great Vibes","Pinyon Script",cursive;font-size:44px}
.panier{justify-self:end;display:flex;align-items:center;gap:10px}
.panier small,.panier b{display:block;font-size:9px;font-weight:400;line-height:1.2}
.eclat .pastille-peche{width:18px;height:18px;border-radius:50%;border:0;background:var(--peche);color:#5B3416;display:grid;place-items:center;padding:0}
.accroche{position:absolute;left:90px;top:160px;font-size:12px;line-height:1.5;z-index:4;display:flex;flex-direction:column}
.accroche svg{color:var(--or);margin-left:150px;margin-top:-10px}
.mot-geant{position:absolute;inset:220px 40px auto;z-index:1;pointer-events:none;font-weight:400}
.petit-mot{position:absolute;left:180px;top:6px;font-size:40px;color:#fff;letter-spacing:-.01em;z-index:2}
.grand-mot{display:block;font-family:"Playfair Display",Georgia,serif;font-size:250px;line-height:.95;letter-spacing:-.04em;text-align:center;padding-top:40px;
background:linear-gradient(90deg,#1E6B3E 0%,#2F8F54 30%,#7EE29E 52%,#3AAE66 70%,#1E6B3E 100%);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:.9}
.sujet{position:absolute;left:calc(50% - 60px);bottom:-20px;width:120px;z-index:2;display:flex;justify-content:center;filter:drop-shadow(0 30px 40px rgba(0,0,0,.45))}
.sujet img{max-height:640px}
.bracelet-suspendu{width:120px;height:560px}
.scintille{animation:scintille 2.4s ease-in-out infinite}
@keyframes scintille{0%,100%{opacity:0}50%{opacity:1}}
.verre{background:rgba(255,255,255,.1);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.14);border-radius:26px;padding:16px 18px;box-shadow:0 20px 40px rgba(0,0,0,.18)}
.ligne-verre{display:flex;align-items:center;gap:14px;padding:10px 12px}
.carte-produit{position:absolute;right:80px;top:190px;z-index:4}
.vignette{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#1C4A2C,#0D2416);display:grid;place-items:center}
.carte-produit b{font-size:17px;line-height:1.2;font-weight:400}
.eclat .rond-contour{width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(255,255,255,.85);background:none;display:grid;place-items:center;margin-left:10px}
.carte-texte{position:absolute;left:116px;top:520px;width:224px;z-index:4}
.carte-texte p{font-size:11px;line-height:1.45}
.eclat .bouton-peche{position:absolute;left:90px;bottom:62px;z-index:4;background:var(--peche);color:#3A2414;border-radius:999px;padding:9px 20px;font-size:15px}
.carte-communaute{position:absolute;right:76px;bottom:62px;width:236px;z-index:4}
.carte-communaute b{font-size:17px;line-height:1.2}
.eclat .rond-sombre{width:52px;height:52px;border-radius:50%;border:0;background:rgba(0,0,0,.35);display:grid;place-items:center;flex:none}
.minuscule{font-size:7px;line-height:1.5;opacity:.85;margin:10px 0}
.chiffre{font-size:34px;letter-spacing:-.02em}
.avatars{display:flex}.avatars i{width:26px;height:26px;border-radius:50%;border:2px solid #fff;margin-left:-8px;display:block}
.eclat .rejouer{position:absolute;right:16px;top:90px;z-index:6;width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:rgba(0,0,0,.2);color:#fff}
.chaine-or{height:22px;background:
radial-gradient(ellipse 7px 9px at 50% 50%,transparent 52%,#8A5A12 56%,#F9E08F 66%,#C8902B 78%,transparent 84%) 0 0/13px 22px repeat-x,
radial-gradient(ellipse 7px 9px at 50% 50%,transparent 52%,#8A5A12 56%,#F2CF6B 66%,#B07A1E 78%,transparent 84%) 6.5px 0/13px 22px repeat-x,
linear-gradient(#E9C567,#B7862A);box-shadow:0 2px 6px rgba(0,0,0,.25)}
.clair{padding:64px 0 80px}
.motif{background-color:var(--clair);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 4 L56 30 L30 56 L4 30Z M30 16 L44 30 L30 44 L16 30Z' fill='none' stroke='%23d9dad7' stroke-width='1.2'/%3E%3C/svg%3E")}
.titre-section{text-align:center;margin:0 0 40px}
.titre-section h2{font-size:46px;letter-spacing:-.01em}
.titre-section p{font-size:18px;color:var(--muet);margin-top:6px;letter-spacing:.02em}
.grille-creations{display:grid;grid-template-columns:repeat(3,256px);justify-content:center;gap:32px}
.carte-creation{height:290px;border-radius:40px;background:linear-gradient(180deg,rgba(236,245,239,.9),rgba(226,236,229,.8));border:1px solid rgba(255,255,255,.8);
box-shadow:0 10px 30px rgba(0,0,0,.06),inset 0 1px 0 #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px}
.illustration{display:block}
.nom{font-size:22px;color:#3A3A3A}
.nouveautes{position:relative;margin:80px auto;width:860px;height:420px;border-radius:44px;overflow:hidden;background:var(--verre-clair);border:1px solid #fff;box-shadow:0 20px 50px rgba(0,0,0,.08);display:grid;grid-template-columns:1fr 1fr;align-items:center}
.halo-vert{position:absolute;left:-60px;top:20px;width:340px;height:400px;background:radial-gradient(closest-side,#22D36B,rgba(34,211,107,.25) 60%,transparent);filter:blur(30px)}
.nouveautes .texte{position:relative;padding:0 56px}
.nouveautes h3{font-size:40px;line-height:1.1;font-weight:700;color:#2B2B2B}
.nouveautes p{font-size:13px;color:#444;margin:20px 0 26px;max-width:320px}
.eclat .bouton-vert{display:inline-flex;align-items:center;gap:12px;background:linear-gradient(90deg,#16C467,#1FD98A);color:#fff;border-radius:999px;padding:6px 20px 6px 6px;font-size:13px;font-weight:600;box-shadow:0 10px 24px rgba(22,196,103,.35)}
.rond-blanc{width:32px;height:32px;border-radius:50%;background:#fff;color:#16A85A;display:grid;place-items:center}
.visuel{display:grid;place-items:center;position:relative}
.grille-collections{display:grid;grid-template-columns:repeat(3,330px);justify-content:center;gap:28px}
.photo-collection{height:330px;border-radius:52px;overflow:hidden;display:grid;place-items:center;
background:radial-gradient(60% 60% at 50% 40%,#1D5A36,#0B2616 70%,#06140B);box-shadow:inset 0 0 40px rgba(0,0,0,.5),0 16px 30px rgba(0,0,0,.12)}
.pied{position:relative;color:#fff;padding:56px 72px 40px;display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:40px;
background:radial-gradient(70% 90% at 50% 30%,#1E7A44,#0D3A1E 70%,#081C10)}
.pied .colonne{display:flex;flex-direction:column;gap:12px;font-size:13px}
.reseaux{display:flex;gap:10px}.eclat .reseaux a{width:28px;height:28px;border-radius:50%;background:#fff;color:#123;display:grid;place-items:center;font-size:12px}
.abonnement{display:flex;align-items:center;gap:10px;background:#fff;color:#333;border-radius:999px;padding:6px 6px 6px 16px}
.abonnement input{flex:1;border:0;outline:none;font:inherit;font-size:13px;min-width:0}
.eclat .abonnement button{border:0;border-radius:999px;background:#0F5A2E;color:#fff;padding:10px 18px;font-size:12px}
.consentement{display:flex;gap:10px;font-size:10px;line-height:1.5;opacity:.9}
.consentement input{width:22px;height:22px;flex:none;accent-color:#16C467}
.eclat .consentement a{text-decoration:underline}
.eclat .langue{display:inline-flex;align-items:center;gap:10px;border:1.5px solid rgba(255,255,255,.8);background:none;border-radius:999px;padding:8px 14px;align-self:flex-start;color:#fff}
.drapeau{width:18px;height:18px;border-radius:50%;background:linear-gradient(90deg,#00853F 33%,#FDEF42 33% 66%,#E31B23 66%)}
.logo-pied{grid-column:1/-1;display:flex;flex-direction:column;align-items:center;line-height:.8;color:var(--peche);margin-top:20px}
.logo-pied small{font-family:"Playfair Display",Georgia,serif;font-size:26px;color:#fff}
.logo-pied span{font-family:"Great Vibes","Pinyon Script",cursive;font-size:120px}
.copyright{grid-column:1/-1;text-align:center;font-size:10px;opacity:.75}
@media (max-width:900px){.grille-creations{grid-template-columns:repeat(2,1fr);padding:0 16px}.grille-collections{grid-template-columns:repeat(2,1fr);padding:0 16px}.nouveautes{width:auto;margin:40px 16px;grid-template-columns:1fr;height:auto;padding:32px 0}.pied{grid-template-columns:1fr}.grand-mot{font-size:28vw}}
@media (prefers-reduced-motion:reduce){.scintille{animation:none}}
`;
