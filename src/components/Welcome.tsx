import backgroundUrl from '../assets/background2.jpg'

export function Welcome() {
  return (
    <div className="desktop-bg pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <img
        src={backgroundUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
    </div>
  )
}
