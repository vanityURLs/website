---
aside: false
title: "Liens demo"
description: "L'inventaire de liens exemple utilise par l'instance demo v8s.link."
weight: 20

---

La demo v8s.link utilise un `custom/v8s-links.txt` elargi pour aider les nouveaux operateurs a inspecter des exemples realistes sans les inventer de zero.

Le fichier complet vit dans le depot demo : [`custom/v8s-links.txt`](https://github.com/vanityURLs/v8s.link/blob/main/custom/v8s-links.txt).

## Rappel du format

Chaque ligne non commentee utilise le format documente dans [Format des liens](/fr/docs/reference/link-format/) :

```text
slug|target|state|title|description|tags|owner|expires_at|notes
```

## Exemples de namespaces

| Slug | Lien long | Ce que cela demontre |
|---|---|---|
| [`v8s.link/ai/chat`](https://v8s.link/ai/chat) | `chatgpt.com` | Namespace imbrique pour les outils AI |
| [`v8s.link/pkg/n`](https://v8s.link/pkg/n) | `www.npmjs.com/package` | Namespace compact de gestionnaire de paquets |
| [`v8s.link/social/x`](https://v8s.link/social/x) | `x.com/BHDicaire/` | Namespace de profil social |
| [`v8s.link/v8s/doc`](https://v8s.link/v8s/doc) | `vanityUrls.link/en/docs/` | Raccourci vers la documentation du projet |

```text
ai/chat|chatgpt.com||Open AI|Artificial Intelligence|ai|bhd||
pkg/n|www.npmjs.com/package||NPM|Distribution / package manager|pkg,js|bhd||
social/x|x.com/BHDicaire/||X profile|Social profile on X|social|bhd||
v8s/doc|vanityUrls.link/en/docs/||VanityURLs documentation (web)||v8s,git|bhd|||
```

## Exemples de cycle de vie

| Slug | Etat | Resultat attendu |
|---|---|---|
| [`v8s.link/test/1`](https://v8s.link/test/1) | `permanent` | Redirection permanente |
| [`v8s.link/test/2`](https://v8s.link/test/2) | `ephemeral` | Redirection temporaire |
| [`v8s.link/test/3`](https://v8s.link/test/3) | `expired` avec date d'expiration | Page d'etat expire |
| [`v8s.link/test/4`](https://v8s.link/test/4) | `disabled` | Page d'etat desactive |
| [`v8s.link/test/5`](https://v8s.link/test/5) | `maintenance` | Page d'etat maintenance |
| [`v8s.link/test/6`](https://v8s.link/test/6) | `deactivated` | Comportement vrai not-found |

```text
test/1|youtu.be/dQw4w9WgXcQ|permanent|Test permanent (state)||test|bhd|||
test/2|youtu.be/dQw4w9WgXcQ|ephemeral|Test permanent (ephemeral)|Ephemeral -> 302|test|bhd|||
test/3|youtu.be/dQw4w9WgXcQ|expired|Test expired (state)|effective state to expired|test|bhd|2026-04-30||
test/4|youtu.be/dQw4w9WgXcQ|disabled|Test disabled (state)|-> /disabled|test|bhd|||
test/5|youtu.be/dQw4w9WgXcQ|maintenance|Test maintenance (state)||test|bhd|||
test/6|youtu.be/dQw4w9WgXcQ|deactivated|Test deactivated (state)|deactivated -> true 404|test|bhd|||
```

## Exemples du projet vanityURLs

Ces liens rendent la demo utile pendant la lecture de la documentation :

| Slug | Lien long |
|---|---|
| [`v8s.link/v8s/hugo`](https://v8s.link/v8s/hugo) | `github.com/vanityURLs/website` |
| [`v8s.link/v8s/issues`](https://v8s.link/v8s/issues) | `github.com/vanityurls/vanityurls/issues` |
| [`v8s.link/v8s/latest`](https://v8s.link/v8s/latest) | `github.com/vanityURLs/website/releases/latest` |
| [`v8s.link/v8s/roadmap`](https://v8s.link/v8s/roadmap) | `github.com/orgs/vanityURLs/projects` |
| [`v8s.link/v8s/status`](https://v8s.link/v8s/status) | `status.vanityUrls.link` |

Lancez `./scripts/lnk list` dans votre propre instance pour voir l'inventaire local courant. Lancez `./scripts/lnk add` lorsque vous etes pret a ajouter un lien avec l'interface en ligne de commande.
