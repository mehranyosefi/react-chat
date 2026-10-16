export type ParamValue = string | number | boolean | null | undefined;
export type ApiRequestConfig = {
  body?: object | FormData | null;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  method?: RequestInit["method"];
  params?:  Record<string, ParamValue | ParamValue[]>;
  authorizationRequired?: boolean;
  signal?: boolean | AbortSignal;

};
export type ApiError = {
  status: number;
  statusText: string;
  data: unknown;
  headers: Record<string, string>;
  message: string;
};
