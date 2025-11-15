import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface PageHeaderProps {
  title: string | React.ReactNode
  children?: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({ title, children, actions }: PageHeaderProps) {
  const rightContent = actions || children
  
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border rounded-lg bg-background shadow-sm">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-semibold">{title}</h1>
        {rightContent && (
          <div className="ml-auto flex items-center gap-2">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  )
}