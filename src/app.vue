<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'

// Принудительно отключаем темную тему
onMounted(() => {
	const html = document.documentElement
	const body = document.body
	
	// Устанавливаем светлую тему сразу
	html.classList.remove('dark', 'mode-dark')
	html.classList.add('light', 'mode-light')
	html.setAttribute('data-theme', 'light')
	html.setAttribute('data-color-mode', 'light')
	html.setAttribute('data-mode', 'light')
	body.classList.remove('dark', 'mode-dark')
	body.classList.add('light', 'mode-light')
	
	// Удаляем localStorage темной темы если есть
	if (typeof window !== 'undefined') {
		try {
			localStorage.removeItem('nuxt-color-mode')
			localStorage.removeItem('color-mode')
			localStorage.setItem('nuxt-color-mode', 'light')
		} catch (e) {
			console.warn('Could not access localStorage:', e)
		}
	}
	
	// Следим за изменениями и всегда убираем класс dark
	const observer = new MutationObserver(() => {
		const currentHtml = document.documentElement
		const currentBody = document.body
		
		// Удаляем все варианты темной темы
		if (currentHtml.classList.contains('dark') || currentHtml.classList.contains('mode-dark')) {
			currentHtml.classList.remove('dark', 'mode-dark')
			currentHtml.classList.add('light', 'mode-light')
		}
		if (currentBody.classList.contains('dark') || currentBody.classList.contains('mode-dark')) {
			currentBody.classList.remove('dark', 'mode-dark')
			currentBody.classList.add('light', 'mode-light')
		}
		if (currentHtml.getAttribute('data-theme') === 'dark' || 
			currentHtml.getAttribute('data-color-mode') === 'dark' ||
			currentHtml.getAttribute('data-mode') === 'dark') {
			currentHtml.setAttribute('data-theme', 'light')
			currentHtml.setAttribute('data-color-mode', 'light')
			currentHtml.setAttribute('data-mode', 'light')
		}
		
		// Проверяем все возможные атрибуты
		const darkAttributes = ['dark', 'data-theme="dark"', 'data-color-mode="dark"', 'data-mode="dark"']
		darkAttributes.forEach(attr => {
			if (currentHtml.hasAttribute(attr)) {
				currentHtml.removeAttribute(attr)
			}
		})
	})
	
	observer.observe(html, {
		attributes: true,
		attributeFilter: ['class', 'data-theme', 'data-color-mode', 'data-mode'],
		subtree: true,
	})
	
	// Также отслеживаем body
	observer.observe(body, {
		attributes: true,
		attributeFilter: ['class'],
	})
	
	// Периодическая проверка (на случай если что-то пропустили)
	const checkInterval = setInterval(() => {
		if (html.classList.contains('dark') || html.classList.contains('mode-dark')) {
			html.classList.remove('dark', 'mode-dark')
			html.classList.add('light', 'mode-light')
		}
	}, 100)
	
	// Очистка при размонтировании (если нужно)
	// observer и checkInterval будут работать до перезагрузки страницы
})
</script>

