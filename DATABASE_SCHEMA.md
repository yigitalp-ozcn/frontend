# Database Schema Documentation

## Overview

This database schema is designed for an **AI-powered voice agent platform** (similar to Bland.ai or Vapi.ai) that enables businesses to create, manage, and deploy conversational AI agents for handling phone calls. The platform supports both inbound and outbound calling, campaign management, knowledge base integration, and comprehensive call analytics.

## Technology Stack

- **Database**: PostgreSQL
- **ORM**: Prisma
- **ID Strategy**: CUID (Collision-resistant Unique Identifiers)
- **Authentication**: Supabase (inferred from project dependencies)
- **Multi-tenancy**: Organization-based row-level security

## Entity Relationship Diagram (Textual)

```
Organization (1) ─────< (N) User (via UserOrganization)
Organization (1) ─────< (N) Agent
Organization (1) ─────< (N) Campaign
Organization (1) ─────< (N) CallLog
Organization (1) ─────< (N) KnowledgeBase
Organization (1) ─────< (N) Voice (custom voices)
Organization (1) ─────< (N) ConversationPath
Organization (1) ─────< (N) Tool
Organization (1) ─────< (N) Event
Organization (1) ─────< (N) PhoneNumber
Organization (1) ─────< (N) ApiKey

Agent (1) ─────< (N) Campaign
Agent (1) ─────< (N) CallLog
Agent (N) ─────< (N) KnowledgeBase (via AgentKnowledgeBase)
Agent (N) ─────< (N) Tool (via AgentTool)
Agent (N) ─────< (N) ConversationPath (via AgentConversationPath)
Agent (N) ─────< (1) PhoneNumber
Agent (N) ─────< (1) Voice
Agent (1) ─────< (N) Event

Campaign (1) ─────< (N) CampaignRecipient
Campaign (1) ─────< (N) CallLog
Campaign (N) ─────< (1) ConversationPath

KnowledgeBase (1) ─────< (N) KnowledgeBaseDocument
```

## Core Models

### 1. Organization (Multi-tenancy)

The root entity for multi-tenant isolation. Every tenant-specific resource belongs to an organization.

**Fields:**
- `id` (CUID): Primary key
- `name`: Organization name
- `slug`: Unique URL-friendly identifier
- `plan`: Subscription plan (free, pro, enterprise)
- `credits`: Available calling credits
- `createdAt`, `updatedAt`: Timestamps

**Design Decisions:**
- **Multi-tenancy Pattern**: Shared database with organizationId column on all tenant-specific tables
- **Row-level Security**: All queries must filter by organizationId to ensure data isolation
- **Credits System**: Pre-paid credits model for pay-as-you-go billing
- **Slug Field**: Enables custom subdomains (e.g., acme-corp.platform.com)

**Relationships:**
- One-to-many with: Users, Agents, Campaigns, CallLogs, KnowledgeBases, Voices, Tools, Events, PhoneNumbers, ApiKeys

### 2. User & UserOrganization

Multi-tenant user management with role-based access control.

**User Fields:**
- `id` (CUID): Primary key
- `email`: Unique across platform
- `firstName`, `lastName`, `phone`: Profile information
- `timeZone`: User timezone for scheduling
- `password`: Hashed password
- `avatar`: Profile picture URL
- `role`: Global role (OWNER, ADMIN, VIEWER)
- `status`: Account status (ACTIVE, PENDING)
- `twoFactorEnabled`, `twoFactorSecret`: 2FA configuration

**UserOrganization Fields:**
- `userId`, `organizationId`: Composite primary key
- `role`: Organization-specific role (can differ from global role)

**Design Decisions:**
- **Many-to-many User-Organization**: Users can belong to multiple organizations
- **Dual Role System**: Global role + per-organization role for flexibility
- **2FA Support**: Built-in two-factor authentication
- **Timezone Awareness**: Critical for scheduling campaigns across timezones

### 3. Agent

AI voice agents that handle phone calls.

