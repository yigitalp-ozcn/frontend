# API Documentation

Complete REST API documentation for the AI Voice Agent Platform.

## Base URL

```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## Response Format

All endpoints return responses in this standard format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [...]
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists (unique constraint) |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `BAD_REQUEST` | 400 | Invalid request |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Agents API

### List Agents

```bash
GET /api/agents
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `status` (enum: ACTIVE | INACTIVE) - Filter by status
- `callerType` (enum: INBOUND | OUTBOUND) - Filter by caller type
- `search` (string) - Search by name, description, or type
- `include` (string) - Comma-separated relations: `voice,phoneNumber,knowledgeBases,tools,conversationPaths`

**Example:**

```bash
curl "http://localhost:3000/api/agents?page=1&limit=10&status=ACTIVE&include=voice,knowledgeBases"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx123...",
      "organizationId": "clx456...",
      "name": "Customer Support Agent",
      "description": "Handles customer inquiries",
      "type": "Inbound Support",
      "status": "ACTIVE",
      "callerType": "INBOUND",
      "phoneNumberId": "clx789...",
      "voiceId": "clx012...",
      "successRate": 94.5,
      "totalCalls": 1247,
      "configuration": {
        "stt": { "provider": "deepgram" },
        "llm": { "provider": "openai" },
        "tts": { "provider": "elevenlabs" }
      },
      "voice": { ... },
      "knowledgeBases": [ ... ],
      "createdAt": "2024-11-20T10:00:00Z",
      "updatedAt": "2024-11-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Create Agent

```bash
POST /api/agents
```

**Request Body:**

```json
{
  "organizationId": "clx456...",
  "name": "Sales Agent",
  "description": "Handles outbound sales calls",
  "type": "Outbound Sales",
  "callerType": "OUTBOUND",
  "phoneNumberId": "clx789...",
  "voiceId": "clx012...",
  "configuration": {
    "stt": {
      "provider": "deepgram",
      "model": "nova-2"
    },
    "llm": {
      "provider": "openai",
      "model": "gpt-4-turbo"
    },
    "tts": {
      "provider": "elevenlabs",
      "voice": "max"
    }
  }
}
```

**Example:**

```bash
curl -X POST "http://localhost:3000/api/agents" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "clx456...",
    "name": "Sales Agent",
    "description": "Handles outbound sales calls with AI",
    "type": "Outbound Sales",
    "callerType": "OUTBOUND"
  }'
```

### Get Single Agent

```bash
GET /api/agents/:id
```

**Query Parameters:**
- `include` (string) - Relations to include

**Example:**

```bash
curl "http://localhost:3000/api/agents/clx123?include=voice,knowledgeBases,tools,callLogs"
```

### Update Agent

```bash
PATCH /api/agents/:id
```

**Request Body:** (all fields optional)

```json
{
  "name": "Updated Agent Name",
  "description": "Updated description",
  "status": "ACTIVE",
  "configuration": { ... }
}
```

**Example:**

```bash
curl -X PATCH "http://localhost:3000/api/agents/clx123" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ACTIVE",
    "successRate": 95.0
  }'
