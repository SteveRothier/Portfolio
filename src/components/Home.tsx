import folderIcon from '../assets/icons/Folder Closed.png'
import msnIcon from '../assets/icons/MSN.png'
import pdfIcon from '../assets/icons/pdf.png'
import recycleIcon from '../assets/icons/Recycle Bin (empty).png'
import type { WindowId } from '../windows/types'

const DESKTOP_TOAST_EVENT = 'steveos-desktop-toast'

type HomeProps = {
  onOpenWindow: (id: WindowId) => void
}

export function Home({ onOpenWindow }: HomeProps) {
  const handleRecycleClick = () => {
    window.dispatchEvent(new CustomEvent(DESKTOP_TOAST_EVENT, { detail: 'Corbeille vide pour le moment.' }))
  }

  return (
    <>
      <div className="desktop-xp-shortcuts-column fixed left-3 top-4 z-[16] max-md:left-2 max-md:top-3">
        <button
          type="button"
          className="desktop-xp-shortcut"
          onClick={handleRecycleClick}
          aria-label="Corbeille"
        >
          <span className="desktop-xp-shortcut__glyph" aria-hidden>
            <img src={recycleIcon} alt="" draggable={false} />
          </span>
          <span className="desktop-xp-shortcut__label">Corbeille</span>
        </button>
        <button
          type="button"
          className="desktop-xp-shortcut"
          onClick={() => onOpenWindow('cv')}
          aria-label="CV"
        >
          <span className="desktop-xp-shortcut__glyph" aria-hidden>
            <img src={pdfIcon} alt="" draggable={false} />
          </span>
          <span className="desktop-xp-shortcut__label">CV</span>
        </button>
        <button
          type="button"
          className="desktop-xp-shortcut"
          onClick={() => onOpenWindow('projects')}
          aria-label="Projets"
        >
          <span className="desktop-xp-shortcut__glyph" aria-hidden>
            <img src={folderIcon} alt="" draggable={false} />
          </span>
          <span className="desktop-xp-shortcut__label">Projets</span>
        </button>
        <button
          type="button"
          className="desktop-xp-shortcut"
          onClick={() => onOpenWindow('contact')}
          aria-label="Contact"
        >
          <span className="desktop-xp-shortcut__glyph" aria-hidden>
            <img src={msnIcon} alt="" draggable={false} />
          </span>
          <span className="desktop-xp-shortcut__label">Contact</span>
        </button>
      </div>
    </>
  )
}
