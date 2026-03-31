import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import {
  Upload, FileText, X, Sparkles, AlertTriangle,
  ChevronRight, Star, ArrowRight,
  RefreshCw, User, TrendingUp, Clock, Zap, Target
} from 'lucide-react'
import { CERTIFICATIONS, CERT_DOMAINS } from '../tokens.js'
import { callGroqForResume } from '../services/aiService.jsx'
import NeonCard from './NeonCard.jsx'

// ── Brand colors (matches rest of app) ────────────────────
const PICTON  = '#51B1E7'
const EMERALD = '#10B981'
const AMBER   = '#F59E0B'
const INDIGO  = '#6366F1'
const VIOLET  = '#818CF8'

const FM = "'JetBrains Mono','Commit Mono',monospace"
const FB = "'Inter',sans-serif"
const FH = "'Plus Jakarta Sans','Bricolage Grotesque',sans-serif"

// ── Document validator (unchanged logic) ──────────────────
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

// ── PDF reader (unchanged) ────────────────────────────────
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

// ── Prompt builder (unchanged logic) ──────────────────────
const buildPrompt = (resumeText, mode) => {
  return `You are CertifyROI, a career advisor for Indian professionals (2026).
User mode: ${mode}

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

// ── Response parser (unchanged logic) ─────────────────────
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

// ── Not-a-resume error (unchanged) ────────────────────────
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
      <h3 style={{ fontFamily: FH, fontWeight: '800', fontSize: '1.15rem', color: '#FCA5A5', marginBottom: '8px' }}>{msg.title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: FB, lineHeight: '1.65', marginBottom: '16px' }}>{msg.desc}</p>
      <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
        {['Your CV / Resume', 'LinkedIn profile text', 'Work experience summary', 'Skills + Education'].map((hint, i) => (
          <span key={i} style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5', fontFamily: FM }}>{hint}</span>
        ))}
      </div>
      <button onClick={onDismiss} style={{ padding: '9px 20px', borderRadius: '8px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: FH }}>
        Try a different file
      </button>
    </motion.div>
  )
}

// ── Scanning beam (minor style polish, same logic) ─────────
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
      {[
        { top: 7, left: 7, borderTop: '2px solid ' + PICTON, borderLeft: '2px solid ' + PICTON },
        { top: 7, right: 7, borderTop: '2px solid ' + PICTON, borderRight: '2px solid ' + PICTON },
        { bottom: 7, left: 7, borderBottom: '2px solid ' + PICTON, borderLeft: '2px solid ' + PICTON },
        { bottom: 7, right: 7, borderBottom: '2px solid ' + PICTON, borderRight: '2px solid ' + PICTON }
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 12, height: 12, ...s }} />
      ))}
      <div style={{ position: 'absolute', left: 0, right: 0, top: scanY + '%', height: '1.5px', background: 'linear-gradient(90deg, transparent, ' + PICTON + ', transparent)', boxShadow: '0 0 8px ' + PICTON, pointerEvents: 'none', transition: 'top 0.016s linear' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid ' + PICTON, borderTopColor: 'transparent', flexShrink: 0 }} />
        <span style={{ fontFamily: FM, fontSize: '10px', color: PICTON, letterSpacing: '0.08em' }}>RESUME ENGINE / PROCESSING</span>
        <span style={{ marginLeft: 'auto', fontFamily: FM, fontSize: '10px', color: 'var(--text-4)' }}>{Math.round(((step + 1) / steps.length) * 100)}%</span>
      </div>
      <div style={{ fontFamily: FM, fontSize: '11px', color: PICTON + '33', letterSpacing: '0.2em', marginBottom: '12px', height: '15px', overflow: 'hidden' }}>{chars.join(' ')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '12px' }}>
        {steps.map((s, i) => {
          if (i > step) return null
          const done = i < step; const active = i === step
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}
              style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <div style={{ width: 20, height: 20, borderRadius: '5px', flexShrink: 0, background: done ? 'rgba(16,185,129,0.12)' : active ? PICTON + '14' : 'var(--bg)', border: '1px solid ' + (done ? 'rgba(16,185,129,0.3)' : active ? PICTON + '44' : 'var(--border)'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: done ? EMERALD : active ? PICTON : 'var(--text-4)' }}>
                {done ? '✓' : active ? '›' : '·'}
              </div>
              <span style={{ fontFamily: FB, fontSize: '12px', color: done ? 'var(--text-4)' : active ? 'var(--text)' : 'var(--text-4)', textDecoration: done ? 'line-through' : 'none' }}>{s}</span>
              {active && <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: 4, height: 4, borderRadius: '50%', background: PICTON, marginLeft: 'auto', flexShrink: 0 }} />}
            </motion.div>
          )
        })}
      </div>
      <div style={{ height: '2px', borderRadius: '1px', background: 'var(--border)', overflow: 'hidden' }}>
        <motion.div animate={{ width: Math.round(((step + 1) / steps.length) * 100) + '%' }} transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, ' + PICTON + ', #818CF8)', borderRadius: '1px' }} />
      </div>
      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[70, 55, 65, 45].map((w, i) => <div key={i} className="shimmer" style={{ height: '10px', width: w + '%', borderRadius: '4px' }} />)}
      </div>
    </div>
  )
}

// ── NEW: Cinematic name + cert hero reveal ─────────────────
// Shows after AI returns — large typographic moment
const PersonalisedHero = ({ name, city, domain, primaryCert, mode }) => {
  const [phase, setPhase] = useState(0)
  // phase 0 = greeting, 1 = domain context, 2 = cert reveal

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 900)
    const t2 = setTimeout(() => setPhase(2), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const domainLabel = CERT_DOMAINS.find(d => d.id === domain)?.label || domain
  const firstName   = name ? name.split(' ')[0] : ''

  // Personalised intro copy
  const intro = firstName
    ? `${firstName}, out of 103 certifications analysed for ${city ? 'a professional in ' + city : 'your profile'} right now —`
    : `For a ${mode === 'student' ? 'student' : mode === 'switcher' ? 'career switcher' : 'professional'} in ${domainLabel} right now —`

  const callout = firstName
    ? 'this is your move.'
    : 'one cert stands clearly above the rest.'

  return (
    <div style={{ marginBottom: '28px' }}>

      {/* Decorative line top */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: '1px', background: 'linear-gradient(90deg, ' + INDIGO + '55, ' + EMERALD + '55, transparent)', marginBottom: '20px', transformOrigin: 'left' }}
      />

      {/* Intro line */}
      <AnimatePresence>
        {phase >= 0 && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: FM, fontSize: '11px', color: 'var(--text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px', lineHeight: 1.6 }}
          >
            {intro}
          </motion.p>
        )}
      </AnimatePresence>

      {/* The CALLOUT — big typographic moment */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '18px' }}
          >
            {/* Multi-color callout text */}
            <div style={{ fontFamily: FH, fontWeight: '800', lineHeight: 1.15, letterSpacing: '-0.025em' }}>
              <span style={{ fontSize: 'clamp(22px, 5vw, 32px)', color: 'var(--text)' }}>{callout.split(' ').slice(0, -1).join(' ')} </span>
              <span style={{
                fontSize: 'clamp(22px, 5vw, 32px)',
                background: 'linear-gradient(135deg, ' + EMERALD + ', ' + PICTON + ', ' + VIOLET + ')',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {callout.split(' ').at(-1)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary cert reveal — the hero element */}
      <AnimatePresence>
        {phase >= 2 && primaryCert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <PrimaryCertHero cert={primaryCert} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── NEW: Primary cert hero card ────────────────────────────
const PrimaryCertHero = ({ cert }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(16,185,129,0.3)',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(81,177,231,0.05) 50%, rgba(99,102,241,0.07) 100%)',
        padding: '22px',
        cursor: 'default',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? '0 0 32px rgba(16,185,129,0.18), 0 8px 32px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.12)',
      }}
    >
      {/* Glow top edge */}
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, ' + EMERALD + '88, ' + PICTON + '88, transparent)', pointerEvents: 'none' }} />

      {/* Primary label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <motion.div
            animate={{ rotate: hovered ? 20 : 0, scale: hovered ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Star size={14} color={EMERALD} fill={EMERALD} />
          </motion.div>
          <span style={{ fontFamily: FM, fontSize: '9px', color: EMERALD, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '700' }}>
            Your Primary Move
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontFamily: FM, fontSize: '9px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: EMERALD }}>
            +{cert.roi}
          </span>
          <span style={{ fontFamily: FM, fontSize: '9px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(81,177,231,0.12)', border: '1px solid rgba(81,177,231,0.25)', color: PICTON }}>
            {cert.timeline}
          </span>
        </div>
      </div>

      {/* Cert name — the hero element */}
      <h2 style={{
        fontFamily: FH,
        fontWeight: '800',
        fontSize: 'clamp(18px, 4vw, 26px)',
        color: 'var(--text)',
        letterSpacing: '-0.025em',
        lineHeight: 1.2,
        marginBottom: '10px',
      }}>
        {cert.name}
      </h2>

      {/* Why text */}
      <p style={{ fontFamily: FB, fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.7, marginBottom: '16px' }}>
        {cert.why}
      </p>

      {/* Fast track */}
      {cert.fastTrack && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '10px 12px', borderRadius: '9px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <Zap size={12} color={VIOLET} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontFamily: FM, fontSize: '8px', color: VIOLET, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>This Week</div>
            <div style={{ fontFamily: FB, fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.5 }}>{cert.fastTrack}</div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ── NEW: Cert leaderboard row (for cert #2 and #3) ─────────
const CertLeaderboardRow = ({ cert, rank, onSelect, mode }) => {
  const [hovered, setHovered] = useState(false)

  const demandColor = cert.primary ? EMERALD : PICTON

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: rank * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onSelect && onSelect(cert.name)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1px solid ' + (hovered ? demandColor + '33' : 'var(--border)'),
        background: hovered ? demandColor + '06' : 'var(--surface)',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all 0.18s ease',
        marginBottom: '8px',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.12)' : 'none',
      }}
    >
      {/* Rank number */}
      <div style={{ width: 28, height: 28, borderRadius: '8px', flexShrink: 0, background: demandColor + '12', border: '1px solid ' + demandColor + '25', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: FM, fontSize: '11px', fontWeight: '700', color: demandColor }}>#{rank}</span>
      </div>

      {/* Cert name + why */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FH, fontWeight: '700', fontSize: '14px', color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {cert.name}
        </div>
        <div style={{ fontFamily: FB, fontSize: '12px', color: 'var(--text-4)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
          {cert.why}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
        <span style={{ fontFamily: FM, fontSize: '12px', fontWeight: '700', color: EMERALD }}>+{cert.roi}</span>
        <span style={{ fontFamily: FM, fontSize: '10px', color: 'var(--text-4)' }}>{cert.timeline}</span>
      </div>

      {/* Arrow */}
      <motion.div animate={{ x: hovered ? 3 : 0 }} transition={{ duration: 0.15 }}>
        <ArrowRight size={14} color={hovered ? demandColor : 'var(--text-4)'} />
      </motion.div>
    </motion.div>
  )
}

// ── NEW: The full result display ───────────────────────────
const ResultDisplay = ({ result, onCertSelected, mode, onClear }) => {
  const [showOtherCerts, setShowOtherCerts] = useState(false)
  const primaryCert   = result.certs[0]
  const otherCerts    = result.certs.slice(1)
  const firstName     = result.name ? result.name.split(' ')[0] : ''

  const handleSelect = useCallback((certName) => {
    if (onCertSelected) {
      onCertSelected(certName, result.city, result.domain, result.name)
    }
  }, [onCertSelected, result])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

      {/* Cinematic personalized hero */}
      <PersonalisedHero
        name={result.name}
        city={result.city}
        domain={result.domain}
        primaryCert={primaryCert}
        mode={mode}
      />

      {/* CTA for primary cert — Calculate ROI */}
      {primaryCert && onCertSelected && (
        <motion.button
          onClick={() => handleSelect(primaryCert.name)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            padding: '15px 20px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, ' + EMERALD + ' 0%, #0DA271 100%)',
            color: 'white',
            fontSize: '15px',
            fontWeight: '800',
            fontFamily: FH,
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '9px',
            boxShadow: '0 6px 24px rgba(16,185,129,0.35)',
            marginBottom: '20px',
            transition: 'box-shadow 0.2s',
          }}
        >
          <TrendingUp size={16} />
          Calculate ROI for {primaryCert.name.split(' ').slice(0, 3).join(' ')}
          <ArrowRight size={15} />
        </motion.button>
      )}

      {/* Profile summary */}
      {result.summary && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.4 }}
          style={{ marginBottom: '18px' }}
        >
          <NeonCard color={PICTON} speed={0.014} borderRadius="12px">
            <div style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <User size={12} color={PICTON} />
                <span style={{ fontFamily: FM, fontSize: '9px', color: PICTON, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {firstName ? 'Profile Analysis — ' + firstName.toUpperCase() : 'Profile Analysis'}
                </span>
                {result.city && (
                  <span style={{ marginLeft: 'auto', fontFamily: FM, fontSize: '9px', padding: '2px 7px', borderRadius: '5px', background: PICTON + '14', color: PICTON }}>
                    📍 {result.city}
                  </span>
                )}
              </div>
              <p style={{ fontFamily: FB, fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.75, margin: 0 }}>
                {result.summary}
              </p>
            </div>
          </NeonCard>
        </motion.div>
      )}

      {/* Skill gaps */}
      {result.gaps?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.4 }}
          style={{ marginBottom: '18px' }}
        >
          <div style={{ fontFamily: FM, fontSize: '9px', color: AMBER, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '9px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <AlertTriangle size={10} color={AMBER} />
            {firstName ? 'Gaps to close — ' + firstName : 'Skill Gaps to Close'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {result.gaps.map((gap, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '9px 12px', borderRadius: '8px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                <span style={{ fontFamily: FM, fontSize: '10px', color: AMBER, flexShrink: 0, marginTop: '1px' }}>0{i+1}</span>
                <span style={{ fontFamily: FB, fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.5 }}>{gap}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Other cert options — leaderboard */}
      {otherCerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.4 }}
          style={{ marginBottom: '18px' }}
        >
          <button
            onClick={() => setShowOtherCerts(v => !v)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '9px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-4)',
              fontFamily: FM,
              fontSize: '10px',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: showOtherCerts ? '12px' : '0',
              transition: 'all 0.18s',
            }}
          >
            <span>Other Options ({otherCerts.length} more certs analysed)</span>
            <motion.span animate={{ rotate: showOtherCerts ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'inline-flex' }}>▾</motion.span>
          </button>

          <AnimatePresence>
            {showOtherCerts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: 'hidden' }}
              >
                {otherCerts.map((cert, i) => (
                  <CertLeaderboardRow
                    key={i}
                    cert={cert}
                    rank={i + 2}
                    onSelect={onCertSelected ? handleSelect : null}
                    mode={mode}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Immediate action */}
      {result.immediateAction && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.4 }}
          style={{ marginBottom: '14px' }}
        >
          <NeonCard color={EMERALD} speed={0.016} borderRadius="11px">
            <div style={{ padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Target size={14} color={EMERALD} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontFamily: FM, fontSize: '9px', color: EMERALD, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>
                  {firstName ? firstName + "'s action this week" : 'Do this week'}
                </div>
                <div style={{ fontFamily: FB, fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.65 }}>{result.immediateAction}</div>
              </div>
            </div>
          </NeonCard>
        </motion.div>
      )}

      {/* Market insight */}
      {result.marketInsight && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.1, duration: 0.4 }}
          style={{ padding: '13px 15px', borderRadius: '10px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)', display: 'flex', gap: '9px', alignItems: 'flex-start', marginBottom: '20px' }}
        >
          <span style={{ fontSize: '14px', flexShrink: 0 }}>📊</span>
          <div>
            <div style={{ fontFamily: FM, fontSize: '9px', color: VIOLET, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Market Insight</div>
            <div style={{ fontFamily: FB, fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6 }}>{result.marketInsight}</div>
          </div>
        </motion.div>
      )}

      {/* Reset */}
      <motion.button
        onClick={onClear}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.3, duration: 0.3 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-4)', fontSize: '13px', fontFamily: FH, fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.18s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = PICTON + '33'; e.currentTarget.style.color = PICTON }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-4)' }}
      >
        <RefreshCw size={13} />
        Upload a different resume
      </motion.button>

    </motion.div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────
const ResumeAnalyzer = ({ mode = 'professional', onCertSelected }) => {
  const [text,       setText]       = useState('')
  const [fileName,   setFileName]   = useState('')
  const [loading,    setLoading]    = useState(false)
  const [result,     setResult]     = useState(null)
  const [error,      setError]      = useState(null)
  const [rejection,  setRejection]  = useState(null)
  const [dragging,   setDragging]   = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
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
  const clearAll   = () => { setText(''); setFileName(''); setResult(null); setError(null); setRejection(null) }

  const handleAnalyse = async () => {
    if (!text.trim()) { setError('Please upload a file or paste your resume text'); return }
    const validation = validateDocument(text)
    if (!validation.isResume) { setRejection(validation.rejectedBy || 'default'); return }
    setLoading(true); setResult(null); setError(null); setRejection(null)
    try {
      const safeText = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').slice(0, 2200).trim()
      const raw      = await callGroqForResume(null, buildPrompt(safeText, mode))
      if (!raw || raw.length < 30) throw new Error('Empty response — try again')
      const parsed = parseResponse(raw)
      setResult(parsed.certs?.length ? parsed : {
        name: parsed.name, summary: 'Analysis complete', city: '', domain: 'business',
        gaps: [], certs: [], immediateAction: raw, marketInsight: '', raw
      })
    } catch (e) {
      console.error('Resume AI error:', e)
      if (e.message?.includes('not configured') || e.message?.includes('500') || e.message?.includes('404') || e.message === 'NO_KEY') {
        setResult({
          name: 'Demo', summary: 'AI not connected. Check GROQ_API_KEY in Vercel environment variables.',
          city: 'Bangalore', domain: 'tech',
          gaps: ['No hands-on cloud portfolio projects', 'Missing architecture-level certifications', 'Limited DevOps exposure'],
          certs: [
            { name: 'AWS Solutions Architect', why: 'Highest ROI for Indian tech professionals — 2,400+ open roles on Naukri', roi: '30-40%', timeline: '3 months', fastTrack: 'Register free on AWS Skill Builder today', primary: true },
            { name: 'Google Data Analytics',   why: 'High demand, entry-friendly, complements most backgrounds', roi: '20-28%', timeline: '4 months', fastTrack: 'Enrol on Coursera — first 7 days free', primary: false },
            { name: 'PMP Certification',        why: 'Best path to senior management track', roi: '25-30%', timeline: '6 months', fastTrack: "Download PMI's free Exam Content Outline PDF", primary: false },
          ],
          immediateAction: 'Check Vercel → Settings → Environment Variables → ensure GROQ_API_KEY is set.',
          marketInsight: 'AWS certified professionals in Bangalore command 35% higher salaries — 2,400+ active roles on Naukri as of March 2026.',
          raw: '(demo)',
        })
      } else {
        setError(e.message || 'Unknown error. Check browser console F12.')
      }
    } finally { setLoading(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      {/* Upload / paste area — hidden after result */}
      <AnimatePresence>
        {!hasResult && !hasTyped && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
            <NeonCard color={dragging ? PICTON : hasFile ? EMERALD : INDIGO} speed={0.022} borderRadius="11px">
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !hasFile && fileRef.current?.click()}
                style={{ padding: '24px', cursor: hasFile ? 'default' : 'pointer', textAlign: 'center' }}
              >
                <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => readFile(e.target.files[0])} />
                {pdfLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid ' + PICTON, borderTopColor: 'transparent', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: PICTON, fontFamily: FH, fontWeight: '600' }}>Reading PDF...</span>
                  </div>
                ) : hasFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <FileText size={15} color={EMERALD} />
                    <span style={{ fontSize: '13px', color: EMERALD, fontWeight: '600', fontFamily: FH }}>{fileName}</span>
                    <button onClick={e => { e.stopPropagation(); clearAll() }} style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer' }}><X size={13} /></button>
                  </div>
                ) : (
                  <>
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Upload size={26} color="var(--text-4)" style={{ margin: '0 auto 12px', display: 'block' }} />
                    </motion.div>
                    <div style={{ fontSize: '14px', color: 'var(--text-3)', fontFamily: FH, fontWeight: '700', marginBottom: '5px' }}>
                      Drop your resume or <span style={{ color: PICTON, textDecoration: 'underline' }}>browse</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: FB }}>PDF · TXT · DOC accepted</div>
                  </>
                )}
              </div>
            </NeonCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Or divider */}
      {!hasFile && !hasTyped && !hasResult && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: FM }}>or paste below</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
      )}

      {/* Textarea */}
      <AnimatePresence>
        {!hasFile && !hasResult && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden', position: 'relative' }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste your resume, LinkedIn About section, or work experience here. Include your city for better results."
              rows={6}
              style={{ width: '100%', padding: '14px', background: 'var(--bg)', border: '1px solid ' + (hasTyped ? PICTON + '44' : 'var(--border)'), borderRadius: '11px', color: 'var(--text)', fontSize: '13px', fontFamily: FB, outline: 'none', resize: 'vertical', lineHeight: '1.6', transition: 'border-color 0.18s', boxSizing: 'border-box' }}
            />
            {hasTyped && (
              <>
                <button onClick={clearAll} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer' }}><X size={13} /></button>
                <div style={{ position: 'absolute', bottom: '10px', right: '12px', fontSize: '10px', color: 'var(--text-4)', fontFamily: FM }}>{text.length}c</div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection error */}
      <AnimatePresence>
        {rejection && <NotAResumeError rejectedBy={rejection} onDismiss={() => { setRejection(null); clearAll() }} />}
      </AnimatePresence>

      {/* Analyse button / scanning beam */}
      {!hasResult && (
        loading
          ? <ScanningBeam name={''} />
          : (
            <motion.button
              onClick={handleAnalyse}
              disabled={!text.trim()}
              whileHover={{ scale: text.trim() ? 1.01 : 1, y: text.trim() ? -1 : 0 }}
              whileTap={{ scale: text.trim() ? 0.98 : 1 }}
              style={{
                width: '100%',
                fontSize: '15px',
                padding: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '9px',
                background: !text.trim() ? 'transparent' : 'linear-gradient(135deg, ' + PICTON + ', #3B8CC7)',
                border: !text.trim() ? '1px solid var(--border)' : 'none',
                borderRadius: '12px',
                color: !text.trim() ? 'var(--text-4)' : 'white',
                fontFamily: FH,
                fontWeight: '800',
                cursor: !text.trim() ? 'not-allowed' : 'pointer',
                boxShadow: !text.trim() ? 'none' : '0 4px 20px rgba(81,177,231,0.3)',
                letterSpacing: '-0.015em',
                transition: 'all 0.2s',
              }}
            >
              <Sparkles size={16} />
              Analyse My Resume with AI
            </motion.button>
          )
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: '#FCA5A5', display: 'flex', gap: '8px', alignItems: 'flex-start', fontFamily: FB }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '1px' }} /><span>{error}</span>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <ResultDisplay
            result={result}
            onCertSelected={onCertSelected}
            mode={mode}
            onClear={clearAll}
          />
        )}
      </AnimatePresence>

    </div>
  )
}

export default ResumeAnalyzer