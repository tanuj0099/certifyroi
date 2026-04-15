import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, ChevronDown, BarChart2, CheckCircle2, TrendingUp, Target, Layers } from 'lucide-react'

// ── TOKENS ────────────────────────────────────────────────
const C = {
  bg:          '#0A0908',
  bgAlt:       '#0F0E0D',
  surface:     '#141210',
  surfaceHigh: '#1A1714',
  text:        '#EBE6DF',
  text2:       '#9E9890',
  text3:       '#6B6560',
  text4:       '#3A3733',
  gold:        '#C8962A',
  goldL:       '#E0AC3A',
  goldDim:     'rgba(200,150,42,0.12)',
  err:         '#8C3030',
  line:        '#1E1C1A',
  lineHeavy:   '#2A2724',
  border:      'rgba(235,230,223,0.07)',
  borderMid:   'rgba(235,230,223,0.13)',
  borderStrong:'rgba(235,230,223,0.22)',
  green:       '#2A5C42',
  greenVivid:  '#3D7A58',
  btnFill:     '#EBE6DF',
  btnText:     '#0A0908',
}

const FS = "'EB Garamond', Georgia, serif"
const FN = "'Inter', system-ui, sans-serif"
const FM = "'JetBrains Mono', 'Courier New', monospace"

const EASE = [0.16, 1, 0.3, 1]

const RISE = {
  hidden: { y: 32, opacity: 0 },
  show:   { y: 0,  opacity: 1, transition: { duration: 0.75, ease: EASE } }
}
const SLIDE_L = {
  hidden: { x: -40, opacity: 0 },
  show:   { x: 0,   opacity: 1, transition: { duration: 0.7, ease: EASE } }
}

// ── HOOKS ─────────────────────────────────────────────────
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

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function CountUp({ end, prefix = '', suffix = '', duration = 1.8 }) {
  const C = useTheme()
  const [count, setCount] = useState(0)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!on) return
    const endVal = parseFloat(String(end).replace(/[^0-9.]/g, ''))
    const frames = Math.round(duration * 60); let f = 0
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

// ── SECTION CHROME ─────────────────────────────────────────
function SectionChrome({ id, label, children, bg }) {
  const C = useTheme()
  const mobile = useIsMobile()
  return (
    <div style={{ background: bg || C.bg, borderTop: `1px solid ${C.border}`, position: 'relative' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex' }}>
        {/* Architectural left rail */}
        {!mobile && (
          <div style={{ width: '148px', flexShrink: 0, borderRight: `1px solid ${C.border}`, position: 'relative' }}>
            <div style={{ position: 'sticky', top: '160px', height: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', gap: '0' }}>
              {/* Top crosshair */}
              <svg width="12" height="12" viewBox="0 0 12 12">
                <line x1="6" y1="0" x2="6" y2="12" stroke={C.text4} strokeWidth="0.8"/>
                <line x1="0" y1="6" x2="12" y2="6" stroke={C.text4} strokeWidth="0.8"/>
                <circle cx="6" cy="6" r="1.5" fill={C.text4}/>
              </svg>
              <div style={{ width: '1px', flex: 1, background: `linear-gradient(to bottom, ${C.border}, ${C.borderMid}, ${C.border})`, margin: '16px 0' }}/>
              {/* Section ID rotated */}
              <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: FM, fontSize: '10px', color: C.gold, letterSpacing: '0.18em' }}>{id}</span>
                <span style={{ fontFamily: FM, fontSize: '9px', color: C.text4, letterSpacing: '0.12em' }}>// {label}</span>
              </div>
              <div style={{ width: '1px', flex: 1, background: `linear-gradient(to bottom, ${C.border}, ${C.borderMid}, ${C.border})`, margin: '16px 0' }}/>
              {/* Bottom crosshair */}
              <svg width="12" height="12" viewBox="0 0 12 12">
                <line x1="6" y1="0" x2="6" y2="12" stroke={C.text4} strokeWidth="0.8"/>
                <line x1="0" y1="6" x2="12" y2="6" stroke={C.text4} strokeWidth="0.8"/>
                <circle cx="6" cy="6" r="1.5" fill={C.text4}/>
              </svg>
            </div>
          </div>
        )}
        {/* Content */}
        <div style={{ flex: 1, padding: mobile ? '64px 24px' : '112px 7vw', position: 'relative', overflow: 'hidden' }}>
          {mobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
              <span style={{ fontFamily: FM, fontSize: '10px', color: C.gold, letterSpacing: '0.15em' }}>{id}</span>
              <div style={{ flex: 1, height: '1px', background: C.border }}/>
              <span style={{ fontFamily: FM, fontSize: '9px', color: C.text4, letterSpacing: '0.1em' }}>{label}</span>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

// ── BUTTONS ───────────────────────────────────────────────
function PrimaryBtn({ onClick, children, large = false }) {
  const C = useTheme()
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.14, ease: EASE }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '14px',
        padding: large ? '0 40px' : '0 28px',
        height: large ? '60px' : '48px',
        background: C.btnFill, color: C.btnText,
        border: 'none', borderRadius: '0',
        fontSize: large ? '13px' : '12px',
        fontFamily: FN, fontWeight: '600',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: C.gold }}/>
      {children}
    </motion.button>
  )
}

function GhostBtn({ onClick, children }) {
  const C = useTheme()
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '0 24px', height: '48px', borderRadius: '0',
        border: `1px solid ${C.borderMid}`,
        background: hov ? C.text : 'transparent',
        color: hov ? C.bg : C.text,
        fontSize: '11px', fontFamily: FM, fontWeight: '600',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        cursor: 'pointer', transition: 'all 0.16s ease',
      }}
    >
      {children}
    </button>
  )
}

