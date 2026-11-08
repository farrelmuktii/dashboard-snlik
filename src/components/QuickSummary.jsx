/* Ringkasan 30 detik: tiga temuan utama untuk pembaca yang sibuk (mis. rekruter).
   Semua angka dihitung dari CSV. */
import { useMemo } from 'react'
import { rowsFor, pct, fmt } from '../data.js'

const WORD = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan']

export default function QuickSummary({ data }) {
  const r25 = useMemo(() => rowsFor(data.sektor, 2025), [data])
  const above = r25.filter((r) => r.gap > 0).length
  const top = [...r25].sort((a, b) => b.gap - a.gap)[0]
  const rev = r25.find((r) => r.gap < 0)

  return (
    <section className="quick" aria-labelledby="quick-h">
      <div className="quick__inner">
        <h2 id="quick-h" className="quick__h">Ringkasan 30 detik</h2>
        <ol className="quick__list">
          <li>
            <span className="quick__n num">1</span>
            <p>
              Di <strong>{WORD[above]} dari {WORD[r25.length]} sektor</strong>, orang dewasa yang paham produk keuangan
              lebih banyak daripada yang memakainya.
            </p>
          </li>
          <li>
            <span className="quick__n num">2</span>
            <p>
              Jarak terlebar ada di <strong>{top.sektor.toLowerCase()}</strong>: <span className="paham">{pct(top.lit)}</span>{' '}
              paham, hanya <span className="pakai">{pct(top.inc)}</span> memakai ({fmt(top.gap)} poin).
            </p>
          </li>
          {rev && (
            <li>
              <span className="quick__n num">3</span>
              <p>
                <strong>{rev.sektor}</strong> kebalikannya: lebih banyak yang memakai (
                <span className="pakai">{pct(rev.inc)}</span>) daripada yang paham (<span className="paham">{pct(rev.lit)}</span>).
              </p>
            </li>
          )}
        </ol>
        <p className="quick__src">Sumber: SNLIK 2025, OJK dan BPS (metode keberlanjutan).</p>
        <div className="quick__actions">
          <a className="btn btn--solid" href="#dashboard">Lihat dashboard</a>
          <a className="btn" href="#cara">Cara saya menganalisis</a>
        </div>
      </div>
    </section>
  )
}
