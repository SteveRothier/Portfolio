import { desktopIcons } from '../constants/desktop'
import type { WindowId } from '../windows/types'

type DockProps = {
  onOpenWindow: (id: WindowId) => void
}

export function Dock({ onOpenWindow }: DockProps) {
  const dockIcons = desktopIcons.filter((icon) => icon.id !== 'projects')

  return (
    <footer className="desktop-dock fixed bottom-3 left-1/2 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-full border border-line-soft bg-[rgba(5,12,24,0.45)] px-2 py-1.5 backdrop-blur-md md:bottom-3.5 max-md:bottom-20">
      {dockIcons.map((icon) => (
        <button
          type="button"
          className="rounded-full border border-line-soft bg-[rgba(6,14,28,0.8)] px-3 py-1 text-sm text-text-main"
          key={`dock-${icon.id}`}
          onClick={() => onOpenWindow(icon.id)}
        >
          {icon.label}
        </button>
      ))}
    </footer>
  )
}
