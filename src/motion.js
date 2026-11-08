/* Satu "rasa gerak" untuk seluruh halaman: pegas tenang tanpa pantulan berlebihan. */
import { useReducedMotion } from 'motion/react'

export const SPRING = { type: 'spring', stiffness: 100, damping: 20 }

/* Kembalikan transisi; jika pengguna memilih "kurangi gerak", durasi menjadi 0. */
export function useSpring() {
  const reduce = useReducedMotion()
  return { reduce, spring: reduce ? { duration: 0 } : SPRING }
}
