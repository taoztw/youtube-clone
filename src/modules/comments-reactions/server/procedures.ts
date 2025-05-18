import { db } from "@/db";
import { commentReactions } from "@/db/schema/comments.reactions.schema";
import { videoReactions } from "@/db/schema/video.reactions.schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const commentReactionsRouter = createTRPCRouter({
	like: protectedProcedure.input(z.object({ commentId: z.string().uuid() })).mutation(async ({ ctx, input }) => {
		const { id: userId } = ctx.user;
		const { commentId } = input;

		console.log("comment_id", commentId);
		const [existingCommentReactions] = await db
			.select()
			.from(commentReactions)
			.where(
				and(
					eq(commentReactions.userId, userId),
					eq(commentReactions.commentId, commentId),
					eq(commentReactions.type, "like")
				)
			);

		// 不返回错误 防止trpc重试
		if (existingCommentReactions) {
			const [deleteCommentReaction] = await db
				.delete(commentReactions)
				.where(and(eq(commentReactions.userId, userId), eq(commentReactions.commentId, commentId)))
				.returning();

			return deleteCommentReaction;
		}

		const [createdCommentReactions] = await db
			.insert(commentReactions)
			.values({ userId, commentId, type: "like" })
			.onConflictDoUpdate({
				target: [commentReactions.commentId, commentReactions.userId],
				set: {
					type: "like"
				}
			})
			.returning();

		return createdCommentReactions;
	}),
	dislike: protectedProcedure.input(z.object({ commentId: z.string().uuid() })).mutation(async ({ ctx, input }) => {
		const { id: userId } = ctx.user;
		const { commentId } = input;

		const [existingCommentReactionsDislike] = await db
			.select()
			.from(commentReactions)
			.where(
				and(
					eq(commentReactions.userId, userId),
					eq(commentReactions.commentId, commentId),
					eq(commentReactions.type, "dislike")
				)
			);

		// 不返回错误 防止trpc重试
		if (existingCommentReactionsDislike) {
			const [deleteCommentReaction] = await db
				.delete(commentReactions)
				.where(and(eq(commentReactions.userId, userId), eq(commentReactions.commentId, commentId)))
				.returning();
			return deleteCommentReaction;
		}

		const [createdCommentReactionsDislike] = await db
			.insert(commentReactions)
			.values({ userId, commentId, type: "dislike" })
			.onConflictDoUpdate({
				target: [commentReactions.commentId, commentReactions.userId],
				set: {
					type: "dislike"
				}
			})
			.returning();

		return createdCommentReactionsDislike;
	})
});
