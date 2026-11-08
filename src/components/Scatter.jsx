/* Grafik pendalaman: peta sebar literasi (x) lawan inklusi (y) dengan diagonal "paham = pakai".
   Penempatan label diambil dari app.js lama: coba beberapa posisi di sekitar titik; jika tidak
   ada yang muat (biasanya di HP), pakai nomor urut + daftar keterangan di bawah grafik. */
import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { useWidth, useReplay } from '../hooks.js'
import { useSpring } from '../motion.js'
import { pct, signed } from '../data.js'
import Tooltip from './Tooltip.jsx'

const MAX = 80
const CHAR = 8.4 // perkiraan lebar satu huruf label 15 px

const FAR = [
  [11, 4, 'start'], [-11, 4, 'end'], [0, -13, 'middle'], [0, 22, 'middle'],
  [11, -10, 'start'], [11, 17, 'start'], [-11, -10, 'end'], [-11, 17, 'end'],
  [16, -26, 'start'], [-16, -26, 'end'], [16, 32, 'start'], [-16, 32, 'end'],
  [0, -32, 'middle'], [8, -46, 'start'], [0, -48, 'middle'], [8, -62, 'start'],
]
const NEAR = [[10, 4, 'start'], [-10, 4, 'end'], [0, -11, 'middle'], [0, 19, 'middle'], [9, -9, 'start'], [-9, -9, 'end'], [14, -22, 'start'], [-14, -22, 'end']]

