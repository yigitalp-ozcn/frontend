import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, notFoundError } from '@/lib/api-error'
import { addDocumentSchema } from '@/lib/validations/knowledge-base'
import { ApiSuccessResponse } from '@/types/api'
import { DocumentType } from '@prisma/client'

type RouteContext = {
  params: Promise<{ id: string }>
}

// POST /api/knowledge-bases/[id]/documents - Add document to knowledge base
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validated = addDocumentSchema.parse(body)

    // Check if knowledge base exists
    const knowledgeBase = await prisma.knowledgeBase.findUnique({
      where: { id },
    })

    if (!knowledgeBase) {
      throw notFoundError('Knowledge base')
    }

    // Create document and update knowledge base counts
    const document = await prisma.$transaction(async (tx) => {
      // Create document
      const doc = await tx.knowledgeBaseDocument.create({
        data: {
          ...validated,
          knowledgeBaseId: id,
          status: 'PROCESSING',
        },
      })

      // Update knowledge base counts
      const updates: any = {}
      if (validated.type === DocumentType.FILE) {
        updates.fileCount = { increment: 1 }
      } else if (validated.type === DocumentType.WEBSITE) {
        updates.websiteCount = { increment: 1 }
      } else if (validated.type === DocumentType.TEXT) {
        updates.textCount = { increment: 1 }
      }

      // Update status if this is first document
      if (knowledgeBase.status === 'EMPTY') {
        updates.status = 'PROCESSING'
      }

      await tx.knowledgeBase.update({
        where: { id },
        data: updates,
      })

      return doc
    })

    const response: ApiSuccessResponse<typeof document> = {
      success: true,
      data: document,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
