import { HeroSection } from '@/components/home/HeroSection'
import { ServicesGrid } from '@/components/home/ServicesGrid'
import { CtaBanner } from '@/components/home/CtaBanner'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'In Ngọc Trung — In ấn chuyên nghiệp',
  description: 'Tiệm in ấn In Ngọc Trung — Danh thiếp, Banner, Thiệp cưới, Catalogue, Tem nhãn, Giftnail, Menu.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <CtaBanner />
    </>
  )
}
