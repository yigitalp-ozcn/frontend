# API Testing Guide

Quick guide for testing the API endpoints locally.

## Prerequisites

```bash
# 1. Ensure database is set up
npm run db:migrate

# 2. Seed the database with test data
npm run db:seed

# 3. Start the development server
npm run dev
```

The server will be running at `http://localhost:3000`

## Quick Tests

### Test 1: List Agents

```bash
curl "http://localhost:3000/api/agents" | jq
```

**Expected:** List of 3 agents from seed data

### Test 2: Get Single Agent with Relations

```bash
curl "http://localhost:3000/api/agents/<agent-id>?include=voice,knowledgeBases,tools" | jq
```

**Get agent ID from Test 1 response**

### Test 3: Create New Agent

```bash
curl -X POST "http://localhost:3000/api/agents" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "<org-id>",
    "name": "Test Agent",
    "description": "Created via API for testing purposes",
    "type": "Test Type",
    "callerType": "INBOUND"
  }' | jq
```

**Get organizationId from:**
```bash
curl "http://localhost:3000/api/organizations" | jq '.data[0].id'
```

### Test 4: Update Agent Status

```bash
curl -X PATCH "http://localhost:3000/api/agents/<agent-id>/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "ACTIVE"}' | jq
```

### Test 5: List Campaigns

```bash
curl "http://localhost:3000/api/campaigns?include=agent,recipients" | jq
```

### Test 6: Get Campaign Stats

```bash
# Get campaign with call logs
curl "http://localhost:3000/api/campaigns/<campaign-id>?include=callLogs" | jq
```

### Test 7: List Call Logs with Filters

```bash
curl "http://localhost:3000/api/call-logs?status=COMPLETED&callType=OUTBOUND" | jq
```

### Test 8: Get Call Statistics

```bash
# Get organization ID first
ORG_ID=$(curl "http://localhost:3000/api/organizations" | jq -r '.data[0].id')

# Get stats
curl "http://localhost:3000/api/call-logs/stats?organizationId=$ORG_ID" | jq
```

### Test 9: List Knowledge Bases with Documents

```bash
curl "http://localhost:3000/api/knowledge-bases?include=documents" | jq
```

### Test 10: Add Document to Knowledge Base

```bash
curl -X POST "http://localhost:3000/api/knowledge-bases/<kb-id>/documents" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test FAQ",
    "type": "TEXT",
    "content": "Q: How to use the API? A: See API_DOCUMENTATION.md"
  }' | jq
```

### Test 11: List Voices

```bash
# System voices only
curl "http://localhost:3000/api/voices?isCustom=false" | jq

# All voices
curl "http://localhost:3000/api/voices" | jq
```

### Test 12: Search Functionality

```bash
# Search agents
curl "http://localhost:3000/api/agents?search=customer" | jq

# Search campaigns
curl "http://localhost:3000/api/campaigns?search=product" | jq

# Search call logs
curl "http://localhost:3000/api/call-logs?search=john" | jq
```

### Test 13: Pagination

```bash
# Page 1
curl "http://localhost:3000/api/call-logs?page=1&limit=2" | jq

# Page 2
curl "http://localhost:3000/api/call-logs?page=2&limit=2" | jq
```

### Test 14: Date Range Filter

```bash
curl "http://localhost:3000/api/call-logs?startDate=2024-11-01&endDate=2024-11-30" | jq
```

### Test 15: Create Complete Workflow

```bash
#!/bin/bash

echo "=== Creating Organization ==="
ORG_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/organizations" \
  -H "Content-Type: application/json" \
  -d '{"name":"API Test Org","slug":"api-test-org"}')
ORG_ID=$(echo $ORG_RESPONSE | jq -r '.data.id')
echo "Organization ID: $ORG_ID"

echo "\n=== Creating Agent ==="
AGENT_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/agents" \
  -H "Content-Type: application/json" \
  -d "{
    \"organizationId\":\"$ORG_ID\",
    \"name\":\"API Test Agent\",
    \"description\":\"Created via API test script\",
    \"type\":\"Test Support\",
    \"callerType\":\"INBOUND\"
  }")
AGENT_ID=$(echo $AGENT_RESPONSE | jq -r '.data.id')
echo "Agent ID: $AGENT_ID"

echo "\n=== Creating Campaign ==="
CAMPAIGN_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/campaigns" \
  -H "Content-Type: application/json" \
  -d "{
    \"organizationId\":\"$ORG_ID\",
    \"agentId\":\"$AGENT_ID\",
    \"batchName\":\"API Test Campaign\",
    \"firstSentence\":\"Hello, this is a test call\",
    \"taskPrompt\":\"Test the API functionality\",
    \"recipients\":[
      {
        \"name\":\"Test User\",
        \"phoneNumber\":\"+15551234567\",
        \"notes\":\"Test recipient\"
      }
    ]
  }")
CAMPAIGN_ID=$(echo $CAMPAIGN_RESPONSE | jq -r '.data.id')
echo "Campaign ID: $CAMPAIGN_ID"

echo "\n=== Starting Campaign ==="
curl -s -X POST "http://localhost:3000/api/campaigns/$CAMPAIGN_ID/start" | jq

echo "\n=== Getting Campaign Status ==="
curl -s "http://localhost:3000/api/campaigns/$CAMPAIGN_ID?include=recipients" | jq

echo "\n=== Cleanup: Deleting Resources ==="
curl -s -X DELETE "http://localhost:3000/api/campaigns/$CAMPAIGN_ID" | jq
curl -s -X DELETE "http://localhost:3000/api/agents/$AGENT_ID" | jq
curl -s -X DELETE "http://localhost:3000/api/organizations/$ORG_ID" | jq

echo "\n=== Test Complete ==="
```

