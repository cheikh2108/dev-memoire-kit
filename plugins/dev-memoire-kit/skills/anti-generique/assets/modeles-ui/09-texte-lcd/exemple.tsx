/**
 * Modèle 09 — Texte qui se mélange, façon écran LCD
 * Adapté de « Type Shuffle Animation » de Codrops (licence MIT, © 2009-2022 Codrops,
 * https://github.com/codrops/TypeShuffleAnimation), lui-même inspiré de « LCD 1 ».
 * Les six effets reprennent les algorithmes et les durées du code d'origine ;
 * le découpage en lignes vient des données (plus de dépendance à Splitting),
 * les caractères sont modifiés directement dans le DOM pour ne pas re-rendre React toutes les 15 ms.
 *
 * Dépendances : react 18+. Police à chasse fixe (ici JetBrains Mono).
 */
import { useEffect, useRef, useState } from "react";

/* ====================================================================== */
/* Moteur                                                                  */
/* ====================================================================== */
const SIGNES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>,0123456789".split("");
const VIDE = " ";
const auHasard = <T,>(t: T[]) => t[Math.floor(Math.random() * t.length)];
const entre = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1) + a);

export type Effet = 1 | 2 | 3 | 4 | 5 | 6;
type Cellule = { el: HTMLElement; pos: number; origine: string; etat: string; memoire: string; couleur: string; memoireCouleur: string };

/**
 * Anime toutes les lignes `.lcd-ligne` (composées de `.lcd-car`) contenues dans `racine`.
 * Renvoie une fonction d'arrêt. `couleurTexte` est la couleur finale des caractères.
 */
export function melanger(racine: HTMLElement, effet: Effet, couleurTexte: string, fin?: () => void) {
  const minuteries: number[] = [];
  const plus = (f: () => void, ms: number) => minuteries.push(window.setTimeout(f, ms));
  const lignes: Cellule[][] = [...racine.querySelectorAll<HTMLElement>(".lcd-ligne")].map((l) =>
    [...l.querySelectorAll<HTMLElement>(".lcd-car")].map((el, pos) => {
      const origine = el.dataset.c ?? el.textContent ?? "";
      return { el, pos, origine, etat: origine, memoire: origine, couleur: couleurTexte, memoireCouleur: couleurTexte };
    }),
  );
  const total = lignes.reduce((n, l) => n + l.length, 0);
  let finies = 0;
  const ecrire = (c: Cellule, v: string) => { c.etat = v; c.el.textContent = v; };
  const teinter = (c: Cellule, v: string) => { c.couleur = v; c.el.style.color = v; };
  const terminer = (c: Cellule) => {
    ecrire(c, c.origine);
    teinter(c, couleurTexte);
    if (++finies === total) fin?.();
  };
  const vider = () => lignes.forEach((l) => l.forEach((c) => ecrire(c, VIDE)));

  /** Effets « glissants » (1, 4, 5) : la première cellule tire un signe, les suivantes recopient leur voisine de gauche. */
  const glisse = (max: number, pas: number, depart: (ligne: number) => number, premier: (i: number) => string, couleurs?: string[]) => {
    vider();
    lignes.forEach((ligne, li) => ligne.forEach((c) => {
      const boucle = (i = 0) => {
        c.memoire = c.etat;
        c.memoireCouleur = c.couleur;
        if (i === max - 1) terminer(c);
        else if (c.pos === 0) {
          ecrire(c, premier(i));
          if (couleurs) teinter(c, auHasard(couleurs));
        } else {
          const voisine = ligne[c.pos - 1];
          ecrire(c, voisine.memoire);
          if (couleurs) teinter(c, voisine.memoireCouleur);
        }
        if (c.memoire !== VIDE) i++; // une case vide ne compte pas
        if (i < max) plus(() => boucle(i), pas);
      };
      plus(() => boucle(), depart(li));
    }));
  };
  /** Effets « aléatoires » (2, 3, 6) : chaque cellule tire des signes au hasard puis se fixe. */
  const hasard = (max: number, pas: () => number, depart: (c: Cellule, li: number) => number, effacer: boolean, couleurs?: string[], clignote = false) => {
    if (effacer) vider();
    lignes.forEach((ligne, li) => ligne.forEach((c) => {
      const boucle = (i = 0) => {
        if (i === max - 1) {
          terminer(c);
          if (clignote) { c.el.style.opacity = "0"; plus(() => (c.el.style.opacity = "1"), 300); }
        } else {
          ecrire(c, auHasard(SIGNES));
          if (couleurs) teinter(c, auHasard(couleurs));
        }
        if (++i < max) plus(() => boucle(i), pas());
      };
      plus(() => boucle(), depart(c, li));
    }));
  };
  const amorce = (i: number) => (i < 9 ? auHasard(["*", "-", "'", '"']) : auHasard(SIGNES));

  switch (effet) {
    case 1: glisse(45, 15, (li) => (li + 1) * 200, amorce); break;
    case 2: hasard(20, () => 40, (c) => (c.pos + 1) * 30, false, undefined, true); break;
    case 3: hasard(10, () => 80, () => entre(0, 2000), true); break;
    case 4: glisse(30, 15, (li) => Math.abs(lignes.length / 2 - li) * 400, () => auHasard(["*", ":"])); break;
    case 5: glisse(30, 10, (li) => (li + 1) * 200, amorce, ["#3e775d", "#61dca3", "#61b3dc"]); break;
    case 6: hasard(15, () => entre(30, 110), (_c, li) => (li + 1) * 80, false, ["#2b4539", "#61dca3", "#61b3dc"]); break;
  }
  return () => minuteries.forEach(clearTimeout);
}

