import { useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout.jsx'
import ResumeAnalyzer from '../components/ResumeAnalyzer.jsx'
import ModeSelector, { ModePill } from '../components/ModeSelector.jsx'
import ToolPageWrapper from '../components/ToolPageWrapper.jsx'
import { AnimatePresence } from 'framer-motion'

const T = { duration: 0.32, ease: [0.4, 0, 0.2, 1] }

export default function ResumeToolPage() {
  const [mode, setMode] = useState('professional')
  const [modeLocked, setModeLocked] = useState(false)

  const handleModeSelect = (id) => {
    setMode(id)
    setModeLocked(true)
  }

  const handleModeReset = () => {
    setModeLocked(false)
    setMode('professional')
  }

  const handleCertSelected = (certName, city, domain, name) => {
    // Can add navigation to ROI calculator page here in future
  }

  return (
    <Layout currentPage="/tools/resume">
      <ToolPageWrapper
        title="AI Resume"
        subtitle="Analysis"
        description="Upload your resume and get personalized certification recommendations based on your experience and career goals."
      >
        {/* Mode Selector */}
        <AnimatePresence>
          {!modeLocked && <ModeSelector onSelect={handleModeSelect} />}
        </AnimatePresence>

        {/* Tool Content */}
        {modeLocked && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={T}
          >
            <div style={{ marginBottom: '24px' }}>
              <ModePill mode={mode} onReset={handleModeReset} />
            </div>

            <div className="glass" style={{
              padding: 'clamp(20px, 4vw, 32px)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
            }}>
              <ResumeAnalyzer
                mode={mode}
                onCertSelected={handleCertSelected}
              />
            </div>
          </motion.div>
        )}
      </ToolPageWrapper>
    </Layout>
  )
}
