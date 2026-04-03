import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Repeat, Briefcase, RotateCcw } from 'lucide-react'

const MODES = [
  {
    id: 'student',
    label: 'STUDENT',
    sub: 'First offer · Fresher path',
    color: '#818CF8',
    icon: GraduationCap,
    desc: 'No job yet — get your first ₹4–6L offer',
  },
  {
    id: 'switcher',
    label: 'SWITCHER',
    sub: 'New field · Bridge skills',
    color: '#F59E0B',
    icon: Repeat,
    desc: 'Changing domains — fastest path across',
  },
  {
    id: 'professional',
    label: 'PROFESSIONAL',
    sub: 'Level up · Max ROI',
    color: '#10B981',
    icon: Briefcase,
    desc: 'Already working — maximise your next hike',
  },
]

const FM = "'JetBrains Mono','Commit Mono',monospace"
const FH = "'Plus Jakarta Sans','Bricolage Grotesque',sans-serif"
const FB = "'Inter',sans-serif"

var OFFSET = 'calc(var(--nav-h, 64px) + 88px)'

// ─── ModePill ────────────────────────────────────────────
export function ModePill({ mode, onReset }) {
  var m = MODES.find(function(x) { return x.id === mode })
  if (!m) return null
  var Icon = m.icon
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, x: -10 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '5px 12px 5px 8px', borderRadius: '20px',
        background: m.color + '12', border: '1px solid ' + m.color + '35',
        marginBottom: '20px', cursor: 'default', userSelect: 'none',
      }}
    >
      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: m.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={11} color={m.color} />
      </div>
      <span style={{ fontSize: '11px', fontWeight: '700', color: m.color, fontFamily: FM, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        {m.label}
      </span>
      <button
        onClick={onReset}
        title="Change mode"
        style={{ background: 'none', border: 'none', padding: '0 0 0 4px', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 0.45, transition: 'opacity 0.15s', color: m.color }}
        onMouseEnter={function(e) { e.currentTarget.style.opacity = '1' }}
        onMouseLeave={function(e) { e.currentTarget.style.opacity = '0.45' }}
      >
        <RotateCcw size={11} />
      </button>
    </motion.div>
  )
}

