import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import { ArrowRight, TrendingUp } from 'lucide-react'

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

function useInView(threshold) {
  threshold = threshold || 0.15
  var ref = useRef(null)
  var [inView, setInView] = useState(false)
  useEffect(function() {
    var el = ref.current
    if (!el) return
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: threshold })
    obs.observe(el)
    return function() { obs.disconnect() }
  }, [threshold])
  return [ref, inView]
}

// ─────────────────────────────────────────────────────────
// DESIGN SYSTEM — Mountain + Navigation
// ─────────────────────────────────────────────────────────
var F_SERIF = "'Cormorant Garamond', Georgia, serif"
var F_SANS  = "'DM Sans', 'Inter', sans-serif"
var F_MONO  = "'IBM Plex Mono', 'JetBrains Mono', monospace"

// Light mode palette (primary — this is a warm-stone light design)
var L = {
  bg:          '#F5F1EB',
  surface:     '#EDEAE3',
  surfaceHigh: '#E5E1D9',
  text:        '#1C1A17',
  text2:       '#6B6560',
  text3:       '#9E9890',
  green:       '#2D6A4F',
  greenL:      '#4A8C6A',
  gold:        '#A67C3C',
  line:        '#C8C3BB',
  btnFill:     '#1C1A17',
  btnText:     '#F5F1EB',
  border:      '#D9D4CC',
}

// Dark mode palette — same warmth logic, inverted
var D = {
  bg:          '#131110',
  surface:     '#1C1A17',
  surfaceHigh: '#252220',
  text:        '#EDE9E3',
  text2:       '#9E9890',
  text3:       '#6B6560',
  green:       '#4A8C6A',
  greenL:      '#5EA87E',
  gold:        '#C49A4E',
  line:        '#2E2B27',
  btnFill:     '#EDE9E3',
  btnText:     '#1C1A17',
  border:      '#2E2B27',
}

