import { motion, useAnimationFrame } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  TrendingUp, FileText, Map, Sparkles, ArrowRight,
  GraduationCap, Repeat, Briefcase, Star, Zap
} from 'lucide-react'

// ── Animated neon border card ─────────────────────────────
const NeonCard = ({ children, style = {}, color = '#6366F1', delay = 0 }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const ref = useRef(null)
  const angleRef = useRef(delay * 60)

  useAnimationFrame((t) => {
    angleRef.current = (delay * 60 + t * 0.04) % 360
    const angle = angleRef.current * (Math.PI / 180)
    const r = 55
    setPos({
      x: 50 + r * Math.cos(angle),
      y: 50 + r * Math.sin(angle),
    })
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      style={{
        position: 'relative',
        borderRadius: '16px',
        padding: '1.5px',
        background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${color}cc 0%, ${color}44 30%, transparent 65%)`,
        cursor: 'pointer',
        transition: 'box-shadow 0.3s',
        ...style,
      }}
    >
      {/* Glow behind card */}
      <div style={{
        position: 'absolute', inset: '-1px', borderRadius: '17px',
        background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${color}22 0%, transparent 60%)`,
        filter: 'blur(8px)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      {/* Inner card */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'var(--glass-bg)',
        borderRadius: '15px',
        height: '100%',
      }}>
        {children}
      </div>
    </motion.div>
  )
}

// ── Static glass card ─────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
    style={{
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--glass-border)',
      borderRadius: '14px',
      ...style,
    }}
  >
    {children}
  </motion.div>
)

const TESTIMONIALS = [
  { name: 'Priya S.',  role: 'Software Engineer → Cloud Architect', city: 'Bangalore', text: 'Got AWS cert after this told me 8-month breakeven. Switched jobs 7 months later. ₹6L hike.', hike: '+₹6L',            color: '#10B981' },
  { name: 'Rahul M.',  role: 'Ops Manager → Data Analyst',          city: 'Hyderabad', text: 'Career switcher. Resume AI told me exactly which cert bridges ops to data. First offer in 5 months.', hike: '₹4.8L first', color: '#6366F1' },
  { name: 'Ananya K.', role: 'Fresh Graduate',                       city: 'Pune',      text: 'Student mode showed me GCP cert was faster to first offer than AWS for freshers. Got placed at ₹5.2L.', hike: '+₹5.2L',   color: '#818CF8' },
]

const FEATURES = [
  { icon: TrendingUp, color: '#6366F1', title: 'ROI Calculator',     desc: 'Sliders for salary, cert cost, hike. Live break-even, 5-year gain, and real-world context like "covers 18 months of rent."' },
  { icon: FileText,   color: '#10B981', title: 'Resume AI Analysis', desc: 'Paste your resume. AI identifies skill gaps and recommends your top 3 certs — with one clear Primary Move and a "do this week" action.' },
  { icon: Map,        color: '#F59E0B', title: 'City Demand Heatmap', desc: 'See which certifications are hottest across Bangalore, Hyderabad, Pune, Mumbai, Delhi and more.' },
]

const MODES = [
  { icon: GraduationCap, color: '#818CF8', label: 'Student',      desc: 'Path to first ₹4.8L offer'   },
  { icon: Repeat,        color: '#F59E0B', label: 'Switcher',     desc: 'Bridge to your new field'     },
  { icon: Briefcase,     color: '#10B981', label: 'Professional', desc: 'Max ROI on next cert'         },
]

const STATS = [
  { value: '22+',   label: 'Certifications tracked'     },
  { value: '8',     label: 'Indian cities mapped'        },
  { value: '₹4.8L', label: 'Avg fresher first offer'    },
  { value: '<2s',   label: 'AI analysis speed'           },
]

