/**
 * Ecommerce Type Definitions
 * Định nghĩa tất cả types cho foodshop module
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type SEO = {
  title: string;
  description: string;
};

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export type Product = {
  id: string;
  handle: string;
  // availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  
  // Pricing (New Spec)
  price: Money;
  originalPrice?: Money; // Optional, displaying sale if present & > price

  featuredImage: Image;
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
  
  // Collections
  collections: string[]; 
  status: 'active' | 'draft' | 'archived';
  vendor: string;
  productType: string;

  // Deprecated / Removed in New Spec
  // variants: never; 
  // options: never;
  // priceRange: never;
};

export type ProductImageInput = {
  url: string;
  altText: string;
};

export type CreateProductPayload = {
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  status: 'active' | 'draft' | 'archived';
  price: number;
  originalPrice?: number;
  featuredImage: string; // URL
  images?: ProductImageInput[]; // Gallery Objects
  tags: string[];
  collections: string[];
  seo: SEO;
  vendor: string;
  productType: string;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

// ============================================================================
// COLLECTION TYPES
// ============================================================================

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
  path: string;
};

// ============================================================================
// CART TYPES
// ============================================================================

export type CartItem = {
  id: string | undefined;
  quantity: number;
  merchandiseId?: string; // For API payloads
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string; // Product ID (since no variants)
    title: string;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: Image;
      price: Money;
    };
  };
};

export type Cart = {
  id: string | undefined;
  cost: {
    totalAmount: Money;
  };
  lines: CartItem[];
  totalQuantity: number;
};

// ============================================================================
// ORDER TYPES (NEW)
// ============================================================================

export type OrderLineItem = {
  title: string;
  quantity: number;
  originalTotalPrice: Money;
};

export type OrderShippingAddress = {
  address1: string;
  city: string;
  country: string;
};

export type Order = {
  id: string;
  email: string;
  orderNumber: number;
  financialStatus: 'pending' | 'paid' | 'refunded';
  fulfillmentStatus: 'unfulfilled' | 'fulfilled';
  currentTotalPrice: Money;
  lineItems: OrderLineItem[];
  shippingAddress: OrderShippingAddress;
  processedAt: string;
};

export type CreateOrderPayload = {
  email: string;
  shippingAddress: OrderShippingAddress;
};

// ============================================================================
// AUTH & USER TYPES (NEW)
// ============================================================================

export type UserRole = 'admin' | 'editor' | 'user';

export type User = {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatar?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export type LoginPayload = {
  email: string;
  password?: string;
};

export type RegisterPayload = {
  email: string;
  password?: string;
  fullName?: string;
  avatar?: string;
  role?: UserRole;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export type UserUpdatePayload = {
  fullName?: string;
  avatar?: string;
};

// ============================================================================
// MENU & PAGE TYPES
// ============================================================================

export type Menu = {
  title: string;
  path: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

// ============================================================================
// ADMIN STATS
// ============================================================================

export type AdminStats = {
  totalRevenue: Money;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
};

// ============================================================================
// API PARAMS
// ============================================================================

export type GetProductsParams = {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  collections_like?: string;
  _sort?: string;
  _order?: 'asc' | 'desc';
};


