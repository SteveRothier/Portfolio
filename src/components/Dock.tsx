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

  const activeWindowId =
    (Object.values(windows)
      .filter((windowState) => windowState.isOpen && !windowState.isMinimized)
      .sort((a, b) => b.zIndex - a.zIndex)[0]?.id as WindowId | undefined) ?? undefined

  return (
    <footer className="desktop-dock fixed bottom-0 left-1/2 z-40 inline-flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center justify-center gap-1.5 rounded-t-[5px] rounded-b-none border border-b-0 border-[rgba(66,52,104,0.72)] bg-[linear-gradient(180deg,rgba(43,31,76,0.82),rgba(26,18,49,0.84))] px-2.5 py-1 shadow-[0_8px_24px_rgba(10,3,28,0.46),inset_0_1px_0_rgba(170,196,255,0.16)] backdrop-blur-md">
      {dockApps.map((app) => {
        const src = DOCK_IMAGES[app.iconAsset]
        const windowState = app.windowId ? windows[app.windowId] : undefined
        const isOpen = Boolean(windowState && (windowState.isOpen || windowState.isMinimized))
        const isActive = Boolean(app.windowId && activeWindowId === app.windowId)

        return (
          <div key={app.id} className="relative inline-flex h-10 w-10 items-center justify-center">
            <button
              type="button"
              className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-md transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.03] disabled:cursor-default disabled:opacity-85 ${
                isOpen
                  ? 'bg-transparent shadow-none'
                  : 'bg-transparent hover:bg-transparent'
              }`}
              onClick={() => handleDockClick(app.windowId)}
              disabled={!app.windowId}
              aria-label={app.label}
            >
              <img src={src} alt="" className="size-7 object-contain select-none pointer-events-none md:size-8" draggable={false} />
            </button>
            <span
              className={`absolute -bottom-[4px] left-1/2 -translate-x-1/2 rounded-full bg-[#ff4fd6] shadow-[0_0_8px_rgba(255,79,214,0.55)] transition-all duration-150 ${
                isActive ? 'h-[2px] w-5 opacity-100' : isOpen ? 'h-[2px] w-1.5 opacity-95' : 'h-[2px] w-1.5 opacity-0'
              }`}
              aria-hidden
            />
          </div>
        )
      })}
    </footer>
  )
}
