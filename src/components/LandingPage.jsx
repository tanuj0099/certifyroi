import { motion, useScroll, AnimatePresence } from 'framer-motion'
import React, { useRef, useState, useEffect, createContext, useContext } from 'react'
import { ArrowRight, ChevronDown, Sun, Moon, BarChart2, CheckCircle2 } from 'lucide-react'
import DynamicIslandNav from './DynamicIslandNav'

// ─────────────────────────────────────────────────────────
// THEME SYSTEM
// ─────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    name: 'dark',
    bg: '#0A0A0A',
    bgAlt: '#111111',
    surface: '#141414',
    text: '#F5F5F5',
    text2: '#A3A3A3',
    text3: '#737373',
    text4: '#404040',
    green: '#2A5C42',
    greenVivid: '#4A9068',
    gold: '#D4AF37', 
    goldL: '#F4CE56',
    err: '#D94848',
    line: '#262626',
    lineHeavy: '#333333',
    border: 'rgba(255,255,255,0.08)',
    borderMid: 'rgba(255,255,255,0.15)',
    btnFill: '#D4AF37',
    btnText: '#000000',
    certBg: '#050505',
    glass: 'rgba(10, 10, 10, 0.5)',
  },
  light: {
    name: 'light',
    bg: '#F4F2EE',
    bgAlt: '#EBE8E3',
    surface: '#FFFFFF',
    text: '#121212',
    text2: '#525252',
    text3: '#858585',
    text4: '#A3A3A3',
    green: '#2A5C42',
    greenVivid: '#3D7A5A',
    gold: '#B3862A',
    goldL: '#D4AF37',
    err: '#C93636',
    line: '#E0DCD6',
    lineHeavy: '#C2BCB3',
    border: 'rgba(0,0,0,0.08)',
    borderMid: 'rgba(0,0,0,0.18)',
    btnFill: '#121212',
    btnText: '#FFFFFF',
    certBg: '#FAFAFA',
    glass: 'rgba(244, 242, 238, 0.6)',
  }
}

const ThemeContext = createContext(THEMES.dark)

function useTheme() { 
  const context = useContext(ThemeContext)
  return context || THEMES.dark 
}

// ─────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    setMobile(window.innerWidth < 768)
    const check = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  },[])
  return mobile
}

// ─────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────
const F_SERIF = "'EB Garamond', 'Cormorant Garamond', Georgia, serif"
const F_SANS  = "'Inter', 'DM Sans', sans-serif"
const F_MONO  = "'JetBrains Mono', 'IBM Plex Mono', monospace"

const RISE = {
  hidden: { y: 40, opacity: 0 },
  show:   { y: 0, opacity: 1, transition: { duration: 0.8, ease:[0.16, 1, 0.3, 1] } }
}
const SLIDE_L = {
  hidden: { x: -40, opacity: 0 },
  show:   { x: 0, opacity: 1, transition: { duration: 0.8, ease:[0.16, 1, 0.3, 1] } }
}

// ─────────────────────────────────────────────────────────
// UI PRIMITIVES
// ─────────────────────────────────────────────────────────
function CrosshairIcon({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <line x1="6" y1="0" x2="6" y2="12" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="0" y1="6" x2="12" y2="6" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

function CountUp({ end, prefix = '', suffix = '', duration = 1.8 }) {
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
  return <motion.span onViewportEnter={() => setOn(true)}>{prefix}{count.toLocaleString('en-IN', { maximumFractionDigits: String(end).includes('.') ? 1 : 0 })}{suffix}</motion.span>
}

function TechBtn({ onClick = () => {}, children = null, large = false }) {
  const C = useTheme()
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '16px',
        padding: large ? '0 40px' : '0 24px', height: large ? '64px' : '48px',
        background: C.btnFill, color: C.btnText,
        border: 'none', borderRadius: '4px',
        fontSize: large ? '14px' : '12px', fontFamily: F_SANS, fontWeight: '700', 
        letterSpacing: '0.08em', textTransform: 'uppercase',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        boxShadow: `0 8px 24px ${C.name === 'dark' ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.1)'}`
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: C.bg, opacity: 0.2 }} />
      {children}
    </motion.button>
  )
}

function useGlassStyle() {
  const C = useTheme()
  return {
    background: C.glass || 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    border: `1px solid ${C.borderMid || 'rgba(255,255,255,0.1)'}`,
    boxShadow: `0 8px 32px ${C.name === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`
  }
}

