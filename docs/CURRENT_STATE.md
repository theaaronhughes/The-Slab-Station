# CURRENT STATE (auto snapshot)

- Commit: ed6f36f
- Deployed: https://rainbow-chimera-eb5907.netlify.app/

## index.html — Hero

```html
<section class="hero relative min-h-[92svh] overflow-hidden">
  <!-- Background image -->
  <img
    src="assets/images/hero-image.jpg"
    alt="Rotating Slab Station hero"
    class="absolute inset-0 w-full h-full object-cover z-0"
    decoding="async"
    fetchpriority="high"
  />

  <!-- Legibility overlays: linear + radial -->
  <div class="absolute inset-0 pointer-events-none z-10">
    <!-- linear -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/80"></div>
    <!-- radial vignette centered behind text -->
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.35)_35%,rgba(0,0,0,0)_70%)]"
    ></div>
  </div>

  <!-- Centered copy stack -->
  <div class="relative z-20 flex items-center justify-center p-5 md:p-8 text-center">
    <div class="w-full max-w-3xl mx-auto space-y-4 md:space-y-6">
      <p class="uppercase text-xs tracking-wide text-white/70">THE SLAB STATION</p>

      <!-- Keep your original big headline -->
      <h1
        class="text-white font-extrabold tracking-tight leading-[1.05] text-[clamp(34px,8vw,56px)] md:text-6xl"
      >
        The Ultimate Slab Showcase
      </h1>

      <!-- Same paragraph copy; constrain width for better density on phones -->
      <p
        class="text-base md:text-lg text-white/85 mx-auto leading-relaxed max-w-[26ch] sm:max-w-[46ch]"
      >
        A premium, rotating, stackable display built for PSA/BGS graded cards — engineered to look
        incredible on your desk or shelf.
      </p>

      <!-- CTAs unchanged -->
      <div
        class="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-1"
      >
        <a
          href="#builder"
          class="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-white text-black px-6 py-3 font-semibold hover:bg-white/90 transition focus-ring"
        >
          Buy Now
        </a>
      </div>

      <!-- Credibility badges -->
      <ul
        class="mt-3 md:mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] text-white/70"
      >
        <li class="inline-flex items-center gap-1.5">
          <svg
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M12 3l8 4v5c0 5-8 9-8 9S4 17 4 12V7l8-4z" />
          </svg>
          Built for PSA & BGS
        </li>
        <li class="inline-flex items-center gap-1.5">
          <svg
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M3 7h11v10H3z" />
            <path d="M14 10h4l3 3v4h-7z" />
            <circle cx="7.5" cy="17" r="1.5" />
            <circle cx="17.5" cy="17" r="1.5" />
          </svg>
          AU-wide shipping A$19.95
        </li>
        <li class="inline-flex items-center gap-1.5">
          <svg
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M12 2l9 5-9 5-9-5 9-5z" />
            <path d="M3 12l9 5 9-5" />
            <path d="M3 17l9 5 9-5" />
          </svg>
          Stackable design
        </li>
      </ul>

      <!-- Scroll cue (mobile only) -->
      <div class="absolute bottom-4 left-0 right-0 flex justify-center md:hidden">
        <a
          href="#features"
          class="scroll-cue inline-flex items-center justify-center rounded-full border border-white/25 [backdrop-filter:saturate(120%)_blur(2px)] px-3 py-2 text-white/85 focus-ring"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>
```

## index.html — Features

