import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, FileText, Briefcase, Target, AlertTriangle, CheckCircle } from 'lucide-react'
import { callGroqForGapAnalysis } from '../services/aiService.jsx'

const FM = "'JetBrains Mono',monospace"
const FB = "'Inter',sans-serif"
const FH = "'Bricolage Grotesque',sans-serif"
const EMERALD = '#10B981'
const INDIGO = '#6366F1'
const AMBER = '#F59E0B'

export default function GapAnalyzer() {
  const [resume, setResume] = useState('')
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const analyze = async () => {
    if (!resume.trim() || !jd.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const prompt = `
      Compare this Resume to the Job Description.
      RESUME:
      ${resume.slice(0, 1500)}
      
      JOB DESCRIPTION:
      ${jd.slice(0, 1500)}
      
      Respond in EXACTLY this format, no extra text:
      **MATCH SCORE:** [0-100]%
      **MISSING SKILLS:**
      - [Skill 1]
      - [Skill 2]
      - [Skill 3]
      **RECOMMENDED CERTS:**
      - [Cert Name 1]: [Why it helps]
      - [Cert Name 2]: [Why it helps]
      **VERDICT:** [One sentence on whether they should apply now or upskill first]
      `
      
      const text = await callGroqForGapAnalysis(null, prompt)
      
      const get = (p) => { const m = text.match(p); return m ? m[1].trim() : '' }
      const getBullets = (p) => {
        const m = text.match(p)
        if (!m) return []
        return m[1].split('\n').filter(l => l.trim().match(/^[•\-\*]/)).map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean)
      }

      setResult({
        score: get(/\*\*MATCH SCORE:\*\*\s*(.+?)(?=\n\*\*|\n\n|$)/s),
        skills: getBullets(/\*\*MISSING SKILLS:\*\*\s*([\s\S]+?)(?=\n\*\*RECOMMENDED)/s),
        certs: getBullets(/\*\*RECOMMENDED CERTS:\*\*\s*([\s\S]+?)(?=\n\*\*VERDICT)/s),
        verdict: get(/\*\*VERDICT:\*\*\s*(.+?)(?=\n\*\*|\n\n|$)/s),
      })
    } catch(e) {
      setError(e.message || "Analysis failed. Please check your API connection.")
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '16px', background: 'var(--bg)', border: '1px solid var(--border)', 
    borderRadius: '16px', color: 'var(--text)', fontSize: '13px', fontFamily: FB, 
    outline: 'none', transition: 'border-color 0.2s', resize: 'vertical', minHeight: '160px',
    lineHeight: '1.6'
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Resume Input */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <FileText size={16} color={INDIGO} />
            <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your Resume</span>
          </div>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            placeholder="Paste your resume text or LinkedIn summary here..."
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = INDIGO + '66'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* JD Input */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Briefcase size={16} color={EMERALD} />
            <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Target Job Description</span>
          </div>
          <textarea
            value={jd}
            onChange={e => setJd(e.target.value)}
            placeholder="Paste the Job Description you want to apply for..."
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = EMERALD + '66'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      <motion.button
        onClick={analyze}
        disabled={loading || !resume.trim() || !jd.trim()}
        whileHover={(resume.trim() && jd.trim()) ? { y: -2, scale: 1.01 } : {}}
        whileTap={(resume.trim() && jd.trim()) ? { scale: 0.98 } : {}}
        style={{ width: '100%', padding: '16px', borderRadius: '100px', background: (resume.trim() && jd.trim()) ? `linear-gradient(135deg, ${INDIGO}, #4338CA)` : 'var(--surface)', border: (resume.trim() && jd.trim()) ? 'none' : '1px solid var(--border)', color: (resume.trim() && jd.trim()) ? 'white' : 'var(--text-4)', fontSize: '14px', fontWeight: '700', cursor: (resume.trim() && jd.trim()) ? 'pointer' : 'not-allowed', fontFamily: FH, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s' }}
      >
        {loading ? <div className="pulse-dot" /> : <Sparkles size={16} />}
        {loading ? 'Analyzing Gap...' : 'Find Missing Certifications'}
      </motion.button>

      {error && (
        <div style={{ marginTop: '16px', padding: '12px', borderRadius: '12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: '13px', fontFamily: FB, textAlign: 'center' }}>
          {error}
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Score & Verdict */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '24px', borderRadius: '20px', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: FM, fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Keyword Match</div>
                <div style={{ fontFamily: FH, fontSize: '3rem', fontWeight: '800', color: INDIGO, lineHeight: 1 }}>{result.score}</div>
              </div>
              <div style={{ padding: '24px', borderRadius: '20px', background: `${EMERALD}0a`, border: `1px solid ${EMERALD}33`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: FM, fontSize: '10px', color: EMERALD, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Target size={12} /> Verdict</div>
                <div style={{ fontFamily: FB, fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.6' }}>{result.verdict}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {/* Missing Skills */}
              <div style={{ padding: '24px', borderRadius: '20px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: FM, fontSize: '10px', color: AMBER, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={12} /> Missing Skills</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.skills.map((skill, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontFamily: FB, fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.5' }}>
                      <span style={{ color: AMBER, marginTop: '2px' }}>×</span> {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Certs */}
              <div style={{ padding: '24px', borderRadius: '20px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: FM, fontSize: '10px', color: INDIGO, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={12} /> Recommended Certifications</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {result.certs.map((cert, i) => {
                    const [name, why] = cert.split(':')
                    return (
                      <div key={i} style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <div style={{ fontFamily: FH, fontSize: '13px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle size={12} color={EMERALD} /> {name}
                        </div>
                        <div style={{ fontFamily: FB, fontSize: '12px', color: 'var(--text-4)', lineHeight: '1.5' }}>
                          {why}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}