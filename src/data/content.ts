import type { ComponentType } from 'react'

export type Kind = string
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

// Sentinel files that anchor an otherwise-empty kind folder. Drop a `.gitkeep`
// in `content/<name>/` and the kind appears (greyed-out until posts arrive).
const KIND_ANCHORS = import.meta.glob('/content/*/.gitkeep', {
  eager: true,
  query: '?url',
}) as Record<string, unknown>

// Top-level kinds that stay hidden in the site tree until the `...` reveal.
// Folder name only — add a folder to /content/<name>/ and (optionally) list it here.
export const HIDDEN_KINDS: ReadonlySet<Kind> = new Set(['audio', 'writing'])

// Optional display-name override per kind. Defaults to the folder name.
const KIND_LABELS: Record<string, string> = {
  audio: 'music',
}

export function kindLabel(kind: Kind): string {
  return KIND_LABELS[kind] ?? kind
}

const slugToTitle = (s: string) =>
  s
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')

const maxDate = (a: string, b: string) => (a > b ? a : b)

function buildContent(): Record<Kind, Category[]> {
  const bucket: Record<Kind, Record<string, Post[]>> = {}

  // Seed kinds from anchor files so empty folders still register.
  for (const path of Object.keys(KIND_ANCHORS)) {
    const m = path.match(/^\/content\/([^/]+)\/\.gitkeep$/)
    if (m) bucket[m[1]] ??= {}
  }

  for (const [path, fm] of Object.entries(FM)) {
    const m = path.match(/^\/content\/([^/]+)\/([^/]+)\/([^/]+)\.mdx$/)
    if (!m) continue
    const [, kind, category, slug] = m
    const post: Post = {
      slug,
      title: fm.title ?? slugToTitle(slug),
      updated: fm.updated ?? '',
      path,
    }
    ;(bucket[kind] ??= {})[category] ??= []
    bucket[kind][category].push(post)
  }

  const result: Record<Kind, Category[]> = {}
  for (const kind of Object.keys(bucket)) {
    result[kind] = []
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
// Hidden kinds always appear at the end so revealing them doesn't reorder
// the visible kinds above.
export const KINDS = (() => {
  const all = Object.keys(CONTENT) as Kind[]
  return [
    ...all.filter((k) => !HIDDEN_KINDS.has(k)),
    ...all.filter((k) => HIDDEN_KINDS.has(k)),
  ]
})()

export function loadLeaf(path: string) {
  return LOADERS[path]?.()
}

export function generateSiteTree(): string[] {
  const lines: string[] = ['.']
  const kinds = KINDS

  kinds.forEach((kind, kindIdx) => {
    const isLastKind = kindIdx === kinds.length - 1
    const kindPrefix = isLastKind ? '└── ' : '├── '
    const childPrefix = isLastKind ? '    ' : '│   '

    lines.push(`${kindPrefix}${kindLabel(kind)}/`)

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
