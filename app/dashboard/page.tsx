import { Button } from "@/components/ui/button"
import { CircleFadingPlus, Edit } from "lucide-react"
import { PageHeader } from "@/components/page-header"


export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title="Dashboard">
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Flow
        </Button>
        <Button variant="default" size="sm" className="gap-2">
          <CircleFadingPlus className="h-4 w-4" />
          Create Path
        </Button>
      </PageHeader>
    </div>
  )
}
