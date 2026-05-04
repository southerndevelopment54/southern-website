import { create } from "zustand";
import { api } from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/types/auth";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<boolean>;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  hydrated: false,

  hydrate: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    set({
      token,
      refreshToken,
      isAuthenticated: !!token,
      hydrated: true,
    });
  },

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
