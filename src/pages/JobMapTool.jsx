import Layout from '../components/Layout.jsx'
import JobCertMap from '../components/JobCertMap.jsx'
import ToolPageWrapper from '../components/ToolPageWrapper.jsx'

export default function JobMapToolPage() {
  return (
    <Layout currentPage="/tools/jobmap">
      <ToolPageWrapper
        title="Certification"
        subtitle="to Job Map"
        description="See which jobs and roles value each certification. Filter by role, salary range, and company type."
      >
        <div className="glass" style={{
          padding: 'clamp(20px, 4vw, 32px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
        }}>
          <JobCertMap />
        </div>
      </ToolPageWrapper>
    </Layout>
  )
}
