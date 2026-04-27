import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, Check, MessageCircle, Target, Briefcase } from 'lucide-react'
import { callGroqForNegotiation } from '../services/aiService.jsx'
import Slider from './Slider.jsx'

const FM = "'JetBrains Mono',monospace"
const FB = "'Inter',sans-serif"
const FH = "'Bricolage Grotesque',sans-serif"
const EMERALD = '#10B981'
const INDIGO = '#6366F1'

export default function SalaryNegotiation() {
  const [certName, setCertName] = useState(localStorage.getItem('croi_prefilled_cert') || '')
  const [targetRole, setTargetRole] = useState('')
  const [hike, setHike] = useState(30)
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!certName.trim()) return
    setLoading(true)
    try {
      const prompt = `Write a conversational, confident 30-second script for me to read to HR or my manager to negotiate a ${hike}% salary hike. 
      I recently completed the ${certName} certification. 
      Targeting role: ${targetRole || 'Senior/Lead level'}.
      Focus on the value I bring now and industry benchmarks. Do not apologize or sound weak.`
      
      const text = await callGroqForNegotiation(null, prompt)
      setScript(text)
    } catch(e) {
      setScript("Error generating script. Please check API connection and try again.")
    }
    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Certification Completed</div>
        <input
          value={certName}
          onChange={e => setCertName(e.target.value)}
          placeholder="e.g. AWS Solutions Architect"
          style={{ width: '100%', padding: '14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '11px', color: 'var(--text)', fontSize: '14px', fontFamily: FB, outline: 'none', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = INDIGO + '66'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Target Role (Optional)</div>
        <input
          value={targetRole}
          onChange={e => setTargetRole(e.target.value)}
          placeholder="e.g. Cloud Lead, Data Scientist..."
          style={{ width: '100%', padding: '14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '11px', color: 'var(--text)', fontSize: '14px', fontFamily: FB, outline: 'none', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = INDIGO + '66'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <Slider
        label="Target Hike %"
        value={hike}
        min={10} max={100} step={5}
        onChange={setHike}
        suffix="%"
        color={EMERALD}
      />

      <motion.button
        onClick={generate}
        disabled={loading || !certName.trim()}
        whileHover={certName.trim() ? { y: -2, scale: 1.01 } : {}}
        whileTap={certName.trim() ? { scale: 0.98 } : {}}
        style={{ width: '100%', padding: '14px', borderRadius: '100px', background: certName.trim() ? `linear-gradient(135deg, ${INDIGO}, #4338CA)` : 'var(--surface)', border: certName.trim() ? 'none' : '1px solid var(--border)', color: certName.trim() ? 'white' : 'var(--text-4)', fontSize: '14px', fontWeight: '700', cursor: certName.trim() ? 'pointer' : 'not-allowed', fontFamily: FH, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s' }}
      >
        {loading ? <div className="pulse-dot" /> : <Sparkles size={16} />}
        {loading ? 'Drafting Script...' : 'Generate Negotiation Script'}
      </motion.button>

      <AnimatePresence>
        {script && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            style={{ marginTop: '24px', padding: '18px', borderRadius: '16px', background: 'var(--surface)', border: `1px solid ${INDIGO}33` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: INDIGO, fontFamily: FM, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <MessageCircle size={12} /> Live Script
              </div>
              <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: copied ? `${EMERALD}15` : 'var(--bg)', border: `1px solid ${copied ? EMERALD + '40' : 'var(--border)'}`, color: copied ? EMERALD : 'var(--text-3)', fontSize: '12px', cursor: 'pointer', fontFamily: FB, fontWeight: '600', transition: 'all 0.2s' }}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            
            <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: FB, fontSize: '14px', lineHeight: '1.7', color: 'var(--text)' }}>
                {script}
              </pre>
            </div>
            
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-4)', fontFamily: FB, lineHeight: '1.5', textAlign: 'center' }}>
              Read this confidently. Eye contact matters.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}