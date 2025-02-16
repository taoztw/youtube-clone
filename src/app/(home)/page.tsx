import { HydrateClient, trpc } from "@/trpc/server";
import Client from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
  void trpc.hello.prefetch({ text: "world" });
  return (
    <div>
      <HydrateClient>
        <Suspense fallback="loading...">
          <ErrorBoundary fallback={<div>error...</div>}>
            <Client />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </div>
  );
}
