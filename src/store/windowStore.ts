import { useEffect, useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DesktopWindowState, WindowConfig, WindowId } from '../windows/types'

const MIN_WIDTH = 320
const MIN_HEIGHT = 220
const MIN_VISIBLE_WIDTH = 120
const MIN_TOP = 0
const MIN_BOTTOM_VISIBLE = 120
const MOBILE_LAYOUT_MAX_WIDTH = 920
const CV_DEFAULT_WIDTH = 520
const CV_DEFAULT_HEIGHT = 700

const INITIAL_WINDOWS: WindowConfig[] = [
  { id: 'projects', title: 'Projets', width: 680, height: 420, x: 120, y: 110 },
  { id: 'contact', title: 'Contact', width: 420, height: 360, x: 220, y: 170 },
  { id: 'terminal', title: 'Terminal', width: 760, height: 430, x: 170, y: 130 },
  { id: 'about', title: 'À propos', width: 440, height: 320, x: 200, y: 140 },
  { id: 'cv', title: 'CV', width: CV_DEFAULT_WIDTH, height: CV_DEFAULT_HEIGHT, x: 220, y: 56 },
]

const WINDOW_TITLES: Record<WindowId, string> = {
  projects: 'Projets',
  contact: 'Contact',
  terminal: 'Terminal',
  about: 'À propos',
  cv: 'CV',
}

const DEFAULT_WINDOW_SIZE: Record<WindowId, { width: number; height: number }> = {
  projects: { width: 680, height: 420 },
  contact: { width: 420, height: 360 },
  terminal: { width: 760, height: 430 },
  about: { width: 440, height: 320 },
  cv: { width: CV_DEFAULT_WIDTH, height: CV_DEFAULT_HEIGHT },
}

type RestoreBounds = NonNullable<DesktopWindowState['restoreBounds']>

type WindowStoreState = {
  windows: Record<WindowId, DesktopWindowState>
  nextZ: number
  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  minimizeWindow: (id: WindowId) => void
  toggleMaximizeWindow: (id: WindowId) => void
  bringToFront: (id: WindowId) => void
  moveWindow: (id: WindowId, x: number, y: number) => void
  resizeWindow: (id: WindowId, x: number, y: number, width: number, height: number) => void
  restoreWindowFromSnap: (id: WindowId, x: number, y: number, width: number, height: number) => void
  normalizeTitles: () => void
  clampToViewport: () => void
  resetStore: () => void
}

type PersistedWindowStore = Pick<WindowStoreState, 'windows' | 'nextZ'>

function toWindowState(config: WindowConfig, zIndex: number): DesktopWindowState {
  return {
    ...config,
    zIndex,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  }
}

function getInitialState(): PersistedWindowStore {
  return {
    nextZ: 120,
    windows: {
      projects: toWindowState(INITIAL_WINDOWS[0], 101),
      contact: toWindowState(INITIAL_WINDOWS[1], 102),
      terminal: toWindowState(INITIAL_WINDOWS[2], 103),
      about: toWindowState(INITIAL_WINDOWS[3], 104),
      cv: toWindowState(INITIAL_WINDOWS[4], 105),
    },
  }
}

function toFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function sanitizeRestoreBounds(value: unknown): RestoreBounds | undefined {
  if (!value || typeof value !== 'object') return undefined
  const candidate = value as Partial<RestoreBounds>
  const width = toFiniteNumber(candidate.width, MIN_WIDTH)
  const height = toFiniteNumber(candidate.height, MIN_HEIGHT)
  return {
    x: toFiniteNumber(candidate.x, 0),
    y: toFiniteNumber(candidate.y, 0),
    width: Math.max(width, MIN_WIDTH),
    height: Math.max(height, MIN_HEIGHT),
  }
}

function sanitizeWindowState(windowId: WindowId, candidate: unknown, fallbackZ: number): DesktopWindowState {
  const source = candidate && typeof candidate === 'object' ? (candidate as Partial<DesktopWindowState>) : {}
  const defaults = DEFAULT_WINDOW_SIZE[windowId]
  return {
    id: windowId,
    title: WINDOW_TITLES[windowId],
    isOpen: Boolean(source.isOpen),
    isMinimized: Boolean(source.isMinimized),
    isMaximized: Boolean(source.isMaximized),
    x: toFiniteNumber(source.x, 0),
    y: toFiniteNumber(source.y, 0),
    width: Math.max(toFiniteNumber(source.width, defaults.width), MIN_WIDTH),
    height: Math.max(toFiniteNumber(source.height, defaults.height), MIN_HEIGHT),
    zIndex: Math.max(toFiniteNumber(source.zIndex, fallbackZ), 1),
    restoreBounds: sanitizeRestoreBounds(source.restoreBounds),
  }
}

