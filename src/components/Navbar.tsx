import { useEffect, useMemo, useState } from 'react'

export function Navbar() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const formattedDateTime = useMemo(() => {
    const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(now)
    const day = new Intl.DateTimeFormat('fr-FR', { day: '2-digit' }).format(now)
    const month = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(now)
    const time = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now)

    const toTitleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
    return {
      date: `${toTitleCase(weekday)} ${day} ${toTitleCase(month)}`,
      time,
    }
  }, [now])

  return (
    <header className="desktop-status fixed left-3 right-3 top-1 z-30 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-full px-3 py-2 text-sm text-text-soft md:left-3.5 md:right-3.5 md:top-0.5 md:py-2 md:pl-3.5 md:pr-2.5">
      <span className="desktop-status__brand justify-self-start truncate pr-2 text-xs md:text-sm">
        SteveOS Portfolio
      </span>
      <span className="desktop-status__datetime inline-flex items-center gap-1.5 justify-self-center text-xs tabular-nums leading-tight md:text-[0.82rem]">
        <span className="inline-flex items-center">{formattedDateTime.date}</span>
        <span
          className="desktop-status__separator h-[0.82em] w-0.5 shrink-0 bg-current opacity-80"
          aria-hidden
        />
        <span className="inline-flex items-center">{formattedDateTime.time}</span>
      </span>
      <span aria-hidden className="justify-self-end" />
    </header>
  )
}