```

### Delete Agent

```bash
DELETE /api/agents/:id
```

**Example:**

```bash
curl -X DELETE "http://localhost:3000/api/agents/clx123"
```

### Toggle Agent Status

```bash
PATCH /api/agents/:id/status
```

**Request Body:**

```json
{
  "status": "ACTIVE"
}
```

**Example:**

```bash
curl -X PATCH "http://localhost:3000/api/agents/clx123/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "INACTIVE"}'
```

---

## Organizations API

### List Organizations

```bash
GET /api/organizations
```

**Query Parameters:**
- `page`, `limit` - Pagination
- `search` - Search by name or slug
- `plan` - Filter by plan

**Example:**

```bash
curl "http://localhost:3000/api/organizations?page=1&limit=10"
```

### Create Organization

```bash
POST /api/organizations
```

**Request Body:**

```json
{
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "plan": "enterprise",
  "credits": 10000
}
```

### Get Single Organization

```bash
GET /api/organizations/:id
```

Returns organization with user count and stats.

### Update Organization

```bash
PATCH /api/organizations/:id
```

### Delete Organization

```bash
DELETE /api/organizations/:id
```

**Warning:** This will cascade delete all related records (agents, campaigns, etc.).

---

## Campaigns API

### List Campaigns

```bash
GET /api/campaigns
```

**Query Parameters:**
- `page`, `limit` - Pagination
- `status` (enum: DRAFT | PLANNED | CONTINUING | COMPLETED | STOPPED)
- `agentId` - Filter by agent
- `search` - Search by batch name
- `include` - `agent,recipients,callLogs,conversationPath`

**Example:**

```bash
curl "http://localhost:3000/api/campaigns?status=CONTINUING&include=agent,recipients"
```

### Create Campaign

```bash
POST /api/campaigns
```

**Request Body:**

```json
{
  "organizationId": "clx456...",
  "batchName": "Q4 Product Launch",
  "agentId": "clx123...",
  "conversationPathId": "clx789...",
  "firstSentence": "Hi! I'm calling about our new product.",
  "taskPrompt": "Qualify leads and schedule demos.",
  "startDate": "2024-12-01T00:00:00Z",
  "startTime": "09:00",
  "callStartTime": "09:00",
  "callEndTime": "17:00",
  "recipients": [
    {
      "name": "John Doe",
      "phoneNumber": "+15551234567",
      "notes": "Preferred time: 10 AM"
    }
  ]
}
```

### Get Single Campaign

```bash
GET /api/campaigns/:id?include=recipients,callLogs
```

### Update Campaign

```bash
PATCH /api/campaigns/:id
```

### Delete Campaign

```bash
DELETE /api/campaigns/:id
```

### Start Campaign

```bash
POST /api/campaigns/:id/start
```

**Request Body:**

```json
{
  "startDate": "2024-12-01T00:00:00Z",
  "startTime": "10:00"
}
```

**Example:**

```bash
curl -X POST "http://localhost:3000/api/campaigns/clx123/start" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Stop Campaign

```bash
POST /api/campaigns/:id/stop
```

**Request Body:**

```json
{
  "reason": "Manual stop by admin"
}
```

---

## Call Logs API

### List Call Logs

```bash
GET /api/call-logs
```

**Query Parameters:**
- `page`, `limit` - Pagination
- `callType` (enum: INBOUND | OUTBOUND)
- `status` (enum: COMPLETED | FAILED | MISSED | IN_PROGRESS)
- `agentId` - Filter by agent
- `campaignId` - Filter by campaign
- `startDate`, `endDate` - Date range filter (ISO 8601)
- `search` - Search by customer name, phone number, or call ID
- `include` - `agent,campaign,organization`

**Example:**

```bash
curl "http://localhost:3000/api/call-logs?callType=OUTBOUND&status=COMPLETED&startDate=2024-11-01&endDate=2024-11-30"
```

### Create Call Log

```bash
POST /api/call-logs
```

**Request Body:**

```json
{
  "organizationId": "clx456...",
  "callType": "INBOUND",
  "agentId": "clx123...",
  "callId": "CALL-12345",
  "customer": "John Doe",
  "phoneNumber": "+15551234567",
  "duration": 320,
  "status": "COMPLETED",
  "campaignId": "clx789...",
  "transcript": "Full conversation transcript...",
  "recordingUrl": "https://storage.example.com/calls/CALL-12345.mp3",
  "metadata": {
    "sentiment": "positive",
    "keywords": ["product", "pricing"]
  }
}
```

### Get Single Call Log

```bash
GET /api/call-logs/:id?include=agent,campaign
```

### Update Call Log

```bash
PATCH /api/call-logs/:id
```

Useful for updating status, transcript, or recording URL after call completion.

