import { motion } from 'framer-motion'
import { GraduationCap, Repeat, Briefcase } from 'lucide-react'
import NeonCard from './NeonCard.jsx'

const MODES = [
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student',
    subtitle: 'No job yet',
    desc: 'Path to first ₹4.8L offer',
    color: '#818CF8',
  },
  {
    id: 'switcher',
    icon: Repeat,
    title: 'Career Switcher',
    subtitle: 'Changing fields',
    desc: 'Bridge skills, max hike',
    color: '#F59E0B',
  },
  {
    id: 'professional',
    icon: Briefcase,
    title: 'Professional',
    subtitle: 'Levelling up',
    desc: 'Max ROI on next cert',
    color: '#10B981',
  },
]

const ModeSelector = ({ activeMode, onChange }) => (
  <div style={{ marginBottom: '24px' }}>
    <div style={{
      fontSize: '11px',
      color: 'var(--text-3)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: '12px',
      fontFamily: 'JetBrains Mono, monospace',
      fontWeight: '600',
    }}>
      Who are you?
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }} className="mode-selector-grid">
      {MODES.map((m, i) => {
        const active = activeMode === m.id
        return (
          <NeonCard
            key={m.id}
            color={m.color}
            delay={i * 0.3}
            speed={active ? 0.04 : 0.015}
            animate={active}
            borderRadius="12px"
            onClick={() => onChange(m.id)}
            style={{ cursor: 'pointer' }}
          >
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '18px 14px',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '10px',
                background: active ? `${m.color}22` : 'var(--surface)',
                border: `1px solid ${active ? m.color + '44' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
                transition: 'all 0.25s',
              }}>
                <m.icon size={18} color={active ? m.color : 'var(--text-4)'} />
              </div>

              <div style={{
                fontSize: '14px',
                fontWeight: '800',
                color: active ? m.color : 'var(--text)',
                marginBottom: '3px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                transition: 'color 0.2s',
              }}>
                {m.title}
              </div>

              <div style={{
                fontSize: '11px',
                color: active ? m.color + 'cc' : 'var(--text-3)',
                marginBottom: '6px',
                fontFamily: 'Inter, sans-serif',
                transition: 'color 0.2s',
              }}>
                {m.subtitle}
              </div>

              <div style={{
                fontSize: '11px',
                color: 'var(--text-4)',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.4',
              }}>
                {m.desc}
              </div>
            </motion.div>
          </NeonCard>
        )
      })}
    </div>
  </div>
)

export default ModeSelector