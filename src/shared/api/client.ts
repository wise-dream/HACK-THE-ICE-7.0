import type { AuthTokens } from '~/entities/user'

interface NuxtWindow extends Window {
  __NUXT__?: {
    config?: {
      public?: {
        apiBase?: string
      }
    }
  }
}

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const nuxtWindow = window as NuxtWindow
    return (
      nuxtWindow.__NUXT__?.config?.public?.apiBase ||
      process.env.NUXT_PUBLIC_API_BASE ||
      'http://localhost:8000/api'
    )
  }
  return process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
}

let accessToken: string | null = null
let refreshToken: string | null = null

export const setTokens = (tokens: AuthTokens) => {
  accessToken = tokens.access
  refreshToken = tokens.refresh
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
  }
}

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined' && !accessToken) {
    accessToken = localStorage.getItem('access_token')
  }
  return accessToken
}

export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined' && !refreshToken) {
    refreshToken = localStorage.getItem('refresh_token')
  }
  return refreshToken
}

export const clearTokens = () => {
  accessToken = null
  refreshToken = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
}

const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = getRefreshToken()
  if (!refresh) return null

  try {
    const ApiBaseUrl = getApiBaseUrl()
    const response = await fetch(`${ApiBaseUrl}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
    if (!response.ok) throw new Error('Token refresh failed')
    const data = await response.json()
    accessToken = data.access
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access)
    }
    return data.access
  } catch (error) {
    clearTokens()
    throw error
  }
}

export type QueryParamValue = string | number | boolean | (string | number)[] | undefined | null

interface ApiError {
  status?: number
  message?: string
  response?: {
    data?: Record<string, string | string[]>
  }
  [key: string]: unknown
}

export const apiClient = {
  async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
      body?: unknown
      params?: Record<string, QueryParamValue>
      headers?: Record<string, string>
      requireAuth?: boolean
    } = {}
  ): Promise<T> {
    const { method = 'GET', body, params, headers = {}, requireAuth = true } = options

    const ApiBaseUrl = getApiBaseUrl()
    const url = new URL(endpoint, ApiBaseUrl)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    }

    if (requireAuth) {
      const token = getAccessToken()
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }))
        throw { status: response.status, ...error }
      }
      return await response.json()
    } catch (error: unknown) {
      const apiError = error as ApiError
      if (apiError.status === 401 && requireAuth) {
        const newToken = await refreshAccessToken()
        if (newToken) {
          requestHeaders.Authorization = `Bearer ${newToken}`
          const retryResponse = await fetch(url.toString(), {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
          })
          if (!retryResponse.ok) {
            const retryError = await retryResponse
              .json()
              .catch(() => ({ message: retryResponse.statusText }))
            throw { status: retryResponse.status, ...retryError }
          }
          return await retryResponse.json()
        }
      }
      throw error
    }
  },

  get<T>(
    endpoint: string,
    params?: Record<string, QueryParamValue>,
    requireAuth = true
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params, requireAuth })
  },

  post<T>(endpoint: string, body?: unknown, requireAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, requireAuth })
  },

  patch<T>(endpoint: string, body?: unknown, requireAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, requireAuth })
  },

  put<T>(endpoint: string, body?: unknown, requireAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, requireAuth })
  },

  delete<T>(endpoint: string, requireAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', requireAuth })
  },
}
