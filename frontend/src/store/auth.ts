import { create } from "zustand";
import { api } from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/types/auth";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("accessToken") : false,

  login: async (data: LoginRequest) => {
    const res = await api.post<LoginResponse>("/auth/login", data);
    const { accessToken, refreshToken } = res.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({ token: accessToken, refreshToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ token: null, refreshToken: null, isAuthenticated: false });
  },

  refresh: async () => {
    const rt = get().refreshToken;
    if (!rt) return false;
    try {
      const res = await api.post<LoginResponse>("/auth/refresh", null, { params: { refreshToken: rt } });
      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      set({ token: accessToken, refreshToken, isAuthenticated: true });
      return true;
    } catch {
      get().logout();
      return false;
    }
  },
}));
