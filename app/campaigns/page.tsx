import { PageHeader } from "@/components/page-header"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title="Campaigns" />
      
      <div className="flex-1 rounded-lg border bg-background shadow-sm">
        <div className="p-4">
          {/* Sayfa içeriği */}
        </div>
      </div>
    </div>
  )
}



