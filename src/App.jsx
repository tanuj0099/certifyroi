import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, FileText, Map, LogIn, LogOut, User,
  Menu, X, Home, Info, Phone, BookOpen,
  Shield, ChevronRight, Sparkles, FileCheck,
  GraduationCap, Award, Route, Building2, ArrowRight,
  Database, Clock, AlertCircle
} from 'lucide-react'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { ThemeProvider } from './hooks/useTheme.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import LandingPage from './components/LandingPage.jsx'
import ResumeAnalyzer from './components/ResumeAnalyzer.jsx'
import Hero from './components/Hero.jsx'
import Heatmap from './components/Heatmap.jsx'
import ModeSelector, { ModePill } from './components/ModeSelector.jsx'
import CollegeVsCorporate from './components/CollegeVsCorporate.jsx'
import WaveBg from './components/WaveBg.jsx'
import CertCompare from './components/CertCompare.jsx'
import CareerSimulator from './components/CareerSimulator.jsx'
import JobCertMap from './components/JobCertMap.jsx'
import HikeVerifier from './components/HikeVerifier.jsx'

const T   = { duration: 0.32, ease: [0.4, 0, 0.2, 1] }
const FM  = "'JetBrains Mono','Commit Mono',monospace"
const FH  = "'Plus Jakarta Sans','Bricolage Grotesque',sans-serif"
const FB  = "'Inter',sans-serif"
const NAV_H  = 64
const TABS_H = 88

const hs = {
  fontFamily: FH, fontWeight: '800', letterSpacing: '-0.02em',
  color: 'var(--text)', lineHeight: 1.05, marginBottom: '24px',
}

if (typeof document !== 'undefined') {
  document.documentElement.style.setProperty('--nav-h', NAV_H + 'px')
}

function useIsMobile() {
  var [mobile, setMobile] = useState(function() {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false
  })
  useEffect(function() {
    function check() { setMobile(window.innerWidth < 768) }
    window.addEventListener('resize', check)
    return function() { window.removeEventListener('resize', check) }
  }, [])
  return mobile
}

