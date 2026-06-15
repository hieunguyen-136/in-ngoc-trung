import Link from 'next/link'

const services = [
  {
    emoji: '💳',
    name: 'Danh thiếp',
    desc: 'In name card sang trọng, sắc nét, đa chất liệu',
    href: null,
  },
  {
    emoji: '🪟',
    name: 'Banner · Hiflex',
    desc: 'In khổ lớn cho sự kiện, khai trương, quảng cáo',
    href: null,
  },
  {
    emoji: '📋',
    name: 'Catalogue · Tờ rơi',
    desc: 'In ấn tài liệu marketing, brochure chuyên nghiệp',
    href: null,
  },
  {
    emoji: '🏷️',
    name: 'Tem nhãn · Sticker',
    desc: 'In decal, sticker theo yêu cầu, đa chất liệu',
    href: null,
  },
  {
    emoji: '💅',
    name: 'Giftnail',
    desc: 'In móng tay thời trang, quà tặng độc đáo',
    href: null,
  },
  {
    emoji: '🍽️',
    name: 'Menu',
    desc: 'In menu nhà hàng, quán cafe, laminate chống nước',
    href: null,
  },
  {
    emoji: '💍',
    name: 'Thiệp cưới',
    desc: 'Trăm mẫu sang trọng, tư vấn tận tình',
    href: '/thiep-cuoi',
  },
]

function ServiceCard({ emoji, name, desc }: { emoji: string; name: string; desc: string }) {
  return (
    <div className="bg-white border border-pink-100 rounded-2xl p-6 text-center hover:border-pink-400 hover:shadow-hover transition-all duration-200 cursor-pointer">
      <div className="text-3xl mb-3">{emoji}</div>
      <p className="font-sans font-medium text-gray-800 mb-1">{name}</p>
      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
    </div>
  )
}

export function ServicesGrid() {
  return (
    <section
      className="px-4"
      style={{ paddingTop: 'clamp(72px, 11vw, 132px)', paddingBottom: 'clamp(72px, 11vw, 132px)' }}
    >
      {/* Section header */}
      <div className="text-center mx-auto mb-12" style={{ maxWidth: '640px' }}>
        <p
          className="font-sans font-semibold uppercase text-pink-500"
          style={{ fontSize: '12px', letterSpacing: '0.28em', marginBottom: '12px' }}
        >
          DỊCH VỤ
        </p>
        <h2
          className="font-display font-light text-gray-900"
          style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '0.01em' }}
        >
          Chúng tôi in gì?
        </h2>
        <p className="font-sans font-light text-gray-500 mt-3 text-base leading-relaxed">
          Đa dạng sản phẩm in ấn chất lượng cao, phục vụ mọi nhu cầu cá nhân và doanh nghiệp
        </p>
      </div>

      {/* Grid */}
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ maxWidth: '1120px' }}>
        {services.map((s) =>
          s.href ? (
            <Link key={s.name} href={s.href} className="block">
              <ServiceCard emoji={s.emoji} name={s.name} desc={s.desc} />
            </Link>
          ) : (
            <ServiceCard key={s.name} emoji={s.emoji} name={s.name} desc={s.desc} />
          )
        )}
      </div>
    </section>
  )
}
