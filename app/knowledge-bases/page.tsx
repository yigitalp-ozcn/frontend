"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { FolderX, ArrowUpRightIcon, Plus, Upload, Trash2, FileText, Globe, Type, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Dropzone, FileWithPreview } from "@/components/ui/dropzone"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

// Mock data for knowledge bases
type KnowledgeBase = {
  id: string
  name: string
  description: string
  fileCount: number
  websiteCount: number
  textCount: number
  createdAt: string
  status: "processing" | "ready" | "active" | "empty"
}

// Document limits
const DOCUMENT_LIMIT = 100

const mockKnowledgeBases: KnowledgeBase[] = [
  {
    id: "1",
    name: "Product Documentation",
    description: "Complete product documentation ",
    fileCount: 24,
    websiteCount: 5,
    textCount: 12,
    createdAt: "2024-03-15",
    status: "active",
  },
  {
    id: "2",
    name: "Customer Support FAQs",
    description: "Frequently asked questions",
    fileCount: 18,
    websiteCount: 3,
    textCount: 8,
    createdAt: "2024-03-10",
    status: "ready",
  },
  {
    id: "3",
    name: "Sales Training Materials",
    description: "Training documents, presentations.",
    fileCount: 42,
    websiteCount: 8,
    textCount: 15,
    createdAt: "2024-03-08",
    status: "processing",
  },
  {
    id: "4",
    name: "Legal Compliance Documents",
    description: "Legal documents, compliance guidelines.",
    fileCount: 15,
    websiteCount: 2,
    textCount: 5,
    createdAt: "2024-03-05",
    status: "empty",
  },
]

const getStatusConfig = (status: KnowledgeBase["status"]) => {
  switch (status) {
    case "processing":
      return {
        label: "Processing",
        color: "border-yellow-500 text-yellow-500",
        dotColor: "bg-yellow-500",
      }
    case "ready":
      return {
        label: "Ready",
        color: "border-green-500 text-green-500",
        dotColor: "bg-green-500",
      }
    case "active":
      return {
        label: "Active",
        color: "border-green-500 text-green-500",
        dotColor: "bg-green-500",
      }
    case "empty":
      return {
        label: "Empty",
        color: "border-red-500 text-red-500",
        dotColor: "bg-red-500",
      }
  }
}

