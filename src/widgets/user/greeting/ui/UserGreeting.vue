<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useReferencesStore, useUserStore } from '~/shared/stores'

const userStore = useUserStore()
const referencesStore = useReferencesStore()

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

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return 'Доброе утро'
  }
  if (hour >= 12 && hour < 18) {
    return 'Добрый день'
  }
  if (hour >= 18 && hour < 22) {
    return 'Добрый вечер'
  }
  return 'Доброй ночи'
})

const userName = computed(() => {
  return userStore.user?.username || userStore.user?.email?.split('@')[0] || 'Пользователь'
})

const userInfo = computed(() => {
  if (!userStore.user) {
    return null
  }

  const categoryName = getBeneficiaryCategoryName(userStore.user.beneficiary_category)
  const region = userStore.user.region ? referencesStore.getRegionByCode(userStore.user.region) : null
  const regionName = region?.name || userStore.user.region || 'Регион не указан'

  return { categoryName, regionName }
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
  <section 
    class="section-container" 
    aria-labelledby="greeting-title"
    aria-describedby="greeting-description"
  >
    <div class="card card-hover flex flex-col gap-4">
      <div>
        <h2 id="greeting-title" class="text-2xl font-bold text-text-inverse">
          {{ greeting }}, {{ userName }}!
        </h2>
        <p id="greeting-description" class="sr-only">
          Информация о вашем профиле: категория льготника и регион проживания
        </p>
      </div>
      <div v-if="userInfo" class="flex flex-col gap-2 text-base text-text-muted">
        <div class="flex items-center gap-2">
          <Icon name="mdi:account-badge" size="20" aria-hidden="true" />
          <span>{{ userInfo.categoryName }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon name="mdi:map-marker" size="20" aria-hidden="true" />
          <span>{{ userInfo.regionName }}</span>
        </div>
      </div>
      <div v-else class="text-base text-text-muted">
        <NuxtLink to="/onboarding/profile" class="text-brand-primary hover:underline">
          Заполните профиль для персональных рекомендаций
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

