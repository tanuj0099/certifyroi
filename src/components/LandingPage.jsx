import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────
function useIsDark() {
  var [isDark, setIsDark] = useState(function() { return typeof window !== 'undefined' ? document.documentElement.getAttribute('data-theme') !== 'light' : false })
  useEffect(function() {
    var obs = new MutationObserver(function() { setIsDark(document.documentElement.getAttribute('data-theme') !== 'light') })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return function() { obs.disconnect() }
  }, [])
  return isDark
}

function useIsMobile() {
  var [mobile, setMobile] = useState(function() { return typeof window !== 'undefined' ? window.innerWidth < 768 : false })
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
    var el = ref.current; if (!el) return
    var obs = new IntersectionObserver(function(entries) { if (entries[0].isIntersecting) { setInView(true); obs.disconnect() } }, { threshold: threshold })
    obs.observe(el)
    return function() { obs.disconnect() }
  }, [threshold])
  return [ref, inView]
}

// ─────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────
var F_SERIF = "'EB Garamond', 'Cormorant Garamond', Georgia, serif"
var F_SANS  = "'Inter', 'DM Sans', sans-serif"
var F_MONO  = "'JetBrains Mono', 'IBM Plex Mono', monospace"

// Editorial Premium Light Theme
var L = { bg:'#FAFAF8', surface:'#F5F3EF', surfaceHigh:'#EEEBE5', text:'#1A1916', text2:'#5C5A56', text3:'#9C9A96', text4:'#C0BDB8', green:'#0D6B6F', greenL:'#0A565A', gold:'#9A7235', goldL:'#B89050', err:'#7A2C2C', line:'#E0DDD8', lineHeavy:'#C8C5BE', border:'rgba(26,25,22,0.09)', btnFill:'#1A1916', btnText:'#FAFAF8' }
// Deep Premium Dark Theme
var D = { bg:'#131110', surface:'#1C1A17', surfaceHigh:'#252220', text:'#EDE9E3', text2:'#9E9890', text3:'#6B6560', text4:'#4A4A4A', green:'#4A8C6A', greenL:'#5EA87E', gold:'#C49A4E', goldL:'#D4A559', err:'#9E4242', line:'#2E2B27', lineHeavy:'#3A3A3A', border:'rgba(237,233,227,0.06)', btnFill:'#EDE9E3', btnText:'#1C1A17' }

var RISE = { hidden:{ y:24, opacity:0 }, show:{ y:0, opacity:1, transition:{ duration:0.7, ease:[0.16,1,0.3,1] } } }
var SLIDE_LEFT  = { hidden:{ x:-40, opacity:0 }, show:{ x:0, opacity:1, transition:{ duration:0.75, ease:[0.16,1,0.3,1] } } }

// ─────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────
function ContourCluster({ rings, cx, cy, rx, ry, color, opacity, rotate }) {
  rings=rings||10; cx=cx||0; cy=cy||0; rx=rx||80; ry=ry||50; color=color||'#C8C3BB'; opacity=opacity||0.4; rotate=rotate||0
  return (
    <g transform={'rotate('+rotate+','+cx+','+cy+')'} opacity={opacity}>
      {Array.from({ length: rings }).map(function(_, i) {
        var s = i * 14
        return <ellipse key={i} cx={cx} cy={cy} rx={rx+s} ry={ry+s*0.6} fill="none" stroke={color} strokeWidth="0.75" />
      })}
    </g>
  )
}

function ElevationMark({ size, color }) {
  size=size||18; color=color||'#2D6A4F'
  var w=size, h=size*0.65
  return (
    <svg width={w} height={h} viewBox={'0 0 '+w+' '+h} fill="none" style={{ display:'block' }}>
      <path d={'M 0 '+h+' Q '+(w*0.25)+' '+(h*0.1)+' '+(w*0.5)+' '+(h*0.2)+' Q '+(w*0.75)+' '+(h*0.35)+' '+w+' '+h} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={w*0.5} cy={h*0.2} r="2" fill={color} />
    </svg>
  )
}

