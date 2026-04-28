import browserIcon from '../assets/icons/browser.png'
import contactIcon from '../assets/icons/contact.png'
import filesIcon from '../assets/icons/files.png'
import projetsIcon from '../assets/icons/projets.png'
import terminalIcon from '../assets/icons/terminal.png'
import type { DockIconAsset } from '../constants/desktop'
import { dockApps } from '../constants/desktop'
import type { DesktopWindowState, WindowId } from '../windows/types'

type DockProps = {
  onOpenWindow: (id: WindowId) => void
  windows: Record<WindowId, DesktopWindowState>
}

const DOCK_IMAGES: Record<DockIconAsset, string> = {
  files: filesIcon,
  browser: browserIcon,
  terminal: terminalIcon,
  projects: projetsIcon,
  contact: contactIcon,
}

export function Dock({ onOpenWindow, windows }: DockProps) {
  const handleDockClick = (windowId?: WindowId) => {
    if (!windowId) return
    onOpenWindow(windowId)
  }

  return (
    <footer className="desktop-dock fixed bottom-3 left-1/2 z-40 inline-flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center justify-center gap-2.5 md:bottom-3.5 max-md:bottom-20">
      {dockApps.map((app) => {
        const src = DOCK_IMAGES[app.iconAsset]
        const windowState = app.windowId ? windows[app.windowId] : undefined
        const isOpen = Boolean(windowState && (windowState.isOpen || windowState.isMinimized))

        return (
          <button
            type="button"
            key={app.id}
            className="group relative inline-flex min-h-[3rem] min-w-[3rem] items-center justify-center rounded-none bg-transparent transition-transform duration-150 hover:-translate-y-1 hover:scale-[1.05] disabled:cursor-default disabled:opacity-85"
            onClick={() => handleDockClick(app.windowId)}
            disabled={!app.windowId}
            aria-label={app.label}
          >
            <img src={src} alt="" className="size-10 object-contain select-none pointer-events-none md:size-11" draggable={false} />
            <span
              className={`absolute -bottom-1 h-1.5 w-1.5 rounded-full transition-opacity ${isOpen ? 'bg-[#7bc2ff] opacity-100' : 'bg-transparent opacity-0'}`}
              aria-hidden
            />
          </button>
        )
      })}
    </footer>
  )
}
