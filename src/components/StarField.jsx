import { useEffect, useRef } from 'react'

// Star colours: mostly white, some Pastel Petal pink, a few Strawberry Red and warm ones.
const COLOURS = [
  ...Array(5).fill('255,255,255'),
  ...Array(3).fill('255,203,221'),
  '251,75,78',
  '255,190,160',
]

const TAU = Math.PI * 2

// A canvas of twinkling stars in three rough depth layers.
//   pointer  { x, y }   smoothed -1..1 motion values: near stars shift more than far ones
//   progress motion value 0..1  (how far the page has scrolled past the landing screen):
//                               stars drift upward, near ones faster
export default function StarField({ pointer, progress, still = false, className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let stars = []
    let frame = 0
    let visible = true

    // Soft glow sprite for each colour, used by the few bright stars.
    const sprites = {}
    for (const rgb of new Set(COLOURS)) {
      const s = document.createElement('canvas')
      s.width = s.height = 64
      const g = s.getContext('2d')
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
      grad.addColorStop(0, `rgba(${rgb},1)`)
      grad.addColorStop(0.25, `rgba(${rgb},0.35)`)
      grad.addColorStop(1, `rgba(${rgb},0)`)
      g.fillStyle = grad
      g.fillRect(0, 0, 64, 64)
      sprites[rgb] = s
    }

    const build = () => {
      const count = Math.min(1200, Math.max(300, Math.round((w * h) / 1500)))
      stars = Array.from({ length: count }, () => {
        const depth = 0.12 + Math.pow(Math.random(), 1.7) * 0.88 // most stars are far away
        const bright = Math.random() < 0.045
        return {
          x: -70 + Math.random() * (w + 140),
          y: -70 + Math.random() * (h * 1.45 + 70), // extra rows below for upward scroll drift
          depth,
          r: (0.4 + depth * 1.15) * (bright ? 1.9 : 1),
          alpha: 0.4 + Math.random() * 0.6 * (0.55 + depth / 2),
          speed: 0.5 + Math.random() * 2.2,
          phase: Math.random() * TAU,
          rgb: COLOURS[Math.floor(Math.random() * COLOURS.length)],
          bright,
        }
      })
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
      draw(performance.now())
    }

    const draw = (now) => {
      const px = still ? 0 : pointer?.x.get() ?? 0
      const py = still ? 0 : pointer?.y.get() ?? 0
      const p = still ? 0 : progress?.get() ?? 0
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const x = s.x - px * s.depth * 48
        const y = s.y - py * s.depth * 30 - p * h * 0.5 * s.depth
        if (x < -12 || x > w + 12 || y < -12 || y > h + 12) continue
        const twinkle = still ? 1 : 0.62 + 0.38 * Math.sin(now * 0.001 * s.speed + s.phase)
        ctx.globalAlpha = s.alpha * twinkle
        if (s.bright) {
          const size = s.r * 9
          ctx.drawImage(sprites[s.rgb], x - size, y - size, size * 2, size * 2)
        }
        ctx.fillStyle = `rgb(${s.rgb})`
        if (s.r < 0.9) {
          ctx.fillRect(x - s.r, y - s.r, s.r * 2, s.r * 2)
        } else {
          ctx.beginPath()
          ctx.arc(x, y, s.r, 0, TAU)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (now) => {
      draw(now)
      frame = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!frame && visible && !document.hidden && !still) frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    // Only animate while the canvas is on screen and the tab is in front.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? start() : stop()
    })
    observer.observe(canvas)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    resize()
    start()

    return () => {
      stop()
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [pointer, progress, still])

  return <canvas ref={canvasRef} aria-hidden className={`absolute inset-0 h-full w-full ${className}`} />
}
