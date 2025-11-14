"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dropzone, FileWithPreview } from "@/components/ui/dropzone"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search, Copy, Play, User, UserCheck, Plus, Filter, ChevronLeft, ChevronRight, Activity, Info, Mic, Brain, FileText, AudioLines, Square, Trash2, AlertCircle, CheckCircle, Clock } from "lucide-react"

interface Voice {
  id: string
  name: string
  gender?: 'Male' | 'Female'
  avatar: string
  description: string
  tags: string[]
}

interface UserVoice {
  id: string
  name: string
  description: string
  gender: 'Male' | 'Female'
  status: 'ready' | 'processing' | 'error'
  createdAt: string
  avatar: string
}

const voices: Voice[] = [
  {
    id: 'june',
    name: 'June',
    gender: 'Female',
    avatar: '#9333EA',
    description: 'American Female.',
    tags: ['english', 'Bland Curated'],
  },
  {
    id: 'keelan',
    name: 'Keelan',
    gender: 'Female',
    avatar: '#7DD3FC',
    description: 'Can Engaged Professional Female',
    tags: ['Female', 'Warm', 'Inbound Support', 'Bland Curated'],
  },
  {
    id: 'maeve',
    name: 'Maeve',
    gender: 'Female',
    avatar: '#3B82F6',
    description: 'Nancy is a kind and sweet female voice.',
    tags: ['Bland Curated', 'english'],
  },
  {
    id: 'max',
    name: 'Max',
    gender: 'Male',
    avatar: '#22C55E',
    description: 'Max is a warm British voice with smooth intonations.',
    tags: ['Bland Curated', 'english'],
  },
  {
    id: 'trixie',
    name: 'Trixie',
    gender: 'Female',
    avatar: '#9CA3AF',
    description: 'Trixie is a teenage British voice, direct and forward.',
    tags: ['british', 'female', 'Bland Curated'],
  },
  {
    id: 'karl',
    name: 'Karl',
    gender: 'Male',
    avatar: '#60A5FA',
    description: 'A german accented voice, calm and clear.',
    tags: ['Bland Curated', 'English', 'Male'],
  },
  {
    id: 'trevor',
    name: 'Trevor',
    avatar: '#3B82F6',
    description: '',
    tags: ['Bland Curated'],
  },
  {
    id: 'davido',
    name: 'Davido',
    avatar: '#92400E',
    description: '',
    tags: ['british', 'Bland Curated'],
  },
  {
    id: 'walter',
    name: 'Walter - Bland',
    gender: 'Male',
    avatar: '#16A34A',
    description: 'American male voice.',
    tags: ['Bland Curated', 'american', 'male'],
  },
  {
    id: 'pierre',
    name: 'Pierre',
    avatar: '#3B82F6',
    description: 'Pierre speaks with a warm and unmistakable French accent.',
    tags: ['Bland Curated', 'english'],
  },
  {
    id: 'chris',
    name: 'Chris',
    avatar: '#6B7280',
    description: 'Measured and confident, maintaining a professional tone.',
    tags: ['Bland Curated'],
  },
  {
    id: 'destiny',
    name: 'Destiny New',
    gender: 'Female',
    avatar: '#EC4899',
    description: 'Voice options.',
    tags: ['british', 'female', 'Bland Curated'],
  },
  {
    id: 'willow',
    name: 'Willow (New)',
    gender: 'Female',
    avatar: '#F59E0B',
    description: 'Professional and clear woman.',
    tags: ['female', 'professional', 'british', 'Bland Curated'],
  },
]

// Mock user created voices
const userVoices: UserVoice[] = [
  {
    id: 'user-voice-1',
    name: 'My Custom Voice',
    description: 'Professional voice for customer support',
    gender: 'Male',
    status: 'ready',
    createdAt: '2024-01-15',
    avatar: '#3B82F6',
  },
  {
    id: 'user-voice-2',
    name: 'Sarah Professional',
    description: 'Warm and friendly female voice',
    gender: 'Female',
    status: 'processing',
    createdAt: '2024-01-16',
    avatar: '#EC4899',
  },
  {
    id: 'user-voice-3',
    name: 'John Sales',
    description: 'Energetic sales voice',
    gender: 'Male',
    status: 'ready',
    createdAt: '2024-01-14',
    avatar: '#22C55E',
  },
  {
    id: 'user-voice-4',
    name: 'Failed Voice Clone',
    description: 'Audio quality was too low',
    gender: 'Female',
    status: 'error',
    createdAt: '2024-01-13',
    avatar: '#EF4444',
  },
]

