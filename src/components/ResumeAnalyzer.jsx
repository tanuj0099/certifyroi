import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, X, Sparkles, AlertTriangle,
  ChevronRight, Star, ChevronDown, ArrowRight,
  RefreshCw, User
} from 'lucide-react'
import { GOAL_OPTIONS, CERT_DOMAINS } from '../tokens.js'
import { callGroqForResume } from '../services/aiService.jsx'
import NeonCard from './NeonCard.jsx'

const PICTON  = '#51B1E7'
const EMERALD = '#10B981'
const AMBER   = '#F59E0B'

const validateDocument = (text) => {
  const t    = text.toLowerCase()
  const tRaw = text
  const hardRejectRules = [
    { label: 'fee receipt',    patterns: ['fee receipt', 'bill no', 'gst no'],                        min: 2 },
    { label: 'fee receipt',    patterns: ['annual fee', 'total amount', 'amount in words'],           min: 2 },
    { label: 'fee receipt',    patterns: ['billdesk', 'mode of transfer', 'total amount'],            min: 2 },
    { label: 'hall ticket',    patterns: ['hall ticket', 'reporting time', 'invigilator'],            min: 2 },
    { label: 'hall ticket',    patterns: ['examination hall', 'course code', 'reporting time'],       min: 2 },
    { label: 'hall ticket',    patterns: ['reg.no:', 'exam time', 'venue'],                           min: 3 },
    { label: 'question paper', patterns: ['total marks', 'section a', 'section b'],                  min: 3 },
    { label: 'question paper', patterns: ['each carries', 'answer any', 'marks)'],                   min: 2 },
    { label: 'question paper', patterns: ['q1.', 'q2.', 'q3.'],                                      min: 3 },
    { label: 'study notes',    patterns: ['last minute revision', 'formula sheet'],                  min: 1 },
    { label: 'study notes',    patterns: ['master formula', 'traps to avoid'],                       min: 1 },
    { label: 'study notes',    patterns: ['leptokurtic', 'platykurtic', 'mesokurtic'],               min: 1 },
    { label: 'study notes',    patterns: ['karl pearson r =', 'spearman ρ =', 'laspeyres'],          min: 1 },
    { label: 'assignment',     patterns: ['submitted to', 'submitted by', 'assistant professor'],    min: 2 },
    { label: 'technical doc',  patterns: ['select * from', 'sql query', 'database schema'],          min: 1 },
    { label: 'technical doc',  patterns: ['driver_id', 'trip_id', 'rider_id'],                       min: 2 },
    { label: 'research report',patterns: ['null hypothesis', 'p-value', 'chi-square', 'anova'],      min: 3 },
    { label: 'academic paper', patterns: ['table of contents', 'literature review', 'bibliography'], min: 2 },
  ]
  for (const rule of hardRejectRules) {
    const matches = rule.patterns.filter(p => t.includes(p))
    if (matches.length >= rule.min) return { isResume: false, rejectedBy: rule.label, score: 0 }
  }
  let score = 0
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(tRaw)) score += 3
  if (/(\+91[\s\-]?)?[6-9]\d{9}/.test(tRaw))                          score += 3
  if (t.includes('linkedin'))                                            score += 3
  const sections = ['education','experience','skills','projects','achievements','certifications','volunteering','leadership','internship','employment history','work experience','extracurricular','awards','publications','languages']
  const sectionHits = sections.filter(s => t.includes(s))
  score += sectionHits.length * 1.5
  if (sectionHits.length >= 3) score += 2
  const degrees = ['bba','mba','b.tech','btech','m.tech','mtech','bsc','msc','bca','mca','bcom','mcom','pgdm','diploma','cbse','icse']
  if (degrees.filter(d => t.includes(d)).length >= 1) score += 2
  const institutions = ['university','college','institute','iit','nit','bits','vit','srm','manipal','christ','symbiosis','amity']
  if (institutions.filter(i => t.includes(i)).length >= 1) score += 1
  if (/\b20\d{2}\s*[–\-]\s*(20\d{2}|present)/i.test(tRaw)) score += 2
  if (/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*'?\d{2,4}/i.test(tRaw)) score += 1
  const actionVerbs = ['managed','led ','developed','built ','handled','coordinated','organized','achieved','launched','mentored','conducted','reduced','increased','collaborated','spearheaded','implemented','delivered','designed','created','trained','secured','boosted']
  const verbHits = actionVerbs.filter(v => t.includes(v))
  if (verbHits.length >= 2) score += 2
  if (verbHits.length >= 4) score += 1
  const tools = ['excel','powerpoint','canva','python','java','sql','tableau','figma','aws','azure','docker','git','tally','powerbi']
  if (tools.filter(t2 => t.includes(t2)).length >= 2) score += 2
  const firstLine = tRaw.split('\n')[0].trim()
  if (firstLine.length > 3 && firstLine.length < 60 && /^[A-Z][a-zA-Z\s]+$/.test(firstLine)) score += 1
  if (text.trim().length < 150) return { isResume: false, rejectedBy: 'too short', score }
  return { isResume: score >= 8, score, sectionHits, verbHits }
}

