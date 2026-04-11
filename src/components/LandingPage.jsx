import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

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
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────
var F_SERIF = "'Cormorant Garamond', Georgia, serif"
var F_SANS  = "'DM Sans', 'Inter', sans-serif"
var F_MONO  = "'IBM Plex Mono', 'JetBrains Mono', monospace"

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
  goldL:       '#C49A4E',
  err:         '#8B2C2C',
  line:        '#C8C3BB',
  lineHeavy:   '#A8A39B',
  btnFill:     '#1C1A17',
  btnText:     '#F5F1EB',
  border:      '#D9D4CC',
  snow:        '#F8F6F2',
  skyTop:      '#D8E8F0',
  skyBot:      '#F5F1EB',
}

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
  goldL:       '#D4A85E',
  err:         '#C05050',
  line:        '#2E2B27',
  lineHeavy:   '#3E3B36',
  btnFill:     '#EDE9E3',
  btnText:     '#1C1A17',
  border:      '#2E2B27',
  snow:        '#E8E4DE',
  skyTop:      '#0C1420',
  skyBot:      '#131110',
}

var RISE = {
  hidden: { y: 24, opacity: 0 },
  show:   { y: 0,  opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}
var SLIDE_LEFT = {
  hidden: { x: -40, opacity: 0 },
  show:   { x: 0,   opacity: 1, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
}

// ─────────────────────────────────────────────────────────
// SVG PRIMITIVES
// ─────────────────────────────────────────────────────────

function ElevationMark({ size, color }) {
  size  = size  || 18
  color = color || '#2D6A4F'
  var w = size
  var h = size * 0.65
  return (
    <svg width={w} height={h} viewBox={'0 0 ' + w + ' ' + h} fill="none" style={{ display: 'block' }}>
      <path d={'M 0 ' + h + ' Q ' + (w*0.25) + ' ' + (h*0.1) + ' ' + (w*0.5) + ' ' + (h*0.2) + ' Q ' + (w*0.75) + ' ' + (h*0.35) + ' ' + w + ' ' + h}
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={w*0.5} cy={h*0.2} r="2" fill={color} />
    </svg>
  )
}

function SummitFlag({ color, size }) {
  color = color || '#A67C3C'
  size  = size  || 1
  return (
    <svg width={14*size} height={18*size} viewBox="0 0 14 18" fill="none" style={{ display: 'block' }}>
      <line x1="3" y1="1" x2="3" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 3 1 L 13 5 L 3 9 Z" fill={color} fillOpacity="0.85" />
    </svg>
  )
}

function WaypointDot({ active, color, size }) {
  active = active !== false
  color  = color || '#1C1A17'
  size   = size  || 10
  return (
    <svg width={size+8} height={size+8} viewBox={'0 0 '+(size+8)+' '+(size+8)} fill="none">
      <circle cx={(size+8)/2} cy={(size+8)/2} r={size/2+3}
        stroke={color} strokeWidth="1.5" strokeOpacity={active?0.35:0.15} />
      <circle cx={(size+8)/2} cy={(size+8)/2} r={size/2-1}
        fill={active?color:'none'} stroke={color} strokeWidth="1.5" strokeOpacity={active?1:0.3} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// RIDGE SILHOUETTE — reusable mountain line
// ─────────────────────────────────────────────────────────
function RidgeSilhouette({ C, variant, height, opacity }) {
  height  = height  || 80
  opacity = opacity || 0.18
  variant = variant || 'low'

  var profiles = {
    low:  'M0 ' + height + ' L 80 ' + (height*0.7) + ' L 160 ' + (height*0.8) + ' L 240 ' + (height*0.55) + ' L 320 ' + (height*0.72) + ' L 400 ' + (height*0.48) + ' L 480 ' + (height*0.65) + ' L 560 ' + (height*0.78) + ' L 640 ' + (height*0.6) + ' L 720 ' + (height*0.72) + ' L 800 ' + (height*0.5) + ' L 900 ' + (height*0.68) + ' L 1000 ' + (height*0.82) + ' L 1100 ' + (height*0.72) + ' L 1200 ' + height + ' Z',
    mid:  'M0 ' + height + ' L 60 ' + (height*0.5) + ' L 130 ' + (height*0.65) + ' L 200 ' + (height*0.35) + ' L 280 ' + (height*0.55) + ' L 360 ' + (height*0.28) + ' L 430 ' + (height*0.48) + ' L 510 ' + (height*0.62) + ' L 590 ' + (height*0.38) + ' L 670 ' + (height*0.52) + ' L 760 ' + (height*0.32) + ' L 850 ' + (height*0.58) + ' L 940 ' + (height*0.45) + ' L 1040 ' + (height*0.6) + ' L 1200 ' + height + ' Z',
    high: 'M0 ' + height + ' L 50 ' + (height*0.3) + ' L 120 ' + (height*0.42) + ' L 180 ' + (height*0.18) + ' L 250 ' + (height*0.38) + ' L 330 ' + (height*0.12) + ' L 400 ' + (height*0.3) + ' L 480 ' + (height*0.45) + ' L 560 ' + (height*0.2) + ' L 640 ' + (height*0.38) + ' L 720 ' + (height*0.14) + ' L 800 ' + (height*0.35) + ' L 880 ' + (height*0.5) + ' L 960 ' + (height*0.28) + ' L 1060 ' + (height*0.42) + ' L 1200 ' + height + ' Z',
  }

  return (
    <svg viewBox={'0 0 1200 ' + height} width="100%" height={height}
      preserveAspectRatio="none" style={{ display: 'block' }}>
      <path d={profiles[variant]} fill={C.text} fillOpacity={opacity} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// CONTOUR CLUSTER — prominent topographic rings
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
    <g transform={'rotate('+rotate+','+cx+','+cy+')'} opacity={opacity}>
      {Array.from({ length: rings }).map(function(_, i) {
        var step = i * 16
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={rx+step} ry={ry+step*0.58}
            fill="none" stroke={color} strokeWidth={i === 0 ? '1.2' : '0.75'} />
        )
      })}
    </g>
  )
}

// ─────────────────────────────────────────────────────────
// HORIZON BANDS — ridge silhouette divider
// ─────────────────────────────────────────────────────────
function HorizonBands({ C }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <RidgeSilhouette C={C} variant="high" height={52} opacity={0.06} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <RidgeSilhouette C={C} variant="mid" height={44} opacity={0.10} />
      </div>
      <RidgeSilhouette C={C} variant="low" height={36} opacity={0.18} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// MOUNTAIN ROUTE MAP — FIX 2: label clipping resolved
// ─────────────────────────────────────────────────────────
function MountainRouteMap({ C, isDark, animate }) {
  var [drawn, setDrawn] = useState(false)
  var [hovRoute, setHovRoute] = useState(null)

  useEffect(function() {
    if (!animate) return
    var t = setTimeout(function() { setDrawn(true) }, 350)
    return function() { clearTimeout(t) }
  }, [animate])

  var SUMMIT   = { x: 278, y: 62 }

  var mountainFill = isDark ? '#1C1A17' : '#D4CFC8'
  var mountainMid  = isDark ? '#252220' : '#C2BDB6'
  var snowFill     = isDark ? '#2A2723' : '#EBE8E3'
  var lineCol      = C.line

  var farRidgeL = 'M 0 440 L 20 390 L 55 370 L 90 385 L 120 375 L 150 395 L 170 440 Z'
  var farRidgeR = 'M 390 440 L 410 395 L 450 370 L 490 380 L 530 365 L 560 380 L 560 440 Z'

  var mainMountain = [
    'M 0 440',
    'L 30 420 L 65 408 L 95 418 L 118 408 L 138 415',
    'L 148 400 L 158 380 L 165 355 L 170 328',
    'L 175 300 L 180 272 L 185 244 L 191 215',
    'L 197 188 L 206 162 L 215 138 L 226 116 L 238 96 L 252 78 L 263 67',
    'L ' + SUMMIT.x + ' ' + SUMMIT.y,
    'L 293 67 L 304 78 L 316 96 L 328 116 L 340 138 L 350 162 L 360 188',
    'L 367 215 L 373 244 L 378 272 L 382 300',
    'L 385 328 L 390 355 L 398 380 L 408 400 L 422 415',
    'L 445 408 L 468 418 L 500 408 L 530 418 L 556 430 L 560 440',
    'L 0 440 Z'
  ].join(' ')

  var snowZone = [
    'M 252 78 L 263 67 L ' + SUMMIT.x + ' ' + SUMMIT.y + ' L 293 67 L 304 78',
    'L 316 96 L 322 112 L 316 128 L 302 140 L 290 148 L 278 155',
    'L 266 148 L 254 140 L 240 128 L 234 112 Z'
  ].join(' ')

  var contours = [
    { cx: 278, cy: 135, rx: 44,  ry: 28,  rot: 0  },
    { cx: 276, cy: 180, rx: 76,  ry: 44,  rot: -2 },
    { cx: 274, cy: 228, rx: 104, ry: 58,  rot: -2 },
    { cx: 272, cy: 278, rx: 128, ry: 70,  rot: -1 },
    { cx: 270, cy: 332, rx: 148, ry: 80,  rot: -1 },
  ]

  var routeBest    = 'M 188 430 C 185 395, 183 360, 182 328 C 181 295, 182 262, 184 232 C 186 202, 190 172, 197 145 C 203 122, 215 100, 230 85 C 245 72, 263 65, 278 62'
  var routeWrong   = 'M 188 430 C 200 410, 215 390, 230 368 C 244 348, 258 330, 272 316 C 284 305, 298 298, 316 294 C 330 291, 348 290, 368 290'
  var routeNoCert  = 'M 188 430 C 228 428, 280 422, 336 412 C 380 404, 420 396, 460 390 C 492 384, 520 380, 540 378'

  // FIX 2: waypoints with safe x positions and opaque label backgrounds
  var waypoints = [
    { x: 188, y: 430, label: 'BASECAMP', sub: 'Your starting point',   color: C.text3,  side: 'left'  },
    { x: 183, y: 330, label: 'MONTH 3',  sub: 'Cert cost paid · ₹25K', color: C.gold,   side: 'left'  },
    { x: 186, y: 225, label: 'MONTH 9',  sub: 'Break-even reached',    color: C.goldL,  side: 'left'  },
    { x: 278, y:  62, label: 'SUMMIT',   sub: '₹14.2L net gain',       color: C.green,  side: 'right' },
  ]

  var routeEnds = [
    { x: 368, y: 290, label: 'Plateau',   sub: 'Wrong cert · no hike', color: isDark ? '#C49A4E' : '#8B6028', dashCol: isDark ? '#C49A4E' : '#A67C3C' },
    { x: 540, y: 378, label: 'Same slope', sub: 'No cert · stagnant',  color: C.text3,                        dashCol: C.text3 },
  ]

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'absolute', top: '-28px', left: 0, fontFamily: F_MONO, fontSize: '9px', color: C.text3, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <WaypointDot active={false} color={C.text3} size={7} />
        Route map · choose your ascent
      </div>

      <svg viewBox="0 0 560 460" width="100%" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <clipPath id="drawClip">
            <motion.rect x="0" y="0" height="460"
              animate={{ width: drawn ? 560 : 0 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </clipPath>
          <clipPath id="mountainClip">
            <path d={mainMountain} />
          </clipPath>
        </defs>

        <rect x="0" y="0" width="560" height="460" fill={isDark ? '#0C1118' : '#DCE8F0'} opacity="0.5" rx="4" />

        <path d={farRidgeL} fill={C.text} fillOpacity={isDark ? 0.07 : 0.06} />
        <path d={farRidgeR} fill={C.text} fillOpacity={isDark ? 0.07 : 0.06} />

        {contours.map(function(ct, i) {
          return (
            <ellipse key={i} cx={ct.cx} cy={ct.cy} rx={ct.rx} ry={ct.ry}
              transform={'rotate('+ct.rot+','+ct.cx+','+ct.cy+')'}
              fill="none" stroke={lineCol}
              strokeWidth={i === 0 ? 0.9 : 0.65}
              strokeOpacity={0.45 - i * 0.06}
            />
          )
        })}

        <path d={mainMountain} fill={mountainFill} opacity={isDark ? 0.95 : 0.85} />

        <path d={'M 148 400 L 185 244 L 252 78 L 278 62 L 188 430 Z'}
          fill={isDark ? '#EDE9E3' : '#A8A39B'} fillOpacity={0.04} />

        <path d={'M 148 400 L 158 380 L 165 355 L 170 328 L 175 300 L 180 272 L 185 244 L 191 215 L 197 188 L 206 162 L 215 138 L 226 116 L 238 96 L 252 78 L 263 67 L 278 62'}
          fill="none" stroke={C.lineHeavy} strokeWidth="1" strokeOpacity={0.5} />
        <path d={'M 422 415 L 408 400 L 398 380 L 390 355 L 385 328 L 382 300 L 378 272 L 373 244 L 367 215 L 360 188 L 350 162 L 340 138 L 328 116 L 316 96 L 304 78 L 293 67 L 278 62'}
          fill="none" stroke={C.lineHeavy} strokeWidth="0.75" strokeOpacity={0.35} />

        <path d={snowZone} fill={snowFill} opacity={isDark ? 0.45 : 0.6} />
        <path d={snowZone} fill="none" stroke={lineCol} strokeWidth="0.6" strokeOpacity={0.3} />

        <g clipPath="url(#mountainClip)">
          {contours.map(function(ct, i) {
            return (
              <ellipse key={i} cx={ct.cx} cy={ct.cy} rx={ct.rx} ry={ct.ry}
                transform={'rotate('+ct.rot+','+ct.cx+','+ct.cy+')'}
                fill="none" stroke={C.lineHeavy}
                strokeWidth={0.65} strokeOpacity={0.35}
              />
            )
          })}
        </g>

        <g clipPath="url(#drawClip)">
          <path d={routeNoCert} fill="none"
            stroke={C.text3} strokeWidth="1.5" strokeDasharray="4 5"
            strokeOpacity={hovRoute && hovRoute !== 'nocert' ? 0.15 : 0.5}
            style={{ transition: 'stroke-opacity 0.2s' }}
          />
          <path d={routeWrong} fill="none"
            stroke={C.gold} strokeWidth="1.75" strokeDasharray="5 4"
            strokeOpacity={hovRoute && hovRoute !== 'wrong' ? 0.15 : 0.6}
            style={{ transition: 'stroke-opacity 0.2s' }}
          />
          <path d={routeBest} fill="none"
            stroke={C.green} strokeWidth="2.5"
            strokeOpacity={hovRoute && hovRoute !== 'best' ? 0.2 : 1}
            style={{ transition: 'stroke-opacity 0.2s' }}
          />
        </g>

        {drawn && routeEnds.map(function(re, i) {
          return (
            <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.4 + i * 0.2, duration: 0.4 }}>
              <circle cx={re.x} cy={re.y} r="5" fill={re.dashCol} fillOpacity="0.2"
                stroke={re.dashCol} strokeWidth="1" strokeOpacity="0.5" />
              <line x1={re.x} y1={re.y - 6} x2={re.x} y2={re.y - 24}
                stroke={re.dashCol} strokeWidth="0.75" strokeOpacity="0.4" />
              <rect x={re.x - 44} y={re.y - 46} width="88" height="22" rx="3"
                fill={isDark ? '#1C1A17' : '#F5F1EB'} opacity="0.9" />
              <text x={re.x} y={re.y - 39} textAnchor="middle"
                style={{ fontFamily: F_MONO, fontSize: '8px', fill: re.color, letterSpacing: '0.08em' }}>
                {re.label.toUpperCase()}
              </text>
              <text x={re.x} y={re.y - 29} textAnchor="middle"
                style={{ fontFamily: F_SANS, fontSize: '8px', fill: re.color, opacity: 0.7 }}>
                {re.sub}
              </text>
            </motion.g>
          )
        })}

        {/* FIX 2: Waypoints with opaque background rects to prevent clipping/readability issues */}
        {drawn && waypoints.map(function(wp, i) {
          var isLeft  = wp.side === 'left'
          var isSummit = i === waypoints.length - 1
          return (
            <motion.g key={i} initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + i * 0.22, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ transformOrigin: wp.x + 'px ' + wp.y + 'px' }}>

              <circle cx={wp.x} cy={wp.y} r={isSummit ? 14 : 10}
                fill={wp.color} fillOpacity="0.1"
                stroke={wp.color} strokeWidth={isSummit ? 1.2 : 0.9}
                strokeDasharray={isSummit ? '0' : '3 2'}
                strokeOpacity={0.6} />

              <circle cx={wp.x} cy={wp.y} r={isSummit ? 6 : 4}
                fill={wp.color} fillOpacity={isSummit ? 1 : 0.85} />

              {isSummit && (
                <g transform={'translate(' + (wp.x + 6) + ',' + (wp.y - 22) + ')'}>
                  <line x1="0" y1="0" x2="0" y2="20" stroke={C.gold} strokeWidth="1.2" />
                  <path d="M 0 0 L 10 4 L 0 8 Z" fill={C.gold} fillOpacity="0.9" />
                </g>
              )}

              {isLeft ? (
                <line x1={wp.x - 5} y1={wp.y} x2={wp.x - 28} y2={wp.y}
                  stroke={wp.color} strokeWidth="0.6" strokeOpacity="0.4" />
              ) : (
                <line x1={wp.x + 6} y1={wp.y - 4} x2={wp.x + 28} y2={wp.y - 20}
                  stroke={wp.color} strokeWidth="0.6" strokeOpacity="0.4" />
              )}

              {/* FIX 2: opaque background rect + repositioned text to avoid left-edge clip */}
              {isLeft ? (
                <g>
                  <rect
                    x={wp.x - 148} y={wp.y - 18}
                    width={148} height={28} rx="3"
                    fill={isDark ? 'rgba(19,17,16,0.82)' : 'rgba(245,241,235,0.88)'}
                  />
                  <text x={wp.x - 8} y={wp.y - 6} textAnchor="end"
                    style={{ fontFamily: F_MONO, fontSize: '9px', fontWeight: '600', fill: wp.color, letterSpacing: '0.06em' }}>
                    {wp.label}
                  </text>
                  <text x={wp.x - 8} y={wp.y + 7} textAnchor="end"
                    style={{ fontFamily: F_SANS, fontSize: '8px', fill: wp.color, opacity: 0.85 }}>
                    {wp.sub}
                  </text>
                </g>
              ) : (
                <g>
                  <rect
                    x={wp.x + 28} y={wp.y - 34}
                    width={120} height={30} rx="3"
                    fill={isDark ? 'rgba(19,17,16,0.82)' : 'rgba(245,241,235,0.88)'}
                  />
                  <text x={wp.x + 34} y={wp.y - 19} textAnchor="start"
                    style={{ fontFamily: F_MONO, fontSize: '10px', fontWeight: '700', fill: wp.color, letterSpacing: '0.06em' }}>
                    {wp.label}
                  </text>
                  <text x={wp.x + 34} y={wp.y - 7} textAnchor="start"
                    style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontSize: '11px', fill: C.gold }}>
                    {wp.sub}
                  </text>
                </g>
              )}
            </motion.g>
          )
        })}

        {drawn && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.5 }}>
            <line x1="20" y1="450" x2="46" y2="450"
              stroke={C.green} strokeWidth="2.5" />
            <text x="51" y="454" style={{ fontFamily: F_MONO, fontSize: '9px', fill: C.green, letterSpacing: '0.05em' }}>
              Best route
            </text>
            <line x1="140" y1="450" x2="166" y2="450"
              stroke={C.gold} strokeWidth="1.75" strokeDasharray="5 4" />
            <text x="171" y="454" style={{ fontFamily: F_MONO, fontSize: '9px', fill: C.text3, letterSpacing: '0.05em' }}>
              Wrong cert
            </text>
            <line x1="270" y1="450" x2="296" y2="450"
              stroke={C.text3} strokeWidth="1.5" strokeDasharray="4 5" />
            <text x="301" y="454" style={{ fontFamily: F_MONO, fontSize: '9px', fill: C.text3, letterSpacing: '0.05em' }}>
              No cert
            </text>
          </motion.g>
        )}

      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CERT ASSEMBLY — sticky scroll cert animation (unchanged)
