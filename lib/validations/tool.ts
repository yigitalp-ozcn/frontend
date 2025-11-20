import { z } from 'zod'

// Create tool schema
export const createToolSchema = z.object({
  organizationId: z.string().cuid('Invalid organization ID'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional().nullable(),
  category: z.string().min(1, 'Category is required'),
  logo: z.string().url().optional().nullable(),
  iconBgColor: z.string().optional().nullable(),
  configuration: z.record(z.any()).optional().nullable(), // OAuth tokens, API keys, etc.
})

// Update tool schema
export const updateToolSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  category: z.string().min(1).optional(),
  logo: z.string().url().nullable().optional(),
  iconBgColor: z.string().nullable().optional(),
  isConnected: z.boolean().optional(),
  configuration: z.record(z.any()).nullable().optional(),
})

// Connect tool schema
export const connectToolSchema = z.object({
  configuration: z.record(z.any()), // Connection credentials
})

// Query params schema
export const toolQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  category: z.string().optional(),
  isConnected: z.coerce.boolean().optional(),
  search: z.string().optional(),
})

// Types
export type CreateToolInput = z.infer<typeof createToolSchema>
export type UpdateToolInput = z.infer<typeof updateToolSchema>
export type ConnectToolInput = z.infer<typeof connectToolSchema>
export type ToolQueryParams = z.infer<typeof toolQuerySchema>
