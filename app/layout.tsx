import type { Metadata } from 'next'
import { Inter, Cormorant } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'In Ngọc Trung — In ấn chuyên nghiệp',
  description: 'Tiệm in ấn In Ngọc Trung — Danh thiếp, Banner, Thiệp cưới, Catalogue, Tem nhãn, Giftnail, Menu.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  )
}
