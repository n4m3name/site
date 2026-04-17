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
    <main className="relative min-h-screen text-white flex flex-col">
      <GlitchRain trigger={trigger} />
      <header className="px-3 pt-2.5 pb-2 flex items-center justify-between order-last md:order-first fixed bottom-0 left-0 right-0 md:static bg-black/90 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none z-10 mobile-bottom-nav">
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
        <div className="mt-8 text-white/70 space-y-6">
          <p>This portfolio site is built with React, TypeScript, Vite, and Tailwind CSS. It features a minimal black aesthetic with customizable accent colors, glitch effects, and responsive design that adapts between desktop and mobile layouts.</p>
          
          <h2 className="text-xl uppercase tracking-widest text-white mt-12">Technical Stack</h2>
          <p>The frontend is powered by React 18 with TypeScript for type safety. Vite provides lightning-fast HMR during development and optimized production builds. Tailwind CSS handles all styling with custom CSS variables for theming.</p>
          
          <h2 className="text-xl uppercase tracking-widest text-white mt-12">Glitch Effects</h2>
          <p>Two distinct glitch effects add visual interest: GlitchRain renders randomized characters in the current accent color across the viewport, while GlitchBurst creates a more intense full-screen distortion including CSS filter animations, skew transforms, and rapid color cycling.</p>
          <p>The effects are triggered by user interactions—hovering between navigation tiles fires the rain effect, while pressing 'g' triggers the burst. This creates an experience where the site feels alive and reactive without being overwhelming during normal browsing.</p>
          
          <h2 className="text-xl uppercase tracking-widest text-white mt-12">Color System</h2>
          <p>Seven accent colors are available, cycling through with the 'c' key: the original arch red (#E60012), matrix green, blue, orange, yellow, magenta, and cyan. Each color is stored in localStorage so your preference persists across sessions.</p>
          <p>The colors were carefully chosen to be pure saturated hues that stand out against the black background while remaining readable. A light mode is also available via the 'l' key, inverting the color scheme for daytime use.</p>
          
          <h2 className="text-xl uppercase tracking-widest text-white mt-12">Responsive Navigation</h2>
          <p>On desktop, the navigation bar sits at the top of each page with a back arrow and section label. On mobile devices (below 768px), the navigation moves to the bottom of the screen as a fixed bar with a blurred background, making it easier to reach with one hand.</p>
          <p>Content areas automatically adjust their padding to account for the navigation position, ensuring nothing gets hidden behind the fixed mobile nav bar.</p>
          
          <h2 className="text-xl uppercase tracking-widest text-white mt-12">Secret Sections</h2>
          <p>Not everything is visible from the main navigation. Press 'a' anywhere to access an about page, or 'm' to reveal a hidden music section. These Easter eggs reward curious visitors who explore beyond the obvious interface.</p>
          
          <h2 className="text-xl uppercase tracking-widest text-white mt-12">Deployment</h2>
          <p>The site is deployed on Netlify with automatic builds triggered by pushes to the main branch. A _redirects file ensures client-side routing works correctly for all paths. The build process is straightforward: pnpm install, pnpm build, and serve the dist folder.</p>
          
          <h2 className="text-xl uppercase tracking-widest text-white mt-12">Future Plans</h2>
          <p>Plans include adding actual content to the research and projects sections, implementing a markdown-based content system, and potentially adding more interactive elements. The architecture is intentionally simple to make these additions straightforward.</p>
          <p>The codebase prioritizes readability and maintainability over clever abstractions. Each component does one thing well, and the data layer is just a TypeScript object that could easily be swapped for a CMS or file-based system later.</p>
        </div>
      </article>
    </main>
  )
}
