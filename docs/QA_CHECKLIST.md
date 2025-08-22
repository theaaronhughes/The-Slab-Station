# QA Checklist

## Mobile (390×844)
- [ ] No horizontal scroll
- [ ] Tap targets ≥ 44px
- [ ] Headline & body readable
- [ ] No overlaps with system bars (safe-area respected)

## Desktop (≥1024px)
- [ ] Layout stable
- [ ] Header/footer unchanged (unless task specifies)

## Accessibility
- [ ] Roles/aria preserved for tabs/carousels
- [ ] Focus states visible and keyboard accessible

## Performance
- [ ] No console errors
- [ ] Offscreen images lazy; non-critical images `decoding="async"`
- [ ] Media uses `poster`, `muted`, `playsinline` where applicable

## Regression
- [ ] Payment/checkout logic untouched (unless explicitly required)
- [ ] Preserved IDs used by JS
