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
    desc: 'No job yet — path to your first ₹4–6L offer',
  },
  {
    id: 'switcher',
    label: 'SWITCHER',
    sub: 'Changing fields',
    color: '#F59E0B',
    icon: Repeat,
    desc: 'Moving to a new domain — fastest bridge across',
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

const SWITCH_DOMAINS = [
  { id: 'tech',          label: 'Cloud / Tech',      emoji: '☁️' },
  { id: 'data',          label: 'Data & AI',          emoji: '📊' },
  { id: 'cybersecurity', label: 'Cybersecurity',      emoji: '🔒' },
  { id: 'finance',       label: 'Finance',            emoji: '₹'  },
  { id: 'management',    label: 'Management / PMP',   emoji: '📋' },
  { id: 'marketing',     label: 'Marketing / Digital',emoji: '📱' },
  { id: 'hr',            label: 'HR & People',        emoji: '👥' },
  { id: 'government',    label: 'Govt / PSU',         emoji: '🏛️' },
  { id: 'medical',       label: 'Medical / Pharma',   emoji: '🏥' },
  { id: 'product',       label: 'Product Management', emoji: '🚀' },
]

const FM = "'JetBrains Mono','Commit Mono',monospace"
const FH = "'Plus Jakarta Sans','Bricolage Grotesque',sans-serif"
const FB = "'Inter',sans-serif"

var OFFSET = 'calc(var(--nav-h, 64px) + 88px)'

// ── ModePill ──────────────────────────────────────────────
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

// ── Switcher follow-up ─────────────────────────────────────
function SwitcherFollowUp({ onConfirm, color }) {
  var [selected, setSelected] = useState(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '0 clamp(16px, 5vw, 40px)' }}
    >
      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        style={{
          fontFamily: FM,
          fontSize: 'clamp(10px, 1.3vw, 13px)',
          color: color,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: 'clamp(20px, 4vh, 40px)',
          opacity: 0.85,
        }}
      >
        WHERE ARE YOU SWITCHING TO?
      </motion.div>

      {/* Domain grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))',
        gap: '8px',
        marginBottom: 'clamp(20px, 4vh, 36px)',
      }}>
        {SWITCH_DOMAINS.map(function(d, i) {
          var isSelected = selected === d.id
          return (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={function() { setSelected(d.id) }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '14px 12px',
                borderRadius: '12px',
                border: '1px solid ' + (isSelected ? color + '60' : 'rgba(255,255,255,0.08)'),
                background: isSelected ? color + '18' : 'rgba(255,255,255,0.02)',
                color: isSelected ? color : 'rgba(255,255,255,0.55)',
                fontSize: '13px',
                fontFamily: FH,
                fontWeight: isSelected ? '700' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'border-color 0.18s, background 0.18s, color 0.18s',
                textAlign: 'left',
                boxShadow: isSelected ? '0 0 20px ' + color + '18' : 'none',
              }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0 }}>{d.emoji}</span>
              <span style={{ lineHeight: 1.3, fontSize: 'clamp(11px, 1.3vw, 13px)' }}>{d.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Confirm button — only active when domain selected */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.button
          onClick={function() { if (selected) onConfirm(selected) }}
          animate={{
            opacity: selected ? 1 : 0.3,
            scale: selected ? 1 : 0.97,
          }}
          transition={{ duration: 0.2 }}
          whileHover={selected ? { scale: 1.04, y: -2 } : {}}
          whileTap={selected ? { scale: 0.97 } : {}}
          style={{
            padding: '14px 40px',
            borderRadius: '40px',
            border: 'none',
            background: selected
              ? 'linear-gradient(135deg,' + color + ',#C87A00)'
              : 'rgba(255,255,255,0.06)',
            color: selected ? 'white' : 'rgba(255,255,255,0.3)',
            fontSize: '15px',
            fontFamily: FH,
            fontWeight: '800',
            cursor: selected ? 'pointer' : 'not-allowed',
            letterSpacing: '-0.02em',
            boxShadow: selected ? '0 6px 24px ' + color + '40' : 'none',
            transition: 'background 0.25s, box-shadow 0.25s',
          }}
        >
          {selected ? 'Start switching →' : 'Select a domain first'}
        </motion.button>
      </div>

      {/* Skip option */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ textAlign: 'center', marginTop: '16px' }}
      >
        <button
          onClick={function() { onConfirm(null) }}
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.22)',
            fontSize: '12px', fontFamily: FB,
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          let AI decide from my resume
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────
function ModeSelector({ onSelect }) {
  // phase: 'words' → 'followup' (switcher only) → 'done'
  var [phase,        setPhase]        = useState('words')
  var [hovered,      setHovered]      = useState(null)
  var [chosen,       setChosen]       = useState(null)
  var [wordsVisible, setWordsVisible] = useState(false)
  var exitTimer = useRef(null)

  // Stagger words in
  useEffect(function() {
    var t = setTimeout(function() { setWordsVisible(true) }, 180)
    return function() { clearTimeout(t) }
  }, [])

  function handleWordPick(id) {
    if (chosen) return
    setChosen(id)
    if (id === 'switcher') {
      // Show follow-up after brief pause
      setTimeout(function() { setPhase('followup') }, 700)
    } else {
      exitTimer.current = setTimeout(function() { onSelect(id) }, 900)
    }
  }

  function handleSwitchDomain(domainId) {
    // Pass domain info via localStorage for ResumeAnalyzer to pick up
    if (domainId) {
      try { localStorage.setItem('certifyroi_switch_domain', domainId) } catch(e) {}
    }
    exitTimer.current = setTimeout(function() { onSelect('switcher') }, 700)
    setPhase('done')
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
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(99,102,241,0.09) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      {/* Atmosphere glow behind hovered word */}
      <AnimatePresence>
        {hovered && phase === 'words' && !chosen ? (
          <motion.div
            key={'glow-' + hovered}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              width: '80vw', height: '80vw',
              maxWidth: '720px', maxHeight: '720px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, ' +
                (MODES.find(function(m) { return m.id === hovered })?.color || '#6366F1') +
                '0D 0%, transparent 65%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        ) : null}
      </AnimatePresence>

      {/* Flash on selection */}
      <AnimatePresence>
        {chosen && chosenMode && phase === 'words' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 0.45 }}
            style={{ position: 'absolute', inset: 0, background: chosenMode.color, pointerEvents: 'none', zIndex: 1 }}
          />
        ) : null}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* ── PHASE: words ── */}
        <AnimatePresence mode="wait">
          {phase === 'words' || phase === 'followup' || phase === 'done' ? (
            <motion.div
              key="words-phase"
              style={{ width: '100%', maxWidth: '1100px', padding: '0 clamp(16px,5vw,60px)' }}
              animate={{ opacity: phase !== 'words' ? 0 : 1, y: phase !== 'words' ? -40 : 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 1, 1] }}
            >
              {/* WHO ARE YOU */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: (wordsVisible && phase === 'words' && !chosen) ? 0.42 : 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{
                  fontFamily: FM,
                  fontSize: 'clamp(9px, 1.2vw, 12px)',
                  color: 'var(--text-4)',
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginBottom: 'clamp(28px, 5.5vh, 60px)',
                }}
              >
                WHO ARE YOU?
              </motion.div>

              {/* Three words */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(8px, 5vw, 72px)',
                flexWrap: 'nowrap',
              }}>
                {MODES.map(function(m, i) {
                  var isHovered = hovered === m.id
                  var isChosen  = chosen  === m.id
                  var isFaded   = !!chosen && chosen !== m.id

                  // Only fade others when something hovered (no chosen)
                  var isHoverFaded = !chosen && !!hovered && hovered !== m.id

                  var Icon = m.icon

                  return (
                    <motion.div
                      key={m.id}
                      // Initial stagger in
                      initial={{ opacity: 0, y: 50, scale: 0.78 }}
                      animate={{
                        opacity: wordsVisible
                          ? (isFaded ? 0 : isHoverFaded ? 0.07 : 1)
                          : 0,
                        y: wordsVisible ? 0 : 50,
                        scale: wordsVisible
                          ? (isChosen ? 1.06 : isHovered ? 1.02 : 1)
                          : 0.78,
                        filter: isHoverFaded ? 'blur(3px)' : 'blur(0px)',
                      }}
                      transition={{
                        // Stagger each word
                        opacity:  { duration: isFaded ? 0.3 : isHoverFaded ? 0.18 : 0.55, delay: wordsVisible && !chosen ? i * 0.11 : 0 },
                        y:        { duration: 0.65, delay: i * 0.11, ease: [0.34, 1.1, 0.64, 1] },
                        scale:    { duration: wordsVisible ? (isChosen ? 0.2 : 0.55) : 0.65, delay: i * 0.11 },
                        filter:   { duration: 0.18 },
                      }}
                      onMouseEnter={function() { if (!chosen && phase === 'words') setHovered(m.id) }}
                      onMouseLeave={function() { if (!chosen) setHovered(null) }}
                      onClick={function() { if (!chosen && phase === 'words') handleWordPick(m.id) }}
                      style={{
                        cursor: (chosen || phase !== 'words') ? 'default' : 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'clamp(8px, 1.8vh, 18px)',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        WebkitTapHighlightColor: 'transparent',
                        padding: 'clamp(8px,2vw,20px) clamp(6px,1.5vw,16px)',
                        willChange: 'transform, opacity',
                        // Each word gets equal share of space
                        flex: '1',
                        maxWidth: 'clamp(100px, 30vw, 340px)',
                      }}
                    >
                      {/* Icon ring */}
                      <motion.div
                        animate={{
                          background: isHovered || isChosen ? m.color + '1C' : 'rgba(255,255,255,0.03)',
                          borderColor: isHovered || isChosen ? m.color + '55' : 'rgba(255,255,255,0.07)',
                          boxShadow: isChosen
                            ? '0 0 48px ' + m.color + '25, 0 0 80px ' + m.color + '0C'
                            : isHovered ? '0 0 22px ' + m.color + '15' : 'none',
                        }}
                        transition={{ duration: 0.22 }}
                        style={{
                          width: 'clamp(36px, 6.5vw, 64px)',
                          height: 'clamp(36px, 6.5vw, 64px)',
                          borderRadius: '50%',
                          border: '1px solid rgba(255,255,255,0.07)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          size={typeof window !== 'undefined' ? Math.max(14, Math.min(24, window.innerWidth * 0.018)) : 18}
                          color={isHovered || isChosen ? m.color : 'rgba(255,255,255,0.18)'}
                          style={{ transition: 'color 0.2s' }}
                        />
                      </motion.div>

                      {/* THE WORD — hero */}
                      <motion.div
                        animate={{ color: isHovered || isChosen ? m.color : 'rgba(255,255,255,0.88)' }}
                        transition={{ duration: 0.15 }}
                        style={{
                          fontFamily: FH,
                          fontWeight: '900',
                          fontSize: 'clamp(24px, 6.5vw, 88px)',
                          letterSpacing: '-0.045em',
                          lineHeight: 1,
                          willChange: 'color',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {m.label}
                      </motion.div>

                      {/* Sub + desc on hover */}
                      <motion.div
                        animate={{
                          opacity: isHovered || isChosen ? 1 : 0,
                          y: isHovered || isChosen ? 0 : 8,
                        }}
                        transition={{ duration: 0.2 }}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                          pointerEvents: 'none',
                          minHeight: '36px',
                        }}
                      >
                        <div style={{
                          fontFamily: FM, fontSize: 'clamp(8px, 0.9vw, 11px)',
                          color: m.color, letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                        }}>
                          {m.sub}
                        </div>
                        <div style={{
                          fontFamily: FB, fontSize: 'clamp(10px, 1.1vw, 13px)',
                          color: 'var(--text-4)', textAlign: 'center', maxWidth: '200px', lineHeight: 1.45,
                        }}>
                          {m.desc}
                        </div>
                      </motion.div>

                      {/* Underline sweep */}
                      <motion.div
                        animate={{ scaleX: isHovered || isChosen ? 1 : 0, opacity: isHovered || isChosen ? 1 : 0 }}
                        transition={{ duration: 0.26 }}
                        style={{
                          height: '2px', width: '100%',
                          background: 'linear-gradient(90deg, transparent,' + m.color + ',transparent)',
                          transformOrigin: 'center', borderRadius: '1px', marginTop: '-10px',
                        }}
                      />
                    </motion.div>
                  )
                })}
              </div>

              {/* Bottom hint */}
              <motion.div
                animate={{ opacity: (wordsVisible && !hovered && !chosen && phase === 'words') ? 1 : 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                style={{
                  fontFamily: FB, fontSize: 'clamp(12px, 1.2vw, 14px)',
                  color: 'var(--text-4)', textAlign: 'center',
                  marginTop: 'clamp(28px, 5.5vh, 56px)',
                }}
              >
                pick one — it shapes every recommendation
              </motion.div>

              {/* Locked-in confirmation (non-switcher) */}
              <AnimatePresence>
                {chosen && chosenMode && chosen !== 'switcher' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.35 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '10px', marginTop: 'clamp(24px, 5vh, 48px)',
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1.5px solid ' + chosenMode.color + '30', borderTopColor: chosenMode.color, flexShrink: 0 }}
                    />
                    <span style={{ fontFamily: FM, fontSize: 'clamp(9px,1.1vw,11px)', color: chosenMode.color, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      locked in
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ── PHASE: switcher follow-up ── */}
        <AnimatePresence>
          {phase === 'followup' ? (
            <motion.div
              key="followup-phase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <SwitcherFollowUp
                onConfirm={handleSwitchDomain}
                color={MODES.find(function(m) { return m.id === 'switcher' })?.color || '#F59E0B'}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}

export default ModeSelector