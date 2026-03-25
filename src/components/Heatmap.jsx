import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin } from 'lucide-react'
import NeonCard from './NeonCard.jsx'

const PICTON  = '#51B1E7'
const EMERALD = '#10B981'
const AMBER   = '#F59E0B'
const SPRING  = { type: 'spring', stiffness: 400, damping: 30 }

const CITIES = [
  { id: 'bangalore', label: 'Bangalore',  short: 'BLR', icon: '🏙️' },
  { id: 'hyderabad', label: 'Hyderabad',  short: 'HYD', icon: '🏛️' },
  { id: 'pune',      label: 'Pune',       short: 'PNQ', icon: '🎓' },
  { id: 'mumbai',    label: 'Mumbai',     short: 'BOM', icon: '🌊' },
  { id: 'delhi',     label: 'Delhi NCR',  short: 'DEL', icon: '🏛️' },
  { id: 'chennai',   label: 'Chennai',    short: 'MAA', icon: '🌴' },
  { id: 'kolkata',   label: 'Kolkata',    short: 'CCU', icon: '🌉' },
  { id: 'ahmedabad', label: 'Ahmedabad',  short: 'AMD', icon: '🏭' },
]

const CERT_CATEGORIES = [
  { id: 'tech',       label: 'Tech & Cloud',   color: PICTON,    certs: ['AWS SAA', 'Azure', 'GCP', 'CKA', 'CompTIA Sec+', 'CEH'] },
  { id: 'data',       label: 'Data & AI',      color: '#818CF8', certs: ['Google Data Analytics', 'IBM Data Science', 'TensorFlow', 'Tableau'] },
  { id: 'management', label: 'Project Mgmt',   color: EMERALD,   certs: ['PMP', 'Scrum Master', 'PRINCE2'] },
  { id: 'business',   label: 'Business & Ops', color: AMBER,     certs: ['Six Sigma', 'APICS CSCP', 'Google PM'] },
  { id: 'finance',    label: 'Finance',        color: '#34D399', certs: ['CFA Level 1', 'FMVA', 'CPA'] },
  { id: 'marketing',  label: 'Marketing',      color: '#F472B6', certs: ['Google Digital Marketing', 'HubSpot', 'Meta Blueprint'] },
  { id: 'product',    label: 'Product & UX',   color: '#A78BFA', certs: ['Google UX', 'Product Mgmt Cert', 'CSPO'] },
  { id: 'hr',         label: 'HR & People',    color: '#FB923C', certs: ['SHRM-CP', 'HRCI PHR', 'LinkedIn HR'] },
]

const DEMAND = {
  tech:       { bangalore: 5, hyderabad: 5, pune: 5, mumbai: 4, delhi: 4, chennai: 4, kolkata: 3, ahmedabad: 3, insight: 'AWS/Cloud certs drive 35% higher salaries. 2,400+ open roles on Naukri.', yoy: '+34%', avgHike: '35%', topHirers: ['Infosys', 'TCS', 'Wipro', 'Amazon India'] },
  data:       { bangalore: 5, hyderabad: 5, pune: 4, mumbai: 5, delhi: 4, chennai: 4, kolkata: 3, ahmedabad: 3, insight: 'Data Science roles growing fastest in Bangalore and Mumbai. ML engineers command Rs.20L+.', yoy: '+42%', avgHike: '38%', topHirers: ['Flipkart', 'Swiggy', 'Zomato', 'Microsoft'] },
  management: { bangalore: 4, hyderabad: 4, pune: 4, mumbai: 5, delhi: 5, chennai: 3, kolkata: 3, ahmedabad: 4, insight: 'PMP certified PMs earn 30% more. Delhi NCR and Mumbai have highest PM demand.', yoy: '+18%', avgHike: '30%', topHirers: ['Accenture', 'Deloitte', 'KPMG', 'IBM'] },
  business:   { bangalore: 3, hyderabad: 3, pune: 4, mumbai: 4, delhi: 4, chennai: 3, kolkata: 3, ahmedabad: 5, insight: 'Six Sigma and supply chain certs in high demand in manufacturing hubs like Pune and Ahmedabad.', yoy: '+15%', avgHike: '25%', topHirers: ['Mahindra', 'Tata Motors', 'L&T', 'Asian Paints'] },
  finance:    { bangalore: 3, hyderabad: 3, pune: 3, mumbai: 5, delhi: 4, chennai: 3, kolkata: 4, ahmedabad: 4, insight: "CFA Level 1 opens doors in Mumbai's financial district. 1,200+ openings this quarter.", yoy: '+22%', avgHike: '35%', topHirers: ['HDFC', 'ICICI', 'Goldman Sachs', 'JP Morgan'] },
  marketing:  { bangalore: 4, hyderabad: 3, pune: 4, mumbai: 5, delhi: 5, chennai: 3, kolkata: 3, ahmedabad: 3, insight: 'Digital Marketing certs most valued in Delhi NCR and Mumbai. D2C boom driving demand.', yoy: '+28%', avgHike: '22%', topHirers: ['Nykaa', 'Meesho', 'Dentsu', 'WPP India'] },
  product:    { bangalore: 5, hyderabad: 4, pune: 4, mumbai: 4, delhi: 3, chennai: 3, kolkata: 2, ahmedabad: 2, insight: 'Product Management certs most valued in Bangalore startup ecosystem. Rs.25-40L roles.', yoy: '+35%', avgHike: '35%', topHirers: ['PhonePe', 'Razorpay', 'CRED', 'Freshworks'] },
  hr:         { bangalore: 3, hyderabad: 3, pune: 3, mumbai: 4, delhi: 4, chennai: 3, kolkata: 3, ahmedabad: 3, insight: 'SHRM-CP adds 25% to HR salaries. Demand highest in large corporates in Mumbai and Delhi.', yoy: '+12%', avgHike: '25%', topHirers: ['HCL', 'Tech Mahindra', 'Infosys HR', 'Capgemini'] },
}

