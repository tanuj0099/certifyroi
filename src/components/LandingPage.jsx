import {
  motion, useAnimationFrame, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity, useMotionValueEvent,
  animate, AnimatePresence
} from 'framer-motion'
import { useRef, useState, useCallback, useEffect } from 'react'
import {
  TrendingUp, FileText, Map, Sparkles, ArrowRight,
  GraduationCap, Repeat, Briefcase, Star, Zap, Award,
  Brain, ChevronRight, CheckCircle
} from 'lucide-react'

const F_HEAD = "'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif"
const F_MONO = "'Commit Mono', 'JetBrains Mono', monospace"
const F_BODY = "'Inter', sans-serif"

const G = ({ children, colors = ['#51B1E7','#818CF8','#10B981'] }) => (
  <span style={{ background: `linear-gradient(135deg, ${colors.join(',')})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline' }}>{children}</span>
)
const GPurple = ({ c }) => <G colors={['#6366F1','#818CF8','#A78BFA']}>{c}</G>
const GGold   = ({ c }) => <G colors={['#F59E0B','#EF4444']}>{c}</G>
const GGreen  = ({ c }) => <G colors={['#10B981','#34D399','#51B1E7']}>{c}</G>
const GRed    = ({ c }) => <G colors={['#EF4444','#F59E0B']}>{c}</G>

const ScanlineOverlay = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.018) 2px, rgba(0,0,0,0.018) 4px)`, mixBlendMode: 'multiply' }} />
)

const GhostNumber = ({ value, style = {} }) => (
  <div style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(180px, 30vw, 320px)', lineHeight: 1, letterSpacing: '-0.05em', color: 'transparent', WebkitTextStroke: '1.5px rgba(99,102,241,0.12)', userSelect: 'none', pointerEvents: 'none', position: 'absolute', whiteSpace: 'nowrap', ...style }}>{value}</div>
)

// ── Theme-aware Machined Card ─────────────────────────────
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
    <motion.div ref={ref} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave}
      {...dragProps}
      style={{
        rotateX: rx, rotateY: ry, perspective: 800, transformStyle: 'preserve-3d',
        position: 'relative', borderRadius: '18px',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'inset 0 1px 0 var(--card-highlight), 0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden', willChange: 'transform',
        cursor: onClick ? 'pointer' : draggable ? 'grab' : 'default', ...style,
      }}
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
    >
      <div style={{ position: 'absolute', inset: 0, borderRadius: '18px', pointerEvents: 'none', zIndex: 0, background: `radial-gradient(circle 200px at ${glow.x}% ${glow.y}%, ${glowColor}14 0%, transparent 70%)`, opacity: glow.op, transition: 'opacity 0.3s' }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '18px', pointerEvents: 'none', zIndex: 0, background: `radial-gradient(circle 60px at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.04) 0%, transparent 55%)`, opacity: glow.op }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </motion.div>
  )
}

const NeonCard = ({ children, style = {}, color = '#6366F1', delay = 0 }) => {
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const angleRef = useRef(delay * 60)
  useAnimationFrame(t => {
    angleRef.current = (delay * 60 + t * 0.04) % 360
    const a = angleRef.current * Math.PI / 180
    setPos({ x: 50 + 55 * Math.cos(a), y: 50 + 55 * Math.sin(a) })
  })
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} whileHover={{ y: -3 }}
      style={{ position: 'relative', borderRadius: '18px', padding: '1.5px', background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${color}cc 0%, ${color}44 30%, transparent 65%)`, ...style }}>
      <div style={{ position: 'absolute', inset: '-1px', borderRadius: '19px', background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${color}22 0%, transparent 60%)`, filter: 'blur(10px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, background: 'var(--glass-bg)', borderRadius: '17px', height: '100%' }}>{children}</div>
    </motion.div>
  )
}

const Orb = ({ color, size, style, delay = 0 }) => (
  <motion.div animate={{ y: [0, -24, 0], scale: [1, 1.06, 1] }} transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, pointerEvents: 'none', ...style }} />
)

