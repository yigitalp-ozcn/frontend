import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, notFoundError } from '@/lib/api-error'
import { updateKnowledgeBaseSchema } from '@/lib/validations/knowledge-base'
import { ApiSuccessResponse } from '@/types/api'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/knowledge-bases/[id] - Get single knowledge base
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    const knowledgeBase = await prisma.knowledgeBase.findUnique({
      where: { id },
      include: {
        documents: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        agents: {
          include: {
            agent: true,
          },
        },
      },
    })

    if (!knowledgeBase) {
      throw notFoundError('Knowledge base')
    }

    const response: ApiSuccessResponse<typeof knowledgeBase> = {
      success: true,
      data: knowledgeBase,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/knowledge-bases/[id] - Update knowledge base
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validated = updateKnowledgeBaseSchema.parse(body)

    // Update knowledge base
    const knowledgeBase = await prisma.knowledgeBase.update({
      where: { id },
      data: validated,
      include: {
        documents: true,
      },
    })

    const response: ApiSuccessResponse<typeof knowledgeBase> = {
      success: true,
      data: knowledgeBase,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/knowledge-bases/[id] - Delete knowledge base
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    // Delete knowledge base
    await prisma.knowledgeBase.delete({
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
