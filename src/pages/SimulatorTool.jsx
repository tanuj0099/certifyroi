import Layout from '../components/Layout.jsx'
import CareerSimulator from '../components/CareerSimulator.jsx'
import ToolPageWrapper from '../components/ToolPageWrapper.jsx'

export default function SimulatorToolPage() {
  return (
    <Layout currentPage="/tools/simulator">
      <ToolPageWrapper
        title="Career"
        subtitle="Path Simulator"
        description="Simulate multi-certification career paths. See how stacking certifications impacts your lifetime earning potential."
      >
        <div className="glass" style={{
          padding: 'clamp(20px, 4vw, 32px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
        }}>
          <CareerSimulator initialSalary={8} />
        </div>
      </ToolPageWrapper>
    </Layout>
  )
}
