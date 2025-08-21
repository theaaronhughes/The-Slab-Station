// Netlify Function: Email order summaries via Resend
// Set env var RESEND_API_KEY in Netlify dashboard

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { method, providerId, order, buyer } = JSON.parse(event.body || '{}');
    const to = 'theaaronhughes@gmail.com';

    const shippingBlock = buyer?.shipping ? `
      <h3>Shipping</h3>
      <ul>
        <li><b>Name:</b> ${buyer.shipping.name || ''}</li>
        <li><b>Address 1:</b> ${buyer.shipping.address_line_1 || ''}</li>
        <li><b>City:</b> ${buyer.shipping.admin_area_2 || ''}</li>
        <li><b>State/Region:</b> ${buyer.shipping.admin_area_1 || ''}</li>
        <li><b>Postcode:</b> ${buyer.shipping.postal_code || ''}</li>
        <li><b>Country:</b> ${buyer.shipping.country_code || ''}</li>
      </ul>` : '';

    const payerBlock = buyer?.payer ? `
      <h3>Payer</h3>
      <ul>
        <li><b>Name:</b> ${[buyer.payer.given_name, buyer.payer.surname].filter(Boolean).join(' ')}</li>
        <li><b>Email:</b> ${buyer.payer.email || ''}</li>
        <li><b>Payer ID:</b> ${buyer.payer.payer_id || ''}</li>
      </ul>` : '';

    const payidRef = buyer?.payid_reference ? `<p><b>PayID Reference:</b> ${buyer.payid_reference}</p>` : '';

    const html = `
      <div style="font-family:Inter,Arial,sans-serif">
        <h2>New Order — The Slab Station</h2>
        <p><b>Method:</b> ${method}${providerId ? ` (${providerId})` : ''}</p>
        ${payidRef}
        <ul>
          <li><b>Grading:</b> ${order.grading}</li>
          <li><b>Style:</b> ${order.style}</li>
          ${order.custom ? `<li><b>Custom:</b> ${order.custom}</li>` : ''}
          ${order.customNotes ? `<li><b>Notes:</b> ${order.customNotes}</li>` : ''}
          <li><b>Add-ons:</b> ${order.addon}</li>
          <li><b>Quantity:</b> ${order.qty}</li>
          <li><b>Total (AUD):</b> $${Number(order.total).toFixed(2)}</li>
        </ul>
        ${shippingBlock}
        ${payerBlock}
      </div>`;

    const resp = await resend.emails.send({
      from: 'orders@slabstation.app', // use a verified sender in your Resend account
      to,
      subject: `New Order (${method}) — ${order.style} x${order.qty}`,
      html
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true, id: resp.id }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
