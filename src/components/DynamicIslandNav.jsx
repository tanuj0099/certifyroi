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
  ...CORE_NAV_ITEMS,
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

      {/* Central Nav Island */}
      <motion.div
        ref={islandRef}
        style={{
          position: 'fixed', top: '14px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          display: 'inline-flex', alignItems: 'center',
          height: '48px',
          padding: isMobile ? '0 24px' : '0 14px',
          gap: '4px',
          background: glassBg,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '100px',
          border: '1px solid ' + borderColor,
          boxShadow: shadow,
          outline: '1px solid ' + innerHL,
          outlineOffset: '-2px',
          pointerEvents: 'auto', cursor: 'default', userSelect: 'none',
        }}
        initial={{ y: -64, opacity: 0, scale: 0.92 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 34, delay: 0.1 }}
      >
        {isMobile ? (
          <span style={{ fontFamily: F_SANS, fontSize: '14px', fontWeight: '700', color: theme.text, letterSpacing: '-0.02em' }}>
            Certify<span style={{ color: theme.gold }}>ROI</span>
          </span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
            <div onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)} style={{ position: 'relative' }}>
              <NavItem
                label={<span>Tools <ChevronDown size={12} style={{ display: 'inline', marginLeft: '2px', verticalAlign: 'middle' }} /></span>}
                pageId="app"
                isActive={activeHref.startsWith('tools/')}
                onActivate={setActiveHref}
                onNavigate={() => onNavigate('app')}
                theme={theme}
              />
              <AnimatePresence>
                {toolsOpen && (
                  <DropdownContainer theme={theme} style={{ width: '240px' }}>
                    <div style={{ padding: '6px 12px 2px', fontFamily: F_MONO, fontSize: '10px', color: theme.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Main Flow</div>
                    {MAIN_TOOLS.map(item => <DropdownItem key={item.pageId} {...item} onNavigate={onNavigate} theme={theme} onClose={() => setToolsOpen(false)} />)}
                    <div style={{ height: '1px', background: theme.border, margin: '6px 8px' }} />
                    <div style={{ padding: '6px 12px 2px', fontFamily: F_MONO, fontSize: '10px', color: theme.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Other Tools</div>
                    {OTHER_TOOLS.map(item => <DropdownItem key={item.pageId} {...item} onNavigate={onNavigate} theme={theme} onClose={() => setToolsOpen(false)} />)}
                  </DropdownContainer>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>

      {/* Sign In Button - Top Right */}
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
                background: user ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)') : 'var(--accent)',
                border: '1px solid ' + (user ? theme.border : 'var(--accent-light, #4A8C6A)'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: user ? theme.text2 : '#FFFFFF', flexShrink: 0,
              }}
            >
              <User size={15} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            height: '48px',
            padding: '0 8px',
            background: glassBg,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '100px',
            border: '1px solid ' + borderColor,
            boxShadow: shadow,
            outline: '1px solid ' + innerHL,
            outlineOffset: '-2px',
          }}>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} theme={theme} />
            <button
              onClick={user ? onSignOut : onSignIn}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                height: '32px', padding: '0 12px', borderRadius: '16px',
                background: user ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)') : 'var(--accent)',
                border: '1px solid ' + (user ? borderColor : 'var(--accent-light, #4A8C6A)'),
                color: user ? theme.text : '#FFFFFF',
                fontFamily: F_SANS, fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.15s', outline: 'none'
              }}
            >
              <User size={13} strokeWidth={2.5} />
              {user ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
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
