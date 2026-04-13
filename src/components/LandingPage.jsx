import { motion, useScroll, useTransform } from 'framer-motion'
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
// DESIGN TOKENS (Editorial Premium)
// ─────────────────────────────────────────────────────────
var F_SERIF = "'EB Garamond', 'Cormorant Garamond', Georgia, serif"
var F_SANS  = "'Inter', 'DM Sans', sans-serif"
var F_MONO  = "'JetBrains Mono', 'IBM Plex Mono', monospace"

// High contrast editorial light / deep dark
var L = { bg:'#FAFAF8', surface:'#F5F3EF', surfaceHigh:'#EEEBE5', text:'#1C1B1A', text2:'#5C5A56', text3:'#999692', text4:'#C4C1BC', green:'#124042', greenL:'#1B5E60', gold:'#8A6932', err:'#6B2121', line:'#EAE7E1', lineHeavy:'#D4D0C9', border:'rgba(28,27,26,0.08)', btnFill:'#1C1B1A', btnText:'#FAFAF8' }
var D = { bg:'#131211', surface:'#1A1918', surfaceHigh:'#21201E', text:'#EBE8E3', text2:'#9E9A94', text3:'#6B6862', text4:'#423F3A', green:'#4A8C6A', greenL:'#5EA87E', gold:'#BF9649', err:'#A63B3B', line:'#282725', lineHeavy:'#383633', border:'rgba(235,232,227,0.08)', btnFill:'#EBE8E3', btnText:'#1C1B1A' }

var RISE = { hidden:{ y:24, opacity:0 }, show:{ y:0, opacity:1, transition:{ duration:0.8, ease:[0.16,1,0.3,1] } } }
var SLIDE_LEFT  = { hidden:{ x:-40, opacity:0 }, show:{ x:0, opacity:1, transition:{ duration:0.75, ease:[0.16,1,0.3,1] } } }

// ─────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────
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
      <circle cx={(size+8)/2} cy={(size+8)/2} r={size/2+3} stroke={color} strokeWidth="1" strokeOpacity={active?0.35:0.15} />
      <circle cx={(size+8)/2} cy={(size+8)/2} r={size/2-1} fill={active?color:'none'} stroke={color} strokeWidth="1.5" strokeOpacity={active?1:0.3} />
    </svg>
  )
}

