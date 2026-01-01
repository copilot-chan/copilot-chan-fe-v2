import { createApiClient, ApiClientOptions } from './client';
import { Product, Collection, User, AdminStats, Money } from '../types';

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
  createProduct: (data: Omit<Product, 'id' | 'updatedAt' | 'createdAt'>) => Promise<Product>;
  getProduct: (id: string) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;

  // Collections
  getCollections: () => Promise<Collection[]>;
  getCollection: (id: string) => Promise<Collection>;
  createCollection: (data: Omit<Collection, 'updatedAt'>) => Promise<Collection>;
  updateCollection: (id: string, data: Partial<Collection>) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<void>;
}

export function createAdminApiClient(options: ApiClientOptions = {}): AdminApiClient {
  const client = createApiClient(options);

  return {
    // Stats
    getStats: async () => {
      return client.get<AdminStats>('/stats');
    },

    // Users
    getUsers: async () => {
      return client.get<User[]>('/users');
    },
    getUser: async (id: string) => {
      return client.get<User>(`/users/${id}`);
    },

    // Products
    createProduct: async (data) => {
      return client.post<Product>('/products', data);
    },
    getProduct: async (id) => {
        return client.get<Product>(`/products/${id}`);
    },
    updateProduct: async (id, data) => {
      return client.patch<Product>(`/products/${id}`, data);
    },
    deleteProduct: async (id) => {
      return client.delete<void>(`/products/${id}`);
    },

    // Collections
    getCollections: async () => {
        return client.get<Collection[]>('/collections');
    },
    getCollection: async (id) => {
        return client.get<Collection>(`/collections/${id}`);
    },
    createCollection: async (data) => {
      return client.post<Collection>('/collections', data);
    },
    updateCollection: async (id, data) => {
      return client.patch<Collection>(`/collections/${id}`, data);
    },
    deleteCollection: async (id) => {
      return client.delete<void>(`/collections/${id}`);
    },
  };
}
