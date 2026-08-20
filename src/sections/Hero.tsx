import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import LaptopModel from '@/components/LaptopModel'
import laptopFallback from '@/assets/laptop-fallback.webp'
import { goal } from '@/lib/metrika'

const WA = 'https://wa.me/79521618811?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%9F%D0%B8%D1%88%D1%83%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20%E2%80%94%20%D1%85%D0%BE%D1%87%D1%83%20%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D1%82%D1%8C%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D0%BA%D1%83.'

function detectWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export default function Hero() {
  const root = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const explode = useRef(0)
  const mouse = useRef(0)
  const [webglOk] = useState(detectWebGL)
  const [isMobile] = useState(() => window.innerWidth < 768)

  /* subtle mouse parallax */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = (e.clientX / window.innerWidth - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  /*
   * Scroll progress computed manually every frame from the section's
   * bounding rect — no scroll libraries, works in any webview.
   * Lerped for buttery motion.
   */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let cur = -1
    let last = performance.now()

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const el = root.current
      if (el) {
        const r = el.getBoundingClientRect()
        const total = Math.max(1, r.height - window.innerHeight)
        const target = clamp01(-r.top / total)
        // frame-rate independent smoothing: converges in ~0.25s even on laggy devices
        const k = reduced ? 1 : Math.min(1, dt * 9)
        cur = cur < 0 ? target : cur + (target - cur) * k
        const p = cur
        explode.current = p

        // heading drifts up and fades
        const h = headingRef.current
        if (h) {
          const hp = clamp01((p - 0.08) / 0.4)
          h.style.opacity = String(1 - hp)
          h.style.transform = `translateY(${-hp * 26}%)`
        }
        // CTAs fade early
        const cta = ctaRef.current
        if (cta) cta.style.opacity = String(1 - clamp01((p - 0.05) / 0.18))
        // scroll hint
        const hint = hintRef.current
        if (hint) hint.style.opacity = String(1 - clamp01(p / 0.1))
        // closing caption
        const cap = captionRef.current
        if (cap) {
          const cp = clamp01((p - 0.68) / 0.25)
          cap.style.opacity = String(cp)
          cap.style.transform = `translateY(${(1 - cp) * 40}px)`
        }
        // glow intensifies
        const g = glowRef.current
        if (g) {
          const gp = clamp01((p - 0.15) / 0.55)
          g.style.opacity = String(0.25 + gp * 0.65)
          g.style.transform = `translate(-50%,-50%) scale(${0.7 + gp * 0.45})`
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section ref={root} id="top" className="relative h-[260vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {/* background */}
        <div className="dotgrid absolute inset-0 opacity-60" />
        <div
          ref={glowRef}
          className="orb left-1/2 top-1/2 h-[46vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 bg-[#00e066]/25"
        />
        <div className="orb -left-40 top-10 h-96 w-96 bg-[#00b956]/10" />
        <div className="orb -right-40 bottom-10 h-96 w-96 bg-[#0077ff]/10" />

        {/* heading */}
        <div
          ref={headingRef}
          className="pointer-events-none relative z-30 mb-[-6vh] text-center drop-shadow-[0_4px_24px_rgba(7,11,8,0.9)]"
        >
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.35em] text-[#00e066] md:text-xs">
            Томск · круглосуточно · выезд бесплатно
          </p>
          <h1 className="font-display text-[13vmin] font-black leading-[0.88] tracking-tight md:text-[11vmin]">
            СКУПКА
            <br />
            <span className="text-[#00e066]">НОУТБУКОВ</span>
          </h1>
        </div>

        {/* 3D laptop (or static fallback if WebGL is unavailable) */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {webglOk ? (
            <Canvas
              shadows={!isMobile}
              dpr={isMobile ? [1, 1.5] : [1, 1.75]}
              gl={{ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' }}
              camera={{ position: [0, 5.0, 6.6], fov: 30 }}
              style={{ background: 'transparent' }}
            >
              <Suspense fallback={null}>
                <LaptopModel explode={explode} mouse={mouse} />
              </Suspense>
            </Canvas>
          ) : (
            <img
              src={laptopFallback}
              alt="Ноутбук в разобранном виде: экран, клавиатура, плата, корпус"
              className="absolute left-1/2 top-1/2 max-h-[80vh] w-auto max-w-[94vw] -translate-x-1/2 -translate-y-1/2 object-contain"
            />
          )}
        </div>

        {/* closing caption */}
        <p
          ref={captionRef}
          className="pointer-events-none absolute bottom-[3vh] z-30 max-w-md px-6 text-center font-display text-xs font-bold uppercase tracking-widest text-white/80 opacity-0 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)] md:text-sm"
        >
          Разбираемся в технике <span className="text-[#00e066]">до последнего винтика</span>
        </p>

        {/* CTA */}
        <div
          ref={ctaRef}
          className="relative z-30 mt-[58vmin] flex flex-wrap items-center justify-center gap-3 px-6 md:mt-[46vmin]"
        >
          <a
            href={WA}
            target="_blank"
            rel="noreferrer"
            onClick={() => goal('buyback_cta')}
            className="rounded-full bg-[#00e066] px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-[#04140a] transition hover:scale-105 hover:bg-white"
          >
            Продать технику
          </a>
          <a
            href="#repair"
            onClick={() => goal('repair_cta')}
            className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white/80 backdrop-blur transition hover:border-[#00e066] hover:text-[#00e066]"
          >
            Нужен ремонт
          </a>
        </div>

        {/* scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-6 z-30 flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40"
        >
          Скролль — разберём ноутбук
          <svg className="h-4 w-4 animate-bounce text-[#00e066]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  )
}