// ─────────────────────────────────────────────────────────
function CertAssembly({ C, isDark }) {
  var isMobile = useIsMobile()

  var certBg    = isDark ? '#04060e' : '#F8F7F4'
  var certText1 = isDark ? '#F0F2FF' : '#0F172A'
  var certText2 = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,23,42,0.45)'
  var certMuted = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.3)'
  var overlayBg = isDark ? '#020408' : C.bg

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
    return c + (d-c) * Math.max(0, Math.min(1, (p-a)/(b-a)))
  }

  var p8 = remap(prog, 0, 0.8, 0, 1)
  var l1, l2, l3
  if (isMobile) {
    l1 = 'translateY('+remap(p8,0,1,-50,0)+'px) rotateZ('+remap(p8,0,1,3,0)+'deg)'
    l2 = 'translateY('+remap(p8,0,1,50,0)+'px) rotateZ('+remap(p8,0,1,-2,0)+'deg)'
    l3 = 'translateY('+remap(p8,0,1,-25,0)+'px) scale('+remap(p8,0,1,0.88,1)+')'
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

        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.12 }}>
          <svg viewBox="0 0 800 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            <path d={'M 0 400 L 100 300 L 180 320 L 240 260 L 300 200 L 340 160 L 380 130 L 400 100 L 420 130 L 460 160 L 520 200 L 580 260 L 640 320 L 720 300 L 800 400 Z'}
              fill={C.text} />
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 4 }}>
          <div style={{ transform: 'scale('+certScale+')', opacity: certOpacity }}>
            <div style={{ position: 'relative', width: isMobile?'min(320px,88vw)':'min(500px,88vw)', height: 'calc('+(isMobile?'min(320px,88vw)':'min(500px,88vw)')+' / 1.414)', transformStyle: 'preserve-3d' }}>
              <div style={{ position: 'absolute', inset: 0, transform: l1 }}>
                <svg viewBox="0 0 500 354" width="100%" height="100%" style={{ position: 'absolute', inset: 0, display: 'block' }}>
                  <defs>
                    <linearGradient id="cBordM" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"   stopColor="#2D6A4F"/>
                      <stop offset="40%"  stopColor="#4A8C6A"/>
                      <stop offset="100%" stopColor="#A67C3C"/>
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="500" height="354" rx="4" fill={certBg} fillOpacity="0.97"/>
                  <rect x="1.5" y="1.5" width="497" height="351" rx="3" fill="none" stroke="url(#cBordM)" strokeWidth="1.5"/>
                  {[[22,22],[478,22],[22,332],[478,332]].map(function(arr,i) {
                    var cx=arr[0], cy=arr[1]
                    return (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="4" fill="none" stroke="#2D6A4F" strokeWidth="1.2"/>
                        <circle cx={cx} cy={cy} r="8" fill="none" stroke="rgba(45,106,79,0.2)" strokeWidth="0.6"/>
                      </g>
                    )
                  })}
                </svg>
              </div>
              <div style={{ position: 'absolute', inset: 0, transform: l2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,4vw,40px)' }}>
                <div style={{ fontFamily: F_MONO, fontSize: '9px', color: 'rgba(45,106,79,0.7)', letterSpacing: '0.26em', marginBottom: '11px', textTransform: 'uppercase' }}>CERTIFYROI · INDIA 2026</div>
                <div style={{ fontFamily: F_SERIF, fontWeight: '600', fontSize: 'clamp(0.9rem,3.2vw,1.9rem)', letterSpacing: '-0.02em', color: certText1, marginBottom: '6px', textAlign: 'center', lineHeight: 1.1 }}>Route Briefing</div>
                <div style={{ fontFamily: F_SANS, fontSize: 'clamp(10px,1.5vw,12px)', color: certText2, marginBottom: '22px', textAlign: 'center' }}>Personalised ROI Analysis · Your City</div>
                <div style={{ display: 'flex', gap: 'clamp(10px,4vw,40px)', marginBottom: '18px' }}>
                  {[{label:'SUMMIT',value:'9 mo',color:'#2D6A4F'},{label:'5-YR GAIN',value:'₹14.2L',color:'#A67C3C'},{label:'ELEVATION',value:'+35%',color:'#4A8C6A'}].map(function(s,i){
                    return (<div key={i} style={{textAlign:'center'}}><div style={{fontFamily:F_MONO,fontSize:'7px',color:certMuted,letterSpacing:'0.12em',marginBottom:'5px'}}>{s.label}</div><div style={{fontFamily:F_MONO,fontSize:'clamp(0.8rem,2.5vw,1.5rem)',color:s.color,fontWeight:'500',letterSpacing:'-0.03em'}}>{s.value}</div></div>)
                  })}
                </div>
                <div style={{ width:'74%',height:'1px',background:'linear-gradient(90deg,transparent,rgba(45,106,79,0.4),transparent)',marginBottom:'12px' }} />
                <div style={{ fontFamily:F_MONO,fontSize:'7px',color:certMuted,letterSpacing:'0.14em',textAlign:'center' }}>VERIFIED · DATA: NAUKRI MARCH 2026</div>
              </div>
              <div style={{ position:'absolute',right:'6%',bottom:'8%',transform:l3 }}>
                <SummitFlag color="#A67C3C" />
              </div>
            </div>
          </div>
          <div style={{ opacity: hintOp, marginTop: '44px', textAlign: 'center', pointerEvents: 'none' }}>
            <motion.div animate={{ y:[0,8,0] }} transition={{ duration:1.7, repeat:Infinity, ease:'easeInOut' }}>
              <div style={{ fontFamily:F_MONO, fontSize:'11px', color:C.text3, letterSpacing:'0.22em', textTransform:'uppercase' }}>↓  scroll to assemble  ↓</div>
            </motion.div>
          </div>
        </div>
        <div style={{ opacity:assembledOp, position:'absolute', bottom:'8%', left:0, right:0, textAlign:'center', pointerEvents:'none', zIndex:5 }}>
          <div style={{ fontFamily:F_MONO, fontSize:'12px', color:C.green, letterSpacing:'0.22em', textTransform:'uppercase' }}>✓  ROUTE BRIEFING · ASSEMBLED</div>
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
    var endVal = parseFloat(String(end).replace(/[^0-9.]/g,''))
    var frames = Math.round(duration * 60)
    var f = 0
    var t = setInterval(function() {
      f++
      var ease = 1 - Math.pow(1 - f/frames, 3)
      setCount(endVal * ease)
      if (f >= frames) { setCount(endVal); clearInterval(t) }
    }, 1000/60)
    return function() { clearInterval(t) }
  }, [on, end, duration])
  return (
    <motion.span onViewportEnter={function() { setOn(true) }}>
      {prefix}{count.toLocaleString('en-IN', { maximumFractionDigits: String(end).includes('.')?1:0 })}{suffix}
    </motion.span>
  )
}

