import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductByCode } from '@/lib/data'
import { formatVND, messengerUrl, zaloUrl, telUrl } from '@/lib/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const product = getProductByCode(code)
  return {
    title: product ? `${product.name} — In Ngọc Trung` : 'Không tìm thấy',
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const product = getProductByCode(code)

  if (!product) {
    notFound()
  }

  const isInStock = product.status === 'in'

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-8 py-12 md:py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-gray-400 mb-8">
          <Link href="/" className="hover:text-pink-500 transition-colors">
            Trang chủ
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/thiep-cuoi" className="hover:text-pink-500 transition-colors">
            Thiệp cưới
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mt-8">
          {/* Left: Image */}
          <div className="sticky top-[96px] self-start">
            <div
              className="aspect-[3/4] bg-blush rounded-2xl flex items-center justify-center overflow-hidden"
              style={{ fontSize: 'clamp(64px, 10vw, 120px)' }}
            >
              <span aria-hidden="true">💍</span>
            </div>
          </div>

          {/* Right: Details */}
          <div>
            {/* Category badge */}
            <span className="inline-block bg-pink-100 text-pink-700 text-[12px] font-medium px-3 py-1 rounded-full">
              {product.cat}
            </span>

            {/* Product name */}
            <h1
              className="font-display font-[300] text-gray-900 mt-4 leading-tight"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
            >
              {product.name}
            </h1>

            {/* Product code */}
            <p className="text-[13px] text-pink-500 font-medium mt-2">
              {product.code}
            </p>

            {/* Price */}
            <p
              className="font-display text-pink-500 mt-4 font-light"
              style={{ fontSize: 'clamp(32px, 4vw, 40px)' }}
            >
              {formatVND(product.price)}
            </p>

            {/* Divider */}
            <div className="border-t border-pink-100 my-6" />

            {/* Specs table */}
            <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 text-[14px]">
              <dt className="text-gray-400 font-medium">Kích thước</dt>
              <dd className="text-gray-700">{product.size}</dd>

              <dt className="text-gray-400 font-medium">Số lượng tối thiểu</dt>
              <dd className="text-gray-700">50 cái</dd>

              <dt className="text-gray-400 font-medium">Danh mục</dt>
              <dd className="text-gray-700">{product.cat}</dd>

              <dt className="text-gray-400 font-medium">Trạng thái</dt>
              <dd>
                <span
                  className={[
                    'inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium',
                    isInStock
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'w-1.5 h-1.5 rounded-full inline-block mr-1.5',
                      isInStock ? 'bg-green-500' : 'bg-red-500',
                    ].join(' ')}
                  />
                  {isInStock ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </dd>
            </dl>

            {/* Description */}
            <p className="text-[14px] text-gray-500 leading-relaxed mt-6">
              {product.desc}
            </p>

            {/* Divider */}
            <div className="border-t border-pink-100 my-6" />

            {/* Contact label */}
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
              LIÊN HỆ ĐỂ ĐẶT HÀNG
            </p>

            {/* Contact buttons */}
            <div className="flex flex-col gap-3">
              {/* Messenger */}
              <a
                href={messengerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full h-12 px-6 font-medium text-[14px] text-white bg-messenger transition-opacity hover:opacity-90"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Nhắn tin Messenger
              </a>

              {/* Zalo */}
              <a
                href={zaloUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full h-12 px-6 font-medium text-[14px] text-white bg-zalo transition-opacity hover:opacity-90"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Nhắn tin Zalo
              </a>

              {/* Gọi ngay */}
              <a
                href={telUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full h-12 px-6 font-medium text-[14px] text-white transition-opacity hover:opacity-90"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-pink-400), var(--color-pink-500))',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.45 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.1-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Gọi ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
