/* Dashboard: pilihan tahun, dumbbell (utama), peta sebar (pendalaman), tabel, dan syariah. */
import { useMemo } from 'react'
import { rowsFor, pct, fmt, signed, syariahOf, chartLabel } from '../data.js'
import YearToggle from './YearToggle.jsx'
import Dumbbell from './Dumbbell.jsx'
import Scatter from './Scatter.jsx'
import SectorTable from './SectorTable.jsx'

const WORD = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan']
const MODES = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: 'compare', label: '2024 → 2025' },
]

function annotationsFor(rows, mode) {
  const by = new Map(rows.map((r) => [r.sektor, r]))
  if (mode === 'compare') {
    const list = []
    const ins = by.get('Perasuransian')
    if (ins) list.push({ sektor: ins.sektor, text: `inklusi ${signed(ins.inc - ins.inc24)} poin, jarak menyempit` })
    const pm = by.get('Pasar Modal')
    if (pm && pm.inc < pm.inc24) list.push({ sektor: pm.sektor, text: 'pemakaian justru turun' })
    return list
  }
  const list = []
  const top = [...rows].sort((a, b) => b.gap - a.gap)[0]
  if (!top.unverified) list.push({ sektor: top.sektor, text: `jarak terlebar: ${fmt(top.gap)} poin` })
  const rev = rows.find((r) => r.gap < 0)
  if (rev) list.push({ sektor: rev.sektor, text: 'terbalik: pakai > paham' })
  return list
}

function Summary({ rows, mode, selected }) {
  const s = selected && rows.find((r) => r.sektor === selected)
  if (s) {
    return (
      <>
        <strong>{s.sektor}</strong> ({s.tahun}): {pct(s.lit)} paham, {pct(s.inc)} pakai, kesenjangan{' '}
        <strong>{signed(s.gap)} poin</strong>
        {s.delta != null && (
          <>, {s.delta < 0 ? 'menyempit' : 'melebar'} {fmt(Math.abs(s.delta))} poin sejak 2024{s.prevUnverified ? '†' : ''}</>
        )}
        .
      </>
    )
  }
  if (mode === 'compare') {
    const ok = rows.filter((r) => r.delta != null && !r.prevUnverified)
    const nar = [...ok].sort((a, b) => a.delta - b.delta)[0]
    const wid = [...ok].sort((a, b) => b.delta - a.delta)[0]
    return (
      <>
        Di antara sektor yang data 2024-nya terverifikasi, kesenjangan paling <strong>menyempit</strong> di{' '}
        <strong>{nar.sektor}</strong> ({signed(nar.delta)} poin) dan paling <strong>melebar</strong> di{' '}
        <strong>{wid.sektor}</strong> ({signed(wid.delta)} poin). Titik kecil berongga menandai posisi 2024.
      </>
    )
  }
  const top = [...rows].sort((a, b) => b.gap - a.gap)[0]
  const neg = rows.filter((r) => r.gap < 0)
  return (
    <>
      Pada {mode}, kesenjangan terbesar ada di <strong>{top.sektor}</strong>: {pct(top.lit)} paham tetapi hanya{' '}
      {pct(top.inc)} yang memakai ({fmt(top.gap)} poin)
      {top.unverified ? '†' : ''}.
      {neg.length > 0 && (
        <> Sektor yang pemakaiannya justru melampaui pemahaman: {neg.map((r) => r.sektor).join(', ')}.</>
      )}
    </>
  )
}

