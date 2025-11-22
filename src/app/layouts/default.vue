<script setup lang="ts">
import Header from '~/widgets/layout/header/ui/Header.vue'
</script>

<template>
  <div class="min-h-screen bg-bg-main">
    <Header />
    <slot />
  </div>
</template>