const Ticker = () => {
  const items = [
    'AWS cert holders earn ₹2.4L more/yr in Bangalore',
    '2,400+ cloud roles open on Naukri right now',
    'Average PMP break-even: 7 months',
    'Google Analytics: ₹18K cost → ₹3.2L annual gain',
    'CKA Kubernetes: highest hike in India 2026 at +40%',
    'Hyderabad cloud demand up 38% YoY',
  ]
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '11px 0', background: 'var(--surface)', marginBottom: '0' }}>
      <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '80px', whiteSpace: 'nowrap', width: 'max-content' }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: F_MONO, flexShrink: 0 }}>
            <span style={{ color: 'var(--indigo-light)', marginRight: '12px' }}>◆</span>{item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CERT ASSEMBLY — Royal Enfield sticky scroll
// ─────────────────────────────────────────────────────────
const CertAssembly = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const scrollVel = useVelocity(scrollYProgress)
  const [ca, setCa] = useState(0)

  useEffect(() => {
    const unsub = scrollVel.on('change', v => { setCa(Math.min(Math.abs(v) * 400, 9)) })
    const decay = setInterval(() => setCa(p => Math.max(0, p - 0.8)), 80)
    return () => { unsub(); clearInterval(decay) }
  }, [scrollVel])

  const l1Z  = useTransform(scrollYProgress, [0, 0.65], [-320, 0])
  const l2Z  = useTransform(scrollYProgress, [0, 0.65], [ 320, 0])
  const l3Z  = useTransform(scrollYProgress, [0, 0.65], [-160, 0])
  const l1RY = useTransform(scrollYProgress, [0, 0.65], [ 35, 0])
  const l2RY = useTransform(scrollYProgress, [0, 0.65], [-28, 0])
  const l3RY = useTransform(scrollYProgress, [0, 0.65], [ 18, 0])
  const l1RX = useTransform(scrollYProgress, [0, 0.65], [ 18, 0])
  const l2RX = useTransform(scrollYProgress, [0, 0.65], [-12, 0])
  const l3RX = useTransform(scrollYProgress, [0, 0.65], [  8, 0])
  const l1Y  = useTransform(scrollYProgress, [0, 0.65], [-90, 0])
  const l2Y  = useTransform(scrollYProgress, [0, 0.65], [ 90, 0])
  const l3Y  = useTransform(scrollYProgress, [0, 0.65], [  0, 0])
  const l1Op = useTransform(scrollYProgress, [0.02, 0.28], [0, 1])
  const l2Op = useTransform(scrollYProgress, [0.06, 0.36], [0, 1])
  const l3Op = useTransform(scrollYProgress, [0.10, 0.45], [0, 1])
  const certSc     = useTransform(scrollYProgress, [0, 0.12, 0.65, 1], [0.4, 0.75, 1, 1.04])
  const overlayOp  = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [0, 0.95, 0.95, 0])
  const gridOp     = useTransform(scrollYProgress, [0.04, 0.14], [0, 1])
  const hintOp     = useTransform(scrollYProgress, [0, 0.06, 0.14], [1, 1, 0])
  const assembledOp = useTransform(scrollYProgress, [0.64, 0.74], [0, 1])
  const assemblyVal = useTransform(scrollYProgress, [0.62, 0.70], [0, 1])

  const [flare, setFlare] = useState(false)
  const [shaking, setShaking] = useState(false)

  useMotionValueEvent(assemblyVal, 'change', v => {
    if (v > 0.97 && !shaking) {
      setShaking(true); setFlare(true)
      setTimeout(() => setFlare(false), 800)
      setTimeout(() => setShaking(false), 600)
    } else if (v < 0.3) { setShaking(false) }
  })

  const chromatic = ca > 0.8
    ? `drop-shadow(${(ca * 0.7).toFixed(1)}px 0 0 rgba(255,30,80,0.65)) drop-shadow(-${(ca * 0.7).toFixed(1)}px 0 0 rgba(0,210,255,0.65))`
    : 'none'

  return (
    <div ref={containerRef} style={{ height: '220vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Full blackout */}
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'radial-gradient(ellipse 90% 70% at 50% 50%, #04060f 0%, #000000 100%)', opacity: overlayOp }} />

        {/* Same dot-grid background as rest of site */}
        <motion.div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: gridOp,
        }} />

        {/* Crosshair */}
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: gridOp }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(99,102,241,0.1)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(99,102,241,0.1)' }} />
        </motion.div>

        {/* 3D Scene */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', perspective: '1400px', perspectiveOrigin: '50% 50%' }}>

          <motion.div animate={shaking ? { x: [0, -5, 5, -4, 4, -2, 2, 0] } : { x: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
            <motion.div style={{ position: 'relative', width: 'min(480px, 86vw)', aspectRatio: '1.41 / 1', transformStyle: 'preserve-3d', scale: certSc }}>

              {/* Lens flare */}
              <AnimatePresence>
                {flare && (
                  <motion.div initial={{ x: '-120%', opacity: 1 }} animate={{ x: '220%', opacity: 0 }} exit={{}} transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', borderRadius: '14px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 25%, rgba(180,160,255,0.3) 50%, rgba(255,255,255,0.08) 75%, transparent 100%)' }} />
                )}
              </AnimatePresence>

              {/* LAYER 1 — Border */}
              <motion.div style={{ position: 'absolute', inset: 0, z: l1Z, y: l1Y, rotateY: l1RY, rotateX: l1RX, opacity: l1Op, filter: chromatic, transformStyle: 'preserve-3d' }}>
                <svg viewBox="0 0 480 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                  <defs>
                    <linearGradient id="bgrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"   stopColor="#6366F1" />
                      <stop offset="30%"  stopColor="#818CF8" />
                      <stop offset="65%"  stopColor="#10B981" />
                      <stop offset="100%" stopColor="#51B1E7" />
                    </linearGradient>
                    <filter id="bglow"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  </defs>
                  <rect x="2" y="2" width="476" height="336" rx="14" fill="#04060f" />
                  <rect x="2" y="2" width="476" height="336" rx="14" fill="none" stroke="url(#bgrad)" strokeWidth="2.5" filter="url(#bglow)" />
                  <rect x="10" y="10" width="460" height="320" rx="10" fill="none" stroke="rgba(99,102,241,0.18)" strokeWidth="0.5" />
                  {[[22,22],[458,22],[22,318],[458,318]].map(([cx,cy],i) => (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r="5" fill="none" stroke="#6366F1" strokeWidth="1.5" />
                      <circle cx={cx} cy={cy} r="9" fill="none" stroke="rgba(99,102,241,0.25)" strokeWidth="0.5" />
                      <line x1={cx-12} y1={cy} x2={cx+12} y2={cy} stroke="rgba(99,102,241,0.4)" strokeWidth="0.6" />
                      <line x1={cx} y1={cy-12} x2={cx} y2={cy+12} stroke="rgba(99,102,241,0.4)" strokeWidth="0.6" />
                    </g>
                  ))}
                  <line x1="44"  y1="2.5"   x2="90"  y2="2.5"   stroke="#818CF8" strokeWidth="2.5" />
                  <line x1="390" y1="2.5"   x2="436" y2="2.5"   stroke="#10B981" strokeWidth="2.5" />
                  <line x1="44"  y1="337.5" x2="90"  y2="337.5" stroke="#10B981" strokeWidth="2.5" />
                  <line x1="390" y1="337.5" x2="436" y2="337.5" stroke="#818CF8" strokeWidth="2.5" />
                </svg>
              </motion.div>

              {/* LAYER 2 — Content */}
              <motion.div style={{ position: 'absolute', inset: 0, z: l2Z, y: l2Y, rotateY: l2RY, rotateX: l2RX, opacity: l2Op, filter: chromatic, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(20px,4vw,36px)' }}>
                <div style={{ fontFamily: F_MONO, fontSize: '9px', color: 'rgba(99,102,241,0.65)', letterSpacing: '0.24em', marginBottom: '10px', textTransform: 'uppercase' }}>CERTIFYROI · INDIA 2026</div>
                <div style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1rem,3.2vw,1.6rem)', letterSpacing: '-0.04em', color: '#F8FAFC', marginBottom: '5px', textAlign: 'center', lineHeight: 1.1 }}>Your Certification</div>
                <div style={{ fontFamily: F_BODY, fontSize: '11px', color: 'rgba(255,255,255,0.38)', marginBottom: '22px', textAlign: 'center' }}>Personalised ROI Analysis · Your City</div>
                <div style={{ display: 'flex', gap: 'clamp(16px,4vw,32px)', marginBottom: '18px' }}>
                  {[{ label: 'BREAK-EVEN', value: '6 mo', color: '#F59E0B' }, { label: '5-YR GAIN', value: '₹14.2L', color: '#10B981' }, { label: 'HIKE', value: '+35%', color: '#818CF8' }].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: F_MONO, fontSize: '7px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', marginBottom: '4px' }}>{s.label}</div>
                      <div style={{ fontFamily: F_MONO, fontSize: 'clamp(0.9rem,2.5vw,1.4rem)', color: s.color, fontWeight: '700', letterSpacing: '-0.03em' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ width: '75%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.45), transparent)', marginBottom: '12px' }} />
                <div style={{ fontFamily: F_MONO, fontSize: '7px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.16em', textAlign: 'center' }}>VERIFIED BY AI · DATA: NAUKRI MARCH 2026</div>
              </motion.div>

              {/* LAYER 3 — Hologram seal */}
              <motion.div style={{ position: 'absolute', right: '6%', bottom: '8%', z: l3Z, y: l3Y, rotateY: l3RY, rotateX: l3RX, opacity: l3Op }}>
                <svg viewBox="0 0 72 72" width="clamp(48px,10vw,72px)" height="clamp(48px,10vw,72px)">
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"   stopColor="#6366F1" stopOpacity="0.9" />
                      <stop offset="50%"  stopColor="#10B981" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  <polygon points="36,4 43,22 62,22 48,35 54,54 36,43 18,54 24,35 10,22 29,22" fill="none" stroke="url(#sg)" strokeWidth="1.5" />
                  <circle cx="36" cy="36" r="10" fill="none" stroke="rgba(99,102,241,0.45)" strokeWidth="1" />
                  <circle cx="36" cy="36" r="4.5" fill="rgba(99,102,241,0.18)" />
                  <text x="36" y="40" textAnchor="middle" fontSize="7" fill="#818CF8" fontFamily={F_MONO} fontWeight="700">AI</text>
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div style={{ opacity: hintOp, marginTop: '36px', textAlign: 'center', pointerEvents: 'none' }}>
            <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '11px', color: 'rgba(99,102,241,0.55)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>↓  scroll to assemble  ↓</div>
            </motion.div>
          </motion.div>

          {/* Assembled label */}
          <motion.div style={{ opacity: assembledOp, position: 'absolute', bottom: '9%', textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: F_MONO, fontSize: '11px', color: 'rgba(16,185,129,0.85)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>✓  YOUR ROI CERTIFICATE · ASSEMBLED</div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const MoneyCounter = () => {
  const [r, setR] = useState(0)
  useEffect(() => {
    const rate = 320000 / (365 * 24 * 3600 * 10)
    const t = setInterval(() => setR(v => v + rate), 100)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ padding: '22px', borderRadius: '14px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
      <div style={{ fontSize: '10px', color: '#EF4444', fontFamily: F_MONO, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>₹ SLIPPING AWAY WHILE YOU READ THIS</div>
      <div style={{ fontFamily: F_MONO, fontSize: '2.4rem', color: '#EF4444', fontWeight: '700', letterSpacing: '-0.03em' }}>₹{r.toFixed(2)}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '7px', fontFamily: F_BODY, lineHeight: '1.5' }}>avg ₹3.2L/yr salary gap for uncertified professionals</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────
const LandingPage = ({ onEnter }) => {
  const heroRef = useRef(null)
  const { scrollYProgress: heroSP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY  = useTransform(heroSP, [0, 1], [0, 100])
  const heroOp = useTransform(heroSP, [0, 0.55], [1, 0])
  const heroSc = useTransform(heroSP, [0, 0.55], [1, 0.93])
  const ghostY = useTransform(heroSP, [0, 1], [0, 180])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>
      <ScanlineOverlay />

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <Orb color="rgba(99,102,241,0.09)"  size={700} style={{ top: '-20%', left: '5%' }}   delay={0} />
        <Orb color="rgba(16,185,129,0.05)"  size={500} style={{ bottom: '5%', right: '0%' }} delay={2} />
        <Orb color="rgba(81,177,231,0.05)"  size={350} style={{ top: '45%', right: '15%' }}  delay={4} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <div ref={heroRef} style={{ maxWidth: '960px', margin: '0 auto', padding: '124px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <motion.div style={{ y: ghostY, position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 0, pointerEvents: 'none' }}>
            <GhostNumber value="ROI" />
          </motion.div>
          <motion.div style={{ y: heroY, opacity: heroOp, scale: heroSc, position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '20px', background: 'var(--indigo-dim)', border: '1px solid var(--border-accent)', fontSize: '11px', color: 'var(--indigo-light)', marginBottom: '32px', letterSpacing: '0.08em', fontFamily: F_MONO }}>
              <Award size={12} /> INDIA'S FIRST AI-POWERED CERT ROI CALCULATOR
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(3rem, 9vw, 7rem)', lineHeight: 0.9, letterSpacing: '-0.05em', color: 'var(--text)', marginBottom: '28px' }}>
              YOUR NEXT CERT<br />
              IS EITHER A <GGold c="GOLDMINE" /><br />
              OR A <GRed c="MISTAKE." />
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
              style={{ fontSize: 'clamp(15px, 2.5vw, 19px)', color: 'var(--text-2)', maxWidth: '560px', margin: '0 auto 14px', lineHeight: '1.75', fontFamily: F_BODY }}>
              We tell you which — in under 2 seconds — before you spend ₹50K and 6 months finding out the hard way.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              style={{ fontSize: '12px', color: 'var(--text-4)', marginBottom: '44px', fontFamily: F_MONO, letterSpacing: '0.1em' }}>
              INDIA-SPECIFIC · AI-POWERED · FREE · NO NONSENSE
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
              <motion.button onClick={onEnter} whileHover={{ y: -5, scale: 1.04, boxShadow: '0 28px 56px rgba(81,177,231,0.45)' }} whileTap={{ scale: 0.95 }}
                className="btn-primary" style={{ fontSize: '17px', padding: '18px 42px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '14px', fontFamily: F_HEAD, letterSpacing: '-0.02em' }}>
                Is My Cert Worth It? <ArrowRight size={18} />
              </motion.button>
              <motion.button onClick={onEnter} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                className="btn-ghost" style={{ fontSize: '15px', padding: '18px 30px', display: 'flex', alignItems: 'center', gap: '7px', borderRadius: '14px', fontFamily: F_HEAD }}>
                <FileText size={15} /> Find My Cert First
              </motion.button>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: F_BODY }}>
              Free · No signup · 3 free AI analyses
            </motion.p>
          </motion.div>
        </div>

        {/* ── TICKER ───────────────────────────────────────── */}
        <Ticker />

        {/* ── CERT ASSEMBLY ────────────────────────────────── */}
        <CertAssembly />

        {/* ── WHAT WE GIVE YOU ─────────────────────────────── */}
        <div style={{ maxWidth: '860px', margin: '0 auto 120px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: 'var(--indigo-light)', letterSpacing: '0.15em', marginBottom: '16px', textTransform: 'uppercase', textAlign: 'center' }}>What that certificate means for you</div>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)', letterSpacing: '-0.05em', marginBottom: '20px', lineHeight: 0.95, textAlign: 'center' }}>
              NOT "CAREER ADVICE."<br /><GPurple c="ACTUAL NUMBERS." />
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: '1.75', fontFamily: F_BODY, marginBottom: '32px', textAlign: 'center', maxWidth: '540px', margin: '0 auto 32px' }}>
              Every analysis generates a personal ROI certificate — break-even date, 5-year gain, salary delta — anchored to real rupee amounts.
            </p>
            {/* 2x2 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {[
                { icon: CheckCircle, color: '#10B981', title: 'Break-even to the month', desc: 'Not "a few months." Exactly month 6. Exactly ₹23,600 extra per month.' },
                { icon: CheckCircle, color: '#6366F1', title: '5-year gain in rupees', desc: 'Not "career growth." ₹14.2L over 5 years = Honda City + 18 months rent.' },
                { icon: CheckCircle, color: '#F59E0B', title: 'India city-specific data', desc: 'Bangalore numbers are not Hyderabad numbers. We know the difference.' },
                { icon: CheckCircle, color: '#51B1E7', title: 'Personalised to your resume', desc: 'A DevOps engineer and a data analyst need completely different certs.' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 + i * 0.08 }}
                  style={{ padding: '20px 22px', borderRadius: '14px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 1px 0 var(--card-highlight)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <item.icon size={16} color={item.color} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', fontFamily: F_HEAD, letterSpacing: '-0.02em' }}>{item.title}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: F_BODY, lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '28px' }}>
              <motion.button onClick={onEnter} whileHover={{ x: 5 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'none', border: 'none', color: 'var(--indigo-light)', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: F_HEAD, letterSpacing: '-0.02em' }}>
                Generate mine <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ── THREE TOOLS BENTO ────────────────────────────── */}
        <div style={{ maxWidth: '1100px', margin: '0 auto 120px', padding: '0 24px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-20px', pointerEvents: 'none', zIndex: 0 }}>
            <GhostNumber value="35%" style={{ WebkitTextStroke: '1.5px rgba(16,185,129,0.1)' }} />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '52px', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.05em' }}>
              THREE TOOLS. <GGold c="ONE DECISION." />
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-4)', fontFamily: F_MONO, letterSpacing: '0.05em' }}>MACHINED FOR INDIAN TECH PROFESSIONALS</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto', gap: '14px', position: 'relative', zIndex: 1 }}>

            {/* ROI big card */}
            <MachinedCard glowColor="#6366F1" draggable style={{ gridColumn: '1 / 3', minHeight: '260px' }}>
              <div style={{ padding: '34px' }}>
                <div style={{ display: 'flex', gap: '14px', marginBottom: '18px', alignItems: 'flex-start' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={22} color="#6366F1" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: '1.7rem', letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: '3px' }}><GPurple c="ROI Calculator" /></h3>
                    <div style={{ fontFamily: F_MONO, fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.1em' }}>NOT ESTIMATES. ACTUAL RUPEES.</div>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: '1.7', maxWidth: '400px', fontFamily: F_BODY, marginBottom: '22px' }}>
                  Enter your salary, cert cost, and expected hike. See break-even to the month, 5-year gain, monthly delta.
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {[{ l: 'Break-even', v: '6 months', c: '#F59E0B' }, { l: '5-yr gain', v: '₹14.2L', c: '#10B981' }, { l: 'Monthly +', v: '₹23.6K', c: '#51B1E7' }].map((s, i) => (
                    <div key={i} style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                      <div style={{ fontFamily: F_MONO, fontSize: '8px', color: 'var(--text-4)', letterSpacing: '0.1em', marginBottom: '3px' }}>{s.l}</div>
                      <div style={{ fontFamily: F_MONO, fontSize: '1.1rem', color: s.c, fontWeight: '700', letterSpacing: '-0.02em' }}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: F_MONO, fontSize: '10px', color: 'var(--indigo-light)', letterSpacing: '0.08em', opacity: 0.6 }}>⊕ DRAG THIS CARD</div>
              </div>
            </MachinedCard>

            {/* Resume AI tall card */}
            <MachinedCard glowColor="#10B981" draggable style={{ gridColumn: '3 / 4', gridRow: '1 / 3', minHeight: '540px' }}>
              <div style={{ padding: '30px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Brain size={20} color="#10B981" />
                </div>
                <h3 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: '1.4rem', letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: '8px' }}><GGreen c="Resume AI" /></h3>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', fontFamily: F_BODY, marginBottom: '20px', flex: 1 }}>
                  Upload your resume. AI reads your actual background and maps it to India's 2026 job market.
                </p>
                {['Top Cert Recommendation', 'Second Best Option', 'Third Choice'].map((cert, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.1 }}
                    style={{ padding: '10px 14px', borderRadius: '9px', background: i === 0 ? 'rgba(16,185,129,0.1)' : 'var(--bg)', border: `1px solid ${i === 0 ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`, marginBottom: '7px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: i === 0 ? '#10B981' : 'var(--text-3)', fontFamily: F_HEAD, fontWeight: '700' }}>{cert}</span>
                    {i === 0 && <span style={{ fontSize: '8px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16,185,129,0.2)', color: '#10B981', fontFamily: F_MONO }}>★ PRIMARY</span>}
                  </motion.div>
                ))}
                <motion.button onClick={onEnter} whileHover={{ x: 4 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#10B981', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: F_HEAD, marginTop: '16px' }}>
                  Analyse my resume <ChevronRight size={13} />
                </motion.button>
              </div>
            </MachinedCard>

            {/* Money counter */}
            <MachinedCard glowColor="#EF4444">
              <div style={{ padding: '26px' }}><MoneyCounter /></div>
            </MachinedCard>

            {/* Stats */}
            <MachinedCard glowColor="#51B1E7">
              <div style={{ padding: '26px' }}>
                <div style={{ fontFamily: F_MONO, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '20px' }}>BY THE NUMBERS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {[{ v: '22+', l: 'Certs', c: '#6366F1' }, { v: '8', l: 'Cities', c: '#10B981' }, { v: '₹4.8L', l: 'Avg offer', c: '#F59E0B' }, { v: '<2s', l: 'AI speed', c: '#51B1E7' }].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                      <div style={{ fontFamily: F_MONO, fontSize: '1.6rem', fontWeight: '700', letterSpacing: '-0.04em', background: `linear-gradient(135deg, ${s.c}, ${s.c}77)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.v}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: F_BODY, marginTop: '2px' }}>{s.l}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </MachinedCard>

          </div>
        </div>

        {/* ── 11PM MOMENTS ─────────────────────────────────── */}
        <div style={{ maxWidth: '1060px', margin: '0 auto 120px', padding: '0 24px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-60px', left: '-30px', pointerEvents: 'none', zIndex: 0 }}>
            <GhostNumber value="11PM" style={{ WebkitTextStroke: '1px rgba(245,158,11,0.08)' }} />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '52px', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.05em' }}>
              WE KNOW WHAT YOU'RE<br /><GPurple c="GOING THROUGH RIGHT NOW" />
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', position: 'relative', zIndex: 1 }}>
            {[
              { time: '11:47 PM', name: 'Rohan, 27 · Pune',       color: '#10B981', msg: "Ex-classmate just got promoted to Senior Cloud Architect. ₹28L CTC. You're at ₹9L. Same college, same year.", thought: '"Should I do AWS? Or is it too late?"', answer: 'AWS SAA break-even at ₹9L salary: 6 months. 5-year gain: ₹14.2L. Not too late.' },
              { time: '11:12 PM', name: 'Sneha, 31 · Bangalore',  color: '#F59E0B', msg: "Ops manager for 6 years. Every data job says '3 years experience in data science required.'", thought: '"Is the switch even possible without an MBA?"', answer: 'Google Data Analytics + 2 GitHub projects. 5 months. ₹8L → ₹12L first switch.' },
              { time: '12:03 AM', name: 'Arjun, 22 · Fresh grad', color: '#818CF8', msg: 'Opened 3 cert comparison articles. All recommend AWS. All written by Americans. All show USD.', thought: '"Which cert actually gets me placed in India?"', answer: 'Student Mode. India-specific. GCP got 47 Pune freshers placed in Q1 2026.' },
            ].map((card, i) => (
              <MachinedCard key={i} glowColor={card.color} intensity={8} onClick={onEnter}>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '10px', fontFamily: F_MONO, color: 'var(--text-4)', background: 'var(--bg)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)' }}>{card.time}</span>
                    <span style={{ fontSize: '11px', color: card.color, fontFamily: F_MONO, fontWeight: '700' }}>{card.name}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', marginBottom: '12px', fontFamily: F_BODY }}>{card.msg}</p>
                  <div style={{ padding: '10px 14px', borderRadius: '9px', background: `${card.color}0e`, border: `1px solid ${card.color}25`, marginBottom: '12px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '700', fontFamily: F_HEAD, fontStyle: 'italic', letterSpacing: '-0.02em', margin: 0 }}>{card.thought}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: card.color, marginTop: 6, flexShrink: 0 }} />
                    <p style={{ fontSize: '13px', color: card.color, fontWeight: '600', fontFamily: F_HEAD, margin: 0 }}>{card.answer}</p>
                  </div>
                  <motion.div whileHover={{ x: 5 }} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: card.color, fontSize: '12px', fontWeight: '700', fontFamily: F_HEAD, marginTop: '16px' }}>
                    That's me tonight <ArrowRight size={12} />
                  </motion.div>
                </div>
              </MachinedCard>
            ))}
          </div>
        </div>

        {/* ── VS OTHER SITES ────────────────────────────────── */}
        <div style={{ maxWidth: '900px', margin: '0 auto 120px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.05em' }}>
              EVERY OTHER SITE IS <GRed c="LYING TO YOU" />
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-3)', maxWidth: '540px', margin: '0 auto', fontFamily: F_BODY, lineHeight: '1.7' }}>
              US salary data dressed as India data. Affiliate-commission rankings. Vague "career growth" promises.
            </p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '14px' }}>
            {[
              { bad: '❌ "AWS is good for cloud engineers"', good: '✅ AWS SAA at ₹9L salary: break-even 6 months, ₹14.2L gain', color: '#10B981' },
              { bad: '❌ "Upskill for career growth"', good: '✅ ₹23,600 extra per month starting month 7', color: '#6366F1' },
              { bad: '❌ US salary data converted to rupees', good: '✅ Naukri + AmbitionBox + LinkedIn India 2026', color: '#F59E0B' },
              { bad: '❌ Same advice for everyone', good: '✅ AI reads YOUR resume, YOUR city, YOUR background', color: '#51B1E7' },
            ].map((item, i) => (
              <MachinedCard key={i} glowColor={item.color} intensity={6}>
                <div style={{ padding: '22px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-4)', fontFamily: F_BODY, marginBottom: '8px', textDecoration: 'line-through', opacity: 0.6 }}>{item.bad}</div>
                  <div style={{ fontSize: '14px', color: item.color, fontWeight: '700', fontFamily: F_HEAD, letterSpacing: '-0.02em', lineHeight: '1.4' }}>{item.good}</div>
                </div>
              </MachinedCard>
            ))}
          </div>
        </div>

        {/* ── MODES ────────────────────────────────────────── */}
        <div style={{ maxWidth: '720px', margin: '0 auto 120px', padding: '0 24px' }}>
          <NeonCard color="#6366F1">
            <div style={{ padding: '44px 36px', textAlign: 'center' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.15em', marginBottom: '10px', textTransform: 'uppercase' }}>Adapts to who you are</div>
              <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: '2.4rem', color: 'var(--text)', marginBottom: '30px', letterSpacing: '-0.05em' }}>
                <GPurple c="THREE MODES." /> ONE TOOL.
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
                {[
                  { icon: GraduationCap, color: '#818CF8', label: 'Student',      sub: 'No job yet',      desc: 'Path to ₹4.8L first offer' },
                  { icon: Repeat,        color: '#F59E0B', label: 'Switcher',     sub: 'Changing fields', desc: 'Bridge the skill gap' },
                  { icon: Briefcase,     color: '#10B981', label: 'Professional', sub: 'Levelling up',    desc: 'Max ROI on next cert' },
                ].map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6, scale: 1.04 }}
                    style={{ padding: '20px 14px', borderRadius: '14px', background: `${m.color}0e`, border: `1px solid ${m.color}28`, cursor: 'pointer' }}>
                    <m.icon size={24} color={m.color} style={{ margin: '0 auto 10px', display: 'block' }} />
                    <div style={{ fontSize: '14px', fontWeight: '800', color: m.color, marginBottom: '2px', fontFamily: F_HEAD, letterSpacing: '-0.03em' }}>{m.label}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-4)', marginBottom: '5px', fontFamily: F_MONO }}>{m.sub}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: F_BODY }}>{m.desc}</div>
                  </motion.div>
                ))}
              </div>
              <motion.button onClick={onEnter} whileHover={{ y: -5, scale: 1.03, boxShadow: '0 24px 48px rgba(81,177,231,0.4)' }} whileTap={{ scale: 0.97 }}
                className="btn-primary" style={{ fontSize: '16px', padding: '17px 40px', display: 'inline-flex', alignItems: 'center', gap: '9px', borderRadius: '14px', fontFamily: F_HEAD, letterSpacing: '-0.02em' }}>
                <Zap size={16} /> Pick My Mode
              </motion.button>
            </div>
          </NeonCard>
        </div>

        {/* ── SOCIAL PROOF ─────────────────────────────────── */}
        <div style={{ maxWidth: '1060px', margin: '0 auto 120px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.05em' }}>
              THEY USED THE DATA. <GGreen c="IT WORKED." />
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
            {[
              { name: 'Priya S.',  role: 'Engineer → Cloud Architect', city: 'Bangalore', text: 'CertifyROI said AWS SAA break-even was 8 months. It was 7. Switched companies 7 months in. ₹6L hike.', hike: '+₹6L/yr',      color: '#10B981' },
              { name: 'Rahul M.',  role: 'Ops Manager → Data Analyst',  city: 'Hyderabad', text: 'Was about to do an MBA. Resume AI showed me Google Analytics gets me there in 5 months at 1% of the cost.', hike: 'Saved ₹12L', color: '#6366F1' },
              { name: 'Ananya K.', role: 'Fresh Graduate',               city: 'Pune',      text: 'Student Mode showed GCP had faster placement for freshers in Pune. Got ₹5.2L offer. No salary field needed.', hike: '₹5.2L offer', color: '#818CF8' },
            ].map((t, i) => (
              <MachinedCard key={i} glowColor={t.color} intensity={7}>
                <div style={{ padding: '26px' }}>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={13} color="#F59E0B" fill="#F59E0B" />)}
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.75', marginBottom: '20px', fontStyle: 'italic', fontFamily: F_BODY }}>"{t.text}"</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text)', fontFamily: F_HEAD, letterSpacing: '-0.02em' }}>{t.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '2px', fontFamily: F_BODY }}>{t.role} · {t.city}</div>
                    </div>
                    <div style={{ fontFamily: F_MONO, fontSize: '1.3rem', fontWeight: '700', background: `linear-gradient(135deg, ${t.color}, ${t.color}77)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.03em' }}>{t.hike}</div>
                  </div>
                </div>
              </MachinedCard>
            ))}
          </div>
        </div>

        {/* ── FINAL CTA ─────────────────────────────────────── */}
        <div style={{ maxWidth: '760px', margin: '0 auto 80px', padding: '0 24px' }}>
          <MachinedCard glowColor="#6366F1" intensity={4} style={{ textAlign: 'center' }}>
            <div style={{ padding: '64px 48px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
                <GhostNumber value="₹" style={{ fontSize: '260px', WebkitTextStroke: '1px rgba(99,102,241,0.07)' }} />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '3rem', marginBottom: '18px' }}>🎯</div>
                <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: 'var(--text)', marginBottom: '16px', letterSpacing: '-0.05em', lineHeight: 0.95 }}>
                  2 MINUTES FROM NOW<br />
                  <GPurple c="YOU'LL KNOW THE ANSWER" />
                </h2>
                <p style={{ fontSize: '16px', color: 'var(--text-3)', marginBottom: '38px', lineHeight: '1.8', fontFamily: F_BODY, maxWidth: '440px', margin: '0 auto 38px' }}>
                  Stop reading about certs. Stop asking Reddit. Stop letting family pressure decide.{' '}
                  <strong style={{ color: 'var(--text)', fontFamily: F_HEAD }}>Run the numbers.</strong>
                </p>
                <motion.button onClick={onEnter} whileHover={{ y: -6, scale: 1.05, boxShadow: '0 32px 64px rgba(81,177,231,0.5)' }} whileTap={{ scale: 0.95 }}
                  className="btn-primary" style={{ fontSize: '19px', padding: '22px 56px', display: 'inline-flex', alignItems: 'center', gap: '12px', borderRadius: '16px', fontFamily: F_HEAD, letterSpacing: '-0.03em' }}>
                  Run My Numbers <ArrowRight size={20} />
                </motion.button>
                <div style={{ fontSize: '12px', color: 'var(--text-4)', marginTop: '18px', fontFamily: F_MONO, letterSpacing: '0.06em' }}>
                  FREE · NO CARD · NO SIGNUP · NO PAYWALLS
                </div>
              </div>
            </div>
          </MachinedCard>
        </div>

        {/* ── FOOTER ───────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366F1, #4338CA)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} color="white" />
            </div>
            <span style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: '20px', letterSpacing: '-0.04em', color: 'var(--text)' }}>
              Certify<G colors={['#6366F1','#818CF8']}>ROI</G>
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-4)', marginBottom: '6px', fontFamily: F_BODY }}>India's First AI-Powered Cert ROI Calculator · Powered by Groq llama-3.3-70b</p>
          <p style={{ fontSize: '11px', color: 'var(--text-4)', opacity: 0.4, fontFamily: F_MONO, letterSpacing: '0.05em' }}>DATA: LINKEDIN · NASSCOM · AMBITIONBOX · NAUKRI · WEF 2026</p>
        </div>

      </div>
    </div>
  )
}

export default LandingPage