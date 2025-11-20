export type BenefitType = 'federal' | 'regional' | 'municipal'

export type BeneficiaryCategory =
  | 'pensioner'
  | 'disability_1'
  | 'disability_2'
  | 'disability_3'
  | 'large_family'
  | 'veteran'
  | 'low_income'
  | 'svo_participant'
  | 'svo_family'
  | 'other'

export type BenefitCategory =
  | 'transport'
  | 'medicines'
  | 'utilities'
  | 'compensations'
  | 'shopping'
  | 'social'
  | 'education'
  | 'communication'

export type BenefitStatus =
  | 'active'
  | 'expiring_soon'
  | 'expired'
  | 'requires_verification'

export interface Region {
  id?: number
  code: string
  name: string
}

export interface Category {
  id?: number
  name: string
  slug: string
  description?: string
  icon?: string
}

export interface Benefit {
  id?: number
  benefit_id?: string
  title: string
  description: string
  benefit_type: BenefitType
  target_groups: BeneficiaryCategory[]
  regions?: Region[]
  applies_to_all_regions?: boolean
  valid_from: string
  valid_to?: string | null
  status: BenefitStatus
  requirements?: string
  how_to_get?: string
  documents_needed?: string[]
  source_url?: string
  last_verified?: string
  categories?: Category[]
  views_count?: number
  popularity_score?: number
}

export interface SearchResult {
  id: number
  title: string
  description: string
  type: 'benefit' | 'commercial'
  benefit_type?: BenefitType
  discount?: string
  similarity?: number
}

export interface SearchQueryFilters {
  type?: BenefitType
  status?: BenefitStatus
  region?: string
  category?: string
  beneficiary_category?: BeneficiaryCategory
}

export interface ParsedSearchQuery {
  intent: string
  keywords: string[]
  filters: SearchQueryFilters
}

export interface SearchResponse {
  query: ParsedSearchQuery
  benefits: SearchResult[]
  offers: SearchResult[]
  total_benefits: number
  total_offers: number
}

export interface SearchDetailsRequest {
  items: Array<{
    type: 'benefit' | 'commercial'
    id: number
  }>
}

export interface DashboardResponse {
  active_count: number
  expiring_count: number
  active_benefits: Benefit[]
  expiring_benefits: Benefit[]
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
