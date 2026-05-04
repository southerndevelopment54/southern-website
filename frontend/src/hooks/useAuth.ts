import { useAuthStore } from "@/store/auth";

export function useAuth() {
  const { token, isAuthenticated, login, logout } = useAuthStore();
  return { token, isAuthenticated, login, logout };
}
