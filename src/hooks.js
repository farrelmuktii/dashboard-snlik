import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { inView, useReducedMotion } from 'motion/react'

/* Lebar piksel asli sebuah elemen (ResizeObserver), supaya grafik SVG digambar
   sesuai layar dan label tetap terbaca di HP (bukan viewBox yang mengecil). */
export function useWidth() {
  const ref = useRef(null)
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setW(Math.round(el.clientWidth))
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w]
}

/* Untuk grafik yang animasinya diputar ulang setiap kali masuk layar lagi.
   go     = grafik sudah pernah terlihat (titik boleh menuju posisi sebenarnya)
   replay = bertambah setiap kali grafik masuk layar lagi; dipakai sebagai `key`
            agar elemen dipasang ulang dan meluncur lagi dari titik nol.
   Jika pengguna memilih "kurangi gerak", tidak ada pemutaran ulang. */
export function useReplay(ref, amount = 0.25) {
  const reduce = useReducedMotion()
  const [state, setState] = useState({ seen: false, replay: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // inView() memanggil fungsi ini setiap kali elemen masuk layar
    return inView(
      el,
      () => {
        setState((s) => (!s.seen ? { seen: true, replay: 0 } : reduce ? s : { seen: true, replay: s.replay + 1 }))
        return () => {} // wajib mengembalikan fungsi "saat keluar layar" agar inView terus mengamati
      },
      { amount },
    )
  }, [ref, amount, reduce])
  return { go: reduce || state.seen, replay: state.replay }
}
