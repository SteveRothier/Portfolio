import {
  CircleUserRound,
  Contrast,
  FileText,
  LogOut,
  Mail,
  MapPin,
  MonitorCog,
  Moon,
  Sun,
  User,
  Wifi,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import browserIcon from '../assets/icons/browser.ico'
import contactIcon from '../assets/icons/contact.ico'
import folderIcon from '../assets/icons/folder.ico'
import githubIcon from '../assets/icons/github.ico'
import terminalIcon from '../assets/icons/terminal.ico'
import type { WindowId } from '../windows/types'

const THEME_MENU_ITEMS = [
  { mode: 'light' as const, label: 'Light', Icon: Sun },
  { mode: 'dark' as const, label: 'Dark', Icon: Moon },
  { mode: 'system' as const, label: 'Système', Icon: MonitorCog },
]
const PROFILE_MENU_ITEMS = [
  { id: 'profile', label: 'Profil', Icon: User },
  { id: 'cv', label: 'CV', Icon: FileText },
  { id: 'contact', label: 'Contact', Icon: Mail },
] as const
type ProfileMenuItemId = (typeof PROFILE_MENU_ITEMS)[number]['id']

type ThemeMode = 'system' | 'light' | 'dark'
type ResolvedTheme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'desktop-theme-mode'

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

type NavbarProps = {
  onOpenWindow: (id: WindowId) => void
}

/** Émis par la scène desktop quand un clic n’a pas lieu dans la barre d’état (fermeture des menus). */
export const CLOSE_NAVBAR_MENUS_EVENT = 'steveos-close-navbar-menus'

export function Navbar({ onOpenWindow }: NavbarProps) {
  const [now, setNow] = useState(() => new Date())
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getStoredThemeMode())
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme())
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false)
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode)
  }, [themeMode])

  const resolvedTheme: ResolvedTheme = themeMode === 'system' ? systemTheme : themeMode

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    const closeAllMenus = () => {
      setIsProfileMenuOpen(false)
      setIsLocationMenuOpen(false)
      setIsNetworkMenuOpen(false)
      setIsThemeMenuOpen(false)
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

  const handleProfileAction = (id: ProfileMenuItemId) => {
    if (id === 'contact') {
      onOpenWindow('contact')
    }

    // Fenetre CV a venir.
    setIsProfileMenuOpen(false)
  }

  const timeParts = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)
  const hourText = timeParts.find((part) => part.type === 'hour')?.value ?? '00'
  const minuteText = timeParts.find((part) => part.type === 'minute')?.value ?? '00'
  const iconButtonClass =
    'inline-flex h-7 w-7 items-center justify-center rounded-md text-text-main hover:bg-[var(--sidebar-row-hover)]'
  const closeAllQuickPanels = () => {
    setIsProfileMenuOpen(false)
    setIsLocationMenuOpen(false)
    setIsNetworkMenuOpen(false)
    setIsThemeMenuOpen(false)
  }

  return (
    <header
      className="desktop-status fixed bottom-0 left-0 top-0 z-30 flex w-11 flex-col items-center rounded-none px-1.5 py-2 text-sm text-text-main"
      style={{
        background: 'var(--panel-glass-gradient)',
        backdropFilter: 'blur(6px) saturate(120%)',
        WebkitBackdropFilter: 'blur(6px) saturate(120%)',
        borderRight: '1px solid var(--panel-glass-border)',
        boxShadow: 'var(--panel-glass-shadow)',
      }}
    >
      <span className="desktop-status__brand inline-flex h-7 w-7 items-center justify-center rounded-md bg-[rgba(94,234,212,0.14)] text-[0.65rem] font-bold leading-none text-[var(--sidebar-accent)]">
        S
      </span>
      <div className="mt-2 flex flex-1 flex-col items-center gap-2">
        <button
          type="button"
          className={iconButtonClass}
          aria-label="Projets"
          onClick={() => {
            closeAllQuickPanels()
            onOpenWindow('projects')
          }}
        >
          <img src={folderIcon} alt="" className="size-4 object-contain opacity-95" draggable={false} />
        </button>
        <button
          type="button"
          className={iconButtonClass}
          aria-label="Contact"
          onClick={() => {
            closeAllQuickPanels()
            onOpenWindow('contact')
          }}
        >
          <img src={contactIcon} alt="" className="size-4 object-contain opacity-95" draggable={false} />
        </button>
        <button
          type="button"
          className={iconButtonClass}
          aria-label="Terminal"
          onClick={() => {
            closeAllQuickPanels()
            onOpenWindow('terminal')
          }}
        >
          <img src={terminalIcon} alt="" className="size-4 object-contain opacity-95" draggable={false} />
        </button>
        <button
          type="button"
          className={iconButtonClass}
          aria-label="Navigateur"
          onClick={() => {
            closeAllQuickPanels()
            window.open(window.location.origin, '_blank', 'noopener,noreferrer')
          }}
        >
          <img src={browserIcon} alt="" className="size-4 object-contain opacity-95" draggable={false} />
        </button>
        <button
          type="button"
          className={iconButtonClass}
          aria-label="GitHub"
          onClick={() => {
            closeAllQuickPanels()
            window.open('https://github.com/SteveRothier', '_blank', 'noopener,noreferrer')
          }}
        >
          <img src={githubIcon} alt="" className="size-4 object-contain opacity-95" draggable={false} />
        </button>
      </div>
      <div className="relative mt-auto flex flex-col items-center gap-1">
        <button
          type="button"
          className={iconButtonClass}
          onClick={() => {
            setIsProfileMenuOpen((value) => !value)
            setIsLocationMenuOpen(false)
            setIsNetworkMenuOpen(false)
            setIsThemeMenuOpen(false)
          }}
          aria-label="Profil"
        >
          <CircleUserRound className="size-[0.9rem]" aria-hidden />
        </button>
        <button
          type="button"
          className={iconButtonClass}
          onClick={() => {
            setIsLocationMenuOpen((value) => !value)
            setIsProfileMenuOpen(false)
            setIsNetworkMenuOpen(false)
            setIsThemeMenuOpen(false)
          }}
          aria-label="Localisation"
        >
          <MapPin className="size-[0.9rem]" aria-hidden />
        </button>
        <button
          type="button"
          className={iconButtonClass}
          onClick={() => {
            setIsNetworkMenuOpen((value) => !value)
            setIsProfileMenuOpen(false)
            setIsLocationMenuOpen(false)
            setIsThemeMenuOpen(false)
          }}
          aria-label="Réseau"
        >
          <Wifi className="size-[0.9rem]" aria-hidden />
        </button>
        <button
          type="button"
          className={iconButtonClass}
          onClick={() => {
            setIsThemeMenuOpen((value) => !value)
            setIsProfileMenuOpen(false)
            setIsLocationMenuOpen(false)
            setIsNetworkMenuOpen(false)
          }}
          aria-label="Thème"
        >
          <Contrast className="size-[0.9rem]" aria-hidden />
        </button>
        {isProfileMenuOpen ? (
          <div className="absolute left-[calc(100%+0.45rem)] bottom-0 z-50 min-w-[200px] rounded-md border border-line-soft bg-bg-window p-2 shadow-lg backdrop-blur-sm">
            <div className="mb-1 rounded-md bg-[rgba(255,255,255,0.05)] px-2.5 py-2">
              <p className="m-0 text-sm font-semibold text-text-main">SteveOS</p>
              <p className="m-0 mt-0.5 text-xs text-text-soft">Compte local</p>
            </div>
            {PROFILE_MENU_ITEMS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-text-main hover:bg-[rgba(255,255,255,0.06)]"
                onClick={() => handleProfileAction(id)}
              >
                <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
                <span>{label}</span>
              </button>
            ))}
            <div className="my-1 h-px bg-line-soft" aria-hidden />
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-[#f47777] hover:bg-[rgba(244,119,119,0.12)]"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              <LogOut className="size-4 shrink-0" aria-hidden />
              <span>Déconnexion</span>
            </button>
          </div>
        ) : null}

        {isLocationMenuOpen ? (
          <div className="absolute left-[calc(100%+0.45rem)] bottom-0 z-50 min-w-[154px] rounded-md border border-line-soft bg-bg-window p-2 shadow-lg backdrop-blur-sm">
            <p className="m-0 text-xs font-semibold text-text-main">Localisation</p>
            <p className="mt-1 text-sm font-medium text-text-main">Reims</p>
            <p className="mt-0.5 text-xs text-text-soft">France</p>
          </div>
        ) : null}

        {isNetworkMenuOpen ? (
          <div className="absolute left-[calc(100%+0.45rem)] bottom-0 z-50 min-w-[154px] rounded-md border border-line-soft bg-bg-window p-2 shadow-lg backdrop-blur-sm">
            <p className="m-0 text-xs font-semibold text-text-main">Réseau</p>
            <p className="mt-1 text-xs text-text-soft">Accès Internet</p>
          </div>
        ) : null}

        {isThemeMenuOpen ? (
          <div className="absolute left-[calc(100%+0.45rem)] bottom-0 z-50 min-w-[152px] rounded-md border border-line-soft bg-bg-window p-1.5 shadow-lg backdrop-blur-sm">
            {THEME_MENU_ITEMS.map(({ mode, label, Icon }) => (
              <button
                key={mode}
                type="button"
                className={`flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left text-sm ${themeMode === mode ? 'bg-[rgba(56,189,248,0.2)] text-text-main' : 'text-text-soft hover:bg-[rgba(255,255,255,0.06)]'}`}
                onClick={() => {
                  setThemeMode(mode)
                  setIsThemeMenuOpen(false)
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
                  <span>{label}</span>
                </span>
                {themeMode === mode ? <span aria-hidden>✓</span> : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <span className="desktop-status__datetime pointer-events-none mt-1 inline-flex flex-col items-center font-mono text-[1.08rem] font-extrabold tabular-nums leading-[0.88] tracking-[-0.04em] text-[#f2f6ff] [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
        <span>{hourText}</span>
        <span>{minuteText}</span>
      </span>
    </header>
  )
}
