import { useEffect, useRef, useState } from 'react'

type Options = {
  count: number
  columns: number
  onActivate: (idx: number) => void
  onPopUp: () => void
  onFocusChange?: (idx: number) => void
  focusKey?: string
  bypassSuspend?: boolean
}

type Mode = 'none' | 'keyboard' | 'mouse'

// Persists across route changes so arrow users keep a selection on the next page,
// while mouse users start with nothing selected.
let lastMode: Mode = 'none'
const focusMemory = new Map<string, number>()
let suspended = false

export function setListNavSuspended(v: boolean) {
  suspended = v
}

export function rememberFocus(key: string, idx: number) {
  focusMemory.set(key, idx)
}

export function useListNav({
  count,
  columns,
  onActivate,
  onPopUp,
  onFocusChange,
  focusKey,
  bypassSuspend,
}: Options) {
  const [kbIdx, setKbIdx] = useState(() => {
    if (focusKey) {
      const saved = focusMemory.get(focusKey)
      if (saved !== undefined && saved < count) return saved
    }
    return 0
  })
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [mode, setMode] = useState<Mode>(lastMode === 'keyboard' ? 'keyboard' : 'none')
  const refs = useRef<(HTMLElement | null)[]>([])
  const cbs = useRef({ onActivate, onPopUp, onFocusChange })
  cbs.current = { onActivate, onPopUp, onFocusChange }
  // Hover events that fire without a real mouse movement (e.g. cursor happens to
  // overlap a new page's element on route change) shouldn't hijack keyboard mode.
  const mouseMoved = useRef(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (suspended && !bypassSuspend) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      const k = e.key
      const isArrow =
        k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown'
      if (!isArrow && k !== 'Enter') return

      mouseMoved.current = false

      if (k === 'Enter') {
        if (mode !== 'keyboard') return
        e.preventDefault()
        cbs.current.onActivate(kbIdx)
        return
      }

      e.preventDefault()

      // First arrow press switches into keyboard mode; highlight current idx without moving.
      if (mode !== 'keyboard') {
        setMode('keyboard')
        return
      }

      const cols = Math.max(1, columns)
      const row = Math.floor(kbIdx / cols)
      const col = kbIdx % cols

      if (k === 'ArrowUp') {
        if (row > 0) setKbIdx(kbIdx - cols)
        // else: no-op (Up/Down never pops or activates)
      } else if (k === 'ArrowDown') {
        const next = kbIdx + cols
        if (next < count) setKbIdx(next)
        // else: no-op
      } else if (k === 'ArrowLeft') {
        if (col > 0) setKbIdx(kbIdx - 1)
        else cbs.current.onPopUp()
      } else if (k === 'ArrowRight') {
        const next = kbIdx + 1
        const sameRow = Math.floor(next / cols) === row
        if (sameRow && next < count) setKbIdx(next)
        else cbs.current.onActivate(kbIdx)
      }
    }
    const onMove = () => {
      mouseMoved.current = true
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousemove', onMove)
    }
  }, [count, columns, kbIdx, mode])

  useEffect(() => {
    if (mode !== 'none') lastMode = mode
  }, [mode])

  useEffect(() => {
    if (focusKey) focusMemory.set(focusKey, kbIdx)
  }, [focusKey, kbIdx])

  useEffect(() => {
    if (mode !== 'keyboard') return
    const el = refs.current[kbIdx]
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    cbs.current.onFocusChange?.(kbIdx)
  }, [kbIdx, mode])

  const onItemHover = (i: number) => {
    if (!mouseMoved.current) return
    setMode('mouse')
    setHoverIdx(i)
  }
  const onItemLeave = () => {
    setHoverIdx((prev) => (prev === null ? prev : null))
  }

  const activeIdx =
    mode === 'keyboard' ? kbIdx : mode === 'mouse' ? hoverIdx : null

  const setRef = (i: number) => (el: HTMLElement | null) => {
    refs.current[i] = el
  }

  // Programmatically mark item `i` as selected. Used by click handlers that
  // need a "tap-to-select, tap-again-to-activate" flow on touch.
  const select = (i: number) => {
    setMode('keyboard')
    setKbIdx(i)
  }

  return { activeIdx, setRef, onItemHover, onItemLeave, select }
}
