import {
  motion, useScroll, useTransform, AnimatePresence
} from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { TrendingUp, ArrowRight, GraduationCap, Repeat, Briefcase, Zap } from 'lucide-react'

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
// DESIGN SYSTEM — EDITORIAL 2026
// ─────────────────────────────────────────────────────────
var F_HEAD = "'Bricolage Grotesque','Plus Jakarta Sans',sans-serif"
var F_MONO = "'Commit Mono','JetBrains Mono',monospace"
var F_BODY = "'Inter',sans-serif"

var C_BG = '#0B0E14'
var C_TEXT_PRI = '#F8FAFC'
var C_TEXT_SEC = '#64748B'
var C_INDIGO = '#6366F1'
var C_GOLD   = '#F59E0B'
var C_GREEN  = '#10B981'
var C_DIVIDER = 'rgba(255,255,255,0.06)'

// Strict Typography Scale
var T_DISPLAY  = 'clamp(4rem, 10vw, 9rem)'
var T_HEADLINE = 'clamp(2rem, 5vw, 4rem)'
var T_SUBHEAD  = 'clamp(1rem, 2vw, 1.5rem)'
var T_BODY     = '15px'
var T_LABEL    = '11px mono'
var T_MICRO    = '10px mono'

// Allowed Motion
var SLIDE_IN = {
  hidden: { x: -40, opacity: 0 },
  show:   { x: 0,   opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}
var RISE = {
  hidden: { y: 24, opacity: 0 },
  show:   { y: 0,  opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}
var DRAW = {
  hidden: { pathLength: 0 },
  show:   { pathLength: 1, transition: { duration: 1.2, ease: "easeOut" } }
}

function CountUp({ end, prefix, suffix, duration = 2 }) {
  var [count, setCount] = useState(0)
  var [triggered, setTriggered] = useState(false)
  
  useEffect(function() {
    if (!triggered) return
    var start = 0
    var endVal = parseFloat(end.toString().replace(/[^0-9.]/g, ''))
    var totalFrames = Math.round(duration * 60)
    var frame = 0
    
    var timer = setInterval(function() {
      frame++
      var progress = frame / totalFrames
      var current = start + (endVal - start) * (1 - Math.pow(1 - progress, 3)) // easeOutCubic
      setCount(current)
      if (frame >= totalFrames) {
        setCount(endVal)
        clearInterval(timer)
      }
    }, 1000 / 60)
    
    return function() { clearInterval(timer) }
  }, [triggered, end, duration])

  return (
    <motion.span onViewportEnter={function() { setTriggered(true) }}>
      {prefix}{count.toLocaleString('en-IN', { maximumFractionDigits: (end % 1 === 0 ? 0 : 1) })}{suffix}
    </motion.span>
  )
}

// ─────────────────────────────────────────────────────────
// LAYOUT HELPERS
// ─────────────────────────────────────────────────────────
function Section({ children, style }) {
  var isMobile = useIsMobile()
  return (
    <div style={{ 
      maxWidth: '920px', 
      margin: '0 auto', 
      padding: isMobile ? '0 20px' : '0 48px', 
      marginBottom: isMobile ? '80px' : '120px',
      ...style 
    }}>
      {children}
    </div>
  )
}

function HRule() {
  return <div style={{ height: '1px', background: C_DIVIDER, margin: '0 48px' }} />
}

function SectionLabel({ children }) {
  return (
    <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
      style={{ 
        fontFamily: F_MONO, 
        fontSize: '11px', 
        color: C_TEXT_SEC, 
        letterSpacing: '0.12em', 
        textTransform: 'uppercase', 
        marginBottom: '24px' 
      }}>
      {children}
    </motion.div>
  )
}

function SectionHeading({ children }) {
  return (
    <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}
      style={{ 
        fontFamily: F_HEAD, 
        fontWeight: '800', 
        fontSize: T_HEADLINE, 
        color: C_TEXT_PRI, 
        letterSpacing: '-0.04em', 
        lineHeight: 0.95, 
        marginBottom: '72px', 
        marginTop: 0 
      }}>
      {children}
    </motion.h2>
  )
}

function CTAButton({ onClick, children, size }) {
  var isLarge = size === 'large'
  return (
    <button
      onClick={onClick}
      style={{
        padding: isLarge ? '16px 48px' : '13px 32px',
        borderRadius: '50px', border: 'none',
        background: C_INDIGO, color: 'white',
        fontSize: '15px',
        fontFamily: F_HEAD, fontWeight: '700', letterSpacing: '-0.02em',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '9px',
        boxShadow: '0 8px 32px rgba(99,102,241,0.22)',
        transition: 'transform 0.2s, background 0.2s',
      }}
      onMouseEnter={function(e) { e.currentTarget.style.transform = 'scale(1.02)' }}
      onMouseLeave={function(e) { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {children}
    </button>
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
    <div style={{ overflow: 'hidden', borderTop: '1px solid ' + C_DIVIDER, borderBottom: '1px solid ' + C_DIVIDER, padding: '12px 0' }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '80px', whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {[...items, ...items].map(function(item, i) {
          return (
            <span key={i} style={{ fontSize: '11px', color: C_TEXT_SEC, fontFamily: F_MONO, flexShrink: 0, letterSpacing: '0.04em' }}>
              <span style={{ color: C_INDIGO, opacity: 0.4, marginRight: '14px' }}>◆</span>{item}
            </span>
          )
        })}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CERT ASSEMBLY — unchanged
// ─────────────────────────────────────────────────────────
function CertAssembly() {
  var isDark   = useIsDark()
  var isMobile = useIsMobile()

  var certBg    = isDark ? '#04060e'                : '#F8F7F4'
  var certText1 = isDark ? '#F0F2FF'                : '#0F172A'
  var certText2 = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,23,42,0.45)'
  var certMuted = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.3)'
  var certDot   = isDark ? 'rgba(99,102,241,0.2)'   : 'rgba(99,102,241,0.15)'

  var trackRef     = useRef(null)
  var { scrollY }  = useScroll()
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
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: isDark ? '#020408' : '#F0EDE8', opacity: overlayOp }} />
        <div style={{ position: 'relative', zIndex: 4 }}>
          <div style={{ transform: 'scale(' + certScale + ')', opacity: certOpacity }}>
            <div style={{ position: 'relative', width: isMobile ? 'min(320px,88vw)' : 'min(500px,88vw)', height: 'calc(' + (isMobile ? 'min(320px,88vw)' : 'min(500px,88vw)') + ' / 1.414)', transformStyle: 'preserve-3d' }}>
              <div style={{ position: 'absolute', inset: 0, transform: l1 }}>
                <svg viewBox="0 0 500 354" width="100%" height="100%" style={{ position: 'absolute', inset: 0, display: 'block' }}>
                  <defs>
                    <linearGradient id="cBorder" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"   stopColor="#6366F1"/><stop offset="32%"  stopColor="#818CF8"/>
                      <stop offset="66%"  stopColor="#10B981"/><stop offset="100%" stopColor="#51B1E7"/>
                    </linearGradient>
                    <filter id="cGlow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  </defs>
                  <rect x="0" y="0" width="500" height="354" rx="16" fill={certBg} fillOpacity="0.97"/>
                  <rect x="1.5" y="1.5" width="497" height="351" rx="15" fill="none" stroke="url(#cBorder)" strokeWidth="2.5" filter="url(#cGlow)"/>
                  <rect x="10" y="10" width="480" height="334" rx="11" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="0.6"/>
                  {[[22,22],[478,22],[22,332],[478,332]].map(function(arr,i){var cx=arr[0],cy=arr[1];return(<g key={i}><circle cx={cx} cy={cy} r="5.5" fill="none" stroke="#6366F1" strokeWidth="1.6"/><circle cx={cx} cy={cy} r="10" fill="none" stroke="rgba(99,102,241,0.28)" strokeWidth="0.6"/><line x1={cx-14} y1={cy} x2={cx+14} y2={cy} stroke="rgba(99,102,241,0.5)" strokeWidth="0.7"/><line x1={cx} y1={cy-14} x2={cx} y2={cy+14} stroke="rgba(99,102,241,0.5)" strokeWidth="0.7"/></g>)})}
                  <line x1="48" y1="1.5" x2="100" y2="1.5" stroke="#818CF8" strokeWidth="3.5"/>
                  <line x1="400" y1="1.5" x2="452" y2="1.5" stroke="#10B981" strokeWidth="3.5"/>
                  <line x1="48" y1="352.5" x2="100" y2="352.5" stroke="#10B981" strokeWidth="3.5"/>
                  <line x1="400" y1="352.5" x2="452" y2="352.5" stroke="#818CF8" strokeWidth="3.5"/>
                </svg>
              </div>
              <div style={{ position: 'absolute', inset: 0, transform: l2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,4vw,40px)' }}>
                <div style={{ fontFamily: F_MONO, fontSize: '9px', color: 'rgba(99,102,241,0.72)', letterSpacing: '0.26em', marginBottom: '11px', textTransform: 'uppercase' }}>CERTIFYROI · INDIA 2026</div>
                <div style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(0.9rem,3.2vw,1.75rem)', letterSpacing: '-0.04em', color: certText1, marginBottom: '6px', textAlign: 'center', lineHeight: 1.1 }}>Your Certification</div>
                <div style={{ fontFamily: F_BODY, fontSize: 'clamp(10px,1.5vw,12px)', color: certText2, marginBottom: '22px', textAlign: 'center' }}>Personalised ROI Analysis · Your City</div>
                <div style={{ display: 'flex', gap: 'clamp(10px,4vw,40px)', marginBottom: '18px' }}>
                  {[{label:'BREAK-EVEN',value:'6 mo',color:'#F59E0B'},{label:'5-YR GAIN',value:'₹14.2L',color:'#10B981'},{label:'HIKE',value:'+35%',color:'#818CF8'}].map(function(s,i){return(<div key={i} style={{textAlign:'center'}}><div style={{fontFamily:F_MONO,fontSize:'7px',color:certMuted,letterSpacing:'0.12em',marginBottom:'5px'}}>{s.label}</div><div style={{fontFamily:F_MONO,fontSize:'clamp(0.8rem,2.5vw,1.5rem)',color:s.color,fontWeight:'700',letterSpacing:'-0.03em'}}>{s.value}</div></div>)})}
                </div>
                <div style={{ width:'74%',height:'1px',background:'linear-gradient(90deg,transparent,rgba(99,102,241,0.55),transparent)',marginBottom:'12px' }} />
                <div style={{ fontFamily:F_MONO,fontSize:'7px',color:certMuted,letterSpacing:'0.14em',textAlign:'center' }}>VERIFIED BY AI · DATA: NAUKRI MARCH 2026</div>
              </div>
              <div style={{ position:'absolute',right:'6%',bottom:'8%',transform:l3 }}>
                <svg viewBox="0 0 72 72" width="clamp(36px,8vw,72px)" height="clamp(36px,8vw,72px)">
                  <defs><linearGradient id="sealG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6366F1" stopOpacity="0.9"/><stop offset="50%" stopColor="#10B981" stopOpacity="0.7"/><stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9"/></linearGradient></defs>
                  <polygon points="36,4 43,22 62,22 48,35 54,54 36,43 18,54 24,35 10,22 29,22" fill="none" stroke="url(#sealG)" strokeWidth="1.5"/>
                  <circle cx="36" cy="36" r="10" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1"/>
                  <circle cx="36" cy="36" r="4.5" fill={certDot}/>
                  <text x="36" y="40" textAnchor="middle" fontSize="7" fill="#818CF8" fontFamily="monospace" fontWeight="700">AI</text>
                </svg>
              </div>
            </div>
          </div>
          <div style={{ opacity: hintOp, marginTop: '44px', textAlign: 'center', pointerEvents: 'none', transition: 'opacity 0.3s' }}>
            <motion.div animate={{ y: [0,8,0] }} transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '11px', color: 'rgba(99,102,241,0.5)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>↓  scroll to assemble  ↓</div>
            </motion.div>
          </div>
        </div>
        <div style={{ opacity: assembledOp, position: 'absolute', bottom: '8%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 5, transition: 'opacity 0.3s' }}>
          <div style={{ fontFamily: F_MONO, fontSize: '12px', color: 'rgba(16,185,129,0.8)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>✓  YOUR ROI CERTIFICATE · ASSEMBLED</div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SECTION 1: DATA COMPOSITION (Actual Numbers)
// ─────────────────────────────────────────────────────────
function DataComposition() {
  var isMobile = useIsMobile()

  return (
    <Section style={{ paddingTop: '120px', position: 'relative' }}>
      <SectionLabel>What that certificate means for you</SectionLabel>
      
      <div style={{ position: 'relative' }}>
        {/* Massive Display Number */}
        <motion.div variants={SLIDE_IN} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ 
            fontFamily: F_MONO, 
            fontSize: T_DISPLAY, 
            color: C_GOLD, 
            lineHeight: 1, 
            letterSpacing: '-0.04em',
            marginBottom: '16px'
          }}>
            <CountUp end={14.2} prefix="₹" suffix="L" />
          </div>
          <div style={{ fontFamily: F_BODY, fontSize: T_SUBHEAD, color: C_TEXT_PRI, fontStyle: 'italic', marginBottom: '8px' }}>
            5-year gain on AWS SAA
          </div>
          <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C_TEXT_SEC, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Bangalore Median · 2026 Data
          </div>
        </motion.div>

        {/* Floating Annotations (Desktop Only) */}
        {!isMobile && (
          <svg style={{ position: 'absolute', right: '-40px', top: '20px', width: '300px', height: '200px', pointerEvents: 'none', overflow: 'visible' }}>
            <motion.path 
              d="M 0 50 Q 150 0 250 80" 
              fill="none" stroke={C_DIVIDER} strokeWidth="1" strokeDasharray="4 4"
              variants={DRAW} initial="hidden" whileInView="show" viewport={{ once: true }}
            />
            <motion.text 
              x="180" y="30" fill={C_TEXT_SEC} fontSize="10" fontFamily={F_MONO}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.2 }}
            >
              NOT "A FEW MONTHS"
            </motion.text>
          </svg>
        )}
      </div>

      {/* Secondary Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
        gap: '64px', 
        marginTop: '120px',
        alignItems: 'start'
      }}>
        {/* Break-even box (Typographic, no card) */}
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div style={{ border: '1px solid ' + C_DIVIDER, padding: '32px', borderRadius: '0', position: 'relative' }}>
             <div style={{ fontFamily: F_MONO, fontSize: '11px', color: C_TEXT_SEC, textTransform: 'uppercase', marginBottom: '24px' }}>
               BREAK-EVEN
             </div>
             <div style={{ fontFamily: F_MONO, fontSize: T_HEADLINE, color: C_TEXT_PRI, lineHeight: 1 }}>
               <CountUp end={6} suffix=" months" />
             </div>
             {/* Tiny ↗ arrow */}
             <div style={{ position: 'absolute', bottom: '-24px', right: '0', color: C_INDIGO, fontFamily: F_MONO, fontSize: '10px' }}>
                ↗ actual market data
             </div>
          </div>
        </motion.div>

        {/* Hike stat */}
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <div style={{ borderBottom: '1px solid ' + C_DIVIDER, paddingBottom: '32px' }}>
            <div style={{ fontFamily: F_MONO, fontSize: T_DISPLAY, color: C_GREEN, lineHeight: 1 }}>
              <CountUp end={35} suffix="%" />
            </div>
            <div style={{ fontFamily: F_BODY, fontSize: T_SUBHEAD, color: C_TEXT_SEC, marginTop: '16px' }}>
               actual market hike
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Labels around the section */}
      {!isMobile && (
        <div style={{ position: 'absolute', left: '-120px', top: '40%', transform: 'rotate(-90deg)', fontFamily: F_MONO, fontSize: '10px', color: C_DIVIDER, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
          Real Data · No Fluff
        </div>
      )}
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// SECTION 2: THREE TOOLS (Overlapping Orbit)
// ─────────────────────────────────────────────────────────
function ThreeTools({ onEnter }) {
  var isMobile = useIsMobile()
  var tools = [
    { id: 'TOOL_1', name: 'ROI CALCULATOR', desc: 'Returns break-even to the month, 5-year net gain in rupees, monthly salary delta. The math is shown.' },
    { id: 'TOOL_2', name: 'RESUME AI',      desc: 'AI maps your actual background to India\'s 2026 hiring data. Recommends certs with highest ROI.' },
    { id: 'TOOL_3', name: 'CITY HEATMAP',   desc: 'Live demand tracking across Bangalore, Hyderabad, Pune, and Chennai.' },
  ]

  if (isMobile) {
    return (
      <Section style={{ paddingBottom: '120px' }}>
        <SectionLabel>The Ecosystem</SectionLabel>
        <SectionHeading>Three tools.<br />One goal.</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {tools.map(function(tool, i) {
            return (
              <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <div style={{ fontFamily: F_MONO, fontSize: '12px', color: C_INDIGO, marginBottom: '8px' }}>0{i+1}</div>
                <div style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: '1.5rem', color: C_TEXT_PRI, marginBottom: '12px' }}>{tool.name}</div>
                <div style={{ fontFamily: F_BODY, fontSize: '15px', color: C_TEXT_SEC, lineHeight: 1.8 }}>{tool.desc}</div>
              </motion.div>
            )
          })}
        </div>
        <div style={{ marginTop: '56px' }}>
          <CTAButton onClick={onEnter}>Try Resume AI <ArrowRight size={16} /></CTAButton>
        </div>
      </Section>
    )
  }

  return (
    <Section style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '160px' }}>
      <SectionLabel style={{ position: 'absolute', top: 0, left: 0 }}>The toolkit</SectionLabel>
      
      {/* Central Orbit Connector (SVG) */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
        <motion.circle 
          cx="50%" cy="50%" r="200" 
          fill="none" stroke={C_DIVIDER} strokeWidth="1" strokeDasharray="10 10"
          variants={DRAW} initial="hidden" whileInView="show" viewport={{ once: true }}
        />
        {/* Animated paths between tools */}
        <motion.path 
          d="M 460 100 Q 600 300 460 500" 
          fill="none" stroke={C_INDIGO} strokeWidth="1" strokeOpacity="0.2"
          variants={DRAW} initial="hidden" whileInView="show" viewport={{ once: true }}
        />
      </svg>

      {/* Orbiting Tool Labels */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        
        {/* TOOL 1: ROI Calculator (Top) */}
        <motion.div 
          style={{ position: 'absolute', left: '50%', top: '10%', transform: 'translateX(-50%)', textAlign: 'center', cursor: 'default' }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <div style={{ fontFamily: F_MONO, fontSize: '11px', color: C_INDIGO, letterSpacing: '0.2em', marginBottom: '8px' }}>01</div>
          <div style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: '2.4rem', color: C_TEXT_PRI, letterSpacing: '-0.04em' }}>ROI CALCULATOR</div>
          <div style={{ maxWidth: '280px', margin: '16px auto 0', fontFamily: F_BODY, fontSize: '10px', color: C_TEXT_SEC, lineHeight: 1.6 }}>{tools[0].desc}</div>
        </motion.div>

        {/* TOOL 2: Resume AI (Bottom Left) */}
        <motion.div 
          style={{ position: 'absolute', left: '10%', bottom: '20%', textAlign: 'left', cursor: 'default' }}
          initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
        >
          <div style={{ fontFamily: F_MONO, fontSize: '11px', color: C_INDIGO, letterSpacing: '0.2em', marginBottom: '8px' }}>02</div>
          <div style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: '2.4rem', color: C_TEXT_PRI, letterSpacing: '-0.04em' }}>RESUME AI</div>
          <div style={{ maxWidth: '240px', marginTop: '16px', fontFamily: F_BODY, fontSize: '10px', color: C_TEXT_SEC, lineHeight: 1.6 }}>{tools[1].desc}</div>
        </motion.div>

        {/* TOOL 3: Heatmap (Bottom Right) */}
        <motion.div 
          style={{ position: 'absolute', right: '10%', bottom: '20%', textAlign: 'right', cursor: 'default' }}
          initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
        >
          <div style={{ fontFamily: F_MONO, fontSize: '11px', color: C_INDIGO, letterSpacing: '0.2em', marginBottom: '8px' }}>03</div>
          <div style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: '2.4rem', color: C_TEXT_PRI, letterSpacing: '-0.04em' }}>HEATMAP</div>
          <div style={{ maxWidth: '240px', marginTop: '16px', marginLeft: 'auto', fontFamily: F_BODY, fontSize: '10px', color: C_TEXT_SEC, lineHeight: 1.6 }}>{tools[2].desc}</div>
        </motion.div>

        {/* Central CTA */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
           <CTAButton onClick={onEnter}>Launch Engine <ArrowRight size={16} /></CTAButton>
        </div>

      </div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// SECTION 4: VS OTHER SITES (Strike-Through Composition)
// ─────────────────────────────────────────────────────────
function VsSection() {
  var pairs = [
    { wrong: '"AWS is good for cloud engineers"',      right: 'AWS SAA at ₹9L salary: break-even 6 months, ₹14.2L net gain over 5 years.' },
    { wrong: '"Upskill for career growth"',            right: "₹23,600 extra every month from month 7. Or it isn't worth doing." },
    { wrong: 'US salary data converted to rupees',     right: 'Naukri · AmbitionBox · LinkedIn India. 2026 data. Not converted. Collected.' },
    { wrong: 'The same advice for every professional', right: 'AI reads your resume. Your role. Your city. Your domain. Then it advises.' },
  ]

  return (
    <Section style={{ paddingTop: '120px', paddingBottom: '120px' }}>
      <SectionLabel>The problem with every other site</SectionLabel>
      <SectionHeading>Every other site<br /><span style={{ color: '#EF4444' }}>is lying to you.</span></SectionHeading>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '52px' }}>
        {pairs.map(function(pair, i) {
          return (
            <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <div style={{ position: 'relative', marginBottom: '16px', display: 'inline-block' }}>
                <div style={{ fontFamily: F_HEAD, fontWeight: '600', fontSize: 'clamp(0.95rem,2.2vw,1.3rem)', color: 'rgba(255,255,255,0.15)', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                  {pair.wrong}
                </div>
                <svg style={{ position: 'absolute', left: 0, top: '50%', width: '100%', height: '2px', overflow: 'visible', pointerEvents: 'none' }}>
                  <motion.line x1="0" y1="0" x2="100%" y2="0"
                    stroke="rgba(239,68,68,0.35)" strokeWidth="1.5"
                    variants={DRAW} initial="hidden" whileInView="show" viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                  />
                </svg>
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C_GREEN, marginTop: '9px', flexShrink: 0 }} />
                <div style={{ fontFamily: F_BODY, fontSize: 'clamp(14px,2vw,16px)', color: C_TEXT_PRI, lineHeight: '1.7', fontWeight: '500' }}>{pair.right}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// SECTION 3: 11PM MOMENTS (Newspaper-Style Columns)
// ─────────────────────────────────────────────────────────
function ElevenPM({ onEnter }) {
  var isMobile = useIsMobile()
  var stories = [
    { time:'11:47 PM', name:'Rohan', loc:'Pune', role:'2 yrs · Backend Engineer', thought:'"Should I do AWS? Or is it too late?"', context:'Ex-classmate promoted to Senior Cloud Architect. ₹28L CTC. Same college, same year.', answer:'AWS SAA at ₹9L: break-even 6 months. 5-year gain ₹14.2L. Not too late.', color: C_GREEN },
    { time:'11:12 PM', name:'Sneha', loc:'Bangalore', role:'6 yrs · Ops Manager', thought:'"Is the switch possible without an MBA?"', context:'Every data job requires 3 years of data science experience. She has zero.', answer:'Google Data Analytics + 2 GitHub projects. 5 months. ₹8L to ₹12L, first switch.', color: C_GOLD },
    { time:'12:03 AM', name:'Arjun', loc:'Pune', role:'Fresh graduate · CS', thought:'"Which cert actually gets me placed in India?"', context:'Three cert comparison articles. All recommend AWS. All written by Americans. All in USD.', answer:'Student Mode. India-specific. GCP placed 47 Pune freshers in Q1 2026.', color: C_INDIGO },
  ]

  return (
    <div style={{ borderTop: '1px solid ' + C_DIVIDER, paddingTop: '120px', paddingBottom: '120px' }}>
      <Section>
        <SectionLabel>Who this is for</SectionLabel>
        <SectionHeading>We know what you're<br /><span style={{ color: C_INDIGO }}>going through right now.</span></SectionHeading>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '64px' : '48px', alignItems: 'start' }}>
          {stories.map(function(s, i) {
            return (
              <motion.div key={i}
                variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={onEnter}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C_TEXT_SEC, letterSpacing: '0.07em', marginBottom: '8px' }}>{s.time}</div>
                  <div style={{ fontFamily: F_HEAD, fontSize: '1.2rem', color: C_TEXT_PRI, fontStyle: 'italic', fontWeight: '700', marginBottom: '16px', lineHeight: 1.2 }}>{s.thought}</div>
                  <div style={{ fontFamily: F_BODY, fontSize: '14px', color: C_TEXT_SEC, lineHeight: '1.7', marginBottom: '24px' }}>
                    <em>{s.name}</em>, {s.loc} — {s.role}. {s.context}
                  </div>
                  <div style={{ height: '1px', width: '40px', background: s.color, marginBottom: '20px' }} />
                  <div style={{ fontFamily: F_BODY, fontWeight: '600', fontSize: '14px', color: C_TEXT_PRI, lineHeight: '1.6' }}>{s.answer}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// THREE MODES — column layout, no card fills
// ─────────────────────────────────────────────────────────
function ThreeModes({ onEnter }) {
  var isMobile = useIsMobile()
  var modes = [
    { icon: GraduationCap, color: '#818CF8', label: 'Student',      sub: 'No salary yet',    desc: 'Path to a ₹4.8L+ first offer. Student Mode reframes ROI around career investment, not salary hike.' },
    { icon: Repeat,        color: C_GOLD,    label: 'Switcher',     sub: 'Changing domains', desc: 'Domain switch in 5–8 months with the right cert. Only fast-track options for your background.' },
    { icon: Briefcase,     color: C_GREEN,   label: 'Professional', sub: 'Levelling up',     desc: 'Maximum ROI on your next cert. Break-even analysis, hike benchmarks, pitch-your-boss email included.' },
  ]

  return (
    <Section style={{ paddingTop: '120px', paddingBottom: '120px' }}>
      <SectionLabel>Adapts to who you are</SectionLabel>
      <SectionHeading>Three modes.<br /><span style={{ color: C_INDIGO }}>One tool.</span></SectionHeading>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? '48px' : '0', borderTop: '1px solid ' + C_DIVIDER, paddingTop: '48px', position: 'relative' }}>
        {!isMobile ? (
          <>
            <div style={{ position:'absolute',left:'33.33%',top:'48px',bottom:0,width:'1px',background: C_DIVIDER }} />
            <div style={{ position:'absolute',left:'66.66%',top:'48px',bottom:0,width:'1px',background: C_DIVIDER }} />
          </>
        ) : null}
        {modes.map(function(m, i) {
          return (
            <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ paddingLeft: i > 0 && !isMobile ? '48px' : 0, paddingRight: i < 2 && !isMobile ? '48px' : 0 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '7px', background: m.color + '10', border: '1px solid ' + m.color + '1E', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <m.icon size={15} color={m.color} />
              </div>
              <div style={{ fontFamily: F_HEAD, fontWeight: '700', fontSize: '1.05rem', color: C_TEXT_PRI, letterSpacing: '-0.02em', marginBottom: '4px' }}>{m.label}</div>
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: m.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>{m.sub}</div>
              <div style={{ fontFamily: F_BODY, fontSize: '14px', color: C_TEXT_SEC, lineHeight: '1.75' }}>{m.desc}</div>
            </motion.div>
          )
        })}
      </div>

      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ marginTop: '56px' }}>
        <CTAButton onClick={onEnter}><Zap size={15} /> Pick My Mode</CTAButton>
      </motion.div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// SECTION 5: SOCIAL PROOF (Pull Quote Layout)
// ─────────────────────────────────────────────────────────
function SocialProof() {
  var isMobile = useIsMobile()
  var quotes = [
    { quote: 'CertifyROI said break-even was 8 months. It was 7. Switched companies 7 months in.', name: 'Priya S.', detail: 'Bangalore · Engineer → Cloud Architect', hike: '+₹6L/yr', color: C_GREEN },
    { quote: 'Was about to spend ₹12L on an MBA. Resume AI showed me Google Analytics gets there in 5 months at 1% of the cost.', name: 'Rahul M.', detail: 'Hyderabad · Ops Manager → Data Analyst', hike: 'Saved ₹12L', color: C_INDIGO },
    { quote: 'Student Mode showed GCP had faster placement for freshers in Pune specifically. Got ₹5.2L. No salary field needed.', name: 'Ananya K.', detail: 'Pune · Fresh Graduate', hike: '₹5.2L offer', color: C_INDIGO },
  ]

  return (
    <div style={{ borderTop: '1px solid ' + C_DIVIDER, paddingTop: '120px', paddingBottom: '120px' }}>
      <Section>
        <SectionLabel>From people who ran the numbers</SectionLabel>
        <SectionHeading>They used the data.<br /><span style={{ color: C_GREEN }}>It worked.</span></SectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {quotes.map(function(q, i) {
            return (
              <motion.div key={i}
                variants={SLIDE_IN} initial="hidden" whileInView="show" viewport={{ once: true }}
                style={{ paddingTop: i > 0 ? '56px' : 0, paddingBottom: '56px', borderBottom: i < quotes.length-1 ? '1px solid ' + C_DIVIDER : 'none', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 200px', gap: '32px', alignItems: 'end' }}>
                <div>
                  <div style={{ fontFamily: F_HEAD, fontWeight: '700', fontSize: 'clamp(1.1rem,2.5vw,1.7rem)', color: C_TEXT_PRI, letterSpacing: '-0.03em', fontStyle: 'italic', lineHeight: 1.35, marginBottom: '22px' }}>
                    "{q.quote}"
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '20px', height: '1px', background: q.color }} />
                    <span style={{ fontFamily: F_BODY, fontWeight: '600', fontSize: '14px', color: C_TEXT_PRI, fontStyle: 'italic' }}>{q.name}</span>
                    <span style={{ fontFamily: F_BODY, fontSize: '13px', color: C_TEXT_SEC }}>{q.detail}</span>
                  </div>
                </div>
                <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                  <div style={{ fontFamily: F_MONO, fontWeight: '700', fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', color: C_GOLD, letterSpacing: '-0.04em', lineHeight: 1 }}>{q.hike}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SECTION 6: FINAL CTA (Typographic Monument)
// ─────────────────────────────────────────────────────────
function FinalCTA({ onEnter }) {
  return (
    <Section style={{ paddingTop: '140px', paddingBottom: '120px', textAlign: 'center' }}>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <div style={{ fontFamily: F_MONO, fontSize: '11px', color: C_TEXT_SEC, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '32px' }}>
          2 minutes from now
        </div>
        <h2 style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(2.4rem,8vw,6.5rem)', color: C_TEXT_PRI, letterSpacing: '-0.05em', lineHeight: 0.9, marginBottom: '44px', marginTop: 0 }}>
          YOU'LL KNOW<br />THE ANSWER.
        </h2>
      </motion.div>
      <motion.p variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }}
        style={{ fontFamily: F_BODY, fontSize: 'clamp(14px,2vw,16px)', color: C_TEXT_SEC, lineHeight: '1.8', maxWidth: '380px', margin: '0 auto 44px' }}>
        Stop reading about certs. Stop asking Reddit.{' '}
        <span style={{ color: C_TEXT_PRI, fontWeight: '600' }}>Run the numbers.</span>
      </motion.p>
      <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.2 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <CTAButton onClick={onEnter} size="large">Run My Numbers <ArrowRight size={18} /></CTAButton>
        <div style={{ fontFamily: F_MONO, fontSize: '10px', color: C_TEXT_SEC, letterSpacing: '0.1em' }}>
          FREE · NO CARD · NO SIGNUP · NO PAYWALLS
        </div>
      </motion.div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// PAGE FOOTER — minimal
// ─────────────────────────────────────────────────────────
function PageFooter() {
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 48px' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{ width: '24px', height: '24px', background: C_INDIGO, borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={12} color="white" />
          </div>
          <span style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: '15px', letterSpacing: '-0.03em', color: C_TEXT_PRI }}>
            Certify<span style={{ color: C_INDIGO }}>ROI</span>
          </span>
        </div>
        <div style={{ fontFamily: F_MONO, fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.06em', opacity: 0.45 }}>
          DATA: LINKEDIN · NASSCOM · AMBITIONBOX · NAUKRI · WEF 2026
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  var heroRef  = useRef(null)
  var isMobile = useIsMobile()

  var { scrollYProgress: heroSP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  var heroY  = useTransform(heroSP, [0,1], [0, isMobile ? 30 : 60])
  var heroOp = useTransform(heroSP, [0,0.5], [1,0])

  return (
    <div style={{ minHeight: '100vh', background: C_BG }}>

      {/* ── HERO ── */}
      <div ref={heroRef} style={{ maxWidth: '920px', margin: '0 auto', padding: 'calc(var(--nav-h,64px) + 72px) ' + (isMobile ? '20px' : '48px') + ' 80px' }}>
        <motion.div style={{ y: heroY, opacity: heroOp }}>

          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16,1,0.3,1] }}
            style={{ fontFamily: F_MONO, fontSize: '11px', color: C_INDIGO, opacity: 0.5, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '44px' }}>
            India's first AI-powered cert ROI calculator
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7, ease: [0.16,1,0.3,1] }}
            style={{ fontFamily: F_HEAD, fontWeight: '800', fontSize: 'clamp(2.8rem,9vw,6.5rem)', lineHeight: 0.9, letterSpacing: '-0.05em', color: C_TEXT_PRI, marginBottom: '32px', wordBreak: 'break-word', marginTop: 0 }}>
            YOUR NEXT CERT<br />
            IS EITHER A{' '}
            <span style={{ color: C_GOLD }}>GOLDMINE</span><br />
            OR A{' '}
            <span style={{ color: '#EF4444' }}>MISTAKE.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16,1,0.3,1] }}
            style={{ fontFamily: F_BODY, fontSize: 'clamp(15px,2.2vw,18px)', color: C_TEXT_SEC, maxWidth: '500px', lineHeight: '1.8', margin: 0 }}>
            We tell you which — in under 2 seconds — before you spend ₹50K and 6 months finding out the hard way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{ marginTop: '60px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.div
              animate={{ y: [0,6,0], opacity: [0.3,0.65,0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '20px', height: '34px', borderRadius: '10px', border: '1.5px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5px' }}>
              <div style={{ width: '2.5px', height: '7px', borderRadius: '2px', background: 'rgba(255,255,255,0.2)' }} />
            </motion.div>
            <span style={{ fontFamily: F_MONO, fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>scroll</span>
          </motion.div>

        </motion.div>
      </div>

      <Ticker />
      <CertAssembly />
      <DataComposition />
      <HRule />
      <ThreeTools onEnter={onEnter} />
      <VsSection />
      <ElevenPM onEnter={onEnter} />
      <ThreeModes onEnter={onEnter} />
      <SocialProof />
      <FinalCTA onEnter={onEnter} />
      <PageFooter />

    </div>
  )
}

export default LandingPage