export default function Page() {
  const router = useRouter()
  // Simulating empty state - change this to true to see the knowledge bases list
  const [hasKnowledgeBases, setHasKnowledgeBases] = useState(true)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedKbId, setSelectedKbId] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([])
  const [importedZip, setImportedZip] = useState<FileWithPreview[]>([])
  const [createFiles, setCreateFiles] = useState<FileWithPreview[]>([])
  const [knowledgeBaseName, setKnowledgeBaseName] = useState("")
  const [knowledgeBaseDescription, setKnowledgeBaseDescription] = useState("")
  const [importDescription, setImportDescription] = useState("")

  const handleFileDrop = (files: FileWithPreview[]) => {
    setUploadedFiles(files)
    console.log("Files uploaded:", files)
  }

  const handleUpload = () => {
    // Here you would implement the actual upload logic
    console.log("Uploading files:", uploadedFiles)
    // Close dialog after upload
    setIsUploadDialogOpen(false)
    setUploadedFiles([])
  }

  const handleZipDrop = (files: FileWithPreview[]) => {
    setImportedZip(files)
    console.log("ZIP file uploaded:", files)
  }

  const handleImport = () => {
    // Here you would implement the actual import logic
    console.log("Importing knowledge base:", {
      name: knowledgeBaseName,
      description: importDescription,
      file: importedZip[0],
    })
    // Close dialog after import
    setIsImportDialogOpen(false)
    setImportedZip([])
    setKnowledgeBaseName("")
    setImportDescription("")
  }

  const handleCreateFileDrop = (files: FileWithPreview[]) => {
    setCreateFiles(files)
    console.log("Files for new knowledge base:", files)
  }

  const handleCreate = () => {
    // Here you would implement the actual create logic
    console.log("Creating knowledge base:", {
      name: knowledgeBaseName,
      description: knowledgeBaseDescription,
      files: createFiles,
    })
    // Close dialog after creation
    setIsCreateDialogOpen(false)
    setCreateFiles([])
    setKnowledgeBaseName("")
    setKnowledgeBaseDescription("")
  }

  const handleDeleteClick = (id: string) => {
    setSelectedKbId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    // Here you would implement the actual delete logic
    console.log("Deleting knowledge base:", selectedKbId)
    // Close dialog after deletion
    setIsDeleteDialogOpen(false)
    setSelectedKbId(null)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title="Knowledge Bases">
        {hasKnowledgeBases && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
            <Button
              size="sm"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create Knowledge Base
            </Button>
          </>
        )}
      </PageHeader>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Upload files to your knowledge base. Supported formats: PDF, DOCX, TXT, MD
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Dropzone
              onDrop={handleFileDrop}
              accept={{
                "application/pdf": [".pdf"],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                "text/plain": [".txt"],
                "text/markdown": [".md"],
              }}
              maxFiles={10}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploadedFiles.length === 0}
            >
              Upload {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Knowledge Base Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Knowledge Base</DialogTitle>
            <DialogDescription>
              Import an existing knowledge base from a ZIP file
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Knowledge Base Name */}
            <div className="space-y-2">
              <Label htmlFor="import-kb-name">
                Knowledge Base Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="import-kb-name"
                placeholder="Enter knowledge base name"
                value={knowledgeBaseName}
                onChange={(e) => setKnowledgeBaseName(e.target.value)}
                maxLength={30}
                required
              />
              <p className="text-xs text-muted-foreground">
                {knowledgeBaseName.length}/30 characters
              </p>
            </div>

            {/* Knowledge Base Description */}
            <div className="space-y-2">
              <Label htmlFor="import-kb-description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="import-kb-description"
                placeholder="Enter a description for this knowledge base"
                value={importDescription}
                onChange={(e) => setImportDescription(e.target.value)}
                maxLength={60}
                rows={3}
                required
              />
              <p className="text-xs text-muted-foreground">
                {importDescription.length}/60 characters
              </p>
            </div>

            {/* ZIP Upload */}
            <div className="space-y-2">
              <Label>
                Upload ZIP File <span className="text-destructive">*</span>
              </Label>
              <Dropzone
                onDrop={handleZipDrop}
                accept={{
                  "application/zip": [".zip"],
                  "application/x-zip-compressed": [".zip"],
                }}
                maxFiles={1}
              />
            </div>

            {/* Important Notes */}
            <div className="rounded-lg border border-muted bg-muted/30 p-4 space-y-2">
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-muted p-1 mt-0.5">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 space-y-1 text-sm">
                  <p className="font-medium text-foreground">Important Requirements:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• All documents must be in the <strong>root directory</strong> of the ZIP file</li>
                    <li>• <strong>No subfolders</strong> are allowed</li>
                    <li>• Supported formats: <strong>TXT, PDF, DOCX, MD, CSV, JSON</strong></li>
                    <li>• Files must be in formats that AI can analyze</li>
                    <li>• Maximum file size: <strong>50MB per file</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsImportDialogOpen(false)
                setImportedZip([])
                setKnowledgeBaseName("")
                setImportDescription("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={importedZip.length === 0 || !knowledgeBaseName.trim() || !importDescription.trim()}
            >
              Import Knowledge Base
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Knowledge Base Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Knowledge Base</DialogTitle>
            <DialogDescription>
              Create a new knowledge base by uploading documents
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Knowledge Base Name */}
            <div className="space-y-2">
              <Label htmlFor="create-kb-name">
                Knowledge Base Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="create-kb-name"
                placeholder="Enter knowledge base name"
                value={knowledgeBaseName}
                onChange={(e) => setKnowledgeBaseName(e.target.value)}
                maxLength={30}
                required
              />
              <p className="text-xs text-muted-foreground">
                {knowledgeBaseName.length}/30 characters
              </p>
            </div>

            {/* Knowledge Base Description */}
            <div className="space-y-2">
              <Label htmlFor="create-kb-description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="create-kb-description"
                placeholder="Enter a description for this knowledge base"
                value={knowledgeBaseDescription}
                onChange={(e) => setKnowledgeBaseDescription(e.target.value)}
                maxLength={60}
                rows={3}
                required
              />
              <p className="text-xs text-muted-foreground">
                {knowledgeBaseDescription.length}/60 characters
              </p>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>
                Upload Documents <span className="text-destructive">*</span>
              </Label>
              <Dropzone
                onDrop={handleCreateFileDrop}
                accept={{
                  "application/pdf": [".pdf"],
                  "text/plain": [".txt"],
                  "application/msword": [".doc"],
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                }}
                maxFiles={10}
              />
            </div>

            {/* File Requirements Info */}
            <div className="rounded-lg border border-muted bg-muted/30 p-4 space-y-2">
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-muted p-1 mt-0.5">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 space-y-1 text-sm">
                  <p className="font-medium text-foreground">File Requirements:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Supported formats: <strong>.pdf, .txt, .doc, .docx</strong></li>
                    <li>• Maximum <strong>10 documents</strong></li>
                    <li>• Max file size: <strong>100 MB</strong> per file</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setCreateFiles([])
                setKnowledgeBaseName("")
                setKnowledgeBaseDescription("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createFiles.length === 0 || !knowledgeBaseName.trim() || !knowledgeBaseDescription.trim()}
            >
              Create Knowledge Base
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Knowledge Base</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this knowledge base? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive-outline"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 rounded-lg border bg-background shadow-sm">
        {!hasKnowledgeBases ? (
          <div className="flex items-center justify-center min-h-[500px] p-4">
            <Empty className="border border-dashed max-w-2xl">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderX />
                </EmptyMedia>
                <EmptyTitle>No Knowledge Bases Yet</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any knowledge bases yet. Get started by creating
                  your first knowledge base.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsImportDialogOpen(true)}
                  >
                    Import Knowledge Base
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    Create Knowledge Base
                  </Button>
                </div>
              </EmptyContent>
              <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
              >
                <a href="#">
                  Learn More <ArrowUpRightIcon />
                </a>
              </Button>
            </Empty>
          </div>
        ) : (
          <div className="p-6">
            {/* Document Limit Progress - Only show for active knowledge bases */}
            {(() => {
              const activeKbs = mockKnowledgeBases.filter(kb => kb.status === "active")
              if (activeKbs.length === 0) return null
              
              const totalDocuments = activeKbs.reduce((sum, kb) => 
                sum + kb.fileCount + kb.websiteCount + kb.textCount, 0
              )
              const documentPercentage = (totalDocuments / DOCUMENT_LIMIT) * 100
              
              return (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Document Limit</h3>
                    <span className="text-sm text-muted-foreground">
                      {totalDocuments} / {DOCUMENT_LIMIT} documents
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        documentPercentage >= 90 
                          ? 'bg-red-500' 
                          : documentPercentage >= 70 
                            ? 'bg-yellow-500' 
                            : 'bg-primary'
                      }`}
                      style={{ width: `${documentPercentage}%` }}
                    />
                  </div>
                </div>
              )
            })()}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mockKnowledgeBases.map((kb) => (
                <Card key={kb.id}>
                  {/* Row 1: Header with title and status badge */}
                  <CardHeader>
                    <CardTitle className="text-lg">{kb.name}</CardTitle>
                    <CardAction>
                      <Badge variant="outline" className={`gap-1.5 ${getStatusConfig(kb.status).color}`}>
                        <span className={`h-2 w-2 rounded-full ${getStatusConfig(kb.status).dotColor}`}></span>
                        {getStatusConfig(kb.status).label}
                      </Badge>
                    </CardAction>
                  </CardHeader>

                  <Separator />

                  {/* Row 2: Content information */}
                  <CardContent className="space-y-3">
                    <CardDescription className="line-clamp-2">
                      {kb.description}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                      <span className="text-muted-foreground">Created: {new Date(kb.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{kb.fileCount}</span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>{kb.websiteCount}</span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1.5">
                          <Type className="h-4 w-4 text-muted-foreground" />
                          <span>{kb.textCount}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {/* Row 3: Footer with action buttons */}
                  <CardFooter className="gap-2">
                    <Button
                      variant="destructive-outline"
                      className="flex-1"
                      onClick={() => handleDeleteClick(kb.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/knowledge-bases/${kb.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}