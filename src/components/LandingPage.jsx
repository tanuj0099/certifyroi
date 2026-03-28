import {
  motion, useAnimationFrame, useScroll, useTransform,
  useSpring, useMotionValue, AnimatePresence
} from 'framer-motion'
import { useRef, useState, useCallback, useEffect } from 'react'
import {
  TrendingUp, FileText, ArrowRight,
  GraduationCap, Repeat, Briefcase, Star, Zap, Award,
  Brain, ChevronRight, CheckCircle
} from 'lucide-react'
import NeonCard from './NeonCard.jsx'
import WaveBg   from './WaveBg.jsx'

// Theme-aware hook for cert card
const useIsDark = () => {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') !== 'light'
  )
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return isDark
}

const F_HEAD = "'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif"
const F_MONO = "'Commit Mono', 'JetBrains Mono', monospace"
const F_BODY = "'Inter', sans-serif"

// ── Gradient text helpers ──────────────────────────────────────
const G = ({ children, colors = ['#51B1E7','#818CF8','#10B981'] }) => (
  <span style={{ background: `linear-gradient(135deg, ${colors.join(',')})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline' }}>{children}</span>
)
const GPurple = ({ c }) => <G colors={['#6366F1','#818CF8','#A78BFA']}>{c}</G>
const GGold   = ({ c }) => <G colors={['#F59E0B','#EF4444']}>{c}</G>
const GGreen  = ({ c }) => <G colors={['#10B981','#34D399','#51B1E7']}>{c}</G>
const GRed    = ({ c }) => <G colors={['#EF4444','#F59E0B']}>{c}</G>

// ── Scanline overlay ───────────────────────────────────────────
const ScanlineOverlay = () => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none',
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)',
    mixBlendMode: 'multiply',
  }} />
)

// ── Ghost number ───────────────────────────────────────────────
const GhostNumber = ({ value, style = {} }) => (
  <div style={{
    fontFamily: F_HEAD, fontWeight: '800',
    fontSize: 'clamp(120px, 22vw, 300px)',
    lineHeight: 1, letterSpacing: '-0.05em',
    color: 'transparent',
    WebkitTextStroke: '1.5px rgba(99,102,241,0.1)',
    userSelect: 'none', pointerEvents: 'none',
    position: 'absolute', whiteSpace: 'nowrap', ...style,
  }}>{value}</div>
)

// ── 3D tilt card ───────────────────────────────────────────────
const MachinedCard = ({ children, style = {}, glowColor = '#6366F1', intensity = 10, onClick, draggable = false }) => {
  const ref = useRef(null)
  const x   = useMotionValue(0)
  const y   = useMotionValue(0)
  const rx  = useSpring(x, { stiffness: 400, damping: 40, mass: 1.2 })
  const ry  = useSpring(y, { stiffness: 400, damping: 40, mass: 1.2 })
  const [glow, setGlow] = useState({ x: 50, y: 50, op: 0 })

  const onMove = useCallback(e => {
    if (!ref.current) return
    const r  = ref.current.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width  - 0.5
    const ny = (e.clientY - r.top)  / r.height - 0.5
    x.set(ny * -intensity); y.set(nx * intensity)
    setGlow({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, op: 1 })
  }, [x, y, intensity])

  const onLeave = useCallback(() => {
    x.set(0); y.set(0); setGlow(p => ({ ...p, op: 0 }))
  }, [x, y])

  const dragProps = draggable ? {
    drag: true,
    dragConstraints: { top: -12, bottom: 12, left: -12, right: 12 },
    dragElastic: 0.08,
    dragTransition: { bounceStiffness: 600, bounceDamping: 40 },
  } : {}

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...dragProps}
      style={{
        rotateX: rx, rotateY: ry, perspective: 800,
        transformStyle: 'preserve-3d',
        position: 'relative', borderRadius: '18px',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'inset 0 1px 0 var(--card-highlight), 0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden', willChange: 'transform',
        cursor: onClick ? 'pointer' : draggable ? 'grab' : 'default', ...style,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
    >
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '18px',
        pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(circle 200px at ${glow.x}% ${glow.y}%, ${glowColor}14 0%, transparent 70%)`,
        opacity: glow.op, transition: 'opacity 0.3s',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </motion.div>
  )
}

// ── Floating orb ───────────────────────────────────────────────
const Orb = ({ color, size, style, delay = 0 }) => (
  <motion.div
    animate={{ y: [0, -24, 0], scale: [1, 1.06, 1] }}
    transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, pointerEvents: 'none', ...style }}
  />
)

