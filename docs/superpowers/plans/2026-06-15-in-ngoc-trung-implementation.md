# In Ngọc Trung — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng website đa trang cho tiệm In Ngọc Trung gồm 5 trang public (giới thiệu, dịch vụ, catalog thiệp cưới, liên hệ) và admin panel quản lý sản phẩm/danh mục.

**Architecture:** Next.js 14 App Router với Server Components cho public pages (SEO tốt, load nhanh). Supabase cung cấp PostgreSQL, Auth, và Storage. Admin panel dùng Server Actions để mutation, bảo vệ bằng middleware.

**Tech Stack:** Next.js 14 · TypeScript · Supabase (`@supabase/ssr`) · Tailwind CSS · shadcn/ui · Vitest · Vercel

---

## File Map

```
in-ngoc-trung/
├── app/
│   ├── layout.tsx                         # Root layout, font Inter
│   ├── (public)/
│   │   ├── layout.tsx                     # Navbar + Footer + floating ContactButtons
│   │   ├── page.tsx                       # Trang chủ
│   │   ├── dich-vu/page.tsx               # Dịch vụ
│   │   ├── thiep-cuoi/page.tsx            # Catalog thiệp cưới
│   │   ├── thiep-cuoi/[id]/page.tsx       # Chi tiết thiệp
│   │   └── lien-he/page.tsx               # Liên hệ
│   └── admin/
│       ├── layout.tsx                     # Sidebar admin
│       ├── login/page.tsx                 # Đăng nhập
│       ├── page.tsx                       # Dashboard
│       ├── san-pham/page.tsx              # Danh sách sản phẩm
│       ├── san-pham/new/page.tsx          # Tạo mới
│       ├── san-pham/[id]/edit/page.tsx    # Sửa
│       └── danh-muc/page.tsx             # Quản lý danh mục
├── components/
│   ├── layout/Navbar.tsx
│   ├── layout/Footer.tsx
│   ├── contact/ContactButtons.tsx         # Messenger + Zalo + Phone
│   ├── home/HeroSection.tsx
│   ├── home/ServicesGrid.tsx
│   ├── home/CtaBanner.tsx
│   └── products/
│       ├── ProductCard.tsx
│       ├── ProductFilter.tsx
│       └── ProductForm.tsx                # Dùng cho add + edit
├── lib/
│   ├── supabase/client.ts                 # Browser Supabase client
│   ├── supabase/server.ts                 # Server Supabase client
│   └── types.ts                          # DB types + helpers
├── middleware.ts                          # Auth guard /admin/*
└── supabase/migrations/
    └── 001_initial.sql                   # Schema SQL
```

---

## Task 1: Clone repo & scaffold Next.js project

**Files:**
- Create: toàn bộ cấu trúc Next.js mới trong `/Users/hieunguyen/projects/in-ngoc-trung`

- [ ] **Clone repo từ GitHub về thư mục hiện có**

```bash
cd /Users/hieunguyen/projects/in-ngoc-trung
git init
git remote add origin https://github.com/hieunguyen-136/in-ngoc-trung.git
git pull origin main
```

- [ ] **Scaffold Next.js project (chạy trong thư mục)**

```bash
cd /Users/hieunguyen/projects/in-ngoc-trung
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --no-git
```

Khi hỏi, chọn: Yes cho tất cả mặc định.

- [ ] **Cài thêm dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Khởi tạo shadcn/ui**

```bash
npx shadcn@latest init
```

Chọn: Default style, màu `pink`, CSS variables: yes.

- [ ] **Cài shadcn components cần dùng**

```bash
npx shadcn@latest add button input label badge table dialog select textarea switch toast
```

- [ ] **Tạo vitest.config.ts**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

- [ ] **Tạo vitest.setup.ts**

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Thêm script test vào package.json**

Trong `package.json`, thêm vào `scripts`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Tạo .env.local**

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_MESSENGER_PAGE_ID=YOUR_FB_PAGE_ID
NEXT_PUBLIC_ZALO_PHONE=YOUR_PHONE_NUMBER
NEXT_PUBLIC_PHONE=YOUR_PHONE_NUMBER
```

- [ ] **Thêm .env.local vào .gitignore** (kiểm tra đã có chưa)

```bash
grep -q ".env.local" .gitignore || echo ".env.local" >> .gitignore
echo ".superpowers/" >> .gitignore
```

- [ ] **Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 14 project with Supabase and shadcn/ui"
git push origin main
```

---

## Task 2: Supabase setup — DB schema + Storage + Auth

**Files:**
- Create: `supabase/migrations/001_initial.sql`

- [ ] **Tạo Supabase project**

