import { useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

interface AsciiImageProps {
  src: string
}

export default function AsciiImage({ src }: AsciiImageProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const texture = useLoader(THREE.TextureLoader, src)

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4, 4]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}
