# Tài Liệu Đặc Tả Nghiệp Vụ - Food Shop (Final)

Tài liệu này xác định các quy trình nghiệp vụ và quy tắc vận hành của hệ thống Food Shop. Hệ thống được thiết kế để đơn giản hóa quy trình mua sắm, tập trung vào trải nghiệm đặt hàng nhanh chóng đồng thời vẫn cung cấp công cụ quản lý bán hàng hiệu quả.

## 1. Quản lý Sản phẩm & Khuyến mại (Products & Sales)

Sản phẩm được quản lý theo mô hình phẳng, không phân cấp biến thể, phù hợp với mô hình bán đồ ăn nhanh hoặc thực phẩm đơn giản.

### 1.1. Cấu trúc Sản phẩm
Mỗi sản phẩm là một đơn vị bán hàng độc lập (Item), bao gồm:
- **Thông tin cơ bản**: Tên sản phẩm, hình ảnh minh họa, mô tả chi tiết, bộ sưu tập (Collection).
- **Trạng thái**:
    - `Active`: Sản phẩm đang bán.
    - `Draft`: Sản phẩm đang biên tập, chưa hiển thị.
    - `Archived`: Sản phẩm ngừng kinh doanh.

### 1.2. Chính sách Giá & Khuyến mại
Hệ thống hỗ trợ cơ chế giảm giá trực tiếp trên sản phẩm (Direct Sale):
- **Giá niêm yết (Original Price)**: Mức giá gốc của sản phẩm trước khi giảm.
- **Giá bán (Price)**: Mức giá thực tế khách hàng phải trả.
- **Logic hiển thị**:
    - Nếu `Price` < `Original Price` -> Sản phẩm hiển thị nhãn **"SALE"** và gạch ngang giá gốc.
    - Nếu `Original Price` để trống hoặc bằng `Price` -> Chỉ hiển thị giá bán thường.

## 2. Quy trình Mua sắm (Shopping Flow)

### 2.1. Giỏ hàng (Cart)
Giỏ hàng hoạt động như một vùng đệm tạm thời trước khi đặt hàng:
- **Thêm vào giỏ**: Khách hàng thêm trực tiếp sản phẩm (Product) vào giỏ.
- **Cập nhật**: Cho phép tăng giảm số lượng. Nếu số lượng về 0, sản phẩm tự động bị xóa khỏi giỏ.
- **Đồng bộ**: Giỏ hàng liên kết với phiên (session) của người dùng hoặc lưu cục bộ (Local Storage) đối với khách vãng lai.

### 2.2. Đặt hàng (Checkout)
Quy trình đặt hàng được tối ưu hóa để giảm thiểu thao tác (Express Checkout):
1.  **Thông tin giao hàng**: Khách hàng cung cấp Tên người nhận, SĐT liên hệ, Địa chỉ giao hàng.
2.  **Đặt hàng**:
    - Hệ thống ghi nhận đơn hàng ngay lập tức với trạng thái `Pending`.
    - **Lưu giá (Price Snapshot)**: Hệ thống sao chép giá bán của sản phẩm tại thời điểm đặt hàng vào dòng chi tiết đơn hàng (`Order Line`) để đảm bảo tính chính xác cho đối soát sau này, bất kể giá sản phẩm có thay đổi trong tương lai.
3.  **Thanh toán**: Mặc định sử dụng phương thức **Thanh toán khi nhận hàng (COD)**.

## 3. Hệ thống Quản trị (Admin Operations)

### 3.1. Quản lý Sản phẩm (Product CRUD)
Admin có toàn quyền quản lý danh mục món ăn:
- **Tạo mới (Create)**:
    - Nhập Tên, Mô tả, Giá bán.
    - Upload ảnh minh họa.
    - Set trạng thái ban đầu (thường là `Active`).
- **Xem danh sách (Read)**:
    - Xem toàn bộ sản phẩm (kể cả Draft/Archived).
    - Tìm kiếm, lọc theo Collection.
- **Cập nhật (Update)**:
    - Thay đổi giá bán để chạy Sale.
    - Cập nhật thông tin, hình ảnh.
    - Ẩn/Hiện sản phẩm (`Active` <-> `Draft`) khi hết nguyên liệu hoặc ngừng bán.
