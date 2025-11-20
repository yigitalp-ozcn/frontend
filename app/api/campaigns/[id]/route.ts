import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, notFoundError } from '@/lib/api-error'
import { parseIncludes } from '@/lib/db-utils'
import { updateCampaignSchema } from '@/lib/validations/campaign'
import { ApiSuccessResponse } from '@/types/api'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/campaigns/[id] - Get single campaign
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
    const includeClause: any = {
      agent: true,
      recipients: true,
    }

    if (includeFields.callLogs) {
      includeClause.callLogs = {
        take: 50,
        orderBy: {
          timestamp: 'desc',
        },
      }
    }

    if (includeFields.conversationPath) {
      includeClause.conversationPath = true
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: includeClause,
    })

    if (!campaign) {
      throw notFoundError('Campaign')
    }

    const response: ApiSuccessResponse<typeof campaign> = {
      success: true,
      data: campaign,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/campaigns/[id] - Update campaign
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validated = updateCampaignSchema.parse(body)

    // Check if campaign exists
    const existing = await prisma.campaign.findUnique({
      where: { id },
    })

    if (!existing) {
      throw notFoundError('Campaign')
    }

    // Update campaign
    const campaign = await prisma.campaign.update({
      where: { id },
      data: validated,
      include: {
        agent: true,
        recipients: true,
        conversationPath: true,
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

// DELETE /api/campaigns/[id] - Delete campaign
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    // Check if campaign exists
    const existing = await prisma.campaign.findUnique({
      where: { id },
    })

    if (!existing) {
      throw notFoundError('Campaign')
    }

    // Delete campaign (cascade will handle recipients)
    await prisma.campaign.delete({
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
