import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, AlertTriangle, CheckCircle, RefreshCw, Flame, TrendingUp, MapPin, User } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts'
import { CERTIFICATIONS, CERT_DOMAINS, INDIA_CONTEXT, GUEST_FREE_LIMIT } from '../tokens.js'
import { useROICalc, useGuestCounter, useLocalStorage } from '../hooks/hooks.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { analyzeROI } from '../services/aiService.jsx'
import AILoadingState from './AILoadingState.jsx'
import BurnRate from './BurnRate.jsx'
import HikeVerifier from './HikeVerifier.jsx'
import PitchBoss from './PitchBoss.jsx'
import ShareROICard from './ShareROICard.jsx'

const FH = "'Bricolage Grotesque','Plus Jakarta Sans',sans-serif"
const FM = "'Commit Mono','JetBrains Mono',monospace"
const FB = "'Inter',sans-serif"
const TT = { duration: 0.28, ease: [0.4, 0, 0.2, 1] }

function SliderInput({ label, value, min, max, step=1, onChange, prefix='', suffix='', color='var(--indigo)', note }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
        <span style={{ fontFamily: FM, fontSize: '15px', fontWeight: '700', color, letterSpacing: '-0.02em' }}>
          {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="slider" style={{ accentColor: color }} />
      {note && <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '4px', fontFamily: FB }}>{note}</div>}
    </div>
  )
}

function StatCard({ label, value, sub, color, delay=0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...TT, delay }}
      style={{ padding: '14px', borderRadius: '12px', background: color + '08', border: '1px solid ' + color + '22', textAlign: 'center' }}>
      <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>{label}</div>
      <div style={{ fontFamily: FM, fontSize: 'clamp(0.85rem,2vw,1.35rem)', fontWeight: '700', color, letterSpacing: '-0.03em' }}>{value}</div>
      {sub && <div style={{ fontSize: '10px', color: 'var(--text-4)', marginTop: '4px', fontFamily: FB, lineHeight: '1.4' }}>{sub}</div>}
    </motion.div>
  )
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px' }}>
      <div style={{ fontFamily: FM, fontSize: '10px', color: 'var(--text-4)', marginBottom: '5px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.color }} />
          <span style={{ fontFamily: FM, fontSize: '12px', color: 'var(--text-2)' }}>
            {p.name}: {p.value >= 0 ? '+' : ''}₹{p.value}K
          </span>
        </div>
      ))}
    </div>
  )
}

function AIResult({ result, certName, onReset }) {
  const vc = result.verdict?.toLowerCase().includes('strong') ? '#10B981'
    : result.verdict?.toLowerCase().includes('moderate') ? '#F59E0B' : '#EF4444'
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={TT}
      style={{ marginTop: '14px', borderRadius: '14px', background: 'var(--surface)', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', background: vc + '0d', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>AI VERDICT · {(certName || '').toUpperCase()}</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: vc, fontFamily: FH, lineHeight: '1.4' }}>{result.verdict}</div>
        </div>
        <button onClick={onReset} style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', padding: '4px', flexShrink: 0 }}>
          <RefreshCw size={13} />
        </button>
      </div>
      {(result.breakEven || result.projection) && (
        <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '10px' }}>
          {result.breakEven && (
            <div style={{ padding: '10px 12px', borderRadius: '9px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: FM, fontSize: '9px', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>⏱ BREAK-EVEN</div>
              <div style={{ fontSize: '12px', color: 'var(--text-2)', fontFamily: FB, lineHeight: '1.6' }}>{result.breakEven}</div>
            </div>
          )}
          {result.projection && (
            <div style={{ padding: '10px 12px', borderRadius: '9px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: FM, fontSize: '9px', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>📈 5-YR PROJECTION</div>
              <div style={{ fontSize: '12px', color: 'var(--text-2)', fontFamily: FB, lineHeight: '1.6' }}>{result.projection}</div>
            </div>
          )}
        </div>
      )}
      {result.demand?.length > 0 && (
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--indigo-light)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '7px' }}>MARKET DEMAND</div>
          {result.demand.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
              <span style={{ color: 'var(--indigo-light)', fontFamily: FM, fontSize: '11px', flexShrink: 0 }}>◆</span>
              <span style={{ fontSize: '12px', color: 'var(--text-2)', fontFamily: FB, lineHeight: '1.5' }}>{d}</span>
            </div>
          ))}
        </div>
      )}
      {result.risks?.length > 0 && (
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ fontFamily: FM, fontSize: '9px', color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '7px' }}>RISKS</div>
          {result.risks.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
              <AlertTriangle size={11} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-2)', fontFamily: FB, lineHeight: '1.5' }}>{r}</span>
            </div>
          ))}
        </div>
      )}
      {result.bottomLine && (
        <div style={{ margin: '0 16px 16px', padding: '10px 13px', borderRadius: '9px', background: vc + '0d', border: '1px solid ' + vc + '22' }}>
          <div style={{ fontFamily: FM, fontSize: '9px', color: vc, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>BOTTOM LINE</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: vc, fontFamily: FH }}>{result.bottomLine}</div>
        </div>
      )}
    </motion.div>
  )
}

