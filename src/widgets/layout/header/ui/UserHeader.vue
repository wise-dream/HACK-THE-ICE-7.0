<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { useReferencesStore, useUserStore } from '~/shared/stores'

const userStore = useUserStore()
const referencesStore = useReferencesStore()
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const getBeneficiaryCategoryName = (category: string | undefined): string => {
  const categoryNames = {
    pensioner: 'Пенсионер',
    disability_1: 'Инвалид I группы',
    disability_2: 'Инвалид II группы',
    disability_3: 'Инвалид III группы',
    large_family: 'Многодетная семья',
    veteran: 'Ветеран',
    low_income: 'Малоимущий',
    svo_participant: 'Участник СВО',
    svo_family: 'Семья участника СВО',
    other: 'Другое',
  } as const
  return category ? categoryNames[category as keyof typeof categoryNames] || category : 'Пользователь'
}

const userInfo = computed(() => {
  if (!userStore.user) {
    return null
  }

  const categoryName = getBeneficiaryCategoryName(userStore.user.beneficiary_category)
  const region = userStore.user.region ? referencesStore.getRegionByCode(userStore.user.region) : null
  const regionName = region?.name || userStore.user.region || 'Регион не указан'

  return { categoryName, regionName }
})

const displayName = computed(() => {
  return userStore.user?.username || userStore.user?.email || 'Пользователь'
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

onClickOutside(dropdownRef, () => {
  closeDropdown()
})

onMounted(async () => {
  if (userStore.isAuthenticated && !userStore.user) {
    try {
      await userStore.fetchCurrentUser()
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }
  if (referencesStore.regions.length === 0) {
    try {
      await referencesStore.fetchRegions()
    } catch (error) {
      console.error('Failed to load regions:', error)
    }
  }
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
							<p class="text-base font-medium text-text-main" role="heading" aria-level="2">{{ displayName }}</p>
							<p v-if="userInfo" class="text-sm text-text-muted mt-1" aria-label="Информация о пользователе">
								{{ userInfo.categoryName }}, регион: {{ userInfo.regionName }}
							</p>
							<p v-else class="text-sm text-text-muted mt-1" aria-label="Информация о пользователе">
								Профиль не заполнен
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
							<button
								v-if="userStore.isAuthenticated"
								@click="async () => { await userStore.logout(); closeDropdown(); await navigateTo('/auth/login') }"
								role="menuitem"
								aria-label="Выйти из аккаунта"
								class="block w-full text-left px-4 py-2 text-base text-text-main hover:bg-bg-main transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-inset rounded"
							>
								Выйти
							</button>
						</div>
					</div>
				</nav>
			</div>
		</div>
	</header>
</template>

