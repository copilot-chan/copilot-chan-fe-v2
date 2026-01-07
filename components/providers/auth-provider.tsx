"use client";

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { User, LoginPayload, RegisterPayload, UserUpdatePayload } from "@/lib/ecomerce/foodshop/types";
import { useAuthApi } from "@/components/providers/ecommerce-api-provider";
import { toast } from "sonner";
import { createApiClient } from "@/lib/ecomerce/foodshop/api/client";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: UserUpdatePayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'foodshop_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // We can't use useAuthApi directly here because it might depend on AuthProvider 
  // or share the same context boundary issue if circular.
  // BUT: EcommerceApiProvider uses useAuth, so AuthProvider CANNOT use useEcommerceApi.
  // We must instantiate a temp client or handle logic here.
  
  // STRATEGY: 
  // 1. AuthProvider manages Token & User. 
  // 2. EcommerceApiProvider consumes AuthProvider to get Token.
  // 3. AuthProvider creates a raw client to fetch user/login.
  
  useEffect(() => {
    // Check local storage for token on mount
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      // Create a temporary client just for auth check
      const api = createApiClient({ token: authToken });
      const userData = await api.get<User>('/auth/me');
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout(); // Invalid token
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (data: LoginPayload) => {
    setLoading(true);
    try {
      const api = createApiClient({});
      
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password || '');
      formData.append('grant_type', 'password');

      const response = await api.post<{ access_token: string, user: User }>('/auth/login', formData, {
          'Content-Type': 'application/x-www-form-urlencoded'
      });
      
      const { access_token, user } = response;
      
      localStorage.setItem(TOKEN_KEY, access_token);
      setToken(access_token);
      setUser(user);
      
      toast.success(`Chào mừng trở lại, ${user.fullName || user.email}!`);
    } catch (error) {
        console.error("Login Error", error);
        toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterPayload) => {
    setLoading(true);
    try {
      const api = createApiClient({});
      await api.post('/auth/register', data);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
    } catch (error) {
        console.error("Register Error", error);
        toast.error('Đăng ký thất bại.');
        throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setLoading(false);
    toast.success('Đã đăng xuất.');
  }, []);

  const refreshUser = useCallback(async () => {
    if (token) {
        await fetchUser(token);
    }
  }, [token]);

  const updateProfile = useCallback(async (data: UserUpdatePayload) => {
    if (!token) {
      toast.error('Bạn cần đăng nhập để thực hiện thao tác này.');
      return;
    }
    try {
      const api = createApiClient({ token });
      const updatedUser = await api.patch<User>('/auth/me', data);
      setUser(updatedUser);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Cập nhật thông tin thất bại.');
      throw error;
    }
  }, [token]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser,
    updateProfile
  }), [user, token, loading, login, register, logout, refreshUser, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
