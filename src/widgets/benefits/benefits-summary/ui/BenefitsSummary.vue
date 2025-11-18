<script setup lang="ts">
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
			<div class="grid grid-cols-3 gap-4" role="group" aria-label="Статистика льгот">
				<div 
					class="stat-card stat-card-default"
					role="article"
					aria-label="Всего льгот"
				>
					<div class="text-sm text-text-muted font-medium" id="total-label">Всего льгот</div>
					<div class="text-3xl font-bold text-text-inverse" aria-labelledby="total-label" aria-live="polite">12</div>
				</div>
				<div 
					class="stat-card stat-card-warning"
					role="article"
					aria-label="Льготы, которые скоро истекают"
				>
					<div class="text-sm text-text-muted font-medium" id="expiring-label">Скоро истекают</div>
					<div class="text-3xl font-bold text-warning" aria-labelledby="expiring-label" aria-live="polite">2</div>
				</div>
				<div 
					class="stat-card stat-card-success"
					role="article"
					aria-label="Новые льготы для вас"
				>
					<div class="text-sm text-text-muted font-medium" id="new-label">Новые для вас</div>
					<div class="text-3xl font-bold text-success" aria-labelledby="new-label" aria-live="polite">3</div>
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


