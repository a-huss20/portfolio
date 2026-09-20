import Page from '../components/Page.jsx'
import PageHeader from '../components/PageHeader.jsx'
import AboutContent from '../components/AboutContent.jsx'
import { site } from '../data/site.js'

export default function About() {
  const { about } = site
  return (
    <Page>
      <PageHeader eyebrow={about.eyebrow} title="About me" intro={about.intro} />
      <div className="mt-14">
        <AboutContent />
      </div>
    </Page>
  )
}
