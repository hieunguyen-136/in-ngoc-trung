import Link from 'next/link'
import type { Metadata } from 'next'
import { messengerUrl, zaloUrl, telUrl } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Dịch vụ in ấn — In Ngọc Trung',
  description: 'Danh thiếp, banner, catalogue, tem nhãn, giftnail, menu, thiệp cưới',
}

const services = [
  {
    name: 'Danh thiếp',
    desc: 'Thiết kế & in danh thiếp cao cấp, nhiều chất liệu lựa chọn',
    icon: (
      <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="6" y1="15" x2="10" y2="15" />
      </svg>
    ),
    href: null,
  },
  {
    name: 'Banner · Hiflex',
    desc: 'In banner, hiflex khổ lớn, màu sắc tươi sáng, bền bỉ',
    icon: (
      <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    href: null,
  },
  {
    name: 'Catalogue · Tờ rơi',
    desc: 'In catalogue, tờ rơi, brochure chuyên nghiệp',
    icon: (
      <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    href: null,
  },
  {
    name: 'Tem nhãn · Sticker',
    desc: 'Tem nhãn, sticker, decal theo yêu cầu',
    icon: (
      <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    href: null,
  },
  {
    name: 'Giftnail',
    desc: 'In ấn móng tay quà tặng độc đáo',
    icon: (
      <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
    href: null,
  },
  {
    name: 'Menu',
    desc: 'Thiết kế & in menu nhà hàng, café sang trọng',
    icon: (
      <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    href: null,
  },
  {
    name: 'Thiệp cưới',
    desc: 'Thiệp cưới cao cấp, nhiều mẫu đẹp, giao nhanh',
    icon: (
      <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    href: '/thiep-cuoi',
  },
]

export default function DichVuPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-8 py-16 md:py-24">
      {/* Page Header */}
      <div className="text-center mb-14">
        <p className="text-pink-500 text-[12px] uppercase tracking-[0.28em] mb-3 font-medium">
          DỊCH VỤ IN ẤN
        </p>
        <h1
          className="font-display font-light text-gray-900"
          style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
        >
          Chúng tôi in gì?
        </h1>
        <p className="text-gray-400 text-[15px] mt-3">
          Chất lượng cao · Giao nhanh · Giá tốt
        </p>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => {
          const cardInner = (
            <div className="bg-white border border-pink-100 rounded-2xl p-6 shadow-card hover:shadow-hover hover:border-pink-300 transition-all duration-300 text-center h-full">
              <div className="w-12 h-12 bg-blush rounded-full flex items-center justify-center mx-auto mb-4 text-pink-400">
                {service.icon}
              </div>
              <h2 className="font-medium text-gray-900 text-[15px] mb-2">{service.name}</h2>
              <p className="text-[13.5px] text-gray-500 leading-relaxed">{service.desc}</p>
            </div>
          )

          if (service.href) {
            return (
              <Link key={service.name} href={service.href} className="block">
                {cardInner}
              </Link>
            )
          }

          return (
            <div key={service.name}>
              {cardInner}
            </div>
          )
        })}
      </div>

      {/* CTA Banner */}
      <div className="bg-blush rounded-2xl p-12 text-center mt-16">
        <h2 className="font-display font-light text-gray-900 text-[28px]">
          Liên hệ ngay để được tư vấn miễn phí
        </h2>
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          {/* Messenger */}
          <Link
            href={messengerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-full h-12 px-6 font-medium text-[14.5px] hover:-translate-y-0.5 transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.145 2 11.25c0 2.84 1.282 5.38 3.32 7.12V22l3.03-1.67c.81.225 1.668.347 2.65.347 5.523 0 10-4.145 10-9.25S17.523 2 12 2zm1.03 12.47L10.5 11.8 5.56 14.47l5.44-5.78 2.56 2.67 4.92-2.67-5.45 5.78z"/>
            </svg>
            Messenger
          </Link>

          {/* Zalo */}
          <Link
            href={zaloUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-full h-12 px-6 font-medium text-[14.5px] hover:-translate-y-0.5 transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.01 15.38c-.74 0-1.43-.29-1.95-.82l-.14-.15c-.08-.08-.19-.12-.3-.12a.44.44 0 0 0-.3.12l-.87.87c-.5.5-1.33.48-1.83-.02L11.7 12.3c-.5-.5-.52-1.32-.02-1.83l.87-.87c.16-.16.16-.44 0-.6l-.15-.14a2.74 2.74 0 0 1-.82-1.95c0-1.52 1.23-2.75 2.75-2.75.74 0 1.43.29 1.95.82l3.55 3.55c.53.52.82 1.21.82 1.95 0 1.52-1.23 2.9-2.64 2.9zm-8.32 4.87C7.52 20.25 4 16.73 4 12.5c0-4.23 3.52-7.75 7.75-7.75 1.1 0 2.14.23 3.08.64L13.2 7.02A5.7 5.7 0 0 0 11.75 6.75c-3.17 0-5.75 2.58-5.75 5.75s2.58 5.75 5.75 5.75c.44 0 .87-.05 1.28-.14l1.63 1.63c-.94.41-1.98.64-3.07.64-.3 0-.6-.02-.9-.05z"/>
            </svg>
            Zalo
          </Link>

          {/* Gọi ngay */}
          <Link
            href={telUrl()}
            className="inline-flex items-center gap-2 bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-full h-12 px-6 font-medium text-[14.5px] hover:-translate-y-0.5 transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            Gọi ngay
          </Link>
        </div>
      </div>
    </div>
  )
}
