import { motion, useScroll, AnimatePresence } from 'framer-motion'
import React, { useRef, useState, useEffect, createContext, useContext } from 'react'
import { ArrowRight, ChevronDown, BarChart2, CheckCircle2 } from 'lucide-react'
import DynamicIslandNav from './DynamicIslandNav'

// ─────────────────────────────────────────────────────────
// THEME SYSTEM
// ─────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    name: 'dark',
    bg: '#080808',
    bgAlt: '#0E0E0E',
    surface: '#111111',
    text: '#F0F0F0',
    text2: '#999999',
    text3: '#666666',
    text4: '#333333',
    gold: '#C9A84C',
    goldL: '#E0C068',
    err: '#D94848',
    line: '#1A1A1A',
    lineHeavy: '#2A2A2A',
    border: 'rgba(255,255,255,0.07)',
    borderMid: 'rgba(255,255,255,0.12)',
    btnFill: '#C9A84C',
    btnText: '#080808',
    certBg: '#0A0A0A',
    glass: 'rgba(8, 8, 8, 0.7)',
  },
  light: {
    name: 'light',
    bg: '#F2F0EC',
    bgAlt: '#EAE7E2',
    surface: '#FAFAF8',
    text: '#111111',
    text2: '#555555',
    text3: '#888888',
    text4: '#BBBBBB',
    gold: '#A07828',
    goldL: '#C9A84C',
    err: '#C93636',
    line: '#DDD9D3',
    lineHeavy: '#C5C0B8',
    border: 'rgba(0,0,0,0.07)',
    borderMid: 'rgba(0,0,0,0.14)',
    btnFill: '#111111',
    btnText: '#F2F0EC',
    certBg: '#F8F8F6',
    glass: 'rgba(242, 240, 236, 0.75)',
  }
}

const ThemeContext = createContext(THEMES.dark)
function useTheme() { return useContext(ThemeContext) || THEMES.dark }

// ─────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [m, setM] = useState(false)
  useEffect(() => {
    const check = () => setM(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return m
}

// ─────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────
const F_SERIF = "'EB Garamond', 'Cormorant Garamond', Georgia, serif"
const F_SANS  = "'Inter', 'DM Sans', sans-serif"
const F_MONO  = "'JetBrains Mono', 'IBM Plex Mono', monospace"

const RISE = {
  hidden: { y: 32, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}

// ─────────────────────────────────────────────────────────
// UI PRIMITIVES
// ─────────────────────────────────────────────────────────
function CountUp({ end, prefix = '', suffix = '', duration = 1.6 }) {
  const [count, setCount] = useState(0)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!on) return
    const endVal = parseFloat(String(end).replace(/[^0-9.]/g, ''))
    const frames = Math.round(duration * 60)
    let f = 0
    const t = setInterval(() => {
      f++
      const ease = 1 - Math.pow(1 - f / frames, 3)
      setCount(endVal * ease)
      if (f >= frames) { setCount(endVal); clearInterval(t) }
    }, 1000 / 60)
    return () => clearInterval(t)
  }, [on, end, duration])
  return (
    <motion.span onViewportEnter={() => setOn(true)}>
      {prefix}{count.toLocaleString('en-IN', { maximumFractionDigits: String(end).includes('.') ? 1 : 0 })}{suffix}
    </motion.span>
  )
}

function GoldBtn({ onClick, children, large }) {
  const C = useTheme()
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '12px',
        padding: large ? '0 36px' : '0 24px',
        height: large ? '60px' : '48px',
        background: C.btnFill, color: C.btnText,
        border: 'none', borderRadius: '3px',
        fontSize: large ? '13px' : '11px',
        fontFamily: F_SANS, fontWeight: '700',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: `0 6px 20px ${C.name === 'dark' ? 'rgba(201,168,76,0.12)' : 'rgba(0,0,0,0.08)'}`
      }}
    >
      {children}
    </motion.button>
  )
}

