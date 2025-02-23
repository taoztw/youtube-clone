import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import AuthButton from "@/modules/auth/ui/components/auth-button";
import StudioUploadModal from "../studio-upload-modal";

const StudioNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-md">
      <div className="flex items-center gap-4 w-full">
        {/* logo */}
        <div className="flex items-center flex-shrink-0 gap-2">
          <SidebarTrigger />
          <Link href="/studio">
            <div className="flex items-center gap-1 ">
              <Image src="/logo.svg" alt="logo" width={50} height={50} />
              <p className="text-xl font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>

        {/*  */}
        <div className="flex flex-1"></div>

        <div className="flex-shrink-0 items-center flex gap-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default StudioNavbar;
