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
    const { name, email, role, rating, message } = body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message required' });
    }

    const text = [
      `New review from ${name}`,
      `Email: ${email}`,
      role ? `Role: ${role}` : null,
      `Rating: ${rating || 'N/A'} stars`,
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New review — ${name} (${rating || '?'} stars)`,
      text,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to submit review' });
  }
};