function Section({ children, bg, border = true, id, label }) {
  const C = useTheme()
  const isMobile = useIsMobile()
  return (
    <div style={{
      background: bg || C.bg,
      borderTop: border ? `1px solid ${C.border}` : 'none',
      padding: isMobile ? '72px 24px' : '120px 8vw',
      position: 'relative'
    }}>
      {label && (
        <div style={{
          fontFamily: F_MONO, fontSize: '10px', color: C.text3,
          letterSpacing: '0.2em', marginBottom: '48px',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          {id && <span style={{ color: C.gold }}>{id}</span>}
          {id && <span style={{ color: C.text4 }}>/</span>}
          {label}
        </div>
      )}
      {children}
    </div>
  )
}

function GlassPill({ children }) {
  const C = useTheme()
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '10px',
      padding: '6px 16px', borderRadius: '24px',
      background: C.glass,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: `1px solid ${C.borderMid}`,
    }}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// TRUST BAR (static, not scrolling)
// ─────────────────────────────────────────────────────────
function TrustBar() {
  const C = useTheme()
  const isMobile = useIsMobile()
  const sources = ['Naukri', 'AmbitionBox', 'LinkedIn India', 'NASSCOM', 'PayScale India']
  return (
    <div style={{
      borderBottom: `1px solid ${C.border}`,
      background: C.bgAlt,
      padding: '14px 0',
      display: 'flex', alignItems: 'center',
      justifyContent: isMobile ? 'center' : 'flex-start',
      gap: isMobile ? '16px' : '0',
      overflowX: 'auto',
    }}>
      <div style={{
        fontFamily: F_MONO, fontSize: '9px', color: C.text3,
        letterSpacing: '0.15em', whiteSpace: 'nowrap',
        paddingLeft: isMobile ? '24px' : '8vw', paddingRight: '24px',
        borderRight: `1px solid ${C.border}`,
        marginRight: '24px',
      }}>
        DATA_SOURCES
      </div>
      <div style={{ display: 'flex', gap: '32px', paddingLeft: isMobile ? '0' : '0', flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
        {sources.map((s, i) => (
          <span key={i} style={{
            fontFamily: F_SANS, fontSize: '11px', color: C.text2,
            fontWeight: '500', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <CheckCircle2 size={10} color={C.gold} style={{ opacity: 0.6 }} />
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// NUMBERS BLOCK
// ─────────────────────────────────────────────────────────
function NumbersBlock() {
  const C = useTheme()
  const isMobile = useIsMobile()
  const metrics = [
    { value: <CountUp end={14.2} />, suffix: 'L', prefix: '₹', label: '5-year net gain', sub: 'AWS Solutions Architect · BLR', big: true },
    { value: <CountUp end={6} />, suffix: ' MO', label: 'Payback period', sub: 'From exam fee to profitable' },
    { value: <CountUp end={35} />, suffix: '%', label: 'Salary delta', sub: 'Before vs after certification' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'auto 1px auto 1px auto',
      gap: '0',
      alignItems: 'stretch',
    }}>
      {metrics.map((m, i) => (
        <React.Fragment key={i}>
          <motion.div
            variants={RISE} initial="hidden" whileInView="show"
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            style={{
              padding: isMobile ? '32px 0' : '48px 48px',
              borderBottom: isMobile ? `1px solid ${C.border}` : 'none',
            }}
          >
            <div style={{
              fontFamily: F_MONO,
              fontSize: m.big ? 'clamp(3rem, 7vw, 5.5rem)' : 'clamp(2rem, 5vw, 3.5rem)',
              color: C.text, lineHeight: 1,
              letterSpacing: '-0.04em', fontWeight: '500',
              display: 'flex', alignItems: 'baseline',
            }}>
              {m.prefix && <span style={{
                fontSize: m.big ? 'clamp(1.8rem, 4vw, 3rem)' : 'clamp(1.2rem, 3vw, 2rem)',
                color: C.gold, marginRight: '2px',
              }}>{m.prefix}</span>}
              {m.value}
              <span style={{
                fontSize: m.big ? 'clamp(1.8rem, 4vw, 3rem)' : 'clamp(1.2rem, 3vw, 2rem)',
                color: C.gold, marginLeft: '2px',
              }}>{m.suffix}</span>
            </div>
            <div style={{
              fontFamily: F_SANS, fontSize: '14px', color: C.text2,
              fontWeight: '500', marginTop: '12px'
            }}>{m.label}</div>
            <div style={{
              fontFamily: F_MONO, fontSize: '10px', color: C.text3,
              letterSpacing: '0.05em', marginTop: '6px'
            }}>{m.sub}</div>
          </motion.div>
          {!isMobile && i < metrics.length - 1 && (
            <div style={{ width: '1px', background: C.border }} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CERT ASSEMBLY (tighter, faster)
// ─────────────────────────────────────────────────────────
function CertAssembly() {
  const C = useTheme()
  const isMobile = useIsMobile()
  const trackRef = useRef(null)
  const { scrollY } = useScroll()
  const [prog, setProg] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = trackRef.current; if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      if (total <= 0) return
      setProg(Math.max(0, Math.min(1, -rect.top / total)))
    }
    const unsub = scrollY.on('change', update)
    update()
    return unsub
  }, [scrollY])

  const remap = (p, a, b, c, d) => c + (d - c) * Math.max(0, Math.min(1, (p - a) / (b - a)))
  const p8 = remap(prog, 0, 0.75, 0, 1)

  let l1, l2
  if (isMobile) {
    l1 = `translateY(${remap(p8, 0, 1, -40, 0)}px) rotateZ(${remap(p8, 0, 1, 2, 0)}deg)`
    l2 = `translateY(${remap(p8, 0, 1, 40, 0)}px) rotateZ(${remap(p8, 0, 1, -1.5, 0)}deg)`
  } else {
    l1 = `perspective(1200px) translateZ(${remap(p8, 0, 1, -220, 0)}px) translateY(${remap(p8, 0, 1, -60, 0)}px) rotateY(${remap(p8, 0, 1, 28, 0)}deg) rotateX(${remap(p8, 0, 1, 12, 0)}deg)`
    l2 = `perspective(1200px) translateZ(${remap(p8, 0, 1, 220, 0)}px) translateY(${remap(p8, 0, 1, 60, 0)}px) rotateY(${remap(p8, 0, 1, -22, 0)}deg) rotateX(${remap(p8, 0, 1, -9, 0)}deg)`
  }

  const certScale = prog < 0.75 ? remap(prog, 0, 0.75, 0.65, 1.0) : remap(prog, 0.75, 1.0, 1.0, 0.9)
  const certOpacity = prog < 0.04 ? remap(prog, 0, 0.04, 0, 1) : prog > 0.88 ? remap(prog, 0.88, 1.0, 1, 0.3) : 1
  const hintOp = prog > 0.14 ? 0 : prog > 0.05 ? remap(prog, 0.05, 0.14, 1, 0) : 1
  const cardW = isMobile ? 'min(300px, 85vw)' : 'min(440px, 72vw)'

  return (
    <div ref={trackRef} style={{ height: '220vh', position: 'relative', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Label above cert */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: F_MONO, fontSize: '10px', color: C.text3,
            letterSpacing: '0.2em', marginBottom: '32px',
            zIndex: 5, pointerEvents: 'none',
          }}
        >
          THIS IS YOUR OUTPUT
        </motion.div>

        <div style={{ position: 'relative', zIndex: 4 }}>
          <div style={{ transform: `scale(${certScale})`, opacity: certOpacity }}>
            <div style={{ position: 'relative', width: cardW, height: `calc(${cardW} / 1.414)`, transformStyle: 'preserve-3d' }}>
              {/* Layer 1: Border frame */}
              <div style={{ position: 'absolute', inset: 0, transform: l1 }}>
                <svg viewBox="0 0 480 340" width="100%" height="100%" style={{ display: 'block' }}>
                  <defs>
                    <linearGradient id="certBordX" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={C.text4} />
                      <stop offset="50%" stopColor={C.gold} />
                      <stop offset="100%" stopColor={C.gold} />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="480" height="340" fill={C.certBg} style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.5))' }} />
                  <rect x="1.5" y="1.5" width="477" height="337" fill="none" stroke="url(#certBordX)" strokeWidth="1.5" />
                  <rect x="10" y="10" width="460" height="320" fill="none" stroke={C.borderMid} strokeWidth="0.7" />
                </svg>
              </div>
              {/* Layer 2: Content */}
              <div style={{
                position: 'absolute', inset: 0, transform: l2,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '32px',
              }}>
                <div style={{ fontFamily: F_MONO, fontSize: '9px', color: C.gold, letterSpacing: '0.2em', marginBottom: '14px' }}>CERTIFYROI · ROUTE ANALYSIS</div>
                <div style={{ fontFamily: F_SERIF, fontWeight: '400', fontSize: 'clamp(1.3rem, 3vw, 2.2rem)', color: C.text, marginBottom: '4px', textAlign: 'center', lineHeight: 1.1 }}>Route Briefing</div>
                <div style={{ fontFamily: F_SANS, fontSize: '11px', color: C.text3, marginBottom: '28px', textAlign: 'center' }}>Personalised · India 2026</div>
                <div style={{ display: 'flex', gap: '28px', marginBottom: '20px', width: '100%', justifyContent: 'center' }}>
                  {[
                    { l: 'PAYBACK', v: '6 mo' },
                    { l: '5-YR GAIN', v: '₹14.2L', c: C.gold },
                    { l: 'DELTA', v: '+35%' },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: F_MONO, fontSize: '8px', color: C.text4, letterSpacing: '0.1em', marginBottom: '6px' }}>{s.l}</div>
                      <div style={{ fontFamily: F_MONO, fontSize: 'clamp(0.9rem, 2.5vw, 1.4rem)', color: s.c || C.text, fontWeight: '600' }}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ width: '70%', height: '1px', background: C.borderMid, marginBottom: '12px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={10} color={C.gold} />
                  <span style={{ fontFamily: F_MONO, fontSize: '8px', color: C.text3, letterSpacing: '0.1em' }}>CALCULATED FROM YOUR INPUTS</span>
                </div>
              </div>
            </div>
          </div>
          {/* Scroll hint */}
          <div style={{ opacity: hintOp, marginTop: '32px', textAlign: 'center', pointerEvents: 'none' }}>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '9px', color: C.text3, letterSpacing: '0.2em' }}>↓ SCROLL TO ASSEMBLE ↓</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// HOW IT WORKS (includes modes)
// ─────────────────────────────────────────────────────────
function HowItWorks({ onEnter }) {
  const C = useTheme()
  const isMobile = useIsMobile()
  const steps = [
    { num: '01', title: 'Basecamp', sub: 'Your starting point', desc: 'Enter your salary, role, and city. Upload your resume. AI sets your current elevation.', modes: null },
    { num: '02', title: 'Route', sub: 'Choose or discover', desc: 'Select a certification or let AI recommend the highest-ROI path. Compare up to three routes side by side.', modes: ['Student', 'Switcher', 'Professional'] },
    { num: '03', title: 'Summit', sub: 'Know before you climb', desc: 'Exact payback month. 5-year net gain. Monthly delta. A clear verdict: worth it or not.', modes: null },
  ]

  return (
    <Section id="03" label="HOW IT WORKS" bg={C.surface} border>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2 style={{
          fontFamily: F_SANS, fontWeight: '700',
          fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
          color: C.text, letterSpacing: '-0.03em',
          lineHeight: 1.08, margin: '0 0 56px',
        }}>
          Three stages.<br />One clear answer.
        </h2>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '0',
      }}>
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            variants={RISE} initial="hidden" whileInView="show"
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            style={{
              padding: '40px 0',
              paddingLeft: i > 0 ? '40px' : '0',
              borderLeft: i > 0 ? `1px solid ${C.border}` : 'none',
            }}
          >
            <div style={{
              fontFamily: F_MONO, fontSize: '28px',
              color: C.gold, fontWeight: '700',
              lineHeight: 1, marginBottom: '20px',
            }}>{s.num}</div>
            <div style={{
              fontFamily: F_SANS, fontWeight: '700',
              fontSize: '18px', color: C.text,
              marginBottom: '6px', letterSpacing: '-0.02em',
            }}>{s.title}</div>
            <div style={{
              fontFamily: F_MONO, fontSize: '10px', color: C.text3,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: '16px',
            }}>{s.sub}</div>
            <div style={{
              fontFamily: F_SANS, fontSize: '14px',
              color: C.text2, lineHeight: '1.65',
            }}>{s.desc}</div>
            {s.modes && (
              <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {s.modes.map(mode => (
                  <span key={mode} style={{
                    fontFamily: F_MONO, fontSize: '9px',
                    color: C.gold, letterSpacing: '0.1em',
                    padding: '4px 10px',
                    border: `1px solid ${C.borderMid}`,
                    borderRadius: '2px',
                  }}>{mode}</span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginTop: '48px' }}>
        <GoldBtn onClick={onEnter} large>Calculate ROI <ArrowRight size={15} /></GoldBtn>
      </motion.div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// VS SECTION
// ─────────────────────────────────────────────────────────
function VsSection() {
  const C = useTheme()
  const pairs = [
    { wrong: '"AWS is good for cloud engineers"', right: 'AWS SAA at ₹9L salary: payback month 6. ₹14.2L net gain over 5 years. Or it isn\'t worth it for you.' },
    { wrong: '"Upskill for career growth"', right: '₹23,600 extra every month from month 7 — compounding over 5 years. In rupees, not "growth."' },
    { wrong: 'US salary data converted to rupees', right: 'Naukri · AmbitionBox · LinkedIn India. Updated quarterly. Not converted from San Francisco.' },
  ]

  return (
    <Section id="04" label="WHY THIS EXISTS" border>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2 style={{
          fontFamily: F_SANS, fontWeight: '700',
          fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
          color: C.text, letterSpacing: '-0.03em',
          lineHeight: 1.08, margin: '0 0 56px',
        }}>
          Every other guide<br />points you wrong.
        </h2>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {pairs.map((pair, i) => (
          <motion.div
            key={i}
            variants={RISE} initial="hidden" whileInView="show"
            viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            style={{
              paddingTop: i > 0 ? '36px' : '0',
              paddingBottom: i < pairs.length - 1 ? '36px' : '0',
              borderBottom: i < pairs.length - 1 ? `1px solid ${C.border}` : 'none',
            }}
          >
            <div style={{
              fontFamily: F_SANS, fontWeight: '500',
              fontSize: '16px', color: C.text3,
              textDecoration: 'line-through', opacity: 0.5,
              marginBottom: '10px',
            }}>{pair.wrong}</div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '3px', height: '14px', background: C.gold, marginTop: '5px', flexShrink: 0 }} />
              <div style={{
                fontFamily: F_SANS, fontSize: '15px',
                color: C.text, lineHeight: '1.55',
              }}>{pair.right}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// SOCIAL PROOF (moved up, tightened)
// ─────────────────────────────────────────────────────────
function SocialProof({ onEnter }) {
  const C = useTheme()
  const isMobile = useIsMobile()
  const quotes = [
    { quote: 'CertifyROI said payback was month 8. It was month 7. Switched companies immediately.', name: 'Priya S.', detail: 'Bangalore · Engineer → Cloud Architect', result: '+₹6L/yr' },
    { quote: 'Was about to spend ₹12L on an MBA. The analysis showed a different path — 5 months, 1% of the cost.', name: 'Rahul M.', detail: 'Hyderabad · Ops Manager → Data Analyst', result: 'Saved ₹12L' },
    { quote: 'Student Mode showed me GCP had placed 47 freshers in Pune last quarter. My ₹5.2L offer was one of them.', name: 'Ananya K.', detail: 'Pune · Fresh Graduate', result: '₹5.2L offer' },
  ]

  return (
    <Section id="05" label="FIELD REPORTS" bg={C.surface} border>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2 style={{
          fontFamily: F_SANS, fontWeight: '700',
          fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
          color: C.text, letterSpacing: '-0.03em',
          lineHeight: 1.08, margin: '0 0 56px',
        }}>
          They used it.<br /><span style={{ color: C.gold }}>It worked.</span>
        </h2>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {quotes.map((q, i) => {
          const isLast = i === quotes.length - 1
          return (
            <motion.div
              key={i}
              variants={RISE} initial="hidden" whileInView="show"
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              style={{
                paddingTop: i > 0 ? '40px' : '0',
                paddingBottom: !isLast ? '40px' : '0',
                borderBottom: !isLast ? `1px solid ${C.border}` : 'none',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr auto',
                gap: '20px', alignItems: 'end',
              }}
            >
              <div>
                <div style={{
                  fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400',
                  fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
                  color: C.text, lineHeight: 1.35, marginBottom: '20px',
                }}>"{q.quote}"</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ width: '16px', height: '2px', background: C.gold, flexShrink: 0 }} />
                  <span style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: '13px', color: C.text }}>{q.name}</span>
                  <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3 }}>{q.detail}</span>
                </div>
              </div>
              <div style={{
                fontFamily: F_MONO, fontWeight: '600',
                fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                color: C.text, letterSpacing: '-0.03em',
                lineHeight: 1, textAlign: isMobile ? 'left' : 'right',
                whiteSpace: 'nowrap',
              }}>{q.result}</div>
            </motion.div>
          )
        })}
      </div>

      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginTop: '48px' }}>
        <GoldBtn onClick={onEnter}>Calculate Your ROI <ArrowRight size={15} /></GoldBtn>
      </motion.div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: 'How accurate are the ROI calculations?', a: 'Based on median salary data from Naukri, AmbitionBox, and LinkedIn India — updated quarterly. Directional estimates, not guarantees.' },
  { q: 'Do I need to create an account?', a: 'No. The ROI calculator, comparison tool, and demand heatmap are free with no signup. AI features use free credits.' },
  { q: 'What certifications are covered?', a: '103 certifications across 17 domains — cloud, data analytics, cybersecurity, finance (CFA, CA), project management, and more.' },
  { q: 'Is this only useful for India?', a: 'Salary benchmarks and demand data are India-specific. The framework applies anywhere, but numbers are calibrated for India.' },
]

function FAQItem({ item }) {
  const C = useTheme()
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '20px 0', background: 'none',
          border: 'none', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '16px',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: F_SANS, fontWeight: '600',
          fontSize: '15px', color: C.text,
          letterSpacing: '-0.01em', lineHeight: 1.4,
        }}>{item.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0 }}>
          <ChevronDown size={16} color={C.text3} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="ans"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              paddingBottom: '20px', fontFamily: F_SANS,
              fontSize: '14px', color: C.text2,
              lineHeight: '1.65', maxWidth: '64ch',
            }}>{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQ() {
  const C = useTheme()
  const isMobile = useIsMobile()
  return (
    <Section id="06" label="QUESTIONS" border>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '240px 1fr',
        gap: isMobile ? '40px' : '64px',
        alignItems: 'start',
      }}>
        <div style={{ position: isMobile ? 'static' : 'sticky', top: '140px' }}>
          <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{
              fontFamily: F_SANS, fontWeight: '700',
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              color: C.text, letterSpacing: '-0.025em',
              lineHeight: 1.15, margin: '0',
            }}>
            Common<br />questions.
          </motion.h2>
        </div>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {FAQ_ITEMS.map((item, i) => <FAQItem key={i} item={item} />)}
        </motion.div>
      </div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────
function FinalCTA({ onEnter }) {
  const C = useTheme()

  return (
    <Section id="07" label="SUMMIT" bg={C.surface} border={false}>
      {/* Subtle topographic lines */}
      <div style={{
        position: 'absolute', right: '-100px', top: '-100px',
        width: '400px', height: '400px',
        pointerEvents: 'none', opacity: 0.15,
      }}>
        <svg width="400" height="400" viewBox="0 0 400 400">
          {[50, 100, 150, 200, 250].map((r, i) => (
            <circle key={i} cx="400" cy="0" r={r} fill="none" stroke={C.lineHeavy} strokeWidth="1" />
          ))}
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px' }}>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{
            fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400',
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            color: C.text, letterSpacing: '-0.02em',
            lineHeight: 0.96, margin: '0 0 28px',
          }}>
          You'll know<br />the answer.
        </motion.h2>
        <motion.p variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.08 }}
          style={{
            fontFamily: F_SANS, fontSize: '15px',
            color: C.text2, lineHeight: '1.65',
            maxWidth: '42ch', margin: '0 0 40px',
          }}>
          Stop reading generic advice. Stop asking Reddit.{' '}
          <span style={{ color: C.text, fontWeight: '600' }}>Know the exact payback period before you pay the exam fee.</span>
        </motion.p>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.16 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}
        >
          <GoldBtn onClick={onEnter} large>Calculate ROI <ArrowRight size={15} /></GoldBtn>
          <GlassPill>
            <div style={{ display: 'flex', gap: '3px' }}>
              <div style={{ width: '4px', height: '10px', background: C.gold }} />
              <div style={{ width: '4px', height: '10px', background: C.gold, opacity: 0.35 }} />
            </div>
            <span style={{ fontFamily: F_MONO, fontSize: '9px', color: C.text, letterSpacing: '0.15em' }}>FREE · NO ACCOUNT · INDIA DATA</span>
          </GlassPill>
        </motion.div>
      </div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────
function Footer() {
  const C = useTheme()
  const isMobile = useIsMobile()
  return (
    <div style={{
      borderTop: `1px solid ${C.border}`,
      padding: '28px 0', background: C.bgAlt,
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto',
        padding: isMobile ? '0 24px' : '0 8vw',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={14} color={C.gold} />
          <span style={{ fontFamily: F_SANS, fontWeight: '700', fontSize: '13px', color: C.text }}>
            Certify<span style={{ color: C.gold }}>ROI</span>
          </span>
        </div>
        <div style={{ fontFamily: F_MONO, fontSize: '9px', color: C.text4, letterSpacing: '0.1em' }}>
          DATA: LINKEDIN · NASSCOM · NAUKRI · 2026
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(true)
  const C = isDark ? THEMES.dark : THEMES.light
  const isMobile = useIsMobile()

  const onEnter = () => { console.log('ROI Calculation triggered') }

  return (
    <ThemeContext.Provider value={C}>
      <div style={{
        minHeight: '100vh', background: C.bg, color: C.text,
        overflowX: 'clip',
        transition: 'background 0.3s ease, color 0.3s ease',
      }}>

        <DynamicIslandNav isDark={isDark} toggleTheme={() => setIsDark(!isDark)} onEnter={onEnter} />

        {/* ── HERO ── */}
        <div style={{
          position: 'relative',
          height: '100vh', minHeight: isMobile ? '100svh' : '720px',
          display: 'flex', alignItems: 'flex-end',
          overflow: 'hidden',
        }}>
          {/* Mountain: full bleed background */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
          }}>
            <img
              src="/mountain.png"
              alt=""
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center 30%',
                filter: C.name === 'dark' ? 'brightness(0.35) contrast(1.1)' : 'brightness(0.85) contrast(1.05)',
              }}
            />
            {/* Gradient overlay for text readability */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(to top, ${C.bg} 0%, ${C.bg}88 40%, transparent 80%)`,
            }} />
          </div>

          {/* Hero content */}
          <div style={{
            position: 'relative', zIndex: 2,
            width: '100%',
            padding: isMobile ? '0 24px 48px' : '0 8vw 80px',
            maxWidth: '1400px', margin: '0 auto',
          }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{
                fontFamily: F_MONO, fontSize: '10px', color: C.text3,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                marginBottom: '24px',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}
            >
              <div style={{ width: '24px', height: '1px', background: C.gold }} />
              ROI Analysis for Indian Professionals
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08 }}
              style={{
                fontFamily: F_SERIF, fontWeight: '400',
                fontSize: isMobile ? 'clamp(2.8rem, 10vw, 4.5rem)' : 'clamp(4rem, 7.5vw, 7.5rem)',
                lineHeight: 0.94, letterSpacing: '-0.025em',
                color: C.text, marginBottom: '24px',
                maxWidth: '13ch',
              }}
            >
              Your next cert<br />
              is either a <span style={{ color: C.gold, fontStyle: 'italic' }}>goldmine</span><br />
              or a <span style={{ color: C.text3, fontStyle: 'italic' }}>mistake.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              style={{
                fontFamily: F_SANS,
                fontSize: isMobile ? '14px' : '16px',
                color: C.text2, maxWidth: '380px',
                lineHeight: '1.6', margin: '0 0 36px',
              }}
            >
              Payback period. 5-year gain. Monthly delta. Calculated for your city and salary — not converted from San Francisco.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}
            >
              <GoldBtn onClick={onEnter} large>Calculate ROI <ArrowRight size={15} /></GoldBtn>
              <GlassPill>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <div style={{ width: '4px', height: '10px', background: C.gold }} />
                  <div style={{ width: '4px', height: '10px', background: C.gold, opacity: 0.35 }} />
                </div>
                <span style={{ fontFamily: F_MONO, fontSize: '9px', color: C.text, letterSpacing: '0.15em' }}>FREE · NO ACCOUNT · INDIA DATA</span>
              </GlassPill>
            </motion.div>
          </div>
        </div>

        {/* ── TRUST BAR ── */}
        <TrustBar />

        {/* ── NUMBERS ── */}
        <Section border bg={C.bgAlt}>
          <NumbersBlock />
        </Section>

        {/* ── CERT ASSEMBLY ── */}
        <CertAssembly />

        {/* ── HOW IT WORKS ── */}
        <HowItWorks onEnter={onEnter} />

        {/* ── VS ── */}
        <VsSection />

        {/* ── SOCIAL PROOF ── */}
        <SocialProof onEnter={onEnter} />

        {/* ── FAQ ── */}
        <FAQ />

        {/* ── FINAL CTA ── */}
        <FinalCTA onEnter={onEnter} />

        {/* ── FOOTER ── */}
        <Footer />
      </div>
    </ThemeContext.Provider>
  )
}