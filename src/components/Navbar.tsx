import { Contrast, MonitorCog, Moon, Sun } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

const THEME_MENU_ITEMS = [
  { mode: 'light' as const, label: 'Light', Icon: Sun },
  { mode: 'dark' as const, label: 'Dark', Icon: Moon },
  { mode: 'system' as const, label: 'System', Icon: MonitorCog },
]

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

export function Navbar() {
  const [now, setNow] = useState(() => new Date())
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getStoredThemeMode())
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme())
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

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
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current) return
      if (menuRef.current.contains(event.target as Node)) return
      setIsThemeMenuOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsThemeMenuOpen(false)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const formattedDateTime = useMemo(() => {
    const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(now)
    const day = new Intl.DateTimeFormat('fr-FR', { day: '2-digit' }).format(now)
    const month = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(now)
    const time = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now)

    const toTitleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
    return {
      date: `${toTitleCase(weekday)} ${day} ${toTitleCase(month)}`,
      time,
    }
  }, [now])

  return (
    <header className="desktop-status fixed left-0 right-0 top-0 z-30 flex items-center justify-between rounded-none bg-[linear-gradient(100deg,rgba(20,24,44,0.86),rgba(32,46,94,0.78))] px-2 py-1.5 text-sm text-text-main backdrop-blur-md md:px-2.5 md:py-1.5">
      <span className="desktop-status__brand truncate pr-2 text-xs font-semibold md:text-sm">SteveOS</span>

      <div className="flex items-center gap-2.5" ref={menuRef}>
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center rounded p-1 text-text-main hover:text-white"
            onClick={() => setIsThemeMenuOpen((value) => !value)}
            aria-label="Choisir le theme"
          >
            <Contrast className="size-4.5" aria-hidden />
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
        <span className="desktop-status__datetime inline-flex items-center gap-1.5 text-xs tabular-nums leading-tight text-text-main md:text-[0.82rem]">
          <span className="inline-flex items-center">{formattedDateTime.date}</span>
          <span className="desktop-status__separator h-[0.82em] w-0.5 shrink-0 bg-current opacity-80" aria-hidden />
          <span className="inline-flex items-center">{formattedDateTime.time}</span>
        </span>
      </div>
    </header>
  )
}
