export type ApiRequestConfig = {
  body?: object | FormData | null;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  method?: RequestInit["method"];
  authorizationRequired?: boolean;
  signal?: boolean | AbortSignal
};
export type ApiError = {
  status: number;
  statusText: string;
  data: unknown;
  headers: Record<string, string>;
  message: string;
};
