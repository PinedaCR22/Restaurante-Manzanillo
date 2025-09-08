// src/lib/http.ts
import { getApiBaseUrl } from './env';
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  clearSession,
} from './session';

export type JsonPrimitive = string | number | boolean | null;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface ApiError {
  status: number;
  data?: unknown;
  message?: string;
}

type ApiInit = Omit<RequestInit, 'headers' | 'body'> & {
  headers?: HeadersInit;
  body?: BodyInit | unknown; // 👈 clave para evitar cast en services
  noAuth?: boolean;
  _retry?: boolean;
};

let refreshLock: Promise<void> | null = null;

function toHeaderRecord(h?: HeadersInit): Record<string, string> {
  if (!h) return {};
  if (h instanceof Headers) return Object.fromEntries(h.entries());
  if (Array.isArray(h)) return Object.fromEntries(h);
  return Object.fromEntries(Object.entries(h).map(([k, v]) => [k, String(v)]));
}

async function doRefresh(): Promise<void> {
  if (!refreshLock) {
    const rt = getRefreshToken();
    refreshLock = (async () => {
      if (!rt) throw new Error('NO_REFRESH_TOKEN');

      const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: rt }),
      });

      if (!res.ok) {
        clearSession();
        throw new Error('REFRESH_FAILED');
      }

      const data: unknown = await res.json();
      const newToken =
        typeof data === 'object' &&
        data !== null &&
        'accessToken' in data
          ? String((data as Record<string, unknown>).accessToken)
          : '';

      if (!newToken) {
        clearSession();
        throw new Error('REFRESH_NO_TOKEN');
      }
      setAccessToken(newToken);
    })().finally(() => {
      refreshLock = null;
    });
  }
  return refreshLock;
}

export async function apiFetch<T = unknown>(
  path: string,
  init: ApiInit = {},
): Promise<T> {
  const base = getApiBaseUrl();
  const url = path.startsWith('http') ? path : `${base}${path}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...toHeaderRecord(init.headers),
  };

  // Serialización del body
  const originalBody = init.body;

  const isFormLike =
    typeof originalBody === 'object' &&
    originalBody !== null &&
    (originalBody instanceof FormData ||
      originalBody instanceof Blob ||
      originalBody instanceof URLSearchParams);

  let finalBody: BodyInit | undefined;

  if (isFormLike) {
    finalBody = originalBody as BodyInit;
  } else if (
    originalBody &&
    typeof originalBody === 'object' &&
    !(originalBody instanceof ReadableStream)
  ) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
    if (headers['Content-Type']?.includes('application/json')) {
      finalBody = JSON.stringify(originalBody);
    } else {
      finalBody = originalBody as unknown as BodyInit;
    }
  } else if (typeof originalBody === 'string') {
    finalBody = originalBody;
  } else if (originalBody == null) {
    finalBody = undefined;
  } else {
    finalBody = originalBody as BodyInit;
  }

  if (!init.noAuth) {
    const token = getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...init, headers, body: finalBody });

  if (res.ok) {
    if (res.status === 204) return undefined as unknown as T;
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (undefined as unknown as T);
  }

  if (res.status === 401 && !init._retry && !init.noAuth) {
    try {
      await doRefresh();
      return apiFetch<T>(path, { ...init, _retry: true });
    } catch {
      // falló el refresh → sigue manejo de error
    }
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    data = undefined;
  }

  let message = res.statusText;
  if (typeof data === 'object' && data !== null && 'message' in data) {
    const m = (data as Record<string, unknown>).message;
    if (typeof m === 'string') message = m;
    if (Array.isArray(m)) message = m.join(', ');
  }

  const err: ApiError = { status: res.status, data, message };
  throw err;
}

export function get<T = unknown>(path: string, init?: Omit<ApiInit, 'method'>) {
  return apiFetch<T>(path, { method: 'GET', ...(init || {}) });
}
export function post<T = unknown>(
  path: string,
  body?: BodyInit | unknown,
  init?: Omit<ApiInit, 'method' | 'body'>,
) {
  return apiFetch<T>(path, { method: 'POST', body, ...(init || {}) });
}
export function patch<T = unknown>(
  path: string,
  body?: BodyInit | unknown,
  init?: Omit<ApiInit, 'method' | 'body'>,
) {
  return apiFetch<T>(path, { method: 'PATCH', body, ...(init || {}) });
}
export function del<T = unknown>(path: string, init?: Omit<ApiInit, 'method'>) {
  return apiFetch<T>(path, { method: 'DELETE', ...(init || {}) });
}
