'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import {
  Github, Linkedin, Twitter, Mail, ArrowRight, ArrowDown, Download, ExternalLink,
  Code2, Database, Cloud, Cpu, Layers, Palette, Server, Zap, Send,
  Briefcase, GraduationCap, Sparkles, Volume2, VolumeX, MapPin, Award,
  Menu, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import CustomCursor from '@/components/CustomCursor'
import LoadingScreen from '@/components/LoadingScreen'

// Lazy-load the 3D scene so it doesn't block initial paint.
const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false })

// ====== DATA ======
const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#stack' },
  { label: 'Work', href: '#work' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
]

const SKILLS = [
  { name: 'Frontend Development', level: 95, icon: Palette },
  { name: 'Backend Engineering', level: 92, icon: Server },
  { name: 'Cloud & DevOps', level: 85, icon: Cloud },
  { name: 'Database Design', level: 88, icon: Database },
  { name: 'System Architecture', level: 90, icon: Cpu },
  { name: 'UI / UX Engineering', level: 87, icon: Layers },
]

const STACK = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#ffffff' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Node.js', color: '#8CC84B' },
  { name: 'Python', color: '#FFD43B' },
  { name: 'PostgreSQL', color: '#4f8fd8' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'GraphQL', color: '#E10098' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'Redis', color: '#DC382D' },
  { name: 'Tailwind', color: '#38BDF8' },
  { name: 'Three.js', color: '#c084fc' },
  { name: 'Rust', color: '#F74C00' },
  { name: 'Kubernetes', color: '#326CE5' },
  { name: 'Go', color: '#00ADD8' },
]

