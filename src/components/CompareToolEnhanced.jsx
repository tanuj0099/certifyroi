// ─────────────────────────────────────────────────────────
// CompareToolEnhanced.jsx — Support 2-4 certs side-by-side
// ─────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, X, Award } from 'lucide-react';
import { CERTIFICATIONS, CERT_DOMAINS } from '../tokens.js';

const FB = "'Inter', sans-serif";
const FM = "'JetBrains Mono', monospace";
const FH = "'Plus Jakarta Sans', sans-serif";

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#E11D48'];

function demandColor(d) {
  return d === 'Very High' ? '#10B981' : d === 'High' ? '#51B1E7' : d === 'Medium' ? '#F59E0B' : '#94A3B8';
}

function CertSelectorCompact({ value, onChange, label, color, onRemove, canRemove }) {
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState('all');
  const wrapRef = useRef(null);

  const filtered = CERTIFICATIONS.filter(c => domain === 'all' || c.domain === domain);
  const selected = CERTIFICATIONS.find(c => c.name === value);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ fontFamily: FM, fontSize: '9px', color: color, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          {label}
        </div>
        {canRemove && (
          <button
            onClick={onRemove}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '0px',
              border: '1px solid ' + color,
              background: 'transparent',
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = color + '15';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: selected ? color + '0e' : 'var(--surface)',
          border: '2px solid ' + (selected ? color + '44' : 'var(--border)'),
          borderRadius: '0px',
          color: selected ? color : 'var(--text-4)',
          fontSize: '13px',
          cursor: 'pointer',
          fontFamily: FH,
          fontWeight: selected ? '700' : '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          transition: 'all 0.18s',
          textAlign: 'left',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.name : 'Pick a cert…'}
        </span>
        <ChevronDown size={13} style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 60,
              marginTop: '6px',
              borderRadius: '0px',
              border: '2px solid ' + color + '33',
              background: 'var(--surface)',
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', gap: '4px', padding: '8px', flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
              {[{ id: 'all', label: 'All' }, ...CERT_DOMAINS.slice(0, 6)].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDomain(d.id)}
                  style={{
                    padding: '3px 9px',
                    borderRadius: '0px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontFamily: FB,
                    fontWeight: '600',
                    background: domain === d.id ? 'var(--indigo-dim)' : 'transparent',
                    border: '1px solid ' + (domain === d.id ? 'var(--border-accent)' : 'var(--border)'),
                    color: domain === d.id ? 'var(--indigo-light)' : 'var(--text-4)',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
              {filtered.map(cert => (
                <button
                  key={cert.id}
                  onClick={() => {
                    onChange(cert.name);
                    setOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: value === cert.name ? color + '12' : 'transparent',
                    border: 'none',
                    color: value === cert.name ? color : 'var(--text-2)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: FB,
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => {
                    if (value !== cert.name) e.currentTarget.style.background = 'var(--surface-high)';
                  }}
                  onMouseLeave={e => {
                    if (value !== cert.name) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cert.name}
                  </span>
                  <span style={{ fontSize: '10px', color: demandColor(cert.demand), fontFamily: FM, flexShrink: 0 }}>
                    +{cert.avgHike}%
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CompareToolEnhanced({ salary = 8 }) {
  const [certs, setCerts] = useState(['AWS Solutions Architect', 'Certified Kubernetes Administrator', '', '']);
  const [activeTab, setActiveTab] = useState('comparison');

  const activeCerts = certs.filter(c => c);
  const selectedCerts = CERTIFICATIONS.filter(c => activeCerts.includes(c.name));

  const handleCertChange = (index, value) => {
    const newCerts = [...certs];
    newCerts[index] = value;
    setCerts(newCerts);
  };

  const handleRemoveCert = (index) => {
    const newCerts = [...certs];
    newCerts[index] = '';
    setCerts(newCerts);
  };

  const handleAddCert = () => {
    if (activeCerts.length < 4 && certs.filter(c => !c).length > 0) {
      // Just click an empty slot
      const emptyIdx = certs.findIndex(c => !c);
      if (emptyIdx !== -1) {
        setCerts(certs);
      }
    }
  };

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Multi-Cert Selector Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {certs.map((cert, idx) => (
          <CertSelectorCompact
            key={idx}
            value={cert}
            onChange={value => handleCertChange(idx, value)}
            label={`Certification ${idx + 1}`}
            color={COLORS[idx]}
            onRemove={() => handleRemoveCert(idx)}
            canRemove={!!cert && activeCerts.length > 2}
          />
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0px', marginBottom: '24px', borderBottom: '2px solid var(--border)' }}>
        {[
          { id: 'comparison', label: 'Side-by-Side Comparison' },
          { id: 'ranking', label: 'Ranking by ROI' },
          { id: 'details', label: 'Full Details' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              color: activeTab === tab.id ? 'var(--text)' : 'var(--text-2)',
              fontFamily: FB,
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? '700' : '500',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : 'none',
              marginBottom: '-2px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text-2)';
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      {activeTab === 'comparison' && selectedCerts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: FB,
              }}
            >
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '700', color: 'var(--text)', fontSize: '12px' }}>
                    Metric
                  </th>
                  {selectedCerts.map((cert, idx) => (
                    <th
                      key={cert.id}
                      style={{
                        padding: '16px 12px',
                        textAlign: 'center',
                        fontWeight: '700',
                        color: COLORS[idx],
                        fontSize: '12px',
                        minWidth: '120px',
                        borderLeft: '1px solid var(--border)',
                      }}
                    >
                      {cert.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Avg Salary Hike', key: 'avgHike', suffix: '%' },
                  { label: 'Market Demand', key: 'demand', render: c => c.demand },
                  { label: 'Cost (USD)', key: 'cost', prefix: '$' },
                  { label: 'Study Time', key: 'monthsToComplete', suffix: ' months' },
                  { label: 'Job Openings', key: 'jobsInIndia', render: c => (c.jobsInIndia || 0).toLocaleString() },
                  { label: 'Best For', key: 'forWho', render: c => c.forWho.substring(0, 40) + '...' },
                ].map((row, rowIdx) => (
                  <tr key={rowIdx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 12px', fontWeight: '600', fontSize: '13px', color: 'var(--text)' }}>
                      {row.label}
                    </td>
                    {selectedCerts.map((cert, colIdx) => (
                      <td
                        key={colIdx}
                        style={{
                          padding: '16px 12px',
                          textAlign: 'center',
                          fontSize: '13px',
                          color: 'var(--text-2)',
                          borderLeft: '1px solid var(--border)',
                          fontWeight: row.key === 'avgHike' ? '700' : '500',
                          color: row.key === 'avgHike' ? demandColor(cert.demand) : 'var(--text-2)',
                        }}
                      >
                        {row.render
                          ? row.render(cert)
                          : (row.prefix || '') + cert[row.key] + (row.suffix || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Ranking by ROI */}
      {activeTab === 'ranking' && selectedCerts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {selectedCerts
              .map((c, idx) => ({ cert: c, idx }))
              .sort((a, b) => b.cert.avgHike - a.cert.avgHike)
              .map((item, rank) => (
                <div
                  key={item.idx}
                  style={{
                    padding: '20px',
                    border: '2px solid ' + COLORS[item.idx],
                    borderRadius: '0px',
                    background: COLORS[item.idx] + '08',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: COLORS[item.idx],
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: FM,
                        fontSize: '14px',
                        fontWeight: '700',
                      }}
                    >
                      #{rank + 1}
                    </div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: COLORS[item.idx] }}>
                      {item.cert.name}
                    </h4>
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-2)' }}>
                    <strong>Avg Hike:</strong> +{item.cert.avgHike}%
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.6 }}>
                    {item.cert.forWho}
                  </p>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {selectedCerts.length === 0 && (
        <div
          style={{
            padding: '48px',
            textAlign: 'center',
            color: 'var(--text-3)',
          }}
        >
          <Award size={40} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p style={{ fontFamily: FB, fontSize: '14px', margin: 0 }}>
            Select 2-4 certifications to compare
          </p>
        </div>
      )}
    </div>
  );
}
