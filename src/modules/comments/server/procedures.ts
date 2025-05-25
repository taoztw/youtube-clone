import { db } from "@/db";
import { commentReactions } from "@/db/schema/comments.reactions.schema";
import { comments } from "@/db/schema/comments.schema";
import { users } from "@/db/schema/user.schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, inArray, isNotNull, isNull, lt, or } from "drizzle-orm";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
	remove: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
		const { id } = input;
		const { id: userId } = ctx.user;

		const [deletedComment] = await db
			.delete(comments)
			.where(and(eq(comments.id, id), eq(comments.userId, userId)))
			.returning();

		if (!deletedComment) {
			throw new TRPCError({ code: "NOT_FOUND" });
		}

		return deletedComment;
	}),
	create: protectedProcedure
		.input(z.object({ videoId: z.string().uuid(), value: z.string(), parentId: z.string().uuid().nullish() }))
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user;
			const { videoId, value, parentId } = input;

			// 数据库中选择当前评论的父级评论
			const [existingCommnet] = await db
				.select()
				.from(comments)
				.where(inArray(comments.id, parentId ? [parentId] : []));

			if (parentId && !existingCommnet) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			// 如果父级评论存在，且传入的parentId不为空，则抛出错误
			// 表示只允许两级的评论
			if (existingCommnet?.parentId && parentId) {
				throw new TRPCError({ code: "BAD_REQUEST" });
			}

			const [createdComment] = await db.insert(comments).values({ videoId, value, userId, parentId }).returning();

			return createdComment;
		}),
	getMany: baseProcedure
		.input(
			z.object({
				videoId: z.string().uuid(),
				parentId: z.string().uuid().nullish(),
				cursor: z.object({ id: z.string().uuid(), updatedAt: z.date() }).nullish(),
				limit: z.number().min(1).max(100).default(10)
			})
		)
		.query(async ({ input, ctx }) => {
			const { parentId, videoId, cursor, limit } = input;
			const { clerkUserId } = ctx;

			let userId;

			const [user] = await db
				.select()
				.from(users)
				// .where(clerkUserId ? eq(users.clerkId, clerkUserId) : undefined)
				.where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

			if (user) {
				userId = user.id;
			}

			const viewerReactions = db.$with("comment_reactions").as(
				db
					.select({
						commentId: commentReactions.commentId,
						type: commentReactions.type
					})
					.from(commentReactions)
					.where(inArray(commentReactions.userId, userId ? [userId] : []))
			);

			const replies = db.$with("replies").as(
				db
					.select({
						parentId: comments.parentId,
						count: count(comments.id).as("count")
					})
					.from(comments)
					.where(isNotNull(comments.parentId))
					.groupBy(comments.parentId)
			);

			const [totalData, commentsList] = await Promise.all([
				db
					.select({
						count: count()
					})
					.from(comments)
					.where(eq(comments.videoId, videoId)),

				db
					.with(viewerReactions, replies)
					.select({
						...getTableColumns(comments),
						viewerReaction: viewerReactions.type,
						user: users,
						replyCount: replies.count,
						likeCount: db.$count(
							commentReactions,
							and(eq(commentReactions.commentId, comments.id), eq(commentReactions.type, "like"))
						),
						dislikeCount: db.$count(
							commentReactions,
							and(eq(commentReactions.commentId, comments.id), eq(commentReactions.type, "dislike"))
						)
					})
					.from(comments)
					.where(
						and(
							eq(comments.videoId, videoId),
							parentId ? eq(comments.parentId, parentId) : isNull(comments.parentId),
							cursor
								? or(
										lt(comments.updatedAt, cursor.updatedAt),
										and(
											eq(comments.updatedAt, cursor.updatedAt), // 处理updatedAt相同的情况，通过id进行排序
											lt(comments.id, cursor.id)
										)
								  )
								: undefined
						)
					)
					.innerJoin(users, eq(comments.userId, users.id))
					.orderBy(desc(comments.updatedAt), desc(comments.id))
					.leftJoin(viewerReactions, eq(viewerReactions.commentId, comments.id))
					.leftJoin(replies, eq(comments.id, replies.parentId))
					.limit(limit + 1)
			]);
			// const [totalData] = await db
			//   .select({
			//     count: count(),
			//   })
			//   .from(comments)
			//   .where(eq(comments.videoId, videoId));

			const hasMore = commentsList.length > limit;
			const items = hasMore ? commentsList.slice(0, -1) : commentsList;

			const lastItem = items[items.length - 1];
			const nextCursor = hasMore ? { id: lastItem.id, updateAt: lastItem.updatedAt } : null;
			return {
				items,
				totalCount: totalData[0].count,
				nextCursor
			};
		})
});
