export function About() {
  return (
    <section className="about-window flex h-full flex-col gap-4 p-4 text-[#f0f0f2] md:p-5">
      <h2 className="m-0 text-lg font-semibold tracking-tight">À propos</h2>
      <p className="m-0 text-sm leading-relaxed text-[#c8d0e0]">
        Bienvenue sur ce bureau SteveOS : une interface type OS pour présenter projets, contact et stack dans
        des fenêtres redimensionnables.
      </p>
      <p className="m-0 text-sm leading-relaxed text-[#c8d0e0]">
        Stack principale : React, TypeScript, Vite, Tailwind, Zustand. Animations avec GSAP.
      </p>
    </section>
  )
}
