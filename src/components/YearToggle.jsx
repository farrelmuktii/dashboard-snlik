/* Tombol pilihan tahun dengan latar yang meluncur.
   Diadaptasi dari "Segmented Control" karya Özer (ddoemonn) di 21st.dev, lisensi MIT:
   https://21st.dev/@ddoemonn/components/segmented-control · https://github.com/ddoemonn/interior
   Yang dipertahankan: pola radiogroup, navigasi panah/Home/End, roving tabindex, thumb meluncur.
   Yang diubah: tanpa Tailwind, bayangan, dan teks bertopeng; warna dari token proyek;
   tinggi target sentuh 44 px; pegas mengikuti "rasa gerak" halaman. */
import { useRef } from 'react'
import { motion } from 'motion/react'
import { useSpring } from '../motion.js'

export default function YearToggle({ options, value, onChange, label }) {
  const { spring } = useSpring()
  const btns = useRef([])
  const count = options.length
  const index = Math.max(0, options.findIndex((o) => o.value === value))

  const go = (i) => {
    const next = (i + count) % count
    btns.current[next]?.focus()
    onChange(options[next].value)
  }
  const onKeyDown = (e, i) => {
    const map = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: count - 1 }
    if (e.key in map) { e.preventDefault(); go(map[e.key]) }
  }

  return (
    <div className="seg" role="radiogroup" aria-label={label} style={{ '--n': count }}>
      <motion.span
        className="seg__thumb"
        aria-hidden="true"
        initial={false}
        animate={{ x: `${index * 100}%` }}
        transition={spring}
      />
      {options.map((o, i) => (
        <button
          key={o.value}
          ref={(n) => (btns.current[i] = n)}
          type="button"
          role="radio"
          aria-checked={i === index}
          tabIndex={i === index ? 0 : -1}
          className="seg__btn"
          onClick={() => onChange(o.value)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
