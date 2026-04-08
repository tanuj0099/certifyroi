import {
  motion, useScroll, useTransform
} from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  TrendingUp, ArrowRight,
  GraduationCap, Repeat, Briefcase, Zap,
  BarChart2, Brain, MapPin
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
// DESIGN TOKENS — CSS variables so theme switching works
// ─────────────────────────────────────────────────────────
var F_HEAD = "'Bricolage Grotesque','Plus Jakarta Sans',sans-serif"
var F_MONO = "'Commit Mono','JetBrains Mono',monospace"
var F_BODY = "'Inter',sans-serif"

// These read from index.css CSS variables — no hardcoded hex
var T  = 'var(--text)'        // primary text
var T2 = 'var(--text-2)'      // secondary text
var T3 = 'var(--text-3)'      // muted text
var T4 = 'var(--text-4)'      // very muted
var BG = 'var(--bg)'
var INDIGO = 'var(--indigo)'
var INDIGO_L = 'var(--indigo-light)'
var EMERALD = 'var(--emerald)'
var AMBER = 'var(--amber)'
var DIV = 'var(--border)'     // dividers

// Fixed accent colors (same in both themes — used sparingly)
var GOLD  = '#D97706'   // darker amber, readable on light too
var GREEN = '#059669'   // darker green, readable on light too
var RED   = '#DC2626'

// Motion variants
var RISE = {
  hidden: { y: 20, opacity: 0 },
  show:   { y: 0,  opacity: 1, transition: { duration: 0.65, ease: [0.16,1,0.3,1] } }
}
var SLIDE = {
  hidden: { x: -32, opacity: 0 },
  show:   { x: 0,   opacity: 1, transition: { duration: 0.7,  ease: [0.16,1,0.3,1] } }
}
var SLIDE_R = {
  hidden: { x: 32, opacity: 0 },
  show:   { x: 0,  opacity: 1, transition: { duration: 0.7,  ease: [0.16,1,0.3,1] } }
}

// ─────────────────────────────────────────────────────────
// COUNT-UP
// ─────────────────────────────────────────────────────────
function CountUp({ end, prefix, suffix, duration }) {
  duration = duration || 2
  var [count, setCount] = useState(0)
  var [on, setOn] = useState(false)

  useEffect(function() {
    if (!on) return
    var endVal = parseFloat(String(end).replace(/[^0-9.]/g,''))
    var frames = Math.round(duration * 60)
    var f = 0
    var t = setInterval(function() {
      f++
      var p = f / frames
      var ease = 1 - Math.pow(1 - p, 3)
      setCount(endVal * ease)
      if (f >= frames) { setCount(endVal); clearInterval(t) }
    }, 1000/60)
    return function() { clearInterval(t) }
  }, [on, end, duration])

  return (
    <motion.span onViewportEnter={function() { setOn(true) }}>
      {prefix}{count.toLocaleString('en-IN', { maximumFractionDigits: String(end).includes('.') ? 1 : 0 })}{suffix}
    </motion.span>
  )
}

