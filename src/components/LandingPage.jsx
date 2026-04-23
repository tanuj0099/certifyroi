import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, ChevronDown, TrendingUp, MapPin, CheckCircle } from 'lucide-react'

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
    var el = ref.current; if (!el) return
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: threshold })
    obs.observe(el)
    return function () { obs.disconnect() }
  }, [threshold])
  return [ref, inView]
}

// ─────────────────────────────────────────────────────────
// DESIGN TOKENS — DARK EDITORIAL, SINGLE THEME, NO TOGGLE
// ─────────────────────────────────────────────────────────
var F_SERIF = "'EB Garamond', 'Cormorant Garamond', Georgia, serif"
var F_SANS  = "'Inter', 'DM Sans', sans-serif"
var F_MONO  = "'JetBrains Mono', 'IBM Plex Mono', monospace"

var C = {
  bg:           '#0D0C0B',
  bgAlt:        '#111010',
  surface:      '#161514',
  surfaceHigh:  '#1E1C1A',
  text:         '#EBE8E3',
  text2:        '#9E9A94',
  text3:        '#6B6762',
  text4:        '#3E3B37',
  green:        '#2A5C42',
  greenL:       '#3D7A5A',
  greenVivid:   '#4A9068',
  gold:         '#C49A42',
  goldL:        '#D4AA52',
  err:          '#9A3B3B',
  line:         '#242220',
  lineHeavy:    '#302D2A',
  border:       'rgba(235,232,227,0.07)',
  borderMid:    'rgba(235,232,227,0.12)',
  btnFill:      '#EBE8E3',
  btnText:      '#0D0C0B',
  certBg:       '#0A0908',
}

