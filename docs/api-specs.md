# Tài Liệu Đặc Tả API (API Specifications) - Final Ver.

Tài liệu này mô tả các endpoint và cấu trúc dữ liệu Backend cung cấp cho Frontend (Food Shop).

**Base URL (Dev):** `http://localhost:8000`

### 🔑 Tài khoản Admin mặc định
Dùng để test các API yêu cầu quyền Admin:
- **Email:** `admin@foodshop.com`
- **Password:** `admin123`

## 1. Authentication (Xác thực) /auth

- **POST /auth/register**: Đăng ký người dùng mới.
  - *Body:* `{ "email": "user@example.com", "password": "securepassword", "full_name": "Nguyen Van A" }`
- **POST /auth/login**: Đăng nhập lấy Token.
  - *Body:* `{ "email": "user@example.com", "password": "securepassword" }`
  - *Response:* `{ "access_token": "eyJhb...", "token_type": "bearer", "user": { ...UserObject... } }`
- **GET /auth/me**: Lấy thông tin user hiện tại (Yêu cầu Header `Authorization: Bearer <token>`).
- **PATCH /auth/me**: Cập nhật thông tin cá nhân.
  - *Body:* `{ "full_name": "string", "avatar": "url" }` (Tất cả fields là optional).

## 2. Products (Sản phẩm) /products

Quản lý danh sách món ăn.

- **GET /products**: Lấy danh sách (Public).
  - *Query Params:* `q` (tìm tên), `collections_like` (slug danh mục), `_sort` (created_at), `_order` (asc/desc).
- **GET /products/{id}**: Chi tiết sản phẩm.
- **POST /products** (Admin): Tạo món mới.
  - *Body:* JSON thông tin sản phẩm (xem bên dưới).
- **PATCH /products/{id}** (Admin): Cập nhật giá/thông tin.
- **DELETE /products/{id}** (Admin): Xóa món.

### Cấu trúc dữ liệu (Product Object)
```json
{
  "id": "uuid-string",
  "handle": "ga-ran-gion",
  "title": "Gà Rán Giòn",
  "description": "Thơm ngon mời bạn ăn nha",
  "descriptionHtml": "<p>...</p>",
  "status": "active", // active | draft | archived
  "price": { "amount": "50000", "currencyCode": "VND" },
  "originalPrice": { "amount": "70000", "currencyCode": "VND" }, // Có giá trị này -> Hiển thị Sale
  "featuredImage": { "url": "https://...", "altText": "Gà rán" },
  "images": [ { "url": "...", "altText": "..." } ],
  "collections": ["menu-trang-chu", "mon-chinh"],
  "tags": ["ga-ran", "fast-food"],
  "seo": { "title": "...", "description": "..." },
  "createdAt": "2024-01-01T12:00:00Z"
}
```

## 3. Collections (Danh mục) /collections

- **GET /collections**: Lấy danh sách các Menu.
- **GET /collections/{handle}**: Chi tiết (kèm danh sách products nếu cần).
- **POST /collections** (Admin): Tạo danh mục.
- **PATCH /collections/{collection_id}** (Admin): Cập nhật thông tin danh mục.
  - *Behavior:* Chỉ sửa khi collection chưa có sản phẩm liên kết.
  - *Body:* `{ "handle": "string", "title": "string", "description": "string", "seo": { ... } }` (Tất cả fields là optional).
- **DELETE /collections/{collection_id}** (Admin): Xóa danh mục.
  - *Behavior:* Chỉ xóa khi không còn sản phẩm nào thuộc danh mục này.

## 4. Cart (Giỏ hàng) /cart

Giỏ hàng cá nhân (1 giỏ hàng cho mỗi người dùng). Yêu cầu Header `Authorization: Bearer <token>`.

- **GET /cart**: Xem giỏ hàng của người dùng hiện tại (Tự động tạo nếu chưa có).
- **POST /cart/lines**: Thêm món vào giỏ hàng.
  - *Body:* `{ "merchandiseId": "product-uuid", "quantity": 1 }`
