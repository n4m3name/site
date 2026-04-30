import { useEffect, useRef } from 'react'

const FRAGMENTS = [
  'ERROR', 'SEGFAULT', '0xDEADBEEF', 'NULL', 'PANIC', 'SIGBUS',
  'stdin: invalid', 'kernel: oops', '??????', '/dev/null', 'CORRUPT',
  '0xFF00', 'overflow', 'memory leak', 'UNDEFINED', 'ｴﾗｰ', '█▓▒░',
  'rm -rf /', 'core dumped', 'NaN', 'BUS ERROR', 'Illegal instruction',
  '0x00000000', 'access denied', 'trap 6', 'SIGSEGV',
]

const CHARS = '01ABCDEF!@#$%&*()ｱｲｳｴｵｶｷｸ░▒▓█◢◣◤◥'

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export default function GlitchBurst({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!trigger) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const root = document.documentElement
    const targets: HTMLElement[] = []
    const contentEl = document.getElementById('page-content')
    if (contentEl) targets.push(contentEl)
    document
      .querySelectorAll<HTMLElement>('[data-glitchable]')
      .forEach((el) => targets.push(el))
    const targetAnims = targets.map((t) =>
      t.animate(
        [
          { transform: 'translate(0,0)', filter: 'none' },
          { transform: 'translate(-4px,3px) skewX(-2deg)', filter: 'hue-rotate(80deg) contrast(1.2)' },
          { transform: 'translate(5px,-2px)', filter: 'hue-rotate(200deg) invert(0.15)' },
          { transform: 'translate(-3px,1px) skewX(3deg)', filter: 'saturate(2) hue-rotate(45deg)' },
          { transform: 'translate(2px,-3px)', filter: 'invert(0.4)' },
          { transform: 'translate(-6px,2px)', filter: 'hue-rotate(300deg) contrast(1.5)' },
          { transform: 'translate(3px,4px) skewY(-1deg)', filter: 'invert(1)' },
          { transform: 'translate(-1px,-2px)', filter: 'hue-rotate(150deg)' },
          { transform: 'translate(4px,1px)', filter: 'saturate(3)' },
          { transform: 'translate(-2px,-1px)', filter: 'hue-rotate(60deg)' },
          { transform: 'translate(0,0)', filter: 'none' },
        ],
        { duration: 500, easing: 'steps(1)', iterations: 1 },
      ),
    )

    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const accent = getComputedStyle(root).getPropertyValue('--accent').trim() || '#E60012'
    const fg = getComputedStyle(root).getPropertyValue('--fg').trim() || '#ffffff'
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim() || '#000000'

    const totalDuration = 420 + Math.random() * 200
    const frameCount = 7 + Math.floor(Math.random() * 4)
    const frameDur = totalDuration / frameCount

    type Frame = {
      boxes: { x: number; y: number; w: number; h: number; color: string; text?: string }[]
      tears: { y: number; h: number; dx: number; color: string; text: string; textColor: string }[]
      glyphs: { ch: string; x: number; y: number; color: string; size: number }[]
      scanAlpha: number
      invert: boolean
    }

    const makeFrame = (): Frame => {
      const colors = [accent, fg, bg, accent, accent]
      return {
        boxes: Array.from({ length: 6 + Math.floor(Math.random() * 10) }, () => ({
          x: rand(0, w),
          y: rand(0, h),
          w: rand(20, w * 0.4),
          h: rand(4, 40),
          color: colors[Math.floor(Math.random() * colors.length)],
        })),
        tears: Array.from({ length: 4 + Math.floor(Math.random() * 6) }, () => ({
          y: rand(0, h),
          h: rand(6, 28),
          dx: rand(-80, 80),
          color: Math.random() > 0.5 ? accent : bg,
          text: FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)].repeat(3 + Math.floor(Math.random() * 8)),
          textColor: Math.random() > 0.3 ? fg : accent,
        })),
        glyphs: Array.from({ length: 30 + Math.floor(Math.random() * 50) }, () => ({
          ch: CHARS[Math.floor(Math.random() * CHARS.length)],
          x: rand(0, w),
          y: rand(0, h),
          color: Math.random() > 0.6 ? accent : fg,
          size: 10 + Math.floor(Math.random() * 14),
        })),
        scanAlpha: 0.05 + Math.random() * 0.15,
        invert: Math.random() > 0.7,
      }
    }

    const frames = Array.from({ length: frameCount }, makeFrame)

    let start = -1
    let raf = 0
    let cancelled = false

    const tick = (now: number) => {
      if (cancelled) return
      if (start < 0) start = now
      const elapsed = Math.max(0, now - start)
      if (elapsed >= totalDuration) {
        ctx.clearRect(0, 0, w, h)
        return
      }

      const frameIdx = Math.max(0, Math.min(frameCount - 1, Math.floor(elapsed / frameDur)))
      const f = frames[frameIdx]

      ctx.clearRect(0, 0, w, h)

      if (f.invert) {
        ctx.fillStyle = fg
        ctx.fillRect(0, 0, w, h)
      }

      for (const b of f.boxes) {
        ctx.fillStyle = b.color
        ctx.globalAlpha = 0.6 + Math.random() * 0.4
        ctx.fillRect(b.x, b.y, b.w, b.h)
      }
      ctx.globalAlpha = 1

      ctx.font = '14px ui-monospace, monospace'
      ctx.textBaseline = 'top'
      for (const t of f.tears) {
        ctx.fillStyle = t.color
        ctx.globalAlpha = 0.85
        ctx.fillRect(0, t.y, w, t.h)
        ctx.globalAlpha = 1
        ctx.fillStyle = t.textColor
        ctx.fillText(t.text, t.dx, t.y + 2)
      }

      for (const g of f.glyphs) {
        ctx.fillStyle = g.color
        ctx.globalAlpha = 0.4 + Math.random() * 0.6
        ctx.font = `${g.size}px ui-monospace, monospace`
        ctx.fillText(g.ch, g.x, g.y)
      }
      ctx.globalAlpha = 1

      ctx.fillStyle = bg
      ctx.globalAlpha = f.scanAlpha
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1)
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      ctx.clearRect(0, 0, w, h)
      targetAnims.forEach((a) => a.cancel())
    }
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-[60]"
    />
  )
}
