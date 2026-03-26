import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useTransform, animate
} from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import {
  Sparkles, TrendingUp, Clock, DollarSign, AlertTriangle,
  GraduationCap, ExternalLink, Lock, Zap, Target, Star,
  X, Mail, Flame, CheckCircle
} from 'lucide-react'
import { useROICalc, useGuestCounter, useLocalStorage, useWindowWidth } from '../hooks/hooks.jsx'
import { analyzeROI, getMockResponse } from '../services/aiService.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { CERTIFICATIONS, GUEST_FREE_LIMIT } from '../tokens.js'
import PitchGenerator from './PitchGenerator.jsx'
import BurnRate from './BurnRate.jsx'
import HikeVerifier from './HikeVerifier.jsx'

const SPRING     = { type: 'spring', stiffness: 400, damping: 30 }
const SPRING_NUM = { stiffness: 160, damping: 22 }
const PICTON     = '#51B1E7'
const EMERALD    = '#10B981'
const AMBER      = '#F59E0B'

// ── Animated number ───────────────────────────────────────
const AnimatedNumber = ({ value, prefix = '', suffix = '', decimals = 0, color }) => {
  const num    = Number(String(value).replace(/[^\d.-]/g, '')) || 0
  const spring = useSpring(num, SPRING_NUM)
  const [disp, setDisp] = useState(num)
  useEffect(() => { spring.set(num) }, [num, spring])
  useEffect(() => spring.on('change', v => setDisp(v)), [spring])
  const fmt = decimals > 0 ? disp.toFixed(decimals) : Math.round(disp).toLocaleString('en-IN')
  return (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: color || 'var(--number-color)', fontFeatureSettings: '"tnum"', letterSpacing: '-0.03em' }}>
      {prefix}{fmt}{suffix}
    </span>
  )
}

// ── Spotlight card ────────────────────────────────────────
const SpotlightCard = ({ children, style = {}, accent = PICTON, onClick, padding = '20px' }) => {
  const ref   = useRef(null)
  const mxRaw = useMotionValue(0)
  const myRaw = useMotionValue(0)
  const rotX  = useSpring(useTransform(myRaw, [-0.5, 0.5], [5, -5]),  { stiffness: 300, damping: 30 })
  const rotY  = useSpring(useTransform(mxRaw, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 })
  const [spot, setSpot] = useState({ x: 50, y: 50, vis: 0 })

  const onMove = useCallback(e => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width  - 0.5
    const ny = (e.clientY - r.top)  / r.height - 0.5
    mxRaw.set(nx); myRaw.set(ny)
    setSpot({ x: (nx + 0.5) * 100, y: (ny + 0.5) * 100, vis: 1 })
  }, [mxRaw, myRaw])

  const onLeave = useCallback(() => {
    mxRaw.set(0); myRaw.set(0)
    setSpot(s => ({ ...s, vis: 0 }))
  }, [mxRaw, myRaw])

  return (
    <motion.div
      ref={ref} onClick={onClick}
      onMouseMove={onMove} onMouseLeave={onLeave}
      style={{
        rotateX: rotX, rotateY: rotY,
        perspective: 900, transformStyle: 'preserve-3d',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        boxShadow: 'inset 0 1px 0 var(--card-highlight), 0 2px 8px rgba(0,0,0,0.08)',
        position: 'relative', overflow: 'hidden',
        willChange: 'transform',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ...style,
      }}
      whileHover={{ scale: 1.005, transition: SPRING }}
    >
      <div style={{ position: 'absolute', inset: 0, borderRadius: '14px', background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, ${accent}12 0%, transparent 55%)`, opacity: spot.vis, transition: 'opacity 0.3s', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1, padding }}>{children}</div>
    </motion.div>
  )
}

// ── Scanning beam ─────────────────────────────────────────
const ScanningBeam = ({ certName }) => {
  const beamY = useMotionValue('0%')
  const [chars, setChars] = useState([])
  const [step,  setStep]  = useState(0)

  const steps = useMemo(() => [
    'Scanning India job market...',
    'Pulling Naukri salary data...',
    `Analysing ${certName || 'cert'} ROI...`,
    'Calculating 5-year trajectory...',
    'Writing personalised verdict...',
  ], [certName])

  useEffect(() => {
    const ctrl = animate(beamY, ['0%', '94%', '0%'], { duration: 2.2, repeat: Infinity, ease: 'linear' })
    const charTimer = setInterval(() => { setChars(Array.from({ length: 14 }, () => String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)))) }, 80)
    const stepTimers = steps.map((_, i) => setTimeout(() => setStep(i), i * 850))
    return () => { ctrl.stop(); clearInterval(charTimer); stepTimers.forEach(clearTimeout) }
  }, [beamY, steps])

  const pct = Math.round(((step + 1) / steps.length) * 100)

  return (
    <div style={{ background: 'var(--surface)', border: `1px solid ${PICTON}28`, borderRadius: '14px', padding: '22px', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 1px 0 var(--card-highlight)' }}>
      {[
        { top: 8, left: 8,   borderTop: `2px solid ${PICTON}`, borderLeft:   `2px solid ${PICTON}` },
        { top: 8, right: 8,  borderTop: `2px solid ${PICTON}`, borderRight:  `2px solid ${PICTON}` },
        { bottom: 8, left: 8,  borderBottom: `2px solid ${PICTON}`, borderLeft:  `2px solid ${PICTON}` },
        { bottom: 8, right: 8, borderBottom: `2px solid ${PICTON}`, borderRight: `2px solid ${PICTON}` },
      ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 14, height: 14, ...s }} />)}

      <motion.div style={{ position: 'absolute', left: 0, right: 0, height: '1.5px', background: `linear-gradient(90deg, transparent, ${PICTON}, transparent)`, boxShadow: `0 0 8px ${PICTON}`, top: beamY, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${PICTON}`, borderTopColor: 'transparent', flexShrink: 0 }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: PICTON, letterSpacing: '0.08em' }}>DECISION ENGINE / PROCESSING</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--text-4)' }}>{pct}%</span>
      </div>

      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: `${PICTON}44`, letterSpacing: '0.2em', marginBottom: '14px', height: '16px', overflow: 'hidden' }}>{chars.join(' ')}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '16px' }}>
        {steps.map((s, i) => {
          if (i > step) return null
          const done = i < step; const active = i === step
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 26, height: 26, borderRadius: '7px', flexShrink: 0, background: done ? 'rgba(16,185,129,0.1)' : active ? `${PICTON}14` : 'var(--bg)', border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : active ? PICTON + '44' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: done ? EMERALD : active ? PICTON : 'var(--text-4)' }}>
                {done ? '✓' : '›'}
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: done ? 'var(--text-4)' : active ? 'var(--text)' : 'var(--text-4)', textDecoration: done ? 'line-through' : 'none' }}>{s}</span>
              {active && <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ width: 5, height: 5, borderRadius: '50%', background: PICTON, marginLeft: 'auto', flexShrink: 0 }} />}
            </motion.div>
          )
        })}
      </div>

      <div style={{ height: '3px', borderRadius: '2px', background: 'var(--border)', overflow: 'hidden' }}>
        <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} style={{ height: '100%', borderRadius: '2px', background: `linear-gradient(90deg, ${PICTON}, #818CF8)` }} />
      </div>
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {[75, 60, 70, 50].map((w, i) => <div key={i} className="shimmer" style={{ height: '11px', width: `${w}%`, borderRadius: '5px' }} />)}
      </div>
    </div>
  )
}

