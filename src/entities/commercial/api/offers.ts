import { apiClient } from '~/shared/api/client'
import type { CommercialOffer, BenefitStatus, PaginatedResponse } from '../model/types'

export interface GetOffersParams {
  partner_category?: string
  region?: string
  personalized?: boolean
  search?: string
  ordering?: 'created_at' | 'popularity_score' | 'valid_from'
  page?: number
}

export const offersApi = {
  async getOffers(params?: GetOffersParams): Promise<PaginatedResponse<CommercialOffer>> {
    return apiClient.get<PaginatedResponse<CommercialOffer>>('/offers/', params)
  },

  async getOfferById(id: number): Promise<CommercialOffer> {
    return apiClient.get<CommercialOffer>(`/offers/${id}/`)
  },
}

