"use client";
import { Button } from "@/components/ui/button";
import { ClapperboardIcon, UserCircleIcon } from "lucide-react";
import React from "react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

const AuthButton = () => {
  // TODO 添加不同的auth states
  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="Studio"
              href="/studio"
              labelIcon={<ClapperboardIcon className="size-4" />}
            />
            <UserButton.Action label="manageAccount" />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none"
          >
            <UserCircleIcon />
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};

export default AuthButton;
