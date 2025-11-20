import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, notFoundError, badRequestError } from '@/lib/api-error'
import { stopCampaignSchema } from '@/lib/validations/campaign'
import { ApiSuccessResponse } from '@/types/api'

type RouteContext = {
  params: Promise<{ id: string }>
}

// POST /api/campaigns/[id]/stop - Stop campaign
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validated = stopCampaignSchema.parse(body)

    // Check if campaign exists
    const existing = await prisma.campaign.findUnique({
      where: { id },
    })

    if (!existing) {
      throw notFoundError('Campaign')
    }

    // Validate campaign can be stopped
    if (existing.status !== 'CONTINUING') {
      throw badRequestError('Campaign is not running')
    }

    // Update campaign status
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        status: 'STOPPED',
      },
      include: {
        agent: true,
        recipients: true,
      },
    })

    const response: ApiSuccessResponse<typeof campaign> = {
      success: true,
      data: campaign,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}
