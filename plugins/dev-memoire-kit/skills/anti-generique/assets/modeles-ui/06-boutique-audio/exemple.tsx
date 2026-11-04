/**
 * Modèle 06 — Boutique audio « Kàddu » (landing e-commerce d'électronique)
 * Reconstruction originale (marque, textes, illustrations et code réécrits) d'après une maquette
 * publique de boutique de casques : héros bleu profond avec mot géant condensé derrière le sujet,
 * barre de garanties, carrousel de catégories, bannière, rangée de marques, pied de page noir.
 * Les photos et logos de la référence ne sont PAS repris : produits dessinés en SVG, marques inventées ;
 * passer une vraie photo détourée avec la prop `photoHeros`.
 * La référence est une image fixe : les animations sont des ajouts (voir animations.md).
 *
 * Dépendances : react 18+, motion 11+ (`npm i motion`).
 * Polices : Anton (mot géant, titres condensés), Inter Tight (texte).
 */
import { useRef, useState, type CSSProperties } from "react";
import { MotionConfig, motion } from "motion/react";

const SORTIE = [0.16, 1, 0.3, 1] as const;
const apparition = (delai: number, de: { x?: number; y?: number } = {}) => ({
  initial: { opacity: 0, x: de.x ?? 0, y: de.y ?? 0 },
  animate: { opacity: 1, x: 0, y: 0 },
  transition: { duration: 0.6, ease: SORTIE, delay: delai },
});
const auDefilement = (delai = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: SORTIE, delay: delai },
});

/* ====================================================================== */
/* Illustrations SVG (produits génériques)                                 */
/* ====================================================================== */
type Teinte = "noir" | "blanc" | "creme" | "olive";
const TEINTES: Record<Teinte, { coque: string; reflet: string; coussin: string; arceau: string }> = {
  noir: { coque: "#1C1D20", reflet: "#4A4D55", coussin: "#0E0F11", arceau: "#26282C" },
  blanc: { coque: "#F3F4F6", reflet: "#FFFFFF", coussin: "#D9DCE1", arceau: "#E6E8EC" },
  creme: { coque: "#E8DFD2", reflet: "#FBF6EE", coussin: "#CFC3B2", arceau: "#DDD2C2" },
  olive: { coque: "#1B1E1A", reflet: "#3F4A3B", coussin: "#0C0E0B", arceau: "#22261F" },
};

function Casque({ teinte = "noir", taille = 200, liseré }: { teinte?: Teinte; taille?: number; liseré?: string }) {
  const t = TEINTES[teinte];
  const id = `c-${teinte}`;
  return (
    <svg viewBox="0 0 200 200" width={taille} height={taille} role="img" aria-label="Casque audio">
      <defs>
        <radialGradient id={id} cx=".35" cy=".3" r=".8"><stop offset="0" stopColor={t.reflet} /><stop offset=".55" stopColor={t.coque} /><stop offset="1" stopColor={t.coussin} /></radialGradient>
      </defs>
      <path d="M38 112 C34 44 166 44 162 112" fill="none" stroke={t.arceau} strokeWidth="13" strokeLinecap="round" />
      <path d="M44 104 C42 58 158 58 156 104" fill="none" stroke={t.coussin} strokeWidth="5" strokeLinecap="round" opacity=".7" />
      {[[50, -8], [150, 8]].map(([x, r]) => (
        <g key={x} transform={`rotate(${r} ${x} 130)`}>
          <rect x={x - 16} y="92" width="32" height="76" rx="16" fill={t.coussin} />
          <rect x={x - 22} y="96" width="44" height="70" rx="20" fill={`url(#${id})`} />
          {liseré && <rect x={x - 22} y="96" width="44" height="70" rx="20" fill="none" stroke={liseré} strokeWidth="1.5" opacity=".9" />}
        </g>
      ))}
    </svg>
  );
}