**Fields:**
- `id` (CUID): Primary key
- `organizationId`: Foreign key
- `name`, `description`, `type`: Agent metadata
- `status`: ACTIVE | INACTIVE
- `callerType`: INBOUND | OUTBOUND
- `phoneNumberId`: Assigned phone number (optional)
- `voiceId`: TTS voice (optional)
- `successRate`: Performance metric (0-100)
- `totalCalls`: Call count
- `configuration` (JSON): Flexible AI provider settings

**Configuration JSON Example:**
```json
{
  "stt": { "provider": "deepgram", "model": "nova-2" },
  "llm": { "provider": "openai", "model": "gpt-4-turbo" },
  "tts": { "provider": "elevenlabs", "voice": "june" }
}
```

**Design Decisions:**
- **JSON Configuration**: Allows flexible provider switching without schema changes
- **Optional Phone Number**: Agents can share phone numbers or be unassigned
- **Success Rate Tracking**: Calculated from call outcomes for performance analytics
- **Type Field**: Free-text for custom categorization (e.g., "Inbound Support", "Outbound Sales")

**Relationships:**
- Many-to-one with: Organization, PhoneNumber, Voice
- One-to-many with: Campaigns, CallLogs, Events
- Many-to-many with: KnowledgeBases, Tools, ConversationPaths

### 4. Campaign

Outbound calling campaigns with batch recipient management.

**Fields:**
- `id` (CUID): Primary key
- `organizationId`: Foreign key
- `batchName`: Campaign name
- `status`: DRAFT | PLANNED | CONTINUING | COMPLETED | STOPPED
- `progress`: Percentage (0-100)
- `totalCalls`, `completedCalls`: Call tracking
- `agentId`: Assigned agent
- `conversationPathId`: Flow template (optional)
- `firstSentence`: Opening line
- `taskPrompt`: Agent instructions
- `postCallSummary`: Summary template
- `startDate`, `startTime`: Scheduling
- `callStartTime`, `callEndTime`: Daily calling window

**Design Decisions:**
- **Workflow States**: Draft → Planned → Continuing → Completed/Stopped
- **Progress Tracking**: Auto-calculated from completedCalls/totalCalls
- **Scheduling**: Supports future-dated campaigns and time-of-day restrictions
- **Flexible Prompts**: Customizable agent behavior per campaign

**Relationships:**
- Many-to-one with: Organization, Agent, ConversationPath
- One-to-many with: CampaignRecipients, CallLogs

### 5. CampaignRecipient

Contact list for campaign recipients.

**Fields:**
- `id` (CUID): Primary key
- `campaignId`: Foreign key
- `name`, `phoneNumber`, `notes`: Contact details
- `status`: READY | ERROR

**Design Decisions:**
- **Campaign-specific**: Recipients tied to individual campaigns (not global contact list)
- **CSV Import Pattern**: Designed for bulk uploads from CSV files
- **Status Tracking**: Flags invalid phone numbers before calling
- **Notes Field**: Supports per-recipient instructions (e.g., "Do not call before 2 PM")

### 6. CallLog

Comprehensive call history and analytics.

**Fields:**
- `id` (CUID): Primary key
- `organizationId`: Foreign key
- `callType`: INBOUND | OUTBOUND
- `agentId`, `campaignId`: References
- `callId`: Unique call identifier
- `customer`, `phoneNumber`: Contact info
- `timestamp`: Call start time
- `duration`: Seconds
- `status`: COMPLETED | FAILED | MISSED | IN_PROGRESS
- `transcript`: Full conversation text
- `recordingUrl`: Audio file URL
- `metadata` (JSON): Additional data

**Design Decisions:**
- **Unique callId**: External system integration ID
- **Dual Link**: Can belong to campaign or be standalone
- **Full Transcript Storage**: Enables search and analytics
- **JSON Metadata**: Extensible for custom fields (sentiment, keywords, etc.)
- **Duration in Seconds**: Precise billing and analytics

**Indexes:**
- `organizationId`, `agentId`, `campaignId`: Filtering
- `callId`: External lookups
- `status`, `callType`: Analytics queries
- `timestamp`: Time-series queries
- `phoneNumber`: Customer history lookups

### 7. KnowledgeBase & KnowledgeBaseDocument

RAG (Retrieval-Augmented Generation) system for agent knowledge.

