import type {
  BeneficiaryCategory,
  BenefitStatus,
  Category,
  Region,
} from '../../benefit/model/types'

export interface Partner {
  name: string
  logo?: string
  website?: string
  category?: string
}

export interface CommercialOffer {
  id?: number
  offer_id?: string
  title: string
  description: string
  discount_percentage?: number
  discount_description?: string
  partner_name?: string
  partner_logo?: string
  partner_website?: string
  partner_category?: string
  partner?: Partner
  target_groups: BeneficiaryCategory[]
  regions?: Region[]
  applies_to_all_regions?: boolean
  locations?: string[]
  valid_from: string
  valid_to?: string | null
  status: BenefitStatus
  how_to_use?: string
  promo_code?: string
  categories?: Category[]
  views_count?: number
  popularity_score?: number
}
