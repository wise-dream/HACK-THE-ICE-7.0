<script setup lang="ts">
const categories = [
	{ icon: '🚍', name: 'Транспорт', key: 'transport' },
	{ icon: '💊', name: 'Лекарства', key: 'medicines' },
	{ icon: '🏠', name: 'ЖКХ', key: 'utilities' },
	{ icon: '💰', name: 'Компенсации', key: 'compensations' },
	{ icon: '🛒', name: 'Покупки/магазины', key: 'shopping' },
	{ icon: '❤️', name: 'Соцподдержка', key: 'social' },
];
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
			<a
				v-for="item in categories"
				:key="item.key"
				:href="`/benefits?category=${item.key}`"
				:aria-label="`Перейти к категории ${item.name}. В этой категории доступно 4 льготы в вашем регионе`"
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
					4 льготы в вашем регионе
				</div>
			</a>
		</div>
	</section>
</template>


