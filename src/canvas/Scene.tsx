import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import AsciiImage from './AsciiImage'
import portrait from '../assets/portrait.png'

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />

      <Suspense fallback={null}>
        <AsciiImage src={portrait} />
      </Suspense>
    </Canvas>
  )
}
