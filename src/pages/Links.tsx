import { LINKS } from '../data/links'

export default function Links() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="w-fit">
        <h2 className="font-mono text-sm text-[var(--accent)] uppercase tracking-widest mb-6">Links</h2>
        <ul className="font-mono text-sm space-y-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--accent)] hover:text-white transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
