"use client";

import MuxPlayer from "@mux/mux-player-react";
import React from "react";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  authPlay?: boolean;
  onPlay?: () => void;
}

const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  authPlay,
  onPlay,
}: VideoPlayerProps) => {
  return (
    <MuxPlayer
      playbackId={playbackId || ""}
      poster={thumbnailUrl || "/placeholder.svg"}
      playerInitTime={0}
      autoPlay={authPlay}
      thumbnailTime={0}
      className="w-full h-full object-contain"
      accentColor="#FF2056"
      onPlay={onPlay}
    ></MuxPlayer>
  );
};

export default VideoPlayer;
