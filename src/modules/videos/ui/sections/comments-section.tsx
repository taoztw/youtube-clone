"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import CommentItem from "@/modules/comments/ui/components/comment-item";
import CommentForm from "@/modules/comments/ui/components/comments-form";
import { trpc } from "@/trpc/client";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CommentsSectionProps {
  videoId: string;
}

const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  return (
    <Suspense fallback={<CommentsSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error...</div>}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CommentsSectionSkeleton = () => {
  return (
    <div className="mt-6 flex justify-center items-center">
      <Loader2Icon className="text-muted-foreground size-7 animate-spin" />
    </div>
  );
};

const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.nextCursor) {
          return {
            ...lastPage.nextCursor,
            updatedAt: lastPage.nextCursor.updateAt, // Map updateAt to updatedAt
          };
        }
        return null;
      },
    }
  );
  return (
    <div className="mt-5">
      <div className="flex flex-col gap-6">
        <h1 className="text-base font-bold">
          {comments.pages[0].totalCount} comments
        </h1>
        <CommentForm videoId={videoId} />

        <div className="flex flex-col gap-4 mt-2"></div>
        {comments.pages
          .flatMap((page) => page.items)
          .map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}

        <InfiniteScroll
          isManual
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          fetchNextPage={query.fetchNextPage}
        />
      </div>
    </div>
  );
};

export default CommentsSection;
