import type { ComponentType } from 'react'

export type Kind = 'research' | 'projects' | 'audio'
export type Post = { slug: string; title: string; updated: string; path: string }
export type Category = { slug: string; title: string; updated: string; posts: Post[] }

type Frontmatter = { title?: string; updated?: string }

const FM = import.meta.glob('/content/**/*.mdx', {
  eager: true,
  import: 'frontmatter',
}) as Record<string, Frontmatter>

const LOADERS = import.meta.glob('/content/**/*.mdx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>

const slugToTitle = (s: string) =>
  s
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')

const maxDate = (a: string, b: string) => (a > b ? a : b)

function buildContent(): Record<Kind, Category[]> {
  const bucket: Record<Kind, Record<string, Post[]>> = {
    research: {},
    projects: {},
    audio: {},
  }

  for (const [path, fm] of Object.entries(FM)) {
    const m = path.match(
      /^\/content\/(research|projects|audio)\/([^/]+)\/([^/]+)\.mdx$/,
    )
    if (!m) continue
    const [, kind, category, slug] = m
    const post: Post = {
      slug,
      title: fm.title ?? slugToTitle(slug),
      updated: fm.updated ?? '',
      path,
    }
    ;(bucket[kind as Kind][category] ??= []).push(post)
  }

  const result: Record<Kind, Category[]> = { research: [], projects: [], audio: [] }
  for (const kind of Object.keys(bucket) as Kind[]) {
    for (const [slug, posts] of Object.entries(bucket[kind])) {
      posts.sort((a, b) => b.updated.localeCompare(a.updated))
      const updated = posts.reduce((acc, p) => maxDate(acc, p.updated), '')
      result[kind].push({ slug, title: slugToTitle(slug), updated, posts })
    }
    result[kind].sort((a, b) => b.updated.localeCompare(a.updated))
  }
  return result
}

export const CONTENT = buildContent()

export function loadLeaf(path: string) {
  return LOADERS[path]?.()
}

export function generateSiteTree(): string[] {
  const lines: string[] = ['.']
  const kinds = Object.keys(CONTENT) as Kind[]

  kinds.forEach((kind, kindIdx) => {
    const isLastKind = kindIdx === kinds.length - 1
    const kindPrefix = isLastKind ? '└── ' : '├── '
    const childPrefix = isLastKind ? '    ' : '│   '

    lines.push(`${kindPrefix}${kind}/`)

    const categories = CONTENT[kind]
    categories.forEach((cat, catIdx) => {
      const isLastCat = catIdx === categories.length - 1
      const catPrefix = isLastCat ? '└── ' : '├── '
      const postPrefix = isLastCat ? '    ' : '│   '

      lines.push(`${childPrefix}${catPrefix}${cat.slug}/`)

      cat.posts.forEach((post, postIdx) => {
        const isLastPost = postIdx === cat.posts.length - 1
        const postLine = isLastPost ? '└── ' : '├── '
        lines.push(`${childPrefix}${postPrefix}${postLine}${post.slug}`)
      })
    })
  })

  return lines
}
