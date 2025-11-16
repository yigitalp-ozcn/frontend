"use client"

import * as React from "react"
import { Check, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Orb } from "@/components/ui/orb"

export interface Voice {
  voiceId: string
  name: string
  category?: string
  labels?: {
    accent?: string
    descriptive?: string
    age?: string
    gender?: string
    language?: string
    use_case?: string
  }
  description?: string
  previewUrl?: string
}

interface VoicePickerProps {
  voices: Voice[]
  value?: string
  onValueChange?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
}

export function VoicePicker({
  voices,
  value,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  placeholder = "Select a voice...",
}: VoicePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? onOpenChange! : setInternalOpen

  const selectedVoice = voices.find((voice) => voice.voiceId === value)

  const filteredVoices = voices.filter((voice) =>
    voice.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        onClick={() => setOpen(!open)}
      >
        {selectedVoice ? selectedVoice.name : placeholder}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select a Voice</DialogTitle>
            <DialogDescription>
              Choose a voice for your agent from the available options below.
            </DialogDescription>
          </DialogHeader>

          <Command className="rounded-lg border shadow-md">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                placeholder="Search voices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandList className="max-h-[400px]">
              {filteredVoices.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No voices found.
                </div>
              ) : (
                <CommandGroup>
                  {filteredVoices.map((voice) => (
                    <CommandItem
                      key={voice.voiceId}
                      value={voice.voiceId}
                      onSelect={() => {
                        onValueChange?.(voice.voiceId)
                        setOpen(false)
                      }}
                      className="flex items-center gap-3 p-3"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-muted overflow-hidden">
                        <Orb className="h-full w-full" />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{voice.name}</span>
                          {voice.labels?.gender && (
                            <span className="text-xs text-muted-foreground">
                              ({voice.labels.gender})
                            </span>
                          )}
                        </div>
                        {voice.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {voice.description}
                          </p>
                        )}
                        {voice.labels && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {voice.labels.accent && (
                              <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {voice.labels.accent}
                              </span>
                            )}
                            {voice.labels.age && (
                              <span className="inline-flex items-center rounded-md bg-secondary/50 px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                {voice.labels.age}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === voice.voiceId ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}