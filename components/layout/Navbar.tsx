'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ' },
  { href: '/dich-vu', label: 'Dịch vụ' },
  { href: '/thiep-cuoi', label: 'Thiệp cưới' },
  { href: '/lien-he', label: 'Liên hệ' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header style={{ height: 76 }} className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
      <div className="max-w-[1200px] mx-auto px-8 h-full flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="font-sans font-semibold text-[17px] text-pink-500 uppercase tracking-[0.26em] whitespace-nowrap">
          IN NGỌC <span className="text-pink-700 font-bold">TRUNG</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-[38px]">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative text-[14.5px] tracking-[0.04em] pb-1 transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:bg-pink-500 after:transition-all after:duration-200 ${
                  active
                    ? 'text-pink-600 after:w-full'
                    : 'text-gray-600 hover:text-pink-600 after:w-0 hover:after:w-full'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Hamburger */}
        <button
          className="flex md:hidden items-center justify-center w-[42px] h-[42px] border border-pink-100 rounded-xl bg-white"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
        >
          <span className="block w-[18px] h-[1.5px] bg-gray-700 relative before:content-[''] before:absolute before:left-0 before:top-[-5px] before:w-[18px] before:h-[1.5px] before:bg-gray-700 after:content-[''] after:absolute after:left-0 after:top-[5px] after:w-[18px] after:h-[1.5px] after:bg-gray-700" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden absolute left-0 right-0 bg-white/95 backdrop-blur-md border-b border-pink-100 px-[22px] pb-5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block py-3 text-base border-b border-pink-50 last:border-0 ${
                pathname === href ? 'text-pink-600' : 'text-gray-600'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
