/**
 * Smoke test for src/worker.js — runs under Node, no Cloudflare dependency.
 *
 * Run with: node src/worker.test.js
 *
 * Covers:
 *   - Non-GET/HEAD methods pass through without tracking
 *   - Asset extensions bypass tracking
 *   - HTML 200 responses fire an Umami event
 *   - HTML 404 responses fire an Umami event with name="404"
 *   - Missing secrets silently skip (no tracking call)
 *   - Payload fields match the Umami API contract
 */

import worker from "./worker.mjs";

let umamiCalls = [];
const origFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  umamiCalls.push({ url, init, body: JSON.parse(init.body) });
  return new Response("ok", { status: 200 });
};

function mockAssets(body, status = 200, contentType = "text/html; charset=utf-8") {
  return {
    fetch: async () => new Response(body, { status, headers: { "content-type": contentType } }),
  };
}

function mockCtx() {
  const deferred = [];
  return {
    waitUntil: (p) => deferred.push(p),
    _flush: () => Promise.all(deferred),
  };
}

function mkRequest(path = "/en/docs/", opts = {}) {
  const url = new URL(path, "https://vanityurls.link");
  return new Request(url, {
    method: opts.method || "GET",
    headers: {
      "accept-language": "fr-CA,fr;q=0.9,en;q=0.8",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/605.1.15",
      "cf-connecting-ip": "203.0.113.42",
      ...(opts.headers || {}),
    },
  });
}

const fullEnv = {
  ASSETS: mockAssets("<html>...</html>"),
  UMAMI_WEBSITE_ID: "deadbeef-1111-2222-3333-444455556666",
  UMAMI_ENDPOINT: "https://cloud.umami.is/api/send",
};

async function run(name, fn) {
  umamiCalls = [];
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    console.error(`✗ ${name}`);
    console.error(e);
    process.exit(1);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(`assertion failed: ${msg}`);
}

await run("GET HTML 200 fires Umami event", async () => {
  const ctx = mockCtx();
  const res = await worker.fetch(mkRequest(), fullEnv, ctx);
  await ctx._flush();
  assert(res.status === 200, "response status");
  assert(umamiCalls.length === 1, `expected 1 umami call, got ${umamiCalls.length}`);
  const call = umamiCalls[0];
  assert(call.url === "https://cloud.umami.is/api/send", "endpoint");
  assert(call.body.type === "event", "type");
  assert(call.body.payload.website === fullEnv.UMAMI_WEBSITE_ID, "website");
  assert(call.body.payload.url === "/en/docs/", "url");
  assert(call.body.payload.hostname === "vanityurls.link", "hostname");
  assert(call.body.payload.language === "fr-CA", "language");
  assert(call.body.payload.userAgent.startsWith("Mozilla/5.0"), "userAgent override");
  assert(call.body.payload.ip === "203.0.113.42", "ip override");
  assert(!("name" in call.body.payload), "no name on 200");
});

await run("GET HTML 404 fires event with name='404'", async () => {
  const env = { ...fullEnv, ASSETS: mockAssets("<html>not found</html>", 404) };
  const ctx = mockCtx();
  await worker.fetch(mkRequest("/typo/"), env, ctx);
  await ctx._flush();
  assert(umamiCalls.length === 1, "count");
  assert(umamiCalls[0].body.payload.name === "404", "name='404'");
});

await run("Non-HTML response skips tracking", async () => {
  const env = { ...fullEnv, ASSETS: mockAssets("{}", 200, "application/json") };
  const ctx = mockCtx();
  await worker.fetch(mkRequest("/en/docs/"), env, ctx);
  await ctx._flush();
  assert(umamiCalls.length === 0, "no tracking for JSON");
});

await run("Asset extension bypasses tracking", async () => {
  const ctx = mockCtx();
  await worker.fetch(mkRequest("/css/main.abc123.css"), fullEnv, ctx);
  await ctx._flush();
  assert(umamiCalls.length === 0, "no tracking for .css");
});

await run("POST method bypasses tracking", async () => {
  const ctx = mockCtx();
  await worker.fetch(mkRequest("/en/docs/", { method: "POST" }), fullEnv, ctx);
  await ctx._flush();
  assert(umamiCalls.length === 0, "no tracking for POST");
});

await run("HEAD method bypasses tracking (even for HTML)", async () => {
  const ctx = mockCtx();
  await worker.fetch(mkRequest("/en/docs/", { method: "HEAD" }), fullEnv, ctx);
  await ctx._flush();
  assert(umamiCalls.length === 0, "no tracking for HEAD");
});