// ── Scrolling ticker ───────────────────────────────────────────
const Ticker = () => {
  const items = [
    '⚡ AWS cert holders earn ₹2.4L more/yr in Bangalore',
    '📍 2,400+ cloud roles open on Naukri right now',
    '🎯 Average break-even on PMP: 7 months',
    '🚀 Google Data Analytics: ₹18K cost → ₹3.2L annual gain',
    '🏆 CKA Kubernetes: highest hike in India 2026 — +40%',
    '📊 Hyderabad cloud demand up 38% YoY',
    '💡 Most Indian engineers guess wrong about which cert to do first',
  ]
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '12px 0', background: 'var(--surface)' }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '60px', whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: F_MONO, flexShrink: 0 }}>
            <span style={{ color: 'var(--indigo-light)', marginRight: '12px' }}>◆</span>{item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Money counter ──────────────────────────────────────────────
const MoneyCounter = () => {
  const [r, setR] = useState(0)
  useEffect(() => {
    const rate = 320000 / (365 * 24 * 3600 * 10)
    const t = setInterval(() => setR(v => v + rate), 100)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ padding: '22px', borderRadius: '14px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
      <div style={{ fontSize: '10px', color: '#EF4444', fontFamily: F_MONO, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>
        ₹ SLIPPING AWAY WHILE YOU READ THIS
      </div>
      <div style={{ fontFamily: F_MONO, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: '#EF4444', fontWeight: '700', letterSpacing: '-0.03em' }}>
        ₹{r.toFixed(2)}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '7px', fontFamily: F_BODY, lineHeight: '1.5' }}>
        avg ₹3.2L/yr salary gap for uncertified professionals
      </div>
    </div>
  )
}

// ── Cert assembly (300vh sticky scroll) ───────────────────────
// Theme-aware overlay for cert assembly dark screen effect
const ThemeAwareOverlay = ({ opacity }) => {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') !== 'light'
  )
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
      background: isDark ? '#020408' : '#F0EDE8',
      opacity,
    }} />
  )
}
const CertAssembly = () => {
  const isDark = useIsDark()

const certBg    = isDark ? '#04060e'              : '#F8F7F4'
const certText1 = isDark ? '#F0F2FF'              : '#0F172A'
const certText2 = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,23,42,0.45)'
const certMuted = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.3)'
const certDot   = isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'
  const trackRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })

  const [prog, setProg] = useState(0)
  useEffect(() => {
    const unsub = scrollYProgress.on('change', v => setProg(v))
    return unsub
  }, [scrollYProgress])

  const remap = (p, inMin, inMax, outMin, outMax) => {
    const t = Math.max(0, Math.min(1, (p - inMin) / (inMax - inMin)))
    return outMin + (outMax - outMin) * t
  }
  const p8 = remap(prog, 0, 0.8, 0, 1)

  const l1 = `perspective(1200px) translateZ(${remap(p8,0,1,-280,0)}px) translateY(${remap(p8,0,1,-80,0)}px) rotateY(${remap(p8,0,1,32,0)}deg) rotateX(${remap(p8,0,1,15,0)}deg)`
  const l2 = `perspective(1200px) translateZ(${remap(p8,0,1,280,0)}px) translateY(${remap(p8,0,1,80,0)}px) rotateY(${remap(p8,0,1,-26,0)}deg) rotateX(${remap(p8,0,1,-12,0)}deg)`
  const l3 = `perspective(1200px) translateZ(${remap(p8,0,1,-140,0)}px) translateY(${remap(p8,0,1,-30,0)}px) rotateY(${remap(p8,0,1,15,0)}deg) rotateX(${remap(p8,0,1,6,0)}deg)`

  const certScale   = prog < 0.8 ? remap(prog,0,0.8,0.62,1.0) : remap(prog,0.8,1.0,1.0,0.85)
  const certOpacity = prog < 0.05 ? remap(prog,0,0.05,0,1) : prog > 0.85 ? remap(prog,0.85,1.0,1,0) : 1
  const overlayOp   = prog < 0.08 ? remap(prog,0,0.08,0,0.94) : prog > 0.92 ? remap(prog,0.92,1,0.94,0) : 0.94
  const gridOp      = remap(prog,0.04,0.14,0,1)
  const hintOp      = prog > 0.16 ? 0 : prog > 0.06 ? remap(prog,0.06,0.16,1,0) : 1
  const assembledOp = remap(prog,0.78,0.88,0,1)

  const [flare, setFlare] = useState(false)
  const [shake, setShake] = useState(false)
  const fired = useRef(false)

  useEffect(() => {
    const unsub = scrollYProgress.on('change', v => {
      const sp = remap(v, 0.74, 0.82, 0, 1)
      if (sp > 0.96 && !fired.current) {
        fired.current = true
        setShake(true); setFlare(true)
        setTimeout(() => setFlare(false), 700)
        setTimeout(() => setShake(false), 440)
      }
      if (sp < 0.05) fired.current = false
    })
    return unsub
  }, [scrollYProgress])

  return (
    <div ref={trackRef} className="cert-assembly-track" style={{ height: '300vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        <ThemeAwareOverlay opacity={overlayOp} />

        <div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', opacity: gridOp,
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', opacity: gridOp }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(99,102,241,0.14)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(99,102,241,0.14)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 4 }}>
          <motion.div animate={shake ? { x: [0,-7,7,-5,5,-2,2,0] } : { x: 0 }} transition={{ duration: 0.38, ease: 'easeOut' }}>
            <div style={{ transform: `scale(${certScale})`, opacity: certOpacity }}>
              <div style={{ position: 'relative', width: 'min(500px, 88vw)', height: 'calc(min(500px, 88vw) / 1.414)', transformStyle: 'preserve-3d' }}>

                <AnimatePresence>
                  {flare && (
                    <motion.div key="flare"
                      initial={{ x: '-120%', opacity: 1 }}
                      animate={{ x: '230%', opacity: 0 }}
                      transition={{ duration: 0.65, ease: 'easeOut' }}
                      style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', borderRadius: '14px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09) 30%, rgba(180,150,255,0.28) 50%, rgba(255,255,255,0.06) 70%, transparent)' }}
                    />
                  )}
                </AnimatePresence>

                {/* Layer 1 — border frame */}
                <div style={{ position: 'absolute', inset: 0, transform: l1 }}>
                  <svg viewBox="0 0 500 354" width="100%" height="100%" style={{ position: 'absolute', inset: 0, display: 'block' }}>
                    <defs>
                      <linearGradient id="cBorder" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%"   stopColor="#6366F1"/>
                        <stop offset="32%"  stopColor="#818CF8"/>
                        <stop offset="66%"  stopColor="#10B981"/>
                        <stop offset="100%" stopColor="#51B1E7"/>
                      </linearGradient>
                      <filter id="cGlow">
                        <feGaussianBlur stdDeviation="2.5" result="b"/>
                        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                    </defs>
                    <rect x="0" y="0" width="500" height="354" rx="16" fill={certBg} fillOpacity="0.97"/>
                    <rect x="1.5" y="1.5" width="497" height="351" rx="15" fill="none" stroke="url(#cBorder)" strokeWidth="2.5" filter="url(#cGlow)"/>
                    <rect x="10" y="10" width="480" height="334" rx="11" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="0.6"/>
                    {[[22,22],[478,22],[22,332],[478,332]].map(([cx,cy],i) => (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="5.5" fill="none" stroke="#6366F1" strokeWidth="1.6"/>
                        <circle cx={cx} cy={cy} r="10" fill="none" stroke="rgba(99,102,241,0.28)" strokeWidth="0.6"/>
                        <line x1={cx-14} y1={cy} x2={cx+14} y2={cy} stroke="rgba(99,102,241,0.5)" strokeWidth="0.7"/>
                        <line x1={cx} y1={cy-14} x2={cx} y2={cy+14} stroke="rgba(99,102,241,0.5)" strokeWidth="0.7"/>
                      </g>
                    ))}
                    <line x1="48"  y1="1.5"   x2="100" y2="1.5"   stroke="#818CF8" strokeWidth="3.5"/>
                    <line x1="400" y1="1.5"   x2="452" y2="1.5"   stroke="#10B981" strokeWidth="3.5"/>
                    <line x1="48"  y1="352.5" x2="100" y2="352.5" stroke="#10B981" strokeWidth="3.5"/>
                    <line x1="400" y1="352.5" x2="452" y2="352.5" stroke="#818CF8" strokeWidth="3.5"/>
                  </svg>
                </div>

                {/* Layer 2 — content */}
                <div style={{ position: 'absolute', inset: 0, transform: l2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,4vw,40px)' }}>
                  <div style={{ fontFamily: F_MONO, fontSize: '9px', color: 'rgba(99,102,241,0.72)', letterSpacing: '0.26em', marginBottom: '11px', textTransform: 'uppercase' }}>CERTIFYROI · INDIA 2026</div>
                  <div style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(0.9rem,3.2vw,1.75rem)', letterSpacing: '-0.04em', color: certText1, marginBottom: '6px', textAlign: 'center', lineHeight: 1.1 }}>Your Certification</div>
<div style={{ fontFamily: F_BODY, fontSize: 'clamp(10px,1.5vw,12px)', color: certText2, marginBottom: '22px', textAlign: 'center' }}>Personalised ROI Analysis · Your City</div>
                  <div style={{ display: 'flex', gap: 'clamp(10px,4vw,40px)', marginBottom: '18px' }}>
                    {[
                      { label: 'BREAK-EVEN', value: '6 mo',   color: '#F59E0B' },
                      { label: '5-YR GAIN',  value: '₹14.2L', color: '#10B981' },
                      { label: 'HIKE',        value: '+35%',   color: '#818CF8' },
                    ].map((s,i) => (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: F_MONO, fontSize: '7px', color: certMuted, letterSpacing: '0.12em', marginBottom: '5px' }}>{s.label}</div>
                        <div style={{ fontFamily: F_MONO, fontSize: 'clamp(0.8rem,2.5vw,1.5rem)', color: s.color, fontWeight: '700', letterSpacing: '-0.03em' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ width: '74%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.55), transparent)', marginBottom: '12px' }} />
                  <div style={{ fontFamily: F_MONO, fontSize: '7px', color: certMuted, letterSpacing: '0.14em', textAlign: 'center' }}>VERIFIED BY AI · DATA: NAUKRI MARCH 2026</div>
                </div>

                {/* Layer 3 — seal */}
                <div style={{ position: 'absolute', right: '6%', bottom: '8%', transform: l3 }}>
                  <svg viewBox="0 0 72 72" width="clamp(36px,8vw,72px)" height="clamp(36px,8vw,72px)">
                    <defs>
                      <linearGradient id="sealG" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%"   stopColor="#6366F1" stopOpacity="0.9"/>
                        <stop offset="50%"  stopColor="#10B981" stopOpacity="0.7"/>
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9"/>
                      </linearGradient>
                    </defs>
                    <polygon points="36,4 43,22 62,22 48,35 54,54 36,43 18,54 24,35 10,22 29,22" fill="none" stroke="url(#sealG)" strokeWidth="1.5"/>
                    <circle cx="36" cy="36" r="10" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1"/>
                    <circle cx="36" cy="36" r="4.5" fill={certDot}/>
                    <text x="36" y="40" textAnchor="middle" fontSize="7" fill="#818CF8" fontFamily="monospace" fontWeight="700">AI</text>
                  </svg>
                </div>

              </div>
            </div>
          </motion.div>

          <div style={{ opacity: hintOp, marginTop: '44px', textAlign: 'center', pointerEvents: 'none', transition: 'opacity 0.3s' }}>
            <motion.div animate={{ y: [0,8,0] }} transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '11px', color: 'rgba(99,102,241,0.65)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>↓  scroll to assemble  ↓</div>
            </motion.div>
          </div>
        </div>

        <div style={{ opacity: assembledOp, position: 'absolute', bottom: '8%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 5, transition: 'opacity 0.3s' }}>
          <div style={{ fontFamily: F_MONO, fontSize: '12px', color: 'rgba(16,185,129,0.9)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>✓  YOUR ROI CERTIFICATE · ASSEMBLED</div>
        </div>
      </div>
    </div>
  )
}

// ── MAIN LANDING PAGE ─────────────────────────────────────────
const LandingPage = ({ onEnter }) => {
  const heroRef = useRef(null)
  const { scrollYProgress: heroSP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY  = useTransform(heroSP, [0, 1], [0, 100])
  const heroOp = useTransform(heroSP, [0, 0.55], [1, 0])
  const heroSc = useTransform(heroSP, [0, 0.55], [1, 0.93])
  const ghostY = useTransform(heroSP, [0, 1], [0, 180])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'clip' }}>
      <ScanlineOverlay />
      <WaveBg variant="landing" />

      {/* Fixed ambient orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <Orb color="rgba(99,102,241,0.08)"  size={700} style={{ top: '-20%', left: '5%' }}   delay={0} />
        <Orb color="rgba(16,185,129,0.05)"  size={500} style={{ bottom: '5%', right: '0%' }} delay={2} />
        <Orb color="rgba(81,177,231,0.05)"  size={350} style={{ top: '45%', right: '15%' }}  delay={4} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ──────────────────────────────────── */}
        <div ref={heroRef} style={{ maxWidth: '960px', margin: '0 auto', padding: 'calc(var(--nav-h) + 56px) 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <motion.div style={{ y: ghostY, position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 0, pointerEvents: 'none' }}>
            <GhostNumber value="ROI" />
          </motion.div>

          <motion.div style={{ y: heroY, opacity: heroOp, scale: heroSc, position: 'relative', zIndex: 1 }}>

            <motion.div
              initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '20px', background: 'var(--indigo-dim)', border: '1px solid var(--border-accent)', fontSize: '11px', color: 'var(--indigo-light)', marginBottom: '28px', letterSpacing: '0.08em', fontFamily: F_MONO }}
            >
              <Award size={12} /> INDIA'S FIRST AI-POWERED CERT ROI CALCULATOR
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(2.4rem, 8vw, 7rem)', lineHeight: 0.92, letterSpacing: '-0.05em', color: 'var(--text)', marginBottom: '24px' }}
            >
              YOUR NEXT CERT<br />
              IS EITHER A <GGold c="GOLDMINE" /><br />
              OR A <GRed c="MISTAKE." />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{ fontSize: 'clamp(14px, 2.2vw, 19px)', color: 'var(--text-2)', maxWidth: '540px', margin: '0 auto 12px', lineHeight: '1.75', fontFamily: F_BODY }}
            >
              We tell you which — in under 2 seconds — before you spend ₹50K and 6 months finding out the hard way.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              style={{ fontSize: '11px', color: 'var(--text-4)', marginBottom: '36px', fontFamily: F_MONO, letterSpacing: '0.1em' }}
            >
              INDIA-SPECIFIC · AI-POWERED · FREE · NO NONSENSE
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}
            >
              <motion.button
                onClick={onEnter}
                whileHover={{ y: -5, scale: 1.04, boxShadow: '0 28px 56px rgba(81,177,231,0.45)' }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
                style={{ fontSize: 'clamp(14px,2vw,17px)', padding: 'clamp(14px,2vw,18px) clamp(24px,4vw,42px)', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '14px', fontFamily: F_HEAD, letterSpacing: '-0.02em' }}
              >
                Is My Cert Worth It? <ArrowRight size={18} />
              </motion.button>
              <motion.button
                onClick={onEnter}
                whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                className="btn-ghost"
                style={{ fontSize: 'clamp(13px,1.8vw,15px)', padding: 'clamp(14px,2vw,18px) clamp(18px,3vw,30px)', display: 'flex', alignItems: 'center', gap: '7px', borderRadius: '14px', fontFamily: F_HEAD }}
              >
                <FileText size={14} /> Find My Cert First
              </motion.button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: F_BODY }}
            >
              Free · No signup · 3 free AI analyses
            </motion.p>
          </motion.div>
        </div>

        {/* ── TICKER ──────────────────────────────────── */}
        <Ticker />

        {/* ── CERT ASSEMBLY ────────────────────────────── */}
        <CertAssembly />

        {/* ── ACTUAL NUMBERS ───────────────────────────── */}
        <div style={{ maxWidth: '860px', margin: '0 auto 100px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: 'var(--indigo-light)', letterSpacing: '0.15em', marginBottom: '16px', textTransform: 'uppercase', textAlign: 'center' }}>
              What that certificate means for you
            </div>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--text)', letterSpacing: '-0.05em', marginBottom: '18px', lineHeight: 0.95, textAlign: 'center' }}>
              NOT "CAREER ADVICE."<br /><GPurple c="ACTUAL NUMBERS." />
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: '1.75', fontFamily: F_BODY, textAlign: 'center', maxWidth: '520px', margin: '0 auto 28px' }}>
              Every analysis generates a personal ROI certificate — break-even date, 5-year gain, salary delta — anchored to real rupee amounts.
            </p>
            <div className="landing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {[
                { icon: CheckCircle, color: '#10B981', title: 'Break-even to the month', desc: 'Not "a few months." Exactly month 6. Exactly ₹23,600 extra per month from day one.' },
                { icon: CheckCircle, color: '#6366F1', title: '5-year gain in rupees',   desc: 'Not "career growth." ₹14.2L over 5 years. Honda City + 18 months Bangalore rent.' },
                { icon: CheckCircle, color: '#F59E0B', title: 'India city-specific',     desc: 'Bangalore numbers are not Hyderabad numbers. Not Pune numbers. We know the difference.' },
                { icon: CheckCircle, color: '#51B1E7', title: 'Reads YOUR resume',       desc: 'A DevOps engineer and a data analyst need completely different certs. We know that too.' },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.08 + i * 0.08 }}
                  style={{ padding: '20px', borderRadius: '14px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 1px 0 var(--card-highlight)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <item.icon size={16} color={item.color} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)', fontFamily: F_HEAD, letterSpacing: '-0.02em' }}>{item.title}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: F_BODY, lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <motion.button onClick={onEnter} whileHover={{ x: 5 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'none', border: 'none', color: 'var(--indigo-light)', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: F_HEAD, letterSpacing: '-0.02em' }}>
                Generate mine <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ── THREE TOOLS BENTO ────────────────────────── */}
        <div style={{ maxWidth: '1100px', margin: '0 auto 100px', padding: '0 24px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-20px', pointerEvents: 'none', zIndex: 0 }}>
            <GhostNumber value="35%" style={{ WebkitTextStroke: '1.5px rgba(16,185,129,0.08)' }} />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '44px', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.05em' }}>
              THREE TOOLS. <GGold c="ONE DECISION." />
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-4)', fontFamily: F_MONO, letterSpacing: '0.05em' }}>MACHINED FOR INDIAN TECH PROFESSIONALS</p>
          </motion.div>

          <div className="landing-bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto', gap: '14px', position: 'relative', zIndex: 1 }}>
            <MachinedCard glowColor="#6366F1" draggable style={{ gridColumn: '1 / 3', minHeight: '240px' }}>
              <div style={{ padding: 'clamp(20px,3vw,34px)' }}>
                <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={20} color="#6366F1" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.2rem,2.5vw,1.7rem)', letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: '3px' }}><GPurple c="ROI Calculator" /></h3>
                    <div style={{ fontFamily: F_MONO, fontSize: '9px', color: 'var(--text-4)', letterSpacing: '0.1em' }}>NOT ESTIMATES. ACTUAL RUPEES.</div>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', maxWidth: '380px', fontFamily: F_BODY, marginBottom: '18px' }}>
                  Enter your salary, cert cost, and expected hike. See break-even to the month, 5-year gain, monthly delta.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {[{ l: 'Break-even', v: '6 months', c: '#F59E0B' }, { l: '5-yr gain', v: '₹14.2L', c: '#10B981' }, { l: 'Monthly +', v: '₹23.6K', c: '#51B1E7' }].map((s, i) => (
                    <div key={i} style={{ padding: '9px 12px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                      <div style={{ fontFamily: F_MONO, fontSize: '8px', color: 'var(--text-4)', letterSpacing: '0.1em', marginBottom: '3px' }}>{s.l}</div>
                      <div style={{ fontFamily: F_MONO, fontSize: '1rem', color: s.c, fontWeight: '700', letterSpacing: '-0.02em' }}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: F_MONO, fontSize: '10px', color: 'var(--indigo-light)', letterSpacing: '0.08em', opacity: 0.55 }}>⊕ DRAG THIS CARD</div>
              </div>
            </MachinedCard>

            <MachinedCard glowColor="#10B981" draggable style={{ gridColumn: '3 / 4', gridRow: '1 / 3', minHeight: '480px' }}>
              <div style={{ padding: 'clamp(20px,2.5vw,30px)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Brain size={20} color="#10B981" />
                </div>
                <h3 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: '1.3rem', letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: '8px' }}><GGreen c="Resume AI" /></h3>
                <p style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: '1.7', fontFamily: F_BODY, marginBottom: '16px', flex: 1 }}>
                  Upload your resume. AI reads your actual background and maps it to India's 2026 job market.
                </p>
                {['Top Cert Recommendation', 'Second Best Option', 'Third Choice'].map((cert, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.1 }}
                    style={{ padding: '9px 12px', borderRadius: '9px', background: i === 0 ? 'rgba(16,185,129,0.1)' : 'var(--bg)', border: `1px solid ${i === 0 ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`, marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span style={{ fontSize: '12px', color: i === 0 ? '#10B981' : 'var(--text-3)', fontFamily: F_HEAD, fontWeight: '700' }}>{cert}</span>
                    {i === 0 && <span style={{ fontSize: '8px', padding: '2px 5px', borderRadius: '4px', background: 'rgba(16,185,129,0.2)', color: '#10B981', fontFamily: F_MONO }}>★ PRIMARY</span>}
                  </motion.div>
                ))}
                <motion.button onClick={onEnter} whileHover={{ x: 4 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#10B981', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: F_HEAD, marginTop: '14px' }}>
                  Analyse my resume <ChevronRight size={13} />
                </motion.button>
              </div>
            </MachinedCard>

            <MachinedCard glowColor="#EF4444">
              <div style={{ padding: '22px' }}><MoneyCounter /></div>
            </MachinedCard>

            <MachinedCard glowColor="#51B1E7">
              <div style={{ padding: '22px' }}>
                <div style={{ fontFamily: F_MONO, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '18px' }}>BY THE NUMBERS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[{ v: '22+', l: 'Certs', c: '#6366F1' }, { v: '8', l: 'Cities', c: '#10B981' }, { v: '₹4.8L', l: 'Avg offer', c: '#F59E0B' }, { v: '<2s', l: 'AI speed', c: '#51B1E7' }].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                      <div style={{ fontFamily: F_MONO, fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.04em', background: `linear-gradient(135deg, ${s.c}, ${s.c}77)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.v}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: F_BODY, marginTop: '2px' }}>{s.l}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </MachinedCard>
          </div>
        </div>

        {/* ── 11PM MOMENTS ─────────────────────────────── */}
        <div style={{ maxWidth: '1060px', margin: '0 auto 100px', padding: '0 24px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-60px', left: '-30px', pointerEvents: 'none', zIndex: 0 }}>
            <GhostNumber value="11PM" style={{ WebkitTextStroke: '1px rgba(245,158,11,0.07)' }} />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '44px', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.05em' }}>
              WE KNOW WHAT YOU'RE<br /><GPurple c="GOING THROUGH RIGHT NOW" />
            </h2>
          </motion.div>
          <div className="landing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', position: 'relative', zIndex: 1 }}>
            {[
              { time: '11:47 PM', name: 'Rohan, 27 · Pune',       color: '#10B981', msg: "Ex-classmate just got promoted to Senior Cloud Architect. ₹28L CTC. You're at ₹9L. Same college, same year.", thought: '"Should I do AWS? Or is it too late?"',     answer: 'AWS SAA break-even at ₹9L salary: 6 months. 5-year gain: ₹14.2L. Not too late.' },
              { time: '11:12 PM', name: 'Sneha, 31 · Bangalore',  color: '#F59E0B', msg: "Ops manager for 6 years. Every data job says '3 years experience in data science required.'", thought: '"Is the switch even possible without an MBA?"', answer: 'Google Data Analytics + 2 GitHub projects. 5 months. ₹8L → ₹12L first switch.' },
              { time: '12:03 AM', name: 'Arjun, 22 · Fresh grad', color: '#818CF8', msg: 'Opened 3 cert comparison articles. All recommend AWS. All written by Americans. All show USD.', thought: '"Which cert actually gets me placed in India?"', answer: 'Student Mode. India-specific. GCP got 47 Pune freshers placed in Q1 2026.' },
            ].map((card, i) => (
              <MachinedCard key={i} glowColor={card.color} intensity={8} onClick={onEnter}>
                <div style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '10px', fontFamily: F_MONO, color: 'var(--text-4)', background: 'var(--bg)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)' }}>{card.time}</span>
                    <span style={{ fontSize: '11px', color: card.color, fontFamily: F_MONO, fontWeight: '700' }}>{card.name}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', marginBottom: '10px', fontFamily: F_BODY }}>{card.msg}</p>
                  <div style={{ padding: '10px 12px', borderRadius: '9px', background: `${card.color}0e`, border: `1px solid ${card.color}25`, marginBottom: '10px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text)', fontWeight: '700', fontFamily: F_HEAD, fontStyle: 'italic', letterSpacing: '-0.02em', margin: 0 }}>{card.thought}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: card.color, marginTop: 5, flexShrink: 0 }} />
                    <p style={{ fontSize: '12px', color: card.color, fontWeight: '600', fontFamily: F_HEAD, margin: 0 }}>{card.answer}</p>
                  </div>
                  <motion.div whileHover={{ x: 5 }} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: card.color, fontSize: '12px', fontWeight: '700', fontFamily: F_HEAD, marginTop: '14px' }}>
                    That's me tonight <ArrowRight size={12} />
                  </motion.div>
                </div>
              </MachinedCard>
            ))}
          </div>
        </div>

        {/* ── VS OTHER SITES ────────────────────────────── */}
        <div style={{ maxWidth: '900px', margin: '0 auto 100px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.05em' }}>
              EVERY OTHER SITE IS <GRed c="LYING TO YOU" />
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-3)', maxWidth: '520px', margin: '0 auto', fontFamily: F_BODY, lineHeight: '1.7' }}>
              US salary data dressed as India data. Affiliate-commission rankings. Vague "career growth" promises.
            </p>
          </motion.div>
          <div className="landing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
            {[
              { bad: '❌ "AWS is good for cloud engineers"', good: '✅ AWS SAA at ₹9L salary: break-even 6 months, ₹14.2L gain', color: '#10B981' },
              { bad: '❌ "Upskill for career growth"',        good: '✅ ₹23,600 extra per month starting month 7',               color: '#6366F1' },
              { bad: '❌ US salary data converted to rupees', good: '✅ Naukri + AmbitionBox + LinkedIn India 2026',             color: '#F59E0B' },
              { bad: '❌ Same advice for everyone',           good: '✅ AI reads YOUR resume, YOUR city, YOUR background',       color: '#51B1E7' },
            ].map((item, i) => (
              <MachinedCard key={i} glowColor={item.color} intensity={6}>
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: F_BODY, marginBottom: '8px', textDecoration: 'line-through', opacity: 0.6 }}>{item.bad}</div>
                  <div style={{ fontSize: '13px', color: item.color, fontWeight: '700', fontFamily: F_HEAD, letterSpacing: '-0.02em', lineHeight: '1.4' }}>{item.good}</div>
                </div>
              </MachinedCard>
            ))}
          </div>
        </div>

        {/* ── THREE MODES ───────────────────────────────── */}
        <div style={{ maxWidth: '720px', margin: '0 auto 100px', padding: '0 24px' }}>
          <NeonCard color="#6366F1">
            <div style={{ padding: 'clamp(28px,5vw,44px) clamp(20px,4vw,36px)', textAlign: 'center' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.15em', marginBottom: '10px', textTransform: 'uppercase' }}>Adapts to who you are</div>
              <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.6rem,4vw,2.4rem)', color: 'var(--text)', marginBottom: '28px', letterSpacing: '-0.05em' }}>
                <GPurple c="THREE MODES." /> ONE TOOL.
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '28px' }}>
                {[
                  { icon: GraduationCap, color: '#818CF8', label: 'Student',      sub: 'No job yet',      desc: 'Path to ₹4.8L first offer' },
                  { icon: Repeat,        color: '#F59E0B', label: 'Switcher',     sub: 'Changing fields', desc: 'Bridge the skill gap' },
                  { icon: Briefcase,     color: '#10B981', label: 'Professional', sub: 'Levelling up',    desc: 'Max ROI on next cert' },
                ].map((m, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6, scale: 1.04 }}
                    style={{ padding: 'clamp(14px,2.5vw,20px) 12px', borderRadius: '14px', background: `${m.color}0e`, border: `1px solid ${m.color}28`, cursor: 'pointer' }}
                  >
                    <m.icon size={22} color={m.color} style={{ margin: '0 auto 10px', display: 'block' }} />
                    <div style={{ fontSize: 'clamp(12px,1.8vw,14px)', fontWeight: '800', color: m.color, marginBottom: '2px', fontFamily: F_HEAD, letterSpacing: '-0.03em' }}>{m.label}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-4)', marginBottom: '5px', fontFamily: F_MONO }}>{m.sub}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: F_BODY }}>{m.desc}</div>
                  </motion.div>
                ))}
              </div>
              <motion.button onClick={onEnter}
                whileHover={{ y: -5, scale: 1.03, boxShadow: '0 24px 48px rgba(81,177,231,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ fontSize: 'clamp(14px,2vw,16px)', padding: 'clamp(14px,2vw,17px) clamp(28px,4vw,40px)', display: 'inline-flex', alignItems: 'center', gap: '9px', borderRadius: '14px', fontFamily: F_HEAD, letterSpacing: '-0.02em' }}
              >
                <Zap size={16} /> Pick My Mode
              </motion.button>
            </div>
          </NeonCard>
        </div>

        {/* ── SOCIAL PROOF ──────────────────────────────── */}
        <div style={{ maxWidth: '1060px', margin: '0 auto 100px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.05em' }}>
              THEY USED THE DATA. <GGreen c="IT WORKED." />
            </h2>
          </motion.div>
          <div className="landing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { name: 'Priya S.',  role: 'Engineer → Cloud Architect', city: 'Bangalore', text: 'CertifyROI said AWS SAA break-even was 8 months. It was 7. Switched companies 7 months in. ₹6L hike.', hike: '+₹6L/yr',      color: '#10B981' },
              { name: 'Rahul M.',  role: 'Ops Manager → Data Analyst',  city: 'Hyderabad', text: 'Was about to do an MBA. Resume AI showed me Google Analytics gets me there in 5 months at 1% of the cost.', hike: 'Saved ₹12L', color: '#6366F1' },
              { name: 'Ananya K.', role: 'Fresh Graduate',               city: 'Pune',      text: 'Student Mode showed GCP had faster placement for freshers in Pune. Got ₹5.2L offer. No salary field needed.', hike: '₹5.2L offer', color: '#818CF8' },
            ].map((t, i) => (
              <MachinedCard key={i} glowColor={t.color} intensity={7}>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={13} color="#F59E0B" fill="#F59E0B" />)}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.75', marginBottom: '18px', fontStyle: 'italic', fontFamily: F_BODY }}>"{t.text}"</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text)', fontFamily: F_HEAD, letterSpacing: '-0.02em' }}>{t.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '2px', fontFamily: F_BODY }}>{t.role} · {t.city}</div>
                    </div>
                    <div style={{ fontFamily: F_MONO, fontSize: '1.2rem', fontWeight: '700', background: `linear-gradient(135deg, ${t.color}, ${t.color}77)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.03em' }}>{t.hike}</div>
                  </div>
                </div>
              </MachinedCard>
            ))}
          </div>
        </div>

        {/* ── FINAL CTA ─────────────────────────────────── */}
        <div style={{ maxWidth: '760px', margin: '0 auto 80px', padding: '0 24px' }}>
          <MachinedCard glowColor="#6366F1" intensity={4} style={{ textAlign: 'center' }}>
            <div style={{ padding: 'clamp(36px,6vw,64px) clamp(24px,5vw,48px)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
                <GhostNumber value="₹" style={{ fontSize: '220px', WebkitTextStroke: '1px rgba(99,102,241,0.06)' }} />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '2.8rem', marginBottom: '16px' }}>🎯</div>
                <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.8rem, 5vw, 3.4rem)', color: 'var(--text)', marginBottom: '14px', letterSpacing: '-0.05em', lineHeight: 0.95 }}>
                  2 MINUTES FROM NOW<br />
                  <GPurple c="YOU'LL KNOW THE ANSWER" />
                </h2>
                <p style={{ fontSize: 'clamp(14px,2vw,16px)', color: 'var(--text-3)', lineHeight: '1.8', fontFamily: F_BODY, maxWidth: '420px', margin: '0 auto 32px' }}>
                  Stop reading about certs. Stop asking Reddit. Stop letting family pressure decide.{' '}
                  <strong style={{ color: 'var(--text)', fontFamily: F_HEAD }}>Run the numbers.</strong>
                </p>
                <motion.button onClick={onEnter}
                  whileHover={{ y: -6, scale: 1.05, boxShadow: '0 32px 64px rgba(81,177,231,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                  style={{ fontSize: 'clamp(15px,2.5vw,19px)', padding: 'clamp(16px,2.5vw,22px) clamp(32px,5vw,56px)', display: 'inline-flex', alignItems: 'center', gap: '12px', borderRadius: '16px', fontFamily: F_HEAD, letterSpacing: '-0.03em' }}
                >
                  Run My Numbers <ArrowRight size={20} />
                </motion.button>
                <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '16px', fontFamily: F_MONO, letterSpacing: '0.06em' }}>
                  FREE · NO CARD · NO SIGNUP · NO PAYWALLS
                </div>
              </div>
            </div>
          </MachinedCard>
        </div>

        {/* ── FOOTER ────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #6366F1, #4338CA)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={14} color="white" />
            </div>
            <span style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: '18px', letterSpacing: '-0.04em', color: 'var(--text)' }}>
              Certify<G colors={['#6366F1','#818CF8']}>ROI</G>
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-4)', marginBottom: '5px', fontFamily: F_BODY }}>
            India's First AI-Powered Cert ROI Calculator · Powered by Groq llama-3.3-70b
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-4)', opacity: 0.4, fontFamily: F_MONO, letterSpacing: '0.05em' }}>
            DATA: LINKEDIN · NASSCOM · AMBITIONBOX · NAUKRI · WEF 2026
          </p>
        </div>

      </div>
    </div>
  )
}

export default LandingPage