import { motion } from 'framer-motion'
import WaveBg from './WaveBg.jsx'
import { MarketingFooter } from './MarketingPageShell.jsx'

const F_HEAD = "'EB Garamond','Cormorant Garamond',Georgia,serif"
const F_BODY = "'Inter','DM Sans',sans-serif"
const F_MONO = "'JetBrains Mono','IBM Plex Mono',monospace"
const T = { duration: 0.32, ease: [0.4, 0, 0.2, 1] }

export default function ToolPageWrapper({
  title,
  subtitle,
  description,
  children,
  eyebrow = 'TOOLS',
  footer = true,
}) {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'var(--bg)', color: 'var(--text)' }}>
      <WaveBg variant="landing" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '120px 24px 0' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: '48px', maxWidth: '880px' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '18px', fontFamily: F_MONO, fontSize: '11px', color: 'var(--text-4)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              <div style={{ width: '28px', height: '1px', background: 'var(--border)' }} />
              {eyebrow}
              <div style={{ width: '28px', height: '1px', background: 'var(--border)' }} />
            </div>
            <h1 style={{
              fontFamily: F_HEAD,
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: '400',
              color: 'var(--text)',
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              marginBottom: '16px',
            }}>
              {title}
              {subtitle ? <><br /><span style={{ color: 'var(--indigo)', fontStyle: 'italic' }}>{subtitle}</span></> : null}
            </h1>
            {description ? (
              <p style={{
                fontFamily: F_BODY,
                fontSize: '15px',
                color: 'var(--text-2)',
                lineHeight: 1.7,
                maxWidth: '56ch',
                margin: 0,
              }}>
                {description}
              </p>
            ) : null}
          </motion.div>
        </div>

        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px 0' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={T}
          >
            {children}
          </motion.div>
        </div>

        {footer ? <MarketingFooter /> : null}
      </div>
    </div>
  )
}
