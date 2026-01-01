# Cấu Trúc Ứng Dụng Mới (Refactoring)

## 1. Mục Tiêu
Giải quyết vấn đề xung đột Layout (`<html>` tags bị lồng nhau) và tổ chức code gọn gàng, tách biệt logic Chatbot và Ecommerce.

## 2. Thay Đổi Cấu Trúc
Sử dụng **Route Groups** của Next.js:

```
app/
├── layout.tsx              # Root Layout (Global Metadata, HTML/Body gốc)
├── globals.css
│
├── (chatbot)/              # Group cho Chatbot Logic
│   ├── layout.tsx          # Chat Providers (Auth, Context)
│   ├── page.tsx            # Homepage
│   └── chat/               # Routes chat cũ
│
└── (shop)/                 # Group Mới cho Ecommerce
    ├── layout.tsx          # Shop Providers (Cart, Navbar) - KHÔNG có html/body riêng
    └── shop/               # Base URL "/shop" (đổi tên từ "ecomerce")
        ├── page.tsx        # Shop Homepage (/shop)
        └── search/         # Shop Search (/shop/search/...)
```

## 3. URLs Mới
Đã đổi URL để ngắn gọn và đúng chính tả hơn:
- Cũ: `/ecomerce`
- **Mới**: `/shop`

Các routes chi tiết:
- Home: `/shop`
- Collections: `/shop/search/mon-chinh`
- Static Pages: `/shop/about`

## 4. Layouts Refactoring
- **`app/layout.tsx`**: Đã được làm sạch. Chỉ giữ lại `ThemeProvider` và `Toaster`. Loại bỏ các Chat Providers nặng nề khỏi Root.
- **`app/(chat)/layout.tsx`**: Chịu trách nhiệm load `AppProviders` (Auth, Chat Session...). Đảm bảo Chatbot hoạt động độc lập.
- **`app/(shop)/layout.tsx`**: Chịu trách nhiệm load `CartProvider`, `Navbar`, `Footer`. Nhẹ nhàng, tối ưu cho SEO & Performance.

## 5. Lưu Ý
- Code nội bộ (`components`, `lib`) vẫn giữ tên thư mục `ecomerce` để đảm bảo an toàn, chưa cần thiết phải đổi tên ngay (tránh break imports diện rộng).
- `db.json` đã được cập nhật đường dẫn mới.
