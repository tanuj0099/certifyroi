import CertCompare from '../components/CertCompare.jsx'
import ToolPageWrapper from '../components/ToolPageWrapper.jsx'

export default function CompareToolPage() {
  return (
    <ToolPageWrapper
      title="Compare"
      subtitle="Certifications"
      description="Compare any two certifications side-by-side. See salary impacts, job demand, study time, and cost for each cert."
    >
      <div className="glass" style={{
        padding: 'clamp(20px, 4vw, 32px)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
      }}>
        <CertCompare salary={8} prefilledCert="" />
      </div>
    </ToolPageWrapper>
  )
}
