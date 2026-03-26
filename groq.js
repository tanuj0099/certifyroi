// Simple in-memory rate limit — 10 requests per IP per minute
const requests = new Map()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limiting
  const ip  = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
  const now = Date.now()
  const windowMs = 60 * 1000  // 1 minute
  const maxRequests = 10       // 10 requests per minute per IP

  if (!requests.has(ip)) {
    requests.set(ip, [])
  }

  const timestamps = requests.get(ip).filter(t => now - t < windowMs)
  timestamps.push(now)
  requests.set(ip, timestamps)

  if (timestamps.length > maxRequests) {
    return res.status(429).json({ error: 'Too many requests — slow down' })
  }

  // API key
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' })
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error: ' + err.message })
  }
}