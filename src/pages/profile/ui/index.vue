<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore, useUIStore, useReferencesStore } from '~/shared/stores'
import { formatSnils, unformatSnils } from '~/shared/utils/snils'
import type { BeneficiaryCategory, BenefitCategory } from '~/entities/benefit'
import type { FontSize, FontFamily, ColorMode } from '~/entities/user'

const userStore = useUserStore()
const uiStore = useUIStore()
const referencesStore = useReferencesStore()

const isLoading = ref(false)
const isSaving = ref(false)
const saveMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const formData = ref({
  username: '',
  email: '',
  phone: '',
  beneficiary_category: '' as BeneficiaryCategory | '',
  region: '',
  snils: '',
})

const accessibilitySettings = ref({
  font_size: 'normal' as FontSize,
  font_family: 'sans-serif' as FontFamily,
  letter_spacing: 1,
  color_mode: 'default' as ColorMode,
  show_images: true,
  speech_assistant_enabled: false,
})

const interestCategories = ref<BenefitCategory[]>([])
const selectedInterests = ref<BenefitCategory[]>([])

const availableInterests = computed(() => {
  return referencesStore.categories.filter((cat) => !selectedInterests.value.includes(cat.slug as BenefitCategory))
})

const isProfileChanged = computed(() => {
  if (!userStore.user) return false
  return (
    formData.value.username !== userStore.user.username ||
    formData.value.email !== userStore.user.email ||
    formData.value.phone !== (userStore.user.phone || '') ||
    formData.value.beneficiary_category !== (userStore.user.beneficiary_category || '') ||
    formData.value.region !== (userStore.user.region || '') ||
    formData.value.snils !== (userStore.user.snils || '')
  )
})

const isAccessibilityChanged = computed(() => {
  if (!userStore.userProfile?.preferences) return false
  const prefs = userStore.userProfile.preferences
  return (
    accessibilitySettings.value.font_size !== (prefs.font_size || 'normal') ||
    accessibilitySettings.value.font_family !== (prefs.font_family || 'sans-serif') ||
    accessibilitySettings.value.letter_spacing !== (prefs.letter_spacing || 1) ||
    accessibilitySettings.value.color_mode !== (prefs.color_mode || 'default') ||
    accessibilitySettings.value.show_images !== (prefs.show_images ?? true) ||
    accessibilitySettings.value.speech_assistant_enabled !== (prefs.speech_assistant_enabled ?? false)
  )
})

const loadProfile = async () => {
  try {
    isLoading.value = true
    await userStore.fetchCurrentUser()
    await referencesStore.initialize()

    if (userStore.user) {
      formData.value = {
        username: userStore.user.username || '',
        email: userStore.user.email || '',
        phone: userStore.user.phone || '',
        beneficiary_category: userStore.user.beneficiary_category || '',
        region: userStore.user.region || '',
        snils: userStore.user.snils || '',
      }
    }

    if (userStore.userProfile?.preferences) {
      const prefs = userStore.userProfile.preferences
      accessibilitySettings.value = {
        font_size: prefs.font_size || 'normal',
        font_family: prefs.font_family || 'sans-serif',
        letter_spacing: prefs.letter_spacing || 1,
        color_mode: prefs.color_mode || 'default',
        show_images: prefs.show_images ?? true,
        speech_assistant_enabled: prefs.speech_assistant_enabled ?? false,
      }
      selectedInterests.value = prefs.interest_categories || []
    }
  } catch (error) {
    showMessage('error', 'Ошибка загрузки профиля')
  } finally {
    isLoading.value = false
  }
}

const handleSnilsInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  formData.value.snils = formatSnils(target.value)
}

