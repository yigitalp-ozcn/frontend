"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { PageHeader } from "@/components/page-header"
import { ChevronRight, Pencil, Check, X, Save, Trash2, PhoneIcon, PhoneOffIcon, Send, Mic, MicOff, PhoneCall, FileText, Wrench, GitBranch, SquareUser, Briefcase, ChevronDown, Clock, Phone, Shield, Radio, MessageSquare, Plus, ChevronsUpDown, Globe, Type, FolderOpen, Search, Settings, Zap, Languages, PhoneForwarded, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Orb } from "@/components/ui/orb"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ui/conversation"
import { Message, MessageContent } from "@/components/ui/message"
import { Response } from "@/components/ui/response"
import { ShimmeringText } from "@/components/ui/shimmering-text"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { VoicePicker, type Voice } from "@/components/ui/voice-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Mock data
const mockAgent = {
  id: "1",
  name: "Customer Support Agent",
  status: "active" as "active" | "inactive",
  role: "Inbound Support",
  callCount: 1247,
  documents: 24,
  tools: 5,
  conversationalPaths: 8,
}

// Mock voices data (styled like ElevenLabs but no API)
const mockVoices: Voice[] = [
  {
    voiceId: "rachel",
    name: "Rachel",
    category: "premade",
    labels: {
      accent: "american",
      descriptive: "casual",
      age: "young",
      gender: "female",
      language: "en",
      use_case: "conversational",
    },
    description: "Matter-of-fact, personable woman. Great for conversational use cases.",
  },
  {
    voiceId: "drew",
    name: "Drew",
    category: "premade",
    labels: {
      accent: "american",
      descriptive: "well-rounded",
      age: "middle_aged",
      gender: "male",
      use_case: "news",
    },
    description: "Professional and authoritative male voice, perfect for news delivery.",
  },
  {
    voiceId: "clyde",
    name: "Clyde",
    category: "premade",
    labels: {
      accent: "american",
      descriptive: "intense",
      age: "middle_aged",
      gender: "male",
      language: "en",
      use_case: "characters",
    },
    description: "Great for character use-cases with intense delivery.",
  },
  {
    voiceId: "alice",
    name: "Alice",
    category: "premade",
    labels: {
      accent: "british",
      descriptive: "friendly",
      age: "young",
      gender: "female",
      language: "en",
      use_case: "conversational",
    },
    description: "Warm and friendly British female voice for engaging conversations.",
  },
]

// Mock languages data
const mockLanguages = [
  { code: "en-US", name: "English (US)", flag: "https://flagcdn.com/w40/us.png" },
  { code: "en-GB", name: "English (UK)", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "es-ES", name: "Spanish (Spain)", flag: "https://flagcdn.com/w40/es.png" },
  { code: "fr-FR", name: "French", flag: "https://flagcdn.com/w40/fr.png" },
  { code: "de-DE", name: "German", flag: "https://flagcdn.com/w40/de.png" },
  { code: "it-IT", name: "Italian", flag: "https://flagcdn.com/w40/it.png" },
  { code: "pt-BR", name: "Portuguese (Brazil)", flag: "https://flagcdn.com/w40/br.png" },
  { code: "tr-TR", name: "Turkish", flag: "https://flagcdn.com/w40/tr.png" },
]

// Mock phone numbers data
const mockPhoneNumbers = [
  { id: "1", label: "Main Support Line", number: "+1 (555) 123-4567" },
  { id: "2", label: "Sales Line", number: "+1 (555) 234-5678" },
  { id: "3", label: "Customer Service", number: "+1 (555) 345-6789" },
]

// Mock call types data
const mockCallTypes = [
  { value: "inbound", label: "Inbound Only" },
  { value: "outbound", label: "Outbound Only" },
  { value: "both", label: "Both Ways" },
]

// Mock conversational pathways data
const mockConversationalPathways = [
  { id: "1", name: "Sales Qualification" },
  { id: "2", name: "Technical Support" },
  { id: "3", name: "Billing Inquiry" },
  { id: "4", name: "Product Information" },
  { id: "5", name: "Appointment Scheduling" },
]

// Mock knowledge bases data
const mockKnowledgeBases = [
  {
    id: "1",
    name: "Product Documentation",
    description: "Complete product documentation and guides",
    fileCount: 24,
    websiteCount: 5,
    textCount: 12,
    status: "active" as const,
  },
  {
    id: "2",
    name: "Customer Support FAQs",
    description: "Frequently asked questions and answers",
    fileCount: 18,
    websiteCount: 3,
    textCount: 8,
    status: "ready" as const,
  },
  {
    id: "3",
    name: "Sales Training Materials",
    description: "Training documents and presentations",
    fileCount: 42,
    websiteCount: 8,
    textCount: 15,
    status: "processing" as const,
  },
  {
    id: "4",
    name: "Legal Compliance Documents",
    description: "Legal documents and compliance guidelines",
    fileCount: 15,
    websiteCount: 2,
    textCount: 5,
    status: "ready" as const,
  },
]

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

