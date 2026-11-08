/* Keterangan saat titik/baris disentuh, diarahkan kursor, atau difokus dengan keyboard. */
import { pct, signed } from '../data.js'

export function TipBody({ r, mode }) {
  const d = r.unverified ? ' †' : ''
  return (
    <>
      <b>{r.sektor} · {r.tahun}</b>
      <span className="tip__row"><span>Literasi (paham)</span><span className="paham">{pct(r.lit)}{d}</span></span>
      <span className="tip__row"><span>Inklusi (pakai)</span><span className="pakai">{pct(r.inc)}{d}</span></span>
      <span className="tip__row"><span>Kesenjangan</span><span>{signed(r.gap)} poin</span></span>
      {mode === 'compare' && r.delta != null && (
        <span className="tip__row"><span>Perubahan sejak 2024</span><span>{signed(r.delta)}{r.prevUnverified ? ' †' : ''}</span></span>
      )}
      {r.flag && <span className="tip__f">Cakupan diperluas pada 2025; tidak sebanding antartahun.</span>}
      {(r.unverified || (mode === 'compare' && r.prevUnverified)) && (
        <span className="tip__f">† Angka 2024 belum dicocokkan dengan dokumen resmi.</span>
      )}
    </>
  )
}

/* x, y = titik acuan dalam koordinat kontainer; w = lebar kontainer. */
export default function Tooltip({ tip, w, mode }) {
  if (!tip) return null
  const TW = 264
  let left = tip.x + 16
  if (left + TW > w) left = tip.x - TW - 16
  if (left < 0) left = Math.max(0, Math.min(w - TW, tip.x - TW / 2))
  const below = tip.y < 120
  return (
    <div
      className="tip"
      role="status"
      style={{ left, top: below ? tip.y + 18 : tip.y - 12, transform: below ? 'none' : 'translateY(-100%)', width: TW }}
    >
      <TipBody r={tip.r} mode={mode} />
    </div>
  )
}
