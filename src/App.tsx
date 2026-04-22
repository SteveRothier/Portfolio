import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Skills from './components/Skills'
import WarpBackground from './components/WarpBackground'

export default function App() {
  const sections = useMemo(
    () => [
      { key: 'hero', label: 'Hero', node: <Hero /> },
      { key: 'skills', label: 'Skills', node: <Skills /> },
      { key: 'projects', label: 'Projects', node: <Projects /> },
      { key: 'experience', label: 'Experience', node: <Experience /> },
      { key: 'contact', label: 'Contact', node: <Contact /> },
    ],
    [],
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const wheelLockedRef = useRef(false)
  const sectionVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      rotateX: dir > 0 ? 18 : -8,
      rotateY: dir > 0 ? -10 : 6,
      scale: dir > 0 ? 0.38 : 1.26,
      y: dir > 0 ? 180 : -120,
      z: dir > 0 ? -720 : 340,
    }),
    animate: {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      scale: [1.14, 1],
      y: 0,
      z: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      rotateX: dir > 0 ? -13 : 10,
      rotateY: dir > 0 ? 6 : -4,
      scale: dir > 0 ? 1.48 : 0.46,
      y: dir > 0 ? -135 : 160,
      z: dir > 0 ? 460 : -540,
    }),
  }

  const goTo = useCallback(
    (nextIndex: number) => {
      const safeIndex = Math.max(0, Math.min(nextIndex, sections.length - 1))
      if (safeIndex === activeIndex) return
      setDirection(safeIndex > activeIndex ? 1 : -1)
      setActiveIndex(safeIndex)
    },
    [activeIndex, sections.length],
  )

  useEffect(() => {
    const lockWheel = () => {
      wheelLockedRef.current = true
      window.setTimeout(() => {
        wheelLockedRef.current = false
      }, 760)
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      if (wheelLockedRef.current || Math.abs(event.deltaY) < 8) return

      if (event.deltaY > 0) {
        goTo(activeIndex + 1)
      } else {
        goTo(activeIndex - 1)
      }
      lockWheel()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault()
        goTo(activeIndex + 1)
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        goTo(activeIndex - 1)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeIndex, goTo])

  return (
    <WarpBackground>
      <main className="app app--pager">
        <header className="topbar topbar--floating">
          {sections.map((section, index) => (
            <button
              className={`topbar__button ${index === activeIndex ? 'is-active' : ''}`}
              key={section.key}
              onClick={() => goTo(index)}
              type="button"
            >
              {section.label}
            </button>
          ))}
        </header>

        <div className="pager-viewport">
          <AnimatePresence custom={direction} initial={false} mode="sync">
            <motion.section
              className="pager-screen"
              custom={direction}
              variants={sectionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              key={sections[activeIndex].key}
              transition={{ duration: 1.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="pager-screen-inner">{sections[activeIndex].node}</div>
            </motion.section>
          </AnimatePresence>
        </div>
      </main>
    </WarpBackground>
  )
}
