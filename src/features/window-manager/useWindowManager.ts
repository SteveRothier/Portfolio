import { useMemo, useState } from 'react'
import type { DesktopWindowState, WindowConfig, WindowId } from './types'

const INITIAL_WINDOWS: WindowConfig[] = [
  { id: 'projects', title: 'Projects', width: 680, height: 420, x: 120, y: 110 },
  { id: 'contact', title: 'Contact', width: 420, height: 360, x: 220, y: 170 },
]

function toWindowState(config: WindowConfig, zIndex: number): DesktopWindowState {
  return {
    ...config,
    zIndex,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  }
}

export function useWindowManager() {
  const [, setNextZ] = useState(10)
  const [windows, setWindows] = useState<Record<WindowId, DesktopWindowState>>(() => ({
    projects: toWindowState(INITIAL_WINDOWS[0], 1),
    contact: toWindowState(INITIAL_WINDOWS[1], 2),
  }))

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
      [id]: { ...prev[id], isOpen: false, isMinimized: false, isMaximized: false },
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
            restoreBounds: undefined,
          },
        }
      }

      return {
        ...prev,
        [id]: {
          ...current,
          x: 12,
          y: 44,
          width: Math.max(window.innerWidth - 24, 320),
          height: Math.max(window.innerHeight - 58, 220),
          isMaximized: true,
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
        restoreBounds: undefined,
        x,
        y,
        width,
        height,
      },
    }))
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
  }
}
