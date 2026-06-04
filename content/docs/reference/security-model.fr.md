---
aside: false
title: "Modèle de sécurité"
description: "Frontières de confiance, surfaces contrôlées par l'attaquant, et endroit où chaque contrôle est appliqué entre le build, le Worker runtime et l'edge Cloudflare."
weight: 101
aliases:
  - /fr/docs/security-model/
---

Cette page est écrite pour les revues de sécurité. [Sécurité runtime](/fr/docs/reference/runtime-security/) explique comment le Worker se comporte. [Protection réseau](/fr/docs/customize/network-protection/) et [Contrôle d'accès](/fr/docs/customize/access-control/) expliquent ce qu'un opérateur configure. Cette page relie ces vues en nommant les frontières de confiance et en montrant où chaque contrôle est appliqué : build, runtime Worker ou edge Cloudflare.

L'erreur de revue la plus courante est de considérer qu'un contrôle appliqué à l'edge ou au build manque parce qu'il n'est pas dans le code du Worker. La matrice ci-dessous rend cette séparation explicite.

## Couches de défense

{{< mermaid >}}
flowchart LR
A["Requête visiteur"] --> B["Edge Cloudflare<br/>TLS, WAF, rate limit,<br/>bots et contrôles Access"]
B --> C["Worker vanityURLs<br/>contrôles méthode, cible<br/>et assets runtime"]
C --> D["Assets statiques<br/>générés depuis un registre<br/>validé au build"]
{{< /mermaid >}}

Une requête traverse trois frontières. Chaque couche suivante suppose que les couches précédentes peuvent avoir été contournées et revérifie ce qu'elle possède, donc aucune couche n'est la seule ligne de défense.

## Frontières de confiance

| Surface                                                      | Entrée contrôlée par                             | Exécution                                            | Notes                                                                                                                                                                                                        |
| ------------------------------------------------------------ | ------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Requêtes publiques de redirection et de pages                | N'importe qui                                    | Worker, à l'edge                                     | Surface principale exposée aux attaquants. Méthode, chemin, headers et slug sont tous non fiables.                                                                                                           |
| Cibles de redirection et registre de liens (`v8s.json`)      | Opérateur                                        | Build local ou CI, servi en lecture seule au runtime | Les cibles sont des données statiques, validées avant déploiement. Il n'y a pas de chemin d'écriture runtime, de surface d'injection stockée, ni d'endpoint de création authentifié.                         |
| Politique et blocklist (`v8s-policies.json`, feeds générés)  | Opérateur, plus URLs de feeds upstream épinglées | Build                                                | Les feeds générés peuvent seulement ajouter des blocages. Le générateur force une allow list vide, donc un feed compromis ne peut pas autoriser une cible malveillante.                                      |
| Chemins opérationnels protégés (`/<lang>/_stats`, `/_tests`) | Mainteneur authentifié                           | Worker, derrière Cloudflare Access                   | Échoue fermé : `503` quand Access n'est pas configuré, `403` sans JWT valide.                                                                                                                                |
| Scripts locaux et CI (`scripts/`)                            | Opérateur                                        | Machine opérateur ou runner CI                       | Non exposés au réseau. Les sous-processus utilisent des tableaux d'arguments; le fallback npm Windows est centralisé pour la compatibilité des chemins. L'installateur ne manipule pas de secrets.           |
| Fichiers produit upstream (`npm run upgrade`)                | Mainteneurs upstream, via HTTPS                  | Machine opérateur                                    | Remplace seulement les chemins possédés par le produit; `custom/`, `wrangler.toml` et `.dev.vars` sont protégés. Voir la note de confiance dans [Supply chain](#supply-chain).                               |
| Contrôles du tableau de bord Cloudflare                      | Opérateur                                        | Edge Cloudflare                                      | Utilisés pour les contrôles qui ne peuvent pas raisonnablement vivre dans Git, comme Access, WAF, rate limits, TLS, contrôles bot et secrets runtime. Les doublons possédés par le dépôt restent désactivés. |

## Matrice d'application

Un `check` signifie que la couche applique activement le contrôle. Un tiret signifie qu'elle ne le fait pas, par conception.

| Contrôle                                                                                                                                                 |       Build        |           Runtime Worker            |                          Edge Cloudflare                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------: | :---------------------------------: | :---------------------------------------------------------------: |
| Allowlist des protocoles de redirection (`http:`/`https:`)                                                                                               |       check        |                check                |                                 -                                 |
| Hygiène open redirect : pas d'identifiants, pas de caractères de contrôle, hostname obligatoire                                                          |       check        |                check                |                                 -                                 |
| Détection de cibles dangereuses : localhost, `.local`, plages IP privées/réservées/multicast/documentation, extensions exécutables, exemples de phishing |       check        |                  -                  |                                 -                                 |
| Blocklist domaines et mots-clés : shorteners, hôtes jetables, politique custom                                                                           |       check        |                  -                  |                                 -                                 |
| Valeurs splat encodées URL segment par segment                                                                                                           |         -          |                check                |                                 -                                 |
| Allowlist de méthodes HTTP (`GET`/`HEAD`/`OPTIONS`)                                                                                                      |         -          |                check                |                               check                               |
| Assets runtime privés cachés (`v8s.json`, blocklist, site config)                                                                                        |         -          |            check (`404`)            |           check (`_headers` no-index/no-store fallback)           |
| Chemins opérationnels protégés avec authentification                                                                                                     |         -          |      check (JWT, échec fermé)       |                     check (Cloudflare Access)                     |
| Blocage des probes scanner                                                                                                                               |         -          |          check (fallback)           |                    check (WAF, première ligne)                    |
| Protection des slugs réservés : aucun lien sous `/_stats`, `/api`, assets runtime bruts et préfixes associés                                             |       check        |     check (précédence routage)      |                                 -                                 |
| Contrôles anti-harvesting lookup                                                                                                                         |         -          | exact-match seulement, pas de liste | check (rate limits explicites `/_lookup` et `/_analytics/lookup`) |
| Rate limiting                                                                                                                                            |         -          |                  -                  |                               check                               |
| Contrôles bots et crawlers IA                                                                                                                            |         -          |                  -                  |                               check                               |
| Sécurité transport : Always HTTPS, TLS minimum, HSTS                                                                                                     |         -          |         check (header HSTS)         |                       check (TLS et HTTPS)                        |
| Headers contenu, cache et robots : `nosniff`, `X-Robots-Tag`, `Cache-Control`, CSP, referrer, permissions, framing                                       | check (`_headers`) |     check (réponses dynamiques)     |                     check (politique servie)                      |
| `src/` généré correspond à `scripts/workers/`                                                                                                            |       check        |                  -                  |                                 -                                 |

Deux conséquences comptent pendant une revue :

- **La sécurité des cibles est surtout une propriété de build.** Les cibles sont statiques et validées avant déploiement, donc le Worker revérifie seulement les propriétés qui comptent à la requête : protocole, identifiants, caractères de contrôle et présence du hostname. Revoir la sécurité des cibles demande de lire `validate-registry.mjs`, `blocklist-policy.mjs`, `constants.mjs` et `defaults/v8s-policies.json`, pas seulement le Worker.
- **Une grande partie de la posture vit à l'edge.** TLS, application HTTPS, rate limiting, contrôles bot, Access et premier blocage des probes scanner sont des réglages Cloudflare. Ils sont documentés dans [Protection réseau](/fr/docs/customize/network-protection/) et suivis dans `data/cloudflare-protection-defaults.json`, mais ne sont pas du code applicatif.

## Secrets et données sensibles

- Les secrets Worker vivent dans les secrets runtime Cloudflare, comme `CF_ACCESS_AUD` quand Access est activé. `CF_ACCESS_TEAM_DOMAIN` est une variable runtime non secrète.
- L'installateur ne lit, n'écrit et ne journalise pas de secrets. Les scripts analytics lisent les clés fournisseur seulement depuis les variables d'environnement, et les diagnostics masquent le header `Authorization`.
- Les secrets locaux vivent dans `.dev.vars`, ignoré par Git. Les chemins de helper propres au poste vivent dans `custom/v8s-local-config.json`.
- À la requête, le Worker transmet par défaut une IP visiteur tronquée aux analytics (IPv4 en `/24`, IPv6 en `/48`), plus user agent, pays et colo. Le mode IP complète est opt-in. Le redirecteur lui-même ne stocke aucun identifiant visiteur.

## Supply chain

- Le package Worker n'a aucune dépendance npm runtime. Les dépendances de développement sont des outils de build et de formatage.
- `npm run upgrade` récupère les fichiers produit depuis le remote Git upstream via HTTPS, puis exécute le build et les tests sur le code récupéré avant que l'opérateur révise le diff.
- Le flux d'upgrade remplace seulement les chemins possédés par le produit. `custom/`, `wrangler.toml`, `.dev.vars` et la configuration locale de l'instance restent protégés.
- La source d'upgrade par défaut est une ref de branche, pas un artefact de release vérifié. Traitez le remote upstream et le transport opérateur comme faisant partie de la base de confiance. Épinglez un tag de release avec `--ref` lorsque cette hypothèse est trop large.

## Ordre de revue

Lisez dans cet ordre; chaque étape suppose le modèle de menace de l'étape précédente.

1. Cette page : frontières de confiance et matrice d'application
2. La surface exposée au réseau : `scripts/workers/worker.mjs` et `scripts/workers/worker.test.mjs`
3. La couche d'application de la confiance, où les cibles dangereuses sont définies : `validate-registry.mjs`, `blocklist-policy.mjs`, `constants.mjs` et `defaults/v8s-policies.json`
4. Configuration et supply chain : `wrangler.toml`, `defaults/public/_headers`, `package.json` et [ADR 0014](https://github.com/vanityURLs/code/blob/main/docs/adr/0014-prefer-repository-owned-configuration.md)
5. Les docs de configuration edge : [Protection réseau](/fr/docs/customize/network-protection/), [Contrôle d'accès](/fr/docs/customize/access-control/) et `data/cloudflare-protection-defaults.json`

## Notes de revue

Ce ne sont pas des vulnérabilités connues; ce sont les endroits qui reviennent souvent en revue.

- Les keysets Access sont cachés par isolate Worker et peuvent être rafraîchis quand un key id inconnu est vu. Lisez `loadAccessJwks` dans `worker.mjs` pour ajuster le comportement de rotation de clés.
- Lookup est public par conception, mais exact-match seulement. Il ne liste pas les liens et n'autocomplète pas les slugs. Traitez la pression d'énumération comme un sujet de rate limiting edge, pas comme un endpoint d'inventaire Worker.
- Les headers de sécurité possédés par le dépôt restent volontairement dans le Worker et les fichiers `_headers`. Le transform large de headers de sécurité Cloudflare reste off afin que la politique applicative ait une seule source de vérité.
