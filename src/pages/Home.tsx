import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import GlitchRain from '../components/GlitchRain'

function Tile({
  to,
  label,
  onEnter,
}: {
  to: string
  label: string
  onEnter: () => void
}) {
  return (
    <Link
      to={to}
      onMouseEnter={onEnter}
      className="group relative border border-white/40 hover:border-[var(--accent)] transition-colors px-10 py-16 flex-1 flex items-center justify-center bg-black"
    >
      <span className="text-2xl tracking-widest uppercase group-hover:text-[var(--accent)] transition-colors">
        {label}
      </span>
    </Link>
  )
}

export default function Home() {
  const lastTile = useRef<string | null>(null)
  const [trigger, setTrigger] = useState(0)

  const enter = (tile: string) => {
    if (lastTile.current && lastTile.current !== tile) {
      setTrigger((t) => t + 1)
    }
    lastTile.current = tile
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="relative flex-1 flex flex-col md:flex-row gap-4 p-4">
        <GlitchRain trigger={trigger} />
        <Tile to="/research" label="Research" onEnter={() => enter('research')} />
        <Tile to="/projects" label="Projects" onEnter={() => enter('projects')} />
      </div>
    </main>
  )
}
