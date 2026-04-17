import { motion, useScroll, AnimatePresence, useMotionValue } from 'framer-motion'
import React, { useRef, useState, useEffect, createContext, useContext } from 'react'
import { ArrowRight, ChevronDown, BarChart2, CheckCircle2 } from 'lucide-react'
import DynamicIslandNav from './DynamicIslandNav'

// ─────────────────────────────────────────────────────────
// THEME — reduced gold, more charcoal/stone/metallic
// ─────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    name: 'dark',
    bg: '#0A0A0A',
    bgAlt: '#0F0F0F',
    surface: '#111111',
    text: '#EFEFEF',
    text2: '#999999',
    text3: '#5A5A5A',
    text4: '#2E2E2E',
    gold: '#B8973A',
    goldL: '#D4AF55',
    silver: '#8A8A8A',
    silverL: '#B0B0B0',
    err: '#C94848',
    line: '#1A1A1A',
    lineHeavy: '#242424',
    border: 'rgba(255,255,255,0.055)',
    borderMid: 'rgba(255,255,255,0.10)',
    certBg: '#070707',
  },
  light: {
    name: 'light',
    bg: '#F5F3EF',
    bgAlt: '#EDE9E3',
    surface: '#FAFAF8',
    text: '#111111',
    text2: '#555555',
    text3: '#878787',
    text4: '#ABABAB',
    gold: '#9A7020',
    goldL: '#B89040',
    silver: '#6E6E6E',
    silverL: '#8E8E8E',
    err: '#C03030',
    line: '#DDD9D3',
    lineHeavy: '#C5BEB4',
    border: 'rgba(0,0,0,0.07)',
    borderMid: 'rgba(0,0,0,0.13)',
    certBg: '#F9F9F7',
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
    const c = () => setM(window.innerWidth < 768)
    c(); window.addEventListener('resize', c)
    return () => window.removeEventListener('resize', c)
  }, [])
  return m
}

// ─────────────────────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────────────────────
const F_SERIF = "'EB Garamond', 'Cormorant Garamond', Georgia, serif"
const F_SANS  = "'Inter', 'DM Sans', sans-serif"
const F_MONO  = "'JetBrains Mono', 'IBM Plex Mono', monospace"

const RISE = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
}

// ─────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────
function CrosshairIcon({ color, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <line x1="7" y1="0" x2="7" y2="14" stroke={color} strokeWidth="0.7" opacity="0.4" />
      <line x1="0" y1="7" x2="14" y2="7" stroke={color} strokeWidth="0.7" opacity="0.4" />
      <rect x="5.5" y="5.5" width="3" height="3" stroke={color} strokeWidth="0.7" opacity="0.6" fill="none" />
    </svg>
  )
}

function CountUp({ end, prefix = '', suffix = '', duration = 1.8 }) {
  const [count, setCount] = useState(0)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!on) return
    const v = parseFloat(String(end).replace(/[^0-9.]/g, ''))
    const frames = Math.round(duration * 60)
    let f = 0
    const t = setInterval(() => {
      f++
      setCount(v * (1 - Math.pow(1 - f / frames, 3)))
      if (f >= frames) { setCount(v); clearInterval(t) }
    }, 1000 / 60)
    return () => clearInterval(t)
  }, [on, end, duration])
  return (
    <motion.span onViewportEnter={() => setOn(true)}>
      {prefix}{count.toLocaleString('en-IN', { maximumFractionDigits: String(end).includes('.') ? 1 : 0 })}{suffix}
    </motion.span>
  )
}

// Premium capsule button — metallic tint, no glow
function PillBtn({ onClick = () => {}, children, large }) {
  const C = useTheme()
  const [h, setH] = useState(false)
  const d = C.name === 'dark'
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      whileTap={{ scale: 0.975 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        padding: large ? '0 32px' : '0 22px',
        height: large ? '52px' : '42px',
        background: d
          ? `linear-gradient(160deg, rgba(255,255,255,${h ? 0.08 : 0.05}), rgba(255,255,255,${h ? 0.02 : 0.01}))`
          : `linear-gradient(160deg, rgba(0,0,0,${h ? 0.06 : 0.04}), rgba(0,0,0,${h ? 0.02 : 0.01}))`,
        border: `0.5px solid ${d ? `rgba(255,255,255,${h ? 0.16 : 0.10})` : `rgba(0,0,0,${h ? 0.12 : 0.08})`}`,
        borderRadius: '9999px',
        fontSize: large ? '11px' : '10px',
        fontFamily: F_SANS, fontWeight: '600',
        letterSpacing: '0.09em', textTransform: 'uppercase',
        cursor: 'pointer',
        color: d ? C.silverL : C.silver,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 0.25s ease',
      }}
    >
      {children}
    </motion.button>
  )
}

