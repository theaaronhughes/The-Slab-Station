# Agent Task Template (copy into chat and fill)

SCOPE & STYLE
- Mobile-first; Tailwind utilities; minimal inline CSS only if unavoidable
- Do not modify payments/checkout or IDs used by JS unless explicitly asked
- No new libraries

FILES TO EDIT ONLY
- index.html
- script.js

ACCEPTANCE CRITERIA
- Mobile 390×844: no horizontal scroll; tap targets ≥44px; readable; no overlaps
- Desktop ≥1024px: stable layout; header/footer unchanged
- A11y: roles/aria preserved; focus states visible
- Perf: no console errors

OUTPUT FORMAT
1) Unified diffs for each changed file (no commentary)
2) DONE REPORT with:
   - Changed files list
   - What was added/removed (IDs/classes/components)
   - Assumptions/trade-offs
   - QA checklist results (mobile + desktop)