const PageWrapper = function({ children, maxWidth, padding }) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <WaveBg variant="app" />
      <div style={{ maxWidth: maxWidth || '800px', margin: '0 auto', padding: padding || (NAV_H + 24) + 'px 16px 60px', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// DATA FRESHNESS BADGE — shown in tools area
// ─────────────────────────────────────────────────────────
const DataFreshnessBadge = function() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 10px', borderRadius: '6px',
      background: 'rgba(16,185,129,0.06)',
      border: '1px solid rgba(16,185,129,0.18)',
      marginBottom: '16px',
    }}>
      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px #10B981' }} />
      <span style={{ fontFamily: FM, fontSize: '10px', color: 'rgba(16,185,129,0.8)', letterSpacing: '0.06em' }}>
        Data: Q1 2026 · LinkedIn India · NASSCOM · Naukri · AmbitionBox
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// ABOUT PAGE — Phase B + C: real founder story + methodology
// ─────────────────────────────────────────────────────────
const AboutPage = function() {
  return (
    <PageWrapper maxWidth="820px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>
        <h1 style={{ ...hs, fontSize: 'clamp(2rem,5.5vw,3.8rem)', marginBottom: '12px' }}>
          WHY I BUILT<br />
          <span style={{ background: 'linear-gradient(135deg,#6366F1,#10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            CERTIFYROI
          </span>
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-4)', fontFamily: FM, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '40px' }}>
          Bangalore · Built out of genuine frustration
        </p>

        {/* ── Origin story ── */}
        <div className="glass" style={{ padding: 'clamp(20px,4vw,36px)', marginBottom: '20px', borderLeft: '3px solid #6366F1' }}>
          <div style={{ fontSize: '11px', color: '#818CF8', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>The honest version</div>
          <p style={{ fontSize: 'clamp(14px,2vw,16px)', color: 'var(--text)', lineHeight: '1.85', marginBottom: '18px', fontFamily: FB, fontWeight: '500' }}>
            I was sitting in my room in Bangalore at 11pm, looking at my ex-classmate's LinkedIn post. Same college. Same graduation year. He'd done an AWS certification and was now making ₹28L. I was at ₹9L. I felt stupid for not having done this earlier.
          </p>
          <p style={{ fontSize: 'clamp(13px,1.8vw,15px)', color: 'var(--text-2)', lineHeight: '1.85', marginBottom: '18px', fontFamily: FB }}>
            So I did what any frustrated 22-year-old does at 11pm — I Googled "is AWS certification worth it in India." Forty-seven blog posts. All saying the same vague thing: "it depends on your career goals." Not one of them would tell me if ₹25,000 + 3 months of preparation would actually pay off at my salary level, in Bangalore, in backend development. Every salary figure was in dollars. Every "success story" was from an American LinkedIn influencer.
          </p>
          <p style={{ fontSize: 'clamp(13px,1.8vw,15px)', color: 'var(--text-2)', lineHeight: '1.85', fontFamily: FB }}>
            I made a spreadsheet. Pulled salary data from Naukri, AmbitionBox, LinkedIn India. Mapped break-even timelines. Ran the numbers for 8 different certifications. Two months later I had my answer — and I'd spent more time building the spreadsheet than studying for the cert itself. That spreadsheet became CertifyROI.
          </p>
        </div>

        {/* ── How it works — Phase C ── */}
        <div className="glass" style={{ padding: 'clamp(18px,3.5vw,28px)', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: '#51B1E7', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>How it works — 3 steps</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              {
                num: '01',
                title: 'You give us your context',
                body: 'Upload your resume or paste your experience. Tell us your city, current salary, and target certification. The more specific, the more accurate.',
                color: '#6366F1',
              },
              {
                num: '02',
                title: 'We run the numbers against real India data',
                body: 'We cross-reference your salary bracket against city-specific hike data from Naukri, AmbitionBox, and LinkedIn India. We calculate break-even using your actual cert cost, not a generic estimate. We factor in market demand using live job posting counts.',
                color: '#51B1E7',
              },
              {
                num: '03',
                title: 'You get a specific, bounded answer',
                body: 'Break-even to the month. 5-year net gain in rupees. Monthly salary delta from day one. An AI verdict on whether the cert makes sense for your profile. Not "it depends." An actual number.',
                color: '#10B981',
              },
            ].map(function(step, i) {
              var isLast = i === 2
              return (
                <div key={i} style={{
                  display: 'flex', gap: '20px', alignItems: 'flex-start',
                  paddingBottom: isLast ? '0' : '20px',
                  marginBottom: isLast ? '0' : '20px',
                  borderBottom: isLast ? 'none' : '1px solid var(--border)',
                }}>
                  <div style={{
                    fontFamily: FM, fontSize: 'clamp(1.4rem,3vw,2rem)', color: step.color,
                    fontWeight: '800', letterSpacing: '-0.04em', opacity: 0.4,
                    flexShrink: 0, lineHeight: 1, paddingTop: '2px',
                  }}>
                    {step.num}
                  </div>
                  <div>
                    <div style={{ fontFamily: FH, fontWeight: '700', fontSize: '15px', color: 'var(--text)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                      {step.title}
                    </div>
                    <div style={{ fontFamily: FB, fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7' }}>
                      {step.body}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Methodology — Phase C ── */}
        <div className="glass" style={{ padding: 'clamp(18px,3.5vw,28px)', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: '#F59E0B', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={11} />
            Methodology + Data Sources
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.8', marginBottom: '16px', fontFamily: FB }}>
            Every salary figure on CertifyROI is a <strong>median</strong> — not an average, not a maximum. Half of professionals at that cert level earn more, half earn less. We use medians because averages are skewed by outliers at large MNCs.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '12px', marginBottom: '16px' }}>
            {[
              { source: 'LinkedIn Economic Graph India', what: 'Salary bands by skill and city', updated: 'Q1 2026' },
              { source: 'NASSCOM Talent Pulse',          what: 'Certification demand by domain',  updated: 'Annual 2026' },
              { source: 'Naukri Salary Insights',        what: 'Active job postings + hike data',  updated: 'Monthly' },
              { source: 'AmbitionBox (self-reported)',   what: 'Post-certification salary jumps',  updated: 'Continuous' },
            ].map(function(s, i) {
              return (
                <div key={i} style={{ padding: '12px', borderRadius: '9px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: FH, fontSize: '12px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' }}>{s.source}</div>
                  <div style={{ fontFamily: FB, fontSize: '11px', color: 'var(--text-4)', marginBottom: '4px' }}>{s.what}</div>
                  <div style={{ fontFamily: FM, fontSize: '10px', color: '#10B981', opacity: 0.8 }}>Updated: {s.updated}</div>
                </div>
              )
            })}
          </div>

          <div style={{ padding: '12px 14px', borderRadius: '9px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <AlertCircle size={13} color="#F59E0B" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ fontFamily: FB, fontSize: '12px', color: 'var(--text-3)', lineHeight: '1.65' }}>
              <strong style={{ color: 'var(--text-2)' }}>What we assume:</strong> That you stay in the same city, that market demand doesn't collapse, and that you negotiate your hike. Real outcomes vary based on company tier, negotiation skill, and economic conditions. We show medians, not guarantees. Always use this as one data point in your decision — not the only one.
            </div>
          </div>
        </div>

        {/* ── Who it's actually for — Phase B rewrite ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            {
              label: 'The mid-level plateau',
              desc: '3 years in. Stagnant base. Watching peers jump 2x on LinkedIn. You need numbers, not motivation. That\'s what this is for.',
              color: '#818CF8',
            },
            {
              label: 'The career switcher',
              desc: 'Moving from ops to data, from finance to product. The MBA-or-cert question is expensive. We help you answer it with a spreadsheet, not a feeling.',
              color: '#51B1E7',
            },
            {
              label: 'The fresh graduate',
              desc: 'No salary history, no benchmark. Student Mode reframes the calculation around time-to-first-offer, not salary hike percentage. Built for where you actually are.',
              color: '#10B981',
            },
            {
              label: 'The professional pitching their boss',
              desc: '"My company won\'t fund it without an ROI case." Pitch Your Boss exists because this exact conversation happens every Tuesday in every Bangalore office.',
              color: '#F59E0B',
            },
          ].map(function(c, i) {
            return (
              <div key={i} className="glass" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '13px', color: c.color, marginBottom: '8px', fontFamily: FH, fontWeight: '700', lineHeight: '1.3', marginTop: '0' }}>{c.label}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: '1.65', fontFamily: FB, margin: '0' }}>{c.desc}</p>
              </div>
            )
          })}
        </div>

        {/* ── What we are not ── */}
        <div className="glass" style={{ padding: 'clamp(18px,3.5vw,24px)', marginBottom: '20px', background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.15)' }}>
          <div style={{ fontSize: '11px', color: '#EF4444', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>What we are not</div>
          <p style={{ fontSize: 'clamp(13px,1.8vw,14px)', color: 'var(--text-2)', lineHeight: '1.75', fontFamily: FB, margin: '0' }}>
            CertifyROI is not a certification prep platform. We don't sell courses. We have no affiliate deals with Coursera, Udemy, or any certification body — we earn nothing if you buy a cert. Our only incentive is to give you honest numbers, including the number that says a particular cert is <em>not worth it</em> for your specific profile. That independence is the only thing that makes this tool actually useful.
          </p>
        </div>

        {/* ── Tech stack — Phase B: no "powered by AI" ── */}
        <div className="glass" style={{ padding: 'clamp(18px,3.5vw,28px)', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: '#F59E0B', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Under the hood</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '14px' }}>
            {[
              { label: 'Inference',    value: 'Groq LPU · llama-3.3-70b',      desc: 'Sub-2-second resume analysis. Not a wrapper — actual LLM inference via Groq\'s Language Processing Unit.' },
              { label: 'Salary data', value: '40,000+ India data points',       desc: 'Cross-referenced across LinkedIn, NASSCOM, Naukri, and AmbitionBox. City-specific, not national averages.' },
              { label: 'Coverage',    value: '103 certs · 17 domains',          desc: 'Cloud, finance, medical, law, government, architecture, marketing, HR. Updated when demand thresholds change.' },
              { label: 'City model',  value: 'Haversine nearest-match',         desc: 'If your city isn\'t one of the 8 metros, we calculate geographic distance and show data for the nearest match.' },
            ].map(function(item, i) {
              return (
                <div key={i} style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>{item.label}</div>
                  <div style={{ fontFamily: FH, fontSize: '13px', fontWeight: '700', color: 'var(--text)', marginBottom: '5px' }}>{item.value}</div>
                  <div style={{ fontFamily: FB, fontSize: '12px', color: 'var(--text-4)', lineHeight: '1.5' }}>{item.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="mailto:hello@certifyroi.in"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '12px 20px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#818CF8', fontSize: '13px', fontFamily: FH, fontWeight: '700', textDecoration: 'none' }}>
            ✉ hello@certifyroi.in
          </a>
          <div style={{ padding: '12px 20px', borderRadius: '10px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-4)', fontSize: '13px', fontFamily: FM }}>
            Built in Bangalore · 2025–2026
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  )
}

// ─────────────────────────────────────────────────────────
// TERMS + PRIVACY
// ─────────────────────────────────────────────────────────
const TermsPage = function() {
  return (
    <PageWrapper maxWidth="780px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>
        <h1 style={{ ...hs, fontSize: 'clamp(1.8rem,5vw,3.5rem)' }}>TERMS AND<br /><span style={{ color: 'var(--indigo)' }}>CONDITIONS</span></h1>
        {[
          { title: '1. Acceptance',              body: 'By using CertifyROI, you agree to these terms. We may update them at any time.' },
          { title: '2. Educational Purpose',     body: 'All ROI projections are approximations for educational purposes only, not financial advice. Results represent statistical medians — half of earners are above, half below. Always verify with a qualified career advisor before making financial decisions.' },
          { title: '3. AI Disclaimer',           body: 'AI-powered analysis is generated by large language models via Groq inference. Results may be inaccurate, incomplete, or contextually wrong. Verify all data before making career decisions. Do not treat AI output as professional career counselling.' },
          { title: '4. Data and Privacy',        body: 'Resume text is processed in real-time and not stored. We do not sell personal data. See our Privacy Policy for full details.' },
          { title: '5. Salary Data Limitations', body: 'Salary figures are sourced from public reports including NASSCOM, LinkedIn India, and Naukri. These are median estimates based on self-reported and publicly available data. They do not account for company tier, negotiation outcomes, performance variation, or economic shifts. Your actual result may vary significantly.' },
          { title: '6. Limitation of Liability', body: 'CertifyROI is not liable for career decisions made based on information on this platform. Use this as one data point among many.' },
          { title: '7. Contact',                 body: 'Questions? Email us at hello@certifyroi.in' },
        ].map(function(s, i) {
          return (
            <div key={i} className="glass" style={{ padding: '18px 20px', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '14px', color: 'var(--text)', fontFamily: FH, fontWeight: '700', marginBottom: '6px', marginTop: '0' }}>{s.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', fontFamily: FB, margin: '0' }}>{s.body}</p>
            </div>
          )
        })}
        <p style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '16px', textAlign: 'center', fontFamily: FB }}>Last updated: March 2026</p>
      </motion.div>
    </PageWrapper>
  )
}

const PrivacyPage = function() {
  return (
    <PageWrapper maxWidth="780px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>
        <h1 style={{ ...hs, fontSize: 'clamp(1.8rem,5vw,3.5rem)' }}>PRIVACY<br /><span style={{ color: 'var(--indigo)' }}>POLICY</span></h1>
        {[
          { title: 'What we collect',      body: 'Email address (if you sign in with Google) and anonymised usage data. Resume text is NOT stored — processed in real-time via Groq inference and immediately discarded. We never have access to your resume after the analysis completes.' },
          { title: 'How we use your data', body: 'Email is used for authentication only. We do not send marketing emails unless you explicitly opt in. Anonymised usage data helps us understand which tools are used most, not who uses them.' },
          { title: 'Cookies and storage',  body: 'Essential cookies for authentication. We use localStorage to save your calculator preferences locally on your device. No third-party advertising cookies. No tracking pixels.' },
          { title: 'Third-party services', body: 'Groq (AI inference — resume text is not logged or stored by Groq per their data processing agreement), Firebase (authentication + profile storage), Vercel (hosting and edge functions).' },
          { title: 'Your rights',          body: 'You can request deletion of your data at any time by emailing hello@certifyroi.in. Requests are processed within 7 business days.' },
          { title: 'Contact',              body: 'Privacy questions? Email hello@certifyroi.in' },
        ].map(function(s, i) {
          return (
            <div key={i} className="glass" style={{ padding: '18px 20px', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '14px', color: 'var(--text)', fontFamily: FH, fontWeight: '700', marginBottom: '6px', marginTop: '0' }}>{s.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', fontFamily: FB, margin: '0' }}>{s.body}</p>
            </div>
          )
        })}
      </motion.div>
    </PageWrapper>
  )
}

// ─────────────────────────────────────────────────────────
// BLOG — 30 posts, Phase B: no generic AI copy
// ─────────────────────────────────────────────────────────
const BLOG_POSTS = [
  { id: 1,  tag: 'Cloud & Tech',    tagColor: '#6366F1', title: 'Is AWS Solutions Architect Worth It in 2026?',                       date: 'Mar 2026', readTime: '5 min', forWho: 'Professional', excerpt: 'With 2,400+ open roles on Naukri and average salary hikes of 30–40%, AWS SAA remains the single highest-ROI certification for Indian engineers in 2026. But the market is maturing fast — passing the exam is no longer enough.\n\nWe ran break-even analysis for three salary brackets: ₹6L, ₹10L, and ₹18L per year. At ₹10L with a 35% hike, your ₹25,000 cert investment pays back in under 3 months. That\'s a 400%+ ROI over five years.\n\nThe real value isn\'t the badge — it\'s the projects. Engineers who pair AWS SAA with two hands-on portfolio projects are getting 40–50% hikes, not 30%.\n\nBottom line: if you\'re between ₹6L and ₹20L and work in backend, DevOps, or infrastructure, AWS SAA is still the highest-confidence cert investment in India.' },
  { id: 2,  tag: 'Cloud & Tech',    tagColor: '#6366F1', title: 'Azure vs AWS vs GCP: Which Cloud Cert Pays More in India?',           date: 'Feb 2026', readTime: '6 min', forWho: 'Professional', excerpt: 'Three cloud platforms. Three certification paths. Very different salary outcomes depending on which Indian city you\'re in and which companies are hiring there.\n\nAWS dominates Bangalore and Hyderabad — 62% of cloud job postings on Naukri specify AWS skills. Azure is strongest in Pune and Delhi NCR. GCP demand is concentrated in product-first startups and newer tech companies.\n\nFor total compensation, AWS SAA holders lead at a median ₹18.5L in Bangalore. Azure Solutions Architect Expert trails slightly at ₹17.2L but has faster demand growth YoY.\n\nOur recommendation: choose your cloud based on your employer\'s stack, not the median salary. The best-paying cloud cert is the one aligned with where you actually want to work.' },
  { id: 3,  tag: 'Cloud & Tech',    tagColor: '#6366F1', title: 'CKA vs CKAD: Which Kubernetes Cert Should You Get First?',            date: 'Jan 2026', readTime: '5 min', forWho: 'Professional', excerpt: 'Both are hands-on performance-based exams. Both are recognised across every major cloud and DevOps employer in India. But they target completely different roles and career paths.\n\nCKA is for people who manage cluster infrastructure. If you\'re in DevOps, SRE, or platform engineering, this is yours. CKAD is for developers who deploy and manage applications on Kubernetes.\n\nROI comparison at ₹12L salary in Bangalore: CKA holders command a median ₹22L. CKAD holders are at ₹19L. Both have very strong demand. CKA takes roughly 12 weeks of serious preparation; CKAD is achievable in 8.\n\nIf you\'re a DevOps engineer, CKA first. If you\'re a backend developer, CKAD is the faster path.' },
  { id: 4,  tag: 'Cloud & Tech',    tagColor: '#6366F1', title: 'Terraform Associate in 2026: ROI for Indian DevOps Engineers',        date: 'Dec 2025', readTime: '4 min', forWho: 'Professional', excerpt: 'Infrastructure as Code is no longer optional for DevOps roles in India. It\'s table stakes. The question is whether formalising it with a HashiCorp Terraform Associate certification actually moves your compensation.\n\nTerraform Associate alone won\'t get you a hike at your current employer. What it does is unlock a tier of roles that weren\'t available before: platform engineering, cloud automation, and infrastructure lead positions at higher-paying companies.\n\nStudy time is low (6–8 weeks) and the exam cost is reasonable at ₹18,000. Break-even is fast — under 4 months for anyone already in a DevOps role at ₹14L+.\n\nPair it with CKA or AWS DevOps Professional for maximum market positioning.' },
  { id: 5,  tag: 'Data & AI',       tagColor: '#8B5CF6', title: 'From Ops Manager to Data Analyst: A Real 6-Month Plan',               date: 'Mar 2026', readTime: '7 min', forWho: 'Switcher',      excerpt: 'Three real professionals made this domain switch in 2025. An operations manager at a logistics company in Pune. A retail store manager in Chennai. A supply chain executive in Delhi. All moved from ₹8–12L ops roles to ₹14–18L data roles in under a year.\n\nWhat they had in common: they didn\'t just do the certification. They built a portfolio project on real data from their old domain and targeted companies where their ops context gave them a competitive advantage.\n\nThe certification they all used: IBM Data Science Professional Certificate on Coursera (₹15,000, 5 months). Not the flashiest cert — the one with the best cost-to-outcome ratio for their profile.\n\nThe switch is possible. The math works. The timeline is real.' },
  { id: 6,  tag: 'Data & AI',       tagColor: '#8B5CF6', title: 'Power BI vs Tableau: Which Data Viz Cert Gets You Hired Faster?',     date: 'Feb 2026', readTime: '5 min', forWho: 'Professional', excerpt: 'Tableau was the industry standard for four years. Power BI has been closing the gap aggressively, especially in India\'s enterprise and BFSI sector.\n\nBy job postings: Power BI now appears in 68% of Indian data analyst job descriptions vs 42% for Tableau. By salary: Tableau Desktop Specialist holders command slightly higher salaries (₹12.5L median vs ₹11.8L for PL-300).\n\nFor career switchers entering data: Power BI PL-300 is the faster path to employment. The Microsoft learning path is free, the exam is well-structured, and Indian enterprises have standardised on it.\n\nOur honest recommendation: learn Power BI first (3 months, get a job), then add Tableau on the job if your employer uses it.' },
  { id: 7,  tag: 'Data & AI',       tagColor: '#8B5CF6', title: 'Is the TensorFlow Developer Certificate Worth It in India?',          date: 'Jan 2026', readTime: '5 min', forWho: 'Professional', excerpt: 'The TensorFlow Developer Certificate is one of the few ML certifications that is genuinely hands-on — a 5-hour practical coding exam, not a multiple choice test. That distinction matters in a market flooded with AI badges.\n\nWho it\'s for: Python developers with 1–3 years of experience who want to transition into ML engineering. It signals you can actually build and deploy models, not just describe them.\n\nMedian salary for TF certified professionals in Bangalore: ₹22L — a 45% premium over equivalent non-certified engineers at the same experience level.\n\nThe hard truth: the cert without GitHub portfolio projects does almost nothing in India\'s ML hiring market. Do both.' },
  { id: 8,  tag: 'Data & AI',       tagColor: '#8B5CF6', title: 'Databricks vs Snowflake: Which Data Engineering Cert to Prioritise?', date: 'Dec 2025', readTime: '5 min', forWho: 'Professional', excerpt: 'The modern data stack in India has two dominant platforms: Databricks (lakehouse, Spark, MLflow) and Snowflake (cloud data warehouse, SQL-first). Both have respected certifications with very different career trajectories.\n\nDatabricks Associate Developer is harder but opens senior data engineering roles at product companies. Median salary in Bangalore: ₹24L. Snowflake SnowPro Core is more accessible and dominates at Indian consulting firms and BFSI.\n\nFor someone already in data engineering: if your current company uses Spark, go Databricks. If you\'re in consulting or BFSI, Snowflake is the faster career move.\n\nFor career switchers entering data engineering: Snowflake first, then Databricks as a 12–18 month level-up.' },
  { id: 9,  tag: 'Cybersecurity',   tagColor: '#EF4444', title: 'CEH vs CompTIA Security+: Which Cybersecurity Cert Pays More?',        date: 'Mar 2026', readTime: '5 min', forWho: 'Professional', excerpt: 'India\'s cybersecurity hiring market is growing faster than most tech verticals. CERT-In mandates, digital banking expansion, and the DPDP Act 2023 have created sustained demand for security professionals.\n\nCompTIA Security+ (₹35,000, 3 months) is the global baseline. Almost every MNC in India accepts it as a minimum security credential. Median salary: ₹11L. CEH (₹50,000, 4 months) is more respected in Indian government, defence, and banking contexts. Median salary: ₹14L.\n\nROI comparison: CEH costs more but pays back faster because the salary premium is larger. If you\'re targeting BFSI or government, CEH wins clearly. For MNCs or global tech roles, Security+ is the faster starting point.' },
  { id: 10, tag: 'Cybersecurity',   tagColor: '#EF4444', title: 'OSCP in India: Is It Worth ₹95,000 and 6 Months?',                    date: 'Feb 2026', readTime: '6 min', forWho: 'Professional', excerpt: 'OSCP is the most respected hands-on penetration testing certification in the world. In India, it\'s a genuine career transformer — but only for the right profile at the right career stage.\n\nThe exam is brutal: 24 hours of hacking a live network, then 24 hours to write a professional report. Global first-attempt pass rate: approximately 55%.\n\nFor penetration testers and red team professionals in India: OSCP is worth every rupee. It creates a hard salary floor — senior pentesters with OSCP in Bangalore earn ₹22–30L vs ₹8–12L for juniors without it.\n\nFor everyone else: build 2+ years of hands-on security work first. OSCP on paper without the experience to back it up wastes ₹95,000.' },
  { id: 11, tag: 'Cybersecurity',   tagColor: '#EF4444', title: 'CISM vs CISSP: Which Security Management Cert for Senior Roles?',     date: 'Jan 2026', readTime: '5 min', forWho: 'Professional', excerpt: 'Both certifications target senior security professionals. Both require years of experience. Both open CISO and Director-level doors in India. But they serve different contexts.\n\nCISM (ISACA) is management-focused: governance, risk, incident response. More popular among Indian security managers. Median salary at senior levels: ₹28L. CISSP (ISC²) requires broader technical depth and is the global gold standard at MNCs. Median salary: ₹32L.\n\nOur recommendation: CISM first if you\'re primarily in the Indian market context. CISSP if you\'re targeting global MNC roles or planning to work internationally.' },
  { id: 12, tag: 'Finance',         tagColor: '#10B981', title: 'CFA vs FMVA vs CMA: Which Finance Cert for Indian Professionals?',    date: 'Mar 2026', readTime: '6 min', forWho: 'Professional', excerpt: 'Three certifications dominate India\'s finance career landscape, and each one opens a completely different door.\n\nCFA: 3 levels, 4–5 years, globally respected. Non-negotiable for investment banking and asset management. CFA Level 1 alone adds ₹3–5L to your package at most BFSI firms. FMVA (Corporate Finance Institute): 3 months, Excel-heavy, immediately applicable. The fastest ROI if you\'re in FP&A or corporate finance. CMA (US): the path for finance managers targeting CFO. Median salary for CMA holders in India: ₹28L.\n\nThe question isn\'t which is best — it\'s which one is right for where you\'re going.' },
  { id: 13, tag: 'Finance',         tagColor: '#10B981', title: 'CA vs CPA: Should Indian Chartered Accountants Pursue US CPA?',       date: 'Feb 2026', readTime: '6 min', forWho: 'Professional', excerpt: 'Indian Chartered Accountants are among the best-qualified finance professionals in the world. The question isn\'t qualification — it\'s access and compensation ceiling.\n\nCA in India: ₹8–15L starting at Big 4. Senior manager level after 5 years: ₹20–30L. Strong but predictable trajectory. US CPA for Indian CAs: ₹1.5L investment, 12 months of study, 6 papers. The payoff: Big 4 global roles, GCC finance positions paying ₹25–40L at manager level, and genuine optionality to move to the US or UK.\n\nWho it makes sense for: CAs with 2–5 years of experience who want MNC/GCC trajectory or global mobility. Not for everyone — but for the right profile, the ROI is exceptional.' },
  { id: 14, tag: 'Finance',         tagColor: '#10B981', title: 'NISM Certifications: Fastest Way Into Indian Capital Markets',         date: 'Jan 2026', readTime: '4 min', forWho: 'Student',      excerpt: 'NISM certifications are mandatory for anyone working in SEBI-registered entities. They\'re also the cheapest, fastest way to get a foot in the door at broking houses and AMCs.\n\nNISM Series VIII (Equity Derivatives): most widely required. Cost: ₹5,000. Study time: 4–6 weeks. NISM Series X-A (Investment Adviser): required for advisory roles.\n\nFor freshers targeting finance: NISM Series VIII + Series X-A is the fastest path to ₹6–8L roles at broking houses and AMCs. Under ₹15,000 total investment for two exams that qualify you for roles paying 3–4x the investment in year one. The ROI math on these is hard to beat.' },
  { id: 15, tag: 'Management',      tagColor: '#F59E0B', title: 'PMP vs CSM: Which Project Management Cert Pays More in India?',       date: 'Mar 2026', readTime: '5 min', forWho: 'Professional', excerpt: 'PMP and CSM serve different career paths and different experience levels. Treating them as equivalent choices is a common mistake.\n\nPMP: senior PM credential for managing traditional and hybrid projects. Requires 3+ years of PM experience. India median: ₹22L. CSM: agile delivery credential, accessible to team leads without formal PM experience. India median: ₹18L.\n\nFor experienced PMs with 3+ years of project leadership: PMP clearly wins. It unlocks Director-level paths at IT services and consulting. For team leads and junior PMs without 3 years of qualifying experience: CSM first, PMP in 2–3 years. This is the most common path we see work.' },
  { id: 16, tag: 'Management',      tagColor: '#F59E0B', title: 'Google PM Certificate or Straight to PMP?',                           date: 'Feb 2026', readTime: '4 min', forWho: 'Switcher',     excerpt: 'The Google Project Management Certificate (₹12,000, 6 months on Coursera) is one of the most popular career-switching certifications in India. Whether it makes sense for you depends entirely on where you\'re starting from.\n\nFor career switchers with no PM experience: Google PM cert is your starting point. It gives you the vocabulary, a portfolio project, and something credible to point to. PMP requires 36 months of leading projects — if you don\'t have that documented, you can\'t sit the exam anyway.\n\nFor experienced professionals switching from another domain: skip Google PM and go straight to PMP. Google PM won\'t differentiate you if you already have management experience.' },
  { id: 17, tag: 'Management',      tagColor: '#F59E0B', title: 'Six Sigma in India: Green Belt or Black Belt in 2026?',                date: 'Dec 2025', readTime: '4 min', forWho: 'Professional', excerpt: 'Six Sigma certifications have high value in specific sectors — pharma, automotive, FMCG, and large-scale manufacturing operations. Outside those contexts, the ROI drops significantly.\n\nSix Sigma Green Belt (₹30,000, 3 months): practical for mid-level ops managers whose employers actively value quality methodology. Black Belt (₹55,000, 6 months): for senior ops professionals targeting quality head or VP operations roles. The salary premium is real — ₹8–12L higher than Green Belt equivalents at large manufacturers.\n\nWhere it doesn\'t pay off: pure software companies, early-stage startups, or any role without direct process management responsibility.' },
  { id: 18, tag: 'Govt & PSU',      tagColor: '#51B1E7', title: 'GATE 2026: Is It Worth It for PSU Jobs vs M.Tech?',                   date: 'Mar 2026', readTime: '6 min', forWho: 'Student',      excerpt: 'GATE opens two completely different paths. PSU recruitment (BHEL, ONGC, NTPC, IOCL) and M.Tech/MS admissions at IITs and NITs. The decision between them is actually a life decision, not just a career one.\n\nGATE for PSU: ONGC Grade E1 starts at ₹12.6L CTC including allowances. BHEL at ₹9.7L. Stable, benefits-heavy packages with structured increments and genuine job security. GATE for M.Tech: IIT stipends cover the education cost. M.Tech from a top IIT typically translates to ₹18–25L first offers in tech companies.\n\nFor engineers from Tier 2–3 colleges who want stability and a clear career ladder: PSU via GATE is the best-value path available in India right now.' },
  { id: 19, tag: 'Govt & PSU',      tagColor: '#51B1E7', title: 'IBPS PO 2026: Complete Strategy and ROI for Bank PO Preparation',      date: 'Feb 2026', readTime: '6 min', forWho: 'Student',      excerpt: 'Bank PO roles via IBPS offer starting packages of ₹8–10L including allowances, a clear promotion path, and the kind of career stability that private sector roles rarely provide.\n\nPreparation cost is low: ₹5,000–₹15,000 for quality coaching materials and mock tests. Time investment is high: serious preparation takes 6–12 months. The ROI calculation is fundamentally different from private sector certs — you\'re not just buying a salary hike, you\'re buying certainty.\n\nBest suited for: candidates from smaller cities and Tier 3 towns where banking careers carry social weight and provide stability that a ₹8L private sector offer in a metro doesn\'t.' },
  { id: 20, tag: 'Govt & PSU',      tagColor: '#51B1E7', title: 'SSC CGL vs IBPS PO: Which Government Exam Gives Better ROI?',         date: 'Jan 2026', readTime: '5 min', forWho: 'Student',      excerpt: 'SSC CGL and IBPS PO are India\'s two most-attempted central government competitive exams. The right choice depends on what you value in a career.\n\nSSC CGL: Group B and C posts across central government departments. Starting salary: ₹35,000–45,000 basic (₹7–10L CTC with allowances). Wide posting options across departments and cities. IBPS PO: Probationary Officer at public sector banks. Starting salary: ₹36,000–38,000 basic (₹8–10L CTC). More clearly defined promotion path — Scale I to Scale VII.\n\nIf career growth trajectory matters more, IBPS PO has clearer advancement. If posting location flexibility matters, SSC CGL offers more options.' },
  { id: 21, tag: 'Medical',         tagColor: '#06B6D4', title: 'DNB vs MD: Which Postgraduate Medical Path in India?',                  date: 'Mar 2026', readTime: '6 min', forWho: 'Professional', excerpt: 'The DNB vs MD question is one of the most debated among Indian medical graduates. Both are recognised as equivalent qualifications by the Medical Council of India.\n\nMD/MS advantage: attached to medical college infrastructure, academic credibility, eligibility for teaching posts and government hospital consultant roles. DNB advantage: more hospital postings available at corporate hospitals (Apollo, Fortis, Max), higher volume of tertiary care clinical exposure.\n\nSalary comparison in private practice 5 years post-PG: broadly similar across both routes. The outcome is driven more by specialty choice and city than by the degree type. Choose based on where you want to practice, not prestige.' },
  { id: 22, tag: 'Medical',         tagColor: '#06B6D4', title: 'USMLE Step 1 in 2026: Is the US Residency Path Worth It?',             date: 'Feb 2026', readTime: '7 min', forWho: 'Professional', excerpt: 'The USMLE pathway to US residency is the most expensive and time-consuming career path available to Indian MBBS graduates. It\'s also the one with the highest potential financial outcome if completed successfully.\n\nStep 1 is now pass/fail. What differentiates candidates: Step 2 CK score, clinical experience (USCE), research publications, and USMLE preparation quality. Financial reality: USMLE prep + USCE trips + application costs total ₹8–12L over 2–4 years. US residency stipends: $60,000–70,000/year. Attending physician salaries post-residency: $250,000–400,000.\n\nWho this makes sense for: MBBS graduates under 26 with strong academic records and the financial runway to absorb 3–4 years of investment before income returns.' },
  { id: 23, tag: 'Medical',         tagColor: '#06B6D4', title: 'Clinical Research Career in India: ACRP CRA Certification ROI',        date: 'Jan 2026', readTime: '5 min', forWho: 'Switcher',     excerpt: 'India is one of the world\'s largest clinical trial hubs. This creates a genuine career opportunity for life sciences graduates that is structurally underutilised.\n\nACRP CCRA certification positions Indian professionals for CRO roles at IQVIA, Syneos, PPD, and Parexel — all with large India operations. Starting salary for CRAs without certification: ₹4.5–6L. With ACRP CCRA and 2 years of experience: ₹10–14L. Senior CRAs at global CROs: ₹20–28L.\n\nFastest path for MBBS, B.Pharma, or M.Sc Life Sciences graduates: ACRP CCRA + one internship at a CRO. This combination is the most reliable route into high-growth clinical research careers in India.' },
  { id: 24, tag: 'Architecture',    tagColor: '#F97316', title: 'LEED Certification in India: Green Building Career ROI in 2026',       date: 'Mar 2026', readTime: '5 min', forWho: 'Professional', excerpt: 'India\'s green building market is growing rapidly. BEE star ratings, GRIHA, and LEED certification are now standard requirements on large commercial and institutional projects in India.\n\nLEED Green Associate (₹20,000, 2 months): opens sustainable design roles and qualifies you to work on LEED-certified projects as a contributing professional. LEED AP BD+C (₹35,000, 3 months): architects with LEED AP BD+C command ₹4–8L more than equivalent non-certified professionals on premium commercial projects.\n\nAs ESG requirements tighten and large developers standardise on green certification, LEED credentials are increasingly a differentiator, not just a nice-to-have.' },
  { id: 25, tag: 'Engineering',     tagColor: '#F97316', title: 'GATE for PSU vs Autodesk Certifications: Civil Engineering Path',       date: 'Feb 2026', readTime: '5 min', forWho: 'Student',     excerpt: 'Civil engineering graduates face a genuine fork: the stability of PSU via GATE, or the skills-based private sector path via BIM and software certifications. Neither is universally better — it depends entirely on what you want from a career.\n\nGATE for civil engineers: NHAI, RVNL, BHEL, and CPWD all recruit via GATE. Packages: ₹8–12L CTC. Structured, stable, with genuine infrastructure impact. Autodesk AutoCAD + Revit/Civil 3D (₹12,000–15,000 each, 2 months each): open private sector roles in design consultancies. Entry salaries are lower but growth in premium firms is faster.\n\nFor civil engineers from Tier 2–3 colleges who prioritise stability: GATE is the clearest path.' },
  { id: 26, tag: 'Engineering',     tagColor: '#F97316', title: 'Solar Energy Certifications in India: Renewable Energy Career ROI',    date: 'Jan 2026', readTime: '5 min', forWho: 'Switcher',    excerpt: 'India\'s solar energy sector is one of the fastest-growing employers in the country right now. The 500 GW renewable energy target by 2030 is creating genuine structural demand for solar professionals at every level.\n\nNABCEP Solar PV Installation Professional (₹30,000, 3 months): increasingly required by solar EPCs for senior technical roles. For electrical engineers switching to renewable energy, NABCEP PV Installation Professional + one site project is the most reliable entry into solar EPC roles at ₹8–14L.\n\nFor non-engineers: NABCEP PV Associate (₹8,000) is the entry point for procurement, project coordination, and sales roles in the sector.' },
  { id: 27, tag: 'Marketing',       tagColor: '#EC4899', title: 'Google Digital Marketing Certificate: Honest ROI for Indian Professionals', date: 'Mar 2026', readTime: '5 min', forWho: 'Student',  excerpt: 'The Google Digital Marketing & E-commerce Certificate completed 480,000+ times in India in 2025 alone. That popularity is both its biggest strength and its main limitation.\n\nWhat it does: structured foundation in SEO, SEM, social media, analytics, and email marketing. Google\'s name recognition opens doors at smaller companies and startups. What it doesn\'t do: differentiate you at large companies or agencies where everyone has it.\n\nROI reality: entry digital marketing roles in India pay ₹3.5–5L for freshers regardless of which cert you hold. The cert gets you in the room. A portfolio with real campaign results gets you the offer. Do both.' },
  { id: 28, tag: 'HR & People',     tagColor: '#A855F7', title: 'SHRM Certification in India: Is It Worth It for HR Professionals?',   date: 'Feb 2026', readTime: '5 min', forWho: 'Professional', excerpt: 'HR in India is evolving — People Analytics, HRBP roles, and DEI programmes are pushing the function beyond administration into strategic territory. SHRM is the certification that signals this shift.\n\nSHRM-CP (₹45,000, 4 months): designed for HR professionals in operational roles. Most valuable at MNCs, GCCs, and large IT services firms where global HR standards apply.\n\nSalary impact: SHRM-CP holders at MNCs command a ₹3–6L premium over non-certified HR professionals at the same experience level. The premium is concentrated in companies with US or global HR frameworks — not in Indian-origin companies with domestic HR structures.' },
  { id: 29, tag: 'Marketing',       tagColor: '#EC4899', title: 'HubSpot vs Meta vs Google: Which Digital Marketing Stack to Certify In?', date: 'Jan 2026', readTime: '5 min', forWho: 'Student', excerpt: 'Three platform ecosystems. Three certification stacks. Each one opens a different slice of India\'s digital marketing job market.\n\nGoogle (Search Ads + Analytics 4): essential for performance marketing roles at agencies and D2C brands. Free certifications, high recognition. If you\'re targeting entry roles, Google is your baseline. Meta Blueprint: prioritised at FMCG, fashion, and consumer brands. Signals you can actually manage media spend profitably. HubSpot: best for B2B marketing, SaaS, and inbound roles. Free, widely respected, and CRM knowledge transfers across jobs.\n\nFor a fresher: Google Analytics + HubSpot Content + Meta Blueprint. Three certs, under ₹5,000 total, covering 80% of entry digital marketing job requirements in India.' },
  { id: 30, tag: 'HR & People',     tagColor: '#A855F7', title: 'People Analytics Certification: ROI for HR Professionals in 2026',    date: 'Mar 2026', readTime: '5 min', forWho: 'Professional', excerpt: 'People Analytics is the fastest-growing sub-discipline in HR. Indian companies — especially in tech, BFSI, and large manufacturing — are building people analytics functions from scratch.\n\nThe University of Pennsylvania People Analytics Certificate (Coursera, ₹15,000, 3 months) is the most respected short-form credential in this space. It covers workforce planning, HR metrics, regression analysis for people data, and dashboard design.\n\nSalary premium in India: HR professionals with demonstrated people analytics skills command ₹4–8L more than peers at the same experience level at MNCs and product companies.\n\nThe cert alone isn\'t sufficient — you need a real portfolio project. Ideally a workforce analysis you ran at your current company, presented as a case study. That\'s what converts the credential into a salary move.' },
]

const BlogPage = function() {
  var [filter,       setFilter]       = useState('All')
  var [expandedPost, setExpandedPost] = useState(null)
  var [domainFilter, setDomainFilter] = useState('All')
  var DOMAIN_FILTERS = ['All','Cloud & Tech','Data & AI','Cybersecurity','Finance','Management','Govt & PSU','Medical','Architecture','Engineering','Marketing','HR & People']
  var filtered = BLOG_POSTS.filter(function(p) {
    var modeOk   = filter === 'All' || p.forWho === filter
    var domainOk = domainFilter === 'All' || p.tag === domainFilter
    return modeOk && domainOk
  })
  return (
    <PageWrapper maxWidth="1060px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>
        <h1 style={{ ...hs, fontSize: 'clamp(2rem,5.5vw,3.8rem)' }}>
          THE CERTIFYROI<br /><span style={{ color: 'var(--indigo)' }}>BLOG</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-3)', marginBottom: '6px', fontFamily: FB }}>
          {BLOG_POSTS.length} data-driven career guides. No affiliate links. No sponsored recommendations. Just numbers.
        </p>
        {/* Phase C: data freshness */}
        <div style={{ marginBottom: '20px' }}>
          <DataFreshnessBadge />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {['All','Student','Switcher','Professional'].map(function(t) {
            return (
              <button key={t} onClick={function() { setFilter(t) }}
                style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontFamily: FB, fontWeight: '600', transition: 'all 0.18s', background: filter===t?'var(--indigo-dim)':'var(--surface)', border: '1px solid '+(filter===t?'var(--border-accent)':'var(--border)'), color: filter===t?'var(--indigo-light)':'var(--text-4)', minHeight: '36px' }}>
                {t}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {DOMAIN_FILTERS.map(function(d) {
            return (
              <button key={d} onClick={function() { setDomainFilter(d) }}
                style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontFamily: FM, letterSpacing: '0.03em', transition: 'all 0.18s', background: domainFilter===d?'rgba(99,102,241,0.12)':'var(--surface)', border: '1px solid '+(domainFilter===d?'rgba(99,102,241,0.3)':'var(--border)'), color: domainFilter===d?'#818CF8':'var(--text-4)', minHeight: '32px' }}>
                {d}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(300px,100%),1fr))', gap: '16px' }}>
          {filtered.map(function(post, i) {
            var isExpanded = expandedPost === post.id
            var paragraphs = post.excerpt.split('\n\n')
            return (
              <motion.div key={post.id} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                className="glass" style={{ padding:'22px', display:'flex', flexDirection:'column', cursor:'pointer' }}
                whileHover={{ y:-2 }}
                onClick={function() { setExpandedPost(isExpanded ? null : post.id) }}>
                <div style={{ fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'6px', background:post.tagColor+'18', color:post.tagColor, display:'inline-block', marginBottom:'12px', fontFamily:FM, letterSpacing:'0.06em' }}>{post.tag}</div>
                <h3 style={{ fontSize:'14px', fontWeight:'700', color:'var(--text)', marginBottom:'10px', lineHeight:'1.45', fontFamily:FH, flex:1, marginTop:'0' }}>{post.title}</h3>
                <p style={{ fontSize:'13px', color:'var(--text-3)', lineHeight:'1.7', marginBottom:'12px', fontFamily:FB }}>{paragraphs[0]}</p>
                <AnimatePresence>
                  {isExpanded ? (
                    <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} transition={{ duration:0.25 }} style={{ overflow:'hidden' }}>
                      {paragraphs.slice(1).map(function(para, pi) {
                        return <p key={pi} style={{ fontSize:'13px', color:'var(--text-3)', lineHeight:'1.75', marginBottom:'12px', fontFamily:FB }}>{para}</p>
                      })}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto', paddingTop:'10px', borderTop:'1px solid var(--border)' }}>
                  <span style={{ fontSize:'11px', color:'var(--text-4)', fontFamily:FB }}>{post.date} · {post.readTime} read</span>
                  <span style={{ fontSize:'12px', color:'var(--indigo)', fontWeight:'700', fontFamily:FH, display:'flex', alignItems:'center', gap:'3px' }}>
                    {isExpanded ? 'Close' : 'Read more'}
                    <motion.span animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration:0.2 }} style={{ display:'inline-flex' }}>
                      <ChevronRight size={12} />
                    </motion.span>
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 24px', color:'var(--text-4)', fontFamily:FB }}>No posts match your current filters.</div>
        )}
      </motion.div>
    </PageWrapper>
  )
}

// ─────────────────────────────────────────────────────────
// FAQ — 20 questions, Phase B: specific not generic
// ─────────────────────────────────────────────────────────
const FAQPage = function() {
  var [open, setOpen] = useState(null)
  var faqs = [
    { category: 'Product', q: 'Is CertifyROI free?', a: 'Yes. The ROI calculator, city demand heatmap, cert comparison, career simulator, and job-cert map are all free with no account required. You get 3 free AI analyses as a guest. Sign in with Google for unlimited free AI analyses.' },
    { category: 'Product', q: 'What is the difference between Resume AI and the ROI Calculator?', a: 'Resume AI (Step 1) is for discovery — you don\'t know which cert to pursue. You upload your resume and the AI reads your background and recommends the top 3 certifications. ROI Calculator (Step 2) is for validation — you already know which cert and want the exact financial numbers: break-even to the month, 5-year net gain, monthly salary delta, and an AI verdict.' },
    { category: 'Product', q: 'Why does Student Mode exist?', a: 'Standard ROI calculators assume you have a salary to compare against. Students don\'t. Student Mode removes salary sliders entirely and reframes the calculation around time-to-first-offer, fresher benchmarks in your city, and career investment ROI. The cert recommendations also shift — Student Mode prioritises certs with strong fresher hiring signals over certs that maximise salary hikes for experienced professionals.' },
    { category: 'Product', q: 'What is Pitch Your Boss?', a: 'Pitch Your Boss generates a professional email for professionals who need to justify a certification to their manager for company sponsorship. You enter the cert name, your current role, and expected ROI, and it produces a data-backed email you can send or adapt. Only available in Professional mode because that\'s the context where this conversation actually happens.' },
    { category: 'Product', q: 'What is the Cert to Job Map?', a: 'The Job-Cert Map shows which certifications are required or preferred for specific roles across government positions (UPSC, SSC, PSU exams) and private sector roles at major Indian employers. Government data is from official recruitment notifications. Private sector data is employee-reported via LinkedIn and AmbitionBox.' },
    { category: 'Product', q: 'How is Career Simulator different from the ROI Calculator?', a: 'ROI Calculator analyses one certification: what does THIS cert do to your salary over 5 years. Career Simulator models a multi-cert trajectory: if you do AWS SAA now, then CKA in 18 months, then AWS DevOps Pro after that, what does your salary curve look like at each milestone. It\'s for planning a 3–5 year path, not evaluating a single decision.' },
    { category: 'Data & Accuracy', q: 'How accurate are the salary figures?', a: 'Salary data is sourced from LinkedIn Economic Graph India, NASSCOM 2026 talent survey, Naukri salary insights, and AmbitionBox self-reported data. All figures are medians — half of earners are above, half below. Individual results vary based on company tier, negotiation skill, and market conditions. We update quarterly. We do not guarantee these numbers will match your specific situation.' },
    { category: 'Data & Accuracy', q: 'Is my resume stored anywhere?', a: 'No. Resume text is processed in real-time via Groq inference and is not stored, logged, or retained. The text goes in, analysis comes out, and the data is gone. We do not have access to your resume after the analysis completes — this is how the system is architecturally designed, not just a policy statement.' },
    { category: 'Data & Accuracy', q: 'My city isn\'t one of the 8. What happens?', a: 'We have city-specific data for Bangalore, Hyderabad, Pune, Mumbai, Delhi NCR, Chennai, Kolkata, and Ahmedabad. If your city isn\'t in our database, we use the Haversine formula — a geographic distance calculation using latitude and longitude — to find the nearest city and show that data with a clear disclosure. India national median is also shown below for comparison.' },
    { category: 'Data & Accuracy', q: 'How often is the cert database updated?', a: 'The certification list is reviewed quarterly. New certs are added when they appear in 50+ job postings on Naukri in a 30-day period. Salary hike data updates quarterly. Demand data (job posting counts) updates monthly. The last full update was Q1 2026.' },
    { category: 'Career Questions', q: 'I have no tech background. Can I still use CertifyROI?', a: 'Yes. CertifyROI covers finance (CFA, FMVA, CMA, CA, NISM), management (PMP, CSM, Six Sigma), marketing (Google, HubSpot, Meta), HR (SHRM, People Analytics), product management, architecture (LEED), medical (DNB, USMLE, ACRP), law, civil and mechanical engineering, and government exam prep (GATE, UPSC, SSC, IBPS). Tech is one of 17 domains.' },
    { category: 'Career Questions', q: 'I want to switch careers completely. Where do I start?', a: 'Upload your resume in Step 1 and select Switcher mode. The AI will identify your transferable skills and suggest the fastest viable certification path to your target domain. The fastest ROI switches we\'ve seen data on: ops/finance → data analytics (IBM Data Science, 5 months), backend dev → cloud (AWS SAA, 3 months), MBBS → clinical research (ACRP CRA, 4 months).' },
    { category: 'Career Questions', q: 'For switchers and professionals, are long-term certs like CA or CFA shown?', a: 'For Switchers and Professionals, fast-track certifications (completable in under 6 months) are shown first by default. Long-term programs (CA, CFA, ACCA) are hidden unless you explicitly toggle "Show long-term options." Someone looking to move in the next 6 months shouldn\'t be pushed toward a 3-year program.' },
    { category: 'Career Questions', q: 'Can CertifyROI help with government exam planning?', a: 'We can show you the ROI profile of government exams — starting salaries, allowances, career trajectories, prep costs, and realistic success rates. We can\'t help with actual exam preparation content. Use us to decide if a government path makes sense for your profile and situation — not to prepare for it.' },
    { category: 'Technical', q: 'The AI analysis gave me a weird result. What should I do?', a: 'AI responses vary slightly each time. If the result looks wrong, refresh and re-run. If you\'re getting consistently poor results, the issue is likely the resume input: very short resumes (under 150 words), PDF extraction errors, or heavily formatted PDFs with tables produce poor analysis. Try pasting your resume text directly into the text area.' },
    { category: 'Technical', q: 'My PDF isn\'t being read correctly. Why?', a: 'PDF text extraction works on standard text-based PDFs. Issues occur with: scanned PDFs (image-based, no text layer), complex table layouts, custom embedded fonts, and password-protected files. If extraction fails, paste your resume text directly — same results, none of the PDF issues.' },
    { category: 'Technical', q: 'Why does the app ask me to choose Student, Switcher, or Professional?', a: 'Your mode changes how the tool works fundamentally, not just cosmetically. Student Mode removes salary assumptions and focuses on first-offer benchmarks. Switcher Mode surfaces fast-track certs and filters long programs. Professional Mode enables Pitch Your Boss and shows full hike data. Wrong mode = inaccurate recommendations. Pick the one that honestly describes where you are.' },
    { category: 'Technical', q: 'Is there a mobile app?', a: 'CertifyROI is a mobile-optimised web app. Open certifyroi.vercel.app in your mobile browser — all tools work fully on any screen size. You can add it to your home screen from Safari or Chrome for an app-like experience without an App Store install.' },
    { category: 'Technical', q: 'Why does my session reset when I close the tab?', a: 'Guest preferences are stored in localStorage and persist across sessions on the same device. Guest AI analysis count resets if you clear browser data. Sign in with Google to save your analysis history, cert preferences, and profile across all devices permanently.' },
    { category: 'Technical', q: 'I found incorrect salary data. How do I report it?', a: 'We want to know. Use the Contact page and include: the cert name, your city, the figure you saw on CertifyROI, and a link to a data source you believe is more accurate. We review all reported corrections and update the database quarterly. Your correction may help thousands of other professionals make a better decision.' },
  ]
  var categories = ['Product', 'Data & Accuracy', 'Career Questions', 'Technical']
  return (
    <PageWrapper maxWidth="760px">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={T}>
        <h1 style={{ ...hs, fontSize:'clamp(2rem,5.5vw,3.8rem)' }}>
          FREQUENTLY<br /><span style={{ color:'var(--indigo)' }}>ASKED</span>
        </h1>
        <p style={{ fontSize:'15px', color:'var(--text-3)', marginBottom:'12px', fontFamily:FB }}>
          {faqs.length} questions answered. No corporate speak.
        </p>
        <div style={{ marginBottom: '28px' }}>
          <DataFreshnessBadge />
        </div>
        {categories.map(function(cat) {
          var catFaqs = faqs.filter(function(f) { return f.category === cat })
          return (
            <div key={cat} style={{ marginBottom:'32px' }}>
              <div style={{ fontFamily:FM, fontSize:'10px', color:'var(--text-4)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'12px', display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ height:'1px', width:'24px', background:'var(--border)' }} />
                {cat}
                <div style={{ height:'1px', flex:1, background:'var(--border)' }} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {catFaqs.map(function(faq, i) {
                  var idx    = cat + '-' + i
                  var isOpen = open === idx
                  return (
                    <motion.div key={idx} className="glass" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                      style={{ overflow:'hidden', cursor:'pointer' }} onClick={function() { setOpen(isOpen?null:idx) }}>
                      <div style={{ padding:'16px 20px', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'14px', minHeight:'52px' }}>
                        <span style={{ fontSize:'14px', fontWeight:'600', color:isOpen?'var(--indigo-light)':'var(--text)', fontFamily:FH, lineHeight:'1.45', flex:1 }}>{faq.q}</span>
                        <motion.div animate={{ rotate:isOpen?90:0 }} transition={{ duration:0.2 }} style={{ flexShrink:0, marginTop:'2px' }}>
                          <ChevronRight size={15} color="var(--text-4)" />
                        </motion.div>
                      </div>
                      <AnimatePresence>
                        {isOpen ? (
                          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.22 }} style={{ overflow:'hidden' }}>
                            <div style={{ padding:'0 20px 18px', paddingTop:'14px', fontSize:'14px', color:'var(--text-2)', borderTop:'1px solid var(--border)', fontFamily:FB, lineHeight:'1.8' }}>{faq.a}</div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </motion.div>
    </PageWrapper>
  )
}

// ─────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────
const ContactPage = function() {
  var [sent, setSent]         = useState(false)
  var [formData, setFormData] = useState({ name:'', email:'', subject:'General feedback', message:'' })
  var inputStyle = { width:'100%', padding:'11px 14px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'14px', fontFamily:FB, outline:'none', boxSizing:'border-box', transition:'border-color 0.18s' }
  var labelStyle = { fontSize:'11px', color:'var(--text-4)', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:FM }
  return (
    <PageWrapper maxWidth="600px">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={T}>
        <h1 style={{ ...hs, fontSize:'clamp(2rem,5.5vw,3.8rem)' }}>CONTACT<br /><span style={{ color:'var(--indigo)' }}>US</span></h1>
        <p style={{ fontSize:'15px', color:'var(--text-3)', marginBottom:'28px', fontFamily:FB }}>Feedback, data corrections, bug reports, or partnership enquiries.</p>
        {sent ? (
          <div className="glass" style={{ padding:'48px', textAlign:'center' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'16px' }}>✅</div>
            <h3 style={{ fontSize:'1.4rem', color:'var(--text)', fontFamily:FH, fontWeight:'800', marginBottom:'8px', marginTop:'0' }}>Sent.</h3>
            <p style={{ fontSize:'14px', color:'var(--text-3)', fontFamily:FB, lineHeight:'1.6' }}>We\'ll reply within 48 hours at the email you provided.</p>
          </div>
        ) : (
          <div className="glass" style={{ padding:'clamp(20px,4vw,32px)' }}>
            {[
              { key:'name',  label:'Name',  type:'text',  ph:'Your name'     },
              { key:'email', label:'Email', type:'email', ph:'you@email.com' },
            ].map(function(f) {
              return (
                <div key={f.key} style={{ marginBottom:'16px' }}>
                  <label style={labelStyle}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={formData[f.key]}
                    onChange={function(e) { setFormData(function(p) { var n={...p}; n[f.key]=e.target.value; return n }) }}
                    style={inputStyle}
                    onFocus={function(e) { e.target.style.borderColor='var(--border-accent)' }}
                    onBlur={function(e)  { e.target.style.borderColor='var(--border)' }} />
                </div>
              )
            })}
            <div style={{ marginBottom:'16px' }}>
              <label style={labelStyle}>Subject</label>
              <select value={formData.subject} onChange={function(e) { setFormData(function(p) { return {...p,subject:e.target.value} }) }}
                style={{ ...inputStyle, background:'var(--surface)' }}>
                <option>General feedback</option>
                <option>Data correction</option>
                <option>Bug report</option>
                <option>Partnership / B2B</option>
                <option>Press enquiry</option>
              </select>
            </div>
            <div style={{ marginBottom:'24px' }}>
              <label style={labelStyle}>Message</label>
              <textarea rows={5} placeholder="Tell us what's on your mind..." value={formData.message}
                onChange={function(e) { setFormData(function(p) { return {...p,message:e.target.value} }) }}
                style={{ ...inputStyle, resize:'vertical', lineHeight:'1.6' }}
                onFocus={function(e) { e.target.style.borderColor='var(--border-accent)' }}
                onBlur={function(e)  { e.target.style.borderColor='var(--border)' }} />
            </div>
            <button className="btn-primary" style={{ width:'100%', padding:'14px' }} onClick={function() { setSent(true) }}>Send Message</button>
          </div>
        )}
      </motion.div>
    </PageWrapper>
  )
}

// ─────────────────────────────────────────────────────────
// NAV + TAB CONSTANTS — Study Tracker removed
// ─────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id:'home',    label:'Home',    icon:Home       },
  { id:'app',     label:'Tools',   icon:TrendingUp },
  { id:'blog',    label:'Blog',    icon:BookOpen   },
  { id:'faq',     label:'FAQ',     icon:Sparkles   },
  { id:'about',   label:'About',   icon:Info       },
  { id:'contact', label:'Contact', icon:Phone      },
]

const STEP_TABS = [
  { id:'resume',     num:'1', label:'Find Cert',     icon:FileText,   desc:'AI picks from resume'    },
  { id:'calculator', num:'2', label:'Calculate ROI', icon:TrendingUp, desc:'Break-even and 5yr gain' },
  { id:'heatmap',    num:'3', label:'City Demand',   icon:Map,        desc:'Is it hot in your city?' },
]

const TOOL_TABS = [
  { id:'compare',       label:'Compare Certs',   icon:Award,         desc:'Two certs side by side'       },
  { id:'simulate',      label:'Career Path',     icon:Route,         desc:'Multi-cert salary trajectory' },
  { id:'jobmap',        label:'Cert to Job Map', icon:Building2,     desc:'Which cert gets which role'   },
  { id:'college',       label:'Degree vs Certs', icon:GraduationCap, desc:'MBA vs certifications'        },
  { id:'hikeverifier',  label:'Verify Hike',     icon:TrendingUp,    desc:'Did the cert pay off?'        },
]

const StepArrow = function({ active }) {
  return (
    <div style={{ display:'flex', alignItems:'center', flexShrink:0, padding:'0 1px' }}>
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M0 6 H14 M10 1 L16 6 L10 11"
          stroke={active ? '#6366F1' : 'rgba(99,102,241,0.25)'}
          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={active ? '0' : '3 3'}
          style={{ transition: 'stroke 0.3s' }} />
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// MOBILE DRAWER
// ─────────────────────────────────────────────────────────
const MobileDrawer = function({ open, onClose, currentPage, activeTab, onNavigate, onTabChange }) {
  var drawerRef = useRef(null)

  useEffect(function() {
    if (!open) return
    function handleClick(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('touchstart', handleClick)
    return function() {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [open, onClose])

  useEffect(function() {
    if (open) { document.body.style.overflow = 'hidden' }
    else { document.body.style.overflow = '' }
    return function() { document.body.style.overflow = '' }
  }, [open])

  function go(pageId) { onNavigate(pageId); onClose() }
  function tab(tabId) { onTabChange(tabId); onNavigate('app'); onClose() }

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(2px)', zIndex:298 }}
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        ref={drawerRef}
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type:'spring', stiffness:340, damping:32 }}
        style={{ position:'fixed', top:0, left:0, bottom:0, width:'min(300px,82vw)', zIndex:299, background:'var(--bg)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', overflowY:'auto', overflowX:'hidden', WebkitOverflowScrolling:'touch' }}
      >
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <button onClick={function() { go('home') }}
            style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'28px', height:'28px', background:'linear-gradient(135deg,var(--indigo),#4338CA)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <TrendingUp size={13} color="white" />
            </div>
            <span style={{ fontFamily:FH, fontWeight:'800', fontSize:'16px', letterSpacing:'-0.02em', color:'var(--text)' }}>
              Certify<span style={{ color:'var(--indigo)' }}>ROI</span>
            </span>
          </button>
          <button onClick={onClose}
            style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'7px', padding:'7px', cursor:'pointer', color:'var(--text-3)', display:'flex', alignItems:'center', minWidth:'36px', minHeight:'36px', justifyContent:'center' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ flex:1, padding:'16px', display:'flex', flexDirection:'column', gap:'6px' }}>
          <div style={{ fontFamily:FM, fontSize:'9px', color:'var(--text-4)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'6px', marginTop:'4px' }}>Core Flow</div>
          {STEP_TABS.map(function(t) {
            var isActive = activeTab === t.id && currentPage === 'app'
            return (
              <button key={t.id} onClick={function() { tab(t.id) }}
                style={{ width:'100%', padding:'12px 14px', borderRadius:'10px', cursor:'pointer', textAlign:'left', background:isActive?'var(--indigo-dim)':'var(--surface)', border:'1px solid '+(isActive?'var(--border-accent)':'var(--border)'), display:'flex', alignItems:'center', gap:'10px', minHeight:'48px' }}>
                <div style={{ width:'22px', height:'22px', borderRadius:'50%', background:isActive?'var(--indigo)':'var(--bg)', border:'1px solid '+(isActive?'var(--indigo)':'var(--border)'), display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'700', color:isActive?'white':'var(--text-4)', flexShrink:0, fontFamily:FM }}>
                  {t.num}
                </div>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:'700', color:isActive?'var(--indigo-light)':'var(--text)', fontFamily:FH, letterSpacing:'-0.01em' }}>{t.label}</div>
                  <div style={{ fontSize:'11px', color:'var(--text-4)', fontFamily:FB }}>{t.desc}</div>
                </div>
              </button>
            )
          })}

          <div style={{ fontFamily:FM, fontSize:'9px', color:'var(--text-4)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'6px', marginTop:'10px' }}>Tools</div>
          {TOOL_TABS.map(function(t) {
            var isActive = activeTab === t.id && currentPage === 'app'
            return (
              <button key={t.id} onClick={function() { tab(t.id) }}
                style={{ width:'100%', padding:'12px 14px', borderRadius:'10px', cursor:'pointer', textAlign:'left', background:isActive?'var(--indigo-dim)':'var(--surface)', border:'1px solid '+(isActive?'var(--border-accent)':'var(--border)'), display:'flex', alignItems:'center', gap:'10px', minHeight:'48px' }}>
                <t.icon size={16} color={isActive?'var(--indigo)':'var(--text-4)'} style={{ flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:'13px', fontWeight:'700', color:isActive?'var(--indigo-light)':'var(--text)', fontFamily:FH, letterSpacing:'-0.01em' }}>{t.label}</div>
                  <div style={{ fontSize:'11px', color:'var(--text-4)', fontFamily:FB }}>{t.desc}</div>
                </div>
              </button>
            )
          })}

          <div style={{ fontFamily:FM, fontSize:'9px', color:'var(--text-4)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'6px', marginTop:'10px' }}>Navigate</div>
          {[
            { id:'blog',    label:'Blog',    icon:BookOpen  },
            { id:'faq',     label:'FAQ',     icon:Sparkles  },
            { id:'about',   label:'About',   icon:Info      },
            { id:'contact', label:'Contact', icon:Phone     },
            { id:'terms',   label:'Terms',   icon:FileCheck },
            { id:'privacy', label:'Privacy', icon:Shield    },
          ].map(function(item) {
            var isActive = currentPage === item.id
            return (
              <button key={item.id} onClick={function() { go(item.id) }}
                style={{ width:'100%', padding:'11px 14px', borderRadius:'9px', background:isActive?'var(--indigo-dim)':'var(--surface)', border:'1px solid '+(isActive?'var(--border-accent)':'var(--border)'), cursor:'pointer', display:'flex', alignItems:'center', gap:'10px', color:isActive?'var(--indigo-light)':'var(--text-2)', fontSize:'13px', fontFamily:FB, minHeight:'44px', transition:'all 0.15s' }}>
                <item.icon size={14} color={isActive?'var(--indigo)':'var(--text-4)'} />
                {item.label}
              </button>
            )
          })}
        </div>

        <div style={{ padding:'16px 20px', borderTop:'1px solid var(--border)', flexShrink:0 }}>
          <DataFreshnessBadge />
        </div>
      </motion.div>
    </>
  )
}

// ─────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────
const NavBar = function({ currentPage, activeTab, onNavigate, onTabChange }) {
  var [drawerOpen, setDrawerOpen] = useState(false)
  var [signingIn,  setSigningIn]  = useState(false)
  var isMobile = useIsMobile()
  var { user, signInGoogle, signOut, loading } = useAuth()

  var go        = function(id) { onNavigate(id) }
  var switchTab = function(id) { onTabChange(id) }

  var handleSignIn = async function() {
    setSigningIn(true)
    try { await signInGoogle() } catch(e) {}
    setSigningIn(false)
  }

  return (
    <>
      <MobileDrawer
        open={drawerOpen}
        onClose={function() { setDrawerOpen(false) }}
        currentPage={currentPage}
        activeTab={activeTab}
        onNavigate={go}
        onTabChange={switchTab}
      />

      <motion.header
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={T}
        style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'var(--bg)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)', transition:'background 0.3s' }}
      >
        <div style={{ maxWidth:'1240px', margin:'0 auto', padding:'0 12px' }}>
          <div style={{ display:'flex', alignItems:'center', height:NAV_H+'px', gap:'4px' }}>

            <button
              onClick={function() { setDrawerOpen(true) }}
              aria-label="Open menu"
              style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px', padding:'8px', cursor:'pointer', color:'var(--text-3)', display:'flex', alignItems:'center', justifyContent:'center', minWidth:'40px', minHeight:'40px', flexShrink:0, marginRight:'4px', transition:'all 0.18s' }}
            >
              <Menu size={16} />
            </button>

            <button onClick={function() { go('home') }}
              style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'7px', flexShrink:0, padding:'0 4px 0 0', marginRight:'4px', minHeight:'44px' }}>
              <div style={{ width:'28px', height:'28px', background:'linear-gradient(135deg,var(--indigo),#4338CA)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <TrendingUp size={13} color="white" />
              </div>
              <span style={{ fontFamily:FH, fontWeight:'800', fontSize:'16px', letterSpacing:'-0.02em', color:'var(--text)' }}>
                Certify<span style={{ color:'var(--indigo)' }}>ROI</span>
              </span>
            </button>

            {!isMobile ? (
              <nav style={{ display:'flex', gap:'2px', flex:1, justifyContent:'center', alignItems:'center' }}>
                {NAV_LINKS.map(function(link) {
                  var isActive = currentPage === link.id
                  return (
                    <button key={link.id} onClick={function() { go(link.id) }}
                      style={{ display:'flex', alignItems:'center', gap:'5px', padding:'7px 12px', borderRadius:'8px', border:'1px solid '+(isActive?'var(--border-accent)':'transparent'), background:isActive?'var(--indigo-dim)':'transparent', color:isActive?'var(--indigo-light)':'var(--text-4)', fontSize:'13px', fontWeight:isActive?'700':'500', cursor:'pointer', fontFamily:FH, whiteSpace:'nowrap', transition:'all 0.18s', letterSpacing:'-0.01em', minHeight:'36px' }}>
                      <link.icon size={12} />{link.label}
                    </button>
                  )
                })}
              </nav>
            ) : <div style={{ flex:1 }} />}

            <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0, marginLeft:'auto' }}>
              {!loading ? (
                user ? (
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    {user.photoURL
                      ? <img src={user.photoURL} alt="" style={{ width:'28px', height:'28px', borderRadius:'50%', border:'2px solid var(--border-accent)' }} />
                      : <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'linear-gradient(135deg,var(--indigo),#10B981)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><User size={13} color="white" /></div>
                    }
                    <button onClick={signOut}
                      style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'7px', color:'#EF4444', fontSize:'12px', padding:'5px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', fontFamily:FB, minHeight:'36px' }}>
                      <LogOut size={12} />
                      {!isMobile ? <span>Sign out</span> : null}
                    </button>
                  </div>
                ) : (
                  <button onClick={handleSignIn} disabled={signingIn}
                    style={{ display:'flex', alignItems:'center', gap:'5px', background:'var(--indigo)', border:'none', borderRadius:'8px', padding:'7px 12px', cursor:'pointer', color:'white', fontSize:'13px', fontFamily:FB, fontWeight:'600', opacity:signingIn?0.7:1, minHeight:'36px', whiteSpace:'nowrap' }}>
                    <LogIn size={13} />
                    {!isMobile ? <span>{signingIn?'...':'Sign in'}</span> : null}
                  </button>
                )
              ) : null}
              <ThemeToggle />
            </div>
          </div>
        </div>

        {currentPage === 'app' ? (
          <div>
            {/* Row 1: Core Flow — CENTERED */}
            <div style={{ borderTop:'1px solid var(--border)', background:'var(--bg)' }}>
              <div style={{ maxWidth:'1240px', margin:'0 auto', padding:'0 12px', display:'flex', alignItems:'center', justifyContent:'center', height:'46px', overflowX:'auto', scrollbarWidth:'none', WebkitOverflowScrolling:'touch', gap:'2px' }} className="tab-row-scroll">
                {STEP_TABS.map(function(tab, i) {
                  var active      = activeTab === tab.id
                  var isCompleted = STEP_TABS.findIndex(function(t) { return t.id === activeTab }) > i
                  return (
                    <div key={tab.id} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
                      {i > 0 ? <StepArrow active={isCompleted || active} /> : null}
                      <button onClick={function() { switchTab(tab.id) }}
                        style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 11px', borderRadius:'8px', border:'1px solid '+(active?'var(--border-accent)':'transparent'), background:active?'var(--indigo-dim)':'transparent', color:active?'var(--indigo-light)':isCompleted?'rgba(99,102,241,0.5)':'var(--text-3)', cursor:'pointer', fontFamily:FH, transition:'all 0.2s', whiteSpace:'nowrap', flexShrink:0, minHeight:'36px' }}>
                        <div style={{ width:'18px', height:'18px', borderRadius:'50%', background:active?'var(--indigo)':isCompleted?'rgba(99,102,241,0.3)':'var(--surface)', border:'1px solid '+(active?'var(--indigo)':isCompleted?'rgba(99,102,241,0.4)':'var(--border)'), display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'700', color:active?'white':isCompleted?'var(--indigo-light)':'var(--text-4)', flexShrink:0, fontFamily:FM }}>
                          {tab.num}
                        </div>
                        <tab.icon size={11} />
                        <span style={{ fontSize:'12px', fontWeight:active?'700':'500', letterSpacing:'-0.01em' }}>{tab.label}</span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Row 2: Tools — CENTERED */}
            <div style={{ borderTop:'1px solid rgba(99,102,241,0.08)', background:'rgba(99,102,241,0.02)' }}>
              <div style={{ maxWidth:'1240px', margin:'0 auto', padding:'0 12px', display:'flex', alignItems:'center', justifyContent:'center', height:'40px', overflowX:'auto', scrollbarWidth:'none', WebkitOverflowScrolling:'touch', gap:'2px' }} className="tab-row-scroll">
                {TOOL_TABS.map(function(tab) {
                  var active = activeTab === tab.id
                  return (
                    <button key={tab.id} onClick={function() { switchTab(tab.id) }}
                      style={{ display:'flex', alignItems:'center', gap:'5px', padding:'5px 11px', borderRadius:'6px', border:'none', borderBottom:'2px solid '+(active?'var(--indigo)':'transparent'), background:active?'rgba(99,102,241,0.07)':'transparent', color:active?'var(--indigo-light)':'var(--text-4)', fontSize:'12px', fontWeight:active?'700':'400', cursor:'pointer', fontFamily:FH, transition:'all 0.2s', whiteSpace:'nowrap', flexShrink:0, letterSpacing:'-0.01em', height:'100%', minHeight:'36px' }}>
                      <tab.icon size={11} />{tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        ) : null}
      </motion.header>
    </>
  )
}

// ─────────────────────────────────────────────────────────
// APP PAGE — Phase C: data freshness badge in tools header
// ─────────────────────────────────────────────────────────
const AppPage = function({ activeTab, onTabChange, mode, modeLocked, onModeSelect, onModeReset, onCertSelected, prefilledCert, resumeCity, resumeDomain, resumeName }) {
  return (
    <div style={{ paddingTop:(NAV_H+TABS_H)+'px', minHeight:'100vh', background:'var(--app-bg)', position:'relative' }}>
      <WaveBg variant="app" />

      <AnimatePresence>
        {!modeLocked ? <ModeSelector onSelect={onModeSelect} /> : null}
      </AnimatePresence>

      {modeLocked ? (
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'20px 16px 0' }}>
            <ModePill mode={mode} onReset={onModeReset} />
            {/* Phase C: data freshness badge in tools */}
            <DataFreshnessBadge />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }} transition={T}>
              <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 16px 60px' }}>

                {activeTab==='resume' ? (
                  <div className="glass" style={{ padding:'clamp(16px,3vw,28px)' }}>
                    <ResumeAnalyzer mode={mode} onCertSelected={function(certName,city,domain,name) { onCertSelected(certName,city,domain,name) }} />
                  </div>
                ) : null}

                {activeTab==='calculator' ? (
                  <div>
                    <Hero mode={mode} prefilledCert={prefilledCert} resumeName={resumeName} resumeCity={resumeCity} resumeDomain={resumeDomain} />
                    {/* Step 2 → Step 3 */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <motion.button
                        onClick={function() { onTabChange('heatmap') }}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.97 }}
                        style={{ display:'flex', alignItems:'center', gap:'9px', padding:'13px 24px', borderRadius:'12px', background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(99,102,241,0.08))', border:'1px solid rgba(99,102,241,0.3)', color:'var(--indigo-light)', fontSize:'14px', fontFamily:FH, fontWeight:'700', cursor:'pointer', letterSpacing:'-0.01em' }}
                      >
                        <Map size={15} />
                        Next: See City Demand
                        <ArrowRight size={15} />
                      </motion.button>
                    </motion.div>
                  </div>
                ) : null}

                {activeTab==='heatmap' ? (
                  <div>
                    <div className="glass" style={{ padding:'clamp(16px,3vw,28px)' }}>
                      <Heatmap prefilledCity={resumeCity} prefilledDomain={resumeDomain} certName={prefilledCert} resumeName={resumeName} />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      style={{ marginTop: '20px' }}
                    >
                      <motion.button
                        onClick={function() { onTabChange('calculator') }}
                        whileHover={{ x: -4 }}
                        whileTap={{ scale: 0.97 }}
                        style={{ display:'flex', alignItems:'center', gap:'7px', padding:'11px 18px', borderRadius:'10px', background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text-4)', fontSize:'13px', fontFamily:FH, fontWeight:'600', cursor:'pointer' }}
                      >
                        ← Back to ROI Calculator
                      </motion.button>
                    </motion.div>
                  </div>
                ) : null}

                {activeTab==='compare' ? (
                  <div className="glass" style={{ padding:'clamp(16px,3vw,28px)' }}>
                    <CertCompare salary={mode==='student'?4.8:8} prefilledCert={prefilledCert} />
                  </div>
                ) : null}

                {activeTab==='simulate' ? (
                  <div className="glass" style={{ padding:'clamp(16px,3vw,28px)' }}>
                    <CareerSimulator initialSalary={mode==='student'?4.8:8} />
                  </div>
                ) : null}

                {activeTab==='jobmap' ? (
                  <div className="glass" style={{ padding:'clamp(16px,3vw,28px)' }}>
                    <JobCertMap />
                  </div>
                ) : null}

                {activeTab==='college' ? (
                  <div className="glass" style={{ padding:'clamp(16px,3vw,28px)' }}>
                    <CollegeVsCorporate />
                  </div>
                ) : null}

                {activeTab==='hikeverifier' ? (
                  <div className="glass" style={{ padding:'clamp(16px,3vw,28px)' }}>
                    <HikeVerifier prefilledCert={prefilledCert} />
                  </div>
                ) : null}

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// FOOTER — Phase B: no "Powered by AI", specific credits
// ─────────────────────────────────────────────────────────
const Footer = function({ onNavigate }) {
  return (
    <footer style={{ borderTop:'1px solid var(--border)', padding:'40px 16px 24px', marginTop:'auto', background:'var(--bg)' }}>
      <div style={{ maxWidth:'1240px', margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'28px', marginBottom:'32px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
              <div style={{ width:'26px', height:'26px', background:'linear-gradient(135deg,var(--indigo),#4338CA)', borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <TrendingUp size={13} color="white" />
              </div>
              <span style={{ fontFamily:FH, fontWeight:'800', fontSize:'15px', color:'var(--text)', letterSpacing:'-0.01em' }}>
                Certify<span style={{ color:'var(--indigo)' }}>ROI</span>
              </span>
            </div>
            <p style={{ fontSize:'13px', color:'var(--text-4)', fontFamily:FB, lineHeight:'1.7', maxWidth:'240px', marginBottom:'10px' }}>
              India's first AI-powered cert ROI calculator. Built in Bangalore.
            </p>
            {/* Phase B: specific credits, not generic "AI" */}
            <p style={{ fontSize:'11px', color:'var(--text-4)', fontFamily:FM, opacity:0.55, lineHeight:'1.6' }}>
              Inference: Groq LPU<br />
              Data: LinkedIn · NASSCOM · Naukri · AmbitionBox · WEF 2026
            </p>
          </div>

          <div>
            <div style={{ fontSize:'10px', color:'var(--text-4)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'14px', fontFamily:FM }}>Tools</div>
            {['Resume AI','ROI Calculator','City Demand','Compare Certs','Career Simulator','Cert to Job Map','Verify Hike'].map(function(l) {
              return (
                <button key={l} onClick={function() { onNavigate('app') }}
                  style={{ display:'block', background:'none', border:'none', color:'var(--text-4)', fontSize:'13px', cursor:'pointer', marginBottom:'8px', fontFamily:FB, padding:0, textAlign:'left', transition:'color 0.15s', minHeight:'28px' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color='var(--text)' }}
                  onMouseLeave={function(e) { e.currentTarget.style.color='var(--text-4)' }}>
                  {l}
                </button>
              )
            })}
          </div>

          <div>
            <div style={{ fontSize:'10px', color:'var(--text-4)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'14px', fontFamily:FM }}>Company</div>
            {['about','blog','faq','contact'].map(function(id) {
              return (
                <button key={id} onClick={function() { onNavigate(id) }}
                  style={{ display:'block', background:'none', border:'none', color:'var(--text-4)', fontSize:'13px', cursor:'pointer', marginBottom:'8px', fontFamily:FB, padding:0, textAlign:'left', transition:'color 0.15s', minHeight:'28px' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color='var(--text)' }}
                  onMouseLeave={function(e) { e.currentTarget.style.color='var(--text-4)' }}>
                  {id.charAt(0).toUpperCase()+id.slice(1)}
                </button>
              )
            })}
          </div>

          <div>
            <div style={{ fontSize:'10px', color:'var(--text-4)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'14px', fontFamily:FM }}>Legal</div>
            {['terms','privacy'].map(function(id) {
              return (
                <button key={id} onClick={function() { onNavigate(id) }}
                  style={{ display:'block', background:'none', border:'none', color:'var(--text-4)', fontSize:'13px', cursor:'pointer', marginBottom:'8px', fontFamily:FB, padding:0, textAlign:'left', transition:'color 0.15s', minHeight:'28px' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color='var(--text)' }}
                  onMouseLeave={function(e) { e.currentTarget.style.color='var(--text-4)' }}>
                  {id==='terms'?'Terms & Conditions':'Privacy Policy'}
                </button>
              )
            })}
            <div style={{ marginTop:'14px', padding:'10px 12px', borderRadius:'8px', background:'var(--indigo-dim)', border:'1px solid var(--border-accent)' }}>
              <div style={{ fontSize:'10px', color:'var(--indigo-light)', fontFamily:FM, marginBottom:'4px' }}>CONTACT</div>
              <a href="mailto:hello@certifyroi.in" style={{ fontSize:'12px', color:'var(--text-3)', fontFamily:FB, textDecoration:'none' }}>hello@certifyroi.in</a>
            </div>
          </div>
        </div>

        <div style={{ borderTop:'1px solid var(--border)', paddingTop:'16px', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'8px', alignItems:'center' }}>
          {/* Phase C: honest disclaimer */}
          <p style={{ fontSize:'12px', color:'var(--text-4)', fontFamily:FB }}>
            © 2026 CertifyROI. Salary figures are medians, not guarantees. Not financial advice.
          </p>
          <p style={{ fontSize:'11px', color:'var(--text-4)', fontFamily:FM, opacity:0.4 }}>Built in Bangalore for India's professionals</p>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────
function AppRoot() {
  var [page,          setPage]          = useState('home')
  var [activeTab,     setActiveTab]     = useState('resume')
  var [mode,          setMode]          = useState('professional')
  var [modeLocked,    setModeLocked]    = useState(false)
  var [prefilledCert, setPrefilledCert] = useState('')
  var [resumeCity,    setResumeCity]    = useState('')
  var [resumeDomain,  setResumeDomain]  = useState('')
  var [resumeName,    setResumeName]    = useState('')

  var navigate = function(pageId) {
    setPage(pageId)
    window.scrollTo({ top:0, behavior:'smooth' })
  }

  var goToApp = function(tab) {
    setActiveTab(tab || 'resume')
    navigate('app')
  }

  var handleModeSelect = function(id) { setMode(id); setModeLocked(true) }
  var handleModeReset  = function()   { setModeLocked(false) }

  var handleCertSelected = function(certName, city, domain, name) {
    setPrefilledCert(certName)
    if (city)   setResumeCity(city)
    if (domain) setResumeDomain(domain)
    if (name)   setResumeName(name)
    setActiveTab('calculator')
  }

  var renderPage = function() {
    if (page==='home')    return <LandingPage onEnter={function() { goToApp('resume') }} />
    if (page==='app')     return (
      <AppPage
        activeTab={activeTab} onTabChange={setActiveTab}
        mode={mode} modeLocked={modeLocked}
        onModeSelect={handleModeSelect} onModeReset={handleModeReset}
        onCertSelected={handleCertSelected}
        prefilledCert={prefilledCert} resumeCity={resumeCity}
        resumeDomain={resumeDomain} resumeName={resumeName}
      />
    )
    if (page==='blog')    return <BlogPage />
    if (page==='faq')     return <FAQPage />
    if (page==='about')   return <AboutPage />
    if (page==='contact') return <ContactPage />
    if (page==='terms')   return <TermsPage />
    if (page==='privacy') return <PrivacyPage />
    return <LandingPage onEnter={function() { goToApp('resume') }} />
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <NavBar currentPage={page} activeTab={activeTab} onNavigate={navigate} onTabChange={setActiveTab} />
      <main style={{ flex:1 }}>
        <AnimatePresence mode="wait">
          <motion.div key={page+activeTab} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={T}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={navigate} />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppRoot />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}