function SummitFlag({ color }) {
  color=color||'#A67C3C'
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" style={{ display:'inline-block', verticalAlign:'middle' }}>
      <line x1="3" y1="1" x2="3" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 3 1 L 13 5 L 3 9 Z" fill={color} fillOpacity="0.85" />
    </svg>
  )
}

function WaypointDot({ active, color, size }) {
  active=active!==false; color=color||'#1C1A17'; size=size||10
  return (
    <svg width={size+8} height={size+8} viewBox={'0 0 '+(size+8)+' '+(size+8)} fill="none">
      <circle cx={(size+8)/2} cy={(size+8)/2} r={size/2+3} stroke={color} strokeWidth="1.5" strokeOpacity={active?0.35:0.15} />
      <circle cx={(size+8)/2} cy={(size+8)/2} r={size/2-1} fill={active?color:'none'} stroke={color} strokeWidth="1.5" strokeOpacity={active?1:0.3} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────
function RidgeSilhouette({ C, inverted }) {
  var h = 72
  return (
    <div style={{ position:'relative', height:h+'px', overflow:'hidden', pointerEvents:'none' }}>
      <svg viewBox={'0 0 1440 '+h} preserveAspectRatio="none" width="100%" height={h} style={{ position:'absolute', inset:0, display:'block' }}>
        <path d="M 0 38 Q 160 24 320 36 Q 480 48 640 32 Q 800 18 960 30 Q 1120 42 1280 28 Q 1360 22 1440 34 L 1440 72 L 0 72 Z" fill={C.surfaceHigh} opacity="0.5" />
        <path d="M 0 46 Q 240 32 420 44 Q 520 50 600 38 Q 680 26 720 20 Q 760 14 800 22 Q 860 34 960 50 Q 1080 62 1200 46 Q 1320 32 1440 44 L 1440 72 L 0 72 Z" fill={C.surface} opacity="0.8" />
        <path d="M 0 54 Q 200 44 360 56 Q 480 64 600 54 Q 700 44 760 36 Q 820 28 880 34 Q 960 44 1080 58 Q 1200 70 1320 58 Q 1400 50 1440 56 L 1440 72 L 0 72 Z" fill={C.surface} />
        <path d="M 0 54 Q 200 44 360 56 Q 480 64 600 54 Q 700 44 760 36 Q 820 28 880 34 Q 960 44 1080 58 Q 1200 70 1320 58 Q 1400 50 1440 56" fill="none" stroke={C.line} strokeWidth="0.9" strokeOpacity="0.5" />
      </svg>
    </div>
  )
}

function CertAssembly({ C }) {
  var isDark = useIsDark()
  var isMobile = useIsMobile()
  var certBg    = isDark ? '#04060e' : '#FAFAF8'
  var certText1 = isDark ? '#F0F2FF' : '#1A1916'
  var certText2 = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(26,25,22,0.5)'
  var certMuted = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(26,25,22,0.35)'
  var overlayBg = isDark ? '#020408' : C.bg

  var trackRef    = useRef(null)
  var { scrollY } = useScroll()
  var [prog, setProg] = useState(0)

  useEffect(function() {
    function update() {
      var el = trackRef.current; if (!el) return
      var rect = el.getBoundingClientRect()
      var p = Math.max(0, Math.min(1, -rect.top / (el.offsetHeight - window.innerHeight)))
      setProg(p)
    }
    var unsub = scrollY.on('change', update); update(); return unsub
  }, [scrollY])

  function remap(p,a,b,c,d) { return c+(d-c)*Math.max(0,Math.min(1,(p-a)/(b-a))) }

  var p8 = remap(prog,0,0.8,0,1)
  var l1,l2,l3
  if (isMobile) {
    l1='translateY('+remap(p8,0,1,-50,0)+'px) rotateZ('+remap(p8,0,1,3,0)+'deg)'
    l2='translateY('+remap(p8,0,1,50,0)+'px) rotateZ('+remap(p8,0,1,-2,0)+'deg)'
    l3='translateY('+remap(p8,0,1,-25,0)+'px) scale('+remap(p8,0,1,0.88,1)+')'
  } else {
    l1='perspective(1200px) translateZ('+remap(p8,0,1,-280,0)+'px) translateY('+remap(p8,0,1,-80,0)+'px) rotateY('+remap(p8,0,1,32,0)+'deg) rotateX('+remap(p8,0,1,15,0)+'deg)'
    l2='perspective(1200px) translateZ('+remap(p8,0,1,280,0)+'px) translateY('+remap(p8,0,1,80,0)+'px) rotateY('+remap(p8,0,1,-26,0)+'deg) rotateX('+remap(p8,0,1,-12,0)+'deg)'
    l3='perspective(1200px) translateZ('+remap(p8,0,1,-140,0)+'px) translateY('+remap(p8,0,1,-30,0)+'px) rotateY('+remap(p8,0,1,15,0)+'deg) rotateX('+remap(p8,0,1,6,0)+'deg)'
  }

  var certScale   = prog<0.8 ? remap(prog,0,0.8,0.62,1.0) : remap(prog,0.8,1.0,1.0,0.85)
  var certOpacity = prog<0.05 ? remap(prog,0,0.05,0,1) : prog>0.85 ? remap(prog,0.85,1.0,1,0) : 1
  var overlayOp   = prog<0.08 ? remap(prog,0,0.08,0,0.94) : prog>0.92 ? remap(prog,0.92,1,0.94,0) : 0.94
  var hintOp      = prog>0.16 ? 0 : prog>0.06 ? remap(prog,0.06,0.16,1,0) : 1
  var assembledOp = remap(prog,0.78,0.88,0,1)
  var cardW = isMobile ? 'min(300px,88vw)' : 'min(480px,88vw)'

  return (
    <div ref={trackRef} style={{ height:'300vh', position:'relative' }}>
      <div style={{ position:'sticky', top:0, height:'100vh', width:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', background:overlayBg, opacity:overlayOp }} />
        <div style={{ position:'relative', zIndex:4 }}>
          <div style={{ transform:'scale('+certScale+')', opacity:certOpacity }}>
            <div style={{ position:'relative', width:cardW, height:'calc('+cardW+' / 1.414)', transformStyle:'preserve-3d' }}>
              <div style={{ position:'absolute', inset:0, transform:l1 }}>
                <svg viewBox="0 0 500 354" width="100%" height="100%" style={{ position:'absolute', inset:0, display:'block' }}>
                  <defs>
                    <linearGradient id="cBorder3" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={C.green}/><stop offset="40%" stopColor={C.greenL}/><stop offset="100%" stopColor={C.gold}/>
                    </linearGradient>
                    <filter id="cGlow3"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  </defs>
                  <rect x="0" y="0" width="500" height="354" rx="4" fill={certBg} fillOpacity="0.97" style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.04))' }} />
                  <rect x="1.5" y="1.5" width="497" height="351" rx="3" fill="none" stroke="url(#cBorder3)" strokeWidth="1.5" filter="url(#cGlow3)"/>
                  {[[22,22],[478,22],[22,332],[478,332]].map(function(arr,i){ var cx=arr[0],cy=arr[1]; return (<g key={i}><circle cx={cx} cy={cy} r="4" fill="none" stroke={C.green} strokeWidth="1.2"/><circle cx={cx} cy={cy} r="8" fill="none" stroke={C.green} strokeOpacity="0.2" strokeWidth="0.6"/><line x1={cx-10} y1={cy} x2={cx+10} y2={cy} stroke={C.green} strokeOpacity="0.35" strokeWidth="0.6"/><line x1={cx} y1={cy-10} x2={cx} y2={cy+10} stroke={C.green} strokeOpacity="0.35" strokeWidth="0.6"/></g>) })}
                  <line x1="40" y1="1.5" x2="90" y2="1.5" stroke={C.green} strokeWidth="2.5"/>
                  <line x1="410" y1="1.5" x2="460" y2="1.5" stroke={C.gold} strokeWidth="2.5"/>
                  <line x1="40" y1="352.5" x2="90" y2="352.5" stroke={C.gold} strokeWidth="2.5"/>
                  <line x1="410" y1="352.5" x2="460" y2="352.5" stroke={C.green} strokeWidth="2.5"/>
                </svg>
              </div>
              <div style={{ position:'absolute', inset:0, transform:l2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,40px)' }}>
                <div style={{ fontFamily:F_MONO, fontSize:'9px', color:C.green, letterSpacing:'0.26em', marginBottom:'11px', textTransform:'uppercase' }}>CERTIFYROI · INDIA 2026</div>
                <div style={{ fontFamily:F_SERIF, fontWeight:'600', fontSize:'clamp(1rem,3.2vw,1.9rem)', letterSpacing:'-0.02em', color:certText1, marginBottom:'6px', textAlign:'center', lineHeight:1.1 }}>Route Briefing</div>
                <div style={{ fontFamily:F_SANS, fontSize:'clamp(10px,1.5vw,12px)', color:certText2, marginBottom:'22px', textAlign:'center' }}>Personalised ROI Analysis · Your City</div>
                <div style={{ display:'flex', gap:'clamp(10px,4vw,40px)', marginBottom:'18px' }}>
                  {[{label:'SUMMIT TIME',value:'9 mo',color:C.green},{label:'5-YR GAIN',value:'₹14.2L',color:C.gold},{label:'ELEVATION',value:'+35%',color:C.greenL}].map(function(s,i){return(<div key={i} style={{textAlign:'center'}}><div style={{fontFamily:F_MONO,fontSize:'7px',color:certMuted,letterSpacing:'0.12em',marginBottom:'5px'}}>{s.label}</div><div style={{fontFamily:F_MONO,fontSize:'clamp(0.8rem,2.5vw,1.5rem)',color:s.color,fontWeight:'500',letterSpacing:'-0.03em'}}>{s.value}</div></div>)})}
                </div>
                <div style={{ width:'74%', height:'1px', background:'linear-gradient(90deg,transparent,'+C.green+',transparent)', opacity:0.3, marginBottom:'12px' }} />
                <div style={{ fontFamily:F_MONO, fontSize:'7px', color:certMuted, letterSpacing:'0.14em', textAlign:'center' }}>VERIFIED · DATA: NAUKRI MARCH 2026</div>
              </div>
              <div style={{ position:'absolute', right:'6%', bottom:'8%', transform:l3 }}>
                <SummitFlag color={C.gold} />
              </div>
            </div>
          </div>
          <div style={{ opacity:hintOp, marginTop:'44px', textAlign:'center', pointerEvents:'none', transition:'opacity 0.3s' }}>
            <motion.div animate={{ y:[0,8,0] }} transition={{ duration:1.7, repeat:Infinity, ease:'easeInOut' }}>
              <div style={{ fontFamily:F_MONO, fontSize:'11px', color:C.text3, letterSpacing:'0.22em', textTransform:'uppercase' }}>↓  scroll to assemble  ↓</div>
            </motion.div>
          </div>
        </div>
        <div style={{ opacity:assembledOp, position:'absolute', bottom:'8%', left:0, right:0, textAlign:'center', pointerEvents:'none', zIndex:5, transition:'opacity 0.3s' }}>
          <div style={{ fontFamily:F_MONO, fontSize:'12px', color:C.green, letterSpacing:'0.22em', textTransform:'uppercase' }}>↑  ROUTE BRIEFING · ASSEMBLED</div>
        </div>
      </div>
    </div>
  )
}

function CountUp({ end, prefix, suffix, duration }) {
  duration=duration||1.8
  var [count,setCount]=useState(0), [on,setOn]=useState(false)
  useEffect(function() {
    if (!on) return
    var endVal=parseFloat(String(end).replace(/[^0-9.]/g,''))
    var frames=Math.round(duration*60), f=0
    var t=setInterval(function() { f++; var ease=1-Math.pow(1-f/frames,3); setCount(endVal*ease); if(f>=frames){setCount(endVal);clearInterval(t)} },1000/60)
    return function() { clearInterval(t) }
  },[on,end,duration])
  return <motion.span onViewportEnter={function(){setOn(true)}}>{prefix}{count.toLocaleString('en-IN',{maximumFractionDigits:String(end).includes('.')?1:0})}{suffix}</motion.span>
}

function TrustStrip({ C }) {
  var items=['AWS cert holders earn ₹2.4L more/yr in Bangalore','2,400+ cloud roles open on Naukri right now','Average PMP summit: 7 months','Google Analytics: ₹18K invested → ₹3.2L annual gain','CKA Kubernetes: steepest climb, highest gain — +40%','Hyderabad cloud demand up 38% in 2026']
  return (
    <div style={{ overflow:'hidden', borderTop:'1px solid '+C.border, borderBottom:'1px solid '+C.border, padding:'11px 0', background:C.surface }}>
      <motion.div animate={{ x:['0%','-50%'] }} transition={{ duration:44, repeat:Infinity, ease:'linear' }} style={{ display:'flex', gap:'80px', whiteSpace:'nowrap', width:'max-content' }}>
        {[...items,...items].map(function(item,i) { return <span key={i} style={{ fontSize:'11px', color:C.text3, fontFamily:F_MONO, flexShrink:0, letterSpacing:'0.03em' }}><span style={{ color:C.green, marginRight:'14px', opacity:0.6 }}>■</span>{item}</span> })}
      </motion.div>
    </div>
  )
}

function DataComposition({ C, isMobile }) {
  return (
    <div style={{ paddingTop:'clamp(80px,12vw,140px)', paddingBottom:'clamp(80px,12vw,140px)', position:'relative', overflow:'hidden' }}>
      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>The numbers behind every route</div>
        </motion.div>
        <motion.div variants={SLIDE_LEFT} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ marginBottom:'clamp(48px,8vw,96px)' }}>
          <div style={{ fontFamily:F_MONO, fontSize:'clamp(3rem,14vw,8rem)', color:C.gold, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'500' }}><CountUp end={14.2} prefix="₹" suffix="L" /></div>
          <div style={{ display:'flex', alignItems:'baseline', gap:'16px', marginTop:'12px', flexWrap:'wrap' }}>
            <div style={{ fontFamily:F_SERIF, fontStyle:'italic', fontSize:'clamp(1rem,2.5vw,1.4rem)', color:C.text2 }}>5-year net gain · AWS Solutions Architect</div>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.1em', textTransform:'uppercase' }}>Bangalore median · 2026</div>
          </div>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', borderTop:'1px solid '+C.border }}>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ padding:isMobile?'40px 0':'56px 64px 56px 0', borderBottom:isMobile?'1px solid '+C.border:'none', borderRight:isMobile?'none':'1px solid '+C.border }}>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'16px' }}>Summit reached</div>
            <div style={{ fontFamily:F_MONO, fontSize:'clamp(2.4rem,8vw,4.5rem)', color:C.text, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'500', marginBottom:'12px' }}><CountUp end={6} suffix=" months" /></div>
            <div style={{ fontFamily:F_SANS, fontSize:'14px', color:C.text2, lineHeight:'1.75' }}>Not "a few months." The exact month your investment turns profitable — calculated for your salary and city.</div>
          </motion.div>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.1 }} style={{ padding:isMobile?'40px 0':'56px 0 56px 64px' }}>
            <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'16px' }}>Elevation gained</div>
            <div style={{ fontFamily:F_MONO, fontSize:'clamp(2.4rem,8vw,4.5rem)', color:C.text, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'500', marginBottom:'12px' }}><CountUp end={35} suffix="%" /></div>
            <div style={{ fontFamily:F_SANS, fontSize:'14px', color:C.text2, lineHeight:'1.75' }}>India-sourced. City-specific. Not US data converted at today's rate and called "India salary insights."</div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function HowItWorks({ C, isMobile, onEnter }) {
  var steps=[{id:'basecamp',label:'Basecamp',subtitle:'Where you start',desc:'Enter your current salary, role, and city. Upload your resume if you want AI to read your actual background. This is your starting elevation.',detail:'No account required.'},{id:'route',label:'Route',subtitle:'Choose your path',desc:'Select a certification or let the AI recommend the highest-ROI route for your profile. Compare up to three routes side by side.',detail:'India market data · 2026'},{id:'summit',label:'Summit',subtitle:'Know the outcome',desc:'See your route briefing: exact payback month, 5-year net gain in rupees, monthly salary delta, and a recommendation on whether the climb is worth making.',detail:'Your numbers. Your decision.'}]
  var [routeRef,routeInView]=useInView(0.3)
  return (
    <div style={{ background:C.surface, borderTop:'1px solid '+C.border, borderBottom:'1px solid '+C.border, paddingTop:'clamp(72px,10vw,120px)', paddingBottom:'clamp(72px,10vw,120px)' }}>
      <div style={{ maxWidth:'920px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}><div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>The route</div></motion.div>
        <motion.h2 variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ fontFamily:F_SANS, fontWeight:'600', fontSize:'clamp(1.8rem,4.5vw,3rem)', color:C.text, letterSpacing:'-0.03em', lineHeight:1.05, marginTop:0, marginBottom:'64px' }}>Three stages.<br />One clear answer.</motion.h2>
        <div ref={routeRef} style={{ position:'relative' }}>
          {!isMobile && (<div style={{ position:'absolute', top:'9px', left:'9px', right:'9px', height:'1px', overflow:'visible', pointerEvents:'none', zIndex:0 }}><svg width="100%" height="2" style={{ display:'block', overflow:'visible' }}><motion.line x1="0" y1="1" x2="100%" y2="1" stroke={C.green} strokeWidth="1" strokeDasharray="6 5" initial={{ pathLength:0, opacity:0 }} animate={routeInView?{ pathLength:1, opacity:0.5 }:{ pathLength:0, opacity:0 }} transition={{ duration:1.4, ease:[0.16,1,0.3,1] }} /></svg></div>)}
          <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)', position:'relative', zIndex:1 }}>
            {steps.map(function(step,i) { var isLast=i===steps.length-1; return (
              <motion.div key={step.id} variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.12 }} style={{ paddingLeft:!isMobile&&i>0?'clamp(24px,3vw,40px)':'0', paddingRight:!isMobile&&i<2?'clamp(24px,3vw,40px)':'0', paddingTop:!isMobile?'48px':'clamp(32px,5vw,48px)', paddingBottom:isMobile&&!isLast?'clamp(32px,5vw,48px)':'0', borderRight:!isMobile&&!isLast?'1px solid '+C.border:'none', borderBottom:isMobile&&!isLast?'1px solid '+C.border:'none' }}>
                <div style={{ marginBottom:'20px' }}><WaypointDot active={true} color={C.green} size={10} /></div>
                <div style={{ fontFamily:F_SERIF, fontStyle:'italic', fontSize:'22px', color:C.green, marginBottom:'4px', fontWeight:'400' }}>{step.label}</div>
                <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'14px' }}>{step.subtitle}</div>
                <div style={{ fontFamily:F_SANS, fontSize:'14px', color:C.text2, lineHeight:'1.8', marginBottom:'14px' }}>{step.desc}</div>
                <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.06em' }}>{step.detail}</div>
              </motion.div>
            )})}
          </div>
        </div>
      </div>
    </div>
  )
}