- **Xóa (Delete)**: Xóa vĩnh viễn sản phẩm khỏi hệ thống.

### 3.2. Quản lý Đơn hàng
Quy trình xử lý đơn hàng trải qua các trạng thái:
- **Mới (Pending)**: Đơn hàng vừa được tạo, chờ xác nhận.
- **Đã giao (Fulfilled)**: Đơn hàng đã được giao thành công cho khách.
- **Đã hủy (Cancelled)**: Đơn hàng bị hủy do hết hàng hoặc khách yêu cầu.
- **Thanh toán (Financial Status)**: Quản lý riêng biệt (`Paid`, `Pending`, `Refunded`) để hỗ trợ trường hợp thanh toán trước hoặc hoàn tiền.

### 3.3. Quản lý Kho & Tồn (Inventory - Simplified)
- Trong phiên bản này, hệ thống **không** quản lý số lượng tồn kho (Inventory Quantity).
- Admin kiểm soát khả năng bán hàng thông qua trạng thái của sản phẩm (`Active`/`Draft`). Nếu hết nguyên liệu, Admin chuyển sản phẩm sang trạng thái khác để ẩn khỏi menu.

### 3.4. Quản lý Danh mục (Collection Management)
Admin quản lý các nhóm sản phẩm (Collections) để tổ chức Menu:
- **Tạo mới**: Nhập Tên, Handle (slug), Mô tả và SEO.
- **Cập nhật**:
    - **Ràng buộc**: Chỉ cho phép chỉnh sửa thông tin Collection khi **không có sản phẩm nào** thuộc danh mục này. Điều này đảm bảo tính nhất quán dữ liệu trước khi thay đổi cấu trúc menu quan trọng.
- **Xóa**:
    - **Ràng buộc**: Chỉ cho phép xóa khi Collection **đang trống** (không còn sản phẩm liên kết). Nếu muốn xóa một danh mục đang có sản phẩm, Admin phải gỡ sản phẩm ra khỏi danh mục đó trước.

## 4. Xác thực & Phân quyền (Authentication)

- **Admin**: Đăng nhập qua Email/Password để truy cập Dashboard quản trị.
- **User/Guest**: Khách hàng có thể mua hàng không cần đăng nhập (Guest) hoặc đăng nhập để lưu lịch sử mua hàng.
## 5. Tìm kiếm Thông minh & AI Agent (Semantic Search & Agent)

Để hỗ trợ khách hàng tìm kiếm sản phẩm tự nhiên hơn, hệ thống tích hợp khả năng tìm kiếm theo ngữ nghĩa (Semantic Search).

### 5.1. Đồng bộ Vector (Vector Sync)
- Mỗi khi sản phẩm được tạo mới hoặc cập nhật thông tin (Tên, Mô tả, Tags), hệ thống sẽ gọi Supabase Edge Function (`embed`).
- Function này sử dụng model **gte-small** để tạo bản đại diện dạng số (Embedding).
- Các bản Embedding này được lưu trữ trong bảng `product_vectors`, liên kết 1-1 với bảng `products`.
- **Cơ chế Hash**: Hệ thống lưu mã MD5 của văn bản gốc trong cột `hash`. Mỗi khi cập nhật, hệ thống so sánh hash mới với hash cũ; nếu giống nhau thì bỏ qua việc tạo lại embedding để tiết kiệm tài nguyên.
- **Tính nhất quán**: Việc tạo vector được thực hiện thông qua **Background Task** để không làm chậm thao tác của Admin. Hệ thống sử dụng cơ chế hash để tránh tạo lại embedding nếu nội dung không đổi. Nếu việc tạo vector thất bại, sản phẩm vẫn được lưu nhưng sẽ không có vector cho đến khi được re-index.

### 5.2. AI Agent
- **Phương thức kết nối**: Agent kết nối thông qua lớp API server (không kết nối trực tiếp DB).
- **Khả năng của Agent**:
    - Tìm kiếm sản phẩm bằng ngôn ngữ tự nhiên.
    - Tư vấn món ăn dựa trên yêu cầu của khách.
    - Thực hiện các thao tác thay mặt khách hàng (như bỏ vào giỏ hàng) thông qua các Tools được định nghĩa sẵn.
- **Bảo mật**: Agent tuân thủ các quy tắc phân quyền (Permissions) giống như một Client thông thường.
