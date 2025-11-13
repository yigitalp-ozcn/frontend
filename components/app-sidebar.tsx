"use client"

import * as React from "react"
import {
  House,
  SquareUser,
  Folder,
  Table,
  PhoneOutgoing,
  Radio,
  CardSim,
  AudioLines,
  CreditCard,
  Route,
  Zap,
} from "lucide-react"


import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavPayment } from "./nav-payment"

const data = {
  user: {
    name: "Name Surname",
    email: "example@example.com",
    avatar: "/Avatar.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: House,
    },
    {
      title: "Agents",
      url: "/agents",
      icon: SquareUser,
    },
    {
      title: "Knowledge Bases",
      url: "/knowledge-bases",
      icon: Folder,
    },
    {
      title: "Call Logs",
      url: "/call-logs",
      icon: Table,
    },
    {
      title: "Campaigns",
      url: "/campaigns",
      icon: PhoneOutgoing,
    },
  ],


  navSecondary: [
    {
      title: "Conversation Paths",
      url: "/conversation-paths",
      icon: Route,
    },
    {
      title: "Tools",
      url: "/tools",
      icon: Zap,
    },
    {
      title: "Events",
      url: "/events",
      icon: Radio,
    },
    {
      title: "Phone Numbers",
      url: "/phone-numbers",
      icon: CardSim,
    },
    {
      title: "Voices",
      url: "/voices",
      icon: AudioLines,
    },
  ],
  NavPayment: [
    {
      title: "Billing & Credits",
      url: "/billing-credits",
      icon: CreditCard,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">LOGO HERE</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
        <NavPayment items={data.NavPayment} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
