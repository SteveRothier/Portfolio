import { GitBranch, Mail, UserRound } from 'lucide-react'

const links = [
  {
    label: 'GitHub',
    href: 'https://github.com/SteveRothier',
    Icon: GitBranch,
    style: 'bg-[#ec626a] border-[#f1848a]',
  },
  {
    label: 'Gmail',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=steve.rothier77@gmail.com',
    Icon: Mail,
    style: 'bg-[#50c267] border-[#7ad08c]',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/steverothier/',
    Icon: UserRound,
    style: 'bg-[#22a7d8] border-[#63c4e8]',
  },
] as const

export function Contact() {
  return (
    <section className="contact-window flex h-full flex-col gap-5 p-4 text-[#f0f0f2] md:p-5">
      <div className="grid gap-2">
        <h2 className="m-0 text-lg font-semibold tracking-tight">Entrons en contact</h2>
      </div>

      <ul className="m-0 mt-auto grid list-none grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 p-0">
        {links.map(({ label, href, Icon, style }) => (
          <li key={label}>
            <a
              className={`group grid gap-6 rounded-xl border px-4 py-3 text-[#f7f7f9] no-underline transition-transform duration-150 hover:-translate-y-0.5 ${style}`}
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              <Icon className="size-5 opacity-95" aria-hidden />
              <span className="text-xl font-semibold leading-none">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
