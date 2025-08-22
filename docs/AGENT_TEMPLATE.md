# Cursor Agent — Global Template

**Scope & Style**
- Mobile-first. Tailwind utilities preferred; inline minimal CSS only if unavoidable.
- Do **not** modify payments/checkout or IDs used by JS unless explicitly asked.
- No new libraries.

**Files to edit (default)**
- `index.html`
- `script.js`

**Do not touch**
- `netlify.toml`, `thankyou.html`, `style.css`, `package-lock.json` (unless the task says so).

**Acceptance Criteria (global)**
- Mobile (390×844): no horizontal scroll; tap targets ≥44px; readable type; zero overlaps.
- Desktop (≥1024): stable layout; header/footer unchanged unless task says so.
- A11y: roles/aria preserved; focus states visible.
- Perf: no console errors; unused media removed; no broken links.

**Output format**
1. Unified diffs for each changed file (no commentary).
2. **DONE REPORT**:
   - Changed files list
   - What was added/removed (IDs/classes/components)
   - Assumptions/trade-offs
   - QA checklist results (mobile & desktop)
