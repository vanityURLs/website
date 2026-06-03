---
title: "Setup flowcharts"
description: "Map the npm run setup question groups and happy path."
weight: 30
aside: false
---

`npm run setup` runs interactively. It asks grouped questions, derives defaults from previous answers, then writes only the instance-owned files needed for the chosen options.

Use this page when you want to understand the installer flow before running it, or when you want to improve a question group without guessing how the surrounding prompts behave.

## Happy path

The happy path keeps optional areas disabled during first setup. It creates a plain instance, writes the core files, and runs verification.

{{< mermaid >}}
flowchart TD
A["Run<br/>npm run setup"] --> C["Core instance<br/>questions"]
C --> A0{"Configure<br/>analytics now?"}
A0 -->|"No"| I["Access, languages,<br/>and timezone"]
I --> L{"Configure jurisdiction<br/>and related pages?"}
L -->|"No"| E{"Review public<br/>contact emails?"}
E -->|"Yes"| T["Trust, safety,<br/>and security contacts"]
E -->|"No"| T
T --> B{"Configure<br/>branding now?"}
B -->|"No"| W["Write instance<br/>files"]
W --> V["Run npm run check"]
V --> F["Print next steps"]
{{< /mermaid >}}

## Core instance

Core questions identify the short-link service and prepare values used by later groups.

{{< mermaid >}}
flowchart LR
A["Core instance<br/>questions"] --> D["Short domain"]
D --> W["Worker name"]
W --> O["Owner label"]
O --> S["Seed missing<br/>random slug length<br/>as 3"]
{{< /mermaid >}}

The installer does not ask for random slug length. Existing `links.random_slug_length` values are preserved; missing values are written as `3`.

## Analytics

Analytics starts as a decision, not a required provider choice. `No` stays on the happy path.

{{< mermaid >}}
flowchart TD
A{"Configure<br/>analytics now?"}
A -->|"No"| N["Use disabled<br/>analytics default"]
A -->|"Yes"| P["Analytics provider"]
P --> O["Operator analytics<br/>disclosure"]
O --> R["Operator analytics<br/>retention"]
N --> C["Continue setup"]
R --> C
{{< /mermaid >}}

Use [Analytics](/docs/customize/analytics/) during customization when you are ready to choose providers and retention language.

## Access and localization

These questions support protected operational pages, generated language variants, and scheduled-link timestamps.

{{< mermaid >}}
flowchart LR
A["Cloudflare Access<br/>team domain"] --> L["Supported<br/>languages"]
L --> T["Operator timezone"]
T --> N["Next:<br/>jurisdiction decision"]
{{< /mermaid >}}

The timezone must be an [IANA timezone name](/docs/reference/timezones/), such as `America/Toronto`.

## Jurisdiction and contacts

Legal pages can stay disabled during the first setup. The installer still asks for the operator legal name and public reporting contacts so generated pages have accountable defaults.

{{< mermaid >}}
flowchart TD
A{"Configure jurisdiction<br/>and related pages?"}
A -->|"No"| N["Operator legal<br/>name only"]
A -->|"Yes"| J["Jurisdiction"]
J --> G["Governing law"]
G --> P["Operator and privacy<br/>contacts"]
N --> E{"Review public<br/>contact emails?"}
P --> E
E -->|"Yes"| D["Operator email<br/>domain"]
E -->|"No"| C["Use existing/default<br/>contacts"]
D --> T["Trust & Safety<br/>contact"]
C --> T
T --> R["Response window"]
R --> S["Security contact"]
S --> U["Last updated date"]
{{< /mermaid >}}

Use [Jurisdiction](/docs/customize/jurisdiction/) when you are ready to enable and tune the public legal pages.

## Branding

Branding can stay disabled during first setup. If you configure it, text-logo colors are independent from copying full public pages into `custom/public`.

{{< mermaid >}}
flowchart TD
A{"Configure<br/>branding now?"}
A -->|"No"| D["Use defaults<br/>from defaults/public"]
A -->|"Yes"| S{"Add slogan<br/>line?"}
S -->|"Yes"| L["Brand slogan<br/>per language"]
S -->|"No"| N["No slogan"]
L --> W["Text logo<br/>first-color portion"]
N --> W
W --> G["Text logo<br/>accent-color portion"]
G --> P{"Advanced:<br/>copy all default pages<br/>to custom/public?"}
P -->|"No"| D
P -->|"Yes"| C["Copy defaults/public<br/>for manual HTML editing"]
{{< /mermaid >}}

Choose the advanced copy only when you intend to edit public HTML pages manually.

## Write and verify

The last group writes the instance-owned files and verifies the result.

{{< mermaid >}}
flowchart TD
A["Resolved setup<br/>answers"] --> L["custom/v8s-links.txt<br/>created if missing"]
L --> C["custom/v8s-site-config.json<br/>updated"]
C --> W["wrangler.toml<br/>updated"]
W --> V{"Verification<br/>enabled?"}
V -->|"Yes"| R["Run npm run check"]
V -->|"No or dry-run"| N["Print next steps"]
R --> N
{{< /mermaid >}}
