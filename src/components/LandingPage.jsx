import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────
function useIsMobile() {
  var [mobile, setMobile] = useState(function () {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false
  })
  useEffect(function () {
    function check() { setMobile(window.innerWidth < 768) }
    window.addEventListener('resize', check)
    return function () { window.removeEventListener('resize', check) }
  }, [])
  return mobile
}

function useInView(threshold) {
  threshold = threshold || 0.15
  var ref = useRef(null)
  var [inView, setInView] = useState(false)
  useEffect(function () {
    var el = ref.current
    if (!el) return
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: threshold })
    obs.observe(el)
    return function () { obs.disconnect() }
  }, [threshold])
  return [ref, inView]
}

// ─────────────────────────────────────────────────────────
// DESIGN TOKENS — light only, permanent
// ─────────────────────────────────────────────────────────
var FH   = "'Inter', sans-serif"
var FM   = "'JetBrains Mono', 'Courier New', monospace"
var FSER = "'EB Garamond', Georgia, serif"

var C = {
  bg:           '#FAFAF8',
  surface:      '#F5F3EF',
  surfaceHigh:  '#EDEAE5',
  text:         '#1A1916',
  text2:        '#5C5A56',
  text3:        '#8C8A86',
  text4:        '#B4B2AE',
  green:        '#2D6A4F',
  greenL:       '#4A8C6A',
  gold:         '#9A7235',
  goldL:        '#B89050',
  err:          '#7A2C2C',
  line:         '#D6D3CE',
  lineHeavy:    '#B8B5B0',
  border:       'rgba(26,25,22,0.09)',
  borderMid:    'rgba(26,25,22,0.14)',
  borderStrong: 'rgba(26,25,22,0.20)',
  btnFill:      '#1A1916',
  btnText:      '#FAFAF8',
}

// ─────────────────────────────────────────────────────────
// MOTION VARIANTS
// ─────────────────────────────────────────────────────────
var RISE = {
  hidden: { y: 20, opacity: 0 },
  show:   { y: 0,  opacity: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
}
var SLIDE_L = {
  hidden: { x: -32, opacity: 0 },
  show:   { x: 0,   opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}

// ─────────────────────────────────────────────────────────
// COMPASS — bottom-right corner only, smaller, quieter
// Brand motif, not hero centerpiece
// ─────────────────────────────────────────────────────────
function CompassCorner({ size }) {
  size = size || 220
  var cx = size / 2
  var cy = size / 2
  var R  = size * 0.44
  var r1 = size * 0.34
  var r2 = size * 0.22
  var r3 = size * 0.12
  var so = 'rgba(26,25,22,0.06)'
  var si = 'rgba(26,25,22,0.035)'

  return (
    <svg
      width={size} height={size}
      viewBox={'0 0 ' + size + ' ' + size}
      fill="none" aria-hidden="true"
      style={{ display: 'block', pointerEvents: 'none' }}
    >
      <circle cx={cx} cy={cy} r={R} stroke={so} strokeWidth="0.7" />
      {Array.from({ length: 36 }).map(function (_, i) {
        var deg = i * 10
        var rad = (deg - 90) * Math.PI / 180
        var isCard  = deg % 90 === 0
        var isInter = deg % 45 === 0 && !isCard
        var tl = isCard ? 10 : isInter ? 6 : 3
        var x1 = cx + R * Math.cos(rad)
        var y1 = cy + R * Math.sin(rad)
        var x2 = cx + (R - tl) * Math.cos(rad)
        var y2 = cy + (R - tl) * Math.sin(rad)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isCard ? so : si} strokeWidth={isCard ? 0.8 : 0.45} />
      })}
      <circle cx={cx} cy={cy} r={r1} stroke={si} strokeWidth="0.55" />
      <circle cx={cx} cy={cy} r={r2} stroke={si} strokeWidth="0.45" />
      <circle cx={cx} cy={cy} r={r3} stroke={si} strokeWidth="0.45" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(function (deg) {
        var rad = (deg - 90) * Math.PI / 180
        var isMain = deg % 90 === 0
        return (
          <line key={deg}
            x1={cx} y1={cy}
            x2={cx + r1 * Math.cos(rad)} y2={cy + r1 * Math.sin(rad)}
            stroke={isMain ? so : si}
            strokeWidth={isMain ? 0.55 : 0.35}
          />
        )
      })}
      {[0, 90, 180, 270].map(function (deg) {
        var rad  = (deg - 90) * Math.PI / 180
        var radL = (deg - 90 - 5) * Math.PI / 180
        var radR = (deg - 90 + 5) * Math.PI / 180
        var tx = cx + R * 0.84 * Math.cos(rad)
        var ty = cy + R * 0.84 * Math.sin(rad)
        var lx = cx + r2 * 0.76 * Math.cos(radL)
        var ly = cy + r2 * 0.76 * Math.sin(radL)
        var rx = cx + r2 * 0.76 * Math.cos(radR)
        var ry = cy + r2 * 0.76 * Math.sin(radR)
        return (
          <polygon key={deg}
            points={tx+','+ty+' '+lx+','+ly+' '+cx+','+cy+' '+rx+','+ry}
            fill="rgba(26,25,22,0.025)" stroke={so} strokeWidth="0.45" strokeLinejoin="round"
          />
        )
      })}
      <circle cx={cx} cy={cy} r="3.5" fill="none" stroke={so} strokeWidth="0.7" />
      <circle cx={cx} cy={cy} r="1.2" fill="rgba(26,25,22,0.07)" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// SUMMIT MARK — abstract angular mountain cue
// Three angular lines forming a peak silhouette.
// Used once: below the hero headline as a quiet brand accent.
// Not decorative art — minimal geometric notation.
// ─────────────────────────────────────────────────────────
function SummitMark({ width, color }) {
  width = width || 64
  color = color || C.lineHeavy
  var h = width * 0.52
  return (
    <svg width={width} height={h} viewBox={'0 0 ' + width + ' ' + h} fill="none" aria-hidden="true" style={{ display: 'block' }}>
      {/* Left face */}
      <path d={'M 0 ' + h + ' L ' + (width * 0.5) + ' ' + (h * 0.06)} stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      {/* Right face */}
      <path d={'M ' + width + ' ' + h + ' L ' + (width * 0.5) + ' ' + (h * 0.06)} stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      {/* Mid ridge — left shoulder */}
      <path d={'M ' + (width * 0.28) + ' ' + (h * 0.55) + ' L ' + (width * 0.5) + ' ' + (h * 0.06)} stroke={color} strokeWidth="0.5" strokeOpacity="0.45" strokeLinecap="round" />
      {/* Contour tick at summit */}
      <circle cx={width * 0.5} cy={h * 0.06} r="1.8" fill={color} fillOpacity="0.55" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// SHARED BUTTON COMPONENTS
// ─────────────────────────────────────────────────────────
function PrimaryBtn({ onClick, children, large }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.975 }}
      transition={{ duration: 0.14 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: large ? '0 36px' : '0 24px',
        height: large ? '52px' : '44px',
        borderRadius: '5px', border: 'none',
        background: C.btnFill, color: C.btnText,
        fontSize: large ? '15px' : '14px',
        fontFamily: FH, fontWeight: '500',
        letterSpacing: '-0.01em',
        cursor: 'pointer',
      }}
    >
      {children}
    </motion.button>
  )
}

function GhostBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '0 20px', height: '44px',
        borderRadius: '5px',
        border: '1px solid ' + C.borderMid,
        background: 'transparent',
        color: C.text2,
        fontSize: '14px', fontFamily: FH, fontWeight: '400',
        cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s',
      }}
      onMouseEnter={function (e) { e.currentTarget.style.borderColor = C.text3; e.currentTarget.style.color = C.text }}
      onMouseLeave={function (e) { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.text2 }}
    >
      {children}
    </button>
  )
}

