<script setup lang="ts">
import Header from '@/widgets/layout/header/ui/Header.vue'
import BenefitsSummary from '@/widgets/benefits/benefits-summary/ui/BenefitsSummary.vue'
import AssistantCta from '@/widgets/assistant/assistant-cta/ui/AssistantCta.vue'
import CategoriesGrid from '@/widgets/benefits/categories-grid/ui/CategoriesGrid.vue'
import ImportantNow from '@/widgets/benefits/important-now/ui/ImportantNow.vue'
import TabBar from '@/widgets/layout/tabbar/ui/TabBar.vue'
</script>

<template>
	<div class="min-h-screen bg-bg-main pb-20">
		<Header />

		<main 
			class="mt-6 space-y-6 pb-6" 
			role="main" 
			aria-label="Главная страница приложения Опора"
		>
			<BenefitsSummary />
			<AssistantCta />
			<CategoriesGrid />
			<ImportantNow />
		</main>
		<TabBar />
	</div>
</template>