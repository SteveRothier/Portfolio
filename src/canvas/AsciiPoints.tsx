import { useRef, useEffect, useState } from 'react'
import { Text } from '@react-three/drei'

import portrait from '../assets/portrait.png'

// Liste de caractères spéciaux du clair au foncé
const CHARS = [' ', '.', '*', '+', 'x', '%', '#', '@']

export default function AsciiPoints() {
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
      const step = 6

      for (let y = 0; y < img.height; y += step) {
        for (let x = 0; x < img.width; x += step) {
          const idx = (y * img.width + x) * 4
          const r = imageData.data[idx]
          const g = imageData.data[idx + 1]
          const b = imageData.data[idx + 2]

          const brightness = (r + g + b) / 3 / 255
          if (brightness < 0.9) {
            const charIdx = Math.floor(brightness * (CHARS.length - 1))
            const char = CHARS[CHARS.length - 1 - charIdx] // plus foncé = caractère plus dense

            tempPoints.push({
              x: (x - img.width / 2) / 50,
              y: -(y - img.height / 2) / 50,
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
          fontSize={0.05}
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
