# Kesenjangan Literasi & Inklusi Keuangan — versi React

Judul website: **Kesenjangan Literasi & Inklusi Keuangan**

## Tujuan
Website dashboard untuk **portofolio magang**, dibaca **orang awam dan rekruter**.
Harus terasa **berkelas, kreatif, dan insightful**, dan **tidak terlihat seperti
template buatan AI**. Pembaca paham ceritanya dalam 1–2 menit.

Penulis: **Farrel Mukti Attallah · Fakultas Ekonomi dan Bisnis · Universitas Indonesia**
LinkedIn: https://www.linkedin.com/in/farrelmuktiattallah/
Tampilkan di byline (atas) dan footer.

## Sumber kebenaran isi
Versi sebelumnya (HTML biasa, sudah ditinjau) ada di `../dashboard-snlik/`:
- `index.html` = semua teks (pembuka, istilah, insight, so what, rekomendasi,
  cara analisis, sumber, batasan). Pakai isinya; boleh ditata ulang, jangan
  mengubah fakta atau angka.
- `app.js` = logika yang sudah teruji: mode 2024 / 2025 / 2024 → 2025, sorotan
  sektor yang terhubung antargrafik, anotasi, scrollytelling, penempatan label
  peta sebar, tanda †.
- `CLAUDE.md` di folder itu = aturan data lengkap.
Jangan mengubah file di `../dashboard-snlik/`; itu cadangan.

