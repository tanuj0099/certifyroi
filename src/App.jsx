import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, FileText, Map, LogIn, LogOut, User,
  Menu, X, Home, Info, Phone, BookOpen,
  Shield, ChevronRight, Sparkles, Mail, FileCheck,
  GraduationCap, Flame, CheckCircle, Brain
} from 'lucide-react'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { ThemeProvider } from './hooks/useTheme.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import LandingPage from './components/LandingPage.jsx'
import ResumeAnalyzer from './components/ResumeAnalyzer.jsx'
import Hero from './components/Hero.jsx'
import Heatmap from './components/Heatmap.jsx'
import ModeSelector from './components/ModeSelector.jsx'
import CollegeVsCorporate from './components/CollegeVsCorporate.jsx'

const T = { duration: 0.32, ease: [0.4, 0, 0.2, 1] }

const headingStyle = {
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  fontWeight: '800',
  letterSpacing: '-0.02em',
  color: 'var(--text)',
  lineHeight: 1.05,
  marginBottom: '24px',
}

// ─────────────────────────────────────────────────────────
// STATIC PAGES
// ─────────────────────────────────────────────────────────
const AboutPage = () => (
  <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 24px 60px' }}>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', borderRadius: '20px', background: 'var(--indigo-dim)', border: '1px solid var(--border-accent)', fontSize: '11px', color: 'var(--indigo-light)', marginBottom: '20px', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono, monospace' }}>
        <Info size={11} /> ABOUT US
      </div>
      <h1 style={{ ...headingStyle, fontSize: 'clamp(2.5rem,6vw,4rem)' }}>
        WHY WE BUILT<br /><span style={{ color: 'var(--indigo)' }}>CERTIFYROI</span>
      </h1>
      <div className="glass" style={{ padding: '32px', marginBottom: '20px' }}>
        <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.8', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
          CertifyROI was born from one frustration: every career site tells you <em style={{ color: 'var(--text)' }}>what</em> certifications exist, but nobody tells you <em style={{ color: 'var(--text)' }}>whether it's worth your money</em>.
        </p>
        <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.8', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
          We built this for three people. The anxious 26-year-old scrolling LinkedIn at 11pm. The ops manager wanting to switch into data. The fresh graduate who just wants their first offer.
        </p>
        <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.8', fontFamily: 'Inter, sans-serif' }}>
          We're a small team of Indian tech professionals who got tired of guessing. So we built the tool we wished existed — data-driven, India-specific, brutally honest.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { icon: '🎯', title: 'Mission',      desc: 'Turn career anxiety into confident, data-backed decisions.' },
          { icon: '📊', title: 'Data Sources', desc: 'LinkedIn Economic Graph, NASSCOM, Naukri, AmbitionBox, WEF 2026.' },
          { icon: '🤖', title: 'AI Engine',    desc: 'Groq llama-3.3-70b — fastest AI inference, under 2 seconds.' },
          { icon: '🇮🇳', title: 'India First', desc: 'Built for professionals across Bangalore, Hyderabad, Pune, Mumbai, Delhi, Chennai.' },
        ].map((c, i) => (
          <div key={i} className="glass" style={{ padding: '20px' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{c.icon}</div>
            <h3 style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '6px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700' }}>{c.title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.6', fontFamily: 'Inter, sans-serif' }}>{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '15px', color: 'var(--text)', marginBottom: '10px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700' }}>Contact</h3>
        <a href="mailto:hello@certifyroi.in" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--indigo-light)', fontSize: '14px', textDecoration: 'none', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>
          <Mail size={14} /> hello@certifyroi.in
        </a>
      </div>
    </motion.div>
  </div>
)

const TermsPage = () => (
  <div style={{ maxWidth: '780px', margin: '0 auto', padding: '100px 24px 60px' }}>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>
      <h1 style={{ ...headingStyle, fontSize: 'clamp(2rem,5vw,3.5rem)' }}>
        TERMS &<br /><span style={{ color: 'var(--indigo)' }}>CONDITIONS</span>
      </h1>
      {[
        { title: '1. Acceptance',              body: 'By using CertifyROI, you agree to these terms. We may update them at any time.' },
        { title: '2. Educational Purpose',     body: 'All ROI projections and salary estimates are approximations for educational purposes only, not financial advice.' },
        { title: '3. AI Disclaimer',           body: 'AI-powered analysis is generated by large language models. Results may be inaccurate. Verify with current market data before making career decisions.' },
        { title: '4. Data & Privacy',          body: 'Resume text is processed in real-time and not stored. We do not sell personal data. See Privacy Policy.' },
        { title: '5. Salary Data',             body: 'Salary figures are sourced from public reports (NASSCOM, LinkedIn, Naukri). These are estimates and may not reflect individual experiences.' },
        { title: '6. Affiliate Links',         body: 'Some cert links are affiliate links. We may earn commission at no extra cost to you. This does not influence recommendations.' },
        { title: '7. Limitation of Liability', body: 'CertifyROI is not liable for career decisions made based on information on this platform.' },
        { title: '8. Contact',                 body: 'Questions? Email hello@certifyroi.in' },
      ].map((s, i) => (
        <div key={i} className="glass" style={{ padding: '20px', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', marginBottom: '6px' }}>{s.title}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', fontFamily: 'Inter, sans-serif' }}>{s.body}</p>
        </div>
      ))}
      <p style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '16px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>Last updated: March 2026</p>
    </motion.div>
  </div>
)

const PrivacyPage = () => (
  <div style={{ maxWidth: '780px', margin: '0 auto', padding: '100px 24px 60px' }}>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>
      <h1 style={{ ...headingStyle, fontSize: 'clamp(2rem,5vw,3.5rem)' }}>
        PRIVACY<br /><span style={{ color: 'var(--indigo)' }}>POLICY</span>
      </h1>
      {[
        { title: 'What we collect',      body: 'Email (if you sign in with Google) and anonymised usage data. We do NOT store resume text — processed in real-time and immediately discarded.' },
        { title: 'How we use your data', body: 'Email for authentication only. No marketing emails unless you opt in. Usage data helps improve the product.' },
        { title: 'Cookies',              body: 'Essential cookies for authentication. localStorage for saving calculator preferences locally. No third-party advertising cookies.' },
        { title: 'Third-party services', body: 'Groq (AI inference — text not stored), Firebase (authentication), Vercel (hosting).' },
        { title: 'Your rights',          body: 'Request deletion at hello@certifyroi.in. Processed within 7 business days.' },
      ].map((s, i) => (
        <div key={i} className="glass" style={{ padding: '20px', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', marginBottom: '6px' }}>{s.title}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: '1.7', fontFamily: 'Inter, sans-serif' }}>{s.body}</p>
        </div>
      ))}
    </motion.div>
  </div>
)

const BLOG_POSTS = [
  { id: 1, tag: 'Cloud',        tagColor: '#6366F1', title: 'Is AWS Solutions Architect Worth It in 2026?',            excerpt: 'With 2,400+ open roles on Naukri and average hikes of 30-40%, AWS SAA remains the highest-ROI cert for Indian engineers. But market saturation is real.',   readTime: '4 min', date: 'Mar 2026', emoji: '☁️', forWho: 'Professional' },
  { id: 2, tag: 'Career Switch', tagColor: '#F59E0B', title: 'From Ops Manager to Data Analyst: A 6-Month Plan',         excerpt: 'Three real people. Three backgrounds. One goal: break into data from operations. What certifications actually bridged the gap.',                           readTime: '6 min', date: 'Feb 2026', emoji: '🔄', forWho: 'Switcher'     },
  { id: 3, tag: 'Student',       tagColor: '#818CF8', title: "Fresher's Guide to First ₹4.8L–6L Offer in India",         excerpt: "No experience. No salary history. But you can get a strong first offer in 5-8 months. Here's exactly which certs and projects worked in 2025-26.",       readTime: '8 min', date: 'Feb 2026', emoji: '🎓', forWho: 'Student'      },
  { id: 4, tag: 'Management',    tagColor: '#10B981', title: 'PMP vs Certified Scrum Master: Which Pays More in India?',  excerpt: 'Both are management certs but target completely different markets. We ran the ROI numbers for Bangalore, Hyderabad, and Delhi NCR.',                   readTime: '5 min', date: 'Jan 2026', emoji: '📋', forWho: 'Professional' },
  { id: 5, tag: 'Career Switch', tagColor: '#F59E0B', title: 'Are Google Career Certificates Worth It in India?',         excerpt: 'Google Data Analytics, PM, UX Design — all under ₹15K. Do Indian employers actually value them? We surveyed 50 hiring managers.',                    readTime: '5 min', date: 'Jan 2026', emoji: '🔍', forWho: 'Switcher'     },
  { id: 6, tag: 'Finance',       tagColor: '#34D399', title: 'Best Finance Certifications for Indian Professionals 2026', excerpt: 'CFA, FMVA, or CPA? We break down which finance cert gives the best ROI for Indian banking and startup finance professionals.',                     readTime: '6 min', date: 'Dec 2025', emoji: '💰', forWho: 'Professional' },
]

const BlogPage = () => {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.forWho === filter)
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 24px 60px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>
        <h1 style={{ ...headingStyle, fontSize: 'clamp(2.5rem,6vw,4rem)' }}>
          THE CERTIFYROI<br /><span style={{ color: 'var(--indigo)' }}>BLOG</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-3)', marginBottom: '28px', fontFamily: 'Inter, sans-serif' }}>Data-driven career guides for Indian tech professionals.</p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {['All', 'Student', 'Switcher', 'Professional'].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '600', transition: 'all 0.18s', background: filter === t ? 'var(--indigo-dim)' : 'var(--surface)', border: `1px solid ${filter === t ? 'var(--border-accent)' : 'var(--border)'}`, color: filter === t ? 'var(--indigo-light)' : 'var(--text-4)' }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
          {filtered.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass"
              style={{ padding: '22px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              whileHover={{ y: -3 }}
              onClick={() => alert(`"${post.title}"\n\nFull post coming soon!`)}>
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{post.emoji}</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: `${post.tagColor}18`, border: `1px solid ${post.tagColor}30`, color: post.tagColor, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono, monospace' }}>{post.tag}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>For: {post.forWho}</span>
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '8px', lineHeight: '1.4', fontFamily: 'Plus Jakarta Sans, sans-serif', flex: 1 }}>{post.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: '1.6', marginBottom: '14px', fontFamily: 'Inter, sans-serif' }}>{post.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>{post.date} · {post.readTime}</span>
                <span style={{ fontSize: '12px', color: 'var(--indigo)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Read <ChevronRight size={12} /></span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

const FAQPage = () => {
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: 'Is CertifyROI free?',                                         a: 'Yes. ROI calculator, heatmap, and city data are free. You get 3 free AI analyses as a guest. Sign in with Google for unlimited free analyses.' },
    { q: 'How accurate are the salary figures?',                        a: 'Sourced from LinkedIn Economic Graph, NASSCOM 2025, Naukri salary reports, and AmbitionBox. Figures are medians — individual results vary by city and company.' },
    { q: 'Is my resume stored anywhere?',                               a: 'No. Resume text is processed in real-time and immediately discarded. Never stored, logged, or shared.' },
    { q: "What's the difference between Resume AI and ROI Calculator?", a: "Resume AI is for discovery — you don't know what cert you need. ROI Calculator is for validation — you know which cert and want to see the financial numbers." },
    { q: 'Why does Student Mode exist?',                                a: "ROI calculators assume you have a salary. Students don't. Student Mode reframes everything around time to first offer and fresher benchmarks." },
    { q: 'Can I use this for non-tech careers?',                        a: 'Yes — Finance (CFA, FMVA), Marketing (Google, HubSpot), HR (SHRM), Product Management, UX Design, Supply Chain (APICS), Business (Six Sigma, PMP) are all covered.' },
    { q: 'Is this only for Bangalore?',                                 a: 'No — CertifyROI covers all major Indian tech cities: Bangalore, Hyderabad, Pune, Mumbai, Delhi NCR, Chennai, Kolkata, and Ahmedabad.' },
    { q: 'Are the hike percentages realistic?',                         a: "These represent what's achievable with a job switch after getting certified. Switching companies typically yields 20-40% more than internal promotions." },
  ]
  return (
    <div style={{ maxWidth: '740px', margin: '0 auto', padding: '100px 24px 60px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>
        <h1 style={{ ...headingStyle, fontSize: 'clamp(2.5rem,6vw,4rem)' }}>
          FREQUENTLY<br /><span style={{ color: 'var(--indigo)' }}>ASKED</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-3)', marginBottom: '28px', fontFamily: 'Inter, sans-serif' }}>Everything you wanted to know.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {faqs.map((faq, i) => (
            <motion.div key={i} className="glass" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{ overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setOpen(open === i ? null : i)}>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: open === i ? 'var(--indigo-light)' : 'var(--text)', lineHeight: '1.4', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{faq.q}</span>
                <ChevronRight size={15} color="var(--text-4)" style={{ flexShrink: 0, transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '0 20px 16px', paddingTop: '12px', fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.7', borderTop: '1px solid var(--border)', fontFamily: 'Inter, sans-serif' }}>{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

const ContactPage = () => {
  const [sent, setSent] = useState(false)
  const [formData, setFormData] = useState({
    name: '', email: '', subject: 'General feedback', message: ''
  })

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in name, email and message')
      return
    }
    try {
      await fetch('https://formspree.io/f/xdapopeg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      setSent(true)
    } catch {
      alert('Failed to send. Email us directly at hello@certifyroi.in')
    }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '10px', color: 'var(--text)',
    fontSize: '14px', fontFamily: 'Inter, sans-serif',
    outline: 'none', transition: 'border-color 0.2s',
  }
  const labelStyle = {
    fontSize: '12px', color: 'var(--text-3)', display: 'block',
    marginBottom: '6px', textTransform: 'uppercase',
    letterSpacing: '0.08em', fontFamily: 'JetBrains Mono, monospace',
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '100px 24px 60px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={T}>
        <h1 style={{ ...headingStyle, fontSize: 'clamp(2.5rem,6vw,4rem)' }}>
          CONTACT<br /><span style={{ color: 'var(--indigo)' }}>US</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-3)', marginBottom: '28px', fontFamily: 'Inter, sans-serif' }}>
          Feedback, partnerships, bug reports, or just saying hi.
        </p>
        {sent ? (
          <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text)', marginBottom: '6px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800' }}>Message Sent!</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif' }}>We will reply within 48 hours.</p>
          </div>
        ) : (
          <div className="glass" style={{ padding: '28px' }}>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Name</label>
              <input type="text" placeholder="Your name" value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" placeholder="you@email.com" value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Subject</label>
              <select value={formData.subject}
                onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                style={{ ...inputStyle, background: 'var(--surface)' }}>
                <option>General feedback</option>
                <option>Bug report</option>
                <option>Partnership / B2B</option>
                <option>Data correction</option>
                <option>Press enquiry</option>
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Message</label>
              <textarea rows={4} placeholder="Tell us what's on your mind..."
                value={formData.message}
                onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={handleSubmit}>
              Send Message
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
// ─────────────────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: 'home',    label: 'Home',    icon: Home       },
  { id: 'app',     label: 'Tools',   icon: TrendingUp },
  { id: 'blog',    label: 'Blog',    icon: BookOpen   },
  { id: 'faq',     label: 'FAQ',     icon: Sparkles   },
  { id: 'about',   label: 'About',   icon: Info       },
  { id: 'contact', label: 'Contact', icon: Phone      },
]

const APP_TABS = [
  { id: 'resume',     label: 'Step 1 · Find Cert',  icon: FileText,      desc: 'Upload resume → AI picks your cert'      },
  { id: 'calculator', label: 'Step 2 · ROI',         icon: TrendingUp,    desc: 'Break-even, 5yr gain, Ghost of Inaction' },
  { id: 'heatmap',    label: 'Step 3 · City',        icon: Map,           desc: 'Is this cert hot in your city?'          },
  { id: 'college',    label: 'Degree vs Certs',      icon: GraduationCap, desc: 'MBA vs 4 certifications — numbers'       },
]

const HAMBURGER_FEATURES = [
  { icon: Brain,       color: '#6366F1', label: 'AI Loading States', desc: 'Live progress while AI thinks'    },
  { icon: Flame,       color: '#F59E0B', label: 'Progress Tracker',  desc: 'Daily module burn rate + streak'  },
  { icon: Mail,        color: '#818CF8', label: 'Pitch Your Boss',   desc: 'Get company to pay for your cert' },
  { icon: CheckCircle, color: '#10B981', label: 'Verify Real Hike',  desc: 'Submit your actual outcome'       },
]

// ─────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────
const NavBar = ({ currentPage, activeTab, onNavigate, onTabChange }) => {
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const { user, signInGoogle, signOut, loading } = useAuth()

  const go = (id) => { onNavigate(id); setMenuOpen(false) }

  const handleSignIn = async () => {
    setSigningIn(true)
    try { await signInGoogle() } catch {}
    setSigningIn(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={T}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        <div className="subtabs" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 12px', display: 'flex', justifyContent: 'center', height: '48px', alignItems: 'stretch', overflowX: 'auto', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '58px', gap: '4px' }}>

            {/* Logo */}
            <button
              onClick={() => go('home')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, padding: 0, marginRight: '4px' }}
            >
              <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, var(--indigo), #4338CA)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={15} color="white" />
              </div>
              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '17px', letterSpacing: '-0.02em', color: 'var(--text)' }}>
                Certify<span style={{ color: 'var(--indigo)' }}>ROI</span>
              </span>
            </button>

            {/* Desktop nav — centered, hidden on mobile via CSS */}
            <nav className="desktop-nav" style={{ display: 'flex', gap: '2px', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {NAV_LINKS.map(link => {
                const isActive = currentPage === link.id
                return (
                  <button
                    key={link.id}
                    onClick={() => go(link.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '6px 13px', borderRadius: '8px',
                      border: `1px solid ${isActive ? 'var(--border-accent)' : 'transparent'}`,
                      background: isActive ? 'var(--indigo-dim)' : 'transparent',
                      color: isActive ? 'var(--indigo-light)' : 'var(--text-4)',
                      fontSize: '13px', fontWeight: isActive ? '700' : '500',
                      cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
                      whiteSpace: 'nowrap', transition: 'all 0.18s',
                      flexShrink: 0, letterSpacing: '-0.01em',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.border = '1px solid var(--border)' }}}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-4)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.border = '1px solid transparent' }}}
                  >
                    <link.icon size={12} />
                    {link.label}
                  </button>
                )
              })}
            </nav>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: 'auto' }} className="right-nav">
              {!loading && (
                user ? (
                  <>
                    {user.photoURL
                      ? <img src={user.photoURL} alt="" style={{ width: '26px', height: '26px', borderRadius: '50%', border: '2px solid var(--border-accent)' }} />
                      : <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--indigo), var(--emerald))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={12} color="white" /></div>
                    }
                    <button onClick={signOut} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '7px', color: '#EF4444', fontSize: '11px', padding: '4px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
  <LogOut size={11} /><span className="signout-text">Sign out</span>
</button>
                  </>
                ) : (
                  <button
  onClick={handleSignIn}
  disabled={signingIn}
  title={!import.meta.env.VITE_FIREBASE_API_KEY ? 'Sign-in requires Firebase setup' : ''}
  style={{ display: 'flex', opacity: !import.meta.env.VITE_FIREBASE_API_KEY ? 0.4 : 1, background: 'var(--indigo)', border: 'none', borderRadius: '7px', padding: '6px 10px', cursor: !import.meta.env.VITE_FIREBASE_API_KEY ? 'not-allowed' : 'pointer', color: 'white', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}
                  >
                    <LogIn size={12} /><span className="signin-text">{signingIn ? '...' : 'Sign in'}</span>
                  </button>
                )
              )}
              <ThemeToggle />
              <button
                onClick={() => setMenuOpen(v => !v)}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '7px', padding: '6px', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', transition: 'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--text)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-3)' }}
              >
                {menuOpen ? <X size={15} /> : <Menu size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Sub-tabs for app page */}
        {currentPage === 'app' && (
          <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div className="subtabs" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 12px', display: 'flex', justifyContent: 'center', height: '48px', alignItems: 'stretch', overflowX: 'auto', gap: '2px' }}>
              {APP_TABS.map(tab => {
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '7px',
                      padding: '0 18px',
                      background: active ? 'var(--indigo-dim)' : 'transparent',
                      border: 'none',
                      borderBottom: `3px solid ${active ? 'var(--indigo)' : 'transparent'}`,
                      borderRadius: active ? '8px 8px 0 0' : '0',
                      color: active ? 'var(--indigo-light)' : 'var(--text-3)',
                      fontSize: '13px', fontWeight: active ? '700' : '500',
                      cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
                      transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
                      letterSpacing: '-0.01em',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--surface)' }}}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent' }}}
                  >
                    <tab.icon size={13} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </motion.header>

      {/* Hamburger dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: currentPage === 'app' ? '106px' : '58px',
              left: 0, right: 0, zIndex: 99,
              background: 'var(--bg)',
              borderBottom: '1px solid var(--border)',
              padding: '20px',
            }}
          >
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

              <div style={{ fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', fontFamily: 'JetBrains Mono, monospace' }}>
                Tools — Follow This Order
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '8px', marginBottom: '20px' }}>
                {APP_TABS.map(tab => {
                  const isActive = activeTab === tab.id && currentPage === 'app'
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { go('app'); onTabChange(tab.id) }}
                      style={{ padding: '14px 12px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', background: isActive ? 'var(--indigo-dim)' : 'var(--surface)', border: `1px solid ${isActive ? 'var(--border-accent)' : 'var(--border)'}`, transition: 'all 0.18s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)' }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border)' }}
                    >
                      <tab.icon size={16} color="var(--indigo)" style={{ marginBottom: '6px', display: 'block' }} />
                      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text)', marginBottom: '2px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{tab.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>{tab.desc}</div>
                    </button>
                  )
                })}
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', fontFamily: 'JetBrains Mono, monospace' }}>
                ROI Calculator Features
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '8px', marginBottom: '20px' }}>
                {HAMBURGER_FEATURES.map((f, i) => (
                  <div
                    key={i}
                    onClick={() => { go('app'); onTabChange('calculator') }}
                    style={{ padding: '14px 12px', borderRadius: '10px', background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.18s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
                  >
                    <f.icon size={16} color={f.color} style={{ marginBottom: '6px', display: 'block' }} />
                    <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text)', marginBottom: '2px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{f.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>{f.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', fontFamily: 'JetBrains Mono, monospace' }}>
                Pages
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))', gap: '6px' }}>
                {[
                  { id: 'blog',    label: 'Blog',    icon: BookOpen  },
                  { id: 'faq',     label: 'FAQ',     icon: Sparkles  },
                  { id: 'about',   label: 'About',   icon: Info      },
                  { id: 'contact', label: 'Contact', icon: Phone     },
                  { id: 'terms',   label: 'Terms',   icon: FileCheck },
                  { id: 'privacy', label: 'Privacy', icon: Shield    },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--text-2)', fontSize: '12px', fontFamily: 'Inter, sans-serif', transition: 'all 0.18s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--indigo-light)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
                  >
                    <item.icon size={12} color="var(--text-4)" />{item.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─────────────────────────────────────────────────────────
// APP PAGE
// ─────────────────────────────────────────────────────────
const AppPage = ({ activeTab, onTabChange, mode, onModeChange, onCertSelected, prefilledCert, resumeCity, resumeDomain, resumeName }) => {

  const banners = {
    resume: {
      color: 'var(--indigo-light)',
      bg: 'var(--indigo-dim)',
      border: 'var(--border-accent)',
      icon: FileText,
      title: 'Step 1 — Find Your Cert',
      body: "Don't know which cert? Upload your resume. AI reads your skills, goal, and domain — recommends top 3 with one ",
      bold: 'Primary Move.',
      sub: 'Click any cert to jump to Step 2 pre-filled.',
    },
    calculator: {
      color: 'var(--emerald-light)',
      bg: 'rgba(16,185,129,0.06)',
      border: 'rgba(16,185,129,0.2)',
      icon: TrendingUp,
      title: 'Step 2 — Calculate ROI',
      body: 'Know which cert you want? Enter salary, cost, hike. See your ',
      bold: 'break-even date, 5-year gain, and Ghost of Inaction cost.',
      sub: 'After AI analysis: Pitch My Boss, Track Progress, Verify Real Hike.',
    },
    heatmap: {
      color: 'var(--amber)',
      bg: 'rgba(245,158,11,0.06)',
      border: 'rgba(245,158,11,0.2)',
      icon: Map,
      title: 'Step 3 — Check City Demand',
      body: 'See demand across 8 Indian cities. ',
      bold: 'High demand = more leverage negotiating your hike.',
      sub: null,
    },
    college: {
      color: 'var(--indigo-light)',
      bg: 'var(--indigo-dim)',
      border: 'var(--border-accent)',
      icon: GraduationCap,
      title: 'Degree vs Certifications',
      body: 'MBA or 4 certs? Run the actual numbers — cost, opportunity cost, 5-year earnings. ',
      bold: 'Data over family pressure.',
      sub: null,
    },
  }

  const b = banners[activeTab]
  const maxWidth = activeTab === 'resume' ? '720px' : activeTab === 'college' ? '900px' : activeTab === 'heatmap' ? '1000px' : '1100px'

  return (
    <div style={{ paddingTop: '110px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 20px 0' }}>
        <ModeSelector activeMode={mode} onChange={(newMode) => {
  onModeChange(newMode)
  // Switching to student mode auto-sets context
}} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={T}
        >
          <div style={{ maxWidth, margin: '0 auto', padding: '0 20px 60px' }}>

            {b && (
  <div className="app-banner" style={{ marginBottom: '20px', padding: '14px 16px', borderRadius: '12px', background: b.bg, border: `1px solid ${b.border}`, transition: 'background 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <b.icon size={15} color={b.color} />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: b.color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{b.title}</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.65', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                  {b.body}<strong style={{ color: 'var(--text)' }}>{b.bold}</strong>
                  {b.sub && <span style={{ color: 'var(--text-3)', display: 'block', marginTop: '4px', fontSize: '13px' }}>{b.sub}</span>}
                </p>
              </div>
            )}

            {activeTab === 'resume' && (
              <div className="glass" style={{ padding: '28px' }}>
                <ResumeAnalyzer
                  mode={mode}
                  onCertSelected={(certName, city, domain, name) => {
                    onCertSelected(certName, city, domain, name)
                  }}
                />
              </div>
            )}

            {activeTab === 'calculator' && (
              <Hero mode={mode} prefilledCert={prefilledCert} resumeName={resumeName} />
            )}

            {activeTab === 'heatmap' && (
              <div className="glass" style={{ padding: '28px' }}>
                <Heatmap
                  prefilledCity={resumeCity}
                  prefilledDomain={resumeDomain}
                  certName={prefilledCert}
                  resumeName={resumeName}
                />
              </div>
            )}

            {activeTab === 'college' && (
              <div className="glass" style={{ padding: '28px' }}>
                <CollegeVsCorporate />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────
const Footer = ({ onNavigate }) => (
  <footer style={{ borderTop: '1px solid var(--border)', padding: '36px 24px 20px', marginTop: 'auto' }}>
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '28px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
            <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, var(--indigo), #4338CA)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={13} color="white" />
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '16px', color: 'var(--text)', letterSpacing: '-0.01em' }}>
              Certify<span style={{ color: 'var(--indigo)' }}>ROI</span>
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-4)', lineHeight: '1.7', fontFamily: 'Inter, sans-serif' }}>
            Data-driven cert decisions for India's tech professionals.
          </p>
        </div>

        {[
          { title: 'Tools',   links: [{ id: 'app', label: 'Resume AI' }, { id: 'app', label: 'ROI Calculator' }, { id: 'app', label: 'City Heatmap' }, { id: 'app', label: 'Degree vs Certs' }] },
          { title: 'Company', links: [{ id: 'about', label: 'About' }, { id: 'blog', label: 'Blog' }, { id: 'contact', label: 'Contact' }, { id: 'faq', label: 'FAQ' }] },
          { title: 'Legal',   links: [{ id: 'terms', label: 'Terms & Conditions' }, { id: 'privacy', label: 'Privacy Policy' }] },
        ].map((col, i) => (
          <div key={i}>
            <div style={{ fontSize: '10px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontFamily: 'JetBrains Mono, monospace' }}>{col.title}</div>
            {col.links.map(l => (
              <button
                key={l.label}
                onClick={() => onNavigate(l.id)}
                style={{ display: 'block', background: 'none', border: 'none', color: 'var(--text-4)', fontSize: '13px', cursor: 'pointer', marginBottom: '6px', fontFamily: 'Inter, sans-serif', padding: 0, textAlign: 'left', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-4)'}
              >
                {l.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif' }}>
          © 2026 CertifyROI · Powered by Advanced AI · Built for India's Tech Professionals
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-4)', opacity: 0.5, fontFamily: 'Inter, sans-serif' }}>
          Data: LinkedIn · NASSCOM · AmbitionBox · Naukri · WEF 2026
        </p>
      </div>
    </div>
  </footer>
)

// ─────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────
function AppRoot() {
  const [page,          setPage]          = useState('home')
  const [activeTab,     setActiveTab]     = useState('resume')
  const [mode,          setMode]          = useState('professional')
  const [prefilledCert, setPrefilledCert] = useState('')
  const [resumeCity,    setResumeCity]    = useState('')
  const [resumeDomain,  setResumeDomain]  = useState('')
  const [resumeName,    setResumeName]    = useState('')

  const navigate = (pageId) => {
    setPage(pageId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToApp = (tab = 'resume') => {
    setActiveTab(tab)
    navigate('app')
  }

  const handleCertSelected = (certName, city = '', domain = '', name = '') => {
    setPrefilledCert(certName)
    if (city)   setResumeCity(city)
    if (domain) setResumeDomain(domain)
    if (name)   setResumeName(name)
    setActiveTab('calculator')
  }

  const renderPage = () => {
    switch (page) {
      case 'home':    return <LandingPage onEnter={() => goToApp('resume')} />
      case 'app':     return <AppPage activeTab={activeTab} onTabChange={setActiveTab} mode={mode} onModeChange={setMode} onCertSelected={handleCertSelected} prefilledCert={prefilledCert} resumeCity={resumeCity} resumeDomain={resumeDomain} resumeName={resumeName} />
      case 'blog':    return <BlogPage />
      case 'faq':     return <FAQPage />
      case 'about':   return <AboutPage />
      case 'contact': return <ContactPage />
      case 'terms':   return <TermsPage />
      case 'privacy': return <PrivacyPage />
      default:        return <LandingPage onEnter={() => goToApp('resume')} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'color 0.3s ease' }}>
      <NavBar
        currentPage={page}
        activeTab={activeTab}
        onNavigate={navigate}
        onTabChange={setActiveTab}
      />
      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
  key={page + activeTab}
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -6 }}
  transition={T}
  style={{ willChange: page === 'home' ? 'auto' : 'transform, opacity' }}
>
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