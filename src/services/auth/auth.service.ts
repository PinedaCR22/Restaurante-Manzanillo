// src/services/admin/auth/auth.service.ts
import { get, post } from '../.././lib/http';
import type { LoginDto, LoginResponse, RefreshResponse } from '../.././types/auth/auth';
import type { User } from '../.././types/auth/identity';

// LOGIN (público)
export async function login(dto: LoginDto): Promise<LoginResponse> {
  return post<LoginResponse>('/auth/login', dto, { noAuth: true });
}

// ME (protegido con accessToken)
export async function me(): Promise<User> {
  return get<User>('/auth/me');
}

// REFRESH (normalmente lo maneja http.ts automáticamente ante 401)
export async function refresh(refreshToken: string): Promise<RefreshResponse> {
  return post<RefreshResponse>('/auth/refresh', { refreshToken }, { noAuth: true });
}

// LOGOUT (revoca refresh en el back)
export async function logout(refreshToken: string): Promise<{ message: string }> {
  return post<{ message: string }>('/auth/logout', { refreshToken });
}