const LandingPage = ({ onEnter }) => (
  <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden', transition: 'background 0.3s ease' }}>

    {/* Ambient glows */}
    <div style={{ position: 'fixed', top: '-10%', left: '20%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
    <div style={{ position: 'fixed', bottom: '0', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ── HERO ───────────────────────────────────────── */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '110px 24px 60px', textAlign: 'center' }}>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 16px', borderRadius: '20px', background: 'var(--indigo-dim)', border: '1px solid var(--border-accent)', fontSize: '12px', color: 'var(--indigo-light)', marginBottom: '28px', letterSpacing: '0.06em' }}
        >
          <Sparkles size={12} />
          INDIA TECH · DATA LAST UPDATED MARCH 2026
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(3rem, 8vw, 6.5rem)', lineHeight: 0.95, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '24px' }}
        >
          STOP GUESSING.<br />
          <span style={{ color: 'var(--indigo)' }}>KNOW YOUR</span><br />
          CERT ROI.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: 'var(--text-2)', maxWidth: '520px', margin: '0 auto 16px', lineHeight: '1.75' }}
        >
          The career anxiety question every Indian tech professional asks at 11pm —
          <strong style={{ color: 'var(--text)' }}> "Am I falling behind?"</strong>
          <br />We answer it with data, not guesswork.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: '14px', color: 'var(--text-4)', marginBottom: '40px' }}
        >
          Break-even calculator · Resume AI · City demand heatmap · Student mode
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}
        >
          <motion.button
            onClick={onEnter}
            whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="btn-primary"
            style={{ fontSize: '16px', padding: '16px 36px', display: 'flex', alignItems: 'center', gap: '9px' }}
          >
            Calculate My Cert ROI <ArrowRight size={17} />
          </motion.button>

          <motion.button
            onClick={onEnter}
            whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
            className="btn-ghost"
            style={{ fontSize: '15px', padding: '16px 28px', display: 'flex', alignItems: 'center', gap: '7px' }}
          >
            <FileText size={15} /> Analyse My Resume
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ fontSize: '12px', color: 'var(--text-4)' }}
        >
          Free · No signup required · 3 free AI analyses
        </motion.p>
      </div>

      {/* ── STATS BAR ──────────────────────────────────── */}
      <div style={{ maxWidth: '800px', margin: '0 auto 80px', padding: '0 24px' }}>
        <NeonCard color="#6366F1" delay={0}>
          <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', textAlign: 'center' }}>
            {STATS.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', color: 'var(--indigo)', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </NeonCard>
      </div>

      {/* ── WHO IS THIS FOR ───────────────────────────── */}
      <div style={{ maxWidth: '900px', margin: '0 auto 80px', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            BUILT FOR THREE PEOPLE
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-4)' }}>Pick the one that's you at 11pm</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            { icon: '😰', color: '#10B981', label: 'The Anxious 26-year-old', scenario: '3 years in. Salary is okay. LinkedIn shows people earning 2x.', question: '"Am I falling behind?"',    answer: 'ROI Calculator shows exactly what one cert does to your 5-year trajectory.' },
            { icon: '🔄', color: '#F59E0B', label: 'The Career Switcher',     scenario: 'Mid-30s. Fell into ops/finance. Wants to move into data or product.', question: '"Is the switch possible?"',  answer: 'Resume AI maps your skills to cert bridges. No generic blog posts.' },
            { icon: '🎓', color: '#818CF8', label: 'The Fresh Graduate',      scenario: 'No job yet. Every site shows salary fields that don\'t apply.',       question: '"What do I do first?"',    answer: 'Student Mode shows time to first offer and ₹4.8L path — no salary required.' },
          ].map((card, i) => (
            <NeonCard key={i} color={card.color} delay={i * 0.3} style={{ height: '100%' }}>
              <div onClick={onEnter} style={{ padding: '24px', height: '100%' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{card.icon}</div>
                <div style={{ fontSize: '12px', color: card.color, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{card.label}</div>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '10px', lineHeight: '1.6' }}>{card.scenario}</p>
                <p style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '600', marginBottom: '10px', fontStyle: 'italic' }}>{card.question}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.6' }}>{card.answer}</p>
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '5px', color: card.color, fontSize: '13px', fontWeight: '600' }}>
                  This is me <ArrowRight size={13} />
                </div>
              </div>
            </NeonCard>
          ))}
        </div>
      </div>

      {/* ── FEATURES ───────────────────────────────────── */}
      <div style={{ maxWidth: '900px', margin: '0 auto 80px', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            THREE TOOLS. ONE DECISION.
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-4)' }}>Everything you need to stop overthinking and start certifying</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {FEATURES.map((f, i) => (
            <NeonCard key={i} color={f.color} delay={i * 0.25}>
              <div style={{ padding: '24px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${f.color}18`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <f.icon size={20} color={f.color} />
                </div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '8px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7' }}>{f.desc}</p>
              </div>
            </NeonCard>
          ))}
        </div>
      </div>

      {/* ── MODES ──────────────────────────────────────── */}
      <div style={{ maxWidth: '700px', margin: '0 auto 80px', padding: '0 24px' }}>
        <NeonCard color="#6366F1" delay={0}>
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Adapts to you</div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '2rem', color: 'var(--text)', marginBottom: '24px', letterSpacing: '-0.02em' }}>THREE MODES</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
              {MODES.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{ padding: '16px 12px', borderRadius: '12px', background: `${m.color}10`, border: `1px solid ${m.color}25`, textAlign: 'center' }}>
                  <m.icon size={20} color={m.color} style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '13px', fontWeight: '700', color: m.color, marginBottom: '4px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{m.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-4)' }}>{m.desc}</div>
                </motion.div>
              ))}
            </div>
            <motion.button
              onClick={onEnter}
              whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="btn-primary"
              style={{ fontSize: '15px', padding: '14px 32px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Zap size={15} /> Get Started Free
            </motion.button>
          </div>
        </NeonCard>
      </div>

      {/* ── SOCIAL PROOF ───────────────────────────────── */}
      <div style={{ maxWidth: '900px', margin: '0 auto 80px', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            REAL DECISIONS. REAL RESULTS.
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-4)' }}>From professionals who used CertifyROI to make the call</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {TESTIMONIALS.map((t, i) => (
            <NeonCard key={i} color={t.color} delay={i * 0.2}>
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={12} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.7', marginBottom: '16px', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '2px' }}>{t.role}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-4)' }}>{t.city}</div>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.3rem', color: t.color, letterSpacing: '-0.02em', textShadow: `0 0 12px ${t.color}60` }}>
                    {t.hike}
                  </div>
                </div>
              </div>
            </NeonCard>
          ))}
        </div>
      </div>

      {/* ── FINAL CTA ──────────────────────────────────── */}
      <div style={{ maxWidth: '700px', margin: '0 auto 60px', padding: '0 24px' }}>
        <NeonCard color="#6366F1" delay={0}>
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚀</div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
              EVERY MONTH YOU WAIT<br />
              <span style={{ color: 'var(--indigo)' }}>IS MONEY LEFT ON THE TABLE</span>
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '32px', lineHeight: '1.7' }}>
              The average Indian tech professional with one strategic certification earns ₹3.2L more per year.<br />
              Find out your number in 2 minutes.
            </p>
            <motion.button
              onClick={onEnter}
              whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="btn-primary"
              style={{ fontSize: '17px', padding: '18px 44px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
            >
              Calculate My ROI Now <ArrowRight size={18} />
            </motion.button>
            <div style={{ fontSize: '12px', color: 'var(--text-4)', marginTop: '14px' }}>
              Free · No signup · 3 free AI analyses · Results in 2 seconds
            </div>
          </div>
        </NeonCard>
      </div>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, var(--indigo), #4338CA)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={14} color="white" />
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '18px', color: 'var(--text)', letterSpacing: '-0.01em' }}>
            Certify<span style={{ color: 'var(--indigo)' }}>ROI</span>
          </span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-4)', marginBottom: '6px' }}>
          Powered by Advanced AI | Built for India's Tech Professionals
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-4)', opacity: 0.5 }}>
          Data: LinkedIn Economic Graph · NASSCOM · AmbitionBox · Naukri · WEF 2026
        </p>
      </div>

    </div>
  </div>
)

export default LandingPage