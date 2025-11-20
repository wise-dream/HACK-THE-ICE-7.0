import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { benefitsApi, type GetBenefitsParams } from '~/entities/benefit/api/benefits'
import { offersApi, type GetOffersParams } from '~/entities/commercial/api/offers'
import type {
  Benefit,
  BenefitType,
  BenefitStatus,
  BenefitCategory,
  PaginatedResponse,
  DashboardResponse,
} from '~/entities/benefit'
import type { CommercialOffer } from '~/entities/commercial'
import { getActiveBenefits, getExpiringBenefits, getBenefitStatus } from '~/shared/utils/benefits'
import type { PaginationMeta } from '~/shared/utils/api'

interface BenefitsFilters {
  type?: BenefitType
  status?: BenefitStatus
  region?: string
  category?: string
  personalized?: boolean
  ordering?: 'created_at' | 'popularity_score' | 'valid_from'
}

export const useBenefitsStore = defineStore('benefits', () => {
  const benefits = ref<Benefit[]>([])
  const commercialOffers = ref<CommercialOffer[]>([])
  const selectedBenefit = ref<Benefit | null>(null)
  const selectedOffer = ref<CommercialOffer | null>(null)
  const filters = ref<BenefitsFilters>({})
  const searchQuery = ref<string>('')
  const isLoading = ref<boolean>(false)
  const pagination = ref<PaginationMeta>({
    count: 0,
    next: null,
    previous: null,
  })
  const dashboard = ref<DashboardResponse | null>(null)

  const activeBenefits = computed<Benefit[]>(() => {
    return getActiveBenefits(benefits.value)
  })

  const expiringBenefits = computed<Benefit[]>(() => {
    return getExpiringBenefits(benefits.value, 30)
  })

  const newBenefits = computed<Benefit[]>(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return benefits.value.filter((benefit) => {
      if (!benefit.valid_from) return false
      const validFrom = new Date(benefit.valid_from)
      return validFrom >= thirtyDaysAgo
    })
  })

  const byCategory = computed(() => {
    return (category: BenefitCategory) => {
      return benefits.value.filter((benefit) => {
        return benefit.categories?.some((cat) => cat.slug === category)
      })
    }
  })

  const byType = computed(() => {
    return (type: BenefitType) => {
      return benefits.value.filter((benefit) => benefit.benefit_type === type)
    }
  })

  const allItems = computed<Array<Benefit | CommercialOffer>>(() => {
    return [...benefits.value, ...commercialOffers.value]
  })

  const fetchBenefits = async (params?: GetBenefitsParams): Promise<void> => {
    try {
      isLoading.value = true
      const response = await benefitsApi.getBenefits(params)
      benefits.value = response.results
      pagination.value = {
        count: response.count,
        next: response.next,
        previous: response.previous,
        currentPage: params?.page || 1,
        totalPages: Math.ceil(response.count / 20),
      }
      if (params) {
        filters.value = {
          type: params.type,
          status: params.status,
          region: params.region,
          category: params.category,
          personalized: params.personalized,
          ordering: params.ordering,
        }
        searchQuery.value = params.search || ''
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getBenefitById = async (id: number): Promise<void> => {
    try {
      isLoading.value = true
      const benefit = await benefitsApi.getBenefitById(id)
      selectedBenefit.value = benefit
      
      const existingIndex = benefits.value.findIndex((b) => b.id === id)
      if (existingIndex >= 0) {
        benefits.value[existingIndex] = benefit
      } else {
        benefits.value.push(benefit)
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getRecommendedBenefits = async (): Promise<void> => {
    try {
      isLoading.value = true
      const recommended = await benefitsApi.getRecommendedBenefits()
      benefits.value = recommended
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getDashboard = async (): Promise<void> => {
    try {
      isLoading.value = true
      const dashboardData = await benefitsApi.getDashboard()
      dashboard.value = dashboardData
      benefits.value = [...dashboardData.active_benefits, ...dashboardData.expiring_benefits]
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const searchBenefits = async (query: string, searchFilters?: BenefitsFilters): Promise<void> => {
    try {
      isLoading.value = true
      searchQuery.value = query
      const params: GetBenefitsParams = {
        search: query,
        ...searchFilters,
      }
      const response = await benefitsApi.getBenefits(params)
      benefits.value = response.results
      pagination.value = {
        count: response.count,
        next: response.next,
        previous: response.previous,
      }
      if (searchFilters) {
        filters.value = { ...filters.value, ...searchFilters }
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchOffers = async (params?: GetOffersParams): Promise<void> => {
    try {
      isLoading.value = true
      const response = await offersApi.getOffers(params)
      commercialOffers.value = response.results
      pagination.value = {
        count: response.count,
        next: response.next,
        previous: response.previous,
        currentPage: params?.page || 1,
        totalPages: Math.ceil(response.count / 20),
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getOfferById = async (id: number): Promise<void> => {
    try {
      isLoading.value = true
      const offer = await offersApi.getOfferById(id)
      selectedOffer.value = offer
      
      const existingIndex = commercialOffers.value.findIndex((o) => o.id === id)
      if (existingIndex >= 0) {
        commercialOffers.value[existingIndex] = offer
      } else {
        commercialOffers.value.push(offer)
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const clearFilters = (): void => {
    filters.value = {}
    searchQuery.value = ''
  }

  const setFilters = (newFilters: BenefitsFilters): void => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearSelected = (): void => {
    selectedBenefit.value = null
    selectedOffer.value = null
  }

  return {
    benefits,
    commercialOffers,
    selectedBenefit,
    selectedOffer,
    filters,
    searchQuery,
    isLoading,
    pagination,
    dashboard,
    activeBenefits,
    expiringBenefits,
    newBenefits,
    byCategory,
    byType,
    allItems,
    fetchBenefits,
    getBenefitById,
    getRecommendedBenefits,
    getDashboard,
    searchBenefits,
    fetchOffers,
    getOfferById,
    clearFilters,
    setFilters,
    clearSelected,
  }
})

