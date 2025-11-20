# AI Voice Agent Platform - API Integration

Production-ready REST API with PostgreSQL database integration using Prisma ORM.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your database URL
# DATABASE_URL="postgresql://user:password@localhost:5432/ai_voice_platform"
```

### 3. Setup Database

```bash
# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed

# (Optional) Open Prisma Studio
npm run db:studio
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs at **http://localhost:3000**

### 5. Test API

```bash
# List agents
curl "http://localhost:3000/api/agents" | jq

# Get organization ID
ORG_ID=$(curl -s "http://localhost:3000/api/organizations" | jq -r '.data[0].id')

# Create new agent
curl -X POST "http://localhost:3000/api/agents" \
  -H "Content-Type: application/json" \
  -d "{
    \"organizationId\":\"$ORG_ID\",
    \"name\":\"Test Agent\",
    \"description\":\"Created via API\",
    \"type\":\"Support\",
    \"callerType\":\"INBOUND\"
  }" | jq
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Complete API reference with examples |
| [API_TESTING.md](./API_TESTING.md) | Testing guide and scripts |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Database schema documentation |
| [DATABASE_SETUP.md](./DATABASE_SETUP.md) | Database setup guide |

## 🏗️ Architecture

```
├── app/api/              # API routes (Next.js 14 App Router)
│   ├── agents/           # CRUD for AI agents
│   ├── organizations/    # Organization management
│   ├── campaigns/        # Campaign management
│   ├── call-logs/        # Call history and stats
│   ├── knowledge-bases/  # RAG knowledge bases
│   ├── voices/           # TTS voice library
│   └── tools/            # External integrations
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── api-error.ts      # Error handling
│   ├── db-utils.ts       # Query utilities
│   └── validations/      # Zod schemas
├── types/
│   ├── api.ts            # API response types
│   └── database.ts       # Database types
└── prisma/
    ├── schema.prisma     # Database schema
    ├── migrations/       # SQL migrations
    └── seed.ts          # Sample data
```

## 🔑 Key Features

### ✅ Complete CRUD Operations

- **Agents**: Create, read, update, delete AI agents
- **Campaigns**: Manage calling campaigns with recipients
- **Call Logs**: Track call history and analytics
- **Knowledge Bases**: RAG document management
- **Voices**: System and custom TTS voices
- **Tools**: External service integrations

### ✅ Advanced Querying

```bash
# Pagination
?page=2&limit=25

# Filtering
?status=ACTIVE&callerType=OUTBOUND

# Search
?search=customer+support

# Include relations
?include=voice,knowledgeBases,tools

# Date range
?startDate=2024-11-01&endDate=2024-11-30
```

### ✅ Type Safety

- Full TypeScript support
- Zod input validation
- Prisma type generation
- No `any` types

### ✅ Error Handling

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

### ✅ Multi-tenancy

- Organization-based data isolation
- Row-level security
- Automatic organization filtering

## 📊 Available Endpoints

### Agents
```
GET    /api/agents                    List agents
POST   /api/agents                    Create agent
GET    /api/agents/:id                Get single agent
PATCH  /api/agents/:id                Update agent
DELETE /api/agents/:id                Delete agent
PATCH  /api/agents/:id/status         Toggle status
```

### Organizations
```
GET    /api/organizations             List organizations
POST   /api/organizations             Create organization
GET    /api/organizations/:id         Get single organization
PATCH  /api/organizations/:id         Update organization
DELETE /api/organizations/:id         Delete organization
```

### Campaigns
```
GET    /api/campaigns                 List campaigns
POST   /api/campaigns                 Create campaign
GET    /api/campaigns/:id             Get single campaign
PATCH  /api/campaigns/:id             Update campaign
DELETE /api/campaigns/:id             Delete campaign
POST   /api/campaigns/:id/start       Start campaign
POST   /api/campaigns/:id/stop        Stop campaign
```

### Call Logs
```
GET    /api/call-logs                 List call logs
POST   /api/call-logs                 Create call log
GET    /api/call-logs/:id             Get single call log
PATCH  /api/call-logs/:id             Update call log
GET    /api/call-logs/stats           Get statistics
```

### Knowledge Bases
```
GET    /api/knowledge-bases           List knowledge bases
POST   /api/knowledge-bases           Create KB
GET    /api/knowledge-bases/:id       Get single KB
PATCH  /api/knowledge-bases/:id       Update KB
DELETE /api/knowledge-bases/:id       Delete KB
POST   /api/knowledge-bases/:id/documents  Add document
```

### Voices
```
GET    /api/voices                    List voices
POST   /api/voices                    Create custom voice
GET    /api/voices/:id                Get single voice
PATCH  /api/voices/:id                Update voice
DELETE /api/voices/:id                Delete voice
```

### Tools
```
GET    /api/tools                     List tools
POST   /api/tools                     Create tool
GET    /api/tools/:id                 Get single tool
PATCH  /api/tools/:id                 Update tool
DELETE /api/tools/:id                 Delete tool
PATCH  /api/tools/:id/connect         Connect tool
```

## 🧪 Testing

### Manual Testing

```bash
# See API_TESTING.md for detailed examples
npm run dev

