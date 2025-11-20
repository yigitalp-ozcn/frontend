import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error'
import { paginate, calculatePaginationMeta, parseIncludes, multiFieldSearch } from '@/lib/db-utils'
import { createAgentSchema, agentQuerySchema } from '@/lib/validations/agent'
import { ApiSuccessResponse } from '@/types/api'
import { Agent, AgentWithRelations } from '@/types/database'

// GET /api/agents - List all agents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate query params
    const params = agentQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      status: searchParams.get('status'),
      callerType: searchParams.get('callerType'),
      search: searchParams.get('search'),
      include: searchParams.get('include'),
    })

    const { page, limit, status, callerType, search, include } = params

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (callerType) {
      where.callerType = callerType
    }

    // Multi-field search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Build include clause
    const includeFields = parseIncludes(include)
    const includeClause: any = {}

    if (includeFields.voice) {
      includeClause.voice = true
    }

    if (includeFields.phoneNumber) {
      includeClause.phoneNumber = true
    }

    if (includeFields.knowledgeBases) {
      includeClause.knowledgeBases = {
        include: {
          knowledgeBase: true,
        },
      }
    }

    if (includeFields.tools) {
      includeClause.tools = {
        include: {
          tool: true,
        },
      }
    }

    if (includeFields.conversationPaths) {
      includeClause.conversationPaths = {
        include: {
          conversationPath: true,
        },
      }
    }

    // Execute query with pagination
    const [agents, total] = await prisma.$transaction([
      prisma.agent.findMany({
        where,
        include: Object.keys(includeClause).length > 0 ? includeClause : undefined,
        ...paginate(page, limit),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.agent.count({ where }),
    ])

    // Build response
    const response: ApiSuccessResponse<Agent[] | AgentWithRelations[]> = {
      success: true,
      data: agents,
      meta: calculatePaginationMeta(total, page, limit),
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/agents - Create new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validated = createAgentSchema.parse(body)

    // Create agent
    const agent = await prisma.agent.create({
      data: {
        ...validated,
        status: 'INACTIVE', // Default status
        totalCalls: 0,
        successRate: 0,
      },
      include: {
        organization: true,
        phoneNumber: true,
        voice: true,
      },
    })

    const response: ApiSuccessResponse<typeof agent> = {
      success: true,
      data: agent,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
