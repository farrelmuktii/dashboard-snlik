/* Tabel kesenjangan per sektor yang bisa diurutkan (aria-sort di judul kolom).
   Nama sektor adalah tombol untuk menyorot sektor di semua grafik. */
import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { pct, signed } from '../data.js'
import { useSpring } from '../motion.js'

const COLS = [
  { key: 'sektor', label: 'Sektor' },
  { key: 'lit', label: 'Paham', sub: 'literasi' },
  { key: 'inc', label: 'Pakai', sub: 'inklusi' },
  { key: 'gap', label: 'Kesenjangan', sub: 'poin' },
  { key: 'delta', label: 'Perubahan', sub: 'vs 2024', cls: 'col-delta' },
]

export default function SectorTable({ rows, mode, selected, onSelect }) {
  const [sort, setSort] = useState({ key: 'gap', dir: 'desc' })
  const { spring } = useSpring()
  const showDelta = mode !== '2024'

  const sorted = useMemo(() => {
    const val = (r) => (sort.key === 'sektor' ? r.sektor : sort.key === 'delta' ? (r.delta ?? -Infinity) : r[sort.key])
    return [...rows].sort((a, b) => {
      const va = val(a), vb = val(b)
      const c = typeof va === 'string' ? va.localeCompare(vb, 'id') : va - vb
      return sort.dir === 'asc' ? c : -c
    })
  }, [rows, sort])

  const maxGap = Math.max(...rows.map((r) => Math.abs(r.gap)))
  const toggle = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'sektor' ? 'asc' : 'desc' }))

  const deltaCell = (r) => {
    if (r.flag) return <span className="muted">tidak sebanding</span>
    if (r.delta == null) return '—'
    return (
      <span className={r.delta > 0 ? 'delta-up' : 'delta-down'}>
        {signed(r.delta)}{r.prevUnverified ? '†' : ''}
      </span>
    )
  }

  return (
    <div className="table-wrap">
      <table className={`tbl${showDelta ? '' : ' hide-delta'}`}>
        <caption className="sr-only">
          Literasi, inklusi, dan kesenjangan per sektor, {mode === 'compare' ? '2025 dibanding 2024' : mode}. Klik judul kolom untuk mengurutkan.
        </caption>
        <thead>
          <tr>
            {COLS.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={c.cls}
                aria-sort={sort.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                <button type="button" className="sort-btn" onClick={() => toggle(c.key)}>
                  <span>
                    {c.label}
                    {c.sub && <small> {c.sub}</small>}
                  </span>
                  <span className="sort-ind" aria-hidden="true">
                    {sort.key === c.key ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const d = r.unverified ? '†' : ''
            const w = Math.max(3, Math.round((Math.abs(r.gap) / maxGap) * 56))
            const isSel = selected === r.sektor
            return (
              <motion.tr layout="position" transition={spring} key={r.sektor} className={isSel ? 'sel' : ''}>
                <th scope="row">
                  <button type="button" className="row-btn" aria-pressed={isSel} onClick={() => onSelect(r.sektor)}>
                    {r.sektor}
                  </button>
                  {r.flag && <span className="flag-note">cakupan 2025 diperluas</span>}
                  {showDelta && r.delta != null && (
                    <span className="delta-mobile">Perubahan vs 2024: {deltaCell(r)}</span>
                  )}
                </th>
                <td className="num paham">{pct(r.lit)}{d}</td>
                <td className="num pakai">{pct(r.inc)}{d}</td>
                <td className="num">
                  <span className="gapcell">
                    {signed(r.gap)}
                    <span className={`gapbar${r.gap < 0 ? ' neg' : ''}`} style={{ width: w }} aria-hidden="true" />
                  </span>
                </td>
                <td className="num col-delta">{deltaCell(r)}</td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
