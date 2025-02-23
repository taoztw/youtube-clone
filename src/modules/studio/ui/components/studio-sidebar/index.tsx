"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import React from "react";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { LogOutIcon, VideoIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import StudioSidebarHeader from "./studio-sidebar-header";

const StudioSideBar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="pt-16 z-40" collapsible="icon">
      <SidebarContent className="bg-background">
        <Separator className="ml-3" />
        <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader />
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Videos"
                isActive={pathname === "/studio"}
              >
                <Link href="/">
                  <VideoIcon className="size-5" />
                  <span className="text-sm">Videos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarSeparator />

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Exit Studio">
                <Link href="/">
                  <LogOutIcon className="size-5" />
                  <span className="text-sm">Exit Studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default StudioSideBar;