// ── TRUST STRIP ───────────────────────────────────────────
function TrustStrip() {
  const items = [
    { tag: 'SYS.CLOUD',    text: 'AWS cert holders earn ₹2.4L more/yr in Bangalore'       },
    { tag: 'SYS.DEMAND',   text: '2,400+ cloud roles open on Naukri right now'              },
    { tag: 'SYS.FINANCE',  text: 'Average PMP payback period: 7 months'                    },
    { tag: 'SYS.DATA',     text: 'Google Analytics · ₹18K invested → ₹3.2L annual gain'   },
    { tag: 'SYS.DEVOPS',   text: 'CKA Kubernetes: highest ROI cert in India 2026'           },
    { tag: 'SYS.MARKET',   text: 'Hyderabad cloud demand up 38% year-over-year'            },
    { tag: 'SYS.COVERAGE', text: '103 certifications · 17 domains · 8 Indian cities'       },
  ]
  return (
    <div style={{
      borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
      background: C.bgAlt, height: '48px',
      display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'relative', zIndex: 10,
    }}>
      {/* Left label */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        background: C.bgAlt, zIndex: 11, borderRight: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', padding: '0 24px',
        boxShadow: `20px 0 24px ${C.bgAlt}`,
      }}>
        <span style={{ fontFamily: FM, fontSize: '9px', color: C.gold, letterSpacing: '0.22em' }}>MARKET_DATA</span>
      </div>
      {/* Scroll */}
      <div style={{ flex: 1, paddingLeft: '148px', overflow: 'hidden' }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', width: 'max-content' }}
        >
          {[...items, ...items, ...items].map((item, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center', height: '48px',
              borderRight: `1px solid ${C.border}`, padding: '0 40px',
            }}>
              <span style={{ fontFamily: FM, fontSize: '9px', color: C.gold, marginRight: '16px', letterSpacing: '0.1em', opacity: 0.7 }}>
                [{item.tag}]
              </span>
              <span style={{ fontFamily: FN, fontSize: '12px', color: C.text2, letterSpacing: '0.01em', fontWeight: '450', whiteSpace: 'nowrap' }}>
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// ── CERT ASSEMBLY ─────────────────────────────────────────
function CertAssembly() {
  const mobile = useIsMobile()
  const trackRef = useRef<HTMLDivElement>(null)
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

  const remap = (p, a, b, c, d) =>
    c + (d - c) * Math.max(0, Math.min(1, (p - a) / (b - a)))

  const p8 = remap(prog, 0, 0.8, 0, 1)
  const l1 = mobile
    ? `translateY(${remap(p8,0,1,-45,0)}px) rotateZ(${remap(p8,0,1,2.5,0)}deg)`
    : `perspective(1200px) translateZ(${remap(p8,0,1,-260,0)}px) translateY(${remap(p8,0,1,-75,0)}px) rotateY(${remap(p8,0,1,30,0)}deg) rotateX(${remap(p8,0,1,14,0)}deg)`
  const l2 = mobile
    ? `translateY(${remap(p8,0,1,45,0)}px) rotateZ(${remap(p8,0,1,-2,0)}deg)`
    : `perspective(1200px) translateZ(${remap(p8,0,1,260,0)}px) translateY(${remap(p8,0,1,75,0)}px) rotateY(${remap(p8,0,1,-24,0)}deg) rotateX(${remap(p8,0,1,-11,0)}deg)`
  const certScale = prog < 0.8 ? remap(prog,0,0.8,0.62,1) : remap(prog,0.8,1,1,0.85)
  const certOpacity = prog < 0.05 ? remap(prog,0,0.05,0,1) : prog > 0.85 ? remap(prog,0.85,1,1,0) : 1
  const overlayOp = prog < 0.08 ? remap(prog,0,0.08,0,0.96) : prog > 0.92 ? remap(prog,0.92,1,0.96,0) : 0.96
  const hintOp = prog > 0.16 ? 0 : prog > 0.06 ? remap(prog,0.06,0.16,1,0) : 1
  const doneOp = remap(prog,0.78,0.88,0,1)
  const cardW = mobile ? 'min(300px,88vw)' : 'min(460px,80vw)'

  return (
    <div ref={trackRef} style={{ height: '300vh', position: 'relative', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: C.bg, opacity: overlayOp, transition: 'none', pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', zIndex: 4 }}>
          <div style={{ transform: `scale(${certScale})`, opacity: certOpacity }}>
            <div style={{ position: 'relative', width: cardW, height: `calc(${cardW} / 1.414)`, transformStyle: 'preserve-3d' }}>
              {/* Frame layer */}
              <div style={{ position: 'absolute', inset: 0, transform: l1 }}>
                <svg viewBox="0 0 480 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0, display: 'block' }}>
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={C.text4}/>
                      <stop offset="50%" stopColor={C.gold}/>
                      <stop offset="100%" stopColor={C.gold}/>
                    </linearGradient>
                  </defs>
                  <rect width="480" height="340" fill={C.surface} style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.7))' }}/>
                  <rect x="1.5" y="1.5" width="477" height="337" fill="none" stroke="url(#cg)" strokeWidth="1.5"/>
                  <rect x="14" y="14" width="452" height="312" fill="none" stroke={C.border} strokeWidth="0.7"/>
                  {/* Corner marks */}
                  {([[18,18],[462,18],[18,322],[462,322]]).map(([cx,cy],i) => (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r="3" fill="none" stroke={C.gold} strokeWidth="0.9"/>
                      <circle cx={cx} cy={cy} r="6.5" fill="none" stroke={C.gold} strokeOpacity="0.2" strokeWidth="0.5"/>
                    </g>
                  ))}
                  {/* Accent lines */}
                  <line x1="40" y1="1.5" x2="90" y2="1.5" stroke={C.gold} strokeWidth="2"/>
                  <line x1="390" y1="1.5" x2="440" y2="1.5" stroke={C.gold} strokeWidth="2"/>
                  <line x1="40" y1="338.5" x2="90" y2="338.5" stroke={C.gold} strokeWidth="2"/>
                  <line x1="390" y1="338.5" x2="440" y2="338.5" stroke={C.gold} strokeWidth="2"/>
                </svg>
              </div>
              {/* Content layer */}
              <div style={{ position: 'absolute', inset: 0, transform: l2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px' }}>
                <div style={{ fontFamily: FM, fontSize: '8px', color: C.gold, letterSpacing: '0.24em', marginBottom: '14px', textTransform: 'uppercase', opacity: 0.75 }}>
                  CERTIFYROI · SYSTEM AUTH
                </div>
                <div style={{ fontFamily: FS, fontWeight: '400', fontSize: 'clamp(1.4rem,3.5vw,2.4rem)', color: C.text, marginBottom: '6px', textAlign: 'center', lineHeight: 1.1 }}>
                  Route Briefing
                </div>
                <div style={{ fontFamily: FN, fontSize: '12px', color: C.text3, marginBottom: '28px', textAlign: 'center' }}>
                  Personalised Analysis · India 2026
                </div>
                <div style={{ display: 'flex', gap: '36px', marginBottom: '22px', justifyContent: 'center' }}>
                  {[{ l:'SUMMIT TIME', v:'9 mo', c:C.text }, { l:'5-YR GAIN', v:'₹14.2L', c:C.gold }, { l:'ELEVATION', v:'+35%', c:C.text }].map((s,i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: FM, fontSize: '7.5px', color: C.text4, letterSpacing: '0.12em', marginBottom: '8px', textTransform: 'uppercase' }}>{s.l}</div>
                      <div style={{ fontFamily: FM, fontSize: 'clamp(1rem,2.8vw,1.55rem)', color: s.c, fontWeight: '500', letterSpacing: '-0.02em' }}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ width: '80%', height: '1px', background: C.border, marginBottom: '14px' }}/>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <CheckCircle2 size={11} color={C.gold}/>
                  <span style={{ fontFamily: FM, fontSize: '8px', color: C.text3, letterSpacing: '0.12em' }}>VERIFIED · NAUKRI MARCH 2026</span>
                </div>
              </div>
            </div>
          </div>
          {/* Scroll hint */}
          <div style={{ opacity: hintOp, marginTop: '40px', textAlign: 'center', pointerEvents: 'none', transition: 'opacity 0.3s' }}>
            <motion.div animate={{ y: [0,7,0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
              <div style={{ fontFamily: FM, fontSize: '9px', color: C.text3, letterSpacing: '0.22em' }}>↓ SCROLL TO ASSEMBLE ↓</div>
            </motion.div>
          </div>
        </div>
        {/* Assembled */}
        <div style={{ opacity: doneOp, position: 'absolute', bottom: '9%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 5, transition: 'opacity 0.3s' }}>
          <div style={{ fontFamily: FM, fontSize: '11px', color: C.gold, letterSpacing: '0.22em', background: C.surface, display: 'inline-block', padding: '8px 18px', border: `1px solid ${C.border}` }}>
            ✓ BRIEFING COMPILED
          </div>
        </div>
      </div>
    </div>
  )
}

// ── DATA COMPOSITION ──────────────────────────────────────
function DataComposition() {
  const mobile = useIsMobile()
  return (
    <SectionChrome id="02" label="METRICS_LOG">
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <div style={{ fontFamily: FM, fontSize: '10px', color: C.gold, letterSpacing: '0.18em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', background: C.gold, borderRadius: 0 }}/>
          The numbers behind every route
        </div>
      </motion.div>

      <motion.div variants={SLIDE_L} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginBottom: '72px' }}>
        <div style={{ fontFamily: FM, fontSize: 'clamp(3rem,9vw,7.5rem)', color: C.text, lineHeight: 1, letterSpacing: '-0.045em', fontWeight: '500', display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '0.48em', color: C.gold, marginTop: '0.12em', marginRight: '4px' }}>₹</span>
          <CountUp end={14.2}/>
          <span style={{ fontSize: '0.48em', color: C.gold, marginTop: '0.12em', marginLeft: '4px' }}>L</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: FS, fontStyle: 'italic', fontWeight: '400', fontSize: 'clamp(1.05rem,2.2vw,1.3rem)', color: C.text2 }}>
            5-year net gain · AWS Solutions Architect
          </div>
          <div style={{ padding: '4px 10px', background: C.surface, border: `1px solid ${C.border}`, fontFamily: FM, fontSize: '9px', color: C.text3, letterSpacing: '0.1em' }}>
            BLR MEDIAN '26
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', borderTop: `1px solid ${C.border}` }}>
        {[
          { label: '// PAYBACK_PERIOD', num: <CountUp end={6} suffix=" MO"/>, note: 'Not "a few months." The exact month your investment turns profitable — calculated for your salary and city.' },
          { label: '// SALARY_DELTA',   num: <CountUp end={35} suffix="%"/>,  note: 'India-sourced. City-specific. Not US data converted at today\'s rate and called "India salary insights."' },
        ].map((item, i) => (
          <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            style={{ padding: mobile ? '40px 0' : `56px ${i===0 ? '64px 56px 0' : '0 56px 64px'}`, borderBottom: mobile && i===0 ? `1px solid ${C.border}` : 'none', borderRight: !mobile && i===0 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', marginBottom: '16px' }}>{item.label}</div>
            <div style={{ fontFamily: FM, fontSize: 'clamp(2.4rem,6vw,4rem)', color: C.text, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '500', marginBottom: '16px' }}>
              {item.num}
            </div>
            <div style={{ fontFamily: FN, fontSize: '15px', color: C.text2, lineHeight: '1.72', maxWidth: '38ch' }}>{item.note}</div>
          </motion.div>
        ))}
      </div>

      {/* Third stat row */}
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.2 }}
        style={{ borderTop: `1px solid ${C.border}`, paddingTop: mobile ? '40px' : '56px', display: 'flex', gap: mobile ? '24px' : '64px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', marginBottom: '12px' }}>// MONTHLY_DELTA</div>
          <div style={{ fontFamily: FM, fontSize: 'clamp(1.8rem,4.5vw,2.8rem)', color: C.goldL, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '500' }}>₹23,600</div>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', marginBottom: '12px' }}>// SCOPE</div>
          <div style={{ fontFamily: FN, fontSize: '15px', color: C.text2, lineHeight: '1.72' }}>
            103 certifications. 17 domains. Mapped to real hiring data from Naukri, AmbitionBox, and LinkedIn India — not self-reported surveys.
          </div>
        </div>
      </motion.div>
    </SectionChrome>
  )
}

// ── HOW IT WORKS ─────────────────────────────────────────
function HowItWorks({ onEnter }) {
  const C = useTheme()
  const mobile = useIsMobile()
  const [lineRef, lineInView] = useInView(0.3)
  const steps = [
    { id: '01', label: 'Basecamp',  subtitle: 'Where you start',  desc: 'Enter your salary, role, and city. Upload your resume to let AI set your starting elevation.', icon: Target },
    { id: '02', label: 'Route',     subtitle: 'Choose your path', desc: 'Select a cert or let AI recommend the highest-ROI route. Compare up to three paths side by side.', icon: Layers },
    { id: '03', label: 'Summit',    subtitle: 'Know the outcome', desc: 'Exact payback month, 5-year net gain, monthly delta, and a plain verdict on the climb.', icon: TrendingUp },
  ]
  return (
    <SectionChrome id="03" label="SYS_ARCHITECTURE" bg={C.surface}>
      <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
        style={{ fontFamily: FN, fontWeight: '700', fontSize: 'clamp(2rem,5vw,3.5rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.04, marginTop: 0, marginBottom: '72px' }}>
        Three stages.<br />One clear answer.
      </motion.h2>

      <div ref={lineRef} style={{ position: 'relative' }}>
        {/* Animated connector line */}
        {!mobile && (
          <div style={{ position: 'absolute', top: '22px', left: '22px', right: '22px', height: '1px', zIndex: 0, pointerEvents: 'none' }}>
            <svg width="100%" height="2" style={{ overflow: 'visible' }}>
              <motion.line x1="0" y1="1" x2="100%" y2="1"
                stroke={C.gold} strokeWidth="0.8" strokeDasharray="6 5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={lineInView ? { pathLength: 1, opacity: 0.4 } : {}}
                transition={{ duration: 1.6, ease: EASE }}
              />
            </svg>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3,1fr)', gap: mobile ? '40px' : '40px', position: 'relative', zIndex: 1 }}>
          {steps.map((step, i) => {
            const Icon = step.icon
            const isLast = i === steps.length - 1
            return (
              <motion.div key={step.id} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ paddingLeft: !mobile && i > 0 ? '32px' : '0', paddingRight: !mobile && !isLast ? '32px' : '0', borderRight: !mobile && !isLast ? `1px solid ${C.border}` : 'none', borderBottom: mobile && !isLast ? `1px solid ${C.border}` : 'none', paddingBottom: mobile && !isLast ? '40px' : '0', paddingTop: !mobile ? '48px' : '0' }}>
                {/* Number + line */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                  <div style={{ fontFamily: FM, fontSize: '28px', color: C.gold, fontWeight: '600', lineHeight: 1 }}>{step.id}</div>
                  <div style={{ flex: 1, height: '1px', background: C.border }}/>
                  <Icon size={16} color={C.text4}/>
                </div>
                <div style={{ fontFamily: FN, fontWeight: '700', fontSize: '19px', color: C.text, letterSpacing: '-0.02em', marginBottom: '8px' }}>{step.label}</div>
                <div style={{ fontFamily: FM, fontSize: '9px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>{step.subtitle}</div>
                <div style={{ fontFamily: FN, fontSize: '14.5px', color: C.text2, lineHeight: '1.72' }}>{step.desc}</div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginTop: '64px' }}>
        <PrimaryBtn onClick={onEnter}>Calculate ROI <ArrowRight size={15}/></PrimaryBtn>
      </motion.div>
    </SectionChrome>
  )
}

// ── VS SECTION ────────────────────────────────────────────
function VsSection() {
  const pairs = [
    { wrong: '"AWS is good for cloud engineers"',      right: 'AWS SAA at ₹9L salary: payback month 6. ₹14.2L net gain over 5 years. Or it isn\'t worth the investment.' },
    { wrong: '"Upskill for career growth"',            right: '₹23,600 extra every month from month 7 — compounding over 5 years. In rupees, not vague "career growth."' },
    { wrong: 'US salary data converted to rupees',     right: 'Naukri · AmbitionBox · LinkedIn India. 2026 data. Collected in India. Not converted from San Francisco.' },
    { wrong: 'The same advice for every professional', right: 'AI reads your resume. Sees your domain, city, experience. Recommends a specific route — not a generic blog post.' },
  ]
  return (
    <SectionChrome id="04" label="MARKET_HAZARDS">
      <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
        style={{ fontFamily: FN, fontWeight: '700', fontSize: 'clamp(2rem,5vw,3.5rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.04, marginTop: 0, marginBottom: '72px' }}>
        Every other guide<br />is pointing you the wrong way.
      </motion.h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {pairs.map((pair, i) => (
          <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '14px', maxWidth: '100%' }}>
              <div style={{ fontFamily: FN, fontWeight: '500', fontSize: 'clamp(0.95rem,2vw,1.2rem)', color: C.text2, letterSpacing: '-0.01em', lineHeight: 1.4, wordBreak: 'break-word', opacity: 0.55 }}>
                {pair.wrong}
              </div>
              <svg style={{ position: 'absolute', left: 0, top: '50%', width: '100%', overflow: 'visible', pointerEvents: 'none' }}>
                <motion.line x1="0" y1="0" x2="100%" y2="0"
                  stroke={C.err} strokeWidth="2" strokeOpacity="0.6"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.07, ease: 'easeOut' }}
                />
              </svg>
            </div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '4px', height: '18px', background: C.gold, marginTop: '3px', flexShrink: 0 }}/>
              <div style={{ fontFamily: FN, fontSize: 'clamp(14px,1.8vw,16px)', color: C.text, lineHeight: '1.68', fontWeight: '400' }}>{pair.right}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionChrome>
  )
}

// ── ELEVEN PM ─────────────────────────────────────────────
function ElevenPM({ onEnter }) {
  const C = useTheme()
  const mobile = useIsMobile()
  const stories = [
    { time:'11:47 PM', name:'Rohan',  loc:'Pune',      role:'2 yrs · Backend Engineer', thought:'"Should I do AWS? Or is it too late?"', context:'Ex-classmate promoted to Cloud Architect. ₹28L CTC. Same college, same year.', answer:'AWS SAA at ₹9L: payback month 6. 5-year gain ₹14.2L. Not too late.', color:C.gold },
    { time:'11:12 PM', name:'Sneha',  loc:'Bangalore', role:'6 yrs · Ops Manager',       thought:'"Is the switch possible without an MBA?"', context:'Every data job requires 3 years of data science experience. She has zero.', answer:'Google Data Analytics + 2 GitHub projects. 5 months. ₹8L → ₹12L.', color:C.text },
    { time:'12:03 AM', name:'Arjun',  loc:'Pune',      role:'CS · Fresh graduate',       thought:'"Which cert actually gets me placed here?"', context:'Three articles. All recommend AWS. All in USD.', answer:'Student Mode. India-specific. GCP placed 47 Pune freshers in Q1 2026.', color:C.text3 },
  ]
  return (
    <SectionChrome id="05" label="FELLOW_CLIMBERS" bg={C.surface}>
      <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
        style={{ fontFamily: FN, fontWeight: '700', fontSize: 'clamp(2rem,5vw,3.5rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.04, marginTop: 0, marginBottom: '72px' }}>
        We know what you're<br />thinking right now.
      </motion.h2>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3,1fr)', borderTop: `1px solid ${C.border}` }}>
        {stories.map((s, i) => {
          const isLast = i === stories.length - 1
          return (
            <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              onClick={onEnter}
              style={{ paddingLeft: !mobile && i > 0 ? '40px' : '0', paddingRight: !mobile && !isLast ? '40px' : '0', paddingTop: '40px', paddingBottom: '40px', borderRight: !mobile && !isLast ? `1px solid ${C.border}` : 'none', borderBottom: mobile && !isLast ? `1px solid ${C.border}` : 'none', cursor: 'pointer' }}>
              <div style={{ fontFamily: FM, fontSize: '9px', color: C.text3, letterSpacing: '0.1em', marginBottom: '18px' }}>// LOG_TIME: {s.time}</div>
              <div style={{ fontFamily: FS, fontStyle: 'italic', fontWeight: '400', fontSize: 'clamp(1.1rem,2.2vw,1.4rem)', color: C.text, lineHeight: 1.4, marginBottom: '18px' }}>{s.thought}</div>
              <div style={{ fontFamily: FN, fontSize: '13.5px', color: C.text2, lineHeight: '1.65', marginBottom: '24px' }}>
                <em style={{ fontStyle: 'italic' }}>{s.name}</em>, {s.loc} — {s.role}. {s.context}
              </div>
              <div style={{ width: '20px', height: '2px', background: s.color, marginBottom: '14px' }}/>
              <div style={{ fontFamily: FN, fontWeight: '600', fontSize: '13.5px', color: C.text, lineHeight: '1.6' }}>{s.answer}</div>
            </motion.div>
          )
        })}
      </div>
    </SectionChrome>
  )
}

// ── THREE MODES ───────────────────────────────────────────
function ThreeModes({ onEnter }) {
  const C = useTheme()
  const mobile = useIsMobile()
  const modes = [
    { label: 'Student',      sub: 'No salary yet',    desc: 'Path to a ₹4.8L+ first offer. Reframes ROI around career investment, not salary hike. No salary slider needed.' },
    { label: 'Switcher',     sub: 'Changing domains', desc: 'Domain switch in 5–8 months. Only fast-track options shown. Long certs hidden unless you ask.' },
    { label: 'Professional', sub: 'Levelling up',     desc: 'Maximum ROI on your next cert. Break-even analysis, city benchmarks, and a pitch-your-boss email.' },
  ]
  return (
    <SectionChrome id="06" label="SYS_MODES">
      <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
        style={{ fontFamily: FN, fontWeight: '700', fontSize: 'clamp(2rem,5vw,3.5rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.04, marginTop: 0, marginBottom: '72px' }}>
        Three modes.<br /><span style={{ color: C.gold }}>One tool.</span>
      </motion.h2>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3,1fr)', gap: '0', background: C.surface, border: `1px solid ${C.border}`, position: 'relative' }}>
        {!mobile && (
          <>
            <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: '1px', background: C.border }}/>
            <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: '1px', background: C.border }}/>
          </>
        )}
        {modes.map((m, i) => {
          const isLast = i === modes.length - 1
          return (
            <motion.div key={m.label} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: 'clamp(28px,4vw,40px)', borderBottom: mobile && !isLast ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ fontFamily: FM, fontSize: '9px', color: C.gold, letterSpacing: '0.18em', marginBottom: '14px' }}>MODE_{String(i + 1).padStart(2,'0')}</div>
              <div style={{ fontFamily: FN, fontWeight: '700', fontSize: '18px', color: C.text, letterSpacing: '-0.02em', marginBottom: '8px' }}>{m.label}</div>
              <div style={{ fontFamily: FM, fontSize: '9px', color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>{m.sub}</div>
              <div style={{ fontFamily: FN, fontSize: '14px', color: C.text2, lineHeight: '1.7' }}>{m.desc}</div>
            </motion.div>
          )
        })}
      </div>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginTop: '48px' }}>
        <GhostBtn onClick={onEnter}>Pick my mode <ArrowRight size={13}/></GhostBtn>
      </motion.div>
    </SectionChrome>
  )
}

// ── SOCIAL PROOF ──────────────────────────────────────────
function SocialProof() {
  const mobile = useIsMobile()
  const quotes = [
    { quote: 'CertifyROI said payback was month 8. It was month 7. Switched companies immediately. ₹6L hike.', name: 'Priya S.', detail: 'Bangalore · Engineer → Cloud Architect', hike: '+₹6L/yr', color: C.gold },
    { quote: 'Was about to spend ₹12L on an MBA. The analysis showed a different path — 5 months, 1% of the cost, same outcome.', name: 'Rahul M.', detail: 'Hyderabad · Ops Manager → Data Analyst', hike: 'Saved ₹12L', color: C.text },
    { quote: 'Student Mode. India-specific data. GCP placed 47 Pune freshers in Q1 2026. My ₹5.2L offer was one of them.', name: 'Ananya K.', detail: 'Pune · Fresh Graduate', hike: '₹5.2L offer', color: C.text3 },
  ]
  return (
    <SectionChrome id="07" label="FIELD_REPORTS" bg={C.surface}>
      <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
        style={{ fontFamily: FN, fontWeight: '700', fontSize: 'clamp(2rem,5vw,3.5rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.04, marginTop: 0, marginBottom: '72px' }}>
        They chose the right route.<br /><span style={{ color: C.gold }}>It worked.</span>
      </motion.h2>
      <div>
        {quotes.map((q, i) => {
          const isLast = i === quotes.length - 1
          return (
            <motion.div key={i} variants={SLIDE_L} initial="hidden" whileInView="show" viewport={{ once: true }}
              style={{ paddingTop: i > 0 ? (mobile ? '48px' : '64px') : '0', paddingBottom: !isLast ? (mobile ? '48px' : '64px') : '0', borderBottom: !isLast ? `1px solid ${C.border}` : 'none', display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 180px', gap: '24px', alignItems: 'end' }}>
              <div>
                <div style={{ fontFamily: FS, fontStyle: 'italic', fontWeight: '400', fontSize: 'clamp(1.15rem,2.5vw,1.8rem)', color: C.text, letterSpacing: '-0.01em', lineHeight: 1.38, marginBottom: '24px' }}>
                  "{q.quote}"
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ width: '20px', height: '2px', background: q.color, flexShrink: 0 }}/>
                  <span style={{ fontFamily: FN, fontWeight: '600', fontSize: '14px', color: C.text }}>{q.name}</span>
                  <span style={{ fontFamily: FM, fontSize: '10px', color: C.text3 }}>{q.detail}</span>
                </div>
              </div>
              <div style={{ textAlign: mobile ? 'left' : 'right' }}>
                <div style={{ fontFamily: FM, fontWeight: '600', fontSize: 'clamp(1.5rem,3vw,2rem)', color: C.text, letterSpacing: '-0.04em', lineHeight: 1 }}>{q.hike}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </SectionChrome>
  )
}

// ── FAQ ───────────────────────────────────────────────────
const FAQ_DATA = [
  { q: 'How accurate are the ROI calculations?',       a: 'Calculations are based on median salary data from Naukri, AmbitionBox, and LinkedIn India — updated quarterly. They are directional estimates, not guarantees. Actual outcomes vary by employer, negotiation, and market conditions. Every result includes the assumptions used.' },
  { q: 'Do I need to create an account?',              a: 'No. The ROI calculator, comparison tool, and city demand heatmap are all free with no signup. AI-powered features use free credits, after which a lightweight account is optional.' },
  { q: 'What certifications are covered?',             a: '103 certifications across 17 domains — cloud infrastructure, data analytics, cybersecurity, finance (CFA, CA, CMA), project management, HR, medical, and government certifications like NISM.' },
  { q: 'Is this only useful for India?',               a: 'The salary benchmarks and demand data are India-specific — 8 major cities including Bangalore, Hyderabad, Pune, Mumbai, and Delhi. The ROI framework applies anywhere, but numbers are calibrated for the Indian job market.' },
  { q: 'How does the Resume AI work?',                 a: 'Upload a resume or paste your profile. The AI reads your domain, role, years of experience, and skill set, then recommends the highest-ROI certifications for your background — not a generic sorted list.' },
]

function FAQItem({ item }) {
  const C = useTheme()
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '24px 0', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontFamily: FN, fontWeight: '600', fontSize: '15px', color: C.text, letterSpacing: '-0.01em', lineHeight: 1.4 }}>{item.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }} style={{ flexShrink: 0 }}>
          <ChevronDown size={17} color={C.text3}/>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.26 }} style={{ overflow: 'hidden' }}>
            <div style={{ paddingBottom: '24px', fontFamily: FN, fontSize: '15px', color: C.text2, lineHeight: '1.74', maxWidth: '68ch' }}>{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQ() {
  const mobile = useIsMobile()
  return (
    <SectionChrome id="08" label="LOGISTICS">
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '300px 1fr', gap: mobile ? '40px' : '80px', alignItems: 'start' }}>
        <div style={{ position: mobile ? 'static' : 'sticky', top: '160px' }}>
          <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ fontFamily: FN, fontWeight: '700', fontSize: 'clamp(1.9rem,3vw,2.5rem)', color: C.text, letterSpacing: '-0.025em', lineHeight: 1.14, marginTop: 0, marginBottom: 0 }}>
            Common<br />questions<br />answered.
          </motion.h2>
        </div>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {FAQ_DATA.map((item, i) => <FAQItem key={i} item={item}/>)}
          </div>
        </motion.div>
      </div>
    </SectionChrome>
  )
}

// ── FINAL CTA ─────────────────────────────────────────────
function FinalCTA({ onEnter }) {
  const C = useTheme()
  return (
    <SectionChrome id="09" label="SUMMIT_ACCESS" bg={C.surface}>
      {/* Corner contour decoration */}
      <div style={{ position: 'absolute', right: 0, top: 0, pointerEvents: 'none', opacity: 0.25 }}>
        <svg width="320" height="320" viewBox="0 0 320 320">
          {[40, 80, 120, 160, 200, 240].map((r, i) => (
            <circle key={i} cx="320" cy="0" r={r} fill="none" stroke={C.lineHeavy} strokeWidth="1" opacity={1 - i * 0.13}/>
          ))}
        </svg>
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FS, fontStyle: 'italic', fontWeight: '400', fontSize: 'clamp(3rem,8vw,5.5rem)', color: C.text, letterSpacing: '-0.02em', lineHeight: 0.96, marginTop: 0, marginBottom: '32px' }}>
          You'll know<br />the answer.
        </motion.h2>
        <motion.p variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }}
          style={{ fontFamily: FN, fontSize: '16px', color: C.text2, lineHeight: '1.7', maxWidth: '44ch', margin: '0 0 48px' }}>
          Stop reading generic advice. Stop asking Reddit.{' '}
          <span style={{ color: C.text, fontWeight: '600' }}>Know the exact payback period before you pay the exam fee.</span>
        </motion.p>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.18 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
          <PrimaryBtn onClick={onEnter} large>Calculate ROI <ArrowRight size={16}/></PrimaryBtn>
          {/* Access status — clean, no pill gimmick */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', border: `1px solid ${C.borderMid}`, padding: '10px 18px', background: C.bg }}>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              <div style={{ width: '4px', height: '14px', background: C.gold }}/>
              <div style={{ width: '4px', height: '14px', background: C.gold, opacity: 0.35 }}/>
            </div>
            <span style={{ fontFamily: FM, fontSize: '10px', color: C.text2, letterSpacing: '0.16em' }}>
              FREE_ACCESS // NO_ACCT_REQ
            </span>
          </div>
        </motion.div>
      </div>
    </SectionChrome>
  )
}

// ── HERO ──────────────────────────────────────────────────
function Hero({ onEnter }) {
  const C = useTheme()
  const mobile = useIsMobile()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, mobile ? -20 : -48])
  const heroOp = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <div
      ref={heroRef}
      style={{
        position: 'relative',
        height: '100vh', minHeight: '660px', maxHeight: '960px',
        display: 'flex', alignItems: 'center',
        borderBottom: `1px solid ${C.border}`,
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid — architectural skeleton */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, display: 'flex', justifyContent: 'space-evenly' }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{ width: '1px', height: '100%', background: C.border }}/>
        ))}
      </div>

      {/* Large ghost typography — editorial background texture */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0, width: '100%', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{
          fontFamily: FN, fontWeight: 900,
          fontSize: mobile ? '42vw' : '26vw',
          lineHeight: 0.78, letterSpacing: '-0.04em',
          color: 'transparent',
          WebkitTextStroke: `1.5px rgba(235,230,223,0.055)`,
          userSelect: 'none', whiteSpace: 'nowrap',
        }}>
          CERTIFY
        </div>
      </div>

      {/* Mountain photograph */}
      <div style={{
        position: 'absolute',
        right: mobile ? '-8%' : '-2%',
        bottom: '-4%',
        width: mobile ? '120%' : '64%',
        height: mobile ? '58%' : '100%',
        zIndex: 1, pointerEvents: 'none',
      }}>
        <img src="/mountain.png" alt="Mountain"
          style={{
            width: '100%', height: '100%',
            objectFit: 'contain', objectPosition: 'bottom right',
            display: 'block',
            WebkitMaskImage: mobile
              ? 'linear-gradient(to top, transparent 0%, black 20%)'
              : 'linear-gradient(to right, transparent 0%, black 12%, black 100%)',
            maskImage: mobile
              ? 'linear-gradient(to top, transparent 0%, black 20%)'
              : 'linear-gradient(to right, transparent 0%, black 12%, black 100%)',
          }}
        />
        {/* Tech annotation overlays on the mountain */}
        {!mobile && (
          <>
            {/* Basecamp annotation */}
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.7, ease: EASE }}
              style={{ position: 'absolute', left: '22%', bottom: '12%', display: 'flex', alignItems: 'center', gap: '0' }}
            >
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', border: `1.5px solid ${C.gold}`, background: C.bg }}/>
              <div style={{ width: '40px', height: '1px', background: C.gold, opacity: 0.5 }}/>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, padding: '7px 11px' }}>
                <div style={{ fontFamily: FM, fontSize: '11px', color: C.text, fontWeight: '600', letterSpacing: '0.05em' }}>BASECAMP</div>
                <div style={{ fontFamily: FM, fontSize: '8px', color: C.gold, letterSpacing: '0.12em', marginTop: '2px' }}>COORD: CURRENT</div>
              </div>
            </motion.div>
            {/* Month 6 annotation */}
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.35, duration: 0.7, ease: EASE }}
              style={{ position: 'absolute', left: '50%', bottom: '42%', display: 'flex', alignItems: 'center' }}
            >
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', border: `1.5px solid ${C.gold}`, background: C.bg }}/>
              <div style={{ width: '36px', height: '1px', background: C.gold, opacity: 0.5 }}/>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, padding: '7px 11px' }}>
                <div style={{ fontFamily: FM, fontSize: '11px', color: C.text, fontWeight: '600', letterSpacing: '0.05em' }}>6 MONTHS</div>
                <div style={{ fontFamily: FM, fontSize: '8px', color: C.gold, letterSpacing: '0.12em', marginTop: '2px' }}>BREAK-EVEN</div>
              </div>
            </motion.div>
            {/* Summit annotation */}
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6, duration: 0.7, ease: EASE }}
              style={{ position: 'absolute', left: '62%', top: '16%', display: 'flex', alignItems: 'center' }}
            >
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', border: `1.5px solid ${C.gold}`, background: C.bg }}/>
              <div style={{ width: '36px', height: '1px', background: C.gold, opacity: 0.5 }}/>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, padding: '7px 11px' }}>
                <div style={{ fontFamily: FM, fontSize: '11px', color: C.gold, fontWeight: '600', letterSpacing: '0.05em' }}>₹14.2L</div>
                <div style={{ fontFamily: FM, fontSize: '8px', color: C.gold, letterSpacing: '0.12em', marginTop: '2px', opacity: 0.7 }}>5-YR GAIN</div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Left dark gradient so text reads over mountain */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: mobile
          ? `linear-gradient(to top, rgba(10,9,8,0.96) 0%, rgba(10,9,8,0.7) 48%, transparent 75%)`
          : `linear-gradient(to right, rgba(10,9,8,0.98) 0%, rgba(10,9,8,0.95) 28%, rgba(10,9,8,0.6) 52%, transparent 72%)`,
      }}/>

      {/* Hero text content */}
      <motion.div style={{ y: textY, opacity: heroOp, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3, display: 'flex', alignItems: 'center' }}>
        <div style={{ padding: mobile ? '96px 24px 0' : `0 0 0 ${Math.max(148 + 56, 0)}px`, maxWidth: mobile ? '100%' : '54%' }}>

          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.7, ease: EASE }}
            style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '1px', background: C.gold }}/>
            ROI Analysis Platform
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.85, ease: EASE }}
            style={{ fontFamily: FS, fontWeight: '400', fontSize: mobile ? 'clamp(2.8rem,10vw,4.2rem)' : 'clamp(3rem,5.5vw,5.2rem)', lineHeight: 0.96, letterSpacing: '-0.022em', color: C.text, marginBottom: '36px', marginTop: 0 }}>
            Your next cert<br />
            is either a{' '}
            <em style={{ color: C.gold, fontStyle: 'italic' }}>goldmine</em>
            <br />
            <span style={{ color: C.text3, fontStyle: 'italic', position: 'relative', display: 'inline-block' }}>
              or a mistake.
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 1.0, duration: 0.55, ease: EASE }}
                style={{ position: 'absolute', left: '-1%', right: '-1%', top: '52%', height: '3px', background: C.err, opacity: 0.55, transformOrigin: 'left' }}
              />
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42, duration: 0.8 }}
            style={{ fontFamily: FN, fontSize: mobile ? '14px' : 'clamp(14px,1.4vw,16px)', color: C.text2, maxWidth: '38ch', lineHeight: '1.68', margin: '0 0 40px', fontWeight: '400' }}>
            Know the exact payback period before you pay the exam fee. Calculated for your city and current salary.
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.56, duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'flex-start' }}>
            <PrimaryBtn onClick={onEnter} large>Calculate ROI <ArrowRight size={16} strokeWidth={2}/></PrimaryBtn>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', border: `1px solid ${C.borderMid}`, padding: '9px 16px', background: `rgba(10,9,8,0.6)` }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                <div style={{ width: '4px', height: '12px', background: C.gold }}/>
                <div style={{ width: '4px', height: '12px', background: C.gold, opacity: 0.38 }}/>
              </div>
              <span style={{ fontFamily: FM, fontSize: '10px', color: C.text2, letterSpacing: '0.15em' }}>FREE_ACCESS // NO_ACCT_REQ</span>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  )
}

