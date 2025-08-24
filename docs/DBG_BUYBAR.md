# DBG — Buy Bar Snapshot

- Commit: unknown
- URL param support: debugBuyBar / buybar (present in controller)
- Notes: z-index hardened in CSS; close flag normalized to '1'; controller removes `hidden` and `pointer-events-none` when not closed.

## index.html — #buyBar (full)

```html
<div
  id="buyBar"
  class="fixed bottom-0 inset-x-0 z-40 md:hidden translate-y-full transition-transform duration-300"
>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mb-[env(safe-area-inset-bottom)]"></div>
    <div
      class="pointer-events-auto mx-auto w-[92vw] max-w-[720px] overflow-hidden rounded-3xl bg-white text-black ring-1 ring-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-3 md:p-4 grid grid-cols-[1fr_auto] items-center gap-3 md:gap-4 bb-card"
    >
      <div class="contents">
        <div class="min-w-0">
          <div
            class="bb-brand !text-[11px] md:!text-xs uppercase tracking-[0.18em] font-semibold text-black/60"
          >
            THE SLAB STATION
          </div>
          <div
            data-buybar-price
            class="!text-[clamp(18px,4.5vw,20px)] leading-tight font-bold text-black break-words"
          >
            <span class="whitespace-nowrap">From A$119.95 + shipping</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <a
            href="#builder"
            aria-label="Buy now"
            class="justify-self-end whitespace-nowrap shrink-0 inline-flex items-center justify-center px-5 md:px-6 py-2 md:py-2.5 rounded-full bg-black text-white text-[15px] font-semibold shadow-[0_6px_16px_rgba(0,0,0,0.35)] [touch-action:manipulation] bb-cta"
            style="touch-action: manipulation"
          >
            BUY NOW
          </a>
          <button
            id="buyBarClose"
            type="button"
            aria-label="Close"
            class="ml-1 justify-self-end shrink-0 inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/5 ring-1 ring-black/10 text-black/70 hover:bg-black/10"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
    <div class="pb-[calc(env(safe-area-inset-bottom)+8px)]"></div>
  </div>
</div>
```

## script.js — Buy Bar IIFE (full)

```js
(function () {
  const bar = document.getElementById("buyBar");
  const hero = document.querySelector("section.hero");
  const builder = document.getElementById("builder");
  if (!bar || !hero) return;

  // --- Debug + close-flag normalization ---
  const params = new URLSearchParams(location.search);
  const forceShow = params.has("debugBuyBar") || params.get("buybar") === "show";

  let isClosed = false;
  try {
    // normalize to '1' for the close flag
    const f = sessionStorage.getItem("buyBarClosed");
    isClosed = f === "1" || f === "true";
    if (forceShow) {
      sessionStorage.removeItem("buyBarClosed");
      isClosed = false;
    }
  } catch (_) {}

  // If it's hard-closed and not forcing, keep hidden; otherwise ensure the element isn't 'display:none'
  if (!isClosed) {
    bar.classList.remove("hidden");
    bar.classList.remove("pointer-events-none");
  }

  let show = false;
  function set(showing) {
    bar.style.transform = showing ? "translateY(0)" : "translateY(100%)";
  }

  const closeBtn = document.getElementById("buyBarClose");
  const closed = sessionStorage.getItem("buyBarClosed") === "1";
  if (closed) {
    set(false);
    return;
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      try {
        sessionStorage.setItem("buyBarClosed", "1");
      } catch (_) {}
      set(false);
    });
  }

  // --- Sync hero scroll-cue visibility with Buy Bar state ---
  const scrollCueEl = document.getElementById("scrollCue");
  const setCueVisible = (visible) => {
    if (!scrollCueEl) return;
    // Hide completely to avoid taking space; fade when we can
    scrollCueEl.classList.toggle("hidden", !visible);
    scrollCueEl.classList.toggle("opacity-0", !visible);
    scrollCueEl.classList.toggle("pointer-events-none", !visible);
  };

  // Consider the bar "visible" when it isn't hidden or fully translated off screen
  const isBuyBarVisible = () => {
    if (!bar) return false;
    const cl = bar.classList;
    // Adjust checks to your show/hide classes; this combo works with typical translate/hidden patterns
    const hidden =
      cl.contains("hidden") || cl.contains("opacity-0") || cl.contains("translate-y-full");
    return !hidden;
  };

  const syncCue = () => setCueVisible(!isBuyBarVisible());

  // Initial sync
  syncCue();

  // Observe class/style changes on buyBar so cue follows any state updates
  if (bar && "MutationObserver" in window) {
    const mo = new MutationObserver(syncCue);
    mo.observe(bar, { attributes: true, attributeFilter: ["class", "style"] });
  }

  // If there is a close button that hides the bar, show the cue again immediately
  const buyBarCloseBtn = document.getElementById("buyBarClose");
  if (buyBarCloseBtn) {
    buyBarCloseBtn.addEventListener("click", () => {
      setTimeout(syncCue, 0);
    });
  }

  const opts = { threshold: 0.4 };
  const heroIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      // show bar when hero is NOT sufficiently visible
      show = !e.isIntersecting;
      set(show);
      // keep cue synced with bar state
      syncCue();
    });
  }, opts);
  heroIO.observe(hero);

  if (builder) {
    const builderIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting)
            set(false); // hide when builder visible
          else set(show);
          // keep cue synced with bar state
          syncCue();
        });
      },
      { threshold: 0.2 },
    );
    builderIO.observe(builder);
  }
})();
```

## Close-flag read/write (first occurrences)

```js
const closed = sessionStorage.getItem("buyBarClosed") === "1";
...
sessionStorage.setItem("buyBarClosed", "1");
```

**COMMANDS**

- Run: `git rev-parse --short HEAD` (use "unknown" if not available)
- Run: `npx prettier -w docs/DBG_BUYBAR.md`
- Commit: `docs: add DBG_BUYBAR snapshot (markup + controller + flag lines)`
