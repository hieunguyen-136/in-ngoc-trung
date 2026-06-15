import Link from 'next/link'
import type { Metadata } from 'next'
import { CONTACT, messengerUrl, zaloUrl, telUrl } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Liên hệ — In Ngọc Trung',
  description: 'Địa chỉ, số điện thoại và giờ làm việc của In Ngọc Trung',
}

export default function LienHePage() {
  return (
    <div className="max-w-[1200px] mx-auto px-8 py-16 md:py-24">
      {/* Page Header */}
      <div className="text-center">
        <p className="text-pink-500 text-[12px] uppercase tracking-[0.28em] mb-3 font-medium">
          LIÊN HỆ
        </p>
        <h1
          className="font-display font-light text-gray-900"
          style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
        >
          Tìm chúng tôi
        </h1>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        {/* Left column — Contact info */}
        <div>
          <h2 className="font-sans font-semibold text-gray-900 text-lg mb-6">
            Thông tin liên hệ
          </h2>

          {/* Address */}
          <div className="flex gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center flex-shrink-0 text-pink-500">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-[13px] mb-0.5">Địa chỉ</p>
              <p className="text-gray-700 text-[14.5px]">
                {CONTACT.address}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center flex-shrink-0 text-pink-500">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.45 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.1-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-[13px] mb-0.5">Điện thoại</p>
              <Link
                href={telUrl()}
                className="text-gray-700 text-[14.5px] hover:text-pink-500 transition-colors"
              >
                {CONTACT.phone}
              </Link>
            </div>
          </div>

          {/* Hours */}
          <div className="flex gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center flex-shrink-0 text-pink-500">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-[13px] mb-0.5">Giờ làm việc</p>
              <p className="text-gray-700 text-[14.5px]">Thứ 2 – Thứ 7: 8:00 – 18:00</p>
            </div>
          </div>

          <div className="border-t border-pink-100 my-8" />

          <h2 className="font-sans font-semibold text-gray-900 text-lg mb-4">
            Kết nối với chúng tôi
          </h2>

          <div className="flex flex-wrap gap-3">
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

        {/* Right column — Map */}
        <div className="bg-blush rounded-2xl overflow-hidden" style={{ minHeight: '400px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125425.1754614596!2d106.60980309179686!3d10.773374399999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c2ee5!2zSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '400px' }}
            sandbox="allow-scripts allow-same-origin allow-fullscreen"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ In Ngọc Trung"
          />
        </div>
      </div>
    </div>
  )
}