Vào [supabase.com](https://supabase.com) → New project → đặt tên `in-ngoc-trung` → lưu password.

- [ ] **Lấy credentials**

Vào Project Settings → API → copy:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

Cập nhật `.env.local`.

- [ ] **Tạo file migration SQL**

```sql
-- supabase/migrations/001_initial.sql

-- Categories table
CREATE TABLE categories (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  catalog_type text NOT NULL DEFAULT 'thiep_cuoi',
  created_at   timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  description   text,
  product_code  text UNIQUE NOT NULL,
  price         numeric(12, 0) NOT NULL,
  size          text,
  min_quantity  integer NOT NULL DEFAULT 1,
  category_id   uuid REFERENCES categories(id) ON DELETE SET NULL,
  catalog_type  text NOT NULL DEFAULT 'thiep_cuoi',
  status        text NOT NULL DEFAULT 'available'
                CHECK (status IN ('available', 'out_of_stock')),
  image_url     text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: enable
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public: read only
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public_read_products" ON products FOR SELECT USING (true);

-- Authenticated (admin): full access
CREATE POLICY "admin_all_categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Seed default categories
INSERT INTO categories (name, catalog_type) VALUES
  ('Sang trọng', 'thiep_cuoi'),
  ('Hiện đại', 'thiep_cuoi'),
  ('Truyền thống', 'thiep_cuoi'),
  ('Tối giản', 'thiep_cuoi'),
  ('Vintage', 'thiep_cuoi');
```

- [ ] **Chạy migration trong Supabase SQL Editor**

Vào Supabase Dashboard → SQL Editor → paste nội dung trên → Run.

Kiểm tra: Tables `categories` và `products` xuất hiện trong Table Editor. Bảng `categories` có 5 rows.

- [ ] **Tạo Storage bucket**

Vào Storage → New bucket → tên: `product-images` → Public bucket: ON → Create.

- [ ] **Tạo admin user**

Vào Authentication → Users → Invite user → nhập email admin.

Hoặc dùng SQL Editor:
```sql
-- Chạy trong Supabase SQL Editor
SELECT auth.uid(); -- kiểm tra
```

Sau đó vào Authentication → Users → Add user → email + password.

- [ ] **Commit**

```bash
git add supabase/
git commit -m "chore: add Supabase migration SQL"
git push origin main
```

---

## Task 3: Supabase client setup + TypeScript types

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/types.ts`
- Create: `lib/__tests__/types.test.ts`

- [ ] **Viết test cho types trước**

```typescript
// lib/__tests__/types.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrice, getContactUrl } from '@/lib/types'

describe('formatPrice', () => {
  it('formats VND price with dots', () => {
    expect(formatPrice(150000)).toBe('150.000 ₫')
    expect(formatPrice(1000000)).toBe('1.000.000 ₫')
  })
  it('handles zero', () => {
    expect(formatPrice(0)).toBe('0 ₫')
  })
})

describe('getContactUrl', () => {
  it('returns messenger url', () => {
    expect(getContactUrl('messenger', 'mypage')).toBe('https://m.me/mypage')
  })
  it('returns zalo url', () => {
    expect(getContactUrl('zalo', '0909123456')).toBe('https://zalo.me/0909123456')
  })
  it('returns tel url', () => {
    expect(getContactUrl('phone', '0909123456')).toBe('tel:0909123456')
  })
})
```

- [ ] **Chạy test — xác nhận FAIL**

```bash
npm test
```

Expected: FAIL — `Cannot find module '@/lib/types'`

- [ ] **Tạo lib/types.ts**

```typescript
// lib/types.ts

export type ProductStatus = 'available' | 'out_of_stock'
export type CatalogType = 'thiep_cuoi'

export interface Category {
  id: string
  name: string
  catalog_type: CatalogType
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  product_code: string
  price: number
  size: string | null
  min_quantity: number
  category_id: string | null
  catalog_type: CatalogType
  status: ProductStatus
  image_url: string | null
  created_at: string
  updated_at: string
  categories?: Category | null
}

export type ContactChannel = 'messenger' | 'zalo' | 'phone'

export function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' ₫'
}

