import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CONTENT, type Kind } from '../data/content'
import { useListNav } from '../hooks/useListNav'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { wiggle } from '../utils/wiggle'

const TILES: { to: string; label: string; kind: Kind }[] = [
  { to: '/research', label: 'Research', kind: 'research' },
  { to: '/projects', label: 'Projects', kind: 'projects' },
]

export default function Home() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const isEmpty = (kind: Kind) => CONTENT[kind].length === 0

  const { activeIdx, setRef, onItemHover, onItemLeave } = useListNav({
    count: TILES.length,
    columns: isDesktop ? TILES.length : 1,
    focusKey: 'home',
    onActivate: (i) => {
      if (isEmpty(TILES[i].kind)) {
        wiggle(tileRefs.current[i])
        return
      }
      navigate(TILES[i].to)
    },
    onPopUp: () => {},
  })

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="relative flex-1 flex flex-col md:flex-row gap-4 p-4">
        {TILES.map((t, i) => {
          const active = activeIdx === i
          const empty = isEmpty(t.kind)
          return (
            <Link
              key={t.to}
              to={t.to}
              ref={(el) => {
                ;(setRef(i) as (e: HTMLAnchorElement | null) => void)(el)
                tileRefs.current[i] = el
              }}
              onMouseEnter={() => onItemHover(i)}
              onMouseLeave={onItemLeave}
              onClick={(e) => {
                if (empty) {
                  e.preventDefault()
                  wiggle(e.currentTarget)
                }
              }}
              aria-disabled={empty || undefined}
              className={`relative border transition-colors px-10 py-16 flex-1 flex items-center justify-center bg-black ${
                active && !empty
                  ? 'border-[var(--accent)]'
                  : empty
                    ? 'border-white/15 cursor-default'
                    : 'border-white/40'
              }`}
            >
              <span
                className={`text-2xl tracking-widest uppercase transition-colors ${
                  active && !empty
                    ? 'text-[var(--accent)]'
                    : empty
                      ? 'text-white/25'
                      : ''
                }`}
              >
                {t.label}
              </span>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
