'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Icosahedron, Points, PointMaterial, Text3D, Center } from '@react-three/drei'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────
// Background starfield
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

  useFrame((_, delta) => {
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
// Floating Icosahedron
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
// 3D Extruded Code Glyph — thin wireframe "</>" / "{}"
// ─────────────────────────────────────────────────────────────
function CodeGlyph({ text, position, color, size = 1, speed = 1, depth = 0.05 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.35 * speed
      ref.current.rotation.x = Math.sin(performance.now() * 0.0005 * speed) * 0.2
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.8}>
      <group ref={ref} position={position}>
        <Center>
          <Text3D
            font="/fonts/helvetiker_regular.json"
            size={size}
            height={depth}
            curveSegments={12}
            bevelEnabled={false}
          >
            {text}
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.9}
              metalness={0.3}
              roughness={0.35}
              wireframe
              toneMapped={false}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  )
}

// ─────────────────────────────────────────────────────────────
// Responsive scene content — adjusts positions/scales per viewport
// so shapes peek in from the edges on small screens.
// ─────────────────────────────────────────────────────────────
function SceneContent() {
  const { size } = useThree()
  const isMobile = size.width < 640
  const isTablet = size.width >= 640 && size.width < 1024

  // Overall multiplier that squeezes the layout horizontally on smaller viewports.
  // On mobile we pull shapes well inside the narrow portrait frustum so a visible chunk
  // of each shape peeks into view (rather than sitting just beyond the edge).
  const layout = isMobile
    ? { x: 0.48, scale: 0.5, glyphSize: 0.55 }
    : isTablet
    ? { x: 0.82, scale: 0.75, glyphSize: 0.85 }
    : { x: 1, scale: 1, glyphSize: 1.1 }

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.3} color="#a855f7" />
      <pointLight position={[-5, -5, -5]} intensity={1.1} color="#38bdf8" />
      <pointLight position={[0, 0, 4]} intensity={0.6} color="#ffffff" />

      <ParticleField />

      {/* Two wireframe icosahedrons */}
      <FloatingIcosa
        position={[-3 * layout.x, 1.2, -1]}
        color="#a855f7"
        scale={0.9 * layout.scale}
      />
      <FloatingIcosa
        position={[-2.5 * layout.x, -1.5, 0.5]}
        color="#22d3ee"
        scale={0.5 * layout.scale}
        speed={0.9}
      />

      {/* Large 3D "</>" — neon cyan */}
      <CodeGlyph
        text="</>"
        position={[3 * layout.x, 1.3, -1]}
        color="#38bdf8"
        size={layout.glyphSize}
        depth={0.05}
        speed={0.9}
      />

      {/* Large 3D "{}" — neon purple */}
      <CodeGlyph
        text="{ }"
        position={[2.7 * layout.x, -1.4, -0.5]}
        color="#c084fc"
        size={layout.glyphSize * 1.1}
        depth={0.05}
        speed={1.1}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Scene root
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
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
