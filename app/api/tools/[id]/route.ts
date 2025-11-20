import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, notFoundError } from '@/lib/api-error'
import { updateToolSchema } from '@/lib/validations/tool'
import { ApiSuccessResponse } from '@/types/api'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/tools/[id] - Get single tool
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    const tool = await prisma.tool.findUnique({
      where: { id },
      include: {
        agents: {
          include: {
            agent: true,
          },
        },
      },
    })

    if (!tool) {
      throw notFoundError('Tool')
    }

    const response: ApiSuccessResponse<typeof tool> = {
      success: true,
      data: tool,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/tools/[id] - Update tool
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validated = updateToolSchema.parse(body)

    // Update tool
    const tool = await prisma.tool.update({
      where: { id },
      data: validated,
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

// DELETE /api/tools/[id] - Delete tool
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    // Delete tool
    await prisma.tool.delete({
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