const VOICE_LIMIT = 10

function getStatusConfig(status: UserVoice['status']) {
  switch (status) {
    case 'ready':
      return {
        label: 'Ready',
        icon: <CheckCircle className="w-3 h-3" />,
        className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      }
    case 'processing':
      return {
        label: 'Processing',
        icon: <Clock className="w-3 h-3" />,
        className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      }
    case 'error':
      return {
        label: 'Error',
        icon: <AlertCircle className="w-3 h-3" />,
        className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      }
  }
}

function GuidelineItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex gap-2.5 items-center">
      <div className="flex-shrink-0">{icon}</div>
      <p className="text-xs text-muted-foreground leading-snug">{text}</p>
    </div>
  )
}

function UserVoiceCard({ 
  voice, 
  isPlaying, 
  onPlayToggle, 
  onDelete 
}: { 
  voice: UserVoice; 
  isPlaying: boolean; 
  onPlayToggle: () => void;
  onDelete: () => void;
}) {
  const statusConfig = getStatusConfig(voice.status)
  
  return (
    <div className="rounded-lg border bg-background p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        {/* Sol taraf - Avatar ve bilgiler */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Avatar className="w-12 h-12 flex-shrink-0" style={{ backgroundColor: voice.avatar }}>
            <AvatarFallback className="text-white font-semibold">
              {voice.name[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold">{voice.name}</span>
              <Badge variant="outline" className="text-xs">
                {voice.gender === 'Male' ? <User className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                {voice.gender}
              </Badge>
            </div>
            {voice.description && (
              <p className="text-sm text-muted-foreground">{voice.description}</p>
            )}
          </div>
        </div>

        {/* Orta taraf - Status */}
        <div className="flex items-center justify-center flex-1">
          <Badge variant="secondary" className={`${statusConfig.className} gap-1.5`}>
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
        </div>

        {/* Sağ taraf - Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                disabled={voice.status !== 'ready'}
                onClick={() => {
                  if (voice.status === 'ready') {
                    navigator.clipboard.writeText(voice.id)
                  }
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{voice.status === 'ready' ? 'Copy voice id' : 'Voice not ready'}</p>
            </TooltipContent>
          </Tooltip>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={onPlayToggle}
            disabled={voice.status !== 'ready'}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play
              </>
            )}
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="destructive-outline" 
                size="icon"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete voice</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

function VoiceCard({ voice, isPlaying, onPlayToggle }: { voice: Voice; isPlaying: boolean; onPlayToggle: () => void }) {
  return (
    <div className="rounded-lg border bg-background p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        {/* Sol taraf - Avatar ve bilgiler */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Avatar className="w-12 h-12 flex-shrink-0" style={{ backgroundColor: voice.avatar }}>
            <AvatarFallback className="text-white font-semibold">
              {voice.name[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold">{voice.name}</span>
              {voice.gender && (
                <Badge variant="outline" className="text-xs">
                  {voice.gender === 'Male' ? <User className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                  {voice.gender}
                </Badge>
              )}
            </div>
            {voice.description && (
              <p className="text-sm text-muted-foreground">{voice.description}</p>
            )}
          </div>
        </div>

        {/* Orta taraf - Tags */}
        <div className="flex flex-wrap gap-2 flex-1 justify-center">
          {voice.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Sağ taraf - Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(voice.id)
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy voice id</p>
            </TooltipContent>
          </Tooltip>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={onPlayToggle}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

const DEFAULT_EXAMPLE_TEXT = "Hello! Thank you for calling. How can I assist you today?"

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('')
  const [genderFilter, setGenderFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false)
  const [isCreateVoiceDialogOpen, setIsCreateVoiceDialogOpen] = useState(false)
  const [exampleText, setExampleText] = useState(DEFAULT_EXAMPLE_TEXT)
  const [tempExampleText, setTempExampleText] = useState(DEFAULT_EXAMPLE_TEXT)
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null)
  const [myVoices, setMyVoices] = useState<UserVoice[]>(userVoices)
  
  // Voice Clone Form State
  const [voiceName, setVoiceName] = useState('')
  const [voiceDescription, setVoiceDescription] = useState('')
  const [voiceGender, setVoiceGender] = useState<'Male' | 'Female'>('Male')
  const [audioFiles, setAudioFiles] = useState<FileWithPreview[]>([])
  
  const itemsPerPage = 10
  const voiceUsage = myVoices.length
  const voicePercentage = (voiceUsage / VOICE_LIMIT) * 100

  // Filter voices based on search and gender
  const filteredVoices = voices.filter((voice) => {
    const matchesSearch = 
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesGender = genderFilter === 'all' || voice.gender === genderFilter

    return matchesSearch && matchesGender
  })

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleGenderFilterChange = (value: string) => {
    setGenderFilter(value)
    setCurrentPage(1)
  }

  const handleOpenCustomizeDialog = () => {
    setTempExampleText(exampleText)
    setIsCustomizeDialogOpen(true)
  }

  const handleSaveExampleText = () => {
    setExampleText(tempExampleText)
    setIsCustomizeDialogOpen(false)
  }

  const handleCancelCustomizeDialog = () => {
    setTempExampleText(exampleText)
    setIsCustomizeDialogOpen(false)
  }

  const handleOpenCreateVoiceDialog = () => {
    setIsCreateVoiceDialogOpen(true)
  }

  const handleCreateVoice = () => {
    // Here you would implement the actual voice cloning logic
    console.log('Creating voice clone:', {
      name: voiceName,
      description: voiceDescription,
      gender: voiceGender,
      audioFiles: audioFiles,
    })
    
    // Reset form
    setVoiceName('')
    setVoiceDescription('')
    setVoiceGender('Male')
    setAudioFiles([])
    setIsCreateVoiceDialogOpen(false)
  }

  const handleCancelCreateVoice = () => {
    setVoiceName('')
    setVoiceDescription('')
    setVoiceGender('Male')
    setAudioFiles([])
    setIsCreateVoiceDialogOpen(false)
  }

  const isVoiceFormValid = voiceName.trim() !== '' && audioFiles.length > 0

  const handlePlayToggle = (voiceId: string) => {
    if (playingVoiceId === voiceId) {
      // Stop playing
      setPlayingVoiceId(null)
    } else {
      // Start playing
      setPlayingVoiceId(voiceId)
    }
  }

  const handleDeleteVoice = (voiceId: string) => {
    setMyVoices(myVoices.filter(voice => voice.id !== voiceId))
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null)
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredVoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVoices = filteredVoices.slice(startIndex, endIndex)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title="Voices">
        <Button size="sm" onClick={handleOpenCreateVoiceDialog}>
          <Plus className="w-4 h-4" />
          Create new voice
        </Button>
      </PageHeader>

      {/* Customize Example Text Dialog */}
      <Dialog open={isCustomizeDialogOpen} onOpenChange={setIsCustomizeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customize Example Text</DialogTitle>
            <DialogDescription>
              Set a custom example text that will be used when testing voices. This text will be played when you preview a voice.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="example-text" className="mb-2">
              Example Text
            </Label>
            <Textarea
              id="example-text"
              value={tempExampleText}
              onChange={(e) => setTempExampleText(e.target.value)}
              placeholder="Enter example text..."
              className="min-h-[120px] mt-2"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelCustomizeDialog}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveExampleText}
              disabled={!tempExampleText.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Voice Clone Dialog */}
      <Dialog open={isCreateVoiceDialogOpen} onOpenChange={setIsCreateVoiceDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[85vh] p-0 gap-0">
          {/* Header - Siyah Arkaplan */}
          <div className="text-white px-6 py-4 rounded-t-lg">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Create a voice clone</h2>
            </div>
          </div>

          {/* Content Area - Scrollable */}
          <div className="overflow-y-auto px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sol Kolon - Form */}
              <div className="space-y-5">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="voice-name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="voice-name"
                    placeholder="Enter a name for your voice"
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="voice-description">Description</Label>
                  <Input
                    id="voice-description"
                    placeholder="Enter a description for your voice"
                    value={voiceDescription}
                    onChange={(e) => setVoiceDescription(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe the tone, accent and style of this voice
                  </p>
                </div>

                {/* Gender Selection */}
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={voiceGender === 'Male' ? 'default' : 'outline'}
                      className="w-full h-10"
                      onClick={() => setVoiceGender('Male')}
                    >
                      Male
                    </Button>
                    <Button
                      type="button"
                      variant={voiceGender === 'Female' ? 'default' : 'outline'}
                      className="w-full h-10"
                      onClick={() => setVoiceGender('Female')}
                    >
                      Female
                    </Button>
                  </div>
                </div>

                {/* Upload Audio Samples */}
                <div className="space-y-2">
                  <Label>Upload Audio Samples</Label>
                  <Dropzone
                    onDrop={setAudioFiles}
                    accept={{
                      "audio/wav": [".wav"],
                    }}
                    maxFiles={2}
                    showPreview={true}
                    className="min-h-[140px]"
                  />
                </div>
              </div>

              {/* Sağ Kolon - Guidelines */}
              <div className="bg-muted/40 p-5 rounded-lg space-y-4">
                <h3 className="font-semibold text-base">Guidelines for Best Results</h3>
                
                <div className="space-y-3">
                  <GuidelineItem
                    icon={<Info className="w-4 h-4 text-blue-500" />}
                    text="Provide 1-2 high-quality audio samples for optimal cloning results. Max length of 1 minute and 10MB each file, 25MB max total."
                  />
                  
                  <GuidelineItem
                    icon={<Mic className="w-4 h-4 text-purple-500" />}
                    text="Record in a quiet space with high-fidelity audio - clean audio yields better clones"
                  />
                  
                  <GuidelineItem
                    icon={<Activity className="w-4 h-4 text-green-500" />}
                    text="Ensure consistent audio levels and speaking style across samples"
                  />
                  
                  <GuidelineItem
                    icon={<User className="w-4 h-4 text-orange-500" />}
                    text="Use audio with one clear voice and minimal background noise (less than 20% non-voice sounds)"
                  />
                  
                  <GuidelineItem
                    icon={<FileText className="w-4 h-4 text-indigo-500" />}
                    text="Submit high-fidelity WAV files for best results - the quality of your samples directly impacts clone quality"
                  />
                  
                  <GuidelineItem
                    icon={<Brain className="w-4 h-4 text-pink-500" />}
                    text="Our LLM-based system can learn expressiveness, style variations, and even unique speech patterns"
                  />
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs font-medium mb-2">Supported File Types:</p>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    .wav
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="border-t px-6 py-4">
            <Button
              variant="outline"
              onClick={handleCancelCreateVoice}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateVoice}
              disabled={!isVoiceFormValid}
            >
              Clone Voice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Tabs */}
      <Tabs defaultValue="curated" className="flex flex-1 flex-col">
        <TabsList>
          <TabsTrigger value="curated">Voices</TabsTrigger>
          <TabsTrigger value="studio">Voice Studio</TabsTrigger>
        </TabsList>

        <TabsContent value="curated" className="flex flex-1 flex-col">
          <div className="flex-1 rounded-lg border bg-background shadow-sm">
            <div className="p-4 space-y-4">
              {/* Search, Filter and Customize TTS Text */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search Voices..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={genderFilter} onValueChange={handleGenderFilterChange}>
                  <SelectTrigger className="w-[180px] h-9 gap-2 shadow-xs bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter by gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  className="ml-auto h-9"
                  onClick={handleOpenCustomizeDialog}
                >
                  Customize Example Text
                </Button>
              </div>

              {/* Voice Cards List */}
              <div className="space-y-3">
                {currentVoices.map((voice) => (
                  <VoiceCard 
                    key={voice.id} 
                    voice={voice} 
                    isPlaying={playingVoiceId === voice.id}
                    onPlayToggle={() => handlePlayToggle(voice.id)}
                  />
                ))}
              </div>

              {filteredVoices.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No voices found matching your search.
                </div>
              )}

              {/* Pagination */}
              {filteredVoices.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-end gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium whitespace-nowrap">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next page</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="studio" className="flex flex-1 flex-col">
          <div className="flex-1 rounded-lg border bg-background shadow-sm">
            <div className="p-6">
              {/* Voice Usage Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Voice Clone Usage</h3>
                  <span className="text-sm text-muted-foreground">
                    {voiceUsage} / {VOICE_LIMIT} voices
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      voicePercentage >= 90 
                        ? 'bg-red-500' 
                        : voicePercentage >= 70 
                          ? 'bg-yellow-500' 
                          : 'bg-primary'
                    }`}
                    style={{ width: `${voicePercentage}%` }}
                  />
                </div>
              </div>

              {myVoices.length === 0 ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <AudioLines/>
                      </EmptyMedia>
                      <EmptyTitle>No Voice Clones Yet</EmptyTitle>
                      <EmptyDescription>
                        Create custom voice with advanced training and use with your agents.               
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          Learn More
                        </Button>
                        <Button onClick={handleOpenCreateVoiceDialog}>
                          <Plus className="w-4 h-4" />
                          Create Voice Clone
                        </Button>
                      </div>
                    </EmptyContent>
                  </Empty>
                </div>
              ) : (
                <div className="space-y-3">
                  {myVoices.map((voice) => (
                    <UserVoiceCard 
                      key={voice.id} 
                      voice={voice}
                      isPlaying={playingVoiceId === voice.id}
                      onPlayToggle={() => handlePlayToggle(voice.id)}
                      onDelete={() => handleDeleteVoice(voice.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}