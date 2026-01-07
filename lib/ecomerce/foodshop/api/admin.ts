import { createApiClient, ApiClientOptions } from './client';
import { Product, Collection, User, AdminStats, Money, Order, CreateProductPayload, UpdateProductPayload } from '../types';

// ============================================================================
// ADMIN API CLIENT
// ============================================================================

export interface AdminApiClient {
  // Stats
  getStats: () => Promise<AdminStats>;

  // Users
  getUsers: () => Promise<User[]>;
  getUser: (id: string) => Promise<User>;

  // Products
  createProduct: (data: CreateProductPayload) => Promise<Product>;
  getProduct: (id: string) => Promise<Product>;
  updateProduct: (id: string, data: UpdateProductPayload) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;

  // Upload
  uploadFile: (file: File) => Promise<{ url: string }>;
  deleteFile: (filename: string) => Promise<void>;

  // Collections
  getCollections: () => Promise<Collection[]>;
  getCollection: (id: string) => Promise<Collection>;
  createCollection: (data: Omit<Collection, 'updatedAt'>) => Promise<Collection>;
  updateCollection: (id: string, data: Partial<Collection>) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<void>;
  
  // Orders
  getOrders: () => Promise<Order[]>;
  updateOrder: (id: string, data: { financialStatus?: string; fulfillmentStatus?: string }) => Promise<Order>;
}

export function createAdminApiClient(options: ApiClientOptions = {}): AdminApiClient {
  const client = createApiClient(options);

  return {
    // Stats
    getStats: async () => {
      return client.get<AdminStats>('/stats/');
    },

    // Users
    getUsers: async () => {
      return client.get<User[]>('/users/');
    },
    getUser: async (id: string) => {
      return client.get<User>(`/users/${id}/`);
    },

    // Products
    createProduct: async (data) => {
      return client.post<Product>('/products/', data);
    },
    getProduct: async (id) => {
        return client.get<Product>(`/products/${id}/`);
    },
    updateProduct: async (id, data) => {
      return client.patch<Product>(`/products/${id}/`, data);
    },
    deleteProduct: async (id) => {
      return client.delete<void>(`/products/${id}/`);
    },

    // Upload
    uploadFile: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return client.post<{ url: string }>('/upload/', formData);
    },
    deleteFile: async (filename: string) => {
      return client.delete<void>(`/upload/${filename}/`);
    },

    // Collections
    getCollections: async () => {
        return client.get<Collection[]>('/collections/');
    },
    getCollection: async (id) => {
        return client.get<Collection>(`/collections/${id}/`);
    },
    createCollection: async (data) => {
      return client.post<Collection>('/collections/', data);
    },
    updateCollection: async (id, data) => {
      return client.patch<Collection>(`/collections/${id}`, data);
    },
    deleteCollection: async (id) => {
      return client.delete<void>(`/collections/${id}`);
    },
    
    // Orders
    getOrders: async () => {
      return client.get<Order[]>('/orders/');
    },
    updateOrder: async (id, data) => {
      return client.patch<Order>(`/orders/${id}/`, data);
    },
  };
}