// ─────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────
function StorySection({ id = '', title = '', children = null, bg = '', noBorderTop = false }) {
  const C = useTheme()
  const isMobile = useIsMobile()

  return (
    <div style={{ background: bg || C.bg, borderTop: noBorderTop ? 'none' : `1px solid ${C.border}`, position: 'relative' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        
        {!isMobile && (
          <div style={{ width: '160px', flexShrink: 0, borderRight: `1px solid ${C.border}`, position: 'relative' }}>
            <div style={{ position: 'sticky', top: '160px', padding: '40px 0', display: 'flex', alignItems: 'center', flexDirection: 'column', height: '400px' }}>
              <CrosshairIcon color={C.text4} />
              <div style={{ width: '1px', flex: 1, background: C.border, margin: '20px 0' }} />
              <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: F_MONO, fontSize: '11px', color: C.text3, letterSpacing: '0.2em' }}>
                <span style={{ color: C.gold, fontWeight: '600' }}>{id}</span> // {title}
              </div>
              <div style={{ width: '1px', flex: 1, background: C.border, margin: '20px 0' }} />
              <CrosshairIcon color={C.text4} />
            </div>
          </div>
        )}

        <div style={{ flex: 1, padding: isMobile ? '60px 24px' : '120px 8vw', position: 'relative', overflow: 'hidden' }}>
          {isMobile && (
            <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.gold, fontWeight: '600', letterSpacing: '0.15em' }}>{id}</div>
              <div style={{ height: '1px', flex: 1, background: C.border }} />
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.15em' }}>{title}</div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

function TrustStrip() {
  const C = useTheme()
  const items =[
    { tag: 'SYS.CLOUD',   text: 'AWS cert holders earn ₹2.4L more/yr in Bangalore' },
    { tag: 'SYS.DEMAND',  text: '2,400+ cloud roles open on Naukri right now' },
    { tag: 'SYS.FINANCE', text: 'Average PMP payback period: 7 months' },
    { tag: 'SYS.DATA',    text: 'Google Analytics · ₹18K invested → ₹3.2L annual gain' },
    { tag: 'SYS.DEVOPS',  text: 'CKA Kubernetes: highest ROI cert in India 2026' },
  ]
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, background: C.bgAlt, position: 'relative', zIndex: 10, height: '48px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, background: C.bgAlt, zIndex: 11, borderRight: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 24px', boxShadow: `20px 0 20px -10px ${C.bgAlt}` }}>
        <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.gold, letterSpacing: '0.2em' }}>MARKET_DATA</span>
      </div>
      <div style={{ flex: 1, paddingLeft: '160px' }}>
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', width: 'max-content' }}>
          {[...items, ...items, ...items].map((item, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', height: '48px', borderRight: `1px solid ${C.border}`, padding: '0 40px' }}>
              <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, marginRight: '16px', letterSpacing: '0.1em' }}>[{item.tag}]</span>
              <span style={{ fontFamily: F_SANS, fontSize: '12px', color: C.text2, letterSpacing: '0.02em', fontWeight: '500' }}>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function CertAssembly() {
  const C = useTheme()
  const isMobile = useIsMobile()
  const trackRef = useRef(null)
  const { scrollY } = useScroll()
  const[prog, setProg] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = trackRef.current; if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      if (total <= 0) return
      const p = Math.max(0, Math.min(1, -rect.top / total))
      setProg(p)
    }
    const unsub = scrollY.on('change', update)
    update()
    return unsub
  }, [scrollY])

  const remap = (p, a, b, c, d) => c + (d - c) * Math.max(0, Math.min(1, (p - a) / (b - a)))

  const p8 = remap(prog, 0, 0.8, 0, 1)
  let l1, l2
  if (isMobile) {
    l1 = `translateY(${remap(p8, 0, 1, -45, 0)}px) rotateZ(${remap(p8, 0, 1, 2.5, 0)}deg)`
    l2 = `translateY(${remap(p8, 0, 1, 45, 0)}px) rotateZ(${remap(p8, 0, 1, -2, 0)}deg)`
  } else {
    l1 = `perspective(1200px) translateZ(${remap(p8, 0, 1, -260, 0)}px) translateY(${remap(p8, 0, 1, -75, 0)}px) rotateY(${remap(p8, 0, 1, 30, 0)}deg) rotateX(${remap(p8, 0, 1, 14, 0)}deg)`
    l2 = `perspective(1200px) translateZ(${remap(p8, 0, 1, 260, 0)}px) translateY(${remap(p8, 0, 1, 75, 0)}px) rotateY(${remap(p8, 0, 1, -24, 0)}deg) rotateX(${remap(p8, 0, 1, -11, 0)}deg)`
  }

  const certScale = prog < 0.8 ? remap(prog, 0, 0.8, 0.62, 1.0) : remap(prog, 0.8, 1.0, 1.0, 0.85)
  const certOpacity = prog < 0.05 ? remap(prog, 0, 0.05, 0, 1) : prog > 0.85 ? remap(prog, 0.85, 1.0, 1, 0) : 1
  const hintOp = prog > 0.16 ? 0 : prog > 0.06 ? remap(prog, 0.06, 0.16, 1, 0) : 1
  const assembledOp = remap(prog, 0.78, 0.88, 0, 1)
  const cardW = isMobile ? 'min(320px,88vw)' : 'min(460px,80vw)'

  return (
    <div ref={trackRef} style={{ height: '300vh', position: 'relative', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
      {!isMobile && (
        <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
           <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', height: '100%' }}>
              <div style={{ position: 'absolute', left: '160px', top: 0, bottom: 0, width: '1px', background: C.border, zIndex: 0 }} />
           </div>
        </div>
      )}

      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: C.bg, opacity: 0.96 }} />
        <div style={{ position: 'relative', zIndex: 4 }}>
          <div style={{ transform: `scale(${certScale})`, opacity: certOpacity }}>
            <div style={{ position: 'relative', width: cardW, height: `calc(${cardW} / 1.414)`, transformStyle: 'preserve-3d' }}>
              <div style={{ position: 'absolute', inset: 0, transform: l1 }}>
                <svg viewBox="0 0 480 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0, display: 'block' }}>
                  <defs>
                    <linearGradient id="certBordX" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={C.text4} />
                      <stop offset="50%" stopColor={C.gold} />
                      <stop offset="100%" stopColor={C.gold} />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="480" height="340" rx="0" fill={C.certBg} style={{ filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.5))' }} />
                  <rect x="1.5" y="1.5" width="477" height="337" rx="0" fill="none" stroke="url(#certBordX)" strokeWidth="1.5" />
                  <rect x="12" y="12" width="456" height="316" rx="0" fill="none" stroke={C.borderMid} strokeWidth="0.8" />
                </svg>
              </div>
              <div style={{ position: 'absolute', inset: 0, transform: l2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px' }}>
                <div style={{ fontFamily: F_MONO, fontSize: '9px', color: C.gold, letterSpacing: '0.2em', marginBottom: '16px', textTransform: 'uppercase' }}>CERTIFYROI · SYSTEM AUTH</div>
                <div style={{ fontFamily: F_SERIF, fontWeight: '400', fontSize: 'clamp(1.5rem,3.5vw,2.5rem)', color: C.text, marginBottom: '6px', textAlign: 'center', lineHeight: 1.1 }}>Route Briefing</div>
                <div style={{ fontFamily: F_SANS, fontSize: '12px', color: C.text3, marginBottom: '32px', textAlign: 'center' }}>Personalised Analysis · India 2026</div>
                <div style={{ display: 'flex', gap: '32px', marginBottom: '24px', width: '100%', justifyContent: 'center' }}>
                  {[{ l: 'SUMMIT TIME', v: '9 mo', c: C.text }, { l: '5-YR GAIN', v: '₹14.2L', c: C.gold }, { l: 'ELEVATION', v: '+35%', c: C.text }].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: F_MONO, fontSize: '8px', color: C.text4, letterSpacing: '0.1em', marginBottom: '8px' }}>{s.l}</div>
                      <div style={{ fontFamily: F_MONO, fontSize: 'clamp(1rem,2.8vw,1.6rem)', color: s.c, fontWeight: '600', letterSpacing: '-0.02em' }}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ width: '80%', height: '1px', background: C.borderMid, marginBottom: '16px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={12} color={C.gold} />
                  <span style={{ fontFamily: F_MONO, fontSize: '8px', color: C.text3, letterSpacing: '0.1em' }}>VERIFIED · NAUKRI MARCH 2026</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ opacity: hintOp, marginTop: '40px', textAlign: 'center', pointerEvents: 'none', transition: 'opacity 0.3s' }}>
            <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.2em' }}>↓ SCROLL TO ASSEMBLE ↓</div>
            </motion.div>
          </div>
        </div>
        <div style={{ opacity: assembledOp, position: 'absolute', bottom: '10%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 5, transition: 'opacity 0.3s' }}>
          <div style={{ fontFamily: F_MONO, fontSize: '11px', color: C.gold, letterSpacing: '0.2em', background: C.surface, display: 'inline-block', padding: '8px 16px', border: `1px solid ${C.border}` }}>
            ✓ BRIEFING COMPILED
          </div>
        </div>
      </div>
    </div>
  )
}

