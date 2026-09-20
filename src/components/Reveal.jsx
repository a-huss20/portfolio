import { useState } from 'react'
import { motion } from 'motion/react'

// Scroll-reveal that follows the reference site (which uses the AOS library):
// each element starts 100px away and transparent, then slides into place over 0.6s
// with a plain "ease" curve when it scrolls into view. Delays stagger the siblings,
// and, like AOS, an element resets once it drops back below the fold, so it plays again
// when you scroll down to it a second time (elements you scrolled past stay put).
const DISTANCE = 100
const EASE = [0.25, 0.1, 0.25, 1] // CSS "ease"
const FROM = {
  up: { y: DISTANCE }, // "fade-up": rises from below
  down: { y: -DISTANCE }, // "fade-down": drops from above
  left: { x: DISTANCE }, // "fade-left": slides in from the right, moving left
  right: { x: -DISTANCE }, // "fade-right": slides in from the left, moving right
}

export default function Reveal({
  as = 'div',
  from = 'up',
  delay = 0,
  duration = 0.6,
  once = false,
  className,
  children,
  ...rest
}) {
  const Tag = motion[as]
  const [shown, setShown] = useState(false)
  // The element starts 100px lower for "up", so trigger 100px sooner to land at AOS's 120px offset.
  const margin = from === 'up' ? '0px 0px -20px 0px' : '0px 0px -120px 0px'
  return (
    <Tag
      initial={{ opacity: 0, ...FROM[from] }}
      animate={
        shown
          ? { opacity: 1, x: 0, y: 0, transition: { duration, ease: EASE, delay } }
          : { opacity: 0, ...FROM[from], transition: { duration, ease: EASE } }
      }
      viewport={{ margin }}
      onViewportEnter={() => setShown(true)}
      onViewportLeave={(entry) => {
        // Only reset when it left through the bottom edge (you scrolled back up past it).
        if (!once && entry && entry.boundingClientRect.top > 0) setShown(false)
      }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}