**Save as `test-api.sh` and run:**

```bash
chmod +x test-api.sh
./test-api.sh
```

## Validation Testing

### Test Invalid Input

```bash
# Missing required field
curl -X POST "http://localhost:3000/api/agents" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}' | jq

# Expected: VALIDATION_ERROR with details
```

### Test Not Found

```bash
curl "http://localhost:3000/api/agents/invalid-id" | jq

# Expected: NOT_FOUND error
```

### Test Duplicate Slug

```bash
# Create organization
curl -X POST "http://localhost:3000/api/organizations" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","slug":"test-duplicate"}' | jq

# Try to create another with same slug
curl -X POST "http://localhost:3000/api/organizations" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test2","slug":"test-duplicate"}' | jq

# Expected: CONFLICT error
```

## Performance Testing

### Test Large Dataset Pagination

```bash
# Create 50 call logs
for i in {1..50}; do
  curl -s -X POST "http://localhost:3000/api/call-logs" \
    -H "Content-Type: application/json" \
    -d "{
      \"organizationId\":\"<org-id>\",
      \"callType\":\"INBOUND\",
      \"agentId\":\"<agent-id>\",
      \"callId\":\"TEST-$i\",
      \"phoneNumber\":\"+155512345$i\",
      \"duration\":$((RANDOM % 600)),
      \"status\":\"COMPLETED\"
    }" > /dev/null
done

# Test pagination
time curl -s "http://localhost:3000/api/call-logs?page=1&limit=10" > /dev/null
time curl -s "http://localhost:3000/api/call-logs?page=5&limit=10" > /dev/null
```

## Using Postman

Import these endpoints into Postman:

1. **Create Workspace** - "AI Voice Platform API"
2. **Add Environment Variables:**
   - `baseUrl`: `http://localhost:3000/api`
   - `orgId`: (copy from GET /organizations)
   - `agentId`: (copy from GET /agents)

3. **Import Collection:**

```json
{
  "info": {
    "name": "AI Voice Platform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Agents",
      "item": [
        {
          "name": "List Agents",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/agents"
          }
        },
        {
          "name": "Create Agent",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/agents",
            "body": {
              "mode": "raw",
              "raw": "{\"organizationId\":\"{{orgId}}\",\"name\":\"Test Agent\",\"description\":\"Test\",\"type\":\"Support\",\"callerType\":\"INBOUND\"}"
            }
          }
        }
      ]
    }
  ]
}
```

## Debugging

### Enable Query Logging

In `lib/prisma.ts`, queries are already logged in development mode.

**View logs:**

```bash
npm run dev | grep -E "prisma:query"
```

### Check Database State

```bash
# Open Prisma Studio
npm run db:studio

# Or use psql
psql $DATABASE_URL
```

### View Raw API Response

```bash
curl -v "http://localhost:3000/api/agents" 2>&1 | grep -E "^< |^\{"
```

## Common Issues

### Issue: "Cannot find module '@prisma/client'"

**Solution:**
```bash
npm run db:generate
```

### Issue: "P2002: Unique constraint failed"

**Solution:** Resource already exists. Check for duplicates or use different values.

### Issue: "P2025: Record not found"

**Solution:** Verify the ID exists in the database.

### Issue: "Connection pool timeout"

**Solution:** Check DATABASE_URL and ensure PostgreSQL is running.

## Next Steps

After successful API testing:

1. Integrate with frontend components
2. Add authentication (Clerk/NextAuth)
3. Implement rate limiting
4. Add API key management
5. Set up monitoring and logging

See `API_DOCUMENTATION.md` for complete API reference.
