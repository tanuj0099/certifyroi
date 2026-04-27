import HikeVerifier from '../components/HikeVerifier.jsx'
import ToolPageWrapper from '../components/ToolPageWrapper.jsx'

export default function HikeVerifierToolPage() {
  return (
    <ToolPageWrapper
      title="Salary Hike"
      subtitle="Verifier"
      description="Verify if the salary increase you're offered after getting a certification aligns with market standards."
      sectionId="08"
      sectionTitle="HIKE_VERIFY"
    >
      <div className="glass" style={{
        padding: 'clamp(20px, 4vw, 32px)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
      }}>
        <HikeVerifier />
      </div>
    </ToolPageWrapper>
  )
}
