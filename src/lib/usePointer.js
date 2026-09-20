import { useEffect } from 'react'
import { useMotionValue, useSpring } from 'motion/react'

// Where the pointer is on screen, as two smoothed numbers from -1 (left / top)
// to 1 (right / bottom). Returns motion values, so reading them every frame
// does not re-render anything.
export function usePointer() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 55, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 55, damping: 18, mass: 0.6 })

  useEffect(() => {
    const move = (e) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 2)
      y.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    const leave = () => {
      x.set(0)
      y.set(0)
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [x, y])

  return { x: sx, y: sy }
}
