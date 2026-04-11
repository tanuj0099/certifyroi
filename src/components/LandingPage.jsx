import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

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
// SVG PRIMITIVES — kept, used in footer only
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
// HERO TOPOLINES — replaces MountainRouteMap
// A single intentional contour graphic: one clean peak read
// from topographic line data, milestone markers on the line.
// No polygon fill, no scenic art, no floating rings.
// ─────────────────────────────────────────────────────────
function HeroTopoChart({ C, isDark }) {
  var lineColor    = C.green
  var mutedLine    = C.line
  var labelBg      = isDark ? 'rgba(19,17,16,0.88)' : 'rgba(245,241,235,0.92)'
  var textPrimary  = C.text
  var textMuted    = C.text3
  var goldColor    = C.gold

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{
        fontFamily: F_MONO,
        fontSize: '9px',
        color: textMuted,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <WaypointDot active={false} color={textMuted} size={6} />
        ROI projection · AWS Solutions Architect · ₹9L salary
      </div>

      <svg viewBox="0 0 520 340" width="100%" style={{ display: 'block', overflow: 'visible' }}>

        {/* Grid lines — survey/instrument feel */}
        {[0,1,2,3,4].map(function(i) {
          var y = 40 + i * 60
          return <line key={i} x1="40" y1={y} x2="480" y2={y} stroke={mutedLine} strokeWidth="0.5" strokeOpacity="0.35" />
        })}
        {[0,1,2,3,4,5].map(function(i) {
          var x = 40 + i * 88
          return <line key={i} x1={x} y1="40" x2={x} y2="280" stroke={mutedLine} strokeWidth="0.5" strokeOpacity="0.22" />
        })}

        {/* Y-axis labels */}
        {[
          { y: 40,  label: '₹18L' },
          { y: 100, label: '₹15L' },
          { y: 160, label: '₹12L' },
          { y: 220, label: '₹9L'  },
          { y: 280, label: '₹6L'  },
        ].map(function(item) {
          return (
            <text key={item.y} x="34" y={item.y + 4} textAnchor="end"
              style={{ fontFamily: F_MONO, fontSize: '9px', fill: textMuted, opacity: 0.55 }}>
              {item.label}
            </text>
          )
        })}

        {/* X-axis labels */}
        {[
          { x: 40,  label: 'Now'   },
          { x: 128, label: '3 mo'  },
          { x: 216, label: '6 mo'  },
          { x: 304, label: '12 mo' },
          { x: 392, label: '24 mo' },
          { x: 480, label: '36 mo' },
        ].map(function(item) {
          return (
            <text key={item.x} x={item.x} y="298" textAnchor="middle"
              style={{ fontFamily: F_MONO, fontSize: '9px', fill: textMuted, opacity: 0.55 }}>
              {item.label}
            </text>
          )
        })}

        {/* No-cert baseline — flat dashed */}
        <path d="M 40 220 L 480 214"
          fill="none" stroke={mutedLine} strokeWidth="1.2" strokeDasharray="4 5" strokeOpacity="0.5" />

        {/* With-cert line — the main data line */}
        <path d="M 40 220 L 128 218 L 216 200 L 260 175 L 304 148 L 392 100 L 480 62"
          fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Investment cost drop at cert purchase — month 3 */}
        <line x1="128" y1="218" x2="128" y2="40" stroke={mutedLine} strokeWidth="0.5" strokeDasharray="3 4" strokeOpacity="0.3" />

        {/* Breakeven line — month 9, approx x=250 */}
        <line x1="260" y1="40" x2="260" y2="280" stroke={goldColor} strokeWidth="0.8" strokeDasharray="3 4" strokeOpacity="0.45" />

        {/* Milestone dots */}
        {/* Start */}
        <circle cx="40" cy="220" r="4" fill={C.surface || C.bg} stroke={mutedLine} strokeWidth="1.5" />

        {/* Cert purchase — month 3 */}
        <circle cx="128" cy="218" r="4.5" fill={C.surface || C.bg} stroke={lineColor} strokeWidth="1.8" />
        <line x1="128" y1="213" x2="128" y2="196" stroke={lineColor} strokeWidth="0.9" strokeOpacity="0.5" />
        <rect x="68" y="182" width="112" height="22" rx="2" fill={labelBg} />
        <text x="124" y="192" textAnchor="middle"
          style={{ fontFamily: F_MONO, fontSize: '8px', fill: lineColor, letterSpacing: '0.05em' }}>
          CERT COST · ₹28,000
        </text>
        <text x="124" y="201" textAnchor="middle"
          style={{ fontFamily: F_SANS, fontSize: '8px', fill: C.text2, opacity: 0.75 }}>
          Month 3
        </text>

        {/* Breakeven — month 9 */}
        <circle cx="260" cy="175" r="4.5" fill={C.surface || C.bg} stroke={goldColor} strokeWidth="1.8" />
        <rect x="268" y="158" width="108" height="22" rx="2" fill={labelBg} />
        <text x="272" y="168"
          style={{ fontFamily: F_MONO, fontSize: '8px', fill: goldColor, letterSpacing: '0.05em' }}>
          BREAK-EVEN
        </text>
        <text x="272" y="177"
          style={{ fontFamily: F_SANS, fontSize: '8px', fill: C.text2, opacity: 0.75 }}>
          Month 9 · investment recovered
        </text>

        {/* Net gain at 36 months */}
        <circle cx="480" cy="62" r="5" fill={lineColor} />
        <line x1="480" y1="57" x2="480" y2="40" stroke={lineColor} strokeWidth="0.9" strokeOpacity="0.5" />
        <rect x="344" y="26" width="130" height="22" rx="2" fill={labelBg} />
        <text x="348" y="37"
          style={{ fontFamily: F_MONO, fontSize: '8px', fill: lineColor, letterSpacing: '0.05em' }}>
          NET GAIN · ₹14.2L
        </text>
        <text x="348" y="46"
          style={{ fontFamily: F_SANS, fontSize: '8px', fill: C.text2, opacity: 0.75 }}>
          Month 36
        </text>

        {/* Legend */}
        <line x1="40" y1="318" x2="66" y2="318" stroke={lineColor} strokeWidth="2.5" />
        <text x="71" y="322"
          style={{ fontFamily: F_MONO, fontSize: '9px', fill: textMuted, letterSpacing: '0.05em' }}>
          With certification
        </text>
        <line x1="200" y1="318" x2="226" y2="318" stroke={mutedLine} strokeWidth="1.2" strokeDasharray="4 5" strokeOpacity="0.6" />
        <text x="231" y="322"
          style={{ fontFamily: F_MONO, fontSize: '9px', fill: textMuted, letterSpacing: '0.05em' }}>
          Without
        </text>

      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CERT ASSEMBLY — unchanged
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
                <div style={{ fontFamily: F_SERIF, fontWeight: '600', fontSize: 'clamp(0.9rem,3.2vw,1.9rem)', letterSpacing: '-0.02em', color: certText1, marginBottom: '6px', textAlign: 'center', lineHeight: 1.1 }}>ROI Report</div>
                <div style={{ fontFamily: F_SANS, fontSize: 'clamp(10px,1.5vw,12px)', color: certText2, marginBottom: '22px', textAlign: 'center' }}>Personalised analysis · Your city · Your salary</div>
                <div style={{ display: 'flex', gap: 'clamp(10px,4vw,40px)', marginBottom: '18px' }}>
                  {[{label:'PAYBACK',value:'9 mo',color:'#2D6A4F'},{label:'5-YR GAIN',value:'₹14.2L',color:'#A67C3C'},{label:'SALARY DELTA',value:'+35%',color:'#4A8C6A'}].map(function(s,i){
                    return (<div key={i} style={{textAlign:'center'}}><div style={{fontFamily:F_MONO,fontSize:'7px',color:certMuted,letterSpacing:'0.12em',marginBottom:'5px'}}>{s.label}</div><div style={{fontFamily:F_MONO,fontSize:'clamp(0.8rem,2.5vw,1.5rem)',color:s.color,fontWeight:'500',letterSpacing:'-0.03em'}}>{s.value}</div></div>)
                  })}
                </div>
                <div style={{ width:'74%',height:'1px',background:'linear-gradient(90deg,transparent,rgba(45,106,79,0.4),transparent)',marginBottom:'12px' }} />
                <div style={{ fontFamily:F_MONO,fontSize:'7px',color:certMuted,letterSpacing:'0.14em',textAlign:'center' }}>VERIFIED · DATA: NAUKRI MARCH 2026</div>
              </div>
            </div>
          </div>
          <div style={{ opacity: hintOp, marginTop: '44px', textAlign: 'center', pointerEvents: 'none' }}>
            <motion.div animate={{ y:[0,8,0] }} transition={{ duration:1.7, repeat:Infinity, ease:'easeInOut' }}>
              <div style={{ fontFamily:F_MONO, fontSize:'11px', color:C.text3, letterSpacing:'0.22em', textTransform:'uppercase' }}>↓  scroll to build your report  ↓</div>
            </motion.div>
          </div>
        </div>
        <div style={{ opacity:assembledOp, position:'absolute', bottom:'8%', left:0, right:0, textAlign:'center', pointerEvents:'none', zIndex:5 }}>
          <div style={{ fontFamily:F_MONO, fontSize:'12px', color:C.green, letterSpacing:'0.22em', textTransform:'uppercase' }}>✓  ROI REPORT · READY</div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// COUNT-UP — unchanged
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
// TRUST STRIP — copy updated, no structural change
// ─────────────────────────────────────────────────────────
function TrustStrip({ C }) {
  var items = [
    'AWS cert holders earn ₹2.4L more/yr in Bangalore',
    '2,400+ cloud roles open on Naukri right now',
    'Average PMP payback: 7 months',
    'Google Analytics: ₹18K invested → ₹3.2L annual gain',
    'CKA Kubernetes: highest ROI in DevOps category',
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
// DATA COMPOSITION — copy updated, contour rings removed
// ─────────────────────────────────────────────────────────
function DataComposition({ C, isMobile }) {
  return (
    <div style={{ paddingTop:'clamp(80px,12vw,140px)', paddingBottom:'clamp(80px,12vw,140px)', position:'relative', overflow:'hidden' }}>
      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px', position:'relative', zIndex:1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>
            The numbers behind every recommendation
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
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'16px' }}>Payback period</div>
            <div style={{ fontFamily:F_MONO, fontSize:'clamp(2.4rem,8vw,4.5rem)', color:C.text, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'500', marginBottom:'12px' }}>
              <CountUp end={6} suffix=" months" />
            </div>
            <div style={{ fontFamily:F_SANS, fontSize:'14px', color:C.text2, lineHeight:'1.75' }}>
              Not "a few months." The exact month your investment turns profitable — calculated for your salary and city.
            </div>
          </motion.div>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.1 }}
            style={{ padding:isMobile?'40px 0':'56px 0 56px 64px' }}>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'16px' }}>Salary increase</div>
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
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'12px' }}>103 certifications analysed</div>
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
// HOW IT WORKS — step labels and copy updated to utility language
// ─────────────────────────────────────────────────────────
function HowItWorks({ C, isMobile, onEnter }) {
  var steps = [
    {
      id:     'enter',
      label:  'Enter your details',
      subtitle: 'Certification · salary · city',
      desc:   'Search from 340+ indexed certifications. Enter your current salary and role. Upload your resume for AI to read your actual background.',
      detail: 'No account required.',
    },
    {
      id:     'calculate',
      label:  'We run the numbers',
      subtitle: 'Cost · payback · uplift',
      desc:   'Total investment cost, expected salary increase, demand index, and exact payback month — calculated against your specific baseline.',
      detail: 'India market data · 2026',
    },
    {
      id:     'report',
      label:  'Get the report',
      subtitle: 'Clear recommendation',
      desc:   'Payback period, 3-year net gain in rupees, monthly delta, and a plain recommendation on whether the certification is worth it.',
      detail: 'Your numbers. Your decision.',
    },
  ]
  var [routeRef, routeInView] = useInView(0.3)

  return (
    <div style={{ background:C.surface, borderTop:'1px solid '+C.border, borderBottom:'1px solid '+C.border, paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)', position:'relative', overflow:'hidden' }}>
      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px', position:'relative', zIndex:1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>How it works</div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
          style={{ fontFamily:F_SANS, fontWeight:'600', fontSize:'clamp(1.8rem,4.5vw,3rem)', color:C.text, letterSpacing:'-0.03em', lineHeight:1.05, marginTop:0, marginBottom:'64px' }}>
          Three steps.<br />One clear answer.
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
                      Step {i+1}
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
            style={{ padding:'0 32px', height:'48px', border:'none', background:C.btnFill, color:C.btnText, fontSize:'15px', fontFamily:F_SANS, fontWeight:'500', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'10px', transition:'all 0.2s' }}
            onMouseEnter={function(e) { e.currentTarget.style.opacity='0.88' }}
            onMouseLeave={function(e) { e.currentTarget.style.opacity='1' }}>
            Calculate ROI <ArrowRight size={15} />
          </button>
          <span style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.08em' }}>No signup required</span>
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// VS SECTION — copy updated
// ─────────────────────────────────────────────────────────
function VsSection({ C, isMobile }) {
  var pairs = [
    {
      wrong: '"AWS is good for cloud engineers"',
      right: 'AWS SAA at ₹9L salary: payback in 6 months. ₹14.2L net gain over 5 years. Or it isn\'t worth it. Either way, you know before you pay.',
    },
    {
      wrong: '"Upskill for career growth"',
      right: '₹23,600 extra every month from month 7. Compounding over 5 years. In rupees. Not "career growth."',
    },
    {
      wrong: 'US salary data converted to rupees',
      right: 'Naukri. AmbitionBox. LinkedIn India. 2026 data. Not converted from San Francisco. Actually collected here.',
    },
    {
      wrong: 'The same advice for every professional',
      right: 'AI reads your resume. Sees your role. Sees your city. Calculates your specific numbers. Then makes a recommendation.',
    },
  ]

  return (
    <div style={{ paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)', position:'relative', overflow:'hidden' }}>
      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px', position:'relative', zIndex:1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>The problem with every other guide</div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
          style={{ fontFamily:F_SANS, fontWeight:'600', fontSize:'clamp(1.8rem,4.5vw,3rem)', color:C.text, letterSpacing:'-0.03em', lineHeight:1.05, marginTop:0, marginBottom:'64px' }}>
          Every other guide<br /><span style={{ color:C.err }}>gives you the wrong answer.</span>
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
// ELEVEN PM — copy updated, no structural change
// ─────────────────────────────────────────────────────────
function ElevenPM({ C, isMobile, onEnter }) {
  var stories = [
    {
      time:    '11:47 PM',
      name:    'Rohan',
      loc:     'Pune',
      role:    '2 yrs · Backend Engineer',
      thought: '"Should I do AWS? Or is it too late?"',
      context: 'Ex-classmate promoted to Senior Cloud Architect. ₹28L CTC. Same college, same year.',
      answer:  'AWS SAA at ₹9L salary: payback month 6. 5-year gain ₹14.2L. Worth it.',
      color:   null,
    },
    {
      time:    '11:12 PM',
      name:    'Sneha',
      loc:     'Bangalore',
      role:    '6 yrs · Ops Manager',
      thought: '"Is a domain switch possible without an MBA?"',
      context: 'Every data job requires 3 years of data science experience. She has zero.',
      answer:  'Google Data Analytics + 2 GitHub projects. 5 months. ₹8L → ₹12L. Payback: 4 months.',
      color:   null,
    },
    {
      time:    '12:03 AM',
      name:    'Arjun',
      loc:     'Pune',
      role:    'CS · Fresh graduate',
      thought: '"Which cert actually gets me placed in India?"',
      context: 'Three comparison articles. All recommend AWS. All written by Americans. All in USD.',
      answer:  'GCP placed 47 Pune freshers in Q1 2026. ROI index: highest in entry-level cloud.',
      color:   null,
    },
  ]

  return (
    <div style={{ background:C.surface, borderTop:'1px solid '+C.border, borderBottom:'1px solid '+C.border, paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)', position:'relative', overflow:'hidden' }}>
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
            var accentColor = i===0 ? C.green : i===1 ? C.gold : C.text2
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
                  cursor:        'pointer',
                }}>
                <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.08em', marginBottom:'16px' }}>{s.time}</div>
                <div style={{ fontFamily:F_SERIF, fontStyle:'italic', fontWeight:'400', fontSize:'clamp(1.05rem,2.2vw,1.3rem)', color:C.text, lineHeight:1.4, marginBottom:'16px' }}>{s.thought}</div>
                <div style={{ fontFamily:F_SANS, fontSize:'14px', color:C.text2, lineHeight:'1.75', marginBottom:'20px' }}>
                  <em style={{ fontStyle:'italic' }}>{s.name}</em>, {s.loc} — {s.role}. {s.context}
                </div>
                <div style={{ width:'28px', height:'1.5px', background:accentColor, marginBottom:'14px' }} />
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
// THREE MODES — labels and copy updated to utility language
// ─────────────────────────────────────────────────────────
function ThreeModes({ C, isMobile, onEnter }) {
  var modes = [
    {
      label:  'Student',
      serif:  'First offer',
      sub:    'No salary yet',
      desc:   'ROI reframed around career investment, not salary hike. Targets a ₹4.8L+ first offer. No salary slider required.',
    },
    {
      label:  'Career switcher',
      serif:  'Domain change',
      sub:    'Changing fields',
      desc:   'Domain switch in 5–8 months. Only fast-track options shown. Long certifications hidden unless you ask.',
    },
    {
      label:  'Working professional',
      serif:  'Salary increase',
      sub:    'Levelling up',
      desc:   'Maximum ROI on your next certification. Break-even analysis, city benchmarks, and a pitch-your-employer email draft.',
    },
  ]

  return (
    <div style={{ paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)', position:'relative', overflow:'hidden' }}>
      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>Who are you?</div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
          style={{ fontFamily:F_SANS, fontWeight:'600', fontSize:'clamp(1.8rem,4.5vw,3rem)', color:C.text, letterSpacing:'-0.03em', lineHeight:1.05, marginTop:0, marginBottom:'64px' }}>
          Three profiles.<br /><span style={{ color:C.green }}>One tool.</span>
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
            style={{ padding:'0 32px', height:'48px', border:'none', background:C.btnFill, color:C.btnText, fontSize:'15px', fontFamily:F_SANS, fontWeight:'500', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'10px', transition:'all 0.2s' }}
            onMouseEnter={function(e) { e.currentTarget.style.opacity='0.88' }}
            onMouseLeave={function(e) { e.currentTarget.style.opacity='1' }}>
            Get started <ArrowRight size={15} />
          </button>
          <span style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.08em' }}>No account required</span>
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SOCIAL PROOF — copy tightened
// ─────────────────────────────────────────────────────────
function SocialProof({ C, isMobile }) {
  var quotes = [
    {
      quote:  'CertifyROI said payback was month 8. It was month 7. I switched companies immediately. ₹6L hike.',
      name:   'Priya S.',
      detail: 'Bangalore · Engineer → Cloud Architect',
      hike:   '+₹6L/yr',
      color:  null,
    },
    {
      quote:  'Was about to spend ₹12L on an MBA. The ROI analysis showed a different path — 5 months, 1% of the cost.',
      name:   'Rahul M.',
      detail: 'Hyderabad · Ops Manager → Data Analyst',
      hike:   'Saved ₹12L',
      color:  null,
    },
    {
      quote:  'India-specific data. GCP placed 47 Pune freshers in Q1 2026. My ₹5.2L offer was one of them.',
      name:   'Ananya K.',
      detail: 'Pune · Fresh Graduate',
      hike:   '₹5.2L offer',
      color:  null,
    },
  ]

  return (
    <div style={{ background:C.surface, borderTop:'1px solid '+C.border, borderBottom:'1px solid '+C.border, paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)' }}>
      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>From people who ran the numbers</div>
        </motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
          style={{ fontFamily:F_SANS, fontWeight:'600', fontSize:'clamp(1.8rem,4.5vw,3rem)', color:C.text, letterSpacing:'-0.03em', lineHeight:1.05, marginTop:0, marginBottom:'64px' }}>
          They checked the ROI first.<br /><span style={{ color:C.green }}>It paid off.</span>
        </motion.h2>

        <div style={{ display:'flex', flexDirection:'column' }}>
          {quotes.map(function(q, i) {
            var isLast = i === quotes.length - 1
            var accentColor = i===0 ? C.green : i===1 ? C.gold : C.text2
            return (
              <motion.div key={i} variants={SLIDE_LEFT} initial="hidden" whileInView="show" viewport={{ once:true }}
                style={{ paddingTop:i>0?'clamp(44px,6vw,64px)':'0', paddingBottom:!isLast?'clamp(44px,6vw,64px)':'0', borderBottom:!isLast?'1px solid '+C.border:'none', display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 160px', gap:isMobile?'20px':'48px', alignItems:'end' }}>
                <div>
                  <div style={{ fontFamily:F_SERIF, fontStyle:'italic', fontWeight:'400', fontSize:'clamp(1.15rem,2.8vw,1.8rem)', color:C.text, letterSpacing:'-0.02em', lineHeight:1.35, marginBottom:'24px' }}>
                    "{q.quote}"
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'14px', flexWrap:'wrap' }}>
                    <div style={{ width:'22px', height:'1.5px', background:accentColor }} />
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
// FINAL CTA — mountain artwork removed entirely.
// Clean typographic close. One primary button only.
// ─────────────────────────────────────────────────────────
function FinalCTA({ C, isMobile, onEnter }) {
  return (
    <div style={{ paddingTop:'clamp(100px,14vw,160px)', paddingBottom:'clamp(100px,14vw,160px)', position:'relative', overflow:'hidden' }}>

      {/* Subtle horizontal topo lines only — no mountain, no rings, no polygon fills */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M 0 280 C 200 260 400 240 600 220 C 800 200 1000 180 1200 160"
            fill="none" stroke={C.line} strokeWidth="0.8" opacity="0.25"/>
          <path d="M 0 310 C 200 290 400 270 600 250 C 800 230 1000 210 1200 190"
            fill="none" stroke={C.line} strokeWidth="0.8" opacity="0.18"/>
          <path d="M 0 340 C 200 320 400 300 600 280 C 800 260 1000 240 1200 220"
            fill="none" stroke={C.line} strokeWidth="0.8" opacity="0.12"/>
          <path d="M 0 370 C 200 350 400 330 600 310 C 800 290 1000 270 1200 250"
            fill="none" stroke={C.line} strokeWidth="0.8" opacity="0.08"/>
        </svg>
      </div>

      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px', position:'relative', zIndex:1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'11px', color:C.text3, letterSpacing:'0.16em', textTransform:'uppercase', marginBottom:'28px' }}>
            2 minutes from now
          </div>
          <h2 style={{ fontFamily:F_SERIF, fontStyle:'italic', fontWeight:'600', fontSize:'clamp(2.8rem,9vw,6.5rem)', color:C.text, letterSpacing:'-0.03em', lineHeight:0.92, marginTop:0, marginBottom:'40px' }}>
            You'll know<br />the answer.
          </h2>
        </motion.div>

        <motion.p variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.1 }}
          style={{ fontFamily:F_SANS, fontSize:'clamp(14px,2vw,16px)', color:C.text2, lineHeight:'1.85', maxWidth:'380px', margin:'0 0 40px' }}>
          Stop reading about certifications. Stop asking Reddit.{' '}
          <span style={{ color:C.text, fontWeight:'500' }}>Know the payback period before you pay the fee.</span>
        </motion.p>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.2 }}
          style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'12px' }}>
          <button onClick={onEnter}
            style={{ padding:'0 40px', height:'52px', border:'none', background:C.btnFill, color:C.btnText, fontSize:'16px', fontFamily:F_SANS, fontWeight:'500', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'12px', transition:'all 0.2s', whiteSpace:'nowrap' }}
            onMouseEnter={function(e) { e.currentTarget.style.opacity='0.88' }}
            onMouseLeave={function(e) { e.currentTarget.style.opacity='1' }}>
            Calculate ROI <ArrowRight size={16} />
          </button>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.1em' }}>
            No signup · Free · India salary data 2026
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// FOOTER — unchanged
// ─────────────────────────────────────────────────────────
function PageFooter({ C, isMobile }) {
  return (
    <div style={{ borderTop:'1px solid '+C.border, padding:isMobile?'24px':'28px 80px', position:'relative' }}>
      <div style={{ maxWidth:'920px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px' }}>
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
// MAIN — hero rebuilt: HeroTopoChart replaces MountainRouteMap.
// One primary CTA only. Trust line directly below button.
// HorizonBands dividers removed between all sections.
// ─────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  var isDark   = useIsDark()
  var isMobile = useIsMobile()
  var C        = isDark ? D : L

  var heroRef = useRef(null)
  var { scrollYProgress: heroSP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  var heroY  = useTransform(heroSP, [0,1], [0, isMobile?30:55])
  var heroOp = useTransform(heroSP, [0,0.6], [1,0])

  return (
    <div style={{ minHeight:'100vh', background:C.bg, position:'relative' }}>

      {/* ── HERO ── */}
      <div ref={heroRef} style={{ position:'relative', overflow:'hidden', minHeight:isMobile?'auto':'100vh', display:'flex', alignItems:'center' }}>
        <motion.div style={{ y:heroY, opacity:heroOp, width:'100%', position:'relative', zIndex:1 }}>
          <div style={{
            maxWidth: '1180px',
            margin:   '0 auto',
            padding:  isMobile
              ? 'calc(var(--nav-h,64px) + 48px) 24px 100px'
              : 'calc(var(--nav-h,64px) + 64px) 80px 120px',
            display:              'grid',
            gridTemplateColumns:  isMobile ? '1fr' : '1fr 1fr',
            gap:                  isMobile ? '56px' : '80px',
            alignItems:           'start',
          }}>

            {/* ── LEFT: text + single CTA ── */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start' }}>

              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.1, duration:0.6, ease:[0.16,1,0.3,1] }}
                style={{ fontFamily:F_MONO, fontSize:'11px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'32px', display:'flex', alignItems:'center', gap:'10px' }}>
                <ElevationMark size={14} color={C.green} />
                Certification ROI calculator · India 2026
              </motion.div>

              <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.18, duration:0.75, ease:[0.16,1,0.3,1] }}
                style={{
                  fontFamily:    F_SERIF,
                  fontWeight:    '600',
                  fontSize:      'clamp(2.4rem,5.5vw,4.2rem)',
                  lineHeight:    1.0,
                  letterSpacing: '-0.02em',
                  color:         C.text,
                  marginBottom:  '24px',
                  marginTop:     0,
                  maxWidth:      '440px',
                }}>
                Your next cert<br />
                is either a{' '}
                <span style={{ color:C.gold, fontStyle:'italic' }}>good investment</span><br />
                or a{' '}
                <span style={{ color:C.err, fontStyle:'italic' }}>waste of money.</span>
              </motion.h1>

              <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.3, duration:0.65, ease:[0.16,1,0.3,1] }}
                style={{ fontFamily:F_SANS, fontSize:'clamp(14px,1.6vw,16px)', color:C.text2, maxWidth:'380px', lineHeight:'1.8', margin:'0 0 32px' }}>
                Know the payback period before you pay the fee.
                We calculate the exact month your investment turns profitable —
                before you spend ₹50K on the wrong certification.
              </motion.p>

              {/* Single primary CTA — no secondary in hero */}
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.44, duration:0.6, ease:[0.16,1,0.3,1] }}
                style={{ display:'flex', flexDirection:'column', gap:'10px', alignItems:'flex-start' }}>
                <button onClick={onEnter}
                  style={{ padding:'0 28px', height:'48px', border:'none', background:C.btnFill, color:C.btnText, fontSize:'15px', fontFamily:F_SANS, fontWeight:'500', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'9px', transition:'opacity 0.2s', whiteSpace:'nowrap', letterSpacing:'-0.01em' }}
                  onMouseEnter={function(e) { e.currentTarget.style.opacity='0.88' }}
                  onMouseLeave={function(e) { e.currentTarget.style.opacity='1' }}>
                  Calculate ROI <ArrowRight size={14} />
                </button>
                {/* Trust line directly under CTA, left-aligned, legible */}
                <div style={{ fontFamily:F_MONO, fontSize:'11px', color:C.text2, letterSpacing:'0.06em' }}>
                  Free · No account needed · 340+ certifications indexed
                </div>
              </motion.div>

              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1, duration:0.6 }}
                style={{ marginTop:'clamp(32px,5vw,52px)', display:'flex', alignItems:'center', gap:'10px' }}>
                <motion.div animate={{ y:[0,6,0], opacity:[0.3,0.6,0.3] }} transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
                  style={{ width:'16px', height:'26px', borderRadius:'8px', border:'1.5px solid '+C.border, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'4px' }}>
                  <div style={{ width:'2px', height:'5px', borderRadius:'1px', background:C.text3 }} />
                </motion.div>
                <span style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase' }}>scroll</span>
              </motion.div>
            </div>

            {/* ── RIGHT: clean topo ROI chart, no mountain art ── */}
            <motion.div initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:0.38, duration:0.9, ease:[0.16,1,0.3,1] }}
              style={{ paddingTop:'8px' }}>
              <HeroTopoChart C={C} isDark={isDark} />
            </motion.div>

          </div>
        </motion.div>
      </div>

      {/* ── TRUST STRIP ── */}
      <TrustStrip C={C} />

      {/* ── CERT ASSEMBLY ── */}
      <CertAssembly C={C} isDark={isDark} />

      {/* ── DATA COMPOSITION ── */}
      <DataComposition C={C} isMobile={isMobile} />

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

      {/* ── FINAL CTA ── */}
      <FinalCTA C={C} isMobile={isMobile} onEnter={onEnter} />

      {/* ── FOOTER ── */}
      <PageFooter C={C} isMobile={isMobile} />

    </div>
  )
}

export default LandingPage