/* --------------------------
   Slab Station — Scripts
---------------------------*/

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('hidden') === false;
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Reveal-on-scroll
document.querySelectorAll('.reveal-on-scroll').forEach(el => {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { el.classList.remove('opacity-0','translate-y-4'); io.unobserve(el); } });
  }, { threshold: 0.15 });
  io.observe(el);
});

/* ---------- How it Works ---------- */
const tabButtons = document.querySelectorAll('.tab-btn');
const setupPanel = document.getElementById('tab-setup');
const showcasePanel = document.getElementById('tab-showcase');
const videoSetup = document.getElementById('video-setup');
const videoShowcase = document.getElementById('video-showcase');

document.addEventListener('DOMContentLoaded', () => {
  // Swap titles/videos per your note:
  // "Setup & Storage" should show howitworks.mp4 and "Showcase Mode" should show Mainvideo.mp4
  if (videoSetup) videoSetup.src = 'assets/videos/howitworks.mp4';
  if (videoShowcase) videoShowcase.src = 'assets/videos/Mainvideo.mp4';
  showTab('setup');
});
tabButtons.forEach(btn => btn.addEventListener('click', () => showTab(btn.dataset.target === 'tab-showcase' ? 'showcase' : 'setup')));

function showTab(which) {
  const activeId = which === 'setup' ? 'tab-setup' : 'tab-showcase';
  [setupPanel, showcasePanel].forEach(p => p.classList.add('hidden'));
  document.getElementById(activeId).classList.remove('hidden');
  tabButtons.forEach(b => {
    const active = b.dataset.target === activeId;
    b.classList.toggle('bg-white/20', active);
    b.classList.toggle('border-white/25', active);
    b.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  try {
    if (which === 'setup') { videoShowcase.pause(); videoShowcase.currentTime = 0; videoSetup.muted = true; videoSetup.play(); }
    else { videoSetup.pause(); videoSetup.currentTime = 0; videoShowcase.muted = true; videoShowcase.play(); }
  } catch (e) {}
}

/* ---------- Builder / Pricing ---------- */
const previewImg = document.getElementById('productPreview');
const gradingService = document.getElementById('gradingService');
const selectedStyle = document.getElementById('selectedStyle');
const customColors = document.getElementById('customColors');
const customNotesWrap = document.getElementById('customNotesWrap');
const customNotes = document.getElementById('customNotes');
const lidColor = document.getElementById('lidColor');
const pillarColor = document.getElementById('pillarColor');
const baseColor = document.getElementById('baseColor');
const addOns = document.getElementById('addOns');
const qtyMinus2 = document.getElementById('qtyMinus2');
const qtyPlus2 = document.getElementById('qtyPlus2');
const qtyInput2 = document.getElementById('qtyInput2');

// pricing pieces
const basePriceEl = document.getElementById('basePrice');
const subtotalEl = document.getElementById('subtotalPrice');
const shippingEl = document.getElementById('shippingPrice');
const grandTotalEl = document.getElementById('grandTotal');

const BASE = 119.95;
const ADDON_PRICE = 14.95;
const SHIPPING = 24.95; // added once per order

function fmt(n){ return `$${n.toFixed(2)}`; }

function computeParts(){
  const qty = Math.max(1, parseInt(qtyInput2.value || '1', 10));
  const addon = addOns.value.includes('Pokéball') ? ADDON_PRICE : 0;
  const subtotal = (BASE + addon) * qty;
  const total = subtotal + SHIPPING;
  return { qty, addon, subtotal, total };
}
function updateTotals(){
  const p = computeParts();
  basePriceEl.textContent = fmt(BASE);
  subtotalEl.textContent = fmt(p.subtotal);
  shippingEl.textContent = fmt(SHIPPING);
  grandTotalEl.textContent = fmt(p.total);
  // Update PayID modal total if open
  const due = document.getElementById('payidDue');
  if (due) due.textContent = `Total due: ${fmt(p.total)} AUD`;
}
updateTotals();

qtyMinus2?.addEventListener('click', () => { qtyInput2.value = Math.max(1, parseInt(qtyInput2.value||'1',10)-1); updateTotals(); });
qtyPlus2?.addEventListener('click', () => { qtyInput2.value = Math.max(1, parseInt(qtyInput2.value||'1',10)+1); updateTotals(); });
qtyInput2?.addEventListener('input', updateTotals);
addOns?.addEventListener('change', updateTotals);

selectedStyle?.addEventListener('change', () => {
  const isCustom = selectedStyle.value === 'Custom Colors';
  customColors.classList.toggle('hidden', !isCustom);
  customNotesWrap.classList.toggle('hidden', !isCustom);
  updatePreview();
});
[lidColor, pillarColor, baseColor].forEach(el => el?.addEventListener('change', updatePreview));
gradingService?.addEventListener('change', updatePreview);

function updatePreview(){
  const map = {
    'Black':'assets/images/black.jpg',
    'White':'assets/images/white.jpg',
    'White/White/Red':'assets/images/whitered.jpg',
    'White/White/Blue':'assets/images/whiteblue.jpg',
    'Orange/Grey/Orange':'assets/images/orangegreyorange.JPG',
    'Yellow/White/Yellow':'assets/images/yellowwhiteyellow.JPG',
    'Red/Blue/Red':'assets/images/IMG_9805.jpg',
    'Pink':'assets/images/IMG_9792.jpg',
    'Blue':'assets/images/IMG_9002.JPG',
    'Orange':'assets/images/orange.JPG',
    'Yellow/Blue/Yellow':'assets/images/YBY.JPG',
    'Red/White/Red':'assets/images/RWR.JPG'
  };
  const style = selectedStyle.value;
  const src = style === 'Custom Colors' ? map['Black'] : (map[style] || map['Black']);
  if (previewImg){ previewImg.src = src; previewImg.alt = `Slab Station — ${style}`; }
}
updatePreview();

function buildOrder(){
  const { qty, addon, subtotal, total } = computeParts();
  const style = selectedStyle.value;
  return {
    grading: gradingService.value,
    style,
    custom: style === 'Custom Colors' ? `${lidColor.value}/${pillarColor.value}/${baseColor.value}` : null,
    customNotes: (style === 'Custom Colors' && customNotes.value.trim()) ? customNotes.value.trim() : null,
    addon: addOns.value,
    qty,
    subtotal, shipping: SHIPPING, total // AUD
  };
}

/* ---------- Stripe Checkout (Card & Apple Pay) ---------- */
const cardCheckoutBtn = document.getElementById('cardCheckoutBtn');
const appleCheckoutBtn = document.getElementById('appleCheckoutBtn');

async function startStripeCheckout() {
  const order = buildOrder();
  try {
    const res = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ ...order, origin: window.location.origin })
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
    else alert('Could not start checkout. Check your Stripe keys/function.');
  } catch (e) { console.error(e); alert('Stripe checkout error.'); }
}
cardCheckoutBtn?.addEventListener('click', startStripeCheckout);
appleCheckoutBtn?.addEventListener('click', startStripeCheckout);

