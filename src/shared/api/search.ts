import type { Benefit, SearchDetailsRequest, SearchResponse } from '~/entities/benefit'
import type { CommercialOffer } from '~/entities/commercial'
import { apiClient } from './client'

export const searchApi = {
  async search(query: string): Promise<SearchResponse> {
    return apiClient.post<SearchResponse>('/search/', { query })
  },

  async getSearchDetails(
    items: Array<{ type: 'benefit' | 'commercial'; id: number }>
  ): Promise<Array<Benefit | CommercialOffer>> {
    return apiClient.post<Array<Benefit | CommercialOffer>>('/search/details/', {
      items,
    } as SearchDetailsRequest)
  },
}