const LEVEL_CONFIG = {
  5: { label: 'Very High', color: EMERALD,   bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)', bar: '100%' },
  4: { label: 'High',      color: PICTON,    bg: 'rgba(81,177,231,0.1)',  border: 'rgba(81,177,231,0.3)', bar: '80%'  },
  3: { label: 'Medium',    color: AMBER,     bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)', bar: '60%'  },
  2: { label: 'Low',       color: '#64748B', bg: 'rgba(100,116,139,0.08)',border: 'rgba(100,116,139,0.2)',bar: '35%'  },
  1: { label: 'Very Low',  color: '#94A3B8', bg: 'rgba(148,163,184,0.06)',border: 'rgba(148,163,184,0.15)',bar: '15%' },
}

const CITY_ALIASES   = { 'bengaluru': 'bangalore', 'blr': 'bangalore', 'ncr': 'delhi', 'gurgaon': 'delhi', 'gurugram': 'delhi', 'noida': 'delhi', 'faridabad': 'delhi', 'bom': 'mumbai', 'hyd': 'hyderabad', 'pnq': 'pune', 'ccu': 'kolkata', 'maa': 'chennai', 'amd': 'ahmedabad' }
const DOMAIN_ALIASES = { 'cloud': 'tech', 'devops': 'tech', 'security': 'tech', 'backend': 'tech', 'frontend': 'tech', 'ml': 'data', 'ai': 'data', 'analytics': 'data', 'pm': 'management', 'project': 'management', 'scrum': 'management', 'agile': 'management', 'supply chain': 'business', 'operations': 'business', 'ops': 'business', 'banking': 'finance', 'investment': 'finance', 'fintech': 'finance', 'digital marketing': 'marketing', 'seo': 'marketing', 'ux': 'product', 'design': 'product', 'people': 'hr', 'talent': 'hr', 'recruitment': 'hr' }

// ── Demand bar ────────────────────────────────────────────
const DemandBar = ({ level }) => {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG[3]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: '5px', borderRadius: '3px', background: 'var(--border)', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: cfg.bar }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} style={{ height: '100%', borderRadius: '3px', background: cfg.color }} />
      </div>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: cfg.color, minWidth: '54px', textAlign: 'right' }}>{cfg.label}</span>
    </div>
  )
}

