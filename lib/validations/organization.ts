import { z } from 'zod'

// Create organization schema
export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  plan: z.string().default('free'),
  credits: z.number().int().min(0).default(0),
})

// Update organization schema
export const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  plan: z.string().optional(),
  credits: z.number().int().min(0).optional(),
})

// Query params schema
export const organizationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  plan: z.string().optional(),
})

// Types
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>
export type OrganizationQueryParams = z.infer<typeof organizationQuerySchema>
