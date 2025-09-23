import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
    getMany: baseProcedure.query(() => {
      return [{hello: "world"}]  
    })
})
