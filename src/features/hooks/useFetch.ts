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

type FetchResult<T> = {
  data: T | null;
  error: FetchError | Error | null;
};

type UseFetchReturn<T> = {
  data: T | null;
  loading: boolean;
  error: FetchError | Error | null;

  fetchData: (
    config?: FetchConfig
  ) => Promise<FetchResult<T>>;
};

/* -------------------------------------------------------------------------- */
/* API URL                                                                     */
/* -------------------------------------------------------------------------- */

const baseUrl = `${import.meta.env.VITE_BASE_URL}/api/${import.meta.env.VITE_APP_VERSION}`;

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
  defaultConfig?: FetchConfig,
  runImmediately = true,
  authorizationRequired = false
): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FetchError | Error | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Mounted state                                                            */
  /* ------------------------------------------------------------------------ */

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Token helpers                                                            */
  /* ------------------------------------------------------------------------ */

  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  const getRefreshToken = () => {
    return localStorage.getItem("refresh_token");
  };

  const setTokens = (tokens: {
    access_token: string;
    refresh_token?: string;
  }) => {
    localStorage.setItem(
      "access_token",
      tokens.access_token
    );

    if (tokens.refresh_token) {
      localStorage.setItem(
        "refresh_token",
        tokens.refresh_token
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Trigger request                                                          */
  /* ------------------------------------------------------------------------ */

  const triggerFetch = useCallback(
    async (
      requestConfig?: FetchConfig
    ): Promise<Response> => {
      // Runtime config overrides default config
      const config = {
        ...defaultConfig,
        ...requestConfig,
      };

      const accessToken = getAccessToken();

      const isFormData =
        config.body instanceof FormData;

      const defaultHeaders: Record<string, string> = {
        accept: "application/json",
      };

      /*
       * Do not set Content-Type manually for FormData.
       * Browser needs to add the multipart boundary.
       */
      if (!isFormData) {
        defaultHeaders["Content-Type"] =
          "application/json";
      }

      /*
       * Add Authorization only when this endpoint
       * requires authentication.
       */
      if (
        accessToken &&
        authorizationRequired
      ) {
        defaultHeaders["Authorization"] =
          `Bearer ${accessToken.replace(
            /^"+|"+$/g,
            ""
          )}`;
      }

      const finalHeaders: HeadersInit = {
        ...defaultHeaders,
        ...config.headers,
      };

      /*
       * Remove Content-Type for FormData.
       */
      if (isFormData) {
        delete (
          finalHeaders as Record<string, string>
        )["Content-Type"];
      }

      const finalBody = isFormData
        ? config.body
        : config.body
          ? JSON.stringify(config.body)
          : undefined;

      return fetch(makeApiUrl(url), {
        method: config.method || "GET",
        headers: finalHeaders,
        body: finalBody as BodyInit | undefined,
        cache: config.cache,
        credentials: config.credentials,
      });
    },
    [
      url,
      defaultConfig,
      authorizationRequired,
    ]
  );

  /* ------------------------------------------------------------------------ */
  /* Refresh access token                                                     */
  /* ------------------------------------------------------------------------ */

  const refreshToken = useCallback(
    async (): Promise<boolean> => {
      const refreshTokenValue =
        getRefreshToken();

      if (!refreshTokenValue) {
        return false;
      }

      /*
       * If another request is already refreshing
       * the token, wait for that request.
       */
      if (refreshTokenPromise) {
        return refreshTokenPromise;
      }

      refreshTokenPromise = (async () => {
        try {
          /*
           * Backend:
           *
           * POST /refresh
           *
           * {
           *   "refresh_token": "..."
           * }
           */
          const response = await fetch(
            makeApiUrl("refresh"),
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                accept: "application/json",
              },
              body: JSON.stringify({
                refresh_token:
                  refreshTokenValue,
              }),
            }
          );

          if (!response.ok) {
            return false;
          }

          const responseData =
            await response.json();

          /*
           * Your backend returns:
           *
           * {
           *   status: "success",
           *   data: {
           *     access_token: "..."
           *   }
           * }
           */

          if (
            responseData?.status !==
            "success"
          ) {
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
    },
    []
  );

  /* ------------------------------------------------------------------------ */
  /* Fetch data                                                                */
  /* ------------------------------------------------------------------------ */

  const fetchData = useCallback(
    async (
      requestConfig?: FetchConfig
    ): Promise<FetchResult<T>> => {
      if (mountedRef.current) {
        setLoading(true);
        setError(null);
      }

      try {
        let response =
          await triggerFetch(requestConfig);

        let responseData: any = null;

        /*
         * Try to parse JSON.
         */
        try {
          responseData =
            await response.clone().json();
        } catch {
          responseData = null;
        }

        /* ------------------------------------------------------------------ */
        /* 403 -> refresh token -> retry                                      */
        /* ------------------------------------------------------------------ */

        if (
          response.status === 403 &&
          authorizationRequired
        ) {
          const refreshed =
            await refreshToken();

          if (refreshed) {
            /*
             * Retry the original request with
             * the newly generated access token.
             */
            response =
              await triggerFetch(
                requestConfig
              );

            try {
              responseData =
                await response
                  .clone()
                  .json();
            } catch {
              responseData = null;
            }
          }
        }

        /* ------------------------------------------------------------------ */
        /* HTTP error                                                         */
        /* ------------------------------------------------------------------ */

        if (!response.ok) {
          const fetchError: FetchError = {
            status: response.status,
            statusText:
              response.statusText,
            data: responseData,
            headers:
              Object.fromEntries(
                response.headers.entries()
              ),
            message:
              responseData?.message ||
              responseData?.error ||
              `HTTP Error ${response.status}`,
          };

          if (mountedRef.current) {
            setError(fetchError);
          }

          /*
           * IMPORTANT:
           * Return the error so the caller can
           * immediately use it.
           */
          return {
            data: null,
            error: fetchError,
          };
        }

        /* ------------------------------------------------------------------ */
        /* Success                                                            */
        /* ------------------------------------------------------------------ */

        if (mountedRef.current) {
          setData(responseData);
          setError(null);
        }

        /*
         * IMPORTANT:
         * Return data so the caller can
         * immediately use it.
         */
        return {
          data: responseData as T,
          error: null,
        };
      } catch (err) {
        const fetchError =
          err instanceof Error
            ? err
            : new Error(
                "An unknown error occurred"
              );

        if (mountedRef.current) {
          setError(fetchError);
        }

        return {
          data: null,
          error: fetchError,
        };
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [
      triggerFetch,
      refreshToken,
      authorizationRequired,
    ]
  );

  /* ------------------------------------------------------------------------ */
  /* Run immediately                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (runImmediately) {
      fetchData();
    }
  }, [fetchData, runImmediately]);

  /* ------------------------------------------------------------------------ */
  /* Return                                                                   */
  /* ------------------------------------------------------------------------ */

  return {
    data,
    loading,
    error,
    fetchData,
  };
}
