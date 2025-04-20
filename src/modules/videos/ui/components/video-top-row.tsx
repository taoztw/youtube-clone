import React, { useMemo } from "react";
import { VideoGetOneOutput } from "../../types";
import VideoOwner from "./video-owner";
import VideoMenu from "./video-menu";
import VideoReactions from "./video-reactions";
import VideoDescription from "./video-description";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export const VideoTopRowSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-4/5 md:w-2/5" />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="flex items-center gap-3 w-[70%]">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-5 w-4/5 md:w-2/6" />
            <Skeleton className="h-5 w-3/5 md:w-1/5" />
          </div>
        </div>

        <Skeleton className="h-9 w-2/6 md:1/6 rounded-full" />
      </div>

      <div className="h-[120px] w-full"></div>
    </div>
  );
};

interface VideoTopRowProps {
  video: VideoGetOneOutput;
}

const VideoTopRow = ({ video }: VideoTopRowProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(video.viewCount);
  }, [video.viewCount]);

  const expandedViews = useMemo(() => {
    return Intl.NumberFormat("en").format(video.viewCount);
  }, [video.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(video.createAt, { addSuffix: true });
  }, [video.createAt]);

  const expandDate = useMemo(() => {
    return format(video.createAt, "d MMMM yyyy");
  }, [video.createAt]);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-bold">{video.title}</h1>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <VideoOwner user={video.user} videoId={video.id} />
        <div className="flex items-center overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
          <VideoReactions
            viewerReaction={video.viewerReaction}
            dislikes={video.dislikeCount}
            likes={video.likeCount}
            videoId={video.id}
          />
          <VideoMenu variant="secondary" videoId={video.id} />
        </div>
      </div>
      <VideoDescription
        description={video.description}
        compactViews={compactViews}
        expandedViews={expandedViews}
        compactDate={compactDate}
        expandDate={expandDate}
      />
    </div>
  );
};

export default VideoTopRow;
