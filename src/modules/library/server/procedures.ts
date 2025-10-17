
import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { DEFAULT_PAGE_LIMIT } from "@/constants";

export const libraryRouter = createTRPCRouter({

    getMany: protectedProcedure.input(z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_PAGE_LIMIT),
        })).query(async ({ctx, input}) => {
            const data = await ctx.db.find({
                collection: "orders",
                depth: 0,
                page: input.cursor,
                limit: input.limit,
                where: {
                    user: {
                        equals: ctx.session.user.id
                    }
                }
            });

            const productIds = data.docs.map((doc) => doc.products);
            
            const products = await ctx.db.find({
                collection: "products",
                depth: 0,
                where: {
                    id: {
                        in: productIds
                    }
                }
            });
            return {
                ...products,
                docs: products.docs.map((doc) => ({
                    ...doc,
                    image: doc.image as Media | null,
                    tenant: doc.tenant as Tenant & {image: Media | null}
                }))
            };
    })
})