function DataComposition() {
  const C = useTheme()
  const isMobile = useIsMobile()

  return (
    <StorySection id="02" title="METRICS_LOG" noBorderTop>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <div style={{ fontFamily: F_MONO, fontSize: '11px', color: C.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', background: C.gold }} />
          The numbers behind the route
        </div>
      </motion.div>

      <motion.div variants={SLIDE_L} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginBottom: '64px' }}>
        <div style={{ fontFamily: F_MONO, fontSize: 'clamp(3.5rem,10vw,8rem)', color: C.text, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '500', display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.gold, marginTop: 'clamp(0.5rem, 1vw, 1rem)', marginRight: '4px' }}>₹</span>
          <CountUp end={14.2} />
          <span style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: C.gold, marginTop: 'clamp(0.5rem, 1vw, 1rem)', marginLeft: '4px' }}>L</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: F_SANS, fontWeight: '500', fontSize: 'clamp(1rem,2vw,1.25rem)', color: C.text2 }}>5-year net gain · AWS Solutions Architect</div>
          <div style={{ padding: '4px 8px', background: C.surface, border: `1px solid ${C.border}`, fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em' }}>BLR MEDIAN '26</div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', borderTop: `1px solid ${C.border}` }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ padding: isMobile ? '40px 0' : '56px 64px 56px 0', borderBottom: isMobile ? `1px solid ${C.border}` : 'none', borderRight: isMobile ? 'none' : `1px solid ${C.border}` }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.15em', marginBottom: '16px' }}>// PAYBACK_PERIOD</div>
          <div style={{ fontFamily: F_MONO, fontSize: 'clamp(2.5rem,6vw,4rem)', color: C.text, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: '500', marginBottom: '16px' }}>
            <CountUp end={6} suffix=" MO" />
          </div>
          <div style={{ fontFamily: F_SANS, fontSize: '15px', color: C.text2, lineHeight: '1.7', maxWidth: '38ch' }}>
            Not "a few months." The exact month your investment turns profitable — calculated for your salary and city.
          </div>
        </motion.div>
        
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }}
          style={{ padding: isMobile ? '40px 0' : '56px 0 56px 64px' }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.15em', marginBottom: '16px' }}>// SALARY_DELTA</div>
          <div style={{ fontFamily: F_MONO, fontSize: 'clamp(2.5rem,6vw,4rem)', color: C.text, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: '500', marginBottom: '16px' }}>
            <CountUp end={35} suffix="%" />
          </div>
          <div style={{ fontFamily: F_SANS, fontSize: '15px', color: C.text2, lineHeight: '1.7', maxWidth: '38ch' }}>
            India-sourced. City-specific. Not US data converted at today's rate and called "India salary insights."
          </div>
        </motion.div>
      </div>
    </StorySection>
  )
}

