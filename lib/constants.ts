// Country codes for phone number selection
export const COUNTRY_CODES = [
  { code: "+1", country: "US/CA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+90", country: "TR", flag: "🇹🇷" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
] as const

// Filter options
export const CALL_TYPES = ["Inbound", "Outbound"] as const
export const CALL_STATUSES = ["Completed", "Failed", "Missed", "In Progress"] as const
export const AGENT_OPTIONS = ["Agent 1", "Agent 2", "Agent 3"] as const
export const CAMPAIGN_OPTIONS = ["Summer Sale", "Product Launch", "Customer Support"] as const

// Document limit
export const DOCUMENT_LIMIT = 100
