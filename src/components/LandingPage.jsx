import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────
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
// DESIGN TOKENS — light only, editorial product aesthetics
// ─────────────────────────────────────────────────────────
var FH   = "'Inter', sans-serif"
var FB   = "'Inter', sans-serif"
var FM   = "'JetBrains Mono', 'Courier New', monospace"
var FSER = "'EB Garamond', Georgia, serif"

var C = {
  bg:           '#FAFAF8',
  surface:      '#F5F3EF',
  surfaceHigh:  '#EEEBE5',
  text:         '#1A1916',
  text2:        '#5C5A56',
  text3:        '#9C9A96',
  text4:        '#C0BDB8',
  green:        '#0D6B6F', // refined teal
  greenL:       '#0A565A',
  gold:         '#9A7235',
  goldL:        '#B89050',
  err:          '#7A2C2C',
  line:         '#E0DDD8',
  lineHeavy:    '#C8C5BE',
  border:       'rgba(26,25,22,0.09)',
  borderStrong: 'rgba(26,25,22,0.16)',
  btnFill:      '#0D6B6F', // Teal CTA
  btnText:      '#FAFAF8',
}

// ─────────────────────────────────────────────────────────
// MOTION
// ─────────────────────────────────────────────────────────
var RISE = {
  hidden: { y: 18, opacity: 0 },
  show:   { y: 0,  opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}
var SLIDE_L = {
  hidden: { x: -28, opacity: 0 },
  show:   { x: 0,   opacity: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
}

// ─────────────────────────────────────────────────────────
// COMPASS — corner motif, top-right, premium & understated
// ─────────────────────────────────────────────────────────
function CompassCorner({ size }) {
  size = size || 180
  var cx = size / 2
  var cy = size / 2
  var R  = size * 0.44
  var r1 = size * 0.34
  var r2 = size * 0.22
  var strokeO = 'rgba(26,25,22,0.045)'
  var strokeI = 'rgba(26,25,22,0.025)'

  return (
    <svg width={size} height={size} viewBox={'0 0 '+size+' '+size}
      fill="none" style={{ display:'block', pointerEvents:'none' }} aria-hidden="true">
      {/* Outer dial ring */}
      <circle cx={cx} cy={cy} r={R} stroke={strokeO} strokeWidth="0.6"/>
      {/* Inner reference circles */}
      <circle cx={cx} cy={cy} r={r1} stroke={strokeI} strokeWidth="0.5"/>
      <circle cx={cx} cy={cy} r={r2} stroke={strokeI} strokeWidth="0.45"/>
      
      {/* Cardinal and ordinal tick marks */}
      {Array.from({ length: 36 }).map(function(_, i) {
        var deg = i * 10
        var rad = (deg - 90) * Math.PI / 180
        var isCard = deg % 90 === 0
        var isOrd = deg % 45 === 0
        var tl = isCard ? 9 : isOrd ? 6 : 3
        return (
          <line key={i}
            x1={cx + R * Math.cos(rad)} y1={cy + R * Math.sin(rad)}
            x2={cx + (R - tl) * Math.cos(rad)} y2={cy + (R - tl) * Math.sin(rad)}
            stroke={isCard ? strokeO : isOrd ? 'rgba(26,25,22,0.032)' : strokeI}
            strokeWidth={isCard ? 0.75 : isOrd ? 0.55 : 0.4}
          />
        )
      })}
      
      {/* Cardinal direction labels */}
      {[{d:0,l:'N'},{d:90,l:'E'},{d:180,l:'S'},{d:270,l:'W'}].map(function(item) {
        var rad = (item.d - 90) * Math.PI / 180
        return (
          <text key={item.l}
            x={cx + (R + 14) * Math.cos(rad)} y={cy + (R + 14) * Math.sin(rad)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={size * 0.068} fontFamily={FM}
            fill="rgba(26,25,22,0.055)" letterSpacing="0.08em" fontWeight="500">
            {item.l}
          </text>
        )
      })}
      
      {/* Directional radial lines from center */}
      {[0,45,90,135,180,225,270,315].map(function(deg) {
        var rad = (deg - 90) * Math.PI / 180
        var isMain = deg % 90 === 0
        return (
          <line key={deg}
            x1={cx} y1={cy}
            x2={cx + r1 * Math.cos(rad)} y2={cy + r1 * Math.sin(rad)}
            stroke={isMain ? strokeO : strokeI}
            strokeWidth={isMain ? 0.5 : 0.32}
          />
        )
      })}
      
      {/* Directional pointer triangles on cardinal points */}
      {[0,90,180,270].map(function(deg) {
        var rad  = (deg - 90) * Math.PI / 180
        var radL = (deg - 90 - 5.5) * Math.PI / 180
        var radR = (deg - 90 + 5.5) * Math.PI / 180
        var tipX = cx + R * 0.80 * Math.cos(rad)
        var tipY = cy + R * 0.80 * Math.sin(rad)
        var lx = cx + r2 * 0.65 * Math.cos(radL)
        var ly = cy + r2 * 0.65 * Math.sin(radL)
        var rx = cx + r2 * 0.65 * Math.cos(radR)
        var ry = cy + r2 * 0.65 * Math.sin(radR)
        return (
          <polygon key={deg}
            points={tipX+','+tipY+' '+lx+','+ly+' '+cx+','+cy+' '+rx+','+ry}
            fill="rgba(26,25,22,0.02)" stroke={strokeO} strokeWidth="0.35" strokeLinejoin="round"
          />
        )
      })}
      
      {/* Center point and accent */}
      <circle cx={cx} cy={cy} r="3.2" fill="none" stroke={strokeO} strokeWidth="0.65"/>
      <circle cx={cx} cy={cy} r="1.1" fill="rgba(26,25,22,0.04)"/>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// ELEVATION MARK
// ─────────────────────────────────────────────────────────
function ElevationMark({ size, color }) {
  size  = size  || 16
  color = color || C.green
  var w = size, h = size * 0.6
  return (
    <svg width={w} height={h} viewBox={'0 0 '+w+' '+h} fill="none" style={{ display:'block' }}>
      <path d={'M 0 '+h+' Q '+(w*0.25)+' '+(h*0.1)+' '+(w*0.5)+' '+(h*0.18)+' Q '+(w*0.75)+' '+(h*0.32)+' '+w+' '+h}
        stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx={w*0.5} cy={h*0.18} r="1.8" fill={color} />
    </svg>
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
// BUTTONS
// ─────────────────────────────────────────────────────────
function PrimaryBtn({ onClick, children, large }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.975 }}
      transition={{ duration: 0.14 }}
      style={{
        display:'inline-flex', alignItems:'center', gap:'8px',
        padding: large ? '0 32px' : '0 22px',
        height: large ? '50px' : '42px',
        borderRadius:'5px', border:'none',
        background: C.btnFill, color: C.btnText,
        fontSize: large ? '14px' : '13px',
        fontFamily: FH, fontWeight:'500',
        letterSpacing:'-0.01em', cursor:'pointer',
        boxShadow:'0 1px 2px rgba(26,25,22,0.10)',
        transition:'box-shadow 0.14s',
      }}
      onMouseEnter={function(e) { e.currentTarget.style.boxShadow='0 4px 14px rgba(26,25,22,0.18)' }}
      onMouseLeave={function(e) { e.currentTarget.style.boxShadow='0 1px 2px rgba(26,25,22,0.10)' }}
    >
      {children}
    </motion.button>
  )
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick}
      style={{
        display:'inline-flex', alignItems:'center', gap:'6px',
        padding:'0 18px', height:'42px', borderRadius:'5px',
        border:'1px solid '+C.borderStrong,
        background:'transparent', color:C.text2,
        fontSize:'13px', fontFamily:FH, fontWeight:'400',
        cursor:'pointer', transition:'all 0.14s',
      }}
      onMouseEnter={function(e) { e.currentTarget.style.borderColor=C.text2; e.currentTarget.style.color=C.text }}
      onMouseLeave={function(e) { e.currentTarget.style.borderColor=C.borderStrong; e.currentTarget.style.color=C.text2 }}
    >
      {children}
    </button>
  )
}

// ─────────────────────────────────────────────────────────
// RULE — hairline divider
// ─────────────────────────────────────────────────────────
function Rule({ style }) {
  return <div style={{ height:'1px', background:C.border, ...style }} />
}

// ─────────────────────────────────────────────────────────
// WAYPOINT DOT
// ─────────────────────────────────────────────────────────
function WaypointDot({ filled, color }) {
  color = color || C.green
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ display:'block', flexShrink:0 }}>
      <circle cx="9" cy="9" r="7.5" stroke={color} strokeWidth="1" strokeOpacity={filled?0.3:0.2}/>
      <circle cx="9" cy="9" r="3.5"
        fill={filled?color:'none'} stroke={color} strokeWidth="1" strokeOpacity={filled?1:0.35}/>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// TRUST STRIP — flowing motion from hero ribbon
// ─────────────────────────────────────────────────────────
function TrustStrip() {
  var items = [
    { text:'AWS cert holders earn ₹2.4L more/yr in Bangalore', tag:'Cloud' },
    { text:'2,400+ cloud roles open on Naukri right now', tag:'Demand' },
    { text:'Average PMP payback period: 7 months', tag:'Finance' },
    { text:'Google Analytics cert · ₹18K invested → ₹3.2L annual gain', tag:'Marketing' },
    { text:'CKA Kubernetes: highest ROI in DevOps 2026', tag:'DevOps' },
    { text:'Hyderabad cloud demand up 38% year-over-year', tag:'Market' },
    { text:'CFA Level 1: median salary uplift ₹4.8L in Mumbai', tag:'Finance' },
    { text:'103 certifications · 17 domains · 8 Indian cities', tag:'Coverage' },
  ]

  return (
    <div style={{
      borderTop: '1px solid '+C.border,
      borderBottom: '1px solid '+C.border,
      padding: '0',
      background: C.surface,
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Subtle flowing gradient accent from hero ribbon */}
      <div style={{
        position: 'absolute',
        top: 0, left: '15%', right: 0, height: '100%',
        background: 'linear-gradient(90deg, rgba(13,107,111,0.02) 0%, rgba(13,107,111,0) 40%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{ padding: '12px 80px 0', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
        <div style={{ height:'1px', width:'20px', background:C.lineHeavy, opacity:0.4 }} />
        <span style={{ fontFamily:FM, fontSize:'9px', color:C.text4, letterSpacing:'0.12em', textTransform:'uppercase', fontWeight: '500' }}>
          Market data · Q1 2026
        </span>
      </div>
      <div style={{ padding:'14px 0 16px', overflow:'hidden' }}>
        <motion.div
          animate={{ x:['0%','-50%'] }}
          transition={{ duration:75, repeat:Infinity, ease:'linear' }}
          style={{ display:'flex', gap:'0', whiteSpace:'nowrap', width:'max-content', alignItems:'stretch' }}
        >
          {[...items,...items].map(function(item, i) {
            return (
              <div key={i} style={{ display:'inline-flex', alignItems:'center', gap:'0', borderRight: '1px solid '+C.border, padding: '0 40px', flexShrink: 0 }}>
                <span style={{ fontFamily:FM, fontSize:'11px', color:C.text2, letterSpacing:'0.015em', lineHeight:'1.4' }}>
                  <span style={{ fontFamily:FM, fontSize:'9px', color:C.green, letterSpacing:'0.08em', textTransform:'uppercase', marginRight:'10px', opacity:0.7, fontWeight: '500' }}>
                    {item.tag}
                  </span>
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
// DATA COMPOSITION — premium flow with ribbon harmony
// ─────────────────────────────────────────────────────────
function DataComposition({ isMobile }) {
  return (
    <div style={{ paddingTop:isMobile?'72px':'96px', paddingBottom:isMobile?'72px':'96px', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle flowing accent from ribbon language */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: '-10%', width: '120%', height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(13,107,111,0.06) 25%, rgba(13,107,111,0.06) 75%, transparent 100%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{ maxWidth:'1120px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px', position: 'relative', zIndex: 1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
          style={{ fontFamily:FM, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'24px', fontWeight: '500' }}>
          The numbers behind every recommendation
        </motion.div>
        <motion.div variants={SLIDE_L} initial="hidden" whileInView="show" viewport={{ once:true }}
          style={{ marginBottom:isMobile?'56px':'88px' }}>
          <div style={{ fontFamily:FM, fontSize:'clamp(3rem,13vw,7.5rem)', color:C.gold, lineHeight:1, letterSpacing:'-0.045em', fontWeight:'500' }}>
            <CountUp end={14.2} prefix="₹" suffix="L" />
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:'14px', marginTop:'14px', flexWrap:'wrap' }}>
            <div style={{ fontFamily:FSER, fontStyle:'italic', fontSize:'clamp(1rem,2.4vw,1.35rem)', color:C.text2, fontWeight: '500' }}>5-year net gain · AWS Solutions Architect</div>
            <div style={{ fontFamily:FM, fontSize:'10px', color:C.text3, letterSpacing:'0.1em', textTransform:'uppercase', fontWeight: '500' }}>Bangalore median · 2026</div>
          </div>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', borderTop:'1px solid '+C.border }}>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}
            style={{ padding:isMobile?'40px 0':'56px 64px 56px 0', borderBottom:isMobile?'1px solid '+C.border:'none', borderRight:isMobile?'none':'1px solid '+C.border }}>
            <div style={{ fontFamily:FM, fontSize:'10px', color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'16px', fontWeight: '500' }}>Payback period</div>
            <div style={{ fontFamily:FM, fontSize:'clamp(2.2rem,7vw,4.2rem)', color:C.text, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'500', marginBottom:'14px' }}><CountUp end={6} suffix=" months" /></div>
            <div style={{ fontFamily:FB, fontSize:'15px', color:C.text2, lineHeight:'1.75', maxWidth:'38ch' }}>Not "a few months." The exact month your investment turns profitable — calculated for your salary and city.</div>
          </motion.div>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.1 }}
            style={{ padding:isMobile?'40px 0':'56px 0 56px 64px' }}>
            <div style={{ fontFamily:FM, fontSize:'10px', color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'16px' }}>Salary increase</div>
            <div style={{ fontFamily:FM, fontSize:'clamp(2.2rem,7vw,4.2rem)', color:C.text, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'500', marginBottom:'14px' }}><CountUp end={35} suffix="%" /></div>
            <div style={{ fontFamily:FB, fontSize:'15px', color:C.text2, lineHeight:'1.75', maxWidth:'38ch' }}>India-sourced. City-specific. Not US data converted at today's rate and called "India salary insights."</div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// FINAL CTA — Premium close with motion harmony
// ─────────────────────────────────────────────────────────
function FinalCTA({ isMobile, onEnter }) {
  return (
    <div style={{ background:C.surfaceHigh, borderTop:'1px solid '+C.border, paddingTop:isMobile?'80px':'120px', paddingBottom:isMobile?'80px':'120px', position:'relative', overflow:'hidden' }}>
      {/* Flowing ribbon-inspired accent from the hero */}
      <div style={{
        position: 'absolute', left: '-5%', top: '30%', width: '110%', height: '200px',
        background: 'linear-gradient(135deg, rgba(13,107,111,0.04) 0%, rgba(13,107,111,0.02) 40%, transparent 80%)',
        pointerEvents: 'none',
        borderRadius: '50% 50% 0 0',
        filter: 'blur(1px)'
      }} />
      
      <div style={{ position:'absolute', right:'-40px', top:'-40px', pointerEvents:'none', opacity:0.18 }}>
        <svg width="260" height="260" viewBox="-130 -130 260 260">
          {[35,60,85,110,135].map(function(r,i) {
            return (
              <ellipse key={i} cx="0" cy="0" rx={r} ry={r*0.64}
                fill="none" stroke={C.lineHeavy} strokeWidth="0.65"
                transform="rotate(18)" opacity={i===0?0.5:0.3}
              />
            )
          })}
        </svg>
      </div>
      <div style={{ maxWidth:'1120px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px', position:'relative', zIndex:1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:FM, fontSize:'11px', color:C.text3, letterSpacing:'0.16em', textTransform:'uppercase', marginBottom:'28px', fontWeight: '500' }}>
            2 minutes from now
          </div>
          <h2 style={{ fontFamily:FSER, fontStyle:'italic', fontWeight:'500', fontSize:'clamp(2.6rem,8vw,5.5rem)', color:C.text, letterSpacing:'-0.02em', lineHeight:0.96, marginTop:0, marginBottom:'36px', maxWidth:'16ch' }}>
            You'll know<br />the answer.
          </h2>
        </motion.div>
        <motion.p variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.1 }}
          style={{ fontFamily:FB, fontSize:'clamp(14px,2vw,16px)', color:C.text2, lineHeight:'1.85', maxWidth:'40ch', margin:'0 0 44px' }}>
          Stop reading about certifications. Stop asking Reddit.{' '}
          <span style={{ color:C.text, fontWeight:'500' }}>Know the payback period before you pay the fee.</span>
        </motion.p>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.18 }}
          style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'14px' }}>
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center' }}>
            <PrimaryBtn onClick={onEnter} large={true}>Calculate ROI <ArrowRight size={16}/></PrimaryBtn>
            <GhostBtn onClick={onEnter}>See a sample report →</GhostBtn>
          </div>
          <div style={{ fontFamily:FM, fontSize:'11px', color:C.text3, letterSpacing:'0.08em', fontWeight: '500' }}>No signup · Free · India salary data 2026</div>
        </motion.div>
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
  var { scrollYProgress: heroSP } = useScroll({ target: heroRef, offset: ['start start','end start'] })
  var heroY  = useTransform(heroSP, [0,1], [0, isMobile?40:80])
  var heroOp = useTransform(heroSP, [0,0.5], [1,0])

  return (
    <div style={{ minHeight:'100vh', background:C.bg }}>
      <div
        ref={heroRef}
        style={{
          position:'relative',
          minHeight: isMobile ? 'calc(100svh - 64px)' : 'calc(100vh - 64px)',
          marginTop:'var(--nav-h, 64px)',
          display:'flex', alignItems:'center', justifyContent:'center',
          overflow:'hidden',
        }}
      >
        <div style={{ position:'absolute', top: isMobile ? '-20px' : '-30px', right: isMobile ? '-20px' : '-30px', pointerEvents:'none', zIndex:0 }}>
          <CompassCorner size={isMobile ? 160 : 220} />
        </div>

        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(26,25,22,0.048) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none', zIndex:0, maskImage:'radial-gradient(ellipse 65% 65% at 50% 50%, black 20%, transparent 100%)', WebkitMaskImage:'radial-gradient(ellipse 65% 65% at 50% 50%, black 20%, transparent 100%)' }} />

        <motion.div style={{ y:heroY, opacity:heroOp, position:'relative', zIndex:1, textAlign:'center', width:'100%', paddingTop: isMobile ? '60px' : '40px' }}>
          <div style={{ maxWidth:'960px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px', display:'flex', flexDirection:'column', alignItems:'center' }}>

            {/* ── PREMIUM GALLERY-LIKE HERO COMPOSITION ── */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, ease: [0.16,1,0.3,1] }}
              style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: isMobile ? '340px' : '720px',
                aspectRatio: isMobile ? '1 / 1.2' : '4 / 3',
                margin: '0 auto',
                marginBottom: isMobile ? '48px' : '64px',
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                background: 'linear-gradient(135deg, rgba(250,250,248,0.5) 0%, rgba(245,243,239,0.3) 100%)',
                borderRadius: '2px',
                border: '1px solid rgba(26,25,22,0.04)',
                overflow: 'hidden',
              }}
            >
              {/* ── PREMIUM FLOWING RIBBON: S-CURVE PATH ── */}
              <motion.svg
                initial={{ opacity: 0, pathLength: 0 }} 
                animate={{ opacity: 1, pathLength: 1 }} 
                transition={{ delay: 0.2, duration: 2.0, ease: 'easeInOut' }}
                style={{ 
                  position: 'absolute', 
                  inset: 0,
                  width: '100%', 
                  height: '100%',
                  zIndex: 1,
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 12px 24px rgba(13,107,111,0.08))'
                }}
                viewBox="0 0 1000 800"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Premium flowing gradient: deep teal → blue-gray → muted cyan */}
                  <linearGradient id="premiumRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(13,107,111,0)" />
                    <stop offset="8%" stopColor="rgba(45,85,95,0.15)" />
                    <stop offset="22%" stopColor="rgba(65,120,140,0.35)" />
                    <stop offset="35%" stopColor="rgba(75,135,155,0.5)" />
                    <stop offset="50%" stopColor="rgba(100,145,160,0.52)" />
                    <stop offset="65%" stopColor="rgba(70,130,145,0.45)" />
                    <stop offset="78%" stopColor="rgba(55,115,130,0.28)" />
                    <stop offset="92%" stopColor="rgba(35,85,105,0.12)" />
                    <stop offset="100%" stopColor="rgba(13,107,111,0)" />
                  </linearGradient>

                  {/* Subtle highlight accent */}
                  <linearGradient id="ribbonAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(200,220,230,0)" />
                    <stop offset="40%" stopColor="rgba(220,235,245,0.18)" />
                    <stop offset="60%" stopColor="rgba(210,225,240,0.14)" />
                    <stop offset="100%" stopColor="rgba(180,200,220,0)" />
                  </linearGradient>

                  {/* Filter for smooth dimension */}
                  <filter id="ribbonBlur">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
                  </filter>
                </defs>

                {/* Main ribbon path: elegant S-curve sweeping left to right */}
                {/* Entry from left, sweeps through center, exits right, partially behind mountain */}
                <path
                  d="M -50 350 Q 180 200 350 280 T 700 320 L 1050 350"
                  fill="none"
                  stroke="url(#premiumRibbon)"
                  strokeWidth="280"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                  filter="url(#ribbonBlur)"
                />

                {/* Accent edge for dimensional quality */}
                <path
                  d="M -50 380 Q 180 230 350 310 T 700 350 L 1050 380"
                  fill="none"
                  stroke="url(#ribbonAccent)"
                  strokeWidth="140"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.6"
                />

                {/* Subtle second wave for depth: enters lower, creates layered motion */}
                <path
                  d="M -40 420 Q 160 550 380 480 T 720 400 L 1040 380"
                  fill="none"
                  stroke="rgba(75,135,155,0.08)"
                  strokeWidth="200"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.5"
                />
              </motion.svg>

              {/* ── MOUNTAIN HERO OBJECT: ELEVATED & CENTERED ── */}
              <motion.img 
                initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ delay: 0.1, duration: 1.3, ease: [0.16,1,0.3,1] }}
                src="/mountain.png" 
                alt="Mountain Ascent" 
                style={{ 
                  position: 'relative', 
                  zIndex: 3,
                  height: isMobile ? '65%' : '72%',
                  width: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  filter: 'drop-shadow(0 20px 40px rgba(26,25,22,0.08)) contrast(1.08)',
                  pointerEvents: 'none'
                }} 
              />

              {/* Elevated glow behind mountain for gallery effect */}
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '85%',
                  height: '85%',
                  background: 'radial-gradient(circle at center, rgba(250,250,248,0.8) 0%, rgba(250,250,248,0.1) 50%, transparent 85%)',
                  borderRadius: '50%',
                  zIndex: 0,
                  pointerEvents: 'none',
                  filter: 'blur(2px)'
                }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.18, duration:0.75, ease:[0.16,1,0.3,1] }}
              style={{
                fontFamily: FH, fontWeight: '600',
                fontSize: isMobile ? 'clamp(2rem,8vw,2.8rem)' : 'clamp(2.4rem,4.2vw,3.8rem)',
                lineHeight: 1.08, letterSpacing: '-0.035em', color: C.text,
                marginBottom: isMobile ? '28px' : '36px', marginTop: 0, textAlign: 'center',
                maxWidth: isMobile ? '100%' : '880px'
              }}
            >
              Your next cert<br />
              <span style={{ fontWeight:'500', color:C.text2, fontSize:'0.85em', letterSpacing:'-0.015em' }}>is either a{' '}</span>
              <span style={{ fontFamily: FSER, fontStyle: 'italic', fontWeight: '500', fontSize: '1.06em', color: C.gold, letterSpacing: '-0.02em' }}>goldmine</span><br />
              <span style={{ fontWeight:'500', color:C.text2, fontSize:'0.85em', letterSpacing:'-0.015em' }}>or a{' '}</span>
              <span style={{ fontFamily: FSER, fontStyle: 'italic', fontWeight: '500', fontSize: '1.06em', color: C.err, letterSpacing: '-0.02em' }}>mistake.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.3, duration:0.55, ease:[0.16,1,0.3,1] }}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' }}
            >
              <PrimaryBtn onClick={onEnter} large={true}>Calculate ROI <ArrowRight size={16}/></PrimaryBtn>
              <div style={{ fontFamily:FM, fontSize:'11px', color:C.text3, letterSpacing:'0.08em' }}>Free · No signup · India salary data</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Rule />
      <TrustStrip />
      <DataComposition isMobile={isMobile} />
      <Rule />
      <FinalCTA isMobile={isMobile} onEnter={onEnter} />
    </div>
  )
}

export default LandingPage