function HowItWorks({ onEnter }) {
  const C = useTheme()
  const isMobile = useIsMobile()
  const steps =[
    { id: '01', label: 'Basecamp', subtitle: 'Where you start', desc: 'Enter your current salary, role, and city. Upload your resume to let AI set your starting elevation.' },
    { id: '02', label: 'Route',    subtitle: 'Choose your path', desc: 'Select a cert or let AI recommend the highest-ROI route. Compare up to three paths side by side.' },
    { id: '03', label: 'Summit',   subtitle: 'Know the outcome', desc: 'Exact payback month, 5-year net gain, monthly delta, and a verdict on whether the climb is worth making.' },
  ]

  return (
    <StorySection id="03" title="SYS_ARCHITECTURE" bg={C.surface}>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2 style={{ fontFamily: F_SANS, fontWeight: '700', fontSize: 'clamp(2rem,5vw,3.5rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          Three stages.<br />One clear answer.
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? '40px' : '40px' }}>
        {steps.map((step, i) => (
          <motion.div key={step.id} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '32px', color: C.gold, fontWeight: '700', lineHeight: 1 }}>{step.id}</div>
              <div style={{ width: '100%', height: '1px', background: C.border }} />
            </div>
            <div style={{ fontFamily: F_SANS, fontWeight: '700', fontSize: '20px', color: C.text, marginBottom: '8px' }}>{step.label}</div>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>{step.subtitle}</div>
            <div style={{ fontFamily: F_SANS, fontSize: '15px', color: C.text2, lineHeight: '1.7' }}>{step.desc}</div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginTop: '64px' }}>
        <TechBtn onClick={onEnter}>Calculate ROI <ArrowRight size={16} /></TechBtn>
      </motion.div>
    </StorySection>
  )
}