function PageFooter({ C, isMobile }) {
  return (
    <div style={{ borderTop:'1px solid '+C.border, padding:isMobile?'24px':'28px 80px' }}>
      <div style={{ maxWidth:'1180px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <ElevationMark size={18} color={C.green} />
          <span style={{ fontFamily:F_SANS, fontWeight:'600', fontSize:'15px', letterSpacing:'-0.02em', color:C.text }}>Certify</span>
          <span style={{ fontFamily:F_SERIF, fontStyle:'italic', fontSize:'16px', color:C.green, letterSpacing:'-0.01em', marginLeft:'-4px' }}>ROI</span>
        </div>
        <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.06em', opacity:0.6 }}>LINKEDIN · NASSCOM · AMBITIONBOX · NAUKRI · 2026</div>
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
  var C        = isDark ? D : L

  var heroRef = useRef(null)
  var { scrollYProgress: heroSP } = useScroll({ target: heroRef, offset: ['start start','end start'] })
  var heroY  = useTransform(heroSP, [0,1], [0, isMobile?10:20])
  var heroOp = useTransform(heroSP, [0,0.6], [1,0])

  return (
    <div style={{ minHeight:'100vh', background:C.bg, position:'relative' }}>

      {/* ── HERO ── */}
      <div ref={heroRef} style={{ position:'relative', overflow:'hidden', minHeight:isMobile?'auto':'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        
        {/* Abstract Contour Layer floating in background */}
        <div style={{ position:'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents:'none', zIndex:0, opacity:0.4 }}>
           <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="none">
             <ContourCluster rings={6} cx={1400} cy={50} rx={220} ry={140} color={C.line} opacity={0.6} rotate={-10} />
           </svg>
        </div>

        <motion.div style={{ y:heroY, opacity:heroOp, width:'100%', position:'relative', zIndex:1, marginTop: isMobile ? '20px' : '-20px' }}>
          {/* Tighter Grid to pull everything up into one viewport plane */}
          <div style={{ maxWidth:'1180px', margin:'0 auto', padding:isMobile?'24px':'32px 80px', display:'grid', gridTemplateColumns:isMobile?'1fr':'1.2fr 0.8fr', gap:isMobile?'32px':'48px', alignItems:'center' }}>

            {/* LEFT: Text & CTA */}
            <div style={{ position: 'relative', zIndex: 3, paddingTop: isMobile ? '16px' : '0' }}>
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1, duration:0.6, ease:[0.16,1,0.3,1] }} style={{ fontFamily:F_MONO, fontSize:'11px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'24px', display:'flex', alignItems:'center', gap:'10px' }}>
                <ElevationMark size={14} color={C.green} />
                Career Route Analysis · India 2026
              </motion.div>
              
              {/* Single Font Style (Serif) Headline */}
              <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18, duration:0.75, ease:[0.16,1,0.3,1] }} style={{ fontFamily:F_SERIF, fontWeight:'500', fontSize:'clamp(3rem,5.5vw,5rem)', lineHeight:0.95, letterSpacing:'-0.02em', color:C.text, marginBottom:'24px', marginTop:0, wordBreak:'break-word' }}>
                Your next cert<br />is either a <span style={{ color:C.gold }}>goldmine</span><br />or a <span style={{ color:C.err }}>mistake.</span>
              </motion.h1>
              
              <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.65, ease:[0.16,1,0.3,1] }} style={{ fontFamily:F_SANS, fontSize:'clamp(15px,2vw,16px)', color:C.text2, maxWidth:'420px', lineHeight:'1.75', margin:'0 0 32px' }}>
                Know the payback period before you pay the fee. We calculate the exact month your investment turns profitable — before you spend ₹50K and 6 months on the wrong route.
              </motion.p>
              
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44, duration:0.6, ease:[0.16,1,0.3,1] }} style={{ display:'flex', flexDirection:'column', gap:'14px', alignItems:'flex-start' }}>
                <button onClick={onEnter} style={{ padding:'0 36px', height:'52px', borderRadius:'0px', border:'none', background:C.btnFill, color:C.btnText, fontSize:'15px', fontFamily:F_SANS, fontWeight:'500', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'10px', transition:'all 0.2s', whiteSpace:'nowrap', letterSpacing:'0.02em', boxShadow:'0 1px 2px rgba(0,0,0,0.1)' }} onMouseEnter={function(e){e.currentTarget.style.background=C.green}} onMouseLeave={function(e){e.currentTarget.style.background=C.btnFill}}>Calculate ROI <ArrowRight size={15} /></button>
              </motion.div>
            </div>

            {/* RIGHT: Mountain Image + Orbit Wrapping Ribbon */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: [0.16,1,0.3,1] }}
               style={{ position: 'relative', width: '100%', height: isMobile?'280px':'460px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              {/* Back Loop tracing behind the mountain */}
              <motion.svg 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'absolute', top: '-15%', left: '-25%', width: '150%', height: '130%', zIndex: 0, pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none"
              >
                <path d="M10,80 C50,95 85,75 80,45 C75,15 45,10 25,30" fill="none" stroke="url(#ribbonBackCore)" strokeWidth="1" style={{ filter: 'blur(0.5px)' }} />
                <path d="M10,80 C50,95 85,75 80,45 C75,15 45,10 25,30" fill="none" stroke="rgba(13,107,111,0.12)" strokeWidth="5" style={{ filter: 'blur(3px)' }} />
                
                <defs>
                  <linearGradient id="ribbonBackCore" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(13,107,111,0)" />
                    <stop offset="50%" stopColor="rgba(13,107,111,0.3)" />
                    <stop offset="100%" stopColor="rgba(154,114,53,0.3)" />
                  </linearGradient>
                </defs>
              </motion.svg>

              {/* MOUNTAIN. Uses typical pathing, handles cache breaking via timestamp or fallback */}
              <motion.img 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.16,1,0.3,1] }}
                src="/mountain.png" alt="" 
                style={{ position: 'relative', zIndex: 1, height: '100%', objectFit: 'contain', maxWidth: '100%',
                         filter: isDark ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' : 'drop-shadow(0 15px 30px rgba(26,25,22,0.06))', mixBlendMode: isDark?'normal':'darken' }}
                onError={(e) => { 
                  if (!e.currentTarget.src.includes('?')) {
                     e.currentTarget.src = '/mountain.png?' + new Date().getTime(); // Break cache if stuck
                  } else {
                     e.currentTarget.style.display = 'none'; 
                  }
                }}
              />

              {/* Front Loop tracing in front, intersecting back path to complete an aesthetic 3D wrap */}
              <motion.svg 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'absolute', top: '-15%', left: '-25%', width: '150%', height: '130%', zIndex: 2, pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none"
              >
                <path d="M25,30 C5,50 15,90 100,75" fill="none" stroke="rgba(13,107,111,0.15)" strokeWidth="6" style={{ filter: 'blur(2.5px)' }} />
                <path d="M25,30 C5,50 15,90 100,75" fill="none" stroke="url(#ribbonFront)" strokeWidth="1.5" />
                
                <defs>
                  <linearGradient id="ribbonFront" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(154,114,53,0.5)" />
                    <stop offset="30%" stopColor="rgba(13,107,111,0.7)" />
                    <stop offset="100%" stopColor="rgba(13,107,111,0)" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </motion.div>

          </div>
        </motion.div>
      </div>

      <TrustStrip C={C} />
      <CertAssembly C={C} />
      <RidgeSilhouette C={C} />
      <DataComposition C={C} isMobile={isMobile} />
      <RidgeSilhouette C={C} />
      <HowItWorks C={C} isMobile={isMobile} onEnter={onEnter} />
      <PageFooter C={C} isMobile={isMobile} />
    </div>
  )
}

export default LandingPage
