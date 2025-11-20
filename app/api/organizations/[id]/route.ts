import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, notFoundError } from '@/lib/api-error'
import { updateOrganizationSchema } from '@/lib/validations/organization'
import { ApiSuccessResponse } from '@/types/api'
import { Organization } from '@/types/database'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/organizations/[id] - Get single organization
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                status: true,
              },
            },
          },
        },
        _count: {
          select: {
            agents: true,
            campaigns: true,
            callLogs: true,
            knowledgeBases: true,
          },
        },
      },
    })

    if (!organization) {
      throw notFoundError('Organization')
    }

    const response: ApiSuccessResponse<typeof organization> = {
      success: true,
      data: organization,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/organizations/[id] - Update organization
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validated = updateOrganizationSchema.parse(body)

    // Check if organization exists
    const existing = await prisma.organization.findUnique({
      where: { id },
    })

    if (!existing) {
      throw notFoundError('Organization')
    }

    // Update organization
    const organization = await prisma.organization.update({
      where: { id },
      data: validated,
    })

    const response: ApiSuccessResponse<Organization> = {
      success: true,
      data: organization,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/organizations/[id] - Delete organization
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    // Check if organization exists
    const existing = await prisma.organization.findUnique({
      where: { id },
    })

    if (!existing) {
      throw notFoundError('Organization')
    }

    // Delete organization (cascade will handle all related records)
    await prisma.organization.delete({
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
