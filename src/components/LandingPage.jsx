import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import React, { useRef, useState, useEffect, createContext, useContext } from 'react'
import { ArrowRight, ChevronDown, Sun, Moon, BarChart2, CheckCircle2 } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// THEME SYSTEM
// ─────────────────────────────────────────────────────────
const ThemeContext = createContext()

function useTheme() {
  return useContext(ThemeContext)
}

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
    gold: '#D4AF37', // Tech Gold
    goldL: '#F4CE56',
    err: '#D94848',  // Sharp Red
    line: '#262626',
    lineHeavy: '#333333',
    border: 'rgba(255,255,255,0.08)',
    borderMid: 'rgba(255,255,255,0.18)',
    btnFill: '#D4AF37',
    btnText: '#000000',
    certBg: '#050505',
    glass: 'rgba(20, 20, 20, 0.45)', // Premium liquid glass base
  },
  light: {
    name: 'light',
    bg: '#F4F2EE',
    bgAlt: '#EBE8E3',
    surface: '#FFFFFF',
    text: '#121212',
    text2: '#525252',
    text3: '#8A8A8A',
    text4: '#A3A3A3',
    green: '#2D6A4F',
    greenVivid: '#3D7A5A',
    gold: '#B3862A',
    goldL: '#D4AF37',
    err: '#C93636',
    line: '#E0DCD6',
    lineHeavy: '#C2BCB3',
    border: 'rgba(0,0,0,0.08)',
    borderMid: 'rgba(0,0,0,0.2)',
    btnFill: '#121212',
    btnText: '#FFFFFF',
    certBg: '#FAFAFA',
    glass: 'rgba(255, 255, 255, 0.55)', // Premium liquid glass base
  }
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    setMobile(window.innerWidth < 768)
    const check = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// ─────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────
const F_SERIF = "'EB Garamond', 'Cormorant Garamond', Georgia, serif"
const F_SANS  = "'Inter', 'DM Sans', sans-serif"
const F_MONO  = "'JetBrains Mono', 'IBM Plex Mono', monospace"

