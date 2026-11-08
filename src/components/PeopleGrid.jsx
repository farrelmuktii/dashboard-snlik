/* Grid 10×10 ikon orang: n ikon pertama terisi bertahap.
   Satu grid = 100 orang dewasa. Dua grid dipisah (paham, pakai), bukan corong.
   Animasi diputar ulang setiap kali grid masuk layar lagi, dan (versi cepat) saat kursor
   diarahkan ke grid. Jika pengguna memilih "kurangi gerak", ikon langsung tampil penuh. */
import { useEffect, useRef, useState } from 'react'
import { inView, motion, useReducedMotion } from 'motion/react'

const CW = 12 // lebar sel
const CH = 17 // tinggi sel
const PERSON = (
  <>
    <circle cx="5" cy="3" r="2.7" />
    <path d="M0.8 13.6v-3.9a4.2 4.2 0 0 1 8.4 0v3.9z" />
  </>
)
const HOVER_COOLDOWN = 1500 // ms: kursor yang lewat berulang tidak memicu animasi terus-menerus

export default function PeopleGrid({ n, tone, label, delay = 0 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [play, setPlay] = useState({ id: 0, fast: false }) // id berubah = animasi diputar ulang
  const lastHover = useRef(0)

  // Setiap kali grid masuk layar lagi, putar ulang animasi pengisian
  useEffect(() => {
    if (!ref.current) return
    if (reduce) return
    return inView(
      ref.current,
      () => {
        setPlay((p) => ({ id: p.id + 1, fast: false }))
        return () => {} // fungsi "saat keluar layar": membuat inView terus mengamati, bukan sekali saja
      },
      { amount: 0.5 },
    )
  }, [reduce])

  const onHover = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const now = performance.now()
    if (now - lastHover.current < HOVER_COOLDOWN) return
    lastHover.current = now
    setPlay((p) => ({ id: p.id + 1, fast: true }))
  }

  const on = reduce || play.id > 0 // setelah pertama terisi, ikon tetap penuh walau grid keluar layar
  const step = play.fast ? 0.006 : 0.018
  const start = play.fast ? 0 : delay

  return (
    <svg
      ref={ref}
      className={`pgrid pgrid--${tone}`}
      viewBox={`0 0 ${CW * 10 - 2} ${CH * 10 - 3}`}
      role="img"
      aria-label={label}
      onPointerEnter={onHover}
    >
      {Array.from({ length: 100 }, (_, i) => {
        const x = (i % 10) * CW
        const y = Math.floor(i / 10) * CH
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <g className="p-empty">{PERSON}</g>
            {i < n && (
              <motion.g
                key={play.id}
                className="p-on"
                style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                animate={on ? { opacity: 1, scale: 1 } : undefined}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 100, damping: 20, delay: start + i * step }
                }
              >
                {PERSON}
              </motion.g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
