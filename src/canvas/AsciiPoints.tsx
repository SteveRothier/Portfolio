import { useEffect, useState } from 'react'
import { Text } from '@react-three/drei'
import portrait from '../assets/portrait.png'

// Caractères spéciaux du clair au foncé
const CHARS = [' ', '.', '*', '+', 'x', '%', '#', '@']

export default function AsciiPoints() {
  // Chaque point contient x, y, z et le caractère
  const [points, setPoints] = useState<{ x: number; y: number; z: number; char: string }[]>()

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

      const tempPoints: { x: number; y: number; z: number; char: string }[] = []

      const step = 2       // espacement plus serré
      const scale = 50     // pour centrer et zoomer l'image

      for (let y = 0; y < img.height; y += step) {
        for (let x = 0; x < img.width; x += step) {
          const idx = (y * img.width + x) * 4
          const r = imageData.data[idx]
          const g = imageData.data[idx + 1]
          const b = imageData.data[idx + 2]
          const a = imageData.data[idx + 3] / 255  // alpha

          const brightness = (r + g + b) / 3 / 255

          // uniquement pixels visibles et non blancs
          if (a > 0.1 && brightness < 0.95) {
            const charIdx = Math.floor(brightness * (CHARS.length - 1))
            const char = CHARS[CHARS.length - 1 - charIdx]

            tempPoints.push({
              x: (x - img.width / 2) / scale,
              y: -(y - img.height / 2) / scale,
              z: 0,
              char
            })
          }
        }
      }

      setPoints(tempPoints)
    }
  }, [])

  return (
    <>
      {points?.map((p, i) => (
        <Text
          key={i}
          position={[p.x, p.y, p.z]}
          fontSize={0.05}   // ajustable selon le step
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {p.char}
        </Text>
      ))}
    </>
  )
}
