import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1]

// Fades and slides a page in, and back out when you navigate away.
export function PageTransition({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease }}
      className={className}
    >
      {children}
    </motion.main>
  )
}

// Standard layout for the inner pages (Projects, About, Work).
export default function Page({ children }) {
  return (
    <PageTransition className="relative isolate min-h-svh overflow-hidden pb-24 pt-32">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(#7c0b2b_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute -right-32 -top-24 -z-10 h-[24rem] w-[24rem] rounded-full bg-glow/20 blur-[110px]"
      />
      <div className="mx-auto max-w-6xl px-5 md:px-8">{children}</div>
    </PageTransition>
  )
}
