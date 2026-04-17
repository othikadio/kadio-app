#!/bin/bash
npx vite build
mv dist/index.html dist/app.html
for f in preview forfaits services service-vip rejoindre fournisseurs comment-ca-marche cartes-cadeaux; do
  src="$f.html"
  [ "$f" = "preview" ] && dest="dist/index.html" || dest="dist/$f.html"
  cp "$src" "$dest"
done