```html
<section id="features" class="relative bg-[#121212] py-16 sm:py-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl sm:text-4xl font-extrabold text-center">Key Features</h2>
    <p class="text-white/70 text-center mt-2 max-w-2xl mx-auto">
      The essentials—one at a time. Swipe to explore.
    </p>

    <!-- One-card swipe carousel (no arrows, accessible dots) -->
    <div
      id="featuresViewport"
      class="mt-8 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth -mx-4 px-4"
      role="region"
      aria-label="Key features carousel"
    >
      <ul id="featuresTrack" class="flex gap-4">
        <!-- Slide 1 -->
        <li
          id="feature-slide-1"
          class="snap-center shrink-0 w-[86%] sm:w-[520px] max-w-[560px] mx-auto"
        >
          <article class="rounded-3xl bg-white/[0.06] ring-1 ring-white/10 p-6 text-center">
            <div
              class="inline-flex items-center justify-center rounded-2xl bg-white/[0.08] ring-1 ring-white/10 p-3 mb-4"
            >
              <svg
                class="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 12c0 4 4.5 7 9 7s9-3 9-7-4.5-7-9-7" />
                <path d="M12 5v4m0 6v4" />
              </svg>
            </div>
            <h3 class="text-xl font-extrabold leading-snug">360° Smooth Rotation</h3>
            <p class="text-white/75 text-sm leading-relaxed mt-2">
              Effortlessly showcase every angle of your graded card with a silent, smooth rotating
              mechanism.
            </p>
          </article>
        </li>

        <!-- Slide 2 -->
        <li
          id="feature-slide-2"
          class="snap-center shrink-0 w-[86%] sm:w-[520px] max-w-[560px] mx-auto"
        >
          <article class="rounded-3xl bg-white/[0.06] ring-1 ring-white/10 p-6 text-center">
            <div
              class="inline-flex items-center justify-center rounded-2xl bg-white/[0.08] ring-1 ring-white/10 p-3 mb-4"
            >
              <svg
                class="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="4" y="4" width="7" height="7" rx="1.5" />
                <rect x="13" y="4" width="7" height="7" rx="1.5" />
                <rect x="8.5" y="13" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <h3 class="text-xl font-extrabold leading-snug">Stackability &amp; Storage</h3>
            <p class="text-white/75 text-sm leading-relaxed mt-2">
              Displays 6 slabs externally, stores 12 internally. Stack multiple units for growing
              collections.
            </p>
          </article>
        </li>

        <!-- Slide 3 -->
        <li
          id="feature-slide-3"
          class="snap-center shrink-0 w-[86%] sm:w-[520px] max-w-[560px] mx-auto"
        >
          <article class="rounded-3xl bg-white/[0.06] ring-1 ring-white/10 p-6 text-center">
            <div
              class="inline-flex items-center justify-center rounded-2xl bg-white/[0.08] ring-1 ring-white/10 p-3 mb-4"
            >
              <svg
                class="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 3l8 4v5c0 5-8 9-8 9s-8-4-8-9V7l8-4z" />
              </svg>
            </div>
            <h3 class="text-xl font-extrabold leading-snug">Perfect Fit &amp; Premium Build</h3>
            <p class="text-white/75 text-sm leading-relaxed mt-2">
              Built for PSA/BGS slabs with high-quality materials designed for stability.
            </p>
          </article>
        </li>

        <!-- Slide 4 -->
        <li
          id="feature-slide-4"
          class="snap-center shrink-0 w-[86%] sm:w-[520px] max-w-[560px] mx-auto"
        >
          <article class="rounded-3xl bg-white/[0.06] ring-1 ring-white/10 p-6 text-center">
            <div
              class="inline-flex items-center justify-center rounded-2xl bg-white/[0.08] ring-1 ring-white/10 p-3 mb-4"
            >
              <svg
                class="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3.5" y="5" width="17" height="11" rx="2" />
                <path d="M8 20h8" />
              </svg>
            </div>
            <h3 class="text-xl font-extrabold leading-snug">Sleek Display-Ready Design</h3>
            <p class="text-white/75 text-sm leading-relaxed mt-2">
              Elevate your desk, shelf, or display case—minimal footprint, easy assembly.
            </p>
          </article>
        </li>
      </ul>
    </div>

    <!-- Dots (accessible) -->
    <div
      id="featuresDots"
      class="mt-5 flex items-center justify-center gap-2"
      role="tablist"
      aria-label="Feature slides"
    >
      <button
        type="button"
        role="tab"
        aria-controls="feature-slide-1"
        aria-selected="true"
        class="h-1.5 w-6 rounded-full bg-white/90"
      ></button>
      <button
        type="button"
        role="tab"
        aria-controls="feature-slide-2"
        aria-selected="false"
        class="h-1.5 w-3 rounded-full bg-white/30"
      ></button>
      <button
        type="button"
        role="tab"
        aria-controls="feature-slide-3"
        aria-selected="false"
        class="h-1.5 w-3 rounded-full bg-white/30"
      ></button>
      <button
        type="button"
        role="tab"
        aria-controls="feature-slide-4"
        aria-selected="false"
        class="h-1.5 w-3 rounded-full bg-white/30"
      ></button>
    </div>

    <!-- The 5-station image grid you love -->
    <div class="mt-10 w-full">
      <div class="relative group rounded-2xl overflow-hidden ring-2 ring-white/80">
        <img
          src="assets/images/IMG_8980.JPG"
          alt="Slab Station color grid"
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover transition duration-300 ease-out group-hover:scale-[1.02]"
        />
        <div class="pointer-events-none absolute inset-0 ring-1 ring-white/20 rounded-2xl"></div>
      </div>
    </div>
  </div>
</section>
```