function sanitizePersistedState(input: unknown): PersistedWindowStore {
  const initial = getInitialState()
  if (!input || typeof input !== 'object') return initial
  const source = input as Partial<PersistedWindowStore>

  return {
    nextZ: Math.max(toFiniteNumber(source.nextZ, initial.nextZ), 120),
    windows: {
      projects: sanitizeWindowState('projects', source.windows?.projects, initial.windows.projects.zIndex),
      contact: sanitizeWindowState('contact', source.windows?.contact, initial.windows.contact.zIndex),
      terminal: sanitizeWindowState('terminal', source.windows?.terminal, initial.windows.terminal.zIndex),
      about: sanitizeWindowState('about', source.windows?.about, initial.windows.about.zIndex),
      cv: sanitizeWindowState('cv', source.windows?.cv, initial.windows.cv.zIndex),
    },
  }
}

function getViewport() {
  if (typeof window === 'undefined') {
    return { width: 1920, height: 1080 }
  }
  return { width: window.innerWidth, height: window.innerHeight }
}

function isTotallyOffscreen(x: number, y: number, width: number, height: number, vw: number, vh: number) {
  return x + width <= 0 || x >= vw || y + height <= 0 || y >= vh
}

function clampWindowForViewport(windowState: DesktopWindowState): DesktopWindowState {
  const viewport = getViewport()
  const useMobileLayout = viewport.width <= MOBILE_LAYOUT_MAX_WIDTH && !windowState.isMaximized

  const layoutWidth = useMobileLayout
    ? Math.max(Math.min(Math.floor(viewport.width * 0.96), 680), MIN_WIDTH)
    : Math.min(Math.max(windowState.width, MIN_WIDTH), Math.max(viewport.width, MIN_WIDTH))
  const layoutHeight = useMobileLayout
    ? Math.max(Math.min(Math.floor(viewport.height * 0.7), 520), MIN_HEIGHT)
    : Math.min(Math.max(windowState.height, MIN_HEIGHT), Math.max(viewport.height, MIN_HEIGHT))

  const clampedWidth = Math.min(layoutWidth, Math.max(viewport.width, MIN_WIDTH))
  const clampedHeight = Math.min(layoutHeight, Math.max(viewport.height, MIN_HEIGHT))

  const minX = -(clampedWidth - MIN_VISIBLE_WIDTH)
  const maxX = Math.max(viewport.width - MIN_VISIBLE_WIDTH, 0)
  const minY = MIN_TOP
  const maxY = Math.max(viewport.height - MIN_BOTTOM_VISIBLE, 0)

  let x = Math.min(Math.max(windowState.x, minX), maxX)
  let y = Math.min(Math.max(windowState.y, minY), maxY)

  if (useMobileLayout) {
    x = Math.max((viewport.width - clampedWidth) / 2, minX)
    y = Math.max((viewport.height - clampedHeight) / 2, minY)
  } else if (isTotallyOffscreen(x, y, clampedWidth, clampedHeight, viewport.width, viewport.height)) {
    x = Math.max((viewport.width - clampedWidth) / 2, minX)
    y = Math.max((viewport.height - clampedHeight) / 2, minY)
  }

  return {
    ...windowState,
    x,
    y,
    width: clampedWidth,
    height: clampedHeight,
    restoreBounds: windowState.restoreBounds
      ? clampRestoreBoundsForViewport(windowState.restoreBounds, viewport.width, viewport.height)
      : undefined,
  }
}

function clampRestoreBoundsForViewport(bounds: RestoreBounds, viewportWidth: number, viewportHeight: number) {
  const width = Math.min(Math.max(bounds.width, MIN_WIDTH), Math.max(viewportWidth, MIN_WIDTH))
  const height = Math.min(Math.max(bounds.height, MIN_HEIGHT), Math.max(viewportHeight, MIN_HEIGHT))
  const minX = -(width - MIN_VISIBLE_WIDTH)
  const maxX = Math.max(viewportWidth - MIN_VISIBLE_WIDTH, 0)
  const minY = MIN_TOP
  const maxY = Math.max(viewportHeight - MIN_BOTTOM_VISIBLE, 0)

  return {
    x: Math.min(Math.max(bounds.x, minX), maxX),
    y: Math.min(Math.max(bounds.y, minY), maxY),
    width,
    height,
  }
}