const readPdfFile = async (file) => {
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script   = document.createElement('script')
      script.src     = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
      script.onload  = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
  const arrayBuffer = await file.arrayBuffer()
  const pdf         = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i)
    const content = await page.getTextContent()
    fullText += content.items.map(item => item.str).join(' ') + '\n'
  }
  return fullText.trim()
}

const buildPrompt = (resumeText, mode, goal, domain) => {
  const goalLabel   = GOAL_OPTIONS.find(g => g.id === goal)?.label?.replace(/^[^\s]+\s/, '') || goal
  const domainLabel = CERT_DOMAINS.find(d => d.id === domain)?.label || domain
  return `You are CertifyROI, a career advisor for Indian professionals (2026).
User mode: ${mode}
Goal: ${goalLabel}
Domain preference: ${domainLabel}

Resume/Profile:
${resumeText.slice(0, 2200)}

Reply in EXACTLY this format, no extra text:

**NAME:** [person's full name from resume, or "Not found"]

**PROFILE SUMMARY:** 2-3 sentences about their current role, years of experience, domain expertise, and biggest career opportunity right now — be specific, not generic

**CITY:** [detected city from resume, or "Not specified"]

**DOMAIN:** [primary domain: tech/data/management/business/finance/marketing/product/design/hr]

**SKILL GAPS:**
- most critical gap for their stated goal with specific context
- second gap relevant to their background
- third gap that would accelerate their career

**TOP CERT #1 (PRIMARY MOVE):**
Name: exact certification name
Why: specific reason tied to their actual resume content AND goal
ROI: expected salary hike % for India
Timeline: X months
Fast Track: one concrete actionable first step with platform or resource name

**TOP CERT #2:**
Name: exact certification name
Why: specific reason
ROI: hike %
Timeline: X months
Fast Track: one concrete first step

**TOP CERT #3:**
Name: exact certification name
Why: specific reason
ROI: hike %
Timeline: X months
Fast Track: one concrete first step

**IMMEDIATE ACTION:** one specific thing to do THIS WEEK with platform or resource name

**MARKET INSIGHT:** one specific sentence about current India market demand for their top cert in their city right now

Under 380 words. India-specific. Be specific to their resume, not generic.`
}

