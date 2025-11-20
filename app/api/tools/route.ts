import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error'
import { paginate, calculatePaginationMeta } from '@/lib/db-utils'
import { createToolSchema, toolQuerySchema } from '@/lib/validations/tool'
import { ApiSuccessResponse } from '@/types/api'

// GET /api/tools - List all tools
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate query params
    const params = toolQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      category: searchParams.get('category'),
      isConnected: searchParams.get('isConnected'),
      search: searchParams.get('search'),
    })

    const { page, limit, category, isConnected, search } = params

    // Build where clause
    const where: any = {}

    if (category) where.category = category
    if (isConnected !== undefined) where.isConnected = isConnected

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Execute query
    const [tools, total] = await prisma.$transaction([
      prisma.tool.findMany({
        where,
        ...paginate(page, limit),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.tool.count({ where }),
    ])

    const response: ApiSuccessResponse<typeof tools> = {
      success: true,
      data: tools,
      meta: calculatePaginationMeta(total, page, limit),
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/tools - Create new tool
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validated = createToolSchema.parse(body)

    // Create tool
    const tool = await prisma.tool.create({
      data: {
        ...validated,
        isConnected: false,
      },
    })

    const response: ApiSuccessResponse<typeof tool> = {
      success: true,
      data: tool,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
