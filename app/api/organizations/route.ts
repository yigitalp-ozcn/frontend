import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error'
import { paginate, calculatePaginationMeta } from '@/lib/db-utils'
import { createOrganizationSchema, organizationQuerySchema } from '@/lib/validations/organization'
import { ApiSuccessResponse } from '@/types/api'
import { Organization } from '@/types/database'

// GET /api/organizations - List all organizations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate query params
    const params = organizationQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      plan: searchParams.get('plan'),
    })

    const { page, limit, search, plan } = params

    // Build where clause
    const where: any = {}

    if (plan) {
      where.plan = plan
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Execute query
    const [organizations, total] = await prisma.$transaction([
      prisma.organization.findMany({
        where,
        ...paginate(page, limit),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.organization.count({ where }),
    ])

    const response: ApiSuccessResponse<Organization[]> = {
      success: true,
      data: organizations,
      meta: calculatePaginationMeta(total, page, limit),
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/organizations - Create new organization
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validated = createOrganizationSchema.parse(body)

    // Create organization
    const organization = await prisma.organization.create({
      data: validated,
    })

    const response: ApiSuccessResponse<Organization> = {
      success: true,
      data: organization,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
