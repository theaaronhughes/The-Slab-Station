/* Slab Station — Scripts */

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
menuBtn?.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("hidden") === false;
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});

// Reveal-on-scroll
document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.remove("opacity-0", "translate-y-4");
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.15 },
  );
  io.observe(el);
});

// --- Video sources init (idempotent) ---
(function () {
  const showcase = document.getElementById("video-showcase");
  const setup = document.getElementById("video-setup");
  if (showcase && !showcase.currentSrc && !showcase.src) {
    showcase.src = "assets/videos/spin.mp4";
    try {
      showcase.load();
    } catch (e) {}
  }
  if (setup && !setup.currentSrc && !setup.src) {
    setup.src = "assets/videos/setup.mp4";
    try {
      setup.load();
    } catch (e) {}
  }
})();

// Builder / Pricing
const previewImg = document.getElementById("productPreview");
const gradingService = document.getElementById("gradingService");
const selectedStyle = document.getElementById("selectedStyle");
const customColors = document.getElementById("customColors");
const customNotesWrap = document.getElementById("customNotesWrap");
const customNotes = document.getElementById("customNotes");
const lidColor = document.getElementById("lidColor");
const pillarColor = document.getElementById("pillarColor");
const baseColor = document.getElementById("baseColor");
const addOns = document.getElementById("addOns");
const qtyMinus2 = document.getElementById("qtyMinus2");
const qtyPlus2 = document.getElementById("qtyPlus2");
const qtyInput2 = document.getElementById("qtyInput2");
const basePriceEl = document.getElementById("basePrice");
const subtotalEl = document.getElementById("subtotalPrice");
const shippingEl = document.getElementById("shippingPrice");
const grandTotalEl = document.getElementById("grandTotal");
const customFeeEl = document.getElementById("customFeePrice");

const BASE = 119.95;
const ADDON_PRICE = 14.95;
const SHIPPING = 19.95;
const CUSTOM_COLOR_FEE = 10.0;

function fmt(n) {
  return `$${n.toFixed(2)}`;
}

function computeParts() {
  const qty = Math.max(1, parseInt(qtyInput2.value || "1", 10));
  const addon = addOns.value.includes("Pokéball") ? ADDON_PRICE : 0;
  const isCustom = selectedStyle.value === "Custom Colors";
  const customFee = isCustom ? CUSTOM_COLOR_FEE : 0;
  const subtotal = (BASE + addon + customFee) * qty;
  const total = subtotal + SHIPPING;
  return { qty, addon, customFee, subtotal, total };
}
function updateTotals() {
  const p = computeParts();
  basePriceEl.textContent = fmt(BASE);
  subtotalEl.textContent = fmt(p.subtotal);
  shippingEl.textContent = fmt(SHIPPING);
  grandTotalEl.textContent = fmt(p.total);
  if (customFeeEl) customFeeEl.textContent = fmt(p.customFee);
  const due = document.getElementById("payidDue");
  if (due) due.textContent = `Total due: ${fmt(p.total)} AUD`;
}
updateTotals();

qtyMinus2?.addEventListener("click", () => {
  qtyInput2.value = Math.max(1, parseInt(qtyInput2.value || "1", 10) - 1);
  updateTotals();
});
qtyPlus2?.addEventListener("click", () => {
  qtyInput2.value = Math.max(1, parseInt(qtyInput2.value || "1", 10) + 1);
  updateTotals();
});
qtyInput2?.addEventListener("input", updateTotals);
addOns?.addEventListener("change", updateTotals);

selectedStyle?.addEventListener("change", () => {
  const isCustom = selectedStyle.value === "Custom Colors";
  customColors.classList.toggle("hidden", !isCustom);
  customNotesWrap.classList.toggle("hidden", !isCustom);
  updatePreview();
  updateTotals();
});
[lidColor, pillarColor, baseColor].forEach((el) => el?.addEventListener("change", updatePreview));
gradingService?.addEventListener("change", updatePreview);