export default function AgentDetailPage() {
  const router = useRouter()
  const [agentName, setAgentName] = useState(mockAgent.name)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editableName, setEditableName] = useState(mockAgent.name)
  const [isActive, setIsActive] = useState(mockAgent.status === "active")
  const [isSaved, setIsSaved] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Identity states
  const [selectedVoice, setSelectedVoice] = useState("rachel")
  const [selectedLanguage, setSelectedLanguage] = useState("en-US")
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isEditingAgentName, setIsEditingAgentName] = useState(false)
  const [editableAgentName, setEditableAgentName] = useState(mockAgent.name)
  const [isEditingAgentRole, setIsEditingAgentRole] = useState(false)
  const [editableAgentRole, setEditableAgentRole] = useState(mockAgent.role)

  // Call Configuration states
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(null)
  const [tempPhoneNumber, setTempPhoneNumber] = useState<string | null>(null)
  const [isPhoneConnected, setIsPhoneConnected] = useState(false)
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false)
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false)
  const [callType, setCallType] = useState("both")
  const [tempCallType, setTempCallType] = useState<string | null>(null)
  const [isCallTypeDropdownOpen, setIsCallTypeDropdownOpen] = useState(false)
  const [showCallTypeDialog, setShowCallTypeDialog] = useState(false)
  const [workingHoursEnabled, setWorkingHoursEnabled] = useState(false)
  const [workingHoursStart, setWorkingHoursStart] = useState("09:00")
  const [workingHoursEnd, setWorkingHoursEnd] = useState("17:00")

  // Privacy Policy states
  const [aiDisclosure, setAiDisclosure] = useState(false)
  const [recordingDisclosure, setRecordingDisclosure] = useState(false)

  // Behavior states
  const [waitForGreeting, setWaitForGreeting] = useState(false)
  const [firstMessage, setFirstMessage] = useState("Hello! How can I help you today?")
  const [systemPrompt, setSystemPrompt] = useState("")

  // Knowledge states
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<string[]>([])
  const [isAddKnowledgeDialogOpen, setIsAddKnowledgeDialogOpen] = useState(false)
  const [knowledgeSearchQuery, setKnowledgeSearchQuery] = useState("")

  const handleAddKnowledgeBase = (kbId: string) => {
    if (!selectedKnowledgeBases.includes(kbId)) {
      setSelectedKnowledgeBases([...selectedKnowledgeBases, kbId])
    }
    setIsAddKnowledgeDialogOpen(false)
    setKnowledgeSearchQuery("")
  }

  const handleRemoveKnowledgeBase = (kbId: string) => {
    setSelectedKnowledgeBases(selectedKnowledgeBases.filter(id => id !== kbId))
  }

  const filteredKnowledgeBases = mockKnowledgeBases.filter(kb =>
    !selectedKnowledgeBases.includes(kb.id) &&
    (kb.name.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()) ||
     kb.description.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()))
  )

  // Tools states
  const [enabledTools, setEnabledTools] = useState<Record<string, boolean>>({
    'end-conversation': false,
    'detect-language': false,
    'transfer-number': false,
    // Google Calendar tools
    'google-calendar-create-event': false,
    'google-calendar-list-events': false,
    'google-calendar-update-event': false,
    // Stripe tools
    'stripe-create-payment': false,
    'stripe-refund': false,
    // Slack tools
    'slack-send-message': false,
    'slack-notify-channel': false,
    // Gmail tools
    'gmail-send-email': false,
    'gmail-read-email': false,
  })

  const [openIntegrations, setOpenIntegrations] = useState<Record<string, boolean>>({
    'google-calendar': false,
    'stripe': false,
    'slack': false,
    'gmail': false,
  })

  const toggleTool = (toolId: string) => {
    setEnabledTools(prev => ({
      ...prev,
      [toolId]: !prev[toolId]
    }))
  }

  const toggleIntegration = (integrationId: string) => {
    setOpenIntegrations(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }))
  }

  // Tool configuration drawer states
  const [isToolDrawerOpen, setIsToolDrawerOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<{
    id: string
    name: string
    description: string
  } | null>(null)
  const [toolDescription, setToolDescription] = useState("")

  const openToolDrawer = (toolId: string, toolName: string) => {
    setSelectedTool({ id: toolId, name: toolName, description: toolDescription })
    setIsToolDrawerOpen(true)
  }

  const closeToolDrawer = () => {
    setIsToolDrawerOpen(false)
    setSelectedTool(null)
    setToolDescription("")
  }

  // Routing states
  const [routingRules, setRoutingRules] = useState<Array<{
    id: string
    label: string
    description: string
    pathwayId: string
    isOpen: boolean
  }>>([])

  const addRoutingRule = () => {
    const newRule = {
      id: Math.random().toString(36).substr(2, 9),
      label: "",
      description: "",
      pathwayId: "",
      isOpen: true
    }
    setRoutingRules([...routingRules, newRule])
  }

  const removeRoutingRule = (id: string) => {
    setRoutingRules(routingRules.filter(rule => rule.id !== id))
  }

  const updateRoutingRule = (id: string, field: string, value: string) => {
    setRoutingRules(routingRules.map(rule =>
      rule.id === id ? { ...rule, [field]: value } : rule
    ))
  }

  const toggleRoutingRule = (id: string) => {
    setRoutingRules(routingRules.map(rule =>
      rule.id === id ? { ...rule, isOpen: !rule.isOpen } : rule
    ))
  }

  // Conversation states
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [agentState, setAgentState] = useState<"disconnected" | "connecting" | "connected" | "disconnecting" | null>("disconnected")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [textInput, setTextInput] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const volumeRef = useRef(0)

  // Get selected voice, language, and call type
  const selectedVoiceData = mockVoices.find((v) => v.voiceId === selectedVoice)
  const selectedLanguageData = mockLanguages.find((l) => l.code === selectedLanguage)
  const selectedCallTypeData = mockCallTypes.find((ct) => ct.value === callType)

  const handleSaveName = () => {
    setAgentName(editableName)
    setIsEditingName(false)
  }

  const handleCancelEdit = () => {
    setEditableName(agentName)
    setIsEditingName(false)
  }

  const handleSave = () => {
    // Save logic here
    console.log("Saving agent...")
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleDelete = () => {
    // Delete logic here
    console.log("Deleting agent...")
    setShowDeleteDialog(false)
    router.push("/agents")
  }

  // Simulated volume animation
  useEffect(() => {
    if (agentState === "connected" && !isMuted) {
      const interval = setInterval(() => {
        volumeRef.current = Math.random() * 0.5 + 0.3
      }, 100)
      return () => clearInterval(interval)
    } else {
      volumeRef.current = 0
    }
  }, [agentState, isMuted])

  // Voice call handlers (Simulated)
  const startConversation = useCallback(async () => {
    try {
      setErrorMessage(null)
      setAgentState("connecting")
      
      // Simulate connection delay
      setTimeout(() => {
        setAgentState("connected")
        setMessages([])
        
        // Simulate initial conversation
        setTimeout(() => {
          const initialMessages: ChatMessage[] = [
            {
              role: "assistant",
              content: "Hello! Welcome to our customer support service. I'm here to assist you with any questions or concerns you may have. Whether you need help with product information, account management, technical support, or general inquiries, I'm ready to help. How can I assist you today?",
              timestamp: new Date()
            },
            {
              role: "user",
              content: "Hi! I'm interested in learning more about your services.",
              timestamp: new Date()
            },
            {
              role: "assistant",
              content: "Great! I'd be happy to tell you more about our services. We offer comprehensive solutions tailored to meet your specific needs. Could you tell me which area you're most interested in?",
              timestamp: new Date()
            },
            {
              role: "user",
              content: "I'd like to know about pricing and features.",
              timestamp: new Date()
            },
            {
              role: "assistant",
              content: "Excellent question! Our pricing is flexible and scales with your needs. We have several tiers available, each with different feature sets. Let me break down the main features for you...",
              timestamp: new Date()
            }
          ]
          setMessages(initialMessages)
        }, 800)
      }, 1500)
    } catch (error) {
      console.error("Error starting conversation:", error)
      setAgentState("disconnected")
      setErrorMessage("Failed to start conversation.")
    }
  }, [])

  const handleCall = useCallback(() => {
    if (agentState === "disconnected" || agentState === null) {
      startConversation()
    } else if (agentState === "connected") {
      setAgentState("disconnecting")
      setTimeout(() => {
        setAgentState("disconnected")
        setMessages([])
      }, 500)
    }
  }, [agentState, startConversation])

  const handleSendMessage = useCallback(() => {
    if (!textInput.trim() || agentState !== "connected") return

    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: textInput,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = textInput
    setTextInput("")

    // Simulate AI typing and response with longer, more realistic responses
    const responses = [
      `Thank you for reaching out! I understand you mentioned "${currentInput}". Let me help you with that. Based on what you've shared, I can provide several options and recommendations that might be useful for your situation.`,
      `That's a great question about "${currentInput}". From my experience, there are multiple approaches we could take here. First, let me explain the most common solution, and then I'll walk you through some alternatives that might better suit your specific needs.`,
      `I appreciate you bringing up "${currentInput}". This is actually a topic I help customers with quite frequently. Let me break this down into a few key points that should clarify things for you and help you move forward with confidence.`,
      `Thanks for sharing that information. Regarding "${currentInput}", I'd like to provide you with a comprehensive answer. There are several important factors to consider, and I'll make sure to cover each one so you have a complete understanding.`,
      `I see you're asking about "${currentInput}". Let me help you navigate this. Based on similar situations I've encountered, I can suggest a step-by-step approach that has proven effective. Would you like me to walk you through the process?`,
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: "assistant",
        content: randomResponse,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1500 + Math.random() * 2000)
  }, [textInput, agentState])

  const getInputVolume = useCallback(() => {
    return agentState === "connected" && !isMuted ? volumeRef.current : 0
  }, [agentState, isMuted])

  const getOutputVolume = useCallback(() => {
    return agentState === "connected" ? volumeRef.current * 0.8 : 0
  }, [agentState])

  const isCallActive = agentState === "connected"
  const isTransitioning = agentState === "connecting" || agentState === "disconnecting"

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => router.push("/agents")}
            >
              Agents
            </span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            {isEditingName ? (
                <div className="flex items-center gap-2">
                      <Input
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                  className="h-8 w-[250px]"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                      handleSaveName()
                          } else if (e.key === 'Escape') {
                      handleCancelEdit()
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 shrink-0"
                  onClick={handleSaveName}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 shrink-0"
                  onClick={handleCancelEdit}
                      >
                        <X className="h-3 w-3" />
                      </Button>
              </div>
                  ) : (
                    <>
                <span>{agentName}</span>
                      <button
                  onClick={() => setIsEditingName(true)}
                        className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground h-4 w-4 shrink-0"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>
        }
        actions={
          <div className="flex items-center gap-3">
            {/* Active Toggle */}
                <div className="flex items-center gap-2">
              <Label htmlFor="active-toggle" className="text-sm font-normal cursor-pointer">
                Active
              </Label>
              <Switch
                id="active-toggle"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>

            {/* Save Button */}
                      <Button
              size="sm"
              className="gap-2"
              onClick={handleSave}
              variant="outline"
            >
              {isSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved
                    </>
                  ) : (
                    <>
                  <Save className="h-4 w-4" />
                  Save
                    </>
                  )}
            </Button>

            {/* Delete Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive-outline"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Agent</TooltipContent>
            </Tooltip>
          </div>
        }
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the agent &quot;{agentName}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 lg:items-start">
        {/* Left Panel */}
        <div className="flex-[7] flex flex-col min-w-0 rounded-lg border overflow-hidden min-h-full">
          <Tabs defaultValue="general" className="w-full flex-1 flex flex-col">
            <div className="px-4 pt-4">
              <TabsList className="w-full">
                <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
                <TabsTrigger value="prompt" className="flex-1">Behavior</TabsTrigger>
                <TabsTrigger value="knowledge" className="flex-1">Knowledge</TabsTrigger>
                <TabsTrigger value="tools" className="flex-1">Tools</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="general" className="mt-0 p-6 space-y-6">
                {/* Agent Info Section */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Agent Avatar & Info */}
                    <div className="flex items-center gap-3">
                      <div className="relative size-14">
                        <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                          <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
                            <Orb className="h-full w-full" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-lg font-semibold">{agentName}</h2>
                        <p className="text-sm text-muted-foreground">{mockAgent.role}</p>
                      </div>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.callCount}</span>
                        <span className="text-muted-foreground">Calls</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.documents}</span>
                        <span className="text-muted-foreground">Docs</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.tools}</span>
                        <span className="text-muted-foreground">Tools</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.conversationalPaths}</span>
                        <span className="text-muted-foreground">Paths</span>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </div>

                {/* Identity Section */}
                <div className="space-y-3">
                  <div>
                    <h2 className="text-base font-semibold">Identity</h2>
                    <p className="text-sm text-muted-foreground">Configure your agent's basic identity and voice settings</p>
                  </div>

                  {/* Agent Name */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="rounded-md bg-muted p-2 shrink-0">
                        <SquareUser className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Agent Name</p>
                        {isEditingAgentName ? (
                          <div className="flex items-center gap-1">
                            <Input
                              value={editableAgentName}
                              onChange={(e) => setEditableAgentName(e.target.value)}
                              className="h-7 text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setAgentName(editableAgentName)
                                  setIsEditingAgentName(false)
                                } else if (e.key === 'Escape') {
                                  setEditableAgentName(agentName)
                                  setIsEditingAgentName(false)
                                }
                              }}
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 shrink-0"
                              onClick={() => {
                                setAgentName(editableAgentName)
                                setIsEditingAgentName(false)
                              }}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 shrink-0"
                              onClick={() => {
                                setEditableAgentName(agentName)
                                setIsEditingAgentName(false)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm font-medium truncate">{agentName}</p>
                        )}
                      </div>
                    </div>
                    {!isEditingAgentName && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => setIsEditingAgentName(true)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  <Separator />

                  {/* Agent Role */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="rounded-md bg-muted p-2 shrink-0">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Agent Role</p>
                        {isEditingAgentRole ? (
                          <div className="flex items-center gap-1">
                            <Input
                              value={editableAgentRole}
                              onChange={(e) => setEditableAgentRole(e.target.value)}
                              className="h-7 text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setIsEditingAgentRole(false)
                                } else if (e.key === 'Escape') {
                                  setEditableAgentRole(mockAgent.role)
                                  setIsEditingAgentRole(false)
                                }
                              }}
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 shrink-0"
                              onClick={() => setIsEditingAgentRole(false)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 shrink-0"
                              onClick={() => {
                                setEditableAgentRole(mockAgent.role)
                                setIsEditingAgentRole(false)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm font-medium truncate">{editableAgentRole}</p>
                        )}
                      </div>
                    </div>
                    {!isEditingAgentRole && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => setIsEditingAgentRole(true)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  <Separator />

                  {/* Language */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="shrink-0 w-10 flex items-center justify-center">
                        <img
                          src={selectedLanguageData?.flag}
                          alt={selectedLanguageData?.name}
                          className="w-8 h-6 object-cover rounded"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Language</p>
                        <p className="text-sm font-medium truncate">{selectedLanguageData?.name}</p>
                      </div>
                    </div>
                    <Popover open={isLanguageDropdownOpen} onOpenChange={setIsLanguageDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-0" align="end">
                        <Command>
                          <CommandInput placeholder="Search language..." />
                          <CommandList>
                            <CommandEmpty>No language found.</CommandEmpty>
                            <CommandGroup>
                              {mockLanguages.map((language) => (
                                <CommandItem
                                  key={language.code}
                                  value={language.code}
                                  onSelect={() => {
                                    setSelectedLanguage(language.code)
                                    setIsLanguageDropdownOpen(false)
                                  }}
                                >
                                  <img
                                    src={language.flag}
                                    alt={language.name}
                                    className="w-6 h-4 object-cover rounded mr-3"
                                  />
                                  <span className="flex-1">{language.name}</span>
                                  {selectedLanguage === language.code && (
                                    <Check className="h-4 w-4" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Separator />

                  {/* Voice */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="shrink-0 w-10 flex items-center justify-center">
                        <Orb className="w-8 h-8" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Voice</p>
                        <p className="text-sm font-medium truncate">{selectedVoiceData?.name}</p>
                      </div>
                    </div>
                    <Popover open={isVoiceDropdownOpen} onOpenChange={setIsVoiceDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-0" align="end">
                        <Command>
                          <CommandInput placeholder="Search voice..." />
                          <CommandList>
                            <CommandEmpty>No voice found.</CommandEmpty>
                            <CommandGroup>
                              {mockVoices.map((voice) => (
                                <CommandItem
                                  key={voice.voiceId}
                                  value={voice.voiceId}
                                  onSelect={() => {
                                    setSelectedVoice(voice.voiceId)
                                    setIsVoiceDropdownOpen(false)
                                  }}
                                  className="flex items-center gap-3 py-2"
                                >
                                  <div className="shrink-0 w-10 flex items-center justify-center">
                                    <Orb className="w-8 h-8" />
                                  </div>
                                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm truncate">{voice.name}</span>
                                      {voice.labels?.gender && (
                                        <span className="text-xs text-muted-foreground shrink-0">
                                          ({voice.labels.gender})
                                        </span>
                                      )}
                                    </div>
                                    {voice.description && (
                                      <p className="text-xs text-muted-foreground line-clamp-1">
                                        {voice.description}
                                      </p>
                                    )}
                                  </div>
                                  {selectedVoice === voice.voiceId && (
                                    <Check className="h-4 w-4 shrink-0" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Call Configuration Section */}
                <div className="space-y-3">
                  <div>
                    <h2 className="text-base font-semibold">Call Configuration</h2>
                    <p className="text-sm text-muted-foreground">Configure phone number, call type, and working hours for this agent</p>
                  </div>

                  {/* Phone Number */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="rounded-md bg-muted p-2 shrink-0">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Phone Number</p>
                        {selectedPhoneNumber ? (
                          <p className="text-sm font-medium truncate">
                            {mockPhoneNumbers.find(p => p.id === selectedPhoneNumber)?.number}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">Not connected</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant={isPhoneConnected ? "destructive-outline" : "default"}
                        size="sm"
                        className="h-7"
                        onClick={() => {
                          if (isPhoneConnected) {
                            setShowDisconnectDialog(true)
                          } else {
                            setIsPhoneDialogOpen(true)
                          }
                        }}
                      >
                        {isPhoneConnected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </div>

                  {/* Disconnect Confirmation Dialog */}
                  <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Disconnect Phone Number?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Disconnecting this phone number may affect active campaigns and ongoing calls. Are you sure you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            setIsPhoneConnected(false)
                            setSelectedPhoneNumber(null)
                            setShowDisconnectDialog(false)
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Disconnect
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* Phone Number Selection Dialog */}
                  <Dialog open={isPhoneDialogOpen} onOpenChange={setIsPhoneDialogOpen}>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Connect Phone Number</DialogTitle>
                        <DialogDescription>
                          Select a phone number to connect to this agent.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 py-4">
                        {mockPhoneNumbers.map((phone) => (
                          <Button
                            key={phone.id}
                            variant={tempPhoneNumber === phone.id ? "default" : "outline"}
                            className="w-full justify-start h-auto py-3"
                            onClick={() => setTempPhoneNumber(phone.id)}
                          >
                            <div className="flex flex-col items-start gap-1 text-left">
                              <span className="font-medium">{phone.label}</span>
                              <span className="text-xs text-muted-foreground">{phone.number}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                      <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setTempPhoneNumber(null)
                            setIsPhoneDialogOpen(false)
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={!tempPhoneNumber}
                          onClick={() => {
                            if (tempPhoneNumber) {
                              setSelectedPhoneNumber(tempPhoneNumber)
                              setIsPhoneConnected(true)
                              setTempPhoneNumber(null)
                              setIsPhoneDialogOpen(false)
                            }
                          }}
                        >
                          Connect
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Separator />

                  {/* Call Type */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="rounded-md bg-muted p-2 shrink-0">
                        <PhoneCall className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Call Type</p>
                        <p className="text-sm font-medium truncate">{selectedCallTypeData?.label}</p>
                      </div>
                    </div>
                    <Popover open={isCallTypeDropdownOpen} onOpenChange={setIsCallTypeDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="end">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {mockCallTypes.map((type) => (
                                <CommandItem
                                  key={type.value}
                                  value={type.value}
                                  onSelect={() => {
                                    if (type.value !== callType) {
                                      setTempCallType(type.value)
                                      setShowCallTypeDialog(true)
                                      setIsCallTypeDropdownOpen(false)
                                    }
                                  }}
                                >
                                  <span className="flex-1">{type.label}</span>
                                  {callType === type.value && (
                                    <Check className="h-4 w-4" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Call Type Change Confirmation Dialog */}
                  <AlertDialog open={showCallTypeDialog} onOpenChange={setShowCallTypeDialog}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Change Call Type?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Changing the call type may affect active campaigns and call routing. This could impact ongoing operations. Are you sure you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setTempCallType(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (tempCallType) {
                              setCallType(tempCallType)
                              setTempCallType(null)
                            }
                            setShowCallTypeDialog(false)
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Privacy Policy Section */}
                <div className="space-y-3">
                  <div>
                    <h2 className="text-base font-semibold">Privacy Policy</h2>
                    <p className="text-sm text-muted-foreground">Configure disclosure settings for calls</p>
                  </div>

                  {/* AI Disclosure */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="rounded-md bg-muted p-2 shrink-0">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="text-sm font-medium">AI Disclosure</p>
                        <p className="text-xs text-muted-foreground">
                          Inform callers that they are speaking with an AI agent
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={aiDisclosure}
                      onCheckedChange={setAiDisclosure}
                    />
                  </div>

                  <Separator />

                  {/* Recording Disclosure */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="rounded-md bg-muted p-2 shrink-0">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="text-sm font-medium">Recording Disclosure</p>
                        <p className="text-xs text-muted-foreground">
                          Notify callers that the conversation is being recorded
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={recordingDisclosure}
                      onCheckedChange={setRecordingDisclosure}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="prompt" className="mt-0 p-6 space-y-6">
                {/* Agent Info Section */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Agent Avatar & Info */}
                    <div className="flex items-center gap-3">
                      <div className="relative size-14">
                        <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                          <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
                            <Orb className="h-full w-full" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-lg font-semibold">{agentName}</h2>
                        <p className="text-sm text-muted-foreground">{mockAgent.role}</p>
                      </div>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.callCount}</span>
                        <span className="text-muted-foreground">Calls</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.documents}</span>
                        <span className="text-muted-foreground">Docs</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.tools}</span>
                        <span className="text-muted-foreground">Tools</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.conversationalPaths}</span>
                        <span className="text-muted-foreground">Paths</span>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </div>

                {/* General Section */}
                <div className="space-y-3">
                  <div>
                    <h2 className="text-base font-semibold">General</h2>
                    <p className="text-sm text-muted-foreground">Configure how your agent initiates and handles conversations</p>
                  </div>

                  {/* Wait for Greeting */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="rounded-md bg-muted p-2 shrink-0">
                        <PhoneCall className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="text-sm font-medium">Wait for Greeting</p>
                        <p className="text-xs text-muted-foreground">
                          Wait for the user to speak first before responding
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={waitForGreeting}
                      onCheckedChange={setWaitForGreeting}
                    />
                  </div>

                  <Separator />

                  {/* First Message */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-muted p-2 shrink-0">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <Label htmlFor="first-message" className="text-sm font-medium">
                          First Message
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          The initial message your agent will send to start the conversation
                        </p>
                      </div>
                    </div>
                    <Textarea
                      id="first-message"
                      value={firstMessage}
                      onChange={(e) => setFirstMessage(e.target.value)}
                      disabled={waitForGreeting}
                      placeholder="Enter the first message..."
                      className="min-h-[80px] resize-none w-full"
                    />
                  </div>

                  <Separator />

                  {/* System Prompt */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-muted p-2 shrink-0">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <Label htmlFor="system-prompt" className="text-sm font-medium">
                          System Prompt
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Define your agent's personality, role, and behavior guidelines
                        </p>
                      </div>
                    </div>
                    <Textarea
                      id="system-prompt"
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      placeholder="Enter the system prompt..."
                      className="min-h-[200px] resize-y font-mono text-xs w-full"
                    />
                  </div>
                </div>

                {/* Routing Section */}
                <div className="space-y-3">
                  <div>
                    <h2 className="text-base font-semibold">Routing</h2>
                    <p className="text-sm text-muted-foreground">
                      Define conditions that direct the agent to specific conversational pathways based on user intent or context
                    </p>
                  </div>

                  {routingRules.map((rule, index) => (
                    <div key={rule.id} className="rounded-lg border p-3">
                      <Collapsible open={rule.isOpen} onOpenChange={() => toggleRoutingRule(rule.id)}>
                        <div className="flex items-center gap-2">
                          <div className="rounded-md bg-muted p-2 shrink-0">
                            <GitBranch className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex-1 justify-between hover:bg-transparent">
                              <span className="text-sm font-medium">
                                {rule.label || `Routing Rule ${index + 1}`}
                              </span>
                              <ChevronsUpDown className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <Button
                            variant="destructive-outline"
                            size="icon"
                            className="h-7 w-7 shrink-0"
                            onClick={() => removeRoutingRule(rule.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <CollapsibleContent className="space-y-3 pt-3">
                          <div className="space-y-2">
                            <div className="flex flex-col gap-0.5">
                              <Label htmlFor={`condition-label-${rule.id}`} className="text-sm font-medium">
                                Condition Label
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                A short name for this routing condition
                              </p>
                            </div>
                            <Input
                              id={`condition-label-${rule.id}`}
                              value={rule.label}
                              onChange={(e) => updateRoutingRule(rule.id, 'label', e.target.value)}
                              placeholder="e.g., Product Inquiry"
                              className="h-9 w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex flex-col gap-0.5">
                              <Label htmlFor={`condition-description-${rule.id}`} className="text-sm font-medium">
                                Condition Description
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Describe when this routing should be triggered
                              </p>
                            </div>
                            <Textarea
                              id={`condition-description-${rule.id}`}
                              value={rule.description}
                              onChange={(e) => updateRoutingRule(rule.id, 'description', e.target.value)}
                              placeholder="e.g., When the user asks about product features or pricing"
                              className="min-h-[80px] resize-y text-sm w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex flex-col gap-0.5">
                              <Label htmlFor={`pathway-${rule.id}`} className="text-sm font-medium">
                                Conversational Pathway
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Select the pathway to activate for this condition
                              </p>
                            </div>
                            <Select
                              value={rule.pathwayId}
                              onValueChange={(value) => updateRoutingRule(rule.id, 'pathwayId', value)}
                            >
                              <SelectTrigger id={`pathway-${rule.id}`} className="w-full">
                                <SelectValue placeholder="Select a pathway" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockConversationalPathways.map((pathway) => (
                                  <SelectItem key={pathway.id} value={pathway.id}>
                                    {pathway.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}

                  {routingRules.length > 0 && <Separator />}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={addRoutingRule}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Routing
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="knowledge" className="mt-0 p-6 space-y-6">
                {/* Agent Info Section */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Agent Avatar & Info */}
                    <div className="flex items-center gap-3">
                      <div className="relative size-14">
                        <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                          <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
                            <Orb className="h-full w-full" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-lg font-semibold">{agentName}</h2>
                        <p className="text-sm text-muted-foreground">{mockAgent.role}</p>
                      </div>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.callCount}</span>
                        <span className="text-muted-foreground">Calls</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.documents}</span>
                        <span className="text-muted-foreground">Docs</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.tools}</span>
                        <span className="text-muted-foreground">Tools</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.conversationalPaths}</span>
                        <span className="text-muted-foreground">Paths</span>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </div>

                {/* Knowledge Bases Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold">Knowledge Bases</h2>
                      <p className="text-sm text-muted-foreground">
                        Connect knowledge bases to provide context and information to your agent
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/knowledge-bases')}
                      >
                        Manage Knowledge Bases
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddKnowledgeDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Knowledge Base
                      </Button>
                    </div>
                  </div>

                  {selectedKnowledgeBases.length === 0 ? (
                    <div className="rounded-lg border border-dashed py-12 px-4 text-center">
                      <div className="flex flex-col items-center gap-2 max-w-md mx-auto">
                        <div className="rounded-full bg-muted p-3">
                          <FolderOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">No Knowledge Bases Added</p>
                          <p className="text-xs text-muted-foreground">
                            Add knowledge bases to provide your agent with information and context
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {selectedKnowledgeBases.map((kbId) => {
                        const kb = mockKnowledgeBases.find(k => k.id === kbId)
                        if (!kb) return null

                        return (
                          <div key={kb.id} className="rounded-lg border p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate">{kb.name}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                  {kb.description}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`shrink-0 gap-1.5 ${
                                  kb.status === "active"
                                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                                    : kb.status === "processing"
                                    ? "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
                                    : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    kb.status === "active"
                                      ? "bg-green-600 dark:bg-green-500"
                                      : kb.status === "processing"
                                      ? "bg-yellow-600 dark:bg-yellow-500"
                                      : "bg-blue-600 dark:bg-blue-500"
                                  }`}
                                ></span>
                                {kb.status === "active" ? "Active" : kb.status === "processing" ? "Processing" : "Ready"}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5" />
                                <span>{kb.fileCount} files</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Globe className="h-3.5 w-3.5" />
                                <span>{kb.websiteCount} sites</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Type className="h-3.5 w-3.5" />
                                <span>{kb.textCount} texts</span>
                              </div>
                            </div>

                            <Button
                              variant="destructive-outline"
                              size="sm"
                              className="w-full"
                              onClick={() => handleRemoveKnowledgeBase(kb.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Remove
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Add Knowledge Base Dialog */}
                <Dialog open={isAddKnowledgeDialogOpen} onOpenChange={(open) => {
                  setIsAddKnowledgeDialogOpen(open)
                  if (!open) setKnowledgeSearchQuery("")
                }}>
                  <DialogContent className="max-w-2xl max-h-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add Knowledge Base</DialogTitle>
                      <DialogDescription>
                        Select a knowledge base to add to this agent
                      </DialogDescription>
                    </DialogHeader>

                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search knowledge bases..."
                        value={knowledgeSearchQuery}
                        onChange={(e) => setKnowledgeSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    <div className="grid gap-3 overflow-y-auto max-h-[400px]">
                      {filteredKnowledgeBases.map((kb) => (
                          <button
                            key={kb.id}
                            onClick={() => handleAddKnowledgeBase(kb.id)}
                            className="rounded-lg border p-4 text-left hover:bg-accent transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate">{kb.name}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                  {kb.description}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`shrink-0 gap-1.5 ${
                                  kb.status === "active"
                                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                                    : kb.status === "processing"
                                    ? "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
                                    : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    kb.status === "active"
                                      ? "bg-green-600 dark:bg-green-500"
                                      : kb.status === "processing"
                                      ? "bg-yellow-600 dark:bg-yellow-500"
                                      : "bg-blue-600 dark:bg-blue-500"
                                  }`}
                                ></span>
                                {kb.status === "active" ? "Active" : kb.status === "processing" ? "Processing" : "Ready"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5" />
                                <span>{kb.fileCount} files</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Globe className="h-3.5 w-3.5" />
                                <span>{kb.websiteCount} sites</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Type className="h-3.5 w-3.5" />
                                <span>{kb.textCount} texts</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      {filteredKnowledgeBases.length === 0 && (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                          {knowledgeSearchQuery
                            ? `No knowledge bases found matching "${knowledgeSearchQuery}"`
                            : "All knowledge bases have been added"}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              <TabsContent value="tools" className="mt-0 p-6 space-y-6">
                {/* Agent Info Section */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Agent Avatar & Info */}
                    <div className="flex items-center gap-3">
                      <div className="relative size-14">
                        <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                          <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
                            <Orb className="h-full w-full" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-lg font-semibold">{agentName}</h2>
                        <p className="text-sm text-muted-foreground">{mockAgent.role}</p>
                      </div>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.callCount}</span>
                        <span className="text-muted-foreground">Calls</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.documents}</span>
                        <span className="text-muted-foreground">Docs</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.tools}</span>
                        <span className="text-muted-foreground">Tools</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.conversationalPaths}</span>
                        <span className="text-muted-foreground">Paths</span>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </div>

                {/* System Tools Section */}
                <div className="space-y-3">
                  <div>
                    <h2 className="text-base font-semibold">System Tools</h2>
                    <p className="text-sm text-muted-foreground">
                      Built-in tools for conversation management
                    </p>
                  </div>

                  <div className="space-y-2">
                    {/* End Conversation */}
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="rounded-md bg-muted p-2 shrink-0">
                            <PhoneOffIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">End Conversation</p>
                            <p className="text-xs text-muted-foreground">
                              Allow the agent to end the conversation when appropriate
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {enabledTools['end-conversation'] && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openToolDrawer('end-conversation', 'end_call')}
                            >
                              <Settings className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Switch
                            checked={enabledTools['end-conversation']}
                            onCheckedChange={() => toggleTool('end-conversation')}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Detect Language */}
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="rounded-md bg-muted p-2 shrink-0">
                            <Languages className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Detect Language</p>
                            <p className="text-xs text-muted-foreground">
                              Automatically detect and adapt to caller's language
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Switch
                            checked={enabledTools['detect-language']}
                            onCheckedChange={() => toggleTool('detect-language')}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Transfer to Number */}
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="rounded-md bg-muted p-2 shrink-0">
                            <PhoneForwarded className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Transfer to Number</p>
                            <p className="text-xs text-muted-foreground">
                              Transfer calls to a specific phone number
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {enabledTools['transfer-number'] && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openToolDrawer('transfer-number', 'transfer_call')}
                            >
                              <Settings className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Switch
                            checked={enabledTools['transfer-number']}
                            onCheckedChange={() => toggleTool('transfer-number')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Integrations Section */}
                <div className="space-y-3">
                  <div>
                    <h2 className="text-base font-semibold">Integrations</h2>
                    <p className="text-sm text-muted-foreground">
                      Connect with external services and APIs
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Google Calendar Integration */}
                    <Collapsible
                      open={openIntegrations['google-calendar']}
                      onOpenChange={() => toggleIntegration('google-calendar')}
                    >
                      <div className="rounded-lg border">
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 min-w-10 min-h-10 rounded-md bg-white/50 dark:bg-white/5 flex items-center justify-center p-2 border shrink-0">
                                <div className="relative w-6 h-6">
                                  <Image
                                    src="/logos/google-calendar.svg"
                                    alt="Google Calendar logo"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">Google Calendar</p>
                                <p className="text-xs text-muted-foreground">
                                  Schedule and manage appointments
                                </p>
                              </div>
                            </div>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-transparent">
                                <ChevronsUpDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>

                        <CollapsibleContent>
                          <div className="border-t">
                            <div className="p-3 space-y-2">
                              {/* Create Event Tool */}
                              <div className="rounded-lg border p-3 bg-muted/30">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">Create Event</p>
                                    <p className="text-xs text-muted-foreground">
                                      Create new calendar events
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {enabledTools['google-calendar-create-event'] && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => openToolDrawer('google-calendar-create-event', 'create_event')}
                                      >
                                        <Settings className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                    <Switch
                                      checked={enabledTools['google-calendar-create-event']}
                                      onCheckedChange={() => toggleTool('google-calendar-create-event')}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* List Events Tool */}
                              <div className="rounded-lg border p-3 bg-muted/30">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">List Events</p>
                                    <p className="text-xs text-muted-foreground">
                                      View upcoming calendar events
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {enabledTools['google-calendar-list-events'] && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => openToolDrawer('google-calendar-list-events', 'list_events')}
                                      >
                                        <Settings className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                    <Switch
                                      checked={enabledTools['google-calendar-list-events']}
                                      onCheckedChange={() => toggleTool('google-calendar-list-events')}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Update Event Tool */}
                              <div className="rounded-lg border p-3 bg-muted/30">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">Update Event</p>
                                    <p className="text-xs text-muted-foreground">
                                      Modify existing calendar events
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {enabledTools['google-calendar-update-event'] && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => openToolDrawer('google-calendar-update-event', 'update_event')}
                                      >
                                        <Settings className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                    <Switch
                                      checked={enabledTools['google-calendar-update-event']}
                                      onCheckedChange={() => toggleTool('google-calendar-update-event')}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>

                    {/* Stripe Integration */}
                    <Collapsible
                      open={openIntegrations['stripe']}
                      onOpenChange={() => toggleIntegration('stripe')}
                    >
                      <div className="rounded-lg border">
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 min-w-10 min-h-10 rounded-md bg-white/50 dark:bg-white/5 flex items-center justify-center p-2 border shrink-0">
                                <div className="relative w-6 h-6">
                                  <Image
                                    src="/logos/stripe.svg"
                                    alt="Stripe logo"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">Stripe</p>
                                <p className="text-xs text-muted-foreground">
                                  Process payments and manage subscriptions
                                </p>
                              </div>
                            </div>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-transparent">
                                <ChevronsUpDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>

                        <CollapsibleContent>
                          <div className="border-t">
                            <div className="p-3 space-y-2">
                              {/* Create Payment Tool */}
                              <div className="rounded-lg border p-3 bg-muted/30">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">Create Payment</p>
                                    <p className="text-xs text-muted-foreground">
                                      Process customer payments
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {enabledTools['stripe-create-payment'] && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => openToolDrawer('stripe-create-payment', 'create_payment')}
                                      >
                                        <Settings className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                    <Switch
                                      checked={enabledTools['stripe-create-payment']}
                                      onCheckedChange={() => toggleTool('stripe-create-payment')}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Refund Tool */}
                              <div className="rounded-lg border p-3 bg-muted/30">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">Process Refund</p>
                                    <p className="text-xs text-muted-foreground">
                                      Issue refunds to customers
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {enabledTools['stripe-refund'] && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => openToolDrawer('stripe-refund', 'process_refund')}
                                      >
                                        <Settings className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                    <Switch
                                      checked={enabledTools['stripe-refund']}
                                      onCheckedChange={() => toggleTool('stripe-refund')}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>

                    {/* Slack Integration */}
                    <Collapsible
                      open={openIntegrations['slack']}
                      onOpenChange={() => toggleIntegration('slack')}
                    >
                      <div className="rounded-lg border">
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 min-w-10 min-h-10 rounded-md bg-white/50 dark:bg-white/5 flex items-center justify-center p-2 border shrink-0">
                                <div className="relative w-6 h-6">
                                  <Image
                                    src="/logos/slack.svg"
                                    alt="Slack logo"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">Slack</p>
                                <p className="text-xs text-muted-foreground">
                                  Send notifications to your workspace
                                </p>
                              </div>
                            </div>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-transparent">
                                <ChevronsUpDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>

                        <CollapsibleContent>
                          <div className="border-t">
                            <div className="p-3 space-y-2">
                              {/* Send Message Tool */}
                              <div className="rounded-lg border p-3 bg-muted/30">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">Send Message</p>
                                    <p className="text-xs text-muted-foreground">
                                      Send direct messages to users
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {enabledTools['slack-send-message'] && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => openToolDrawer('slack-send-message', 'send_message')}
                                      >
                                        <Settings className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                    <Switch
                                      checked={enabledTools['slack-send-message']}
                                      onCheckedChange={() => toggleTool('slack-send-message')}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Notify Channel Tool */}
                              <div className="rounded-lg border p-3 bg-muted/30">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">Notify Channel</p>
                                    <p className="text-xs text-muted-foreground">
                                      Post updates to channels
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {enabledTools['slack-notify-channel'] && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => openToolDrawer('slack-notify-channel', 'notify_channel')}
                                      >
                                        <Settings className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                    <Switch
                                      checked={enabledTools['slack-notify-channel']}
                                      onCheckedChange={() => toggleTool('slack-notify-channel')}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>

                    {/* Gmail Integration */}
                    <Collapsible
                      open={openIntegrations['gmail']}
                      onOpenChange={() => toggleIntegration('gmail')}
                    >
                      <div className="rounded-lg border">
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 min-w-10 min-h-10 rounded-md bg-white/50 dark:bg-white/5 flex items-center justify-center p-2 border shrink-0">
                                <div className="relative w-6 h-6">
                                  <Image
                                    src="/logos/gmail.svg"
                                    alt="Gmail logo"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">Gmail</p>
                                <p className="text-xs text-muted-foreground">
                                  Send and manage emails
                                </p>
                              </div>
                            </div>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-transparent">
                                <ChevronsUpDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>

                        <CollapsibleContent>
                          <div className="border-t">
                            <div className="p-3 space-y-2">
                              {/* Send Email Tool */}
                              <div className="rounded-lg border p-3 bg-muted/30">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">Send Email</p>
                                    <p className="text-xs text-muted-foreground">
                                      Send automated emails
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {enabledTools['gmail-send-email'] && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => openToolDrawer('gmail-send-email', 'send_email')}
                                      >
                                        <Settings className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                    <Switch
                                      checked={enabledTools['gmail-send-email']}
                                      onCheckedChange={() => toggleTool('gmail-send-email')}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Read Email Tool */}
                              <div className="rounded-lg border p-3 bg-muted/30">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">Read Email</p>
                                    <p className="text-xs text-muted-foreground">
                                      Access and read emails
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {enabledTools['gmail-read-email'] && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => openToolDrawer('gmail-read-email', 'read_email')}
                                      >
                                        <Settings className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                    <Switch
                                      checked={enabledTools['gmail-read-email']}
                                      onCheckedChange={() => toggleTool('gmail-read-email')}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  </div>
                </div>

                <Separator />

                {/* Custom Tools Section */}
                <div className="space-y-3">
                  <div>
                    <h2 className="text-base font-semibold">Custom Tools</h2>
                    <p className="text-sm text-muted-foreground">
                      Build and add your own custom tools
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 px-4 flex-col items-start gap-3 relative"
                    disabled
                  >
                    <Badge variant="outline" className="absolute top-2 right-2 text-xs border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 dark:text-yellow-500">
                      Coming Soon
                    </Badge>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Plus className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-base">Add Custom Tool</span>
                    </div>
                    <p className="text-xs text-left text-muted-foreground font-normal">
                      Create custom tools tailored to your specific needs
                    </p>
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Tool Configuration Drawer */}
          <Drawer open={isToolDrawerOpen} onOpenChange={setIsToolDrawerOpen} direction="right">
            <DrawerContent direction="right">
              <DrawerHeader>
                <DrawerTitle>Configure Tool</DrawerTitle>
                <DrawerDescription>
                  Customize the tool's name and description
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="tool-name">Name</Label>
                  <Input
                    id="tool-name"
                    value={selectedTool?.name || ''}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tool-description">
                      Description <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Show Example
                    </Button>
                  </div>
                  <Textarea
                    id="tool-description"
                    value={toolDescription}
                    onChange={(e) => setToolDescription(e.target.value)}
                    placeholder="Enter a description for this tool..."
                    className="min-h-[100px] resize-y"
                  />
                </div>
              </div>

              <DrawerFooter>
                <Button onClick={closeToolDrawer}>Save</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Right Panel - Voice Chat */}
        <div className="w-full lg:flex-[3] flex flex-col overflow-hidden relative min-w-0 rounded-lg min-h-full lg:sticky lg:top-4 lg:h-[calc(100vh-8rem)]">
          {agentState === "disconnected" || agentState === null ? (
            /* Initial Voice Chat State */
            <Card className="flex h-full w-full flex-col">
              <CardHeader>
                <CardTitle className="text-sm">Preview your agent</CardTitle>
                <CardDescription className="text-xs">
                  Test your agent's conversation flow and responses
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="flex flex-col items-center gap-6">
                <div className="relative size-32">
                  <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                    <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
                      <Orb
                        className="h-full w-full"
                        volumeMode="manual"
                        getInputVolume={getInputVolume}
                        getOutputVolume={getOutputVolume}
                      />
                    </div>
            </div>
          </div>

                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-xl font-semibold">{agentName}</h2>
                  <AnimatePresence mode="wait">
                    {errorMessage ? (
                      <motion.p
                        key="error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-destructive text-center text-sm"
                      >
                        {errorMessage}
                      </motion.p>
                    ) : (
                      <motion.p
                        key="disconnected"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-muted-foreground text-sm"
                      >
                        Tap to start voice chat
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  onClick={handleCall}
                  disabled={isTransitioning}
                  size="icon"
                  variant={isCallActive ? "secondary" : "default"}
                  className="h-12 w-12 rounded-full"
                >
                  <PhoneIcon className="h-5 w-5" />
                </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Chat Interface */
            <Card className="flex h-full w-full flex-col">
              {/* Orb Header - Fixed at top */}
              <CardHeader className="pb-3 space-y-0 border-b">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative size-20">
                    <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                      <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
                        <Orb 
                          className="h-full w-full"
                          volumeMode="manual"
                          getInputVolume={getInputVolume}
                          getOutputVolume={getOutputVolume}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <h3 className="text-sm font-semibold">{agentName}</h3>
                    <AnimatePresence mode="wait">
                      {isTransitioning ? (
                        <motion.div
                          key="status"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <div className={cn(
                            "h-2 w-2 rounded-full transition-all duration-300",
                            "bg-primary/60 animate-pulse"
                          )} />
                          <span className="text-xs capitalize text-muted-foreground">
                            <ShimmeringText text={agentState!} />
                          </span>
                        </motion.div>
                      ) : isCallActive ? (
                        <motion.div
                          key="connected"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">Connected</span>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* Messages Area - Scrollable */}
                <div className="flex-1 overflow-hidden relative">
                  <Conversation className="absolute inset-0">
                    <ConversationContent className="flex min-w-0 flex-col gap-3 p-2">
                    {messages.map((message, index) => {
                      return (
                        <Message key={index} from={message.role}>
                          <MessageContent className="max-w-[85%]">
                            <Response className="text-sm whitespace-pre-wrap break-words">
                              {message.content}
                            </Response>
                          </MessageContent>
                          {message.role === "user" ? (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                You
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-border flex-shrink-0">
                              <Orb className="h-full w-full" />
                            </div>
                          )}
                        </Message>
                      )
                    })}
                    </ConversationContent>
                    <ConversationScrollButton className="bottom-[48px]" />
                  </Conversation>
                  </div>

                {/* Input Bar - Fixed at bottom */}
                <div className="border-t px-2 py-2 flex items-center">
                  <div className="flex items-center gap-1.5 w-full">
                  {/* Text Input */}
                  <Input
                    placeholder="Type a message..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="flex-1 h-8"
                  />

                  {/* Send Button */}
              <Button 
                    onClick={handleSendMessage}
                    disabled={!textInput.trim()}
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
              </Button>

                  {/* Mute Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
              <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => setIsMuted(!isMuted)}
                          className={cn("h-8 w-8", isMuted && "border-destructive text-destructive")}
                        >
                          {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
              </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isMuted ? "Unmute" : "Mute"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* End Call Button */}
                  <Button 
                    onClick={handleCall}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <PhoneOffIcon className="h-3.5 w-3.5" />
                  </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}