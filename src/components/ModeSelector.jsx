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
  },
  {
    id: 'switcher',
    label: 'SWITCHER',
    sub: 'New field · Bridge skills',
    color: '#F59E0B',
    icon: Repeat,
  },
  {
    id: 'professional',
    label: 'PROFESSIONAL',
    sub: 'Level up · Max ROI',
    color: '#10B981',
    icon: Briefcase,
  },
]

const FM = "'JetBrains Mono','Commit Mono',monospace"
const FH = "'Plus Jakarta Sans',sans-serif"
const FB = "'Inter',sans-serif"

// ─── Pill shown in tools area after mode is locked ────────────
export function ModePill({ mode, onReset }) {
  var m = MODES.find(function(x) { return x.id === mode })
  if (!m) return null
  var Icon = m.icon
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: -8 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px 5px 8px',
        borderRadius: '20px',
        background: m.color + '12',
        border: '1px solid ' + m.color + '35',
        marginBottom: '20px',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      <div style={{
        width: '20px', height: '20px',
        borderRadius: '50%',
        background: m.color + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={11} color={m.color} />
      </div>
      <span style={{
        fontSize: '11px',
        fontWeight: '700',
        color: m.color,
        fontFamily: FM,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
      }}>
        {m.label}
      </span>
      <button
        onClick={onReset}
        title="Change mode"
        style={{
          background: 'none',
          border: 'none',
          padding: '0 0 0 4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.45,
          transition: 'opacity 0.15s',
          color: m.color,
        }}
        onMouseEnter={function(e) { e.currentTarget.style.opacity = '1' }}
        onMouseLeave={function(e) { e.currentTarget.style.opacity = '0.45' }}
      >
        <RotateCcw size={11} />
      </button>
    </motion.div>
  )
}

// ─── Full cinematic selector ───────────────────────────────────
function ModeSelector({ onSelect }) {
  var [hovered, setHovered] = useState(null)
  var [chosen,  setChosen]  = useState(null)
  var [phase,   setPhase]   = useState('question') // 'question' | 'words' | 'zoom'
  var zoomTimeout           = useRef(null)

  useEffect(function() {
    var t = setTimeout(function() { setPhase('words') }, 700)
    return function() { clearTimeout(t) }
  }, [])

  function handlePick(id) {
    if (chosen) return
    setChosen(id)
    setPhase('zoom')
    zoomTimeout.current = setTimeout(function() {
      onSelect(id)
    }, 900)
  }

  useEffect(function() {
    return function() {
      if (zoomTimeout.current) clearTimeout(zoomTimeout.current)
    }
  }, [])

  var chosenMode = MODES.find(function(m) { return m.id === chosen })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* Subtle dot grid overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(var(--dot-color) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Radial glow behind the active word */}
      <AnimatePresence>
        {hovered && !chosen ? (
          <motion.div
            key={hovered}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, ' + (MODES.find(function(m) { return m.id === hovered }) || {}).color + '12 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        ) : null}
      </AnimatePresence>

      {/* Zoom flash on selection */}
      <AnimatePresence>
        {chosen && chosenMode ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.18, 0] }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              background: chosenMode.color,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        ) : null}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>

        {/* WHO ARE YOU */}
        <AnimatePresence>
          {phase === 'question' || phase === 'words' || phase === 'zoom' ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: phase === 'zoom' ? 0 : 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              style={{
                fontFamily: FM,
                fontSize: 'clamp(11px, 1.5vw, 14px)',
                color: 'var(--text-4)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                marginBottom: 'clamp(28px, 5vw, 56px)',
              }}
            >
              WHO ARE YOU?
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Three words */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(20px, 5vw, 80px)',
          flexWrap: 'wrap',
        }}>
          {MODES.map(function(m, i) {
            var isHovered  = hovered === m.id
            var isChosen   = chosen === m.id
            var isFaded    = (hovered && hovered !== m.id && !chosen) || (chosen && chosen !== m.id)
            var Icon       = m.icon

            return (
              <AnimatePresence key={m.id} mode="popLayout">
                {phase !== 'question' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.85 }}
                    animate={{
                      opacity: isFaded ? (chosen ? 0 : 0.12) : 1,
                      y: 0,
                      scale: isChosen ? 1.12 : isHovered ? 1.04 : 1,
                      filter: isFaded ? 'blur(2px)' : 'blur(0px)',
                    }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{
                      delay: i * 0.12,
                      duration: 0.55,
                      ease: [0.34, 1.2, 0.64, 1],
                      opacity: { duration: isFaded ? 0.25 : 0.55 },
                      filter: { duration: 0.3 },
                    }}
                    onMouseEnter={function() { if (!chosen) setHovered(m.id) }}
                    onMouseLeave={function() { if (!chosen) setHovered(null) }}
                    onClick={function() { handlePick(m.id) }}
                    style={{
                      cursor: chosen ? 'default' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'clamp(10px, 2vw, 18px)',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      willChange: 'transform, opacity, filter',
                    }}
                  >
                    {/* Icon circle */}
                    <motion.div
                      animate={{
                        background: isHovered || isChosen ? m.color + '18' : 'transparent',
                        borderColor: isHovered || isChosen ? m.color + '55' : 'rgba(255,255,255,0.08)',
                        scale: isChosen ? 1.15 : 1,
                      }}
                      transition={{ duration: 0.25 }}
                      style={{
                        width: 'clamp(44px, 7vw, 72px)',
                        height: 'clamp(44px, 7vw, 72px)',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon
                        size={Math.min(28, Math.max(18, window.innerWidth * 0.025))}
                        color={isHovered || isChosen ? m.color : 'var(--text-4)'}
                        style={{ transition: 'color 0.2s' }}
                      />
                    </motion.div>

                    {/* The big word */}
                    <motion.div
                      animate={{ color: isHovered || isChosen ? m.color : 'var(--text)' }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontFamily: FH,
                        fontWeight: '900',
                        fontSize: 'clamp(26px, 6vw, 80px)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                        color: 'var(--text)',
                        willChange: 'color',
                      }}
                    >
                      {m.label}
                    </motion.div>

                    {/* Sub label */}
                    <motion.div
                      animate={{ opacity: isHovered || isChosen ? 1 : 0, y: isHovered || isChosen ? 0 : 6 }}
                      transition={{ duration: 0.22 }}
                      style={{
                        fontFamily: FM,
                        fontSize: 'clamp(10px, 1.2vw, 13px)',
                        color: m.color,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        opacity: 0,
                      }}
                    >
                      {m.sub}
                    </motion.div>

                    {/* Hover underline */}
                    <motion.div
                      animate={{ scaleX: isHovered || isChosen ? 1 : 0, opacity: isHovered || isChosen ? 1 : 0 }}
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        height: '2px',
                        width: '100%',
                        background: 'linear-gradient(90deg, transparent, ' + m.color + ', transparent)',
                        borderRadius: '1px',
                        transformOrigin: 'center',
                        marginTop: '-10px',
                      }}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            )
          })}
        </div>

        {/* Hint text */}
        <AnimatePresence>
          {phase === 'words' && !hovered && !chosen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              style={{
                fontFamily: FB,
                fontSize: 'clamp(12px, 1.5vw, 14px)',
                color: 'var(--text-4)',
                marginTop: 'clamp(32px, 6vw, 64px)',
                letterSpacing: '0.01em',
              }}
            >
              pick one — it shapes everything
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Lock-in confirmation */}
        <AnimatePresence>
          {chosen && chosenMode ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              style={{
                fontFamily: FM,
                fontSize: 'clamp(11px, 1.4vw, 13px)',
                color: chosenMode.color,
                marginTop: 'clamp(24px, 4vw, 48px)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              locked in. loading your tools →
            </motion.div>
          ) : null}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}

export default ModeSelector