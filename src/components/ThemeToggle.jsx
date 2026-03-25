import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme.jsx'

const ThemeToggle = () => {
  const { theme, toggle, isDark } = useTheme()

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-thumb">
        {isDark
          ? <Moon size={11} color="white" />
          : <Sun size={11} color="white" />
        }
      </div>
    </button>
  )
}

export default ThemeToggle