import { motion } from 'framer-motion'

const F_HEAD = "'Inter', sans-serif"
const F_BODY = "'Inter', sans-serif"
const T = { duration: 0.32, ease: [0.4, 0, 0.2, 1] }

export default function ToolPageWrapper({ 
  title, 
  subtitle, 
  description, 
  children 
}) {
  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '60px 24px 80px',
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '48px' }}
      >
        <h1 style={{
          fontFamily: F_HEAD,
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '800',
          color: 'var(--text)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '16px',
        }}>
          {title}
          {subtitle && (
            <br />
          )}
          {subtitle && (
            <span style={{ color: 'var(--text-3)', fontWeight: '500' }}>
              {subtitle}
            </span>
          )}
        </h1>
        {description && (
          <p style={{
            fontFamily: F_BODY,
            fontSize: '15px',
            color: 'var(--text-2)',
            lineHeight: 1.6,
            maxWidth: '540px',
          }}>
            {description}
          </p>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={T}
      >
        {children}
      </motion.div>
    </div>
  )
}