## index.html — How It Works

```html
<section id="how" class="bg-black py-16 sm:py-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl sm:text-4xl font-extrabold text-center">
      How It Works — Slab Station in Action
    </h2>
    <p class="text-white/70 text-center mt-3 max-w-3xl mx-auto">
      See how the Slab Station revolutionizes the way you store and display your graded cards.
    </p>

    <!-- Tabs -->
    <div
      class="mt-6 flex items-center justify-center gap-3"
      role="tablist"
      aria-label="How it Works Tabs"
    >
      <button
        class="tab-btn active rounded-xl px-5 py-3 bg-white/15 hover:bg-white/20 border border-white/20 focus-ring"
        role="tab"
        id="tabbtn-setup"
        aria-controls="tab-setup"
        data-target="tab-setup"
        aria-selected="true"
        tabindex="0"
      >
        Setup &amp; Storage
      </button>
      <button
        class="tab-btn rounded-xl px-5 py-3 bg-white/15 hover:bg-white/20 border border-white/20 focus-ring"
        role="tab"
        id="tabbtn-showcase"
        aria-controls="tab-showcase"
        data-target="tab-showcase"
        aria-selected="false"
        tabindex="-1"
      >
        Showcase Mode
      </button>
    </div>

    <!-- Video Panels -->
    <div class="mt-6 max-w-5xl mx-auto">
      <div id="tab-setup" class="tab-panel" role="tabpanel" aria-labelledby="tabbtn-setup">
        <div
          class="relative rounded-3xl overflow-hidden bg-black ring-1 ring-white/10 shadow-2xl"
          style="aspect-ratio: 16/9"
        >
          <video
            id="video-setup"
            class="absolute inset-0 h-full w-full object-contain"
            poster="assets/videos/setup-poster.jpg"
            muted
            autoplay
            loop
            playsinline
            preload="metadata"
          >
            <source src="assets/videos/setup.mp4" type="video/mp4" />
          </video>
          <button
            class="video-overlay absolute inset-0 flex items-center justify-center rounded-[22px] bg-black/20 hover:bg-black/30 text-white/90 text-sm font-medium focus-ring"
          >
            Tap to Play
          </button>
        </div>
      </div>
      <div
        id="tab-showcase"
        class="tab-panel hidden"
        role="tabpanel"
        aria-labelledby="tabbtn-showcase"
      >
        <div
          class="relative rounded-3xl overflow-hidden bg-black ring-1 ring-white/10 shadow-2xl"
          style="aspect-ratio: 16/9"
        >
          <video
            id="video-showcase"
            class="absolute inset-0 h-full w-full object-contain"
            poster="assets/videos/showcase-poster.jpg"
            muted
            loop
            playsinline
            preload="metadata"
          >
            <source src="assets/videos/spin.mp4" type="video/mp4" />
          </video>
          <button
            class="video-overlay absolute inset-0 flex items-center justify-center rounded-[22px] bg-black/20 hover:bg-black/30 text-white/90 text-sm font-medium focus-ring"
          >
            Tap to Play
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
```