### Get Call Statistics

```bash
GET /api/call-logs/stats
```

**Query Parameters:**
- `organizationId` (required)
- `agentId` (optional)
- `campaignId` (optional)
- `startDate`, `endDate` (optional)

**Example:**

```bash
curl "http://localhost:3000/api/call-logs/stats?organizationId=clx456&startDate=2024-11-01"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 1247,
    "byStatus": {
      "COMPLETED": 1180,
      "FAILED": 42,
      "MISSED": 25,
      "IN_PROGRESS": 0
    },
    "byType": {
      "INBOUND": 847,
      "OUTBOUND": 400
    },
    "avgDuration": 285,
    "successRate": 95
  }
}
```

---

## Knowledge Bases API

### List Knowledge Bases

```bash
GET /api/knowledge-bases
```

**Query Parameters:**
- `page`, `limit` - Pagination
- `status` (enum: PROCESSING | READY | ACTIVE | EMPTY)
- `search` - Search by name or description
- `include` - `documents,agents`

### Create Knowledge Base

```bash
POST /api/knowledge-bases
```

**Request Body:**

```json
{
  "organizationId": "clx456...",
  "name": "Product Documentation",
  "description": "Complete product docs and FAQs"
}
```

### Get Single Knowledge Base

```bash
GET /api/knowledge-bases/:id
```

Returns knowledge base with all documents and linked agents.

### Update Knowledge Base

```bash
PATCH /api/knowledge-bases/:id
```

### Delete Knowledge Base

```bash
DELETE /api/knowledge-bases/:id
```

### Add Document

```bash
POST /api/knowledge-bases/:id/documents
```

**Request Body:**

```json
{
  "name": "Getting Started Guide",
  "type": "FILE",
  "url": "https://example.com/docs/guide.pdf",
  "fileSize": 2048576,
  "mimeType": "application/pdf"
}
```

**Document Types:**
- `FILE` - PDF, DOCX, TXT files
- `WEBSITE` - Webpage URL to scrape
- `TEXT` - Direct text content

**Example (Text):**

```bash
curl -X POST "http://localhost:3000/api/knowledge-bases/clx123/documents" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "FAQ Item",
    "type": "TEXT",
    "content": "Q: How do I reset password? A: Click forgot password..."
  }'
```

---

## Voices API

### List Voices

```bash
GET /api/voices
```

**Query Parameters:**
- `page`, `limit` - Pagination
- `gender` (enum: MALE | FEMALE)
- `isCustom` (boolean) - Filter system vs custom voices
- `status` (enum: READY | PROCESSING | ERROR)
- `search` - Search by name or description
- `tags` - Comma-separated tags filter

**Example:**

```bash
curl "http://localhost:3000/api/voices?gender=FEMALE&tags=english,american"
```

### Create Custom Voice

```bash
POST /api/voices
```

**Request Body:**

```json
{
  "organizationId": "clx456...",
  "name": "Custom Voice 1",
  "gender": "FEMALE",
  "description": "Custom cloned voice",
  "tags": ["english", "custom", "professional"],
  "isCustom": true
}
```

### Get Single Voice

```bash
GET /api/voices/:id
```

### Update Voice

```bash
PATCH /api/voices/:id
```

**Note:** Only custom voices can be updated. System voices are read-only.

### Delete Voice

```bash
DELETE /api/voices/:id
```

**Note:** Only custom voices can be deleted.

---

## Tools API

### List Tools

```bash
GET /api/tools
```

**Query Parameters:**
- `page`, `limit` - Pagination
- `category` - Filter by category (e.g., "Integration", "CRM")
- `isConnected` (boolean) - Filter connected tools
- `search` - Search by name or description

### Create Tool

```bash
POST /api/tools
```

**Request Body:**

```json
{
  "organizationId": "clx456...",
  "name": "Google Calendar",
  "description": "Schedule appointments automatically",
  "category": "Integration",
  "logo": "https://example.com/logos/google-calendar.svg",
  "iconBgColor": "#FFFFFF"
}
```

