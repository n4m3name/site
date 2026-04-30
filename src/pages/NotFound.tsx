import { Link } from 'react-router-dom'

export default function NotFound() {
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
        <span className="text-sm uppercase tracking-widest text-white/60">404</span>
      </header>
      <article className="relative bg-black px-3 sm:px-4 pb-8 pt-4 mx-auto w-full max-w-3xl">
        <h1 className="text-3xl uppercase tracking-widest">Not Found</h1>
        <p className="mt-8 text-white/70">The page you requested does not exist.</p>
      </article>
    </main>
  )
}
