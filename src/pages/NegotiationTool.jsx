import ToolPageWrapper from '../components/ToolPageWrapper.jsx'
import SalaryNegotiation from '../components/SalaryNegotiation.jsx'

export default function NegotiationTool() {
  return (
    <ToolPageWrapper
      title="Salary Negotiation"
      subtitle="Script AI"
      description="Don't just ask for a hike. Justify it. Get a customized, 30-second conversational script to read to HR or your manager, backed by your recent upskilling."
      eyebrow="TOOLS"
      sectionId="09"
      sectionTitle="NEGOTIATION"
    >
      <div className="glass" style={{ padding: 'clamp(20px, 4vw, 32px)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
         <SalaryNegotiation />
      </div>
    </ToolPageWrapper>
  )
}