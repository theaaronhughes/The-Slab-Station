// Public config for frontend (no secrets)
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json({
    paypalClientId: process.env.PAYPAL_CLIENT_ID || '',
  });
};
