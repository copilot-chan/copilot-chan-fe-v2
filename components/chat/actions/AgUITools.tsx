import { useCopilotAction } from '@copilotkit/react-core';
import { useHumanInTheLoop } from '@copilotkit/react-core'; 
import { ProductCard } from '@/components/ag-ui/ProductCard';
import { OrderTracking, OrderStatus } from '@/components/ag-ui/OrderTracking';
import { ProductComparison } from '@/components/ag-ui/ProductComparison';
import { RecipeSuggestion } from '@/components/ag-ui/RecipeSuggestion';
import { OptionSelector, Option } from '@/components/ag-ui/OptionSelector';
import MCPToolCall from '../../ui/UIToolCall';
import { ThinkingMessage } from '../message/ThinkingMessage';
import { Product } from '@/lib/ecomerce/foodshop/types';

export function AgUITools() {
  // ... (previous tools unchanged)

  // 1. render_product_card
  useCopilotAction({
    name: 'render_product_card',
    available: 'remote',
    description: 'Render a product card with details',
    parameters: [
      { name: 'product_id', type: 'string', required: true },
      { name: 'title', type: 'string', required: true },
      { name: 'price', type: 'number', required: true },
      { name: 'image_url', type: 'string' },
      { name: 'original_price', type: 'number' },
      { name: 'description', type: 'string' },
      { name: 'collection', type: 'string' },
    ],
    render: ({ status, args, result }: any) => {
      // Use any for props to bypass strict typing issues with dynamic args
      if (status !== 'complete' || !args) {
        return <ThinkingMessage thinkingMessage="Generating product card..." />;
      }
      
      const product: Product = {
         id: args.product_id,
         handle: args.product_id,
         title: args.title,
         description: args.description || '',
         descriptionHtml: '',
         status: 'active',
         price: { amount: args.price.toString(), currencyCode: 'VND' },
         originalPrice: args.original_price ? { amount: args.original_price.toString(), currencyCode: 'VND' } : undefined,
         featuredImage: { url: args.image_url || '', altText: args.title, width: 500, height: 500 },
         images: [],
         seo: { title: args.title, description: '' },
         tags: [],
         collections: args.collection ? [args.collection] : [],
         updatedAt: new Date().toISOString(),
         vendor: '',
         productType: ''
      };

      return (
        <div className="space-y-2">
           <MCPToolCall status={status} name="render_product_card" args={args} result={result} />
           <ProductCard product={product} className="max-w-sm" />
        </div>
      );
    },
  });

  // 2. render_order_tracking
  useCopilotAction({
    name: 'render_order_tracking',
    available: 'remote',
    description: 'Render an order tracking UI',
    parameters: [
      { name: 'order_id', type: 'string', required: true },
      { name: 'current_status', type: 'string', required: true },
      { name: 'total_amount', type: 'number', required: true },
      { name: 'items', type: 'object[]', required: true, description: 'List of objects {title, quantity, price, product_id, image_url?}' },
      { name: 'address', type: 'string' },
      { name: 'estimated_delivery', type: 'string' },
      { name: 'created_at', type: 'string' },
    ],
    render: ({ status, args, result }: any) => {
      if (status !== 'complete' || !args) {
        return <ThinkingMessage thinkingMessage="Fetching order status..." />;
      }

      return (
        <div className="space-y-2">
           <MCPToolCall status={status} name="render_order_tracking" args={args} result={result} />
           <OrderTracking 
              {...args} 
              current_status={args.current_status as OrderStatus}
           />
        </div>
      );
    },
  });

  // 3. render_product_comparison
  useCopilotAction({
    name: 'render_product_comparison',
    available: 'remote',
    description: 'Compare multiple products',
    parameters: [
      { name: 'products', type: 'object[]', required: true, description: 'List of products to compare {id, title, price, original_price?, image_url?, best_for?, pros?, cons?}' },
      { name: 'recommendation', type: 'object', description: '{recommended_product_id, reason}' },
    ],
    render: ({ status, args, result }: any) => {
      if (status !== 'complete' || !args) {
        return <ThinkingMessage thinkingMessage="Comparing products..." />;
      }

      return (
        <div className="space-y-2 text-primary font-bold">
           <MCPToolCall status={status} name="render_product_comparison" args={args} result={result} />
           <ProductComparison {...args} />
        </div>
      );
    },
  });

  // 4. render_recipe_suggestion
  useCopilotAction({
    name: 'render_recipe_suggestion',
    available: 'remote',
    description: 'Suggest recipes based on ingredients',
    parameters: [
      { name: 'available_ingredients', type: 'object[]', required: true },
      { name: 'suggested_recipes', type: 'object[]', required: true, description: 'List of recipes {id, title, required_ingredients: [{title, quantity, already_have, price?, product_id?, image_url?}], image_url?, cooking_time?, difficulty?, servings?}' },
      { name: 'context_message', type: 'string' },
    ],
    render: ({ status, args, result }: any) => {
      if (status !== 'complete' || !args) {
        return <ThinkingMessage thinkingMessage="Thinking of recipes..." />;
      }

      return (
        <div className="space-y-2">
           <MCPToolCall status={status} name="render_recipe_suggestion" args={args} result={result} />
           <RecipeSuggestion {...args} />
        </div>
      );
    },
  });

  // 5. select_options (Human-in-the-Loop)
  useHumanInTheLoop({
    name: 'select_options',
    description: 'BẮT BUỘC dùng khi cần người dùng lựa chọn từ danh sách. Tool này sẽ tạm dừng xử lý của AI để đợi người dùng nhấn nút. Trả về mảng các ID đã chọn {selected_ids: string[]}. Hiển thị dạng GRID nếu có ảnh, dạng LIST nếu không có ảnh.',
    parameters: [
      { 
        name: 'options', 
        type: 'object[]', 
        required: true, 
        description: 'Mảng các lựa chọn [{id, title, image_url?}]. id: định danh duy nhất dùng để xử lý logic phía sau. title: tên món/nguyên liệu hiển thị cho người dùng. image_url: nếu có sẽ hiện dạng thẻ (Card) đẹp mắt.',
        attributes: [
          { name: 'id', type: 'string', description: 'Định danh duy nhất của lựa chọn', required: true },
          { name: 'title', type: 'string', description: 'Tên hiển thị chính cho người dùng', required: true },
          { name: 'image_url', type: 'string', description: 'Đường dẫn ảnh minh họa (nếu có)', required: false },
          { name: 'subtitle', type: 'string', description: 'Mô tả ngắn bổ sung hiển thị dưới title', required: false }
        ]
      },

      { 
        name: 'question', 
        type: 'string', 
        required: true, 
        description: 'Câu hỏi kích thích người dùng hành động. Ví dụ: "Hãy chọn 3 nguyên liệu bạn thích nhất để tôi gợi ý món ăn."' 
      },

      { 
        name: 'allow_multiple', 
        type: 'boolean', 
        description: 'NẾU TRUE: Hiện checkbox cho phép chọn nhiều món. NẾU FALSE/Omit: Chỉ được chọn 1 món duy nhất.' 
      }
    ],
    render: ({ args, respond, status }) => {
      return (
        <>
          <OptionSelector
            options={args.options as Option[]}
            question={args.question}
            allow_multiple={args.allow_multiple}
            onSubmit={(ids) => respond?.({ selected_ids: ids })}
            status={status}
          />
        </>
      )

        // if (status === 'InProgress') {
        //      if (args?.options && args?.question) {
        //          return (
        //              <OptionSelector
        //                 options={args.options as Option[]}
        //                 question={args.question}
        //                 allow_multiple={args.allow_multiple}
        //                 onSubmit={(ids) => props.respond?.({ selected_ids: ids })}
        //                 status="inProgress"
        //              />
        //          );
        //      }
        //      return <ThinkingMessage thinkingMessage="Preparing options..." />;
        // }
        
        // if (status === 'Executing') {
        //      return (
        //          <OptionSelector
        //             options={args.options as Option[]}
        //             question={args.question}
        //             allow_multiple={args.allow_multiple}
        //             onSubmit={(ids) => props.respond?.({ selected_ids: ids })}
        //             status="executing"
        //          />
        //      );
        // }

        // if (status === 'Complete') {
        //      const selectedIds = props.result?.selected_ids as string[] || [];
        //      return (
        //          <div className="space-y-2">
        //               <OptionSelector
        //                 options={args.options as Option[]}
        //                 question={args.question}
        //                 allow_multiple={args.allow_multiple}
        //                 onSubmit={() => {}}
        //                 defaultSelected={selectedIds}
        //                 status="complete"
        //               />
        //          </div>
        //      );
        // }

        // return <ThinkingMessage thinkingMessage="Preparing selection..." />;
    }
  });

  return null;
}
