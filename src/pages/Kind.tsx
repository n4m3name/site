import { Link, useNavigate, useParams } from 'react-router-dom'
import { CONTENT, kindLabel } from '../data/content'
import { useListNav } from '../hooks/useListNav'
import { useMediaQuery } from '../hooks/useMediaQuery'
import NotFound from './NotFound'

export default function Kind() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { kind = '' } = useParams<{ kind: string }>()
  const categories = CONTENT[kind]

  // useListNav must run unconditionally (hook order). Compute below uses safe
  // fallback for missing kinds; the early-return after handles the 404 render.
  const safeCategories = categories ?? []

  const { activeIdx, setRef, onItemHover, onItemLeave } = useListNav({
    count: safeCategories.length,
    columns: isDesktop ? 2 : 1,
    focusKey: `kind:${kind}`,
    onActivate: (i) => navigate(`/${kind}/${safeCategories[i].slug}`),
    onPopUp: () => navigate('/'),
  })

  if (!categories) return <NotFound />

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col">
      <header className="px-3 py-2.5 flex items-center justify-between bg-black">
        <Link
          to="/"
          aria-label="home"
          className="text-sm text-white/60 hover:text-[var(--accent)] transition-colors -m-2 p-2"
        >
          &lt;
        </Link>
        <span className="text-sm uppercase tracking-widest text-white/60">{kindLabel(kind)}</span>
      </header>
      <div className="relative flex-1 px-3 pt-0 pb-3 grid gap-3 grid-cols-1 md:grid-cols-2">
        {safeCategories.map((c, i) => {
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