export default function Dashboard({ data, mode, setMode, selected, onSelect }) {
  const year = mode === '2024' ? 2024 : 2025
  const rows = useMemo(() => rowsFor(data.sektor, year), [data, year])
  const ghosts = useMemo(
    () => (mode === 'compare' ? new Set(rows.filter((r) => !r.flag).map((r) => r.sektor)) : new Set()),
    [rows, mode],
  )
  const rows25 = useMemo(() => rowsFor(data.sektor, 2025), [data])
  const above = rows25.filter((r) => r.gap > 0).length
  const top = [...rows].sort((a, b) => b.gap - a.gap)[0]
  const yrText = mode === 'compare' ? '2024 dan 2025' : mode
  const unv = rows
    .filter((r) => (mode === '2024' && r.unverified) || (mode !== '2024' && r.delta != null && r.prevUnverified))
    .map((r) => r.sektor)

  /* Syariah: dua baris (2025, 2026) dengan kosakata visual yang sama */
  const syRows = [2025, 2026].map((t) => {
    const lit = syariahOf(data.syariah, t, 'literasi')
    const inc = syariahOf(data.syariah, t, 'inklusi')
    return { sektor: `Syariah ${t}`, tahun: t, lit, inc, gap: lit - inc, flag: false, unverified: false, lit24: null, inc24: null }
  })
  const sy26 = syRows[1], sy25 = syRows[0]

  return (
    <section className="section section--band dashboard" id="dashboard" aria-labelledby="dashboard-h">
      <div className="col">
        <h2 id="dashboard-h" className="h-section">
          Di {WORD[above] ?? above} dari {WORD[rows25.length] ?? rows25.length} sektor keuangan, yang paham lebih
          banyak daripada yang memakai
        </h2>
        <p className="lead">
          Setiap baris di bawah adalah satu sektor. Titik <span className="paham">biru-tinta</span> menunjukkan
          berapa persen orang dewasa yang paham, lingkaran <span className="pakai">terakota</span> berapa persen
          yang memakai. Garis di antaranya adalah kesenjangan: makin panjang, makin jauh jaraknya.
        </p>
      </div>

      <div className="controls col">
        <span className="controls__label" id="mode-label">Tahun survei</span>
        <YearToggle options={MODES} value={mode} onChange={setMode} label="Tahun survei" />
        {selected && (
          <button type="button" className="btn btn--quiet" onClick={() => onSelect(null)}>
            Hapus sorotan {selected}
          </button>
        )}
      </div>
      <p className="summary col" aria-live="polite">
        <Summary rows={rows} mode={mode} selected={selected} />
      </p>
      {unv.length > 0 && (
        <p className="note col">
          † Angka 2024 untuk {unv.join(', ')} belum dapat dicocokkan dengan dokumen resmi yang tersedia daring;
          perlakukan dengan hati-hati.
        </p>
      )}

      <figure className="figure figure--wide">
        <figcaption className="fig-head">
          <h3>
            {mode === 'compare'
              ? 'Bagaimana jarak paham dan pakai bergeser dari 2024 ke 2025'
              : `${top.sektor} punya jarak terlebar antara paham dan pakai`}
          </h3>
          <p>Diurutkan dari kesenjangan terbesar. Sentuh atau klik baris untuk menyorot sektor di semua grafik.</p>
          <ul className="legend" aria-label="Keterangan">
            <li><i className="key key--lit" />Literasi (paham)</li>
            <li><i className="key key--inc" />Inklusi (pakai)</li>
            {mode === 'compare' && <li><i className="key key--ghost" />Posisi 2024</li>}
          </ul>
        </figcaption>
        <Dumbbell
          rows={rows}
          mode={mode}
          selected={selected}
          onSelect={onSelect}
          ghosts={ghosts}
          annotations={annotationsFor(rows, mode)}
          label={chartLabel(rows)}
        />
        <p className="source">
          * LJK Lainnya: cakupan 2025 diperluas, tidak sebanding antartahun. Sumber: SNLIK {yrText}, OJK dan BPS
          (metode keberlanjutan).
        </p>
      </figure>

      <figure className="figure figure--mid">
        <figcaption className="fig-head">
          <h3>Hampir semua sektor berada di bawah garis “paham = pakai”</h3>
          <p>
            Untuk yang ingin mendalami: makin jauh titik di bawah garis putus-putus, makin lebar kesenjangannya.
            Titik di atas garis berarti lebih banyak yang memakai daripada yang paham.
          </p>
          <ul className="legend" aria-label="Keterangan">
            <li><i className="key key--lit" />Sektor</li>
            <li><i className="key key--hollow" />Tidak sebanding antartahun</li>
            <li><i className="key key--diag" />Paham = pakai</li>
          </ul>
        </figcaption>
        <Scatter rows={rows} mode={mode} selected={selected} onSelect={onSelect} ghosts={ghosts} label={chartLabel(rows)} />
        <p className="source">Sumber: SNLIK {yrText}, OJK dan BPS (metode keberlanjutan).</p>
      </figure>

      <figure className="figure figure--mid">
        <figcaption className="fig-head">
          <h3>Angka lengkap per sektor</h3>
          <p>Klik judul kolom untuk mengurutkan, atau nama sektor untuk menyorotnya.</p>
        </figcaption>
        <SectorTable rows={rows} mode={mode} selected={selected} onSelect={onSelect} />
        <p className="source">
          Kesenjangan = literasi − inklusi, dalam poin persen; ukuran buatan penulis, bukan indikator resmi OJK.
          Perubahan negatif berarti kesenjangan menyempit. Sumber: SNLIK 2024–2025, OJK dan BPS.
        </p>
      </figure>

      <div className="col syariah" aria-labelledby="syariah-h">
        <h3 id="syariah-h" className="h-sub">Keuangan syariah mengulang pola yang sama</h3>
        <p className="lead">
          Pada 2026, <span className="paham">{pct(sy26.lit)}</span> orang dewasa paham keuangan syariah, tetapi
          hanya <span className="pakai">{pct(sy26.inc)}</span> yang memakainya: kesenjangan{' '}
          {fmt(sy26.gap)} poin. Kedua indeks sedikit turun dari 2025 ({pct(sy25.lit)} dan {pct(sy25.inc)}).
        </p>
      </div>
      <figure className="figure figure--mid">
        <Dumbbell
          rows={syRows}
          compact
          interactive={false}
          label={`Keuangan syariah: 2025 paham ${pct(sy25.lit)}, pakai ${pct(sy25.inc)}; 2026 paham ${pct(sy26.lit)}, pakai ${pct(sy26.inc)}.`}
        />
        <p className="source">
          SNLIK 2026 memakai sampel jauh lebih besar (75.000 responden di 514 kabupaten/kota, dibanding 10.800
          responden di 120 kabupaten/kota), jadi penurunan sekecil ini belum tentu menunjukkan tren. Sumber: SNLIK
          2025 (OJK, BPS) dan SNLIK 2026 (OJK, LPS, BPS).
        </p>
      </figure>
    </section>
  )
}
