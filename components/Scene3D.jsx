'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Icosahedron, Points, PointMaterial } from '@react-three/drei'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────
// Background starfield (unchanged)
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// Floating Icosahedron (kept as-is)
// ─────────────────────────────────────────────────────────────
function FloatingIcosa({ position, color, scale = 1, speed = 1 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.3 * speed
      ref.current.rotation.y += delta * 0.4 * speed
    }
  })
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <group ref={ref} position={position} scale={scale}>
        <Icosahedron args={[1, 0]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
            wireframe
          />
        </Icosahedron>
      </group>
    </Float>
  )
}

// ─────────────────────────────────────────────────────────────
// React Atom — iconic 3-ring electron orbit + glowing nucleus
// ─────────────────────────────────────────────────────────────
function ReactAtom({ position, scale = 1, speed = 1 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.35 * speed
      ref.current.rotation.y += delta * 0.5 * speed
      ref.current.rotation.z += delta * 0.15 * speed
    }
  })

  // 3 elliptical rings tilted at 0°, 60°, -60° (classic React logo orientation)
  const ringRotations = [
    [0, 0, 0],
    [0, 0, Math.PI / 3],
    [0, 0, -Math.PI / 3],
  ]

  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={2}>
      <group ref={ref} position={position} scale={scale}>
        {/* Nucleus */}
        <mesh>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshStandardMaterial
            color="#61DAFB"
            emissive="#61DAFB"
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>

        {/* Electron orbits (flattened tori = ellipses) */}
        {ringRotations.map((rot, i) => (
          <mesh key={i} rotation={rot} scale={[1.1, 0.45, 1.1]}>
            <torusGeometry args={[1, 0.045, 16, 96]} />
            <meshStandardMaterial
              color="#61DAFB"
              emissive="#61DAFB"
              emissiveIntensity={1.4}
              toneMapped={false}
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// ─────────────────────────────────────────────────────────────
// Code Cube — wireframe "module/container" with a glowing inner core
// Represents a code block / dev container / package
// ─────────────────────────────────────────────────────────────
function CodeCube({ position, scale = 1, speed = 1 }) {
  const outerRef = useRef()
  const innerRef = useRef()

  useFrame((_, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.x += delta * 0.25 * speed
      outerRef.current.rotation.y += delta * 0.3 * speed
    }
    if (innerRef.current) {
      // counter-rotate the inner core for a techy mechanical feel
      innerRef.current.rotation.x -= delta * 0.7 * speed
      innerRef.current.rotation.y -= delta * 0.5 * speed
      innerRef.current.rotation.z += delta * 0.3 * speed
    }
  })

  return (
    <Float speed={1.3} rotationIntensity={0.6} floatIntensity={1.8}>
      <group position={position} scale={scale}>
        {/* Outer wireframe shell */}
        <mesh ref={outerRef}>
          <boxGeometry args={[1.6, 1.6, 1.6]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive="#c084fc"
            emissiveIntensity={0.8}
            wireframe
            toneMapped={false}
          />
        </mesh>

        {/* Inner glowing core */}
        <mesh ref={innerRef}>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={1.6}
            metalness={0.6}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>

        {/* 8 corner bolts — tiny nodes for extra tech detail */}
        {[
          [0.8, 0.8, 0.8], [-0.8, 0.8, 0.8], [0.8, -0.8, 0.8], [-0.8, -0.8, 0.8],
          [0.8, 0.8, -0.8], [-0.8, 0.8, -0.8], [0.8, -0.8, -0.8], [-0.8, -0.8, -0.8],
        ].map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// ─────────────────────────────────────────────────────────────
// Scene
// ─────────────────────────────────────────────────────────────
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

          {/* Kept: two icosahedrons */}
          <FloatingIcosa position={[-3, 1.2, -1]} color="#a855f7" scale={0.9} />
          <FloatingIcosa position={[-2.5, -1.5, 0.5]} color="#22d3ee" scale={0.5} speed={0.9} />

          {/* NEW: React atom (replaces the torus) */}
          <ReactAtom position={[3, -1, -2]} scale={0.85} speed={0.9} />

          {/* NEW: Code cube (replaces the torus-knot) */}
          <CodeCube position={[2.5, 2, 0]} scale={0.55} speed={1.1} />
        </Suspense>
      </Canvas>
    </div>
  )
}
