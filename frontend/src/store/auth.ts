import { create } from "zustand";
import { api } from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/types/auth";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("accessToken") : false,

  login: async (data: LoginRequest) => {
    const res = await api.post<LoginResponse>("/auth/login", data);
    const { accessToken } = res.data;
    localStorage.setItem("accessToken", accessToken);
    set({ token: accessToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ token: null, isAuthenticated: false });
  },
}));
