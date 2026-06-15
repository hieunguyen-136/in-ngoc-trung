// lib/data.ts
import type { Product } from './types'

export const PRODUCTS: Product[] = [
  { code: 'TC-001', name: 'Thiệp Hồng Ngọc',       size: '18 × 18 cm', price: 12000, cat: 'Sang trọng',   status: 'in',
    desc: 'Thiệp ép kim ánh hồng trên giấy mỹ thuật cao cấp, viền nhũ tinh tế — lựa chọn sang trọng cho ngày trọng đại.' },
  { code: 'TC-002', name: 'Thiệp Lụa Vàng',        size: '15 × 20 cm', price: 15000, cat: 'Sang trọng',   status: 'in',
    desc: 'Bề mặt lụa mịn, chữ ép nhũ vàng nổi bật, kèm phong bì cùng tông — đẳng cấp và trang nhã.' },
  { code: 'TC-003', name: 'Thiệp Tối Giản Trắng',  size: '13 × 18 cm', price:  8000, cat: 'Tối giản',     status: 'in',
    desc: 'Thiết kế tối giản, nhiều khoảng trắng, typography thanh mảnh — dành cho cặp đôi yêu sự tinh gọn.' },
  { code: 'TC-004', name: 'Thiệp Hiện Đại Xanh',   size: '14 × 14 cm', price: 10000, cat: 'Hiện đại',     status: 'out',
    desc: 'Bảng màu xanh pastel hiện đại, bố cục vuông vắn, in offset sắc nét trên giấy couche.' },
  { code: 'TC-005', name: 'Thiệp Vintage Hoa',     size: '15 × 15 cm', price: 13000, cat: 'Vintage',      status: 'in',
    desc: 'Hoạ tiết hoa cổ điển, tông màu trầm ấm gợi nhớ — phong cách vintage lãng mạn.' },
  { code: 'TC-006', name: 'Thiệp Truyền Thống Đỏ', size: '18 × 24 cm', price: 14000, cat: 'Truyền thống', status: 'in',
    desc: 'Sắc đỏ may mắn, hoa văn song hỷ truyền thống, ép kim vàng rực rỡ cho đám cưới đậm chất Việt.' },
  { code: 'TC-007', name: 'Thiệp Pastel Mộng Mơ',  size: '14 × 19 cm', price: 11000, cat: 'Hiện đại',     status: 'in',
    desc: 'Gam pastel nhẹ nhàng, hoạ tiết watercolor mềm mại — trẻ trung và ngọt ngào.' },
  { code: 'TC-008', name: 'Thiệp Gấm Hoàng Gia',   size: '16 × 22 cm', price: 18000, cat: 'Sang trọng',   status: 'out',
    desc: 'Hoạ tiết gấm hoàng gia, ép nhũ vàng đồng, giấy mỹ thuật dày dặn — sang trọng bậc nhất.' },
  { code: 'TC-009', name: 'Thiệp Lá Cọ Tropical',  size: '15 × 15 cm', price: 12000, cat: 'Hiện đại',     status: 'in',
    desc: 'Hoạ tiết lá cọ nhiệt đới tươi mát, phù hợp tiệc cưới ngoài trời, sân vườn.' },
  { code: 'TC-010', name: 'Thiệp Cổ Điển Kem',     size: '13 × 18 cm', price:  9000, cat: 'Vintage',      status: 'in',
    desc: 'Tông kem cổ điển, font serif thanh lịch, viền ren tinh tế — vẻ đẹp vượt thời gian.' },
  { code: 'TC-011', name: 'Thiệp Tối Giản Be',     size: '14 × 14 cm', price:  8500, cat: 'Tối giản',     status: 'in',
    desc: 'Nền be trung tính, chi tiết tối giản, ép chìm tinh tế — gọn gàng mà vẫn cao cấp.' },
  { code: 'TC-012', name: 'Thiệp Sen Vàng',        size: '18 × 18 cm', price: 16000, cat: 'Truyền thống', status: 'in',
    desc: 'Hoạ tiết hoa sen ép nhũ vàng, biểu tượng thuần khiết — trang trọng và ý nghĩa.' },
]

export function getProductByCode(code: string): Product | undefined {
  return PRODUCTS.find(p => p.code === code)
}

export function getProductsByCategory(cat: string): Product[] {
  if (cat === 'Tất cả') return PRODUCTS
  return PRODUCTS.filter(p => p.cat === cat)
}
