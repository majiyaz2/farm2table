
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";
import z from "zod";
import { DEFAULT_PAGE_LIMIT } from "@/constants";

export const tagsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(z.object({
            cursor: z.number().default(1),
            limit: z.number().default(DEFAULT_PAGE_LIMIT),
        }))
        .query(async ({ctx, input}) => {
      
          const data = await ctx.db.find({
                collection: "tags",
                page: input.cursor,
                limit: input.limit,
          });

          return data;
    })
})
