import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ListPlusIcon,
  MoreVertical,
  ShareIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

interface VideoMenuProps {
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
}

const VideoMenu = ({ videoId, variant, onRemove }: VideoMenuProps) => {
  const onShare = () => {
    const fullUrl = `${
      process.env.VERCEL_URL || "http://localhost:3000"
    }/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Link copied to clipboard");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className="rounded-full" size="icon">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => onShare()}>
          <ShareIcon className="mr-2 size-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <ListPlusIcon className="mr-2 size-4" />
          Add to Playlist
        </DropdownMenuItem>
        {onRemove && (
          <DropdownMenuItem onClick={() => {}}>
            <Trash2Icon className="mr-2 size-4" />
            Remove
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VideoMenu;
