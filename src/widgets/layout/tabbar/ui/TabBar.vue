<script setup lang="ts">
const tabs = [
	{ label: 'Главная', href: '/', icon: 'mdi:home' },
	{ label: 'Льготы', href: '/benefits', icon: 'mdi:gift' },
	{ label: 'Помощник', href: '/assistant', icon: 'mdi:robot-happy' },
	{ label: 'Профиль', href: '/profile', icon: 'mdi:account-circle' },
];
</script>

<template>
	<nav class="fixed inset-x-0 bottom-0 z-50 bg-bg-main/95 backdrop-blur supports-[backdrop-filter]:bg-bg-main/80 border-t border-bg-elevated">
		<div class="mx-auto flex max-w-screen-md items-stretch justify-between">
			<NuxtLink
				v-for="tab in tabs"
				:key="tab.href"
				:href="tab.href"
				:class="[
					'flex flex-1 flex-col items-center gap-[4px]', 
					'justify-center text-text-main transition-colors ', 
					'hover:bg-bg-elevated py-[12px] duration-200'
				].join(' ')"
			>
				<Icon :name="tab.icon" size="32" class="text-text-main" />
				<div class="text-[16px]">{{ tab.label }}</div>
			</NuxtLink>
		</div>
	</nav>
</template>


