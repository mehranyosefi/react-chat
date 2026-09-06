import { useCallback, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type FetchConfig = {
  body?: object | FormData | null;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  method?: RequestInit["method"];
};

type FetchError = {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  message: string;
};

type UseFetchReturn<T> = {
  data: T | null;
  loading: boolean;
  error: FetchError | Error | null;
  fetchData: () => Promise<void>;
};

/* -------------------------------------------------------------------------- */
/* API URL                                                                     */
/* -------------------------------------------------------------------------- */

const baseUrl = `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_APP_VERSION}/api`;

const makeApiUrl = (url: string) => {
  return `${baseUrl.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
};

/* -------------------------------------------------------------------------- */
/* Token refresh lock                                                         */
/* -------------------------------------------------------------------------- */

// Prevent multiple requests from refreshing the token simultaneously.
let refreshTokenPromise: Promise<boolean> | null = null;

/* -------------------------------------------------------------------------- */
/* useFetch                                                                    */
/* -------------------------------------------------------------------------- */

export function useFetch<T = any>(
  url: string,
  config?: FetchConfig,
  runImmediately = true
): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FetchError | Error | null>(null);

  // Prevent state updates after component unmounts.
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const getAccessToken = () => {
    // Replace this with your actual React auth/store implementation.
    return localStorage.getItem("access_token");
  };

  const getRefreshToken = () => {
    // Replace this with your actual React auth/store implementation.
    return localStorage.getItem("refresh_token");
  };

  const setTokens = (tokens: {
    access_token: string;
    refresh_token?: string;
  }) => {
    localStorage.setItem("access_token", tokens.access_token);

    if (tokens.refresh_token) {
      localStorage.setItem("refresh_token", tokens.refresh_token);
    }
  };


  const triggerFetch = useCallback(async (): Promise<Response> => {
    const accessToken = getAccessToken();

    const isFormData = config?.body instanceof FormData;

    const defaultHeaders: Record<string, string> = {
      accept: "application/json",
    };

    // Do not set Content-Type for FormData.
    // The browser needs to set multipart/form-data + boundary itself.
    if (!isFormData) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    if (accessToken) {
      defaultHeaders["Authorization"] =
        `Bearer ${accessToken.replace(/^"+|"+$/g, "")}`;
    }

    const finalHeaders: HeadersInit = {
      ...defaultHeaders,
      ...config?.headers,
    };

    if (isFormData && "Content-Type" in finalHeaders) {
      delete (finalHeaders as Record<string, string>)["Content-Type"];
    }

    const finalBody = isFormData
      ? config?.body
      : config?.body
        ? JSON.stringify(config.body)
        : undefined;

    return fetch(makeApiUrl(url), {
      method: config?.method || "GET",
      headers: finalHeaders,
      body: finalBody as BodyInit | undefined,
      cache: config?.cache,
      credentials: config?.credentials,
    });
  }, [url, config]);

  /* ------------------------------------------------------------------------ */
  /* Refresh token                                                            */
  /* ------------------------------------------------------------------------ */

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const refreshTokenValue = getRefreshToken();

    if (!refreshTokenValue) {
      return false;
    }

    // If another request is already refreshing the token,
    // wait for that request instead of creating another one.
    if (refreshTokenPromise) {
      return refreshTokenPromise;
    }

    refreshTokenPromise = (async () => {
      try {
        const response = await fetch(
          makeApiUrl(`refresh?token=${encodeURIComponent(refreshTokenValue)}`),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          return false;
        }

        const responseData = await response.json();

        if (!responseData?.ok) {
          return false;
        }

        setTokens(responseData.data);

        return true;
      } catch {
        return false;
      } finally {
        refreshTokenPromise = null;
      }
    })();

    return refreshTokenPromise;
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Fetch data                                                                */
  /* ------------------------------------------------------------------------ */

  const fetchData = useCallback(async () => {
    if (mountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      let response = await triggerFetch();

      let responseData: any = null;

      try {
        responseData = await response.clone().json();
      } catch {
        responseData = null;
      }

      /* -------------------------------------------------------------------- */
      /* 403 -> refresh token -> retry                                        */
      /* -------------------------------------------------------------------- */

      if (response.status === 403) {
        const refreshed = await refreshToken();

        if (refreshed) {
          response = await triggerFetch();

          try {
            responseData = await response.clone().json();
          } catch {
            responseData = null;
          }
        }
      }

      /* -------------------------------------------------------------------- */
      /* Handle HTTP errors                                                   */
      /* -------------------------------------------------------------------- */

      if (!response.ok) {
        const fetchError: FetchError = {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
          headers: Object.fromEntries(response.headers.entries()),
          message:
            responseData?.message ||
            responseData?.error ||
            `HTTP Error ${response.status}`,
        };

        if (mountedRef.current) {
          setError(fetchError);
        }

        return;
      }

      /* -------------------------------------------------------------------- */
      /* Success                                                              */
      /* -------------------------------------------------------------------- */

      if (mountedRef.current) {
        setData(responseData);
        setError(null);
      }
    } catch (err) {
      if (!mountedRef.current) {
        return;
      }

      setError(
        err instanceof Error
          ? err
          : new Error("An unknown error occurred")
      );
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [triggerFetch, refreshToken]);

  /* ------------------------------------------------------------------------ */
  /* Run immediately                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (runImmediately) {
      fetchData();
    }
  }, [fetchData, runImmediately]);

  return {
    data,
    loading,
    error,
    fetchData,
  };
}