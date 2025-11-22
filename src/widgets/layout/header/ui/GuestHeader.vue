<script setup lang="ts">
</script>

<template>
  <header class="w-full bg-white border-b border-gray-100" role="banner">
    <div class="mx-auto max-w-7xl px-4 py-4">
      <div class="flex items-center justify-between">

        <NuxtLink class="flex items-center gap-2" to="/" aria-label="Опора, главная страница">
          <div class="h-10 w-10 rounded-lg bg-brand-primary flex items-center justify-center">
            <span class="text-white font-bold text-xl">m</span>
          </div>
          <h1 class="text-2xl font-semibold text-gray-900">
              Опора
          </h1>
        </NuxtLink>

        <nav class="flex items-center gap-4" aria-label="Навигация для гостей">

          <NuxtLink
            to="/auth/login"
            aria-label="Перейти к странице входа"
          >
            <UButton variant="outline" class="w-full text-md flex items-center justify-center px-[24px]">
              <span class="text-gray-900"> 
                Вход
              </span>
            </UButton>
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            aria-label="Перейти к странице регистрации"
          >
            <UButton class="w-full text-md flex items-center justify-center px-[24px] bg-brand-primary">
              <span>
                Регистрация
              </span>
            </UButton>
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

