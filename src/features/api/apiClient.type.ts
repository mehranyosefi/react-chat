export type ApiRequestConfig = {
  body?: object | FormData | null;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  method?: RequestInit["method"];
  authorizationRequired?: boolean;
};
export type ApiError = {
  status: number;
  statusText: string;
  data: unknown;
  headers: Record<string, string>;
  message: string;
};
