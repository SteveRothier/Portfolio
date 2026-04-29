import type { WindowId } from '../windows/types'

export const desktopIcons: { id: WindowId; label: string; badge: string }[] = [
  { id: 'projects', label: 'Projets', badge: '01' },
  { id: 'contact', label: 'Contact', badge: '02' },
]

/** Clé = fichier dans `src/assets/icons/` (images du dock). */
export type DockIconAsset = 'files' | 'browser' | 'terminal' | 'projects' | 'contact' | 'trash'

export type DockApp = {
  id: DockIconAsset
  label: string
  iconAsset: DockIconAsset
  windowId?: WindowId
}

export const dockApps: DockApp[] = [
  { id: 'browser', label: 'Navigateur', iconAsset: 'browser' },
  { id: 'files', label: 'Fichiers', iconAsset: 'files' },
  { id: 'terminal', label: 'Terminal', iconAsset: 'terminal' },
  { id: 'projects', label: 'Projets', iconAsset: 'projects', windowId: 'projects' },
  { id: 'contact', label: 'Contact', iconAsset: 'contact', windowId: 'contact' },
  { id: 'trash', label: 'Corbeille', iconAsset: 'trash' },
]
