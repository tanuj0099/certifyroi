import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Download, Copy, Check, Linkedin } from 'lucide-react'

const FM = "'JetBrains Mono','Commit Mono',monospace"
const FH = "'Plus Jakarta Sans','Bricolage Grotesque',sans-serif"
const FB = "'Inter',sans-serif"

// ── rounded rect helper ───────────────────────────────────
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ── text wrap helper ──────────────────────────────────────
function wrapLines(ctx, text, maxWidth) {
  var words = text.split(' ')
  var lines = []
  var line  = ''
  words.forEach(function(w) {
    var test = line ? (line + ' ' + w) : w
    if (ctx.measureText(test).width > maxWidth) {
      if (line) lines.push(line)
      line = w
    } else {
      line = test
    }
  })
  if (line) lines.push(line)
  return lines
}

// ── domain display labels ─────────────────────────────────
var DOMAIN_LABELS = {
  tech:          'Cloud & Tech',
  data:          'Data & AI',
  cybersecurity: 'Cybersecurity',
  management:    'Project Mgmt',
  finance:       'Finance',
  marketing:     'Marketing',
  hr:            'HR & People',
  product:       'Product',
  design:        'UX & Design',
  medical:       'Medical',
  law:           'Law & Compliance',
  architecture:  'Architecture',
  engineering:   'Engineering',
  government:    'Govt & PSU',
  mba:           'MBA & Executive',
  business:      'Business & Ops',
}

// ── demand pill colors ────────────────────────────────────
var DEMAND_COLORS = {
  'Very High': '#10B981',
  'High':      '#51B1E7',
  'Medium':    '#F59E0B',
  'Low':       '#94A3B8',
}

