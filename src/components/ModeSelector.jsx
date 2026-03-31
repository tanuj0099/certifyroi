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
const FH = "'Plus Jakarta Sans','Bricolage Grotesque',sans-serif"
const FB = "'Inter',sans-serif"

// NAV_H(64) + TABS_H(88) = 152 — mode selector sits below both tab rows
// This way the tabs remain fully visible and clickable above the selector
var OFFSET = 'calc(var(--nav-h, 64px) + 88px)'

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

  // Stagger: question label appears first, then words fly in
  useEffect(function() {
    var t = setTimeout(function() { setPhase('words') }, 500)
    return function() { clearTimeout(t) }
  }, [])

  function handlePick(id) {
    if (chosen) return
    setChosen(id)
    setPhase('zoom')
    zoomTimeout.current = setTimeout(function() {
      onSelect(id)
    }, 820)
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
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.3 }}
      style={{
        // Sits BELOW the navbar + tab rows so tabs remain visible
        position: 'fixed',
        top: OFFSET,
        left: 0,
        right: 0,
        bottom: 0,
        // zIndex 99 — navbar is 100, so navbar tabs float above this
        zIndex: 99,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* Dot grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Radial glow that follows hovered word */}
      <AnimatePresence>
        {hovered && !chosen ? (
          <motion.div
            key={hovered}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              width: '70vw',
              height: '70vw',
              maxWidth: '600px',
              maxHeight: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, ' +
                ((MODES.find(function(m) { return m.id === hovered }) || {}).color || '#6366F1') +
                '14 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        ) : null}
      </AnimatePresence>

      {/* Full-screen color flash on selection */}
      <AnimatePresence>
        {chosen && chosenMode ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.14, 0] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
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

      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: '0 clamp(16px, 5vw, 48px)',
        width: '100%',
        maxWidth: '1000px',
      }}>

        {/* WHO ARE YOU? */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: phase === 'zoom' ? 0 : phase === 'question' ? 0 : 0.7,
            y: 0,
          }}
          transition={{ duration: 0.5, delay: phase === 'words' ? 0 : 0 }}
          style={{
            fontFamily: FM,
            fontSize: 'clamp(10px, 1.4vw, 13px)',
            color: 'var(--text-4)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            marginBottom: 'clamp(24px, 5vh, 52px)',
          }}
        >
          WHO ARE YOU?
        </motion.div>

        {/* Three words */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(16px, 5vw, 80px)',
          flexWrap: 'wrap',
        }}>
          {MODES.map(function(m, i) {
            var isHovered = hovered === m.id
            var isChosen  = chosen  === m.id
            var isFaded   = (hovered && hovered !== m.id && !chosen) ||
                            (chosen  && chosen  !== m.id)
            var Icon      = m.icon

            // Estimate icon size from viewport — safe for mobile
            var iconSize = typeof window !== 'undefined'
              ? Math.max(18, Math.min(28, window.innerWidth * 0.025))
              : 22

            return (
              <AnimatePresence key={m.id} mode="popLayout">
                {phase !== 'question' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 48, scale: 0.8 }}
                    animate={{
                      opacity: isFaded ? (chosen ? 0 : 0.1) : 1,
                      y: 0,
                      scale: isChosen ? 1.1 : isHovered ? 1.035 : 1,
                      filter: isFaded && !chosen ? 'blur(3px)' : 'blur(0px)',
                    }}
                    exit={{ opacity: 0, y: -16, scale: 0.88, transition: { duration: 0.3 } }}
                    transition={{
                      delay: i * 0.11,
                      duration: 0.6,
                      ease: [0.34, 1.2, 0.64, 1],
                      opacity:  { duration: isFaded ? 0.2 : 0.55 },
                      filter:   { duration: 0.25 },
                      scale:    { duration: isChosen ? 0.3 : 0.5 },
                    }}
                    onMouseEnter={function() { if (!chosen) setHovered(m.id) }}
                    onMouseLeave={function() { if (!chosen) setHovered(null) }}
                    onTouchStart={function() { if (!chosen) setHovered(m.id) }}
                    onClick={function() { handlePick(m.id) }}
                    style={{
                      cursor: chosen ? 'default' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'clamp(8px, 1.8vw, 16px)',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTapHighlightColor: 'transparent',
                      willChange: 'transform, opacity, filter',
                      padding: 'clamp(8px,2vw,20px)',
                    }}
                  >
                    {/* Icon ring */}
                    <motion.div
                      animate={{
                        background: isHovered || isChosen
                          ? m.color + '1A'
                          : 'rgba(255,255,255,0.04)',
                        borderColor: isHovered || isChosen
                          ? m.color + '60'
                          : 'rgba(255,255,255,0.1)',
                        boxShadow: isChosen
                          ? '0 0 40px ' + m.color + '30'
                          : isHovered
                          ? '0 0 20px ' + m.color + '20'
                          : 'none',
                      }}
                      transition={{ duration: 0.22 }}
                      style={{
                        width:  'clamp(44px, 8vw, 76px)',
                        height: 'clamp(44px, 8vw, 76px)',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.22s, border-color 0.22s, box-shadow 0.22s',
                      }}
                    >
                      <Icon
                        size={iconSize}
                        color={isHovered || isChosen ? m.color : 'rgba(255,255,255,0.3)'}
                        style={{ transition: 'color 0.2s' }}
                      />
                    </motion.div>

                    {/* The hero word */}
                    <motion.div
                      animate={{ color: isHovered || isChosen ? m.color : 'var(--text)' }}
                      transition={{ duration: 0.18 }}
                      style={{
                        fontFamily: FH,
                        fontWeight: '900',
                        fontSize: 'clamp(22px, 5.5vw, 76px)',
                        letterSpacing: '-0.035em',
                        lineHeight: 1,
                        willChange: 'color',
                      }}
                    >
                      {m.label}
                    </motion.div>

                    {/* Sub label — appears on hover/chosen */}
                    <motion.div
                      animate={{
                        opacity: isHovered || isChosen ? 1 : 0,
                        y: isHovered || isChosen ? 0 : 8,
                      }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontFamily: FM,
                        fontSize: 'clamp(9px, 1.1vw, 12px)',
                        color: m.color,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        marginTop: '-4px',
                      }}
                    >
                      {m.sub}
                    </motion.div>

                    {/* Underline sweep */}
                    <motion.div
                      animate={{
                        scaleX: isHovered || isChosen ? 1 : 0,
                        opacity: isHovered || isChosen ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        height: '2px',
                        width: '100%',
                        background: 'linear-gradient(90deg, transparent, ' + m.color + ', transparent)',
                        borderRadius: '1px',
                        transformOrigin: 'center',
                        marginTop: '-8px',
                      }}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            )
          })}
        </div>

        {/* Hint */}
        <AnimatePresence>
          {phase === 'words' && !hovered && !chosen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              style={{
                fontFamily: FB,
                fontSize: 'clamp(12px, 1.4vw, 14px)',
                color: 'var(--text-4)',
                marginTop: 'clamp(28px, 5vh, 56px)',
                letterSpacing: '0.01em',
              }}
            >
              pick one — it shapes everything
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Locked-in confirmation */}
        <AnimatePresence>
          {chosen && chosenMode ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              style={{
                fontFamily: FM,
                fontSize: 'clamp(10px, 1.3vw, 12px)',
                color: chosenMode.color,
                marginTop: 'clamp(20px, 4vh, 44px)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                style={{
                  width: '14px', height: '14px',
                  borderRadius: '50%',
                  border: '1.5px solid ' + chosenMode.color + '40',
                  borderTopColor: chosenMode.color,
                  flexShrink: 0,
                }}
              />
              locked in · loading your tools
            </motion.div>
          ) : null}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}

export default ModeSelector