import { useRef } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'

// ── NeonCard ──────────────────────────────────────────────────
// Animated neon border card — zero React re-renders.
// Writes directly to DOM via refs instead of setState.
// Used by: LandingPage, ModeSelector
// ─────────────────────────────────────────────────────────────
const NeonCard = ({
  children,
  style     = {},
  color     = '#6366F1',
  delay     = 0,
  speed     = 0.04,
  animate: shouldAnimate = true,
  borderRadius = '18px',
  onClick,
}) => {
  const outerRef = useRef(null)
  const glowRef  = useRef(null)
  const angleRef = useRef(delay * 60)

  useAnimationFrame(t => {
    if (!shouldAnimate) return
    angleRef.current = (delay * 60 + t * speed) % 360
    const a = angleRef.current * Math.PI / 180
    const x = 50 + 55 * Math.cos(a)
    const y = 50 + 55 * Math.sin(a)
    if (outerRef.current) {
      outerRef.current.style.background =
        `radial-gradient(circle at ${x}% ${y}%, ${color}cc 0%, ${color}44 30%, transparent 65%)`
    }
    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(circle at ${x}% ${y}%, ${color}22 0%, transparent 60%)`
    }
  })

  const innerRadius = `calc(${borderRadius} - 1.5px)`
  const glowRadius  = `calc(${borderRadius} + 1px)`

  return (
    <motion.div
      ref={outerRef}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -3 }}
      style={{
        position: 'relative',
        borderRadius,
        padding: '1.5px',
        background: `radial-gradient(circle at 50% 50%, ${color}${shouldAnimate ? 'cc' : '44'} 0%, ${color}${shouldAnimate ? '44' : '22'} 30%, transparent 65%)`,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      <div ref={glowRef} style={{
        position: 'absolute', inset: '-1px',
        borderRadius: glowRadius,
        background: `radial-gradient(circle at 50% 50%, ${color}22 0%, transparent 60%)`,
        filter: 'blur(10px)', zIndex: 0, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'var(--glass-bg)',
        borderRadius: innerRadius,
        height: '100%',
      }}>
        {children}
      </div>
    </motion.div>
  )
}

export default NeonCard