## index.html — Sticky Buy Bar

```html
<div
  id="buyBar"
  class="fixed bottom-0 inset-x-0 z-40 md:hidden translate-y-full transition-transform duration-300"
>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mb-[env(safe-area-inset-bottom)]"></div>
    <div
      class="pointer-events-auto mx-auto w-[92vw] max-w-[720px] overflow-hidden rounded-3xl bg-white text-black ring-1 ring-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-2.5 md:p-3.5 grid grid-cols-[1fr_auto] items-center gap-2 md:gap-3 bb-card"
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

## index.html — Payments (PayPal row wrapper)

```html
<div class="paypal-wrap overflow-hidden rounded-2xl bg-transparent p-0 border-0 shadow-none">
  <div id="paypal-container" class="w-full"></div>
</div>
```

## index.html — Reviews

```html
<section id="reviews" class="py-14 md:py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-white text-center">
      Collector Approved
    </h2>
    <p class="mt-3 text-center text-white/70 max-w-[52ch] mx-auto">
      Join hundreds of collectors who have elevated their displays with The Slab Station.
    </p>
    <div id="reviewsSummary" class="mt-4 text-center text-white/85">
      <!-- populated by JS -->
    </div>

    <!-- Mobile carousel -->
    <div class="mt-8 md:hidden">
      <div
        id="reviewsViewport"
        class="overflow-x-auto snap-x snap-mandatory scroll-p-4 -mx-4 px-4"
        aria-live="polite"
        aria-label="Customer reviews carousel"
      >
        <ul id="reviewsTrack" class="flex gap-4"></ul>
      </div>
      <div
        id="reviewsDots"
        class="mt-4 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Review slides"
      ></div>
    </div>

    <!-- Desktop grid -->
    <div class="hidden md:grid grid-cols-3 gap-6 mt-10" id="reviewsGrid"></div>
  </div>
