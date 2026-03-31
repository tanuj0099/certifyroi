import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, TrendingUp, TrendingDown,
  X, Award, Clock, Target, Zap
} from 'lucide-react'

const PICTON  = '#51B1E7'
const EMERALD = '#10B981'
const AMBER   = '#F59E0B'
const INDIGO  = '#6366F1'
const VIOLET  = '#818CF8'
const RED     = '#EF4444'

const FM = "'JetBrains Mono','Commit Mono',monospace"
const FH = "'Plus Jakarta Sans','Bricolage Grotesque',sans-serif"
const FB = "'Inter',sans-serif"

const SPRING = { type: 'spring', stiffness: 380, damping: 28 }
const EASE   = { duration: 0.3, ease: [0.4, 0, 0.2, 1] }

// ── Input row ─────────────────────────────────────────────
function InputRow({ label, value, onChange, placeholder, prefix, suffix, note }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{
        fontSize: '11px', color: 'var(--text-3)', display: 'block',
        marginBottom: '6px', textTransform: 'uppercase',
        letterSpacing: '0.08em', fontFamily: FM,
      }}>
        {label}
      </label>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 14px', background: 'var(--bg)',
          border: '1px solid var(--border)', borderRadius: '9px',
          transition: 'border-color 0.2s',
        }}
        onFocusCapture={function(e) { e.currentTarget.style.borderColor = PICTON + '55' }}
        onBlurCapture={function(e)  { e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        {prefix ? (
          <span style={{ fontFamily: FM, fontSize: '13px', color: 'var(--text-4)', flexShrink: 0 }}>
            {prefix}
          </span>
        ) : null}
        <input
          type="number"
          value={value}
          onChange={function(e) { onChange(e.target.value) }}
          placeholder={placeholder}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: 'var(--text)', fontSize: '14px',
            fontFamily: FM, fontWeight: '600', minWidth: 0,
          }}
        />
        {suffix ? (
          <span style={{ fontFamily: FM, fontSize: '13px', color: 'var(--text-4)', flexShrink: 0 }}>
            {suffix}
          </span>
        ) : null}
      </div>
      {note ? (
        <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '4px', fontFamily: FB, lineHeight: '1.4' }}>
          {note}
        </div>
      ) : null}
    </div>
  )
}

// ── Animated score bar ────────────────────────────────────
function ScoreBar({ label, actual, projected, color }) {
  var maxVal   = Math.max(actual, projected, 1) * 1.3
  var pctActual = Math.min((actual / maxVal) * 100, 100)
  var pctProj   = Math.min((projected / maxVal) * 100, 100)

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontFamily: FM, fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        <span style={{ fontFamily: FM, fontSize: '11px', color: color, fontWeight: '700' }}>
          {actual > projected ? '+' + (actual - projected).toFixed(1) + '% above target' : (actual - projected).toFixed(1) + '% vs target'}
        </span>
      </div>

      {/* Projected bar (background) */}
      <div style={{ position: 'relative', height: '10px', borderRadius: '5px', background: 'var(--border)', overflow: 'visible', marginBottom: '4px' }}>
        {/* Projected fill */}
        <div style={{ position: 'absolute', left: 0, height: '100%', width: pctProj + '%', borderRadius: '5px', background: 'rgba(148,163,184,0.35)' }} />
        {/* Actual fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: pctActual + '%' }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          style={{
            position: 'absolute', left: 0, height: '100%',
            borderRadius: '5px',
            background: 'linear-gradient(90deg, ' + color + '88, ' + color + ')',
          }}
        />
        {/* Projected marker line */}
        <div style={{
          position: 'absolute',
          left: pctProj + '%',
          top: '-3px', bottom: '-3px',
          width: '2px',
          background: 'var(--text-4)',
          borderRadius: '1px',
          transform: 'translateX(-50%)',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: FM, fontSize: '10px', color: color, fontWeight: '700' }}>
          Actual: {actual.toFixed(1)}%
        </span>
        <span style={{ fontFamily: FM, fontSize: '10px', color: 'var(--text-4)' }}>
          Projected: {projected}%
        </span>
      </div>
    </div>
  )
}

