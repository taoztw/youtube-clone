import HomeView from "@/modules/homes/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ categoryId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { categoryId } = await searchParams;
  // void trpc.hello.prefetch({ text: "world" });
  void trpc.categories.getMany.prefetch();
  return (
    <div>
      <HydrateClient>
        <HomeView categoryId={categoryId} />
        {categoryId}
      </HydrateClient>
    </div>
  );
}