const parseResponse = (text) => {
  const get = (pattern) => { const m = text.match(pattern); return m ? m[1].trim() : '' }
  const getBullets = (pattern) => {
    const m = text.match(pattern)
    if (!m) return []
    return m[1].split('\n').filter(l => l.trim().match(/^[•\-\*]/)).map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean)
  }
  const certs = []
  for (let i = 1; i <= 3; i++) {
    const block = text.match(new RegExp(`\\*\\*TOP CERT #${i}.*?\\*\\*([\\s\\S]+?)(?=\\*\\*TOP CERT #${i+1}|\\*\\*IMMEDIATE|$)`))
    if (block) {
      const b = block[1]
      certs.push({
        name:      (b.match(/Name:\s*(.+)/)      || [])[1]?.trim() || '',
        why:       (b.match(/Why:\s*(.+)/)        || [])[1]?.trim() || '',
        roi:       (b.match(/ROI:\s*(.+)/)        || [])[1]?.trim() || '',
        timeline:  (b.match(/Timeline:\s*(.+)/)   || [])[1]?.trim() || '',
        fastTrack: (b.match(/Fast Track:\s*(.+)/) || [])[1]?.trim() || '',
        primary:   i === 1,
      })
    }
  }
  const nameRaw   = get(/\*\*NAME:\*\*\s*(.+?)(?=\n\*\*|\n\n|$)/s)
  const name      = (nameRaw === 'Not found' || !nameRaw) ? '' : nameRaw.split(' ').slice(0, 2).join(' ')
  const cityRaw   = get(/\*\*CITY:\*\*\s*(.+?)(?=\n\*\*|\n\n|$)/s)
  const INDIA_CITIES = ['Bangalore','Bengaluru','Hyderabad','Pune','Mumbai','Delhi','Chennai','Kolkata','Noida','Gurgaon','Gurugram','Ahmedabad','Kochi','Vadodara','Jaipur']
  const city      = INDIA_CITIES.find(c => cityRaw.toLowerCase().includes(c.toLowerCase())) || ''
  const domainRaw = get(/\*\*DOMAIN:\*\*\s*(.+?)(?=\n\*\*|\n\n|$)/s).toLowerCase()
  const domainMap = ['tech','data','management','business','finance','marketing','product','design','hr']
  const domain    = domainMap.find(k => domainRaw.includes(k)) || 'business'
  return {
    name, summary: get(/\*\*PROFILE SUMMARY:\*\*\s*(.+?)(?=\n\*\*|\n\n|$)/s),
    city, domain,
    gaps:            getBullets(/\*\*SKILL GAPS:\*\*\s*([\s\S]+?)(?=\n\*\*TOP CERT)/s),
    certs:           certs.filter(c => c.name),
    immediateAction: get(/\*\*IMMEDIATE ACTION:\*\*\s*(.+?)(?=\n\*\*|\n\n|$)/s),
    marketInsight:   get(/\*\*MARKET INSIGHT:\*\*\s*(.+?)(?=\n\*\*|\n\n|$)/s),
    raw:             text,
  }
}

