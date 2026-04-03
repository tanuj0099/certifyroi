import {
  motion, useScroll, useTransform, useSpring,
  useMotionValue, AnimatePresence
} from 'framer-motion'
import { useRef, useState, useCallback, useEffect } from 'react'
import {
  TrendingUp, ArrowRight,
  GraduationCap, Repeat, Briefcase, Star, Zap, Award,
  Brain, ChevronRight, CheckCircle
} from 'lucide-react'

// ─────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────
function useIsDark() {
  var [isDark, setIsDark] = useState(function() {
    return document.documentElement.getAttribute('data-theme') !== 'light'
  })
  useEffect(function() {
    var obs = new MutationObserver(function() {
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return function() { obs.disconnect() }
  }, [])
  return isDark
}

function useIsMobile() {
  var [mobile, setMobile] = useState(function() {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false
  })
  useEffect(function() {
    function check() { setMobile(window.innerWidth < 768) }
    window.addEventListener('resize', check)
    return function() { window.removeEventListener('resize', check) }
  }, [])
  return mobile
}

// ─────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────
var F_HEAD = "'Bricolage Grotesque','Plus Jakarta Sans',sans-serif"
var F_MONO = "'Commit Mono','JetBrains Mono',monospace"
var F_BODY = "'Inter',sans-serif"

// ─────────────────────────────────────────────────────────
// CLEAN CARD — no glow, no tilt, no drag
// Just a surface with a subtle hover
// ─────────────────────────────────────────────────────────
function Card({ children, style, onClick, accentColor, animate }) {
  style       = style       || {}
  accentColor = accentColor || null
  animate     = animate !== false

  var hoverStyle = onClick
    ? { y: -2, transition: { duration: 0.18 } }
    : { y: -1, transition: { duration: 0.18 } }

  return (
    <motion.div
      onClick={onClick}
      initial={animate ? { opacity: 0, y: 16 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : false}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hoverStyle}
      style={{
        borderRadius: '12px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.18s, box-shadow 0.18s',
        borderTop: accentColor ? '2px solid ' + accentColor : undefined,
        ...style,
      }}
      onMouseEnter={function(e) {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'
        if (accentColor) e.currentTarget.style.borderColor = accentColor + '44'
      }}
      onMouseLeave={function(e) {
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
// TICKER
// ─────────────────────────────────────────────────────────
function Ticker() {
  var items = [
    'AWS cert holders earn ₹2.4L more/yr in Bangalore',
    '2,400+ cloud roles open on Naukri right now',
    'Average PMP break-even: 7 months',
    'Google Analytics: ₹18K cost → ₹3.2L annual gain',
    'CKA Kubernetes: highest hike in India 2026 at +40%',
    'Hyderabad cloud demand up 38% YoY',
  ]
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '10px 0', background: 'var(--surface)' }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '80px', whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {[...items, ...items].map(function(item, i) {
          return (
            <span key={i} style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: F_MONO, flexShrink: 0 }}>
              <span style={{ color: '#6366F1', marginRight: '12px' }}>◆</span>{item}
            </span>
          )
        })}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CERT ASSEMBLY — kept exactly as-is, this is the one
// signature moment. Only removed: grid overlay, crosshairs,
// shake effect, flare effect. The assembly itself unchanged.
// ─────────────────────────────────────────────────────────
function CertAssembly() {
  var isDark   = useIsDark()
  var isMobile = useIsMobile()

  var certBg    = isDark ? '#04060e'                : '#F8F7F4'
  var certText1 = isDark ? '#F0F2FF'                : '#0F172A'
  var certText2 = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,23,42,0.45)'
  var certMuted = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.3)'
  var certDot   = isDark ? 'rgba(99,102,241,0.2)'   : 'rgba(99,102,241,0.15)'

  var trackRef = useRef(null)
  var { scrollY } = useScroll()
  var [prog, setProg] = useState(0)

  useEffect(function() {
    function update() {
      var el = trackRef.current
      if (!el) return
      var rect   = el.getBoundingClientRect()
      var total  = el.offsetHeight - window.innerHeight
      var offset = -rect.top
      var p      = Math.max(0, Math.min(1, offset / total))
      setProg(p)
    }
    var unsub = scrollY.on('change', update)
    update()
    return unsub
  }, [scrollY])

  function remap(p, inMin, inMax, outMin, outMax) {
    var t = Math.max(0, Math.min(1, (p - inMin) / (inMax - inMin)))
    return outMin + (outMax - outMin) * t
  }

  var p8 = remap(prog, 0, 0.8, 0, 1)

  var l1, l2, l3
  if (isMobile) {
    l1 = 'translateY(' + remap(p8,0,1,-50,0) + 'px) rotateZ(' + remap(p8,0,1,3,0) + 'deg)'
    l2 = 'translateY(' + remap(p8,0,1,50,0)  + 'px) rotateZ(' + remap(p8,0,1,-2,0) + 'deg)'
    l3 = 'translateY(' + remap(p8,0,1,-25,0) + 'px) scale('   + remap(p8,0,1,0.88,1) + ')'
  } else {
    l1 = 'perspective(1200px) translateZ(' + remap(p8,0,1,-280,0) + 'px) translateY(' + remap(p8,0,1,-80,0) + 'px) rotateY(' + remap(p8,0,1,32,0) + 'deg) rotateX(' + remap(p8,0,1,15,0) + 'deg)'
    l2 = 'perspective(1200px) translateZ(' + remap(p8,0,1,280,0)  + 'px) translateY(' + remap(p8,0,1,80,0)  + 'px) rotateY(' + remap(p8,0,1,-26,0) + 'deg) rotateX(' + remap(p8,0,1,-12,0) + 'deg)'
    l3 = 'perspective(1200px) translateZ(' + remap(p8,0,1,-140,0) + 'px) translateY(' + remap(p8,0,1,-30,0) + 'px) rotateY(' + remap(p8,0,1,15,0) + 'deg) rotateX(' + remap(p8,0,1,6,0) + 'deg)'
  }

  var certScale   = prog < 0.8 ? remap(prog,0,0.8,0.62,1.0) : remap(prog,0.8,1.0,1.0,0.85)
  var certOpacity = prog < 0.05 ? remap(prog,0,0.05,0,1) : prog > 0.85 ? remap(prog,0.85,1.0,1,0) : 1
  var overlayOp   = prog < 0.08 ? remap(prog,0,0.08,0,0.94) : prog > 0.92 ? remap(prog,0.92,1,0.94,0) : 0.94
  var hintOp      = prog > 0.16 ? 0 : prog > 0.06 ? remap(prog,0.06,0.16,1,0) : 1
  var assembledOp = remap(prog,0.78,0.88,0,1)

  return (
    <div ref={trackRef} style={{ height: '300vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Background overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: isDark ? '#020408' : '#F0EDE8', opacity: overlayOp }} />

        {/* Card */}
        <div style={{ position: 'relative', zIndex: 4 }}>
          <div style={{ transform: 'scale(' + certScale + ')', opacity: certOpacity }}>
            <div style={{
              position: 'relative',
              width: isMobile ? 'min(320px,88vw)' : 'min(500px,88vw)',
              height: 'calc(' + (isMobile ? 'min(320px,88vw)' : 'min(500px,88vw)') + ' / 1.414)',
              transformStyle: 'preserve-3d',
            }}>

              {/* Layer 1 — frame */}
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
                  {[[22,22],[478,22],[22,332],[478,332]].map(function(arr, i) {
                    var cx = arr[0], cy = arr[1]
                    return (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="5.5" fill="none" stroke="#6366F1" strokeWidth="1.6"/>
                        <circle cx={cx} cy={cy} r="10" fill="none" stroke="rgba(99,102,241,0.28)" strokeWidth="0.6"/>
                        <line x1={cx-14} y1={cy} x2={cx+14} y2={cy} stroke="rgba(99,102,241,0.5)" strokeWidth="0.7"/>
                        <line x1={cx} y1={cy-14} x2={cx} y2={cy+14} stroke="rgba(99,102,241,0.5)" strokeWidth="0.7"/>
                      </g>
                    )
                  })}
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
                    { label: 'HIKE',       value: '+35%',   color: '#818CF8' },
                  ].map(function(s, i) {
                    return (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: F_MONO, fontSize: '7px', color: certMuted, letterSpacing: '0.12em', marginBottom: '5px' }}>{s.label}</div>
                        <div style={{ fontFamily: F_MONO, fontSize: 'clamp(0.8rem,2.5vw,1.5rem)', color: s.color, fontWeight: '700', letterSpacing: '-0.03em' }}>{s.value}</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ width: '74%', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.55),transparent)', marginBottom: '12px' }} />
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

          {/* Scroll hint */}
          <div style={{ opacity: hintOp, marginTop: '44px', textAlign: 'center', pointerEvents: 'none', transition: 'opacity 0.3s' }}>
            <motion.div animate={{ y: [0,8,0] }} transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '11px', color: 'rgba(99,102,241,0.6)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>↓  scroll to assemble  ↓</div>
            </motion.div>
          </div>
        </div>

        {/* Assembled confirmation */}
        <div style={{ opacity: assembledOp, position: 'absolute', bottom: '8%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 5, transition: 'opacity 0.3s' }}>
          <div style={{ fontFamily: F_MONO, fontSize: '12px', color: 'rgba(16,185,129,0.9)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>✓  YOUR ROI CERTIFICATE · ASSEMBLED</div>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN LANDING PAGE
// ─────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  var heroRef  = useRef(null)
  var isMobile = useIsMobile()

  var { scrollYProgress: heroSP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  var heroY  = useTransform(heroSP, [0,1], [0, isMobile ? 30 : 60])
  var heroOp = useTransform(heroSP, [0,0.55], [1,0])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ── */}
        <div ref={heroRef} style={{ maxWidth: '860px', margin: '0 auto', padding: 'calc(var(--nav-h,64px) + 56px) 24px 64px', textAlign: 'center' }}>
          <motion.div style={{ y: heroY, opacity: heroOp }}>

            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 14px', borderRadius: '20px', background: 'var(--indigo-dim)', border: '1px solid var(--border-accent)', fontSize: '11px', color: 'var(--indigo-light)', marginBottom: '36px', letterSpacing: '0.06em', fontFamily: F_MONO }}
            >
              <Award size={11} /> India's first AI-powered cert ROI calculator
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.55 }}
              style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(2.4rem,8vw,6rem)', lineHeight: 0.92, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: '28px', wordBreak: 'break-word' }}
            >
              YOUR NEXT CERT<br />
              IS EITHER A{' '}
              <span style={{ color: '#F59E0B' }}>GOLDMINE</span><br />
              OR A{' '}
              <span style={{ color: '#EF4444' }}>MISTAKE.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
              style={{ fontSize: 'clamp(15px,2.2vw,18px)', color: 'var(--text-2)', maxWidth: '520px', margin: '0 auto 12px', lineHeight: '1.75', fontFamily: F_BODY }}
            >
              We tell you which — in under 2 seconds — before you spend ₹50K and 6 months finding out the hard way.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}
              style={{ fontSize: '11px', color: 'var(--text-4)', marginBottom: '48px', fontFamily: F_MONO, letterSpacing: '0.1em' }}
            >
              INDIA-SPECIFIC · AI-POWERED · FREE · NO NONSENSE
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 0.6 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
            >
              <motion.div
                animate={{ y: [0,8,0], opacity: [0.5,1,0.5] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: '26px', height: '42px', borderRadius: '13px', border: '1.5px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '6px' }}
              >
                <div style={{ width: '3px', height: '9px', borderRadius: '2px', background: 'rgba(99,102,241,0.5)' }} />
              </motion.div>
              <span style={{ fontSize: '10px', fontFamily: F_MONO, color: 'var(--text-4)', letterSpacing: '0.14em' }}>SCROLL</span>
            </motion.div>

          </motion.div>
        </div>

        {/* ── TICKER ── */}
        <Ticker />

        {/* ── CERT ASSEMBLY ── */}
        <CertAssembly />

        {/* ── ACTUAL NUMBERS ── */}
        <div style={{ maxWidth: '840px', margin: '0 auto 80px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: 'var(--indigo-light)', letterSpacing: '0.12em', marginBottom: '12px', textTransform: 'uppercase', textAlign: 'center' }}>
              What that certificate means for you
            </div>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--text)', letterSpacing: '-0.04em', marginBottom: '16px', lineHeight: 1, textAlign: 'center' }}>
              Not career advice.<br />
              <span style={{ color: '#6366F1' }}>Actual numbers.</span>
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: '1.75', fontFamily: F_BODY, textAlign: 'center', maxWidth: '500px', margin: '0 auto 32px' }}>
              Every analysis gives you a break-even date, 5-year gain, and salary delta — anchored to real rupee amounts.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '12px' }}>
              {[
                { color: '#10B981', title: 'Break-even to the month', desc: 'Not "a few months." Exactly month 6. Exactly ₹23,600 extra per month from day one.' },
                { color: '#6366F1', title: '5-year gain in rupees',   desc: 'Not "career growth." ₹14.2L over 5 years. Honda City + 18 months Bangalore rent.' },
                { color: '#F59E0B', title: 'India city-specific',     desc: 'Bangalore numbers are not Hyderabad numbers. Not Pune numbers. We know the difference.' },
                { color: '#51B1E7', title: 'Reads your resume',       desc: 'A DevOps engineer and a data analyst need different certs. We read yours.' },
              ].map(function(item, i) {
                return (
                  <Card key={i} accentColor={item.color} animate={true}>
                    <div style={{ padding: '20px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, marginBottom: '14px' }} />
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', fontFamily: F_HEAD, letterSpacing: '-0.02em', marginBottom: '6px' }}>{item.title}</div>
                      <p style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: F_BODY, lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
                    </div>
                  </Card>
                )
              })}
            </div>
          </motion.div>

          {/* CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
            <motion.button
              onClick={onEnter}
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
              style={{ padding: '0 40px', height: '54px', borderRadius: '10px', border: 'none', background: '#6366F1', color: 'white', fontSize: '16px', fontFamily: F_HEAD, fontWeight: '700', letterSpacing: '-0.02em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 14px rgba(99,102,241,0.25)' }}
            >
              Find out in 2 minutes
              <ArrowRight size={17} />
            </motion.button>
            <p style={{ marginTop: '12px', fontSize: '11px', fontFamily: F_MONO, color: 'var(--text-4)', letterSpacing: '0.08em' }}>
              FREE · NO SIGNUP · TAKES 2 MINUTES
            </p>
          </div>
        </div>

        {/* ── BENTO ── */}
        <div style={{ maxWidth: '1060px', margin: '0 auto 80px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.04em' }}>
              Three tools.{' '}
              <span style={{ color: '#F59E0B' }}>One decision.</span>
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-4)', fontFamily: F_MONO, letterSpacing: '0.05em' }}>Built for Indian professionals</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gridTemplateRows: 'auto auto', gap: '12px' }}>

            {/* ROI Calculator — wide */}
            <Card accentColor="#6366F1" style={{ gridColumn: isMobile ? '1' : '1 / 3', minHeight: isMobile ? 'auto' : '240px' }}>
              <div style={{ padding: '28px' }}>
                <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={20} color="#6366F1" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.1rem,2vw,1.5rem)', letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '2px' }}>ROI Calculator</h3>
                    <div style={{ fontFamily: F_MONO, fontSize: '9px', color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Not estimates. Actual rupees.</div>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: '1.7', maxWidth: '380px', fontFamily: F_BODY, marginBottom: '20px' }}>
                  Enter your salary, cert cost, and expected hike. See break-even to the month, 5-year gain, monthly delta.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[{ l: 'Break-even', v: '6 months', c: '#F59E0B' }, { l: '5-yr gain', v: '₹14.2L', c: '#10B981' }, { l: 'Monthly +', v: '₹23.6K', c: '#51B1E7' }].map(function(s, i) {
                    return (
                      <div key={i} style={{ padding: '9px 12px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <div style={{ fontFamily: F_MONO, fontSize: '8px', color: 'var(--text-4)', letterSpacing: '0.1em', marginBottom: '3px', textTransform: 'uppercase' }}>{s.l}</div>
                        <div style={{ fontFamily: F_MONO, fontSize: '1rem', color: s.c, fontWeight: '700', letterSpacing: '-0.02em' }}>{s.v}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>

            {/* Resume AI — tall */}
            <Card accentColor="#10B981" style={{ gridColumn: isMobile ? '1' : '3 / 4', gridRow: isMobile ? 'auto' : '1 / 3', minHeight: isMobile ? 'auto' : '500px' }}>
              <div style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Brain size={20} color="#10B981" />
                </div>
                <h3 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: '1.3rem', letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '8px' }}>Resume AI</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', fontFamily: F_BODY, marginBottom: '20px', flex: isMobile ? 0 : 1 }}>
                  Upload your resume. AI reads your actual background and maps it to India's 2026 job market.
                </p>
                {['Top Cert Recommendation', 'Second Best Option', 'Third Choice'].map(function(cert, i) {
                  return (
                    <div key={i} style={{ padding: '10px 13px', borderRadius: '8px', background: i === 0 ? 'rgba(16,185,129,0.08)' : 'var(--bg)', border: '1px solid ' + (i === 0 ? 'rgba(16,185,129,0.22)' : 'var(--border)'), marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: i === 0 ? '#10B981' : 'var(--text-3)', fontFamily: F_HEAD, fontWeight: '600' }}>{cert}</span>
                      {i === 0 ? <span style={{ fontSize: '8px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', color: '#10B981', fontFamily: F_MONO }}>★ PRIMARY</span> : null}
                    </div>
                  )
                })}
                <button onClick={onEnter}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#10B981', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: F_HEAD, marginTop: '16px', minHeight: '44px', padding: 0 }}>
                  Analyse my resume <ChevronRight size={13} />
                </button>
              </div>
            </Card>

            {/* Stats block — replaces MoneyCounter */}
            <Card>
              <div style={{ padding: '24px' }}>
                <div style={{ fontFamily: F_MONO, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '20px' }}>By the numbers</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { v: '103', l: 'Certifications tracked', c: '#6366F1' },
                    { v: '8',   l: 'Indian cities covered',  c: '#10B981' },
                    { v: '17',  l: 'Career domains',         c: '#F59E0B' },
                    { v: '<2s', l: 'AI analysis speed',      c: '#51B1E7' },
                  ].map(function(s, i) {
                    return (
                      <div key={i}>
                        <div style={{ fontFamily: F_MONO, fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.04em', color: s.c }}>{s.v}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: F_BODY, marginTop: '3px', lineHeight: '1.3' }}>{s.l}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>

            {/* India-specific */}
            <Card accentColor="#51B1E7">
              <div style={{ padding: '24px' }}>
                <div style={{ fontFamily: F_MONO, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px' }}>Data sources</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['LinkedIn Economic Graph India', 'NASSCOM 2026 Talent Survey', 'Naukri Salary Insights', 'AmbitionBox Self-Reported Data'].map(function(src, i) {
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-3)', fontFamily: F_BODY }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#51B1E7', flexShrink: 0 }} />
                        {src}
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>

          </div>
        </div>

        {/* ── 11PM MOMENTS ── */}
        <div style={{ maxWidth: '1020px', margin: '0 auto 80px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.04em' }}>
              We know what you're{' '}
              <span style={{ color: '#6366F1' }}>going through right now</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: '14px' }}>
            {[
              { time: '11:47 PM', name: 'Rohan, 27 · Pune',       color: '#10B981', msg: "Ex-classmate just got promoted to Senior Cloud Architect. ₹28L CTC. You're at ₹9L. Same college, same year.", thought: '"Should I do AWS? Or is it too late?"', answer: 'AWS SAA break-even at ₹9L salary: 6 months. 5-year gain: ₹14.2L. Not too late.' },
              { time: '11:12 PM', name: 'Sneha, 31 · Bangalore',  color: '#F59E0B', msg: "Ops manager for 6 years. Every data job says '3 years experience in data science required.'", thought: '"Is the switch even possible without an MBA?"', answer: 'Google Data Analytics + 2 GitHub projects. 5 months. ₹8L → ₹12L first switch.' },
              { time: '12:03 AM', name: 'Arjun, 22 · Fresh grad', color: '#818CF8', msg: 'Opened 3 cert comparison articles. All recommend AWS. All written by Americans. All show USD.', thought: '"Which cert actually gets me placed in India?"', answer: 'Student Mode. India-specific. GCP got 47 Pune freshers placed in Q1 2026.' },
            ].map(function(card, i) {
              return (
                <Card key={i} accentColor={card.color} onClick={onEnter}>
                  <div style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span style={{ fontSize: '10px', fontFamily: F_MONO, color: 'var(--text-4)', background: 'var(--bg)', padding: '3px 8px', borderRadius: '5px', border: '1px solid var(--border)' }}>{card.time}</span>
                      <span style={{ fontSize: '11px', color: card.color, fontFamily: F_MONO, fontWeight: '700' }}>{card.name}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', marginBottom: '12px', fontFamily: F_BODY }}>{card.msg}</p>
                    <div style={{ padding: '10px 12px', borderRadius: '8px', background: card.color + '0e', border: '1px solid ' + card.color + '22', marginBottom: '12px' }}>
                      <p style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '700', fontFamily: F_HEAD, fontStyle: 'italic', letterSpacing: '-0.02em', margin: 0 }}>{card.thought}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: card.color, marginTop: 6, flexShrink: 0 }} />
                      <p style={{ fontSize: '13px', color: card.color, fontWeight: '600', fontFamily: F_HEAD, margin: 0, lineHeight: '1.5' }}>{card.answer}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: card.color, fontSize: '12px', fontWeight: '700', fontFamily: F_HEAD, marginTop: '16px' }}>
                      That's me tonight <ArrowRight size={12} />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* ── VS OTHER SITES ── */}
        <div style={{ maxWidth: '860px', margin: '0 auto 80px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.04em' }}>
              Every other site is{' '}
              <span style={{ color: '#EF4444' }}>lying to you</span>
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-3)', maxWidth: '500px', margin: '0 auto', fontFamily: F_BODY, lineHeight: '1.7' }}>
              US salary data dressed as India data. Affiliate-commission rankings. Vague "career growth" promises.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: '12px' }}>
            {[
              { bad: '"AWS is good for cloud engineers"',    good: 'AWS SAA at ₹9L salary: break-even 6 months, ₹14.2L gain', color: '#10B981' },
              { bad: '"Upskill for career growth"',          good: '₹23,600 extra per month starting month 7',                 color: '#6366F1' },
              { bad: 'US salary data converted to rupees',   good: 'Naukri + AmbitionBox + LinkedIn India 2026',               color: '#F59E0B' },
              { bad: 'Same advice for everyone',             good: 'AI reads your resume, your city, your background',         color: '#51B1E7' },
            ].map(function(item, i) {
              return (
                <Card key={i} accentColor={item.color}>
                  <div style={{ padding: '20px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: F_BODY, marginBottom: '10px', textDecoration: 'line-through', opacity: 0.55 }}>
                      {item.bad}
                    </div>
                    <div style={{ fontSize: '14px', color: item.color, fontWeight: '700', fontFamily: F_HEAD, letterSpacing: '-0.01em', lineHeight: '1.4' }}>
                      {item.good}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* ── THREE MODES ── */}
        <div style={{ maxWidth: '680px', margin: '0 auto 80px', padding: '0 24px' }}>
          <div style={{ padding: '44px 36px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.12em', marginBottom: '8px', textTransform: 'uppercase' }}>Adapts to who you are</div>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', color: 'var(--text)', marginBottom: '28px', letterSpacing: '-0.04em' }}>
              Three modes. <span style={{ color: '#6366F1' }}>One tool.</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '28px' }}>
              {[
                { icon: GraduationCap, color: '#818CF8', label: 'Student',      sub: 'No job yet',      desc: 'Path to ₹4.8L first offer' },
                { icon: Repeat,        color: '#F59E0B', label: 'Switcher',     sub: 'Changing fields', desc: 'Bridge the skill gap' },
                { icon: Briefcase,     color: '#10B981', label: 'Professional', sub: 'Levelling up',    desc: 'Max ROI on next cert' },
              ].map(function(m, i) {
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -3 }}
                    style={{ padding: '18px 12px', borderRadius: '10px', background: m.color + '0a', border: '1px solid ' + m.color + '22', cursor: 'pointer' }}
                  >
                    <m.icon size={isMobile ? 18 : 22} color={m.color} style={{ margin: '0 auto 10px', display: 'block' }} />
                    <div style={{ fontSize: 'clamp(11px,1.6vw,13px)', fontWeight: '700', color: m.color, marginBottom: '2px', fontFamily: F_HEAD, letterSpacing: '-0.02em' }}>{m.label}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-4)', marginBottom: '4px', fontFamily: F_MONO }}>{m.sub}</div>
                    {!isMobile ? <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: F_BODY }}>{m.desc}</div> : null}
                  </motion.div>
                )
              })}
            </div>

            <motion.button onClick={onEnter}
              whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(99,102,241,0.28)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              style={{ fontSize: '15px', padding: '14px 36px', display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '10px', fontFamily: F_HEAD, fontWeight: '700', letterSpacing: '-0.02em', background: '#6366F1', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.22)' }}
            >
              <Zap size={15} /> Pick My Mode
            </motion.button>
          </div>
        </div>

        {/* ── SOCIAL PROOF ── */}
        <div style={{ maxWidth: '1020px', margin: '0 auto 80px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.04em' }}>
              They used the data.{' '}
              <span style={{ color: '#10B981' }}>It worked.</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: '16px' }}>
            {[
              { name: 'Priya S.',  role: 'Engineer → Cloud Architect', city: 'Bangalore', text: 'CertifyROI said AWS SAA break-even was 8 months. It was 7. Switched companies 7 months in. ₹6L hike.',         hike: '+₹6L/yr',   color: '#10B981' },
              { name: 'Rahul M.',  role: 'Ops Manager → Data Analyst',  city: 'Hyderabad', text: 'Was about to do an MBA. Resume AI showed me Google Analytics gets me there in 5 months at 1% of the cost.',   hike: 'Saved ₹12L', color: '#6366F1' },
              { name: 'Ananya K.', role: 'Fresh Graduate',               city: 'Pune',      text: 'Student Mode showed GCP had faster placement for freshers in Pune. Got ₹5.2L offer. No salary field needed.', hike: '₹5.2L offer', color: '#818CF8' },
            ].map(function(t, i) {
              return (
                <Card key={i} accentColor={t.color}>
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                      {[1,2,3,4,5].map(function(s) { return <Star key={s} size={12} color="#F59E0B" fill="#F59E0B" /> })}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.75', marginBottom: '18px', fontFamily: F_BODY }}>"{t.text}"</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', fontFamily: F_HEAD, letterSpacing: '-0.02em' }}>{t.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '2px', fontFamily: F_BODY }}>{t.role} · {t.city}</div>
                      </div>
                      <div style={{ fontFamily: F_MONO, fontSize: '1.2rem', fontWeight: '700', color: t.color, letterSpacing: '-0.03em' }}>{t.hike}</div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* ── FINAL CTA ── */}
        <div style={{ maxWidth: '680px', margin: '0 auto 80px', padding: '0 24px' }}>
          <div style={{ padding: '56px 40px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
            <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(1.8rem,4.5vw,3rem)', color: 'var(--text)', marginBottom: '14px', letterSpacing: '-0.04em', lineHeight: 1 }}>
              2 minutes from now<br />
              <span style={{ color: '#6366F1' }}>you'll know the answer</span>
            </h2>
            <p style={{ fontSize: 'clamp(14px,2vw,16px)', color: 'var(--text-3)', lineHeight: '1.8', fontFamily: F_BODY, maxWidth: '400px', margin: '0 auto 36px' }}>
              Stop reading about certs. Stop asking Reddit.{' '}
              <strong style={{ color: 'var(--text)', fontFamily: F_HEAD }}>Run the numbers.</strong>
            </p>
            <motion.button onClick={onEnter}
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              style={{ fontSize: 'clamp(15px,2.2vw,17px)', padding: '16px 44px', display: 'inline-flex', alignItems: 'center', gap: '10px', borderRadius: '10px', fontFamily: F_HEAD, fontWeight: '700', letterSpacing: '-0.02em', background: '#6366F1', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.22)' }}
            >
              Run My Numbers <ArrowRight size={18} />
            </motion.button>
            <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '16px', fontFamily: F_MONO, letterSpacing: '0.06em' }}>
              FREE · NO CARD · NO SIGNUP · NO PAYWALLS
            </div>
          </div>
        </div>

        {/* ── PAGE FOOTER ── */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', marginBottom: '10px' }}>
            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#6366F1,#4338CA)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={14} color="white" />
            </div>
            <span style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: '18px', letterSpacing: '-0.03em', color: 'var(--text)' }}>
              Certify<span style={{ color: '#6366F1' }}>ROI</span>
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