"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Settings, Users, Key, CreditCard, LogOut, ExternalLink } from "lucide-react"
import { PageHeader } from "@/components/page-header"

const settingsNav = [
  {
    title: "General",
    href: "/settings/general",
    icon: Settings,
  },
  {
    title: "Team",
    href: "/settings/team",
    icon: Users,
  },
  {
    title: "API Keys",
    href: "/settings/api-keys",
    icon: Key,
  },
  {
    title: "Billing",
    href: "/billing-credits",
    icon: CreditCard,
    external: true,
  },
]

const getPageTitle = (pathname: string) => {
  if (pathname.includes("/settings/general")) return "General Settings"
  if (pathname.includes("/settings/team")) return "Team"
  if (pathname.includes("/settings/api-keys")) return "API Keys"
  return "Settings"
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title={pageTitle} />
      
      <div className="flex flex-1 rounded-lg border bg-background shadow-sm">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 px-3 py-4">
          <div className="flex flex-col gap-2">
            <nav className="flex flex-col gap-1">
              {settingsNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={cn(
                        "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.title}</span>
                      {item.external && (
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                      )}
                    </span>
                  </Link>
                )
              })}
            </nav>
            <Separator className="my-2" />
            <Button
              variant="destructive-outline"
              className="w-full justify-start gap-2 px-2 py-1.5 h-auto text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Log out</span>
            </Button>
          </div>
        </aside>

        <Separator orientation="vertical" />

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

