/* Memuat CSV dari public/data/ dan menyiapkan baris untuk grafik.
   Logika diambil dari app.js versi lama (../dashboard-snlik/). */

const BASE = import.meta.env.BASE_URL

function parseCSV(text) {
  const lines = text.replace(/^﻿/, '').trim().split(/\r?\n/) // buang BOM di awal file
  const split = (line) => {
    const out = []
    let cur = ''
    let q = false
    for (const ch of line) {
      if (ch === '"') q = !q
      else if (ch === ',' && !q) { out.push(cur); cur = '' }
      else cur += ch
    }
    out.push(cur)
    return out.map((s) => s.trim())
  }
  const head = split(lines[0])
  return lines.slice(1).map((l) => {
    const cells = split(l)
    return Object.fromEntries(head.map((h, i) => [h, cells[i]]))
  })
}

async function loadCSV(name) {
  const res = await fetch(`${BASE}data/${name}`)
  if (!res.ok) throw new Error(`${name} (${res.status})`)
  return parseCSV(await res.text())
}

export async function loadData() {
  const [sektor, nasional, syariah] = await Promise.all([
    loadCSV('SNLIK_sektor_literasi_inklusi.csv'),
    loadCSV('SNLIK_nasional.csv'),
    loadCSV('SNLIK_2026_syariah.csv'),
  ])
  return { sektor, nasional, syariah }
}

export const CSV_FILES = {
  sektor: `${BASE}data/SNLIK_sektor_literasi_inklusi.csv`,
  nasional: `${BASE}data/SNLIK_nasional.csv`,
  syariah: `${BASE}data/SNLIK_2026_syariah.csv`,
}

/* ---------- Format angka (gaya Indonesia: koma desimal) ---------- */
export const fmt = (v, d = 2) =>
  Number(v).toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d })
export const pct = (v) => fmt(v) + '%'
export const signed = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v))

/* ---------- Baris per sektor untuk satu tahun ---------- */
export function rowsFor(sektor, year) {
  const by = (y) => new Map(sektor.filter((r) => +r.tahun === y).map((r) => [r.sektor, r]))
  const cur = by(year)
  const prev = by(2024)
  return [...cur.values()].map((r) => {
    const p = prev.get(r.sektor)
    const lit = +r.literasi_persen
    const inc = +r.inklusi_persen
    const flag = !r.sebanding_antartahun.startsWith('ya') // LJK Lainnya: cakupan 2025 diperluas
    const lit24 = p ? +p.literasi_persen : null
    const inc24 = p ? +p.inklusi_persen : null
    return {
      sektor: r.sektor,
      tahun: year,
      lit,
      inc,
      gap: lit - inc,
      flag,
      unverified: r.verifikasi === 'belum',
      lit24,
      inc24,
      prevUnverified: p ? p.verifikasi === 'belum' : false,
      delta: year === 2025 && !flag && p ? lit - inc - (lit24 - inc24) : null,
    }
  })
}

export const nasionalOf = (nasional, tahun, metode) =>
  nasional.find((r) => r.tahun === String(tahun) && (!metode || r.metode === metode))

export const syariahOf = (syariah, tahun, kata) =>
  +syariah.find((r) => r.tahun === String(tahun) && r.ukuran.includes(kata)).nilai_persen

/* Nama pendek untuk grafik ringkas */
export const SHORT = {
  'Lembaga Keuangan Mikro': 'LKM',
  'Lembaga Pembiayaan': 'Pembiayaan',
  Perasuransian: 'Asuransi',
  'Fintech Lending': 'Fintech',
}

/* Deskripsi grafik untuk pembaca layar */
export function chartLabel(rows) {
  const top = [...rows].sort((a, b) => b.gap - a.gap)[0]
  return `Grafik literasi dan inklusi ${rows.length} sektor, tahun ${rows[0].tahun}. Kesenjangan terbesar di ${top.sektor} (${fmt(top.gap)} poin).`
}
