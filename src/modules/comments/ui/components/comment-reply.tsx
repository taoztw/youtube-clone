import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { CornerDownRightIcon, Loader2Icon } from "lucide-react";
import React from "react";
import CommentItem from "./comment-item";
import { Button } from "@/components/ui/button";

interface CommentReplyProps {
	parentId: string;
	videoId: string;
}

const CommentReply = ({ parentId, videoId }: CommentReplyProps) => {
	console.log("parentId", parentId);
	console.log("videoId", videoId);
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = trpc.comments.getMany.useInfiniteQuery(
		{
			limit: DEFAULT_LIMIT,
			videoId,
			parentId
		},
		{
			getNextPageParam: lastPage => {
				if (lastPage.nextCursor) {
					return {
						...lastPage.nextCursor,
						updatedAt: lastPage.nextCursor.updateAt // Map updateAt to updatedAt
					};
				}
				return null;
			}
		}
	);

	return (
		<div className="pl-14">
			<div className="flex flex-col gap-4 mt-2">
				{isLoading && <Loader2Icon className="text-muted-foreground size-6 animate-spin" />}
				{!isLoading &&
					data?.pages
						.flatMap(page => page.items)
						.map(comment => <CommentItem key={comment.id} comment={comment} variant="reply" />)}
			</div>
			{hasNextPage && (
				<Button variant="tertiary" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
					<CornerDownRightIcon />
					Show more replies
				</Button>
			)}
			{/* {JSON.stringify(data)} */}
		</div>
	);
};

export default CommentReply;
