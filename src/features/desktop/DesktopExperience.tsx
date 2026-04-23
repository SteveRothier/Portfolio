import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ContactWindow } from '../contact/ContactWindow'
import { ProjectsWindow } from '../projects/ProjectsWindow'
import { DesktopWindow } from '../window-manager/DesktopWindow'
import { useWindowManager } from '../window-manager/useWindowManager'
import type { WindowId } from '../window-manager/types'

const desktopIcons: { id: WindowId; label: string; badge: string }[] = [
  { id: 'projects', label: 'Projets', badge: '01' },
  { id: 'contact', label: 'Contact', badge: '02' },
]

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
  } = useWindowManager()
  const [now, setNow] = useState(() => new Date())

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
    <section className="desktop-scene" ref={desktopRef}>
      <div className="desktop-bg" aria-hidden />
      <header className="desktop-status">
        <span className="desktop-status__brand">SteveOS Portfolio</span>
        <span className="desktop-status__datetime">
          <span>{formattedDateTime.date}</span>
          <span className="desktop-status__separator" aria-hidden />
          <span>{formattedDateTime.time}</span>
        </span>
        <span aria-hidden />
      </header>

      <div className="desktop-icons">
        {desktopIcons.map((icon) => (
          <button
            type="button"
            className="desktop-icon"
            key={icon.id}
            onClick={() => openWindow(icon.id)}
            onMouseEnter={(event) => {
              gsap.to(event.currentTarget, { y: -3, duration: 0.16, ease: 'power2.out' })
            }}
            onMouseLeave={(event) => {
              gsap.to(event.currentTarget, { y: 0, duration: 0.16, ease: 'power2.out' })
            }}
          >
            <span className="desktop-icon__glyph" aria-hidden>
              {icon.id === 'projects' ? '▦' : '✉'}
            </span>
            <span className="desktop-icon__label">{icon.label}</span>
            <span className="desktop-icon__badge">{icon.badge}</span>
          </button>
        ))}
      </div>

      <div className="desktop-windows">
        {orderedWindows.map((windowState) => (
          <DesktopWindow
            key={windowState.id}
            windowState={windowState}
            onFocus={() => bringToFront(windowState.id)}
            onClose={() => closeWindow(windowState.id)}
            onMinimize={() => minimizeWindow(windowState.id)}
            onToggleMaximize={() => toggleMaximizeWindow(windowState.id)}
            onMove={(x, y) => moveWindow(windowState.id, x, y)}
            onResize={(x: number, y: number, width: number, height: number) =>
              resizeWindow(windowState.id, x, y, width, height)
            }
          >
            {windowState.id === 'projects' ? <ProjectsWindow /> : <ContactWindow />}
          </DesktopWindow>
        ))}
      </div>

      <footer className="desktop-dock">
        {desktopIcons.map((icon) => (
          <button type="button" key={`dock-${icon.id}`} onClick={() => openWindow(icon.id)}>
            {icon.label}
          </button>
        ))}
      </footer>
    </section>
  )
}
