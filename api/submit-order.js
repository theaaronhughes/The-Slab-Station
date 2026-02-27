const { Resend } = require('resend');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const toEmail = process.env.ORDER_TO_EMAIL || 'theaaronhughes@gmail.com';
  const fromEmail = process.env.ORDER_FROM_EMAIL || 'orders@slabstation.app';

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { method, providerId, order, buyer } = body;

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
          <li><b>Grading:</b> ${order?.grading}</li>
          <li><b>Style:</b> ${order?.style}</li>
          ${order?.custom ? `<li><b>Custom:</b> ${order.custom}</li>` : ''}
          ${order?.customNotes ? `<li><b>Notes:</b> ${order.customNotes}</li>` : ''}
          <li><b>Add-ons:</b> ${order?.addon}</li>
          <li><b>Quantity:</b> ${order?.qty}</li>
          <li><b>Total (AUD):</b> $${Number(order?.total || 0).toFixed(2)}</li>
        </ul>
        ${shippingBlock}
        ${payerBlock}
      </div>`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const resp = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New Order (${method}) — ${order?.style || 'Slab Station'} x${order?.qty || 1}`,
      html,
    });

    return res.status(200).json({ ok: true, id: resp.data?.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
