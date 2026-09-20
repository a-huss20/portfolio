import { useState } from 'react'
import { motion } from 'motion/react'

// Click ripple. Spread `onPointerDown` on a `relative overflow-hidden` element
// and render `layer` inside it. Each press spawns a circle at the pointer that
// grows and fades, then removes itself.
export function useRipple(tone = 'bg-accent-soft/30') {
  const [ripples, setRipples] = useState([])

  const onPointerDown = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    setRipples((list) => [
      ...list,
      {
        id: `${event.timeStamp}-${Math.random()}`,
        size,
        x: event.clientX - rect.left - size / 2,
        y: event.clientY - rect.top - size / 2,
      },
    ])
  }

  const remove = (id) => setRipples((list) => list.filter((r) => r.id !== id))

  const layer = ripples.map((r) => (
    <motion.span
      key={r.id}
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${tone}`}
      style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
      initial={{ scale: 0, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onAnimationComplete={() => remove(r.id)}
    />
  ))

  return [onPointerDown, layer]
}
