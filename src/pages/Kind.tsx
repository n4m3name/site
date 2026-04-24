import { Link, useNavigate } from 'react-router-dom'
import { CONTENT, type Kind as KindT } from '../data/content'
import { useListNav } from '../hooks/useListNav'
import { useMediaQuery } from '../hooks/useMediaQuery'

export default function Kind({ kind }: { kind: KindT }) {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const categories = CONTENT[kind]

  const { activeIdx, setRef, onItemHover, onItemLeave } = useListNav({
    count: categories.length,
    columns: isDesktop ? 2 : 1,
    focusKey: `kind:${kind}`,
    onActivate: (i) => navigate(`/${kind}/${categories[i].slug}`),
    onPopUp: () => navigate('/'),
  })

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col">
      <header className="px-3 pt-2.5 pb-2 flex items-center justify-between order-last md:order-first fixed bottom-0 left-0 right-0 md:static bg-black md:bg-transparent z-10 mobile-bottom-nav">
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
        {categories.map((c, i) => {
          const active = activeIdx === i
          return (
            <Link
              key={c.slug}
              to={`/${kind}/${c.slug}`}
              ref={setRef(i) as React.Ref<HTMLAnchorElement>}
              onMouseEnter={() => onItemHover(i)}
              onMouseLeave={onItemLeave}
              className={`relative border transition-colors bg-black px-8 py-12 flex flex-col justify-between min-h-[180px] ${
                active ? 'border-[var(--accent)]' : 'border-white/40'
              }`}
            >
              <span
                className={`text-2xl uppercase tracking-widest transition-colors ${
                  active ? 'text-[var(--accent)]' : ''
                }`}
              >
                {c.title}
              </span>
              <span className="mt-8 text-xs text-white/50 tracking-widest uppercase">
                updated {c.updated}
              </span>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
