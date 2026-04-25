#!/usr/bin/env python3
"""
Generate static/social.png — the Open Graph card for vanityURLs.link.

This is a one-time bake. Run with: python3 scripts/build-og-image.py
Re-run only if the brand identity changes (logo color, tagline, domain).

Output: 1200x630 PNG, the standard size for OG/Twitter/LinkedIn cards.
Stays under 100 KB so social platforms don't downsize aggressively.

Design intent:
  - Dark slate canvas with a subtle 40px grid (echoes the home hero pattern).
  - Centered "vanityURLs" wordmark in Inter ExtraBold at 160px.
  - Brand-teal accent underline below the wordmark, ~33% width.
  - Tagline "Manage short links as code" in Inter Semibold below.
  - Discrete "vanityurls.link" tag in the bottom-right.

Notes:
  - We extract static-weight instances from Inter Variable via fontTools
    because PIL's runtime variable-axis application is unreliable for
    ImageDraw.text() calls.
  - The font is shipped at static/fonts/intervariable.woff2; this script
    decompresses to TTF in /tmp/og-build, then pins weights for rendering.

Dependencies:
  pip install --break-system-packages pillow fonttools brotli
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

# ── Layout constants ──────────────────────────────────────────────
W, H = 1200, 630

# Brand palette — Tailwind teal + slate (matches assets/css)
BG_DARK     = (15, 23, 42)         # slate-900
BRAND_400   = (45, 212, 191)       # teal-400 — accent line + URL footer
TEXT_WHITE  = (255, 255, 255)      # wordmark
TEXT_LIGHT  = (203, 213, 225)      # slate-300 — tagline (high contrast at thumbnail size)
GRID_COLOR  = (255, 255, 255, 14)  # very subtle 1px grid

# Type sizes
WORDMARK_SIZE = 160
TAGLINE_SIZE  = 44
URL_SIZE      = 30

# Spacing
ACCENT_GAP        = 24   # gap from wordmark baseline to accent line
ACCENT_HEIGHT     = 5
ACCENT_WIDTH_FRAC = 1 / 3
TAGLINE_GAP       = 32   # gap from accent to tagline
URL_MARGIN        = 60   # bottom-right margin for footer URL

WORDMARK = "vanityURLs"
TAGLINE  = "Manage short links as code"
URL_TEXT = "vanityurls.link"

# ── Paths ─────────────────────────────────────────────────────────
HERE         = Path(__file__).resolve().parent
ROOT         = HERE.parent
VARIABLE_TTF = ROOT / "static" / "fonts" / "intervariable.woff2"
OUTPUT       = ROOT / "static" / "social.png"
WORK_DIR     = Path("/tmp/og-build")


def prepare_static_fonts():
  """Extract static-weight instances from Inter Variable.

  Returns a dict mapping weight names to font file paths. We pin static
  instances because PIL's set_variation_by_axes does not always propagate
  to ImageDraw.text() — the wordmark renders thin even when the axis is
  set to 700.
  """
  WORK_DIR.mkdir(parents=True, exist_ok=True)

  raw_ttf = WORK_DIR / "intervariable.ttf"
  if not raw_ttf.exists():
    f = TTFont(VARIABLE_TTF)
    f.flavor = None  # decompress woff2 -> ttf
    f.save(raw_ttf)

  weights = {
    "semibold":  (600, 18),
    "extrabold": (800, 32),
  }
  paths = {}
  for name, (wght, opsz) in weights.items():
    out = WORK_DIR / f"inter-{name}.ttf"
    if not out.exists():
      pinned = instantiateVariableFont(
        TTFont(raw_ttf), {"wght": float(wght), "opsz": float(opsz)}, inplace=False
      )
      pinned.save(out)
    paths[name] = str(out)
  return paths


def draw_grid(canvas, step=40):
  """Subtle grid pattern — echoes the home hero's hero-grid-bg class."""
  overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
  od = ImageDraw.Draw(overlay)
  for x in range(0, W + 1, step):
    od.line([(x, 0), (x, H)], fill=GRID_COLOR, width=1)
  for y in range(0, H + 1, step):
    od.line([(0, y), (W, y)], fill=GRID_COLOR, width=1)
  canvas.alpha_composite(overlay)


def draw_wordmark(canvas, fonts):
  """Centered wordmark + accent underline + tagline."""
  od = ImageDraw.Draw(canvas)
  wordmark_font = ImageFont.truetype(fonts["extrabold"], size=WORDMARK_SIZE)
  tagline_font  = ImageFont.truetype(fonts["semibold"], size=TAGLINE_SIZE)

  # Measure the wordmark to compute centered placement.
  bbox = od.textbbox((0, 0), WORDMARK, font=wordmark_font)
  wm_w = bbox[2] - bbox[0]
  wm_h = bbox[3] - bbox[1]
  wm_x = (W - wm_w) // 2 - bbox[0]
  # Vertically: nudge above center to leave room for accent + tagline below.
  wm_y = (H - wm_h) // 2 - bbox[1] - 50
  od.text((wm_x, wm_y), WORDMARK, font=wordmark_font, fill=TEXT_WHITE)

  # Accent underline — brand-teal, ACCENT_WIDTH_FRAC of wordmark width.
  ul_y = wm_y + bbox[3] + ACCENT_GAP
  ul_w = int(wm_w * ACCENT_WIDTH_FRAC)
  od.rectangle(
    [((W - ul_w) // 2, ul_y), ((W + ul_w) // 2, ul_y + ACCENT_HEIGHT)],
    fill=BRAND_400,
  )

  # Tagline — centered, high-contrast slate-300.
  t_bbox = od.textbbox((0, 0), TAGLINE, font=tagline_font)
  t_w    = t_bbox[2] - t_bbox[0]
  t_x    = (W - t_w) // 2 - t_bbox[0]
  t_y    = ul_y + TAGLINE_GAP
  od.text((t_x, t_y), TAGLINE, font=tagline_font, fill=TEXT_LIGHT)


def draw_url_footer(canvas, fonts):
  """Discrete URL marker in the bottom-right."""
  od = ImageDraw.Draw(canvas)
  font = ImageFont.truetype(fonts["semibold"], size=URL_SIZE)
  bbox = od.textbbox((0, 0), URL_TEXT, font=font)
  tw = bbox[2] - bbox[0]
  th = bbox[3] - bbox[1]
  od.text(
    (W - tw - URL_MARGIN, H - URL_MARGIN - th),
    URL_TEXT,
    font=font,
    fill=BRAND_400,
  )


def main():
  fonts = prepare_static_fonts()

  canvas = Image.new("RGBA", (W, H), BG_DARK + (255,))
  draw_grid(canvas, step=40)
  draw_wordmark(canvas, fonts)
  draw_url_footer(canvas, fonts)

  canvas.convert("RGB").save(OUTPUT, "PNG", optimize=True)
  print(f"Wrote {OUTPUT} ({OUTPUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
  main()
