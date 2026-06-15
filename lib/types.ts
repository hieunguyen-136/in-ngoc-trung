// lib/types.ts

export type ProductStatus = 'in' | 'out'

export interface Product {
  code: string
  name: string
  size: string
  price: number        // VND integer
  cat: string
  status: ProductStatus
  desc: string
}

export const CATEGORIES = ['Tất cả', 'Sang trọng', 'Hiện đại', 'Truyền thống', 'Tối giản', 'Vintage'] as const
export type Category = typeof CATEGORIES[number]

export function formatVND(n: number): string {
  return n.toLocaleString('vi-VN') + 'đ'
}

export const CONTACT = {
  phone: process.env.NEXT_PUBLIC_PHONE ?? '0909000000',
  zalo:  process.env.NEXT_PUBLIC_ZALO_PHONE ?? '0909000000',
  messenger: process.env.NEXT_PUBLIC_MESSENGER_PAGE_ID ?? 'inngoctrung',
  address: process.env.NEXT_PUBLIC_ADDRESS ?? '123 Đường ABC, Phường XYZ, TP. Hồ Chí Minh',
} as const

export function messengerUrl(): string {
  return `https://m.me/${CONTACT.messenger}`
}
export function zaloUrl(): string {
  return `https://zalo.me/${CONTACT.zalo}`
}
export function telUrl(): string {
  return `tel:${CONTACT.phone}`
}
