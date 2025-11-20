import { PrismaClient } from '@prisma/client'
import { hash } from 'crypto'

const prisma = new PrismaClient()

// Helper function to hash passwords (use bcrypt in production)
function hashPassword(password: string): string {
  return hash('sha256', Buffer.from(password)).toString('hex')
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data (development only)
  console.log('🧹 Cleaning existing data...')
  await prisma.apiKey.deleteMany()
  await prisma.event.deleteMany()
  await prisma.agentTool.deleteMany()
  await prisma.agentConversationPath.deleteMany()
  await prisma.agentKnowledgeBase.deleteMany()
  await prisma.campaignRecipient.deleteMany()
  await prisma.callLog.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.knowledgeBaseDocument.deleteMany()
  await prisma.knowledgeBase.deleteMany()
  await prisma.tool.deleteMany()
  await prisma.conversationPath.deleteMany()
  await prisma.agent.deleteMany()
  await prisma.phoneNumber.deleteMany()
  await prisma.voice.deleteMany()
  await prisma.userOrganization.deleteMany()
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()

  // Create Organization
  console.log('🏢 Creating organization...')
  const organization = await prisma.organization.create({
    data: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
      plan: 'enterprise',
      credits: 10000,
    },
  })

  // Create Users
  console.log('👥 Creating users...')
  const owner = await prisma.user.create({
    data: {
      email: 'owner@acme-corp.com',
      firstName: 'Alexandra',
      lastName: 'Smith',
      phone: '+1 (555) 123-4567',
      timeZone: 'America/Los_Angeles',
      password: hashPassword('password123'),
      role: 'OWNER',
      status: 'ACTIVE',
      twoFactorEnabled: true,
    },
  })

  const admin = await prisma.user.create({
    data: {
      email: 'admin@acme-corp.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 (555) 234-5678',
      timeZone: 'America/New_York',
      password: hashPassword('password123'),
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  const viewer = await prisma.user.create({
    data: {
      email: 'viewer@acme-corp.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1 (555) 345-6789',
      timeZone: 'America/Chicago',
      password: hashPassword('password123'),
      role: 'VIEWER',
      status: 'PENDING',
    },
  })

  // Link users to organization
  console.log('🔗 Linking users to organization...')
  await prisma.userOrganization.createMany({
    data: [
      { userId: owner.id, organizationId: organization.id, role: 'OWNER' },
      { userId: admin.id, organizationId: organization.id, role: 'ADMIN' },
      { userId: viewer.id, organizationId: organization.id, role: 'VIEWER' },
    ],
  })

  // Create System Voices
  console.log('🎤 Creating voices...')
  const voices = await prisma.voice.createMany({
    data: [
      {
        name: 'June',
        gender: 'FEMALE',
        description: 'American Female voice with warm and professional tone.',
        avatar: '#9333EA',
        tags: ['english', 'american', 'female', 'professional'],
        isCustom: false,
        status: 'READY',
      },
      {
        name: 'Max',
        gender: 'MALE',
        description: 'British Male voice with smooth intonations.',
        avatar: '#22C55E',
        tags: ['english', 'british', 'male', 'smooth'],
        isCustom: false,
        status: 'READY',
      },
      {
        name: 'Keelan',
        gender: 'FEMALE',
        description: 'Canadian Engaged Professional Female voice.',
        avatar: '#7DD3FC',
        tags: ['english', 'canadian', 'female', 'warm'],
        isCustom: false,
        status: 'READY',
      },
    ],
  })

  const juneVoice = await prisma.voice.findFirst({
    where: { name: 'June' },
  })

  const maxVoice = await prisma.voice.findFirst({
    where: { name: 'Max' },
  })

  // Create Phone Numbers
  console.log('📞 Creating phone numbers...')
  const phoneNumber1 = await prisma.phoneNumber.create({
    data: {
      organizationId: organization.id,
      label: 'Support Line',
      phoneNumber: '+1 (555) 123-4567',
      inboundStatus: 'ENABLED',
      outboundStatus: 'DISABLED',
    },
  })

  const phoneNumber2 = await prisma.phoneNumber.create({
    data: {
      organizationId: organization.id,
      label: 'Sales Line',
      phoneNumber: '+1 (555) 987-6543',
      inboundStatus: 'ENABLED',
      outboundStatus: 'ENABLED',
    },
  })

  const phoneNumber3 = await prisma.phoneNumber.create({
    data: {
      organizationId: organization.id,
      label: 'Scheduling Line',
      phoneNumber: '+1 (555) 456-7890',
      inboundStatus: 'DISABLED',
      outboundStatus: 'DISABLED',
    },
  })

  // Create Knowledge Bases
  console.log('📚 Creating knowledge bases...')
  const kb1 = await prisma.knowledgeBase.create({
    data: {
      organizationId: organization.id,
      name: 'Product Documentation',
      description: 'Complete product documentation and user guides.',
      fileCount: 24,
      websiteCount: 5,
      textCount: 12,
      status: 'ACTIVE',
    },
  })

  const kb2 = await prisma.knowledgeBase.create({
    data: {
      organizationId: organization.id,
      name: 'Customer Support FAQs',
      description: 'Frequently asked questions and troubleshooting guides.',
      fileCount: 18,
      websiteCount: 3,
      textCount: 8,
      status: 'READY',
    },
  })

  // Add documents to knowledge bases
  console.log('📄 Adding documents to knowledge bases...')
  await prisma.knowledgeBaseDocument.createMany({
    data: [
      {
        knowledgeBaseId: kb1.id,
        name: 'Getting Started Guide',
        type: 'FILE',
        url: 'https://example.com/docs/getting-started.pdf',
        fileSize: 2048576,
        mimeType: 'application/pdf',
        status: 'READY',
      },
      {
        knowledgeBaseId: kb1.id,
        name: 'API Documentation',
        type: 'WEBSITE',
        url: 'https://api.example.com/docs',
        status: 'READY',
      },
      {
        knowledgeBaseId: kb2.id,
        name: 'Common Issues',
        type: 'TEXT',
        content: 'Q: How do I reset my password? A: Click on forgot password...',
        status: 'READY',
      },
    ],
  })

  // Create Conversation Paths
  console.log('🗺️ Creating conversation paths...')
  const convPath1 = await prisma.conversationPath.create({
    data: {
      organizationId: organization.id,
      name: 'Standard Support Flow',
      useCase: 'Handle general customer support inquiries',
      agentSpeech: 'Hello, thank you for calling support. How can I help you today?',
      nodes: {
        nodes: [
          { id: '1', type: 'start', label: 'Greeting' },
          { id: '2', type: 'question', label: 'Identify Issue' },
          { id: '3', type: 'action', label: 'Resolve Issue' },
          { id: '4', type: 'end', label: 'Closing' },
        ],
      },
      edges: {
        edges: [
          { from: '1', to: '2' },
          { from: '2', to: '3' },
          { from: '3', to: '4' },
        ],
      },
    },
  })

  const convPath2 = await prisma.conversationPath.create({
    data: {
      organizationId: organization.id,
      name: 'Sales Qualification',
      useCase: 'Qualify sales leads and schedule demos',
      agentSpeech:
        'Hi! I am calling to learn more about your business needs and see if our solution is a good fit.',
    },
  })

  // Create Tools
  console.log('🔧 Creating tools...')
  const tool1 = await prisma.tool.create({
    data: {
      organizationId: organization.id,
      name: 'Google Calendar',
      description: 'Connect with Google Calendar to schedule appointments automatically',
      category: 'Integration',
      logo: '/logos/google-calendar.svg',
      iconBgColor: 'bg-white/50',
      isConnected: true,
    },
  })

  const tool2 = await prisma.tool.create({
    data: {
      organizationId: organization.id,
      name: 'Stripe',
      description: 'Process payments and manage subscriptions directly from your calls',
      category: 'Integration',
      logo: '/logos/stripe.svg',
      iconBgColor: 'bg-white/50',
      isConnected: false,
    },
  })

  const tool3 = await prisma.tool.create({
    data: {
      organizationId: organization.id,
      name: 'Slack',
      description: 'Send notifications and updates to your Slack workspace in real-time',
      category: 'Integration',
      logo: '/logos/slack.svg',
      iconBgColor: 'bg-white/50',
      isConnected: true,
    },
  })

  // Create Agents
  console.log('🤖 Creating agents...')
  const agent1 = await prisma.agent.create({
    data: {
      organizationId: organization.id,
      name: 'Customer Support Agent',
      description: 'Handles customer inquiries and support requests with empathy and efficiency.',
      type: 'Inbound Support',
      status: 'ACTIVE',
      callerType: 'INBOUND',
      phoneNumberId: phoneNumber1.id,
      voiceId: juneVoice?.id,
      successRate: 94.5,
      totalCalls: 1247,
      configuration: {
        stt: { provider: 'deepgram', model: 'nova-2' },
        llm: { provider: 'openai', model: 'gpt-4-turbo' },
        tts: { provider: 'elevenlabs', voice: 'june' },
      },
    },
  })

  const agent2 = await prisma.agent.create({
    data: {
      organizationId: organization.id,
      name: 'Sales Outreach Agent',
      description: 'Proactive sales calls to potential customers with personalized pitches.',
      type: 'Outbound Sales',
      status: 'ACTIVE',
      callerType: 'OUTBOUND',
      phoneNumberId: phoneNumber2.id,
      voiceId: maxVoice?.id,
      successRate: 87.2,
      totalCalls: 856,
      configuration: {
        stt: { provider: 'deepgram', model: 'nova-2' },
        llm: { provider: 'anthropic', model: 'claude-3-5-sonnet' },
        tts: { provider: 'elevenlabs', voice: 'max' },
      },
    },
  })

  const agent3 = await prisma.agent.create({
    data: {
      organizationId: organization.id,
      name: 'Appointment Scheduler',
      description: 'Schedules and confirms appointments with customers efficiently.',
      type: 'Inbound Scheduling',
      status: 'ACTIVE',
      callerType: 'INBOUND',
      phoneNumberId: phoneNumber3.id,
      voiceId: juneVoice?.id,
      successRate: 91.8,
      totalCalls: 532,
    },
  })

  // Link agents to knowledge bases, tools, and conversation paths
  console.log('🔗 Linking agents to resources...')
  await prisma.agentKnowledgeBase.createMany({
    data: [
      { agentId: agent1.id, knowledgeBaseId: kb1.id },
      { agentId: agent1.id, knowledgeBaseId: kb2.id },
      { agentId: agent2.id, knowledgeBaseId: kb1.id },
    ],
  })

  await prisma.agentTool.createMany({
    data: [
      { agentId: agent1.id, toolId: tool1.id },
      { agentId: agent1.id, toolId: tool3.id },
      { agentId: agent2.id, toolId: tool1.id },
      { agentId: agent2.id, toolId: tool2.id },
      { agentId: agent3.id, toolId: tool1.id },
    ],
  })

  await prisma.agentConversationPath.createMany({
    data: [
      { agentId: agent1.id, conversationPathId: convPath1.id },
      { agentId: agent2.id, conversationPathId: convPath2.id },
    ],
  })

  // Create Campaigns
  console.log('📢 Creating campaigns...')
  const campaign1 = await prisma.campaign.create({
    data: {
      organizationId: organization.id,
      batchName: 'Q4 Product Launch Campaign',
      status: 'CONTINUING',
      progress: 65,
      totalCalls: 1000,
      completedCalls: 650,
      agentId: agent2.id,
      conversationPathId: convPath2.id,
      firstSentence: 'Hi! I am calling about our exciting new product launch.',
      taskPrompt: 'Qualify leads and schedule product demos for interested prospects.',
      postCallSummary: 'Log lead score and demo interest level.',
      startDate: new Date('2024-11-01'),
      startTime: '09:00',
      callStartTime: '09:00',
      callEndTime: '17:00',
    },
  })

  const campaign2 = await prisma.campaign.create({
    data: {
      organizationId: organization.id,
      batchName: 'Customer Feedback Survey',
      status: 'COMPLETED',
      progress: 100,
      totalCalls: 500,
      completedCalls: 500,
      agentId: agent1.id,
      firstSentence: 'Hello, we value your feedback and would like to ask you a few questions.',
      taskPrompt: 'Conduct customer satisfaction survey and collect feedback.',
      startDate: new Date('2024-10-01'),
      startTime: '10:00',
      callStartTime: '10:00',
      callEndTime: '18:00',
    },
  })

  // Add campaign recipients
  console.log('📋 Adding campaign recipients...')
  await prisma.campaignRecipient.createMany({
    data: [
      {
        campaignId: campaign1.id,
        name: 'John Doe',
        phoneNumber: '+1 (555) 111-2222',
        notes: 'Preferred contact time: 9 AM - 12 PM',
        status: 'READY',
      },
      {
        campaignId: campaign1.id,
        name: 'Jane Smith',
        phoneNumber: '+1 (555) 222-3333',
        notes: 'Leave voicemail if no answer',
        status: 'READY',
      },
      {
        campaignId: campaign1.id,
        name: 'Mike Johnson',
        phoneNumber: '+1 (555) 333-4444',
        notes: 'Customer since 2020, interested in premium services',
        status: 'ERROR',
      },
    ],
  })

  // Create Call Logs
  console.log('📞 Creating call logs...')
  await prisma.callLog.createMany({
    data: [
      {
        organizationId: organization.id,
        callType: 'INBOUND',
        agentId: agent1.id,
        callId: 'CALL-001',
        customer: 'John Doe',
        phoneNumber: '+1 (234) 567-8901',
        timestamp: new Date('2024-11-12T10:30:00'),
        duration: 323, // 5m 23s
        status: 'COMPLETED',
        transcript: 'Customer asked about resetting password. Agent provided step-by-step instructions.',
        recordingUrl: 'https://storage.example.com/calls/CALL-001.mp3',
      },
      {
        organizationId: organization.id,
        callType: 'OUTBOUND',
        agentId: agent2.id,
        callId: 'CALL-002',
        customer: 'Jane Smith',
        phoneNumber: '+1 (234) 567-8902',
        timestamp: new Date('2024-11-13T11:45:00'),
        duration: 192, // 3m 12s
        status: 'COMPLETED',
        campaignId: campaign1.id,
        transcript: 'Qualified lead, scheduled demo for next week.',
        recordingUrl: 'https://storage.example.com/calls/CALL-002.mp3',
      },
      {
        organizationId: organization.id,
        callType: 'INBOUND',
        agentId: agent1.id,
        callId: 'CALL-003',
        customer: 'Bob Johnson',
        phoneNumber: '+1 (234) 567-8903',
        timestamp: new Date('2024-11-14T14:15:00'),
        duration: 0,
        status: 'MISSED',
      },
      {
        organizationId: organization.id,
        callType: 'OUTBOUND',
        agentId: agent2.id,
        callId: 'CALL-004',
        customer: 'Alice Brown',
        phoneNumber: '+1 (234) 567-8904',
        timestamp: new Date('2024-11-15T15:30:00'),
        duration: 525, // 8m 45s
        status: 'COMPLETED',
        campaignId: campaign1.id,
        transcript: 'Very interested prospect, scheduled immediate follow-up.',
        recordingUrl: 'https://storage.example.com/calls/CALL-004.mp3',
      },
      {
        organizationId: organization.id,
        callType: 'INBOUND',
        agentId: agent1.id,
        callId: 'CALL-005',
        customer: 'Charlie Wilson',
        phoneNumber: '+1 (234) 567-8905',
        timestamp: new Date('2024-11-16T16:20:00'),
        duration: 138, // 2m 18s
        status: 'FAILED',
      },
    ],
  })

  // Create Events
  console.log('📡 Creating events...')
  await prisma.event.createMany({
    data: [
      {
        organizationId: organization.id,
        name: 'Customer Support Request',
        description: 'Triggered when a customer needs support assistance',
        isEnabled: true,
        agentId: agent1.id,
        webhookUrl: 'https://api.acme-corp.com/events/customer-support',
        triggerCount: 156,
      },
      {
        organizationId: organization.id,
        name: 'Sales Inquiry',
        description: 'Activated for new sales opportunities and product inquiries',
        isEnabled: true,
        agentId: agent2.id,
        webhookUrl: 'https://api.acme-corp.com/events/sales-inquiry',
        triggerCount: 89,
      },
      {
        organizationId: organization.id,
        name: 'Appointment Booking',
        description: 'Triggered when an appointment is successfully scheduled',
        isEnabled: false,
        agentId: agent3.id,
        webhookUrl: 'https://api.acme-corp.com/events/appointment-booking',
        triggerCount: 42,
      },
    ],
  })

  // Create API Keys
  console.log('🔑 Creating API keys...')
  await prisma.apiKey.createMany({
    data: [
      {
        organizationId: organization.id,
        userId: owner.id,
        name: 'Production API Key',
        key: 'sk_live_abc123def456ghi789jkl012mno345pqr678',
        status: 'ACTIVE',
      },
      {
        organizationId: organization.id,
        userId: admin.id,
        name: 'Development API Key',
        key: 'sk_test_xyz987uvw654rst321opq098lmn765ijk432',
        expirationDate: new Date('2025-05-01'),
        status: 'ACTIVE',
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - Organizations: 1`)
  console.log(`   - Users: 3 (1 owner, 1 admin, 1 viewer)`)
  console.log(`   - Agents: 3`)
  console.log(`   - Campaigns: 2`)
  console.log(`   - Call Logs: 5`)
  console.log(`   - Knowledge Bases: 2`)
  console.log(`   - Voices: 3`)
  console.log(`   - Conversation Paths: 2`)
  console.log(`   - Tools: 3`)
  console.log(`   - Events: 3`)
  console.log(`   - Phone Numbers: 3`)
  console.log(`   - API Keys: 2`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
