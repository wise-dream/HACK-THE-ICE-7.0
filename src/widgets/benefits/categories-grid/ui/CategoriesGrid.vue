<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Category } from '~/entities/benefit'
import { useBenefitsStore, useReferencesStore } from '~/shared/stores'

const referencesStore = useReferencesStore()
const benefitsStore = useBenefitsStore()

const categories = computed(() => {
  return referencesStore.categories.slice(0, 6).map((cat: Category) => {
    const benefitsInCategory = benefitsStore.byCategory(cat.slug)
    return {
      icon: cat.icon || '📋',
      name: cat.name,
      key: cat.slug,
      count: benefitsInCategory.length,
    }
  })
})

const getCategoryCount = (categorySlug: string) => {
  const categoryBenefits = benefitsStore.byCategory(categorySlug)
  return categoryBenefits.length
}

onMounted(async () => {
  if (referencesStore.categories.length === 0) {
    try {
      await referencesStore.fetchCategories()
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }
  if (benefitsStore.benefits.length === 0) {
    try {
      await benefitsStore.fetchBenefits({ personalized: true })
    } catch (error) {
      console.error('Failed to load benefits:', error)
    }
  }
})
</script>

<template>
	<section 
		class="section-container" 
		aria-labelledby="categories-title"
		aria-describedby="categories-description"
	>
		<h2 id="categories-title" class="px-1 pb-4 text-xl font-semibold text-text-main">Категории льгот</h2>
		<p id="categories-description" class="sr-only">
			Выберите категорию льгот для просмотра доступных льгот в вашем регионе
		</p>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3" role="list">
			<NuxtLink
				v-for="item in categories"
				:key="item.key"
				:to="`/benefits?category=${item.key}`"
				:aria-label="`Перейти к категории ${item.name}. В этой категории доступно ${item.count} ${item.count === 1 ? 'льгота' : item.count < 5 ? 'льготы' : 'льгот'} в вашем регионе`"
				role="listitem"
				class="category-card link-focus-accent"
			>
				<div 
					class="text-3xl mb-3 transition-transform group-hover:scale-110" 
					role="img" 
					:aria-label="`Иконка категории ${item.name}`"
					aria-hidden="false"
				>
					{{ item.icon }}
				</div>
				<div class="text-base font-semibold text-text-inverse mb-1">{{ item.name }}</div>
				<div class="text-sm text-text-muted" aria-label="Количество льгот в категории">
					{{ item.count }} {{ item.count === 1 ? 'льгота' : item.count < 5 ? 'льготы' : 'льгот' }} в вашем регионе
				</div>
			</NuxtLink>
		</div>
	</section>
</template>


