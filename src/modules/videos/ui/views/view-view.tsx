import React from "react";
import VideoSection from "../sections/video-section";

interface VideoViewProps {
  videoId: string;
}

const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10">
      {videoId}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <VideoSection videoId={videoId} />
        </div>

        <div className="w-[240px]"></div>
      </div>
    </div>
  );
};

export default VideoView;
