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
  "Mozilla/5.0 (compatible; vanityURLs-edge-tracker/1.0; +https://vanityurls.link/)";

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
async function trackPageview(request, env, status) {
  if (!env.UMAMI_WEBSITE_ID || !env.UMAMI_ENDPOINT) {
    // Secrets missing — silently skip. Makes `wrangler dev` quiet too.
    return;
  }

  try {
    const url = new URL(request.url);
    const headers = request.headers;

    // Umami /api/send payload shape — ref: https://docs.umami.is/docs/api/sending-stats
    // Fields we can't derive server-side (screen, title) are omitted; Umami
    // accepts partial data. We override Umami's server-side detection of
    // UA/IP because the request is hitting Umami from Cloudflare's edge,
    // not from the real visitor.
    const payload = {
      hostname: url.hostname,
      language: firstLanguage(headers.get("accept-language")),
      referrer: headers.get("referer") || "",
      url: url.pathname + url.search,
      website: env.UMAMI_WEBSITE_ID,
    };

    const visitorUA = headers.get("user-agent");
    const visitorIP = headers.get("cf-connecting-ip");
    if (visitorUA) payload.userAgent = visitorUA;
    if (visitorIP) payload.ip = visitorIP;

    const body = {
      type: "event",
      // Mark 404s as a distinct event name so they can be filtered out of
      // pageview charts in the Umami UI. Omit `name` for 200s.
      payload: status === 404 ? { ...payload, name: "404" } : payload,
    };

    await fetch(env.UMAMI_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // Required by Umami — requests without a UA are dropped.
        "user-agent": visitorUA || WORKER_UA_FALLBACK,
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
