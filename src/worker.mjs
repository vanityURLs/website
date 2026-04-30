/**
 * vanityurls.link edge worker — server-side analytics.
 *
 * Architecture:
 *   - wrangler.toml's run_worker_first = ["/*", "!/js/*", ...] narrows
 *     Worker invocation to HTML-ish paths. Asset requests never reach
 *     this code (and aren't billed).
 *   - This Worker fetches the HTML from env.ASSETS, returns it to the
 *     user, and fires a background Umami pageview event via ctx.waitUntil().
 *
 * Non-goals:
 *   - No client-side JS, no cookies. Zero client impact.
 *   - No redirect tracking (301/302 responses are pass-throughs; the
 *     target page fires its own event).
 *
 * Privacy:
 *   - The browser only talks to vanityurls.link — never to Umami directly.
 *   - We pass CF-Connecting-IP and User-Agent to Umami as override fields
 *     so its browser/country detection works. Umami's policy is to hash
 *     IPs rather than persist them. Remove those two fields below if you
 *     want to drop even that.
 *
 * Required secrets (set with `wrangler secret put ...`):
 *   - UMAMI_WEBSITE_ID  : UUID from Umami dashboard → Settings → Websites
 *   - UMAMI_ENDPOINT    : e.g. "https://cloud.umami.is/api/send"
 *
 * Umami's /api/send requires a User-Agent on the outbound request or the
 * event is dropped. We forward the visitor's UA (when present) and fall
 * back to a tracker string otherwise.
 */

// Defense-in-depth extension guard. The wrangler glob already excludes
// asset prefixes, but this catches one-off files we might add later
// (favicon.ico at root, etc.) before spending a fetch on env.ASSETS.
const ASSET_EXT_RE =
  /\.(css|js|mjs|map|json|xml|txt|ico|svg|png|jpg|jpeg|gif|webp|avif|woff2?|ttf|otf|eot|pdf|zip|wasm|webmanifest)$/i;

const WORKER_UA_FALLBACK =
  // Has to be a real-looking browser UA to bypass Umami's isbot filter on the
  // INCOMING request to Umami. Without this, Umami's is-bot package would
  // silently drop the event (returns 200 with `{"beep":"boop"}`) before
  // recording. We keep the visitor's actual UA in `payload.userAgent` for
  // accurate browser/OS attribution — that field is read from the JSON body,
  // not the request header, and isn't subject to the isbot filter.
  // See: github.com/umami-software/umami/issues/838
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Safari/605.1.15";

