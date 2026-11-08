/* "Kamu di posisi mana?": pembaca menandai sektor yang ia pahami dan pakai, lalu
   melihat posisinya di antara angka nasional SNLIK 2025.
   Privasi: semua dihitung di browser pembaca; tidak ada yang disimpan atau dikirim.
   "LJK Lainnya" tidak diikutkan karena isinya beragam dan sulit dikenali pembaca awam. */
import { useMemo, useState } from 'react'
import { rowsFor, pct } from '../data.js'
import Icon, { Badge } from './Icon.jsx'

/* Contoh produk per sektor, agar pembaca awam mudah mengenali (bukan data) */
const HINT = {
  Perbankan: 'rekening tabungan, kartu debit, transfer bank',
  'Pasar Modal': 'saham, reksa dana, obligasi',
  Perasuransian: 'asuransi kesehatan, jiwa, atau kendaraan',
  'Lembaga Pembiayaan': 'kredit motor atau mobil, cicilan barang',
  'Dana Pensiun': 'program pensiun selain BPJS',
  Pergadaian: 'menggadaikan emas atau barang',
  'Lembaga Keuangan Mikro': 'simpanan atau pinjaman kecil di LKM',
  'Fintech Lending': 'pinjaman daring berizin OJK',
}

export default function Position({ data }) {
  const rows = useMemo(
    () => rowsFor(data.sektor, 2025).filter((r) => HINT[r.sektor]).sort((a, b) => b.lit - a.lit),
    [data],
  )
  const [sel, setSel] = useState({}) // { sektor: { paham, pakai } }
  const toggle = (s, k) => setSel((x) => ({ ...x, [s]: { ...x[s], [k]: !x[s]?.[k] } }))

  const paham = rows.filter((r) => sel[r.sektor]?.paham)
  const pakai = rows.filter((r) => sel[r.sektor]?.pakai)
  const pahamSaja = rows.filter((r) => sel[r.sektor]?.paham && !sel[r.sektor]?.pakai)
  const pakaiSaja = rows.filter((r) => sel[r.sektor]?.pakai && !sel[r.sektor]?.paham)
  const touched = paham.length + pakai.length > 0
  const list = (arr) => arr.map((r) => r.sektor.toLowerCase()).join(', ')

  return (
    <section className="section position" id="posisi" aria-labelledby="posisi-h">
      <div className="col">
        <h2 id="posisi-h" className="h-section">Kamu di posisi mana?</h2>
        <p className="lead">
          Tandai sektor yang kamu <span className="paham">pahami</span> (tahu cara kerja, biaya, dan risikonya) dan
          yang pernah kamu <span className="pakai">pakai</span>. Lihat posisimu di antara orang dewasa Indonesia.
        </p>
        <p className="privacy">
          <Icon name="shield-check" className="privacy__icon" />
          Pilihanmu hanya dihitung di perangkatmu. Tidak ada yang disimpan atau dikirim.
        </p>
      </div>

      <div className="position__grid">
        <ul className="pos-list" aria-label="Sektor keuangan">
          {rows.map((r) => {
            const s = sel[r.sektor] ?? {}
            return (
              <li key={r.sektor} className="pos-row">
                <div className="pos-row__name">
                  <strong>{r.sektor}</strong>
                  <span>{HINT[r.sektor]}</span>
                </div>
                <div className="pos-row__btns" role="group" aria-label={r.sektor}>
                  <button
                    type="button"
                    className="pos-btn pos-btn--lit"
                    aria-pressed={!!s.paham}
                    onClick={() => toggle(r.sektor, 'paham')}
                  >
                    Paham
                  </button>
                  <button
                    type="button"
                    className="pos-btn pos-btn--inc"
                    aria-pressed={!!s.pakai}
                    onClick={() => toggle(r.sektor, 'pakai')}
                  >
                    Pakai
                  </button>
                </div>
                {(s.paham || s.pakai) && (
                  <p className="pos-row__status">
                    Kamu {s.paham ? 'termasuk' : 'belum termasuk'} <span className="paham">{pct(r.lit)}</span> orang
                    dewasa yang paham, dan {s.pakai ? 'termasuk' : 'belum termasuk'}{' '}
                    <span className="pakai">{pct(r.inc)}</span> yang memakai.
                  </p>
                )}
              </li>
            )
          })}
        </ul>

        <div className="pos-result" aria-live="polite">
          <Badge name="users" tone="ink" />
          {!touched ? (
            <p className="pos-result__empty">Tandai minimal satu sektor untuk melihat posisimu.</p>
          ) : (
            <>
              <p className="pos-result__big">
                Kamu paham <strong className="paham">{paham.length}</strong> dan memakai{' '}
                <strong className="pakai">{pakai.length}</strong> dari {rows.length} sektor.
              </p>
              {pahamSaja.length > 0 && (
                <p>
                  <strong>Paham tapi belum pakai:</strong> {list(pahamSaja)}. Polanya sama dengan kebanyakan orang
                  dewasa Indonesia: tahu, tetapi belum mencoba.
                </p>
              )}
              {pakaiSaja.length > 0 && (
                <p>
                  <strong>Pakai tapi belum yakin paham:</strong> {list(pakaiSaja)}. Mirip pola perbankan nasional.
                  Ada baiknya cek lagi biaya, syarat, dan risikonya.
                </p>
              )}
              {pahamSaja.length === 0 && pakaiSaja.length === 0 && (
                <p>Untuk sektor yang kamu tandai, paham dan pakaimu sejalan.</p>
              )}
            </>
          )}
          <p className="pos-result__note">
            Ini perkiraan diri sendiri, bukan pengukuran SNLIK. SNLIK mengukur literasi lewat kuesioner rinci.
            Angka nasional: SNLIK 2025, OJK dan BPS.
          </p>
        </div>
      </div>
    </section>
  )
}