await run("Missing UMAMI_WEBSITE_ID skips silently", async () => {
  const env = { ASSETS: fullEnv.ASSETS, UMAMI_ENDPOINT: fullEnv.UMAMI_ENDPOINT };
  const ctx = mockCtx();
  await worker.fetch(mkRequest(), env, ctx);
  await ctx._flush();
  assert(umamiCalls.length === 0, "no tracking without secret");
});

await run("Missing UMAMI_ENDPOINT skips silently", async () => {
  const env = { ASSETS: fullEnv.ASSETS, UMAMI_WEBSITE_ID: fullEnv.UMAMI_WEBSITE_ID };
  const ctx = mockCtx();
  await worker.fetch(mkRequest(), env, ctx);
  await ctx._flush();
  assert(umamiCalls.length === 0, "no tracking without secret");
});

await run("Outbound fetch includes User-Agent header (required by Umami)", async () => {
  const ctx = mockCtx();
  await worker.fetch(mkRequest(), fullEnv, ctx);
  await ctx._flush();
  assert(umamiCalls.length === 1, "tracking fired");
  const headers = umamiCalls[0].init.headers;
  assert(headers["user-agent"], "UA header present");
});

await run("Missing Referer renders as empty string, not undefined", async () => {
  const ctx = mockCtx();
  const req = new Request(new URL("/en/", "https://vanityurls.link"), {
    headers: { "user-agent": "test" },
  });
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  assert(umamiCalls[0].body.payload.referrer === "", "empty referrer");
});

await run("Googlebot UA → name='bot' with bot_name", async () => {
  const ctx = mockCtx();
  const req = mkRequest("/en/docs/", {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    },
  });
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  assert(umamiCalls.length === 1, "tracking fired");
  const p = umamiCalls[0].body.payload;
  assert(p.name === "bot", `name should be 'bot', got '${p.name}'`);
  assert(p.data && p.data.bot_name === "Googlebot",
    `bot_name should be 'Googlebot', got '${p.data && p.data.bot_name}'`);
});

await run("Bingbot UA → name='bot' with bot_name=Bingbot", async () => {
  const ctx = mockCtx();
  const req = mkRequest("/en/", {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    },
  });
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  assert(umamiCalls[0].body.payload.data.bot_name === "Bingbot");
});

await run("ClaudeBot UA → name='bot' with bot_name=ClaudeBot", async () => {
  const ctx = mockCtx();
  const req = mkRequest("/en/", {
    headers: { "user-agent": "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)" },
  });
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  assert(umamiCalls[0].body.payload.data.bot_name === "ClaudeBot");
});

await run("Slackbot UA → name='bot' with bot_name=Slackbot", async () => {
  const ctx = mockCtx();
  const req = mkRequest("/en/", {
    headers: { "user-agent": "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)" },
  });
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  assert(umamiCalls[0].body.payload.data.bot_name === "Slackbot");
});

await run("Real browser UA → no bot tagging (regular pageview)", async () => {
  const ctx = mockCtx();
  // Standard Firefox UA
  const req = mkRequest("/en/", {
    headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 13.6; rv:124.0) Gecko/20100101 Firefox/124.0" },
  });
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  const p = umamiCalls[0].body.payload;
  assert(!p.name, `should be a pageview (no name), got name='${p.name}'`);
  assert(!p.data, `should have no data`);
});

await run("Bot + 404 → name='404' wins (404 takes priority)", async () => {
  // This is a deliberate design choice — 404 events are about the URL
  // (a missing page), not about who requested it. Easier to filter
  // 404s separately than to debug overlapping name semantics.
  const env = { ...fullEnv, ASSETS: mockAssets("<html>nope</html>", 404) };
  const ctx = mockCtx();
  const req = mkRequest("/typo/", {
    headers: { "user-agent": "Googlebot/2.1" },
  });
  await worker.fetch(req, env, ctx);
  await ctx._flush();
  assert(umamiCalls[0].body.payload.name === "404",
    "404 status should take priority over bot tag");
});

await run("Generic 'bot' substring catches unknown crawlers", async () => {
  const ctx = mockCtx();
  const req = mkRequest("/en/", {
    headers: { "user-agent": "SomeUnknownBot/1.0 (+http://example.com)" },
  });
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  const p = umamiCalls[0].body.payload;
  assert(p.name === "bot", "should detect via generic /bot/ pattern");
  assert(p.data.bot_name === "Other", `should be tagged 'Other', got '${p.data.bot_name}'`);
});

