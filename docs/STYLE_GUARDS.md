# Style Guardrails (Buy Bar & mobile)

**Namespace components**

- Use `.bb-*` classes for Buy Bar rules. Avoid raw `#id` rules, except the locked selector below.

**Single source of truth**

- Keep all Buy Bar CSS in one clearly marked block in `index.html` (inline `<style>`).
- Do not set `position` on the close button outside the locked selector.

**Media-query discipline**

- Any mobile-only sizing/tweaks live inside `@media (max-width: 767px)`.

**Z-index tokens (documented)**

- Header: 50
- Floating FABs (up/scroll): 40
- Buy Bar wrapper: 70
- Buy Bar close button: 71

**Reduced motion**

- Transitions/animations must respect `@media (prefers-reduced-motion: reduce)`.

**Text vs CTA in a row**

- Put `min-width: 0` on text containers and `white-space: nowrap` on CTAs so wrapping text never pushes pills off.

**Locked selector**

- `#buyBarClose[data-lock="pos"] { position: absolute !important; }` prevents accidental overrides.
