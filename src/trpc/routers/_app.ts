import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { studioRouter } from "@/modules/studio/server/procedures";
import { videosRouter } from "@/modules/videos/server/procedures";
export const appRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  categories: categoriesRouter,
  studio: studioRouter,
  videos: videosRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
