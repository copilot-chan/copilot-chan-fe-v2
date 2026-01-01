# Hướng Dẫn Mở Rộng Hệ Thống Ecommerce

Tài liệu này hướng dẫn cách thêm tính năng mới, ví dụ: **Bộ lọc theo giá (Price Filter)**.

---

## 1. Cơ Chế Hoạt Động Hiện Tại
Hệ thống sử dụng **Mock Data** với `json-server`.
- **Frontend**: Next.js gọi API thông qua `lib/ecomerce/foodshop/api/*.ts`.
- **Backend (Fake)**: `json-server` chạy ở port 3001, phục vụ data từ `db.json`.

---

## 2. Ví Dụ: Thêm Bộ Lọc Theo Giá

Giả sử bạn muốn thêm bộ lọc: "Dưới 50k", "50k - 100k".

### Bước 1: Cập Nhật UI (Danh sách Filter)

Tạo component hiển thị filter hoặc thêm vào `components/ecomerce/layout/search/filter`:

```typescript
// Ví dụ items cho filter giá
const priceFilters = [
  { title: 'Dưới 50k', slug: 'price-under-50', path: '/shop/search?maxPrice=50000' },
  { title: '50k - 100k', slug: 'price-50-100', path: '/shop/search?minPrice=50000&maxPrice=100000' }
];
```

### Bước 2: Cập Nhật API Client (`lib/ecomerce/foodshop/api/products.ts`)

Cần sửa hàm `getProducts` để nhận và xử lý tham số `minPrice`, `maxPrice`.

```typescript
// 1. Cập nhật Type
export type GetProductsParams = {
  query?: string;
  sortKey?: string;
  reverse?: boolean;
  minPrice?: string; // Thêm tham số mới
  maxPrice?: string;
};

// 2. Cập nhật Hàm getProducts
export async function getProducts(params: GetProductsParams = {}): Promise<Product[]> {
  const { query, sortKey, reverse, minPrice, maxPrice } = params;
  let endpoint = '/products?';
  const queryParams: string[] = [];

  // ... (logic cũ)

  // Thêm logic cho Price Filter (cú pháp của json-server)
  if (minPrice) {
    // Lưu ý: Mock data cấu trúc price hơi phức tạp (priceRange.minVariantPrice.amount)
    // JSON Server nested filter:
    queryParams.push(`priceRange.minVariantPrice.amount_gte=${minPrice}`);
  }
  if (maxPrice) {
    queryParams.push(`priceRange.minVariantPrice.amount_lte=${maxPrice}`);
  }

  // ...
}
```

### Bước 3: Cập Nhật Page (`app/(shop)/shop/search/page.tsx`)

Cần truyền search params từ URL vào hàm `getProducts`.

```typescript
export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue, minPrice, maxPrice } = searchParams as { [key: string]: string };
  // ...
  const products = await getProducts({ 
    query: searchValue, 
    reverse, 
    sortKey,
    minPrice, // Truyền vào API
    maxPrice 
  });
  // ...
}
```

---

## 3. Các Loại Mở Rộng Khác

### Thêm Sorting Option Mới
1.  Vào `lib/ecomerce/constants.ts`, thêm item vào mảng `sorting`.
    ```typescript
    { title: 'Tên A-Z', slug: 'title-asc', sortKey: 'TITLE', reverse: false }
    ```
2.  Vào `lib/ecomerce/foodshop/api/products.ts`, cập nhật map `getSortField`:
    ```typescript
    const sortMap = {
      // ...
      TITLE: 'title', // Field name trong db.json
    };
    ```

### Thêm Dữ Liệu Mới (Product Field)
1.  Mở `db.json`, thêm trường mới vào products (ví dụ: `rating: 5`).
2.  Mở `lib/ecomerce/foodshop/types.ts`, cập nhật interface `Product`.
3.  Hiển thị trường mới này ở UI (ví dụ trong `components/ecomerce/grid/tile.tsx`).

---

## 4. Chuyển Sang Real Backend
Khi bạn có backend thật:
1.  Đổi `NEXT_PUBLIC_ECOMMERCE_API_URL` trong `.env`.
2.  Sửa logic trong `lib/ecomerce/foodshop/api/*.ts` nếu backend mới có cấu trúc URL query khác với `json-server`.
    *   Ví dụ: Backend thật dùng `?min_price=...` thay vì `?amount_gte=...`.
