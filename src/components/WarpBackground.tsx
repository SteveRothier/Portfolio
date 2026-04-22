import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import { useMemo, type ReactNode } from 'react'

type WarpBackgroundProps = {
  children: ReactNode
  beamsPerSide?: number
  beamSize?: number
  beamDuration?: number
  beamDelayMin?: number
  beamDelayMax?: number
}

type BeamConfig = {
  left: string
  delay: number
  duration: number
  height: string
  hue: number
}

function createBeams(
  beamsPerSide: number,
  beamSize: number,
  beamDuration: number,
  beamDelayMin: number,
  beamDelayMax: number,
): BeamConfig[] {
  const cellsPerSide = Math.max(1, Math.floor(100 / beamSize))
  const step = cellsPerSide / Math.max(1, beamsPerSide)

  return Array.from({ length: beamsPerSide }, (_, i) => {
    const xCell = Math.floor(i * step)
    const randomDelay = Math.random() * (beamDelayMax - beamDelayMin) + beamDelayMin
    const randomDuration = beamDuration + Math.random() * 0.9
    const aspectRatio = Math.floor(Math.random() * 9) + 2
    const hue = Math.floor(Math.random() * 24) + 8

    return {
      left: `${xCell * beamSize}%`,
      delay: randomDelay,
      duration: randomDuration,
      height: `${aspectRatio * 11}%`,
      hue,
    }
  })
}

function WarpBeam({ left, delay, duration, height, hue }: BeamConfig) {
  return (
    <motion.span
      className="warp-beam"
      style={{
        left,
        height,
        background: `linear-gradient(hsl(${hue} 90% 58%), transparent)`,
      }}
      initial={{ y: '110%' }}
      animate={{ y: '-130%' }}
      transition={{
        duration,
        delay,
        ease: 'linear',
        repeat: Number.POSITIVE_INFINITY,
      }}
    />
  )
}

export default function WarpBackground({
  children,
  beamsPerSide = 4,
  beamSize = 8,
  beamDuration = 2.8,
  beamDelayMin = 0,
  beamDelayMax = 2.4,
}: WarpBackgroundProps) {
  const { scrollYProgress } = useScroll()
  const depth = useTransform(scrollYProgress, [0, 1], [0, 540])
  const perspective = useTransform(scrollYProgress, [0, 1], [940, 260])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.24])
  const tunnelTransform = useMotionTemplate`perspective(${perspective}px) translateZ(${depth}px) scale(${scale})`

  const topBeams = useMemo(
    () => createBeams(beamsPerSide, beamSize, beamDuration, beamDelayMin, beamDelayMax),
    [beamsPerSide, beamSize, beamDuration, beamDelayMin, beamDelayMax],
  )
  const rightBeams = useMemo(
    () => createBeams(beamsPerSide, beamSize, beamDuration, beamDelayMin, beamDelayMax),
    [beamsPerSide, beamSize, beamDuration, beamDelayMin, beamDelayMax],
  )
  const bottomBeams = useMemo(
    () => createBeams(beamsPerSide, beamSize, beamDuration, beamDelayMin, beamDelayMax),
    [beamsPerSide, beamSize, beamDuration, beamDelayMin, beamDelayMax],
  )
  const leftBeams = useMemo(
    () => createBeams(beamsPerSide, beamSize, beamDuration, beamDelayMin, beamDelayMax),
    [beamsPerSide, beamSize, beamDuration, beamDelayMin, beamDelayMax],
  )

  return (
    <div className="warp-root">
      <div className="warp-fixed">
        <motion.div className="warp-tunnel" style={{ transform: tunnelTransform }}>
          <div className="warp-wall warp-wall--top">
            {topBeams.map((beam, i) => (
              <WarpBeam key={`top-${i}`} {...beam} />
            ))}
          </div>

          <div className="warp-wall warp-wall--bottom">
            {bottomBeams.map((beam, i) => (
              <WarpBeam key={`bottom-${i}`} {...beam} />
            ))}
          </div>

          <div className="warp-wall warp-wall--left">
            {leftBeams.map((beam, i) => (
              <WarpBeam key={`left-${i}`} {...beam} />
            ))}
          </div>

          <div className="warp-wall warp-wall--right">
            {rightBeams.map((beam, i) => (
              <WarpBeam key={`right-${i}`} {...beam} />
            ))}
          </div>
        </motion.div>
        <div className="warp-overlay" />
      </div>

      <div className="warp-content">{children}</div>
    </div>
  )
}
