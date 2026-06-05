---
title: "Interaction"
description: "Interaction behavior for navigation, search, toggles, copy buttons, links, and generated surfaces."
type: brand
weight: 70
---

Interactions should be predictable, quick to understand, and visibly reversible when the action is local.

The interaction guidance builds from the [Red Hat links foundation](https://ux.redhat.com/foundations/interactions/links/): links connect users to pages, sections, and resources; buttons perform actions on the current surface. That distinction matters on vanityURLs because generated pages often ask visitors to decide whether to continue, inspect, or report a link.

## Navigation

The documentation uses active sidebar states, mobile navigation, anchor links, previous and next links, and an optional table of contents. Preserve those patterns so users can move through reference content without relearning the site.

## Search

Search is a utility, not a hero feature. Keep the trigger visible, label the modal clearly, and let Pagefind results use the same typographic rhythm as the rest of the site.

## Copy actions

Copy buttons belong on code blocks and generated snippets. They should confirm success briefly without shifting layout.

## Links and buttons

- Links navigate to another page, anchor, or external resource.
- Buttons perform an action on the current surface.
- Use specific link text instead of `click here`.
- Preserve hover and focus-visible states in light and dark themes.
- Underline inline links in prose or provide an equally persistent affordance.
- Use external-link indicators when leaving the current site context, especially to GitHub, Cloudflare, or third-party resources.
- Keep disabled-looking controls non-interactive unless there is a clear explanation nearby.

## Link states

Inline links should communicate four states clearly: default, hover, focus-visible, and visited when the context benefits from it. The state change can be subtle, but it must be perceivable without layout shift.

For documentation links:

- Keep the link text descriptive enough to stand alone in a scan.
- Do not place multiple adjacent links with unclear boundaries.
- Use anchor links for page sections when a reader may need to share an exact reference.

For generated redirect pages:

- Make the destination URL inspectable before a visitor continues.
- Make abuse, privacy, security, and trust links available without competing with the primary redirect action.
- Keep fallback links calm and explicit; a link that bypasses a warning should never look like routine navigation.

## Generated redirect pages

Redirect surfaces should make destination trust and next action obvious. Do not hide a blocked, expired, or fallback state behind brand polish.

## Motion and feedback

Feedback should confirm what changed without demanding attention for routine actions.

- Copy success can use a short text change or toast that does not move nearby controls.
- Search result updates should be announced visually and, where possible, semantically.
- Theme toggles should update icon state immediately.
- Avoid motion that delays a redirect, hides security information, or distracts from a warning.
