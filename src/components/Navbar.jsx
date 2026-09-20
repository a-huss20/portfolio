import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { site } from '../data/site.js'
import Button from './Button.jsx'
import { useRipple } from './Ripple.jsx'
import { ArrowIcon, CloseIcon, GitHubIcon, LinkedInIcon, MenuIcon } from './Icons.jsx'

const ease = [0.22, 1, 0.36, 1]
const spring = { type: 'spring', stiffness: 420, damping: 20 }
const MotionLink = motion.create(Link)

// One desktop nav button: lifts on hover (with a sliding highlight),
// squishes and ripples on click, and shows an underline when its page is open.
function DesktopItem({ link, hovered, setHovered }) {
  const [onPointerDown, ripples] = useRipple('bg-accent-soft/30')
  return (
    <li className="relative">
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.9 }}
        transition={spring}
        className="relative z-10"
      >
        <NavLink
          to={link.to}
          end={link.to === '/'}
          onPointerDown={onPointerDown}
          onMouseEnter={() => setHovered(link.to)}
          onFocus={() => setHovered(link.to)}
          className={({ isActive }) =>
            `relative z-10 block overflow-hidden rounded-full px-4 py-2 text-[17px] font-medium transition-colors ${
              isActive ? 'text-white' : 'text-fog hover:text-white focus-visible:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="relative z-10">{link.label}</span>
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  transition={spring}
                  className="absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-accent"
                />
              )}
              {ripples}
            </>
          )}
        </NavLink>
      </motion.div>
      {hovered === link.to && (
        <motion.span
          layoutId="nav-hover"
          className="absolute inset-0 rounded-full bg-accent-soft/10"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
    </li>
  )
}

function MobileItem({ link, onNavigate }) {
  const [onPointerDown, ripples] = useRipple('bg-accent-soft/30')
  return (
    <li>
      <motion.div whileHover={{ x: 6 }} whileTap={{ scale: 0.97 }} transition={spring}>
        <NavLink
          to={link.to}
          end={link.to === '/'}
          onClick={onNavigate}
          onPointerDown={onPointerDown}
          className={({ isActive }) =>
            `relative block overflow-hidden rounded-xl px-3 py-3 text-lg font-medium transition-colors hover:bg-accent-soft/10 hover:text-white ${
              isActive ? 'bg-accent-soft/10 text-white' : 'text-fog'
            }`
          }
        >
          <span className="relative z-10">{link.label}</span>
          {ripples}
        </NavLink>
      </motion.div>
    </li>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(null)
  const { pathname } = useLocation()

  // Fade in a blurred background once the page has been scrolled a little.
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  // Close the mobile menu whenever the page changes.
  useEffect(() => setOpen(false), [pathname])

  const solid = scrolled || open

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid ? 'border-line bg-ink/80 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8"
      >
        {/* Brand */}
        <MotionLink
          to="/"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          transition={spring}
          className="group flex items-center gap-3"
          aria-label={`${site.name} home`}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-accent/60 bg-surface font-display text-sm font-bold tracking-tight text-white transition-colors group-hover:bg-accent group-hover:text-ink">
            {site.initials}
          </span>
          <span className="hidden font-display text-base font-semibold tracking-tight sm:block">
            {site.name}
          </span>
        </MotionLink>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex" onMouseLeave={() => setHovered(null)}>
          {site.nav.map((link) => (
            <DesktopItem key={link.to} link={link} hovered={hovered} setHovered={setHovered} />
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="icon" href={site.github} external aria-label="GitHub">
            <GitHubIcon />
          </Button>
          <Button variant="icon" href={site.linkedin} external aria-label="LinkedIn">
            <LinkedInIcon />
          </Button>
          <Button size="sm" href={`mailto:${site.email}`} className="ml-2">
            Contact
            <ArrowIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="icon"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'close' : 'menu'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid place-items-center"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </motion.span>
          </AnimatePresence>
        </Button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden md:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {site.nav.map((link) => (
                <MobileItem key={link.to} link={link} onNavigate={() => setOpen(false)} />
              ))}
              <li className="mt-3 flex items-center gap-2">
                <Button href={`mailto:${site.email}`} className="flex-1">
                  Contact
                  <ArrowIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="icon" size="iconLg" href={site.github} external aria-label="GitHub">
                  <GitHubIcon />
                </Button>
                <Button variant="icon" size="iconLg" href={site.linkedin} external aria-label="LinkedIn">
                  <LinkedInIcon />
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