function GlassPill({ children }) {
  const C = useTheme()
  const d = C.name === 'dark'
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '10px',
      padding: '6px 14px', borderRadius: '9999px',
      background: d ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)',
      border: `0.5px solid ${d ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    }}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// STORY SECTION — editorial sidebar, premium
// ─────────────────────────────────────────────────────────
function StorySection({ id = '', title = '', children, bg = '', noBorderTop = false }) {
  const C = useTheme()
  const isMobile = useIsMobile()

  return (
    <div style={{
      background: bg || C.bg,
      borderTop: noBorderTop ? 'none' : `1px solid ${C.border}`,
      position: 'relative',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>

        {/* Desktop sidebar */}
        {!isMobile && (
          <div style={{
            width: '120px', flexShrink: 0,
            borderRight: `1px solid ${C.border}`,
            position: 'relative',
          }}>
            <div style={{
              position: 'sticky', top: '120px', padding: '40px 0',
              display: 'flex', alignItems: 'center', flexDirection: 'column',
              height: '320px',
            }}>
              <CrosshairIcon color={C.text4} />
              <div style={{ width: '1px', flex: 1, background: `linear-gradient(to bottom, ${C.border}, transparent)`, margin: '14px 0' }} />
              <div style={{
                writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                fontFamily: F_MONO, fontSize: '10px', color: C.text3,
                letterSpacing: '0.2em',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ color: C.silverL, opacity: 0.7 }}>{id}</span>
                <span style={{ opacity: 0.25 }}>|</span>
                <span style={{ opacity: 0.45, letterSpacing: '0.14em' }}>{title}</span>
              </div>
              <div style={{ width: '1px', flex: 1, background: `linear-gradient(to top, ${C.border}, transparent)`, margin: '14px 0' }} />
              <CrosshairIcon color={C.text4} />
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, padding: isMobile ? '56px 24px' : '96px 7vw', position: 'relative', overflow: 'hidden' }}>
          {isMobile && (
            <div style={{ marginBottom: '36px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.silverL, opacity: 0.7, letterSpacing: '0.14em' }}>{id}</span>
              <div style={{ height: '1px', flex: 1, background: C.border }} />
              <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.12em' }}>{title}</span>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// TRUST STRIP
// ─────────────────────────────────────────────────────────
function TrustStrip() {
  const C = useTheme()
  const isMobile = useIsMobile()
  const items = [
    { tag: 'CLOUD', text: 'AWS cert holders earn ₹2.4L more/yr in Bangalore' },
    { tag: 'DEMAND', text: '2,400+ cloud roles open on Naukri right now' },
    { tag: 'FINANCE', text: 'Average PMP payback period: 7 months' },
    { tag: 'DATA', text: 'Google Analytics · ₹18K invested → ₹3.2L annual gain' },
    { tag: 'DEVOPS', text: 'CKA Kubernetes: highest ROI cert in India 2026' },
  ]
  return (
    <div style={{
      borderBottom: `1px solid ${C.border}`,
      background: C.bgAlt,
      position: 'relative', zIndex: 10,
      height: '44px', display: 'flex', alignItems: 'center', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        background: C.bgAlt, zIndex: 11,
        borderRight: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 20px',
        boxShadow: `20px 0 24px -8px ${C.bgAlt}`,
      }}>
        <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.2em' }}>LIVE DATA</span>
      </div>
      <div style={{ flex: 1, paddingLeft: isMobile ? '130px' : '140px' }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', width: 'max-content' }}
        >
          {[...items, ...items, ...items].map((item, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center',
              height: '44px', borderRight: `1px solid ${C.border}`, padding: '0 32px',
            }}>
              <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, marginRight: '12px', letterSpacing: '0.1em', opacity: 0.6 }}>{item.tag}</span>
              <span style={{ fontFamily: F_SANS, fontSize: '12px', color: C.text2, letterSpacing: '0.01em', fontWeight: '400' }}>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CERT ASSEMBLY — metallic silver border, clean swoosh
// ─────────────────────────────────────────────────────────
function CertAssembly() {
  const C = useTheme()
  const isMobile = useIsMobile()
  const trackRef = useRef(null)
  const { scrollY } = useScroll()
  const [prog, setProg] = useState(0)
  const [swooshDone, setSwooshDone] = useState(false)
  const [prevProg, setPrevProg] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = trackRef.current; if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      if (total <= 0) return
      const newProg = Math.max(0, Math.min(1, -rect.top / total))
      setPrevProg(p => p)
      setProg(newProg)
    }
    const unsub = scrollY.on('change', update)
    update()
    return unsub
  }, [scrollY])

  // Trigger swoosh once cert is assembled (prog crosses 0.82)
  const [swooshTrigger, setSwooshTrigger] = useState(false)
  useEffect(() => {
    if (prog >= 0.82 && !swooshTrigger) setSwooshTrigger(true)
    if (prog < 0.6) setSwooshTrigger(false)
  }, [prog])

  const rm = (p, a, b, c, d) => c + (d - c) * Math.max(0, Math.min(1, (p - a) / (b - a)))
  const p8 = rm(prog, 0, 0.8, 0, 1)

  let l1, l2
  if (isMobile) {
    l1 = `translateY(${rm(p8, 0, 1, -28, 0)}px) scale(${rm(p8, 0, 1, 0.93, 1)})`
    l2 = `translateY(${rm(p8, 0, 1, 28, 0)}px) scale(${rm(p8, 0, 1, 0.93, 1)})`
  } else {
    l1 = `perspective(1400px) translateZ(${rm(p8, 0, 1, -280, 0)}px) translateY(${rm(p8, 0, 1, -50, 0)}px) rotateY(${rm(p8, 0, 1, 24, 0)}deg) rotateX(${rm(p8, 0, 1, 10, 0)}deg)`
    l2 = `perspective(1400px) translateZ(${rm(p8, 0, 1, 280, 0)}px) translateY(${rm(p8, 0, 1, 50, 0)}px) rotateY(${rm(p8, 0, 1, -18, 0)}deg) rotateX(${rm(p8, 0, 1, -8, 0)}deg)`
  }

  const certScale = prog < 0.8 ? rm(prog, 0, 0.8, 0.62, 1.0) : rm(prog, 0.8, 1.0, 1.0, 0.9)
  const certOpacity = prog < 0.05 ? rm(prog, 0, 0.05, 0, 1) : prog > 0.86 ? rm(prog, 0.86, 1.0, 1, 0) : 1
  const hintOp = prog > 0.14 ? 0 : prog > 0.06 ? rm(prog, 0.06, 0.14, 1, 0) : 1
  const assembledOp = rm(prog, 0.80, 0.90, 0, 1)
  const cardW = isMobile ? 'min(300px, 88vw)' : 'min(460px, 72vw)'

  // Swoosh path animation
  const swooshProgress = useMotionValue(0)

  return (
    <div ref={trackRef} style={{
      height: isMobile ? '200vh' : '300vh',
      position: 'relative',
      borderBottom: `1px solid ${C.border}`,
      background: C.bg,
    }}>
      {!isMobile && (
        <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', height: '100%' }}>
            <div style={{ position: 'absolute', left: '120px', top: 0, bottom: 0, width: '1px', background: C.border }} />
          </div>
        </div>
      )}

      <div style={{
        position: 'sticky', top: 0, height: '100vh', width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: C.bg, opacity: 0.96 }} />

        <div style={{ position: 'relative', zIndex: 4 }}>
          <div style={{ transform: `scale(${certScale})`, opacity: certOpacity }}>
            <div style={{
              position: 'relative', width: cardW,
              height: `calc(${cardW} / 1.414)`,
              transformStyle: isMobile ? 'flat' : 'preserve-3d',
            }}>
              {/* Layer 1: Metallic border frame */}
              <div style={{ position: 'absolute', inset: 0, transform: l1 }}>
                <svg viewBox="0 0 480 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0, display: 'block' }}>
                  <defs>
                    {/* Metallic silver/gunmetal gradient — replaces gold */}
                    <linearGradient id="certMetallic" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3A3A3A" />
                      <stop offset="30%" stopColor="#6E6E6E" />
                      <stop offset="55%" stopColor="#A8A8A8" />
                      <stop offset="75%" stopColor="#5A5A5A" />
                      <stop offset="100%" stopColor="#2E2E2E" />
                    </linearGradient>
                    <linearGradient id="certInner" x1="1" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#282828" />
                      <stop offset="50%" stopColor="#404040" />
                      <stop offset="100%" stopColor="#1E1E1E" />
                    </linearGradient>
                    {/* Swoosh clip path */}
                    <clipPath id="certClip">
                      <rect x="0" y="0" width="480" height="340" />
                    </clipPath>
                  </defs>
                  <rect x="0" y="0" width="480" height="340" fill={C.certBg}
                    style={{ filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.6))' }} />
                  {/* Outer metallic border */}
                  <rect x="1" y="1" width="478" height="338" fill="none"
                    stroke="url(#certMetallic)" strokeWidth="1.2" />
                  {/* Inner fine line */}
                  <rect x="10" y="10" width="460" height="320" fill="none"
                    stroke="url(#certInner)" strokeWidth="0.6" />
                  {/* Corner accents */}
                  {[[10,10],[470,10],[10,330],[470,330]].map(([cx,cy], i) => (
                    <g key={i}>
                      <rect x={cx-5} y={cy-5} width="10" height="10" fill="none"
                        stroke="#5A5A5A" strokeWidth="0.8" opacity="0.6" />
                    </g>
                  ))}

                  {/* Swoosh — single clean arc pass after assembly */}
                  {swooshTrigger && (
                    <motion.path
                      clipPath="url(#certClip)"
                      d="M -60 80 Q 100 20 240 170 Q 380 320 560 260"
                      fill="none"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: [0, 1, 1], opacity: [0, 0.9, 0] }}
                      transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1], times: [0, 0.55, 1] }}
                    />
                  )}
                </svg>
              </div>

              {/* Layer 2: Content — sharper, cleaner */}
              <div style={{
                position: 'absolute', inset: 0, transform: l2,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', padding: '36px',
              }}>
                <div style={{
                  fontFamily: F_MONO, fontSize: '10px', color: C.text3,
                  letterSpacing: '0.22em', marginBottom: '16px', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <div style={{ width: '20px', height: '1px', background: C.text4 }} />
                  CertifyROI · Route Analysis
                  <div style={{ width: '20px', height: '1px', background: C.text4 }} />
                </div>
                <div style={{
                  fontFamily: F_SERIF, fontWeight: '400',
                  fontSize: isMobile ? '1.7rem' : 'clamp(1.6rem, 3.4vw, 2.6rem)',
                  color: C.text, marginBottom: '4px', textAlign: 'center', lineHeight: 1.0,
                  letterSpacing: '-0.01em',
                }}>
                  Route Briefing
                </div>
                <div style={{
                  fontFamily: F_MONO, fontSize: '10px', color: C.text3,
                  marginBottom: '32px', textAlign: 'center', letterSpacing: '0.12em',
                }}>
                  Personalised · India 2026
                </div>

                <div style={{
                  display: 'flex', gap: '0', marginBottom: '24px',
                  width: '100%', justifyContent: 'center',
                  border: `1px solid ${C.border}`,
                }}>
                  {[
                    { l: 'PAYBACK', v: '6 MO' },
                    { l: '5-YR GAIN', v: '₹14.2L', accent: true },
                    { l: 'DELTA', v: '+35%' },
                  ].map((s, i) => (
                    <div key={i} style={{
                      textAlign: 'center', flex: 1, padding: '14px 8px',
                      borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
                    }}>
                      <div style={{ fontFamily: F_MONO, fontSize: '9px', color: C.text3, letterSpacing: '0.12em', marginBottom: '8px' }}>{s.l}</div>
                      <div style={{
                        fontFamily: F_MONO,
                        fontSize: isMobile ? '1rem' : 'clamp(0.95rem, 2.4vw, 1.4rem)',
                        color: s.accent ? C.goldL : C.text,
                        fontWeight: '500', letterSpacing: '-0.02em',
                      }}>{s.v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                  <CheckCircle2 size={10} color={C.text3} />
                  <span style={{ fontFamily: F_MONO, fontSize: '9px', color: C.text3, letterSpacing: '0.1em' }}>CALCULATED FROM YOUR INPUTS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{ opacity: hintOp, marginTop: '40px', textAlign: 'center', pointerEvents: 'none' }}>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.2em' }}>↓ SCROLL TO ASSEMBLE</div>
            </motion.div>
          </div>
        </div>

        {/* Assembled stamp */}
        <motion.div
          style={{ opacity: assembledOp }}
          initial={false}
        >
          <div style={{
            position: 'absolute', bottom: '10%', left: 0, right: 0,
            textAlign: 'center', pointerEvents: 'none', zIndex: 5,
          }}>
            <div style={{
              fontFamily: F_MONO, fontSize: '10px', color: C.silverL,
              letterSpacing: '0.18em', display: 'inline-block',
              padding: '8px 20px', border: `1px solid ${C.border}`,
              background: C.surface,
            }}>
              ✓ BRIEFING COMPILED
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// DATA COMPOSITION
// ─────────────────────────────────────────────────────────
function DataComposition() {
  const C = useTheme()
  const isMobile = useIsMobile()

  return (
    <StorySection id="02" title="METRICS" noBorderTop>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <div style={{
          fontFamily: F_MONO, fontSize: '10px', color: C.text3,
          letterSpacing: '0.16em', marginBottom: '32px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{ width: '4px', height: '4px', background: C.text3, borderRadius: '50%' }} />
          The numbers behind the route
        </div>
      </motion.div>

      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginBottom: '64px' }}>
        <div style={{
          fontFamily: F_MONO, fontSize: 'clamp(4rem, 11vw, 9rem)',
          color: C.text, lineHeight: 0.95, letterSpacing: '-0.05em', fontWeight: '400',
          display: 'flex', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 'clamp(2rem, 5vw, 4.2rem)', color: C.gold, marginTop: 'clamp(0.5rem, 1.2vw, 1.1rem)', marginRight: '2px', opacity: 0.8 }}>₹</span>
          <CountUp end={14.2} />
          <span style={{ fontSize: 'clamp(2rem, 5vw, 4.2rem)', color: C.gold, marginTop: 'clamp(0.5rem, 1.2vw, 1.1rem)', marginLeft: '4px', opacity: 0.8 }}>L</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: F_SANS, fontWeight: '500', fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', color: C.text2 }}>
            5-year net gain · AWS Solutions Architect
          </div>
          <div style={{
            padding: '3px 10px',
            background: C.surface, border: `1px solid ${C.border}`,
            fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em',
          }}>BLR MEDIAN '26</div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', borderTop: `1px solid ${C.border}` }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ padding: isMobile ? '40px 0' : '56px 56px 56px 0', borderBottom: isMobile ? `1px solid ${C.border}` : 'none', borderRight: isMobile ? 'none' : `1px solid ${C.border}` }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', marginBottom: '16px' }}>PAYBACK_PERIOD</div>
          <div style={{ fontFamily: F_MONO, fontSize: 'clamp(2.8rem, 7vw, 4.5rem)', color: C.text, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '400', marginBottom: '16px' }}>
            <CountUp end={6} suffix=" MO" />
          </div>
          <div style={{ fontFamily: F_SANS, fontSize: '15px', color: C.text2, lineHeight: '1.7', maxWidth: '34ch' }}>
            Not "a few months." The exact month your investment turns profitable — for your salary, your city.
          </div>
        </motion.div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }}
          style={{ padding: isMobile ? '40px 0' : '56px 0 56px 56px' }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', marginBottom: '16px' }}>SALARY_DELTA</div>
          <div style={{ fontFamily: F_MONO, fontSize: 'clamp(2.8rem, 7vw, 4.5rem)', color: C.text, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '400', marginBottom: '16px' }}>
            <CountUp end={35} suffix="%" />
          </div>
          <div style={{ fontFamily: F_SANS, fontSize: '15px', color: C.text2, lineHeight: '1.7', maxWidth: '34ch' }}>
            India-sourced. City-specific. Not US data converted at today's rate and called "India salary insights."
          </div>
        </motion.div>
      </div>
    </StorySection>
  )
}

// ─────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────
function HowItWorks({ onEnter }) {
  const C = useTheme()
  const isMobile = useIsMobile()
  const steps = [
    { id: '01', label: 'Basecamp', subtitle: 'Establish elevation', desc: 'Your current salary, role, and city. Upload a resume and AI sets your starting position precisely.' },
    { id: '02', label: 'Route', subtitle: 'Choose the line', desc: 'Select a certification or let AI map the highest-ROI route. Compare up to three lines side by side.' },
    { id: '03', label: 'Summit', subtitle: 'Know before you climb', desc: 'Exact payback month, 5-year net gain, monthly delta, and a clear verdict — before you pay the exam fee.' },
  ]

  return (
    <StorySection id="03" title="ARCHITECTURE" bg={C.surface}>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2 style={{
          fontFamily: F_SANS, fontWeight: '700',
          fontSize: 'clamp(2rem, 5vw, 3.6rem)',
          color: C.text, letterSpacing: '-0.03em', lineHeight: 1.0, margin: '0 0 56px',
        }}>
          Three stages.<br />One clear answer.
        </h2>
      </motion.div>

      <motion.div variants={STAGGER} initial="hidden" whileInView="show" viewport={{ once: true }}
        style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '40px' : '48px' }}>
        {steps.map((step) => (
          <motion.div key={step.id} variants={RISE}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '28px', color: C.text4, fontWeight: '400', lineHeight: 1, letterSpacing: '-0.04em' }}>{step.id}</div>
              <div style={{ flex: 1, height: '1px', background: C.border }} />
            </div>
            <div style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: '18px', color: C.text, marginBottom: '6px', letterSpacing: '-0.02em' }}>{step.label}</div>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>{step.subtitle}</div>
            <div style={{ fontFamily: F_SANS, fontSize: '15px', color: C.text2, lineHeight: '1.7' }}>{step.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginTop: '56px' }}>
        <PillBtn onClick={onEnter} large>Calculate ROI <ArrowRight size={14} /></PillBtn>
      </motion.div>
    </StorySection>
  )
}

// ─────────────────────────────────────────────────────────
// VS SECTION
// ─────────────────────────────────────────────────────────
function VsSection() {
  const C = useTheme()
  const pairs = [
    {
      wrong: '"AWS is good for cloud engineers"',
      right: 'AWS SAA at ₹9L salary: payback month 6. ₹14.2L net gain over 5 years. Exact, not estimated.',
    },
    {
      wrong: '"Upskill for career growth"',
      right: '₹23,600 extra every month from month 7 — compounding over 5 years. In rupees, not "growth."',
    },
    {
      wrong: 'US salary data converted to rupees',
      right: 'Naukri · AmbitionBox · LinkedIn India. 2026 data. Not converted from San Francisco.',
    },
  ]

  return (
    <StorySection id="04" title="HAZARDS" bg={C.bg}>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2 style={{
          fontFamily: F_SANS, fontWeight: '700',
          fontSize: 'clamp(2rem, 5vw, 3.6rem)',
          color: C.text, letterSpacing: '-0.03em', lineHeight: 1.0, margin: '0 0 56px',
        }}>
          Every other guide<br />is pointing you wrong.
        </h2>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {pairs.map((pair, i) => (
          <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{
              paddingTop: i > 0 ? '40px' : '0',
              paddingBottom: i < pairs.length - 1 ? '40px' : '0',
              borderBottom: i < pairs.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
            <div style={{
              fontFamily: F_SANS, fontSize: '15px', color: C.text3,
              marginBottom: '12px', textDecoration: 'line-through', opacity: 0.45,
            }}>
              {pair.wrong}
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '2px', height: '18px', background: C.silver, marginTop: '3px', flexShrink: 0, opacity: 0.5 }} />
              <div style={{ fontFamily: F_SANS, fontSize: '16px', color: C.text, lineHeight: '1.65', fontWeight: '400' }}>{pair.right}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </StorySection>
  )
}

// ─────────────────────────────────────────────────────────
// 11 PM STORIES
// ─────────────────────────────────────────────────────────
function ElevenPM({ onEnter }) {
  const C = useTheme()
  const isMobile = useIsMobile()
  const stories = [
    {
      time: '11:47 PM',
      name: 'Rohan, Pune',
      role: '2 yrs · Backend Engineer',
      thought: '"Should I do AWS? Or is it already too late?"',
      answer: 'AWS SAA at ₹9L: payback month 6. 5-year gain ₹14.2L.',
    },
    {
      time: '11:12 PM',
      name: 'Sneha, Bangalore',
      role: '6 yrs · Ops Manager',
      thought: '"Is the switch possible without an MBA?"',
      answer: 'Google Data Analytics + 2 GitHub projects. 5 months. ₹8L → ₹12L.',
    },
    {
      time: '12:03 AM',
      name: 'Arjun, Pune',
      role: 'CS · Fresh graduate',
      thought: '"Which cert gets me placed — here, in India?"',
      answer: 'Student Mode. GCP placed 47 Pune freshers in Q1 2026.',
    },
  ]

  return (
    <StorySection id="05" title="CLIMBERS" bg={C.surface}>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2 style={{
          fontFamily: F_SANS, fontWeight: '700',
          fontSize: 'clamp(2rem, 5vw, 3.6rem)',
          color: C.text, letterSpacing: '-0.03em', lineHeight: 1.0, margin: '0 0 56px',
        }}>
          We know what you're<br />thinking right now.
        </h2>
      </motion.div>

      <motion.div variants={STAGGER} initial="hidden" whileInView="show" viewport={{ once: true }}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          borderTop: `1px solid ${C.border}`,
        }}>
        {stories.map((s, i) => {
          const last = i === stories.length - 1
          return (
            <motion.div key={i} variants={RISE}
              onClick={onEnter}
              style={{
                paddingLeft: !isMobile && i > 0 ? '40px' : '0',
                paddingRight: !isMobile && i < 2 ? '40px' : '0',
                paddingTop: '40px', paddingBottom: '40px',
                borderRight: !isMobile && !last ? `1px solid ${C.border}` : 'none',
                borderBottom: isMobile && !last ? `1px solid ${C.border}` : 'none',
                cursor: 'pointer',
              }}>
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.08em', marginBottom: '16px', opacity: 0.7 }}>{s.time}</div>
              <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400', fontSize: '20px', color: C.text, lineHeight: 1.3, marginBottom: '16px' }}>{s.thought}</div>
              <div style={{ fontFamily: F_SANS, fontSize: '13px', color: C.text2, marginBottom: '24px', lineHeight: '1.6' }}>
                {s.name} — {s.role}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '2px', height: '14px', background: C.text3, marginTop: '3px', flexShrink: 0, opacity: 0.4 }} />
                <div style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: '13px', color: C.text, lineHeight: '1.55' }}>{s.answer}</div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </StorySection>
  )
}

// ─────────────────────────────────────────────────────────
// THREE MODES
// ─────────────────────────────────────────────────────────
function ThreeModes() {
  const C = useTheme()
  const isMobile = useIsMobile()
  const modes = [
    { label: 'Student', sub: 'No salary yet', desc: 'Path to a ₹4.8L+ first offer. ROI framed as career investment, not salary delta.' },
    { label: 'Switcher', sub: 'Changing domains', desc: 'Domain switch in 5–8 months. Long certifications hidden. Only fast-track paths shown.' },
    { label: 'Professional', sub: 'Levelling up', desc: 'Maximum ROI on your next cert. Payback analysis, city benchmarks, pitch-your-boss email.' },
  ]

  return (
    <StorySection id="06" title="MODES" bg={C.bg}>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2 style={{
          fontFamily: F_SANS, fontWeight: '700',
          fontSize: 'clamp(2rem, 5vw, 3.6rem)',
          color: C.text, letterSpacing: '-0.03em', lineHeight: 1.0, margin: '0 0 56px',
        }}>
          Three modes.<br /><span style={{ color: C.gold, opacity: 0.85 }}>One tool.</span>
        </h2>
      </motion.div>

      <motion.div variants={STAGGER} initial="hidden" whileInView="show" viewport={{ once: true }}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '0',
          border: `1px solid ${C.border}`,
        }}>
        {modes.map((m, i) => (
          <motion.div key={m.label} variants={RISE}
            style={{
              padding: isMobile ? '32px 24px' : '40px 36px',
              borderRight: !isMobile && i < 2 ? `1px solid ${C.border}` : 'none',
              borderBottom: isMobile && i < 2 ? `1px solid ${C.border}` : 'none',
            }}>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', marginBottom: '14px', opacity: 0.7 }}>
              0{i + 1}
            </div>
            <div style={{ fontFamily: F_SANS, fontWeight: '700', fontSize: '19px', color: C.text, letterSpacing: '-0.02em', marginBottom: '6px' }}>{m.label}</div>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '18px' }}>{m.sub}</div>
            <div style={{ fontFamily: F_SANS, fontSize: '15px', color: C.text2, lineHeight: '1.7' }}>{m.desc}</div>
          </motion.div>
        ))}
      </motion.div>
    </StorySection>
  )
}

// ─────────────────────────────────────────────────────────
// SOCIAL PROOF
// ─────────────────────────────────────────────────────────
function SocialProof() {
  const C = useTheme()
  const isMobile = useIsMobile()
  const quotes = [
    { quote: 'CertifyROI said payback was month 8. It was month 7. Switched companies. ₹6L hike.', name: 'Priya S.', detail: 'Bangalore · Engineer → Cloud Architect', result: '+₹6L/yr' },
    { quote: 'Was about to spend ₹12L on an MBA. The analysis showed a different path. 5 months, 1% of the cost.', name: 'Rahul M.', detail: 'Hyderabad · Ops Manager → Data Analyst', result: 'Saved ₹12L' },
    { quote: 'Student Mode. GCP placed 47 Pune freshers in Q1 2026. My ₹5.2L offer was one of them.', name: 'Ananya K.', detail: 'Pune · Fresh Graduate', result: '₹5.2L offer' },
  ]

  return (
    <StorySection id="07" title="FIELD_REPORTS" bg={C.surface}>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2 style={{
          fontFamily: F_SANS, fontWeight: '700',
          fontSize: 'clamp(2rem, 5vw, 3.6rem)',
          color: C.text, letterSpacing: '-0.03em', lineHeight: 1.0, margin: '0 0 56px',
        }}>
          They chose the right route.<br /><span style={{ color: C.gold, opacity: 0.85 }}>It worked.</span>
        </h2>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {quotes.map((q, i) => {
          const last = i === quotes.length - 1
          return (
            <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
              style={{
                paddingTop: i > 0 ? '48px' : '0',
                paddingBottom: !last ? '48px' : '0',
                borderBottom: !last ? `1px solid ${C.border}` : 'none',
                display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 180px',
                gap: '24px', alignItems: 'end',
              }}>
              <div>
                <div style={{
                  fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400',
                  fontSize: 'clamp(1.15rem, 2.2vw, 1.65rem)',
                  color: C.text, letterSpacing: '-0.01em', lineHeight: 1.35, marginBottom: '24px',
                }}>
                  "{q.quote}"
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ width: '14px', height: '1px', background: C.text3, flexShrink: 0 }} />
                  <span style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: '13px', color: C.text }}>{q.name}</span>
                  <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3 }}>{q.detail}</span>
                </div>
              </div>
              <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                <div style={{
                  fontFamily: F_MONO, fontWeight: '500',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: C.text, letterSpacing: '-0.04em', lineHeight: 1,
                }}>{q.result}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </StorySection>
  )
}

// ─────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: 'How accurate are the ROI calculations?', a: 'Based on median salary data from Naukri, AmbitionBox, and LinkedIn India — updated quarterly. Directional estimates, not guarantees.' },
  { q: 'Do I need to create an account?', a: 'No. The ROI calculator, comparison tool, and city demand heatmap are all free with no signup required.' },
  { q: 'What certifications are covered?', a: '103 certifications across 17 domains — cloud, data, cybersecurity, finance, project management, and more.' },
  { q: 'Is this only useful for India?', a: 'Salary benchmarks and demand data are India-specific. The framework applies anywhere, but numbers are calibrated for India.' },
  { q: 'How does the Resume AI work?', a: 'Upload a resume or paste your profile. AI reads your domain, role, and experience, then recommends the highest-ROI certifications for your background.' },
]

function FAQItem({ item }) {
  const C = useTheme()
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '22px 0',
        background: 'none', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontFamily: F_SANS, fontWeight: '500', fontSize: '16px', color: C.text, letterSpacing: '-0.01em', lineHeight: 1.4 }}>{item.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0 }}>
          <ChevronDown size={15} color={C.text3} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="ans"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
            <div style={{ paddingBottom: '22px', fontFamily: F_SANS, fontSize: '15px', color: C.text2, lineHeight: '1.7', maxWidth: '64ch' }}>{item.a}</div>
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
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', gap: isMobile ? '40px' : '72px', alignItems: 'start' }}>
        <div style={{ position: isMobile ? 'static' : 'sticky', top: '140px' }}>
          <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ fontFamily: F_SANS, fontWeight: '700', fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)', color: C.text, letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0 }}>
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

// ─────────────────────────────────────────────────────────
// FINAL CTA — centered, bold, memorable
// ─────────────────────────────────────────────────────────
function FinalCTA({ onEnter }) {
  const C = useTheme()
  const isMobile = useIsMobile()
  return (
    <div style={{
      background: C.bg,
      borderTop: `1px solid ${C.border}`,
      padding: isMobile ? '80px 24px' : '120px 0',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle radial vignette top */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '1px',
        background: `linear-gradient(to right, transparent, ${C.border}, transparent)`,
      }} />

      {/* Faint grid lines decoration */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke={C.text} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.22em', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            <div style={{ width: '32px', height: '1px', background: C.border }} />
            SUMMIT ACCESS
            <div style={{ width: '32px', height: '1px', background: C.border }} />
          </div>

          <h2 style={{
            fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400',
            fontSize: isMobile ? 'clamp(3rem, 12vw, 5rem)' : 'clamp(4rem, 8vw, 6.5rem)',
            color: C.text, letterSpacing: '-0.025em', lineHeight: 0.93,
            margin: '0 0 32px',
          }}>
            You will know<br />the answer.
          </h2>

          <p style={{
            fontFamily: F_SANS, fontSize: isMobile ? '15px' : '16px',
            color: C.text2, lineHeight: '1.7', maxWidth: '38ch',
            margin: '0 auto 48px',
          }}>
            Stop reading generic advice. Stop asking Reddit.{' '}
            <span style={{ color: C.text, fontWeight: '500' }}>Know the exact payback period before you pay the exam fee.</span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
            <PillBtn onClick={onEnter} large>Calculate ROI <ArrowRight size={14} /></PillBtn>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', opacity: 0.7 }}>
              Complimentary · Private · India-calibrated
            </div>
          </div>
        </motion.div>
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
  const onEnter = () => { console.log('ROI triggered') }

  return (
    <ThemeContext.Provider value={C}>
      <div style={{
        minHeight: '100vh',
        background: C.bg,
        color: C.text,
        overflow: 'clip',
        // No border-radius — cleaner without it on full viewport
        transition: 'background 0.3s ease, color 0.3s ease',
      }}>

        <DynamicIslandNav isDark={isDark} toggleTheme={() => setIsDark(!isDark)} onEnter={onEnter} />

        {/* ── HERO ── */}
        <div style={{
          position: 'relative',
          height: '100svh',
          minHeight: '640px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${C.border}`,
          overflow: 'hidden',
        }}>
          {/* Mountain — centered, fade in from slight left, no right bleed */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              // Desktop: right-center composition. Mobile: full width bottom
              right: isMobile ? '0' : '-2%',
              bottom: 0,
              width: isMobile ? '100%' : '62%',
              height: isMobile ? '55%' : '88%',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            {/* Gradient fade on left edge — blends mountain into bg */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: isMobile ? '30%' : '22%',
              background: `linear-gradient(to right, ${C.bg}, transparent)`,
              zIndex: 2,
            }} />
            {/* Gradient fade bottom */}
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              height: '18%',
              background: `linear-gradient(to top, ${C.bg}, transparent)`,
              zIndex: 2,
            }} />
            <img
              src="/mountain.png" alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom right', display: 'block' }}
            />
          </motion.div>

          {/* Hero content — left column */}
          <div style={{
            position: 'relative', zIndex: 3,
            width: '100%', maxWidth: '1400px', margin: '0 auto',
          }}>
            <div style={{
              paddingLeft: isMobile ? '24px' : '8vw',
              paddingRight: isMobile ? '24px' : '0',
              paddingTop: isMobile ? '80px' : '0',
              maxWidth: isMobile ? '100%' : '52%',
            }}>
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                style={{
                  fontFamily: F_MONO, fontSize: '10px', color: C.text3,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  marginBottom: '32px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}
              >
                <div style={{ width: '24px', height: '1px', background: C.gold, opacity: 0.7 }} />
                ROI Analysis Platform
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: F_SERIF, fontWeight: '400',
                  fontSize: isMobile ? 'clamp(3rem, 10vw, 5.5rem)' : 'clamp(4.2rem, 7.5vw, 8rem)',
                  lineHeight: 0.93, letterSpacing: '-0.02em',
                  color: C.text, marginBottom: '28px',
                  maxWidth: '13ch',
                }}
              >
                Your next cert<br />
                is either a{' '}
                <span style={{ color: C.gold, fontStyle: 'italic', opacity: 0.9 }}>goldmine</span><br />
                or a{' '}
                <span style={{ color: C.text3, fontStyle: 'italic' }}>mistake.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  fontFamily: F_SANS, fontSize: isMobile ? '14px' : '16px',
                  color: C.text2, maxWidth: '38ch',
                  lineHeight: '1.65', margin: '0 0 40px',
                }}
              >
                Know the exact payback period before you pay the fee —
                calculated for your city and current salary.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.28 }}
              >
                <PillBtn onClick={onEnter} large>Calculate ROI <ArrowRight size={14} /></PillBtn>
              </motion.div>
            </div>
          </div>

          {/* Bottom scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{
              position: 'absolute', bottom: '28px', left: isMobile ? '24px' : '8vw',
              zIndex: 3, display: 'flex', alignItems: 'center', gap: '10px',
            }}
          >
            <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.2em', opacity: 0.6 }}>↓ SCROLL</div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── SECTIONS ── */}
        <TrustStrip />
        <CertAssembly />
        <DataComposition />
        <HowItWorks onEnter={onEnter} />
        <VsSection />
        <ElevenPM onEnter={onEnter} />
        <ThreeModes />
        <SocialProof />
        <FAQ />
        <FinalCTA onEnter={onEnter} />

        {/* ── FOOTER ── */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '28px 0', background: C.bgAlt }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
            {!isMobile && <div style={{ width: '120px', borderRight: `1px solid ${C.border}`, flexShrink: 0 }} />}
            <div style={{
              flex: 1, padding: isMobile ? '0 24px' : '0 7vw',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={14} color={C.silver} />
                <span style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: '13px', color: C.text }}>
                  Certify<span style={{ color: C.gold }}>ROI</span>
                </span>
              </div>
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em', opacity: 0.7 }}>
                DATA: LINKEDIN · NASSCOM · NAUKRI · 2026
              </div>
            </div>
          </div>
        </div>

      </div>
    </ThemeContext.Provider>
  )
}