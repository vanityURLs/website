# vanityURLs — round 16: dark chroma + trust copy refresh + worker rename + bot tagging

Four items in one round. Three are low-risk file edits that take effect on the next deploy. The fourth — renaming the Cloudflare Worker — has manual dashboard steps after the push.

## Item 1 — Dark chroma theme

Code blocks were rendering with the `github` (light) color palette in dark mode, which looked pasted in. Now they switch to `github-dark` when dark mode is active.

### How

1. **Generated the dark palette:** `hugo gen chromastyles --style=github-dark > /tmp/raw.css` produces 86 lines of CSS rules, one per token type.
2. **Scoped under `.dark`:** every selector got a `.dark ` prefix so the rules only fire when Tailwind's dark-mode class is present on `<html>`. (Your `tailwind.config.js` uses `darkMode: 'class'`, so this is the right gating mechanism.)
3. **Imported alongside the existing light theme:** `assets/css/main.css` now has both `@import "chroma.css"` (light, default) and `@import "chroma-dark.css"` (dark, scoped).

The two stylesheets coexist because they target different selectors. Light rules are always in effect; dark rules layer on top when `.dark` is present, with higher specificity so they win.

### What you'll see

Open any docs page with a code block. Toggle the theme switcher. Code blocks should swap from white-background light syntax to `#0d1117` dark background with bright tokens.

If they don't switch, hard-refresh (Cmd+Shift+R) to bypass the CSS cache — your `_headers` rules cache fingerprinted CSS aggressively.

## Item 2 — Trust page copy refresh

Round 12 fixed the broken French rendering (schema mismatch). The *content* was still pre-round-9 — it didn't mention CSP, self-hosted fonts, or server-side analytics, even though those have all shipped.

This round tightens the descriptions to reflect what's actually live:

- **Privacy:** "No cookies, no client-side trackers. Search runs locally in your browser. Page-view counts are emitted server-side without setting any identifier on you."
- **Security:** "Strict CSP without `'unsafe-inline'`, self-hosted fonts, TLS 1.3, no third-party scripts. The Worker is open source."
- **License:** "MIT — no restrictions on commercial or personal use."
- **Hero:** Stronger framing — "trustworthy stewards of every visitor's data and attention."

Both EN and FR are updated and stay in sync.

## Item 3 — Rename Worker `website` → `vanityurls-website`

The current Worker is named `website`, which is generic and confusing in the multi-Worker dashboard view (especially once you ship a second Worker for the product repo). Renamed to `vanityurls-website`.

### Allowed characters in `name`

From Cloudflare's docs: the Worker name is used as a DNS label in `<NAME>.<SUBDOMAIN>.workers.dev`, so it must follow DNS label rules:

- Lowercase letters `a-z`, digits `0-9`, hyphens `-`
- Cannot start or end with a hyphen
- Maximum 63 characters when a workers.dev subdomain is enabled, 255 otherwise
- No uppercase, underscores, periods, or special characters

`vanityurls-website` is 18 chars, all lowercase, doesn't start/end with hyphen — valid.

### CRITICAL: rename creates a new Worker

Cloudflare treats the `name` field as the Worker's identity. Changing it doesn't rename in place — it deploys a fresh Worker with the new name. The old `website` Worker keeps running and serving your custom domain until you migrate.

After this push, you'll need to do these steps in the Cloudflare dashboard:

1. **Wait for the deploy to complete.** A new Worker named `vanityurls-website` will appear in Workers & Pages.
2. **Move the custom domain.** On the new Worker → Settings → Domains & Routes → Add → Custom domain → enter `vanityurls.link`. The dashboard will prompt you to confirm taking ownership from the old `website` Worker. Confirm.
3. **Set the secrets on the new Worker.** Secrets don't transfer between Workers:
   ```bash
   wrangler secret put UMAMI_WEBSITE_ID --name vanityurls-website
   wrangler secret put UMAMI_ENDPOINT   --name vanityurls-website
   ```
   Or use the dashboard: Workers & Pages → vanityurls-website → Settings → Variables and Secrets → Add.
4. **Verify the new Worker is serving:** `curl -sI https://vanityurls.link/en/ | head` — should return 200 with current content.
5. **Delete the old `website` Worker.** Workers & Pages → website → Settings → Delete.

Brief overlap is harmless — both Workers serve the same site since the build output is identical. The custom domain transfer takes a few seconds; secrets propagate immediately.

If you'd rather defer the rename, you can revert just `wrangler.toml`'s name change before pushing — the rest of round 16 is independent.

## Item 4 — Bot identification while keeping the data

You asked: can we identify bots while keeping the information visible? Yes, by promoting bot pageviews to named events with structured data.

### How Umami treats events vs pageviews

Per Umami's docs:

- A request without `name` and `data` is a **pageview** — counts in your main visitor/views chart.
- A request with `name` (and optionally `data`) is an **event** — appears in the Events tab, NOT in pageview charts.
- Critical constraint: "Event data cannot be sent without an event name." So if we want to attach `bot_name`, we must give it a `name`.

