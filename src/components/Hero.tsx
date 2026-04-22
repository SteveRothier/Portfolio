import portrait from '../assets/portfolio.png'
import { ArrowRight, ChevronDown, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.12 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  return (
    <section className="cyber-hero" id="hero">
      <motion.div
        className="cyber-hero__shell"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <header className="cyber-hero__bar">
          <span className="cyber-hero__bar-left">
            <Terminal size={14} strokeWidth={2} aria-hidden />
            <span>STEVE.DEV</span>
          </span>
          <span className="cyber-hero__bar-mid">SYS // FRONTEND</span>
          <span className="cyber-hero__bar-right">LINK: OK</span>
        </header>

        <div className="cyber-hero__grid">
          <motion.div className="cyber-hero__visual" variants={item}>
            <div className="cyber-hero__visual-ring" aria-hidden="true" />
            <div className="cyber-hero__visual-frame">
              <img
                className="cyber-hero__silhouette"
                src={portrait}
                alt="Silhouette"
              />
            </div>
            <p className="cyber-hero__visual-label" aria-hidden="true">
              ASSET_01
            </p>
          </motion.div>

          <motion.aside className="cyber-hero__panel" variants={item}>
            <p className="cyber-hero__eyebrow">Frontend Developer</p>
            <h1 className="cyber-hero__title">
              Code <span className="cyber-hero__title-accent">&</span> interface
            </h1>
            <p className="cyber-hero__lead">
              Dev orienté produit : React, motion, performance. Portfolio clair
              pour les recruteurs, sans fioritures inutiles.
            </p>

            <ul className="cyber-hero__stack" aria-label="Stack">
              <li>React</li>
              <li>TypeScript</li>
              <li>Vite</li>
            </ul>

            <div className="cyber-hero__actions">
              <a className="cyber-hero__btn cyber-hero__btn--primary" href="#projects">
                Voir les projets
                <ArrowRight size={16} aria-hidden />
              </a>
              <a className="cyber-hero__btn cyber-hero__btn--ghost" href="#contact">
                Contact
              </a>
            </div>

            <p className="cyber-hero__mono" aria-hidden="true">
              {'>'} npm run portfolio — ready
            </p>
          </motion.aside>
        </div>

        <a className="cyber-hero__scroll" href="#skills" aria-label="Defiler vers Skills">
          <span>SCROLL</span>
          <ChevronDown size={18} aria-hidden />
        </a>
      </motion.div>
    </section>
  )
}
