import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { AxiosRequestConfig } from "axios";

interface UseApiOptions {
  method?: "get" | "post" | "put" | "delete";
  url: string;
  data?: unknown;
  config?: AxiosRequestConfig;
}

export function useApi<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (options: UseApiOptions) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.request<T>({
        method: options.method || "get",
        url: options.url,
        data: options.data,
        ...options.config,
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      let msg = "Request failed";
      if (err && typeof err === "object") {
        const e = err as { response?: { data?: { message?: string } }; message?: string };
        msg = e.response?.data?.message || e.message || msg;
      }
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}
