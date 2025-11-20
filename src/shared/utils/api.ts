export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)))
      } else if (typeof value === 'boolean') {
        searchParams.append(key, value ? 'true' : 'false')
      } else {
        searchParams.append(key, String(value))
      }
    }
  })
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

export interface PaginationMeta {
  count: number
  next: string | null
  previous: string | null
  currentPage?: number
  totalPages?: number
}

export const parsePaginationResponse = <T>(response: {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}): { data: T[]; pagination: PaginationMeta } => {
  const pagination: PaginationMeta = {
    count: response.count,
    next: response.next,
    previous: response.previous,
  }

  if (response.next || response.previous) {
    const url = response.next || response.previous
    if (url) {
      const pageMatch = url.match(/[?&]page=(\d+)/)
      if (pageMatch) {
        pagination.currentPage = parseInt(pageMatch[1], 10)
      }
    }
    if (pagination.count && pagination.currentPage) {
      pagination.totalPages = Math.ceil(pagination.count / 20)
    }
  }

  return {
    data: response.results,
    pagination,
  }
}

export const extractPageFromUrl = (url: string | null): number | null => {
  if (!url) return null
  const match = url.match(/[?&]page=(\d+)/)
  return match ? parseInt(match[1], 10) : null
}

export const buildPaginationParams = (page: number, pageSize: number = 20): Record<string, any> => {
  return {
    page,
    page_size: pageSize,
  }
}

