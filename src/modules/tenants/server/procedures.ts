
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category, Tenant, Media } from "@/payload-types";
import z from "zod";
import { DEFAULT_PAGE_LIMIT } from "@/constants";
import { TRPCError } from "@trpc/server";

export const tenantsRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(z.object({
            slug: z.string(),
        }))
        .query(async ({ctx, input}) => {
      
          const data = await ctx.db.find({
                collection: "tenants",
                where: {
                    slug: {
                        equals: input.slug,
                    }
                },
                limit: 1,
                pagination: false
          });

          const tenant = data.docs[0];

          if(!tenant) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Tenant not found",
            });
          }

          return tenant as Tenant & {image: Media | null};
    })
})