export default function Scatter({ rows, mode, selected, onSelect, ghosts = new Set(), label }) {
  const [boxRef, W] = useWidth()
  const { reduce, spring } = useSpring()
  const [tip, setTip] = useState(null)

  const narrow = W < 520
  const H = narrow ? Math.round(W * 0.95) : Math.min(460, Math.round(W * 0.72))
  const m = { l: 56, r: 16, t: 12, b: 50 }
  const sx = (v) => m.l + (v / MAX) * (W - m.l - m.r)
  const sy = (v) => H - m.b - (v / MAX) * (H - m.t - m.b)

  // Label diagonal ditulis miring sejajar garis, sedikit di atasnya
  const diag = {
    x: sx(54),
    y: sy(54) - 8,
    angle: W ? (-Math.atan((H - m.t - m.b) / (W - m.l - m.r)) * 180) / Math.PI : 0,
  }

  const zones = useMemo(() => {
    if (!W) return []
    return [
      { key: 'a', x: sx(79), y: sy(42), anchor: 'end', text: 'lebih banyak yang paham ↘', cls: 'zone-lbl' },
      { key: 'b', x: sx(1.5), y: sy(74), anchor: 'start', text: '↖ lebih banyak yang pakai', cls: 'zone-lbl' },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, H])

  /* Posisi titik + label tanpa tumpang tindih */
  const layout = useMemo(() => {
    if (!W) return { pts: [], labels: [], keyed: [] }
    const ranked = [...rows].sort((a, b) => b.gap - a.gap)
    const pts = rows.map((r) => ({ r, x: sx(r.lit), y: sy(r.inc), no: ranked.indexOf(r) + 1 }))
    const boxes = pts.map((p) => ({ x: p.x - 9, y: p.y - 9, w: 18, h: 18 }))
    rows.forEach((r) => {
      if (ghosts.has(r.sektor) && r.lit24 != null) {
        const gx = sx(r.lit24), gy = sy(r.inc24)
        boxes.push({ x: gx - 6, y: gy - 6, w: 12, h: 12 })
        // jalur panah dari posisi 2024 ke 2025: sampel beberapa titik
        for (let k = 1; k < 4; k++) {
          const ax = gx + ((sx(r.lit) - gx) * k) / 4, ay = gy + ((sy(r.inc) - gy) * k) / 4
          boxes.push({ x: ax - 4, y: ay - 4, w: 8, h: 8 })
        }
      }
    })
    boxes.push({ x: diag.x - 60, y: diag.y - 40, w: 120, h: 60 })
    zones.forEach((z) => {
      const tw = z.text.length * 7.4
      const bx = z.anchor === 'end' ? z.x - tw : z.x
      boxes.push({ x: bx, y: z.y - 12, w: tw, h: 15 })
    })
    const hit = (b) =>
      b.x < m.l || b.x + b.w > W - 2 || b.y < 0 || b.y + b.h > H - m.b ||
      boxes.some((o) => b.x < o.x + o.w && b.x + b.w > o.x && b.y < o.y + o.h && b.y + b.h > o.y)
    const labels = []
    const place = (p, text, list) => {
      const tw = text.length * CHAR
      for (const [dx, dy, anchor] of list) {
        const lx = p.x + dx, ly = p.y + dy
        const bx = anchor === 'start' ? lx : anchor === 'end' ? lx - tw : lx - tw / 2
        const b = { x: bx - 2, y: ly - 13, w: tw + 4, h: 17 }
        if (!hit(b)) {
          boxes.push(b)
          const lead = Math.hypot(dx, dy) > 24
          const ex = anchor === 'start' ? bx : anchor === 'end' ? bx + tw : lx
          labels.push({ s: p.r.sektor, x: lx, y: ly, anchor, text, lead: lead ? { x1: p.x, y1: p.y, x2: ex, y2: ly - 4 } : null })
          return true
        }
      }
      return false
    }
    const crowd = (p) => pts.filter((q) => Math.hypot(q.x - p.x, q.y - p.y) < 60).length
    const keyed = []
    ;[...pts].sort((a, b) => crowd(b) - crowd(a)).forEach((p) => {
      if (!narrow && place(p, p.r.sektor, FAR)) return
      keyed.push(p)
      if (!place(p, String(p.no), NEAR)) labels.push({ s: p.r.sektor, x: p.x + 10, y: p.y + 4, anchor: 'start', text: String(p.no) })
    })
    return { pts, labels, keyed: keyed.sort((a, b) => a.no - b.no) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, W, H, narrow, zones, ghosts])

  // titik meluncur dari pojok nol saat grafik terlihat, diulang setiap kali masuk layar lagi
  const { go, replay } = useReplay(boxRef)
  const from = (k) => (replay > 0 && !reduce ? k : false)

  return (
    <div className="chart-box" ref={boxRef}>
      {W > 0 && (
        <svg width={W} height={H} role="img" aria-label={label} className="scatter">
          <g aria-hidden="true">
            {[0, 20, 40, 60, 80].map((v) => (
              <g key={v}>
                <line className="gl" x1={m.l} x2={W - m.r} y1={sy(v)} y2={sy(v)} />
                <text className="ax" x={m.l - 8} y={sy(v) + 4} textAnchor="end">{v}%</text>
                <text className="ax" x={sx(v)} y={H - m.b + 18} textAnchor="middle">{v}%</text>
              </g>
            ))}
            <text className="ax ax-title" x={(m.l + W - m.r) / 2} y={H - 6} textAnchor="middle">Literasi (paham) →</text>
            <text className="ax ax-title" transform={`translate(12 ${(m.t + H - m.b) / 2}) rotate(-90)`} textAnchor="middle">Inklusi (pakai) →</text>
            <line className="diag" x1={sx(0)} y1={sy(0)} x2={sx(MAX)} y2={sy(MAX)} />
            <text className="diag-lbl" x={diag.x} y={diag.y} textAnchor="middle" transform={`rotate(${diag.angle} ${diag.x} ${diag.y})`}>paham = pakai</text>
            {zones.map((z) => (
              <text key={z.key} className={z.cls} x={z.x} y={z.y} textAnchor={z.anchor}>{z.text}</text>
            ))}
          </g>

          {layout.pts.map((p, i) => {
            const r = p.r
            const dim = selected && selected !== r.sektor ? 0.22 : 1
            const showG = ghosts.has(r.sektor) && r.lit24 != null
            const gx = showG ? sx(r.lit24) : 0, gy = showG ? sy(r.inc24) : 0
            const len = Math.hypot(p.x - gx, p.y - gy)
            const t = { ...spring, delay: reduce ? 0 : i * 0.04 }
            return (
              <motion.g key={r.sektor} initial={false} animate={{ opacity: dim }} transition={spring}>
                {showG && (
                  <g aria-hidden="true">
                    <circle className="ghost" cx={gx} cy={gy} r={4} />
                    {len > 14 && (
                      <line
                        className="arrow"
                        x1={gx + ((p.x - gx) / len) * 6}
                        y1={gy + ((p.y - gy) / len) * 6}
                        x2={p.x - ((p.x - gx) / len) * 10}
                        y2={p.y - ((p.y - gy) / len) * 10}
                        markerEnd="url(#sc-ah)"
                      />
                    )}
                  </g>
                )}
                <motion.circle
                  key={`dot-${replay}`}
                  className={`dot-sc${r.flag ? ' flag' : ''}`}
                  r={6.5}
                  initial={from({ cx: sx(0), cy: sy(0) })}
                  animate={{ cx: go ? p.x : sx(0), cy: go ? p.y : sy(0) }}
                  transition={t}
                />
                <circle
                  className="hit"
                  cx={p.x}
                  cy={p.y}
                  r={22}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selected === r.sektor}
                  aria-label={`${r.sektor} ${r.tahun}: paham ${pct(r.lit)}, pakai ${pct(r.inc)}, kesenjangan ${signed(r.gap)} poin. Tekan untuk menyorot.`}
                  onPointerEnter={() => setTip({ r, x: p.x, y: p.y })}
                  onPointerLeave={() => setTip(null)}
                  onFocus={() => setTip({ r, x: p.x, y: p.y })}
                  onBlur={() => setTip(null)}
                  onClick={() => onSelect?.(r.sektor)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(r.sektor) }
                  }}
                />
              </motion.g>
            )
          })}

          <defs>
            <marker id="sc-ah" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" className="arrowhead" />
            </marker>
          </defs>

          <motion.g
            key={`labels-${replay}`}
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: go ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.6 }}
          >
            {layout.labels.map((l) => (
              <g key={l.s} opacity={selected && selected !== l.s ? 0.3 : 1}>
                {l.lead && <line className="leader" {...l.lead} />}
                <text className={`lbl${selected === l.s ? ' lbl-sel' : ''}`} x={l.x} y={l.y} textAnchor={l.anchor}>{l.text}</text>
              </g>
            ))}
          </motion.g>
        </svg>
      )}
      <Tooltip tip={tip} w={W} mode={mode} />
      {layout.keyed.length > 0 && (
        <ol className="sc-key">
          {layout.keyed.map((p) => (
            <li key={p.r.sektor}><b className="num">{p.no}</b> {p.r.sektor}{p.r.flag ? ' *' : ''}</li>
          ))}
        </ol>
      )}
    </div>
  )
}
