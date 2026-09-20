import { motion } from 'motion/react'
import Button from './Button.jsx'
import Reveal from './Reveal.jsx'
import { ArrowIcon } from './Icons.jsx'
import { site } from '../data/site.js'

// The bio, facts and skills. Shared by the Home page (under the star landing) and the About page.
export default function AboutContent({ showSkills = true }) {
  const { about } = site
  return (
    <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        {about.paragraphs.map((text, i) => (
          <Reveal key={text} as="p" delay={i * 0.1} className="mb-5 text-lg leading-relaxed text-fog">
            {text}
          </Reveal>
        ))}
        <Reveal delay={about.paragraphs.length * 0.1} className="mt-8 flex flex-wrap items-center gap-4">
          <Button to="/work">
            See my work
            <ArrowIcon width={18} height={18} className="transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="ghost" href={`mailto:${site.email}`}>
            Get in touch
          </Button>
        </Reveal>
      </div>

      <Reveal
        as="aside"
        from="left"
        delay={0.1}
        className="space-y-8 rounded-3xl border border-line bg-surface/70 p-7 backdrop-blur"
      >
        <dl className="space-y-4">
          {about.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-sm font-semibold uppercase tracking-wide text-accent-soft">{fact.label}</dt>
              <dd className="mt-1 text-lg text-white">{fact.value}</dd>
            </div>
          ))}
        </dl>

        {showSkills && (
        <div className="space-y-5 border-t border-line pt-6">
          {about.skills.map((group) => (
            <div key={group.group}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-fog">{group.group}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <motion.li
                    key={item}
                    whileHover={{ y: -3, scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="cursor-default rounded-full border border-line bg-ink/60 px-3 py-1 text-sm font-medium text-accent-soft transition-colors hover:border-accent"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        )}
      </Reveal>
    </div>
  )
}
