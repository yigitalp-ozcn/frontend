// Status configuration helpers
export type StatusType = "active" | "inactive" | "processing" | "ready" | "empty"
export type CallerType = "inbound" | "outbound"

export const getStatusConfig = (status: StatusType) => {
  switch (status) {
    case "active":
    case "ready":
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        color: "border-green-500 text-green-500",
        dotColor: "bg-green-500",
      }
    case "inactive":
    case "empty":
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        color: "border-red-500 text-red-500",
        dotColor: "bg-red-500",
      }
    case "processing":
      return {
        label: "Processing",
        color: "border-yellow-500 text-yellow-500",
        dotColor: "bg-yellow-500",
      }
  }
}

export const getCallerTypeConfig = (callerType: CallerType) => {
  switch (callerType) {
    case "inbound":
      return {
        label: "Inbound",
        color: "border-blue-500 text-blue-500",
      }
    case "outbound":
      return {
        label: "Outbound",
        color: "border-purple-500 text-purple-500",
      }
  }
}

export const getTimeAgo = (date: string) => {
  const now = new Date()
  const createdDate = new Date(date)
  const diffTime = Math.abs(now.getTime() - createdDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "today"
  if (diffDays === 1) return "1 day ago"
  if (diffDays < 30) return `${diffDays} days ago`
  if (diffDays < 60) return "1 month ago"
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`
}

// Generic toggle function for arrays
export const createToggleFunction = <T>(
  setState: React.Dispatch<React.SetStateAction<T[]>>
) => {
  return (item: T) => {
    setState((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }
}
