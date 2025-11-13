import { PageHeader } from "@/components/page-header"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { FolderX } from "lucide-react"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title="Agents" />

      <div className="flex-1 rounded-lg border bg-background shadow-sm">
        <div className="p-4">
          {/* Agents content */}
        </div>
      </div>
    </div>
  )
}