function Crosshair({ color, size }) {
  color=color||'#1C1B1A'; size=size||12
  return (
    <svg width={size} height={size} viewBox={'0 0 '+size+' '+size} fill="none" style={{ display:'block' }}>
      <line x1={size/2} y1="0" x2={size/2} y2={size} stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
      <line x1="0" y1={size/2} x2={size} y2={size/2} stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
      <circle cx={size/2} cy={size/2} r="0.5" fill={color} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────
function CertAssembly({ C }) {
  var isDark = useIsDark()
  var isMobile = useIsMobile()
  var certBg    = isDark ? '#080807' : '#FAFAF8'
  var certText1 = isDark ? '#F5F5F3' : '#1C1B1A'
  var certText2 = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,27,26,0.6)'
  var certMuted = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,27,26,0.45)'
  var overlayBg = isDark ? '#050505' : C.bg

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
    <div ref={trackRef} style={{ height:'300vh', position:'relative', borderBottom:'1px solid '+C.border }}>
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
                    <filter id="cGlow3"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  </defs>
                  <rect x="0" y="0" width="500" height="354" rx="0" fill={certBg} fillOpacity="1" style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.06))' }} />
                  <rect x="2" y="2" width="496" height="350" rx="0" fill="none" stroke="url(#cBorder3)" strokeWidth="1.2" filter="url(#cGlow3)"/>
                  
                  {[[22,22],[478,22],[22,332],[478,332]].map(function(arr,i){ var cx=arr[0],cy=arr[1]; return (<g key={i}><circle cx={cx} cy={cy} r="4" fill="none" stroke={C.green} strokeWidth="1"/><circle cx={cx} cy={cy} r="8" fill="none" stroke={C.green} strokeOpacity="0.2" strokeWidth="0.6"/><line x1={cx-10} y1={cy} x2={cx+10} y2={cy} stroke={C.green} strokeOpacity="0.3" strokeWidth="0.6"/><line x1={cx} y1={cy-10} x2={cx} y2={cy+10} stroke={C.green} strokeOpacity="0.3" strokeWidth="0.6"/></g>) })}
                  
                  {/* Subtle decorative rules inside the cert */}
                  <line x1="40" y1="2" x2="90" y2="2" stroke={C.green} strokeWidth="2.5"/>
                  <line x1="410" y1="2" x2="460" y2="2" stroke={C.gold} strokeWidth="2.5"/>
                  <line x1="40" y1="352" x2="90" y2="352" stroke={C.gold} strokeWidth="2.5"/>
                  <line x1="410" y1="352" x2="460" y2="352" stroke={C.green} strokeWidth="2.5"/>
                </svg>
              </div>
              <div style={{ position:'absolute', inset:0, transform:l2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,40px)' }}>
                <div style={{ fontFamily:F_MONO, fontSize:'9px', color:C.green, letterSpacing:'0.26em', marginBottom:'11px', textTransform:'uppercase' }}>CERTIFYROI · INDIA 2026</div>
                <div style={{ fontFamily:F_SERIF, fontWeight:'400', fontSize:'clamp(1.2rem,3.2vw,2rem)', letterSpacing:'-0.01em', color:certText1, marginBottom:'6px', textAlign:'center', lineHeight:1.1 }}>Route Briefing</div>
                <div style={{ fontFamily:F_SANS, fontSize:'clamp(10px,1.5vw,12px)', color:certText2, marginBottom:'32px', textAlign:'center', fontWeight:'400' }}>Personalised ROI Analysis · Your City</div>
                <div style={{ display:'flex', gap:'clamp(12px,5vw,50px)', marginBottom:'24px' }}>
                  {[{label:'SUMMIT TIME',value:'9 mo',color:C.text},{label:'5-YR GAIN',value:'₹14.2L',color:C.gold},{label:'ELEVATION',value:'+35%',color:C.text}].map(function(s,i){return(<div key={i} style={{textAlign:'center'}}><div style={{fontFamily:F_MONO,fontSize:'7.5px',color:certMuted,letterSpacing:'0.14em',marginBottom:'8px'}}>{s.label}</div><div style={{fontFamily:F_MONO,fontSize:'clamp(1rem,2.8vw,1.6rem)',color:s.color,fontWeight:'400',letterSpacing:'-0.03em'}}>{s.value}</div></div>)})}
                </div>
                <div style={{ width:'70%', height:'1px', background:C.border, marginBottom:'16px' }} />
                <div style={{ fontFamily:F_MONO, fontSize:'7.5px', color:certMuted, letterSpacing:'0.16em', textAlign:'center' }}>VERIFIED · NAUKRI MARCH 2026</div>
              </div>
              <div style={{ position:'absolute', right:'6%', bottom:'8%', transform:l3 }}>
                <SummitFlag color={C.gold} />
              </div>
            </div>
          </div>
          <div style={{ opacity:hintOp, marginTop:'44px', textAlign:'center', pointerEvents:'none', transition:'opacity 0.3s' }}>
            <motion.div animate={{ y:[0,8,0] }} transition={{ duration:1.7, repeat:Infinity, ease:'easeInOut' }}>
              <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.24em', textTransform:'uppercase' }}>↓  SCROLL COMPOSITION  ↓</div>
            </motion.div>
          </div>
        </div>
        <div style={{ opacity:assembledOp, position:'absolute', bottom:'8%', left:0, right:0, textAlign:'center', pointerEvents:'none', zIndex:5, transition:'opacity 0.3s' }}>
          <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text, letterSpacing:'0.24em', textTransform:'uppercase' }}>↑  ROUTE BRIEFING // ASSEMBLED</div>
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
    <div style={{ overflow:'hidden', borderBottom:'1px solid '+C.border, padding:'14px 0', background:C.surface }}>
      <motion.div animate={{ x:['0%','-50%'] }} transition={{ duration:44, repeat:Infinity, ease:'linear' }} style={{ display:'flex', gap:'80px', whiteSpace:'nowrap', width:'max-content' }}>
        {[...items,...items].map(function(item,i) { return <span key={i} style={{ fontSize:'10.5px', color:C.text3, fontFamily:F_MONO, flexShrink:0, letterSpacing:'0.04em' }}><span style={{ color:C.border, marginRight:'16px' }}>—</span>{item}</span> })}
      </motion.div>
    </div>
  )
}

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
    <div style={{ borderTop:'1px solid '+C.border, padding:isMobile?'32px 24px':'40px 80px', background:C.surface }}>
      <div style={{ maxWidth:'1280px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <ElevationMark size={16} color={C.text} />
          <span style={{ fontFamily:F_SANS, fontWeight:'500', fontSize:'14px', letterSpacing:'-0.01em', color:C.text }}>CertifyROI</span>
        </div>
        <div style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.1em', opacity:0.8 }}>LINKEDIN // NASSCOM // AMBITIONBOX // NAUKRI // 2026</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN LANDING PAGE : HYPER-CLEAN ARCHITECTURAL POSTER
// ─────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  var isDark   = useIsDark()
  var isMobile = useIsMobile()
  var C        = isDark ? D : L

  var heroRef = useRef(null)
  var { scrollYProgress: heroSP } = useScroll({ target: heroRef, offset: ['start start','end start'] })
  var mY  = useTransform(heroSP, [0,1], [0, isMobile?20:60])
  var tY  = useTransform(heroSP, [0,1], [0, isMobile?-10:-40])
  
  // Background typography scaling
  var bScale = useTransform(heroSP, [0,1], [1, 1.05])
  var bOp    = useTransform(heroSP, [0,1], [1, 0])

  return (
    <div style={{ minHeight:'100vh', background:C.bg, position:'relative', overflow: 'hidden' }}>

      {/* ── HERO ARCHITECTURAL LAYER ── */}
      <div ref={heroRef} style={{ position:'relative', minHeight:isMobile?'90vh':'100vh', display:'flex', alignItems:'center', justifyContent:'center', borderBottom: '1px solid '+C.border }}>
        
        {/* GIANT EDITORIAL GHOST TEXT */}
        <motion.div 
          style={{ scale: bScale, opacity: bOp, position: 'absolute', top: '50%', left: '50%', x: '-50%', y: '-50%', zIndex: 0, pointerEvents: 'none', width: '100%', textAlign: 'center' }}
        >
          <div style={{ 
            fontFamily: F_SANS, fontWeight: 900, fontSize: isMobile?'28vw':'24vw', lineHeight: 0.8, letterSpacing: '-0.03em', 
            // "TAYCAN" / Nike poster style: transparent internally, incredibly fine sharp stroke.
            WebkitTextStroke: '1px ' + (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(28,27,26,0.05)'),
            color: 'transparent',
            userSelect: 'none'
          }}>
            CERTIFY
          </div>
        </motion.div>

        {/* ── ARCHITECTURAL FRAMEWORK (Outer Border Marks) ── */}
        {!isMobile && (
          <div style={{ position: 'absolute', inset: '40px', pointerEvents: 'none', zIndex: 1 }}>
             {/* 4 Corners */}
             <div style={{ position:'absolute', top:0, left:0 }}><Crosshair color={C.text3} /></div>
             <div style={{ position:'absolute', top:0, right:0 }}><Crosshair color={C.text3} /></div>
             <div style={{ position:'absolute', bottom:0, left:0 }}><Crosshair color={C.text3} /></div>
             <div style={{ position:'absolute', bottom:0, right:0 }}><Crosshair color={C.text3} /></div>
             
             {/* Vertical Axis Labels */}
             <div style={{ position:'absolute', top:'10%', left:'-14px', writingMode:'vertical-rl', transform:'rotate(180deg)', fontFamily:F_MONO, fontSize:'9px', color:C.text3, letterSpacing:'0.2em' }}>
               01 // ELEVATION BASE
             </div>
             <div style={{ position:'absolute', bottom:'10%', right:'-14px', writingMode:'vertical-rl', fontFamily:F_MONO, fontSize:'9px', color:C.text3, letterSpacing:'0.2em' }}>
               INDIA MARKET DATA 2026
             </div>
          </div>
        )}

        {/* ── COMPOSITION GRID ── */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', alignItems: 'center' }}>
          
          {/* LEFT: POSTER TYPOGRAPHY (OVERLAPPING) */}
          <motion.div 
            style={{ y: tY, flex: isMobile ? 'none' : '0 0 55%', padding: isMobile ? '0 32px 40px' : '0 0 0 120px', zIndex: 4, transform: 'translateY(-20px)' }}
          >
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.8, ease:[0.16,1,0.3,1] }} style={{ fontFamily:F_MONO, fontSize:'10px', color:C.text3, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:'32px', display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width: '24px', height: '1px', background: C.border }} />
              ROI ANALYSIS PLATFORM
            </motion.div>
            
            <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.9, ease:[0.16,1,0.3,1] }} style={{ fontFamily:F_SERIF, fontWeight:'400', fontSize:'clamp(3.5vw, 6vw, 6vw)', lineHeight: 0.92, letterSpacing:'-0.03em', color:C.text, marginBottom:'36px', marginTop:0, textShadow: isDark ? 'none' : '0 4px 24px rgba(250,250,248,0.8)' }}>
              Your next cert<br />
              is either a <span style={{ color:C.gold }}>goldmine</span><br />
              or a <span style={{ color:C.text4, fontStyle:'italic' }}>mistake.</span>
            </motion.h1>
            
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.45, duration:1, ease:[0.16,1,0.3,1] }} style={{ fontFamily:F_SANS, fontSize:'clamp(15px,1.5vw,16px)', color:C.text2, maxWidth:'400px', lineHeight:'1.75', margin:'0 0 44px', fontWeight:'400' }}>
              Know the exact playback period before you transfer the exam fee. Calculated for your specific city and current salary elevation.
            </motion.p>
            
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6, duration:0.8 }}>
              {/* Automotive/Luxury Solid Sharp Button */}
              <button onClick={onEnter} style={{ padding:'0 44px', height:'56px', borderRadius:'0px', border:'none', background:C.btnFill, color:C.btnText, fontSize:'14px', fontFamily:F_SANS, fontWeight:'500', letterSpacing:'0.04em', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'12px', transition:'all 0.3s' }} onMouseEnter={function(e){e.currentTarget.style.background=C.text2; e.currentTarget.style.paddingLeft='50px'; e.currentTarget.style.paddingRight='38px';}} onMouseLeave={function(e){e.currentTarget.style.background=C.btnFill; e.currentTarget.style.paddingLeft='44px'; e.currentTarget.style.paddingRight='44px';}}>
                CALCULATE ROI <ArrowRight size={15} strokeWidth={1.5} />
              </button>
              <div style={{ marginTop:'18px', fontFamily:F_MONO, fontSize:'9px', color:C.text3, letterSpacing:'0.14em' }}>[ NO ACCOUNT REQUIRED ]</div>
            </motion.div>
          </motion.div>

          {/* RIGHT: MASSIVE PHYSICAL OBJECT (Mountain) */}
          {/* Removing all ribbons. Scaling the mountain up enormously. Positioning it physically. */}
          <motion.div 
            style={{ y: mY, flex: isMobile ? 'none' : '0 0 55%', height: isMobile ? '50vh' : '85vh', position: 'relative', zIndex: 3, marginLeft: isMobile ? '0' : '-10%' }}
          >
             <motion.img 
                initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: [0.16,1,0.3,1] }}
                src="/mountain.png" alt="Mountain Certification Terrain" 
                style={{ 
                  position: 'absolute', top: isMobile ? '0' : '10%', right: isMobile ? 'auto' : '5%', left: isMobile ? '5%' : 'auto', 
                  height: isMobile ? '100%' : '110%', width: isMobile ? '90%' : '115%', objectFit: 'contain', objectPosition: 'center bottom',
                  // Extreme architectural contrast + darken to perfectly remove white edges and make it punchy
                  filter: isDark ? 'drop-shadow(0 40px 80px rgba(0,0,0,0.8)) contrast(1.1) grayscale(0.2)' : 'drop-shadow(0 30px 60px rgba(28,27,26,0.08)) contrast(1.15) grayscale(0.1)', 
                  mixBlendMode: isDark ? 'normal' : 'darken',
                  pointerEvents: 'none'
                }}
                onError={(e) => { 
                  if (!e.currentTarget.src.includes('?')) e.currentTarget.src = '/mountain.png?' + new Date().getTime();
                  else e.currentTarget.style.display = 'none'; 
                }}
              />
          </motion.div>

        </div>
      </div>

      <TrustStrip C={C} />
      <CertAssembly C={C} />
      {/* Restored sections */}
      <RidgeSilhouette C={C} />
      <DataComposition C={C} isMobile={isMobile} />
      <RidgeSilhouette C={C} />
      <HowItWorks C={C} isMobile={isMobile} onEnter={onEnter} />
      <PageFooter C={C} isMobile={isMobile} />
      
    </div>
  )
}

export default LandingPage