const Dropdown = ({ label, value, onChange, options }) => {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.id === value)
  return (
    <div style={{ position: 'relative', marginBottom: '12px' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{label}</div>
      <button onClick={() => setOpen(v => !v)}
        style={{ width: '100%', padding: '10px 13px', background: 'var(--bg)', border: '1px solid ' + (open ? PICTON + '55' : 'var(--border)'), borderRadius: '9px', color: 'var(--text)', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'border-color 0.18s' }}>
        <span>{selected?.label || 'Select...'}</span>
        <ChevronDown size={13} color="var(--text-4)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
            style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: '4px', borderRadius: '9px', background: 'var(--surface)', border: '1px solid ' + PICTON + '33', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.25)', maxHeight: '220px', overflowY: 'auto' }}>
            {options.map(opt => (
              <button key={opt.id} onClick={() => { onChange(opt.id); setOpen(false) }}
                style={{ width: '100%', padding: '9px 13px', background: value === opt.id ? PICTON + '12' : 'transparent', border: 'none', color: value === opt.id ? PICTON : 'var(--text-3)', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left', transition: 'background 0.12s' }}
                onMouseEnter={e => { if (value !== opt.id) e.currentTarget.style.background = 'var(--surface-high)' }}
                onMouseLeave={e => { if (value !== opt.id) e.currentTarget.style.background = 'transparent' }}>
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const CertCard = ({ cert, index, onSelect }) => (
  <NeonCard color={cert.primary ? EMERALD : PICTON} delay={index * 0.2} speed={0.02} borderRadius="12px" style={{ marginBottom: '12px' }}>
    <div style={{ padding: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          {cert.primary && <Star size={13} color={EMERALD} fill={EMERALD} style={{ flexShrink: 0 }} />}
          <span style={{ fontSize: '15px', fontWeight: '800', color: cert.primary ? EMERALD : 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em' }}>{cert.name}</span>
        </div>
        {cert.primary && (
          <span style={{ fontSize: '9px', padding: '3px 8px', borderRadius: '8px', background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.3)', color: EMERALD, fontWeight: '700', letterSpacing: '0.06em', whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0, marginLeft: '8px' }}>
            PRIMARY MOVE
          </span>
        )}
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '12px', lineHeight: '1.65', fontFamily: 'Inter, sans-serif' }}>{cert.why}</p>
      <div style={{ display: 'flex', alignItems: 'stretch', marginBottom: '12px', borderRadius: '9px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div style={{ flex: 1, padding: '10px 12px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Hike</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '16px', color: EMERALD, fontWeight: '700', letterSpacing: '-0.02em' }}>+{cert.roi}</div>
        </div>
        <div style={{ flex: 1, padding: '10px 12px', textAlign: 'center', borderRight: cert.fastTrack ? '1px solid var(--border)' : 'none' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Study Time</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '16px', color: PICTON, fontWeight: '700', letterSpacing: '-0.02em' }}>{cert.timeline}</div>
        </div>
        {cert.fastTrack && (
          <div style={{ flex: 2, padding: '10px 12px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>This Week</div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif', lineHeight: '1.45' }}>{cert.fastTrack}</div>
          </div>
        )}
      </div>
      {onSelect && (
        <motion.button onClick={() => onSelect(cert.name)} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
          style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: cert.primary ? 'linear-gradient(135deg, ' + EMERALD + ', #0DA271)' : 'linear-gradient(135deg, ' + PICTON + ', #3B8CC7)', color: 'white', fontSize: '14px', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: cert.primary ? '0 4px 18px rgba(16,185,129,0.35)' : '0 4px 18px rgba(81,177,231,0.3)', letterSpacing: '-0.01em' }}>
          <Sparkles size={14} />
          {'Calculate ROI — ' + cert.name.split(' ').slice(0, 3).join(' ')}
          <ArrowRight size={14} />
        </motion.button>
      )}
    </div>
  </NeonCard>
)

const NotAResumeError = ({ rejectedBy, onDismiss }) => {
  const messages = {
    'fee receipt':    { emoji: '🧾', title: "That's a fee receipt, not a resume", desc: "We found payment details, bill numbers, and fee amounts. Please upload your CV or resume instead." },
    'hall ticket':    { emoji: '🎫', title: "That's an exam hall ticket", desc: "We can see exam schedules, course codes, and invigilator details. Please upload your resume or LinkedIn profile." },
    'question paper': { emoji: '📝', title: "That looks like a question paper", desc: "We found exam sections, marks allocation, and question numbers. Please upload your actual resume." },
    'study notes':    { emoji: '📚', title: "These look like study notes", desc: "We found revision formulas, theory questions, and exam prep content. Please upload your resume or CV." },
    'assignment':     { emoji: '📄', title: "That's a college assignment", desc: "We found professor details, submission info, and assignment content. Please upload your personal resume." },
    'technical doc':  { emoji: '💾', title: "That's a technical document", desc: "We found code, database schemas, or SQL queries. Please upload your resume instead." },
    'research report':{ emoji: '📊', title: "That's a research or analysis report", desc: "We found statistical analysis, methodology, or research content. Please upload your personal resume." },
    'academic paper': { emoji: '🎓', title: "That's an academic paper", desc: "We found abstract, bibliography, and literature review sections. Please upload your resume." },
    'too short':      { emoji: '🤔', title: "That seems too short to be a resume", desc: "Please paste more of your profile — work experience, education, and skills." },
    default:          { emoji: '🤔', title: "Uh oh — that doesn't look like a resume", desc: "We need your work experience, education, skills, and contact details to give you accurate cert recommendations." },
  }
  const msg = messages[rejectedBy] || messages.default
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{ padding: '24px', borderRadius: '14px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', textAlign: 'center' }}>
      <motion.div animate={{ rotate: [0, -10, 10, -6, 6, 0] }} transition={{ duration: 0.5, delay: 0.1 }} style={{ fontSize: '2.8rem', marginBottom: '12px' }}>{msg.emoji}</motion.div>
      <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '1.15rem', color: '#FCA5A5', marginBottom: '8px' }}>{msg.title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif', lineHeight: '1.65', marginBottom: '16px' }}>{msg.desc}</p>
      <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
        {['Your CV / Resume', 'LinkedIn profile text', 'Work experience summary', 'Skills + Education'].map((hint, i) => (
          <span key={i} style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5', fontFamily: 'JetBrains Mono, monospace' }}>{hint}</span>
        ))}
      </div>
      <button onClick={onDismiss} style={{ padding: '9px 20px', borderRadius: '8px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Try a different file
      </button>
    </motion.div>
  )
}

const ScanningBeam = ({ name }) => {
  const [scanY, setScanY] = useState(0)
  const [chars, setChars] = useState([])
  const [step,  setStep]  = useState(0)
  const greeting = name ? ('Analysing ' + name.split(' ')[0] + "'s profile...") : 'Reading resume content...'
  const steps = [greeting, 'Identifying skill profile...', 'Matching India job market 2026...', 'Ranking certification ROI...', 'Writing personalised recommendation...']

  useEffect(() => {
    const s1 = setInterval(() => setScanY(v => (v + 1.2) % 100), 16)
    const s2 = setInterval(() => setChars(Array.from({ length: 12 }, () => String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)))), 80)
    const ts = steps.map((_, i) => setTimeout(() => setStep(i), i * 900))
    return () => { clearInterval(s1); clearInterval(s2); ts.forEach(clearTimeout) }
  }, [])

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid ' + PICTON + '22', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 1px 0 var(--card-highlight)' }}>
      {[{ top: 7, left: 7, borderTop: '2px solid ' + PICTON, borderLeft: '2px solid ' + PICTON }, { top: 7, right: 7, borderTop: '2px solid ' + PICTON, borderRight: '2px solid ' + PICTON }, { bottom: 7, left: 7, borderBottom: '2px solid ' + PICTON, borderLeft: '2px solid ' + PICTON }, { bottom: 7, right: 7, borderBottom: '2px solid ' + PICTON, borderRight: '2px solid ' + PICTON }].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 12, height: 12, ...s }} />
      ))}
      <div style={{ position: 'absolute', left: 0, right: 0, top: scanY + '%', height: '1.5px', background: 'linear-gradient(90deg, transparent, ' + PICTON + ', transparent)', boxShadow: '0 0 8px ' + PICTON, pointerEvents: 'none', transition: 'top 0.016s linear' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid ' + PICTON, borderTopColor: 'transparent', flexShrink: 0 }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: PICTON, letterSpacing: '0.08em' }}>RESUME ENGINE / PROCESSING</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-4)' }}>{Math.round(((step + 1) / steps.length) * 100)}%</span>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: PICTON + '33', letterSpacing: '0.2em', marginBottom: '12px', height: '15px', overflow: 'hidden' }}>{chars.join(' ')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '12px' }}>
        {steps.map((s, i) => {
          if (i > step) return null
          const done = i < step; const active = i === step
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <div style={{ width: 20, height: 20, borderRadius: '5px', flexShrink: 0, background: done ? 'rgba(16,185,129,0.12)' : active ? PICTON + '14' : 'var(--bg)', border: '1px solid ' + (done ? 'rgba(16,185,129,0.3)' : active ? PICTON + '44' : 'var(--border)'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: done ? EMERALD : active ? PICTON : 'var(--text-4)' }}>
                {done ? '✓' : active ? '›' : '·'}
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: done ? 'var(--text-4)' : active ? 'var(--text)' : 'var(--text-4)', textDecoration: done ? 'line-through' : 'none' }}>{s}</span>
              {active && <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: 4, height: 4, borderRadius: '50%', background: PICTON, marginLeft: 'auto', flexShrink: 0 }} />}
            </motion.div>
          )
        })}
      </div>
      <div style={{ height: '2px', borderRadius: '1px', background: 'var(--border)', overflow: 'hidden' }}>
        <motion.div animate={{ width: Math.round(((step + 1) / steps.length) * 100) + '%' }} transition={{ duration: 0.4, ease: 'easeOut' }} style={{ height: '100%', background: 'linear-gradient(90deg, ' + PICTON + ', #818CF8)', borderRadius: '1px' }} />
      </div>
      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[70, 55, 65, 45].map((w, i) => <div key={i} className="shimmer" style={{ height: '10px', width: w + '%', borderRadius: '4px' }} />)}
      </div>
    </div>
  )
}

