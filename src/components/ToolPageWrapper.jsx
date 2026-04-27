import { motion } from 'framer-motion'
import WaveBg from './WaveBg.jsx'
import { MarketingFooter } from './MarketingPageShell.jsx'
import { useThemeContext } from './SharedUI.jsx'
import { useIsMobile } from './SharedUI.jsx'
import VerticalSidebar from './VerticalSidebar.jsx'

const F_HEAD = "'EB Garamond','Cormorant Garamond',Georgia,serif"
const F_BODY = "'Inter','DM Sans',sans-serif"
const F_MONO = "'JetBrains Mono','IBM Plex Mono',monospace"
const T = { duration: 0.32, ease: [0.4, 0, 0.2, 1] }

function CrosshairIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <line x1="7" y1="1" x2="7" y2="13" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <line x1="1" y1="7" x2="13" y2="7" stroke={color} strokeWidth="0.8" opacity="0.5" />
    </svg>
  )
}

export default function ToolPageWrapper({
  title,
  subtitle,
  description,
  children,
  eyebrow = 'TOOLS',
  footer = true,
  sectionId = '00',
  sectionTitle = 'TOOL',
}) {
  const C = useThemeContext()
  const isMobile = useIsMobile()

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'var(--bg)', color: 'var(--text)' }}>
      <WaveBg variant="landing" />
      
      {/* Vertical ROI Text Sidebar */}
      {!isMobile && <VerticalSidebar text="ROI Analysis for Indian professionals" />}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Main layout with sidebar on desktop */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
          {/* Vertical text sidebar — desktop only */}
          {!isMobile && (
            <div style={{ width: '140px', flexShrink: 0, borderRight: `1px solid var(--border)`, position: 'relative' }}>
              <div style={{ position: 'sticky', top: '120px', padding: '32px 0', display: 'flex', alignItems: 'center', flexDirection: 'column', height: '360px' }}>
                <CrosshairIcon color={C.text4} />
                <div style={{ width: '1px', flex: 1, background: 'var(--border)', margin: '16px 0' }} />
                <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: F_MONO, fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.18em' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: '700' }}>{sectionId}</span>{' '}
                  <span style={{ opacity: 0.5 }}>//</span>{' '}
                  {sectionTitle}
                </div>
                <div style={{ width: '1px', flex: 1, background: 'var(--border)', margin: '16px 0' }} />
                <CrosshairIcon color={C.text4} />
              </div>
            </div>
          )}

          {/* Main content */}
          <div style={{ flex: 1, padding: isMobile ? '56px 24px' : '120px 6vw', position: 'relative', overflow: 'hidden' }}>
            {/* Mobile header - show labels horizontally */}
            {isMobile && (
              <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: F_MONO, fontSize: '11px', color: 'var(--accent)', fontWeight: '700', letterSpacing: '0.12em' }}>{sectionId}</span>
                <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
                <span style={{ fontFamily: F_MONO, fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.12em' }}>{sectionTitle}</span>
              </div>
            )}

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
                {subtitle ? <><br /><span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>{subtitle}</span></> : null}
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

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={T}
            >
              {children}
            </motion.div>
          </div>
        </div>

        {footer ? <MarketingFooter /> : null}
      </div>
    </div>
  )
}
