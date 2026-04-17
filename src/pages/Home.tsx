import { Link, useNavigate } from 'react-router-dom'
import GlitchRain from '../components/GlitchRain'
import { useListNav } from '../hooks/useListNav'
import { useMediaQuery } from '../hooks/useMediaQuery'

const TILES = [
  { to: '/research', label: 'Research' },
  { to: '/projects', label: 'Projects' },
]

export default function Home() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const { activeIdx, setRef, onItemHover, onItemLeave } = useListNav({
    count: TILES.length,
    columns: isDesktop ? TILES.length : 1,
    focusKey: 'home',
    onActivate: (i) => navigate(TILES[i].to),
    onPopUp: () => {},
  })

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="relative flex-1 flex flex-col md:flex-row gap-4 p-4">
        <GlitchRain trigger={0} />
        {TILES.map((t, i) => {
          const active = activeIdx === i
          return (
            <Link
              key={t.to}
              to={t.to}
              ref={setRef(i) as React.Ref<HTMLAnchorElement>}
              onMouseEnter={() => onItemHover(i)}
              onMouseLeave={onItemLeave}
              className={`relative border transition-colors px-10 py-16 flex-1 flex items-center justify-center bg-black ${
                active ? 'border-[var(--accent)]' : 'border-white/40'
              }`}
            >
              <span
                className={`text-2xl tracking-widest uppercase transition-colors ${
                  active ? 'text-[var(--accent)]' : ''
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
