/* Kata menyala saat digulir: tiap kata mulai pucat lalu menebal mengikuti posisi gulir.
   Diadaptasi dari contoh resmi "Scroll word reveal" katalog Motion (21st.dev/@motiondotdev):
   rentang kata yang saling tumpang tindih (lebih halus) dan teks utuh di aria-label.
   Ditulis ulang tanpa Tailwind/TypeScript/shadcn, dengan warna & skala huruf proyek ini.
   Jika "kurangi gerak" aktif, teks langsung tampil penuh. */
import { Fragment, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

const REST = 0.18 // kecerahan kata sebelum "terbaca"
const SPAN = 0.8 // bagian rentang gulir tempat awal kata disebar
const WINDOW = 0.2 // lama tiap kata menyala (tumpang tindih dengan kata berikutnya)

function rangeFor(i, n) {
  const start = n <= 1 ? 0 : (i / (n - 1)) * SPAN
  return [start, Math.min(1, start + WINDOW)]
}

function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [REST, 1])
  return (
    <motion.span aria-hidden="true" style={{ opacity }}>
      {children}
    </motion.span>
  )
}

export default function ScrollWords({ text, as: Tag = 'p', className = '', id }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  // 0 saat kalimat mulai masuk dari bawah layar, 1 saat sudah naik ke sekitar 40% layar
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.4'] })
  const words = text.split(' ')

  if (reduce) {
    return (
      <Tag ref={ref} id={id} className={`scroll-words ${className}`}>
        {text}
      </Tag>
    )
  }
  return (
    <Tag ref={ref} id={id} className={`scroll-words ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <Word progress={scrollYProgress} range={rangeFor(i, words.length)}>
            {w}
          </Word>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
