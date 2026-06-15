'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/data'
import { CATEGORIES, formatVND } from '@/lib/types'

const PAGE_SIZE = 8

export default function ThiepCuoiPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered =
    activeCategory === 'Tất cả'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.cat === activeCategory)

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="pt-16 pb-10 text-center px-4">
        <p
          className="text-pink-500 font-medium uppercase tracking-[0.28em] text-[12px] mb-4"
        >
          BỘ SƯU TẬP 2026
        </p>
        <h1
          className="font-display font-light text-gray-900"
          style={{ fontSize: 'clamp(36px, 6vw, 60px)', lineHeight: 1.1 }}
        >
          Thiệp Cưới
        </h1>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap justify-center gap-2 px-4 pb-10">
        {[...CATEGORIES].map((cat) => {
          const isActive = cat === activeCategory
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={
                isActive
                  ? 'h-[36px] px-5 rounded-full text-[13.5px] font-medium text-white transition-all'
                  : 'h-[36px] px-5 rounded-full text-[13.5px] font-medium bg-white border border-gray-200 text-gray-700 transition-all hover:border-pink-400 hover:text-pink-600'
              }
              style={
                isActive
                  ? { background: 'linear-gradient(135deg, #f472b6, #ec4899)' }
                  : undefined
              }
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {paged.map((product) => (
            <Link
              key={product.code}
              href={`/thiep-cuoi/${product.code}`}
              className="group block rounded-2xl border border-pink-100 hover:border-pink-300 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] bg-white overflow-hidden"
            >
              {/* Image Placeholder */}
              <div className="aspect-[3/4] bg-pink-50 rounded-2xl flex items-center justify-center text-5xl text-pink-200 overflow-hidden relative">
                💍
                {product.status === 'out' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                      Hết hàng
                    </span>
                  </div>
                )}
              </div>

              {/* Card Info */}
              <div className="p-3">
                <p className="text-[12px] text-pink-500 font-medium mt-3">
                  {product.code}
                </p>
                <p className="font-display font-[500] text-gray-900 text-[15px] leading-tight mt-1">
                  {product.name}
                </p>
                <p className="text-[12px] text-gray-400 mt-1">
                  {product.size} · {product.cat}
                </p>
                <p className="text-[14px] font-semibold text-pink-500 mt-2">
                  {formatVND(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isCurrentPage = page === currentPage
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={
                    isCurrentPage
                      ? 'w-10 h-10 rounded-full text-white text-sm font-medium transition-all'
                      : 'w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium transition-all hover:border-pink-400'
                  }
                  style={
                    isCurrentPage
                      ? { background: 'linear-gradient(135deg, #f472b6, #ec4899)' }
                      : undefined
                  }
                >
                  {page}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
