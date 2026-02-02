import { useRef, useEffect, useState } from 'react'
import { Points } from 'three'

import portrait from '../assets/portrait.png'

export default function AsciiImagePoints() {
  const pointsRef = useRef<Points>(null!)
  const [positions, setPositions] = useState<Float32Array>()

  useEffect(() => {
    const img = new Image()
    img.src = portrait
    img.crossOrigin = 'Anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, img.width, img.height)

      const tempPositions: number[] = []
      const step = 4

      for (let y = 0; y < img.height; y += step) {
        for (let x = 0; x < img.width; x += step) {
          const idx = (y * img.width + x) * 4
          const r = imageData.data[idx]
          const g = imageData.data[idx + 1]
          const b = imageData.data[idx + 2]

          const brightness = (r + g + b) / 3 / 255
          if (brightness < 0.9) {
            const px = (x - img.width / 2) / 50
            const py = -(y - img.height / 2) / 50
            const pz = 0
            tempPositions.push(px, py, pz)
          }
        }
      }

      setPositions(new Float32Array(tempPositions))
    }
  }, [])

  return positions ? (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="white" size={0.03} />
    </points>
  ) : null
}
