<script setup lang="ts">
</script>

<template>
	<section 
		class="section-container" 
		aria-labelledby="assistant-title"
		aria-describedby="assistant-description"
	>
		<div class="card relative overflow-hidden border-brand-primary/20 bg-gradient-to-br from-brand-primary/10 via-white to-white">
			<!-- Декоративный элемент -->
			<div class="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-16 -mt-16" aria-hidden="true"></div>
			
			<div class="relative z-10">
				<div class="mb-4 flex items-center gap-3">
					<div class="text-3xl" role="img" aria-label="Иконка помощи, рукопожатие">🤝</div>
					<h2 id="assistant-title" class="text-xl font-bold text-text-inverse">Подобрать льготы по запросу</h2>
				</div>
				<p id="assistant-description" class="text-base text-text-muted mb-6 leading-relaxed">
					Напишите, что вам нужно, и мы подберём подходящие льготы
				</p>
				<NuxtLink 
					href="/assistant" 
					class="w-full link-focus"
					aria-label="Открыть помощника для подбора льгот по вашему запросу"
				>
					<button 
						class="button" 
						aria-describedby="assistant-description"
					>
						Открыть помощника
					</button>
				</NuxtLink>
			</div>
		</div>
	</section>
</template>


