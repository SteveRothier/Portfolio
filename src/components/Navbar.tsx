import { MapPin, Wifi } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import browserIcon from '../assets/icons/Internet Explorer 6.png'
import folderIcon from '../assets/icons/Folder Closed.png'
import msnIcon from '../assets/icons/MSN.png'
import terminalIcon from '../assets/icons/Command Prompt.png'
import xpLogo from '../assets/xplogo.png'
import type { DesktopWindowState, WindowId } from '../windows/types'

const THEME_STORAGE_KEY = 'desktop-theme-mode'

type ThemeMode = 'system' | 'light' | 'dark'
type ResolvedTheme = 'light' | 'dark'

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  const value = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (value === 'light' || value === 'dark' || value === 'system') return value
  return 'system'
}

function applyDocumentTheme() {
  const mode = getStoredThemeMode()
  const resolved: ResolvedTheme = mode === 'system' ? getSystemTheme() : mode
  document.documentElement.dataset.theme = resolved
  document.documentElement.style.colorScheme = resolved
}

type NavbarProps = {
  onOpenWindow: (id: WindowId) => void
  onRequestMinimizeWindow: (id: WindowId) => void
  windows: Record<WindowId, DesktopWindowState>
}

/** Émis par la scène desktop quand un clic n’a pas lieu dans la barre d’état (fermeture des menus). */
export const CLOSE_NAVBAR_MENUS_EVENT = 'steveos-close-navbar-menus'

type TaskbarApp = {
  id: string
  label: string
  icon: string
  windowId?: WindowId
  href?: string
}

const TASKBAR_APPS: TaskbarApp[] = [
  { id: 'projects', label: 'Projets', icon: folderIcon, windowId: 'projects' },
  { id: 'contact', label: 'Contact', icon: msnIcon, windowId: 'contact' },
  { id: 'terminal', label: 'Terminal', icon: terminalIcon, windowId: 'terminal' },
  { id: 'about', label: 'À propos', icon: browserIcon, windowId: 'about' },
]