function Ecouteurs({ taille = 200 }: { taille?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={taille} height={taille} role="img" aria-label="Écouteurs sans fil et leur boîtier">
      <defs>
        <linearGradient id="boitier" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#DDE2E8" /></linearGradient>
      </defs>
      <rect x="40" y="92" width="120" height="72" rx="30" fill="url(#boitier)" stroke="#C9D0D8" />
      <path d="M40 116 H160" stroke="#C9D0D8" />
      {[78, 122].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="88" rx="15" ry="18" fill="#FFFFFF" stroke="#C9D0D8" />
          <rect x={x - 4} y="96" width="8" height="26" rx="4" fill="#F5F7F9" stroke="#C9D0D8" />
          <ellipse cx={x} cy="84" rx="5" ry="6" fill="#2A2D33" />
        </g>
      ))}
    </svg>
  );
}

/* ====================================================================== */
/* Icônes                                                                  */
/* ====================================================================== */
const ICONES = {
  loupe: "M9 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM17 17l-3.5-3.5",
  panier: "M3 4h2l2 9h9l2-6H6M8 17h.01M15 17h.01",
  fleche: "M4 10h12M11 5l5 5-5 5",
  lecture: "M8 6l6 4-6 4z",
  camion: "M2 6h10v8H2zM12 9h3l3 3v2h-6M5 16a1.5 1.5 0 1 0 0-.1M14 16a1.5 1.5 0 1 0 0-.1",
  bouclier: "M10 3 4 5.5v4c0 3.5 2.5 6 6 7.5 3.5-1.5 6-4 6-7.5v-4zM7.5 10l2 2 3-3.5",
  carte: "M3 5h14v10H3zM3 8h14M6 12h3",
  horloge: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM10 6v4l3 2",
  gauche: "M12 5l-5 5 5 5",
  droite: "M8 5l5 5-5 5",
  globe: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM3 10h14M10 3c2 2 3 4.5 3 7s-1 5-3 7c-2-2-3-4.5-3-7s1-5 3-7Z",
  onde: "M3 10h2M7 6v8M10 4v12M13 7v6M16 9v2",
  bulle: "M4 5h12v8H9l-4 3v-3H4z",
  x: "M5 5l10 10M15 5 5 15",
  photo: "M4 4h12v12H4zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM13.5 6.5h.01",
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
export default function BoutiqueAudio({ photoHeros }: { photoHeros?: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const [panier, setPanier] = useState(2);
  const defiler = (sens: 1 | -1) => rail.current?.scrollBy({ left: sens * 258, behavior: "smooth" });

  return (
    <MotionConfig reducedMotion="user">
      <div className="kaddu">
        <style>{CSS}</style>
        <div className="cadre">
          {/* ------------------------------ Héros ------------------------------ */}
          <section className="heros">
            <nav className="nav">
              <b className="marque">KÀDDU</b>
              <ul>{["Boutique", "Catégories", "Promos", "Nouveautés", "Assistance"].map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
              <div className="actions">
                <button aria-label="Rechercher"><Icone n="loupe" taille={20} /></button>
                <button aria-label={`Panier, ${panier} articles`} className="avec-badge"><Icone n="panier" taille={20} /><motion.i key={panier} initial={{ scale: 1.6 }} animate={{ scale: 1 }}>{panier}</motion.i></button>
                <a className="connexion" href="#">Se connecter</a>
              </div>
            </nav>

            <motion.p className="surtitre haut" {...apparition(0.1, { x: -20 })}>VOTRE MONDE, EN MIEUX <i /></motion.p>
            <motion.h1 className="mot-geant" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: SORTIE, delay: 0.15 }} aria-hidden>
              CASQUES
            </motion.h1>

            <motion.div className="sujet" initial={{ opacity: 0, y: 60, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: -4 }} transition={{ duration: 0.9, ease: SORTIE, delay: 0.35 }}>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 1.3 }}>
                {photoHeros ? <img src={photoHeros} alt="" /> : <Casque teinte="blanc" taille={560} />}
              </motion.div>
              <div className="ombre-sol" />
            </motion.div>

            <motion.div className="premium" {...apparition(0.6, { x: 20 })}>
              <p>SON<br />HAUT DE<br />GAMME</p>
              <motion.a href="#" className="rond-contour" aria-label="Découvrir" whileHover={{ rotate: -45 }}><Icone n="fleche" /></motion.a>
            </motion.div>

            <div className="bas-heros">
              <motion.p className="surtitre" {...apparition(0.7, { x: -20 })}>VOTRE MONDE, EN MIEUX <i /></motion.p>
              <motion.h2 {...apparition(0.8, { y: 20 })}>UNE TECH PLUS FINE<br />POUR UN QUOTIDIEN PLUS CLAIR</motion.h2>
              <motion.p className="texte" {...apparition(0.9, { y: 20 })}>Découvrez le meilleur de l'électronique, pensé pour rendre votre vie plus simple, plus fluide et mieux connectée.</motion.p>
              <motion.div className="boutons" {...apparition(1.0, { y: 20 })}>
                <motion.a href="#" className="bouton-blanc" whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}>ACHETER <Icone n="fleche" taille={14} /></motion.a>
                <a href="#" className="histoire"><span className="rond-lecture"><Icone n="lecture" taille={12} /></span><span>Voir<br />notre histoire</span></a>
              </motion.div>
            </div>
          </section>

          {/* --------------------------- Garanties ---------------------------- */}
          <motion.ul className="garanties" {...auDefilement()}>
            {GARANTIES.map((g) => (
              <li key={g.titre}><Icone n={g.icone} taille={26} /><span><b>{g.titre}</b><small>{g.detail}</small></span></li>
            ))}
          </motion.ul>

          {/* --------------------------- Catégories ---------------------------- */}
          <section className="categories">
            <div className="entete">
              <h3>ACHETER PAR CATÉGORIE</h3>
              <span className="commandes">
                <button aria-label="Précédent" onClick={() => defiler(-1)}><Icone n="gauche" taille={14} /></button>
                <button aria-label="Suivant" onClick={() => defiler(1)}><Icone n="droite" taille={14} /></button>
                <a href="#">Tout voir <Icone n="fleche" taille={14} /></a>
              </span>
            </div>
            <div className="rail" ref={rail}>
              {CATEGORIES.map((c, k) => (
                <motion.article key={k} className="carte-categorie" {...auDefilement(k * 0.06)} whileHover="survol">
                  <motion.div className="vignette" style={{ background: c.fond }} variants={{ survol: { y: -4 } }}>
                    <motion.span variants={{ survol: { scale: 1.06, rotate: -3 } }} transition={{ duration: 0.4, ease: SORTIE }} style={{ display: "grid" }}>
                      {c.type === "ecouteurs" ? <Ecouteurs taille={170} /> : <Casque teinte={c.teinte} taille={170} liseré={c.liseré} />}
                    </motion.span>
                  </motion.div>
                  <div className="pied-carte">
                    <span><b>{c.nom}</b><small>et {c.remise} de remise</small></span>
                    <motion.button className="rond-fleche" aria-label={`Ajouter ${c.nom}`} variants={{ survol: { backgroundColor: "#0B2E6F", color: "#FFFFFF", rotate: -45 } }} onClick={() => setPanier((p) => p + 1)}>
                      <Icone n="fleche" taille={14} />
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* ---------------------------- Bannière ---------------------------- */}
          <motion.section className="banniere" {...auDefilement()}>
            <div className="texte-banniere">
              <h3>UN SON<br /><span>HORS NORME</span><i /></h3>
              <p>Un son enveloppant, un confort supérieur.<br />Pensé pour votre quotidien.</p>
              <motion.a href="#" className="bouton-marine" whileHover={{ x: 3 }}>Voir la collection <Icone n="fleche" taille={16} /></motion.a>
            </div>
            <div className="visuel-banniere">
              <div className="lumiere" aria-hidden />
              <div className="livres" aria-hidden><i /><i /></div>
              <Casque teinte="creme" taille={360} />
            </div>
          </motion.section>

          {/* ----------------------------- Marques ---------------------------- */}
          <section className="marques">
            <div className="entete">
              <p className="etiquette">MARQUES PHARES <i /></p>
              <a href="#">Tout voir <Icone n="fleche" taille={14} /></a>
            </div>
            <ul>
              {MARQUES.map((m, k) => (
                <motion.li key={m.nom} {...auDefilement(k * 0.05)} whileHover={{ opacity: 1, y: -2 }} style={m.style}>{m.nom}</motion.li>
              ))}
            </ul>
          </section>

          {/* --------------------------- Pied de page -------------------------- */}
          <motion.footer className="pied" {...auDefilement()}>
            <div className="pied-haut">
              <div className="pied-marque">
                <b className="logo-pied"><Icone n="onde" taille={22} /> KÀDDU<small>AUDIO &amp; TECH</small></b>
                <p>Le bon son, au bon prix : casques, écouteurs et enceintes sélectionnés et garantis, livrés partout au Sénégal.</p>
                <div className="reseaux">
                  {(["photo", "x", "bulle"] as const).map((n) => <a key={n} href="#" aria-label={n}><Icone n={n} taille={16} /></a>)}
                </div>
                <div className="pastilles"><span>Revendeur agréé</span><span>Garantie 1 an</span></div>
              </div>
              {PIED.map((col) => (
                <div key={col.titre} className="colonne">
                  <h4>{col.titre}</h4>
                  <ul>{col.liens.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
                </div>
              ))}
            </div>
            <div className="pied-bas">
              <span>© 2026 Kàddu SARL, Dakar. Tous droits réservés.</span>
              <span className="legal">{["Confidentialité", "Conditions de vente", "Cookies", "Accessibilité"].map((l) => <a key={l} href="#">{l}</a>)}</span>
              <span className="langue"><Icone n="globe" taille={14} /> Sénégal (FR)</span>
            </div>
          </motion.footer>
        </div>
      </div>
    </MotionConfig>
  );
}

/* ====================================================================== */
/* Données de démonstration                                                */
/* ====================================================================== */
const GARANTIES: { icone: keyof typeof ICONES; titre: string; detail: string }[] = [
  { icone: "camion", titre: "Livraison offerte", detail: "Partout à Dakar" },
  { icone: "bouclier", titre: "Garantie 1 an", detail: "Sur tous les produits" },
  { icone: "carte", titre: "Paiement sécurisé", detail: "Wave, Orange Money, carte" },
  { icone: "horloge", titre: "Assistance 7 j/7", detail: "On vous répond vite" },
];
const CATEGORIES: { nom: string; remise: string; type: "casque" | "ecouteurs"; teinte: Teinte; fond: string; liseré?: string }[] = [
  { nom: "Casques", remise: "20 %", type: "casque", teinte: "noir", fond: "linear-gradient(160deg,#E7E8EA,#B9BCC2)" },
  { nom: "Écouteurs", remise: "10 %", type: "ecouteurs", teinte: "blanc", fond: "linear-gradient(160deg,#9CC9F2,#5FA6E8)" },
  { nom: "Casques", remise: "30 %", type: "casque", teinte: "creme", fond: "linear-gradient(160deg,#F2ECE3,#DCD2C3)" },
  { nom: "Casques", remise: "50 %", type: "casque", teinte: "olive", fond: "linear-gradient(160deg,#6C7A4F,#2E3A25)", liseré: "#3D8BFF" },
  { nom: "Casques", remise: "40 %", type: "casque", teinte: "noir", fond: "linear-gradient(160deg,#DCDDE0,#A9ADB4)" },
  { nom: "Écouteurs", remise: "15 %", type: "ecouteurs", teinte: "blanc", fond: "linear-gradient(160deg,#CFE3F7,#8DBDEB)" },
];
/** Marques inventées : chaque mot-symbole a son propre caractère, comme une vraie rangée de logos. */
const MARQUES: { nom: string; style: CSSProperties }[] = [
  { nom: "sabar", style: { fontFamily: "Georgia,serif", fontStyle: "italic", fontWeight: 700, fontSize: 34 } },
  { nom: "NDOX", style: { fontFamily: "Anton,Impact,sans-serif", fontSize: 38, letterSpacing: ".02em" } },
  { nom: "BAOBAB", style: { fontWeight: 900, fontSize: 30, letterSpacing: ".18em" } },
  { nom: "lamb·audio", style: { fontWeight: 500, fontSize: 30, letterSpacing: "-.04em" } },
  { nom: "KORA", style: { fontFamily: "Anton,Impact,sans-serif", fontSize: 40, fontStyle: "italic" } },
  { nom: "TERANGA", style: { fontWeight: 800, fontSize: 28, letterSpacing: ".08em" } },
];
const PIED = [
  { titre: "PRODUITS", liens: ["Casques", "Écouteurs", "Enceintes", "Accessoires", "Cartes cadeaux"] },
  { titre: "ENTREPRISE", liens: ["À propos", "Nos boutiques", "Carrières", "Presse", "Partenaires"] },
  { titre: "ASSISTANCE", liens: ["Espace client", "Suivi de commande", "Questions fréquentes", "Garantie et SAV", "Nous contacter"] },
];

/* ====================================================================== */
/* Styles (tokens dans style.md)                                           */
/* ====================================================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter+Tight:wght@400;500;600;700;800;900&display=swap');
.kaddu{--page:#EAF2FB;--bleu-nuit:#06235E;--bleu:#0B4FB5;--marine:#0B2E6F;--encre:#111827;--muet:#6B7280;--trait:#D5DCE6;--carte:#F3F5F8;--noir:#07080B;
font-family:"Inter Tight",system-ui,sans-serif;color:var(--encre);background:var(--page);padding:24px;border-radius:24px}
.kaddu *{box-sizing:border-box}.kaddu h1,.kaddu h2,.kaddu h3,.kaddu h4,.kaddu p{margin:0}.kaddu a{color:inherit;text-decoration:none}.kaddu button{font:inherit;color:inherit;cursor:pointer;background:none;border:0}
.kaddu ul{list-style:none;margin:0;padding:0}
.cadre{max-width:1260px;margin:0 auto;background:#fff;border-radius:44px;overflow:hidden;box-shadow:0 30px 70px rgba(11,46,111,.12)}
.heros{position:relative;height:820px;color:#fff;overflow:hidden;border-radius:44px;
background:radial-gradient(60% 60% at 90% 0%,#4DA3FF 0%,rgba(77,163,255,0) 60%),radial-gradient(80% 70% at 60% 60%,#1D6FE0,transparent 70%),linear-gradient(160deg,#0A3A8C,#06235E 55%,#0B4FB5)}
.heros:after{content:"";position:absolute;inset:auto 0 0;height:180px;background:linear-gradient(transparent,rgba(122,178,255,.35));pointer-events:none}
.nav{position:absolute;inset:36px 48px auto;display:flex;align-items:center;gap:32px;z-index:6}
.marque{font-size:30px;font-weight:800;letter-spacing:.02em}
.nav ul{display:flex;gap:30px;margin:0 auto;font-size:14px}
.actions{display:flex;align-items:center;gap:22px}
.avec-badge{position:relative;display:grid}
.avec-badge i{position:absolute;top:-8px;right:-8px;background:#fff;color:var(--marine);border-radius:50%;width:16px;height:16px;font-size:9px;font-style:normal;font-weight:700;display:grid;place-items:center}
.connexion{background:#fff;color:var(--encre)!important;border-radius:999px;padding:8px 22px;font-size:13px;font-weight:600}
.surtitre{display:flex;align-items:center;gap:16px;font-size:11px;letter-spacing:.32em;font-weight:500;opacity:.9}
.surtitre i{display:block;width:56px;height:1px;background:currentColor}
.surtitre.haut{position:absolute;left:58px;top:168px;z-index:3}
.mot-geant{position:absolute;left:44px;right:44px;top:196px;font-family:"Anton","Bebas Neue","Oswald",Impact,sans-serif;font-weight:400;font-size:290px;line-height:1;letter-spacing:-.005em;z-index:1;color:#fff}
.sujet{position:absolute;left:46%;top:150px;width:560px;z-index:2;filter:drop-shadow(0 40px 50px rgba(3,20,60,.55))}
.sujet img{width:100%}
.ombre-sol{position:absolute;left:12%;right:12%;bottom:-6px;height:30px;border-radius:50%;background:radial-gradient(closest-side,rgba(2,14,45,.55),transparent)}
.premium{position:absolute;right:46px;top:120px;z-index:4;padding-left:22px;border-left:1.5px solid rgba(255,255,255,.55);display:flex;flex-direction:column;gap:22px;height:180px}
.premium p{font-size:17px;font-weight:700;letter-spacing:.06em;line-height:1.2}
.rond-contour{width:52px;height:52px;border-radius:50%;border:1.5px solid #fff;display:grid;place-items:center;margin-left:-48px;background:rgba(6,35,94,.25);backdrop-filter:blur(6px)}
.bas-heros{position:absolute;left:58px;bottom:54px;z-index:4;max-width:680px;display:flex;flex-direction:column;gap:18px}
.bas-heros h2{white-space:nowrap;font-size:46px;font-weight:900;line-height:1;letter-spacing:-.035em}
.texte{font-size:15px;line-height:1.5;opacity:.85;max-width:420px}
.boutons{display:flex;align-items:center;gap:22px;margin-top:10px}
.bouton-blanc{display:inline-flex;align-items:center;gap:10px;background:#fff;color:var(--encre)!important;border-radius:999px;padding:12px 26px;font-size:12px;font-weight:700;letter-spacing:.06em}
.histoire{display:inline-flex;align-items:center;gap:12px;font-size:11px;line-height:1.3}
.rond-lecture{width:40px;height:40px;border-radius:50%;border:1.5px solid rgba(255,255,255,.7);display:grid;place-items:center}
.garanties{display:grid!important;grid-template-columns:repeat(4,1fr);margin:20px 46px 0!important;padding:22px 32px!important;border:1.5px solid var(--trait);border-radius:20px}
.garanties li{display:flex;align-items:center;gap:16px}
.garanties li+li{border-left:1px solid var(--trait);padding-left:28px}
.garanties b{display:block;font-size:13px;font-weight:600}.garanties small{font-size:12px;color:var(--muet)}
.categories{padding:34px 0 0 46px}
.entete{display:flex;align-items:center;justify-content:space-between;padding-right:46px;margin-bottom:18px}
.entete h3{font-size:14px;font-weight:700;letter-spacing:.12em}
.entete a{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500}
.commandes{display:flex;align-items:center;gap:8px}
.commandes button{width:30px;height:30px;border-radius:50%;border:1px solid var(--trait);display:grid;place-items:center}
.commandes a{margin-left:10px}
.rail{display:flex;gap:30px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 46px 24px 0;scrollbar-width:none}
.rail::-webkit-scrollbar{display:none}
.carte-categorie{flex:0 0 228px;scroll-snap-align:start;background:var(--carte);border-radius:22px;padding:18px;display:flex;flex-direction:column;gap:22px}
.vignette{height:224px;border-radius:16px;display:grid;place-items:center;overflow:hidden;box-shadow:inset 0 -20px 40px rgba(0,0,0,.08)}
.pied-carte{display:flex;align-items:center;justify-content:space-between;font-size:13px;line-height:1.25}
.pied-carte b{display:block;font-weight:500}.pied-carte small{font-weight:600;font-size:13px}
.rond-fleche{width:30px;height:30px;border-radius:50%;border:1px solid var(--trait)!important;background:#fff;display:grid;place-items:center}
.banniere{position:relative;margin:14px 46px 0;height:400px;border-radius:30px;overflow:hidden;display:grid;grid-template-columns:1.05fr 1fr;background:linear-gradient(100deg,#DDEBFA 0%,#E7F0FA 45%,#C9DDF2 100%)}
.texte-banniere{display:flex;flex-direction:column;justify-content:center;gap:18px;padding-left:46px}
.texte-banniere h3{font-size:60px;font-weight:900;line-height:.95;letter-spacing:-.03em;color:#0B1430}
.texte-banniere h3 span{white-space:nowrap}
.texte-banniere h3 i{display:inline-block;vertical-align:middle;width:150px;height:2px;background:#0B1430;margin-left:18px}
.texte-banniere p{font-size:22px;line-height:1.3;color:#1F2937}
.bouton-marine{align-self:flex-start;display:inline-flex;align-items:center;gap:12px;background:var(--marine);color:#fff!important;border-radius:999px;padding:14px 34px;font-size:18px;font-weight:600}
.visuel-banniere{position:relative;display:grid;place-items:center}
.lumiere{position:absolute;inset:0;background:repeating-linear-gradient(115deg,rgba(255,255,255,.35) 0 40px,transparent 40px 120px);mix-blend-mode:soft-light}
.livres{position:absolute;left:6%;bottom:76px;z-index:0;display:flex;flex-direction:column;gap:4px}
.livres i{display:block;width:180px;height:24px;border-radius:2px 4px 4px 2px;background:linear-gradient(180deg,#8A929D,#5E6672);box-shadow:inset 0 -3px 0 rgba(0,0,0,.15),0 6px 14px rgba(11,20,48,.18)}
.livres i:first-child{width:150px;margin-left:16px;background:linear-gradient(90deg,#D9D2C5,#F1EBE0)}
.marques{padding:46px 46px 40px}
.marques .entete{padding:0;margin-bottom:26px}
.etiquette{display:flex;align-items:center;gap:16px;font-size:13px;font-weight:600;letter-spacing:.42em}
.etiquette i{display:block;width:56px;height:1px;background:var(--encre)}
.marques ul{display:flex;justify-content:space-between;align-items:center}
.marques li{color:var(--noir);opacity:.88;cursor:default;line-height:1}
.pied{margin:0 10px 10px;background:var(--noir);color:#fff;border-radius:40px;padding:56px 56px 34px}
.pied-haut{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:40px;padding-bottom:40px;border-bottom:1px solid rgba(255,255,255,.12)}
.logo-pied{display:flex;align-items:center;gap:10px;font-family:Anton,Impact,sans-serif;font-weight:400;font-size:24px;letter-spacing:.04em;color:#fff}
.logo-pied svg{color:#F5B83D}
.logo-pied small{font-family:"Inter Tight",sans-serif;font-size:8px;letter-spacing:.24em;opacity:.6;align-self:flex-end;margin-bottom:3px}
.pied-marque{display:flex;flex-direction:column;gap:18px}
.pied-marque p{font-size:14px;line-height:1.55;color:rgba(255,255,255,.62);max-width:340px}
.reseaux{display:flex;gap:10px}
.reseaux a{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.08);display:grid;place-items:center;color:rgba(255,255,255,.7)}
.pastilles{display:flex;gap:10px}
.pastilles span{border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:6px 14px;font-size:11px;color:rgba(255,255,255,.75)}
.colonne h4{font-size:12px;font-weight:700;letter-spacing:.14em;margin-bottom:20px}
.colonne li{font-size:14px;color:rgba(255,255,255,.6);margin-bottom:12px}
.colonne a:hover,.legal a:hover{color:#fff}
.pied-bas{display:flex;align-items:center;justify-content:space-between;gap:24px;padding-top:24px;font-size:12px;color:rgba(255,255,255,.5)}
.legal{display:flex;gap:26px}
.langue{display:inline-flex;align-items:center;gap:8px;color:rgba(255,255,255,.75)}
@media (max-width:900px){.heros{height:auto;min-height:760px}.mot-geant{font-size:24vw}.sujet{left:20%;width:80%}.nav ul{display:none}.garanties{grid-template-columns:1fr 1fr;gap:16px}.garanties li+li{border:0;padding:0}.banniere{grid-template-columns:1fr;height:auto;padding:32px 0}.texte-banniere h3{font-size:40px}.marques ul{flex-wrap:wrap;gap:24px}.pied-haut{grid-template-columns:1fr 1fr}.pied-bas{flex-direction:column;align-items:flex-start}}
`;
