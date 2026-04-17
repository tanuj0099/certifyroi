// ─────────────────────────────────────────────────────────
// DynamicIslandNav.jsx
// Premium floating capsule navbar for CertifyROI
//
// SETUP:
//   1. Place this file at src/components/DynamicIslandNav.jsx
//   2. In App.jsx:
//      a. Remove <FloatingTopBar ... /> from the JSX
//      b. Remove the FloatingTopBar function entirely
//      c. Add at the top: import DynamicIslandNav from './components/DynamicIslandNav'
//      d. Add inside <ThemeContext.Provider ...> before the hero:
//         <DynamicIslandNav isDark={isDark} toggleTheme={toggleTheme} onEnter={onEnter} />
//   3. Ensure framer-motion / motion is installed (already in the project)
//
// HOW IT WORKS:
//   - Centered floating pill/capsule, fixed to viewport top
//   - 3D tilt follows mouse cursor via spring physics
//   - Active nav item has a shared animated underline (layoutId)
//   - Mobile: compact island collapses to logo + menu trigger
//     which expands into a stacked full-width panel with motion
//   - Theme toggle and CTA on the right end
//   - All nav item clicks scroll to their section ID on the page
//   - CTA click calls onEnter (same as "Calculate ROI" in the hero)
// ─────────────────────────────────────────────────────────

import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Sun, Moon, BarChart2, Menu, X, ArrowRight } from 'lucide-react'

// ── Typography constants (match the page system) ──────────
const F_SANS = "'Inter', 'DM Sans', sans-serif"
const F_MONO = "'JetBrains Mono', 'IBM Plex Mono', monospace"
const F_SERIF = "'EB Garamond', Georgia, serif"

// ── Nav items: label → page ID they navigate to ──────────
const NAV_ITEMS = [
  { label: 'Home',    pageId: 'home'    },
  { label: 'Tools',   pageId: 'app'     },
  { label: 'About',   pageId: 'about'   },
  { label: 'FAQ',     pageId: 'faq'     },
  { label: 'Blog',    pageId: 'blog'    },
  { label: 'Contact', pageId: 'contact' },
]

// ── Scroll helper ─────────────────────────────────────────
function scrollTo(href) {
  // Remove the # and find the element
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    // Section doesn't exist yet — graceful no-op
    // (FAQ section exists in the current page as StorySection id="08")
    // Try data-section attribute as fallback
    const fallback = document.querySelector(`[data-section="${id}"]`)
    if (fallback) fallback.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// ─────────────────────────────────────────────────────────
// DESKTOP NAV ITEM
// Has a shared animated underline using layoutId="nav-active"
// Spring-based hover state for the background highlight
// ─────────────────────────────────────────────────────────
function NavItem({ label, pageId, isActive, onActivate, onNavigate, theme = {} }) {
  const [hovered, setHovered] = useState(false)
  const t = theme || { name: 'dark', text: '#F5F5F5', text2: '#A3A3A3', gold: '#D4AF37' }

  function handleClick(e) {
    e.preventDefault()
    onActivate(pageId)
    if (onNavigate) {
      onNavigate(pageId)
    }
  }

  return (
    <a
      href={'#' + pageId}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 12px',
        borderRadius: '100px',
        textDecoration: 'none',
        outline: 'none',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Hover background — springs in */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', inset: 0,
              borderRadius: '100px',
              background: t.name === 'dark'
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(0,0,0,0.05)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Label */}
      <span style={{
        position: 'relative',
        fontFamily: F_SANS,
        fontSize: '13px',
        fontWeight: isActive ? '600' : '400',
        letterSpacing: '-0.01em',
        color: isActive ? t.text : t.text2,
        transition: 'color 0.15s, font-weight 0.15s',
      }}>
        {label}
      </span>

      {/* Active underline — shared layoutId animates between items */}
      {isActive && (
        <motion.div
          layoutId="nav-active-indicator"
          style={{
            position: 'absolute',
            bottom: '3px',
            left: '12px',
            right: '12px',
            height: '1.5px',
            borderRadius: '1px',
            background: t.gold,
          }}
          transition={{ type: 'spring', stiffness: 480, damping: 36 }}
        />
      )}
    </a>
  )
}

