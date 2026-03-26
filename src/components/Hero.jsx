import { motion, useAnimationFrame, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { useRef, useState, useCallback } from 'react'
import {
  TrendingUp, FileText, Map, Sparkles, ArrowRight,
  GraduationCap, Repeat, Briefcase, Star, Zap, Award,
  Shield, Clock, Brain, ChevronRight
} from 'lucide-react'

// ── Gradient text ─────────────────────────────────────────
const G = ({ children, colors = ['#51B1E7', '#818CF8', '#10B981'] }) => (
  <span style={{ background: `linear-gradient(135deg, ${colors.join(', ')})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline' }}>{children}</span>
)
const GPurple = ({ children }) => <G colors={['#6366F1', '#818CF8', '#A78BFA']}>{children}</G>
const GGold   = ({ children }) => <G colors={['#F59E0B', '#EF4444']}>{children}</G>
const GGreen  = ({ children }) => <G colors={['#10B981', '#34D399', '#51B1E7']}>{children}</G>
const GBlue   = ({ children }) => <G colors={['#51B1E7', '#6366F1']}>{children}</G>

// ── 3D Tilt Card ──────────────────────────────────────────
const TiltCard = ({ children, style = {}, intensity = 12, glowColor = '#6366F1' }) => {
  const ref = useRef(null)
  const x   = useMotionValue(0)
  const y   = useMotionValue(0)
  const sx  = useSpring(x, { stiffness: 300, damping: 25 })
  const sy  = useSpring(y, { stiffness: 300, damping: 25 })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50, opacity: 0 })

  const onMove = useCallback(e => {
    if (!ref.current) return
    const r  = ref.current.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width  - 0.5
    const ny = (e.clientY - r.top)  / r.height - 0.5
    x.set(ny * -intensity)
    y.set(nx *  intensity)
    setGlowPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, opacity: 1 })
  }, [x, y, intensity])

  const onLeave = useCallback(() => {
    x.set(0); y.set(0)
    setGlowPos(p => ({ ...p, opacity: 0 }))
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: sx, rotateY: sy,
        perspective: 800,
        transformStyle: 'preserve-3d',
        position: 'relative',
        borderRadius: '18px',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'inset 0 1px 0 var(--card-highlight)',
        overflow: 'hidden',
        willChange: 'transform',
        ...style,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      {/* Mouse follow glow */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '18px', pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(circle 200px at ${glowPos.x}% ${glowPos.y}%, ${glowColor}18 0%, transparent 70%)`,
        opacity: glowPos.opacity,
        transition: 'opacity 0.3s',
      }} />
      {/* Shine layer */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '18px', pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(circle 100px at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.04) 0%, transparent 60%)`,
        opacity: glowPos.opacity,
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </motion.div>
  )
}

// ── Animated neon border card ─────────────────────────────
const NeonCard = ({ children, style = {}, color = '#6366F1', delay = 0 }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const angleRef = useRef(delay * 60)
  useAnimationFrame((t) => {
    angleRef.current = (delay * 60 + t * 0.04) % 360
    const angle = angleRef.current * (Math.PI / 180)
    setPos({ x: 50 + 55 * Math.cos(angle), y: 50 + 55 * Math.sin(angle) })
  })
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.01 }}
      style={{ position: 'relative', borderRadius: '16px', padding: '1.5px', background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${color}cc 0%, ${color}44 30%, transparent 65%)`, cursor: 'pointer', ...style }}
    >
      <div style={{ position: 'absolute', inset: '-1px', borderRadius: '17px', background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${color}22 0%, transparent 60%)`, filter: 'blur(8px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, background: 'var(--glass-bg)', borderRadius: '15px', height: '100%' }}>{children}</div>
    </motion.div>
  )
}

// ── Parallax wrapper ──────────────────────────────────────
const Parallax = ({ children, offset = 40, style = {} }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset])
  return (
    <motion.div ref={ref} style={{ y, ...style }}>{children}</motion.div>
  )
}

// ── Floating particle ─────────────────────────────────────
const FloatingOrb = ({ style = {}, color, size = 400, delay = 0 }) => (
  <motion.div
    animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
    transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, pointerEvents: 'none', ...style }}
  />
)

const TESTIMONIALS = [
  { name: 'Priya S.',  role: 'Software Engineer → Cloud Architect', city: 'Bangalore', text: 'Got AWS cert after this told me 8-month breakeven. Switched jobs 7 months later. ₹6L hike.', hike: '+₹6L',       color: '#10B981' },
  { name: 'Rahul M.',  role: 'Ops Manager → Data Analyst',          city: 'Hyderabad', text: 'Career switcher. Resume AI told me exactly which cert bridges ops to data. First offer in 5 months.', hike: '₹4.8L',   color: '#6366F1' },
  { name: 'Ananya K.', role: 'Fresh Graduate',                       city: 'Pune',      text: 'Student mode showed me GCP cert was faster to first offer than AWS for freshers. Got placed at ₹5.2L.', hike: '+₹5.2L', color: '#818CF8' },
]

const LandingPage = ({ onEnter }) => {
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY     = useTransform(heroScroll, [0, 1], [0, 120])
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0])
  const heroScale   = useTransform(heroScroll, [0, 0.6], [1, 0.94])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>

      {/* ── Ambient orbs ─────────────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <FloatingOrb color="rgba(99,102,241,0.07)"  size={700} style={{ top: '-15%', left: '10%' }}  delay={0} />
        <FloatingOrb color="rgba(16,185,129,0.05)"  size={500} style={{ bottom: '5%', right: '5%' }} delay={2} />
        <FloatingOrb color="rgba(81,177,231,0.05)"  size={400} style={{ top: '40%', right: '20%' }}  delay={4} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ───────────────────────────────────────── */}
        <div ref={heroRef} style={{ maxWidth: '960px', margin: '0 auto', padding: '120px 24px 80px', textAlign: 'center', position: 'relative' }}>
          <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}>

            {/* First in India badge */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(16,185,129,0.1))', border: '1px solid rgba(99,102,241,0.35)', fontSize: '12px', color: 'var(--indigo-light)', marginBottom: '14px', letterSpacing: '0.07em', fontFamily: 'JetBrains Mono, monospace' }}>
              <Award size={13} />
              INDIA'S FIRST AI-POWERED CERT ROI CALCULATOR
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', borderRadius: '20px', background: 'var(--indigo-dim)', border: '1px solid var(--border-accent)', fontSize: '11px', color: 'var(--text-4)', marginBottom: '32px', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono, monospace' }}>
              <Sparkles size={11} />
              INDIA TECH · DATA LAST UPDATED MARCH 2026
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(3.2rem, 9vw, 7rem)', lineHeight: 0.92, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '28px' }}>
              STOP GUESSING.<br />
              <GPurple>KNOW YOUR</GPurple><br />
              CERT ROI.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
              style={{ fontSize: 'clamp(15px, 2.5vw, 19px)', color: 'var(--text-2)', maxWidth: '560px', margin: '0 auto 18px', lineHeight: '1.75', fontFamily: 'Inter, sans-serif' }}>
              The question every Indian tech professional asks at 11pm —
              <strong style={{ color: 'var(--text)' }}> "Am I falling behind?"</strong>
              <br />We answer it with <GGreen>data</GGreen>, not guesswork.
            </motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              style={{ fontSize: '14px', color: 'var(--text-4)', marginBottom: '44px', fontFamily: 'Inter, sans-serif' }}>
              Break-even calculator · Resume AI · City demand heatmap · Student mode
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
              <motion.button onClick={onEnter} whileHover={{ y: -4, scale: 1.03, boxShadow: '0 20px 40px rgba(81,177,231,0.4)' }} whileTap={{ scale: 0.96 }}
                className="btn-primary" style={{ fontSize: '16px', padding: '17px 38px', display: 'flex', alignItems: 'center', gap: '9px', borderRadius: '14px' }}>
                Calculate My Cert ROI <ArrowRight size={17} />
              </motion.button>
              <motion.button onClick={onEnter} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                className="btn-ghost" style={{ fontSize: '15px', padding: '17px 30px', display: 'flex', alignItems: 'center', gap: '7px', borderRadius: '14px' }}>
                <FileText size={15} /> Analyse My Resume
              </motion.button>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>
              Free · No signup required · 3 free AI analyses
            </motion.p>
          </motion.div>
        </div>

        {/* ── BENTO GRID ─────────────────────────────────── */}
        <div style={{ maxWidth: '1100px', margin: '0 auto 100px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.02em' }}>
              THREE TOOLS. <GBlue>ONE DECISION.</GBlue>
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>Everything you need to stop overthinking</p>
          </motion.div>

          {/* Bento grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto', gap: '16px' }}>

            {/* Big card — ROI Calculator */}
            <TiltCard glowColor="#6366F1" style={{ gridColumn: '1 / 3', gridRow: '1 / 2', minHeight: '280px' }}>
              <div style={{ padding: '36px' }}>
                <Parallax offset={15} style={{ display: 'inline-block', marginBottom: '20px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={24} color="#6366F1" />
                  </div>
                </Parallax>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '1.6rem', color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                  <GPurple>ROI Calculator</GPurple>
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: '1.7', maxWidth: '420px', fontFamily: 'Inter, sans-serif', marginBottom: '24px' }}>
                  Sliders for salary, cert cost, hike. Live break-even, 5-year gain, Ghost of Inaction chart — with real-world anchors like "covers 18 months of rent."
                </p>
                <motion.button onClick={onEnter} whileHover={{ x: 4 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#818CF8', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Try it now <ChevronRight size={16} />
                </motion.button>
                {/* Mini chart decoration */}
                <div style={{ position: 'absolute', bottom: '24px', right: '32px', display: 'flex', alignItems: 'flex-end', gap: '4px', opacity: 0.3 }}>
                  {[40, 55, 45, 70, 60, 85, 75, 100].map((h, i) => (
                    <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: h * 0.6 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4 }}
                      style={{ width: '6px', background: 'linear-gradient(to top, #6366F1, #818CF8)', borderRadius: '3px' }} />
                  ))}
                </div>
              </div>
            </TiltCard>

            {/* Tall card — AI */}
            <TiltCard glowColor="#10B981" style={{ gridColumn: '3 / 4', gridRow: '1 / 3', minHeight: '580px' }}>
              <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Parallax offset={20} style={{ display: 'inline-block', marginBottom: '20px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain size={24} color="#10B981" />
                  </div>
                </Parallax>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '1.4rem', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.02em' }}>
                  <GGreen>Resume AI</GGreen>
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: '1.7', fontFamily: 'Inter, sans-serif', marginBottom: '24px', flex: 1 }}>
                  Upload your resume. AI reads your skills, identifies gaps, and recommends your top 3 certs with one clear Primary Move.
                </p>
                {/* Mock result cards */}
                {['AWS Solutions Architect', 'Google Data Analytics', 'PMP Certification'].map((cert, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}
                    style={{ padding: '10px 14px', borderRadius: '10px', background: i === 0 ? 'rgba(16,185,129,0.1)' : 'var(--bg)', border: `1px solid ${i === 0 ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: i === 0 ? '#10B981' : 'var(--text-3)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '600' }}>{cert}</span>
                    {i === 0 && <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16,185,129,0.2)', color: '#10B981', fontFamily: 'JetBrains Mono, monospace' }}>★ PRIMARY</span>}
                  </motion.div>
                ))}
                <motion.button onClick={onEnter} whileHover={{ x: 4 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#10B981', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: '16px' }}>
                  Analyse my resume <ChevronRight size={14} />
                </motion.button>
              </div>
            </TiltCard>

            {/* Small card — Heatmap */}
            <TiltCard glowColor="#F59E0B" style={{ gridColumn: '1 / 2', gridRow: '2 / 3', minHeight: '260px' }}>
              <div style={{ padding: '28px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Map size={20} color="#F59E0B" />
                </div>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '1.2rem', color: 'var(--text)', marginBottom: '8px' }}>
                  <GGold>City Heatmap</GGold>
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.6', fontFamily: 'Inter, sans-serif', marginBottom: '18px' }}>
                  8 Indian cities × 8 domains. See demand before you commit.
                </p>
                {/* Mini heatmap */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                  {[0.9,0.6,0.3,0.8,0.7,0.4,0.9,0.5,0.2,0.8,0.6,0.4].map((v, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                      style={{ height: '14px', borderRadius: '3px', background: `rgba(245,158,11,${v})` }} />
                  ))}
                </div>
              </div>
            </TiltCard>

            {/* Small card — Stats */}
            <TiltCard glowColor="#51B1E7" style={{ gridColumn: '2 / 3', gridRow: '2 / 3', minHeight: '260px' }}>
              <div style={{ padding: '28px' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>BY THE NUMBERS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { v: '22+',   l: 'Certs',    c: '#6366F1' },
                    { v: '8',     l: 'Cities',   c: '#10B981' },
                    { v: '₹4.8L', l: 'Avg offer', c: '#F59E0B' },
                    { v: '<2s',   l: 'AI speed',  c: '#51B1E7' },
                  ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: '700', letterSpacing: '-0.03em', background: `linear-gradient(135deg, ${s.c}, ${s.c}88)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.v}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>{s.l}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TiltCard>

          </div>
        </div>

        {/* ── WHO IS THIS FOR ──────────────────────────────── */}
        <div style={{ maxWidth: '1060px', margin: '0 auto 100px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.02em' }}>
              BUILT FOR <GGold>THREE PEOPLE</GGold>
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>Pick the one that's you at 11pm</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { icon: '😰', color: '#10B981', label: 'The Anxious 26-year-old', scenario: '3 years in. Salary is okay. LinkedIn shows people earning 2x.', question: '"Am I falling behind?"',   answer: 'ROI Calculator shows exactly what one cert does to your 5-year trajectory.', glow: '#10B981' },
              { icon: '🔄', color: '#F59E0B', label: 'The Career Switcher',     scenario: 'Mid-30s. Fell into ops/finance. Wants to move into data or product.', question: '"Is the switch possible?"', answer: 'Resume AI maps your skills to cert bridges. No generic blog posts.', glow: '#F59E0B' },
              { icon: '🎓', color: '#818CF8', label: 'The Fresh Graduate',      scenario: "No job yet. Every site shows salary fields that don't apply.", question: '"What do I do first?"',   answer: 'Student Mode shows time to first offer and ₹4.8L path — no salary required.', glow: '#818CF8' },
            ].map((card, i) => (
              <TiltCard key={i} glowColor={card.glow} intensity={8}>
                <div onClick={onEnter} style={{ padding: '28px', cursor: 'pointer' }}>
                  <Parallax offset={10}>
                    <div style={{ fontSize: '2.2rem', marginBottom: '16px' }}>{card.icon}</div>
                  </Parallax>
                  <div style={{ fontSize: '11px', color: card.color, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontFamily: 'JetBrains Mono, monospace' }}>{card.label}</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '12px', lineHeight: '1.65', fontFamily: 'Inter, sans-serif' }}>{card.scenario}</p>
                  <p style={{ fontSize: '15px', color: 'var(--text)', fontWeight: '700', marginBottom: '12px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{card.question}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.65', fontFamily: 'Inter, sans-serif', marginBottom: '20px' }}>{card.answer}</p>
                  <motion.div whileHover={{ x: 6 }} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: card.color, fontSize: '13px', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    This is me <ArrowRight size={13} />
                  </motion.div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* ── WHY DIFFERENT ────────────────────────────────── */}
        <div style={{ maxWidth: '1060px', margin: '0 auto 100px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.02em' }}>
              WHY <G colors={['#51B1E7','#6366F1','#10B981']}>CERTIFYROI</G> IS DIFFERENT
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>Every other site tells you what certs exist. We tell you if they're worth it.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
            {[
              { emoji: '🇮🇳', title: 'India-specific',   desc: 'Naukri, AmbitionBox, LinkedIn data — not US averages', color: '#F59E0B' },
              { emoji: '⚡',  title: 'AI in <2 seconds', desc: 'Groq llama-3.3-70b — world\'s fastest AI inference',    color: '#818CF8' },
              { emoji: '📊',  title: 'Real numbers',      desc: 'Break-even date, 5-year gain, monthly delta',           color: '#10B981' },
              { emoji: '🎯',  title: 'Personalised',      desc: 'Resume AI reads YOUR background. Not generic.',         color: '#51B1E7' },
              { emoji: '🆓',  title: '100% Free',         desc: '3 AI analyses free. No credit card.',                   color: '#6366F1' },
              { emoji: '🔒',  title: 'Private',           desc: 'Resume never stored. Deleted after analysis.',          color: '#EF4444' },
            ].map((item, i) => (
              <TiltCard key={i} glowColor={item.color} intensity={6}>
                <motion.div style={{ padding: '22px' }} whileHover={{ scale: 1 }}>
                  <Parallax offset={8}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{item.emoji}</div>
                  </Parallax>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: item.color, marginBottom: '6px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-4)', lineHeight: '1.6', fontFamily: 'Inter, sans-serif' }}>{item.desc}</div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* ── MODES ────────────────────────────────────────── */}
        <div style={{ maxWidth: '720px', margin: '0 auto 100px', padding: '0 24px' }}>
          <NeonCard color="#6366F1" delay={0}>
            <div style={{ padding: '40px 36px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>Adapts to you</div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '2.2rem', color: 'var(--text)', marginBottom: '28px', letterSpacing: '-0.02em' }}>
                <GPurple>THREE MODES</GPurple>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '32px' }}>
                {[
                  { icon: GraduationCap, color: '#818CF8', label: 'Student',      desc: 'Path to first ₹4.8L offer'  },
                  { icon: Repeat,        color: '#F59E0B', label: 'Switcher',     desc: 'Bridge to your new field'    },
                  { icon: Briefcase,     color: '#10B981', label: 'Professional', desc: 'Max ROI on next cert'        },
                ].map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    style={{ padding: '18px 14px', borderRadius: '14px', background: `${m.color}0e`, border: `1px solid ${m.color}28`, textAlign: 'center', cursor: 'pointer' }}>
                    <m.icon size={22} color={m.color} style={{ margin: '0 auto 10px', display: 'block' }} />
                    <div style={{ fontSize: '14px', fontWeight: '700', color: m.color, marginBottom: '4px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{m.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>{m.desc}</div>
                  </motion.div>
                ))}
              </div>
              <motion.button onClick={onEnter} whileHover={{ y: -3, scale: 1.02, boxShadow: '0 16px 36px rgba(81,177,231,0.35)' }} whileTap={{ scale: 0.97 }}
                className="btn-primary" style={{ fontSize: '15px', padding: '15px 36px', display: 'inline-flex', alignItems: 'center', gap: '9px', borderRadius: '12px' }}>
                <Zap size={16} /> Get Started Free
              </motion.button>
            </div>
          </NeonCard>
        </div>

        {/* ── SOCIAL PROOF ─────────────────────────────────── */}
        <div style={{ maxWidth: '1060px', margin: '0 auto 100px', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.02em' }}>
              REAL DECISIONS. <GGreen>REAL RESULTS.</GGreen>
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>From professionals who used CertifyROI to make the call</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {TESTIMONIALS.map((t, i) => (
              <TiltCard key={i} glowColor={t.color} intensity={7}>
                <div style={{ padding: '26px' }}>
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
                    <Parallax offset={8}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', fontWeight: '700', background: `linear-gradient(135deg, ${t.color}, ${t.color}77)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.02em' }}>
                        {t.hike}
                      </div>
                    </Parallax>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* ── FINAL CTA ─────────────────────────────────────── */}
        <div style={{ maxWidth: '740px', margin: '0 auto 80px', padding: '0 24px' }}>
          <TiltCard glowColor="#6366F1" intensity={6} style={{ textAlign: 'center' }}>
            <div style={{ padding: '56px 40px' }}>
              <Parallax offset={12}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
              </Parallax>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--text)', marginBottom: '14px', letterSpacing: '-0.02em' }}>
                EVERY MONTH YOU WAIT<br />
                <GGold>IS MONEY LEFT ON THE TABLE</GGold>
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-3)', marginBottom: '36px', lineHeight: '1.75', fontFamily: 'Inter, sans-serif' }}>
                The average Indian tech professional with one strategic certification earns{' '}
                <GGreen>₹3.2L more per year.</GGreen><br />
                Find out your number in 2 minutes.
              </p>
              <motion.button onClick={onEnter} whileHover={{ y: -4, scale: 1.03, boxShadow: '0 24px 48px rgba(81,177,231,0.4)' }} whileTap={{ scale: 0.96 }}
                className="btn-primary" style={{ fontSize: '18px', padding: '20px 50px', display: 'inline-flex', alignItems: 'center', gap: '10px', borderRadius: '14px' }}>
                Calculate My ROI Now <ArrowRight size={18} />
              </motion.button>
              <div style={{ fontSize: '12px', color: 'var(--text-4)', marginTop: '16px', fontFamily: 'Inter, sans-serif' }}>
                Free · No signup · 3 free AI analyses · Results in 2 seconds
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
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '19px', letterSpacing: '-0.01em' }}>
              Certify<span style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ROI</span>
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