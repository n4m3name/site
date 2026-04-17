import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import GlitchRain from '../components/GlitchRain'
import { CONTENT, type Kind as KindT } from '../data/content'

export default function Category() {
  const { kind, category } = useParams<{ kind: KindT; category: string }>()
  const [trigger, setTrigger] = useState(0)
  const last = useRef<string | null>(null)

  const enter = (slug: string) => {
    if (last.current && last.current !== slug) {
      setTrigger((t) => t + 1)
    }
    last.current = slug
  }

  const cat = kind && category ? CONTENT[kind]?.find((c) => c.slug === category) : undefined

  if (!cat || !kind) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <Link to="/" className="text-sm text-white/60 hover:text-[var(--accent)]">
          ← home
        </Link>
        <p className="mt-8 text-white/60">Not found.</p>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col">
      <GlitchRain trigger={trigger} />
      <header className="relative p-2.5 flex items-center justify-between order-last md:order-first fixed bottom-0 left-0 right-0 md:static bg-black/90 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none z-10">
        <Link
          to={`/${kind}`}
          aria-label={kind}
          className="text-sm text-white/60 hover:text-[var(--accent)] transition-colors -m-2 p-2"
        >
          &lt;
        </Link>
        <span className="text-sm uppercase tracking-widest text-white/60">{cat.title}</span>
      </header>
      <div className="relative flex-1 px-3 pb-14 md:pb-3 grid gap-3 grid-cols-1 md:grid-cols-2">
        {cat.posts.map((p) => (
          <Link
            key={p.slug}
            to={`/${kind}/${cat.slug}/${p.slug}`}
            onMouseEnter={() => enter(p.slug)}
            className="group relative border border-white/40 hover:border-[var(--accent)] transition-colors bg-black px-8 py-12 flex flex-col justify-between min-h-[180px]"
          >
            <span className="text-xl uppercase tracking-widest group-hover:text-[var(--accent)] transition-colors">
              {p.title}
            </span>
            <span className="mt-8 text-xs text-white/50 tracking-widest uppercase">
              updated {p.updated}
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
