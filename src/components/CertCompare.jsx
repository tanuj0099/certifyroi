import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Award, Clock, DollarSign, Zap, ChevronDown } from 'lucide-react'
import { CERTIFICATIONS, CERT_DOMAINS, INDIA_CONTEXT } from '../tokens.js'

const F_HEAD = "'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif"
const F_MONO = "'Commit Mono', 'JetBrains Mono', monospace"
const F_BODY = "'Inter', sans-serif"

const demandColor = d =>
  d === 'Very High' ? '#10B981' : d === 'High' ? '#51B1E7' : d === 'Medium' ? '#F59E0B' : '#94A3B8'

const demandScore = d =>
  d === 'Very High' ? 4 : d === 'High' ? 3 : d === 'Medium' ? 2 : 1

const CertSelector = ({ value, onChange, label, color }) => {
  const [open, setOpen] = useState(false)
  const [domain, setDomain] = useState('all')
  const filtered = CERTIFICATIONS.filter(c => domain === 'all' || c.domain === domain)
  const selected = CERTIFICATIONS.find(c => c.name === value)

  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: F_MONO, fontSize: '9px', color, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>{label}</div>

      <button onClick={() => setOpen(v => !v)}
        style={{ width: '100%', padding: '12px 14px', background: selected ? `${color}0e` : 'var(--surface)', border: `1px solid ${selected ? color + '44' : 'var(--border)'}`, borderRadius: '10px', color: selected ? color : 'var(--text-4)', fontSize: '13px', cursor: 'pointer', fontFamily: F_HEAD, fontWeight: selected ? '700' : '500', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', transition: 'all 0.18s', textAlign: 'left' }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.name : 'Pick a certification…'}
        </span>
        <ChevronDown size={13} style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
            style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 60, marginTop: '6px', borderRadius: '12px', background: 'var(--surface)', border: `1px solid ${color}33`, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>

            {/* Domain filter */}
            <div style={{ display: 'flex', gap: '4px', padding: '8px 8px 0', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              {CERT_DOMAINS.slice(0, 6).map(d => (
                <button key={d.id} onClick={() => setDomain(d.id)}
                  style={{ padding: '3px 9px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer', fontFamily: F_BODY, fontWeight: '600', background: domain === d.id ? 'var(--indigo-dim)' : 'transparent', border: `1px solid ${domain === d.id ? 'var(--border-accent)' : 'var(--border)'}`, color: domain === d.id ? 'var(--indigo-light)' : 'var(--text-4)', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                  {d.label}
                </button>
              ))}
            </div>

            <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
              {filtered.map(cert => (
                <button key={cert.id} onClick={() => { onChange(cert.name); setOpen(false) }}
                  style={{ width: '100%', padding: '10px 14px', background: value === cert.name ? `${color}12` : 'transparent', border: 'none', color: value === cert.name ? color : 'var(--text-2)', fontSize: '13px', cursor: 'pointer', fontFamily: F_BODY, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', transition: 'background 0.12s' }}
                  onMouseEnter={e => { if (value !== cert.name) e.currentTarget.style.background = 'var(--surface-high)' }}
                  onMouseLeave={e => { if (value !== cert.name) e.currentTarget.style.background = 'transparent' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cert.name}</span>
                  <span style={{ fontSize: '10px', color: demandColor(cert.demand), fontFamily: F_MONO, flexShrink: 0 }}>+{cert.avgHike}%</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Bar = ({ value, max, color, label, suffix = '' }) => {
  const pct = Math.round((value / max) * 100)
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: F_BODY }}>{label}</span>
        <span style={{ fontSize: '12px', color, fontFamily: F_MONO, fontWeight: '700' }}>{value}{suffix}</span>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border)', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: [0.4,0,0.2,1] }}
          style={{ height: '100%', borderRadius: '3px', background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      </div>
    </div>
  )
}

const CertCompare = ({ salary = 8, prefilledCert = '' }) => {
  const [certA, setCertA] = useState(prefilledCert || '')
  const [certB, setCertB] = useState('')

  const dataA = CERTIFICATIONS.find(c => c.name === certA)
  const dataB = CERTIFICATIONS.find(c => c.name === certB)

  const roiCalc = useCallback((cert, sal) => {
    if (!cert || !sal) return null
    const annualGain  = sal * 100000 * cert.avgHike / 100
    const breakEven   = annualGain > 0 ? Math.ceil((cert.avgCost) / (annualGain / 12)) : 0
    const fiveYearNet = (annualGain * 5 - cert.avgCost) / 100000
    const roiPct      = cert.avgCost > 0 ? Math.round((annualGain * 5 - cert.avgCost) / cert.avgCost * 100) : 0
    return { breakEven, fiveYearNet: fiveYearNet.toFixed(1), roiPct, annualGain: (annualGain / 100000).toFixed(1) }
  }, [])

  const roiA = roiCalc(dataA, salary)
  const roiB = roiCalc(dataB, salary)

  const winner = roiA && roiB
    ? (parseFloat(roiA.fiveYearNet) > parseFloat(roiB.fiveYearNet) ? 'A' : 'B')
    : null

  const maxHike    = 80
  const maxCost    = 6   // L
  const maxBE      = 24  // months
  const maxDemand  = 4

  return (
    <div>
      <div style={{ fontFamily: F_MONO, fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '18px' }}>
        COMPARE TWO CERTIFICATIONS · SIDE BY SIDE
      </div>

      {/* Selectors */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <CertSelector value={certA} onChange={setCertA} label="Certification A" color="#6366F1" />
        <div style={{ display: 'flex', alignItems: 'center', fontFamily: F_MONO, fontSize: '13px', color: 'var(--text-4)', paddingTop: '22px', flexShrink: 0 }}>VS</div>
        <CertSelector value={certB} onChange={setCertB} label="Certification B" color="#10B981" />
      </div>

      {/* Comparison table */}
      {dataA && dataB && roiA && roiB && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

            {/* Winner banner */}
            {winner && (
              <div style={{ marginBottom: '20px', padding: '14px 16px', borderRadius: '12px', background: winner === 'A' ? 'rgba(99,102,241,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${winner === 'A' ? 'rgba(99,102,241,0.25)' : 'rgba(16,185,129,0.25)'}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={16} color={winner === 'A' ? '#6366F1' : '#10B981'} />
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: winner === 'A' ? '#6366F1' : '#10B981', fontFamily: F_HEAD }}>
                    {winner === 'A' ? dataA.name : dataB.name} wins on 5-year ROI
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: F_BODY, marginLeft: '8px' }}>
                    +₹{Math.abs(parseFloat(roiA.fiveYearNet) - parseFloat(roiB.fiveYearNet)).toFixed(1)}L more over 5 years
                  </span>
                </div>
              </div>
            )}

            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', gap: '8px', marginBottom: '8px' }}>
              <div />
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: '#6366F1', textAlign: 'center', padding: '6px', borderRadius: '8px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {dataA.name.split(' ').slice(0, 2).join(' ')}
              </div>
              <div style={{ fontFamily: F_MONO, fontSize: '10px', color: '#10B981', textAlign: 'center', padding: '6px', borderRadius: '8px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {dataB.name.split(' ').slice(0, 2).join(' ')}
              </div>
            </div>

            {/* Comparison rows */}
            {[
              { label: 'Expected Hike',    vA: `+${dataA.avgHike}%`,          vB: `+${dataB.avgHike}%`,          win: dataA.avgHike > dataB.avgHike ? 'A' : 'B' },
              { label: 'Cert Cost',        vA: `₹${(dataA.avgCost/100000).toFixed(1)}L`, vB: `₹${(dataB.avgCost/100000).toFixed(1)}L`, win: dataA.avgCost < dataB.avgCost ? 'A' : 'B' },
              { label: 'Break-even',       vA: `${roiA.breakEven} mo`,        vB: `${roiB.breakEven} mo`,        win: roiA.breakEven < roiB.breakEven ? 'A' : 'B' },
              { label: '5-Yr Net Gain',    vA: `₹${roiA.fiveYearNet}L`,       vB: `₹${roiB.fiveYearNet}L`,      win: parseFloat(roiA.fiveYearNet) > parseFloat(roiB.fiveYearNet) ? 'A' : 'B' },
              { label: '5-Yr ROI %',       vA: `${roiA.roiPct}%`,             vB: `${roiB.roiPct}%`,             win: roiA.roiPct > roiB.roiPct ? 'A' : 'B' },
              { label: 'Study Time',       vA: `${dataA.timeMonths} mo`,       vB: `${dataB.timeMonths} mo`,      win: dataA.timeMonths < dataB.timeMonths ? 'A' : 'B' },
              { label: 'Market Demand',    vA: dataA.demand,                   vB: dataB.demand,                  win: demandScore(dataA.demand) >= demandScore(dataB.demand) ? 'A' : 'B' },
              { label: 'Annual Salary +',  vA: `₹${roiA.annualGain}L`,        vB: `₹${roiB.annualGain}L`,       win: parseFloat(roiA.annualGain) > parseFloat(roiB.annualGain) ? 'A' : 'B' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', gap: '8px', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: 'var(--text-3)', fontFamily: F_BODY }}>{row.label}</div>
                <div style={{ padding: '8px', borderRadius: '8px', textAlign: 'center', background: row.win === 'A' ? 'rgba(99,102,241,0.1)' : 'var(--surface)', border: `1px solid ${row.win === 'A' ? 'rgba(99,102,241,0.22)' : 'var(--border)'}`, fontFamily: F_MONO, fontSize: '12px', color: row.win === 'A' ? '#6366F1' : 'var(--text-3)', fontWeight: row.win === 'A' ? '700' : '500' }}>
                  {row.vA}
                  {row.win === 'A' && <span style={{ marginLeft: '4px', fontSize: '9px' }}>✓</span>}
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', textAlign: 'center', background: row.win === 'B' ? 'rgba(16,185,129,0.1)' : 'var(--surface)', border: `1px solid ${row.win === 'B' ? 'rgba(16,185,129,0.22)' : 'var(--border)'}`, fontFamily: F_MONO, fontSize: '12px', color: row.win === 'B' ? '#10B981' : 'var(--text-3)', fontWeight: row.win === 'B' ? '700' : '500' }}>
                  {row.vB}
                  {row.win === 'B' && <span style={{ marginLeft: '4px', fontSize: '9px' }}>✓</span>}
                </div>
              </div>
            ))}

            {/* Demand bars */}
            <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontFamily: F_MONO, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>VISUAL COMPARISON</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontFamily: F_MONO, fontSize: '10px', color: '#6366F1', marginBottom: '10px' }}>{dataA.name.split(' ')[0]}</div>
                  <Bar value={dataA.avgHike}                  max={maxHike}   color="#6366F1" label="Hike %"       suffix="%" />
                  <Bar value={dataA.avgCost / 100000}         max={maxCost}   color="#818CF8" label="Cost (₹L)"    suffix="L" />
                  <Bar value={maxBE - roiA.breakEven}         max={maxBE}     color="#F59E0B" label="Speed"        />
                  <Bar value={demandScore(dataA.demand)}      max={maxDemand} color="#10B981" label="Demand"       />
                </div>
                <div>
                  <div style={{ fontFamily: F_MONO, fontSize: '10px', color: '#10B981', marginBottom: '10px' }}>{dataB.name.split(' ')[0]}</div>
                  <Bar value={dataB.avgHike}                  max={maxHike}   color="#10B981" label="Hike %"       suffix="%" />
                  <Bar value={dataB.avgCost / 100000}         max={maxCost}   color="#34D399" label="Cost (₹L)"    suffix="L" />
                  <Bar value={maxBE - roiB.breakEven}         max={maxBE}     color="#F59E0B" label="Speed"        />
                  <Bar value={demandScore(dataB.demand)}      max={maxDemand} color="#51B1E7" label="Demand"       />
                </div>
              </div>
            </div>

            {/* Tags comparison */}
            <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[{ cert: dataA, color: '#6366F1' }, { cert: dataB, color: '#10B981' }].map(({ cert, color }, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '10px', background: `${color}07`, border: `1px solid ${color}20` }}>
                  <div style={{ fontFamily: F_MONO, fontSize: '9px', color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Best for</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: F_BODY, lineHeight: '1.5', marginBottom: '8px' }}>{cert.forWho}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {cert.tags.map((tag, j) => (
                      <span key={j} style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '5px', background: `${color}12`, color, fontFamily: F_MONO, border: `1px solid ${color}22` }}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>
      )}

      {/* Empty state */}
      {(!dataA || !dataB) && (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-4)', fontSize: '13px', fontFamily: F_BODY }}>
          <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>⚖️</div>
          <div style={{ fontFamily: F_HEAD, fontWeight: '700', fontSize: '15px', color: 'var(--text-3)', marginBottom: '6px' }}>Pick two certifications to compare</div>
          <div>Break-even, 5-year gain, demand — side by side</div>
        </div>
      )}
    </div>
  )
}

export default CertCompare