// ─────────────────────────────────────────────────────────
// DRAW CARD — pure canvas, 1200×628 (LinkedIn standard)
// No salary data. No numbers. Just cert + domain + demand.
// ─────────────────────────────────────────────────────────
function drawCard(canvas, opts) {
  var certName = opts.certName || 'Your Certification'
  var domain   = opts.domain   || 'tech'
  var demand   = opts.demand   || 'High'
  var isDark   = opts.isDark !== false // default dark

  // Always render dark — LinkedIn card is always dark regardless of site theme
  // (dark card looks far better on LinkedIn's white feed)
  var W = 1200, H = 628, SC = 2
  canvas.width        = W * SC
  canvas.height       = H * SC
  canvas.style.width  = W + 'px'
  canvas.style.height = H + 'px'
  var c = canvas.getContext('2d')
  c.scale(SC, SC)

  // ── Background ───────────────────────────────────────────
  var bgGrad = c.createLinearGradient(0, 0, W, H)
  bgGrad.addColorStop(0,   '#0B1426')
  bgGrad.addColorStop(0.5, '#0E1C35')
  bgGrad.addColorStop(1,   '#080F1E')
  c.fillStyle = bgGrad
  c.fillRect(0, 0, W, H)

  // Dot grid
  c.fillStyle = 'rgba(99,102,241,0.065)'
  for (var xi = 0; xi <= W; xi += 32) {
    for (var yi = 0; yi <= H; yi += 32) {
      c.beginPath()
      c.arc(xi, yi, 1.5, 0, Math.PI * 2)
      c.fill()
    }
  }

  // Radial center glow
  var glow = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 440)
  glow.addColorStop(0,   'rgba(99,102,241,0.07)')
  glow.addColorStop(0.5, 'rgba(16,185,129,0.04)')
  glow.addColorStop(1,   'transparent')
  c.fillStyle = glow
  c.fillRect(0, 0, W, H)

  // ── Top gradient bar (5px) ───────────────────────────────
  var topGrad = c.createLinearGradient(0, 0, W, 0)
  topGrad.addColorStop(0,    '#6366F1')
  topGrad.addColorStop(0.45, '#10B981')
  topGrad.addColorStop(1,    '#51B1E7')
  c.fillStyle = topGrad
  c.fillRect(0, 0, W, 5)

  // ── Logo top-left ────────────────────────────────────────
  // Square icon
  var lgGrad = c.createLinearGradient(44, 34, 82, 72)
  lgGrad.addColorStop(0, '#6366F1')
  lgGrad.addColorStop(1, '#4338CA')
  c.fillStyle = lgGrad
  rr(c, 44, 34, 40, 40, 10)
  c.fill()
  // Arrow up-right inside icon
  c.fillStyle = 'white'
  c.font = 'bold 22px Arial'
  c.textAlign = 'center'
  c.fillText('↗', 64, 62)
  // Brand name
  c.textAlign = 'left'
  c.fillStyle = 'white'
  c.font = 'bold 20px Arial'
  c.fillText('Certify', 94, 62)
  var cw = c.measureText('Certify').width
  c.fillStyle = '#818CF8'
  c.font = 'bold 20px Arial'
  c.fillText('ROI', 94 + cw, 62)

  // ── "INDIA · 2026" badge top-right ───────────────────────
  c.font = '12px "Courier New", monospace'
  var badgeText = 'INDIA · 2026'
  var btw = c.measureText(badgeText).width
  var bPad = 14, bH2 = 28, bW2 = btw + bPad * 2
  var bX = W - bW2 - 44, bY = 34
  c.fillStyle = 'rgba(129,140,248,0.12)'
  rr(c, bX, bY, bW2, bH2, 7)
  c.fill()
  c.strokeStyle = 'rgba(129,140,248,0.28)'
  c.lineWidth = 1
  rr(c, bX, bY, bW2, bH2, 7)
  c.stroke()
  c.fillStyle = '#818CF8'
  c.textAlign = 'center'
  c.fillText(badgeText, bX + bW2 / 2, bY + 18)

  // ── Thin divider under header ────────────────────────────
  c.strokeStyle = 'rgba(255,255,255,0.05)'
  c.lineWidth = 1
  c.beginPath()
  c.moveTo(44, 92)
  c.lineTo(W - 44, 92)
  c.stroke()

  // ── Center vertical midpoint ─────────────────────────────
  var centerY = 316

  // ── Eyebrow label ────────────────────────────────────────
  c.fillStyle = 'rgba(129,140,248,0.7)'
  c.font = '13px "Courier New", monospace'
  c.textAlign = 'center'
  c.fillText('MY 2026 CERTIFICATION MOVE', W / 2, centerY - 116)

  // Eyebrow dot accent
  c.fillStyle = '#6366F1'
  c.beginPath()
  c.arc(W / 2, centerY - 100, 2.5, 0, Math.PI * 2)
  c.fill()

  // ── Cert name — hero element ─────────────────────────────
  var maxCertW = 900
  var certLen  = certName.length
  var certSize = certLen > 42 ? 52 : certLen > 32 ? 62 : certLen > 20 ? 72 : 82
  c.font = 'bold ' + certSize + 'px Arial, sans-serif'
  var certLines = wrapLines(c, certName, maxCertW)
  var lineH     = certSize * 1.18

  // Subtle text glow
  c.shadowColor = 'rgba(99,102,241,0.3)'
  c.shadowBlur  = 24
  c.fillStyle   = '#FFFFFF'
  c.textAlign   = 'center'
  certLines.forEach(function(line, i) {
    c.fillText(line, W / 2, centerY - 44 + i * lineH)
  })
  c.shadowBlur = 0

  var afterCert = centerY - 44 + certLines.length * lineH

  // ── Domain + Demand pills ────────────────────────────────
  var pillY = afterCert + 36
  var domainLabel = DOMAIN_LABELS[domain] || (domain.charAt(0).toUpperCase() + domain.slice(1))
  var demColor    = DEMAND_COLORS[demand] || '#94A3B8'

  c.font = '12px "Courier New", monospace'

  var p1Text = domainLabel.toUpperCase()
  var p2Text = (demand + ' DEMAND').toUpperCase()
  var p1W    = c.measureText(p1Text).width + 28
  var p2W    = c.measureText(p2Text).width + 28
  var gap    = 14
  var totalPW = p1W + p2W + gap
  var p1X    = W / 2 - totalPW / 2
  var p2X    = p1X + p1W + gap
  var pH     = 30, pR = 15

  // Domain pill
  c.fillStyle = 'rgba(99,102,241,0.2)'
  rr(c, p1X, pillY - pH / 2, p1W, pH, pR)
  c.fill()
  c.strokeStyle = 'rgba(99,102,241,0.4)'
  c.lineWidth = 1
  rr(c, p1X, pillY - pH / 2, p1W, pH, pR)
  c.stroke()
  c.fillStyle   = '#818CF8'
  c.textAlign   = 'center'
  c.fillText(p1Text, p1X + p1W / 2, pillY + 5)

  // Demand pill
  c.fillStyle = demColor + '25'
  rr(c, p2X, pillY - pH / 2, p2W, pH, pR)
  c.fill()
  c.strokeStyle = demColor + '50'
  c.lineWidth = 1
  rr(c, p2X, pillY - pH / 2, p2W, pH, pR)
  c.stroke()
  c.fillStyle = demColor
  c.fillText(p2Text, p2X + p2W / 2, pillY + 5)

  // ── Bottom divider ───────────────────────────────────────
  var footerDivY = H - 62
  c.strokeStyle = 'rgba(255,255,255,0.06)'
  c.lineWidth = 1
  c.beginPath()
  c.moveTo(44, footerDivY)
  c.lineTo(W - 44, footerDivY)
  c.stroke()

  // ── Footer left — tagline ────────────────────────────────
  c.fillStyle = 'rgba(148,163,184,0.55)'
  c.font = '14px Arial, sans-serif'
  c.textAlign = 'left'
  c.fillText('Backed by data. Decided with clarity.', 44, H - 30)

  // ── Footer right — URL ───────────────────────────────────
  c.fillStyle = 'rgba(129,140,248,0.8)'
  c.font = 'bold 14px "Courier New", monospace'
  c.textAlign = 'right'
  c.fillText('certifyroi.vercel.app', W - 44, H - 30)

  // ── Corner bracket accents ───────────────────────────────
  var acLen = 44
  var acAlpha = 'rgba(99,102,241,0.18)'
  c.strokeStyle = acAlpha
  c.lineWidth = 1.5
  // top-right
  c.beginPath(); c.moveTo(W - 44, 8);     c.lineTo(W - 44, 8 + acLen);   c.stroke()
  c.beginPath(); c.moveTo(W - 8, 44);     c.lineTo(W - 8 - acLen, 44);   c.stroke()
  // bottom-left
  c.beginPath(); c.moveTo(8, H - 44);     c.lineTo(8 + acLen, H - 44);   c.stroke()
  c.beginPath(); c.moveTo(44, H - 8);     c.lineTo(44, H - 8 - acLen);   c.stroke()
  // top-left subtle
  c.strokeStyle = 'rgba(99,102,241,0.1)'
  c.beginPath(); c.moveTo(44, 8);         c.lineTo(44, 8 + acLen);        c.stroke()
  c.beginPath(); c.moveTo(8, 44);         c.lineTo(8 + acLen, 44);        c.stroke()
}

