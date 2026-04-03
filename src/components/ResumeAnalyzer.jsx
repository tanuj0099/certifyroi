import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, X, Sparkles, AlertTriangle,
  ArrowRight, RefreshCw, User, TrendingUp,
  Zap, Target, Star, Clock, Filter
} from 'lucide-react'
import { CERTIFICATIONS, CERT_DOMAINS } from '../tokens.js'
import { callGroqForResume } from '../services/aiService.jsx'
import NeonCard from './NeonCard.jsx'

const PICTON  = '#51B1E7'
const EMERALD = '#10B981'
const AMBER   = '#F59E0B'
const INDIGO  = '#6366F1'
const VIOLET  = '#818CF8'

const FM = "'JetBrains Mono','Commit Mono',monospace"
const FB = "'Inter',sans-serif"
const FH = "'Plus Jakarta Sans','Bricolage Grotesque',sans-serif"

// ── Timeline options for cert filtering ───────────────────
const TIMELINE_OPTIONS = [
  { id: 'fast',     label: 'Fast',     sub: '1–3 months',  icon: '⚡' },
  { id: 'medium',   label: 'Medium',   sub: '3–6 months',  icon: '📈' },
  { id: 'flexible', label: 'Flexible', sub: 'No rush',     icon: '🗓' },
]

// ── Domain intent options ─────────────────────────────────
const DOMAIN_INTENTS = [
  { id: 'auto',          label: 'Auto-detect from resume' },
  { id: 'tech',          label: 'Cloud / DevOps / Tech'   },
  { id: 'data',          label: 'Data & AI'               },
  { id: 'cybersecurity', label: 'Cybersecurity'           },
  { id: 'finance',       label: 'Finance'                 },
  { id: 'management',    label: 'Management / PMP'        },
  { id: 'marketing',     label: 'Marketing / Digital'     },
  { id: 'hr',            label: 'HR & People'             },
  { id: 'government',    label: 'Govt / PSU'              },
  { id: 'medical',       label: 'Medical'                 },
]

// ── Document validator ────────────────────────────────────
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
  if (text.trim().length < 150) return { isResume: false, rejectedBy: 'too short', score }
  return { isResume: score >= 8, score, sectionHits, verbHits }
}

