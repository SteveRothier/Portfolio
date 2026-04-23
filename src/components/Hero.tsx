import portrait from '../assets/portfolio.png'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <motion.div
        className="hero__inner hero__inner--solo"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="hero__silhouette-wrap">
          <img className="hero__silhouette" src={portrait} alt="Silhouette de Steve" />
        </div>
      </motion.div>
    </section>
  )
}