### What the Worker does now

For each HTML response:

| Status | UA matches a bot pattern? | Sent to Umami as |
|---|---|---|
| 200    | No   | Pageview (no `name`, no `data`) — counts in main chart |
| 200    | Yes  | Event with `name: "bot"` and `data: { bot_name: "Googlebot" }` |
| 404    | (any)| Event with `name: "404"` (404 takes priority over bot tag) |

That gives you three clean buckets in the Umami UI:
- **Pageviews chart:** humans only.
- **Events tab → "bot":** all crawler traffic, with a `bot_name` breakdown property showing Googlebot vs Bingbot vs ClaudeBot vs … This is where you can see *which* bots are crawling and how often.
- **Events tab → "404":** missing-page hits, separate from everything else.

### Why 404 wins over bot

A 404 is about the URL (someone tried to fetch a page that doesn't exist). The bot tag is about the requester. They're orthogonal, but Umami's `name` field can only hold one value. I chose to surface 404 because broken-link debugging is more time-sensitive than crawler analytics.

### Patterns covered

Twenty-four regex patterns, ordered specific-to-general so named bots match first:

- Search engines: Googlebot, Bingbot, DuckDuckBot, YandexBot, Baiduspider, Applebot
- SEO crawlers: AhrefsBot, SemrushBot, MJ12bot, DotBot
- AI scrapers: GPTBot, ClaudeBot, PerplexityBot, CCBot, Bytespider
- Social link previews: FacebookExternalHit, Twitterbot, LinkedInBot, Slackbot, Discordbot, TelegramBot, WhatsApp
- Generic catch-alls: `bot/`, `crawler`, `spider`, `scraper`, `headless`, `phantomjs`, monitors (UptimeRobot, Pingdom, etc.), CLI tools (curl, wget, python-requests)

Anything caught by the catch-all rules gets `bot_name: "Other"`, `"Headless"`, `"Monitor"`, or `"CLI"` — coarse but useful.

### Limitations

- **Bots that lie about their UA aren't caught.** A puppeteer instance with a real Firefox UA will be counted as a human. Cloudflare Bot Management would catch these via behavioral signals, but it's a paid feature.
- **Umami's built-in `isbot` filter is still active server-side.** If a bot's UA matches `isbot` patterns, Umami may drop the event before recording. So the Events → "bot" bucket reflects bots that *we* tagged AND `isbot` allowed through. Set `DISABLE_BOT_CHECK=1` in your Umami environment if you want to see all of them — but on Umami Cloud you can't change that.

### Tests

`src/worker.test.mjs` now has 18 tests (was 10). New cases:

- Googlebot, Bingbot, ClaudeBot, Slackbot, curl → tagged correctly
- Real Firefox UA → stays as plain pageview (no bot tag)
- Bot + 404 → 404 wins
- Generic `bot/` pattern catches unknown crawlers as `Other`

Run with `npm test`.

## Files in this patch

| File | Change |
|---|---|
| `assets/css/chroma-dark.css` | **New** — github-dark Chroma scoped under `.dark` |
| `assets/css/main.css` | One-line `@import "chroma-dark.css"` after the light import |
| `data/trust.en.yml` | Description copy refreshed across all 6 commitments cards |
| `data/trust.fr.yml` | Matching FR copy refresh |
| `wrangler.toml` | `name = 'vanityurls-website'` |
| `src/worker.mjs` | Bot detection (24 patterns) + tagging logic |
| `src/worker.test.mjs` | +8 tests for bot detection |

## Apply

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
unzip -o ~/Downloads/vanityurls-round16.zip
git add -A
git commit -m "feat: dark chroma + trust copy + bot tagging; rename worker"
git push
```

## Post-deploy steps for the Worker rename

After Cloudflare finishes the build (you'll see `vanityurls-website` appear in Workers & Pages):

```bash
# 1. Move the custom domain via dashboard (see Item 3 above)
# 2. Set secrets on the new Worker
wrangler secret put UMAMI_WEBSITE_ID --name vanityurls-website
wrangler secret put UMAMI_ENDPOINT   --name vanityurls-website
# 3. Verify
curl -sI https://vanityurls.link/en/ | head -1   # 200 OK
# 4. Delete the old `website` Worker via dashboard
```

## Validate after deploy

**Dark chroma:**
- Open `/en/docs/getting-started/` (has code blocks)
- Toggle dark mode — code blocks should switch to dark background
- Hard-refresh if cached

**Trust copy:**
- `/en/trust/` and `/fr/trust/` — read each card, confirm wording matches what we shipped
- Check the Privacy and Security cards specifically (most updated)

**Bot tagging:**
- Wait a few hours for organic crawler traffic
- In Umami dashboard, click Events tab → look for `bot` and `404`
- Click into `bot` → Properties → see the `bot_name` breakdown
- Pageviews chart should now exclude crawler traffic

If you want to test locally before the dashboard work:
```bash
npm test                                    # 18 tests pass
node -e 'console.log(/bot[\/\s\-\d]/i.test("SomeBot/1.0"))'  # true
```
