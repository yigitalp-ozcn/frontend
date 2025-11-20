import { z } from 'zod'
import { VoiceGender, VoiceStatus } from '@prisma/client'

// Create voice schema
export const createVoiceSchema = z.object({
  organizationId: z.string().cuid().optional().nullable(), // null for system voices
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  gender: z.nativeEnum(VoiceGender).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  avatar: z.string().optional().nullable(), // Color hex or image URL
  tags: z.array(z.string()).default([]),
  isCustom: z.boolean().default(true), // false for system voices
  audioUrl: z.string().url().optional().nullable(),
})

// Update voice schema
export const updateVoiceSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  gender: z.nativeEnum(VoiceGender).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  avatar: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  status: z.nativeEnum(VoiceStatus).optional(),
  audioUrl: z.string().url().nullable().optional(),
})

// Query params schema
export const voiceQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  gender: z.nativeEnum(VoiceGender).optional(),
  isCustom: z.coerce.boolean().optional(),
  status: z.nativeEnum(VoiceStatus).optional(),
  search: z.string().optional(),
  tags: z.string().optional(), // comma-separated tags
})

// Types
export type CreateVoiceInput = z.infer<typeof createVoiceSchema>
export type UpdateVoiceInput = z.infer<typeof updateVoiceSchema>
export type VoiceQueryParams = z.infer<typeof voiceQuerySchema>
