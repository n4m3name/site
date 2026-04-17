import { Suspense, lazy, useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import GlitchRain from '../components/GlitchRain'
import { CONTENT, loadLeaf, type Kind as KindT } from '../data/content'
import { rememberFocus } from '../hooks/useListNav'

export default function Post() {
  const navigate = useNavigate()
  const { kind, category, slug } = useParams<{ kind: KindT; category: string; slug: string }>()

  const cat = kind && category ? CONTENT[kind]?.find((c) => c.slug === category) : undefined
  const postIdx = cat?.posts.findIndex((p) => p.slug === slug) ?? -1
  const post = postIdx >= 0 ? cat!.posts[postIdx] : undefined

  useEffect(() => {
    if (postIdx >= 0) rememberFocus(`cat:${kind}/${category}`, postIdx)
  }, [kind, category, postIdx])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigate(`/${kind}/${category}`)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [kind, category, navigate])

  const path = post?.path
  const Body = useMemo(
    () => (path ? lazy(() => loadLeaf(path)!) : null),
    [path],
  )

  return (
    <main className="relative min-h-screen text-white flex flex-col">
      <GlitchRain trigger={0} />
      <header className="px-3 pt-2.5 pb-2 flex items-center justify-between order-last md:order-first fixed bottom-0 left-0 right-0 md:static bg-black md:bg-transparent z-10 mobile-bottom-nav">
        <Link
          to={`/${kind}/${category}`}
          aria-label={category}
          className="text-sm text-white/60 hover:text-[var(--accent)] transition-colors -m-2 p-2"
        >
          &lt;
        </Link>
        <span className="text-sm uppercase tracking-widest text-white/60">{kind}</span>
      </header>
      <article className="relative bg-black px-3 sm:px-4 pb-16 pt-4 mx-auto w-full max-w-3xl">
        <h1 className="text-3xl uppercase tracking-widest">{post?.title ?? slug}</h1>
        {post && (
          <p className="mt-2 text-xs text-white/50 tracking-widest uppercase">
            updated {post.updated}
          </p>
        )}
        <div className="prose-mdx mt-8">
          {Body ? (
            <Suspense fallback={null}>
              <Body />
            </Suspense>
          ) : (
            <p className="text-white/70">Not found.</p>
          )}
        </div>
      </article>
    </main>
  )
}