const ResumeAnalyzer = ({ mode = 'professional', onCertSelected }) => {
  const [text,         setText]         = useState('')
  const [fileName,     setFileName]     = useState('')
  const [goal,         setGoal]         = useState('salary-hike')
  const [domain,       setDomain]       = useState('all')
  const [loading,      setLoading]      = useState(false)
  const [result,       setResult]       = useState(null)
  const [error,        setError]        = useState(null)
  const [rejection,    setRejection]    = useState(null)
  const [dragging,     setDragging]     = useState(false)
  const [detectedName, setDetectedName] = useState('')
  const [pdfLoading,   setPdfLoading]   = useState(false)
  const fileRef = useRef(null)

  const hasFile   = !!fileName
  const hasTyped  = !hasFile && text.trim().length > 0
  const hasResult = !!result

  const readFile = async (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    setError(null); setRejection(null)
    if (ext === 'pdf') {
      setFileName(file.name); setText(''); setPdfLoading(true)
      try {
        const extracted = await readPdfFile(file)
        if (!extracted) { setError('Could not extract text from PDF. Please paste your resume text below.'); setFileName(''); return }
        setText(extracted)
      } catch (e) {
        console.error('PDF error:', e)
        setError('PDF parsing failed. Please paste your resume text below.')
        setFileName('')
      } finally { setPdfLoading(false) }
      return
    }
    setFileName(file.name); setText('')
    const reader = new FileReader()
    reader.onload  = (e) => setText(e.target.result || '')
    reader.onerror = () => setError('Could not read file. Try pasting text instead.')
    reader.readAsText(file)
  }

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); readFile(e.dataTransfer.files[0]) }
  const clearAll   = () => { setText(''); setFileName(''); setResult(null); setError(null); setRejection(null); setDetectedName('') }

  const handleAnalyse = async () => {
    if (!text.trim()) { setError('Please upload a file or paste your resume text'); return }
    const validation = validateDocument(text)
    if (!validation.isResume) { setRejection(validation.rejectedBy || 'default'); return }
    setLoading(true); setResult(null); setError(null); setRejection(null)
    try {
      const safeText = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').slice(0, 2200).trim()
      const raw      = await callGroqForResume(null, buildPrompt(safeText, mode, goal, domain))
      if (!raw || raw.length < 30) throw new Error('Empty response — try again')
      const parsed = parseResponse(raw)
      if (parsed.name) setDetectedName(parsed.name)
      setResult(parsed.certs?.length ? parsed : { name: parsed.name, summary: 'Analysis complete', city: '', domain: 'business', gaps: [], certs: [], immediateAction: raw, marketInsight: '', raw })
    } catch (e) {
      console.error('Resume AI error:', e)
      if (e.message?.includes('not configured') || e.message?.includes('500') || e.message?.includes('404') || e.message === 'NO_KEY') {
        const demo = {
          name: 'Demo', summary: 'AI not connected. Check GROQ_API_KEY in Vercel environment variables.', city: 'Bangalore', domain: 'tech',
          gaps: ['No hands-on cloud portfolio projects', 'Missing architecture-level certifications', 'Limited DevOps exposure'],
          certs: [
            { name: 'AWS Solutions Architect', why: 'Highest ROI for Indian tech professionals — 2,400+ open roles on Naukri', roi: '30-40%', timeline: '3 months', fastTrack: 'Register free on AWS Skill Builder today', primary: true },
            { name: 'Google Data Analytics',   why: 'High demand, entry-friendly, complements most backgrounds', roi: '20-28%', timeline: '4 months', fastTrack: 'Enrol on Coursera — first 7 days free', primary: false },
            { name: 'PMP Certification',        why: 'Best path to senior management track', roi: '25-30%', timeline: '6 months', fastTrack: "Download PMI's free Exam Content Outline PDF", primary: false },
          ],
          immediateAction: 'Check Vercel → Settings → Environment Variables → ensure GROQ_API_KEY is set.',
          marketInsight: 'AWS certified professionals in Bangalore command 35% higher salaries — 2,400+ active roles on Naukri as of March 2026.',
          raw: '(demo)',
        }
        setDetectedName('Demo'); setResult(demo)
      } else {
        setError(e.message || 'Unknown error. Check browser console F12.')
      }
    } finally { setLoading(false) }
  }

  const firstName = detectedName ? detectedName.split(' ')[0] : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      <AnimatePresence>
        {!hasResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Dropdown label="What do you want to achieve?" value={goal}   onChange={setGoal}   options={GOAL_OPTIONS} />
            <Dropdown label="Preferred career domain"        value={domain} onChange={setDomain} options={CERT_DOMAINS} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!hasTyped && !hasResult && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
            <NeonCard color={dragging ? PICTON : hasFile ? EMERALD : 'var(--text-4)'} speed={0.022} borderRadius="11px">
              <div onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} onClick={() => !hasFile && fileRef.current?.click()} style={{ padding: '22px', cursor: hasFile ? 'default' : 'pointer', textAlign: 'center' }}>
                <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => readFile(e.target.files[0])} />
                {pdfLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${PICTON}`, borderTopColor: 'transparent', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: PICTON, fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '600' }}>Reading PDF...</span>
                  </div>
                ) : hasFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <FileText size={15} color={EMERALD} />
                    <span style={{ fontSize: '13px', color: EMERALD, fontWeight: '600', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{fileName}</span>
                    <button onClick={e => { e.stopPropagation(); clearAll() }} style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer' }}><X size={13} /></button>
                  </div>
                ) : (
                  <>
                    <Upload size={24} color="var(--text-4)" style={{ margin: '0 auto 10px', display: 'block' }} />
                    <div style={{ fontSize: '14px', color: 'var(--text-3)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '600', marginBottom: '4px' }}>
                      Drop resume here or <span style={{ color: PICTON, textDecoration: 'underline' }}>browse</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>PDF, .txt, .doc accepted</div>
                  </>
                )}
              </div>
            </NeonCard>
          </motion.div>
        )}
      </AnimatePresence>

      {!hasFile && !hasTyped && !hasResult && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>or paste below</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
      )}

      <AnimatePresence>
        {!hasFile && !hasResult && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden', position: 'relative' }}>
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="Paste your resume, LinkedIn About section, or work experience here. Include your city for better results."
              rows={6}
              style={{ width: '100%', padding: '14px', background: 'var(--bg)', border: '1px solid ' + (hasTyped ? PICTON + '44' : 'var(--border)'), borderRadius: '11px', color: 'var(--text)', fontSize: '13px', fontFamily: 'Inter, sans-serif', outline: 'none', resize: 'vertical', lineHeight: '1.6', transition: 'border-color 0.18s' }} />
            {hasTyped && (
              <>
                <button onClick={clearAll} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer' }}><X size={13} /></button>
                <div style={{ position: 'absolute', bottom: '10px', right: '12px', fontSize: '10px', color: 'var(--text-4)', fontFamily: 'JetBrains Mono, monospace' }}>{text.length}c</div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejection && <NotAResumeError rejectedBy={rejection} onDismiss={() => { setRejection(null); clearAll() }} />}
      </AnimatePresence>

      {!hasResult && (
        loading ? <ScanningBeam name={detectedName} /> : (
          <motion.button onClick={handleAnalyse} disabled={!text.trim()} whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }}
            style={{ width: '100%', fontSize: '15px', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', background: !text.trim() ? 'var(--surface)' : 'linear-gradient(135deg, ' + PICTON + ', #3B8CC7)', border: 'none', borderRadius: '12px', color: !text.trim() ? 'var(--text-4)' : 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', cursor: !text.trim() ? 'not-allowed' : 'pointer', boxShadow: !text.trim() ? 'none' : '0 4px 20px rgba(81,177,231,0.3)', letterSpacing: '-0.01em', transition: 'all 0.2s' }}>
            <Sparkles size={16} />
            Analyse My Resume with AI
          </motion.button>
        )
      )}

      {error && (
        <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: '#FCA5A5', display: 'flex', gap: '8px', alignItems: 'flex-start', fontFamily: 'Inter, sans-serif' }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '1px' }} /><span>{error}</span>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

            {firstName && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '14px' }}>
                <User size={16} color="#818CF8" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '14px', color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '600' }}>
                  Hey <span style={{ color: '#818CF8' }}>{firstName}</span> 👋 — here is your personalised cert roadmap
                </div>
              </motion.div>
            )}

            {result.summary && (
              <NeonCard color={PICTON} speed={0.014} borderRadius="12px" style={{ marginBottom: '14px' }}>
                <div style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '8px', background: PICTON + '14', border: '1px solid ' + PICTON + '28', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={13} color={PICTON} />
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: PICTON, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {firstName ? ('PROFILE ANALYSIS — ' + firstName.toUpperCase()) : 'PROFILE ANALYSIS'}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-2)', fontFamily: 'Inter, sans-serif', lineHeight: '1.75', marginBottom: '12px' }}>{result.summary}</div>
                  {(result.city || result.domain) && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {result.city   && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', background: PICTON + '14', border: '1px solid ' + PICTON + '28', color: PICTON, fontFamily: 'JetBrains Mono, monospace' }}>{'📍 ' + result.city}</span>}
                      {result.domain && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', background: EMERALD + '14', border: '1px solid ' + EMERALD + '28', color: EMERALD, fontFamily: 'JetBrains Mono, monospace' }}>{'🎯 ' + (CERT_DOMAINS.find(d => d.id === result.domain)?.label || result.domain)}</span>}
                    </div>
                  )}
                </div>
              </NeonCard>
            )}

            {result.gaps?.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: AMBER, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <AlertTriangle size={10} color={AMBER} />
                  {firstName ? ('SKILL GAPS FOR ' + firstName.toUpperCase()) : 'SKILL GAPS TO CLOSE'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                  {result.gaps.map((g, i) => (
                    <span key={i} style={{ fontSize: '12px', padding: '4px 11px', borderRadius: '7px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: AMBER, fontFamily: 'Inter, sans-serif' }}>{g}</span>
                  ))}
                </div>
              </div>
            )}

            {result.certs.length > 0 && (
              <>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                  {firstName ? (firstName.toUpperCase() + "'S CERT ROADMAP — CLICK TO CALCULATE ROI") : 'RECOMMENDED CERTIFICATIONS — CLICK TO CALCULATE ROI'}
                </div>
                {result.certs.map((cert, i) => (
                  <CertCard key={i} cert={cert} index={i} onSelect={onCertSelected ? (name) => onCertSelected(name, result.city, result.domain, result.name) : null} />
                ))}
              </>
            )}

            {result.immediateAction && (
              <NeonCard color={EMERALD} speed={0.016} borderRadius="11px" style={{ marginBottom: '10px' }}>
                <div style={{ padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <ChevronRight size={15} color={EMERALD} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: EMERALD, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>
                      {firstName ? (firstName.toUpperCase() + "'S ACTION THIS WEEK") : 'DO THIS WEEK'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-2)', fontFamily: 'Inter, sans-serif', lineHeight: '1.65' }}>{result.immediateAction}</div>
                  </div>
                </div>
              </NeonCard>
            )}

            {result.marketInsight && (
              <div style={{ padding: '13px 15px', borderRadius: '10px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)', display: 'flex', gap: '9px', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', flexShrink: 0 }}>📊</span>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>MARKET INSIGHT</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>{result.marketInsight}</div>
                </div>
              </div>
            )}

            {result.certs.length === 0 && result.immediateAction && result.immediateAction.length > 80 && (
              <NeonCard color={PICTON} speed={0.014} borderRadius="10px" style={{ marginBottom: '14px' }}>
                <div style={{ padding: '14px', fontSize: '13px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{result.immediateAction}</div>
              </NeonCard>
            )}

            <motion.button onClick={clearAll} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-4)', fontSize: '13px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = PICTON + '33'; e.currentTarget.style.color = PICTON }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-4)' }}>
              <RefreshCw size={13} />
              Upload a different resume
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResumeAnalyzer