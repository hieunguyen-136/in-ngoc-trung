'use client'

import { useState, FormEvent } from 'react'
import { PRODUCTS } from '@/lib/data'
import { CATEGORIES, formatVND } from '@/lib/types'

type AdminView = 'dashboard' | 'categories'

/* ─────────────────────────────────────────────
   Login View
───────────────────────────────────────────── */
function LoginView({
  onLogin,
  email,
  setEmail,
  password,
  setPassword,
}: {
  onLogin: () => void
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
}) {
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập email và mật khẩu.')
      return
    }
    setError('')
    onLogin()
  }

  return (
    <div className="min-h-screen bg-blush flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-soft p-10 w-full max-w-[400px]">
        {/* Logo */}
        <p className="font-sans text-pink-500 uppercase tracking-widest text-sm font-semibold text-center mb-2">
          IN NGỌC TRUNG
        </p>

        {/* Title */}
        <h2 className="font-display text-3xl text-gray-800 text-center mb-8">
          Quản trị
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm text-gray-600 mb-1"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@inngoctrung.vn"
              className="rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:outline-none px-4 py-3 w-full text-gray-800 placeholder-gray-300"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm text-gray-600 mb-1"
            >
              Mật khẩu
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:outline-none px-4 py-3 w-full text-gray-800 placeholder-gray-300"
            />
          </div>

          {/* Inline error */}
          {error && (
            <p role="alert" className="text-red-500 text-sm">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 text-white font-sans font-medium tracking-wide hover:from-pink-500 hover:to-pink-700 transition-all mt-2"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Product Table (shared between dashboard & products page)
───────────────────────────────────────────── */
function ProductTable() {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th
              scope="col"
              className="text-left text-[11px] uppercase tracking-[0.1em] text-gray-400 px-4 py-3"
            >
              Ảnh
            </th>
            <th
              scope="col"
              className="text-left text-[11px] uppercase tracking-[0.1em] text-gray-400 px-4 py-3"
            >
              Tên sản phẩm
            </th>
            <th
              scope="col"
              className="text-left text-[11px] uppercase tracking-[0.1em] text-gray-400 px-4 py-3"
            >
              Giá
            </th>
            <th
              scope="col"
              className="text-left text-[11px] uppercase tracking-[0.1em] text-gray-400 px-4 py-3"
            >
              Danh mục
            </th>
            <th
              scope="col"
              className="text-left text-[11px] uppercase tracking-[0.1em] text-gray-400 px-4 py-3"
            >
              Trạng thái
            </th>
            <th
              scope="col"
              className="text-left text-[11px] uppercase tracking-[0.1em] text-gray-400 px-4 py-3"
            >
              <span className="sr-only">Hành động</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {PRODUCTS.map((product) => (
            <tr
              key={product.code}
              className="border-b border-gray-50 hover:bg-pink-50/30 transition-colors"
            >
              {/* Image placeholder */}
              <td className="px-4 py-3">
                <div className="w-12 h-12 bg-blush rounded-lg flex items-center justify-center text-lg">
                  💍
                </div>
              </td>

              {/* Name + Code */}
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                <p className="text-pink-500 text-xs mt-0.5">{product.code}</p>
              </td>

              {/* Price */}
              <td className="px-4 py-3">
                <span className="text-pink-500 font-medium text-sm">
                  {formatVND(product.price)}
                </span>
              </td>

              {/* Category badge */}
              <td className="px-4 py-3">
                <span className="bg-pink-100 text-pink-700 text-xs rounded-full px-2 py-0.5">
                  {product.cat}
                </span>
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                {product.status === 'in' ? (
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs rounded-full px-2.5 py-1">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Còn hàng
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs rounded-full px-2.5 py-1">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                    Hết hàng
                  </span>
                )}
              </td>

              {/* Edit button */}
              <td className="px-4 py-3">
                <button
                  onClick={() => alert('Tính năng đang phát triển')}
                  className="border border-gray-200 text-gray-600 hover:border-pink-400 hover:text-pink-600 rounded-lg px-3 py-1 text-sm transition-colors"
                >
                  Sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Categories View
───────────────────────────────────────────── */
function CategoriesView() {
  const cats = CATEGORIES.filter((c) => c !== 'Tất cả')
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th scope="col" className="text-left text-[11px] uppercase tracking-[0.1em] text-gray-400 px-6 py-3">
              Danh mục
            </th>
            <th scope="col" className="text-left text-[11px] uppercase tracking-[0.1em] text-gray-400 px-6 py-3">
              Số sản phẩm
            </th>
            <th scope="col" className="text-left text-[11px] uppercase tracking-[0.1em] text-gray-400 px-6 py-3">
              Còn hàng
            </th>
            <th scope="col" className="text-left text-[11px] uppercase tracking-[0.1em] text-gray-400 px-6 py-3">
              Hết hàng
            </th>
          </tr>
        </thead>
        <tbody>
          {cats.map((cat) => {
            const products = PRODUCTS.filter((p) => p.cat === cat)
            const inStock = products.filter((p) => p.status === 'in').length
            const outOfStock = products.filter((p) => p.status === 'out').length
            return (
              <tr key={cat} className="border-b border-gray-50 hover:bg-pink-50/30 transition-colors">
                <td className="px-6 py-4">
                  <span className="bg-pink-100 text-pink-700 text-xs rounded-full px-3 py-1 font-medium">
                    {cat}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{products.length}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-green-700 text-xs">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    {inStock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-red-700 text-xs">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                    {outOfStock}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Dashboard View
───────────────────────────────────────────── */
function DashboardView({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<AdminView>('dashboard')

  const totalProducts = PRODUCTS.length
  const outOfStock = PRODUCTS.filter((p) => p.status === 'out').length
  const categoryCount = CATEGORIES.length - 1

  const navItems: { id: AdminView; icon: string; label: string }[] = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'categories', icon: '🏷️', label: 'Danh mục' },
  ]

  const pageTitle = view === 'dashboard' ? 'Dashboard' : 'Danh mục'

  return (
    <div className="flex h-screen">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-white border-r border-pink-100 h-screen sticky top-0 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-pink-50">
          <p className="font-sans text-pink-500 uppercase tracking-widest text-sm font-semibold">
            IN NGỌC TRUNG
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1" aria-label="Admin navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              aria-current={view === item.id ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                view === item.id
                  ? 'bg-pink-50 text-pink-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom: user + logout */}
        <div className="px-4 py-4 border-t border-pink-50">
          <p className="text-xs text-gray-400 mb-3 px-1 truncate">
            admin@inngoctrung.vn
          </p>
          <button
            onClick={onLogout}
            aria-label="Đăng xuất khỏi trang quản trị"
            className="w-full border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 rounded-lg px-4 py-2 text-sm transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 bg-gray-50 min-h-screen overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4">
          <h1 className="text-gray-800 font-medium text-lg">{pageTitle}</h1>
        </div>

        {/* Page body */}
        <div className="px-8 py-8 space-y-8">
          {view === 'dashboard' && (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white border border-pink-100 rounded-2xl p-6 shadow-card">
                  <p className="text-[12px] uppercase tracking-[0.15em] text-gray-400 mb-2">
                    Tổng sản phẩm
                  </p>
                  <p className="font-display text-[48px] font-[300] text-gray-900 leading-none">
                    {totalProducts}
                  </p>
                </div>

                <div className="bg-white border border-pink-100 rounded-2xl p-6 shadow-card">
                  <p className="text-[12px] uppercase tracking-[0.15em] text-gray-400 mb-2">
                    Hết hàng
                  </p>
                  <p className="font-display text-[48px] font-[300] text-gray-900 leading-none">
                    {outOfStock}
                  </p>
                </div>

                <div className="bg-white border border-pink-100 rounded-2xl p-6 shadow-card">
                  <p className="text-[12px] uppercase tracking-[0.15em] text-gray-400 mb-2">
                    Danh mục
                  </p>
                  <p className="font-display text-[48px] font-[300] text-gray-900 leading-none">
                    {categoryCount}
                  </p>
                </div>
              </div>

              {/* Product table */}
              <ProductTable />
            </>
          )}

          {view === 'categories' && <CategoriesView />}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Root Page
───────────────────────────────────────────── */
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (!isLoggedIn) {
    return (
      <LoginView
        onLogin={() => setIsLoggedIn(true)}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    )
  }

  return (
    <DashboardView
      onLogout={() => {
        setIsLoggedIn(false)
        setEmail('')
        setPassword('')
      }}
    />
  )
}