// ─────────────────────────────────────────────────────────
// MOTION VARIANTS
// ─────────────────────────────────────────────────────────
var RISE = {
  hidden: { y: 24, opacity: 0 },
  show:   { y: 0,  opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}
var SLIDE_LEFT = {
  hidden: { x: -40, opacity: 0 },
  show:   { x: 0,   opacity: 1, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
}
var SLIDE_RIGHT = {
  hidden: { x: 40, opacity: 0 },
  show:   { x: 0,  opacity: 1, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
}

// ─────────────────────────────────────────────────────────
// CONTOUR CLUSTER SVG
// Dense concentric elliptical rings — terrain, not decoration
// ─────────────────────────────────────────────────────────
function ContourCluster({ rings, cx, cy, rx, ry, color, opacity, rotate }) {
  rings   = rings   || 10
  cx      = cx      || 0
  cy      = cy      || 0
  rx      = rx      || 80
  ry      = ry      || 50
  color   = color   || '#C8C3BB'
  opacity = opacity || 0.4
  rotate  = rotate  || 0

  return (
    <g transform={'rotate(' + rotate + ',' + cx + ',' + cy + ')'} opacity={opacity}>
      {Array.from({ length: rings }).map(function(_, i) {
        var step = i * 14
        return (
          <ellipse
            key={i}
            cx={cx} cy={cy}
            rx={rx + step} ry={ry + step * 0.6}
            fill="none"
            stroke={color}
            strokeWidth="0.75"
          />
        )
      })}
    </g>
  )
}

// ─────────────────────────────────────────────────────────
// ELEVATION ARC — brand logo mark
// A single smooth mountain ridgeline arc
// ─────────────────────────────────────────────────────────
function ElevationMark({ size, color }) {
  size  = size  || 18
  color = color || '#2D6A4F'
  var w = size
  var h = size * 0.65
  return (
    <svg width={w} height={h} viewBox={'0 0 ' + w + ' ' + h} fill="none" style={{ display: 'block' }}>
      <path
        d={'M 0 ' + h + ' Q ' + (w * 0.25) + ' ' + (h * 0.1) + ' ' + (w * 0.5) + ' ' + (h * 0.2) + ' Q ' + (w * 0.75) + ' ' + (h * 0.35) + ' ' + w + ' ' + h}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Summit peak */}
      <circle cx={w * 0.5} cy={h * 0.2} r="2" fill={color} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// SUMMIT FLAG — appears only on the winning cert / best ROI
// One per screen, never duplicated
// ─────────────────────────────────────────────────────────
function SummitFlag({ color }) {
  color = color || '#A67C3C'
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <line x1="3" y1="1" x2="3" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 3 1 L 13 5 L 3 9 Z" fill={color} fillOpacity="0.85" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// WAYPOINT DOT — step marker
// Filled circle + outer ring — replaces "Step 1 / 2 / 3"
// ─────────────────────────────────────────────────────────
function WaypointDot({ active, color, size }) {
  active = active !== false
  color  = color || '#1C1A17'
  size   = size  || 10
  return (
    <svg width={size + 8} height={size + 8} viewBox={'0 0 ' + (size + 8) + ' ' + (size + 8)} fill="none">
      <circle cx={(size + 8) / 2} cy={(size + 8) / 2} r={size / 2 + 3}
        stroke={color} strokeWidth="1.5" strokeOpacity={active ? 0.35 : 0.15} />
      <circle cx={(size + 8) / 2} cy={(size + 8) / 2} r={size / 2 - 1}
        fill={active ? color : 'none'} stroke={color} strokeWidth="1.5" strokeOpacity={active ? 1 : 0.3} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// HORIZON BANDS — section dividers
// 3 stone-tone layers with slight curves — terrain transitions
// ─────────────────────────────────────────────────────────
function HorizonBands({ C }) {
  return (
    <div style={{ position: 'relative', height: '56px', overflow: 'hidden', pointerEvents: 'none' }}>
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" width="100%" height="56"
        style={{ position: 'absolute', inset: 0, display: 'block' }}>
        {/* Back layer */}
        <path d={'M 0 28 Q 360 18 720 28 Q 1080 38 1440 28 L 1440 56 L 0 56 Z'}
          fill={C.surfaceHigh} />
        {/* Middle layer */}
        <path d={'M 0 34 Q 480 24 720 34 Q 960 44 1440 34 L 1440 56 L 0 56 Z'}
          fill={C.surface} opacity="0.7" />
        {/* Front layer */}
        <path d={'M 0 40 Q 240 30 720 40 Q 1200 50 1440 40 L 1440 56 L 0 56 Z'}
          fill={C.surface} />
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// ELEVATION CHART — hero right panel
// Salary trajectory lines — the product preview AS the visual
// ─────────────────────────────────────────────────────────
function ElevationChart({ C, animate }) {
  var [drawn, setDrawn] = useState(false)

  useEffect(function() {
    if (animate) {
      var t = setTimeout(function() { setDrawn(true) }, 300)
      return function() { clearTimeout(t) }
    }
  }, [animate])

  // 36 data points — months 0→36
  // "Without cert" salary: linear +0.8% per month
  // "With cert" salary: dips for 3 months (study time), then accelerates post-cert
  var W = 480
  var H = 280
  var PAD = { top: 24, right: 32, bottom: 48, left: 48 }
  var chartW = W - PAD.left - PAD.right
  var chartH = H - PAD.top  - PAD.bottom

  var months = 36
  var baseSalary = 8 // lakhs
  var certCost   = 0.8 // lakhs
  var postHike   = 0.32 // 32% hike

  var withoutPoints = []
  var withPoints    = []

  for (var m = 0; m <= months; m++) {
    var baseGrowth  = baseSalary * (1 + 0.008 * m)
    var certGrowth  = m < 3
      ? baseSalary - certCost * (m / 3)  // cost period
      : baseSalary * (1 + postHike) * (1 + 0.006 * (m - 3))

    withoutPoints.push({ x: m / months, y: baseGrowth })
    withPoints.push({ x: m / months, y: certGrowth })
  }

  // Normalize to chart bounds
  var allY = [...withoutPoints, ...withPoints].map(function(p) { return p.y })
  var minY  = Math.min(...allY) - 0.5
  var maxY  = Math.max(...allY) + 0.5

  function toSVG(points) {
    return points.map(function(p, i) {
      var x = PAD.left + p.x * chartW
      var y = PAD.top + (1 - (p.y - minY) / (maxY - minY)) * chartH
      return (i === 0 ? 'M' : 'L') + ' ' + x + ' ' + y
    }).join(' ')
  }

  // Find breakeven month — where withPoints first exceeds withoutPoints after cert cost
  var breakevenMonth = 9
  var breakevenX = PAD.left + (breakevenMonth / months) * chartW
  var breakevenWithout = withoutPoints[breakevenMonth]
  var breakevenY = PAD.top + (1 - (breakevenWithout.y - minY) / (maxY - minY)) * chartH

  var withPath    = toSVG(withPoints)
  var withoutPath = toSVG(withoutPoints)

  // Month labels
  var monthLabels = [0, 9, 18, 27, 36]

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox={'0 0 ' + W + ' ' + H} width="100%" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          {/* Isometric elevation grid — graph-paper feel */}
          <pattern id="isoGrid" x="0" y="0" width="24" height="14" patternUnits="userSpaceOnUse">
            <path d="M 0 7 L 12 0 L 24 7" fill="none" stroke={C.line} strokeWidth="0.4" strokeOpacity="0.5" />
          </pattern>

          {/* Clip path for animated draw */}
          <clipPath id="drawClip">
            <motion.rect
              x={PAD.left} y={PAD.top}
              width={drawn ? chartW : 0} height={chartH}
              animate={{ width: drawn ? chartW : 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </clipPath>

          <linearGradient id="greenFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.green} stopOpacity="0.12" />
            <stop offset="100%" stopColor={C.green} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid background — elevation graph paper */}
        <rect x={PAD.left} y={PAD.top} width={chartW} height={chartH}
          fill="url(#isoGrid)" opacity="0.6" />

        {/* Subtle horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map(function(pct, i) {
          var y = PAD.top + pct * chartH
          return (
            <line key={i} x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y}
              stroke={C.line} strokeWidth="0.6" strokeOpacity="0.5" />
          )
        })}

        {/* X axis */}
        <line x1={PAD.left} y1={PAD.top + chartH} x2={PAD.left + chartW} y2={PAD.top + chartH}
          stroke={C.line} strokeWidth="1" />

        {/* Y axis */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + chartH}
          stroke={C.line} strokeWidth="1" />

        {/* Month labels */}
        {monthLabels.map(function(m) {
          var x = PAD.left + (m / months) * chartW
          return (
            <text key={m} x={x} y={H - 14}
              textAnchor="middle" fontSize="9"
              style={{ fontFamily: F_MONO }} fill={C.text3}>
              {m === 0 ? 'Now' : 'Mo ' + m}
            </text>
          )
        })}

        {/* Y axis label */}
        <text x={16} y={PAD.top + chartH / 2}
          textAnchor="middle" fontSize="9"
          style={{ fontFamily: F_MONO }} fill={C.text3}
          transform={'rotate(-90 16 ' + (PAD.top + chartH / 2) + ')'}>
          ₹ Lakhs
        </text>

        {/* Without cert — dashed stone line */}
        <path d={withoutPath} fill="none"
          stroke={C.text3} strokeWidth="1.5" strokeDasharray="5 4"
          clipPath="url(#drawClip)" />

        {/* With cert — green area fill */}
        <motion.path
          d={withPath + ' L ' + (PAD.left + chartW) + ' ' + (PAD.top + chartH) + ' L ' + PAD.left + ' ' + (PAD.top + chartH) + ' Z'}
          fill="url(#greenFade)"
          clipPath="url(#drawClip)"
          initial={{ opacity: 0 }}
          animate={{ opacity: drawn ? 1 : 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        />

        {/* With cert — solid green route line */}
        <path d={withPath} fill="none"
          stroke={C.green} strokeWidth="2"
          clipPath="url(#drawClip)" />

        {/* Breakeven waypoint marker */}
        {drawn && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformOrigin: breakevenX + 'px ' + breakevenY + 'px' }}
          >
            {/* Outer ring */}
            <circle cx={breakevenX} cy={breakevenY} r="10"
              fill={C.green} fillOpacity="0.1" stroke={C.green} strokeWidth="1" strokeDasharray="3 2" />
            {/* Inner dot */}
            <circle cx={breakevenX} cy={breakevenY} r="4.5"
              fill={C.green} />
            {/* Vertical drop line to x-axis */}
            <line x1={breakevenX} y1={breakevenY + 6} x2={breakevenX} y2={PAD.top + chartH}
              stroke={C.green} strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.5" />
          </motion.g>
        )}

        {/* Breakeven label */}
        {drawn && (
          <motion.g
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.4 }}
          >
            <rect x={breakevenX - 58} y={breakevenY - 42}
              width="116" height="28" rx="4"
              fill={C.surface} stroke={C.green} strokeWidth="0.75" strokeOpacity="0.5" />
            <text x={breakevenX} y={breakevenY - 26 - 2}
              textAnchor="middle" fontSize="8.5" fontWeight="500"
              style={{ fontFamily: F_MONO }} fill={C.green}>
              Summit reached · Month 9
            </text>
            <text x={breakevenX} y={breakevenY - 16}
              textAnchor="middle" fontSize="8"
              style={{ fontFamily: F_MONO }} fill={C.text3}>
              Cert cost recovered
            </text>
          </motion.g>
        )}

        {/* Legend */}
        <g>
          <line x1={PAD.left + 4} y1={PAD.top + 12}
            x2={PAD.left + 22} y2={PAD.top + 12}
            stroke={C.green} strokeWidth="2" />
          <text x={PAD.left + 26} y={PAD.top + 16}
            fontSize="9" style={{ fontFamily: F_MONO }} fill={C.text2}>
            With certification
          </text>

          <line x1={PAD.left + 4} y1={PAD.top + 26}
            x2={PAD.left + 22} y2={PAD.top + 26}
            stroke={C.text3} strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={PAD.left + 26} y={PAD.top + 30}
            fontSize="9" style={{ fontFamily: F_MONO }} fill={C.text3}>
            Without certification
          </text>
        </g>

      </svg>

      {/* Chart label */}
      <div style={{ position: 'absolute', top: 0, right: 0, fontFamily: F_MONO, fontSize: '9px', color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        AWS SAA · ₹9L salary · Bangalore
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CERT ASSEMBLY — unchanged, working sticky scroll animation
// ─────────────────────────────────────────────────────────
function CertAssembly({ C }) {
  var isDark = useIsDark()
  var isMobile = useIsMobile()

  var certBg    = isDark ? '#04060e'                : '#F8F7F4'
  var certText1 = isDark ? '#F0F2FF'                : '#0F172A'
  var certText2 = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,23,42,0.45)'
  var certMuted = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.3)'
  var certDot   = isDark ? 'rgba(99,102,241,0.2)'   : 'rgba(99,102,241,0.15)'
  var overlayBg = isDark ? '#020408'                : C.bg

  var trackRef    = useRef(null)
  var { scrollY } = useScroll()
  var [prog, setProg] = useState(0)

  useEffect(function() {
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
  var l1, l2, l3
  if (isMobile) {
    l1 = 'translateY(' + remap(p8,0,1,-50,0) + 'px) rotateZ(' + remap(p8,0,1,3,0) + 'deg)'
    l2 = 'translateY(' + remap(p8,0,1,50,0)  + 'px) rotateZ(' + remap(p8,0,1,-2,0) + 'deg)'
    l3 = 'translateY(' + remap(p8,0,1,-25,0) + 'px) scale('   + remap(p8,0,1,0.88,1) + ')'
  } else {
    l1 = 'perspective(1200px) translateZ('+remap(p8,0,1,-280,0)+'px) translateY('+remap(p8,0,1,-80,0)+'px) rotateY('+remap(p8,0,1,32,0)+'deg) rotateX('+remap(p8,0,1,15,0)+'deg)'
    l2 = 'perspective(1200px) translateZ('+remap(p8,0,1,280,0)+'px) translateY('+remap(p8,0,1,80,0)+'px) rotateY('+remap(p8,0,1,-26,0)+'deg) rotateX('+remap(p8,0,1,-12,0)+'deg)'
    l3 = 'perspective(1200px) translateZ('+remap(p8,0,1,-140,0)+'px) translateY('+remap(p8,0,1,-30,0)+'px) rotateY('+remap(p8,0,1,15,0)+'deg) rotateX('+remap(p8,0,1,6,0)+'deg)'
  }

  var certScale   = prog < 0.8 ? remap(prog,0,0.8,0.62,1.0) : remap(prog,0.8,1.0,1.0,0.85)
  var certOpacity = prog < 0.05 ? remap(prog,0,0.05,0,1) : prog > 0.85 ? remap(prog,0.85,1.0,1,0) : 1
  var overlayOp   = prog < 0.08 ? remap(prog,0,0.08,0,0.94) : prog > 0.92 ? remap(prog,0.92,1,0.94,0) : 0.94
  var hintOp      = prog > 0.16 ? 0 : prog > 0.06 ? remap(prog,0.06,0.16,1,0) : 1
  var assembledOp = remap(prog,0.78,0.88,0,1)

  return (
    <div ref={trackRef} style={{ height: '300vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: overlayBg, opacity: overlayOp }} />
        <div style={{ position: 'relative', zIndex: 4 }}>
          <div style={{ transform: 'scale(' + certScale + ')', opacity: certOpacity }}>
            <div style={{ position: 'relative', width: isMobile ? 'min(320px,88vw)' : 'min(500px,88vw)', height: 'calc(' + (isMobile ? 'min(320px,88vw)' : 'min(500px,88vw)') + ' / 1.414)', transformStyle: 'preserve-3d' }}>
              <div style={{ position: 'absolute', inset: 0, transform: l1 }}>
                <svg viewBox="0 0 500 354" width="100%" height="100%" style={{ position: 'absolute', inset: 0, display: 'block' }}>
                  <defs>
                    <linearGradient id="cBorder2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"   stopColor="#2D6A4F"/>
                      <stop offset="40%"  stopColor="#4A8C6A"/>
                      <stop offset="100%" stopColor="#A67C3C"/>
                    </linearGradient>
                    <filter id="cGlow2">
                      <feGaussianBlur stdDeviation="2" result="b"/>
                      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>
                  <rect x="0" y="0" width="500" height="354" rx="4" fill={certBg} fillOpacity="0.97"/>
                  <rect x="1.5" y="1.5" width="497" height="351" rx="3" fill="none" stroke="url(#cBorder2)" strokeWidth="1.5" filter="url(#cGlow2)"/>
                  {[[22,22],[478,22],[22,332],[478,332]].map(function(arr, i) {
                    var cx = arr[0], cy = arr[1]
                    return (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="4" fill="none" stroke="#2D6A4F" strokeWidth="1.2"/>
                        <circle cx={cx} cy={cy} r="8" fill="none" stroke="rgba(45,106,79,0.2)" strokeWidth="0.6"/>
                        <line x1={cx-10} y1={cy} x2={cx+10} y2={cy} stroke="rgba(45,106,79,0.35)" strokeWidth="0.6"/>
                        <line x1={cx} y1={cy-10} x2={cx} y2={cy+10} stroke="rgba(45,106,79,0.35)" strokeWidth="0.6"/>
                      </g>
                    )
                  })}
                  <line x1="40" y1="1.5" x2="90" y2="1.5" stroke="#2D6A4F" strokeWidth="2.5"/>
                  <line x1="410" y1="1.5" x2="460" y2="1.5" stroke="#A67C3C" strokeWidth="2.5"/>
                  <line x1="40" y1="352.5" x2="90" y2="352.5" stroke="#A67C3C" strokeWidth="2.5"/>
                  <line x1="410" y1="352.5" x2="460" y2="352.5" stroke="#2D6A4F" strokeWidth="2.5"/>
                </svg>
              </div>
              <div style={{ position: 'absolute', inset: 0, transform: l2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,4vw,40px)' }}>
                <div style={{ fontFamily: F_MONO, fontSize: '9px', color: 'rgba(45,106,79,0.7)', letterSpacing: '0.26em', marginBottom: '11px', textTransform: 'uppercase' }}>CERTIFYROI · INDIA 2026</div>
                <div style={{ fontFamily: F_SERIF, fontWeight: '600', fontSize: 'clamp(1rem,3.2vw,1.9rem)', letterSpacing: '-0.02em', color: certText1, marginBottom: '6px', textAlign: 'center', lineHeight: 1.1 }}>Route Briefing</div>
                <div style={{ fontFamily: F_SANS, fontSize: 'clamp(10px,1.5vw,12px)', color: certText2, marginBottom: '22px', textAlign: 'center' }}>Personalised ROI Analysis · Your City</div>
                <div style={{ display: 'flex', gap: 'clamp(10px,4vw,40px)', marginBottom: '18px' }}>
                  {[
                    { label: 'SUMMIT TIME', value: '9 mo',   color: '#2D6A4F' },
                    { label: '5-YR GAIN',   value: '₹14.2L', color: '#A67C3C' },
                    { label: 'ELEVATION',   value: '+35%',   color: '#4A8C6A' },
                  ].map(function(s, i) {
                    return (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: F_MONO, fontSize: '7px', color: certMuted, letterSpacing: '0.12em', marginBottom: '5px' }}>{s.label}</div>
                        <div style={{ fontFamily: F_MONO, fontSize: 'clamp(0.8rem,2.5vw,1.5rem)', color: s.color, fontWeight: '500', letterSpacing: '-0.03em' }}>{s.value}</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ width: '74%', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(45,106,79,0.4),transparent)', marginBottom: '12px' }} />
                <div style={{ fontFamily: F_MONO, fontSize: '7px', color: certMuted, letterSpacing: '0.14em', textAlign: 'center' }}>VERIFIED · DATA: NAUKRI MARCH 2026</div>
              </div>
              <div style={{ position: 'absolute', right: '6%', bottom: '8%', transform: l3 }}>
                <SummitFlag color="#A67C3C" />
              </div>
            </div>
          </div>
          <div style={{ opacity: hintOp, marginTop: '44px', textAlign: 'center', pointerEvents: 'none', transition: 'opacity 0.3s' }}>
            <motion.div animate={{ y: [0,8,0] }} transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '11px', color: C.text3, letterSpacing: '0.22em', textTransform: 'uppercase' }}>↓  scroll to assemble  ↓</div>
            </motion.div>
          </div>
        </div>
        <div style={{ opacity: assembledOp, position: 'absolute', bottom: '8%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 5, transition: 'opacity 0.3s' }}>
          <div style={{ fontFamily: F_MONO, fontSize: '12px', color: C.green, letterSpacing: '0.22em', textTransform: 'uppercase' }}>✓  ROUTE BRIEFING · ASSEMBLED</div>
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

  useEffect(function() {
    if (!on) return
    var endVal = parseFloat(String(end).replace(/[^0-9.]/g, ''))
    var frames = Math.round(duration * 60)
    var f = 0
    var t = setInterval(function() {
      f++
      var ease = 1 - Math.pow(1 - f / frames, 3)
      setCount(endVal * ease)
      if (f >= frames) { setCount(endVal); clearInterval(t) }
    }, 1000 / 60)
    return function() { clearInterval(t) }
  }, [on, end, duration])

  return (
    <motion.span onViewportEnter={function() { setOn(true) }}>
      {prefix}{count.toLocaleString('en-IN', { maximumFractionDigits: String(end).includes('.') ? 1 : 0 })}{suffix}
    </motion.span>
  )
}

// ─────────────────────────────────────────────────────────
// TICKER / TRUST STRIP
// ─────────────────────────────────────────────────────────
function TrustStrip({ C }) {
  var items = [
    'AWS cert holders earn ₹2.4L more/yr in Bangalore',
    '2,400+ cloud roles open on Naukri right now',
    'Average PMP summit: 7 months',
    'Google Analytics: ₹18K invested → ₹3.2L annual gain',
    'CKA Kubernetes: steepest climb, highest gain — +40%',
    'Hyderabad cloud demand up 38% in 2026',
  ]

  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid ' + C.border, borderBottom: '1px solid ' + C.border, padding: '11px 0', background: C.surface }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 44, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '80px', whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {[...items, ...items].map(function(item, i) {
          return (
            <span key={i} style={{ fontSize: '11px', color: C.text3, fontFamily: F_MONO, flexShrink: 0, letterSpacing: '0.03em' }}>
              <span style={{ color: C.green, marginRight: '14px', opacity: 0.6 }}>◆</span>{item}
            </span>
          )
        })}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// DATA COMPOSITION — numbers as the anchor
// ─────────────────────────────────────────────────────────
function DataComposition({ C, isMobile }) {
  return (
    <div style={{ paddingTop: 'clamp(80px,12vw,140px)', paddingBottom: 'clamp(80px,12vw,140px)', position: 'relative', overflow: 'hidden' }}>
      {/* Background contour cluster — medium */}
      <div style={{ position: 'absolute', right: '-60px', top: '40%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.35 }}>
        <svg width="300" height="300" viewBox="-150 -150 300 300">
          <ContourCluster rings={6} cx={0} cy={0} rx={60} ry={38} color={C.line} opacity={1} rotate={15} />
        </svg>
      </div>

      <div style={{ maxWidth: '920px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>
            The numbers behind every route
          </div>
        </motion.div>

        {/* Hero stat — large anchor */}
        <motion.div variants={SLIDE_LEFT} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ marginBottom: 'clamp(48px,8vw,96px)' }}>
          <div style={{ fontFamily: F_MONO, fontSize: 'clamp(3rem,14vw,8rem)', color: C.gold, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '500' }}>
            <CountUp end={14.2} prefix="₹" suffix="L" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontSize: 'clamp(1rem,2.5vw,1.4rem)', color: C.text2 }}>
              5-year net gain · AWS Solutions Architect
            </div>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Bangalore median · 2026
            </div>
          </div>
        </motion.div>

        {/* 2-column stat grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', borderTop: '1px solid ' + C.border }}>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ padding: isMobile ? '40px 0' : '56px 64px 56px 0', borderBottom: isMobile ? '1px solid ' + C.border : 'none', borderRight: isMobile ? 'none' : '1px solid ' + C.border }}>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Summit reached
            </div>
            <div style={{ fontFamily: F_MONO, fontSize: 'clamp(2.4rem,8vw,4.5rem)', color: C.text, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '500', marginBottom: '12px' }}>
              <CountUp end={6} suffix=" months" />
            </div>
            <div style={{ fontFamily: F_SANS, fontSize: '14px', color: C.text2, lineHeight: '1.75' }}>
              Not "a few months." The exact month your investment turns profitable — calculated for your salary and city.
            </div>
          </motion.div>

          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }}
            style={{ padding: isMobile ? '40px 0' : '56px 0 56px 64px' }}>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Elevation gained
            </div>
            <div style={{ fontFamily: F_MONO, fontSize: 'clamp(2.4rem,8vw,4.5rem)', color: C.text, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '500', marginBottom: '12px' }}>
              <CountUp end={35} suffix="%" />
            </div>
            <div style={{ fontFamily: F_SANS, fontSize: '14px', color: C.text2, lineHeight: '1.75' }}>
              India-sourced. City-specific. Not US data converted at today's rate and called "India salary insights."
            </div>
          </motion.div>
        </div>

        {/* Third stat — full width, different weight */}
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.2 }}
          style={{ borderTop: '1px solid ' + C.border, paddingTop: isMobile ? '40px' : '56px', display: 'flex', gap: isMobile ? '24px' : '56px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Monthly gain from month 7
            </div>
            <div style={{ fontFamily: F_MONO, fontSize: 'clamp(1.6rem,4.5vw,2.8rem)', color: C.green, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: '500' }}>
              ₹23,600
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
              103 routes charted
            </div>
            <div style={{ fontFamily: F_SANS, fontSize: '14px', color: C.text2, lineHeight: '1.8' }}>
              Across 17 domains — cloud, data, finance, medical, law, government. Every certification mapped to real hiring data from Naukri, AmbitionBox, and LinkedIn India.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// HOW IT WORKS — 3 waypoint steps
// Basecamp → Route → Summit
// ─────────────────────────────────────────────────────────
function HowItWorks({ C, isMobile, onEnter }) {
  var steps = [
    {
      id: 'basecamp',
      label: 'Basecamp',
      subtitle: 'Where you start',
      desc: 'Enter your current salary, role, and city. Upload your resume if you want AI to read your actual background. This is your starting elevation.',
      detail: 'No account required.',
    },
    {
      id: 'route',
      label: 'Route',
      subtitle: 'Choose your path',
      desc: 'Select a certification or let the AI recommend the highest-ROI route for your profile. Compare up to three routes side by side.',
      detail: 'India market data · 2026',
    },
    {
      id: 'summit',
      label: 'Summit',
      subtitle: 'Know the outcome',
      desc: 'See your route briefing: exact payback month, 5-year net gain in rupees, monthly salary delta, and a recommendation on whether the climb is worth making.',
      detail: 'Your numbers. Your decision.',
    },
  ]

  var [routeRef, routeInView] = useInView(0.3)

  return (
    <div style={{ background: C.surface, borderTop: '1px solid ' + C.border, borderBottom: '1px solid ' + C.border, paddingTop: 'clamp(72px,10vw,120px)', paddingBottom: 'clamp(72px,10vw,120px)' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>
            The route
          </div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: 'clamp(1.8rem,4.5vw,3rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          Three stages.<br />One clear answer.
        </motion.h2>

        {/* Route connector line */}
        <div ref={routeRef} style={{ position: 'relative' }}>
          {/* Animated route line connecting waypoints — desktop only */}
          {!isMobile && (
            <div style={{ position: 'absolute', top: '9px', left: '9px', right: '9px', height: '1px', overflow: 'visible', pointerEvents: 'none', zIndex: 0 }}>
              <svg width="100%" height="2" style={{ display: 'block', overflow: 'visible' }}>
                <motion.line
                  x1="0" y1="1" x2="100%" y2="1"
                  stroke={C.green} strokeWidth="1" strokeDasharray="6 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={routeInView ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? '0' : '0', position: 'relative', zIndex: 1 }}>
            {steps.map(function(step, i) {
              var isLast = i === steps.length - 1
              return (
                <motion.div key={step.id}
                  variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  style={{
                    paddingLeft:  !isMobile && i > 0   ? 'clamp(24px,3vw,40px)' : '0',
                    paddingRight: !isMobile && i < 2   ? 'clamp(24px,3vw,40px)' : '0',
                    paddingTop:   !isMobile             ? '48px'                  : 'clamp(32px,5vw,48px)',
                    paddingBottom: isMobile && !isLast  ? 'clamp(32px,5vw,48px)' : (isMobile ? '0' : '0'),
                    borderRight:  !isMobile && !isLast  ? '1px solid ' + C.border : 'none',
                    borderBottom: isMobile && !isLast   ? '1px solid ' + C.border : 'none',
                  }}
                >
                  {/* Waypoint dot */}
                  <div style={{ marginBottom: '20px' }}>
                    <WaypointDot active={true} color={C.green} size={10} />
                  </div>

                  <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontSize: '22px', color: C.green, marginBottom: '4px', fontWeight: '400' }}>
                    {step.label}
                  </div>
                  <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
                    {step.subtitle}
                  </div>
                  <div style={{ fontFamily: F_SANS, fontSize: '14px', color: C.text2, lineHeight: '1.8', marginBottom: '14px' }}>
                    {step.desc}
                  </div>
                  <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.06em' }}>
                    {step.detail}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.4 }}
          style={{ marginTop: 'clamp(48px,6vw,72px)', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={onEnter}
            style={{ padding: '0 32px', height: '48px', borderRadius: '4px', border: 'none', background: C.btnFill, color: C.btnText, fontSize: '15px', fontFamily: F_SANS, fontWeight: '500', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
            onMouseEnter={function(e) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(28,26,23,0.18)' }}
            onMouseLeave={function(e) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            Calculate My Route <ArrowRight size={15} />
          </button>
          <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.08em' }}>
            No signup required
          </span>
        </motion.div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// VS SECTION — strikethrough composition
// ─────────────────────────────────────────────────────────
function VsSection({ C, isMobile }) {
  var pairs = [
    { wrong: '"AWS is good for cloud engineers"',      right: 'AWS SAA at ₹9L salary: summit reached month 6. ₹14.2L net gain over 5 years. Or it isn\'t worth the climb.' },
    { wrong: '"Upskill for career growth"',            right: '₹23,600 extra every month from month 7. Compounding over 5 years. In rupees. Not "career growth."' },
    { wrong: 'US salary data converted to rupees',     right: 'Naukri. AmbitionBox. LinkedIn India. 2026 data. Not converted from San Francisco. Actually collected here.' },
    { wrong: 'The same advice for every professional', right: 'AI reads your resume. Sees your role. Sees your city. Maps your terrain. Then recommends a route.' },
  ]

  return (
    <div style={{ paddingTop: 'clamp(72px,10vw,120px)', paddingBottom: 'clamp(72px,10vw,120px)' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>
            The problem with every other guide
          </div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: 'clamp(1.8rem,4.5vw,3rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          Every other guide<br />
          <span style={{ color: '#8B2C2C' }}>is sending you up the wrong mountain.</span>
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(36px,5vw,52px)' }}>
          {pairs.map(function(pair, i) {
            return (
              <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                {/* Wrong — strikethrough */}
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '14px', maxWidth: '100%' }}>
                  <div style={{ fontFamily: F_SANS, fontWeight: '500', fontSize: 'clamp(0.9rem,2vw,1.2rem)', color: C.text, opacity: 0.2, letterSpacing: '-0.01em', lineHeight: 1.35, wordBreak: 'break-word' }}>
                    {pair.wrong}
                  </div>
                  <svg style={{ position: 'absolute', left: 0, top: '50%', width: '100%', height: '2px', overflow: 'visible', pointerEvents: 'none' }}>
                    <motion.line x1="0" y1="0" x2="100%" y2="0"
                      stroke="#8B2C2C" strokeWidth="1.5" strokeOpacity="0.35"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.2 + i * 0.06, ease: 'easeOut' }}
                    />
                  </svg>
                </div>

                {/* Correct */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.green, marginTop: '10px', flexShrink: 0 }} />
                  <div style={{ fontFamily: F_SANS, fontSize: 'clamp(14px,1.8vw,16px)', color: C.text, lineHeight: '1.75', fontWeight: '400' }}>
                    {pair.right}
                  </div>
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
// ELEVEN PM — stories as route briefings
// ─────────────────────────────────────────────────────────
function ElevenPM({ C, isMobile, onEnter }) {
  var stories = [
    { time: '11:47 PM', name: 'Rohan', loc: 'Pune', role: '2 yrs · Backend Engineer', thought: '"Should I do AWS? Or is it too late?"', context: 'Ex-classmate promoted to Senior Cloud Architect. ₹28L CTC. Same college, same year.', answer: 'AWS SAA at ₹9L: summit month 6. 5-year gain ₹14.2L. The route is clear.', color: C.green },
    { time: '11:12 PM', name: 'Sneha', loc: 'Bangalore', role: '6 yrs · Ops Manager', thought: '"Is the switch possible without an MBA?"', context: 'Every data job requires 3 years of data science experience. She has zero.', answer: 'Google Data Analytics + 2 GitHub projects. 5 months. ₹8L → ₹12L. Different mountain, shorter climb.', color: C.gold },
    { time: '12:03 AM', name: 'Arjun', loc: 'Pune', role: 'CS · Fresh graduate', thought: '"Which cert actually gets me placed in India?"', context: 'Three comparison articles. All recommend AWS. All written by Americans. All in USD.', answer: 'Student Mode. India-specific. GCP placed 47 Pune freshers in Q1 2026.', color: C.text2 },
  ]

  return (
    <div style={{ background: C.surface, borderTop: '1px solid ' + C.border, borderBottom: '1px solid ' + C.border, paddingTop: 'clamp(72px,10vw,120px)', paddingBottom: 'clamp(72px,10vw,120px)' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Who this is for
          </div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: 'clamp(1.8rem,4.5vw,3rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          We know what you're<br />thinking at 11pm.
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 0, borderTop: '1px solid ' + C.border }}>
          {stories.map(function(s, i) {
            var isLast = i === stories.length - 1
            return (
              <motion.div key={i}
                variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={onEnter}
                style={{
                  paddingLeft:   !isMobile && i > 0   ? 'clamp(24px,3vw,40px)' : '0',
                  paddingRight:  !isMobile && i < 2   ? 'clamp(24px,3vw,40px)' : '0',
                  paddingTop:    'clamp(32px,5vw,48px)',
                  paddingBottom: 'clamp(32px,5vw,48px)',
                  borderRight:   !isMobile && !isLast  ? '1px solid ' + C.border : 'none',
                  borderBottom:  isMobile && !isLast   ? '1px solid ' + C.border : 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.08em', marginBottom: '16px' }}>
                  {s.time}
                </div>

                {/* Thought — italic serif */}
                <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400', fontSize: 'clamp(1.05rem,2.2vw,1.3rem)', color: C.text, lineHeight: 1.4, marginBottom: '16px' }}>
                  {s.thought}
                </div>

                {/* Context */}
                <div style={{ fontFamily: F_SANS, fontSize: '14px', color: C.text2, lineHeight: '1.75', marginBottom: '20px' }}>
                  <em style={{ fontStyle: 'italic' }}>{s.name}</em>, {s.loc} — {s.role}. {s.context}
                </div>

                {/* Route answer */}
                <div style={{ width: '28px', height: '1.5px', background: s.color, marginBottom: '14px' }} />
                <div style={{ fontFamily: F_SANS, fontWeight: '500', fontSize: '14px', color: C.text, lineHeight: '1.65' }}>
                  {s.answer}
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
// THREE MODES — column layout, no fills
// ─────────────────────────────────────────────────────────
function ThreeModes({ C, isMobile, onEnter }) {
  var modes = [
    {
      label: 'Student',
      serif: 'Base camp',
      sub: 'No salary yet',
      desc: 'Path to a ₹4.8L+ first offer. Student Mode reframes ROI around career investment, not salary hike. No salary slider needed.',
    },
    {
      label: 'Switcher',
      serif: 'Route change',
      sub: 'Changing domains',
      desc: 'Domain switch in 5–8 months with the right certification. Only fast-track options. Long certs hidden unless you ask.',
    },
    {
      label: 'Professional',
      serif: 'Higher altitude',
      sub: 'Levelling up',
      desc: 'Maximum ROI on your next cert. Break-even analysis, city hike benchmarks, and a pitch-your-boss email if your company sponsors it.',
    },
  ]

  return (
    <div style={{ paddingTop: 'clamp(72px,10vw,120px)', paddingBottom: 'clamp(72px,10vw,120px)' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Choose your climb
          </div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: 'clamp(1.8rem,4.5vw,3rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          Three modes.<br /><span style={{ color: C.green }}>One tool.</span>
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 0, borderTop: '1px solid ' + C.border, position: 'relative' }}>
          {!isMobile && (
            <>
              <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: '1px', background: C.border }} />
              <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: '1px', background: C.border }} />
            </>
          )}

          {modes.map(function(m, i) {
            var isLast = i === modes.length - 1
            return (
              <motion.div key={i}
                variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: 'clamp(32px,5vw,52px) 0',
                  paddingLeft:  !isMobile && i > 0  ? 'clamp(24px,3vw,40px)' : '0',
                  paddingRight: !isMobile && i < 2  ? 'clamp(24px,3vw,40px)' : '0',
                  borderBottom: isMobile && !isLast  ? '1px solid ' + C.border : 'none',
                }}
              >
                {/* Waypoint marker */}
                <div style={{ marginBottom: '20px' }}>
                  <WaypointDot active={true} color={C.text3} size={8} />
                </div>

                {/* Serif italic label — the mountain concept */}
                <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontSize: '18px', color: C.text2, marginBottom: '4px', fontWeight: '400' }}>
                  {m.serif}
                </div>
                <div style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: 'clamp(1rem,2vw,1.2rem)', color: C.text, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                  {m.label}
                </div>
                <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
                  {m.sub}
                </div>
                <div style={{ fontFamily: F_SANS, fontSize: '14px', color: C.text2, lineHeight: '1.8' }}>
                  {m.desc}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.3 }}
          style={{ marginTop: 'clamp(44px,6vw,64px)', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={onEnter}
            style={{ padding: '0 32px', height: '48px', borderRadius: '4px', border: 'none', background: C.btnFill, color: C.btnText, fontSize: '15px', fontFamily: F_SANS, fontWeight: '500', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
            onMouseEnter={function(e) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(28,26,23,0.18)' }}
            onMouseLeave={function(e) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            Pick my mode <ArrowRight size={15} />
          </button>
          <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.08em' }}>
            No account required to start
          </span>
        </motion.div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SOCIAL PROOF — full-width editorial pull quotes
// No stars. No cards. No avatar photos.
// One quote per row, each full width.
// Absence of stars makes it feel more credible, not less.
// ─────────────────────────────────────────────────────────
function SocialProof({ C, isMobile }) {
  var quotes = [
    { quote: 'CertifyROI said the summit was month 8. It was month 7. Switched companies immediately. ₹6L hike.', name: 'Priya S.', detail: 'Bangalore · Engineer → Cloud Architect', hike: '+₹6L/yr', color: C.green },
    { quote: 'Was about to spend ₹12L on an MBA. The route analysis showed a different path — 5 months, 1% of the cost.', name: 'Rahul M.', detail: 'Hyderabad · Ops Manager → Data Analyst', hike: 'Saved ₹12L', color: C.gold },
    { quote: 'Student Mode. India-specific. GCP placed 47 Pune freshers in Q1 2026. My ₹5.2L offer was one of them.', name: 'Ananya K.', detail: 'Pune · Fresh Graduate', hike: '₹5.2L offer', color: C.text2 },
  ]

  return (
    <div style={{ background: C.surface, borderTop: '1px solid ' + C.border, borderBottom: '1px solid ' + C.border, paddingTop: 'clamp(72px,10vw,120px)', paddingBottom: 'clamp(72px,10vw,120px)' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px' }}>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>
            From people who ran the numbers
          </div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: 'clamp(1.8rem,4.5vw,3rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 0, marginBottom: '64px' }}>
          They chose the right route.<br /><span style={{ color: C.green }}>It worked.</span>
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {quotes.map(function(q, i) {
            var isLast = i === quotes.length - 1
            return (
              <motion.div key={i}
                variants={SLIDE_LEFT} initial="hidden" whileInView="show" viewport={{ once: true }}
                style={{
                  paddingTop:    i > 0    ? 'clamp(44px,6vw,64px)' : '0',
                  paddingBottom: !isLast  ? 'clamp(44px,6vw,64px)' : '0',
                  borderBottom:  !isLast  ? '1px solid ' + C.border : 'none',
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 160px',
                  gap: isMobile ? '20px' : '48px',
                  alignItems: 'end',
                }}
              >
                <div>
                  {/* Full-width italic serif quote — the editorial treatment */}
                  <div style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '400', fontSize: 'clamp(1.15rem,2.8vw,1.8rem)', color: C.text, letterSpacing: '-0.02em', lineHeight: 1.35, marginBottom: '24px' }}>
                    "{q.quote}"
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ width: '22px', height: '1.5px', background: q.color }} />
                    <span style={{ fontFamily: F_SANS, fontWeight: '500', fontSize: '14px', color: C.text }}>{q.name}</span>
                    <span style={{ fontFamily: F_MONO, fontSize: '11px', color: C.text3 }}>{q.detail}</span>
                  </div>
                </div>

                <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                  <div style={{ fontFamily: F_MONO, fontWeight: '500', fontSize: 'clamp(1.2rem,3vw,1.8rem)', color: C.gold, letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {q.hike}
                  </div>
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
// FINAL CTA — typographic monument
// Summit contour cluster behind it
// ─────────────────────────────────────────────────────────
function FinalCTA({ C, isMobile, onEnter }) {
  return (
    <div style={{ paddingTop: 'clamp(100px,14vw,160px)', paddingBottom: 'clamp(100px,14vw,160px)', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>

      {/* Summit contour cluster — sparser rings, accent green innermost */}
      <div style={{ position: 'absolute', right: isMobile ? '-80px' : '-40px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <svg width="360" height="360" viewBox="-180 -180 360 360">
          <ContourCluster rings={5} cx={0} cy={0} rx={60} ry={40} color={C.line} opacity={0.5} rotate={0} />
          {/* Innermost ring in accent green — the summit is visible */}
          <ellipse cx="0" cy="0" rx="60" ry="40" fill={C.green} fillOpacity="0.06" stroke={C.green} strokeWidth="0.75" strokeOpacity="0.3" />
          <ellipse cx="0" cy="0" rx="40" ry="26" fill={C.green} fillOpacity="0.05" stroke={C.green} strokeWidth="0.75" strokeOpacity="0.25" />
        </svg>
      </div>

      <div style={{ maxWidth: '920px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px', position: 'relative', zIndex: 1 }}>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ fontFamily: F_MONO, fontSize: '11px', color: C.text3, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '28px' }}>
            2 minutes from now
          </div>
          <h2 style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontWeight: '600', fontSize: 'clamp(2.8rem,9vw,6.5rem)', color: C.text, letterSpacing: '-0.03em', lineHeight: 0.92, marginTop: 0, marginBottom: '40px' }}>
            You'll know<br />the answer.
          </h2>
        </motion.div>

        <motion.p variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }}
          style={{ fontFamily: F_SANS, fontSize: 'clamp(14px,2vw,16px)', color: C.text2, lineHeight: '1.85', maxWidth: '380px', margin: '0 0 44px' }}>
          Stop reading about certifications. Stop asking Reddit.{' '}
          <span style={{ color: C.text, fontWeight: '500' }}>Know the payback period before you pay the fee.</span>
        </motion.p>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={onEnter}
              style={{ padding: '0 40px', height: '52px', borderRadius: '4px', border: 'none', background: C.btnFill, color: C.btnText, fontSize: '16px', fontFamily: F_SANS, fontWeight: '500', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={function(e) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(28,26,23,0.2)' }}
              onMouseLeave={function(e) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              Calculate My Route <ArrowRight size={16} />
            </button>

            <button
              onClick={onEnter}
              style={{ padding: '0 28px', height: '52px', borderRadius: '4px', border: '1.5px solid ' + C.border, background: 'transparent', color: C.text2, fontSize: '15px', fontFamily: F_SANS, fontWeight: '400', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={function(e) { e.currentTarget.style.borderColor = C.text2; e.currentTarget.style.color = C.text }}
              onMouseLeave={function(e) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text2 }}
            >
              See a sample climb →
            </button>
          </div>

          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em' }}>
            No signup · Free · India salary data 2026
          </div>
        </motion.div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// PAGE FOOTER
// ─────────────────────────────────────────────────────────
function PageFooter({ C, isMobile }) {
  return (
    <div style={{ borderTop: '1px solid ' + C.border, padding: isMobile ? '24px 24px' : '28px 80px' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ElevationMark size={18} color={C.green} />
          <span style={{ fontFamily: F_SANS, fontWeight: '600', fontSize: '15px', letterSpacing: '-0.02em', color: C.text }}>
            Certify
          </span>
          <span style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontSize: '16px', color: C.green, letterSpacing: '-0.01em', marginLeft: '-4px' }}>
            ROI
          </span>
        </div>

        {/* Attribution */}
        <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.06em', opacity: 0.6 }}>
          LINKEDIN · NASSCOM · AMBITIONBOX · NAUKRI · WEF 2026
        </div>

        {/* Closing brand mark */}
        <div style={{ opacity: 0.25 }}>
          <ElevationMark size={14} color={C.text} />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN LANDING PAGE
// ─────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  var isDark   = useIsDark()
  var isMobile = useIsMobile()
  var C        = isDark ? D : L  // Color system — adapts to theme

  var heroRef = useRef(null)
  var [chartReady, setChartReady] = useState(false)

  var { scrollYProgress: heroSP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  var heroY  = useTransform(heroSP, [0, 1], [0, isMobile ? 30 : 55])
  var heroOp = useTransform(heroSP, [0, 0.6], [1, 0])

  useEffect(function() {
    var t = setTimeout(function() { setChartReady(true) }, 600)
    return function() { clearTimeout(t) }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: C.bg, position: 'relative' }}>

      {/* ── HERO ── */}
      <div
        ref={heroRef}
        style={{ position: 'relative', overflow: 'hidden', minHeight: isMobile ? 'auto' : '100vh', display: 'flex', alignItems: 'center' }}
      >
        {/* Contour cluster — bottom left — BASECAMP */}
        {/* Dense rings: many choices, complexity of starting point */}
        <div style={{ position: 'absolute', left: isMobile ? '-60px' : '-40px', bottom: isMobile ? '-40px' : '0', pointerEvents: 'none', zIndex: 0 }}>
          <svg width={isMobile ? '280' : '420'} height={isMobile ? '240' : '360'} viewBox="0 0 420 360">
            <ContourCluster rings={11} cx={60} cy={300} rx={90} ry={55} color={C.line} opacity={0.55} rotate={-10} />
          </svg>
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOp, width: '100%', position: 'relative', zIndex: 1 }}
        >
          <div style={{
            maxWidth: '1180px',
            margin: '0 auto',
            padding: isMobile
              ? 'calc(var(--nav-h,64px) + 48px) 24px 60px'
              : 'calc(var(--nav-h,64px) + 72px) 80px 80px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '7fr 5fr',
            gap: isMobile ? '48px' : '80px',
            alignItems: 'center',
          }}>

            {/* ── LEFT COLUMN — text ── */}
            <div>
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: F_MONO, fontSize: '11px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <ElevationMark size={14} color={C.green} />
                Career Route Analysis · India 2026
              </motion.div>

              {/* Headline — Cormorant serif — only use in the hero */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: F_SERIF, fontWeight: '600', fontSize: 'clamp(2.8rem,7vw,5.5rem)', lineHeight: 0.95, letterSpacing: '-0.02em', color: C.text, marginBottom: '28px', marginTop: 0, wordBreak: 'break-word' }}
              >
                Your next cert<br />
                is either a{' '}
                <span style={{ color: C.gold, fontStyle: 'italic' }}>goldmine</span><br />
                or a{' '}
                <span style={{ color: '#8B2C2C', fontStyle: 'italic' }}>mistake.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: F_SANS, fontSize: 'clamp(15px,2vw,17px)', color: C.text2, maxWidth: '420px', lineHeight: '1.8', margin: '0 0 40px' }}
              >
                Know the payback period before you pay the fee.
                We calculate the exact month your investment turns profitable —
                before you spend ₹50K and 6 months on the wrong route.
              </motion.p>

              {/* CTA cluster */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start' }}
              >
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Primary CTA — dark fill, 4px radius, NOT pill, NOT green */}
                  <button
                    onClick={onEnter}
                    style={{ padding: '0 32px', height: '48px', borderRadius: '4px', border: 'none', background: C.btnFill, color: C.btnText, fontSize: '15px', fontFamily: F_SANS, fontWeight: '500', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}
                    onMouseEnter={function(e) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px ' + (isDark ? 'rgba(237,233,227,0.15)' : 'rgba(28,26,23,0.2)') }}
                    onMouseLeave={function(e) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    Calculate My Route <ArrowRight size={15} />
                  </button>

                  {/* Secondary — ghost */}
                  <button
                    onClick={onEnter}
                    style={{ padding: '0 24px', height: '48px', borderRadius: '4px', border: '1.5px solid ' + C.border, background: 'transparent', color: C.text2, fontSize: '14px', fontFamily: F_SANS, fontWeight: '400', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseEnter={function(e) { e.currentTarget.style.borderColor = C.text2; e.currentTarget.style.color = C.text }}
                    onMouseLeave={function(e) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text2 }}
                  >
                    See a sample climb →
                  </button>
                </div>

                {/* Trust micro-copy */}
                <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.1em' }}>
                  No signup required · Free · India salary data 2026
                </div>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                style={{ marginTop: 'clamp(40px,6vw,64px)', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <motion.div
                  animate={{ y: [0, 6, 0], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: '18px', height: '30px', borderRadius: '9px', border: '1.5px solid ' + C.border, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '4px' }}
                >
                  <div style={{ width: '2px', height: '6px', borderRadius: '1px', background: C.text3 }} />
                </motion.div>
                <span style={{ fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase' }}>scroll</span>
              </motion.div>
            </div>

            {/* ── RIGHT COLUMN — elevation chart (the product preview AS the visual) ── */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'relative' }}
              >
                {/* Chart sits directly on the background — no card border, no shadow */}
                {/* It feels integrated, not boxed */}
                <ElevationChart C={C} animate={chartReady} />

                {/* Route briefing label above chart */}
                <div style={{ position: 'absolute', top: '-32px', left: 0, fontFamily: F_MONO, fontSize: '10px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <WaypointDot active={false} color={C.text3} size={7} />
                  Route preview
                </div>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>

      {/* ── TRUST STRIP ── */}
      <TrustStrip C={C} />

      {/* ── CERT ASSEMBLY — sticky scroll animation ── */}
      <CertAssembly C={C} />

      {/* ── HORIZON BAND — basecamp to route transition ── */}
      <HorizonBands C={C} />

      {/* ── DATA COMPOSITION ── */}
      <DataComposition C={C} isMobile={isMobile} />

      {/* ── HORIZON BAND ── */}
      <HorizonBands C={C} />

      {/* ── HOW IT WORKS — waypoint steps ── */}
      <HowItWorks C={C} isMobile={isMobile} onEnter={onEnter} />

      {/* ── VS SECTION — strikethrough pairs ── */}
      <VsSection C={C} isMobile={isMobile} />

      {/* ── ELEVEN PM — stories ── */}
      <ElevenPM C={C} isMobile={isMobile} onEnter={onEnter} />

      {/* ── THREE MODES ── */}
      <ThreeModes C={C} isMobile={isMobile} onEnter={onEnter} />

      {/* ── SOCIAL PROOF — editorial pull quotes ── */}
      <SocialProof C={C} isMobile={isMobile} />

      {/* ── HORIZON BAND — approach to summit ── */}
      <HorizonBands C={C} />

      {/* ── FINAL CTA — typographic monument ── */}
      <FinalCTA C={C} isMobile={isMobile} onEnter={onEnter} />

      {/* ── FOOTER ── */}
      <PageFooter C={C} isMobile={isMobile} />

    </div>
  )
}

export default LandingPage