export function triggerShortcut(key: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

const HINTS: { key: string; label: string }[] = [
  { key: 'h', label: 'help' },
  { key: 's', label: 'site map' },
]

export default function NavHints() {
  return (
    <div className="flex items-center gap-2 text-sm">
      {HINTS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={(e) => {
            e.preventDefault()
            triggerShortcut(key)
          }}
          aria-label={label}
          className="leading-none text-white/40 hover:text-[var(--accent)] transition-colors -m-1 p-1 cursor-pointer"
        >
          [{key}]
        </button>
      ))}
    </div>
  )
}
