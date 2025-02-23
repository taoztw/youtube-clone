import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import StudioNavbar from "../components/studio-navbar";
import StudioSideBar from "../components/studio-sidebar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const StudioLayout = ({ children }: HomeLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <StudioSideBar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudioLayout;