</section>
```

## script.js — Features carousel controller

```js
(function () {
  const viewport = document.getElementById("featuresViewport");
  const track = document.getElementById("featuresTrack");
  const dotsWrap = document.getElementById("featuresDots");
  if (!viewport || !track || !dotsWrap) return;

  const slides = Array.from(track.children);
  const dots = Array.from(dotsWrap.querySelectorAll('button[role="tab"], button'));
  let slideW = 0,
    gap = 16,
    active = 0,
    ticking = false;
  let interacted = false,
    timer = null;

  // Titles for announcements (fallback to h3 text)
  const titles = slides.map((s) => s.querySelector("h3")?.textContent?.trim() || "Feature");

  function measure() {
    const rect = slides[0]?.getBoundingClientRect();
    slideW = (rect?.width || viewport.clientWidth) + gap;
  }
  function announce(i) {
    viewport.setAttribute("aria-live", "polite");
    viewport.setAttribute(
      "aria-label",
      `Key features — showing: ${titles[i]} (${i + 1} of ${slides.length})`,
    );
  }
  function setActive(i, opts = {}) {
    active = Math.max(0, Math.min(slides.length - 1, i));
    dots.forEach((d, idx) => {
      d.setAttribute("aria-selected", String(idx === active));
      d.tabIndex = idx === active ? 0 : -1;
      d.className =
        idx === active
          ? "h-1.5 w-6 rounded-full bg-white/90"
          : "h-1.5 w-3 rounded-full bg-white/30";
    });
    if (opts.focusDot && dots[active]) {
      try {
        dots[active].focus({ preventScroll: true });
      } catch (_) {}
    }
    announce(active);
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const i = Math.round(viewport.scrollLeft / Math.max(1, slideW));
      if (i !== active) setActive(i);
      ticking = false;
    });
  }
  function cancelAuto() {
    interacted = true;
    if (timer) clearInterval(timer);
  }
  function scrollToIndex(i, opts = {}) {
    if (opts.user) cancelAuto();
    viewport.scrollTo({ left: i * slideW, behavior: "smooth" });
    setActive(i, { focusDot: !!opts.focusDot });
  }

  const cancelEvts = ["pointerdown", "touchstart", "wheel", "keydown", "click"];
  cancelEvts.forEach((evt) => {
    viewport.addEventListener(evt, cancelAuto, { passive: true });
    dots.forEach((d) => d.addEventListener(evt, cancelAuto, { passive: true }));
  });

  dots.forEach((d, i) => {
    d.addEventListener("click", () => scrollToIndex(i, { user: true, focusDot: true }));
    d.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          scrollToIndex(Math.min(slides.length - 1, active + 1), { user: true, focusDot: true });
          break;
        case "ArrowLeft":
          e.preventDefault();
          scrollToIndex(Math.max(0, active - 1), { user: true, focusDot: true });
          break;
        case "Home":
          e.preventDefault();
          scrollToIndex(0, { user: true, focusDot: true });
          break;
        case "End":
          e.preventDefault();
          scrollToIndex(slides.length - 1, { user: true, focusDot: true });
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          scrollToIndex(i, { user: true, focusDot: true });
          break;
      }
    });
  });
  viewport.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    measure();
    setActive(active);
  });

  measure();
  setActive(0);

  // Gentle auto-advance (respects reduced motion; cancels on interaction)
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!mq.matches) {
    timer = setInterval(() => {
      if (interacted) return;
      const next = (active + 1) % slides.length;
      viewport.scrollTo({ left: next * slideW, behavior: "smooth" });
    }, 4000);
  }
})();
```

## script.js — How-It-Works controller

```js
(function () {
  const tabs = Array.from(document.querySelectorAll(".tab-btn"));
  const panels = ["tab-setup", "tab-showcase"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const vids = panels.map((p) => p?.querySelector("video")).filter(Boolean);
  if (!tabs.length || !panels.length) return;

  function showPanel(panelId) {
    panels.forEach((p) => p.classList.toggle("hidden", p.id !== panelId));
    tabs.forEach((b) => {
      const on = b.dataset.target === panelId;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
  }

  function syncOverlay(panelId) {
    const p = document.getElementById(panelId);
    if (!p) return;
    const v = p.querySelector("video");
    const ov = p.querySelector(".video-overlay");
    if (!ov || !v) return;
    const playing = !!(v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2);
    ov.classList.toggle("hidden", playing);
  }

  function playOnly(panelId) {
    vids.forEach((v) => v && v.pause());
    const v = document.querySelector(`#${panelId} video`);
    if (v)
      v.play()
        .catch(() => {})
        .finally(() => syncOverlay(panelId));
  }

  // Initialize state
  const initial =
    tabs.find((b) => b.getAttribute("aria-selected") === "true")?.dataset.target || panels[0].id;
  showPanel(initial);
  playOnly(initial);

  // Tab switching
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tgt = btn.dataset.target;
      showPanel(tgt);
      playOnly(tgt);
    });
  });

  // Overlay + video click toggle
  panels.forEach((p) => {
    const v = p.querySelector("video");
    const ov = p.querySelector(".video-overlay");
    if (!v || !ov) return;
    const toggle = () => {
      if (v.paused) v.play().catch(() => {});
      else v.pause();
    };
    ov.addEventListener("click", toggle);
    v.addEventListener("click", toggle);
    v.addEventListener("play", () => syncOverlay(p.id));
    v.addEventListener("pause", () => syncOverlay(p.id));
    v.addEventListener("loadeddata", () => syncOverlay(p.id));
  });

  // Pause when a panel is <50% visible
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const video = e.target.querySelector("video");
          if (!video) return;
          if (!e.isIntersecting) {
            video.pause();
          } else if (!e.target.classList.contains("hidden")) {
            video.play().catch(() => {});
          }
          syncOverlay(e.target.id);
        });
      },
      { threshold: 0.5 },
    );
    panels.forEach((p) => io.observe(p));
  }
})();
```

## script.js — Sticky Buy Bar controller

```js
/* =========================
   Sticky Buy Bar Controller (class-based & resilient)
   ========================= */