// ─────────────────────────────────────────────────────────
// TRUST STRIP — ticker
// ─────────────────────────────────────────────────────────
function TrustStrip({ C }) {
  var items = [
    'AWS cert holders earn ₹2.4L more/yr in Bangalore',
    '2,400+ cloud roles open on Naukri right now',
    'Average PMP summit: 7 months',
    'Google Analytics: ₹18K invested → ₹3.2L annual gain',
    'CKA Kubernetes: steepest climb · +40% elevation',
    'Hyderabad cloud demand up 38% in 2026',
  ]
  return (
    <div style={{ overflow:'hidden', borderTop:'1px solid '+C.border, borderBottom:'1px solid '+C.border, padding:'11px 0', background:C.surface }}>
      <motion.div animate={{ x:['0%','-50%'] }} transition={{ duration:44, repeat:Infinity, ease:'linear' }}
        style={{ display:'flex', gap:'80px', whiteSpace:'nowrap', width:'max-content' }}>
        {[...items,...items].map(function(item,i){
          return (
            <span key={i} style={{ fontSize:'11px', color:C.text3, fontFamily:F_MONO, flexShrink:0, letterSpacing:'0.03em' }}>
              <span style={{ color:C.green, marginRight:'14px', opacity:0.6 }}>◆</span>{item}
            </span>
          )
        })}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// DATA COMPOSITION
// ─────────────────────────────────────────────────────────
function DataComposition({ C, isMobile }) {
  return (
    <div style={{ paddingTop:'clamp(80px,12vw,140px)', paddingBottom:'clamp(80px,12vw,140px)', position:'relative', overflow:'hidden' }}>

      <div style={{ position:'absolute', right: isMobile ? '-80px' : '-60px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', zIndex:0 }}>
        <svg width={isMobile ? '300' : '480'} height={isMobile ? '300' : '480'} viewBox="-240 -240 480 480">
          <ContourCluster rings={10} cx={0} cy={0} rx={55} ry={36} color={C.line} opacity={0.55} rotate={18} />
          <circle cx="0" cy="0" r="5" fill={C.green} fillOpacity="0.25" stroke={C.green} strokeWidth="1" strokeOpacity="0.3" />
        </svg>
      </div>

      <div style={{ position:'absolute', top:0, left:0, right:0, pointerEvents:'none', opacity:0.4 }}>
        <RidgeSilhouette C={C} variant="high" height={40} opacity={0.08} />
      </div>

      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px', position:'relative', zIndex:1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>
            The numbers behind every route
          </div>
        </motion.div>

        <motion.div variants={SLIDE_LEFT} initial="hidden" whileInView="show" viewport={{ once:true }}
          style={{ marginBottom:'clamp(48px,8vw,96px)' }}>
          <div style={{ fontFamily:F_MONO, fontSize:'clamp(3rem,14vw,8rem)', color:C.gold, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'500' }}>
            <CountUp end={14.2} prefix="₹" suffix="L" />
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:'16px', marginTop:'12px', flexWrap:'wrap' }}>
            <div style={{ fontFamily:F_SERIF, fontStyle:'italic', fontSize:'clamp(1rem,2.5vw,1.4rem)', color:C.text2 }}>
              5-year net gain · AWS Solutions Architect
            </div>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.1em', textTransform:'uppercase' }}>
              Bangalore median · 2026
            </div>
          </div>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', borderTop:'1px solid '+C.border }}>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
            style={{ padding:isMobile?'40px 0':'56px 64px 56px 0', borderBottom:isMobile?'1px solid '+C.border:'none', borderRight:isMobile?'none':'1px solid '+C.border }}>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'16px' }}>Summit reached</div>
            <div style={{ fontFamily:F_MONO, fontSize:'clamp(2.4rem,8vw,4.5rem)', color:C.text, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'500', marginBottom:'12px' }}>
              <CountUp end={6} suffix=" months" />
            </div>
            <div style={{ fontFamily:F_SANS, fontSize:'14px', color:C.text2, lineHeight:'1.75' }}>
              Not "a few months." The exact month your investment turns profitable — calculated for your salary and city.
            </div>
          </motion.div>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.1 }}
            style={{ padding:isMobile?'40px 0':'56px 0 56px 64px' }}>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'16px' }}>Elevation gained</div>
            <div style={{ fontFamily:F_MONO, fontSize:'clamp(2.4rem,8vw,4.5rem)', color:C.text, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'500', marginBottom:'12px' }}>
              <CountUp end={35} suffix="%" />
            </div>
            <div style={{ fontFamily:F_SANS, fontSize:'14px', color:C.text2, lineHeight:'1.75' }}>
              India-sourced. City-specific. Not US data converted at today's rate and called "India salary insights."
            </div>
          </motion.div>
        </div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.2 }}
          style={{ borderTop:'1px solid '+C.border, paddingTop:isMobile?'40px':'56px', display:'flex', gap:isMobile?'24px':'56px', alignItems:'flex-start', flexWrap:'wrap' }}>
          <div style={{ flexShrink:0 }}>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'12px' }}>Monthly gain from month 7</div>
            <div style={{ fontFamily:F_MONO, fontSize:'clamp(1.6rem,4.5vw,2.8rem)', color:C.green, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'500' }}>₹23,600</div>
          </div>
          <div style={{ flex:1, minWidth:'200px' }}>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'12px' }}>103 routes charted</div>
            <div style={{ fontFamily:F_SANS, fontSize:'14px', color:C.text2, lineHeight:'1.8' }}>
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
function HowItWorks({ C, isMobile, onEnter }) {
  var steps = [
    { id:'basecamp', label:'Basecamp', subtitle:'Where you start', desc:'Enter your salary, role, and city. Upload your resume for AI to read your actual background. This is your starting elevation.', detail:'No account required.', icon:'⛺' },
    { id:'route',    label:'Route',    subtitle:'Choose your path', desc:'Select a certification or let the AI recommend the highest-ROI ascent for your profile. Compare routes side by side.', detail:'India market data · 2026', icon:'🗺' },
    { id:'summit',   label:'Summit',   subtitle:'Know the outcome',  desc:'Exact payback month, 5-year net gain in rupees, monthly delta, and a recommendation on whether the climb is worth making.', detail:'Your numbers. Your decision.', icon:'⛳' },
  ]
  var [routeRef, routeInView] = useInView(0.3)

  return (
    <div style={{ background:C.surface, borderTop:'1px solid '+C.border, borderBottom:'1px solid '+C.border, paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)', position:'relative', overflow:'hidden' }}>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, pointerEvents:'none' }}>
        <RidgeSilhouette C={C} variant="mid" height={60} opacity={0.09} />
      </div>
      <div style={{ position:'absolute', right:'-30px', top:'20px', pointerEvents:'none', opacity:0.3 }}>
        <svg width="200" height="200" viewBox="-100 -100 200 200">
          <ContourCluster rings={5} cx={0} cy={0} rx={35} ry={22} color={C.line} opacity={1} rotate={-10} />
        </svg>
      </div>

      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px', position:'relative', zIndex:1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>The route</div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
          style={{ fontFamily:F_SANS, fontWeight:'600', fontSize:'clamp(1.8rem,4.5vw,3rem)', color:C.text, letterSpacing:'-0.03em', lineHeight:1.05, marginTop:0, marginBottom:'64px' }}>
          Three stages.<br />One clear answer.
        </motion.h2>

        <div ref={routeRef} style={{ position:'relative' }}>
          {!isMobile && (
            <div style={{ position:'absolute', top:'13px', left:'13px', right:'13px', height:'2px', overflow:'visible', pointerEvents:'none', zIndex:0 }}>
              <svg width="100%" height="2" style={{ display:'block', overflow:'visible' }}>
                <motion.line x1="0" y1="1" x2="100%" y2="1"
                  stroke={C.green} strokeWidth="1.2" strokeDasharray="6 5"
                  initial={{ pathLength:0, opacity:0 }}
                  animate={routeInView ? { pathLength:1, opacity:0.5 } : { pathLength:0, opacity:0 }}
                  transition={{ duration:1.6, ease:[0.16,1,0.3,1] }}
                />
              </svg>
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)', position:'relative', zIndex:1 }}>
            {steps.map(function(step, i) {
              var isLast = i === steps.length - 1
              return (
                <motion.div key={step.id} variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.12 }}
                  style={{
                    paddingLeft:  !isMobile && i>0  ? 'clamp(24px,3vw,40px)' : '0',
                    paddingRight: !isMobile && i<2  ? 'clamp(24px,3vw,40px)' : '0',
                    paddingTop:   '48px',
                    paddingBottom: isMobile && !isLast ? 'clamp(32px,5vw,48px)' : '0',
                    borderRight:  !isMobile && !isLast ? '1px solid '+C.border : 'none',
                    borderBottom: isMobile && !isLast  ? '1px solid '+C.border : 'none',
                  }}
                >
                  <div style={{ marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
                    <WaypointDot active={true} color={C.green} size={14} />
                    <div style={{ fontFamily:F_MONO, fontSize:'9px', color:C.text3, textTransform:'uppercase', letterSpacing:'0.1em' }}>
                      Stage {i+1}
                    </div>
                  </div>
                  <div style={{ fontFamily:F_SERIF, fontStyle:'italic', fontSize:'24px', color:C.green, marginBottom:'4px', fontWeight:'400' }}>{step.label}</div>
                  <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'14px' }}>{step.subtitle}</div>
                  <div style={{ fontFamily:F_SANS, fontSize:'14px', color:C.text2, lineHeight:'1.8', marginBottom:'14px' }}>{step.desc}</div>
                  <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.06em' }}>{step.detail}</div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.4 }}
          style={{ marginTop:'clamp(48px,6vw,72px)', display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap' }}>
          <button onClick={onEnter}
            style={{ padding:'0 32px', height:'48px', borderRadius:'4px', border:'none', background:C.btnFill, color:C.btnText, fontSize:'15px', fontFamily:F_SANS, fontWeight:'500', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'10px', transition:'all 0.2s' }}
            onMouseEnter={function(e) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(28,26,23,0.18)' }}
            onMouseLeave={function(e) { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
            Calculate My Route <ArrowRight size={15} />
          </button>
          <span style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.08em' }}>No signup required</span>
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// VS SECTION
// ─────────────────────────────────────────────────────────
function VsSection({ C, isMobile }) {
  var pairs = [
    { wrong:'"AWS is good for cloud engineers"', right:'AWS SAA at ₹9L salary: summit reached month 6. ₹14.2L net gain over 5 years. Or it isn\'t worth the climb.' },
    { wrong:'"Upskill for career growth"', right:'₹23,600 extra every month from month 7. Compounding over 5 years. In rupees. Not "career growth."' },
    { wrong:'US salary data converted to rupees', right:'Naukri. AmbitionBox. LinkedIn India. 2026 data. Not converted from San Francisco. Actually collected here.' },
    { wrong:'The same advice for every professional', right:'AI reads your resume. Sees your role. Sees your city. Maps your terrain. Then recommends a route.' },
  ]

  return (
    <div style={{ paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, pointerEvents:'none', opacity:0.5 }}>
        <RidgeSilhouette C={C} variant="low" height={32} opacity={0.07} />
      </div>

      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px', position:'relative', zIndex:1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>The problem with every other guide</div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
          style={{ fontFamily:F_SANS, fontWeight:'600', fontSize:'clamp(1.8rem,4.5vw,3rem)', color:C.text, letterSpacing:'-0.03em', lineHeight:1.05, marginTop:0, marginBottom:'64px' }}>
          Every other guide<br /><span style={{ color:C.err }}>sends you up the wrong mountain.</span>
        </motion.h2>

        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(36px,5vw,52px)' }}>
          {pairs.map(function(pair, i) {
            return (
              <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.08 }}>
                <div style={{ position:'relative', display:'inline-block', marginBottom:'14px', maxWidth:'100%' }}>
                  <div style={{ fontFamily:F_SANS, fontWeight:'500', fontSize:'clamp(0.9rem,2vw,1.2rem)', color:C.text, opacity:0.2, letterSpacing:'-0.01em', lineHeight:1.35, wordBreak:'break-word' }}>
                    {pair.wrong}
                  </div>
                  <svg style={{ position:'absolute', left:0, top:'50%', width:'100%', height:'2px', overflow:'visible', pointerEvents:'none' }}>
                    <motion.line x1="0" y1="0" x2="100%" y2="0"
                      stroke={C.err} strokeWidth="1.5" strokeOpacity="0.35"
                      initial={{ pathLength:0, opacity:0 }}
                      whileInView={{ pathLength:1, opacity:1 }}
                      viewport={{ once:true }}
                      transition={{ duration:0.9, delay:0.2+i*0.06, ease:'easeOut' }}
                    />
                  </svg>
                </div>
                <div style={{ display:'flex', gap:'14px', alignItems:'flex-start' }}>
                  <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:C.green, marginTop:'10px', flexShrink:0 }} />
                  <div style={{ fontFamily:F_SANS, fontSize:'clamp(14px,1.8vw,16px)', color:C.text, lineHeight:'1.75', fontWeight:'400' }}>{pair.right}</div>
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
function ElevenPM({ C, isMobile, onEnter }) {
  var stories = [
    { time:'11:47 PM', name:'Rohan', loc:'Pune', role:'2 yrs · Backend Engineer', thought:'"Should I do AWS? Or is it too late?"', context:'Ex-classmate promoted to Senior Cloud Architect. ₹28L CTC. Same college, same year.', answer:'AWS SAA at ₹9L: summit month 6. 5-year gain ₹14.2L. The route is clear.', color:C.green },
    { time:'11:12 PM', name:'Sneha', loc:'Bangalore', role:'6 yrs · Ops Manager', thought:'"Is the switch possible without an MBA?"', context:'Every data job requires 3 years of data science experience. She has zero.', answer:'Google Data Analytics + 2 GitHub projects. 5 months. ₹8L → ₹12L. Different mountain, shorter climb.', color:C.gold },
    { time:'12:03 AM', name:'Arjun', loc:'Pune', role:'CS · Fresh graduate', thought:'"Which cert actually gets me placed in India?"', context:'Three comparison articles. All recommend AWS. All written by Americans. All in USD.', answer:'Student Mode. India-specific. GCP placed 47 Pune freshers in Q1 2026.', color:C.text2 },
  ]

  return (
    <div style={{ background:C.surface, borderTop:'1px solid '+C.border, borderBottom:'1px solid '+C.border, paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, pointerEvents:'none' }}>
        <RidgeSilhouette C={C} variant="high" height={48} opacity={0.07} />
      </div>

      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px', position:'relative', zIndex:1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>Who this is for</div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
          style={{ fontFamily:F_SANS, fontWeight:'600', fontSize:'clamp(1.8rem,4.5vw,3rem)', color:C.text, letterSpacing:'-0.03em', lineHeight:1.05, marginTop:0, marginBottom:'64px' }}>
          We know what you're<br />thinking at 11pm.
        </motion.h2>

        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)', gap:0, borderTop:'1px solid '+C.border }}>
          {stories.map(function(s, i) {
            var isLast = i === stories.length - 1
            return (
              <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.1 }}
                onClick={onEnter}
                style={{
                  paddingLeft:   !isMobile&&i>0  ? 'clamp(24px,3vw,40px)' : '0',
                  paddingRight:  !isMobile&&i<2  ? 'clamp(24px,3vw,40px)' : '0',
                  paddingTop:    'clamp(32px,5vw,48px)',
                  paddingBottom: 'clamp(32px,5vw,48px)',
                  borderRight:   !isMobile&&!isLast ? '1px solid '+C.border : 'none',
                  borderBottom:  isMobile&&!isLast  ? '1px solid '+C.border : 'none',
                  cursor:'pointer',
                }}>
                <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.08em', marginBottom:'16px' }}>{s.time}</div>
                <div style={{ fontFamily:F_SERIF, fontStyle:'italic', fontWeight:'400', fontSize:'clamp(1.05rem,2.2vw,1.3rem)', color:C.text, lineHeight:1.4, marginBottom:'16px' }}>{s.thought}</div>
                <div style={{ fontFamily:F_SANS, fontSize:'14px', color:C.text2, lineHeight:'1.75', marginBottom:'20px' }}>
                  <em style={{ fontStyle:'italic' }}>{s.name}</em>, {s.loc} — {s.role}. {s.context}
                </div>
                <div style={{ width:'28px', height:'1.5px', background:s.color, marginBottom:'14px' }} />
                <div style={{ fontFamily:F_SANS, fontWeight:'500', fontSize:'14px', color:C.text, lineHeight:'1.65' }}>{s.answer}</div>
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
function ThreeModes({ C, isMobile, onEnter }) {
  var modes = [
    { label:'Student', serif:'Base camp', sub:'No salary yet', desc:'Path to a ₹4.8L+ first offer. Student Mode reframes ROI around career investment, not salary hike. No salary slider needed.' },
    { label:'Switcher', serif:'Route change', sub:'Changing domains', desc:'Domain switch in 5–8 months. Only fast-track options. Long certs hidden unless you ask.' },
    { label:'Professional', serif:'Higher altitude', sub:'Levelling up', desc:'Maximum ROI on your next cert. Break-even analysis, city benchmarks, and a pitch-your-boss email.' },
  ]

  return (
    <div style={{ paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)', position:'relative', overflow:'hidden' }}>
      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>Choose your climb</div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
          style={{ fontFamily:F_SANS, fontWeight:'600', fontSize:'clamp(1.8rem,4.5vw,3rem)', color:C.text, letterSpacing:'-0.03em', lineHeight:1.05, marginTop:0, marginBottom:'64px' }}>
          Three modes.<br /><span style={{ color:C.green }}>One tool.</span>
        </motion.h2>

        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)', borderTop:'1px solid '+C.border, position:'relative' }}>
          {!isMobile && (
            <>
              <div style={{ position:'absolute', left:'33.33%', top:0, bottom:0, width:'1px', background:C.border }} />
              <div style={{ position:'absolute', left:'66.66%', top:0, bottom:0, width:'1px', background:C.border }} />
            </>
          )}
          {modes.map(function(m, i) {
            var isLast = i === modes.length - 1
            return (
              <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.1 }}
                style={{ padding:'clamp(32px,5vw,52px) 0', paddingLeft:!isMobile&&i>0?'clamp(24px,3vw,40px)':'0', paddingRight:!isMobile&&i<2?'clamp(24px,3vw,40px)':'0', borderBottom:isMobile&&!isLast?'1px solid '+C.border:'none' }}>
                <div style={{ marginBottom:'20px' }}>
                  <WaypointDot active={true} color={C.text3} size={10} />
                </div>
                <div style={{ fontFamily:F_SERIF, fontStyle:'italic', fontSize:'20px', color:C.text2, marginBottom:'4px', fontWeight:'400' }}>{m.serif}</div>
                <div style={{ fontFamily:F_SANS, fontWeight:'600', fontSize:'clamp(1rem,2vw,1.2rem)', color:C.text, letterSpacing:'-0.02em', marginBottom:'4px' }}>{m.label}</div>
                <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'14px' }}>{m.sub}</div>
                <div style={{ fontFamily:F_SANS, fontSize:'14px', color:C.text2, lineHeight:'1.8' }}>{m.desc}</div>
              </motion.div>
            )
          })}
        </div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.3 }}
          style={{ marginTop:'clamp(44px,6vw,64px)', display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap' }}>
          <button onClick={onEnter}
            style={{ padding:'0 32px', height:'48px', borderRadius:'4px', border:'none', background:C.btnFill, color:C.btnText, fontSize:'15px', fontFamily:F_SANS, fontWeight:'500', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'10px', transition:'all 0.2s' }}
            onMouseEnter={function(e) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(28,26,23,0.18)' }}
            onMouseLeave={function(e) { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
            Pick my mode <ArrowRight size={15} />
          </button>
          <span style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.08em' }}>No account required</span>
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SOCIAL PROOF
// ─────────────────────────────────────────────────────────
function SocialProof({ C, isMobile }) {
  var quotes = [
    { quote:'CertifyROI said the summit was month 8. It was month 7. Switched companies immediately. ₹6L hike.', name:'Priya S.', detail:'Bangalore · Engineer → Cloud Architect', hike:'+₹6L/yr', color:C.green },
    { quote:'Was about to spend ₹12L on an MBA. The route analysis showed a different path — 5 months, 1% of the cost.', name:'Rahul M.', detail:'Hyderabad · Ops Manager → Data Analyst', hike:'Saved ₹12L', color:C.gold },
    { quote:'Student Mode. India-specific. GCP placed 47 Pune freshers in Q1 2026. My ₹5.2L offer was one of them.', name:'Ananya K.', detail:'Pune · Fresh Graduate', hike:'₹5.2L offer', color:C.text2 },
  ]

  return (
    <div style={{ background:C.surface, borderTop:'1px solid '+C.border, borderBottom:'1px solid '+C.border, paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)' }}>
      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>From people who ran the numbers</div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
          style={{ fontFamily:F_SANS, fontWeight:'600', fontSize:'clamp(1.8rem,4.5vw,3rem)', color:C.text, letterSpacing:'-0.03em', lineHeight:1.05, marginTop:0, marginBottom:'64px' }}>
          They chose the right route.<br /><span style={{ color:C.green }}>It worked.</span>
        </motion.h2>

        <div style={{ display:'flex', flexDirection:'column' }}>
          {quotes.map(function(q, i) {
            var isLast = i === quotes.length - 1
            return (
              <motion.div key={i} variants={SLIDE_LEFT} initial="hidden" whileInView="show" viewport={{ once:true }}
                style={{ paddingTop:i>0?'clamp(44px,6vw,64px)':'0', paddingBottom:!isLast?'clamp(44px,6vw,64px)':'0', borderBottom:!isLast?'1px solid '+C.border:'none', display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 160px', gap:isMobile?'20px':'48px', alignItems:'end' }}>
                <div>
                  <div style={{ fontFamily:F_SERIF, fontStyle:'italic', fontWeight:'400', fontSize:'clamp(1.15rem,2.8vw,1.8rem)', color:C.text, letterSpacing:'-0.02em', lineHeight:1.35, marginBottom:'24px' }}>
                    "{q.quote}"
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'14px', flexWrap:'wrap' }}>
                    <div style={{ width:'22px', height:'1.5px', background:q.color }} />
                    <span style={{ fontFamily:F_SANS, fontWeight:'500', fontSize:'14px', color:C.text }}>{q.name}</span>
                    <span style={{ fontFamily:F_MONO, fontSize:'11px', color:C.text3 }}>{q.detail}</span>
                  </div>
                </div>
                <div style={{ textAlign:isMobile?'left':'right' }}>
                  <div style={{ fontFamily:F_MONO, fontWeight:'500', fontSize:'clamp(1.2rem,3vw,1.8rem)', color:C.gold, letterSpacing:'-0.04em', lineHeight:1 }}>{q.hike}</div>
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
// FINAL CTA — FIX 3: mountain shrunk to 320px, repositioned
// ─────────────────────────────────────────────────────────
function FinalCTA({ C, isMobile, onEnter, isDark }) {
  return (
    <div style={{ paddingTop:'clamp(100px,14vw,160px)', paddingBottom:'clamp(100px,14vw,160px)', position:'relative', overflow:'hidden' }}>

      {/* FIX 3: Summit mountain — right-aligned, contained, NOT bleeding edge */}
      <div style={{
        position: 'absolute',
        right:    isMobile ? '-40px' : '60px',
        bottom:   '0',
        top:      '0',
        width:    isMobile ? '200px' : '320px',   /* was 460px — shrunk */
        pointerEvents: 'none',
        opacity:  isDark ? 0.40 : 0.32,
        zIndex:   0,
      }}>
        <svg viewBox="0 0 320 600" width="100%" height="100%" preserveAspectRatio="xMaxYMax meet">
          {/* Fewer contour rings, tighter cluster */}
          <ContourCluster rings={8} cx={160} cy={160} rx={50} ry={32} color={C.line} opacity={0.75} rotate={5} />
          {/* Mountain silhouette */}
          <path d={'M 0 600 L 60 500 L 100 480 L 130 465 L 150 420 L 160 370 L 165 310 L 168 255 L 170 205 L 173 165 L 178 130 L 185 105 L 192 85 L 200 72 L 210 62 L 220 72 L 228 85 L 235 105 L 242 130 L 247 165 L 250 205 L 252 255 L 255 310 L 260 370 L 270 420 L 290 465 L 320 490 L 320 600 Z'}
            fill={C.text} fillOpacity={isDark ? 0.20 : 0.14} />
          {/* Ridge line on left face */}
          <path d={'M 130 465 L 145 415 L 155 360 L 162 305 L 166 250 L 169 200 L 172 162 L 178 128 L 186 103 L 194 82 L 210 62'}
            fill="none" stroke={C.lineHeavy} strokeWidth="0.8" strokeOpacity={0.45} />
          {/* Snow zone */}
          <path d={'M 194 82 L 200 72 L 210 62 L 220 72 L 226 82 L 232 100 L 226 112 L 218 120 L 210 126 L 202 120 L 194 112 L 188 100 Z'}
            fill={isDark ? '#2A2723' : '#EBE8E3'} opacity={0.65} />
          {/* Summit flag */}
          <line x1="210" y1="62" x2="210" y2="40" stroke={C.gold} strokeWidth="1.2" />
          <path d="M 210 40 L 222 45 L 210 50 Z" fill={C.gold} fillOpacity="0.9" />
          {/* Label with opaque background */}
          <rect x="216" y="28" width="94" height="26" rx="3"
            fill={isDark ? 'rgba(19,17,16,0.85)' : 'rgba(245,241,235,0.9)'} />
          <text x="222" y="40" style={{ fontFamily: F_MONO, fontSize: '8px', fill: C.gold, letterSpacing: '0.08em' }}>SUMMIT</text>
          <text x="222" y="51" style={{ fontFamily: F_SERIF, fontStyle: 'italic', fontSize: '9px', fill: C.gold }}>₹14.2L gain</text>
        </svg>
      </div>

      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px', position:'relative', zIndex:1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'11px', color:C.text3, letterSpacing:'0.16em', textTransform:'uppercase', marginBottom:'28px' }}>2 minutes from now</div>
          <h2 style={{ fontFamily:F_SERIF, fontStyle:'italic', fontWeight:'600', fontSize:'clamp(2.8rem,9vw,6.5rem)', color:C.text, letterSpacing:'-0.03em', lineHeight:0.92, marginTop:0, marginBottom:'40px' }}>
            You'll know<br />the answer.
          </h2>
        </motion.div>

        <motion.p variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.1 }}
          style={{ fontFamily:F_SANS, fontSize:'clamp(14px,2vw,16px)', color:C.text2, lineHeight:'1.85', maxWidth:'380px', margin:'0 0 44px' }}>
          Stop reading about certifications. Stop asking Reddit.{' '}
          <span style={{ color:C.text, fontWeight:'500' }}>Know the payback period before you pay the fee.</span>
        </motion.p>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.2 }}
          style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'14px' }}>
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center' }}>
            <button onClick={onEnter}
              style={{ padding:'0 40px', height:'52px', borderRadius:'4px', border:'none', background:C.btnFill, color:C.btnText, fontSize:'16px', fontFamily:F_SANS, fontWeight:'500', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'12px', transition:'all 0.2s', whiteSpace:'nowrap' }}
              onMouseEnter={function(e) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(28,26,23,0.2)' }}
              onMouseLeave={function(e) { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
              Calculate My Route <ArrowRight size={16} />
            </button>
            <button onClick={onEnter}
              style={{ padding:'0 28px', height:'52px', borderRadius:'4px', border:'1.5px solid '+C.border, background:'transparent', color:C.text2, fontSize:'15px', fontFamily:F_SANS, fontWeight:'400', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'8px', transition:'all 0.2s', whiteSpace:'nowrap' }}
              onMouseEnter={function(e) { e.currentTarget.style.borderColor=C.text2; e.currentTarget.style.color=C.text }}
              onMouseLeave={function(e) { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.text2 }}>
              See a sample climb →
            </button>
          </div>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.1em' }}>
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
function PageFooter({ C, isMobile }) {
  return (
    <div style={{ borderTop:'1px solid '+C.border, padding:isMobile?'24px':'28px 80px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, pointerEvents:'none' }}>
        <RidgeSilhouette C={C} variant="low" height={24} opacity={0.05} />
      </div>
      <div style={{ maxWidth:'920px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <ElevationMark size={18} color={C.green} />
          <span style={{ fontFamily:F_SANS, fontWeight:'600', fontSize:'15px', letterSpacing:'-0.02em', color:C.text }}>Certify</span>
          <span style={{ fontFamily:F_SERIF, fontStyle:'italic', fontSize:'16px', color:C.green, letterSpacing:'-0.01em', marginLeft:'-4px' }}>ROI</span>
        </div>
        <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.06em', opacity:0.6 }}>
          LINKEDIN · NASSCOM · AMBITIONBOX · NAUKRI · WEF 2026
        </div>
        <div style={{ opacity:0.18 }}>
          <ElevationMark size={14} color={C.text} />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN LANDING PAGE — FIX 1: Hero layout, z-index, headline scale
// ─────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  var isDark   = useIsDark()
  var isMobile = useIsMobile()
  var C        = isDark ? D : L

  var heroRef = useRef(null)
  var [chartReady, setChartReady] = useState(false)

  var { scrollYProgress: heroSP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  var heroY  = useTransform(heroSP, [0,1], [0, isMobile?30:55])
  var heroOp = useTransform(heroSP, [0,0.6], [1,0])

  useEffect(function() {
    var t = setTimeout(function() { setChartReady(true) }, 500)
    return function() { clearTimeout(t) }
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:C.bg, position:'relative' }}>

      {/* ── HERO — FIX 1 ── */}
      <div ref={heroRef} style={{ position:'relative', overflow:'hidden', minHeight:isMobile?'auto':'100vh', display:'flex', alignItems:'center' }}>

        {/* Background panorama — z:0, reduced height so it never covers CTAs */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, pointerEvents:'none', zIndex:0 }}>
          <svg viewBox="0 0 1440 180" width="100%" height="180" preserveAspectRatio="xMidYMax meet" style={{ display:'block' }}>
            {/* Far ridge */}
            <path d={'M 0 180 L 0 130 L 80 118 L 160 128 L 220 110 L 290 122 L 340 100 L 400 115 L 460 104 L 520 116 L 580 98 L 640 112 L 700 100 L 760 114 L 820 95 L 880 108 L 940 96 L 1000 110 L 1060 104 L 1120 116 L 1440 130 L 1440 180 Z'}
              fill={C.text} fillOpacity={isDark?0.05:0.04} />
            {/* Mid ridge */}
            <path d={'M 0 180 L 0 148 L 60 138 L 140 145 L 200 130 L 280 122 L 360 108 L 440 118 L 520 105 L 600 115 L 680 100 L 760 112 L 840 95 L 920 108 L 1000 118 L 1080 128 L 1200 138 L 1440 148 L 1440 180 Z'}
              fill={C.text} fillOpacity={isDark?0.08:0.06} />
            {/* Near ridge */}
            <path d={'M 0 180 L 0 162 L 80 155 L 160 160 L 240 150 L 320 155 L 400 145 L 480 152 L 560 145 L 640 150 L 720 158 L 800 152 L 900 158 L 1000 162 L 1200 168 L 1440 172 L 1440 180 Z'}
              fill={C.text} fillOpacity={isDark?0.12:0.09} />
          </svg>
        </div>

        {/* ALL CONTENT — z:1, always above background panorama */}
        <motion.div style={{ y:heroY, opacity:heroOp, width:'100%', position:'relative', zIndex:1 }}>
          <div style={{
            maxWidth:'1180px',
            margin:'0 auto',
            padding: isMobile
              ? 'calc(var(--nav-h,64px) + 48px) 24px 100px'
              : 'calc(var(--nav-h,64px) + 64px) 80px 120px',
            display:'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '56px' : '80px',
            alignItems: 'start',
          }}>

            {/* ── LEFT: text column — single left edge, all children in flow ── */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start' }}>

              {/* Eyebrow */}
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.1, duration:0.6, ease:[0.16,1,0.3,1] }}
                style={{ fontFamily:F_MONO, fontSize:'11px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'32px', display:'flex', alignItems:'center', gap:'10px' }}>
                <ElevationMark size={14} color={C.green} />
                Career Route Analysis · India 2026
              </motion.div>

              {/* FIX 1: Headline — font scale reduced, maxWidth constrains it */}
              <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.18, duration:0.75, ease:[0.16,1,0.3,1] }}
                style={{
                  fontFamily:F_SERIF, fontWeight:'600',
                  fontSize:'clamp(2.4rem,5.5vw,4.2rem)',
                  lineHeight:1.0, letterSpacing:'-0.02em',
                  color:C.text, marginBottom:'24px', marginTop:0,
                  maxWidth:'440px',
                }}>
                Your next cert<br />
                is either a{' '}
                <span style={{ color:C.gold, fontStyle:'italic' }}>goldmine</span><br />
                or a{' '}
                <span style={{ color:C.err, fontStyle:'italic' }}>mistake.</span>
              </motion.h1>

              {/* Subhead */}
              <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.3, duration:0.65, ease:[0.16,1,0.3,1] }}
                style={{ fontFamily:F_SANS, fontSize:'clamp(14px,1.6vw,16px)', color:C.text2, maxWidth:'380px', lineHeight:'1.8', margin:'0 0 36px' }}>
                Know the payback period before you pay the fee.
                We map the exact month your investment turns profitable —
                before you spend ₹50K on the wrong route.
              </motion.p>

              {/* FIX 1: CTA — in flow, zIndex:2 above terrain layer */}
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.44, duration:0.6, ease:[0.16,1,0.3,1] }}
                style={{ display:'flex', flexDirection:'column', gap:'12px', alignItems:'flex-start', position:'relative', zIndex:2 }}>

                <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center' }}>
                  <button onClick={onEnter}
                    style={{ padding:'0 28px', height:'44px', borderRadius:'4px', border:'none', background:C.btnFill, color:C.btnText, fontSize:'14px', fontFamily:F_SANS, fontWeight:'500', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'9px', transition:'all 0.2s', whiteSpace:'nowrap', letterSpacing:'-0.01em' }}
                    onMouseEnter={function(e) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 4px 14px '+(isDark?'rgba(237,233,227,0.15)':'rgba(28,26,23,0.2)') }}
                    onMouseLeave={function(e) { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
                    Calculate My Route <ArrowRight size={14} />
                  </button>
                  <button onClick={onEnter}
                    style={{ padding:'0 20px', height:'44px', borderRadius:'4px', border:'1.5px solid '+C.border, background:'transparent', color:C.text2, fontSize:'13px', fontFamily:F_SANS, fontWeight:'400', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'7px', transition:'all 0.2s', whiteSpace:'nowrap' }}
                    onMouseEnter={function(e) { e.currentTarget.style.borderColor=C.text2; e.currentTarget.style.color=C.text }}
                    onMouseLeave={function(e) { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.text2 }}>
                    See a sample climb →
                  </button>
                </div>

                <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.1em' }}>
                  No signup · Free · India salary data 2026
                </div>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1, duration:0.6 }}
                style={{ marginTop:'clamp(32px,5vw,52px)', display:'flex', alignItems:'center', gap:'10px' }}>
                <motion.div animate={{ y:[0,6,0], opacity:[0.3,0.6,0.3] }} transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
                  style={{ width:'16px', height:'26px', borderRadius:'8px', border:'1.5px solid '+C.border, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'4px' }}>
                  <div style={{ width:'2px', height:'5px', borderRadius:'1px', background:C.text3 }} />
                </motion.div>
                <span style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase' }}>scroll</span>
              </motion.div>
            </div>

            {/* ── RIGHT: Mountain Route Map ── */}
            {!isMobile && (
              <motion.div initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:0.38, duration:0.9, ease:[0.16,1,0.3,1] }}
                style={{ paddingTop:'8px' }}>
                <MountainRouteMap C={C} isDark={isDark} animate={chartReady} />
              </motion.div>
            )}

            {isMobile && (
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.6, duration:0.8, ease:[0.16,1,0.3,1] }}>
                <MountainRouteMap C={C} isDark={isDark} animate={chartReady} />
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>

      {/* ── TRUST STRIP ── */}
      <TrustStrip C={C} />

      {/* ── CERT ASSEMBLY — sticky scroll ── */}
      <CertAssembly C={C} isDark={isDark} />

      {/* ── RIDGE DIVIDER ── */}
      <div style={{ background:C.bg }}>
        <HorizonBands C={C} />
      </div>

      {/* ── DATA COMPOSITION ── */}
      <DataComposition C={C} isMobile={isMobile} />

      {/* ── RIDGE DIVIDER ── */}
      <div style={{ background:C.surface }}>
        <HorizonBands C={C} />
      </div>

      {/* ── HOW IT WORKS ── */}
      <HowItWorks C={C} isMobile={isMobile} onEnter={onEnter} />

      {/* ── VS SECTION ── */}
      <VsSection C={C} isMobile={isMobile} />

      {/* ── ELEVEN PM ── */}
      <ElevenPM C={C} isMobile={isMobile} onEnter={onEnter} />

      {/* ── THREE MODES ── */}
      <ThreeModes C={C} isMobile={isMobile} onEnter={onEnter} />

      {/* ── SOCIAL PROOF ── */}
      <SocialProof C={C} isMobile={isMobile} />

      {/* ── RIDGE DIVIDER ── */}
      <div style={{ background:C.surface }}>
        <HorizonBands C={C} />
      </div>

      {/* ── FINAL CTA ── */}
      <FinalCTA C={C} isMobile={isMobile} onEnter={onEnter} isDark={isDark} />

      {/* ── FOOTER ── */}
      <PageFooter C={C} isMobile={isMobile} />

    </div>
  )
}

export default LandingPage