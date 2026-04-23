import { useEffect, useRef } from 'react'
import type { ReactNode, PointerEvent as ReactPointerEvent } from 'react'
import type { DesktopWindowState } from './types'

type DesktopWindowProps = {
  windowState: DesktopWindowState
  onFocus: () => void
  onClose: () => void
  onMove: (x: number, y: number) => void
  children: ReactNode
}

export function DesktopWindow({
  windowState,
  onFocus,
  onClose,
  onMove,
  children,
}: DesktopWindowProps) {
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    dragging: false,
  })

  useEffect(() => {
    const handlePointerUp = () => {
      dragRef.current.dragging = false
      dragRef.current.pointerId = -1
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragRef.current.dragging) return
      if (dragRef.current.pointerId !== event.pointerId) return

      const deltaX = event.clientX - dragRef.current.startX
      const deltaY = event.clientY - dragRef.current.startY
      const maxX = Math.max(window.innerWidth - windowState.width - 12, 0)
      const maxY = Math.max(window.innerHeight - 120, 0)

      const x = Math.min(Math.max(dragRef.current.originX + deltaX, 0), maxX)
      const y = Math.min(Math.max(dragRef.current.originY + deltaY, 42), maxY)

      onMove(x, y)
    }

    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointermove', handlePointerMove)
    return () => {
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [onMove, windowState.height, windowState.width])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current.pointerId = event.pointerId
    dragRef.current.startX = event.clientX
    dragRef.current.startY = event.clientY
    dragRef.current.originX = windowState.x
    dragRef.current.originY = windowState.y
    dragRef.current.dragging = true
    onFocus()
  }

  if (!windowState.isOpen) return null

  return (
    <article
      className="desktop-window"
      style={{
        width: `${windowState.width}px`,
        height: `${windowState.height}px`,
        transform: `translate3d(${windowState.x}px, ${windowState.y}px, 0)`,
        zIndex: windowState.zIndex,
      }}
      onMouseDown={onFocus}
      aria-label={windowState.title}
    >
      <header className="desktop-window__titlebar" onPointerDown={handlePointerDown}>
        <div className="desktop-window__controls" aria-hidden>
          <span className="control control--close" />
          <span className="control control--min" />
          <span className="control control--max" />
        </div>
        <p>{windowState.title}</p>
        <button type="button" className="desktop-window__close" onClick={onClose}>
          Fermer
        </button>
      </header>
      <div className="desktop-window__content">{children}</div>
    </article>
  )
}
