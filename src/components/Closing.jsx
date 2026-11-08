/* Bagian penutup: So what, Rekomendasi, Cara saya menganalisis, Sumber & batasan, Footer.
   Teks diambil dari versi lama (../dashboard-snlik/index.html), ditata ulang. */
import { CSV_FILES } from '../data.js'
import SectionCover from './SectionCover.jsx'
import Icon, { Badge } from './Icon.jsx'

const Li = ({ icon, children }) => (
  <li>
    <Icon name={icon} className="li-icon" />
    <span>{children}</span>
  </li>
)

export function SoWhat({ photo }) {
  return (
    <section className="section" aria-labelledby="sowhat-h">
      <SectionCover id="sowhat-h" title="Kenapa jarak ini penting bagi masyarakat dan industri" photo={photo} />
      <ol className="points">
        <li>
          <Badge name="lightbulb" tone="lit" />
          <h3>Edukasi saja tidak cukup</h3>
          <p>
            Kalau orang sudah paham tetapi tetap tidak memakai, hambatannya kemungkinan ada di tempat lain: akses,
            biaya, kepercayaan, atau memang tidak butuh. SNLIK tidak menanyakan alasannya, jadi hambatan ini perlu
            diteliti lebih lanjut.
          </p>
        </li>
        <li>
          <Badge name="shield-check" tone="inc" />
          <h3>Memakai tanpa paham itu berisiko</h3>
          <p>
            Di perbankan dan asuransi yang dibeli lewat belanja daring, orang bisa memakai produk tanpa memahami
            biaya, syarat klaim, atau risikonya. Ini membuka peluang kerugian konsumen dan penipuan.
          </p>
        </li>
        <li>
          <Badge name="storefront" tone="ink" />
          <h3>Ada pasar yang “sudah kenal”</h3>
          <p>
            Bagi industri, kesenjangan besar berarti banyak calon nasabah yang sudah tahu produknya tetapi belum
            mencoba. Hambatan terakhir inilah yang perlu dicari dan diturunkan.
          </p>
        </li>
      </ol>
    </section>
  )
}

