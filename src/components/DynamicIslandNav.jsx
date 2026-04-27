// ─────────────────────────────────────────────────────────
// DynamicIslandNav.jsx — CertifyROI
// ─────────────────────────────────────────────────────────

import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Sun, Moon, Menu, X, User, ChevronDown } from 'lucide-react';

const F_SANS = "'Inter', 'DM Sans', sans-serif"
const F_MONO = "'JetBrains Mono', 'IBM Plex Mono', monospace"

const MAIN_NAV_ITEMS = [
  { label: 'Home', pageId: 'home' },
  { label: 'How It Works', pageId: 'how-it-works' },
  { label: 'Features', pageId: 'features' },
  { label: 'Pricing', pageId: 'pricing' },
];

const SECONDARY_NAV_ITEMS = [
  { label: 'About', pageId: 'about' },
  { label: 'Blog', pageId: 'blog' },
  { label: 'FAQ', pageId: 'faq' },
  { label: 'Contact', pageId: 'contact' },
];

const MAIN_TOOLS = [
  { label: 'Resume Analyzer', pageId: 'tools/resume' },
  { label: 'ROI Calculator', pageId: 'tools/roi' },
  { label: 'City Demand Heatmap', pageId: 'tools/heatmap' },
];

const OTHER_TOOLS = [
  { label: 'Compare Certs', pageId: 'tools/compare' },
  { label: 'Career Simulator', pageId: 'tools/simulator' },
  { label: 'Job-to-Cert Map', pageId: 'tools/jobmap' },
  { label: 'Degree vs Certs', pageId: 'tools/college' },
  { label: 'Gap Analyzer', pageId: 'tools/gap' },
  { label: 'Negotiation Script', pageId: 'tools/negotiation' },
  { label: 'Verify Your Hike', pageId: 'tools/hike' },
];

const ALL_MOBILE_ITEMS = [
  ...MAIN_NAV_ITEMS,
  { type: 'header', label: 'Tools & Info' },
  ...MAIN_TOOLS, ...OTHER_TOOLS, ...SECONDARY_NAV_ITEMS,
];

function NavItem({ label, pageId, isActive, onActivate, onNavigate, theme }) {
  const [hovered, setHovered] = useState(false)
  const t = theme

  return (
    <a
      href={'#' + pageId}
      onClick={(e) => {
        e.preventDefault()
        onActivate(pageId)
        if (onNavigate) onNavigate(pageId)
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center',
        padding: '6px 12px', borderRadius: '100px',
        textDecoration: 'none', outline: 'none', cursor: 'pointer', userSelect: 'none',
      }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '100px',
              background: t.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            }}
          />
        )}
      </AnimatePresence>
      <span style={{
        position: 'relative', fontFamily: F_SANS, fontSize: '13px',
        fontWeight: isActive ? '600' : '400', letterSpacing: '-0.01em',
        color: isActive ? t.text : t.text2, transition: 'color 0.15s',
      }}>
        {label}
      </span>
      {isActive && (
        <motion.div
          layoutId="nav-active-indicator"
          style={{
            position: 'absolute', bottom: '3px', left: '12px', right: '12px',
            height: '1.5px', borderRadius: '1px', background: t.gold,
          }}
          transition={{ type: 'spring', stiffness: 480, damping: 36 }}
        />
      )}
    </a>
  )
}

function DropdownContainer({ children, theme }) {
  const t = theme;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 480, damping: 34 }}
      style={{
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        borderRadius: '16px',
        background: t.name === 'dark' ? 'rgba(20,20,20,0.9)' : 'rgba(248,246,242,0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid ' + t.borderMid,
        boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
        padding: '6px',
        width: '220px',
      }}
    >
      {children}
    </motion.div>
  );
}

function DropdownItem({ label, pageId, onNavigate, theme, onClose }) {
  const t = theme;
  return (
    <a
      href={'#' + pageId}
      onClick={(e) => {
        e.preventDefault();
        if (onNavigate) onNavigate(pageId);
        if (onClose) onClose();
      }}
      style={{
        display: 'block',
        padding: '8px 12px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontFamily: F_SANS,
        fontSize: '13px',
        fontWeight: '500',
        color: t.text2,
        transition: 'background 0.15s, color 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = t.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
        e.currentTarget.style.color = t.text;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = t.text2;
      }}
    >
      {label}
    </a>
  );
}


