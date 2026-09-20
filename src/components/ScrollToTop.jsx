import { useEffect } from 'react'
import { useLocation } from 'react-router'

// Jump back to the top whenever you move to a different page.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}
