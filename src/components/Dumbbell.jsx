/* Grafik utama: dumbbell kesenjangan per sektor.
   Titik biru-tinta = literasi (paham), lingkaran terakota berongga = inklusi (pakai),
   garis abu = kesenjangan. Angka persen selalu di sisi luar masing-masing titik. */
import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { useWidth, useReplay } from '../hooks.js'
import { useSpring } from '../motion.js'
import { pct, signed, SHORT } from "../data.js"
import Tooltip from './Tooltip.jsx'

const MAX = 80

export default function Dumbbell({
  rows,
  mode = '2025',
  selected = null,
  onSelect,
  compact = false,
  interactive = true,
  highlight = null,  // Set sektor yang disorot cerita (scrollytelling)
  ghosts = new Set(), // sektor yang menampilkan posisi 2024
  annotations = [],
  label = '',
}) {
  const [boxRef, W] = useWidth()
  const { reduce, spring } = useSpring()
  const [tip, setTip] = useState(null)

  const narrow = W < 480
  const nameW = compact ? (narrow ? 96 : 124) : 0
  const x0 = compact ? nameW + 66 : 60
  const x1 = Math.max(x0 + 40, W - (compact ? 56 : 68))
  const sx = (v) => x0 + (v / MAX) * (x1 - x0)
  const rowH = compact ? (narrow ? 28 : 32) : 64
  const H = 4 + rows.length * rowH + 26
  const ticks = x1 - x0 < 220 ? [0, 40, 80] : [0, 20, 40, 60, 80]

  const sorted = useMemo(() => [...rows].sort((a, b) => b.gap - a.gap), [rows])
  const annBy = new Map(annotations.map((a) => [a.sektor, a.text]))
  // titik meluncur dari 0 saat grafik terlihat, dan diulang setiap kali grafik masuk layar lagi
  const { go, replay } = useReplay(boxRef)
  const from = (k) => (replay > 0 && !reduce ? k : false)

  const showTip = (r, x, y) => setTip({ r, x, y })

  return (
    <div className="chart-box" ref={boxRef}>
      {W > 0 && (
        <svg width={W} height={H} role="img" aria-label={label} className={`dumbbell`}>
          {ticks.map((v) => (
            <g key={v} aria-hidden="true">
              <line className="gl" x1={sx(v)} x2={sx(v)} y1={2} y2={H - 22} />
              <text className="ax" x={sx(v)} y={H - 6} textAnchor="middle">{v}%</text>
            </g>
          ))}

          {sorted.map((r, i) => {
            const yTop = 4 + i * rowH
            const y = compact ? rowH / 2 - 1 : 45
            const gy = compact ? y - 11 : 31
            const L = go ? sx(r.lit) : sx(0)
            const I = go ? sx(r.inc) : sx(0)
            const litRight = r.lit >= r.inc
            const o = compact ? 9 : 12
            const d = r.unverified ? '†' : ''
            const showG = ghosts.has(r.sektor) && r.lit24 != null
            const dim =
              (selected && selected !== r.sektor) || (highlight && !highlight.has(r.sektor)) ? 0.22 : 1
            const delay = reduce ? 0 : i * 0.04
            const t = { ...spring, delay }
            const name = compact ? SHORT[r.sektor] || r.sektor : r.sektor + (r.flag ? ' *' : '')
            const ann = !compact && annBy.get(r.sektor)
            return (
              <motion.g
                key={r.sektor}
                initial={false}
                animate={{ y: yTop, opacity: dim }}
                transition={spring}
              >
                {selected === r.sektor && <rect className="row-sel" x={0} y={0} width={W} height={rowH - 2} />}
                <text className="lbl" x={0} y={compact ? y + 5 : 19}>{name}</text>
                {ann && (
                  <text className="annot" x={W - 2} y={18} textAnchor="end">{ann}</text>
                )}

                {showG && (
                  <g className="ghosts" aria-hidden="true">
                    <circle className="ghost" cx={sx(r.lit24)} cy={gy} r={3.5} />
                    <circle className="ghost" cx={sx(r.inc24)} cy={gy} r={3.5} />
                    {[[r.lit24, r.lit], [r.inc24, r.inc]].map(([a, b], k) => {
                      const A = sx(a), B = sx(b), dir = Math.sign(B - A)
                      if (Math.abs(B - A) < 14) return null
                      return (
                        <g key={k}>
                          <line className="arrow" x1={A + dir * 6} x2={B - dir * 4} y1={gy} y2={gy} />
                          <path className="arrowhead" d={`M${B} ${gy} l${-dir * 5} -3.5 v7 z`} />
                        </g>
                      )
                    })}
                  </g>
                )}

                <motion.line
                  key={`bar-${replay}`}
                  className="bar-gap"
                  y1={y}
                  y2={y}
                  initial={from({ x1: sx(0), x2: sx(0) })}
                  animate={{ x1: Math.min(L, I), x2: Math.max(L, I) }}
                  transition={t}
                />
                <motion.circle key={`inc-${replay}`} className="dot-inc" cy={y} r={compact ? 5 : 6.5} initial={from({ cx: sx(0) })} animate={{ cx: I }} transition={t} />
                <motion.circle key={`lit-${replay}`} className="dot-lit" cy={y} r={compact ? 5 : 6.5} initial={from({ cx: sx(0) })} animate={{ cx: L }} transition={t} />
                <motion.text
                  key={`vl-${replay}`}
                  className={`v v-lit${compact ? ' v-sm' : ''}`}
                  y={y + 5}
                  textAnchor={litRight ? 'start' : 'end'}
                  initial={from({ x: sx(0) })}
                  animate={{ x: litRight ? L + o : L - o }}
                  transition={t}
                >
                  {pct(r.lit)}{d}
                </motion.text>
                <motion.text
                  key={`vi-${replay}`}
                  className={`v v-inc${compact ? ' v-sm' : ''}`}
                  y={y + 5}
                  textAnchor={litRight ? 'end' : 'start'}
                  initial={from({ x: sx(0) })}
                  animate={{ x: litRight ? I - o : I + o }}
                  transition={t}
                >
                  {pct(r.inc)}{d}
                </motion.text>

                {interactive && (
                  <rect
                    className="hit"
                    x={0}
                    y={0}
                    width={W}
                    height={rowH}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selected === r.sektor}
                    aria-label={`${r.sektor} ${r.tahun}: paham ${pct(r.lit)}, pakai ${pct(r.inc)}, kesenjangan ${signed(r.gap)} poin${r.unverified ? ', angka belum terverifikasi' : ''}. Tekan untuk menyorot.`}
                    onPointerMove={(e) => {
                      const b = boxRef.current.getBoundingClientRect()
                      showTip(r, e.clientX - b.left, yTop + y)
                    }}
                    onPointerLeave={() => setTip(null)}
                    onFocus={() => showTip(r, Math.max(sx(r.lit), sx(r.inc)), yTop + y)}
                    onBlur={() => setTip(null)}
                    onClick={() => onSelect?.(r.sektor)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(r.sektor) }
                    }}
                  />
                )}
              </motion.g>
            )
          })}
        </svg>
      )}
      {interactive && <Tooltip tip={tip} w={W} mode={mode} />}
    </div>
  )
}
