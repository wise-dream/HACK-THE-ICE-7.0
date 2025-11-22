import type { Category, Region } from '~/entities/benefit'
import { apiClient } from './client'

export const referencesApi = {
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories/')
  },

  async getCategoryById(id: number): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}/`)
  },

  async getRegions(): Promise<Region[]> {
    return apiClient.get<Region[]>('/regions/')
  },

  async getRegionById(id: number): Promise<Region> {
    return apiClient.get<Region>(`/regions/${id}/`)
  },
}