function Hero({ mode = 'professional', prefilledCert = '', resumeName = '', resumeCity = '' }) {
  const isStudent = mode === 'student'
  const [domain,       setDomain]       = useState('all')
  const [certName,     setCertName]     = useState(prefilledCert || '')
  const [selectedCert, setSelectedCert] = useState(null)
  const [aiResult,     setAiResult]     = useState(null)
  const [aiLoading,    setAiLoading]    = useState(false)
  const [aiError,      setAiError]      = useState(null)
  const [showBurnRate, setShowBurnRate] = useState(false)
  const [showVerifier, setShowVerifier] = useState(false)
  const [cooldown,     setCooldown]     = useState(0)
  const [salary,      setSalary]      = useLocalStorage('croi_salary', isStudent ? 0 : 8)
  const [certCost,    setCertCost]    = useLocalStorage('croi_cert_cost', 2)
  const [hikePercent, setHikePercent] = useLocalStorage('croi_hike_percent', 30)
  const { user } = useAuth()
  const guest    = useGuestCounter(GUEST_FREE_LIMIT)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(v => v - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  useEffect(() => {
    if (!prefilledCert) return
    setCertName(prefilledCert)
    const found = CERTIFICATIONS.find(c =>
      c.name.toLowerCase().includes(prefilledCert.toLowerCase()) ||
      prefilledCert.toLowerCase().includes(c.name.toLowerCase())
    )
    if (found) {
      setSelectedCert(found)
      setCertCost(found.avgCost / 100000)
      setHikePercent(found.avgHike)
    }
  }, [prefilledCert])

  useEffect(() => { if (isStudent) setSalary(0) }, [isStudent])

  const roi = useROICalc({ currentSalary: salary, certCost, hikePercent })
  const filteredCerts = CERTIFICATIONS.filter(c => domain === 'all' || c.domain === domain)
  const dc = d => d === 'Very High' ? '#10B981' : d === 'High' ? '#51B1E7' : d === 'Medium' ? '#F59E0B' : '#94A3B8'

  const pickCert = useCallback(cert => {
    setSelectedCert(cert)
    setCertName(cert.name)
    setCertCost(cert.avgCost / 100000)
    setHikePercent(cert.avgHike)
    setAiResult(null)
    setAiError(null)
  }, [])

  const analyse = useCallback(async () => {
    if (!certName.trim())        { setAiError('Select a certification first'); return }
    if (!user && guest.exceeded) { setAiError('Free limit reached — sign in for unlimited'); return }
    if (cooldown > 0)            return
    setAiLoading(true); setAiResult(null); setAiError(null)
    try {
      const r = await analyzeROI({ certName, currentSalary: salary, certCost, hikePercent, isStudent })
      setAiResult(r)
      if (!user) guest.increment()
      setCooldown(10)
    } catch (e) {
      setAiError(e.message?.includes('endpoint not found')
        ? 'Run: vercel dev to enable AI' : e.message || 'Analysis failed')
    } finally { setAiLoading(false) }
  }, [certName, salary, certCost, hikePercent, isStudent, user, guest, cooldown])

  const firstName   = resumeName ? resumeName.split(' ')[0] : ''
  const displayCity = resumeCity || ''
  const canAnalyse  = certName && (user || !guest.exceeded) && cooldown === 0

  return (
    <div>
      {(firstName || displayCity || prefilledCert) && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={TT}
          style={{ marginBottom: '14px', padding: '11px 14px', borderRadius: '11px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {firstName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={13} color="#818CF8" />
              <span style={{ fontSize: '13px', color: 'var(--text)', fontFamily: FH, fontWeight: '700' }}>Hey {firstName} 👋</span>
            </div>
          )}
          {displayCity && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={11} color="#51B1E7" />
              <span style={{ fontSize: '12px', color: '#51B1E7', fontFamily: FM }}>{displayCity}</span>
            </div>
          )}
          {prefilledCert && (
            <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--indigo-light)', fontFamily: FM, padding: '2px 7px', borderRadius: '4px', background: 'var(--indigo-dim)', border: '1px solid var(--border-accent)' }}>
              ← from Resume AI
            </span>
          )}
        </motion.div>
      )}

      {!user && (
        <div style={{ marginBottom: '12px', padding: '8px 12px', borderRadius: '9px', background: guest.exceeded ? 'rgba(239,68,68,0.07)' : 'var(--indigo-dim)', border: '1px solid ' + (guest.exceeded ? 'rgba(239,68,68,0.25)' : 'var(--border-accent)'), display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: guest.exceeded ? '#EF4444' : 'var(--indigo-light)', fontFamily: FB }}>
            {guest.exceeded ? 'Free AI analyses used — sign in for unlimited' : guest.remaining + ' free AI ' + (guest.remaining === 1 ? 'analysis' : 'analyses') + ' left'}
          </span>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: FM, fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Pick Your Certification</div>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {CERT_DOMAINS.map(d => (
            <button key={d.id} onClick={() => setDomain(d.id)}
              style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer', fontFamily: FB, fontWeight: '600', transition: 'all 0.18s', background: domain === d.id ? 'var(--indigo-dim)' : 'var(--surface)', border: '1px solid ' + (domain === d.id ? 'var(--border-accent)' : 'var(--border)'), color: domain === d.id ? 'var(--indigo-light)' : 'var(--text-4)', whiteSpace: 'nowrap' }}>
              {d.label}
            </button>
          ))}
        </div>
        <div className="cert-pill-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '130px', overflowY: 'auto', paddingBottom: '4px' }}>
          {filteredCerts.map(cert => {
            const active = certName === cert.name
            return (
              <motion.button key={cert.id} onClick={() => pickCert(cert)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: FB, fontWeight: active ? '700' : '500', transition: 'all 0.18s', background: active ? 'var(--indigo-dim)' : 'var(--surface)', border: '1px solid ' + (active ? 'var(--border-accent)' : 'var(--border)'), color: active ? 'var(--indigo-light)' : 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: dc(cert.demand), flexShrink: 0 }} />
                {cert.name}
                {cert.avgHike >= 35 && <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', color: '#10B981', fontFamily: FM }}>HOT</span>}
              </motion.button>
            )
          })}
        </div>
        {selectedCert && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={TT}
            style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '9px', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: FH, fontWeight: '700', fontSize: '12px', color: 'var(--indigo-light)' }}>{selectedCert.name}</span>
            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: dc(selectedCert.demand) + '15', color: dc(selectedCert.demand), fontFamily: FM }}>{selectedCert.demand}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: FB }}>{selectedCert.forWho}</span>
            <a href={selectedCert.link} target="_blank" rel="noopener noreferrer"
              style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--indigo-light)', fontFamily: FM, textDecoration: 'none' }}>OFFICIAL ↗</a>
          </motion.div>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '18px', borderRadius: '13px', background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>
        {isStudent ? (
          <div style={{ marginBottom: '16px', padding: '11px 13px', borderRadius: '9px', background: 'rgba(129,140,248,0.07)', border: '1px solid rgba(129,140,248,0.2)' }}>
            <div style={{ fontSize: '11px', color: '#818CF8', fontFamily: FM, marginBottom: '3px' }}>STUDENT MODE — NO SALARY YET</div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: FB }}>Target: ₹4.8L first offer · ROI from career investment</div>
          </div>
        ) : (
          <SliderInput label="Current Salary" value={salary} min={2} max={40} step={0.5}
            onChange={setSalary} prefix="₹" suffix="L/yr" color="#51B1E7"
            note={'₹' + (salary * 100000).toLocaleString('en-IN') + ' per year' + (displayCity ? ' · ' + displayCity : '')} />
        )}
        <SliderInput label="Cert Cost" value={certCost} min={0} max={6} step={0.1}
          onChange={setCertCost} prefix="₹" suffix="L" color="#6366F1"
          note={'₹' + (certCost * 100000).toLocaleString('en-IN') + ' total investment'} />
        {!isStudent && (
          <SliderInput label="Expected Hike" value={hikePercent} min={5} max={80} step={5}
            onChange={setHikePercent} suffix="%" color="#10B981"
            note="After cert + job switch. India median: 25–40%" />
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={salary + '-' + certCost + '-' + hikePercent + '-' + mode}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          {isStudent ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px', marginBottom: '12px' }}>
              <StatCard label="Target Offer" value="₹4.8L+"                              color="#818CF8" delay={0}    />
              <StatCard label="Est. Time"    value={Math.ceil(certCost * 12 + 3) + ' mo'} color="#10B981" delay={0.05} />
              <StatCard label="Investment"   value={'₹' + certCost + 'L'}                 color="#F59E0B" delay={0.1}  />
              {roi.careerMultiplier && <StatCard label="Career Multiplier" value={roi.careerMultiplier + 'x'} color="#51B1E7" delay={0.15} />}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px', marginBottom: '12px' }}>
              <StatCard label="New Salary"    value={'₹' + roi.newSalaryL + 'L/yr'}                                                 color="#51B1E7" delay={0}    />
              <StatCard label="Break-even"    value={roi.breakEvenMonths > 0 ? roi.breakEvenMonths + ' mo' : '—'} sub={roi.anchor}  color="#F59E0B" delay={0.05} />
              <StatCard label="5-Yr Net Gain" value={'₹' + roi.fiveYearGainL + 'L'}                                                  color="#10B981" delay={0.1}  />
              <StatCard label="Monthly +"     value={'₹' + roi.monthlyGainK + 'K'}                                                   color="#818CF8" delay={0.15} />
            </div>
          )}
          {!isStudent && (
            <div style={{ marginBottom: '16px', padding: '9px 12px', borderRadius: '9px', background: roi.roiPercent > 200 ? 'rgba(16,185,129,0.07)' : roi.roiPercent > 0 ? 'var(--indigo-dim)' : 'rgba(239,68,68,0.07)', border: '1px solid ' + (roi.roiPercent > 200 ? 'rgba(16,185,129,0.2)' : roi.roiPercent > 0 ? 'var(--border-accent)' : 'rgba(239,68,68,0.2)'), display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={13} color={roi.roiPercent > 200 ? '#10B981' : roi.roiPercent > 0 ? 'var(--indigo-light)' : '#EF4444'} />
              <span style={{ fontFamily: FM, fontSize: '12px', color: roi.roiPercent > 200 ? '#10B981' : roi.roiPercent > 0 ? 'var(--indigo-light)' : '#EF4444', fontWeight: '700' }}>
                5-Year ROI: {roi.roiPercent}% · {roi.anchor}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {!isStudent && roi.chartData?.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '16px', borderRadius: '13px', background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>CUMULATIVE GAIN · 24 MONTHS</div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={roi.chartData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.05)" />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--text-4)', fontFamily: FM }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-4)', fontFamily: FM }} axisLine={false} tickLine={false} tickFormatter={v => '₹' + v + 'K'} />
              <Tooltip content={<ChartTip />} />
              <ReferenceLine y={0} stroke="rgba(99,102,241,0.08)" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="action"   name="With Cert" stroke="#10B981" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#10B981' }} />
              <Line type="monotone" dataKey="inaction" name="Inaction"  stroke="#475569" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        {aiError && (
          <div style={{ marginBottom: '10px', padding: '9px 12px', borderRadius: '9px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '12px', color: '#EF4444', fontFamily: FB }}>
            {aiError}
          </div>
        )}
        {!aiResult && !aiLoading && (
          <motion.button onClick={analyse}
            disabled={!canAnalyse}
            whileHover={canAnalyse ? { y: -3, scale: 1.02 } : {}}
            whileTap={canAnalyse ? { scale: 0.97 } : {}}
            style={{ width: '100%', padding: '14px 22px', borderRadius: '12px', background: cooldown > 0 ? 'var(--surface)' : 'linear-gradient(135deg,#6366F1,#4338CA)', border: cooldown > 0 ? '1px solid var(--border)' : 'none', color: cooldown > 0 ? 'var(--text-4)' : 'white', fontSize: '14px', fontWeight: '700', cursor: canAnalyse ? 'pointer' : 'not-allowed', fontFamily: FH, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: !certName || (!user && guest.exceeded) ? 0.45 : 1, letterSpacing: '-0.01em', transition: 'all 0.3s' }}>
            {cooldown > 0 ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--indigo)', flexShrink: 0 }} />
                {'Cooling down ' + cooldown + 's'}
              </>
            ) : (
              <>
                <Zap size={15} />
                Get AI ROI Analysis
                {!user && !guest.exceeded && (
                  <span style={{ fontSize: '10px', opacity: 0.75, fontFamily: FM }}>({guest.remaining} free)</span>
                )}
              </>
            )}
          </motion.button>
        )}
        {aiLoading && <AILoadingState certName={certName} />}
        {aiResult  && <AIResult result={aiResult} certName={certName} onReset={() => setAiResult(null)} />}
      </div>

      {certName && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <button onClick={() => setShowBurnRate(v => !v)}
            style={{ padding: '7px 12px', borderRadius: '8px', background: showBurnRate ? 'rgba(245,158,11,0.1)' : 'var(--surface)', border: '1px solid ' + (showBurnRate ? 'rgba(245,158,11,0.3)' : 'var(--border)'), color: showBurnRate ? '#F59E0B' : 'var(--text-3)', fontSize: '12px', cursor: 'pointer', fontFamily: FB, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.18s' }}>
            <Flame size={12} /> Study Tracker
          </button>
          <button onClick={() => setShowVerifier(v => !v)}
            style={{ padding: '7px 12px', borderRadius: '8px', background: showVerifier ? 'rgba(16,185,129,0.1)' : 'var(--surface)', border: '1px solid ' + (showVerifier ? 'rgba(16,185,129,0.25)' : 'var(--border)'), color: showVerifier ? '#10B981' : 'var(--text-3)', fontSize: '12px', cursor: 'pointer', fontFamily: FB, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.18s' }}>
            <CheckCircle size={12} /> Verify My Hike
          </button>
        </div>
      )}

      <AnimatePresence>
        {showBurnRate && certName && (
          <motion.div key="br" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={TT}
            style={{ marginBottom: '10px', padding: '16px', borderRadius: '13px', background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>
            <BurnRate certName={certName} breakEvenMonths={roi.breakEvenMonths || 6} />
          </motion.div>
        )}
        {showVerifier && certName && (
          <motion.div key="hv" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={TT}>
            <HikeVerifier certName={certName} projectedHike={hikePercent} onClose={() => setShowVerifier(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {certName && (
        <div>
          <PitchBoss certName={certName} salary={salary} certCost={certCost}
            hikePercent={hikePercent} name={resumeName} mode={mode} />
          {!isStudent && roi.breakEvenMonths > 0 && (
            <ShareROICard certName={certName} name={resumeName}
              breakEven={roi.breakEvenMonths} fiveYearGain={roi.fiveYearGainL}
              monthlyGain={roi.monthlyGainK} roiPercent={roi.roiPercent}
              newSalary={roi.newSalaryL} />
          )}
        </div>
      )}
    </div>
  )
}

export default Hero