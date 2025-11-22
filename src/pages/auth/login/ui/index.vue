<script setup lang="ts">
import * as v from 'valibot'
import { reactive, ref } from 'vue'
import type { FormSubmitEvent } from '#ui/types'
import { useUserStore } from '~/shared/stores'

const userStore = useUserStore()

const schema = v.object({
  email: v.pipe(
    v.string('Email обязателен'),
    v.email('Некорректный формат email')
  ),
  password: v.pipe(
    v.string('Пароль обязателен'),
    v.minLength(8, 'Пароль должен содержать минимум 8 символов')
  ),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Schema>({
  email: '',
  password: '',
})

const isLoading = ref(false)
const errorMessage = ref('')

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  errorMessage.value = ''

  try {
    isLoading.value = true
    await userStore.login(event.data.email, event.data.password)
    await navigateTo('/main')
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: Record<string, string | string[]> } }
    if (apiError.response?.data) {
      const errorData = apiError.response.data
      if (errorData.detail) {
        errorMessage.value = Array.isArray(errorData.detail) ? errorData.detail[0] || '' : errorData.detail || ''
      }
      if (errorData.non_field_errors) {
        errorMessage.value = errorData.non_field_errors[0] || 'Ошибка авторизации'
      }
    } else {
      errorMessage.value = (error as Error).message || 'Ошибка авторизации'
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
    await navigateTo('/main')
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    errorMessage.value = apiError.message || 'Ошибка авторизации через Госуслуги'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <main class="flex items-center justify-center px-4 py-12 min-h-[calc(100vh-80px)]" role="main">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-xl shadow-[0_0_16px_0_rgba(0,0,0,0.1)] p-8">
          <header class="text-center mb-8">
            <h1 id="login-heading" class="text-3xl font-bold text-gray-900 mb-2">
              Вход
            </h1>
            <p class="text-base text-gray-600">
              Войдите в свой аккаунт
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

          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
            aria-labelledby="login-heading"
          >
            <UFormField label="Email" name="email" required>
              <UInput
                v-model="state.email"
                type="email"
                autocomplete="email"
                placeholder="example@mail.com"
                :disabled="isLoading"
                aria-required="true"
                class="w-full text-gray-900"
              />
            </UFormField>

            <UFormField label="Пароль" name="password" required>
              <UInput
                v-model="state.password"
                type="password"
                autocomplete="current-password"
                placeholder="Введите пароль"
                :disabled="isLoading"
                aria-required="true"
                class="w-full text-gray-900"
              />
            </UFormField>

            <UButton
              type="submit"
              :disabled="isLoading"
              :loading="isLoading"
              size="lg"
              color="primary"
              class="text-md bg-brand-primary"
              block
              :aria-label="isLoading ? 'Выполняется вход...' : 'Войти в аккаунт'"
            >
              {{ isLoading ? 'Вход...' : 'Войти' }}
            </UButton>

            <NuxtLink
              to="/auth/forgot-password"
              aria-label="Восстановить забытый пароль"
            >
              <UButton variant="outline" class="text-md w-full text-black flex items-center justify-center">
                <span class="font-medium text-md">
                  Забыли пароль?
                </span>
              </UButton>
            </NuxtLink>
            
          </UForm>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500" aria-label="Разделитель: или">
                или
              </span>
            </div>
          </div>

          <UButton
            type="button"
            @click="handleOAuthGosuslugi"
            :disabled="isLoading"
            :loading="isLoading"
            size="lg"
            block
            class="text-gray-900 font-medium text-md text-white bg-brand-primary"
            aria-label="Войти через Госуслуги"
          >
            <Icon name="mdi:plus" size="20" class="mr-2" aria-hidden="true" />
            Войти через Госуслуги
          </UButton>

          <div class="mt-4 text-center">
            <NuxtLink to="/auth/register" aria-label="Перейти к странице регистрации">
              <UButton variant="outline" class="w-full text-md flex items-center justify-center mt-4">
                <span class="text-gray-900">
                  Нет аккаунта?
                </span>
                <b class="text-brand-primary font-medium">
                  Зарегистрироваться
                </b>
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>