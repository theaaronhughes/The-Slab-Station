# Asset Audit — 2026-02-27

## Summary

All image and video paths updated to use absolute paths (`/assets/...`) for reliable loading on Vercel (Linux, case-sensitive). Hero image optimized for LCP.

## Image References (Verified Against git ls-files)

| Reference | Actual File | Status |
|-----------|-------------|--------|
| /assets/images/backgroundmain.jpg | backgroundmain.jpg | ✓ |
| /assets/images/logo.jpg | logo.jpg | ✓ |
| /assets/images/spinnobackground2.gif | spinnobackground2.gif | ✓ |
| /assets/images/IMG_8980.JPG | IMG_8980.JPG | ✓ |
| /assets/images/black.JPG | black.JPG | ✓ |
| /assets/images/white.JPG | white.JPG | ✓ |
| /assets/images/whitered.JPG | whitered.JPG | ✓ |
| /assets/images/whiteblue.JPG | whiteblue.JPG | ✓ |
| /assets/images/orangegreyorange.JPG | orangegreyorange.JPG | ✓ |
| /assets/images/yellowwhiteyellow.JPG | yellowwhiteyellow.JPG | ✓ |
| /assets/images/IMG_9805.jpg | IMG_9805.jpg | ✓ |
| /assets/images/IMG_9792.jpg | IMG_9792.jpg | ✓ |
| /assets/images/IMG_9002.JPG | IMG_9002.JPG | ✓ |
| /assets/images/orange.JPG | orange.JPG | ✓ |
| /assets/images/YBY.JPG | YBY.JPG | ✓ |
| /assets/images/RWR.JPG | RWR.JPG | ✓ |
| /assets/images/instagram-icon.png | instagram-icon.png | ✓ |

## Video References

| Reference | Actual File | Status |
|-----------|-------------|--------|
| /assets/videos/howitworks.mp4 | howitworks.mp4 | ✓ |
| /assets/videos/Mainvideo.mp4 | Mainvideo.mp4 | ✓ |

## Changes Made

1. **Absolute paths** — All `assets/...` → `/assets/...` in index.html, thankyou.html, script.js
2. **Hero image** — Added `fetchpriority="high"`, `loading="eager"`, `decoding="async"`, `object-center`; added `<link rel="preload">` in head
3. **Case** — All paths match exact filenames (e.g. black.JPG, not black.jpg)

## Not Next.js

This is a static HTML site. No next/image; standard `<img>` with optimisations applied.
