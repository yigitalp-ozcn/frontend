import { z } from 'zod'
import { DocumentType, KnowledgeBaseStatus } from '@/types/prisma-enums'

// Create knowledge base schema
export const createKnowledgeBaseSchema = z.object({
  organizationId: z.string().cuid('Invalid organization ID'),
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().max(500).optional().nullable(),
})

// Update knowledge base schema
export const updateKnowledgeBaseSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  status: z.nativeEnum(KnowledgeBaseStatus).optional(),
})

// Add document schema
export const addDocumentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.nativeEnum(DocumentType),
  url: z.string().url().optional().nullable(),
  content: z.string().optional().nullable(),
  fileSize: z.number().int().positive().optional().nullable(),
  mimeType: z.string().optional().nullable(),
})

// Query params schema
export const knowledgeBaseQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.nativeEnum(KnowledgeBaseStatus).optional(),
  search: z.string().optional(),
  include: z.string().optional(),
})

// Types
export type CreateKnowledgeBaseInput = z.infer<typeof createKnowledgeBaseSchema>
export type UpdateKnowledgeBaseInput = z.infer<typeof updateKnowledgeBaseSchema>
export type AddDocumentInput = z.infer<typeof addDocumentSchema>
export type KnowledgeBaseQueryParams = z.infer<typeof knowledgeBaseQuerySchema>
