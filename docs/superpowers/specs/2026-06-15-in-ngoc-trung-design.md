# In Ngọc Trung — Website Design Spec

**Date:** 2026-06-15
**Project:** Website giới thiệu và catalog sản phẩm cho tiệm In Ngọc Trung
**Stack:** Next.js 14+ · TypeScript · Supabase · Tailwind CSS · shadcn/ui · Vercel

---

## 1. Tổng quan

Website brochure đa trang cho tiệm in ấn In Ngọc Trung. Mục tiêu chính: giới thiệu dịch vụ và kết nối khách hàng nhanh qua Messenger, Zalo, và điện thoại. Tính năng phụ: catalog thiệp cưới có thể quản lý qua admin panel, được thiết kế extensible để mở rộng sang các dịch vụ khác.

---

## 2. Design System

### Màu sắc (Pink & Clean White)
| Token | Giá trị | Dùng cho |
|-------|---------|---------|
| `primary` | `#ec4899` (pink-500) | Buttons, links, accent |
| `primary-dark` | `#be185d` (pink-700) | Hover states |
| `primary-light` | `#fce7f3` (pink-100) | Subtle backgrounds, tags |
| `background` | `#ffffff` | Nền trang |
| `surface` | `#fdf2f8` | Card, section backgrounds |
| `text-heading` | `#111827` (gray-900) | Tiêu đề |
| `text-body` | `#4b5563` (gray-600) | Nội dung |
| `text-muted` | `#9ca3af` (gray-400) | Placeholder, caption |

### Typography
- **Font:** Inter (Google Fonts) — clean, modern, dễ đọc
- **Heading:** font-weight 300–400, letter-spacing rộng, tạo cảm giác sang trọng
- **Body:** font-weight 400, line-height 1.6

### Style
- Tối giản, whitespace rộng, wedding-inspired
- Buttons: bo tròn (`rounded-full`), gradient pink (`from-pink-400 to-pink-600`)
- Cards: bo nhẹ (`rounded-xl`), shadow nhẹ, border `pink-100`
- Không dùng màu đậm ngoài accent; ưu tiên trắng + hồng nhạt

---

## 3. Cấu trúc trang

### 3.1 Trang công khai

#### `/` — Trang chủ
- **Hero:** Full-width, tagline lớn, sub-tagline, 3 CTA buttons (Messenger / Zalo / Gọi ngay)
- **Giới thiệu:** 2–3 câu về In Ngọc Trung — uy tín, chất lượng, nhanh chóng
- **Dịch vụ:** Grid 7 service cards (icon + tên + mô tả ngắn 1 dòng)
- **CTA Banner:** "Liên hệ ngay để được tư vấn miễn phí" + buttons
- **Footer:** Địa chỉ, SĐT, Messenger, Zalo, giờ hoạt động

#### `/dich-vu` — Dịch vụ
Danh sách 7 dịch vụ, mỗi dịch vụ có: tên, mô tả, ảnh minh họa, button liên hệ.

| # | Dịch vụ |
|---|---------|
| 1 | Danh thiếp / Name card |
| 2 | Banner / Backdrop / Hiflex |
| 3 | Catalogue / Tờ rơi / Brochure |
| 4 | Tem nhãn / Sticker |
| 5 | Giftnail |
| 6 | Menu |
| 7 | Thiệp cưới → link đến `/thiep-cuoi` |

#### `/thiep-cuoi` — Catalog thiệp cưới
- **Filter bar:** Chip buttons theo danh mục (Tất cả + các category)
- **Product grid:** 2 cột (mobile) / 3–4 cột (desktop)
- **Product card:** Ảnh, tên, mã SP, giá, kích thước, badge "Hết hàng" nếu cần
- **Pagination:** Server-side pagination, 20 sản phẩm/trang

#### `/thiep-cuoi/[id]` — Chi tiết thiệp
- Ảnh lớn (có thể nhiều ảnh sau này)
- Thông tin đầy đủ: tên, mã SP, giá, kích thước, số lượng tối thiểu, danh mục, mô tả
- 3 CTA buttons: Messenger, Zalo, Gọi ngay
- Breadcrumb + nút quay lại catalog

#### `/lien-he` — Liên hệ
- Tên tiệm, địa chỉ, giờ hoạt động
- Google Maps embed
- 3 buttons lớn: Messenger, Zalo, Gọi ngay
- Footer

### 3.2 Trang Admin (protected)

Toàn bộ `/admin/*` được bảo vệ bởi `middleware.ts` — redirect về `/admin/login` nếu chưa đăng nhập.

#### `/admin/login`
- Form: email + password
- Supabase Auth (`signInWithPassword`)
- Redirect về `/admin` sau khi thành công

