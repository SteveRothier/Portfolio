import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { useCallback, useEffect } from 'react'
import browserIcon from '../assets/icons/browser.ico'
import contactIcon from '../assets/icons/contact.ico'
import folderIcon from '../assets/icons/folder.ico'
import githubIcon from '../assets/icons/github.ico'
import terminalIcon from '../assets/icons/terminal.ico'
import trashIcon from '../assets/icons/trash.ico'
import {
  DESKTOP_TOAST_EVENT,
  SIDEBAR_APP_ITEMS,
  SIDEBAR_COLLAPSED_STORAGE_KEY,
  SIDEBAR_NAV_ITEMS,
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
  type SidebarAction,
  type SidebarNavItem,
} from '../constants/sidebar'
import type { DesktopWindowState, WindowId } from '../windows/types'

const ASSET_ICONS: Record<'browser' | 'github' | 'folder' | 'contact' | 'terminal' | 'trash', string> = {
  browser: browserIcon,
  contact: contactIcon,
  folder: folderIcon,
  github: githubIcon,
  terminal: terminalIcon,
  trash: trashIcon,
}

type DesktopSidebarProps = {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  onOpenWindow: (id: WindowId) => void
  onRequestMinimizeWindow: (id: WindowId) => void
  windows: Record<WindowId, DesktopWindowState>
}

