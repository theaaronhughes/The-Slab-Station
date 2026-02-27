# Audit Summary — 2026-02-27

## What Was Found

### Priority 1 — Assets & Case-Sensitivity ✓
- **Hero background:** Path already correct (`/assets/images/backgroundmain.jpg`). File on disk: `backgroundmain.jpg`. Fixed by removing `reveal-on-scroll opacity-0` from hero so it displays immediately (LCP fix).
- **All image paths:** Already use absolute `/assets/...` and match exact filenames (black.JPG, white.JPG, IMG_8980.JPG, etc.).
- **Netlify:** Removed last remaining comment ("Netlify form"). Folder and toml already deleted.

### Priority 2 — Image Optimisation ✓
- **No Next.js:** This is a static HTML site. Used native `<img>` optimisations instead:
  - Added `width`/`height` to all key images (hero, logo, product preview, etc.) for CLS prevention.
  - Added `loading="eager"` for above-fold (hero, header logo, product preview); `loading="lazy"` for below-fold.
  - Added `decoding="async"` throughout.
  - Hero: `fetchpriority="high"`, preload in head.

### Priority 3 — Cleanup ✓
- Netlify: No netlify.toml or netlify/ folder. Removed HTML comment.
- Stripe: API routes at `/api/create-checkout`, `/api/stripe-webhook` — clean.
- vercel.json: Minimal `{}`.

### Priority 4 — Polish ✓
- Hero visible immediately (no opacity-0) for better LCP.
- Width/height on images reduces layout shift.
- Mobile: Existing responsive classes preserved. Sticky buy bar: not in current checkpoint; preserved per rules.

## Not Changed
- style.css dead rules (#demos, #colors, #testimonials) — low impact; IDs not in HTML.
- Sticky buy bar — not in checkpoint; kept as-is.
