import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import GlitchRain from '../components/GlitchRain'
import { CONTENT, type Kind as KindT } from '../data/content'

export default function Post() {
  const { kind, category, slug } = useParams<{ kind: KindT; category: string; slug: string }>()
  const [trigger] = useState(0)

  const post = kind && category && slug
    ? CONTENT[kind]?.find((c) => c.slug === category)?.posts.find((p) => p.slug === slug)
    : undefined

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col">
      <GlitchRain trigger={trigger} />
      <header className="p-2.5 flex items-center justify-between order-last md:order-first fixed bottom-0 left-0 right-0 md:static bg-black/90 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none z-10">
        <Link
          to={`/${kind}/${category}`}
          aria-label={category}
          className="text-sm text-white/60 hover:text-[var(--accent)] transition-colors -m-2 p-2"
        >
          &lt;
        </Link>
        <span className="text-sm uppercase tracking-widest text-white/60">{kind}</span>
      </header>
      <article className="relative bg-black px-4 pb-16 pt-4 md:pt-0 max-w-3xl">
        <h1 className="text-3xl uppercase tracking-widest">{post?.title ?? slug}</h1>
        {post && (
          <p className="mt-2 text-xs text-white/50 tracking-widest uppercase">
            updated {post.updated}
          </p>
        )}
        <p className="mt-8 text-white/70">Post content placeholder.</p>
      </article>
    </main>
  )
}
