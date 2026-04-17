import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlitchBurst from './GlitchBurst'
import { CONTENT } from '../data/content'
import type { Kind } from '../data/content'

const ACCENTS = [
  '#E60012', // red
  '#00E510', // green
  '#0066FF', // blue
  '#FF6600', // orange
  '#FFFF00', // yellow
  '#FF00FF', // magenta
]

const STORAGE = { accent: 'fx.accent' }

function generateSiteTree(): string {
  const lines: string[] = ['.']
  const kinds = Object.keys(CONTENT) as Kind[]
  
  kinds.forEach((kind, kindIdx) => {
    const isLastKind = kindIdx === kinds.length - 1
    const kindPrefix = isLastKind ? '└── ' : '├── '
    const childPrefix = isLastKind ? '    ' : '│   '
    
    lines.push(`${kindPrefix}${kind}/`)
    
    const categories = CONTENT[kind]
    categories.forEach((cat, catIdx) => {
      const isLastCat = catIdx === categories.length - 1
      const catPrefix = isLastCat ? '└── ' : '├── '
      const postPrefix = isLastCat ? '    ' : '│   '
      
      lines.push(`${childPrefix}${catPrefix}${cat.slug}/`)
      
      cat.posts.forEach((post, postIdx) => {
        const isLastPost = postIdx === cat.posts.length - 1
        const postLine = isLastPost ? '└── ' : '├── '
        lines.push(`${childPrefix}${postPrefix}${postLine}${post.slug}`)
      })
    })
  })
  
  return lines.join('\n')
}

const COMMANDS = [
  ['h', 'toggle this overlay'],
  ['q', 'go home'],
  ['c', 'cycle accent color'],
  ['g', 'glitch burst'],
  ['a', 'about me'],
  ['m', 'music'],
]

export default function GlobalFx() {
  const navigate = useNavigate()
  const [trigger, setTrigger] = useState(0)
  const [showMap, setShowMap] = useState(false)
  const accentIdx = useRef(0)
  const navRef = useRef(navigate)
  navRef.current = navigate

  useEffect(() => {
    const savedAccent = localStorage.getItem(STORAGE.accent)
    if (savedAccent) {
      const idx = ACCENTS.indexOf(savedAccent)
      if (idx >= 0) {
        accentIdx.current = idx
        document.documentElement.style.setProperty('--accent', savedAccent)
      } else {
        // Saved color no longer exists, reset to first color
        localStorage.setItem(STORAGE.accent, ACCENTS[0])
        document.documentElement.style.setProperty('--accent', ACCENTS[0])
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === 'c') {
        accentIdx.current = (accentIdx.current + 1) % ACCENTS.length
        const next = ACCENTS[accentIdx.current]
        document.documentElement.style.setProperty('--accent', next)
        localStorage.setItem(STORAGE.accent, next)
      } else if (e.key === 'g') {
        setTrigger((t) => t + 1)
      } else if (e.key === 'a') {
        navRef.current('/about-me')
      } else if (e.key === 'm') {
        navRef.current('/audio')
      } else if (e.key === 'h') {
        setShowMap((v) => !v)
      } else if (e.key === 'q') {
        navRef.current('/')
      } else if (e.key === 't') {
        navRef.current('/terminal')
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <GlitchBurst trigger={trigger} />
      {showMap && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm overflow-auto p-8"
          onClick={() => setShowMap(false)}
        >
          <div className="font-mono text-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[var(--accent)] uppercase tracking-widest mb-6">Commands</h2>
            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 mb-10">
              {COMMANDS.map(([key, desc]) => (
                <div key={key} className="contents">
                  <span className="text-[var(--accent)]">{key}</span>
                  <span className="text-white/70">{desc}</span>
                </div>
              ))}
            </div>
            <h2 className="text-[var(--accent)] uppercase tracking-widest mb-4">Site Map</h2>
            <pre className="text-white/70 leading-relaxed">{generateSiteTree()}</pre>
            <p className="mt-8 text-white/40 text-xs">press h or click outside to close</p>
          </div>
        </div>
      )}
    </>
  )
}
