// ─────────────────────────────────────────────────────────
// DynamicIslandNav.jsx — CertifyROI
// ─────────────────────────────────────────────────────────
 
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Sun, Moon, Menu, X, User, ChevronDown } from 'lucide-react';

const F_SANS = "'Inter', 'DM Sans', sans-serif"
const F_MONO = "'JetBrains Mono', 'IBM Plex Mono', monospace"

const MAIN_NAV_ITEMS = [
  { label: 'Home', pageId: 'home' }
];

const SECONDARY_NAV_ITEMS = [
  { label: 'How It Works', pageId: 'how-it-works' },
  { label: 'Features', pageId: 'features' },
  { label: 'Pricing', pageId: 'pricing' },
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
  { type: 'header', label: 'Tools & Pages' },
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
  const [pageMenuOpen, setPageMenuOpen] = useState(false)
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
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen && !toolsOpen) return
    const onScroll = () => {
      setMenuOpen(false);
      setToolsOpen(false);
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen, toolsOpen])
 
  const glassBg = isDark ? 'rgba(12,12,12,0.84)' : 'rgba(248,246,242,0.90)'
  const borderColor = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'
  const innerHL = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)';
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
          <div onMouseEnter={() => setPageMenuOpen(true)} onMouseLeave={() => setPageMenuOpen(false)} style={{ position: 'relative' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: glassBg, backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid ' + borderColor, boxShadow: shadow,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  border: '1px solid ' + theme.border,
                  background: pageMenuOpen ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)') : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: theme.text2, transition: 'background 0.15s',
                }}
              >
                <Menu size={14} strokeWidth={2.5} />
              </div>
            </div>
            <AnimatePresence>
              {pageMenuOpen && (
                <DropdownContainer theme={theme}>
                  {SECONDARY_NAV_ITEMS.map(item => (
                    <DropdownItem key={item.pageId} {...item} onNavigate={onNavigate} theme={theme} onClose={() => setPageMenuOpen(false)} />
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
        initial={{ y: -64, opacity: 0, scale: 0.92 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 34, delay: 0.1 }}
        onHoverStart={() => !isMobile && setToolsOpen(true)}
        onHoverEnd={() => !isMobile && setToolsOpen(false)}
      >
        <motion.div
          animate={{
            width: toolsOpen && !isMobile ? 'calc(100vw - 32px)' : 'auto',
            maxWidth: toolsOpen && !isMobile ? '1200px' : 'auto',
            height: toolsOpen && !isMobile ? 'auto' : '48px',
            borderRadius: toolsOpen && !isMobile ? '0px' : '999px',
            borderWidth: '2px',
            borderColor: isDark ? '#333333' : '#111111',
            boxShadow: toolsOpen && !isMobile ? (isDark ? '0 24px 48px rgba(0,0,0,0.8)' : '0 24px 48px rgba(0,0,0,0.25)') : shadow,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          style={{
            position: 'fixed', top: '14px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
            pointerEvents: 'auto', cursor: 'default', userSelect: 'none',
            display: 'flex', alignItems: 'center',
            padding: isMobile ? '0 24px' : '0',
            background: glassBg,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="wait">
            {toolsOpen && !isMobile ? (
              <motion.div
                key="tools-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: '100%',
                  padding: '24px 32px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '16px',
                }}
              >
                {/* Main Tools Section */}
                <div style={{ gridColumn: 'span 4' }}>
                  <div style={{ fontFamily: F_MONO, fontSize: '10px', color: theme.text3, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '800', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid ' + (isDark ? '#333333' : '#111111') }}>
                    Primary Tools
                  </div>
                </div>
                {[...MAIN_TOOLS, ...OTHER_TOOLS.slice(0,1)].map((item, idx) => (
                  <motion.a
                    key={item.pageId}
                    href={'#' + item.pageId}
                    onClick={(e) => { e.preventDefault(); setToolsOpen(false); if (onNavigate) onNavigate(item.pageId); }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.3 }}
                    style={{ display: 'block', padding: '14px 16px', borderRadius: '0px', background: 'transparent', textDecoration: 'none', fontFamily: F_SANS, fontSize: '14px', fontWeight: '600', color: theme.text, transition: 'all 0.2s ease', cursor: 'pointer', border: '2px solid transparent' }}
                    whileHover={{ border: '2px solid ' + (isDark ? '#555555' : '#333333'), background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}
                  >
                    {item.label}
                  </motion.a>
                ))}

                {/* Other Tools Section */}
                <div style={{ gridColumn: 'span 4', marginTop: '12px' }}>
                  <div style={{ fontFamily: F_MONO, fontSize: '10px', color: theme.text3, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '800', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid ' + (isDark ? '#333333' : '#111111') }}>
                    Additional Tools
                  </div>
                </div>
                {OTHER_TOOLS.slice(1).map((item, idx) => (
                  <motion.a
                    key={item.pageId}
                    href={'#' + item.pageId}
                    onClick={(e) => { e.preventDefault(); setToolsOpen(false); if (onNavigate) onNavigate(item.pageId); }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (MAIN_TOOLS.length + 1 + idx) * 0.04, duration: 0.3 }}
                    style={{ display: 'block', padding: '14px 16px', borderRadius: '0px', background: 'transparent', textDecoration: 'none', fontFamily: F_SANS, fontSize: '14px', fontWeight: '500', color: theme.text2, transition: 'all 0.2s ease', cursor: 'pointer', border: '2px solid transparent' }}
                    whileHover={{ border: '2px solid ' + (isDark ? '#555555' : '#333333'), background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', color: theme.text }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="default-nav"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 10px' }}
              >
                {isMobile ? (
                  <span style={{ fontFamily: F_SANS, fontSize: '14px', fontWeight: '700', color: theme.text, letterSpacing: '-0.02em' }}>
                    Certify<span style={{ color: theme.gold }}>ROI</span>
                  </span>
                ) : (
                  <>
                    {MAIN_NAV_ITEMS.map((item) => (
                      <NavItem key={item.pageId} {...item} isActive={activeHref === item.pageId} onActivate={setActiveHref} onNavigate={onNavigate} theme={theme} />
                    ))}
                    <div style={{ width: '1px', height: '24px', background: borderColor, margin: '0 4px' }} />
                    <button
                      onClick={() => setToolsOpen(true)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: activeHref.startsWith('tools/') ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent', border: 'none', cursor: 'pointer', color: theme.text2, fontFamily: F_SANS, fontSize: '13px', fontWeight: '600', transition: 'all 0.15s' }}
                    >
                      Tools <ChevronDown size={12} style={{ transition: 'transform 0.2s' }} />
                    </button>
                    <div style={{ width: '1px', height: '24px', background: borderColor, margin: '0 4px' }} />
                    <ThemeToggle isDark={isDark} onToggle={toggleTheme} theme={theme} />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Sign In Button — Top Right with liquid metallic background */}
      <motion.div
        initial={{ y: -64, opacity: 0, scale: 0.92 }} animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 34, delay: 0.15 }}
        style={{ position: 'fixed', top: '14px', right: '14px', zIndex: 9999, pointerEvents: 'auto' }}
      >
        {isMobile ? (
          <motion.div whileTap={{ scale: 0.9 }} style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: glassBg, backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid ' + borderColor, boxShadow: shadow,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <motion.button
              onClick={user ? onSignOut : onSignIn}              
              whileTap={{ scale: 0.9 }}
              style={{
                width: '32px', height: '32px', borderRadius: '0px',
                background: user ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)') : 'linear-gradient(135deg, #E0E0E0 0%, #D0D0D0 50%, #E0E0E0 100%)',
                border: '2px solid ' + (user ? theme.border : '#1a1a1a'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: user ? theme.text2 : '#1a1a1a', flexShrink: 0,
                boxShadow: user ? 'none' : '0 6px 16px rgba(0,0,0,0.2)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              title={user ? 'Sign Out' : 'Sign In'}
              onMouseEnter={(e) => {
                if (!user) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #E8E8E8 0%, #D8D8D8 50%, #E8E8E8 100%)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)'
                }
              }}
              onMouseLeave={(e) => {
                if (!user) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #E0E0E0 0%, #D0D0D0 50%, #E0E0E0 100%)'
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)'
                }
              }}
            >
              <User size={15} strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            onClick={user ? onSignOut : onSignIn}
            whileHover={!user ? { y: -3 } : {}}
            whileTap={!user ? { y: -1, scale: 0.98 } : {}}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              height: '48px', padding: '0 20px', borderRadius: '0px',
              background: user
                ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')
                : 'linear-gradient(135deg, #E8E8E8 0%, #D0D0D0 25%, #E0E0E0 50%, #D8D8D8 75%, #E8E8E8 100%)',
              border: '2px solid ' + (user ? (isDark ? '#333333' : '#111111') : '#1a1a1a'),
              color: user ? theme.text : '#1a1a1a',
              fontFamily: F_SANS, fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              outline: 'none',
              boxShadow: user ? 'none' : '0 12px 32px rgba(0,0,0,0.25), 0 4px 12px rgba(200,200,200,0.15)',
              backdropFilter: 'brightness(1.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              if (!user) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #F0F0F0 0%, #D8D8D8 25%, #E8E8E8 50%, #E0E0E0 75%, #F0F0F0 100%)'
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.35), 0 8px 16px rgba(220,220,220,0.25)'
              }
            }}
            onMouseLeave={(e) => {
              if (!user) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #E8E8E8 0%, #D0D0D0 25%, #E0E0E0 50%, #D8D8D8 75%, #E8E8E8 100%)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.25), 0 4px 12px rgba(200,200,200,0.15)'
              }
            }}
          >
            <User size={13} strokeWidth={2.5} />
            {user ? 'Sign Out' : 'Sign In'}
          </motion.button>
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
