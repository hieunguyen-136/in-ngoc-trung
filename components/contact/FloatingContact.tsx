import Link from 'next/link'
import { messengerUrl, zaloUrl, telUrl } from '@/lib/types'

const FABS = [
  {
    label: 'Messenger',
    href: messengerUrl,
    bg: '#1877f2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.921 1.466 5.53 3.757 7.24V22l3.405-1.869C10.172 20.37 11.07 20.5 12 20.5c5.523 0 10-4.145 10-9.257C22 6.145 17.523 2 12 2zm1.072 12.468l-2.548-2.714-4.97 2.714 5.467-5.8 2.612 2.714 4.905-2.714-5.466 5.8z"/>
      </svg>
    ),
  },
  {
    label: 'Zalo',
    href: zaloUrl,
    bg: '#0ea5e9',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
        <path d="M12.5 2C7.25 2 3 6.03 3 11c0 2.67 1.22 5.06 3.14 6.72L5.5 21l3.57-1.78C10.18 19.7 11.32 20 12.5 20c5.25 0 9.5-4.03 9.5-9S17.75 2 12.5 2zm-2 12.5H9v-5h1.5v5zm2.75 0h-1.5v-5h1.5v5zm2.75 0H14.5v-5H16v5z"/>
      </svg>
    ),
  },
  {
    label: 'Gọi ngay',
    href: telUrl,
    bg: 'linear-gradient(135deg, #f472b6, #ec4899)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
      </svg>
    ),
  },
]

export function FloatingContact() {
  return (
    <div className="fixed right-[22px] bottom-[22px] z-50 flex flex-col gap-3">
      {FABS.map(({ label, href, bg, icon }) => (
        <div key={label} className="relative group">
          <Link
            href={href()}
            style={{ background: bg, boxShadow: '0 10px 24px -8px rgba(17,24,39,.4)' }}
            className="flex items-center justify-center w-[54px] h-[54px] rounded-full text-white transition-transform duration-200 hover:scale-110"
            aria-label={label}
          >
            {icon}
          </Link>
          {/* Tooltip */}
          <span className="absolute right-[64px] top-1/2 -translate-y-1/2 bg-gray-900 text-white text-[12px] px-[11px] py-[6px] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