function ThemeToggle({ isDark, onToggle, theme }) {
  const t = theme
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.9 }}
      style={{
        width: '32px', height: '32px', borderRadius: '50%',
        border: '1px solid ' + t.border,
        background: t.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: t.text2, flexShrink: 0, transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = t.name === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = t.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'sun' : 'moon'}
          initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {isDark ? <Sun size={14} strokeWidth={2} /> : <Moon size={14} strokeWidth={2} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}

function MobileMenuPanel({ isOpen, onClose, activeHref, onActivate, isDark, onToggle, onNavigate, theme }) {
  const t = theme

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 440, damping: 36 }}
          style={{
            position: 'fixed', top: '80px', left: '16px', right: '16px', zIndex: 9998,
            borderRadius: '20px',
            background: t.name === 'dark' ? 'rgba(14,14,14,0.94)' : 'rgba(248,246,242,0.94)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid ' + t.borderMid,
            boxShadow: t.name === 'dark'
              ? '0 24px 48px rgba(0,0,0,0.6)'
              : '0 24px 48px rgba(0,0,0,0.18)',
            padding: '8px', overflow: 'hidden',
          }}
        >
          {ALL_MOBILE_ITEMS.map((item, i) => {
            if (item.type === 'header') {
              return (
                <div key={i} style={{ padding: '12px 16px 4px', fontFamily: F_MONO, fontSize: '10px', color: t.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {item.label}
                </div>
              )
            }

            const isActive = activeHref === item.pageId
            return (
              <motion.div
                key={item.pageId}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href={'#' + item.pageId}
                  onClick={(e) => {
                    e.preventDefault()
                    if (item.pageId) {
                      onActivate(item.pageId)
                      if (onNavigate) onNavigate(item.pageId)
                    }
                    onClose()
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '13px 16px', borderRadius: '12px', textDecoration: 'none',
                    background: isActive ? (t.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent',
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                >
                  <span style={{
                    fontFamily: F_SANS, fontSize: '16px',
                    fontWeight: isActive ? '600' : '400',
                    color: isActive ? t.text : t.text2, letterSpacing: '-0.01em',
                  }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: t.gold }} />
                  )}
                </a>
              </motion.div>
            )
          })}

          <div style={{ height: '1px', background: t.border, margin: '8px 16px' }} />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ALL_MOBILE_ITEMS.length * 0.03 + 0.05, duration: 0.3 }}
            style={{ padding: '8px 8px 4px', display: 'flex', justifyContent: 'flex-end' }}
          >
            <ThemeToggle isDark={isDark} onToggle={onToggle} theme={t} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────
