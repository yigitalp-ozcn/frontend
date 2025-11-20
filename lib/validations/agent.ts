import { z } from 'zod'
import { AgentStatus, CallerType } from '@prisma/client'

// Agent AI configuration schema
export const agentConfigurationSchema = z.object({
  stt: z.object({
    provider: z.string().min(1, 'STT provider is required'),
    model: z.string().optional(),
    config: z.record(z.any()).optional(),
  }),
  llm: z.object({
    provider: z.string().min(1, 'LLM provider is required'),
    model: z.string().optional(),
    config: z.record(z.any()).optional(),
  }),
  tts: z.object({
    provider: z.string().min(1, 'TTS provider is required'),
    voice: z.string().optional(),
    config: z.record(z.any()).optional(),
  }),
})

// Create agent schema
export const createAgentSchema = z.object({
  organizationId: z.string().cuid('Invalid organization ID'),
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  type: z.string().min(1, 'Type is required'),
  callerType: z.nativeEnum(CallerType).default(CallerType.INBOUND),
  phoneNumberId: z.string().cuid().optional().nullable(),
  voiceId: z.string().cuid().optional().nullable(),
  configuration: agentConfigurationSchema.optional().nullable(),
})

// Update agent schema (all fields optional except ID)
export const updateAgentSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  type: z.string().min(1).optional(),
  status: z.nativeEnum(AgentStatus).optional(),
  callerType: z.nativeEnum(CallerType).optional(),
  phoneNumberId: z.string().cuid().nullable().optional(),
  voiceId: z.string().cuid().nullable().optional(),
  configuration: agentConfigurationSchema.nullable().optional(),
})

// Query params schema
export const agentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.nativeEnum(AgentStatus).optional(),
  callerType: z.nativeEnum(CallerType).optional(),
  search: z.string().optional(),
  include: z.string().optional(), // comma-separated: "voice,knowledgeBases,tools"
})

// Agent status toggle schema
export const toggleAgentStatusSchema = z.object({
  status: z.nativeEnum(AgentStatus),
})

// Types inferred from schemas
export type CreateAgentInput = z.infer<typeof createAgentSchema>
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>
export type AgentQueryParams = z.infer<typeof agentQuerySchema>
export type AgentConfiguration = z.infer<typeof agentConfigurationSchema>
