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
import { useEffect, useMemo, useState } from 'react'
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

  const formattedDateTime = useMemo(() => {
    const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' })
      .format(now)
      .replace('.', '')
      .toLowerCase()
    const day = new Intl.DateTimeFormat('fr-FR', { day: '2-digit' }).format(now)
    const month = new Intl.DateTimeFormat('fr-FR', { month: 'short' })
      .format(now)
      .replace('.', '')
      .toLowerCase()
    const time = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now)
    return {
      center: `${weekday} ${day} ${month} ${time}`,
    }
  }, [now])

  const handleProfileAction = (id: ProfileMenuItemId) => {
    if (id === 'contact') {
      onOpenWindow('contact')
    }

    // Fenetre CV a venir.
    setIsProfileMenuOpen(false)
  }

  return (
    <header
      className="desktop-status fixed left-0 right-0 top-0 z-10 flex h-9 items-center justify-between rounded-none px-2 text-sm text-text-main md:px-2.5 relative"
      style={{
        background: 'var(--navbar-bg)',
        backdropFilter: 'blur(14px) saturate(135%)',
        WebkitBackdropFilter: 'blur(14px) saturate(135%)',
      }}
    >
      <span className="desktop-status__brand inline-flex h-full items-center truncate pr-2 text-xs font-semibold leading-none md:text-sm">
        SteveOS
      </span>
      <span className="desktop-status__datetime pointer-events-none absolute left-1/2 top-1/2 inline-flex h-[1rem] -translate-x-1/2 -translate-y-1/2 items-center text-xs tabular-nums leading-none text-text-main md:text-[0.82rem]">
        {formattedDateTime.center}
      </span>

      <div className="flex h-full items-center gap-2.5">
        <div className="relative inline-flex h-full items-center">
          <button
            type="button"
            className="inline-flex h-[1rem] w-[1rem] items-center justify-center rounded text-text-main hover:opacity-80"
            onClick={() => {
              setIsProfileMenuOpen((value) => !value)
              setIsLocationMenuOpen(false)
              setIsNetworkMenuOpen(false)
              setIsThemeMenuOpen(false)
            }}
            aria-label="Ouvrir le menu profil"
          >
            <CircleUserRound className="size-[0.95rem]" aria-hidden />
          </button>
          {isProfileMenuOpen ? (
            <div className="absolute right-0 top-[calc(100%+0.4rem)] z-50 min-w-[200px] rounded-md border border-line-soft bg-bg-window p-2 shadow-lg backdrop-blur-md">
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
        </div>
        <div className="relative inline-flex h-full items-center">
          <button
            type="button"
            className="inline-flex h-[1rem] w-[1rem] items-center justify-center rounded text-text-main hover:opacity-80"
            onClick={() => {
              setIsLocationMenuOpen((value) => !value)
              setIsProfileMenuOpen(false)
              setIsNetworkMenuOpen(false)
              setIsThemeMenuOpen(false)
            }}
            aria-label="Localisation"
          >
            <MapPin className="size-[0.95rem]" aria-hidden />
          </button>
          {isLocationMenuOpen ? (
            <div className="absolute right-0 top-[calc(100%+0.4rem)] z-50 min-w-[154px] rounded-md border border-line-soft bg-bg-window p-2 shadow-lg backdrop-blur-md">
              <p className="m-0 text-xs font-semibold text-text-main">Localisation</p>
              <p className="mt-1 text-sm font-medium text-text-main">Reims</p>
              <p className="mt-0.5 text-xs text-text-soft">France</p>
            </div>
          ) : null}
        </div>
        <div className="relative inline-flex h-full items-center">
          <button
            type="button"
            className="inline-flex h-[1rem] w-[1rem] items-center justify-center rounded text-text-main hover:opacity-80"
            onClick={() => {
              setIsNetworkMenuOpen((value) => !value)
              setIsProfileMenuOpen(false)
              setIsLocationMenuOpen(false)
              setIsThemeMenuOpen(false)
            }}
            aria-label="État du réseau"
          >
            <Wifi className="size-[0.95rem]" aria-hidden />
          </button>
          {isNetworkMenuOpen ? (
            <div className="absolute right-0 top-[calc(100%+0.4rem)] z-50 min-w-[154px] rounded-md border border-line-soft bg-bg-window p-2 shadow-lg backdrop-blur-md">
              <p className="m-0 text-xs font-semibold text-text-main">Réseau</p>
              <p className="mt-1 text-xs text-text-soft">Accès Internet</p>
            </div>
          ) : null}
        </div>
        <div className="relative inline-flex h-full items-center">
          <button
            type="button"
            className="inline-flex h-[1rem] w-[1rem] items-center justify-center rounded text-text-main hover:opacity-80"
            onClick={() => {
              setIsThemeMenuOpen((value) => !value)
              setIsProfileMenuOpen(false)
              setIsLocationMenuOpen(false)
              setIsNetworkMenuOpen(false)
            }}
            aria-label="Choisir le thème"
          >
            <Contrast className="size-[0.95rem]" aria-hidden />
          </button>
          {isThemeMenuOpen ? (
            <div className="absolute right-0 top-[calc(100%+0.4rem)] z-50 min-w-[152px] rounded-md border border-line-soft bg-bg-window p-1.5 shadow-lg backdrop-blur-md">
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
      </div>
    </header>
  )
}
