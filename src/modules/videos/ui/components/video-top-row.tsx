import React from "react";
import { VideoGetOneOutput } from "../../types";
import VideoOwner from "./video-owner";
import VideoMenu from "./video-menu";
import VideoReactions from "./video-reactions";
import VideoDescription from "./video-description";

interface VideoTopRowProps {
  video: VideoGetOneOutput;
}

const VideoTopRow = ({ video }: VideoTopRowProps) => {
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
      <VideoDescription description={video.description} />
    </div>
  );
};

export default VideoTopRow;
