# The Slab Station — Full Professional Audit Report

**Date:** February 2026  
**Live site:** https://the-slab-station.vercel.app  
**Source:** GitHub main (checkpoint/2025-08-21-stable)

---

## 1. AUDIT SUMMARY — Current Problems & Issues

### 🔴 CRITICAL — Checkout Broken on Vercel

The site is deployed on **Vercel** but uses **Netlify serverless functions**. Vercel does **not** run Netlify functions.

| Endpoint | Used For | Status on Vercel |
|----------|----------|------------------|
| `/.netlify/functions/create-checkout` | Stripe Checkout (Card, Apple Pay) | **404 — BROKEN** |
| `/.netlify/functions/submit-order` | PayPal/PayID order emails | **404 — BROKEN** |
| `/.netlify/functions/stripe-webhook` | Stripe webhook (order confirmation) | **404 — BROKEN** |
| `/.netlify/functions/instagram-feed` | Instagram grid | **404 — BROKEN** |

**Result:** Users cannot complete Stripe checkout. PayPal/PayID emails fail. Webhook never fires. Instagram feed falls back to local images.

---

### 🔴 CRITICAL — Netlify Logic Throughout

| Location | Issue |
|----------|-------|
| `netlify.toml` | Netlify build config — irrelevant on Vercel |
| `netlify/functions/` | 3 Netlify functions — not executable on Vercel |
| `script.js` L184 | `fetch('/.netlify/functions/create-checkout')` |
| `script.js` L316 | `fetch('/.netlify/functions/submit-order')` |
| `script.js` L478 | `fetch('/.netlify/functions/instagram-feed')` |
| `index.html` L505 | `data-netlify="true"` on review form |
| `index.html` L506 | `netlify-honeypot="bot-field"` |
| `script.js` L559 | Review form POSTs to `/` (Netlify form handler) — fails on Vercel |
| `.gitignore` | `.netlify/` — Netlify build cache |

---

### 🟠 HIGH — Security & Configuration

| Issue | Location |
|-------|----------|
| **Hardcoded Stripe publishable key** | `index.html` L533 |
| **Hardcoded PayPal Client ID** | `index.html` L534 |
| **Hardcoded email** | `netlify/functions/submit-order.js` L11: `to = 'theaaronhughes@gmail.com'` |
| **Hardcoded email** | `netlify/functions/stripe-webhook.js` L78: `to: 'theaaronhughes@gmail.com'` |
| **Hardcoded from address** | `stripe-webhook.js` L77: `from: 'orders@slabstation.app'` |

All should use environment variables.

---

### 🟠 HIGH — Missing Vercel Configuration

- **No `vercel.json`** — No rewrites, no API route mapping
- **No `/api` folder** — Vercel API routes don't exist
- Netlify functions are in `netlify/functions/` — Vercel expects `/api/*.js` for serverless

---

### 🟡 MEDIUM — Asset Path Issues

| Referenced Path | Actual File | Risk |
|-----------------|-------------|------|
| `assets/images/backgroundmain.JPG` | `backgroundmain.jpg` | Case mismatch — may 404 on Linux/Vercel |
| `assets/images/black.jpg` | `black.JPG` | Case mismatch |
| `assets/images/white.jpg` | `white.JPG` | Case mismatch |
| `assets/images/whitered.jpg` | `whitered.JPG` | Case mismatch |
| `assets/images/whiteblue.jpg` | `whiteblue.JPG` | Case mismatch |
| `assets/images/IMG_9805.jpg` | `IMG_9805.jpg` | OK |
| `assets/images/IMG_9792.jpg` | `IMG_9792.jpg` | OK |

Vercel runs on Linux — case-sensitive filesystem. Mismatches will cause 404s.

---

### 🟡 MEDIUM — Stripe Checkout Gaps

| Gap | Impact |
|-----|--------|
| No `shipping_address_collection` | Stripe doesn't collect shipping — manual follow-up needed |
| No `phone_number_collection` | No phone for delivery |
| Only `payment_method_types: ['card']` | Apple Pay works automatically; Google Pay, Afterpay not explicitly enabled |
| Metadata missing `custom`, `customNotes` | Webhook email lacks full order details |

---

### 🟡 MEDIUM — Dead Code & Bloat

