export type WindowId = 'projects' | 'contact'

export type DesktopWindowState = {
  id: WindowId
  title: string
  isOpen: boolean
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

export type WindowConfig = Pick<DesktopWindowState, 'id' | 'title' | 'width' | 'height' | 'x' | 'y'>