// ── City card ─────────────────────────────────────────────
const CityDemandCard = ({ city, domainData }) => {
  const level = domainData[city.id] || 3
  const cfg   = LEVEL_CONFIG[level]
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={SPRING} whileHover={{ y: -3, transition: { duration: 0.18 } }}
      style={{ padding: '14px 16px', borderRadius: '12px', background: cfg.bg, border: '1px solid ' + cfg.border, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
        <span style={{ fontSize: '18px' }}>{city.icon}</span>
        <div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', fontSize: '13px', color: 'var(--text)' }}>{city.label}</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)' }}>{city.short}</div>
        </div>
        <div style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: '6px', background: cfg.color + '18', border: '1px solid ' + cfg.color + '33' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: cfg.color, fontWeight: '700' }}>{level}/5</span>
        </div>
      </div>
      <DemandBar level={level} />
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────
const Heatmap = ({ prefilledCity = '', prefilledDomain = '', certName = '', resumeName = '' }) => {
  const [selectedDomain, setSelectedDomain] = useState('tech')
  const [selectedCity,   setSelectedCity]   = useState('')
  const [autoDetected,   setAutoDetected]   = useState(false)

  const firstName = resumeName ? resumeName.split(' ')[0] : ''

  useEffect(() => {
    if (prefilledCity) {
      const lower   = prefilledCity.toLowerCase()
      const cityKey = CITY_ALIASES[lower] || CITIES.find(c => c.label.toLowerCase().includes(lower))?.id || ''
      if (cityKey) { setSelectedCity(cityKey); setAutoDetected(true) }
    }
    if (prefilledDomain) {
      const lower  = prefilledDomain.toLowerCase()
      const domKey = DOMAIN_ALIASES[lower] || lower
      if (CERT_CATEGORIES.find(c => c.id === domKey)) { setSelectedDomain(domKey); setAutoDetected(true) }
    }
  }, [prefilledCity, prefilledDomain])

  const domainData   = DEMAND[selectedDomain]      || DEMAND.tech
  const categoryInfo = CERT_CATEGORIES.find(c => c.id === selectedDomain) || CERT_CATEGORIES[0]
  const cityDemand   = selectedCity ? (domainData[selectedCity] || 3) : null
  const cityInfo     = CITIES.find(c => c.id === selectedCity)
  const sortedCities = [...CITIES].sort((a, b) => (domainData[b.id] || 0) - (domainData[a.id] || 0))

  const headingText  = firstName ? (firstName.toUpperCase() + "'S CERT DEMAND BY") : 'CERT DEMAND BY'
  const subtitleText = firstName
    ? (firstName + ', here is the demand map for your field across India.')
    : 'Pick a domain and see where demand is highest. Time your job switch right.'

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', background: PICTON + '10', border: '1px solid ' + PICTON + '28', fontSize: '10px', color: PICTON, marginBottom: '10px', letterSpacing: '0.08em', fontFamily: 'JetBrains Mono, monospace' }}>
          <MapPin size={10} /> INDIA DEMAND INTELLIGENCE 2026
        </div>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', color: 'var(--text)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
          {headingText} <span style={{ color: PICTON }}>CITY</span>
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif' }}>{subtitleText}</p>

        {autoDetected && (prefilledCity || prefilledDomain) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}
            style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '9px', background: EMERALD + '0c', border: '1px solid ' + EMERALD + '22', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>🤖</span>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif' }}>
              Auto-detected from your resume:
              {prefilledCity   && <strong style={{ color: PICTON,  marginLeft: '5px' }}>{'📍 ' + prefilledCity}</strong>}
              {prefilledDomain && <strong style={{ color: EMERALD, marginLeft: '5px' }}>{'🎯 ' + (CERT_CATEGORIES.find(c => c.id === selectedDomain)?.label || prefilledDomain)}</strong>}
            </div>
          </motion.div>
        )}
      </div>

      {/* Domain selector */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>SELECT YOUR DOMAIN</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {CERT_CATEGORIES.map(cat => {
            const active = selectedDomain === cat.id
            return (
              <motion.button key={cat.id} onClick={() => setSelectedDomain(cat.id)} whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}
                style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: active ? '700' : '500', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', background: active ? cat.color + '18' : 'var(--surface)', border: '1px solid ' + (active ? cat.color + '44' : 'var(--border)'), color: active ? cat.color : 'var(--text-3)', transition: 'all 0.15s', boxShadow: active ? '0 2px 12px ' + cat.color + '22' : 'none' }}>
                {cat.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Domain insight */}
      <AnimatePresence mode="wait">
        <motion.div key={selectedDomain} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
          <NeonCard color={categoryInfo.color} speed={0.018} borderRadius="12px" style={{ marginBottom: '18px' }}>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: categoryInfo.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>
                    {'DOMAIN OVERVIEW — ' + categoryInfo.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-2)', fontFamily: 'Inter, sans-serif', lineHeight: '1.6', marginBottom: '10px' }}>{domainData.insight}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--text-3)' }}>{'Key certs: ' + categoryInfo.certs.join(' · ')}</div>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: categoryInfo.color, letterSpacing: '-0.03em' }}>{domainData.yoy}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>YoY Growth</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: EMERALD, letterSpacing: '-0.03em' }}>{domainData.avgHike}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avg Hike</div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '7px' }}>TOP HIRERS IN INDIA</div>
                <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                  {domainData.topHirers.map((h, i) => (
                    <span key={i} style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '6px', background: categoryInfo.color + '10', border: '1px solid ' + categoryInfo.color + '22', color: categoryInfo.color, fontFamily: 'JetBrains Mono, monospace' }}>{h}</span>
                  ))}
                </div>
              </div>
            </div>
          </NeonCard>

          {/* Your city highlight */}
          {cityInfo && cityDemand && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={SPRING}
              style={{ marginBottom: '16px', padding: '16px 18px', borderRadius: '12px', background: LEVEL_CONFIG[cityDemand].bg, border: '2px solid ' + LEVEL_CONFIG[cityDemand].color + '44' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '9px' }}>
                <MapPin size={13} color={LEVEL_CONFIG[cityDemand].color} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: LEVEL_CONFIG[cityDemand].color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {firstName ? (firstName.toUpperCase() + "'S CITY — " + cityInfo.label.toUpperCase()) : ('YOUR CITY — ' + cityInfo.label.toUpperCase())}
                </span>
                <div style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: '7px', background: LEVEL_CONFIG[cityDemand].color + '20', border: '1px solid ' + LEVEL_CONFIG[cityDemand].color + '40' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: LEVEL_CONFIG[cityDemand].color, fontWeight: '700' }}>{LEVEL_CONFIG[cityDemand].label + ' Demand'}</span>
                </div>
              </div>
              <DemandBar level={cityDemand} />
              {certName && (
                <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-3)', fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                  <strong style={{ color: LEVEL_CONFIG[cityDemand].color }}>{certName}</strong>
                  {' in ' + cityInfo.label + ': '}
                  <strong style={{ color: LEVEL_CONFIG[cityDemand].color }}>{LEVEL_CONFIG[cityDemand].label.toLowerCase() + ' demand'}</strong>
                  {cityDemand >= 4 ? ' — strong negotiating position for your salary hike.' : cityDemand === 3 ? ' — moderate leverage. Pair with 2 portfolio projects to stand out.' : ' — consider targeting remote roles or Bangalore/Hyderabad opportunities.'}
                </div>
              )}
            </motion.div>
          )}

          {/* City filter pills */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              {selectedCity ? 'FILTERED BY CITY' : 'SELECT YOUR CITY'}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {CITIES.map(city => (
                <button key={city.id} onClick={() => setSelectedCity(selectedCity === city.id ? '' : city.id)}
                  style={{ padding: '5px 11px', borderRadius: '7px', fontSize: '11px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', background: selectedCity === city.id ? PICTON + '14' : 'var(--surface)', border: '1px solid ' + (selectedCity === city.id ? PICTON + '44' : 'var(--border)'), color: selectedCity === city.id ? PICTON : 'var(--text-3)', transition: 'all 0.15s' }}>
                  {city.short}
                </button>
              ))}
              {selectedCity && (
                <button onClick={() => setSelectedCity('')}
                  style={{ padding: '5px 11px', borderRadius: '7px', fontSize: '11px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-4)', transition: 'all 0.15s' }}>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* City grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: '10px', marginBottom: '18px' }}>
            {(selectedCity ? CITIES.filter(c => c.id === selectedCity) : sortedCities).map(city => (
              <div key={city.id} onClick={() => setSelectedCity(selectedCity === city.id ? '' : city.id)} style={{ cursor: 'pointer' }}>
                <CityDemandCard city={city} domainData={domainData} />
              </div>
            ))}
          </div>

          {/* All domains ranked for selected city */}
          {selectedCity && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                {'ALL DOMAINS IN ' + (cityInfo?.label.toUpperCase() || '') + ' — RANKED'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[...CERT_CATEGORIES].sort((a, b) => (DEMAND[b.id]?.[selectedCity] || 0) - (DEMAND[a.id]?.[selectedCity] || 0)).map((cat, i) => {
                  const level  = DEMAND[cat.id]?.[selectedCity] || 3
                  const cfg    = LEVEL_CONFIG[level]
                  const active = selectedDomain === cat.id
                  const medal  = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
                  return (
                    <motion.div key={cat.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.22 }} onClick={() => setSelectedDomain(cat.id)}
                      style={{ padding: '12px 14px', borderRadius: '10px', background: active ? cat.color + '10' : 'var(--surface)', border: '1px solid ' + (active ? cat.color + '33' : 'var(--border)'), cursor: 'pointer', transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '7px' }}>
                        {medal
                          ? <span style={{ fontSize: '13px' }}>{medal}</span>
                          : <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--text-4)', minWidth: '18px' }}>{'#' + (i + 1)}</span>
                        }
                        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '13px', fontWeight: '700', color: active ? cat.color : 'var(--text)', flex: 1 }}>{cat.label}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: cfg.color, padding: '2px 7px', borderRadius: '5px', background: cfg.color + '14' }}>{cfg.label}</span>
                      </div>
                      <DemandBar level={level} />
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Legend */}
          <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'var(--surface)', border: '1px solid var(--border)', marginTop: '18px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>DEMAND SCALE</div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Object.entries(LEVEL_CONFIG).reverse().map(([level, cfg]) => (
                <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-4)' }}>{cfg.label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-4)', fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
              Data: LinkedIn Economic Graph · Naukri Job Index · NASSCOM Report 2026 · AmbitionBox
            </div>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Heatmap