const RISE = {
  hidden: { y: 40, opacity: 0 },
  show:   { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}
const SLIDE_L = {
  hidden: { x: -40, opacity: 0 },
  show:   { x: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

// ─────────────────────────────────────────────────────────
// SVG PRIMITIVES & TECH UI
// ─────────────────────────────────────────────────────────
function SummitFlag({ color, size = 1 }) {
  return (
    <svg width={14 * size} height={18 * size} viewBox="0 0 14 18" fill="none" style={{ display: 'inline-block' }}>
      <line x1="3" y1="1" x2="3" y2="17" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 3 1 L 13 5 L 3 9 Z" fill={color} fillOpacity="0.9" />
    </svg>
  )
}

function WaypointDot({ active, color, size = 10 }) {
  return (
    <svg width={size + 8} height={size + 8} viewBox={`0 0 ${size + 8} ${size + 8}`} fill="none">
      <circle cx={(size + 8) / 2} cy={(size + 8) / 2} r={size / 2 + 3} stroke={color} strokeWidth="1" strokeOpacity={active ? 0.3 : 0.15} />
      <circle cx={(size + 8) / 2} cy={(size + 8) / 2} r={size / 2 - 1} fill={active ? color : 'none'} stroke={color} strokeWidth="1.5" strokeOpacity={active ? 1 : 0.3} />
    </svg>
  )
}

function CrosshairIcon({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <line x1="6" y1="0" x2="6" y2="12" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="0" y1="6" x2="12" y2="6" stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

// Glass Glass Annotation (refined to liquid glass look)
function TechAnnotation({ top, left, right, bottom, val, label, align = 'left' }) {
  const C = useTheme()
  const isRight = align === 'right'
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ delay: 1, duration: 0.8 }}
      style={{ 
        position: 'absolute', top, left, right, bottom, 
        display: 'flex', alignItems: 'center', 
        flexDirection: isRight ? 'row-reverse' : 'row', 
        zIndex: 10 
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '6px', height: '6px', border: `1.5px solid ${C.gold}`, borderRadius: '50%', background: C.bg }} />
        <div style={{ width: '32px', height: '1px', background: C.gold, opacity: 0.5 }} />
      </div>
      <div style={{ 
        background: C.glass, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', 
        border: `1px solid ${C.borderMid}`, padding: '8px 14px', borderRadius: '8px',
        boxShadow: `0 8px 32px ${C.name === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)'}`
      }}>
        <div style={{ fontFamily: F_MONO, fontSize: '13px', color: C.text, fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{val}</div>
        <div style={{ fontFamily: F_MONO, fontSize: '9px', color: C.gold, letterSpacing: '0.15em', marginTop: '2px', textTransform: 'uppercase' }}>{label}</div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
// ARCHITECTURAL LAYOUT WRAPPER
// ─────────────────────────────────────────────────────────
function StorySection({ id, title, children, bg, noBorderTop }) {
  const C = useTheme()
  const isMobile = useIsMobile()

  return (
    <div style={{ background: bg || C.bg, borderTop: noBorderTop ? 'none' : `1px solid ${C.border}`, position: 'relative' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>

        {/* Architectural Timeline */}
        {!isMobile && (
          <div style={{ width: '160px', flexShrink: 0, borderRight: `1px solid ${C.border}`, position: 'relative' }}>
            <div style={{ position: 'sticky', top: '160px', padding: '40px 0', display: 'flex', alignItems: 'center', flexDirection: 'column', height: '400px' }}>
              <CrosshairIcon color={C.text4} />
              <div style={{ width: '1px', flex: 1, background: C.border, margin: '20px 0' }} />
              <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.2em' }}>{title}</div>
              <div style={{ width: '1px', flex: 1, background: C.border, margin: '20px 0' }} />
              <CrosshairIcon color={C.text4} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, padding: isMobile ? '60px 24px' : '120px 8vw', position: 'relative', overflow: 'hidden' }}>
          {isMobile && (
            <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.gold, fontWeight: '600', letterSpacing: '0.15em' }}>{id}</div>
              <div style={{ height: '1px', flex: 1, background: C.border }} />
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.15em' }}>{title}</div>
            </div>
          )}
          
          <div style={{ maxWidth: '800px' }}>
            {children}
          </div>
        </div>

      </div>
    </div>
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

// Tech-inspired brutalist CTA button (highly visible and strong)
function TechBtn({ onClick, children, large }) {
  const C = useTheme()
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '12px',
        padding: large ? '0 40px' : '0 24px', height: large ? '64px' : '48px',
        background: C.btnFill, color: C.btnText,
        border: 'none', borderRadius: '8px',
        fontSize: large ? '14px' : '12px', fontFamily: F_SANS, fontWeight: '700', 
        letterSpacing: '0.05em', textTransform: 'uppercase',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        boxShadow: `0 12px 32px ${C.name === 'dark' ? 'rgba(212, 175, 55, 0.25)' : 'rgba(0,0,0,0.15)'}`,
        transition: 'box-shadow 0.2s'
      }}
    >
      {children}
    </motion.button>
  )
}

function SecondaryBtn({ onClick, children }) {
  const C = useTheme()
  return (
    <button onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0 24px', height: '48px',
        borderRadius: '6px', border: `1px solid ${C.borderMid}`, background: 'transparent', color: C.text,
        fontSize: '12px', fontFamily: F_SANS, fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase',
        cursor: 'pointer', transition: 'all 0.16s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = C.text; e.currentTarget.style.color = C.bg }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.text }}
    >
      {children}
    </button>
  )
}

// ─────────────────────────────────────────────────────────
// FLOATING TOP BAR (Premium Liquid Glass)
// ─────────────────────────────────────────────────────────
function FloatingTopBar({ isDark, toggleTheme }) {
  const C = useTheme()
  const isMobile = useIsMobile()

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, 
      padding: isMobile ? '24px' : '32px 5vw', 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
      zIndex: 100, pointerEvents: 'none' // Allow clicking through empty space
    }}>
      {/* Pill Logo */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto',
        background: C.glass, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        padding: '12px 24px', borderRadius: '40px', border: `1px solid ${C.borderMid}`,
        boxShadow: `0 8px 32px ${C.name === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.05)'}`
      }}>
        <BarChart2 size={22} color={C.gold} strokeWidth={2.5} />
        <span style={{ fontFamily: F_SANS, fontWeight: '800', fontSize: '18px', letterSpacing: '-0.02em', color: C.text }}>
          Certify<span style={{ color: C.gold }}>ROI</span>
        </span>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto',
        background: C.glass, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        padding: '6px', borderRadius: '40px', border: `1px solid ${C.borderMid}`,
        boxShadow: `0 8px 32px ${C.name === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.05)'}`
      }}>
        <button onClick={toggleTheme} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '50%', width:'36px', height:'36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.text, transition: 'all 0.2s' }}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button style={{ background: 'transparent', border: 'none', padding: '0 16px', color: C.text, fontFamily: F_SANS, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
          SIGN IN
        </button>
      </div>
    </div>
  )
}

