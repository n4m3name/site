export type Post = { slug: string; title: string; updated: string }
export type Category = { slug: string; title: string; updated: string; posts: Post[] }
export type Kind = 'research' | 'projects' | 'audio'

export const CONTENT: Record<Kind, Category[]> = {
  research: [
    {
      slug: 'neuroscience',
      title: 'Neuroscience',
      updated: '2026-04-10',
      posts: [
        { slug: 'placeholder-one', title: 'Placeholder One', updated: '2026-04-10' },
      ],
    },
    {
      slug: 'machine-learning',
      title: 'Machine Learning',
      updated: '2026-03-28',
      posts: [
        { slug: 'placeholder-two', title: 'Placeholder Two', updated: '2026-03-28' },
      ],
    },
  ],
  projects: [
    {
      slug: 'web',
      title: 'Web',
      updated: '2026-04-15',
      posts: [
        { slug: 'this-site', title: 'This Site', updated: '2026-04-15' },
      ],
    },
    {
      slug: 'audio',
      title: 'Audio',
      updated: '2026-02-02',
      posts: [
        { slug: 'placeholder-audio', title: 'Placeholder Audio', updated: '2026-02-02' },
      ],
    },
  ],
  audio: [
    {
      slug: 'releases',
      title: 'Releases',
      updated: '2026-04-01',
      posts: [
        { slug: 'placeholder-release', title: 'Placeholder Release', updated: '2026-04-01' },
      ],
    },
    {
      slug: 'mixes',
      title: 'Mixes',
      updated: '2026-03-15',
      posts: [
        { slug: 'placeholder-mix', title: 'Placeholder Mix', updated: '2026-03-15' },
      ],
    },
  ],
}