// ── Holographic badge ─────────────────────────────────────
const HolographicBadge = ({ active, thinking, latency }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
    <motion.div
      animate={{ scale: thinking ? [1, 1.5, 1, 1.3, 1] : 1, boxShadow: thinking ? [`0 0 5px #6366F1`, `0 0 16px #6366F1`, `0 0 5px #6366F1`] : active ? `0 0 7px ${PICTON}55` : 'none', background: thinking ? ['#6366F1', '#818CF8', '#6366F1'] : active ? PICTON : 'var(--text-4)' }}
      transition={{ duration: 1.4, repeat: thinking ? Infinity : 0 }}
      style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0 }}
    />
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
      {thinking ? 'PROCESSING' : active ? `LATENCY: ${latency || 42}ms` : 'STANDBY'}
    </span>
  </div>
)

// ── Magnetic button ───────────────────────────────────────
const MagneticButton = ({ children, onClick, disabled, style = {}, className = '' }) => {
  const ref = useRef(null)
  const x   = useMotionValue(0)
  const y   = useMotionValue(0)
  const sx  = useSpring(x, { stiffness: 300, damping: 20 })
  const sy  = useSpring(y, { stiffness: 300, damping: 20 })
  const onMove  = useCallback(e => { if (disabled || !ref.current) return; const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.38); y.set((e.clientY - r.top - r.height / 2) * 0.38) }, [disabled, x, y])
  const onLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])
  return (
    <motion.button ref={ref} className={className} style={{ ...style, x: sx, y: sy, willChange: 'transform' }} onClick={onClick} disabled={disabled} onMouseMove={onMove} onMouseLeave={onLeave} whileTap={{ scale: 0.96 }}>
      {children}
    </motion.button>
  )
}