(() => {
  const bar = document.getElementById("buyBar");
  const hero = document.querySelector("section.hero");
  const builder = document.getElementById("builder");
  if (!bar || !hero) return;

  const SCROLL_CUE = document.getElementById("scrollCue");
  const CLOSED_KEY = "buyBarClosed";

  // Query params
  const qs = new URLSearchParams(location.search);
  const forceShow = qs.get("debugBuyBar") === "1" || qs.get("buybar") === "show";
  const forceReset = qs.get("buybar") === "reset";

  // Normalized close flag helpers
  const getClosed = () => {
    try {
      return sessionStorage.getItem(CLOSED_KEY) === "1";
    } catch {
      return false;
    }
  };
  const setClosed = () => {
    try {
      sessionStorage.setItem(CLOSED_KEY, "1");
    } catch {}
  };
  if (forceReset) {
    try {
      sessionStorage.removeItem(CLOSED_KEY);
    } catch {}
  }

  // Show/Hide using classes (no inline transform)
  const showBar = () => {
    bar.classList.remove("hidden", "opacity-0", "pointer-events-none", "translate-y-full");
    bar.classList.add("translate-y-0");
    bar.setAttribute("aria-hidden", "false");
    bar.dataset.visible = "1";
    if (SCROLL_CUE) {
      SCROLL_CUE.classList.add("hidden", "opacity-0", "pointer-events-none");
    }
  };
  const hideBar = () => {
    bar.classList.remove("translate-y-0");
    bar.classList.add("translate-y-full");
    bar.setAttribute("aria-hidden", "true");
    bar.dataset.visible = "0";
    if (SCROLL_CUE) {
      SCROLL_CUE.classList.remove("hidden", "opacity-0", "pointer-events-none");
    }
  };

  // Decision logic (works with/without IO)
  const shouldShow = () => {
    if (getClosed() && !forceShow) return false;
    const threshold = Math.round(window.innerHeight * 0.35);
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    const builderTop = builder ? builder.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
    const pastHero = heroBottom < threshold;
    const beforeBuilder = builderTop > threshold;
    return forceShow ? beforeBuilder : pastHero && beforeBuilder;
  };

  const applyState = () => (shouldShow() ? showBar() : hideBar());

  // Initial: ensure the element can animate (not display:none)
  bar.classList.remove("hidden", "pointer-events-none");
  // Start with a sensible state after layout
  setTimeout(applyState, 100);

  // Keep things fresh via IO (hints only; scroll fallback is authoritative)
  try {
    const io = new IntersectionObserver(() => applyState(), { threshold: [0, 0.35, 0.5, 1] });
    io.observe(hero);
    if (builder) io.observe(builder);
  } catch {
    /* no-op; scroll/resize will handle */
  }

  // Fallback corrections
  window.addEventListener("scroll", applyState, { passive: true });
  window.addEventListener("resize", applyState);
  document.addEventListener("visibilitychange", applyState);

  // Close button
  const closeBtn = document.getElementById("buyBarClose");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      setClosed();
      hideBar();
    });
  }

  // Make taps instant on mobile
  bar.querySelectorAll("a[href],button").forEach((el) => {
    el.style.touchAction = "manipulation";
  });
})();
```

## script.js — Reviews init

```js
const REVIEWS = [
  {
    name: "Tyler K.",
    role: "Card Shop Owner",
    text: "Display quality is insane. Customers notice immediately—best way to showcase grails.",
    stars: 5,
  },
  {
    name: "Alyssa P.",
    role: "Collector",
    text: "Rotation is smooth and quiet. Looks premium on my desk.",
    stars: 5,
  },
  {
    name: "Marco D.",
    role: "TCG Seller",
    text: "Stackable design is clutch. I’m ordering more for my showcase wall.",
    stars: 5,
  },
  {
    name: "Ben H.",
    role: "Pokemon Collector",
    text: "Finally a display worthy of PSA slabs. Build quality surprised me.",
    stars: 5,
  },
  {
    name: "Rina S.",
    role: "BGS Collector",
    text: "Cards pop under the lighting—clean minimal look.",
    stars: 5,
  },
  {
    name: "Jacob L.",
    role: "Breaker",
    text: "Great for streams—center slab rotates perfectly.",
    stars: 5,
  },
  { name: "Nate W.", role: "Collector", text: "Easy assembly. Sturdy once stacked.", stars: 5 },
  {
    name: "Hannah G.",
    role: "Store Manager",
    text: "Customers ask about it constantly—instant conversation piece.",
    stars: 5,
  },
  {
    name: "Chris M.",
    role: "Vending Booth",
    text: "Transported fine and reassembled fast at the show.",
    stars: 5,
  },
  {
    name: "Ivy R.",
    role: "Collector",
    text: "Love the color options—purple looks amazing.",
    stars: 5,
  },
  {
    name: "Owen C.",
    role: "Collector",
    text: "Keeps slabs dust-free and safe from knocks.",
    stars: 5,
  },
  {
    name: "Samir A.",
    role: "Collector",
    text: "Best purchase for my graded cards this year.",
    stars: 5,
  },
  {
    name: "Jules T.",
    role: "Collector",
    text: "Compact footprint—fits perfectly on a shelf.",
    stars: 5,
  },
  { name: "Kara V.", role: "Collector", text: "Rotating mechanism is whisper quiet.", stars: 5 },
  {
    name: "Ethan P.",
    role: "Collector",
    text: "Feels premium, not plasticky. Very happy.",
    stars: 5,
  },
  { name: "Mira Z.", role: "Collector", text: "Stacking two units looks awesome.", stars: 5 },
  { name: "Andre F.", role: "Collector", text: "Slabs fit perfectly—no wobble.", stars: 5 },
  { name: "Noah S.", role: "Collector", text: "Instant desk upgrade.", stars: 5 },
  {
    name: "Phoebe L.",
    role: "Collector",
    text: "Packaging was solid; arrived pristine.",
    stars: 5,
  },
  {
    name: "Leo K.",
    role: "Collector",
    text: "Finally something that’s not a bulky case.",
    stars: 5,
  },
  {
    name: "Grace N.",
    role: "Collector",
    text: "Magnet for compliments when friends visit.",
    stars: 5,
  },
  { name: "Victor J.", role: "Collector", text: "Stable base—no wobble on bump.", stars: 5 },
  { name: "Izzy D.", role: "Collector", text: "Worth the price for the presentation.", stars: 5 },
  { name: "Harper C.", role: "Collector", text: "Great gift for TCG fans.", stars: 5 },
  {
    name: "Quinn R.",
    role: "Collector",
    text: "Setup took minutes. Clear instructions.",
    stars: 5,
  },
  { name: "Damon Y.", role: "Collector", text: "Shipping to VIC was quick.", stars: 5 },
  { name: "Maddie S.", role: "Collector", text: "Looks fantastic with PSA 10s.", stars: 5 },
  { name: "Rex P.", role: "Collector", text: "Ordering a second one.", stars: 5 },
  { name: "Liam W.", role: "Collector", text: "Perfect shelf centerpiece.", stars: 5 },
  { name: "Zara E.", role: "Collector", text: "Finish is smooth; edges clean.", stars: 5 },
];

