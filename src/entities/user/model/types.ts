import type { BeneficiaryCategory, BenefitCategory } from '../../benefit/model/types'

export type FontSize = 'normal' | 'enlarged' | 'huge'

export type FontFamily = 'sans-serif' | 'serif'

export type ColorMode = 'default' | 'monochrome' | 'inverted' | 'blue_bg'

export type VerificationStatus = 'pending' | 'approved' | 'rejected'

export interface User {
  id?: number
  username: string
  email: string
  phone?: string
  beneficiary_category?: BeneficiaryCategory
  region?: string
  snils?: string
  is_verified?: boolean
  verification_date?: string
  created_at?: string
  last_login?: string
}

export interface UserPreferences {
  font_size?: FontSize
  font_family?: FontFamily
  letter_spacing?: number
  color_mode?: ColorMode
  show_images?: boolean
  speech_assistant_enabled?: boolean
  interest_categories?: BenefitCategory[]
  hidden_benefits?: number[]
}

export interface UserProfile extends User {
  preferences?: UserPreferences
}

export interface VerificationRequest {
  id?: number
  user: number
  status: VerificationStatus
  documents?: Record<string, string>
  notes?: string
  reviewed_at?: string
  reviewed_by?: number
}

export type InteractionType = 'view' | 'save' | 'hide' | 'export'

export interface UserBenefitInteraction {
  id?: number
  user: number
  benefit?: number | null
  offer?: number | null
  interaction_type: InteractionType
  created_at?: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  password2: string
  phone?: string
  beneficiary_category?: BeneficiaryCategory
  region?: string
  snils?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface UpdateProfileData {
  username?: string
  email?: string
  phone?: string
  beneficiary_category?: BeneficiaryCategory
  region?: string
  snils?: string
}

export interface UpdatePreferencesData {
  font_size?: FontSize
  font_family?: FontFamily
  letter_spacing?: number
  color_mode?: ColorMode
  show_images?: boolean
  speech_assistant_enabled?: boolean
  interest_categories?: BenefitCategory[]
}

export interface AuthTokens {
  refresh: string
  access: string
}

export interface AuthResponse {
  user?: User
  tokens?: AuthTokens
  refresh?: string
  access?: string
}

export interface OAuthGosuslugiRequest {
  email: string
  beneficiary_category?: BeneficiaryCategory
  region?: string
}

export interface ChangePasswordData {
  current_password: string
  new_password: string
}

export interface HideBenefitRequest {
  benefit_id: number
}

export interface UnhideBenefitRequest {
  benefit_id: number
}
