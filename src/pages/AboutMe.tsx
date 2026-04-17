import { useState } from 'react'
import { Link } from 'react-router-dom'
import GlitchRain from '../components/GlitchRain'

export default function AboutMe() {
  const [trigger] = useState(0)

  return (
    <main className="relative min-h-screen text-white flex flex-col">
      <GlitchRain trigger={trigger} />
      <header className="p-2.5 flex items-center justify-between order-last md:order-first fixed bottom-0 left-0 right-0 md:static bg-black/90 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none z-10 mobile-bottom-nav">
        <Link
          to="/"
          aria-label="home"
          className="text-sm text-white/60 hover:text-[var(--accent)] transition-colors -m-2 p-2"
        >
          &lt;
        </Link>
        <span className="text-sm uppercase tracking-widest text-white/60">about</span>
      </header>
      <article className="relative bg-black px-3 sm:px-4 pb-16 pt-4 m-0 sm:m-4 mx-auto w-full max-w-3xl">
        <h1 className="text-3xl uppercase tracking-widest">About Me</h1>
        <p className="mt-8 text-white/70">About me content placeholder.</p>
      </article>
    </main>
  )
}
