import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion'
import WaveBg from './WaveBg'

const FM = "'Commit Mono','JetBrains Mono',monospace"
const FB = "'Inter',sans-serif"
const FH = "'Bricolage Grotesque','Plus Jakarta Sans',sans-serif"

// ─── Cert assembly data ──────────────────────────────────────────────────────
const CERTS = [
  { id: 1,  name: 'AWS SAA',   domain: 'Cloud',      color: '#FF9900', x: 12,  y: 18  },
  { id: 2,  name: 'PMP',       domain: 'Management', color: '#6366F1', x: 78,  y: 12  },
  { id: 3,  name: 'CFA L1',    domain: 'Finance',    color: '#10B981', x: 88,  y: 55  },
  { id: 4,  name: 'AZ-900',    domain: 'Cloud',      color: '#0078D4', x: 22,  y: 72  },
  { id: 5,  name: 'GATE',      domain: 'Govt',       color: '#F59E0B', x: 70,  y: 78  },
  { id: 6,  name: 'GCP ACE',   domain: 'Cloud',      color: '#4285F4', x: 50,  y: 8   },
  { id: 7,  name: 'CKA',       domain: 'DevOps',     color: '#326CE5', x: 8,   y: 45  },
  { id: 8,  name: 'NISM',      domain: 'Finance',    color: '#EC4899', x: 92,  y: 30  },
  { id: 9,  name: 'CEH',       domain: 'Security',   color: '#EF4444', x: 38,  y: 85  },
  { id: 10, name: 'PG Diploma',domain: 'Management', color: '#8B5CF6', x: 60,  y: 88  },
]

const STATS = [
  { value: '103', label: 'Certifications tracked' },
  { value: '17',  label: 'Industry domains' },
  { value: '8',   label: 'Indian cities' },
  { value: 'AI',  label: 'Powered analysis' },
]

const WHY_CARDS = [
  {
    icon: '₹',
    title: 'India-specific salary data',
    body: 'Bangalore, Mumbai, Hyderabad, Pune — real hike data from Indian tech professionals. Not US numbers copy-pasted.',
    accent: '#6366F1',
  },
  {
    icon: '⚡',
    title: 'Break-even in months',
    body: 'We calculate exactly when your investment pays back — month by month. No vague "it\'s worth it" advice.',
    accent: '#10B981',
  },
  {
    icon: '◎',
    title: 'Built for your career mode',
    body: 'Student, switcher, or professional — different paths, different certs, different ROI. We personalise all of it.',
    accent: '#51B1E7',
  },
]

// ─── Floating cert badge ─────────────────────────────────────────────────────
function CertBadge({ cert, index, isCenter }) {
  const floatAnim = {
    y: [0, -8, 0],
    transition: {
      y: {
        duration: 3 + index * 0.4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.25,
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, rotate: (index % 2 === 0 ? 15 : -15) }}
      animate={{
        opacity: isCenter ? 0.22 : 1,
        scale: 1,
        rotate: 0,
        y: [0, -(6 + index * 1.2), 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay: 0.4 + index * 0.1 },
        scale: { duration: 0.6, delay: 0.4 + index * 0.1, ease: [0.34, 1.56, 0.64, 1] },
        rotate: { duration: 0.6, delay: 0.4 + index * 0.1 },
        y: {
          duration: 3 + index * 0.4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.8 + index * 0.25,
        },
      }}
      style={{
        position: 'absolute',
        left: cert.x + '%',
        top: cert.y + '%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
      }}
    >
      <div style={{
        padding: '7px 14px',
        borderRadius: '10px',
        background: 'rgba(10,15,28,0.82)',
        border: '1px solid ' + cert.color + '55',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        cursor: 'default',
        whiteSpace: 'nowrap',
      }}>
        <div style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: cert.color,
          boxShadow: '0 0 8px ' + cert.color + '90',
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: '11px',
          fontFamily: FM,
          fontWeight: '700',
          color: 'rgba(255,255,255,0.9)',
          letterSpacing: '0.04em',
        }}>
          {cert.name}
        </span>
        <span style={{
          fontSize: '9px',
          fontFamily: FM,
          color: cert.color,
          opacity: 0.85,
          letterSpacing: '0.06em',
        }}>
          {cert.domain}
        </span>
      </div>
    </motion.div>
  )
}

