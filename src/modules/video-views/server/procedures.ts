import { db } from "@/db";
import { videoViews } from "@/db/schema/videoView.schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videoViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      const [existingVideoView] = await db
        .select()
        .from(videoViews)
        .where(
          and(eq(videoViews.userId, userId), eq(videoViews.videoId, videoId))
        );

      // 不返回错误 防止trpc重试
      if (existingVideoView) {
        return existingVideoView;
      }

      const [createdVideoView] = await db
        .insert(videoViews)
        .values({ videoId, userId })
        .returning();

      return createdVideoView;
    }),
});