export const useWindowStore = create<WindowStoreState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),
      bringToFront: (id) => {
        const nextZ = get().nextZ + 1
        set((state) => ({
          nextZ,
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], zIndex: nextZ },
          },
        }))
      },
      openWindow: (id) => {
        const viewport = getViewport()
        const centeredCvX = Math.max(Math.floor((viewport.width - CV_DEFAULT_WIDTH) / 2), 24)
        const centeredCvY = Math.max(Math.floor((viewport.height - CV_DEFAULT_HEIGHT) / 2), 24)
        set((state) => ({
          // Réapplique une taille par défaut "fit CV" quand la fenêtre est réouverte depuis fermé.
          // Si elle vient d'un état minimisé, on conserve sa taille précédente.
          windows: {
            ...state.windows,
            [id]:
              id === 'cv' && !state.windows[id].isMinimized
                ? {
                    ...state.windows[id],
                    width: CV_DEFAULT_WIDTH,
                    height: CV_DEFAULT_HEIGHT,
                    x: centeredCvX,
                    y: centeredCvY,
                    isOpen: true,
                    isMinimized: false,
                  }
                : { ...state.windows[id], isOpen: true, isMinimized: false },
          },
        }))
        get().bringToFront(id)
        get().clampToViewport()
      },
      closeWindow: (id) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isOpen: false,
              isMinimized: false,
              isMaximized: false,
            },
          },
        }))
      },
      minimizeWindow: (id) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isOpen: false,
              isMinimized: true,
            },
          },
        }))
      },
      toggleMaximizeWindow: (id) => {
        set((state) => {
          const current = state.windows[id]
          if (current.isMaximized && current.restoreBounds) {
            return {
              windows: {
                ...state.windows,
                [id]: {
                  ...current,
                  ...current.restoreBounds,
                  isMaximized: false,
                  restoreBounds: undefined,
                },
              },
            }
          }

          const viewport = getViewport()
          return {
            windows: {
              ...state.windows,
              [id]: {
                ...current,
                x: 0,
                y: 0,
                width: Math.max(viewport.width, MIN_WIDTH),
                height: Math.max(viewport.height, MIN_HEIGHT),
                isMaximized: true,
                restoreBounds: {
                  x: current.x,
                  y: current.y,
                  width: current.width,
                  height: current.height,
                },
              },
            },
          }
        })
        get().bringToFront(id)
      },
      moveWindow: (id, x, y) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isMaximized: false,
              restoreBounds: undefined,
              x,
              y,
            },
          },
        }))
      },
      resizeWindow: (id, x, y, width, height) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isMaximized: false,
              restoreBounds: undefined,
              x,
              y,
              width,
              height,
            },
          },
        }))
      },
      restoreWindowFromSnap: (id, x, y, width, height) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              x,
              y,
              width,
              height,
              isMaximized: false,
              restoreBounds: undefined,
            },
          },
        }))
        get().bringToFront(id)
      },
      normalizeTitles: () => {
        set((state) => ({
          windows: {
            projects: { ...state.windows.projects, title: WINDOW_TITLES.projects },
            contact: { ...state.windows.contact, title: WINDOW_TITLES.contact },
            terminal: { ...state.windows.terminal, title: WINDOW_TITLES.terminal },
            about: { ...state.windows.about, title: WINDOW_TITLES.about },
            cv: { ...state.windows.cv, title: WINDOW_TITLES.cv },
          },
        }))
      },
      clampToViewport: () => {
        set((state) => ({
          windows: {
            projects: clampWindowForViewport(state.windows.projects),
            contact: clampWindowForViewport(state.windows.contact),
            terminal: clampWindowForViewport(state.windows.terminal),
            about: clampWindowForViewport(state.windows.about),
            cv: clampWindowForViewport(state.windows.cv),
          },
        }))
      },
      resetStore: () => {
        set(getInitialState())
      },
    }),
    {
      name: 'desktop-window-state-v1',
      version: 3,
      partialize: (state) => ({
        windows: state.windows,
        nextZ: state.nextZ,
      }),
      migrate: (persistedState) => sanitizePersistedState(persistedState),
      merge: (persistedState, currentState) => {
        const safe = sanitizePersistedState(persistedState)
        return {
          ...currentState,
          windows: safe.windows,
          nextZ: safe.nextZ,
        }
      },
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) {
          state?.resetStore()
          return
        }
        state.normalizeTitles()
        state.clampToViewport()
      },
    },
  ),
)

export function useWindowManager() {
  const windows = useWindowStore((state) => state.windows)
  const openWindow = useWindowStore((state) => state.openWindow)
  const closeWindow = useWindowStore((state) => state.closeWindow)
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow)
  const toggleMaximizeWindow = useWindowStore((state) => state.toggleMaximizeWindow)
  const bringToFront = useWindowStore((state) => state.bringToFront)
  const moveWindow = useWindowStore((state) => state.moveWindow)
  const resizeWindow = useWindowStore((state) => state.resizeWindow)
  const restoreWindowFromSnap = useWindowStore((state) => state.restoreWindowFromSnap)
  const clampToViewport = useWindowStore((state) => state.clampToViewport)
  const normalizeTitles = useWindowStore((state) => state.normalizeTitles)

  useEffect(() => {
    normalizeTitles()
    clampToViewport()
  }, [clampToViewport, normalizeTitles])

  useEffect(() => {
    const onResize = () => clampToViewport()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [clampToViewport])

  const orderedWindows = useMemo(
    () => Object.values(windows).sort((a, b) => a.zIndex - b.zIndex),
    [windows],
  )

  return {
    windows,
    orderedWindows,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    bringToFront,
    moveWindow,
    resizeWindow,
    restoreWindowFromSnap,
  }
}
