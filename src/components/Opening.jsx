/* Pembuka setelah cover: dua grid 100 orang, lalu pertanyaan dan kontras nasional 2026. */
import CountUp from './CountUp.jsx'
import PeopleGrid from './PeopleGrid.jsx'
import Note from './Note.jsx'
import ScrollWords from './ScrollWords.jsx'
import { nasionalOf } from '../data.js'

export default function Opening({ data }) {
  const g = data.sektor.find((r) => r.sektor === 'Pergadaian' && r.tahun === '2025')
  const know = Math.round(+g.literasi_persen)
  const use = Math.round(+g.inklusi_persen)
  const n26 = nasionalOf(data.nasional, 2026)
  const inc26 = +n26.inklusi_persen

  return (
    <section className="opening" aria-labelledby="opening-q">
      <div className="opening__hero">
        <div className="opening__grids">
          <p className="grids-lede">
            Pergadaian, 2025. Dari 100 orang dewasa Indonesia:
          </p>
          <figure className="pfig">
            <PeopleGrid n={know} tone="lit" label={`${know} dari 100 orang dewasa paham pergadaian`} delay={0.3} />
            <figcaption>
              <b className="num paham">{know}</b> orang <span className="paham">paham</span> cara kerja pergadaian
            </figcaption>
          </figure>
          <figure className="pfig">
            <PeopleGrid n={use} tone="inc" label={`${use} dari 100 orang dewasa memakai pergadaian`} delay={0.3 + know * 0.018} />
            <figcaption>
              <b className="num pakai">{use}</b> orang benar-benar <span className="pakai">memakainya</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="opening__text">
        <ScrollWords
          as="h2"
          id="opening-q"
          className="dek"
          text="Kalau orang sudah paham produk keuangan, apakah mereka pasti memakainya?"
        />

        <Note
          note={
            <>
              Angka dibulatkan. Literasi dan inklusi sama-sama diukur dari seluruh penduduk dewasa, jadi 8
              orang yang memakai tidak otomatis termasuk 55 orang yang paham. Sumber: SNLIK 2025 (OJK, BPS),
              metode keberlanjutan.
            </>
          }
        >
          <p className="lead">
            Kalau melihat angka nasional, jawabannya tampak menggembirakan. Pada 2026, hampir semua penduduk
            dewasa Indonesia sudah memakai setidaknya satu produk atau layanan keuangan.
          </p>
        </Note>

        <Note
          note={
            <>
              Sumber: SNLIK 2026 (OJK, LPS, BPS), metode komprehensif. Sampelnya 75.000 responden di 514
              kabupaten/kota, jauh lebih besar dari survei 2024–2025, sehingga tidak dibandingkan langsung
              dengan angka sebelumnya.
            </>
          }
        >
          <p className="big-stat">
            <CountUp to={inc26} decimals={2} suffix="%" className="big-stat__v pakai" />
            <span className="big-stat__cap">
              indeks inklusi keuangan nasional 2026, sudah melampaui target RPJMN 2029 sebesar 93%
            </span>
          </p>
        </Note>

        <Note>
          <p className="lead">
            Tetapi angka itu menghitung pemakaian produk keuangan <em>apa pun</em>, termasuk rekening bank dan
            jaminan sosial. Begitu dilihat per sektor, <span className="paham">paham</span> dan{' '}
            <span className="pakai">pakai</span> sering berjalan sendiri-sendiri. Pergadaian, sektor kedua yang
            paling dikenal setelah perbankan, hanya salah satu contohnya.
          </p>
        </Note>
      </div>
    </section>
  )
}