// ─────────────────────────────────────────────────────────
// LAYOUT SHELL
// ─────────────────────────────────────────────────────────
function Wrap({ children, style }) {
  var isMobile = useIsMobile()
  return (
    <div style={{ maxWidth:'920px', margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px', ...style }}>
      {children}
    </div>
  )
}

function Rule() {
  return <div style={{ height:'1px', background: DIV, margin: '0' }} />
}

function Label({ children, style }) {
  return (
    <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
      style={{ fontFamily:F_MONO, fontSize:'10px', color:T4, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px', ...style }}>
      {children}
    </motion.div>
  )
}

function Heading({ children, style }) {
  return (
    <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
      style={{ fontFamily:F_HEAD, fontWeight:'800', fontSize:'clamp(1.9rem,5vw,3.5rem)', color:T, letterSpacing:'-0.04em', lineHeight:1, marginTop:0, marginBottom:'60px', ...style }}>
      {children}
    </motion.h2>
  )
}

function CTA({ onClick, children, large }) {
  return (
    <motion.button onClick={onClick}
      whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
      transition={{ duration:0.18 }}
      style={{ padding: large ? '15px 40px' : '12px 28px', borderRadius:'50px', border:'none', background:INDIGO, color:'white', fontSize: large ? '16px' : '14px', fontFamily:F_HEAD, fontWeight:'700', letterSpacing:'-0.02em', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'9px', boxShadow:'0 4px 20px rgba(99,102,241,0.25)' }}>
      {children}
    </motion.button>
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
    <div style={{ overflow:'hidden', borderTop:'1px solid '+DIV, borderBottom:'1px solid '+DIV, padding:'11px 0', background:'var(--surface)' }}>
      <motion.div animate={{ x:['0%','-50%'] }} transition={{ duration:40, repeat:Infinity, ease:'linear' }}
        style={{ display:'flex', gap:'80px', whiteSpace:'nowrap', width:'max-content' }}>
        {[...items,...items].map(function(item,i) {
          return (
            <span key={i} style={{ fontSize:'11px', color:T4, fontFamily:F_MONO, flexShrink:0, letterSpacing:'0.04em' }}>
              <span style={{ color:INDIGO, opacity:0.5, marginRight:'14px' }}>◆</span>{item}
            </span>
          )
        })}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CERT ASSEMBLY — unchanged, working
// ─────────────────────────────────────────────────────────
function CertAssembly() {
  var isDark   = useIsDark()
  var isMobile = useIsMobile()

  var certBg    = isDark ? '#04060e'                : '#F8F7F4'
  var certText1 = isDark ? '#F0F2FF'                : '#0F172A'
  var certText2 = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,23,42,0.45)'
  var certMuted = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.3)'
  var certDot   = isDark ? 'rgba(99,102,241,0.2)'   : 'rgba(99,102,241,0.15)'
  var overlayBg = isDark ? '#020408'                : '#F0EDE8'

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

  function remap(p,a,b,c,d) {
    return c + (d-c) * Math.max(0, Math.min(1, (p-a)/(b-a)))
  }

  var p8 = remap(prog,0,0.8,0,1)
  var l1,l2,l3
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
    <div ref={trackRef} style={{ height:'300vh', position:'relative' }}>
      <div style={{ position:'sticky', top:0, height:'100vh', width:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', background:overlayBg, opacity:overlayOp }} />
        <div style={{ position:'relative', zIndex:4 }}>
          <div style={{ transform:'scale('+certScale+')', opacity:certOpacity }}>
            <div style={{ position:'relative', width:isMobile?'min(320px,88vw)':'min(500px,88vw)', height:'calc('+(isMobile?'min(320px,88vw)':'min(500px,88vw)')+' / 1.414)', transformStyle:'preserve-3d' }}>
              <div style={{ position:'absolute', inset:0, transform:l1 }}>
                <svg viewBox="0 0 500 354" width="100%" height="100%" style={{ position:'absolute', inset:0, display:'block' }}>
                  <defs>
                    <linearGradient id="cBorder" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"   stopColor="#6366F1"/><stop offset="32%" stopColor="#818CF8"/>
                      <stop offset="66%"  stopColor="#10B981"/><stop offset="100%" stopColor="#51B1E7"/>
                    </linearGradient>
                    <filter id="cGlow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  </defs>
                  <rect x="0" y="0" width="500" height="354" rx="16" fill={certBg} fillOpacity="0.97"/>
                  <rect x="1.5" y="1.5" width="497" height="351" rx="15" fill="none" stroke="url(#cBorder)" strokeWidth="2.5" filter="url(#cGlow)"/>
                  <rect x="10" y="10" width="480" height="334" rx="11" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="0.6"/>
                  {[[22,22],[478,22],[22,332],[478,332]].map(function(arr,i){
                    var cx=arr[0],cy=arr[1]
                    return(<g key={i}><circle cx={cx} cy={cy} r="5.5" fill="none" stroke="#6366F1" strokeWidth="1.6"/><circle cx={cx} cy={cy} r="10" fill="none" stroke="rgba(99,102,241,0.28)" strokeWidth="0.6"/><line x1={cx-14} y1={cy} x2={cx+14} y2={cy} stroke="rgba(99,102,241,0.5)" strokeWidth="0.7"/><line x1={cx} y1={cy-14} x2={cx} y2={cy+14} stroke="rgba(99,102,241,0.5)" strokeWidth="0.7"/></g>)
                  })}
                  <line x1="48" y1="1.5" x2="100" y2="1.5" stroke="#818CF8" strokeWidth="3.5"/>
                  <line x1="400" y1="1.5" x2="452" y2="1.5" stroke="#10B981" strokeWidth="3.5"/>
                  <line x1="48" y1="352.5" x2="100" y2="352.5" stroke="#10B981" strokeWidth="3.5"/>
                  <line x1="400" y1="352.5" x2="452" y2="352.5" stroke="#818CF8" strokeWidth="3.5"/>
                </svg>
              </div>
              <div style={{ position:'absolute', inset:0, transform:l2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,40px)' }}>
                <div style={{ fontFamily:F_MONO, fontSize:'9px', color:'rgba(99,102,241,0.72)', letterSpacing:'0.26em', marginBottom:'11px', textTransform:'uppercase' }}>CERTIFYROI · INDIA 2026</div>
                <div style={{ fontFamily:F_HEAD, fontWeight:'800', fontSize:'clamp(0.9rem,3.2vw,1.75rem)', letterSpacing:'-0.04em', color:certText1, marginBottom:'6px', textAlign:'center', lineHeight:1.1 }}>Your Certification</div>
                <div style={{ fontFamily:F_BODY, fontSize:'clamp(10px,1.5vw,12px)', color:certText2, marginBottom:'22px', textAlign:'center' }}>Personalised ROI Analysis · Your City</div>
                <div style={{ display:'flex', gap:'clamp(10px,4vw,40px)', marginBottom:'18px' }}>
                  {[{label:'BREAK-EVEN',value:'6 mo',color:'#F59E0B'},{label:'5-YR GAIN',value:'₹14.2L',color:'#10B981'},{label:'HIKE',value:'+35%',color:'#818CF8'}].map(function(s,i){
                    return(<div key={i} style={{textAlign:'center'}}><div style={{fontFamily:F_MONO,fontSize:'7px',color:certMuted,letterSpacing:'0.12em',marginBottom:'5px'}}>{s.label}</div><div style={{fontFamily:F_MONO,fontSize:'clamp(0.8rem,2.5vw,1.5rem)',color:s.color,fontWeight:'700',letterSpacing:'-0.03em'}}>{s.value}</div></div>)
                  })}
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
          <div style={{ opacity:hintOp, marginTop:'44px', textAlign:'center', pointerEvents:'none', transition:'opacity 0.3s' }}>
            <motion.div animate={{ y:[0,8,0] }} transition={{ duration:1.7, repeat:Infinity, ease:'easeInOut' }}>
              <div style={{ fontFamily:F_MONO, fontSize:'11px', color:'rgba(99,102,241,0.5)', letterSpacing:'0.22em', textTransform:'uppercase' }}>↓  scroll to assemble  ↓</div>
            </motion.div>
          </div>
        </div>
        <div style={{ opacity:assembledOp, position:'absolute', bottom:'8%', left:0, right:0, textAlign:'center', pointerEvents:'none', zIndex:5, transition:'opacity 0.3s' }}>
          <div style={{ fontFamily:F_MONO, fontSize:'12px', color:'rgba(16,185,129,0.8)', letterSpacing:'0.22em', textTransform:'uppercase' }}>✓  YOUR ROI CERTIFICATE · ASSEMBLED</div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SEC 1 — DATA COMPOSITION
// Numbers as the hero. No cards. Pure typographic layout.
// ─────────────────────────────────────────────────────────
function DataComposition() {
  var isMobile = useIsMobile()

  return (
    <div style={{ paddingTop:'clamp(80px,12vw,140px)', paddingBottom:'clamp(80px,12vw,140px)' }}>
      <Wrap>
        <Label>What that certificate means for you</Label>

        {/* Giant number — the anchor */}
        <motion.div variants={SLIDE} initial="hidden" whileInView="show" viewport={{ once:true }}
          style={{ marginBottom:'clamp(48px,8vw,96px)' }}>
          <div style={{ fontFamily:F_MONO, fontSize:'clamp(3.5rem,14vw,9rem)', color:AMBER, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'700' }}>
            <CountUp end={14.2} prefix="₹" suffix="L" />
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:'16px', marginTop:'12px', flexWrap:'wrap' }}>
            <div style={{ fontFamily:F_HEAD, fontSize:'clamp(1rem,2.5vw,1.4rem)', color:T2, fontStyle:'italic' }}>
              5-year net gain · AWS Solutions Architect
            </div>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:T4, letterSpacing:'0.1em', textTransform:'uppercase' }}>
              Bangalore median · 2026
            </div>
          </div>
        </motion.div>

        {/* Two-column stats row */}
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '0' : '0', borderTop:'1px solid '+DIV }}>

          {/* Break-even */}
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
            style={{ padding: isMobile ? '40px 0' : '56px 0', paddingRight: isMobile ? '0' : '64px', borderBottom: isMobile ? '1px solid '+DIV : 'none', borderRight: isMobile ? 'none' : '1px solid '+DIV }}>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:T4, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'16px' }}>
              Break-even
            </div>
            <div style={{ fontFamily:F_MONO, fontSize:'clamp(2.5rem,8vw,5rem)', color:T, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'700', marginBottom:'12px' }}>
              <CountUp end={6} suffix=" mo" />
            </div>
            <div style={{ fontFamily:F_BODY, fontSize:'14px', color:T3, lineHeight:'1.7' }}>
              Not "a few months." The exact month your cert investment turns profitable — based on your salary and city.
            </div>
          </motion.div>

          {/* Hike */}
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.1 }}
            style={{ padding: isMobile ? '40px 0' : '56px 0', paddingLeft: isMobile ? '0' : '64px' }}>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:T4, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'16px' }}>
              Actual market hike
            </div>
            <div style={{ fontFamily:F_MONO, fontSize:'clamp(2.5rem,8vw,5rem)', color:T, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'700', marginBottom:'12px' }}>
              <CountUp end={35} suffix="%" />
            </div>
            <div style={{ fontFamily:F_BODY, fontSize:'14px', color:T3, lineHeight:'1.7' }}>
              India-sourced. City-specific. Not US data converted at today's rate and called "India salary data."
            </div>
          </motion.div>

        </div>

        {/* Third stat — full width, different treatment */}
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.2 }}
          style={{ borderTop:'1px solid '+DIV, paddingTop: isMobile ? '40px' : '56px', marginTop:0, display:'flex', gap: isMobile ? '24px' : '48px', alignItems:'flex-start', flexWrap:'wrap' }}>
          <div>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:T4, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'12px' }}>
              Monthly extra from month 7
            </div>
            <div style={{ fontFamily:F_MONO, fontSize:'clamp(1.8rem,5vw,3rem)', color:EMERALD, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'700' }}>
              ₹23,600
            </div>
          </div>
          <div style={{ flex:1, minWidth:'200px' }}>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:T4, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'12px' }}>
              103 certifications tracked
            </div>
            <div style={{ fontFamily:F_BODY, fontSize:'14px', color:T3, lineHeight:'1.75' }}>
              Across 17 domains — cloud, data, finance, medical, law, government, architecture. Every cert mapped to real hiring data, not self-reported opinion.
            </div>
          </div>
        </motion.div>

      </Wrap>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SEC 2 — THREE TOOLS