export default {
  /**
   * @param {Request} request
   * @param {{ ASSETS: Fetcher, UMAMI_WEBSITE_ID?: string, UMAMI_ENDPOINT?: string }} env
   * @param {ExecutionContext} ctx
   */
  async fetch(request, env, ctx) {
    const method = request.method;
    if (method !== "GET" && method !== "HEAD") {
      return env.ASSETS.fetch(request);
    }

    const url = new URL(request.url);

    // Guard against any asset request that slipped past the wrangler glob.
    if (ASSET_EXT_RE.test(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    const response = await env.ASSETS.fetch(request);

    const contentType = response.headers.get("content-type") || "";
    const isHtml = contentType.toLowerCase().startsWith("text/html");
    const isTrackableStatus = response.status === 200 || response.status === 404;

    if (isHtml && isTrackableStatus && method === "GET") {
      // Background task — never blocks or delays the response.
      ctx.waitUntil(trackPageview(request, env, response.status));
    }

    return response;
  },
};

/**
 * @param {Request} request
 * @param {{ UMAMI_WEBSITE_ID?: string, UMAMI_ENDPOINT?: string }} env
 * @param {number} status
 */
// ── Bot detection ─────────────────────────────────────────────
// Server-side bot detection via User-Agent regex. Catches the bulk of
// declared crawlers: search engines, AI scrapers, link-preview fetchers,
// uptime monitors, headless browsers. Detected bots are still recorded
// to Umami — but as named events (`name: "bot"`) with the bot family in
// `data`, which keeps them OUT of pageview charts while preserving the
// signal for inspection. To filter further: in Umami, exclude events
// where `name = "bot"` from your dashboard view.
//
// Limitations:
//   - Bots that lie about their UA are not caught (puppeteer with a real
//     UA, scraping APIs, etc). Cloudflare Bot Management would catch
//     these but requires a paid plan.
//   - Umami already runs `isbot` server-side; this gives us an extra
//     layer plus the ability to TAG instead of DROP.
//
// Patterns are lowercased for case-insensitive matching.
const BOT_PATTERNS = [
  // Search engines
  { re: /googlebot/i,                         name: "Googlebot" },
  { re: /bingbot/i,                           name: "Bingbot" },
  { re: /duckduckbot|duckduckgo-favicons-bot/i, name: "DuckDuckBot" },
  { re: /yandexbot/i,                         name: "YandexBot" },
  { re: /baiduspider/i,                       name: "Baiduspider" },
  { re: /applebot/i,                          name: "Applebot" },
  // SEO / link-graph crawlers
  { re: /ahrefsbot/i,                         name: "AhrefsBot" },
  { re: /semrushbot/i,                        name: "SemrushBot" },
  { re: /mj12bot/i,                           name: "MJ12bot" },
  { re: /dotbot/i,                            name: "DotBot" },
  // AI scrapers
  { re: /gptbot/i,                            name: "GPTBot" },
  { re: /claudebot|claude-web/i,              name: "ClaudeBot" },
  { re: /perplexitybot/i,                     name: "PerplexityBot" },
  { re: /ccbot/i,                             name: "CCBot" },
  { re: /bytespider/i,                        name: "Bytespider" },
  // Social link-preview fetchers (these are GENUINELY useful but not visitors)
  { re: /facebookexternalhit/i,               name: "FacebookExternalHit" },
  { re: /twitterbot/i,                        name: "Twitterbot" },
  { re: /linkedinbot/i,                       name: "LinkedInBot" },
  { re: /slackbot/i,                          name: "Slackbot" },
  { re: /discordbot/i,                        name: "Discordbot" },
  { re: /telegrambot/i,                       name: "TelegramBot" },
  { re: /whatsapp/i,                          name: "WhatsApp" },
  // Generic catch-alls — last so specific names above match first.
  // /bot[\/\s\-\d]/i catches "Googlebot/", "SomeUnknownBot/", "bot-1.0", "bot 2",
  // without matching "robotic" or "abbot".
  { re: /bot[\/\s\-\d]|crawler|spider|scraper/i, name: "Other" },
  { re: /headlesschrome|phantomjs|httrack/i,  name: "Headless" },
  { re: /uptimerobot|pingdom|monitis|statuscake/i, name: "Monitor" },
  { re: /curl|wget|python-requests|libwww/i,  name: "CLI" },
];

/**
 * @param {string | null} ua
 * @returns {string | null} The bot family name, or null if not a known bot.
 */
function detectBot(ua) {
  if (!ua) return null;
  for (const { re, name } of BOT_PATTERNS) {
    if (re.test(ua)) return name;
  }
  return null;
}


/**
 * Fire a single Umami event for the request.
 *
 * Routing logic by event type:
 *   - 200 + non-bot UA + no UTMs → standard pageview (no `name`, no `data`).
 *   - 200 + non-bot UA + UTMs    → event with name="campaign", data.utm_*.
 *   - 200 + bot UA               → event with name="bot", data.bot_name (+ utm_* if any).
 *   - 404                        → event with name="404" (+ utm_* if any).
 *
 * Umami constraint: events with `data` MUST have a `name`. Pageviews
 * (without `name`) cannot carry custom data. So any time we have UTM
 * dimensions or a bot tag, the record is promoted to a named event.
 *
 * UTM stripping: the standardized 5 Google params (utm_source/medium/
 * campaign/term/content) are removed from `payload.url` and surfaced
 * in `payload.data` instead, so they're filterable Umami dimensions.
 * Other query params are passed through unchanged.
 *
 * @param {Request} request
 * @param {{ UMAMI_WEBSITE_ID?: string, UMAMI_ENDPOINT?: string }} env
 * @param {number} status
 */
async function trackPageview(request, env, status) {
  if (!env.UMAMI_WEBSITE_ID || !env.UMAMI_ENDPOINT) {
    // Secrets missing — silently skip. Makes `wrangler dev` quiet too.
    //
    // OPERATIONS NOTE: Cloudflare's dashboard exposes "Variables and Secrets"
    // in TWO places that look identical but have different scopes:
    //
    //   ✓ Settings → Variables and Secrets         ← runtime, available as env.*
    //   ✗ Settings → Build → Variables and secrets ← build-time only, NOT in env
    //
    // Both UMAMI_WEBSITE_ID and UMAMI_ENDPOINT must be defined at the runtime
    // level (the first one) for this Worker to receive them. Putting them in
    // the Build section produces no error at deploy time but the Worker sees
    // them as undefined and silently skips analytics.
    //
    // To configure: Workers & Pages → vanityurls-website → Settings →
    // Variables and Secrets → + Add → Type: Secret.
    return;
  }

  try {
    const url = new URL(request.url);
    const headers = request.headers;

    // Strip recognized UTM campaign params from the URL we report, and
    // collect them into a structured `data` object for filterable Umami
    // dimensions. Other query params (?ref=hn, search-result tracking,
    // etc.) stay in the URL — we strip the standardized UTM set only.
    const { cleanedSearch, utmData } = extractUtm(url.searchParams);

    // Umami /api/send payload shape — ref: https://docs.umami.is/docs/api/sending-stats
    // Fields we can't derive server-side (screen, title) are omitted; Umami
    // accepts partial data. We override Umami's server-side detection of
    // UA/IP because the request is hitting Umami from Cloudflare's edge,
    // not from the real visitor.
    const payload = {
      hostname: url.hostname,
      language: firstLanguage(headers.get("accept-language")),
      referrer: headers.get("referer") || "",
      url: url.pathname + cleanedSearch,
      website: env.UMAMI_WEBSITE_ID,
    };

    const visitorUA = headers.get("user-agent");
    const visitorIP = headers.get("cf-connecting-ip");
    if (visitorUA) payload.userAgent = visitorUA;

    // Privacy: never forward the visitor's full IP to Umami. Truncate it
    // before sending. This:
    //   - Keeps country-level geo via Umami's GeoLite2 lookup (truncated IPv4
    //     keeps the routing prefix; IPv6 keeps the /48 ISP allocation)
    //   - Keeps Umami's session deduplication working (sessionId derives from
    //     IP+UA+salt; truncated IP still varies per visitor enough to
    //     differentiate sessions for same-browser visitors)
    //   - Removes the last octet (IPv4) / last 5 groups (IPv6) so the
    //     stored "IP" can't be tied back to a specific household
    // This is the same anonymization pattern Matomo, Plausible, and other
    // privacy-focused analytics use as their "anonymize IP" feature.
    const truncatedIP = truncateIP(visitorIP);
    if (truncatedIP) payload.ip = truncatedIP;

    // Decide event shape: pageview, 404 event, or bot event.
    // Umami constraint: `data` requires `name` (no nameless events with data).
    // So if we have UTM data on a 200 pageview, we must promote it to a named
    // event. Use name="campaign" for that case.
    const botName = detectBot(visitorUA);
    const hasUtm = Object.keys(utmData).length > 0;

    if (status === 404) {
      payload.name = "404";
      if (hasUtm) payload.data = utmData;
    } else if (botName) {
      payload.name = "bot";
      payload.data = { bot_name: botName, ...utmData };
    } else if (hasUtm) {
      payload.name = "campaign";
      payload.data = utmData;
    }

    const body = { type: "event", payload };

    // Outgoing request UA: if the visitor is a bot OR has no UA, use a
    // real-looking browser fallback so Umami's isbot filter doesn't drop us.
    // For human visitors, forward their actual UA — Umami needs it for
    // accurate session deduplication (sessionId derives from UA + IP + sourceId).
    // The bot tagging from our own detector is already in payload.name, which
    // Umami stores AFTER the isbot check — so bot events still show up
    // correctly tagged in the Events tab.
    const outgoingUA = (botName || !visitorUA) ? WORKER_UA_FALLBACK : visitorUA;

    await fetch(env.UMAMI_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": outgoingUA,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("umami tracking failed:", err);
  }
}

/**
 * "fr-CA,fr;q=0.9,en;q=0.8" → "fr-CA"
 * @param {string | null} header
 * @returns {string}
 */
function firstLanguage(header) {
  if (!header) return "";
  const first = header.split(",")[0] || "";
  return first.split(";")[0].trim();
}

/**
 * Extract Google UTM campaign parameters from a URLSearchParams instance,
 * returning the standardized `data` object for Umami plus a cleaned search
 * string with those keys removed. Non-UTM params are preserved.
 *
 * Standardized UTM keys per Google:
 *   utm_source, utm_medium, utm_campaign, utm_term, utm_content
 *
 * Returns { cleanedSearch: "" | "?other=...", utmData: { utm_source: ... } }.
 *
 * @param {URLSearchParams} sp  The original query parameters.
 * @returns {{ cleanedSearch: string, utmData: Record<string, string> }}
 */
function extractUtm(sp) {
  const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  const utmData = {};
  // Clone so we don't mutate the original URL's params.
  const cleaned = new URLSearchParams(sp);

  for (const key of UTM_KEYS) {
    const value = cleaned.get(key);
    if (value !== null && value !== "") {
      utmData[key] = value;
    }
    // Always delete — even if empty, we don't want them in the cleaned URL.
    cleaned.delete(key);
  }

  const cleanedSearchString = cleaned.toString();
  return {
    cleanedSearch: cleanedSearchString ? "?" + cleanedSearchString : "",
    utmData,
  };
}

/**
 * Truncate an IP address for privacy. Keeps the network prefix (enough for
 * country-level geolocation) and zeroes out the host portion (so the result
 * cannot be tied back to a specific household).
 *
 * IPv4: keep first 3 octets, zero the last
 *   "203.0.113.42"      → "203.0.113.0"
 *
 * IPv6: keep first 3 groups (the typical /48 ISP allocation), zero the rest
 *   "2001:db8:1234:5678:9abc:def0:1234:5678" → "2001:db8:1234::"
 *
 * Compressed/abbreviated forms (e.g. "::1", "2001:db8::1") are normalized
 * by the URL parser before reaching here, but for safety we accept them.
 *
 * Returns null for empty/missing input. Returns the original string if it
 * doesn't match a known IP shape (we'd rather pass through than corrupt
 * data on an unexpected format).
 *
 * @param {string | null | undefined} ip
 * @returns {string | null}
 */
function truncateIP(ip) {
  if (!ip) return null;

  // IPv4: 4 dot-separated octets
  if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
    const parts = ip.split(".");
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }

  // IPv6: contains ":". Keep first 3 colon-separated groups.
  // Handles full form (8 groups) and "::"-compressed forms.
  if (ip.includes(":")) {
    // Expand "::" into the right number of zero groups so we can take a
    // consistent prefix. For our purpose we only need the first 3 groups,
    // so simple splitting works for both forms.
    const parts = ip.split(":");
    // If "::" was at the start (ip began with ":") or in the middle, parts
    // may contain empty strings. We only need the first 3 non-empty-or-zero
    // groups; pad with "0" if fewer.
    const firstThree = parts.slice(0, 3).map(p => p || "0");
    while (firstThree.length < 3) firstThree.push("0");
    return firstThree.join(":") + "::";
  }

  // Unknown format — return null rather than risk forwarding it.
  return null;
}