- **PATCH /cart/lines/{productId}**: Cập nhật số lượng của một món trong giỏ.
  - *Body:* `{ "quantity": 5 }`
- **DELETE /cart/lines/{productId}**: Xóa một món khỏi giỏ hàng.
- **DELETE /cart/lines**: Xóa nhiều món khỏi giỏ hàng (Gửi danh sách ID trong body).
  - *Body:* `{ "productIds": ["uuid1", "uuid2"] }`
- **GET /cart**: Xem giỏ hàng của người dùng hiện tại.

### Cấu trúc dữ liệu (Cart Object)
```json
{
  "id": "cart-uuid",
  "lines": [
    {
      "id": "line-uuid",
      "quantity": 2,
      "cost": { "totalAmount": { "amount": "100000", "currencyCode": "VND" } },
      "merchandise": {
        "id": "product-uuid",
        "title": "Gà Rán Giòn",
        "product": { ...ProductSummary... }
      }
    }
  ],
  "cost": {
    "totalAmount": { "amount": "100000", "currencyCode": "VND" }
  }
}
```

## 5. Orders (Đơn hàng) /orders

- **POST /orders/**: Tạo đơn hàng từ giỏ hàng hiện tại (Checkout).
  - *Body:* `{ "email": "string", "shippingAddress": { "address1": "...", "city": "...", "country": "Vietnam" } }`
- **GET /orders/**: Danh sách đơn hàng của tôi.
- **GET /orders/{order_id}**: Chi tiết đơn hàng.
- **POST /orders/{order_id}/cancel**: Người dùng hủy đơn hàng (chỉ khả dụng khi đơn chưa xử lý).
- **PATCH /orders/{order_id}** (Admin only): Cập nhật trạng thái đơn hàng.


### Cấu trúc dữ liệu (Order Object)
```json
{
  "id": "order-uuid",
  "orderNumber": 1001,
  "financialStatus": "pending", // pending | paid | refunded
  "fulfillmentStatus": "unfulfilled", // unfulfilled | fulfilled
  "currentTotalPrice": { "amount": "100000", "currencyCode": "VND" },
  "lineItems": [
    {
      "title": "Gà Rán Giòn",
      "quantity": 2,
      "originalTotalPrice": { "amount": "100000", "currencyCode": "VND" }
    }
  ],
  "shippingAddress": {
    "address1": "123 Đường ABC",
    "city": "HCM",
    "country": "Vietnam"
  },
  "processedAt": "2024-01-01T12:05:00Z"
}
```

## 6. Users (Admin Only) /users
- **GET /users**: Quản lý danh sách người dùng.

## 7. Common Objects
### Money V2
```json
{ "amount": "string", "currencyCode": "VND" }
```

## 8. Menus (Menu điều hướng) /menus

Frontend sử dụng 2 menu chính: Header và Footer.

- **GET /menus?handle={menu_handle}**: Lấy menu theo handle.
  - *Handles:* `next-js-frontend-header-menu`, `next-js-frontend-footer-menu`

### Cấu trúc dữ liệu (Menu Object)
```json
{
  "handle": "string",
  "items": [
    {
      "title": "string (Tên hiển thị)",
      "path": "string (Đường dẫn nội bộ)"
    }
  ]
}
```

## 9. Pages (Trang tĩnh) /pages

Dùng cho các trang như About, Contact, Policy.

- **GET /pages?handle={handle}**: Lấy nội dung trang.

### Cấu trúc dữ liệu (Page Object)
```json
{
  "id": "uuid",
  "handle": "about-us",
  "title": "Về Chúng Tôi",
  "body": "<div>Nội dung HTML...</div>",
  "bodySummary": "Tóm tắt...",
  "seo": { "title": "...", "description": "..." },
  "createdAt": "ISO Date"
}
```

## 11. Upload (Tải lên) /upload

Dùng để upload ảnh sản phẩm/avatar.

- **POST /upload**: Upload file ảnh.
  - *Content-Type:* `multipart/form-data`
  - *Body:* `file` (Binary)
  - *Response:* `{ "url": "https://supbase.../image.jpg" }`

## 12. Common Objects
