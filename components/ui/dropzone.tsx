"use client"

import * as React from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { Upload, File, X, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface FileWithPreview extends File {
  preview?: string
}

interface DropzoneProps extends Omit<DropzoneOptions, "onDrop"> {
  onDrop?: (files: FileWithPreview[]) => void
  className?: string
  showPreview?: boolean
  maxFiles?: number
}

export function Dropzone({
  onDrop,
  className,
  showPreview = true,
  maxFiles = 5,
  ...dropzoneOptions
}: DropzoneProps) {
  const [files, setFiles] = React.useState<FileWithPreview[]>([])
  const [uploadStatus, setUploadStatus] = React.useState<{
    [key: string]: "uploading" | "success" | "error"
  }>({})

  const handleDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const filesWithPreview = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )

      setFiles((prev) => [...prev, ...filesWithPreview])

      if (onDrop) {
        onDrop(filesWithPreview)
      }
    },
    [onDrop]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop: handleDrop,
    maxFiles,
    ...dropzoneOptions,
  })

  const removeFile = (fileToRemove: FileWithPreview) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove))
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview)
    }
  }

  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-colors",
          "hover:border-primary/50 hover:bg-accent/5",
          isDragActive && "border-primary bg-accent/10",
          isDragReject && "border-destructive bg-destructive/5",
          "cursor-pointer",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4 py-10 px-4 text-center">
          <div
            className={cn(
              "rounded-full p-4 transition-colors",
              isDragActive
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Upload className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <div className="text-lg font-medium">
              {isDragActive
                ? "Drop files here"
                : "Drag & drop files here, or click to select"}
            </div>
            <p className="text-sm text-muted-foreground">
              {dropzoneOptions.accept
                ? `Supported formats: ${Object.keys(dropzoneOptions.accept).join(", ")}`
                : "All file types supported"}
            </p>
            {maxFiles > 1 && (
              <p className="text-xs text-muted-foreground">
                Maximum {maxFiles} files
              </p>
            )}
          </div>
        </div>
      </div>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Some files were rejected:</span>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-destructive/80">
            {fileRejections.map(({ file, errors }) => (
              <li key={file.name}>
                {file.name} - {errors.map((e) => e.message).join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* File Preview */}
      {showPreview && files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-lg border bg-card p-3"
              >
                <div className="rounded bg-primary/10 p-2">
                  <File className="h-4 w-4 text-primary" />
                </div>

                <div className="flex-1 space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    {uploadStatus[file.name] === "success" && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {uploadStatus[file.name] === "error" && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Simple Dropzone variant
export function DropzoneSimple({
  onDrop,
  className,
  ...dropzoneOptions
}: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      const filesWithPreview = files.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
      if (onDrop) {
        onDrop(filesWithPreview)
      }
    },
    ...dropzoneOptions,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6",
        "transition-colors hover:border-primary/50",
        isDragActive && "border-primary bg-accent/10",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2 text-center">
        <Upload className="h-6 w-6 text-muted-foreground" />
        <div className="text-sm">
          <span className="font-medium text-primary">Click to upload</span>
          <span className="text-muted-foreground"> or drag and drop</span>
        </div>
      </div>
    </div>
  )
}