## Keputusan desain (hasil diskusi 7 Nov 2026)
- **A. Arah: editorial / jurnalisme data** (rujukan gaya: The Pudding, Reuters
  Graphics, FT, NYT Upshot).
  - Tanpa kartu/kotak berbayang. Pemisah = garis tipis dan ruang kosong.
  - Tanpa ikon dekoratif, tanpa label huruf kapital di atas setiap judul.
    (8 Nov 2026: atas permintaan penulis, poin dan sub-poin (istilah, So what, Rekomendasi, Cara analisis) diberi ikon Phosphor berwarna
    yang mewakili isi poin; warna tetap dari palet --lit / --inc / --ink-2.)
  - Cover (8 Nov 2026): foto Tugu Yogyakarta (Dhio Gandhi / Unsplash) selayar penuh dengan lapisan gelap, judul + byline + "55 paham. 8 pakai." di atasnya (warna palet gelap). Foto lain hanya dengan kredit nama, tanpa keterangan panjang.
  - Latar (8 Nov 2026): putih untuk bagian bacaan; pita "biru kabut" `--band` (#eef2f4 terang / #1b1f22 gelap, kontras diuji) untuk dashboard dan insight; footer berlatar foto Tugu gelap, rata kanan.
  - Fitur tambahan (8 Nov 2026): navigasi bar tipis + garis progres baca (muncul setelah cover), "Ringkasan 30 detik" di bawah cover, bagian "Kamu di posisi mana?" (dihitung di browser, tidak disimpan; tanpa LJK Lainnya), gambar pratinjau `public/og-image.jpg` (og:image memakai URL https://farrelmuktii.github.io/dashboard-snlik/).
  - Pertanyaan pembuka memakai efek "kata menyala saat digulir" (`ScrollWords.jsx`), diadaptasi dari contoh resmi Motion "Scroll word reveal" di 21st.dev; ditulis ulang tanpa Tailwind/TS/shadcn.
  - Pembuka berani: layar pertama berisi huruf besar **"55 paham. 8 pakai."**
    (Pergadaian 2025, dibulatkan) + dua grid 100 ikon orang yang terisi
    bertahap. Pertanyaan pembuka menyusul sebagai dek.
  - Judul bagian berupa **pernyataan**, bukan pertanyaan template.
  - Catatan pakai **sidenote di margin** (layar lebar) / catatan kecil di bawah
    paragraf (HP), bukan kotak catatan.
  - Kolom teks ±680 px; grafik boleh lebih lebar dari kolom teks.
- **B1. 21st.dev**: hanya inspirasi + **maksimal 2 komponen kecil**
  (kandidat: penghitung angka, tombol pilihan dengan latar meluncur, garis
  progres baca). Cek lisensinya. Tulis ulang dengan CSS proyek ini; buang
  glow, gradien, glassmorphism. Kuota gratis: ambil kode 2×/hari, buat
  komponen AI tidak tersedia. MCP aktif lewat `.mcp.json` (berisi API key,
  sudah di `.gitignore`; jangan pernah menampilkan isinya).
- **C1. Tanpa Tailwind.** CSS sendiri dengan token di `src/index.css`.
- **Font**: Newsreader (judul dan teks, Google Fonts) + IBM Plex Sans (label
  grafik, angka tabel, kontrol). Bukan Inter.
- **Palet "Tinta & Terakota"** (sudah lolos uji kontras WCAG AA terang/gelap):
  terang `--bg #ffffff` (putih; diganti dari krem #f7f5f0 pada 8 Nov 2026, kontras diuji ulang: teks 16,6:1, lit 7,7:1, inc 5,3:1, gap 4,1:1), `--ink #1b1f24`, `--muted #62666b`, `--lit #1f5a6b`
  (paham), `--inc #b9471f` (pakai), `--gap #837d73` (garis kesenjangan);
  gelap `--bg #141618`, `--ink #eceae6`, `--muted #9b978f`, `--lit #6fb7c9`,
  `--inc #e98a62`, `--gap #77726a`. Warna hanya untuk data; sisanya netral.
  Jika menambah warna, uji kontrasnya dulu.
- Skala huruf (dinaikkan 8 Nov 2026): 14/16/18/20/24/36/56 px (token `--fs-xs` s.d. `--fs-2xl`; teks bacaan 20 px, huruf terkecil 14 px) + ukuran besar khusus pembuka; jarak
  kelipatan 8 px.

## Gerak (Framer Motion, paket `motion`, impor dari `motion/react`)
- Hanya gerak yang bermakna: titik meluncur saat grafik terlihat, titik
  bergeser saat tahun diganti, baris bertukar urutan, angka berhitung, ikon
  orang terisi, sektor lain memudar saat satu disorot, sorotan scrollytelling.
- Satu "rasa gerak": pegas tenang (mis. stiffness ±100, damping ±20), tanpa
  pantulan berlebihan.
- Wajib menghormati `prefers-reduced-motion` (`useReducedMotion` → durasi 0).
- Data harus terbaca tanpa menunggu animasi.

## Skill UI UX Pro Max
Skill ada di `~/.claude/skills/ui-ux-pro-max/`. Pakai aturannya
(`references/quick-reference.md`) sebagai daftar cek: kontras, target sentuh
≥ 24 px (≥ 44 px untuk elemen grafik di HP), fokus keyboard, tabel bisa
diurutkan dengan `aria-sort`, deskripsi grafik untuk pembaca layar, tanpa
geser horizontal di HP. Jika Python sudah aktif (setelah Command Line Tools
terpasang), boleh jalankan `scripts/search.py` untuk mencari pola tipografi
dan gaya "editorial data journalism".

## Aturan data (ringkas; lengkapnya di ../dashboard-snlik/CLAUDE.md)
- Semua angka dari CSV di `public/data/`. Jangan mengarang atau mengambil dari ingatan.
- `SNLIK_sektor_literasi_inklusi.csv`: kolom `verifikasi` = `belum` untuk angka
  2024 Lembaga Pembiayaan, Dana Pensiun, Pergadaian, Fintech Lending, LJK
  Lainnya → tandai †, dan jangan jadikan dasar insight.
- "LJK Lainnya" tidak sebanding antartahun (cakupan 2025 diperluas).
- "Kesenjangan" = literasi − inklusi (poin persen), ukuran buatan penulis.
- Literasi dan inklusi bukan corong: tulis "dari 100 orang dewasa, X paham dan Y
  memakai", bukan "dari yang paham, X memakai".
- SNLIK 2026 belum punya rincian 9 sektor; 2026 hanya untuk konteks nasional
  (inklusi 93,61%) dan syariah. Sampel 2026 berbeda jauh, beri catatan.
- Cantumkan sumber di setiap grafik. Bahasa Indonesia ramah awam. Tanpa logo
  atau branding resmi OJK/BPS/LPS.

## Teknis
- Vite + React + `motion`. `vite.config.js` memakai `base: './'` agar bisa
  dihosting di GitHub Pages.
- Struktur yang disarankan: `src/data.js` (muat CSV, format angka),
  `src/components/` (Dumbbell, Scatter, PeopleGrid, CountUp, Story, Table),
  `src/App.jsx`, `src/App.css`, `src/index.css` (token).
- Grafik SVG digambar dengan lebar piksel asli (ResizeObserver), bukan viewBox
  yang mengecil, supaya label tetap terbaca di HP.
- Jalankan: `npm run dev` (port 5173). Build: `npm run build`.

## Cara memeriksa sebelum melapor selesai
Buka di browser dan cek: laptop (±1280 px), HP (375 px), mode gelap, mode
2024 → 2025, sorotan sektor, scrollytelling, tidak ada error di konsol, tidak
ada geser horizontal. Laporkan jujur apa yang belum bisa diuji.