function VsSection() {
  const C = useTheme()
  const pairs =[
    { wrong: '"AWS is good for cloud engineers"', right: 'AWS SAA at ₹9L salary: payback month 6. ₹14.2L net gain over 5 years. Or it isn\'t worth it.' },
    { wrong: '"Upskill for career growth"', right: '₹23,600 extra every month from month 7 — compounding over 5 years. In rupees, not "growth."' },
    { wrong: 'US salary data converted to rupees', right: 'Naukri · AmbitionBox · LinkedIn India. 2026 data. Not converted from San Francisco.' },
  ]

  return (
    <StorySection id="04" title="MARKET_HAZARDS" bg={C.bg}>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2 style={{ fontFamily: F_SANS, fontWeight: '700', fontSize: 'clamp(2rem,5vw,3.5rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          Every other guide<br />
          is pointing you wrong.
        </h2>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {pairs.map((pair, i) => (
          <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            
            <div style={{ fontFamily: F_SANS, fontWeight: '500', fontSize: '18px', color: C.text3, letterSpacing: '-0.01em', marginBottom: '12px' }}>
              <span style={{ display: 'inline-block', textDecoration: 'line-through', opacity: 0.6 }}>
                {pair.wrong}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '4px', height: '16px', background: C.gold, marginTop: '4px', flexShrink: 0 }} />
              <div style={{ fontFamily: F_SANS, fontSize: '16px', color: C.text, lineHeight: '1.6', fontWeight: '400' }}>{pair.right}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </StorySection>
  )
}

function ElevenPM({ onEnter }) {
  const C = useTheme()
  const isMobile = useIsMobile()
  const stories =[
    { time: '11:47 PM', name: 'Rohan', loc: 'Pune', role: '2 yrs · Backend Engineer', thought: '"Should I do AWS? Or is it too late?"', context: 'Ex-classmate promoted to Cloud Architect. ₹28L CTC.', answer: 'AWS SAA at ₹9L: payback month 6. 5-year gain ₹14.2L.', color: C.gold },
    { time: '11:12 PM', name: 'Sneha', loc: 'Bangalore', role: '6 yrs · Ops Manager', thought: '"Is the switch possible without an MBA?"', context: 'Every data job requires 3 years experience. She has zero.', answer: 'Google Data Analytics + 2 GitHub projects. 5 months. ₹8L → ₹12L.', color: C.text },
    { time: '12:03 AM', name: 'Arjun', loc: 'Pune', role: 'CS · Fresh graduate', thought: '"Which cert gets me placed here in India?"', context: 'Three articles. All recommend AWS. All in USD.', answer: 'Student Mode. GCP placed 47 Pune freshers in Q1 2026.', color: C.text3 },
  ]

  return (
    <StorySection id="05" title="FELLOW_CLIMBERS" bg={C.surface}>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2 style={{ fontFamily: F_SANS, fontWeight: '700', fontSize: 'clamp(2rem,5vw,3.5rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          We know what you're<br />thinking right now.
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', borderTop: `1px solid ${C.border}` }}>
        {stories.map((s, i) => {
          const isLast = i === stories.length - 1
          return (
            <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              onClick={onEnter}
              style={{ paddingLeft: !isMobile && i > 0 ? '40px' : '0', paddingRight: !isMobile && i < 2 ? '40px' : '0', paddingTop: '40px', paddingBottom: '40px', borderRight: !isMobile && !isLast ? `1px solid ${C.border}` : 'none', borderBottom: isMobile && !isLast ? `1px solid ${C.border}` : 'none', cursor: 'pointer' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.08em', marginBottom: '16px' }}>// LOG_TIME: {s.time}</div>
              <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400', fontSize: '22px', color: C.text, lineHeight: 1.4, marginBottom: '16px' }}>{s.thought}</div>
              <div style={{ fontFamily: F_SANS, fontSize: '14px', color: C.text2, lineHeight: '1.6', marginBottom: '24px' }}>
                <em style={{ fontStyle: 'italic' }}>{s.name}</em>, {s.loc} — {s.role}. {s.context}
              </div>
              <div style={{ width: '24px', height: '2px', background: s.color, marginBottom: '16px' }} />
              <div style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: '14px', color: C.text, lineHeight: '1.6' }}>{s.answer}</div>
            </motion.div>
          )
        })}
      </div>
    </StorySection>
  )
}

function ThreeModes() {
  const C = useTheme()
  const isMobile = useIsMobile()
  const modes =[
    { label: 'Student', sub: 'No salary yet', desc: 'Path to a ₹4.8L+ first offer. Reframes ROI around career investment, not salary hike.' },
    { label: 'Switcher', sub: 'Changing domains', desc: 'Domain switch in 5–8 months. Only fast-track options shown. Long certs hidden.' },
    { label: 'Professional', sub: 'Levelling up', desc: 'Maximum ROI on your next cert. Break-even analysis, city benchmarks, and a pitch-your-boss email.' },
  ]

  return (
    <StorySection id="06" title="SYS_MODES" bg={C.bg}>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2 style={{ fontFamily: F_SANS, fontWeight: '700', fontSize: 'clamp(2rem,5vw,3.5rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          Three modes.<br /><span style={{ color: C.gold }}>One tool.</span>
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? '32px' : '40px', padding: '32px', background: C.surface, border: `1px solid ${C.border}` }}>
        {modes.map((m, i) => (
          <motion.div key={m.label} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <div style={{ fontFamily: F_SANS, fontWeight: '700', fontSize: '18px', color: C.text, letterSpacing: '-0.02em', marginBottom: '8px' }}>{m.label}</div>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>{m.sub}</div>
            <div style={{ fontFamily: F_SANS, fontSize: '14px', color: C.text2, lineHeight: '1.7' }}>{m.desc}</div>
          </motion.div>
        ))}
      </div>
    </StorySection>
  )
}

function SocialProof() {
  const C = useTheme()
  const isMobile = useIsMobile()
  const quotes =[
    { quote: 'CertifyROI said payback was month 8. It was month 7. Switched companies immediately. ₹6L hike.', name: 'Priya S.', detail: 'Bangalore · Engineer → Cloud Architect', hike: '+₹6L/yr', color: C.gold },
    { quote: 'Was about to spend ₹12L on an MBA. The analysis showed a different path — 5 months, 1% of the cost.', name: 'Rahul M.', detail: 'Hyderabad · Ops Manager → Data Analyst', hike: 'Saved ₹12L', color: C.text },
    { quote: 'Student Mode. India-specific. GCP placed 47 Pune freshers in Q1 2026. My ₹5.2L offer was one of them.', name: 'Ananya K.', detail: 'Pune · Fresh Graduate', hike: '₹5.2L offer', color: C.text3 },
  ]

  return (
    <StorySection id="07" title="FIELD_REPORTS" bg={C.surface}>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2 style={{ fontFamily: F_SANS, fontWeight: '700', fontSize: 'clamp(2rem,5vw,3.5rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          They chose the right route.<br /><span style={{ color: C.gold }}>It worked.</span>
        </h2>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {quotes.map((q, i) => {
          const isLast = i === quotes.length - 1
          return (
            <motion.div key={i} variants={SLIDE_L} initial="hidden" whileInView="show" viewport={{ once: true }}
              style={{ paddingTop: i > 0 ? '48px' : '0', paddingBottom: !isLast ? '48px' : '0', borderBottom: !isLast ? `1px solid ${C.border}` : 'none', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 180px', gap: '24px', alignItems: 'end' }}>
              <div>
                <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400', fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', color: C.text, letterSpacing: '-0.01em', lineHeight: 1.35, marginBottom: '24px' }}>
                  "{q.quote}"
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ width: '20px', height: '2px', background: q.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: '14px', color: C.text }}>{q.name}</span>
                  <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3 }}>{q.detail}</span>
                </div>
              </div>
              <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                <div style={{ fontFamily: F_MONO, fontWeight: '600', fontSize: 'clamp(1.5rem,3vw,2rem)', color: C.text, letterSpacing: '-0.04em', lineHeight: 1 }}>{q.hike}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </StorySection>
  )
}

const FAQ_ITEMS =[
  { q: 'How accurate are the ROI calculations?', a: 'Calculations are based on median salary data from Naukri, AmbitionBox, and LinkedIn India — updated quarterly. They are directional estimates, not guarantees.' },
  { q: 'Do I need to create an account?', a: 'No. The ROI calculator, comparison tool, and city demand heatmap are all free with no signup. AI features use free credits.' },
  { q: 'What certifications are covered?', a: '103 certifications across 17 domains — cloud, data analytics, cybersecurity, finance (CFA, CA), project management, HR, medical, and government.' },
  { q: 'Is this only useful for India?', a: 'The salary benchmarks and demand data are India-specific. The ROI framework applies anywhere, but numbers are calibrated for India.' },
  { q: 'How does the Resume AI work?', a: 'Upload a resume or paste your profile. The AI reads your domain, role, and experience, then recommends the highest-ROI certifications for your specific background.' },
]

function FAQItem({ item }) {
  const C = useTheme()
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '24px 0', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: '16px', color: C.text, letterSpacing: '-0.01em', lineHeight: 1.4 }}>{item.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }} style={{ flexShrink: 0 }}>
          <ChevronDown size={18} color={C.text3} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="ans" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.26 }} style={{ overflow: 'hidden' }}>
            <div style={{ paddingBottom: '24px', fontFamily: F_SANS, fontSize: '15px', color: C.text2, lineHeight: '1.7', maxWidth: '68ch' }}>{item.a}</div>
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
    <StorySection id="08" title="LOGISTICS" bg={C.bg}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', gap: isMobile ? '40px' : '80px', alignItems: 'start' }}>
        <div style={{ position: isMobile ? 'static' : 'sticky', top: '160px' }}>
          <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ fontFamily: F_SANS, fontWeight: '700', fontSize: 'clamp(2rem,3vw,2.5rem)', color: C.text, letterSpacing: '-0.025em', lineHeight: 1.15, marginTop: 0, marginBottom: 0 }}>
            Common<br />questions<br />answered.
          </motion.h2>
        </div>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {FAQ_ITEMS.map((item, i) => <FAQItem key={i} item={item} />)}
          </div>
        </motion.div>
      </div>
    </StorySection>
  )
}

