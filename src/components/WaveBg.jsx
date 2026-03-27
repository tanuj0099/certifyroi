import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const W1 = "M0,420 C200,375 400,465 600,415 C800,365 1000,450 1200,405 C1320,378 1380,395 1440,385 L1440,900 L0,900 Z"
const W2 = "M0,565 C180,530 360,600 540,562 C720,524 900,592 1080,552 C1220,522 1340,550 1440,538 L1440,900 L0,900 Z"
const W3 = "M0,695 C200,668 400,722 600,692 C800,662 1000,708 1200,675 C1320,658 1380,672 1440,665 L1440,900 L0,900 Z"

// Dark theme wave configs
const DARK = {
  landing: [
    { path: W1, c1: '#6366F1', c2: '#818CF8', c3: '#10B981', o: 0.055, dur: 20, dy: 22, delay: 0   },
    { path: W2, c1: '#10B981', c2: '#51B1E7', c3: '#6366F1', o: 0.040, dur: 25, dy: 16, delay: 1.5 },
    { path: W3, c1: '#51B1E7', c2: '#818CF8', c3: '#10B981', o: 0.030, dur: 16, dy: 12, delay: 0.8 },
  ],
  app: [
    { path: W1, c1: '#F59E0B', c2: '#EF4444', c3: '#6366F1', o: 0.10, dur: 18, dy: 22, delay: 0   },
    { path: W2, c1: '#6366F1', c2: '#A78BFA', c3: '#51B1E7', o: 0.08, dur: 22, dy: 16, delay: 1.5 },
    { path: W3, c1: '#10B981', c2: '#51B1E7', c3: '#F59E0B', o: 0.07, dur: 14, dy: 12, delay: 0.8 },
  ],
}

// Light theme wave configs — more vivid, warm tones
const LIGHT = {
  landing: [
    { path: W1, c1: '#6366F1', c2: '#818CF8', c3: '#10B981', o: 0.12, dur: 20, dy: 22, delay: 0   },
    { path: W2, c1: '#10B981', c2: '#51B1E7', c3: '#6366F1', o: 0.09, dur: 25, dy: 16, delay: 1.5 },
    { path: W3, c1: '#51B1E7', c2: '#818CF8', c3: '#10B981', o: 0.07, dur: 16, dy: 12, delay: 0.8 },
  ],
  app: [
    { path: W1, c1: '#F59E0B', c2: '#EF4444', c3: '#6366F1', o: 0.18, dur: 18, dy: 22, delay: 0   },
    { path: W2, c1: '#6366F1', c2: '#A78BFA', c3: '#51B1E7', o: 0.14, dur: 22, dy: 16, delay: 1.5 },
    { path: W3, c1: '#10B981', c2: '#51B1E7', c3: '#F59E0B', o: 0.12, dur: 14, dy: 12, delay: 0.8 },
  ],
}

const WaveBg = ({ variant = 'landing' }) => {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') !== 'light'
  )

  // Watch data-theme changes
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  const waves = isDark ? DARK[variant] : LIGHT[variant]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      >
        <defs>
          {waves.map((w, i) => (
            <linearGradient key={i} id={`wg-${variant}-${isDark ? 'd' : 'l'}-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={w.c1} stopOpacity={w.o} />
              <stop offset="45%"  stopColor={w.c2} stopOpacity={w.o * 1.3} />
              <stop offset="100%" stopColor={w.c3} stopOpacity={w.o * 0.7} />
            </linearGradient>
          ))}
        </defs>
        {waves.map((w, i) => (
          <motion.path
            key={`${isDark}-${i}`}
            d={w.path}
            fill={`url(#wg-${variant}-${isDark ? 'd' : 'l'}-${i})`}
            animate={{ y: [-w.dy / 2, w.dy / 2] }}
            transition={{ duration: w.dur, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror', delay: w.delay }}
          />
        ))}
      </svg>
    </div>
  )
}

export default WaveBg