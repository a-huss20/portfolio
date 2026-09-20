import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import Button from './Button.jsx'

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

// A sphere of skill names you can drag to spin. Words at the front are large and bright,
// words at the back are small and faint. The pill buttons light up one category.
//   categories: [{ id, label, color, items: [] }]
export default function SkillsCloud({ categories, hint = 'Drag to spin' }) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState('all')
  const stageRef = useRef(null)
  const wordRefs = useRef([])
  const activeRef = useRef('all')

  useEffect(() => {
    activeRef.current = active
  }, [active])

  // Spread the words evenly over a sphere (Fibonacci spiral), mixing the categories.
  const words = useMemo(() => {
    const lists = categories.map((c) => c.items.map((label) => ({ label, cat: c.id, color: c.color })))
    const mixed = []
    for (let i = 0; lists.some((l) => i < l.length); i++) {
      for (const l of lists) if (i < l.length) mixed.push(l[i])
    }
    const n = mixed.length
    return mixed.map((word, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
      return {
        ...word,
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta),
        size: 15 + (i % 3) * 2.5,
      }
    })
  }, [categories])

  useEffect(() => {
    const stage = stageRef.current
    const state = { rx: -0.25, ry: 0.6, vx: 0, vy: 0, dragging: false, hover: false, lastX: 0, lastY: 0, lastT: 0 }
    const isOn = (word) => activeRef.current === 'all' || activeRef.current === word.cat
    const glow = words.map((word) => (isOn(word) ? 1 : 0))
    let w = 0
    let h = 0
    let radiusX = 200
    let radiusY = 150
    let disposed = false
    let raf = 0
    let last = 0
    let visible = true

    const render = (dt) => {
      const cosY = Math.cos(state.ry)
      const sinY = Math.sin(state.ry)
      const cosX = Math.cos(state.rx)
      const sinX = Math.sin(state.rx)
      const ease = dt > 0 ? 1 - Math.exp(-dt * 8) : 0

      words.forEach((word, i) => {
        const el = wordRefs.current[i]
        if (!el) return
        glow[i] += ((isOn(word) ? 1 : 0) - glow[i]) * ease
        const x1 = word.x * cosY + word.z * sinY
        const z1 = -word.x * sinY + word.z * cosY
        const y1 = word.y * cosX + z1 * sinX
        const z2 = -word.y * sinX + z1 * cosX
        const depth = (z2 + 1) / 2 // 0 = back of the sphere, 1 = front
        const scale = (0.6 + 0.55 * depth) * (0.92 + 0.16 * glow[i])
        const opacity = (0.16 + 0.84 * Math.pow(depth, 1.2)) * (0.22 + 0.78 * glow[i])
        el.style.transform = `translate3d(${x1 * radiusX}px, ${y1 * radiusY}px, 0) translate(-50%, -50%) scale(${scale})`
        el.style.opacity = opacity.toFixed(3)
        el.style.zIndex = String(Math.round(depth * 100))
      })
    }

    const measure = () => {
      const rect = stage.getBoundingClientRect()
      w = rect.width
      h = rect.height
      const fontScale = clamp(w / 700, 0.8, 1.25)
      let widest = 0
      words.forEach((word, i) => {
        const el = wordRefs.current[i]
        if (!el) return
        el.style.fontSize = `${word.size * fontScale}px`
        widest = Math.max(widest, el.offsetWidth)
      })
      // Size the sphere so the widest word still fits at its left and right edges.
      radiusX = Math.max(60, w / 2 - widest / 2 - 6)
      radiusY = clamp(h * 0.42, 100, 215)
      render(0)
    }

    const tick = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016)
      last = t
      if (!state.dragging) {
        // Coast after a flick, then settle back into the constant drift. The rates match the
        // reference globe: 0.0028 rad/frame around Y and 0.0012 rad/frame around X (60fps => rad/s).
        const driftY = reduced ? 0 : 0.0028 * 60
        const driftX = reduced ? 0 : 0.0012 * 60
        const k = 1 - Math.exp(-dt * 1.6)
        state.vy += (driftY - state.vy) * k
        state.vx += (driftX - state.vx) * k
        state.ry += state.vy * dt
        state.rx += state.vx * dt
      }
      render(dt)
      raf = requestAnimationFrame(tick)
    }
    const start = () => {
      if (!raf && visible && !document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      state.dragging = true
      state.lastX = e.clientX
      state.lastY = e.clientY
      state.lastT = performance.now()
      stage.setPointerCapture(e.pointerId)
    }
    const onMove = (e) => {
      if (e.pointerType === 'mouse') state.hover = true
      if (!state.dragging) return
      const now = performance.now()
      const dt = Math.max(0.008, (now - state.lastT) / 1000)
      const dx = e.clientX - state.lastX
      const dy = e.clientY - state.lastY
      state.ry += dx * 0.008
      state.vy = clamp(0.7 * state.vy + 0.3 * ((dx * 0.008) / dt), -6, 6)
      if (e.pointerType === 'mouse') {
        state.rx += dy * 0.008
        state.vx = clamp(0.7 * state.vx + 0.3 * ((dy * 0.008) / dt), -6, 6)
      }
      state.lastX = e.clientX
      state.lastY = e.clientY
      state.lastT = now
    }
    const onUp = () => {
      state.dragging = false
    }
    const onLeave = () => {
      state.hover = false
    }
    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerup', onUp)
    stage.addEventListener('pointercancel', onUp)
    stage.addEventListener('pointerleave', onLeave)

    // Only animate while the cloud is on screen and the tab is in front.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? start() : stop()
    })
    observer.observe(stage)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(stage)

    measure()
    start()
    // Word widths change once the web font arrives.
    document.fonts?.ready.then(() => !disposed && measure())

    return () => {
      disposed = true
      stop()
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onUp)
      stage.removeEventListener('pointerleave', onLeave)
    }
  }, [words, reduced])

  return (
    <div>
      <div role="group" aria-label="Filter skills by category" className="flex flex-wrap justify-center gap-2">
        <Button
          variant="pill"
          size="chip"
          active={active === 'all'}
          aria-pressed={active === 'all'}
          onClick={() => setActive('all')}
        >
          All
        </Button>
        {categories.map((c) => (
          <Button
            key={c.id}
            variant="pill"
            size="chip"
            active={active === c.id}
            aria-pressed={active === c.id}
            onClick={() => setActive(c.id)}
          >
            <span
              aria-hidden
              className="h-2 w-2 rounded-full ring-1 ring-black/25"
              style={{ background: c.color }}
            />
            {c.label}
          </Button>
        ))}
      </div>

      <div className="relative mt-6">
        {/* Soft glow and orbit ring behind the sphere */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[8%] inset-y-[6%] rounded-[50%] border border-dashed border-line/70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 45% 45% at 50% 50%, rgba(251,75,78,0.16) 0%, rgba(124,11,43,0.10) 55%, transparent 100%)',
          }}
        />
        <div
          ref={stageRef}
          role="img"
          aria-label={`Spinning cloud of my skills. ${hint}.`}
          className="relative mx-auto h-[26rem] max-w-4xl cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing sm:h-[30rem]"
        >
          {words.map((word, i) => (
            <span
              key={`${word.cat}-${word.label}`}
              ref={(el) => {
                wordRefs.current[i] = el
              }}
              aria-hidden
              className="absolute left-1/2 top-1/2 whitespace-nowrap font-display font-semibold tracking-tight"
              style={{ color: word.color, opacity: 0, textShadow: `0 0 18px ${word.color}55` }}
            >
              {word.label}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.4em] text-fog/70">{hint}</p>

      {/* Plain list for screen readers and anyone who prefers text */}
      <ul className="sr-only">
        {categories.map((c) => (
          <li key={c.id}>
            {c.label}: {c.items.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  )
}
