import { ApiError, ApiRequestConfig } from "./apiClient.type";

const baseUrl =
  `${import.meta.env.VITE_BASE_URL}/api/` +
  `${import.meta.env.VITE_APP_VERSION}`;

const makeApiUrl = (url: string) => {
  // If the url is already a full http/https URL, don't prepend baseUrl again
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return `${baseUrl.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
};

function appendQueryParams(
  url: string,
  params?: Record<string, unknown> | URLSearchParams,
): string {
  if (!params) return url;

  // Use a dummy base so URL can parse any relative or absolute path safely
  const dummyBase = "http://localhost";
  const urlObj = new URL(url, dummyBase);

  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => {
      urlObj.searchParams.append(key, value);
    });
  } else {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v !== undefined && v !== null) {
              urlObj.searchParams.append(key, String(v));
            }
          });
        } else {
          urlObj.searchParams.set(key, String(value));
        }
      }
    });
  }

  if (/^https?:\/\//i.test(url)) {
    return urlObj.toString();
  }

  const queryString = urlObj.search;
  const pathname = url.startsWith("/") ? urlObj.pathname : urlObj.pathname.replace(/^\//, "");
  return `${pathname}${queryString}`;
}

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
  localStorage.setItem("access_token", tokens.access_token);

  if (tokens.refresh_token) {
    localStorage.setItem("refresh_token", tokens.refresh_token);
  }
};

const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

let refreshTokenPromise: Promise<boolean> | null = null;
const refreshAccessToken = async (): Promise<boolean> => {
  const refreshTokenValue = getRefreshToken();

  if (!refreshTokenValue) {
    return false;
  }

  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      const response = await fetch(makeApiUrl("refresh"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshTokenValue,
        }),
      });

      if (!response.ok) {
        clearTokens();
        return false;
      }

      const data = await response.json();

      if (data?.status !== "success" || !data?.data?.access_token) {
        clearTokens();
        return false;
      }

      setTokens(data.data);
      return true;
    } catch {
      clearTokens();
      return false;
    } finally {
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
};

async function parseResponse(response: Response): Promise<unknown> {
  try {
    return await response.clone().json();
  } catch {
    return null;
  }
}

function createApiError(response: Response, data: unknown): ApiError {
  const responseData = data as {
    message?: string;
    error?: string;
  } | null;

  return {
    status: response.status,
    statusText: response.statusText,
    data,
    headers: Object.fromEntries(response.headers.entries()),
    message:
      responseData?.message ||
      responseData?.error ||
      `HTTP Error ${response.status}`,
  };
}

export async function apiClient<T>(
  url: string,
  config: ApiRequestConfig = {},
): Promise<T> {
  const { authorizationRequired = false, ...requestConfig } = config;

  let response = await executeRequest(
    url,
    requestConfig,
    authorizationRequired,
  );

  if (response.status === 401 && authorizationRequired) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      response = await executeRequest(
        url,
        requestConfig,
        authorizationRequired,
      );
    }
  }

  const responseData = await parseResponse(response);

  if (!response.ok) {
    throw createApiError(response, responseData);
  }

  return responseData as T;
}

async function executeRequest(
  url: string,
  config: Omit<ApiRequestConfig, "authorizationRequired">,
  authorizationRequired: boolean,
): Promise<Response> {
  const accessToken = getAccessToken();
  const method = (config.method || "GET").toUpperCase();
  const isFormData = config.body instanceof FormData;

  const headers: Record<string, string> = {
    accept: "application/json",
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (accessToken && authorizationRequired) {
    headers["Authorization"] = `Bearer ${accessToken.replace(/^"+|"+$/g, "")}`;
  }

  const finalHeaders: HeadersInit = {
    ...headers,
    ...config.headers,
  };

  if (isFormData) {
    delete (finalHeaders as Record<string, string>)["Content-Type"];
  }

  const isGetOrHead = method === "GET" || method === "HEAD";
  const body = isGetOrHead
    ? undefined
    : isFormData
      ? (config.body as FormData)
      : config.body !== undefined
        ? JSON.stringify(config.body)
        : undefined;

  const urlWithParams = appendQueryParams(url, config.params);

  const finalUrl = makeApiUrl(urlWithParams);

  return fetch(finalUrl, {
    method,
    headers: finalHeaders,
    body,
    cache: config.cache,
    credentials: config.credentials,
  });
}
