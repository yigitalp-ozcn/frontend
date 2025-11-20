// Standard API Response Types

export type ApiSuccessResponse<T> = {
  success: true
  data: T
  meta?: PaginationMeta
}

export type ApiErrorResponse = {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// Pagination metadata
export type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

// Query parameters for list endpoints
export type PaginationParams = {
  page?: number
  limit?: number
}

export type SortParams = {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type DateRangeParams = {
  startDate?: string
  endDate?: string
}

export type SearchParams = {
  search?: string
}

// Common query params type
export type ListQueryParams = PaginationParams & SortParams & SearchParams

// Error codes
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  CONFLICT = 'CONFLICT',
}

// Helper type for extracting data from ApiResponse
export type ExtractData<T> = T extends ApiSuccessResponse<infer D> ? D : never
