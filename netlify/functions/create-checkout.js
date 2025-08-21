// netlify/functions/create-checkout.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function cors() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors() };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors(), body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('Missing STRIPE_SECRET_KEY');

    const payload = JSON.parse(event.body || '{}');
    const order = payload.order || payload || {};

    const qty = Number(order.qty || 1);
    const style = order.style || 'Custom';
    const grading = order.grading || 'PSA';
    const addon = order.addon || 'None';

    // Build line items (AUD cents). Support either `total` OR `subtotal` + `shipping`
    const line_items = [];
    const desc = `The Slab Station — ${style} | Grading: ${grading}`;

    const total = Number(order.total);
    const subtotal = Number(order.subtotal);
    const shipping = Number(order.shipping);

    if (!isNaN(total) && total > 0) {
      line_items.push({
        quantity: 1, // already includes qty/shipping in `total`
        price_data: {
          currency: 'AUD',
          unit_amount: Math.round(total * 100),
          product_data: { name: 'The Slab Station', description: desc },
        },
      });
    } else {
      if (!isNaN(subtotal) && subtotal > 0) {
        line_items.push({
          quantity: 1,
          price_data: {
            currency: 'AUD',
            unit_amount: Math.round(subtotal * 100),
            product_data: { name: 'The Slab Station', description: desc },
          },
        });
      }
      if (!isNaN(shipping) && shipping > 0) {
        line_items.push({
          quantity: 1,
          price_data: {
            currency: 'AUD',
            unit_amount: Math.round(shipping * 100),
            product_data: { name: 'Shipping (Australia Wide)' },
          },
        });
      }
    }

    if (!line_items.length) throw new Error('Missing/invalid pricing in request');

    // Build safe success/cancel URLs
    const originHeader = event.headers.origin;
    const proto = event.headers['x-forwarded-proto'] || 'https';
    const host = event.headers.host;
    const origin = originHeader || process.env.SITE_URL || `${proto}://${host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // IMPORTANT: only 'card'. Apple Pay is included automatically here.
      payment_method_types: ['card'],
      line_items,
      metadata: {
        style, grading, qty: String(qty), addon: String(addon || ''),
        subtotal: isNaN(subtotal) ? '' : String(subtotal),
        shipping: isNaN(shipping) ? '' : String(shipping),
        total: isNaN(total) ? '' : String(total),
      },
      success_url: `${origin}/thankyou.html`,
      cancel_url: `${origin}/index.html#builder`,
    });

    return { statusCode: 200, headers: cors(), body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    console.error('create-checkout error:', err);
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: err.message || 'Server error' }) };
  }
};
