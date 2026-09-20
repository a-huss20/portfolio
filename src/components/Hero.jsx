import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { site } from '../data/site.js'
import { usePointer } from '../lib/usePointer.js'
import StarField from './StarField.jsx'

const ease = [0.22, 1, 0.36, 1]

const group = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.5 } } }
const letter = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

// Full-screen night sky: stars that follow the pointer, a glow on the horizon,
// hills in front, the name, and a cue that scrolls down into the About section.
export default function Hero() {
  const { hero, name } = site
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const pointer = usePointer()

  // 0 when the landing screen fills the window, 1 once it has scrolled out of view.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.25])
  const backHillsX = useTransform(pointer.x, [-1, 1], [14, -14])
  const frontHillsX = useTransform(pointer.x, [-1, 1], [30, -30])

  const goToAbout = () => {
    document
      .getElementById('about')
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <section
      id="home"
      ref={ref}
      className="relative isolate h-svh min-h-[600px] overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #12000a 0%, #26000a 52%, #3e000c 100%)' }}
    >
      <StarField pointer={pointer} progress={scrollYProgress} still={!!reduced} />

      {/* Glow on the horizon */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[75%]"
        style={{
          opacity: glowOpacity,
          background:
            'radial-gradient(ellipse 75% 62% at 50% 100%, rgba(209,0,0,0.55) 0%, rgba(124,11,43,0.42) 42%, rgba(62,0,12,0) 74%)',
        }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[45%]"
        style={{
          background:
            'radial-gradient(ellipse 42% 60% at 50% 100%, rgba(251,75,78,0.38) 0%, rgba(251,75,78,0) 72%)',
        }}
        animate={reduced ? undefined : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Name and role */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-5 pb-32 pt-20 text-center md:px-8"
      >
        <motion.div variants={group} initial="hidden" animate="show" className="flex flex-col items-center">
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.4em] text-accent-soft/80 sm:text-sm"
          >
            {hero.eyebrow}
          </motion.p>

          <h1
            aria-label={name}
            className="mt-6 font-serif text-[clamp(3.25rem,11vw,9rem)] leading-[0.95] tracking-tight text-white [text-shadow:0_0_70px_rgba(251,75,78,0.35)]"
          >
            {Array.from(name).map((char, i) => (
              <motion.span
                key={i}
                aria-hidden
                variants={letter}
                className="inline-block"
              >
                {char === ' ' ? ' ' : char}
              </motion.span>
            ))}
          </h1>

          <motion.span
            aria-hidden
            variants={{ hidden: { scaleX: 0, opacity: 0 }, show: { scaleX: 1, opacity: 1, transition: { duration: 1, ease } } }}
            className="mt-8 block h-px w-48 bg-gradient-to-r from-transparent via-accent-soft/70 to-transparent"
          />
          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg tracking-wide text-fog sm:text-xl">
            {hero.role}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: cueOpacity }}
        className="absolute inset-x-0 bottom-[21vh] z-10 flex justify-center"
      >
        <motion.button
          type="button"
          onClick={goToAbout}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 1.8 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center gap-3 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-fog transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
          aria-label="Scroll down to the About section"
        >
          {hero.scroll}
          <span aria-hidden className="relative block h-12 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute inset-x-0 top-0 h-5 bg-accent-soft"
              animate={reduced ? undefined : { y: [-20, 48] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.button>
      </motion.div>

      {/* Hills. The nearest layer is the same colour as the section below, so the ground carries on into it. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[22vh] min-h-[130px]">
        <motion.svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          style={{ x: backHillsX, scaleX: 1.08 }}
        >
          <path
            d="M0,118 C160,70 330,62 520,104 C700,144 880,96 1060,72 C1230,50 1340,84 1440,112 L1440,220 L0,220 Z"
            fill="#2c0812"
          />
        </motion.svg>
        <motion.svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          style={{ x: frontHillsX, scaleX: 1.12 }}
        >
          <path
            d="M0,168 C210,120 430,150 650,176 C860,200 1050,138 1240,140 C1340,141 1400,156 1440,166 L1440,221 L0,221 Z"
            fill="#1c0409"
          />
        </motion.svg>
      </div>
    </section>
  )
}
