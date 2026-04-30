import { Link, useNavigate, useParams } from 'react-router-dom'
import { CONTENT, type Kind as KindT } from '../data/content'
import { useListNav } from '../hooks/useListNav'

export default function Category() {
  const navigate = useNavigate()
  const { kind, category } = useParams<{ kind: KindT; category: string }>()

  const cat = kind && category ? CONTENT[kind]?.find((c) => c.slug === category) : undefined
  const posts = cat?.posts ?? []

  const { activeIdx, setRef, onItemHover, onItemLeave } = useListNav({
    count: posts.length,
    columns: 1,
    focusKey: `cat:${kind}/${category}`,
    onActivate: (i) => navigate(`/${kind}/${category}/${posts[i].slug}`),
    onPopUp: () => navigate(`/${kind}`),
  })

  if (!cat || !kind) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <Link to="/" aria-label="home" className="text-sm text-white/60 hover:text-[var(--accent)]">
          &lt;
        </Link>
        <p className="mt-8 text-white/60">Not found.</p>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col">
      <header className="px-3 py-2.5 flex items-center justify-between bg-black">
        <Link
          to={`/${kind}`}
          aria-label={kind}
          className="text-sm text-white/60 hover:text-[var(--accent)] transition-colors -m-2 p-2"
        >
          &lt;
        </Link>
        <span className="text-sm uppercase tracking-widest text-white/60">{cat.title}</span>
      </header>
      <ul className="relative flex-1 px-3 md:px-4 pt-2 pb-3 mx-auto w-full max-w-3xl flex flex-col">
        {posts.map((p, i) => {
          const active = activeIdx === i
          return (
            <li key={p.slug}>
              <Link
                to={`/${kind}/${cat.slug}/${p.slug}`}
                ref={setRef(i) as React.Ref<HTMLAnchorElement>}
                onMouseEnter={() => onItemHover(i)}
                onMouseLeave={onItemLeave}
                className={`flex items-baseline gap-3 py-2.5 scroll-my-4 transition-colors ${
                  active ? 'text-[var(--accent)]' : 'text-white/75'
                }`}
              >
                <span
                  aria-hidden
                  className="w-4 shrink-0 text-[var(--accent)] select-none"
                >
                  {active ? '>' : ''}
                </span>
                <span className="uppercase tracking-widest text-sm">{p.title}</span>
                <span
                  aria-hidden
                  className={`flex-1 overflow-hidden whitespace-nowrap select-none transition-colors ${
                    active ? 'text-[var(--accent)]/60' : 'text-white/15'
                  }`}
                >
                  {'·'.repeat(400)}
                </span>
                <span
                  className={`text-xs tracking-widest uppercase shrink-0 transition-colors ${
                    active ? 'text-[var(--accent)]' : 'text-white/45'
                  }`}
                >
                  {p.updated}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
