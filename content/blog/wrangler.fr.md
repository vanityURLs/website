---
title: "Wrangler sans se tirer dans le pied"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Comment garder wrangler.toml ennuyeux, aligner les noms Worker avec GitHub et les repertoires locaux, et eviter les reconstructions Cloudflare Worker douloureuses"
tags: ["cloudflare", "wrangler", "configuration"]
featured: false
---

[Wrangler](https://developers.cloudflare.com/workers/wrangler/) est l'outil en ligne de commande de Cloudflare pour Workers. `wrangler.toml` est le fichier de configuration qui dit a Cloudflare exactement quel Worker vous deployez, ou vit le code, quels assets statiques publier et quelles valeurs runtime font partie du deploiement.

Il peut etre tentant d'utiliser ce fichier pour construire une belle couche d'abstraction de plateforme. **Resistez.** Pour une instance vanityURLs, `wrangler.toml` devrait etre assez ennuyeux pour que votre vous futur puisse l'ouvrir dans six mois et comprendre tout de suite ce qui est deploye.

## Le Nom Du Worker N'Est Pas Decoratif

Le champ `name` dans `wrangler.toml` identifie explicitement le Worker dans Cloudflare. Avec Workers Builds connecte a Git, Cloudflare s'attend a ce que le nom du Worker dans le tableau de bord corresponde exactement au `name` defini dans le fichier de configuration. Cloudflare souligne cette exigence dans sa documentation [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) et son [guide de depannage des builds](https://developers.cloudflare.com/workers/ci-cd/builds/troubleshoot/).

Comme le tableau de bord Cloudflare ne permet pas actuellement de renommer un Worker existant apres sa creation, corriger une divergence exige un demontage volontaire. Si le tableau de bord doit correspondre a `wrangler.toml`, le chemin le plus sur est :

1. **Verifier** le bon nom de Worker dans `wrangler.toml`
2. **Retirer** la route ou le domaine custom de l'ancien Worker
3. **Supprimer** l'ancien Worker pour liberer completement cette route ou ce domaine custom
4. **Creer ou connecter** un nouveau Worker avec le bon nom
5. **Rattacher** la route ou le domaine custom
6. **Pousser** un petit changement dans Git pour confirmer que le build se deploie bien vers le nouveau Worker

> Important : ne supprimez jamais un ancien Worker avant d'etre certain des routes ou domaines custom qu'il possede. La partie douloureuse n'est pas de redeployer le script lui-meme. C'est de perdre le fil du hostname attache a tel objet du tableau de bord.
>
> Bien sur, vous pourriez renommer le Worker dans `wrangler.toml` pour correspondre au tableau de bord, mais ou serait le plaisir?

## Choisir Un Nom Et Le Reutiliser

Tenez-vous aux lettres minuscules, chiffres et traits d'union pour les noms de Worker. Pour une seule instance vanityURLs, etablir une habitude de nommage coherente tot economise beaucoup de temps plus tard :

```text
Repertoire local :                              v8s-link
Depot GitHub :                                  v8s-link
Nom du Worker Cloudflare :                      v8s-link
Zero Trust Access Policy --> Application name : v8s-link
```

Ces noms n'ont pas techniquement besoin de correspondre. Les faire correspondre preserve votre sante mentale quand vous etes fatigue, en train de diagnostiquer un deploiement CI/CD echoue ou de relire une vieille note dans votre gestionnaire de mots de passe.

Evitez les noms trop clever ou temporaires comme `redirector-prod-final-v2`. Ils semblent precis au moment de leur creation, puis deviennent vite du brouillard. Transformer le domaine court en chaine compatible avec un systeme de fichiers est generalement le plus propre :

- `v8s.link` devient `v8s-link`
- `dicai.re` devient `dicai-re`
- `go.example.com` devient `go-example-com`

## Garder wrangler.toml Pres De La Frontiere De Deploiement

Votre `wrangler.toml` devrait decrire le comportement de deploiement Cloudflare, pas chaque decision metier granulaire derriere le redirecteur.

Gardez la configuration mince et centree sur l'infrastructure :

```toml
name = "v8s-link"
main = "src/worker.mjs"
compatibility_date = "2026-05-22"

[assets]
directory = "./build"
binding = "ASSETS"
```

Si vous etes tente d'ingenierer plusieurs environnements, strategies de routage complexes, noms par branche et matrices denses de comportement de build avant meme qu'une seule redirection fonctionne : **pause.** La phase 1 demande seulement un Worker, un depot, un domaine court et un deploiement reussi.

## Les Secrets Ne Vont Pas Dans wrangler.toml

Il est correct de garder dans `wrangler.toml` les valeurs de configuration non sensibles requises par le Worker. Mais ce fichier n'est pas un gestionnaire de mots de passe.

Stockez toujours les vrais secrets avec Wrangler CLI ou dans le tableau de bord Cloudflare, et gardez les copies maitres dans votre gestionnaire de mots de passe :

```sh
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

C'est vital parce que votre depot vanityURLs peut etre public. Meme s'il est actuellement prive, un depot Git est un mauvais endroit pour stocker des jetons API, audiences Access, secrets analytics ou cles de recuperation.

## Ne Pas Suringenierer Le Premier Deploiement

Le but principal du premier deploiement est de repondre a une seule question : *Cloudflare peut-il construire et servir le redirecteur sur le domaine court?*

Pour cette premiere passe, favorisez la simplicite :

- **une** branche principale
- **un** nom de Worker
- **un** compte Cloudflare
- **un** domaine court
- **un** `wrangler.toml` simple et ennuyeux
- **un** petit ensemble de liens de depart

Quand ce baseline sert bien le trafic, vous pouvez personnaliser deliberement. Ajoutez les analytics, raffinements de pages legales, contenu localise, politiques Cloudflare Access strictes et workflows avances de cycle de vie *apres* que le coeur du redirecteur soit en ligne.

Un setup ennuyeux n'est pas un manque d'ambition. C'est comme cela que vous gardez une surface operationnelle assez petite pour etre diagnostiquee quand quelque chose casse.
