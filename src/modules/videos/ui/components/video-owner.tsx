import React from "react";
import { VideoGetOneOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import SubscriptionButton from "@/modules/subscriptions/ui/components/subscription-button";
import UserInfo from "@/modules/users/ui/components/user-info";

interface VideoOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: string;
}

const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId: clerkUserId } = useAuth();
  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
      <Link href={`/users/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar size="lg" imgUrl={user.imageUrl} name={user.name} />
          <div className="flex flex-col gap-1">
            <UserInfo name={user.name} size="lg" />
            <span className="text-sm text-muted-foreground line-clamp-1 flex">
              {0} subscribers
            </span>
          </div>
        </div>
      </Link>

      {clerkUserId === user.id ? (
        <Button className="rounded-full" variant="secondary" asChild>
          <Link href={`/studio/videos/${videoId}`}>Edit Video</Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={() => {}}
          disabled={false}
          isSubscribed={false}
          className="flex-none"
        />
      )}
    </div>
  );
};

export default VideoOwner;
