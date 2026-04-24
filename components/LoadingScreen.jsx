'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let p = 0
    const id = setInterval(() => {
      p += Math.random() * 18 + 4
      if (p >= 100) {
        p = 100
        clearInterval(id)
        setTimeout(() => setLoading(false), 450)
      }
      setProgress(Math.min(p, 100))
    }, 120)
    return () => clearInterval(id)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7 } }}
          className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center"
        >
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-black to-blue-950/30" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 flex flex-col items-center gap-8"
          >
            <div className="relative w-24 h-24">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-purple-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ boxShadow: '0 0 30px rgba(168,85,247,0.6)' }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-cyan-400 border-dashed"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gradient">MM</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm tracking-[0.4em] text-purple-300 uppercase mb-2">Initializing</div>
              <div className="text-3xl font-bold text-gradient">Portfolio System</div>
            </div>

            <div className="w-72 md:w-96">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between text-xs mt-2 text-purple-300/70 font-mono">
                <span>LOADING ASSETS</span>
                <span>{Math.floor(progress)}%</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