// ── Verdict logic ─────────────────────────────────────────
function getVerdict(actualHike, projectedHike, timeTaken) {
  var ratio = actualHike / Math.max(projectedHike, 1)

  if (ratio >= 1.3) return {
    emoji: '🏆',
    label: 'Exceptional',
    color: AMBER,
    headline: 'You crushed it.',
    sub: 'Your actual hike was ' + (actualHike - projectedHike).toFixed(1) + '% above what most people get with this cert. Top ' + (ratio >= 1.5 ? '5%' : '15%') + ' outcome.',
  }
  if (ratio >= 1.0) return {
    emoji: '🎯',
    label: 'On Target',
    color: EMERALD,
    headline: 'The cert delivered.',
    sub: 'You met or beat the projected hike. Your result is better than the majority of people who took this cert.',
  }
  if (ratio >= 0.75) return {
    emoji: '📈',
    label: 'Close',
    color: PICTON,
    headline: 'Solid, not spectacular.',
    sub: 'You came within ' + (projectedHike - actualHike).toFixed(1) + '% of the projection. Market conditions, company, and negotiation skill all play a role here.',
  }
  if (ratio >= 0.5) return {
    emoji: '⚡',
    label: 'Below Target',
    color: AMBER,
    headline: 'Room to push further.',
    sub: (projectedHike - actualHike).toFixed(1) + '% below projection. A job switch with this cert on your profile could close the gap fast.',
  }
  return {
    emoji: '🔁',
    label: 'Needs Action',
    color: RED,
    headline: 'The cert alone wasn\'t enough.',
    sub: 'Significantly below projection. Consider stacking a second cert or switching companies — the market values this cert, but your current employer may not.',
  }
}

// ── Comparison text ───────────────────────────────────────
function getComparisonText(actualHike, projectedHike) {
  var delta = actualHike - projectedHike
  if (delta >= 15) return 'You beat the typical outcome by ' + delta.toFixed(1) + '% — better than ~90% of people who took this cert.'
  if (delta >= 8)  return 'You beat the average by ' + delta.toFixed(1) + '% — stronger result than most.'
  if (delta >= 2)  return 'You came in ' + delta.toFixed(1) + '% above the projected hike. Solid result.'
  if (delta >= -2) return 'Right on the projected average — exactly what the data predicted.'
  if (delta >= -8) return 'You came in ' + Math.abs(delta).toFixed(1) + '% below the typical outcome. Still a meaningful hike.'
  return 'You came in ' + Math.abs(delta).toFixed(1) + '% below projection. Your next move matters more than the cert now.'
}

// ── ROI comparison ────────────────────────────────────────
function calcROI(before, after, certCostL, years) {
  var annualGain  = (after - before) * 100000
  var totalGain   = annualGain * years
  var costRupees  = (certCostL || 0.5) * 100000
  var netGain     = totalGain - costRupees
  var roiPct      = costRupees > 0 ? Math.round((netGain / costRupees) * 100) : 0
  var breakEven   = annualGain > 0 ? Math.ceil(costRupees / (annualGain / 12)) : 0
  return { annualGain: annualGain, netGainL: (netGain / 100000).toFixed(1), roiPct: roiPct, breakEven: breakEven }
}

