/* Cover subjudul: foto melebar dengan judul bagian rata kanan di atasnya (gaya sama dengan cover utama).
   Foto hanya diberi kredit nama fotografer. Tanpa foto, judul tampil biasa. */
const BASE = import.meta.env.BASE_URL

export default function SectionCover({ id, title, photo }) {
  if (!photo) {
    return (
      <h2 id={id} className="h-section">
        {title}
      </h2>
    )
  }
  return (
    <div className="sec-cover">
      <img
        className="sec-cover__img"
        src={`${BASE}foto/${photo.src}`}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        style={{ objectPosition: photo.position ?? '50% 50%' }}
      />
      <div className="sec-cover__scrim" aria-hidden="true" />
      <h2 id={id} className="sec-cover__title">
        {title}
      </h2>
      <p className="sec-cover__credit">
        Foto:{' '}
        <a href={photo.creditUrl} target="_blank" rel="noopener noreferrer">
          {photo.credit} / Unsplash
        </a>
      </p>
    </div>
  )
}
