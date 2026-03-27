import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Copy, Check, Zap, ChevronDown } from 'lucide-react'
import { callGroqForPitch } from '../services/aiService.jsx'

const F_HEAD = "'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif"
const F_MONO = "'Commit Mono', 'JetBrains Mono', monospace"
const F_BODY = "'Inter', sans-serif"
const T = { duration: 0.28, ease: [0.4, 0, 0.2, 1] }

const buildPitchPrompt = ({ certName, salary, certCost, hikePercent, name, company, role }) => `
You are a professional email writer helping an Indian tech professional pitch their certification to their manager.

Person: ${name || 'Professional'}
Current role: ${role || 'Software Engineer'}
Company: ${company || 'their company'}
Certification: ${certName}
Current salary: ₹${salary}L/yr
Cert cost: ₹${(certCost * 100000).toLocaleString('en-IN')}
Expected hike after cert: ${hikePercent}%

Write a professional, concise email to their manager requesting company sponsorship for this certification.

Rules:
- Subject line first, then email body
- Tone: professional but confident, not grovelling
- Include: business case (ROI for company, not just personal gain), cost, timeline, commitment to share learnings
- India-specific: mention Naukri/LinkedIn demand signal, mention staying with company post-cert
- Length: under 200 words total
- Format: Subject: [subject line] then blank line then email body
- No fluff, no "I hope this email finds you well"
- End with: Best regards, ${name || '[Your Name]'}
`

const PitchBoss = ({ certName, salary, certCost, hikePercent, name, mode }) => {
  const [open,     setOpen]     = useState(false)
  const [company,  setCompany]  = useState('')
  const [role,     setRole]     = useState('')
  const [email,    setEmail]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [copied,   setCopied]   = useState(false)
  const [error,    setError]    = useState(null)

  // Only show for professional and switcher
  if (mode === 'student') return null

  const handleGenerate = async () => {
    setLoading(true); setError(null); setEmail('')
    try {
      const text = await callGroqForPitch(null, buildPitchPrompt({ certName, salary, certCost, hikePercent, name, company, role }))
      setEmail(text)
    } catch (e) {
      setError(e.message || 'Failed to generate. Check API connection.')
    } finally { setLoading(false) }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const [subject, ...bodyLines] = email.split('\n')
  const body = bodyLines.join('\n').trim()

  return (
    <div style={{ marginTop: '8px' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', padding: '9px 14px', borderRadius: '9px', background: open ? 'rgba(129,140,248,0.1)' : 'var(--surface)', border: `1px solid ${open ? 'rgba(129,140,248,0.3)' : 'var(--border)'}`, color: open ? '#818CF8' : 'var(--text-3)', fontSize: '12px', cursor: 'pointer', fontFamily: F_BODY, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.18s' }}
      >
        <Mail size={13} />
        Pitch My Boss
        <span style={{ marginLeft: 'auto', fontSize: '11px', opacity: 0.6, fontFamily: F_MONO }}>get company to pay</span>
        <ChevronDown size={12} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={T} style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '16px', marginTop: '8px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid rgba(129,140,248,0.2)' }}>

              <div style={{ fontFamily: F_MONO, fontSize: '9px', color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={10} /> AI EMAIL GENERATOR · {certName?.toUpperCase()}
              </div>

              {/* Optional inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-4)', fontFamily: F_MONO, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Company (optional)</div>
                  <input
                    value={company} onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Infosys"
                    style={{ width: '100%', padding: '8px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '13px', fontFamily: F_BODY, outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#818CF855'}
                    onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-4)', fontFamily: F_MONO, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your Role (optional)</div>
                  <input
                    value={role} onChange={e => setRole(e.target.value)}
                    placeholder="e.g. Senior Dev"
                    style={{ width: '100%', padding: '8px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '13px', fontFamily: F_BODY, outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#818CF855'}
                    onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>

              {error && (
                <div style={{ padding: '9px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '12px', color: '#EF4444', fontFamily: F_BODY, marginBottom: '10px' }}>
                  {error}
                </div>
              )}

              {!email && !loading && (
                <motion.button
                  onClick={handleGenerate}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ width: '100%', padding: '11px', borderRadius: '9px', background: 'linear-gradient(135deg, #6366F1, #4338CA)', border: 'none', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: F_HEAD, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', letterSpacing: '-0.01em' }}
                >
                  <Zap size={14} /> Generate Pitch Email
                </motion.button>
              )}

              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #6366F1', borderTopColor: 'transparent' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: F_BODY }}>Writing your pitch...</span>
                </div>
              )}

              {email && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={T}>
                  {/* Subject */}
                  {subject?.startsWith('Subject:') && (
                    <div style={{ padding: '9px 12px', borderRadius: '8px', background: 'rgba(129,140,248,0.07)', border: '1px solid rgba(129,140,248,0.18)', marginBottom: '10px' }}>
                      <div style={{ fontSize: '9px', color: '#818CF8', fontFamily: F_MONO, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>Subject</div>
                      <div style={{ fontSize: '13px', color: 'var(--text)', fontFamily: F_HEAD, fontWeight: '700' }}>{subject.replace('Subject:', '').trim()}</div>
                    </div>
                  )}

                  {/* Body */}
                  <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', marginBottom: '10px' }}>
                    <pre style={{ fontSize: '13px', color: 'var(--text-2)', fontFamily: F_BODY, lineHeight: '1.7', whiteSpace: 'pre-wrap', margin: 0 }}>
                      {body || email}
                    </pre>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button
                      onClick={handleCopy}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      style={{ flex: 1, padding: '9px', borderRadius: '8px', background: copied ? 'rgba(16,185,129,0.1)' : 'var(--surface)', border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, color: copied ? '#10B981' : 'var(--text-2)', fontSize: '12px', cursor: 'pointer', fontFamily: F_BODY, fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? 'Copied!' : 'Copy Email'}
                    </motion.button>
                    <button
                      onClick={() => { setEmail(''); setError(null) }}
                      style={{ padding: '9px 14px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-4)', fontSize: '12px', cursor: 'pointer', fontFamily: F_BODY }}
                    >
                      Regenerate
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PitchBoss