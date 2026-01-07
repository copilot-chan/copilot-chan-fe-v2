# Tài Liệu Đặc Tả API (API Specifications)

Tài liệu này mô tả các endpoint và cấu trúc dữ liệu cần thiết để Backend cung cấp cho Frontend Copilot Chan hoạt động (Phiên bản Food Shop).

Hiện tại, dự án đang sử dụng `json-server` làm mock backend. Backend thực tế cần đảm bảo trả về dữ liệu đúng theo cấu trúc JSON dưới đây.

**Base URL (Dev):** `http://localhost:3001`

## 1. Products (Sản phẩm)

### Endpoints
- **Lấy danh sách:** `GET /products`
  - *Query Params:*
    - `q`: Tìm kiếm theo tên
    - `collections_like`: Lọc theo handle của collection
    - `_sort`: Sắp xếp (ví dụ: `createdAt`)
    - `_order`: Thứ tự (`asc`, `desc`)
- **Chi tiết:** `GET /products?handle={handle}` (Hoặc `GET /products/{id}`)
- **Tạo mới (Admin):** `POST /products`
  - *Body:* `Omit<Product, 'id' | 'updatedAt' | 'createdAt'>`
- **Cập nhật (Admin):** `PATCH /products/{id}`
  - *Body:* `Partial<Product>`
- **Xóa (Admin):** `DELETE /products/{id}`

### Cấu trúc dữ liệu (Product Object)
```json
{
  "id": "string",
  "handle": "string (slug-duy-nhat)",
  "title": "string (Tên sản phẩm)",
  "description": "string (Mô tả ngắn)",
  "descriptionHtml": "string (Mô tả định dạng HTML)",
  "availableForSale": "boolean",
  "status": "active | draft | archived",
  "priceRange": {
    "maxVariantPrice": { "amount": "string", "currencyCode": "VND" },
    "minVariantPrice": { "amount": "string", "currencyCode": "VND" }
  },
  "featuredImage": {
    "url": "string (URL ảnh)",
    "altText": "string",
    "width": "number",
    "height": "number"
  },
  "images": [
    { "url": "string", "altText": "string", "width": "number", "height": "number" }
  ],
  "options": [
    {
      "id": "string",
      "name": "string (Ví dụ: Size, Topping)",
      "values": ["string"]
    }
  ],
  "variants": [
    {
      "id": "string",
      "title": "string (Tên variant)",
      "availableForSale": "boolean",
      "selectedOptions": [
        { "name": "string", "value": "string" }
      ],
      "price": { "amount": "string", "currencyCode": "VND" }
    }
  ],
  "collections": ["string (list of collection handles)"],
  "tags": ["string"],
  "seo": { "title": "string", "description": "string" },
  "updatedAt": "ISO Date String"
}
```

## 2. Collections (Danh mục)

### Endpoints
- **Lấy danh sách:** `GET /collections`
- **Chi tiết:** `GET /collections?handle={handle}`
- **Tạo mới (Admin):** `POST /collections`
- **Cập nhật (Admin):** `PATCH /collections/{id}`
- **Xóa (Admin):** `DELETE /collections/{id}`

### Cấu trúc dữ liệu (Collection Object)
```json
{
  "handle": "string (slug)",
  "title": "string (Tên danh mục)",
  "description": "string",
  "seo": { "title": "string", "description": "string" },
  "updatedAt": "ISO Date String",
  "path": "string (e.g. /shop/search/handle)"
}
```

## 3. Users (Người dùng)

### Endpoints
- **Lấy danh sách:** `GET /users`
- **Chi tiết:** `GET /users/{id}`

### Cấu trúc dữ liệu (User Object)
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "admin | editor | user",
  "avatar": "string (URL)",
  "createdAt": "ISO Date String",
  "updatedAt": "ISO Date String"
}
```

## 4. Dashboard Stats (Thống kê)
- **Endpoint:** `GET /stats`

### Cấu trúc dữ liệu (AdminStats Object)
```json
{
  "totalRevenue": { "amount": "string", "currencyCode": "VND" },
  "totalOrders": "number",
  "totalProducts": "number",
  "totalUsers": "number"
}
```

## 5. Menus (Menu điều hướng)

Frontend sử dụng 2 menu chính: Header và Footer.

- **Endpoint:** `GET /menus?handle={menu_handle}`
- **Menu Handles:** `next-js-frontend-header-menu`, `next-js-frontend-footer-menu`

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

## 6. Pages (Trang tĩnh)

Dùng cho các trang như About, Contact, Policy.

- **Endpoint:** `GET /pages?handle={handle}`

### Cấu trúc dữ liệu (Page Object)
```json
{
  "id": "string",
  "handle": "string",
  "title": "string",
  "body": "string (Nội dung HTML chính)",
  "bodySummary": "string (Tóm tắt)",
  "seo": { "title": "string", "description": "string" },
  "createdAt": "ISO Date String",
  "updatedAt": "ISO Date String"
}
```

## 7. Cart (Giỏ hàng)

*Lưu ý: Mock hoặc API thật.*

- **GET /cart?id={cartId}**: Lấy thông tin.
- **POST /cart**: Tạo mới.
- **POST /cart/add**: Thêm sản phẩm.
- **POST /cart/update**: Cập nhật số lượng.
- **POST /cart/remove**: Xóa sản phẩm.

### Cấu trúc dữ liệu (Cart Object)
```json
{
  "id": "string",
  "checkoutUrl": "string",
  "totalQuantity": "number",
  "cost": {
    "subtotalAmount": { "amount": "string", "currencyCode": "VND" },
    "totalAmount": { "amount": "string", "currencyCode": "VND" },
    "totalTaxAmount": { "amount": "string", "currencyCode": "VND" }
  },
  "lines": [
    {
      "id": "string",
      "quantity": "number",
      "cost": { "totalAmount": { "amount": "string", "currencyCode": "VND" } },
      "merchandise": {
        "id": "string (Variant ID)",
        "title": "string",
        "product": { ...ProductSummary... }
      }
    }
  ]
}
```
