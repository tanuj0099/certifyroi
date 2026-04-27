import CollegeVsCorporate from '../components/CollegeVsCorporate.jsx'
import ToolPageWrapper from '../components/ToolPageWrapper.jsx'

export default function CollegeTool() {
  return (
    <ToolPageWrapper
      title="College vs"
      subtitle="Corporate Path"
      description="Compare the financial and career outcomes of traditional 4-year degrees vs corporate certification programs."
      sectionId="07"
      sectionTitle="COLLEGE_COMPARE"
    >
      <div className="glass" style={{
        padding: 'clamp(20px, 4vw, 32px)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
      }}>
        <CollegeVsCorporate />
      </div>
    </ToolPageWrapper>
  )
}
