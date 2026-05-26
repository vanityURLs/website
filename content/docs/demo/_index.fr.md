---
aside: false
title: "Demo: v8s.link"
description: "Comment l'instance publique v8s.link montre le baseline Quickstart."
weight: 50

---

v8s.link est l'instance demo publique de vanityURLs. Elle montre le baseline Quickstart une fois le redirector deploye, avant la personnalisation des analytics, de la marque complete, de la juridiction, des pages de confidentialite et des conditions.

Le depot source est [vanityURLs/v8s.link](https://github.com/vanityURLs/v8s.link), et l'instance deployee est [https://v8s.link](https://v8s.link).

## Configuration actuelle

| Zone | Valeur demo |
|---|---|
| Domaine court | `v8s.link` |
| Depot | [`vanityURLs/v8s.link`](https://github.com/vanityURLs/v8s.link) |
| Nom du Worker | `v8s-link` |
| Langues supportees | `de,en,es,fr,it`, avec l'anglais comme fallback |
| Analytics | Desactivees |
| Pages legales et juridiction | Reportees |
| Marque | Wordmark de domaine bicolore copie dans `custom/public`; aucun slogan |
| Inventaire de liens | Liens de depart seulement : `home`, `status`, `docs` |

## Ce que la reference montre

{{< cards >}}
{{< card title="Pages par defaut" icon="layout" href="/fr/docs/reference/repository-layout/" >}}
Accueil de recherche, page expand, pages d'etat localisees, icones, manifest, en-tetes de securite, et shell stats protege.
{{< /card >}}
{{< card title="v8s-links.txt" icon="link" href="/fr/docs/demo/links/" >}}
Petit inventaire de depart cree par `npm run setup`.
{{< /card >}}
{{< card title="Runtime Worker" icon="cloud" href="/fr/docs/reference/runtime-security/" >}}
Assets statiques plus routage Worker, `v8s.json` genere et protection Cloudflare Access des chemins operationnels.
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
| [v8s.link/.well-known/security.txt](https://v8s.link/.well-known/security.txt) | Contact machine-readable pour la divulgation de vulnerabilites selon [RFC 9116](https://www.rfc-editor.org/info/rfc9116/) |

## Ce qu'il ne faut pas surinterpreter

La demo ne configure volontairement pas les analytics, le texte legal final, les pages confidentialite et conditions propres a une juridiction, ni la marque finale. Ce sont des decisions de personnalisation de phase 2.

Utilisez cette instance pour comparer votre premier deploiement avec un baseline qui fonctionne. Passez ensuite a la section Customize lorsque vous etes pret a personnaliser l'instance.
