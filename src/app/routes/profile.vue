<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/widgets/layout/header/ui/Header.vue'

const category = ref('pensioner')
const region = ref('moscow')
const snils = ref('')

const categories = [
	{ value: 'pensioner', label: 'Пенсионер' },
	{ value: 'disabled-1', label: 'Инвалид 1 группы' },
	{ value: 'disabled-2', label: 'Инвалид 2 группы' },
	{ value: 'disabled-3', label: 'Инвалид 3 группы' },
	{ value: 'large-family', label: 'Многодетный родитель' },
	{ value: 'veteran', label: 'Ветеран' },
	{ value: 'low-income', label: 'Малоимущий' },
	{ value: 'other', label: 'Другое' },
]

const regions = [
	{ value: 'moscow', label: 'Москва' },
	{ value: 'spb', label: 'Санкт-Петербург' },
	{ value: 'yakutsk', label: 'Якутск' },
	{ value: 'novosibirsk', label: 'Новосибирск' },
]

const formatSnils = (value: string) => {
	const cleaned = value.replace(/\D/g, '')
	if (cleaned.length <= 3) return cleaned
	if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
	if (cleaned.length <= 11) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
	return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}-${cleaned.slice(11, 13)}`
}

const handleSnilsInput = (e: Event) => {
	const target = e.target as HTMLInputElement
	snils.value = formatSnils(target.value)
}

const saveProfile = () => {
	console.log('Сохранение профиля:', { category: category.value, region: region.value, snils: snils.value })
}
</script>

<template>
	<div class="min-h-screen bg-bg-main pb-20">
		<Header />

		<div class="mx-auto max-w-screen-md px-4 py-6">
			<h1 class="text-3xl font-semibold text-text-main mb-6">Профиль</h1>

			<div class="space-y-6">
				<div class="rounded-lg border border-bg-elevated bg-bg-elevated p-4">
					<h2 class="text-xl font-medium text-text-main mb-4">Личные данные</h2>

					<div class="space-y-4">
						<div>
							<label class="block text-base font-medium text-text-main mb-2">
								Категория льготника
							</label>
							<select
								v-model="category"
								class="w-full rounded-lg border border-bg-elevated bg-bg-main px-4 py-3 text-base text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
							>
								<option
									v-for="cat in categories"
									:key="cat.value"
									:value="cat.value"
									class="bg-bg-main text-text-main"
								>
									{{ cat.label }}
								</option>
							</select>
						</div>

						<div>
							<label class="block text-base font-medium text-text-main mb-2">
								Регион проживания
							</label>
							<select
								v-model="region"
								class="w-full rounded-lg border border-bg-elevated bg-bg-main px-4 py-3 text-base text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
							>
								<option
									v-for="reg in regions"
									:key="reg.value"
									:value="reg.value"
									class="bg-bg-main text-text-main"
								>
									{{ reg.label }}
								</option>
							</select>
						</div>

						<div>
							<label class="block text-base font-medium text-text-main mb-2">
								Номер СНИЛС (опционально)
							</label>
							<input
								:value="snils"
								@input="handleSnilsInput"
								type="text"
								placeholder="000-000-000-00"
								maxlength="14"
								class="w-full rounded-lg border border-bg-elevated bg-bg-main px-4 py-3 text-base text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
							/>
						</div>

						<button
							type="button"
							class="w-full rounded-lg border border-brand-primary bg-brand-primary/10 px-4 py-3 text-base font-medium text-brand-primary hover:bg-brand-primary/20 transition-colors"
						>
							Проверить статус льготника
						</button>
					</div>
				</div>

				<div class="rounded-lg border border-bg-elevated bg-bg-elevated p-4">
					<h2 class="text-xl font-medium text-text-main mb-4">Интересующие категории</h2>
					<p class="text-base text-text-muted">Функционал в разработке</p>
				</div>

				<div class="rounded-lg border border-bg-elevated bg-bg-elevated p-4">
					<h2 class="text-xl font-medium text-text-main mb-4">Доступность</h2>
					<p class="text-base text-text-muted">Функционал в разработке</p>
				</div>

				<div class="rounded-lg border border-bg-elevated bg-bg-elevated p-4">
					<h2 class="text-xl font-medium text-text-main mb-4">Безопасность</h2>
					<button
						type="button"
						class="w-full rounded-lg border border-danger bg-danger/10 px-4 py-3 text-base font-medium text-danger hover:bg-danger/20 transition-colors"
					>
						Выйти
					</button>
				</div>

				<button
					@click="saveProfile"
					class="w-full rounded-lg bg-brand-primary px-4 py-3 text-base font-medium text-white hover:bg-brand-primary/90 transition-colors"
				>
					Сохранить изменения
				</button>
			</div>
		</div>
	</div>
</template>

