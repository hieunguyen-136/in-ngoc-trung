import Link from 'next/link'
import { messengerUrl, zaloUrl, telUrl } from '@/lib/types'

export function CtaBanner() {
  return (
    <section className="px-4 pb-20">
      <div
        className="mx-auto bg-pink-50 rounded-2xl text-center px-8 py-16"
        style={{ maxWidth: '1120px' }}
      >
        <h2
          className="font-display font-light text-gray-900"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.01em' }}
        >
          Liên hệ ngay để được tư vấn miễn phí
        </h2>
        <p className="font-sans font-light text-gray-500 mt-3 text-base">
          Đội ngũ In Ngọc Trung luôn sẵn sàng hỗ trợ bạn 24/7
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-[14px] justify-center mt-10">
          {/* Messenger */}
          <Link
            href={messengerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-messenger text-white rounded-full h-[52px] px-7 gap-[9px] font-medium text-[14.5px] hover:-translate-y-0.5 transition-transform"
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
            className="inline-flex items-center bg-zalo text-white rounded-full h-[52px] px-7 gap-[9px] font-medium text-[14.5px] hover:-translate-y-0.5 transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.01 15.38c-.74 0-1.43-.29-1.95-.82l-.14-.15c-.08-.08-.19-.12-.3-.12a.44.44 0 0 0-.3.12l-.87.87c-.5.5-1.33.48-1.83-.02L11.7 12.3c-.5-.5-.52-1.32-.02-1.83l.87-.87c.16-.16.16-.44 0-.6l-.15-.14a2.74 2.74 0 0 1-.82-1.95c0-1.52 1.23-2.75 2.75-2.75.74 0 1.43.29 1.95.82l3.55 3.55c.53.52.82 1.21.82 1.95 0 1.52-1.23 2.9-2.64 2.9zm-8.32 4.87C7.52 20.25 4 16.73 4 12.5c0-4.23 3.52-7.75 7.75-7.75 1.1 0 2.14.23 3.08.64L13.2 7.02A5.7 5.7 0 0 0 11.75 6.75c-3.17 0-5.75 2.58-5.75 5.75s2.58 5.75 5.75 5.75c.44 0 .87-.05 1.28-.14l1.63 1.63c-.94.41-1.98.64-3.07.64-.3 0-.6-.02-.9-.05z"/>
            </svg>
            Zalo
          </Link>

          {/* Gọi ngay */}
          <Link
            href={telUrl()}
            className="inline-flex items-center bg-gradient-to-br from-pink-400 to-pink-500 text-white rounded-full h-[52px] px-7 gap-[9px] font-medium text-[14.5px] hover:-translate-y-0.5 transition-transform"
            style={{ boxShadow: '0 8px 20px -8px rgba(236,72,153,.6)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            Gọi ngay
          </Link>
        </div>
      </div>
    </section>
  )
}