# In another terminal
curl "http://localhost:3000/api/agents" | jq
```

### Automated Testing

```bash
# Run test script
chmod +x test-api.sh
./test-api.sh
```

### Prisma Studio

```bash
# Visual database browser
npm run db:studio
```

Open **http://localhost:5555** in your browser.

## 🔐 Security (TODO)

Current implementation is for development only.

**Production requirements:**
- [ ] Add authentication (Clerk/NextAuth)
- [ ] Implement API key management
- [ ] Add rate limiting
- [ ] Enable CORS configuration
- [ ] Add request logging
- [ ] Implement audit trails

## 📈 Performance

### Connection Pooling

Already configured in `DATABASE_URL`:
```
postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=20
```

### Indexes

50+ strategic indexes on:
- Foreign keys
- Status fields
- Timestamps
- Search fields
- Unique constraints

### Query Optimization

- Use `select` instead of `include` when possible
- Pagination on all list endpoints (max 100 per page)
- Transaction support for multi-step operations
- Efficient aggregations for statistics

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"

```bash
npm run db:generate
```

### "Connection pool timeout"

Check PostgreSQL is running:
```bash
pg_isready
```

### "Migration failed"

Reset database (development only):
```bash
npm run db:migrate reset
```

### "Validation failed"

Check request body matches Zod schema in `lib/validations/`

## 📦 Dependencies

**Core:**
- `@prisma/client` ^6.2.0 - Database ORM
- `zod` ^4.1.12 - Schema validation

**Dev:**
- `prisma` ^6.2.0 - Prisma CLI
- `tsx` ^4.19.0 - TypeScript execution

## 🚦 NPM Scripts

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

npm run db:migrate       # Run database migrations
npm run db:push          # Push schema (dev only)
npm run db:seed          # Seed sample data
npm run db:studio        # Open Prisma Studio
npm run db:generate      # Generate Prisma Client
```

## 📝 Example Workflow

```bash
# 1. Create organization
ORG=$(curl -X POST "http://localhost:3000/api/organizations" \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo Corp","slug":"demo"}' | jq -r '.data.id')

# 2. Create agent
AGENT=$(curl -X POST "http://localhost:3000/api/agents" \
  -H "Content-Type: application/json" \
  -d "{\"organizationId\":\"$ORG\",\"name\":\"Demo Agent\",\"description\":\"Test\",\"type\":\"Support\",\"callerType\":\"INBOUND\"}" \
  | jq -r '.data.id')

# 3. Create campaign
CAMPAIGN=$(curl -X POST "http://localhost:3000/api/campaigns" \
  -H "Content-Type: application/json" \
  -d "{\"organizationId\":\"$ORG\",\"agentId\":\"$AGENT\",\"batchName\":\"Demo Campaign\",\"firstSentence\":\"Hello\",\"taskPrompt\":\"Test call\",\"recipients\":[{\"name\":\"Test\",\"phoneNumber\":\"+15551234567\"}]}" \
  | jq -r '.data.id')

# 4. Start campaign
curl -X POST "http://localhost:3000/api/campaigns/$CAMPAIGN/start"

# 5. Check status
curl "http://localhost:3000/api/campaigns/$CAMPAIGN?include=recipients,callLogs" | jq
```

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Update documentation
5. Submit PR

## 📄 License

See main project LICENSE file.

---

**Need help?** Check the documentation files or open an issue.
