import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { ApiErrorCode, ApiErrorResponse } from '@/types/api'

// Custom API Error class
export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Error response helper
export function createErrorResponse(
  code: ApiErrorCode,
  message: string,
  statusCode: number = 500,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status: statusCode }
  )
}

// Main error handler
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error('[API_ERROR]', error)

  // Zod validation errors
  if (error instanceof ZodError) {
    const zodErrors = (error as any).errors || []
    return createErrorResponse(
      ApiErrorCode.VALIDATION_ERROR,
      'Validation failed',
      400,
      zodErrors.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message,
      }))
    )
  }

  // Custom API errors
  if (error instanceof ApiError) {
    return createErrorResponse(
      error.code,
      error.message,
      error.statusCode,
      error.details
    )
  }

  // Prisma errors (using duck typing since Prisma client isn't fully generated)
  if (error && typeof error === 'object' && 'code' in error && typeof (error as any).code === 'string' && (error as any).code.startsWith('P')) {
    const prismaError = error as any
    switch (prismaError.code) {
      case 'P2002':
        // Unique constraint violation
        return createErrorResponse(
          ApiErrorCode.CONFLICT,
          `A record with this ${prismaError.meta?.target?.[0] || 'field'} already exists`,
          409,
          { field: prismaError.meta?.target }
        )

      case 'P2025':
        // Record not found
        return createErrorResponse(
          ApiErrorCode.NOT_FOUND,
          'Record not found',
          404
        )

      case 'P2003':
        // Foreign key constraint violation
        return createErrorResponse(
          ApiErrorCode.BAD_REQUEST,
          'Invalid reference to related record',
          400,
          { field: prismaError.meta?.field_name }
        )

      default:
        return createErrorResponse(
          ApiErrorCode.INTERNAL_ERROR,
          'Database operation failed',
          500
        )
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return createErrorResponse(
      ApiErrorCode.VALIDATION_ERROR,
      'Invalid data provided',
      400
    )
  }

  // Generic errors
  if (error instanceof Error) {
    return createErrorResponse(
      ApiErrorCode.INTERNAL_ERROR,
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Internal server error',
      500
    )
  }

  // Unknown errors
  return createErrorResponse(
    ApiErrorCode.INTERNAL_ERROR,
    'An unexpected error occurred',
    500
  )
}

// Specific error creators
export const notFoundError = (resource: string = 'Resource') =>
  new ApiError(ApiErrorCode.NOT_FOUND, `${resource} not found`, 404)

export const validationError = (message: string, details?: unknown) =>
  new ApiError(ApiErrorCode.VALIDATION_ERROR, message, 400, details)

export const unauthorizedError = (message: string = 'Unauthorized') =>
  new ApiError(ApiErrorCode.UNAUTHORIZED, message, 401)

export const forbiddenError = (message: string = 'Forbidden') =>
  new ApiError(ApiErrorCode.FORBIDDEN, message, 403)

export const conflictError = (message: string, details?: unknown) =>
  new ApiError(ApiErrorCode.CONFLICT, message, 409, details)

export const badRequestError = (message: string, details?: unknown) =>
  new ApiError(ApiErrorCode.BAD_REQUEST, message, 400, details)
