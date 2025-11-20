import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, notFoundError, forbiddenError } from '@/lib/api-error'
import { updateVoiceSchema } from '@/lib/validations/voice'
import { ApiSuccessResponse } from '@/types/api'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/voices/[id] - Get single voice
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    const voice = await prisma.voice.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    })

    if (!voice) {
      throw notFoundError('Voice')
    }

    const response: ApiSuccessResponse<typeof voice> = {
      success: true,
      data: voice,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/voices/[id] - Update voice
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validated = updateVoiceSchema.parse(body)

    // Check if voice exists and is custom
    const existing = await prisma.voice.findUnique({
      where: { id },
    })

    if (!existing) {
      throw notFoundError('Voice')
    }

    if (!existing.isCustom) {
      throw forbiddenError('Cannot modify system voices')
    }

    // Update voice
    const voice = await prisma.voice.update({
      where: { id },
      data: validated,
    })

    const response: ApiSuccessResponse<typeof voice> = {
      success: true,
      data: voice,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/voices/[id] - Delete custom voice
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    // Check if voice exists and is custom
    const existing = await prisma.voice.findUnique({
      where: { id },
    })

    if (!existing) {
      throw notFoundError('Voice')
    }

    if (!existing.isCustom) {
      throw forbiddenError('Cannot delete system voices')
    }

    // Delete voice
    await prisma.voice.delete({
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
