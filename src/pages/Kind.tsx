import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import GlitchRain from '../components/GlitchRain'
import { CONTENT, type Kind as KindT } from '../data/content'

export default function Kind({ kind }: { kind: KindT }) {
  const [trigger, setTrigger] = useState(0)
  const last = useRef<string | null>(null)

  const enter = (slug: string) => {
    if (last.current && last.current !== slug) {
      setTrigger((t) => t + 1)
    }
    last.current = slug
  }

  const categories = CONTENT[kind]

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col">
      <GlitchRain trigger={trigger} />
      <header className="relative px-3 pt-2.5 pb-2 flex items-center justify-between order-last md:order-first fixed bottom-0 left-0 right-0 md:static bg-black/90 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none z-10">
        <Link
          to="/"
          aria-label="home"
          className="text-sm text-white/60 hover:text-[var(--accent)] transition-colors -m-2 p-2"
        >
          &lt;
        </Link>
        <span className="text-sm uppercase tracking-widest text-white/60">{kind}</span>
      </header>
      <div className="relative flex-1 px-3 pt-4 md:pt-0 pb-14 md:pb-3 grid gap-3 grid-cols-1 md:grid-cols-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to={`/${kind}/${c.slug}`}
            onMouseEnter={() => enter(c.slug)}
            className="group relative border border-white/40 hover:border-[var(--accent)] transition-colors bg-black px-8 py-12 flex flex-col justify-between min-h-[180px]"
          >
            <span className="text-2xl uppercase tracking-widest group-hover:text-[var(--accent)] transition-colors">
              {c.title}
            </span>
            <span className="mt-8 text-xs text-white/50 tracking-widest uppercase">
              updated {c.updated}
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
