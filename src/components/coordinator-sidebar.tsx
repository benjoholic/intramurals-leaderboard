"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  IconHome,
  IconUsers,
  IconCalendar,
  IconSwitchHorizontal,
  IconTrophy,
  IconReport,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react"

import { NavUser } from "@/components/nav-user"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function CoordinatorSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() || ""

  const user = {
    name: "Coordinator",
    email: "coordinator@example.com",
    avatar: "/avatars/placeholder.png",
  }

  const items = [
    { title: "Dashboard", icon: IconHome, url: "/coordinator/dashboard" },
    { title: "Teams", icon: IconUsers, url: "/coordinator/teams" },
    { title: "Events", icon: IconCalendar, url: "/coordinator/events" },
    { title: "Matches", icon: IconSwitchHorizontal, url: "/coordinator/matches" },
    { title: "Standings", icon: IconTrophy, url: "/coordinator/standings" },
    { title: "Reports", icon: IconReport, url: "/coordinator/reports" },
    { title: "Settings", icon: IconSettings, url: "/coordinator/settings" },
  ]

  return (
    <Sidebar collapsible="offcanvas" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/coordinator/dashboard">
                <span className="text-base font-semibold">Intramurals</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {items.map((it) => {
            const isActive = pathname === it.url || pathname.startsWith(it.url + "/")

            return (
              <SidebarMenuItem key={it.title}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <a href={it.url} className={isActive ? "flex items-center gap-3 px-4 py-3 rounded-full bg-emerald-600 text-white shadow-md" : "flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"}>
                    <it.icon />
                    <span>{it.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-3">
          <NavUser user={user} />
          <div className="mt-3">
            <a href="/admin/logout" className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border text-sm">
              <IconLogout />
              <span>Sign Out</span>
            </a>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