// ── ROOT ─────────────────────────────────────────────────
export default function App() {
  const mobile = useIsMobile()

  // Inject fonts
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap'
    document.head.appendChild(link)
  }, [])

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Minimal floating logo */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, pointerEvents: 'none' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex' }}>
          {!mobile && (
            <div style={{ width: '148px', flexShrink: 0, borderRight: `1px solid ${C.border}`, height: '64px', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <BarChart2 size={20} color={C.gold} strokeWidth={2.5}/>
                <span style={{ fontFamily: FN, fontWeight: '800', fontSize: '17px', letterSpacing: '-0.03em', color: C.text }}>
                  Certify<span style={{ color: C.gold }}>ROI</span>
                </span>
              </div>
            </div>
          )}
          <div style={{ flex: 1, borderBottom: `1px solid ${C.border}`, height: '64px', background: `rgba(10,9,8,0.92)`, backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', padding: mobile ? '0 24px' : '0 40px', justifyContent: mobile ? 'space-between' : 'flex-end', pointerEvents: 'auto' }}>
            {mobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BarChart2 size={18} color={C.gold} strokeWidth={2.5}/>
                <span style={{ fontFamily: FN, fontWeight: '800', fontSize: '16px', letterSpacing: '-0.03em', color: C.text }}>
                  Certify<span style={{ color: C.gold }}>ROI</span>
                </span>
              </div>
            )}
            <div style={{ fontFamily: FM, fontSize: '9px', color: C.text4, letterSpacing: '0.14em' }}>
              ROI ANALYSIS PLATFORM
            </div>
          </div>
        </div>
      </div>

      {/* Page */}
      <div style={{ paddingTop: '64px' }}>
        <Hero />
        <TrustStrip />
        <CertAssembly />
        <DataComposition />
        <HowItWorks />
        <VsSection />
        <ElevenPM />
        <ThreeModes />
        <SocialProof />
        <FAQ />
        <FinalCTA />

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${C.border}`, background: C.bgAlt }}>
          <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex' }}>
            {!mobile && <div style={{ width: '148px', flexShrink: 0, borderRight: `1px solid ${C.border}` }}/>}
            <div style={{ flex: 1, padding: mobile ? '32px 24px' : '32px 7vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <BarChart2 size={16} color={C.gold}/>
                <span style={{ fontFamily: FN, fontWeight: '700', fontSize: '14px', color: C.text }}>
                  Certify<span style={{ color: C.gold }}>ROI</span>
                </span>
              </div>
              <div style={{ fontFamily: FM, fontSize: '9px', color: C.text4, letterSpacing: '0.1em' }}>
                DATA: LINKEDIN · NASSCOM · NAUKRI · WEF 2026
              </div>
              <div style={{ fontFamily: FM, fontSize: '9px', color: C.text4, letterSpacing: '0.08em' }}>
                India's first cert ROI calculator
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}