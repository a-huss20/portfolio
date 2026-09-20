import Page from '../components/Page.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Button from '../components/Button.jsx'

export default function NotFound() {
  return (
    <Page>
      <PageHeader eyebrow="Error 404" title="Page not found" intro="That page does not exist, but the rest of the site does." />
      <div className="mt-10">
        <Button to="/">Back to home</Button>
      </div>
    </Page>
  )
}
