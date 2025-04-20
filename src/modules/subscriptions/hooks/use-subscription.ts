import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

interface UseSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: UseSubscriptionProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const subscrible = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      toast.success("Subscribed successfully");

      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (error) => {
      toast.error("Failed to subscribe");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });
  const unSubscripble = trpc.subscriptions.remove.useMutation({
    onSuccess: () => {
      toast.success("Unsubscribed successfully");

      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (error) => {
      toast.error("Failed to unSubscribe");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });
  const isPending = subscrible.isPending || unSubscripble.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unSubscripble.mutate({ userId });
    } else {
      subscrible.mutate({ userId });
    }
  };

  return { isPending, onClick };
};
