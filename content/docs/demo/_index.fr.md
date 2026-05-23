---
aside: false
title: "Demo: v8s.link"
description: "Comment l'instance publique v8s.link montre les defaults vanityURLs actuels et le runtime Worker."
weight: 10

---

v8s.link est l'instance publique de reference de vanityURLs. Elle montre le repertoire defaults actuel, le registre genere, les pages operationnelles protegees, les etats de cycle de vie, la politique blocklist et le deploiement Worker Cloudflare.

## Ce que la reference montre

{{< cards >}}
{{< card title="Pages par defaut" icon="layout" href="/fr/docs/reference/repository-layout/" >}}
Accueil de recherche, page expand, pages d'etat localisees, icones, manifest, en-tetes de securite, et shell stats protege.
{{< /card >}}
{{< card title="v8s-links.txt" icon="link" href="/fr/docs/demo/links/" >}}
Liens exacts exemples, namespaces, liens de test lifecycle, metadonnees, tags, proprietaires, et expirations.
{{< /card >}}
{{< card title="Runtime Worker" icon="cloud" href="/fr/docs/reference/runtime-security/" >}}
Assets statiques plus routage Worker, `v8s.json` genere, protection Cloudflare Access, et hooks analytics serveur.
{{< /card >}}
{{< /cards >}}

## Chemins utiles

| Chemin | Ce que cela prouve |
|---|---|
| [v8s.link](https://v8s.link) | Page d'accueil par defaut pour chercher ou ouvrir les liens |
| [v8s.link/expand/](https://v8s.link/expand/) | Previsualiser une destination sans l'ouvrir |
| [v8s.link/404.html](https://v8s.link/404.html) | Page de lien manquant localisee |
| [v8s.link/expired.html](https://v8s.link/expired.html) | Page d'etat expire |
| [v8s.link/disabled.html](https://v8s.link/disabled.html) | Page d'etat desactive |
| [v8s.link/maintenance.html](https://v8s.link/maintenance.html) | Page d'etat maintenance |

## Ce qu'il faut copier

Copiez la structure, les pages par defaut, le modele de surcharge `custom/`, les reglages Worker et le workflow de validation.

Remplacez les liens exemples par votre propre `custom/v8s-links.txt`. La liste par defaut contient des exemples publics et des tests lifecycle, pas une politique de production pour votre domaine.