export default function DynamicIslandNav({ isDark, toggleTheme, onNavigate, currentPage, user, onSignIn, onSignOut }) {
  const DARK_THEME = {
    name: 'dark',
    text: '#EFEFEF', text2: '#999999', text3: '#5A5A5A', text4: '#2E2E2E',
    gold: '#B8973A', goldL: '#D4AF55', silver: '#8A8A8A', silverL: '#B0B0B0',
    border: 'rgba(255,255,255,0.055)', borderMid: 'rgba(255,255,255,0.10)',
  }
  const LIGHT_THEME = {
    name: 'light',
    text: '#111111', text2: '#555555', text3: '#878787', text4: '#ABABAB',
    gold: '#9A7020', goldL: '#B89040', silver: '#6E6E6E', silverL: '#8E8E8E',
    border: 'rgba(0,0,0,0.07)', borderMid: 'rgba(0,0,0,0.13)',
  }
  const theme = isDark ? DARK_THEME : LIGHT_THEME

  const [activeHref, setActiveHref] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const islandRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (currentPage) setActiveHref(currentPage)
  }, [currentPage])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onScroll = () => setMenuOpen(false)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  const glassBg = isDark ? 'rgba(12,12,12,0.84)' : 'rgba(248,246,242,0.90)'
  const borderColor = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'
  const innerHL = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)'
  const shadow = scrolled
    ? (isDark ? '0 20px 60px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)' : '0 20px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10)')
    : (isDark ? '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)')

  return (
    <>
      {/* Hamburger Menu - Top Left */}
      <motion.div
        initial={{ y: -64, opacity: 0, scale: 0.92 }} animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 34, delay: 0.15 }}
        style={{ position: 'fixed', top: '14px', left: '14px', zIndex: 9999, pointerEvents: 'auto' }}
      >
        {isMobile ? (
          <motion.button
            onClick={() => setMenuOpen((v) => !v)}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: glassBg, backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid ' + borderColor, boxShadow: shadow,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: theme.text2,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={menuOpen ? 'x' : 'menu'}
                initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {menuOpen ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2.5} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        ) : (
          <div onMouseEnter={() => setHamburgerOpen(true)} onMouseLeave={() => setHamburgerOpen(false)} style={{ position: 'relative' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: glassBg, backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid ' + borderColor, boxShadow: shadow,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <button
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  border: '1px solid ' + theme.border,
                  background: hamburgerOpen ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)') : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: theme.text2, transition: 'background 0.15s',
                }}
              >
                <Menu size={14} strokeWidth={2.5} />
              </button>
            </div>
            <AnimatePresence>
              {hamburgerOpen && (
                <DropdownContainer theme={theme}>
                  {SECONDARY_NAV_ITEMS.map(item => (
                    <DropdownItem key={item.pageId} {...item} onNavigate={onNavigate} theme={theme} onClose={() => setHamburgerOpen(false)} />
                  ))}
                </DropdownContainer>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Central Nav Island — Improved structure */}
      <motion.div
        ref={islandRef}
        style={{
          position: 'fixed', top: '14px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          pointerEvents: 'auto', cursor: 'default', userSelect: 'none',
        }}
        initial={{ y: -64, opacity: 0, scale: 0.92 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 34, delay: 0.1 }}
      >
        <motion.div
          style={{
            display: 'inline-flex', alignItems: 'center',
            height: toolsOpen ? 'auto' : '48px',
            padding: toolsOpen ? '12px' : (isMobile ? '0 24px' : '0 14px'),
            gap: '4px',
            background: glassBg,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: toolsOpen ? '16px' : '100px',
            border: '1px solid ' + borderColor,
            boxShadow: shadow,
            outline: '1px solid ' + innerHL,
            outlineOffset: '-2px',
            flexDirection: toolsOpen ? 'column' : 'row',
            minWidth: toolsOpen ? '100vw' : 'auto',
            maxWidth: toolsOpen ? '100vw' : 'auto',
          }}
          transition={{ all: 0.3 }}
        >
          {/* Main nav + theme toggle row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: isMobile || toolsOpen ? 'wrap' : 'nowrap', justifyContent: toolsOpen ? 'center' : 'flex-start' }}>
            {isMobile ? (
              <span style={{ fontFamily: F_SANS, fontSize: '14px', fontWeight: '700', color: theme.text, letterSpacing: '-0.02em' }}>
                Certify<span style={{ color: theme.gold }}>ROI</span>
              </span>
            ) : (
              <>
                {MAIN_NAV_ITEMS.map((item) => (
                  <NavItem
                    key={item.pageId}
                    label={item.label}
                    pageId={item.pageId}
                    isActive={activeHref === item.pageId}
                    onActivate={setActiveHref}
                    onNavigate={onNavigate}
                    theme={theme}
                  />
                ))}
              </>
            )}
            {!isMobile && (
              <div style={{ width: '1px', height: '24px', background: borderColor, margin: '0 4px' }} />
            )}
            {/* Theme toggle moved inside — desktop only */}
            {!isMobile && (
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} theme={theme} />
            )}
          </div>

          {/* Tools section — expands when open */}
          <div
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          >
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: toolsOpen ? '8px 12px' : '6px 12px',
                borderRadius: '8px',
                background: activeHref.startsWith('tools/') ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent',
                border: 'none', cursor: 'pointer',
                color: theme.text2, fontFamily: F_SANS, fontSize: '13px', fontWeight: '600',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!toolsOpen) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'
              }}
              onMouseLeave={(e) => {
                if (!toolsOpen) e.currentTarget.style.background = 'transparent'
              }}
            >
              Tools <ChevronDown size={12} style={{ transform: toolsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>

            {/* Tools dropdown — full-width from border to border */}
            <AnimatePresence>
              {toolsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: '-12px', right: '-12px',
                    background: glassBg, backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid ' + borderColor,
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '8px',
                    minWidth: '80vw',
                    maxWidth: '90vw',
                    zIndex: 10000,
                  }}
                >
                  <div style={{ gridColumn: '1 / -1', paddingBottom: '4px', borderBottom: '1px solid ' + borderColor }}>
                    <div style={{ fontFamily: F_MONO, fontSize: '10px', color: theme.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Main Flow</div>
                  </div>
                  {MAIN_TOOLS.map(item => (
                    <a
                      key={item.pageId}
                      href={'#' + item.pageId}
                      onClick={(e) => {
                        e.preventDefault()
                        setToolsOpen(false)
                        if (onNavigate) onNavigate(item.pageId)
                      }}
                      style={{
                        display: 'block', padding: '8px 12px', borderRadius: '8px',
                        background: 'transparent', textDecoration: 'none',
                        fontFamily: F_SANS, fontSize: '13px', color: theme.text2,
                        transition: 'all 0.15s', cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'
                        e.currentTarget.style.color = theme.text
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = theme.text2
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                  <div style={{ gridColumn: '1 / -1', padding: '4px 0', borderTop: '1px solid ' + borderColor, borderBottom: '1px solid ' + borderColor, margin: '4px 0' }} />
                  <div style={{ gridColumn: '1 / -1', paddingBottom: '4px' }}>
                    <div style={{ fontFamily: F_MONO, fontSize: '10px', color: theme.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Other Tools</div>
                  </div>
                  {OTHER_TOOLS.map(item => (
                    <a
                      key={item.pageId}
                      href={'#' + item.pageId}
                      onClick={(e) => {
                        e.preventDefault()
                        setToolsOpen(false)
                        if (onNavigate) onNavigate(item.pageId)
                      }}
                      style={{
                        display: 'block', padding: '8px 12px', borderRadius: '8px',
                        background: 'transparent', textDecoration: 'none',
                        fontFamily: F_SANS, fontSize: '13px', color: theme.text2,
                        transition: 'all 0.15s', cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'
                        e.currentTarget.style.color = theme.text
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = theme.text2
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Sign In Button — Top Right with liquid metallic background */}
      <motion.div
        initial={{ y: -64, opacity: 0, scale: 0.92 }} animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 34, delay: 0.15 }}
        style={{ position: 'fixed', top: '14px', right: '14px', zIndex: 9999, pointerEvents: 'auto' }}
      >
        {isMobile ? (
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: glassBg, backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid ' + borderColor, boxShadow: shadow,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <button
              onClick={user ? onSignOut : onSignIn}
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: user ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)') : 'linear-gradient(135deg, #63A8AC 0%, #7CB8BA 50%, #63A8AC 100%)',
                border: '1px solid ' + (user ? theme.border : 'rgba(99,168,172,0.6)'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: user ? theme.text2 : '#FFFFFF', flexShrink: 0,
                boxShadow: user ? 'none' : '0 4px 12px rgba(99,168,172,0.3)',
              }}
              title={user ? 'Sign Out' : 'Sign In'}
            >
              <User size={15} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            onClick={user ? onSignOut : onSignIn}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              height: '48px', padding: '0 20px', borderRadius: '100px',
              background: user
                ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')
                : 'linear-gradient(135deg, #63A8AC 0%, #7CB8BA 50%, #8AC4C8 100%)',
              border: '1px solid ' + (user ? borderColor : 'rgba(99,168,172,0.8)'),
              color: user ? theme.text : '#FFFFFF',
              fontFamily: F_SANS, fontSize: '12px', fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none',
              boxShadow: user ? 'none' : '0 8px 24px rgba(99,168,172,0.25), 0 2px 8px rgba(99,168,172,0.15)',
            }}
            onMouseEnter={(e) => {
              if (!user) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #6DB6BA 0%, #85C0C8 50%, #92CCd0 100%)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,168,172,0.35), 0 4px 12px rgba(99,168,172,0.2)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!user) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #63A8AC 0%, #7CB8BA 50%, #8AC4C8 100%)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,168,172,0.25), 0 2px 8px rgba(99,168,172,0.15)'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            <User size={13} strokeWidth={2.5} />
            {user ? 'Sign Out' : 'Sign In'}
          </button>
        )}
      </motion.div>
      <MobileMenuPanel
        isOpen={isMobile && menuOpen}
        onClose={() => setMenuOpen(false)}
        activeHref={activeHref}
        onActivate={setActiveHref}
        isDark={isDark}
        onToggle={toggleTheme}
        onNavigate={onNavigate}
        theme={theme}
      />
    </>
  )
}
