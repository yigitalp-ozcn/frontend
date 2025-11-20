import { z } from 'zod'
import { CampaignStatus } from '@prisma/client'

// Campaign recipient schema
export const campaignRecipientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  notes: z.string().optional(),
})

// Create campaign schema
export const createCampaignSchema = z.object({
  organizationId: z.string().cuid('Invalid organization ID'),
  batchName: z.string().min(3, 'Batch name must be at least 3 characters').max(100),
  agentId: z.string().cuid('Invalid agent ID'),
  conversationPathId: z.string().cuid().optional().nullable(),
  firstSentence: z.string().min(10, 'First sentence must be at least 10 characters'),
  taskPrompt: z.string().min(20, 'Task prompt must be at least 20 characters'),
  postCallSummary: z.string().optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)').optional().nullable(),
  callStartTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional().nullable(),
  callEndTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional().nullable(),
  recipients: z.array(campaignRecipientSchema).min(1, 'At least one recipient is required').optional(),
})

// Update campaign schema
export const updateCampaignSchema = z.object({
  batchName: z.string().min(3).max(100).optional(),
  status: z.nativeEnum(CampaignStatus).optional(),
  agentId: z.string().cuid().optional(),
  conversationPathId: z.string().cuid().nullable().optional(),
  firstSentence: z.string().min(10).optional(),
  taskPrompt: z.string().min(20).optional(),
  postCallSummary: z.string().nullable().optional(),
  startDate: z.coerce.date().nullable().optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).nullable().optional(),
  callStartTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).nullable().optional(),
  callEndTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).nullable().optional(),
})

// Query params schema
export const campaignQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.nativeEnum(CampaignStatus).optional(),
  agentId: z.string().cuid().optional(),
  search: z.string().optional(),
  include: z.string().optional(),
})

// Campaign action schemas
export const startCampaignSchema = z.object({
  startDate: z.coerce.date().optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
})

export const stopCampaignSchema = z.object({
  reason: z.string().optional(),
})

// Add recipients schema
export const addRecipientsSchema = z.object({
  recipients: z.array(campaignRecipientSchema).min(1),
})

// Types
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>
export type CampaignQueryParams = z.infer<typeof campaignQuerySchema>
export type CampaignRecipientInput = z.infer<typeof campaignRecipientSchema>
export type StartCampaignInput = z.infer<typeof startCampaignSchema>
export type AddRecipientsInput = z.infer<typeof addRecipientsSchema>
