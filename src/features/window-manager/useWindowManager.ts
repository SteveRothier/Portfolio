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
      [id]: { ...prev[id], isOpen: true },
    }))
    bringToFront(id)
  }

  const closeWindow = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }))
  }

  const moveWindow = (id: WindowId, x: number, y: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        x,
        y,
      },
    }))
  }

  return {
    windows,
    orderedWindows,
    openWindow,
    closeWindow,
    bringToFront,
    moveWindow,
  }
}
