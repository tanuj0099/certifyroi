import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Share2, Download, Copy, Check } from 'lucide-react'

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

function drawCard(canvas, p) {
  const W = 800, H = 420, SC = 2
  canvas.width  = W * SC
  canvas.height = H * SC
  canvas.style.width  = W + 'px'
  canvas.style.height = H + 'px'
  const c = canvas.getContext('2d')
  c.scale(SC, SC)

  const dk = p.isDark
  const bg = dk ? '#0B0E14' : '#F0EDE8'
  const sf = dk ? '#121826' : '#FFFFFF'
  const bd = dk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)'
  const t1 = dk ? '#F8FAFC' : '#0F172A'
  const t3 = dk ? '#94A3B8' : '#475569'
  const t4 = dk ? '#64748B' : '#94A3B8'

  // bg
  c.fillStyle = bg
  c.fillRect(0, 0, W, H)

  // dots
  c.fillStyle = dk ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.07)'
  for (let xi = 0; xi < W; xi += 28)
    for (let yi = 0; yi < H; yi += 28) {
      c.beginPath(); c.arc(xi, yi, 1, 0, Math.PI * 2); c.fill()
    }

  // card surface
  c.fillStyle = sf; rr(c, 24, 24, W-48, H-48, 18); c.fill()
  c.strokeStyle = bd; c.lineWidth = 1.5; rr(c, 24, 24, W-48, H-48, 18); c.stroke()

  // gradient top line
  const gl = c.createLinearGradient(80, 24, W-80, 24)
  gl.addColorStop(0, '#6366F1'); gl.addColorStop(0.5, '#10B981'); gl.addColorStop(1, '#51B1E7')
  c.strokeStyle = gl; c.lineWidth = 3
  c.beginPath(); c.moveTo(80, 25.5); c.lineTo(W-80, 25.5); c.stroke()

  // logo box
  c.fillStyle = '#6366F1'; rr(c, 44, 44, 26, 26, 7); c.fill()
  c.fillStyle = '#fff'; c.font = 'bold 14px Arial'; c.textAlign = 'center'
  c.fillText('↗', 57, 62)

  // brand name
  c.fillStyle = t1; c.font = 'bold 15px Arial'; c.textAlign = 'left'
  c.fillText('CertifyROI', 78, 62)

  // person + date
  c.fillStyle = t4; c.font = '12px Arial'; c.textAlign = 'right'
  c.fillText(p.name ? p.name + ' · India 2026' : 'India 2026', W - 44, 62)

  // cert name
  const cn = p.certName || 'Your Certification'
  const fs = cn.length > 35 ? 20 : cn.length > 25 ? 24 : 28
  c.fillStyle = t1; c.font = 'bold ' + fs + 'px Arial'; c.textAlign = 'left'
  c.fillText(cn, 44, 115)

  // divider
  c.strokeStyle = dk ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'; c.lineWidth = 1
  c.beginPath(); c.moveTo(44, 132); c.lineTo(W-44, 132); c.stroke()

  // 4 stat boxes
  const stats = [
    { l: 'NEW SALARY',  v: '₹' + (p.newSalary    || 0) + 'L/yr',   col: '#51B1E7' },
    { l: 'BREAK-EVEN',  v: (p.breakEven     || 0) + ' months',      col: '#F59E0B' },
    { l: '5-YEAR GAIN', v: '₹' + (p.fiveYearGain || 0) + 'L',      col: '#10B981' },
    { l: 'MONTHLY +',   v: '₹' + (p.monthlyGain  || 0) + 'K',      col: '#818CF8' },
  ]
  const bW = (W - 88 - 30) / 4
  const bH = 88, bY = 150
  stats.forEach((s, i) => {
    const bX = 44 + i * (bW + 10)
    c.fillStyle = s.col + '12'; rr(c, bX, bY, bW, bH, 10); c.fill()
    c.strokeStyle = s.col + '28'; c.lineWidth = 1; rr(c, bX, bY, bW, bH, 10); c.stroke()
    c.fillStyle = t4; c.font = '9px Arial'; c.textAlign = 'center'
    c.fillText(s.l, bX + bW / 2, bY + 17)
    c.fillStyle = s.col; c.font = 'bold ' + (s.v.length > 8 ? 15 : 19) + 'px Arial'
    c.fillText(s.v, bX + bW / 2, bY + 54)
  })

  // ROI bar
  const barY = 265, barW = W - 88
  c.fillStyle = dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'
  rr(c, 44, barY, barW, 10, 5); c.fill()
  const pct = Math.min((p.roiPercent || 0) / 800, 1)
  if (pct > 0) {
    const bg2 = c.createLinearGradient(44, barY, 44 + barW * pct, barY)
    bg2.addColorStop(0, '#6366F1'); bg2.addColorStop(1, '#10B981')
    c.fillStyle = bg2; rr(c, 44, barY, barW * pct, 10, 5); c.fill()
  }
  c.fillStyle = t3; c.font = '13px Arial'; c.textAlign = 'left'
  c.fillText((p.roiPercent || 0) + '% return on investment over 5 years', 44, barY + 28)

  // tags
  const tags = ['India-specific', 'Groq AI Verified', 'Naukri Data 2026']
  let tx = 44
  c.font = '10px Arial'
  tags.forEach(tag => {
    const tw = c.measureText(tag).width + 20
    c.fillStyle = dk ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.07)'
    rr(c, tx, barY + 40, tw, 20, 5); c.fill()
    c.strokeStyle = 'rgba(99,102,241,0.2)'; c.lineWidth = 0.8
    rr(c, tx, barY + 40, tw, 20, 5); c.stroke()
    c.fillStyle = '#6366F1'; c.textAlign = 'center'
    c.fillText(tag, tx + tw / 2, barY + 54)
    tx += tw + 8
  })

  // footer
  c.fillStyle = t4; c.font = '10px Arial'; c.textAlign = 'center'
  c.fillText("certifyroi.vercel.app · Made for India's Tech Professionals", W / 2, H - 30)
}

