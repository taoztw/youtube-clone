import React from "react";
import { CommentsGetManyOutput } from "../../types";
import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	MessageSquareIcon,
	MoreVertical,
	ThumbsDownIcon,
	ThumbsUpIcon,
	Trash2Icon
} from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CommentForm from "./comments-form";
import CommentReply from "./comment-reply";

interface CommentItemProps {
	comment: CommentsGetManyOutput["items"][number];
	variant?: "reply" | "comment";
}

const CommentItem = ({ comment, variant = "comment" }: CommentItemProps) => {
	const clerk = useClerk();
	const utils = trpc.useUtils();

	const [isReplyOpen, setIsReplyOpen] = React.useState(false);
	const [isRepliesOpen, setIsRepliesOpen] = React.useState(false);

	const remove = trpc.comments.remove.useMutation({
		onSuccess: () => {
			toast.success("Comment deleted successfully!");
			utils.comments.getMany.invalidate({
				videoId: comment.videoId
			});
		},
		onError: error => {
			if (error.data?.code === "UNAUTHORIZED") {
				toast.error("Please sign in to delete the comment.");
				clerk.openSignIn();
			} else {
				toast.error("Failed to delete comment. Please try again.");
			}
		}
	});
	const like = trpc.commentReactions.like.useMutation({
		onSuccess: () => {
			toast.success("Comment liked successfully!");
			utils.comments.getMany.invalidate({
				videoId: comment.videoId
			});
		},
		onError: error => {
			if (error.data?.code === "UNAUTHORIZED") {
				toast.error("Please sign in to like the comment.");
				clerk.openSignIn();
			} else {
				toast.error("Failed to like comment. Please try again.");
			}
		}
	});
	const dislike = trpc.commentReactions.dislike.useMutation({
		onSuccess: () => {
			toast.success("Comment disliked successfully!");
			utils.comments.getMany.invalidate({
				videoId: comment.videoId
			});
		},
		onError: error => {
			if (error.data?.code === "UNAUTHORIZED") {
				toast.error("Please sign in to dislike the comment.");
				clerk.openSignIn();
			} else {
				toast.error("Failed to dislike comment. Please try again.");
			}
		}
	});
	const { userId } = useAuth();

	return (
		<div>
			<div className="flex gap-4">
				<Link href={`/users/${comment.userId}`}>
					<UserAvatar
						size={variant === "comment" ? "lg" : "sm"}
						imgUrl={comment.user.imageUrl}
						name={comment.user.name}
					/>
				</Link>

				<div className="flex-1 min-w-0">
					<Link href={`/users/${comment.userId}`}>
						<div className="flex items-center gap-2 mb-0.5">
							<span className="font-semibold text-sm pb-0.5">{comment.user.name}</span>

							<span className="text-xs text-muted-foreground">
								{formatDistanceToNow(comment.updatedAt, { addSuffix: true })}
							</span>
						</div>
					</Link>

					<p className="text-sm">{comment.value}</p>
					{/* Reactions */}
					<div className="flex items-center gap-2 mt-1">
						<div className="flex items-center">
							<Button
								disabled={false}
								variant="ghost"
								size="icon"
								className="size-8"
								onClick={() => {
									like.mutate({ commentId: comment.id });
								}}
							>
								<ThumbsUpIcon className={cn(comment.viewerReaction === "like") && "fill-black"} />
							</Button>
							<span className="text-muted-foreground text-xs">{comment.likeCount}</span>
							<Button
								disabled={false}
								variant="ghost"
								size="icon"
								className="size-8"
								onClick={() => {
									dislike.mutate({ commentId: comment.id });
								}}
							>
								<ThumbsDownIcon className={cn(comment.viewerReaction === "dislike") && "fill-black"} />
							</Button>
							<span className="text-muted-foreground text-xs">{comment.dislikeCount}</span>
						</div>
						{variant === "comment" && (
							<Button variant="ghost" size="sm" className="h-8" onClick={() => setIsReplyOpen(true)}>
								Reply
							</Button>
						)}
					</div>
				</div>

				<div>
					{(variant === "comment" || comment.user.clerkId === userId) && (
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="size-8">
									<MoreVertical className="text-muted-foreground" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
									<MessageSquareIcon className="size-4" />
									Reply
								</DropdownMenuItem>

								{comment.user.clerkId === userId && (
									<DropdownMenuItem
										onClick={() => {
											remove.mutate({ id: comment.id });
										}}
									>
										<Trash2Icon className="size-4" /> Delete
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
			{isReplyOpen && variant === "comment" && (
				<div className="mt-4 pl-14">
					<CommentForm
						videoId={comment.videoId}
						onSuccess={() => {
							setIsReplyOpen(false);
							setIsRepliesOpen(true);
						}}
						variant="reply"
						parentId={comment.id}
						onCancle={() => setIsReplyOpen(false)}
					/>
				</div>
			)}

			{comment.replyCount > 0 && variant === "comment" && (
				<div>
					<Button size="sm" variant="tertiary" onClick={() => setIsRepliesOpen(current => !current)}>
						{isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
						{comment.replyCount} replies
					</Button>
				</div>
			)}
			{comment.replyCount > 0 && variant === "comment" && isRepliesOpen && (
				<CommentReply parentId={comment.id} videoId={comment.videoId} />
			)}
		</div>
	);
};

export default CommentItem;