**KnowledgeBase Fields:**
- `id` (CUID): Primary key
- `organizationId`: Foreign key
- `name`, `description`: Metadata
- `fileCount`, `websiteCount`, `textCount`: Document counters
- `status`: PROCESSING | READY | ACTIVE | EMPTY

**KnowledgeBaseDocument Fields:**
- `id` (CUID): Primary key
- `knowledgeBaseId`: Foreign key
- `name`: Document name
- `type`: FILE | WEBSITE | TEXT
- `url`: For files and websites
- `content`: For text documents
- `fileSize`, `mimeType`: File metadata
- `status`: PROCESSING | READY | ERROR

**Design Decisions:**
- **Multiple Source Types**: Support files, websites, and manual text entry
- **Processing Pipeline**: Async document ingestion with status tracking
- **Document Limits**: DOCUMENT_LIMIT constant (100) enforced at app level
- **Agent Sharing**: Multiple agents can use same knowledge base

**Relationships:**
- KnowledgeBase: Many-to-one with Organization, Many-to-many with Agents
- KnowledgeBaseDocument: Many-to-one with KnowledgeBase

### 8. Voice

Text-to-speech voice configurations.

**Fields:**
- `id` (CUID): Primary key
- `organizationId`: Nullable (system voices have null)
- `name`, `gender`, `description`: Voice metadata
- `avatar`: Color hex or image URL
- `tags`: Array of tags (e.g., ["english", "american", "female"])
- `isCustom`: System vs. custom voice
- `status`: READY | PROCESSING | ERROR
- `audioUrl`: Sample audio

**Design Decisions:**
- **System + Custom Voices**: organizationId null = system-wide, not null = custom
- **Tag-based Search**: Filterable by language, accent, gender, tone
- **Avatar Colors**: Visual distinction in UI (hex colors from mock data)
- **Voice Cloning**: Custom voices with PROCESSING status for async generation

### 9. ConversationPath

Flow diagrams for conversation logic.

**Fields:**
- `id` (CUID): Primary key
- `organizationId`: Foreign key
- `name`, `useCase`, `agentSpeech`: Metadata
- `nodes`, `edges` (JSON): Flow diagram structure

**Design Decisions:**
- **Visual Flow Builder**: JSON stores node-based conversation flows
- **Reusability**: Multiple agents can use same path
- **Template System**: Planned feature for pre-built conversation templates
- **Integration**: Compatible with react-flow library (@xyflow/react in dependencies)

### 10. Tool

External integrations (Google Calendar, Stripe, Slack, etc.).

**Fields:**
- `id` (CUID): Primary key
- `organizationId`: Foreign key
- `name`, `description`, `category`: Metadata
- `logo`, `iconBgColor`: UI styling
- `isConnected`: Connection status
- `configuration` (JSON): Integration credentials

**Design Decisions:**
- **OAuth Configuration**: JSON stores tokens and API keys
- **Connection Status**: Tracks successful authentication
- **Agent Assignment**: Many-to-many allows selective tool access per agent
- **Category Field**: Grouping (e.g., "Integration", "CRM", "Communication")

### 11. Event

Webhook event system.

**Fields:**
- `id` (CUID): Primary key
- `organizationId`: Foreign key
- `name`, `description`: Event metadata
- `isEnabled`: Toggle
- `agentId`: Triggering agent (optional)
- `webhookUrl`: Destination URL
- `triggerCount`: Usage tracking

**Design Decisions:**
- **Agent-specific Events**: Can be tied to specific agent or global
- **Enable/Disable**: Toggle without deletion for debugging
- **Usage Tracking**: triggerCount for billing/analytics
- **Payload Structure**: Standardized JSON format with transcript, metadata

### 12. PhoneNumber

Phone number inventory and assignment.

**Fields:**
- `id` (CUID): Primary key
- `organizationId`: Foreign key
- `label`: User-friendly name
- `phoneNumber`: Actual number (unique globally)
- `inboundStatus`, `outboundStatus`: ENABLED | DISABLED

**Design Decisions:**
- **Dual Direction Control**: Separate enable/disable for inbound/outbound
- **One-to-Many with Agents**: Same number can serve multiple agents (time-based routing)
- **Global Uniqueness**: phoneNumber unique across all organizations
- **Label Field**: User-friendly names like "Support Line", "Sales Line"

