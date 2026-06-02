---
title: "Random slugs still have human readers"
date: 2026-05-26
description: "How vanityURLs balances short random slugs, readability, and tag-specific defaults."
tags: ["links", "operations", "configuration"]
featured: false
---

Random slugs are for the moments when the keyword does not matter.

You paste a long URL. `lnk` chooses the slug. You keep moving. The catch is that a random slug may still be read from a slide, typed from a badge, dictated over a call, pasted into a ticket, or compared in a screenshot.

In vanityURLs 3.x, random slug generation is configurable. Existing instances can get it by following the [upgrade workflow](/docs/reference/upgrading/), including `npm run upgrade`.

The default optimizes for the human in that loop.

## Use A Readable Alphabet

The default alphabet is:

```text
34789abcdefghjkmnpqrstvwxy
```

It avoids characters that are easy to confuse in common fonts or spoken instructions. There is no `0`, `1`, `2`, `5`, `6`, `i`, `l`, or `o`. It also stays lowercase so `abc` and `ABC` cannot become two different links by accident.

Mixed-case alphabets create more combinations in fewer characters. That can be useful at high volume, but URL paths are case-sensitive in practice and handled as path data under [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986). A mixed-case slug is harder to dictate and easier to mistype.

The tradeoff is density. A readable alphabet needs more characters than a dense alphabet for the same collision space. vanityURLs chooses readability by default and leaves density configurable.

## Keep The Choice In Git

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

Override it for one command when the link needs more room:

```bash
./scripts/lnk https://github.com/houba/styleGuide --random-slug-length 5
```

Or let a tag choose the length:

```bash
./scripts/lnk https://github.com/vanityURLs/code/issues/4 --tags debug
```

## Let Purpose Set Length

Tag-specific lengths let the link purpose choose the slug shape.

`training` links may live longer and be read by real people, so 4 characters is reasonable. `debug` links are short-lived and local to an investigation, so 2 characters can be acceptable.

Configure those defaults with:

```bash
./scripts/lnk tag set training --random-slug-length 4
./scripts/lnk tag set debug --random-slug-length 2
```

When a link has multiple tags with configured lengths, `lnk` uses the shortest matching tag length. The most restrictive tag wins. If one link needs different behavior, the explicit command-line value wins.

The goal is not one universal alphabet. The goal is a visible decision: short enough to use, readable enough to survive humans, and stored where reviewers can see it.
