#!/usr/bin/env bash
# Prépare un zip par skill, prêt à importer dans claude.ai (Personnaliser > Skills).
# claude.ai cherche <nom-du-skill>/SKILL.md dans l'archive : on zippe donc le DOSSIER du skill,
# pas son contenu. Les zips arrivent dans dist/ (ignoré par git).
#
# Utilisation : bash scripts/zipper-skills.sh
set -euo pipefail

racine="$(cd "$(dirname "$0")/.." && pwd)"
source_skills="$racine/plugins/dev-memoire-kit/skills"
sortie="$racine/dist"
version="$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' "$racine/plugins/dev-memoire-kit/.claude-plugin/plugin.json" | head -1)"

rm -rf "$sortie"
mkdir -p "$sortie"
cd "$source_skills"
for dossier in */; do
  nom="${dossier%/}"
  [ -f "$nom/SKILL.md" ] || continue
  # Le dossier doit porter le même nom que le champ « name » du SKILL.md.
  nom_declare="$(sed -n 's/^name: *//p' "$nom/SKILL.md" | head -1 | tr -d '\r')"
  if [ "$nom_declare" != "$nom" ]; then
    echo "Erreur : $nom/SKILL.md déclare « name: $nom_declare »" >&2
    exit 1
  fi
  # Les captures des modèles d'interface (près de 11 Mo) illustrent les README sur GitHub ;
  # Claude n'en a pas besoin, on les laisse hors du zip pour un import léger.
  zip -qr -X "$sortie/$nom.zip" "$nom" -x '*/.DS_Store' '*/__pycache__/*' '*/evals/*' '*/modeles-ui/*/*.png'
  echo "dist/$nom.zip"
done
echo "Version $version : importer chaque zip dans claude.ai, Personnaliser > Skills."
