import axios, { AxiosError, type AxiosInstance } from 'axios';
import { env } from '@/shared/config/env';
import { getAuthToken } from './auth-token';
import type { ApiError, ApiEnvelope } from '@/shared/types/api';

export const http: AxiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 30_000,
});

// Inyecta el JWT de Clerk en cada request.
http.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// Normaliza errores del backend a `ApiError`.
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: ApiError }>) => {
    const fallback: ApiError = {
      statusCode: error.response?.status ?? 0,
      code: 'NETWORK_ERROR',
      message: error.message,
      path: error.config?.url ?? '',
      timestamp: new Date().toISOString(),
    };
    const apiError = error.response?.data?.error ?? fallback;
    return Promise.reject(apiError);
  },
);

/**
 * Desempaqueta `{ data: ... }` y retorna directo la entidad de dominio.
 * Útil porque el backend siempre envuelve respuestas exitosas.
 */
export async function getData<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await http.get<ApiEnvelope<T>>(url, { params });
  return res.data.data;
}
export async function postData<T, B = unknown>(url: string, body?: B): Promise<T> {
  const res = await http.post<ApiEnvelope<T>>(url, body);
  return res.data.data;
}
export async function patchData<T, B = unknown>(url: string, body?: B): Promise<T> {
  const res = await http.patch<ApiEnvelope<T>>(url, body);
  return res.data.data;
}
export async function putData<T, B = unknown>(url: string, body?: B): Promise<T> {
  const res = await http.put<ApiEnvelope<T>>(url, body);
  return res.data.data;
}
export async function deleteData<T = void>(url: string): Promise<T> {
  const res = await http.delete<ApiEnvelope<T>>(url);
  return res.data.data;
}
