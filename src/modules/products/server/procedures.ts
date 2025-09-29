
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Where } from "payload";
import { z } from "zod";


export const productsRouter = createTRPCRouter({
    getMany: baseProcedure.input(z.object({
        category: z.string().nullable().optional(),
    })).query(async ({ctx, input}) => {

       const where:Where = {};
      
       where["category.slug"] = {
        equals: input.category
    };

        const data = await ctx.db.find({
            collection: "products",
            depth: 1,
            where
        });

       
      
          
        return data;
    })
})

