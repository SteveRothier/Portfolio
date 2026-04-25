export type WindowId = 'projects' | 'contact'
export type SnapMode = 'none' | 'top' | 'left' | 'right'

export type DesktopWindowState = {
  id: WindowId
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  snapMode: SnapMode
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  restoreBounds?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export type WindowConfig = Pick<DesktopWindowState, 'id' | 'title' | 'width' | 'height' | 'x' | 'y'>
