import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, notFoundError } from '@/lib/api-error'
import { toggleAgentStatusSchema } from '@/lib/validations/agent'
import { ApiSuccessResponse } from '@/types/api'
import { Agent } from '@/types/database'

type RouteContext = {
  params: Promise<{ id: string }>
}

// PATCH /api/agents/[id]/status - Toggle agent status
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validated = toggleAgentStatusSchema.parse(body)

    // Check if agent exists
    const existingAgent = await prisma.agent.findUnique({
      where: { id },
    })

    if (!existingAgent) {
      throw notFoundError('Agent')
    }

    // Update agent status
    const agent = await prisma.agent.update({
      where: { id },
      data: {
        status: validated.status,
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

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}
