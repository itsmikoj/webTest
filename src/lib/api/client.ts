import { BACKEND_URL } from "@/config/constants";
import { getAccessToken, refreshTokenAction } from "@/lib/actions/auth";

interface FetchOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
  params?: Record<string, string | number>;
}

export class ApiError extends Error {
  status: number;
  info?: any;

  constructor(message: string, status: number, info?: any) {
    super(message);
    this.status = status;
    this.info = info;
    this.name = "ApiError";
  }
}

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.baseUrl = BACKEND_URL!;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number>,
  ): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.append(key, value.toString()),
      );
    }
    return url.toString();
  }

  private async getAuthHeaders(
    additionalHeaders?: HeadersInit,
  ): Promise<Record<string, string>> {
    const token = await getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (additionalHeaders instanceof Headers) {
      additionalHeaders.forEach((value, key) => (headers[key] = value));
    } else if (Array.isArray(additionalHeaders)) {
      additionalHeaders.forEach(([key, value]) => (headers[key] = value));
    } else if (additionalHeaders) {
      Object.assign(headers, additionalHeaders);
    }

    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise;

    this.isRefreshing = true;
    this.refreshPromise = refreshTokenAction()
      .then((result) => result.success)
      .catch(() => false)
      .finally(() => {
        this.isRefreshing = false;
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    method: string,
    options: FetchOptions = {},
    body?: any,
    isRetry = false,
  ): Promise<T> {
    const { revalidate, tags, params, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    const headers = await this.getAuthHeaders(fetchOptions.headers);

    const config: RequestInit = { ...fetchOptions, method, headers };

    if (method === "GET") {
      config.next = {
        revalidate: revalidate ?? 3600,
        tags: tags || [],
      };
    } else {
      config.cache = "no-store";
      if (body) config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (response.status === 401 && !isRetry) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed)
        return this.request<T>(endpoint, method, options, body, true);

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      throw new ApiError("Sesión expirada", 401);
    }

    if (!response.ok) {
      const errorInfo = await response
        .json()
        .catch(() => ({ message: "Error desconocido" }));
      throw new ApiError(
        errorInfo.message || `Error HTTP: ${response.status}`,
        response.status,
        errorInfo,
      );
    }

    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {} as T;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const text = await response.text();
      return text ? JSON.parse(text) : ({} as T);
    }

    return {} as T;
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, "GET", options);
  }

  async post<T>(
    endpoint: string,
    body: any,
    options?: FetchOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, "POST", options, body);
  }

  async put<T>(
    endpoint: string,
    body: any,
    options?: FetchOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, "PUT", options, body);
  }

  async patch<T>(
    endpoint: string,
    body: any,
    options?: FetchOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, "PATCH", options, body);
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, "DELETE", options);
  }
}

export const api = new ApiClient();
