/* Navigasi bar tipis yang menempel di atas + garis progres baca.
   Muncul setelah pembaca melewati cover. Bagian yang sedang dibaca ditandai.
   Di HP: nama bagian aktif + tombol "Daftar isi" yang membuka daftar. */
import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'insight', label: 'Temuan' },
  { id: 'posisi', label: 'Posisimu' },
  { id: 'rekomendasi', label: 'Rekomendasi' },
  { id: 'cara', label: 'Metode' },
]

export default function SiteNav() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  const [shown, setShown] = useState(false)
  const [active, setActive] = useState(null)
  const [open, setOpen] = useState(false)

  // Tampilkan navigasi setelah cover terlewati
  useEffect(() => {
    const cover = document.querySelector('.cover')
    if (!cover) return
    const io = new IntersectionObserver(([e]) => {
      setShown(!e.isIntersecting)
      if (e.isIntersecting) setOpen(false)
    }, { rootMargin: '-64px 0px 0px 0px' })
    io.observe(cover)
    return () => io.disconnect()
  }, [])

  // Tandai bagian yang sedang dibaca (yang melintasi tengah layar)
  useEffect(() => {
    const els = NAV_ITEMS.map((i) => document.getElementById(i.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Tutup daftar dengan tombol Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const current = NAV_ITEMS.find((i) => i.id === active)

  return (
    <nav className={`sitenav${shown ? ' is-shown' : ''}`} aria-label="Navigasi bagian" inert={!shown}>
      <div className="sitenav__inner">
        <a href="#top" className="sitenav__brand">
          <svg className="motif" viewBox="0 0 56 24" aria-hidden="true">
            <line x1="10" y1="12" x2="44" y2="12" />
            <circle className="motif__inc" cx="10" cy="12" r="5.5" />
            <circle className="motif__lit" cx="44" cy="12" r="6.5" />
          </svg>
          <span className="sitenav__title">Kesenjangan Literasi &amp; Inklusi</span>
        </a>
        <span className="sitenav__current" aria-hidden="true">{current?.label ?? ''}</span>
        <button
          type="button"
          className="sitenav__toggle"
          aria-expanded={open}
          aria-controls="sitenav-list"
          onClick={() => setOpen((o) => !o)}
        >
          Daftar isi <span aria-hidden="true">{open ? '▴' : '▾'}</span>
        </button>
        <ul id="sitenav-list" className={`sitenav__list${open ? ' is-open' : ''}`}>
          {NAV_ITEMS.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={active === i.id ? 'location' : undefined}
                onClick={() => setOpen(false)}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <motion.div className="sitenav__progress" style={{ scaleX: reduce ? scrollYProgress : smooth }} aria-hidden="true" />
    </nav>
  )
}