const saveProfile = async () => {
  try {
    isSaving.value = true
    saveMessage.value = null

    await userStore.updateUser({
      username: formData.value.username,
      email: formData.value.email,
      phone: formData.value.phone || undefined,
      beneficiary_category: formData.value.beneficiary_category || undefined,
      region: formData.value.region || undefined,
      snils: formData.value.snils ? unformatSnils(formData.value.snils) : undefined,
    })

    await userStore.updatePreferences({
      font_size: accessibilitySettings.value.font_size,
      font_family: accessibilitySettings.value.font_family,
      letter_spacing: accessibilitySettings.value.letter_spacing,
      color_mode: accessibilitySettings.value.color_mode,
      show_images: accessibilitySettings.value.show_images,
      speech_assistant_enabled: accessibilitySettings.value.speech_assistant_enabled,
      interest_categories: selectedInterests.value,
    })

    uiStore.setFontSize(accessibilitySettings.value.font_size)
    uiStore.setFontFamily(accessibilitySettings.value.font_family)
    uiStore.setLetterSpacing(accessibilitySettings.value.letter_spacing)
    uiStore.setColorMode(accessibilitySettings.value.color_mode)
    uiStore.setShowImages(accessibilitySettings.value.show_images)
    uiStore.setSpeechAssistant(accessibilitySettings.value.speech_assistant_enabled)

    showMessage('success', 'Профиль успешно сохранен')
    await loadProfile()
  } catch (error) {
    showMessage('error', 'Ошибка сохранения профиля')
  } finally {
    isSaving.value = false
  }
}

const toggleInterest = (category: BenefitCategory) => {
  const index = selectedInterests.value.indexOf(category)
  if (index > -1) {
    selectedInterests.value.splice(index, 1)
  } else {
    selectedInterests.value.push(category)
  }
}

const showMessage = (type: 'success' | 'error', text: string) => {
  saveMessage.value = { type, text }
  setTimeout(() => {
    saveMessage.value = null
  }, 5000)
}

