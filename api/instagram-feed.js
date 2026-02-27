// Returns Instagram feed when token is configured; otherwise returns sample images for fallback UX
const SAMPLE_IMAGES = ['black.JPG', 'white.JPG', 'IMG_9805.jpg', 'IMG_9792.jpg', 'IMG_9002.JPG', 'orange.JPG'];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    // Return sample format so frontend can render local images (relative paths)
    const items = SAMPLE_IMAGES.map((name) => ({
      permalink: '#',
      media_url: `/assets/images/${name}`,
      thumbnail_url: `/assets/images/${name}`,
      media_type: 'IMAGE',
    }));
    return res.status(200).json(items);
  }

  try {
    const igRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=12`
    );
    if (!igRes.ok) throw new Error('IG API error');
    const data = await igRes.json();
    const items = (data.data || []).slice(0, 12);
    return res.status(200).json(items);
  } catch (err) {
    console.error('Instagram feed error:', err);
    const items = SAMPLE_IMAGES.map((name) => ({
      permalink: '#',
      media_url: `/assets/images/${name}`,
      thumbnail_url: `/assets/images/${name}`,
      media_type: 'IMAGE',
    }));
    return res.status(200).json(items);
  }
};
