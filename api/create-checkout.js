const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('Missing STRIPE_SECRET_KEY');

    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const order = payload.order || payload || {};

    const qty = Math.max(1, Number(order.qty || 1));
    const style = order.style || 'Custom';
    const grading = order.grading || 'PSA';
    const addon = order.addon || 'None';
    const custom = order.custom || '';
    const customNotes = (order.customNotes || '').slice(0, 500);

    const total = Number(order.total);
    const subtotal = Number(order.subtotal);
    const shipping = Number(order.shipping);

    const line_items = [];
    const desc = `The Slab Station — ${style} | Grading: ${grading}${addon && addon !== 'None' ? ` | ${addon}` : ''}`;

    if (!isNaN(total) && total > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: 'aud',
          unit_amount: Math.round(total * 100),
          product_data: { name: 'The Slab Station', description: desc },
        },
      });
    } else {
      if (!isNaN(subtotal) && subtotal > 0) {
        line_items.push({
          quantity: 1,
          price_data: {
            currency: 'aud',
            unit_amount: Math.round(subtotal * 100),
            product_data: { name: 'The Slab Station', description: desc },
          },
        });
      }
      if (!isNaN(shipping) && shipping > 0) {
        line_items.push({
          quantity: 1,
          price_data: {
            currency: 'aud',
            unit_amount: Math.round(shipping * 100),
            product_data: { name: 'Shipping (Australia Wide)' },
          },
        });
      }
    }

    if (!line_items.length) throw new Error('Missing/invalid pricing in request');

    const origin = payload.origin || req.headers.origin || process.env.SITE_URL || `https://${req.headers.host || 'the-slab-station.vercel.app'}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'apple_pay', 'google_pay', 'afterpay_clearpay'],
      line_items,
      shipping_address_collection: { allowed_countries: ['AU', 'NZ', 'US', 'CA', 'GB', 'IE', 'SG', 'HK'] },
      phone_number_collection: { enabled: true },
      metadata: {
        style,
        grading,
        qty: String(qty),
        addon: String(addon),
        custom: String(custom),
        customNotes,
        subtotal: isNaN(subtotal) ? '' : String(subtotal),
        shipping: isNaN(shipping) ? '' : String(shipping),
        total: isNaN(total) ? '' : String(total),
      },
      success_url: `${origin}/thankyou.html`,
      cancel_url: `${origin}/index.html#builder`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-checkout error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
