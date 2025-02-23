import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const StudioSidebarHeader = () => {
  const { user } = useUser();
  const { state } = useSidebar();

  if (!user)
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-[112px] rounded-full" />
        <div className="flex flex-col items-center mt-2 gap-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[180px]" />
        </div>
      </SidebarHeader>
    );

  if (state === "collapsed")
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Your profile">
          <Link href="/users/current">
            <UserAvatar
              imgUrl={user.imageUrl}
              name={user.fullName ?? "User"}
              size="xs"
            ></UserAvatar>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link href="/users/current">
        <UserAvatar
          name={user.fullName ?? "User"}
          imgUrl={user.imageUrl}
          className="size-[112px] hover:opacity-80 transition-opacity"
        />
      </Link>

      <div className="flex flex-col items-center justify-center mt-2">
        <p className="text-sm font-medium">Your profile</p>
        <p className="text-xs text-muted-foreground">{user.fullName}</p>
      </div>
    </SidebarHeader>
  );
};

export default StudioSidebarHeader;