function renderStars(n = 5) {
  return "★★★★★".slice(0, n);
}

(function reviewsInit() {
  const vp = document.getElementById("reviewsViewport");
  const track = document.getElementById("reviewsTrack");
  const dotsWrap = document.getElementById("reviewsDots");
  const grid = document.getElementById("reviewsGrid");
  const summary = document.getElementById("reviewsSummary");

  if (summary) {
    const count = REVIEWS.length;
    const stars = "★★★★★";
    summary.innerHTML = `
      <div class="inline-flex items-center gap-3">
        <span class="text-2xl font-extrabold">5.0</span>
        <span class="text-yellow-400" aria-label="5 out of 5 stars">${stars}</span>
        <span class="text-white/70">Average rating from ${count} verified buyers</span>
      </div>
    `;
  }

  if (grid) {
    grid.innerHTML = REVIEWS.map(
      (r) => `
      <article class="rounded-2xl border border-white/15 p-5 bg-white/5">
        <div class="flex items-baseline justify-between">
          <h3 class="text-white font-semibold">${r.name}</h3>
          <span class="text-yellow-400" aria-label="${r.stars} out of 5 stars">${renderStars(r.stars)}</span>
        </div>
        <p class="text-white/60 text-sm">${r.role}</p>
        <p class="mt-3 text-white/80">${r.text}</p>
      </article>
    `,
    ).join("");
  }

  if (!vp || !track || !dotsWrap) return;

  // Build slides for mobile
  track.innerHTML = REVIEWS.map(
    (r, i) => `
    <li id="review-slide-${i + 1}" class="snap-start shrink-0 w-[86%] max-w-[560px] mx-auto rounded-2xl border border-white/15 p-5 bg-white/5">
      <div class="flex items-baseline justify-between">
        <h3 class="text-white font-semibold">${r.name}</h3>
        <span class="text-yellow-400" aria-label="${r.stars} out of 5 stars">${renderStars(r.stars)}</span>
      </div>
      <p class="text-white/60 text-sm">${r.role}</p>
      <p class="mt-3 text-white/80">${r.text}</p>
    </li>
  `,
  ).join("");

  dotsWrap.innerHTML = REVIEWS.map(
    (_, i) => `
    <button type="button" role="tab" aria-controls="review-slide-${i + 1}" aria-selected="${i === 0 ? "true" : "false"}" class="${i === 0 ? "h-1.5 w-6 bg-white/90" : "h-1.5 w-3 bg-white/30"} rounded-full"></button>
  `,
  ).join("");

  const slides = Array.from(track.children);
  const dots = Array.from(dotsWrap.querySelectorAll("button"));
  let slideW = 0,
    gap = 16,
    active = 0,
    ticking = false;

  function measure() {
    const rect = slides[0]?.getBoundingClientRect();
    slideW = (rect?.width || vp.clientWidth) + gap;
  }
  function setActive(i) {
    active = Math.max(0, Math.min(slides.length - 1, i));
    dots.forEach((d, idx) => {
      d.setAttribute("aria-selected", String(idx === active));
      d.tabIndex = idx === active ? 0 : -1;
      d.className =
        idx === active
          ? "h-1.5 w-6 rounded-full bg-white/90"
          : "h-1.5 w-3 rounded-full bg-white/30";
    });
    vp.setAttribute("aria-label", `Customer reviews — ${active + 1} of ${slides.length}`);
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const i = Math.round(vp.scrollLeft / Math.max(1, slideW));
      if (i !== active) setActive(i);
      ticking = false;
    });
  }
  function scrollToIndex(i) {
    vp.scrollTo({ left: i * slideW, behavior: "smooth" });
  }

  dots.forEach((d, i) => d.addEventListener("click", () => scrollToIndex(i)));
  vp.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    measure();
    setActive(active);
  });

  measure();
  setActive(0);
})();
```
