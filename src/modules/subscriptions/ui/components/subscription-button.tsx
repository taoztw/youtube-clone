import React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface SubscriptionButtonProps {
  onClick: ButtonProps["onClick"];
  disabled: boolean;
  isSubscribed: boolean;
  className: string;
  size?: ButtonProps["size"];
}

const SubscriptionButton = ({
  onClick,
  disabled,
  isSubscribed,
  className,
  size,
}: SubscriptionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={isSubscribed ? "secondary" : "default"}
      size={size}
      className={cn(className, "rounded-full self-center")}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};

export default SubscriptionButton;