// ─── Magnetic CTA button ──────────────────────────────────────────────────────
function MagneticCTA({ onClick }) {
  const btnRef = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [ripples, setRipples] = useState([])

  const handleMouseMove = useCallback(function (e) {
    var rect = btnRef.current.getBoundingClientRect()
    var cx = rect.left + rect.width / 2
    var cy = rect.top + rect.height / 2
    var dx = (e.clientX - cx) * 0.38
    var dy = (e.clientY - cy) * 0.38
    setPos({ x: dx, y: dy })
  }, [])

  const handleMouseLeave = useCallback(function () {
    setHovered(false)
    setPos({ x: 0, y: 0 })
  }, [])

  const handleClick = useCallback(function (e) {
    var rect = btnRef.current.getBoundingClientRect()
    var x = e.clientX - rect.left
    var y = e.clientY - rect.top
    var id = Date.now()
    setRipples(function (prev) { return [...prev, { id: id, x: x, y: y }] })
    setTimeout(function () {
      setRipples(function (prev) { return prev.filter(function (r) { return r.id !== id }) })
    }, 700)
    if (onClick) onClick()
  }, [onClick])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '52px', position: 'relative', zIndex: 10 }}>
      {/* Pulsing glow ring behind button */}
      <motion.div
        animate={{
          scale: [1, 1.35, 1],
          opacity: [0.18, 0.06, 0.18],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '220px',
          height: '64px',
          borderRadius: '40px',
          background: 'radial-gradient(ellipse, #6366F1 0%, transparent 70%)',
          filter: 'blur(18px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <motion.button
        ref={btnRef}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={function () { setHovered(true) }}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          position: 'relative',
          padding: '0 40px',
          height: '60px',
          borderRadius: '40px',
          border: 'none',
          background: hovered
            ? 'linear-gradient(135deg, #6366F1, #4338CA, #10B981)'
            : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #4338CA 100%)',
          backgroundSize: '200% 200%',
          color: 'white',
          fontSize: '15px',
          fontFamily: FH,
          fontWeight: '800',
          letterSpacing: '-0.01em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: hovered
            ? '0 8px 40px rgba(99,102,241,0.55), 0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            : '0 4px 24px rgba(99,102,241,0.35), 0 1px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
          transition: 'background 0.3s, box-shadow 0.25s',
          overflow: 'hidden',
          outline: 'none',
          zIndex: 2,
          minWidth: '220px',
          justifyContent: 'center',
        }}
      >
        {/* Ripples */}
        {ripples.map(function (r) {
          return (
            <motion.div
              key={r.id}
              initial={{ scale: 0, opacity: 0.45 }}
              animate={{ scale: 5, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: r.x,
                top: r.y,
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.35)',
                transform: 'translate(-50%,-50%)',
                pointerEvents: 'none',
              }}
            />
          )
        })}

        {/* Shimmer sweep */}
        {hovered && (
          <motion.div
            initial={{ x: '-120%' }}
            animate={{ x: '220%' }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              skewX: '-20deg',
              pointerEvents: 'none',
            }}
          />
        )}

        <span style={{ position: 'relative', zIndex: 1 }}>Find out in 2 minutes</span>
        <motion.span
          animate={hovered ? { x: [0, 5, 0] } : { x: 0 }}
          transition={{ duration: 0.5, repeat: hovered ? Infinity : 0 }}
          style={{ fontSize: '18px', position: 'relative', zIndex: 1 }}
        >
          →
        </motion.span>
      </motion.button>
    </div>
  )
}

