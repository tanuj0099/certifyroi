import ToolPageWrapper from '../components/ToolPageWrapper.jsx'
import GapAnalyzer from '../components/GapAnalyzer.jsx'

export default function GapAnalyzerTool() {
  return (
    <ToolPageWrapper
      title="Resume vs JD"
      subtitle="Gap Analyzer"
      description="Paste your resume and a target Job Description. Our AI will identify your exact skill gaps and recommend the exact certifications needed to bridge them."
      eyebrow="TOOLS"
      sectionId="10"
      sectionTitle="GAP_ANALYZER"
    >
      <div className="glass" style={{ padding: 'clamp(20px, 4vw, 32px)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
         <GapAnalyzer />
      </div>
    </ToolPageWrapper>
  )
}