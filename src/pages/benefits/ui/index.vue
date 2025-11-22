<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Benefit, BenefitType, BenefitStatus } from '~/entities/benefit'
import { useBenefitsStore, useReferencesStore, useUserStore } from '~/shared/stores'

const benefitsStore = useBenefitsStore()
const referencesStore = useReferencesStore()
const userStore = useUserStore()

const isLoading = ref(false)
const searchQuery = ref('')
const selectedType = ref<BenefitType | 'all'>('all')
const selectedStatus = ref<BenefitStatus | 'all'>('all')
const selectedCategory = ref<string>('all')
const selectedRegion = ref<string>('all')
const sortBy = ref<'created_at' | 'popularity_score' | 'valid_from'>('popularity_score')
const currentPage = ref(1)

const displayedBenefits = computed(() => {
  let items: Benefit[] = benefitsStore.benefits

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    items = items.filter(
      (benefit) => benefit.title.toLowerCase().includes(query) || benefit.description.toLowerCase().includes(query)
    )
  }

  if (selectedType.value !== 'all') {
    items = items.filter((benefit) => benefit.benefit_type === selectedType.value)
  }

  if (selectedStatus.value !== 'all') {
    items = items.filter((benefit) => {
      const now = new Date()
      const validFrom = new Date(benefit.valid_from)
      const validUntil =
        benefit.valid_until || benefit.valid_to ? new Date(benefit.valid_until || benefit.valid_to!) : null
      const daysUntilExpiry = validUntil
        ? Math.floor((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null

      if (selectedStatus.value === 'active') {
        return !validUntil || (daysUntilExpiry !== null && daysUntilExpiry > 30)
      }
      if (selectedStatus.value === 'expiring_soon') {
        return daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0
      }
      if (selectedStatus.value === 'expired') {
        return daysUntilExpiry !== null && daysUntilExpiry <= 0
      }
      if (selectedStatus.value === 'requires_verification') {
        return benefit.requires_verification === true
      }
      return true
    })
  }

  if (selectedCategory.value !== 'all') {
    items = items.filter((benefit) => benefit.categories?.some((cat) => cat.slug === selectedCategory.value))
  }

  if (selectedRegion.value !== 'all' && userStore.user?.region) {
    items = items.filter(
      (benefit) =>
        benefit.applies_to_all_regions ||
        benefit.regions?.some((reg) => reg.code === selectedRegion.value) ||
        benefit.regions?.length === 0
    )
  }

  if (userStore.userProfile?.preferences?.hidden_benefits) {
    const hiddenIds = userStore.userProfile.preferences.hidden_benefits
    items = items.filter((benefit) => !benefit.id || !hiddenIds.includes(benefit.id))
  }

  items.sort((a, b) => {
    if (sortBy.value === 'popularity_score') {
      return (b.popularity_score || 0) - (a.popularity_score || 0)
    }
    if (sortBy.value === 'created_at') {
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    }
    if (sortBy.value === 'valid_from') {
      return new Date(b.valid_from).getTime() - new Date(a.valid_from).getTime()
    }
    return 0
  })

  return items
})

const paginatedBenefits = computed(() => {
  const pageSize = 12
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return displayedBenefits.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(displayedBenefits.value.length / 12)
})

const hasResults = computed(() => displayedBenefits.value.length > 0)

const loadBenefits = async () => {
  try {
    isLoading.value = true
    await referencesStore.initialize()
    await benefitsStore.fetchBenefits({
      search: searchQuery.value || undefined,
      type: selectedType.value !== 'all' ? selectedType.value : undefined,
      category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined,
      region: selectedRegion.value !== 'all' ? selectedRegion.value : undefined,
      ordering: sortBy.value,
      page: currentPage.value,
    })
  } catch (error) {
    console.error('Failed to load benefits:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadBenefits()
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = 'all'
  selectedStatus.value = 'all'
  selectedCategory.value = 'all'
  selectedRegion.value = 'all'
  sortBy.value = 'popularity_score'
  currentPage.value = 1
  loadBenefits()
}

const goToPage = (page: number) => {
  currentPage.value = page
  loadBenefits()
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getBenefitStatusLabel = (benefit: Benefit): string => {
  const validUntilStr = benefit.valid_until || benefit.valid_to
  if (!validUntilStr) {
    return 'Активна'
  }
  const now = new Date()
  const validUntil = new Date(validUntilStr)
  const daysUntilExpiry = Math.floor((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry <= 0) {
    return 'Истекла'
  }
  if (daysUntilExpiry <= 30) {
    return 'Скоро истекает'
  }
  return 'Активна'
}

const getBenefitTypeLabel = (type: BenefitType): string => {
  const labels: Record<BenefitType, string> = {
    federal: 'Федеральная',
    regional: 'Региональная',
    municipal: 'Муниципальная',
  }
  return labels[type] || type
}

onMounted(() => {
  loadBenefits()
})
</script>

<template>
    <main class="mx-auto max-w-7xl px-4 py-6">
      <header class="mb-6">
        <h1 id="benefits-title" class="text-3xl font-semibold text-text-main mb-2">Каталог льгот</h1>
        <p id="benefits-description" class="text-base text-text-muted">
          Найдите подходящие льготы и скидки по вашим критериям
        </p>
      </header>

      <div class="flex flex-col lg:flex-row gap-6">
        <aside class="lg:w-64 flex-shrink-0" aria-label="Фильтры поиска">
          <div class="sticky top-6 space-y-4">
            <section class="rounded-lg border border-bg-elevated bg-bg-elevated p-4" aria-labelledby="search-title">
              <h2 id="search-title" class="text-lg font-medium text-text-main mb-4">Поиск</h2>
              <div class="space-y-2">
                <label for="search-input" class="sr-only">Поиск по названию и описанию</label>
                <input
                  id="search-input"
                  v-model="searchQuery"
                  type="search"
                  placeholder="Введите запрос..."
                  class="w-full rounded-lg border border-bg-elevated bg-bg-main px-4 py-2 text-base text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  aria-describedby="search-description"
                  @keyup.enter="handleSearch"
                />
                <p id="search-description" class="sr-only">Введите текст для поиска льгот</p>
                <button
                  type="button"
                  @click="handleSearch"
                  class="w-full rounded-lg bg-brand-primary px-4 py-2 text-base font-medium text-white hover:bg-brand-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                  aria-label="Выполнить поиск"
                >
                  Найти
                </button>
              </div>
            </section>

            <section class="rounded-lg border border-bg-elevated bg-bg-elevated p-4" aria-labelledby="filters-title">
              <div class="flex items-center justify-between mb-4">
                <h2 id="filters-title" class="text-lg font-medium text-text-main">Фильтры</h2>
                <button
                  type="button"
                  @click="clearFilters"
                  class="text-sm text-brand-primary hover:text-brand-primary/80 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded"
                  aria-label="Сбросить все фильтры"
                >
                  Сбросить
                </button>
              </div>

              <div class="space-y-4">
                <div>
                  <label for="filter-type" class="block text-sm font-medium text-text-main mb-2">
                    Тип льготы
                  </label>
                  <select
                    id="filter-type"
                    v-model="selectedType"
                    class="w-full rounded-lg border border-bg-elevated bg-bg-main px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    aria-describedby="filter-type-description"
                    @change="loadBenefits"
                  >
                    <option value="all">Все типы</option>
                    <option value="federal">Федеральные</option>
                    <option value="regional">Региональные</option>
                    <option value="municipal">Муниципальные</option>
                  </select>
                  <p id="filter-type-description" class="sr-only">Выберите тип льготы для фильтрации</p>
                </div>

                <div>
                  <label for="filter-status" class="block text-sm font-medium text-text-main mb-2">
                    Статус
                  </label>
                  <select
                    id="filter-status"
                    v-model="selectedStatus"
                    class="w-full rounded-lg border border-bg-elevated bg-bg-main px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    aria-describedby="filter-status-description"
                    @change="loadBenefits"
                  >
                    <option value="all">Все статусы</option>
                    <option value="active">Активные</option>
                    <option value="expiring_soon">Скоро истекают</option>
                    <option value="expired">Истекшие</option>
                    <option value="requires_verification">Требуют верификации</option>
                  </select>
                  <p id="filter-status-description" class="sr-only">Выберите статус льготы для фильтрации</p>
                </div>

                <div>
                  <label for="filter-category" class="block text-sm font-medium text-text-main mb-2">
                    Категория
                  </label>
                  <select
                    id="filter-category"
                    v-model="selectedCategory"
                    class="w-full rounded-lg border border-bg-elevated bg-bg-main px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    aria-describedby="filter-category-description"
                    @change="loadBenefits"
                  >
                    <option value="all">Все категории</option>
                    <option
                      v-for="category in referencesStore.categories"
                      :key="category.slug"
                      :value="category.slug"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                  <p id="filter-category-description" class="sr-only">Выберите категорию льготы для фильтрации</p>
                </div>

                <div v-if="userStore.user?.region">
                  <label for="filter-region" class="block text-sm font-medium text-text-main mb-2">
                    Регион
                  </label>
                  <select
                    id="filter-region"
                    v-model="selectedRegion"
                    class="w-full rounded-lg border border-bg-elevated bg-bg-main px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    aria-describedby="filter-region-description"
                    @change="loadBenefits"
                  >
                    <option value="all">Все регионы</option>
                    <option
                      v-for="region in referencesStore.regions"
                      :key="region.code"
                      :value="region.code"
                    >
                      {{ region.name }}
                    </option>
                  </select>
                  <p id="filter-region-description" class="sr-only">Выберите регион для фильтрации</p>
                </div>
              </div>
            </section>
          </div>
        </aside>

        <div class="flex-1">
          <div class="mb-4 flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-2">
              <span class="text-sm text-text-muted" aria-live="polite" aria-atomic="true">
                Найдено: {{ displayedBenefits.length }}
              </span>
            </div>
            <div>
              <label for="sort-select" class="sr-only">Сортировка</label>
              <select
                id="sort-select"
                v-model="sortBy"
                class="rounded-lg border border-bg-elevated bg-bg-main px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-describedby="sort-description"
                @change="loadBenefits"
              >
                <option value="popularity_score">По популярности</option>
                <option value="created_at">По дате добавления</option>
                <option value="valid_from">По дате начала действия</option>
              </select>
              <p id="sort-description" class="sr-only">Выберите способ сортировки результатов</p>
            </div>
          </div>

          <div v-if="isLoading" class="text-center py-12" role="status" aria-live="polite">
            <p class="text-text-muted">Загрузка льгот...</p>
          </div>

          <div
            v-else-if="!hasResults"
            class="text-center py-12 rounded-lg border border-bg-elevated bg-bg-elevated"
            role="status"
          >
            <p class="text-text-main mb-2">Льготы не найдены</p>
            <p class="text-sm text-text-muted mb-4">Попробуйте изменить параметры поиска или фильтры</p>
            <button
              type="button"
              @click="clearFilters"
              class="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            >
              Сбросить фильтры
            </button>
          </div>

          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            role="list"
            aria-label="Список льгот"
          >
            <article
              v-for="benefit in paginatedBenefits"
              :key="benefit.id || benefit.benefit_id"
              class="rounded-lg border border-bg-elevated bg-bg-elevated p-4 hover:border-brand-primary/50 transition-colors"
              role="listitem"
            >
              <div class="flex flex-col h-full">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="text-lg font-semibold text-text-main flex-1">
                    <button
                      type="button"
                      @click="navigateTo(`/benefits/${benefit.id || benefit.benefit_id}`)"
                      class="text-left hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary rounded"
                      :aria-label="`Подробнее о льготе: ${benefit.title}`"
                    >
                      {{ benefit.title }}
                    </button>
                  </h3>
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      getBenefitStatusLabel(benefit) === 'Активна'
                        ? 'bg-success/20 text-success'
                        : getBenefitStatusLabel(benefit) === 'Скоро истекает'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-danger/20 text-danger',
                    ]"
                    :aria-label="`Статус: ${getBenefitStatusLabel(benefit)}`"
                  >
                    {{ getBenefitStatusLabel(benefit) }}
                  </span>
                </div>

                <p class="text-sm text-text-muted mb-3 line-clamp-2 flex-1">
                  {{ benefit.description }}
                </p>

                <div class="flex flex-wrap gap-2 mb-3">
                  <span
                    class="px-2 py-1 rounded text-xs bg-brand-primary/20 text-brand-primary"
                    :aria-label="`Тип: ${getBenefitTypeLabel(benefit.benefit_type)}`"
                  >
                    {{ getBenefitTypeLabel(benefit.benefit_type) }}
                  </span>
                  <span
                    v-for="category in benefit.categories?.slice(0, 2)"
                    :key="category.slug"
                    class="px-2 py-1 rounded text-xs bg-bg-main text-text-muted"
                    :aria-label="`Категория: ${category.name}`"
                  >
                    {{ category.name }}
                  </span>
                </div>

                <div class="flex items-center justify-between text-xs text-text-muted">
                  <span>
                    Действует с {{ new Date(benefit.valid_from).toLocaleDateString('ru-RU') }}
                  </span>
                  <button
                    type="button"
                    @click="navigateTo(`/benefits/${benefit.id || benefit.benefit_id}`)"
                    class="text-brand-primary hover:text-brand-primary/80 font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary rounded"
                    aria-label="Перейти к детальной информации о льготе"
                  >
                    Подробнее →
                  </button>
                </div>
              </div>
            </article>
          </div>

          <nav
            v-if="totalPages > 1"
            class="mt-6 flex justify-center gap-2"
            aria-label="Навигация по страницам"
          >
            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              @click="goToPage(page)"
              :aria-label="`Перейти на страницу ${page}`"
              :aria-current="page === currentPage ? 'page' : undefined"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                page === currentPage
                  ? 'bg-brand-primary text-white'
                  : 'bg-bg-elevated text-text-main hover:bg-bg-elevated/80',
              ]"
            >
              {{ page }}
            </button>
          </nav>
        </div>
      </div>
    </main>
</template>
