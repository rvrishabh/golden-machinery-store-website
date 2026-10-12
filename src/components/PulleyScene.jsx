import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { scrollState, prefersReducedMotion } from '../lib/motion'

// Drive layout (world units). Big flat crown pulley drives a 3-groove V pulley.
const BIG = { x: -1.9, r: 2.05 }
const SMALL = { x: 2.55, r: 1.08 }
const BELT_T = 0.09

// Lathe profiles need near-duplicate points at corners, otherwise the
// normals get averaged and every hard edge reads as rounded.
function sharpen(points) {
  const out = []
  points.forEach((p, i) => {
    const prev = points[i - 1]
    const next = points[i + 1]
    if (!prev || !next) return out.push(p)
    const e = 0.004
    out.push(p.clone().lerp(prev, e / p.distanceTo(prev)))
    out.push(p.clone().lerp(next, e / p.distanceTo(next)))
  })
  return out
}

function vPulleyProfile(R) {
  const v = (x, y) => new THREE.Vector2(x, y)
  const pts = [v(0.24, -0.62), v(0.46, -0.62), v(0.46, -0.11), v(R - 0.32, -0.11), v(R - 0.32, -0.6), v(R, -0.6)]
  // three V grooves centred on y = -0.4, 0, 0.4
  for (const c of [-0.4, 0, 0.4]) {
    pts.push(v(R, c - 0.17), v(R - 0.22, c - 0.05), v(R - 0.22, c + 0.05), v(R, c + 0.17))
  }
  pts.push(v(R, 0.6), v(R - 0.32, 0.6), v(R - 0.32, 0.11), v(0.46, 0.11), v(0.46, 0.62), v(0.24, 0.62), v(0.24, -0.62))
  return sharpen(pts)
}

function rimProfile(R) {
  const v = (x, y) => new THREE.Vector2(x, y)
  // crowned running face: slightly larger diameter in the middle
  const face = []
  for (let i = 0; i <= 10; i++) {
    const y = -0.55 + (1.1 * i) / 10
    face.push(v(R + 0.035 * (1 - (y / 0.55) ** 2), y))
  }
  return sharpen([v(R - 0.16, -0.55), ...face, v(R - 0.16, 0.55), v(R - 0.16, -0.55)])
}

function beltCurve() {
  const d = SMALL.x - BIG.x
  const r1 = BIG.r + 0.04 + BELT_T / 2
  const r2 = SMALL.r - 0.13
  const alpha = Math.asin((r1 - r2) / d)
  const top = Math.PI / 2 - alpha
  const pts = []
  const arc = (cx, r, a0, a1, n) => {
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n
      pts.push(new THREE.Vector3(cx + r * Math.cos(a), r * Math.sin(a), 0))
    }
  }
  arc(BIG.x, r1, top, Math.PI * 2 - top, 120)
  arc(SMALL.x, r2, -top, top, 60)
  pts.pop()
  return { curve: new THREE.CatmullRomCurve3(pts, true, 'centripetal'), r1, r2 }
}

function useBeltTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 128
    c.height = 16
    const g = c.getContext('2d')
    g.fillStyle = '#121214'
    g.fillRect(0, 0, 128, 16)
    g.fillStyle = '#d9a441'
    for (let i = 0; i < 4; i++) g.fillRect(i * 32 + 2, 0, 3, 16)
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(30, 1)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
}

function BigPulley({ spin }) {
  const ref = useRef()
  const rim = useMemo(() => new THREE.LatheGeometry(rimProfile(BIG.r), 128), [])
  const spokes = useMemo(() => {
    // gently curved arms, like the cast crown patta pulleys
    return Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0),
        new THREE.Vector3(Math.cos(a + 0.28) * 1.15, Math.sin(a + 0.28) * 1.15, 0),
        new THREE.Vector3(Math.cos(a + 0.12) * (BIG.r - 0.1), Math.sin(a + 0.12) * (BIG.r - 0.1), 0),
      )
      return new THREE.TubeGeometry(curve, 24, 0.085, 10, false)
    })
  }, [])
  useFrame(() => {
    ref.current.rotation.z = spin.current.big
  })
  return (
    <group position={[BIG.x, 0, 0]}>
      <group ref={ref}>
        <mesh geometry={rim} rotation-x={Math.PI / 2} castShadow>
          <meshStandardMaterial color="#d6a648" metalness={1} roughness={0.28} side={THREE.DoubleSide} />
        </mesh>
        {spokes.map((g, i) => (
          <mesh key={i} geometry={g} scale={[1, 1, 2.2]}>
            <meshStandardMaterial color="#1b1c20" metalness={0.85} roughness={0.42} />
          </mesh>
        ))}
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.55, 0.55, 0.9, 48]} />
          <meshStandardMaterial color="#1b1c20" metalness={0.85} roughness={0.38} />
        </mesh>
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.3, 0.3, 0.92, 48]} />
          <meshStandardMaterial color="#e8c26a" metalness={1} roughness={0.18} />
        </mesh>
        {/* keyway marker so rotation always reads */}
        <mesh position={[0, 0.31, 0.47]}>
          <boxGeometry args={[0.1, 0.08, 0.02]} />
          <meshStandardMaterial color="#0b0c0e" />
        </mesh>
      </group>
    </group>
  )
}