export function getContactUrl(channel: ContactChannel, value: string): string {
  if (channel === 'messenger') return `https://m.me/${value}`
  if (channel === 'zalo') return `https://zalo.me/${value}`
  return `tel:${value}`
}
```

- [ ] **Chạy test — xác nhận PASS**

```bash
npm test
```

Expected: PASS (2 suites, 5 tests)

- [ ] **Tạo lib/supabase/client.ts**

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Tạo lib/supabase/server.ts**

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

export async function createServiceClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Commit**

```bash
git add lib/
git commit -m "feat: add Supabase clients and TypeScript types"
git push origin main
```

---

## Task 4: Auth middleware

**Files:**
- Create: `middleware.ts`

- [ ] **Tạo middleware.ts**

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPath = request.nextUrl.pathname === '/admin/login'

  if (isAdminPath && !isLoginPath && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isLoginPath && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Commit**

```bash
git add middleware.ts
git commit -m "feat: add auth middleware for /admin routes"
git push origin main
```

---

## Task 5: Tailwind design tokens + Root layout

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Cập nhật tailwind.config.ts**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ec4899',
          dark: '#be185d',
          light: '#fce7f3',
        },
        surface: '#fdf2f8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

- [ ] **Cập nhật app/globals.css**

```css
/* app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-gray-900 font-sans;
  }
  h1, h2, h3 {
    @apply font-light tracking-wide;
  }
}
```

- [ ] **Cập nhật app/layout.tsx**

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'In Ngọc Trung — In ấn chuyên nghiệp',
  description: 'Tiệm in ấn In Ngọc Trung — Danh thiếp, Banner, Thiệp cưới, Catalogue, Tem nhãn, Giftnail, Menu.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Commit**

```bash
git add app/layout.tsx app/globals.css tailwind.config.ts
git commit -m "feat: configure Tailwind design tokens and root layout"
git push origin main
```

---

## Task 6: Shared components — Navbar, Footer, ContactButtons

**Files:**
- Create: `components/contact/ContactButtons.tsx`
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/Footer.tsx`
- Create: `app/(public)/layout.tsx`

- [ ] **Tạo components/contact/ContactButtons.tsx**

```typescript
// components/contact/ContactButtons.tsx
import Link from 'next/link'
import { getContactUrl } from '@/lib/types'

const messengerPageId = process.env.NEXT_PUBLIC_MESSENGER_PAGE_ID ?? ''
const zaloPhone = process.env.NEXT_PUBLIC_ZALO_PHONE ?? ''
const phone = process.env.NEXT_PUBLIC_PHONE ?? ''

interface ContactButtonsProps {
  variant?: 'inline' | 'floating'
  className?: string
}

export function ContactButtons({ variant = 'inline', className = '' }: ContactButtonsProps) {
  const buttons = [
    {
      label: 'Messenger',
      href: getContactUrl('messenger', messengerPageId),
      bg: 'bg-blue-500 hover:bg-blue-600',
      icon: '💬',
    },
    {
      label: 'Zalo',
      href: getContactUrl('zalo', zaloPhone),
      bg: 'bg-sky-400 hover:bg-sky-500',
      icon: '📱',
    },
    {
      label: 'Gọi ngay',
      href: getContactUrl('phone', phone),
      bg: 'bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700',
      icon: '📞',
    },
  ]

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-4 flex flex-col gap-3 z-50 ${className}`}>
        {buttons.map((btn) => (
          <Link
            key={btn.label}
            href={btn.href}
            className={`${btn.bg} text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg text-xl transition-transform hover:scale-110`}
            title={btn.label}
          >
            {btn.icon}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {buttons.map((btn) => (
        <Link
          key={btn.label}
          href={btn.href}
          className={`${btn.bg} text-white rounded-full px-6 py-3 font-medium text-sm transition-all hover:shadow-md`}
        >
          {btn.icon} {btn.label}
        </Link>
      ))}
    </div>
  )
}
```

- [ ] **Tạo components/layout/Navbar.tsx**

```typescript
// components/layout/Navbar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/dich-vu', label: 'Dịch vụ' },
  { href: '/thiep-cuoi', label: 'Thiệp cưới' },
  { href: '/lien-he', label: 'Liên hệ' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-pink-100">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-pink-500 font-semibold text-lg tracking-widest uppercase">
          In Ngọc Trung
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm transition-colors ${
                  pathname === link.href
                    ? 'text-pink-500 font-medium'
                    : 'text-gray-500 hover:text-pink-500'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-500"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className="text-2xl">{open ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden bg-white border-t border-pink-100 px-4 pb-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block py-3 text-sm border-b border-pink-50 ${
                  pathname === link.href ? 'text-pink-500 font-medium' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
```

- [ ] **Tạo components/layout/Footer.tsx**

```typescript
// components/layout/Footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-surface border-t border-pink-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-pink-500 font-semibold tracking-widest uppercase mb-3">In Ngọc Trung</p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Chuyên in ấn chất lượng cao — Danh thiếp, Banner, Thiệp cưới, Catalogue, Tem nhãn, Giftnail, Menu.
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-700 mb-3">Liên kết</p>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/dich-vu" className="hover:text-pink-500">Dịch vụ</Link></li>
            <li><Link href="/thiep-cuoi" className="hover:text-pink-500">Thiệp cưới</Link></li>
            <li><Link href="/lien-he" className="hover:text-pink-500">Liên hệ</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-gray-700 mb-3">Liên hệ</p>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>📍 [Địa chỉ tiệm]</li>
            <li>📞 {process.env.NEXT_PUBLIC_PHONE}</li>
            <li>🕐 7:00 – 20:00 (Thứ 2 – Chủ nhật)</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-4 border-t border-pink-100">
        © {new Date().getFullYear()} In Ngọc Trung. All rights reserved.
      </div>
    </footer>
  )
}
```

- [ ] **Tạo app/(public)/layout.tsx**

```typescript
// app/(public)/layout.tsx
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/contact/ContactButtons'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ContactButtons variant="floating" className="md:hidden" />
    </>
  )
}
```

- [ ] **Commit**

```bash
git add components/ app/\(public\)/layout.tsx
git commit -m "feat: add Navbar, Footer, ContactButtons shared components"
git push origin main
```

---

## Task 7: Home page

**Files:**
- Create: `components/home/HeroSection.tsx`
- Create: `components/home/ServicesGrid.tsx`
- Create: `components/home/CtaBanner.tsx`
- Create: `app/(public)/page.tsx`

- [ ] **Tạo components/home/HeroSection.tsx**

```typescript
// components/home/HeroSection.tsx
import { ContactButtons } from '@/components/contact/ContactButtons'

export function HeroSection() {
  return (
    <section className="min-h-[85vh] flex items-center bg-gradient-to-b from-surface to-white px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-pink-500 text-sm tracking-[4px] uppercase mb-6 font-medium">
          In ấn chuyên nghiệp
        </p>
        <h1 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight mb-6 tracking-wide">
          In Ngọc Trung
        </h1>
        <p className="text-gray-500 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto leading-relaxed">
          Chất lượng cao · Giao nhanh · Giá tốt — Đồng hành cùng mọi nhu cầu in ấn của bạn
        </p>
        <ContactButtons className="justify-center" />
      </div>
    </section>
  )
}
```

- [ ] **Tạo components/home/ServicesGrid.tsx**

```typescript
// components/home/ServicesGrid.tsx
import Link from 'next/link'

const services = [
  { icon: '💳', name: 'Danh thiếp', desc: 'Name card in sắc nét, sang trọng' },
  { icon: '🪟', name: 'Banner · Backdrop · Hiflex', desc: 'In khổ lớn, màu sắc tươi sáng' },
  { icon: '📋', name: 'Catalogue · Tờ rơi · Brochure', desc: 'In ấn marketing chuyên nghiệp' },
  { icon: '🏷️', name: 'Tem nhãn · Sticker', desc: 'In decal, tem, sticker theo yêu cầu' },
  { icon: '💅', name: 'Giftnail', desc: 'In móng tay thời trang, độc đáo' },
  { icon: '🍽️', name: 'Menu', desc: 'Menu nhà hàng, quán cafe đẹp mắt' },
  { icon: '💍', name: 'Thiệp cưới', desc: 'Thiệp đám cưới sang trọng, đa dạng mẫu', href: '/thiep-cuoi' },
]

export function ServicesGrid() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-pink-500 text-xs tracking-[4px] uppercase mb-3">Dịch vụ</p>
          <h2 className="text-3xl font-light text-gray-900">Chúng tôi in gì?</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map((s) => {
            const content = (
              <div className="bg-white border border-pink-100 rounded-xl p-6 hover:border-pink-300 hover:shadow-md transition-all text-center group">
                <div className="text-3xl mb-3">{s.icon}</div>
                <p className="font-medium text-gray-800 mb-1 group-hover:text-pink-500 transition-colors">
                  {s.name}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            )
            return s.href ? (
              <Link key={s.name} href={s.href}>{content}</Link>
            ) : (
              <div key={s.name}>{content}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Tạo components/home/CtaBanner.tsx**

```typescript
// components/home/CtaBanner.tsx
import { ContactButtons } from '@/components/contact/ContactButtons'

export function CtaBanner() {
  return (
    <section className="bg-gradient-to-r from-pink-50 to-surface py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
          Liên hệ ngay để được tư vấn miễn phí
        </h2>
        <p className="text-gray-500 mb-8">
          Chúng tôi sẵn sàng hỗ trợ bạn từ thiết kế đến in ấn
        </p>
        <ContactButtons className="justify-center" />
      </div>
    </section>
  )
}
```

- [ ] **Tạo app/(public)/page.tsx**

```typescript
// app/(public)/page.tsx
import { HeroSection } from '@/components/home/HeroSection'
import { ServicesGrid } from '@/components/home/ServicesGrid'
import { CtaBanner } from '@/components/home/CtaBanner'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <CtaBanner />
    </>
  )
}
```

- [ ] **Chạy dev server và kiểm tra**

```bash
npm run dev
```

Mở http://localhost:3000 — kiểm tra: hero hiển thị, grid 7 dịch vụ, CTA banner, floating buttons trên mobile.

- [ ] **Commit**

```bash
git add components/home/ app/\(public\)/page.tsx
git commit -m "feat: build home page with hero, services grid, CTA banner"
git push origin main
```

---

## Task 8: Services page (/dich-vu)

**Files:**
- Create: `app/(public)/dich-vu/page.tsx`

- [ ] **Tạo app/(public)/dich-vu/page.tsx**

```typescript
// app/(public)/dich-vu/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import { ContactButtons } from '@/components/contact/ContactButtons'

export const metadata: Metadata = {
  title: 'Dịch vụ — In Ngọc Trung',
  description: 'Danh thiếp, Banner, Catalogue, Tem nhãn, Giftnail, Menu, Thiệp cưới',
}

const services = [
  {
    icon: '💳',
    name: 'Danh thiếp / Name card',
    desc: 'In danh thiếp sang trọng, sắc nét với nhiều chất liệu: giấy cao cấp, matte, glossy, card nhựa PVC. Thiết kế từ file có sẵn hoặc theo yêu cầu.',
  },
  {
    icon: '🪟',
    name: 'Banner · Backdrop · Hiflex',
    desc: 'In khổ lớn phục vụ sự kiện, khai trương, quảng cáo. Màu sắc tươi sáng, bền đẹp, in nhanh.',
  },
  {
    icon: '📋',
    name: 'Catalogue · Tờ rơi · Brochure',
    desc: 'In ấn tài liệu marketing, profile công ty, catalogue sản phẩm. Đóng gáy nhiều kiểu: kẹp, ghim, bìa cứng.',
  },
  {
    icon: '🏷️',
    name: 'Tem nhãn · Sticker',
    desc: 'In decal, tem nhãn sản phẩm, sticker trang trí. Chất liệu đa dạng: giấy thường, đề-can trong, đề-can bạc.',
  },
  {
    icon: '💅',
    name: 'Giftnail',
    desc: 'In hình móng tay thời trang, độc đáo theo yêu cầu. Quà tặng đặc biệt cho dịp cưới, sinh nhật.',
  },
  {
    icon: '🍽️',
    name: 'Menu',
    desc: 'In menu nhà hàng, quán cafe, quán ăn. Laminate chống nước, bền đẹp theo thời gian.',
  },
  {
    icon: '💍',
    name: 'Thiệp cưới',
    desc: 'Thiệp mời đám cưới sang trọng với hàng trăm mẫu đa dạng. Xem catalog đầy đủ để chọn mẫu ưng ý.',
    href: '/thiep-cuoi',
    cta: 'Xem catalog thiệp cưới',
  },
]

export default function DichVuPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <p className="text-pink-500 text-xs tracking-[4px] uppercase mb-3">Dịch vụ</p>
        <h1 className="text-4xl font-light text-gray-900 mb-4">Các dịch vụ in ấn</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          In Ngọc Trung cung cấp đầy đủ dịch vụ in ấn chất lượng cao, phục vụ mọi nhu cầu cá nhân và doanh nghiệp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((s) => (
          <div key={s.name} className="bg-white border border-pink-100 rounded-2xl p-8 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">{s.icon}</div>
            <h2 className="text-xl font-medium text-gray-800 mb-3">{s.name}</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
            {s.href ? (
              <Link
                href={s.href}
                className="inline-block bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-full px-6 py-2 text-sm hover:shadow-md transition-all"
              >
                {s.cta}
              </Link>
            ) : (
              <ContactButtons className="flex-wrap" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Kiểm tra trong dev server**

Mở http://localhost:3000/dich-vu — kiểm tra 7 cards hiển thị, card Thiệp cưới có link.

- [ ] **Commit**

```bash
git add app/\(public\)/dich-vu/
git commit -m "feat: build services page /dich-vu"
git push origin main
```

---

## Task 9: Contact page (/lien-he)

**Files:**
- Create: `app/(public)/lien-he/page.tsx`

- [ ] **Tạo app/(public)/lien-he/page.tsx**

```typescript
// app/(public)/lien-he/page.tsx
import type { Metadata } from 'next'
import { ContactButtons } from '@/components/contact/ContactButtons'

export const metadata: Metadata = {
  title: 'Liên hệ — In Ngọc Trung',
}

export default function LienHePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-pink-500 text-xs tracking-[4px] uppercase mb-3">Liên hệ</p>
        <h1 className="text-4xl font-light text-gray-900">Liên hệ với chúng tôi</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        <div className="bg-surface rounded-2xl p-8 border border-pink-100">
          <h2 className="font-medium text-gray-800 mb-6 text-lg">Thông tin tiệm</h2>
          <ul className="space-y-4 text-gray-600 text-sm">
            <li className="flex gap-3">
              <span>📍</span>
              <span>[Địa chỉ tiệm In Ngọc Trung]</span>
            </li>
            <li className="flex gap-3">
              <span>📞</span>
              <span>{process.env.NEXT_PUBLIC_PHONE}</span>
            </li>
            <li className="flex gap-3">
              <span>🕐</span>
              <div>
                <p>Thứ 2 – Thứ 7: 7:00 – 20:00</p>
                <p>Chủ nhật: 8:00 – 17:00</p>
              </div>
            </li>
          </ul>

          <div className="mt-8">
            <p className="text-sm font-medium text-gray-700 mb-4">Liên hệ nhanh:</p>
            <ContactButtons />
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-pink-100 min-h-[300px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0!2d106.7!3d10.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ4JzAwLjAiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1svi!2svn!4v1620000000000!5m2!1svi!2svn"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '300px' }}
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
```

> **Lưu ý:** Cập nhật `[Địa chỉ tiệm In Ngọc Trung]` và URL Google Maps embed bằng địa chỉ thực tế của tiệm.

- [ ] **Commit**

```bash
git add app/\(public\)/lien-he/
git commit -m "feat: build contact page /lien-he"
git push origin main
```

---

## Task 10: Product components (Card + Filter)

**Files:**
- Create: `components/products/ProductCard.tsx`
- Create: `components/products/ProductFilter.tsx`

- [ ] **Tạo components/products/ProductCard.tsx**

```typescript
// components/products/ProductCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, type Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.status === 'out_of_stock'

  return (
    <Link href={`/thiep-cuoi/${product.id}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden border border-pink-100 hover:border-pink-300 hover:shadow-md transition-all bg-white">
        <div className="relative aspect-[3/4] bg-surface">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl text-pink-200">
              💍
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                Hết hàng
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-pink-400 mb-1">{product.product_code}</p>
          <p className="font-medium text-gray-800 text-sm leading-tight mb-2 line-clamp-2">
            {product.name}
          </p>
          {product.size && (
            <p className="text-xs text-gray-400 mb-2">{product.size}</p>
          )}
          <p className="text-pink-500 font-semibold">{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Tạo components/products/ProductFilter.tsx**

```typescript
// components/products/ProductFilter.tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/lib/types'

interface ProductFilterProps {
  categories: Category[]
  activeCategory: string
}

export function ProductFilter({ categories, activeCategory }: ProductFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function setCategory(categoryId: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId === 'all') {
      params.delete('category')
    } else {
      params.set('category', categoryId)
    }
    params.delete('page')
    router.push(`/thiep-cuoi?${params.toString()}`)
  }

  const chips = [{ id: 'all', name: 'Tất cả' }, ...categories]

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((cat) => {
        const isActive = cat.id === activeCategory
        return (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`rounded-full px-4 py-2 text-sm transition-all ${
              isActive
                ? 'bg-pink-500 text-white shadow-sm'
                : 'bg-white border border-pink-200 text-gray-600 hover:border-pink-400'
            }`}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add components/products/ProductCard.tsx components/products/ProductFilter.tsx
git commit -m "feat: add ProductCard and ProductFilter components"
git push origin main
```

---

## Task 11: Wedding catalog page (/thiep-cuoi)

**Files:**
- Create: `app/(public)/thiep-cuoi/page.tsx`

- [ ] **Tạo app/(public)/thiep-cuoi/page.tsx**

```typescript
// app/(public)/thiep-cuoi/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductFilter } from '@/components/products/ProductFilter'
import type { Product, Category } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Catalog Thiệp Cưới — In Ngọc Trung',
  description: 'Hàng trăm mẫu thiệp cưới sang trọng, hiện đại, truyền thống',
}

const PAGE_SIZE = 20

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function ThiepCuoiPage({ searchParams }: Props) {
  const params = await searchParams
  const activeCategory = params.category ?? 'all'
  const currentPage = Math.max(1, parseInt(params.page ?? '1', 10))

  const supabase = await createClient()

  const [{ data: categories }, productsResult] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('catalog_type', 'thiep_cuoi')
      .order('name'),
    (() => {
      let q = supabase
        .from('products')
        .select('*, categories(*)', { count: 'exact' })
        .eq('catalog_type', 'thiep_cuoi')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)

      if (activeCategory !== 'all') {
        q = q.eq('category_id', activeCategory)
      }
      return q
    })(),
  ])

  const products = (productsResult.data ?? []) as Product[]
  const totalCount = productsResult.count ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-pink-500 text-xs tracking-[4px] uppercase mb-3">Catalog</p>
        <h1 className="text-4xl font-light text-gray-900 mb-4">Thiệp cưới</h1>
        <p className="text-gray-500">
          {totalCount} mẫu thiệp cưới đa dạng — Sang trọng, hiện đại, truyền thống
        </p>
      </div>

      <div className="mb-8">
        <Suspense>
          <ProductFilter
            categories={categories ?? []}
            activeCategory={activeCategory}
          />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">💍</p>
          <p>Chưa có sản phẩm trong danh mục này</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/thiep-cuoi?${activeCategory !== 'all' ? `category=${activeCategory}&` : ''}page=${p}`}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${
                p === currentPage
                  ? 'bg-pink-500 text-white'
                  : 'border border-pink-200 text-gray-600 hover:border-pink-400'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Kiểm tra trong dev server**

Mở http://localhost:3000/thiep-cuoi — filter bar hiển thị (dù chưa có sản phẩm). Thêm thử 1 sản phẩm qua Supabase Table Editor để kiểm tra card.

- [ ] **Commit**

```bash
git add app/\(public\)/thiep-cuoi/page.tsx
git commit -m "feat: build wedding catalog page /thiep-cuoi"
git push origin main
```

---

## Task 12: Wedding card detail (/thiep-cuoi/[id])

**Files:**
- Create: `app/(public)/thiep-cuoi/[id]/page.tsx`

- [ ] **Tạo app/(public)/thiep-cuoi/[id]/page.tsx**

```typescript
// app/(public)/thiep-cuoi/[id]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ContactButtons } from '@/components/contact/ContactButtons'
import { formatPrice } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('name').eq('id', id).single()
  return { title: data ? `${data.name} — In Ngọc Trung` : 'Thiệp cưới' }
}

export default async function ThiepCuoiDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', id)
    .single()

  if (!product) notFound()

  const isOutOfStock = product.status === 'out_of_stock'

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-pink-500">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/thiep-cuoi" className="hover:text-pink-500">Thiệp cưới</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface border border-pink-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-8xl text-pink-200">
              💍
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute top-4 left-4 bg-white text-gray-600 text-xs font-medium px-3 py-1 rounded-full shadow">
              Hết hàng
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          {product.categories && (
            <span className="inline-block bg-primary-light text-pink-600 text-xs px-3 py-1 rounded-full mb-4 w-fit">
              {product.categories.name}
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">{product.name}</h1>
          <p className="text-pink-400 text-sm mb-6">{product.product_code}</p>

          <div className="text-3xl font-light text-pink-500 mb-6">
            {formatPrice(product.price)}
          </div>

          <ul className="space-y-3 text-sm text-gray-600 mb-8">
            {product.size && (
              <li className="flex gap-3">
                <span className="text-gray-400 w-32">Kích thước:</span>
                <span>{product.size}</span>
              </li>
            )}
            <li className="flex gap-3">
              <span className="text-gray-400 w-32">Số lượng tối thiểu:</span>
              <span>{product.min_quantity} cái</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-400 w-32">Trạng thái:</span>
              <span className={isOutOfStock ? 'text-red-500' : 'text-green-600'}>
                {isOutOfStock ? 'Hết hàng' : 'Còn hàng'}
              </span>
            </li>
          </ul>

          {product.description && (
            <p className="text-gray-500 text-sm leading-relaxed mb-8">{product.description}</p>
          )}

          <div className="border-t border-pink-100 pt-6">
            <p className="text-sm text-gray-600 mb-4">Liên hệ để đặt hàng:</p>
            <ContactButtons />
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/thiep-cuoi" className="text-pink-500 hover:text-pink-700 text-sm">
          ← Quay lại catalog thiệp cưới
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add app/\(public\)/thiep-cuoi/
git commit -m "feat: build wedding card detail page /thiep-cuoi/[id]"
git push origin main
```

---

## Task 13: Admin login page

**Files:**
- Create: `app/admin/login/page.tsx`

- [ ] **Tạo app/admin/login/page.tsx**

```typescript
// app/admin/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Email hoặc mật khẩu không đúng')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-pink-500 font-semibold tracking-widest uppercase text-sm">In Ngọc Trung</p>
          <h1 className="text-2xl font-light text-gray-800 mt-2">Admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add app/admin/login/
git commit -m "feat: build admin login page"
git push origin main
```

---

## Task 14: Admin layout + Dashboard

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`

- [ ] **Tạo app/admin/layout.tsx**

```typescript
// app/admin/layout.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function AdminSidebar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  async function signOut() {
    'use server'
    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = await createServiceClient()
    await supabase.auth.signOut()
    redirect('/admin/login')
  }

  return (
    <aside className="w-60 bg-white border-r border-pink-100 flex flex-col min-h-screen">
      <div className="p-6 border-b border-pink-100">
        <p className="text-pink-500 font-semibold tracking-widest uppercase text-xs">In Ngọc Trung</p>
        <p className="text-gray-600 text-sm mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {[
            { href: '/admin', label: 'Dashboard', icon: '📊' },
            { href: '/admin/san-pham', label: 'Sản phẩm', icon: '💍' },
            { href: '/admin/danh-muc', label: 'Danh mục', icon: '🏷️' },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-surface hover:text-pink-500 transition-colors text-sm"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-pink-100">
        <p className="text-xs text-gray-400 mb-2">{user.email}</p>
        <form action={signOut}>
          <button type="submit" className="text-xs text-red-400 hover:text-red-600 transition-colors">
            Đăng xuất
          </button>
        </form>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
```

- [ ] **Tạo app/admin/page.tsx**

```typescript
// app/admin/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalProducts },
    { count: outOfStock },
    { count: totalCategories },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('catalog_type', 'thiep_cuoi'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'out_of_stock'),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Tổng sản phẩm', value: totalProducts ?? 0, icon: '💍', href: '/admin/san-pham' },
    { label: 'Hết hàng', value: outOfStock ?? 0, icon: '⚠️', href: '/admin/san-pham' },
    { label: 'Danh mục', value: totalCategories ?? 0, icon: '🏷️', href: '/admin/danh-muc' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-light text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl border border-pink-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">{stat.icon}</div>
            <p className="text-3xl font-light text-gray-800 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add app/admin/layout.tsx app/admin/page.tsx
git commit -m "feat: build admin layout and dashboard"
git push origin main
```

---

## Task 15: Admin — Category management

**Files:**
- Create: `app/admin/danh-muc/page.tsx`

- [ ] **Tạo app/admin/danh-muc/page.tsx**

```typescript
// app/admin/danh-muc/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Category } from '@/lib/types'

export default function DanhMucPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('catalog_type', 'thiep_cuoi')
      .order('name')
    setCategories(data ?? [])
  }

  useEffect(() => { fetchCategories() }, [])

  async function addCategory() {
    if (!newName.trim()) return
    setLoading(true)
    await supabase.from('categories').insert({ name: newName.trim(), catalog_type: 'thiep_cuoi' })
    setNewName('')
    await fetchCategories()
    setLoading(false)
  }

  async function updateCategory() {
    if (!editId || !editName.trim()) return
    setLoading(true)
    await supabase.from('categories').update({ name: editName.trim() }).eq('id', editId)
    setEditId(null)
    setEditName('')
    await fetchCategories()
    setLoading(false)
  }

  async function deleteCategory(id: string) {
    if (!confirm('Xóa danh mục này? Sản phẩm thuộc danh mục sẽ không còn danh mục.')) return
    setLoading(true)
    await supabase.from('categories').delete().eq('id', id)
    await fetchCategories()
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-light text-gray-800 mb-8">Quản lý danh mục</h1>

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 mb-8">
        <h2 className="font-medium text-gray-700 mb-4">Thêm danh mục mới</h2>
        <div className="flex gap-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tên danh mục (VD: Sang trọng)"
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          />
          <Button
            onClick={addCategory}
            disabled={loading || !newName.trim()}
            className="bg-pink-500 hover:bg-pink-600 rounded-full px-6"
          >
            Thêm
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-pink-100">
        {categories.length === 0 ? (
          <p className="text-center text-gray-400 py-10">Chưa có danh mục nào</p>
        ) : (
          <ul className="divide-y divide-pink-50">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-4 p-4">
                {editId === cat.id ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && updateCategory()}
                      autoFocus
                    />
                    <Button onClick={updateCategory} disabled={loading} size="sm" className="bg-pink-500 hover:bg-pink-600">
                      Lưu
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditId(null)}>
                      Hủy
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-gray-700">{cat.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setEditId(cat.id); setEditName(cat.name) }}
                      className="text-gray-400 hover:text-pink-500"
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCategory(cat.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      Xóa
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add app/admin/danh-muc/
git commit -m "feat: build admin category management"
git push origin main
```

---

## Task 16: Admin — ProductForm component

**Files:**
- Create: `components/products/ProductForm.tsx`

- [ ] **Tạo components/products/ProductForm.tsx**

```typescript
// components/products/ProductForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { Product, Category } from '@/lib/types'

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

const SIZE_OPTIONS = ['A5', 'A6', 'A7', '10x15cm', '15x15cm', '15x21cm', 'Khác']

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEdit = !!product

  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    product_code: product?.product_code ?? '',
    price: product?.price?.toString() ?? '',
    size: product?.size ?? '',
    min_quantity: product?.min_quantity?.toString() ?? '1',
    category_id: product?.category_id ?? '',
    status: product?.status ?? 'available',
    image_url: product?.image_url ?? '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(product?.image_url ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop()
    const path = `thiep-cuoi/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, file)
    if (error) throw error
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let imageUrl = form.image_url

      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const payload = {
        name: form.name,
        description: form.description || null,
        product_code: form.product_code,
        price: parseInt(form.price, 10),
        size: form.size || null,
        min_quantity: parseInt(form.min_quantity, 10),
        category_id: form.category_id || null,
        catalog_type: 'thiep_cuoi' as const,
        status: form.status,
        image_url: imageUrl || null,
      }

      if (isEdit && product) {
        const { error } = await supabase.from('products').update(payload).eq('id', product.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
      }

      router.push('/admin/san-pham')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Image upload */}
      <div>
        <Label>Ảnh sản phẩm</Label>
        <div className="mt-2 flex gap-4 items-start">
          {imagePreview && (
            <div className="relative w-24 h-32 rounded-xl overflow-hidden border border-pink-100 flex-shrink-0">
              <Image src={imagePreview} alt="preview" fill className="object-cover" />
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100"
            />
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP. Tối đa 5MB.</p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <Label htmlFor="name">Tên thiệp *</Label>
        <Input id="name" value={form.name} onChange={(e) => handleField('name', e.target.value)} required className="mt-1" placeholder="VD: Thiệp cưới hoa hồng Provence" />
      </div>

      {/* Product code */}
      <div>
        <Label htmlFor="product_code">Mã sản phẩm *</Label>
        <Input id="product_code" value={form.product_code} onChange={(e) => handleField('product_code', e.target.value)} required className="mt-1" placeholder="VD: TC-001" />
      </div>

      {/* Price */}
      <div>
        <Label htmlFor="price">Giá (VND) *</Label>
        <Input id="price" type="number" value={form.price} onChange={(e) => handleField('price', e.target.value)} required className="mt-1" placeholder="150000" min="0" />
      </div>

      {/* Size */}
      <div>
        <Label htmlFor="size">Kích thước</Label>
        <Select value={form.size} onValueChange={(v) => handleField('size', v)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Chọn kích thước" />
          </SelectTrigger>
          <SelectContent>
            {SIZE_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Min quantity */}
      <div>
        <Label htmlFor="min_quantity">Số lượng tối thiểu *</Label>
        <Input id="min_quantity" type="number" value={form.min_quantity} onChange={(e) => handleField('min_quantity', e.target.value)} required className="mt-1" min="1" />
      </div>

      {/* Category */}
      <div>
        <Label>Danh mục</Label>
        <Select value={form.category_id} onValueChange={(v) => handleField('category_id', v)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Mô tả</Label>
        <Textarea id="description" value={form.description} onChange={(e) => handleField('description', e.target.value)} className="mt-1" rows={3} placeholder="Mô tả ngắn về thiệp..." />
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <Switch
          id="status"
          checked={form.status === 'available'}
          onCheckedChange={(checked) => handleField('status', checked ? 'available' : 'out_of_stock')}
        />
        <Label htmlFor="status">
          {form.status === 'available' ? '✅ Còn hàng' : '⚠️ Hết hàng'}
        </Label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-pink-400 to-pink-600 rounded-full px-8"
        >
          {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm sản phẩm'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Hủy
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Commit**

```bash
git add components/products/ProductForm.tsx
git commit -m "feat: add ProductForm component with image upload"
git push origin main
```

---

## Task 17: Admin — Product list + add + edit pages

**Files:**
- Create: `app/admin/san-pham/page.tsx`
- Create: `app/admin/san-pham/new/page.tsx`
- Create: `app/admin/san-pham/[id]/edit/page.tsx`

- [ ] **Tạo app/admin/san-pham/page.tsx**

```typescript
// app/admin/san-pham/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/types'

export default async function SanPhamPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('catalog_type', 'thiep_cuoi')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-gray-800">Quản lý sản phẩm</h1>
        <Link href="/admin/san-pham/new">
          <Button className="bg-gradient-to-r from-pink-400 to-pink-600 rounded-full">
            + Thêm sản phẩm
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
        {!products?.length ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-4">💍</p>
            <p className="mb-4">Chưa có sản phẩm nào</p>
            <Link href="/admin/san-pham/new">
              <Button className="bg-pink-500 hover:bg-pink-600 rounded-full">Thêm sản phẩm đầu tiên</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pink-100 text-gray-500 text-left">
                  <th className="px-4 py-3 w-16">Ảnh</th>
                  <th className="px-4 py-3">Tên</th>
                  <th className="px-4 py-3">Mã SP</th>
                  <th className="px-4 py-3">Giá</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-surface transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-surface">
                        {p.image_url ? (
                          <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-xl text-pink-200">💍</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px]">
                      <p className="line-clamp-2">{p.name}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.product_code}</td>
                    <td className="px-4 py-3 text-pink-500 font-medium">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-gray-500">{p.categories?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status === 'available' ? 'default' : 'secondary'} className={p.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}>
                        {p.status === 'available' ? 'Còn hàng' : 'Hết hàng'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/san-pham/${p.id}/edit`}>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-pink-500">Sửa</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Tạo app/admin/san-pham/new/page.tsx**

```typescript
// app/admin/san-pham/new/page.tsx
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/products/ProductForm'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('catalog_type', 'thiep_cuoi')
    .order('name')

  return (
    <div>
      <h1 className="text-2xl font-light text-gray-800 mb-8">Thêm thiệp cưới mới</h1>
      <div className="bg-white rounded-2xl border border-pink-100 p-8">
        <ProductForm categories={categories ?? []} />
      </div>
    </div>
  )
}
```

- [ ] **Tạo app/admin/san-pham/[id]/edit/page.tsx**

```typescript
// app/admin/san-pham/[id]/edit/page.tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/products/ProductForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').eq('catalog_type', 'thiep_cuoi').order('name'),
  ])

  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-light text-gray-800 mb-8">Sửa sản phẩm</h1>
      <div className="bg-white rounded-2xl border border-pink-100 p-8">
        <ProductForm product={product} categories={categories ?? []} />
      </div>
    </div>
  )
}
```

- [ ] **Kiểm tra admin flow**

1. Vào http://localhost:3000/admin/login → đăng nhập
2. Thêm 1 sản phẩm → upload ảnh → lưu
3. Kiểm tra sản phẩm xuất hiện ở http://localhost:3000/thiep-cuoi

- [ ] **Commit**

```bash
git add app/admin/san-pham/
git commit -m "feat: build admin product list, add, and edit pages"
git push origin main
```

---

## Task 18: Cập nhật địa chỉ + push lên GitHub

**Files:**
- Modify: `components/layout/Footer.tsx` — thay `[Địa chỉ tiệm]` bằng địa chỉ thực
- Modify: `app/(public)/lien-he/page.tsx` — thay địa chỉ + Google Maps URL thực tế

- [ ] **Điền địa chỉ thực tế vào Footer.tsx**

Trong `components/layout/Footer.tsx`, thay `[Địa chỉ tiệm]` bằng địa chỉ thực của In Ngọc Trung.

- [ ] **Điền địa chỉ thực + Google Maps embed vào lien-he/page.tsx**

1. Vào maps.google.com → tìm địa chỉ tiệm → Share → Embed a map → copy iframe src URL
2. Thay URL trong `app/(public)/lien-he/page.tsx`

- [ ] **Cập nhật .env.local với thông tin thực**

```bash
# .env.local
NEXT_PUBLIC_PHONE=0xxx_xxx_xxx
NEXT_PUBLIC_ZALO_PHONE=0xxx_xxx_xxx
NEXT_PUBLIC_MESSENGER_PAGE_ID=ten.trang.facebook
```

- [ ] **Build production để kiểm tra**

```bash
npm run build
```

Expected: Build thành công, không có TypeScript errors.

- [ ] **Commit cuối và push**

```bash
git add -A
git commit -m "feat: complete In Ngoc Trung website v1"
git push origin main
```

---

## Task 19: Deploy lên Vercel

- [ ] **Vào vercel.com → New Project → Import từ GitHub**

Chọn repo `hieunguyen-136/in-ngoc-trung`.

- [ ] **Thêm Environment Variables trong Vercel**

Trong Project Settings → Environment Variables, thêm:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_MESSENGER_PAGE_ID`
- `NEXT_PUBLIC_ZALO_PHONE`
- `NEXT_PUBLIC_PHONE`

- [ ] **Deploy và kiểm tra production URL**

Click Deploy. Sau khi xong, kiểm tra URL production:
- Trang chủ hiển thị đúng
- `/thiep-cuoi` filter hoạt động
- `/admin/login` đăng nhập được
- Admin thêm sản phẩm thành công

---

## Checklist spec coverage

| Spec requirement | Task |
|-----------------|------|
| Hero + 3 CTA buttons | Task 7 |
| Grid 7 dịch vụ | Task 7 |
| CTA Banner | Task 7 |
| Trang /dich-vu | Task 8 |
| Trang /lien-he + Google Maps | Task 9 |
| Catalog thiệp cưới + filter + pagination | Task 11 |
| Chi tiết thiệp | Task 12 |
| Auth middleware /admin/* | Task 4 |
| Admin login | Task 13 |
| Admin dashboard + stats | Task 14 |
| Admin category CRUD | Task 15 |
| Admin product list + add + edit | Task 16, 17 |
| Image upload → Supabase Storage | Task 16 |
| Product fields: tất cả 8 trường | Task 16 |
| Floating contact buttons | Task 6 |
| Pink & White design system | Task 5 |
| Deploy Vercel | Task 19 |
| Extensible catalog_type | Task 2 |
