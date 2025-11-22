<script setup lang="ts">
import * as v from 'valibot'
import { computed, onMounted, reactive, ref } from 'vue'
import type { FormSubmitEvent } from '#ui/types'
import type { BeneficiaryCategory } from '~/entities/benefit'
import type { RegisterData } from '~/entities/user'
import { useReferencesStore, useUserStore } from '~/shared/stores'
import { formatSnils, validateSnils } from '~/shared/utils/snils'

const userStore = useUserStore()
const referencesStore = useReferencesStore()

const schema = v.object({
  username: v.pipe(
    v.string('Имя пользователя обязательно'),
    v.minLength(3, 'Имя пользователя должно содержать минимум 3 символа'),
    v.maxLength(150, 'Имя пользователя не должно превышать 150 символов')
  ),
  email: v.pipe(
    v.string('Email обязателен'),
    v.email('Некорректный формат email')
  ),
  phone: v.optional(v.string()),
  beneficiaryCategory: v.optional(v.string()),
  region: v.optional(v.string()),
  snils: v.optional(
    v.pipe(
      v.string(),
      v.custom((input: unknown) => {
        if (typeof input !== 'string') return false
        const value = input
        // Если поле пустое, это валидно (опциональное поле)
        if (!value || value.trim() === '') return true
        
        const cleaned = value.replace(/\D/g, '')
        
        // Если меньше 11 цифр, не валидируем (пользователь еще вводит)
        // Валидируем только если введено ровно 11 цифр
        if (cleaned.length < 11) return true
        if (cleaned.length > 11) return false
        
        // Валидация контрольной суммы только для полного СНИЛС
        return validateSnils(cleaned)
      }, 'Некорректный СНИЛС. Проверьте контрольную сумму.')
    )
  ),
  password: v.pipe(
    v.string('Пароль обязателен'),
    v.minLength(8, 'Пароль должен содержать минимум 8 символов')
  ),
  password2: v.pipe(
    v.string('Подтверждение пароля обязательно'),
    v.minLength(1, 'Подтверждение пароля обязательно')
  ),
})

type Schema = v.InferInput<typeof schema>

const state = reactive<Schema>({
  username: '',
  email: '',
  phone: '',
  beneficiaryCategory: '',
  region: '',
  snils: '',
  password: '',
  password2: '',
})

const showPassword = ref(false)
const showPassword2 = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const beneficiaryCategories = [
  { value: 'pensioner', label: 'Пенсионер' },
  { value: 'disability_1', label: 'Инвалид I группы' },
  { value: 'disability_2', label: 'Инвалид II группы' },
  { value: 'disability_3', label: 'Инвалид III группы' },
  { value: 'large_family', label: 'Многодетная семья' },
  { value: 'veteran', label: 'Ветеран' },
  { value: 'low_income', label: 'Малоимущий' },
  { value: 'svo_participant', label: 'Участник СВО' },
  { value: 'svo_family', label: 'Семья участника СВО' },
  { value: 'other', label: 'Другое' },
]

// Моки для регионов (если store пуст)
const mockRegions = [
  { code: '77', name: 'Москва' },
  { code: '78', name: 'Санкт-Петербург' },
  { code: '50', name: 'Московская область' },
  { code: '47', name: 'Ленинградская область' },
  { code: '66', name: 'Свердловская область' },
  { code: '54', name: 'Новосибирская область' },
  { code: '23', name: 'Краснодарский край' },
  { code: '59', name: 'Пермский край' },
  { code: '02', name: 'Республика Башкортостан' },
  { code: '16', name: 'Республика Татарстан' },
]

const regions = computed(() => {
  // Если регионы загружены из store, используем их, иначе моки
  const storeRegions = referencesStore.regions
  if (Array.isArray(storeRegions) && storeRegions.length > 0) {
    return storeRegions
  }
  return mockRegions
})

