import { useCallback, useEffect, useRef, useState } from "react";
import { type ApiRequestConfig, type ApiError } from "../api/apiClient.type";
import { apiClient } from "../api/apiClient";

type UseFetchReturn<T> = {
  data: T | null;
  loading: boolean;
  error: ApiError | Error | null;
  abort: () => void;
  fetchData: (config?: ApiRequestConfig) => Promise<{
    data: T | null;
    error: ApiError | Error | null;
  }>;
};

export function useFetch<T = unknown>(
  url: string,
  defaultConfig?: ApiRequestConfig,
  runImmediately = true
): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<ApiError | Error | null>(null);

  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Manual abort function exposed to consumer
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchData = useCallback(
    async (config?: ApiRequestConfig) => {
      // 1. Cancel previous pending request to prevent race conditions
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 2. Create a new AbortController for this call
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Respect an external signal if passed, otherwise use hook's controller signal
      const signal = config?.signal ?? controller.signal;

      if (mountedRef.current) {
        setLoading(true);
        setError(null);
      }

      try {
        const result = await apiClient<T>(url, {
          ...defaultConfig,
          ...config,
          signal,
        });

        if (mountedRef.current) {
          setData(result);
          setError(null);
        }

        return {
          data: result,
          error: null,
        };
      } catch (err) {
        // Ignore AbortError / Canceled requests
        const isAbortError =
          (err instanceof DOMException && err.name === "AbortError") ||
          (err instanceof Error && err.name === "AbortError");
        if (isAbortError) {
          // Do not update error state when intentionally aborted
          return {
            data: null,
            error: null,
          };
        }

        const apiError = err instanceof Error ? err : new Error("Unknown error");

        if (mountedRef.current) {
          setError(apiError);
        }

        return {
          data: null,
          error: apiError,
        };
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
          if (mountedRef.current) {
            setLoading(false);
          }
        }
      }
    },
    [url, defaultConfig]
  );

  useEffect(() => {
    if (runImmediately) {
      fetchData();
    }
  }, [fetchData, runImmediately]);

  return {
    data,
    loading,
    error,
    abort,
    fetchData,
  };
}
