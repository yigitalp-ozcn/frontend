"use client"

import * as React from "react"
import { addDays, format, isToday, isYesterday, isSameDay } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (dateRange: DateRange | undefined) => void
}

export function DateRangePicker({
  className,
  onDateChange,
}: DateRangePickerProps) {
  const today = new Date()
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: today,
    to: today,
  })
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>({
    from: today,
    to: today,
  })
  const [open, setOpen] = React.useState(false)
  const [selectedPreset, setSelectedPreset] = React.useState<string>("today")

  const formatDateDisplay = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) {
      return <span>Pick a date</span>
    }

    // Tek gün seçiliyse
    if (!dateRange.to || isSameDay(dateRange.from, dateRange.to)) {
      if (isToday(dateRange.from)) {
        return "Today"
      }
      if (isYesterday(dateRange.from)) {
        return "Yesterday"
      }
      return format(dateRange.from, "MMM dd, yyyy")
    }

    // Aralık seçiliyse
    return (
      <>
        {format(dateRange.from, "MMM dd, yyyy")} -{" "}
        {format(dateRange.to, "MMM dd, yyyy")}
      </>
    )
  }

  const handlePresetSelect = (value: string) => {
    const today = new Date()
    setSelectedPreset(value)
    
    switch (value) {
      case "today":
        setTempDate({ from: today, to: today })
        break
      case "yesterday":
        const yesterday = addDays(today, -1)
        setTempDate({ from: yesterday, to: yesterday })
        break
      case "last7":
        setTempDate({ from: addDays(today, -7), to: today })
        break
      case "last30":
        setTempDate({ from: addDays(today, -30), to: today })
        break
      case "last90":
        setTempDate({ from: addDays(today, -90), to: today })
        break
      case "last365":
        setTempDate({ from: addDays(today, -365), to: today })
        break
      case "custom":
        // Custom seçildiğinde mevcut tarihi koru
        break
    }
  }

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setTempDate(newDate)
    setSelectedPreset("custom")
  }

  const detectPreset = (dateRange: DateRange | undefined): string => {
    if (!dateRange?.from || !dateRange?.to) return "custom"
    
    const today = new Date()
    const from = dateRange.from
    const to = dateRange.to
    
    // Bugün mü?
    if (isSameDay(from, today) && isSameDay(to, today)) {
      return "today"
    }
    
    // Dün mü?
    const yesterday = addDays(today, -1)
    if (isSameDay(from, yesterday) && isSameDay(to, yesterday)) {
      return "yesterday"
    }
    
    // Son 7 gün mü?
    const last7Start = addDays(today, -7)
    if (isSameDay(from, last7Start) && isSameDay(to, today)) {
      return "last7"
    }
    
    // Son 30 gün mü?
    const last30Start = addDays(today, -30)
    if (isSameDay(from, last30Start) && isSameDay(to, today)) {
      return "last30"
    }
    
    // Son 90 gün mü?
    const last90Start = addDays(today, -90)
    if (isSameDay(from, last90Start) && isSameDay(to, today)) {
      return "last90"
    }
    
    // Son 365 gün mü?
    const last365Start = addDays(today, -365)
    if (isSameDay(from, last365Start) && isSameDay(to, today)) {
      return "last365"
    }
    
    return "custom"
  }

  const handleApply = () => {
    setDate(tempDate)
    setSelectedPreset(detectPreset(tempDate))
    setOpen(false)
    if (onDateChange) {
      onDateChange(tempDate)
    }
  }

  const handleCancel = () => {
    setTempDate(date)
    setSelectedPreset(detectPreset(date))
    setOpen(false)
  }

  const isPresetActive = (preset: string) => {
    return selectedPreset === preset
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal gap-2",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {formatDateDisplay(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col">
            <div className="flex">
              <div className="border-r p-3 space-y-1 flex flex-col min-w-[150px]">
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Choose a Range or Date
                </div>
                <Button
                  variant={isPresetActive("today") ? "secondary" : "ghost"}
                  className="w-full justify-start font-normal text-sm h-8 px-3"
                  onClick={() => handlePresetSelect("today")}
                >
                  Today
                </Button>
                <Button
                  variant={isPresetActive("yesterday") ? "secondary" : "ghost"}
                  className="w-full justify-start font-normal text-sm h-8 px-3"
                  onClick={() => handlePresetSelect("yesterday")}
                >
                  Yesterday
                </Button>
                <Button
                  variant={isPresetActive("last7") ? "secondary" : "ghost"}
                  className="w-full justify-start font-normal text-sm h-8 px-3"
                  onClick={() => handlePresetSelect("last7")}
                >
                  Last 7 days
                </Button>
                <Button
                  variant={isPresetActive("last30") ? "secondary" : "ghost"}
                  className="w-full justify-start font-normal text-sm h-8 px-3"
                  onClick={() => handlePresetSelect("last30")}
                >
                  Last 30 days
                </Button>
                <Button
                  variant={isPresetActive("last90") ? "secondary" : "ghost"}
                  className="w-full justify-start font-normal text-sm h-8 px-3"
                  onClick={() => handlePresetSelect("last90")}
                >
                  Last 90 days
                </Button>
                <Button
                  variant={isPresetActive("last365") ? "secondary" : "ghost"}
                  className="w-full justify-start font-normal text-sm h-8 px-3"
                  onClick={() => handlePresetSelect("last365")}
                >
                  Last 365 days
                </Button>
                <Button
                  variant={isPresetActive("custom") ? "secondary" : "ghost"}
                  className="w-full justify-start font-normal text-sm h-8 px-3"
                  onClick={() => handlePresetSelect("custom")}
                >
                  Custom
                </Button>
              </div>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={tempDate?.from}
                selected={tempDate}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                disabled={(date: Date) => date > new Date()}
              />
            </div>
            <div className="border-t p-3 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

