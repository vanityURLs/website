---
aside: false
title: "Cheatsheet"
description: "A compact operator reference for running, customizing, and troubleshooting a vanityURLs instance."
weight: 15
aliases:
  - /docs/cheatsheet/
---

Use this cheatsheet when you already know the product and need the shortest path to the next correct action. It is designed to work on screen and as a browser-generated PDF.

<div class="cheatsheet-grid">
  <section class="cheatsheet-card">
    <h2>Daily workflow</h2>
    <table>
      <thead>
        <tr>
          <th>Need</th>
          <th>Action / file</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Install deps</td>
          <td><code>npm install</code></td>
          <td>Run once after checkout or dependency changes.</td>
        </tr>
        <tr>
          <td>Start locally</td>
          <td><code>npm run dev</code></td>
          <td>Runs the Worker through Wrangler for local testing.</td>
        </tr>
        <tr>
          <td>Validate</td>
          <td><code>npm run check</code></td>
          <td>Builds and checks generated runtime artifacts before deploy.</td>
        </tr>
        <tr>
          <td>Deploy</td>
          <td><code>git push</code></td>
          <td>GitHub and Cloudflare automation publish the Worker.</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Repositories</h2>
    <table>
      <thead>
        <tr>
          <th>Surface</th>
          <th>Repository</th>
          <th>Deploys to</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Redirector</td>
          <td><code>vanityURLs/code</code></td>
          <td><code>https://VanityURLs.link</code></td>
        </tr>
        <tr>
          <td>Documentation</td>
          <td><code>vanityURLs/website</code></td>
          <td><code>https://www.VanityURLs.link</code></td>
        </tr>
        <tr>
          <td>Generated output</td>
          <td><code>build/</code>, <code>src/</code></td>
          <td>Do not edit directly.</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Core files</h2>
    <table>
      <thead>
        <tr>
          <th>File</th>
          <th>Use</th>
          <th>Owner</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>custom/v8s-links.txt</code></td>
          <td>Human-authored redirect list.</td>
          <td>Instance</td>
        </tr>
        <tr>
          <td><code>custom/v8s-site-config.json</code></td>
          <td>Branding, contacts, languages, timezone.</td>
          <td>Instance</td>
        </tr>
        <tr>
          <td><code>custom/v8s-policies.json</code></td>
          <td>Allow domains, blocked domains, keyword policy.</td>
          <td>Instance</td>
        </tr>
        <tr>
          <td><code>defaults/</code></td>
          <td>Product baseline used by build unless an explicit custom source replaces it.</td>
          <td>Product</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Link row format</h2>
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Example</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Slug</td>
          <td><code>docs</code></td>
          <td>Public path segment. Keep it readable and durable.</td>
        </tr>
        <tr>
          <td>Target</td>
          <td><code>https://example.com/docs</code></td>
          <td>Destination URL after policy checks.</td>
        </tr>
        <tr>
          <td>State</td>
          <td><code>active</code></td>
          <td>Controls whether the redirect should resolve.</td>
        </tr>
        <tr>
          <td>Metadata</td>
          <td><code>title</code>, <code>owner</code>, <code>notes</code></td>
          <td>Helps review, audit, dashboard display, and handoff.</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Schedules</h2>
    <table>
      <thead>
        <tr>
          <th>Need</th>
          <th>Syntax</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Timed target</td>
          <td><code>@schedule</code></td>
          <td>Indent schedule blocks below the link row.</td>
        </tr>
        <tr>
          <td>Timezone</td>
          <td><code>America/Toronto</code></td>
          <td>Use IANA timezone names accepted by the runtime.</td>
        </tr>
        <tr>
          <td>Exact links</td>
          <td><code>/launch</code></td>
          <td>Schedules apply to exact links, not splat namespaces.</td>
        </tr>
        <tr>
          <td>Fallback</td>
          <td>Link row target</td>
          <td>The normal target remains the default outside windows.</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Redirect behavior</h2>
    <table>
      <thead>
        <tr>
          <th>Input</th>
          <th>Behavior</th>
          <th>Check</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Known active slug</td>
          <td>Redirects to target.</td>
          <td>Confirm target and policy allow it.</td>
        </tr>
        <tr>
          <td>Inactive or expired slug</td>
          <td>Shows the matching status page.</td>
          <td>Review state, dates, and generated registry.</td>
        </tr>
        <tr>
          <td>Blocked destination</td>
          <td>Does not redirect.</td>
          <td>Check policy source and generated blocklist.</td>
        </tr>
        <tr>
          <td>Unknown path</td>
          <td>Returns not-found handling.</td>
          <td>Check slug spelling and generated routes.</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Customize safely</h2>
    <table>
      <thead>
        <tr>
          <th>Goal</th>
          <th>Use</th>
          <th>Avoid</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Change links</td>
          <td><code>custom/v8s-links.txt</code></td>
          <td>Editing <code>build/v8s.json</code>.</td>
        </tr>
        <tr>
          <td>Brand pages</td>
          <td><code>custom/v8s-site-config.json</code></td>
          <td>Copying full templates unless needed.</td>
        </tr>
        <tr>
          <td>Override assets</td>
          <td><code>custom/public/</code></td>
          <td>Changing product defaults for one instance.</td>
        </tr>
        <tr>
          <td>Change Worker code</td>
          <td><code>scripts/workers/</code></td>
          <td>Editing generated <code>src/</code>.</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Troubleshooting</h2>
    <table>
      <thead>
        <tr>
          <th>Symptom</th>
          <th>Check</th>
          <th>Likely fix</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Works locally, not live</td>
          <td>GitHub action and Worker deploy status.</td>
          <td>Push, wait for deploy, then retest.</td>
        </tr>
        <tr>
          <td>Link missing</td>
          <td>Generated <code>build/v8s.json</code>.</td>
          <td>Fix source row, then rebuild.</td>
        </tr>
        <tr>
          <td>Wrong language page</td>
          <td>Configured languages and localized overrides.</td>
          <td>Add localized page or rely on fallback.</td>
        </tr>
        <tr>
          <td>Schedule surprises</td>
          <td>Operator timezone and date window.</td>
          <td>Use explicit IANA timezone names.</td>
        </tr>
      </tbody>
    </table>
  </section>
</div>

## Quick comparisons

<table class="cheatsheet-compare">
  <thead>
    <tr>
      <th>Choice</th>
      <th>Use this when</th>
      <th>Remember</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>defaults/</code></td>
      <td>You are changing the product baseline for every instance.</td>
      <td>Review as product behavior.</td>
    </tr>
    <tr>
      <td><code>custom/</code></td>
      <td>You are changing one deployed instance.</td>
      <td>Best place for operator-owned changes.</td>
    </tr>
    <tr>
      <td>Exact slug</td>
      <td>The public path must resolve to one known destination.</td>
      <td>Supports schedule behavior.</td>
    </tr>
    <tr>
      <td>Splat namespace</td>
      <td>A stable prefix should forward nested paths.</td>
      <td>Do not use for time-sensitive redirects.</td>
    </tr>
  </tbody>
</table>
