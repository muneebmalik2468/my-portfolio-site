import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Muneeb Malik — Full Stack Developer & Software Engineer',
  description: 'Futuristic 3D portfolio of Muneeb Malik — Full Stack Developer crafting immersive digital experiences with React, Node.js, and cutting-edge web technology.',
  keywords: 'Muneeb Malik, Full Stack Developer, Software Engineer, React, Next.js, Three.js, Portfolio, Web Developer',
  authors: [{ name: 'Muneeb Malik' }],
  openGraph: {
    title: 'Muneeb Malik — Full Stack Developer',
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
