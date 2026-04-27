import CompareToolEnhanced from '../components/CompareToolEnhanced.jsx'
import ToolPageWrapper from '../components/ToolPageWrapper.jsx'

export default function CompareToolPage() {
  return (
    <ToolPageWrapper
      title="Compare"
      subtitle="Certifications"
      description="Compare 2-4 certifications side-by-side. See salary impacts, job demand, study time, cost, and more for each cert."
      sectionId="03"
      sectionTitle="CERT_COMPARE"
    >
      <div className="glass" style={{
        padding: 'clamp(20px, 4vw, 32px)',
        border: '2px solid var(--border)',
        borderRadius: '0px',
      }}>
        <CompareToolEnhanced salary={8} />
      </div>
    </ToolPageWrapper>
  )
}