await run("curl UA → name='bot' with bot_name=CLI", async () => {
  const ctx = mockCtx();
  const req = mkRequest("/en/", {
    headers: { "user-agent": "curl/8.4.0" },
  });
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  assert(umamiCalls[0].body.payload.data.bot_name === "CLI");
});

await run("UTM params strip from url and populate data on a 200 pageview", async () => {
  const ctx = mockCtx();
  const req = mkRequest("/en/?utm_source=newsletter&utm_medium=email&utm_campaign=launch");
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  const p = umamiCalls[0].body.payload;
  // URL no longer carries utm_*
  assert(p.url === "/en/", `url should be stripped to /en/, got '${p.url}'`);
  // Promoted to a campaign event
  assert(p.name === "campaign", `expected name='campaign', got '${p.name}'`);
  assert(p.data.utm_source === "newsletter", "utm_source captured");
  assert(p.data.utm_medium === "email", "utm_medium captured");
  assert(p.data.utm_campaign === "launch", "utm_campaign captured");
});

await run("UTM stripping preserves non-UTM query params", async () => {
  const ctx = mockCtx();
  // Mix UTMs with an arbitrary tracking param the site might use.
  const req = mkRequest("/en/?utm_source=hn&ref=upvote&utm_campaign=launch&page=2");
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  const p = umamiCalls[0].body.payload;
  // Non-UTM params survive
  assert(p.url.includes("ref=upvote"), `non-UTM 'ref' should remain, got '${p.url}'`);
  assert(p.url.includes("page=2"), `non-UTM 'page' should remain, got '${p.url}'`);
  // UTMs gone from url
  assert(!p.url.includes("utm_"), `no utm_* should remain in url, got '${p.url}'`);
  // UTMs in data
  assert(p.data.utm_source === "hn", "utm_source captured");
  assert(p.data.utm_campaign === "launch", "utm_campaign captured");
  // Non-UTM is NOT in data — only UTM keys go to data
  assert(!("ref" in p.data), "non-UTM 'ref' should not be in data");
});

await run("UTM + bot UA: data merges utm_* with bot_name", async () => {
  const ctx = mockCtx();
  const req = mkRequest("/en/?utm_source=newsletter", {
    headers: { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" },
  });
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  const p = umamiCalls[0].body.payload;
  // Bot still wins as the event name, but UTM data is merged in
  assert(p.name === "bot", `expected name='bot', got '${p.name}'`);
  assert(p.data.bot_name === "Googlebot", "bot_name preserved");
  assert(p.data.utm_source === "newsletter", "utm_source merged in");
});

await run("UTM + 404: name='404' wins, utm_* still captured", async () => {
  const env = { ...fullEnv, ASSETS: mockAssets("<html>nope</html>", 404) };
  const ctx = mockCtx();
  const req = mkRequest("/missing/?utm_source=newsletter&utm_campaign=launch");
  await worker.fetch(req, env, ctx);
  await ctx._flush();
  const p = umamiCalls[0].body.payload;
  assert(p.name === "404", "404 wins as event name");
  assert(p.data.utm_source === "newsletter", "utm_source captured even on 404");
  assert(p.url === "/missing/", "url stripped");
});

await run("Empty utm_* values are not captured", async () => {
  // ?utm_source=&utm_campaign=foo — empty utm_source should be ignored
  const ctx = mockCtx();
  const req = mkRequest("/en/?utm_source=&utm_campaign=launch");
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  const p = umamiCalls[0].body.payload;
  assert(!("utm_source" in (p.data || {})),
    `empty utm_source should not be captured, got data=${JSON.stringify(p.data)}`);
  assert(p.data.utm_campaign === "launch", "non-empty utm_campaign captured");
});

await run("URL with no query params: no campaign event, plain pageview", async () => {
  const ctx = mockCtx();
  const req = mkRequest("/en/docs/getting-started/");
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  const p = umamiCalls[0].body.payload;
  assert(!p.name, `should be a pageview (no name), got name='${p.name}'`);
  assert(!p.data, "no data should be set");
  assert(p.url === "/en/docs/getting-started/", "url unchanged");
});

await run("URL with only non-UTM query params: stays a pageview", async () => {
  const ctx = mockCtx();
  const req = mkRequest("/en/blog/?ref=hn&page=2");
  await worker.fetch(req, fullEnv, ctx);
  await ctx._flush();
  const p = umamiCalls[0].body.payload;
  assert(!p.name, "should remain a pageview");
  assert(p.url === "/en/blog/?ref=hn&page=2", `url unchanged, got '${p.url}'`);
});

globalThis.fetch = origFetch;
console.log("\nAll worker tests passed.");