function SmallPulley({ spin }) {
  const ref = useRef()
  const body = useMemo(() => new THREE.LatheGeometry(vPulleyProfile(SMALL.r), 128), [])
  useFrame(() => {
    ref.current.rotation.z = spin.current.small
  })
  return (
    <group position={[SMALL.x, 0, 0]}>
      <group ref={ref}>
        <mesh geometry={body} rotation-x={Math.PI / 2} castShadow>
          <meshStandardMaterial color="#2f7fc1" metalness={0.75} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0.13]} rotation-x={Math.PI / 2}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 6]} />
              <meshStandardMaterial color="#e8c26a" metalness={1} roughness={0.2} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

function Belt({ beltTex, belt }) {
  const geom = useMemo(() => new THREE.TubeGeometry(belt.curve, 400, BELT_T, 4, true), [belt])
  return (
    <mesh geometry={geom} rotation-z={0}>
      <meshStandardMaterial map={beltTex} roughness={0.75} metalness={0.1} />
    </mesh>
  )
}

function Drive({ drag }) {
  const group = useRef()
  const beltTex = useBeltTexture()
  const belt = useMemo(beltCurve, [])
  const beltLen = useMemo(() => belt.curve.getLength(), [belt])
  const spin = useRef({ big: 0, small: 0, omega: 0.35 })
  const base = prefersReducedMotion ? 0.08 : 0.35

  useFrame((state, dt) => {
    const s = spin.current
    dt = Math.min(dt, 1 / 30)
    // signed scroll velocity + drag impulse drive the angular speed; scrolling up reverses it
    const target = -THREE.MathUtils.clamp(base + scrollState.velocity * 0.09, -9, 9)
    s.omega = THREE.MathUtils.lerp(s.omega, target + drag.current.impulse, 0.08)
    drag.current.impulse *= 0.94
    s.big += s.omega * dt
    // belt-coupled: same surface speed, so the small one spins faster
    s.small += s.omega * dt * (belt.r1 / belt.r2)
    // the belt runs at the big pulley's surface speed
    beltTex.offset.x -= ((s.omega * belt.r1 * dt) / beltLen) * beltTex.repeat.x

    // hero scroll choreography + pointer parallax
    const p = scrollState.heroProgress
    const g = group.current
    const mx = state.pointer.x
    const my = state.pointer.y
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, -0.38 + p * 0.75 + mx * 0.12, 0.06)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.12 - p * 0.2 - my * 0.08, 0.06)
    g.position.y = THREE.MathUtils.lerp(g.position.y, 0.2 + p * 0.4, 0.06)
    // fit the drive (~7.6 units wide) into the right half on desktop, centred on mobile
    const w = state.size.width
    const vw = state.viewport.width
    const mobile = w < 900
    const fit = mobile ? Math.min(0.6, (vw * 0.8) / 7.8) : Math.min(0.95, (vw * 0.47) / 7.8)
    const x = mobile ? 0.1 : vw * 0.25 * (1 - p) + 0.05
    g.position.x = THREE.MathUtils.lerp(g.position.x, x, 0.06)
    const sc = fit * (1 + p * (mobile ? 0.1 : 0.45))
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, sc, 0.06))
  })

  return (
    <group ref={group} position={[2.4, 0, 0]}>
      <BigPulley spin={spin} />
      <SmallPulley spin={spin} />
      <Belt beltTex={beltTex} belt={belt} />
    </group>
  )
}

export default function PulleyScene({ active, drag }) {
  return (
    <Canvas
      className="hero-canvas"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 11.5], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 6, 6]} intensity={1.4} color="#fff3dc" />
      <directionalLight position={[-6, -2, 3]} intensity={0.5} color="#7fb4ff" />
      <Drive drag={drag} />
      <ContactShadows position={[0, -3.1, 0]} opacity={0.55} scale={18} blur={2.6} far={5} color="#000" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -6]} scale={[12, 2, 1]} color="#fff2d6" />
        <Lightformer form="rect" intensity={2} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#ffd38a" />
        <Lightformer form="rect" intensity={1.4} position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} color="#9cc6ff" />
        <Lightformer form="ring" intensity={2.2} position={[0, 0, 8]} scale={4} color="#ffffff" />
      </Environment>
    </Canvas>
  )
}
