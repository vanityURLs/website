---
title: "Choosing readable random slugs"
date: 2026-05-26
description: "How vanityURLs balances short random slugs, readability, and tag-specific defaults."
tags: ["links", "operations", "configuration"]
featured: false
---

Random slugs are convenient when the exact keyword does not matter. You paste a long URL, let `lnk` pick the slug, and keep moving. The trick is that a random slug is still a thing a human may need to read, type, say out loud, paste into a ticket, or compare in a screenshot.

That is why vanityURLs uses a readable alphabet instead of the full set of possible URL-safe characters.

## Readability beats theoretical compactness

The default alphabet is:

```text
34789abcdefghjkmnpqrstvwxy
```

It intentionally avoids characters that are easy to confuse in common fonts or spoken instructions. There is no `0`, `1`, `2`, `5`, `6`, `i`, `l`, or `o`. It also stays lowercase so `abc` and `ABC` cannot become two different links by accident.

Mixed-case alphabets create more combinations in fewer characters. That can be useful at scale, but URL paths are case-sensitive. A mixed-case slug is harder to dictate, easier to mistype, and less forgiving when someone copies it from a printed badge or slide.

## Keep the alphabet configurable

The alphabet belongs in configuration because different teams have different tolerance for compactness, entropy, and human typing. The product default should be boring and readable, while an individual instance can still choose something denser.

The relevant `custom/v8s-site-config.json` section is:

```json
{
  "links": {
    "random_slug_length": 3,
    "random_slug_alphabet": "34789abcdefghjkmnpqrstvwxy",
    "tag_random_slug_lengths": {
      "training": 4,
      "debug": 2
    }
  }
}
```

The global `random_slug_length` is what `lnk` uses when you omit the slug:

```bash
./scripts/lnk https://github.com/houba/styleGuide
```

You can override it for one command:

```bash
./scripts/lnk https://github.com/houba/styleGuide --random-slug-length 5
```

## Use tags when intent changes the slug shape

Tag-specific lengths let the link purpose decide how much room the random slug should have.

In the example above, `training` links get 4 characters because they may be shared with real people and live a little longer. `debug` links get 2 characters because they are intentionally short-lived and usually local to an investigation.

Configure those defaults with:

```bash
./scripts/lnk tag set training --random-slug-length 4
./scripts/lnk tag set debug --random-slug-length 2
```

When a link has multiple tags with configured lengths, `lnk` uses the shortest matching tag length. That keeps the most restrictive tag in control. If you need a different length for one link, the explicit command-line value wins.

The important thing is not that every instance uses the same alphabet or lengths. The important thing is that the defaults are deliberate, visible in Git, and easy to explain later.
