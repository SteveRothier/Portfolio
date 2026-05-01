import type { WindowId } from '../windows/types'

/** Émis avec `detail: string` pour afficher un message court (ex. corbeille vide). */
export const DESKTOP_TOAST_EVENT = 'steveos-desktop-toast'

export const SIDEBAR_WIDTH_EXPANDED = 220
export const SIDEBAR_WIDTH_COLLAPSED = 52
export const SIDEBAR_COLLAPSED_STORAGE_KEY = 'desktop-sidebar-collapsed'

export type SidebarAction =
  | { type: 'window'; id: WindowId }
  | { type: 'external'; href: string }
  | { type: 'toast'; message: string }

export type SidebarItemIcon =
  | 'folder'
  | 'mail'
  | 'user'
  | 'lucide-terminal'
  | 'github'
  | 'file'
  | 'trash'
  | 'browser'

export type SidebarNavItem = {
  key: string
  label: string
  icon: SidebarItemIcon
  action: SidebarAction
}

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { key: 'projects', label: 'Projets', icon: 'folder', action: { type: 'window', id: 'projects' } },
  { key: 'contact', label: 'Contact', icon: 'mail', action: { type: 'window', id: 'contact' } },
  { key: 'about', label: 'À propos', icon: 'user', action: { type: 'window', id: 'about' } },
]

export const SIDEBAR_APP_ITEMS: SidebarNavItem[] = [
  { key: 'terminal', label: 'Terminal', icon: 'lucide-terminal', action: { type: 'window', id: 'terminal' } },
  {
    key: 'browser',
    label: 'Navigateur',
    icon: 'browser',
    action: { type: 'external', href: '__ORIGIN__' },
  },
  {
    key: 'github',
    label: 'GitHub',
    icon: 'github',
    action: { type: 'external', href: 'https://github.com/SteveRothier' },
  },
  {
    key: 'cv',
    label: 'CV',
    icon: 'file',
    action: { type: 'external', href: 'https://www.linkedin.com/in/steverothier/' },
  },
  {
    key: 'trash',
    label: 'Corbeille',
    icon: 'trash',
    action: { type: 'toast', message: 'Corbeille vide pour le moment.' },
  },
]

export function getInitialSidebarCollapsed(): boolean {
  if (typeof window === 'undefined') return false
  const stored = window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY)
  if (stored === '1') return true
  if (stored === '0') return false
  return window.matchMedia('(max-width: 768px)').matches
}
