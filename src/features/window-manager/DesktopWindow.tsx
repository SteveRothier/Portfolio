import { useEffect, useRef } from 'react'
import type { ReactNode, PointerEvent as ReactPointerEvent } from 'react'
import type { DesktopWindowState } from './types'

type DesktopWindowProps = {
  windowState: DesktopWindowState
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onToggleMaximize: () => void
  onMove: (x: number, y: number) => void
  onDragMove: (cursorX: number, cursorY: number, width: number) => void
  onResize: (x: number, y: number, width: number, height: number) => void
  onRestoreFromSnap: (x: number, y: number, width: number, height: number) => void
  onDragEnd: (cursorX: number, cursorY: number) => void
  children: ReactNode
}

type ResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export function DesktopWindow({
  windowState,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
  onDragMove,
  onResize,
  onRestoreFromSnap,
  onDragEnd,
  children,
}: DesktopWindowProps) {
  const minWidth = 320
  const minHeight = 220
  const minTop = 0
  const viewportPadding = 10

  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    dragging: false,
  })
  const resizeRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    originWidth: 0,
    originHeight: 0,
    direction: 'right' as ResizeDirection,
    resizing: false,
  })

  useEffect(() => {
    const handlePointerUp = (event: PointerEvent) => {
      const wasDragging = dragRef.current.dragging
      dragRef.current.dragging = false
      dragRef.current.pointerId = -1
      resizeRef.current.resizing = false
      resizeRef.current.pointerId = -1
      if (wasDragging) onDragEnd(event.clientX, event.clientY)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (resizeRef.current.resizing) {
        if (resizeRef.current.pointerId !== event.pointerId) return

        const deltaX = event.clientX - resizeRef.current.startX
        const deltaY = event.clientY - resizeRef.current.startY
        const direction = resizeRef.current.direction

        let nextX = resizeRef.current.originX
        let nextY = resizeRef.current.originY
        let nextWidth = resizeRef.current.originWidth
        let nextHeight = resizeRef.current.originHeight

        if (direction.includes('right')) {
          const maxWidth = window.innerWidth - resizeRef.current.originX - viewportPadding
          nextWidth = Math.min(
            Math.max(resizeRef.current.originWidth + deltaX, minWidth),
            Math.max(maxWidth, minWidth),
          )
        }

        if (direction.includes('left')) {
          const rawWidth = resizeRef.current.originWidth - deltaX
          const maxWidth = resizeRef.current.originX + resizeRef.current.originWidth - viewportPadding
          nextWidth = Math.min(Math.max(rawWidth, minWidth), maxWidth)
          nextX = resizeRef.current.originX + (resizeRef.current.originWidth - nextWidth)
          nextX = Math.max(nextX, viewportPadding)
        }

        if (direction.includes('bottom')) {
          const maxHeight = window.innerHeight - resizeRef.current.originY - viewportPadding
          nextHeight = Math.min(
            Math.max(resizeRef.current.originHeight + deltaY, minHeight),
            Math.max(maxHeight, minHeight),
          )
        }

        if (direction.includes('top')) {
          const rawHeight = resizeRef.current.originHeight - deltaY
          const maxHeight = resizeRef.current.originY + resizeRef.current.originHeight - minTop
          nextHeight = Math.min(Math.max(rawHeight, minHeight), maxHeight)
          nextY = resizeRef.current.originY + (resizeRef.current.originHeight - nextHeight)
          nextY = Math.max(nextY, minTop)
        }

        onResize(nextX, nextY, nextWidth, nextHeight)
        return
      }

      if (!dragRef.current.dragging) return
      if (dragRef.current.pointerId !== event.pointerId) return

      const deltaX = event.clientX - dragRef.current.startX
      const deltaY = event.clientY - dragRef.current.startY
      const minVisibleWidth = 120
      const minX = -(windowState.width - minVisibleWidth)
      const maxX = Math.max(window.innerWidth - minVisibleWidth, 0)
      const maxY = Math.max(window.innerHeight - 120, 0)

      const x = Math.min(Math.max(dragRef.current.originX + deltaX, minX), maxX)
      const y = Math.min(Math.max(dragRef.current.originY + deltaY, minTop), maxY)

      onMove(x, y)
      onDragMove(event.clientX, event.clientY, windowState.width)
    }

    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointermove', handlePointerMove)
    return () => {
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [
    minHeight,
    minTop,
    minWidth,
    onDragEnd,
    onDragMove,
    onMove,
    onResize,
    viewportPadding,
    windowState.height,
    windowState.width,
  ])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (resizeRef.current.resizing) return
    const target = event.target as HTMLElement
    if (target.closest('.desktop-window__controls-zone')) return

    const hasSnapBounds = Boolean(windowState.restoreBounds)
    if (windowState.isMaximized || hasSnapBounds) {
      const restore = windowState.restoreBounds ?? {
        x: windowState.x,
        y: windowState.y,
        width: Math.max(Math.floor(window.innerWidth * 0.78), minWidth),
        height: Math.max(Math.floor(window.innerHeight * 0.72), minHeight),
      }

      const pointerRatio = (event.clientX - windowState.x) / Math.max(windowState.width, 1)
      const clampedRatio = Math.min(Math.max(pointerRatio, 0.16), 0.84)
      const maxX = Math.max(window.innerWidth - restore.width - viewportPadding, 0)
      const maxY = Math.max(window.innerHeight - 120, 0)
      const restoredX = Math.min(
        Math.max(event.clientX - restore.width * clampedRatio, viewportPadding),
        maxX,
      )
      const restoredY = Math.min(Math.max(event.clientY - 18, minTop), maxY)

      onRestoreFromSnap(restoredX, restoredY, restore.width, restore.height)

      dragRef.current.pointerId = event.pointerId
      dragRef.current.startX = event.clientX
      dragRef.current.startY = event.clientY
      dragRef.current.originX = restoredX
      dragRef.current.originY = restoredY
      dragRef.current.dragging = true
      onFocus()
      return
    }

    dragRef.current.pointerId = event.pointerId
    dragRef.current.startX = event.clientX
    dragRef.current.startY = event.clientY
    dragRef.current.originX = windowState.x
    dragRef.current.originY = windowState.y
    dragRef.current.dragging = true
    onFocus()
  }

  const handleResizePointerDown =
    (direction: ResizeDirection) => (event: ReactPointerEvent<HTMLDivElement>) => {
      event.stopPropagation()
      if (windowState.isMaximized) return
      resizeRef.current.pointerId = event.pointerId
      resizeRef.current.startX = event.clientX
      resizeRef.current.startY = event.clientY
      resizeRef.current.originX = windowState.x
      resizeRef.current.originY = windowState.y
      resizeRef.current.originWidth = windowState.width
      resizeRef.current.originHeight = windowState.height
      resizeRef.current.direction = direction
      resizeRef.current.resizing = true
      onFocus()
    }

  const handleWindowMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement
    if (target.closest('.control')) return
    onFocus()
  }

  const handleTitlebarDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target.closest('.desktop-window__controls-zone')) return
    onToggleMaximize()
  }

  if (!windowState.isOpen) return null

  const edgeSnapped = windowState.snapMode === 'left' || windowState.snapMode === 'right'

  return (
    <article
      className={[
        'desktop-window fixed overflow-hidden border bg-bg-window shadow-[0_24px_54px_rgba(0,0,0,0.42),0_0_0_1px_rgba(126,160,255,0.12)] backdrop-blur-[16px]',
        windowState.isMaximized
          ? 'desktop-window--maximized rounded-none border-0 shadow-none'
          : edgeSnapped
            ? 'desktop-window--edge-snapped rounded-none border-line-strong'
            : 'rounded-lg border-line-strong',
      ].join(' ')}
      style={{
        width: `${windowState.width}px`,
        height: `${windowState.height}px`,
        transform: `translate3d(${windowState.x}px, ${windowState.y}px, 0)`,
        zIndex: windowState.zIndex,
      }}
      onMouseDown={handleWindowMouseDown}
      aria-label={windowState.title}
    >
      <header
        className="desktop-window__titlebar grid h-11 cursor-grab grid-cols-[1fr_auto_1fr] items-center border-b border-line-soft bg-[rgba(10,20,38,0.75)] px-2.5 active:cursor-grabbing md:px-3"
        onPointerDown={handlePointerDown}
        onDoubleClick={handleTitlebarDoubleClick}
      >
        <span className="min-w-0" aria-hidden />
        <p className="pointer-events-none min-w-0 justify-self-center truncate px-2 text-center text-[0.85rem] text-text-soft">
          {windowState.title}
        </p>
        <div className="desktop-window__controls-zone justify-self-end">
          <div className="desktop-window__controls flex items-center gap-1" aria-hidden>
            <button
              type="button"
              className="control control--min"
              aria-label="Minimiser la fenetre"
              onClick={onMinimize}
              onPointerDown={(event) => event.stopPropagation()}
            />
            <button
              type="button"
              className="control control--max"
              aria-label="Maximiser ou restaurer la fenetre"
              onClick={onToggleMaximize}
              onPointerDown={(event) => event.stopPropagation()}
            />
            <button
              type="button"
              className="control control--close"
              aria-label="Fermer la fenetre"
              onClick={onClose}
              onPointerDown={(event) => event.stopPropagation()}
            />
          </div>
        </div>
      </header>
      <div className="desktop-window__content h-[calc(100%-2.75rem)] overflow-auto bg-bg-window-soft">
        {children}
      </div>
      <div
        className="resize-handle resize-handle--top hidden md:block"
        onPointerDown={handleResizePointerDown('top')}
      />
      <div
        className="resize-handle resize-handle--right hidden md:block"
        onPointerDown={handleResizePointerDown('right')}
      />
      <div
        className="resize-handle resize-handle--bottom hidden md:block"
        onPointerDown={handleResizePointerDown('bottom')}
      />
      <div
        className="resize-handle resize-handle--left hidden md:block"
        onPointerDown={handleResizePointerDown('left')}
      />
      <div
        className="resize-handle resize-handle--top-left hidden md:block"
        onPointerDown={handleResizePointerDown('top-left')}
      />
      <div
        className="resize-handle resize-handle--top-right hidden md:block"
        onPointerDown={handleResizePointerDown('top-right')}
      />
      <div
        className="resize-handle resize-handle--bottom-left hidden md:block"
        onPointerDown={handleResizePointerDown('bottom-left')}
      />
      <div
        className="resize-handle resize-handle--bottom-right hidden md:block"
        onPointerDown={handleResizePointerDown('bottom-right')}
      />
    </article>
  )
}