// ─────────────────────────────────────────────────────────
// THEME TOGGLE BUTTON
// ─────────────────────────────────────────────────────────
function ThemeToggle({ isDark, onToggle, theme = {} }) {
  const t = theme || { name: 'dark', border: 'rgba(255,255,255,0.08)', text2: '#A3A3A3' }

  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.9 }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: '32px', height: '32px',
        borderRadius: '50%',
        border: '1px solid ' + t.border,
        background: t.name === 'dark'
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: t.text2,
        flexShrink: 0,
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={function(e) {
        e.currentTarget.style.background = t.name === 'dark'
          ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
      }}
      onMouseLeave={function(e) {
        e.currentTarget.style.background = t.name === 'dark'
          ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
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
          {isDark
            ? <Sun size={14} strokeWidth={2} />
            : <Moon size={14} strokeWidth={2} />
          }
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────
// MOBILE MENU PANEL
// Expands below the island with a spring animation
// ─────────────────────────────────────────────────────────
function MobileMenuPanel({ isOpen, onClose, activeHref, onActivate, isDark, onToggle, onEnter, onNavigate, theme = {} }) {
  const t = theme || { 
    name: 'dark', 
    borderMid: 'rgba(255,255,255,0.15)', 
    text: '#F5F5F5', 
    text2: '#A3A3A3', 
    text3: '#737373', 
    gold: '#D4AF37',
    border: 'rgba(255,255,255,0.08)',
    btnFill: '#D4AF37',
    btnText: '#000000'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 440, damping: 36 }}
          style={{
            position: 'fixed',
            top: '72px',
            left: '16px',
            right: '16px',
            zIndex: 9998,
            borderRadius: '20px',
            background: t.name === 'dark'
              ? 'rgba(14, 14, 14, 0.92)'
              : 'rgba(244, 242, 238, 0.94)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid ' + t.borderMid,
            boxShadow: t.name === 'dark'
              ? '0 24px 48px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.04) inset'
              : '0 24px 48px rgba(0,0,0,0.18), 0 0 0 0.5px rgba(0,0,0,0.06) inset',
            padding: '8px',
            overflow: 'hidden',
          }}
        >
          {/* Nav items — staggered in */}
          {NAV_ITEMS.map(function(item, i) {
            const isActive = activeHref === item.pageId
            return (
              <motion.div
                key={item.pageId}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href={'#' + item.pageId}
                  onClick={function(e) {
                    e.preventDefault()
                    onActivate(item.pageId)
                    if (onNavigate) {
                      onNavigate(item.pageId)
                    }
                    onClose()
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '13px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    background: isActive
                      ? (t.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)')
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={function(e) {
                    if (!isActive) e.currentTarget.style.background = t.name === 'dark'
                      ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
                  }}
                  onMouseLeave={function(e) {
                    if (!isActive) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span style={{
                    fontFamily: F_SANS, fontSize: '16px',
                    fontWeight: isActive ? '600' : '400',
                    color: isActive ? t.text : t.text2,
                    letterSpacing: '-0.01em',
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

          {/* Divider */}
          <div style={{ height: '1px', background: t.border, margin: '8px 16px' }} />

          {/* Bottom row: theme toggle */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: NAV_ITEMS.length * 0.04 + 0.05, duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}
          >
            <motion.button
              onClick={onToggle}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '40px', height: '40px',
                borderRadius: '50%',
                border: '1px solid ' + t.border,
                background: t.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: t.text2,
              }}
            >
              {isDark ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}



// ─────────────────────────────────────────────────────────
// DYNAMIC ISLAND NAV — main export
//
// PHYSICS:
//   mouseX / mouseY → normalized offset from island center [-1, 1]
//   rotateX spring: negative = cursor above → tilt top toward viewer
//   rotateY spring: positive = cursor right → tilt right toward viewer
//   Max tilt: 4° (subtle, premium — not a toy)
//   translateZ: 0 → 6px on hover for lift effect
// ─────────────────────────────────────────────────────────
export default function DynamicIslandNav({ isDark, toggleTheme, onEnter, onNavigate }) {

  // ── Theme management ──────────────────────────────────
  // Always derive theme from isDark to ensure it's always defined
  // The C prop is no longer used; we build theme internally
  const FALLBACK_DARK = {
    name: 'dark',
    bg: '#0A0A0A', bgAlt: '#111111', surface: '#141414',
    text: '#F5F5F5', text2: '#A3A3A3', text3: '#737373', text4: '#404040',
    gold: '#D4AF37', goldL: '#F4CE56',
    line: '#262626', lineHeavy: '#333333',
    border: 'rgba(255,255,255,0.08)', borderMid: 'rgba(255,255,255,0.15)',
    btnFill: '#D4AF37', btnText: '#000000',
    glass: 'rgba(10,10,10,0.6)',
  }
  const FALLBACK_LIGHT = {
    name: 'light',
    bg: '#F4F2EE', bgAlt: '#EBE8E3', surface: '#FFFFFF',
    text: '#121212', text2: '#525252', text3: '#858585', text4: '#A3A3A3',
    gold: '#B3862A', goldL: '#D4AF37',
    line: '#E0DCD6', lineHeavy: '#C2BCB3',
    border: 'rgba(0,0,0,0.08)', borderMid: 'rgba(0,0,0,0.18)',
    btnFill: '#121212', btnText: '#FFFFFF',
    glass: 'rgba(244,242,238,0.7)',
  }
  const theme = isDark ? FALLBACK_DARK : FALLBACK_LIGHT

  // ── State ─────────────────────────────────────────────
  const [activeHref, setActiveHref] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const islandRef = useRef(null)

  // ── 3D tilt motion values ──────────────────────────────
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const lift = useMotionValue(0)

  const springCfg = { type: 'spring', stiffness: 320, damping: 32, mass: 0.6 }
  const sRotX = useSpring(rotX, springCfg)
  const sRotY = useSpring(rotY, springCfg)
  const sLift = useSpring(lift, { stiffness: 400, damping: 38 })

  // ── Resize ─────────────────────────────────────────────
  useEffect(function() {
    function check() { setIsMobile(window.innerWidth < 768) }
    check()
    window.addEventListener('resize', check)
    return function() { window.removeEventListener('resize', check) }
  }, [])

  // ── Scroll shadow ──────────────────────────────────────
  useEffect(function() {
    function onScroll() { setScrolled(window.scrollY > 20) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return function() { window.removeEventListener('scroll', onScroll) }
  }, [])

  // ── Close menu on route/scroll ─────────────────────────
  useEffect(function() {
    if (menuOpen) {
      function onScroll() { setMenuOpen(false) }
      window.addEventListener('scroll', onScroll, { passive: true })
      return function() { window.removeEventListener('scroll', onScroll) }
    }
  }, [menuOpen])

  // ── 3D tilt: pointer move on the island ───────────────
  const handlePointerMove = useCallback(function(e) {
    const el = islandRef.current
    if (!el || isMobile) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    // Normalize to [-1, 1]
    const nx = (e.clientX - cx) / (rect.width / 2)
    const ny = (e.clientY - cy) / (rect.height / 2)
    // Max 4° tilt
    rotY.set(nx * 4)
    rotX.set(-ny * 4)
    lift.set(6)
  }, [isMobile, rotX, rotY, lift])

  const handlePointerLeave = useCallback(function() {
    rotX.set(0)
    rotY.set(0)
    lift.set(0)
  }, [rotX, rotY, lift])

  // ── Glass surface style ────────────────────────────────
  const glassBg = isDark
    ? 'rgba(12, 12, 12, 0.82)'
    : 'rgba(248, 246, 242, 0.88)'

  const borderColor = isDark
    ? 'rgba(255,255,255,0.10)'
    : 'rgba(0,0,0,0.10)'

  const innerHighlight = isDark
    ? 'rgba(255,255,255,0.04)'
    : 'rgba(255,255,255,0.70)'

  const shadowDepth = scrolled
    ? (isDark
        ? '0 20px 60px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(255,255,255,0.04) inset'
        : '0 20px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10), 0 0 0 0.5px rgba(255,255,255,0.6) inset')
    : (isDark
        ? '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.04) inset'
        : '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(255,255,255,0.65) inset')

  // ─────────────────────────────────────────────────────
  return (
    <>
      {/* ── FIXED POSITIONING WRAPPER ── */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '16px',
        // Pointer events only on the island itself
        pointerEvents: 'none',
      }}>

        {/* ── THE ISLAND ── */}
        <motion.div
          ref={islandRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{
            // 3D transform from spring values
            rotateX: sRotX,
            rotateY: sRotY,
            translateZ: sLift,
            transformStyle: 'preserve-3d',
            transformPerspective: 800,
            // Sizing
            display: 'inline-flex',
            alignItems: 'center',
            height: isMobile ? '52px' : '48px',
            padding: isMobile ? '0 12px' : '0 8px',
            gap: isMobile ? '0' : '4px',
            // Glass surface
            background: glassBg,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '100px',
            border: '1px solid ' + borderColor,
            boxShadow: shadowDepth,
            // Inner top highlight — simulates physical glass catching light
            outline: '1px solid ' + innerHighlight,
            outlineOffset: '-2px',
            // Pointer events
            pointerEvents: 'auto',
            cursor: 'default',
            // Prevent text selection on tilt
            userSelect: 'none',
          }}
          initial={{ y: -64, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 360, damping: 34, delay: 0.1 }}
        >

          {/* ── DESKTOP: center nav items ── */}
          {!isMobile && (
            <>
              {/* Separator */}
              <div style={{ width: '1px', height: '20px', background: borderColor, flexShrink: 0, margin: '0 4px' }} />

              {/* Nav items */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                {NAV_ITEMS.map(function(item) {
                  return (
                    <NavItem
                      key={item.pageId}
                      label={item.label}
                      pageId={item.pageId}
                      isActive={activeHref === item.pageId}
                      onActivate={setActiveHref}
                      onNavigate={onNavigate}
                      theme={theme}
                    />
                  )
                })}
              </div>

              {/* Separator */}
              <div style={{ width: '1px', height: '20px', background: borderColor, flexShrink: 0, margin: '0 4px' }} />

              {/* Theme toggle */}
              <div style={{ padding: '0 4px', flexShrink: 0 }}>
                <ThemeToggle isDark={isDark} onToggle={toggleTheme} theme={theme} />
              </div>
            </>
          )}

          {/* ── MOBILE: theme toggle + hamburger ── */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', paddingLeft: '8px' }}>
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} theme={theme} />

              {/* Menu trigger */}
              <motion.button
                onClick={function() { setMenuOpen(function(v) { return !v }) }}
                whileTap={{ scale: 0.9 }}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                style={{
                  width: '32px', height: '32px',
                  borderRadius: '50%',
                  border: '1px solid ' + borderColor,
                  background: menuOpen
                    ? (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)')
                    : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: theme.text2, flexShrink: 0,
                  transition: 'background 0.15s',
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
                    {menuOpen
                      ? <X size={15} strokeWidth={2} />
                      : <Menu size={15} strokeWidth={2} />
                    }
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          )}

        </motion.div>
      </div>

      {/* ── MOBILE MENU PANEL — outside the island ── */}
      <MobileMenuPanel
        isOpen={isMobile && menuOpen}
        onClose={function() { setMenuOpen(false) }}
        activeHref={activeHref}
        onActivate={setActiveHref}
        isDark={isDark}
        onToggle={toggleTheme}
        onEnter={onEnter}
        onNavigate={onNavigate}
        theme={theme}
      />


    </>
  )
}