// ── Bento stat card ───────────────────────────────────────
const BentoStat = ({ icon: Icon, label, value, sub, color = PICTON, index = 0, prefix = '', suffix = '', decimals = 0, rippleKey = 0 }) => {
  const numVal = parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0
  const isNum  = !isNaN(numVal) && String(value).match(/[\d.]/)
  return (
    <motion.div
      key={`${label}-${rippleKey}`}
      initial={{ scale: 0.92, opacity: 0, y: 8 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay: index * 0.05 }}
    >
      <SpotlightCard accent={color} padding="18px" style={{ height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ width: 30, height: 30, borderRadius: '8px', background: `${color}14`, border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={14} color={color} />
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
        </div>
        <div style={{ fontSize: '1.9rem', lineHeight: 1, marginBottom: '5px' }}>
          {isNum
            ? <AnimatedNumber value={numVal} prefix={prefix} suffix={suffix} decimals={decimals} color={color} />
            : <span style={{ fontFamily: 'JetBrains Mono, monospace', color, letterSpacing: '-0.03em' }}>{value}</span>
          }
        </div>
        {sub && <div style={{ fontSize: '11px', color: 'var(--text-4)', lineHeight: '1.4', fontFamily: 'Inter, sans-serif' }}>{sub}</div>}
      </SpotlightCard>
    </motion.div>
  )
}

// ── Mechanical slider ─────────────────────────────────────
const SliderEl = ({ label, value, min, max, step, onChange, format, color = PICTON, shaking = false, onDragStart, onDragEnd }) => {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <motion.div style={{ marginBottom: '22px' }} animate={shaking ? { x: [-5, 5, -5, 5, -3, 3, 0] } : {}} transition={{ duration: 0.35 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '9px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: '600', fontFamily: 'Plus Jakarta Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        <motion.span animate={shaking ? { scale: [1, 1.2, 1], color: [AMBER, color, color] } : {}} transition={{ duration: 0.35 }} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: '700', color, letterSpacing: '-0.02em' }}>
          {format(value)}
        </motion.span>
      </div>
      <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: '4px', borderRadius: '2px', background: 'var(--border)' }} />
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: '4px', borderRadius: '2px', background: `linear-gradient(90deg, ${color}99, ${color})`, pointerEvents: 'none', transition: 'width 0.06s' }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} onMouseDown={onDragStart} onMouseUp={onDragEnd} onTouchStart={onDragStart} onTouchEnd={onDragEnd} style={{ position: 'absolute', width: '100%', height: '4px', opacity: 0, cursor: 'pointer', zIndex: 2, margin: 0 }} />
        <div style={{ position: 'absolute', left: `calc(${pct}% - 10px)`, width: 20, height: 20, borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 0 0 4px ${color}20, 0 2px 8px rgba(0,0,0,0.2)`, pointerEvents: 'none', transition: 'left 0.06s', zIndex: 1 }} />
      </div>
    </motion.div>
  )
}

// ── Chart tooltip ─────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: `1px solid ${PICTON}33`, borderRadius: '9px', padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-4)', marginBottom: '6px' }}>MONTH {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: p.color, fontWeight: '600', marginBottom: '2px' }}>
          {p.name}: {p.value >= 0 ? '+' : ''}₹{p.value}K
        </div>
      ))}
    </div>
  )
}

// ── AI panel ──────────────────────────────────────────────
const AIPanel = ({ response, loading, certName, latency, isStudent }) => {
  if (loading) return <ScanningBeam certName={certName} />
  if (!response) return null

  const rows = [
    { key: 'verdict',    icon: Target,     color: PICTON,        label: 'VERDICT'    },
    { key: 'breakEven',  icon: Clock,      color: AMBER,         label: isStudent ? 'TIME TO OFFER' : 'BREAK-EVEN' },
    { key: 'projection', icon: TrendingUp, color: EMERALD,       label: isStudent ? 'EARNING POTENTIAL' : '5-YEAR'  },
    { key: 'bottomLine', icon: Zap,        color: 'var(--text)', label: 'ACTION'     },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      style={{ background: 'var(--surface)', border: `1px solid ${PICTON}22`, borderRadius: '14px', overflow: 'hidden', boxShadow: 'inset 0 1px 0 var(--card-highlight), 0 2px 8px rgba(0,0,0,0.06)' }}>

      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={13} color={PICTON} />
        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '12px', color: PICTON, letterSpacing: '0.04em' }}>
          {isStudent ? 'CAREER LAUNCH ENGINE' : 'DECISION ENGINE'}
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)' }}>llama-3.3-70b · india 2026</span>
      </div>

      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '13px' }}>
        {rows.map(({ key, icon: Icon, color, label }, idx) =>
          response[key] ? (
            <motion.div key={key} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22, delay: idx * 0.06 }} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: 26, height: 26, flexShrink: 0, borderRadius: '7px', background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>
                <Icon size={12} color={color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>{label}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.55', fontFamily: 'Inter, sans-serif' }}>{response[key]}</div>
              </div>
            </motion.div>
          ) : null
        )}

        {response.demand?.length > 0 && (
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>MARKET DEMAND</div>
            {response.demand.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '5px' }}>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: EMERALD, marginTop: '9px', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif' }}>{d}</span>
              </div>
            ))}
          </div>
        )}

        {response.risks?.length > 0 && (
          <div style={{ padding: '10px 12px', borderRadius: '9px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.14)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '7px' }}>
              <AlertTriangle size={11} color={AMBER} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: AMBER, textTransform: 'uppercase', letterSpacing: '0.1em' }}>RISKS</span>
            </div>
            {response.risks.map((r, i) => <div key={i} style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '3px', fontFamily: 'Inter, sans-serif' }}>• {r}</div>)}
          </div>
        )}

        {response.studentTrack && (
          <div style={{ padding: '10px 12px', borderRadius: '9px', background: 'var(--indigo-dim)', border: '1px solid var(--border-accent)' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--indigo-light)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>STUDENT FAST TRACK</div>
            <div style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: '1.6', fontFamily: 'Inter, sans-serif' }}>{response.studentTrack}</div>
          </div>
        )}
      </div>

      <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <HolographicBadge active={true} thinking={false} latency={latency} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', opacity: 0.4 }}>[ SYSTEM: STABLE ]</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', opacity: 0.3 }}>[ MODEL: llama-3.3 ]</span>
        </div>
      </div>
    </motion.div>
  )
}

// ── Auth gate ─────────────────────────────────────────────
const AuthGate = ({ onSignIn, onDismiss }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
    style={{ background: 'var(--surface)', border: `1px solid ${PICTON}22`, borderRadius: '14px', padding: '28px', textAlign: 'center', position: 'relative', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
    {onDismiss && <button onClick={onDismiss} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer' }}><X size={14} /></button>}
    <div style={{ width: 46, height: 46, borderRadius: '13px', background: 'var(--indigo-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
      <Lock size={20} color="var(--indigo-light)" />
    </div>
    <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800' }}>Free Queries Used</h3>
    <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '20px', lineHeight: '1.65', fontFamily: 'Inter, sans-serif' }}>Sign in free for unlimited access.</p>
    <button onClick={onSignIn} className="btn-primary" style={{ width: '100%' }}>Sign in with Google — Free</button>
  </motion.div>
)

// ── Student first offer roadmap ───────────────────────────
const StudentRoadmap = ({ certName }) => {
  const certMonths = CERTIFICATIONS.find(c => c.name === certName)?.timeMonths || 3
  const steps = [
    { step: '1', title: `Get ${certName.split(' ').slice(0,2).join(' ')} certified`, desc: `Complete the cert in ~${certMonths} months — use Coursera, Udemy, or official platform`, color: '#6366F1' },
    { step: '2', title: 'Build 2 portfolio projects', desc: 'Apply what you learned — GitHub projects are essential. Recruiters check this first', color: PICTON },
    { step: '3', title: 'Target your first ₹4.8L+ offer', desc: 'Apply to Capgemini iON, Infosys Instep, TCS NQT, Wipro Elite — all hire freshers with certs', color: EMERALD },
  ]
  return (
    <div style={{ padding: '18px', borderRadius: '14px', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'inset 0 1px 0 var(--card-highlight)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <GraduationCap size={14} color="#6366F1" />
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '13px', color: 'var(--text)' }}>YOUR FIRST OFFER ROADMAP</div>
      </div>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < 2 ? '14px' : '0' }}>
          <div style={{ width: 28, height: 28, borderRadius: '8px', background: s.color + '18', border: '1px solid ' + s.color + '28', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: s.color, fontWeight: '700' }}>{s.step}</span>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '2px' }}>{s.title}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>{s.desc}</div>
          </div>
          {i < 2 && (
            <div style={{ position: 'absolute', marginLeft: '13px', marginTop: '28px', width: '1px', height: '14px', background: 'var(--border)' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// HERO — MAIN
// ─────────────────────────────────────────────────────────
const Hero = ({ mode = 'professional', prefilledCert = '', resumeName = '' }) => {
  const width    = useWindowWidth()
  const isMobile = width < 768

  const [salary,       setSalary]       = useLocalStorage('croi_salary',      12)
  const [certCost,     setCertCost]     = useLocalStorage('croi_cost',        0.25)
  const [hikePercent,  setHikePercent]  = useLocalStorage('croi_hike',        35)
  const [certName,     setCertName]     = useLocalStorage('croi_cert',        'AWS Solutions Architect')
  const [lastResult,   setLastResult]   = useLocalStorage('croi_last_result', null)
  const [studentMode,  setStudentMode]  = useState(false)
  const [aiResponse,   setAiResponse]   = useState(lastResult)
  const [aiLoading,    setAiLoading]    = useState(false)
  const [showAuthGate, setShowAuthGate] = useState(false)
  const [error,        setError]        = useState(null)
  const [showPitch,    setShowPitch]    = useState(false)
  const [showBurnRate, setShowBurnRate] = useState(false)
  const [showHikeV,    setShowHikeV]    = useState(false)
   const [shakeSalary,  setShakeSalary]  = useState(false)
  const [shakeHike,    setShakeHike]    = useState(false)
  const [rippleKey,    setRippleKey]    = useState(0)
  const [latency,      setLatency]      = useState(42)

  const { user, signInGoogle }             = useAuth()
  const { remaining, exceeded, increment } = useGuestCounter(GUEST_FREE_LIMIT)
  const isStudent                          = studentMode || mode === 'student'
  const roi                                = useROICalc({ currentSalary: isStudent ? 0 : salary, certCost, hikePercent })

  // Sync student mode with mode prop from ModeSelector
  useEffect(() => {
    if (mode === 'student') setStudentMode(true)
    else if (mode === 'professional' || mode === 'switcher') setStudentMode(false)
  }, [mode])

  useEffect(() => { setRippleKey(k => k + 1) }, [salary, certCost, hikePercent])

  // Auto-select cert from Step 1
  useEffect(() => {
    if (prefilledCert && prefilledCert.trim()) setCertName(prefilledCert)
  }, [prefilledCert])

  const handleAnalyse = async () => {
    if (!user && exceeded) { setShowAuthGate(true); return }
    setAiLoading(true); setAiResponse(null); setError(null)
    const t0 = Date.now()
    try {
      const result = await analyzeROI({ certName, currentSalary: isStudent ? 0 : salary, certCost, hikePercent, isStudent })
      setAiResponse(result); setLastResult(result)
      setLatency(Date.now() - t0)
      if (!user) increment()
    } catch (e) {
      if (e.message?.includes('not configured') || e.message?.includes('500') || e.message?.includes('404') || e.message === 'GROQ_NOT_CONFIGURED') {
        const mock = getMockResponse({ certName, currentSalary: isStudent ? 0 : salary, certCost, hikePercent, isStudent })
        setAiResponse(mock); setLastResult(mock)
        if (!user) increment()
      } else {
        setError(e.message || 'Analysis failed — check console')
      }
    } finally { setAiLoading(false) }
  }

  const handleSignIn = async () => {
    try { await signInGoogle(); setShowAuthGate(false) } catch {}
  }

  const makeSalaryChange = (v) => {
    if (v <= 0 || v >= 40) { setShakeSalary(true); setTimeout(() => setShakeSalary(false), 400) }
    setSalary(v)
  }
  const makeHikeChange = (v) => {
    if (v <= 5 || v >= 80) { setShakeHike(true); setTimeout(() => setShakeHike(false), 400) }
    setHikePercent(v)
  }

  // FIX: Student recommendation uses demand score, not salary-based ROI
  const recommendedCert = useMemo(() => {
    if (isStudent) {
      return CERTIFICATIONS.slice().sort((a, b) => {
        const demandScore = (d) => d === 'Very High' ? 4 : d === 'High' ? 3 : d === 'Medium' ? 2 : 1
        const scoreA = demandScore(a.demand) * a.avgHike - (a.avgCost / 10000)
        const scoreB = demandScore(b.demand) * b.avgHike - (b.avgCost / 10000)
        return scoreB - scoreA
      })[0]
    }
    return CERTIFICATIONS.slice().sort((a, b) => {
      const ra = (salary * 100000 * a.avgHike / 100) * 5 - a.avgCost
      const rb = (salary * 100000 * b.avgHike / 100) * 5 - b.avgCost
      return rb - ra
    })[0]
  }, [salary, isStudent])

  const fmtSalary = v => v === 0 ? 'Student (₹0)' : `₹${v}L`
  const fmtCost   = v => `₹${v}L`
  const fmtHike   = v => `+${v}%`

  const statCards = isStudent ? [
    { icon: GraduationCap, label: 'TARGET OFFER',  value: '₹4.8L',                            color: '#6366F1', index: 0 },
    { icon: Clock,         label: 'TIME TO OFFER', value: certCost < 0.1 ? '4-6mo' : '5-8mo', color: AMBER,     index: 1 },
    { icon: DollarSign,    label: 'CERT COST',     value: certCost, prefix: '₹', suffix: 'L', decimals: 2, color: PICTON, index: 2 },
    { icon: Sparkles,      label: 'MODE',          value: 'STUDENT',                            color: '#818CF8', index: 3 },
  ] : [
    { icon: Clock,      label: 'BREAK-EVEN', value: roi.breakEvenMonths,       suffix: 'mo',             sub: 'months to recover',   color: AMBER,     index: 0 },
    { icon: TrendingUp, label: '5-YR GAIN',  value: Number(roi.fiveYearGainL), prefix: '₹', suffix: 'L', decimals: 1, sub: roi.anchor, color: EMERALD, index: 1 },
    { icon: DollarSign, label: 'NEW SALARY', value: Number(roi.newSalaryL),    prefix: '₹', suffix: 'L', decimals: 1,                 color: PICTON,    index: 2 },
    { icon: Sparkles,   label: '5-YR ROI',   value: roi.roiPercent,            suffix: '%',                                            color: '#818CF8', index: 3 },
  ]

  // FIX: Filter affiliate links by selected cert domain
  const selectedCertDomain = CERTIFICATIONS.find(c => c.name === certName)?.domain
  const affiliateCerts = CERTIFICATIONS.filter(c => {
    if (selectedCertDomain) return c.affiliate && c.domain === selectedCertDomain
    return c.affiliate
  }).slice(0, 4)
  // Fallback: if no affiliates match domain, show all affiliates
  const displayAffiliates = affiliateCerts.length > 0
    ? affiliateCerts
    : CERTIFICATIONS.filter(c => c.affiliate).slice(0, 3)

  const firstName = resumeName ? resumeName.split(' ')[0] : ''

  return (
    <>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '64px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '20px', background: `${PICTON}10`, border: `1px solid ${PICTON}28`, fontSize: '11px', color: PICTON, marginBottom: '16px', letterSpacing: '0.08em', fontFamily: 'JetBrains Mono, monospace' }}>
              {isStudent
                ? <><GraduationCap size={11} /> {firstName ? `${firstName.toUpperCase()}'S FIRST OFFER PATH` : 'STUDENT MODE — FIRST OFFER PATH'}</>
                : <><Zap size={11} /> {firstName ? `WELCOME BACK, ${firstName.toUpperCase()} · INDIA TECH 2026` : 'INDIA TECH · DATA MARCH 2026'}</>
              }
            </div>
            <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', letterSpacing: '-0.03em', lineHeight: 1.05, color: 'var(--text)', marginBottom: '12px' }}>
              {isStudent
                ? <>{firstName ? `${firstName},` : 'YOUR'}<span style={{ color: PICTON }}> CERT → </span>FIRST OFFER</>
                : <>{firstName ? <>{firstName}, is your<br /></> : <>IS YOUR CERT<br /></>}<span style={{ color: PICTON }}>WORTH THE MONEY?</span></>
              }
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-3)', maxWidth: '420px', margin: '0 auto', lineHeight: '1.7', fontFamily: 'Inter, sans-serif' }}>
              {isStudent
                ? 'Find the right cert, build your portfolio, land your first ₹4.8L+ offer in India.'
                : 'Live ROI for Indian tech professionals. Break-even, 5-year gain, AI verdict — before you spend a rupee.'
              }
            </p>
          </motion.div>

          {/* Bento grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '340px 1fr', gap: '16px', alignItems: 'start' }}>

            {/* LEFT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Cert selector */}
              <SpotlightCard accent={PICTON}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
                  <Target size={13} color={PICTON} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: PICTON, textTransform: 'uppercase', letterSpacing: '0.1em' }}>CHOOSE CERT</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px', maxHeight: '150px', overflowY: 'auto', paddingRight: '2px' }}>
                  {CERTIFICATIONS.map(cert => {
                    const sel = certName === cert.name
                    const rec = recommendedCert?.id === cert.id
                    return (
                      <div key={cert.id} style={{ position: 'relative' }}>
                        <button onClick={() => setCertName(cert.name)}
                          style={{ padding: '5px 10px', borderRadius: '7px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', background: sel ? `${PICTON}14` : 'var(--bg)', border: `1px solid ${sel ? PICTON + '44' : 'var(--border)'}`, color: sel ? PICTON : 'var(--text-3)', transition: 'all 0.15s' }}>
                          {cert.name}
                        </button>
                        {rec && <div style={{ position: 'absolute', top: -6, right: -4, background: EMERALD, borderRadius: '3px', padding: '1px 4px', fontSize: '8px', fontWeight: '800', color: '#fff' }}>★</div>}
                      </div>
                    )
                  })}
                </div>

                {recommendedCert && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', padding: '7px 10px', borderRadius: '7px', background: `${EMERALD}0c`, border: `1px solid ${EMERALD}20` }}>
                    <Star size={10} color={EMERALD} fill={EMERALD} />
                    <span style={{ fontSize: '11px', color: EMERALD, fontWeight: '700', fontFamily: 'Inter, sans-serif' }}>
                      {isStudent ? 'Best for freshers:' : 'Best ROI:'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif' }}>{recommendedCert.name}</span>
                  </div>
                )}

                {/* FIX: Show locked badge when cert comes from Step 1 */}
                {prefilledCert && prefilledCert === certName ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: `${EMERALD}08`, border: `1px solid ${EMERALD}28`, borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '5px', background: `${EMERALD}18`, color: EMERALD, fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', whiteSpace: 'nowrap' }}>FROM STEP 1</span>
                      <span style={{ fontSize: '12px', color: 'var(--text)', fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>{certName}</span>
                    </div>
                    <button onClick={() => setCertName('')} style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', fontSize: '11px', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>change</button>
                  </div>
                ) : (
                  <input type="text" value={certName} onChange={e => setCertName(e.target.value)} placeholder="Or type any certification..."
                    style={{ width: '100%', padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '12px', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = `${PICTON}55`}
                    onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                  />
                )}
              </SpotlightCard>

              {/* Sliders */}
              <SpotlightCard accent={EMERALD}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
                  <DollarSign size={13} color={EMERALD} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: EMERALD, textTransform: 'uppercase', letterSpacing: '0.1em' }}>YOUR NUMBERS</span>
                </div>

                {/* Student toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', padding: '10px 12px', borderRadius: '9px', background: 'var(--bg)', border: `1px solid ${isStudent ? '#6366F144' : 'var(--border)'}`, transition: 'border-color 0.2s' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text)', fontWeight: '600', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>🎓 Student Mode</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '1px', fontFamily: 'Inter, sans-serif' }}>No job yet → optimise for first offer</div>
                  </div>
                  <button onClick={() => setStudentMode(v => !v)}
                    style={{ width: 40, height: 22, borderRadius: '11px', border: 'none', cursor: 'pointer', background: isStudent ? '#6366F1' : 'var(--border)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 2, left: isStudent ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }} />
                  </button>
                </div>

                {/* FIX: Hide salary slider in student mode, show info banner instead */}
                {isStudent ? (
                  <div style={{ padding: '10px 12px', borderRadius: '9px', background: 'var(--indigo-dim)', border: '1px solid var(--border-accent)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>🎓</span>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--indigo-light)', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Student Mode Active</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>Optimising for ₹4.8L+ first offer — no salary needed</div>
                    </div>
                  </div>
                ) : (
                  <SliderEl label="Current Salary" value={salary} min={0} max={40} step={1} onChange={makeSalaryChange} format={fmtSalary} color={PICTON} shaking={shakeSalary} } />
                )}

                <SliderEl label="Cert Cost" value={certCost} min={0} max={2} step={0.05} onChange={setCertCost} format={fmtCost} color={AMBER} } />
                {!isStudent && <SliderEl label="Expected Hike" value={hikePercent} min={5} max={80} step={5} onChange={makeHikeChange} format={fmtHike} color={EMERALD} shaking={shakeHike} } />}
              </SpotlightCard>

              {/* FIX: Affiliate links filtered by cert domain */}
              <SpotlightCard accent="var(--border)">
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                  {selectedCertDomain ? `LEARN ${selectedCertDomain.toUpperCase()} CERTS` : 'RECOMMENDED COURSES'}
                </div>
                {displayAffiliates.map((cert, i) => (
                  <motion.a key={cert.id} href={cert.link} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 10px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', textDecoration: 'none', marginBottom: '7px', transition: 'all 0.18s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${PICTON}33`; e.currentTarget.style.background = `${PICTON}07` }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text)', fontWeight: '600', fontFamily: 'Plus Jakarta Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {cert.name}
                        {cert.name === certName && <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: `${PICTON}14`, color: PICTON, fontFamily: 'JetBrains Mono, monospace' }}>SELECTED</span>}
                        {recommendedCert?.id === cert.id && <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: `${EMERALD}14`, color: EMERALD, fontFamily: 'JetBrains Mono, monospace' }}>ROI★</span>}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-4)', marginTop: '2px' }}>
                        ₹{cert.avgCost / 1000}K · +{cert.avgHike}% · {cert.demand}
                        {cert.avgCost === 0 && <span style={{ color: EMERALD, marginLeft: '4px' }}>FREE</span>}
                      </div>
                    </div>
                    <ExternalLink size={11} color="var(--text-4)" />
                  </motion.a>
                ))}
              </SpotlightCard>
            </div>

            {/* RIGHT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Stat grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {statCards.map(s => <BentoStat key={s.label} {...s} rippleKey={rippleKey} />)}
              </div>

              {/* Life anchor — professionals only */}
              {!isStudent && roi.fiveYearGainINR > 0 && (
                <motion.div key={`anchor-${rippleKey}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING, delay: 0.22 }}
                  style={{ padding: '11px 16px', borderRadius: '10px', background: `${EMERALD}0a`, border: `1px solid ${EMERALD}18`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '15px' }}>💡</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif' }}>
                    Over 5 years —{' '}
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: EMERALD, fontWeight: '700' }}>₹{roi.fiveYearGainL}L</span>
                    {roi.anchor ? ` · ${roi.anchor}` : ''}.
                  </span>
                </motion.div>
              )}

              {/* FIX: Chart only for professionals, student gets roadmap */}
              {isStudent ? (
                <StudentRoadmap certName={certName} />
              ) : (
                <SpotlightCard accent={EMERALD}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '12px', color: 'var(--text-2)', letterSpacing: '-0.01em' }}>ROI VS GHOST OF INACTION</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-4)', marginTop: '2px' }}>Cumulative gain (₹K) · 24 months</div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 10, height: 2, background: EMERALD }} /><span style={{ color: 'var(--text-4)' }}>Action</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 10, height: 2, background: 'var(--border)' }} /><span style={{ color: 'var(--text-4)' }}>👻</span></div>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={155}>
                    <AreaChart data={roi.chartData} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
                      <defs>
                        <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={EMERALD} stopOpacity={0.18} />
                          <stop offset="95%" stopColor={EMERALD} stopOpacity={0}    />
                        </linearGradient>
                        <linearGradient id="ig2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#64748B" stopOpacity={0.12} />
                          <stop offset="95%" stopColor="#64748B" stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--text-4)', fontFamily: 'JetBrains Mono, monospace' }} tickLine={false} axisLine={false} interval={5} />
                      <YAxis tick={{ fontSize: 9, fill: 'var(--text-4)', fontFamily: 'JetBrains Mono, monospace' }} tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <ReferenceLine y={0} stroke="var(--border)" />
                      <Area type="monotone" dataKey="action"   name="Action"   stroke={EMERALD}       strokeWidth={2}   fill="url(#ag2)" dot={false} />
                      <Area type="monotone" dataKey="inaction" name="Inaction" stroke="var(--text-4)"  strokeWidth={1.5} fill="url(#ig2)" dot={false} strokeDasharray="4 3" />
                    </AreaChart>
                  </ResponsiveContainer>

                  {roi.fiveYearGainINR > 0 && (
                    <div style={{ marginTop: '10px', padding: '8px 10px', borderRadius: '7px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span style={{ fontSize: '12px' }}>👻</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif' }}>
                        Inaction costs{' '}
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#EF4444', fontWeight: '700' }}>₹{roi.fiveYearGainL}L</span>
                        {' '}over 5 years.
                      </span>
                    </div>
                  )}
                </SpotlightCard>
              )}

              {/* CTA */}
              <AnimatePresence mode="wait">
                {showAuthGate && !user ? (
                  <AuthGate key="gate" onSignIn={handleSignIn} onDismiss={() => setShowAuthGate(false)} />
                ) : (
                  <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                    <MagneticButton onClick={handleAnalyse} disabled={aiLoading} className="btn-primary"
                      style={{ width: '100%', fontSize: '15px', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px', borderRadius: '12px' }}>
                      {aiLoading
                        ? <><div className="pulse-dot" />Processing...</>
                        : <>
                            <Sparkles size={15} />
                            {isStudent ? 'Get My Cert Plan with AI' : 'Analyse with AI'}
                            {!user && remaining > 0 && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', marginLeft: '4px', fontFamily: 'JetBrains Mono, monospace' }}>{remaining} free</span>}
                          </>
                      }
                    </MagneticButton>

                    {/* FIX: Show only relevant action buttons based on mode */}
                    {aiResponse && (
                      <div style={{ display: 'flex', gap: '7px', marginBottom: '12px' }}>
                        {[
                          // Pitch Boss — professionals and switchers only
                          !isStudent && { icon: Mail, label: 'Pitch Boss', onClick: () => setShowPitch(v => !v), active: showPitch },
                          // Track — everyone
                          { icon: Flame, label: 'Track Progress', onClick: () => setShowBurnRate(v => !v), active: showBurnRate },
                          // Verify Hike — professionals and switchers only (students have no hike to verify)
                          !isStudent && { icon: CheckCircle, label: 'Verify Hike', onClick: () => setShowHikeV(v => !v), active: showHikeV },
                        ].filter(Boolean).map(({ icon: Icon, label, onClick, active }, i) => (
                          <button key={i} onClick={onClick} className="btn-ghost"
                            style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '12px', borderColor: active ? `${PICTON}44` : undefined, color: active ? PICTON : undefined, fontFamily: 'Inter, sans-serif' }}>
                            <Icon size={12} />{label}
                          </button>
                        ))}
                      </div>
                    )}

                    {error && (
                      <div style={{ padding: '10px 14px', borderRadius: '9px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', fontSize: '13px', color: '#EF4444', marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
                        {error}
                      </div>
                    )}

                    <AIPanel response={aiResponse} loading={aiLoading} certName={certName} latency={latency} isStudent={isStudent} />

                    {/* Pitch Boss — hidden for students */}
                    <AnimatePresence>
                      {showPitch && aiResponse && !isStudent && (
                        <PitchGenerator certName={certName} certCost={certCost} currentSalary={salary} hikePercent={hikePercent} onClose={() => setShowPitch(false)} />
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {showBurnRate && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          style={{ background: 'var(--surface)', border: `1px solid ${AMBER}22`, borderRadius: '14px', padding: '22px', marginTop: '12px' }}>
                          <BurnRate certName={certName} breakEvenMonths={isStudent ? 0 : roi.breakEvenMonths} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Verify Hike — hidden for students */}
                    <AnimatePresence>
                      {showHikeV && !isStudent && (
                        <HikeVerifier certName={certName} projectedHike={hikePercent} onClose={() => setShowHikeV(false)} />
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Hero