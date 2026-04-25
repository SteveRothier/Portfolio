import { useEffect, useMemo } from 'react'
import { useWindowStore } from '../store/windowStore'

export function useWindowManager() {
  const windows = useWindowStore((state) => state.windows)
  const openWindow = useWindowStore((state) => state.openWindow)
  const closeWindow = useWindowStore((state) => state.closeWindow)
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow)
  const toggleMaximizeWindow = useWindowStore((state) => state.toggleMaximizeWindow)
  const bringToFront = useWindowStore((state) => state.bringToFront)
  const moveWindow = useWindowStore((state) => state.moveWindow)
  const resizeWindow = useWindowStore((state) => state.resizeWindow)
  const restoreWindowFromSnap = useWindowStore((state) => state.restoreWindowFromSnap)
  const snapWindowToEdge = useWindowStore((state) => state.snapWindowToEdge)
  const clampToViewport = useWindowStore((state) => state.clampToViewport)
  const normalizeTitles = useWindowStore((state) => state.normalizeTitles)

  useEffect(() => {
    normalizeTitles()
    clampToViewport()
  }, [clampToViewport, normalizeTitles])

  useEffect(() => {
    const onResize = () => clampToViewport()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [clampToViewport])

  const orderedWindows = useMemo(
    () => Object.values(windows).sort((a, b) => a.zIndex - b.zIndex),
    [windows],
  )

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
