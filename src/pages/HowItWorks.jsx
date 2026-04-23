// ─────────────────────────────────────────────────────────
// HowItWorks.jsx — Step-by-step guide
// ─────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Database, Upload, FileCheck, ArrowRight, TrendingUp } from 'lucide-react'
import Layout from '../components/Layout.jsx'

const F_HEAD = "'Inter', sans-serif"
const F_BODY = "'Inter', sans-serif"
const F_MONO = "'JetBrains Mono', monospace"

const STEPS = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload your resume or set your profile',
    body: 'Tell us your current salary, city, and target certification. The more specific you are, the more accurate our analysis becomes. You can skip the resume and enter details manually if you prefer.',
    color: '#6366F1',
  },
  {
    num: '02',
    icon: Database,
    title: 'We run the numbers against real India data',
    body: 'We cross-reference your salary bracket against city-specific hike data from Naukri, AmbitionBox, and LinkedIn India. We calculate break-even using your actual cert cost, not a generic estimate. We factor in market demand using live job posting counts.',
    color: '#51B1E7',
  },
  {
    num: '03',
    icon: FileCheck,
    title: 'Get a specific, bounded answer',
    body: 'Break-even to the month. 5-year net gain in rupees. Monthly salary delta from day one. An AI verdict on whether the cert makes sense for your profile. Not "it depends." An actual number.',
    color: '#10B981',
  },
  {
    num: '04',
    icon: TrendingUp,
    title: 'Verify your hike or pitch your boss',
    body: 'Use our Hike Verifier to check if your employer\'s offer is fair. Or generate a one-page brief to convince your manager to fund your certification. Both tools are included.',
    color: '#F59E0B',
  },
]

function StepCard({ step, index, isLast }) {
  const Icon = step.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start',
        paddingBottom: isLast ? '0' : '32px',
        marginBottom: isLast ? '0' : '32px',
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
        position: 'relative',
      }}
    >
      {/* Step Number */}
      <div style={{
        fontFamily: F_MONO,
        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
        color: step.color,
        fontWeight: '800',
        letterSpacing: '-0.04em',
        opacity: 0.4,
        flexShrink: 0,
        lineHeight: 1,
        paddingTop: '2px',
      }}>
        {step.num}
      </div>

      {/* Icon */}
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: step.color + '15',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={22} color={step.color} strokeWidth={2} />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: F_HEAD,
          fontWeight: '700',
          fontSize: '16px',
          color: 'var(--text)',
          marginBottom: '8px',
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
        }}>
          {step.title}
        </h3>
        <p style={{
          fontFamily: F_BODY,
          fontSize: '14px',
          color: 'var(--text-3)',
          lineHeight: '1.7',
          margin: 0,
        }}>
          {step.body}
        </p>
      </div>

      {/* Arrow connector (not on last) */}
      {!isLast && (
        <ArrowRight
          size={18}
          color="var(--text-4)"
          style={{
            position: 'absolute',
            right: '0',
            bottom: '32px',
            transform: 'rotate(90deg)',
          }}
        />
      )}
    </motion.div>
  )
}

export default function HowItWorksPage() {
  return (
    <Layout currentPage="/how-it-works">
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '60px 24px 80px',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '48px' }}
        >
          <h1 style={{
            fontFamily: F_HEAD,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '800',
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '16px',
          }}>
            How It Works
          </h1>
          <p style={{
            fontFamily: F_BODY,
            fontSize: '15px',
            color: 'var(--text-2)',
            lineHeight: 1.6,
            maxWidth: '540px',
          }}>
            Four steps from uncertainty to a data-backed career decision.
          </p>
        </motion.div>

        {/* Steps */}
        <div>
          {STEPS.map((step, i) => (
            <StepCard key={i} step={step} index={i} isLast={i === STEPS.length - 1} />
          ))}
        </div>

        {/* Under the hood */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass"
          style={{
            marginTop: '32px',
            padding: '24px 28px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <p style={{
            fontFamily: F_MONO,
            fontSize: '11px',
            color: '#F59E0B',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '16px',
          }}>
            Under the hood
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
          }}>
            {[
              { label: 'Inference', value: 'Groq LPU · llama-3.3-70b', desc: 'Sub-2-second resume analysis' },
              { label: 'Salary data', value: '40,000+ India data points', desc: 'City-specific, not national' },
              { label: 'Coverage', value: '103 certs · 17 domains', desc: 'Updated when demand changes' },
              { label: 'City model', value: 'Haversine nearest-match', desc: 'Geographic distance calculation' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{
                  fontFamily: F_MONO,
                  fontSize: '9px',
                  color: 'var(--text-4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '5px',
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: F_HEAD,
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--text)',
                  marginBottom: '5px',
                }}>
                  {item.value}
                </div>
                <div style={{
                  fontFamily: F_BODY,
                  fontSize: '12px',
                  color: 'var(--text-4)',
                  lineHeight: '1.5',
                }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{
            marginTop: '32px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <a href="/" className="btn-primary">
            Start Your Analysis
          </a>
          <a
            href="/faq"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-2)',
              fontFamily: F_HEAD,
              fontSize: '13px',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            FAQ
          </a>
        </motion.div>
      </div>
    </Layout>
  )
}