// ─── Main Cinematic Selector ──────────────────────────────
function ModeSelector({ onSelect }) {
  var [hovered, setHovered] = useState(null)
  var [chosen,  setChosen]  = useState(null)
  var [ready,   setReady]   = useState(false)
  var exitTimer = useRef(null)

  // Words stagger in after mount
  useEffect(function() {
    var t = setTimeout(function() { setReady(true) }, 200)
    return function() { clearTimeout(t) }
  }, [])

  function handlePick(id) {
    if (chosen) return
    setChosen(id)
    exitTimer.current = setTimeout(function() { onSelect(id) }, 900)
  }

  useEffect(function() {
    return function() { if (exitTimer.current) clearTimeout(exitTimer.current) }
  }, [])

  var chosenMode = MODES.find(function(m) { return m.id === chosen })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed',
        top: OFFSET,
        left: 0, right: 0, bottom: 0,
        zIndex: 99,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* Atmospheric dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(99,102,241,0.09) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      {/* Color atmosphere behind hovered word */}
      <AnimatePresence>
        {hovered && !chosen ? (
          <motion.div
            key={hovered}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              width: '80vw', height: '80vw',
              maxWidth: '700px', maxHeight: '700px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, ' +
                (MODES.find(function(m) { return m.id === hovered })?.color || '#6366F1') +
                '0F 0%, transparent 65%)',
              pointerEvents: 'none',
            }}
          />
        ) : null}
      </AnimatePresence>

      {/* Flash on selection */}
      <AnimatePresence>
        {chosen && chosenMode ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.18, 0] }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0, background: chosenMode.color, pointerEvents: 'none', zIndex: 1 }}
          />
        ) : null}
      </AnimatePresence>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1100px', padding: '0 clamp(16px, 5vw, 60px)' }}>

        {/* WHO ARE YOU? — eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: ready && !chosen ? 0.45 : 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: FM,
            fontSize: 'clamp(9px, 1.2vw, 12px)',
            color: 'var(--text-4)',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: 'clamp(32px, 6vh, 64px)',
          }}
        >
          WHO ARE YOU?
        </motion.div>

        {/* The three words — horizontal on desktop, vertical on small mobile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(12px, 6vw, 80px)',
          flexWrap: 'wrap',
        }}>
          {MODES.map(function(m, i) {
            var isHovered = hovered === m.id
            var isChosen  = chosen  === m.id
            // When something is hovered/chosen, others vanish dramatically
            var isFaded   = (hovered && hovered !== m.id && !chosen) ||
                            (chosen  && chosen  !== m.id)
            var Icon      = m.icon

            return (
              <AnimatePresence key={m.id} mode="popLayout">
                {ready ? (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 60, scale: 0.75 }}
                    animate={{
                      opacity: isFaded ? (chosen ? 0 : 0.06) : 1,
                      y: 0,
                      scale: isChosen ? 1.05 : isHovered ? 1.02 : 1,
                      x: isChosen ? 0 : 0,
                      filter: isFaded && !chosen ? 'blur(4px)' : 'blur(0px)',
                    }}
                    exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.25 } }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.65,
                      ease: [0.34, 1.1, 0.64, 1],
                      opacity:  { duration: isFaded ? 0.18 : 0.5 },
                      filter:   { duration: 0.2 },
                      scale:    { duration: isChosen ? 0.25 : 0.5 },
                    }}
                    onMouseEnter={function() { if (!chosen) setHovered(m.id) }}
                    onMouseLeave={function() { if (!chosen) setHovered(null) }}
                    onClick={function() { handlePick(m.id) }}
                    style={{
                      cursor: chosen ? 'default' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'clamp(10px, 2vh, 20px)',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTapHighlightColor: 'transparent',
                      padding: 'clamp(10px, 2.5vw, 24px) clamp(8px, 2vw, 20px)',
                      willChange: 'transform, opacity, filter',
                      // Touch target
                      minWidth: '80px',
                    }}
                  >
                    {/* Icon — subtle ring */}
                    <motion.div
                      animate={{
                        background: isHovered || isChosen ? m.color + '18' : 'rgba(255,255,255,0.03)',
                        borderColor: isHovered || isChosen ? m.color + '55' : 'rgba(255,255,255,0.08)',
                        boxShadow: isChosen
                          ? '0 0 48px ' + m.color + '28, 0 0 96px ' + m.color + '10'
                          : isHovered ? '0 0 24px ' + m.color + '18' : 'none',
                      }}
                      transition={{ duration: 0.25 }}
                      style={{
                        width: 'clamp(40px, 7vw, 68px)',
                        height: 'clamp(40px, 7vw, 68px)',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Icon
                        size={typeof window !== 'undefined' ? Math.max(16, Math.min(26, window.innerWidth * 0.022)) : 20}
                        color={isHovered || isChosen ? m.color : 'rgba(255,255,255,0.22)'}
                        style={{ transition: 'color 0.2s' }}
                      />
                    </motion.div>

                    {/* THE WORD — the entire hero */}
                    <motion.div
                      animate={{ color: isHovered || isChosen ? m.color : 'var(--text)' }}
                      transition={{ duration: 0.16 }}
                      style={{
                        fontFamily: FH,
                        fontWeight: '900',
                        // Massive on desktop, sensible on mobile
                        fontSize: 'clamp(28px, 7.5vw, 92px)',
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                        willChange: 'color',
                      }}
                    >
                      {m.label}
                    </motion.div>

                    {/* Sub label + desc — slides in on hover */}
                    <motion.div
                      animate={{
                        opacity: isHovered || isChosen ? 1 : 0,
                        y: isHovered || isChosen ? 0 : 10,
                      }}
                      transition={{ duration: 0.22 }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        pointerEvents: 'none',
                      }}
                    >
                      <div style={{
                        fontFamily: FM,
                        fontSize: 'clamp(9px, 1vw, 11px)',
                        color: m.color,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}>
                        {m.sub}
                      </div>
                      <div style={{
                        fontFamily: FB,
                        fontSize: 'clamp(11px, 1.2vw, 13px)',
                        color: 'var(--text-4)',
                        textAlign: 'center',
                        maxWidth: '180px',
                        lineHeight: 1.5,
                      }}>
                        {m.desc}
                      </div>
                    </motion.div>

                    {/* Underline */}
                    <motion.div
                      animate={{ scaleX: isHovered || isChosen ? 1 : 0, opacity: isHovered || isChosen ? 1 : 0 }}
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        height: '2px', width: '100%',
                        background: 'linear-gradient(90deg, transparent, ' + m.color + ', transparent)',
                        transformOrigin: 'center',
                        borderRadius: '1px',
                        marginTop: '-12px',
                      }}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            )
          })}
        </div>

        {/* Bottom hint */}
        <AnimatePresence>
          {ready && !hovered && !chosen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              style={{
                fontFamily: FB,
                fontSize: 'clamp(12px, 1.3vw, 14px)',
                color: 'var(--text-4)',
                textAlign: 'center',
                marginTop: 'clamp(32px, 6vh, 60px)',
                letterSpacing: '0.01em',
              }}
            >
              pick one — it shapes every recommendation
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Confirmation after pick */}
        <AnimatePresence>
          {chosen && chosenMode ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.4 }}
              style={{
                textAlign: 'center',
                marginTop: 'clamp(28px, 5vh, 52px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              }}
            >
              {/* Simple clean dot spinner — no jitter */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: '12px', height: '12px',
                  borderRadius: '50%',
                  border: '1.5px solid ' + chosenMode.color + '30',
                  borderTopColor: chosenMode.color,
                  flexShrink: 0,
                }}
              />
              <span style={{
                fontFamily: FM,
                fontSize: 'clamp(9px, 1.1vw, 11px)',
                color: chosenMode.color,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}>
                locked in
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}

export default ModeSelector