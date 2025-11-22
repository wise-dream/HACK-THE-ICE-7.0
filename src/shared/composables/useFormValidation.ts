import { computed, ref } from 'vue'
import { validateSnils } from '~/shared/utils/snils'

export interface ValidationRule {
  required?: boolean
  email?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: unknown) => string | true
  snils?: boolean
  match?: string | (() => string)
}

export interface ValidationErrors {
  [key: string]: string
}

export const useFormValidation = () => {
  const errors = ref<ValidationErrors>({})

  const validateEmail = (email: string): string | true => {
    if (!email) return 'Email обязателен'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Некорректный формат email'
    }
    return true
  }

  const validateSnilsField = (value: string): string | true => {
    if (!value) return 'СНИЛС обязателен'
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length !== 11) {
      return 'СНИЛС должен содержать 11 цифр'
    }
    if (!validateSnils(value)) {
      return 'Некорректный СНИЛС'
    }
    return true
  }

  const validateRequired = (value: unknown, fieldName?: string): string | true => {
    if (value === null || value === undefined || value === '') {
      return fieldName ? `${fieldName} обязателен` : 'Поле обязательно'
    }
    if (typeof value === 'string' && value.trim() === '') {
      return fieldName ? `${fieldName} обязателен` : 'Поле обязательно'
    }
    return true
  }

  const validateMinLength = (value: string, min: number): string | true => {
    if (value.length < min) {
      return `Минимальная длина: ${min} символов`
    }
    return true
  }

  const validateMaxLength = (value: string, max: number): string | true => {
    if (value.length > max) {
      return `Максимальная длина: ${max} символов`
    }
    return true
  }

  const validatePattern = (value: string, pattern: RegExp, message?: string): string | true => {
    if (!pattern.test(value)) {
      return message || 'Некорректный формат'
    }
    return true
  }

  const validateMatch = (
    value: string,
    matchValue: string | (() => string),
    message?: string
  ): string | true => {
    const match = typeof matchValue === 'function' ? matchValue() : matchValue
    if (value !== match) {
      return message || 'Значения не совпадают'
    }
    return true
  }

  const validateField = (name: string, value: unknown, rules: ValidationRule): string | true => {
    if (rules.required) {
      const requiredError = validateRequired(value, name)
      if (requiredError !== true) {
        return requiredError
      }
    }

    if (value === null || value === undefined || value === '') {
      return true
    }

    if (rules.email && typeof value === 'string') {
      const emailError = validateEmail(value)
      if (emailError !== true) {
        return emailError
      }
    }

    if (rules.snils && typeof value === 'string') {
      const snilsError = validateSnilsField(value)
      if (snilsError !== true) {
        return snilsError
      }
    }

    if (rules.minLength && typeof value === 'string') {
      const minLengthError = validateMinLength(value, rules.minLength)
      if (minLengthError !== true) {
        return minLengthError
      }
    }

    if (rules.maxLength && typeof value === 'string') {
      const maxLengthError = validateMaxLength(value, rules.maxLength)
      if (maxLengthError !== true) {
        return maxLengthError
      }
    }

    if (rules.pattern && typeof value === 'string') {
      const patternError = validatePattern(value, rules.pattern)
      if (patternError !== true) {
        return patternError
      }
    }

    if (rules.match && typeof value === 'string') {
      const matchError = validateMatch(value, rules.match)
      if (matchError !== true) {
        return matchError
      }
    }

    if (rules.custom) {
      const customError = rules.custom(value)
      if (customError !== true) {
        return customError
      }
    }

    return true
  }

  const validateForm = (
    data: Record<string, unknown>,
    rules: Record<string, ValidationRule>
  ): boolean => {
    errors.value = {}
    let isValid = true

    Object.keys(rules).forEach((fieldName) => {
      const fieldRules = rules[fieldName]
      if (!fieldRules) {
        return
      }
      const fieldValue = data[fieldName]
      const error = validateField(fieldName, fieldValue, fieldRules)

      if (error !== true) {
        errors.value[fieldName] = error
        isValid = false
      }
    })

    return isValid
  }

  const clearErrors = (): void => {
    errors.value = {}
  }

  const clearFieldError = (fieldName: string): void => {
    delete errors.value[fieldName]
  }

  const setFieldError = (fieldName: string, error: string): void => {
    errors.value[fieldName] = error
  }

  const hasError = (fieldName: string): boolean => {
    return !!errors.value[fieldName]
  }

  const getError = (fieldName: string): string | undefined => {
    return errors.value[fieldName]
  }

  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  return {
    errors,
    validateForm,
    validateField,
    validateEmail,
    validateSnilsField,
    validateRequired,
    clearErrors,
    clearFieldError,
    setFieldError,
    hasError,
    getError,
    isValid,
  }
}
