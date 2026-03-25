import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, TrendingUp, TrendingDown, X, Award, AlertTriangle } from 'lucide-react'

const PICTON  = '#51B1E7'
const EMERALD = '#10B981'
const AMBER   = '#F59E0B'
const SPRING  = { type: 'spring', stiffness: 400, damping: 30 }

const InputRow = ({ label, value, onChange, placeholder, prefix = '', suffix = '' }) => (
  <div style={{ marginBottom: '14px' }}>
    <label style={{ fontSize: '11px', color: 'var(--text-3)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'JetBrains Mono, monospace' }}>{label}</label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '9px', transition: 'border-color 0.2s' }}
      onFocusCapture={e => { const p = e.currentTarget; p.style.borderColor = PICTON + '55' }}
      onBlurCapture={e  => { const p = e.currentTarget; p.style.borderColor = 'var(--border)' }}>
      {prefix && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--text-4)', flexShrink: 0 }}>{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '600', minWidth: 0 }}
      />
      {suffix && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--text-4)', flexShrink: 0 }}>{suffix}</span>}
    </div>
  </div>
)

const HikeVerifier = ({ certName = 'Your Certification', projectedHike = 30, onClose }) => {
  const [beforeSalary, setBeforeSalary] = useState('')
  const [afterSalary,  setAfterSalary]  = useState('')
  const [submitted,    setSubmitted]    = useState(false)
  const [result,       setResult]       = useState(null)

  const canSubmit = beforeSalary > 0 && afterSalary > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    const before     = parseFloat(beforeSalary)
    const after      = parseFloat(afterSalary)
    const actualHike = ((after - before) / before) * 100
    const beat       = actualHike >= projectedHike
    const delta      = Math.abs(actualHike - projectedHike).toFixed(1)

    setResult({ before, after, actualHike: actualHike.toFixed(1), beat, delta, annualGain: ((after - before) * 100000).toFixed(0) })
    setSubmitted(true)
  }

  const getGrade = (actual, projected) => {
    const ratio = actual / projected
    if (ratio >= 1.3) return { label: '🏆 Exceptional',   color: '#F59E0B', desc: 'You massively outperformed the projection.' }
    if (ratio >= 1.0) return { label: '✅ On Track',       color: EMERALD,   desc: 'You met or beat the projected hike. Well done.' }
    if (ratio >= 0.7) return { label: '🟡 Close Enough',   color: AMBER,     desc: 'Slightly below projection — market conditions may vary.' }
    return                   { label: '⚠️ Below Target',   color: '#EF4444', desc: 'Significantly below projection. Consider a job switch or another cert to close the gap.' }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={SPRING}
      style={{ background: 'var(--surface)', border: `1px solid ${PICTON}22`, borderRadius: '14px', overflow: 'hidden', marginTop: '14px', boxShadow: 'inset 0 1px 0 var(--card-highlight), 0 2px 8px rgba(0,0,0,0.06)' }}>

      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: 28, height: 28, borderRadius: '8px', background: EMERALD + '14', border: '1px solid ' + EMERALD + '28', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={13} color={EMERALD} />
        </div>
        <div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '12px', color: EMERALD, letterSpacing: '0.04em' }}>VERIFY YOUR HIKE</div>
          <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>{certName} · Projected: +{projectedHike}%</div>
        </div>
        {onClose && <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer' }}><X size={14} /></button>}
      </div>

      <div style={{ padding: '18px' }}>
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '18px', lineHeight: '1.6', fontFamily: 'Inter, sans-serif' }}>
                Got your cert and landed a new role? Enter before and after salary to see how your actual hike compares to the projection.
              </p>

              <InputRow label="Salary Before Cert (₹L/yr)"  value={beforeSalary} onChange={setBeforeSalary} placeholder="e.g. 8"  prefix="₹" suffix="L" />
              <InputRow label="New Salary After Cert (₹L/yr)" value={afterSalary}  onChange={setAfterSalary}  placeholder="e.g. 11" prefix="₹" suffix="L" />

              {beforeSalary > 0 && afterSalary > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
                  style={{ padding: '10px 14px', borderRadius: '9px', background: 'var(--bg)', border: '1px solid var(--border)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  {[
                    { label: 'Actual Hike',  value: '+' + (((afterSalary - beforeSalary) / beforeSalary) * 100).toFixed(1) + '%', color: EMERALD },
                    { label: 'Projected',    value: '+' + projectedHike + '%',                                                       color: PICTON  },
                    { label: 'Annual Gain',  value: '₹' + ((afterSalary - beforeSalary)).toFixed(1) + 'L/yr',                        color: AMBER   },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>{s.label}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', color: s.color, fontWeight: '700', letterSpacing: '-0.02em' }}>{s.value}</div>
                    </div>
                  ))}
                </motion.div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: canSubmit ? 1 : 0.4 }}
              >
                <CheckCircle size={14} />
                Verify My Hike
              </button>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
              {(() => {
                const grade = getGrade(parseFloat(result.actualHike), projectedHike)
                return (
                  <>
                    {/* Grade banner */}
                    <div style={{ padding: '20px', borderRadius: '12px', background: `${grade.color}08`, border: `1px solid ${grade.color}22`, textAlign: 'center', marginBottom: '16px' }}>
                      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '1.2rem', color: grade.color, marginBottom: '4px' }}>{grade.label}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif' }}>{grade.desc}</div>
                    </div>

                    {/* Comparison */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                      {[
                        { label: 'Before',       value: '₹' + result.before + 'L',          color: 'var(--text-4)'  },
                        { label: 'Actual Hike',  value: '+' + result.actualHike + '%',        color: result.beat ? EMERALD : AMBER },
                        { label: 'After',        value: '₹' + result.after + 'L',             color: PICTON           },
                      ].map((s, i) => (
                        <div key={i} style={{ padding: '12px 10px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', textAlign: 'center' }}>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{s.label}</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '16px', color: s.color, fontWeight: '700', letterSpacing: '-0.02em' }}>{s.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* vs projected */}
                    <div style={{ padding: '12px 14px', borderRadius: '10px', background: result.beat ? `${EMERALD}08` : `${AMBER}08`, border: `1px solid ${result.beat ? EMERALD : AMBER}22`, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      {result.beat ? <TrendingUp size={14} color={EMERALD} /> : <TrendingDown size={14} color={AMBER} />}
                      <div style={{ fontSize: '13px', color: 'var(--text-2)', fontFamily: 'Inter, sans-serif', lineHeight: '1.55' }}>
                        {result.beat
                          ? <><strong style={{ color: EMERALD }}>+{result.delta}% above</strong> the projected hike. The cert paid off.</>
                          : <><strong style={{ color: AMBER }}>{result.delta}% below</strong> projection. Consider switching companies or stacking another cert.</>
                        }
                      </div>
                    </div>

                    {/* Annual gain highlight */}
                    <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--indigo-dim)', border: '1px solid var(--border-accent)', marginBottom: '16px' }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--indigo-light)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>ANNUAL GAIN</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-2)', fontFamily: 'Inter, sans-serif' }}>
                        You earn an extra <strong style={{ color: 'var(--indigo-light)', fontFamily: 'JetBrains Mono, monospace' }}>₹{((result.after - result.before)).toFixed(1)}L/yr</strong> — that's ₹{Math.round((result.after - result.before) * 100000 / 12).toLocaleString('en-IN')} per month extra.
                      </div>
                    </div>

                    <button onClick={() => { setSubmitted(false); setResult(null); setBeforeSalary(''); setAfterSalary('') }}
                      className="btn-ghost" style={{ width: '100%', textAlign: 'center' }}>
                      Verify Another Cert
                    </button>
                  </>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default HikeVerifier