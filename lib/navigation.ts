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

export const sidebarData = {
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
  navPayment: [
    {
      title: "Billing & Credits",
      url: "/billing-credits",
      icon: CreditCard,
    },
  ],
} as const
