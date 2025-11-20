# Database Setup Guide

This guide will help you set up the PostgreSQL database with Prisma for the AI Voice Agent Platform.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn package manager

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and update the database connection strings:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_voice_platform?schema=public"
DATABASE_DIRECT_URL="postgresql://user:password@localhost:5432/ai_voice_platform?schema=public"
```

### 3. Create Database

If using a local PostgreSQL instance:

```bash
# Using psql
psql -U postgres
CREATE DATABASE ai_voice_platform;
\q
```

### 4. Run Database Migrations

```bash
npm run db:migrate
```

This will:
- Apply all migrations to your database
- Generate the Prisma Client
- Create all tables, enums, and indexes

### 5. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run db:seed
```

This creates:
- 1 Organization (Acme Corporation)
- 3 Users (Owner, Admin, Viewer)
- 3 AI Agents
- 2 Campaigns with recipients
- 5 Call Logs
- 2 Knowledge Bases with documents
- 3 System Voices
- 2 Conversation Paths
- 3 Tools (Google Calendar, Stripe, Slack)
- 3 Events
- 3 Phone Numbers
- 2 API Keys

## Development Workflow

### Generate Prisma Client

After modifying `schema.prisma`:

```bash
npm run db:generate
```

### Create New Migration

```bash
npm run db:migrate
# You'll be prompted to name the migration
```

### Push Schema Changes (Development)

For rapid prototyping without creating migrations:

```bash
npm run db:push
```

**Warning**: This is for development only. Always use migrations for production.

### Open Prisma Studio

Visual database browser:

```bash
npm run db:studio
```

This opens a web interface at http://localhost:5555

## Production Deployment

### 1. Set Production Environment Variables

```env
DATABASE_URL="postgresql://user:password@production-host:5432/ai_voice_platform?schema=public&connection_limit=10&pool_timeout=20"
DATABASE_DIRECT_URL="postgresql://user:password@production-host:5432/ai_voice_platform?schema=public"
```

**Note**: Use `DATABASE_URL` with connection pooling (PgBouncer) for app connections, and `DATABASE_DIRECT_URL` for migrations.

### 2. Run Migrations

```bash
npx prisma migrate deploy
```

This applies all pending migrations without prompts.

### 3. Generate Prisma Client

```bash
npx prisma generate
```

## Using Supabase

If using Supabase as your PostgreSQL provider:

### 1. Get Connection Strings

From your Supabase project dashboard:
- Go to Project Settings > Database
- Copy the "Connection string" (for `DATABASE_URL`)
- Use "Direct connection" for `DATABASE_DIRECT_URL`

### 2. Update .env

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DATABASE_DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

### 3. Run Migrations

```bash
npm run db:migrate
```

## Common Issues

### Issue: "P1001: Can't reach database server"

**Solution**:
- Check if PostgreSQL is running: `pg_isready`
- Verify connection string in `.env`
- Check firewall/network settings

### Issue: "Migration failed"

**Solution**:
```bash
# Reset database (development only)
npx prisma migrate reset

# Or resolve manually
npx prisma migrate resolve --applied <migration_name>
```

### Issue: "Type 'PrismaClient' is not assignable"

**Solution**:
```bash
npm run db:generate
```

### Issue: Connection pool exhausted

**Solution**:
- Increase `connection_limit` in DATABASE_URL
- Implement connection reuse in serverless functions:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for comprehensive documentation on:
- Entity relationships
- Design decisions
- Query patterns
- Security considerations
- Performance optimization

## Available NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema changes (dev only) |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Generate Prisma Client |

## Next Steps

1. Review the database schema in `prisma/schema.prisma`
2. Read the full documentation in `DATABASE_SCHEMA.md`
3. Explore the seeded data using Prisma Studio
4. Start building your API routes and connect to Prisma Client

## Support

For Prisma-specific questions, refer to:
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Discord](https://discord.gg/prisma)

For project-specific questions, see `DATABASE_SCHEMA.md` or contact the development team.
