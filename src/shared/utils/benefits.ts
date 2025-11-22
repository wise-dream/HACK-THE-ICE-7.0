import type { BeneficiaryCategory, Benefit, BenefitStatus } from '~/entities/benefit'
import type { User } from '~/entities/user'
import { isExpired, isExpiringSoon } from './date'

export const filterBenefitsByUser = (benefits: Benefit[], user: User): Benefit[] => {
  if (!user.beneficiary_category) return benefits

  return benefits.filter((benefit) => {
    if (benefit.target_groups.length === 0) return true
    if (benefit.target_groups.includes(user.beneficiary_category as BeneficiaryCategory)) {
      if (user.region && benefit.regions && benefit.regions.length > 0) {
        if (benefit.applies_to_all_regions) return true
        return benefit.regions.some(
          (region) => region.code === user.region || region.name === user.region
        )
      }
      if (benefit.applies_to_all_regions) return true
      return true
    }
    return false
  })
}

export type SortBy = 'relevance' | 'date' | 'popularity' | 'expiring_soon'

export const sortBenefits = (benefits: Benefit[], sortBy: SortBy = 'relevance'): Benefit[] => {
  const sorted = [...benefits]

  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.valid_from).getTime()
        const dateB = new Date(b.valid_from).getTime()
        return dateB - dateA
      })

    case 'popularity':
      return sorted.sort((a, b) => {
        const scoreA = a.popularity_score || 0
        const scoreB = b.popularity_score || 0
        return scoreB - scoreA
      })

    case 'expiring_soon':
      return sorted.sort((a, b) => {
        if (!a.valid_to && !b.valid_to) return 0
        if (!a.valid_to) return 1
        if (!b.valid_to) return -1
        const dateA = new Date(a.valid_to).getTime()
        const dateB = new Date(b.valid_to).getTime()
        return dateA - dateB
      })

    case 'relevance':
    default:
      return sorted.sort((a, b) => {
        const scoreA = (a.popularity_score || 0) + (a.views_count || 0) * 0.1
        const scoreB = (b.popularity_score || 0) + (b.views_count || 0) * 0.1
        return scoreB - scoreA
      })
  }
}

export const getBenefitStatus = (
  validFrom: string,
  validTo: string | null | undefined
): BenefitStatus => {
  if (validTo && isExpired(validTo)) {
    return 'expired'
  }
  if (validTo && isExpiringSoon(validTo, 30)) {
    return 'expiring_soon'
  }
  return 'active'
}

export const getActiveBenefits = (benefits: Benefit[]): Benefit[] => {
  return benefits.filter((benefit) => {
    if (benefit.valid_to && isExpired(benefit.valid_to)) return false
    return benefit.status === 'active' || benefit.status === 'expiring_soon'
  })
}

export const getExpiringBenefits = (benefits: Benefit[], days: number = 30): Benefit[] => {
  return benefits.filter((benefit) => {
    if (!benefit.valid_to) return false
    return isExpiringSoon(benefit.valid_to, days)
  })
}

export const getExpiredBenefits = (benefits: Benefit[]): Benefit[] => {
  return benefits.filter((benefit) => {
    if (!benefit.valid_to) return false
    return isExpired(benefit.valid_to)
  })
}