// Redesigned: vertical numbered list desktop,
// stacked mobile. SVG connector line between them.
// No orbit — that concept doesn't scale to mobile.
// ─────────────────────────────────────────────────────────
function ThreeTools({ onEnter }) {
  var isMobile = useIsMobile()

  var tools = [
    {
      num: '01',
      name: 'ROI Calculator',
      icon: BarChart2,
      color: '#6366F1',
      tag: 'The Math',
      desc: 'Enter your current salary, cert cost, and expected hike. The calculator returns break-even to the exact month, 5-year net gain in rupees, and monthly salary delta. Every number is sourced. Every number is shown.',
      stats: [{ l:'Break-even', v:'6 months' }, { l:'5-yr gain', v:'₹14.2L' }, { l:'Monthly +', v:'₹23.6K' }],
    },
    {
      num: '02',
      name: 'Resume AI',
      icon: Brain,
      color: '#10B981',
      tag: 'The Intelligence',
      desc: 'Upload your resume. AI reads your actual background — your domain, your role, your years of experience — and maps it to India\'s 2026 hiring data. It recommends the certification with the highest ROI for your specific profile.',
      stats: [{ l:'Analysis time', v:'< 2 seconds' }, { l:'Certs mapped', v:'103' }, { l:'Domains', v:'17' }],
    },
    {
      num: '03',
      name: 'City Heatmap',
      icon: MapPin,
      color: '#F59E0B',
      tag: 'The Market',
      desc: 'See live demand intensity for any certification across Bangalore, Hyderabad, Pune, Mumbai, Delhi, Chennai, Kolkata, and Ahmedabad. Salary benchmarks are city-specific, not national averages that flatten everything.',
      stats: [{ l:'Cities', v:'8 metros' }, { l:'Data updated', v:'Quarterly' }, { l:'Source', v:'Naukri 2026' }],
    },
  ]

  return (
    <div style={{ background:'var(--surface)', borderTop:'1px solid '+DIV, borderBottom:'1px solid '+DIV, paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)' }}>
      <Wrap>
        <Label>The toolkit</Label>
        <Heading>Three tools.<br />One decision.</Heading>

        <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
          {tools.map(function(tool, i) {
            var Icon = tool.icon
            var isLast = i === tools.length - 1
            return (
              <motion.div key={i}
                variants={i % 2 === 0 ? SLIDE : SLIDE_R}
                initial="hidden" whileInView="show" viewport={{ once:true }}
                style={{
                  display:'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '120px 1fr',
                  gap: isMobile ? '24px' : '48px',
                  paddingTop: i === 0 ? '0' : 'clamp(48px,6vw,72px)',
                  paddingBottom: isLast ? '0' : 'clamp(48px,6vw,72px)',
                  borderBottom: isLast ? 'none' : '1px solid '+DIV,
                  alignItems:'start',
                }}>

                {/* Left — number + icon */}
                <div style={{ display:'flex', alignItems: isMobile ? 'center' : 'flex-start', gap:'16px', flexDirection: isMobile ? 'row' : 'column' }}>
                  <div style={{ fontFamily:F_MONO, fontSize:'clamp(2rem,4vw,3rem)', color:T4, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'700', opacity:0.35 }}>
                    {tool.num}
                  </div>
                  <div style={{ width:isMobile?'40px':'48px', height:isMobile?'40px':'48px', borderRadius:'10px', background:tool.color+'12', border:'1px solid '+tool.color+'25', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon size={isMobile?18:22} color={tool.color} />
                  </div>
                </div>

                {/* Right — content */}
                <div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'16px', marginBottom:'14px', flexWrap:'wrap' }}>
                    <div style={{ fontFamily:F_HEAD, fontWeight:'800', fontSize:'clamp(1.3rem,3vw,2rem)', color:T, letterSpacing:'-0.03em' }}>
                      {tool.name}
                    </div>
                    <div style={{ fontFamily:F_MONO, fontSize:'10px', color:tool.color, letterSpacing:'0.1em', textTransform:'uppercase', opacity:0.8 }}>
                      {tool.tag}
                    </div>
                  </div>
                  <div style={{ fontFamily:F_BODY, fontSize:'15px', color:T3, lineHeight:'1.8', marginBottom:'28px', maxWidth:'560px' }}>
                    {tool.desc}
                  </div>
                  <div style={{ display:'flex', gap: isMobile ? '20px' : '36px', flexWrap:'wrap' }}>
                    {tool.stats.map(function(s,j) {
                      return (
                        <div key={j}>
                          <div style={{ fontFamily:F_MONO, fontSize:'9px', color:T4, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'5px' }}>{s.l}</div>
                          <div style={{ fontFamily:F_MONO, fontSize:'clamp(0.9rem,2vw,1.1rem)', color:T, fontWeight:'700', letterSpacing:'-0.02em' }}>{s.v}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </motion.div>
            )
          })}
        </div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.25 }}
          style={{ marginTop:'clamp(48px,6vw,72px)', display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap' }}>
          <CTA onClick={onEnter} large={true}>Launch Engine <ArrowRight size={17} /></CTA>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:T4, letterSpacing:'0.1em' }}>
            FREE · NO SIGNUP REQUIRED
          </div>
        </motion.div>

      </Wrap>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SEC 3 — VS SECTION (Strikethrough Composition)
// ─────────────────────────────────────────────────────────
function VsSection() {
  var pairs = [
    { wrong:'"AWS is good for cloud engineers"',      right:'AWS SAA at ₹9L salary: break-even 6 months. ₹14.2L net gain over 5 years. Or it isn\'t worth doing.' },
    { wrong:'"Upskill for career growth"',            right:'₹23,600 extra every single month from month 7. Compounding over 5 years. In rupees. Not "career growth."' },
    { wrong:'US salary data converted to rupees',     right:'Naukri. AmbitionBox. LinkedIn India. 2026 data. Not converted from San Francisco. Actually collected here.' },
    { wrong:'The same advice for every professional', right:'AI reads your resume. Sees your domain. Sees your city. Then advises. Not a blog post written for no one.' },
  ]

  return (
    <div style={{ paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)' }}>
      <Wrap>
        <Label>The problem with every other site</Label>
        <Heading>
          Every other site<br />
          <span style={{ color:RED }}>is lying to you.</span>
        </Heading>

        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(36px,5vw,56px)' }}>
          {pairs.map(function(pair,i) {
            return (
              <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay: i * 0.08 }}>

                {/* Strikethrough row */}
                <div style={{ position:'relative', display:'inline-block', marginBottom:'14px', maxWidth:'100%' }}>
                  <div style={{ fontFamily:F_HEAD, fontWeight:'600', fontSize:'clamp(0.95rem,2.2vw,1.25rem)', color:T, opacity:0.18, letterSpacing:'-0.02em', lineHeight:1.3, wordBreak:'break-word' }}>
                    {pair.wrong}
                  </div>
                  {/* SVG strikethrough — animates in */}
                  <svg style={{ position:'absolute', left:0, top:'50%', width:'100%', height:'2px', overflow:'visible', pointerEvents:'none' }}>
                    <motion.line x1="0" y1="0" x2="100%" y2="0"
                      stroke={RED} strokeWidth="1.5" strokeOpacity="0.4"
                      initial={{ pathLength:0, opacity:0 }}
                      whileInView={{ pathLength:1, opacity:1 }}
                      viewport={{ once:true }}
                      transition={{ duration:0.8, delay:0.15 + i*0.06, ease:'easeOut' }}
                    />
                  </svg>
                </div>

                {/* Correct version */}
                <div style={{ display:'flex', gap:'14px', alignItems:'flex-start' }}>
                  <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:GREEN, marginTop:'10px', flexShrink:0 }} />
                  <div style={{ fontFamily:F_BODY, fontSize:'clamp(14px,2vw,16px)', color:T, lineHeight:'1.75', fontWeight:'500' }}>
                    {pair.right}
                  </div>
                </div>

              </motion.div>
            )
          })}
        </div>

      </Wrap>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SEC 4 — 11PM MOMENTS
// Editorial column layout — no cards
// ─────────────────────────────────────────────────────────
function ElevenPM({ onEnter }) {
  var isMobile = useIsMobile()

  var stories = [
    { time:'11:47 PM', name:'Rohan', loc:'Pune', role:'2 yrs · Backend Engineer', thought:'"Should I do AWS? Or is it too late?"', context:'Ex-classmate promoted to Senior Cloud Architect. ₹28L CTC. Same college, same year.', answer:'AWS SAA at ₹9L: break-even 6 months. 5-year gain ₹14.2L. Not too late.', color:'#6366F1' },
    { time:'11:12 PM', name:'Sneha', loc:'Bangalore', role:'6 yrs · Ops Manager',  thought:'"Is the switch possible without an MBA?"',  context:'Every data job requires 3 years of data science experience. She has zero.',     answer:'Google Data Analytics + 2 GitHub projects. 5 months. ₹8L → ₹12L.',  color:'#F59E0B' },
    { time:'12:03 AM', name:'Arjun', loc:'Pune',      role:'CS · Fresh graduate',   thought:'"Which cert actually gets me placed in India?"', context:'Three comparison articles. All recommend AWS. All written by Americans. All in USD.', answer:'Student Mode. India-specific. GCP placed 47 Pune freshers in Q1 2026.', color:'#818CF8' },
  ]

  return (
    <div style={{ background:'var(--surface)', borderTop:'1px solid '+DIV, borderBottom:'1px solid '+DIV, paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)' }}>
      <Wrap>
        <Label>Who this is for</Label>
        <Heading>We know what you're<br />going through right now.</Heading>

        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? '0' : '0', borderTop:'1px solid '+DIV }}>
          {stories.map(function(s,i) {
            var borderStyle = isMobile
              ? { borderBottom: i < stories.length-1 ? '1px solid '+DIV : 'none' }
              : { borderRight: i < stories.length-1 ? '1px solid '+DIV : 'none' }

            return (
              <motion.div key={i}
                variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay: i*0.1 }}
                onClick={onEnter}
                style={{ padding: isMobile ? 'clamp(36px,5vw,48px) 0' : '0', paddingLeft: !isMobile && i > 0 ? 'clamp(32px,4vw,48px)' : '0', paddingRight: !isMobile && i < 2 ? 'clamp(32px,4vw,48px)' : '0', paddingTop: !isMobile ? 'clamp(36px,5vw,48px)' : undefined, paddingBottom: !isMobile ? 'clamp(36px,5vw,48px)' : undefined, cursor:'pointer', ...borderStyle }}>

                <div style={{ fontFamily:F_MONO, fontSize:'10px', color:T4, letterSpacing:'0.08em', marginBottom:'16px' }}>
                  {s.time}
                </div>

                {/* The thought — italic headline */}
                <div style={{ fontFamily:F_HEAD, fontWeight:'700', fontSize:'clamp(1rem,2.2vw,1.25rem)', color:T, fontStyle:'italic', lineHeight:1.3, marginBottom:'18px' }}>
                  {s.thought}
                </div>

                {/* Context — muted body */}
                <div style={{ fontFamily:F_BODY, fontSize:'14px', color:T3, lineHeight:'1.75', marginBottom:'24px' }}>
                  <em>{s.name}</em>, {s.loc} — {s.role}. {s.context}
                </div>

                {/* Answer rule + answer */}
                <div style={{ width:'32px', height:'1.5px', background:s.color, marginBottom:'16px' }} />
                <div style={{ fontFamily:F_BODY, fontWeight:'600', fontSize:'14px', color:T, lineHeight:'1.65' }}>
                  {s.answer}
                </div>

              </motion.div>
            )
          })}
        </div>

      </Wrap>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SEC 5 — THREE MODES
// Column layout, vertical dividers, no fills
// ─────────────────────────────────────────────────────────
function ThreeModes({ onEnter }) {
  var isMobile = useIsMobile()

  var modes = [
    { icon:GraduationCap, color:'#818CF8', label:'Student',      sub:'No salary yet',    desc:'Path to a ₹4.8L+ first offer. Student Mode reframes ROI around career investment, not salary hike percentage. No salary slider needed.' },
    { icon:Repeat,        color:AMBER,     label:'Switcher',     sub:'Changing domains', desc:'Domain switch in 5–8 months with the right certification. Only fast-track options. Long certs hidden unless you ask for them.' },
    { icon:Briefcase,     color:EMERALD,   label:'Professional', sub:'Levelling up',     desc:'Maximum ROI on your next cert. Break-even analysis, city hike benchmarks, and a pitch-your-boss email if your company sponsors it.' },
  ]

  return (
    <div style={{ paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)' }}>
      <Wrap>
        <Label>Adapts to who you are</Label>
        <Heading>Three modes.<br /><span style={{ color:INDIGO }}>One tool.</span></Heading>

        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:0, borderTop:'1px solid '+DIV, position:'relative' }}>
          {/* Desktop vertical dividers */}
          {!isMobile && (
            <>
              <div style={{ position:'absolute', left:'33.33%', top:0, bottom:0, width:'1px', background:DIV }} />
              <div style={{ position:'absolute', left:'66.66%', top:0, bottom:0, width:'1px', background:DIV }} />
            </>
          )}

          {modes.map(function(m,i) {
            var Icon = m.icon
            var isLast = i === modes.length-1
            return (
              <motion.div key={i} variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.1 }}
                style={{
                  padding: 'clamp(36px,5vw,52px) 0',
                  paddingLeft:  !isMobile && i > 0   ? 'clamp(32px,4vw,48px)' : '0',
                  paddingRight: !isMobile && i < 2   ? 'clamp(32px,4vw,48px)' : '0',
                  borderBottom: isMobile && !isLast  ? '1px solid '+DIV : 'none',
                }}>

                <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:m.color+'10', border:'1px solid '+m.color+'22', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px' }}>
                  <Icon size={16} color={m.color} />
                </div>

                <div style={{ fontFamily:F_HEAD, fontWeight:'700', fontSize:'clamp(1.1rem,2.2vw,1.35rem)', color:T, letterSpacing:'-0.03em', marginBottom:'4px' }}>
                  {m.label}
                </div>
                <div style={{ fontFamily:F_MONO, fontSize:'10px', color:m.color, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'14px', opacity:0.9 }}>
                  {m.sub}
                </div>
                <div style={{ fontFamily:F_BODY, fontSize:'14px', color:T3, lineHeight:'1.8' }}>
                  {m.desc}
                </div>

              </motion.div>
            )
          })}
        </div>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.3 }}
          style={{ marginTop:'clamp(44px,6vw,64px)', display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap' }}>
          <CTA onClick={onEnter} large={true}><Zap size={15} /> Pick My Mode</CTA>
          <span style={{ fontFamily:F_MONO, fontSize:'10px', color:T4, letterSpacing:'0.08em' }}>
            No account required to start
          </span>
        </motion.div>

      </Wrap>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SEC 6 — SOCIAL PROOF (Pull Quote)
// Full-width editorial quotes, no card fills
// ─────────────────────────────────────────────────────────
function SocialProof() {
  var isMobile = useIsMobile()

  var quotes = [
    { quote:'CertifyROI said break-even was 8 months. It was 7. Switched companies 7 months in. ₹6L hike.',                                                name:'Priya S.',  detail:'Bangalore · Engineer → Cloud Architect', hike:'+₹6L/yr',     color:'#10B981' },
    { quote:'Was about to spend ₹12L on an MBA. Resume AI showed me Google Analytics gets me there in 5 months at 1% of the cost.',                        name:'Rahul M.',  detail:'Hyderabad · Ops Manager → Data Analyst',  hike:'Saved ₹12L',  color:'#6366F1' },
    { quote:'Student Mode showed GCP had faster placement for freshers in Pune specifically. Got ₹5.2L offer. No salary field needed.',                    name:'Ananya K.', detail:'Pune · Fresh Graduate',                    hike:'₹5.2L offer', color:'#818CF8' },
  ]

  return (
    <div style={{ background:'var(--surface)', borderTop:'1px solid '+DIV, borderBottom:'1px solid '+DIV, paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)' }}>
      <Wrap>
        <Label>From people who ran the numbers</Label>
        <Heading>They used the data.<br /><span style={{ color:EMERALD }}>It worked.</span></Heading>

        <div style={{ display:'flex', flexDirection:'column' }}>
          {quotes.map(function(q,i) {
            var isLast = i === quotes.length-1
            return (
              <motion.div key={i}
                variants={SLIDE} initial="hidden" whileInView="show" viewport={{ once:true }}
                style={{
                  paddingTop: i > 0 ? 'clamp(44px,6vw,64px)' : '0',
                  paddingBottom: isLast ? '0' : 'clamp(44px,6vw,64px)',
                  borderBottom: isLast ? 'none' : '1px solid '+DIV,
                  display:'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 180px',
                  gap: isMobile ? '20px' : '48px',
                  alignItems:'end',
                }}>

                <div>
                  <div style={{ fontFamily:F_HEAD, fontWeight:'700', fontSize:'clamp(1.1rem,2.5vw,1.65rem)', color:T, letterSpacing:'-0.03em', fontStyle:'italic', lineHeight:1.35, marginBottom:'24px' }}>
                    "{q.quote}"
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'14px', flexWrap:'wrap' }}>
                    <div style={{ width:'24px', height:'1.5px', background:q.color }} />
                    <span style={{ fontFamily:F_BODY, fontWeight:'600', fontSize:'14px', color:T, fontStyle:'italic' }}>{q.name}</span>
                    <span style={{ fontFamily:F_BODY, fontSize:'13px', color:T3 }}>{q.detail}</span>
                  </div>
                </div>

                <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                  <div style={{ fontFamily:F_MONO, fontWeight:'700', fontSize:'clamp(1.3rem,3vw,1.9rem)', color:AMBER, letterSpacing:'-0.04em', lineHeight:1 }}>
                    {q.hike}
                  </div>
                </div>

              </motion.div>
            )
          })}
        </div>

      </Wrap>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SEC 7 — FINAL CTA (Typographic Monument)
// ─────────────────────────────────────────────────────────
function FinalCTA({ onEnter }) {
  return (
    <div style={{ paddingTop:'clamp(100px,14vw,160px)', paddingBottom:'clamp(100px,14vw,160px)', textAlign:'center' }}>
      <Wrap>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'11px', color:T4, letterSpacing:'0.16em', textTransform:'uppercase', marginBottom:'28px' }}>
            2 minutes from now
          </div>
          <h2 style={{ fontFamily:F_HEAD, fontWeight:'800', fontSize:'clamp(2.6rem,9vw,7rem)', color:T, letterSpacing:'-0.05em', lineHeight:0.88, marginTop:0, marginBottom:'44px' }}>
            YOU'LL KNOW<br />THE ANSWER.
          </h2>
        </motion.div>

        <motion.p variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.1 }}
          style={{ fontFamily:F_BODY, fontSize:'clamp(14px,2vw,16px)', color:T3, lineHeight:'1.85', maxWidth:'360px', margin:'0 auto 44px' }}>
          Stop reading about certs. Stop asking Reddit.{' '}
          <span style={{ color:T, fontWeight:'600' }}>Run the numbers.</span>
        </motion.p>

        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.2 }}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'16px' }}>
          <CTA onClick={onEnter} large={true}>Run My Numbers <ArrowRight size={18} /></CTA>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:T4, letterSpacing:'0.1em' }}>
            FREE · NO CARD · NO SIGNUP · NO PAYWALLS
          </div>
        </motion.div>

      </Wrap>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// PAGE FOOTER