var RISE = {
  hidden: { y: 24, opacity: 0 },
  show:   { y: 0, opacity: 1, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
}
var SLIDE_L = {
  hidden: { x: -36, opacity: 0 },
  show:   { x: 0,   opacity: 1, transition: { duration: 0.7,  ease: [0.16, 1, 0.3, 1] } }
}

// ─────────────────────────────────────────────────────────
// SVG PRIMITIVES
// ─────────────────────────────────────────────────────────
function ElevationMark({ size, color }) {
  size = size || 18; color = color || C.greenVivid
  var w = size, h = size * 0.65
  return (
    <svg width={w} height={h} viewBox={'0 0 ' + w + ' ' + h} fill="none" style={{ display: 'block' }}>
      <path d={'M 0 ' + h + ' Q ' + (w * 0.25) + ' ' + (h * 0.1) + ' ' + (w * 0.5) + ' ' + (h * 0.2) + ' Q ' + (w * 0.75) + ' ' + (h * 0.35) + ' ' + w + ' ' + h}
        stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx={w * 0.5} cy={h * 0.2} r="1.8" fill={color} />
    </svg>
  )
}

function SummitFlag({ color, size }) {
  color = color || C.gold; size = size || 1
  return (
    <svg width={14 * size} height={18 * size} viewBox="0 0 14 18" fill="none" style={{ display: 'inline-block' }}>
      <line x1="3" y1="1" x2="3" y2="17" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 3 1 L 13 5 L 3 9 Z" fill={color} fillOpacity="0.9" />
    </svg>
  )
}

function WaypointDot({ active, color, size }) {
  active = active !== false; color = color || C.greenVivid; size = size || 10
  return (
    <svg width={size + 8} height={size + 8} viewBox={'0 0 ' + (size + 8) + ' ' + (size + 8)} fill="none">
      <circle cx={(size + 8) / 2} cy={(size + 8) / 2} r={size / 2 + 3}
        stroke={color} strokeWidth="1" strokeOpacity={active ? 0.3 : 0.15} />
      <circle cx={(size + 8) / 2} cy={(size + 8) / 2} r={size / 2 - 1}
        fill={active ? color : 'none'} stroke={color} strokeWidth="1.5" strokeOpacity={active ? 1 : 0.3} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// MOUNTAIN SVG — pure geometric, built-in, no external img
// Summit has a CertifyROI flag planted at the peak
// ─────────────────────────────────────────────────────────
function MountainSVG({ width, height }) {
  width  = width  || 640
  height = height || 520
  var cx = width * 0.52
  var peak = { x: cx, y: height * 0.04 }

  // Main ridge paths
  var leftRidge  = 'M ' + (width * 0.02) + ' ' + height + ' L ' + (width * 0.18) + ' ' + (height * 0.72) + ' L ' + (width * 0.26) + ' ' + (height * 0.62) + ' L ' + (width * 0.34) + ' ' + (height * 0.48) + ' L ' + (width * 0.40) + ' ' + (height * 0.34) + ' L ' + (width * 0.46) + ' ' + (height * 0.18) + ' L ' + (width * 0.49) + ' ' + (height * 0.09) + ' L ' + peak.x + ' ' + peak.y
  var rightRidge = 'M ' + peak.x + ' ' + peak.y + ' L ' + (width * 0.55) + ' ' + (height * 0.1) + ' L ' + (width * 0.60) + ' ' + (height * 0.22) + ' L ' + (width * 0.67) + ' ' + (height * 0.38) + ' L ' + (width * 0.74) + ' ' + (height * 0.52) + ' L ' + (width * 0.82) + ' ' + (height * 0.66) + ' L ' + (width * 0.92) + ' ' + (height * 0.8) + ' L ' + (width * 0.99) + ' ' + height

  // Snow zone polygon near summit
  var snowPoly = peak.x + ',' + peak.y + ' ' +
    (cx - width * 0.07) + ',' + (height * 0.22) + ' ' +
    (cx - width * 0.04) + ',' + (height * 0.28) + ' ' +
    cx + ',' + (height * 0.32) + ' ' +
    (cx + width * 0.04) + ',' + (height * 0.27) + ' ' +
    (cx + width * 0.07) + ',' + (height * 0.20)

  // Mountain fill polygon
  var fillPoly = '0,' + height + ' ' +
    (width * 0.18) + ',' + (height * 0.72) + ' ' +
    (width * 0.26) + ',' + (height * 0.62) + ' ' +
    (width * 0.34) + ',' + (height * 0.48) + ' ' +
    (width * 0.40) + ',' + (height * 0.34) + ' ' +
    (width * 0.46) + ',' + (height * 0.18) + ' ' +
    (width * 0.49) + ',' + (height * 0.09) + ' ' +
    peak.x + ',' + peak.y + ' ' +
    (width * 0.55) + ',' + (height * 0.1) + ' ' +
    (width * 0.60) + ',' + (height * 0.22) + ' ' +
    (width * 0.67) + ',' + (height * 0.38) + ' ' +
    (width * 0.74) + ',' + (height * 0.52) + ' ' +
    (width * 0.82) + ',' + (height * 0.66) + ' ' +
    (width * 0.92) + ',' + (height * 0.8) + ' ' +
    width + ',' + height

  // Contour rings at peak
  var contours = [0.14, 0.22, 0.31, 0.40, 0.50].map(function (t, i) {
    var r = t * Math.min(width, height) * 0.55
    return { cx: cx, cy: peak.y + height * 0.18 + i * height * 0.028, rx: r, ry: r * 0.45 }
  })

  // Flag position — slightly right of peak for visibility
  var flagX = peak.x + 6
  var flagY = peak.y - 4

  return (
    <svg
      viewBox={'0 0 ' + width + ' ' + height}
      width="100%" height="100%"
      style={{ display: 'block' }}
      aria-label="CertifyROI mountain route map"
    >
      <defs>
        <linearGradient id="mgFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#2A2420" stopOpacity="1" />
          <stop offset="70%" stopColor="#1A1614" stopOpacity="1" />
          <stop offset="100%" stopColor="#0D0C0B" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mgLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EBE8E3" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#EBE8E3" stopOpacity="0" />
        </linearGradient>
        <filter id="mgGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Mountain fill */}
      <polygon points={fillPoly} fill="url(#mgFill)" />

      {/* Left face shading — lighter */}
      <polygon points={
        '0,' + height + ' ' +
        (width * 0.18) + ',' + (height * 0.72) + ' ' +
        (width * 0.34) + ',' + (height * 0.48) + ' ' +
        (width * 0.46) + ',' + (height * 0.18) + ' ' +
        peak.x + ',' + peak.y + ' ' +
        cx + ',' + (height * 0.32) + ' ' +
        (width * 0.28) + ',' + (height * 0.65) + ' ' +
        '0,' + height
      } fill="url(#mgLeft)" />

      {/* Contour elevation rings */}
      {contours.map(function (ct, i) {
        return (
          <ellipse key={i}
            cx={ct.cx} cy={ct.cy} rx={ct.rx} ry={ct.ry}
            fill="none"
            stroke="rgba(235,232,227,0.045)"
            strokeWidth="0.7"
          />
        )
      })}

      {/* Snow zone */}
      <polygon points={snowPoly}
        fill="rgba(235,232,227,0.11)"
        stroke="rgba(235,232,227,0.08)"
        strokeWidth="0.5"
      />

      {/* Left ridge line */}
      <path d={leftRidge} fill="none"
        stroke="rgba(235,232,227,0.18)" strokeWidth="1.2" strokeLinecap="round" />

      {/* Right ridge line */}
      <path d={rightRidge} fill="none"
        stroke="rgba(235,232,227,0.10)" strokeWidth="0.9" strokeLinecap="round" />

      {/* Summit glow */}
      <circle cx={peak.x} cy={peak.y} r="12"
        fill={C.gold} fillOpacity="0.08" filter="url(#mgGlow)" />
      <circle cx={peak.x} cy={peak.y} r="4"
        fill={C.gold} fillOpacity="0.6" />
      <circle cx={peak.x} cy={peak.y} r="2"
        fill={C.gold} />

      {/* CERTIFYROI FLAG at summit — the brand connection */}
      <line
        x1={flagX} y1={flagY}
        x2={flagX} y2={flagY - 22}
        stroke={C.gold} strokeWidth="1.2" strokeLinecap="round"
      />
      <path
        d={'M ' + flagX + ' ' + (flagY - 22) + ' L ' + (flagX + 12) + ' ' + (flagY - 17) + ' L ' + flagX + ' ' + (flagY - 12) + ' Z'}
        fill={C.gold} fillOpacity="0.92"
      />
      {/* CERTIFYROI text on flag */}
      <text
        x={flagX + 14} y={flagY - 14}
        style={{ fontFamily: F_MONO, fontSize: '7px' }}
        fill={C.gold} fillOpacity="0.75"
        letterSpacing="0.08em"
      >
        CERTIFYROI
      </text>

      {/* Route line from basecamp to summit — the best path */}
      <path
        d={'M ' + (width * 0.12) + ' ' + height * 0.94 + ' C ' +
           (width * 0.22) + ' ' + (height * 0.7) + ', ' +
           (width * 0.35) + ' ' + (height * 0.45) + ', ' +
           (width * 0.44) + ' ' + (height * 0.22) + ' S ' +
           (width * 0.48) + ' ' + (height * 0.1) + ', ' +
           peak.x + ' ' + peak.y}
        fill="none"
        stroke={C.greenVivid}
        strokeWidth="1.5"
        strokeDasharray="6 4"
        strokeOpacity="0.55"
      />

      {/* Waypoint dots on route */}
      {[
        { x: width * 0.12, y: height * 0.94, label: 'BASE', labelDy: 14 },
        { x: width * 0.28, y: height * 0.60, label: '3 MO', labelDy: -8 },
        { x: width * 0.40, y: height * 0.32, label: '6 MO', labelDy: -8 },
      ].map(function (wp, i) {
        return (
          <g key={i}>
            <circle cx={wp.x} cy={wp.y} r="5"
              fill={C.greenVivid} fillOpacity="0.18"
              stroke={C.greenVivid} strokeWidth="0.8" strokeOpacity="0.5"
            />
            <circle cx={wp.x} cy={wp.y} r="2.5"
              fill={C.greenVivid} fillOpacity="0.7"
            />
            <text x={wp.x + 7} y={wp.y + 4}
              style={{ fontFamily: F_MONO, fontSize: '7px' }}
              fill={C.greenVivid} fillOpacity="0.5"
              letterSpacing="0.06em"
            >
              {wp.label}
            </text>
          </g>
        )
      })}

      {/* Bottom fade — blends into page */}
      <rect x="0" y={height * 0.7} width={width} height={height * 0.3}
        fill={'url(#mgFade)'}
        style={{ pointerEvents: 'none' }}
      />
      <defs>
        <linearGradient id="mgFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bg} stopOpacity="0" />
          <stop offset="100%" stopColor={C.bg} stopOpacity="1" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// MOUNTAIN CARD — summit stats floating near peak
// ─────────────────────────────────────────────────────────
function SummitStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        top: '14%',
        right: '3%',
        background: 'rgba(13,12,11,0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid ' + C.borderMid,
        borderRadius: '6px',
        padding: '14px 18px',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontFamily: F_MONO, fontSize: '8px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
        AWS SAA · Bangalore
      </div>
      {[
        { label: 'SUMMIT', value: '9 mo', color: C.text },
        { label: '5-YR GAIN', value: '₹14.2L', color: C.gold },
        { label: 'ELEVATION', value: '+35%', color: C.greenVivid },
      ].map(function (s, i) {
        return (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '20px', marginBottom: i < 2 ? '6px' : '0' }}>
            <span style={{ fontFamily: F_MONO, fontSize: '8px', color: C.text3, letterSpacing: '0.1em' }}>{s.label}</span>
            <span style={{ fontFamily: F_MONO, fontSize: '13px', color: s.color, letterSpacing: '-0.02em', fontWeight: '500' }}>{s.value}</span>
          </div>
        )
      })}
    </motion.div>
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
    var frames = Math.round(duration * 60), f = 0
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
// PRIMARY BUTTON — capsule, premium
// ─────────────────────────────────────────────────────────
function PrimaryBtn({ onClick, children, large }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.975 }}
      transition={{ duration: 0.16 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '9px',
        padding: large ? '0 36px' : '0 24px',
        height: large ? '54px' : '44px',
        borderRadius: '999px',
        border: 'none',
        background: C.btnFill,
        color: C.btnText,
        fontSize: large ? '14px' : '13px',
        fontFamily: F_SANS, fontWeight: '500',
        letterSpacing: '0.01em',
        cursor: 'pointer',
        boxShadow: '0 2px 16px rgba(196,154,66,0.18)',
        transition: 'box-shadow 0.18s',
      }}
      onMouseEnter={function (e) { e.currentTarget.style.boxShadow = '0 6px 24px rgba(196,154,66,0.28)' }}
      onMouseLeave={function (e) { e.currentTarget.style.boxShadow = '0 2px 16px rgba(196,154,66,0.18)' }}
    >
      {children}
    </motion.button>
  )
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '0 20px', height: '44px',
        borderRadius: '999px',
        border: '1px solid ' + C.borderMid,
        background: 'transparent',
        color: C.text2,
        fontSize: '13px', fontFamily: F_SANS, fontWeight: '400',
        cursor: 'pointer', transition: 'all 0.16s',
      }}
      onMouseEnter={function (e) { e.currentTarget.style.borderColor = C.text3; e.currentTarget.style.color = C.text }}
      onMouseLeave={function (e) { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.text2 }}
    >
      {children}
    </button>
  )
}

