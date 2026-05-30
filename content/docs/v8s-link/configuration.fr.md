---
title: "Configuration de la démo"
description: "Valeurs de configuration utilisées par l'instance publique v8s.link."
weight: 10
aside: false
aliases:
  - /docs/demo/configuration/

---

Le dépôt source est [vanityURLs/v8s.link](https://github.com/vanityURLs/v8s.link), et l'instance déployée est [https://v8s.link](https://v8s.link). La démo ne configure volontairement pas les analytics, le texte légal final, les pages de confidentialité et de conditions propres à une juridiction, ni la marque finale. Consultez la documentation pour la personnalisation.

Quickstart utilise les valeurs de la démo pour garder les commandes concrètes. Naturellement, remplacez-les par les vôtres pendant le setup.

| Fichier | Ce qu'il faut inspecter |
|---|---|
| [`custom/public/en/index.html`](https://v8s.link) | Page d'accueil copiée avec le wordmark de domaine bicolore |
| [`custom/v8s-links.txt`](https://github.com/vanityURLs/v8s.link/blob/main/custom/public/en/index.html) | Source de vérité humaine pour les liens courts |
| [`custom/v8s-site-config.json`](https://github.com/vanityURLs/v8s.link/blob/main/custom/v8s-links.txt) | Réglages d'instance créés par `npm run setup` |
| [`wrangler.toml`](https://github.com/vanityURLs/v8s.link/blob/main/custom/v8s-site-config.json) | Nom du Worker, commande de build, domaine d'équipe Access, route et domaine personnalisé |

Lorsque votre instance se comporte différemment, comparez vos fichiers `custom/` avec la démo avant de creuser dans `defaults/`.

## Valeurs de configuration

| Champ | Valeur |
| --- | --- |
| Domaine court | `v8s.link` |
| Répertoire local | `v8s-link` |
| Nom du Worker | `v8s-link` |
| Compte GitHub | [https://github.com/vanityURLs](https://github.com/vanityURLs) |
| Dépôt | [`vanityURLs/v8s.link`](https://github.com/vanityURLs/v8s.link/blob/main/wrangler.toml) |
| Domaine d'équipe Cloudflare Access | `vanityurls.cloudflareaccess.com` |
| Nom légal de l'opérateur | `Benoît H. Dicaire` |
| Réviser les courriels de contact publics pour les pages générées | Oui |
| Domaine de l'opérateur pour les courriels de contact | `vanityurls.link` |
| Contact Trust & Safety | `abuse@vanityurls.link` |
| Contact sécurité | `security@vanityurls.link` |
| Langues supportées | `de,en,es,fr,it`, avec l'anglais comme fallback |
| Analytics | Désactivées |
| Marque | Wordmark de domaine bicolore avec `v8s.` et `link`; aucun slogan |
| Pages légales et de juridiction | Reportées |

## Inventaire de liens

`custom/v8s-links.txt` est la source de vérité humaine pour les [liens](../../reference/link-format/).

| Slug | Cible | État | Titre | Description | Tags | Propriétaire |
|---|---|---|---|---|---|---|
| [`ai/chat`](https://github.com/vanityURLs) | `chatgpt.com` | default | Open AI | Artificial Intelligence | ai | bhd |
| [`ai/claude`](https://github.com/vanityURLs/v8s.link) | `claude.ai` | default | Anthropic | Artificial Intelligence | ai | bhd |
| [`ai/g`](../../reference/link-format/) | `gemini.google.com/` | default | Gemini | Artificial Intelligence | ai | bhd |
| [`ai/hf`](https://v8s.link/ai/chat) | `https://huggingface.co` | default | Hugging Face | AI Community and Models | ai | bhd |
| [`amazon/orders`](https://v8s.link/ai/claude) | `https://amazon.com/your-orders` | default | Retail Orders | Purchase history | shopping | bhd |
| [`amazon/wish`](https://v8s.link/ai/g) | `https://amazon.com/wishlist` | default | Amazon Wishlist | Personal shopping list | shopping | bhd |
| [`bank`](https://v8s.link/ai/hf) | `https://chase.com` | default | Primary Bank | Banking portal | finance | bhd |
| [`blacklist-source`](https://v8s.link/amazon/orders) | `https://github.com/StevenBlack/hosts` | default | Ad/Malware Blocklist | Source for domain blocking | security,infra | bhd |
| [`check-link`](https://v8s.link/amazon/wish) | `https://www.virustotal.com/gui/home/url` | default | VirusTotal URL Scan | Safety checker for links | security | bhd |
| [`contact`](https://v8s.link/bank) | `https://youtu.be/watch?v=dQw4w9WgXcQ` | permanent | Scheduled contact example | Demonstrates weekday business-hour routing with a fallback target | example,schedule | owner |
| [`course`](https://v8s.link/blacklist-source) | `https://udemy.com/my-courses` | default | Udemy Active Course | Online learning platform | edu | bhd |
| [`crypto`](https://v8s.link/check-link) | `https://etherscan.io` | default | Wallet Explorer | Blockchain explorer | finance | bhd |
| [`db`](https://v8s.link/contact) | `https://supabase.com` | default | Database Console | Database management | infra | bhd |
| [`diet`](https://v8s.link/course) | `https://myfitnesspal.com` | default | Food Log | Nutrition tracking | health | bhd |
| [`edu/a`](https://v8s.link/crypto) | `arxiv.org/list/cs/new` | default | arxiv | Research & Academic | edu,research | bhd |
| [`edu/d`](https://v8s.link/db) | `doi.org/` | default | DOI | Research & Academic | edu,research | bhd |
| [`edu/s`](https://v8s.link/diet) | `scholar.google.com` | default | Google scholar | Research & Academic | edu,research | bhd |
| [`g/cal`](https://v8s.link/edu/a) | `https://calendar.google.com` | default | Calendar | Google Personal/Work schedule | productivity | bhd |
| [`g/drive`](https://v8s.link/edu/d) | `https://drive.google.com/drive/my-drive` | default | Google Drive | Primary cloud storage root | productivity,files | bhd |
| [`g/meet`](https://v8s.link/edu/s) | `https://meet.google.com/abc-def-ghi` | default | Google Meet | Personal Google meeting room | productivity,comms | bhd |
| [`gym`](https://v8s.link/g/cal) | `https://strong.app` | default | Workout Plan | Health and fitness tracking | health | bhd |
| [`hire`](https://v8s.link/g/drive) | `https://calendly.com/username/jobinterview` | default | Hire Me | Booking link for work inquiries | identity,professional | bhd |
| [`library`](https://v8s.link/g/meet) | `https://libbyapp.com` | default | Libby Digital Library | Digital book lending | edu | bhd |
| [`logs`](https://v8s.link/gym) | `https://vercel.com/logs` | default | App Logs | Infrastructure monitoring | infra | bhd |
| [`meet/g`](https://v8s.link/hire) | `toBeDefined.com` | permanent | Google Meet | Personal meeting room | d,saas | bhd |
| [`meet/t`](https://v8s.link/library) | `toBeDefined.com` | permanent | MS Teams | Personal meeting room | d,saas | bhd |
| [`meet/z`](https://v8s.link/logs) | `toBeDefined.com` | permanent | Zoom | Personal meeting room | d,saas | bhd |
| [`notes`](https://v8s.link/meet/g) | `https://notion.so/workspace` | default | Notion | Digital brain and notes | productivity | bhd |
| [`pkg/d`](https://v8s.link/meet/t) | `hub.docker.com` | default | Docker Hub | Distribution / package manager | pkg,docker | bhd |
| [`pkg/g`](https://v8s.link/meet/z) | `docs.github.com/en/packages` | default | GitHub Container Registry | Distribution / package manager | pkg,git | bhd |
| [`pkg/n`](https://v8s.link/notes) | `www.npmjs.com/package` | default | NPM | Distribution / package manager | pkg,js | bhd |
| [`pkg/p`](https://v8s.link/pkg/d) | `pypi.org` | default | Python Package Index | Distribution / package manager | pkg,python | bhd |
| [`pkg/r`](https://v8s.link/pkg/g) | `crates.io` | default | Rust Crates Registry | Distribution / package manager | pkg,rust | bhd |
| [`social/fb`](https://v8s.link/pkg/n) | `facebook.com/bhdicaire/` | default | Facebook | Social profile | social | bhd |
| [`social/ig`](https://v8s.link/pkg/p) | `instagram.com/bhdicaire/` | default | Instagram | Social profile | social | bhd |
| [`social/tg`](https://v8s.link/pkg/r) | `https://t.me/username` | default | Telegram | Instant messaging | social,comms | bhd |
| [`social/wa`](https://v8s.link/social/fb) | `https://wa.me/123456789` | default | WhatsApp | Direct mobile chat | social,comms | bhd |
| [`social/x`](https://v8s.link/social/ig) | `x.com/BHDicaire/` | default | X profile | Social profile on X | social | bhd |
| [`sponsor/gh`](https://v8s.link/social/tg) | `github.com/open-source/sponsors` | default | - | Sponsor / Donation | sponsor | bhd |
| [`sponsor/kofi`](https://v8s.link/social/wa) | `ko-fi.com` | default | - | Sponsor / Donation | sponsor | bhd |
| [`sponsor/p`](https://v8s.link/social/x) | `www.patreon.com` | default | - | Sponsor / Donation | sponsor | bhd |
| [`sponsor/pp`](https://v8s.link/sponsor/gh) | `www.paypal.com/ca/non-profit/fundraising/individuals` | default | - | Sponsor / Donation | sponsor | bhd |
| [`test/1`](https://v8s.link/sponsor/kofi) | `youtu.be/dQw4w9WgXcQ` | permanent | Test permanent (state) | - | test | bhd |
| [`test/2`](https://v8s.link/sponsor/p) | `youtu.be/dQw4w9WgXcQ` | ephemeral | Test permanent (ephemeral) | Ephemeral -> 302 | test | bhd |
| [`test/3`](https://v8s.link/sponsor/pp) | `youtu.be/dQw4w9WgXcQ` | expired | Test expired (state) | effective state to expired | test | bhd |
| [`test/4`](https://v8s.link/test/1) | `youtu.be/dQw4w9WgXcQ` | disabled | Test disabled (state) | -> /disabled | test | bhd |
| [`test/5`](https://v8s.link/test/2) | `youtu.be/dQw4w9WgXcQ` | maintenance | Test maintenance (state) | - | test | bhd |
| [`test/6`](https://v8s.link/test/3) | `youtu.be/dQw4w9WgXcQ` | deactivated | Test deactivated (state) | deactivated -> true 404 | test | bhd |
| [`test/e`](https://v8s.link/test/4) | `youtu.be/dQw4w9WgXcQ` | permanent | Test expand page | - | test | bhd |
| [`test/i`](https://v8s.link/test/5) | `youtu.be/dQw4w9WgXcQ` | permanent | Test index page | - | test | bhd |
| [`test/s`](https://v8s.link/test/6) | `youtu.be/dQw4w9WgXcQ` | permanent | Test _stats page | - | test | bhd |
| [`trip`](https://v8s.link/test/e) | `https://tripit.com` | default | Itinerary | Travel planning | travel | bhd |
| [`v8s/build`](https://v8s.link/test/i) | `github.com/vanityURLs/website/actions` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/code`](https://v8s.link/test/s) | `github.com/vanityURLs/vanityURLs` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/doc`](https://v8s.link/trip) | `vanityUrls.link/en/docs/` | default | VanityURLs documentation (web) | - | v8s,git | bhd |
| [`v8s/forum`](https://v8s.link/v8s/build) | `github.com/orgs/vanityURLs/discussions` | default | VanityURLs discussions | - | v8s,git | bhd |
| [`v8s/hugo`](https://v8s.link/v8s/code) | `github.com/vanityURLs/website` | default | V8S website (hugo) | - | v8s,hugo | bhd |
| [`v8s/in`](https://v8s.link/v8s/doc) | `linkedin.com/company/107469311` | default | LinkedIN Page VanityURLs | - | social,linkedin | bhd |
| [`v8s/issues`](https://v8s.link/v8s/forum) | `github.com/vanityurls/vanityurls/issues` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/latest`](https://v8s.link/v8s/hugo) | `github.com/vanityURLs/website/releases/latest` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/lic`](https://v8s.link/v8s/in) | `github.com/vanityURLs/vanityURLs/blob/main/LICENSE` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/pr`](https://v8s.link/v8s/issues) | `github.com/vanityURLs/website/pulls` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/roadmap`](https://v8s.link/v8s/latest) | `github.com/orgs/vanityURLs/projects` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/status`](https://v8s.link/v8s/lic) | `status.vanityUrls.link` | default | Uptime monitoring | status page | v8s,web | bhd |
| [`v8s/web`](https://v8s.link/v8s/pr) | `vanityUrls.link/en/` | default | VanityURLs website) | - | v8s,web | bhd |

## Documentation liée

**Contexte de planification**

- [Choisir un domaine court pour les redirections](/en/blog/choosing-a-short-domain-for-redirects/)
- [Wrangler Without Shooting Yourself in the Foot](/en/blog/wrangler/)
- [Garder vanityURLs à jour avec les surcharges custom](/fr/blog/keeping-vanityurls-upgradable-with-custom-overrides/)
- [Par où commencer la personnalisation de vanityURLs](/fr/blog/where-to-start-customizing-vanityurls/)

**Documentation de référence**

- [Fichiers de configuration](/fr/docs/reference/configuration-files/)
- [Structure du dépôt](/fr/docs/reference/repository-layout/)
- [Surcharges custom](/fr/docs/reference/custom-overrides/)
- [Marque](/fr/docs/reference/brand/)
- [Pied de page et pages](/fr/docs/customize/footer-pages/)
- [Juridiction](/fr/docs/customize/jurisdiction/)
