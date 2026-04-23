import { useEffect, useMemo, useState } from 'react'
import type { DesktopWindowState, WindowConfig, WindowId } from './types'

const INITIAL_WINDOWS: WindowConfig[] = [
  { id: 'projects', title: 'Projets', width: 680, height: 420, x: 120, y: 110 },
  { id: 'contact', title: 'Contact', width: 420, height: 360, x: 220, y: 170 },
]

const WINDOW_TITLES: Record<WindowId, string> = {
  projects: 'Projets',
  contact: 'Contact',
}

function toWindowState(config: WindowConfig, zIndex: number): DesktopWindowState {
  return {
    ...config,
    zIndex,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    snapMode: 'none',
  }
}

export function useWindowManager() {
  const [, setNextZ] = useState(120)
  const [windows, setWindows] = useState<Record<WindowId, DesktopWindowState>>(() => ({
    projects: toWindowState(INITIAL_WINDOWS[0], 101),
    contact: toWindowState(INITIAL_WINDOWS[1], 102),
  }))

  useEffect(() => {
    setWindows((prev) => {
      let hasChanges = false
      const next = { ...prev }

      ;(Object.keys(prev) as WindowId[]).forEach((id) => {
        const expectedTitle = WINDOW_TITLES[id]
        if (prev[id].title !== expectedTitle) {
          hasChanges = true
          next[id] = { ...prev[id], title: expectedTitle }
        }
      })

      return hasChanges ? next : prev
    })
  }, [])

  const orderedWindows = useMemo(
    () => Object.values(windows).sort((a, b) => a.zIndex - b.zIndex),
    [windows],
  )

  const bringToFront = (id: WindowId) => {
    setNextZ((currentZ) => {
      const upcomingZ = currentZ + 1
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], zIndex: upcomingZ },
      }))
      return upcomingZ
    })
  }

  const openWindow = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false },
    }))
    bringToFront(id)
  }

  const closeWindow = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        snapMode: 'none',
      },
    }))
  }

  const minimizeWindow = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
        isMinimized: true,
      },
    }))
  }

  const toggleMaximizeWindow = (id: WindowId) => {
    setWindows((prev) => {
      const current = prev[id]
      if (current.isMaximized && current.restoreBounds) {
        return {
          ...prev,
          [id]: {
            ...current,
            ...current.restoreBounds,
            isMaximized: false,
            snapMode: 'none',
            restoreBounds: undefined,
          },
        }
      }

      return {
        ...prev,
        [id]: {
          ...current,
          x: 0,
          y: 0,
          width: Math.max(window.innerWidth, 320),
          height: Math.max(window.innerHeight, 220),
          isMaximized: true,
          snapMode: 'top',
          restoreBounds: {
            x: current.x,
            y: current.y,
            width: current.width,
            height: current.height,
          },
        },
      }
    })
    bringToFront(id)
  }

  const moveWindow = (id: WindowId, x: number, y: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: false,
        snapMode: 'none',
        restoreBounds: undefined,
        x,
        y,
      },
    }))
  }

  const resizeWindow = (id: WindowId, x: number, y: number, width: number, height: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: false,
        snapMode: 'none',
        restoreBounds: undefined,
        x,
        y,
        width,
        height,
      },
    }))
  }

  const restoreWindowFromSnap = (id: WindowId, x: number, y: number, width: number, height: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        x,
        y,
        width,
        height,
        isMaximized: false,
        snapMode: 'none',
        restoreBounds: undefined,
      },
    }))
    bringToFront(id)
  }

  const snapWindowToEdge = (id: WindowId) => {
    const edgeThreshold = 28

    setWindows((prev) => {
      const current = prev[id]
      if (!current.isOpen) return prev

      const nearTop = current.y <= edgeThreshold
      const nearLeft = current.x <= edgeThreshold
      const nearRight = current.x + current.width >= window.innerWidth - edgeThreshold

      if (!nearTop && !nearLeft && !nearRight) return prev

      if (nearTop) {
        const previousBounds =
          current.restoreBounds ??
          ({
            x: current.x,
            y: current.y,
            width: current.width,
            height: current.height,
          } as const)

        return {
          ...prev,
          [id]: {
            ...current,
            x: 0,
            y: 0,
            width: Math.max(window.innerWidth, 320),
            height: Math.max(window.innerHeight, 220),
            isMaximized: true,
            snapMode: 'top',
            restoreBounds: previousBounds,
          },
        }
      }

      const halfWidth = Math.max(Math.floor(window.innerWidth / 2), 320)
      const fullHeight = Math.max(window.innerHeight, 220)

      if (nearLeft) {
        const previousBounds =
          current.restoreBounds ??
          ({
            x: current.x,
            y: current.y,
            width: current.width,
            height: current.height,
          } as const)

        return {
          ...prev,
          [id]: {
            ...current,
            x: 0,
            y: 0,
            width: halfWidth,
            height: fullHeight,
            isMaximized: false,
            snapMode: 'left',
            restoreBounds: previousBounds,
          },
        }
      }

      const previousBounds =
        current.restoreBounds ??
        ({
          x: current.x,
          y: current.y,
          width: current.width,
          height: current.height,
        } as const)

      return {
        ...prev,
        [id]: {
          ...current,
          x: Math.max(window.innerWidth - halfWidth, 0),
          y: 0,
          width: halfWidth,
          height: fullHeight,
          isMaximized: false,
          snapMode: 'right',
          restoreBounds: previousBounds,
        },
      }
    })

    bringToFront(id)
  }

  return {
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
  }
}
