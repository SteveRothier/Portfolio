const links = [
  { label: 'Email', href: 'mailto:steve.rothier@outlook.com' },
  { label: 'GitHub', href: 'https://github.com/SteveRothier' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com' },
]

export function Contact() {
  return (
    <section className="contact-window grid gap-3 p-4 md:gap-3.5 md:p-4">
      <h2 className="m-0 text-lg font-semibold">Contact</h2>
      <p className="m-0 text-[0.95rem] text-text-soft">
        Je construis des interfaces immersives et des experiences web interactives. On peut
        discuter mission freelance, CDI ou collaboration creative.
      </p>
      <ul className="m-0 grid list-none gap-2 p-0">
        {links.map((item) => (
          <li key={item.label}>
            <a
              className="inline-flex w-fit rounded-md border border-line-soft px-2.5 py-2 text-text-main no-underline"
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
