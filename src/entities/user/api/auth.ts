import { apiClient } from '~/shared/api/client'
import type {
  RegisterData,
  LoginData,
  AuthResponse,
  AuthTokens,
  User,
  OAuthGosuslugiRequest,
  ChangePasswordData,
} from '../model/types'

export const authApi = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register/', data, false)
    if (response.tokens) {
      const { setTokens } = await import('~/shared/api/client')
      setTokens(response.tokens)
    }
    return response
  },

  async login(email: string, password: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/login/', { email, password }, false)
    const { setTokens } = await import('~/shared/api/client')
    setTokens(response)
    return response
  },

  async refreshToken(refresh: string): Promise<{ access: string }> {
    return apiClient.post<{ access: string }>('/auth/refresh/', { refresh }, false)
  },

  async oauthGosuslugi(data: OAuthGosuslugiRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/oauth/gosuslugi/', data, false)
    if (response.tokens) {
      const { setTokens } = await import('~/shared/api/client')
      setTokens(response.tokens)
    }
    return response
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me/')
  },

  async updateCurrentUser(data: Partial<User>): Promise<User> {
    return apiClient.patch<User>('/auth/me/', data)
  },

  async changePassword(current: string, newPassword: string): Promise<void> {
    return apiClient.post<void>('/auth/change-password/', {
      current_password: current,
      new_password: newPassword,
    })
  },
}