// ─────────────────────────────────────────────────────────
// RULE
// ─────────────────────────────────────────────────────────
function Rule({ style }) {
  return <div style={{ height: '1px', background: C.border, ...style }} />
}

// ─────────────────────────────────────────────────────────
// TRUST STRIP — premium, categorised
// ─────────────────────────────────────────────────────────
function TrustStrip() {
  var items = [
    { tag: 'Cloud',     text: 'AWS cert holders earn ₹2.4L more/yr in Bangalore'          },
    { tag: 'Demand',    text: '2,400+ cloud roles open on Naukri right now'               },
    { tag: 'Finance',   text: 'Average PMP payback period: 7 months'                      },
    { tag: 'Marketing', text: 'Google Analytics · ₹18K invested → ₹3.2L annual gain'     },
    { tag: 'DevOps',    text: 'CKA Kubernetes: highest ROI cert in India 2026'            },
    { tag: 'Market',    text: 'Hyderabad cloud demand up 38% year-over-year'              },
    { tag: 'Finance',   text: 'CFA Level 1: median salary uplift ₹4.8L in Mumbai'        },
    { tag: 'Coverage',  text: '103 certifications · 17 domains · 8 Indian cities'        },
  ]
  return (
    <div style={{
      borderTop: '1px solid ' + C.border,
      borderBottom: '1px solid ' + C.border,
      background: C.surface,
      overflow: 'hidden',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Label row */}
      <div style={{ padding: '10px 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '16px', height: '1px', background: C.lineHeavy }} />
        <span style={{ fontFamily: F_MONO, fontSize: '9px', color: C.text4, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Market data · Q1 2026
        </span>
      </div>
      {/* Moving rail */}
      <div style={{ padding: '12px 0 14px', overflow: 'hidden' }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 72, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', gap: '0', whiteSpace: 'nowrap', width: 'max-content', alignItems: 'stretch' }}
        >
          {[...items, ...items].map(function (item, i) {
            return (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0',
                borderRight: '1px solid ' + C.border,
                padding: '0 36px',
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: F_MONO, fontSize: '8.5px', color: C.greenVivid, letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: '10px', opacity: 0.7 }}>
                  {item.tag}
                </span>
                <span style={{ fontFamily: F_MONO, fontSize: '11px', color: C.text2, letterSpacing: '0.015em' }}>
                  {item.text}
                </span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CERT ASSEMBLY — sticky scroll, FIXED version
// ─────────────────────────────────────────────────────────
function CertAssembly() {
  var isMobile = useIsMobile()
  var trackRef    = useRef(null)
  var { scrollY } = useScroll()
  var [prog, setProg] = useState(0)

  useEffect(function () {
    function update() {
      var el = trackRef.current; if (!el) return
      var rect = el.getBoundingClientRect()
      var total = el.offsetHeight - window.innerHeight
      if (total <= 0) return
      var p = Math.max(0, Math.min(1, -rect.top / total))
      setProg(p)
    }
    var unsub = scrollY.on('change', update)
    update()
    return unsub
  }, [scrollY])

  function remap(p, a, b, c, d) { return c + (d - c) * Math.max(0, Math.min(1, (p - a) / (b - a))) }

  var p8 = remap(prog, 0, 0.8, 0, 1)
  var l1, l2
  if (isMobile) {
    l1 = 'translateY(' + remap(p8, 0, 1, -45, 0) + 'px) rotateZ(' + remap(p8, 0, 1, 2.5, 0) + 'deg)'
    l2 = 'translateY(' + remap(p8, 0, 1, 45, 0)  + 'px) rotateZ(' + remap(p8, 0, 1, -2, 0) + 'deg)'
  } else {
    l1 = 'perspective(1200px) translateZ(' + remap(p8, 0, 1, -260, 0) + 'px) translateY(' + remap(p8, 0, 1, -75, 0) + 'px) rotateY(' + remap(p8, 0, 1, 30, 0) + 'deg) rotateX(' + remap(p8, 0, 1, 14, 0) + 'deg)'
    l2 = 'perspective(1200px) translateZ(' + remap(p8, 0, 1, 260, 0)  + 'px) translateY(' + remap(p8, 0, 1, 75, 0)  + 'px) rotateY(' + remap(p8, 0, 1, -24, 0) + 'deg) rotateX(' + remap(p8, 0, 1, -11, 0) + 'deg)'
  }

  var certScale   = prog < 0.8 ? remap(prog, 0, 0.8, 0.62, 1.0) : remap(prog, 0.8, 1.0, 1.0, 0.85)
  var certOpacity = prog < 0.05 ? remap(prog, 0, 0.05, 0, 1) : prog > 0.85 ? remap(prog, 0.85, 1.0, 1, 0) : 1
  var overlayOp   = prog < 0.08 ? remap(prog, 0, 0.08, 0, 0.96) : prog > 0.92 ? remap(prog, 0.92, 1, 0.96, 0) : 0.96
  var hintOp      = prog > 0.16 ? 0 : prog > 0.06 ? remap(prog, 0.06, 0.16, 1, 0) : 1
  var assembledOp = remap(prog, 0.78, 0.88, 0, 1)
  var cardW       = isMobile ? 'min(300px,88vw)' : 'min(460px,80vw)'

  return (
    <div ref={trackRef} style={{ height: '300vh', position: 'relative', borderBottom: '1px solid ' + C.border }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: C.bg, opacity: overlayOp }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 4 }}>
          <div style={{ transform: 'scale(' + certScale + ')', opacity: certOpacity }}>
            <div style={{ position: 'relative', width: cardW, height: 'calc(' + cardW + ' / 1.414)', transformStyle: 'preserve-3d' }}>

              {/* Layer 1 — card border frame */}
              <div style={{ position: 'absolute', inset: 0, transform: l1 }}>
                <svg viewBox="0 0 480 340" width="100%" height="100%" style={{ position: 'absolute', inset: 0, display: 'block' }}>
                  <defs>
                    <linearGradient id="certBordX" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"   stopColor={C.greenVivid} />
                      <stop offset="50%"  stopColor={C.greenL} />
                      <stop offset="100%" stopColor={C.gold} />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="480" height="340" rx="3"
                    fill={C.certBg} fillOpacity="1"
                    style={{ filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.6))' }}
                  />
                  <rect x="1.5" y="1.5" width="477" height="337" rx="2.5"
                    fill="none" stroke="url(#certBordX)" strokeWidth="1.2"
                  />
                  <rect x="8" y="8" width="464" height="324" rx="1"
                    fill="none" stroke="rgba(235,232,227,0.04)" strokeWidth="0.6"
                  />
                  {[[18, 18], [462, 18], [18, 322], [462, 322]].map(function (arr, i) {
                    var cx2 = arr[0], cy2 = arr[1]
                    return (
                      <g key={i}>
                        <circle cx={cx2} cy={cy2} r="3.5" fill="none" stroke={C.greenVivid} strokeWidth="0.9" />
                        <circle cx={cx2} cy={cy2} r="7" fill="none" stroke={C.greenVivid} strokeOpacity="0.18" strokeWidth="0.5" />
                        <line x1={cx2 - 9} y1={cy2} x2={cx2 + 9} y2={cy2} stroke={C.greenVivid} strokeOpacity="0.22" strokeWidth="0.5" />
                        <line x1={cx2} y1={cy2 - 9} x2={cx2} y2={cy2 + 9} stroke={C.greenVivid} strokeOpacity="0.22" strokeWidth="0.5" />
                      </g>
                    )
                  })}
                  <line x1="38" y1="1.5" x2="88" y2="1.5" stroke={C.greenVivid} strokeWidth="2.2" />
                  <line x1="392" y1="1.5" x2="442" y2="1.5" stroke={C.gold} strokeWidth="2.2" />
                  <line x1="38" y1="338.5" x2="88" y2="338.5" stroke={C.gold} strokeWidth="2.2" />
                  <line x1="392" y1="338.5" x2="442" y2="338.5" stroke={C.greenVivid} strokeWidth="2.2" />
                </svg>
              </div>

              {/* Layer 2 — card content */}
              <div style={{ position: 'absolute', inset: 0, transform: l2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,4vw,36px)' }}>
                <div style={{ fontFamily: F_MONO, fontSize: '8px', color: C.greenVivid, letterSpacing: '0.26em', marginBottom: '12px', textTransform: 'uppercase', opacity: 0.7 }}>
                  CERTIFYROI · INDIA 2026
                </div>
                <div style={{ fontFamily: F_SERIF, fontWeight: '400', fontSize: 'clamp(1rem,3vw,1.9rem)', letterSpacing: '-0.01em', color: C.text, marginBottom: '5px', textAlign: 'center', lineHeight: 1.1 }}>
                  Route Briefing
                </div>
                <div style={{ fontFamily: F_SANS, fontSize: 'clamp(10px,1.4vw,11.5px)', color: C.text3, marginBottom: '28px', textAlign: 'center' }}>
                  Personalised ROI Analysis · Your City
                </div>
                <div style={{ display: 'flex', gap: 'clamp(12px,4.5vw,44px)', marginBottom: '20px' }}>
                  {[
                    { label: 'SUMMIT TIME', value: '9 mo',   color: C.text  },
                    { label: '5-YR GAIN',   value: '₹14.2L', color: C.gold  },
                    { label: 'ELEVATION',   value: '+35%',   color: C.greenVivid },
                  ].map(function (s, i) {
                    return (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: F_MONO, fontSize: '7px', color: C.text4, letterSpacing: '0.12em', marginBottom: '7px' }}>{s.label}</div>
                        <div style={{ fontFamily: F_MONO, fontSize: 'clamp(0.9rem,2.6vw,1.55rem)', color: s.color, fontWeight: '400', letterSpacing: '-0.03em' }}>{s.value}</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ width: '68%', height: '1px', background: C.border, marginBottom: '14px' }} />
                <div style={{ fontFamily: F_MONO, fontSize: '7px', color: C.text4, letterSpacing: '0.14em', textAlign: 'center' }}>
                  VERIFIED · NAUKRI MARCH 2026
                </div>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{ opacity: hintOp, marginTop: '40px', textAlign: 'center', pointerEvents: 'none', transition: 'opacity 0.3s' }}>
            <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '9px', color: C.text3, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                ↓  scroll to assemble  ↓
              </div>
            </motion.div>
          </div>
        </div>

        {/* Assembled confirmation */}
        <div style={{ opacity: assembledOp, position: 'absolute', bottom: '8%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 5, transition: 'opacity 0.3s' }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.greenVivid, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            ✓  ROUTE BRIEFING · ASSEMBLED
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// DATA COMPOSITION
// ─────────────────────────────────────────────────────────
function DataComposition({ isMobile }) {
  return (
    <div style={{ paddingTop: 'clamp(80px,12vw,140px)', paddingBottom: 'clamp(80px,12vw,140px)', background: C.bg }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>
            The numbers behind every route
          </div>
        </motion.div>

        <motion.div variants={SLIDE_L} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ marginBottom: 'clamp(48px,8vw,96px)' }}>
          <div style={{ fontFamily: F_MONO, fontSize: 'clamp(3rem,13vw,7.5rem)', color: C.gold, lineHeight: 1, letterSpacing: '-0.045em', fontWeight: '500' }}>
            <CountUp end={14.2} prefix="₹" suffix="L" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginTop: '14px', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontSize: 'clamp(1rem,2.4vw,1.35rem)', color: C.text2 }}>
              5-year net gain · AWS Solutions Architect
            </div>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Bangalore median · 2026
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', borderTop: '1px solid ' + C.border }}>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ padding: isMobile ? '40px 0' : '56px 64px 56px 0', borderBottom: isMobile ? '1px solid ' + C.border : 'none', borderRight: isMobile ? 'none' : '1px solid ' + C.border }}>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Payback period</div>
            <div style={{ fontFamily: F_MONO, fontSize: 'clamp(2.2rem,7vw,4.2rem)', color: C.text, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '500', marginBottom: '14px' }}>
              <CountUp end={6} suffix=" months" />
            </div>
            <div style={{ fontFamily: F_SANS, fontSize: '14px', color: C.text2, lineHeight: '1.75', maxWidth: '38ch' }}>
              Not "a few months." The exact month your investment turns profitable — calculated for your salary and city.
            </div>
          </motion.div>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }}
            style={{ padding: isMobile ? '40px 0' : '56px 0 56px 64px' }}>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Salary increase</div>
            <div style={{ fontFamily: F_MONO, fontSize: 'clamp(2.2rem,7vw,4.2rem)', color: C.text, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '500', marginBottom: '14px' }}>
              <CountUp end={35} suffix="%" />
            </div>
            <div style={{ fontFamily: F_SANS, fontSize: '14px', color: C.text2, lineHeight: '1.75', maxWidth: '38ch' }}>
              India-sourced. City-specific. Not US data converted at today's rate and called "India salary insights."
            </div>
          </motion.div>
        </div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.2 }}
          style={{ borderTop: '1px solid ' + C.border, paddingTop: isMobile ? '40px' : '56px', display: 'flex', gap: isMobile ? '20px' : '64px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Monthly gain from month 7</div>
            <div style={{ fontFamily: F_MONO, fontSize: 'clamp(1.6rem,4.5vw,2.8rem)', color: C.greenVivid, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '500' }}>₹23,600</div>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>103 certifications analysed</div>
            <div style={{ fontFamily: F_SANS, fontSize: '14px', color: C.text2, lineHeight: '1.8' }}>
              Across 17 domains — cloud, data, finance, medical, law, government.
              Every certification mapped to real hiring data from Naukri, AmbitionBox, and LinkedIn India.
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
    { id: 'basecamp', label: 'Basecamp', subtitle: 'Where you start',   desc: 'Enter your current salary, role, and city. Upload your resume if you want AI to read your actual background. This is your starting elevation.', detail: 'No account required.' },
    { id: 'route',    label: 'Route',    subtitle: 'Choose your path',   desc: 'Select a certification or let the AI recommend the highest-ROI route for your profile. Compare up to three routes side by side.',               detail: 'India market data · 2026' },
    { id: 'summit',   label: 'Summit',   subtitle: 'Know the outcome',   desc: 'Exact payback month, 5-year net gain in rupees, monthly delta, and a recommendation on whether the climb is worth making.',                       detail: 'Your numbers. Your decision.' },
  ]
  var [routeRef, routeInView] = useInView(0.25)

  return (
    <div style={{ background: C.surface, borderTop: '1px solid ' + C.border, borderBottom: '1px solid ' + C.border, paddingTop: 'clamp(72px,10vw,120px)', paddingBottom: 'clamp(72px,10vw,120px)' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>The route</div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: 'clamp(1.7rem,4.5vw,3rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          Three stages.<br />One clear answer.
        </motion.h2>

        <div ref={routeRef} style={{ position: 'relative' }}>
          {!isMobile && (
            <div style={{ position: 'absolute', top: '9px', left: '9px', right: '9px', height: '1px', overflow: 'visible', pointerEvents: 'none', zIndex: 0 }}>
              <svg width="100%" height="2" style={{ display: 'block', overflow: 'visible' }}>
                <motion.line x1="0" y1="1" x2="100%" y2="1"
                  stroke={C.greenVivid} strokeWidth="0.8" strokeDasharray="6 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={routeInView ? { pathLength: 1, opacity: 0.45 } : {}}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', position: 'relative', zIndex: 1 }}>
            {steps.map(function (step, i) {
              var isLast = i === steps.length - 1
              return (
                <motion.div key={step.id} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                  style={{ paddingLeft: !isMobile && i > 0 ? 'clamp(24px,3vw,40px)' : '0', paddingRight: !isMobile && i < 2 ? 'clamp(24px,3vw,40px)' : '0', paddingTop: !isMobile ? '48px' : 'clamp(32px,5vw,48px)', paddingBottom: isMobile && !isLast ? 'clamp(32px,5vw,48px)' : '0', borderRight: !isMobile && !isLast ? '1px solid ' + C.border : 'none', borderBottom: isMobile && !isLast ? '1px solid ' + C.border : 'none' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <WaypointDot active={true} color={C.greenVivid} size={10} />
                  </div>
                  <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontSize: '22px', color: C.greenVivid, marginBottom: '4px', fontWeight: '400' }}>{step.label}</div>
                  <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>{step.subtitle}</div>
                  <div style={{ fontFamily: F_SANS, fontSize: '14px', color: C.text2, lineHeight: '1.8', marginBottom: '14px' }}>{step.desc}</div>
                  <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.06em' }}>{step.detail}</div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.35 }}
          style={{ marginTop: isMobile ? '48px' : '64px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <PrimaryBtn onClick={onEnter}>
            Calculate ROI <ArrowRight size={14} />
          </PrimaryBtn>
          <span style={{ fontFamily: F_MONO, fontSize: '11px', color: C.text3, letterSpacing: '0.06em' }}>No signup required</span>
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
    { wrong: '"AWS is good for cloud engineers"',      right: 'AWS SAA at ₹9L salary: payback month 6. ₹14.2L net gain over 5 years. Or it isn\'t worth the investment.' },
    { wrong: '"Upskill for career growth"',            right: '₹23,600 extra every month from month 7 — compounding over 5 years. In rupees, not "career growth."' },
    { wrong: 'US salary data converted to rupees',     right: 'Naukri · AmbitionBox · LinkedIn India. 2026 data. Not converted from San Francisco. Actually collected here.' },
    { wrong: 'The same advice for every professional', right: 'AI reads your resume. Sees your domain, your city, your experience. Recommends a specific path for you.' },
  ]

  return (
    <div style={{ paddingTop: 'clamp(72px,10vw,120px)', paddingBottom: 'clamp(72px,10vw,120px)', background: C.bg }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>
            The problem with every other source
          </div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: 'clamp(1.7rem,4.5vw,3rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          Every other guide<br />
          <span style={{ color: C.err }}>is pointing you the wrong way.</span>
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '40px' : '52px' }}>
          {pairs.map(function (pair, i) {
            return (
              <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '14px', maxWidth: '100%' }}>
                  <div style={{ fontFamily: F_SANS, fontWeight: '500', fontSize: 'clamp(0.9rem,2vw,1.15rem)', color: C.text, opacity: 0.2, letterSpacing: '-0.01em', lineHeight: 1.4, wordBreak: 'break-word' }}>
                    {pair.wrong}
                  </div>
                  <svg style={{ position: 'absolute', left: 0, top: '50%', width: '100%', height: '2px', overflow: 'visible', pointerEvents: 'none' }}>
                    <motion.line x1="0" y1="0" x2="100%" y2="0"
                      stroke={C.err} strokeWidth="1" strokeOpacity="0.35"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.85, delay: 0.2 + i * 0.06, ease: 'easeOut' }}
                    />
                  </svg>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: C.greenVivid, marginTop: '10px', flexShrink: 0 }} />
                  <div style={{ fontFamily: F_SANS, fontSize: 'clamp(14px,1.8vw,15px)', color: C.text, lineHeight: '1.75', fontWeight: '400' }}>{pair.right}</div>
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
// ELEVEN PM — relatable stories
// ─────────────────────────────────────────────────────────
function ElevenPM({ isMobile, onEnter }) {
  var stories = [
    { time: '11:47 PM', name: 'Rohan',  loc: 'Pune',      role: '2 yrs · Backend Engineer', thought: '"Should I do AWS? Or is it too late?"',     context: 'Ex-classmate promoted to Cloud Architect. ₹28L CTC. Same college, same year.',          answer: 'AWS SAA at ₹9L: payback month 6. 5-year gain ₹14.2L. Not too late.', color: C.greenVivid },
    { time: '11:12 PM', name: 'Sneha',  loc: 'Bangalore', role: '6 yrs · Ops Manager',       thought: '"Is the switch possible without an MBA?"',  context: 'Every data job requires 3 years of data science experience. She has zero.',               answer: 'Google Data Analytics + 2 GitHub projects. 5 months. ₹8L → ₹12L.',   color: C.gold },
    { time: '12:03 AM', name: 'Arjun',  loc: 'Pune',      role: 'CS · Fresh graduate',       thought: '"Which cert gets me placed here in India?"', context: 'Three comparison articles. All recommend AWS. All written by Americans. All in USD.',    answer: 'Student Mode. India-specific. GCP placed 47 Pune freshers in Q1 2026.', color: C.text3 },
  ]

  return (
    <div style={{ background: C.surface, borderTop: '1px solid ' + C.border, borderBottom: '1px solid ' + C.border, paddingTop: 'clamp(72px,10vw,120px)', paddingBottom: 'clamp(72px,10vw,120px)' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>Who this is for</div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: 'clamp(1.7rem,4.5vw,3rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          We know what you're<br />thinking right now.
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', borderTop: '1px solid ' + C.border }}>
          {stories.map(function (s, i) {
            var isLast = i === stories.length - 1
            return (
              <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                onClick={onEnter}
                style={{ paddingLeft: !isMobile && i > 0 ? 'clamp(24px,3vw,40px)' : '0', paddingRight: !isMobile && i < 2 ? 'clamp(24px,3vw,40px)' : '0', paddingTop: 'clamp(32px,5vw,48px)', paddingBottom: 'clamp(32px,5vw,48px)', borderRight: !isMobile && !isLast ? '1px solid ' + C.border : 'none', borderBottom: isMobile && !isLast ? '1px solid ' + C.border : 'none', cursor: 'pointer' }}>
                <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.08em', marginBottom: '18px' }}>{s.time}</div>
                <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400', fontSize: 'clamp(1rem,2.2vw,1.25rem)', color: C.text, lineHeight: 1.4, marginBottom: '18px' }}>{s.thought}</div>
                <div style={{ fontFamily: F_SANS, fontSize: '13.5px', color: C.text2, lineHeight: '1.75', marginBottom: '22px' }}>
                  <em style={{ fontStyle: 'italic' }}>{s.name}</em>, {s.loc} — {s.role}. {s.context}
                </div>
                <div style={{ width: '24px', height: '1.5px', background: s.color, marginBottom: '14px' }} />
                <div style={{ fontFamily: F_SANS, fontWeight: '500', fontSize: '13.5px', color: C.text, lineHeight: '1.65' }}>{s.answer}</div>
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
    { label: 'Student',      sub: 'No salary yet',    serif: 'Starting out',   desc: 'Path to a ₹4.8L+ first offer. Student Mode reframes ROI around career investment, not salary hike.' },
    { label: 'Switcher',     sub: 'Changing domains', serif: 'New direction',  desc: 'Domain switch in 5–8 months. Only fast-track options shown. Long certs hidden unless you ask.' },
    { label: 'Professional', sub: 'Levelling up',     serif: 'Higher altitude', desc: 'Maximum ROI on your next cert. Break-even analysis, city benchmarks, and a pitch-your-boss email.' },
  ]

  return (
    <div style={{ paddingTop: 'clamp(72px,10vw,120px)', paddingBottom: 'clamp(72px,10vw,120px)', background: C.bg }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>Choose your path</div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: 'clamp(1.7rem,4.5vw,3rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          Three modes.<br /><span style={{ color: C.greenVivid }}>One tool.</span>
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', borderTop: '1px solid ' + C.border, position: 'relative' }}>
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
                style={{ padding: 'clamp(32px,5vw,52px) 0', paddingLeft: !isMobile && i > 0 ? 'clamp(24px,3vw,40px)' : '0', paddingRight: !isMobile && i < 2 ? 'clamp(24px,3vw,40px)' : '0', borderBottom: isMobile && !isLast ? '1px solid ' + C.border : 'none' }}>
                <div style={{ marginBottom: '20px' }}>
                  <WaypointDot active={false} color={C.text3} size={8} />
                </div>
                <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontSize: '18px', color: C.text2, marginBottom: '5px', fontWeight: '400' }}>{m.serif}</div>
                <div style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: 'clamp(1rem,2vw,1.15rem)', color: C.text, letterSpacing: '-0.02em', marginBottom: '5px' }}>{m.label}</div>
                <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>{m.sub}</div>
                <div style={{ fontFamily: F_SANS, fontSize: '13.5px', color: C.text2, lineHeight: '1.8' }}>{m.desc}</div>
              </motion.div>
            )
          })}
        </div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.35 }}
          style={{ marginTop: isMobile ? '48px' : '64px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <PrimaryBtn onClick={onEnter}>Pick my mode <ArrowRight size={14} /></PrimaryBtn>
          <span style={{ fontFamily: F_MONO, fontSize: '11px', color: C.text3, letterSpacing: '0.06em' }}>No account required</span>
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SOCIAL PROOF — pull quotes, editorial
// ─────────────────────────────────────────────────────────
function SocialProof({ isMobile }) {
  var quotes = [
    { quote: 'CertifyROI said payback was month 8. It was month 7. Switched companies immediately. ₹6L hike.', name: 'Priya S.',   detail: 'Bangalore · Engineer → Cloud Architect', hike: '+₹6L/yr',     color: C.greenVivid },
    { quote: 'Was about to spend ₹12L on an MBA. The analysis showed a different path — 5 months, 1% of the cost.', name: 'Rahul M.',  detail: 'Hyderabad · Ops Manager → Data Analyst', hike: 'Saved ₹12L',  color: C.gold },
    { quote: 'Student Mode. India-specific. GCP placed 47 Pune freshers in Q1 2026. My ₹5.2L offer was one of them.', name: 'Ananya K.', detail: 'Pune · Fresh Graduate',                  hike: '₹5.2L offer', color: C.text2 },
  ]

  return (
    <div style={{ background: C.surface, borderTop: '1px solid ' + C.border, borderBottom: '1px solid ' + C.border, paddingTop: 'clamp(72px,10vw,120px)', paddingBottom: 'clamp(72px,10vw,120px)' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>From people who ran the numbers</div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: 'clamp(1.7rem,4.5vw,3rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          They chose the right route.<br /><span style={{ color: C.greenVivid }}>It worked.</span>
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {quotes.map(function (q, i) {
            var isLast = i === quotes.length - 1
            return (
              <motion.div key={i} variants={SLIDE_L} initial="hidden" whileInView="show" viewport={{ once: true }}
                style={{ paddingTop: i > 0 ? (isMobile ? '48px' : '64px') : '0', paddingBottom: !isLast ? (isMobile ? '48px' : '64px') : '0', borderBottom: !isLast ? '1px solid ' + C.border : 'none', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 160px', gap: isMobile ? '20px' : '56px', alignItems: 'end' }}>
                <div>
                  <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400', fontSize: 'clamp(1.1rem,2.8vw,1.75rem)', color: C.text, letterSpacing: '-0.01em', lineHeight: 1.35, marginBottom: '24px' }}>
                    "{q.quote}"
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ width: '20px', height: '1.5px', background: q.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: F_SANS, fontWeight: '500', fontSize: '13.5px', color: C.text }}>{q.name}</span>
                    <span style={{ fontFamily: F_MONO, fontSize: '11px', color: C.text3 }}>{q.detail}</span>
                  </div>
                </div>
                <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                  <div style={{ fontFamily: F_MONO, fontWeight: '500', fontSize: 'clamp(1.2rem,2.8vw,1.75rem)', color: C.gold, letterSpacing: '-0.04em', lineHeight: 1 }}>{q.hike}</div>
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
  { q: 'How accurate are the ROI calculations?',       a: 'Calculations are based on median salary data from Naukri, AmbitionBox, and LinkedIn India — updated quarterly. They are directional estimates, not guarantees. Actual outcomes vary by employer, negotiation, and market conditions.' },
  { q: 'Do I need to create an account?',              a: 'No. The ROI calculator, comparison tool, and city demand heatmap are all free with no signup. AI-powered features use free credits, after which a lightweight account is optional.' },
  { q: 'What certifications are covered?',             a: '103 certifications across 17 domains — cloud, data analytics, cybersecurity, finance (CFA, CA, CMA), project management, HR, medical, and government-mandated certifications like NISM.' },
  { q: 'Is this only useful for India?',               a: 'The salary benchmarks and demand data are India-specific — 8 major cities including Bangalore, Hyderabad, Pune, Mumbai, and Delhi. The ROI framework applies anywhere, but numbers are calibrated for the Indian job market.' },
  { q: 'How does the Resume AI work?',                 a: 'Upload a resume or paste your profile. The AI reads your domain, role, experience, and skill set, then recommends the highest-ROI certifications for your specific background — not a generic list.' },
  { q: 'What if my certification isn\'t in the list?', a: 'Use the manual calculator — enter cert cost, current salary, and expected hike. It returns payback period and 5-year net gain regardless of whether the cert is indexed.' },
]

function FAQItem({ item }) {
  var [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid ' + C.border }}>
      <button
        onClick={function () { setOpen(function (v) { return !v }) }}
        style={{ width: '100%', padding: '22px 0', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontFamily: F_SANS, fontWeight: '500', fontSize: '15px', color: C.text, letterSpacing: '-0.01em', lineHeight: 1.4 }}>{item.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} style={{ flexShrink: 0 }}>
          <ChevronDown size={16} color={C.text3} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="ans" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: 'hidden' }}>
            <div style={{ paddingBottom: '24px', fontFamily: F_SANS, fontSize: '14px', color: C.text2, lineHeight: '1.8', maxWidth: '68ch' }}>{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQ({ isMobile }) {
  return (
    <div style={{ paddingTop: 'clamp(72px,10vw,120px)', paddingBottom: 'clamp(72px,10vw,120px)', background: C.bg }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr', gap: isMobile ? '40px' : '80px', alignItems: 'start' }}>
          <div style={{ position: isMobile ? 'static' : 'sticky', top: '96px' }}>
            <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
              style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>
              Questions
            </motion.div>
            <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
              style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: C.text, letterSpacing: '-0.025em', lineHeight: 1.15, marginTop: 0, marginBottom: 0 }}>
              Common<br />questions<br />answered.
            </motion.h2>
          </div>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div style={{ borderTop: '1px solid ' + C.border }}>
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
// ─────────────────────────────────────────────────────────
function FinalCTA({ isMobile, onEnter }) {
  return (
    <div style={{ background: C.surface, borderTop: '1px solid ' + C.border, paddingTop: isMobile ? '80px' : '120px', paddingBottom: isMobile ? '80px' : '120px', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle contour cluster top-right */}
      <div style={{ position: 'absolute', right: '-30px', top: '-30px', pointerEvents: 'none', opacity: 0.3 }}>
        <svg width="240" height="240" viewBox="-120 -120 240 240">
          {[30, 55, 80, 105, 130].map(function (r, i) {
            return (
              <ellipse key={i} cx="0" cy="0" rx={r} ry={r * 0.64}
                fill="none" stroke={C.lineHeavy} strokeWidth="0.65"
                transform="rotate(18)" opacity={i === 0 ? 0.55 : 0.35}
              />
            )
          })}
        </svg>
      </div>

      <div style={{ maxWidth: '980px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px', position: 'relative', zIndex: 1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: F_MONO, fontSize: '11px', color: C.text3, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '28px' }}>
          2 minutes from now
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400', fontSize: 'clamp(2.6rem,8vw,5.5rem)', color: C.text, letterSpacing: '-0.02em', lineHeight: 0.96, marginTop: 0, marginBottom: '36px', maxWidth: '16ch' }}>
          You'll know<br />the answer.
        </motion.h2>
        <motion.p variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }}
          style={{ fontFamily: F_SANS, fontSize: 'clamp(14px,2vw,16px)', color: C.text2, lineHeight: '1.85', maxWidth: '40ch', margin: '0 0 44px' }}>
          Stop reading about certifications. Stop asking Reddit.{' '}
          <span style={{ color: C.text, fontWeight: '500' }}>Know the payback period before you pay the fee.</span>
        </motion.p>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.18 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <PrimaryBtn onClick={onEnter} large={true}>Calculate ROI <ArrowRight size={16} /></PrimaryBtn>
            <GhostBtn onClick={onEnter}>See a sample report →</GhostBtn>
          </div>
          <div style={{ fontFamily: F_MONO, fontSize: '11px', color: C.text3, letterSpacing: '0.08em' }}>No signup · Free · India salary data 2026</div>
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
    <div style={{ borderTop: '1px solid ' + C.border, background: C.bg, padding: isMobile ? '32px 24px' : '40px 80px' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ElevationMark size={16} color={C.greenVivid} />
          <span style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: '15px', letterSpacing: '-0.02em', color: C.text }}>
            Certify
          </span>
          <span style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400', fontSize: '17px', color: C.gold, marginLeft: '1px' }}>
            ROI
          </span>
        </div>
        <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text4, letterSpacing: '0.08em' }}>
          DATA: LINKEDIN · NASSCOM · AMBITIONBOX · NAUKRI · WEF 2026
        </div>
        <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text4, letterSpacing: '0.06em' }}>
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
  var mountainY = useTransform(heroSP, [0, 1], [0, isMobile ? 30 : 80])
  var textY     = useTransform(heroSP, [0, 1], [0, isMobile ? -12 : -40])
  var heroOp    = useTransform(heroSP, [0, 0.7], [1, 0])
  var bgScale   = useTransform(heroSP, [0, 1], [1, 1.04])
  var bgOp      = useTransform(heroSP, [0, 1], [1, 0])

  return (
    <div style={{ minHeight: '100vh', background: C.bg, overflowX: 'hidden' }}>

      {/* ────────────────────────────────────────────────
          HERO — DARK EDITORIAL POSTER
          Mountain fills right 55% of viewport, CONSTRAINED
          to hero section (does NOT bleed into carousel).
          Text left-anchored.
          No theme toggle anywhere.
      ──────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          position: 'relative',
          height: isMobile ? '92vh' : '100vh',
          minHeight: isMobile ? '560px' : '600px',
          maxHeight: isMobile ? '800px' : '900px',
          marginTop: 'var(--nav-h, 64px)',
          overflow: 'hidden',         /* CRITICAL: mountain cannot escape this box */
          borderBottom: '1px solid ' + C.border,
        }}
      >

        {/* ── EDITORIAL BG TEXT: CERTIFY ── */}
        <motion.div
          style={{ scale: bgScale, opacity: bgOp, position: 'absolute', top: '50%', left: '50%', x: '-50%', y: '-50%', zIndex: 0, pointerEvents: 'none', width: '100%', textAlign: 'center' }}
        >
          <div style={{
            fontFamily: F_SANS,
            fontWeight: 900,
            fontSize: isMobile ? '38vw' : '26vw',
            lineHeight: 0.78,
            letterSpacing: '-0.03em',
            WebkitTextStroke: '1px rgba(235,232,227,0.06)',
            color: 'transparent',
            userSelect: 'none',
          }}>
            CERTIFY
          </div>
        </motion.div>

        {/* ── MOUNTAIN — contained inside hero, floats to bottom edge ── */}
        <motion.div
          style={{
            y: mountainY,
            position: 'absolute',
            right: isMobile ? '-5%' : '-2%',
            bottom: '-2%',     /* anchored to BOTTOM — never spills below hero */
            width: isMobile ? '110%' : '62%',
            height: isMobile ? '70%' : '95%',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <MountainSVG width={680} height={560} />

          {/* Summit stats card — floats near peak */}
          {!isMobile && <SummitStats />}
        </motion.div>

        {/* ── ARCHITECTURAL FRAME MARKS — desktop only ── */}
        {!isMobile && (
          <div style={{ position: 'absolute', inset: '40px', pointerEvents: 'none', zIndex: 3 }}>
            {/* Corner crosshairs */}
            {[
              { t: 0, l: 0 }, { t: 0, r: 0 },
              { b: 0, l: 0 }, { b: 0, r: 0 },
            ].map(function (pos, i) {
              return (
                <div key={i} style={{ position: 'absolute', ...pos }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: 'block' }}>
                    <line x1="6" y1="0" x2="6" y2="12" stroke={C.text3} strokeWidth="0.45" strokeOpacity="0.4" />
                    <line x1="0" y1="6" x2="12" y2="6" stroke={C.text3} strokeWidth="0.45" strokeOpacity="0.4" />
                    <circle cx="6" cy="6" r="0.8" fill={C.text3} fillOpacity="0.3" />
                  </svg>
                </div>
              )
            })}

            {/* LEFT VERTICAL LABEL — personality: editorial coordinate */}
            <div style={{
              position: 'absolute',
              left: '-18px',
              top: '50%',
              transform: 'translateY(-50%) rotate(-90deg)',
              transformOrigin: 'center center',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              whiteSpace: 'nowrap',
            }}>
              <span style={{
                fontFamily: F_MONO,
                fontSize: '9px',
                color: C.text4,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}>
                01 ·
              </span>
              <span style={{
                fontFamily: F_SERIF,
                fontStyle: 'italic',
                fontSize: '13px',
                color: C.text3,
                letterSpacing: '0.04em',
              }}>
                Elevation Base Camp
              </span>
            </div>

            {/* RIGHT VERTICAL LABEL — personality: editorial stamp */}
            <div style={{
              position: 'absolute',
              right: '-18px',
              bottom: '18%',
              transform: 'rotate(90deg)',
              transformOrigin: 'center center',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              whiteSpace: 'nowrap',
            }}>
              <span style={{
                fontFamily: F_SERIF,
                fontStyle: 'italic',
                fontSize: '13px',
                color: C.text3,
                letterSpacing: '0.04em',
              }}>
                India Market Data
              </span>
              <span style={{
                fontFamily: F_MONO,
                fontSize: '9px',
                color: C.text4,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}>
                · 2026
              </span>
            </div>
          </div>
        )}

        {/* ── HERO TEXT — left anchored, z above mountain ── */}
        <motion.div
          style={{ y: textY, opacity: heroOp, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 4, display: 'flex', alignItems: 'center' }}
        >
          <div style={{ padding: isMobile ? '0 24px' : '0 0 0 80px', maxWidth: isMobile ? '100%' : '52%' }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: isMobile ? '24px' : '32px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <div style={{ width: '20px', height: '1px', background: C.border }} />
              ROI Analysis Platform
              <SummitFlag color={C.gold} />
            </motion.div>

            {/* HEADLINE — the required exact text, maximised for punch */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: F_SERIF,
                fontWeight: '400',
                fontSize: isMobile ? 'clamp(2.8rem,10vw,4rem)' : 'clamp(3rem,5.5vw,5.2rem)',
                lineHeight: 0.94,
                letterSpacing: '-0.025em',
                color: C.text,
                marginBottom: isMobile ? '28px' : '36px',
                marginTop: 0,
              }}
            >
              Your next cert<br />
              is either a{' '}
              <span style={{ color: C.gold }}>goldmine</span><br />
              or a{' '}
              <span style={{ color: C.text4, fontStyle: 'italic' }}>mistake.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.42, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: F_SANS, fontSize: isMobile ? '14px' : 'clamp(14px,1.4vw,16px)', color: C.text2, maxWidth: '380px', lineHeight: '1.75', margin: '0 0 36px', fontWeight: '400' }}
            >
              Know the exact payback period before you pay the fee.
              Calculated for your city and current salary.
            </motion.p>

            {/* CTA — capsule button */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.56, duration: 0.8 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}
            >
              <PrimaryBtn onClick={onEnter} large={true}>
                Calculate ROI <ArrowRight size={16} strokeWidth={2} />
              </PrimaryBtn>

              {/* "No account required" — with personality */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '7px 14px',
                borderRadius: '999px',
                border: '1px solid ' + C.border,
                background: 'rgba(235,232,227,0.04)',
              }}>
                {/* Pulsing green dot — live indicator */}
                <span style={{ position: 'relative', display: 'inline-flex', width: '7px', height: '7px', flexShrink: 0 }}>
                  <motion.span
                    animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: C.greenVivid }}
                  />
                  <span style={{ position: 'relative', display: 'inline-flex', width: '7px', height: '7px', borderRadius: '50%', background: C.greenVivid }} />
                </span>
                <span style={{ fontFamily: F_SANS, fontSize: '12px', color: C.text2, fontWeight: '400' }}>
                  Free tool
                </span>
                <span style={{ width: '1px', height: '12px', background: C.border, flexShrink: 0 }} />
                <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.08em' }}>
                  No account required
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile summit stats — below text in flow */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{ position: 'absolute', bottom: '8%', left: '24px', zIndex: 10 }}
          >
            <div style={{ display: 'flex', gap: '20px', background: 'rgba(13,12,11,0.75)', backdropFilter: 'blur(10px)', border: '1px solid ' + C.borderMid, borderRadius: '8px', padding: '12px 16px' }}>
              {[{ v: '9 mo', l: 'Summit', c: C.text }, { v: '₹14.2L', l: '5yr gain', c: C.gold }, { v: '+35%', l: 'Elevation', c: C.greenVivid }].map(function (s, i) {
                return (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: F_MONO, fontSize: '6.5px', color: C.text4, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>{s.l}</div>
                    <div style={{ fontFamily: F_MONO, fontSize: '15px', color: s.c, letterSpacing: '-0.03em', fontWeight: '500' }}>{s.v}</div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── REST OF PAGE — starts immediately below the hero border ── */}
      <TrustStrip />
      <CertAssembly />
      <DataComposition isMobile={isMobile} />
      <Rule />
      <HowItWorks isMobile={isMobile} onEnter={onEnter} />
      <VsSection isMobile={isMobile} />
      <ElevenPM isMobile={isMobile} onEnter={onEnter} />
      <ThreeModes isMobile={isMobile} onEnter={onEnter} />
      <SocialProof isMobile={isMobile} />
      <Rule />
      <FAQ isMobile={isMobile} />
      <FinalCTA isMobile={isMobile} onEnter={onEnter} />
      <PageFooter isMobile={isMobile} />

    </div>
  )
}

export default LandingPage