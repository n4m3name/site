import { Link } from 'react-router-dom'
import AboutBody, { frontmatter } from '../../content/about-me.mdx'

export default function AboutMe() {
  return (
    <main className="relative min-h-screen text-white flex flex-col">
      <header className="px-3 py-2.5 flex items-center justify-between bg-black">
        <Link
          to="/"
          aria-label="home"
          className="text-sm text-white/60 hover:text-[var(--accent)] transition-colors -m-2 p-2"
        >
          &lt;
        </Link>
        <span className="text-sm uppercase tracking-widest text-white/60">about</span>
      </header>
      <article className="relative bg-black px-3 sm:px-4 pb-8 pt-4 mx-auto w-full max-w-3xl">
        <h1 className="text-3xl uppercase tracking-widest">{frontmatter?.title ?? 'About Me'}</h1>
        {frontmatter?.updated && (
          <p className="mt-2 text-xs text-white/50 tracking-widest uppercase">
            updated {frontmatter.updated}
          </p>
        )}
        <div className="prose-mdx mt-8">
          <AboutBody />
        </div>
      </article>
    </main>
  )
}
