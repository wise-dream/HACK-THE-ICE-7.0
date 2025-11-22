import type { User, UserPreferences, UserProfile } from './types'

export const mockUser: User = {
  id: 1,
  username: 'ivan_petrov',
  email: 'ivan.petrov@example.com',
  phone: '+7 (999) 123-45-67',
  beneficiary_category: 'pensioner',
  region: '14',
  snils: '123-456-789-01',
  is_verified: true,
  verification_date: '2024-11-15',
  created_at: '2024-10-01T10:00:00Z',
  last_login: '2025-01-15T14:30:00Z',
}

export const mockUserPreferences: UserPreferences = {
  font_size: 'normal',
  font_family: 'sans-serif',
  letter_spacing: 1,
  color_mode: 'default',
  show_images: true,
  speech_assistant_enabled: false,
  interest_categories: ['transport', 'medicines', 'utilities', 'compensations'],
  hidden_benefits: [],
}

export const mockUserProfile: UserProfile = {
  ...mockUser,
  preferences: mockUserPreferences,
}

export const mockUsers: User[] = [
  mockUser,
  {
    id: 2,
    username: 'maria_sidorova',
    email: 'maria.sidorova@example.com',
    phone: '+7 (999) 234-56-78',
    beneficiary_category: 'disability_1',
    region: '14',
    snils: '234-567-890-12',
    is_verified: true,
    verification_date: '2024-11-20',
    created_at: '2024-10-05T12:00:00Z',
    last_login: '2025-01-14T09:15:00Z',
  },
  {
    id: 3,
    username: 'alex_ivanov',
    email: 'alex.ivanov@example.com',
    phone: '+7 (999) 345-67-89',
    beneficiary_category: 'large_family',
    region: '14',
    snils: '345-678-901-23',
    is_verified: false,
    created_at: '2024-12-01T08:00:00Z',
    last_login: '2025-01-13T16:45:00Z',
  },
  {
    id: 4,
    username: 'elena_kuznetsova',
    email: 'elena.kuznetsova@example.com',
    phone: '+7 (999) 456-78-90',
    beneficiary_category: 'veteran',
    region: '77',
    snils: '456-789-012-34',
    is_verified: true,
    verification_date: '2024-11-10',
    created_at: '2024-09-15T14:00:00Z',
    last_login: '2025-01-15T11:20:00Z',
  },
  {
    id: 5,
    username: 'dmitry_sokolov',
    email: 'dmitry.sokolov@example.com',
    phone: '+7 (999) 567-89-01',
    beneficiary_category: 'low_income',
    region: '14',
    snils: '567-890-123-45',
    is_verified: false,
    created_at: '2024-11-20T10:30:00Z',
    last_login: '2025-01-12T13:10:00Z',
  },
]
