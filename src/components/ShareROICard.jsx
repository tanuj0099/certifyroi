import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Share2, Download, Copy, Check } from 'lucide-react'

const F_HEAD = "'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif"
const F_MONO = "'Commit Mono', 'JetBrains Mono', monospace"

// Draws the ROI card onto a canvas and returns a data URL
const drawCard = (canvas, { certName, name, breakEven, fiveYearGain, monthlyGain, roiPercent, newSalary, isDark }) => {
  const W = 600, H = 340
  canvas.width  = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  const bg      = isDark ? '#0B0E14' : '#F0EDE8'
  const surface = isDark ? '#121826' : '#FFFFFF'
  const border  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)'
  const text1   = isDark ? '#F8FAFC' : '#0F172A'
  const text3   = isDark ? '#94A3B8' : '#334155'
  const text4   = isDark ? '#64748B' : '#64748B'
  const indigo  = '#6366F1'
  const emerald = '#10B981'
  const amber   = '#F59E0B'
  const picton  = '#51B1E7'

  // Background
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Surface card
  ctx.fillStyle = surface
  roundRect(ctx, 20, 20, W - 40, H - 40, 16)
  ctx.fill()

  // Border
  ctx.strokeStyle = border
  ctx.lineWidth = 1
  roundRect(ctx, 20, 20, W - 40, H - 40, 16)
  ctx.stroke()

  // Top accent line gradient
  const grad = ctx.createLinearGradient(20, 20, W - 20, 20)
  grad.addColorStop(0,   indigo)
  grad.addColorStop(0.5, emerald)
  grad.addColorStop(1,   picton)
  ctx.strokeStyle = grad
  ctx.lineWidth   = 2.5
  ctx.beginPath()
  ctx.moveTo(60, 21)
  ctx.lineTo(W - 60, 21)
  ctx.stroke()

  // Logo
  ctx.fillStyle = indigo
  roundRect(ctx, 36, 36, 22, 22, 6)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 11px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('↗', 47, 52)

  // Title
  ctx.fillStyle = text1
  ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('CertifyROI', 66, 53)

  // Person name
  if (name) {
    ctx.fillStyle = text3
    ctx.font = '12px Inter, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(name, W - 36, 53)
  }

  // Cert name
  ctx.fillStyle = text1
  ctx.font = `bold ${certName.length > 30 ? 20 : 24}px Plus Jakarta Sans, sans-serif`
  ctx.textAlign = 'left'
  ctx.fillText(certName, 36, 102)

  // Stat boxes
  const stats = [
    { label: 'NEW SALARY',   value: `₹${newSalary}L/yr`,   color: picton  },
    { label: 'BREAK-EVEN',   value: `${breakEven} months`,  color: amber   },
    { label: '5-YEAR GAIN',  value: `₹${fiveYearGain}L`,   color: emerald },
    { label: 'MONTHLY +',    value: `₹${monthlyGain}K`,    color: '#818CF8' },
  ]

  const boxW  = (W - 80) / 4 - 8
  const boxY  = 122
  const boxH  = 76

  stats.forEach((s, i) => {
    const x = 36 + i * (boxW + 8)
    ctx.fillStyle = `${s.color}12`
    roundRect(ctx, x, boxY, boxW, boxH, 10)
    ctx.fill()
    ctx.strokeStyle = `${s.color}28`
    ctx.lineWidth = 1
    roundRect(ctx, x, boxY, boxW, boxH, 10)
    ctx.stroke()

    ctx.fillStyle = text4
    ctx.font = '8px JetBrains Mono, monospace'
    ctx.textAlign = 'center'
    ctx.fillText(s.label, x + boxW / 2, boxY + 16)

    ctx.fillStyle = s.color
    ctx.font = `bold ${s.value.length > 7 ? 14 : 17}px JetBrains Mono, monospace`
    ctx.fillText(s.value, x + boxW / 2, boxY + 44)
  })

  // ROI percentage bar
  const barY  = 222
  const barW  = W - 72
  const barH2 = 8
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'
  roundRect(ctx, 36, barY, barW, barH2, 4)
  ctx.fill()

  const fillPct = Math.min(roiPercent / 1000, 1)
  const barGrad = ctx.createLinearGradient(36, barY, 36 + barW * fillPct, barY)
  barGrad.addColorStop(0, indigo)
  barGrad.addColorStop(1, emerald)
  ctx.fillStyle = barGrad
  roundRect(ctx, 36, barY, barW * fillPct, barH2, 4)
  ctx.fill()

  ctx.fillStyle = text3
  ctx.font = '11px Inter, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`${roiPercent}% ROI over 5 years`, 36, barY + 24)

  // Footer
  ctx.fillStyle = text4
  ctx.font = '10px JetBrains Mono, monospace'
  ctx.textAlign = 'center'
  ctx.fillText('certifyroi.vercel.app · India Market 2026', W / 2, H - 28)

  // Watermark dots
  for (let xi = 0; xi < W; xi += 28) {
    for (let yi = 0; yi < H; yi += 28) {
      ctx.fillStyle = isDark ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.06)'
      ctx.beginPath()
      ctx.arc(xi, yi, 1, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

// Helper for rounded rects (canvas API)
function roundRect(ctx, x, y, w, h, r) {
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

const ShareROICard = ({ certName, name, breakEven, fiveYearGain, monthlyGain, roiPercent, newSalary }) => {
  const canvasRef = useRef(null)
  const [copied,  setCopied]  = useState(false)
  const [visible, setVisible] = useState(false)
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light'

  const render = useCallback(() => {
    if (!canvasRef.current || !certName) return
    drawCard(canvasRef.current, { certName, name, breakEven, fiveYearGain, monthlyGain, roiPercent, newSalary, isDark })
    setVisible(true)
  }, [certName, name, breakEven, fiveYearGain, monthlyGain, roiPercent, newSalary, isDark])

  const download = () => {
    if (!canvasRef.current) return
    const link      = document.createElement('a')
    link.download   = `certifyroi-${certName?.replace(/\s+/g, '-').toLowerCase() || 'roi'}.png`
    link.href       = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  const copyImage = async () => {
    if (!canvasRef.current) return
    try {
      canvasRef.current.toBlob(async blob => {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } catch {
      // Fallback: just download
      download()
    }
  }

  if (!certName) return null

  return (
    <div style={{ marginTop: '8px' }}>
      <button
        onClick={() => { render(); setVisible(v => !v) }}
        style={{ width: '100%', padding: '9px 14px', borderRadius: '9px', background: visible ? 'rgba(81,177,231,0.1)' : 'var(--surface)', border: `1px solid ${visible ? 'rgba(81,177,231,0.3)' : 'var(--border)'}`, color: visible ? '#51B1E7' : 'var(--text-3)', fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.18s' }}
      >
        <Share2 size={13} />
        Share My ROI Card
        <span style={{ marginLeft: 'auto', fontSize: '11px', opacity: 0.6, fontFamily: F_MONO }}>save as image</span>
      </button>

      {visible && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '10px' }}>
          <canvas ref={canvasRef}
            style={{ width: '100%', height: 'auto', borderRadius: '12px', border: '1px solid var(--border)', display: 'block' }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <motion.button onClick={download} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ flex: 1, padding: '9px', borderRadius: '8px', background: 'linear-gradient(135deg, #51B1E7, #3B8CC7)', border: 'none', color: 'white', fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Download size={13} /> Download PNG
            </motion.button>
            <motion.button onClick={copyImage} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ flex: 1, padding: '9px', borderRadius: '8px', background: copied ? 'rgba(16,185,129,0.1)' : 'var(--surface)', border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, color: copied ? '#10B981' : 'var(--text-2)', fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy Image'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ShareROICard