### 13. ApiKey

API authentication for external integrations.

**Fields:**
- `id` (CUID): Primary key
- `organizationId`, `userId`: Foreign keys
- `name`: Key description
- `key`: Actual API key (unique)
- `expirationDate`: Optional expiry
- `status`: ACTIVE | REVOKED

**Design Decisions:**
- **User + Organization Scope**: Tracks both who created and which org owns
- **Expiration Support**: Optional time-based expiry
- `Revocation**: Soft delete via status change
- **Key Format**: Prefixed (sk_live_, sk_test_) for environment distinction

## Indexes Strategy

### Performance-Critical Indexes

1. **Foreign Keys**: All foreign key columns indexed for join performance
2. **Multi-tenant Filtering**: `organizationId` on all tenant tables
3. **Status Filters**: Common WHERE clauses (status, callType, etc.)
4. **Time-series**: `timestamp` on CallLog for analytics
5. **Lookups**: Unique identifiers (callId, email, phoneNumber, key)

### Composite Index Candidates

Consider adding for specific query patterns:
- `CallLog(organizationId, timestamp)` - Organization call history
- `Campaign(organizationId, status)` - Active campaigns per org
- `Agent(organizationId, status, callerType)` - Filtered agent lists

## Migration Strategy

### Development

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed
```

### Production

```bash
# Deploy migrations (no prompts)
npx prisma migrate deploy

# Generate client
npx prisma generate
```

### Seed Configuration

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## Common Query Patterns

### Get User with Organizations

```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    organizations: {
      include: {
        organization: true,
      },
    },
  },
})
```

### Get Agent with All Resources

```typescript
const agent = await prisma.agent.findUnique({
  where: { id: agentId },
  include: {
    phoneNumber: true,
    voice: true,
    knowledgeBases: {
      include: {
        knowledgeBase: {
          include: {
            documents: true,
          },
        },
      },
    },
    tools: {
      include: {
        tool: true,
      },
    },
    conversationPaths: {
      include: {
        conversationPath: true,
      },
    },
  },
})
```

### Get Campaign with Recipients and Stats

```typescript
const campaign = await prisma.campaign.findUnique({
  where: { id: campaignId },
  include: {
    agent: {
      include: {
        voice: true,
      },
    },
    recipients: {
      where: {
        status: 'READY',
      },
    },
    callLogs: {
      orderBy: {
        timestamp: 'desc',
      },
      take: 10,
    },
  },
})
```

### Get Call Logs with Filters

```typescript
const callLogs = await prisma.callLog.findMany({
  where: {
    organizationId: orgId,
    callType: 'OUTBOUND',
    status: 'COMPLETED',
    timestamp: {
      gte: new Date('2024-11-01'),
      lte: new Date('2024-11-30'),
    },
  },
  include: {
    agent: {
      select: {
        name: true,
        type: true,
      },
    },
    campaign: {
      select: {
        batchName: true,
      },
    },
  },
  orderBy: {
    timestamp: 'desc',
  },
  take: 50,
})
```

### Multi-tenant Query with Middleware

Always filter by organizationId. Consider Prisma middleware:

```typescript
prisma.$use(async (params, next) => {
  // Get organizationId from context
  const organizationId = getCurrentOrganizationId()

  if (params.model && TENANT_MODELS.includes(params.model)) {
    if (params.action === 'findMany' || params.action === 'findFirst') {
      params.args.where = {
        ...params.args.where,
        organizationId,
      }
    }
  }

  return next(params)
})
```

## Security Considerations

### 1. Row-Level Security (RLS)

- **Enforcement**: All queries must include organizationId filter
- **Middleware**: Implement Prisma middleware to auto-inject organizationId
- **API Layer**: Validate organization access in API routes

### 2. Password Security

- **Hashing**: Use bcrypt or Argon2 (seed uses crypto.hash for demo only)
- **2FA**: twoFactorSecret stores TOTP secrets
- **Password Reset**: Implement via Supabase Auth

### 3. API Key Management

