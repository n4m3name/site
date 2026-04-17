import { useEffect, useRef } from 'react'

const CHARSETS = [
  '01',
  '0123456789ABCDEF',
  '!@#$%^&*()_+-=[]{};:,.<>/?',
  'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  '░▒▓█▄▀▌▐■□▪▫',
]

export default function GlitchRain({
  trigger,
  fullscreen = false,
}: {
  trigger: number
  fullscreen?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const charset = CHARSETS[Math.floor(Math.random() * CHARSETS.length)]
    const fontSize = 12 + Math.floor(Math.random() * 6)
    const cols = Math.max(1, Math.floor(rect.width / fontSize))
    const rows = Math.max(1, Math.floor(rect.height / fontSize))
    const density = 0.08 + Math.random() * 0.15
    const glyphCount = Math.floor(cols * rows * density)

    ctx.font = `${fontSize}px ui-monospace, "JetBrains Mono", monospace`
    ctx.textBaseline = 'top'

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#E60012'
    ctx.fillStyle = accent

    const makeFrame = () =>
      Array.from({ length: glyphCount }, () => ({
        ch: charset[Math.floor(Math.random() * charset.length)],
        x: Math.floor(Math.random() * cols) * fontSize,
        y: Math.floor(Math.random() * rows) * fontSize,
        a: 0.3 + Math.random() * 0.7,
      }))

    const frameCount = 2 + Math.floor(Math.random() * 2)
    const frames = Array.from({ length: frameCount }, makeFrame)

    const duration = 80 + Math.random() * 100
    const start = performance.now()
    let raf = 0
    let cancelled = false

    const tick = (now: number) => {
      if (cancelled) return
      const elapsed = now - start
      const t = elapsed / duration
      if (t >= 1) {
        ctx.clearRect(0, 0, rect.width, rect.height)
        return
      }

      const idx = Math.min(frameCount - 1, Math.floor(t * frameCount))
      const frame = frames[idx]
      ctx.clearRect(0, 0, rect.width, rect.height)
      const envelope = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4
      for (const g of frame) {
        ctx.globalAlpha = envelope * g.a
        ctx.fillText(g.ch, g.x, g.y)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      ctx.clearRect(0, 0, rect.width, rect.height)
    }
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      className={
        fullscreen
          ? 'fixed inset-0 w-screen h-screen pointer-events-none z-50'
          : 'absolute inset-0 w-full h-full pointer-events-none'
      }
    />
  )
}
