import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Repeat, Briefcase, RotateCcw } from 'lucide-react'

const MODES = [
  { id: 'student',      label: 'STUDENT',      sub: 'First offer · Fresher path',  color: '#818CF8', icon: GraduationCap, desc: 'Path to your first ₹4–6L offer' },
  { id: 'switcher',     label: 'SWITCHER',      sub: 'Changing fields',             color: '#F59E0B', icon: Repeat,        desc: 'Moving to a new domain' },
  { id: 'professional', label: 'PROFESSIONAL',  sub: 'Level up · Max ROI',          color: '#10B981', icon: Briefcase,     desc: 'Maximise your next hike' },
]

const SWITCH_DOMAINS = [
  { id: 'tech',          label: 'Cloud / Tech',       emoji: '☁️' },
  { id: 'data',          label: 'Data & AI',           emoji: '📊' },
  { id: 'cybersecurity', label: 'Cybersecurity',       emoji: '🔒' },
  { id: 'finance',       label: 'Finance',             emoji: '₹'  },
  { id: 'management',    label: 'Management / PMP',    emoji: '📋' },
  { id: 'marketing',     label: 'Marketing / Digital', emoji: '📱' },
  { id: 'hr',            label: 'HR & People',         emoji: '👥' },
  { id: 'government',    label: 'Govt / PSU',          emoji: '🏛' },
  { id: 'medical',       label: 'Medical / Pharma',    emoji: '🏥' },
  { id: 'product',       label: 'Product Management',  emoji: '🚀' },
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
        style={{ background: 'none', border: 'none', padding: '0 0 0 4px', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 0.45, transition: 'opacity 0.15s', color: m.color }}
        onMouseEnter={function(e) { e.currentTarget.style.opacity = '1' }}
        onMouseLeave={function(e) { e.currentTarget.style.opacity = '0.45' }}
      >
        <RotateCcw size={11} />
      </button>
    </motion.div>
  )
}

