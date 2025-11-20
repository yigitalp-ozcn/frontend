import { z } from 'zod'
import { CallType, CallStatus } from '@prisma/client'

// Create call log schema
export const createCallLogSchema = z.object({
  organizationId: z.string().cuid('Invalid organization ID'),
  callType: z.nativeEnum(CallType),
  agentId: z.string().cuid('Invalid agent ID'),
  callId: z.string().min(1, 'Call ID is required'),
  customer: z.string().optional().nullable(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  duration: z.number().int().min(0).default(0),
  status: z.nativeEnum(CallStatus),
  campaignId: z.string().cuid().optional().nullable(),
  transcript: z.string().optional().nullable(),
  recordingUrl: z.string().url().optional().nullable(),
  metadata: z.record(z.any()).optional().nullable(),
})

// Update call log schema
export const updateCallLogSchema = z.object({
  duration: z.number().int().min(0).optional(),
  status: z.nativeEnum(CallStatus).optional(),
  transcript: z.string().nullable().optional(),
  recordingUrl: z.string().url().nullable().optional(),
  metadata: z.record(z.any()).nullable().optional(),
})

// Query params schema
export const callLogQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  callType: z.nativeEnum(CallType).optional(),
  status: z.nativeEnum(CallStatus).optional(),
  agentId: z.string().cuid().optional(),
  campaignId: z.string().cuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().optional(), // Search by customer name or phone number
  include: z.string().optional(),
})

// Stats query schema
export const callLogStatsSchema = z.object({
  organizationId: z.string().cuid(),
  agentId: z.string().cuid().optional(),
  campaignId: z.string().cuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

// Types
export type CreateCallLogInput = z.infer<typeof createCallLogSchema>
export type UpdateCallLogInput = z.infer<typeof updateCallLogSchema>
export type CallLogQueryParams = z.infer<typeof callLogQuerySchema>
export type CallLogStatsParams = z.infer<typeof callLogStatsSchema>
