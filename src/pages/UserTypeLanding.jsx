// ─────────────────────────────────────────────────────────
// UserTypeLanding.jsx — User path selection with parallax
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Building2, ArrowRight, Zap } from 'lucide-react';

const FB = "'Inter', sans-serif";
const FH = "'Playfair Display', 'Fraunces', serif";
const FM = "'JetBrains Mono', monospace";

const PATHS = [
  {
    id: 'student',
    label: 'Student',
    icon: GraduationCap,
    description: 'Fresh perspective. Growing confidence.',
    detail: 'Discover certifications that accelerate your journey from campus to career.',
    color: '#6366F1',
    bgColor: 'rgba(99, 102, 241, 0.08)',
  },
  {
    id: 'professional',
    label: 'Professional',
    icon: Building2,
    description: 'Level up. Climb faster.',
    detail: 'Strategic certifications to advance your role and multiply your impact.',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.08)',
  },
  {
    id: 'switcher',
    label: 'Career Switcher',
    icon: Zap,
    description: 'New path. New possibilities.',
    detail: 'Transform your skills into demand. Bridge the gap between past and future.',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.08)',
  },
];

export default function UserTypeLanding({ onSelectPath, onClose }) {
  const [scrollY, setScrollY] = useState(0);
  const [selectedPath, setSelectedPath] = useState(null);
  const scrollContainerRef = useRef(null);
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || 
                 window.matchMedia('(prefers-color-scheme: dark)').matches;

  const t = isDark ? {
    bg: '#0A0A0A',
    text: '#EFEFEF',
    text2: '#999999',
    border: 'rgba(255,255,255,0.09)',
    borderDark: '#222222',
  } : {
    bg: '#FFFFFF',
    text: '#111111',
    text2: '#555555',
    border: 'rgba(0,0,0,0.09)',
    borderDark: '#E5E5E5',
  };

  // Parallax scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setScrollY(scrollContainerRef.current.scrollLeft);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePathSelect = useCallback((pathId) => {
    setSelectedPath(pathId);
    setTimeout(() => {
      if (onSelectPath) onSelectPath(pathId);
      if (onClose) onClose();
    }, 600);
  }, [onSelectPath, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: t.bg,
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: t.bg,
          borderBottom: '2px solid ' + t.borderDark,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '48px',
          paddingRight: '48px',
          zIndex: 100,
        }}
      >
        <div>
          <h1 style={{ fontFamily: FH, fontSize: '32px', fontWeight: '700', color: t.text, margin: 0 }}>
            Certify<span style={{ color: '#B8973A' }}>ROI</span>
          </h1>
          <p style={{ fontFamily: FB, fontSize: '12px', color: t.text2, margin: '4px 0 0 0' }}>
            Choose Your Path
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '0px',
            border: '2px solid ' + t.borderDark,
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: t.text,
            fontSize: '24px',
            fontWeight: '700',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          ×
        </button>
      </motion.div>

      {/* Scrollable content container */}
      <div
        ref={scrollContainerRef}
        style={{
          marginTop: '100px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          padding: '48px',
          minHeight: 'calc(100vh - 100px)',
          overflowY: 'auto',
        }}
      >
        {/* Intro section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            maxWidth: '800px',
            marginBottom: '32px',
          }}
        >
          <p style={{ fontFamily: FH, fontSize: '28px', fontWeight: '700', color: t.text, lineHeight: 1.3, margin: 0 }}>
            Where are you in your career journey?
          </p>
          <p style={{ fontFamily: FB, fontSize: '14px', color: t.text2, marginTop: '16px', lineHeight: 1.6 }}>
            CertifyROI tailors insights, strategies, and recommendations based on your unique position. Whether you're just starting out, climbing the corporate ladder, or pivoting to a new field, we've got the right certifications to accelerate your ROI.
          </p>
        </motion.section>

        {/* Path cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          {PATHS.map((path, idx) => {
            const Icon = path.icon;
            const isSelected = selectedPath === path.id;

            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                onClick={() => handlePathSelect(path.id)}
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  animate={isSelected ? { scale: 1.02 } : { scale: 1 }}
                  style={{
                    position: 'relative',
                    padding: '32px',
                    borderRadius: '0px',
                    border: '2px solid ' + (isSelected ? path.color : t.borderDark),
                    background: isSelected ? path.bgColor : 'transparent',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected ? `0 12px 32px ${path.color}20` : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = path.color;
                      e.currentTarget.style.background = path.bgColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = t.borderDark;
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    animate={isSelected ? { scale: 1.15, rotate: 360 } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '56px',
                      height: '56px',
                      borderRadius: '0px',
                      border: `2px solid ${path.color}`,
                      marginBottom: '20px',
                      color: path.color,
                    }}
                  >
                    <Icon size={28} strokeWidth={1.5} />
                  </motion.div>

                  {/* Label */}
                  <h3 style={{ fontFamily: FH, fontSize: '24px', fontWeight: '700', color: path.color, margin: '0 0 12px 0' }}>
                    {path.label}
                  </h3>

                  {/* Description */}
                  <p style={{ fontFamily: FB, fontSize: '13px', color: t.text, fontWeight: '600', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                    {path.description}
                  </p>

                  {/* Detail */}
                  <p style={{ fontFamily: FB, fontSize: '12px', color: t.text2, margin: '0', lineHeight: 1.6 }}>
                    {path.detail}
                  </p>

                  {/* Hover arrow */}
                  <motion.div
                    animate={isSelected ? { x: 8, opacity: 1 } : { x: -8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      right: '20px',
                      bottom: '20px',
                      color: path.color,
                    }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="path-selected"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: path.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '700',
                      }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Info section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            maxWidth: '1000px',
            padding: '32px',
            borderRadius: '0px',
            border: '2px solid ' + t.borderDark,
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            marginTop: '32px',
            marginBottom: '48px',
          }}
        >
          <h4 style={{ fontFamily: FM, fontSize: '10px', color: t.text2, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 16px 0' }}>
            How It Works
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr', gap: '24px' }}>
            {[
              { num: '01', title: 'Select Your Path', desc: 'Choose the role that best matches your career stage.' },
              { num: '02', title: 'Analyze Your Profile', desc: 'Upload your resume or describe your current role.' },
              { num: '03', title: 'Discover ROI', desc: 'Get personalized cert recommendations with salary impact.' },
            ].map((step, i) => (
              <div key={i}>
                <p style={{ fontFamily: FH, fontSize: '20px', fontWeight: '700', color: '#B8973A', margin: '0 0 8px 0' }}>
                  {step.num}
                </p>
                <p style={{ fontFamily: FB, fontSize: '12px', fontWeight: '600', color: t.text, margin: '0 0 6px 0' }}>
                  {step.title}
                </p>
                <p style={{ fontFamily: FB, fontSize: '12px', color: t.text2, margin: '0', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
