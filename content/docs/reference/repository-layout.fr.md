---
aside: false
title: "Structure du dépôt"
description: "Comment une instance vanityURLs actuelle est organisée autour des defaults produit, fichiers custom, sorties générées, outillage local et source Worker."
weight: 60
aliases:
  - /docs/repository-layout/

---

Une instance vanityURLs garde les fichiers détenus par le produit séparés des fichiers détenus par l'instance. C'est ce qui rend `npm run upgrade` pratique : upstream peut rafraîchir `defaults/` et `scripts/`, tandis que vos liens, votre marque, vos choix de politique et vos réglages Cloudflare restent sous votre contrôle.

Le dépôt public [v8s.link](https://github.com/vanityURLs/v8s.link) suit cette structure :

{{< filetree/container >}}
{{< filetree/file name="package.json" annotation="scripts npm et dépendances" >}}
{{< filetree/file name="package-lock.json" annotation="graphe de dépendances verrouillé" >}}
{{< filetree/file name="wrangler.toml" annotation="réglages de déploiement Cloudflare Worker" >}}
{{< filetree/folder name="defaults" annotation="base produit rafraîchie par upgrade" >}}
  {{< filetree/folder name="public" annotation="pages, assets, badges, pages d'état et headers par défaut" >}}
    {{< filetree/file name="_headers" annotation="headers cache et no-index des assets statiques" >}}
    {{< filetree/file name="robots.txt" >}}
    {{< filetree/file name="style.css" >}}
    {{< filetree/file name="script.js" >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="v8s-links.txt" annotation="inventaire de liens de départ" >}}
  {{< filetree/file name="v8s-schedules.json" annotation="règles de planification de départ" >}}
  {{< filetree/file name="v8s-policies.json" annotation="politique trust-and-safety par défaut" >}}
  {{< filetree/file name="v8s-blocklist-categories.json" annotation="libellés de catégories de politique" >}}
  {{< filetree/file name="v8s-site-config.json" annotation="langues, marque et valeurs opérateur par défaut" >}}
  {{< filetree/file name="v8s-local-config.json" annotation="réglages par défaut du helper local" >}}
{{< /filetree/folder >}}
{{< filetree/folder name="custom" annotation="surcharges propres à l'instance" >}}
  {{< filetree/folder name="public" annotation="marque, pages, assets et headers de l'instance" >}}
    {{< filetree/file name="_headers" >}}
    {{< filetree/file name="robots.txt" >}}
    {{< filetree/file name="style.css" >}}
    {{< filetree/file name="script.js" >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="v8s-links.txt" annotation="source de vérité humaine des liens" >}}
  {{< filetree/file name="v8s-site-config.json" annotation="langues, marque, valeurs opérateur et contacts" >}}
{{< /filetree/folder >}}
{{< filetree/folder name="scripts" annotation="outillage produit" >}}
  {{< filetree/folder name="workers" annotation="source canonique du Worker et tests" >}}
    {{< filetree/file name="worker.mjs" >}}
    {{< filetree/file name="worker.test.mjs" >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="lnk" annotation="CLI pour liens, horaires et politique" >}}
  {{< filetree/file name="build.mjs" annotation="build defaults plus custom vers la sortie de déploiement" >}}
  {{< filetree/file name="install.mjs" annotation="npm run setup" >}}
  {{< filetree/file name="upgrade.mjs" annotation="npm run upgrade" >}}
  {{< filetree/file name="local-install.mjs" annotation="setup du helper local" >}}
  {{< filetree/file name="v8s.sh" annotation="helper local en lecture seule" >}}
{{< /filetree/folder >}}
{{< filetree/folder name="src" annotation="entrée Worker générée depuis scripts/workers" >}}
  {{< filetree/file name="worker.mjs" >}}
{{< /filetree/folder >}}
{{< filetree/folder name="build" annotation="sortie de déploiement générée" >}}
  {{< filetree/file name="v8s.json" annotation="registre runtime de redirection" >}}
  {{< filetree/file name="v8s-blocklist.json" annotation="artefact runtime de politique" >}}
  {{< filetree/file name="v8s-site-config.json" annotation="configuration runtime du site" >}}
  {{< filetree/file name="_headers" >}}
  {{< filetree/file name="index.html" >}}
  {{< filetree/folder name="_stats" annotation="shell stats protégé" >}}
    {{< filetree/file name="index.html" >}}
  {{< /filetree/folder >}}
  {{< filetree/folder name="_tests" annotation="page de test runtime protégée" >}}
    {{< filetree/file name="index.html" >}}
  {{< /filetree/folder >}}
  {{< filetree/folder name="en" annotation="pages publiques et assets localisés" >}}
    {{< filetree/file name="index.html" >}}
    {{< filetree/file name="404.html" >}}
    {{< filetree/file name="expired.html" >}}
    {{< filetree/file name="disabled.html" >}}
    {{< filetree/file name="maintenance.html" >}}
  {{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

## Defaults produit

`defaults/` est la base produit. Il contient les pages publiques, pages d'état localisées, badges de redirection, pages de politique, icônes, shell stats protégé, liens de départ, politique par défaut, horaires optionnels, configuration de site et defaults du helper local.

`scripts/` est l'outillage produit. Modifiez-le seulement lorsque vous changez vanityURLs lui-même. Les opérateurs d'instance reçoivent normalement les mises à jour de ce répertoire avec `npm run upgrade`.

## Fichiers d'instance

`custom/` appartient au propriétaire de l'instance. Placez ici les liens, assets de marque, pages surchargées, configuration de site, configuration du helper local et remplacement de politique.

Le build préfère `custom/v8s-links.txt` lorsqu'il existe. Sinon, il utilise `defaults/v8s-links.txt`, ce qui permet à un clone frais de produire une instance de départ fonctionnelle.

`custom/v8s-policies.json` remplace la politique par défaut lorsqu'il est présent. Il ne fusionne pas avec `defaults/v8s-policies.json`; les décisions de politique custom retirées ne devraient pas réapparaître par une fusion des defaults.

`wrangler.toml` appartient aussi à l'instance. Il définit le nom du Worker, la route ou le domaine personnalisé, la commande de build et le domaine d'équipe Cloudflare Access.

## Sortie générée

`build/` et `src/` sont générés. Ne les modifiez pas à la main.

`build/v8s.json` est le registre runtime de redirection. Il contient les cibles normalisées, règles de routage, états de cycle de vie, métadonnées, timestamps générés et blocs de planification optionnels.

`build/v8s-blocklist.json` est l'artefact de politique runtime consommé par le Worker. Il est généré depuis la source de politique sélectionnée et les données optionnelles de flux générés.

`build/v8s-site-config.json` garde la configuration de site utilisée pour le build, incluant les langues supportées, la marque, l'information opérateur et les réglages de contact.

`src/worker.mjs` est généré pendant `npm run build` pour que Wrangler puisse déployer le Worker. La source de vérité est `scripts/workers/worker.mjs`. `npm run clean` retire `build/`, `src/` et les anciennes sorties de compatibilité.
