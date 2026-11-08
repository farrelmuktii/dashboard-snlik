import { useEffect, useState } from 'react'
import './App.css'
import { loadData } from './data.js'
import Cover from './components/Cover.jsx'
import Opening from './components/Opening.jsx'
import Dashboard from './components/Dashboard.jsx'
import Terms from './components/Terms.jsx'
import Story from './components/Story.jsx'
import { SoWhat, Recommendations, Method, Sources, Footer } from './components/Closing.jsx'
import SiteNav from './components/SiteNav.jsx'
import QuickSummary from './components/QuickSummary.jsx'
import Position from './components/Position.jsx'

/* Foto cover subjudul (Unsplash, hanya kredit nama) */
const PHOTOS = {
  uang: {
    src: 'uang-rupiah.jpg',
    width: 1050,
    height: 1400,
    position: '50% 62%',
    alt: 'Lembaran uang kertas rupiah pecahan 10.000, 5.000, dan 2.000 serta satu koin 1.000 rupiah.',
    credit: 'Sasha India',
    creditUrl: 'https://unsplash.com/photos/5pf6UkrGFgo',
  },
  padar: {
    src: 'pulau-padar.jpg',
    width: 1800,
    height: 1200,
    position: '50% 55%',
    alt: 'Teluk di Pulau Padar, Nusa Tenggara Timur, dengan bukit hijau, pantai putih, dan puluhan kapal wisata.',
    credit: 'Rizknas',
    creditUrl: 'https://unsplash.com/photos/0ICJEbo0xPw',
  },
}

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('2025') // '2024' | '2025' | 'compare'
  const [selected, setSelected] = useState(null)
  const onSelect = (s) => setSelected((cur) => (s == null || cur === s ? null : s))

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    loadData().then(setData).catch(setError)
  }, [])

  return (
    <>
      <a className="skip" href="#dashboard">Langsung ke dashboard</a>
      <Cover data={data} />
      <main id="main">
        {error && (
          <div className="error" role="alert">
            <p><strong>Data tidak bisa dimuat.</strong> {error.message}</p>
            <button type="button" className="btn" onClick={() => location.reload()}>Coba lagi</button>
          </div>
        )}
        {!data && !error && <p className="loading" aria-live="polite">Memuat data…</p>}
        {data && (
          <>
            <SiteNav />
            <QuickSummary data={data} />
            <Opening data={data} />
            <Terms photo={PHOTOS.uang} />
            <Dashboard data={data} mode={mode} setMode={setMode} selected={selected} onSelect={onSelect} />
            <Story data={data} />
            <Position data={data} />
            <SoWhat photo={PHOTOS.padar} />
            <Recommendations />
            <Method />
            <Sources />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
