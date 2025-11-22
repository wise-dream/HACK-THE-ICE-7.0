import { apiClient } from '~/shared/api/client'
import type {
  HideBenefitRequest,
  UnhideBenefitRequest,
  UpdatePreferencesData,
  UserProfile,
} from '../model/types'

export const profileApi = {
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/profile/')
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return apiClient.patch<UserProfile>('/profile/', data)
  },

  async updatePreferences(data: UpdatePreferencesData): Promise<UserProfile> {
    return apiClient.patch<UserProfile>('/profile/', data)
  },

  async hideBenefit(benefitId: number): Promise<void> {
    return apiClient.post<void>('/profile/hide_benefit/', {
      benefit_id: benefitId,
    } as HideBenefitRequest)
  },

  async unhideBenefit(benefitId: number): Promise<void> {
    return apiClient.post<void>('/profile/unhide_benefit/', {
      benefit_id: benefitId,
    } as UnhideBenefitRequest)
  },
}
