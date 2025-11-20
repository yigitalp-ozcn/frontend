import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error'
import { paginate, calculatePaginationMeta, parseIncludes } from '@/lib/db-utils'
import { createKnowledgeBaseSchema, knowledgeBaseQuerySchema } from '@/lib/validations/knowledge-base'
import { ApiSuccessResponse } from '@/types/api'

// GET /api/knowledge-bases - List all knowledge bases
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate query params
    const params = knowledgeBaseQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      status: searchParams.get('status'),
      search: searchParams.get('search'),
      include: searchParams.get('include'),
    })

    const { page, limit, status, search, include } = params

    // Build where clause
    const where: any = {}

    if (status) where.status = status

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Build include clause
    const includeFields = parseIncludes(include)
    const includeClause: any = {}

    if (includeFields.documents) {
      includeClause.documents = true
    }

    if (includeFields.agents) {
      includeClause.agents = {
        include: {
          agent: true,
        },
      }
    }

    // Execute query
    const [knowledgeBases, total] = await prisma.$transaction([
      prisma.knowledgeBase.findMany({
        where,
        include: Object.keys(includeClause).length > 0 ? includeClause : undefined,
        ...paginate(page, limit),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.knowledgeBase.count({ where }),
    ])

    const response: ApiSuccessResponse<typeof knowledgeBases> = {
      success: true,
      data: knowledgeBases,
      meta: calculatePaginationMeta(total, page, limit),
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/knowledge-bases - Create new knowledge base
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validated = createKnowledgeBaseSchema.parse(body)

    // Create knowledge base
    const knowledgeBase = await prisma.knowledgeBase.create({
      data: {
        ...validated,
        status: 'EMPTY',
      },
    })

    const response: ApiSuccessResponse<typeof knowledgeBase> = {
      success: true,
      data: knowledgeBase,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
