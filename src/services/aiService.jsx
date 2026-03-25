// ─────────────────────────────────────────────────────────
// API key lives on the server only (api/groq.js)
// This file never touches the key — safe in browser
// ─────────────────────────────────────────────────────────

const buildROIPrompt = ({ certName, currentSalary, certCost, hikePercent, isStudent }) => {
  const annualSalary    = currentSalary * 100000
  const hikedSalary     = annualSalary * (1 + hikePercent / 100)
  const annualGain      = hikedSalary - annualSalary
  const breakEvenMonths = annualGain > 0 ? Math.ceil((certCost * 100000) / (annualGain / 12)) : 0
  const fiveYearGain    = annualGain * 5 - certCost * 100000

  const context = isStudent
    ? `STUDENT with no salary, targeting first job in India. Cert: ${certName}. Goal: first offer Rs.4.8L+.`
    : `Salary: Rs.${currentSalary}L/yr going to Rs.${(hikedSalary / 100000).toFixed(1)}L. Cost: Rs.${certCost}L. Break-even: ${breakEvenMonths} months. 5yr net: Rs.${(fiveYearGain / 100000).toFixed(1)}L.`

  return `You are CertifyROI, a brutally honest career advisor for Indian tech professionals (2026).
${context}
Certification: ${certName || 'General IT Certification'}

Reply in EXACTLY this format, no extra text:

**VERDICT:** [Strong ROI / Moderate ROI / Weak ROI - one sentence with % and timeline]

**BREAK-EVEN:** [X months - real-world India anchor e.g. = 6 months Pune PG rent]

**5-YEAR PROJECTION:** [Rs.X.XL - anchor e.g. = Honda City down payment twice over]

**MARKET DEMAND (India 2026):**
- [specific Naukri/LinkedIn demand signal with number]
- [top 2 hiring companies in India]
- [YoY growth signal]

**RISKS:**
- [biggest real risk]
- [how to mitigate it]

**STUDENT FAST-TRACK:** ${isStudent ? '[3 concrete steps + timeline to Rs.4.8L]' : '[N/A]'}

**BOTTOM LINE:** [one punchy action sentence - be direct]

Under 260 words. India-specific. No fluff.`
}

const parseROIResponse = (text) => {
  const get = (p) => { const m = text.match(p); return m ? m[1].trim() : '' }

  // Fix: match both • and - bullet styles from AI
  const getBullets = (p) => {
    const m = text.match(p)
    if (!m) return []
    return m[1]
      .split('\n')
      .filter(l => l.trim().match(/^[•\-\*]/))
      .map(l => l.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean)
  }

  return {
    verdict:      get(/\*\*VERDICT:\*\*\s*(.+?)(?=\n\*\*|\n\n|$)/s),
    breakEven:    get(/\*\*BREAK-EVEN:\*\*\s*(.+?)(?=\n\*\*|\n\n|$)/s),
    projection:   get(/\*\*5-YEAR PROJECTION:\*\*\s*(.+?)(?=\n\*\*|\n\n|$)/s),
    demand:       getBullets(/\*\*MARKET DEMAND.*?\*\*\s*([\s\S]+?)(?=\n\*\*RISKS)/s),
    risks:        getBullets(/\*\*RISKS:\*\*\s*([\s\S]+?)(?=\n\*\*STUDENT|\n\*\*BOTTOM)/s),
    studentTrack: get(/\*\*STUDENT FAST-TRACK:\*\*\s*(.+?)(?=\n\*\*|\n\n|$)/s).replace('[N/A]', '').trim(),
    bottomLine:   get(/\*\*BOTTOM LINE:\*\*\s*(.+?)(?=\n\*\*|\n\n|$)/s),
    raw: text,
  }
}

// ── Core fetch — hits /api/groq server endpoint ───────────
const callGroq = async (messages, maxTokens = 700, temperature = 0.65) => {
  const response = await fetch('/api/groq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const msg = err?.error?.message || err?.error || 'HTTP ' + response.status
    if (response.status === 401) throw new Error('Invalid API key — check GROQ_API_KEY in .env')
    if (response.status === 403) throw new Error('Access denied — check GROQ_API_KEY in .env')
    if (response.status === 429) throw new Error('Rate limit — wait 30 seconds and retry')
    if (response.status === 404) throw new Error('API endpoint not found — run: vercel dev (not npm run dev)')
    if (response.status === 500) throw new Error('Server error — GROQ_API_KEY may not be set in .env')
    throw new Error(msg)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''
  if (!text) throw new Error('Empty response from AI')
  return text
}

// ── Public exports ────────────────────────────────────────
export const analyzeROI = async ({ certName, currentSalary, certCost, hikePercent, isStudent = false }) => {
  const text = await callGroq(
    [
      { role: 'system', content: 'You are CertifyROI. Respond ONLY in the exact format requested. India market 2026.' },
      { role: 'user',   content: buildROIPrompt({ certName, currentSalary, certCost, hikePercent, isStudent }) },
    ],
    700,
    0.65
  )
  return parseROIResponse(text)
}

export const callGroqForPitch = async (_unusedApiKey, prompt) => {
  return callGroq(
    [{ role: 'user', content: prompt }],
    450,
    0.72
  )
}

export const callGroqForResume = async (_unusedApiKey, prompt) => {
  return callGroq(
    [
      { role: 'system', content: 'You are CertifyROI. Follow format exactly. India market 2026. No extra text.' },
      { role: 'user',   content: prompt },
    ],
    800,
    0.62
  )
}

export const getMockResponse = ({ certName, currentSalary, certCost, hikePercent, isStudent }) => {
  const annualGain      = currentSalary * 100000 * hikePercent / 100
  const breakEvenMonths = annualGain > 0 ? Math.ceil((certCost * 100000) / (annualGain / 12)) : 0
  const fiveYearGain    = ((annualGain * 5 - certCost * 100000) / 100000).toFixed(1)
  return {
    verdict:      `Strong ROI — ${certName} projected +${hikePercent}% hike, break-even in ${breakEvenMonths} months`,
    breakEven:    `${breakEvenMonths} months — roughly ${Math.round(breakEvenMonths * 1.3)} months of Bangalore PG rent`,
    projection:   `Rs.${fiveYearGain}L net over 5 years`,
    demand:       ['2,400+ open roles on Naukri right now', 'Top hirers: TCS, Infosys, Wipro, Accenture', 'Demand up 34% YoY per LinkedIn'],
    risks:        ['Cert alone is not enough — build 2 portfolio projects', 'Budget 3 months of real study, not 3 weeks'],
    studentTrack: isStudent ? 'Step 1: Complete cert in 4 months. Step 2: Build 2 GitHub projects. Step 3: Apply to Capgemini iON for Rs.4.8L offer.' : '',
    bottomLine:   'Run: vercel dev (not npm run dev) to enable the API proxy locally.',
    raw:          '(demo)',
  }
}