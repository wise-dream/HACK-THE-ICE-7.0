<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
	isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
	isDropdownOpen.value = false
}

onClickOutside(dropdownRef, () => {
	closeDropdown()
})
</script>

<template>
	<header class="w-full bg-bg-main" role="banner">
		<div class="mx-auto max-w-screen-md px-4 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<h1 class="text-2xl font-semibold text-text-main">
						<NuxtLink to="/" aria-label="Опора, главная страница" class="focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-bg-main rounded">
							Опора
						</NuxtLink>
					</h1>
				</div>
				<nav ref="dropdownRef" class="relative" aria-label="Навигация профиля">
					<button
						@click="toggleDropdown"
						:aria-expanded="isDropdownOpen"
						aria-haspopup="true"
						aria-label="Открыть меню профиля"
						:aria-controls="isDropdownOpen ? 'profile-menu' : undefined"
						:class="[
							'h-[48px] w-[48px] rounded-full bg-bg-elevated', 
							'overflow-hidden flex items-center justify-center',
							'hover:bg-bg-elevated/80 transition-colors cursor-pointer',
							'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-bg-main'
						].join(' ')"
					>
						<Icon name="mdi:account-circle" size="48" class="text-text-main" aria-hidden="true" />
					</button>
					<div
						v-if="isDropdownOpen"
						id="profile-menu"
						role="menu"
						aria-label="Меню профиля"
						class="absolute right-0 mt-2 w-56 rounded-lg border border-bg-elevated bg-bg-elevated shadow-lg z-50"
					>
						<div class="px-4 py-3 border-b border-bg-elevated" role="none">
							<p class="text-base font-medium text-text-main" role="heading" aria-level="2">Профиль</p>
							<p class="text-sm text-text-muted mt-1" aria-label="Информация о пользователе">
								Пенсионер по возрасту, регион: Москва
							</p>
						</div>
						<div class="py-1" role="none">
							<NuxtLink
								to="/profile"
								@click="closeDropdown"
								role="menuitem"
								aria-label="Редактировать данные профиля"
								class="block px-4 py-2 text-base text-text-main hover:bg-bg-main transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-inset rounded"
							>
								Редактировать данные
							</NuxtLink>
						</div>
					</div>
				</nav>
			</div>
		</div>
	</header>
</template>