// ── PDF reader ────────────────────────────────────────────
const readPdfFile = async (file) => {
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src   = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
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

// ── Prompt builder ────────────────────────────────────────
const buildPrompt = (resumeText, mode, timeline, domainIntent) => {
  var timelineNote = timeline === 'fast'
    ? 'User needs FAST-TRACK certifications only — completable in 1-3 months. Do NOT recommend certs that take longer than 3 months.'
    : timeline === 'medium'
    ? 'User has 3-6 months available. Recommend certs completable within this window.'
    : 'User has flexible timeline — recommend the best certs regardless of duration.'

  var domainNote = domainIntent && domainIntent !== 'auto'
    ? 'User specifically wants to enter or grow in the ' + domainIntent + ' domain. Prioritise certs in that domain even if their resume suggests otherwise.'
    : 'Auto-detect the best domain from their resume.'

  return `You are CertifyROI, a career advisor for Indian professionals (2026).
User mode: ${mode}
Timeline preference: ${timelineNote}
Domain intent: ${domainNote}

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

// ── Response parser ────────────────────────────────────────
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

// ── Not-a-resume error ─────────────────────────────────────
const NotAResumeError = ({ rejectedBy, onDismiss }) => {
  const messages = {
    'fee receipt':    { emoji: '🧾', title: "That's a fee receipt, not a resume",  desc: "We found payment details and fee amounts. Please upload your CV or resume instead." },
    'hall ticket':    { emoji: '🎫', title: "That's an exam hall ticket",          desc: "We can see exam schedules and course codes. Please upload your resume or LinkedIn profile." },
    'question paper': { emoji: '📝', title: "That looks like a question paper",    desc: "We found exam sections and marks allocation. Please upload your actual resume." },
    'study notes':    { emoji: '📚', title: "These look like study notes",         desc: "We found revision formulas and theory content. Please upload your resume or CV." },
    'assignment':     { emoji: '📄', title: "That's a college assignment",         desc: "We found professor details and submission info. Please upload your personal resume." },
    'technical doc':  { emoji: '💾', title: "That's a technical document",        desc: "We found code or database schemas. Please upload your resume instead." },
    'research report':{ emoji: '📊', title: "That's a research report",           desc: "We found statistical analysis and methodology. Please upload your personal resume." },
    'academic paper': { emoji: '🎓', title: "That's an academic paper",           desc: "We found abstract and bibliography sections. Please upload your resume." },
    'too short':      { emoji: '🤔', title: "That seems too short to be a resume", desc: "Please paste more of your profile — work experience, education, and skills." },
    default:          { emoji: '🤔', title: "That doesn't look like a resume",    desc: "We need your work experience, education, skills, and contact details to give you accurate cert recommendations." },
  }
  const msg = messages[rejectedBy] || messages.default
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{ padding: '24px', borderRadius: '14px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', textAlign: 'center' }}>
      <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>{msg.emoji}</div>
      <h3 style={{ fontFamily: FH, fontWeight: '800', fontSize: '15px', color: '#FCA5A5', marginBottom: '8px' }}>{msg.title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: FB, lineHeight: '1.65', marginBottom: '16px' }}>{msg.desc}</p>
      <button onClick={onDismiss} style={{ padding: '9px 20px', borderRadius: '8px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: FH }}>
        Try a different file
      </button>
    </motion.div>
  )
}

// ── CLEAN Loading state — no noise ────────────────────────
const CleanLoader = ({ name }) => {
  var [step, setStep] = useState(0)
  var firstName = name ? name.split(' ')[0] : ''
  var steps = [
    firstName ? 'Reading ' + firstName + '\'s profile...' : 'Reading resume...',
    'Matching India job market 2026...',
    'Ranking certification ROI...',
    'Writing your recommendation...',
  ]

  useEffect(function() {
    var timers = steps.map(function(_, i) {
      return setTimeout(function() { setStep(i) }, i * 950)
    })
    return function() { timers.forEach(clearTimeout) }
  }, [])

  var pct = Math.round(((step + 1) / steps.length) * 100)

  return (
    <div style={{
      padding: '24px',
      borderRadius: '14px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(81,177,231,0.25)', borderTopColor: PICTON, flexShrink: 0 }}
        />
        <span style={{ fontFamily: FM, fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Analysing
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: FM, fontSize: '11px', color: PICTON, fontWeight: '700' }}>
          {pct}%
        </span>
      </div>

      {/* Current step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          style={{ fontFamily: FH, fontSize: '15px', fontWeight: '700', color: 'var(--text)', marginBottom: '20px', letterSpacing: '-0.02em' }}
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar — single, clean */}
      <div style={{ height: '3px', borderRadius: '2px', background: 'var(--border)', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: pct + '%' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, ' + PICTON + ', ' + VIOLET + ')', borderRadius: '2px' }}
        />
      </div>
    </div>
  )
}

// ── PersonalisedHero ──────────────────────────────────────
const PersonalisedHero = ({ name, city, domain, primaryCert, mode }) => {
  var [phase, setPhase] = useState(0)

  useEffect(function() {
    var t1 = setTimeout(function() { setPhase(1) }, 700)
    var t2 = setTimeout(function() { setPhase(2) }, 1400)
    return function() { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  var domainLabel = CERT_DOMAINS.find(function(d) { return d.id === domain })?.label || domain
  var firstName   = name ? name.split(' ')[0] : ''

  var intro = firstName
    ? firstName + ', out of 103 certifications analysed for ' + (city ? 'a professional in ' + city : 'your profile') + ' right now —'
    : 'For a ' + (mode === 'student' ? 'student' : mode === 'switcher' ? 'career switcher' : 'professional') + ' in ' + domainLabel + ' right now —'

  var callout = firstName ? 'this is your move.' : 'one cert stands clearly above the rest.'

  return (
    <div style={{ marginBottom: '24px' }}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: '1px', background: 'linear-gradient(90deg, ' + INDIGO + '55, ' + EMERALD + '55, transparent)', marginBottom: '20px', transformOrigin: 'left' }}
      />

      {phase >= 0 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ fontFamily: FM, fontSize: '11px', color: 'var(--text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px', lineHeight: 1.6 }}
        >
          {intro}
        </motion.p>
      )}

      {phase >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '16px' }}
        >
          <div style={{ fontFamily: FH, fontWeight: '800', lineHeight: 1.15, letterSpacing: '-0.025em' }}>
            <span style={{ fontSize: 'clamp(20px, 4.5vw, 30px)', color: 'var(--text)' }}>
              {callout.split(' ').slice(0, -1).join(' ')}{' '}
            </span>
            <span style={{ fontSize: 'clamp(20px, 4.5vw, 30px)', background: 'linear-gradient(135deg,' + EMERALD + ',' + PICTON + ',' + VIOLET + ')', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {callout.split(' ').at(-1)}
            </span>
          </div>
        </motion.div>
      )}

      {phase >= 2 && primaryCert && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <PrimaryCertHero cert={primaryCert} />
        </motion.div>
      )}
    </div>
  )
}

// ── PrimaryCertHero ───────────────────────────────────────
const PrimaryCertHero = ({ cert }) => {
  var [hovered, setHovered] = useState(false)
  return (
    <motion.div
      onHoverStart={function() { setHovered(true) }}
      onHoverEnd={function() { setHovered(false) }}
      style={{
        position: 'relative', borderRadius: '14px', overflow: 'hidden',
        border: '1px solid ' + (hovered ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.25)'),
        background: 'linear-gradient(135deg, rgba(16,185,129,0.07), rgba(81,177,231,0.04), rgba(99,102,241,0.06))',
        padding: '20px',
        boxShadow: hovered ? '0 0 28px rgba(16,185,129,0.14), 0 6px 24px rgba(0,0,0,0.16)' : '0 2px 12px rgba(0,0,0,0.1)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: '12%', right: '12%', height: '1px', background: 'linear-gradient(90deg, transparent,' + EMERALD + '77,' + PICTON + '77,transparent)' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Star size={13} color={EMERALD} fill={EMERALD} />
          <span style={{ fontFamily: FM, fontSize: '9px', color: EMERALD, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '700' }}>Primary Move</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ fontFamily: FM, fontSize: '9px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: EMERALD }}>+{cert.roi}</span>
          <span style={{ fontFamily: FM, fontSize: '9px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(81,177,231,0.12)', border: '1px solid rgba(81,177,231,0.25)', color: PICTON }}>{cert.timeline}</span>
        </div>
      </div>

      <h2 style={{ fontFamily: FH, fontWeight: '800', fontSize: 'clamp(17px, 3.5vw, 24px)', color: 'var(--text)', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '9px' }}>
        {cert.name}
      </h2>
      <p style={{ fontFamily: FB, fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.65, marginBottom: '14px' }}>
        {cert.why}
      </p>

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

// ── CertLeaderboardRow ────────────────────────────────────
const CertLeaderboardRow = ({ cert, rank, onSelect }) => {
  var [hovered, setHovered] = useState(false)
  var col = rank === 2 ? PICTON : VIOLET
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: (rank - 2) * 0.1 }}
      onMouseEnter={function() { setHovered(true) }}
      onMouseLeave={function() { setHovered(false) }}
      onClick={function() { if (onSelect) onSelect(cert.name) }}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 14px',
        borderRadius: '11px', border: '1px solid ' + (hovered ? col + '33' : 'var(--border)'),
        background: hovered ? col + '06' : 'var(--surface)',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all 0.16s',
        marginBottom: '7px',
      }}
    >
      <div style={{ width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0, background: col + '12', border: '1px solid ' + col + '25', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: FM, fontSize: '11px', fontWeight: '700', color: col }}>#{rank}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FH, fontWeight: '700', fontSize: '14px', color: 'var(--text)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cert.name}</div>
        <div style={{ fontFamily: FB, fontSize: '12px', color: 'var(--text-4)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{cert.why}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
        <span style={{ fontFamily: FM, fontSize: '12px', fontWeight: '700', color: EMERALD }}>+{cert.roi}</span>
        <span style={{ fontFamily: FM, fontSize: '10px', color: 'var(--text-4)' }}>{cert.timeline}</span>
      </div>
      <motion.div animate={{ x: hovered ? 3 : 0 }} transition={{ duration: 0.14 }}>
        <ArrowRight size={13} color={hovered ? col : 'var(--text-4)'} />
      </motion.div>
    </motion.div>
  )
}

// ── Preferences panel ─────────────────────────────────────
const PreferencesPanel = ({ timeline, onTimeline, domainIntent, onDomain }) => {
  var [expanded, setExpanded] = useState(false)
  var hasCustom = timeline !== 'flexible' || domainIntent !== 'auto'

  return (
    <div style={{ marginBottom: '12px' }}>
      <button
        onClick={function() { setExpanded(function(v) { return !v }) }}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: '10px',
          background: hasCustom ? 'rgba(99,102,241,0.07)' : 'var(--surface)',
          border: '1px solid ' + (hasCustom ? 'rgba(99,102,241,0.25)' : 'var(--border)'),
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          color: hasCustom ? VIOLET : 'var(--text-4)',
          fontSize: '12px', fontFamily: FM, letterSpacing: '0.05em',
          textTransform: 'uppercase', transition: 'all 0.18s',
        }}
      >
        <Filter size={12} />
        <span>Preferences</span>
        {hasCustom && (
          <span style={{ padding: '1px 6px', borderRadius: '4px', background: VIOLET + '20', fontSize: '9px', letterSpacing: '0.06em' }}>
            CUSTOMISED
          </span>
        )}
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ marginLeft: 'auto', display: 'inline-flex' }}
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Timeline */}
              <div>
                <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={10} />
                  How soon do you need results?
                </div>
                <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                  {TIMELINE_OPTIONS.map(function(opt) {
                    var active = timeline === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={function() { onTimeline(opt.id) }}
                        style={{
                          padding: '8px 14px', borderRadius: '9px',
                          background: active ? INDIGO + '15' : 'var(--surface)',
                          border: '1px solid ' + (active ? INDIGO + '45' : 'var(--border)'),
                          color: active ? VIOLET : 'var(--text-3)',
                          fontSize: '12px', fontFamily: FH, fontWeight: active ? '700' : '500',
                          cursor: 'pointer', transition: 'all 0.16s',
                          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px',
                        }}
                      >
                        <span>{opt.icon} {opt.label}</span>
                        <span style={{ fontSize: '10px', color: active ? VIOLET + 'AA' : 'var(--text-4)', fontFamily: FM, fontWeight: '400' }}>{opt.sub}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Domain intent */}
              <div>
                <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Target domain (optional)
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {DOMAIN_INTENTS.map(function(d) {
                    var active = domainIntent === d.id
                    return (
                      <button
                        key={d.id}
                        onClick={function() { onDomain(d.id) }}
                        style={{
                          padding: '5px 11px', borderRadius: '7px',
                          background: active ? INDIGO + '15' : 'transparent',
                          border: '1px solid ' + (active ? INDIGO + '40' : 'var(--border)'),
                          color: active ? VIOLET : 'var(--text-4)',
                          fontSize: '12px', fontFamily: FB,
                          fontWeight: active ? '600' : '400',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                      >
                        {d.label}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── ResultDisplay ─────────────────────────────────────────
const ResultDisplay = ({ result, onCertSelected, mode, onClear }) => {
  var [showOtherCerts, setShowOtherCerts] = useState(false)
  var primaryCert = result.certs[0]
  var otherCerts  = result.certs.slice(1)
  var firstName   = result.name ? result.name.split(' ')[0] : ''

  var handleSelect = useCallback(function(certName) {
    if (onCertSelected) onCertSelected(certName, result.city, result.domain, result.name)
  }, [onCertSelected, result])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

      <PersonalisedHero
        name={result.name} city={result.city}
        domain={result.domain} primaryCert={primaryCert} mode={mode}
      />

      {/* Primary CTA */}
      {primaryCert && onCertSelected && (
        <motion.button
          onClick={function() { handleSelect(primaryCert.name) }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%', padding: '14px 20px', borderRadius: '11px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,' + EMERALD + ',#0DA271)',
            color: 'white', fontSize: '15px', fontWeight: '800', fontFamily: FH, letterSpacing: '-0.02em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
            boxShadow: '0 6px 22px rgba(16,185,129,0.32)', marginBottom: '18px',
          }}
        >
          <TrendingUp size={15} />
          Calculate ROI for {primaryCert.name.split(' ').slice(0, 3).join(' ')}
          <ArrowRight size={14} />
        </motion.button>
      )}

      {/* Profile summary */}
      {result.summary && (
        <motion.div
          initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.4 }} style={{ marginBottom: '16px' }}
        >
          <NeonCard color={PICTON} speed={0.014} borderRadius="12px">
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '9px' }}>
                <User size={12} color={PICTON} />
                <span style={{ fontFamily: FM, fontSize: '9px', color: PICTON, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {firstName ? 'Profile — ' + firstName.toUpperCase() : 'Profile Analysis'}
                </span>
                {result.city && (
                  <span style={{ marginLeft: 'auto', fontFamily: FM, fontSize: '9px', padding: '2px 7px', borderRadius: '5px', background: PICTON + '14', color: PICTON }}>
                    📍 {result.city}
                  </span>
                )}
              </div>
              <p style={{ fontFamily: FB, fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.72, margin: 0 }}>{result.summary}</p>
            </div>
          </NeonCard>
        </motion.div>
      )}

      {/* Skill gaps */}
      {result.gaps?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.4 }} style={{ marginBottom: '16px' }}
        >
          <div style={{ fontFamily: FM, fontSize: '9px', color: AMBER, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <AlertTriangle size={10} color={AMBER} />
            Gaps to close
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {result.gaps.map(function(gap, i) {
              return (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '9px 12px', borderRadius: '8px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.14)' }}>
                  <span style={{ fontFamily: FM, fontSize: '10px', color: AMBER, flexShrink: 0, marginTop: '1px' }}>0{i+1}</span>
                  <span style={{ fontFamily: FB, fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.5 }}>{gap}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Other certs leaderboard */}
      {otherCerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.4 }} style={{ marginBottom: '16px' }}
        >
          <button
            onClick={function() { setShowOtherCerts(function(v) { return !v }) }}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '9px',
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-4)', fontFamily: FM, fontSize: '10px',
              letterSpacing: '0.07em', textTransform: 'uppercase', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: showOtherCerts ? '10px' : '0', transition: 'all 0.16s',
            }}
          >
            <span>Other options ({otherCerts.length} more)</span>
            <motion.span animate={{ rotate: showOtherCerts ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'inline-flex' }}>▾</motion.span>
          </button>
          <AnimatePresence>
            {showOtherCerts && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                {otherCerts.map(function(cert, i) {
                  return <CertLeaderboardRow key={i} cert={cert} rank={i + 2} onSelect={onCertSelected ? handleSelect : null} />
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Immediate action */}
      {result.immediateAction && (
        <motion.div
          initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.4 }} style={{ marginBottom: '12px' }}
        >
          <NeonCard color={EMERALD} speed={0.016} borderRadius="11px">
            <div style={{ padding: '13px 15px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Target size={13} color={EMERALD} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontFamily: FM, fontSize: '9px', color: EMERALD, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
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
          initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.4 }}
          style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.16)', display: 'flex', gap: '9px', alignItems: 'flex-start', marginBottom: '18px' }}
        >
          <span style={{ fontSize: '13px', flexShrink: 0 }}>📊</span>
          <div>
            <div style={{ fontFamily: FM, fontSize: '9px', color: VIOLET, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>Market Insight</div>
            <div style={{ fontFamily: FB, fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6 }}>{result.marketInsight}</div>
          </div>
        </motion.div>
      )}

      {/* Reset */}
      <motion.button
        onClick={onClear}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.0 }}
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-4)', fontSize: '13px', fontFamily: FH, fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.16s' }}
        onMouseEnter={function(e) { e.currentTarget.style.borderColor = PICTON + '33'; e.currentTarget.style.color = PICTON }}
        onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-4)' }}
      >
        <RefreshCw size={13} />
        Upload a different resume
      </motion.button>
    </motion.div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────
const ResumeAnalyzer = ({ mode = 'professional', onCertSelected }) => {
  var [text,        setText]        = useState('')
  var [fileName,    setFileName]    = useState('')
  var [loading,     setLoading]     = useState(false)
  var [result,      setResult]      = useState(null)
  var [error,       setError]       = useState(null)
  var [rejection,   setRejection]   = useState(null)
  var [dragging,    setDragging]    = useState(false)
  var [pdfLoading,  setPdfLoading]  = useState(false)
  var [timeline,    setTimeline]    = useState('flexible')
  var [domainIntent,setDomainIntent]= useState('auto')
  var fileRef = useRef(null)

  var hasFile   = !!fileName
  var hasTyped  = !hasFile && text.trim().length > 0
  var hasResult = !!result

  var readFile = async function(file) {
    if (!file) return
    var ext = file.name.split('.').pop().toLowerCase()
    setError(null); setRejection(null)
    if (ext === 'pdf') {
      setFileName(file.name); setText(''); setPdfLoading(true)
      try {
        var extracted = await readPdfFile(file)
        if (!extracted) { setError('Could not extract text from PDF. Please paste your resume text below.'); setFileName(''); return }
        setText(extracted)
      } catch(e) {
        setError('PDF parsing failed. Please paste your resume text below.')
        setFileName('')
      } finally { setPdfLoading(false) }
      return
    }
    setFileName(file.name); setText('')
    var reader = new FileReader()
    reader.onload  = function(e) { setText(e.target.result || '') }
    reader.onerror = function()  { setError('Could not read file. Try pasting text instead.') }
    reader.readAsText(file)
  }

  var handleDrop = function(e) { e.preventDefault(); setDragging(false); readFile(e.dataTransfer.files[0]) }
  var clearAll   = function()  { setText(''); setFileName(''); setResult(null); setError(null); setRejection(null) }

  var handleAnalyse = async function() {
    if (!text.trim()) { setError('Please upload a file or paste your resume text'); return }
    var validation = validateDocument(text)
    if (!validation.isResume) { setRejection(validation.rejectedBy || 'default'); return }
    setLoading(true); setResult(null); setError(null); setRejection(null)
    try {
      var safeText = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').slice(0, 2200).trim()
      var raw      = await callGroqForResume(null, buildPrompt(safeText, mode, timeline, domainIntent))
      if (!raw || raw.length < 30) throw new Error('Empty response — try again')
      var parsed = parseResponse(raw)
      setResult(parsed.certs?.length ? parsed : {
        name: parsed.name, summary: 'Analysis complete', city: '', domain: 'business',
        gaps: [], certs: [], immediateAction: raw, marketInsight: '', raw
      })
    } catch(e) {
      console.error('Resume AI error:', e)
      if (e.message?.includes('not configured') || e.message?.includes('500') || e.message?.includes('404') || e.message === 'NO_KEY') {
        setResult({
          name: 'Demo', summary: 'AI not connected. Check GROQ_API_KEY in Vercel environment variables.',
          city: 'Bangalore', domain: 'tech',
          gaps: ['No hands-on cloud portfolio projects', 'Missing architecture-level certifications', 'Limited DevOps exposure'],
          certs: [
            { name: 'AWS Solutions Architect', why: 'Highest ROI for Indian tech professionals — 2,400+ open roles on Naukri', roi: '30-40%', timeline: '3 months', fastTrack: 'Register free on AWS Skill Builder today', primary: true },
            { name: 'Google Data Analytics',   why: 'High demand, entry-friendly, complements most backgrounds',             roi: '20-28%', timeline: '4 months', fastTrack: 'Enrol on Coursera — first 7 days free',         primary: false },
            { name: 'PMP Certification',        why: 'Best path to senior management track',                                  roi: '25-30%', timeline: '6 months', fastTrack: "Download PMI's free Exam Content Outline PDF", primary: false },
          ],
          immediateAction: 'Check Vercel → Settings → Environment Variables → ensure GROQ_API_KEY is set.',
          marketInsight:   'AWS certified professionals in Bangalore command 35% higher salaries — 2,400+ active roles on Naukri as of March 2026.',
          raw: '(demo)',
        })
      } else {
        setError(e.message || 'Unknown error. Check browser console F12.')
      }
    } finally { setLoading(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Upload area */}
      <AnimatePresence>
        {!hasResult && !hasTyped && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
            <NeonCard color={dragging ? PICTON : hasFile ? EMERALD : INDIGO} speed={0.022} borderRadius="11px">
              <div
                onDragOver={function(e) { e.preventDefault(); setDragging(true) }}
                onDragLeave={function() { setDragging(false) }}
                onDrop={handleDrop}
                onClick={function() { if (!hasFile) fileRef.current?.click() }}
                style={{ padding: '24px', cursor: hasFile ? 'default' : 'pointer', textAlign: 'center' }}
              >
                <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" style={{ display: 'none' }} onChange={function(e) { readFile(e.target.files[0]) }} />
                {pdfLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid ' + PICTON, borderTopColor: 'transparent' }} />
                    <span style={{ fontSize: '13px', color: PICTON, fontFamily: FH, fontWeight: '600' }}>Reading PDF...</span>
                  </div>
                ) : hasFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <FileText size={15} color={EMERALD} />
                    <span style={{ fontSize: '13px', color: EMERALD, fontWeight: '600', fontFamily: FH }}>{fileName}</span>
                    <button onClick={function(e) { e.stopPropagation(); clearAll() }} style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer' }}><X size={13} /></button>
                  </div>
                ) : (
                  <>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                      <Upload size={24} color="var(--text-4)" style={{ margin: '0 auto 12px', display: 'block' }} />
                    </motion.div>
                    <div style={{ fontSize: '14px', color: 'var(--text-3)', fontFamily: FH, fontWeight: '700', marginBottom: '4px' }}>
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
              onChange={function(e) { setText(e.target.value) }}
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

      {/* Rejection */}
      <AnimatePresence>
        {rejection && <NotAResumeError rejectedBy={rejection} onDismiss={function() { setRejection(null); clearAll() }} />}
      </AnimatePresence>

      {/* ── Preferences + Analyse — only shown when there's content and no result ── */}
      {!hasResult && (text.trim() || hasFile) && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Preferences */}
          <PreferencesPanel
            timeline={timeline}
            onTimeline={setTimeline}
            domainIntent={domainIntent}
            onDomain={setDomainIntent}
          />

          {/* Analyse button */}
          <motion.button
            onClick={handleAnalyse}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', fontSize: '15px', padding: '15px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
              background: 'linear-gradient(135deg,' + PICTON + ',#3B8CC7)',
              border: 'none', borderRadius: '12px', color: 'white',
              fontFamily: FH, fontWeight: '800', cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(81,177,231,0.28)',
              letterSpacing: '-0.015em',
            }}
          >
            <Sparkles size={15} />
            Analyse My Resume with AI
          </motion.button>
        </motion.div>
      )}

      {/* Analyse button when no content yet */}
      {!hasResult && !text.trim() && !hasFile && !loading && (
        <motion.button
          onClick={handleAnalyse}
          disabled
          style={{
            width: '100%', fontSize: '15px', padding: '15px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: '12px', color: 'var(--text-4)',
            fontFamily: FH, fontWeight: '800', cursor: 'not-allowed',
            letterSpacing: '-0.015em',
          }}
        >
          <Sparkles size={15} />
          Analyse My Resume with AI
        </motion.button>
      )}

      {/* Clean loader */}
      {loading && <CleanLoader name="" />}

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: '#FCA5A5', display: 'flex', gap: '8px', alignItems: 'flex-start', fontFamily: FB }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '1px' }} /><span>{error}</span>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <ResultDisplay result={result} onCertSelected={onCertSelected} mode={mode} onClear={clearAll} />
        )}
      </AnimatePresence>

    </div>
  )
}

export default ResumeAnalyzer