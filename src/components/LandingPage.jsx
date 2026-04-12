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
// DESIGN TOKENS — editorial product aesthetics
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
  green:        '#0D6B6F', // deep teal
  greenL:       '#0A565A',
  gold:         '#9A7235',
  goldL:        '#B89050',
  err:          '#7A2C2C',
  line:         '#E0DDD8',
  lineHeavy:    '#C8C5BE',
  border:       'rgba(26,25,22,0.09)',
  borderStrong: 'rgba(26,25,22,0.16)',
  btnFill:      '#0D6B6F',
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
// COMPASS — subtle corner accent
// ─────────────────────────────────────────────────────────
function CompassCorner({ size }) {
  size = size || 180
  var cx = size / 2
  var cy = size / 2
  var R  = size * 0.44
  var r1 = size * 0.34
  var r2 = size * 0.22
  var strokeO = 'rgba(26,25,22,0.07)'
  var strokeI = 'rgba(26,25,22,0.04)'

  return (
    <svg width={size} height={size} viewBox={'0 0 '+size+' '+size}
      fill="none" style={{ display:'block', pointerEvents:'none' }} aria-hidden="true">
      <circle cx={cx} cy={cy} r={R} stroke={strokeO} strokeWidth="0.7"/>
      <circle cx={cx} cy={cy} r={r1} stroke={strokeI} strokeWidth="0.55"/>
      <circle cx={cx} cy={cy} r={r2} stroke={strokeI} strokeWidth="0.5"/>
      {Array.from({ length: 36 }).map(function(_, i) {
        var deg = i * 10
        var rad = (deg - 90) * Math.PI / 180
        var isCard = deg % 90 === 0
        var tl = isCard ? 9 : deg % 45 === 0 ? 6 : 3
        return (
          <line key={i}
            x1={cx + R * Math.cos(rad)} y1={cy + R * Math.sin(rad)}
            x2={cx + (R - tl) * Math.cos(rad)} y2={cy + (R - tl) * Math.sin(rad)}
            stroke={isCard ? strokeO : strokeI} strokeWidth={isCard ? 0.8 : 0.45}
          />
        )
      })}
      {[{d:0,l:'N'},{d:90,l:'E'},{d:180,l:'S'},{d:270,l:'W'}].map(function(item) {
        var rad = (item.d - 90) * Math.PI / 180
        return (
          <text key={item.l}
            x={cx + (R + 12) * Math.cos(rad)} y={cy + (R + 12) * Math.sin(rad)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={size * 0.07} fontFamily={FM}
            fill="rgba(26,25,22,0.09)" letterSpacing="0.05em">
            {item.l}
          </text>
        )
      })}
      {[0,45,90,135,180,225,270,315].map(function(deg) {
        var rad = (deg - 90) * Math.PI / 180
        var isMain = deg % 90 === 0
        return (
          <line key={deg}
            x1={cx} y1={cy}
            x2={cx + r1 * Math.cos(rad)} y2={cy + r1 * Math.sin(rad)}
            stroke={isMain ? strokeO : strokeI} strokeWidth={isMain ? 0.55 : 0.35}
          />
        )
      })}
      {[0,90,180,270].map(function(deg) {
        var rad  = (deg - 90) * Math.PI / 180
        var radL = (deg - 90 - 5) * Math.PI / 180
        var radR = (deg - 90 + 5) * Math.PI / 180
        var tipX = cx + R * 0.82 * Math.cos(rad)
        var tipY = cy + R * 0.82 * Math.sin(rad)
        var lx = cx + r2 * 0.75 * Math.cos(radL)
        var ly = cy + r2 * 0.75 * Math.sin(radL)
        var rx = cx + r2 * 0.75 * Math.cos(radR)
        var ry = cy + r2 * 0.75 * Math.sin(radR)
        return (
          <polygon key={deg}
            points={tipX+','+tipY+' '+lx+','+ly+' '+cx+','+cy+' '+rx+','+ry}
            fill="rgba(26,25,22,0.025)" stroke={strokeO} strokeWidth="0.4"
          />
        )
      })}
      <circle cx={cx} cy={cy} r="3.5" fill="none" stroke={strokeO} strokeWidth="0.7"/>
      <circle cx={cx} cy={cy} r="1.2" fill="rgba(26,25,22,0.06)"/>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// CAPTIONS & ACCENTS
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

function PrimaryBtn({ onClick, children, large }) {
  return (
    <motion.button
      onClick={onClick} whileHover={{ y: -1 }} whileTap={{ scale: 0.975 }} transition={{ duration: 0.14 }}
      style={{
        display:'inline-flex', alignItems:'center', gap:'8px',
        padding: large ? '0 32px' : '0 22px', height: large ? '50px' : '42px',
        borderRadius:'5px', border:'none',
        background: C.btnFill, color: C.btnText,
        fontSize: large ? '14px' : '13px', fontFamily: FH, fontWeight:'500',
        letterSpacing:'-0.01em', cursor:'pointer',
        boxShadow:'0 1px 2px rgba(26,25,22,0.10)', transition:'box-shadow 0.14s',
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
        border:'1px solid '+C.borderStrong, background:'transparent', color:C.text2,
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

function Rule({ style }) {
  return <div style={{ height:'1px', background:C.border, ...style }} />
}

// ─────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────
function TrustStrip() {
  var items = [
    { text:'AWS cert holders earn ₹2.4L more/yr in Bangalore', tag:'Cloud' },
    { text:'2,400+ cloud roles open on Naukri right now', tag:'Demand' },
    { text:'Average PMP payback period: 7 months', tag:'Finance' },
    { text:'Google Analytics cert · ₹18K invested → ₹3.2L annual gain', tag:'Marketing' },
    { text:'CKA Kubernetes: highest ROI in DevOps 2026', tag:'DevOps' },
    { text:'Hyderabad cloud demand up 38% year-over-year', tag:'Market' },
    { text:'103 certifications · 17 domains · 8 Indian cities', tag:'Coverage' },
  ]
  return (
    <div style={{ borderTop: '1px solid '+C.border, borderBottom: '1px solid '+C.border, background: C.surface, overflow: 'hidden' }}>
      <div style={{ padding: '12px 80px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ height:'1px', width:'20px', background:C.lineHeavy, opacity:0.5 }} />
        <span style={{ fontFamily:FM, fontSize:'9px', color:C.text4, letterSpacing:'0.12em', textTransform:'uppercase' }}>Market data · Q1 2026</span>
      </div>
      <div style={{ padding:'14px 0 16px', overflow:'hidden' }}>
        <motion.div
          animate={{ x:['0%','-50%'] }} transition={{ duration:70, repeat:Infinity, ease:'linear' }}
          style={{ display:'flex', gap:'0', whiteSpace:'nowrap', width:'max-content', alignItems:'stretch' }}
        >
          {[...items,...items].map(function(item, i) {
            return (
              <div key={i} style={{ display:'inline-flex', alignItems:'center', borderRight: '1px solid '+C.border, padding: '0 40px' }}>
                <span style={{ fontFamily:FM, fontSize:'11px', color:C.text2, letterSpacing:'0.015em', lineHeight:'1.4' }}>
                  <span style={{ fontFamily:FM, fontSize:'9px', color:C.green, letterSpacing:'0.08em', textTransform:'uppercase', marginRight:'10px', opacity:0.65 }}>{item.tag}</span>
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

function DataComposition({ isMobile }) {
  return (
    <div style={{ paddingTop:isMobile?'72px':'96px', paddingBottom:isMobile?'72px':'96px' }}>
      <div style={{ maxWidth:'1120px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px' }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ fontFamily:FM, fontSize:'10px', color:C.text3, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'24px' }}>The numbers behind every recommendation</motion.div>
        <motion.div variants={SLIDE_L} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ marginBottom:isMobile?'56px':'88px' }}>
          <div style={{ fontFamily:FM, fontSize:'clamp(3rem,13vw,7.5rem)', color:C.gold, lineHeight:1, letterSpacing:'-0.045em', fontWeight:'500' }}><CountUp end={14.2} prefix="₹" suffix="L" /></div>
          <div style={{ display:'flex', alignItems:'baseline', gap:'14px', marginTop:'14px', flexWrap:'wrap' }}>
            <div style={{ fontFamily:FSER, fontStyle:'italic', fontSize:'clamp(1rem,2.4vw,1.35rem)', color:C.text2 }}>5-year net gain · AWS Solutions Architect</div>
            <div style={{ fontFamily:FM, fontSize:'10px', color:C.text3, letterSpacing:'0.1em', textTransform:'uppercase' }}>Bangalore median · 2026</div>
          </div>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', borderTop:'1px solid '+C.border }}>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ padding:isMobile?'40px 0':'56px 64px 56px 0', borderBottom:isMobile?'1px solid '+C.border:'none', borderRight:isMobile?'none':'1px solid '+C.border }}>
            <div style={{ fontFamily:FM, fontSize:'10px', color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'16px' }}>Payback period</div>
            <div style={{ fontFamily:FM, fontSize:'clamp(2.2rem,7vw,4.2rem)', color:C.text, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'500', marginBottom:'14px' }}><CountUp end={6} suffix=" months" /></div>
            <div style={{ fontFamily:FB, fontSize:'15px', color:C.text2, lineHeight:'1.75', maxWidth:'38ch' }}>Not "a few months." The exact month your investment turns profitable — calculated for your salary and city.</div>
          </motion.div>
          <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.1 }} style={{ padding:isMobile?'40px 0':'56px 0 56px 64px' }}>
            <div style={{ fontFamily:FM, fontSize:'10px', color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'16px' }}>Salary increase</div>
            <div style={{ fontFamily:FM, fontSize:'clamp(2.2rem,7vw,4.2rem)', color:C.text, lineHeight:1, letterSpacing:'-0.04em', fontWeight:'500', marginBottom:'14px' }}><CountUp end={35} suffix="%" /></div>
            <div style={{ fontFamily:FB, fontSize:'15px', color:C.text2, lineHeight:'1.75', maxWidth:'38ch' }}>India-sourced. City-specific. Not US data converted at today's rate and called "India salary insights."</div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function FinalCTA({ isMobile, onEnter }) {
  return (
    <div style={{ background:C.surfaceHigh, borderTop:'1px solid '+C.border, paddingTop:isMobile?'80px':'120px', paddingBottom:isMobile?'80px':'120px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', right:'-40px', top:'-40px', pointerEvents:'none', opacity:0.35 }}>
        <svg width="260" height="260" viewBox="-130 -130 260 260">
          {[35,60,85,110].map(function(r,i) { return (<ellipse key={i} cx="0" cy="0" rx={r} ry={r*0.64} fill="none" stroke={C.lineHeavy} strokeWidth="0.65" transform="rotate(18)" opacity={i===0?0.6:0.38} />) })}
        </svg>
      </div>
      <div style={{ maxWidth:'1120px', margin:'0 auto', padding:isMobile?'0 24px':'0 80px', position:'relative', zIndex:1 }}>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }}>
          <div style={{ fontFamily:FM, fontSize:'11px', color:C.text3, letterSpacing:'0.16em', textTransform:'uppercase', marginBottom:'28px' }}>2 minutes from now</div>
          <h2 style={{ fontFamily:FSER, fontStyle:'italic', fontWeight:'500', fontSize:'clamp(2.6rem,8vw,5.5rem)', color:C.text, letterSpacing:'-0.02em', lineHeight:0.96, marginTop:0, marginBottom:'36px', maxWidth:'16ch' }}>You'll know<br />the answer.</h2>
        </motion.div>
        <motion.p variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.1 }} style={{ fontFamily:FB, fontSize:'clamp(14px,2vw,16px)', color:C.text2, lineHeight:'1.85', maxWidth:'40ch', margin:'0 0 44px' }}>
          Stop reading about certifications. Stop asking Reddit.{' '}<span style={{ color:C.text, fontWeight:'500' }}>Know the payback period before you pay the fee.</span>
        </motion.p>
        <motion.div variants={RISE} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:0.18 }} style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'14px' }}>
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center' }}>
            <PrimaryBtn onClick={onEnter} large={true}>Calculate ROI <ArrowRight size={16}/></PrimaryBtn>
            <GhostBtn onClick={onEnter}>See a sample report →</GhostBtn>
          </div>
          <div style={{ fontFamily:FM, fontSize:'11px', color:C.text3, letterSpacing:'0.08em' }}>No signup · Free · India salary data 2026</div>
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

            {/* ── EDITORIAL MOUNTAIN HERO ASSEMBLY — SWEEPING S-CURVE ── */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16,1,0.3,1] }}
              style={{ position: 'relative', width: '100%', maxWidth: '800px', height: isMobile ? '280px' : '440px', margin: '0 auto', marginBottom: isMobile ? '32px' : '48px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '140%', height: '140%', background: 'radial-gradient(circle, rgba(250,250,248,1) 0%, rgba(250,250,248,0.3) 50%, transparent 80%)', mixBlendMode: 'screen', zIndex: 0, pointerEvents: 'none' }} />
              
              {/* BACK RIBBON: Enters from top-left, curves smoothly down and disappears behind the mountain */}
              <motion.svg 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'absolute', top: '0%', left: '-30%', width: '160%', height: '100%', zIndex: 0, pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none"
              >
                <path d="M-10,30 C30,35 45,60 60,90" fill="none" stroke="url(#ribbonBack)" strokeWidth="7" style={{ filter: 'blur(1.5px)', opacity: 0.6 }} />
                <path d="M-10,33 C33,38 48,63 60,90" fill="none" stroke="url(#ribbonBackCore)" strokeWidth="2.5" />
                <defs>
                  <linearGradient id="ribbonBack" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(13,107,111,0)" />
                    <stop offset="40%" stopColor="rgba(13,107,111,0.5)" />
                    <stop offset="80%" stopColor="rgba(10,86,90,0.6)" />
                    <stop offset="100%" stopColor="rgba(13,107,111,0)" />
                  </linearGradient>
                  <linearGradient id="ribbonBackCore" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(13,107,111,0)" />
                    <stop offset="50%" stopColor="rgba(13,107,111,0.25)" />
                    <stop offset="100%" stopColor="rgba(13,107,111,0)" />
                  </linearGradient>
                </defs>
              </motion.svg>

              {/* MOUNTAIN */}
              <motion.img 
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16,1,0.3,1] }}
                src="/mountain.png" alt="Mountain Ascent" 
                style={{ position: 'relative', zIndex: 1, height: '100%', objectFit: 'contain', mixBlendMode: 'darken', filter: 'drop-shadow(0 15px 30px rgba(26,25,22,0.06)) contrast(1.05)' }} 
              />
              
              {/* FRONT RIBBON: Emerges from the mountain mid-section and sweeps elegantly down to the bottom-right, completing the long S-curve */}
              <motion.svg 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'absolute', top: '0%', left: '-30%', width: '160%', height: '100%', zIndex: 2, pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none"
              >
                <path d="M48,60 C70,105 90,85 110,100" fill="none" stroke="url(#ribbonFront)" strokeWidth="8" style={{ filter: 'blur(1px)' }} />
                <path d="M50,62 C72,107 90,87 110,102" fill="none" stroke="rgba(250,250,248,0.5)" strokeWidth="1.5" />
                <path d="M46,58 C68,103 88,83 110,98" fill="none" stroke="url(#ribbonFrontCore)" strokeWidth="3" />
                <defs>
                  <linearGradient id="ribbonFront" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(13,107,111,0)" />
                    <stop offset="30%" stopColor="rgba(13,107,111,0.5)" />
                    <stop offset="60%" stopColor="#8A9D9A" />
                    <stop offset="100%" stopColor="rgba(13,107,111,0)" />
                  </linearGradient>
                  <linearGradient id="ribbonFrontCore" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(13,107,111,0)" />
                    <stop offset="40%" stopColor="rgba(13,107,111,0.85)" />
                    <stop offset="70%" stopColor="#6C8784" />
                    <stop offset="100%" stopColor="rgba(13,107,111,0)" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.16, duration:0.7, ease:[0.16,1,0.3,1] }}
              style={{ fontFamily: FH, fontWeight: '700', fontSize: isMobile ? 'clamp(2.2rem,9vw,3.2rem)' : 'clamp(2.6rem,4.5vw,4rem)', lineHeight: 1.06, letterSpacing: '-0.032em', color: C.text, marginBottom: isMobile ? '24px' : '32px', marginTop: 0, textAlign: 'center' }}
            >
              Your next cert<br />
              <span style={{ fontWeight:'400', color:C.text2, fontSize:'0.82em', letterSpacing:'-0.015em' }}>is either a{' '}</span>
              <span style={{ fontFamily: FSER, fontStyle: 'italic', fontWeight: '500', fontSize: '1.05em', color: C.gold, letterSpacing: '-0.02em' }}>goldmine</span><br />
              <span style={{ fontWeight:'400', color:C.text2, fontSize:'0.82em', letterSpacing:'-0.015em' }}>or a{' '}</span>
              <span style={{ fontFamily: FSER, fontStyle: 'italic', fontWeight: '500', fontSize: '1.05em', color: C.err, letterSpacing: '-0.02em' }}>mistake.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.55, ease:[0.16,1,0.3,1] }}
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
