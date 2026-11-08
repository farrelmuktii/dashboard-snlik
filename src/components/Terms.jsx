/* Penjelasan singkat istilah: literasi = paham, inklusi = pakai. */
import SectionCover from './SectionCover.jsx'
import { Badge } from './Icon.jsx'

export default function Terms({ photo }) {
  return (
    <section className="section terms" aria-labelledby="istilah-h">
      <SectionCover id="istilah-h" title="Paham dan pakai adalah dua hal yang berbeda" photo={photo} />
      <div className="col">
        <p className="lead">
          Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) dari OJK dan BPS mengukur dua hal pada penduduk
          dewasa Indonesia.
        </p>
      </div>
      <dl className="terms__grid">
        <div className="term term--lit">
          <dt>
            <Badge name="lightbulb" tone="lit" />
            <span className="term__word paham">Literasi keuangan</span>
            <span className="term__eq">artinya paham</span>
          </dt>
          <dd>
            <p>
              Tahu cara kerja, manfaat, dan risiko suatu produk keuangan, termasuk hak dan kewajiban sebagai
              konsumen.
            </p>
            <p className="term__ex">
              Contoh: tahu bahwa emas bisa digadaikan, berapa biayanya, dan apa yang terjadi kalau terlambat
              menebus.
            </p>
          </dd>
        </div>
        <div className="term term--inc">
          <dt>
            <Badge name="hand-tap" tone="inc" />
            <span className="term__word pakai">Inklusi keuangan</span>
            <span className="term__eq">artinya pakai</span>
          </dt>
          <dd>
            <p>
              Benar-benar memakai produk atau layanan dari lembaga jasa keuangan, misalnya rekening, polis
              asuransi, pinjaman, atau investasi.
            </p>
            <p className="term__ex">Contoh: pernah menggadaikan emas di lembaga pergadaian resmi.</p>
          </dd>
        </div>
      </dl>
      <div className="col">
        <p className="kesenjangan-def">
          <svg className="motif motif--inline" viewBox="0 0 56 24" aria-hidden="true">
            <line x1="10" y1="12" x2="44" y2="12" />
            <circle className="motif__inc" cx="10" cy="12" r="5.5" />
            <circle className="motif__lit" cx="44" cy="12" r="6.5" />
          </svg>
          <span>
            <strong>Kesenjangan</strong> = indeks literasi dikurangi indeks inklusi, dalam poin persen. Makin besar
            angkanya, makin jauh jarak antara paham dan pakai. Ukuran ini bacaan penulis, bukan indikator resmi OJK.
          </span>
        </p>
      </div>
    </section>
  )
}