function updatePreview() {
  const map = {
    Black: "assets/images/black.jpg",
    White: "assets/images/white.jpg",
    "White/White/Red": "assets/images/whitered.jpg",
    "White/White/Blue": "assets/images/whiteblue.jpg",
    "Orange/Grey/Orange": "assets/images/orangegreyorange.JPG",
    "Yellow/White/Yellow": "assets/images/yellowwhiteyellow.JPG",
    "Red/Blue/Red": "assets/images/IMG_9805.jpg",
    Pink: "assets/images/IMG_9792.jpg",
    Blue: "assets/images/IMG_9002.JPG",
    Orange: "assets/images/orange.JPG",
    "Yellow/Blue/Yellow": "assets/images/YBY.JPG",
    "Red/White/Red": "assets/images/RWR.JPG",
  };
  const style = selectedStyle.value;
  const src = style === "Custom Colors" ? map["Black"] : map[style] || map["Black"];
  if (previewImg) {
    previewImg.src = src;
    previewImg.alt = `Slab Station — ${style}`;
  }
}
updatePreview();

// Notes character counter and limit
customNotes?.addEventListener("input", () => {
  const max = 500;
  if (customNotes.value.length > max) customNotes.value = customNotes.value.slice(0, max);
  const counter = document.getElementById("customNotesCount");
  if (counter) counter.textContent = String(customNotes.value.length);
});

// Validate qty field to ensure >=1 and integer
qtyInput2?.addEventListener("blur", () => {
  const v = parseInt(qtyInput2.value || "1", 10);
  if (!Number.isFinite(v) || v < 1) qtyInput2.value = "1";
  updateTotals();
});

function buildOrder() {
  const { qty, addon, subtotal, total } = computeParts();
  const style = selectedStyle.value;
  return {
    grading: gradingService.value,
    style,
    custom:
      style === "Custom Colors"
        ? `${lidColor.value}/${pillarColor.value}/${baseColor.value}`
        : null,
    customNotes:
      style === "Custom Colors" && customNotes.value.trim() ? customNotes.value.trim() : null,
    addon: addOns.value,
    qty,
    subtotal,
    shipping: SHIPPING,
    total, // AUD
  };
}

// Stripe Checkout (Card & Apple Pay)
const cardCheckoutBtn = document.getElementById("cardCheckoutBtn");
const appleCheckoutBtn = document.getElementById("appleCheckoutBtn");

