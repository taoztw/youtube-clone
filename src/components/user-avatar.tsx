import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

const avatarVariants = cva("", {
  variants: {
    size: {
      default: "w-9 h-9",
      xs: "h-4 w-4 rounded-full",
      sm: "h-6 w-6",
      lg: "h-10 w-10",
      xl: "h-[160px] w-[160px]",
    },

    defaultVariants: {
      size: "default",
    },
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
  imgUrl: string;
  name: string;
  className?: string;
  onClick?: () => void;
}

export const UserAvatar = ({
  imgUrl,
  name,
  className,
  onClick,
  size,
}: UserAvatarProps) => {
  return (
    <Avatar
      className={cn(avatarVariants({ size, className }))}
      onClick={onClick}
    >
      <AvatarImage src={imgUrl} alt={name} />
    </Avatar>
  );
};
