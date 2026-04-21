#!/bin/bash
npx vite build
mv dist/index.html dist/app.html
cp preview.html dist/index.html
cp forfaits.html dist/forfaits.html
cp services.html dist/services.html
cp service-vip.html dist/service-vip.html
cp rejoindre.html dist/rejoindre.html
cp fournisseurs.html dist/fournisseurs.html
