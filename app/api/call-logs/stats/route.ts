import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error'
import { dateRange } from '@/lib/db-utils'
import { callLogStatsSchema } from '@/lib/validations/call-log'
import { ApiSuccessResponse } from '@/types/api'
import { CallStatus, CallType } from '@prisma/client'

// GET /api/call-logs/stats - Get call statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate query params
    const params = callLogStatsSchema.parse({
      organizationId: searchParams.get('organizationId'),
      agentId: searchParams.get('agentId'),
      campaignId: searchParams.get('campaignId'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
    })

    const { organizationId, agentId, campaignId, startDate, endDate } = params

    // Build where clause
    const where: any = {
      organizationId,
    }

    if (agentId) where.agentId = agentId
    if (campaignId) where.campaignId = campaignId

    if (startDate || endDate) {
      where.timestamp = dateRange(startDate, endDate)
    }

    // Get aggregated statistics
    const [totalCalls, statusCounts, typeCounts, avgDuration] = await prisma.$transaction([
      // Total calls
      prisma.callLog.count({ where }),

      // Count by status
      prisma.callLog.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),

      // Count by type
      prisma.callLog.groupBy({
        by: ['callType'],
        where,
        _count: true,
      }),

      // Average duration
      prisma.callLog.aggregate({
        where,
        _avg: {
          duration: true,
        },
      }),
    ])

    // Format statistics
    const stats = {
      total: totalCalls,
      byStatus: Object.fromEntries(
        statusCounts.map((s) => [s.status, s._count])
      ),
      byType: Object.fromEntries(
        typeCounts.map((t) => [t.callType, t._count])
      ),
      avgDuration: Math.round(avgDuration._avg.duration || 0),
      successRate: totalCalls > 0
        ? Math.round(((statusCounts.find(s => s.status === CallStatus.COMPLETED)?._count || 0) / totalCalls) * 100)
        : 0,
    }

    const response: ApiSuccessResponse<typeof stats> = {
      success: true,
      data: stats,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}
