import Hero from '../components/Hero.jsx'
import PageHeader from '../components/PageHeader.jsx'
import AboutContent from '../components/AboutContent.jsx'
import SkillsCloud from '../components/SkillsCloud.jsx'
import Reveal from '../components/Reveal.jsx'
import { PageTransition } from '../components/Page.jsx'
import { site } from '../data/site.js'

// The star landing screen, then the About and Skills sections it scrolls down into.
export default function Home() {
  const { about, skills } = site
  return (
    <PageTransition>
      <Hero />

      <section
        id="about"
        className="relative overflow-x-clip bg-gradient-to-b from-ground to-ink pb-28 pt-24 md:pt-32"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <PageHeader as="h2" eyebrow={about.eyebrow} title="About me" intro={about.intro} />
          <div className="mt-14">
            <AboutContent showSkills={false} />
          </div>
        </div>
      </section>

      <section id="skills" className="relative overflow-x-clip bg-ink pb-32 pt-10 md:pt-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <PageHeader as="h2" eyebrow={skills.eyebrow} title="Skills" intro={skills.intro} />
          <Reveal className="mt-12" delay={0.1}>
            <SkillsCloud categories={skills.categories} hint={skills.hint} />
          </Reveal>
        </div>
      </section>
    </PageTransition>
  )
}
