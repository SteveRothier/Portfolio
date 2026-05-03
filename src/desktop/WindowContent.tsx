import { lazy, Suspense, type ReactNode } from 'react'
import type { WindowId } from '../windows/types'

const Projects = lazy(() => import('../windows/Projects').then((m) => ({ default: m.Projects })))
const Terminal = lazy(() => import('../windows/Terminal').then((m) => ({ default: m.Terminal })))
const About = lazy(() => import('../windows/About').then((m) => ({ default: m.About })))
const Cv = lazy(() => import('../windows/Cv').then((m) => ({ default: m.Cv })))
const Contact = lazy(() => import('../windows/Contact').then((m) => ({ default: m.Contact })))

function WindowContentFallback() {
  return (
    <div className="flex min-h-[120px] items-center justify-center px-4 py-8 font-ui text-[11px] text-text-soft">
      Chargement…
    </div>
  )
}

export function WindowContent({ id }: { id: WindowId }) {
  let body: ReactNode
  switch (id) {
    case 'projects':
      body = <Projects />
      break
    case 'terminal':
      body = <Terminal />
      break
    case 'about':
      body = <About />
      break
    case 'cv':
      body = <Cv />
      break
    case 'contact':
      body = <Contact />
      break
    default:
      body = null
  }

  return <Suspense fallback={<WindowContentFallback />}>{body}</Suspense>
}
