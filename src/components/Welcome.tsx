import backgroundJpg from '../assets/background.jpg'
import backgroundWebp from '../assets/background.webp'

const W = 1200
const H = 750

export function Welcome() {
  return (
    <div className="desktop-bg pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <picture>
        <source srcSet={backgroundWebp} type="image/webp" />
        <img
          src={backgroundJpg}
          alt=""
          width={W}
          height={H}
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </picture>
    </div>
  )
}
