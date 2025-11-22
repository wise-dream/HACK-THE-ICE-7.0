<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Benefit } from '~/entities/benefit'
import { useBenefitsStore } from '~/shared/stores'
import { formatDate } from '~/shared/utils/date'

const benefitsStore = useBenefitsStore()

const expiring = computed(() => {
  if (benefitsStore.dashboard?.expiring_benefits) {
    return benefitsStore.dashboard.expiring_benefits.slice(0, 3).map((benefit: Benefit) => ({
      id: benefit.id || benefit.benefit_id,
      title: benefit.title,
      date: benefit.valid_to ? `до ${formatDate(benefit.valid_to)}` : '',
    }))
  }
  return benefitsStore.expiringBenefits.slice(0, 3).map((benefit: Benefit) => ({
    id: benefit.id || benefit.benefit_id,
    title: benefit.title,
    date: benefit.valid_to ? `до ${formatDate(benefit.valid_to)}` : '',
  }))
})

const newOnes = computed(() => {
  return benefitsStore.newBenefits.slice(0, 3).map((benefit: Benefit) => ({
    id: benefit.id || benefit.benefit_id,
    title: benefit.title,
    date: benefit.valid_from ? `с ${formatDate(benefit.valid_from)}` : '',
  }))
})

onMounted(async () => {
  if (!benefitsStore.dashboard) {
    try {
      await benefitsStore.getDashboard()
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }
  if (benefitsStore.newBenefits.length === 0) {
    try {
      await benefitsStore.fetchBenefits({
        ordering: '-valid_from',
        personalized: true,
      })
    } catch (error) {
      console.error('Failed to load new benefits:', error)
    }
  }
})
</script>

<template>
	<section 
		class="section-container" 
		aria-labelledby="important-title"
		aria-describedby="important-description"
	>
		<h3 id="important-title" class="px-1 pb-4 text-lg font-semibold text-text-main">Важное сейчас</h3>
		<p id="important-description" class="sr-only">
			Информация о льготах, которые требуют вашего внимания: льготы, которые скоро истекают, и новые льготы, доступные для вас
		</p>
		<div class="space-y-4">
			<div 
				v-if="expiring.length > 0 || benefitsStore.isLoading"
				class="important-card-warning"
				role="region"
				aria-labelledby="expiring-section-title"
			>
				<div class="mb-3 flex items-center gap-2">
					<div class="h-2 w-2 rounded-full bg-warning animate-pulse" aria-hidden="true"></div>
					<div id="expiring-section-title" class="text-base font-bold text-warning">Скоро истекают</div>
				</div>
				<ul v-if="benefitsStore.isLoading && expiring.length === 0" class="space-y-3" role="list" aria-label="Загрузка льгот, которые скоро истекают">
					<li class="flex items-center justify-between gap-3 p-2 rounded-lg animate-pulse" role="listitem">
						<div class="h-4 bg-warning/20 rounded w-3/4"></div>
						<div class="h-4 bg-warning/20 rounded w-1/4"></div>
					</li>
				</ul>
				<ul v-else class="space-y-3" role="list" aria-label="Список льгот, которые скоро истекают">
					<li 
						v-for="(item, idx) in expiring" 
						:key="`exp-${item.id || idx}`" 
						class="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-warning/10 transition-colors"
						role="listitem"
					>
						<NuxtLink 
							:to="`/benefits/${item.id}`"
							:aria-label="`${item.title}. Истекает ${item.date}. Перейти к подробной информации`"
							class="important-link-warning"
						>
							{{ item.title }}
						</NuxtLink>
						<time 
							v-if="item.date"
							:datetime="item.date.replace('до ', '')" 
							class="text-sm text-text-muted whitespace-nowrap"
							aria-label="Срок действия до"
						>
							{{ item.date }}
						</time>
					</li>
				</ul>
			</div>
			<div 
				v-if="newOnes.length > 0 || benefitsStore.isLoading"
				class="important-card-success"
				role="region"
				aria-labelledby="new-section-title"
			>
				<div class="mb-3 flex items-center gap-2">
					<div class="h-2 w-2 rounded-full bg-success" aria-hidden="true"></div>
					<div id="new-section-title" class="text-base font-bold text-success">Новые для вас</div>
				</div>
				<ul v-if="benefitsStore.isLoading && newOnes.length === 0" class="space-y-3" role="list" aria-label="Загрузка новых льгот">
					<li class="flex items-center justify-between gap-3 p-2 rounded-lg animate-pulse" role="listitem">
						<div class="h-4 bg-success/20 rounded w-3/4"></div>
						<div class="h-4 bg-success/20 rounded w-1/4"></div>
					</li>
				</ul>
				<ul v-else class="space-y-3" role="list" aria-label="Список новых льгот, доступных для вас">
					<li 
						v-for="(item, idx) in newOnes" 
						:key="`new-${item.id || idx}`" 
						class="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-success/10 transition-colors"
						role="listitem"
					>
						<NuxtLink 
							:to="`/benefits/${item.id}`"
							:aria-label="`${item.title}. Доступна ${item.date}. Перейти к подробной информации`"
							class="important-link-success"
						>
							{{ item.title }}
						</NuxtLink>
						<time 
							v-if="item.date"
							:datetime="item.date.replace('с ', '')" 
							class="text-sm text-text-muted whitespace-nowrap"
							aria-label="Доступна с"
						>
							{{ item.date }}
						</time>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>