// ─────────────────────────────────────────────────────────
function PageFooter() {
  var isMobile = useIsMobile()
  return (
    <div style={{ borderTop:'1px solid '+DIV, padding: isMobile ? '24px 20px' : '28px 48px' }}>
      <div style={{ maxWidth:'920px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
          <div style={{ width:'24px', height:'24px', background:INDIGO, borderRadius:'5px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <TrendingUp size={12} color="white" />
          </div>
          <span style={{ fontFamily:F_HEAD, fontWeight:'800', fontSize:'15px', letterSpacing:'-0.03em', color:T }}>
            Certify<span style={{ color:INDIGO }}>ROI</span>
          </span>
        </div>
        <div style={{ fontFamily:F_MONO, fontSize:'10px', color:T4, letterSpacing:'0.06em', opacity:0.5 }}>
          LINKEDIN · NASSCOM · AMBITIONBOX · NAUKRI · WEF 2026
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
    <div style={{ minHeight:'100vh', background:BG }}>

      {/* ── HERO ── */}
      <div ref={heroRef} style={{ maxWidth:'920px', margin:'0 auto', padding:'calc(var(--nav-h,64px) + clamp(48px,8vw,80px)) '+(isMobile?'20px':'48px')+' clamp(64px,10vw,100px)' }}>
        <motion.div style={{ y:heroY, opacity:heroOp }}>

          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1, duration:0.6, ease:[0.16,1,0.3,1] }}
            style={{ fontFamily:F_MONO, fontSize:'11px', color:INDIGO, opacity:0.6, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'40px' }}>
            India's first AI-powered cert ROI calculator
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18, duration:0.7, ease:[0.16,1,0.3,1] }}
            style={{ fontFamily:F_HEAD, fontWeight:'800', fontSize:'clamp(2.8rem,10vw,6.5rem)', lineHeight:0.9, letterSpacing:'-0.05em', color:T, marginBottom:'32px', wordBreak:'break-word', marginTop:0 }}>
            YOUR NEXT CERT<br />
            IS EITHER A{' '}
            <span style={{ color:AMBER }}>GOLDMINE</span><br />
            OR A{' '}
            <span style={{ color:RED }}>MISTAKE.</span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.6, ease:[0.16,1,0.3,1] }}
            style={{ fontFamily:F_BODY, fontSize:'clamp(15px,2.2vw,18px)', color:T3, maxWidth:'480px', lineHeight:'1.8', margin:0 }}>
            We tell you which — in under 2 seconds — before you spend ₹50K and 6 months finding out the hard way.
          </motion.p>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.85, duration:0.6 }}
            style={{ marginTop:'clamp(44px,7vw,72px)', display:'flex', alignItems:'center', gap:'12px' }}>
            <motion.div animate={{ y:[0,6,0], opacity:[0.3,0.6,0.3] }} transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
              style={{ width:'20px', height:'34px', borderRadius:'10px', border:'1.5px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'5px' }}>
              <div style={{ width:'2.5px', height:'7px', borderRadius:'2px', background:'rgba(255,255,255,0.2)' }} />
            </motion.div>
            <span style={{ fontFamily:F_MONO, fontSize:'10px', color:T4, letterSpacing:'0.14em', textTransform:'uppercase' }}>scroll</span>
          </motion.div>

        </motion.div>
      </div>

      <Ticker />
      <CertAssembly />
      <DataComposition />
      <Rule />
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