### Get Single Tool

```bash
GET /api/tools/:id
```

Returns tool with list of connected agents.

### Update Tool

```bash
PATCH /api/tools/:id
```

### Delete Tool

```bash
DELETE /api/tools/:id
```

### Connect Tool

```bash
PATCH /api/tools/:id/connect
```

**Request Body:**

```json
{
  "configuration": {
    "apiKey": "sk_...",
    "clientId": "...",
    "clientSecret": "...",
    "accessToken": "..."
  }
}
```

**Example:**

```bash
curl -X PATCH "http://localhost:3000/api/tools/clx123/connect" \
  -H "Content-Type: application/json" \
  -d '{
    "configuration": {
      "apiKey": "your-api-key",
      "webhookUrl": "https://your-app.com/webhook"
    }
  }'
```

---

## Common Patterns

### Pagination

All list endpoints support pagination:

```bash
?page=2&limit=25
```

**Meta response:**

```json
{
  "meta": {
    "total": 100,
    "page": 2,
    "limit": 25,
    "totalPages": 4
  }
}
```

### Including Relations

Use the `include` parameter with comma-separated relation names:

```bash
?include=voice,phoneNumber,knowledgeBases,tools
```

### Date Range Filters

Use ISO 8601 format:

```bash
?startDate=2024-11-01T00:00:00Z&endDate=2024-11-30T23:59:59Z
```

Or date only:

```bash
?startDate=2024-11-01&endDate=2024-11-30
```

### Search

Most list endpoints support search:

```bash
?search=customer+support
```

Searches across multiple fields (name, description, etc.).

---

## Rate Limiting

**Development:** No rate limiting

**Production:** (To be implemented)
- 100 requests per minute per IP
- 1000 requests per hour per API key

---

## Authentication

**Current:** No authentication (development mode)

**Production:** (To be implemented)
- API Key authentication via `X-API-Key` header
- JWT tokens via `Authorization: Bearer <token>` header

---

## Testing Examples

### Complete Workflow Example

```bash
# 1. Create organization
ORG_ID=$(curl -X POST "http://localhost:3000/api/organizations" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Corp","slug":"test-corp"}' \
  | jq -r '.data.id')

# 2. Create agent
AGENT_ID=$(curl -X POST "http://localhost:3000/api/agents" \
  -H "Content-Type: application/json" \
  -d "{\"organizationId\":\"$ORG_ID\",\"name\":\"Test Agent\",\"description\":\"Test\",\"type\":\"Support\"}" \
  | jq -r '.data.id')

# 3. Create campaign
CAMPAIGN_ID=$(curl -X POST "http://localhost:3000/api/campaigns" \
  -H "Content-Type: application/json" \
  -d "{\"organizationId\":\"$ORG_ID\",\"agentId\":\"$AGENT_ID\",\"batchName\":\"Test Campaign\",\"firstSentence\":\"Hello\",\"taskPrompt\":\"Test call\"}" \
  | jq -r '.data.id')

# 4. Start campaign
curl -X POST "http://localhost:3000/api/campaigns/$CAMPAIGN_ID/start"

# 5. Get campaign status
curl "http://localhost:3000/api/campaigns/$CAMPAIGN_ID?include=recipients,callLogs"
```

---

## Error Handling Examples

### Validation Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "path": "name",
        "message": "Name must be at least 3 characters"
      }
    ]
  }
}
```

### Not Found Error

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Agent not found"
  }
}
```

### Conflict Error

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "A record with this slug already exists",
    "details": {
      "field": "slug"
    }
  }
}
```

---

## Support

For issues or questions:
- Check `DATABASE_SCHEMA.md` for data model details
- Review `DATABASE_SETUP.md` for database setup
- See example code in `prisma/seed.ts` for usage patterns

**API Version:** 1.0.0
**Last Updated:** 2025-01-20
