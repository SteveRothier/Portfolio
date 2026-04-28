import browserIcon from '../assets/icons/browser.ico'
import contactIcon from '../assets/icons/contact.ico'
import filesIcon from '../assets/icons/folder.ico'
import githubIcon from '../assets/icons/github.ico'
import terminalIcon from '../assets/icons/terminal.ico'
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
  projects: githubIcon,
  contact: contactIcon,
}

export function Dock({ onOpenWindow, windows }: DockProps) {
  const handleDockClick = (windowId?: WindowId) => {
    if (!windowId) return
    onOpenWindow(windowId)
  }

  return (
    <footer className="desktop-dock fixed bottom-3 left-1/2 z-40 inline-flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center justify-center gap-1.5 rounded-[11px] border border-[rgba(126,151,255,0.28)] bg-[linear-gradient(180deg,rgba(43,31,76,0.82),rgba(26,18,49,0.84))] px-2.5 py-1 shadow-[0_8px_24px_rgba(10,3,28,0.46),inset_0_1px_0_rgba(170,196,255,0.16)] backdrop-blur-md md:bottom-3.5 max-md:bottom-20">
      {dockApps.map((app) => {
        const src = DOCK_IMAGES[app.iconAsset]
        const windowState = app.windowId ? windows[app.windowId] : undefined
        const isOpen = Boolean(windowState && (windowState.isOpen || windowState.isMinimized))

        return (
          <button
            type="button"
            key={app.id}
            className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-md transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.03] disabled:cursor-default disabled:opacity-85 ${
              isOpen
                ? 'bg-[rgba(244,88,176,0.2)] shadow-[inset_0_0_0_1px_rgba(246,132,197,0.28)]'
                : 'bg-transparent hover:bg-[rgba(88,66,144,0.32)]'
            }`}
            onClick={() => handleDockClick(app.windowId)}
            disabled={!app.windowId}
            aria-label={app.label}
          >
            <img src={src} alt="" className="size-7 object-contain select-none pointer-events-none md:size-8" draggable={false} />
          </button>
        )
      })}
    </footer>
  )
}
