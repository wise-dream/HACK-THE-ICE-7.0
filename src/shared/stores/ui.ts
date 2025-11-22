import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ColorMode, FontFamily, FontSize, UserPreferences } from '~/entities/user'

const STORAGE_KEY = 'ui_preferences'

interface UiPreferences {
  fontSize: FontSize
  fontFamily: FontFamily
  letterSpacing: number
  colorMode: ColorMode
  showImages: boolean
  speechAssistantEnabled: boolean
  offlineMode: boolean
}

const defaultPreferences: UiPreferences = {
  fontSize: 'normal',
  fontFamily: 'sans-serif',
  letterSpacing: 1,
  colorMode: 'default',
  showImages: true,
  speechAssistantEnabled: false,
  offlineMode: false,
}

const loadFromStorage = (): UiPreferences => {
  if (typeof window === 'undefined') return defaultPreferences

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaultPreferences, ...parsed }
    }
  } catch (error) {
    console.warn('Failed to load UI preferences from localStorage:', error)
  }

  return defaultPreferences
}

const saveToStorage = (preferences: UiPreferences): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch (error) {
    console.warn('Failed to save UI preferences to localStorage:', error)
  }
}

export const useUIStore = defineStore('ui', () => {
  const stored = loadFromStorage()

  const fontSize = ref<FontSize>(stored.fontSize)
  const fontFamily = ref<FontFamily>(stored.fontFamily)
  const letterSpacing = ref<number>(stored.letterSpacing)
  const colorMode = ref<ColorMode>(stored.colorMode)
  const showImages = ref<boolean>(stored.showImages)
  const speechAssistantEnabled = ref<boolean>(stored.speechAssistantEnabled)
  const offlineMode = ref<boolean>(stored.offlineMode)

  const applyStyles = () => {
    if (typeof document === 'undefined') return

    const root = document.documentElement

    root.classList.remove('font-normal', 'font-enlarged', 'font-huge')
    root.classList.add(`font-${fontSize.value}`)

    root.classList.remove('font-sans-serif', 'font-serif')
    root.classList.add(`font-${fontFamily.value}`)

    root.style.setProperty('--letter-spacing', `${letterSpacing.value}px`)

    root.classList.remove('color-default', 'color-monochrome', 'color-inverted', 'color-blue-bg')
    const colorModeClass =
      colorMode.value === 'blue_bg' ? 'color-blue-bg' : `color-${colorMode.value}`
    root.classList.add(colorModeClass)

    if (!showImages.value) {
      root.classList.add('hide-images')
    } else {
      root.classList.remove('hide-images')
    }
  }

  watch(
    [fontSize, fontFamily, letterSpacing, colorMode, showImages],
    () => {
      const preferences: UiPreferences = {
        fontSize: fontSize.value,
        fontFamily: fontFamily.value,
        letterSpacing: letterSpacing.value,
        colorMode: colorMode.value,
        showImages: showImages.value,
        speechAssistantEnabled: speechAssistantEnabled.value,
        offlineMode: offlineMode.value,
      }
      saveToStorage(preferences)
      applyStyles()
    },
    { immediate: true }
  )

  watch([speechAssistantEnabled, offlineMode], () => {
    const preferences: UiPreferences = {
      fontSize: fontSize.value,
      fontFamily: fontFamily.value,
      letterSpacing: letterSpacing.value,
      colorMode: colorMode.value,
      showImages: showImages.value,
      speechAssistantEnabled: speechAssistantEnabled.value,
      offlineMode: offlineMode.value,
    }
    saveToStorage(preferences)
  })

  const setFontSize = (size: FontSize): void => {
    fontSize.value = size
  }

  const setFontFamily = (family: FontFamily): void => {
    fontFamily.value = family
  }

  const setLetterSpacing = (spacing: number): void => {
    letterSpacing.value = spacing
  }

  const setColorMode = (mode: ColorMode): void => {
    colorMode.value = mode
  }

  const toggleShowImages = (): void => {
    showImages.value = !showImages.value
  }

  const setShowImages = (value: boolean): void => {
    showImages.value = value
  }

  const toggleSpeechAssistant = (): void => {
    speechAssistantEnabled.value = !speechAssistantEnabled.value
  }

  const setSpeechAssistant = (value: boolean): void => {
    speechAssistantEnabled.value = value
  }

  const setOfflineMode = (mode: boolean): void => {
    offlineMode.value = mode
  }

  const syncWithUserProfile = (preferences: UserPreferences): void => {
    if (preferences.font_size) {
      fontSize.value = preferences.font_size
    }
    if (preferences.font_family) {
      fontFamily.value = preferences.font_family
    }
    if (preferences.letter_spacing !== undefined) {
      letterSpacing.value = preferences.letter_spacing
    }
    if (preferences.color_mode) {
      colorMode.value = preferences.color_mode
    }
    if (preferences.show_images !== undefined) {
      showImages.value = preferences.show_images
    }
    if (preferences.speech_assistant_enabled !== undefined) {
      speechAssistantEnabled.value = preferences.speech_assistant_enabled
    }
  }

  const resetToDefaults = (): void => {
    fontSize.value = defaultPreferences.fontSize
    fontFamily.value = defaultPreferences.fontFamily
    letterSpacing.value = defaultPreferences.letterSpacing
    colorMode.value = defaultPreferences.colorMode
    showImages.value = defaultPreferences.showImages
    speechAssistantEnabled.value = defaultPreferences.speechAssistantEnabled
    offlineMode.value = defaultPreferences.offlineMode
  }

  return {
    fontSize,
    fontFamily,
    letterSpacing,
    colorMode,
    showImages,
    speechAssistantEnabled,
    offlineMode,
    setFontSize,
    setFontFamily,
    setLetterSpacing,
    setColorMode,
    toggleShowImages,
    setShowImages,
    toggleSpeechAssistant,
    setSpeechAssistant,
    setOfflineMode,
    syncWithUserProfile,
    resetToDefaults,
  }
})
