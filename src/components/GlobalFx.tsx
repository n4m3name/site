import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlitchBurst from './GlitchBurst'
import SiteTree from './SiteTree'
import { setListNavSuspended } from '../hooks/useListNav'
import AboutBody, { frontmatter as aboutFrontmatter } from '../../content/about-me.mdx'

const ACCENTS = [
  '#E60012', // red
  '#00E510', // green
  '#0066FF', // blue
  '#FF6600', // orange
  '#FFFF00', // yellow
  '#FF00FF', // magenta
]

const STORAGE = { accent: 'fx.accent' }

const COMMANDS = [
  ['h', 'toggle this overlay'],
  ['s', 'site map'],
  ['q', 'go home'],
  ['t', 'terminal'],
  ['c', 'cycle accent color'],
  ['a', 'about me'],
  ['m', 'music'],
  ['g', 'glitch burst'],
]

const NAV = [
  ['↑ ↓', 'move within list'],
  ['← →', 'back / enter'],
  ['enter', 'enter selected'],
]

export default function GlobalFx() {
  const navigate = useNavigate()
  const [trigger, setTrigger] = useState(0)
  const [showMap, setShowMap] = useState(false)
  const [showTree, setShowTree] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const accentIdx = useRef(0)
  const navRef = useRef(navigate)
  navRef.current = navigate
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const treeRef = useRef<HTMLDivElement | null>(null)
  const aboutRef = useRef<HTMLDivElement | null>(null)
  const stateRef = useRef({ showMap, showTree, showAbout })
  stateRef.current = { showMap, showTree, showAbout }

  const anyOpen = showMap || showTree || showAbout
  useEffect(() => {
    setListNavSuspended(anyOpen)
    document.body.style.overflow = anyOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [anyOpen])

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

      const { showMap: sm, showTree: st, showAbout: sa } = stateRef.current
      if (sm || st || sa) {
        const el = sm ? overlayRef.current : st ? treeRef.current : aboutRef.current
        if (!el) return
        const step = 40
        // When the tree overlay is open, SiteTree owns arrow keys + Enter for cursor nav.
        const inTree = st
        if (e.key === 'ArrowDown' && !inTree) {
          e.preventDefault()
          e.stopImmediatePropagation()
          el.scrollBy({ top: step })
        } else if (e.key === 'ArrowUp' && !inTree) {
          e.preventDefault()
          e.stopImmediatePropagation()
          el.scrollBy({ top: -step })
        } else if (e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault()
          el.scrollBy({ top: el.clientHeight * 0.9 })
        } else if (e.key === 'PageUp') {
          e.preventDefault()
          el.scrollBy({ top: -el.clientHeight * 0.9 })
        } else if (e.key === 'Home') {
          e.preventDefault()
          el.scrollTo({ top: 0 })
        } else if (e.key === 'End') {
          e.preventDefault()
          el.scrollTo({ top: el.scrollHeight })
        } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Enter') && !inTree) {
          e.preventDefault()
          e.stopImmediatePropagation()
        } else if (e.key === 'Escape') {
          setShowMap(false)
          setShowTree(false)
          setShowAbout(false)
        } else if (e.key === 'h' && sm) {
          setShowMap(false)
        } else if (e.key === 's' && st) {
          setShowTree(false)
        } else if (e.key === 'a' && sa) {
          setShowAbout(false)
        }
        return
      }

      if (e.key === 'c') {
        accentIdx.current = (accentIdx.current + 1) % ACCENTS.length
        const next = ACCENTS[accentIdx.current]
        document.documentElement.style.setProperty('--accent', next)
        localStorage.setItem(STORAGE.accent, next)
      } else if (e.key === 'g') {
        setTrigger((t) => t + 1)
      } else if (e.key === 'a') {
        setShowAbout((v) => !v)
      } else if (e.key === 'm') {
        navRef.current('/audio')
      } else if (e.key === 'h') {
        setShowMap((v) => !v)
      } else if (e.key === 's') {
        setShowTree((v) => !v)
      } else if (e.key === 'q') {
        navRef.current('/')
      } else if (e.key === 't') {
        navRef.current('/terminal')
      }
    }

    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [])

  return (
    <>
      <GlitchBurst trigger={trigger} />
      {showMap && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm overflow-auto p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowMap(false)
          }}
        >
          <div className="font-mono text-sm w-fit">
            <h2 className="text-[var(--accent)] uppercase tracking-widest mb-6">Commands</h2>
            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 mb-10">
              {COMMANDS.map(([key, desc]) => (
                <div key={key} className="contents">
                  <span className="text-[var(--accent)]">{key}</span>
                  <span className="text-white/70">{desc}</span>
                </div>
              ))}
            </div>
            <h2 className="text-[var(--accent)] uppercase tracking-widest mb-6">Navigation</h2>
            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 mb-10">
              {NAV.map(([key, desc]) => (
                <div key={key} className="contents">
                  <span className="text-[var(--accent)]">{key}</span>
                  <span className="text-white/70">{desc}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-white/40 text-xs">press h or click outside to close</p>
          </div>
        </div>
      )}
      {showAbout && (
        <div
          ref={aboutRef}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm overflow-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAbout(false)
          }}
        >
          <article className="relative px-3 sm:px-4 pt-8 pb-16 mx-auto w-full max-w-3xl">
            <h1 className="text-3xl uppercase tracking-widest">
              {aboutFrontmatter?.title ?? 'About Me'}
            </h1>
            {aboutFrontmatter?.updated && (
              <p className="mt-2 text-xs text-white/50 tracking-widest uppercase">
                updated {aboutFrontmatter.updated}
              </p>
            )}
            <div className="prose-mdx mt-8">
              <AboutBody />
            </div>
            <p className="mt-10 text-white/40 text-xs">press a or click outside to close</p>
          </article>
        </div>
      )}
      {showTree && (
        <div
          ref={treeRef}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm overflow-auto p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowTree(false)
          }}
        >
          <div className="w-fit">
            <h2 className="font-mono text-sm text-[var(--accent)] uppercase tracking-widest mb-6">Site Map</h2>
            <SiteTree onClose={() => setShowTree(false)} />
            <p className="mt-8 font-mono text-white/40 text-xs">press s or click outside to close</p>
            <p className="mt-1 font-mono text-white/40 text-xs">press enter to navigate</p>
          </div>
        </div>
      )}
    </>
  )
}
