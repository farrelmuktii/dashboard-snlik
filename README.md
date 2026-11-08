# Kesenjangan Literasi & Inklusi Keuangan

**55 paham. 8 pakai.** Dari 100 orang dewasa Indonesia, 55 paham cara kerja pergadaian, tetapi hanya 8 yang memakainya.
Dashboard ini menelusuri jarak antara *paham* (literasi) dan *pakai* (inklusi) di sembilan sektor keuangan Indonesia,
berdasarkan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) 2024–2026.

Oleh **Farrel Mukti Attallah** · Fakultas Ekonomi dan Bisnis · Universitas Indonesia
[LinkedIn](https://www.linkedin.com/in/farrelmuktiattallah/)

## Isi halaman
- **Ringkasan 30 detik**: tiga temuan utama untuk pembaca yang sibuk.
- **Dashboard**: grafik dumbbell kesenjangan per sektor (2024 / 2025 / 2024 → 2025), peta sebar literasi lawan inklusi,
  dan tabel yang bisa diurutkan; sorotan sektor terhubung di semua grafik.
- **Empat temuan**: grafik bercerita yang menyorot sektor saat digulir.
- **Kamu di posisi mana?**: pembaca menandai sektor yang ia pahami dan pakai; dihitung di browser, tidak disimpan.
- **Rekomendasi** untuk masyarakat, industri jasa keuangan, dan regulator (pendapat penulis).
- **Cara saya menganalisis** dan **sumber & batasan** data, dengan file CSV yang bisa diunduh.

## Data
Semua angka dibaca dari CSV di `public/data/`:

| File | Isi |
|---|---|
| `SNLIK_sektor_literasi_inklusi.csv` | 9 sektor, 2024 dan 2025, metode keberlanjutan |
| `SNLIK_nasional.csv` | indeks nasional 2024, 2025 (dua metode), 2026 |
| `SNLIK_2026_syariah.csv` | syariah 2025 dan 2026 |

Sumber utama: Siaran Pers Bersama OJK–BPS SP 69/2025 dan OJK–LPS–BPS SPB 152/2026. Lima angka sektor 2024 belum dapat
dicocokkan dengan dokumen resmi daring dan ditandai †. "Kesenjangan" (literasi − inklusi) adalah ukuran buatan penulis,
bukan indikator resmi OJK.

## Teknologi
- [Vite](https://vite.dev) + React, tanpa Tailwind (CSS sendiri dengan token di `src/index.css`)
- [Motion](https://motion.dev) untuk animasi; semua animasi mati jika pengguna memilih "kurangi gerak"
- Grafik SVG digambar sendiri dengan lebar piksel asli agar label tetap terbaca di HP
- Mode gelap, rapi di layar 375 px, kontras warna diuji (WCAG AA)

## Menjalankan di komputer
```bash
npm install
npm run dev      # buka http://localhost:5173
npm run build    # hasil siap terbit di folder dist/
```

Situs: [farrelmuktii.github.io/dashboard-snlik](https://farrelmuktii.github.io/dashboard-snlik/). Diterbitkan otomatis ke GitHub Pages lewat `.github/workflows/deploy.yml` setiap ada perubahan di cabang `main`.

## Kredit
- Foto (lisensi Unsplash): [Tugu Yogyakarta](https://unsplash.com/photos/LhoUx4AzVco) oleh Dhio Gandhi,
  [uang rupiah](https://unsplash.com/photos/5pf6UkrGFgo) oleh Sasha India,
  [Pulau Padar](https://unsplash.com/photos/0ICJEbo0xPw) oleh Rizknas.
- Ikon: [Phosphor Icons](https://github.com/phosphor-icons/core) (MIT).
- Komponen yang diadaptasi dari [21st.dev](https://21st.dev) (MIT): "Count Up" karya unlumen dan "Segmented Control" karya
  Özer (ddoemonn); efek kata menyala diadaptasi dari contoh resmi Motion "Scroll word reveal".
- Huruf: Newsreader dan IBM Plex Sans (Google Fonts, SIL Open Font License).

Bukan publikasi resmi OJK, BPS, atau LPS.