- **Generation**: Use cryptographically secure random generation
- **Storage**: Hash keys before storage (store hash, return original once)
- **Rotation**: Support key expiration and renewal
- **Scoping**: Implement per-key permission scopes (future enhancement)

### 4. Data Isolation

- **Organizations**: Strict separation via organizationId
- **Cascade Deletes**: CASCADE on organization deletion to clean up data
- **User Deletion**: CASCADE on user deletion for owned resources

### 5. Sensitive Data

- **Transcripts**: Consider encryption at rest for compliance (GDPR, HIPAA)
- **Phone Numbers**: PII - implement data retention policies
- **Recordings**: Store in separate encrypted storage (S3 with KMS)

## Performance Optimization

### 1. Connection Pooling

Configure in schema.prisma:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_DIRECT_URL")
}
```

Use `DATABASE_URL` with PgBouncer for app connections, `DATABASE_DIRECT_URL` for migrations.

### 2. Query Optimization

- **Select Only Needed Fields**: Use `select` instead of `include` when possible
- **Pagination**: Implement cursor-based pagination for large datasets
- **Aggregations**: Use Prisma aggregations for counts and sums
- **Caching**: Cache frequently accessed, rarely changed data (voices, tools)

### 3. Batch Operations

```typescript
// Create multiple recipients at once
await prisma.campaignRecipient.createMany({
  data: recipients,
  skipDuplicates: true,
})
```

### 4. Database Indexes

Review actual query patterns and add indexes:

```sql
-- Example: Call logs by organization and date
CREATE INDEX idx_call_logs_org_timestamp
ON "CallLog" ("organizationId", "timestamp" DESC);
```

## Future Enhancements

### 1. Soft Deletes

Add `deletedAt` field to models requiring data recovery:

```prisma
model Agent {
  // ... existing fields
  deletedAt DateTime?

  @@index([deletedAt])
}
```

### 2. Audit Trail

Track all changes for compliance:

```prisma
model AuditLog {
  id         String   @id @default(cuid())
  userId     String
  action     String   // CREATE, UPDATE, DELETE
  entityType String   // Agent, Campaign, etc.
  entityId   String
  changes    Json     // Before/after snapshot
  createdAt  DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([userId, createdAt])
  @@index([entityType, entityId])
}
```

### 3. Analytics Tables

Denormalized tables for faster analytics:

```prisma
model DailyCallStats {
  id             String   @id @default(cuid())
  organizationId String
  agentId        String
  date           DateTime @db.Date
  totalCalls     Int
  completedCalls Int
  failedCalls    Int
  avgDuration    Float

  @@unique([organizationId, agentId, date])
  @@index([organizationId, date])
}
```

### 4. Real-time Subscriptions

Add fields for WebSocket/SSE support:

```prisma
model CallLog {
  // ... existing fields
  status        CallStatus
  statusUpdates Json[]     // Array of {status, timestamp} for history
}
```

## Deployment Checklist

- [ ] Set up PostgreSQL database (RDS, Supabase, etc.)
- [ ] Configure environment variables (DATABASE_URL, DATABASE_DIRECT_URL)
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Seed initial data (optional): `npx prisma db seed`
- [ ] Set up connection pooling (PgBouncer)
- [ ] Configure backups and point-in-time recovery
- [ ] Enable PostgreSQL extensions (pg_trgm for full-text search)
- [ ] Set up monitoring (query performance, connection pool)
- [ ] Implement row-level security middleware
- [ ] Set up API key rotation policy
- [ ] Configure data retention and cleanup jobs

## Support & Maintenance

### Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name add_new_feature

# Reset database (dev only)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

### Prisma Studio (Database GUI)

```bash
npx prisma studio
```

### Common Issues

**Issue**: Migration conflicts
**Solution**: Use `npx prisma migrate resolve --applied <migration_name>` or `--rolled-back`

**Issue**: Schema drift
**Solution**: Run `npx prisma db pull` to sync schema from database, then `npx prisma migrate dev` to create migration

**Issue**: Connection pool exhaustion
**Solution**: Increase pool size or implement connection reuse in serverless functions

---

**Schema Version**: 1.0.0
**Last Updated**: 2025-01-20
**Prisma Version**: ^5.x
**PostgreSQL Version**: 14+
