import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  label?: string
  children: ReactNode
}

export default function RefPreview({ label = 'ref.md', children }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation()
        setOpen(false)
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey, true)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey, true)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[var(--accent)] hover:text-white transition-colors underline underline-offset-2 cursor-pointer"
      >
        {label}
      </button>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 overflow-auto backdrop-blur-sm sm:p-8"
            onClick={() => setOpen(false)}
          >
            <div className="bg-black/95 backdrop-blur-sm p-8 min-h-full sm:min-h-0 sm:max-w-2xl sm:mx-auto">
              <div className="prose-mdx font-mono text-sm">{children}</div>
              <p className="mt-8 font-mono text-white/40 text-xs">click anywhere to close</p>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
