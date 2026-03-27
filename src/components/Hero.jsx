import { motion, useAnimationFrame, useScroll, useTransform, useSpring, useMotionValue, animate } from 'framer-motion'
import { useRef, useState, useCallback, useEffect } from 'react'
import {
  TrendingUp, FileText, Map, Sparkles, ArrowRight,
  GraduationCap, Repeat, Briefcase, Star, Zap, Award,
  Brain, ChevronRight, AlertTriangle, IndianRupee
} from 'lucide-react'

// ── Gradient text ─────────────────────────────────────────
const G = ({ children, colors = ['#51B1E7', '#818CF8', '#10B981'] }) => (
  <span style={{ background: `linear-gradient(135deg, ${colors.join(', ')})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline' }}>{children}</span>
)
const GPurple = ({ children }) => <G colors={['#6366F1', '#818CF8', '#A78BFA']}>{children}</G>
const GGold   = ({ children }) => <G colors={['#F59E0B', '#EF4444']}>{children}</G>
const GGreen  = ({ children }) => <G colors={['#10B981', '#34D399', '#51B1E7']}>{children}</G>
const GRed    = ({ children }) => <G colors={['#EF4444', '#F59E0B']}>{children}</G>

// ── 3D Tilt Card ──────────────────────────────────────────
const TiltCard = ({ children, style = {}, intensity = 10, glowColor = '#6366F1', onClick }) => {
  const ref = useRef(null)
  const x   = useMotionValue(0)
  const y   = useMotionValue(0)
  const sx  = useSpring(x, { stiffness: 300, damping: 25 })
  const sy  = useSpring(y, { stiffness: 300, damping: 25 })
  const [glow, setGlow] = useState({ x: 50, y: 50, op: 0 })

  const onMove = useCallback(e => {
    if (!ref.current) return
    const r  = ref.current.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width  - 0.5
    const ny = (e.clientY - r.top)  / r.height - 0.5
    x.set(ny * -intensity); y.set(nx * intensity)
    setGlow({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, op: 1 })
  }, [x, y, intensity])

  const onLeave = useCallback(() => {
    x.set(0); y.set(0)
    setGlow(p => ({ ...p, op: 0 }))
  }, [x, y])

  return (
    <motion.div ref={ref} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: sx, rotateY: sy, perspective: 800, transformStyle: 'preserve-3d', position: 'relative', borderRadius: '20px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 1px 0 var(--card-highlight)', overflow: 'hidden', willChange: 'transform', cursor: onClick ? 'pointer' : 'default', ...style }}
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.018, transition: { duration: 0.2 } }}
    >
      <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none', zIndex: 0, background: `radial-gradient(circle 220px at ${glow.x}% ${glow.y}%, ${glowColor}1a 0%, transparent 70%)`, opacity: glow.op, transition: 'opacity 0.3s' }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none', zIndex: 0, background: `radial-gradient(circle 80px at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.05) 0%, transparent 60%)`, opacity: glow.op }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </motion.div>
  )
}

// ── Animated neon border ──────────────────────────────────
const NeonCard = ({ children, style = {}, color = '#6366F1', delay = 0 }) => {
  // FIX: zero-re-render approach — direct DOM style mutation instead of useState
  const outerRef = useRef(null)
  const glowRef  = useRef(null)
  const angleRef = useRef(delay * 60)

  useAnimationFrame(t => {
    angleRef.current = (delay * 60 + t * 0.04) % 360
    const a = angleRef.current * Math.PI / 180
    const x = 50 + 55 * Math.cos(a)
    const y = 50 + 55 * Math.sin(a)
    if (outerRef.current) {
      outerRef.current.style.background =
        `radial-gradient(circle at ${x}% ${y}%, ${color}cc 0%, ${color}44 30%, transparent 65%)`
    }
    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(circle at ${x}% ${y}%, ${color}22 0%, transparent 60%)`
    }
  })

  return (
    <motion.div ref={outerRef}
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }} whileHover={{ y: -3 }}
      style={{
        position: 'relative', borderRadius: '18px', padding: '1.5px',
        background: `radial-gradient(circle at 50% 50%, ${color}cc 0%, ${color}44 30%, transparent 65%)`,
        ...style
      }}>
      <div ref={glowRef} style={{ position: 'absolute', inset: '-1px', borderRadius: '19px', background: `radial-gradient(circle at 50% 50%, ${color}22 0%, transparent 60%)`, filter: 'blur(8px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, background: 'var(--glass-bg)', borderRadius: '17px', height: '100%' }}>{children}</div>
    </motion.div>
  )
}

