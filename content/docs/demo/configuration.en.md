---
aside: false
title: "Demo configuration"
description: "Configuration values used by the public v8s.link demo instance."
weight: 10

---

The source repository is [vanityURLs/v8s.link](https://github.com/vanityURLs/v8s.link), and the deployed instance is [https://v8s.link](https://v8s.link). The demo intentionally does not configure analytics, final legal copy, jurisdiction-specific privacy and terms pages, or finished branding. Refer to the documentation for the customization.

Quickstart uses the demo values to ensure that commands stay concrete. Needless to say, replace them with your own during setup.

## Configuration values

| Field | Value |
| --- | --- |
| Short domain | `v8s.link` |
| Local directory | `v8s-link` |
| GitHub account name | [https://github.com/vanityURLs](https://github.com/vanityURLs) |
| Repository | [`vanityURLs/v8s.link`](https://github.com/vanityURLs/v8s.link) |
| Worker name | `v8s-link` |
| Cloudflare Access team domain | `vanityurls.cloudflareaccess.com` |
| Operator legal name | `Benoît H. Dicaire` |
| Operator domain for contact emails | `vanityurls.link` |
| Trust & Safety contact | `abuse@vanityurls.link` |
| Security contact | `security@vanityurls.link` |
| Supported languages | `de,en,es,fr,it`, with English as the fallback |
| Analytics | Disabled |
| Legal and jurisdiction pages | Deferred |
| Branding | Split-color domain wordmark is `v8s.` and `link`; no slogan |

## Configuration files

| File | What to inspect |
|---|---|
| [`custom/v8s-site-config.json`](https://github.com/vanityURLs/v8s.link/blob/main/custom/v8s-site-config.json) | Instance settings created by `npm run setup` |
| [`wrangler.toml`](https://github.com/vanityURLs/v8s.link/blob/main/wrangler.toml) | Worker name, build command, Access team domain, route, and custom domain |
| [`custom/public/en/index.html`](https://github.com/vanityURLs/v8s.link/blob/main/custom/public/en/index.html) | Copied homepage with the split-color domain wordmark |
| [`custom/v8s-links.txt`](https://github.com/vanityURLs/v8s.link/blob/main/custom/v8s-links.txt) | Human-authored source of truth for short links |

When your instance behaves differently, compare your `custom/` files to the demo before digging into `defaults/`.

## Link inventory

`custom/v8s-links.txt` is the human-authored source of truth for [links](../../reference/link-format/).

| Slug | Target | State | Title | Description | Tags | Owner |
|---|---|---|---|---|---|---|
| [`ai/chat`](https://v8s.link/ai/chat) | `chatgpt.com` | default | Open AI | Artificial Intelligence | ai | bhd |
| [`ai/claude`](https://v8s.link/ai/claude) | `claude.ai` | default | Anthropic | Artificial Intelligence | ai | bhd |
| [`ai/g`](https://v8s.link/ai/g) | `gemini.google.com/` | default | Gemini | Artificial Intelligence | ai | bhd |
| [`ai/hf`](https://v8s.link/ai/hf) | `https://huggingface.co` | default | Hugging Face | AI Community and Models | ai | bhd |
| [`amazon/orders`](https://v8s.link/amazon/orders) | `https://amazon.com/your-orders` | default | Retail Orders | Purchase history | shopping | bhd |
| [`amazon/wish`](https://v8s.link/amazon/wish) | `https://amazon.com/wishlist` | default | Amazon Wishlist | Personal shopping list | shopping | bhd |
| [`bank`](https://v8s.link/bank) | `https://chase.com` | default | Primary Bank | Banking portal | finance | bhd |
| [`blacklist-source`](https://v8s.link/blacklist-source) | `https://github.com/StevenBlack/hosts` | default | Ad/Malware Blocklist | Source for domain blocking | security,infra | bhd |
| [`check-link`](https://v8s.link/check-link) | `https://www.virustotal.com/gui/home/url` | default | VirusTotal URL Scan | Safety checker for links | security | bhd |
| [`contact`](https://v8s.link/contact) | `https://youtu.be/watch?v=dQw4w9WgXcQ` | permanent | Scheduled contact example | Demonstrates weekday business-hour routing with a fallback target | example,schedule | owner |
| [`course`](https://v8s.link/course) | `https://udemy.com/my-courses` | default | Udemy Active Course | Online learning platform | edu | bhd |
| [`crypto`](https://v8s.link/crypto) | `https://etherscan.io` | default | Wallet Explorer | Blockchain explorer | finance | bhd |
| [`db`](https://v8s.link/db) | `https://supabase.com` | default | Database Console | Database management | infra | bhd |
| [`diet`](https://v8s.link/diet) | `https://myfitnesspal.com` | default | Food Log | Nutrition tracking | health | bhd |
| [`edu/a`](https://v8s.link/edu/a) | `arxiv.org/list/cs/new` | default | arxiv | Research & Academic | edu,research | bhd |
| [`edu/d`](https://v8s.link/edu/d) | `doi.org/` | default | DOI | Research & Academic | edu,research | bhd |
| [`edu/s`](https://v8s.link/edu/s) | `scholar.google.com` | default | Google scholar | Research & Academic | edu,research | bhd |
| [`g/cal`](https://v8s.link/g/cal) | `https://calendar.google.com` | default | Calendar | Google Personal/Work schedule | productivity | bhd |
| [`g/drive`](https://v8s.link/g/drive) | `https://drive.google.com/drive/my-drive` | default | Google Drive | Primary cloud storage root | productivity,files | bhd |
| [`g/meet`](https://v8s.link/g/meet) | `https://meet.google.com/abc-def-ghi` | default | Google Meet | Personal Google meeting room | productivity,comms | bhd |
| [`gym`](https://v8s.link/gym) | `https://strong.app` | default | Workout Plan | Health and fitness tracking | health | bhd |
| [`hire`](https://v8s.link/hire) | `https://calendly.com/username/jobinterview` | default | Hire Me | Booking link for work inquiries | identity,professional | bhd |
| [`library`](https://v8s.link/library) | `https://libbyapp.com` | default | Libby Digital Library | Digital book lending | edu | bhd |
| [`logs`](https://v8s.link/logs) | `https://vercel.com/logs` | default | App Logs | Infrastructure monitoring | infra | bhd |
| [`meet/g`](https://v8s.link/meet/g) | `toBeDefined.com` | permanent | Google Meet | Personal meeting room | d,saas | bhd |
| [`meet/t`](https://v8s.link/meet/t) | `toBeDefined.com` | permanent | MS Teams | Personal meeting room | d,saas | bhd |
| [`meet/z`](https://v8s.link/meet/z) | `toBeDefined.com` | permanent | Zoom | Personal meeting room | d,saas | bhd |
| [`notes`](https://v8s.link/notes) | `https://notion.so/workspace` | default | Notion | Digital brain and notes | productivity | bhd |
| [`pkg/d`](https://v8s.link/pkg/d) | `hub.docker.com` | default | Docker Hub | Distribution / package manager | pkg,docker | bhd |
| [`pkg/g`](https://v8s.link/pkg/g) | `docs.github.com/en/packages` | default | GitHub Container Registry | Distribution / package manager | pkg,git | bhd |
| [`pkg/n`](https://v8s.link/pkg/n) | `www.npmjs.com/package` | default | NPM | Distribution / package manager | pkg,js | bhd |
| [`pkg/p`](https://v8s.link/pkg/p) | `pypi.org` | default | Python Package Index | Distribution / package manager | pkg,python | bhd |
| [`pkg/r`](https://v8s.link/pkg/r) | `crates.io` | default | Rust Crates Registry | Distribution / package manager | pkg,rust | bhd |
| [`social/fb`](https://v8s.link/social/fb) | `facebook.com/bhdicaire/` | default | Facebook | Social profile | social | bhd |
| [`social/ig`](https://v8s.link/social/ig) | `instagram.com/bhdicaire/` | default | Instagram | Social profile | social | bhd |
| [`social/tg`](https://v8s.link/social/tg) | `https://t.me/username` | default | Telegram | Instant messaging | social,comms | bhd |
| [`social/wa`](https://v8s.link/social/wa) | `https://wa.me/123456789` | default | WhatsApp | Direct mobile chat | social,comms | bhd |
| [`social/x`](https://v8s.link/social/x) | `x.com/BHDicaire/` | default | X profile | Social profile on X | social | bhd |
| [`sponsor/gh`](https://v8s.link/sponsor/gh) | `github.com/open-source/sponsors` | default | - | Sponsor / Donation | sponsor | bhd |
| [`sponsor/kofi`](https://v8s.link/sponsor/kofi) | `ko-fi.com` | default | - | Sponsor / Donation | sponsor | bhd |
| [`sponsor/p`](https://v8s.link/sponsor/p) | `www.patreon.com` | default | - | Sponsor / Donation | sponsor | bhd |
| [`sponsor/pp`](https://v8s.link/sponsor/pp) | `www.paypal.com/ca/non-profit/fundraising/individuals` | default | - | Sponsor / Donation | sponsor | bhd |
| [`test/1`](https://v8s.link/test/1) | `youtu.be/dQw4w9WgXcQ` | permanent | Test permanent (state) | - | test | bhd |
| [`test/2`](https://v8s.link/test/2) | `youtu.be/dQw4w9WgXcQ` | ephemeral | Test permanent (ephemeral) | Ephemeral -> 302 | test | bhd |
| [`test/3`](https://v8s.link/test/3) | `youtu.be/dQw4w9WgXcQ` | expired | Test expired (state) | effective state to expired | test | bhd |
| [`test/4`](https://v8s.link/test/4) | `youtu.be/dQw4w9WgXcQ` | disabled | Test disabled (state) | -> /disabled | test | bhd |
| [`test/5`](https://v8s.link/test/5) | `youtu.be/dQw4w9WgXcQ` | maintenance | Test maintenance (state) | - | test | bhd |
| [`test/6`](https://v8s.link/test/6) | `youtu.be/dQw4w9WgXcQ` | deactivated | Test deactivated (state) | deactivated -> true 404 | test | bhd |
| [`test/e`](https://v8s.link/test/e) | `youtu.be/dQw4w9WgXcQ` | permanent | Test expand page | - | test | bhd |
| [`test/i`](https://v8s.link/test/i) | `youtu.be/dQw4w9WgXcQ` | permanent | Test index page | - | test | bhd |
| [`test/s`](https://v8s.link/test/s) | `youtu.be/dQw4w9WgXcQ` | permanent | Test _stats page | - | test | bhd |
| [`trip`](https://v8s.link/trip) | `https://tripit.com` | default | Itinerary | Travel planning | travel | bhd |
| [`v8s/build`](https://v8s.link/v8s/build) | `github.com/vanityURLs/website/actions` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/code`](https://v8s.link/v8s/code) | `github.com/vanityURLs/vanityURLs` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/doc`](https://v8s.link/v8s/doc) | `vanityUrls.link/en/docs/` | default | VanityURLs documentation (web) | - | v8s,git | bhd |
| [`v8s/forum`](https://v8s.link/v8s/forum) | `github.com/orgs/vanityURLs/discussions` | default | VanityURLs discussions | - | v8s,git | bhd |
| [`v8s/hugo`](https://v8s.link/v8s/hugo) | `github.com/vanityURLs/website` | default | V8S website (hugo) | - | v8s,hugo | bhd |
| [`v8s/in`](https://v8s.link/v8s/in) | `linkedin.com/company/107469311` | default | LinkedIN Page VanityURLs | - | social,linkedin | bhd |
| [`v8s/issues`](https://v8s.link/v8s/issues) | `github.com/vanityurls/vanityurls/issues` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/latest`](https://v8s.link/v8s/latest) | `github.com/vanityURLs/website/releases/latest` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/lic`](https://v8s.link/v8s/lic) | `github.com/vanityURLs/vanityURLs/blob/main/LICENSE` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/pr`](https://v8s.link/v8s/pr) | `github.com/vanityURLs/website/pulls` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/roadmap`](https://v8s.link/v8s/roadmap) | `github.com/orgs/vanityURLs/projects` | default | V8S web site | documentation | v8s,git | bhd |
| [`v8s/status`](https://v8s.link/v8s/status) | `status.vanityUrls.link` | default | Uptime monitoring | status page | v8s,web | bhd |
| [`v8s/web`](https://v8s.link/v8s/web) | `vanityUrls.link/en/` | default | VanityURLs website) | - | v8s,web | bhd |

## Related documentation

### Planning context

- [Choosing a short domain for redirects](/blog/choosing-a-short-domain-for-redirects/)
- [Wrangler Without Shooting Yourself in the Foot](/blog/wrangler/)
- [Keeping vanityURLs upgradable with custom overrides](/blog/keeping-vanityurls-upgradable-with-custom-overrides/)
- [Where to start customizing vanityURLs](/blog/where-to-start-customizing-vanityurls/)

### Reference documentation

- [Configuration files](/docs/reference/configuration-files/)
- [Repository layout](/docs/reference/repository-layout/)
- [Custom overrides](/docs/customize/custom-overrides/)
- [Brand](/docs/customize/brand/)
- [Footer & pages](/docs/customize/footer-pages/)
- [Jurisdiction](/docs/customize/jurisdiction/)
