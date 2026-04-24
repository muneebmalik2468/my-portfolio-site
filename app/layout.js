import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Alex Carter — Full Stack Developer & Software Engineer',
  description: 'Futuristic 3D portfolio of Alex Carter — Full Stack Developer crafting immersive digital experiences with React, Node.js, and cutting-edge web technology.',
  keywords: 'Full Stack Developer, Software Engineer, React, Next.js, Three.js, Portfolio, Web Developer',
  authors: [{ name: 'Alex Carter' }],
  openGraph: {
    title: 'Alex Carter — Full Stack Developer',
    description: 'Futuristic 3D portfolio showcasing modern web development.',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
