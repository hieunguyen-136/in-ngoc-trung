import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Catalog Thiệp Cưới — In Ngọc Trung',
  description: '12 mẫu thiệp cưới sang trọng, hiện đại, truyền thống',
}

export default function ThiepCuoiLayout({ children }: { children: ReactNode }) {
  return children
}
