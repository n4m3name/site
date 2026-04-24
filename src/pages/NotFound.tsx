import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="relative min-h-screen text-white flex flex-col">
      <header className="px-3 pt-2.5 pb-2 flex items-center justify-between order-last md:order-first fixed bottom-0 left-0 right-0 md:static bg-black md:bg-transparent z-10 mobile-bottom-nav">
        <Link
          to="/"
          aria-label="home"
          className="text-sm text-white/60 hover:text-[var(--accent)] transition-colors -m-2 p-2"
        >
          &lt;
        </Link>
        <span className="text-sm uppercase tracking-widest text-white/60">404</span>
      </header>
      <article className="relative bg-black px-3 sm:px-4 pb-16 pt-4 mx-auto w-full max-w-3xl">
        <h1 className="text-3xl uppercase tracking-widest">Not Found</h1>
        <p className="mt-8 text-white/70">The page you requested does not exist.</p>
      </article>
    </main>
  )
}
