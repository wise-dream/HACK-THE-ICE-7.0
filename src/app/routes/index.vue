<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { LandingPage } from '~/pages/landing'
import { MainPage } from '~/pages/main'
import { useUserStore } from '~/shared/stores'

const userStore = useUserStore()

const showLanding = computed(() => !userStore.isAuthenticated)

onMounted(async () => {
  userStore.initAuth()
  if (userStore.isAuthenticated) {
    await navigateTo('/main')
  }
})
</script>

<template>
  <LandingPage v-if="showLanding" />
  <MainPage v-else />
</template>
