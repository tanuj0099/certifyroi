import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, FileText, Map, LogIn, LogOut, User,
  Menu, X, Home, Info, Phone, BookOpen,
  Shield, ChevronRight, Sparkles, FileCheck,
  GraduationCap, Award, Route, Building2, ArrowRight
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

const T = { duration: 0.32, ease: [0.4, 0, 0.2, 1] }

const hs = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontWeight: '800', letterSpacing: '-0.02em',
  color: 'var(--text)', lineHeight: 1.05, marginBottom: '24px',
}

const FM = "'JetBrains Mono','Commit Mono',monospace"
const FH = "'Plus Jakarta Sans','Bricolage Grotesque',sans-serif"
const FB = "'Inter',sans-serif"

const PageWrapper = function({ children, maxWidth, padding }) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <WaveBg variant="app" />
      <div style={{ maxWidth: maxWidth || '800px', margin: '0 auto', padding: padding || '88px 24px 60px', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// ABOUT PAGE — founder brand story, personal voice
// ─────────────────────────────────────────────────────────
const AboutPage = function() {
  return (
    <PageWrapper maxWidth="820px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>

        {/* Hero headline */}
        <h1 style={{ ...hs, fontSize: 'clamp(2.2rem,5.5vw,3.8rem)', marginBottom: '12px' }}>
          THE STORY BEHIND<br />
          <span style={{ background: 'linear-gradient(135deg,#6366F1,#10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            CERTIFYROI
          </span>
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-4)', fontFamily: FM, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '40px' }}>
          Bangalore · 2025 · Built out of frustration
        </p>

        {/* Founder story — personal, direct */}
        <div className="glass" style={{ padding: '32px 36px', marginBottom: '20px', borderLeft: '3px solid #6366F1' }}>
          <div style={{ fontSize: '11px', color: '#818CF8', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            How it started
          </div>
          <p style={{ fontSize: '16px', color: 'var(--text)', lineHeight: '1.85', marginBottom: '18px', fontFamily: FB, fontWeight: '500' }}>
            I was 24, two years into a mid-level tech job in Bangalore, and everyone around me was doing a certification. AWS. PMP. CFA. The pressure was real. My manager had just gotten a 40% hike after his AWS cert. My college friend switched from ops to data with a Google certificate.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.85', marginBottom: '18px', fontFamily: FB }}>
            So I did what everyone does — I Googled "is AWS worth it." And got 47 blog posts, all saying the same useless thing: "it depends on your goals." Not one of them told me whether ₹25,000 + 3 months of my life would actually pay off at my salary level, in my city, in my domain.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.85', fontFamily: FB }}>
            I made a spreadsheet. Pulled salary data from LinkedIn, Naukri, AmbitionBox. Mapped break-even timelines. Ran the numbers for 6 different certs. Three months later, I had my answer — and I'd wasted more time building the spreadsheet than studying for the cert itself. That spreadsheet became CertifyROI.
          </p>
        </div>

        {/* The problem we solve */}
        <div className="glass" style={{ padding: '28px 32px', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: '#10B981', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            The problem
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.85', marginBottom: '16px', fontFamily: FB }}>
            India has the world's largest pool of people deciding between certifications right now. Students trying to get their first offer. Mid-career professionals trying to switch domains. Senior people trying to justify a cert to their manager.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.85', fontFamily: FB }}>
            Every career site lists certifications. Nobody tells you whether it's worth your specific money, in your specific city, at your specific salary. That gap is what CertifyROI was built to close. Not generic advice. Actual numbers.
          </p>
        </div>

        {/* Who we built it for */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            {
              emoji: '😰',
              title: 'The anxious 26-year-old',
              desc: 'Scrolling LinkedIn at 11pm, watching peers get promoted, wondering if a cert is the answer. We built this for you first.',
              color: '#818CF8',
            },
            {
              emoji: '🔄',
              title: 'The ops manager switching to data',
              desc: 'Domain switch is scary. The ROI numbers on a Google Data Analytics cert for someone at ₹9L/yr in Pune are very different from generic advice.',
              color: '#51B1E7',
            },
            {
              emoji: '🎓',
              title: 'The fresh graduate',
              desc: 'No salary history. No benchmark. Just a 0–18 month window to get a strong first offer. Student Mode was built specifically for this.',
              color: '#10B981',
            },
            {
              emoji: '📊',
              title: 'The professional pitching their boss',
              desc: '"My manager won\'t fund my cert unless I show ROI." Pitch Your Boss exists because this conversation is real and we wanted to help you win it.',
              color: '#F59E0B',
            },
          ].map(function(c, i) {
            return (
              <div key={i} className="glass" style={{ padding: '22px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{c.emoji}</div>
                <h3 style={{ fontSize: '14px', color: c.color, marginBottom: '8px', fontFamily: FH, fontWeight: '700', lineHeight: '1.3' }}>{c.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.65', fontFamily: FB }}>{c.desc}</p>
              </div>
            )
          })}
        </div>

        {/* What's under the hood */}
        <div className="glass" style={{ padding: '28px 32px', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: '#F59E0B', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            What powers it
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
            {[
              { label: 'AI Engine',    value: 'Groq · llama-3.3-70b', desc: 'Under 2 seconds. Fastest inference for resume analysis and ROI advice.' },
              { label: 'Salary Data', value: 'NASSCOM + LinkedIn + Naukri', desc: '2026 India benchmarks. City-specific. Updated quarterly.' },
              { label: 'Cert Database', value: '103 certifications', desc: '17 domains. Tech, finance, medical, law, government, architecture.' },
              { label: 'City Coverage', value: '8 major metros', desc: 'Bangalore, Hyderabad, Pune, Mumbai, Delhi, Chennai, Kolkata, Ahmedabad.' },
            ].map(function(item, i) {
              return (
                <div key={i} style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: FM, fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>{item.label}</div>
                  <div style={{ fontFamily: FH, fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '5px' }}>{item.value}</div>
                  <div style={{ fontFamily: FB, fontSize: '12px', color: 'var(--text-4)', lineHeight: '1.5' }}>{item.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* What we are not */}
        <div className="glass" style={{ padding: '24px 28px', marginBottom: '20px', background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.15)' }}>
          <div style={{ fontSize: '11px', color: '#EF4444', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
            What we are not
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.75', fontFamily: FB }}>
            CertifyROI is not a certification prep platform. We don't sell courses. We don't get commissions from certification bodies. Our only incentive is to give you honest numbers — even if that means telling you a cert is not worth it at your current salary level. The data sometimes says no. We'll show you that.
          </p>
        </div>

        {/* Contact CTA */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="mailto:hello@certifyroi.in"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '12px 20px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#818CF8', fontSize: '13px', fontFamily: FH, fontWeight: '700', textDecoration: 'none', letterSpacing: '-0.01em' }}>
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
// TERMS + PRIVACY (unchanged logic, same style)
// ─────────────────────────────────────────────────────────
const TermsPage = function() {
  return (
    <PageWrapper maxWidth="780px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>
        <h1 style={{ ...hs, fontSize: 'clamp(2rem,5vw,3.5rem)' }}>TERMS AND<br /><span style={{ color: 'var(--indigo)' }}>CONDITIONS</span></h1>
        {[
          { title: '1. Acceptance', body: 'By using CertifyROI, you agree to these terms. We may update them at any time.' },
          { title: '2. Educational Purpose', body: 'All ROI projections are approximations for educational purposes only, not financial advice. Always verify with a qualified career advisor.' },
          { title: '3. AI Disclaimer', body: 'AI-powered analysis is generated by large language models. Results may be inaccurate. Verify all data before making career decisions.' },
          { title: '4. Data and Privacy', body: 'Resume text is processed in real-time and not stored. We do not sell personal data. See our Privacy Policy for full details.' },
          { title: '5. Salary Data', body: 'Salary figures are sourced from public reports including NASSCOM, LinkedIn India, and Naukri. These are median estimates and may not reflect individual experiences.' },
          { title: '6. Limitation of Liability', body: 'CertifyROI is not liable for career decisions made based on information on this platform.' },
          { title: '7. Contact', body: 'Questions? Email us at hello@certifyroi.in' },
        ].map(function(s, i) {
          return (
            <div key={i} className="glass" style={{ padding: '20px', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '14px', color: 'var(--text)', fontFamily: FH, fontWeight: '700', marginBottom: '6px' }}>{s.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', fontFamily: FB }}>{s.body}</p>
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
        <h1 style={{ ...hs, fontSize: 'clamp(2rem,5vw,3.5rem)' }}>PRIVACY<br /><span style={{ color: 'var(--indigo)' }}>POLICY</span></h1>
        {[
          { title: 'What we collect', body: 'Email address (if you sign in with Google) and anonymised usage data. Resume text is NOT stored — processed in real-time and immediately discarded after analysis.' },
          { title: 'How we use your data', body: 'Email is used for authentication only. We do not send marketing emails unless you explicitly opt in. Usage data helps us improve the product.' },
          { title: 'Cookies and storage', body: 'Essential cookies for authentication. We use localStorage to save your calculator preferences locally on your device. No third-party advertising cookies.' },
          { title: 'Third-party services', body: 'Groq (AI inference — text not stored), Firebase (authentication + profile storage), Vercel (hosting and edge functions).' },
          { title: 'Your rights', body: 'You can request deletion of your data at any time by emailing hello@certifyroi.in. Requests are processed within 7 business days.' },
          { title: 'Contact', body: 'Privacy questions? Email hello@certifyroi.in' },
        ].map(function(s, i) {
          return (
            <div key={i} className="glass" style={{ padding: '20px', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '14px', color: 'var(--text)', fontFamily: FH, fontWeight: '700', marginBottom: '6px' }}>{s.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', fontFamily: FB }}>{s.body}</p>
            </div>
          )
        })}
      </motion.div>
    </PageWrapper>
  )
}

// ─────────────────────────────────────────────────────────
// BLOG — 28 posts across all 9 domains
// Format: title + 3-4 paragraph excerpt + read more
// ─────────────────────────────────────────────────────────
const BLOG_POSTS = [
  // ── Cloud & Tech (4) ─────────────────────────────────
  {
    id: 1, tag: 'Cloud & Tech', tagColor: '#6366F1', domain: 'tech',
    title: 'Is AWS Solutions Architect Worth It in 2026?',
    date: 'Mar 2026', readTime: '5 min', forWho: 'Professional',
    excerpt: `With 2,400+ open roles on Naukri and average salary hikes of 30–40%, AWS SAA remains the single highest-ROI certification for Indian engineers in 2026. But the market is maturing fast — passing the exam is no longer enough.\n\nWe ran break-even analysis for three salary brackets: ₹6L, ₹10L, and ₹18L per year. At ₹10L with a 35% hike, your ₹25,000 cert investment pays back in under 3 months. That's a 400%+ ROI over five years.\n\nThe real value isn't the badge — it's the projects. Engineers who pair AWS SAA with two hands-on portfolio projects (a 3-tier architecture on EC2, a serverless pipeline on Lambda) are getting 40–50% hikes, not 30%.\n\nBottom line: if you're between ₹6L and ₹20L and work in backend, DevOps, or infrastructure, AWS SAA is still the highest-confidence cert investment in India. Just don't stop at the certificate.`,
  },
  {
    id: 2, tag: 'Cloud & Tech', tagColor: '#6366F1', domain: 'tech',
    title: 'Azure vs AWS vs GCP: Which Cloud Cert Pays More in India?',
    date: 'Feb 2026', readTime: '6 min', forWho: 'Professional',
    excerpt: `Three cloud platforms. Three certification paths. Very different salary outcomes depending on which Indian city you're in and which companies are hiring there.\n\nAWS dominates Bangalore and Hyderabad — 62% of cloud job postings on Naukri specify AWS. Azure is strongest in Pune and Delhi NCR, where Microsoft's enterprise customer base drives BFSI and government digital projects. GCP demand is concentrated in product-first startups and Google's own ecosystem.\n\nFor total compensation, AWS leads at a median ₹18.5L for SAA holders in Bangalore. Azure Solutions Architect Expert (AZ-305) trails slightly at ₹17.2L but has faster demand growth YoY. GCP Professional Architect holders are the rarest and command ₹19L+ but the job pool is smaller.\n\nOur recommendation: choose your cloud based on your employer's stack, not the median salary. The best-paying cloud cert is the one aligned with where you actually want to work.`,
  },
  {
    id: 3, tag: 'Cloud & Tech', tagColor: '#6366F1', domain: 'tech',
    title: 'CKA vs CKAD: Which Kubernetes Cert Should You Get First?',
    date: 'Jan 2026', readTime: '5 min', forWho: 'Professional',
    excerpt: `Both are hands-on performance-based exams. Both are recognised across every major cloud and DevOps employer in India. But they target completely different roles — and choosing the wrong one wastes 3–4 months.\n\nCKA (Certified Kubernetes Administrator) is for people who manage cluster infrastructure — setting up nodes, configuring networking, handling storage classes and RBAC. If you're in a DevOps, SRE, or platform engineering role, this is yours.\n\nCKAD (Certified Kubernetes Application Developer) is for developers who deploy and manage applications on Kubernetes — pods, deployments, services, config maps. If you're a backend dev who ships microservices, CKAD is the faster, more directly relevant path.\n\nROI comparison: CKA holders in Bangalore command a median ₹22L. CKAD holders are at ₹19L. Both have strong demand — but CKA opens the higher-paying infra and platform engineering track that India's cloud-native companies are aggressively hiring for in 2026.`,
  },
  {
    id: 4, tag: 'Cloud & Tech', tagColor: '#6366F1', domain: 'tech',
    title: 'Terraform Associate in 2026: ROI for Indian DevOps Engineers',
    date: 'Dec 2025', readTime: '4 min', forWho: 'Professional',
    excerpt: `Infrastructure as Code is no longer optional for DevOps roles. It's table stakes. The question is whether formalising it with a HashiCorp Terraform Associate certification actually moves your salary — and the answer is a nuanced yes.\n\nTerraform Associate alone won't get you a hike. What it does is unlock a tier of roles that weren't available before: platform engineering, cloud automation, and infrastructure lead positions that require demonstrated IaC proficiency. These roles pay ₹4–8L more than generic DevOps roles at the same experience level.\n\nThe study time is low (6–8 weeks) and the exam cost is reasonable at ₹18,000. Break-even is fast for anyone already in a DevOps role targeting a move to a cloud-native company or product startup.\n\nPair it with CKA or AWS DevOps Pro for maximum impact. Alone, it's a competence signal. Combined, it's a career level-up.`,
  },

  // ── Data & AI (4) ────────────────────────────────────
  {
    id: 5, tag: 'Data & AI', tagColor: '#8B5CF6', domain: 'data',
    title: 'From Ops Manager to Data Analyst: A Real 6-Month Plan',
    date: 'Mar 2026', readTime: '7 min', forWho: 'Switcher',
    excerpt: `Three real professionals made this switch in 2025. An operations manager at a logistics company in Pune. A retail store manager in Chennai. A supply chain executive in Delhi. All of them went from ₹8–12L ops roles to ₹14–18L data roles in under a year.\n\nWhat they had in common: they didn't just do the certification. They did a certification, built a portfolio project on real data from their old domain (logistics = demand forecasting, retail = sales trend analysis), and targeted companies where their ops context gave them an edge over pure analysts.\n\nThe cert they all used: IBM Data Science Professional Certificate on Coursera (₹15,000, 5 months). Not because it's the best certificate — it's not. Because it's comprehensive enough to cover SQL, Python, and ML basics, and the portfolio projects are built into the curriculum.\n\nMonth-by-month breakdown, salary negotiation strategies, and the exact LinkedIn messaging that got them interviews — all inside. This is the most practical ops-to-data guide we've written.`,
  },
  {
    id: 6, tag: 'Data & AI', tagColor: '#8B5CF6', domain: 'data',
    title: 'Power BI vs Tableau: Which Data Viz Cert Gets You Hired Faster?',
    date: 'Feb 2026', readTime: '5 min', forWho: 'Professional',
    excerpt: `Tableau was the industry standard for four years. Power BI has been closing the gap aggressively, especially in India's enterprise and BFSI sector where Microsoft stack dominates.\n\nBy job postings: Power BI now appears in 68% of Indian data analyst job descriptions vs 42% for Tableau. By salary: Tableau Desktop Specialist holders command slightly higher salaries (₹12.5L median vs ₹11.8L for PL-300) but Power BI roles are more abundant and easier to land.\n\nFor career switchers or fresher analysts: Power BI PL-300 is the faster path to employment. The exam is structured and the Microsoft learning path is free. Tableau is the better long-term investment if you're targeting product companies, consulting, or global roles.\n\nOur honest take: don't choose. Learn Power BI first (3 months), get a job, then add Tableau on the job. Companies with enterprise clients almost always have both.`,
  },
  {
    id: 7, tag: 'Data & AI', tagColor: '#8B5CF6', domain: 'data',
    title: 'Is the TensorFlow Developer Certificate Worth It in India?',
    date: 'Jan 2026', readTime: '5 min', forWho: 'Professional',
    excerpt: `The TensorFlow Developer Certificate is one of the few ML certifications that is genuinely hands-on — it's a 5-hour practical coding exam, not a multiple choice test. That makes it credible. But is it worth ₹20,000 and 4–5 months of study for an Indian engineer?\n\nWho it's for: Python developers with 1–3 years of experience who want to transition into ML engineering roles. It signals that you can actually build models, not just explain them in a slide deck.\n\nWho it's not for: pure data analysts who work with BI tools and SQL. The salary impact for analyst roles is marginal. The real ROI is if you're targeting ML engineer, AI engineer, or data scientist positions at product companies.\n\nMedian salary for TF certified professionals in Bangalore: ₹22L. That's a 45% premium over equivalent non-certified engineers. The catch: you need portfolio projects to back it up. The cert without GitHub repositories does almost nothing in India's ML hiring market right now.`,
  },
  {
    id: 8, tag: 'Data & AI', tagColor: '#8B5CF6', domain: 'data',
    title: 'Databricks vs Snowflake: Which Data Engineering Cert to Prioritise?',
    date: 'Dec 2025', readTime: '5 min', forWho: 'Professional',
    excerpt: `The modern data stack has two dominant platforms competing for mindshare: Databricks (lakehouse, Spark, MLflow) and Snowflake (cloud data warehouse, SQL-first). Both have certifications. The question is which one opens more doors in India in 2026.\n\nDatabricks Associate Developer is the harder cert (Spark knowledge required) but opens senior data engineering roles at product companies. Median salary: ₹24L in Bangalore. Snowflake SnowPro Core is more accessible and is the dominant platform at Indian consulting and BFSI firms. Median salary: ₹20L.\n\nFor someone already working in data engineering: if your current company uses Spark, go Databricks. If you're in consulting or BFSI, Snowflake is the faster career move.\n\nFor career switchers entering data engineering: Snowflake first (easier learning curve, more job openings), then Databricks as a level-up after 12–18 months of experience. Stack them and you're in the top 5% of data engineering candidates in India.`,
  },

  // ── Cybersecurity (3) ────────────────────────────────
  {
    id: 9, tag: 'Cybersecurity', tagColor: '#EF4444', domain: 'cybersecurity',
    title: 'CEH vs CompTIA Security+: Which Cybersecurity Cert Pays More in India?',
    date: 'Mar 2026', readTime: '5 min', forWho: 'Professional',
    excerpt: `India's cybersecurity hiring market is booming — CERT-In mandates, digital banking expansion, and the DPDP Act 2023 have created a sustained surge in security hiring. The question for professionals is which entry certification gets you through the door fastest.\n\nCompTIA Security+ (₹35,000, 3 months) is the global baseline. Almost every MNC in India accepts it as a minimum security credential. It covers the fundamentals — threats, cryptography, network security, risk management. Median salary for Security+ holders in India: ₹11L.\n\nCEH (Certified Ethical Hacker, ₹50,000, 4 months) is more respected in Indian government, defence, and banking contexts. It has a practical track record and EC-Council's name recognition matters with conservative hiring managers. Median salary: ₹14L.\n\nROI comparison: CEH costs more but pays back faster due to the salary gap. If you're targeting BFSI, government, or large enterprise clients, CEH wins. If you're going for MNCs, consulting, or global roles, Security+ is the faster starting point.`,
  },
  {
    id: 10, tag: 'Cybersecurity', tagColor: '#EF4444', domain: 'cybersecurity',
    title: 'OSCP in India: Is It Worth ₹95,000 and 6 Months?',
    date: 'Feb 2026', readTime: '6 min', forWho: 'Professional',
    excerpt: `OSCP (Offensive Security Certified Professional) is the most respected hands-on penetration testing certification in the world. It's also the most expensive and the hardest. In India, it's a career transformer — but only for the right profile.\n\nThe exam is brutal: 24 hours of hacking a live network, then 24 hours to write a professional report. No multiple choice. No shortcuts. You either compromise the machines or you fail. Pass rate on first attempt is around 55% globally.\n\nFor penetration testers and red team professionals in India: OSCP is worth every rupee. It's the cert that separates senior pentesters (₹22–30L) from junior ones (₹8–12L). Employers at Indian cybersecurity firms, Big 4 advisory, and MNC red teams treat it as a hard requirement for senior roles.\n\nFor everyone else: it's probably not the right next step. Start with CEH or CISM, build 2+ years of hands-on security work, then attack OSCP. Skipping that foundation is one of the most common expensive mistakes we see in India's cybersecurity career community.`,
  },
  {
    id: 11, tag: 'Cybersecurity', tagColor: '#EF4444', domain: 'cybersecurity',
    title: 'CISM vs CISSP: Which Security Management Cert for Senior Roles?',
    date: 'Jan 2026', readTime: '5 min', forWho: 'Professional',
    excerpt: `Both CISM and CISSP target senior security professionals. Both require years of experience. Both open doors to CISO, Head of Security, and Director-level roles in India. But they have different focuses and different reputations with Indian employers.\n\nCISM (ISACA) is the more popular choice among Indian security managers. It's management-focused: governance, risk, incident response, programme development. Easier to apply directly to day-to-day security management work. Median salary for CISM holders in India: ₹28L.\n\nCISSP (ISC²) is the gold standard globally. Broader technical depth required. More respected at global MNCs and for international mobility. Harder to pass (require 5 years of verified experience across 8 security domains). Median salary: ₹32L.\n\nOur recommendation: CISM first if you're in a predominantly Indian career context (BFSI, IT services, government consulting). CISSP if you're targeting global roles or MNC internal security teams. The 5-year experience requirement for CISSP means most Indian security managers are better served by CISM in the short term anyway.`,
  },

  // ── Finance (3) ──────────────────────────────────────
  {
    id: 12, tag: 'Finance', tagColor: '#10B981', domain: 'finance',
    title: 'CFA vs FMVA vs CMA: Which Finance Cert for Indian Professionals?',
    date: 'Mar 2026', readTime: '6 min', forWho: 'Professional',
    excerpt: `Three certifications dominate India's finance career landscape. CFA (Charter Financial Analyst) is the prestige path — 3 levels, 4–5 years, globally respected. FMVA (Financial Modelling & Valuation Analyst) is the practical shortcut — 3 months, Excel-heavy, immediately applicable. CMA (Certified Management Accountant) is the strategic finance track — CFO-level thinking, cost analysis, budgeting.\n\nFor investment banking and asset management in India: CFA is non-negotiable. The pass rates are brutal (40–45% per level) but the salary premium is real — CFA Level 1 alone adds ₹3–5L to your package at most BFSI firms.\n\nFor FP&A, corporate finance, and startup finance: FMVA is the fastest ROI. ₹20,000 and 3 months, and you can immediately do better financial models than 80% of your peers. Companies love it because it's directly applicable, not theoretical.\n\nFor finance managers targeting CFO or VP Finance: CMA US is the path. It signals strategic business acumen, not just technical finance skills. Median salary for CMA holders in India: ₹28L.`,
  },
  {
    id: 13, tag: 'Finance', tagColor: '#10B981', domain: 'finance',
    title: 'CA vs CPA: Should Indian Chartered Accountants Pursue US CPA?',
    date: 'Feb 2026', readTime: '6 min', forWho: 'Professional',
    excerpt: `Indian Chartered Accountants are among the best-qualified finance professionals in the world. So why would a CA need US CPA? The answer comes down to one thing: where you want to work and what you want to earn.\n\nCA in India: ₹8–15L starting at Big 4. After 5 years, ₹20–30L at senior manager level. The ceiling rises fast with industry experience — CFO tracks at mid-size Indian companies often pay ₹40–60L for experienced CAs.\n\nUS CPA for Indian CAs: the exam has six papers, ₹1.5L investment, and roughly 12 months of study. The payoff? US CPA opens Big 4 global roles, US staffing at Indian MNCs, and GCC (Global Capability Centre) finance roles that pay ₹25–40L even at manager level — significantly higher than equivalent domestic roles.\n\nWho should pursue it: CAs with 2–5 years of experience who want to work at MNCs or GCCs in India, or who are seriously considering moving to the US or UK. If you're committed to a domestic Indian career, the ROI is lower — the premium exists primarily in global and MNC contexts.`,
  },
  {
    id: 14, tag: 'Finance', tagColor: '#10B981', domain: 'finance',
    title: 'NISM Certifications in 2026: The Fastest Way Into Indian Capital Markets',
    date: 'Jan 2026', readTime: '4 min', forWho: 'Student',
    excerpt: `NISM (National Institute of Securities Markets) certifications are mandatory for anyone working in SEBI-registered entities — brokers, fund houses, portfolio managers, research analysts. They're also the cheapest, fastest way to enter India's capital markets industry.\n\nNISM Series VIII (Equity Derivatives) is the most widely required — any SEBI-registered broker requires it for dealing members. Cost: ₹5,000. Time: 4–6 weeks. It's not optional if you want a front-office role at a stockbroker or wealth management firm.\n\nFor freshers targeting finance careers in India's growing capital markets: NISM Series VIII + NISM Series X-A (Investment Adviser Level 1) + a basic understanding of equity research is the fastest path to ₹6–8L roles at broking houses, AMCs, and wealth management firms.\n\nThe ROI math is compelling: under ₹15,000 total investment for two exams that directly qualify you for roles that pay 3–4x the investment in the first year alone. One of the highest short-term ROI cert paths in our entire database.`,
  },

  // ── Management (3) ───────────────────────────────────
  {
    id: 15, tag: 'Management', tagColor: '#F59E0B', domain: 'management',
    title: 'PMP vs CSM: Which Project Management Cert Pays More in India?',
    date: 'Mar 2026', readTime: '5 min', forWho: 'Professional',
    excerpt: `PMP and CSM are often compared but they serve fundamentally different career paths. PMP (Project Management Professional) is the senior PM credential for managing traditional and hybrid projects. CSM (Certified Scrum Master) is for agile delivery practitioners and Scrum teams.\n\nSalary data in India: PMP holders median ₹22L vs CSM holders median ₹18L. But this comparison is misleading — PMP requires 3+ years of PM experience while CSM is accessible to team leads and even junior PMs. The CSM is faster to get (1–2 day course + exam) and the ROI timeline is shorter even if the ceiling is lower.\n\nFor experienced PMs (3+ years): PMP is the clear choice. It's the internationally recognised credential that unlocks senior and director-level roles at IT services, consulting, and large enterprise clients.\n\nFor team leads and junior PMs: CSM first, then PMP after 2–3 years. CSM is your entry into project and delivery management roles. PMP is your upgrade after you've logged the hours.`,
  },
  {
    id: 16, tag: 'Management', tagColor: '#F59E0B', domain: 'management',
    title: 'Should You Do a Google PM Certificate or Go Straight to PMP?',
    date: 'Feb 2026', readTime: '4 min', forWho: 'Switcher',
    excerpt: `The Google Project Management Certificate on Coursera (₹12,000, 6 months) is one of the most popular career-switching certifications in India. But how does it compare to PMP for actually getting hired?\n\nFor career switchers with no PM experience: the Google PM cert is your starting point. It gives you the vocabulary, frameworks, and a portfolio project to point to. You can complete it without any experience. PMP requires 36 months of leading projects — if you don't have that, you literally cannot sit the exam.\n\nFor experienced professionals wanting to formalise PM credentials: skip Google PM and go straight to PMP. The Google cert won't differentiate you if you already have years of experience. PMP will.\n\nThe honest ROI take: Google PM cert gets you your first PM role (₹8–12L). PMP gets you the senior PM role (₹18–25L). They're sequential, not competing. Think of Google PM as the on-ramp and PMP as the highway.`,
  },
  {
    id: 17, tag: 'Management', tagColor: '#F59E0B', domain: 'management',
    title: 'Six Sigma in India: Is Green Belt or Black Belt Worth It in 2026?',
    date: 'Dec 2025', readTime: '4 min', forWho: 'Professional',
    excerpt: `Six Sigma certifications were once the standard in manufacturing and ops. They remain highly valued in specific sectors — pharma, automotive, FMCG, and large-scale operations — but their relevance varies dramatically by industry.\n\nSix Sigma Green Belt (₹30,000, 3 months): practical for mid-level ops managers who work in process-heavy environments. The ROI is solid if your employer values quality methodology — you'll typically be considered for process lead and ops manager roles that pay ₹4–6L more.\n\nSix Sigma Black Belt (₹55,000, 6 months): for senior ops professionals targeting quality head or VP operations roles. The salary premium is real — ₹8–12L higher than Green Belt equivalents at large manufacturers and pharma companies.\n\nWhere it doesn't pay off: pure software companies, early-stage startups, or roles that don't involve process management. The cert is irrelevant in those contexts. Six Sigma is a high-ROI cert if and only if you're in an industry that hires for it.`,
  },

  // ── Government & PSU (3) ─────────────────────────────
  {
    id: 18, tag: 'Govt & PSU', tagColor: '#51B1E7', domain: 'government',
    title: 'GATE 2026: Is It Worth It for PSU Jobs vs M.Tech?',
    date: 'Mar 2026', readTime: '6 min', forWho: 'Student',
    excerpt: `GATE is the entry point to two completely different career paths: PSU jobs (BHEL, ONGC, NTPC, IOCL) and M.Tech/MS admissions at IITs and NITs. The exam is the same. The downstream outcomes are very different and so is the ROI calculation.\n\nGATE for PSU jobs: ONGC Grade E1 starts at ₹12.6L CTC including allowances. BHEL starts at ₹9.7L. These are stable, benefits-heavy packages with guaranteed increments and zero job insecurity. For engineers from non-IIT backgrounds, PSU via GATE is often the highest-paying first job they can access.\n\nGATE for M.Tech/MS: IIT stipends cover your education cost (₹12,400/month scholarship for qualifying GATE scorers). M.Tech from IIT typically translates to ₹18–25L first offers in tech companies. But you're investing 2 more years of your career timeline.\n\nOur ROI verdict: for engineers from Tier 2–3 colleges who want stability, PSU via GATE is the best-value career path available in India. For those targeting research, academia, or premium tech roles, M.Tech at IIT with GATE is the path. The ₹2,000 exam investment has the highest potential ROI of any cert in our database.`,
  },
  {
    id: 19, tag: 'Govt & PSU', tagColor: '#51B1E7', domain: 'government',
    title: 'IBPS PO 2026: Complete Strategy and ROI for Bank PO Preparation',
    date: 'Feb 2026', readTime: '6 min', forWho: 'Student',
    excerpt: `Bank PO roles via IBPS are among the most sought-after government positions in India — offering starting packages of ₹8–10L (including allowances, HRA, and DA), zero income anxiety, and a clear promotion path to Assistant General Manager within 8–10 years.\n\nThe preparation cost is low — ₹5,000–₹15,000 for quality coaching materials and mock tests. The time investment is high — serious preparation takes 6–12 months. The success rate is around 0.3–0.5% of applicants (roughly 60,000 vacancies for 15 million applicants in recent cycles).\n\nROI calculation for IBPS PO is fundamentally different from private sector certs: the salary is lower at entry (₹38,000–40,000 basic) but the total compensation including allowances, housing, and job security makes it comparable to ₹8–10L private sector roles. The real premium is stability and the pension-equivalent benefits structure.\n\nBest suited for: candidates from smaller cities and Tier 3 towns where banking careers are highly regarded, candidates who value job stability over maximum salary growth, and those from commerce backgrounds targeting their first professional role.`,
  },
  {
    id: 20, tag: 'Govt & PSU', tagColor: '#51B1E7', domain: 'government',
    title: 'SSC CGL vs IBPS PO: Which Government Exam Gives Better ROI?',
    date: 'Jan 2026', readTime: '5 min', forWho: 'Student',
    excerpt: `SSC CGL and IBPS PO are India's two most-attempted government competitive exams. Both offer stable central government careers. The ROI comparison depends on what you're optimising for.\n\nSSC CGL: recruits for Group B and C posts across central government departments — Income Tax Inspector, Central Excise Inspector, Audit Officer. Starting salary: ₹35,000–45,000 basic (₹7–10L CTC with allowances). The work is departmental, structured, and often posting-location dependent.\n\nIBPS PO: Probationary Officer at public sector banks. Starting salary: ₹36,000–38,000 basic (₹8–10L with allowances). The career progression in banking is more clearly defined and often faster than departmental government roles.\n\nOur take: if career growth trajectory matters more, IBPS PO wins — the promotion path from PO to GM in PSBs is well-structured and relatively merit-driven. If posting preference (home state, specific city) matters, SSC CGL offers more flexibility in some departments. For pure salary ceiling at senior levels, SSC CGL can lead to IRS (Income Tax) roles with significant earning potential including legitimate perquisites.`,
  },

  // ── Medical (3) ──────────────────────────────────────
  {
    id: 21, tag: 'Medical', tagColor: '#06B6D4', domain: 'medical',
    title: 'DNB vs MD: Which Postgraduate Medical Path Pays More in India?',
    date: 'Mar 2026', readTime: '6 min', forWho: 'Professional',
    excerpt: `For MBBS graduates in India, the postgraduate dilemma is real: MD/MS from a medical college or DNB (Diplomate of National Board) from an accredited hospital? Both are recognised as equivalent qualifications. The practical differences are substantial.\n\nMD/MS advantage: attached to medical college infrastructure, academic credibility, eligibility for teaching posts and government hospital consultant roles. The research ecosystem is better. Entry into premium government hospital roles (AIIMS, PGIMER) typically requires MD/MS pathway.\n\nDNB advantage: more hospital postings available (especially in corporates like Apollo, Fortis, Max), practical clinical exposure often higher in tertiary care hospitals, and for specialties where private practice income dominates (surgery, orthopaedics, dermatology), the DNB route can get you to independent practice faster.\n\nSalary comparison in private practice after 5 years: broadly similar across both routes, driven more by specialty choice and location than degree type. DNB gynaecologists in Tier 2 cities earn equivalent to MD gynaecologists. The real differentiator is super-specialisation — FNB (Fellowship NBE) after DNB is increasingly competitive with DM/MCh in corporate hospital hiring.`,
  },
  {
    id: 22, tag: 'Medical', tagColor: '#06B6D4', domain: 'medical',
    title: 'USMLE Step 1 in 2026: Is the US Residency Path Worth It for Indian Doctors?',
    date: 'Feb 2026', readTime: '7 min', forWho: 'Professional',
    excerpt: `The USMLE pathway to US residency is the most expensive, most time-consuming, and highest-potential-ROI career path available to Indian MBBS graduates. In 2026, the path is harder than it was five years ago — but for the right profile, it remains transformative.\n\nStep 1 is now pass/fail. The score that once differentiated candidates is gone. What matters now: Step 2 CK score, clinical experience, research publications, and USCE (US Clinical Experience). Indian IMGs are increasingly competitive but the match rate has been declining for non-US-citizen IMGs in competitive specialties.\n\nFinancial reality: USMLE preparation + IELTS + USCE trips + application costs total ₹8–12L over 2–4 years before you match. US residency stipends start at $60,000–70,000/year. After residency, attending physician salaries are $250,000–400,000 depending on specialty. The 20-year career NPV is enormous — but the front-loaded costs and uncertainty are significant.\n\nWho should pursue it: MBBS graduates under 26 with strong academics, a genuine interest in academic medicine or specific specialties that pay exceptionally well in the US (radiology, anaesthesia, dermatology), and the financial runway to absorb 3–4 years of investment before income.`,
  },
  {
    id: 23, tag: 'Medical', tagColor: '#06B6D4', domain: 'medical',
    title: 'Clinical Research Career in India: ACRP CRA Certification ROI',
    date: 'Jan 2026', readTime: '5 min', forWho: 'Switcher',
    excerpt: `India is one of the world's largest clinical trial hubs — lower costs, diverse patient populations, and ICMR/CDSCO frameworks that attract pharma giants to run Phase II and Phase III trials here. This creates a massive, under-served career opportunity for life sciences graduates.\n\nACRP (Association of Clinical Research Professionals) certification — specifically the Certified Clinical Research Associate (CCRA) — is the international credential that positions Indian professionals for CRO (Contract Research Organisation) roles at IQVIA, Syneos, PPD, and Parexel, all of which have large India operations.\n\nStarting salary for CRAs in India without certification: ₹4.5–6L. With ACRP CCRA and 2 years of experience: ₹10–14L. Senior CRAs and CRMs at global CROs earn ₹20–28L. The ceiling is high and the India market for clinical research professionals is growing at 14% annually.\n\nPath for MBBS, B.Pharma, M.Sc Life Sciences graduates: ACRP CCRA certification + 1 internship at a CRO or sponsor company is the fastest path to a high-growth clinical research career that doesn't require PG entrance exam stress.`,
  },

  // ── Architecture & Engineering (3) ───────────────────
  {
    id: 24, tag: 'Architecture', tagColor: '#F97316', domain: 'architecture',
    title: 'LEED Certification in India: Green Building Career ROI in 2026',
    date: 'Mar 2026', readTime: '5 min', forWho: 'Professional',
    excerpt: `India's green building market is growing rapidly — BEE star ratings, GRIHA, and LEED certification are now standard requirements on large commercial and institutional projects. For architects and civil engineers, LEED certification has shifted from a differentiator to a table-stakes credential in many project types.\n\nLEED Green Associate (₹20,000, 2 months): the entry-level credential. Opens the door to sustainable design roles and makes you eligible to work on LEED-certified projects. Strong for recent graduates and mid-level engineers.\n\nLEED AP BD+C (₹35,000, 3 months): the full credential for architects leading LEED project certification. Project managers and architects with LEED AP BD+C command ₹4–8L more than equivalent non-certified professionals on premium commercial projects.\n\nThe India-specific opportunity: as ESG requirements tighten and large developers (DLF, Embassy, Prestige) standardise on LEED certification for their commercial portfolios, architects and civil engineers with LEED credentials are increasingly preferred for senior design roles. The ROI is best for those targeting large commercial, institutional, and corporate campus projects.`,
  },
  {
    id: 25, tag: 'Engineering', tagColor: '#F97316', domain: 'engineering',
    title: 'GATE for PSU vs Autodesk Certifications: Which Path for Civil Engineers?',
    date: 'Feb 2026', readTime: '5 min', forWho: 'Student',
    excerpt: `Civil engineering graduates in India face a fork in the road: the stability of PSU via GATE, or the skills-based private sector path anchored by BIM and software certifications like AutoCAD, Revit, and Civil 3D.\n\nGATE for civil engineers: NHAI, RVNL, BHEL, and CPWD all recruit via GATE. Packages range from ₹8–12L CTC. Stable, structured, often government-subsidised housing and other benefits. The competition is intense — civil GATE cutoffs for PSUs are high.\n\nAutodesk AutoCAD + Revit or Civil 3D certifications (₹12,000–15,000 each, 2 months): open private sector roles in design consultancies, EPCC companies, and real estate developers. Starting salaries are lower (₹4–6L) but growth in premium design firms is faster for high performers.\n\nOur take: for civil engineers from Tier 2–3 colleges who want stability, GATE is the highest-priority investment. For those from metro engineering colleges who want to work on large-scale private infrastructure projects or target international firms, BIM certifications paired with strong portfolio projects are the competitive edge. The paths aren't mutually exclusive — several engineers prepare for GATE while building Revit skills simultaneously.`,
  },
  {
    id: 26, tag: 'Engineering', tagColor: '#F97316', domain: 'engineering',
    title: 'Solar Energy Certifications in India: Career ROI in Renewable Energy 2026',
    date: 'Jan 2026', readTime: '5 min', forWho: 'Switcher',
    excerpt: `India's solar energy sector is one of the fastest-growing employers in the country. 500 GW renewable energy target by 2030, massive rooftop solar mandates, and PM-KUSUM expansion mean the demand for solar installation and project management professionals is surging.\n\nNABCEP Solar PV Installation Professional (₹30,000, 3 months): the internationally recognised benchmark for solar installation professionals. In India, it's increasingly required by solar EPCs (Tata Power Solar, Waaree, Vikram Solar) for senior technical roles.\n\nFor electrical engineers switching to renewable energy: NABCEP PV Installation Professional + 1 site project opens entry into solar EPC roles at ₹8–14L. Senior solar engineers with NABCEP + 4+ years of site experience are earning ₹20–28L at utility-scale project developers.\n\nFor non-engineers interested in solar: NABCEP PV Associate (the entry-level cert, ₹8,000) is a starting point for sales, procurement, and project coordination roles that don't require deep technical knowledge. India's solar sector needs project managers, procurement specialists, and customer success professionals as much as it needs engineers.`,
  },

  // ── Marketing, HR & Product (4) ──────────────────────
  {
    id: 27, tag: 'Marketing', tagColor: '#EC4899', domain: 'marketing',
    title: 'Google Digital Marketing Certificate: Honest ROI for Indian Professionals',
    date: 'Mar 2026', readTime: '5 min', forWho: 'Student',
    excerpt: `The Google Digital Marketing & E-commerce Certificate is one of the most-completed certifications in India. 480,000+ completions in 2025 alone. That popularity is both its strength and its risk — the market is flooded with people who have the certificate.\n\nWhat the cert does: gives you a structured foundation in SEO, SEM, social media, analytics, and email marketing. For someone with zero marketing background, it's an excellent structured curriculum. Google's name recognition opens doors at smaller companies and startups.\n\nWhat it doesn't do: differentiate you at large companies, agencies, or any employer that has already seen 200 applications with this cert. Alone, it's table stakes. Paired with a portfolio (3 real campaigns you ran, with metrics), it's competitive.\n\nROI reality: entry digital marketing roles in India pay ₹3.5–5L for freshers regardless of which cert you hold. The Google cert gets you in the room. What gets you the offer is showing that you actually ran ads, built an audience, or grew something measurable. The cert is the minimum viable credential — your portfolio is the actual differentiator.`,
  },
  {
    id: 28, tag: 'HR & People', tagColor: '#A855F7', domain: 'hr',
    title: 'SHRM Certification in India: Is It Worth It for HR Professionals?',
    date: 'Feb 2026', readTime: '5 min', forWho: 'Professional',
    excerpt: `Human Resources as a profession in India is evolving fast — People Analytics, HRBP (HR Business Partner) roles, and DEI programmes are pushing HR beyond administrative functions into strategic business roles. SHRM certification is the global credential that marks this transition.\n\nSHRM-CP (Certified Professional, ₹45,000, 4 months): designed for HR professionals in operational roles who implement policies and programmes. Appropriate for HR executives with 1–5 years of experience targeting senior HRBP or HR manager roles.\n\nIn India, SHRM is most valued at MNCs, GCCs, and large IT services firms where global HR standards are applied. At domestic companies (manufacturing, MSME), PHRNI or simply demonstrated experience often carries more weight than the global cert.\n\nSalary impact: SHRM-CP holders at MNCs and GCCs in India command a ₹3–6L premium over non-certified HR professionals at the same experience level. The premium is highest for those moving from HR generalist to HRBP roles, where the cert signals strategic capability.`,
  },
]

const BlogPage = function() {
  const [filter,        setFilter]       = useState('All')
  const [expandedPost,  setExpandedPost] = useState(null)
  const [domainFilter,  setDomainFilter] = useState('All')

  const DOMAIN_FILTERS = ['All', 'Cloud & Tech', 'Data & AI', 'Cybersecurity', 'Finance', 'Management', 'Govt & PSU', 'Medical', 'Architecture', 'Engineering', 'Marketing', 'HR & People']

  var filtered = BLOG_POSTS.filter(function(p) {
    var modeOk   = filter === 'All' || p.forWho === filter
    var domainOk = domainFilter === 'All' || p.tag === domainFilter
    return modeOk && domainOk
  })

  return (
    <PageWrapper maxWidth="1060px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>

        <h1 style={{ ...hs, fontSize: 'clamp(2.2rem,5.5vw,3.8rem)' }}>
          THE CERTIFYROI<br /><span style={{ color: 'var(--indigo)' }}>BLOG</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-3)', marginBottom: '12px', fontFamily: FB }}>
          {BLOG_POSTS.length} data-driven career guides for India's professionals. No fluff. Just numbers and honest takes.
        </p>

        {/* Mode filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {['All', 'Student', 'Switcher', 'Professional'].map(function(t) {
            return (
              <button key={t} onClick={function() { setFilter(t) }}
                style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontFamily: FB, fontWeight: '600', transition: 'all 0.18s', background: filter === t ? 'var(--indigo-dim)' : 'var(--surface)', border: '1px solid ' + (filter === t ? 'var(--border-accent)' : 'var(--border)'), color: filter === t ? 'var(--indigo-light)' : 'var(--text-4)' }}>
                {t}
              </button>
            )
          })}
        </div>

        {/* Domain filter */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {DOMAIN_FILTERS.map(function(d) {
            return (
              <button key={d} onClick={function() { setDomainFilter(d) }}
                style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontFamily: FM, letterSpacing: '0.03em', transition: 'all 0.18s', background: domainFilter === d ? 'rgba(99,102,241,0.12)' : 'var(--surface)', border: '1px solid ' + (domainFilter === d ? 'rgba(99,102,241,0.3)' : 'var(--border)'), color: domainFilter === d ? '#818CF8' : 'var(--text-4)' }}>
                {d}
              </button>
            )
          })}
        </div>

        {/* Posts grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
          {filtered.map(function(post, i) {
            var isExpanded = expandedPost === post.id
            var paragraphs = post.excerpt.split('\n\n')
            return (
              <motion.div key={post.id}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                whileHover={{ y: -3 }}
                onClick={function() { setExpandedPost(isExpanded ? null : post.id) }}
              >
                {/* Tag */}
                <div style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: post.tagColor + '18', color: post.tagColor, display: 'inline-block', marginBottom: '12px', fontFamily: FM, letterSpacing: '0.06em' }}>
                  {post.tag}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '10px', lineHeight: '1.45', fontFamily: FH, flex: 1 }}>
                  {post.title}
                </h3>

                {/* Excerpt — first paragraph always visible */}
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', marginBottom: '12px', fontFamily: FB }}>
                  {paragraphs[0]}
                </p>

                {/* Expanded paragraphs */}
                <AnimatePresence>
                  {isExpanded ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      {paragraphs.slice(1).map(function(para, pi) {
                        return (
                          <p key={pi} style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.75', marginBottom: '12px', fontFamily: FB }}>
                            {para}
                          </p>
                        )
                      })}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: FB }}>{post.date} · {post.readTime} read</span>
                  <span style={{ fontSize: '12px', color: 'var(--indigo)', fontWeight: '700', fontFamily: FH, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {isExpanded ? 'Close' : 'Read'}
                    <motion.span animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'inline-flex' }}>
                      <ChevronRight size={12} />
                    </motion.span>
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-4)', fontFamily: FB }}>
            No posts match your current filters.
          </div>
        )}

      </motion.div>
    </PageWrapper>
  )
}

// ─────────────────────────────────────────────────────────
// FAQ PAGE — expanded, more depth, more questions
// ─────────────────────────────────────────────────────────
const FAQPage = function() {
  const [open, setOpen] = useState(null)

  const faqs = [
    // Product
    {
      category: 'Product',
      q: 'Is CertifyROI free?',
      a: 'Yes. The ROI calculator, city demand heatmap, cert comparison, career simulator, and job-cert map are all free with no account required. You get 3 free AI analyses as a guest. Sign in with Google for unlimited free AI analyses. There are no paid plans and no paywalled features.',
    },
    {
      category: 'Product',
      q: 'What is the difference between Resume AI and the ROI Calculator?',
      a: 'Resume AI (Step 1) is for discovery — you don\'t know which cert to pursue yet. You upload your resume and the AI reads your background, detects your domain and city, and recommends the top 3 certifications with specific reasons tied to your actual experience. ROI Calculator (Step 2) is for validation — you already know which cert and you want to see the exact financial numbers: break-even timeline, 5-year net gain, monthly salary change, and an AI verdict on whether the numbers make sense at your salary level.',
    },
    {
      category: 'Product',
      q: 'Why does Student Mode exist?',
      a: 'Standard ROI calculators assume you have a salary to compare against. Students don\'t. Student Mode removes salary sliders entirely and reframes the calculation around time-to-first-offer, fresher benchmarks in your city, and career investment ROI. It tracks how long before your cert investment pays back through your starting offer, not a salary hike percentage.',
    },
    {
      category: 'Product',
      q: 'What is Pitch Your Boss?',
      a: 'Pitch Your Boss is an AI email generator for professionals who need to justify a certification to their manager or HR for sponsorship. You enter the cert name, your current role, expected ROI, and it generates a professional email with data anchors your manager will respond to. It\'s only available in Professional mode.',
    },
    {
      category: 'Product',
      q: 'What is the Cert to Job Map?',
      a: 'The Job-Cert Map shows exactly which certifications are required or preferred for specific roles across two categories: government positions (UPSC, SSC, PSU exams like BHEL, ONGC, NTPC) and private sector roles at major Indian employers (TCS, Infosys, Wipro, Deloitte, HDFC Bank, etc.). Government data is sourced from official recruitment notifications. Private sector data is employee-reported and marked as such.',
    },
    // Data
    {
      category: 'Data & Accuracy',
      q: 'How accurate are the salary figures?',
      a: 'Salary data is sourced from LinkedIn Economic Graph India reports, NASSCOM 2026 talent survey, Naukri salary insights, AmbitionBox self-reported data, and WEF India Future of Jobs 2025. All figures are medians — 50th percentile for the given role, city, and experience level. Individual results vary significantly based on company tier, negotiation skill, current employer, and economic conditions. We update our data quarterly.',
    },
    {
      category: 'Data & Accuracy',
      q: 'Is my resume stored anywhere?',
      a: 'No. Resume text is processed in real-time using the Groq inference API and is not stored, logged, or retained in any database. The text goes in, analysis comes out, and it\'s gone. We don\'t have access to your resume after the analysis completes. This is a deliberate architectural decision, not just a policy.',
    },
    {
      category: 'Data & Accuracy',
      q: 'The hike percentage the AI suggested seems high. Is it realistic?',
      a: 'The AI cites median hike percentages from the Indian market for professionals who both complete a certification and actively switch roles. Hikes are much higher when you use a cert to negotiate an external offer than when requesting an internal raise. If you stay at your current company and only use the cert as a bargaining chip, expect the lower end of the range (10–20% for most certs). If you use it to move companies, 30–50% is achievable for high-demand certifications in metro cities.',
    },
    {
      category: 'Data & Accuracy',
      q: 'Why does my city\'s data look like a nearby city?',
      a: 'We have detailed salary and demand data for 8 cities: Bangalore, Hyderabad, Pune, Mumbai, Delhi NCR, Chennai, Kolkata, and Ahmedabad. If your city isn\'t in our database, we use the Haversine formula to find the nearest city and show that data with a clear disclosure. India national median is also shown below for comparison. We\'re expanding city coverage — if you\'d like your city added, email us.',
    },
    {
      category: 'Data & Accuracy',
      q: 'Are the job demand figures real-time or static?',
      a: 'Job demand ratings (Very High / High / Medium / Low) are based on quarterly market analysis, not real-time job posting counts. They reflect the sustained demand trend over the past 6–12 months, not a single day\'s Naukri listings. For real-time counts, we recommend checking Naukri and LinkedIn directly using the cert name as a keyword.',
    },
    // Career advice
    {
      category: 'Career Questions',
      q: 'I have no tech background. Can I still use CertifyROI?',
      a: 'Yes. CertifyROI covers finance (CFA, FMVA, CMA, CA, NISM), management (PMP, CSM, Six Sigma), marketing (Google, HubSpot, Meta), HR (SHRM), product management (PM School), architecture (LEED, CoA), medical (DNB, USMLE, PLAB), law (Bar, CS), civil and mechanical engineering, and government exam prep (GATE, UPSC, SSC, IBPS). Select your domain in the Resume AI step and the analysis will focus on your field.',
    },
    {
      category: 'Career Questions',
      q: 'I want to switch careers completely. Which certification should I start with?',
      a: 'This depends heavily on the domain you\'re switching to and your timeline. The fastest ROI switches we\'ve seen in our data: ops/finance → data analytics (IBM Data Science, 5 months), backend dev → cloud (AWS SAA, 3 months), MBBS → clinical research (ACRP CRA, 4 months), any background → digital marketing (Google DM, 3 months). Switch to Professional mode → upload your resume → the AI will suggest the fastest viable path based on your existing transferable skills.',
    },
    {
      category: 'Career Questions',
      q: 'I\'m a senior professional. Are there certifications that make sense at a high salary?',
      a: 'Yes, but the math changes. At ₹30L+, a 25% hike from a cert is ₹7.5L/year — the ROI is still strong even for expensive certifications like OSCP (₹95,000), CISSP (₹60,000), or ISB PGP (₹3L). What matters more at senior levels is whether the cert unlocks a role tier change (from senior to director, from manager to partner) rather than just a salary negotiation. Certs that open senior doors: CFA, CISSP, CISM, PMP (Black Belt), ISB/IIM executive programmes.',
    },
    {
      category: 'Career Questions',
      q: 'Can CertifyROI help with government exam preparation planning?',
      a: 'We can tell you the ROI profile of government exams — starting salaries, career trajectories, prep costs, and realistic success rates. We can\'t help with the actual preparation content (study materials, mock tests, strategy). For UPSC preparation, we\'d recommend platforms like Unacademy, BYJU\'s IAS, or Drishti IAS. For GATE, MADE Easy and ACE Academy are widely respected. CertifyROI helps you decide if a government exam path is right for your profile — not how to crack it.',
    },
    // Technical
    {
      category: 'Technical',
      q: 'The AI analysis gave me a weird result. What should I do?',
      a: 'The AI (Groq llama-3.3-70b) can occasionally produce off-format or incorrect responses. If the result looks wrong, try refreshing and re-running — responses vary slightly each time. If you got a low-quality result consistently, the issue might be with the resume text itself: very short resumes, PDF extraction errors, or non-standard resume formats can produce poor analysis. Try pasting your resume text directly instead of uploading a file.',
    },
    {
      category: 'Technical',
      q: 'My PDF isn\'t being read correctly. What\'s happening?',
      a: 'PDF text extraction works best on standard text-based PDFs. Issues occur with: scanned PDFs (image-based, no actual text), highly formatted PDFs with complex tables or columns, and PDFs with non-standard fonts. If extraction fails, paste your resume text directly into the text area. For best results, copy your resume from Word or Google Docs and paste as plain text.',
    },
  ]

  const categories = ['Product', 'Data & Accuracy', 'Career Questions', 'Technical']

  return (
    <PageWrapper maxWidth="760px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>

        <h1 style={{ ...hs, fontSize: 'clamp(2.2rem,5.5vw,3.8rem)' }}>
          FREQUENTLY<br /><span style={{ color: 'var(--indigo)' }}>ASKED</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-3)', marginBottom: '36px', fontFamily: FB }}>
          {faqs.length} questions answered. Everything you wanted to know about CertifyROI.
        </p>

        {categories.map(function(cat) {
          var catFaqs = faqs.filter(function(f) { return f.category === cat })
          return (
            <div key={cat} style={{ marginBottom: '32px' }}>
              <div style={{ fontFamily: FM, fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ height: '1px', width: '24px', background: 'var(--border)' }} />
                {cat}
                <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {catFaqs.map(function(faq, i) {
                  var idx = cat + '-' + i
                  var isOpen = open === idx
                  return (
                    <motion.div
                      key={idx}
                      className="glass"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      style={{ overflow: 'hidden', cursor: 'pointer' }}
                      onClick={function() { setOpen(isOpen ? null : idx) }}
                    >
                      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: isOpen ? 'var(--indigo-light)' : 'var(--text)', fontFamily: FH, lineHeight: '1.45', flex: 1 }}>
                          {faq.q}
                        </span>
                        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0, marginTop: '2px' }}>
                          <ChevronRight size={15} color="var(--text-4)" />
                        </motion.div>
                      </div>
                      <AnimatePresence>
                        {isOpen ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ padding: '0 20px 18px', fontSize: '14px', color: 'var(--text-2)', borderTop: '1px solid var(--border)', fontFamily: FB, lineHeight: '1.8', paddingTop: '14px' }}>
                              {faq.a}
                            </div>
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
// CONTACT PAGE (unchanged)
// ─────────────────────────────────────────────────────────
const ContactPage = function() {
  const [sent, setSent] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General feedback', message: '' })
  const inputStyle = { width: '100%', padding: '11px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', fontFamily: FB, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.18s' }
  const labelStyle = { fontSize: '11px', color: 'var(--text-4)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: FM }
  return (
    <PageWrapper maxWidth="600px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>
        <h1 style={{ ...hs, fontSize: 'clamp(2.2rem,5.5vw,3.8rem)' }}>CONTACT<br /><span style={{ color: 'var(--indigo)' }}>US</span></h1>
        <p style={{ fontSize: '15px', color: 'var(--text-3)', marginBottom: '28px', fontFamily: FB }}>Feedback, bug reports, data corrections, partnership enquiries, or just saying hi.</p>
        {sent ? (
          <div className="glass" style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>✅</div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text)', fontFamily: FH, fontWeight: '800', marginBottom: '8px' }}>Message Sent!</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-3)', fontFamily: FB, lineHeight: '1.6' }}>We will reply within 48 hours at the email you provided.</p>
          </div>
        ) : (
          <div className="glass" style={{ padding: '32px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Name</label>
              <input type="text" placeholder="Your name" value={formData.name} onChange={function(e) { setFormData(function(p) { return { ...p, name: e.target.value } }) }} style={inputStyle} onFocus={function(e) { e.target.style.borderColor = 'var(--border-accent)' }} onBlur={function(e) { e.target.style.borderColor = 'var(--border)' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" placeholder="you@email.com" value={formData.email} onChange={function(e) { setFormData(function(p) { return { ...p, email: e.target.value } }) }} style={inputStyle} onFocus={function(e) { e.target.style.borderColor = 'var(--border-accent)' }} onBlur={function(e) { e.target.style.borderColor = 'var(--border)' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Subject</label>
              <select value={formData.subject} onChange={function(e) { setFormData(function(p) { return { ...p, subject: e.target.value } }) }} style={{ ...inputStyle, background: 'var(--surface)' }}>
                <option>General feedback</option>
                <option>Bug report</option>
                <option>Data correction</option>
                <option>Partnership / B2B</option>
                <option>Press enquiry</option>
              </select>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Message</label>
              <textarea rows={5} placeholder="Tell us what's on your mind..." value={formData.message} onChange={function(e) { setFormData(function(p) { return { ...p, message: e.target.value } }) }} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} onFocus={function(e) { e.target.style.borderColor = 'var(--border-accent)' }} onBlur={function(e) { e.target.style.borderColor = 'var(--border)' }} />
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={function() { setSent(true) }}>Send Message</button>
          </div>
        )}
      </motion.div>
    </PageWrapper>
  )
}

// ─────────────────────────────────────────────────────────
// NAV + TABS — Study Tracker removed from ALL_TABS
// ─────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: 'home',    label: 'Home',    icon: Home       },
  { id: 'app',     label: 'Tools',   icon: TrendingUp },
  { id: 'blog',    label: 'Blog',    icon: BookOpen   },
  { id: 'faq',     label: 'FAQ',     icon: Sparkles   },
  { id: 'about',   label: 'About',   icon: Info       },
  { id: 'contact', label: 'Contact', icon: Phone      },
]

const STEP_TABS = [
  { id: 'resume',     num: '1', label: 'Find Cert',     icon: FileText,   desc: 'AI picks from resume'    },
  { id: 'calculator', num: '2', label: 'Calculate ROI', icon: TrendingUp, desc: 'Break-even and 5yr gain' },
  { id: 'heatmap',    num: '3', label: 'City Demand',   icon: Map,        desc: 'Is it hot in your city?' },
]

const TOOL_TABS = [
  { id: 'compare',  label: 'Compare Certs',   icon: Award,         desc: 'Two certs side by side'       },
  { id: 'simulate', label: 'Career Path',     icon: Route,         desc: 'Multi-cert salary trajectory' },
  { id: 'jobmap',   label: 'Cert to Job Map', icon: Building2,     desc: 'Which cert gets which role'   },
  { id: 'college',  label: 'Degree vs Certs', icon: GraduationCap, desc: 'MBA vs certifications'        },
]

const ALL_TABS = [...STEP_TABS, ...TOOL_TABS]

const StepArrow = function({ active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, padding: '0 2px' }}>
      <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
        <path d="M0 8 H26 M20 2 L28 8 L20 14" stroke={active ? '#6366F1' : 'rgba(99,102,241,0.3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={active ? '0' : '4 3'} style={{ transition: 'stroke 0.3s' }} />
      </svg>
    </div>
  )
}

const NavBar = function({ currentPage, activeTab, onNavigate, onTabChange }) {
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const { user, signInGoogle, signOut, loading } = useAuth()

  const go        = function(id) { onNavigate(id); setMenuOpen(false) }
  const switchTab = function(id) { onTabChange(id) }

  const handleSignIn = async function() {
    setSigningIn(true)
    try { await signInGoogle() } catch(e) {}
    setSigningIn(false)
  }

  const NAV_H  = 64
  const TABS_H = 88

  return (
    <>
      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={T}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'var(--bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', transition: 'background 0.3s' }}>

        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: NAV_H + 'px', gap: '4px' }}>

            <button onClick={function() { go('home') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, padding: '0 8px 0 0', marginRight: '8px' }}>
              <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,var(--indigo),#4338CA)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={15} color="white" />
              </div>
              <span style={{ fontFamily: FH, fontWeight: '800', fontSize: '17px', letterSpacing: '-0.02em', color: 'var(--text)' }}>
                Certify<span style={{ color: 'var(--indigo)' }}>ROI</span>
              </span>
            </button>

            <nav style={{ display: 'flex', gap: '2px', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {NAV_LINKS.map(function(link) {
                var isActive = currentPage === link.id
                return (
                  <button key={link.id} onClick={function() { go(link.id) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid ' + (isActive ? 'var(--border-accent)' : 'transparent'), background: isActive ? 'var(--indigo-dim)' : 'transparent', color: isActive ? 'var(--indigo-light)' : 'var(--text-4)', fontSize: '13px', fontWeight: isActive ? '700' : '500', cursor: 'pointer', fontFamily: FH, whiteSpace: 'nowrap', transition: 'all 0.18s', letterSpacing: '-0.01em' }}>
                    <link.icon size={12} />{link.label}
                  </button>
                )
              })}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: 'auto' }}>
              {!loading ? (
                user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {user.photoURL
                      ? <img src={user.photoURL} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--border-accent)' }} />
                      : <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--indigo),#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={13} color="white" /></div>
                    }
                    <button onClick={signOut} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '7px', color: '#EF4444', fontSize: '12px', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: FB }}>
                      <LogOut size={12} /> <span className="signout-text">Sign out</span>
                    </button>
                  </div>
                ) : (
                  <button onClick={handleSignIn} disabled={signingIn}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'var(--indigo)', border: 'none', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', color: 'white', fontSize: '13px', fontFamily: FB, fontWeight: '600', opacity: signingIn ? 0.7 : 1 }}>
                    <LogIn size={13} /><span className="signin-text">{signingIn ? '...' : 'Sign in'}</span>
                  </button>
                )
              ) : null}
              <ThemeToggle />
              <button onClick={function() { setMenuOpen(function(v) { return !v }) }}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '7px', padding: '7px', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', transition: 'all 0.18s' }}>
                {menuOpen ? <X size={15} /> : <Menu size={15} />}
              </button>
            </div>
          </div>
        </div>

        {currentPage === 'app' ? (
          <div>
            <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
              <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '46px', gap: '0' }}>
                <div style={{ fontSize: '9px', color: 'var(--text-4)', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.12em', marginRight: '16px', flexShrink: 0, whiteSpace: 'nowrap' }}>Core Flow</div>
                {STEP_TABS.map(function(tab, i) {
                  var active      = activeTab === tab.id
                  var isCompleted = STEP_TABS.findIndex(function(t) { return t.id === activeTab }) > i
                  return (
                    <div key={tab.id} style={{ display: 'flex', alignItems: 'center' }}>
                      {i > 0 ? <StepArrow active={isCompleted || activeTab === tab.id} /> : null}
                      <button onClick={function() { switchTab(tab.id) }}
                        style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 14px', borderRadius: '8px', border: '1px solid ' + (active ? 'var(--border-accent)' : 'transparent'), background: active ? 'var(--indigo-dim)' : 'transparent', color: active ? 'var(--indigo-light)' : isCompleted ? 'rgba(99,102,241,0.5)' : 'var(--text-3)', cursor: 'pointer', fontFamily: FH, transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: active ? 'var(--indigo)' : isCompleted ? 'rgba(99,102,241,0.3)' : 'var(--surface)', border: '1px solid ' + (active ? 'var(--indigo)' : isCompleted ? 'rgba(99,102,241,0.4)' : 'var(--border)'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: active ? 'white' : isCompleted ? 'var(--indigo-light)' : 'var(--text-4)', flexShrink: 0, transition: 'all 0.2s', fontFamily: FM }}>
                          {tab.num}
                        </div>
                        <tab.icon size={12} />
                        <span style={{ fontSize: '13px', fontWeight: active ? '700' : '500', letterSpacing: '-0.01em' }}>{tab.label}</span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(99,102,241,0.08)', background: 'rgba(99,102,241,0.02)' }}>
              <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px', gap: '2px' }}>
                <div style={{ fontSize: '9px', color: 'var(--text-4)', fontFamily: FM, textTransform: 'uppercase', letterSpacing: '0.12em', marginRight: '16px', flexShrink: 0, opacity: 0.7, whiteSpace: 'nowrap' }}>Tools</div>
                {TOOL_TABS.map(function(tab) {
                  var active = activeTab === tab.id
                  return (
                    <button key={tab.id} onClick={function() { switchTab(tab.id) }}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '6px', border: 'none', borderBottom: '2px solid ' + (active ? 'var(--indigo)' : 'transparent'), background: active ? 'rgba(99,102,241,0.07)' : 'transparent', color: active ? 'var(--indigo-light)' : 'var(--text-4)', fontSize: '12px', fontWeight: active ? '700' : '400', cursor: 'pointer', fontFamily: FH, transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0, letterSpacing: '-0.01em', height: '100%' }}>
                      <tab.icon size={12} />{tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        ) : null}
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            style={{ position: 'fixed', top: (currentPage === 'app' ? NAV_H + TABS_H : NAV_H) + 'px', left: 0, right: 0, zIndex: 99, background: 'var(--bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '20px 16px' }}>
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', fontFamily: FM }}>All Tools</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '8px', marginBottom: '20px' }}>
                {ALL_TABS.map(function(tab) {
                  var isActive = activeTab === tab.id && currentPage === 'app'
                  return (
                    <button key={tab.id} onClick={function() { go('app'); switchTab(tab.id) }}
                      style={{ padding: '14px 12px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', background: isActive ? 'var(--indigo-dim)' : 'var(--surface)', border: '1px solid ' + (isActive ? 'var(--border-accent)' : 'var(--border)'), transition: 'all 0.18s' }}>
                      <tab.icon size={16} color={isActive ? 'var(--indigo)' : 'var(--text-4)'} style={{ marginBottom: '6px', display: 'block' }} />
                      <div style={{ fontSize: '12px', fontWeight: '700', color: isActive ? 'var(--indigo-light)' : 'var(--text)', marginBottom: '2px', fontFamily: FH }}>
                        {'num' in tab ? tab.num + '. ' + tab.label : tab.label}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: FB }}>{tab.desc}</div>
                    </button>
                  )
                })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: '6px' }}>
                {[
                  { id: 'blog',    label: 'Blog',    icon: BookOpen  },
                  { id: 'faq',     label: 'FAQ',     icon: Sparkles  },
                  { id: 'about',   label: 'About',   icon: Info      },
                  { id: 'contact', label: 'Contact', icon: Phone     },
                  { id: 'terms',   label: 'Terms',   icon: FileCheck },
                  { id: 'privacy', label: 'Privacy', icon: Shield    },
                ].map(function(item) {
                  return (
                    <button key={item.id} onClick={function() { go(item.id) }}
                      style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--text-2)', fontSize: '12px', fontFamily: FB, transition: 'all 0.18s' }}>
                      <item.icon size={12} color="var(--text-4)" />{item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

// ─────────────────────────────────────────────────────────
// APP PAGE
// ─────────────────────────────────────────────────────────
const AppPage = function({ activeTab, onTabChange, mode, modeLocked, onModeSelect, onModeReset, onCertSelected, prefilledCert, resumeCity, resumeDomain, resumeName }) {
  const NAV_H  = 64
  const TABS_H = 88

  return (
    <div style={{ paddingTop: (NAV_H + TABS_H) + 'px', minHeight: '100vh', background: 'var(--app-bg)', position: 'relative' }}>
      <WaveBg variant="app" />

      <AnimatePresence>
        {!modeLocked ? <ModeSelector onSelect={onModeSelect} /> : null}
      </AnimatePresence>

      {modeLocked ? (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 20px 0' }}>
            <ModePill mode={mode} onReset={onModeReset} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={T}>
              <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 60px' }}>

                {activeTab === 'resume' ? (
                  <div className="glass" style={{ padding: '28px' }}>
                    <ResumeAnalyzer mode={mode} onCertSelected={function(certName, city, domain, name) { onCertSelected(certName, city, domain, name) }} />
                  </div>
                ) : null}

                {activeTab === 'calculator' ? (
                  <Hero mode={mode} prefilledCert={prefilledCert} resumeName={resumeName} resumeCity={resumeCity} resumeDomain={resumeDomain} />
                ) : null}

                {activeTab === 'heatmap' ? (
                  <div className="glass" style={{ padding: '28px' }}>
                    <Heatmap prefilledCity={resumeCity} prefilledDomain={resumeDomain} certName={prefilledCert} resumeName={resumeName} />
                  </div>
                ) : null}

                {activeTab === 'compare' ? (
                  <div className="glass" style={{ padding: '28px' }}>
                    <CertCompare salary={mode === 'student' ? 4.8 : 8} prefilledCert={prefilledCert} />
                  </div>
                ) : null}

                {activeTab === 'simulate' ? (
                  <div className="glass" style={{ padding: '28px' }}>
                    <CareerSimulator initialSalary={mode === 'student' ? 4.8 : 8} />
                  </div>
                ) : null}

                {activeTab === 'jobmap' ? (
                  <div className="glass" style={{ padding: '28px' }}>
                    <JobCertMap />
                  </div>
                ) : null}

                {activeTab === 'college' ? (
                  <div className="glass" style={{ padding: '28px' }}>
                    <CollegeVsCorporate />
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
// FOOTER
// ─────────────────────────────────────────────────────────
const Footer = function({ onNavigate }) {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '48px 24px 28px', marginTop: 'auto', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '32px', marginBottom: '40px' }} className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,var(--indigo),#4338CA)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={14} color="white" />
              </div>
              <span style={{ fontFamily: FH, fontWeight: '800', fontSize: '16px', color: 'var(--text)', letterSpacing: '-0.01em' }}>
                Certify<span style={{ color: 'var(--indigo)' }}>ROI</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-4)', fontFamily: FB, lineHeight: '1.7', maxWidth: '260px', marginBottom: '16px' }}>
              Data-driven certification ROI decisions for India's tech and finance professionals. Built in Bangalore.
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: FM, opacity: 0.6 }}>
              Data: LinkedIn · NASSCOM · AmbitionBox · Naukri · WEF 2026
            </p>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', fontFamily: FM }}>Tools</div>
            {[
              { id: 'app', label: 'Resume AI',        tab: 'resume'     },
              { id: 'app', label: 'ROI Calculator',   tab: 'calculator' },
              { id: 'app', label: 'City Demand',      tab: 'heatmap'    },
              { id: 'app', label: 'Compare Certs',    tab: 'compare'    },
              { id: 'app', label: 'Career Simulator', tab: 'simulate'   },
              { id: 'app', label: 'Cert to Job Map',  tab: 'jobmap'     },
            ].map(function(l) {
              return (
                <button key={l.label} onClick={function() { onNavigate(l.id) }}
                  style={{ display: 'block', background: 'none', border: 'none', color: 'var(--text-4)', fontSize: '13px', cursor: 'pointer', marginBottom: '8px', fontFamily: FB, padding: 0, textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = 'var(--text)' }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = 'var(--text-4)' }}>
                  {l.label}
                </button>
              )
            })}
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', fontFamily: FM }}>Company</div>
            {['about', 'blog', 'faq', 'contact'].map(function(id) {
              return (
                <button key={id} onClick={function() { onNavigate(id) }}
                  style={{ display: 'block', background: 'none', border: 'none', color: 'var(--text-4)', fontSize: '13px', cursor: 'pointer', marginBottom: '8px', fontFamily: FB, padding: 0, textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = 'var(--text)' }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = 'var(--text-4)' }}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              )
            })}
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', fontFamily: FM }}>Legal</div>
            {['terms', 'privacy'].map(function(id) {
              return (
                <button key={id} onClick={function() { onNavigate(id) }}
                  style={{ display: 'block', background: 'none', border: 'none', color: 'var(--text-4)', fontSize: '13px', cursor: 'pointer', marginBottom: '8px', fontFamily: FB, padding: 0, textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = 'var(--text)' }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = 'var(--text-4)' }}>
                  {id === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
                </button>
              )
            })}
            <div style={{ marginTop: '16px', padding: '10px 12px', borderRadius: '8px', background: 'var(--indigo-dim)', border: '1px solid var(--border-accent)' }}>
              <div style={{ fontSize: '10px', color: 'var(--indigo-light)', fontFamily: FM, marginBottom: '4px' }}>CONTACT</div>
              <a href="mailto:hello@certifyroi.in" style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: FB, textDecoration: 'none' }}>hello@certifyroi.in</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: FB }}>© 2026 CertifyROI. All rights reserved. Not financial advice.</p>
          <p style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: FM, opacity: 0.5 }}>Made with care for India's professionals</p>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────
function AppRoot() {
  const [page,          setPage]          = useState('home')
  const [activeTab,     setActiveTab]     = useState('resume')
  const [mode,          setMode]          = useState('professional')
  const [modeLocked,    setModeLocked]    = useState(false)
  const [prefilledCert, setPrefilledCert] = useState('')
  const [resumeCity,    setResumeCity]    = useState('')
  const [resumeDomain,  setResumeDomain]  = useState('')
  const [resumeName,    setResumeName]    = useState('')

  const navigate = function(pageId) {
    setPage(pageId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToApp = function(tab) {
    setActiveTab(tab || 'resume')
    navigate('app')
  }

  const handleModeSelect = function(id) {
    setMode(id)
    setModeLocked(true)
  }

  const handleModeReset = function() {
    setModeLocked(false)
  }

  const handleCertSelected = function(certName, city, domain, name) {
    setPrefilledCert(certName)
    if (city)   setResumeCity(city)
    if (domain) setResumeDomain(domain)
    if (name)   setResumeName(name)
    setActiveTab('calculator')
  }

  const renderPage = function() {
    if (page === 'home')    return <LandingPage onEnter={function() { goToApp('resume') }} />
    if (page === 'app')     return (
      <AppPage
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mode={mode}
        modeLocked={modeLocked}
        onModeSelect={handleModeSelect}
        onModeReset={handleModeReset}
        onCertSelected={handleCertSelected}
        prefilledCert={prefilledCert}
        resumeCity={resumeCity}
        resumeDomain={resumeDomain}
        resumeName={resumeName}
      />
    )
    if (page === 'blog')    return <BlogPage />
    if (page === 'faq')     return <FAQPage />
    if (page === 'about')   return <AboutPage />
    if (page === 'contact') return <ContactPage />
    if (page === 'terms')   return <TermsPage />
    if (page === 'privacy') return <PrivacyPage />
    return <LandingPage onEnter={function() { goToApp('resume') }} />
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar currentPage={page} activeTab={activeTab} onNavigate={navigate} onTabChange={setActiveTab} />
      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div key={page + activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={T}>
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