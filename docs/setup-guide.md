# Hướng Dẫn Cài Đặt và Chạy Dự Án (Setup Guide)

Tài liệu này hướng dẫn cách cài đặt môi trường và chạy dự án Frontend Copilot Chan (Food Shop).

## 1. Yêu cầu hệ thống (Prerequisites)

- **Node.js**: Phiên bản 18 trở lên (Khuyên dùng v20 LTS).
- **NPM**: Đi kèm với Node.js.
- **Git**: Để clone source code.

## 2. Cài đặt (Installation)

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd copilot-chan-fe-v2
   ```

2. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

## 3. Chạy Mock Backend

Dự án sử dụng `json-server` để giả lập API. Dữ liệu được lưu trong file `db.json`.

- **Lệnh chạy:**
  ```bash
  npm run json-server
  ```
- **Port mặc định:** `3001`
- **Truy cập API:** `http://localhost:3001/products`

> **Lưu ý:** Cần chạy lệnh này ở một terminal riêng biệt và giữ nó luôn chạy trong quá trình phát triển.

## 4. Chạy Frontend

- **Lệnh chạy:**
  ```bash
  npm run dev
  ```
- **Port mặc định:** `3000`
- **Truy cập Web:** `http://localhost:3000`

## 5. Cấu trúc thư mục quan trọng

- `app/`: Source code Next.js (App Router).
- `components/`: Các UI component.
- `lib/`: Các hàm tiện ích, API clients.
- `db.json`: Database giả lập cho json-server.
- `types/`: Type definitions của TypeScript.

## 6. Lỗi thường gặp

- **Lỗi không gọi được API:** Kiểm tra xem `npm run json-server` có đang chạy không và đúng port 3001 không.
- **Lỗi hiển thị ảnh:** Kiểm tra kết nối mạng vì ảnh đang dùng link Unsplash.
