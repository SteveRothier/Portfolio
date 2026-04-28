import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import gsap from 'gsap'
import {
  CLOSE_NAVBAR_MENUS_EVENT,
  Dock,
  Home,
  Navbar,
  Welcome,
} from '../components'
import { Contact } from './Contact'
import { Projects } from './Projects'
import { DesktopWindow } from './DesktopWindow'
import { useWindowManager } from './useWindowManager'

type SnapTarget = 'top' | 'left' | 'right' | null
type SelectionRect = { x: number; y: number; width: number; height: number } | null

export function DesktopExperience() {
  const desktopRef = useRef<HTMLDivElement | null>(null)
  const selectionStartRef = useRef<{ x: number; y: number; pointerId: number } | null>(null)
  const {
    windows,
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
  const [snapPreview, setSnapPreview] = useState<SnapTarget>(null)
  const [selectionRect, setSelectionRect] = useState<SelectionRect>(null)
  const resolveSnapTarget = (cursorX: number, cursorY: number): SnapTarget => {
    const edgeThreshold = 28
    if (cursorY <= edgeThreshold) return 'top'
    if (cursorX <= edgeThreshold) return 'left'
    if (cursorX >= window.innerWidth - edgeThreshold) return 'right'
    return null
  }

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

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!selectionStartRef.current || selectionStartRef.current.pointerId !== event.pointerId) return
      const start = selectionStartRef.current
      const x = Math.min(start.x, event.clientX)
      const y = Math.min(start.y, event.clientY)
      const width = Math.abs(event.clientX - start.x)
      const height = Math.abs(event.clientY - start.y)
      setSelectionRect({ x, y, width, height })
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (!selectionStartRef.current || selectionStartRef.current.pointerId !== event.pointerId) return
      selectionStartRef.current = null
      setSelectionRect(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  const handleDesktopPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    const target = event.target as HTMLElement
    if (
      target.closest(
        '.desktop-window, .desktop-icon, .desktop-dock, .desktop-status, .desktop-window__titlebar',
      )
    ) {
      return
    }
    selectionStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    }
    setSelectionRect({ x: event.clientX, y: event.clientY, width: 0, height: 0 })
  }

  const handleScenePointerDownCapture = (event: ReactPointerEvent<HTMLElement>) => {
    const target = event.target
    if (!(target instanceof Element)) return
    if (target.closest('.desktop-status')) return
    window.dispatchEvent(new CustomEvent(CLOSE_NAVBAR_MENUS_EVENT))
  }

  return (
    <section
      className="desktop-scene relative isolate min-h-dvh overflow-hidden"
      ref={desktopRef}
      onPointerDown={handleDesktopPointerDown}
      onPointerDownCapture={handleScenePointerDownCapture}
    >
      <Welcome />
      <Navbar onOpenWindow={openWindow} />
      <Home onOpenWindow={openWindow} />

      <div className="desktop-windows relative min-h-dvh">
        {snapPreview ? <div className={`snap-preview snap-preview--${snapPreview}`} aria-hidden /> : null}
        {selectionRect ? (
          <div
            className="desktop-selection-box pointer-events-none fixed z-20 rounded-[2px] border"
            style={{
              left: `${selectionRect.x}px`,
              top: `${selectionRect.y}px`,
              width: `${selectionRect.width}px`,
              height: `${selectionRect.height}px`,
              borderColor: 'var(--selection-border)',
              backgroundColor: 'var(--selection-fill)',
            }}
            aria-hidden
          />
        ) : null}
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
            {windowState.id === 'projects' ? <Projects /> : <Contact />}
          </DesktopWindow>
        ))}
      </div>

      <Dock onOpenWindow={openWindow} windows={windows} />
    </section>
  )
}