/** Une ligne découpée en caractères. */
export function LigneLCD({ texte, className = "" }: { texte: string; className?: string }) {
  return (
    <span className={`lcd-ligne ${className}`}>
      {[...texte].map((c, i) => {
        const v = c === " " ? VIDE : c;
        return <span key={i} className="lcd-car" data-c={v}>{v}</span>;
      })}
    </span>
  );
}

/* ====================================================================== */
/* Démonstration : fiche de profil en écran LCD                            */
/* ====================================================================== */
const FICHE: { terme: string; lignes: string[] }[] = [
  { terme: "Nom", lignes: ["Awa Ndiaye"] },
  { terme: "Métier", lignes: ["Développeuse web créative"] },
  { terme: "Profil", lignes: [
    "Six ans d'expérience : HTML, CSS, TypeScript, React.",
    "Passionnée de création numérique, de musique mbalax",
    "et de cuisine. Toujours à la recherche de nouveaux",
    "défis ; aime transformer une idée en interface claire,",
    "rapide et agréable à utiliser. Bonne maîtrise de",
    "l'expérience utilisateur et des principes de design.",
  ] },
  { terme: "Projets", lignes: ["Wave de quartier, Taxi Teranga, Marché en ligne"] },
  { terme: "Prix", lignes: ["Meilleure expérience utilisateur, Dakar Digital 2025"] },
];

/** Baobab original en ASCII (remplace le portrait de la démo d'origine). */
const BAOBAB = String.raw`
             .:*##*:.     .:*#*:.
        .:*#%%%%%%%%#*:.*#%%%%%%%#*.
      :#%%%%%%%%%%%%%%%%%%%%%%%%%%%%#:
     *%%%%%%#*:.  .:*%%%%%*:. .:*%%%%%*
      :*#*:.   :#:   .*%*.   :#:  .:*#:
         '.   :%%:    :%:    :%%:   .'
               '%%:   :%:   :%%'
                 '%%. :%: .%%'
                   '%%%%%%%'
                    #%%%%%#
                    #%%%%%#
                   .#%%%%%#.
                   #%%%%%%%#
                  .#%%%%%%%#.
                  #%%%%%%%%%#
                 .#%%%%%%%%%#.
           ......#%%%%%%%%%%%#......
      .:::::::::::::::::::::::::::::::::.`;

export default function TexteLCD() {
  const zone = useRef<HTMLDListElement>(null);
  const [enCours, setEnCours] = useState(false);
  const arret = useRef<() => void>(() => {});
  const lancer = (e: Effet) => {
    if (!zone.current || enCours) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnCours(true);
    arret.current = melanger(zone.current, e, "#ffffff", () => setEnCours(false));
  };
  useEffect(() => {
    const t = window.setTimeout(() => lancer(1), 300);
    return () => { clearTimeout(t); arret.current(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="lcd">
      <style>{CSS}</style>
      <pre className="ascii" aria-hidden>{BAOBAB}</pre>
      <header className="cadre-haut">
        <span>Fiche animée, d'après un effet d'écran LCD</span>
        <a href="#">Retour</a>
      </header>
      <dl className="contenu" ref={zone}>
        {FICHE.map((r) => (
          <div className="rangee" key={r.terme}>
            <dt><LigneLCD texte={r.terme} /></dt>
            <dd>{r.lignes.map((l, i) => <LigneLCD key={i} texte={l} />)}</dd>
          </div>
        ))}
      </dl>
      <nav className="effets" aria-label="Effets">
        {([1, 2, 3, 4, 5, 6] as Effet[]).map((e) => (
          <button key={e} onClick={() => lancer(e)} disabled={enCours}>[ effet {e} ]</button>
        ))}
      </nav>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
.lcd{--texte:#fff;--fond:#000;--lien:#61dca3;position:relative;min-height:100vh;background:var(--fond);color:var(--texte);
font:400 13px/1.5 "JetBrains Mono",ui-monospace,monospace;text-transform:uppercase;padding:2rem 2.5rem;overflow:hidden;
display:grid;grid-template-rows:auto 1fr auto;-webkit-font-smoothing:antialiased}
.lcd,.lcd *{box-sizing:border-box}
.ascii{position:absolute;right:4vw;top:50%;transform:translateY(-55%);margin:0;color:#2a5a44;font-size:clamp(12px,1.45vw,22px);line-height:1.12;pointer-events:none;user-select:none}
.cadre-haut{display:flex;gap:2rem;font-size:11px;position:relative}
.cadre-haut a,.effets button{color:var(--lien);text-decoration:none}
.cadre-haut a:hover,.effets button:hover:not(:disabled){color:var(--texte)}
.contenu{position:relative;align-self:center;margin:0;max-width:880px;display:grid;gap:1.1rem}
.rangee{display:grid;grid-template-columns:9rem 1fr}
.rangee dt{font-weight:500}.rangee dd{margin:0;display:flex;flex-direction:column}
.lcd-ligne{display:block;white-space:pre}
.lcd-car{display:inline-block;min-width:1ch}
.effets{position:relative;display:flex;flex-wrap:wrap;gap:1.5rem}
.effets button{font:inherit;text-transform:inherit;background:none;border:0;padding:0;cursor:pointer}
.effets button:disabled{opacity:.45;cursor:default}
@media (max-width:760px){.ascii{opacity:.35;right:-30vw}.rangee{grid-template-columns:1fr;gap:.2rem}.lcd{padding:1.25rem}}
`;
