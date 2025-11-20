import { Prisma } from '@prisma/client'

// ==================== PAGINATION ====================

export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

export type PaginationOptions = {
  page?: number
  limit?: number
}

export function paginate(page: number = 1, limit: number = DEFAULT_PAGE_SIZE) {
  // Ensure limits
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(Math.max(1, limit), MAX_PAGE_SIZE)

  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  }
}

export function calculatePaginationMeta(
  total: number,
  page: number,
  limit: number
) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

// ==================== DATE RANGE ====================

export type DateRangeFilter = {
  gte?: Date
  lte?: Date
}

export function dateRange(start?: Date | string, end?: Date | string): DateRangeFilter {
  const filter: DateRangeFilter = {}

  if (start) {
    filter.gte = typeof start === 'string' ? new Date(start) : start
  }

  if (end) {
    filter.lte = typeof end === 'string' ? new Date(end) : end
  }

  return filter
}

// ==================== SEARCH ====================

export function searchFilter(
  query: string,
  fields: string[]
): Prisma.StringFilter | undefined {
  if (!query || query.trim() === '') return undefined

  // Case-insensitive search
  return {
    contains: query.trim(),
    mode: 'insensitive',
  }
}

// Multi-field search using OR
export function multiFieldSearch<T>(
  query: string,
  fields: Array<keyof T>
): Array<Partial<Record<keyof T, Prisma.StringFilter>>> {
  if (!query || query.trim() === '') return []

  return fields.map((field) => ({
    [field]: {
      contains: query.trim(),
      mode: 'insensitive',
    },
  })) as Array<Partial<Record<keyof T, Prisma.StringFilter>>>
}

// ==================== SORTING ====================

export type SortOrder = 'asc' | 'desc'

export function sortBy<T>(
  field: keyof T,
  order: SortOrder = 'desc'
): Record<keyof T, SortOrder> {
  return {
    [field]: order,
  } as Record<keyof T, SortOrder>
}

// ==================== MULTI-TENANCY ====================

export function withOrganization(organizationId: string) {
  return {
    where: {
      organizationId,
    },
  }
}

// Organization filter for queries
export function organizationFilter(organizationId: string) {
  return {
    organizationId,
  }
}

// ==================== SOFT DELETE ====================

export function excludeDeleted() {
  return {
    deletedAt: null,
  }
}

export function onlyDeleted() {
  return {
    deletedAt: {
      not: null,
    },
  }
}

// ==================== INCLUDE HELPERS ====================

// Helper to build dynamic includes based on query params
export function parseIncludes(includeParam?: string): Record<string, boolean> {
  if (!includeParam) return {}

  return includeParam.split(',').reduce((acc, key) => {
    acc[key.trim()] = true
    return acc
  }, {} as Record<string, boolean>)
}

// ==================== QUERY PARAM PARSERS ====================

export function parseNumber(value: string | null, defaultValue: number): number {
  if (!value) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

export function parseBoolean(value: string | null, defaultValue: boolean): boolean {
  if (!value) return defaultValue
  return value.toLowerCase() === 'true'
}

export function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return isNaN(date.getTime()) ? undefined : date
}

// ==================== TRANSACTION HELPERS ====================

// Helper for count + find in transaction
export async function findManyWithCount<T>(
  prisma: any,
  model: string,
  findManyArgs: any
): Promise<{ data: T[]; total: number }> {
  const [data, total] = await prisma.$transaction([
    prisma[model].findMany(findManyArgs),
    prisma[model].count({ where: findManyArgs.where }),
  ])

  return { data, total }
}

// ==================== VALIDATION ====================

// Validate CUID format
export function isValidCuid(id: string): boolean {
  return /^c[a-z0-9]{24}$/.test(id)
}

// Validate UUID format
export function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}