async function startStripeCheckout() {
  const btns = [cardCheckoutBtn, appleCheckoutBtn].filter(Boolean);
  btns.forEach((b) => b.classList.add("btn-busy"));
  const order = buildOrder();
  try {
    const res = await fetch("/.netlify/functions/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...order, origin: window.location.origin }),
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
    else alert("Could not start checkout. Check your Stripe keys/function.");
  } catch (e) {
    console.error(e);
    alert("Stripe checkout error.");
  } finally {
    btns.forEach((b) => b.classList.remove("btn-busy"));
  }
}
cardCheckoutBtn?.addEventListener("click", startStripeCheckout);
appleCheckoutBtn?.addEventListener("click", startStripeCheckout);

// PayPal (collect shipping; hide card funding)
(function loadPayPal() {
  const id = window.PAYPAL_CLIENT_ID || "sb";
  const s = document.createElement("script");
  s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(id)}&currency=AUD&intent=capture&components=buttons&disable-funding=card,credit,venmo,paylater`;
  s.onload = renderPayPal;
  document.head.appendChild(s);
})();

function renderPayPal() {
  if (!window.paypal) return;
  const container = document.getElementById("paypal-container");
  // Mutation observer to kill random margins PayPal sometimes injects
  const mo = new MutationObserver(() => {
    [...container.querySelectorAll("[style]")].forEach((el) => {
      if (el.style.margin) el.style.margin = "0px";
      if (el.style.borderRadius) el.style.borderRadius = "16px";
    });
  });
  mo.observe(container, { subtree: true, attributes: true });

  window.paypal
    .Buttons({
      style: { layout: "vertical", tagline: false, height: 45, shape: "pill", color: "gold" },
      createOrder: (_, actions) => {
        const order = buildOrder();
        return actions.order.create({
          intent: "CAPTURE",
          application_context: { shipping_preference: "GET_FROM_FILE" },
          purchase_units: [
            {
              amount: { currency_code: "AUD", value: order.total.toFixed(2) },
              description: `The Slab Station — ${order.style} (incl. shipping)`,
            },
          ],
        });
      },
      onApprove: async (_, actions) => {
        const details = await actions.order.capture();

        const payer = details?.payer
          ? {
              email: details.payer.email_address,
              given_name: details.payer.name?.given_name,
              surname: details.payer.name?.surname,
              payer_id: details.payer.payer_id,
            }
          : null;

        const pu = details?.purchase_units?.[0];
        const ship = pu?.shipping;
        const shipping = ship
          ? {
              name: ship.name?.full_name || null,
              address_line_1: ship.address?.address_line_1 || null,
              admin_area_2: ship.address?.admin_area_2 || null,
              admin_area_1: ship.address?.admin_area_1 || null,
              postal_code: ship.address?.postal_code || null,
              country_code: ship.address?.country_code || null,
            }
          : null;

        await sendOrderEmail("PAYPAL", details?.id, buildOrder(), { payer, shipping });
        window.location.href = "thankyou.html";
      },
      onError: (err) => {
        console.error(err);
        alert("PayPal error. Check your Client ID.");
      },
    })
    .render(container);
}

// PAYID
const payidModal = document.getElementById("payidModal");
const payidBtn = document.getElementById("payidBtn");
const payidClose = document.getElementById("payidClose");
const payidCancel = document.getElementById("payidCancel");
const payidSubmit = document.getElementById("payidSubmit");
const copyPayid = document.getElementById("copyPayid");

payidBtn?.addEventListener("click", () => {
  payidModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  const p = computeParts();
  const due = document.getElementById("payidDue");
  if (due) due.textContent = `Total due: ${fmt(p.total)} AUD`;
});
[payidClose, payidCancel].forEach((b) =>
  b?.addEventListener("click", () => {
    payidModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
  }),
);
copyPayid?.addEventListener("click", async () => {
  await navigator.clipboard.writeText("giraffemilk19@up.me");
  copyPayid.textContent = "Copied!";
  setTimeout(() => (copyPayid.textContent = "Copy"), 1200);
});
payidSubmit?.addEventListener("click", async () => {
  const must = (id) => document.getElementById(id);
  const required = [
    "pd_name",
    "pd_email",
    "pd_addr1",
    "pd_city",
    "pd_state",
    "pd_post",
    "pd_country",
    "pd_confirm",
  ];
  for (const id of required) {
    const el = must(id);
    if ((el.type === "checkbox" && !el.checked) || (!el.value && el.type !== "checkbox")) {
      alert("Please complete all required PayID fields.");
      return;
    }
  }

  const buyer = {
    payer: { email: must("pd_email").value, given_name: must("pd_name").value },
    shipping: {
      name: must("pd_name").value,
      address_line_1:
        must("pd_addr1").value + (must("pd_addr2").value ? `, ${must("pd_addr2").value}` : ""),
      admin_area_2: must("pd_city").value,
      admin_area_1: must("pd_state").value,
      postal_code: must("pd_post").value,
      country_code: must("pd_country").value,
    },
    payid_reference: must("pd_ref").value || null,
  };

  payidSubmit.disabled = true;
  payidSubmit.classList.add("btn-busy");
  await sendOrderEmail("PAYID", null, buildOrder(), buyer);
  window.location.href = "thankyou.html";
});

// Email order summaries (serverless)
async function sendOrderEmail(method, providerId, order, buyer) {
  try {
    await fetch("/.netlify/functions/submit-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, providerId, order, buyer }),
    });
  } catch (e) {
    console.error("Email send error", e);
  }
}

// Close mobile menu on anchor click
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", () => {
    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
      menuBtn?.setAttribute("aria-expanded", "false");
    }
  });
});

// Back to top visibility + behavior
(function () {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  const onScroll = () => {
    if (window.scrollY > 600) btn.classList.remove("hidden");
    else btn.classList.add("hidden");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

// header backdrop toggle on scroll
(function () {
  const header = document.querySelector("header");
  if (!header) return;
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    header.classList.toggle("scrolled", y > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// --- Reviews data (30) ---
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

// features carousel (accessible dots + "peek" width + aria announcements + keyboard nav + auto-advance)
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

// how-it-works: tab video controller + visibility pause + tap-to-play overlay
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

// --- Sticky Buy Bar controller ---
(function () {
  const bar = document.getElementById("buyBar");
  const hero = document.querySelector("section.hero");
  const builder = document.getElementById("builder");
  if (!bar || !hero) return;

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
      sessionStorage.setItem("buyBarClosed", "1");
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