function TrustStrip() {
  const C = useTheme()
  const items = [
    { tag: 'AWS', text: '₹2.4L premium in Bangalore' },
    { tag: 'PMP', text: '7 month median summit' },
    { tag: 'GCP', text: '2,400+ cloud roles active' },
    { tag: 'DATA', text: '₹3.2L annual gain average' },
    { tag: 'K8S', text: 'Steepest climb, +40% gain' },
  ]
  return (
    <div style={{ overflow: 'hidden', borderBottom: `1px solid ${C.border}`, background: C.bg, position: 'relative', zIndex: 1, padding: '16px 0' }}>
      <div style={{ display: 'flex', width: '100%', overflow: 'hidden' }}>
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', width: 'max-content' }}>
          {[...items, ...items, ...items].map((item, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', height: '48px', borderRight: `1px solid ${C.border}`, padding: '0 40px' }}>
              <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.gold, marginRight: '16px', letterSpacing: '0.1em' }}>[{item.tag}]</span>
              <span style={{ fontFamily: F_SANS, fontSize: '13px', color: C.text2, letterSpacing: '0.02em', fontWeight: '500' }}>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CERT ASSEMBLY (Unchanged behavioral layout)
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
      const p = Math.max(0, Math.min(1, -rect.top / (el.offsetHeight - window.innerHeight)))
      setProg(p)
    }
    const unsub = scrollY.on('change', update); update(); return unsub
  }, [scrollY])

  const remap = (p, a, b, c, d) => c + (d - c) * Math.max(0, Math.min(1, (p - a) / (b - a)))
  
  const p8 = remap(prog, 0, 0.8, 0, 1)
  let l1, l2, l3
  if (isMobile) {
    l1 = `translateY(${remap(p8, 0, 1, -50, 0)}px) rotateZ(${remap(p8, 0, 1, 3, 0)}deg)`
    l2 = `translateY(${remap(p8, 0, 1, 50, 0)}px) rotateZ(${remap(p8, 0, 1, -2, 0)}deg)`
    l3 = `translateY(${remap(p8, 0, 1, -25, 0)}px) scale(${remap(p8, 0, 1, 0.88, 1)})`
  } else {
    l1 = `perspective(1200px) translateZ(${remap(p8, 0, 1, -280, 0)}px) translateY(${remap(p8, 0, 1, -80, 0)}px) rotateY(${remap(p8, 0, 1, 32, 0)}deg) rotateX(${remap(p8, 0, 1, 15, 0)}deg)`
    l2 = `perspective(1200px) translateZ(${remap(p8, 0, 1, 280, 0)}px) translateY(${remap(p8, 0, 1, 80, 0)}px) rotateY(${remap(p8, 0, 1, -26, 0)}deg) rotateX(${remap(p8, 0, 1, -12, 0)}deg)`
    l3 = `perspective(1200px) translateZ(${remap(p8, 0, 1, -140, 0)}px) translateY(${remap(p8, 0, 1, -30, 0)}px) rotateY(${remap(p8, 0, 1, 15, 0)}deg) rotateX(${remap(p8, 0, 1, 6, 0)}deg)`
  }

  const certScale = prog < 0.8 ? remap(prog, 0, 0.8, 0.62, 1.0) : remap(prog, 0.8, 1.0, 1.0, 0.85)
  const certOpacity = prog < 0.05 ? remap(prog, 0, 0.05, 0, 1) : prog > 0.85 ? remap(prog, 0.85, 1.0, 1, 0) : 1
  const hintOp      = prog > 0.16 ? 0 : prog > 0.06 ? remap(prog, 0.06, 0.16, 1, 0) : 1
  const assembledOp = remap(prog, 0.78, 0.88, 0, 1)
  const cardW = isMobile ? 'min(300px, 88vw)' : 'min(500px, 88vw)'

  return (
    <div ref={trackRef} style={{ height: '300vh', position: 'relative', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
      {/* Background Story Line extending through Cert Assembly */}
      {!isMobile && (
        <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
           <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', height: '100%' }}>
              <div style={{ position: 'absolute', left: '160px', top: 0, bottom: 0, width: '1px', background: C.border, zIndex: 0 }} />
           </div>
        </div>
      )}

      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
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
                  <rect x="0" y="0" width="480" height="340" rx="4" fill={C.certBg} style={{ filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.5))' }} />
                  <rect x="1.5" y="1.5" width="477" height="337" rx="3" fill="none" stroke="url(#certBordX)" strokeWidth="1.5" />
                  <rect x="12" y="12" width="456" height="316" rx="2" fill="none" stroke={C.borderMid} strokeWidth="0.8" />
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
              <div style={{ position: 'absolute', right: '8%', bottom: '10%', transform: l3 }}>
                <SummitFlag color={C.gold} size={1.2} />
              </div>
            </div>
          </div>
          <div style={{ opacity: hintOp, marginTop: '64px', textAlign: 'center', pointerEvents: 'none', transition: 'opacity 0.3s' }}>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.2em', textTransform: 'uppercase' }}>↓ Scroll Sequence ↓</div>
            </motion.div>
          </div>
        </div>
        <div style={{ opacity: assembledOp, position: 'absolute', bottom: '10%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 5, transition: 'opacity 0.3s' }}>
          <div style={{ fontFamily: F_MONO, fontSize: '11px', color: C.gold, letterSpacing: '0.2em', background: C.surface, display: 'inline-block', padding: '8px 16px', border: `1px solid ${C.border}`, borderRadius: '6px' }}>
            ✓ BRIEFING COMPILED
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// STORY SECTIONS (Lower Sections)
// ─────────────────────────────────────────────────────────
function FalseGuidance() {
  const C = useTheme()
  const pairs = [
    { wrong: '"Study AWS, it pays the best."', right: 'Tech changes. ROI doesn\'t. In Pune right now, GCP Architect has a 3x higher interview rate than AWS SAA.' },
    { wrong: '"Top certifications guarantee jobs."', right: 'No. They reduce filtering risk. Without a targeted application strategy, a ₹30K cert is invisible.' },
    { wrong: '"Follow US tech salary guides.', right: 'US data is noise. India is a segmented IT services market. We map strictly to Naukri and local CTC bands.' }
  ]

  return (
    <StorySection id="05" title="FALSE_GUIDANCE" bg={C.surface}>
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
              <span style={{ position: 'relative', display: 'inline-block' }}>
                {pair.wrong}
                <div style={{ position: 'absolute', left: '-2%', right: '-2%', top: '50%', height: '2px', background: C.err, transform: 'translateY(-50%)' }} />
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

function FieldReports() {
  const C = useTheme()
  const isMobile = useIsMobile()
  const quotes = [
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {quotes.map((q, i) => (
          <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            style={{ padding: '32px', background: C.bg, border: `1px solid ${C.border}`, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '32px', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontSize: '20px', color: C.text, lineHeight: '1.5', marginBottom: '16px' }}>"{q.quote}"</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <WaypointDot active={true} color={q.color} size={8} />
                <div>
                  <div style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: '13px', color: C.text }}>{q.name}</div>
                  <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.05em', marginTop: '2px' }}>{q.detail}</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <div style={{ fontFamily: F_MONO, fontWeight: '600', fontSize: 'clamp(1.5rem,3vw,2rem)', color: C.text, letterSpacing: '-0.04em', lineHeight: 1 }}>{q.hike}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </StorySection>
  )
}

function FinalCTA({ onEnter }) {
  const C = useTheme()
  return (
    <StorySection id="08" title="INITIATE" bg={C.surface}>
      <div style={{ padding: 'clamp(40px, 8vw, 80px) 0' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '12px', color: C.gold, letterSpacing: '0.2em', marginBottom: '24px' }}>[ END OF BRIEFING ]</div>
          <h2 style={{ fontFamily: F_SANS, fontWeight: '700', fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 0, marginBottom: '32px' }}>
            Ready to find your<br />true elevation?
          </h2>
        </motion.div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
          
          <TechBtn onClick={onEnter} large>Calculate ROI <ArrowRight size={16} /></TechBtn>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', border: `1px solid ${C.borderMid}`, padding: '10px 20px', background: C.glass, backdropFilter: 'blur(12px)', borderRadius: '20px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ width: '4px', height: '12px', background: C.gold }} />
              <div style={{ width: '4px', height: '12px', background: C.gold, opacity: 0.4 }} />
            </div>
            <span style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: '11px', color: C.text, letterSpacing: '0.1em', textTransform: 'uppercase' }}>FREE ACCESS // NO ACCOUNT REQUIRED</span>
          </div>

        </motion.div>
      </div>
    </StorySection>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN LANDING PAGE
// ─────────────────────────────────────────────────────────
export default function LandingPage({ onEnter }) {
  const [isDark, setIsDark] = useState(true)
  const isMobile = useIsMobile()
  const C = isDark ? THEMES.dark : THEMES.light

  const toggleTheme = () => setIsDark(!isDark)

  return (
    <ThemeContext.Provider value={C}>
      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, overflowX: 'clip', transition: 'background 0.3s ease, color 0.3s ease' }}>

        <FloatingTopBar isDark={isDark} toggleTheme={toggleTheme} />

        {/* ── HERO ── */}
        <div style={{ position: 'relative', height: '100vh', minHeight: '700px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>

          {/* Bold Background Text (Cleaned up, no extra lines) */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', textAlign: 'center', zIndex: 0, pointerEvents: 'none' }}>
            <div style={{ 
              fontFamily: F_SANS, fontWeight: 900, fontSize: 'clamp(10rem, 28vw, 30rem)', 
              lineHeight: 0.8, letterSpacing: '-0.04em', 
              color: C.name === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              WebkitTextStroke: `2px ${C.name === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
              userSelect: 'none', whiteSpace: 'nowrap'
            }}>
              CERTIFY
            </div>
          </div>

          {/* Mountain Image with Glass Annotations */}
          <div style={{ position: 'absolute', right: 0, bottom: 0, width: isMobile ? '100%' : '65%', height: isMobile ? '60%' : '90%', zIndex: 2, pointerEvents: 'none' }}>
             <img src="/mountain.png" alt="Mountain" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom right' }} />

             {!isMobile && (
               <>
                 <TechAnnotation top="20%" right="45%" align="left" val="CERTIFY ROI" label="PEAK EST. 2026" />
                 <TechAnnotation bottom="35%" right="55%" align="left" val="6 MONTHS" label="ELEVATION MID" />
                 <TechAnnotation bottom="20%" right="75%" align="left" val="3 MONTHS" label="ASCENT START" />
                 <TechAnnotation bottom="5%" right="85%" align="left" val="BASECAMP" label="COORD: CURRENT" />
                 <TechAnnotation bottom="15%" left="20%" align="right" val="BASECAMP" label="COORD: CURRENT" />
                 <TechAnnotation bottom="35%" left="38%" align="right" val="3 MONTHS" label="ASCENT START" />
                 <TechAnnotation bottom="55%" left="55%" align="right" val="6 MONTHS" label="ELEVATION MID" />
                 <TechAnnotation top="20%" left="68%" align="left" val="CERTIFY ROI" label="PEAK EST. 2026" />
               </>
             )}
          </div>

          {/* Hero Content — Pushed left to fill empty space cleanly */}
          <div style={{ position: 'relative', zIndex: 3, width: '100%', maxWidth: '1400px', margin: '0 auto', display: 'flex' }}>

            <div style={{ flex: 1, paddingLeft: isMobile ? '24px' : '8vw', paddingRight: '24px', paddingTop: isMobile ? '100px' : '0' }}>
              
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
                style={{ fontFamily: F_SANS, fontSize: 'clamp(16px, 1.2vw, 18px)', color: C.text2, maxWidth: '420px', lineHeight: '1.7', margin: '0 0 48px', fontWeight: '400' }}>
                Know the exact payback period before you transfer the exam fee. Calculated for your specific city and current salary elevation.
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
                
                <TechBtn onClick={onEnter} large>Calculate ROI <ArrowRight size={16} /></TechBtn>
                
                {/* Tech Status Block (Glass Pill) */}
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', border: `1px solid ${C.border}`, padding: '10px 20px', 
                  background: C.glass, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '30px', 
                  boxShadow: `0 8px 24px ${C.name === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'}`
                }}>
                  <CheckCircle2 size={14} color={C.gold} />
                  <span style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: '11px', color: C.text2, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Zero Account Required // Free Engine</span>
                </div>

              </motion.div>
            </div>
          </div>
        </div>

        <TrustStrip />
        <CertAssembly />
        
        <FalseGuidance />
        <FieldReports />
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
