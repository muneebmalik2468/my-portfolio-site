'use client'
import { useEffect, useRef } from 'react'

// Smooth neon tube trail cursor with glowing particles following the mouse
export default function CustomCursor() {
  const canvasRef = useRef(null)
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)

    // A list of points that form the tube trail
    const points = []
    const MAX = 28
    let mouse = { x: W / 2, y: H / 2 }
    let ringPos = { x: W / 2, y: H / 2 }
    let hover = false

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`
      }
      const t = e.target
      const isHover = t.closest('a, button, [role="button"], .cursor-hover')
      hover = !!isHover
    }

    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)

    let raf
    const loop = () => {
      // Smooth follow ring
      ringPos.x += (mouse.x - ringPos.x) * 0.18
      ringPos.y += (mouse.y - ringPos.y) * 0.18
      if (ringRef.current) {
        const size = hover ? 56 : 34
        ringRef.current.style.width = size + 'px'
        ringRef.current.style.height = size + 'px'
        ringRef.current.style.transform = `translate3d(${ringPos.x - size / 2}px, ${ringPos.y - size / 2}px, 0)`
        ringRef.current.style.borderColor = hover ? 'rgba(56,189,248,0.95)' : 'rgba(168,85,247,0.8)'
      }

      points.unshift({ x: mouse.x, y: mouse.y })
      if (points.length > MAX) points.pop()

      ctx.clearRect(0, 0, W, H)

      // Draw tube/ribbon trail
      if (points.length > 2) {
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i]
          const p2 = points[i + 1]
          const t = 1 - i / points.length
          const width = Math.max(0.5, 10 * t)
          const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
          grad.addColorStop(0, `rgba(168,85,247,${0.9 * t})`)
          grad.addColorStop(1, `rgba(56,189,248,${0.9 * t})`)
          ctx.strokeStyle = grad
          ctx.lineWidth = width
          ctx.lineCap = 'round'
          ctx.shadowBlur = 18
          ctx.shadowColor = 'rgba(168,85,247,0.8)'
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }

      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998] hidden md:block"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border-2 pointer-events-none z-[9999] transition-[width,height,border-color] duration-200 ease-out hidden md:block"
        style={{
          width: 34,
          height: 34,
          boxShadow: '0 0 20px rgba(168,85,247,0.6), inset 0 0 8px rgba(56,189,248,0.3)',
        }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999] hidden md:block"
        style={{ boxShadow: '0 0 10px #fff, 0 0 20px #a855f7' }}
      />
    </>
  )
}
