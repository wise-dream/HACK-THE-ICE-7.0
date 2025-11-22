import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category, Region } from '~/entities/benefit'
import { referencesApi } from '~/shared/api/references'

export const useReferencesStore = defineStore('references', () => {
  const categories = ref<Category[]>([])
  const regions = ref<Region[]>([])
  const isLoading = ref<boolean>(false)
  const isInitialized = ref<boolean>(false)

  const getCategoryBySlug = (slug: string): Category | undefined => {
    return categories.value.find((category) => category.slug === slug)
  }

  const getRegionByCode = (code: string): Region | undefined => {
    return regions.value.find((region) => region.code === code)
  }

  const fetchCategories = async (force = false): Promise<void> => {
    if (isInitialized.value && categories.value.length > 0 && !force) {
      return
    }

    try {
      isLoading.value = true
      const fetchedCategories = await referencesApi.getCategories()
      categories.value = fetchedCategories
      isInitialized.value = true
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchRegions = async (force = false): Promise<void> => {
    if (isInitialized.value && regions.value.length > 0 && !force) {
      return
    }

    try {
      isLoading.value = true
      const fetchedRegions = await referencesApi.getRegions()
      regions.value = fetchedRegions
      isInitialized.value = true
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const initialize = async (): Promise<void> => {
    if (isInitialized.value) {
      return
    }

    try {
      isLoading.value = true
      await Promise.all([fetchCategories(true), fetchRegions(true)])
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const clearCache = (): void => {
    categories.value = []
    regions.value = []
    isInitialized.value = false
  }

  return {
    categories,
    regions,
    isLoading,
    isInitialized,
    getCategoryBySlug,
    getRegionByCode,
    fetchCategories,
    fetchRegions,
    initialize,
    clearCache,
  }
})
