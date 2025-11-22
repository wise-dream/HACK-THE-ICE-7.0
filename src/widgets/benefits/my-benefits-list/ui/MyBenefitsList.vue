<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Benefit } from '~/entities/benefit'
import type { CommercialOffer } from '~/entities/commercial'
import { useBenefitsStore, useUserStore } from '~/shared/stores'

const benefitsStore = useBenefitsStore()
const userStore = useUserStore()

const filterType = ref<'all' | 'federal' | 'commercial'>('all')
const showOnlyActive = ref(false)

const filteredBenefits = computed(() => {
  let items: Array<Benefit | CommercialOffer> = []

  if (filterType.value === 'all') {
    items = benefitsStore.allItems
  } else if (filterType.value === 'federal') {
    items = benefitsStore.benefits.filter((b: Benefit) => ['federal', 'regional', 'municipal'].includes(b.benefit_type))
  } else if (filterType.value === 'commercial') {
    items = benefitsStore.commercialOffers
  }

  if (showOnlyActive.value) {
    items = items.filter((item) => {
      if ('benefit_type' in item) {
        return (item as Benefit).status === 'active'
      }
      return (item as CommercialOffer).status === 'active'
    })
  }

  if (userStore.userProfile?.preferences?.hidden_benefits) {
    const hiddenIds = userStore.userProfile.preferences.hidden_benefits
    items = items.filter((item) => {
      const id = 'id' in item ? item.id : 'offer_id' in item ? (item as CommercialOffer).offer_id : null
      return id && typeof id === 'number' && !hiddenIds.includes(id)
    })
  }

  return items.slice(0, 6)
})

onMounted(async () => {
  try {
    await benefitsStore.getRecommendedBenefits()
  } catch (error) {
    console.error('Failed to load recommended benefits:', error)
    try {
      await benefitsStore.fetchBenefits({ personalized: true })
    } catch (err) {
      console.error('Failed to load personalized benefits:', err)
    }
  }

  if (benefitsStore.commercialOffers.length === 0) {
    try {
      await benefitsStore.fetchOffers()
    } catch (error) {
      console.error('Failed to load commercial offers:', error)
    }
  }
})
</script>

<template>
  <section 
    class="section-container" 
    aria-labelledby="my-benefits-title"
    aria-describedby="my-benefits-description"
  >
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 id="my-benefits-title" class="text-xl font-semibold text-text-main">Мои льготы</h2>
        <p id="my-benefits-description" class="sr-only">
          Список персонализированных льгот и коммерческих предложений, подобранных специально для вас
        </p>
      </div>
      
      <div class="flex flex-wrap gap-2" role="group" aria-label="Фильтры льгот">
        <button
          v-for="type in [
            { key: 'all' as const, label: 'Все' },
            { key: 'federal' as const, label: 'Государственные' },
            { key: 'commercial' as const, label: 'Коммерческие' },
          ]"
          :key="type.key"
          @click="filterType = type.key"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            filterType === type.key
              ? 'bg-brand-primary text-white'
              : 'bg-bg-elevated text-text-main hover:bg-bg-elevated/80'
          ]"
          :aria-pressed="filterType === type.key"
          :aria-label="`Фильтр: ${type.label}`"
        >
          {{ type.label }}
        </button>
      </div>
      
      <div class="flex items-center gap-2">
        <input
          id="show-only-active"
          v-model="showOnlyActive"
          type="checkbox"
          class="h-4 w-4 rounded border-bg-elevated text-brand-primary focus:ring-brand-primary"
        />
        <label for="show-only-active" class="text-sm text-text-muted cursor-pointer">
          Показать только актуальные
        </label>
      </div>
      
      <div v-if="benefitsStore.isLoading" class="space-y-4" role="status" aria-label="Загрузка льгот">
        <div 
          v-for="i in 3" 
          :key="i"
          class="card animate-pulse"
        >
          <div class="h-4 bg-bg-elevated rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-bg-elevated rounded w-full"></div>
        </div>
      </div>
      
      <div v-else-if="filteredBenefits.length === 0" class="card text-center py-8">
        <p class="text-base text-text-muted">Нет подходящих льгот</p>
      </div>
      
      <div v-else class="space-y-4" role="list" aria-label="Список льгот">
        <div
          v-for="(item, idx) in filteredBenefits"
          :key="'id' in item ? item.id : ('offer_id' in item ? (item as CommercialOffer).offer_id : idx)"
          class="card card-hover"
          role="listitem"
        >
          <div class="flex flex-col gap-2">
            <h3 class="text-lg font-semibold text-text-inverse">
              {{ 'title' in item ? item.title : (item as CommercialOffer).title }}
            </h3>
            <p class="text-sm text-text-muted line-clamp-2">
              {{ 'description' in item ? item.description : (item as CommercialOffer).description }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <NuxtLink
                :to="'benefit_type' in item ? `/benefits/${item.id || item.benefit_id}` : `/offers/${(item as CommercialOffer).offer_id || (item as CommercialOffer).id}`"
                class="text-sm text-brand-primary hover:underline"
                :aria-label="`Подробнее о льготе ${'title' in item ? item.title : (item as CommercialOffer).title}`"
              >
                Подробнее →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      
      <NuxtLink
        to="/benefits"
        class="w-full link-focus"
        aria-label="Перейти на страницу со всеми льготами"
      >
        <button class="button">
          Посмотреть все льготы
        </button>
      </NuxtLink>
    </div>
  </section>
</template>

