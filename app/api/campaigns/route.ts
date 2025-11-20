import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error'
import { paginate, calculatePaginationMeta, parseIncludes } from '@/lib/db-utils'
import { createCampaignSchema, campaignQuerySchema } from '@/lib/validations/campaign'
import { ApiSuccessResponse } from '@/types/api'
import { Campaign } from '@/types/database'

// GET /api/campaigns - List all campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate query params
    const params = campaignQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      status: searchParams.get('status'),
      agentId: searchParams.get('agentId'),
      search: searchParams.get('search'),
      include: searchParams.get('include'),
    })

    const { page, limit, status, agentId, search, include } = params

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (agentId) {
      where.agentId = agentId
    }

    if (search) {
      where.batchName = {
        contains: search,
        mode: 'insensitive',
      }
    }

    // Build include clause
    const includeFields = parseIncludes(include)
    const includeClause: any = {}

    if (includeFields.agent) {
      includeClause.agent = true
    }

    if (includeFields.recipients) {
      includeClause.recipients = true
    }

    if (includeFields.callLogs) {
      includeClause.callLogs = {
        take: 10,
        orderBy: {
          timestamp: 'desc',
        },
      }
    }

    if (includeFields.conversationPath) {
      includeClause.conversationPath = true
    }

    // Execute query
    const [campaigns, total] = await prisma.$transaction([
      prisma.campaign.findMany({
        where,
        include: Object.keys(includeClause).length > 0 ? includeClause : undefined,
        ...paginate(page, limit),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.campaign.count({ where }),
    ])

    const response: ApiSuccessResponse<typeof campaigns> = {
      success: true,
      data: campaigns,
      meta: calculatePaginationMeta(total, page, limit),
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/campaigns - Create new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validated = createCampaignSchema.parse(body)

    // Extract recipients if provided
    const { recipients, ...campaignData } = validated

    // Create campaign with recipients in transaction
    const campaign = await prisma.$transaction(async (tx: any) => {
      // Create campaign
      const newCampaign = await tx.campaign.create({
        data: {
          ...campaignData,
          status: 'DRAFT',
          progress: 0,
          completedCalls: 0,
          totalCalls: recipients?.length || 0,
        },
      })

      // Create recipients if provided
      if (recipients && recipients.length > 0) {
        await tx.campaignRecipient.createMany({
          data: recipients.map((recipient) => ({
            ...recipient,
            campaignId: newCampaign.id,
          })),
        })
      }

      // Return campaign with recipients
      return tx.campaign.findUnique({
        where: { id: newCampaign.id },
        include: {
          agent: true,
          recipients: true,
          conversationPath: true,
        },
      })
    })

    const response: ApiSuccessResponse<typeof campaign> = {
      success: true,
      data: campaign,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