// ── Word row ──────────────────────────────────────────────
function WordRow({ hovered, setHovered, onPick, disabled }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // Responsive gap — tighter on mobile
      gap: 'clamp(4px, 4vw, 64px)',
      width: '100%',
      padding: '0 clamp(12px, 4vw, 48px)',
      flexWrap: 'nowrap',
    }}>
      {MODES.map(function(m, i) {
        var isHovered  = hovered === m.id
        var isOtherHov = hovered && hovered !== m.id
        var Icon       = m.icon

        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 40, scale: 0.82 }}
            animate={{
              opacity: isOtherHov ? 0.07 : 1,
              y: 0,
              scale: isHovered ? 1.04 : 1,
              filter: isOtherHov ? 'blur(2px)' : 'blur(0px)',
            }}
            transition={{
              delay: i * 0.1,
              duration: 0.6,
              ease: [0.34, 1.1, 0.64, 1],
              opacity: { duration: isOtherHov ? 0.15 : 0.5, delay: i * 0.1 },
              filter: { duration: 0.15 },
              scale: { duration: 0.45, delay: i * 0.1 },
            }}
            onMouseEnter={function() { if (!disabled) setHovered(m.id) }}
            onMouseLeave={function() { if (!disabled) setHovered(null) }}
            onClick={function() { if (!disabled) onPick(m.id) }}
            style={{
              cursor: disabled ? 'default' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // Each word takes equal width, never wraps
              flex: '1 1 0',
              minWidth: 0,
              maxWidth: 'clamp(80px, 28vw, 300px)',
              gap: 'clamp(6px, 1.5vh, 14px)',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
              padding: 'clamp(6px, 1.5vw, 16px) clamp(4px, 1vw, 12px)',
            }}
          >
            {/* Icon ring */}
            <motion.div
              animate={{
                background: isHovered ? m.color + '1C' : 'rgba(255,255,255,0.03)',
                borderColor: isHovered ? m.color + '55' : 'rgba(255,255,255,0.07)',
                boxShadow: isHovered ? '0 0 22px ' + m.color + '18' : 'none',
              }}
              transition={{ duration: 0.22 }}
              style={{
                width: 'clamp(32px, 5.5vw, 60px)',
                height: 'clamp(32px, 5.5vw, 60px)',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon
                size={typeof window !== 'undefined' ? Math.max(12, Math.min(22, window.innerWidth * 0.016)) : 16}
                color={isHovered ? m.color : 'rgba(255,255,255,0.18)'}
                style={{ transition: 'color 0.2s' }}
              />
            </motion.div>

            {/* The word — scales DOWN to fit, never overflows */}
            <motion.div
              animate={{ color: isHovered ? m.color : 'rgba(255,255,255,0.88)' }}
              transition={{ duration: 0.15 }}
              style={{
                fontFamily: FH,
                fontWeight: '900',
                // Key fix: use vw-based scaling so all 3 fit in one row
                fontSize: 'clamp(18px, 5.2vw, 80px)',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                willChange: 'color',
                // Prevent overflow
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
                textAlign: 'center',
              }}
            >
              {m.label}
            </motion.div>

            {/* Sub on hover */}
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', pointerEvents: 'none', minHeight: '28px' }}
            >
              <div style={{ fontFamily: FM, fontSize: 'clamp(8px, 0.85vw, 10px)', color: m.color, letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {m.sub}
              </div>
              <div style={{ fontFamily: FB, fontSize: 'clamp(10px, 1vw, 12px)', color: 'var(--text-4)', textAlign: 'center', maxWidth: '160px', lineHeight: 1.4 }}>
                {m.desc}
              </div>
            </motion.div>

            {/* Underline */}
            <motion.div
              animate={{ scaleX: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.24 }}
              style={{ height: '2px', width: '100%', background: 'linear-gradient(90deg,transparent,' + m.color + ',transparent)', transformOrigin: 'center', borderRadius: '1px', marginTop: '-8px' }}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

// ── Switcher domain picker ────────────────────────────────
function DomainPicker({ onConfirm, color }) {
  var [selected, setSelected] = useState(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: '100%', maxWidth: '700px', padding: '0 clamp(14px, 4vw, 40px)' }}
    >
      {/* Question */}
      <div style={{
        fontFamily: FM, fontSize: 'clamp(10px, 1.2vw, 13px)',
        color: color, letterSpacing: '0.22em', textTransform: 'uppercase',
        textAlign: 'center', marginBottom: 'clamp(18px, 3.5vh, 36px)',
        opacity: 0.85,
      }}>
        WHERE ARE YOU SWITCHING TO?
      </div>

      {/* Domain grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(150px, 100%), 1fr))',
        gap: '8px',
        marginBottom: 'clamp(18px, 3.5vh, 32px)',
      }}>
        {SWITCH_DOMAINS.map(function(d, i) {
          var isSelected = selected === d.id
          return (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.035, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              onClick={function() { setSelected(d.id) }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '13px 11px',
                borderRadius: '11px',
                border: '1px solid ' + (isSelected ? color + '65' : 'rgba(255,255,255,0.08)'),
                background: isSelected ? color + '18' : 'rgba(255,255,255,0.025)',
                color: isSelected ? color : 'rgba(255,255,255,0.52)',
                fontSize: 'clamp(11px, 1.2vw, 13px)',
                fontFamily: FH,
                fontWeight: isSelected ? '700' : '500',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'border-color 0.16s, background 0.16s, color 0.16s, box-shadow 0.16s',
                textAlign: 'left',
                boxShadow: isSelected ? '0 0 18px ' + color + '18' : 'none',
              }}
            >
              <span style={{ fontSize: '15px', flexShrink: 0 }}>{d.emoji}</span>
              <span style={{ lineHeight: 1.3 }}>{d.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Confirm */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <motion.button
          onClick={function() { if (selected) onConfirm(selected) }}
          animate={{ opacity: selected ? 1 : 0.28 }}
          whileHover={selected ? { scale: 1.04, y: -2 } : {}}
          whileTap={selected ? { scale: 0.97 } : {}}
          style={{
            padding: '14px 44px', borderRadius: '40px', border: 'none',
            background: selected
              ? 'linear-gradient(135deg,' + color + ',#B86800)'
              : 'rgba(255,255,255,0.06)',
            color: selected ? 'white' : 'rgba(255,255,255,0.25)',
            fontSize: '15px', fontFamily: FH, fontWeight: '800',
            cursor: selected ? 'pointer' : 'not-allowed',
            letterSpacing: '-0.02em',
            boxShadow: selected ? '0 6px 24px ' + color + '40' : 'none',
            transition: 'box-shadow 0.2s, background 0.2s',
          }}
        >
          {selected ? 'Start switching →' : 'Pick a domain first'}
        </motion.button>

        <button
          onClick={function() { onConfirm('auto') }}
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.22)', fontSize: '12px',
            fontFamily: FB, cursor: 'pointer',
            textDecoration: 'underline', textUnderlineOffset: '3px',
          }}
        >
          let AI decide from my resume
        </button>
      </div>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────
function ModeSelector({ onSelect }) {
  // step: 'pick' | 'domain' | 'exiting'
  var [step,    setStep]    = useState('pick')
  var [hovered, setHovered] = useState(null)
  var [ready,   setReady]   = useState(false)

  // Stagger words in
  useEffect(function() {
    var t = setTimeout(function() { setReady(true) }, 160)
    return function() { clearTimeout(t) }
  }, [])

  function handleWordPick(id) {
    if (step !== 'pick') return
    if (id === 'switcher') {
      setStep('domain')
    } else {
      setStep('exiting')
      setTimeout(function() { onSelect(id) }, 600)
    }
  }

  function handleDomainConfirm(domainId) {
    // Save domain choice
    if (domainId && domainId !== 'auto') {
      try { localStorage.setItem('certifyroi_switch_domain', domainId) } catch(e) {}
    } else {
      try { localStorage.removeItem('certifyroi_switch_domain') } catch(e) {}
    }
    setStep('exiting')
    // Call onSelect immediately — no extra timer
    setTimeout(function() { onSelect('switcher') }, 500)
  }

  var switcherColor = '#F59E0B'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: step === 'exiting' ? 0 : 1 }}
      transition={{ duration: step === 'exiting' ? 0.4 : 0.3 }}
      style={{
        position: 'fixed',
        top: OFFSET, left: 0, right: 0, bottom: 0,
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
        backgroundImage: 'radial-gradient(rgba(99,102,241,0.08) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      {/* Hover glow */}
      <AnimatePresence>
        {hovered && step === 'pick' ? (
          <motion.div
            key={'glow-' + hovered}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', pointerEvents: 'none',
              width: '75vw', height: '75vw', maxWidth: '680px', maxHeight: '680px',
              borderRadius: '50%',
              background: 'radial-gradient(circle,' +
                (MODES.find(function(m) { return m.id === hovered })?.color || '#6366F1') +
                '0D 0%, transparent 65%)',
            }}
          />
        ) : null}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* ── STEP: pick ── */}
        <AnimatePresence mode="wait">
          {step === 'pick' && ready ? (
            <motion.div
              key="pick"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -32, transition: { duration: 0.35 } }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(18px, 4vh, 44px)' }}
            >
              {/* WHO ARE YOU */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.42 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                  fontFamily: FM, fontSize: 'clamp(9px, 1.1vw, 12px)',
                  color: 'var(--text-4)', letterSpacing: '0.32em',
                  textTransform: 'uppercase', textAlign: 'center',
                }}
              >
                WHO ARE YOU?
              </motion.div>

              {/* Three words */}
              <WordRow
                hovered={hovered}
                setHovered={setHovered}
                onPick={handleWordPick}
                disabled={false}
              />

              {/* Hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hovered ? 0 : 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                style={{
                  fontFamily: FB, fontSize: 'clamp(11px, 1.2vw, 14px)',
                  color: 'var(--text-4)', textAlign: 'center',
                }}
              >
                pick one — it shapes every recommendation
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ── STEP: domain (switcher follow-up) ── */}
        <AnimatePresence mode="wait">
          {step === 'domain' ? (
            <motion.div
              key="domain"
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <DomainPicker onConfirm={handleDomainConfirm} color={switcherColor} />
            </motion.div>
          ) : null}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}

export default ModeSelector