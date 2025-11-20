import { apiClient } from '~/shared/api/client'
import type {
  Benefit,
  BenefitType,
  BenefitStatus,
  PaginatedResponse,
  DashboardResponse,
} from '../model/types'

export interface GetBenefitsParams {
  type?: BenefitType
  status?: BenefitStatus
  region?: string
  category?: string
  personalized?: boolean
  search?: string
  ordering?: 'created_at' | 'popularity_score' | 'valid_from'
  page?: number
}

export const benefitsApi = {
  async getBenefits(params?: GetBenefitsParams): Promise<PaginatedResponse<Benefit>> {
    return apiClient.get<PaginatedResponse<Benefit>>('/benefits/', params)
  },

  async getBenefitById(id: number): Promise<Benefit> {
    return apiClient.get<Benefit>(`/benefits/${id}/`)
  },

  async getRecommendedBenefits(): Promise<Benefit[]> {
    return apiClient.get<Benefit[]>('/benefits/recommended/')
  },

  async getDashboard(): Promise<DashboardResponse> {
    return apiClient.get<DashboardResponse>('/benefits/dashboard/')
  },
}

