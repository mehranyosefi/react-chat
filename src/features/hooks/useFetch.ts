import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  apiClient,
  type ApiError,
  type ApiRequestConfig,
} from "../api/apiClient";

type UseFetchReturn<T> = {
  data: T | null;
  loading: boolean;
  error: ApiError | Error | null;

  fetchData: (
    config?: ApiRequestConfig,
  ) => Promise<{
    data: T | null;
    error: ApiError | Error | null;
  }>;
};

export function useFetch<T = unknown>(
  url: string,
  defaultConfig?: ApiRequestConfig,
  runImmediately = true,
): UseFetchReturn<T> {
  const [data, setData] =
    useState<T | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<
      ApiError | Error | null
    >(null);

  const mountedRef =
    useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchData = useCallback(
    async (
      config?: ApiRequestConfig,
    ) => {
      if (mountedRef.current) {
        setLoading(true);
        setError(null);
      }

      try {
        const result =
          await apiClient<T>(
            url,
            {
              ...defaultConfig,
              ...config,
            },
          );

        if (mountedRef.current) {
          setData(result);
          setError(null);
        }

        return {
          data: result,
          error: null,
        };
      } catch (err) {
        const apiError =
          err instanceof Error
            ? err
            : new Error(
                "Unknown error",
              );

        if (mountedRef.current) {
          setError(apiError);
        }

        return {
          data: null,
          error: apiError,
        };
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [url, defaultConfig],
  );

  useEffect(() => {
    if (runImmediately) {
      fetchData();
    }
  }, [
    fetchData,
    runImmediately,
  ]);

  return {
    data,
    loading,
    error,
    fetchData,
  };
}