export const formatSnils = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length === 0) return ''
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  if (cleaned.length <= 11) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)} ${cleaned.slice(9)}`
  // Максимум 11 цифр для СНИЛС
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)} ${cleaned.slice(9, 11)}`
}

export const maskSnils = (value: string): string => {
  if (!value) return ''
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length < 11) return value
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)} **`
}

export const validateSnils = (value: string): boolean => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length !== 11) return false
  const digits = cleaned.split('').map(Number)
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += (digits[i] ?? 0) * (9 - i)
  }
  let checkDigit = sum % 101
  if (checkDigit === 100) checkDigit = 0
  return checkDigit === digits[9] || (checkDigit === 0 && digits[9] === 0 && digits[10] === 0)
}

export const unformatSnils = (value: string): string => {
  return value.replace(/\D/g, '')
}