const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  // Ограничиваем до 11 цифр (7 + 10 цифр номера)
  const maxDigits = 11
  const limitedCleaned = cleaned.slice(0, maxDigits)
  
  if (limitedCleaned.length === 0) return ''
  if (limitedCleaned.length <= 1) return `+7 (${limitedCleaned}`
  if (limitedCleaned.length <= 4) return `+7 (${limitedCleaned.slice(1)}`
  if (limitedCleaned.length <= 7) return `+7 (${limitedCleaned.slice(1, 4)}) ${limitedCleaned.slice(4)}`
  if (limitedCleaned.length <= 9) return `+7 (${limitedCleaned.slice(1, 4)}) ${limitedCleaned.slice(4, 7)}-${limitedCleaned.slice(7)}`
  // Максимум 17 символов: +7 (XXX) XXX-XX-XX
  return `+7 (${limitedCleaned.slice(1, 4)}) ${limitedCleaned.slice(4, 7)}-${limitedCleaned.slice(7, 9)}-${limitedCleaned.slice(9, 11)}`
}

const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const formatted = formatPhone(target.value)
  state.phone = formatted
}

const handleSnilsInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  state.snils = formatSnils(target.value)
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  errorMessage.value = ''

  // Проверка совпадения паролей
  if (event.data.password !== event.data.password2) {
    errorMessage.value = 'Пароли не совпадают'
    return
  }

  try {
    isLoading.value = true
    const registerData: RegisterData = {
      username: event.data.username,
      email: event.data.email,
      password: event.data.password,
      password2: event.data.password2,
    }

    if (event.data.phone) {
      registerData.phone = event.data.phone.replace(/\D/g, '').replace(/^7/, '')
    }
    if (event.data.beneficiaryCategory) {
      registerData.beneficiary_category = event.data.beneficiaryCategory as BeneficiaryCategory
    }
    if (event.data.region) {
      registerData.region = event.data.region
    }
    if (event.data.snils) {
      registerData.snils = event.data.snils.replace(/\D/g, '')
    }

    await userStore.register(registerData)
    await navigateTo('/onboarding/profile')
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: Record<string, string | string[]> } }
    if (apiError.response?.data) {
      const errorData = apiError.response.data
      if (errorData.detail) {
        errorMessage.value = Array.isArray(errorData.detail) ? errorData.detail[0] || '' : errorData.detail || ''
      }
      if (errorData.non_field_errors) {
        const nonFieldError = Array.isArray(errorData.non_field_errors)
          ? errorData.non_field_errors[0]
          : errorData.non_field_errors
        if (nonFieldError) {
          errorMessage.value = nonFieldError
        }
      }
    } else {
      errorMessage.value = (error as Error).message || 'Ошибка регистрации'
    }
  } finally {
    isLoading.value = false
  }
}

const handleOAuthGosuslugi = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const mockData = {
      email: state.email || 'user@example.com',
    }

    await userStore.oauthGosuslugi(mockData)
    await navigateTo('/onboarding/profile')
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    errorMessage.value = apiError.message || 'Ошибка авторизации через Госуслуги'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (referencesStore.regions.length === 0) {
    try {
      await referencesStore.fetchRegions()
    } catch (error) {
      console.error('Failed to load regions:', error)
    }
  }
})

const selectUi = {
  item: 'min-h-[48px] flex items-center pl-[16px] rounded-[16px]',
  placeholder: 'pl-[16px]',
  value: 'pl-[16px]',
}
</script>

