---
title: Installation
linkTitle: installation
prev: /docs/
next: /docs/admin
---
{{% steps %}}

### Faire un Fork du repo

1. Faites un fork [du repo](https://github.com/vanityURLs/vanityURLs), vous n'avez besoin que de la branche `main`.
2. Poussez le repo public forké ou créez un nouveau dépôt privé sur GitHub :
    1. `git init`
    2. `git add .`
    3. `git commit -m "premier commit"`
    4. `git branch -M main`
    5. `git remote add origin ...`
    6. `git push -u origin main`

### Sur Cloudflare

3. Créez un projet sous Cloudflare Workers & Pages
    * [Connectez le dépôt](https://developers.cloudflare.com/pages/get-started/guide/#connect-your-git-provider-to-pages)
    * Configurez votre déploiement et votre configuration de build :
    ¦ * Préconfiguration du framework : (laissez vide)
    ¦ * Commande de build : `cat static.lnk dynamic.lnk > build/_redirects`
    ¦ * Répertoire de sortie du build : `/build`
    * Le build échouera car vous devez encore générer `static.lnk`, `dynamic.lnk`, et `build/_headers` plus tard dans le processus.
4. Configurez un [domaine personnalisé](https://developers.cloudflare.com/pages/platform/custom-domains/) pour votre projet de page
    * Configurez l'entrée DNS via [Cloudflare DNS](https://dash.cloudflare.com/)

### Configuration Locale

5. Définissez votre configuration dans le fichier `vanityURLs.conf` avec votre éditeur de texte préféré ou via `make config` si `vi` est votre tasse de thé.
  * SCRIPT_DIR : le chemin vers votre dossier de scripts local inclus dans votre chemin
  * REPO_DIR : le chemin vers votre copie locale de vanityURLs
  * MY_DOMAIN : votre petit domaine internet servi par Cloudflare
  * MY_PAGE : l'URL spécifique de votre page sur Cloudflare
6. Construisez votre configuration initiale avec `make setup`
  * Générez la [configuration des en-têtes](../build/_headers) en fonction de l'URL spécifique de votre page sur Cloudflare et du nom de domaine internet
  * Générez les fichiers initiaux [static.lnk](../static.lnk) et [dynamic.lnk](../dynamic.lnk)
7. Mettez à jour les listes de redirections [static](../static.lnk) et [dynamic](../dynamic.lnk) avec votre éditeur de texte préféré et le script bash [`lnk`](../script/lnk)
8. Mettez à jour la branche principale de votre dépôt git local et poussez sur GitHub
9. Cloudflare détectera le changement et lancera un déploiement, veuillez attendre environ 15 secondes pour que vos liens deviennent valides
10. Ouvrez le nom de domaine pleinement qualifié défini pour votre petit domaine internet dans votre navigateur web, et vous devriez être redirigé vers https://BHDicaire.com en fonction de la [configuration initiale](../build/_redirects)
11. Ajustez finement les listes de redirections [static](../static.lnk) et [dynamic](../dynamic.lnk) avec votre éditeur de texte préféré et le script bash [`lnk`](../scripts/lnk)
12. Ajoutez et committez les changements au dépôt GitHub
{{% /steps %}}

