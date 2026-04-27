import Heatmap from '../components/Heatmap.jsx'
import ToolPageWrapper from '../components/ToolPageWrapper.jsx'

export default function HeatmapToolPage() {
  return (
    <ToolPageWrapper
      title="City Demand"
      subtitle="Heatmap"
      description="See which certifications are in high demand in your city. Based on live job posting data from Naukri and LinkedIn India."
      sectionId="04"
      sectionTitle="DEMAND_MAP"
    >
      <div className="glass" style={{
        padding: 'clamp(20px, 4vw, 32px)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
      }}>
        <Heatmap
          prefilledCity=""
          prefilledDomain=""
          certName=""
          resumeName=""
        />
      </div>
    </ToolPageWrapper>
  )
}