const handleLogout = async () => {
  if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
    await userStore.logout()
    await navigateTo('/auth/login')
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="pb-20">
    <main class="mx-auto max-w-screen-md px-4 py-6">
      <h1 class="text-3xl font-semibold text-text-main mb-6" id="profile-title">Профиль</h1>

      <div v-if="isLoading" class="text-center py-8" role="status" aria-live="polite">
        <p class="text-text-muted">Загрузка данных профиля...</p>
      </div>

      <div v-else class="space-y-6" role="main" aria-labelledby="profile-title">
        <div
          v-if="saveMessage"
          :class="[
            'rounded-lg border p-4',
            saveMessage.type === 'success'
              ? 'border-success bg-success/10 text-success'
              : 'border-danger bg-danger/10 text-danger',
          ]"
          role="alert"
          aria-live="polite"
        >
          {{ saveMessage.text }}
        </div>

        <section class="rounded-lg border border-bg-elevated bg-bg-elevated p-4" aria-labelledby="personal-data-title">
          <h2 id="personal-data-title" class="text-xl font-medium text-text-main mb-4">Личные данные</h2>

          <div class="space-y-4">
            <div>
              <label for="username" class="block text-base font-medium text-text-main mb-2">
                Имя пользователя
              </label>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="w-full rounded-lg border border-bg-elevated bg-bg-main px-4 py-3 text-base text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-required="true"
                aria-describedby="username-description"
              />
              <p id="username-description" class="sr-only">Введите ваше имя пользователя</p>
            </div>

            <div>
              <label for="email" class="block text-base font-medium text-text-main mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="w-full rounded-lg border border-bg-elevated bg-bg-main px-4 py-3 text-base text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-required="true"
                aria-describedby="email-description"
              />
              <p id="email-description" class="sr-only">Введите ваш email адрес</p>
            </div>

            <div>
              <label for="phone" class="block text-base font-medium text-text-main mb-2">
                Телефон
              </label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                class="w-full rounded-lg border border-bg-elevated bg-bg-main px-4 py-3 text-base text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-describedby="phone-description"
              />
              <p id="phone-description" class="sr-only">Введите ваш номер телефона (необязательно)</p>
            </div>

            <div>
              <label for="beneficiary_category" class="block text-base font-medium text-text-main mb-2">
                Категория льготника
              </label>
              <select
                id="beneficiary_category"
                v-model="formData.beneficiary_category"
                class="w-full rounded-lg border border-bg-elevated bg-bg-main px-4 py-3 text-base text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-describedby="beneficiary-category-description"
              >
                <option value="">Не выбрано</option>
                <option
                  v-for="cat in referencesStore.categories"
                  :key="cat.slug"
                  :value="cat.slug"
                  class="bg-bg-main text-text-main"
                >
                  {{ cat.name }}
                </option>
              </select>
              <p id="beneficiary-category-description" class="sr-only">Выберите вашу категорию льготника</p>
            </div>

            <div>
              <label for="region" class="block text-base font-medium text-text-main mb-2">
                Регион проживания
              </label>
              <select
                id="region"
                v-model="formData.region"
                class="w-full rounded-lg border border-bg-elevated bg-bg-main px-4 py-3 text-base text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-describedby="region-description"
              >
                <option value="">Не выбрано</option>
                <option
                  v-for="reg in referencesStore.regions"
                  :key="reg.code"
                  :value="reg.code"
                  class="bg-bg-main text-text-main"
                >
                  {{ reg.name }}
                </option>
              </select>
              <p id="region-description" class="sr-only">Выберите ваш регион проживания</p>
            </div>

            <div>
              <label for="snils" class="block text-base font-medium text-text-main mb-2">
                Номер СНИЛС (опционально)
              </label>
              <input
                id="snils"
                :value="formData.snils"
                @input="handleSnilsInput"
                type="text"
                placeholder="000-000-000-00"
                maxlength="14"
                class="w-full rounded-lg border border-bg-elevated bg-bg-main px-4 py-3 text-base text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-describedby="snils-description"
              />
              <p id="snils-description" class="sr-only">Введите номер СНИЛС в формате 000-000-000-00 (необязательно)</p>
            </div>
          </div>
        </section>

        <section
          class="rounded-lg border border-bg-elevated bg-bg-elevated p-4"
          aria-labelledby="accessibility-title"
        >
          <h2 id="accessibility-title" class="text-xl font-medium text-text-main mb-4">Настройки доступности</h2>

          <div class="space-y-4">
            <div>
              <label for="font_size" class="block text-base font-medium text-text-main mb-2">
                Размер шрифта
              </label>
              <select
                id="font_size"
                v-model="accessibilitySettings.font_size"
                class="w-full rounded-lg border border-bg-elevated bg-bg-main px-4 py-3 text-base text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-describedby="font-size-description"
              >
                <option value="normal" class="bg-bg-main text-text-main">Обычный</option>
                <option value="enlarged" class="bg-bg-main text-text-main">Увеличенный</option>
                <option value="huge" class="bg-bg-main text-text-main">Очень большой</option>
              </select>
              <p id="font-size-description" class="sr-only">Выберите размер шрифта для более удобного чтения</p>
            </div>

            <div>
              <label for="font_family" class="block text-base font-medium text-text-main mb-2">
                Семейство шрифта
              </label>
              <select
                id="font_family"
                v-model="accessibilitySettings.font_family"
                class="w-full rounded-lg border border-bg-elevated bg-bg-main px-4 py-3 text-base text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-describedby="font-family-description"
              >
                <option value="sans-serif" class="bg-bg-main text-text-main">Без засечек</option>
                <option value="serif" class="bg-bg-main text-text-main">С засечками</option>
              </select>
              <p id="font-family-description" class="sr-only">Выберите семейство шрифта для более удобного чтения</p>
            </div>

            <div>
              <label for="letter_spacing" class="block text-base font-medium text-text-main mb-2">
                Межбуквенное расстояние
              </label>
              <input
                id="letter_spacing"
                v-model.number="accessibilitySettings.letter_spacing"
                type="range"
                min="0"
                max="3"
                step="0.5"
                class="w-full"
                aria-describedby="letter-spacing-description letter-spacing-value"
              />
              <p id="letter-spacing-value" class="text-sm text-text-muted mt-1">
                Текущее значение: {{ accessibilitySettings.letter_spacing }}px
              </p>
              <p id="letter-spacing-description" class="sr-only">
                Настройте межбуквенное расстояние для более удобного чтения
              </p>
            </div>

            <div>
              <label for="color_mode" class="block text-base font-medium text-text-main mb-2">
                Цветовая схема
              </label>
              <select
                id="color_mode"
                v-model="accessibilitySettings.color_mode"
                class="w-full rounded-lg border border-bg-elevated bg-bg-main px-4 py-3 text-base text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-describedby="color-mode-description"
              >
                <option value="default" class="bg-bg-main text-text-main">По умолчанию</option>
                <option value="monochrome" class="bg-bg-main text-text-main">Монохромная</option>
                <option value="inverted" class="bg-bg-main text-text-main">Инвертированная</option>
                <option value="blue_bg" class="bg-bg-main text-text-main">Синий фон</option>
              </select>
              <p id="color-mode-description" class="sr-only">Выберите цветовую схему для более удобного просмотра</p>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label for="show_images" class="block text-base font-medium text-text-main mb-2">
                  Показывать изображения
                </label>
                <p id="show-images-description" class="text-sm text-text-muted">
                  Включить или отключить отображение изображений на сайте
                </p>
              </div>
              <button
                id="show_images"
                type="button"
                role="switch"
                :aria-checked="accessibilitySettings.show_images"
                aria-labelledby="show-images-label"
                aria-describedby="show-images-description"
                @click="accessibilitySettings.show_images = !accessibilitySettings.show_images"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                  accessibilitySettings.show_images ? 'bg-brand-primary' : 'bg-bg-elevated',
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    accessibilitySettings.show_images ? 'translate-x-6' : 'translate-x-1',
                  ]"
                />
              </button>
              <span id="show-images-label" class="sr-only">Показывать изображения</span>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label for="speech_assistant" class="block text-base font-medium text-text-main mb-2">
                  Речевой ассистент
                </label>
                <p id="speech-assistant-description" class="text-sm text-text-muted">
                  Включить озвучивание текста на странице
                </p>
              </div>
              <button
                id="speech_assistant"
                type="button"
                role="switch"
                :aria-checked="accessibilitySettings.speech_assistant_enabled"
                aria-labelledby="speech-assistant-label"
                aria-describedby="speech-assistant-description"
                @click="
                  accessibilitySettings.speech_assistant_enabled = !accessibilitySettings.speech_assistant_enabled
                "
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                  accessibilitySettings.speech_assistant_enabled ? 'bg-brand-primary' : 'bg-bg-elevated',
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    accessibilitySettings.speech_assistant_enabled ? 'translate-x-6' : 'translate-x-1',
                  ]"
                />
              </button>
              <span id="speech-assistant-label" class="sr-only">Речевой ассистент</span>
            </div>
          </div>
        </section>

        <section class="rounded-lg border border-bg-elevated bg-bg-elevated p-4" aria-labelledby="interests-title">
          <h2 id="interests-title" class="text-xl font-medium text-text-main mb-4">Интересующие категории</h2>
          <p id="interests-description" class="text-base text-text-muted mb-4">
            Выберите категории льгот, которые вас интересуют. Это поможет нам показывать вам наиболее релевантные
            предложения.
          </p>

          <div class="flex flex-wrap gap-2" role="group" aria-labelledby="interests-title" aria-describedby="interests-description">
            <button
              v-for="interest in selectedInterests"
              :key="interest"
              type="button"
              @click="toggleInterest(interest)"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-brand-primary text-white hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              :aria-label="`Удалить категорию ${interest} из избранного`"
            >
              {{ referencesStore.getCategoryBySlug(interest)?.name || interest }}
            </button>
            <button
              v-for="category in availableInterests"
              :key="category.slug"
              type="button"
              @click="toggleInterest(category.slug as BenefitCategory)"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-bg-elevated text-text-main hover:bg-bg-elevated/80 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              :aria-label="`Добавить категорию ${category.name} в избранное`"
            >
              {{ category.name }}
            </button>
          </div>
        </section>

        <section class="rounded-lg border border-bg-elevated bg-bg-elevated p-4" aria-labelledby="security-title">
          <h2 id="security-title" class="text-xl font-medium text-text-main mb-4">Безопасность</h2>
          <button
            type="button"
            @click="handleLogout"
            class="w-full rounded-lg border border-danger bg-danger/10 px-4 py-3 text-base font-medium text-danger hover:bg-danger/20 transition-colors focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2"
            aria-describedby="logout-description"
          >
            Выйти из аккаунта
          </button>
          <p id="logout-description" class="sr-only">Нажмите, чтобы выйти из вашего аккаунта</p>
        </section>

        <button
          type="button"
          @click="saveProfile"
          :disabled="isSaving || (!isProfileChanged && !isAccessibilityChanged)"
          class="w-full rounded-lg bg-brand-primary px-4 py-3 text-base font-medium text-white hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          aria-describedby="save-description"
        >
          {{ isSaving ? 'Сохранение...' : 'Сохранить изменения' }}
        </button>
        <p id="save-description" class="sr-only">Нажмите, чтобы сохранить все изменения в профиле</p>
      </div>
    </main>
  </div>
</template>