// ─────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────
function HikeVerifier({ certName, projectedHike, onClose }) {
  certName      = certName      || 'Your Certification'
  projectedHike = projectedHike || 30

  var [step,         setStep]         = useState('form') // 'form' | 'result'
  var [beforeSalary, setBeforeSalary] = useState('')
  var [afterSalary,  setAfterSalary]  = useState('')
  var [timeTaken,    setTimeTaken]    = useState('')

  var canSubmit = parseFloat(beforeSalary) > 0 && parseFloat(afterSalary) > parseFloat(beforeSalary) && parseFloat(timeTaken) > 0

  // Pre-computed live preview values (shown while typing)
  var liveActualHike = beforeSalary > 0 && afterSalary > 0
    ? (((parseFloat(afterSalary) - parseFloat(beforeSalary)) / parseFloat(beforeSalary)) * 100)
    : null

  function handleSubmit() {
    if (!canSubmit) return
    setStep('result')
  }

  function handleReset() {
    setStep('form')
    setBeforeSalary('')
    setAfterSalary('')
    setTimeTaken('')
  }

  // Result values (only computed after submit)
  var before       = parseFloat(beforeSalary) || 0
  var after        = parseFloat(afterSalary)  || 0
  var months       = parseFloat(timeTaken)    || 0
  var actualHike   = before > 0 ? ((after - before) / before) * 100 : 0
  var verdict      = getVerdict(actualHike, projectedHike, months)
  var comparison   = getComparisonText(actualHike, projectedHike)
  var roi          = calcROI(before, after, 0.5, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={SPRING}
      style={{
        background: 'var(--surface)',
        border: '1px solid ' + EMERALD + '22',
        borderRadius: '14px',
        overflow: 'hidden',
        marginTop: '14px',
        boxShadow: 'inset 0 1px 0 var(--card-highlight), 0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '9px',
          background: EMERALD + '14', border: '1px solid ' + EMERALD + '28',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Target size={14} color={EMERALD} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FH, fontWeight: '800', fontSize: '12px', color: EMERALD, letterSpacing: '0.04em' }}>
            DID IT WORK?
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: FM, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {certName} · Projected +{projectedHike}%
          </div>
        </div>
        {onClose ? (
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
          >
            <X size={14} />
          </button>
        ) : null}
      </div>

      <div style={{ padding: '18px' }}>
        <AnimatePresence mode="wait">

          {/* ── FORM ───────────────────────────────────── */}
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={EASE}
            >
              <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '20px', lineHeight: '1.65', fontFamily: FB }}>
                Completed {certName.split(' ').slice(0, 3).join(' ')} and landed a hike? Enter your numbers — we'll tell you exactly how your result compares to what the data predicted.
              </p>

              <InputRow
                label="Salary Before Cert"
                value={beforeSalary}
                onChange={setBeforeSalary}
                placeholder="e.g. 8"
                prefix="₹" suffix="L/yr"
                note="Your CTC before you got the cert"
              />
              <InputRow
                label="New Salary After Cert"
                value={afterSalary}
                onChange={setAfterSalary}
                placeholder="e.g. 11"
                prefix="₹" suffix="L/yr"
                note="Your CTC after — new job or internal hike"
              />
              <InputRow
                label="Time Taken to See Results"
                value={timeTaken}
                onChange={setTimeTaken}
                placeholder="e.g. 4"
                suffix="months"
                note="From cert completion to salary change"
              />

              {/* Live preview — shows while typing */}
              {liveActualHike !== null && afterSalary > beforeSalary ? (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={EASE}
                  style={{
                    padding: '12px 16px', borderRadius: '10px',
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                    LIVE PREVIEW
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      { label: 'Actual Hike', value: '+' + liveActualHike.toFixed(1) + '%', color: liveActualHike >= projectedHike ? EMERALD : AMBER },
                      { label: 'Projected',   value: '+' + projectedHike + '%',             color: PICTON },
                      { label: 'Annual Gain', value: '₹' + (after - before).toFixed(1) + 'L', color: VIOLET },
                    ].map(function(s, i) {
                      return (
                        <div key={i} style={{ textAlign: 'center' }}>
                          <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                            {s.label}
                          </div>
                          <div style={{ fontFamily: FM, fontSize: '15px', color: s.color, fontWeight: '700', letterSpacing: '-0.02em' }}>
                            {s.value}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {/* Mini score bar preview */}
                  <div style={{ marginTop: '12px' }}>
                    <ScoreBar
                      label="Your hike vs projection"
                      actual={liveActualHike}
                      projected={projectedHike}
                      color={liveActualHike >= projectedHike ? EMERALD : AMBER}
                    />
                  </div>
                </motion.div>
              ) : null}

              <motion.button
                onClick={handleSubmit}
                disabled={!canSubmit}
                whileHover={canSubmit ? { y: -2, scale: 1.01 } : {}}
                whileTap={canSubmit ? { scale: 0.97 } : {}}
                style={{
                  width: '100%', padding: '13px 20px', borderRadius: '11px',
                  background: canSubmit
                    ? 'linear-gradient(135deg, ' + EMERALD + ', #059669)'
                    : 'var(--surface)',
                  border: canSubmit ? 'none' : '1px solid var(--border)',
                  color: canSubmit ? 'white' : 'var(--text-4)',
                  fontSize: '14px', fontWeight: '700',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  fontFamily: FH,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', opacity: canSubmit ? 1 : 0.5,
                  letterSpacing: '-0.01em', transition: 'all 0.2s',
                }}
              >
                <Zap size={14} />
                See How You Did
              </motion.button>
            </motion.div>
          ) : null}

          {/* ── RESULT ─────────────────────────────────── */}
          {step === 'result' ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
            >

              {/* Verdict banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SPRING, delay: 0.05 }}
                style={{
                  padding: '20px 18px', borderRadius: '13px',
                  background: verdict.color + '0d',
                  border: '1px solid ' + verdict.color + '30',
                  textAlign: 'center', marginBottom: '18px',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
                  {verdict.emoji}
                </div>
                <div style={{ fontFamily: FH, fontWeight: '900', fontSize: '1.15rem', color: verdict.color, letterSpacing: '-0.02em', marginBottom: '5px' }}>
                  {verdict.label} — {verdict.headline}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: FB, lineHeight: '1.6' }}>
                  {verdict.sub}
                </div>
              </motion.div>

              {/* Score bar — actual vs projected */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...EASE, delay: 0.15 }}
                style={{
                  padding: '14px 16px', borderRadius: '11px',
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  marginBottom: '14px',
                }}
              >
                <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  ACTUAL VS PREDICTED
                </div>
                <ScoreBar
                  label="Hike %"
                  actual={actualHike}
                  projected={projectedHike}
                  color={verdict.color}
                />
              </motion.div>

              {/* Comparison text */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...EASE, delay: 0.2 }}
                style={{
                  padding: '13px 16px', borderRadius: '10px',
                  background: verdict.color === RED || verdict.color === AMBER
                    ? 'rgba(245,158,11,0.07)'
                    : 'rgba(16,185,129,0.07)',
                  border: '1px solid ' + verdict.color + '28',
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  marginBottom: '14px',
                }}
              >
                {actualHike >= projectedHike
                  ? <TrendingUp size={15} color={verdict.color} style={{ flexShrink: 0, marginTop: '1px' }} />
                  : <TrendingDown size={15} color={verdict.color} style={{ flexShrink: 0, marginTop: '1px' }} />
                }
                <div style={{ fontSize: '13px', color: 'var(--text-2)', fontFamily: FB, lineHeight: '1.65' }}>
                  {comparison}
                </div>
              </motion.div>

              {/* Three stat cards: before / actual hike / after */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...EASE, delay: 0.25 }}
                style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px', marginBottom: '14px',
                }}
              >
                {[
                  { label: 'Before',      value: '₹' + before + 'L',            color: 'var(--text-4)' },
                  { label: 'Actual Hike', value: '+' + actualHike.toFixed(1) + '%', color: verdict.color },
                  { label: 'After',       value: '₹' + after + 'L',             color: PICTON          },
                ].map(function(s, i) {
                  return (
                    <div key={i} style={{
                      padding: '12px 10px', borderRadius: '10px',
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>
                        {s.label}
                      </div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...SPRING, delay: 0.28 + i * 0.06 }}
                        style={{ fontFamily: FM, fontSize: '16px', color: s.color, fontWeight: '700', letterSpacing: '-0.02em' }}
                      >
                        {s.value}
                      </motion.div>
                    </div>
                  )
                })}
              </motion.div>

              {/* Time taken badge */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...EASE, delay: 0.3 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 14px', borderRadius: '9px',
                  background: 'rgba(81,177,231,0.07)', border: '1px solid rgba(81,177,231,0.2)',
                  marginBottom: '14px',
                }}
              >
                <Clock size={13} color={PICTON} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'var(--text-2)', fontFamily: FB, lineHeight: '1.5' }}>
                  You saw results in <strong style={{ color: PICTON, fontFamily: FM }}>{months} months</strong>
                  {months <= 3 ? ' — faster than most. ' : months <= 6 ? ' — right on schedule. ' : ' — took longer than average, but the hike landed. '}
                  Annual gain: <strong style={{ color: VIOLET, fontFamily: FM }}>₹{(after - before).toFixed(1)}L/yr</strong> extra.
                </span>
              </motion.div>

              {/* 5-year ROI projection based on actual hike */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...EASE, delay: 0.35 }}
                style={{
                  padding: '14px 16px', borderRadius: '11px',
                  background: 'var(--indigo-dim)', border: '1px solid var(--border-accent)',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontFamily: FM, fontSize: '9px', color: VIOLET, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  YOUR ACTUAL 5-YEAR PICTURE
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--text-4)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Extra earned (5yr)
                    </div>
                    <div style={{ fontFamily: FM, fontSize: '17px', color: VIOLET, fontWeight: '700', letterSpacing: '-0.02em' }}>
                      ₹{((after - before) * 5).toFixed(1)}L
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--text-4)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Monthly extra
                    </div>
                    <div style={{ fontFamily: FM, fontSize: '17px', color: EMERALD, fontWeight: '700', letterSpacing: '-0.02em' }}>
                      ₹{Math.round((after - before) * 100000 / 12).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-3)', fontFamily: FB, lineHeight: '1.6' }}>
                  {actualHike >= projectedHike
                    ? 'Your actual result outperformed the model. Over 5 years at this salary, the cert pays back far more than projected.'
                    : 'Even below projection, your cert still generates significant long-term income. Consider a company switch to unlock the full predicted return.'
                  }
                </div>
              </motion.div>

              {/* Reset button */}
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: '100%', padding: '11px',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-3)',
                  fontSize: '13px', cursor: 'pointer',
                  fontFamily: FH, fontWeight: '600',
                  transition: 'all 0.18s', letterSpacing: '-0.01em',
                }}
              >
                Verify Another Cert
              </motion.button>

            </motion.div>
          ) : null}

        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default HikeVerifier