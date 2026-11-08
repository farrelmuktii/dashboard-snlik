/* Angka yang berhitung saat terlihat di layar.
   Diadaptasi dari "Count Up" karya unlumen di 21st.dev (lisensi MIT):
   https://21st.dev/@unlumen/components/count-up
   Perubahan: berhitung ulang setiap kali angka masuk layar lagi; hanya mode teks biasa (tanpa efek blur/slide per digit), format angka Indonesia,
   tanpa Tailwind/react-use-measure, menghormati prefers-reduced-motion, dan nilai akhir
   selalu tersedia untuk pembaca layar. */
import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { fmt } from '../data.js'

export default function CountUp({ to, decimals = 0, suffix = "", delay = 0, className = "", immediate = false }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const value = useMotionValue(reduce ? to : 0)
  const spring = useSpring(value, { stiffness: 100, damping: 20, restDelta: 0.005 })
  const seen = useInView(ref, { amount: 0.6 }) // tanpa "once": berhitung ulang tiap kali masuk layar lagi
  const inView = immediate || seen
  const final = fmt(to, decimals) + suffix

  useEffect(() => {
    if (reduce) { value.jump(to); spring.jump(to); return }
    if (!inView) return
    value.jump(0)
    spring.jump(0)
    const t = setTimeout(() => value.set(to), delay * 1000)
    return () => clearTimeout(t)
  }, [inView, reduce, to, delay, value, spring])

  useEffect(
    () =>
      spring.on('change', (v) => {
        if (ref.current) ref.current.textContent = fmt(v, decimals) + suffix
      }),
    [spring, decimals, suffix],
  )

  return (
    <span className={`countup ${className}`}>
      <span ref={ref} aria-hidden="true">{reduce ? final : fmt(0, decimals) + suffix}</span>
      <span className="sr-only">{final}</span>
    </span>
  )
}
