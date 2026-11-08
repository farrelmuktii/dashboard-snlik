/* Cover: foto Tugu Yogyakarta selayar penuh + judul, byline, dan "55 paham. 8 pakai."
   Angka diletakkan di area langit gelap; foto diberi lapisan gelap rata agar teks terbaca.
   Warna cover selalu memakai palet mode gelap (sudah lolos uji kontras di latar gelap). */
import { motion } from 'motion/react'
import { useSpring } from '../motion.js'

const BASE = import.meta.env.BASE_URL

export default function Cover({ data }) {
  const { reduce } = useSpring()
  const g = data?.sektor.find((r) => r.sektor === 'Pergadaian' && r.tahun === '2025')
  const know = g ? Math.round(+g.literasi_persen) : null
  const use = g ? Math.round(+g.inklusi_persen) : null

  const rise = (i) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.15 + i * 0.25 },
        }

  return (
    <header className="cover" id="top">
      <img
        className="cover__img"
        src={`${BASE}foto/tugu-yogyakarta.jpg`}
        width={1800}
        height={1200}
        alt="Tugu Yogyakarta pada malam hari, dengan jejak cahaya kendaraan yang melintas di depannya."
        fetchPriority="high"
        decoding="async"
      />
      <div className="cover__scrim" aria-hidden="true" />

      <div className="cover__inner">
        <div className="cover__mast">
          <svg className="motif" viewBox="0 0 56 24" aria-hidden="true">
            <line x1="10" y1="12" x2="44" y2="12" />
            <circle className="motif__inc" cx="10" cy="12" r="5.5" />
            <circle className="motif__lit" cx="44" cy="12" r="6.5" />
          </svg>
          <h1 className="cover__title">Kesenjangan Literasi &amp; Inklusi Keuangan</h1>
          <p className="cover__byline">
            Oleh <strong>Farrel Mukti Attallah</strong>
            <span className="sep-wide" aria-hidden="true"> · </span>
            <br className="br-mobile" />
            Fakultas Ekonomi dan Bisnis · Universitas Indonesia
            <span aria-hidden="true"> · </span>
            November 2026
          </p>
        </div>

        {know != null && (
          <div className="cover__hook">
            <p className="display" aria-label={`${know} paham. ${use} pakai.`}>
              <motion.span className="display__line cover__lit" {...rise(0)} aria-hidden="true">
                <span className="num-display">{know}</span> paham.
              </motion.span>
              <motion.span className="display__line cover__inc" {...rise(1)} aria-hidden="true">
                <span className="num-display">{use}</span> pakai.
              </motion.span>
            </p>
            <motion.p className="cover__lede" {...rise(2)}>
              Dari 100 orang dewasa Indonesia, {know} paham cara kerja pergadaian. Hanya {use} yang memakainya.
              <span className="cover__src"> SNLIK 2025, OJK dan BPS.</span>
            </motion.p>
          </div>
        )}
      </div>

      <p className="cover__credit">
        Foto:{' '}
        <a href="https://unsplash.com/photos/LhoUx4AzVco" target="_blank" rel="noopener noreferrer">
          Dhio Gandhi / Unsplash
        </a>
      </p>
    </header>
  )
}
