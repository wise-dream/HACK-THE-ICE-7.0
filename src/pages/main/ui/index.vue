<script setup lang="ts">
import AssistantCta from '@/widgets/assistant/assistant-cta/ui/AssistantCta.vue'
import BenefitsSummary from '@/widgets/benefits/benefits-summary/ui/BenefitsSummary.vue'
import CategoriesGrid from '@/widgets/benefits/categories-grid/ui/CategoriesGrid.vue'
import ImportantNow from '@/widgets/benefits/important-now/ui/ImportantNow.vue'
import MyBenefitsList from '@/widgets/benefits/my-benefits-list/ui/MyBenefitsList.vue'
import TabBar from '@/widgets/layout/tabbar/ui/TabBar.vue'
import UserGreeting from '@/widgets/user/greeting/ui/UserGreeting.vue'
</script>

<template>
	<div class="pb-20">
		<main 
			class="mt-6 space-y-6 pb-6" 
			role="main" 
			aria-label="Главная страница приложения Опора"
		>
			<UserGreeting />
			<BenefitsSummary />
			<MyBenefitsList />
			<ImportantNow />
			<AssistantCta />
			<CategoriesGrid />
		</main>
		<TabBar />
	</div>
</template>