const PROJECTS = [
  {
    title: 'NeuroSync AI',
    tag: 'AI Platform',
    desc: 'Real-time collaborative AI workspace with multi-agent orchestration, streaming responses, and a custom vector search engine.',
    stack: ['Next.js', 'Python', 'OpenAI', 'Pinecone', 'WebSocket'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    color: 'from-purple-600 to-fuchsia-500',
  },
  {
    title: 'Quantum Commerce',
    tag: 'E-Commerce',
    desc: 'Headless commerce platform handling 10M+ requests/day with personalized recommendations and sub-100ms checkout.',
    stack: ['React', 'Node.js', 'GraphQL', 'Redis', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'HoloDeck DevTools',
    tag: 'Developer Tool',
    desc: 'Immersive 3D debugging environment for distributed systems, with live traces rendered as interactive spatial graphs.',
    stack: ['Three.js', 'Rust', 'WebGL', 'gRPC'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    color: 'from-violet-600 to-indigo-500',
  },
  {
    title: 'FinPulse Analytics',
    tag: 'FinTech',
    desc: 'Institutional-grade analytics dashboard processing streaming market data with custom time-series DB and ML predictions.',
    stack: ['Next.js', 'Python', 'TimescaleDB', 'Kafka'],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    color: 'from-pink-500 to-purple-600',
  },
  {
    title: 'VoxelForge',
    tag: 'Creative Tool',
    desc: 'Browser-based collaborative voxel art editor with real-time sync, procedural generation, and one-click NFT minting.',
    stack: ['React', 'Three.js', 'Yjs', 'Solidity'],
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    color: 'from-emerald-500 to-cyan-500',
  },
  {
    title: 'Sentinel Cloud',
    tag: 'DevOps Platform',
    desc: 'Zero-config Kubernetes PaaS with auto-scaling, secrets management, and one-click preview deployments for every PR.',
    stack: ['Go', 'Kubernetes', 'Terraform', 'React'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    color: 'from-amber-500 to-rose-500',
  },
]

const TIMELINE = [
  {
    year: '2024 — Present',
    role: 'Principal Full Stack Engineer',
    org: 'Nebula Labs',
    location: 'Remote',
    desc: 'Leading architecture for a real-time AI collaboration platform. Built custom inference orchestration reducing latency by 68%.',
    icon: Briefcase,
  },
  {
    year: '2022 — 2024',
    role: 'Senior Software Engineer',
    org: 'Quantum Dynamics',
    location: 'San Francisco, CA',
    desc: 'Scaled commerce infrastructure from 500K to 10M daily requests. Shipped event-driven microservices on Kubernetes.',
    icon: Code2,
  },
  {
    year: '2020 — 2022',
    role: 'Full Stack Developer',
    org: 'Pixel Forge Studios',
    location: 'New York, NY',
    desc: 'Built interactive WebGL experiences for Fortune 500 clients. Pioneered the studio Three.js + React component library.',
    icon: Sparkles,
  },
  {
    year: '2018 — 2020',
    role: 'B.S. Computer Science',
    org: 'MIT',
    location: 'Cambridge, MA',
    desc: 'Graduated summa cum laude. Research in distributed systems and real-time rendering. Published in IEEE.',
    icon: GraduationCap,
  },
]

// Upwork icon (lucide doesn't ship one) — inline SVG that matches the stroke style
const UpworkIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M18.56 5.56c-2.3 0-4.14 1.5-4.88 3.88-1.12-1.64-1.96-3.6-2.45-5.44H8.16v6.62c-.01 1.3-1.06 2.35-2.36 2.35S3.43 11.92 3.44 10.62V4H1v6.62C1 13.28 3.16 15.47 5.8 15.47c2.64 0 4.8-2.19 4.8-4.85v-1.1c.46.89.98 1.79 1.61 2.57l-1.38 6.44h2.5l.99-4.65c.88.56 1.89.89 2.95.89C21.02 14.78 23 12.75 23 10.25c0-2.56-1.98-4.69-4.44-4.69zm0 6.85c-1.25 0-2.44-.55-3.38-1.41l.24-.96.01-.04c.21-1.22 1-3.18 3.13-3.18 1.25 0 2.26 1.04 2.26 2.32.01 1.28-1 2.27-2.26 2.27z" />
  </svg>
)

const SOCIALS = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: UpworkIcon, href: 'https://www.upwork.com', label: 'Upwork' },
  { icon: Mail, href: 'mailto:muneebmalik2468@gmail.com', label: 'Email' },
]

// ====== HELPERS ======
const Section = ({ id, className = '', children }) => (
  <section id={id} className={`relative py-24 md:py-32 px-6 md:px-10 ${className}`}>
    {children}
  </section>
)

const SectionTitle = ({ eyebrow, title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.7 }}
    className="text-center mb-16 md:mb-20"
  >
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-mono tracking-[0.3em] uppercase text-purple-300 mb-6">
      <Sparkles className="w-3.5 h-3.5" /> {eyebrow}
    </div>
    <h2 className="text-4xl md:text-6xl font-bold text-gradient mb-4">{title}</h2>
    {subtitle && <p className="text-lg text-white/60 max-w-2xl mx-auto">{subtitle}</p>}
  </motion.div>
)