function FinalCTA({ onEnter }) {
  const C = useTheme()
  const glassStyle = useGlassStyle()

  return (
    <StorySection id="09" title="SUMMIT_ACCESS" bg={C.surface}>
      <div style={{ position: 'absolute', right: '0', top: '0', pointerEvents: 'none', opacity: 0.3 }}>
        <svg width="400" height="400" viewBox="0 0 400 400">
          {[40, 80, 120, 160, 200].map((r, i) => (
            <circle key={i} cx="400" cy="0" r={r} fill="none" stroke={C.lineHeavy} strokeWidth="1" opacity={1 - (i * 0.15)} />
          ))}
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400', fontSize: 'clamp(3rem,8vw,5.5rem)', color: C.text, letterSpacing: '-0.02em', lineHeight: 0.96, marginTop: 0, marginBottom: '32px' }}>
          You'll know<br />the answer.
        </motion.h2>
        <motion.p variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }}
          style={{ fontFamily: F_SANS, fontSize: '16px', color: C.text2, lineHeight: '1.7', maxWidth: '44ch', margin: '0 0 48px' }}>
          Stop reading generic advice. Stop asking Reddit.{' '}
          <span style={{ color: C.text, fontWeight: '600' }}>Know the exact payback period before you pay the exam fee.</span>
        </motion.p>
        
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
          
          <TechBtn onClick={onEnter} large>Calculate ROI <ArrowRight size={16} /></TechBtn>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', ...glassStyle, padding: '8px 20px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ width: '4px', height: '12px', background: C.gold }} />
              <div style={{ width: '4px', height: '12px', background: C.gold, opacity: 0.4 }} />
            </div>
            <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text, letterSpacing: '0.15em' }}>FREE_ACCESS // NO_ACCT_REQ</span>
          </div>

        </motion.div>
      </div>
    </StorySection>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(true)
  const toggleTheme = () => setIsDark(!isDark)
  const C = isDark ? THEMES.dark : THEMES.light
  const isMobile = useIsMobile()
  
  const glassStyle = {
    background: C.glass || 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    border: `1px solid ${C.borderMid || 'rgba(255,255,255,0.1)'}`,
    boxShadow: `0 8px 32px ${C.name === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`
  }

  const onEnter = () => {
    console.log('ROI Calculation triggered')
  }

  return (
    <ThemeContext.Provider value={C}>
      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, overflowX: 'clip', transition: 'background 0.3s ease, color 0.3s ease' }}>
        
        <DynamicIslandNav isDark={isDark} toggleTheme={toggleTheme} onEnter={onEnter} />

        {/* ── HERO ── */}
        <div style={{ position: 'relative', height: '100vh', minHeight: '700px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
          
          {/* Mountain Image */}
          <div style={{ position: 'absolute', right: 0, bottom: 0, width: isMobile ? '100%' : '65%', height: isMobile ? '60%' : '90%', zIndex: 2, pointerEvents: 'none' }}>
             <img src="/mountain.png" alt="Mountain" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom right' }} />
          </div>

          {/* Hero Content */}
          <div style={{ position: 'relative', zIndex: 3, width: '100%', maxWidth: '1400px', margin: '0 auto', display: 'flex' }}>
            
            <div style={{ flex: 1, paddingLeft: isMobile ? '24px' : '8vw', paddingRight: '24px' }}>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                style={{ fontFamily: F_MONO, fontSize: '11px', color: C.text3, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '1px', background: C.gold }} />
                ROI Analysis Platform
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                style={{ fontFamily: F_SERIF, fontWeight: '400', fontSize: 'clamp(4rem, 8vw, 8rem)', lineHeight: 0.95, letterSpacing: '-0.02em', color: C.text, marginBottom: '32px', maxWidth: '14ch' }}>
                Your next cert<br />
                is either a <span style={{ color: C.gold, fontStyle: 'italic', paddingRight: '8px' }}>goldmine</span><br />
                or a <span style={{ color: C.text4, fontStyle: 'italic' }}>mistake.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
                style={{ fontFamily: F_SANS, fontSize: 'clamp(15px, 1.5vw, 18px)', color: C.text2, maxWidth: '420px', lineHeight: '1.6', margin: '0 0 48px' }}>
                Know the exact payback period before you pay the fee. Calculated for your city and current salary.
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
                
                <TechBtn onClick={onEnter} large>Calculate ROI <ArrowRight size={16} /></TechBtn>
                
                {/* Tech Status Pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', ...glassStyle, padding: '8px 20px', borderRadius: '32px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ width: '4px', height: '12px', background: C.gold }} />
                    <div style={{ width: '4px', height: '12px', background: C.gold, opacity: 0.4 }} />
                  </div>
                  <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text, letterSpacing: '0.15em' }}>FREE_ACCESS // NO_ACCT_REQ</span>
                </div>

              </motion.div>
            </div>
          </div>
        </div>

        {/* ── SECTIONS ── */}
        <TrustStrip />
        <CertAssembly />
        <DataComposition />
        <HowItWorks onEnter={onEnter} />
        <VsSection />
        <ElevenPM onEnter={onEnter} />
        <ThreeModes onEnter={onEnter} />
        <SocialProof />
        <FAQ />
        <FinalCTA onEnter={onEnter} />

        {/* ── FOOTER ── */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '40px 0', background: C.bgAlt }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
            {!isMobile && <div style={{ width: '160px', borderRight: `1px solid ${C.border}` }} />}
            <div style={{ flex: 1, padding: isMobile ? '0 24px' : '0 8vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={16} color={C.gold} />
                <span style={{ fontFamily: F_SANS, fontWeight: '700', fontSize: '14px', color: C.text }}>Certify<span style={{ color: C.gold }}>ROI</span></span>
              </div>
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text4, letterSpacing: '0.1em' }}>
                DATA: LINKEDIN · NASSCOM · NAUKRI · 2026
              </div>
            </div>
          </div>
        </div>

      </div>
    </ThemeContext.Provider>
  )
}
