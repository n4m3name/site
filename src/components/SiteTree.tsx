import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CONTENT, type Kind } from '../data/content'

type Node = {
  key: string
  label: string
  href: string
  children?: Node[]
}

type Flat = {
  node: Node
  prefix: string
  branch: string
  hasChildren: boolean
  isOpen: boolean
  isEmptyDir: boolean
  reveal?: boolean
}

const REVEAL_KEY = '__reveal__'

type Mode = 'none' | 'keyboard' | 'mouse'

const KIND_LABEL: Record<Kind, string> = {
  research: 'research',
  projects: 'projects',
  audio: 'music',
}

function buildTree(): Node[] {
  const kinds = Object.keys(CONTENT) as Kind[]
  return kinds.map((kind) => ({
    key: kind,
    label: `${KIND_LABEL[kind]}/`,
    href: `/${kind}`,
    children: CONTENT[kind].map((cat) => ({
      key: `${kind}/${cat.slug}`,
      label: `${cat.slug}/`,
      href: `/${kind}/${cat.slug}`,
      children: cat.posts.map((p) => ({
        key: `${kind}/${cat.slug}/${p.slug}`,
        label: p.slug,
        href: `/${kind}/${cat.slug}/${p.slug}`,
      })),
    })),
  }))
}

export default function SiteTree({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState<Set<string>>(new Set())
  const [audioRevealed, setAudioRevealed] = useState(false)
  const [kbCursor, setKbCursor] = useState<string | null>(null)
  const [hoverCursor, setHoverCursor] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('none')
  const rowRefs = useRef<Map<string, HTMLDivElement | null>>(new Map())
  const mouseMoved = useRef(false)

  const revealAudio = () => {
    setAudioRevealed(true)
    setKbCursor('audio')
    setHoverCursor((prev) => (prev === null ? prev : 'audio'))
  }

  const toggle = (key: string) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const flat = useMemo<Flat[]>(() => {
    const tree = buildTree()
    const visibleTop = tree.filter((n) => n.key !== 'audio' || audioRevealed)
    const out: Flat[] = []
    const walk = (nodes: Node[], prefix: string, hideLast: boolean) => {
      nodes.forEach((n, i) => {
        const isLast = i === nodes.length - 1 && !hideLast
        const branch = isLast ? '└── ' : '├── '
        const childPrefix = prefix + (isLast ? '    ' : '│   ')
        const hasChildren = !!n.children && n.children.length > 0
        const isEmptyDir = !!n.children && n.children.length === 0
        const isOpen = open.has(n.key)
        out.push({ node: n, prefix, branch, hasChildren, isOpen, isEmptyDir })
        if (hasChildren && isOpen) walk(n.children!, childPrefix, false)
      })
    }
    walk(visibleTop, '', !audioRevealed)
    if (!audioRevealed) {
      out.push({
        node: { key: REVEAL_KEY, label: '...', href: '' },
        prefix: '',
        branch: '└── ',
        hasChildren: false,
        isOpen: false,
        isEmptyDir: false,
        reveal: true,
      })
    }
    return out
  }, [open, audioRevealed])

  // Keep cursor valid as the tree changes.
  useEffect(() => {
    if (flat.length === 0) return
    if (!kbCursor || !flat.some((f) => f.node.key === kbCursor)) {
      setKbCursor(flat[0].node.key)
    }
  }, [flat, kbCursor])

  useEffect(() => {
    if (mode !== 'keyboard' || !kbCursor) return
    rowRefs.current.get(kbCursor)?.scrollIntoView({ block: 'nearest' })
  }, [kbCursor, mode])

  const flatRef = useRef(flat)
  flatRef.current = flat
  const cursorRef = useRef(kbCursor)
  cursorRef.current = kbCursor
  const hoverCursorRef = useRef(hoverCursor)
  hoverCursorRef.current = hoverCursor
  const modeRef = useRef(mode)
  modeRef.current = mode

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key
      if (
        k !== 'ArrowUp' &&
        k !== 'ArrowDown' &&
        k !== 'ArrowLeft' &&
        k !== 'ArrowRight' &&
        k !== 'Enter'
      ) {
        return
      }
      e.preventDefault()
      e.stopImmediatePropagation()

      mouseMoved.current = false

      const rows = flatRef.current
      // First arrow press after opening (when no selection exists) just activates
      // keyboard mode on the top-most item without moving.
      if (modeRef.current === 'none' && k !== 'Enter') {
        setMode('keyboard')
        setKbCursor(rows[0]?.node.key ?? null)
        return
      }
      // Mouse → keyboard transition: adopt the hovered row as the new cursor,
      // so the key acts on whatever the user was hovering.
      const startKey =
        modeRef.current === 'mouse' ? hoverCursorRef.current ?? cursorRef.current : cursorRef.current
      setMode('keyboard')
      if (modeRef.current === 'mouse' && hoverCursorRef.current) {
        setKbCursor(hoverCursorRef.current)
      }

      const idx = startKey ? rows.findIndex((f) => f.node.key === startKey) : -1
      const row = idx >= 0 ? rows[idx] : null

      if (k === 'ArrowDown') {
        const ni = Math.min(rows.length - 1, idx < 0 ? 0 : idx + 1)
        setKbCursor(rows[ni]?.node.key ?? null)
        return
      }
      if (k === 'ArrowUp') {
        const pi = Math.max(0, idx < 0 ? 0 : idx - 1)
        setKbCursor(rows[pi]?.node.key ?? null)
        return
      }
      if (!row) return
      if (k === 'ArrowRight') {
        if (row.reveal) return
        if (row.isEmptyDir) return
        if (row.hasChildren) {
          if (!row.isOpen) toggle(row.node.key)
        } else {
          navigate(row.node.href)
          onClose()
        }
      } else if (k === 'ArrowLeft') {
        if (row.hasChildren && row.isOpen) toggle(row.node.key)
      } else if (k === 'Enter') {
        if (row.reveal) revealAudio()
        else if (row.isEmptyDir) return
        else {
          navigate(row.node.href)
          onClose()
        }
      }
    }
    const onMove = () => {
      mouseMoved.current = true
    }
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('mousemove', onMove)
    }
  }, [navigate, onClose])

  const activeKey = mode === 'keyboard' ? kbCursor : mode === 'mouse' ? hoverCursor : null

  const onEnter = (key: string) => {
    if (!mouseMoved.current) return
    setMode('mouse')
    setHoverCursor(key)
  }
  const onLeave = () => {
    setHoverCursor((prev) => (prev === null ? prev : null))
  }
  const selectRow = (key: string) => {
    setMode('keyboard')
    setKbCursor(key)
  }

  const rows: React.ReactNode[] = []
  rows.push(
    <div key="__root" className="text-white/70 whitespace-pre">
      .
    </div>,
  )

  flat.forEach((f) => {
    const { node: n, prefix, branch, hasChildren, isOpen, isEmptyDir, reveal } = f
    const active = activeKey === n.key
    if (reveal) {
      rows.push(
        <div
          key={n.key}
          ref={(el) => {
            if (el) rowRefs.current.set(n.key, el)
            else rowRefs.current.delete(n.key)
          }}
          onMouseEnter={() => onEnter(n.key)}
          onMouseLeave={onLeave}
          className="whitespace-pre scroll-my-4"
        >
          <span className="text-white/40">{prefix + branch}</span>
          <button
            type="button"
            onClick={revealAudio}
            className={`transition-colors cursor-pointer ${
              active ? 'text-[var(--accent)]' : 'text-white/25'
            }`}
            aria-label="reveal hidden"
          >
            ...
          </button>
        </div>,
      )
      return
    }
    rows.push(
      <div
        key={n.key}
        ref={(el) => {
          if (el) rowRefs.current.set(n.key, el)
          else rowRefs.current.delete(n.key)
        }}
        onMouseEnter={() => onEnter(n.key)}
        onMouseLeave={onLeave}
        className="whitespace-pre scroll-my-4"
      >
        <span className="text-white/40">{prefix + branch}</span>
        <Link
          to={n.href}
          onClick={(e) => {
            if (isEmptyDir) {
              e.preventDefault()
              selectRow(n.key)
            } else if (hasChildren) {
              e.preventDefault()
              selectRow(n.key)
              toggle(n.key)
            } else {
              onClose()
            }
          }}
          className={isEmptyDir ? 'cursor-default' : 'cursor-pointer'}
        >
          <span
            className={`transition-colors ${
              active
                ? 'text-[var(--accent)]'
                : isEmptyDir
                  ? 'text-white/30'
                  : 'text-white/70'
            }`}
          >
            {n.label}
          </span>
        </Link>
        {hasChildren && (
          <>
            {' '}
            <button
              type="button"
              onClick={() => {
                selectRow(n.key)
                toggle(n.key)
              }}
              className={`transition-colors cursor-pointer ${
                active ? 'text-[var(--accent)]' : 'text-[var(--accent)]/60'
              }`}
              aria-label={isOpen ? 'collapse' : 'expand'}
            >
              {isOpen ? '[-]' : '...'}
            </button>
          </>
        )}
      </div>,
    )
  })

  return <div className="font-mono text-sm leading-relaxed">{rows}</div>
}
