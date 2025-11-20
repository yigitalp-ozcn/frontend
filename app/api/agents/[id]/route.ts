import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, notFoundError } from '@/lib/api-error'
import { parseIncludes } from '@/lib/db-utils'
import { updateAgentSchema } from '@/lib/validations/agent'
import { ApiSuccessResponse } from '@/types/api'
import { AgentWithRelations } from '@/types/database'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/agents/[id] - Get single agent
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const { searchParams } = new URL(request.url)
    const include = searchParams.get('include')

    // Build include clause
    const includeFields = parseIncludes(include || '')
    const includeClause: any = {}

    if (includeFields.voice) {
      includeClause.voice = true
    }

    if (includeFields.phoneNumber) {
      includeClause.phoneNumber = true
    }

    if (includeFields.organization) {
      includeClause.organization = true
    }

    if (includeFields.knowledgeBases) {
      includeClause.knowledgeBases = {
        include: {
          knowledgeBase: {
            include: {
              documents: true,
            },
          },
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

    if (includeFields.campaigns) {
      includeClause.campaigns = {
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      }
    }

    if (includeFields.callLogs) {
      includeClause.callLogs = {
        take: 10,
        orderBy: {
          timestamp: 'desc',
        },
      }
    }

    // Fetch agent
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: Object.keys(includeClause).length > 0 ? includeClause : undefined,
    })

    if (!agent) {
      throw notFoundError('Agent')
    }

    const response: ApiSuccessResponse<typeof agent> = {
      success: true,
      data: agent,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/agents/[id] - Update agent
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validated = updateAgentSchema.parse(body)

    // Check if agent exists
    const existingAgent = await prisma.agent.findUnique({
      where: { id },
    })

    if (!existingAgent) {
      throw notFoundError('Agent')
    }

    // Prepare update data with proper handling of nullable relation fields
    const updateData: any = {}

    // Handle regular fields
    if (validated.name !== undefined) updateData.name = validated.name
    if (validated.description !== undefined) updateData.description = validated.description
    if (validated.type !== undefined) updateData.type = validated.type
    if (validated.status !== undefined) updateData.status = validated.status
    if (validated.callerType !== undefined) updateData.callerType = validated.callerType
    if (validated.configuration !== undefined) updateData.configuration = validated.configuration

    // Handle nullable relation fields with connect/disconnect
    if (validated.phoneNumberId !== undefined) {
      updateData.phoneNumber = validated.phoneNumberId
        ? { connect: { id: validated.phoneNumberId } }
        : { disconnect: true }
    }

    if (validated.voiceId !== undefined) {
      updateData.voice = validated.voiceId
        ? { connect: { id: validated.voiceId } }
        : { disconnect: true }
    }

    // Update agent
    const agent = await prisma.agent.update({
      where: { id },
      data: updateData,
      include: {
        organization: true,
        phoneNumber: true,
        voice: true,
        knowledgeBases: {
          include: {
            knowledgeBase: true,
          },
        },
        tools: {
          include: {
            tool: true,
          },
        },
      },
    })

    const response: ApiSuccessResponse<typeof agent> = {
      success: true,
      data: agent,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/agents/[id] - Delete agent
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    // Check if agent exists
    const existingAgent = await prisma.agent.findUnique({
      where: { id },
    })

    if (!existingAgent) {
      throw notFoundError('Agent')
    }

    // Delete agent (cascade will handle related records)
    await prisma.agent.delete({
      where: { id },
    })

    const response: ApiSuccessResponse<{ id: string }> = {
      success: true,
      data: { id },
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}
