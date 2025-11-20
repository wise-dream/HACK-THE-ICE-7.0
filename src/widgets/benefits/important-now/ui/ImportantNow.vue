<script setup lang="ts">
const expiring = [
	{ title: 'Компенсация ЖКХ', date: 'до 30.11.2025' },
	{ title: 'Соцкарта — бесплатный проезд', date: 'до 05.12.2025' },
];

const newOnes = [
	{ title: 'Скидка на лекарства 15%', date: 'с 20.11.2025' },
];
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
				class="important-card-warning"
				role="region"
				aria-labelledby="expiring-section-title"
			>
				<div class="mb-3 flex items-center gap-2">
					<div class="h-2 w-2 rounded-full bg-warning animate-pulse" aria-hidden="true"></div>
					<div id="expiring-section-title" class="text-base font-bold text-warning">Скоро истекают</div>
				</div>
				<ul class="space-y-3" role="list" aria-label="Список льгот, которые скоро истекают">
					<li 
						v-for="(item, idx) in expiring" 
						:key="`exp-${idx}`" 
						class="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-warning/10 transition-colors"
						role="listitem"
					>
						<a 
							:href="`/benefits#${item.title.toLowerCase().replace(/\s+/g, '-')}`"
							:aria-label="`${item.title}. Истекает ${item.date}. Перейти к подробной информации`"
							class="important-link-warning"
						>
							{{ item.title }}
						</a>
						<time 
							:datetime="item.date.replace('до ', '').replace('до ', '')" 
							class="text-sm text-text-muted whitespace-nowrap"
							aria-label="Срок действия до"
						>
							{{ item.date }}
						</time>
					</li>
				</ul>
			</div>
			<div 
				class="important-card-success"
				role="region"
				aria-labelledby="new-section-title"
			>
				<div class="mb-3 flex items-center gap-2">
					<div class="h-2 w-2 rounded-full bg-success" aria-hidden="true"></div>
					<div id="new-section-title" class="text-base font-bold text-success">Новые для вас</div>
				</div>
				<ul class="space-y-3" role="list" aria-label="Список новых льгот, доступных для вас">
					<li 
						v-for="(item, idx) in newOnes" 
						:key="`new-${idx}`" 
						class="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-success/10 transition-colors"
						role="listitem"
					>
						<a 
							:href="`/benefits#${item.title.toLowerCase().replace(/\s+/g, '-')}`"
							:aria-label="`${item.title}. Доступна ${item.date}. Перейти к подробной информации`"
							class="important-link-success"
						>
							{{ item.title }}
						</a>
						<time 
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


