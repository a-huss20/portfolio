import Reveal from './Reveal.jsx'

// Small pill, big gradient title and an intro line. Each piece pulls in as it scrolls into view.
// Use as="h2" when the page already has an h1.
export default function PageHeader({ eyebrow, title, intro, as = 'h1' }) {
  return (
    <header className="max-w-3xl">
      <Reveal
        as="p"
        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-sm font-medium text-accent-soft"
      >
        <span className="h-2 w-2 rounded-full bg-accent" />
        {eyebrow}
      </Reveal>
      <Reveal
        as={as}
        delay={0.1}
        className="mt-6 bg-gradient-to-r from-white via-accent-soft to-accent bg-clip-text pb-2 font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-transparent sm:text-6xl"
      >
        {title}
      </Reveal>
      <Reveal as="p" delay={0.2} className="mt-3 text-lg leading-relaxed text-fog">
        {intro}
      </Reveal>
    </header>
  )
}
