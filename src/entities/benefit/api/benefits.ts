import { apiClient } from '~/shared/api/client'
import type { QueryParamValue } from '~/shared/api/client'
import { mockBenefits } from '../model/mock-data'
import type {
  Benefit,
  BenefitStatus,
  BenefitType,
  DashboardResponse,
  PaginatedResponse,
} from '../model/types'
import { getActiveBenefits, getExpiringBenefits } from '~/shared/utils/benefits'

export interface GetBenefitsParams {
  type?: BenefitType
  status?: BenefitStatus
  region?: string
  category?: string
  personalized?: boolean
  search?: string
  ordering?:
    | 'created_at'
    | 'popularity_score'
    | 'valid_from'
    | '-created_at'
    | '-popularity_score'
    | '-valid_from'
  page?: number
  [key: string]: string | number | boolean | undefined
}

const USE_MOCK_DATA = process.env.NUXT_PUBLIC_USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development'

const filterMockBenefits = (params?: GetBenefitsParams): Benefit[] => {
  let filtered = [...mockBenefits]

  if (params?.search) {
    const query = params.search.toLowerCase()
    filtered = filtered.filter(
      (benefit) =>
        benefit.title.toLowerCase().includes(query) ||
        benefit.description.toLowerCase().includes(query)
    )
  }

  if (params?.type) {
    filtered = filtered.filter((benefit) => benefit.benefit_type === params.type)
  }

  if (params?.category) {
    filtered = filtered.filter((benefit) =>
      benefit.categories?.some((cat) => cat.slug === params.category)
    )
  }

  if (params?.status) {
    if (params.status === 'active') {
      filtered = filtered.filter((benefit) => {
        const active = getActiveBenefits([benefit])
        return active.length > 0
      })
    } else if (params.status === 'expiring_soon') {
      filtered = filtered.filter((benefit) => {
        const expiring = getExpiringBenefits([benefit], 30)
        return expiring.length > 0
      })
    }
  }

  if (params?.ordering) {
    const isDesc = params.ordering.startsWith('-')
    const orderBy = isDesc ? params.ordering.slice(1) : params.ordering

    filtered.sort((a, b) => {
      let aValue: number | string = 0
      let bValue: number | string = 0

      if (orderBy === 'popularity_score') {
        aValue = a.popularity_score || 0
        bValue = b.popularity_score || 0
      } else if (orderBy === 'valid_from') {
        aValue = a.valid_from
        bValue = b.valid_from
      } else if (orderBy === 'created_at') {
        aValue = a.created_at || a.valid_from
        bValue = b.created_at || b.valid_from
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return isDesc
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue)
      }

      return isDesc ? (bValue as number) - (aValue as number) : (aValue as number) - (bValue as number)
    })
  }

  return filtered
}

const generateMockDashboard = (): DashboardResponse => {
  const active = getActiveBenefits(mockBenefits)
  const expiring = getExpiringBenefits(mockBenefits, 30)

  return {
    active_count: active.length,
    expiring_count: expiring.length,
    active_benefits: active,
    expiring_benefits: expiring,
  }
}

export const benefitsApi = {
  async getBenefits(params?: GetBenefitsParams): Promise<PaginatedResponse<Benefit>> {
    if (USE_MOCK_DATA) {
      const filtered = filterMockBenefits(params)
      const page = params?.page || 1
      const pageSize = 20
      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        count: filtered.length,
        next: end < filtered.length ? `?page=${page + 1}` : null,
        previous: page > 1 ? `?page=${page - 1}` : null,
        results: filtered.slice(start, end),
      }
    }

    try {
      return await apiClient.get<PaginatedResponse<Benefit>>(
        '/benefits/',
        params as Record<string, QueryParamValue>
      )
    } catch (error) {
      // Fallback to mock data if API fails
      const filtered = filterMockBenefits(params)
      const page = params?.page || 1
      const pageSize = 20
      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        count: filtered.length,
        next: end < filtered.length ? `?page=${page + 1}` : null,
        previous: page > 1 ? `?page=${page - 1}` : null,
        results: filtered.slice(start, end),
      }
    }
  },

  async getBenefitById(id: number): Promise<Benefit> {
    if (USE_MOCK_DATA) {
      const benefit = mockBenefits.find((b) => b.id === id)
      if (benefit) return benefit
      throw new Error(`Benefit with id ${id} not found`)
    }

    try {
      return await apiClient.get<Benefit>(`/benefits/${id}/`)
    } catch (error) {
      // Fallback to mock data if API fails
      const benefit = mockBenefits.find((b) => b.id === id)
      if (benefit) return benefit
      throw error
    }
  },

  async getRecommendedBenefits(): Promise<Benefit[]> {
    if (USE_MOCK_DATA) {
      return mockBenefits
        .filter((b) => b.popularity_score && b.popularity_score >= 7.5)
        .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
        .slice(0, 10)
    }

    try {
      return await apiClient.get<Benefit[]>('/benefits/recommended/')
    } catch (error) {
      // Fallback to mock data if API fails
      return mockBenefits
        .filter((b) => b.popularity_score && b.popularity_score >= 7.5)
        .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
        .slice(0, 10)
    }
  },

  async getDashboard(): Promise<DashboardResponse> {
    if (USE_MOCK_DATA) {
      return generateMockDashboard()
    }

    try {
      return await apiClient.get<DashboardResponse>('/benefits/dashboard/')
    } catch (error) {
      // Fallback to mock data if API fails
      return generateMockDashboard()
    }
  },
}
