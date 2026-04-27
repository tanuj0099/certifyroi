// ─────────────────────────────────────────────────────────
// VerticalSidebar.jsx — Sticky vertical text for Neubrutalist branding
// ─────────────────────────────────────────────────────────

import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

const FB = "'Inter', sans-serif";
const FH = "'Playfair Display', 'Fraunces', serif";

export function VerticalSidebar({ text = 'ROI Analysis for Indian professionals' }) {
  const { isDark } = useTheme();
  const t = isDark ? {
    text: '#EFEFEF',
    text2: '#999999',
    border: 'rgba(255,255,255,0.09)',
  } : {
    text: '#111111',
    text2: '#555555',
    border: 'rgba(0,0,0,0.09)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{
        position: 'fixed',
        left: '24px',
        top: '120px',
        bottom: '24px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        zIndex: 10,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Horizontal divider line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '-8px',
          width: '2px',
          height: '32px',
          background: t.border,
        }}
      />

      {/* Vertical rotated text */}
      <div
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          transformOrigin: 'center center',
          fontFamily: FH,
          fontSize: '14px',
          fontWeight: '700',
          letterSpacing: '0.15em',
          color: t.text2,
          lineHeight: 1.8,
          whiteSpace: 'nowrap',
          marginTop: '16px',
          textTransform: 'uppercase',
          opacity: 0.85,
        }}
      >
        {text}
      </div>

      {/* Horizontal divider line - bottom */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: '-8px',
          width: '2px',
          height: '32px',
          background: t.border,
        }}
      />
    </motion.div>
  );
}

export default VerticalSidebar;
