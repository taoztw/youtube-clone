import { db } from "@/db";
import { videos } from "@/db/schema/videos.schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
  prompt: string;
}

// TODO: 暂不实现，原理和title类似

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { userId, videoId, prompt } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Video not found");
    }

    return existingVideo;
  });
  console.log(video, prompt);
  // const transcript = await context.run("get-transcript", async () => {
  //   const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
  //   console.log("trackUrl", trackUrl);
  //   const response = await fetch(trackUrl);

  //   const text = await response.text();
  //   if (!text) {
  //     throw new Error("Transcript is empty");
  //   }

  //   return text;
  // });

  // const title = await context.run("generate-title", async () => {
  //   const response = await openaiClient.chat.completions.create({
  //     messages: [
  //       { role: "system", content: TITLE_SYSTEM_PROMPT },
  //       {
  //         role: "user",
  //         content: transcript,
  //       },
  //     ],
  //     max_tokens: 4096,
  //     temperature: 0,
  //     top_p: 1,
  //     model: "gpt-4o",
  //   });

  //   if (!response.choices || response.choices.length === 0) {
  //     throw new Error("Failed to generate title");
  //   }

  //   return response.choices[0].message.content;
  // });

  // await context.run("update-video-title", async () => {
  //   // update video title
  //   if (!title) {
  //     throw new Error("Title is empty");
  //   }
  //   await db
  //     .update(videos)
  //     .set({ title })
  //     .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId!)));
  // });
});