/* ---------- PayPal (collect shipping; hide card funding) ---------- */
(function loadPayPal(){
  const id = window.PAYPAL_CLIENT_ID || 'sb';
  const s = document.createElement('script');
  s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(id)}&currency=AUD&intent=capture&components=buttons&disable-funding=card,credit,venmo,paylater`;
  s.onload = renderPayPal;
  document.head.appendChild(s);
})();
function renderPayPal(){
  if (!window.paypal) return;
  const container = document.getElementById('paypal-container');
  // Mutation observer to kill random margins PayPal sometimes injects
  const mo = new MutationObserver(() => {
    [...container.querySelectorAll('[style]')].forEach(el => {
      if (el.style.margin) el.style.margin = '0px';
      if (el.style.borderRadius) el.style.borderRadius = '16px';
    });
  });
  mo.observe(container, { subtree:true, attributes:true });

  window.paypal.Buttons({
    style: { layout: 'vertical', tagline: false, height: 45, shape: 'pill', color: 'gold' },
    createOrder: (_, actions) => {
      const order = buildOrder();
      return actions.order.create({
        intent: 'CAPTURE',
        application_context: { shipping_preference: 'GET_FROM_FILE' },
        purchase_units: [{
          amount: { currency_code:'AUD', value: order.total.toFixed(2) },
          description: `The Slab Station — ${order.style} (incl. shipping)`
        }]
      });
    },
    onApprove: async (_, actions) => {
      const details = await actions.order.capture();

      const payer = details?.payer ? {
        email: details.payer.email_address,
        given_name: details.payer.name?.given_name,
        surname: details.payer.name?.surname,
        payer_id: details.payer.payer_id
      } : null;

      const pu = details?.purchase_units?.[0];
      const ship = pu?.shipping;
      const shipping = ship ? {
        name: ship.name?.full_name || null,
        address_line_1: ship.address?.address_line_1 || null,
        admin_area_2: ship.address?.admin_area_2 || null,
        admin_area_1: ship.address?.admin_area_1 || null,
        postal_code: ship.address?.postal_code || null,
        country_code: ship.address?.country_code || null
      } : null;

      await sendOrderEmail('PAYPAL', details?.id, buildOrder(), { payer, shipping });
      window.location.href = 'thankyou.html';
    },
    onError: err => { console.error(err); alert('PayPal error. Check your Client ID.'); }
  }).render(container);
}

/* ---------- PAYID ---------- */
const payidModal = document.getElementById('payidModal');
const payidBtn = document.getElementById('payidBtn');
const payidClose = document.getElementById('payidClose');
const payidCancel = document.getElementById('payidCancel');
const payidSubmit = document.getElementById('payidSubmit');
const copyPayid = document.getElementById('copyPayid');

payidBtn?.addEventListener('click', () => { 
  payidModal.classList.remove('hidden'); 
  document.body.classList.add('modal-open');
  // update total in modal
  const p = computeParts();
  const due = document.getElementById('payidDue');
  if (due) due.textContent = `Total due: ${fmt(p.total)} AUD`;
});
[payidClose, payidCancel].forEach(b => b?.addEventListener('click', () => { 
  payidModal.classList.add('hidden'); 
  document.body.classList.remove('modal-open');
}));
copyPayid?.addEventListener('click', async () => {
  await navigator.clipboard.writeText('giraffemilk19@up.me');
  copyPayid.textContent = 'Copied!';
  setTimeout(()=>copyPayid.textContent='Copy',1200);
});
payidSubmit?.addEventListener('click', async () => {
  const must = id => document.getElementById(id);
  const required = ['pd_name','pd_email','pd_addr1','pd_city','pd_state','pd_post','pd_country','pd_confirm'];
  for (const id of required) {
    const el = must(id);
    if ((el.type === 'checkbox' && !el.checked) || (!el.value && el.type !== 'checkbox')) {
      alert('Please complete all required PayID fields.');
      return;
    }
  }

  const buyer = {
    payer: { email: must('pd_email').value, given_name: must('pd_name').value },
    shipping: {
      name: must('pd_name').value,
      address_line_1: must('pd_addr1').value + (must('pd_addr2').value ? `, ${must('pd_addr2').value}` : ''),
      admin_area_2: must('pd_city').value,
      admin_area_1: must('pd_state').value,
      postal_code: must('pd_post').value,
      country_code: must('pd_country').value
    },
    payid_reference: must('pd_ref').value || null
  };

  payidSubmit.disabled = true;
  await sendOrderEmail('PAYID', null, buildOrder(), buyer);
  window.location.href = 'thankyou.html';
});

/* ---------- Email order summaries (serverless) ---------- */
async function sendOrderEmail(method, providerId, order, buyer){
  try {
    await fetch('/.netlify/functions/submit-order', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ method, providerId, order, buyer })
    });
  } catch(e){ console.error('Email send error', e); }
}

/* Close mobile menu on anchor click */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => {
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      menuBtn?.setAttribute('aria-expanded', 'false');
    }
  });
});

/* ---------- Reviews carousel ---------- */
const reviewsViewport = document.getElementById('reviewsViewport');
const reviewsTrack = document.getElementById('reviewsTrack');
const revPrev = document.getElementById('revPrev');
const revNext = document.getElementById('revNext');
const CARD_GAP = 24;

function cardStride() {
  const first = reviewsTrack?.querySelector('li');
  if (!first) return 360;
  const width = first.getBoundingClientRect().width;
  return width + CARD_GAP;
}
function scrollCards(n) {
  if (!reviewsViewport) return;
  reviewsViewport.scrollBy({ left: cardStride() * n, behavior: 'smooth' });
}
revPrev?.addEventListener('click', () => scrollCards(-1));
revNext?.addEventListener('click', () => scrollCards(1));
reviewsViewport?.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    e.preventDefault();
    reviewsViewport.scrollBy({ left: e.deltaX, behavior: 'smooth' });
  }
}, { passive: false });

/* ---------- Instagram feed (via Netlify Function) ---------- */
(async function loadIG(){
  const grid = document.getElementById('igFeed');
  if (!grid) return;

  try {
    const res = await fetch('/.netlify/functions/instagram-feed');
    if (!res.ok) throw new Error('no ig token / bad response');
    const data = await res.json(); // [{permalink, media_url, thumbnail_url, media_type}]
    grid.innerHTML = '';
    (data || []).slice(0, 12).forEach(item => {
      const a = document.createElement('a');
      a.href = item.permalink; a.target = '_blank'; a.rel = 'noopener';
      const img = document.createElement('img');
      img.src = (item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url);
      img.loading = 'lazy';
      img.className = 'w-full h-44 object-cover rounded-2xl';
      a.appendChild(img);
      grid.appendChild(a);
    });
  } catch {
    // Fallback to local images if function not configured yet
    const samples = ['black.jpg','white.jpg','IMG_9805.jpg','IMG_9792.jpg','IMG_9002.JPG','orange.JPG'];
    grid.innerHTML = '';
    samples.forEach(n => {
      const img = document.createElement('img');
      img.src = `assets/images/${n}`;
      img.loading = 'lazy';
      img.className = 'w-full h-44 object-cover rounded-2xl';
      grid.appendChild(img);
    });
  }
})();
