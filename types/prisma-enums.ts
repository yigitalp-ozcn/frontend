/**
 * Prisma enum definitions
 * This file contains enum definitions extracted from schema.prisma
 * Used as a fallback when Prisma client generation is unavailable
 */

export enum AgentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum CallerType {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export enum CampaignStatus {
  CONTINUING = 'CONTINUING',
  COMPLETE = 'COMPLETE',
  PAUSED = 'PAUSED',
}

export enum CallStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  MISSED = 'MISSED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export enum CallType {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export enum KnowledgeBaseStatus {
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  FAILED = 'FAILED',
}

export enum VoiceGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NEUTRAL = 'NEUTRAL',
}

export enum VoiceStatus {
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  FAILED = 'FAILED',
}

export enum ToolCategory {
  CRM = 'CRM',
  CALENDAR = 'CALENDAR',
  PAYMENT = 'PAYMENT',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  CUSTOM = 'CUSTOM',
}

export enum DocumentType {
  FILE = 'FILE',
  WEBSITE = 'WEBSITE',
  TEXT = 'TEXT',
}
