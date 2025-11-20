import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, notFoundError } from '@/lib/api-error'
import { updateCallLogSchema } from '@/lib/validations/call-log'
import { ApiSuccessResponse } from '@/types/api'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/call-logs/[id] - Get single call log
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    const callLog = await prisma.callLog.findUnique({
      where: { id },
      include: {
        agent: true,
        campaign: true,
        organization: true,
      },
    })

    if (!callLog) {
      throw notFoundError('Call log')
    }

    const response: ApiSuccessResponse<typeof callLog> = {
      success: true,
      data: callLog,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/call-logs/[id] - Update call log
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validated = updateCallLogSchema.parse(body)

    // Update call log
    const callLog = await prisma.callLog.update({
      where: { id },
      data: validated,
      include: {
        agent: true,
        campaign: true,
      },
    })

    const response: ApiSuccessResponse<typeof callLog> = {
      success: true,
      data: callLog,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}