// ─────────────────────────────────────────────────────────
// WAYPOINT DOT
// ─────────────────────────────────────────────────────────
function WaypointDot({ filled, color }) {
  color = color || C.green
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="9" cy="9" r="7.5" stroke={color} strokeWidth="1" strokeOpacity={filled ? 0.28 : 0.18} />
      <circle cx="9" cy="9" r="3.5" fill={filled ? color : 'none'} stroke={color} strokeWidth="1" strokeOpacity={filled ? 1 : 0.32} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// TRUST STRIP — redesigned
// Bigger type, more breathing room, true mono precision
// Two-row structure: items with elevation markers between them
// Slower scroll, stronger visual weight
// ─────────────────────────────────────────────────────────
function TrustStrip() {
  var items = [
    { stat: '₹2.4L/yr',  label: 'AWS median uplift · Bangalore' },
    { stat: '7 months',  label: 'Average PMP payback period'    },
    { stat: '38%',       label: 'Hyderabad cloud demand growth' },
    { stat: '₹14.2L',   label: '5-year AWS gain · ₹9L salary'  },
    { stat: '103 certs', label: 'Indexed across 17 domains'     },
    { stat: '₹3.2L',    label: 'Google Analytics annual gain'   },
    { stat: '47',        label: 'GCP freshers placed · Pune Q1 2026' },
    { stat: '₹4.8L',    label: 'CFA Level 1 uplift · Mumbai'   },
  ]

  return (
    <div style={{
      borderTop:    '1px solid ' + C.border,
      borderBottom: '1px solid ' + C.border,
      background:   C.surface,
      padding:      '0',
      overflow:     'hidden',
    }}>
      {/* Top rule accent */}
      <div style={{ height: '2px', background: C.surfaceHigh }} />

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 72, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', width: 'max-content', alignItems: 'stretch' }}
      >
        {[...items, ...items].map(function (item, i) {
          return (
            <div key={i} style={{
              display:        'flex',
              flexDirection:  'column',
              justifyContent: 'center',
              padding:        '20px 40px',
              borderRight:    '1px solid ' + C.border,
              flexShrink:     0,
              minWidth:       '220px',
            }}>
              <div style={{
                fontFamily:    FM,
                fontSize:      '18px',
                fontWeight:    '500',
                color:         C.text,
                letterSpacing: '-0.03em',
                lineHeight:    1,
                marginBottom:  '5px',
              }}>
                {item.stat}
              </div>
              <div style={{
                fontFamily:    FM,
                fontSize:      '10px',
                color:         C.text3,
                letterSpacing: '0.04em',
                lineHeight:    1.3,
              }}>
                {item.label}
              </div>
            </div>
          )
        })}
      </motion.div>

      <div style={{ height: '2px', background: C.surfaceHigh }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CERT ASSEMBLY — light mode only, clean surfaces
// ─────────────────────────────────────────────────────────
function CertAssembly() {
  var isMobile = useIsMobile()
  var trackRef    = useRef(null)
  var { scrollY } = useScroll()
  var [prog, setProg] = useState(0)

  useEffect(function () {
    function update() {
      var el = trackRef.current
      if (!el) return
      var rect  = el.getBoundingClientRect()
      var total = el.offsetHeight - window.innerHeight
      var p     = Math.max(0, Math.min(1, -rect.top / total))
      setProg(p)
    }
    var unsub = scrollY.on('change', update)
    update()
    return unsub
  }, [scrollY])

  function remap(p, a, b, c, d) {
    return c + (d - c) * Math.max(0, Math.min(1, (p - a) / (b - a)))
  }

  var p8 = remap(prog, 0, 0.8, 0, 1)
  var l1, l2
  if (isMobile) {
    l1 = 'translateY(' + remap(p8, 0, 1, -50, 0) + 'px) rotateZ(' + remap(p8, 0, 1, 3, 0) + 'deg)'
    l2 = 'translateY(' + remap(p8, 0, 1, 50, 0)  + 'px) rotateZ(' + remap(p8, 0, 1, -2, 0) + 'deg)'
  } else {
    l1 = 'perspective(1200px) translateZ('+remap(p8,0,1,-280,0)+'px) translateY('+remap(p8,0,1,-80,0)+'px) rotateY('+remap(p8,0,1,32,0)+'deg) rotateX('+remap(p8,0,1,15,0)+'deg)'
    l2 = 'perspective(1200px) translateZ('+remap(p8,0,1,280,0)+'px) translateY('+remap(p8,0,1,80,0)+'px) rotateY('+remap(p8,0,1,-26,0)+'deg) rotateX('+remap(p8,0,1,-12,0)+'deg)'
  }

  var certScale   = prog < 0.8 ? remap(prog,0,0.8,0.62,1.0) : remap(prog,0.8,1.0,1.0,0.85)
  var certOpacity = prog < 0.05 ? remap(prog,0,0.05,0,1) : prog > 0.85 ? remap(prog,0.85,1.0,1,0) : 1
  var overlayOp   = prog < 0.08 ? remap(prog,0,0.08,0,0.94) : prog > 0.92 ? remap(prog,0.92,1,0.94,0) : 0.94
  var hintOp      = prog > 0.16 ? 0 : prog > 0.06 ? remap(prog,0.06,0.16,1,0) : 1
  var assembledOp = remap(prog,0.78,0.88,0,1)

  return (
    <div ref={trackRef} style={{ height: '300vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: C.bg, opacity: overlayOp }} />

        <div style={{ position: 'relative', zIndex: 4 }}>
          <div style={{ transform: 'scale(' + certScale + ')', opacity: certOpacity }}>
            <div style={{
              position: 'relative',
              width:  isMobile ? 'min(320px,88vw)' : 'min(480px,88vw)',
              height: 'calc('+(isMobile?'min(320px,88vw)':'min(480px,88vw)')+' / 1.414)',
              transformStyle: 'preserve-3d',
            }}>
              <div style={{ position: 'absolute', inset: 0, transform: l1 }}>
                <svg viewBox="0 0 480 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0, display: 'block' }}>
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"   stopColor={C.green} />
                      <stop offset="50%"  stopColor={C.greenL} />
                      <stop offset="100%" stopColor={C.gold} />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="480" height="340" rx="4" fill="#FEFEFE" fillOpacity="0.99" />
                  <rect x="1" y="1" width="478" height="338" rx="3.5" fill="none" stroke="url(#cg)" strokeWidth="1.2" />
                  <rect x="8" y="8" width="464" height="324" rx="2" fill="none" stroke={C.border} strokeWidth="0.6" />
                  {[[18,18],[462,18],[18,322],[462,322]].map(function (arr, i) {
                    var cx2 = arr[0], cy2 = arr[1]
                    return (
                      <g key={i}>
                        <circle cx={cx2} cy={cy2} r="3.5" fill="none" stroke={C.green} strokeWidth="1" />
                        <circle cx={cx2} cy={cy2} r="7"   fill="none" stroke={C.green} strokeWidth="0.45" strokeOpacity="0.2" />
                        <line x1={cx2-9} y1={cy2} x2={cx2+9} y2={cy2} stroke={C.green} strokeWidth="0.45" strokeOpacity="0.25" />
                        <line x1={cx2} y1={cy2-9} x2={cx2} y2={cy2+9} stroke={C.green} strokeWidth="0.45" strokeOpacity="0.25" />
                      </g>
                    )
                  })}
                  <line x1="40"  y1="1"   x2="90"  y2="1"   stroke={C.green} strokeWidth="2.5" />
                  <line x1="390" y1="1"   x2="440" y2="1"   stroke={C.gold}  strokeWidth="2.5" />
                  <line x1="40"  y1="339" x2="90"  y2="339" stroke={C.gold}  strokeWidth="2.5" />
                  <line x1="390" y1="339" x2="440" y2="339" stroke={C.green} strokeWidth="2.5" />
                </svg>
              </div>

              <div style={{
                position: 'absolute', inset: 0, transform: l2,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: 'clamp(16px,4vw,36px)',
              }}>
                <div style={{ fontFamily: FM, fontSize: '8px', color: 'rgba(45,106,79,0.5)', letterSpacing: '0.28em', marginBottom: '11px', textTransform: 'uppercase' }}>
                  CERTIFYROI · INDIA 2026
                </div>
                <div style={{ fontFamily: FSER, fontWeight: '500', fontStyle: 'italic', fontSize: 'clamp(0.95rem,3.2vw,1.75rem)', letterSpacing: '-0.01em', color: C.text, marginBottom: '5px', textAlign: 'center', lineHeight: 1.1 }}>
                  ROI Report
                </div>
                <div style={{ fontFamily: FH, fontSize: 'clamp(10px,1.4vw,12px)', color: C.text3, marginBottom: '22px', textAlign: 'center' }}>
                  Personalised analysis · Your city · Your salary
                </div>
                <div style={{ display: 'flex', gap: 'clamp(10px,4vw,40px)', marginBottom: '18px' }}>
                  {[
                    { label: 'PAYBACK',      value: '9 mo',   color: C.green },
                    { label: '5-YR GAIN',    value: '₹14.2L', color: C.gold  },
                    { label: 'SALARY DELTA', value: '+35%',   color: C.greenL },
                  ].map(function (s, i) {
                    return (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: FM, fontSize: '7px', color: C.text4, letterSpacing: '0.1em', marginBottom: '5px' }}>{s.label}</div>
                        <div style={{ fontFamily: FM, fontSize: 'clamp(0.8rem,2.4vw,1.4rem)', color: s.color, fontWeight: '500', letterSpacing: '-0.03em' }}>{s.value}</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ width: '70%', height: '0.75px', background: C.border, marginBottom: '11px' }} />
                <div style={{ fontFamily: FM, fontSize: '7px', color: C.text4, letterSpacing: '0.12em', textAlign: 'center' }}>
                  VERIFIED · DATA: NAUKRI MARCH 2026
                </div>
              </div>
            </div>
          </div>

          <div style={{ opacity: hintOp, marginTop: '40px', textAlign: 'center', pointerEvents: 'none', transition: 'opacity 0.3s' }}>
            <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
              <div style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                ↓  scroll to build your report  ↓
              </div>
            </motion.div>
          </div>
        </div>

        <div style={{ opacity: assembledOp, position: 'absolute', bottom: '8%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 5 }}>
          <div style={{ fontFamily: FM, fontSize: '11px', color: C.green, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            ✓  ROI REPORT · READY
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// COUNT-UP
// ─────────────────────────────────────────────────────────
function CountUp({ end, prefix, suffix, duration }) {
  duration = duration || 1.8
  var [count, setCount] = useState(0)
  var [on, setOn] = useState(false)
  useEffect(function () {
    if (!on) return
    var endVal = parseFloat(String(end).replace(/[^0-9.]/g, ''))
    var frames = Math.round(duration * 60)
    var f = 0
    var t = setInterval(function () {
      f++
      var ease = 1 - Math.pow(1 - f / frames, 3)
      setCount(endVal * ease)
      if (f >= frames) { setCount(endVal); clearInterval(t) }
    }, 1000 / 60)
    return function () { clearInterval(t) }
  }, [on, end, duration])
  return (
    <motion.span onViewportEnter={function () { setOn(true) }}>
      {prefix}{count.toLocaleString('en-IN', { maximumFractionDigits: String(end).includes('.') ? 1 : 0 })}{suffix}
    </motion.span>
  )
}

// ─────────────────────────────────────────────────────────
// DATA COMPOSITION
// ─────────────────────────────────────────────────────────
function DataComposition({ isMobile }) {
  return (
    <div style={{ paddingTop: isMobile ? '72px' : '96px', paddingBottom: isMobile ? '72px' : '96px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>
          The numbers behind every recommendation
        </motion.div>

        <motion.div variants={SLIDE_L} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ marginBottom: isMobile ? '56px' : '88px' }}>
          <div style={{ fontFamily: FM, fontSize: 'clamp(3rem,13vw,7.5rem)', color: C.gold, lineHeight: 1, letterSpacing: '-0.045em', fontWeight: '500' }}>
            <CountUp end={14.2} prefix="₹" suffix="L" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginTop: '14px', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: FSER, fontStyle: 'italic', fontSize: 'clamp(1rem,2.4vw,1.35rem)', color: C.text2 }}>
              5-year net gain · AWS Solutions Architect
            </div>
            <div style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Bangalore median · 2026
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', borderTop: '1px solid ' + C.border }}>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ padding: isMobile ? '40px 0' : '56px 64px 56px 0', borderBottom: isMobile ? '1px solid '+C.border : 'none', borderRight: isMobile ? 'none' : '1px solid '+C.border }}>
            <div style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Payback period</div>
            <div style={{ fontFamily: FM, fontSize: 'clamp(2.2rem,7vw,4.2rem)', color: C.text, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '500', marginBottom: '14px' }}>
              <CountUp end={6} suffix=" months" />
            </div>
            <div style={{ fontFamily: FH, fontSize: '15px', color: C.text2, lineHeight: '1.75', maxWidth: '38ch' }}>
              Not "a few months." The exact month your investment turns profitable — calculated for your salary and city.
            </div>
          </motion.div>

          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ padding: isMobile ? '40px 0' : '56px 0 56px 64px' }}>
            <div style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Salary increase</div>
            <div style={{ fontFamily: FM, fontSize: 'clamp(2.2rem,7vw,4.2rem)', color: C.text, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '500', marginBottom: '14px' }}>
              <CountUp end={35} suffix="%" />
            </div>
            <div style={{ fontFamily: FH, fontSize: '15px', color: C.text2, lineHeight: '1.75', maxWidth: '38ch' }}>
              India-sourced. City-specific. Not US data converted at today's rate and called "India salary insights."
            </div>
          </motion.div>
        </div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ borderTop: '1px solid '+C.border, paddingTop: isMobile ? '40px' : '56px', display: 'flex', gap: isMobile ? '20px' : '64px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Monthly gain from month 7</div>
            <div style={{ fontFamily: FM, fontSize: 'clamp(1.6rem,4.5vw,2.8rem)', color: C.green, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '500' }}>₹23,600</div>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>103 certifications analysed</div>
            <div style={{ fontFamily: FH, fontSize: '15px', color: C.text2, lineHeight: '1.8' }}>
              Across 17 domains — cloud, data, finance, medical, law, government. Every certification mapped to real hiring data from Naukri, AmbitionBox, and LinkedIn India.
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────
function HowItWorks({ isMobile, onEnter }) {
  var steps = [
    { label: 'Enter your details', subtitle: 'Certification · salary · city',  desc: 'Search from 340+ indexed certifications. Enter your current salary and role. Upload your resume for AI to read your actual background.', detail: 'No account required.' },
    { label: 'We run the numbers', subtitle: 'Cost · payback · uplift',        desc: 'Total investment, expected salary increase, demand index, and exact payback month — calculated against your specific baseline, not a national average.', detail: 'India market data · 2026' },
    { label: 'Get the report',     subtitle: 'Clear recommendation',            desc: 'Payback period, 5-year net gain, monthly delta, and a plain statement on whether the certification is worth it for your profile.', detail: 'Your numbers. Your decision.' },
  ]
  var [routeRef, routeInView] = useInView(0.25)

  return (
    <div style={{ background: C.surface, borderTop: '1px solid '+C.border, borderBottom: '1px solid '+C.border, paddingTop: isMobile ? '72px' : '96px', paddingBottom: isMobile ? '72px' : '96px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>
          How it works
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FH, fontWeight: '600', fontSize: 'clamp(1.7rem,4vw,2.6rem)', color: C.text, letterSpacing: '-0.025em', lineHeight: 1.1, marginTop: 0, marginBottom: '64px' }}>
          Three steps.<br />One clear answer.
        </motion.h2>

        <div ref={routeRef} style={{ position: 'relative' }}>
          {!isMobile && (
            <div style={{ position: 'absolute', top: '9px', left: '9px', right: '9px', height: '1px', pointerEvents: 'none', zIndex: 0 }}>
              <svg width="100%" height="2" style={{ overflow: 'visible', display: 'block' }}>
                <motion.line x1="0" y1="1" x2="100%" y2="1"
                  stroke={C.green} strokeWidth="0.8" strokeDasharray="6 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={routeInView ? { pathLength: 1, opacity: 0.38 } : {}}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 0, position: 'relative', zIndex: 1 }}>
            {steps.map(function (step, i) {
              var isLast = i === steps.length - 1
              return (
                <motion.div key={step.label} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{
                    paddingLeft:   !isMobile && i > 0  ? 'clamp(24px,3.5vw,48px)' : '0',
                    paddingRight:  !isMobile && i < 2  ? 'clamp(24px,3.5vw,48px)' : '0',
                    paddingTop:    '48px',
                    paddingBottom: isMobile && !isLast ? 'clamp(32px,5vw,48px)' : '0',
                    borderRight:   !isMobile && !isLast ? '1px solid '+C.border : 'none',
                    borderBottom:  isMobile && !isLast  ? '1px solid '+C.border : 'none',
                  }}>
                  <div style={{ marginBottom: '20px' }}><WaypointDot filled={true} /></div>
                  <div style={{ fontFamily: FM, fontSize: '10px', color: C.text4, letterSpacing: '0.12em', marginBottom: '10px' }}>0{i + 1}</div>
                  <div style={{ fontFamily: FH, fontWeight: '600', fontSize: 'clamp(1rem,2.2vw,1.2rem)', color: C.text, letterSpacing: '-0.02em', marginBottom: '5px' }}>{step.label}</div>
                  <div style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>{step.subtitle}</div>
                  <div style={{ fontFamily: FH, fontSize: '14px', color: C.text2, lineHeight: '1.8', marginBottom: '12px' }}>{step.desc}</div>
                  <div style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.05em' }}>{step.detail}</div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.35 }}
          style={{ marginTop: isMobile ? '48px' : '64px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <PrimaryBtn onClick={onEnter}>Calculate ROI <ArrowRight size={15} /></PrimaryBtn>
          <span style={{ fontFamily: FM, fontSize: '11px', color: C.text3, letterSpacing: '0.06em' }}>No signup required</span>
        </motion.div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// VS SECTION
// ─────────────────────────────────────────────────────────
function VsSection({ isMobile }) {
  var pairs = [
    { wrong: '"AWS is good for cloud engineers"',      right: 'AWS SAA at ₹9L salary: payback month 6. ₹14.2L net gain over 5 years. Or it isn\'t worth it.' },
    { wrong: '"Upskill for career growth"',            right: '₹23,600 extra every month from month 7 — compounding over 5 years. In rupees, not "career growth."' },
    { wrong: 'US salary data converted to rupees',     right: 'Naukri · AmbitionBox · LinkedIn India. 2026 data. Collected here, not converted from San Francisco.' },
    { wrong: 'The same advice for every professional', right: 'AI reads your resume. Sees your domain, your city, your experience. Recommends a path specific to you.' },
  ]

  return (
    <div style={{ paddingTop: isMobile ? '72px' : '96px', paddingBottom: isMobile ? '72px' : '96px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>
          The problem with every other source
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FH, fontWeight: '600', fontSize: 'clamp(1.7rem,4vw,2.6rem)', color: C.text, letterSpacing: '-0.025em', lineHeight: 1.1, marginTop: 0, marginBottom: '64px' }}>
          Every other guide<br /><span style={{ color: C.err }}>is pointing you the wrong way.</span>
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '40px' : '52px' }}>
          {pairs.map(function (pair, i) {
            return (
              <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '14px', maxWidth: '100%' }}>
                  <div style={{ fontFamily: FH, fontWeight: '500', fontSize: 'clamp(0.9rem,2vw,1.15rem)', color: C.text, opacity: 0.18, letterSpacing: '-0.01em', lineHeight: 1.4, wordBreak: 'break-word' }}>
                    {pair.wrong}
                  </div>
                  <svg style={{ position: 'absolute', left: 0, top: '50%', width: '100%', height: '2px', overflow: 'visible', pointerEvents: 'none' }}>
                    <motion.line x1="0" y1="0" x2="100%" y2="0"
                      stroke={C.err} strokeWidth="1.2" strokeOpacity="0.3"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.85, delay: 0.2 + i * 0.06, ease: 'easeOut' }}
                    />
                  </svg>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: C.green, marginTop: '10px', flexShrink: 0 }} />
                  <div style={{ fontFamily: FH, fontSize: 'clamp(14px,1.8vw,15px)', color: C.text, lineHeight: '1.75' }}>{pair.right}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// ELEVEN PM
// ─────────────────────────────────────────────────────────
function ElevenPM({ isMobile, onEnter }) {
  var stories = [
    { time: '11:47 PM', name: 'Rohan', loc: 'Pune',      role: '2 yrs · Backend Engineer', thought: '"Should I do AWS? Or is it too late?"',     context: 'Ex-classmate promoted to Cloud Architect. ₹28L CTC. Same college, same year.', answer: 'AWS SAA at ₹9L: payback month 6. 5-year gain ₹14.2L. Not too late.', color: C.green },
    { time: '11:12 PM', name: 'Sneha', loc: 'Bangalore', role: '6 yrs · Ops Manager',       thought: '"Is the switch possible without an MBA?"',  context: 'Every data job requires 3 years of data science experience. She has zero.', answer: 'Google Data Analytics + 2 GitHub projects. 5 months. ₹8L → ₹12L.', color: C.gold },
    { time: '12:03 AM', name: 'Arjun', loc: 'Pune',      role: 'CS · Fresh graduate',       thought: '"Which cert actually gets me placed here?"', context: 'Three articles recommend AWS. All written by Americans. All in USD.', answer: 'Student Mode. India-specific. GCP placed 47 Pune freshers in Q1 2026.', color: C.text2 },
  ]

  return (
    <div style={{ background: C.surface, borderTop: '1px solid '+C.border, borderBottom: '1px solid '+C.border, paddingTop: isMobile ? '72px' : '96px', paddingBottom: isMobile ? '72px' : '96px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>
          Who this is for
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FH, fontWeight: '600', fontSize: 'clamp(1.7rem,4vw,2.6rem)', color: C.text, letterSpacing: '-0.025em', lineHeight: 1.1, marginTop: 0, marginBottom: '64px' }}>
          We know what you're<br />thinking right now.
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 0, borderTop: '1px solid '+C.border }}>
          {stories.map(function (s, i) {
            var isLast = i === stories.length - 1
            return (
              <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                onClick={onEnter}
                style={{ paddingLeft: !isMobile&&i>0?'clamp(24px,3.5vw,48px)':'0', paddingRight: !isMobile&&i<2?'clamp(24px,3.5vw,48px)':'0', paddingTop: 'clamp(32px,5vw,48px)', paddingBottom: 'clamp(32px,5vw,48px)', borderRight: !isMobile&&!isLast?'1px solid '+C.border:'none', borderBottom: isMobile&&!isLast?'1px solid '+C.border:'none', cursor: 'pointer' }}>
                <div style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.08em', marginBottom: '18px' }}>{s.time}</div>
                <div style={{ fontFamily: FSER, fontStyle: 'italic', fontWeight: '400', fontSize: 'clamp(1rem,2.2vw,1.25rem)', color: C.text, lineHeight: 1.4, marginBottom: '18px' }}>{s.thought}</div>
                <div style={{ fontFamily: FH, fontSize: '14px', color: C.text2, lineHeight: '1.75', marginBottom: '22px' }}>
                  <em style={{ fontStyle: 'italic' }}>{s.name}</em>, {s.loc} — {s.role}. {s.context}
                </div>
                <div style={{ width: '24px', height: '1.5px', background: s.color, marginBottom: '14px' }} />
                <div style={{ fontFamily: FH, fontWeight: '500', fontSize: '14px', color: C.text, lineHeight: '1.65' }}>{s.answer}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// THREE MODES
// ─────────────────────────────────────────────────────────
function ThreeModes({ isMobile, onEnter }) {
  var modes = [
    { label: 'Student',      sub: 'No salary yet',    serif: 'Starting out',   desc: 'Path to a ₹4.8L+ first offer. Student Mode reframes ROI around career investment, not salary hike. No salary slider needed.' },
    { label: 'Switcher',     sub: 'Changing domains', serif: 'New direction',   desc: 'Domain switch in 5–8 months with the right certification. Only fast-track options shown. Long certs hidden unless you ask.' },
    { label: 'Professional', sub: 'Levelling up',     serif: 'Higher salary',  desc: 'Maximum ROI on your next cert. Break-even analysis, city benchmarks, and a pitch-your-employer email if your company sponsors it.' },
  ]

  return (
    <div style={{ paddingTop: isMobile ? '72px' : '96px', paddingBottom: isMobile ? '72px' : '96px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>
          Choose your path
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FH, fontWeight: '600', fontSize: 'clamp(1.7rem,4vw,2.6rem)', color: C.text, letterSpacing: '-0.025em', lineHeight: 1.1, marginTop: 0, marginBottom: '64px' }}>
          Three profiles.<br /><span style={{ color: C.green }}>One tool.</span>
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 0, borderTop: '1px solid '+C.border, position: 'relative' }}>
          {!isMobile && (
            <>
              <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: '1px', background: C.border }} />
              <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: '1px', background: C.border }} />
            </>
          )}
          {modes.map(function (m, i) {
            var isLast = i === modes.length - 1
            return (
              <motion.div key={m.label} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ padding: 'clamp(32px,5vw,52px) 0', paddingLeft: !isMobile&&i>0?'clamp(24px,3.5vw,48px)':'0', paddingRight: !isMobile&&i<2?'clamp(24px,3.5vw,48px)':'0', borderBottom: isMobile&&!isLast?'1px solid '+C.border:'none' }}>
                <div style={{ marginBottom: '20px' }}><WaypointDot filled={false} /></div>
                <div style={{ fontFamily: FSER, fontStyle: 'italic', fontSize: '17px', color: C.text3, marginBottom: '5px' }}>{m.serif}</div>
                <div style={{ fontFamily: FH, fontWeight: '600', fontSize: 'clamp(1rem,2vw,1.2rem)', color: C.text, letterSpacing: '-0.02em', marginBottom: '5px' }}>{m.label}</div>
                <div style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>{m.sub}</div>
                <div style={{ fontFamily: FH, fontSize: '14px', color: C.text2, lineHeight: '1.8' }}>{m.desc}</div>
              </motion.div>
            )
          })}
        </div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.35 }}
          style={{ marginTop: isMobile ? '48px' : '64px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <PrimaryBtn onClick={onEnter}>Get started <ArrowRight size={15} /></PrimaryBtn>
          <span style={{ fontFamily: FM, fontSize: '11px', color: C.text3, letterSpacing: '0.06em' }}>No account required</span>
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SOCIAL PROOF
// ─────────────────────────────────────────────────────────
function SocialProof({ isMobile }) {
  var quotes = [
    { quote: 'CertifyROI said payback was month 8. It was month 7. Switched companies immediately. ₹6L hike.', name: 'Priya S.', detail: 'Bangalore · Engineer → Cloud Architect', hike: '+₹6L/yr', color: C.green },
    { quote: 'Was about to spend ₹12L on an MBA. The analysis showed a different path — 5 months, 1% of the cost, same outcome.', name: 'Rahul M.', detail: 'Hyderabad · Ops Manager → Data Analyst', hike: 'Saved ₹12L', color: C.gold },
    { quote: 'Student Mode. India-specific data. GCP placed 47 Pune freshers in Q1 2026. My ₹5.2L offer was one of them.', name: 'Ananya K.', detail: 'Pune · Fresh Graduate', hike: '₹5.2L offer', color: C.text2 },
  ]

  return (
    <div style={{ background: C.surface, borderTop: '1px solid '+C.border, borderBottom: '1px solid '+C.border, paddingTop: isMobile ? '72px' : '96px', paddingBottom: isMobile ? '72px' : '96px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>
          From people who ran the numbers
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FH, fontWeight: '600', fontSize: 'clamp(1.7rem,4vw,2.6rem)', color: C.text, letterSpacing: '-0.025em', lineHeight: 1.1, marginTop: 0, marginBottom: '64px' }}>
          They checked the ROI first.<br /><span style={{ color: C.green }}>It paid off.</span>
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {quotes.map(function (q, i) {
            var isLast = i === quotes.length - 1
            return (
              <motion.div key={i} variants={SLIDE_L} initial="hidden" whileInView="show" viewport={{ once: true }}
                style={{ paddingTop: i>0?isMobile?'48px':'64px':'0', paddingBottom: !isLast?isMobile?'48px':'64px':'0', borderBottom: !isLast?'1px solid '+C.border:'none', display: 'grid', gridTemplateColumns: isMobile?'1fr':'1fr 160px', gap: isMobile?'20px':'56px', alignItems: 'end' }}>
                <div>
                  <div style={{ fontFamily: FSER, fontStyle: 'italic', fontWeight: '400', fontSize: 'clamp(1.1rem,2.8vw,1.75rem)', color: C.text, letterSpacing: '-0.01em', lineHeight: 1.4, marginBottom: '24px' }}>
                    "{q.quote}"
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ width: '20px', height: '1.5px', background: q.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: FH, fontWeight: '500', fontSize: '14px', color: C.text }}>{q.name}</span>
                    <span style={{ fontFamily: FM, fontSize: '11px', color: C.text3 }}>{q.detail}</span>
                  </div>
                </div>
                <div style={{ textAlign: isMobile?'left':'right' }}>
                  <div style={{ fontFamily: FM, fontWeight: '500', fontSize: 'clamp(1.2rem,2.8vw,1.75rem)', color: C.gold, letterSpacing: '-0.04em', lineHeight: 1 }}>{q.hike}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────
var FAQ_ITEMS = [
  { q: 'How accurate are the ROI calculations?', a: 'The calculations are based on median salary data from Naukri, AmbitionBox, and LinkedIn India — updated quarterly. They are directional estimates, not guarantees. Actual outcomes vary by employer, negotiation, location, and demand. Every result screen includes the assumptions used.' },
  { q: 'Do I need to create an account?', a: 'No. The core ROI calculator, comparison tool, and city demand heatmap are all free and require no signup. AI-powered features (resume analysis, personalised recommendations) use free credits, after which a lightweight account is optional.' },
  { q: 'What certifications are covered?', a: '103 certifications across 17 domains — cloud infrastructure, data and analytics, cybersecurity, finance (CFA, CA, CMA), project management, HR, medical, and government-mandated certifications like NISM and SEBI-required qualifications.' },
  { q: 'Is this only useful for India?', a: 'The salary benchmarks and demand data are India-specific — 8 major cities including Bangalore, Hyderabad, Pune, Mumbai, and Delhi. The certification ROI framework applies anywhere, but the numbers are calibrated for the Indian job market.' },
  { q: 'How does the Resume AI work?', a: 'You upload a resume or paste your profile. The AI reads your domain, role, years of experience, and current skill set, then matches you against the certification database to recommend the highest-ROI options for your specific background — not a generic list.' },
  { q: "What if my certification isn't in the database?", a: "You can still use the ROI calculator manually — enter the cert cost, your current salary, and expected hike percentage. The calculator returns payback period and 5-year net gain regardless of whether the cert is indexed." },
]

function FAQItem({ item }) {
  var [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid '+C.border }}>
      <button onClick={function () { setOpen(function (v) { return !v }) }}
        style={{ width: '100%', padding: '22px 0', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontFamily: FH, fontWeight: '500', fontSize: '15px', color: C.text, letterSpacing: '-0.01em', lineHeight: 1.4 }}>{item.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }} style={{ flexShrink: 0 }}>
          <ChevronDown size={16} color={C.text3} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16,1,0.3,1] }} style={{ overflow: 'hidden' }}>
            <div style={{ paddingBottom: '24px', fontFamily: FH, fontSize: '15px', color: C.text2, lineHeight: '1.8', maxWidth: '68ch' }}>{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQ({ isMobile }) {
  return (
    <div style={{ paddingTop: isMobile ? '72px' : '96px', paddingBottom: isMobile ? '72px' : '96px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', gap: isMobile ? '40px' : '96px', alignItems: 'start' }}>
          <div style={{ position: isMobile ? 'static' : 'sticky', top: '96px' }}>
            <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
              style={{ fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>
              Questions
            </motion.div>
            <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
              style={{ fontFamily: FH, fontWeight: '600', fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: C.text, letterSpacing: '-0.025em', lineHeight: 1.15, marginTop: 0 }}>
              Common<br />questions<br />answered.
            </motion.h2>
          </div>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div style={{ borderTop: '1px solid '+C.border }}>
              {FAQ_ITEMS.map(function (item, i) { return <FAQItem key={i} item={item} /> })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// FINAL CTA
// Contour cluster kept — appropriate here, not in hero
// ─────────────────────────────────────────────────────────
function FinalCTA({ isMobile, onEnter }) {
  return (
    <div style={{ background: C.surfaceHigh, borderTop: '1px solid '+C.border, paddingTop: isMobile ? '80px' : '120px', paddingBottom: isMobile ? '80px' : '120px', position: 'relative', overflow: 'hidden' }}>

      {/* Contour cluster — top-right corner only */}
      <div style={{ position: 'absolute', right: '-60px', top: '-60px', pointerEvents: 'none', opacity: 0.42 }}>
        <svg width="340" height="340" viewBox="-170 -170 340 340" aria-hidden="true">
          {[40, 70, 100, 130, 160].map(function (r, i) {
            return (
              <ellipse key={i} cx="0" cy="0" rx={r} ry={r * 0.65}
                fill="none" stroke={C.lineHeavy} strokeWidth="0.7"
                transform="rotate(15)" opacity={i===0 ? 0.6 : 0.38}
              />
            )
          })}
          <ellipse cx="0" cy="0" rx="40" ry="26"
            fill={C.green} fillOpacity="0.04"
            stroke={C.green} strokeWidth="0.7" strokeOpacity="0.22"
            transform="rotate(15)"
          />
        </svg>
      </div>

      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px', position: 'relative', zIndex: 1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FM, fontSize: '11px', color: C.text3, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '28px' }}>
          2 minutes from now
        </motion.div>

        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: FSER, fontStyle: 'italic', fontWeight: '500', fontSize: 'clamp(2.6rem,8vw,5.5rem)', color: C.text, letterSpacing: '-0.02em', lineHeight: 0.96, marginTop: 0, marginBottom: '36px', maxWidth: '16ch' }}>
          You'll know<br />the answer.
        </motion.h2>

        <motion.p variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }}
          style={{ fontFamily: FH, fontSize: 'clamp(14px,2vw,16px)', color: C.text2, lineHeight: '1.85', maxWidth: '40ch', margin: '0 0 44px' }}>
          Stop reading about certifications. Stop asking Reddit.{' '}
          <span style={{ color: C.text, fontWeight: '500' }}>Know the payback period before you pay the fee.</span>
        </motion.p>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.18 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <PrimaryBtn onClick={onEnter} large={true}>Calculate ROI <ArrowRight size={16} /></PrimaryBtn>
            <GhostBtn onClick={onEnter}>See a sample report →</GhostBtn>
          </div>
          <div style={{ fontFamily: FM, fontSize: '11px', color: C.text3, letterSpacing: '0.08em' }}>
            No signup · Free · India salary data 2026
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────
function PageFooter({ isMobile }) {
  return (
    <div style={{ borderTop: '1px solid '+C.border, background: C.bg, padding: isMobile ? '32px 24px' : '36px 80px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontFamily: FH, fontWeight: '600', fontSize: '15px', letterSpacing: '-0.02em', color: C.text }}>Certify</span>
          <span style={{ fontFamily: FSER, fontStyle: 'italic', fontWeight: '400', fontSize: '17px', color: C.green, marginLeft: '1px' }}>ROI</span>
        </div>
        <div style={{ fontFamily: FM, fontSize: '10px', color: C.text4, letterSpacing: '0.06em', opacity: 0.7 }}>
          DATA: LINKEDIN · NASSCOM · AMBITIONBOX · NAUKRI · WEF 2026
        </div>
        <div style={{ fontFamily: FM, fontSize: '10px', color: C.text4, letterSpacing: '0.06em' }}>
          India's first cert ROI calculator
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN LANDING PAGE
// ─────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  var isMobile = useIsMobile()

  var heroRef = useRef(null)
  var { scrollYProgress: heroSP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  var heroY  = useTransform(heroSP, [0, 1], [0, isMobile ? 24 : 48])
  var heroOp = useTransform(heroSP, [0, 0.6], [1, 0])

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>

      {/* ── HEADER
          Premium, clean, no toggle.
          Left: wordmark. Center: nav links. Right: CTA.
          Thin bottom rule separates it from content.
          Top micro-rule in green — 2px brand accent.
      ── */}
      <header style={{
        position:    'sticky',
        top:         0,
        zIndex:      100,
        background:  C.bg,
        borderBottom: '1px solid ' + C.border,
      }}>
        {/* 2px top accent rule — green, full width */}
        <div style={{ height: '2px', background: C.green, opacity: 0.55 }} />

        <div style={{
          maxWidth: '1120px',
          margin:   '0 auto',
          padding:  isMobile ? '0 24px' : '0 80px',
          height:   '60px',
          display:  'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}>
          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px', flexShrink: 0 }}>
            <span style={{ fontFamily: FH, fontWeight: '600', fontSize: '16px', letterSpacing: '-0.02em', color: C.text }}>
              Certify
            </span>
            <span style={{ fontFamily: FSER, fontStyle: 'italic', fontSize: '18px', color: C.green, marginLeft: '1px' }}>
              ROI
            </span>
            {/* India qualifier — very quiet */}
            <span style={{ fontFamily: FM, fontSize: '9px', color: C.text4, letterSpacing: '0.08em', marginLeft: '8px', alignSelf: 'center' }}>
              INDIA
            </span>
          </div>

          {/* Nav — hidden on mobile */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              {['Calculator', 'Compare', 'Methodology', 'FAQ'].map(function (label) {
                return (
                  <button key={label}
                    style={{ background: 'none', border: 'none', fontFamily: FH, fontSize: '14px', color: C.text2, cursor: 'pointer', padding: 0, letterSpacing: '-0.005em', transition: 'color 0.14s' }}
                    onMouseEnter={function (e) { e.currentTarget.style.color = C.text }}
                    onMouseLeave={function (e) { e.currentTarget.style.color = C.text2 }}
                  >
                    {label}
                  </button>
                )
              })}
            </nav>
          )}

          {/* Header CTA */}
          <PrimaryBtn onClick={onEnter}>
            Calculate ROI
            {!isMobile && <ArrowRight size={14} />}
          </PrimaryBtn>
        </div>
      </header>

      {/* ── HERO
          Centered layout.
          Exact headline: "Your next cert / is either a goldmine / or a mistake"
          Scale contrast: first line smaller, "goldmine" and "mistake" carry visual weight.
          Summit mark: thin angular peak below the headline — quiet brand accent.
          Compass: bottom-right corner only, clipped, 220px, secondary.
          No dot grid (removed — was too decorative).
          One CTA, centered, trust line below.
      ── */}
      <div
        ref={heroRef}
        style={{
          position:        'relative',
          minHeight:       isMobile ? 'calc(100svh - 62px)' : 'calc(100vh - 62px)',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          overflow:        'hidden',
        }}
      >
        {/* Compass — bottom-right corner, clipped, secondary */}
        <div style={{
          position:      'absolute',
          right:         isMobile ? '-70px' : '-50px',
          bottom:        isMobile ? '-70px' : '-50px',
          pointerEvents: 'none',
          zIndex:        0,
        }}>
          <CompassCorner size={isMobile ? 220 : 300} />
        </div>

        {/* Horizontal rule accents — architectural structure */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: C.border, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: C.border, pointerEvents: 'none' }} />

        {/* Very faint vertical rule — left margin marker */}
        {!isMobile && (
          <>
            <div style={{ position: 'absolute', left: 'calc((100vw - 1120px) / 2 + 80px)', top: 0, bottom: 0, width: '1px', background: C.border, opacity: 0.6, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 'calc((100vw - 1120px) / 2 + 80px)', top: 0, bottom: 0, width: '1px', background: C.border, opacity: 0.6, pointerEvents: 'none' }} />
          </>
        )}

        <motion.div style={{ y: heroY, opacity: heroOp, position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: FM, fontSize: '10px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: isMobile ? '40px' : '52px' }}
            >
              <div style={{ width: '20px', height: '1px', background: C.lineHeavy }} />
              Certification ROI navigator · India 2026
              <div style={{ width: '20px', height: '1px', background: C.lineHeavy }} />
            </motion.div>

            {/* HEADLINE
                Line 1: "Your next cert" — Inter 600, smaller, introductory
                Line 2: "is either a goldmine" — EB Garamond italic, very large, gold
                Line 3: "or a mistake." — EB Garamond italic, very large, err red
                The serif italic at large size carries the punch.
                The scale difference between line 1 and lines 2–3 creates tension.
            */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginBottom: isMobile ? '40px' : '52px', marginTop: 0 }}
            >
              {/* Line 1 — Inter, restrained */}
              <div style={{
                fontFamily:    FH,
                fontWeight:    '500',
                fontSize:      isMobile ? '18px' : 'clamp(18px, 2.2vw, 24px)',
                color:         C.text2,
                letterSpacing: '-0.01em',
                lineHeight:    1.2,
                marginBottom:  isMobile ? '12px' : '16px',
              }}>
                Your next cert
              </div>

              {/* Line 2 — EB Garamond italic, gold */}
              <div style={{
                fontFamily:    FSER,
                fontStyle:     'italic',
                fontWeight:    '500',
                fontSize:      isMobile ? 'clamp(3rem,12vw,4rem)' : 'clamp(4rem,7.5vw,6.5rem)',
                color:         C.gold,
                letterSpacing: isMobile ? '-0.02em' : '-0.03em',
                lineHeight:    0.92,
                marginBottom:  isMobile ? '8px' : '10px',
              }}>
                is either a goldmine
              </div>

              {/* Divider between the two emphasized lines */}
              <div style={{
                display:       'flex',
                alignItems:    'center',
                justifyContent:'center',
                gap:           '16px',
                marginBottom:  isMobile ? '8px' : '10px',
                opacity:       0.35,
              }}>
                <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: C.lineHeavy }} />
                <div style={{ width: '4px', height: '4px', background: C.lineHeavy, transform: 'rotate(45deg)' }} />
                <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: C.lineHeavy }} />
              </div>

              {/* Line 3 — EB Garamond italic, err */}
              <div style={{
                fontFamily:    FSER,
                fontStyle:     'italic',
                fontWeight:    '500',
                fontSize:      isMobile ? 'clamp(3rem,12vw,4rem)' : 'clamp(4rem,7.5vw,6.5rem)',
                color:         C.err,
                letterSpacing: isMobile ? '-0.02em' : '-0.03em',
                lineHeight:    0.92,
              }}>
                or a mistake.
              </div>
            </motion.div>

            {/* Summit mark — geometric brand accent, sits below headline */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginBottom: isMobile ? '36px' : '44px' }}
            >
              <SummitMark width={isMobile ? 48 : 64} color={C.lineHeavy} />
            </motion.div>

            {/* Single CTA — centered, one button only */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}
            >
              <PrimaryBtn onClick={onEnter} large={true}>
                Calculate ROI <ArrowRight size={16} />
              </PrimaryBtn>
              <div style={{ fontFamily: FM, fontSize: '11px', color: C.text3, letterSpacing: '0.07em' }}>
                Free · No signup · India salary data 2026
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              style={{ marginTop: isMobile ? '52px' : '68px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <motion.div
                animate={{ y: [0, 6, 0], opacity: [0.3, 0.55, 0.3] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: '16px', height: '28px', borderRadius: '8px', border: '1.5px solid ' + C.border, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '4px' }}
              >
                <div style={{ width: '2px', height: '5px', borderRadius: '1px', background: C.text4 }} />
              </motion.div>
              <span style={{ fontFamily: FM, fontSize: '9px', color: C.text4, letterSpacing: '0.14em', textTransform: 'uppercase' }}>scroll</span>
            </motion.div>

          </div>
        </motion.div>
      </div>

      {/* ── TRUST STRIP — redesigned ── */}
      <TrustStrip />

      {/* ── CERT ASSEMBLY ── */}
      <CertAssembly />

      {/* ── DATA COMPOSITION ── */}
      <DataComposition isMobile={isMobile} />

      {/* ── SECTION RULE ── */}
      <div style={{ height: '1px', background: C.border }} />

      {/* ── HOW IT WORKS ── */}
      <HowItWorks isMobile={isMobile} onEnter={onEnter} />

      {/* ── VS SECTION ── */}
      <VsSection isMobile={isMobile} />

      {/* ── ELEVEN PM ── */}
      <ElevenPM isMobile={isMobile} onEnter={onEnter} />

      {/* ── THREE MODES ── */}
      <ThreeModes isMobile={isMobile} onEnter={onEnter} />

      {/* ── SOCIAL PROOF ── */}
      <SocialProof isMobile={isMobile} />

      {/* ── FAQ ── */}
      <FAQ isMobile={isMobile} />

      {/* ── FINAL CTA ── */}
      <FinalCTA isMobile={isMobile} onEnter={onEnter} />

      {/* ── FOOTER ── */}
      <PageFooter isMobile={isMobile} />

    </div>
  )
}

export default LandingPage