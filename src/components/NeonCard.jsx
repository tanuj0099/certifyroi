import { useRef, useState } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'

const NeonCard = ({
  children,
  style = {},
  color = '#6366F1',
  delay = 0,
  speed = 0.03,
  animate = true,
  padding = '0',
  borderRadius = '14px',
  onClick,
}) => {
  const [pos, setPos] = useState({ x: 50, y: 0 })
  const angleRef = useRef(delay * 90)

  useAnimationFrame((t) => {
    if (!animate) return
    angleRef.current = (delay * 90 + t * speed) % 360
    const angle = angleRef.current * (Math.PI / 180)
    setPos({
      x: 50 + 52 * Math.cos(angle),
      y: 50 + 52 * Math.sin(angle),
    })
  })

  return (
    <motion.div
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius,
        padding: '1.5px',
        background: animate
          ? `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${color}cc 0%, ${color}55 25%, ${color}11 50%, transparent 70%)`
          : '1px solid var(--border)',
        willChange: 'background',
        ...style,
      }}
    >
      {/* Outer glow */}
      {animate && (
        <div style={{
          position: 'absolute', inset: '-2px', borderRadius,
          background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${color}18 0%, transparent 55%)`,
          filter: 'blur(10px)',
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'background 0.016s',
        }} />
      )}

      {/* Inner card — solid background, no blur */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'var(--glass-bg)',
        borderRadius: `calc(${borderRadius} - 1.5px)`,
        padding,
        height: '100%',
      }}>
        {children}
      </div>
    </motion.div>
  )
}

export default NeonCard