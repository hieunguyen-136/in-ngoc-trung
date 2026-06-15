import Link from 'next/link'

export function Footer() {
  const phone = process.env.NEXT_PUBLIC_PHONE ?? '0909000000'

  return (
    <footer className="border-t border-pink-100 bg-white mt-6 pt-[72px] pb-10">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="grid gap-12" style={{ gridTemplateColumns: '1.4fr 1fr 1.2fr' }}>
          {/* Brand */}
          <div>
            <Link href="/" className="font-sans font-semibold text-[16px] text-pink-500 uppercase tracking-[0.26em] mb-4 inline-block">
              IN NGỌC <span className="text-pink-700 font-bold">TRUNG</span>
            </Link>
            <p className="text-[14.5px] text-gray-500 leading-relaxed max-w-[34ch]">
              Chuyên in ấn chất lượng cao — Danh thiếp, Banner, Thiệp cưới, Catalogue, Tem nhãn, Giftnail, Menu.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-gray-900 mb-5">Liên kết</h4>
            <ul className="grid gap-3">
              {[
                { href: '/dich-vu', label: 'Dịch vụ' },
                { href: '/thiep-cuoi', label: 'Thiệp cưới' },
                { href: '/lien-he', label: 'Liên hệ' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[14.5px] text-gray-500 hover:text-pink-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-gray-900 mb-5">Liên hệ</h4>
            <div className="text-[14.5px] text-gray-500 grid gap-2">
              <span>📍 [Địa chỉ tiệm In Ngọc Trung]</span>
              <span>📞 <b className="text-gray-700 font-semibold">{phone}</b></span>
              <span>🕐 7:00 – 20:00 (Thứ 2 – CN)</span>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-7 border-t border-gray-100 flex justify-between flex-wrap gap-3 text-[13px] text-gray-400">
          <span>© {new Date().getFullYear()} In Ngọc Trung. All rights reserved.</span>
          <span>Thiết kế bởi Claude</span>
        </div>
      </div>
    </footer>
  )
}
