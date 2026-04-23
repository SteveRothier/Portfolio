import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ContactWindow } from '../contact/ContactWindow'
import { ProjectsWindow } from '../projects/ProjectsWindow'
import { DesktopWindow } from '../window-manager/DesktopWindow'
import { useWindowManager } from '../window-manager/useWindowManager'
import type { WindowId } from '../window-manager/types'

const desktopIcons: { id: WindowId; label: string; badge: string }[] = [
  { id: 'projects', label: 'Projects', badge: '01' },
  { id: 'contact', label: 'Contact', badge: '02' },
]

export function DesktopExperience() {
  const desktopRef = useRef<HTMLDivElement | null>(null)
  const { orderedWindows, openWindow, closeWindow, bringToFront, moveWindow } = useWindowManager()

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
        <span>SteveOS Portfolio</span>
        <span>Interactive Desktop V1</span>
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
            onMove={(x, y) => moveWindow(windowState.id, x, y)}
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
