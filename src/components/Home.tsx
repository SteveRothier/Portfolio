import gsap from 'gsap'
import { desktopIcons } from '../constants/desktop'
import type { WindowId } from '../windows/types'

type HomeProps = {
  onOpenWindow: (id: WindowId) => void
}

export function Home({ onOpenWindow }: HomeProps) {
  return (
    <div className="desktop-icons fixed right-4 top-20 z-[15] grid gap-3 max-md:left-3 max-md:right-auto max-md:top-auto max-md:bottom-24 max-md:flex max-md:flex-row max-md:flex-wrap">
      {desktopIcons.map((icon) => (
        <button
          type="button"
          className="desktop-icon grid w-[120px] cursor-pointer gap-1.5 rounded-[var(--radius-md)] border border-line-soft bg-[rgba(5,11,22,0.42)] p-3 text-left text-text-main md:w-[132px] md:p-[0.75rem_0.65rem]"
          key={icon.id}
          onClick={() => onOpenWindow(icon.id)}
          onMouseEnter={(event) => {
            gsap.to(event.currentTarget, { y: -3, duration: 0.16, ease: 'power2.out' })
          }}
          onMouseLeave={(event) => {
            gsap.to(event.currentTarget, { y: 0, duration: 0.16, ease: 'power2.out' })
          }}
        >
          <span className="desktop-icon__glyph text-xl opacity-90" aria-hidden>
            {icon.id === 'projects' ? '▦' : '✉'}
          </span>
          <span className="desktop-icon__label text-sm font-semibold">{icon.label}</span>
          <span className="desktop-icon__badge justify-self-start rounded-full border border-line-soft px-1.5 py-0.5 text-[0.72rem] text-text-soft">
            {icon.badge}
          </span>
        </button>
      ))}
    </div>
  )
}