| Item | Notes |
|------|-------|
| `style.css` | 1700+ lines; references `#demos`, `#colors`, `#testimonials` — IDs don't exist in HTML |
| `style.css` | `#reviews-container`, `#reviews-slider`, `#review-indicators` — different structure in HTML |
| `focus-trap` library | Loaded but not obviously used for modals |
| Stripe.js CDN | Loaded but not used (Checkout redirect flow doesn't need it) |
| `assets/instagram/` | Duplicate images; unclear purpose |
| Raw media in `assets/images/` | `.MOV`, `.HEIC`, `.DNG` — not web-optimised, increase repo size |

---

### 🟡 MEDIUM — Sticky Buy Bar Missing

The current codebase has **no sticky buy bar**. The `.cursorrules` (from a previous migration) specified preserving it, but `checkpoint/2025-08-21-stable` does not include it. If it was removed in a prior refactor, it needs to be re-added per product requirements.

---

### 🟢 LOW — Other Observations

- **Review form:** Uses Netlify form + client-side append. On Vercel, form POST to `/` fails; reviews only appear client-side until refresh.
- **PayPal / PayID:** Still present; adds complexity. Stripe-only simplifies architecture.
- **Instagram feed:** Falls back to local images when function fails — graceful but function never works on Vercel.
- **Video sources:** `howitworks.mp4`, `Mainvideo.mp4` in `assets/videos/` — exist and work.
- **No `env.example`** — No template for required env vars.

---

## 2. PROPOSED CLEAN FOLDER STRUCTURE

```
slab-station-site/
├── api/                    # Vercel serverless (NEW)
│   ├── create-checkout.js
│   ├── stripe-webhook.js
│   ├── submit-order.js     # For PayID/PayPal fallback
│   └── submit-review.js    # Replace Netlify form
├── assets/
│   ├── images/             # Normalise extensions (lowercase .jpg where needed)
│   └── videos/
├── docs/
│   ├── AUDIT_REPORT.md
│   └── DONE_REPORT.md
├── index.html
├── thankyou.html
├── script.js
├── style.css               # Trim dead CSS
├── package.json
├── vercel.json             # NEW
├── env.example             # NEW
├── .gitignore              # Add .env.local
└── (DELETE) netlify/       # Remove entirely
└── (DELETE) netlify.toml   # Remove entirely
```

---

## 3. STEP-BY-STEP MIGRATION PLAN

### Phase 1 — Vercel API Routes

1. Create `/api/create-checkout.js` — Port Netlify logic; add `shipping_address_collection`, `phone_number_collection`, metadata.
2. Create `/api/stripe-webhook.js` — Port Netlify logic; use env vars for email.
3. Create `/api/submit-order.js` — Port for PayID/PayPal; use `ORDER_TO_EMAIL` env var.
4. Create `/api/submit-review.js` — Replace Netlify form; POST to Resend or store.
5. Add `vercel.json` — No rewrites needed if routes are at `/api/*`.

### Phase 2 — Frontend Updates

6. Change `script.js` fetch URLs: `/.netlify/functions/*` → `/api/*`.
7. Remove or replace Netlify form in `index.html`; wire review form to `/api/submit-review`.
8. Remove hardcoded keys; use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` or omit (not needed for Checkout redirect).
9. Remove PayPal/PayID (optional) — or keep if desired; ensure submit-order works.
10. Handle Instagram feed: remove, or create `/api/instagram-feed` with env-based token.

### Phase 3 — Cleanup

11. Delete `netlify/` folder and `netlify.toml`.
12. Update `.gitignore`: add `.env`, `.env.local`.
13. Create `env.example` with all required vars.
14. Fix asset paths: align case (e.g. `black.JPG` → reference as `black.jpg` or rename files).
15. Trim `style.css`: remove rules for non-existent IDs.

### Phase 4 — Sticky Buy Bar (If Required)

16. Add sticky buy bar HTML, CSS, and JS from previous implementation if product spec requires it.

### Phase 5 — Deploy

17. Create branch `modernize-2026`.
18. Commit changes.
19. Push to GitHub.
20. Configure Stripe webhook: `https://the-slab-station.vercel.app/api/stripe-webhook`.
21. Set env vars in Vercel dashboard.
22. Verify preview deployment.

---

## 4. ENVIRONMENT VARIABLES (Vercel)

| Variable | Required | Purpose |
|----------|----------|---------|
| `STRIPE_SECRET_KEY` | Yes | Stripe API |
| `STRIPE_WEBHOOK_SECRET` | Yes | Webhook verification |
| `RESEND_API_KEY` | Yes | Order/review emails |
| `ORDER_TO_EMAIL` | Yes | Recipient for orders |
| `ORDER_FROM_EMAIL` | No | Default: orders@slabstation.app |
| `PAYPAL_CLIENT_ID` | No | Only if keeping PayPal |
| `INSTAGRAM_ACCESS_TOKEN` | No | Only if keeping IG feed API |

---

## 5. FILES TO MODIFY / CREATE / DELETE

| Action | File |
|--------|------|
| CREATE | `api/create-checkout.js` |
| CREATE | `api/stripe-webhook.js` |
| CREATE | `api/submit-order.js` |
| CREATE | `api/submit-review.js` |
| CREATE | `vercel.json` |
| CREATE | `env.example` |
| MODIFY | `script.js` |
| MODIFY | `index.html` |
| MODIFY | `.gitignore` |
| MODIFY | `style.css` (trim) |
| DELETE | `netlify/` |
| DELETE | `netlify.toml` |