export default function ShareROICard({ certName, name, breakEven, fiveYearGain, monthlyGain, roiPercent, newSalary }) {
  const canvasRef             = useRef(null)
  const [open,    setOpen]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [copied,  setCopied]  = useState(false)
  const drawnRef              = useRef(false)

  const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light'

  const render = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawnRef.current = false
    setLoading(true)
    setDone(false)
    try { await document.fonts.ready } catch (_) {}
    await new Promise(r => setTimeout(r, 150))
    drawCard(canvas, {
      certName, name, breakEven, fiveYearGain,
      monthlyGain, roiPercent, newSalary,
      isDark: isDark(),
    })
    drawnRef.current = true
    setLoading(false)
    setDone(true)
  }, [certName, name, breakEven, fiveYearGain, monthlyGain, roiPercent, newSalary])

  // This effect fires once the canvas element is actually in the DOM
  // canvasRef.current is guaranteed non-null when open === true and canvas is rendered
  useEffect(() => {
    if (!open) return
    // Use requestAnimationFrame to ensure the canvas has painted
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => render())
    })
    return () => cancelAnimationFrame(id)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-render when theme changes
  useEffect(() => {
    if (!open || !done) return
    const obs = new MutationObserver(() => render())
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [open, done, render])

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (!next) { setDone(false); setLoading(false) }
  }

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas || !done) return
    const a = document.createElement('a')
    a.download = 'certifyroi-' + (certName || 'roi').replace(/\s+/g, '-').toLowerCase() + '.png'
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  const copyImg = async () => {
    const canvas = canvasRef.current
    if (!canvas || !done) return
    try {
      const blob = await new Promise((res, rej) =>
        canvas.toBlob(b => b ? res(b) : rej(new Error('blob failed')), 'image/png')
      )
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { download() }
  }

  if (!certName) return null

  return (
    <div style={{ marginTop: '8px' }}>
      <button onClick={toggle}
        style={{ width: '100%', padding: '9px 14px', borderRadius: '9px', background: open ? 'rgba(81,177,231,0.1)' : 'var(--surface)', border: '1px solid ' + (open ? 'rgba(81,177,231,0.3)' : 'var(--border)'), color: open ? '#51B1E7' : 'var(--text-3)', fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.18s' }}>
        <Share2 size={13} />
        Share My ROI Card
        <span style={{ marginLeft: 'auto', fontSize: '10px', opacity: 0.6 }}>save as image</span>
      </button>

      {open && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '10px' }}>

          {loading && !done && (
            <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--indigo)', borderTopColor: 'transparent' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: "'Inter',sans-serif" }}>Rendering card...</span>
            </div>
          )}

          {/* Canvas always mounted when open so ref attaches — hidden until drawn */}
          <canvas ref={canvasRef}
            style={{ width: '100%', height: 'auto', borderRadius: '12px', border: '1px solid var(--border)', display: done ? 'block' : 'none' }}
          />

          {done && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <motion.button onClick={download} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg,#51B1E7,#3B8CC7)', border: 'none', color: 'white', fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Download size={13} /> Download PNG
              </motion.button>
              <motion.button onClick={copyImg} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', background: copied ? 'rgba(16,185,129,0.1)' : 'var(--surface)', border: '1px solid ' + (copied ? 'rgba(16,185,129,0.3)' : 'var(--border)'), color: copied ? '#10B981' : 'var(--text-2)', fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy Image'}
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}