const links = [
  { label: 'Email', href: 'mailto:steve.rothier@outlook.com' },
  { label: 'GitHub', href: 'https://github.com/SteveRothier' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com' },
]

export function ContactWindow() {
  return (
    <section className="contact-window">
      <h2>Contact</h2>
      <p>
        Je construis des interfaces immersives et des experiences web interactives. On peut
        discuter mission freelance, CDI ou collaboration creative.
      </p>
      <ul>
        {links.map((item) => (
          <li key={item.label}>
            <a href={item.href} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
