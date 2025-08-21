// Serverless: Stripe Checkout session creator
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const body = JSON.parse(event.body || '{}');
    const {
      grading, style, custom, customNotes, addon, qty,
      subtotal, shipping, total, origin
    } = body;

    const description = [
      `The Slab Station — ${style}`,
      grading ? `Grading: ${grading}` : null,
      custom ? `Custom: ${custom}` : null,
      addon && addon !== 'None' ? `Add-on: ${addon}` : null,
      customNotes ? `Notes: ${customNotes}` : null
    ].filter(Boolean).join(' | ');

    const lineItems = [{
      price_data: {
        currency: 'aud',
        product_data: { name: 'The Slab Station', description },
        unit_amount: Math.round((subtotal / qty) * 100) // item price excl. shipping
      },
      quantity: qty
    }];

    // Add shipping as a separate line
    if (shipping && shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: { name: 'Shipping (Australia Wide)' },
          unit_amount: Math.round(shipping * 100)
        },
        quantity: 1
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card','au_becs_debit'],
      allow_promotion_codes: false,
      success_url: `${origin || ''}/thankyou.html`,
      cancel_url: `${origin || ''}/index.html#builder`,
      line_items: lineItems,
      metadata: {
        grading, style, custom, addon, qty: String(qty || 1),
        subtotal: String(subtotal || 0), shipping: String(shipping || 0), total: String(total || 0)
      }
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'stripe_error' }) };
  }
};
