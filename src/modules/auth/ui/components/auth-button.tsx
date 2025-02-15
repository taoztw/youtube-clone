import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";
import React from "react";

const AuthButton = () => {
  // TODO 添加不同的auth states
  return (
    <Button
      variant="outline"
      className="text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none"
    >
      <UserCircleIcon />
      Sign In
    </Button>
  );
};

export default AuthButton;
