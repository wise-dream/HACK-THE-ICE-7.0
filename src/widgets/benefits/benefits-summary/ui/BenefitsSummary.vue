<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useBenefitsStore } from '~/shared/stores'

const benefitsStore = useBenefitsStore()

const totalCount = computed(() => {
  if (benefitsStore.dashboard) {
    return benefitsStore.dashboard.active_count + benefitsStore.dashboard.expiring_count
  }
  return benefitsStore.activeBenefits.length + benefitsStore.expiringBenefits.length
})

const expiringCount = computed(() => {
  return benefitsStore.dashboard?.expiring_count ?? benefitsStore.expiringBenefits.length
})

const newCount = computed(() => {
  return benefitsStore.newBenefits.length
})

onMounted(async () => {
  try {
    // Загружаем dashboard для статистики
    if (!benefitsStore.dashboard) {
      await benefitsStore.getDashboard()
    }
    
    // Загружаем все льготы для корректного подсчета новых льгот
    if (benefitsStore.benefits.length === 0) {
      await benefitsStore.fetchBenefits()
    }
  } catch (error) {
    console.error('Failed to load benefits data:', error)
  }
})
</script>

<template>
	<section 
		class="section-container" 
		aria-labelledby="benefits-summary-title"
		aria-describedby="benefits-summary-description"
	>
		<div class="card card-hover flex flex-col gap-6">
			<div class="flex items-center justify-between">
				<h2 id="benefits-summary-title" class="text-[20px] font-bold text-text-inverse">Мои льготы</h2>
			</div>
			<p id="benefits-summary-description" class="sr-only">
				Статистика по вашим льготам: общее количество, количество льгот, которые скоро истекают, и новых льгот, доступных для вас
			</p>
			<div v-if="benefitsStore.isLoading && !benefitsStore.dashboard" class="grid grid-cols-3 gap-4" role="group" aria-label="Загрузка статистики льгот">
				<div class="stat-card stat-card-default animate-pulse">
					<div class="text-sm text-text-muted font-medium">Всего льгот</div>
					<div class="text-3xl font-bold text-text-inverse">—</div>
				</div>
				<div class="stat-card stat-card-warning animate-pulse">
					<div class="text-sm text-text-muted font-medium">Скоро истекают</div>
					<div class="text-3xl font-bold text-warning">—</div>
				</div>
				<div class="stat-card stat-card-success animate-pulse">
					<div class="text-sm text-text-muted font-medium">Новые для вас</div>
					<div class="text-3xl font-bold text-success">—</div>
				</div>
			</div>
			<div v-else class="grid grid-cols-3 gap-4" role="group" aria-label="Статистика льгот">
				<div 
					class="stat-card stat-card-default"
					role="article"
					aria-label="Всего льгот"
				>
					<div class="text-sm text-text-muted font-medium" id="total-label">Всего льгот</div>
					<div class="text-3xl font-bold text-text-inverse" aria-labelledby="total-label" aria-live="polite">{{ totalCount }}</div>
				</div>
				<NuxtLink
					v-if="expiringCount > 0"
					to="/benefits?status=expiring_soon"
					class="stat-card stat-card-warning link-focus"
					role="article"
					aria-label="Льготы, которые скоро истекают. Перейти к списку"
				>
					<div class="text-sm text-text-muted font-medium" id="expiring-label">Скоро истекают</div>
					<div class="text-3xl font-bold text-warning" aria-labelledby="expiring-label" aria-live="polite">{{ expiringCount }}</div>
				</NuxtLink>
				<div
					v-else
					class="stat-card stat-card-warning"
					role="article"
					aria-label="Льготы, которые скоро истекают"
				>
					<div class="text-sm text-text-muted font-medium" id="expiring-label">Скоро истекают</div>
					<div class="text-3xl font-bold text-warning" aria-labelledby="expiring-label" aria-live="polite">0</div>
				</div>
				<NuxtLink
					v-if="newCount > 0"
					to="/benefits?ordering=-valid_from"
					class="stat-card stat-card-success link-focus"
					role="article"
					aria-label="Новые льготы для вас. Перейти к списку"
				>
					<div class="text-sm text-text-muted font-medium" id="new-label">Новые для вас</div>
					<div class="text-3xl font-bold text-success" aria-labelledby="new-label" aria-live="polite">{{ newCount }}</div>
				</NuxtLink>
				<div
					v-else
					class="stat-card stat-card-success"
					role="article"
					aria-label="Новые льготы для вас"
				>
					<div class="text-sm text-text-muted font-medium" id="new-label">Новые для вас</div>
					<div class="text-3xl font-bold text-success" aria-labelledby="new-label" aria-live="polite">0</div>
				</div>
			</div>
			<NuxtLink 
				href="/benefits" 
				class="w-full link-focus"
				aria-label="Перейти на страницу со всеми льготами"
			>
				<button class="button" aria-describedby="benefits-summary-description">
					Посмотреть все льготы
				</button>
			</NuxtLink>
		</div>
	</section>
</template>


