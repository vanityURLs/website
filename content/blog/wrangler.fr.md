---
title: "Wrangler sans se tirer dans le pied"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Comment garder wrangler.toml ennuyeux, aligner les noms Worker avec GitHub et les répertoires locaux, et éviter les reconstructions Cloudflare Worker douloureuses"
tags: ["cloudflare", "wrangler", "configuration"]
featured: false
---

[Wrangler](https://developers.cloudflare.com/workers/wrangler/) est l'outil en ligne de commande de Cloudflare pour Workers. `wrangler.toml` est le fichier de configuration qui dit a Cloudflare exactement quel Worker vous déployéz, ou vit le code, quels assets statiques publier et quelles valeurs runtime font partie du déploiement.

Il peut être tentant d'utiliser ce fichier pour construire une belle couche d'abstraction de plateforme. **Resistez.** Pour une instance vanityURLs, `wrangler.toml` devrait être assez ennuyeux pour que votre vous futur puisse l'ouvrir dans six mois et comprendre tout de suite ce qui est déployé.

## Le Nom Du Worker N'Est Pas Decoratif

Le champ `name` dans `wrangler.toml` identifie explicitement le Worker dans Cloudflare. Avec Workers Builds connecte a Git, Cloudflare s'attend à ce que le nom du Worker dans le tableau de bord corresponde exactement au `name` defini dans le fichier de configuration. Cloudflare souligne cette exigence dans sa documentation [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) et son [guide de depannage des builds](https://developers.cloudflare.com/workers/ci-cd/builds/troubleshoot/).

Comme le tableau de bord Cloudflare ne permet pas actuellement de renommer un Worker existant après sa création, corriger une divergence exige un demontage volontaire. Si le tableau de bord doit correspondre a `wrangler.toml`, le chemin le plus sur est :

1. **Verifier** le bon nom de Worker dans `wrangler.toml`
2. **Retirer** la route ou le domaine custom de l'ancien Worker
3. **Supprimer** l'ancien Worker pour liberer complètement cette route ou ce domaine custom
4. **Creer ou connecter** un nouveau Worker avec le bon nom
5. **Rattacher** la route ou le domaine custom
6. **Pousser** un petit changement dans Git pour confirmer que le build se deploie bien vers le nouveau Worker

> Important : ne supprimez jamais un ancien Worker avant d'être certain des routes ou domaines custom qu'il possède. La partie douloureuse n'est pas de redéployer le script lui-même. C'est de perdre le fil du hostname attache a tel objet du tableau de bord.
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

Ces noms n'ont pas techniquement besoin de correspondre. Les faire correspondre préserve votre sante mentale quand vous êtes fatigue, en train de diagnostiquer un déploiement CI/CD échoue ou de relire une vieille note dans votre gestionnaire de mots de passe.

Évitez les noms trop clever ou temporaires comme `redirector-prod-final-v2`. Ils semblent précis au moment de leur création, puis deviennent vite du brouillard. Transformer le domaine court en chaine compatible avec un système de fichiers est generalement le plus propre :

- `v8s.link` devient `v8s-link`
- `dicai.re` devient `dicai-re`
- `go.example.com` devient `go-example-com`

## Garder wrangler.toml Pres De La Frontiere De Deploiement

Votre `wrangler.toml` devrait décrire le comportement de déploiement Cloudflare, pas chaque décision métier granulaire derrière le redirecteur.

Gardez la configuration mince et centree sur l'infrastructure :

```toml
name = "v8s-link"
main = "src/worker.mjs"
compatibility_date = "2026-05-22"

[assets]
directory = "./build"
binding = "ASSETS"
```

Si vous êtes tente d'ingenierer plusieurs environnements, strategies de routage complexes, noms par branche et matrices denses de comportement de build avant même qu'une seule redirection fonctionne : **pause.** La phase 1 demande seulement un Worker, un dépôt, un domaine court et un déploiement reussi.

## Les Secrets Ne Vont Pas Dans wrangler.toml

Il est correct de garder dans `wrangler.toml` les valeurs de configuration non sensibles requises par le Worker. Mais ce fichier n'est pas un gestionnaire de mots de passe.

Stockez toujours les vrais secrets avec Wrangler CLI ou dans le tableau de bord Cloudflare, et gardez les copies maitres dans votre gestionnaire de mots de passe :

```sh
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

C'est vital parce que votre dépôt vanityURLs peut être public. Meme s'il est actuellement privé, un dépôt Git est un mauvais endroit pour stocker des jetons API, audiences Access, secrets analytics ou cles de récupération.

## Ne Pas Suringenierer Le Premier Deploiement

Le but principal du premier déploiement est de répondre à une seule question : _Cloudflare peut-il construire et servir le redirecteur sur le domaine court?_

Pour cette première passe, favorisez la simplicité :

- **une** branche principale
- **un** nom de Worker
- **un** compte Cloudflare
- **un** domaine court
- **un** `wrangler.toml` simple et ennuyeux
- **un** petit ensemble de liens de départ

Quand ce baseline sert bien le trafic, vous pouvez personnalisér délibérément. Ajoutez les analytics, raffinements de pages légales, contenu localisé, politiques Cloudflare Access strictes et workflows avances de cycle de vie _après_ que le coeur du redirecteur soit en ligne.

Un setup ennuyeux n'est pas un manque d'ambition. C'est comme cela que vous gardez une surface opérationnelle assez petite pour être diagnostiquee quand quelque chose casse.