// ====== MAIN APP ======
function App() {
  const [muted, setMuted] = useState(true)
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Observe active section for nav highlighting
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1))
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  // UI sound effects (Web Audio API, no external files) — only active when unmuted
  useEffect(() => {
    if (muted) return
    if (typeof window === 'undefined') return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()

    const blip = (freq, type = 'sine', dur = 0.08, vol = 0.06) => {
      try {
        if (ctx.state === 'suspended') ctx.resume()
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = type
        o.frequency.value = freq
        g.gain.value = 0
        const t = ctx.currentTime
        g.gain.linearRampToValueAtTime(vol, t + 0.005)
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
        o.connect(g).connect(ctx.destination)
        o.start(t)
        o.stop(t + dur)
      } catch (_) {}
    }

    const onClick = (e) => {
      if (e.target.closest('a, button, [role="button"]')) blip(880, 'triangle', 0.12, 0.08)
    }
    const onOver = (e) => {
      const el = e.target.closest('a, button, [role="button"]')
      if (!el || el.__sfx) return
      el.__sfx = true
      blip(1500, 'sine', 0.05, 0.025)
      setTimeout(() => { el.__sfx = false }, 260)
    }

    window.addEventListener('click', onClick)
    window.addEventListener('mouseover', onOver)
    // A subtle ping when sound is first enabled so users know it's working
    blip(660, 'sine', 0.18, 0.05)
    setTimeout(() => blip(990, 'sine', 0.18, 0.05), 120)

    return () => {
      window.removeEventListener('click', onClick)
      window.removeEventListener('mouseover', onOver)
      try { ctx.close() } catch (_) {}
    }
  }, [muted])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setFormState({ name: '', email: '', message: '' })
    }, 3200)
  }

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden">
      <LoadingScreen />
      <CustomCursor />

      {/* Global grid overlay */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/0 via-purple-950/10 to-black/60 pointer-events-none z-0" />

      {/* NAV */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="fixed top-4 inset-x-0 z-50 w-[95%] max-w-5xl mx-auto"
      >
        <div className="glass-strong rounded-full px-4 md:px-6 py-3 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-sm font-bold neon-glow">
              MM
            </div>
            <span className="hidden sm:block font-bold tracking-wide text-sm">Muneeb Malik</span>
          </a>
          <div className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-hover ${
                  active === n.href.slice(1)
                    ? 'text-white bg-gradient-to-r from-purple-600/40 to-cyan-500/40 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {n.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted((m) => !m)}
              className="w-9 h-9 rounded-full glass flex items-center justify-center hover:border-purple-400 transition-colors cursor-hover"
              aria-label="Toggle sound"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <a href="#contact" className="hidden sm:hidden md:block">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 border-0 rounded-full text-xs font-semibold neon-glow-hover">
                Hire Me
              </Button>
            </a>
            {/* Hamburger (mobile + tablet) */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden w-9 h-9 rounded-full glass flex items-center justify-center hover:border-cyan-400 transition-colors cursor-hover"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setMenuOpen(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute top-20 inset-x-0 mx-auto w-[92%] max-w-sm glass-strong rounded-3xl p-4 border border-purple-400/30"
              style={{ boxShadow: '0 0 40px rgba(168,85,247,0.25)' }}
            >
              <div className="flex flex-col gap-1">
                {NAV.map((n, i) => (
                  <motion.a
                    key={n.href}
                    href={n.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                      active === n.href.slice(1)
                        ? 'text-white bg-gradient-to-r from-purple-600/40 to-cyan-500/40'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{n.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-60" />
                  </motion.a>
                ))}
                <motion.a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl py-3 font-semibold text-sm neon-glow-hover"
                >
                  Hire Me <Send className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================= HERO ======================= */}
      {/* pt-32 (mobile) / pt-36 (desktop) ensures the fixed navbar (~76px from top) never overlaps hero content */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 md:pt-36 pb-16">
        <Scene3D />
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-mono tracking-[0.3em] uppercase text-cyan-300 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            Available for new projects
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.9 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.95] tracking-tight"
          >
            <span className="block text-white text-glow">MUNEEB</span>
            <span className="block text-gradient animate-gradient">MALIK</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-x-3 gap-y-2 text-sm md:text-base text-white/70 font-mono tracking-wider uppercase"
          >
            <span>Full Stack Developer</span>
            <span className="text-purple-400">/</span>
            <span>Software Engineer</span>
            <span className="text-cyan-400">/</span>
            <span>3D Web Architect</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.8 }}
            className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            I build immersive digital experiences at the intersection of{' '}
            <span className="text-gradient font-semibold">engineering</span> and{' '}
            <span className="text-gradient font-semibold">design</span>. Turning bold ideas into
            production-grade, beautifully crafted products.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.8 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <a href="#work">
              <Button size="lg" className="group relative bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 border-0 rounded-full px-8 py-6 text-base font-semibold neon-glow-hover transition-all">
                View My Work
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href="#contact">
              <Button size="lg" variant="outline" className="bg-white/5 hover:bg-white/10 border-purple-400/40 hover:border-cyan-400 rounded-full px-8 py-6 text-base font-semibold backdrop-blur">
                Contact
                <Send className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-6 md:gap-12 max-w-xl mx-auto"
          >
            {[
              { n: '6+', l: 'Years exp.' },
              { n: '40+', l: 'Projects shipped' },
              { n: '12M+', l: 'Users served' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient">{s.n}</div>
                <div className="text-xs text-white/50 font-mono mt-1 tracking-wider uppercase">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.a
          href="#about"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors z-10 cursor-hover"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.a>
      </section>

      {/* ======================= ABOUT ======================= */}
      <Section id="about">
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle eyebrow="About Me" title="Crafting digital futures" subtitle="A blend of engineer and artist, obsessed with shipping polished products." />
          <div className="grid md:grid-cols-5 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:col-span-2"
            >
              <div className="glass-strong rounded-3xl p-8 space-y-4 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/20 blur-3xl rounded-full" />
                <div className="relative">
                  <Award className="w-10 h-10 text-purple-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Hello, I&apos;m Alex</h3>
                  <p className="text-white/70 leading-relaxed text-sm">
                    A full-stack engineer with <span className="text-cyan-300 font-semibold">6+ years</span> shipping production systems
                    for startups and Fortune 500s. I&apos;m obsessed with the craft — from architecting distributed
                    backends to sweating the last pixel of a micro-interaction.
                  </p>
                  <p className="text-white/70 leading-relaxed text-sm mt-3">
                    I speak fluent TypeScript and Python, dream in React, and spend weekends building generative art
                    in WebGL.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-purple-300 mt-5 font-mono">
                    <MapPin className="w-3.5 h-3.5" /> San Francisco, CA — Remote-friendly
                  </div>
                  <a
                    href="/resume.pdf"
                    download="Muneeb-Malik-Resume.pdf"
                    className="mt-6 block"
                  >
                    <Button variant="outline" className="w-full rounded-full border-purple-400/40 bg-white/5 hover:bg-white/10 pointer-events-none">
                      <Download className="w-4 h-4 mr-2" /> Download Resume
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>

            <div className="md:col-span-3 grid sm:grid-cols-2 gap-4">
              {SKILLS.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group glass rounded-2xl p-5 border hover:border-purple-400/60 transition-all relative overflow-hidden cursor-hover"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/10 group-hover:to-cyan-500/10 transition-all" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/40 to-cyan-500/40 flex items-center justify-center border border-purple-400/30">
                        <s.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-mono text-cyan-300">{s.level}%</span>
                    </div>
                    <div className="font-semibold text-sm mb-2">{s.name}</div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: i * 0.08, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                        style={{ boxShadow: '0 0 10px rgba(168,85,247,0.7)' }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ======================= TECH STACK ======================= */}
      <Section id="stack">
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle eyebrow="Tech Arsenal" title="Tools I command" subtitle="The technologies I use to turn vision into reality." />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {STACK.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                whileHover={{ y: -6, rotateX: 8, rotateY: -8 }}
                style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                className="group glass rounded-2xl p-5 flex items-center gap-3 border hover:border-cyan-400/60 transition-all cursor-hover relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity blur-2xl"
                  style={{ background: `radial-gradient(circle at center, ${t.color}, transparent 70%)` }}
                />
                <div
                  className="relative w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${t.color}33, ${t.color}11)`,
                    border: `1px solid ${t.color}55`,
                    color: t.color,
                    boxShadow: `0 0 15px ${t.color}33`,
                  }}
                >
                  {t.name[0]}
                </div>
                <div className="relative">
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Expert</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ======================= PROJECTS ======================= */}
      <Section id="work">
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionTitle eyebrow="Selected Work" title="Featured projects" subtitle="A curated showcase of recent products built for ambitious teams." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.title} p={p} i={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ======================= TIMELINE ======================= */}
      <Section id="journey">
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionTitle eyebrow="My Journey" title="Experience timeline" subtitle="The milestones that shaped me as an engineer." />
          <div className="relative">
            {/* Central line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-cyan-400 to-transparent" style={{ boxShadow: '0 0 12px rgba(168,85,247,0.6)' }} />

            <div className="space-y-8">
              {TIMELINE.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7 }}
                  className="relative md:grid md:grid-cols-2 md:gap-8 items-center"
                >
                  {/* Content */}
                  <div className={`pl-12 md:pl-0 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12 md:col-start-2'}`}>
                    <div className="glass-strong rounded-2xl p-6 hover:border-purple-400/60 transition-all">
                      <div className="text-xs font-mono tracking-widest uppercase text-cyan-300 mb-2">{t.year}</div>
                      <h3 className="text-xl font-bold mb-1">{t.role}</h3>
                      <div className="text-purple-300 text-sm font-medium mb-2">{t.org} · {t.location}</div>
                      <p className="text-white/60 text-sm leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 w-8 h-8 rounded-full bg-black border-2 border-purple-500 flex items-center justify-center neon-glow">
                    <t.icon className="w-4 h-4 text-cyan-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ======================= CONTACT ======================= */}
      <Section id="contact">
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionTitle eyebrow="Get in Touch" title="Let's build something" subtitle="Have a project in mind or just want to say hi? My inbox is always open." />
          <div className="grid md:grid-cols-5 gap-6">
            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:col-span-2 glass-strong rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/30 blur-3xl rounded-full animate-pulse-glow" />
              <div className="relative space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Let&apos;s talk</h3>
                  <p className="text-white/60 text-sm">Open to full-time, freelance & advisory roles.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-lg glass flex items-center justify-center"><Mail className="w-4 h-4 text-cyan-300" /></div>
                    <span className="text-white/80">muneebmalik2468@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-lg glass flex items-center justify-center"><MapPin className="w-4 h-4 text-purple-300" /></div>
                    <span className="text-white/80">San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-lg glass flex items-center justify-center"><Zap className="w-4 h-4 text-yellow-300" /></div>
                    <span className="text-white/80">Replies within 24 hours</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs font-mono uppercase tracking-[0.3em] text-white/50 mb-3">Find me on</div>
                  <div className="flex gap-3">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        className="w-11 h-11 rounded-xl glass hover:border-cyan-400 hover:text-cyan-300 transition-all flex items-center justify-center hover:scale-110 cursor-hover"
                      >
                        <s.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              onSubmit={handleSubmit}
              className="md:col-span-3 glass-strong rounded-3xl p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-white/50 mb-2 block">Name</label>
                  <Input
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="bg-white/5 border-white/10 focus-visible:ring-purple-500 focus-visible:border-purple-400 h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-white/50 mb-2 block">Email</label>
                  <Input
                    required
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="bg-white/5 border-white/10 focus-visible:ring-purple-500 focus-visible:border-purple-400 h-12 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-white/50 mb-2 block">Message</label>
                <Textarea
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  rows={6}
                  className="bg-white/5 border-white/10 focus-visible:ring-purple-500 focus-visible:border-purple-400 rounded-xl resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={sent}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 border-0 font-semibold text-base neon-glow-hover"
              >
                {sent ? (
                  <span className="flex items-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">✨</motion.span>
                    Message Sent Successfully
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Message <Send className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </motion.form>
          </div>
        </div>
      </Section>

      {/* ======================= FOOTER ======================= */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-sm font-bold">MM</div>
            <div>
              <div className="font-bold text-sm">Muneeb Malik</div>
              <div className="text-xs text-white/40 font-mono">Full Stack Developer</div>
            </div>
          </div>
          <div className="text-xs text-white/40 font-mono">
            © {new Date().getFullYear()} — Crafted with <span className="text-purple-400">♥</span> and way too much coffee.
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> All systems operational
          </div>
        </div>
      </footer>
    </main>
  )
}

// ====== Project Card with 3D tilt hover ======
function ProjectCard({ p, i }) {
  const ref = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rx = ((y / rect.height) - 0.5) * -14
    const ry = ((x / rect.width) - 0.5) * 14
    setRotate({ x: rx, y: ry })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.25s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="group relative glass-strong rounded-3xl overflow-hidden cursor-hover"
    >
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-60 mix-blend-overlay z-10`} />
        <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-black/50 backdrop-blur border border-purple-400/40 text-purple-200 font-mono text-[10px] uppercase tracking-widest">
            {p.tag}
          </Badge>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold group-hover:text-gradient transition-colors">{p.title}</h3>
        <p className="text-sm text-white/60 leading-relaxed line-clamp-3">{p.desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span key={s} className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-white/70">
              {s}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
          <a href="#" className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 font-mono cursor-hover">
            <ExternalLink className="w-3.5 h-3.5" /> Live Demo
          </a>
          <a href="#" className="text-xs text-purple-300 hover:text-white flex items-center gap-1 font-mono cursor-hover">
            <Github className="w-3.5 h-3.5" /> Source
          </a>
        </div>
      </div>
      {/* Neon border glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: 'inset 0 0 0 1px rgba(168,85,247,0.5), 0 0 40px rgba(168,85,247,0.3)' }} />
    </motion.div>
  )
}

export default App
