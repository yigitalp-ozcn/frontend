import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error'
import { paginate, calculatePaginationMeta, parseIncludes, dateRange } from '@/lib/db-utils'
import { createCallLogSchema, callLogQuerySchema } from '@/lib/validations/call-log'
import { ApiSuccessResponse } from '@/types/api'

// GET /api/call-logs - List all call logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate query params
    const params = callLogQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      callType: searchParams.get('callType'),
      status: searchParams.get('status'),
      agentId: searchParams.get('agentId'),
      campaignId: searchParams.get('campaignId'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      search: searchParams.get('search'),
      include: searchParams.get('include'),
    })

    const { page, limit, callType, status, agentId, campaignId, startDate, endDate, search, include } = params

    // Build where clause
    const where: any = {}

    if (callType) where.callType = callType
    if (status) where.status = status
    if (agentId) where.agentId = agentId
    if (campaignId) where.campaignId = campaignId

    // Date range filter
    if (startDate || endDate) {
      where.timestamp = dateRange(startDate, endDate)
    }

    // Search filter
    if (search) {
      where.OR = [
        { customer: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search } },
        { callId: { contains: search } },
      ]
    }

    // Build include clause
    const includeFields = parseIncludes(include)
    const includeClause: any = {}

    if (includeFields.agent) includeClause.agent = true
    if (includeFields.campaign) includeClause.campaign = true
    if (includeFields.organization) includeClause.organization = true

    // Execute query
    const [callLogs, total] = await prisma.$transaction([
      prisma.callLog.findMany({
        where,
        include: Object.keys(includeClause).length > 0 ? includeClause : undefined,
        ...paginate(page, limit),
        orderBy: {
          timestamp: 'desc',
        },
      }),
      prisma.callLog.count({ where }),
    ])

    const response: ApiSuccessResponse<typeof callLogs> = {
      success: true,
      data: callLogs,
      meta: calculatePaginationMeta(total, page, limit),
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/call-logs - Create new call log
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validated = createCallLogSchema.parse(body)

    // Create call log
    const callLog = await prisma.callLog.create({
      data: {
        ...validated,
        timestamp: new Date(),
      },
      include: {
        agent: true,
        campaign: true,
      },
    })

    const response: ApiSuccessResponse<typeof callLog> = {
      success: true,
      data: callLog,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