export function Recommendations() {
  return (
    <section className="section" id="rekomendasi" aria-labelledby="rekomendasi-h">
      <div className="col">
        <h2 id="rekomendasi-h" className="h-section">Tiga kelompok, langkah yang realistis</h2>
        <p className="opinion">Bagian ini adalah pendapat penulis berdasarkan data di atas.</p>
      </div>
      <div className="recs">
        <div className="rec">
          <Badge name="users" tone="lit" />
          <p className="rec__who">Masyarakat</p>
          <h3>Cek sebelum pakai, pahami yang sudah dipakai</h3>
          <ul>
            <Li icon="list-checks">Sebelum memakai produk baru, cek tiga hal: biaya, risiko, dan izinnya di OJK.</Li>
            <Li icon="file-text">Baca ulang ketentuan produk yang sudah dimiliki, termasuk asuransi yang ikut terbeli saat belanja daring.</Li>
          </ul>
        </div>
        <div className="rec">
          <Badge name="briefcase" tone="inc" />
          <p className="rec__who">Industri jasa keuangan</p>
          <h3>Turunkan hambatan dari “tahu” ke “coba”</h3>
          <ul>
            <Li icon="coins">
              Tawarkan produk bernilai kecil dengan proses sederhana, terutama di sektor yang sudah dikenal luas
              seperti pergadaian dan pembiayaan.
            </Li>
            <Li icon="tag">Tampilkan biaya dan risiko secara jelas di titik penjualan, bukan hanya di dokumen panjang.</Li>
          </ul>
        </div>
        <div className="rec">
          <Badge name="scales" tone="ink" />
          <p className="rec__who">Regulator dan pemerintah</p>
          <h3>Ukur alasan, bukan hanya angka</h3>
          <ul>
            <Li icon="question">Tambahkan pertanyaan tentang alasan tidak memakai produk dalam survei berikutnya.</Li>
            <Li icon="chart-bar">Publikasikan rincian per sektor SNLIK 2026 agar perkembangan tiap sektor bisa dipantau publik.</Li>
            <Li icon="graduation-cap">Arahkan edukasi juga kepada orang yang sudah memakai produk tetapi belum memahaminya.</Li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Method() {
  return (
    <section className="section" id="cara" aria-labelledby="cara-h">
      <div className="col">
        <h2 id="cara-h" className="h-section">Cara saya menganalisis</h2>
        <p className="lead">Empat langkah, dari mengumpulkan angka sampai menuliskan batasannya.</p>
      </div>
      <ol className="method">
        <li>
          <Badge name="database" tone="lit" />
          <h3>Kumpulkan</h3>
          <p>
            Mengambil indeks literasi dan inklusi per sektor (2024–2025), nasional (2024–2026), dan syariah
            (2025–2026) dari rilis resmi SNLIK.
          </p>
        </li>
        <li>
          <Badge name="seal-check" tone="inc" />
          <h3>Verifikasi</h3>
          <p>
            Mencocokkan setiap angka dengan siaran pers OJK dan BPS serta liputan konferensi pers. Angka yang belum
            bisa dicocokkan diberi tanda †.
          </p>
        </li>
        <li>
          <Badge name="calculator" tone="ink" />
          <h3>Hitung</h3>
          <p>
            Menghitung kesenjangan (literasi − inklusi) dan perubahannya, hanya untuk sektor yang cakupannya sama
            antartahun.
          </p>
        </li>
        <li>
          <Badge name="note-pencil" tone="lit" />
          <h3>Catat batasan</h3>
          <p>Menuliskan perbedaan metode dan sampel antartahun agar perbandingan tidak menyesatkan.</p>
        </li>
      </ol>
      <div className="col downloads">
        <p className="downloads__label">Unduh data yang dipakai (CSV):</p>
        <div className="downloads__row">
          <a className="btn" href={CSV_FILES.sektor} download>Per sektor 2024–2025</a>
          <a className="btn" href={CSV_FILES.nasional} download>Nasional 2024–2026</a>
          <a className="btn" href={CSV_FILES.syariah} download>Syariah 2025–2026</a>
        </div>
      </div>
    </section>
  )
}

export function Sources() {
  const ext = { target: '_blank', rel: 'noopener noreferrer' }
  return (
    <section className="section sources-sec" aria-labelledby="sumber-h">
      <div className="col">
        <h2 id="sumber-h" className="h-section">Sumber data dan metode</h2>
        <ol className="sources">
          <li>
            OJK dan BPS,{' '}
            <a {...ext} href="https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/OJK-dan-BPS-Umumkan-Hasil-Survei-Nasional-Literasi-dan-Inklusi-Keuangan-Tahun-2024.aspx">
              Siaran Pers Bersama: Hasil SNLIK Tahun 2024
            </a>{' '}
            (2 Agustus 2024).
          </li>
          <li>
            OJK dan BPS,{' '}
            <a {...ext} href="https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/OJK-dan-BPS-Umumkan-Hasil-Survei-Nasional-Literasi-Dan-Inklusi-Keuangan-SNLIK-Tahun-2025.aspx">
              Siaran Pers Bersama SP 69/2025: Hasil SNLIK Tahun 2025
            </a>{' '}
            (2 Mei 2025).
          </li>
          <li>
            OJK, LPS, dan BPS,{' '}
            <a {...ext} href="https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/Hasil-SNLIK-Tahun-2026.aspx">
              Siaran Pers Bersama SPB 152/2026: Hasil SNLIK Tahun 2026
            </a>{' '}
            (11 Agustus 2026); juga di{' '}
            <a {...ext} href="https://www.bps.go.id/en/news/2026/08/22/936/indeks-literasi-dan-inklusi-keuangan-masyarakat-meningkat.-ojk--lps--dan-bps-umumkan--hasil-survei-nasional-literasi-dan-inklusi-keuangan--snlik--tahun-2026.html">
              situs BPS
            </a>
            .
          </li>
          <li>
            Rincian per sektor 2025 dan pembandingnya pada 2024, sebagaimana disampaikan OJK dalam konferensi pers
            2 Mei 2025:{' '}
            <a {...ext} href="https://keuangan.kontan.co.id/news/hasil-snlik-2025tingkat-literasiinklusi-perbankan-tertinggi-di-sektor-jasa-keuangan">Kontan</a>,{' '}
            <a {...ext} href="https://www.antaranews.com/berita/4809737/ojk-bank-masih-jadi-penopang-indeks-literasi-dan-inklusi-tertinggi">ANTARA</a>,{' '}
            <a {...ext} href="https://keuangan.kontan.co.id/news/ojk-beberkan-penyebab-indeks-literasi-perasuransian-naik-menjadi-4545-pada-2025">Kontan (perasuransian)</a>, dan{' '}
            <a {...ext} href="https://finansial.bisnis.com/read/20250502/90/1873897/hasil-snlik-2025-literasi-dan-inklusi-keuangan-nonbank-masih-tertinggal-dari-perbankan">Bisnis.com (pasar modal)</a>.
          </li>
          <li>
            Foto dari Unsplash (lisensi Unsplash):{' '}
            <a {...ext} href="https://unsplash.com/photos/5pf6UkrGFgo">uang rupiah oleh Sasha India</a>,{' '}
            <a {...ext} href="https://unsplash.com/photos/LhoUx4AzVco">Tugu Yogyakarta oleh Dhio Gandhi</a> (cover), dan{' '}
            <a {...ext} href="https://unsplash.com/photos/0ICJEbo0xPw">Pulau Padar oleh Rizknas</a>.
          </li>
          <li>
            Komponen antarmuka yang diadaptasi (lisensi MIT): penghitung angka dari “Count Up” karya unlumen dan
            tombol tahun dari “Segmented Control” karya Özer (ddoemonn), keduanya dari 21st.dev.
          </li>
        </ol>

        <h3 className="h-sub limits-h">Batasan yang perlu diingat</h3>
        <ul className="limits">
          <li>Data per sektor memakai <strong>metode keberlanjutan</strong> SNLIK, yang cakupannya sama pada 2024 dan 2025.</li>
          <li>
            Rilis resmi SNLIK 2026 belum memuat rincian sembilan sektor. Karena itu peta sektor memakai data
            2024–2025, sedangkan data 2026 dipakai untuk konteks nasional dan syariah.
          </li>
          <li>
            Indeks nasional 2026 (komprehensif) dan 2025 (cakupan DNKI) memakai metode dan sampel berbeda dari
            metode keberlanjutan, jadi tidak dibandingkan langsung dengan angka per sektor.
          </li>
          <li>“LJK Lainnya” tidak sebanding antartahun karena cakupannya diperluas pada 2025 (ditandai *).</li>
          <li>
            Lima angka sektor tahun 2024 (lembaga pembiayaan, dana pensiun, pergadaian, fintech lending, LJK
            lainnya) belum dapat dicocokkan dengan dokumen resmi yang tersedia daring, dan ditandai †.
          </li>
          <li>
            Kesenjangan adalah ukuran buatan penulis. Literasi dan inklusi diukur dari populasi yang sama, tetapi
            tidak menunjukkan apakah orang yang memakai adalah orang yang sama dengan yang paham.
          </li>
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <img
        className="footer__img"
        src={`${import.meta.env.BASE_URL}foto/tugu-yogyakarta.jpg`}
        width={1800}
        height={1200}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <div className="footer__scrim" aria-hidden="true" />
      <div className="footer__inner">
        <p className="footer__name">Farrel Mukti Attallah</p>
        <p>Fakultas Ekonomi dan Bisnis · Universitas Indonesia</p>
        <p>
          <a href="https://www.linkedin.com/in/farrelmuktiattallah/" target="_blank" rel="noopener noreferrer">
            LinkedIn: farrelmuktiattallah
          </a>
        </p>
        <p className="footer__small">Data: SNLIK 2024–2026 (OJK, BPS, LPS). Bukan publikasi resmi OJK.</p>
        <p className="footer__small">
          Foto:{' '}
          <a href="https://unsplash.com/photos/LhoUx4AzVco" target="_blank" rel="noopener noreferrer">
            Dhio Gandhi / Unsplash
          </a>
        </p>
      </div>
    </footer>
  )
}
