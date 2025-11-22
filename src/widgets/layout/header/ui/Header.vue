<script setup lang="ts">
import { useUserStore } from '~/shared/stores'
import GuestHeader from './GuestHeader.vue'
import UserHeader from './UserHeader.vue'

const userStore = useUserStore()
</script>

<template>
  <GuestHeader v-if="!userStore.isAuthenticated" />
  <UserHeader v-else />
</template>
