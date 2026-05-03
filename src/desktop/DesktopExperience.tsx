import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import gsap from 'gsap'
import { Home } from '../components/Home'
import { CLOSE_NAVBAR_MENUS_EVENT, Navbar } from '../components/Navbar'
import { Welcome } from '../components/Welcome'
import { useWindowManager } from '../store/windowStore'
import type { DesktopWindowState, WindowId } from '../windows/types'
import resumePdf from '../assets/cv/resume.pdf'
import { WindowResize } from './WindowResize'
import { WindowContent } from './WindowContent'

type SelectionRect = { x: number; y: number; width: number; height: number } | null

type DesktopWindowRowProps = {
  windowState: DesktopWindowState
  stackIndex: number
  isActive: boolean
  resumePdf: string
  bringToFront: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  minimizeWindow: (id: WindowId) => void
  toggleMaximizeWindow: (id: WindowId) => void
  moveWindow: (id: WindowId, x: number, y: number) => void
  resizeWindow: (id: WindowId, x: number, y: number, width: number, height: number) => void
  restoreWindowFromSnap: (id: WindowId, x: number, y: number, width: number, height: number) => void
}

function DesktopWindowRowInner({
  windowState,
  stackIndex,
  isActive,
  resumePdf: resumePdfUrl,
  bringToFront,
  closeWindow,
  minimizeWindow,
  toggleMaximizeWindow,
  moveWindow,
  resizeWindow,
  restoreWindowFromSnap,
}: DesktopWindowRowProps) {
  const id = windowState.id

  const onFocus = useCallback(() => bringToFront(id), [bringToFront, id])
  const onClose = useCallback(() => closeWindow(id), [closeWindow, id])
  const onMinimize = useCallback(() => minimizeWindow(id), [minimizeWindow, id])
  const onToggleMaximize = useCallback(() => toggleMaximizeWindow(id), [toggleMaximizeWindow, id])
  const onMove = useCallback((x: number, y: number) => moveWindow(id, x, y), [moveWindow, id])
  const onResize = useCallback(
    (x: number, y: number, width: number, height: number) => resizeWindow(id, x, y, width, height),
    [resizeWindow, id],
  )
  const onRestoreFromSnap = useCallback(
    (x: number, y: number, width: number, height: number) => restoreWindowFromSnap(id, x, y, width, height),
    [restoreWindowFromSnap, id],
  )
  const onDownload = useCallback(() => {
    window.open(resumePdfUrl, '_blank', 'noopener,noreferrer')
  }, [resumePdfUrl])

  return (
    <WindowResize
      windowState={windowState}
      isActive={isActive}
      stackIndex={stackIndex}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
      contentScrollable={id !== 'cv'}
      onDownload={id === 'cv' ? onDownload : undefined}
      onToggleMaximize={onToggleMaximize}
      onMove={onMove}
      onResize={onResize}
      onRestoreFromSnap={onRestoreFromSnap}
    >
      <WindowContent id={id} />
    </WindowResize>
  )
}

const DesktopWindowRow = memo(DesktopWindowRowInner)

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
  } = useWindowManager()
  const [selectionRect, setSelectionRect] = useState<SelectionRect>(null)

  const activeWindowId = useMemo(() => {
    const open = orderedWindows.filter((windowState) => windowState.isOpen)
    if (open.length === 0) return null
    return open.sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
  }, [orderedWindows])

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
        y: 14,
        opacity: 0,
        duration: 0.35,
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
        '.desktop-window, .desktop-icon, .desktop-xp-shortcut, .desktop-status, .desktop-window__titlebar',
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
      <Navbar onOpenWindow={openWindow} onRequestMinimizeWindow={minimizeWindow} windows={windows} />
      <Home onOpenWindow={openWindow} />

      <div className="desktop-windows relative min-h-dvh">
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
        {orderedWindows.map((windowState, index) => (
          <DesktopWindowRow
            key={windowState.id}
            windowState={windowState}
            stackIndex={windowState.isMaximized ? 60 + index : 31 + index}
            isActive={activeWindowId === windowState.id}
            resumePdf={resumePdf}
            bringToFront={bringToFront}
            closeWindow={closeWindow}
            minimizeWindow={minimizeWindow}
            toggleMaximizeWindow={toggleMaximizeWindow}
            moveWindow={moveWindow}
            resizeWindow={resizeWindow}
            restoreWindowFromSnap={restoreWindowFromSnap}
          />
        ))}
      </div>
    </section>
  )
}