export function DesktopSidebar({
  collapsed,
  onCollapsedChange,
  onOpenWindow,
  onRequestMinimizeWindow,
  windows,
}: DesktopSidebarProps) {
  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, collapsed ? '1' : '0')
  }, [collapsed])

  const activeWindowId =
    (Object.values(windows)
      .filter((w) => w.isOpen && !w.isMinimized)
      .sort((a, b) => b.zIndex - a.zIndex)[0]?.id as WindowId | undefined) ?? undefined

  const handleWindowClick = useCallback(
    (id: WindowId) => {
      if (activeWindowId === id) {
        onRequestMinimizeWindow(id)
        return
      }
      onOpenWindow(id)
    },
    [activeWindowId, onOpenWindow, onRequestMinimizeWindow],
  )

  const runAction = (action: SidebarAction) => {
    if (action.type === 'window') {
      handleWindowClick(action.id)
      return
    }
    if (action.type === 'external') {
      const href = action.href === '__ORIGIN__' ? window.location.origin : action.href
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }
    if (action.type === 'toast') {
      window.dispatchEvent(new CustomEvent(DESKTOP_TOAST_EVENT, { detail: action.message }))
    }
  }

  const isWindowRowActive = (item: SidebarNavItem) =>
    item.action.type === 'window' && activeWindowId === item.action.id

  const isWindowRowOpen = (item: SidebarNavItem) => {
    if (item.action.type !== 'window') return false
    const st = windows[item.action.id]
    return Boolean(st?.isOpen || st?.isMinimized)
  }

  const renderGlyph = (item: SidebarNavItem) => {
    const cls = 'size-5 object-contain opacity-95'
    switch (item.icon) {
      case 'folder':
        return <img src={ASSET_ICONS.folder} alt="" className={cls} draggable={false} />
      case 'mail':
        return <img src={ASSET_ICONS.contact} alt="" className={cls} draggable={false} />
      case 'user':
        return <img src={ASSET_ICONS.contact} alt="" className={cls} draggable={false} />
      case 'lucide-terminal':
        return <img src={ASSET_ICONS.terminal} alt="" className={cls} draggable={false} />
      case 'file':
        return <img src={ASSET_ICONS.contact} alt="" className={cls} draggable={false} />
      case 'trash':
        return <img src={ASSET_ICONS.trash} alt="" className={cls} draggable={false} />
      case 'browser':
        return <img src={ASSET_ICONS.browser} alt="" className={cls} draggable={false} />
      case 'github':
        return <img src={ASSET_ICONS.github} alt="" className={cls} draggable={false} />
      default:
        return null
    }
  }

  const renderRow = (item: SidebarNavItem) => {
    const active = isWindowRowActive(item)
    const open = isWindowRowOpen(item)

    return (
      <button
        key={item.key}
        type="button"
        onClick={() => runAction(item.action)}
        className={[
          'desktop-sidebar__row group relative flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-2 text-left text-sm text-text-main transition-[background-color,border-color,box-shadow,opacity] duration-200',
          'hover:bg-[var(--sidebar-row-hover)]',
          active
            ? 'border-[var(--sidebar-row-active-border)] bg-[var(--sidebar-row-active-bg)] shadow-[0_0_0_1px_rgba(94,234,212,0.15)]'
            : '',
          collapsed ? 'justify-center px-1.5' : '',
        ].join(' ')}
        aria-label={item.label}
        title={collapsed ? item.label : undefined}
        aria-current={active && item.action.type === 'window' ? 'page' : undefined}
      >
        {collapsed && active ? (
          <span
            className="pointer-events-none absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-[var(--sidebar-accent)] shadow-[0_0_10px_rgba(94,234,212,0.55)]"
            aria-hidden
          />
        ) : null}
        <span className="inline-flex w-8 shrink-0 items-center justify-center">{renderGlyph(item)}</span>
        {!collapsed ? (
          <span className="min-w-0 flex-1 truncate font-medium transition-opacity duration-200">{item.label}</span>
        ) : null}
        {!collapsed && item.action.type === 'window' && open && !active ? (
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full opacity-70"
            style={{ backgroundColor: 'var(--sidebar-accent)' }}
            aria-hidden
          />
        ) : null}
      </button>
    )
  }

  const widthPx = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED

  const panelStyle: CSSProperties = {
    width: `${widthPx}px`,
    background: 'var(--panel-glass-gradient)',
    borderRight: '1px solid var(--panel-glass-border)',
    backdropFilter: 'blur(6px) saturate(120%)',
    WebkitBackdropFilter: 'blur(6px) saturate(120%)',
    boxShadow: 'var(--panel-glass-shadow, 4px 0 18px rgba(3, 18, 22, 0.22))',
  }

  return (
    <aside
      className="desktop-sidebar fixed bottom-0 left-0 top-9 z-40 flex flex-col transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={panelStyle}
      aria-label="Panneau latéral"
    >
      <nav
        role="navigation"
        aria-label="Navigation SteveOS"
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-1.5 pb-2 pt-2.5"
      >
        {!collapsed ? (
          <p className="mb-0.5 px-2 text-[0.65rem] font-semibold uppercase tracking-wider text-text-soft/90">
            Navigation
          </p>
        ) : null}
        {SIDEBAR_NAV_ITEMS.map((item) => renderRow(item))}

        {!collapsed ? (
          <p className="mb-0.5 mt-3 px-2 text-[0.65rem] font-semibold uppercase tracking-wider text-text-soft/90">
            Applications
          </p>
        ) : (
          <div className="my-1 h-px shrink-0 bg-[var(--panel-glass-border)]" aria-hidden />
        )}
        {SIDEBAR_APP_ITEMS.map((item) => renderRow(item))}
      </nav>

      <div className="shrink-0 border-t border-[var(--panel-glass-border)] p-1.5">
        <button
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-text-soft transition-colors hover:bg-[var(--sidebar-row-hover)] hover:text-text-main"
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Déplier le panneau' : 'Réduire le panneau'}
        >
          <span className="inline-flex w-8 shrink-0 items-center justify-center text-[var(--sidebar-accent)]">
            {collapsed ? <ChevronRight className="size-4" aria-hidden /> : <ChevronLeft className="size-4" aria-hidden />}
          </span>
          {!collapsed ? <span className="truncate transition-opacity duration-200">Réduire</span> : null}
        </button>
      </div>
    </aside>
  )
}
