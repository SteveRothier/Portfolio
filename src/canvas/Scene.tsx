import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import AsciiPoints from './AsciiPoints'

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <AsciiPoints />
      </Suspense>
    </Canvas>
  )
}
