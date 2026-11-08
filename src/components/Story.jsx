/* Insight bercerita (scrollytelling): grafik ringkas menempel, langkah-langkah bergulir di sampingnya.
   Sektor yang sedang dibahas disorot, sektor lain memudar. Semua angka dihitung dari CSV. */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { rowsFor, pct, fmt } from '../data.js'
import Dumbbell from './Dumbbell.jsx'
import { Badge } from './Icon.jsx'

const WORD = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan']

function Step({ n, icon, tone, active, onEnter, title, children }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onEnter(n)
  }, [inView, n, onEnter])
  return (
    <article ref={ref} className={`step${active ? ' is-active' : ''}`} aria-current={active ? 'step' : undefined}>
      <span className="step__head">
        <Badge name={icon} tone={tone} />
        <span className="step__n num">Temuan {n}</span>
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  )
}

export default function Story({ data }) {
  const [step, setStep] = useState(0)
  const r25 = useMemo(() => rowsFor(data.sektor, 2025), [data])
  const by = new Map(r25.map((r) => [r.sektor, r]))
  const above = r25.filter((r) => r.gap > 0)
  const ranked = [...r25].sort((a, b) => b.gap - a.gap)
  const [first, second] = ranked
  const bank = by.get('Perbankan')
  const ins = by.get('Perasuransian')
  const insGap24 = ins.lit24 - ins.inc24

  const STEPS = {
    1: { title: 'SNLIK 2025', on: above.map((r) => r.sektor) },
    2: { title: 'SNLIK 2025', on: [first.sektor, second.sektor] },
    3: { title: 'SNLIK 2025', on: ['Perbankan'] },
    4: { title: 'SNLIK 2024 → 2025', on: ['Perasuransian'], ghost: ['Perasuransian'] },
  }
  const cfg = STEPS[step]
  const highlight = cfg ? new Set(cfg.on) : null
  const ghosts = new Set(cfg?.ghost ?? [])

  return (
    <section className="section section--band story" id="insight" aria-labelledby="insight-h">
      <div className="col">
        <h2 id="insight-h" className="h-section">Empat temuan dari sembilan sektor</h2>
        <p className="note">Gulir pelan-pelan: grafik menyorot sektor yang sedang dibahas.</p>
      </div>
      <div className="story__grid">
        <div className="story__chart">
          <figure className="story__fig">
            <figcaption className="story__cap">
              <span className="story__title">{cfg ? cfg.title : 'SNLIK 2025'}</span>
              <span className="legend-inline">
                <i className="key key--lit" /> paham <i className="key key--inc" /> pakai
              </span>
            </figcaption>
            <Dumbbell
              rows={r25}
              compact
              interactive={false}
              highlight={highlight}
              ghosts={ghosts}
              label="Grafik cerita: literasi dan inklusi sembilan sektor 2025; sektor yang dibahas disorot."
            />
            <p className="source">Sumber: SNLIK 2024–2025, OJK dan BPS.</p>
          </figure>
        </div>
        <div className="story__steps">
          <Step n={1} icon="not-equals" tone="ink" active={step === 1} onEnter={setStep} title="Paham tidak otomatis berarti pakai.">
            Pada 2025, {WORD[above.length]} dari {WORD[r25.length]} sektor punya literasi lebih tinggi daripada
            inklusi. Hampir di semua sektor, lingkaran “pakai” tertinggal jauh di kiri titik “paham”.
          </Step>
          <Step n={2} icon="coins" tone="inc" active={step === 2} onEnter={setStep} title={`${first.sektor} punya jarak terlebar.`}>
            {pct(first.lit)} penduduk paham, tetapi hanya {pct(first.inc)} yang memakai: kesenjangan{' '}
            {fmt(first.gap)} poin. {second.sektor} menyusul dengan {fmt(second.gap)} poin.
          </Step>
          <Step n={3} icon="bank" tone="lit" active={step === 3} onEnter={setStep} title="Perbankan justru kebalikannya.">
            Yang memakai ({pct(bank.inc)}) lebih banyak daripada yang paham ({pct(bank.lit)}). Banyak orang punya
            rekening tanpa sepenuhnya memahami produk yang mereka pakai.
          </Step>
          <Step n={4} icon="trend-up" tone="lit" active={step === 4} onEnter={setStep} title="Asuransi bergerak paling cepat.">
            Inklusinya melonjak dari {pct(ins.inc24)} (2024) ke {pct(ins.inc)} (2025), sehingga kesenjangannya
            menyempit dari {fmt(insGap24)} menjadi {fmt(ins.gap)} poin. OJK mengaitkan kenaikan ini dengan produk
            asuransi yang ditawarkan saat orang berbelanja daring.
          </Step>
        </div>
      </div>
      <p className="source story__src-m">Sumber grafik: SNLIK 2024–2025, OJK dan BPS.</p>
    </section>
  )
}