export function Navbar({ onOpenWindow, onRequestMinimizeWindow, windows }: NavbarProps) {
  const [now, setNow] = useState(() => new Date())
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false)
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false)

  useEffect(() => {
    applyDocumentTheme()
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemThemeChange = () => {
      if (getStoredThemeMode() === 'system') applyDocumentTheme()
    }
    mediaQuery.addEventListener('change', onSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', onSystemThemeChange)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const closeAllMenus = () => {
      setIsStartMenuOpen(false)
      setIsLocationMenuOpen(false)
      setIsNetworkMenuOpen(false)
    }

    const handleCloseRequest = () => {
      closeAllMenus()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAllMenus()
      }
    }

    window.addEventListener(CLOSE_NAVBAR_MENUS_EVENT, handleCloseRequest)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener(CLOSE_NAVBAR_MENUS_EVENT, handleCloseRequest)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const iconButtonClass =
    'inline-flex h-8 w-8 items-center justify-center rounded-[3px] text-white hover:bg-[rgba(255,255,255,0.18)]'
  const closeTrayMenus = () => {
    setIsLocationMenuOpen(false)
    setIsNetworkMenuOpen(false)
  }
  const activeWindowId =
    (Object.values(windows)
      .filter((windowState) => windowState.isOpen && !windowState.isMinimized)
      .sort((a, b) => b.zIndex - a.zIndex)[0]?.id as WindowId | undefined) ?? undefined

  const handleTaskbarClick = (app: TaskbarApp) => {
    if (app.windowId) {
      if (activeWindowId === app.windowId) {
        onRequestMinimizeWindow(app.windowId)
        return
      }
      onOpenWindow(app.windowId)
      return
    }
    if (app.href) {
      window.open(app.href, '_blank', 'noopener,noreferrer')
    }
  }

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now),
    [now],
  )

  return (
    <header
      className="desktop-status fixed bottom-0 left-0 right-0 z-30 flex h-12 items-stretch gap-2 pr-0 text-sm text-text-main"
      style={{
        background:
          'linear-gradient(180deg, rgba(67,133,208,0.96) 0%, rgba(39,96,177,0.95) 50%, rgba(35,86,162,0.96) 100%)',
        borderTop: '1px solid rgba(197, 226, 255, 0.56)',
        boxShadow: '0 -4px 14px rgba(9, 30, 72, 0.34), inset 0 1px 0 rgba(255,255,255,0.24)',
      }}
    >
      <div className="relative h-full shrink-0">
        <button
          type="button"
          className={`xp-start-button inline-flex h-full items-center gap-1.5 text-[0.82rem] font-bold text-[#f6fff0] transition ${
            isStartMenuOpen ? 'xp-start-button--pressed' : ''
          }`}
          onClick={() => {
            setIsStartMenuOpen((value) => !value)
            closeTrayMenus()
          }}
          aria-label="Menu Démarrer"
        >
          <span className="xp-start-button__logo-wrap" aria-hidden>
            <img src={xpLogo} alt="" className="xp-start-button__logo-image" draggable={false} />
          </span>
          <span className="xp-start-button__label">démarrer</span>
        </button>
        {isStartMenuOpen ? (
          <div className="absolute bottom-[calc(100%+0.45rem)] left-0 z-50 w-[230px] rounded-[10px] border border-[rgba(181,214,255,0.58)] bg-[linear-gradient(180deg,rgba(48,97,173,0.98),rgba(27,66,135,0.98))] p-2 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
            {TASKBAR_APPS.filter((app) => app.windowId).map((app) => (
              <button
                key={`start-${app.id}`}
                type="button"
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-[#f3f8ff] hover:bg-[rgba(255,255,255,0.14)]"
                onClick={() => {
                  setIsStartMenuOpen(false)
                  handleTaskbarClick(app)
                }}
              >
                <img src={app.icon} alt="" className="size-4 object-contain" draggable={false} />
                <span>{app.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex h-full flex-1 items-center gap-0.5 px-1">
        {TASKBAR_APPS.map((app) => {
          const isOpen = Boolean(app.windowId && (windows[app.windowId].isOpen || windows[app.windowId].isMinimized))
          const isActive = Boolean(app.windowId && activeWindowId === app.windowId)
          return (
            <button
              key={app.id}
              type="button"
              className={`xp-taskbar-app relative inline-flex h-full min-w-[44px] items-center justify-center px-1.5 transition ${
                isActive ? 'xp-taskbar-app--active' : isOpen ? 'xp-taskbar-app--open' : ''
              }`}
              onClick={() => handleTaskbarClick(app)}
              aria-label={app.label}
              title={app.label}
            >
              <img src={app.icon} alt="" className="xp-taskbar-app__icon object-contain" draggable={false} />
            </button>
          )
        })}
      </div>

      <div
        className="relative flex h-full items-center rounded-l-[3px] py-1 pl-1.5"
        style={{
          background: 'linear-gradient(180deg, #42a5ff 0%, #1c85e8 42%, #0f6ec9 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28)',
        }}
      >
        <div className="flex items-center gap-px">
          <button
            type="button"
            className={iconButtonClass}
            onClick={() => {
              setIsLocationMenuOpen((value) => !value)
              setIsNetworkMenuOpen(false)
              setIsStartMenuOpen(false)
            }}
            aria-label="Localisation"
          >
            <MapPin className="size-[1rem]" aria-hidden />
          </button>
          <button
            type="button"
            className={iconButtonClass}
            onClick={() => {
              setIsNetworkMenuOpen((value) => !value)
              setIsLocationMenuOpen(false)
              setIsStartMenuOpen(false)
            }}
            aria-label="Réseau"
          >
            <Wifi className="size-[1rem]" aria-hidden />
          </button>
        </div>

        {isLocationMenuOpen ? (
          <div className="absolute right-0 bottom-[calc(100%+0.45rem)] z-50 min-w-[154px] rounded-md border border-line-soft bg-bg-window p-2 shadow-lg backdrop-blur-sm">
            <p className="m-0 text-xs font-semibold text-text-main">Localisation</p>
            <p className="mt-1 text-sm font-medium text-text-main">Reims</p>
            <p className="mt-0.5 text-xs text-text-soft">France</p>
          </div>
        ) : null}

        {isNetworkMenuOpen ? (
          <div className="absolute right-0 bottom-[calc(100%+0.45rem)] z-50 min-w-[154px] rounded-md border border-line-soft bg-bg-window p-2 shadow-lg backdrop-blur-sm">
            <p className="m-0 text-xs font-semibold text-text-main">Réseau</p>
            <p className="mt-1 text-xs text-text-soft">Accès Internet</p>
          </div>
        ) : null}

        <span
          className="pointer-events-none inline-flex items-center text-xs tabular-nums font-medium text-white"
          style={{
            paddingLeft: 'max(1rem, env(safe-area-inset-right, 0px))',
            paddingRight: 'max(1.25rem, env(safe-area-inset-right, 0px))',
          }}
        >
          {formattedTime}
        </span>
      </div>
    </header>
  )
}
