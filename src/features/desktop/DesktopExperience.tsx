import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import backgroundUrl from '../../assets/background.jpg'
import { ContactWindow } from '../contact/ContactWindow'
import { ProjectsWindow } from '../projects/ProjectsWindow'
import { DesktopWindow } from '../window-manager/DesktopWindow'
import { useWindowManager } from '../window-manager/useWindowManager'
import type { WindowId } from '../window-manager/types'

const desktopIcons: { id: WindowId; label: string; badge: string }[] = [
  { id: 'projects', label: 'Projets', badge: '01' },
  { id: 'contact', label: 'Contact', badge: '02' },
]

type SnapTarget = 'top' | 'left' | 'right' | null

export function DesktopExperience() {
  const desktopRef = useRef<HTMLDivElement | null>(null)
  const {
    orderedWindows,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    bringToFront,
    moveWindow,
    resizeWindow,
    restoreWindowFromSnap,
    snapWindowToEdge,
  } = useWindowManager()
  const [now, setNow] = useState(() => new Date())
  const [snapPreview, setSnapPreview] = useState<SnapTarget>(null)
  const resolveSnapTarget = (cursorX: number, cursorY: number): SnapTarget => {
    const edgeThreshold = 28
    if (cursorY <= edgeThreshold) return 'top'
    if (cursorX <= edgeThreshold) return 'left'
    if (cursorX >= window.innerWidth - edgeThreshold) return 'right'
    return null
  }


  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const formattedDateTime = useMemo(() => {
    const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(now)
    const day = new Intl.DateTimeFormat('fr-FR', { day: '2-digit' }).format(now)
    const month = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(now)
    const time = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now)

    const toTitleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
    return {
      date: `${toTitleCase(weekday)} ${day} ${toTitleCase(month)}`,
      time,
    }
  }, [now])

  useLayoutEffect(() => {
    if (!desktopRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.desktop-icon', {
        y: 16,
        opacity: 0,
        stagger: 0.08,
        duration: 0.42,
        ease: 'power2.out',
      })
      gsap.from('.desktop-status', {
        y: -14,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
      })
      gsap.from('.desktop-dock', {
        y: 20,
        opacity: 0,
        duration: 0.42,
        delay: 0.1,
        ease: 'power2.out',
      })
    }, desktopRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      className="desktop-scene relative isolate min-h-dvh overflow-hidden"
      ref={desktopRef}
    >
      <div className="desktop-bg pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <img
          src={backgroundUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(8,16,34,0.5),rgba(6,10,24,0.62)),radial-gradient(circle_at_70%_15%,rgba(90,54,205,0.3),transparent_42%),radial-gradient(circle_at_10%_80%,rgba(19,116,255,0.22),transparent_36%)]" />
      </div>
      <header className="desktop-status fixed left-3 right-3 top-1 z-30 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-full px-3 py-2 text-sm text-text-soft md:left-3.5 md:right-3.5 md:top-0.5 md:py-2 md:pl-3.5 md:pr-2.5">
        <span className="desktop-status__brand justify-self-start truncate pr-2 text-xs md:text-sm">
          SteveOS Portfolio
        </span>
        <span className="desktop-status__datetime inline-flex items-center gap-1.5 justify-self-center text-xs tabular-nums leading-tight md:text-[0.82rem]">
          <span className="inline-flex items-center">{formattedDateTime.date}</span>
          <span className="desktop-status__separator h-[0.82em] w-0.5 shrink-0 bg-current opacity-80" aria-hidden />
          <span className="inline-flex items-center">{formattedDateTime.time}</span>
        </span>
        <span aria-hidden className="justify-self-end" />
      </header>

      <div className="desktop-icons fixed right-4 top-20 z-[15] grid gap-3 max-md:left-3 max-md:right-auto max-md:top-auto max-md:bottom-24 max-md:flex max-md:flex-row max-md:flex-wrap">
        {desktopIcons.map((icon) => (
          <button
            type="button"
            className="desktop-icon grid w-[120px] cursor-pointer gap-1.5 rounded-[var(--radius-md)] border border-line-soft bg-[rgba(5,11,22,0.42)] p-3 text-left text-text-main md:w-[132px] md:p-[0.75rem_0.65rem]"
            key={icon.id}
            onClick={() => openWindow(icon.id)}
            onMouseEnter={(event) => {
              gsap.to(event.currentTarget, { y: -3, duration: 0.16, ease: 'power2.out' })
            }}
            onMouseLeave={(event) => {
              gsap.to(event.currentTarget, { y: 0, duration: 0.16, ease: 'power2.out' })
            }}
          >
            <span className="desktop-icon__glyph text-xl opacity-90" aria-hidden>
              {icon.id === 'projects' ? '▦' : '✉'}
            </span>
            <span className="desktop-icon__label text-sm font-semibold">{icon.label}</span>
            <span className="desktop-icon__badge justify-self-start rounded-full border border-line-soft px-1.5 py-0.5 text-[0.72rem] text-text-soft">
              {icon.badge}
            </span>
          </button>
        ))}
      </div>

      <div className="desktop-windows relative min-h-dvh">
        {snapPreview ? <div className={`snap-preview snap-preview--${snapPreview}`} aria-hidden /> : null}
        {orderedWindows.map((windowState) => (
          <DesktopWindow
            key={windowState.id}
            windowState={windowState}
            onFocus={() => bringToFront(windowState.id)}
            onClose={() => closeWindow(windowState.id)}
            onMinimize={() => minimizeWindow(windowState.id)}
            onToggleMaximize={() => toggleMaximizeWindow(windowState.id)}
            onMove={(x, y) => moveWindow(windowState.id, x, y)}
            onDragMove={(cursorX, cursorY) => setSnapPreview(resolveSnapTarget(cursorX, cursorY))}
            onResize={(x: number, y: number, width: number, height: number) =>
              resizeWindow(windowState.id, x, y, width, height)
            }
            onRestoreFromSnap={(x, y, width, height) =>
              restoreWindowFromSnap(windowState.id, x, y, width, height)
            }
            onDragEnd={(cursorX, cursorY) => {
              setSnapPreview(null)
              snapWindowToEdge(windowState.id, cursorX, cursorY)
            }}
          >
            {windowState.id === 'projects' ? <ProjectsWindow /> : <ContactWindow />}
          </DesktopWindow>
        ))}
      </div>

      <footer className="desktop-dock fixed bottom-3 left-1/2 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-full border border-line-soft bg-[rgba(5,12,24,0.45)] px-2 py-1.5 backdrop-blur-md md:bottom-3.5 max-md:bottom-20">
        {desktopIcons.map((icon) => (
          <button
            type="button"
            className="rounded-full border border-line-soft bg-[rgba(6,14,28,0.8)] px-3 py-1 text-sm text-text-main"
            key={`dock-${icon.id}`}
            onClick={() => openWindow(icon.id)}
          >
            {icon.label}
          </button>
        ))}
      </footer>
    </section>
  )
}