<template>
  <div class="min-h-screen from-green-50 to-white">
    <main class="flex items-center justify-center px-4 py-12" role="main">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <header class="text-center mb-8">
            <h1 id="register-heading" class="text-3xl font-bold text-gray-900 mb-2">
              Регистрация
            </h1>
            <p class="text-base text-gray-600">
              Создайте аккаунт для доступа к льготам
            </p>
          </header>

          <UAlert
            v-if="errorMessage"
            color="error"
            variant="soft"
            :title="errorMessage"
            class="mb-6"
            role="alert"
            :aria-live="errorMessage ? 'assertive' : 'off'"
            aria-atomic="true"
          />

          <UButton
            type="button"
            @click="handleOAuthGosuslugi"
            :disabled="isLoading"
            :loading="isLoading"
            size="lg"
            block
            class="mb-6 text-white font-medium text-md bg-brand-primary"
            aria-label="Войти через Госуслуги для регистрации"
          >
            <Icon name="mdi:plus" size="20" class="mr-2" aria-hidden="true" />
            Войти через Госуслуги
          </UButton>

          <div class="relative mb-6" aria-hidden="true">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500" aria-label="Разделитель: или">
                или зарегистрируйтесь по email
              </span>
            </div>
          </div>

          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
            aria-labelledby="register-heading"
          >
            <UFormField label="Имя пользователя" name="username" required>
              <UInput
                v-model="state.username"
                type="text"
                autocomplete="username"
                placeholder="ivan_ivanov"
                :disabled="isLoading"
                aria-required="true"
                class="text-gray-900 w-full"
              />
            </UFormField>

            <UFormField label="Email" name="email" required>
              <UInput
                v-model="state.email"
                type="email"
                autocomplete="email"
                placeholder="ivan_ivanov@gmail.com"
                :disabled="isLoading"
                aria-required="true"
                class="text-gray-900 w-full"
              />
            </UFormField>

            <UFormField label="Телефон" name="phone">
              <UInput
                :value="state.phone"
                @input="handlePhoneInput"
                type="tel"
                autocomplete="tel"
                placeholder="+7 (999) 123-45-67"
                maxlength="18"
                :disabled="isLoading"
                class="text-gray-900 w-full"
              />
            </UFormField>

            <UFormField label="Категория льготника" name="beneficiaryCategory">
              <USelect
                v-model="state.beneficiaryCategory"
                :items="beneficiaryCategories"
                :ui="selectUi"
                labelKey="label"
                valueKey="value"
                placeholder="Выберите категорию"
                :disabled="isLoading"
                aria-label="Выберите категорию льготника"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Регион проживания" name="region">
              <USelect
                v-model="state.region"
                :items="regions"
                :ui="selectUi"
                labelKey="name"
                valueKey="code"
                placeholder="Выберите регион"
                :disabled="isLoading"
                aria-label="Выберите регион проживания"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="СНИЛС"
              name="snils"
            >
              <UInput
                :value="state.snils"
                @input="handleSnilsInput"
                type="text"
                placeholder="123-456-789 00"
                maxlength="14"
                :disabled="isLoading"
                class="text-gray-900 w-full"
              />
            </UFormField>

            <UFormField label="Пароль" name="password" required>
              <div class="relative">
                <UInput
                  v-model="state.password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Введите пароль"
                  :disabled="isLoading"
                  aria-required="true"
                  class="text-gray-900 w-full"
                />
                <UButton
                  type="button"
                  variant="ghost"
                  size="xs"
                  :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                  class="absolute right-2 top-1/2 -translate-y-1/2"
                  @click="showPassword = !showPassword"
                >
                  <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" size="20" aria-hidden="true" />
                </UButton>
              </div>
            </UFormField>

            <UFormField label="Подтвердите пароль" name="password2" required>
              <div class="relative">
                <UInput
                  v-model="state.password2"
                  :type="showPassword2 ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Повторите пароль"
                  :disabled="isLoading"
                  aria-required="true"
                  class="text-gray-900 w-full"
                />
                <UButton
                  type="button"
                  variant="ghost"
                  size="xs"
                  :aria-label="showPassword2 ? 'Скрыть пароль' : 'Показать пароль'"
                  class="absolute right-2 top-1/2 -translate-y-1/2"
                  @click="showPassword2 = !showPassword2"
                >
                  <Icon :name="showPassword2 ? 'mdi:eye-off' : 'mdi:eye'" size="20" aria-hidden="true" />
                </UButton>
              </div>
            </UFormField>

            <UButton
              type="submit"
              :disabled="isLoading"
              :loading="isLoading"
              size="lg"
              color="primary"
              block
              class="w-full text-md bg-brand-primary"
              :aria-label="isLoading ? 'Выполняется регистрация...' : 'Зарегистрировать аккаунт'"
            >
              {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
            </UButton>
          </UForm>

          <div class="mt-4 text-center">
            <NuxtLink to="/auth/login" aria-label="Перейти к странице входа">
              <UButton variant="outline" size="sm" class="w-full text-md flex items-center justify-center">
                <span class="text-gray-900">
                  Уже есть аккаунт?
                </span>
                <b class="text-brand-primary font-medium">
                  Войти
                </b>
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