#### `/admin` — Dashboard
- Thống kê nhanh: tổng sản phẩm, số hết hàng, số danh mục
- Shortcuts đến quản lý sản phẩm và danh mục

#### `/admin/san-pham` — Quản lý sản phẩm
- Data table: thumbnail, tên, mã SP, giá, danh mục, trạng thái, actions
- Nút "Thêm sản phẩm" → form tạo mới
- Edit/Delete per row
- Form fields: upload ảnh, tên, mô tả, mã SP, giá, kích thước (dropdown), số lượng tối thiểu, danh mục (dropdown), trạng thái (toggle)

#### `/admin/danh-muc` — Quản lý danh mục
- CRUD danh mục thiệp cưới (VD: Sang trọng, Hiện đại, Truyền thống, Tối giản, Vintage)
- Mỗi category có `name` và `catalog_type`

---

## 4. Database Schema (Supabase/PostgreSQL)

### Bảng `categories`
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
name         text NOT NULL
catalog_type text NOT NULL DEFAULT 'thiep_cuoi'
created_at   timestamptz DEFAULT now()
```

### Bảng `products`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
name          text NOT NULL
description   text
product_code  text UNIQUE NOT NULL
price         numeric(12, 0) NOT NULL        -- VND
size          text                            -- "A5", "A6", "15x15cm"...
min_quantity  integer NOT NULL DEFAULT 1
category_id   uuid REFERENCES categories(id)
catalog_type  text NOT NULL DEFAULT 'thiep_cuoi'  -- extensibility hook
status        text NOT NULL DEFAULT 'available'   -- 'available' | 'out_of_stock'
image_url     text                            -- Supabase Storage public URL
created_at    timestamptz DEFAULT now()
updated_at    timestamptz DEFAULT now()
```

**Extensibility:** Trường `catalog_type` trên cả hai bảng cho phép thêm catalog mới (VD: `'tem_nhan'`, `'danh_thiep'`) chỉ bằng cách thêm records — không cần thay đổi schema.

### Supabase Storage
- Bucket: `product-images` (public read)
- Upload từ admin → lưu public URL vào `products.image_url`

### Supabase Auth
- Chỉ 1 admin account (email + password)
- Row-level security: public chỉ đọc `products` và `categories`; write cần service role

---

## 5. Cấu trúc file (Next.js App Router)

```
in-ngoc-trung/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx            # Navbar + Footer chung
│   │   ├── page.tsx              # Trang chủ
│   │   ├── dich-vu/
│   │   │   └── page.tsx
│   │   ├── thiep-cuoi/
│   │   │   ├── page.tsx          # Catalog (Server Component + filter)
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Chi tiết
│   │   └── lien-he/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx            # Admin sidebar layout
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── page.tsx              # Dashboard
│   │   ├── san-pham/
│   │   │   ├── page.tsx          # Danh sách
│   │   │   ├── new/page.tsx      # Tạo mới
│   │   │   └── [id]/edit/page.tsx
│   │   └── danh-muc/
│   │       └── page.tsx
│   ├── api/                      # Next.js API routes (nếu cần)
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── ServicesGrid.tsx
│   │   └── CtaBanner.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilter.tsx
│   │   └── ProductForm.tsx       # Dùng cho cả add và edit
│   └── contact/
│       └── ContactButtons.tsx    # Messenger / Zalo / Phone buttons
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server-side client (cookies)
│   │   └── middleware.ts
│   └── types.ts                  # Database types (generated hoặc manual)
├── middleware.ts                 # Auth guard: /admin/* → /admin/login
└── public/
    └── images/                   # Static assets
```

---

## 6. Tích hợp liên hệ

| Kênh | Link |
|------|------|
| Messenger | `https://m.me/{PAGE_ID}` |
| Zalo | `https://zalo.me/{PHONE}` |
| Điện thoại | `tel:{PHONE}` |

- Hiển thị dạng floating buttons (bottom-right) trên mobile
- Hiển thị dạng buttons nổi bật trên desktop (Hero, footer, trang liên hệ, trang chi tiết sản phẩm)
- `{PAGE_ID}` và `{PHONE}` lưu trong `.env.local` (không hardcode)

---

## 7. Deployment

| Service | Mục đích |
|---------|---------|
| Vercel | Host Next.js (free tier) |
| Supabase | Database + Auth + Storage (free tier) |

**Environment variables cần thiết:**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_MESSENGER_PAGE_ID=
NEXT_PUBLIC_ZALO_PHONE=
NEXT_PUBLIC_PHONE=
```

---

## 8. Scope không bao gồm (v1)

- Đặt hàng online / thanh toán
- Đăng ký tài khoản cho khách
- Catalog cho các dịch vụ khác ngoài thiệp cưới (thiết kế sẵn để mở rộng)
- Đa ngôn ngữ
- Blog / tin tức
