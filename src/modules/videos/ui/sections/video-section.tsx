"use client";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VideoPlayer from "../components/video-player";
import { cn } from "@/lib/utils";
import VideoBanner from "../components/video-banner";
import VideoTopRow from "../components/video-top-row";

interface VideoSectionProps {
  videoId: string;
}

const VideoSection = ({ videoId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <ErrorBoundary fallback={<div>Error...</div>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black rounded-xl overflow-hidden relative",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={() => {}}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={"ad"} />
      <VideoTopRow video={video} />
    </>
  );
};

export default VideoSection;
