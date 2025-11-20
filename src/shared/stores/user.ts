import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '~/entities/user/api/auth'
import { profileApi } from '~/entities/user/api/profile'
import { getAccessToken, getRefreshToken, clearTokens, setTokens } from '~/shared/api/client'
import type {
  User,
  UserProfile,
  RegisterData,
  OAuthGosuslugiRequest,
  UpdatePreferencesData,
  BeneficiaryCategory,
  BenefitCategory,
} from '~/entities/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const userProfile = ref<UserProfile | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)

  const initAuth = () => {
    if (typeof window === 'undefined') return
    
    const storedAccessToken = getAccessToken()
    const storedRefreshToken = getRefreshToken()
    
    if (storedAccessToken && storedRefreshToken) {
      accessToken.value = storedAccessToken
      refreshToken.value = storedRefreshToken
      isAuthenticated.value = true
    }
  }

  const userCategory = computed<BeneficiaryCategory | undefined>(() => {
    return user.value?.beneficiary_category
  })

  const userRegion = computed<string | undefined>(() => {
    return user.value?.region
  })

  const userInterests = computed<BenefitCategory[]>(() => {
    return userProfile.value?.preferences?.interest_categories || []
  })

  const isVerified = computed<boolean>(() => {
    return user.value?.is_verified || false
  })

  const login = async (email: string, password: string): Promise<void> => {
    try {
      isLoading.value = true
      const tokens = await authApi.login(email, password)
      accessToken.value = tokens.access
      refreshToken.value = tokens.refresh
      setTokens(tokens)
      isAuthenticated.value = true
      await fetchCurrentUser()
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    user.value = null
    userProfile.value = null
    accessToken.value = null
    refreshToken.value = null
    isAuthenticated.value = false
    clearTokens()
  }

  const register = async (data: RegisterData): Promise<void> => {
    try {
      isLoading.value = true
      const response = await authApi.register(data)
      if (response.tokens) {
        accessToken.value = response.tokens.access
        refreshToken.value = response.tokens.refresh
        setTokens(response.tokens)
        isAuthenticated.value = true
      }
      if (response.user) {
        user.value = response.user
      }
      await fetchCurrentUser()
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const oauthGosuslugi = async (data: OAuthGosuslugiRequest): Promise<void> => {
    try {
      isLoading.value = true
      const response = await authApi.oauthGosuslugi(data)
      if (response.tokens) {
        accessToken.value = response.tokens.access
        refreshToken.value = response.tokens.refresh
        setTokens(response.tokens)
        isAuthenticated.value = true
      }
      if (response.user) {
        user.value = response.user
      }
      await fetchCurrentUser()
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      if (!refreshToken.value) {
        const storedRefresh = getRefreshToken()
        if (!storedRefresh) return null
        refreshToken.value = storedRefresh
      }

      const response = await authApi.refreshToken(refreshToken.value)
      accessToken.value = response.access
      setTokens({ access: response.access, refresh: refreshToken.value })
      
      return response.access
    } catch (error) {
      await logout()
      throw error
    }
  }

  const fetchCurrentUser = async (): Promise<void> => {
    try {
      isLoading.value = true
      const currentUser = await authApi.getCurrentUser()
      user.value = currentUser
      isAuthenticated.value = true
      
      try {
        const profile = await profileApi.getProfile()
        userProfile.value = profile
      } catch (error) {
        console.warn('Failed to fetch user profile:', error)
      }
    } catch (error) {
      await logout()
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateUser = async (data: Partial<User>): Promise<void> => {
    try {
      isLoading.value = true
      const updatedUser = await authApi.updateCurrentUser(data)
      user.value = updatedUser
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
    try {
      isLoading.value = true
      const updatedProfile = await profileApi.updateProfile(data)
      userProfile.value = updatedProfile
      if (updatedProfile.id) {
        user.value = { ...user.value, ...updatedProfile } as User
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updatePreferences = async (data: UpdatePreferencesData): Promise<void> => {
    try {
      isLoading.value = true
      const updatedProfile = await profileApi.updatePreferences(data)
      userProfile.value = updatedProfile
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (current: string, newPassword: string): Promise<void> => {
    try {
      isLoading.value = true
      await authApi.changePassword(current, newPassword)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const hideBenefit = async (benefitId: number): Promise<void> => {
    try {
      isLoading.value = true
      await profileApi.hideBenefit(benefitId)
      if (userProfile.value?.preferences) {
        if (!userProfile.value.preferences.hidden_benefits) {
          userProfile.value.preferences.hidden_benefits = []
        }
        if (!userProfile.value.preferences.hidden_benefits.includes(benefitId)) {
          userProfile.value.preferences.hidden_benefits.push(benefitId)
        }
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const unhideBenefit = async (benefitId: number): Promise<void> => {
    try {
      isLoading.value = true
      await profileApi.unhideBenefit(benefitId)
      if (userProfile.value?.preferences?.hidden_benefits) {
        userProfile.value.preferences.hidden_benefits = userProfile.value.preferences.hidden_benefits.filter(
          (id) => id !== benefitId
        )
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  initAuth()

  return {
    user,
    userProfile,
    isAuthenticated,
    isLoading,
    accessToken,
    refreshToken,
    userCategory,
    userRegion,
    userInterests,
    isVerified,
    login,
    logout,
    register,
    oauthGosuslugi,
    refreshAccessToken,
    fetchCurrentUser,
    updateUser,
    updateProfile,
    updatePreferences,
    changePassword,
    hideBenefit,
    unhideBenefit,
  }
})

