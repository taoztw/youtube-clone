import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { commentInsertSchema } from "@/db/schema/comments.schema";
import { trpc } from "@/trpc/client";

interface CommentFormProps {
  videoId: string;
  onSuccess?: () => void;
}

function CommentForm({ videoId, onSuccess }: CommentFormProps) {
  const { user } = useUser();
  const clerk = useClerk();
  const utils = trpc.useUtils();
  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      form.reset();
      toast.success("Comment submitted successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Please sign in to comment.");
        clerk.openSignIn();
      } else {
        toast.error("Failed to submit comment. Please try again.");
      }
    },
  });
  const form = useForm<z.infer<typeof commentInsertSchema>>({
    resolver: zodResolver(commentInsertSchema.omit({ userId: true })),
    defaultValues: {
      videoId,
      value: "",
    },
  });

  function onSubmit(values: z.infer<typeof commentInsertSchema>) {
    create.mutate(values);
    // Simulate a successful submission
    setTimeout(() => {
      toast.success("Comment submitted successfully!");
      form.reset();
      onSuccess?.();
    }, 1000);
  }

  return (
    <Form {...form}>
      <form className="flex gap-4 group" onSubmit={form.handleSubmit(onSubmit)}>
        <UserAvatar
          size="lg"
          imgUrl={user?.imageUrl || "/placeholder.svg"}
          name={user?.username || "User"}
        />

        <div className="flex-1">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add a comment..."
                    className="resize-none bg-transparent overflow-hidden min-h-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="justify-end gap-2 mt-2 flex">
            <Button type="submit" size="sm" disabled={create.isPending}>
              Comment
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default CommentForm;