// ─── Why card ─────────────────────────────────────────────────────────────────
function WhyCard({ card, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={function () { setHovered(true) }}
      onMouseLeave={function () { setHovered(false) }}
      style={{
        padding: '28px 24px',
        borderRadius: '16px',
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        border: hovered ? '1px solid ' + card.accent + '40' : '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 0.3s ease',
        cursor: 'default',
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)' : 'none',
        flex: 1,
        minWidth: '220px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, ' + card.accent + ', transparent)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s',
      }} />

      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: card.accent + '15',
        border: '1px solid ' + card.accent + '30',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        marginBottom: '16px',
        color: card.accent,
        fontFamily: FM,
        fontWeight: '700',
      }}>
        {card.icon}
      </div>

      <div style={{
        fontSize: '15px',
        fontFamily: FH,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.92)',
        marginBottom: '8px',
        letterSpacing: '-0.02em',
      }}>
        {card.title}
      </div>
      <div style={{
        fontSize: '13px',
        fontFamily: FB,
        color: 'rgba(148,163,184,0.75)',
        lineHeight: '1.65',
      }}>
        {card.body}
      </div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
function LandingPage({ onGetStarted }) {
  const [animPhase, setAnimPhase] = useState('entering')
  const [scrollY, setScrollY] = useState(0)

  useEffect(function () {
    var t = setTimeout(function () { setAnimPhase('floating') }, 1800)
    return function () { clearTimeout(t) }
  }, [])

  useEffect(function () {
    function onScroll() { setScrollY(window.scrollY) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return function () { window.removeEventListener('scroll', onScroll) }
  }, [])

  // Center ROI indicator — the one cert that "assembles" in the middle
  const centerCert = {
    name: 'Your Cert',
    roi: '₹14.2L',
    breakeven: '6 months',
    hike: '+38%',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <WaveBg />

      {/* ── Hero section ─────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 48px',
        position: 'relative',
        textAlign: 'center',
      }}>

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '40px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            marginBottom: '28px',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 8px #10B981',
            }}
          />
          <span style={{
            fontSize: '11px',
            fontFamily: FM,
            color: 'rgba(129,140,248,0.9)',
            letterSpacing: '0.1em',
            fontWeight: '600',
          }}>
            INDIA'S FIRST CERT ROI CALCULATOR
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(32px, 6vw, 72px)',
            fontFamily: FH,
            fontWeight: '900',
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            maxWidth: '820px',
            margin: '0 auto 20px',
            color: 'rgba(255,255,255,0.97)',
            position: 'relative',
          }}
        >
          Your next cert is either a{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6366F1, #10B981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            gold mine
          </span>
          {' '}or a{' '}
          <span style={{
            background: 'linear-gradient(135deg, #EF4444, #F59E0B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            mistake
          </span>
          .
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            fontSize: 'clamp(14px, 2vw, 18px)',
            fontFamily: FB,
            color: 'rgba(148,163,184,0.8)',
            maxWidth: '520px',
            lineHeight: 1.65,
            margin: '0 auto',
          }}
        >
          103 certifications. Real India salary data. AI analysis that tells you
          exactly what to study — and what to skip.
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            style={{
              width: '24px',
              height: '40px',
              borderRadius: '12px',
              border: '1.5px solid rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '6px',
            }}
          >
            <div style={{
              width: '4px',
              height: '8px',
              borderRadius: '2px',
              background: 'rgba(99,102,241,0.7)',
            }} />
          </motion.div>
          <span style={{
            fontSize: '10px',
            fontFamily: FM,
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.1em',
          }}>
            SCROLL
          </span>
        </motion.div>
      </section>

      {/* ── Cert assembly section ─────────────────────────────────────────────── */}
      <section style={{
        padding: '40px 24px 0',
        position: 'relative',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative',
        }}>
          {/* Animation frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              height: 'clamp(320px, 50vw, 520px)',
              borderRadius: '24px',
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          >
            {/* Radial glow */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Grid lines */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(function (p) {
                return (
                  <g key={p}>
                    <line x1={p + '%'} y1="0" x2={p + '%'} y2="100%" stroke="rgba(255,255,255,1)" strokeWidth="1" />
                    <line x1="0" y1={p + '%'} x2="100%" y2={p + '%'} stroke="rgba(255,255,255,1)" strokeWidth="1" />
                  </g>
                )
              })}
            </svg>

            {/* Floating cert badges */}
            {CERTS.map(function (cert, i) {
              return <CertBadge key={cert.id} cert={cert} index={i} isCenter={false} />
            })}

            {/* Center ROI card — the assembled result */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
            >
              <div style={{
                padding: '24px 32px',
                borderRadius: '18px',
                background: 'rgba(8,12,22,0.92)',
                border: '1px solid rgba(99,102,241,0.35)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1), 0 0 80px rgba(99,102,241,0.08)',
                textAlign: 'center',
                minWidth: '200px',
              }}>
                {/* Gradient top bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '20%',
                  right: '20%',
                  height: '2px',
                  borderRadius: '0 0 2px 2px',
                  background: 'linear-gradient(90deg, #6366F1, #10B981)',
                }} />

                <div style={{
                  fontSize: '10px',
                  fontFamily: FM,
                  color: 'rgba(99,102,241,0.8)',
                  letterSpacing: '0.12em',
                  marginBottom: '12px',
                  fontWeight: '700',
                }}>
                  5-YEAR ROI
                </div>

                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    fontSize: 'clamp(36px, 5vw, 52px)',
                    fontFamily: FH,
                    fontWeight: '900',
                    letterSpacing: '-0.04em',
                    background: 'linear-gradient(135deg, #ffffff, #a5b4fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1,
                    marginBottom: '10px',
                  }}
                >
                  ₹14.2L
                </motion.div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Break-even', value: '6 mo', color: '#10B981' },
                    { label: 'Hike', value: '+38%', color: '#6366F1' },
                  ].map(function (stat) {
                    return (
                      <div key={stat.label} style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: stat.color + '15',
                        border: '1px solid ' + stat.color + '30',
                        fontSize: '11px',
                        fontFamily: FM,
                        color: stat.color,
                        fontWeight: '700',
                      }}>
                        {stat.value}
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: '400', marginLeft: '4px' }}>
                          {stat.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Connecting lines from badges to center */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
              {CERTS.slice(0, 6).map(function (cert, i) {
                return (
                  <motion.line
                    key={cert.id}
                    x1={cert.x + '%'}
                    y1={cert.y + '%'}
                    x2="50%"
                    y2="50%"
                    stroke={cert.color}
                    strokeWidth="0.8"
                    strokeDasharray="4 6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.25 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }}
                  />
                )
              })}
            </svg>
          </motion.div>

          {/* Stats bar under animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(16px, 4vw, 48px)',
              marginTop: '32px',
              flexWrap: 'wrap',
              padding: '0 8px',
            }}
          >
            {STATS.map(function (stat, i) {
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{
                    fontSize: 'clamp(22px, 3vw, 32px)',
                    fontFamily: FH,
                    fontWeight: '900',
                    letterSpacing: '-0.03em',
                    background: 'linear-gradient(135deg, #ffffff, #818CF8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1.1,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    fontFamily: FM,
                    color: 'rgba(148,163,184,0.55)',
                    letterSpacing: '0.05em',
                    marginTop: '4px',
                  }}>
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Why section ───────────────────────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(48px, 8vw, 96px) 24px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: '11px',
            fontFamily: FM,
            color: 'rgba(99,102,241,0.6)',
            letterSpacing: '0.12em',
            textAlign: 'center',
            marginBottom: '16px',
            fontWeight: '700',
          }}
        >
          WHY CERTIFYROI
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.5 }}
          style={{
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontFamily: FH,
            fontWeight: '900',
            letterSpacing: '-0.03em',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.93)',
            marginBottom: '48px',
            lineHeight: 1.15,
          }}
        >
          Built for Indian professionals.<br />
          <span style={{ color: 'rgba(148,163,184,0.55)', fontWeight: '700' }}>
            Not recycled Western advice.
          </span>
        </motion.h2>

        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          {WHY_CARDS.map(function (card, i) {
            return <WhyCard key={card.title} card={card} index={i} />
          })}
        </div>

        {/* THE magnetic CTA — single, below the why cards */}
        <MagneticCTA onClick={onGetStarted} />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '12px',
            fontFamily: FM,
            color: 'rgba(148,163,184,0.35)',
            letterSpacing: '0.05em',
          }}
        >
          No signup required · Free · Takes 2 minutes
        </motion.p>
      </section>
    </div>
  )
}

export default LandingPage