# Tài Liệu Mô Tả Nghiệp Vụ (Business Logic)

Tài liệu này mô tả chi tiết các phân hệ và tính năng nghiệp vụ hiện có trong ứng dụng Copilot Chan.

## 1. Shop Module (E-commerce)

Phân hệ bán hàng dành cho khách hàng (End User).

### 1.1. Cấu trúc & Layout
- **URL Base:** `/` (Trang chủ), `/shop/*`
- **Layout:** Sử dụng `Navbar` (Header) và `Footer` chung.
- **Providers:**
  - `EcommerceApiProvider`: Cung cấp context để gọi API (Product, Collection, Cart).
  - `CartProvider`: Quản lý trạng thái giỏ hàng (thêm/sửa/xóa, tính tổng tiền).

### 1.2. Tính năng chính
- **Trang chủ (`/`):**
  - Hiển thị Carousel banner.
  - Hiển thị danh sách sản phẩm nổi bật (Featured Products).
  - Footer điều hướng.
- **Danh sách sản phẩm (`/shop` hoặc Collection):**
  - Xem danh sách sản phẩm theo danh mục (Collection).
  - Lọc/Sort sản phẩm.
- **Chi tiết sản phẩm (`/product/[handle]`):**
  - Xem thông tin chi tiết: Tên, giá, mô tả, ảnh gallery.
  - Chọn Variant (Size, Topping...).
  - Button "Add to Cart".
  - Gợi ý sản phẩm liên quan.
- **Giỏ hàng (Cart):**
  - Drawer hoặc Modal hiển thị danh sách sản phẩm đã chọn.
  - Tăng/giảm số lượng.
  - Xóa sản phẩm khỏi giỏ.
  - Hiển thị tạm tính (Subtotal).
- **Thanh toán (Checkout):**
  - Chuyển hướng đến trang Checkout (hiện tại logic checkout đang mock hoặc xử lý đơn giản).
- **Tìm kiếm (`/search`):**
  - Tìm kiếm sản phẩm theo từ khóa.

## 2. Admin Module (Quản trị)

Phân hệ quản trị dành cho Admin/Editor để quản lý cửa hàng.

### 2.1. Cấu trúc & Layout
- **URL Base:** `/admin`
- **Authentication:** Yêu cầu đăng nhập (xử lý qua middleware/auth provider).
- **Layout:** Sidebar menu điều hướng riêng.

### 2.2. Tính năng chính
- **Dashboard (`/admin/dashboard`):**
  - Xem thống kê tổng quan (Doanh thu, Đơn hàng, Sản phẩm, Users).
  - Biểu đồ (Placeholder/Demo).
- **Quản lý Sản phẩm (`/admin/products`):**
  - Xem danh sách sản phẩm (có phân trang/lọc).
  - **Tạo mới:** Form nhập thông tin sản phẩm (Title, Description, Price, Image, Collections).
  - **Chỉnh sửa:** Cập nhật thông tin chi tiết.
  - **Xóa:** Xóa sản phẩm (Soft delete hoặc Hard delete tùy API).
  - Quản lý Variants và Inventory (đang phát triển).
- **Quản lý Danh mục (`/admin/collections`):**
  - CRUD (Tạo/Xem/Sửa/Xóa) danh mục sản phẩm.
  - Gán sản phẩm vào danh mục.
- **Quản lý Người dùng (`/admin/users`):**
  - Xem danh sách người dùng.
  - Phân quyền (Role-based access control: Admin, Editor, User).

## 3. Chat Module (Copilot Bot)

Phân hệ Chatbot AI tích hợp.

### 3.1. Cấu trúc & Layout
- **URL Base:** `/chat`, `/c/[id]`
- **Authentication:** Bắt buộc đăng nhập.
- **Layout:** Giao diện Chat chuyên biệt (Sidebar trái lịch sử chat, Main content là khung chat).

### 3.2. Tính năng chính
- **Hội thoại (Conversation):**
  - Tạo đoạn chat mới (New Chat).
  - Xem lại lịch sử chat cũ (History).
  - Gửi tin nhắn và nhận phản hồi từ AI (Streaming response).
- **Quản lý Session:**
  - Lưu trữ session chat theo User.
  - Đổi tên/Xóa đoạn chat.
- **Settings:**
  - Cấu hình Model/System Prompt (tùy quyền hạn).
- **Integration:**
  - Có khả năng tích hợp context từ Shop (ví dụ hỏi "Tìm cho tôi món ăn nào ngon?").

## 4. Authentication (Xác thực)

- **Login/Register:** Form đăng nhập/đăng ký.
- **Provider:** Sử dụng Auth Provider (có thể là NextAuth, Supabase, hoặc Custom JWT).
- **Middleware:** Bảo vệ các route `/admin` và `/chat`.

## 5. System Architecture (Kiến trúc hệ thống)

- **Frontend:** Next.js 14+ (App Router).
- **UI Components:** Shadcn/ui (Radix UI + Tailwind CSS).
- **Data Fetching:**
  - Client-side: Sử dụng Custom Hooks + API Client (`lib/api`).
  - Server-side: React Server Components (RSC) cho SEO và init data.
- **State Management:**
  - React Context (Cart, Auth).
  - React Query (hoặc custom hooks tương tự) cho data caching.
