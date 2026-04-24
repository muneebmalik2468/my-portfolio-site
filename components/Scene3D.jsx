'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Icosahedron, Torus, TorusKnot, Sphere, Points, PointMaterial } from '@react-three/drei'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

function ParticleField() {
  const ref = useRef()
  const count = 1600
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 8 + 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      p[i * 3 + 2] = r * Math.cos(phi)
    }
    return p
  }, [])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.04
      ref.current.rotation.x += delta * 0.02
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a855f7"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function FloatingGeometry({ position, color, geometry = 'icosa', scale = 1, speed = 1 }) {
  const ref = useRef()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.3 * speed
      ref.current.rotation.y += delta * 0.4 * speed
    }
  })
  const mat = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.6}
      roughness={0.2}
      metalness={0.8}
      wireframe
    />
  )
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <group ref={ref} position={position} scale={scale}>
        {geometry === 'icosa' && <Icosahedron args={[1, 0]}>{mat}</Icosahedron>}
        {geometry === 'torus' && <Torus args={[1, 0.35, 16, 80]}>{mat}</Torus>}
        {geometry === 'knot' && <TorusKnot args={[0.7, 0.22, 100, 16]}>{mat}</TorusKnot>}
        {geometry === 'sphere' && <Sphere args={[1, 24, 24]}>{mat}</Sphere>}
      </group>
    </Float>
  )
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color="#a855f7" />
          <pointLight position={[-5, -5, -5]} intensity={1} color="#38bdf8" />
          <ParticleField />
          <FloatingGeometry position={[-3, 1.2, -1]} color="#a855f7" geometry="icosa" scale={0.9} />
          <FloatingGeometry position={[3, -1, -2]} color="#38bdf8" geometry="torus" scale={0.8} speed={0.8} />
          <FloatingGeometry position={[2.5, 2, 0]} color="#c084fc" geometry="knot" scale={0.6} speed={1.2} />
          <FloatingGeometry position={[-2.5, -1.5, 0.5]} color="#22d3ee" geometry="icosa" scale={0.5} speed={0.9} />
        </Suspense>
      </Canvas>
    </div>
  )
}
