import { motion } from 'motion/react'
import { useHref, useLinkClickHandler } from 'react-router'
import { useRipple } from './Ripple.jsx'

// One button used everywhere on the site. It renders as an internal page link (`to`),
// an <a> (`href`) or a <button>, and always gets the same motion:
//   hover  -> springs up and grows, primary buttons get a light sweep
//   press  -> squishes down
//   click  -> a ripple spreads from the pointer
const MotionAnchor = motion.a
const MotionButton = motion.button

const spring = { type: 'spring', stiffness: 420, damping: 18 }

const looks = {
  primary: {
    className: 'rounded-full bg-accent font-semibold text-ink shadow-lg shadow-accent/25',
    ripple: 'bg-ink/25',
    shine: true,
    motion: {
      rest: { scale: 1, y: 0, rotate: 0 },
      hover: { scale: 1.06, y: -3 },
      tap: { scale: 0.93, y: 0 },
    },
  },
  ghost: {
    className:
      'rounded-full border border-line font-semibold text-white transition-colors duration-200 hover:border-accent hover:bg-accent-soft/10',
    ripple: 'bg-accent-soft/30',
    motion: {
      rest: { scale: 1, y: 0, rotate: 0 },
      hover: { scale: 1.05, y: -3 },
      tap: { scale: 0.94, y: 0 },
    },
  },
  pill: {
    className:
      'rounded-full border border-line font-semibold uppercase tracking-[0.16em] text-fog transition-colors duration-200 hover:border-accent hover:bg-accent-soft/10 hover:text-white',
    ripple: 'bg-accent-soft/30',
    motion: {
      rest: { scale: 1, y: 0, rotate: 0 },
      hover: { scale: 1.07, y: -2 },
      tap: { scale: 0.92, y: 0 },
    },
  },
  pillActive: {
    className:
      'rounded-full border border-accent bg-accent font-semibold uppercase tracking-[0.16em] text-ink shadow-md shadow-accent/25',
    ripple: 'bg-ink/25',
    motion: {
      rest: { scale: 1, y: 0, rotate: 0 },
      hover: { scale: 1.07, y: -2 },
      tap: { scale: 0.92, y: 0 },
    },
  },
  icon: {
    className:
      'rounded-full text-fog transition-colors duration-200 hover:bg-accent-soft/10 hover:text-white',
    ripple: 'bg-accent-soft/30',
    motion: {
      rest: { scale: 1, y: 0, rotate: 0 },
      hover: { scale: 1.15, rotate: 6 },
      tap: { scale: 0.82, rotate: -8 },
    },
  },
}

const sizes = {
  md: 'px-7 py-3.5 text-base',
  sm: 'px-5 py-2.5 text-[15px]',
  chip: 'px-4 py-2 text-xs',
  icon: 'h-10 w-10',
  iconLg: 'h-12 w-12 border border-line',
}

const shineMotion = {
  rest: { x: '-150%', transition: { duration: 0 } },
  hover: { x: '450%', transition: { duration: 0.75, ease: 'easeInOut' } },
  tap: {},
}

export default function Button({
  variant = 'primary',
  size,
  active = false,
  to,
  href,
  external = false,
  className = '',
  children,
  onPointerDown,
  onClick,
  ...rest
}) {
  // `active` only matters for the pill variant (the selected filter).
  const look = variant === 'pill' && active ? looks.pillActive : looks[variant]
  const chosenSize = size ?? (variant === 'icon' ? 'icon' : 'md')
  const [ripple, layer] = useRipple(look.ripple)

  // Internal links use the router's own helpers on a motion <a>, so the press
  // animation works and the page changes without a full reload.
  const internalHref = useHref(to ?? '/')
  const navigate = useLinkClickHandler(to ?? '/')

  const shared = {
    variants: look.motion,
    initial: 'rest',
    animate: 'rest',
    whileHover: 'hover',
    whileTap: 'tap',
    transition: spring,
    onPointerDown: (event) => {
      ripple(event)
      onPointerDown?.(event)
    },
    className: `group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft ${sizes[chosenSize]} ${look.className} ${className}`,
    ...rest,
  }

  const content = (
    <>
      {look.shine && (
        <motion.span
          aria-hidden
          variants={shineMotion}
          style={{ skewX: -20 }}
          className="pointer-events-none absolute left-0 top-0 h-full w-1/3 bg-white/40"
        />
      )}
      {layer}
      <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
    </>
  )

  if (to) {
    const onLinkClick = (event) => {
      onClick?.(event)
      if (!event.defaultPrevented) navigate(event)
    }
    return <MotionAnchor href={internalHref} onClick={onLinkClick} {...shared}>{content}</MotionAnchor>
  }
  if (href) {
    const target = external ? { target: '_blank', rel: 'noreferrer' } : {}
    return <MotionAnchor href={href} {...target} onClick={onClick} {...shared}>{content}</MotionAnchor>
  }
  return <MotionButton type="button" onClick={onClick} {...shared}>{content}</MotionButton>
}
