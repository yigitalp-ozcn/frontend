// Database type exports and utilities
import { Prisma } from '@prisma/client'

// ==================== ORGANIZATION ====================

export type Organization = Prisma.OrganizationGetPayload<{}>

export type OrganizationWithUsers = Prisma.OrganizationGetPayload<{
  include: {
    users: {
      include: {
        user: true
      }
    }
  }
}>

// ==================== USER ====================

export type User = Prisma.UserGetPayload<{}>

export type UserWithOrganizations = Prisma.UserGetPayload<{
  include: {
    organizations: {
      include: {
        organization: true
      }
    }
  }
}>

// ==================== AGENT ====================

export type Agent = Prisma.AgentGetPayload<{}>

export type AgentWithRelations = Prisma.AgentGetPayload<{
  include: {
    organization: true
    phoneNumber: true
    voice: true
    knowledgeBases: {
      include: {
        knowledgeBase: true
      }
    }
    tools: {
      include: {
        tool: true
      }
    }
    conversationPaths: {
      include: {
        conversationPath: true
      }
    }
  }
}>

export type AgentWithStats = Agent & {
  _count: {
    callLogs: number
    campaigns: number
    knowledgeBases: number
    tools: number
  }
}

// ==================== CAMPAIGN ====================

export type Campaign = Prisma.CampaignGetPayload<{}>

export type CampaignWithRelations = Prisma.CampaignGetPayload<{
  include: {
    organization: true
    agent: true
    conversationPath: true
    recipients: true
    callLogs: true
  }
}>

export type CampaignWithRecipients = Prisma.CampaignGetPayload<{
  include: {
    recipients: true
  }
}>

// ==================== CALL LOG ====================

export type CallLog = Prisma.CallLogGetPayload<{}>

export type CallLogWithRelations = Prisma.CallLogGetPayload<{
  include: {
    organization: true
    agent: true
    campaign: true
  }
}>

// ==================== KNOWLEDGE BASE ====================

export type KnowledgeBase = Prisma.KnowledgeBaseGetPayload<{}>

export type KnowledgeBaseWithDocuments = Prisma.KnowledgeBaseGetPayload<{
  include: {
    documents: true
  }
}>

export type KnowledgeBaseDocument = Prisma.KnowledgeBaseDocumentGetPayload<{}>

// ==================== VOICE ====================

export type Voice = Prisma.VoiceGetPayload<{}>

export type VoiceWithOrganization = Prisma.VoiceGetPayload<{
  include: {
    organization: true
  }
}>

// ==================== CONVERSATION PATH ====================

export type ConversationPath = Prisma.ConversationPathGetPayload<{}>

export type ConversationPathWithRelations = Prisma.ConversationPathGetPayload<{
  include: {
    organization: true
    agents: {
      include: {
        agent: true
      }
    }
  }
}>

// ==================== TOOL ====================

export type Tool = Prisma.ToolGetPayload<{}>

export type ToolWithAgents = Prisma.ToolGetPayload<{
  include: {
    agents: {
      include: {
        agent: true
      }
    }
  }
}>

// ==================== EVENT ====================

export type Event = Prisma.EventGetPayload<{}>

export type EventWithRelations = Prisma.EventGetPayload<{
  include: {
    organization: true
    agent: true
  }
}>

// ==================== PHONE NUMBER ====================

export type PhoneNumber = Prisma.PhoneNumberGetPayload<{}>

export type PhoneNumberWithAgents = Prisma.PhoneNumberGetPayload<{
  include: {
    agents: true
  }
}>

// ==================== API KEY ====================

export type ApiKey = Prisma.ApiKeyGetPayload<{}>

export type ApiKeyWithRelations = Prisma.ApiKeyGetPayload<{
  include: {
    organization: true
    user: true
  }
}>

// ==================== CAMPAIGN RECIPIENT ====================

export type CampaignRecipient = Prisma.CampaignRecipientGetPayload<{}>
