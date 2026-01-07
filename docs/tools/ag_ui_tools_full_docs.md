# AG-UI Tools Documentation

Tài liệu mô tả các tool render UI cho Agent. Tất cả tool đều có `available: 'remote'`.

---

## 1. render_product_card

**Mục đích:** Hiển thị thẻ sản phẩm với ảnh, giá, badge giảm giá và nút thêm giỏ hàng.

### Parameters

```
product_id: string (required)
  - Định danh duy nhất của sản phẩm trong database
  - Dùng để tạo link đến trang chi tiết sản phẩm

title: string (required)
  - Tên sản phẩm hiển thị trên thẻ
  - Nên ngắn gọn, tối đa 2 dòng

price: number (required)
  - Giá bán hiện tại của sản phẩm
  - Đơn vị: VND (số nguyên, không có dấu phẩy)

image_url: string (optional)
  - URL đầy đủ của ảnh sản phẩm
  - Nếu không có, hiển thị placeholder

original_price: number (optional)
  - Giá gốc trước khi giảm giá
  - Nếu lớn hơn price, sẽ hiển thị badge phần trăm giảm và gạch ngang giá gốc

description: string (optional)
  - Mô tả ngắn về sản phẩm
  - Hiển thị dưới tiêu đề, tối đa 2 dòng

collection: string (optional)
  - Tên danh mục/bộ sưu tập chứa sản phẩm
```

---

## 2. render_order_tracking

**Mục đích:** Hiển thị theo dõi đơn hàng với timeline trạng thái, danh sách sản phẩm, địa chỉ và tổng tiền.

### Parameters

```
order_id: string (required)
  - Mã đơn hàng để hiển thị

current_status: string (required)
  - Trạng thái hiện tại của đơn hàng
  - Chỉ chấp nhận 1 trong 5 giá trị: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled"
  - Timeline sẽ tự động highlight đến bước tương ứng

total_amount: number (required)
  - Tổng tiền đơn hàng (VND)

items: object[] (required)
  - Mảng các sản phẩm trong đơn hàng
  - Mỗi object có cấu trúc:
    {
      title: string (required) - Tên sản phẩm
      quantity: number (required) - Số lượng
      price: number (required) - Đơn giá
      product_id: string (required) - ID sản phẩm để link
      image_url: string (optional) - Ảnh sản phẩm
    }

address: string (optional)
  - Địa chỉ giao hàng đầy đủ

estimated_delivery: string (optional)
  - Thời gian giao hàng dự kiến
  - Format tự do: "2-3 ngày", "Thứ 6, 10/01", v.v.

created_at: string (optional)
  - Ngày giờ đặt hàng
  - Format ISO: "2024-01-07T15:30:00Z"
```

---

## 3. render_product_comparison

**Mục đích:** So sánh 2+ sản phẩm cạnh nhau, hiển thị ưu/nhược điểm và AI recommendation.

### Parameters

```
products: object[] (required)
  - Mảng các sản phẩm cần so sánh (tối thiểu 2)
  - Mỗi object có cấu trúc:
    {
      id: string (required) - ID sản phẩm
      title: string (required) - Tên sản phẩm
      price: number (required) - Giá bán
      original_price: number (optional) - Giá gốc
      image_url: string (optional) - Ảnh sản phẩm
      best_for: string[] (optional) - Mảng text mô tả phù hợp cho ai/việc gì
      pros: string[] (optional) - Mảng các ưu điểm
      cons: string[] (optional) - Mảng các nhược điểm
    }

recommendation: object (optional)
  - Gợi ý sản phẩm tốt nhất từ AI
  - Cấu trúc:
    {
      recommended_product_id: string - ID sản phẩm được gợi ý (phải khớp với id trong products[])
      reason: string - Lý do gợi ý
    }
```

---

## 4. render_recipe_suggestion

**Mục đích:** Gợi ý công thức nấu ăn dựa trên nguyên liệu có sẵn, cho phép mua thêm nguyên liệu thiếu.

### Parameters

```
available_ingredients: object[] (required)
  - Danh sách nguyên liệu người dùng đang có
  - Mỗi object có cấu trúc:
    {
      title: string - Tên nguyên liệu
      quantity: string (optional) - Số lượng dạng text: "500g", "2 củ", v.v.
    }

suggested_recipes: object[] (required)
  - Danh sách công thức gợi ý
  - Mỗi object có cấu trúc:
    {
      id: string (required) - ID công thức
      title: string (required) - Tên món ăn
      
      required_ingredients: object[] (required) - Nguyên liệu cần thiết
        Mỗi object:
        {
          title: string (required) - Tên nguyên liệu
          quantity: string (optional) - Số lượng cần
          already_have: boolean (required) - true nếu người dùng đã có
          price: number (optional) - Giá bán nếu cần mua thêm
          product_id: string (optional) - ID sản phẩm để link mua
          image_url: string (optional) - Ảnh nguyên liệu
        }
      
      image_url: string (optional) - Ảnh món ăn
      cooking_time: number (optional) - Thời gian nấu tính bằng phút
      difficulty: string (optional) - Độ khó: "easy" | "medium" | "hard"
      servings: number (optional) - Số người ăn
    }

context_message: string (optional)
  - Tin nhắn giải thích từ AI hiển thị ở đầu component
```

---

## 5. select_options (Human-in-the-Loop)

**Mục đích:** Tạm dừng AI để hỏi người dùng lựa chọn từ danh sách.

**Đặc điểm:** Tool này BLOCKING - AI sẽ đợi người dùng chọn xong mới tiếp tục.

### Parameters

```
options: object[] (required)
  - Danh sách các lựa chọn hiển thị cho người dùng
  - Mỗi object có cấu trúc:
    {
      id: string (required) - Định danh duy nhất, sẽ được trả về khi người dùng chọn
      title: string (required) - Tên hiển thị chính
      subtitle: string (optional) - Mô tả phụ hiển thị dưới title
      image_url: string (optional) - URL ảnh minh họa
    }
  - Nếu có BẤT KỲ option nào có image_url → UI hiển thị dạng GRID (cards)
  - Nếu KHÔNG có option nào có image_url → UI hiển thị dạng LIST (checkbox)

question: string (required)
  - Câu hỏi/hướng dẫn hiển thị cho người dùng
  - Nên rõ ràng, kích thích hành động

allow_multiple: boolean (optional, default: false)
  - true: Cho phép chọn nhiều item, hiển thị checkbox
  - false: Chỉ được chọn 1 item duy nhất, chọn cái mới sẽ bỏ cái cũ
```

### Return Value

```
{
  selected_ids: string[]
}
```
- Mảng chứa các `id` của option mà người dùng đã chọn
- Nếu `allow_multiple: false` thì mảng chỉ có 1 phần tử

---

## Lưu ý chung

1. Tất cả các field `price` đều là **number** (VND), không phải string
2. Tất cả các object trong mảng đều cần có **id** duy nhất
3. URL ảnh phải là đường dẫn đầy đủ (https://...)
4. Tool `select_options` là duy nhất có tính năng Human-in-the-Loop
