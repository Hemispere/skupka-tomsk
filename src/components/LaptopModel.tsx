import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Html, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

export type ExplodeRef = MutableRefObject<number>

/* ---------- screen texture: glowing circuit pattern, drawn at runtime ---------- */
function useCircuitTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 680
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#02070a'
    ctx.fillRect(0, 0, 1024, 680)

    const glow = ctx.createRadialGradient(512, 340, 30, 512, 340, 420)
    glow.addColorStop(0, 'rgba(0,224,102,0.30)')
    glow.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, 1024, 680)

    let seed = 1337
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647

    for (let i = 0; i < 110; i++) {
      let x = 512 + (rnd() - 0.5) * 160
      let y = 340 + (rnd() - 0.5) * 120
      const dir = x > 512 ? 1 : -1
      ctx.strokeStyle = `rgba(0,${170 + ((rnd() * 85) | 0)},${80 + ((rnd() * 60) | 0)},${0.3 + rnd() * 0.55})`
      ctx.lineWidth = 1 + rnd() * 2
      ctx.shadowColor = '#00e066'
      ctx.shadowBlur = 7
      ctx.beginPath()
      ctx.moveTo(x, y)
      for (let s = 0; s < 5; s++) {
        if (rnd() > 0.45) x += dir * (30 + rnd() * 170)
        else y += (rnd() - 0.5) * 200
        ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.fillStyle = '#8affc4'
      ctx.shadowBlur = 14
      ctx.beginPath()
      ctx.arc(x, y, 2 + rnd() * 2.5, 0, 7)
      ctx.fill()
    }

    // central chip
    ctx.shadowColor = '#00e066'
    ctx.shadowBlur = 34
    ctx.fillStyle = '#04140a'
    ctx.fillRect(456, 284, 112, 112)
    ctx.strokeStyle = '#00e066'
    ctx.lineWidth = 4
    ctx.strokeRect(456, 284, 112, 112)
    ctx.shadowBlur = 0
    ctx.fillStyle = '#00e066'
    ctx.font = 'bold 26px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('TOMSK', 512, 332)
    ctx.fillText('70', 512, 366)

    const t = new THREE.CanvasTexture(c)
    t.anisotropy = 8
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
}

/* ---------- shared materials ---------- */
const MAT = {
  case: { color: '#23262b', metalness: 0.85, roughness: 0.38 },
  dark: { color: '#101214', metalness: 0.4, roughness: 0.6 },
  pcb: { color: '#072e1a', metalness: 0.2, roughness: 0.7 },
  copper: { color: '#c07a3a', metalness: 1, roughness: 0.28 },
  chip: { color: '#0a0c0e', metalness: 0.3, roughness: 0.5 },
  battery: { color: '#14161a', metalness: 0.5, roughness: 0.5 },
}

