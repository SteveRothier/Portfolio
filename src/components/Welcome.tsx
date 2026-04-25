import backgroundUrl from '../assets/background.jpg'

export function Welcome() {
  return (
    <div className="desktop-bg pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <img
        src={backgroundUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(8,16,34,0.5),rgba(6,10,24,0.62)),radial-gradient(circle_at_70%_15%,rgba(90,54,205,0.3),transparent_42%),radial-gradient(circle_at_10%_80%,rgba(19,116,255,0.22),transparent_36%)]" />
    </div>
  )
}
