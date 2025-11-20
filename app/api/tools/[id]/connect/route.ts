import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, notFoundError } from '@/lib/api-error'
import { connectToolSchema } from '@/lib/validations/tool'
import { ApiSuccessResponse } from '@/types/api'

type RouteContext = {
  params: Promise<{ id: string }>
}

// PATCH /api/tools/[id]/connect - Connect tool
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validated = connectToolSchema.parse(body)

    // Check if tool exists
    const existing = await prisma.tool.findUnique({
      where: { id },
    })

    if (!existing) {
      throw notFoundError('Tool')
    }

    // Update tool with connection configuration
    const tool = await prisma.tool.update({
      where: { id },
      data: {
        isConnected: true,
        configuration: validated.configuration,
      },
    })

    const response: ApiSuccessResponse<typeof tool> = {
      success: true,
      data: tool,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}