// ── Floating orbs ─────────────────────────────────────────
const Orb = ({ color, size, style, delay = 0 }) => (
  <motion.div animate={{ y: [0, -24, 0], scale: [1, 1.06, 1] }} transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, pointerEvents: 'none', ...style }} />
)

// ── Animated counter ──────────────────────────────────────
const Counter = ({ target, suffix = '', prefix = '', duration = 2 }) => {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      const ctrl = animate(0, target, {
        duration,
        ease: [0.4, 0, 0.2, 1],
        onUpdate: v => setVal(Math.round(v))
      })
      return () => ctrl.stop()
    })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, duration])
  return <span ref={ref}>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>
}

// ── Scrolling ticker ──────────────────────────────────────
const Ticker = () => {
  const items = [
    '⚡ AWS cert holders earn ₹2.4L more/yr in Bangalore',
    '📍 2,400+ cloud roles open on Naukri right now',
    '🎯 Average break-even on PMP: 7 months',
    '🚀 Google Data Analytics cert: ₹18K cost, ₹3.2L annual gain',
    '🏆 CKA Kubernetes: highest hike % in India 2026 — +40%',
    '📊 Hyderabad cloud demand up 38% YoY',
    '💡 Most Indian engineers guess wrong about which cert to do first',
  ]
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '12px 0', background: 'var(--surface)', marginBottom: '80px' }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '60px', whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>{item}</span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Money burning counter ─────────────────────────────────
const MoneyBurning = () => {
  const [rupees, setRupees] = useState(0)
  useEffect(() => {
    const perSecond = 320000 / (365 * 24 * 3600)
    const t = setInterval(() => setRupees(v => v + perSecond / 10), 100)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ padding: '20px 24px', borderRadius: '14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
      <div style={{ fontSize: '11px', color: '#EF4444', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
        ₹ slipping away while you read this
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2.2rem', color: '#EF4444', fontWeight: '700', letterSpacing: '-0.03em' }}>
        ₹{rupees.toFixed(2)}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-4)', marginTop: '6px', fontFamily: 'Inter, sans-serif' }}>
        based on avg ₹3.2L/yr salary gap for uncertified professionals
      </div>
    </div>
  )
}

const LandingPage = ({ onEnter }) => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY   = useTransform(scrollYProgress, [0, 1], [0, 100])
  const heroOp  = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroSc  = useTransform(scrollYProgress, [0, 0.55], [1, 0.93])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>

      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <Orb color="rgba(99,102,241,0.08)"  size={700} style={{ top: '-20%', left: '5%' }}   delay={0} />
        <Orb color="rgba(16,185,129,0.05)"  size={500} style={{ bottom: '0%', right: '0%' }} delay={2} />
        <Orb color="rgba(81,177,231,0.05)"  size={350} style={{ top: '45%', right: '15%' }}  delay={4} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <div ref={heroRef} style={{ maxWidth: '960px', margin: '0 auto', padding: '120px 24px 80px', textAlign: 'center' }}>
          <motion.div style={{ y: heroY, opacity: heroOp, scale: heroSc }}>

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(16,185,129,0.1))', border: '1px solid rgba(99,102,241,0.35)', fontSize: '12px', color: 'var(--indigo-light)', marginBottom: '32px', letterSpacing: '0.07em', fontFamily: 'JetBrains Mono, monospace' }}>
              <Award size={13} />
              INDIA'S FIRST AI CERT ROI CALCULATOR
            </motion.div>

            {/* Main headline — opinionated */}
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(3rem, 9vw, 7rem)', lineHeight: 0.9, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '32px' }}>
              YOUR NEXT CERT<br />
              IS EITHER A <GGold>GOLDMINE</GGold><br />
              OR A <GRed>WASTE OF MONEY.</GRed>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
              style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: 'var(--text-2)', maxWidth: '560px', margin: '0 auto 14px', lineHeight: '1.7', fontFamily: 'Inter, sans-serif' }}>
              We tell you which one — in under 2 seconds — before you spend ₹50K and 6 months finding out the hard way.
            </motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              style={{ fontSize: '14px', color: 'var(--text-4)', marginBottom: '44px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}>
              INDIA-SPECIFIC · AI-POWERED · FREE
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
              <motion.button onClick={onEnter} whileHover={{ y: -4, scale: 1.03, boxShadow: '0 24px 48px rgba(81,177,231,0.45)' }} whileTap={{ scale: 0.96 }}
                className="btn-primary" style={{ fontSize: '17px', padding: '18px 40px', display: 'flex', alignItems: 'center', gap: '9px', borderRadius: '14px' }}>
                Is My Cert Worth It? <ArrowRight size={18} />
              </motion.button>
              <motion.button onClick={onEnter} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                className="btn-ghost" style={{ fontSize: '15px', padding: '18px 30px', display: 'flex', alignItems: 'center', gap: '7px', borderRadius: '14px' }}>
                <FileText size={15} /> Find My Cert First
              </motion.button>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>
              Free · No signup · 3 free AI analyses · No "get a premium subscription to see results" nonsense
            </motion.p>
          </motion.div>
        </div>

        {/* ── TICKER ───────────────────────────────────────── */}
        <Ticker />

        {/* ── THE 11PM MOMENT ──────────────────────────────── */}
        <div style={{ maxWidth: '860px', margin: '0 auto 100px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
              WE KNOW EXACTLY<br /><GPurple>WHAT YOU'RE GOING THROUGH</GPurple>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              {
                time: '11:47 PM',
                name: 'Rohan, 27 · Pune',
                color: '#10B981',
                msg: 'scrolling LinkedIn. Ex-classmate just got promoted to Senior Cloud Architect. ₹28L CTC. You\'re at ₹9L. Same college. Same year.',
                thought: '"Should I do AWS? Or is it too late for me?"',
                answer: 'It\'s not too late. AWS SAA break-even for you: 6 months. 5-year gain: ₹14.2L.',
              },
              {
                time: '11:12 PM',
                name: 'Sneha, 31 · Bangalore',
                color: '#F59E0B',
                msg: 'ops manager for 6 years. wants to move into data. every job posting says "3 years experience in data science required."',
                thought: '"Is the switch even possible without going back to college?"',
                answer: 'Google Data Analytics + 2 projects. 5 months. No MBA needed.',
              },
              {
                time: '12:03 AM',
                name: 'Arjun, 22 · Fresh grad',
                color: '#818CF8',
                msg: 'opened 3 cert comparison articles. all recommend AWS. all are written by Americans. all show salary in USD.',
                thought: '"Which cert actually gets me placed in India?"',
                answer: 'Student mode. India-specific. No salary field required.',
              },
            ].map((card, i) => (
              <TiltCard key={i} glowColor={card.color} intensity={8}>
                <div onClick={onEnter} style={{ padding: '26px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-4)', background: 'var(--bg)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)' }}>{card.time}</span>
                    <span style={{ fontSize: '11px', color: card.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: '700' }}>{card.name}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', marginBottom: '14px', fontFamily: 'Inter, sans-serif' }}>{card.msg}</p>
                  <div style={{ padding: '10px 14px', borderRadius: '10px', background: `${card.color}0c`, border: `1px solid ${card.color}22`, marginBottom: '14px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif', fontStyle: 'italic' }}>{card.thought}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: card.color, marginTop: 5, flexShrink: 0 }} />
                    <p style={{ fontSize: '13px', color: card.color, fontWeight: '600', fontFamily: 'Plus Jakarta Sans, sans-serif', margin: 0 }}>{card.answer}</p>
                  </div>
                  <motion.div whileHover={{ x: 5 }} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: card.color, fontSize: '12px', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: '16px' }}>
                    That's me tonight <ArrowRight size={12} />
                  </motion.div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* ── MONEY BURNING + BENTO ─────────────────────────── */}
        <div style={{ maxWidth: '1060px', margin: '0 auto 100px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.02em' }}>
              THE COST OF <GRed>DOING NOTHING</GRed>
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>Every month you wait on the wrong decision costs real money</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>

            {/* Money burning */}
            <TiltCard glowColor="#EF4444" style={{ gridColumn: '1 / 2' }}>
              <div style={{ padding: '28px' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>REAL-TIME COST OF INACTION</div>
                <MoneyBurning />
                <p style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif', marginTop: '16px', lineHeight: '1.6' }}>
                  The average certified professional earns <strong style={{ color: 'var(--text)' }}>₹3.2L more per year</strong> than uncertified peers in the same role.
                </p>
              </div>
            </TiltCard>

            {/* ROI Calculator card */}
            <TiltCard glowColor="#6366F1" style={{ gridColumn: '2 / 4' }}>
              <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'flex-start' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={22} color="#6366F1" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '1.5rem', color: 'var(--text)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                      <GPurple>ROI Calculator</GPurple>
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>Not "career growth." Actual rupees.</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: '1.7', fontFamily: 'Inter, sans-serif', marginBottom: '20px' }}>
                  Enter your salary. Pick your cert. We calculate <strong style={{ color: 'var(--text)' }}>break-even date, 5-year gain, monthly delta</strong> — anchored to things you understand like "₹9.9L = Honda City down payment" not abstract percentages.
                </p>
                {/* Sample output */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { label: 'Break-even', value: '6 months', color: '#F59E0B' },
                    { label: '5-yr gain',  value: '₹14.2L',   color: '#10B981' },
                    { label: 'Monthly +',  value: '₹23,600',  color: '#51B1E7' },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: '12px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>{s.label}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', fontWeight: '700', color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <motion.button onClick={onEnter} whileHover={{ x: 4 }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#818CF8', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Calculate mine <ChevronRight size={16} />
                </motion.button>
              </div>
            </TiltCard>

            {/* Resume AI */}
            <TiltCard glowColor="#10B981" style={{ gridColumn: '1 / 3' }}>
              <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Brain size={22} color="#10B981" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '1.5rem', color: 'var(--text)', marginBottom: '4px' }}>
                      <GGreen>Resume AI Analysis</GGreen>
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>Reads your actual background. Not a generic quiz.</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: '1.7', fontFamily: 'Inter, sans-serif', marginBottom: '18px' }}>
                  Upload your resume. AI finds your skill gaps, matches them to India's 2026 job market, and gives you a <strong style={{ color: 'var(--text)' }}>personalised cert roadmap</strong> — not "everyone should do AWS."
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {['Reads your domain', 'Detects your city', 'Ranks by YOUR salary', 'Gives a first step'].map((tag, i) => (
                    <span key={i} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981', fontFamily: 'JetBrains Mono, monospace' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </TiltCard>

            {/* Heatmap */}
            <TiltCard glowColor="#F59E0B">
              <div style={{ padding: '28px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Map size={20} color="#F59E0B" />
                </div>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '1.2rem', color: 'var(--text)', marginBottom: '6px' }}>
                  <GGold>City Demand</GGold>
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.6', fontFamily: 'Inter, sans-serif', marginBottom: '16px' }}>
                  Is this cert hot in Bangalore? Saturated in Pune? 8 cities × 8 domains.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                  {[0.9,0.6,0.3,0.8,0.7,0.4,0.95,0.5,0.2,0.85,0.6,0.4].map((v, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                      style={{ height: '16px', borderRadius: '3px', background: `rgba(245,158,11,${v})` }} />
                  ))}
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* ── WHAT MAKES US DIFFERENT ───────────────────────── */}
        <div style={{ maxWidth: '860px', margin: '0 auto 100px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
              EVERY OTHER SITE IS <GRed>LYING TO YOU</GRed>
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-3)', maxWidth: '560px', margin: '0 auto', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
              They show you US salary data and call it "market research." They recommend the cert that pays them affiliate commission. They don't know what Naukri looks like today in Hyderabad.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
            {[
              {
                bad: '❌ Generic cert ranking articles',
                good: '✅ Your cert, your salary, your city',
                desc: 'We calculate ROI for YOUR specific numbers. Not "AWS is good for cloud engineers."',
                color: '#10B981',
              },
              {
                bad: '❌ "Upskill for career growth"',
                good: '✅ Break-even: 6 months. Gain: ₹14.2L.',
                desc: 'Concrete rupee amounts. Anchored to things you understand. No vague career advice.',
                color: '#6366F1',
              },
              {
                bad: '❌ US salary data dressed up as India data',
                good: '✅ Naukri + AmbitionBox + LinkedIn India',
                desc: 'Every number comes from actual Indian job market data. Not converted from dollars.',
                color: '#F59E0B',
              },
              {
                bad: '❌ Same advice for everyone',
                good: '✅ AI reads YOUR resume',
                desc: 'A data analyst and a DevOps engineer need completely different certs. We know the difference.',
                color: '#51B1E7',
              },
            ].map((item, i) => (
              <TiltCard key={i} glowColor={item.color} intensity={7}>
                <div style={{ padding: '24px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif', marginBottom: '8px', textDecoration: 'line-through' }}>{item.bad}</div>
                  <div style={{ fontSize: '15px', color: item.color, fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '10px' }}>{item.good}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif', lineHeight: '1.65' }}>{item.desc}</div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* ── MODES ────────────────────────────────────────── */}
        <div style={{ maxWidth: '720px', margin: '0 auto 100px', padding: '0 24px' }}>
          <NeonCard color="#6366F1">
            <div style={{ padding: '44px 36px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>Adapts to who you are</div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '2.2rem', color: 'var(--text)', marginBottom: '28px', letterSpacing: '-0.02em' }}>
                <GPurple>THREE MODES.</GPurple> ONE TOOL.
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '32px' }}>
                {[
                  { icon: GraduationCap, color: '#818CF8', label: 'Student',      sub: 'No job yet',       desc: 'Path to ₹4.8L first offer' },
                  { icon: Repeat,        color: '#F59E0B', label: 'Switcher',     sub: 'Changing fields',  desc: 'Bridge skills gap' },
                  { icon: Briefcase,     color: '#10B981', label: 'Professional', sub: 'Levelling up',     desc: 'Max ROI on next cert' },
                ].map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5, scale: 1.04 }}
                    style={{ padding: '20px 14px', borderRadius: '14px', background: `${m.color}0e`, border: `1px solid ${m.color}28`, cursor: 'pointer' }}>
                    <m.icon size={24} color={m.color} style={{ margin: '0 auto 10px', display: 'block' }} />
                    <div style={{ fontSize: '14px', fontWeight: '700', color: m.color, marginBottom: '2px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{m.label}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-4)', marginBottom: '6px', fontFamily: 'JetBrains Mono, monospace' }}>{m.sub}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif' }}>{m.desc}</div>
                  </motion.div>
                ))}
              </div>
              <motion.button onClick={onEnter} whileHover={{ y: -4, scale: 1.03, boxShadow: '0 20px 44px rgba(81,177,231,0.4)' }} whileTap={{ scale: 0.97 }}
                className="btn-primary" style={{ fontSize: '16px', padding: '16px 38px', display: 'inline-flex', alignItems: 'center', gap: '9px', borderRadius: '14px' }}>
                <Zap size={16} /> Pick My Mode
              </motion.button>
            </div>
          </NeonCard>
        </div>

        {/* ── SOCIAL PROOF ─────────────────────────────────── */}
        <div style={{ maxWidth: '1060px', margin: '0 auto 100px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.02em' }}>
              THEY USED THE DATA. <GGreen>IT WORKED.</GGreen>
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>Numbers don't lie. Neither do these people.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Priya S.',  role: 'Software Engineer → Cloud Architect', city: 'Bangalore', text: 'CertifyROI told me AWS SAA break-even was 8 months on my salary. It was actually 7. Switched companies 7 months in. ₹6L hike.', hike: '+₹6L/yr',      color: '#10B981' },
              { name: 'Rahul M.',  role: 'Ops Manager → Data Analyst',          city: 'Hyderabad', text: 'Was about to do an MBA. Resume AI showed me Google Data Analytics + 2 projects gets me to the same place in 5 months at 1% of the cost.', hike: 'Saved ₹12L', color: '#6366F1' },
              { name: 'Ananya K.', role: 'Fresh Graduate',                       city: 'Pune',      text: 'Every site recommended AWS. Student Mode showed GCP cert had faster placement for freshers in Pune specifically. Got ₹5.2L offer.', hike: '₹5.2L offer', color: '#818CF8' },
            ].map((t, i) => (
              <TiltCard key={i} glowColor={t.color} intensity={7}>
                <div style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={13} color="#F59E0B" fill="#F59E0B" />)}
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.75', marginBottom: '20px', fontStyle: 'italic', fontFamily: 'Inter, sans-serif' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{t.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '2px', fontFamily: 'Inter, sans-serif' }}>{t.role}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>{t.city}</div>
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.3rem', fontWeight: '700', background: `linear-gradient(135deg, ${t.color}, ${t.color}77)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.02em', textAlign: 'right' }}>
                      {t.hike}
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* ── FINAL CTA ─────────────────────────────────────── */}
        <div style={{ maxWidth: '760px', margin: '0 auto 80px', padding: '0 24px' }}>
          <TiltCard glowColor="#6366F1" intensity={5} style={{ textAlign: 'center' }}>
            <div style={{ padding: '60px 44px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎯</div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--text)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                2 MINUTES FROM NOW<br />
                <GPurple>YOU'LL KNOW THE ANSWER</GPurple>
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-3)', marginBottom: '36px', lineHeight: '1.8', fontFamily: 'Inter, sans-serif', maxWidth: '460px', margin: '0 auto 36px' }}>
                Stop reading about certifications. Stop asking in Reddit threads. Stop letting family pressure make the decision.{' '}
                <strong style={{ color: 'var(--text)' }}>Run the numbers.</strong>
              </p>
              <motion.button onClick={onEnter} whileHover={{ y: -5, scale: 1.04, boxShadow: '0 28px 56px rgba(81,177,231,0.45)' }} whileTap={{ scale: 0.96 }}
                className="btn-primary" style={{ fontSize: '18px', padding: '22px 52px', display: 'inline-flex', alignItems: 'center', gap: '10px', borderRadius: '16px' }}>
                Run My Numbers Now <ArrowRight size={20} />
              </motion.button>
              <div style={{ fontSize: '12px', color: 'var(--text-4)', marginTop: '16px', fontFamily: 'Inter, sans-serif' }}>
                Free · No card · No signup · No "upgrade to see results"
              </div>
            </div>
          </TiltCard>
        </div>

        {/* ── FOOTER ───────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', marginBottom: '10px' }}>
            <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #6366F1, #4338CA)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={15} color="white" />
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '19px', letterSpacing: '-0.01em', color: 'var(--text)' }}>
              Certify<G colors={['#6366F1', '#818CF8']}>ROI</G>
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-4)', marginBottom: '6px', fontFamily: 'Inter, sans-serif' }}>
            India's First AI-Powered Cert ROI Calculator · Powered by Groq llama-3.3-70b
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-4)', opacity: 0.5, fontFamily: 'Inter, sans-serif' }}>
            Data: LinkedIn Economic Graph · NASSCOM · AmbitionBox · Naukri · WEF 2026
          </p>
        </div>

      </div>
    </div>
  )
}

export default LandingPage