// ─────────────────────────────────────────────────────────
// SHARE ROI CARD COMPONENT
// ─────────────────────────────────────────────────────────
function ShareROICard({ certName, domain, demand, name }) {
  var canvasRef            = useRef(null)
  var [open,    setOpen]   = useState(false)
  var [drawing, setDrawing] = useState(false)
  var [done,    setDone]   = useState(false)
  var [copied,  setCopied] = useState(false)

  // ── Render ────────────────────────────────────────────────
  var render = useCallback(async function() {
    var canvas = canvasRef.current
    if (!canvas || !certName) return
    setDrawing(true)
    setDone(false)
    try { await document.fonts.ready } catch(_) {}
    await new Promise(function(r) { return setTimeout(r, 120) })
    drawCard(canvas, {
      certName: certName,
      domain:   domain || 'tech',
      demand:   demand || 'High',
      name:     name   || '',
      isDark:   true, // always dark for LinkedIn
    })
    setDrawing(false)
    setDone(true)
  }, [certName, domain, demand, name])

  // ── Open → trigger render after canvas is in DOM ─────────
  useEffect(function() {
    if (!open) return
    var id1 = requestAnimationFrame(function() {
      var id2 = requestAnimationFrame(function() {
        render()
      })
      return function() { cancelAnimationFrame(id2) }
    })
    return function() { cancelAnimationFrame(id1) }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Download PNG ──────────────────────────────────────────
  var download = function() {
    var canvas = canvasRef.current
    if (!canvas || !done) return
    var a = document.createElement('a')
    a.download = 'certifyroi-' + (certName || 'card').replace(/\s+/g, '-').toLowerCase() + '.png'
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  // ── Copy to clipboard ─────────────────────────────────────
  var copyImg = async function() {
    var canvas = canvasRef.current
    if (!canvas || !done) return
    try {
      var blob = await new Promise(function(res, rej) {
        canvas.toBlob(function(b) {
          return b ? res(b) : rej(new Error('blob failed'))
        }, 'image/png')
      })
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true)
      setTimeout(function() { setCopied(false) }, 2500)
    } catch(_) {
      download()
    }
  }

  var toggle = function() {
    var next = !open
    setOpen(next)
    if (!next) { setDone(false); setDrawing(false) }
  }

  if (!certName) return null

  return (
    <div style={{ marginTop: '8px' }}>

      {/* ── Trigger button ───────────────────────────────── */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '11px',
          background: open
            ? 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(16,185,129,0.08))'
            : 'var(--surface)',
          border: '1px solid ' + (open ? 'rgba(99,102,241,0.35)' : 'var(--border)'),
          color: open ? '#818CF8' : 'var(--text-3)',
          fontSize: '13px',
          cursor: 'pointer',
          fontFamily: FH,
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
          letterSpacing: '-0.01em',
        }}
      >
        <div style={{
          width: '26px', height: '26px', borderRadius: '7px',
          background: open ? 'rgba(99,102,241,0.2)' : 'var(--bg)',
          border: '1px solid ' + (open ? 'rgba(99,102,241,0.3)' : 'var(--border)'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.2s',
        }}>
          <Linkedin size={13} color={open ? '#818CF8' : 'var(--text-4)'} />
        </div>
        Share on LinkedIn
        <span style={{
          marginLeft: 'auto',
          fontSize: '10px',
          opacity: 0.5,
          fontFamily: FM,
          letterSpacing: '0.05em',
          fontWeight: '400',
        }}>
          PNG · 1200×628
        </span>
      </motion.button>

      {/* ── Expandable panel ─────────────────────────────── */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{   opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: '12px' }}>

              {/* Loading state */}
              {drawing ? (
                <div style={{
                  height: '120px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  borderRadius: '12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: 20, height: 20, borderRadius: '50%',
                      border: '2px solid rgba(99,102,241,0.5)',
                      borderTopColor: '#6366F1',
                    }}
                  />
                  <span style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: FB }}>
                    Building your card...
                  </span>
                </div>
              ) : null}

              {/* Canvas — always mounted when open so ref is valid */}
              <canvas
                ref={canvasRef}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  display: done ? 'block' : 'none',
                }}
              />

              {/* Dimension label */}
              {done ? (
                <div style={{
                  marginTop: '6px', marginBottom: '10px',
                  fontSize: '10px', color: 'var(--text-4)',
                  fontFamily: FM, textAlign: 'center',
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                }}>
                  LinkedIn post card · 1200 × 628 px
                </div>
              ) : null}

              {/* Action buttons */}
              {done ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <motion.button
                    onClick={download}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      flex: 1, padding: '12px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg,#6366F1,#4338CA)',
                      border: 'none', color: 'white',
                      fontSize: '13px', cursor: 'pointer',
                      fontFamily: FH, fontWeight: '700',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '7px', letterSpacing: '-0.01em',
                    }}
                  >
                    <Download size={14} /> Download PNG
                  </motion.button>

                  <motion.button
                    onClick={copyImg}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      flex: 1, padding: '12px',
                      borderRadius: '10px',
                      background: copied ? 'rgba(16,185,129,0.1)' : 'var(--surface)',
                      border: '1px solid ' + (copied ? 'rgba(16,185,129,0.3)' : 'var(--border)'),
                      color: copied ? '#10B981' : 'var(--text-2)',
                      fontSize: '13px', cursor: 'pointer',
                      fontFamily: FH, fontWeight: '600',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '7px', transition: 'all 0.2s', letterSpacing: '-0.01em',
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Image'}
                  </motion.button>
                </div>
              ) : null}

              {/* LinkedIn tip box */}
              {done ? (
                <div style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.15)',
                }}>
                  <div style={{
                    fontSize: '10px', color: '#818CF8',
                    fontFamily: FM, letterSpacing: '0.08em',
                    textTransform: 'uppercase', marginBottom: '6px',
                  }}>
                    Post tip
                  </div>
                  <div style={{
                    fontSize: '13px', color: 'var(--text-3)',
                    fontFamily: FB, lineHeight: '1.65',
                  }}>
                    Post with a line like{' '}
                    <em style={{ color: 'var(--text-2)', fontStyle: 'normal', fontWeight: '600' }}>
                      "Ran the numbers before deciding. This is my 2026 cert move."
                    </em>
                    {' '}— no numbers, no salary talk. Just looks like a smart decision.
                    Drives curiosity and clicks.
                  </div>
                </div>
              ) : null}

            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

    </div>
  )
}

export default ShareROICard