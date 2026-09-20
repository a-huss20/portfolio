import { motion } from 'motion/react'
import Page from '../components/Page.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import { ArrowIcon, GitHubIcon } from '../components/Icons.jsx'
import { site } from '../data/site.js'

function ProjectCard({ project, index }) {
  return (
    <Reveal delay={(index % 3) * 0.1} className="h-full">
    <motion.article
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className="flex h-full flex-col rounded-3xl border border-line bg-surface/70 p-7 backdrop-blur transition-colors duration-300 hover:border-accent/70"
    >
      <span className="self-start rounded-full border border-line px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-soft">
        {project.status}
      </span>
      <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">{project.title}</h2>
      <p className="mt-3 flex-1 leading-relaxed text-fog">{project.description}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-ink/60 px-3 py-1 text-sm font-medium text-accent-soft">
            {tag}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button variant="ghost" size="sm" href={project.href} external>
          <GitHubIcon width={16} height={16} />
          View on GitHub
        </Button>
      </div>
    </motion.article>
    </Reveal>
  )
}

export default function Projects() {
  const { projects } = site
  return (
    <Page>
      <PageHeader eyebrow={projects.eyebrow} title="Projects" intro={projects.intro} />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.items.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>

      <Reveal className="mt-16 flex flex-wrap items-center gap-4">
        <Button to="/work">
          See where I have worked
          <ArrowIcon width={18} height={18} className="transition-transform group-hover:translate-x-1" />
        </Button>
        <Button variant="ghost" href={`mailto:${site.email}`}>
          Get in touch
        </Button>
      </Reveal>
    </Page>
  )
}
