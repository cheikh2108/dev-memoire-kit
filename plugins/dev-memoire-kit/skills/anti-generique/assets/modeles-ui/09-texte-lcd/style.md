# Style — modèle 09 « Texte LCD »

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--fond` | `#000000` | Fond |
| `--texte` | `#FFFFFF` | Texte final |
| `--lien` | `#61DCA3` | Liens et boutons d'effet ; survol en blanc |
| (art ASCII) | `#2A5A44` | Dessin de fond, assez sombre pour rester derrière |
| (effet 5) | `#3E775D`, `#61DCA3`, `#61B3DC` | Couleurs tirées pendant le glissement |
| (effet 6) | `#2B4539`, `#61DCA3`, `#61B3DC` | Couleurs tirées pendant le hasard |

## Typographie

- Police à chasse fixe (JetBrains Mono ici ; la démo d'origine utilise une mono commerciale), **capitales** partout (`text-transform: uppercase`).
- Texte 13 px, interlignage 1,5 ; termes en graisse 500 ; en-tête et boutons 11–13 px.
- Chaque caractère est un `inline-block` d'au moins `1ch` : la ligne ne bouge pas pendant le tirage.

## Mise en page

- Grille verticale : en-tête, contenu centré verticalement, boutons en bas (`grid-template-rows: auto 1fr auto`, hauteur 100 vh).
- Liste de définitions en deux colonnes : 9 rem pour le terme, le reste pour la valeur ; 1,1 rem entre les rangées.
- Art ASCII en position absolue à droite, centré verticalement, taille `clamp(12px, 1,45vw, 22px)`.
