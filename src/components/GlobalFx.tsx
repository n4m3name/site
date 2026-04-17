import { useEffect, useRef, useState } from 'react'
import GlitchBurst from './GlitchBurst'

const ACCENTS = [
  '#E60012', // original arch red
  '#00FF41', // matrix green
  '#00FFFF', // cyan
  '#FF00FF', // magenta
  '#FFFF00', // yellow
  '#FF6600', // safety orange
  '#FF1493', // hot pink
]

const STORAGE = { accent: 'fx.accent', light: 'fx.light' }

export default function GlobalFx() {
  const [trigger, setTrigger] = useState(0)
  const accentIdx = useRef(0)

  useEffect(() => {
    const savedAccent = localStorage.getItem(STORAGE.accent)
    if (savedAccent) {
      const idx = ACCENTS.indexOf(savedAccent)
      if (idx >= 0) accentIdx.current = idx
      document.documentElement.style.setProperty('--accent', savedAccent)
    }
    if (localStorage.getItem(STORAGE.light) === '1') {
      document.documentElement.classList.add('light')
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === 'c') {
        accentIdx.current = (accentIdx.current + 1) % ACCENTS.length
        const next = ACCENTS[accentIdx.current]
        document.documentElement.style.setProperty('--accent', next)
        localStorage.setItem(STORAGE.accent, next)
      } else if (e.key === 'l') {
        const root = document.documentElement
        root.classList.toggle('light')
        localStorage.setItem(STORAGE.light, root.classList.contains('light') ? '1' : '0')
      } else if (e.key === 'g') {
        setTrigger((t) => t + 1)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return <GlitchBurst trigger={trigger} />
}