export default function LaptopModel({ explode, mouse }: { explode: ExplodeRef; mouse: ExplodeRef }) {
  const root = useRef<THREE.Group>(null)
  const gBottom = useRef<THREE.Group>(null)
  const gBoard = useRef<THREE.Group>(null)
  const gDeck = useRef<THREE.Group>(null)
  const gScreen = useRef<THREE.Group>(null)
  const keys = useRef<THREE.InstancedMesh>(null)
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])
  const screenTex = useCircuitTexture()
  const { size } = useThree()
  const isMobileGPU = size.width < 768

  /* keyboard: instanced key grid */
  useLayoutEffect(() => {
    if (!keys.current) return
    const m = new THREE.Matrix4()
    let i = 0
    const cols = 13
    const rows = 5
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isSpace = r === rows - 1 && c >= 4 && c <= 8
        if (r === rows - 1 && c > 4 && c <= 8) continue // merged into spacebar
        m.makeTranslation(-1.32 + c * 0.22, 0.075, -0.62 + r * 0.235)
        if (isSpace) m.scale(new THREE.Vector3(5.2, 1, 1))
        keys.current.setMatrixAt(i++, m)
      }
    }
    keys.current.count = i
    keys.current.instanceMatrix.needsUpdate = true
  }, [])

  useFrame((state) => {
    const p = explode.current
    const t = state.clock.elapsedTime
    const isMobile = size.width < 768

    if (root.current) {
      const idle = Math.sin(t * 1.2) * 0.05 * (1 - p)
      root.current.position.y = -0.72 + idle + p * 0.85
      root.current.rotation.y = -0.55 + p * 0.85 + mouse.current * 0.18
      root.current.rotation.x = 0.06 + p * 0.05
      const s = isMobile ? 0.58 : 0.8
      root.current.scale.setScalar(s * (1 - p * 0.32))
    }
    if (gBoard.current) gBoard.current.position.y = 0.08 + p * 1.15
    if (gDeck.current) gDeck.current.position.y = 0.36 + p * 2.15
    if (gScreen.current) {
      gScreen.current.position.y = 0.42 + p * 3.1
      gScreen.current.position.z = -1.12 - p * 0.25
      gScreen.current.rotation.x = -0.3 - p * 0.3
    }
    // camera drifts up a little as layers rise
    state.camera.lookAt(0, 0.35 + p * 1.35, 0)

    const labelOpacity = THREE.MathUtils.clamp((p - 0.55) * 4, 0, 1)
    labelRefs.current.forEach((el) => {
      if (el) el.style.opacity = String(labelOpacity)
    })
  })

  return (
    <>
      {/* lights */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 7, 5]} intensity={1.6} castShadow={!isMobileGPU} shadow-mapSize={[1024, 1024]} />
      <spotLight position={[-7, 4, -3]} intensity={60} color="#00e066" angle={0.5} penumbra={1} />
      <spotLight position={[7, 3, 4]} intensity={40} color="#4d94ff" angle={0.6} penumbra={1} />
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} color="#c9ffe2" />
        <Lightformer intensity={1.2} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color="#00e066" />
        <Lightformer intensity={1} position={[5, 1, 0]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#9fd8ff" />
      </Environment>

      <group ref={root} position={[0, 0, 0]}>
        {/* ---- bottom case ---- */}
        <group ref={gBottom}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.4, 0.1, 2.3]} />
            <meshStandardMaterial {...MAT.case} />
          </mesh>
          {[[-1.45, -0.95], [1.45, -0.95], [-1.45, 0.95], [1.45, 0.95]].map(([x, z], i) => (
            <mesh key={i} position={[x, -0.07, z]}>
              <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
              <meshStandardMaterial {...MAT.dark} />
            </mesh>
          ))}
          {/* vent slots */}
          {Array.from({ length: 18 }).map((_, i) => (
            <mesh key={`v${i}`} position={[-1.4 + i * 0.165, 0.051, -0.85]}>
              <boxGeometry args={[0.07, 0.005, 0.28]} />
              <meshStandardMaterial color="#0c0e10" roughness={0.8} />
            </mesh>
          ))}
          {/* screws */}
          {[[-1.5, -1.0], [1.5, -1.0], [-1.5, 1.0], [1.5, 1.0], [-0.5, -1.05], [0.5, -1.05], [-0.5, 1.05], [0.5, 1.05], [0, 0]].map(([x, z], i) => (
            <mesh key={`sc${i}`} position={[x, 0.052, z]}>
              <cylinderGeometry args={[0.03, 0.03, 0.012, 10]} />
              <meshStandardMaterial color="#0b0d0f" metalness={0.7} roughness={0.4} />
            </mesh>
          ))}
          <Html center position={[isMobileGPU ? -1.5 : -2.1, 0, 0.4]} zIndexRange={[10, 0]}>
            <div
              ref={(el) => { labelRefs.current[3] = el }}
              style={{ opacity: 0, transition: 'opacity .25s linear' }}
              className="pointer-events-none whitespace-nowrap rounded-full border border-[#00e066]/50 bg-[#070b08]/85 px-2 py-0.5 text-[8px] font-bold md:px-3 md:py-1 md:text-[10px] uppercase tracking-widest text-[#00e066] backdrop-blur"
            >
              {isMobileGPU ? 'Корпус' : 'Корпус и петли'}
            </div>
          </Html>
        </group>

        {/* ---- internals ---- */}
        <group ref={gBoard} position={[0, 0.08, 0]}>
          {/* PCB */}
          <mesh position={[0, 0, -0.25]} castShadow>
            <boxGeometry args={[3.0, 0.05, 1.5]} />
            <meshStandardMaterial {...MAT.pcb} />
          </mesh>
          {/* gold edge connector */}
          <mesh position={[0, 0.01, -0.97]}>
            <boxGeometry args={[1.2, 0.055, 0.06]} />
            <meshStandardMaterial color="#c9a227" metalness={1} roughness={0.3} />
          </mesh>

          {/* battery: 4 cells + label plate */}
          <group position={[0, 0.02, 0.78]}>
            {[-1.12, -0.37, 0.37, 1.12].map((x) => (
              <mesh key={x} position={[x, 0, 0]} castShadow>
                <boxGeometry args={[0.7, 0.09, 0.62]} />
                <meshStandardMaterial {...MAT.battery} />
              </mesh>
            ))}
            <mesh position={[0, 0.048, 0]}>
              <boxGeometry args={[0.9, 0.005, 0.3]} />
              <meshStandardMaterial color="#3f444b" metalness={0.4} roughness={0.5} />
            </mesh>
          </group>

          {/* fans: hub + blades + glow ring */}
          {[-0.95, 0.95].map((x) => (
            <group key={x} position={[x, 0.055, -0.55]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.34, 0.34, 0.08, 28]} />
                <meshStandardMaterial {...MAT.dark} />
              </mesh>
              {Array.from({ length: 8 }).map((_, i) => (
                <mesh
                  key={i}
                  position={[Math.cos((i * Math.PI) / 4) * 0.16, 0.045, Math.sin((i * Math.PI) / 4) * 0.16]}
                  rotation={[0, -i * (Math.PI / 4), 0]}
                >
                  <boxGeometry args={[0.26, 0.015, 0.07]} />
                  <meshStandardMaterial color="#26292d" metalness={0.5} roughness={0.5} />
                </mesh>
              ))}
              <mesh position={[0, 0.045, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 0.025, 20]} />
                <meshStandardMaterial color="#2b2f34" metalness={0.6} roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.048, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.34, 0.012, 8, 40]} />
                <meshStandardMaterial color="#00e066" emissive="#00e066" emissiveIntensity={0.8} />
              </mesh>
            </group>
          ))}

          {/* copper heatsink fins next to fans */}
          {[-1.32, 1.32].map((x) => (
            <group key={`hs${x}`} position={[x, 0.07, -0.55]}>
              {Array.from({ length: 9 }).map((_, i) => (
                <mesh key={i} position={[0, 0, -0.16 + i * 0.04]}>
                  <boxGeometry args={[0.14, 0.11, 0.015]} />
                  <meshStandardMaterial {...MAT.copper} />
                </mesh>
              ))}
            </group>
          ))}

          {/* CPU + GPU dies under heat pipes */}
          {[[-0.15, -0.45, 0.4], [0.35, -0.42, 0.3]].map(([x, z, s], i) => (
            <mesh key={`die${i}`} position={[x, 0.045, z]}>
              <boxGeometry args={[s, 0.03, s]} />
              <meshStandardMaterial color="#15181c" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}

          {/* RAM sticks with gold contacts */}
          {[0.0, 0.18].map((z) => (
            <group key={`ram${z}`} position={[-0.75, 0.05, z]}>
              <mesh castShadow>
                <boxGeometry args={[0.8, 0.035, 0.14]} />
                <meshStandardMaterial color="#0a3320" metalness={0.2} roughness={0.6} />
              </mesh>
              <mesh position={[0, -0.005, 0.075]}>
                <boxGeometry args={[0.8, 0.02, 0.02]} />
                <meshStandardMaterial color="#c9a227" metalness={1} roughness={0.3} />
              </mesh>
            </group>
          ))}

          {/* M.2 SSD */}
          <group position={[0.55, 0.05, 0.28]}>
            <mesh castShadow>
              <boxGeometry args={[0.24, 0.035, 0.75]} />
              <meshStandardMaterial color="#0e2b1a" metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.02, -0.15]}>
              <boxGeometry args={[0.16, 0.015, 0.3]} />
              <meshStandardMaterial {...MAT.chip} />
            </mesh>
          </group>

          {/* wifi card + antenna wires */}
          <group position={[1.08, 0.05, 0.12]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.03, 0.3]} />
              <meshStandardMaterial color="#0d2b4a" metalness={0.3} roughness={0.5} />
            </mesh>
            {[0, 1].map((i) => (
              <mesh key={i} position={[-0.28, 0.02, -0.05 + i * 0.08]} rotation={[0, 0.4 + i * 0.35, Math.PI / 2]}>
                <cylinderGeometry args={[0.008, 0.008, 0.5, 6]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
              </mesh>
            ))}
          </group>

          {/* speakers */}
          {[-1.25, 1.25].map((x) => (
            <mesh key={`sp${x}`} position={[x, 0.045, 0.38]} castShadow>
              <boxGeometry args={[0.42, 0.07, 0.2]} />
              <meshStandardMaterial color="#17191d" metalness={0.5} roughness={0.5} />
            </mesh>
          ))}

          {/* CMOS battery */}
          <mesh position={[-1.2, 0.05, 0.02]}>
            <cylinderGeometry args={[0.09, 0.09, 0.03, 20]} />
            <meshStandardMaterial color="#b8bcc2" metalness={1} roughness={0.25} />
          </mesh>

          {/* capacitors */}
          {[[-0.5, -0.7], [-0.35, -0.78], [0.6, -0.72], [0.85, -0.3], [-1.15, -0.78], [1.2, -0.15], [0.2, 0.02], [-0.32, 0.32]].map(([x, z], i) => (
            <mesh key={`cap${i}`} position={[x, 0.05, z]}>
              <cylinderGeometry args={[0.03, 0.03, 0.08, 10]} />
              <meshStandardMaterial color={i % 2 ? '#232629' : '#9aa0a6'} metalness={0.8} roughness={0.35} />
            </mesh>
          ))}

          {/* misc IC chips */}
          {[[-0.35, -0.35, 0.3], [0.45, -0.2, 0.22], [-0.6, 0.3, 0.18], [0.9, 0.32, 0.14], [-1.0, -0.3, 0.12], [0.3, -0.75, 0.14], [-0.15, 0.28, 0.16], [1.35, -0.05, 0.1]].map(([x, z, s], i) => (
            <mesh key={`c${i}`} position={[x, 0.045, z]} castShadow>
              <boxGeometry args={[s, 0.04, s]} />
              <meshStandardMaterial {...MAT.chip} />
            </mesh>
          ))}

          {/* ribbon cable to the front */}
          <mesh position={[0, 0.045, 0.52]}>
            <boxGeometry args={[0.35, 0.012, 0.3]} />
            <meshStandardMaterial color="#c76b28" metalness={0.2} roughness={0.6} />
          </mesh>
          {/* copper heat pipes */}
          {[-0.12, 0.06].map((z, i) => (
            <mesh key={i} position={[0, 0.1, -0.5 + z]} rotation={[0, i ? 0.1 : -0.08, 0]} castShadow>
              <boxGeometry args={[2.2, 0.035, 0.09]} />
              <meshStandardMaterial {...MAT.copper} />
            </mesh>
          ))}
          {/* chips & SSD */}
          {[[-0.35, -0.35, 0.3], [0.45, -0.2, 0.22], [-0.6, 0.15, 0.18], [0.9, 0.2, 0.14]].map(([x, z, s], i) => (
            <mesh key={`c${i}`} position={[x, 0.05, z]} castShadow>
              <boxGeometry args={[s, 0.05, s]} />
              <meshStandardMaterial {...MAT.chip} />
            </mesh>
          ))}
          <mesh position={[0.15, 0.05, 0.42]} castShadow>
            <boxGeometry args={[0.28, 0.04, 0.8]} />
            <meshStandardMaterial color="#0e2b1a" metalness={0.3} roughness={0.5} />
          </mesh>
          <Html center position={[isMobileGPU ? 1.45 : 2.05, 0.1, -0.2]} zIndexRange={[10, 0]}>
            <div
              ref={(el) => { labelRefs.current[2] = el }}
              style={{ opacity: 0, transition: 'opacity .25s linear' }}
              className="pointer-events-none whitespace-nowrap rounded-full border border-[#00e066]/50 bg-[#070b08]/85 px-2 py-0.5 text-[8px] font-bold md:px-3 md:py-1 md:text-[10px] uppercase tracking-widest text-[#00e066] backdrop-blur"
            >
              {isMobileGPU ? 'Плата и SSD' : 'Плата, охлаждение, SSD'}
            </div>
          </Html>
        </group>

        {/* ---- keyboard deck ---- */}
        <group ref={gDeck} position={[0, 0.3, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.4, 0.11, 2.3]} />
            <meshStandardMaterial {...MAT.case} />
          </mesh>
          <instancedMesh ref={keys} args={[undefined, undefined, 80]} castShadow>
            <boxGeometry args={[0.17, 0.045, 0.17]} />
            <meshStandardMaterial color="#0f1113" metalness={0.3} roughness={0.55} emissive="#0a3a22" emissiveIntensity={0.35} />
          </instancedMesh>
          {/* touchpad */}
          <mesh position={[0, 0.057, 0.72]}>
            <boxGeometry args={[1.05, 0.012, 0.68]} />
            <meshStandardMaterial color="#31353b" metalness={0.7} roughness={0.3} />
          </mesh>
          <Html center position={[isMobileGPU ? -1.5 : -2.15, 0.1, 0.3]} zIndexRange={[10, 0]}>
            <div
              ref={(el) => { labelRefs.current[1] = el }}
              style={{ opacity: 0, transition: 'opacity .25s linear' }}
              className="pointer-events-none whitespace-nowrap rounded-full border border-[#00e066]/50 bg-[#070b08]/85 px-2 py-0.5 text-[8px] font-bold md:px-3 md:py-1 md:text-[10px] uppercase tracking-widest text-[#00e066] backdrop-blur"
            >
              {isMobileGPU ? 'Клавиатура' : 'Клавиатура и топкейс'}
            </div>
          </Html>
        </group>

        {/* ---- screen ---- */}
        <group ref={gScreen} position={[0, 0.42, -1.12]} rotation={[-0.3, 0, 0]}>
          {/* lid */}
          <mesh position={[0, 1.13, 0]} castShadow>
            <boxGeometry args={[3.4, 2.26, 0.08]} />
            <meshStandardMaterial {...MAT.case} />
          </mesh>
          {/* display */}
          <mesh position={[0, 1.13, 0.045]}>
            <planeGeometry args={[3.08, 1.94]} />
            <meshStandardMaterial map={screenTex} emissiveMap={screenTex} emissive="#ffffff" emissiveIntensity={0.9} color="#000000" roughness={0.15} metalness={0.1} />
          </mesh>
          {/* webcam dot */}
          <mesh position={[0, 2.16, 0.045]}>
            <circleGeometry args={[0.02, 12]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
          <Html center position={[isMobileGPU ? 1.45 : 2.2, 1.05, 0.1]} zIndexRange={[10, 0]}>
            <div
              ref={(el) => { labelRefs.current[0] = el }}
              style={{ opacity: 0, transition: 'opacity .25s linear' }}
              className="pointer-events-none whitespace-nowrap rounded-full border border-[#00e066]/50 bg-[#070b08]/85 px-2 py-0.5 text-[8px] font-bold md:px-3 md:py-1 md:text-[10px] uppercase tracking-widest text-[#00e066] backdrop-blur"
            >
              {isMobileGPU ? 'Экран' : 'Матрица и экран'}
            </div>
          </Html>
        </group>
      </group>

      {/* static (frames=1) low-res shadow on mobile: re-rendering the whole scene every frame is too heavy for phone GPUs */}
      <ContactShadows position={[0, -0.35, 0]} opacity={0.55} scale={12} blur={2.6} far={4} color="#000000" frames={isMobileGPU ? 1 : Infinity} resolution={isMobileGPU ? 512 : 1024} />
    </>
  )
}
