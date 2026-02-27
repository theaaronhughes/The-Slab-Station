const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Missing Stripe configuration' });
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const md = session.metadata || {};
    const cd = session.customer_details || {};
    const sd = session.shipping_details || {};

    let items = [];
    try {
      const li = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
      items = li.data.map(i => `${i.quantity} × ${i.description} — $${(i.amount_total/100).toFixed(2)} ${i.currency?.toUpperCase()}`);
    } catch (e) {
      console.warn('Could not fetch line items:', e.message);
    }

    const html = `
      <div style="font-family:Inter,Arial,sans-serif">
        <h2>Stripe Payment Succeeded — The Slab Station</h2>
        <p><b>Checkout Session:</b> ${session.id}</p>
        <p><b>Email:</b> ${cd.email || ''}</p>
        <p><b>Total:</b> $${(session.amount_total/100).toFixed(2)} ${session.currency?.toUpperCase() || 'AUD'}</p>
        <h3>Order</h3>
        <ul>
          <li><b>Grading:</b> ${md.grading || ''}</li>
          <li><b>Style:</b> ${md.style || ''}</li>
          ${md.addon ? `<li><b>Add-ons:</b> ${md.addon}</li>` : ''}
          ${md.custom ? `<li><b>Custom:</b> ${md.custom}</li>` : ''}
          ${md.customNotes ? `<li><b>Notes:</b> ${md.customNotes}</li>` : ''}
        </ul>
        ${items.length ? `<p><b>Items:</b><br>${items.join('<br>')}</p>` : ''}
        ${sd?.address ? `
          <h3>Shipping</h3>
          <ul>
            <li><b>Name:</b> ${sd.name || ''}</li>
            <li><b>Address:</b> ${sd.address.line1 || ''}${sd.address.line2 ? ', '+sd.address.line2 : ''}</li>
            <li><b>City:</b> ${sd.address.city || ''}</li>
            <li><b>State:</b> ${sd.address.state || ''}</li>
            <li><b>Postcode:</b> ${sd.address.postal_code || ''}</li>
            <li><b>Country:</b> ${sd.address.country || ''}</li>
          </ul>` : ''}
      </div>
    `;

    const toEmail = process.env.ORDER_TO_EMAIL || 'theaaronhughes@gmail.com';
    const fromEmail = process.env.ORDER_FROM_EMAIL || 'orders@slabstation.app';

    if (process.env.RESEND_API_KEY && toEmail) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject: `Paid — Stripe Checkout ${session.id}`,
          html,
        });
      } catch (emailErr) {
        console.error('Resend email failed:', emailErr);
      }
    }
  }

  res.status(200).json({ received: true });
};
