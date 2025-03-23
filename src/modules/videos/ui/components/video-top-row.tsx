import React, { useMemo } from "react";
import { VideoGetOneOutput } from "../../types";
import VideoOwner from "./video-owner";
import VideoMenu from "./video-menu";
import VideoReactions from "./video-reactions";
import VideoDescription from "./video-description";
import { format, formatDistanceToNow } from "date-fns";

interface VideoTopRowProps {
  video: VideoGetOneOutput;
}

const VideoTopRow = ({ video }: VideoTopRowProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(1000);
  }, []);

  const expandedViews = useMemo(() => {
    return Intl.NumberFormat("en").format(1000);
  }, []);

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
          <VideoReactions />
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
