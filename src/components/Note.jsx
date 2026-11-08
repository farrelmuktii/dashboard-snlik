/* Paragraf dengan catatan: di layar lebar catatan tampil di margin kanan (sidenote),
   di HP tampil sebagai catatan kecil tepat di bawah paragraf. */
export default function Note({ children, note, className = '' }) {
  return (
    <div className={`with-note ${className}`}>
      <div className="with-note__body">{children}</div>
      {note && <aside className="sidenote">{note}</aside>}
    </div>
  )
}
