import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error'
import { paginate, calculatePaginationMeta } from '@/lib/db-utils'
import { createVoiceSchema, voiceQuerySchema } from '@/lib/validations/voice'
import { ApiSuccessResponse } from '@/types/api'

// GET /api/voices - List all voices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate query params
    const params = voiceQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      gender: searchParams.get('gender'),
      isCustom: searchParams.get('isCustom'),
      status: searchParams.get('status'),
      search: searchParams.get('search'),
      tags: searchParams.get('tags'),
    })

    const { page, limit, gender, isCustom, status, search, tags } = params

    // Build where clause
    const where: any = {}

    if (gender) where.gender = gender
    if (status) where.status = status
    if (isCustom !== undefined) where.isCustom = isCustom

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Tag filter
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim())
      where.tags = {
        hasSome: tagArray,
      }
    }

    // Execute query
    const [voices, total] = await prisma.$transaction([
      prisma.voice.findMany({
        where,
        ...paginate(page, limit),
        orderBy: [
          { isCustom: 'asc' }, // System voices first
          { name: 'asc' },
        ],
      }),
      prisma.voice.count({ where }),
    ])

    const response: ApiSuccessResponse<typeof voices> = {
      success: true,
      data: voices,
      meta: calculatePaginationMeta(total, page, limit),
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/voices - Create custom voice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validated = createVoiceSchema.parse(body)

    // Create voice
    const voice = await prisma.voice.create({
      data: {
        ...validated,
        status: 'PROCESSING',
      },
    })

    const response: ApiSuccessResponse<typeof voice> = {
      success: true,
      data: voice,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
