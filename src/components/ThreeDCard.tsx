import { CSSProperties, ReactNode, useCallback, useRef, useState } from 'react'

type ThreeDCardProps = {
  children: ReactNode
  className?: string
  maxRotation?: number
  shadowBlur?: number
  parallaxOffset?: number
  transitionDuration?: string
  backgroundImage?: string | null
  enableShadow?: boolean
  enableParallax?: boolean
}

type CardTransform = {
  rotateX: number
  rotateY: number
  glowX: number
  glowY: number
  shadowX: number
  shadowY: number
  isHovered: boolean
}

const initialTransform: CardTransform = {
  rotateX: 0,
  rotateY: 0,
  glowX: 50,
  glowY: 50,
  shadowX: 0,
  shadowY: 20,
  isHovered: false,
}

export default function ThreeDCard({
  children,
  className = '',
  maxRotation = 10,
  shadowBlur = 30,
  parallaxOffset = 40,
  transitionDuration = '0.6s',
  backgroundImage = null,
  enableShadow = true,
  enableParallax = true,
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState<CardTransform>(initialTransform)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const { width, height, left, top } = rect
      const mouseX = e.clientX - left
      const mouseY = e.clientY - top
      const xPct = mouseX / width - 0.5
      const yPct = mouseY / height - 0.5
      const newRotateX = yPct * -1 * maxRotation
      const newRotateY = xPct * maxRotation

      setTransform((prev) => ({
        ...prev,
        rotateX: newRotateX,
        rotateY: newRotateY,
        glowX: (mouseX / width) * 100,
        glowY: (mouseY / height) * 100,
        shadowX: enableShadow ? newRotateY * 0.8 : 0,
        shadowY: enableShadow ? 20 - newRotateX * 0.6 : 20,
      }))
    },
    [enableShadow, maxRotation]
  )

  const handleMouseEnter = useCallback(() => {
    setTransform((prev) => ({ ...prev, isHovered: true }))
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTransform(initialTransform)
  }, [])

  const cardStyle: CSSProperties = {
    transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(1, 1, 1)`,
    boxShadow: enableShadow
      ? `${transform.shadowX}px ${transform.shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.4)`
      : 'none',
    transition: `transform ${transitionDuration} cubic-bezier(0.23, 1, 0.32, 1), box-shadow ${transitionDuration} cubic-bezier(0.23, 1, 0.32, 1)`,
    transformStyle: 'preserve-3d',
  }

  const backgroundStyle: CSSProperties = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: transform.isHovered ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }
    : {}

  const contentStyle: CSSProperties = enableParallax
    ? {
        transform: `translateZ(${parallaxOffset}px)`,
        transformStyle: 'preserve-3d',
      }
    : {}

  return (
    <div style={{ perspective: '1000px' }} className={className}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={cardStyle}
        className="three-d-card-shell"
      >
        {backgroundImage && (
          <div className="three-d-card-bg" style={backgroundStyle} aria-hidden="true" />
        )}

        <div className="three-d-card-border" aria-hidden="true" />

        <div style={contentStyle} className="three-d-card-content">
          {children}
        </div>
      </div>
    </div>
  )
}
