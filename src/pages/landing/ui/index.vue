<script setup lang="ts">
import { computed } from 'vue'

const stats = computed(() => ({
  stateBenefits: 11,
  commercialOffers: 9,
  free: 100,
}))
</script>

<template>
  <div class="min-h-screen bg-white">
    <main class="w-full" role="main">
      <section 
        class="mx-auto max-w-7xl px-4 pt-8 lg:pt-16" 
        aria-labelledby="hero-heading"
      >
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="flex flex-col gap-8">
            <h1 
              id="hero-heading" 
              class="text-4xl lg:text-4xl font-bold text-gray-900 leading-tight"
            >
              Льготы и скидки в одном месте
            </h1>
            <p class="text-lg text-gray-600 leading-relaxed">
              Доступ к государственным льготам и коммерческим предложениям для пенсионеров, инвалидов, многодетных семей и других льготных категорий граждан
            </p>
            <nav 
              class="flex flex-col sm:flex-row gap-4" 
              aria-label="Основные действия"
            >
              <NuxtLink 
                to="/auth/register"
                aria-label="Начать использовать приложение - регистрация"
              >
                <UButton 
                  class="bg-brand-primary text-white text-lg font-medium px-[16px] py-[8px] rounded-[8px]" 
                  size="lg"
                  aria-label="Начать использовать - перейти к регистрации"
                >
                  Начать использовать
                </UButton>
              </NuxtLink>
              <NuxtLink 
                to="/benefits"
                aria-label="Посмотреть доступные льготы"
              >
                <UButton 
                  variant="outline" 
                  class="text-brand-primary text-lg font-medium px-[16px] py-[8px] rounded-[8px]" 
                  size="lg"
                  aria-label="Посмотреть список льгот"
                >
                  Посмотреть льготы
                </UButton>
              </NuxtLink> 
            </nav>
          </div>
          <div 
            class="hidden md:flex items-center justify-center"
            aria-hidden="true"
            role="presentation"
          >
            <div class="w-[320px] h-[320px] bg-[#F0FDF4] rounded-full flex items-center justify-center">
              <img 
                src="/images/roboto.gif" 
                alt="Маскот приложения Опора" 
                class="object-cover w-[256px] h-[256px]"
              >
            </div>
          </div>
        </div>
      </section>

      <section 
        class="mx-auto max-w-7xl px-4 py-16" 
        aria-labelledby="features-heading"
      >
        <h2 id="features-heading" class="sr-only">Основные возможности</h2>
        <div class="grid md:grid-cols-3 gap-8" role="list">
          <article 
            class="bg-white rounded-[14px] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow"
            role="listitem"
          >
            <div 
              class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6"
              aria-hidden="true"
            >
              <Icon 
                name="mdi:file-document" 
                size="32" 
                class="text-blue-600" 
                aria-hidden="true"
              />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Государственные льготы</h3>
            <p class="text-base text-gray-600">
              Федеральные, региональные и муниципальные льготы с подробными инструкциями по получению
            </p>
          </article>

          <article 
            class="bg-white rounded-xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow"
            role="listitem"
          >
            <div 
              class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6"
              aria-hidden="true"
            >
              <Icon 
                name="mdi:currency-usd" 
                size="32" 
                class="text-green-600"
                aria-hidden="true"
              />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Скидки от партнеров</h3>
            <p class="text-base text-gray-600">
              Специальные предложения от аптек, магазинов, банков и других организаций
            </p>
          </article>

          <article 
            class="bg-white rounded-xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow"
            role="listitem"
          >
            <div 
              class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6"
              aria-hidden="true"
            >
              <Icon 
                name="mdi:eye" 
                size="32" 
                class="text-purple-600"
                aria-hidden="true"
              />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Доступность</h3>
            <p class="text-base text-gray-600">
              Настройки шрифта, контрастности, голосовой помощник для людей с ограниченными возможностями
            </p>
          </article>
        </div>
      </section>

      <section 
        class="bg-brand-primary" 
        aria-labelledby="stats-heading"
      >
        <div class="mx-auto max-w-7xl px-4 py-12">
          <h2 id="stats-heading" class="sr-only">Статистика платформы</h2>
          <div class="grid md:grid-cols-3 gap-8 text-center" role="list">
            <div role="listitem" aria-label="Количество государственных льгот">
              <div class="text-5xl font-bold text-white mb-2" aria-hidden="true">
                {{ stats.stateBenefits }}+
              </div>
              <div class="text-lg text-white/90">Государственных льгот</div>
              <span class="sr-only">{{ stats.stateBenefits }} государственных льгот</span>
            </div>
            <div role="listitem" aria-label="Количество коммерческих предложений">
              <div class="text-5xl font-bold text-white mb-2" aria-hidden="true">
                {{ stats.commercialOffers }}+
              </div>
              <div class="text-lg text-white/90">Коммерческих предложений</div>
              <span class="sr-only">{{ stats.commercialOffers }} коммерческих предложений</span>
            </div>
            <div role="listitem" aria-label="Процент бесплатных услуг">
              <div class="text-5xl font-bold text-white mb-2" aria-hidden="true">
                {{ stats.free }}%
              </div>
              <div class="text-lg text-white/90">Бесплатно</div>
              <span class="sr-only">{{ stats.free }} процентов услуг предоставляются бесплатно</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

