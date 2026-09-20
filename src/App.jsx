import { AnimatePresence, MotionConfig } from 'motion/react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import Navbar from './components/Navbar.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import About from './pages/About.jsx'
import Work from './pages/Work.jsx'
import NotFound from './pages/NotFound.jsx'

// Keyed by path so the old page can animate out before the new one animates in.
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    // reducedMotion="user" turns off movement for visitors who ask their OS for less motion.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <AnimatedRoutes />
      </BrowserRouter>
    </MotionConfig>
  )
}
