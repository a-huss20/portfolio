import { motion } from 'motion/react'
import Page from '../components/Page.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { site } from '../data/site.js'

const ease = [0.22, 1, 0.36, 1]

export default function Work() {
  const { work } = site
  return (
    <Page>
      <PageHeader eyebrow={work.eyebrow} title="Work" intro={work.intro} />

      <div className="relative mt-14 max-w-3xl">
        {/* The timeline line draws itself downwards. */}
        <motion.div
          aria-hidden
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
          className="absolute bottom-2 left-[11px] top-2 w-px origin-top bg-gradient-to-b from-accent via-line to-transparent"
        />
        <ol className="space-y-10">
          {work.jobs.map((job) => (
            <Reveal as="li" key={`${job.role}-${job.company}`} className="relative pl-12">
              <span
                aria-hidden
                className="absolute left-0 top-2 grid h-6 w-6 place-items-center rounded-full border border-accent bg-ink"
              >
                <span className="h-2 w-2 rounded-full bg-accent" />
              </span>
              <motion.div
                whileHover={{ x: 6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="rounded-3xl border border-line bg-surface/70 p-6 backdrop-blur transition-colors duration-300 hover:border-accent/70"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-accent-soft">{job.period}</p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">{job.role}</h2>
                <p className="mt-1 text-fog">{job.company}</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-fog marker:text-accent">
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>
          ))}
        </ol>
      </div>

      <Reveal className="mt-16 flex flex-wrap items-center gap-4">
        <Button href={`mailto:${site.email}`}>
          Get in touch
          <ArrowIcon width={18} height={18} className="transition-transform group-hover:translate-x-1" />
        </Button>
        <Button variant="ghost" to="/projects">
          View projects
        </Button>
      </Reveal>
    </Page>
  )
}
